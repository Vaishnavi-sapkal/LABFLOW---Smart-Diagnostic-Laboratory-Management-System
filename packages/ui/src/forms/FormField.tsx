import type { ReactNode } from 'react';
export function FormField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium text-ink"><span>{label}</span>{children}{hint && <span className="text-xs font-normal text-ink-muted">{hint}</span>}</label>; }
