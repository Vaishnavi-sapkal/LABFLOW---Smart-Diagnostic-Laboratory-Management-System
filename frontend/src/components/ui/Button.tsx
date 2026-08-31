import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@labflow/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline';
type ButtonSize = 'sm' | 'md';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border bg-white text-ink hover:bg-surface-muted',
  outline: 'border border-brand-600 bg-white text-brand-700 hover:bg-brand-50',
  ghost: 'text-ink-muted hover:bg-surface-muted',
  danger: 'bg-danger text-white hover:brightness-95',
  'danger-outline': 'border border-danger bg-white text-danger hover:bg-danger-light',
};

export function Button({ className, icon, children, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-ui font-semibold transition',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10 px-4 text-sm',
        variants[variant],
        variant === 'secondary' && 'border-border',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
