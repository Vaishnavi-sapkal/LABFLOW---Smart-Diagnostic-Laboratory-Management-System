import { useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BookingSummary } from '../components/laboratory/BookingSummary';
import { StepTracker } from '../components/laboratory/StepTracker';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Field } from '../components/ui/FormSection';
import { Select } from '../components/ui/Input';
import { PageContainer } from '../components/layout/PageContainer';
import { doctors, formatInr, patients, tests } from '../data/mockData';

const slots = ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '05:00 PM'];

export function TestBooking() {
  const [selectedTests, setSelectedTests] = useState<string[]>(['T-CBC', 'T-LIP']);
  const [slot, setSlot] = useState('10:30 AM');
  const total = useMemo(() => tests.filter((test) => selectedTests.includes(test.id)).reduce((sum, test) => sum + test.price, 0), [selectedTests]);

  return (
    <PageContainer>
      <div className="grid gap-6">
        <StepTracker activeIndex={1} steps={['Select Tests', 'Choose Doctor', 'Pick Slot', 'Confirm']} />
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="grid gap-5">
            <div className="card p-5">
              <h2 className="text-base font-semibold">Test checklist</h2>
              <div className="mt-4 grid gap-3">
                {tests.map((test) => <label className="flex items-start gap-3 rounded-ui border border-border p-4 hover:bg-surface-muted" key={test.id}><Checkbox checked={selectedTests.includes(test.id)} onChange={(event) => setSelectedTests((current) => event.target.checked ? [...current, test.id] : current.filter((id) => id !== test.id))} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{test.name}</span><span className="block text-xs text-ink-muted">{test.description}</span></span><span className="text-sm font-semibold text-brand-700">{formatInr(test.price)}</span></label>)}
              </div>
            </div>
            <div className="card p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Patient"><Select defaultValue={patients[0].id}>{patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name}</option>)}</Select></Field>
                <Field label="Doctor"><Select defaultValue={doctors[0].id}>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}</Select></Field>
              </div>
              <h2 className="mt-6 text-base font-semibold">Available time slots</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {slots.map((item, index) => <button className={`h-10 rounded-ui border text-sm font-semibold ${slot === item ? 'border-brand-600 bg-brand-600 text-white' : index === 3 ? 'cursor-not-allowed border-border bg-surface-muted text-ink-subtle' : 'border-border bg-white text-ink hover:bg-brand-50'}`} disabled={index === 3} key={item} onClick={() => setSlot(item)} type="button">{item}</button>)}
              </div>
            </div>
          </section>
          <div className="xl:sticky xl:top-24 xl:h-fit">
            <BookingSummary patient="Priya Joshi" tests={tests.filter((test) => selectedTests.includes(test.id)).map((test) => test.name)} total={formatInr(total)} />
            <Button className="mt-4 w-full" icon={<CheckCircle2 size={16} />}>Confirm {slot}</Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
