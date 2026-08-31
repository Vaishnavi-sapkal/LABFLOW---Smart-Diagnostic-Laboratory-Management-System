import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES, NOTIFICATION_ROLES, NotificationCategory, NotificationPriority, NotificationRole } from '../notification.schema';

export class NotificationQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional({ description: 'Alias for userId.' }) @IsOptional() @IsString() recipientId?: string;
  @ApiPropertyOptional({ enum: NOTIFICATION_ROLES }) @IsOptional() @IsEnum(NOTIFICATION_ROLES) role?: NotificationRole;
  @ApiPropertyOptional({ enum: NOTIFICATION_CATEGORIES }) @IsOptional() @IsEnum(NOTIFICATION_CATEGORIES) category?: NotificationCategory;
  @ApiPropertyOptional({ enum: NOTIFICATION_CATEGORIES, description: 'Alias for category.' }) @IsOptional() @IsEnum(NOTIFICATION_CATEGORIES) type?: NotificationCategory;
  @ApiPropertyOptional({ enum: NOTIFICATION_PRIORITIES }) @IsOptional() @IsEnum(NOTIFICATION_PRIORITIES) priority?: NotificationPriority;
  @ApiPropertyOptional({ type: Boolean }) @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() read?: boolean;
  @ApiPropertyOptional({ type: Boolean, description: 'Filter unread notifications. Cannot conflict with read.' }) @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() unread?: boolean;
}
