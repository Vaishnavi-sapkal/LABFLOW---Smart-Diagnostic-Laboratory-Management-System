import type { LabTest } from '../../types/labflow';
import { formatInr } from '../../lib/currency';
import { Checkbox } from '../ui/Checkbox';

export function TestCard({ test, selected, onToggle }: { test: LabTest; selected: boolean; onToggle: (selected: boolean) => void }) {
  return (
    <label className={`flex items-start gap-3 rounded-ui border p-4 transition ${selected ? 'border-brand-600 bg-brand-50' : 'border-border bg-white hover:bg-surface-muted'}`}>
      <Checkbox checked={selected} onChange={(event) => onToggle(event.target.checked)} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{test.name}</span>
        <span className="block text-xs text-ink-muted">{test.description}</span>
      </span>
      <span className="text-sm font-semibold text-brand-700">{formatInr(test.price)}</span>
    </label>
  );
}
