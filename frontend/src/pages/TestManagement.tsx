import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Checkbox } from '../components/ui/Checkbox';
import { DataCell, DataTable } from '../components/ui/DataTable';
import { Field, FormSection } from '../components/ui/FormSection';
import { Input, Select } from '../components/ui/Input';
import { PageContainer } from '../components/layout/PageContainer';
import {
  createTest,
  deleteTest,
  listTests,
  updateTest,
  type CreateTestDto,
  type TestDocument,
  type TestParameterDto,
} from '../api/tests';
import { formatInr } from '../lib/currency';

interface TestFormState {
  name: string;
  code: string;
  category: string;
  price: string;
  turnaroundHours: string;
  method: string;
  fastingRequired: boolean;
  isPackage: boolean;
  includedTestIds: string[];
  parameters: TestParameterDto[];
}

const emptyParameter: TestParameterDto = { name: '', unit: '', referenceMin: 0, referenceMax: 0 };
const initialForm: TestFormState = {
  name: '', code: '', category: '', price: '', turnaroundHours: '', method: 'Automated Analyzer', fastingRequired: false, isPackage: false, includedTestIds: [], parameters: [],
};

function toForm(test: TestDocument): TestFormState {
  return {
    name: test.name,
    code: test.code,
    category: test.category,
    price: String(test.price),
    turnaroundHours: String(test.turnaroundHours),
    method: test.method ?? 'Automated Analyzer',
    fastingRequired: Boolean(test.fastingRequired),
    isPackage: Boolean(test.isPackage),
    includedTestIds: test.includedTestIds ?? [],
    parameters: test.parameters ?? [],
  };
}

function toPayload(form: TestFormState): CreateTestDto {
  return {
    name: form.name.trim(),
    code: form.code.trim(),
    category: form.category.trim(),
    price: Number(form.price),
    turnaroundHours: Number(form.turnaroundHours),
    method: form.method.trim() || undefined,
    fastingRequired: form.fastingRequired,
    isPackage: form.isPackage,
    includedTestIds: form.isPackage ? form.includedTestIds : [],
    parameters: form.isPackage ? [] : form.parameters.filter((parameter) => parameter.name.trim() && parameter.unit.trim()),
  };
}

export function TestManagement() {
  const [tests, setTests] = useState<TestDocument[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  const loadTests = async () => {
    setLoading(true);
    setLoadError('');
    try {
      setTests(await listTests());
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to load tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadTests(); }, []);

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
      if (editingId) await updateTest(editingId, toPayload(form));
      else await createTest(toPayload(form));
      resetForm();
      await loadTests();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save test. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (test: TestDocument) => {
    if (!window.confirm(`Delete ${test.name}?`)) return;
    setActionId(test._id);
    setActionError('');
    try {
      await deleteTest(test._id);
      if (editingId === test._id) resetForm();
      await loadTests();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete test. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const individualTests = tests.filter((test) => !test.isPackage && test._id !== editingId);

  return (
    <PageContainer>
      <div className="grid gap-6">
        <div><h1 className="text-[22px] font-extrabold leading-tight text-ink">Manage Tests</h1><p className="text-sm text-ink-muted">Create and maintain laboratory tests and test packages.</p></div>
        <form className="card grid gap-5 p-5" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-3"><div><h2 className="text-base font-semibold">{editingId ? 'Edit Test' : 'New Test'}</h2><p className="text-sm text-ink-muted">Packages can include existing individual tests.</p></div>{editingId && <Button icon={<X size={16} />} onClick={resetForm} type="button" variant="outline">Cancel edit</Button>}</div>
          <FormSection title="Test Details">
            <Field label="Name"><Input onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required value={form.name} /></Field>
            <Field label="Code"><Input onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} required value={form.code} /></Field>
            <Field label="Category"><Input onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required value={form.category} /></Field>
            <Field label="Price (INR)"><Input min="0" onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required type="number" value={form.price} /></Field>
            <Field label="Turnaround Time (hours)"><Input min="1" onChange={(event) => setForm((current) => ({ ...current, turnaroundHours: event.target.value }))} required type="number" value={form.turnaroundHours} /></Field>
            <Field label="Method"><Input onChange={(event) => setForm((current) => ({ ...current, method: event.target.value }))} value={form.method} /></Field>
          </FormSection>
          <div className="flex flex-wrap gap-5"><label className="flex items-center gap-3 text-sm font-medium text-ink"><Checkbox checked={form.fastingRequired} onChange={(event) => setForm((current) => ({ ...current, fastingRequired: event.target.checked }))} /> Fasting required</label><label className="flex items-center gap-3 text-sm font-medium text-ink"><Checkbox checked={form.isPackage} onChange={(event) => setForm((current) => ({ ...current, isPackage: event.target.checked }))} /> This is a package</label></div>
          {form.isPackage ? <Field label="Included Tests"><Select multiple onChange={(event) => setForm((current) => ({ ...current, includedTestIds: Array.from(event.currentTarget.selectedOptions, (option) => option.value) }))} size={Math.min(6, Math.max(3, individualTests.length))} value={form.includedTestIds}>{individualTests.map((test) => <option key={test._id} value={test._id}>{test.name} ({test.code})</option>)}</Select></Field> : <section className="grid gap-3"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Parameters</h3><Button icon={<Plus size={14} />} onClick={() => setForm((current) => ({ ...current, parameters: [...current.parameters, { ...emptyParameter }] }))} size="sm" type="button" variant="outline">Add parameter</Button></div>{form.parameters.map((parameter, index) => <div className="grid gap-2 md:grid-cols-[1fr_120px_120px_120px_auto]" key={index}><Input onChange={(event) => setForm((current) => ({ ...current, parameters: current.parameters.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item) }))} placeholder="Name" value={parameter.name} /><Input onChange={(event) => setForm((current) => ({ ...current, parameters: current.parameters.map((item, itemIndex) => itemIndex === index ? { ...item, unit: event.target.value } : item) }))} placeholder="Unit" value={parameter.unit} /><Input onChange={(event) => setForm((current) => ({ ...current, parameters: current.parameters.map((item, itemIndex) => itemIndex === index ? { ...item, referenceMin: Number(event.target.value) } : item) }))} placeholder="Min" type="number" value={parameter.referenceMin} /><Input onChange={(event) => setForm((current) => ({ ...current, parameters: current.parameters.map((item, itemIndex) => itemIndex === index ? { ...item, referenceMax: Number(event.target.value) } : item) }))} placeholder="Max" type="number" value={parameter.referenceMax} /><Button icon={<X size={14} />} onClick={() => setForm((current) => ({ ...current, parameters: current.parameters.filter((_, itemIndex) => itemIndex !== index) }))} size="sm" type="button" variant="danger-outline">Remove</Button></div>)}</section>}
          {formError && <p className="text-sm text-danger">{formError}</p>}
          <div><Button disabled={saving} icon={editingId ? <Save size={16} /> : <Plus size={16} />} type="submit">{saving ? 'Saving...' : editingId ? 'Update Test' : 'Create Test'}</Button></div>
        </form>
        <section className="card p-5"><h2 className="mb-4 text-base font-semibold">Tests and Packages</h2>{loadError && <p className="mb-3 text-sm text-danger">{loadError}</p>}{actionError && <p className="mb-3 text-sm text-danger">{actionError}</p>}{loading ? <div className="py-8 text-center text-sm text-ink-muted">Loading tests...</div> : <DataTable columns={['Name', 'Category', 'Price', 'Turnaround', 'Type', 'Actions']}>{tests.map((test) => <tr className="hover:bg-surface-muted" key={test._id}><DataCell><div className="font-semibold">{test.name}</div><div className="font-mono text-xs text-ink-muted">{test.code}</div></DataCell><DataCell>{test.category}</DataCell><DataCell>{formatInr(test.price)}</DataCell><DataCell>{test.turnaroundHours}h</DataCell><DataCell>{test.isPackage ? `Package (${test.includedTestIds?.length ?? 0})` : 'Individual'}</DataCell><DataCell><div className="flex gap-2"><Button icon={<Pencil size={14} />} onClick={() => { setForm(toForm(test)); setEditingId(test._id); setFormError(''); }} size="sm" type="button" variant="outline">Edit</Button><Button disabled={actionId === test._id} icon={<Trash2 size={14} />} onClick={() => void handleDelete(test)} size="sm" type="button" variant="danger-outline">Delete</Button></div></DataCell></tr>)}{!tests.length && <tr><td className="py-8 text-center text-ink-muted" colSpan={6}>No tests have been added yet.</td></tr>}</DataTable>}</section>
      </div>
    </PageContainer>
  );
}
