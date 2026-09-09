import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { Notification, NotificationDocument, NotificationRole } from './notification.schema';
import { EmailService } from './email.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateNotificationDto) {
    const userId = dto.userId ?? dto.recipientId;
    if (!userId && !dto.role) throw new BadRequestException('Either userId (or recipientId) or role is required');
    this.logger.log(`Notification request: userId=${userId ?? 'role-audience'}, role=${dto.role ?? 'none'}, recipientEmail=${dto.recipientEmail ?? 'none'}`);

    let notification: NotificationDocument;
    try {
      notification = await this.notificationModel.create({ ...dto, userId, recipientId: undefined, emailStatus: 'skipped' });
      this.logger.log(`Notification persisted: id=${notification.id}, userId=${notification.userId ?? 'role-audience'}, role=${notification.role ?? 'none'}`);
    } catch (error) {
      this.logger.error('Notification persistence failed', error instanceof Error ? error.stack : String(error));
      throw error;
    }

    if (dto.recipientEmail) {
      const delivery = await this.emailService.sendNotification(notification, dto.recipientEmail);
      notification.emailStatus = delivery.status;
      notification.emailError = delivery.status === 'failed' ? delivery.error : undefined;
      try {
        await notification.save();
        this.logger.log(`Notification email status persisted: id=${notification.id}, status=${delivery.status}`);
      } catch (error) {
        this.logger.error(`Notification email status persistence failed: id=${notification.id}`, error instanceof Error ? error.stack : String(error));
        throw error;
      }
    }
    return notification;
  }

  async findAll(filters: NotificationQueryDto, actor?: { userId: string; role: string }) {
    filters = this.scopeFilters(filters, actor);
    const query = this.toFilter(filters);
    const audience = this.toAudienceFilter(filters);
    const [data, unreadCount, urgentNotifications, recentNotifications] = await Promise.all([
      this.notificationModel.find(query).sort({ createdAt: -1 }).exec(),
      this.notificationModel.countDocuments({ ...audience, read: false }).exec(),
      this.notificationModel.find({ ...audience, priority: 'urgent' }).sort({ createdAt: -1 }).exec(),
      this.notificationModel.find(audience).sort({ createdAt: -1 }).limit(10).exec(),
    ]);
    return { data, summary: { unreadCount, urgentCount: urgentNotifications.length, urgentNotifications, recentNotifications } };
  }

  async findOne(id: string, actor?: { userId: string; role: string }) { const notification = await this.findDocument(id); this.assertAudience(notification, actor); return notification; }

  async markAsRead(id: string, actor?: { userId: string; role: string }) {
    this.assertObjectId(id);
    const existing = await this.findDocument(id);
    this.assertAudience(existing, actor);
    const notification = await this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    if (!notification) throw new NotFoundException(`Notification ${id} was not found`);
    return notification;
  }

  async markAllAsRead(filters: NotificationQueryDto, actor?: { userId: string; role: string }) {
    filters = this.scopeFilters(filters, actor);
    const audience = this.toAudienceFilter(filters);
    if (!audience.userId && !audience.role) throw new BadRequestException('userId (or recipientId) or role is required to mark notifications as read');
    const result = await this.notificationModel.updateMany({ ...audience, read: false }, { read: true }).exec();
    return { updatedCount: result.modifiedCount };
  }

  async remove(id: string, actor?: { userId: string; role: string }) {
    this.assertObjectId(id);
    this.assertAudience(await this.findDocument(id), actor);
    const notification = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!notification) throw new NotFoundException(`Notification ${id} was not found`);
    return { deleted: true, id };
  }

  private async findDocument(id: string) {
    this.assertObjectId(id);
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) throw new NotFoundException(`Notification ${id} was not found`);
    return notification;
  }

  private assertObjectId(id: string) { if (!isValidObjectId(id)) throw new BadRequestException('Invalid notification ID'); }

  private toAudienceFilter(filters: NotificationQueryDto): FilterQuery<NotificationDocument> {
    const query: FilterQuery<NotificationDocument> = {};
    const userId = filters.userId ?? filters.recipientId;
    if (userId && filters.role) query.$or = [{ userId }, { role: filters.role }];
    else if (userId) query.userId = userId;
    else if (filters.role) query.role = filters.role;
    return query;
  }

  private toFilter(filters: NotificationQueryDto): FilterQuery<NotificationDocument> {
    const query = this.toAudienceFilter(filters);
    if (filters.category && filters.type && filters.category !== filters.type) throw new BadRequestException('category and type filters conflict');
    if (filters.category ?? filters.type) query.category = filters.category ?? filters.type;
    if (filters.priority) query.priority = filters.priority;
    if (filters.read !== undefined && filters.unread !== undefined && filters.read === filters.unread) throw new BadRequestException('read and unread filters conflict');
    if (filters.read !== undefined) query.read = filters.read;
    if (filters.unread !== undefined) query.read = !filters.unread;
    return query;
  }

  private scopeFilters(filters: NotificationQueryDto, actor?: { userId: string; role: string }): NotificationQueryDto {
    if (!actor || actor.role === 'admin') return filters;
    const role = actor.role === 'technician' ? 'lab_technician' : actor.role as NotificationRole;
    return { ...filters, userId: actor.userId, role };
  }

  private assertAudience(notification: NotificationDocument, actor?: { userId: string; role: string }) {
    if (!actor || actor.role === 'admin') return;
    const role = actor.role === 'technician' ? 'lab_technician' : actor.role;
    if (notification.userId !== actor.userId && notification.role !== role) {
      throw new ForbiddenException('You may only access your own notifications');
    }
  }
}
