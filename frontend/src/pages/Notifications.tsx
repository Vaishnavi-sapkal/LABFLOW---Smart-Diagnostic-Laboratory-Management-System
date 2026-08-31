import { useMemo, useState } from 'react';
import { NotificationItem } from '../components/laboratory/NotificationItem';
import { PageContainer } from '../components/layout/PageContainer';
import { Tabs } from '../components/ui/Tabs';
import { useAuth } from '../app/AuthContext';
import { useLabData } from '../app/LabDataContext';

const filters = ['All', 'Unread', 'Urgent'] as const;

export function Notifications() {
  const { role } = useAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');
  const { notifications, markNotificationRead } = useLabData();

  const visible = useMemo(() => {
    return notifications
      .filter((item) => item.role === role || item.role === 'All')
      .filter((item) => filter === 'All' || (filter === 'Unread' && item.unread) || (filter === 'Urgent' && item.category === 'Urgent'));
  }, [filter, notifications, role]);

  return (
    <PageContainer>
      <section className="card p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h2 className="text-base font-semibold">Role-filtered notifications</h2><p className="text-sm text-ink-muted">Showing alerts and tasks for {role}.</p></div>
          <Tabs items={[...filters]} onChange={setFilter} value={filter} />
        </div>
        <div className="grid gap-3">
          {visible.length ? visible.map((item) => <NotificationItem item={item} key={item.id} onRead={markNotificationRead} />) : <div className="rounded-card border border-border bg-white p-8 text-center text-sm text-ink-muted">No notifications in this filter.</div>}
        </div>
      </section>
    </PageContainer>
  );
}
