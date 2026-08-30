import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Dashboard {}

export const DashboardSchema = SchemaFactory.createForClass(Dashboard);