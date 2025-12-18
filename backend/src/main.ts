import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Allow any origin by default so remote clients (e.g., admin panel) can reach the API.
  // If FRONTEND_ORIGIN is provided, use the comma-separated list instead.
  const origins =
    process.env.FRONTEND_ORIGIN?.split(",").map((origin) => origin.trim()) || true;

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
