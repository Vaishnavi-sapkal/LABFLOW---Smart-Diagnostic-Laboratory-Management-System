import { Download, Printer } from 'lucide-react';
import { ReportPreview } from '../components/laboratory/ReportPreview';
import { Button } from '../components/ui/Button';
import { PageContainer } from '../components/layout/PageContainer';
import { doctorById, patientById, reports } from '../data/mockData';

export function FinalReportPreview() {
  const report = reports[0];
  const patient = patientById(report.patientId);
  const doctor = doctorById(report.doctorId);

  return (
    <PageContainer>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">Printable diagnostic report for patient handoff.</p>
        <div className="flex gap-3"><Button icon={<Printer size={16} />} variant="outline">Print</Button><Button icon={<Download size={16} />}>Download</Button></div>
      </div>
      <ReportPreview doctor={doctor.name} patient={`${patient.name} | ${patient.age} yrs | ${patient.gender}`} reportId={report.id} tests={report.results} />
      <section className="mt-6 card p-5">
        <h2 className="text-base font-semibold">Clinical Remarks</h2>
        <p className="mt-2 text-sm leading-6 text-ink-muted">Mild leukocytosis observed. Correlate clinically with symptoms and repeat CBC if fever persists. Remaining parameters are within acceptable limits.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-ui border border-border p-4"><p className="text-xs text-ink-muted">Lab Technician</p><p className="mt-6 font-semibold">Mehul Shah</p></div>
          <div className="rounded-ui border border-border p-4"><p className="text-xs text-ink-muted">Verified By Doctor</p><p className="mt-6 font-semibold">{doctor.name}</p></div>
        </div>
      </section>
    </PageContainer>
  );
}
