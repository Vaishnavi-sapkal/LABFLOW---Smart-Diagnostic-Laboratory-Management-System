import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '@labflow/utils/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn('focus-ring h-10 w-full rounded-ui border border-border bg-white px-3 text-sm text-ink placeholder:text-ink-subtle', className)}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn('focus-ring h-10 w-full rounded-ui border border-border bg-white px-3 text-sm text-ink', className)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn('focus-ring min-h-24 w-full rounded-ui border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-subtle', className)}
      {...props}
    />
  );
}
