import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestModule } from './test.module';
import { Test, TestDocument } from './test.schema';

const SAMPLE_TESTS = [
  { name: 'Complete Blood Count', code: 'CBC', category: 'Hematology', price: 480, turnaroundHours: 4, parameters: [
    { name: 'Hemoglobin', unit: 'g/dL', referenceMin: 13, referenceMax: 17 }, { name: 'Total RBC Count', unit: 'million/µL', referenceMin: 4.5, referenceMax: 5.5 },
    { name: 'Hematocrit (PCV)', unit: '%', referenceMin: 40, referenceMax: 50 }, { name: 'MCV', unit: 'fL', referenceMin: 83, referenceMax: 101 },
    { name: 'MCH', unit: 'pg', referenceMin: 27, referenceMax: 32 }, { name: 'MCHC', unit: 'g/dL', referenceMin: 31.5, referenceMax: 34.5 },
    { name: 'Total WBC Count', unit: 'cells/µL', referenceMin: 4000, referenceMax: 11000 }, { name: 'Neutrophils', unit: '%', referenceMin: 40, referenceMax: 75 },
    { name: 'Lymphocytes', unit: '%', referenceMin: 20, referenceMax: 45 }, { name: 'Monocytes', unit: '%', referenceMin: 2, referenceMax: 10 },
    { name: 'Eosinophils', unit: '%', referenceMin: 1, referenceMax: 6 }, { name: 'Platelet Count', unit: 'lakh/µL', referenceMin: 1.5, referenceMax: 4.5 },
  ] },
  { name: 'Liver Function Test', code: 'LFT', category: 'Biochemistry', price: 850, turnaroundHours: 6, fastingRequired: true },
  { name: 'Kidney Function Test', code: 'KFT', category: 'Biochemistry', price: 780, turnaroundHours: 6, fastingRequired: true },
  { name: 'Lipid Profile', code: 'LIPID', category: 'Biochemistry', price: 760, turnaroundHours: 6, fastingRequired: true },
  { name: 'Thyroid Function T3/T4/TSH', code: 'TFT', category: 'Endocrinology', price: 890, turnaroundHours: 8 },
  { name: 'HbA1c', code: 'HBA1C', category: 'Endocrinology', price: 580, turnaroundHours: 4 },
  { name: 'Fasting Blood Sugar', code: 'FBS', category: 'Biochemistry', price: 180, turnaroundHours: 2, fastingRequired: true },
  { name: 'Post-Prandial Blood Sugar', code: 'PPBS', category: 'Biochemistry', price: 180, turnaroundHours: 2 },
  { name: 'Vitamin D 25-OH', code: 'VIT_D', category: 'Vitamins', price: 1200, turnaroundHours: 24 },
  { name: 'Vitamin B12', code: 'VIT_B12', category: 'Vitamins', price: 980, turnaroundHours: 24 },
  { name: 'C-Reactive Protein', code: 'CRP', category: 'Immunology', price: 560, turnaroundHours: 6 },
  { name: 'ESR', code: 'ESR', category: 'Hematology', price: 220, turnaroundHours: 2 },
];

const SAMPLE_PACKAGES = [
  { name: 'Full Body Checkup', code: 'FULL_BODY', price: 3999, includedCodes: ['CBC', 'LFT', 'KFT', 'LIPID', 'TFT', 'FBS', 'VIT_D', 'VIT_B12'] },
  { name: 'Diabetes Profile', code: 'DIABETES', price: 1499, includedCodes: ['HBA1C', 'FBS', 'PPBS', 'KFT', 'LIPID'] },
  { name: 'Cardiac Risk Panel', code: 'CARDIAC', price: 1299, includedCodes: ['LIPID', 'CRP', 'CBC', 'FBS'] },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(TestModule);
  const testModel = app.get<Model<TestDocument>>(getModelToken(Test.name));

  await testModel.bulkWrite(
    SAMPLE_TESTS.map((test) => ({
      updateOne: {
        filter: { code: test.code },
        update: { $set: { ...test, fastingRequired: test.fastingRequired ?? false, isPackage: false, parameters: test.parameters ?? [] } },
        upsert: true,
      },
    })),
  );

  const insertedTests = await testModel.find({ code: { $in: SAMPLE_TESTS.map((test) => test.code) } }).select('_id code').exec();
  const idByCode = new Map(insertedTests.map((test) => [test.code, test._id.toString()]));
  await testModel.bulkWrite(
    SAMPLE_PACKAGES.map((testPackage) => ({
      updateOne: {
        filter: { code: testPackage.code },
        update: {
          $set: {
            name: testPackage.name,
            code: testPackage.code,
            category: 'Package',
            price: testPackage.price,
            turnaroundHours: 24,
            fastingRequired: false,
            isPackage: true,
            includedTestIds: testPackage.includedCodes.map((code) => idByCode.get(code)).filter((id): id is string => Boolean(id)),
          },
        },
        upsert: true,
      },
    })),
  );

  await app.close();
  console.log(`Seeded ${SAMPLE_TESTS.length} laboratory tests and ${SAMPLE_PACKAGES.length} packages.`);
}

seed().catch((error) => {
  console.error('Unable to seed test catalog:', error);
  process.exitCode = 1;
});
