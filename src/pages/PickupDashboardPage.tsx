import { useApp } from '@/context/AppContext';
import { ReportCard } from '@/components/ReportCard';
import { StatusBadge } from '@/components/StatusBadge';
import { CATEGORY_LABELS } from '@/data/types';
import { CheckCircle, Play } from 'lucide-react';
import { toast } from 'sonner';

const PickupDashboardPage = () => {
  const { currentUser, reports, tasks, acceptTask, updateTaskStatus } = useApp();

  const unassignedReports = reports.filter(r => r.status === 'pending');
  const myTasks = tasks.filter(t => t.teamId === currentUser.id);
  const myReports = myTasks.map(t => ({ task: t, report: reports.find(r => r.id === t.reportId)! })).filter(x => x.report);

  const handleAccept = (reportId: string) => {
    acceptTask(reportId);
    toast.success('Task accepted! Head to the location.');
  };

  const handleStart = (taskId: string) => {
    updateTaskStatus(taskId, 'in_progress');
    toast.info('Task started. Upload proof when done.');
  };

  const handleComplete = (taskId: string) => {
    updateTaskStatus(taskId, 'completed');
    toast.success('✅ Task completed! Great work.');
  };

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <h1 className="text-primary-foreground text-xl font-bold">Pickup Dashboard</h1>
        <p className="text-primary-foreground/70 text-sm">{currentUser.name}</p>
      </div>

      {/* My Tasks */}
      {myReports.length > 0 && (
        <div className="px-4 mt-5">
          <h2 className="font-bold text-foreground mb-3">My Assigned Tasks</h2>
          <div className="space-y-3">
            {myReports.map(({ task, report }) => (
              <div key={task.id} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm text-card-foreground">{CATEGORY_LABELS[report.category]}</h3>
                  <StatusBadge status={task.status} priority={report.priority} />
                </div>
                <p className="text-xs text-muted-foreground mb-3">{report.location.address}</p>
                <div className="flex gap-2">
                  {task.status === 'assigned' && (
                    <button onClick={() => handleStart(task.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-info text-info-foreground rounded-lg text-xs font-medium">
                      <Play className="h-3.5 w-3.5" /> Start Cleanup
                    </button>
                  )}
                  {task.status === 'in_progress' && (
                    <button onClick={() => handleComplete(task.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-success text-success-foreground rounded-lg text-xs font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Tasks */}
      <div className="px-4 mt-5">
        <h2 className="font-bold text-foreground mb-3">Available Tasks ({unassignedReports.length})</h2>
        <div className="space-y-3">
          {unassignedReports.map(report => (
            <ReportCard key={report.id} report={report} showAccept onAccept={() => handleAccept(report.id)} />
          ))}
          {unassignedReports.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No pending tasks available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupDashboardPage;
