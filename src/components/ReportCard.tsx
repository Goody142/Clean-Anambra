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
    <div className={`bg-card rounded-xl p-4 shadow-sm border ${isEmergency ? 'border-emergency/30 ring-1 ring-emergency/20' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{CATEGORY_ICONS[report.category]}</span>
          <h3 className="font-semibold text-sm text-card-foreground">{CATEGORY_LABELS[report.category]}</h3>
        </div>
        <StatusBadge status={report.status} priority={report.priority} />
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {report.location.area}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
        </span>
      </div>

      {showAccept && report.status === 'pending' && (
        <button
          onClick={onAccept}
          className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
            isEmergency
              ? 'bg-emergency text-emergency-foreground hover:bg-emergency/90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isEmergency ? '🚨 Accept Emergency' : 'Accept Task'}
        </button>
      )}
    </div>
  );
};
