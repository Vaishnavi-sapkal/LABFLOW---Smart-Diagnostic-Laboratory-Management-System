import { Bell, Menu, Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header({ title, onMenu }: { title: string; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-[var(--size-header)] items-center justify-between border-b border-border bg-white px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button aria-label="Open navigation" className="w-10 px-0 lg:hidden" onClick={onMenu} variant="ghost"><Menu size={18} /></Button>
        <h1 className="truncate text-[22px] font-semibold leading-7 text-ink">{title}</h1>
      </div>
      <div className="ml-4 flex items-center gap-3">
        <div className="relative hidden w-[320px] md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" size={16} />
          <input className="focus-ring h-10 w-full rounded-ui border border-border bg-surface-muted pl-9 pr-3 text-sm" placeholder="Search patients, tests, reports" />
        </div>
        <Button aria-label="Notifications" className="w-10 px-0" variant="secondary"><Bell size={17} /></Button>
        <Button icon={<Plus size={17} />} className="hidden sm:inline-flex">New booking</Button>
      </div>
    </header>
  );
}
