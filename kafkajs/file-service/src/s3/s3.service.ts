import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || "file-storage-bucket";

    this.s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT || "http://localhost:4566",
      region: process.env.S3_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
      },
      forcePathStyle: true, // Required for LocalStack
    });
  }

  async uploadFile(key: string, content: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ContentType: "text/plain",
    });

    await this.s3Client.send(command);

    const s3Location = `s3://${this.bucket}/${key}`;
    console.log(`✓ File uploaded to: ${s3Location}`);

    return s3Location;
  }

  generateFileName(fileId: number, title: string): string {
    const timestamp = Date.now();
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    return `files/${fileId}_${sanitizedTitle}_${timestamp}.txt`;
  }
}
