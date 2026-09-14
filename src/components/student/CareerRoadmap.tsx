import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_FOUNDATION_PATHS } from '../../data/seedData';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  BookOpen,
  FolderGit2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Check,
  Compass
} from 'lucide-react';

interface CareerRoadmapProps {
  onNavigateToLab: () => void;
  onNavigateToInterview: () => void;
}

export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  onNavigateToLab,
  onNavigateToInterview
}) => {
  const { studentProfile, roadmap, completeRoadmapStep } = useApp();

  // Expanded step for detailed viewing
  const [expandedStepId, setExpandedStepId] = useState<string>(roadmap[2]?.id || roadmap[0]?.id);

  // Tab for Foundation vs Personalized
  const [viewMode, setViewMode] = useState<'personalized' | 'foundation'>(
    studentProfile.skills.length >= 2 ? 'personalized' : 'foundation'
  );

  // Foundation career path selection
  const [selectedFoundationPath, setSelectedFoundationPath] = useState<string>('Java Backend');

  const completedCount = roadmap.filter((r) => r.status === 'completed').length;
  const progressPercent = Math.round((completedCount / roadmap.length) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR (PART 15 SPEC) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Part 15 Milestones
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Target Role: {studentProfile.targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Career Growth Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Structured, milestone-driven technical path calibrated against verified industry hiring requisitions.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setViewMode('personalized')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'personalized'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Personalized Pathway ({roadmap.length} Steps)
          </button>
          <button
            onClick={() => setViewMode('foundation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'foundation'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Build Career Foundation
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERSONALIZED ROADMAP VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'personalized' && (
        <div className="space-y-6 animate-fade-in">
          {/* Progress Overview Bar */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Milestones Cleared: <strong className="text-white">{completedCount} of {roadmap.length} completed</strong>
              </span>
              <span className="font-mono text-teal-400 font-bold">{progressPercent}% Progress</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            {roadmap.map((step, index) => {
              const isExpanded = expandedStepId === step.id;
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in-progress';
              const isLocked = step.status === 'locked';

              return (
                <div
                  key={step.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-slate-900 border-teal-500/40 shadow-xl'
                      : isCompleted
                      ? 'bg-slate-900/40 border-slate-800/80'
                      : isInProgress
                      ? 'bg-slate-900/70 border-teal-500/30'
                      : 'bg-slate-950/40 border-slate-900 opacity-80'
                  }`}
                >
                  {/* Step Header */}
                  <div
                    onClick={() => setExpandedStepId(isExpanded ? '' : step.id)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Step badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 animate-pulse-subtle'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : isLocked ? <Lock className="w-4 h-4" /> : step.stepNumber}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {step.category}
                          </span>
                          <span className="text-[10px] font-mono text-teal-400 font-semibold">
                            {step.industryDemand}% Industry Demand
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                          {step.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`hidden sm:inline-flex px-2.5 py-1 rounded text-[11px] font-semibold ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isInProgress
                            ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Locked'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Step Details (Part 15 & 16 Requirements) */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-6 text-xs animate-fade-in">
                      {/* Metric Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400">Current Level</span>
                          <p className="text-xs font-bold text-white mt-0.5">{step.currentLevel}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400">Target Level</span>
                          <p className="text-xs font-bold text-teal-300 mt-0.5">{step.targetLevel}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400">Difficulty</span>
                          <p className="text-xs font-bold text-amber-300 mt-0.5">{step.difficulty}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <span className="text-[10px] text-slate-400">Estimated Effort</span>
                          <p className="text-xs font-bold text-white mt-0.5 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{step.estimatedHours} Hours</span>
                          </p>
                        </div>
                      </div>

                      {/* Why You Need It */}
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <h4 className="font-bold text-slate-200 uppercase text-[10px] font-mono tracking-wider">
                          Why You Need It in Enterprise Production:
                        </h4>
                        <p className="text-slate-300 text-xs leading-relaxed">
                          {step.whyYouNeedIt}
                        </p>
                      </div>

                      {/* Curated Resources (Part 16 Spec) */}
                      <div className="space-y-2.5">
                        <h4 className="font-bold text-slate-200 uppercase text-[10px] font-mono tracking-wider flex items-center space-x-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                          <span>Curated Learning Resources & Documentation</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 transition-colors flex items-center justify-between group"
                            >
                              <div className="overflow-hidden pr-2">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-teal-400">
                                  {res.type} • {res.duration}
                                </span>
                                <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 mt-1 truncate">
                                  {res.title}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-300 shrink-0" />
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Practice Task & Suggested Project */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/20 space-y-1.5">
                          <div className="flex items-center space-x-1.5 text-teal-400 font-bold text-xs">
                            <FolderGit2 className="w-4 h-4" />
                            <span>Hands-on Practice Task</span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            {step.practiceTask}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 space-y-1.5">
                          <div className="flex items-center space-x-1.5 text-indigo-400 font-bold text-xs">
                            <Sparkles className="w-4 h-4" />
                            <span>Suggested Portfolio Project</span>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            {step.suggestedProject}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 gap-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={onNavigateToLab}
                            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                          >
                            Solve Related Lab Assignment
                          </button>
                        </div>

                        <div>
                          {isCompleted ? (
                            <span className="inline-flex items-center space-x-1 text-emerald-400 text-xs font-semibold">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Milestone Verified</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => completeRoadmapStep(step.id)}
                              className="px-4 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/10"
                            >
                              Mark Milestone Complete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BUILD CAREER FOUNDATION VIEW (NO RESUME / NEW STUDENTS) */}
      {/* ========================================================================= */}
      {viewMode === 'foundation' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-teal-400">
              <Compass className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">
                Build Your Career Foundation
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              For early-stage students without an existing resume. Technologies are organized logically by career path instead of an overwhelming monolithic list.
            </p>

            {/* Path Selection Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.keys(ROLE_FOUNDATION_PATHS).map((pathKey) => (
                <button
                  key={pathKey}
                  onClick={() => setSelectedFoundationPath(pathKey)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedFoundationPath === pathKey
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pathKey}
                </button>
              ))}
            </div>
          </div>

          {/* Active Career Path Steps */}
          {ROLE_FOUNDATION_PATHS[selectedFoundationPath] && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-white">
                  {ROLE_FOUNDATION_PATHS[selectedFoundationPath].title}
                </h4>
                <span className="text-xs font-mono text-teal-400">
                  Recommended for B.Tech CSE / IT
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {ROLE_FOUNDATION_PATHS[selectedFoundationPath].steps.map((stepTitle, idx) => (
                  <div key={idx} className="relative flex items-start space-x-3">
                    <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-teal-500 flex items-center justify-center text-[10px] font-bold text-teal-400 font-mono">
                      {idx + 1}
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 w-full hover:border-slate-700 transition-colors">
                      <h5 className="text-sm font-bold text-slate-200">{stepTitle}</h5>
                      <p className="text-xs text-slate-400 mt-1">
                        Foundational competency required by enterprise recruitment drives before moving to advanced architecture.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
