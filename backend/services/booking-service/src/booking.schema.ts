import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BookingDocument = HydratedDocument<Booking>;

@Schema({ _id: false })
export class BookingItem {
  @Prop({ required: true })
  testId!: string;

  @Prop({ required: true })
  code!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;
}

export const BookingItemSchema = SchemaFactory.createForClass(BookingItem);

@Schema({ timestamps: true })
export class Booking {
  @Prop({ required: true, unique: true, index: true })
  bookingId!: string;

  @Prop({ required: true, index: true })
  patientId!: string;

  @Prop({ required: true, index: true })
  doctorId!: string;

  @Prop({ type: [BookingItemSchema], required: true, validate: [(items: BookingItem[]) => items.length > 0, 'At least one booking item is required'] })
  items!: BookingItem[];

  @Prop({ required: true, min: 0 })
  totalAmount!: number;

  @Prop({ required: true, index: true })
  scheduledDate!: Date;

  @Prop({ required: true })
  scheduledSlot!: string;

  @Prop({ enum: ['pending', 'confirmed', 'sample-collected', 'completed', 'cancelled'], default: 'pending', index: true })
  status!: string;

  @Prop({ trim: true })
  notes?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.pre('validate', function () {
  if (!this.bookingId) {
    // A random five-digit suffix avoids a separate counter collection. The unique
    // index protects against collisions, which BookingService retries once.
    this.bookingId = `LF-B-${Math.floor(10000 + Math.random() * 90000)}`;
  }
});
