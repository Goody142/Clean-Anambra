import { useApp } from '@/context/AppContext';
import { CATEGORY_LABELS } from '@/data/types';
import { BarChart3, AlertTriangle, Clock, CheckCircle, TrendingUp, MapPin } from 'lucide-react';

const GovernmentDashboardPage = () => {
  const { reports, tasks, users } = useApp();

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in_progress' || r.status === 'assigned').length,
    completed: reports.filter(r => r.status === 'completed').length,
    emergencies: reports.filter(r => r.priority === 'emergency' && r.status !== 'completed').length,
  };

  // Category breakdown
  const categoryBreakdown = reports.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Area hotspots
  const areaBreakdown = reports.reduce((acc, r) => {
    acc[r.location.area] = (acc[r.location.area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hotspots = Object.entries(areaBreakdown).sort((a, b) => b[1] - a[1]);

  // Team performance
  const teams = users.filter(u => u.role === 'pickup_team');
  const teamPerformance = teams.map(team => {
    const teamTasks = tasks.filter(t => t.teamId === team.id);
    return {
      name: team.name,
      assigned: teamTasks.length,
      completed: teamTasks.filter(t => t.status === 'completed').length,
    };
  });

  const resolutionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-5 w-5 text-primary-foreground" />
          <h1 className="text-primary-foreground text-xl font-bold">Monitoring Dashboard</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm">ASWAMA — Anambra State</p>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Clock className="h-4 w-4 text-warning" />} label="Pending" value={stats.pending} />
          <StatCard icon={<TrendingUp className="h-4 w-4 text-info" />} label="In Progress" value={stats.inProgress} />
          <StatCard icon={<CheckCircle className="h-4 w-4 text-success" />} label="Resolved" value={stats.completed} />
          <StatCard
            icon={<AlertTriangle className={`h-4 w-4 ${stats.emergencies > 0 ? 'text-emergency animate-pulse-emergency' : 'text-muted-foreground'}`} />}
            label="Emergencies"
            value={stats.emergencies}
            alert={stats.emergencies > 0}
          />
        </div>

        {/* Resolution Rate */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <p className="text-xs text-muted-foreground mb-2">Resolution Rate</p>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-card-foreground">{resolutionRate}%</span>
            <span className="text-xs text-muted-foreground mb-1">of {stats.total} reports</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${resolutionRate}%` }} />
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <h3 className="font-semibold text-sm text-card-foreground mb-3">Reports by Category</h3>
          <div className="space-y-2">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</span>
                <span className="text-xs font-semibold text-card-foreground bg-muted px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspots */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <h3 className="font-semibold text-sm text-card-foreground mb-3">Sanitation Hotspots</h3>
          <div className="space-y-2">
            {hotspots.map(([area, count]) => (
              <div key={area} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {area}
                </span>
                <span className="text-xs font-semibold text-card-foreground bg-muted px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <h3 className="font-semibold text-sm text-card-foreground mb-3">Team Performance</h3>
          <div className="space-y-3">
            {teamPerformance.map(team => (
              <div key={team.name} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{team.name}</span>
                <span className="text-xs text-card-foreground">
                  <span className="font-semibold text-success">{team.completed}</span>
                  <span className="text-muted-foreground">/{team.assigned} done</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, alert }: { icon: React.ReactNode; label: string; value: number; alert?: boolean }) => (
  <div className={`bg-card rounded-xl p-3.5 shadow-sm border ${alert ? 'border-emergency/30 bg-emergency/5' : 'border-border'}`}>
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`text-2xl font-bold ${alert ? 'text-emergency' : 'text-card-foreground'}`}>{value}</p>
  </div>
);

export default GovernmentDashboardPage;
