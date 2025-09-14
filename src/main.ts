import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { AppModule } from "./app.module"
import { env } from "process"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [env.FRONTEND_URL], // Allow multiple ports for development
    credentials: true,
  })

  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // app.setGlobalPrefix("api")

  await app.listen(3001)
  console.log("CRM Backend API is running on http://localhost:3001")
}
bootstrap()
