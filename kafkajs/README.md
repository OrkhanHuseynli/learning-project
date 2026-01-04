# Distributed File Creation System

A containerized microservices-based system demonstrating asynchronous file creation using Kafka, S3 (LocalStack), PostgreSQL, and Next.js UI.

## Architecture

- **API Service** (Port 3006): REST API for file requests, manages PostgreSQL, produces/consumes Kafka messages
- **File Service** (Port 3001): Consumes file creation requests, generates files, uploads to S3, notifies completion
- **UI** (Port 3004): Next.js web interface for creating and monitoring files
- **Kafka**: Message broker with KRaft mode (no Zookeeper)
- **PostgreSQL**: Stores file metadata and status
- **LocalStack**: S3-compatible storage for file storage

## Quick Start (Docker - Recommended)

### Option 1: Complete Setup (One Command)

```bash
./start.sh
```

This script will:

- Start all infrastructure (Kafka, PostgreSQL, LocalStack)
- Create Kafka topics
- Build all service images
- Run database migrations
- Start all services (API service auto-creates S3 bucket on startup)

Visit **http://localhost:3004** to use the UI!

### Option 2: Manual Docker Setup

```bash
# 1. Start all services (API service will auto-create S3 bucket)
docker compose up -d

# 2. Create Kafka topics
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic file.create --partitions 1 --replication-factor 1
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --if-not-exists --topic file.created --partitions 1 --replication-factor 1

# 3. Run database migrations
cd api-service && npm install && npm run migration:run
```

**Note:** The S3 bucket `file-storage-bucket` is automatically created by the API service on startup.

## Development Workflow

### Rebuild After Code Changes

When you modify code and want to update the running containers:

```bash
# Rebuild all services
./rebuild.sh

# Rebuild specific service
./rebuild.sh api-service
./rebuild.sh file-service
./rebuild.sh file-creation-ui
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api-service
docker compose logs -f file-service
docker compose logs -f file-creation-ui
```

### Stop All Services

```bash
docker compose down
```

## Quick Start (Local Development - Alternative)

### 1. Start Infrastructure

```bash
docker compose up -d kafka postgres-db localstack-s3
chmod +x setup.sh
./setup.sh
```

### 2. Setup API Service

```bash
cd api-service
npm install
npm run migration:run
npm run start:dev
```

API will be available at `http://localhost:3006`

### 3. Setup File Service

```bash
cd file-service
npm install
npm run start:dev
```

File Service will be available at `http://localhost:3001`

## Usage

### Create a File

```bash
curl -X POST http://localhost:3006/files \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Important Document",
    "description": "This document contains important information about the project"
  }'
```

Response:

```json
{
  "id": 1,
  "title": "My Important Document",
  "description": "This document contains important information about the project",
  "status": "pending",
  "s3_location": null,
  "created_at": "2026-01-03T00:00:00.000Z",
  "updated_at": "2026-01-03T00:00:00.000Z"
}
```

### Get File Status

```bash
curl http://localhost:3006/files/1
```

Response (after processing):

```json
{
  "id": 1,
  "title": "My Important Document",
  "description": "This document contains important information about the project",
  "status": "completed",
  "s3_location": "s3://file-storage-bucket/files/1_my_important_document_1704240000000.txt",
  "created_at": "2026-01-03T00:00:00.000Z",
  "updated_at": "2026-01-03T00:00:05.000Z"
}
```

### List All Files

```bash
curl http://localhost:3006/files
```

## Workflow

1. **User Request**: POST to `/files` creates database record with status "pending"
2. **Kafka Message**: API Service publishes to `file.create` topic
3. **File Processing**: File Service consumes message, generates text file
4. **S3 Upload**: File uploaded to LocalStack S3 bucket
5. **Success Notification**: File Service publishes to `file.created` topic
6. **Database Update**: API Service consumes message, updates status to "completed"

## Debugging

### Check Kafka Topics

```bash
docker exec kafka kafka-topics --bootstrap-server kafka:9092 --list
```

### Monitor Kafka Messages

```bash
# Monitor file creation requests
docker exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic file.create \
  --from-beginning

# Monitor file creation confirmations
docker exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic file.created \
  --from-beginning
```

### Check S3 Files

```bash
# List all files in bucket
docker exec localstack awslocal s3 ls s3://file-storage-bucket/files/

# Download a file
docker exec localstack awslocal s3 cp s3://file-storage-bucket/files/1_my_document_1704240000000.txt /tmp/
docker cp localstack:/tmp/1_my_document_1704240000000.txt .
```

### Check PostgreSQL

```bash
docker exec -it postgres psql -U fileuser -d filedb -c "SELECT * FROM files;"
```

## Cleanup

```bash
# Stop all services
docker compose down

# Remove volumes (deletes data)
docker compose down -v
```

## Environment Variables

### API Service (.env)

```env
PORT=3006
DATABASE_URL=postgresql://fileuser:filepass@localhost:5432/filedb
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=api-service
KAFKA_GROUP_ID=api-service-group
```

### File Service (.env)

```env
PORT=3001
KAFKA_BROKERS=localhost:29092
KAFKA_CLIENT_ID=file-service
KAFKA_GROUP_ID=file-service-group
AWS_ENDPOINT=http://localhost:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
S3_BUCKET=file-storage-bucket
```

## Troubleshooting

### Kafka Connection Issues

- Ensure Kafka is running: `docker ps | grep kafka`
- Check Kafka logs: `docker logs kafka`
- Use `localhost:29092` from host, `kafka:9092` from containers

### PostgreSQL Connection Issues

- Check if running: `docker exec postgres pg_isready -U fileuser -d filedb`
- Check logs: `docker logs postgres`

### LocalStack S3 Issues

- Verify LocalStack is running: `docker ps | grep localstack`
- Check logs: `docker logs localstack`
- Test S3: `docker exec localstack awslocal s3 ls`

## Project Structure

```
kafkajs/
├── docker-compose.yaml       # Infrastructure definition
├── setup.sh                   # Setup script
├── DESIGN.md                  # Architecture documentation
├── README.md                  # This file
├── api-service/               # API Service
│   ├── src/
│   │   ├── config/           # TypeORM configuration
│   │   ├── files/            # Files module (controller, service, entity)
│   │   ├── kafka/            # Kafka module
│   │   ├── migrations/       # Database migrations
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
└── file-service/             # File Service
    ├── src/
    │   ├── kafka/            # Kafka module
    │   ├── s3/               # S3 module
    │   ├── processor/        # File processor
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

## License

MIT
