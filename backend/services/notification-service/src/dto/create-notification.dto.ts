import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES, NOTIFICATION_ROLES, NotificationCategory, NotificationPriority, NotificationRole } from '../notification.schema';

export class CreateNotificationDto {
  @ApiPropertyOptional({ description: 'Individual recipient ID. Either userId/recipientId or role is required.' }) @IsOptional() @IsString() @IsNotEmpty() userId?: string;
  @ApiPropertyOptional({ description: 'Alias for userId.' }) @IsOptional() @IsString() @IsNotEmpty() recipientId?: string;
  @ApiPropertyOptional({ enum: NOTIFICATION_ROLES }) @IsOptional() @IsEnum(NOTIFICATION_ROLES) role?: NotificationRole;
  @ApiProperty({ example: 'Sample collection is overdue' }) @IsString() @IsNotEmpty() @MaxLength(160) title!: string;
  @ApiProperty({ example: 'Sample SMP-2408-014 has not been collected within its scheduled window.' }) @IsString() @IsNotEmpty() @MaxLength(2000) message!: string;
  @ApiProperty({ enum: NOTIFICATION_CATEGORIES, example: 'sample' }) @IsEnum(NOTIFICATION_CATEGORIES) category!: NotificationCategory;
  @ApiPropertyOptional({ enum: NOTIFICATION_PRIORITIES, default: 'normal' }) @IsOptional() @IsEnum(NOTIFICATION_PRIORITIES) priority?: NotificationPriority;
  @ApiPropertyOptional({ example: 'SMP-2408-014' }) @IsOptional() @IsString() @MaxLength(100) relatedEntityId?: string;
  @ApiPropertyOptional({ example: 'sample' }) @IsOptional() @IsString() @MaxLength(50) relatedEntityType?: string;
}
