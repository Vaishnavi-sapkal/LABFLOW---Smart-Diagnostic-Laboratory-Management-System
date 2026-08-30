import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const VERIFICATION_STATUSES = [
  'pending',
  'approved',
  'rejected',
] as const;

export type VerificationStatus =
  (typeof VERIFICATION_STATUSES)[number];
export type VerificationDocument = HydratedDocument<Verification>;

@Schema({ timestamps: true })
export class Verification {
  @Prop({ required: true, unique: true, index: true })
  reportId!: string;

  @Prop({ required: true, index: true })
  resultId!: string;

  @Prop({ required: true, index: true })
  sampleId!: string;

  @Prop({ required: true, index: true })
  patientId!: string;

  @Prop({ required: true, trim: true })
  patientName!: string;

  @Prop({ required: true, index: true })
  testId!: string;

  @Prop({ required: true, trim: true })
  testName!: string;

  @Prop({ required: true, trim: true })
  technician!: string;

  @Prop({ required: true, index: true })
  doctorId!: string;

  @Prop({ trim: true })
  priority?: string;

  @Prop({ required: true, index: true })
  submittedAt!: Date;

  @Prop({
    type: String,
    enum: VERIFICATION_STATUSES,
    default: 'pending',
    index: true,
  })
  status!: VerificationStatus;

  @Prop({ trim: true })
  doctorComment?: string;

  @Prop()
  reviewedAt?: Date;

  @Prop({ default: false })
  reportGenerated!: boolean;
}

export const VerificationSchema =
  SchemaFactory.createForClass(Verification);
