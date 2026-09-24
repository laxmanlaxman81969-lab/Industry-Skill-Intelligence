// Frontend API client for AI Skill Analyzer backend pipeline
// Connects to /api/skill-analyzer/* endpoints

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

export class SkillAnalyzerApi {
  private static baseUrl = '/api/skill-analyzer';

  public static async getStatus(): Promise<StatusResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return {
        success: false,
        claudeConfigured: false,
        totalTaxonomies: 28,
        totalAnalysesStored: 0
      };
    }
  }

  public static async getRoles(): Promise<RolesResponse> {
    const res = await fetch(`${this.baseUrl}/roles`);
    if (!res.ok) throw new Error('Failed to load role skill taxonomies.');
    return await res.json();
  }

  public static async getTaxonomy(roleId: string): Promise<{ success: boolean; taxonomy: RoleTaxonomyRecord }> {
    const res = await fetch(`${this.baseUrl}/taxonomy/${encodeURIComponent(roleId)}`);
    if (!res.ok) throw new Error('Failed to load taxonomy.');
    return await res.json();
  }

  public static async getOpportunities(): Promise<{ success: boolean; opportunities: JobOpportunityRecord[] }> {
    try {
      const res = await fetch(`${this.baseUrl}/opportunities`);
      if (!res.ok) throw new Error('Failed to load opportunities.');
      return await res.json();
    } catch {
      return { success: false, opportunities: [] };
    }
  }

  public static async getOpportunity(id: string): Promise<{ success: boolean; opportunity: JobOpportunityRecord }> {
    const res = await fetch(`${this.baseUrl}/opportunities/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to load opportunity.');
    return await res.json();
  }

  public static async uploadResume(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'File upload failed.');
    }
    return data;
  }

  public static async analyzeResume(params: {
    fileHash?: string;
    roleId: string;
    userId?: string;
    customText?: string;
    fileName?: string;
    isDemoMode?: boolean;
    // Opportunity context
    opportunityId?: string;
    opportunityTitle?: string;
    opportunityCompany?: string;
    opportunityRequiredSkills?: string[];
    opportunityPreferredSkills?: string[];
    opportunityDescription?: string;
  }): Promise<AnalyzeResponse> {
    const res = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Couldn't confidently analyze this resume.");
    }
    return data;
  }

  public static async recompareRole(params: {
    analysisId: string;
    newRoleId: string;
    userId?: string;
  }): Promise<AnalyzeResponse> {
    const res = await fetch(`${this.baseUrl}/recompare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to switch target role.');
    }
    return data;
  }

  public static async getAnalysisHistory(userId?: string): Promise<{ success: boolean; history: AnalysisRecord[]; count: number }> {
    const url = userId
      ? `${this.baseUrl}/history?userId=${encodeURIComponent(userId)}`
      : `${this.baseUrl}/history`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch analysis history.');
    return await res.json();
  }

  public static async getAnalysis(analysisId: string): Promise<{ success: boolean; analysis: AnalysisRecord }> {
    const res = await fetch(`${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load the saved analysis.');
    }
    return data;
  }

  // Get all server-persisted resumes for a user
  public static async getUserResumes(userId?: string): Promise<ResumesResponse> {
    try {
      const url = userId
        ? `${this.baseUrl}/resumes?userId=${encodeURIComponent(userId)}`
        : `${this.baseUrl}/resumes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load resumes.');
      return await res.json();
    } catch {
      return { success: false, resumes: [], count: 0 };
    }
  }

  // Get a single resume record + all its analyses
  public static async getResumeDetail(fileHash: string, userId?: string): Promise<ResumeDetailResponse> {
    const url = userId
      ? `${this.baseUrl}/resume/${encodeURIComponent(fileHash)}?userId=${encodeURIComponent(userId)}`
      : `${this.baseUrl}/resume/${encodeURIComponent(fileHash)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to load resume detail.');
    }
    return data;
  }

  // Get just the analyses for a resume
  public static async getResumeAnalyses(fileHash: string): Promise<{ success: boolean; analyses: AnalysisRecord[]; count: number }> {
    const res = await fetch(`${this.baseUrl}/resume/${encodeURIComponent(fileHash)}/analyses`);
    if (!res.ok) throw new Error('Failed to load resume analyses.');
    return await res.json();
  }

  // Delete a resume record
  public static async deleteResume(resumeId: string): Promise<{ success: boolean; message?: string }> {
    const res = await fetch(`${this.baseUrl}/resume/${encodeURIComponent(resumeId)}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete resume.');
    return data;
  }

  public static async downloadPdfReport(analysisId: string, fileName?: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/analysis/${encodeURIComponent(analysisId)}/report`);
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
