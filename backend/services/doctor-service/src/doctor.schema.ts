import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema({ timestamps: true })
export class Doctor {
  @Prop({ required: true, unique: true, index: true })
  doctorId!: string;

  @Prop({ required: true, trim: true })
  fullName!: string;

  @Prop({ trim: true })
  specialization?: string;

  @Prop({ trim: true })
  qualification?: string;

  @Prop({ trim: true })
  registrationNumber?: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({ trim: true })
  mobile?: string;

  @Prop({ default: true })
  isActive!: boolean;

  // Plain auth-service User _id reference; doctor-service does not perform DB joins.
  @Prop({ trim: true })
  userId?: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);

DoctorSchema.pre('validate', function () {
  if (!this.doctorId) {
    // A random five-digit suffix avoids a counter collection; the unique index and
    // a retry in DoctorService handle the extremely unlikely collision.
    this.doctorId = `LF-D-${Math.floor(10000 + Math.random() * 90000)}`;
  }
});
