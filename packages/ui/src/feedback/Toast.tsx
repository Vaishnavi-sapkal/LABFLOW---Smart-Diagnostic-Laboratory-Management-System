import type { ReactNode } from 'react';
export function Toast({ children }: { children: ReactNode }) { return <div className="rounded-ui bg-slate-900 px-4 py-3 text-sm text-white shadow-floating">{children}</div>; }
