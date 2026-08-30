import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResultDocument = HydratedDocument<Result>;

export enum ResultFlag {
  PENDING = 'pending',
  NORMAL = 'normal',
  LOW = 'low',
  HIGH = 'high',
}

export enum ResultStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

@Schema({ _id: false })
export class ResultValue {
  @Prop({ required: true })
  parameterName!: string;

  @Prop({ required: true })
  unit!: string;

  @Prop({ required: true, type: Number })
  referenceMin!: number;

  @Prop({ required: true, type: Number })
  referenceMax!: number;

  @Prop({ type: Number, default: null })
  value!: number | null;

  @Prop({
    type: String,
    enum: Object.values(ResultFlag),
    default: ResultFlag.PENDING,
  })
  flag!: ResultFlag;
}

export const ResultValueSchema =
  SchemaFactory.createForClass(ResultValue);

@Schema({ timestamps: true })
export class Result {
  @Prop({ required: true })
  sampleId!: string;

  @Prop({ required: true })
  bookingId!: string;

  @Prop({ required: true })
  patientId!: string;

  @Prop({ required: true })
  testId!: string;

  @Prop()
  doctorId?: string;

  @Prop({
    type: [ResultValueSchema],
    default: [],
  })
  values!: ResultValue[];

  @Prop()
  remarks?: string;

  @Prop({
    type: String,
    enum: Object.values(ResultStatus),
    default: ResultStatus.DRAFT,
  })
  status!: ResultStatus;

  @Prop()
  enteredBy?: string;

  @Prop()
  submittedAt?: Date;

  @Prop()
  verificationComment?: string;
}

export const ResultSchema =
  SchemaFactory.createForClass(Result);
