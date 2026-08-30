import type { Doctor } from '../../types/labflow';
import { Avatar } from '../ui/Avatar';

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="flex items-center gap-3 rounded-ui border border-border bg-white p-3">
      <Avatar name={doctor.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{doctor.name}</p>
        <p className="text-xs text-ink-muted">{doctor.specialization}</p>
      </div>
      <span className={`h-2.5 w-2.5 rounded-full ${doctor.status === 'Available' ? 'bg-success' : doctor.status === 'Off duty' ? 'bg-ink-subtle' : 'bg-warning'}`} />
    </article>
  );
}
