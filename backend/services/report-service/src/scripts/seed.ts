import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportModule } from '../report.module';
import { Report, ReportDocument } from '../report.schema';

const VALUES = [
  ['Hemoglobin', 14.2, 'g/dL', 13.0, 17.0], ['RBC Count', 4.8, 'million/µL', 4.5, 5.9],
  ['WBC Count', 7200, '/µL', 4000, 11000], ['Hematocrit', 42, '%', 40, 50], ['MCV', 87, 'fL', 80, 100],
  ['MCH', 29.5, 'pg', 27, 33], ['MCHC', 33.8, 'g/dL', 32, 36], ['Platelet Count', 250000, '/µL', 150000, 450000],
  ['RDW', 13, '%', 11.5, 14.5], ['Neutrophils', 58, '%', 40, 70], ['Lymphocytes', 32, '%', 20, 40], ['Monocytes', 7, '%', 2, 10],
] as const;

async function seed() {
  const app = await NestFactory.createApplicationContext(ReportModule);
  const reports = app.get<Model<ReportDocument>>(getModelToken(Report.name));
  const reportDate = new Date(2024, 7, 1, 10, 30);
  await reports.updateOne({ reportNo: 'LF-RPT-2408-001' }, { $set: {
    reportNo: 'LF-RPT-2408-001', verificationId: 'seed-verification-001', resultId: 'seed-result-001', sampleId: 'SMP-2408-001', patientId: 'seed-patient-001', doctorId: 'seed-doctor-priya',
    patientName: 'Arjun Mehta', patientAge: 34, patientGender: 'Male', patientDisplayId: 'LF-P-48222', sampleType: 'Whole Blood (EDTA)', collectionDate: new Date(2024, 7, 1, 8, 30), reportDate,
    testName: 'Complete Blood Count (CBC)', testCategory: 'Hematology Panel', testMethod: 'Automated Analyzer', allNormal: true,
    values: VALUES.map(([parameterName, value, unit, referenceMin, referenceMax]) => ({ parameterName, value, unit, referenceMin, referenceMax, flag: 'normal' })),
    doctorName: 'Dr. Priya Sharma', doctorQualification: 'MBBS, MD (Pathology)', doctorRegistrationNumber: 'MCI-12847', verifiedAt: reportDate, verificationUrl: 'https://labflow.in/verify/LF-RPT-2408-001',
  } }, { upsert: true });
  await app.close();
  console.log('Seeded 1 report.');
}

seed().catch((error) => { console.error('Unable to seed report:', error); process.exitCode = 1; });
