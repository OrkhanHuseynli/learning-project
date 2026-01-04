import { Injectable } from "@nestjs/common";
import { KafkaService } from "../kafka/kafka.service";
import { S3Service } from "../s3/s3.service";

const MAX_RETRIES = 3;

@Injectable()
export class FileProcessorService {
  constructor(
    private kafkaService: KafkaService,
    private s3Service: S3Service
  ) {}

  async initialize() {
    // Subscribe to file.create topic
    await this.kafkaService.subscribe(
      "file.create",
      async (payload, heartbeat) => {
        const message = JSON.parse(payload.message.value.toString());
        console.log("KAFKA: ✓ Received file creation request:", message);
        await this.processFileCreation(message, heartbeat);
      }
    );
  }

  private async processFileCreation(
    message: any,
    heartbeat: () => Promise<void>
  ) {
    const { fileId, title, description } = message;

    try {
      console.log(`🕐 Starting 1-minute processing for file ${fileId}...`);

      // A Poison pill case
      if (title.toLowerCase().includes("error")) {
        console.log(
          `🕐 Received an error message =>  will fail on purpose : fileId : ${fileId}...`
        );
        throw new Error("Simulated processing error for testing");
      }
      // Artificial delay: 1 minute (60 seconds)
      // Send heartbeats every 10 seconds during the delay
      for (let i = 0; i < 6; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds
        await heartbeat();
        console.log(
          `❤️  Heartbeat sent for file ${fileId} (${(i + 1) * 10}s elapsed)`
        );
      }

      console.log(`✅ 1-minute processing complete for file ${fileId}`);

      // Generate file content
      const fileContent = this.generateFileContent(title, description);

      // Generate file name and upload to S3
      const fileName = this.s3Service.generateFileName(fileId, title);
      const s3Location = await this.s3Service.uploadFile(fileName, fileContent);

      // Send success message
      await this.kafkaService.produce("file.created", [
        {
          fileId,
          title,
          s3Location,
          status: "completed",
          timestamp: new Date().toISOString(),
        },
      ]);

      console.log(`✓ Successfully processed file ${fileId}`);
    } catch (error) {
      // Handle processing error
      retryFileProcessing(fileId, error);
      // Send failure message
      await this.kafkaService.produce("file.created", [
        {
          fileId,
          title,
          s3Location: null,
          status: "failed",
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }

  private generateFileContent(title: string, description: string): string {
    const header = "=".repeat(50);
    const content = `
${header}
GENERATED FILE
${header}

Title: ${title}

Description:
${description || "No description provided"}

${header}
Generated at: ${new Date().toISOString()}
${header}
    `.trim();

    return content;
  }
}
function retryFileProcessing(fileId: any, error: any) {
  console.error(`✗ Error processing file ${fileId}:`, error);
  console.log("Will do  RETRIES: MAX_RETRIES =", MAX_RETRIES);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `🔄 Retry attempt ${attempt} for file ${fileId} after error...`
      );
      // Here we could implement some backoff strategy if needed
      // For simplicity, we retry immediately
      // In a real-world scenario, consider exponential backoff
      // Re-attempt processing (for simplicity, we just throw again)
      throw error;
    } catch (retryError) {
      console.error(
        `✗ Retry attempt ${attempt} failed for file ${fileId}:`,
        retryError
      );
      if (attempt === MAX_RETRIES) {
        console.log(
          `✗ All retry attempts failed for file ${fileId}. Marking as failed.`
        );
      }
    }
  }
}
