import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Verification captures who reviewed a result, the decision, optional remarks, and the review timestamp for laboratory accountability. */
@Schema({ timestamps: true })
export class Verification {
  @Prop({ required: true, index: true })
  resultId!: string;

  @Prop({ required: true, index: true })
  verifierId!: string;

  @Prop({ enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status!: string;

  @Prop({ trim: true })
  remarks?: string;

  @Prop()
  verifiedAt?: Date;
}

export type VerificationDocument = HydratedDocument<Verification>;
export const VerificationSchema = SchemaFactory.createForClass(Verification);
