import fs from 'fs';
import path from 'path';
import {
  RoleTaxonomyRecord,
  ParsedResumeDocument,
  ClaudeStructuredExtraction,
  AnalysisRecord,
  LLMLogRecord,
  ServerResumeRecord,
  JobOpportunityRecord
} from '../types';
import { SEED_ROLE_TAXONOMIES } from './seedTaxonomy';
import { SEED_OPPORTUNITIES } from './seedOpportunities';
import { UserRoadmapProgress } from '../roadmapTypes';

const DB_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

interface DatabaseSchema {
  taxonomies: Record<string, RoleTaxonomyRecord>;
  parseCache: Record<string, ParsedResumeDocument>; // keyed by fileHash
  extractions: Record<string, { fileHash: string; extraction: ClaudeStructuredExtraction; createdAt: string }>;
  analyses: Record<string, AnalysisRecord>; // keyed by analysisId
  userAnalysisHistory: Record<string, string[]>; // userId -> array of analysisIds
  serverResumes: Record<string, ServerResumeRecord>; // keyed by resumeId ("resume-<fileHash>-<userId>")
  opportunities: Record<string, JobOpportunityRecord>; // keyed by opportunityId
  llmLogs: LLMLogRecord[];
  roadmapProgress: Record<string, UserRoadmapProgress>;
}

export class Database {
  private static instance: Database;
  private data: DatabaseSchema = {
    taxonomies: {},
    parseCache: {},
    extractions: {},
    analyses: {},
    userAnalysisHistory: {},
    serverResumes: {},
    opportunities: {},
    llmLogs: [],
    roadmapProgress: {}
  };
  private isLoaded = false;

  private constructor() {
    this.init();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private init() {
    if (this.isLoaded) return;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {
          taxonomies: {},
          parseCache: {},
          extractions: {},
          analyses: {},
          userAnalysisHistory: {},
          serverResumes: {},
          opportunities: {},
          llmLogs: [],
          roadmapProgress: {}
        };
      }
    } catch (err) {
      console.error('[DB] Error loading database file, starting with fresh store:', err);
    }

    // Guard optional fields added in later versions
    this.data.roadmapProgress = this.data.roadmapProgress || {};
    this.data.serverResumes = this.data.serverResumes || {};
    this.data.opportunities = this.data.opportunities || {};
    this.data.interviews = this.data.interviews || {};

    // Seed taxonomies if empty or missing
    let hasNewData = false;
    for (const [roleKey, tax] of Object.entries(SEED_ROLE_TAXONOMIES)) {
      if (!this.data.taxonomies[roleKey]) {
        this.data.taxonomies[roleKey] = tax;
        hasNewData = true;
      }
    }

    // Seed opportunities if empty or missing
    for (const opp of SEED_OPPORTUNITIES) {
      if (!this.data.opportunities[opp.id]) {
        this.data.opportunities[opp.id] = opp;
        hasNewData = true;
      }
    }

    if (hasNewData || !fs.existsSync(DB_FILE)) {
      this.save();
    }

    this.isLoaded = true;
    console.log(`[DB] Database initialized with ${Object.keys(this.data.taxonomies).length} role taxonomies and ${Object.keys(this.data.analyses).length} stored analyses.`);
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      try {
        const fallbackPath = path.join('/tmp', 'sih_db.json');
        fs.writeFileSync(fallbackPath, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch {
        console.warn('[DB] Operating in in-memory mode for this request cycle');
      }
    }
  }

  // --- Role Taxonomy APIs ---
  public getTaxonomies(): RoleTaxonomyRecord[] {
    return Object.values(this.data.taxonomies).filter((t) => t.active);
  }

  public getTaxonomyByRoleId(roleId: string): RoleTaxonomyRecord | null {
    const key = roleId.toLowerCase().trim().replace(/[\s_]+/g, '-');
    if (this.data.taxonomies[key]) return this.data.taxonomies[key];

    // Fallback search by roleName
    for (const tax of Object.values(this.data.taxonomies)) {
      if (
        tax.roleId.toLowerCase() === roleId.toLowerCase() ||
        tax.roleName.toLowerCase() === roleId.toLowerCase()
      ) {
        return tax;
      }
    }
    return this.data.taxonomies['java-backend-developer'] || null;
  }

  // --- Parse Cache APIs ---
  public getCachedParse(fileHash: string): ParsedResumeDocument | null {
    return this.data.parseCache[fileHash] || null;
  }

  public saveParsedDocument(doc: ParsedResumeDocument): void {
    this.data.parseCache[doc.fileHash] = doc;
    this.save();
  }

  // --- Extraction Cache APIs ---
  public getExtractionByHash(fileHash: string): ClaudeStructuredExtraction | null {
    const rec = this.data.extractions[fileHash];
    return rec ? rec.extraction : null;
  }

  public saveExtraction(fileHash: string, extraction: ClaudeStructuredExtraction): void {
    this.data.extractions[fileHash] = {
      fileHash,
      extraction,
      createdAt: new Date().toISOString()
    };
    this.save();
  }

  // --- Analysis APIs ---
  public saveAnalysis(analysis: AnalysisRecord): void {
    this.data.analyses[analysis.analysisId] = analysis;

    const userKey = (analysis.userId || 'default_user').toLowerCase();
    if (!this.data.userAnalysisHistory[userKey]) {
      this.data.userAnalysisHistory[userKey] = [];
    }
    // Prevent duplicate entries in user history
    if (!this.data.userAnalysisHistory[userKey].includes(analysis.analysisId)) {
      this.data.userAnalysisHistory[userKey].unshift(analysis.analysisId);
    }

    this.save();
  }

  public getAnalysisById(analysisId: string): AnalysisRecord | null {
    return this.data.analyses[analysisId] || null;
  }

  public getUserAnalysisHistory(userId: string): AnalysisRecord[] {
    const userKey = (userId || 'default_user').toLowerCase();
    const ids = this.data.userAnalysisHistory[userKey] || [];
    return ids
      .map((id) => this.data.analyses[id])
      .filter(Boolean);
  }

  public getTotalAnalysesCount(): number {
    return Object.keys(this.data.analyses).length;
  }

  public getRoadmapProgress(userId: string, technologyId: string): UserRoadmapProgress | null {
    return this.data.roadmapProgress[`${userId}:${technologyId}`] || null;
  }

  public saveRoadmapProgress(progress: UserRoadmapProgress): UserRoadmapProgress {
    const normalized = {
      ...progress,
      lessonIds: Array.from(new Set(progress.lessonIds)),
      completedTopicIds: Array.from(new Set(progress.completedTopicIds)),
      completedProjectIds: Array.from(new Set(progress.completedProjectIds)),
      bookmarkedLessonIds: Array.from(new Set(progress.bookmarkedLessonIds || [])),
      notes: progress.notes || {},
      assessmentAttempts: progress.assessmentAttempts || [],
      lastAccessedAt: new Date().toISOString()
    };
    this.data.roadmapProgress[`${progress.userId}:${progress.technologyId}`] = normalized;
    this.save();
    return normalized;
  }

  // --- LLM Logs ---
  public logLLMCall(log: LLMLogRecord): void {
    this.data.llmLogs.push(log);
    // Keep last 500 logs to manage storage
    if (this.data.llmLogs.length > 500) {
      this.data.llmLogs = this.data.llmLogs.slice(-500);
    }
    this.save();
  }

  // --- Server-Side Resume Records ---
  public saveResumeRecord(record: ServerResumeRecord): void {
    this.data.serverResumes[record.resumeId] = record;
    this.save();
  }

  public getResumeRecord(resumeId: string): ServerResumeRecord | null {
    return this.data.serverResumes[resumeId] || null;
  }

  public getResumeRecordByHash(fileHash: string, userId: string): ServerResumeRecord | null {
    const resumeId = `resume-${fileHash}-${(userId || 'default_user').toLowerCase()}`;
    return this.data.serverResumes[resumeId] || null;
  }

  public getUserResumes(userId: string): ServerResumeRecord[] {
    const userKey = (userId || 'default_user').toLowerCase();
    return Object.values(this.data.serverResumes)
      .filter((r) => r.userId.toLowerCase() === userKey)
      .sort((a, b) => {
        const aDate = a.lastAnalyzedAt || a.uploadedAt;
        const bDate = b.lastAnalyzedAt || b.uploadedAt;
        return bDate.localeCompare(aDate);
      });
  }

  public deleteResumeRecord(resumeId: string): boolean {
    if (!this.data.serverResumes[resumeId]) return false;
    delete this.data.serverResumes[resumeId];
    this.save();
    return true;
  }

  public getAnalysesByFileHash(fileHash: string): AnalysisRecord[] {
    return Object.values(this.data.analyses)
      .filter((a) => a.fileHash === fileHash)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  // --- Opportunity APIs ---
  public getOpportunities(): JobOpportunityRecord[] {
    return Object.values(this.data.opportunities);
  }

  public getOpportunityById(id: string): JobOpportunityRecord | null {
    return this.data.opportunities[id] || null;
  }

  public saveOpportunity(opp: JobOpportunityRecord): void {
    this.data.opportunities[opp.id] = opp;
    this.save();
  }

  // --- Interview APIs ---
  public saveInterview(interview: any): void {
    this.data.interviews = this.data.interviews || {};
    this.data.interviews[interview.id] = interview;
    this.save();
  }

  public getInterviewById(id: string): any | null {
    this.data.interviews = this.data.interviews || {};
    return this.data.interviews[id] || null;
  }

  public getInterviewsByStudent(studentId?: string): any[] {
    this.data.interviews = this.data.interviews || {};
    const items = Object.values(this.data.interviews);
    if (!studentId) return items;
    const key = studentId.toLowerCase();
    return items.filter((i: any) =>
      (i.studentId && i.studentId.toLowerCase() === key) ||
      (i.candidateId && i.candidateId.toLowerCase() === key)
    );
  }
}
