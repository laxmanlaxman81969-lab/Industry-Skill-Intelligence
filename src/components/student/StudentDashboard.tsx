import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  ShieldCheck,
  TrendingUp,
  CheckSquare,
  Target,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Lock,
  RotateCw,
  FileCode,
  Video,
  Star,
  ChevronRight,
  Layers,
  Check,
  Flame
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

// Circular progress gauge with light track
const CircularGauge: React.FC<{ percentage: number; colorClass: string; size?: number; strokeWidth?: number }> = ({
  percentage,
  colorClass,
  size = 76,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-1000 ease-out`}
          fill="transparent"
        />
      </svg>
      <span className="absolute text-base font-extrabold text-slate-900">{percentage}%</span>
    </div>
  );
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { studentProfile } = useApp();

  const firstName = studentProfile.fullName ? studentProfile.fullName.split(' ')[0] : 'Lakshman';
  const readiness = studentProfile.overallReadiness || 72;
  const skillMatch = 68;
  const skillsIdentifiedCount = studentProfile.skills?.length || 12;
  const skillsToDevelopCount = 4;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const demandSkills = [
    { name: 'Java', level: 94, status: 'High Demand', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'SQL', level: 90, status: 'High Demand', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'Spring Boot', level: 88, status: 'High Demand', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'REST APIs', level: 85, status: 'High Demand', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { name: 'JPA / Hibernate', level: 72, status: 'Growing Demand', statusColor: 'text-blue-700 bg-blue-50 border-blue-200' },
    { name: 'Git & GitHub', level: 82, status: 'High Demand', statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  ];

  const skillGaps = [
    {
      skill: 'Spring Boot',
      current: 'Beginner',
      currentLevel: 35,
      required: 'Intermediate',
      gap: 'High',
      priority: 'High',
    },
    {
      skill: 'REST APIs',
      current: 'Beginner',
      currentLevel: 40,
      required: 'Intermediate',
      gap: 'Medium',
      priority: 'High',
    },
    {
      skill: 'JPA / Hibernate',
      current: 'Not Started',
      currentLevel: 0,
      required: 'Intermediate',
      gap: 'High',
      priority: 'Medium',
    },
  ];

  const readinessMetrics = [
    { label: 'Technical Skills', percentage: 76, color: 'bg-blue-600' },
    { label: 'Projects', percentage: 65, color: 'bg-indigo-500' },
    { label: 'Assessments', percentage: 70, color: 'bg-emerald-500' },
    { label: 'Interview Readiness', percentage: 60, color: 'bg-amber-500' },
  ];

  const roadmapNodes = [
    { title: 'Core Java', status: 'Completed', type: 'completed' },
    { title: 'JDBC', status: 'Completed', type: 'completed' },
    { title: 'JPA / Hibernate', status: 'In Progress', type: 'in-progress' },
    { title: 'Spring Boot', status: 'Next', type: 'next' },
    { title: 'REST APIs', status: 'Upcoming', type: 'upcoming' },
    { title: 'Spring Security', status: 'Upcoming', type: 'upcoming' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ─── GREETING HEADER ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's your current skill-development overview and industry alignment.
          </p>
        </div>
      </div>

      {/* ─── ROW 1: 5 SUMMARY METRICS CARDS ───────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Card 1: Target Role */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center space-x-4">
          <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Target Role</p>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 truncate mt-0.5">
              {studentProfile.targetRole || 'Java Backend Developer'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-snug">
              Your current learning path is aligned with this role.
            </p>
          </div>
        </div>

        {/* Card 2: Career Readiness */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-1.5 text-slate-600 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-bold">Career Readiness</span>
          </div>
          <CircularGauge percentage={readiness} colorClass="text-emerald-500" size={68} strokeWidth={6} />
        </div>

        {/* Card 3: Industry Skill Match */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-1.5 text-slate-600 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-bold">Industry Match</span>
          </div>
          <CircularGauge percentage={skillMatch} colorClass="text-blue-600" size={68} strokeWidth={6} />
        </div>

        {/* Card 4: Skills Identified */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-1.5 text-slate-600 mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[11px] font-bold">Skills Identified</span>
          </div>
          <div className="flex items-center space-x-2 my-auto">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-slate-900">{skillsIdentifiedCount}</span>
          </div>
        </div>

        {/* Card 5: Skills to Develop */}
        <div className="lg:col-span-2 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="flex items-center space-x-1.5 text-slate-600 mb-2">
            <Target className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] font-bold">To Develop</span>
          </div>
          <div className="flex items-center space-x-2 my-auto">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-slate-900">{skillsToDevelopCount}</span>
          </div>
        </div>
      </div>

      {/* ─── ROW 2: INDUSTRY DEMAND | SKILL GAPS | RECOMMENDED NEXT STEP ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Industry Demand */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Industry Demand</h3>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                Demonstration Data
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Skills currently relevant to your target role</p>

            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>Skill</span>
              <span>Demand Level</span>
            </div>

            <div className="space-y-3 mt-3">
              {demandSkills.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 w-28 truncate">{item.name}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.status === 'Growing Demand' ? 'bg-blue-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('skill-gap-page')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>Explore All Industry Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Skill Gaps */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Current Skill Gaps</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Immediate gaps needing progression to meet industry benchmark</p>

            <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span className="col-span-4">Skill</span>
              <span className="col-span-3">Current</span>
              <span className="col-span-3">Required</span>
              <span className="col-span-1 text-center">Gap</span>
              <span className="col-span-1 text-right">Priority</span>
            </div>

            <div className="space-y-4 mt-3">
              {skillGaps.map((item) => (
                <div key={item.skill} className="grid grid-cols-12 gap-2 items-center text-xs">
                  <div className="col-span-4 font-bold text-slate-900 truncate">{item.skill}</div>
                  <div className="col-span-3">
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${item.currentLevel}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">{item.current}</span>
                  </div>
                  <div className="col-span-3 text-[11px] text-slate-600 font-medium">{item.required}</div>
                  <div className="col-span-1 flex justify-center">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.gap === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.gap}
                    </span>
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        item.priority === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>View Personalized Skill Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recommended Next Step */}
        <div className="lg:col-span-3 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recommended Next Step</h3>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                  Complete your Spring Boot assessment
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Improve your Spring Boot proficiency and update your verified skill profile.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('practice-lab')}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── ROW 3: SKILL DEVELOPMENT ROADMAP & CAREER READINESS ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Roadmap */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Skill Development Roadmap</h3>
            </div>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1"
            >
              <span>View Full Path</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none pt-2">
            {roadmapNodes.map((node, index) => (
              <React.Fragment key={node.title}>
                <div className="flex flex-col items-center text-center shrink-0 min-w-[84px]">
                  {node.type === 'completed' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mb-2 shadow-sm">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  )}
                  {node.type === 'in-progress' && (
                    <div className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    </div>
                  )}
                  {node.type === 'next' && (
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-blue-600 flex items-center justify-center mb-2 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {node.type === 'upcoming' && (
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 text-slate-400 flex items-center justify-center mb-2">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <p className="text-xs font-bold text-slate-800 truncate max-w-[85px]">{node.title}</p>
                  <span
                    className={`text-[9px] font-semibold mt-1 px-1.5 py-0.5 rounded-full border ${
                      node.type === 'completed'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : node.type === 'in-progress'
                        ? 'text-blue-700 bg-blue-50 border-blue-200'
                        : node.type === 'next'
                        ? 'text-slate-700 bg-slate-100 border-slate-200'
                        : 'text-slate-500 bg-slate-50 border-slate-200'
                    }`}
                  >
                    {node.status}
                  </span>
                </div>

                {index < roadmapNodes.length - 1 && (
                  <div className="w-8 h-0.5 bg-slate-200 shrink-0 mx-1 flex items-center justify-center">
                    <span className="text-slate-400 text-[10px]">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Career Readiness Details */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Career Readiness</h3>
          </div>

          <div className="flex items-center space-x-4">
            <CircularGauge percentage={readiness} colorClass="text-emerald-500" size={82} strokeWidth={8} />

            <div className="flex-1 space-y-2">
              {readinessMetrics.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="text-slate-900 font-bold">{m.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${m.color} h-full rounded-full`} style={{ width: `${m.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── ROW 4: PENDING ASSIGNMENT | AI VIDEO INTERVIEW | RECENT FEEDBACK ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigate('practice-lab')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Assignment</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Spring Boot REST API Project
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Project
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Due: 3 days</span>
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Video Interview</p>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                Java Backend Developer Mock Interview
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Status: Not Started</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('mock-interview')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shrink-0 ml-2"
          >
            Start Interview →
          </button>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => onNavigate('feedback')}
          className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Feedback</p>
              <div className="flex items-center space-x-2 mt-0.5">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Spring Boot Assessment
                </h4>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Score: 74%
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[180px]">
                Good progress. Improve REST API concepts.
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
        </div>
      </div>
    </div>
  );
};
