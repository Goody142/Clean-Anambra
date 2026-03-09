import { WasteReport, User, CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock, User as UserIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface ReportCardProps {
  report: WasteReport;
  onAccept?: () => void;
  showAccept?: boolean;
  reporter?: User;
}

export const ReportCard = ({ report, onAccept, showAccept, reporter }: ReportCardProps) => {
  const isEmergency = report.priority === 'emergency';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`bg-card rounded-2xl p-4 shadow-sm border-2 transition-all ${
        isEmergency ? 'border-emergency/25 shadow-emergency/5' : 'border-border hover:border-primary/20 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
            isEmergency ? 'bg-emergency/10' : 'bg-accent'
          }`}>
            {CATEGORY_ICONS[report.category]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-card-foreground">{CATEGORY_LABELS[report.category]}</h3>
              {isEmergency && (
                <span className="text-[9px] bg-emergency text-emergency-foreground px-1.5 py-0.5 rounded-full font-bold animate-pulse-emergency">
                  EMERGENCY
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {report.location.address}
            </p>
          </div>
        </div>
        <StatusBadge status={report.status} priority={report.priority} />
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{report.description}</p>

      {/* Area & Time */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
          📍 {report.location.area}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-2.5 w-2.5" />
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Reporter Info */}
      {reporter && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <UserIcon className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground">Reported by</p>
            <p className="text-[11px] font-medium text-card-foreground truncate">{reporter.name}</p>
          </div>
          <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {reporter.area.split(',')[0]}
          </span>
        </div>
      )}

      {showAccept && report.status === 'pending' && (
        <button
          onClick={onAccept}
          className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
            isEmergency
              ? 'bg-gradient-to-r from-emergency to-red-600 text-emergency-foreground shadow-emergency/20'
              : 'bg-gradient-to-r from-primary to-emerald-600 text-primary-foreground shadow-primary/20'
          }`}
        >
          {isEmergency ? '🚨 Accept Emergency' : 'Accept Task'}
        </button>
      )}
    </motion.div>
  );
};
