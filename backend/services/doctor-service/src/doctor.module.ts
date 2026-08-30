import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorController } from './doctor.controller';
import { HealthController } from './health.controller';
import { Doctor, DoctorSchema } from './doctor.schema';
import { DoctorService } from './doctor.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_doctor'),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
  ],
  controllers: [DoctorController, HealthController],
  providers: [DoctorService],
})
export class DoctorModule {}
