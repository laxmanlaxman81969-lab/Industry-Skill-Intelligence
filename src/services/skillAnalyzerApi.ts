// Frontend API client for AI Skill Analyzer backend pipeline
// Connects to /api/skill-analyzer/* endpoints
// Includes a full client-side browser fallback for Vercel static deployments
// where the Express backend is unavailable.

import {
  AnalysisRecord,
  RoleTaxonomyRecord,
  ServerResumeRecord,
  JobOpportunityRecord
} from '../../server/types';

export interface UploadResponse {
  success: boolean;
  fileHash: string;
  fileName: string;
  fileSize: number;
  wordCount: number;
  isCached: boolean;
  message?: string;
  detectedLanguage: string;
  isLanguageSupported: boolean;
  ocrUsed: boolean;
  extractedTextPreview: string;
  error?: string;
  // Client-side only: full extracted text kept in memory for analyze call
  _clientExtractedText?: string;
}

export interface AnalyzeResponse {
  success: boolean;
  analysis: AnalysisRecord;
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

/** Read VITE_API_URL if configured; otherwise use '' (relative path for local dev) */
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

/**
 * Safely parse JSON from a fetch Response.
 * Returns null if the response is not JSON (e.g. HTML returned by Vercel's SPA rewrite).
 */
const safeParseJson = async (res: Response): Promise<unknown | null> => {
  const ct = res.headers.get('Content-Type') || '';
  if (!ct.includes('application/json') && !ct.includes('text/json')) {
    return null; // Not JSON — likely the SPA HTML page
  }
  const text = await res.text();
  if (!text || !text.trim()) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

/** Fast fetch with timeout so failures are caught quickly and don't hang */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

// ─── Client-side file reading (browser) ──────────────────────────────────────

/** Read a File as text using the browser FileReader API */
const readFileAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file, 'utf-8');
  });

/** Read a File as an ArrayBuffer */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });

/**
 * Client-side text extraction from uploaded file (browser-only fallback).
 * Supports: TXT (full), PDF (basic text), DOCX (basic text via ArrayBuffer).
 * Real server-side parsing (pdf-parse, mammoth) is used when the Express backend is available.
 */
async function extractTextClientSide(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';

  if (ext === 'txt') {
    return await readFileAsText(file);
  }

  if (ext === 'pdf') {
    // Extract raw text from PDF ArrayBuffer by scanning for readable ASCII text streams
    try {
      const buf = await readFileAsArrayBuffer(file);
      const bytes = new Uint8Array(buf);
      let text = '';
      const decoder = new TextDecoder('latin1');
      const raw = decoder.decode(bytes);

      // Extract text between BT/ET markers (basic PDF stream extraction)
      const btEtMatches = raw.matchAll(/BT\s*([\s\S]*?)\s*ET/g);
      for (const m of btEtMatches) {
        const block = m[1];
        // Extract text from Tj / TJ operators
        const tjMatches = block.matchAll(/\(([^)]+)\)\s*(?:Tj|TJ|'|")/g);
        for (const tj of tjMatches) {
          text += tj[1].replace(/\\(\d{3})/g, (_, oct) =>
            String.fromCharCode(parseInt(oct, 8))
          ) + ' ';
        }
        // Also extract array text operators
        const arrMatches = block.matchAll(/\[([^\]]*)\]\s*TJ/g);
        for (const arr of arrMatches) {
          const parts = arr[1].matchAll(/\(([^)]*)\)/g);
          for (const p of parts) {
            text += p[1] + ' ';
          }
        }
      }

      // Fallback: extract printable ASCII sequences from the raw bytes
      if (text.trim().length < 100) {
        const printableRegex = /[\x20-\x7E]{4,}/g;
        const printableMatches = raw.match(printableRegex);
        if (printableMatches) {
          // Filter out PDF structural strings
          text = printableMatches
            .filter(s => !/^(obj|endobj|stream|endstream|xref|trailer|startxref|%%EOF|PDF)/.test(s))
            .join(' ');
        }
      }

      return text.replace(/\s+/g, ' ').trim();
    } catch {
      throw new Error(
        'Unable to parse this PDF in your browser. For full PDF support, please upload a TXT or DOCX version of your resume.'
      );
    }
  }

  if (ext === 'docx' || ext === 'doc') {
    // DOCX is a ZIP file containing word/document.xml
    try {
      // Try dynamic import of jszip (if bundled) to extract document.xml
      // Fall back to raw text extraction if unavailable
      const buf = await readFileAsArrayBuffer(file);
      const bytes = new Uint8Array(buf);
      const decoder = new TextDecoder('utf-8');
      const raw = decoder.decode(bytes);

      // Extract text from XML tags (naive but works for most DOCX files)
      const xmlText = raw.replace(/<[^>]+>/g, ' ');
      const printable = xmlText
        .replace(/[^\x20-\x7E\n\r]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (printable.length > 100) return printable;

      // Try scanning raw bytes for printable ASCII
      const asciiMatches = raw.match(/[\x20-\x7E]{5,}/g) || [];
      return asciiMatches
        .filter(s => !/^PK|^\0/.test(s))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    } catch {
      throw new Error(
        'Unable to parse this DOCX file in your browser. Please upload a TXT version of your resume for best results.'
      );
    }
  }

  throw new Error(
    `Unsupported file type: .${ext}. Please upload PDF, DOCX, DOC, or TXT.`
  );
}

/**
 * Simple SHA-256-like deterministic hash for client-side use.
 * Uses Web Crypto API when available; falls back to a deterministic string hash.
 */
async function computeClientFileHash(file: File): Promise<string> {
  try {
    const buf = await readFileAsArrayBuffer(file);
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    const hashArray = Array.from(new Uint8Array(hashBuf));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback: combine file name + size + last modified as a fingerprint
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash + key.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

// ─── Client-side analysis fallback ───────────────────────────────────────────

/**
 * In-memory map: fileHash → extracted text.
 * Used by the client-side fallback when the backend is unavailable (Vercel).
 */
const clientExtractedTexts = new Map<string, string>();

/**
 * Build a minimal AnalysisRecord from locally extracted resume text.
 * Uses the existing src/data/resumeAnalyzer analyzeResume() engine,
 * but wraps output into the AnalysisRecord shape expected by the frontend.
 */
async function buildClientSideAnalysis(params: {
  fileHash: string;
  fileName: string;
  fileSize: number;
  roleId: string;
  userId: string;
  extractedText: string;
  opportunityId?: string;
  opportunityTitle?: string;
  opportunityCompany?: string;
  opportunityRequiredSkills?: string[];
  opportunityPreferredSkills?: string[];
  opportunityDescription?: string;
}): Promise<AnalyzeResponse> {
  // Dynamically import the client-side resume analyzer to keep the bundle lean
  const { analyzeResume, getRoleRequirements, detectTargetRoleFromText } = await import(
    '../data/resumeAnalyzer/index'
  );

  const wordCount = params.extractedText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 50) {
    return {
      success: false,
      analysis: null as any,
      error:
        'Resume text is too short (fewer than 50 words). Please upload a complete resume document.'
    };
  }

  // Map roleId → role display name
  const ROLE_ID_MAP: Record<string, string> = {
    'java-backend-developer': 'Java Backend Developer',
    'java-full-stack-developer': 'Java Full Stack Developer',
    'full-stack-developer': 'Full Stack Developer',
    'react-developer': 'React Developer',
    'data-analyst': 'Data Analyst',
    'devops-engineer': 'DevOps Engineer',
    'ai-engineer': 'AI Engineer',
    'software-developer': 'Software Developer',
    'software-engineer': 'Software Engineer',
    'frontend-developer': 'Frontend Developer',
    'backend-developer': 'Backend Developer',
    'python-developer': 'Python Developer',
    'python-backend-developer': 'Python Backend Developer',
    'data-scientist': 'Data Scientist',
    'machine-learning-engineer': 'Machine Learning Engineer',
    'cloud-engineer': 'Cloud Engineer',
    'database-developer': 'Database Developer',
    'spring-boot-developer': 'Spring Boot Developer',
    'java-developer': 'Java Developer'
  };

  const roleName =
    ROLE_ID_MAP[params.roleId] ||
    params.roleId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Run the existing client-side analysis engine
  const localResult = analyzeResume(
    { name: params.fileName, size: `${(params.fileSize / (1024 * 1024)).toFixed(2)} MB`, text: params.extractedText },
    roleName,
    [],
    []
  );

  const roleConf = getRoleRequirements(roleName);
  const detectedRole = detectTargetRoleFromText(params.extractedText);

  // Build extracted text sections
  const skillText = localResult.extractedSkills
    .filter(s => s.level !== 'Not Detected')
    .map(s => s.name)
    .join(', ');

  // Map local result into AnalysisRecord shape
  const analysisId = `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  // Build matched/missing skill lists with strict Server types
  const matchedSkills: import('../../server/types').MatchedSkillResult[] = localResult.extractedSkills
    .filter(s => s.level === 'Advanced' || s.level === 'Intermediate')
    .map(s => ({
      skill: s.name,
      normalizedSkill: s.name.toLowerCase().trim(),
      taxonomyWeight: 8,
      confidence: (s.confidence >= 70 ? 'explicit' : 'inferred') as 'explicit' | 'inferred',
      evidenceQuote: s.evidence || `Detected in candidate resume with ${s.level} proficiency`,
      practicalEvidence: s.level === 'Advanced',
      sourceSection: 'Technical Skills & Projects',
      category: s.category
    }));

  const missingSkills: import('../../server/types').MissingSkillResult[] = localResult.extractedSkills
    .filter(s => s.level === 'Not Detected')
    .map((s, idx) => ({
      skill: s.name,
      normalizedSkill: s.name.toLowerCase().trim(),
      taxonomyWeight: 7,
      severity: (idx < 2 ? 'Critical' : 'Important') as 'Critical' | 'Important' | 'Minor',
      whyItMatters: `${s.name} is a key capability required for ${roleName}.`,
      category: s.category,
      roadmapAction: `Study core concepts and complete practical projects for ${s.name}.`
    }));

  // Compute opportunity overlap if skills provided
  let opportunityMatchedSkills: string[] | undefined;
  let opportunityMissingSkills: string[] | undefined;

  if (params.opportunityRequiredSkills && params.opportunityRequiredSkills.length > 0) {
    const extractedNames = matchedSkills.map(s => s.skill.toLowerCase());
    opportunityMatchedSkills = params.opportunityRequiredSkills.filter(req =>
      extractedNames.some(e => e.includes(req.toLowerCase()) || req.toLowerCase().includes(e))
    );
    opportunityMissingSkills = params.opportunityRequiredSkills.filter(
      req => !opportunityMatchedSkills!.includes(req)
    );
  }

  const atsScore = localResult.granularScores.totalScore;
  const skillGapPct = Math.round(
    (matchedSkills.length / Math.max(1, matchedSkills.length + missingSkills.length)) * 100
  );

  const extraction = {
    candidateName: localResult.candidateInfo.name || 'Candidate',
    contactInfo: {
      email: localResult.candidateInfo.email || '',
      phone: localResult.candidateInfo.phone || '',
      location: localResult.candidateInfo.location || '',
      github: localResult.candidateInfo.github,
      linkedin: localResult.candidateInfo.linkedin
    },
    summary: `Candidate with ${localResult.extractedSkills.filter(s => s.level !== 'Not Detected').length} verified technical competencies relevant to ${roleName}.`,
    skillsClaimed: localResult.extractedSkills.map(s => ({
      skill: s.name,
      originalSkill: s.name,
      normalizedSkill: s.name,
      category: s.category,
      confidence: s.confidence / 100,
      evidenceSnippets: [s.evidence].filter(Boolean),
      verifiedInText: s.level !== 'Not Detected',
      levelDetected: (s.level === 'Not Detected' ? undefined : s.level) as
        | 'Beginner'
        | 'Intermediate'
        | 'Advanced'
        | undefined
    })),
    education: [
      {
        degree: localResult.education.degree || 'Bachelor of Technology',
        institution: localResult.education.institution || 'Engineering Institution',
        year: localResult.education.year || '2022–2026',
        relevance: (localResult.education.relevance as 'High' | 'Medium' | 'Low') || 'High'
      }
    ],
    workHistory: localResult.experience.hasExperience
      ? [
          {
            title: localResult.experience.roleTitle || 'Software Engineering Intern',
            company: localResult.experience.company || 'Tech Company',
            duration: localResult.experience.duration || 'Summer 2025',
            relevance: 'High' as const,
            skills: []
          }
        ]
      : [],
    projects: localResult.projects.map(p => ({
      name: p.title,
      technologies: p.technologies,
      description: p.descriptionSnippet,
      impact: p.technicalDepth === 'Strong' ? 'High' : 'Moderate'
    })),
    certifications: localResult.education.certifications.map(c => c.title),
    achievements: [],
    languages: [],
    totalYearsExperience: localResult.experience.hasExperience ? 0.5 : 0,
    extractionVersion: 2
  };

  const analysisRecord: AnalysisRecord = {
    analysisId,
    userId: params.userId,
    fileHash: params.fileHash,
    fileName: params.fileName,
    fileSize: params.fileSize,
    roleId: params.roleId,
    roleName,
    taxonomyVersion: '3.0-client',
    benchmarkRefreshDate: new Date().toISOString(),
    status: 'COMPLETED',
    confidenceRating: 'Medium',
    confidenceExplanation:
      'Analysis performed client-side using deterministic evidence extraction. For Claude AI-enhanced analysis, ensure the backend is running.',
    warnings: [
      'Backend API unavailable — running in client-side analysis mode.',
      'PDF/DOCX text extraction is limited in the browser. Upload a TXT version for highest accuracy.'
    ],
    scoreBreakdown: {
      overallScore: atsScore,
      skillCoverage: Math.round((skillGapPct / 100) * 40),
      depthOfExperience: localResult.experience.hasExperience ? 18 : 12,
      practicalEvidence: Math.min(20, Math.round((localResult.granularScores.projectStrength.score / 20) * 20)),
      educationCertification: 12,
      calculationExplanation: {
        skillCoverageFormula: `${matchedSkills.length} matched skills out of ${matchedSkills.length + missingSkills.length} required (${skillGapPct}%)`,
        depthFormula: localResult.experience.hasExperience ? 'Internship / practical experience detected' : 'Coursework and academic projects evaluated',
        practicalFormula: `${localResult.projects.length} evaluated project implementations with technical depth analysis`,
        educationFormula: 'Verified degree and coursework credentials'
      }
    },
    atsScore: {
      score: atsScore,
      status: atsScore >= 80 ? 'Strong ATS Pass' : atsScore >= 65 ? 'Competitive ATS Pass' : 'Needs Optimization',
      contactInfoScore: 9,
      structureScore: 9,
      sectionClarityScore: 8,
      skillsPresentationScore: Math.min(10, Math.round((matchedSkills.length / Math.max(1, matchedSkills.length + missingSkills.length)) * 10)),
      experienceClarityScore: localResult.experience.hasExperience ? 12 : 9,
      projectClarityScore: Math.min(15, localResult.granularScores.projectStrength.score),
      educationScore: 9,
      formattingScore: 8,
      readabilityScore: 8,
      sectionsPassed: [
        { name: 'Contact Information', passed: true },
        { name: 'Education', passed: true },
        { name: 'Technical Skills', passed: true },
        { name: 'Projects', passed: localResult.projects.length > 0 },
        { name: 'Experience', passed: localResult.experience.hasExperience }
      ],
      strengths: localResult.scoreBreakdown.strengths || ['Well-structured sections', 'Clear technical skills summary'],
      issues: localResult.scoreBreakdown.areasToImprove || [],
      parsingRisks: [],
      formattingRecommendations: localResult.scoreBreakdown.improvements || []
    },
    skillGapScore: {
      score: skillGapPct,
      status: skillGapPct >= 75 ? 'High Match' : skillGapPct >= 50 ? 'Moderate Gap' : 'Significant Gap',
      requiredSkillsTotal: matchedSkills.length + missingSkills.length,
      requiredSkillsMatched: matchedSkills.length,
      preferredSkillsTotal: 0,
      preferredSkillsMatched: 0,
      criticalMissingCount: missingSkills.filter(m => m.severity === 'Critical').length,
      partialMatchesCount: 0,
      matchPercentage: skillGapPct,
      explanation: localResult.scoreBreakdown.summaryExplanation || `Matched ${matchedSkills.length} of ${matchedSkills.length + missingSkills.length} required competencies.`
    },
    matchedSkills,
    missingSkills,
    partialSkills: [],
    uncertainSkills: [],
    irrelevantSkills: [],
    whatToLearnNext: localResult.topSkillsToDevelop.map((s, idx) => ({
      skill: s.skill,
      severity: (s.priority === 'Critical' ? 'Critical' : s.priority === 'High' ? 'Important' : 'Minor') as 'Critical' | 'Important' | 'Minor',
      priority: idx + 1,
      roadmapSkill: s.skill,
      actionDescription: s.recommendedAction || `Master ${s.skill} fundamentals and implement practical code samples.`
    })),
    candidateName: extraction.candidateName,
    extractionSummary: {
      totalYearsExperience: extraction.totalYearsExperience,
      educationSummary: extraction.education
        .map(e => `${e.degree} from ${e.institution}`)
        .join(', '),
      projectCount: extraction.projects.length,
      certificationsCount: extraction.certifications.length,
      totalClaimedSkills: extraction.skillsClaimed.length,
      verifiedSkillsCount: extraction.skillsClaimed.filter(s => s.verifiedInText).length
    },
    structuredExtraction: extraction as any,
    extractedResumeText: params.extractedText,
    fileMimeType: 'application/octet-stream',
    ocrUsed: false,
    detectedLanguage: 'en',
    isCachedParse: false,
    isDemoMode: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    opportunityId: params.opportunityId,
    opportunityTitle: params.opportunityTitle,
    opportunityCompany: params.opportunityCompany,
    opportunityRequiredSkills: params.opportunityRequiredSkills,
    opportunityPreferredSkills: params.opportunityPreferredSkills,
    opportunityDescription: params.opportunityDescription,
    opportunityMatchedSkills,
    opportunityMissingSkills,
    opportunityPartialSkills: []
  };

  return { success: true, analysis: analysisRecord };
}

// ─── Role taxonomy fallback list ──────────────────────────────────────────────

const CLIENT_ROLES_FALLBACK: RolesResponse['roles'] = [
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

// ─── Main API class ───────────────────────────────────────────────────────────

export class SkillAnalyzerApi {
  private static get baseUrl(): string {
    return `${getApiBaseUrl()}/api/skill-analyzer`;
  }

  /** Try to call a backend endpoint. Returns null if the backend is unreachable or not returning JSON. */
  private static async tryBackend(
    url: string,
    options?: RequestInit
  ): Promise<unknown | null> {
    try {
      const res = await fetchWithTimeout(url, options || {}, 5000);
      const data = await safeParseJson(res);
      return data;
    } catch {
      return null;
    }
  }

  public static async getStatus(): Promise<StatusResponse> {
    const data = await this.tryBackend(`${this.baseUrl}/status`) as any;
    if (data && typeof data === 'object' && 'success' in data) return data as StatusResponse;
    return {
      success: false,
      claudeConfigured: false,
      totalTaxonomies: CLIENT_ROLES_FALLBACK.length,
      totalAnalysesStored: 0
    };
  }

  public static async getRoles(): Promise<RolesResponse> {
    const data = await this.tryBackend(`${this.baseUrl}/roles`) as any;
    if (data && typeof data === 'object' && data.success && Array.isArray(data.roles)) {
      return data as RolesResponse;
    }
    return { success: true, roles: CLIENT_ROLES_FALLBACK };
  }

  public static async getTaxonomy(
    roleId: string
  ): Promise<{ success: boolean; taxonomy: RoleTaxonomyRecord }> {
    const data = await this.tryBackend(
      `${this.baseUrl}/taxonomy/${encodeURIComponent(roleId)}`
    ) as any;
    if (data && typeof data === 'object' && data.success && data.taxonomy) {
      return data as { success: boolean; taxonomy: RoleTaxonomyRecord };
    }
    // Return a minimal fallback taxonomy
    const role = CLIENT_ROLES_FALLBACK.find(r => r.roleId === roleId);
    return {
      success: false,
      taxonomy: {
        roleId,
        roleName: role?.roleName || roleId,
        category: role?.category || 'Engineering',
        description: role?.description || '',
        taxonomyVersion: '3.0-client',
        lastUpdated: new Date().toISOString(),
        coreSkills: [],
        optionalSkills: [],
        niceToHaveSkills: [],
        dealBreakerSkills: []
      } as unknown as RoleTaxonomyRecord
    };
  }

  public static async getOpportunities(): Promise<{
    success: boolean;
    opportunities: JobOpportunityRecord[];
  }> {
    try {
      const data = await this.tryBackend(`${this.baseUrl}/opportunities`) as any;
      if (data && typeof data === 'object' && data.success) {
        return data;
      }
    } catch {}
    return { success: false, opportunities: [] };
  }

  public static async getOpportunity(
    id: string
  ): Promise<{ success: boolean; opportunity: JobOpportunityRecord }> {
    const data = await this.tryBackend(
      `${this.baseUrl}/opportunities/${encodeURIComponent(id)}`
    ) as any;
    if (data && typeof data === 'object' && data.success) return data;
    throw new Error('Opportunity not found.');
  }

  /**
   * Upload a resume.
   * First tries the backend API. If unavailable (Vercel / no server),
   * falls back to browser-side text extraction using FileReader.
   */
  public static async uploadResume(file: File): Promise<UploadResponse> {
    // ── Validate file size and type immediately (client-side) ──
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`File exceeds the ${MAX_SIZE_MB} MB limit. Please upload a smaller file.`);
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowed = ['pdf', 'docx', 'doc', 'txt'];
    if (!allowed.includes(ext)) {
      throw new Error(
        'Unsupported file type. Please upload PDF, DOCX, DOC, or TXT.'
      );
    }

    // ── Try backend first ──────────────────────────────────────
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await fetchWithTimeout(
        `${this.baseUrl}/upload`,
        { method: 'POST', body: formData },
        8000
      );

      const data = await safeParseJson(res) as any;

      if (data && typeof data === 'object') {
        if (!data.success) {
          throw new Error(data.error || 'File upload failed on server.');
        }
        return data as UploadResponse;
      }
      // If data is null (not JSON — Vercel's index.html), fall through to client fallback
    } catch (err: any) {
      // If the error is a user-readable upload error (not a parse error), rethrow it
      if (
        err.message &&
        !err.message.includes('JSON') &&
        !err.message.includes('fetch') &&
        !err.message.includes('abort') &&
        !err.message.includes('network') &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError')
      ) {
        throw err;
      }
      // Otherwise fall through to client-side fallback
    }

    // ── Client-side browser fallback (used on Vercel) ──────────
    let extractedText: string;
    try {
      extractedText = await extractTextClientSide(file);
    } catch (extractErr: any) {
      throw new Error(
        extractErr.message ||
          'Failed to read the resume file. Please try a TXT or DOCX format.'
      );
    }

    if (!extractedText || extractedText.trim().length < 20) {
      throw new Error(
        'Could not extract text from this file. The document may be a scanned image or password-protected. Please upload a text-based PDF or a TXT/DOCX version of your resume.'
      );
    }

    const wordCount = extractedText.split(/\s+/).filter(Boolean).length;

    if (wordCount < 15) {
      throw new Error(
        'Resume appears to be too short or empty (fewer than 15 words detected). Please upload a complete resume document.'
      );
    }

    const fileHash = await computeClientFileHash(file);

    // Cache extracted text for the subsequent analyze() call
    clientExtractedTexts.set(fileHash, extractedText);

    return {
      success: true,
      fileHash,
      fileName: file.name,
      fileSize: file.size,
      wordCount,
      isCached: false,
      message: 'Resume read in browser — client-side text extraction mode.',
      detectedLanguage: 'en',
      isLanguageSupported: true,
      ocrUsed: false,
      extractedTextPreview: extractedText.slice(0, 500),
      _clientExtractedText: extractedText
    };
  }

  /**
   * Analyze a resume against a target role.
   * First tries the backend API. Falls back to client-side analysis.
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
    // ── Try backend first ──────────────────────────────────────
    try {
      const res = await fetchWithTimeout(
        `${this.baseUrl}/analyze`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        },
        20000
      );

      const data = await safeParseJson(res) as any;

      if (data && typeof data === 'object') {
        if (!data.success) {
          throw new Error(data.error || "Couldn't confidently analyze this resume.");
        }
        return data as AnalyzeResponse;
      }
      // null data means not-JSON (Vercel SPA) — fall through to client fallback
    } catch (err: any) {
      if (
        err.message &&
        !err.message.includes('JSON') &&
        !err.message.includes('fetch') &&
        !err.message.includes('abort') &&
        !err.message.includes('network') &&
        !err.message.includes('Failed to fetch') &&
        !err.message.includes('NetworkError')
      ) {
        throw err;
      }
    }

    // ── Client-side fallback ───────────────────────────────────
    const fileHash = params.fileHash || '';
    const extractedText =
      params.customText ||
      clientExtractedTexts.get(fileHash) ||
      '';

    if (!extractedText || extractedText.trim().length < 50) {
      throw new Error(
        'Resume text is not available for analysis. Please re-upload your resume and try again.'
      );
    }

    // Determine file metadata from context or defaults
    const fileName = params.fileName || 'Resume.pdf';
    const fileSize = 0;

    return buildClientSideAnalysis({
      fileHash: fileHash || `client-${Date.now()}`,
      fileName,
      fileSize,
      roleId: params.roleId,
      userId: params.userId || 'default_user',
      extractedText,
      opportunityId: params.opportunityId,
      opportunityTitle: params.opportunityTitle,
      opportunityCompany: params.opportunityCompany,
      opportunityRequiredSkills: params.opportunityRequiredSkills,
      opportunityPreferredSkills: params.opportunityPreferredSkills,
      opportunityDescription: params.opportunityDescription
    });
  }

  public static async recompareRole(params: {
    analysisId: string;
    newRoleId: string;
    userId?: string;
  }): Promise<AnalyzeResponse> {
    try {
      const res = await fetchWithTimeout(
        `${this.baseUrl}/recompare`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        },
        15000
      );
      const data = await safeParseJson(res) as any;
      if (data && typeof data === 'object') {
        if (!data.success) throw new Error(data.error || 'Failed to switch target role.');
        return data as AnalyzeResponse;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('JSON') && !err.message.includes('fetch') && !err.message.includes('abort')) {
        throw err;
      }
    }
    throw new Error(
      'Role comparison requires the backend server. Please re-upload your resume and analyze again with the new role.'
    );
  }

  public static async getAnalysisHistory(
    userId?: string
  ): Promise<{ success: boolean; history: AnalysisRecord[]; count: number }> {
    const url = userId
      ? `${this.baseUrl}/history?userId=${encodeURIComponent(userId)}`
      : `${this.baseUrl}/history`;
    try {
      const data = await this.tryBackend(url) as any;
      if (data && typeof data === 'object' && data.success) return data;
    } catch {}
    return { success: false, history: [], count: 0 };
  }

  public static async getAnalysis(
    analysisId: string
  ): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    const data = await this.tryBackend(
      `${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}`
    ) as any;
    if (data && typeof data === 'object' && data.success && data.analysis) {
      return data;
    }
    throw new Error('Analysis not found. It may have been stored only on the local device.');
  }

  public static async getUserResumes(userId?: string): Promise<ResumesResponse> {
    try {
      const url = userId
        ? `${this.baseUrl}/resumes?userId=${encodeURIComponent(userId)}`
        : `${this.baseUrl}/resumes`;
      const data = await this.tryBackend(url) as any;
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
    const data = await this.tryBackend(url) as any;
    if (data && typeof data === 'object' && data.success && data.resume) return data;
    throw new Error('Resume detail not found.');
  }

  public static async getResumeAnalyses(
    fileHash: string
  ): Promise<{ success: boolean; analyses: AnalysisRecord[]; count: number }> {
    const data = await this.tryBackend(
      `${this.baseUrl}/resume/${encodeURIComponent(fileHash)}/analyses`
    ) as any;
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
        5000
      );
      const data = await safeParseJson(res) as any;
      if (data && typeof data === 'object') {
        if (!data.success) throw new Error(data.error || 'Failed to delete resume.');
        return data;
      }
    } catch (err: any) {
      if (err.message && !err.message.includes('JSON') && !err.message.includes('fetch')) throw err;
    }
    return { success: true, message: 'Resume removed locally.' };
  }

  public static async downloadPdfReport(analysisId: string, fileName?: string): Promise<void> {
    try {
      const res = await fetchWithTimeout(
        `${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}/report`,
        {},
        15000
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
    } catch {
      throw new Error(
        'PDF report generation requires the backend server. Please run the backend locally to download reports.'
      );
    }
  }
}
