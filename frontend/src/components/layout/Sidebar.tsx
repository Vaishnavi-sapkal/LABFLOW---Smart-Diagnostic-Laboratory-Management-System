import { NavLink } from 'react-router-dom';
import { Activity, Banknote, ClipboardCheck, FileText, FlaskConical, LayoutDashboard, LogOut, Microscope, ReceiptText, UserPlus, Users } from 'lucide-react';
import { cn } from '@labflow/utils/cn';
import { user } from '../../data/mockData';

const navGroups = [
  {
    title: 'Operations',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Register Patient', path: '/patients/register', icon: UserPlus },
      { label: 'Test Booking', path: '/bookings/new', icon: ClipboardCheck },
      { label: 'Billing', path: '/billing', icon: Banknote },
    ],
  },
  {
    title: 'Laboratory',
    items: [
      { label: 'Samples', path: '/samples', icon: FlaskConical },
      { label: 'Result Entry', path: '/results/entry', icon: Microscope },
      { label: 'Verification', path: '/results/verification', icon: ReceiptText },
      { label: 'Final Report', path: '/reports/preview', icon: FileText },
      { label: 'Patient Portal', path: '/portal', icon: Users },
    ],
  },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <button aria-label="Close navigation" className={cn('fixed inset-0 z-30 bg-ink/30 lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[var(--size-sidebar)] flex-col border-r border-border bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-[var(--size-header)] items-center gap-3 border-b border-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-ui bg-brand-600 text-white"><Activity size={20} /></div>
          <div>
            <div className="text-lg font-semibold leading-5 text-brand-700">LabFlow</div>
            <div className="text-[11px] font-medium text-ink-muted">Diagnostics suite</div>
          </div>
        </div>
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-5" aria-label="Primary navigation">
          {navGroups.map((group) => (
            <div className="mb-6" key={group.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.03em] text-ink-subtle">{group.title}</p>
              <div className="grid gap-1">
                {group.items.map(({ label, path, icon: Icon }) => (
                  <NavLink
                    className={({ isActive }) => cn('flex h-10 items-center gap-3 rounded-ui px-3 text-sm font-medium transition', isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-muted hover:bg-surface-muted hover:text-ink')}
                    key={path}
                    onClick={onClose}
                    to={path}
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-ui bg-surface-muted p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">{user.initials}</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-muted">{user.role}</p>
            </div>
            <LogOut size={16} className="text-ink-muted" />
          </div>
        </div>
      </aside>
    </>
  );
}
