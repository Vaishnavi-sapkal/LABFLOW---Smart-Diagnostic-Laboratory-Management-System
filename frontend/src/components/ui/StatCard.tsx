import type { ReactNode } from 'react';

export function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <article className="card min-h-[116px] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-ink-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-ui bg-brand-50 text-brand-700">{icon}</div>
      </div>
      <p className="mt-3 text-xs text-ink-muted">{detail}</p>
    </article>
  );
}
