import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationModule } from '../notification.module';
import { Notification, NotificationDocument } from '../notification.schema';

const NOTIFICATIONS = [
  ['admin', 'Sample overdue', 'Sample SMP-2408-014 is overdue for collection.', 'sample', 'urgent', 'SMP-2408-014'],
  ['admin', 'Verification rejected', 'A verification was rejected and requires follow-up.', 'verification', 'urgent', 'LF-2408-003'],
  ['admin', 'Payment confirmed', 'Payment INV-2408-101 has been confirmed.', 'billing', 'normal', 'INV-2408-101'],
  ['admin', 'New patient registered', 'A new patient registration is awaiting review.', 'registration', 'normal', 'PAT-2408-021'],
  ['admin', 'Revenue target alert', 'Today\'s revenue is below the expected target.', 'finance', 'urgent', 'REV-2024-08-01'],
  ['doctor', 'Results awaiting verification', 'CBC results are ready for your verification.', 'verification', 'urgent', 'LF-2408-001'],
  ['doctor', 'Result available for review', 'HbA1c results have been submitted for review.', 'report', 'normal', 'RES-2408-031'],
  ['receptionist', 'Payment confirmed', 'Payment has been received for booking BK-2408-010.', 'billing', 'normal', 'INV-2408-102'],
  ['receptionist', 'New booking created', 'A patient booking is scheduled for tomorrow morning.', 'booking', 'normal', 'BK-2408-010'],
  ['lab_technician', 'STAT sample pending', 'STAT sample SMP-2408-020 is pending collection.', 'sample', 'urgent', 'SMP-2408-020'],
  ['lab_technician', 'Sample overdue', 'Sample SMP-2408-014 requires immediate processing.', 'sample', 'urgent', 'SMP-2408-014'],
  ['lab_technician', 'Verification feedback', 'A submitted result needs correction after verification.', 'verification', 'normal', 'LF-2408-003'],
  ['patient', 'Report ready', 'Your laboratory report is ready for download.', 'report', 'normal', 'LF-2408-001'],
  ['patient', 'Appointment reminder', 'Your appointment is scheduled for tomorrow at 10:00 AM.', 'booking', 'normal', 'BK-2408-010'],
] as const;

async function seed() {
  const app = await NestFactory.createApplicationContext(NotificationModule);
  const model = app.get<Model<NotificationDocument>>(getModelToken(Notification.name));
  await model.bulkWrite(NOTIFICATIONS.map(([role, title, message, category, priority, relatedEntityId], index) => ({ updateOne: { filter: { role, title, relatedEntityId }, update: { $set: { role, title, message, category, priority, relatedEntityId, relatedEntityType: category, read: index === 2 } }, upsert: true } })));
  await app.close();
  console.log(`Seeded ${NOTIFICATIONS.length} notifications.`);
}

seed().catch((error) => { console.error('Unable to seed notifications:', error); process.exitCode = 1; });
