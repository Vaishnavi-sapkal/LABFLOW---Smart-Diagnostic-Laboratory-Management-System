import { useState } from 'react';
import { Check, Clock3, Plus, Search, UserRound, X } from 'lucide-react';
import { useLabData } from '../app/LabDataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PageContainer } from '../components/layout/PageContainer';
import { doctors, formatInr } from '../data/mockData';

type CatalogTest = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  fasting: boolean;
};

type TestPackage = {
  id: string;
  name: string;
  tests: string[];
  price: number;
  savings: number;
};

const catalogTests: CatalogTest[] = [
  { id: 'CBC', name: 'Complete Blood Count', category: 'Hematology', price: 480, duration: '4h', fasting: false },
  { id: 'LFT', name: 'Liver Function Test', category: 'Biochemistry', price: 850, duration: '6h', fasting: true },
  { id: 'KFT', name: 'Kidney Function Test', category: 'Biochemistry', price: 780, duration: '6h', fasting: true },
  { id: 'LIPID', name: 'Lipid Profile', category: 'Biochemistry', price: 760, duration: '6h', fasting: true },
  { id: 'TFT', name: 'Thyroid Function (T3/T4/TSH)', category: 'Endocrinology', price: 890, duration: '8h', fasting: false },
  { id: 'HBA1C', name: 'HbA1c (Glycated Hemoglobin)', category: 'Endocrinology', price: 580, duration: '4h', fasting: false },
  { id: 'FBS', name: 'Fasting Blood Sugar', category: 'Biochemistry', price: 180, duration: '2h', fasting: true },
  { id: 'PPBS', name: 'Post-Prandial Blood Sugar', category: 'Biochemistry', price: 180, duration: '2h', fasting: false },
  { id: 'VIT_D', name: 'Vitamin D (25-OH)', category: 'Vitamins', price: 1200, duration: '24h', fasting: false },
  { id: 'VIT_B12', name: 'Vitamin B12', category: 'Vitamins', price: 980, duration: '24h', fasting: false },
  { id: 'CRP', name: 'C-Reactive Protein', category: 'Immunology', price: 560, duration: '6h', fasting: false },
  { id: 'ESR', name: 'ESR (Erythrocyte Sedimentation Rate)', category: 'Hematology', price: 220, duration: '2h', fasting: false },
];

const packages: TestPackage[] = [
  { id: 'PKG_FULL', name: 'Full Body Checkup', tests: ['CBC', 'LFT', 'KFT', 'LIPID', 'TFT', 'FBS', 'VIT_D', 'VIT_B12'], price: 3999, savings: 1831 },
  { id: 'PKG_DIAB', name: 'Diabetes Profile', tests: ['HBA1C', 'FBS', 'PPBS', 'KFT', 'LIPID'], price: 1499, savings: 681 },
  { id: 'PKG_CARDIAC', name: 'Cardiac Risk Panel', tests: ['LIPID', 'CRP', 'CBC', 'FBS'], price: 1299, savings: 421 },
];

const categories = ['All', 'Hematology', 'Biochemistry', 'Endocrinology', 'Vitamins', 'Immunology'];
const slots = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'];
const unavailableSlots = new Set(['08:00 AM', '08:30 AM', '10:30 AM']);

export function TestBooking() {
  const { addBooking, bookings, patients } = useLabData();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<string[]>(['CBC']);
  const [selectedSlot, setSelectedSlot] = useState('09:00 AM');
  const [activeTab, setActiveTab] = useState<'tests' | 'packages'>('tests');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id ?? '');
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id ?? '');
  const [showPatientSelect, setShowPatientSelect] = useState(false);
  const [bookedId, setBookedId] = useState<string | null>(null);
  const [category, setCategory] = useState('All');

  const selectedPatient = patients.find((patient) => patient.id === selectedPatientId) ?? patients[0];
  const cartItems = catalogTests.filter((test) => cart.includes(test.id));
  const filteredTests = catalogTests.filter((test) => {
    const matchesCategory = category === 'All' || test.category === category;
    const query = search.toLowerCase();
    const matchesSearch = test.name.toLowerCase().includes(query) || test.category.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  const catalogTotal = cartItems.reduce((sum, test) => sum + test.price, 0);

  const toggleCart = (id: string) => setCart((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const addPackage = (pkg: TestPackage) => setCart((current) => [...new Set([...current, ...pkg.tests])]);

  const handleConfirm = () => {
    if (!cart.length || !selectedPatient) return;

    const bookingId = `BK-2026-${String(834 + bookings.length).padStart(4, '0')}`;
    addBooking({
      id: bookingId,
      patientId: selectedPatient.id,
      testIds: cart,
      doctorId: selectedDoctorId,
      status: 'Sample collected',
      slot: `19 Aug, ${selectedSlot}`,
      amount: catalogTotal,
    });
    setBookedId(bookingId);
  };

  if (bookedId) {
    return (
      <PageContainer>
        <div className="flex justify-center px-2 py-8 lg:py-12">
          <div className="w-full max-w-[480px] text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border-2 border-success bg-success-light text-success">
              <Check size={30} strokeWidth={3} />
            </div>
            <h1 className="mb-2 text-[22px] font-extrabold leading-tight text-ink">Tests Booked Successfully!</h1>
            <p className="mb-6 text-sm leading-6 text-ink-muted">Booking confirmed for {selectedSlot} today. Sample collection instructions sent to patient.</p>
            <div className="mb-5 rounded-card bg-muted px-5 py-4 text-left">
              <div className="mb-1 font-mono text-xs text-ink-muted">BOOKING ID</div>
              <div className="font-mono text-lg font-bold text-brand-600">{bookedId.replace('BK-2026-', 'LF-BK-')}</div>
            </div>
            <div className="flex justify-center gap-2.5">
              <Button variant="secondary" onClick={() => setBookedId(null)}>New Booking</Button>
              <Button>Generate Bill</Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="grid gap-6">
        <header>
          <h1 className="mb-1 text-[22px] font-extrabold leading-tight text-ink">Test Booking</h1>
          <p className="text-[13.5px] text-ink-muted">Search and select tests or packages, assign a doctor, and schedule a collection slot</p>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="mb-4 rounded-card border border-border bg-white px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                  <UserRound size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink">{selectedPatient?.name ?? 'Select patient'}</div>
                  <div className="truncate text-xs text-ink-muted">
                    {selectedPatient ? `${selectedPatient.id} | ${selectedPatient.age}y ${selectedPatient.gender} | ${selectedPatient.bloodGroup}` : 'No patient selected'}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowPatientSelect((value) => !value)}>Change Patient</Button>
              </div>
              {showPatientSelect && (
                <select
                  className="focus-ring mt-3 h-9 w-full rounded-ui border border-border bg-white px-3 text-sm text-ink"
                  onChange={(event) => setSelectedPatientId(event.target.value)}
                  value={selectedPatientId}
                >
                  {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}
                </select>
              )}
            </div>

            <div className="mb-4 flex border-b border-border">
              {(['tests', 'packages'] as const).map((tab) => (
                <button
                  className={`mb-[-1px] border-b-2 px-5 py-2.5 text-sm capitalize transition ${activeTab === tab ? 'border-brand-600 font-bold text-brand-600' : 'border-transparent font-medium text-ink-muted hover:text-ink'}`}
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'tests' && (
              <div className="grid gap-3.5">
                <div className="flex flex-col gap-2.5 lg:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={14} />
                    <Input className="h-9 rounded-[7px] pl-8 text-[13px]" onChange={(event) => setSearch(event.target.value)} placeholder="Search tests..." value={search} />
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                    {categories.map((item) => (
                      <button
                        className={`h-9 whitespace-nowrap rounded-md border px-3 text-[11.5px] font-semibold transition ${category === item ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-border bg-white text-ink-muted hover:bg-surface-muted'}`}
                        key={item}
                        onClick={() => setCategory(item)}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2.5 lg:grid-cols-2">
                  {filteredTests.map((test) => {
                    const inCart = cart.includes(test.id);
                    return <TestCatalogCard inCart={inCart} key={test.id} onToggle={() => toggleCart(test.id)} test={test} />;
                  })}
                </div>
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="grid gap-3">
                {packages.map((pkg) => (
                  <article className="rounded-card border border-border bg-white p-5" key={pkg.id}>
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h2 className="mb-1 text-[15px] font-bold text-ink">{pkg.name}</h2>
                        <p className="text-xs text-ink-muted">{pkg.tests.length} tests included</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-extrabold text-brand-600">{formatInr(pkg.price)}</div>
                        <div className="text-[11px] font-semibold text-success">Save {formatInr(pkg.savings)}</div>
                      </div>
                    </div>
                    <div className="mb-3.5 flex flex-wrap gap-1.5">
                      {pkg.tests.map((testId) => <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] text-ink-muted" key={testId}>{testId}</span>)}
                    </div>
                    <Button icon={<Plus size={14} />} onClick={() => addPackage(pkg)} size="sm">Add Package</Button>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="grid h-fit gap-4 xl:sticky xl:top-24">
            <CartPanel cartItems={cartItems} onRemove={toggleCart} total={catalogTotal} />
            <DoctorPanel selectedDoctorId={selectedDoctorId} onSelect={setSelectedDoctorId} />
            <SlotPanel selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
            <Button className="h-[46px] w-full rounded-card text-[15px] font-bold" disabled={!cart.length} onClick={handleConfirm}>
              Confirm Booking - {formatInr(catalogTotal)}
            </Button>
          </aside>
        </div>
      </div>
    </PageContainer>
  );
}

function TestCatalogCard({ inCart, onToggle, test }: { inCart: boolean; onToggle: () => void; test: CatalogTest }) {
  return (
    <button
      className={`rounded-card border p-4 text-left transition ${inCart ? 'border-brand-600 bg-brand-50' : 'border-border bg-white hover:border-brand-600/60 hover:bg-surface-muted'}`}
      onClick={onToggle}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-[13.5px] font-bold leading-5 text-ink">{test.name}</div>
          <div className="mb-2 text-[11.5px] text-ink-muted">{test.category}</div>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[10.5px] text-ink-muted">
              <Clock3 size={11} />
              {test.duration}
            </span>
            {test.fasting && <span className="rounded bg-warning-light px-2 py-0.5 text-[10.5px] text-warning">Fasting</span>}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-sm font-extrabold text-ink">{formatInr(test.price)}</div>
          <div className={`ml-auto mt-2 grid h-6 w-6 place-items-center rounded-full ${inCart ? 'bg-brand-600 text-white' : 'bg-muted text-ink-muted'}`}>
            {inCart ? <Check size={14} strokeWidth={3} /> : <Plus size={14} />}
          </div>
        </div>
      </div>
    </button>
  );
}

function CartPanel({ cartItems, onRemove, total }: { cartItems: CatalogTest[]; onRemove: (id: string) => void; total: number }) {
  return (
    <section className="rounded-card border border-border bg-white p-5">
      <h2 className="mb-3.5 text-[15px] font-bold text-ink">Cart ({cartItems.length} test{cartItems.length === 1 ? '' : 's'})</h2>
      {cartItems.length === 0 ? (
        <div className="py-6 text-center text-[13px] text-ink-muted">No tests added yet</div>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div className="flex items-center justify-between gap-3 border-b border-border py-2 last:border-b-0" key={item.id}>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold text-ink">{item.name}</div>
                <div className="text-[11px] text-ink-muted">{item.category}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <span className="text-[13px] font-bold text-ink">{formatInr(item.price)}</span>
                <button className="grid h-5 w-5 place-items-center rounded-full bg-danger-light text-danger" onClick={() => onRemove(item.id)} type="button" aria-label={`Remove ${item.name}`}>
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-3">
            <span className="text-sm font-bold text-ink">Total</span>
            <span className="text-base font-extrabold text-brand-600">{formatInr(total)}</span>
          </div>
        </div>
      )}
    </section>
  );
}

function DoctorPanel({ selectedDoctorId, onSelect }: { selectedDoctorId: string; onSelect: (id: string) => void }) {
  return (
    <section className="rounded-card border border-border bg-white p-5">
      <h2 className="mb-3 text-sm font-bold text-ink">Assign Doctor</h2>
      <div className="grid gap-1.5">
        {doctors.slice(0, 3).map((doctor, index) => {
          const selected = selectedDoctorId === doctor.id;
          return (
            <button
              className={`flex items-center gap-2.5 rounded-ui border p-2 text-left transition ${selected ? 'border-brand-600 bg-brand-50' : 'border-transparent bg-transparent hover:bg-surface-muted'}`}
              key={doctor.id}
              onClick={() => onSelect(doctor.id)}
              type="button"
            >
              <div className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent text-xs font-bold text-white">
                {doctor.name.replace('Dr. ', '').charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-ink">{doctor.name}</div>
                <div className="text-[11px] text-ink-muted">{index + 2} pending</div>
              </div>
              {selected && <Check className="shrink-0 text-brand-600" size={15} strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SlotPanel({ selectedSlot, onSelect }: { selectedSlot: string; onSelect: (slot: string) => void }) {
  return (
    <section className="rounded-card border border-border bg-white p-5">
      <h2 className="mb-1 text-sm font-bold text-ink">Schedule Slot</h2>
      <p className="mb-3 text-xs text-ink-muted">19 August 2026</p>
      <div className="grid grid-cols-3 gap-1.5">
        {slots.map((slot) => {
          const unavailable = unavailableSlots.has(slot);
          const selected = selectedSlot === slot;
          return (
            <button
              className={`rounded-md border py-1.5 font-mono text-[11.5px] font-semibold transition ${selected ? 'border-brand-600 bg-brand-600 text-white' : unavailable ? 'cursor-not-allowed border-border bg-muted text-ink-muted line-through' : 'border-border bg-white text-ink hover:bg-brand-50'}`}
              disabled={unavailable}
              key={slot}
              onClick={() => onSelect(slot)}
              type="button"
            >
              {slot}
            </button>
          );
        })}
      </div>
    </section>
  );
}
