import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Bookings connect a patient with requested tests and appointment timing, while status and notes track operational progress. */
@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, index: true })
  patientId!: string;

  @Prop({ type: [String], required: true, default: [] })
  testIds!: string[];

  @Prop({ required: true })
  scheduledAt!: Date;

  @Prop({ enum: ['scheduled', 'checked_in', 'completed', 'cancelled'], default: 'scheduled' })
  status!: string;

  @Prop({ trim: true })
  notes?: string;
}

export type BookingDocument = HydratedDocument<Booking>;
export const BookingSchema = SchemaFactory.createForClass(Booking);
