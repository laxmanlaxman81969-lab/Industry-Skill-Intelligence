import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookMarked,
  CheckCircle2,
  AlertCircle,
  User,
  FileText,
  Star,
  Plus,
  Edit3,
  X,
  BarChart3,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SkillLevel, StudentSkill } from '../../types';

interface StudentMySkillsProps {
  onNavigate: (view: string) => void;
}

const LEVEL_COLOR: Record<SkillLevel, string> = {
  Beginner: 'text-amber-700 bg-amber-50 border-amber-200',
  Intermediate: 'text-blue-700 bg-blue-50 border-blue-200',
  Advanced: 'text-indigo-700 bg-indigo-50 border-indigo-200',
};

const SOURCE_ICON: Record<string, React.ReactNode> = {
  resume: <FileText className="w-3 h-3" />,
  assignment: <Award className="w-3 h-3" />,
  interview: <Star className="w-3 h-3" />,
  self: <User className="w-3 h-3" />,
};

const SOURCE_LABEL: Record<string, string> = {
  resume: 'Resume',
  assignment: 'Assignment',
  interview: 'Interview',
  self: 'Self-declared',
};

export const StudentMySkills: React.FC<StudentMySkillsProps> = ({ onNavigate }) => {
  const { studentProfile, setStudentProfile } = useApp();
  const { skills } = studentProfile;

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSkill, setNewSkill] = useState<{ name: string; category: string; level: SkillLevel }>({
    name: '',
    category: 'Backend',
    level: 'Beginner',
  });

  const verified = skills.filter((s) => s.verified);
  const selfDeclared = skills.filter((s) => !s.verified);

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    const skill: StudentSkill = {
      name: newSkill.name.trim(),
      category: newSkill.category,
      level: newSkill.level,
      verified: false,
      verifiedSource: 'self',
    };
    setStudentProfile((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    setNewSkill({ name: '', category: 'Backend', level: 'Beginner' });
    setShowAddForm(false);
  };

  const handleRemoveSkill = (skillName: string) => {
    setStudentProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  const SkillCard: React.FC<{ skill: StudentSkill; canRemove?: boolean }> = ({ skill, canRemove }) => (
    <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm relative group hover:border-slate-300 transition-all">
      {canRemove && (
        <button
          onClick={() => handleRemoveSkill(skill.name)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-600 p-0.5"
          title="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
            {skill.category}
          </span>
          <p className="text-sm font-bold text-slate-900 mt-1.5">{skill.name}</p>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${LEVEL_COLOR[skill.level]}`}>
          {skill.level}
        </span>
      </div>
      <div className="flex items-center space-x-1.5 mt-2">
        {skill.verified ? (
          <span className="flex items-center space-x-1 text-[10px] text-emerald-700 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
            {skill.verifiedSource && (
              <span className="flex items-center space-x-0.5 text-emerald-600/80 ml-1">
                {SOURCE_ICON[skill.verifiedSource]}
                <span>via {SOURCE_LABEL[skill.verifiedSource]}</span>
              </span>
            )}
          </span>
        ) : (
          <span className="flex items-center space-x-1 text-[10px] text-slate-500">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            <span>Self-declared · not yet verified</span>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <BookMarked className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Skills</h1>
          </div>
          <p className="text-xs text-slate-500">
            {verified.length} verified · {selfDeclared.length} self-declared · {skills.length} total tracked skills
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('skill-gap-page')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Industry Demand</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Add Skill Form Modal */}
      {showAddForm && (
        <div className="p-5 rounded-2xl bg-white border border-blue-200 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-slate-900">Add a new self-declared skill</p>
            <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Skill name (e.g., Redis, Kafka)"
              value={newSkill.name}
              onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
            />
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value }))}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              {['Language', 'Frontend', 'Backend', 'Database', 'Cloud/DevOps', 'Core CS', 'AI/ML', 'Tools', 'Security'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={newSkill.level}
              onChange={(e) => setNewSkill((p) => ({ ...p, level: e.target.value as SkillLevel }))}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSkill}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Save Skill
            </button>
          </div>
        </div>
      )}

      {/* Verified Skills Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900">
              Verified Skills ({verified.length})
            </h2>
            <span className="text-[10px] text-slate-500">
              Validated by AI resume analysis, assignments, or mock interviews
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {verified.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* Self-Declared Skills Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">
              Self-Declared Skills ({selfDeclared.length})
            </h2>
            <span className="text-[10px] text-slate-500">
              Complete practice lab challenges or mock interviews to verify these skills
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {selfDeclared.map((skill) => (
            <SkillCard key={skill.name} skill={skill} canRemove />
          ))}
        </div>
      </div>

      {/* Verification CTA Banner */}
      <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-900">Verify your self-declared skills</h3>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Verified skills carry 2x weight in employer candidate matching.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('practice-lab')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1"
          >
            <span>Assignments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('mock-interview')}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold transition-all"
          >
            AI Mock Interview
          </button>
        </div>
      </div>
    </div>
  );
};
