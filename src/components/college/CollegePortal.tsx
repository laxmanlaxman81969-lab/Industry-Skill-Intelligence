import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CurriculumCourse } from '../../types';
import {
  GraduationCap,
  BookOpen,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Layers,
  Sparkles,
  Users,
  Award,
  Building
} from 'lucide-react';

export const CollegePortal: React.FC = () => {
  const { collegeProfile, curriculum, studentProfile, industrySkills } = useApp();
  const [activeTab, setActiveTab] = useState<'curriculum-mapping' | 'cohort-analytics' | 'profile'>('curriculum-mapping');

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Institutional Dean Portal
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">{collegeProfile.accreditation}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {collegeProfile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Curriculum-to-Industry Alignment & Student Placement Readiness Intelligence.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('curriculum-mapping')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'curriculum-mapping'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Curriculum Mapping
          </button>
          <button
            onClick={() => setActiveTab('cohort-analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cohort-analytics'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cohort Readiness Radar
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CURRICULUM-TO-INDUSTRY SKILL MAPPING (PART 2 SPEC) */}
      {/* ========================================================================= */}
      {activeTab === 'curriculum-mapping' && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Academic Curriculum vs Industry Demand Analyzer</span>
            </h3>
            <p className="text-xs text-slate-300">
              Evaluates university syllabus against real-time company hiring requisitions. Pinpoints legacy courses and provides actionable modernization recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {curriculum.map((course) => {
              const isOutdated = course.status === 'Outdated';
              const needsUpdate = course.status === 'Needs Update';
              const isAligned = course.status === 'Aligned';

              return (
                <div
                  key={course.code}
                  className={`p-6 rounded-3xl border flex flex-col justify-between ${
                    isOutdated
                      ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20'
                      : needsUpdate
                      ? 'bg-slate-900/90 border-amber-500/30'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            Semester {course.semester} • {course.code}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1">{course.title}</h4>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          isOutdated
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : needsUpdate
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>

                    {/* Alignment Meter */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Industry Alignment</span>
                        <span className={`font-bold ${isOutdated ? 'text-rose-400' : 'text-teal-300'}`}>
                          {course.industryAlignmentScore}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            isOutdated
                              ? 'bg-rose-500'
                              : needsUpdate
                              ? 'bg-amber-400'
                              : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          }`}
                          style={{ width: `${course.industryAlignmentScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Taught Skills */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Syllabus Covered Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {course.taughtSkills.map((sk) => (
                          <span key={sk} className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Modernization Recommendations */}
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-1.5 text-xs">
                      <p className="font-semibold text-teal-300 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Curriculum Modernization Recommendations:</span>
                      </p>
                      <ul className="text-slate-400 text-[11px] space-y-1">
                        {course.recommendedUpdates.map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => alert(`Curriculum update requisition drafted for state board review: ${course.code}`)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      Draft Syllabus Revision
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COHORT READINESS RADAR */}
      {/* ========================================================================= */}
      {activeTab === 'cohort-analytics' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Enrolled Batch</span>
              <p className="text-2xl font-black text-white mt-1">1,450</p>
              <span className="text-[10px] text-teal-400 font-mono">B.Tech / M.Tech / MCA</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Average Readiness</span>
              <p className="text-2xl font-black text-teal-300 mt-1">68%</p>
              <span className="text-[10px] text-slate-400 font-mono">+12% from last semester</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Placement Ready (75%+)</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">428</p>
              <span className="text-[10px] text-emerald-400 font-mono">Ready for campus drives</span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Top Identified Gap</span>
              <p className="text-base font-bold text-rose-400 mt-1">Spring Boot / Docker</p>
              <span className="text-[10px] text-rose-400 font-mono">Action required</span>
            </div>
          </div>

          {/* Sample Cohort Student List */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Student Placement Readiness Pipeline</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">B.Tech CSE Batch 2027</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{studentProfile.fullName}</p>
                <p className="text-xs text-slate-400">
                  Target: <strong className="text-slate-200">{studentProfile.targetRole}</strong> • Verified Skills: {studentProfile.skills.length}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Readiness</span>
                  <p className="text-xl font-bold text-teal-300">{studentProfile.overallReadiness}%</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Eligible for ABC Tech Drive
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
