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
import { createPatient, type CreatedPatient, type PatientGender } from '../api/patients';

interface PatientFormState {
  fullName: string;
  dateOfBirth: string;
  gender: PatientGender;
  bloodGroup: 'A+' | 'B+' | 'O+' | 'AB+';
  mobile: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  referringDoctor: string;
  governmentId: string;
  emergencyContact: string;
}

const initialForm: PatientFormState = {
  fullName: 'Priya Joshi',
  dateOfBirth: '1992-04-18',
  gender: 'female',
  bloodGroup: 'B+',
  mobile: '+919876542110',
  email: 'priya.joshi@example.in',
  address: 'Koregaon Park, Pune',
  city: 'Pune',
  pincode: '411001',
  referringDoctor: 'Dr. Ananya Sharma',
  governmentId: '123456789012',
  emergencyContact: '+91 98220 85411',
};

function getAge(dateOfBirth: string) {
  const date = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hasNotHadBirthday = today.getMonth() < date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() < date.getDate());

  if (hasNotHadBirthday) age -= 1;
  return age;
}

function displayGender(gender: string) {
  return `${gender.charAt(0).toUpperCase()}${gender.slice(1)}`;
}

export function PatientRegistration() {
  const { addPatient } = useLabData();
  const [form, setForm] = useState(initialForm);
  const [registered, setRegistered] = useState(false);
  const [registeredPatient, setRegisteredPatient] = useState<CreatedPatient | null>(null);
  const [registrationError, setRegistrationError] = useState('');

  const handleRegister = async () => {
    setRegistrationError('');

    try {
      const patient = await createPatient({
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        aadhaarNumber: form.governmentId || undefined,
        mobile: form.mobile,
        email: form.email || undefined,
        city: form.city || undefined,
      });

      setRegisteredPatient(patient);
      addPatient({
        id: patient.patientId,
        name: patient.fullName,
        age: getAge(patient.dateOfBirth),
        gender: displayGender(patient.gender),
        phone: patient.mobile,
        city: patient.city ?? '',
        bloodGroup: patient.bloodGroup ?? '',
      });
      setRegistered(true);
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Unable to register patient. Please try again.');
    }
  };

  const previewPatient = registeredPatient ?? form;

  return (
    <PageContainer>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="grid gap-5">
          <StepTracker activeIndex={2} steps={['Identity', 'Medical', 'Consent', 'Register']} />
          <FormSection title="Personal Details" description="Capture verified patient demographics.">
            <Field label="Full Name"><Input value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} /></Field>
            <Field label="Date of Birth"><Input value={form.dateOfBirth} onChange={(event) => setForm((current) => ({ ...current, dateOfBirth: event.target.value }))} type="date" /></Field>
            <Field label="Gender"><Select value={form.gender} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value as PatientGender }))}><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></Select></Field>
            <Field label="Blood Group"><Select value={form.bloodGroup} onChange={(event) => setForm((current) => ({ ...current, bloodGroup: event.target.value as PatientFormState['bloodGroup'] }))}><option>B+</option><option>O+</option><option>A+</option><option>AB+</option></Select></Field>
          </FormSection>
          <FormSection title="Contact Information">
            <Field label="Mobile Number"><Input value={form.mobile} onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))} /></Field>
            <Field label="Email"><Input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></Field>
            <Field label="Address"><Textarea value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} /></Field>
            <Field label="City"><Input value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} /></Field>
            <Field label="Pincode"><Input value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))} /></Field>
          </FormSection>
          <FormSection title="Referral & Identification">
            <Field label="Referring Doctor"><Input value={form.referringDoctor} onChange={(event) => setForm((current) => ({ ...current, referringDoctor: event.target.value }))} /></Field>
            <Field label="Government ID"><Input value={form.governmentId} onChange={(event) => setForm((current) => ({ ...current, governmentId: event.target.value }))} /></Field>
            <Field label="Emergency Contact"><Input value={form.emergencyContact} onChange={(event) => setForm((current) => ({ ...current, emergencyContact: event.target.value }))} /></Field>
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
          <div className="mt-5 rounded-ui bg-brand-50 p-4"><p className="text-lg font-semibold text-brand-700">{previewPatient.fullName}</p><p className="text-sm text-ink-muted">{displayGender(previewPatient.gender)}, {getAge(previewPatient.dateOfBirth)} years | {previewPatient.bloodGroup ?? 'Not specified'}</p></div>
          <div className="mt-5 grid gap-3 text-sm"><p><span className="text-ink-muted">Patient ID:</span> {registeredPatient?.patientId ?? 'Generated on save'}</p><p><span className="text-ink-muted">City:</span> {previewPatient.city}</p><p><span className="text-ink-muted">Phone:</span> {previewPatient.mobile}</p><p className="flex items-center gap-2 text-success"><CheckCircle2 size={16} /> {registered ? 'Available for booking' : 'Ready for registration'}</p></div>
          <Button className="mt-6 w-full" disabled={registered} icon={<Save size={16} />} onClick={handleRegister}>{registered ? 'Patient Registered' : 'Register Patient'}</Button>
          {registrationError && <p className="mt-3 text-sm text-danger">{registrationError}</p>}
        </aside>
      </div>
    </PageContainer>
  );
}
