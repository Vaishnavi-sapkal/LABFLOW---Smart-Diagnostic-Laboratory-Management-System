import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientController } from './patient.controller';
import { HealthController } from './health.controller';
import { Patient, PatientSchema } from './patient.schema';
import { PatientService } from './patient.service';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/labflow_patient'),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
  ],
  controllers: [PatientController, HealthController],
  providers: [PatientService],
})
export class PatientModule {}
