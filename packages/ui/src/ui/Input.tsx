import type { InputHTMLAttributes } from 'react';
import { cn } from '@labflow/utils/cn';
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('focus-ring h-10 w-full rounded-ui border border-slate-200 bg-white px-3 text-sm text-ink placeholder:text-ink-muted', className)} {...props} />;
}
