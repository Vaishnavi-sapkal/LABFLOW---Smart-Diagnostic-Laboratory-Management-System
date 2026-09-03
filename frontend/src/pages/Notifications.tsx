import { useEffect, useState } from 'react';
import { NotificationItem } from '../components/laboratory/NotificationItem';
import { PageContainer } from '../components/layout/PageContainer';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { useAuth } from '../app/AuthContext';
import { listNotifications, markAllAsRead, markAsRead, type NotificationFilters } from '../api/notifications';
import type { Notification } from '../types/labflow';

const filters = ['All', 'Unread', 'Urgent'] as const;

const roleByAppRole = {
  Admin: 'admin',
  Doctor: 'doctor',
  Receptionist: 'receptionist',
  'Lab Technician': 'lab_technician',
  Patient: 'patient',
} as const;

function displayCategory(category: string, priority: string): Notification['category'] {
  if (priority === 'urgent') return 'Urgent';
  if (category === 'billing' || category === 'finance') return 'Billing';
  if (category === 'report' || category === 'verification') return 'Report';
  if (category === 'registration' || category === 'booking') return 'Task';
  return 'System';
}

export function Notifications() {
  const { role, user } = useAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiFilters: NotificationFilters = {
    role: roleByAppRole[role],
    userId: user?.id,
    ...(filter === 'Unread' ? { unread: true } : {}),
    ...(filter === 'Urgent' ? { priority: 'urgent' as const } : {}),
  };

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await listNotifications(apiFilters);
      setNotifications(response.data.map((item) => ({
        id: item._id,
        role: role,
        title: item.title,
        body: item.message,
        category: displayCategory(item.category, item.priority),
        time: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recently',
        unread: !item.read,
      })));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, [filter, role, user?.id]);

  const handleRead = async (id: string) => {
    setError('');
    try {
      await markAsRead(id);
      await loadNotifications();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to mark notification as read.');
    }
  };

  const handleMarkAllRead = async () => {
    setError('');
    try {
      await markAllAsRead({ role: roleByAppRole[role], userId: user?.id });
      await loadNotifications();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to mark notifications as read.');
    }
  };

  return (
    <PageContainer>
      <section className="card p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-base font-semibold">Role-filtered notifications</h2><p className="text-sm text-ink-muted">Showing alerts and tasks for {role}.</p></div>
          <div className="flex items-center gap-3"><Button onClick={() => void handleMarkAllRead()} size="sm" variant="outline">Mark all as read</Button><Tabs items={[...filters]} onChange={setFilter} value={filter} /></div>
        </div>
        {error && <p className="mb-3 text-sm text-danger">{error}</p>}
        <div className="grid gap-3">
          {loading ? <div className="rounded-card border border-border bg-white p-8 text-center text-sm text-ink-muted">Loading notifications…</div> : notifications.length ? notifications.map((item) => <NotificationItem item={item} key={item.id} onRead={(id) => void handleRead(id)} />) : <div className="rounded-card border border-border bg-white p-8 text-center text-sm text-ink-muted">No notifications in this filter.</div>}
        </div>
      </section>
    </PageContainer>
  );
}
