import { Check } from 'lucide-react';

export function StepTracker({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {steps.map((step, index) => {
        const complete = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div className="flex items-center gap-3 rounded-ui border border-border bg-white p-3" key={step}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${complete ? 'bg-success text-white' : active ? 'bg-brand-600 text-white' : 'bg-surface-muted text-ink-muted'}`}>
              {complete ? <Check size={15} /> : index + 1}
            </span>
            <span className={active ? 'text-sm font-semibold text-ink' : 'text-sm text-ink-muted'}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}
