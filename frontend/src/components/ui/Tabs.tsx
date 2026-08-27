import { cn } from '@labflow/utils/cn';

export function Tabs<T extends string>({ items, value, onChange }: { items: T[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="inline-flex rounded-ui border border-border bg-surface-muted p-1">
      {items.map((item) => (
        <button className={cn('h-8 rounded-md px-3 text-sm font-semibold transition', value === item ? 'bg-white text-brand-700 shadow-card' : 'text-ink-muted hover:text-ink')} key={item} onClick={() => onChange(item)} type="button">
          {item}
        </button>
      ))}
    </div>
  );
}
