import React from 'react';
import { Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface MarketPulseMonitorProps {
  status: 'MONITORING' | 'SYNCING' | 'UPDATED' | 'PARTIAL DATA' | 'SOURCE ISSUE';
  activeSignalsCount: number;
}

export const MarketPulseMonitor: React.FC<MarketPulseMonitorProps> = ({
  status,
  activeSignalsCount
}) => {
  return (
    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'SYNCING'
                ? 'bg-blue-600 animate-ping'
                : status === 'SOURCE ISSUE'
                ? 'bg-rose-500'
                : 'bg-emerald-500 animate-pulse'
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
            MARKET PULSE • {status}
          </span>
        </div>

        <span className="text-slate-500 text-[11px] hidden sm:inline">
          Continuously aggregating verified requisitions across national hubs
        </span>
      </div>

      {/* Subtle EKG pulse SVG line */}
      <div className="flex items-center space-x-3 self-end sm:self-auto">
        <svg
          className="w-28 h-6 text-blue-600/70 overflow-visible"
          viewBox="0 0 100 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="M0 12 L30 12 L36 4 L42 20 L48 8 L54 16 L60 12 L100 12"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />
        </svg>

        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
          {activeSignalsCount.toLocaleString()} Signals Ingested
        </span>
      </div>
    </div>
  );
};
