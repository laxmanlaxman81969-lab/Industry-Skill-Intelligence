import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_ROLES } from '../../data/seedData';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Minus,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Video,
  Award,
  Layers,
  Building2,
  GraduationCap,
  Users,
  Compass,
  Code2,
  Briefcase,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuth: (role?: UserRole) => void;
  onNavigateToStudent: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onNavigateToStudent
}) => {
  const { industrySkills, isPrototypeData, demandLastUpdated, jobs } = useApp();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('Java Backend Developer');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter industry skills based on role and search query
  const filteredSkills = industrySkills.filter((skill) => {
    const matchesRole =
      selectedRoleFilter === 'All Roles' ||
      skill.role.toLowerCase() === selectedRoleFilter.toLowerCase() ||
      selectedRoleFilter.includes(skill.role);
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const timelineSteps = [
    {
      num: '01',
      title: 'Discover Industry Demand',
      desc: 'Real-time aggregated hiring requisitions from top tech enterprises show exact required skills.',
      icon: Compass
    },
    {
      num: '02',
      title: 'Analyze Your Skills',
      desc: 'Upload your resume or build your skill matrix with verified confidence ratings (Beginner, Intermediate, Advanced).',
      icon: FileCheck
    },
    {
      num: '03',
      title: 'Find Your Skill Gap',
      desc: 'AI comparison identifies Strong Skills, Needs Improvement, and Missing Skills required for your target role.',
      icon: AlertCircle
    },
    {
      num: '04',
      title: 'Follow Your Roadmap',
      desc: 'Execute a milestone-based Career Growth Roadmap with curated enterprise documentation and architecture patterns.',
      icon: Layers
    },
    {
      num: '05',
      title: 'Complete Assignments',
      desc: 'Solve real-world coding problems in the Skill Practice Lab evaluated across 4 technical rubrics.',
      icon: Code2
    },
    {
      num: '06',
      title: 'Take AI Mock Interview',
      desc: 'Engage with an adaptive AI interviewer with student camera, voice interaction, and integrity monitoring.',
      icon: Video
    },
    {
      num: '07',
      title: 'Measure Career Readiness',
      desc: 'Generate a transparent, verifiable readiness score reflecting proven capabilities, not just keywords.',
      icon: Award
    },
    {
      num: '08',
      title: 'Discover Opportunities',
      desc: 'Access verified job and internship openings curated specifically for your authenticated skill profile.',
      icon: Briefcase
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none overflow-hidden -z-10 opacity-30">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
      </div>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart India Hackathon 2026 • Problem Statement SIH26134</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Turn Your Skills Into{' '}
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Real Opportunities.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Understand what the industry needs, discover your skill gaps, build the right skills, and prove your readiness before you apply.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-sm hover:from-teal-400 hover:to-emerald-400 shadow-xl shadow-teal-500/20 hover:shadow-teal-500/35 transition-all"
              >
                <span>Start Your Career Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  document.getElementById('industry-skills')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 hover:border-slate-600 transition-all"
              >
                <span>Explore Industry Demand</span>
              </button>
            </div>

            {/* Quick Micro-stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80">
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">14+</p>
                <p className="text-xs text-slate-400">Target Tech Roles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-400 tracking-tight">100%</p>
                <p className="text-xs text-slate-400">Verified Rubrics</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400 tracking-tight">0-to-1</p>
                <p className="text-xs text-slate-400">Campus To Industry</p>
              </div>
            </div>
          </div>

          {/* Right Column: Professional Interactive Dashboard Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl glass-panel p-6 shadow-2xl shadow-teal-950/40 border border-slate-700/60 transition-all hover:border-teal-500/40">
              {/* Header inside mockup */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 pl-2">
                    skill-gap-alignment://aarav-sharma.analysis
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Target: Java Backend
                </span>
              </div>

              {/* Grid inside dashboard preview */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Metric 1: Career Readiness */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Career Readiness</span>
                  <div className="flex items-baseline space-x-2 my-2">
                    <span className="text-3xl font-extrabold text-teal-400">68%</span>
                    <span className="text-xs text-teal-400/80">Benchmark 75%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full w-[68%] transition-all duration-1000" />
                  </div>
                </div>

                {/* Metric 2: Skill Match */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium">Target Skill Match</span>
                  <div className="flex items-baseline space-x-2 my-2">
                    <span className="text-3xl font-extrabold text-white">72%</span>
                    <span className="text-xs text-slate-400">Role Stack</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <span className="text-teal-400 font-semibold">5 Matched</span>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">3 Missing</span>
                  </div>
                </div>
              </div>

              {/* Micro Breakdown: Industry Demand vs Skill Gap */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Role Skills vs Gaps</span>
                  <span className="text-slate-400 font-mono text-[11px]">ABC Technologies Requisition</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-slate-300 font-medium">Core Java</span>
                    </div>
                    <span className="text-teal-400 font-mono text-[11px]">Advanced (Verified)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-slate-300 font-medium">SQL & Relational DB</span>
                    </div>
                    <span className="text-teal-400 font-mono text-[11px]">Intermediate</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-slate-300 font-medium">Spring Boot Microservices</span>
                    </div>
                    <span className="text-rose-400 font-mono text-[11px] font-semibold">Critical Gap (84% Demand)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-slate-300 font-medium">REST API Design</span>
                    </div>
                    <span className="text-amber-400 font-mono text-[11px]">Practice Lab Recommended</span>
                  </div>
                </div>
              </div>

              {/* Floating Highlight Card */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Video className="w-4 h-4 text-teal-400" />
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white">AI Mock Interview Verified</p>
                    <p className="text-[10px] text-slate-400">Technical Score: 82% • Low Integrity Risk</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                  Ready to Apply
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (PART 4) */}
      <section id="how-it-works" className="py-20 bg-slate-900/50 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
              The Student Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Campus Confusion to Industry Preparedness
            </h2>
            <p className="text-sm text-slate-400">
              A continuous, evidence-backed pipeline answering: What should you learn, why should you learn it, and how does it prove your hiring readiness?
            </p>
          </div>

          {/* Clean Visual Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timelineSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="relative p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/40 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-slate-600 group-hover:text-teal-400 transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDUSTRY DEMAND PREVIEW SECTION (PART 5 & PART 9) */}
      <section id="industry-skills" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
                Industry Demand Engine
              </span>
              {isPrototypeData && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Prototype / Sample Industry Data
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Top Skills Currently in Demand
            </h2>
            <p className="text-xs text-slate-400">
              Demand data updated on: <span className="text-teal-300 font-medium">{demandLastUpdated}</span>
            </p>
          </div>

          {/* Role Filter Selector */}
          <div className="flex flex-wrap gap-2">
            {['Java Backend Developer', 'Frontend Developer', 'AI/ML Engineer', 'Cloud / DevOps Engineer', 'All Roles'].map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedRoleFilter === role
                    ? 'bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Demand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.slice(0, 9).map((skill) => {
            const isGrowing = skill.trend === 'Growing';
            const isDeclining = skill.trend === 'Declining';

            return (
              <div
                key={skill.id}
                className="p-5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-teal-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {skill.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{skill.name}</h4>
                    </div>

                    {/* Trend Indicator */}
                    <div
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        isGrowing
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isDeclining
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isGrowing ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : isDeclining ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                      <span>{skill.trend}</span>
                    </div>
                  </div>

                  {/* Demand Percentage Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Industry Requisitions</span>
                      <span className="font-mono font-bold text-white">{skill.demandScore}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {skill.whyItMatters}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{skill.totalObservations.toLocaleString()} postings</span>
                  <span className="capitalize">{skill.importance} Priority</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore More Note */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onOpenAuth('student')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          >
            <span>Sign in to unlock customized skill gap analysis across 14+ careers</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* STAKEHOLDERS ECOSYSTEM SECTION (PART 2) */}
      <section id="stakeholders" className="py-20 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">
              Unified Career Intelligence
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              One Ecosystem. Four Specialized Portals.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Students</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Stop shooting in the dark. Know exactly which skills companies expect, pinpoint your specific gaps, and practice with real assignments and mock interviews.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Resume Scanner & Manual Matrix</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Personalized Step-by-Step Roadmap</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>AI Video Interview with Integrity Monitor</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('student')}
                className="w-full py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold hover:bg-teal-500 hover:text-slate-950 transition-all"
              >
                Access Student Portal
              </button>
            </div>

            {/* College Card */}
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Colleges</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Bridge academic syllabus to market expectations. Map curriculum against live industry demand and track whole cohort placement readiness.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Curriculum-to-Industry Skill Mapping</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Cohort Readiness & Gap Heatmaps</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Placement Forecasting Analytics</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('college')}
                className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                Access College Portal
              </button>
            </div>

            {/* Company Card */}
            <div className="p-8 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">For Companies</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  Filter candidates by verified capabilities rather than hollow keywords. Post jobs with weighted requirements and minimum readiness thresholds.
                </p>
                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Weighted Requisition Definition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Candidate Talent Radar with Match Filtering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Verified Interview & Lab Evidence Access</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => onOpenAuth('company')}
                className="w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-500 hover:text-slate-950 transition-all"
              >
                Access Company Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-teal-950/80 via-slate-900 to-indigo-950/80 border border-teal-500/30 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to See Where You Stand in the Industry?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Launch your career analysis today. Discover your skill gaps against real requisitions from companies like ABC Technologies and build a verified profile.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenAuth('student')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-teal-400 text-slate-950 font-bold text-sm hover:bg-teal-300 transition-all shadow-lg shadow-teal-500/20"
              >
                <span>Launch Career Radar Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
