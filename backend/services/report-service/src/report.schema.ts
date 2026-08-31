import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ _id: false })
export class ReportValue {
  @Prop({ required: true }) parameterName!: string;
  @Prop({ type: Number, default: null }) value!: number | null;
  @Prop({ required: true }) unit!: string;
  @Prop({ required: true, type: Number }) referenceMin!: number;
  @Prop({ required: true, type: Number }) referenceMax!: number;
  @Prop({ required: true }) flag!: string;
}

export const ReportValueSchema = SchemaFactory.createForClass(ReportValue);

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, unique: true, index: true }) reportNo!: string;
  @Prop({ required: true, unique: true, index: true }) verificationId!: string;
  @Prop({ required: true, index: true }) resultId!: string;
  @Prop({ required: true, index: true }) sampleId!: string;
  @Prop({ required: true, index: true }) patientId!: string;
  @Prop({ required: true, index: true }) doctorId!: string;
  @Prop({ required: true, trim: true }) patientName!: string;
  @Prop({ type: Number }) patientAge?: number;
  @Prop({ trim: true }) patientGender?: string;
  @Prop({ required: true, trim: true }) patientDisplayId!: string;
  @Prop({ required: true, trim: true }) sampleType!: string;
  @Prop({ required: true }) collectionDate!: Date;
  @Prop({ required: true }) reportDate!: Date;
  @Prop({ required: true, trim: true }) testName!: string;
  @Prop({ trim: true }) testCategory?: string;
  @Prop({ required: true, trim: true }) testMethod!: string;
  @Prop({ required: true }) allNormal!: boolean;
  @Prop({ type: [ReportValueSchema], default: [] }) values!: ReportValue[];
  @Prop({ required: true, trim: true }) doctorName!: string;
  @Prop({ trim: true }) doctorQualification?: string;
  @Prop({ trim: true }) doctorRegistrationNumber?: string;
  @Prop({ trim: true }) clinicalRemarks?: string;
  @Prop({ required: true }) verifiedAt!: Date;
  @Prop({ required: true }) verificationUrl!: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
