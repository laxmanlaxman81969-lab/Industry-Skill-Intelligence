import { TechnologyRoadmap, UserRoadmapProgress } from '../../server/roadmapTypes';
import { getProgressSummary, getRoadmapBySlug, getRoadmaps } from '../../server/services/roadmapService';
import { SKILL_CATALOG, SkillCatalogEntry } from '../data/skillCatalog';

export interface RoadmapSummary extends Omit<TechnologyRoadmap, 'modules'> {
  modules?: undefined;
  moduleCount: number;
  progress: { totalLessons: number; completedLessons: number; progressPercentage: number };
}

export interface RoadmapDetailResponse {
  success: boolean;
  roadmap: TechnologyRoadmap;
  progress: UserRoadmapProgress;
  summary: { totalLessons: number; completedLessons: number; progressPercentage: number };
}

export interface PersonalizedRoadmapApiResponse {
  success: boolean;
  hasPersonalized: boolean;
  message?: string;
  analysisId?: string;
  resumeFileName?: string;
  analyzedAt?: string;
  opportunityTitle?: string;
  opportunityCompany?: string;
  matchedSkills?: string[];
  partialSkills?: string[];
  missingSkills?: string[];
  priorityGaps?: {
    skill: string;
    severity: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    actionDescription?: string;
  }[];
}

export interface RoadmapHistorySnapshot {
  analysisId: string;
  fileName: string;
  analyzedAt: string;
  opportunityTitle: string;
  opportunityCompany: string;
  gapsCount: number;
  matchedCount: number;
}

const userHeaders = (userId?: string): HeadersInit => (userId ? { 'x-user-id': userId } : {});

const getApiBaseUrl = (): string => {
  try {
    const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL ? String(import.meta.env.VITE_API_URL) : '').trim();
    if (envUrl) {
      return envUrl.replace(/\/+$/, '');
    }
  } catch {}
  return '';
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 3500): Promise<Response> => {
  if (typeof window === 'undefined' && !url.startsWith('http')) {
    throw new Error('Relative URL not supported in Node environment');
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

export class RoadmapApi {
  static async getSummaries(userId?: string): Promise<RoadmapSummary[]> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/roadmaps`;

    try {
      const response = await fetchWithTimeout(url, { headers: userHeaders(userId) });
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data && Array.isArray(data.roadmaps)) {
            return data.roadmaps;
          }
        }
      }
    } catch (networkError) {
      console.warn(`[RoadmapApi] API request to ${url} failed, using client fallback:`, networkError);
    }

    // Graceful fallback for static deployments (e.g. Vercel)
    return getRoadmaps().map((roadmap) => {
      const storageKey = `roadmap_progress_${userId || 'guest'}_${roadmap.id}`;
      let savedProgress: UserRoadmapProgress | null = null;
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
        if (stored) savedProgress = JSON.parse(stored);
      } catch {}

      return {
        ...roadmap,
        modules: undefined,
        moduleCount: roadmap.modules.length,
        progress: getProgressSummary(roadmap, savedProgress || undefined)
      };
    });
  }

  static async getSkills(department?: string): Promise<SkillCatalogEntry[]> {
    const query = department && department !== 'All' && department !== 'All Departments'
      ? `?department=${encodeURIComponent(department)}`
      : '';
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/skills${query}`;

    try {
      const response = await fetchWithTimeout(url);
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data && Array.isArray(data.skills)) {
            return data.skills;
          }
        }
      }
    } catch {}

    // Fallback to local SKILL_CATALOG
    if (department && department !== 'All' && department !== 'All Departments') {
      const deptUpper = department.toUpperCase().trim();
      return SKILL_CATALOG.filter((s) =>
        s.departments.some((d) => d.toUpperCase().trim() === deptUpper)
      );
    }
    return SKILL_CATALOG;
  }

  static async getCurrentRoadmap(userId?: string): Promise<PersonalizedRoadmapApiResponse> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/roadmap/current`;

    try {
      const response = await fetchWithTimeout(url, { headers: userHeaders(userId) });
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return await response.json();
        }
      }
    } catch {}

    return {
      success: true,
      hasPersonalized: false,
      message: 'Analyze your resume to get a personalized roadmap.'
    };
  }

  static async getRoadmapHistory(userId?: string): Promise<RoadmapHistorySnapshot[]> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/roadmap/history`;

    try {
      const response = await fetchWithTimeout(url, { headers: userHeaders(userId) });
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          return data.history || [];
        }
      }
    } catch {}

    return [];
  }

  static async getRoadmap(slug: string, userId?: string): Promise<RoadmapDetailResponse> {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/roadmaps/${encodeURIComponent(slug)}`;

    try {
      const response = await fetchWithTimeout(url, { headers: userHeaders(userId) });
      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await response.json();
          if (data && data.roadmap) {
            return data;
          }
        }
      }
    } catch (networkError) {
      console.warn(`[RoadmapApi] Failed to fetch roadmap from ${url}, falling back to local curriculum:`, networkError);
    }

    // Graceful fallback for static deployments (e.g. Vercel) or when backend API is unreachable
    const fallbackRoadmap = getRoadmapBySlug(slug);
    if (fallbackRoadmap) {
      const storageKey = `roadmap_progress_${userId || 'guest'}_${fallbackRoadmap.id}`;
      let savedProgress: UserRoadmapProgress | null = null;
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(storageKey) : null;
        if (stored) savedProgress = JSON.parse(stored);
      } catch {}

      const progress: UserRoadmapProgress = savedProgress || {
        userId: userId || '',
        technologyId: fallbackRoadmap.id,
        lessonIds: [],
        completedTopicIds: [],
        completedProjectIds: [],
        bookmarkedLessonIds: [],
        notes: {},
        assessmentAttempts: []
      };

      return {
        success: true,
        roadmap: fallbackRoadmap,
        progress,
        summary: getProgressSummary(fallbackRoadmap, progress)
      };
    }

    throw new Error('Unable to load this roadmap.');
  }

  static async saveProgress(
    slug: string,
    userId: string,
    progress: Partial<
      Pick<
        UserRoadmapProgress,
        | 'lessonIds'
        | 'completedTopicIds'
        | 'completedProjectIds'
        | 'lastLessonId'
        | 'bookmarkedLessonIds'
        | 'notes'
        | 'assessmentAttempts'
      >
    >
  ) {
    // Persist to localStorage immediately
    const storageKey = `roadmap_progress_${userId || 'guest'}_${slug}`;
    try {
      if (typeof localStorage !== 'undefined') {
        const existing = localStorage.getItem(storageKey);
        const parsed = existing ? JSON.parse(existing) : {};
        localStorage.setItem(storageKey, JSON.stringify({ ...parsed, ...progress }));
      }
    } catch {}

    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/roadmaps/${encodeURIComponent(slug)}/progress`;

    try {
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...userHeaders(userId) },
        body: JSON.stringify(progress)
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (networkError) {
      console.warn(`[RoadmapApi] Progress could not sync to remote API, saved locally:`, networkError);
    }

    return { success: true, savedLocally: true };
  }
}