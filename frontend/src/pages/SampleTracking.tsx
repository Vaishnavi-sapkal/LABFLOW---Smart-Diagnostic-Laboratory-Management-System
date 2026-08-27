import { KanbanColumn } from '../components/laboratory/KanbanColumn';
import { SampleCard } from '../components/laboratory/SampleCard';
import { PageContainer } from '../components/layout/PageContainer';
import { patientById, samples } from '../data/mockData';

const columns = ['Collected', 'Processing', 'Completed'] as const;

export function SampleTracking() {
  return (
    <PageContainer>
      <div className="overflow-x-auto pb-2">
        <div className="grid min-w-[900px] gap-5 lg:grid-cols-3">
          {columns.map((column) => {
            const columnSamples = samples.filter((sample) => sample.status === column || (column === 'Processing' && sample.status === 'Delayed'));
            return (
              <KanbanColumn count={columnSamples.length} key={column} title={column}>
                {columnSamples.map((sample) => <SampleCard code={sample.id} key={sample.id} patient={`${patientById(sample.patientId).name} | ${sample.time}`} status={sample.status} test={sample.testName} />)}
              </KanbanColumn>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
