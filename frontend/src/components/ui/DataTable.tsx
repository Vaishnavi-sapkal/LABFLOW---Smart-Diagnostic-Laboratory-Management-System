import type { ReactNode } from 'react';

export function DataTable({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-[13px]">
          <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-normal text-ink-muted">
            <tr>{columns.map((column) => <th className="whitespace-nowrap border-b border-border px-4 py-3" key={column}>{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border text-ink">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function DataCell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <td className={`whitespace-nowrap px-4 py-3 align-middle ${className}`}>{children}</td>;
}
