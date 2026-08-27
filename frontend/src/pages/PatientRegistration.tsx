import { CheckCircle2, Save } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Field, FormSection } from '../components/ui/FormSection';
import { Input, Select, Textarea } from '../components/ui/Input';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PageContainer } from '../components/layout/PageContainer';

export function PatientRegistration() {
  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-5">
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
        </div>
        <aside className="card h-fit p-5 xl:sticky xl:top-24">
          <div className="flex items-center justify-between"><h2 className="text-base font-semibold">Patient Preview</h2><StatusBadge tone="warning">Draft</StatusBadge></div>
          <div className="mt-5 rounded-ui bg-brand-50 p-4"><p className="text-lg font-semibold text-brand-700">Priya Joshi</p><p className="text-sm text-ink-muted">Female, 34 years | B+</p></div>
          <div className="mt-5 grid gap-3 text-sm"><p><span className="text-ink-muted">City:</span> Pune</p><p><span className="text-ink-muted">Phone:</span> +91 98765 42110</p><p className="flex items-center gap-2 text-success"><CheckCircle2 size={16} /> Ready for registration</p></div>
          <Button className="mt-6 w-full" icon={<Save size={16} />}>Register Patient</Button>
        </aside>
      </div>
    </PageContainer>
  );
}
