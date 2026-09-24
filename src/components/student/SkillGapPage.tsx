import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustryDemandIntelligence } from '../demand/IndustryDemandIntelligence';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Layers,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';

interface SkillGapPageProps {
  onNavigateToRoadmap: () => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ onNavigateToRoadmap }) => {
  const { studentProfile, industrySkills, addSkillToRoadmap } = useApp();
  const [activeTab, setActiveTab] = useState<'intelligence' | 'diagnostic'>('intelligence');

  // Role-specific required skills
  const roleRequiredSkills = industrySkills.filter(
    (s) => s.role.toLowerCase() === studentProfile.targetRole.toLowerCase() || s.role === 'Java Backend Developer'
  );

  const studentSkills = studentProfile.skills;
  const studentSkillNames = studentSkills.map((s) => s.name.toLowerCase());

  // 1. STRONG SKILLS: Demonstrated & Intermediate/Advanced
  const strongSkills = roleRequiredSkills
    .filter((req) => {
      const studentSkill = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
      return studentSkill && (studentSkill.level === 'Advanced' || (studentSkill.level === 'Intermediate' && studentSkill.verified));
    })
    .map((req) => {
      const studentSkill = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase())!;
      return {
        ...req,
        currentLevel: studentSkill.level,
        requiredLevel: 'Intermediate / Advanced',
        isVerified: studentSkill.verified
      };
    });

  // 2. NEEDS IMPROVEMENT: Student has it but level is Beginner or unverified
  const needsImprovementSkills = roleRequiredSkills
    .filter((req) => {
      const studentSkill = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase());
      return studentSkill && (studentSkill.level === 'Beginner' || !studentSkill.verified);
    })
    .map((req) => {
      const studentSkill = studentSkills.find((s) => s.name.toLowerCase() === req.name.toLowerCase())!;
      return {
        ...req,
        currentLevel: studentSkill.level,
        requiredLevel: 'Intermediate',
        isVerified: studentSkill.verified
      };
    });

  // 3. MISSING SKILLS: Required by role but not in student profile
  const missingSkills = roleRequiredSkills
    .filter((req) => !studentSkillNames.includes(req.name.toLowerCase()))
    .map((req) => ({
      ...req,
      currentLevel: 'None',
      requiredLevel: req.importance === 'Critical' ? 'Intermediate' : 'Beginner / Intermediate',
      isVerified: false
    }));

  return (
    <div className="space-y-6 pb-12 max-w-6xl animate-fade-in">
      {/* View Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveTab('intelligence')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'intelligence'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Industry Market Intelligence</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostic')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
            activeTab === 'diagnostic'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>My Diagnostic Skill Gap ({missingSkills.length} Gaps)</span>
        </button>
      </div>

      {/* View 1: Real-World Industry Market Intelligence */}
      {activeTab === 'intelligence' && (
        <IndustryDemandIntelligence onNavigateToRoadmap={onNavigateToRoadmap} />
      )}

      {/* View 2: Diagnostic Skill Gap Breakdown */}
      {activeTab === 'diagnostic' && (
        <div className="space-y-6">
          {/* HEADER BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  Diagnostic Analysis
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">
                  Target Role: <strong className="text-slate-800">{studentProfile.targetRole}</strong>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Your Diagnostic Skill Gap
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Categorized breakdown of Strong Skills, Needs Improvement, and Missing Skills against industry demand.
              </p>
            </div>

            <button
              onClick={onNavigateToRoadmap}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs self-start md:self-auto"
            >
              <span>Open Career Growth Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3 CATEGORIES */}
          <div className="space-y-8">
            {/* CATEGORY 1: STRONG SKILLS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>STRONG SKILLS ({strongSkills.length})</span>
                </div>
                <span className="text-xs text-slate-500">
                  Skills you already demonstrate with high confidence and verified evidence.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strongSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {s.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">{s.name}</h4>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {s.demandScore}% Demand
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs my-3">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">Your Level</span>
                          <span className="font-bold text-slate-900">{s.currentLevel}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">Benchmark</span>
                          <span className="font-bold text-slate-900">{s.requiredLevel}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{s.whyItMatters}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                      <span>✓ Role Requirement Fulfilled</span>
                      <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORY 2: NEEDS IMPROVEMENT */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-base">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>NEEDS IMPROVEMENT ({needsImprovementSkills.length})</span>
                </div>
                <span className="text-xs text-slate-500">
                  Skills you possess at beginner level or without hands-on verification.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {needsImprovementSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl bg-white border border-amber-200 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                            {s.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">{s.name}</h4>
                        </div>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {s.demandScore}% Demand
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs my-3">
                        <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200">
                          <span className="text-[10px] text-amber-700 block font-medium">Your Level</span>
                          <span className="font-bold text-amber-900">{s.currentLevel}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] text-slate-500 block font-medium">Target Level</span>
                          <span className="font-bold text-slate-900">{s.requiredLevel}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{s.whyItMatters}</p>
                    </div>

                    <button
                      onClick={onNavigateToRoadmap}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center justify-center space-x-1 transition-colors border border-amber-200"
                    >
                      <span>Advance to Intermediate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORY 3: MISSING SKILLS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center space-x-2 text-rose-700 font-bold text-base">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>MISSING CRITICAL SKILLS ({missingSkills.length})</span>
                </div>
                <span className="text-xs text-slate-500">
                  High-priority requirements demanded by recruiters where no candidate evidence exists.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missingSkills.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-2xl bg-white border border-rose-200 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            {s.importance}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1.5">{s.name}</h4>
                        </div>
                        <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                          {s.demandScore}% Demand
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-200/80 my-3 text-xs">
                        <span className="text-[10px] font-bold uppercase text-rose-800 block">
                          Current Deficit
                        </span>
                        <p className="text-rose-900 font-medium mt-0.5">
                          Not found in your verified skills profile or analyzed resume.
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{s.whyItMatters}</p>
                    </div>

                    <button
                      onClick={onNavigateToRoadmap}
                      className="w-full mt-2 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Learning Roadmap</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
