import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorModule } from './doctor.module';
import { Doctor, DoctorDocument } from './doctor.schema';

const SAMPLE_DOCTORS = [
  {
    fullName: 'Dr. Priya Sharma',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (Pathology)',
    registrationNumber: 'MCI-12847',
  },
  {
    fullName: 'Dr. Rahul Kapoor',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD (Endocrinology)',
    registrationNumber: 'MCI-24519',
  },
  {
    fullName: 'Dr. Anjali Roy',
    specialization: 'General Physician',
    qualification: 'MBBS, MD (General Medicine)',
    registrationNumber: 'MCI-37682',
  },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(DoctorModule);
  const doctorModel = app.get<Model<DoctorDocument>>(getModelToken(Doctor.name));
  await Promise.all(SAMPLE_DOCTORS.map(async (doctor) => {
    const existingDoctor = await doctorModel.findOne({ fullName: doctor.fullName }).exec();
    if (existingDoctor) {
      await doctorModel.findByIdAndUpdate(existingDoctor._id, { ...doctor, isActive: true }).exec();
    } else {
      // create() invokes the schema pre-save hook that generates LF-D-#####.
      await doctorModel.create({ ...doctor, isActive: true });
    }
  }));
  await app.close();
  console.log(`Seeded ${SAMPLE_DOCTORS.length} doctors.`);
}

seed().catch((error) => { console.error('Unable to seed doctors:', error); process.exitCode = 1; });
