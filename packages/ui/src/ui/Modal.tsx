import type { ReactNode } from 'react';
export function Modal({ open, title, children }: { open: boolean; title: string; children: ReactNode }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/30 p-4"><section aria-modal="true" role="dialog" className="w-full max-w-md rounded-card bg-white p-6 shadow-floating"><h2 className="text-lg font-semibold">{title}</h2><div className="mt-4">{children}</div></section></div>;
}
