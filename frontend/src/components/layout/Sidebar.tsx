import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { Banknote, Bell, ClipboardCheck, FileText, FlaskConical, Home, LayoutDashboard, Microscope, ReceiptText, Stethoscope, TestTubeDiagonal, UserPlus } from 'lucide-react';
import { cn } from '@labflow/utils/cn';
import { useAuth } from '../../app/AuthContext';
import { useUnreadNotificationsCount } from '../../hooks/useUnreadNotificationsCount';
import type { Role } from '../../types/labflow';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles: Role[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Admin', 'Doctor', 'Receptionist', 'Lab Technician'] },
  { label: 'Patients', path: '/patients/register', icon: UserPlus, roles: ['Admin', 'Receptionist'] },
  { label: 'Doctors', path: '/doctors', icon: Stethoscope, roles: ['Admin'] },
  { label: 'Manage Tests', path: '/tests/manage', icon: FlaskConical, roles: ['Admin'] },
  { label: 'Test Booking', path: '/bookings/new', icon: ClipboardCheck, roles: ['Admin', 'Receptionist', 'Patient'] },
  { label: 'Billing', path: '/billing', icon: Banknote, roles: ['Admin', 'Receptionist'] },
  { label: 'Sample Tracking', path: '/samples', icon: FlaskConical, roles: ['Admin', 'Lab Technician'] },
  { label: 'Result Entry', path: '/results/entry', icon: Microscope, roles: ['Lab Technician'] },
  { label: 'Verification', path: '/results/verification', icon: ReceiptText, roles: ['Doctor'] },
  { label: 'Reports', path: '/reports/preview', icon: FileText, roles: ['Admin', 'Doctor', 'Lab Technician'] },
  { label: 'My Portal', path: '/portal', icon: Home, roles: ['Patient'] },
  { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Patient'] },
];

const roleLabels: Record<Role, string> = {
  Admin: 'Administrator',
  Doctor: 'Dr. Priya Sharma',
  'Lab Technician': 'Lab Technician',
  Receptionist: 'Receptionist',
  Patient: 'Patient',
};

const roleBadgeClass: Record<Role, string> = {
  Admin: 'bg-purple-100 text-purple-700',
  Doctor: 'bg-blue-100 text-blue-700',
  'Lab Technician': 'bg-teal-100 text-teal-700',
  Receptionist: 'bg-amber-100 text-amber-700',
  Patient: 'bg-green-100 text-green-700',
};

export function Sidebar({ expanded, mobileOpen, onCloseMobile }: { expanded: boolean; mobileOpen: boolean; onCloseMobile: () => void }) {
  const { role } = useAuth();
  const visibleNav = navItems.filter((item) => item.roles.includes(role));
  const unreadCount = useUnreadNotificationsCount();

  return (
    <>
      <button aria-label="Close navigation" className={cn('fixed inset-0 z-30 bg-ink/30 lg:hidden', mobileOpen ? 'block' : 'hidden')} onClick={onCloseMobile} type="button" />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden bg-sidebar transition-[width,min-width,transform] duration-200 ease-out lg:static lg:translate-x-0',
          expanded ? 'w-[var(--size-sidebar)] min-w-[var(--size-sidebar)]' : 'w-[var(--size-sidebar-collapsed)] min-w-[var(--size-sidebar-collapsed)]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex min-h-[var(--size-header)] items-center gap-2.5 border-b border-white/[0.06] px-4 py-5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-ui bg-gradient-to-br from-brand-600 to-accent text-white">
            <TestTubeDiagonal size={18} />
          </div>
          {expanded ? (
            <div className="min-w-0">
              <div className="text-base font-bold leading-none tracking-[-0.3px] text-white">LabFlow</div>
              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[rgb(var(--sidebar-logo-muted))]">Diagnostics</div>
            </div>
          ) : null}
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3" aria-label="Primary navigation">
          {visibleNav.map(({ label, path, icon: Icon }) => (
            <NavLink
              className={({ isActive }) => cn(
                'relative mb-0.5 flex w-full items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-md px-2.5 py-[9px] text-left text-[13.5px] transition-colors',
                isActive ? 'bg-brand-600/25 font-semibold text-[rgb(var(--sidebar-active))]' : 'font-normal text-[rgb(var(--sidebar-text))] hover:bg-white/[0.05]',
                !expanded && 'justify-center px-0',
              )}
              key={path}
              onClick={onCloseMobile}
              title={!expanded ? label : undefined}
              to={path}
            >
              {({ isActive }) => (
                <>
                  {isActive ? <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-sm bg-[rgb(var(--sidebar-active))]" /> : null}
                  <Icon className={isActive ? 'text-[rgb(var(--sidebar-active))]' : 'text-[rgb(var(--sidebar-logo-muted))]'} size={18} />
                  {expanded ? <span>{label}</span> : null}
                  {expanded && label === 'Notifications' && unreadCount > 0 ? (
                    <span className="ml-auto min-w-[18px] rounded-full bg-danger px-1.5 py-px text-center text-[10px] font-bold text-white">{unreadCount}</span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {expanded ? (
          <div className="border-t border-white/[0.06] p-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent text-[13px] font-bold text-white">
                {roleLabels[role].charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-[rgb(var(--sidebar-profile-text))]">{roleLabels[role]}</div>
                <span className={cn('rounded px-1.5 py-px text-[10px] font-semibold capitalize', roleBadgeClass[role])}>{role}</span>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
    </>
  );
}
