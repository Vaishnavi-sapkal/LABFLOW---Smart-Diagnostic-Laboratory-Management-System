import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Send } from 'lucide-react';
import { useAuth } from '../app/AuthContext';
import { getBooking } from '../api/bookings';
import {
  createResult,
  listResults,
  submitResult,
  updateRemarks,
  updateValues,
  type ResultDocument,
  type ResultValue,
} from '../api/results';
import { getSample, type SampleDocument } from '../api/samples';
import { ResultTable } from '../components/laboratory/ResultTable';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import type { Result } from '../types/labflow';

const statusTone = {
  draft: 'warning',
  submitted: 'info',
  verified: 'success',
  rejected: 'danger',
} as const;

const flagMap: Record<ResultValue['flag'], Result['flag']> = {
  pending: 'Pending',
  normal: 'Normal',
  low: 'Low',
  high: 'High',
};

function toTableResults(values: ResultValue[]): Result[] {
  return values.map((value) => ({
    parameter: value.parameterName,
    value: value.value === null ? '' : String(value.value),
    unit: value.unit,
    range: `${value.referenceMin} - ${value.referenceMax}`,
    flag: flagMap[value.flag],
  }));
}

export function ResultEntry() {
  const { sampleId } = useParams<{ sampleId: string }>();
  const { user } = useAuth();
  const [sample, setSample] = useState<SampleDocument | null>(null);
  const [result, setResult] = useState<ResultDocument | null>(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [savingValues, setSavingValues] = useState(false);
  const [savingRemarks, setSavingRemarks] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadResult = async () => {
      setLoading(true);
      setLoadError('');
      setActionError('');

      if (!sampleId) {
        setLoadError('A sample ID is required to enter results.');
        setLoading(false);
        return;
      }

      try {
        const loadedSample = await getSample(sampleId);
        setSample(loadedSample);

        const resultFilters: { sampleId: string; status?: string } = { sampleId };
        const existingResults = await listResults(resultFilters);
        const existingResult = existingResults.find((item) => item.status === 'draft' || item.status === 'submitted');
        let loadedResult = existingResult;

        if (!loadedResult) {
          const booking = await getBooking(loadedSample.bookingId);
          const testId = booking.items[0]?.testId;
          if (!testId) throw new Error('This booking has no test item to create a result for.');

          loadedResult = await createResult({
            sampleId: loadedSample.sampleId,
            bookingId: loadedSample.bookingId,
            patientId: loadedSample.patientId,
            testId,
            enteredBy: user?.name,
          });
        }

        setResult(loadedResult);
        setRemarks(loadedResult.remarks ?? '');
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Unable to load result entry. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    void loadResult();
  }, [sampleId, user?.name]);

  const editable = result?.status === 'draft' && !savingValues && !savingRemarks && !submitting;

  const handleValueChange = (index: number, input: string) => {
    if (!editable) return;

    const value = input.trim() === '' ? null : Number(input);
    setResult((current) => {
      if (!current) return current;
      return {
        ...current,
        values: current.values.map((item, itemIndex) => itemIndex === index
          ? { ...item, value: Number.isNaN(value) ? null : value }
          : item),
      };
    });
  };

  const handleSaveDraft = async () => {
    if (!result || !editable) return;

    setSavingValues(true);
    setActionError('');
    try {
      const updatedResult = await updateValues(result._id, {
        values: result.values
          .filter((value): value is ResultValue & { value: number } => value.value !== null && Number.isFinite(value.value))
          .map(({ parameterName, value }) => ({ parameterName, value })),
      });
      setResult(updatedResult);
      setRemarks(updatedResult.remarks ?? '');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to save result values. Please try again.');
    } finally {
      setSavingValues(false);
    }
  };

  const handleSaveRemarks = async () => {
    if (!result || !editable) return;

    setSavingRemarks(true);
    setActionError('');
    try {
      const updatedResult = await updateRemarks(result._id, { remarks });
      setResult(updatedResult);
      setRemarks(updatedResult.remarks ?? '');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to save technician notes. Please try again.');
    } finally {
      setSavingRemarks(false);
    }
  };

  const handleSubmit = async () => {
    if (!result || !editable) return;

    setSubmitting(true);
    setActionError('');
    try {
      const updatedResult = await submitResult(result._id);
      setResult(updatedResult);
      setRemarks(updatedResult.remarks ?? '');
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to submit result. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PageContainer><div className="card p-8 text-center text-sm text-ink-muted">Loading result entry...</div></PageContainer>;
  }

  if (loadError || !sample || !result) {
    return <PageContainer><div className="card p-8 text-center text-sm text-danger">{loadError || 'Unable to load result entry. Please try again.'}</div></PageContainer>;
  }

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-base font-semibold">Editable result table</h2><p className="text-sm text-ink-muted">{sample.testDisplayName} parameters</p></div><StatusBadge tone={statusTone[result.status]}>{result.status}</StatusBadge></div>
          <ResultTable editable={editable} onValueChange={handleValueChange} results={toTableResults(result.values)} />
          <div className="mt-5"><label className="grid gap-1.5 text-xs font-medium text-ink-muted">Technician Notes<Textarea disabled={!editable} onChange={(event) => setRemarks(event.target.value)} value={remarks} /></label><div className="mt-2"><Button disabled={!editable} onClick={() => void handleSaveRemarks()} size="sm" type="button" variant="outline">{savingRemarks ? 'Saving notes...' : 'Save notes'}</Button></div></div>
          {actionError && <p className="mt-3 text-sm text-danger">{actionError}</p>}
          <div className="mt-5 flex justify-end gap-3"><Button disabled={!editable} icon={<Save size={16} />} onClick={() => void handleSaveDraft()} variant="outline">{savingValues ? 'Saving...' : 'Save Draft'}</Button><Button disabled={!editable} icon={<Send size={16} />} onClick={() => void handleSubmit()}>{submitting ? 'Submitting...' : result.status === 'submitted' ? 'Submitted' : 'Submit for Verification'}</Button></div>
        </section>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <h2 className="text-base font-semibold">Sample Metadata</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <p><span className="text-ink-muted">Sample ID:</span> {sample.sampleId}</p>
            <p><span className="text-ink-muted">Patient:</span> {sample.patientName}</p>
            <p><span className="text-ink-muted">Test:</span> {sample.testDisplayName}</p>
            <p><span className="text-ink-muted">Last updated:</span> {sample.statusUpdatedAt}</p>
            <p><span className="text-ink-muted">Technician:</span> {sample.handledBy}</p>
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
