import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VerificationModule } from '../verification.module';
import { Verification, VerificationDocument } from '../verification.schema';

const VERIFICATIONS = [
  ['LF-2408-001', 'seed-result-001', 'seed-sample-001', 'seed-patient-001', 'Arjun Mehta', 'seed-test-cbc', 'CBC', 'Rajan T.', 'routine'],
  ['LF-2408-003', 'seed-result-003', 'seed-sample-003', 'seed-patient-003', 'Vikram Singh', 'seed-test-hba1c-fbs', 'HbA1c + FBS', 'Rajan T.', 'urgent'],
  ['LF-2408-007', 'seed-result-007', 'seed-sample-007', 'seed-patient-007', 'Deepak Rao', 'seed-test-vitamin-d', 'Vitamin D', 'Suresh P.', 'routine'],
] as const;

async function seed() {
  const app = await NestFactory.createApplicationContext(VerificationModule);
  const verificationModel = app.get<Model<VerificationDocument>>(
    getModelToken(Verification.name),
  );

  await verificationModel.bulkWrite(
    VERIFICATIONS.map(([
      reportId,
      resultId,
      sampleId,
      patientId,
      patientName,
      testId,
      testName,
      technician,
      priority,
    ], index) => ({
      updateOne: {
        filter: { reportId },
        update: {
          $set: {
            reportId,
            resultId,
            sampleId,
            patientId,
            patientName,
            testId,
            testName,
            technician,
            doctorId: 'seed-doctor',
            priority,
            submittedAt: new Date(2024, 7, 1, 9 + index, index * 10),
            status: 'pending',
          },
        },
        upsert: true,
      },
    })),
  );

  await app.close();
  console.log(`Seeded ${VERIFICATIONS.length} verification records.`);
}

seed().catch((error) => {
  console.error('Unable to seed verification records:', error);
  process.exitCode = 1;
});
