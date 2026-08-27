import { Activity, Banknote, CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { Avatar } from '../components/ui/Avatar';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { bookings, doctors, formatInr, patientById } from '../data/mockData';
import { PageContainer } from '../components/layout/PageContainer';

export function Dashboard() {
  return (
    <PageContainer>
      <div className="grid gap-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard detail="+14% from last week" icon={<Users size={21} />} label="Patients" value="1,284" />
          <StatCard detail="38 scheduled today" icon={<CalendarCheck size={21} />} label="Bookings" value="128" />
          <StatCard detail="Today collection" icon={<Banknote size={21} />} label="Revenue" value={formatInr(284500)} />
          <StatCard detail="Needs verification" icon={<ClipboardList size={21} />} label="Pending Results" value="24" />
        </section>
        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">Recent Activity</h2><StatusBadge tone="info">Live queue</StatusBadge></div>
            <DataTable columns={['Booking ID', 'Patient', 'Tests', 'Status', 'Slot']}>
              {bookings.map((booking) => {
                const patient = patientById(booking.patientId);
                return <tr className="hover:bg-surface-muted" key={booking.id}><DataCell><span className="font-semibold">{booking.id}</span></DataCell><DataCell>{patient.name}<div className="text-xs text-ink-muted">{patient.id}</div></DataCell><DataCell>{booking.testIds.length} selected</DataCell><DataCell><StatusBadge tone={booking.status === 'Report ready' ? 'success' : booking.status === 'Awaiting payment' ? 'warning' : 'info'}>{booking.status}</StatusBadge></DataCell><DataCell className="text-ink-muted">{booking.slot}</DataCell></tr>;
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
              <div className="mt-4 grid gap-4">
                {doctors.map((doctor) => <div className="flex items-center gap-3" key={doctor.id}><Avatar name={doctor.name} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{doctor.name}</p><p className="text-xs text-ink-muted">{doctor.specialization}</p></div><span className={`h-2.5 w-2.5 rounded-full ${doctor.status === 'Available' ? 'bg-success' : doctor.status === 'Off duty' ? 'bg-ink-subtle' : 'bg-warning'}`} /></div>)}
              </div>
            </section>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
