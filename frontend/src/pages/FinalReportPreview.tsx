import { useEffect, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { ReportPreview } from '../components/laboratory/ReportPreview';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { PageContainer } from '../components/layout/PageContainer';
import { getReport, listReports, type ReportDocument } from '../api/reports';
import { getSample } from '../api/samples';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function FinalReportPreview() {
  const [reports, setReports] = useState<ReportDocument[]>([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [report, setReport] = useState<ReportDocument | null>(null);
  const [technician, setTechnician] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadReports() {
      setLoading(true);
      setError('');
      try {
        const items = await listReports();
        if (!active) return;
        setReports(items);
        setSelectedReportId(items[0]?._id ?? '');
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load reports. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadReports();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadSelectedReport() {
      if (!selectedReportId) {
        setReport(null);
        setTechnician('');
        return;
      }

      setLoading(true);
      setError('');
      try {
        const selectedReport = await getReport(selectedReportId);
        if (!active) return;
        setReport(selectedReport);
        try {
          const sample = await getSample(selectedReport.sampleId);
          if (active) setTechnician(sample.handledBy);
        } catch {
          if (active) setTechnician('');
        }
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load report. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSelectedReport();
    return () => { active = false; };
  }, [selectedReportId]);

  const tests = (report?.values ?? []).map((value) => ({
    parameter: value.parameterName,
    value: value.value === null ? '—' : String(value.value),
    unit: value.unit,
    range: `${value.referenceMin} - ${value.referenceMax}`,
    flag: value.flag,
  }));

  return (
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">Printable diagnostic report for patient handoff.</p>
        <div className="flex gap-3"><Button icon={<Printer size={16} />} variant="outline">Print</Button><Button icon={<Download size={16} />}>Download</Button></div>
      </div>
      {reports.length > 0 && <label className="mb-5 grid max-w-md gap-1.5 text-xs font-medium text-ink-muted">Report
        <Select onChange={(event) => setSelectedReportId(event.target.value)} value={selectedReportId}>
          {reports.map((item) => <option key={item._id} value={item._id}>{item.reportNo} · {item.patientName}</option>)}
        </Select>
      </label>}
      {loading ? <div className="card p-10 text-center text-sm text-ink-muted">Loading report…</div> : error ? <div className="card p-10 text-center text-sm text-danger">{error}</div> : report ? <>
        <ReportPreview doctor={report.doctorName} patient={`${report.patientName}${report.patientAge !== undefined ? ` | ${report.patientAge} yrs` : ''}${report.patientGender ? ` | ${report.patientGender}` : ''}`} reportDate={formatDate(report.reportDate)} reportId={report.reportNo} sampleId={report.sampleId} tests={tests} />
        <section className="mt-6 card p-5">
          <h2 className="text-base font-semibold">Clinical Remarks</h2>
          <p className="mt-2 text-sm leading-6 text-ink-muted">{report.clinicalRemarks?.trim() || 'No additional remarks.'}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-ui border border-border p-4"><p className="text-xs text-ink-muted">Lab Technician</p>{technician && <p className="mt-6 font-semibold">{technician}</p>}</div>
            <div className="rounded-ui border border-border p-4"><p className="text-xs text-ink-muted">Verified By Doctor</p><p className="mt-6 font-semibold">{report.doctorName}</p></div>
          </div>
        </section>
      </> : <div className="card p-10 text-center text-sm text-ink-muted">No reports are available yet.</div>}
    </PageContainer>
  );
}
