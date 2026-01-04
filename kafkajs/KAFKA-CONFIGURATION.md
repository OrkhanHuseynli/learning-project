# Kafka Configuration Summary

## Overview

This document describes the Kafka configuration for the distributed file creation system.

## Configuration Details

### 1. **Topics: 3 Partitions Each**

- `file.create`: 3 partitions
- `file.created`: 3 partitions

**Why 3 partitions?**

- Enables parallel processing of up to 3 messages simultaneously
- Each partition processes 1 message at a time (Kafka guarantee)
- Balances throughput with resource usage

### 2. **Message Distribution: Round-Robin**

- Producer sends messages with `key: null`
- Kafka distributes messages evenly across partitions in round-robin fashion
- **Example with 9 messages:**
  - Partition 0: Messages 1, 4, 7
  - Partition 1: Messages 2, 5, 8
  - Partition 2: Messages 3, 6, 9

**Code location:**

- `api-service/src/kafka/kafka.service.ts` - Line ~60
- `file-service/src/kafka/kafka.service.ts` - Line ~92

### 3. **Consumer: 1 Instance Handling All 3 Partitions**

- Single `file-service` instance
- Assigned all 3 partitions automatically by Kafka
- Processes partitions concurrently (async I/O, not parallel threads)

### 4. **Manual Offset Commit (Critical for Long Tasks)**

**Why manual commit?**

- Tasks can take a long time (e.g., large file uploads)
- If service crashes mid-processing with auto-commit:
  - Offset already committed ❌
  - Message lost forever ❌
  - File stuck in "pending" status ❌

**How it works:**

```typescript
await this.consumer.run({
  autoCommit: false, // Disable auto-commit
  eachMessage: async (payload) => {
    try {
      await processMessage(payload); // Process (might take minutes)
      await commitOffset(payload); // Only commit after success ✅
    } catch (error) {
      // Don't commit - Kafka will redeliver ✅
    }
  },
});
```

**Benefits:**

- ✅ Crash during processing → Message redelivered
- ✅ Failed processing → Message retried
- ✅ No message loss
- ✅ No stuck "pending" files

**Code location:**

- `file-service/src/kafka/kafka.service.ts` - `startConsumer()` method

## Processing Flow

### Normal Flow (Success):

```
1. Consumer receives message from Partition 0, offset 5
2. Start processing (upload to S3, etc.)
3. Processing completes successfully ✅
4. Commit offset 6
5. Immediately fetch next message from Partition 0
```

### Crash Scenario (Recovery):

```
1. Consumer receives message from Partition 0, offset 5
2. Start processing (50% complete)
3. 💥 Service crashes
4. Offset NOT committed (still at 5)
────────────────────────────────────────
5. Service restarts
6. Kafka: "Your last commit was offset 5"
7. Kafka redelivers same message ✅
8. Processing completes successfully
9. Commit offset 6
```

## Performance Characteristics

### With 9 Messages (5-minute tasks):

```
Partition 0: [Msg 1] → [Msg 4] → [Msg 7]
Partition 1: [Msg 2] → [Msg 5] → [Msg 8]
Partition 2: [Msg 3] → [Msg 6] → [Msg 9]

Timeline:
T=0:00   Msg 1, 2, 3 processing (3 concurrent)
T=5:00   Msg 4, 5, 6 processing
T=10:00  Msg 7, 8, 9 processing
T=15:00  All done ✅

Total: 15 minutes (vs 45 minutes sequential!)
```

## Scaling Options

### Option 1: Add More Partitions

```bash
# Increase to 10 partitions
docker exec kafka kafka-topics \
  --bootstrap-server kafka:9092 \
  --alter --topic file.create --partitions 10

# Result: Up to 10 messages concurrent
```

### Option 2: Add More Consumers

```yaml
# docker-compose.yml
services:
  file-service:
    replicas: 3 # 3 consumer instances

# With 3 partitions:
# Consumer 1 → Partition 0
# Consumer 2 → Partition 1
# Consumer 3 → Partition 2
```

### Option 3: Limit Concurrency (If Needed)

```typescript
await this.consumer.run({
  partitionsConsumedConcurrently: 2, // Only process 2 partitions at once
  // Useful for rate limiting or resource constraints
});
```

## Scripts

### Initial Setup (New System):

```bash
./start.sh
# Creates topics with 3 partitions automatically
```

### Update Existing Topics:

```bash
./update-partitions.sh
# Alters existing topics from 1 → 3 partitions
```

### Verify Configuration:

```bash
# List topics and partitions
docker exec kafka kafka-topics \
  --bootstrap-server kafka:9092 \
  --describe --topic file.create

# Check consumer group
docker exec kafka kafka-consumer-groups \
  --bootstrap-server kafka:9092 \
  --describe --group file-service-group
```

## Key Takeaways

1. **3 Partitions** = Up to 3 messages concurrent
2. **Round-Robin** = Even distribution
3. **Manual Commit** = No message loss on crashes
4. **1 Consumer** = Handles all 3 partitions via async concurrency
5. **Each Partition** = 1 message at a time (Kafka guarantee)
6. **Crash Recovery** = Uncommitted messages redelivered automatically

## Related Files

- `/kafkajs/start.sh` - Topic creation with 3 partitions
- `/kafkajs/update-partitions.sh` - Update existing topics
- `/kafkajs/api-service/src/kafka/kafka.service.ts` - Producer (round-robin)
- `/kafkajs/file-service/src/kafka/kafka.service.ts` - Consumer (manual commit)
