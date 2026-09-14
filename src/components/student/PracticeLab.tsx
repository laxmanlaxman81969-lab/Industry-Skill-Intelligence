import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment } from '../../types';
import {
  Code2,
  Play,
  FolderGit2,
  CheckCircle2,
  Sparkles,
  Award,
  AlertCircle,
  FileCode,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PracticeLabProps {
  onNavigateToRoadmap: () => void;
}

export const PracticeLab: React.FC<PracticeLabProps> = ({ onNavigateToRoadmap }) => {
  const { assignments, submitAssignment, studentProfile } = useApp();

  const [activeAssignmentId, setActiveAssignmentId] = useState<string>(assignments[0]?.id || '');
  const activeAssignment = assignments.find((a) => a.id === activeAssignmentId) || assignments[0];

  const [userCode, setUserCode] = useState<string>(activeAssignment?.starterCode || '');
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<Assignment['feedback'] | null>(
    activeAssignment?.feedback || null
  );

  const handleSelectAssignment = (asg: Assignment) => {
    setActiveAssignmentId(asg.id);
    setUserCode(asg.starterCode || '');
    setSubmissionFeedback(asg.feedback || null);
    setRepoUrl('');
  };

  const handleRunEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const feedback = submitAssignment(activeAssignment.id, userCode, repoUrl);
      setIsSubmitting(false);
      setSubmissionFeedback(feedback || null);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // confetti fallback
      }
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR (PART 17) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Part 17 & 18 Lab
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Target Role: {studentProfile.targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Skill Practice Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Solve real-world coding problems triggered by identified skill gaps. Submissions are evaluated by AI across 4 technical rubrics.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-teal-400">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>AI Code Evaluation Active</span>
        </div>
      </div>

      {/* LAB WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Available Gap Assignments */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
            Gap-Triggered Assignments ({assignments.length})
          </h3>

          <div className="space-y-3">
            {assignments.map((asg) => {
              const isSelected = asg.id === activeAssignmentId;
              return (
                <div
                  key={asg.id}
                  onClick={() => handleSelectAssignment(asg)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/50 shadow-lg shadow-teal-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                      {asg.targetSkill}
                    </span>
                    {asg.completed && (
                      <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Score: {asg.score}%</span>
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{asg.title}</h4>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span>{asg.difficulty}</span>
                    <span>•</span>
                    <span>Est. {asg.estimatedMinutes} mins</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback loop indicator */}
          <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/20 text-xs text-slate-300 space-y-1.5">
            <p className="font-bold text-teal-300 flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Roadmap Feedback Loop</span>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Completing this assignment updates your verified {activeAssignment.targetSkill} proficiency, recalculates readiness, and unlocks next roadmap stages.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Assignment Instructions, Code Editor, Evaluation */}
        <div className="lg:col-span-8 space-y-6">
          {/* Assignment Overview */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-teal-400 uppercase font-semibold">
                  Required Skill Gap Challenge
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeAssignment.title}</h2>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 self-start sm:self-auto">
                Difficulty: {activeAssignment.difficulty}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeAssignment.description}
            </p>

            {/* Requirements Checklist */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                Specification Requirements:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {activeAssignment.requirements.map((req, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-teal-400 font-bold shrink-0">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills Tested */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 font-medium mr-1">Skills Tested:</span>
              {activeAssignment.skillsTested.map((s) => (
                <span key={s} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CODE EDITOR & REPO SUBMISSION FORM */}
          <form onSubmit={handleRunEvaluation} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-white font-mono">
                  Solution Code (Java / Spring / SQL)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Syntax Highlighted Simulation
              </span>
            </div>

            <textarea
              rows={12}
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              placeholder="// Type or paste your code solution here..."
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:border-teal-500 focus:outline-none leading-relaxed resize-y"
            />

            {/* Optional GitHub Repo Link */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1.5">
                <FolderGit2 className="w-4 h-4 text-slate-400" />
                <span>GitHub Repository URL (Optional for full project evaluation)</span>
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/student-management-api"
                className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Evaluation checks correctness, concept understanding, code quality & problem solving.
              </span>
              <button
                type="submit"
                disabled={isSubmitting || userCode.trim().length < 10}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 disabled:opacity-50 transition-all shadow-md shadow-teal-500/20"
              >
                <span>{isSubmitting ? 'Evaluating Code with AI...' : 'Submit Code for AI Grading'}</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </form>

          {/* ========================================================================= */}
          {/* AI EVALUATION REPORT (PART 18 SPEC) */}
          {/* ========================================================================= */}
          {submissionFeedback && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-teal-500/40 space-y-6 animate-fade-in shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-teal-400 font-semibold">
                    Part 18 Transparent Evaluation
                  </span>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-teal-400" />
                    <span>Assignment Grading Report</span>
                  </h3>
                </div>

                <div className="flex items-baseline space-x-1.5">
                  <span className="text-xs text-slate-400 font-mono">OVERALL SCORE:</span>
                  <span className="text-3xl font-black text-teal-300">
                    {Math.round(
                      (submissionFeedback.technicalCorrectness +
                        submissionFeedback.conceptUnderstanding +
                        submissionFeedback.codeQuality +
                        submissionFeedback.problemSolving) /
                        4
                    )}
                  </span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              {/* 4 Rubric Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Technical Correctness</span>
                  <p className="text-base font-bold text-teal-300 mt-0.5">
                    {submissionFeedback.technicalCorrectness} / 100
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Concept Understanding</span>
                  <p className="text-base font-bold text-emerald-300 mt-0.5">
                    {submissionFeedback.conceptUnderstanding} / 100
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Code Quality</span>
                  <p className="text-base font-bold text-white mt-0.5">
                    {submissionFeedback.codeQuality} / 100
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Problem Solving</span>
                  <p className="text-base font-bold text-amber-300 mt-0.5">
                    {submissionFeedback.problemSolving} / 100
                  </p>
                </div>
              </div>

              {/* 3 Categories: What you did well, What to improve, What to learn next (Part 18 Spec) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* What you did well */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-emerald-400 uppercase font-mono text-[10px] flex items-center space-x-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>What You Did Well</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {submissionFeedback.whatYouDidWell.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* What to improve */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                  <h4 className="font-bold text-amber-400 uppercase font-mono text-[10px] flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>What You Need to Improve</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {submissionFeedback.whatToImprove.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>

                {/* What to learn next */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                  <h4 className="font-bold text-indigo-400 uppercase font-mono text-[10px] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>What to Learn Next</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {submissionFeedback.whatToLearnNext.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-teal-400 font-semibold">
                  Skill "{activeAssignment.targetSkill}" updated to Verified in your profile!
                </span>
                <button
                  onClick={onNavigateToRoadmap}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-all shadow-md"
                >
                  <span>Return to Career Growth Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
