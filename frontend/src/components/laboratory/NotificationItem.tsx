import type { Notification } from '../../types/labflow';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';

export function NotificationItem({ item, onRead }: { item: Notification; onRead: (id: string) => void }) {
  const tone = item.category === 'Urgent' ? 'danger' : item.category === 'Billing' ? 'warning' : item.category === 'Report' ? 'success' : 'info';
  return (
    <article className={`rounded-card border p-4 ${item.unread ? 'border-brand-600 bg-brand-50' : 'border-border bg-white'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2"><h3 className="text-sm font-semibold text-ink">{item.title}</h3>{item.unread ? <span className="h-2 w-2 rounded-full bg-brand-600" /> : null}</div>
          <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
          <p className="mt-2 text-xs text-ink-subtle">{item.time} | {item.role}</p>
        </div>
        <div className="flex items-center gap-2"><StatusBadge tone={tone}>{item.category}</StatusBadge><Button disabled={!item.unread} onClick={() => onRead(item.id)} size="sm" variant="outline">Mark read</Button></div>
      </div>
    </article>
  );
}
