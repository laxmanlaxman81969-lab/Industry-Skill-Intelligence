import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillAnalyzerApi } from '../../services/skillAnalyzerApi';
import { ServerResumeRecord, AnalysisRecord } from '../../../server/types';
import {
  ArrowLeft, FileText, User, GraduationCap, Briefcase, FolderGit2, Award,
  Code2, CheckCircle2, AlertTriangle, Clock, Loader2, AlertCircle, ChevronRight,
  TrendingUp, RefreshCw, X, BarChart2
} from 'lucide-react';

interface ResumeDetailPageProps {
  fileHash?: string;
  onNavigate?: (view: string) => void;
  onNavigateBack?: () => void;
}

export const ResumeDetailPage: React.FC<ResumeDetailPageProps> = ({
  fileHash, onNavigate, onNavigateBack,
}) => {
  const { resumeLibrary, studentProfile, setSelectedResumeId } = useApp();

  const [serverResume, setServerResume] = useState<ServerResumeRecord | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Also look up local library for structured extraction
  const localResume = resumeLibrary.find(r => r.fileHash === fileHash);
  const extraction = localResume?.structuredExtraction;

  const userId = studentProfile.email || 'default_user';

  useEffect(() => {
    if (!fileHash) { setErrorMessage('No resume specified.'); setIsLoading(false); return; }

    (async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await SkillAnalyzerApi.getResumeDetail(fileHash, userId);
        if (res.success) {
          setServerResume(res.resume);
          setAnalyses(res.analyses);
        } else {
          throw new Error('Resume record not found on server.');
        }
      } catch {
        // Fallback to local library data
        if (localResume) {
          setAnalyses(
            (localResume.analysesHistory || []).map(h => ({
              analysisId: h.id,
              roleName: h.opportunityTitle || '',
              opportunityTitle: h.opportunityTitle,
              opportunityCompany: h.companyName,
              atsScore: { score: h.atsScore } as any,
              skillGapScore: { score: h.skillGapScore } as any,
              createdAt: h.analyzedAt,
            } as any))
          );
        } else {
          setErrorMessage('Unable to load resume details. Please try again.');
        }
      } finally { setIsLoading(false); }
    })();
  }, [fileHash]);

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-96 gap-3">
      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      <span className="text-sm text-slate-500">Loading resume details...</span>
    </div>
  );

  if (errorMessage && !localResume) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-sm text-slate-700">{errorMessage}</p>
      <button onClick={onNavigateBack} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
    </div>
  );

  const resumeName = serverResume?.fileName || localResume?.fileName || 'Resume';
  const candidateName = serverResume?.candidateName || extraction?.candidateName || studentProfile.fullName;
  const detectedSkills = localResume?.extractedSkills || [];
  const allAnalyses = analyses.length > 0 ? analyses : [];

  const scoreColor = (score: number | null) =>
    score == null ? 'slate' : score >= 75 ? 'emerald' : score >= 55 ? 'blue' : score >= 40 ? 'amber' : 'red';

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        {onNavigateBack && (
          <button onClick={onNavigateBack} className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors mt-0.5">
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Resume Detail</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{resumeName}</h1>
          <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
            <Clock className="w-3 h-3" />
            Uploaded {serverResume ? new Date(serverResume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : localResume?.uploadDate}
            {(serverResume?.lastAnalyzedAt || localResume?.lastAnalyzed) && (
              <span className="text-emerald-600">
                · Last analyzed {new Date(serverResume?.lastAnalyzedAt || localResume?.lastAnalyzed || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => {
            if (localResume) { setSelectedResumeId(localResume.id); }
            onNavigate?.('gap-analyzer');
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
        </button>
      </div>

      {/* ── Score overview ── */}
      {serverResume && (serverResume.latestAtsScore != null || serverResume.latestSkillGapScore != null) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {serverResume.latestAtsScore != null && (
            <div className={`p-4 rounded-2xl bg-${scoreColor(serverResume.latestAtsScore)}-50 border border-${scoreColor(serverResume.latestAtsScore)}-200 text-center`}>
              <p className={`text-2xl font-black text-${scoreColor(serverResume.latestAtsScore)}-700`}>{serverResume.latestAtsScore}</p>
              <p className={`text-xs text-${scoreColor(serverResume.latestAtsScore)}-600 font-semibold`}>ATS Score</p>
            </div>
          )}
          {serverResume.latestSkillGapScore != null && (
            <div className={`p-4 rounded-2xl bg-${scoreColor(serverResume.latestSkillGapScore)}-50 border border-${scoreColor(serverResume.latestSkillGapScore)}-200 text-center`}>
              <p className={`text-2xl font-black text-${scoreColor(serverResume.latestSkillGapScore)}-700`}>{serverResume.latestSkillGapScore}</p>
              <p className={`text-xs text-${scoreColor(serverResume.latestSkillGapScore)}-600 font-semibold`}>Match Score</p>
            </div>
          )}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl font-black text-slate-700">{serverResume.detectedSkillsCount}</p>
            <p className="text-xs text-slate-500 font-semibold">Skills</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl font-black text-slate-700">{serverResume.projectCount}</p>
            <p className="text-xs text-slate-500 font-semibold">Projects</p>
          </div>
        </div>
      )}

      {/* ── Extracted Profile (from local library structuredExtraction) ── */}
      {extraction && (
        <>
          {/* Candidate Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Extracted Candidate Profile
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {candidateName && <InfoCell label="Name" value={candidateName} />}
              {extraction.contactInfo?.email && <InfoCell label="Email" value={extraction.contactInfo.email} truncate />}
              {extraction.contactInfo?.phone && <InfoCell label="Phone" value={extraction.contactInfo.phone} />}
              {extraction.contactInfo?.location && <InfoCell label="Location" value={extraction.contactInfo.location} />}
              <InfoCell label="Experience" value={extraction.totalYearsExperience > 0 ? `${extraction.totalYearsExperience} years` : 'Fresher'} />
              {extraction.currentRole && <InfoCell label="Current Role" value={extraction.currentRole} />}
            </div>
            {extraction.summary && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Summary</p>
                <p className="text-xs text-slate-700 leading-relaxed">{extraction.summary}</p>
              </div>
            )}
          </div>

          {/* Education */}
          {extraction.education?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" /> Education
              </h3>
              <div className="space-y-2">
                {extraction.education.map((e, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{e.degree}</p>
                      <p className="text-xs text-slate-500">{e.institution}{e.year ? ` · ${e.year}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work history */}
          {extraction.workHistory?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Work Experience
              </h3>
              <div className="space-y-4">
                {extraction.workHistory.map((w, i) => (
                  <div key={i} className="border-l-2 border-blue-200 pl-4">
                    <p className="text-xs font-bold text-slate-900">{w.title}</p>
                    <p className="text-xs text-slate-500">{w.company}{w.duration ? ` · ${w.duration}` : ''}</p>
                    {w.responsibilities?.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {w.responsibilities.slice(0, 3).map((r, j) => (
                          <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-blue-300 mt-0.5">·</span> {r}
                          </li>
                        ))}
                      </ul>
                    )}
                    {w.technologiesUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {w.technologiesUsed.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {extraction.projects?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-600" /> Projects
              </h3>
              <div className="space-y-3">
                {extraction.projects.map((p, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-bold text-slate-800">{p.name}</p>
                    {p.description && <p className="text-xs text-slate-600 mt-1">{p.description}</p>}
                    {p.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.techStack.map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Skills with Evidence */}
          {extraction.skillsClaimed?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" /> Detected Skills
              </h3>
              <p className="text-xs text-slate-400 mb-3">Skills extracted with evidence from your resume.</p>
              <div className="space-y-2">
                {extraction.skillsClaimed.filter(s => s.verifiedInText).map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-slate-800">{s.originalSkill || s.skill}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${s.confidence === 'explicit' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {s.confidence === 'explicit' ? 'Explicit' : 'Inferred'}
                        </span>
                        {(s as any).sourceSection && (
                          <span className="text-[10px] text-slate-400">in {(s as any).sourceSection}</span>
                        )}
                      </div>
                      {s.evidenceSnippet && (
                        <p className="text-xs text-slate-500 mt-0.5 italic">"{s.evidenceSnippet}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Analysis History ── */}
      {allAnalyses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" /> Analysis History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Every opportunity analysis run against this resume.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {allAnalyses.map(a => {
              const ats = a.atsScore?.score;
              const match = a.skillGapScore?.score ?? (a.opportunityMatchedSkills && a.opportunityRequiredSkills
                ? Math.round(((a.opportunityMatchedSkills.length) / (a.opportunityRequiredSkills.length || 1)) * 100)
                : undefined);
              return (
                <button
                  key={a.analysisId}
                  onClick={() => onNavigate?.(`resume-analysis:${a.analysisId}`)}
                  className="w-full flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                >
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">
                      {a.opportunityTitle || a.roleName}
                      {a.opportunityCompany && <span className="text-slate-400 font-normal"> · {a.opportunityCompany}</span>}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {ats != null && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">ATS {ats}</span>
                    )}
                    {match != null && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Match {match}</span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty extraction state */}
      {!extraction && !isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center bg-white rounded-2xl border border-slate-200">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          <p className="text-sm font-semibold text-slate-700">Resume not yet analyzed</p>
          <p className="text-xs text-slate-500">Analyze this resume to extract profile information, skills, and scores.</p>
          <button
            onClick={() => { if (localResume) setSelectedResumeId(localResume.id); onNavigate?.('gap-analyzer'); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors mt-1"
          >
            Analyze Now <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

// Small helper component
const InfoCell: React.FC<{ label: string; value: string; truncate?: boolean }> = ({ label, value, truncate }) => (
  <div>
    <p className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={`text-xs font-semibold text-slate-800 mt-0.5 ${truncate ? 'truncate' : ''}`}>{value}</p>
  </div>
);
