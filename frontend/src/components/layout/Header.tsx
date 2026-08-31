import { Bell, ChevronDown, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';
import { useLabData } from '../../app/LabDataContext';
import { SearchBar } from '../ui/SearchBar';

const roleLabels = {
  Admin: 'Administrator',
  Doctor: 'Dr. Priya Sharma',
  'Lab Technician': 'Lab Technician',
  Receptionist: 'Receptionist',
  Patient: 'Patient',
} as const;

const roleInitials = {
  Admin: 'A',
  Doctor: 'D',
  'Lab Technician': 'L',
  Receptionist: 'R',
  Patient: 'P',
} as const;

export function Header({ onMobileMenu, onToggleSidebar }: { onMobileMenu: () => void; onToggleSidebar: () => void }) {
  const { role } = useAuth();
  const { notifications } = useLabData();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <header className="z-10 flex h-[var(--size-header)] shrink-0 items-center gap-4 border-b border-border bg-white px-4 lg:px-6">
      <button aria-label="Open navigation" className="flex rounded p-1 text-ink-muted hover:bg-[rgb(var(--color-muted))] lg:hidden" onClick={onMobileMenu} type="button">
        <Menu size={20} />
      </button>
      <button aria-label="Collapse navigation" className="hidden rounded p-1 text-ink-muted hover:bg-[rgb(var(--color-muted))] lg:flex" onClick={onToggleSidebar} type="button">
        <Menu size={20} />
      </button>

      <SearchBar className="max-w-[400px] flex-1" placeholder="Search patients, tests, reports..." />

      <div className="hidden flex-1 items-center justify-end gap-1 text-[11px] text-ink-muted xl:flex">
        {['Register', 'Book', 'Bill', 'Collect', 'Results', 'Verify', 'Report'].map((step, index, steps) => (
          <span className="flex items-center gap-1" key={step}>
            <span className="rounded bg-[rgb(var(--color-muted))] px-2 py-0.5 font-medium">{step}</span>
            {index < steps.length - 1 ? <span className="text-border">›</span> : null}
          </span>
        ))}
      </div>

      <button aria-label="Open notifications" className="relative flex rounded-md p-1.5 text-ink-muted hover:bg-[rgb(var(--color-muted))]" onClick={() => navigate('/notifications')} type="button">
        <Bell size={18} />
        {unreadCount > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full border-2 border-white bg-danger" /> : null}
      </button>

      <button className="hidden items-center gap-2 rounded-ui px-2 py-1 hover:bg-[rgb(var(--color-muted))] sm:flex" type="button">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent text-xs font-bold text-white">{roleInitials[role]}</span>
        <span className="text-left">
          <span className="block text-[13px] font-semibold leading-tight text-ink">{roleLabels[role].split(' ')[0]}</span>
          <span className="block text-[11px] capitalize leading-tight text-ink-muted">{role}</span>
        </span>
        <ChevronDown size={16} className="text-ink-muted" />
      </button>
    </header>
  );
}
