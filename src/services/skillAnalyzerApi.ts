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
  extractedText?: string;
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

export interface ParsedApiResponse<T = any> {
  data: T | null;
  isJson: boolean;
  status: number;
  statusText: string;
  rawText?: string;
  error?: string;
}

const safeParseJson = async <T = any>(res: Response): Promise<ParsedApiResponse<T>> => {
  const ct = res.headers.get('Content-Type') || '';
  const isJson = ct.includes('application/json') || ct.includes('text/json');
  let rawText = '';
  try {
    rawText = await res.text();
  } catch {
    rawText = '';
  }

  if (!isJson) {
    return {
      data: null,
      isJson: false,
      status: res.status,
      statusText: res.statusText,
      rawText,
      error: `Server returned non-JSON content (${ct || 'unknown'}). Status: ${res.status}`
    };
  }

  if (!rawText || !rawText.trim()) {
    return {
      data: null,
      isJson: false,
      status: res.status,
      statusText: res.statusText,
      rawText,
      error: `Server returned empty response. Status: ${res.status}`
    };
  }

  try {
    const parsed = JSON.parse(rawText);
    return {
      data: parsed as T,
      isJson: true,
      status: res.status,
      statusText: res.statusText,
      rawText
    };
  } catch {
    return {
      data: null,
      isJson: false,
      status: res.status,
      statusText: res.statusText,
      rawText,
      error: `Failed to parse JSON response. Status: ${res.status}`
    };
  }
};

const handleApiError = (parsed: ParsedApiResponse, defaultMsg: string): never => {
  if (parsed.status === 404) {
    throw new Error(`Resume service endpoint not found (HTTP 404). Check API configuration.`);
  }
  if (parsed.status === 401 || parsed.status === 403) {
    throw new Error('Your session has expired. Please sign in again.');
  }
  if (parsed.status === 413) {
    throw new Error('File exceeds upload limit (HTTP 413). Please upload a smaller file under 10 MB.');
  }
  if (parsed.status === 415) {
    throw new Error('Unsupported document format (HTTP 415). Please upload PDF, DOCX, DOC, TXT, RTF, ODT, HTML, or an image resume.');
  }
  if (parsed.data && typeof parsed.data === 'object' && (parsed.data as any).error) {
    throw new Error((parsed.data as any).error);
  }
  if (!parsed.isJson) {
    const cleanSnippet = (parsed.rawText || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 150);
    const detail = cleanSnippet ? `: ${cleanSnippet}` : '';
    throw new Error(`Unexpected server response (HTTP ${parsed.status} ${parsed.statusText || 'Error'})${detail}`);
  }
  throw new Error(defaultMsg);
};

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 45000
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
   * Diagnostic health check to verify backend reachability.
   */
  public static async checkHealth(): Promise<{ status: string; service: string; timestamp?: string }> {
    try {
      const res = await fetchWithTimeout(`${getApiBaseUrl()}/api/health`, {}, 5000);
      const parsed = await safeParseJson(res);
      if (parsed.isJson && parsed.data && parsed.data.status === 'ok') {
        return parsed.data;
      }
      throw new Error(`Health check returned status ${res.status}`);
    } catch (err: any) {
      throw new Error('Resume processing service is unavailable.');
    }
  }

  /**
   * Health check to verify backend reachability and configuration.
   */
  public static async getStatus(): Promise<StatusResponse> {
    try {
      const res = await fetchWithTimeout(`${this.baseUrl}/status`, {}, 4000);
      const parsed = await safeParseJson<StatusResponse>(res);
      if (parsed.isJson && parsed.data && 'success' in parsed.data) {
        return parsed.data;
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
      const parsed = await safeParseJson<RolesResponse>(res);
      if (parsed.isJson && parsed.data && parsed.data.success && Array.isArray(parsed.data.roles)) {
        return parsed.data;
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
      const parsed = await safeParseJson<{ success: boolean; taxonomy: RoleTaxonomyRecord }>(res);
      if (parsed.isJson && parsed.data && parsed.data.success && parsed.data.taxonomy) {
        return parsed.data;
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
      const parsed = await safeParseJson<{ success: boolean; opportunities: JobOpportunityRecord[] }>(res);
      if (parsed.isJson && parsed.data && parsed.data.success) {
        return parsed.data;
      }
    } catch {}
    return { success: false, opportunities: [] };
  }

  public static async getOpportunity(
    id: string
  ): Promise<{ success: boolean; opportunity: JobOpportunityRecord }> {
    const res = await fetchWithTimeout(`${this.baseUrl}/opportunities/${encodeURIComponent(id)}`, {}, 5000);
    const parsed = await safeParseJson<{ success: boolean; opportunity: JobOpportunityRecord }>(res);
    if (parsed.isJson && parsed.data && parsed.data.success) return parsed.data;
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
      throw new Error('Resume processing service is unavailable.');
    }

    const parsed = await safeParseJson<UploadResponse>(res);
    if (!parsed.isJson || !parsed.data) {
      return handleApiError(parsed, 'Resume processing service is unavailable.');
    }

    if (!res.ok || !parsed.data.success) {
      throw new Error(parsed.data.error || parsed.data.message || 'File parsing failed. Please check the document format.');
    }

    return parsed.data;
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
    extractedText?: string;
    detectedSections?: Record<string, string | undefined>;
    fileSize?: number;
    fileMimeType?: string;
    extractionMethod?: string;
    ocrUsed?: boolean;
    ocrConfidence?: number;
    extractionQuality?: 'High' | 'Medium' | 'Low';
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
      throw new Error('Resume processing service is unavailable.');
    }

    const parsed = await safeParseJson<AnalyzeResponse>(res);
    if (!parsed.isJson || !parsed.data) {
      return handleApiError(parsed, 'Resume processing service is unavailable.');
    }

    if (!res.ok || !parsed.data.success) {
      throw new Error(parsed.data.error || "Couldn't confidently analyze this resume. Please try again.");
    }

    return parsed.data;
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
      throw new Error('Resume processing service is unavailable.');
    }

    const parsed = await safeParseJson<AnalyzeResponse>(res);
    if (!parsed.isJson || !parsed.data) {
      return handleApiError(parsed, 'Resume processing service is unavailable.');
    }

    if (!res.ok || !parsed.data.success) {
      throw new Error(parsed.data.error || 'Unable to access or parse this resume URL.');
    }

    return parsed.data;
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
    } catch {
      throw new Error('Resume processing service is unavailable.');
    }

    const parsed = await safeParseJson<AnalyzeResponse>(res);
    if (!parsed.isJson || !parsed.data) {
      return handleApiError(parsed, 'Resume processing service is unavailable.');
    }

    if (!res.ok || !parsed.data.success) {
      throw new Error(parsed.data.error || 'Failed to switch target role.');
    }

    return parsed.data;
  }

  public static async getAnalysisHistory(
    userId?: string
  ): Promise<{ success: boolean; history: AnalysisRecord[]; count: number }> {
    const url = userId
      ? `${this.baseUrl}/history?userId=${encodeURIComponent(userId)}`
      : `${this.baseUrl}/history`;
    try {
      const res = await fetchWithTimeout(url, {}, 8000);
      const parsed = await safeParseJson<{ success: boolean; history: AnalysisRecord[]; count: number }>(res);
      if (parsed.isJson && parsed.data && parsed.data.success) return parsed.data;
    } catch {}
    return { success: false, history: [], count: 0 };
  }

  public static async getAnalysis(
    analysisId: string
  ): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    const res = await fetchWithTimeout(`${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}`, {}, 8000);
    const parsed = await safeParseJson<{ success: boolean; analysis: AnalysisRecord }>(res);
    if (parsed.isJson && parsed.data && parsed.data.success && parsed.data.analysis) {
      return parsed.data;
    }
    throw new Error('Failed to load the saved analysis.');
  }

  public static async getUserResumes(userId?: string): Promise<ResumesResponse> {
    try {
      const url = userId
        ? `${this.baseUrl}/resumes?userId=${encodeURIComponent(userId)}`
        : `${this.baseUrl}/resumes`;
      const res = await fetchWithTimeout(url, {}, 8000);
      const parsed = await safeParseJson<ResumesResponse>(res);
      if (parsed.isJson && parsed.data && parsed.data.success) return parsed.data;
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
    const parsed = await safeParseJson<ResumeDetailResponse>(res);
    if (parsed.isJson && parsed.data && parsed.data.success && parsed.data.resume) return parsed.data;
    throw new Error('Failed to load resume detail.');
  }

  public static async getResumeAnalyses(
    fileHash: string
  ): Promise<{ success: boolean; analyses: AnalysisRecord[]; count: number }> {
    const res = await fetchWithTimeout(`${this.baseUrl}/resume/${encodeURIComponent(fileHash)}/analyses`, {}, 8000);
    const parsed = await safeParseJson<{ success: boolean; analyses: AnalysisRecord[]; count: number }>(res);
    if (parsed.isJson && parsed.data && parsed.data.success) return parsed.data;
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
      const parsed = await safeParseJson<{ success: boolean; message?: string; error?: string }>(res);
      if (parsed.isJson && parsed.data) {
        if (!parsed.data.success) throw new Error(parsed.data.error || 'Failed to delete resume.');
        return parsed.data;
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
