import { Module, OnModuleInit } from "@nestjs/common";
import { KafkaModule } from "./kafka/kafka.module";
import { S3Module } from "./s3/s3.module";
import { ProcessorModule } from "./processor/processor.module";
import { KafkaService } from "./kafka/kafka.service";
import { FileProcessorService } from "./processor/file-processor.service";

@Module({
  imports: [KafkaModule, S3Module, ProcessorModule],
})
export class AppModule implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private fileProcessorService: FileProcessorService
  ) {}

  async onModuleInit() {
    // Connect to Kafka
    await this.kafkaService.connect();

    // Initialize processor (subscribes to topics)
    await this.fileProcessorService.initialize();

    // Start consumer
    await this.kafkaService.startConsumer();
  }
}
