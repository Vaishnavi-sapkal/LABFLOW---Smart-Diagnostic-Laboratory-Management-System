import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultController } from './result.controller';
import { HealthController } from './health.controller';
import { Result, ResultSchema } from './result.schema';
import { ResultService } from './result.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_result'),
    MongooseModule.forFeature([{ name: Result.name, schema: ResultSchema }]),
  ],
  controllers: [ResultController, HealthController],
  providers: [ResultService],
})
export class ResultModule {}
