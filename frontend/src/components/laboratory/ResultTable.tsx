import type { Result } from '../../types/labflow';
import { Input } from '../ui/Input';
import { StatusBadge } from '../ui/StatusBadge';

export function ResultTable({ results, editable, onValueChange }: { results: Result[]; editable?: boolean; onValueChange?: (index: number, value: string) => void }) {
  return (
    <div className="overflow-hidden rounded-card border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-[0.03em] text-ink-muted">
            <tr><th className="px-4 py-3">Parameter</th><th className="px-4 py-3">Result</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3">Reference Range</th><th className="px-4 py-3">Flag</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {results.map((result, index) => (
              <tr className={result.flag === 'High' || result.flag === 'Low' ? 'bg-danger-light/45' : 'hover:bg-surface-muted'} key={result.parameter}>
                <td className="px-4 py-3 font-semibold">{result.parameter}</td>
                <td className="px-4 py-3">{editable ? <Input className="h-9 w-28" onChange={(event) => onValueChange?.(index, event.target.value)} value={result.value} /> : result.value}</td>
                <td className="px-4 py-3 text-ink-muted">{result.unit}</td>
                <td className="px-4 py-3 text-ink-muted">{result.range}</td>
                <td className="px-4 py-3"><StatusBadge tone={result.flag === 'Normal' ? 'success' : 'danger'}>{result.flag}</StatusBadge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
