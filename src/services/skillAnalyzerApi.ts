// Frontend API client for AI Skill Analyzer backend pipeline
// Connects to /api/skill-analyzer/* and /api/resume/* endpoints
// Implements real backend-first resume ingestion with universal format and URL support

import {
  AnalysisRecord,
  RoleTaxonomyRecord,
  ServerResumeRecord,
  JobOpportunityRecord
} from '../../server/types';

export interface UploadResponse {
  success: boolean;
  source?: {
    type: 'file' | 'url';
    fileName?: string;
    mimeType?: string;
    url?: string;
  };
  fileHash: string;
  fileName: string;
  fileSize: number;
  wordCount: number;
  isCached: boolean;
  message?: string;
  detectedLanguage: string;
  isLanguageSupported: boolean;
  ocrUsed: boolean;
  ocrConfidence?: number;
  extractionMethod?: string;
  extractionQuality?: 'High' | 'Medium' | 'Low';
  detectedSections?: Record<string, string | undefined>;
  extractedTextPreview: string;
  error?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: AnalysisRecord;
  source?: {
    type: 'file' | 'url';
    fileName?: string;
    url?: string;
  };
  error?: string;
}

export interface RolesResponse {
  success: boolean;
  roles: {
    roleId: string;
    roleName: string;
    category: string;
    description: string;
    taxonomyVersion: string;
    lastUpdated: string;
    coreSkillCount: number;
  }[];
}

export interface StatusResponse {
  success: boolean;
  claudeConfigured: boolean;
  totalTaxonomies: number;
  totalAnalysesStored: number;
}

export interface ResumesResponse {
  success: boolean;
  resumes: ServerResumeRecord[];
  count: number;
}

export interface ResumeDetailResponse {
  success: boolean;
  resume: ServerResumeRecord;
  analyses: AnalysisRecord[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getApiBaseUrl = (): string => {
  try {
    const envUrl = (
      typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
        ? String(import.meta.env.VITE_API_URL)
        : ''
    ).trim();
    return envUrl ? envUrl.replace(/\/+$/, '') : '';
  } catch {
    return '';
  }
};

const safeParseJson = async (res: Response): Promise<any | null> => {
  const ct = res.headers.get('Content-Type') || '';
  if (!ct.includes('application/json') && !ct.includes('text/json')) {
    return null;
  }
  const text = await res.text();
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 30000
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export const SUPPORTED_EXTENSIONS = [
  'pdf',
  'docx',
  'doc',
  'txt',
  'rtf',
  'odt',
  'html',
  'htm',
  'png',
  'jpg',
  'jpeg',
  'webp'
];

export const SUPPORTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/vnd.oasis.opendocument.text',
  'application/rtf',
  'text/rtf',
  'text/html',
  'text/plain',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp'
];

// Fallback roles for display when backend is initializing
const DEFAULT_ROLES: RolesResponse['roles'] = [
  { roleId: 'java-backend-developer', roleName: 'Java Backend Developer', category: 'Java Ecosystem', description: 'Enterprise Java, Spring Boot, REST APIs, SQL, JPA', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 10 },
  { roleId: 'java-full-stack-developer', roleName: 'Java Full Stack Developer', category: 'Java Ecosystem', description: 'Java + Spring Boot + React.js full stack', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 8 },
  { roleId: 'full-stack-developer', roleName: 'Full Stack Developer', category: 'Full Stack', description: 'JS/TS, React, Node.js, REST APIs, SQL', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 7 },
  { roleId: 'react-developer', roleName: 'React Developer', category: 'Frontend & UI', description: 'React.js, TypeScript, Redux, Tailwind', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'data-analyst', roleName: 'Data Analyst', category: 'Data & Analytics', description: 'SQL, Python, Power BI, Tableau, Excel', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 5 },
  { roleId: 'devops-engineer', roleName: 'DevOps Engineer', category: 'Cloud & Infrastructure', description: 'Docker, Kubernetes, CI/CD, Terraform, Linux', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 5 },
  { roleId: 'ai-engineer', roleName: 'AI Engineer', category: 'Data & AI', description: 'LLMs, RAG, LangChain, Python, Embeddings', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 4 },
  { roleId: 'software-developer', roleName: 'Software Developer', category: 'Software Engineering', description: 'Programming fundamentals, DSA, APIs, Git', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'software-engineer', roleName: 'Software Engineer', category: 'Software Engineering', description: 'OOP, DSA, System Design, Testing, Git', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'frontend-developer', roleName: 'Frontend Developer', category: 'Frontend & UI', description: 'HTML, CSS, JavaScript, React, Accessibility', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'backend-developer', roleName: 'Backend Developer', category: 'Backend', description: 'REST APIs, SQL, Auth, Caching, Testing', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'python-developer', roleName: 'Python Developer', category: 'Python Ecosystem', description: 'Python, OOP, APIs, Testing, SQL', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 5 },
  { roleId: 'python-backend-developer', roleName: 'Python Backend Developer', category: 'Python Ecosystem', description: 'FastAPI, Django, PostgreSQL, Async, Docker', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 5 },
  { roleId: 'data-scientist', roleName: 'Data Scientist', category: 'Data & AI', description: 'Python, ML, Statistics, SQL, Visualization', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'machine-learning-engineer', roleName: 'Machine Learning Engineer', category: 'Data & AI', description: 'Scikit-learn, PyTorch, MLOps, Pipelines', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'cloud-engineer', roleName: 'Cloud Engineer', category: 'Cloud & Infrastructure', description: 'AWS/Azure/GCP, IAM, Networking, Kubernetes', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'database-developer', roleName: 'Database Developer', category: 'Data & Analytics', description: 'SQL, Normalization, Indexes, Stored Procedures', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 6 },
  { roleId: 'spring-boot-developer', roleName: 'Spring Boot Developer', category: 'Java Ecosystem', description: 'Spring IoC, REST, JPA, Security, Testing', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 7 },
  { roleId: 'java-developer', roleName: 'Java Developer', category: 'Java Ecosystem', description: 'Core Java, Collections, OOP, Streams, JVM', taxonomyVersion: '3.0', lastUpdated: '2026-09-01', coreSkillCount: 7 }
];

// ─── Main API Class ──────────────────────────────────────────────────────────

export class SkillAnalyzerApi {
  private static get baseUrl(): string {
    return `${getApiBaseUrl()}/api/skill-analyzer`;
  }

  /**
   * Health check to verify backend reachability.
   */
  public static async getStatus(): Promise<StatusResponse> {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/status`, {}, 4000);
      const data = await safeParseJson(res);
      if (data && typeof data === 'object' && 'success' in data) {
        return data as StatusResponse;
      }
    } catch {}
    return {
      success: false,
      claudeConfigured: false,
      totalTaxonomies: DEFAULT_ROLES.length,
      totalAnalysesStored: 0
    };
  }

  /**
   * Fetch benchmark roles for taxonomy selection.
   */
  public static async getRoles(): Promise<RolesResponse> {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/roles`, {}, 5000);
      const data = await safeParseJson(res);
      if (data && typeof data === 'object' && data.success && Array.isArray(data.roles)) {
        return data as RolesResponse;
      }
    } catch {}
    return { success: true, roles: DEFAULT_ROLES };
  }

  /**
   * Fetch specific role taxonomy.
   */
  public static async getTaxonomy(
    roleId: string
  ): Promise<{ success: boolean; taxonomy: RoleTaxonomyRecord }> {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/taxonomy/${encodeURIComponent(roleId)}`, {}, 5000);
      const data = await safeParseJson(res);
      if (data && typeof data === 'object' && data.success && data.taxonomy) {
        return data;
      }
    } catch {}

    const role = DEFAULT_ROLES.find(r => r.roleId === roleId);
    return {
      success: false,
      taxonomy: {
        roleId,
        roleName: role?.roleName || roleId,
        category: role?.category || 'Engineering',
        description: role?.description || '',
        taxonomyVersion: '3.0',
        lastUpdated: new Date().toISOString(),
        coreSkills: [],
        niceToHaveSkills: [],
        senioritySignals: [],
        criticalKeywords: [],
        defaultRoadmap: [],
        active: true
      } as unknown as RoleTaxonomyRecord
    };
  }

  public static async getOpportunities(): Promise<{
    success: boolean;
    opportunities: JobOpportunityRecord[];
  }> {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/opportunities`, {}, 5000);
      const data = await safeParseJson(res);
      if (data && typeof data === 'object' && data.success) {
        return data;
      }
    } catch {}
    return { success: false, opportunities: [] };
  }

  public static async getOpportunity(
    id: string
  ): Promise<{ success: boolean; opportunity: JobOpportunityRecord }> {
    const res = await fetchWithTimeout(`${this.baseUrl}/opportunities/${encodeURIComponent(id)}`, {}, 5000);
    const data = await safeParseJson(res);
    if (data && typeof data === 'object' && data.success) return data;
    throw new Error('Opportunity not found.');
  }

  /**
   * Uploads and parses a resume file using the backend ingestion pipeline.
   * Supports PDF (with OCR fallback), DOCX, DOC, TXT, RTF, ODT, HTML, PNG, JPG, JPEG, WEBP.
   */
  public static async uploadResume(file: File): Promise<UploadResponse> {
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('File exceeds the 10 MB limit. Please upload a smaller file.');
    }

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext)) {
      throw new Error(
        'This file format is not supported. Please upload PDF, DOCX, DOC, TXT, RTF, ODT, HTML, or an image resume (PNG, JPG, WEBP).'
      );
    }

    const formData = new FormData();
    formData.append('resume', file);

    let res: Response;
    try {
      res = await fetchWithTimeout(`${this.baseUrl}/upload`, {
        method: 'POST',
        body: formData
      }, 45000); // 45s for heavy OCR scans
    } catch (netErr: any) {
      console.error('[API: uploadResume] Network error:', netErr);
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    const data = await safeParseJson(res);
    if (!data || typeof data !== 'object') {
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'File parsing failed. Please check the document format.');
    }

    return data as UploadResponse;
  }

  /**
   * Analyzes an uploaded resume against a target role and opportunity context.
   */
  public static async analyzeResume(params: {
    fileHash?: string;
    roleId: string;
    userId?: string;
    customText?: string;
    fileName?: string;
    isDemoMode?: boolean;
    opportunityId?: string;
    opportunityTitle?: string;
    opportunityCompany?: string;
    opportunityRequiredSkills?: string[];
    opportunityPreferredSkills?: string[];
    opportunityDescription?: string;
  }): Promise<AnalyzeResponse> {
    let res: Response;
    try {
      res = await fetchWithTimeout(
        `${this.baseUrl}/analyze`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        },
        45000
      );
    } catch (netErr: any) {
      console.error('[API: analyzeResume] Network error:', netErr);
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    const data = await safeParseJson(res);
    if (!data || typeof data !== 'object') {
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Couldn't confidently analyze this resume. Please try again.");
    }

    return data as AnalyzeResponse;
  }

  /**
   * Ingests and analyzes a resume directly from a public URL.
   */
  public static async analyzeUrl(params: {
    url: string;
    roleId: string;
    userId?: string;
    isDemoMode?: boolean;
    opportunityId?: string;
    opportunityTitle?: string;
    opportunityCompany?: string;
    opportunityRequiredSkills?: string[];
    opportunityPreferredSkills?: string[];
    opportunityDescription?: string;
  }): Promise<AnalyzeResponse> {
    const trimmed = (params.url || '').trim();
    if (!trimmed) {
      throw new Error('Please provide a valid resume URL.');
    }

    let res: Response;
    try {
      res = await fetchWithTimeout(
        `${this.baseUrl}/analyze-url`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...params, url: trimmed })
        },
        45000
      );
    } catch (netErr: any) {
      console.error('[API: analyzeUrl] Network error:', netErr);
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    const data = await safeParseJson(res);
    if (!data || typeof data !== 'object') {
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Unable to access or parse this resume URL.');
    }

    return data as AnalyzeResponse;
  }

  /**
   * Fast role switching using cached resume extraction.
   */
  public static async recompareRole(params: {
    analysisId: string;
    newRoleId: string;
    userId?: string;
  }): Promise<AnalyzeResponse> {
    let res: Response;
    try {
      res = await fetchWithTimeout(
        `${this.baseUrl}/recompare`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        },
        20000
      );
    } catch (netErr: any) {
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    const data = await safeParseJson(res);
    if (!data || typeof data !== 'object') {
      throw new Error('Resume processing service is temporarily unavailable. Please try again.');
    }

    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to switch target role.');
    }

    return data as AnalyzeResponse;
  }

  public static async getAnalysisHistory(
    userId?: string
  ): Promise<{ success: boolean; history: AnalysisRecord[]; count: number }> {
    const url = userId
      ? `${this.baseUrl}/history?userId=${encodeURIComponent(userId)}`
      : `${this.baseUrl}/history`;
    try {
      const res = await fetchWithTimeout(url, {}, 8000);
      const data = await safeParseJson(res);
      if (data && typeof data === 'object' && data.success) return data;
    } catch {}
    return { success: false, history: [], count: 0 };
  }

  public static async getAnalysis(
    analysisId: string
  ): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    const res = await fetchWithTimeout(`${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}`, {}, 8000);
    const data = await safeParseJson(res);
    if (data && typeof data === 'object' && data.success && data.analysis) {
      return data;
    }
    throw new Error('Failed to load the saved analysis.');
  }

  public static async getUserResumes(userId?: string): Promise<ResumesResponse> {
    try {
      const url = userId
        ? `${this.baseUrl}/resumes?userId=${encodeURIComponent(userId)}`
        : `${this.baseUrl}/resumes`;
      const res = await fetchWithTimeout(url, {}, 8000);
      const data = await safeParseJson(res);
      if (data && typeof data === 'object' && data.success) return data;
    } catch {}
    return { success: false, resumes: [], count: 0 };
  }

  public static async getResumeDetail(
    fileHash: string,
    userId?: string
  ): Promise<ResumeDetailResponse> {
    const url = userId
      ? `${this.baseUrl}/resume/${encodeURIComponent(fileHash)}?userId=${encodeURIComponent(userId)}`
      : `${this.baseUrl}/resume/${encodeURIComponent(fileHash)}`;
    const res = await fetchWithTimeout(url, {}, 8000);
    const data = await safeParseJson(res);
    if (data && typeof data === 'object' && data.success && data.resume) return data;
    throw new Error('Failed to load resume detail.');
  }

  public static async getResumeAnalyses(
    fileHash: string
  ): Promise<{ success: boolean; analyses: AnalysisRecord[]; count: number }> {
    const res = await fetchWithTimeout(`${this.baseUrl}/resume/${encodeURIComponent(fileHash)}/analyses`, {}, 8000);
    const data = await safeParseJson(res);
    if (data && typeof data === 'object' && data.success) return data;
    return { success: false, analyses: [], count: 0 };
  }

  public static async deleteResume(
    resumeId: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetchWithTimeout(
        `${this.baseUrl}/resume/${encodeURIComponent(resumeId)}`,
        { method: 'DELETE' },
        8000
      );
      const data = await safeParseJson(res);
      if (data && typeof data === 'object') {
        if (!data.success) throw new Error(data.error || 'Failed to delete resume.');
        return data;
      }
    } catch (err: any) {
      throw err;
    }
    return { success: true, message: 'Resume record deleted.' };
  }

  public static async downloadPdfReport(analysisId: string, fileName?: string): Promise<void> {
    const res = await fetchWithTimeout(
      `${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}/report`,
      {},
      20000
    );
    if (!res.ok) throw new Error('Failed to generate PDF report.');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `Skill_Analysis_Report_${analysisId.slice(-6)}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
