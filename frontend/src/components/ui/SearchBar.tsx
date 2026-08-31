import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@labflow/utils/cn';

export function SearchBar({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" size={16} />
      <input className="focus-ring h-10 w-full rounded-ui border border-border bg-surface-muted pl-9 pr-3 text-sm" {...props} />
    </div>
  );
}
