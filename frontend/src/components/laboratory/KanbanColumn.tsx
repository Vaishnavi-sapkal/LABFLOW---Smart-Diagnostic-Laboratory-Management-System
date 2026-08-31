import type { ReactNode } from 'react';

export function KanbanColumn({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-card border border-border bg-surface-muted p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-ink-muted">{count}</span>
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
