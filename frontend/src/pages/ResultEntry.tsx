import { useState } from 'react';
import { Save, Send } from 'lucide-react';
import { useLabData } from '../app/LabDataContext';
import { ResultTable } from '../components/laboratory/ResultTable';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import { reportResults } from '../data/mockData';
import type { Result } from '../types/labflow';

function flagFor(parameter: string, value: string): Result['flag'] {
  const numeric = Number(value);
  if (parameter === 'WBC' && numeric > 10) return 'High';
  if (parameter === 'Hemoglobin' && numeric < 12) return 'Low';
  return 'Normal';
}

export function ResultEntry() {
  const { patients, samples, updateSampleStatus } = useLabData();
  const sample = samples.find((item) => item.status === 'Processing' || item.status === 'Delayed') ?? samples[0];
  const patient = patients.find((item) => item.id === sample.patientId) ?? patients[0];
  const [results, setResults] = useState<Result[]>(reportResults);
  const [submitted, setSubmitted] = useState(false);

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-semibold">Editable result table</h2><p className="text-sm text-ink-muted">{sample.testName} parameters</p></div><StatusBadge tone={submitted ? 'info' : 'warning'}>{submitted ? 'Submitted' : 'Draft'}</StatusBadge></div>
          <ResultTable editable onValueChange={(index, value) => setResults((current) => current.map((result, itemIndex) => itemIndex === index ? { ...result, value, flag: flagFor(result.parameter, value) } : result))} results={results} />
          <div className="mt-5"><label className="grid gap-1.5 text-xs font-medium text-ink-muted">Technician Notes<Textarea defaultValue="WBC is mildly elevated. Recommend doctor review before release." /></label></div>
          <div className="mt-5 flex justify-end gap-3"><Button icon={<Save size={16} />} variant="outline">Save Draft</Button><Button disabled={submitted} icon={<Send size={16} />} onClick={() => { updateSampleStatus(sample.id, 'Processing'); setSubmitted(true); }}>{submitted ? 'Submitted' : 'Submit for Verification'}</Button></div>
        </section>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <h2 className="text-base font-semibold">Sample Metadata</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <p><span className="text-ink-muted">Sample ID:</span> {sample.id}</p>
            <p><span className="text-ink-muted">Patient:</span> {patient.name}</p>
            <p><span className="text-ink-muted">Test:</span> {sample.testName}</p>
            <p><span className="text-ink-muted">Collection:</span> {sample.time}</p>
            <p><span className="text-ink-muted">Technician:</span> Mehul Shah</p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
