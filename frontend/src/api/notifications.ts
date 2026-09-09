import { isAxiosError } from 'axios';
import client from './client';

export type NotificationRole = 'admin' | 'doctor' | 'receptionist' | 'lab_technician' | 'patient';
export type NotificationCategory = 'sample' | 'verification' | 'billing' | 'registration' | 'finance' | 'report' | 'booking';

export interface NotificationDocument {
  _id: string;
  userId?: string;
  role?: NotificationRole;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: 'normal' | 'urgent';
  read: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
  createdAt?: string;
}

export interface NotificationFilters {
  userId?: string;
  role?: NotificationRole;
  category?: NotificationCategory;
  priority?: 'normal' | 'urgent';
  read?: boolean;
  unread?: boolean;
}

export interface NotificationListResponse {
  data: NotificationDocument[];
  summary: {
    unreadCount: number;
    urgentCount: number;
    urgentNotifications: NotificationDocument[];
    recentNotifications: NotificationDocument[];
  };
}

function rethrowApiError(error: unknown, fallback: string): never {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    throw new Error(typeof message === 'string' ? message : fallback);
  }

  throw error;
}

export async function listNotifications(filters: NotificationFilters): Promise<NotificationListResponse> {
  try {
    const { data } = await client.get<NotificationListResponse>('/notifications', { params: filters });
    return data;
  } catch (error) {
    return rethrowApiError(error, 'Unable to load notifications. Please try again.');
  }
}

export async function markAsRead(id: string): Promise<NotificationDocument> {
  try {
    const { data } = await client.patch<NotificationDocument>(`/notifications/${id}/read`);
    return data;
  } catch (error) {
    return rethrowApiError(error, 'Unable to mark notification as read. Please try again.');
  }
}

export async function markAllAsRead(filters: Pick<NotificationFilters, 'userId' | 'role'>): Promise<unknown> {
  try {
    const { data } = await client.patch('/notifications/read-all', undefined, { params: filters });
    return data;
  } catch (error) {
    return rethrowApiError(error, 'Unable to mark notifications as read. Please try again.');
  }
}
