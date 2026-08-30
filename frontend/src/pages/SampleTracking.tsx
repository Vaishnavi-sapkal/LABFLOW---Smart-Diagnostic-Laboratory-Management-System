import { KanbanColumn } from '../components/laboratory/KanbanColumn';
import { SampleCard } from '../components/laboratory/SampleCard';
import { useLabData } from '../app/LabDataContext';
import { PageContainer } from '../components/layout/PageContainer';

const columns = ['Collected', 'In Transit', 'Processing', 'Completed'] as const;

export function SampleTracking() {
  const { patients, samples, updateSampleStatus } = useLabData();
  const patientName = (patientId: string) => patients.find((patient) => patient.id === patientId)?.name ?? 'New patient';
  const nextStatus = (status: (typeof columns)[number]) => columns[Math.min(columns.indexOf(status) + 1, columns.length - 1)];

  return (
    <PageContainer>
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[900px] gap-5 lg:grid-cols-3">
          {columns.map((column) => {
            const columnSamples = samples.filter((sample) => sample.status === column || (column === 'Processing' && sample.status === 'Delayed'));
            return (
              <KanbanColumn count={columnSamples.length} key={column} title={column}>
                {columnSamples.map((sample) => (
                  <div className="grid gap-2" key={sample.id}>
                    <SampleCard code={sample.id} patient={`${patientName(sample.patientId)} | ${sample.time}`} status={sample.status} test={sample.testName} />
                    {sample.status !== 'Delayed' && sample.status !== 'Completed' ? <button className="h-8 rounded-ui border border-border bg-white text-xs font-semibold text-brand-700 hover:bg-brand-50" onClick={() => updateSampleStatus(sample.id, nextStatus(sample.status as (typeof columns)[number]))} type="button">Advance status</button> : null}
                  </div>
                ))}
              </KanbanColumn>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
