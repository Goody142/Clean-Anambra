import { useApp } from '@/context/AppContext';
import { CATEGORY_ICONS, CATEGORY_LABELS } from '@/data/types';
import { StatusBadge } from '@/components/StatusBadge';
import { MapPin } from 'lucide-react';

const MapViewPage = () => {
  const { reports } = useApp();

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-foreground" />
          <h1 className="text-primary-foreground text-xl font-bold">City Map View</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm">Onitsha & Anambra State</p>
      </div>

      {/* Simulated Map */}
      <div className="px-4 mt-4">
        <div className="bg-accent/50 rounded-xl border border-border overflow-hidden relative" style={{ height: '300px' }}>
          {/* Grid background to simulate map */}
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'linear-gradient(hsl(152 55% 33% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(152 55% 33% / 0.3) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
          {/* Map markers */}
          {reports.map((report, idx) => {
            const isEmergency = report.priority === 'emergency';
            // Distribute markers across the simulated map
            const left = 15 + ((report.location.lng - 6.77) * 3000) % 70;
            const top = 10 + ((report.location.lat - 6.13) * 2000) % 70;
            return (
              <div
                key={report.id}
                className={`absolute flex flex-col items-center cursor-pointer group z-10`}
                style={{ left: `${left}%`, top: `${top}%` }}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm shadow-lg ${
                  isEmergency
                    ? 'bg-emergency text-emergency-foreground animate-pulse-emergency'
                    : report.status === 'completed'
                    ? 'bg-success text-success-foreground'
                    : report.status === 'pending'
                    ? 'bg-warning text-warning-foreground'
                    : 'bg-info text-info-foreground'
                }`}>
                  {CATEGORY_ICONS[report.category]}
                </div>
                {/* Tooltip */}
                <div className="hidden group-hover:block absolute top-10 bg-card rounded-lg p-2 shadow-lg border border-border whitespace-nowrap z-20">
                  <p className="text-xs font-semibold text-card-foreground">{CATEGORY_LABELS[report.category]}</p>
                  <p className="text-[10px] text-muted-foreground">{report.location.area}</p>
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-muted-foreground">
            📍 Onitsha, Anambra State
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs"><span className="h-3 w-3 rounded-full bg-warning" /> Pending</span>
          <span className="flex items-center gap-1 text-xs"><span className="h-3 w-3 rounded-full bg-info" /> In Progress</span>
          <span className="flex items-center gap-1 text-xs"><span className="h-3 w-3 rounded-full bg-success" /> Completed</span>
          <span className="flex items-center gap-1 text-xs"><span className="h-3 w-3 rounded-full bg-emergency" /> Emergency</span>
        </div>

        {/* Report List under map */}
        <div className="mt-5 space-y-2">
          {reports.map(report => (
            <div key={report.id} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border">
              <span className="text-lg">{CATEGORY_ICONS[report.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{CATEGORY_LABELS[report.category]}</p>
                <p className="text-xs text-muted-foreground">{report.location.area}</p>
              </div>
              <StatusBadge status={report.status} priority={report.priority} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;
