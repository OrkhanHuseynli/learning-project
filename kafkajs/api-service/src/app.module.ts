import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KafkaModule } from "./kafka/kafka.module";
import { FilesModule } from "./files/files.module";
import { FileEntity } from "./files/entities/file.entity";
import { KafkaService } from "./kafka/kafka.service";
import { FilesService } from "./files/files.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST || "localhost",
      port: parseInt(process.env.DATABASE_PORT || "5432"),
      username: process.env.DATABASE_USER || "fileuser",
      password: process.env.DATABASE_PASSWORD || "filepass",
      database: process.env.DATABASE_NAME || "filedb",
      entities: [FileEntity],
      synchronize: false,
      logging: false,
    }),
    KafkaModule,
    FilesModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private kafkaService: KafkaService,
    private filesService: FilesService
  ) {}

  async onModuleInit() {
    // Connect to Kafka
    await this.kafkaService.connect();

    // Initialize files service (subscribes to topics)
    await this.filesService.initialize();

    // Start consumer
    await this.kafkaService.startConsumer();
  }
}
