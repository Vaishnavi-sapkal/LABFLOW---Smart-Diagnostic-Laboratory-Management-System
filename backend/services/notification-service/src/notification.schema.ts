import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Notifications keep the recipient, delivery channel, message, delivery state, and send time so communications are auditable. */
@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, index: true })
  recipientId!: string;

  @Prop({ enum: ['email', 'sms', 'in_app'], required: true })
  channel!: string;

  @Prop({ required: true, trim: true })
  message!: string;

  @Prop({ enum: ['queued', 'sent', 'failed'], default: 'queued' })
  status!: string;

  @Prop()
  sentAt?: Date;
}

export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);
