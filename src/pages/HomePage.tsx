import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ReportCard } from '@/components/ReportCard';
import { Plus, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const HomePage = () => {
  const { currentUser, reports } = useApp();
  const navigate = useNavigate();

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in_progress' || r.status === 'assigned').length,
    completed: reports.filter(r => r.status === 'completed').length,
    emergencies: reports.filter(r => r.priority === 'emergency' && r.status !== 'completed').length,
  };

  const recentReports = reports.slice(0, 3);

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-primary px-4 pt-8 pb-10 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-primary-foreground/70 text-xs font-medium">Welcome back</p>
            <h1 className="text-primary-foreground text-lg font-bold">{currentUser.name}</h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
        <RoleSwitcher />
      </div>

      {/* Stats */}
      <div className="px-4 -mt-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-3.5 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">Pending</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{stats.pending}</p>
          </div>
          <div className="bg-card rounded-xl p-3.5 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-info" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{stats.inProgress}</p>
          </div>
          <div className="bg-card rounded-xl p-3.5 shadow-sm border border-border">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-card-foreground">{stats.completed}</p>
          </div>
          <div className={`bg-card rounded-xl p-3.5 shadow-sm border ${stats.emergencies > 0 ? 'border-emergency/30 bg-emergency/5' : 'border-border'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`h-4 w-4 ${stats.emergencies > 0 ? 'text-emergency animate-pulse-emergency' : 'text-muted-foreground'}`} />
              <span className="text-xs text-muted-foreground">Emergencies</span>
            </div>
            <p className={`text-2xl font-bold ${stats.emergencies > 0 ? 'text-emergency' : 'text-card-foreground'}`}>{stats.emergencies}</p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      {currentUser.role === 'resident' && (
        <div className="px-4 mt-5">
          <button
            onClick={() => navigate('/report')}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Report Environmental Issue
          </button>
        </div>
      )}

      {/* Recent Reports */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-foreground">Recent Reports</h2>
          <button onClick={() => navigate('/reports')} className="text-xs text-primary font-medium">View all</button>
        </div>
        <div className="space-y-3">
          {recentReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
