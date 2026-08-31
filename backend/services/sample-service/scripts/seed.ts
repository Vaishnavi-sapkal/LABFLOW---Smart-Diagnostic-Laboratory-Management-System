import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SampleModule } from '../src/sample.module';
import { Sample, SampleDocument } from '../src/sample.schema';

const SAMPLES = [
  ['SMP-2408-001', 'Arjun Mehta', 'CBC', 'routine', 'collected', 'Rajan T.'],
  ['SMP-2408-004', 'Meena Joshi', 'Thyroid Profile', 'routine', 'collected', 'Meera K.'],
  ['SMP-2408-002', 'Sunita Patel', 'Lipid Profile', 'routine', 'in-transit', 'Meera K.'],
  ['SMP-2408-008', 'Anita Sharma', 'CRP', 'urgent', 'in-transit', 'Rajan T.'],
  ['SMP-2408-003', 'Vikram Singh', 'HbA1c + FBS', 'urgent', 'processing', 'Rajan T.'],
  ['SMP-2408-007', 'Deepak Rao', 'Vitamin D', 'routine', 'processing', 'Suresh P.'],
  ['SMP-2408-005', 'Rohit Desai', 'Liver Function', 'stat', 'completed', 'Suresh P.'],
  ['SMP-2408-006', 'Kavita Nair', 'Urine Routine', 'routine', 'completed', 'Meera K.'],
  ['SMP-2408-009', 'Pradeep Kumar', 'KFT', 'stat', 'rejected', 'Suresh P.'],
] as const;

async function seed() {
  const app = await NestFactory.createApplicationContext(SampleModule);
  const sampleModel = app.get<Model<SampleDocument>>(getModelToken(Sample.name));
  await sampleModel.bulkWrite(SAMPLES.map(([sampleId, patientName, testDisplayName, priority, status, handledBy], index) => ({
    updateOne: {
      filter: { sampleId },
      update: { $set: {
        sampleId, bookingId: `seed-booking-${index + 1}`, patientId: `seed-patient-${index + 1}`,
        patientName, testDisplayName, priority, status, handledBy,
        statusUpdatedAt: new Date(2024, 7, 1, 9 + index, index * 3),
        ...(status === 'rejected' ? { rejectionReason: 'Sample quality issue' } : {}),
      } },
      upsert: true,
    },
  })));
  await app.close();
  console.log(`Seeded ${SAMPLES.length} sample tracking records.`);
}

seed().catch((error) => { console.error('Unable to seed sample records:', error); process.exitCode = 1; });
