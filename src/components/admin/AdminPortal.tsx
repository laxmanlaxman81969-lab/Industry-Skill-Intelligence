import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IndustrySkill, TrendDirection } from '../../types';
import { SUPPORTED_ROLES, INDUSTRIES } from '../../data/seedData';
import {
  ShieldCheck,
  Database,
  Sliders,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Save,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminPortal: React.FC = () => {
  const {
    industrySkills,
    updateIndustrySkill,
    addIndustrySkill,
    isPrototypeData,
    togglePrototypeLabel,
    demandLastUpdated,
    companies,
    jobs
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demand-engine' | 'add-skill' | 'system-overview'>('demand-engine');

  // New Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<IndustrySkill['category']>('Backend');
  const [newSkillRole, setNewSkillRole] = useState(SUPPORTED_ROLES[0]);
  const [newSkillIndustry, setNewSkillIndustry] = useState(INDUSTRIES[0]);
  const [newSkillScore, setNewSkillScore] = useState(85);
  const [newSkillTrend, setNewSkillTrend] = useState<TrendDirection>('Growing');
  const [newSkillObservations, setNewSkillObservations] = useState(1500);
  const [newSkillWhy, setNewSkillWhy] = useState('');

  // Edit in-line modal / status
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editDemandScore, setEditDemandScore] = useState<number>(85);
  const [editTrend, setEditTrend] = useState<TrendDirection>('Growing');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleStartEdit = (skill: IndustrySkill) => {
    setEditingSkillId(skill.id);
    setEditDemandScore(skill.demandScore);
    setEditTrend(skill.trend);
  };

  const handleSaveEdit = (skillId: string) => {
    updateIndustrySkill(skillId, {
      demandScore: editDemandScore,
      trend: editTrend
    });
    setEditingSkillId(null);
    setSuccessToast('Industry skill demand metrics updated in real-time across all portals!');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    addIndustrySkill({
      name: newSkillName,
      category: newSkillCategory,
      role: newSkillRole,
      industry: newSkillIndustry,
      demandScore: newSkillScore,
      totalObservations: newSkillObservations,
      trend: newSkillTrend,
      source: 'Admin Verified Requisition Aggregate',
      lastUpdated: new Date().toISOString().split('T')[0],
      importance: newSkillScore > 80 ? 'Critical' : 'High',
      whyItMatters: newSkillWhy || `Critical engineering competency for ${newSkillRole} production scale.`
    });

    setNewSkillName('');
    setNewSkillWhy('');
    setActiveTab('demand-engine');
    setSuccessToast(`Created new industry skill: ${newSkillName}`);
    setTimeout(() => setSuccessToast(null), 3500);

    try {
      confetti({ particleCount: 50 });
    } catch (e) {}
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">
              Root Administration
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Platform & Data Engine Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Industry Demand Architecture Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Control aggregated hiring demand parameters, skill frequency, and data transparency disclosures.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('demand-engine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'demand-engine'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Demand Data Engine ({industrySkills.length})
          </button>
          <button
            onClick={() => setActiveTab('add-skill')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'add-skill'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            + Add Industry Skill
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* DATA TRANSPARENCY TOGGLE (PART 9 SPEC) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase font-mono">
              Part 9 Compliance: Data Transparency Disclaimer
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
              isPrototypeData ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {isPrototypeData ? 'Prototype Label Active' : 'Live Production Mode'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Per SIH Problem Statement guidelines: "Never present invented statistics as real-world statistics. Clearly label prototype data."
          </p>
        </div>

        <button
          onClick={togglePrototypeLabel}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          Toggle "{isPrototypeData ? 'Prototype Data' : 'Production Data'}" Banner
        </button>
      </div>

      {/* ========================================================================= */}
      {/* DEMAND ENGINE MANAGEMENT TABLE (PART 9 SPEC) */}
      {/* ========================================================================= */}
      {activeTab === 'demand-engine' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-rose-400" />
              <span>Configured Industry Demand Requisition Table</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Observations: {industrySkills.reduce((acc, s) => acc + s.totalObservations, 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2.5 px-3">Skill</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Demand Score</th>
                  <th className="py-2.5 px-3">Trend</th>
                  <th className="py-2.5 px-3">Observations</th>
                  <th className="py-2.5 px-3">Last Updated</th>
                  <th className="py-2.5 px-3 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {industrySkills.map((skill) => {
                  const isEditing = editingSkillId === skill.id;

                  return (
                    <tr key={skill.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{skill.name}</td>
                      <td className="py-3 px-3 text-slate-300">{skill.role}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                          {skill.category}
                        </span>
                      </td>

                      {/* Demand Score (editable) */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            min={1}
                            max={99}
                            value={editDemandScore}
                            onChange={(e) => setEditDemandScore(Number(e.target.value))}
                            className="w-16 px-2 py-1 text-xs bg-slate-950 border border-teal-500 rounded text-white"
                          />
                        ) : (
                          <span className="font-mono font-bold text-teal-300">
                            {skill.demandScore}%
                          </span>
                        )}
                      </td>

                      {/* Trend (editable) */}
                      <td className="py-3 px-3">
                        {isEditing ? (
                          <select
                            value={editTrend}
                            onChange={(e) => setEditTrend(e.target.value as TrendDirection)}
                            className="px-2 py-1 text-xs bg-slate-950 border border-teal-500 rounded text-white"
                          >
                            <option value="Growing">Growing</option>
                            <option value="Stable">Stable</option>
                            <option value="Declining">Declining</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                            skill.trend === 'Growing' ? 'text-emerald-400' : skill.trend === 'Declining' ? 'text-rose-400' : 'text-slate-300'
                          }`}>
                            {skill.trend === 'Growing' && <TrendingUp className="w-3 h-3" />}
                            {skill.trend === 'Declining' && <TrendingDown className="w-3 h-3" />}
                            {skill.trend === 'Stable' && <Minus className="w-3 h-3" />}
                            <span>{skill.trend}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {skill.totalObservations.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                        {skill.lastUpdated}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(skill.id)}
                            className="p-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(skill)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD NEW INDUSTRY SKILL FORM */}
      {/* ========================================================================= */}
      {activeTab === 'add-skill' && (
        <form onSubmit={handleCreateSkill} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 max-w-2xl mx-auto shadow-2xl animate-fade-in">
          <div className="space-y-1 border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white">Add New Industry Demand Competency</h3>
            <p className="text-xs text-slate-400">
              Integrate newly emerging technologies (e.g. LangChain, Rust, Kubernetes) into the platform taxonomy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Skill Name</label>
              <input
                type="text"
                required
                placeholder="e.g. LangChain / RAG"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="Language">Language</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Database">Database</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Cloud/DevOps">Cloud/DevOps</option>
                <option value="Security">Security</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Associated Role</label>
              <select
                value={newSkillRole}
                onChange={(e) => setNewSkillRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none"
              >
                {SUPPORTED_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Demand Percentage (%)</label>
              <input
                type="number"
                min={10}
                max={99}
                value={newSkillScore}
                onChange={(e) => setNewSkillScore(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Growth Trend</label>
              <select
                value={newSkillTrend}
                onChange={(e) => setNewSkillTrend(e.target.value as TrendDirection)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none"
              >
                <option value="Growing">Growing</option>
                <option value="Stable">Stable</option>
                <option value="Declining">Declining</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Sample Requisition Count</label>
              <input
                type="number"
                value={newSkillObservations}
                onChange={(e) => setNewSkillObservations(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-300 mb-1">
              Why It Matters in Industry (Explanation for Students):
            </label>
            <textarea
              rows={3}
              value={newSkillWhy}
              onChange={(e) => setNewSkillWhy(e.target.value)}
              placeholder="e.g. Critical for developing modern agentic retrieval pipelines over private enterprise vector stores..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-rose-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!newSkillName}
              className="w-full py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs transition-all shadow-xl shadow-rose-500/20"
            >
              Add to Industry Demand Taxonomy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
