import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

import {
  Banknote,
  Bell,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FlaskConical,
  Home,
  LayoutDashboard,
  LogOut,
  Microscope,
  ReceiptText,
  Stethoscope,
  TestTubeDiagonal,
  UserCog,
  UserPlus,
} from 'lucide-react';

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
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['Admin'],
  },
  {
    label: 'Patients',
    path: '/patients/register',
    icon: UserPlus,
    roles: ['Admin', 'Receptionist'],
  },
  {
    label: 'Create Account',
    path: '/accounts/create',
    icon: UserCog,
    roles: ['Admin'],
  },
  {
    label: 'Doctors',
    path: '/doctors',
    icon: Stethoscope,
    roles: ['Admin'],
  },
  {
    label: 'Manage Tests',
    path: '/tests/manage',
    icon: FlaskConical,
    roles: ['Admin'],
  },
  {
    label: 'Test Booking',
    path: '/bookings/new',
    icon: ClipboardCheck,
    roles: ['Admin', 'Receptionist'],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: Banknote,
    roles: ['Admin', 'Receptionist'],
  },
  {
    label: 'Sample Tracking',
    path: '/samples',
    icon: FlaskConical,
    roles: ['Admin', 'Lab Technician'],
  },
  {
    label: 'Result Entry',
    path: '/samples',
    icon: Microscope,
    roles: ['Lab Technician'],
  },
  {
    label: 'Verification',
    path: '/results/verification',
    icon: ReceiptText,
    roles: ['Doctor'],
  },
  {
    label: 'Reports',
    path: '/reports/preview',
    icon: FileText,
    roles: ['Admin', 'Doctor', 'Lab Technician'],
  },
  {
    label: 'My Portal',
    path: '/portal',
    icon: Home,
    roles: ['Patient'],
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    roles: [
      'Admin',
      'Doctor',
      'Receptionist',
      'Lab Technician',
      'Patient',
    ],
  },
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

export function Sidebar({
  expanded,
  mobileOpen,
  onCloseMobile,
}: {
  expanded: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);

  const visibleNav = navItems.filter((item) =>
    item.roles.includes(role),
  );

  const unreadCount = useUnreadNotificationsCount();

  const displayName = user?.name || roleLabels[role];

  const initials = displayName
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    onCloseMobile();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <button
        aria-label="Close navigation"
        className={cn(
          'fixed inset-0 z-30 bg-ink/30 lg:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
        onClick={onCloseMobile}
        type="button"
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden bg-sidebar transition-[width,min-width,transform] duration-200 ease-out lg:static lg:translate-x-0',
          expanded
            ? 'w-[var(--size-sidebar)] min-w-[var(--size-sidebar)]'
            : 'w-[var(--size-sidebar-collapsed)] min-w-[var(--size-sidebar-collapsed)]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex min-h-[var(--size-header)] items-center gap-2.5 border-b border-white/[0.06] px-4 py-5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-ui bg-gradient-to-br from-brand-600 to-accent text-white">
            <TestTubeDiagonal size={18} />
          </div>

          {expanded ? (
            <div className="min-w-0">
              <div className="text-base font-bold leading-none tracking-[-0.3px] text-white">
                LabFlow
              </div>

              <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[rgb(var(--sidebar-logo-muted))]">
                Diagnostics
              </div>
            </div>
          ) : null}
        </div>

        {/* Navigation */}
        <nav
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-3"
          aria-label="Primary navigation"
        >
          {visibleNav.map(({ label, path, icon: Icon }) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'relative mb-0.5 flex w-full items-center gap-2.5 overflow-hidden whitespace-nowrap rounded-md px-2.5 py-[9px] text-left text-[13.5px] transition-colors',
                  isActive
                    ? 'bg-brand-600/25 font-semibold text-[rgb(var(--sidebar-active))]'
                    : 'font-normal text-[rgb(var(--sidebar-text))] hover:bg-white/[0.05]',
                  !expanded && 'justify-center px-0',
                )
              }
              key={`${label}-${path}`}
              onClick={onCloseMobile}
              title={!expanded ? label : undefined}
              to={path}
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-sm bg-[rgb(var(--sidebar-active))]" />
                  ) : null}

                  <Icon
                    className={
                      isActive
                        ? 'text-[rgb(var(--sidebar-active))]'
                        : 'text-[rgb(var(--sidebar-logo-muted))]'
                    }
                    size={18}
                  />

                  {expanded ? <span>{label}</span> : null}

                  {expanded &&
                  label === 'Notifications' &&
                  unreadCount > 0 ? (
                    <span className="ml-auto min-w-[18px] rounded-full bg-danger px-1.5 py-px text-center text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profile Dropdown */}
        <div className="relative border-t border-white/[0.06] p-3">
          {expanded ? (
            <>
              <button
                className="flex w-full items-center gap-2.5 rounded-md p-1.5 text-left transition-colors hover:bg-white/[0.05]"
                onClick={() => setProfileOpen((open) => !open)}
                type="button"
              >
                <div className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent text-[12px] font-bold text-white">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-[rgb(var(--sidebar-profile-text))]">
                    {displayName}
                  </div>

                  <span
                    className={cn(
                      'rounded px-1.5 py-px text-[10px] font-semibold capitalize',
                      roleBadgeClass[role],
                    )}
                  >
                    {role}
                  </span>
                </div>

                <ChevronDown
                  className={cn(
                    'shrink-0 text-[rgb(var(--sidebar-text))] transition-transform',
                    profileOpen && 'rotate-180',
                  )}
                  size={16}
                />
              </button>

              {profileOpen ? (
                <div className="absolute bottom-[76px] left-3 right-3 z-50 overflow-hidden rounded-lg border border-white/[0.08] bg-sidebar shadow-xl">
                  <button
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium text-[rgb(var(--sidebar-text))] transition-colors hover:bg-red-500/10 hover:text-red-300"
                    onClick={handleLogout}
                    type="button"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <button
              aria-label="Open profile menu"
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent text-xs font-bold text-white"
              onClick={() => setProfileOpen((open) => !open)}
              title={displayName}
              type="button"
            >
              {initials}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}