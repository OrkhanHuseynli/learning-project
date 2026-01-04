import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  S3Client,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

@Injectable()
export class S3Service implements OnModuleInit {
  private s3Client: S3Client;
  private readonly bucketName = "file-storage-bucket";

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION || "us-east-1",
      endpoint: process.env.S3_ENDPOINT || "http://localhost:4566",
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      },
    });
  }

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists() {
    try {
      // Check if bucket exists
      await this.s3Client.send(
        new HeadBucketCommand({ Bucket: this.bucketName })
      );
      console.log(`✓ S3 bucket '${this.bucketName}' already exists`);
    } catch (error) {
      // Bucket doesn't exist, create it
      try {
        await this.s3Client.send(
          new CreateBucketCommand({ Bucket: this.bucketName })
        );
        console.log(`✓ Created S3 bucket '${this.bucketName}'`);
      } catch (createError) {
        console.error(`✗ Failed to create S3 bucket:`, createError);
        throw createError;
      }
    }
  }

  async downloadFile(key: string): Promise<{
    stream: Readable;
    contentType: string;
    contentLength: number;
  }> {
    // Extract the key from s3:// URI if needed
    let s3Key = key;
    if (key.startsWith("s3://")) {
      // Remove s3://bucket-name/ prefix
      s3Key = key.replace(`s3://${this.bucketName}/`, "");
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });

    const response = await this.s3Client.send(command);

    return {
      stream: response.Body as Readable,
      contentType: response.ContentType || "text/plain",
      contentLength: response.ContentLength || 0,
    };
  }
}
