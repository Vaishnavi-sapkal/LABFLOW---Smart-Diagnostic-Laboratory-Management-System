import { useState } from 'react';
import { CheckCircle2, Save } from 'lucide-react';
import { useLabData } from '../app/LabDataContext';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { Field, FormSection } from '../components/ui/FormSection';
import { Input, Select, Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';
import { StepTracker } from '../components/laboratory/StepTracker';

export function PatientRegistration() {
  const { addPatient, patients } = useLabData();
  const [registered, setRegistered] = useState(false);
  const nextId = `PAT-2026-${String(142 + patients.length).padStart(4, '0')}`;

  const handleRegister = () => {
    addPatient({ id: nextId, name: 'Priya Joshi', age: 34, gender: 'Female', phone: '+91 98765 42110', city: 'Pune', bloodGroup: 'B+' });
    setRegistered(true);
  };

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-5">
          <StepTracker activeIndex={2} steps={['Identity', 'Medical', 'Consent', 'Register']} />
          <FormSection title="Personal Details" description="Capture verified patient demographics.">
            <Field label="Full Name"><Input defaultValue="Priya Joshi" /></Field>
            <Field label="Date of Birth"><Input defaultValue="1992-04-18" type="date" /></Field>
            <Field label="Gender"><Select defaultValue="Female"><option>Female</option><option>Male</option><option>Other</option></Select></Field>
            <Field label="Blood Group"><Select defaultValue="B+"><option>B+</option><option>O+</option><option>A+</option><option>AB+</option></Select></Field>
          </FormSection>
          <FormSection title="Contact Information">
            <Field label="Mobile Number"><Input defaultValue="+91 98765 42110" /></Field>
            <Field label="Email"><Input defaultValue="priya.joshi@example.in" /></Field>
            <Field label="Address"><Textarea defaultValue="Koregaon Park, Pune" /></Field>
            <Field label="City"><Input defaultValue="Pune" /></Field>
            <Field label="Pincode"><Input defaultValue="411001" /></Field>
          </FormSection>
          <FormSection title="Referral & Identification">
            <Field label="Referring Doctor"><Input defaultValue="Dr. Ananya Sharma" /></Field>
            <Field label="Government ID"><Input defaultValue="XXXX-XXXX-4312" /></Field>
            <Field label="Emergency Contact"><Input defaultValue="+91 98220 85411" /></Field>
          </FormSection>
          <section className="card p-5">
            <h2 className="text-base font-semibold">Consent</h2>
            <div className="mt-4 grid gap-3 text-sm text-ink-muted">
              <label className="flex items-start gap-3"><Checkbox defaultChecked /> Patient consent received for diagnostic testing and digital report delivery.</label>
              <label className="flex items-start gap-3"><Checkbox defaultChecked /> Emergency contact and referral details verified.</label>
            </div>
          </section>
        </div>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">Patient Preview</h2><StatusBadge tone={registered ? 'success' : 'warning'}>{registered ? 'Registered' : 'Draft'}</StatusBadge></div>
          <div className="mt-5 rounded-ui bg-brand-50 p-4"><p className="text-lg font-semibold text-brand-700">Priya Joshi</p><p className="text-sm text-ink-muted">Female, 34 years | B+</p></div>
          <div className="mt-5 grid gap-3 text-sm"><p><span className="text-ink-muted">Patient ID:</span> {registered ? nextId : 'Generated on save'}</p><p><span className="text-ink-muted">City:</span> Pune</p><p><span className="text-ink-muted">Phone:</span> +91 98765 42110</p><p className="flex items-center gap-2 text-success"><CheckCircle2 size={16} /> {registered ? 'Available for booking' : 'Ready for registration'}</p></div>
          <Button className="mt-6 w-full" disabled={registered} icon={<Save size={16} />} onClick={handleRegister}>{registered ? 'Patient Registered' : 'Register Patient'}</Button>
        </aside>
      </div>
    </PageContainer>
  );
}
