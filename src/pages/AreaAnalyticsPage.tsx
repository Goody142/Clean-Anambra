import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/data/types';
import { ArrowLeft, MapPin, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const AreaAnalyticsPage = () => {
  const { reports } = useApp();
  const navigate = useNavigate();

  // Group reports by area
  const areaData = reports.reduce((acc, r) => {
    const area = r.location.area;
    if (!acc[area]) {
      acc[area] = {
        total: 0,
        pending: 0,
        resolved: 0,
        categories: {} as Record<string, number>,
        streets: {} as Record<string, number>,
        emergencies: 0,
        recentReports: [] as typeof reports,
      };
    }
    acc[area].total++;
    if (r.status === 'completed') acc[area].resolved++;
    if (r.status === 'pending') acc[area].pending++;
    if (r.priority === 'emergency') acc[area].emergencies++;
    acc[area].categories[r.category] = (acc[area].categories[r.category] || 0) + 1;
    acc[area].streets[r.location.address] = (acc[area].streets[r.location.address] || 0) + 1;
    acc[area].recentReports.push(r);
    return acc;
  }, {} as Record<string, {
    total: number;
    pending: number;
    resolved: number;
    categories: Record<string, number>;
    streets: Record<string, number>;
    emergencies: number;
    recentReports: typeof reports;
  }>);

  const sortedAreas = Object.entries(areaData).sort((a, b) => b[1].total - a[1].total);

  // Get top problematic streets across all areas
  const allStreets = reports.reduce((acc, r) => {
    acc[r.location.address] = (acc[r.location.address] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topStreets = Object.entries(allStreets).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // AI-style insights
  const generateInsights = () => {
    const insights: string[] = [];
    const worstArea = sortedAreas[0];
    if (worstArea) {
      insights.push(`${worstArea[0]} has the highest report density with ${worstArea[1].total} reports. Consider deploying additional resources.`);
    }
    const emergencyAreas = sortedAreas.filter(([_, data]) => data.emergencies > 0);
    if (emergencyAreas.length > 0) {
      insights.push(`${emergencyAreas.length} area(s) have unresolved emergency reports requiring immediate attention.`);
    }
    const lowResolutionAreas = sortedAreas.filter(([_, data]) => data.total > 2 && (data.resolved / data.total) < 0.3);
    if (lowResolutionAreas.length > 0) {
      insights.push(`${lowResolutionAreas.map(a => a[0]).join(', ')} show low resolution rates. Review contractor performance in these zones.`);
    }
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="pb-20 min-h-screen">
      <div className="bg-gradient-to-br from-primary via-primary to-emerald-700 px-4 pt-8 pb-8 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/70 text-sm mb-3 relative z-10">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-2 relative z-10">
          <BarChart3 className="h-6 w-6 text-primary-foreground" />
          <h1 className="text-primary-foreground text-2xl font-extrabold">Area Analytics</h1>
        </div>
        <p className="text-primary-foreground/70 text-sm relative z-10 mt-1">Street-level sanitation tracking</p>
      </div>

      <div className="px-4 mt-5 space-y-5">
        {/* AI Insights */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-bold text-amber-700">AI Insights</span>
            </div>
            <div className="space-y-2">
              {insights.map((insight, i) => (
                <p key={i} className="text-xs text-amber-800/80 leading-relaxed">• {insight}</p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Problem Streets */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <h3 className="font-bold text-sm text-card-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Top Problem Streets
          </h3>
          <div className="space-y-2.5">
            {topStreets.map(([street, count], idx) => (
              <motion.div
                key={street}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2.5"
              >
                <span className="text-xs text-card-foreground truncate flex-1 mr-2">{street}</span>
                <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded-full">{count}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Area Breakdown */}
        <h3 className="font-bold text-sm text-foreground">Area-by-Area Breakdown</h3>
        {sortedAreas.map(([area, data], idx) => {
          const resolutionRate = data.total > 0 ? Math.round((data.resolved / data.total) * 100) : 0;
          const topCategory = Object.entries(data.categories).sort((a, b) => b[1] - a[1])[0];
          const trend = data.pending > data.resolved ? 'rising' : 'improving';

          return (
            <motion.div
              key={area}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`bg-card rounded-2xl p-4 border shadow-sm ${data.emergencies > 0 ? 'border-emergency/30' : 'border-border'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-bold text-card-foreground">{area}</span>
                </div>
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  trend === 'rising' ? 'bg-emergency/10 text-emergency' : 'bg-success/10 text-success'
                }`}>
                  {trend === 'rising' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {trend === 'rising' ? 'Rising' : 'Improving'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-muted/50 rounded-xl p-2 text-center">
                  <p className="text-lg font-bold text-card-foreground">{data.total}</p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-2 text-center">
                  <p className="text-lg font-bold text-warning">{data.pending}</p>
                  <p className="text-[10px] text-muted-foreground">Pending</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-2 text-center">
                  <p className="text-lg font-bold text-success">{resolutionRate}%</p>
                  <p className="text-[10px] text-muted-foreground">Resolved</p>
                </div>
              </div>

              {topCategory && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Top Issue:</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {CATEGORY_ICONS[topCategory[0] as keyof typeof CATEGORY_ICONS]} {CATEGORY_LABELS[topCategory[0] as keyof typeof CATEGORY_LABELS]}
                  </span>
                </div>
              )}

              {data.emergencies > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-emergency">
                  <AlertTriangle className="h-3 w-3" />
                  {data.emergencies} active emergency report(s)
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AreaAnalyticsPage;
