import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_ROLES, INDUSTRIES } from '../../data/seedData';
import {
  TrendingUp,
  Minus,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  ArrowRight,
  Compass,
  FileSearch,
  Code2,
  Video,
  Briefcase,
  Layers,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { studentProfile, industrySkills, isPrototypeData, demandLastUpdated, jobs } = useApp();

  // Filters (Part 8)
  const [selectedRole, setSelectedRole] = useState<string>(studentProfile.targetRole || 'Java Backend Developer');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All Industries');
  const [selectedExperience, setSelectedExperience] = useState<string>('0-2 Years (Freshers)');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<string>('Last 30 Days');
  const [techFilter, setTechFilter] = useState<string>('All Technologies');

  // Greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter skills based on selected filters
  const currentRoleSkills = industrySkills.filter((skill) => {
    const roleMatch = skill.role.toLowerCase() === selectedRole.toLowerCase();
    const indMatch = selectedIndustry === 'All Industries' || skill.industry === selectedIndustry;
    const catMatch = techFilter === 'All Technologies' || skill.category === techFilter;
    return (roleMatch || selectedRole === 'Software Engineer (General)') && indMatch && catMatch;
  });

  // Calculate missing vs acquired
  const studentSkillNames = studentProfile.skills.map((s) => s.name.toLowerCase());
  const criticalSkills = currentRoleSkills.filter((s) => s.importance === 'Critical');
  const criticalMissing = criticalSkills.filter(
    (cs) => !studentSkillNames.includes(cs.name.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR (PART 8) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-teal-400 font-semibold uppercase tracking-wider">
              {studentProfile.college}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {studentProfile.degree} ({studentProfile.branch})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {studentProfile.fullName.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Here is what the industry currently expects for your target career.
          </p>
        </div>

        {/* Readiness and Target Role Cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-mono font-medium">Target Role</p>
              <p className="text-xs font-bold text-white">{studentProfile.targetRole}</p>
            </div>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-teal-300 uppercase font-mono font-medium">Career Readiness</p>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-teal-300">{studentProfile.overallReadiness}%</span>
                <span className="text-[10px] text-slate-400">Target 75%+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK PIPELINE SHORTCUTS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('gap-analyzer')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileSearch className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
          </div>
          <p className="text-xs font-bold text-white">AI Skill Gap</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {criticalMissing.length > 0 ? `${criticalMissing.length} Critical Gaps` : 'Profile Aligned'}
          </p>
        </button>

        <button
          onClick={() => onNavigate('roadmap')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Layers className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
          </div>
          <p className="text-xs font-bold text-white">Growth Roadmap</p>
          <p className="text-[10px] text-slate-400 mt-0.5">8 Structured Steps</p>
        </button>

        <button
          onClick={() => onNavigate('practice-lab')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Code2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
          </div>
          <p className="text-xs font-bold text-white">Practice Lab</p>
          <p className="text-[10px] text-slate-400 mt-0.5">REST API Assignment</p>
        </button>

        <button
          onClick={() => onNavigate('mock-interview')}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-900 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Video className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </div>
          <p className="text-xs font-bold text-white">AI Mock Interview</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Camera & Integrity AI</p>
        </button>
      </div>

      {/* PRIMARY SECTION: CURRENT INDUSTRY DEMAND (PART 8 & 9) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                <Compass className="w-5 h-5 text-teal-400" />
                <span>CURRENT INDUSTRY DEMAND</span>
              </h2>
              {isPrototypeData && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Prototype / Sample Industry Data
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Demand data updated on: <strong className="text-slate-300">{demandLastUpdated}</strong></span>
            </p>
          </div>

          <button
            onClick={() => onNavigate('gap-analyzer')}
            className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500 hover:text-slate-950 text-xs font-semibold transition-all"
          >
            <span>Compare My Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* MULTI-CRITERIA FILTERS BAR (PART 8) */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Role Filter */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
              Job Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              {SUPPORTED_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="All Industries">All Industries</option>
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Technology Category */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
              Technology Stack
            </label>
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="All Technologies">All Technologies</option>
              <option value="Language">Languages</option>
              <option value="Backend">Backend & Frameworks</option>
              <option value="Frontend">Frontend</option>
              <option value="Database">Databases</option>
              <option value="Cloud/DevOps">Cloud & DevOps</option>
              <option value="Security">Security</option>
              <option value="Core CS">Core CS</option>
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
              Experience Level
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="0-2 Years (Freshers)">0-2 Years (Freshers)</option>
              <option value="2-4 Years (Mid Level)">2-4 Years (Mid Level)</option>
              <option value="Internship Only">Internship Only</option>
            </select>
          </div>

          {/* Time Period */}
          <div>
            <label className="block text-[10px] font-medium text-slate-400 uppercase mb-1">
              Time Period
            </label>
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-teal-500 focus:outline-none"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last 90 Days">Last 90 Days</option>
              <option value="Current Academic Year 2026">Current Year 2026</option>
            </select>
          </div>
        </div>

        {/* TOP SKILLS IN DEMAND TABLE / CARDS (PART 8 SPEC) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRoleSkills.map((skill) => {
            const hasSkill = studentSkillNames.includes(skill.name.toLowerCase());
            const studentVersion = studentProfile.skills.find(
              (s) => s.name.toLowerCase() === skill.name.toLowerCase()
            );

            return (
              <div
                key={skill.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {skill.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{skill.name}</h3>
                    </div>

                    {/* Trend Indicator */}
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        skill.trend === 'Growing'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : skill.trend === 'Declining'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {skill.trend === 'Growing' && <TrendingUp className="w-3 h-3" />}
                      {skill.trend === 'Declining' && <TrendingDown className="w-3 h-3" />}
                      {skill.trend === 'Stable' && <Minus className="w-3 h-3" />}
                      <span>{skill.trend}</span>
                    </span>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Demand Frequency</span>
                      <span className="text-teal-300 font-bold">{skill.demandScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    {skill.whyItMatters}
                  </p>
                </div>

                {/* Student Match Status Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    {hasSkill ? (
                      <span className="inline-flex items-center space-x-1 text-teal-400 text-[11px] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>You have: {studentVersion?.level}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-rose-400 text-[11px] font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Missing in your profile</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => onNavigate('gap-analyzer')}
                    className="text-[11px] text-slate-400 hover:text-teal-300 transition-colors underline"
                  >
                    Analyze Gap
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTIVE HIRING REQUISITION RADAR PREVIEW */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-teal-400" />
              <span>Target Role Benchmark Opportunities</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live corporate openings filtering for your target career: {studentProfile.targetRole}
            </p>
          </div>
          <button
            onClick={() => onNavigate('opportunities')}
            className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
          >
            View All ({jobs.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {jobs.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-white">{job.companyName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">
                    Min {job.minReadinessScore}%
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">{job.title}</h4>
                <p className="text-xs text-teal-400 font-mono mb-2">{job.package}</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">{job.location}</span>
                <button
                  onClick={() => onNavigate('opportunities')}
                  className="text-teal-400 hover:text-teal-300 font-medium"
                >
                  Check Match →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
