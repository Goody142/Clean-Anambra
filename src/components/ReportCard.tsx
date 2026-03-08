import { WasteReport, CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReportCardProps {
  report: WasteReport;
  onAccept?: () => void;
  showAccept?: boolean;
}

export const ReportCard = ({ report, onAccept, showAccept }: ReportCardProps) => {
  const isEmergency = report.priority === 'emergency';

  return (
    <div className={`bg-card rounded-2xl p-4 shadow-sm border-2 transition-all hover:shadow-md ${
      isEmergency ? 'border-emergency/25 shadow-emergency/5' : 'border-border hover:border-primary/20'
    }`}>
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg ${
            isEmergency ? 'bg-emergency/10' : 'bg-accent'
          }`}>
            {CATEGORY_ICONS[report.category]}
          </div>
          <div>
            <h3 className="font-bold text-sm text-card-foreground">{CATEGORY_LABELS[report.category]}</h3>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {report.location.area}
            </p>
          </div>
        </div>
        <StatusBadge status={report.status} priority={report.priority} />
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{report.description}</p>

      <div className="flex items-center text-xs text-muted-foreground">
        <Clock className="h-3 w-3 mr-1" />
        {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
      </div>

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
    </div>
  );
};
