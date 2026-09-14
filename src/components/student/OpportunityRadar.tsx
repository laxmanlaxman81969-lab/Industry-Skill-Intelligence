import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobRequirement } from '../../types';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight,
  Send,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OpportunityRadar: React.FC = () => {
  const { jobs, studentProfile } = useApp();
  const [filterType, setFilterType] = useState<string>('All');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const studentSkillNames = studentProfile.skills.map((s) => s.name.toLowerCase());

  const filteredJobs = jobs.filter((job) => {
    if (filterType === 'All') return true;
    if (filterType === 'Qualified Only') return studentProfile.overallReadiness >= job.minReadinessScore;
    return job.type === filterType;
  });

  const handleApply = (job: JobRequirement) => {
    setAppliedJobs((prev) => [...prev, job.id]);
    setSuccessToast(`Application & Verified Skill Profile sent to ${job.companyName}!`);
    setTimeout(() => setSuccessToast(null), 4000);

    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch (e) {}
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Career Readiness Matching
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Opportunity Recommendations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Opportunity Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Hiring opportunities matched to your verified skills and measured career readiness score ({studentProfile.overallReadiness}%).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 self-start md:self-auto">
          {['All', 'Qualified Only', 'Full-time', 'Internship to Full-time'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 animate-fade-in shadow-xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isQualified = studentProfile.overallReadiness >= job.minReadinessScore;
          const isApplied = appliedJobs.includes(job.id);

          // Calculate how many required skills the student possesses
          const matchedSkills = job.requiredSkills.filter((rs) =>
            studentSkillNames.includes(rs.skill.toLowerCase())
          );
          const missingSkills = job.requiredSkills.filter(
            (rs) => !studentSkillNames.includes(rs.skill.toLowerCase())
          );

          return (
            <div
              key={job.id}
              className={`p-6 rounded-3xl border transition-all ${
                isQualified
                  ? 'bg-slate-900/80 border-slate-800 hover:border-teal-500/50'
                  : 'bg-slate-950/60 border-slate-900 opacity-90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span>{job.companyName}</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {job.type}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-bold">
                      {job.package}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-100">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{job.experience}</span>
                    </span>
                  </div>
                </div>

                {/* Readiness Benchmark Gauge */}
                <div className="flex flex-col items-start md:items-end space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-mono">Min Readiness:</span>
                    <span className="text-sm font-bold text-white">{job.minReadinessScore}%</span>
                  </div>
                  <div>
                    {isQualified ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready & Qualified ({studentProfile.overallReadiness}%)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Readiness Gap (Need {job.minReadinessScore - studentProfile.overallReadiness}% more)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {job.description}
              </p>

              {/* Required Skills breakdown */}
              <div className="space-y-2 mb-4 pt-3 border-t border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
                  Required Skill Stack vs Your Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.map((req) => {
                    const hasSkill = studentSkillNames.includes(req.skill.toLowerCase());
                    return (
                      <span
                        key={req.skill}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                          hasSkill
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span>{req.skill}</span>
                        <span className="text-[10px] font-mono">({req.level})</span>
                        {hasSkill ? <span>✓</span> : <span className="text-rose-400">✕</span>}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  Posted {job.postedDate} • {job.applicantsCount} verified applicants
                </span>

                <div className="flex items-center space-x-2">
                  {isApplied ? (
                    <span className="px-4 py-2 rounded-xl bg-slate-800 text-teal-400 text-xs font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Application Submitted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={!isQualified}
                      className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-500/10"
                    >
                      <span>{isQualified ? 'Apply with Verified Radar Profile' : 'Readiness Threshold Not Met'}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
