import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const NOTIFICATION_ROLES = ['admin', 'doctor', 'receptionist', 'lab_technician', 'patient'] as const;
export const NOTIFICATION_CATEGORIES = ['sample', 'verification', 'billing', 'registration', 'finance', 'report', 'booking'] as const;
export const NOTIFICATION_PRIORITIES = ['normal', 'urgent'] as const;
export const EMAIL_STATUSES = ['sent', 'failed', 'skipped'] as const;

export type NotificationRole = (typeof NOTIFICATION_ROLES)[number];
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];
export type EmailStatus = (typeof EMAIL_STATUSES)[number];
export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ trim: true, index: true })
  userId?: string;

  @Prop({ type: String, enum: NOTIFICATION_ROLES, index: true })
  role?: NotificationRole;

  @Prop({ trim: true, lowercase: true })
  recipientEmail?: string;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({ required: true, type: String, enum: NOTIFICATION_CATEGORIES, index: true })
  category!: NotificationCategory;

  @Prop({ type: String, enum: NOTIFICATION_PRIORITIES, default: 'normal', index: true })
  priority!: NotificationPriority;

  @Prop({ default: false, index: true })
  read!: boolean;

  @Prop({ type: String, enum: EMAIL_STATUSES, default: 'skipped', index: true })
  emailStatus!: EmailStatus;

  @Prop({ trim: true })
  emailError?: string;

  @Prop({ trim: true, index: true })
  relatedEntityId?: string;

  @Prop({ trim: true, index: true })
  relatedEntityType?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, role: 1, read: 1, createdAt: -1 });
