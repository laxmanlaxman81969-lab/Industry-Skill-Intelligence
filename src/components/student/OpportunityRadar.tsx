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
  Filter,
  TrendingUp,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OpportunityRadarProps {
  onNavigate?: (view: string) => void;
}

export const OpportunityRadar: React.FC<OpportunityRadarProps> = ({ onNavigate }) => {
  const { jobs, studentProfile, setSelectedOpportunityContext, resumeLibrary, latestAnalysis } = useApp();
  const [filterType, setFilterType] = useState<string>('All');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [openingOppId, setOpeningOppId] = useState<string | null>(null);

  const studentSkillNames = studentProfile?.skills?.map((s) => s.name.toLowerCase()) || [];

  const getExistingAnalysisId = (jobId: string, jobTitle: string) => {
    for (const r of (resumeLibrary || [])) {
      const found = r.analysesHistory?.find(
        (h) => h.opportunityId === jobId || h.opportunityTitle?.toLowerCase() === jobTitle.toLowerCase()
      );
      if (found) return found.id;
    }
    if (
      latestAnalysis &&
      (latestAnalysis.opportunityId === jobId ||
        latestAnalysis.opportunityTitle?.toLowerCase() === jobTitle.toLowerCase() ||
        latestAnalysis.roleName?.toLowerCase() === jobTitle.toLowerCase())
    ) {
      return latestAnalysis.analysisId;
    }
    return null;
  };

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

  const handleAnalyzeOpportunity = (job: JobRequirement) => {
    if (!job || !job.id) return;
    setOpeningOppId(job.id);
    setSelectedOpportunityContext(job);

    const targetUrl = `/ai-skill-analyzer?opportunityId=${encodeURIComponent(job.id)}`;
    try {
      window.history.pushState({ view: 'gap-analyzer', opportunityId: job.id }, '', targetUrl);
    } catch {}

    setTimeout(() => {
      if (onNavigate) {
        onNavigate('gap-analyzer');
      } else {
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      setOpeningOppId(null);
    }, 260);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              Career Readiness Matching
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Opportunity Recommendations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Industry Opportunity Matches
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Hiring opportunities matched to your verified skills and measured career readiness score ({studentProfile.overallReadiness}%).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 self-start md:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          {['All', 'Qualified Only', 'Full-time', 'Internship to Full-time'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Opportunity Cards List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const isQualified = studentProfile.overallReadiness >= job.minReadinessScore;
          const isApplied = appliedJobs.includes(job.id);

          return (
            <div
              key={job.id}
              className={`p-6 rounded-2xl border transition-all ${
                isQualified
                  ? 'bg-white border-slate-200/90 shadow-sm hover:border-blue-300'
                  : 'bg-slate-50/80 border-slate-200/80 opacity-90'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>{job.companyName}</span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {job.type}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {job.package}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{job.title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.experience}</span>
                    </span>
                  </div>
                </div>

                {/* Readiness Benchmark Gauge */}
                <div className="flex flex-col items-start md:items-end space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Min Readiness:</span>
                    <span className="text-sm font-bold text-slate-900">{job.minReadinessScore}%</span>
                  </div>
                  <div>
                    {isQualified ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready & Qualified ({studentProfile.overallReadiness}%)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Readiness Gap (Need {job.minReadinessScore - studentProfile.overallReadiness}% more)</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {job.description}
              </p>

              {/* Required Skills breakdown */}
              <div className="space-y-2 mb-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
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
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        <span>{req.skill}</span>
                        <span className="text-[10px] text-slate-400">({req.level})</span>
                        {hasSkill ? <span className="text-emerald-600 font-bold">✓</span> : <span className="text-rose-500 font-bold">✕</span>}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  Posted {job.postedDate} • {job.applicantsCount} verified applicants
                </span>

                <div className="flex items-center space-x-2">
                  {(() => {
                    const existingAnalysisId = getExistingAnalysisId(job.id, job.title);
                    return (
                      <>
                        {existingAnalysisId && (
                          <button
                            onClick={() => onNavigate?.(`resume-analysis:${existingAnalysisId}`)}
                            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition-all border border-blue-200 cursor-pointer"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Analysis</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleAnalyzeOpportunity(job)}
                          disabled={openingOppId === job.id}
                          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-75 transition-all shadow-xs cursor-pointer"
                        >
                          {openingOppId === job.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Opening AI Analyzer...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-blue-100" />
                              <span>{existingAnalysisId ? 'Re-analyze with AI' : 'Analyze with AI'}</span>
                            </>
                          )}
                        </button>
                      </>
                    );
                  })()}

                  {isApplied ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Application Submitted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(job)}
                      disabled={!isQualified}
                      className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
                    >
                      <span>{isQualified ? 'Apply with Verified Profile' : 'Readiness Threshold Not Met'}</span>
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
