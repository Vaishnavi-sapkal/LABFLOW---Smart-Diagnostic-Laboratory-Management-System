import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Reports aggregate a patient’s result identifiers with a publication state, publication time, and human-readable summary. */
@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, index: true })
  patientId!: string;

  @Prop({ required: true, type: [String], default: [] })
  resultIds!: string[];

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft' })
  status!: string;

  @Prop()
  publishedAt?: Date;

  @Prop({ trim: true })
  summary?: string;
}

export type ReportDocument = HydratedDocument<Report>;
export const ReportSchema = SchemaFactory.createForClass(Report);
