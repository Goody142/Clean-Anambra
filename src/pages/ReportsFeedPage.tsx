import { useApp } from '@/context/AppContext';
import { ReportCard } from '@/components/ReportCard';
import { useState } from 'react';
import { ReportStatus } from '@/data/types';

const statusFilters: { label: string; value: ReportStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
];

const ReportsFeedPage = () => {
  const { reports } = useApp();
  const [filter, setFilter] = useState<ReportStatus | 'all'>('all');

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter || (filter === 'in_progress' && r.status === 'assigned'));

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-primary-foreground text-xl font-bold">Reports Feed</h1>
        <p className="text-primary-foreground/70 text-sm">{reports.length} total reports</p>
      </div>

      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {statusFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filter === f.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 mt-4">
          {filtered.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsFeedPage;
