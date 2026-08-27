import { AppColors } from '../../design-system';

export function BookingSummary({ patient, tests, total }: { patient: string; tests: string[]; total: string }) {
  return (
    <aside className="card p-5">
      <h2 className="text-base font-semibold text-ink">Booking summary</h2>
      <p className="mt-1 text-sm text-ink-muted">{patient}</p>
      <div className="my-4 h-px bg-border" />
      <div className="grid gap-3">
        {tests.map((test) => <div className="flex items-center justify-between text-sm" key={test}><span>{test}</span><span style={{ color: AppColors.textSecondary }}>Selected</span></div>)}
      </div>
      <div className="mt-5 flex items-center justify-between rounded-ui bg-brand-50 p-3 text-sm font-semibold text-brand-700">
        <span>Total payable</span>
        <span>{total}</span>
      </div>
    </aside>
  );
}
