import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Kafka, Producer, Consumer, EachMessagePayload } from "kafkajs";

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private messageHandlers: Map<
    string,
    (payload: EachMessagePayload) => Promise<void>
  > = new Map();
  private isConsumerRunning = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID || "api-service",
      brokers: (process.env.KAFKA_BROKER || "localhost:29092").split(","),
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_GROUP_ID || "api-service-group",
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
      eachMessage: async (payload: EachMessagePayload) => {
        const handler = this.messageHandlers.get(payload.topic);
        if (handler) {
          await handler(payload);
        }
      },
    });

    this.isConsumerRunning = true;
    console.log("✓ Kafka consumer started");
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
        // No key = round-robin distribution across partitions
        key: null,
      })),
    });
    console.log(`✓ Produced ${messages.length} message(s) to topic: ${topic}`);
  }

  async subscribe(
    topic: string,
    handler: (payload: EachMessagePayload) => Promise<void>
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
