import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ReportCard } from '@/components/ReportCard';
import { Plus, MapPin, AlertTriangle, CheckCircle, Clock, Trophy, Map } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <div className="bg-gradient-to-br from-primary via-primary to-emerald-700 px-4 pt-8 pb-12 rounded-b-[2rem] relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <p className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-wider">Welcome back</p>
            <h1 className="text-primary-foreground text-xl font-extrabold">{currentUser.name}</h1>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center shadow-lg">
            <span className="text-primary-foreground text-sm font-extrabold">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        </div>
        <RoleSwitcher />
      </div>

      {/* Stats */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { icon: Clock, label: 'Pending', value: stats.pending, color: 'text-warning', bg: 'bg-warning/10' },
            { icon: MapPin, label: 'In Progress', value: stats.inProgress, color: 'text-info', bg: 'bg-info/10' },
            { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'text-success', bg: 'bg-success/10' },
            { icon: AlertTriangle, label: 'Emergencies', value: stats.emergencies, color: stats.emergencies > 0 ? 'text-emergency' : 'text-muted-foreground', bg: stats.emergencies > 0 ? 'bg-emergency/10' : 'bg-muted' },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-card rounded-2xl p-4 shadow-md border border-border ${
                stat.label === 'Emergencies' && stats.emergencies > 0 ? 'border-emergency/20 shadow-emergency/5' : ''
              }`}
            >
              <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`h-4.5 w-4.5 ${stat.color} ${stat.label === 'Emergencies' && stats.emergencies > 0 ? 'animate-pulse-emergency' : ''}`} />
              </div>
              <p className="text-2xl font-extrabold text-card-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5 flex gap-2.5">
        {currentUser.role === 'resident' && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/report')}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 transition-all"
          >
            <Plus className="h-5 w-5" />
            Report Issue
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/leaderboard')}
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-card border-2 border-warning/30 text-warning rounded-2xl font-bold text-sm shadow-sm hover:bg-warning/5 transition-all"
        >
          <Trophy className="h-5 w-5" />
          Champions
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/map')}
          className="flex items-center justify-center gap-2 px-4 py-3.5 bg-card border-2 border-info/30 text-info rounded-2xl font-bold text-sm shadow-sm hover:bg-info/5 transition-all"
        >
          <Map className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Recent Reports */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-extrabold text-foreground text-base">Recent Reports</h2>
          <button onClick={() => navigate('/reports')} className="text-xs text-primary font-bold hover:underline">View all →</button>
        </div>
        <div className="space-y-2.5">
          {recentReports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ReportCard report={report} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
