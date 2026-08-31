import type { ReactNode } from 'react';
import { cn } from '@labflow/utils/cn';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const toneClass: Record<Tone, string> = {
  success: 'bg-success-light text-success',
  warning: 'bg-warning-light text-warning',
  danger: 'bg-danger-light text-danger',
  info: 'bg-accent-light text-accent',
  neutral: 'bg-surface-muted text-ink-muted',
};

export function StatusBadge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', toneClass[tone], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
