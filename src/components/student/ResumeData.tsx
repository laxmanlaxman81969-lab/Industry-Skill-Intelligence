import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ResumeRecord } from '../../types';
import { SkillAnalyzerApi } from '../../services/skillAnalyzerApi';
import { ServerResumeRecord } from '../../../server/types';
import {
  FileText, Upload, Trash2, ArrowRight, Eye, CheckCircle2, Loader2,
  AlertCircle, Briefcase, Code2, FolderGit2, Clock, Plus, RefreshCw,
  ChevronRight, Award, BarChart2, TrendingUp, X
} from 'lucide-react';

interface ResumeDataProps {
  onNavigate?: (view: string) => void;
  onNavigateToAnalyzer?: () => void;
}

export const ResumeData: React.FC<ResumeDataProps> = ({ onNavigate, onNavigateToAnalyzer }) => {
  const { resumeLibrary, setResumeLibrary, selectedResumeId, setSelectedResumeId, studentProfile, setSelectedOpportunityContext } = useApp();

  const [serverResumes, setServerResumes] = useState<ServerResumeRecord[]>([]);
  const [isLoadingServer, setIsLoadingServer] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const showError = (msg: string) => { setErrorToast(msg); setTimeout(() => setErrorToast(null), 5000); };

  const userId = studentProfile.email || 'default_user';

  // Load server-persisted resumes on mount
  useEffect(() => {
    loadServerResumes();
  }, []);

  const loadServerResumes = async () => {
    setIsLoadingServer(true);
    try {
      const res = await SkillAnalyzerApi.getUserResumes(userId);
      if (res.success) {
        setServerResumes(res.resumes);
        // Merge into local resumeLibrary for backward compat (add any missing ones)
        setResumeLibrary(prev => {
          const existingHashes = new Set(prev.map(r => r.fileHash));
          const newEntries: ResumeRecord[] = res.resumes
            .filter(sr => !existingHashes.has(sr.fileHash))
            .map(sr => ({
              id: `resume-${sr.fileHash}`,
              studentId: sr.userId,
              fileHash: sr.fileHash,
              fileName: sr.fileName,
              fileSize: sr.fileSize,
              fileMimeType: sr.fileMimeType,
              originalFileType: sr.fileMimeType || 'application/pdf',
              uploadDate: sr.uploadedAt.split('T')[0],
              lastAnalyzed: sr.lastAnalyzedAt,
              latestAnalysisId: sr.latestAnalysisId || undefined,
              latestAtsScore: sr.latestAtsScore || undefined,
              latestSkillGapScore: sr.latestSkillGapScore || undefined,
              processingStatus: 'Parsed successfully' as const,
              parsingStatus: 'Completed' as const,
              extractedSkills: [],
              extractedSummary: '',
              resumeText: '',
              analysesHistory: [],
              metadata: { technicalSkills: [], education: [], experience: [], projects: [], certifications: [], achievements: [], languages: [], tools: [] },
            }));
          return [...newEntries, ...prev];
        });
      }
    } catch { /* offline — show local library */ }
    finally { setIsLoadingServer(false); }
  };

  // Upload a new resume (stores it without analyzing)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorToast(null);
    try {
      const res = await SkillAnalyzerApi.uploadResume(file);
      const newResume: ResumeRecord = {
        id: `resume-${res.fileHash}`,
        studentId: userId,
        fileHash: res.fileHash,
        fileName: res.fileName,
        fileSize: res.fileSize,
        fileMimeType: file.type || 'application/pdf',
        originalFileType: file.type || 'application/pdf',
        uploadDate: new Date().toISOString().split('T')[0],
        lastAnalyzed: null,
        processingStatus: 'Parsed successfully',
        parsingStatus: 'Completed',
        extractedSkills: [],
        extractedSummary: '',
        resumeText: res.extractedTextPreview || '',
        analysesHistory: [],
        metadata: { technicalSkills: [], education: [], experience: [], projects: [], certifications: [], achievements: [], languages: [], tools: [] },
      };
      setResumeLibrary(prev => [newResume, ...prev.filter(r => r.fileHash !== res.fileHash)]);
      setSelectedResumeId(newResume.id);
      showToast(`Uploaded "${res.fileName}" — ${res.wordCount} words extracted`);
    } catch (err: any) {
      showError(err.message || 'Failed to upload resume.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = (resume: ResumeRecord) => {
    setSelectedResumeId(resume.id);
    setSelectedOpportunityContext(null);
    if (onNavigateToAnalyzer) onNavigateToAnalyzer();
    else if (onNavigate) onNavigate('gap-analyzer');
  };

  const handleViewDetail = (resume: ResumeRecord) => {
    if (onNavigate) onNavigate(`resume-detail:${resume.fileHash}`);
  };

  const handleViewAnalysis = (analysisId: string) => {
    if (onNavigate) onNavigate(`resume-analysis:${analysisId}`);
  };

  const handleDelete = async (resume: ResumeRecord) => {
    if (!window.confirm(`Delete "${resume.fileName}"? This removes the resume record (analyses are preserved).`)) return;
    setDeletingId(resume.id);
    try {
      // Delete from server
      const serverResume = serverResumes.find(sr => sr.fileHash === resume.fileHash);
      if (serverResume) {
        await SkillAnalyzerApi.deleteResume(serverResume.resumeId);
        setServerResumes(prev => prev.filter(sr => sr.resumeId !== serverResume.resumeId));
      }
      // Remove from local library
      setResumeLibrary(prev => prev.filter(r => r.id !== resume.id));
      if (selectedResumeId === resume.id) setSelectedResumeId(null);
      showToast(`"${resume.fileName}" removed.`);
    } catch (err: any) {
      showError(err.message || 'Failed to delete.');
    } finally { setDeletingId(null); }
  };

  // Merge server records with local library for display
  const displayResumes = resumeLibrary.length > 0 ? resumeLibrary : [];

  // Find matching server record for a local resume
  const getServerRecord = (fileHash?: string) =>
    fileHash ? serverResumes.find(sr => sr.fileHash === fileHash) : undefined;

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* ── Toasts ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}
      {errorToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-medium shadow-lg">
          <AlertCircle className="w-4 h-4" /> {errorToast}
          <button onClick={() => setErrorToast(null)}><X className="w-4 h-4 ml-1" /></button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Resume Repository</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Resumes</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            All your analyzed resumes with scores, detected skills, and opportunity history.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadServerResumes}
            disabled={isLoadingServer}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingServer ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
          >
            {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc,.txt,.rtf,.odt,.html,.htm,.png,.jpg,.jpeg,.webp" className="hidden" onChange={handleFileUpload} />
        </div>
      </div>

      {/* ── Loading ── */}
      {isLoadingServer && displayResumes.length === 0 && (
        <div className="flex items-center justify-center py-16 gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm">Loading your resume library...</span>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isLoadingServer && displayResumes.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-4 p-16 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
        >
          <Upload className="w-10 h-10 text-slate-300" />
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600">No resumes yet</p>
            <p className="text-xs text-slate-400 mt-1">Upload a resume or analyze one from the AI Skill Analyzer to get started.</p>
          </div>
          <span className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">Upload Resume</span>
        </div>
      )}

      {/* ── Resume cards ── */}
      {displayResumes.map(resume => {
        const serverRec = getServerRecord(resume.fileHash);
        const atsScore = resume.latestAtsScore ?? serverRec?.latestAtsScore;
        const matchScore = resume.latestSkillGapScore ?? serverRec?.latestSkillGapScore;
        const skillCount = resume.extractedSkills?.length || serverRec?.detectedSkillsCount || 0;
        const projectCount = resume.metadata?.projects?.length || serverRec?.projectCount || 0;
        const analyses = resume.analysesHistory || [];
        const latestAnalysisId = resume.latestAnalysisId || serverRec?.latestAnalysisId;
        const isDeleting = deletingId === resume.id;

        return (
          <div key={resume.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="flex items-start gap-4 p-5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900 truncate">{resume.fileName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      Uploaded {new Date(resume.uploadDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {resume.lastAnalyzed && (
                        <span className="text-emerald-600">· Analyzed {new Date(resume.lastAnalyzed).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      )}
                    </p>
                  </div>
                  {/* Scores */}
                  <div className="flex items-center gap-2 shrink-0">
                    {atsScore != null && (
                      <div className="text-center px-2.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100">
                        <p className="text-xs font-black text-blue-700">{atsScore}</p>
                        <p className="text-[9px] text-blue-500 font-medium">ATS</p>
                      </div>
                    )}
                    {matchScore != null && (
                      <div className="text-center px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100">
                        <p className="text-xs font-black text-emerald-700">{matchScore}</p>
                        <p className="text-[9px] text-emerald-500 font-medium">Match</p>
                      </div>
                    )}
                    {atsScore == null && matchScore == null && (
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">Not analyzed</span>
                    )}
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Code2 className="w-3 h-3" /> <span className="font-semibold text-slate-700">{skillCount}</span> skills detected
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <FolderGit2 className="w-3 h-3" /> <span className="font-semibold text-slate-700">{projectCount}</span> projects
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <BarChart2 className="w-3 h-3" /> <span className="font-semibold text-slate-700">{analyses.length}</span> {analyses.length === 1 ? 'opportunity' : 'opportunities'} analyzed
                  </span>
                </div>
              </div>
            </div>

            {/* Analysis history — mini list */}
            {analyses.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Opportunity Analyses</p>
                <div className="space-y-1.5">
                  {analyses.slice(0, 3).map(h => (
                    <button
                      key={h.id}
                      onClick={() => handleViewAnalysis(h.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left"
                    >
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{h.opportunityTitle} · {h.companyName}</p>
                        <p className="text-[10px] text-slate-400">{new Date(h.analyzedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">ATS {h.atsScore}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Match {h.skillGapScore}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-t border-slate-100 flex-wrap">
              <button
                onClick={() => handleViewDetail(resume)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/30 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> View Details
              </button>
              {latestAnalysisId && (
                <button
                  onClick={() => handleViewAnalysis(latestAnalysisId)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50/30 transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> View Analysis
                </button>
              )}
              <button
                onClick={() => handleAnalyze(resume)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                {latestAnalysisId ? <RefreshCw className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                {latestAnalysisId ? 'Re-analyze' : 'Analyze'}
              </button>
              <button
                onClick={() => handleDelete(resume)}
                disabled={isDeleting}
                className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-transparent text-xs font-medium text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete
              </button>
            </div>
          </div>
        );
      })}

      {/* ── Analyze CTA ── */}
      {displayResumes.length > 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all"
        >
          <Plus className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium text-slate-500">Upload another resume version</span>
        </div>
      )}
    </div>
  );
};
