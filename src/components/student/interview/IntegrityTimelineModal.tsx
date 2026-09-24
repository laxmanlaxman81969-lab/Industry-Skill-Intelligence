import React from 'react';
import { IntegrityEvent } from '../../../types';
import { Shield, ShieldAlert, CheckCircle2, Clock, X, AlertTriangle, Eye, MonitorOff, VideoOff, MicOff } from 'lucide-react';

interface IntegrityTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: IntegrityEvent[];
  warningCount: number;
  accommodationsActive?: boolean;
}

export const IntegrityTimelineModal: React.FC<IntegrityTimelineModalProps> = ({
  isOpen,
  onClose,
  events,
  warningCount,
  accommodationsActive = false
}) => {
  if (!isOpen) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'tab_switch':
      case 'window_blur':
        return <MonitorOff className="w-4 h-4 text-amber-500" />;
      case 'looking_away':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'camera_covered':
      case 'face_absence':
        return <VideoOff className="w-4 h-4 text-rose-500" />;
      case 'mic_muted':
        return <MicOff className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Policy Warning</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Attention Notice</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Telemetry Info</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/80">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Session Integrity Audit Log</h3>
              <p className="text-[11px] text-slate-500">Objective chronological events recorded during this session</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accommodation indicator if enabled */}
        {accommodationsActive && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span><strong>Active Accommodation:</strong> Gaze pattern thresholds calibrated for single-monitor setup and visual comfort.</span>
          </div>
        )}

        {/* Summary Metric Strip */}
        <div className="grid grid-cols-3 gap-2 p-4 bg-white border-b border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-medium block">Total Events</span>
            <span className="text-base font-bold text-slate-900">{events.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-medium block">Formal Warnings</span>
            <span className={`text-base font-bold ${warningCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {warningCount} / 3
            </span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] text-slate-500 font-medium block">Overall Integrity</span>
            <span className="text-base font-bold text-emerald-600">
              {warningCount === 0 ? 'Optimal' : warningCount === 1 ? 'Acceptable' : 'Under Review'}
            </span>
          </div>
        </div>

        {/* Event List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {events.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-700">Flawless Session Integrity</p>
              <p className="text-[11px] max-w-xs mx-auto text-slate-500">
                No window interruptions, off-screen deviations, or hardware disconnects have been recorded.
              </p>
            </div>
          ) : (
            events.map((evt, idx) => (
              <div
                key={evt.incidentId || idx}
                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getEventIcon(evt.eventType)}
                    <span className="font-semibold text-slate-900 capitalize">
                      {evt.eventType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(evt.severity)}
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 inline" />
                      <span>{evt.timestamp}</span>
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {evt.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] text-slate-400">
                  <span>Question #{evt.questionNumber || '—'}</span>
                  <span>Duration: {evt.duration ? `${evt.duration.toFixed(1)}s` : 'Instant'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Events are cryptographically logged for factual institutional review.</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
