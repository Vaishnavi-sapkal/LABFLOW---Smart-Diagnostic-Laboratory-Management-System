import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Billing } from './pages/Billing';
import { Dashboard } from './pages/Dashboard';
import { FinalReportPreview } from './pages/FinalReportPreview';
import { Login } from './pages/Login';
import { Notifications } from './pages/Notifications';
import { PatientPortal } from './pages/PatientPortal';
import { PatientRegistration } from './pages/PatientRegistration';
import { ResultEntry } from './pages/ResultEntry';
import { ResultVerification } from './pages/ResultVerification';
import { SampleTracking } from './pages/SampleTracking';
import { TestBooking } from './pages/TestBooking';

export default function App() {
  return (
    <Routes>
      <Route element={<Navigate replace to="/login" />} path="/" />
      <Route element={<Login />} path="/login" />
      <Route element={<AppLayout />}>
        <Route element={<Dashboard />} path="/dashboard" />
        <Route element={<PatientRegistration />} path="/patients/register" />
        <Route element={<TestBooking />} path="/bookings/new" />
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
