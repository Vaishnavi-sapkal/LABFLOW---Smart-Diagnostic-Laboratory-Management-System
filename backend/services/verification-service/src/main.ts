import { NestFactory } from '@nestjs/core';
import { VerificationModule } from './verification.module';

async function bootstrap() {
  const app = await NestFactory.create(VerificationModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
