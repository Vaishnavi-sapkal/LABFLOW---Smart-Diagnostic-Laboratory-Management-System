import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Test catalog entries define an identifiable code, price, required specimen, and availability for ordering workflows. */
@Schema({ timestamps: true })
export class Test {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, trim: true })
  code!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, trim: true })
  specimenType!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export type TestDocument = HydratedDocument<Test>;
export const TestSchema = SchemaFactory.createForClass(Test);
