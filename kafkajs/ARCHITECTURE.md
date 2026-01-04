# Distributed File Creation System - Architecture Documentation

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Technology Stack](#technology-stack)
- [Service Components](#service-components)
- [Data Flow](#data-flow)
- [Kafka Configuration](#kafka-configuration)
- [Scaling Strategy](#scaling-strategy)
- [Fault Tolerance](#fault-tolerance)
- [Monitoring & Progress Tracking](#monitoring--progress-tracking)
- [Deployment](#deployment)

---

## System Overview

A distributed, event-driven system for asynchronous file creation and processing. Users submit file creation requests via a web UI, which are processed by a scalable backend service using Kafka for message queuing and S3 for storage.

### Key Features

- ✅ **Asynchronous Processing**: Non-blocking file creation via Kafka messaging
- ✅ **Horizontal Scalability**: Multiple consumer instances processing in parallel
- ✅ **Fault Tolerance**: Manual offset commit prevents message loss on failures
- ✅ **Long-Running Tasks**: Heartbeat mechanism prevents session timeouts
- ✅ **Real-time Progress**: UI polls for status updates every 2 seconds
- ✅ **Partitioned Processing**: 3 Kafka partitions for concurrent workload distribution

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                   (Next.js + React + Tailwind)                  │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Create     │  │   View       │  │   Download   │        │
│  │   Files      │  │   Status     │  │   Files      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP REST API
                             │ (Polling every 2s)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                        API SERVICE                              │
│                    (NestJS + TypeORM)                           │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│  │   REST      │    │  Kafka      │    │ PostgreSQL  │       │
│  │   API       │───▶│  Producer   │    │  Database   │       │
│  │             │    │             │    │             │       │
│  │             │◀───│  Consumer   │───▶│  Status     │       │
│  └─────────────┘    └─────────────┘    └─────────────┘       │
│                             │                   ▲               │
└─────────────────────────────┼───────────────────┼───────────────┘
                              │                   │
                    file.create topic    file.created topic
                              │                   │
                              ↓                   │
┌─────────────────────────────────────────────────┼───────────────┐
│                      KAFKA CLUSTER                              │
│                      (KRaft Mode)                               │
│                                                                 │
│  Topic: file.create             Topic: file.created            │
│  ┌─────────────────────────────────────────────────────┐      │
│  │  Partition 0  │  Partition 1  │  Partition 2       │      │
│  │  Round-robin distribution across 3 partitions      │      │
│  └─────────────────────────────────────────────────────┘      │
└────────────────────────────┬────────────────────────────────────┘
                             │ Consumer Group: file-service-group
                             │ (2 instances)
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FILE SERVICE                                 │
│                 (NestJS + KafkaJS + AWS SDK)                    │
│                                                                 │
│  ┌──────────────────────┐       ┌──────────────────────┐      │
│  │  Instance 1          │       │  Instance 2          │      │
│  │  Partition 2         │       │  Partitions 0, 1     │      │
│  │                      │       │                      │      │
│  │ ┌────────────────┐  │       │ ┌────────────────┐  │      │
│  │ │ Kafka Consumer │  │       │ │ Kafka Consumer │  │      │
│  │ └────────┬───────┘  │       │ └────────┬───────┘  │      │
│  │          │          │       │          │          │      │
│  │ ┌────────▼───────┐  │       │ ┌────────▼───────┐  │      │
│  │ │  File          │  │       │ │  File          │  │      │
│  │ │  Processor     │  │       │ │  Processor     │  │      │
│  │ └────────┬───────┘  │       │ └────────┬───────┘  │      │
│  │          │          │       │          │          │      │
│  │ ┌────────▼───────┐  │       │ ┌────────▼───────┐  │      │
│  │ │ S3 Upload      │  │       │ │ S3 Upload      │  │      │
│  │ └────────┬───────┘  │       │ └────────┬───────┘  │      │
│  │          │          │       │          │          │      │
│  │ ┌────────▼───────┐  │       │ ┌────────▼───────┐  │      │
│  │ │ Kafka Producer │  │       │ │ Kafka Producer │  │      │
│  │ └────────────────┘  │       │ └────────────────┘  │      │
│  └──────────────────────┘       └──────────────────────┘      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   LOCALSTACK S3                                 │
│                 (Local S3-compatible storage)                   │
│                                                                 │
│  Bucket: file-creation-bucket                                  │
│  Files: file-{id}-{timestamp}.txt                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                           │
│                                                                 │
│  Table: files                                                  │
│  Columns: id, title, description, status,                      │
│           s3_location, created_at, updated_at                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **HTTP Polling**: Status updates every 2 seconds

### Backend Services

#### API Service

- **NestJS**: Node.js framework
- **TypeORM**: Database ORM
- **PostgreSQL**: Relational database
- **KafkaJS**: Kafka client library
- **Express**: HTTP server

#### File Service

- **NestJS**: Node.js framework
- **KafkaJS**: Kafka consumer/producer
- **AWS SDK v3**: S3 operations
- **LocalStack**: Local AWS emulation

### Infrastructure

- **Apache Kafka 7.8.0**: Message broker (KRaft mode)
- **PostgreSQL 16**: Persistent storage
- **LocalStack**: S3-compatible object storage
- **Docker Compose**: Container orchestration

---

## Service Components

### 1. API Service (`api-service/`)

**Port**: `3006`

**Responsibilities**:

- Expose REST API for file operations
- Create database records for new files
- Produce messages to Kafka (`file.create` topic)
- Consume status updates from Kafka (`file.created` topic)
- Update database with processing results
- Serve file downloads from S3

**Key Files**:

- `src/files/files.controller.ts` - REST endpoints
- `src/files/files.service.ts` - Business logic
- `src/kafka/kafka.service.ts` - Kafka producer/consumer
- `src/files/entities/file.entity.ts` - Database schema

**Database Schema**:

```typescript
{
  id: number; // Auto-increment primary key
  title: string; // File title (255 chars)
  description: string; // Optional description (text)
  status: string; // pending | processing | completed | failed
  s3_location: string; // S3 path (nullable)
  created_at: Date; // Auto-generated
  updated_at: Date; // Auto-updated
}
```

### 2. File Service (`file-service/`)

**Port**: `3001` (Instance 1), `3002` (Instance 2)

**Responsibilities**:

- Consume file creation requests from Kafka
- Generate file content
- Upload files to S3
- Send heartbeats during long processing
- Produce completion/failure events to Kafka
- Handle failures gracefully (no offset commit on error)

**Key Files**:

- `src/processor/file-processor.service.ts` - File processing logic
- `src/kafka/kafka.service.ts` - Kafka consumer/producer with manual commit
- `src/s3/s3.service.ts` - S3 operations

**Processing Flow**:

```typescript
1. Receive message from Kafka (file.create topic)
2. Parse fileId, title, description
3. Simulate 1-minute processing (6 × 10-second intervals)
4. Send heartbeat every 10 seconds (prevents timeout)
5. Generate file content
6. Upload to S3 → Get s3Location
7. Produce success event to file.created topic
8. Commit Kafka offset (message successfully processed)

On Error:
- Log error
- DON'T commit offset
- Message will be redelivered on restart
```

### 3. UI Service (`file-creation-ui/`)

**Port**: `3004`

**Responsibilities**:

- Render file creation form
- Display file list with status
- Auto-refresh status every 2 seconds
- Provide download links for completed files
- Show system statistics (pending/processing/completed counts)

**Key Features**:

- Auto-refresh toggle
- Real-time status updates via polling
- Color-coded status indicators
- Download button for completed files

---

## Data Flow

### Complete Request Flow

```
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: User Creates File                                       │
└──────────────────────────────────────────────────────────────────┘

User enters title + description → Clicks "Create File"
                 ↓
        POST /files HTTP request
                 ↓
        API Service receives request

┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: API Service Processes Request                           │
└──────────────────────────────────────────────────────────────────┘

① Create database record:
   INSERT INTO files (title, description, status)
   VALUES ('My File', 'Description', 'pending')
   → Returns fileId: 42

② Produce Kafka message:
   Topic: file.create
   Partition: Round-robin (0, 1, or 2)
   Message: {
     fileId: 42,
     title: 'My File',
     description: 'Description',
     timestamp: '2026-01-04T12:00:00Z'
   }

③ Return response to UI:
   { id: 42, title: 'My File', status: 'pending', ... }

┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: Kafka Distributes Message                               │
└──────────────────────────────────────────────────────────────────┘

Kafka receives message → Assigns to partition (round-robin)

Example: Message lands on Partition 1
         ↓
Consumer Group: file-service-group
         ↓
Instance 2 handles Partition 1 → Picks up message

┌──────────────────────────────────────────────────────────────────┐
│  STEP 4: File Service Processes                                  │
└──────────────────────────────────────────────────────────────────┘

Instance 2, Partition 1, Offset 15:

📨 Received message: { fileId: 42, ... }

🕐 Start 1-minute processing:
   00:00 - Start processing
   00:10 - ❤️ Heartbeat sent (prevents timeout)
   00:20 - ❤️ Heartbeat sent
   00:30 - ❤️ Heartbeat sent
   00:40 - ❤️ Heartbeat sent
   00:50 - ❤️ Heartbeat sent
   01:00 - ✅ Processing complete

📝 Generate file content:
   ===================
   GENERATED FILE
   ===================
   Title: My File
   Description: Description
   Generated at: 2026-01-04T12:01:00Z

☁️ Upload to S3:
   Bucket: file-creation-bucket
   Key: file-42-1704369660000.txt
   → s3Location: "file-42-1704369660000.txt"

📤 Produce success event:
   Topic: file.created
   Message: {
     fileId: 42,
     s3Location: "file-42-1704369660000.txt",
     status: "completed",
     timestamp: '2026-01-04T12:01:00Z'
   }

✅ Commit Kafka offset:
   Partition: 1, Offset: 16 (15 + 1)
   → Message marked as processed

┌──────────────────────────────────────────────────────────────────┐
│  STEP 5: API Service Updates Status                              │
└──────────────────────────────────────────────────────────────────┘

API Service consumes from file.created topic:

✓ Received: { fileId: 42, status: "completed", ... }

UPDATE files
SET status = 'completed',
    s3_location = 'file-42-1704369660000.txt',
    updated_at = NOW()
WHERE id = 42

✓ Database updated

┌──────────────────────────────────────────────────────────────────┐
│  STEP 6: UI Shows Updated Status                                 │
└──────────────────────────────────────────────────────────────────┘

UI polls every 2 seconds:
   GET /files → Fetches all files from database

File object returned:
{
  id: 42,
  title: 'My File',
  status: 'completed',     ← Updated from 'pending'
  s3_location: 'file-42-1704369660000.txt',
  created_at: '2026-01-04T12:00:00Z',
  updated_at: '2026-01-04T12:01:00Z'
}

UI updates display:
- Status badge: Yellow → Green
- Download button appears
- System stats: Completed count +1
```

---

## Kafka Configuration

### Topics

#### `file.create`

- **Partitions**: 3
- **Replication Factor**: 1
- **Purpose**: File creation requests from API → File Service
- **Message Key**: `null` (enables round-robin distribution)
- **Retention**: Default (7 days)

#### `file.created`

- **Partitions**: 3
- **Replication Factor**: 1
- **Purpose**: Processing results from File Service → API
- **Message Key**: `null`
- **Retention**: Default (7 days)

### Consumer Configuration

```typescript
// file-service/src/kafka/kafka.service.ts

consumer = kafka.consumer({
  groupId: "file-service-group", // All instances in same group
});

await consumer.run({
  autoCommit: false, // CRITICAL: Manual commit only

  eachMessage: async (payload) => {
    try {
      await handler(payload, payload.heartbeat);

      // Only commit offset after successful processing
      await consumer.commitOffsets([
        {
          topic: payload.topic,
          partition: payload.partition,
          offset: (parseInt(payload.message.offset) + 1).toString(),
        },
      ]);
    } catch (error) {
      // DON'T commit - Kafka will redeliver on restart
      throw error;
    }
  },
});
```

### Partition Distribution

**Round-Robin Strategy** (Key = `null`):

```
Message 1 → Partition 0
Message 2 → Partition 1
Message 3 → Partition 2
Message 4 → Partition 0  (cycles back)
Message 5 → Partition 1
Message 6 → Partition 2
...
```

**Consumer Assignment** (2 instances):

```
Instance 1: Partition 2
Instance 2: Partitions 0, 1

Total Capacity: 3 messages in parallel
```

### Heartbeat Mechanism

**Problem**: Long-running tasks (1 minute) exceed default session timeout (30s)

**Solution**: Send heartbeats every 10 seconds

```typescript
// During 1-minute processing
for (let i = 0; i < 6; i++) {
  await new Promise((resolve) => setTimeout(resolve, 10000)); // 10s
  await heartbeat(); // Tells Kafka: "I'm still alive!"
  console.log(`❤️ Heartbeat sent (${(i + 1) * 10}s elapsed)`);
}
```

**Without Heartbeat**:

```
00:00 - Start processing
00:30 - Session timeout → Kafka thinks consumer died
00:30 - Rebalance triggered → Message reassigned
00:30 - Another consumer picks up same message
Result: Duplicate processing
```

**With Heartbeat**:

```
00:00 - Start processing
00:10 - ❤️ Heartbeat → Session renewed
00:20 - ❤️ Heartbeat → Session renewed
00:30 - ❤️ Heartbeat → Session renewed (would have timed out)
00:40 - ❤️ Heartbeat → Session renewed
00:50 - ❤️ Heartbeat → Session renewed
01:00 - ✅ Processing complete → Commit offset
Result: No rebalance, clean processing
```

---

## Scaling Strategy

### Horizontal Scaling

**Current Setup**: 2 File Service instances

```bash
# docker-compose.yaml
file-service:
  deploy:
    replicas: 2  # Scale to 2 instances
```

**How Kafka Distributes Partitions**:

| Consumers    | Partition Assignment                                     |
| ------------ | -------------------------------------------------------- |
| 1 instance   | Instance 1: [0, 1, 2]                                    |
| 2 instances  | Instance 1: [2]<br>Instance 2: [0, 1]                    |
| 3 instances  | Instance 1: [0]<br>Instance 2: [1]<br>Instance 3: [2]    |
| 4+ instances | Max 3 active (one per partition)<br>Others idle (backup) |

**Maximum Concurrency**: 3 partitions = 3 messages processed in parallel

### Increasing Throughput

**Option 1: More Partitions** (Recommended)

```bash
# Update to 6 partitions
docker exec kafka kafka-topics --alter \
  --topic file.create \
  --partitions 6

# Scale to 6 instances
docker compose up -d --scale file-service=6
```

**Result**: 6 messages processed concurrently

**Option 2: Faster Processing**

- Remove artificial 1-minute delay
- Optimize S3 uploads
- Use multipart uploads for large files

**Option 3: Multiple Consumer Groups**

- Create separate consumer group for specific workloads
- E.g., `file-service-group-high-priority` for urgent files

### Vertical Scaling

```yaml
file-service:
  deploy:
    resources:
      limits:
        cpus: "2.0"
        memory: 2G
```

---

## Fault Tolerance

### Message Loss Prevention

**Strategy**: Manual offset commit only after successful processing

```typescript
✅ Success Path:
   Process message → Upload to S3 → Produce result → Commit offset

❌ Failure Path:
   Process message → Error → DON'T commit offset → Message redelivered
```

### Failure Scenarios

#### Scenario 1: File Service Crashes During Processing

```
State: Processing fileId 42, offset 15
       Uploaded to S3 ✓
       About to produce success event...
       💥 CRASH

Kafka State: Offset 15 NOT committed

On Restart:
- Kafka redelivers message at offset 15
- File processor runs again
- S3 upload happens again (overwrites previous)
- Success event produced
- Offset committed

Result: ✅ No data loss (at-least-once delivery)
```

#### Scenario 2: S3 Upload Fails

```
Error: S3 bucket not accessible

Response:
- Catch error
- Log: "❌ Error processing file 42"
- DON'T commit offset
- throw error

Result:
- Kafka marks message as unprocessed
- On restart, message redelivered
- Retry processing
```

#### Scenario 3: Kafka Producer Fails

```
State: File uploaded to S3 ✓
       Producing to file.created topic... 💥 NETWORK ERROR

Response:
- Exception thrown
- Offset NOT committed

Result:
- Message redelivered on restart
- File re-uploaded (S3 overwrite)
- Success event produced again
- Idempotent (same outcome)
```

### Rebalancing

**When Rebalance Happens**:

- New consumer joins the group
- Consumer leaves/crashes
- Partitions added to topic
- Consumer heartbeat timeout

**During Rebalance**:

```
1. Kafka pauses consumption
2. Reassigns partitions among consumers
3. Each consumer seeks to last committed offset
4. Consumption resumes

Example:
Before: Instance 1 [0,1,2]
        Instance 2 [none] (joins)
After:  Instance 1 [2]
        Instance 2 [0,1]
```

### Data Consistency

**Database State**:

- Status updated via Kafka events (eventually consistent)
- UI shows last committed state (may be slightly stale)
- 2-second polling ensures UI catches up quickly

**S3 State**:

- Files uploaded with unique keys: `file-{id}-{timestamp}.txt`
- Overwrite on retry (same fileId)
- No orphaned files

---

## Monitoring & Progress Tracking

### Status Flow

```
Database Status Transitions:

pending → completed   (Success path)
pending → failed      (Error path)

Note: "processing" status exists but not actively used
      (Could be set via separate Kafka event if needed)
```

### UI Polling Mechanism

```typescript
// Poll every 2 seconds
useEffect(() => {
  const interval = setInterval(() => {
    fetch("/files").then((data) => setFiles(data));
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

**Trade-offs**:

| Approach                     | Pros                                      | Cons                            |
| ---------------------------- | ----------------------------------------- | ------------------------------- |
| **HTTP Polling (Current)**   | Simple, stateless, load balancer friendly | 2s delay, more HTTP requests    |
| **WebSockets**               | Real-time, efficient                      | Complex, sticky sessions needed |
| **Server-Sent Events (SSE)** | Real-time, simpler than WS                | Unidirectional only             |

### Logging

**API Service Logs**:

```
✓ Received file creation request: { fileId: 42, ... }
✓ Produced 1 message(s) to topic: file.create
✓ Received file creation status: { fileId: 42, status: 'completed' }
✓ Updated file 42 status to completed
```

**File Service Logs**:

```
📨 Received message from partition 1, offset 15
KAFKA: ✓ Received file creation request: { fileId: 42, ... }
🕐 Starting 1-minute processing for file 42...
❤️  Heartbeat sent for file 42 (10s elapsed)
❤️  Heartbeat sent for file 42 (20s elapsed)
...
✅ 1-minute processing complete for file 42
✓ Produced 1 message(s) to topic: file.created
✅ Committed offset 15 for partition 1
✓ Successfully processed file 42
```

### Metrics to Monitor

1. **Kafka Consumer Lag**: Difference between produced and consumed offsets
2. **Processing Time**: Time from message received to offset committed
3. **Error Rate**: Failed messages / total messages
4. **Partition Balance**: Message distribution across partitions
5. **S3 Upload Success Rate**: Successful uploads / total attempts

---

## Deployment

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- 8GB RAM minimum

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd kafkajs

# Start all services
./start.sh

# Services will be available at:
# - UI:        http://localhost:3004
# - API:       http://localhost:3006
# - Kafka:     localhost:29092
# - PostgreSQL: localhost:5432
```

### Manual Setup

```bash
# 1. Start infrastructure
docker compose up -d kafka postgres-db localstack-s3

# 2. Create Kafka topics
docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --topic file.create --partitions 3 --replication-factor 1

docker exec kafka kafka-topics --bootstrap-server kafka:9092 \
  --create --topic file.created --partitions 3 --replication-factor 1

# 3. Run database migrations
cd api-service
npm install
npm run migration:run

# 4. Build and start services
docker compose up -d --build

# 5. Scale file-service to 2 instances
docker compose up -d --scale file-service=2
```

### Rebuilding After Code Changes

```bash
# Rebuild specific service
./rebuild.sh file-service

# Rebuild multiple services
./rebuild.sh api-service file-service

# Rebuild all
docker compose up -d --build
```

### Environment Variables

**API Service** (`.env`):

```bash
PORT=3006
DATABASE_HOST=postgres-db
DATABASE_PORT=5432
DATABASE_USER=fileuser
DATABASE_PASSWORD=filepass
DATABASE_NAME=filedb
KAFKA_BROKER=kafka:9092
S3_ENDPOINT=http://localstack-s3:4566
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

**File Service** (`.env`):

```bash
KAFKA_BROKER=kafka:9092
S3_ENDPOINT=http://localstack-s3:4566
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

**UI** (`.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3006
```

### Health Checks

```bash
# Check all services
docker compose ps

# Check Kafka topics
docker exec kafka kafka-topics --list --bootstrap-server kafka:9092

# Check consumer groups
docker exec kafka kafka-consumer-groups --list --bootstrap-server kafka:9092

# Check file-service instances
docker compose ps file-service

# View logs
docker compose logs -f file-service
docker compose logs -f api-service
```

---

## Useful Commands

### Kafka Operations

```bash
# List topics
docker exec kafka kafka-topics --list --bootstrap-server kafka:9092

# Describe topic
docker exec kafka kafka-topics --describe --topic file.create --bootstrap-server kafka:9092

# Consume messages
docker exec kafka kafka-console-consumer \
  --bootstrap-server kafka:9092 \
  --topic file.create \
  --from-beginning

# Check consumer lag
docker exec kafka kafka-consumer-groups \
  --bootstrap-server kafka:9092 \
  --describe \
  --group file-service-group

# Alter partitions (scale up only)
docker exec kafka kafka-topics --alter \
  --topic file.create \
  --partitions 6 \
  --bootstrap-server kafka:9092
```

### Database Operations

```bash
# Connect to PostgreSQL
docker exec -it postgres-db psql -U fileuser -d filedb

# Check files table
SELECT id, title, status, s3_location FROM files ORDER BY created_at DESC;

# Count by status
SELECT status, COUNT(*) FROM files GROUP BY status;
```

### S3 Operations

```bash
# List buckets
docker exec localstack-s3 awslocal s3 ls

# List files in bucket
docker exec localstack-s3 awslocal s3 ls s3://file-creation-bucket/

# Download file
docker exec localstack-s3 awslocal s3 cp \
  s3://file-creation-bucket/file-42-1704369660000.txt \
  /tmp/file.txt
```

### Service Management

```bash
# Scale file-service
docker compose up -d --scale file-service=3

# Restart service
docker compose restart file-service

# View logs (follow)
docker compose logs -f file-service

# Stop all services
docker compose down

# Remove volumes (clean slate)
docker compose down -v
```

---

## Performance Characteristics

### Throughput

**Current Setup** (3 partitions, 2 instances):

- **Parallel Processing**: 3 files simultaneously
- **Processing Time**: 1 minute per file (artificial delay)
- **Throughput**: ~3 files/minute

**Without Artificial Delay**:

- **Processing Time**: ~100-500ms per file
- **Throughput**: ~360-1800 files/minute

### Latency

- **API Response**: < 50ms (just creates DB record + Kafka message)
- **End-to-End**: ~1 minute (current), ~1-2 seconds (without delay)
- **UI Update**: 0-2 seconds (polling interval)

### Scalability Limits

| Component              | Current | Max Recommended |
| ---------------------- | ------- | --------------- |
| Partitions             | 3       | 10-20           |
| File Service Instances | 2       | = Partitions    |
| Concurrent Processing  | 3       | = Partitions    |
| UI Polling Clients     | N/A     | 1000+           |
| Database Connections   | 10      | 100             |

---

## Future Enhancements

### Short Term

- [ ] Add "processing" status tracking via separate Kafka event
- [ ] Implement actual retry logic with exponential backoff
- [ ] Add metrics/monitoring (Prometheus + Grafana)
- [ ] WebSocket support for real-time status updates
- [ ] File upload from UI (not just generation)

### Medium Term

- [ ] Dead Letter Queue (DLQ) for failed messages
- [ ] Distributed tracing (OpenTelemetry)
- [ ] Rate limiting on API endpoints
- [ ] User authentication & authorization
- [ ] File metadata (size, MIME type, tags)

### Long Term

- [ ] Multi-region deployment
- [ ] CDC (Change Data Capture) from PostgreSQL
- [ ] Event sourcing for audit trail
- [ ] GraphQL API alongside REST
- [ ] Kubernetes deployment with Helm charts

---

## Troubleshooting

### Consumer Not Receiving Messages

```bash
# Check consumer group status
docker exec kafka kafka-consumer-groups \
  --bootstrap-server kafka:9092 \
  --describe \
  --group file-service-group

# Look for:
# - LAG column (should be 0 or increasing slowly)
# - STATE column (should be "Stable")
```

### Rebalancing Loop

**Symptom**: Consumer keeps rejoining group

**Causes**:

- Session timeout during long processing → Fixed by heartbeats
- Consumer taking too long to poll → Increase `sessionTimeout`
- Network issues → Check Kafka connectivity

### Message Stuck in Partition

**Symptom**: Message not being processed

**Check**:

```bash
# View consumer lag
docker exec kafka kafka-consumer-groups \
  --bootstrap-server kafka:9092 \
  --describe \
  --group file-service-group

# If LAG > 0 and not decreasing:
# - Consumer might be crashed
# - Processing failed and offset not committed
```

**Solution**:

- Restart file-service: `docker compose restart file-service`
- Check logs for errors: `docker compose logs file-service`

### Status Not Updating in UI

**Check**:

1. File Service processed successfully? → Check logs
2. Success event produced? → `docker exec kafka kafka-console-consumer ...`
3. API Service consumed event? → Check API logs
4. Database updated? → `SELECT * FROM files WHERE id = X`
5. UI polling working? → Check browser network tab

---

## License

MIT

## Contributors

[Your Name]

## Last Updated

January 4, 2026
