import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private messageHandlers: Map<
    string,
    (
      payload: EachMessagePayload,
      heartbeat: () => Promise<void>
    ) => Promise<void>
  > = new Map();
  private isConsumerRunning = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || "file-service",
      brokers: (process.env.KAFKA_BROKER || "localhost:29092").split(","),
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || "file-service-group",
    });
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
    console.log("✓ Kafka producer and consumer connected");
  }

  async startConsumer() {
    if (this.isConsumerRunning) {
      return;
    }

    await this.consumer.run({
      autoCommit: false, // Manual commit: only commit after successful processing
      // Default: processes all assigned partitions concurrently
      // With 3 partitions and 1 consumer, all 3 will be processed in parallel
      // Each partition processes 1 message at a time (Kafka guarantee)
      eachMessage: async (payload: EachMessagePayload) => {
        console.log(
          `📨 Received message from partition ${payload.partition}, offset ${payload.message.offset}`
        );

        const handler = this.messageHandlers.get(payload.topic);
        if (handler) {
          try {
            // Process the message (pass heartbeat for long-running tasks)
            await handler(payload, payload.heartbeat);

            // Only commit offset after successful processing
            await this.consumer.commitOffsets([
              {
                topic: payload.topic,
                partition: payload.partition,
                offset: (parseInt(payload.message.offset) + 1).toString(),
              },
            ]);

            console.log(
              `✅ Committed offset ${payload.message.offset} for partition ${payload.partition}`
            );
          } catch (error) {
            console.error(
              `❌ Processing failed for partition ${payload.partition}, offset ${payload.message.offset}:`,
              error.message
            );
            console.error(
              "   Offset NOT committed - message will be redelivered on restart"
            );
            // Don't commit offset - Kafka will redeliver this message
            throw error;
          }
        }
      },
    });

    this.isConsumerRunning = true;
    console.log(
      "✓ Kafka consumer started (manual commit mode, handling all assigned partitions concurrently)"
    );
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
    console.log("✓ Kafka producer and consumer disconnected");
  }

  async produce(topic: string, messages: any[]) {
    await this.producer.send({
      topic,
      messages: messages.map((msg) => ({
        value: JSON.stringify(msg),
        // No key = round-robin distribution (same as api-service)
        key: null,
      })),
    });
    console.log(`✓ Produced ${messages.length} message(s) to topic: ${topic}`);
  }

  async subscribe(
    topic: string,
    handler: (
      payload: EachMessagePayload,
      heartbeat: () => Promise<void>
    ) => Promise<void>
  ) {
    if (this.isConsumerRunning) {
      throw new Error(
        "Cannot subscribe after consumer has started. Subscribe before calling startConsumer()"
      );
    }

    await this.consumer.subscribe({ topic, fromBeginning: false });
    this.messageHandlers.set(topic, handler);
    console.log(`✓ Subscribed to topic: ${topic}`);
  }
}
