import { useApp } from '@/context/AppContext';
import { ReportCard } from '@/components/ReportCard';
import { useState } from 'react';
import { FileText, Filter, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsFeedPage = () => {
  const { reports, currentUser, users } = useApp();
  const [filter, setFilter] = useState<'all' | 'mine' | 'area'>('all');

  const filteredReports = reports.filter(r => {
    if (filter === 'mine') return r.reporterId === currentUser.id;
    if (filter === 'area') return r.location.area === currentUser.area.split(',')[0].trim();
    return true;
  });

  const getReporter = (reporterId: string) => users.find(u => u.id === reporterId);

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-gradient-to-br from-primary via-primary to-emerald-700 px-4 pt-8 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center gap-2 mb-1 relative z-10">
          <FileText className="h-5 w-5 text-primary-foreground" />
          <h1 className="text-primary-foreground text-2xl font-extrabold">Reports Feed</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm relative z-10">{filteredReports.length} sanitation reports</p>
      </div>

      <div className="px-4 mt-5">
        {/* Filter Pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {(['all', 'mine', 'area'] as const).map(f => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                filter === f
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {f === 'all' && <Filter className="h-3 w-3" />}
              {f === 'mine' && '👤'}
              {f === 'area' && <MapPin className="h-3 w-3" />}
              {f === 'all' ? 'All Reports' : f === 'mine' ? 'My Reports' : 'My Area'}
            </motion.button>
          ))}
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredReports.length > 0 ? (
              filteredReports.map((report, idx) => {
                const reporter = getReporter(report.reporterId);
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <ReportCard report={report} reporter={reporter} />
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-sm">No reports found</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReportsFeedPage;
