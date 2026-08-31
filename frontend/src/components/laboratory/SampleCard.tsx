import { FlaskConical } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

export function SampleCard({ code, patient, test, status }: { code: string; patient: string; test: string; status: string }) {
  return (
    <article className="rounded-card border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-ui bg-brand-50 text-brand-700"><FlaskConical size={18} /></div>
          <div>
            <h3 className="font-mono text-xs font-semibold text-ink">{code}</h3>
            <p className="text-xs text-ink-muted">{patient}</p>
          </div>
        </div>
        <StatusBadge tone={status === 'Collected' ? 'success' : status === 'Delayed' ? 'danger' : 'info'}>{status}</StatusBadge>
      </div>
      <p className="mt-4 text-sm text-ink-muted">{test}</p>
    </article>
  );
}
