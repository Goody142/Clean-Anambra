import { useApp } from '@/context/AppContext';
import { Trophy, Medal, Star, TrendingUp, Flame, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RANK_COLORS = [
  'from-yellow-400 to-amber-500',
  'from-slate-300 to-slate-400',
  'from-amber-600 to-amber-700',
];

const RANK_ICONS = [
  <Trophy className="h-5 w-5" />,
  <Medal className="h-5 w-5" />,
  <Medal className="h-5 w-5" />,
];

const LeaderboardPage = () => {
  const { users, reports } = useApp();
  const navigate = useNavigate();

  // Calculate leaderboard from reports
  const residents = users.filter(u => u.role === 'resident');
  const leaderboard = residents.map(user => {
    const userReports = reports.filter(r => r.reporterId === user.id);
    const resolved = userReports.filter(r => r.status === 'completed').length;
    const emergencies = userReports.filter(r => r.priority === 'emergency').length;
    const points = userReports.length * 10 + resolved * 25 + emergencies * 50;
    return {
      ...user,
      totalReports: userReports.length,
      resolved,
      emergencies,
      points,
      streak: Math.min(userReports.length, 7), // Simulated streak
    };
  }).sort((a, b) => b.points - a.points);

  const totalCommunityReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'completed').length;

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-emerald-700 px-4 pt-8 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-8xl">🏆</div>
          <div className="absolute bottom-2 left-6 text-6xl">⭐</div>
        </div>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-3 relative z-10">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-primary-foreground text-2xl font-extrabold relative z-10">Community Champions</h1>
        <p className="text-primary-foreground/70 text-sm relative z-10">Recognizing Anambra's cleanest citizens</p>

        {/* Community Stats */}
        <div className="flex gap-3 mt-5 relative z-10">
          <div className="flex-1 bg-primary-foreground/15 backdrop-blur rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-primary-foreground">{totalCommunityReports}</p>
            <p className="text-[10px] text-primary-foreground/70 font-medium">Total Reports</p>
          </div>
          <div className="flex-1 bg-primary-foreground/15 backdrop-blur rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-primary-foreground">{resolvedReports}</p>
            <p className="text-[10px] text-primary-foreground/70 font-medium">Resolved</p>
          </div>
          <div className="flex-1 bg-primary-foreground/15 backdrop-blur rounded-2xl p-3 text-center">
            <p className="text-2xl font-extrabold text-primary-foreground">{leaderboard.length}</p>
            <p className="text-[10px] text-primary-foreground/70 font-medium">Active Heroes</p>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="px-4 -mt-6">
        <div className="flex items-end justify-center gap-3 mb-6">
          {[1, 0, 2].map((rank, displayIdx) => {
            const user = leaderboard[rank];
            if (!user) return null;
            const isFirst = rank === 0;
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: displayIdx * 0.15 }}
                className={`flex flex-col items-center ${isFirst ? 'order-2 -mt-4' : rank === 1 ? 'order-1' : 'order-3'}`}
              >
                <div className={`relative mb-2`}>
                  <div className={`h-${isFirst ? '16' : '14'} w-${isFirst ? '16' : '14'} rounded-full bg-gradient-to-br ${RANK_COLORS[rank]} p-0.5 shadow-lg`}>
                    <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                      <span className={`font-extrabold ${isFirst ? 'text-lg' : 'text-sm'} text-foreground`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br ${RANK_COLORS[rank]} flex items-center justify-center text-white text-[10px] font-bold shadow`}>
                    {rank + 1}
                  </div>
                </div>
                <p className={`text-xs font-bold text-card-foreground text-center max-w-[80px] truncate`}>{user.name.split(' ')[0]}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star className="h-3 w-3 text-warning fill-warning" />
                  <span className="text-[11px] font-bold text-warning">{user.points} pts</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full Rankings */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="font-bold text-foreground">Full Rankings</h2>
        </div>
        <div className="space-y-2">
          {leaderboard.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-3 p-3.5 bg-card rounded-2xl border border-border shadow-sm"
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-extrabold ${
                idx < 3 ? `bg-gradient-to-br ${RANK_COLORS[idx]} text-white` : 'bg-muted text-muted-foreground'
              }`}>
                {idx + 1}
              </div>
              <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center">
                <span className="text-sm font-bold text-accent-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-card-foreground truncate">{user.name}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{user.totalReports} reports</span>
                  <span>•</span>
                  <span>{user.resolved} resolved</span>
                  {user.streak > 2 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-emergency">
                        <Flame className="h-3 w-3" />{user.streak}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-primary">{user.points}</p>
                <p className="text-[10px] text-muted-foreground">points</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Motivation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-5 bg-gradient-to-br from-primary/10 via-accent/50 to-success/10 rounded-2xl border border-primary/20 text-center"
        >
          <p className="text-3xl mb-2">🌿</p>
          <h3 className="font-extrabold text-foreground text-base">Make Anambra Cleaner!</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
            Report sanitation issues to earn points. Top reporters get recognized as Community Champions every month!
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <span className="bg-card rounded-lg px-3 py-1.5 font-semibold text-primary border border-border">📋 Report = 10pts</span>
            <span className="bg-card rounded-lg px-3 py-1.5 font-semibold text-success border border-border">✅ Resolved = 25pts</span>
            <span className="bg-card rounded-lg px-3 py-1.5 font-semibold text-emergency border border-border">🚨 Emergency = 50pts</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
