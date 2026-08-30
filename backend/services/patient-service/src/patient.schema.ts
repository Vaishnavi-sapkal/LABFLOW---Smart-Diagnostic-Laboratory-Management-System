import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Patients need identity, date of birth, contact details, and a flexible medical-history list for safe diagnostics. */
@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true })
  dob!: Date;

  @Prop({ enum: ['male', 'female', 'other', 'prefer_not_to_say'] })
  gender?: string;

  @Prop({ required: true, trim: true })
  contact!: string;

  @Prop({ type: [String], default: [] })
  medicalHistory!: string[];
}

export type PatientDocument = HydratedDocument<Patient>;
export const PatientSchema = SchemaFactory.createForClass(Patient);
