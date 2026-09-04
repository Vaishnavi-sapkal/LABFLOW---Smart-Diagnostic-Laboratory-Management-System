import { Navigate, Route, Routes } from 'react-router-dom';
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

export default function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<ReportVerification />} path="/verify" />
      <Route element={<AppLayout />}>
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<PatientRegistration />} path="/patients/register" />
        <Route element={<DoctorManagement />} path="/doctors" />
        <Route element={<TestBooking />} path="/bookings/new" />
        <Route element={<TestManagement />} path="/tests/manage" />
        <Route element={<Billing />} path="/billing" />
        <Route element={<SampleTracking />} path="/samples" />
        <Route element={<ResultEntry />} path="/results/entry/:sampleId" />
        <Route element={<ResultVerification />} path="/results/verification" />
        <Route element={<FinalReportPreview />} path="/reports/preview" />
        <Route element={<PatientPortal />} path="/portal" />
        <Route element={<Notifications />} path="/notifications" />
      </Route>
      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  );
}
