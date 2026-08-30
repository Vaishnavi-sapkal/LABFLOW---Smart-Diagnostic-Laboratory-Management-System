import { StatusBadge } from '../ui/StatusBadge';

export function ReportPreview({ reportId, patient, doctor, tests }: { reportId: string; patient: string; doctor: string; tests: Array<{ parameter: string; value: string; unit: string; range: string; flag?: string }> }) {
  return (
    <article className="card overflow-hidden">
      <div className="border-b border-border bg-brand-50 p-5">
        <div className="flex items-start justify-between gap-4">
          <div><h2 className="text-lg font-semibold text-brand-700">LabFlow Diagnostic Report</h2><p className="font-mono text-xs text-ink-muted">{reportId}</p></div>
          <StatusBadge tone="success">Verified</StatusBadge>
        </div>
      </div>
      <div className="p-5">
        <div className="grid gap-3 rounded-ui border border-border p-4 text-sm md:grid-cols-2">
          <div><span className="text-ink-muted">Patient</span><p className="font-semibold">{patient}</p></div>
          <div><span className="text-ink-muted">Verified by</span><p className="font-semibold">{doctor}</p></div>
          <div><span className="text-ink-muted">Sample ID</span><p className="font-mono text-xs font-semibold">LAB-2026-08421</p></div>
          <div><span className="text-ink-muted">Report date</span><p className="font-semibold">25 Aug 2026</p></div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-ink-muted"><tr><th className="pb-2">Test</th><th className="pb-2">Value</th><th className="pb-2">Range</th><th className="pb-2">Flag</th></tr></thead>
            <tbody className="divide-y divide-border">
              {tests.map((test) => <tr key={test.parameter}><td className="py-3 font-medium">{test.parameter}</td><td className="py-3 font-mono text-xs">{test.value}</td><td className="py-3 text-ink-muted">{test.unit}</td><td className="py-3 font-mono text-xs text-ink-muted">{test.range}</td><td className="py-3">{test.flag ?? 'Normal'}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}
