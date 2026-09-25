import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SkillAnalyzerApi, UploadResponse } from '../../services/skillAnalyzerApi';
import { AnalysisRecord, RoleTaxonomyRecord, PipelineStatus } from '../../../server/types';
import {
  Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  BrainCircuit, Target, ChevronRight, Briefcase, Building2, X, Loader2,
  Clock, Check, ArrowLeft, FolderOpen, RefreshCw, AlertCircle, Zap,
  Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';

interface SkillGapAnalyzerProps {
  onNavigate?: (view: string) => void;
  onNavigateToRoadmap?: () => void;
  onNavigateBack?: () => void;
}

// Pipeline steps shown during analysis
const PIPELINE_STEPS = [
  { label: 'Validating resume source...', stage: 'UPLOADED' as PipelineStatus },
  { label: 'Detecting format & extracting content...', stage: 'PARSING' as PipelineStatus },
  { label: 'Detecting sections (Experience, Skills, Projects)...', stage: 'PARSED' as PipelineStatus },
  { label: 'AI extracting skills with evidence...', stage: 'AI_EXTRACTING' as PipelineStatus },
  { label: 'Verifying evidence for each skill...', stage: 'AI_RETRYING' as PipelineStatus },
  { label: 'Comparing to opportunity requirements...', stage: 'COMPARING' as PipelineStatus },
  { label: 'Calculating ATS & opportunity match scores...', stage: 'SCORING' as PipelineStatus },
  { label: 'Saving analysis results...', stage: 'SAVING' as PipelineStatus },
  { label: 'Analysis complete!', stage: 'COMPLETED' as PipelineStatus },
];

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({
  onNavigate,
  onNavigateBack,
}) => {
  const {
    studentProfile,
    resumeLibrary,
    selectedResumeId,
    selectedOpportunityContext,
    setSelectedOpportunityContext,
    setResumeLibrary,
    setSelectedResumeId,
    setLatestAnalysis,
    jobs,
  } = useApp();

  // ── Role / taxonomy ──────────────────────────────────────
  const [dbRoles, setDbRoles] = useState<{ roleId: string; roleName: string; category: string; coreSkillCount: number }[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(studentProfile.targetRole || 'Java Backend Developer');
  const [currentTaxonomy, setCurrentTaxonomy] = useState<RoleTaxonomyRecord | null>(null);

  // ── Input mode & File upload state ────────────────────────
  const [inputMode, setInputMode] = useState<'file' | 'url'>('file');
  const [resumeUrl, setResumeUrl] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState('Uploading resume...');
  const [lastAction, setLastAction] = useState<(() => void) | null>(null);

  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    hash?: string;
    wordCount?: number;
    ocrUsed?: boolean;
    ocrConfidence?: number;
    isCached?: boolean;
    textPreview?: string;
    imagePreview?: string | null;
    isImage?: boolean;
    isUrl?: boolean;
    url?: string;
    extractionMethod?: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // ── Opportunity selection ─────────────────────────────────
  const [showOpportunityPicker, setShowOpportunityPicker] = useState(false);

  // ── Analysis state ────────────────────────────────────────
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Resume from library selected
  const selectedStoredResume = resumeLibrary.find(r => r.id === selectedResumeId);

  // ── Initialise ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [statusRes, rolesRes] = await Promise.all([
          SkillAnalyzerApi.getStatus(),
          SkillAnalyzerApi.getRoles(),
        ]);
        void statusRes; // status fetched for future use
        if (rolesRes.success) setDbRoles(rolesRes.roles);
      } catch { /* offline — proceed */ }
    })();
  }, []);

  // Pre-populate file state from a stored resume
  useEffect(() => {
    if (!selectedStoredResume || uploadedFile) return;
    setUploadedFile({
      name: selectedStoredResume.fileName,
      size: selectedStoredResume.fileSize
        ? `${(selectedStoredResume.fileSize / (1024 * 1024)).toFixed(2)} MB`
        : 'Stored resume',
      hash: selectedStoredResume.fileHash,
      textPreview: selectedStoredResume.resumeText?.slice(0, 500),
    });
  }, [selectedResumeId, resumeLibrary]);

  // Sync role from opportunity context
  useEffect(() => {
    if (selectedOpportunityContext) {
      setSelectedRole(selectedOpportunityContext.role || selectedOpportunityContext.title || selectedRole);
    }
  }, [selectedOpportunityContext]);

  // Fetch taxonomy when role changes
  useEffect(() => {
    if (!selectedRole) return;
    (async () => {
      try {
        const match = dbRoles.find(r =>
          r.roleName.toLowerCase() === selectedRole.toLowerCase() || r.roleId === selectedRole
        );
        const roleId = match?.roleId || selectedRole.toLowerCase().replace(/[\s_]+/g, '-');
        const res = await SkillAnalyzerApi.getTaxonomy(roleId);
        if (res.success) setCurrentTaxonomy(res.taxonomy);
      } catch { /* ignore */ }
    })();
  }, [selectedRole, dbRoles]);

  // ── Helpers ───────────────────────────────────────────────
  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 4000); };
  const showError = (msg: string) => { setErrorMessage(msg); setTimeout(() => setErrorMessage(null), 8000); };

  // ── Upload handler ────────────────────────────────────────
  const processFile = async (file: File) => {
    setErrorMessage(null);
    setIsUploading(true);
    setLastAction(() => () => processFile(file));

    const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name);
    let preview: string | null = null;
    if (isImg) {
      preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
      setUploadStatusText('Image resume detected. Running OCR...');
    } else if (/\.pdf$/i.test(file.name)) {
      setUploadStatusText('Extracting PDF content (with OCR check)...');
    } else {
      setUploadStatusText('Extracting document content...');
    }

    try {
      const res: UploadResponse = await SkillAnalyzerApi.uploadResume(file);
      setUploadedFile({
        name: res.fileName,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        hash: res.fileHash,
        wordCount: res.wordCount,
        ocrUsed: res.ocrUsed,
        ocrConfidence: res.ocrConfidence,
        isCached: res.isCached,
        textPreview: res.extractedTextPreview,
        imagePreview: preview,
        isImage: isImg,
        isUrl: false,
        extractionMethod: res.extractionMethod,
      });
      setSelectedResumeId(null);
      if (res.ocrUsed) {
        showToast(`Image resume processed via OCR — ${res.wordCount} words extracted.`);
      } else {
        showToast(`"${res.fileName}" loaded — ${res.wordCount} words extracted. Click Analyze to continue.`);
      }
    } catch (err: any) {
      showError(err.message || 'Upload failed. Please check the file format.');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlImport = () => {
    const trimmed = resumeUrl.trim();
    if (!trimmed) {
      showError('Please enter a valid resume URL.');
      return;
    }
    setErrorMessage(null);
    setUploadedFile({
      name: trimmed.split('/').pop()?.split('?')[0] || 'Web_Resume',
      size: 'Remote URL',
      url: trimmed,
      isUrl: true,
      textPreview: `Resume imported from: ${trimmed}`,
    });
    setSelectedResumeId(null);
    showToast('Resume URL loaded. Select an opportunity and click Analyze to continue.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ── Core analysis executor ────────────────────────────────
  const handleAnalyze = async () => {
    if (!uploadedFile && !selectedStoredResume && !(inputMode === 'url' && resumeUrl.trim())) {
      if (inputMode === 'file') fileInputRef.current?.click();
      return;
    }

    setErrorMessage(null);
    setIsAnalyzing(true);
    setPipelineStep(0);
    setLastAction(() => handleAnalyze);

    // Animate pipeline steps
    const stepInterval = setInterval(() => {
      setPipelineStep(prev => {
        if (prev < PIPELINE_STEPS.length - 2) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 900);

    try {
      const roleMatch = dbRoles.find(r =>
        r.roleName.toLowerCase() === selectedRole.toLowerCase() || r.roleId === selectedRole
      );
      const roleId = roleMatch?.roleId || selectedRole.toLowerCase().replace(/[\s_]+/g, '-');

      // Build opportunity context if available
      const opp = selectedOpportunityContext;
      const requiredSkills = opp?.requiredSkills?.map(s => s.skill) || [];
      const preferredSkills = (opp?.preferredSkills || []).map((s: any) => typeof s === 'string' ? s : s?.skill || s);

      let response: any;
      if (uploadedFile?.isUrl || (inputMode === 'url' && resumeUrl.trim())) {
        response = await SkillAnalyzerApi.analyzeUrl({
          url: uploadedFile?.url || resumeUrl.trim(),
          roleId,
          userId: studentProfile.email || 'default_user',
          opportunityId: opp?.id,
          opportunityTitle: opp?.title,
          opportunityCompany: opp?.companyName || (opp as any)?.company,
          opportunityRequiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
          opportunityPreferredSkills: preferredSkills.length > 0 ? preferredSkills : undefined,
          opportunityDescription: opp?.description,
        });
      } else {
        response = await SkillAnalyzerApi.analyzeResume({
          fileHash: uploadedFile?.hash || selectedStoredResume?.fileHash,
          roleId,
          userId: studentProfile.email || 'default_user',
          fileName: uploadedFile?.name || selectedStoredResume?.fileName || 'Resume.pdf',
          opportunityId: opp?.id,
          opportunityTitle: opp?.title,
          opportunityCompany: opp?.companyName || (opp as any)?.company,
          opportunityRequiredSkills: requiredSkills.length > 0 ? requiredSkills : undefined,
          opportunityPreferredSkills: preferredSkills.length > 0 ? preferredSkills : undefined,
          opportunityDescription: opp?.description,
        });
      }

      clearInterval(stepInterval);
      setPipelineStep(PIPELINE_STEPS.length - 1);

      if (response.success && response.analysis) {
        setLatestAnalysis(response.analysis);
        storeResumeLocally(response.analysis);

        setTimeout(() => {
          if (onNavigate) onNavigate(`resume-analysis:${response.analysis.analysisId}`);
        }, 800);
      } else {
        throw new Error(response.error || "Analysis failed.");
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      setPipelineStep(0);
      showError(err.message || "Couldn't analyze this resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Store the analyzed resume in the local library for cross-component access
  const storeResumeLocally = (analysis: AnalysisRecord) => {
    const extraction = analysis.structuredExtraction;
    if (!analysis.fileHash) return;

    const resumeId = `resume-${analysis.fileHash}`;

    setResumeLibrary(prev => {
      const existingIdx = prev.findIndex(r => r.fileHash === analysis.fileHash);
      const base = existingIdx >= 0 ? prev[existingIdx] : null;

      const newEntry = {
        id: base?.id || resumeId,
        studentId: studentProfile.email || 'default_user',
        fileHash: analysis.fileHash,
        fileName: analysis.fileName,
        fileSize: analysis.fileSize,
        fileMimeType: analysis.fileMimeType,
        originalFileType: analysis.fileMimeType || 'application/pdf',
        uploadDate: base?.uploadDate || new Date(analysis.createdAt).toISOString().split('T')[0],
        lastAnalyzed: analysis.updatedAt || analysis.createdAt,
        targetRole: analysis.roleName,
        targetOpportunityId: selectedOpportunityContext?.id,
        latestAnalysisId: analysis.analysisId,
        latestAtsScore: analysis.atsScore?.score,
        latestSkillGapScore: analysis.skillGapScore?.score || analysis.scoreBreakdown?.overallScore,
        processingStatus: 'Parsed successfully' as const,
        parsingStatus: 'Completed' as const,
        extractedSkills: extraction?.skillsClaimed.filter(s => s.verifiedInText).map(s => s.originalSkill || s.skill) || [],
        extractedSummary: extraction?.summary || '',
        resumeText: analysis.extractedResumeText || '',
        structuredExtraction: extraction,
        analysesHistory: [
          {
            id: analysis.analysisId,
            studentId: studentProfile.email || 'default_user',
            resumeId,
            resumeName: analysis.fileName,
            opportunityId: selectedOpportunityContext?.id || analysis.roleId,
            opportunityTitle: analysis.opportunityTitle || analysis.roleName,
            companyName: analysis.opportunityCompany || selectedOpportunityContext?.companyName || 'Benchmark',
            skillGapScore: analysis.skillGapScore?.score || analysis.scoreBreakdown?.overallScore || 0,
            atsScore: analysis.atsScore?.score || 0,
            analyzedAt: analysis.createdAt,
            matchedSkills: (analysis.opportunityMatchedSkills || analysis.matchedSkills.map(s => s.skill)),
            missingSkills: (analysis.opportunityMissingSkills || analysis.missingSkills.map(s => s.skill)),
          },
          ...(base?.analysesHistory || []).filter(h => h.id !== analysis.analysisId),
        ],
        metadata: {
          name: extraction?.candidateName,
          email: extraction?.contactInfo?.email,
          phone: extraction?.contactInfo?.phone,
          location: extraction?.contactInfo?.location,
          summary: extraction?.summary,
          technicalSkills: extraction?.skillsClaimed.filter(s => s.verifiedInText).map(s => s.originalSkill || s.skill) || [],
          education: extraction?.education.map(e => [e.degree, e.institution, e.year].filter(Boolean).join(' – ')) || [],
          experience: extraction?.workHistory.map(w => [w.title, w.company, w.duration].filter(Boolean).join(' – ')) || [],
          projects: extraction?.projects.map(p => p.name) || [],
          certifications: extraction?.certifications || [],
          achievements: extraction?.achievements || [],
          languages: extraction?.languages || [],
          tools: [],
        },
      };

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newEntry, id: updated[existingIdx].id };
        return updated;
      }
      return [newEntry, ...prev];
    });

    setSelectedResumeId(resumeId);
  };

  // ── Readiness check ───────────────────────────────────────
  const hasResume = !!(uploadedFile?.hash || selectedStoredResume?.fileHash || uploadedFile?.isUrl || (inputMode === 'url' && resumeUrl.trim()));
  const hasOpportunity = !!selectedOpportunityContext;
  const canAnalyze = hasResume && hasOpportunity && !isAnalyzing && !isUploading;
  const step = !hasResume ? 1 : !selectedOpportunityContext ? 2 : 3;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="w-5 h-5 text-blue-600" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              AI Skill Analyzer
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Resume & Opportunity Analysis</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload your resume document or image, select an opportunity, and get evidence-based intelligence.
          </p>
        </div>
      </div>

      {/* ── Error / Toast ── */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1">
            <p className="font-medium">{errorMessage}</p>
            {lastAction && (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage(null);
                  lastAction();
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-2xs"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            )}
          </div>
          <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
        </div>
      )}
      {toastMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Opportunity context banner ── */}
      {selectedOpportunityContext ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/30 to-blue-50 border border-blue-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                    Selected Job
                  </span>
                  <span className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {selectedOpportunityContext.companyName || (selectedOpportunityContext as any).company || ''}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate mt-0.5">
                  Analyzing Resume For: {selectedOpportunityContext.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowOpportunityPicker(true)}
                className="px-3 py-1.5 rounded-xl border border-blue-300 text-blue-700 bg-white text-xs font-semibold hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Change Opportunity
              </button>
              <button
                onClick={() => setSelectedOpportunityContext(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Clear opportunity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Required & Preferred Skills Chips */}
          {selectedOpportunityContext.requiredSkills && selectedOpportunityContext.requiredSkills.length > 0 && (
            <div className="pt-2 border-t border-blue-200/60 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-600 mr-1">Required:</span>
              {selectedOpportunityContext.requiredSkills.map(req => (
                <span
                  key={req.skill}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-white text-blue-800 border border-blue-200 shadow-2xs"
                >
                  {req.skill}
                </span>
              ))}
              {selectedOpportunityContext.preferredSkills && selectedOpportunityContext.preferredSkills.length > 0 && (
                <>
                  <span className="text-[11px] font-semibold text-slate-500 ml-2 mr-1">Preferred:</span>
                  {selectedOpportunityContext.preferredSkills.map((pref: any) => {
                    const skillName = typeof pref === 'string' ? pref : pref.skill;
                    return (
                      <span
                        key={skillName}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {skillName}
                      </span>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">No Opportunity Selected</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Select an opportunity below to benchmark your resume against specific company requirements.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowOpportunityPicker(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors shrink-0 shadow-xs"
          >
            Select Job
          </button>
        </div>
      )}

      {/* ── STEP 1: Resume ── */}
      <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${step === 1 ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${hasResume ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
            {hasResume ? <Check className="w-3.5 h-3.5" /> : '1'}
          </div>
          <span className="text-sm font-semibold text-slate-800">Select Resume</span>
          {hasResume && (
            <span className="ml-auto text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Ready
            </span>
          )}
        </div>

        {/* Source Mode Selector (Upload File vs Paste Resume URL) */}
        {!uploadedFile && !selectedStoredResume && (
          <div className="flex border-b border-slate-100 bg-slate-50/50 px-5 pt-2.5 gap-2">
            <button
              type="button"
              onClick={() => { setInputMode('file'); setErrorMessage(null); }}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                inputMode === 'file'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
            <button
              type="button"
              onClick={() => { setInputMode('url'); setErrorMessage(null); }}
              className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                inputMode === 'url'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Paste Resume URL
            </button>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Uploaded / stored file card */}
          {(uploadedFile || selectedStoredResume) ? (
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              {uploadedFile?.imagePreview ? (
                <img
                  src={uploadedFile.imagePreview}
                  alt="Resume thumbnail"
                  className="w-12 h-12 object-cover rounded-lg border border-emerald-300 shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {uploadedFile?.name || selectedStoredResume?.fileName}
                  </p>
                  {uploadedFile?.ocrUsed && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                      OCR
                    </span>
                  )}
                  {uploadedFile?.isUrl && (
                    <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                      URL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {uploadedFile?.size || 'Stored resume'}{uploadedFile?.wordCount ? ` · ${uploadedFile.wordCount} words` : ''}
                  {uploadedFile?.ocrUsed ? ' · Text extracted via OCR' : ''}
                </p>
              </div>
              <button
                onClick={() => { setUploadedFile(null); setSelectedResumeId(null); setImagePreviewUrl(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : inputMode === 'url' ? (
            /* URL Input Section */
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Public Resume URL (PDF, HTML, or Image)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  placeholder="https://example.com/my-resume.pdf"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
                <button
                  type="button"
                  disabled={!resumeUrl.trim()}
                  onClick={handleUrlImport}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-2xs shrink-0"
                >
                  Use URL
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Supports public web resumes, online PDFs, and hosted images. Password-protected or authenticated profiles (e.g. LinkedIn) cannot be imported.
              </p>
            </div>
          ) : (
            /* Drop zone for File Upload */
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40'
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-slate-400" />
              )}
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">
                  {isUploading ? uploadStatusText : 'Drop your resume here or click to browse'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Upload PDF, DOCX, DOC, TXT, RTF, ODT, HTML, or Image (PNG, JPG, WEBP) · Max 10 MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.rtf,.odt,.html,.htm,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Or pick from library */}
          {resumeLibrary.length > 0 && !uploadedFile && !selectedStoredResume && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Or select from Resume Data</p>
              {resumeLibrary.slice(0, 3).map(r => (
                <button
                  key={r.id}
                  onClick={() => { setSelectedResumeId(r.id); setUploadedFile(null); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left"
                >
                  <FolderOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{r.fileName}</p>
                    <p className="text-[10px] text-slate-400">
                      {r.latestAtsScore ? `ATS: ${r.latestAtsScore}/100 · ` : ''}{r.extractedSkills?.length || 0} skills
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── STEP 2: Opportunity ── */}
      <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${step === 2 && hasResume ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${selectedOpportunityContext ? 'bg-emerald-500 text-white' : hasResume ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {selectedOpportunityContext ? <Check className="w-3.5 h-3.5" /> : '2'}
          </div>
          <span className="text-sm font-semibold text-slate-800">Select Target Opportunity</span>
          {selectedOpportunityContext ? (
            <span className="ml-auto text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
            </span>
          ) : (
            <span className="ml-auto text-xs text-amber-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Required for match analysis
            </span>
          )}
        </div>

        <div className="p-5 space-y-3">
          {selectedOpportunityContext ? (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedOpportunityContext.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {selectedOpportunityContext.companyName || (selectedOpportunityContext as any).company}
                      {selectedOpportunityContext.location ? ` · ${selectedOpportunityContext.location}` : ''}
                      {selectedOpportunityContext.package ? ` · ${selectedOpportunityContext.package}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowOpportunityPicker(p => !p)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => setSelectedOpportunityContext(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {selectedOpportunityContext.requiredSkills && selectedOpportunityContext.requiredSkills.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-blue-200/50">
                  <span className="text-[11px] font-semibold text-slate-600">Required Skills:</span>
                  {selectedOpportunityContext.requiredSkills.map(s => (
                    <span key={s.skill} className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-blue-700 border border-blue-200">
                      {s.skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Choose an opportunity to evaluate your resume against its required skills, tech stack, and responsibilities:
              </p>

              <div className="space-y-2">
                {jobs.map(job => (
                  <div
                    key={job.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{job.title}</span>
                        <span className="text-xs text-slate-500 font-medium">at {job.companyName || (job as any).company}</span>
                        {job.package && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {job.package}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap mt-1.5">
                        {job.requiredSkills.slice(0, 4).map(s => (
                          <span key={s.skill} className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            {s.skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 4 && (
                          <span className="text-[10px] text-slate-400">+{job.requiredSkills.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOpportunityContext(job)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shrink-0 shadow-2xs"
                    >
                      Select Opportunity
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* If picker toggled while an opportunity is selected, show dropdown list */}
          {showOpportunityPicker && selectedOpportunityContext && (
            <div className="mt-3 p-3 rounded-xl border border-blue-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-1 border-b border-slate-200">
                <span>Select a different opportunity:</span>
                <button onClick={() => setShowOpportunityPicker(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3.5 h-3.5" /></button>
              </div>
              {jobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => { setSelectedOpportunityContext(job); setShowOpportunityPicker(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 text-left transition-all"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{job.title}</p>
                    <p className="text-[10px] text-slate-500">{job.companyName || (job as any).company} · {job.requiredSkills?.length || 0} required skills</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600">Choose</span>
                </button>
              ))}
            </div>
          )}

          {/* Role selector fallback */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Benchmark Taxonomy Role</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            >
              {dbRoles.map(r => (
                <option key={r.roleId} value={r.roleName}>{r.roleName}</option>
              ))}
              {dbRoles.length === 0 && <option value={selectedRole}>{selectedRole}</option>}
            </select>
          </div>
        </div>
      </div>

      {/* ── STEP 3: Analyze button / Processing ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 bg-slate-50/60">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${isAnalyzing ? 'bg-blue-600 text-white animate-pulse' : canAnalyze ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '3'}
          </div>
          <span className="text-sm font-semibold text-slate-800">Analyze</span>
        </div>

        <div className="p-5">
          {isAnalyzing ? (
            /* Processing pipeline animation */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700 text-sm font-semibold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>AI Analysis in Progress</span>
              </div>
              <div className="space-y-2">
                {PIPELINE_STEPS.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 text-xs transition-all ${i < pipelineStep ? 'text-emerald-600' : i === pipelineStep ? 'text-blue-700 font-semibold' : 'text-slate-400'}`}>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${i < pipelineStep ? 'bg-emerald-100' : i === pipelineStep ? 'bg-blue-100 animate-pulse' : 'bg-slate-100'}`}>
                      {i < pipelineStep
                        ? <Check className="w-2.5 h-2.5 text-emerald-600" />
                        : i === pipelineStep
                          ? <Loader2 className="w-2.5 h-2.5 text-blue-600 animate-spin" />
                          : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                      }
                    </div>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary of what will be analyzed */}
              {hasResume && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span><span className="font-semibold text-slate-800">Resume:</span> {uploadedFile?.name || selectedStoredResume?.fileName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <span className="font-semibold text-slate-800">Target:</span>{' '}
                      {selectedOpportunityContext
                        ? `${selectedOpportunityContext.title} at ${selectedOpportunityContext.companyName || (selectedOpportunityContext as any).company || ''}`
                        : selectedRole
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <span className="font-semibold text-slate-800">Will produce:</span>{' '}
                      ATS / Resume Score + Opportunity Match Score + Skill Gap Analysis
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  canAnalyze
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {!hasResume
                  ? 'Upload Resume First'
                  : !hasOpportunity
                    ? 'Please select an opportunity before analyzing'
                    : `Analyze Resume for ${selectedOpportunityContext?.title}`}
                {canAnalyze && <ArrowRight className="w-4 h-4" />}
              </button>

            </div>
          )}
        </div>
      </div>

      {/* ── Recent analyses ── */}
      {resumeLibrary.some(r => r.analysesHistory && r.analysesHistory.length > 0) && !isAnalyzing && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Analyses
          </h3>
          <div className="space-y-2">
            {resumeLibrary
              .flatMap(r => (r.analysesHistory || []).map(h => ({ ...h, fileName: r.fileName })))
              .sort((a, b) => b.analyzedAt.localeCompare(a.analyzedAt))
              .slice(0, 5)
              .map(h => (
                <button
                  key={h.id}
                  onClick={() => onNavigate?.(`resume-analysis:${h.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-left"
                >
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{h.fileName}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {h.opportunityTitle} · {h.companyName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                      ATS {h.atsScore}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};
