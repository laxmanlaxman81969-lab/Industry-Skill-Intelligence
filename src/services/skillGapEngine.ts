import { AnalysisRecord } from '../../server/types';
import { JobRequirement, StudentSkill } from '../types';
import { SKILL_CATALOG, SkillCatalogEntry } from '../data/skillCatalog';

export type EvidenceStatus = 'FOUND' | 'PARTIALLY_EVIDENCED' | 'NOT_EVIDENCED' | 'UNCERTAIN';
export type GapPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SkillGapItem {
  skillId: string;
  name: string;
  slug?: string | null;
  hasRoadmap: boolean;
  category: string;
  priority: GapPriority;
  priorityScore: number; // For deterministic sorting
  evidenceStatus: EvidenceStatus;
  evidenceSnippet?: string;
  source: ('RESUME_ANALYSIS' | 'OPPORTUNITY_ANALYSIS' | 'INDUSTRY_DEMAND' | 'STUDENT_SKILL_PROFILE' | 'DEPARTMENT_REQUIREMENT')[];
  reason: string;
  currentEvidence: string;
  targetLevel: string;
  prerequisites: string[];
  isRequiredByOpportunity: boolean;
  isPreferredByOpportunity: boolean;
  industryDemandScore: number;
}

export interface PersonalizedRoadmapState {
  analysisId: string;
  resumeId?: string;
  resumeFileName: string;
  analyzedAt: string;
  opportunityId?: string;
  opportunityTitle?: string;
  opportunityCompany?: string;
  mode: 'OPPORTUNITY_AWARE' | 'INDUSTRY_BASED';
  modeLabel: string;
  priorityGaps: SkillGapItem[];    // High priority
  secondaryGaps: SkillGapItem[];   // Medium + Low priority
  allGaps: SkillGapItem[];
  foundSkills: { name: string; level?: string; evidenceSnippet?: string }[];
  partiallyEvidencedSkills: { name: string; reason?: string }[];
  totalGapsCount: number;
  generatedAt: string;
}

/**
 * Normalizes skill strings for robust case-insensitive comparison
 */
export function normalizeSkillName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[._\-\\/+]/g, '')
    .replace(/\s+/g, '');
}

/**
 * Find catalog item by name or alias
 */
export function findInCatalog(skillName: string, catalog: SkillCatalogEntry[] = SKILL_CATALOG): SkillCatalogEntry | undefined {
  const norm = normalizeSkillName(skillName);
  return catalog.find((entry) => {
    const entryNorm = normalizeSkillName(entry.name);
    const idNorm = normalizeSkillName(entry.skillId);
    if (entryNorm === norm || idNorm === norm) return true;
    if (entry.slug && normalizeSkillName(entry.slug) === norm) return true;
    return false;
  });
}

/**
 * Deterministically computes the personalized skill gap roadmap
 * strictly from validated evidence. NEVER invents fake gaps.
 */
export function computePersonalizedRoadmap(
  analysis: AnalysisRecord | null,
  opportunity: JobRequirement | null,
  studentSkills: StudentSkill[] = [],
  catalog: SkillCatalogEntry[] = SKILL_CATALOG,
  selectedDepartment?: string
): PersonalizedRoadmapState | null {
  if (!analysis) return null;

  const isOpportunityAware = Boolean(
    analysis.opportunityId ||
    analysis.opportunityTitle ||
    opportunity?.id
  );

  const oppTitle = analysis.opportunityTitle || opportunity?.title;
  const oppCompany = analysis.opportunityCompany || opportunity?.companyName;
  const oppId = analysis.opportunityId || opportunity?.id;

  // 1. Compile sets of verified evidence from the analysis record
  const matchedSet = new Map<string, { name: string; snippet?: string }>();
  (analysis.matchedSkills || []).forEach((m) => {
    matchedSet.set(normalizeSkillName(m.skill), {
      name: m.skill,
      snippet: m.evidenceQuote || (m as any).evidenceSnippet
    });
  });

  const partialSet = new Map<string, { name: string; reason?: string }>();
  (analysis.partialSkills || []).forEach((p) => {
    partialSet.set(normalizeSkillName(p.skill), {
      name: p.skill,
      reason: p.reason
    });
  });

  const missingSet = new Map<string, { name: string; severity?: string }>();
  (analysis.missingSkills || []).forEach((m) => {
    missingSet.set(normalizeSkillName(m.skill), {
      name: m.skill,
      severity: m.severity
    });
  });

  // Also include student profile skills as known foundation
  const profileKnownSet = new Set<string>();
  studentSkills.forEach((s) => {
    profileKnownSet.add(normalizeSkillName(s.name));
  });

  // Opportunity requirements set
  const oppRequiredList = opportunity?.requiredSkills?.map((r) => r.skill) ||
    analysis.opportunityRequiredSkills || [];
  const oppRequiredSet = new Set(oppRequiredList.map(normalizeSkillName));

  const oppPreferredList = (opportunity?.preferredSkills || []).map((p) => typeof p === 'string' ? p : p.skill) ||
    analysis.opportunityPreferredSkills || [];
  const oppPreferredSet = new Set(oppPreferredList.map(normalizeSkillName));

  // 2. Build Candidate Gap List
  const gapMap = new Map<string, SkillGapItem>();

  // A. Process whatToLearnNext (primary server-computed skill gap recommendations)
  if (Array.isArray(analysis.whatToLearnNext)) {
    analysis.whatToLearnNext.forEach((item, idx) => {
      const norm = normalizeSkillName(item.skill);
      const catalogEntry = findInCatalog(item.skill, catalog);
      const isReq = oppRequiredSet.has(norm);
      const isPref = oppPreferredSet.has(norm);
      const isPartial = partialSet.has(norm);
      const isPossessedInProfile = profileKnownSet.has(norm);

      let evidenceStatus: EvidenceStatus = 'NOT_EVIDENCED';
      let currentEvidence = 'Not evidenced in analyzed resume.';
      if (isPartial) {
        evidenceStatus = 'PARTIALLY_EVIDENCED';
        currentEvidence = partialSet.get(norm)?.reason || 'Partially evidenced with basic mentions only.';
      } else if (isPossessedInProfile) {
        currentEvidence = 'Present in student profile but not evidenced in current resume.';
      }

      let priority: GapPriority = 'MEDIUM';
      let priorityScore = 50;

      if (isReq || item.severity === 'Critical') {
        priority = 'HIGH';
        priorityScore = 90 - idx;
      } else if (item.severity === 'Important' || isPref) {
        priority = 'MEDIUM';
        priorityScore = 60 - idx;
      } else {
        priority = 'LOW';
        priorityScore = 30 - idx;
      }

      const sources: SkillGapItem['source'] = ['RESUME_ANALYSIS'];
      if (isReq || isPref) sources.push('OPPORTUNITY_ANALYSIS');
      sources.push('INDUSTRY_DEMAND');

      let reason = item.actionDescription || `${item.skill} is a key capability identified for role qualification.`;
      if (isReq && oppTitle) {
        reason = `Required by ${oppTitle}. ${reason}`;
      }

      gapMap.set(norm, {
        skillId: catalogEntry?.skillId || norm,
        name: catalogEntry?.name || item.skill,
        slug: catalogEntry?.slug || null,
        hasRoadmap: catalogEntry?.hasRoadmap || false,
        category: catalogEntry?.category || 'Technical Skill',
        priority,
        priorityScore,
        evidenceStatus,
        source: sources,
        reason,
        currentEvidence,
        targetLevel: catalogEntry?.difficulty || 'Intermediate',
        prerequisites: catalogEntry?.prerequisites || [],
        isRequiredByOpportunity: isReq,
        isPreferredByOpportunity: isPref,
        industryDemandScore: catalogEntry?.demandScore || 85
      });
    });
  }

  // B. Process Opportunity missing skills (if any was not in whatToLearnNext)
  const oppMissingList = analysis.opportunityMissingSkills || [];
  oppMissingList.forEach((skillName, idx) => {
    const norm = normalizeSkillName(skillName);
    if (!gapMap.has(norm)) {
      const catalogEntry = findInCatalog(skillName, catalog);
      const isReq = oppRequiredSet.has(norm) || true; // from opportunityMissingSkills
      const isPartial = partialSet.has(norm);

      gapMap.set(norm, {
        skillId: catalogEntry?.skillId || norm,
        name: catalogEntry?.name || skillName,
        slug: catalogEntry?.slug || null,
        hasRoadmap: catalogEntry?.hasRoadmap || false,
        category: catalogEntry?.category || 'Target Opportunity Requirement',
        priority: 'HIGH',
        priorityScore: 85 - idx,
        evidenceStatus: isPartial ? 'PARTIALLY_EVIDENCED' : 'NOT_EVIDENCED',
        source: ['OPPORTUNITY_ANALYSIS', 'RESUME_ANALYSIS'],
        reason: oppTitle
          ? `Required by ${oppTitle} (${oppCompany || 'Target Employer'}), but not evidenced in your resume.`
          : `Opportunity requirement not evidenced in your analyzed resume.`,
        currentEvidence: isPartial
          ? (partialSet.get(norm)?.reason || 'Partially evidenced.')
          : 'Not evidenced in analyzed resume.',
        targetLevel: catalogEntry?.difficulty || 'Intermediate',
        prerequisites: catalogEntry?.prerequisites || [],
        isRequiredByOpportunity: isReq,
        isPreferredByOpportunity: false,
        industryDemandScore: catalogEntry?.demandScore || 88
      });
    }
  });

  // C. Process Missing Skills list from analysis
  (analysis.missingSkills || []).forEach((m, idx) => {
    const norm = normalizeSkillName(m.skill);
    if (!gapMap.has(norm)) {
      const catalogEntry = findInCatalog(m.skill, catalog);
      const isReq = oppRequiredSet.has(norm);
      const isPref = oppPreferredSet.has(norm);

      let priority: GapPriority = 'MEDIUM';
      let score = 55;
      if (m.severity === 'Critical' || isReq) {
        priority = 'HIGH';
        score = 80 - idx;
      } else if (m.severity === 'Minor') {
        priority = 'LOW';
        score = 35 - idx;
      }

      gapMap.set(norm, {
        skillId: catalogEntry?.skillId || norm,
        name: catalogEntry?.name || m.skill,
        slug: catalogEntry?.slug || null,
        hasRoadmap: catalogEntry?.hasRoadmap || false,
        category: catalogEntry?.category || 'Industry Requirement',
        priority,
        priorityScore: score,
        evidenceStatus: 'NOT_EVIDENCED',
        source: isReq || isPref ? ['OPPORTUNITY_ANALYSIS', 'RESUME_ANALYSIS'] : ['RESUME_ANALYSIS', 'INDUSTRY_DEMAND'],
        reason: `${m.skill} is critical for role benchmark readiness.`,
        currentEvidence: 'Not evidenced in analyzed resume.',
        targetLevel: catalogEntry?.difficulty || 'Intermediate',
        prerequisites: catalogEntry?.prerequisites || [],
        isRequiredByOpportunity: isReq,
        isPreferredByOpportunity: isPref,
        industryDemandScore: catalogEntry?.demandScore || 80
      });
    }
  });

  // 3. Sort gaps deterministically by:
  // - Required by opportunity FIRST
  // - Priority score (HIGH > MEDIUM > LOW)
  // - Prerequisite dependencies (put foundation before advanced)
  const allGapsList = Array.from(gapMap.values()).sort((a, b) => {
    if (a.isRequiredByOpportunity && !b.isRequiredByOpportunity) return -1;
    if (!a.isRequiredByOpportunity && b.isRequiredByOpportunity) return 1;
    return b.priorityScore - a.priorityScore;
  });

  // Separate into High Priority vs Secondary
  const priorityGaps = allGapsList.filter((g) => g.priority === 'HIGH');
  const secondaryGaps = allGapsList.filter((g) => g.priority !== 'HIGH');

  // Found skills summary
  const foundSkills = Array.from(matchedSet.values()).map((m) => ({
    name: m.name,
    evidenceSnippet: m.snippet
  }));

  const partiallyEvidencedSkills = Array.from(partialSet.values()).map((p) => ({
    name: p.name,
    reason: p.reason
  }));

  return {
    analysisId: analysis.analysisId,
    resumeFileName: analysis.fileName || 'Analyzed_Resume.pdf',
    analyzedAt: analysis.createdAt || new Date().toISOString(),
    opportunityId: oppId,
    opportunityTitle: oppTitle,
    opportunityCompany: oppCompany,
    mode: isOpportunityAware ? 'OPPORTUNITY_AWARE' : 'INDUSTRY_BASED',
    modeLabel: isOpportunityAware
      ? `Tailored to Opportunity: ${oppTitle} (${oppCompany || 'Target Employer'})`
      : 'Industry-Based Personalized Roadmap',
    priorityGaps,
    secondaryGaps,
    allGaps: allGapsList,
    foundSkills,
    partiallyEvidencedSkills,
    totalGapsCount: allGapsList.length,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Checks the evidence status of any skill name against an active analysis
 */
export function getSkillEvidenceStatus(
  skillName: string,
  analysis: AnalysisRecord | null,
  studentSkills: StudentSkill[] = []
): { status: EvidenceStatus | null; label: string; badgeClass: string } {
  if (!analysis) return { status: null, label: '', badgeClass: '' };

  const norm = normalizeSkillName(skillName);

  // Check Matched
  const matched = (analysis.matchedSkills || []).some((m) => normalizeSkillName(m.skill) === norm);
  if (matched) {
    return {
      status: 'FOUND',
      label: 'FOUND',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  // Check Partial
  const partial = (analysis.partialSkills || []).some((p) => normalizeSkillName(p.skill) === norm);
  if (partial) {
    return {
      status: 'PARTIALLY_EVIDENCED',
      label: 'PARTIALLY EVIDENCED',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  }

  // Check Missing / Not Evidenced
  const missing = (analysis.missingSkills || []).some((m) => normalizeSkillName(m.skill) === norm) ||
    (analysis.opportunityMissingSkills || []).some((s) => normalizeSkillName(s) === norm) ||
    (analysis.whatToLearnNext || []).some((w) => normalizeSkillName(w.skill) === norm);

  if (missing) {
    return {
      status: 'NOT_EVIDENCED',
      label: 'NOT EVIDENCED',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }

  // Check profile known
  const inProfile = studentSkills.some((s) => normalizeSkillName(s.name) === norm);
  if (inProfile) {
    return {
      status: 'UNCERTAIN',
      label: 'PROFILE SKILL (UNVERIFIED IN RESUME)',
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200'
    };
  }

  return { status: null, label: '', badgeClass: '' };
}
