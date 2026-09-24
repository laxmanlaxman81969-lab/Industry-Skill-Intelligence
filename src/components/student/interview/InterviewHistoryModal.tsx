import React from 'react';
import { InterviewResult } from '../../../types';
import { History, X, CheckCircle2, AlertTriangle, ArrowRight, Award, Clock } from 'lucide-react';

interface InterviewHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pastInterviews: InterviewResult[];
  onSelectInterview: (interview: InterviewResult) => void;
  onStartNew: () => void;
}

export const InterviewHistoryModal: React.FC<InterviewHistoryModalProps> = ({
  isOpen,
  onClose,
  pastInterviews,
  onSelectInterview,
  onStartNew
}) => {
  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Mock Interview History</h3>
              <p className="text-xs text-slate-500">
                {pastInterviews.length} previous assessment{pastInterviews.length === 1 ? '' : 's'} recorded
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {pastInterviews.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No Interview History Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete your first AI mock interview to generate a performance report and benchmark your skills.
              </p>
            </div>
          ) : (
            pastInterviews.map((item, idx) => {
              const isAuto = item.completionStatus === 'AUTO_SUBMITTED_INTEGRITY_VIOLATION';
              return (
                <div
                  key={item.id || idx}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-blue-300 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{item.role}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.difficulty}
                      </span>
                      {isAuto ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                          Auto-Submitted
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Completed
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTimer(item.durationSeconds || 0)}</span>
                      </span>
                      <span>•</span>
                      <span>{item.questionEvaluations?.length || item.questionCount || 0} Questions</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                      <span className={`text-xl font-black ${item.overallScore >= 75 ? 'text-emerald-600' : item.overallScore >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {item.overallScore}%
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectInterview(item);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onStartNew();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer flex items-center space-x-1.5"
          >
            <span>Start New Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
