export function ReceiptPreview({ invoice, patient, items, total }: { invoice: string; patient: string; items: Array<{ name: string; price: string }>; total: string }) {
  return (
    <article className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-base font-semibold text-ink">Receipt preview</h2><p className="text-xs text-ink-muted">{invoice}</p></div>
        <span className="text-lg font-semibold text-brand-700">LabFlow</span>
      </div>
      <p className="mt-5 text-sm font-medium text-ink">{patient}</p>
      <div className="mt-4 grid gap-3">
        {items.map((item) => <div className="flex justify-between text-sm" key={item.name}><span className="text-ink-muted">{item.name}</span><span className="font-medium">{item.price}</span></div>)}
      </div>
      <div className="mt-5 flex justify-between border-t border-border pt-4 text-base font-semibold"><span>Total</span><span>{total}</span></div>
    </article>
  );
}
