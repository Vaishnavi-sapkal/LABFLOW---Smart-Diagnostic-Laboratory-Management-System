import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Dashboard preferences belong to an owner and preserve named widget selections, flexible filters, and a default-view flag. */
@Schema({ timestamps: true })
export class Dashboard {
  @Prop({ required: true, index: true })
  ownerId!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ type: [String], default: [] })
  widgets!: string[];

  @Prop({ type: Object, default: {} })
  filters!: Record<string, unknown>;

  @Prop({ default: false })
  isDefault!: boolean;
}

export type DashboardDocument = HydratedDocument<Dashboard>;
export const DashboardSchema = SchemaFactory.createForClass(Dashboard);
