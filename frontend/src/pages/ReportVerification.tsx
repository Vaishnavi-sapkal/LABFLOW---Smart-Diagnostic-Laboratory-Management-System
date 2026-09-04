import { useState, type FormEvent } from 'react';
import { BadgeCheck, Search, XCircle } from 'lucide-react';
import { verifyReport, type ReportVerification as VerifiedReport } from '../api/reports';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not available';
}

export function ReportVerification() {
  const [reportNo, setReportNo] = useState('');
  const [report, setReport] = useState<VerifiedReport | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reportNo.trim()) return;

    setLoading(true);
    setError('');
    setReport(null);
    try {
      const verifiedReport = await verifyReport(reportNo.trim());
      if (!verifiedReport.valid) {
        setError('This report number is not valid.');
        return;
      }
      setReport(verifiedReport);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Report not found or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-surface-muted p-6">
      <section className="w-full max-w-xl rounded-card border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600"><BadgeCheck size={26} /></div><h1 className="text-2xl font-extrabold text-ink">Verify Lab Report</h1><p className="mt-2 text-sm text-ink-muted">Enter a LabFlow report number to confirm its authenticity.</p></div>
        <form className="flex gap-2" onSubmit={handleVerify}><Input onChange={(event) => setReportNo(event.target.value)} placeholder="e.g. LF-RPT-2609-001" value={reportNo} /><Button disabled={loading || !reportNo.trim()} icon={<Search size={16} />} type="submit">{loading ? 'Verifying...' : 'Verify'}</Button></form>
        {report && <div className="mt-6 rounded-card border border-success/30 bg-success-light p-5 text-center"><BadgeCheck className="mx-auto text-success" size={34} /><h2 className="mt-2 font-semibold text-success">Verified Report</h2><dl className="mt-4 grid gap-2 text-sm text-ink"><div><dt className="text-ink-muted">Report number</dt><dd className="font-mono font-semibold">{report.reportNo}</dd></div><div><dt className="text-ink-muted">Patient</dt><dd className="font-semibold">{report.patientName}</dd></div><div><dt className="text-ink-muted">Test</dt><dd>{report.testName}</dd></div><div><dt className="text-ink-muted">Issue date</dt><dd>{formatDate(report.reportDate)}</dd></div></dl></div>}
        {error && <div className="mt-6 rounded-card border border-danger/30 bg-danger-light p-5 text-center"><XCircle className="mx-auto text-danger" size={34} /><h2 className="mt-2 font-semibold text-danger">Report Not Verified</h2><p className="mt-2 text-sm text-danger">{error}</p></div>}
      </section>
    </main>
  );
}
