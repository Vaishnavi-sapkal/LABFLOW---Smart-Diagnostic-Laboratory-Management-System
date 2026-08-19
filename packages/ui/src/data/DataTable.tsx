import type { ReactNode, TdHTMLAttributes } from 'react';

export function DataTable({ headings, children }: { headings: string[]; children: ReactNode }) {
  return <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-ink-muted"><tr>{headings.map((heading) => <th key={heading} className="px-5 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{children}</tbody></table></div>;
}

export function DataCell({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={`px-5 py-4 ${className ?? ''}`} {...props}>{children}</td>;
}
