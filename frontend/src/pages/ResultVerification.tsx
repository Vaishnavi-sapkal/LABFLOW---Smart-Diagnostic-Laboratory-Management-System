import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ResultTable } from '../components/laboratory/ResultTable';
import { Button } from '../components/ui/Button';
import { Select, Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import { useAuth } from '../app/AuthContext';
import { listDoctors, type DoctorDocument } from '../api/doctors';
import { getResult, listResults, type ResultDocument } from '../api/results';
import { createVerification, listVerifications, reviewVerification, type VerificationDocument } from '../api/verifications';
import type { Result } from '../types/labflow';

function toTableResults(result: ResultDocument | null): Result[] {
  if (!result) return [];

  return result.values.map((value) => ({
    parameter: value.parameterName,
    value: value.value === null ? '—' : String(value.value),
    unit: value.unit,
    range: `${value.referenceMin} - ${value.referenceMax}`,
    flag: value.flag === 'high' ? 'High' : value.flag === 'low' ? 'Low' : 'Normal',
  }));
}

export function ResultVerification() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<DoctorDocument[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [linkedDoctor, setLinkedDoctor] = useState(false);
  const [queue, setQueue] = useState<VerificationDocument[]>([]);
  const [selectedVerificationId, setSelectedVerificationId] = useState('');
  const [selectedResult, setSelectedResult] = useState<ResultDocument | null>(null);
  const [doctorComment, setDoctorComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [pageError, setPageError] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const selectedVerification = queue.find((verification) => verification._id === selectedVerificationId) ?? null;

  const refreshQueue = async (id: string) => {
    const pending = await listVerifications({ doctorId: id, status: 'pending' });
    setQueue(pending);
    setSelectedVerificationId((current) => pending.some((verification) => verification._id === current) ? current : pending[0]?._id ?? '');
  };

  useEffect(() => {
    let active = true;

    async function loadVerificationQueue() {
      setLoading(true);
      setPageError('');
      try {
        const activeDoctors = (await listDoctors()).filter((doctor) => doctor.isActive !== false);
        if (!active) return;

        setDoctors(activeDoctors);
        const matchedDoctor = user?.id ? activeDoctors.find((doctor) => doctor.userId === user.id) : undefined;
        const resolvedDoctorId = matchedDoctor?._id ?? activeDoctors[0]?._id ?? '';
        setLinkedDoctor(Boolean(matchedDoctor));
        setDoctorId(resolvedDoctorId);

        if (!resolvedDoctorId) {
          setPageError('No active doctor is available for verification.');
          return;
        }

        const submittedResults = await listResults({ status: 'submitted' });
        await Promise.all(submittedResults.map((result) => createVerification(result._id, resolvedDoctorId)));
        const pending = await listVerifications({ doctorId: resolvedDoctorId, status: 'pending' });
        if (!active) return;

        setQueue(pending);
        setSelectedVerificationId(pending[0]?._id ?? '');
      } catch (error) {
        if (active) setPageError(error instanceof Error ? error.message : 'Unable to load verification queue. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadVerificationQueue();
    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    let active = true;

    async function loadResult() {
      if (!selectedVerification) {
        setSelectedResult(null);
        return;
      }

      setResultLoading(true);
      try {
        const result = await getResult(selectedVerification.resultId);
        if (active) setSelectedResult(result);
      } catch (error) {
        if (active) setReviewError(error instanceof Error ? error.message : 'Unable to load result details. Please try again.');
      } finally {
        if (active) setResultLoading(false);
      }
    }

    void loadResult();
    return () => { active = false; };
  }, [selectedVerification]);

  const changeDoctor = async (id: string) => {
    setDoctorId(id);
    setLinkedDoctor(false);
    setPageError('');
    setLoading(true);
    try {
      await refreshQueue(id);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : 'Unable to load verification queue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    if (status === 'rejected' && !doctorComment.trim()) {
      setReviewError('A doctor comment is required when rejecting a result.');
      return;
    }

    setReviewError('');
    setReviewing(true);
    try {
      await reviewVerification(selectedVerification._id, status, doctorComment.trim() || undefined);
      await refreshQueue(doctorId);
      setDoctorComment('');
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Unable to review verification. Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  const abnormalCount = selectedResult?.abnormalValues?.length ?? 0;

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">Doctor verification</h2><StatusBadge tone={abnormalCount ? 'warning' : 'success'}>{abnormalCount ? `${abnormalCount} abnormal` : 'Ready for review'}</StatusBadge></div>
          {!linkedDoctor && doctors.length > 0 && (
            <label className="mb-4 grid gap-1.5 text-xs font-medium text-ink-muted">Reviewing doctor
              <Select onChange={(event) => void changeDoctor(event.target.value)} value={doctorId}>
                {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.fullName}</option>)}
              </Select>
            </label>
          )}
          {pageError && <p className="mb-4 text-sm text-danger">{pageError}</p>}
          {loading ? <p className="py-10 text-center text-sm text-ink-muted">Loading verification queue…</p> : !selectedVerification ? <p className="py-10 text-center text-sm text-ink-muted">No pending results require review.</p> : (
            <>
              {resultLoading ? <p className="py-8 text-center text-sm text-ink-muted">Loading result values…</p> : <ResultTable results={toTableResults(selectedResult)} />}
              {abnormalCount > 0 && <div className="mt-5 rounded-ui border border-warning bg-warning-light p-4 text-sm text-ink">{abnormalCount} abnormal result{abnormalCount === 1 ? '' : 's'} require doctor review before release.</div>}
              <label className="mt-5 grid gap-1.5 text-xs font-medium text-ink-muted">Doctor Comments<Textarea onChange={(event) => setDoctorComment(event.target.value)} placeholder="Add clinical comments for the final report" value={doctorComment} /></label>
              {reviewError && <p className="mt-3 text-sm text-danger">{reviewError}</p>}
              <div className="mt-5 flex justify-end gap-3"><Button disabled={reviewing} icon={<XCircle size={16} />} onClick={() => void handleReview('rejected')} variant="danger-outline">Reject</Button><Button disabled={reviewing} icon={<CheckCircle2 size={16} />} onClick={() => void handleReview('approved')}>Approve</Button></div>
            </>
          )}
        </section>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <h2 className="text-base font-semibold">Pending Review Queue</h2>
          <div className="mt-4 grid gap-3">
            {queue.map((verification) => <button className={`rounded-ui border p-3 text-left transition ${verification._id === selectedVerificationId ? 'border-brand-600 bg-brand-50' : 'border-border hover:bg-surface-muted'}`} key={verification._id} onClick={() => { setSelectedVerificationId(verification._id); setDoctorComment(''); setReviewError(''); }} type="button"><div className="flex justify-between gap-3"><p className="text-sm font-semibold">{verification.patientName}</p><StatusBadge tone={verification.priority === 'stat' ? 'danger' : verification.priority === 'urgent' ? 'warning' : 'info'}>{verification.priority ?? 'routine'}</StatusBadge></div><p className="mt-1 text-xs text-ink-muted">{verification.reportId} | {verification.testName}</p><p className="mt-2 text-xs text-ink-muted">Submitted {new Date(verification.submittedAt).toLocaleString()}</p></button>)}
            {!loading && queue.length === 0 && <p className="text-sm text-ink-muted">Queue is clear.</p>}
          </div>
        </aside>
      </div>
    </PageContainer>
  );
}
