import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients/register': 'Patient Registration',
  '/bookings/new': 'Test Booking',
  '/billing': 'Billing & Payment',
  '/samples': 'Sample Tracking',
  '/results/entry': 'Result Entry',
  '/results/verification': 'Result Verification',
  '/reports/preview': 'Final Report Preview',
  '/portal': 'Patient Portal',
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = useMemo(() => titles[location.pathname] ?? 'LabFlow', [location.pathname]);

  return (
    <div className="min-h-screen bg-surface-muted text-ink lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-w-0 flex-1">
        <Header title={title} onMenu={() => setSidebarOpen(true)} />
        <Outlet />
      </div>
    </div>
  );
}
