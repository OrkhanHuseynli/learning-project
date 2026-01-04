import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the UI
  app.enableCors({
    origin: "http://localhost:3004",
    credentials: true,
  });

  const port = process.env.PORT || 3006;
  await app.listen(port);
  console.log(`\n🚀 API Service is running on: http://localhost:${port}`);
}
bootstrap();
