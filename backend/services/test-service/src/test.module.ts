import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from './test.controller';
import { HealthController } from './health.controller';
import { Test, TestSchema } from './test.schema';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_test'),
    MongooseModule.forFeature([{ name: Test.name, schema: TestSchema }]),
  ],
  controllers: [TestController, HealthController],
  providers: [TestService],
})
export class TestModule {}
