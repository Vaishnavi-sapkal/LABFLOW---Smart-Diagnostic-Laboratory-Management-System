import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ _id: false })
export class InvoiceItem {
  @Prop({ required: true }) testId!: string;
  @Prop({ required: true }) code!: string;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) category!: string;
  @Prop({ default: 1 }) qty!: number;
  @Prop({ required: true, min: 0 }) rate!: number;
  @Prop({ required: true, min: 0 }) amount!: number;
}
export const InvoiceItemSchema = SchemaFactory.createForClass(InvoiceItem);

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ required: true, unique: true, index: true }) invoiceNo!: string;
  @Prop({ required: true, index: true }) bookingId!: string;
  @Prop({ required: true, index: true }) patientId!: string;
  @Prop({ required: true }) patientName!: string;
  @Prop({ required: true }) patientDisplayId!: string;
  @Prop({ required: true, index: true }) doctorId!: string;
  @Prop({ required: true }) doctorName!: string;
  @Prop({ type: [InvoiceItemSchema], required: true }) items!: InvoiceItem[];
  @Prop({ required: true }) subtotal!: number;
  @Prop({ default: 0 }) discountPercent!: number;
  @Prop({ required: true }) discountAmount!: number;
  @Prop({ default: 5 }) gstPercent!: number;
  @Prop({ required: true }) gstAmount!: number;
  @Prop({ required: true }) totalAmount!: number;
  @Prop({ enum: ['cash', 'upi', 'card', 'insurance'] }) paymentMethod?: string;
  @Prop() upiId?: string;
  @Prop({ enum: ['draft', 'paid', 'cancelled'], default: 'draft', index: true }) status!: string;
  @Prop() paidAt?: Date;
}
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
