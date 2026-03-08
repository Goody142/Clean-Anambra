import { ReportStatus, ReportPriority } from '@/data/types';

interface StatusBadgeProps {
  status: ReportStatus;
  priority?: ReportPriority;
}

export const StatusBadge = ({ status, priority }: StatusBadgeProps) => {
  if (priority === 'emergency') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold status-emergency animate-pulse-emergency">
        🚨 Emergency
      </span>
    );
  }

  const styles: Record<ReportStatus, string> = {
    pending: 'status-pending',
    assigned: 'status-in-progress',
    in_progress: 'status-in-progress',
    completed: 'status-completed',
  };

  const labels: Record<ReportStatus, string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    completed: 'Completed',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};
