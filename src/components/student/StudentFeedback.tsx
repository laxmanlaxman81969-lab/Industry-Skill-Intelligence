import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart2,
  Star,
  FlaskConical,
  Video,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Award,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { InterviewResult, Assignment } from '../../types';

interface StudentFeedbackProps {
  onNavigate: (view: string) => void;
}

const ScoreBar = ({ score, color = 'blue' }: { score: number; color?: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };
  const barColor = colorMap[color] || 'bg-blue-600';
  return (
    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div
        className={`${barColor} h-1.5 rounded-full transition-all`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
};

const InterviewCard = ({
  result,
  index,
}: {
  result: InterviewResult;
  index: number;
}) => {
  const riskColor =
    result.integrityRisk === 'LOW'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : result.integrityRisk === 'MEDIUM'
      ? 'text-amber-700 bg-amber-50 border-amber-200'
      : 'text-rose-700 bg-rose-50 border-rose-200';

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono text-slate-400">Interview #{index + 1} · {result.date}</p>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">{result.role}</h3>
          <p className="text-xs text-slate-500">{result.difficulty} Difficulty</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-blue-600">{result.overallScore}</p>
          <p className="text-[10px] text-slate-400">Overall Score</p>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="space-y-2">
        {[
          { label: 'Technical', score: result.technicalScore },
          { label: 'Communication', score: result.communicationScore },
          { label: 'Problem Solving', score: result.problemSolvingScore },
          { label: 'Confidence', score: result.confidenceScore },
        ].map(({ label, score }) => (
          <div key={label} className="flex items-center space-x-3">
            <span className="text-[10px] text-slate-500 w-28 shrink-0">{label}</span>
            <ScoreBar score={score} />
            <span className="text-[11px] font-mono font-bold text-slate-700 w-6 text-right">{score}</span>
          </div>
        ))}
      </div>

      {/* Integrity badge */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${riskColor}`}>
          Integrity Risk: {result.integrityRisk}
        </span>
        <span className="text-[10px] text-slate-500">{result.integrityWarningsCount} warning(s)</span>
      </div>

      {/* Skills verified */}
      {result.claimedSkillsAnalysis.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Skill Verification</p>
          {result.claimedSkillsAnalysis.map((s) => (
            <div key={s.skill} className="flex items-center justify-between text-xs">
              <span className="text-slate-800 font-medium">{s.skill}</span>
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                  s.status === 'Verified'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : s.status === 'Needs Practice'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-rose-700 bg-rose-50 border-rose-200'
                }`}
              >
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Strengths & improvements */}
      {result.strengths.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">Strengths</p>
            <ul className="space-y-0.5">
              {result.strengths.slice(0, 3).map((s) => (
                <li key={s} className="text-[10px] text-slate-600 flex items-start space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">To Improve</p>
            <ul className="space-y-0.5">
              {result.areasOfImprovement.slice(0, 3).map((s) => (
                <li key={s} className="text-[10px] text-slate-600 flex items-start space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const AssignmentFeedbackCard = ({ assignment }: { assignment: Assignment }) => {
  const fb = assignment.feedback;
  if (!fb) return null;

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {assignment.targetSkill}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">{assignment.title}</h3>
          <p className="text-xs text-slate-500">Assignment Evaluation Report</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-blue-600">{assignment.score || fb.technicalCorrectness}</p>
          <p className="text-[10px] text-slate-400">Score / 100</p>
        </div>
      </div>

      <div className="space-y-2">
        {[
          { label: 'Technical Correctness', score: fb.technicalCorrectness },
          { label: 'Concept Understanding', score: fb.conceptUnderstanding },
          { label: 'Code Quality', score: fb.codeQuality },
          { label: 'Problem Solving', score: fb.problemSolving },
        ].map(({ label, score }) => (
          <div key={label} className="flex items-center space-x-3">
            <span className="text-[10px] text-slate-500 w-36 shrink-0">{label}</span>
            <ScoreBar score={score} />
            <span className="text-[11px] font-mono font-bold text-slate-700 w-6 text-right">{score}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        {fb.whatYouDidWell.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase mb-1">What You Did Well</p>
            <ul className="space-y-1">
              {fb.whatYouDidWell.slice(0, 3).map((w, i) => (
                <li key={i} className="text-[10px] text-slate-600 flex items-start space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {fb.whatToImprove.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">What to Improve</p>
            <ul className="space-y-1">
              {fb.whatToImprove.slice(0, 3).map((w, i) => (
                <li key={i} className="text-[10px] text-slate-600 flex items-start space-x-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {fb.whatToLearnNext.length > 0 && (
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] font-bold text-blue-700 uppercase mb-1">What to Learn Next</p>
          <div className="flex flex-wrap gap-1">
            {fb.whatToLearnNext.map((item, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const StudentFeedback: React.FC<StudentFeedbackProps> = ({ onNavigate }) => {
  const { interviewResults, assignments } = useApp();

  const completedAssignments = assignments.filter((a) => a.completed && a.feedback);
  const totalEvaluations = interviewResults.length + completedAssignments.length;

  const avgInterviewScore =
    interviewResults.length > 0
      ? Math.round(
          interviewResults.reduce((acc, r) => acc + r.overallScore, 0) / interviewResults.length
        )
      : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Feedback & Performance
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Consolidated AI evaluation reports from mock interviews and practice lab code challenges.
          </p>
        </div>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Interviews Completed</span>
            <Video className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{interviewResults.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {interviewResults.length > 0 ? 'AI video interviews evaluated' : 'No interviews yet'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Interview Score</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            {avgInterviewScore !== null ? `${avgInterviewScore}/100` : '—'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {avgInterviewScore !== null && avgInterviewScore >= 75 ? 'Above industry benchmark' : 'Keep practicing'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Assignments Graded</span>
            <FlaskConical className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{completedAssignments.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Code challenges evaluated by AI</p>
        </div>
      </div>

      {/* Empty state */}
      {totalEvaluations === 0 && (
        <div className="p-10 rounded-2xl bg-white border border-slate-200/90 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No evaluations yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Complete practice lab challenges or take an AI mock interview to receive structured feedback.
            </p>
          </div>
          <div className="flex items-center justify-center space-x-3 pt-2">
            <button
              onClick={() => onNavigate('practice-lab')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Start Assignment
            </button>
            <button
              onClick={() => onNavigate('mock-interview')}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              AI Mock Interview
            </button>
          </div>
        </div>
      )}

      {/* Interview Results */}
      {interviewResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">AI Video Mock Interview Reports</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviewResults.map((result, i) => (
              <InterviewCard key={result.id} result={result} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Assignment Feedback */}
      {completedAssignments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Practice Lab Code Review Reports</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedAssignments.map((assignment) => (
              <AssignmentFeedbackCard key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
