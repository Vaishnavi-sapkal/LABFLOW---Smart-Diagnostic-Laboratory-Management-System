import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Samples link to a patient and use a unique barcode, specimen type, collection time, and lifecycle status for traceability. */
@Schema({ timestamps: true })
export class Sample {
  @Prop({ required: true, index: true })
  patientId!: string;

  @Prop({ required: true, unique: true, trim: true })
  barcode!: string;

  @Prop({ required: true, trim: true })
  specimenType!: string;

  @Prop({ enum: ['collected', 'received', 'processing', 'rejected', 'disposed'], default: 'collected' })
  status!: string;

  @Prop()
  collectedAt?: Date;
}

export type SampleDocument = HydratedDocument<Sample>;
export const SampleSchema = SchemaFactory.createForClass(Sample);
