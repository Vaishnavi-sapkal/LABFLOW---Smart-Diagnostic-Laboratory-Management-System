import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@labflow/utils/cn';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' };
export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const variants = { primary: 'bg-brand-600 text-white hover:bg-brand-700', secondary: 'border border-slate-200 bg-white text-ink hover:bg-slate-50', ghost: 'text-ink-muted hover:bg-slate-100', danger: 'bg-red-600 text-white hover:bg-red-700' };
  return <button className={cn('focus-ring inline-flex items-center justify-center gap-2 rounded-ui font-medium transition disabled:pointer-events-none disabled:opacity-50', size === 'sm' ? 'h-8 px-3 text-sm' : 'h-10 px-4 text-sm', variants[variant], className)} {...props} />;
}
