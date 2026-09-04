import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { Checkbox } from '../components/ui/Checkbox';
import { Field, FormSection } from '../components/ui/FormSection';
import { Input } from '../components/ui/Input';
import { PageContainer } from '../components/layout/PageContainer';
import {
  createDoctor,
  deleteDoctor,
  listDoctors,
  updateDoctor,
  type CreateDoctorDto,
  type DoctorDocument,
} from '../api/doctors';

interface DoctorFormState {
  fullName: string;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  email: string;
  mobile: string;
  isActive: boolean;
}

const initialForm: DoctorFormState = {
  fullName: '',
  specialization: '',
  qualification: '',
  registrationNumber: '',
  email: '',
  mobile: '',
  isActive: true,
};

function toPayload(form: DoctorFormState): CreateDoctorDto {
  return {
    fullName: form.fullName.trim(),
    specialization: form.specialization.trim() || undefined,
    qualification: form.qualification.trim() || undefined,
    registrationNumber: form.registrationNumber.trim() || undefined,
    email: form.email.trim() || undefined,
    mobile: form.mobile.trim() || undefined,
    isActive: form.isActive,
  };
}

function toForm(doctor: DoctorDocument): DoctorFormState {
  return {
    fullName: doctor.fullName,
    specialization: doctor.specialization ?? '',
    qualification: doctor.qualification ?? '',
    registrationNumber: doctor.registrationNumber ?? '',
    email: doctor.email ?? '',
    mobile: doctor.mobile ?? '',
    isActive: doctor.isActive !== false,
  };
}

export function DoctorManagement() {
  const [doctors, setDoctors] = useState<DoctorDocument[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadDoctors = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setDoctors(await listDoctors());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDoctors();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editingId) {
        await updateDoctor(editingId, toPayload(form));
      } else {
        await createDoctor(toPayload(form));
      }
      resetForm();
      await loadDoctors();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save doctor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doctor: DoctorDocument) => {
    setForm(toForm(doctor));
    setEditingId(doctor._id);
    setFormError('');
    setActionError('');
  };

  const handleDelete = async (doctor: DoctorDocument) => {
    if (!window.confirm(`Delete ${doctor.fullName}?`)) return;

    setActionId(doctor._id);
    setActionError('');
    try {
      await deleteDoctor(doctor._id);
      if (editingId === doctor._id) resetForm();
      await loadDoctors();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete doctor. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <PageContainer>
      <div className="grid gap-6">
        <div>
          <h1 className="text-[22px] font-extrabold leading-tight text-ink">Manage Doctors</h1>
          <p className="text-sm text-ink-muted">Create, update, and manage laboratory doctors.</p>
        </div>

        <form className="card grid gap-5 p-5" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold">{editingId ? 'Edit Doctor' : 'New Doctor'}</h2><p className="text-sm text-ink-muted">Doctor IDs are generated automatically.</p></div>{editingId && <Button icon={<X size={16} />} onClick={resetForm} type="button" variant="outline">Cancel edit</Button>}</div>
          <FormSection title="Doctor Details">
            <Field label="Name"><Input onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} required value={form.fullName} /></Field>
            <Field label="Specialization"><Input onChange={(event) => setForm((current) => ({ ...current, specialization: event.target.value }))} value={form.specialization} /></Field>
            <Field label="Qualification"><Input onChange={(event) => setForm((current) => ({ ...current, qualification: event.target.value }))} value={form.qualification} /></Field>
            <Field label="Registration Number"><Input onChange={(event) => setForm((current) => ({ ...current, registrationNumber: event.target.value }))} value={form.registrationNumber} /></Field>
            <Field label="Email"><Input onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" value={form.email} /></Field>
            <Field label="Mobile"><Input onChange={(event) => setForm((current) => ({ ...current, mobile: event.target.value }))} value={form.mobile} /></Field>
          </FormSection>
          <label className="flex items-center gap-3 text-sm font-medium text-ink"><Checkbox checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} /> Active doctor</label>
          {formError && <p className="text-sm text-danger">{formError}</p>}
          <div><Button disabled={saving} icon={editingId ? <Save size={16} /> : <Plus size={16} />} type="submit">{saving ? 'Saving...' : editingId ? 'Update Doctor' : 'Create Doctor'}</Button></div>
        </form>

        <section className="card p-5">
          <h2 className="mb-4 text-base font-semibold">Doctors</h2>
          {loadError && <p className="mb-3 text-sm text-danger">{loadError}</p>}
          {actionError && <p className="mb-3 text-sm text-danger">{actionError}</p>}
          {loading ? <div className="py-8 text-center text-sm text-ink-muted">Loading doctors...</div> : (
            <DataTable columns={['Name', 'Specialization', 'Contact', 'Status', 'Actions']}>
              {doctors.map((doctor) => (
                <tr className="hover:bg-surface-muted" key={doctor._id}>
                  <DataCell><div className="font-semibold">{doctor.fullName}</div><div className="text-xs text-ink-muted">{doctor.qualification ?? doctor.registrationNumber ?? '—'}</div></DataCell>
                  <DataCell>{doctor.specialization ?? '—'}</DataCell>
                  <DataCell><div>{doctor.email ?? '—'}</div><div className="text-xs text-ink-muted">{doctor.mobile ?? ''}</div></DataCell>
                  <DataCell><span className={doctor.isActive !== false ? 'text-success' : 'text-ink-muted'}>{doctor.isActive !== false ? 'Active' : 'Inactive'}</span></DataCell>
                  <DataCell><div className="flex gap-2"><Button icon={<Pencil size={14} />} onClick={() => handleEdit(doctor)} size="sm" type="button" variant="outline">Edit</Button><Button disabled={actionId === doctor._id} icon={<Trash2 size={14} />} onClick={() => void handleDelete(doctor)} size="sm" type="button" variant="danger-outline">Delete</Button></div></DataCell>
                </tr>
              ))}
              {!doctors.length && <tr><td className="py-8 text-center text-ink-muted" colSpan={5}>No doctors have been added yet.</td></tr>}
            </DataTable>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
