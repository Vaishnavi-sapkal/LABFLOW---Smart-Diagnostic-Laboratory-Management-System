import { IsNotEmpty, IsString } from 'class-validator';
export class CreateInvoiceDto { @IsString() @IsNotEmpty() bookingId!: string; }
