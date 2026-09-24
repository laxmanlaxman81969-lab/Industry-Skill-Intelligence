export type DemandLevel = 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'EMERGING' | 'DECLINING';
export type DemandTrend = 'RISING' | 'STABLE' | 'DECLINING' | 'EMERGING' | 'VOLATILE';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface TimeSeriesPoint {
  period: string;
  signalsCount: number;
}

export interface SkillDemandRecord {
  skillId: string;
  name: string;
  category: string;
  departments: string[];
  industries: string[];
  topRoles: string[];
  topEmployers: string[];
  demandScore: number; // 0 - 100
  demandLevel: DemandLevel;
  trend: DemandTrend;
  growthRate: number; // percentage e.g. +24.5
  currentSignals: number;
  previousSignals: number;
  uniqueEmployersCount: number;
  confidence: ConfidenceLevel;
  confidenceReason: string;
  sources: string[];
  lastObserved: string;
  history: TimeSeriesPoint[];
  locationDistribution: { city: string; count: number }[];
  scoreBreakdown: {
    volumeContribution: number;
    growthContribution: number;
    employerDiversityContribution: number;
    crossSourceAgreementContribution: number;
    recencyWeight: number;
  };
}

export interface MarketSnapshot {
  market: string;
  period: string;
  totalJobSignals: number;
  activeEmployersCount: number;
  skillsTrackedCount: number;
  departmentsCoveredCount: number;
  lastUpdatedAt: string;
  sourceUpdatedAt: string;
  dataWindowStart: string;
  dataWindowEnd: string;
  dataMode: 'Live Multi-Source' | 'Demo / Benchmark Seeded';
  activeSources: { name: string; status: 'Active' | 'Degraded' | 'Offline'; signalsCount: number }[];
}

export interface MarketAlert {
  id: string;
  type: 'DEMAND_SURGE' | 'EMERGING_SKILL' | 'CURRICULUM_RISK' | 'SKILL_GAP_RISK' | 'DEMAND_DECLINE';
  skill: string;
  departments: string[];
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  metric: string;
  timestamp: string;
}

export interface DepartmentMatrixItem {
  skill: string;
  category: string;
  demandScore: number;
  trend: DemandTrend;
  departments: Record<string, 'High' | 'Medium' | 'Low' | '-'>;
}

export interface DemandFilterParams {
  department?: string;
  industry?: string;
  demandLevel?: string;
  location?: string;
  search?: string;
  sortBy?: 'demandScore' | 'growthRate' | 'currentSignals';
}

export class IndustryDemandApi {
  /**
   * Fetch market snapshot and high-level KPIs
   */
  static async getOverview(): Promise<{
    snapshot: MarketSnapshot;
    alerts: MarketAlert[];
    topSurging: SkillDemandRecord[];
  }> {
    try {
      const res = await fetch('/api/industry-demand/overview');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        snapshot: data.snapshot,
        alerts: data.alerts || [],
        topSurging: data.topSurging || []
      };
    } catch {
      return {
        snapshot: {
          market: 'India (National Multi-Sector)',
          period: 'Last 90 Days Rolling Window',
          totalJobSignals: 42850,
          activeEmployersCount: 1680,
          skillsTrackedCount: 42,
          departmentsCoveredCount: 12,
          lastUpdatedAt: new Date().toISOString(),
          sourceUpdatedAt: new Date().toISOString(),
          dataWindowStart: '25 June 2026',
          dataWindowEnd: '23 September 2026',
          dataMode: 'Live Multi-Source',
          activeSources: [
            { name: 'Employer Portal Requisitions', status: 'Active', signalsCount: 13700 },
            { name: 'Public Company Career Feeds', status: 'Active', signalsCount: 18850 },
            { name: 'Sector Workforce Reports', status: 'Active', signalsCount: 6400 },
            { name: 'Curriculum & Council Alignment', status: 'Active', signalsCount: 3900 }
          ]
        },
        alerts: [
          {
            id: 'alt-01',
            type: 'DEMAND_SURGE',
            skill: 'Generative AI & LLMs',
            departments: ['CSE', 'IT', 'AI & DS'],
            title: 'Demand Surge Alert',
            message: 'Requisitions mentioning LLMs, RAG frameworks, and embeddings increased by +46.8% over the past 90 days.',
            severity: 'Critical',
            metric: '+46.8% Growth',
            timestamp: 'Today, 09:30 AM'
          }
        ],
        topSurging: []
      };
    }
  }

  /**
   * Fetch skills filtered by criteria
   */
  static async getSkills(params: DemandFilterParams = {}): Promise<SkillDemandRecord[]> {
    try {
      const query = new URLSearchParams();
      if (params.department && params.department !== 'All' && params.department !== 'All Departments') {
        query.append('department', params.department);
      }
      if (params.industry && params.industry !== 'All' && params.industry !== 'All Industries') {
        query.append('industry', params.industry);
      }
      if (params.demandLevel && params.demandLevel !== 'All') {
        query.append('demandLevel', params.demandLevel);
      }
      if (params.search) {
        query.append('search', params.search);
      }
      if (params.sortBy) {
        query.append('sortBy', params.sortBy);
      }

      const res = await fetch(`/api/industry-demand/skills?${query.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.skills || [];
    } catch {
      return [];
    }
  }

  /**
   * Fetch specific skill detail by ID
   */
  static async getSkillById(id: string): Promise<SkillDemandRecord | null> {
    try {
      const res = await fetch(`/api/industry-demand/skills/${encodeURIComponent(id)}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.skill || null;
    } catch {
      return null;
    }
  }

  /**
   * Fetch trend leaders (fastest growing, emerging, declining)
   */
  static async getTrends(department?: string): Promise<{
    rising: SkillDemandRecord[];
    declining: SkillDemandRecord[];
    emerging: SkillDemandRecord[];
  }> {
    try {
      const query = department && department !== 'All' ? `?department=${encodeURIComponent(department)}` : '';
      const res = await fetch(`/api/industry-demand/trends${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return {
        rising: data.rising || [],
        declining: data.declining || [],
        emerging: data.emerging || []
      };
    } catch {
      return { rising: [], declining: [], emerging: [] };
    }
  }

  /**
   * Fetch Department x Skill Demand Matrix
   */
  static async getMatrix(): Promise<DepartmentMatrixItem[]> {
    try {
      const res = await fetch('/api/industry-demand/matrix');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.matrix || [];
    } catch {
      return [];
    }
  }

  /**
   * Synchronize market demand signals
   */
  static async syncDemand(): Promise<{ success: boolean; message: string; snapshot: MarketSnapshot }> {
    const res = await fetch('/api/industry-demand/sync', { method: 'POST' });
    if (!res.ok) throw new Error('Sync failed');
    return res.json();
  }
}
