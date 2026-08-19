import { NestFactory } from '@nestjs/core';
import { ResultModule } from './result.module';

async function bootstrap() {
  const app = await NestFactory.create(ResultModule);
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
