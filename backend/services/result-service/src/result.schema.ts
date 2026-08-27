import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Results connect a sample and test, retain structured measurements, and record interpretation plus a controlled result state. */
@Schema({ timestamps: true })
export class Result {
  @Prop({ required: true, index: true })
  sampleId!: string;

  @Prop({ required: true, index: true })
  testId!: string;

  @Prop({ required: true, type: Object })
  values!: Record<string, unknown>;

  @Prop({ trim: true })
  interpretation?: string;

  @Prop({ enum: ['draft', 'final', 'amended'], default: 'draft' })
  status!: string;
}

export type ResultDocument = HydratedDocument<Result>;
export const ResultSchema = SchemaFactory.createForClass(Result);
