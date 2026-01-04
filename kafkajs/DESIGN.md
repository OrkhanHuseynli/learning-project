# Distributed File Creation System - Design Document

## Overview

A microservices architecture demonstrating asynchronous file creation workflow using Kafka, S3 (LocalStack), and PostgreSQL.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           System Architecture                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────┐
│   API Service    │         │  File Service    │         │  LocalStack  │
│   (Port 3000)    │         │   (Port 3001)    │         │   (S3)       │
│                  │         │                  │         │              │
│  ┌────────────┐  │         │  ┌────────────┐  │         │  ┌────────┐  │
│  │ REST API   │  │         │  │  Consumer  │  │         │  │   S3   │  │
│  │ Controller │──┼────┐    │  │  (create)  │──┼────────▶│  │ Bucket │  │
│  └────────────┘  │    │    │  └────────────┘  │         │  └────────┘  │
│        │         │    │    │        │         │         │              │
│        ▼         │    │    │        ▼         │         └──────────────┘
│  ┌────────────┐  │    │    │  ┌────────────┐  │
│  │  Consumer  │  │    │    │  │  Producer  │  │
│  │  (status)  │  │    │    │  │  (notify)  │  │
│  └────────────┘  │    │    │  └────────────┘  │
│        │         │    │    │        │         │
│        ▼         │    │    │        │         │
│  ┌────────────┐  │    │    │        │         │
│  │ PostgreSQL │  │    │    │        │         │
│  │   Update   │  │    │    │        │         │
│  └────────────┘  │    │    │        │         │
└──────────────────┘    │    └────────┼─────────┘
                        │             │
                        │             │
                   ┌────▼─────────────▼────┐
                   │    Kafka (KRaft)      │
                   │                       │
                   │  Topics:              │
                   │  • file.create        │
                   │  • file.created       │
                   └───────────────────────┘
```

## Components

### 1. API Service (api-service)

**Port:** 3000  
**Technology:** NestJS + TypeScript  
**Database:** PostgreSQL

**Responsibilities:**

- Expose REST API for file creation requests
- Produce messages to `file.create` topic
- Consume messages from `file.created` topic
- Update PostgreSQL with file status and S3 location

**Endpoints:**

- `POST /files` - Create new file request
- `GET /files` - List all files
- `GET /files/:id` - Get file details

**Database Schema:**

```sql
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL, -- pending, processing, completed, failed
  s3_location VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. File Service (file-service)

**Port:** 3001  
**Technology:** NestJS + TypeScript  
**Storage:** LocalStack S3

**Responsibilities:**

- Consume messages from `file.create` topic
- Generate text file from title and description
- Upload file to S3 (LocalStack)
- Produce success message to `file.created` topic

**S3 Configuration:**

- Bucket: `file-storage-bucket`
- Endpoint: `http://localstack:4566`
- Region: `us-east-1`

### 3. Infrastructure Components

#### Kafka

- **Image:** confluentinc/cp-kafka:7.8.0
- **Mode:** KRaft (no Zookeeper)
- **Topics:**
  - `file.create` - File creation requests
  - `file.created` - File creation confirmations

#### PostgreSQL

- **Image:** postgres:16-alpine
- **Port:** 5432
- **Database:** filedb

#### LocalStack

- **Image:** localstack/localstack:latest
- **Port:** 4566
- **Services:** S3

## Message Schemas

### file.create Topic

```json
{
  "fileId": "number",
  "title": "string",
  "description": "string",
  "timestamp": "ISO-8601 datetime"
}
```

### file.created Topic

```json
{
  "fileId": "number",
  "title": "string",
  "s3Location": "string (s3://bucket/key)",
  "status": "completed | failed",
  "error": "string (optional)",
  "timestamp": "ISO-8601 datetime"
}
```

## Workflow

1. **User Request**

   - User sends POST request to `/files` with title and description
   - API Service creates database record with status "pending"
   - Returns file ID to user

2. **File Creation Request**

   - API Service publishes message to `file.create` topic
   - Message contains: fileId, title, description

3. **File Processing**

   - File Service consumes message from `file.create` topic
   - Generates text file with title and description
   - Uploads file to S3 bucket

4. **Success Notification**

   - File Service publishes message to `file.created` topic
   - Message contains: fileId, s3Location, status

5. **Status Update**
   - API Service consumes message from `file.created` topic
   - Updates database record with s3Location and status "completed"

## Error Handling

- **Kafka Connection Failures:** Retry with exponential backoff
- **S3 Upload Failures:** Publish failure event, update status to "failed"
- **Database Failures:** Log error, dead letter queue consideration
- **Message Processing Errors:** Log and skip, update status to "failed"

## Environment Variables

### API Service

```env
PORT=3000
DATABASE_URL=postgresql://user:password@postgres:5432/filedb
KAFKA_BROKERS=kafka:9092
KAFKA_CLIENT_ID=api-service
KAFKA_GROUP_ID=api-service-group
```

### File Service

```env
PORT=3001
KAFKA_BROKERS=kafka:9092
KAFKA_CLIENT_ID=file-service
KAFKA_GROUP_ID=file-service-group
AWS_ENDPOINT=http://localstack:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET=file-storage-bucket
```

## Development Setup

1. Start infrastructure:

   ```bash
   docker compose up -d
   ```

2. Initialize S3 bucket:

   ```bash
   aws --endpoint-url=http://localhost:4566 s3 mb s3://file-storage-bucket
   ```

3. Run database migrations:

   ```bash
   cd api-service
   npm run migration:run
   ```

4. Start API Service:

   ```bash
   cd api-service
   npm run start:dev
   ```

5. Start File Service:
   ```bash
   cd file-service
   npm run start:dev
   ```

## Testing the System

```bash
# Create a file
curl -X POST http://localhost:3000/files \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Document",
    "description": "This is a test document"
  }'

# Response: { "id": 1, "status": "pending" }

# Check file status
curl http://localhost:3000/files/1

# List all files
curl http://localhost:3000/files
```

## Monitoring

- **Kafka Topics:** Monitor message lag and throughput
- **S3 Storage:** Track file count and storage size
- **Database:** Monitor connection pool and query performance
- **Application Logs:** Centralized logging for both services

## Future Enhancements

1. Add Redis for caching file metadata
2. Implement dead letter queues for failed messages
3. Add file type support (PDF, DOCX, etc.)
4. Implement file expiration and cleanup
5. Add authentication and authorization
6. Implement rate limiting
7. Add Prometheus metrics and Grafana dashboards
8. Implement distributed tracing with OpenTelemetry
