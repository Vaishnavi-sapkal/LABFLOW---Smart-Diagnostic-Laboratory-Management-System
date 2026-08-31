import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Check notification service health' })
  health() {
    return {
      status: 'ok',
      service: 'notification',
    };
  }

  @Post()
  @ApiOperation({
    summary: 'Create an in-app notification for a user or role',
  })
  @ApiBody({ type: CreateNotificationDto })
  @ApiResponse({ status: 201, description: 'Notification created.' })
  create(@Body() dto: CreateNotificationDto) {
    return this.notificationService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List notifications with UI dashboard summary data',
  })
  findAll(@Query() query: NotificationQueryDto) {
    return this.notificationService.findAll(query);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark all unread notifications for a user or role as read',
  })
  markAllAsRead(@Query() query: NotificationQueryDto) {
    return this.notificationService.markAllAsRead(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a notification by ID' })
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}