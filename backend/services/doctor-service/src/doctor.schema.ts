import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Doctors are represented by their verified license, identity, specialty, contact channel, and current availability. */
@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true })
  licenseNumber!: string;

  @Prop({ trim: true })
  specialization?: string;

  @Prop({ required: true, trim: true })
  contact!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export type DoctorDocument = HydratedDocument<Doctor>;
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
