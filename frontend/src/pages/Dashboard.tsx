import { useEffect, useState } from 'react';
import { Banknote, CalendarCheck, ClipboardList, Users } from 'lucide-react';
import { DoctorCard } from '../components/laboratory/DoctorCard';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useAuth } from '../app/AuthContext';
import { listBookings, type CreatedBooking } from '../api/bookings';
import { getDashboard, type DashboardPeriod, type DashboardResponse } from '../api/dashboard';
import { listDoctors, type DoctorDocument } from '../api/doctors';
import { listPatients, type CreatedPatient } from '../api/patients';
import { listSamples, type GroupedSamples } from '../api/samples';
import { PageContainer } from '../components/layout/PageContainer';

const emptySamples: GroupedSamples = { collected: [], inTransit: [], processing: [], completed: [], rejected: [] };
const formatInr = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function Dashboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<DashboardPeriod>('today');
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [bookings, setBookings] = useState<CreatedBooking[]>([]);
  const [patients, setPatients] = useState<CreatedPatient[]>([]);
  const [samples, setSamples] = useState<GroupedSamples>(emptySamples);
  const [doctors, setDoctors] = useState<DoctorDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');
      try {
        const [dashboardData, bookingData, sampleData, doctorData, patientData] = await Promise.all([
          getDashboard(period),
          listBookings(),
          listSamples(),
          listDoctors(),
          listPatients(),
        ]);
        if (!active) return;

        setDashboard(dashboardData);
        setBookings(bookingData);
        setSamples(sampleData);
        setDoctors(doctorData.filter((doctor) => doctor.isActive !== false));
        setPatients(patientData);
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Unable to load dashboard. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();
    return () => { active = false; };
  }, [period]);

  const sampleCounts = {
    collected: samples.collected.length,
    inTransit: samples.inTransit.length,
    processing: samples.processing.length,
    completed: samples.completed.length,
    rejected: samples.rejected.length,
  };
  const sampleTotal = Object.values(sampleCounts).reduce((sum, count) => sum + count, 0);
  const patientById = (id: string) => patients.find((patient) => patient._id === id);
  const statusTone = (status: string) => status === 'completed' ? 'success' : status === 'cancelled' ? 'danger' : status === 'pending' ? 'warning' : 'info';
  const statusBreakdown = [
    ['Collected', sampleCounts.collected, 'bg-brand-600'],
    ['In Transit', sampleCounts.inTransit, 'bg-accent'],
    ['Processing', sampleCounts.processing, 'bg-warning'],
    ['Completed', sampleCounts.completed, 'bg-success'],
    ['Rejected', sampleCounts.rejected, 'bg-danger'],
  ] as const;

  if (loading) return <PageContainer><div className="card p-10 text-center text-sm text-ink-muted">Loading dashboard…</div></PageContainer>;
  if (error || !dashboard) return <PageContainer><div className="card p-10 text-center text-sm text-danger">{error || 'Unable to load dashboard.'}</div></PageContainer>;

  return (
    <PageContainer>
      <div className="grid gap-6">
        <section className="rounded-[16px] border border-border bg-white p-5 shadow-card">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.03em] text-brand-600">Smart diagnostic command center</p>
              <div className="mt-2 flex flex-wrap items-center gap-3"><h2 className="text-[26px] font-semibold leading-8">Good day, {user?.name ?? 'LabFlow user'}</h2><select className="rounded-ui border border-border bg-white px-2 py-1 text-xs text-ink-muted" onChange={(event) => setPeriod(event.target.value as DashboardPeriod)} value={period}><option value="today">Today</option><option value="week">Week</option><option value="month">Month</option></select></div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Monitor patient intake, billing clearance, lab movement, result verification and report release from a connected operational queue.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ['Collected', sampleCounts.collected],
                ['Processing', sampleCounts.processing],
                ['Reports', sampleCounts.completed],
              ].map(([label, value]) => <div className="rounded-ui bg-brand-50 p-3" key={label}><p className="text-xl font-semibold text-brand-700">{value}</p><p className="text-[11px] font-medium text-ink-muted">{label}</p></div>)}
            </div>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard detail={`For ${dashboard.summary.period}`} icon={<Users size={21} />} label="Patients" value={String(dashboard.summary.totalPatientsToday)} />
          <StatCard detail="In selected period" icon={<CalendarCheck size={21} />} label="Bookings" value={String(dashboard.summary.testsBookedToday)} />
          <StatCard detail="Paid invoices" icon={<Banknote size={21} />} label="Revenue" value={formatInr(dashboard.summary.revenueToday)} />
          <StatCard detail="Draft and submitted" icon={<ClipboardList size={21} />} label="Pending Results" value={String(dashboard.summary.pendingResults)} />
        </section>
        {dashboard.alerts.length > 0 && <section className="grid gap-3 sm:grid-cols-3">{dashboard.alerts.map((alert) => <div className="rounded-ui border border-border bg-white p-3" key={alert.title}><p className="text-xs text-ink-muted">{alert.title}</p><p className="mt-1 text-xl font-semibold text-ink">{alert.count}</p></div>)}</section>}
        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="card p-5">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">Recent Activity</h2><StatusBadge tone="info">Live queue</StatusBadge></div>
            <DataTable columns={['Booking ID', 'Patient', 'Tests', 'Status', 'Slot']}>
              {bookings.map((booking) => {
                const patient = patientById(booking.patientId);
                return <tr className="hover:bg-surface-muted" key={booking.bookingId}><DataCell><span className="font-mono text-xs font-semibold">{booking.bookingId}</span></DataCell><DataCell>{patient?.fullName ?? 'Unknown patient'}<div className="font-mono text-xs text-ink-muted">{patient?.patientId ?? booking.patientId}</div></DataCell><DataCell>{booking.items.map((item) => item.name).join(', ')}</DataCell><DataCell><StatusBadge tone={statusTone(booking.status)}>{booking.status}</StatusBadge></DataCell><DataCell className="text-ink-muted">{booking.scheduledSlot}</DataCell></tr>;
              })}
            </DataTable>
          </div>
          <div className="grid gap-6">
            <section className="card p-5">
              <h2 className="text-base font-semibold">Status Breakdown</h2>
              {statusBreakdown.map(([label, count, color]) => {
                const value = sampleTotal ? Math.round((count / sampleTotal) * 100) : 0;
                return <div className="mt-4" key={label}><div className="mb-1 flex justify-between text-sm"><span className="text-ink-muted">{label}</span><span className="font-semibold">{value}%</span></div><div className="h-2 rounded-full bg-surface-muted"><div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} /></div></div>;
              })}
            </section>
            <section className="card p-5">
              <h2 className="text-base font-semibold">Doctors on Floor</h2>
              <div className="mt-4 grid gap-3">
                {doctors.map((doctor) => <DoctorCard doctor={{ id: doctor._id, name: doctor.fullName, specialization: doctor.specialization ?? 'Doctor', status: 'Available' }} key={doctor._id} />)}
                {doctors.length === 0 && <p className="text-sm text-ink-muted">No active doctors available.</p>}
              </div>
            </section>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
