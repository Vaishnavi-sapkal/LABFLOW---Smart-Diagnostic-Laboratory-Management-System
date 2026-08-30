import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Accounts store identity, credential hashes, role-based access, and active state; timestamps support auditing. */
@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, select: false })
  passwordHash!: string;

  @Prop({ enum: ['admin', 'lab_staff', 'doctor', 'patient'], default: 'patient' })
  role!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export type AuthDocument = HydratedDocument<Auth>;
export const AuthSchema = SchemaFactory.createForClass(Auth);
