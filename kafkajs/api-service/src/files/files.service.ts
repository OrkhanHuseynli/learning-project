import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileEntity } from "./entities/file.entity";
import { CreateFileDto } from "./dto/create-file.dto";
import { KafkaService } from "../kafka/kafka.service";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
    private kafkaService: KafkaService,
    private s3Service: S3Service
  ) {}

  async initialize() {
    // Subscribe to file.created topic to receive status updates
    await this.kafkaService.subscribe("file.created", async (payload) => {
      const message = JSON.parse(payload.message.value.toString());
      console.log("✓ Received file creation status:", message);
      await this.updateFileStatus(message);
    });
  }

  async create(createFileDto: CreateFileDto) {
    // Create database record with pending status
    const file = this.filesRepository.create({
      title: createFileDto.title,
      description: createFileDto.description,
      status: "pending",
    });

    const savedFile = await this.filesRepository.save(file);

    // Publish to Kafka
    await this.kafkaService.produce("file.create", [
      {
        fileId: savedFile.id,
        title: savedFile.title,
        description: savedFile.description,
        timestamp: new Date().toISOString(),
      },
    ]);

    return savedFile;
  }

  async findAll() {
    return this.filesRepository.find({
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number) {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  private async updateFileStatus(message: any) {
    const { fileId, s3Location, status, error } = message;

    await this.filesRepository.update(fileId, {
      status: status,
      s3_location: s3Location,
      updated_at: new Date(),
    });

    console.log(`✓ Updated file ${fileId} status to ${status}`);
  }

  async downloadFile(s3Location: string) {
    return this.s3Service.downloadFile(s3Location);
  }
}
