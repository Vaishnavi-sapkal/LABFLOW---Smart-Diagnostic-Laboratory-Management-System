import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Billing records attach charges to patients and retain amount, currency, payment state, and an external payment reference. */
@Schema({ timestamps: true })
export class Billing {
  @Prop({ required: true, index: true })
  patientId!: string;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({ required: true, trim: true, default: 'INR' })
  currency!: string;

  @Prop({ enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' })
  paymentStatus!: string;

  @Prop({ trim: true })
  reference?: string;
}

export type BillingDocument = HydratedDocument<Billing>;
export const BillingSchema = SchemaFactory.createForClass(Billing);
