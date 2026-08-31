import { Activity, Banknote, CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { DoctorCard } from '../components/laboratory/DoctorCard';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useLabData } from '../app/LabDataContext';
import { doctors, formatInr } from '../data/mockData';
import { PageContainer } from '../components/layout/PageContainer';

export function Dashboard() {
  const { bookings, patients, reports, samples } = useLabData();
  const revenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const patientById = (id: string) => patients.find((patient) => patient.id === id) ?? patients[0];

  return (
    <PageContainer>
      <div className="grid gap-6">
        <section className="rounded-[16px] border border-border bg-white p-5 shadow-card">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.03em] text-brand-600">Smart diagnostic command center</p>
              <h2 className="mt-2 text-[26px] font-semibold leading-8">Good morning, Kavya</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Monitor patient intake, billing clearance, lab movement, result verification and report release from a connected operational queue.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Collected', samples.filter((sample) => sample.status === 'Collected').length],
                ['Processing', samples.filter((sample) => sample.status === 'Processing').length],
                ['Reports', reports.length],
              ].map(([label, value]) => <div className="rounded-ui bg-brand-50 p-3" key={label}><p className="text-xl font-semibold text-brand-700">{value}</p><p className="text-[11px] font-medium text-ink-muted">{label}</p></div>)}
            </div>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard detail="+14% from last week" icon={<Users size={21} />} label="Patients" value={String(patients.length)} />
          <StatCard detail="Scheduled today" icon={<CalendarCheck size={21} />} label="Bookings" value={String(bookings.length)} />
          <StatCard detail="Cleared and pending bills" icon={<Banknote size={21} />} label="Revenue" value={formatInr(revenue)} />
          <StatCard detail="Needs verification" icon={<ClipboardList size={21} />} label="Pending Results" value={String(samples.filter((sample) => sample.status === 'Processing' || sample.status === 'Delayed').length)} />
        </section>
        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">Recent Activity</h2><StatusBadge tone="info">Live queue</StatusBadge></div>
            <DataTable columns={['Booking ID', 'Patient', 'Tests', 'Status', 'Slot']}>
              {bookings.map((booking) => {
                const patient = patientById(booking.patientId);
                return <tr className="hover:bg-surface-muted" key={booking.id}><DataCell><span className="font-mono text-xs font-semibold">{booking.id}</span></DataCell><DataCell>{patient.name}<div className="font-mono text-xs text-ink-muted">{patient.id}</div></DataCell><DataCell>{booking.testIds.length} selected</DataCell><DataCell><StatusBadge tone={booking.status === 'Report ready' ? 'success' : booking.status === 'Awaiting payment' ? 'warning' : 'info'}>{booking.status}</StatusBadge></DataCell><DataCell className="text-ink-muted">{booking.slot}</DataCell></tr>;
              })}
            </DataTable>
          </div>
          <div className="grid gap-6">
            <section className="card p-5">
              <h2 className="text-base font-semibold">Status Breakdown</h2>
              {[
                ['Collected', 78, 'bg-brand-600'],
                ['Processing', 54, 'bg-accent'],
                ['Verified', 41, 'bg-success'],
                ['Delayed', 12, 'bg-danger'],
              ].map(([label, value, color]) => <div className="mt-4" key={label}><div className="mb-1 flex justify-between text-sm"><span className="text-ink-muted">{label}</span><span className="font-semibold">{value}%</span></div><div className="h-2 rounded-full bg-surface-muted"><div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} /></div></div>)}
            </section>
            <section className="card p-5">
              <h2 className="text-base font-semibold">Doctors on Floor</h2>
              <div className="mt-4 grid gap-3">
                {doctors.map((doctor) => <DoctorCard doctor={doctor} key={doctor.id} />)}
              </div>
            </section>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
