import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { BarChart3, AlertTriangle, Clock, CheckCircle, TrendingUp, MapPin, ChevronRight, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

const GovernmentDashboardPage = () => {
  const { reports, tasks, users } = useApp();
  const navigate = useNavigate();

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

  const hotspots = Object.entries(areaBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 4);

  // Team performance
  const teams = users.filter(u => u.role === 'pickup_team');
  const teamPerformance = teams.map(team => {
    const teamTasks = tasks.filter(t => t.teamId === team.id);
    const completed = teamTasks.filter(t => t.status === 'completed').length;
    return {
      name: team.name,
      assigned: teamTasks.length,
      completed,
      rate: teamTasks.length > 0 ? Math.round((completed / teamTasks.length) * 100) : 0,
    };
  });

  const resolutionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Top reporters
  const reporterStats = reports.reduce((acc, r) => {
    acc[r.reporterId] = (acc[r.reporterId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topReporters = Object.entries(reporterStats)
    .map(([id, count]) => ({ user: users.find(u => u.id === id), count }))
    .filter(r => r.user)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-gradient-to-br from-primary via-primary to-emerald-700 px-4 pt-8 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="flex items-center gap-2 mb-1 relative z-10">
          <BarChart3 className="h-6 w-6 text-primary-foreground" />
          <h1 className="text-primary-foreground text-2xl font-extrabold">Command Center</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm relative z-10">ASWAMA — Anambra State</p>
        
        {/* Quick Stats Bar */}
        <div className="flex gap-3 mt-5 relative z-10">
          <div className="flex-1 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-3">
            <p className="text-3xl font-black text-primary-foreground">{stats.total}</p>
            <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Total Reports</p>
          </div>
          <div className="flex-1 bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-3">
            <p className="text-3xl font-black text-primary-foreground">{resolutionRate}%</p>
            <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Resolved</p>
          </div>
          <div className={`flex-1 rounded-2xl p-3 ${stats.emergencies > 0 ? 'bg-emergency/80 animate-pulse-emergency' : 'bg-primary-foreground/10 backdrop-blur-sm'}`}>
            <p className="text-3xl font-black text-primary-foreground">{stats.emergencies}</p>
            <p className="text-[10px] text-primary-foreground/60 uppercase tracking-wider">Emergencies</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-3 gap-2">
          <StatusCard icon={<Clock className="h-4 w-4" />} label="Pending" value={stats.pending} color="warning" />
          <StatusCard icon={<TrendingUp className="h-4 w-4" />} label="In Progress" value={stats.inProgress} color="info" />
          <StatusCard icon={<CheckCircle className="h-4 w-4" />} label="Completed" value={stats.completed} color="success" />
        </div>

        {/* Area Analytics Link */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/area-analytics')}
          className="w-full bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20 rounded-2xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-bold text-card-foreground text-sm">Area Analytics</p>
              <p className="text-xs text-muted-foreground">Street-level tracking & insights</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-primary" />
        </motion.button>

        {/* Hotspots */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-card-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Sanitation Hotspots
            </h3>
            <button onClick={() => navigate('/area-analytics')} className="text-xs text-primary font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {hotspots.map(([area, count], idx) => (
              <motion.div
                key={area}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                  {idx + 1}
                </span>
                <span className="flex-1 text-xs text-card-foreground">{area}</span>
                <div className="flex items-center gap-2">
                  <Progress value={(count / stats.total) * 100} className="w-16 h-1.5" />
                  <span className="text-xs font-bold text-card-foreground w-6">{count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <h3 className="font-bold text-sm text-card-foreground mb-3">Reports by Category</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(categoryBreakdown).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                <span className="text-base">{CATEGORY_ICONS[cat as keyof typeof CATEGORY_ICONS]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground truncate">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</p>
                  <p className="text-sm font-bold text-card-foreground">{count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Reporters */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <h3 className="font-bold text-sm text-card-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Top Community Reporters
          </h3>
          <div className="space-y-2">
            {topReporters.map(({ user, count }, idx) => (
              <div key={user!.id} className="flex items-center gap-3 bg-muted/30 rounded-xl px-3 py-2">
                <span className="text-lg">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-card-foreground">{user!.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user!.area}</p>
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{count} reports</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <h3 className="font-bold text-sm text-card-foreground mb-3">Team Performance</h3>
          <div className="space-y-3">
            {teamPerformance.map(team => (
              <div key={team.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-card-foreground font-medium">{team.name}</span>
                  <span className="text-xs text-muted-foreground">
                    <span className="font-bold text-success">{team.completed}</span>/{team.assigned}
                  </span>
                </div>
                <Progress value={team.rate} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) => {
  const colorClasses = {
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-3 border border-border shadow-sm"
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <p className="text-2xl font-black text-card-foreground">{value}</p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </motion.div>
  );
};

export default GovernmentDashboardPage;
