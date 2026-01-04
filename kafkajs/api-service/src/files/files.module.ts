import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { FileEntity } from "./entities/file.entity";
import { S3Module } from "../s3/s3.module";

@Module({
  imports: [TypeOrmModule.forFeature([FileEntity]), S3Module],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
