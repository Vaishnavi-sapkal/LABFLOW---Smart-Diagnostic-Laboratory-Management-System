import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export const SAMPLE_PRIORITIES = ['routine', 'urgent', 'stat'] as const;
export const SAMPLE_STATUSES = ['collected', 'in-transit', 'processing', 'completed', 'rejected'] as const;
export type SampleStatus = (typeof SAMPLE_STATUSES)[number];
export type SampleDocument = HydratedDocument<Sample>;

@Schema({ timestamps: true })
export class Sample {
  @Prop({ required: true, unique: true, index: true }) sampleId!: string;
  @Prop({ required: true, index: true }) bookingId!: string;
  @Prop({ required: true, index: true }) patientId!: string;
  @Prop({ required: true, trim: true }) patientName!: string;
  @Prop({ required: true, trim: true }) testDisplayName!: string;
  @Prop({ required: true, trim: true }) sampleType!: string;
  @Prop({ type: String, enum: SAMPLE_PRIORITIES, default: 'routine' })
  priority!: (typeof SAMPLE_PRIORITIES)[number];

  @Prop({ required: true, default: Date.now }) collectedAt!: Date;

  @Prop({ type: String, enum: SAMPLE_STATUSES, default: 'collected', index: true })
  status!: SampleStatus;
  @Prop({ required: true, trim: true }) handledBy!: string;
  @Prop({ trim: true, required: function (this: Sample) { return this.status === 'rejected'; } })
  rejectionReason?: string;
  @Prop({ required: true, default: Date.now }) statusUpdatedAt!: Date;
}

export const SampleSchema = SchemaFactory.createForClass(Sample);
