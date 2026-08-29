import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestDocument = HydratedDocument<Test>;

@Schema({ _id: false })
export class TestParameter {
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true }) unit!: string;
  @Prop({ required: true }) referenceMin!: number;
  @Prop({ required: true }) referenceMax!: number;
}

export const TestParameterSchema = SchemaFactory.createForClass(TestParameter);

@Schema({ timestamps: true })
export class Test {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code!: string;

  // Categories remain strings so new laboratory disciplines need no deployment.
  @Prop({ required: true, trim: true })
  category!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 1 })
  turnaroundHours!: number;

  @Prop({ default: false })
  fastingRequired!: boolean;

  @Prop({ default: false })
  isPackage!: boolean;

  @Prop({ type: [TestParameterSchema], default: [] })
  parameters!: TestParameter[];

  // IDs reference individual Test documents; packages must not be nested.
  @Prop({ type: [String], default: [] })
  includedTestIds!: string[];
}

export const TestSchema = SchemaFactory.createForClass(Test);
