import { useMemo, useState } from 'react';
import { CreditCard, Printer } from 'lucide-react';
import { useLabData } from '../app/LabDataContext';
import { ReceiptPreview } from '../components/laboratory/ReceiptPreview';
import { Button } from '../components/ui/Button';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { Tabs } from '../components/ui/Tabs';
import { PageContainer } from '../components/layout/PageContainer';
import { billingItems, formatInr, tests } from '../data/mockData';

const methods = ['Card', 'UPI', 'Cash', 'Insurance'] as const;

export function Billing() {
  const [method, setMethod] = useState<(typeof methods)[number]>('UPI');
  const [paid, setPaid] = useState(false);
  const { bookings, patients } = useLabData();
  const activeBooking = bookings[0];
  const activePatient = patients.find((patient) => patient.id === activeBooking?.patientId) ?? patients[0];
  const bookingItems = activeBooking
    ? activeBooking.testIds.map((testId) => {
        const test = tests.find((item) => item.id === testId) ?? tests[0];
        return { name: test.name, quantity: 1, price: test.price, discount: 0 };
      })
    : billingItems;
  const subtotal = useMemo(() => bookingItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [bookingItems]);
  const discount = useMemo(() => bookingItems.reduce((sum, item) => sum + item.discount, 0), [bookingItems]);
  const tax = 0;
  const total = subtotal - discount + tax;

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-semibold">Itemized bill</h2><Tabs items={[...methods]} onChange={setMethod} value={method} /></div>
          <DataTable columns={['Test', 'Qty', 'Price', 'Discount', 'Amount']}>
            {bookingItems.map((item) => <tr className="hover:bg-surface-muted" key={item.name}><DataCell>{item.name}</DataCell><DataCell>{item.quantity}</DataCell><DataCell>{formatInr(item.price)}</DataCell><DataCell>{formatInr(item.discount)}</DataCell><DataCell className="font-semibold">{formatInr(item.price * item.quantity - item.discount)}</DataCell></tr>)}
          </DataTable>
          <div className="ml-auto mt-5 grid max-w-sm gap-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span>{formatInr(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">Discount</span><span>{formatInr(discount)}</span></div>
            <div className="flex justify-between"><span className="text-ink-muted">Tax</span><span>{formatInr(tax)}</span></div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span>{formatInr(total)}</span></div>
          </div>
          <div className="mt-5 flex justify-end gap-3"><Button icon={<Printer size={16} />} variant="outline">Print</Button><Button disabled={paid} icon={<CreditCard size={16} />} onClick={() => setPaid(true)}>{paid ? 'Payment Collected' : `Collect via ${method}`}</Button></div>
        </section>
        <ReceiptPreview invoice="INV-2026-5518" items={bookingItems.map((item) => ({ name: item.name, price: formatInr(item.price * item.quantity - item.discount) }))} patient={activePatient.name} total={formatInr(total)} />
      </div>
    </PageContainer>
  );
}
