import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const defaultOrigins = [
    "http://80.78.243.22",
    "http://localhost:5173",
    "http://localhost:8081",
    "http://localhost:8082",
  ];
  const origins =
    process.env.FRONTEND_ORIGIN?.split(",").map((origin) => origin.trim()) ||
    defaultOrigins;

  app.enableCors({
    origin: origins,
    credentials: true,
  });

  const port = parseInt(process.env.PORT || "4002", 10);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
}
bootstrap();
