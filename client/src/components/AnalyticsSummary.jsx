import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Layers, 
  PieChart, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../services/mockData';

export const AnalyticsSummary = ({ items = [], stats = {} }) => {
  const safeItems = Array.isArray(items) ? items : [];

  const total = stats.total || safeItems.length || 0;
  const lostCount = stats.lost || safeItems.filter(i => i.type === 'Lost').length;
  const foundCount = stats.found || safeItems.filter(i => i.type === 'Found').length;
  const resolvedCount = stats.resolved || safeItems.filter(i => i.status === 'Resolved').length;
  const openCount = stats.open || (total - resolvedCount);

  // Recovery Rate calculation
  const recoveryRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  // Location Hotspots Breakdown
  const locationCounts = LOCATIONS.map(loc => {
    const count = safeItems.filter(i => i.location === loc).length;
    const openInLoc = safeItems.filter(i => i.location === loc && i.status === 'Open').length;
    return { name: loc, count, openCount: openInLoc };
  })
  .filter(l => l.count > 0)
  .sort((a, b) => b.count - a.count);

  const topHotspots = locationCounts.slice(0, 4);

  // Category Breakdown
  const categoryCounts = CATEGORIES.map(cat => {
    const count = safeItems.filter(i => i.category === cat).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { name: cat, count, percentage };
  })
  .filter(c => c.count > 0)
  .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reports */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-cap font-semibold text-zinc-500 uppercase tracking-wider">
              Total Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-800 flex items-center justify-center font-semibold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-zinc-900 tracking-tight mb-1">
              {total}
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="text-rose-600 font-medium">{lostCount} Lost</span>
              <span className="text-zinc-300">•</span>
              <span className="text-emerald-600 font-medium">{foundCount} Found</span>
            </div>
          </div>
        </div>

        {/* Card 2: Resolution / Recovery Rate */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-cap font-semibold text-zinc-500 uppercase tracking-wider">
              Recovery Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">{recoveryRate}%</span>
              <span className="text-xs text-zinc-500 font-mono-cap">({resolvedCount} items)</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${recoveryRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Open Pending Items */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-cap font-semibold text-zinc-500 uppercase tracking-wider">
              Active Open Reports
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-amber-600 tracking-tight mb-1">
              {openCount}
            </div>
            <p className="text-xs text-zinc-500">
              Requires campus security & student matching
            </p>
          </div>
        </div>

        {/* Card 4: Top Loss Location */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col justify-between relative overflow-hidden group hover:border-zinc-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono-cap font-semibold text-zinc-500 uppercase tracking-wider">
              Top Loss Hotspot
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-zinc-900 tracking-tight truncate mb-1" title={topHotspots[0]?.name || 'N/A'}>
              {topHotspots[0]?.name || 'Library'}
            </div>
            <p className="text-xs text-zinc-500 font-mono-cap">
              {topHotspots[0]?.count || 0} total reports registered
            </p>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Grid (Hotspots & Categories) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotspots Panel */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-zinc-700" />
                <h3 className="text-sm font-semibold text-zinc-900">
                  Campus Loss Hotspots
                </h3>
              </div>
              <span className="text-[11px] font-mono-cap text-zinc-400">
                Frequency by Location
              </span>
            </div>

            {topHotspots.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No location statistics available</p>
            ) : (
              <div className="space-y-3">
                {topHotspots.map((spot, idx) => {
                  const percent = total > 0 ? Math.round((spot.count / total) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-zinc-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded bg-zinc-100 text-zinc-600 font-mono text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          {spot.name}
                        </span>
                        <div className="flex items-center gap-2 text-zinc-500 font-mono-cap">
                          <span>{spot.count} items</span>
                          <span className="text-zinc-300">|</span>
                          <span className="text-amber-600 font-medium">{spot.openCount} open</span>
                        </div>
                      </div>
                      <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-zinc-800 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(8, percent)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono-cap">
            <span>High priority monitoring: Library & Canteen</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        {/* Categories Distribution Panel */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-vercel-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-zinc-700" />
                <h3 className="text-sm font-semibold text-zinc-900">
                  Category Distribution
                </h3>
              </div>
              <span className="text-[11px] font-mono-cap text-zinc-400">
                Item Classification
              </span>
            </div>

            {categoryCounts.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No category statistics available</p>
            ) : (
              <div className="space-y-3">
                {categoryCounts.slice(0, 5).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                    <span className="font-medium text-zinc-800 w-32 truncate">{cat.name}</span>
                    <div className="flex-1 bg-zinc-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-zinc-900 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${cat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-mono-cap text-zinc-500 w-12 text-right">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500 font-mono-cap">
            <span>Most lost items: ID Cards & Electronics</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          </div>
        </div>
      </div>
    </div>
  );
};
