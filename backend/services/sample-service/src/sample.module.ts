import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SampleController } from './sample.controller';
import { HealthController } from './health.controller';
import { Sample, SampleSchema } from './sample.schema';
import { SampleService } from './sample.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_sample'),
    MongooseModule.forFeature([{ name: Sample.name, schema: SampleSchema }]),
  ],
  controllers: [SampleController, HealthController],
  providers: [SampleService],
})
export class SampleModule {}
