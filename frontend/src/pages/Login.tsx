import { useState } from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/FormSection';
import { Input } from '../components/ui/Input';

const roles = ['Admin', 'Doctor', 'Receptionist', 'Lab Technician', 'Patient'] as const;

export function Login() {
  const [role, setRole] = useState<(typeof roles)[number]>('Admin');

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex min-h-[360px] flex-col justify-between bg-brand-600 p-8 text-white lg:p-12">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-ui bg-white/15"><Activity size={24} /></div>
          <div><h1 className="text-2xl font-semibold">LabFlow</h1><p className="text-sm text-white/75">Diagnostic Laboratory Management</p></div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.03em] text-white/70">Medtech operations platform</p>
          <h2 className="mt-4 text-4xl font-semibold leading-tight">Structured workflows for every diagnostic sample.</h2>
          <p className="mt-4 text-base leading-7 text-white/78">Manage bookings, samples, verification and patient reports from one clean laboratory workspace.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {['12 service desks', '4 hr report TAT', '98% queue accuracy'].map((item) => <div className="rounded-card border border-white/20 bg-white/10 p-4 text-sm font-semibold" key={item}>{item}</div>)}
        </div>
      </section>
      <section className="flex items-center justify-center bg-surface-muted p-6">
        <form className="w-full max-w-[440px] rounded-card border border-border bg-white p-6 shadow-card">
          <h2 className="text-[22px] font-semibold text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-ink-muted">Use your LabFlow workspace credentials.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {roles.map((item) => <button className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${role === item ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-border text-ink-muted'}`} key={item} onClick={() => setRole(item)} type="button">{item}</button>)}
          </div>
          <div className="mt-6 grid gap-4">
            <Field label="Email or username"><Input defaultValue="admin@labflow.in" /></Field>
            <Field label="Password"><Input defaultValue="labflow2026" type="password" /></Field>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-ink-muted"><input className="h-4 w-4" type="checkbox" defaultChecked />Remember me</label>
            <a className="font-semibold text-brand-700" href="#">Forgot password?</a>
          </div>
          <Button className="mt-6 w-full" type="button"><Link className="w-full" to="/dashboard">Login as {role}</Link></Button>
          <p className="mt-5 flex items-center gap-2 text-xs text-ink-muted"><CheckCircle2 size={14} className="text-success" /> HIPAA-aware workflows with role-based access.</p>
        </form>
      </section>
    </main>
  );
}
