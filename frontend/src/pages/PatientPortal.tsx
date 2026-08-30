import { CalendarDays, Download, FileText, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import { useLabData } from '../app/LabDataContext';
import { doctorById, formatInr } from '../data/mockData';

export function PatientPortal() {
  const { bookings, patients, reports } = useLabData();
  const patient = patients[0];
  const patientReports = reports.filter((report) => report.patientId === patient.id);
  const patientBookings = bookings.filter((booking) => booking.patientId === patient.id);
  const spend = patientBookings.reduce((sum, booking) => sum + booking.amount, 0);

  return (
    <PageContainer>
      <div className="mb-6 rounded-card border border-border bg-white p-5">
        <h2 className="text-lg font-semibold">Welcome, {patient.name}</h2>
        <p className="mt-1 text-sm text-ink-muted">View diagnostic reports, upcoming appointments, and billing history.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
        <section className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard detail="Verified and ready" icon={<FileText size={20} />} label="Reports" value={String(patientReports.length)} />
            <StatCard detail="Next: 29 Aug" icon={<CalendarDays size={20} />} label="Upcoming Bookings" value={String(patientBookings.length)} />
            <StatCard detail="Across 2026" icon={<IndianRupee size={20} />} label="Total Spend" value={formatInr(spend)} />
          </div>
          <section className="card p-5">
            <h2 className="mb-4 text-base font-semibold">Reports</h2>
            <DataTable columns={['Report', 'Test', 'Date', 'Status', 'Download']}>
              {patientReports.map((report) => <tr className="hover:bg-surface-muted" key={report.id}><DataCell className="font-semibold">{report.id}</DataCell><DataCell>CBC + Lipid Profile</DataCell><DataCell>{report.date}</DataCell><DataCell><StatusBadge tone="success">{report.status}</StatusBadge></DataCell><DataCell><Button size="sm" variant="outline"><Download size={14} /> PDF</Button></DataCell></tr>)}
            </DataTable>
          </section>
        </section>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">Upcoming Booking</h2><StatusBadge tone="info">Confirmed</StatusBadge></div>
          <div className="mt-5 grid gap-3 text-sm">
            <p><span className="text-ink-muted">Doctor:</span> {doctorById('DOC-01').name}</p>
            <p><span className="text-ink-muted">Test:</span> Thyroid Profile</p>
            <p><span className="text-ink-muted">Date:</span> 29 Aug 2026</p>
            <p><span className="text-ink-muted">Time:</span> 10:30 AM</p>
            <p><span className="text-ink-muted">Location:</span> LabFlow Pune Central</p>
          </div>
          <Button className="mt-6 w-full" variant="outline">Reschedule</Button>
        </aside>
      </div>
    </PageContainer>
  );
}
