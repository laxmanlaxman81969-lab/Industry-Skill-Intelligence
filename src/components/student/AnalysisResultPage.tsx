import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillAnalyzerApi } from '../../services/skillAnalyzerApi';
import { AnalysisRecord } from '../../../server/types';
import { SkillLevel } from '../../types';
import {
  ArrowLeft, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  Target, Zap, Download, AlertCircle, Check, Briefcase, GraduationCap,
  FolderGit2, Loader2, ShieldCheck, User, Building2, Calendar, Award,
  BookOpen, TrendingUp, X, ChevronDown, ChevronUp, ExternalLink, RefreshCw,
  Info, Badge, Star, Clock, Code2
} from 'lucide-react';

interface AnalysisResultPageProps {
  analysisId?: string;
  onNavigate?: (view: string) => void;
  onNavigateToRoadmap?: () => void;
  onNavigateBack?: () => void;
}

type TabId = 'overview' | 'skills' | 'resume' | 'gaps' | 'recommendations';

export const AnalysisResultPage: React.FC<AnalysisResultPageProps> = ({
  analysisId, onNavigate, onNavigateToRoadmap, onNavigateBack
}) => {
  const { studentProfile, setStudentProfile, addSkillToRoadmap, latestAnalysis, setLatestAnalysis } = useApp();

  const [analysis, setAnalysis] = useState<AnalysisRecord | null>(() => {
    if (latestAnalysis && (!analysisId || latestAnalysis.analysisId === analysisId)) return latestAnalysis;
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(!analysis && Boolean(analysisId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [skillSyncChoices, setSkillSyncChoices] = useState<Record<string, { level: SkillLevel; selected: boolean }>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Load analysis from backend
  useEffect(() => {
    let mounted = true;
    const targetId = analysisId || latestAnalysis?.analysisId;
    if (!targetId) {
      if (!latestAnalysis) setErrorMessage('No analysis found. Please run an analysis first.');
      return;
    }
    if (analysis && analysis.analysisId === targetId) return;

    (async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await SkillAnalyzerApi.getAnalysis(targetId);
        if (mounted && res.success && res.analysis) {
          setAnalysis(res.analysis);
          setLatestAnalysis(res.analysis);
        } else if (mounted) throw new Error('Analysis not found.');
      } catch (err: any) {
        if (!mounted) return;
        if (latestAnalysis && (!analysisId || latestAnalysis.analysisId === analysisId)) {
          setAnalysis(latestAnalysis);
        } else {
          setErrorMessage(err.message || 'Unable to retrieve this analysis.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [analysisId]);

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };

  // ── Score helpers ─────────────────────────────────────────

  // ATS / Resume score — from backend breakdown or computed fallback
  const getAtsScore = (a: AnalysisRecord) => {
    if (a.atsScore?.score != null) return a.atsScore.score;
    const total = a.matchedSkills.length + a.missingSkills.length;
    const kwPct = total > 0 ? (a.matchedSkills.length / total) * 100 : 0;
    const sections = [
      !!(a.candidateName && a.candidateName !== 'Candidate'),
      a.matchedSkills.length >= 2,
      a.extractionSummary.projectCount > 0 || a.matchedSkills.some(s => s.practicalEvidence),
      !!a.extractionSummary.educationSummary,
    ].filter(Boolean).length;
    const depth = Math.min(1, a.scoreBreakdown.depthOfExperience / 25) * 25;
    const conf = a.confidenceRating === 'High' ? 15 : a.confidenceRating === 'Medium' ? 10 : 5;
    return Math.min(100, Math.max(12, Math.round(kwPct * 0.35 + sections * 6.25 + depth + conf)));
  };

  // Opportunity match score
  const getMatchScore = (a: AnalysisRecord): number => {
    if (a.skillGapScore?.score != null) return a.skillGapScore.score;
    // If opportunity-specific overlap is available
    if (a.opportunityMatchedSkills && a.opportunityRequiredSkills) {
      const total = a.opportunityRequiredSkills.length;
      if (total === 0) return 0;
      const matched = a.opportunityMatchedSkills.length;
      const partial = (a.opportunityPartialSkills?.length || 0) * 0.5;
      return Math.round(((matched + partial) / total) * 100);
    }
    return a.scoreBreakdown?.overallScore || 0;
  };

  const scoreColor = (score: number) =>
    score >= 75 ? 'emerald' : score >= 55 ? 'blue' : score >= 40 ? 'amber' : 'red';

  const scoreLabel = (score: number) =>
    score >= 75 ? 'Strong' : score >= 55 ? 'Good' : score >= 40 ? 'Moderate' : 'Needs Work';

  // ── Skill sync handler ─────────────────────────────────────
  const handleOpenSyncModal = () => {
    if (!analysis) return;
    const choices: Record<string, { level: SkillLevel; selected: boolean }> = {};
    analysis.matchedSkills.forEach(s => {
      choices[s.skill] = {
        level: s.confidence === 'explicit' && s.practicalEvidence ? 'Advanced' : 'Intermediate',
        selected: true,
      };
    });
    setSkillSyncChoices(choices);
    setIsSyncModalOpen(true);
  };

  const handleConfirmSkillSync = () => {
    if (!analysis) return;
    const map = new Map(studentProfile.skills.map(s => [s.name.toLowerCase(), s]));
    Object.entries(skillSyncChoices).forEach(([name, choice]) => {
      if (!choice.selected) return;
      const lower = name.toLowerCase();
      const ex = map.get(lower);
      map.set(lower, ex
        ? { ...ex, level: choice.level, verifiedSource: 'resume' }
        : { name, level: choice.level, category: 'Technical', verified: false, verifiedSource: 'resume' }
      );
    });
    setStudentProfile(p => ({ ...p, skills: Array.from(map.values()) }));
    setIsSyncModalOpen(false);
    showToast('Skills synced to your profile!');
  };

  const handleDownloadPdf = async () => {
    if (!analysis) return;
    setIsDownloadingPdf(true);
    try {
      await SkillAnalyzerApi.downloadPdfReport(
        analysis.analysisId,
        `Skill_Report_${analysis.roleId}_${analysis.candidateName.replace(/\s+/g, '_')}.pdf`
      );
      showToast('PDF report downloaded!');
    } catch (err: any) { setErrorMessage('PDF failed: ' + err.message); }
    finally { setIsDownloadingPdf(false); }
  };

  // Check if a skill exists in the student's verified or claimed profile skills
  const isKnownInProfile = (skillName: string): boolean => {
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = normalize(skillName);
    return (studentProfile?.skills || []).some((ps) => {
      const psNorm = normalize(ps.name);
      return psNorm === target || psNorm.includes(target) || target.includes(psNorm);
    });
  };

  // ── Loading / Error states ────────────────────────────────
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <p className="text-sm text-slate-500">Loading analysis...</p>
    </div>
  );

  if (errorMessage && !analysis) return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-4">
      <AlertCircle className="w-10 h-10 text-red-400" />
      <p className="text-sm text-slate-700 font-medium">{errorMessage}</p>
      <button
        onClick={() => onNavigateBack?.()}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Analyzer
      </button>
    </div>
  );

  if (!analysis) return null;

  const atsScore = getAtsScore(analysis);
  const matchScore = getMatchScore(analysis);
  const atsColor = scoreColor(atsScore);
  const matchColor = scoreColor(matchScore);
  const extraction = analysis.structuredExtraction;

  const hasOpportunityContext = !!(analysis.opportunityTitle || analysis.opportunityId);

  // Required skills table — use opportunity skills if available, else taxonomy matched/missing
  const requiredSkills: { skill: string; requirement: 'Required' | 'Preferred'; status: 'matched' | 'partial' | 'missing'; evidence: string | null }[] = [];

  if (analysis.opportunityRequiredSkills?.length) {
    for (const skill of analysis.opportunityRequiredSkills) {
      const matched = analysis.opportunityMatchedSkills?.includes(skill);
      const partial = analysis.opportunityPartialSkills?.includes(skill);
      const matchRec = analysis.matchedSkills.find(s => s.skill.toLowerCase() === skill.toLowerCase() || s.normalizedSkill.toLowerCase() === skill.toLowerCase());
      requiredSkills.push({
        skill,
        requirement: 'Required',
        status: matched ? 'matched' : partial ? 'partial' : 'missing',
        evidence: matchRec?.evidenceQuote || null,
      });
    }
    for (const skill of analysis.opportunityPreferredSkills || []) {
      const matchRec = analysis.matchedSkills.find(s => s.skill.toLowerCase() === skill.toLowerCase());
      requiredSkills.push({
        skill,
        requirement: 'Preferred',
        status: matchRec ? 'matched' : 'missing',
        evidence: matchRec?.evidenceQuote || null,
      });
    }
  } else {
    for (const s of analysis.matchedSkills) {
      requiredSkills.push({ skill: s.skill, requirement: 'Required', status: 'matched', evidence: s.evidenceQuote });
    }
    for (const s of analysis.partialSkills) {
      requiredSkills.push({ skill: s.skill, requirement: 'Required', status: 'partial', evidence: s.evidenceQuote });
    }
    for (const s of analysis.missingSkills) {
      requiredSkills.push({ skill: s.skill, requirement: 'Required', status: 'missing', evidence: null });
    }
  }

  const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'skills', label: 'Skill Match', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'resume', label: 'Resume Profile', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'gaps', label: 'Skill Gaps', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: 'recommendations', label: 'Recommendations', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6 pb-12 max-w-5xl">
      {/* ── Toast ── */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-lg">
          <CheckCircle2 className="w-4 h-4" /> {toastMessage}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {onNavigateBack && (
              <button onClick={onNavigateBack} className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors mt-0.5">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Analysis Result</span>
                {analysis.isDemoMode && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full">Demo Mode</span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900">{analysis.candidateName}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5" /> {analysis.fileName}
                </span>
                {hasOpportunityContext ? (
                  <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                    <Briefcase className="w-3 h-3" />
                    {analysis.opportunityTitle} · {analysis.opportunityCompany}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Target className="w-3.5 h-3.5" /> {analysis.roleName}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3 h-3" /> {new Date(analysis.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenSyncModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <User className="w-3.5 h-3.5" /> Sync Skills
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              {isDownloadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              PDF
            </button>
            <button
              onClick={() => onNavigate?.('gap-analyzer')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-analyze
            </button>
          </div>
        </div>

        {/* ── SCORE SUMMARY — two large separate cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ATS / Resume Score */}
          <div className={`p-6 rounded-2xl border-2 bg-${atsColor}-50 border-${atsColor}-200 flex items-center gap-5`}>
            <div className={`relative w-20 h-20 shrink-0`}>
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke={atsColor === 'emerald' ? '#10b981' : atsColor === 'blue' ? '#3b82f6' : atsColor === 'amber' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="8"
                  strokeDasharray={`${(atsScore / 100) * 201} 201`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-lg font-bold text-${atsColor}-700`}>{atsScore}</span>
              </div>
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wider text-${atsColor}-600 mb-1`}>ATS / Resume Score</p>
              <p className={`text-2xl font-black text-${atsColor}-800`}>{atsScore}<span className="text-sm font-normal text-${atsColor}-600">/100</span></p>
              <p className={`text-xs font-semibold text-${atsColor}-700 mt-0.5`}>{scoreLabel(atsScore)}</p>
              <p className="text-[10px] text-slate-500 mt-1">Estimated ATS / Resume Compatibility</p>
            </div>
          </div>

          {/* Opportunity Match Score */}
          {hasOpportunityContext ? (
            <div className={`p-6 rounded-2xl border-2 bg-${matchColor}-50 border-${matchColor}-200 flex items-center gap-5`}>
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke={matchColor === 'emerald' ? '#10b981' : matchColor === 'blue' ? '#3b82f6' : matchColor === 'amber' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${(matchScore / 100) * 201} 201`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold text-${matchColor}-700`}>{matchScore}</span>
                </div>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider text-${matchColor}-600 mb-1`}>Opportunity Match</p>
                <p className={`text-2xl font-black text-${matchColor}-800`}>{matchScore}<span className={`text-sm font-normal text-${matchColor}-600`}>/100</span></p>
                <p className={`text-xs font-semibold text-${matchColor}-700 mt-0.5`}>{scoreLabel(matchScore)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{analysis.opportunityTitle} · {analysis.opportunityCompany}</p>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-2xl border-2 bg-${matchColor}-50 border-${matchColor}-200 flex items-center gap-5`}>
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke={matchColor === 'emerald' ? '#10b981' : matchColor === 'blue' ? '#3b82f6' : matchColor === 'amber' ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${(matchScore / 100) * 201} 201`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-lg font-bold text-${matchColor}-700`}>{matchScore}</span>
                </div>
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-wider text-${matchColor}-600 mb-1`}>Role Match Score</p>
                <p className={`text-2xl font-black text-${matchColor}-800`}>{matchScore}<span className={`text-sm font-normal text-${matchColor}-600`}>/100</span></p>
                <p className={`text-xs font-semibold text-${matchColor}-700 mt-0.5`}>{scoreLabel(matchScore)}</p>
                <p className="text-[10px] text-slate-500 mt-1">{analysis.roleName} benchmark</p>
              </div>
            </div>
          )}
        </div>

        {/* Warnings */}
        {analysis.warnings?.length > 0 && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div className="space-y-1">
              {analysis.warnings.slice(0, 3).map((w, i) => <p key={i}>{w}</p>)}
            </div>
          </div>
        )}
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === t.id
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Overview ── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* ATS breakdown */}
          {analysis.atsScore && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Resume Quality Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Contact Info', score: analysis.atsScore.contactInfoScore, max: 10 },
                  { label: 'Structure', score: analysis.atsScore.structureScore, max: 10 },
                  { label: 'Section Clarity', score: analysis.atsScore.sectionClarityScore, max: 10 },
                  { label: 'Skills Presentation', score: analysis.atsScore.skillsPresentationScore, max: 10 },
                  { label: 'Experience Clarity', score: analysis.atsScore.experienceClarityScore, max: 15 },
                  { label: 'Project Quality', score: analysis.atsScore.projectClarityScore, max: 15 },
                  { label: 'Education', score: analysis.atsScore.educationScore, max: 10 },
                  { label: 'Formatting', score: analysis.atsScore.formattingScore, max: 10 },
                  { label: 'Readability', score: analysis.atsScore.readabilityScore, max: 10 },
                ].map(({ label, score, max }) => {
                  const pct = Math.round((score / max) * 100);
                  const c = pct >= 75 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-500' : 'bg-amber-400';
                  return (
                    <div key={label} className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500">
                        <span>{label}</span>
                        <span className="font-semibold text-slate-700">{score}/{max}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {analysis.atsScore.strengths?.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Strengths</p>
                    <ul className="space-y-1">
                      {analysis.atsScore.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {analysis.atsScore.issues?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Issues</p>
                      <ul className="space-y-1">
                        {analysis.atsScore.issues.map((s, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {analysis.atsScore.parsingRisks?.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-xs font-bold text-red-700 mb-1.5">Parsing Risks</p>
                  <ul className="space-y-1">
                    {analysis.atsScore.parsingRisks.map((r, i) => (
                      <li key={i} className="text-xs text-red-600">{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Extraction summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" /> Analysis Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Years Experience', value: analysis.extractionSummary.totalYearsExperience || '—', icon: <Briefcase className="w-4 h-4 text-slate-400" /> },
                { label: 'Projects', value: analysis.extractionSummary.projectCount, icon: <FolderGit2 className="w-4 h-4 text-slate-400" /> },
                { label: 'Verified Skills', value: analysis.extractionSummary.verifiedSkillsCount, icon: <CheckCircle2 className="w-4 h-4 text-slate-400" /> },
                { label: 'Certifications', value: analysis.extractionSummary.certificationsCount, icon: <Award className="w-4 h-4 text-slate-400" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  {icon}
                  <div>
                    <p className="text-lg font-black text-slate-900">{value}</p>
                    <p className="text-[10px] text-slate-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Education: </span>
                {analysis.extractionSummary.educationSummary || 'Not detected'}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-semibold border text-[10px] ${
                analysis.confidenceRating === 'High' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : analysis.confidenceRating === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>{analysis.confidenceRating} Confidence</span>
              <span className="text-slate-500">{analysis.confidenceExplanation}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Skill Match ── */}
      {activeTab === 'skills' && (
        <div className="space-y-5">
          {/* Three-column summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <p className="text-2xl font-black text-emerald-700">
                {analysis.opportunityMatchedSkills?.length ?? analysis.matchedSkills.length}
              </p>
              <p className="text-xs text-emerald-600 font-semibold">Matched</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <p className="text-2xl font-black text-amber-700">
                {analysis.opportunityPartialSkills?.length ?? analysis.partialSkills.length}
              </p>
              <p className="text-xs text-amber-600 font-semibold">Partial</p>
            </div>
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
              <p className="text-2xl font-black text-red-700">
                {analysis.opportunityMissingSkills?.length ?? analysis.missingSkills.length}
              </p>
              <p className="text-xs text-red-600 font-semibold">Missing</p>
            </div>
          </div>

          {/* Required Skills Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Required Skills Analysis</h3>
              <p className="text-xs text-slate-500 mt-0.5">Only skills evidenced in your actual resume are marked as matched.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {requiredSkills.map(({ skill, requirement, status, evidence }) => {
                const isEvidenceGap = status !== 'matched' && isKnownInProfile(skill);
                return (
                  <div key={skill} className="flex items-start gap-4 px-5 py-3.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      status === 'matched'
                        ? 'bg-emerald-100'
                        : isEvidenceGap
                          ? 'bg-purple-100'
                          : status === 'partial'
                            ? 'bg-amber-100'
                            : 'bg-red-100'
                    }`}>
                      {status === 'matched' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isEvidenceGap ? (
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                      ) : status === 'partial' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-slate-800">{skill}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          requirement === 'Required' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                        }`}>{requirement}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          status === 'matched'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isEvidenceGap
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : status === 'partial'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {status === 'matched'
                            ? '✓ Matched'
                            : isEvidenceGap
                              ? '📄 Resume Evidence Gap'
                              : status === 'partial'
                                ? '⚠ Partial'
                                : '✕ Not Evidenced'}
                        </span>
                      </div>
                      {evidence ? (
                        <p className="text-xs text-slate-500 mt-1 italic">"{evidence}"</p>
                      ) : isEvidenceGap ? (
                        <p className="text-xs text-purple-700 mt-1">
                          Present in your My Skills profile, but unevidenced on this resume. Add a bullet point or project demonstrating this skill.
                        </p>
                      ) : status !== 'matched' ? (
                        <p className="text-xs text-slate-400 mt-1">No supporting evidence found in the uploaded resume.</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detected skills from resume (not necessarily required) */}
          {analysis.irrelevantSkills?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Additional Detected Skills</h3>
              <p className="text-xs text-slate-500 mb-3">Skills found in your resume that are not part of this opportunity's requirements.</p>
              <div className="flex flex-wrap gap-2">
                {analysis.irrelevantSkills.map(s => (
                  <span key={s.skill} className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Resume Profile ── */}
      {activeTab === 'resume' && extraction && (
        <div className="space-y-4">
          {/* Contact */}
          {extraction.contactInfo && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Candidate Profile
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {extraction.candidateName && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Name</p>
                    <p className="text-xs font-semibold text-slate-800">{extraction.candidateName}</p>
                  </div>
                )}
                {extraction.contactInfo.email && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{extraction.contactInfo.email}</p>
                  </div>
                )}
                {extraction.contactInfo.phone && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-semibold text-slate-800">{extraction.contactInfo.phone}</p>
                  </div>
                )}
                {extraction.contactInfo.location && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-xs font-semibold text-slate-800">{extraction.contactInfo.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Experience</p>
                  <p className="text-xs font-semibold text-slate-800">{extraction.totalYearsExperience > 0 ? `${extraction.totalYearsExperience} yr${extraction.totalYearsExperience !== 1 ? 's' : ''}` : 'Fresher / Not stated'}</p>
                </div>
              </div>
              {extraction.summary && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Summary</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{extraction.summary}</p>
                </div>
              )}
            </div>
          )}

          {/* Education */}
          {extraction.education?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" /> Education
              </h3>
              <div className="space-y-3">
                {extraction.education.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
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

          {/* Work History */}
          {extraction.workHistory?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" /> Work Experience
              </h3>
              <div className="space-y-4">
                {extraction.workHistory.map((w, i) => (
                  <div key={i} className="border-l-2 border-blue-200 pl-4 space-y-1">
                    <p className="text-xs font-bold text-slate-900">{w.title}</p>
                    <p className="text-xs text-slate-500">{w.company}{w.duration ? ` · ${w.duration}` : ''}</p>
                    {w.responsibilities?.length > 0 && (
                      <ul className="space-y-0.5 mt-1">
                        {w.responsibilities.slice(0, 3).map((r, j) => (
                          <li key={j} className="text-xs text-slate-600 flex items-start gap-1.5">
                            <span className="text-blue-400 mt-0.5">·</span> {r}
                          </li>
                        ))}
                      </ul>
                    )}
                    {w.technologiesUsed?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {w.technologiesUsed.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">{t}</span>
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
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-medium">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Skills with Evidence */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" /> Detected Skills — Evidence
            </h3>
            <p className="text-xs text-slate-400 mb-3">Only skills with supporting evidence in your resume text are listed.</p>
            <div className="space-y-2">
              {extraction.skillsClaimed.filter(s => s.verifiedInText).map((s, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-800">{s.originalSkill || s.skill}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${s.confidence === 'explicit' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {s.confidence === 'explicit' ? 'Explicit' : 'Inferred'}{s.hasPracticalEvidence ? ' · In project/work' : ''}
                      </span>
                    </div>
                    {s.evidenceSnippet && <p className="text-xs text-slate-500 mt-0.5 italic">"{s.evidenceSnippet}"</p>}
                  </div>
                </div>
              ))}
              {extraction.skillsClaimed.filter(s => !s.verifiedInText).length > 0 && (
                <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 mb-1">Skills Claimed but Not Verified in Text</p>
                  <div className="flex flex-wrap gap-1.5">
                    {extraction.skillsClaimed.filter(s => !s.verifiedInText).map(s => (
                      <span key={s.skill} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">{s.originalSkill || s.skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Skill Gaps ── */}
      {activeTab === 'gaps' && (
        <div className="space-y-5">
          {/* Priority classification */}
          {analysis.missingSkills?.length > 0 || analysis.opportunityMissingSkills?.length ? (
            <>
              {/* Critical gaps */}
              {analysis.missingSkills.filter(s => s.severity === 'Critical').length > 0 && (
                <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-red-50 border-b border-red-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-sm font-bold text-red-800">Critical Gaps</span>
                    <span className="text-xs text-red-600 ml-auto">Highest priority to address</span>
                  </div>
                  <div className="divide-y divide-red-100">
                    {analysis.missingSkills.filter(s => s.severity === 'Critical').map(s => {
                      const isEvidenceGap = isKnownInProfile(s.skill);
                      return (
                        <div key={s.skill} className="p-4 flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isEvidenceGap ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-600'
                          }`}>
                            {isEvidenceGap ? <FileText className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{s.skill}</p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                isEvidenceGap
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}>
                                {isEvidenceGap ? '📄 Resume Evidence Gap' : '✕ Verified Skill Gap'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{s.whyItMatters}</p>
                            <p className={`text-xs mt-1 ${isEvidenceGap ? 'text-purple-700 font-medium' : 'text-red-600'}`}>
                              {isEvidenceGap
                                ? 'Known in your My Skills profile — missing documentation/evidence on this resume.'
                                : 'Not evidenced in your uploaded resume or profile.'}
                            </p>
                          </div>
                          <button
                            onClick={() => { addSkillToRoadmap(s.skill); onNavigateToRoadmap?.(); }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                              isEvidenceGap
                                ? 'bg-purple-600 text-white hover:bg-purple-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            <BookOpen className="w-3 h-3" /> {isEvidenceGap ? 'Add to Resume' : 'Learn'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Important gaps */}
              {analysis.missingSkills.filter(s => s.severity === 'Important').length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-sm font-bold text-amber-800">Important Gaps</span>
                  </div>
                  <div className="divide-y divide-amber-100">
                    {analysis.missingSkills.filter(s => s.severity === 'Important').map(s => {
                      const isEvidenceGap = isKnownInProfile(s.skill);
                      return (
                        <div key={s.skill} className="p-4 flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isEvidenceGap ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {isEvidenceGap ? <FileText className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">{s.skill}</p>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                isEvidenceGap
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {isEvidenceGap ? '📄 Resume Evidence Gap' : '✕ Verified Skill Gap'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{s.whyItMatters}</p>
                            <p className={`text-xs mt-1 ${isEvidenceGap ? 'text-purple-700 font-medium' : 'text-amber-600'}`}>
                              {isEvidenceGap
                                ? 'Known in your My Skills profile — missing documentation/evidence on this resume.'
                                : 'Not evidenced in your uploaded resume or profile.'}
                            </p>
                          </div>
                          <button
                            onClick={() => { addSkillToRoadmap(s.skill); onNavigateToRoadmap?.(); }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                              isEvidenceGap
                                ? 'border border-purple-300 text-purple-700 hover:bg-purple-50'
                                : 'border border-blue-300 text-blue-700 hover:bg-blue-50'
                            }`}
                          >
                            <BookOpen className="w-3 h-3" /> {isEvidenceGap ? 'Add to Resume' : 'Learn'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Minor gaps */}
              {analysis.missingSkills.filter(s => s.severity !== 'Critical' && s.severity !== 'Important').length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <span className="text-sm font-bold text-slate-700">Minor / Optional Gaps</span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4">
                    {analysis.missingSkills.filter(s => s.severity !== 'Critical' && s.severity !== 'Important').map(s => (
                      <button
                        key={s.skill}
                        onClick={() => addSkillToRoadmap(s.skill)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-100 text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all"
                      >
                        {s.skill} <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Partial matches */}
              {analysis.partialSkills?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-sm font-bold text-slate-800">Partial Matches — Strengthen Evidence</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {analysis.partialSkills.map(s => (
                      <div key={s.skill} className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-slate-800">{s.skill}</p>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Partial</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{s.reason}</p>
                        {s.evidenceQuote && <p className="text-xs text-slate-400 mt-0.5 italic">Found: "{s.evidenceQuote}"</p>}
                        {s.recommendedImprovement && (
                          <p className="text-xs text-blue-600 mt-1.5 font-medium">💡 {s.recommendedImprovement}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <p className="text-base font-bold text-slate-800">No significant skill gaps detected</p>
              <p className="text-sm text-slate-500">Your resume evidences most required skills for this opportunity.</p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Recommendations ── */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {/* Learning roadmap based on gaps */}
          {analysis.whatToLearnNext?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Prioritized Learning Roadmap</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generated from actual gaps found between your resume and {hasOpportunityContext ? `${analysis.opportunityTitle} at ${analysis.opportunityCompany}` : `${analysis.roleName} benchmark`}.
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {analysis.whatToLearnNext.map((item, i) => (
                  <div key={item.skill} className="flex items-start gap-4 p-4">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      item.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      item.severity === 'Important' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                    }`}>{i + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{item.skill}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.severity === 'Critical' ? 'bg-red-50 text-red-700' :
                          item.severity === 'Important' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>{item.severity}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.actionDescription}</p>
                    </div>
                    <button
                      onClick={() => { addSkillToRoadmap(item.roadmapSkill || item.skill); onNavigateToRoadmap?.(); }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shrink-0"
                    >
                      <BookOpen className="w-3 h-3" /> Learn
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume improvement recommendations */}
          {(analysis.atsScore?.formattingRecommendations?.length ?? 0) > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Resume Improvement Recommendations
              </h3>
              <ul className="space-y-2.5">
                {analysis.atsScore?.formattingRecommendations?.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-700">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">{i + 1}</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Interview CTA */}
          {hasOpportunityContext && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">Practice Interview for this Role</p>
                  <p className="text-xs text-blue-200 mt-1">
                    Use the AI Video Interview to practice questions for {analysis.opportunityTitle} at {analysis.opportunityCompany}.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate?.('mock-interview')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-blue-700 text-xs font-bold hover:bg-blue-50 transition-colors shrink-0"
                >
                  Practice <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Skill Sync Modal ── */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Sync Skills to Profile</h3>
              <button onClick={() => setIsSyncModalOpen(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 max-h-72 overflow-y-auto space-y-2">
              {Object.entries(skillSyncChoices).map(([name, choice]) => (
                <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    checked={choice.selected}
                    onChange={() => setSkillSyncChoices(p => ({ ...p, [name]: { ...p[name], selected: !p[name].selected } }))}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span className="text-xs font-semibold text-slate-800 flex-1">{name}</span>
                  <select
                    value={choice.level}
                    onChange={e => setSkillSyncChoices(p => ({ ...p, [name]: { ...p[name], level: e.target.value as SkillLevel } }))}
                    className="text-[10px] border border-slate-200 rounded-lg px-2 py-1 bg-white"
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setIsSyncModalOpen(false)} className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmSkillSync} className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">Sync Selected</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
