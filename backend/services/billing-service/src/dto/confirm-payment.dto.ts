import { IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
export class ConfirmPaymentDto {
  @IsIn(['cash', 'upi', 'card', 'insurance']) paymentMethod!: 'cash' | 'upi' | 'card' | 'insurance';
  @ValidateIf((dto: ConfirmPaymentDto) => dto.paymentMethod === 'upi') @IsString() @IsNotEmpty() upiId?: string;
}
