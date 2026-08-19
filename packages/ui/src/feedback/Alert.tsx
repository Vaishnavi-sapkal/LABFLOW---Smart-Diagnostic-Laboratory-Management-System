import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';
export function Alert({ tone = 'success', children }: { tone?: 'success' | 'warning'; children: ReactNode }) { const warning = tone === 'warning'; return <div role="alert" className={`flex gap-3 rounded-ui border p-3 text-sm ${warning ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{warning ? <CircleAlert size={18} /> : <CircleCheck size={18} />}<div>{children}</div></div>; }
