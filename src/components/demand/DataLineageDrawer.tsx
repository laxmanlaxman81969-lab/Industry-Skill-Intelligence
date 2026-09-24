import React from 'react';
import { MarketSnapshot } from '../../services/industryDemandApi';
import { X, ShieldCheck, CheckCircle2, Database, ArrowDown, Activity } from 'lucide-react';

interface DataLineageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: MarketSnapshot | null;
}

export const DataLineageDrawer: React.FC<DataLineageDrawerProps> = ({
  isOpen,
  onClose,
  snapshot
}) => {
  if (!isOpen) return null;

  const pipelineStages = [
    { name: '1. Source Ingestion', desc: 'Employer portal requisitions & public career feeds ingested into raw buffer', status: 'Completed' },
    { name: '2. Parsing & OCR', desc: 'Job titles, required competencies, and department metadata extracted', status: 'Completed' },
    { name: '3. Skill Normalization', desc: 'Synonyms & aliases mapped to canonical skills taxonomy', status: 'Completed' },
    { name: '4. Deduplication Engine', desc: 'Multi-posted requisitions matched by company, role & location hash', status: 'Completed' },
    { name: '5. Time-Series Aggregation', desc: 'Historical monthly buckets generated for growth and momentum', status: 'Completed' },
    { name: '6. Deterministic Demand Score', desc: '40% Volume + 25% Growth + 20% Diversity + 15% Agreement', status: 'Completed' },
    { name: '7. Dashboard Display', desc: 'Filtered and served to Student & College Intelligence interfaces', status: 'Active' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                    Audit Lineage
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Data Sources & Lineage
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Traceable multi-source architecture powering the Industry Demand Engine.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Configured Sources Status */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                <span>Configured Data Sources</span>
                <span className="text-emerald-700 font-semibold text-[10px]">
                  {snapshot?.activeSources.length || 4} Connected
                </span>
              </h3>

              <div className="space-y-2">
                {(snapshot?.activeSources || []).map((source) => (
                  <div
                    key={source.name}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{source.name}</p>
                      <span className="text-[11px] text-slate-500">
                        {source.signalsCount.toLocaleString()} Verified Signals
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {source.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* End-to-End Data Pipeline Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                End-to-End Ingestion Pipeline
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                {pipelineStages.map((stage, idx) => (
                  <div key={idx} className="relative text-xs">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-600 shadow-2xs">
                      ✓
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <p className="font-bold text-slate-900 text-xs">{stage.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <p className="text-[11px]">
              <strong>Compliance Guarantee:</strong> Only public and platform-authorized requisitions are processed. Private social and search scraping is disallowed.
            </p>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
