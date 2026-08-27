import { CheckCircle2, XCircle } from 'lucide-react';
import { ResultTable } from '../components/laboratory/ResultTable';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import { patientById, reportResults, samples } from '../data/mockData';

export function ResultVerification() {
  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">Doctor verification</h2><StatusBadge tone="danger">1 abnormal</StatusBadge></div>
          <ResultTable results={reportResults} />
          <div className="mt-5 rounded-ui border border-warning bg-warning-light p-4 text-sm text-ink">Technician note: WBC is mildly elevated. Recommend doctor review before release.</div>
          <label className="mt-5 grid gap-1.5 text-xs font-medium text-ink-muted">Doctor Comments<Textarea placeholder="Add clinical comments for the final report" /></label>
          <div className="mt-5 flex justify-end gap-3"><Button icon={<XCircle size={16} />} variant="danger-outline">Reject</Button><Button icon={<CheckCircle2 size={16} />}>Approve</Button></div>
        </section>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <h2 className="text-base font-semibold">Pending Review Queue</h2>
          <div className="mt-4 grid gap-3">
            {samples.slice(0, 4).map((sample) => <article className="rounded-ui border border-border p-3" key={sample.id}><div className="flex justify-between gap-3"><p className="text-sm font-semibold">{patientById(sample.patientId).name}</p><StatusBadge tone={sample.status === 'Delayed' ? 'danger' : 'warning'}>{sample.status === 'Delayed' ? 'Priority' : 'Review'}</StatusBadge></div><p className="mt-1 text-xs text-ink-muted">{sample.id} | {sample.testName}</p><p className="mt-2 text-xs text-ink-muted">Submitted {sample.time}</p></article>)}
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
