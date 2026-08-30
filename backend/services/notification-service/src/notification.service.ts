import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { Notification, NotificationDocument } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>) {}

  async create(dto: CreateNotificationDto) {
    const userId = dto.userId ?? dto.recipientId;
    if (!userId && !dto.role) throw new BadRequestException('Either userId (or recipientId) or role is required');
    return this.notificationModel.create({ ...dto, userId, recipientId: undefined });
  }

  async findAll(filters: NotificationQueryDto) {
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

  async findOne(id: string) { return this.findDocument(id); }

  async markAsRead(id: string) {
    this.assertObjectId(id);
    const notification = await this.notificationModel.findByIdAndUpdate(id, { read: true }, { new: true }).exec();
    if (!notification) throw new NotFoundException(`Notification ${id} was not found`);
    return notification;
  }

  async markAllAsRead(filters: NotificationQueryDto) {
    const audience = this.toAudienceFilter(filters);
    if (!audience.userId && !audience.role) throw new BadRequestException('userId (or recipientId) or role is required to mark notifications as read');
    const result = await this.notificationModel.updateMany({ ...audience, read: false }, { read: true }).exec();
    return { updatedCount: result.modifiedCount };
  }

  async remove(id: string) {
    this.assertObjectId(id);
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
    if (userId) query.userId = userId;
    if (filters.role) query.role = filters.role;
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
}
