import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Res,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { Response } from "express";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(":id/download")
  async download(
    @Param("id", ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response
  ) {
    const file = await this.filesService.findOne(id);

    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }

    if (file.status !== "completed" || !file.s3_location) {
      throw new NotFoundException(`File is not ready for download`);
    }

    const { stream, contentType, contentLength } =
      await this.filesService.downloadFile(file.s3_location);

    res.set({
      "Content-Type": contentType,
      "Content-Length": contentLength,
      "Content-Disposition": `attachment; filename="${file.title}.txt"`,
    });

    return new StreamableFile(stream);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.filesService.findOne(id);
  }
}
