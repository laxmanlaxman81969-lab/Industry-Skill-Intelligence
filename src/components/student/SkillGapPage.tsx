import React from 'react';
import { useApp } from '../../context/AppContext';
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
  TrendingUp
} from 'lucide-react';

interface SkillGapPageProps {
  onNavigateToRoadmap: () => void;
}

export const SkillGapPage: React.FC<SkillGapPageProps> = ({ onNavigateToRoadmap }) => {
  const { studentProfile, industrySkills, addSkillToRoadmap } = useApp();

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
    <div className="space-y-8 pb-12">
      {/* HEADER BAR (PART 14 SPEC) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Part 14 Dedicated Diagnostic
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Target Role: {studentProfile.targetRole}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Skill Gap
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Categorized breakdown of Strong Skills, Needs Improvement, and Missing Skills against industry demand.
          </p>
        </div>

        <button
          onClick={onNavigateToRoadmap}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 transition-all shadow-md self-start md:self-auto"
        >
          <span>Open Career Growth Roadmap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 CATEGORIES (PART 14 SPEC) */}
      <div className="space-y-8">
        {/* CATEGORY 1: STRONG SKILLS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>STRONG SKILLS ({strongSkills.length})</span>
            </div>
            <span className="text-xs text-slate-400">
              Skills you already demonstrate with high confidence and verified evidence.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strongSkills.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/30 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-emerald-300 border border-emerald-500/20">
                        {s.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{s.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {s.demandScore}% Demand
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs my-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Your Level</span>
                      <span className="font-bold text-white">{s.currentLevel}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Required</span>
                      <span className="font-bold text-emerald-300">{s.requiredLevel}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.whyItMatters}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium">✓ Verified Strong</span>
                  <span className="text-slate-500 font-mono text-[10px]">{s.importance} Priority</span>
                </div>
              </div>
            ))}
            {strongSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic p-4">No strong skills verified yet.</p>
            )}
          </div>
        </div>

        {/* CATEGORY 2: NEEDS IMPROVEMENT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5" />
              <span>NEEDS IMPROVEMENT ({needsImprovementSkills.length})</span>
            </div>
            <span className="text-xs text-slate-400">
              Skills you possess, but depth, confidence, or project evidence is low.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {needsImprovementSkills.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-amber-950/15 border border-amber-500/30 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/20">
                        {s.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{s.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {s.demandScore}% Demand
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs my-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Your Level</span>
                      <span className="font-bold text-amber-300">{s.currentLevel}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Required</span>
                      <span className="font-bold text-white">{s.requiredLevel}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.whyItMatters}
                  </p>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-medium">Practice Recommended</span>
                  <button
                    onClick={() => addSkillToRoadmap(s.name)}
                    className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
                  >
                    Add to Roadmap
                  </button>
                </div>
              </div>
            ))}
            {needsImprovementSkills.length === 0 && (
              <p className="text-xs text-slate-500 italic p-4">No partial skills in this category.</p>
            )}
          </div>
        </div>

        {/* CATEGORY 3: MISSING SKILLS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
              <XCircle className="w-5 h-5" />
              <span>MISSING SKILLS ({missingSkills.length})</span>
            </div>
            <span className="text-xs text-slate-400">
              Required for {studentProfile.targetRole} but currently not demonstrated.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missingSkills.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/30 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-rose-500/20">
                        {s.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5">{s.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold">
                      {s.demandScore}% Demand
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs my-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Your Level</span>
                      <span className="font-bold text-rose-400">{s.currentLevel}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Required</span>
                      <span className="font-bold text-white">{s.requiredLevel}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {s.whyItMatters}
                  </p>
                </div>

                <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between text-xs">
                  <span className="text-rose-400 font-mono font-bold text-[10px] uppercase">
                    Priority: {s.importance}
                  </span>
                  <button
                    onClick={() => addSkillToRoadmap(s.name)}
                    className="px-3 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold transition-colors"
                  >
                    Add to Roadmap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
