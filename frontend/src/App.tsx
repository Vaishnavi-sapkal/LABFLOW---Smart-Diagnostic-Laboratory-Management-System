import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './app/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { Billing } from './pages/Billing';
import { Dashboard } from './pages/Dashboard';
import { DoctorManagement } from './pages/DoctorManagement';
import { FinalReportPreview } from './pages/FinalReportPreview';
import { Login } from './pages/Login';
import { Notifications } from './pages/Notifications';
import { PatientPortal } from './pages/PatientPortal';
import { PatientRegistration } from './pages/PatientRegistration';
import { ResultEntry } from './pages/ResultEntry';
import { ResultVerification } from './pages/ResultVerification';
import { ReportVerification } from './pages/ReportVerification';
import { SampleTracking } from './pages/SampleTracking';
import { TestBooking } from './pages/TestBooking';
import { TestManagement } from './pages/TestManagement';
import { AccountManagement } from './pages/AccountManagement';
import type { Role } from './types/labflow';

function RequireRole({ roles }: { roles: Role[] }) {
  const { role, user } = useAuth();
  if (!user || !roles.includes(role)) return <Navigate replace to="/login" />;
  return <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<ReportVerification />} path="/verify" />
      <Route element={<AppLayout />}>
        <Route element={<RequireRole roles={['Admin']} />}>
          <Route element={<Dashboard />} path="/dashboard" />
        </Route>
        <Route element={<RequireRole roles={['Admin', 'Receptionist']} />}>
          <Route element={<PatientRegistration />} path="/patients/register" />
        </Route>
        <Route element={<RequireRole roles={['Admin']} />}>
          <Route element={<AccountManagement />} path="/accounts/create" />
        </Route>
        <Route element={<RequireRole roles={['Admin']} />}>
          <Route element={<DoctorManagement />} path="/doctors" />
          <Route element={<TestManagement />} path="/tests/manage" />
        </Route>
        <Route element={<RequireRole roles={['Admin', 'Receptionist']} />}>
          <Route element={<TestBooking />} path="/bookings/new" />
        </Route>
        <Route element={<RequireRole roles={['Admin', 'Receptionist']} />}>
          <Route element={<Billing />} path="/billing" />
        </Route>
        <Route element={<RequireRole roles={['Admin', 'Lab Technician']} />}>
          <Route element={<SampleTracking />} path="/samples" />
          <Route element={<ResultEntry />} path="/results/entry/:sampleId" />
        </Route>
        <Route element={<RequireRole roles={['Doctor']} />}>
          <Route element={<ResultVerification />} path="/results/verification" />
        </Route>
        <Route element={<RequireRole roles={['Admin', 'Doctor', 'Lab Technician']} />}>
          <Route element={<FinalReportPreview />} path="/reports/preview" />
        </Route>
        <Route element={<RequireRole roles={['Patient']} />}>
          <Route element={<PatientPortal />} path="/portal" />
        </Route>
        <Route element={<RequireRole roles={['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Patient']} />}>
          <Route element={<Notifications />} path="/notifications" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  );
}
