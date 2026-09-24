// Real Claude AI Structured Extraction Service
// Calls Claude Messages API with strict JSON schema, single-retry resilience,
// and MANDATORY SERVER-SIDE ANTI-HALLUCINATION EVIDENCE VERIFICATION

import Anthropic from '@anthropic-ai/sdk';
import {
  ClaudeStructuredExtraction,
  ClaimedSkillItem,
  LLMLogRecord
} from '../types';
import { Database } from '../db/database';
import { SkillNormalizer } from './skillNormalizer';

export interface ClaudeExtractionResult {
  extraction: ClaudeStructuredExtraction;
  rawResponse?: string;
  durationMs: number;
  retryCount: number;
  apiConfigured: boolean;
  warnings: string[];
}

export class ClaudeExtractionService {
  private static instance: ClaudeExtractionService;
  private db = Database.getInstance();
  private anthropic: Anthropic | null = null;
  private apiKey: string = '';

  private constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
    if (this.apiKey) {
      this.anthropic = new Anthropic({ apiKey: this.apiKey });
    }
  }

  public static getInstance(): ClaudeExtractionService {
    if (!ClaudeExtractionService.instance) {
      ClaudeExtractionService.instance = new ClaudeExtractionService();
    }
    return ClaudeExtractionService.instance;
  }

  public isConfigured(): boolean {
    return !!(this.apiKey && this.anthropic);
  }

  public async extractSkills(
    resumeText: string,
    detectedSections: Record<string, string | undefined>,
    analysisId: string
  ): Promise<ClaudeExtractionResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    // Check if Claude API Key is configured in environment
    if (!this.isConfigured()) {
      console.warn('[Claude] ANTHROPIC_API_KEY is not configured in .env. Running deterministic server-side extractor with strict evidence verification.');
      warnings.push('Claude API key not configured in .env — using deterministic server extraction engine.');

      const fallbackExtraction = this.deterministicServerExtraction(resumeText, detectedSections);
      const verified = this.validateAndVerifyEvidence(fallbackExtraction, resumeText);

      return {
        extraction: verified,
        durationMs: Date.now() - startTime,
        retryCount: 0,
        apiConfigured: false,
        warnings
      };
    }

    // Call Real Anthropic Claude API with Single Retry Rule
    const systemPrompt = `You are a strict, highly accurate resume data extraction engine.
Extract structured information from the provided resume text.
You MUST output ONLY valid JSON matching this exact JSON schema:
{
  "candidate_name": string,
  "contact_info": { "email": string, "phone": string, "location": string },
  "summary": string,
  "achievements": string[],
  "languages": string[],
  "total_years_experience": number,
  "current_role": string,
  "work_history": [
    {
      "company": string,
      "title": string,
      "duration": string,
      "responsibilities": string[],
      "technologies_used": string[]
    }
  ],
  "education": [
    {
      "degree": string,
      "institution": string,
      "year": string
    }
  ],
  "certifications": string[],
  "projects": [
    {
      "name": string,
      "description": string,
      "tech_stack": string[]
    }
  ],
  "skills_claimed": [
    {
      "skill": string,
      "evidence_snippet": string,
      "confidence": "explicit" | "inferred"
    }
  ]
}

CRITICAL ANTI-HALLUCINATION RULES:
1. EVERY item in "skills_claimed" MUST contain an exact "evidence_snippet" copied verbatim from the resume text proving the skill claim.
2. If a skill does not have literal textual evidence in the resume, DO NOT include it.
3. "confidence" must be "explicit" only when the skill is directly stated. Never return inferred skills.
4. For every other field, copy only information supported by the resume. Use empty strings and empty arrays when information is absent.
5. Never use placeholder facts such as "Candidate", "Software Engineer", "University / College", or generated project/experience descriptions.
6. Output ONLY valid JSON. No conversational text, no markdown backticks, no comments.`;

    const userPrompt = `Resume Content to Extract:\n\n${resumeText.slice(0, 15000)}`;

    let responseText = '';
    let retryCount = 0;
    let tokenUsage: any = undefined;

    try {
      const response = await this.anthropic!.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 3500,
        temperature: 0.1,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      });

      responseText = response.content
        .filter((c) => c.type === 'text')
        .map((c: any) => c.text)
        .join('');
      tokenUsage = response.usage;
    } catch (apiErr: any) {
      console.error('[Claude] Primary API call failed:', apiErr);
      throw new Error(`Claude API request failed: ${apiErr.message || 'Network error'}`);
    }

    let parsedJson: any = null;
    try {
      parsedJson = this.parseCleanJson(responseText);
    } catch (jsonErr) {
      console.warn('[Claude] First JSON parse attempt failed. Executing single retry as per specification...');
      retryCount = 1;

      try {
        const retryResponse = await this.anthropic!.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3500,
          temperature: 0.0,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userPrompt },
            { role: 'assistant', content: responseText },
            {
              role: 'user',
              content:
                'Return ONLY valid JSON matching the required schema. Do not include markdown, explanation, comments, or additional fields.'
            }
          ]
        });

        const retryText = retryResponse.content
          .filter((c) => c.type === 'text')
          .map((c: any) => c.text)
          .join('');
        parsedJson = this.parseCleanJson(retryText);
      } catch (secondErr) {
        console.error('[Claude] Retry attempt also failed to return valid JSON:', secondErr);
        // Log failure server-side
        this.db.logLLMCall({
          id: `llm-${Date.now()}`,
          analysisId,
          model: 'claude-3-5-sonnet-20241022',
          promptVersion: 'v1-strict-json',
          durationMs: Date.now() - startTime,
          retryCount: 1,
          errorDetails: 'Invalid JSON after retry',
          createdAt: new Date().toISOString()
        });
        throw new Error("Couldn't confidently analyze this resume.");
      }
    }

    // Convert raw JSON to typed structure
    const rawExtraction: ClaudeStructuredExtraction = {
      extractionVersion: 2,
      candidateName: typeof parsedJson.candidate_name === 'string' ? parsedJson.candidate_name.trim() : '',
      contactInfo: {
        email: typeof parsedJson.contact_info?.email === 'string' ? parsedJson.contact_info.email.trim() : '',
        phone: typeof parsedJson.contact_info?.phone === 'string' ? parsedJson.contact_info.phone.trim() : '',
        location: typeof parsedJson.contact_info?.location === 'string' ? parsedJson.contact_info.location.trim() : ''
      },
      summary: typeof parsedJson.summary === 'string' ? parsedJson.summary.trim() : '',
      achievements: Array.isArray(parsedJson.achievements) ? parsedJson.achievements.filter((item: unknown): item is string => typeof item === 'string') : [],
      languages: Array.isArray(parsedJson.languages) ? parsedJson.languages.filter((item: unknown): item is string => typeof item === 'string') : [],
      totalYearsExperience: Number(parsedJson.total_years_experience) || 0,
      currentRole: parsedJson.current_role || '',
      workHistory: Array.isArray(parsedJson.work_history)
        ? parsedJson.work_history.map((w: any) => ({
            company: typeof w.company === 'string' ? w.company.trim() : '',
            title: typeof w.title === 'string' ? w.title.trim() : '',
            duration: typeof w.duration === 'string' ? w.duration.trim() : '',
            responsibilities: Array.isArray(w.responsibilities) ? w.responsibilities : [],
            technologiesUsed: Array.isArray(w.technologies_used) ? w.technologies_used : []
          }))
        : [],
      education: Array.isArray(parsedJson.education)
        ? parsedJson.education.map((e: any) => ({
            degree: typeof e.degree === 'string' ? e.degree.trim() : '',
            institution: typeof e.institution === 'string' ? e.institution.trim() : '',
            year: typeof e.year === 'string' ? e.year.trim() : ''
          }))
        : [],
      certifications: Array.isArray(parsedJson.certifications) ? parsedJson.certifications : [],
      projects: Array.isArray(parsedJson.projects)
        ? parsedJson.projects.map((p: any) => ({
            name: typeof p.name === 'string' ? p.name.trim() : '',
            description: typeof p.description === 'string' ? p.description.trim() : '',
            techStack: Array.isArray(p.tech_stack) ? p.tech_stack : []
          }))
        : [],
      skillsClaimed: Array.isArray(parsedJson.skills_claimed)
        ? parsedJson.skills_claimed.map((s: any) => ({
            skill: s.skill || '',
          originalSkill: s.skill || '',
            normalizedSkill: SkillNormalizer.normalize(s.skill || ''),
            evidenceSnippet: s.evidence_snippet || '',
            confidence: s.confidence === 'inferred' ? 'inferred' : 'explicit',
            verifiedInText: false
          }))
        : []
    };

    // Log successful LLM call
    const durationMs = Date.now() - startTime;
    this.db.logLLMCall({
      id: `llm-${Date.now()}`,
      analysisId,
      model: 'claude-3-5-sonnet-20241022',
      promptVersion: 'v1-strict-json',
      durationMs,
      retryCount,
      tokenUsage: tokenUsage
        ? {
            promptTokens: tokenUsage.input_tokens,
            completionTokens: tokenUsage.output_tokens,
            totalTokens: tokenUsage.input_tokens + tokenUsage.output_tokens
          }
        : undefined,
      createdAt: new Date().toISOString()
    });

    // Enforce Server-Side Evidence Verification
    const verifiedExtraction = this.validateAndVerifyEvidence(rawExtraction, resumeText);

    return {
      extraction: verifiedExtraction,
      durationMs,
      retryCount,
      apiConfigured: true,
      warnings
    };
  }

  /**
   * Cleans and safely parses JSON from LLM response
   */
  private parseCleanJson(text: string): any {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(clean);
  }

  /**
   * Server-Side Anti-Hallucination Evidence Verification:
   * Checks every evidence_snippet against the original extracted resume text.
   * If the evidence_snippet cannot be found in the resume, REJECTS that skill claim.
   */
  public validateAndVerifyEvidence(
    extraction: ClaudeStructuredExtraction,
    originalResumeText: string
  ): ClaudeStructuredExtraction {
    const normalizedResume = originalResumeText.toLowerCase().replace(/\s+/g, ' ');
    const verifiedSkills: ClaimedSkillItem[] = [];

    for (const item of extraction.skillsClaimed) {
      if (!item.skill || !item.evidenceSnippet) continue;

      const snippet = item.evidenceSnippet.toLowerCase().replace(/\s+/g, ' ').trim();

      // Check if evidence snippet exists in original resume text
      const isVerified = normalizedResume.includes(snippet) ||
        // If snippet is long, check significant substring (first 25 chars)
        (snippet.length > 25 && normalizedResume.includes(snippet.substring(0, 25)));

      if (isVerified) {
        // Practical evidence detection: check if skill appears in work history, projects, or responsibilities
        const isPractical = this.checkPracticalEvidence(item.skill, extraction);

        verifiedSkills.push({
          ...item,
          originalSkill: item.originalSkill || item.skill,
          normalizedSkill: SkillNormalizer.normalize(item.skill),
          verifiedInText: true,
          hasPracticalEvidence: isPractical
        });
      } else {
        console.warn(`[Anti-Hallucination] Rejected unsupported skill "${item.skill}". Evidence snippet was not found in original resume text: "${item.evidenceSnippet}"`);
      }
    }

    return this.sanitizeNonSkillEvidence({
      ...extraction,
      skillsClaimed: verifiedSkills
    }, originalResumeText);
  }

  private sanitizeNonSkillEvidence(
    extraction: ClaudeStructuredExtraction,
    originalResumeText: string
  ): ClaudeStructuredExtraction {
    const normalizedResume = originalResumeText.toLowerCase().replace(/\s+/g, ' ');
    const hasEvidence = (value: string) => {
      const normalized = value.toLowerCase().replace(/\s+/g, ' ').trim();
      return normalized.length > 0 && normalizedResume.includes(normalized);
    };
    const evidenceOnly = (value: string) => hasEvidence(value) ? value : '';

    return {
      ...extraction,
      extractionVersion: 2,
      candidateName: evidenceOnly(extraction.candidateName),
      currentRole: evidenceOnly(extraction.currentRole),
      totalYearsExperience: /\b\d+(?:\.\d+)?\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience\b/i.test(originalResumeText)
        ? extraction.totalYearsExperience
        : 0,
      contactInfo: extraction.contactInfo ? {
        email: extraction.contactInfo.email && hasEvidence(extraction.contactInfo.email) ? extraction.contactInfo.email : '',
        phone: extraction.contactInfo.phone && hasEvidence(extraction.contactInfo.phone) ? extraction.contactInfo.phone : '',
        location: extraction.contactInfo.location && hasEvidence(extraction.contactInfo.location) ? extraction.contactInfo.location : ''
      } : undefined,
      summary: extraction.summary && hasEvidence(extraction.summary) ? extraction.summary : '',
      achievements: (extraction.achievements || []).filter(hasEvidence),
      languages: (extraction.languages || []).filter(hasEvidence),
      workHistory: extraction.workHistory.map((item) => ({
        ...item,
        company: evidenceOnly(item.company),
        title: evidenceOnly(item.title),
        duration: evidenceOnly(item.duration),
        responsibilities: item.responsibilities.filter(hasEvidence),
        technologiesUsed: item.technologiesUsed.filter(hasEvidence)
      })).filter((item) => item.company || item.title || item.duration || item.responsibilities.length || item.technologiesUsed.length),
      education: extraction.education.map((item) => ({
        degree: evidenceOnly(item.degree),
        institution: evidenceOnly(item.institution),
        year: evidenceOnly(item.year)
      })).filter((item) => item.degree || item.institution || item.year),
      certifications: extraction.certifications.filter(hasEvidence),
      projects: extraction.projects.map((item) => ({
        name: evidenceOnly(item.name),
        description: evidenceOnly(item.description),
        techStack: item.techStack.filter(hasEvidence)
      })).filter((item) => item.name || item.description || item.techStack.length)
    };
  }

  private checkPracticalEvidence(skillName: string, extraction: ClaudeStructuredExtraction): boolean {
    const target = skillName.toLowerCase();

    // Check projects tech stack or descriptions
    for (const p of extraction.projects) {
      if (p.techStack.some((t) => t.toLowerCase().includes(target) || target.includes(t.toLowerCase()))) {
        return true;
      }
      if (p.description.toLowerCase().includes(target)) {
        return true;
      }
    }

    // Check work history responsibilities or technologies used
    for (const w of extraction.workHistory) {
      if (w.technologiesUsed.some((t) => t.toLowerCase().includes(target) || target.includes(t.toLowerCase()))) {
        return true;
      }
      if (w.responsibilities.some((r) => r.toLowerCase().includes(target))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Deterministic server-side extraction engine for local/offline execution
   * when ANTHROPIC_API_KEY is not set. Extracts real candidate info and claims
   * strictly from the literal resume text with verified snippets.
   */
  /**
   * Deterministic server-side extraction engine for local/offline execution
   * when ANTHROPIC_API_KEY is not set. Extracts real candidate info, education,
   * experience, and claims strictly from the literal resume text with verified snippets.
   */
  private deterministicServerExtraction(
    resumeText: string,
    detectedSections: Record<string, string | undefined>
  ): ClaudeStructuredExtraction {
    const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean);
    const email = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || '';
    const phone = resumeText.match(/(?:\+\d{1,3}[\s-]?)?[6-9]\d{9}|\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/)?.[0] || '';
    const location = resumeText.match(/(?:location|address)\s*[:|-]\s*([^\n]+)/i)?.[1]?.trim() || '';
    const summary = detectedSections.summary || '';

    // 1. Extract Candidate Name from first few lines
    let candidateName = '';
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      // Filter out headers, emails, links, phones
      if (
        line.length >= 3 &&
        line.length <= 45 &&
        !line.includes('@') &&
        !line.includes('http') &&
        !line.includes('.com') &&
        !line.includes('+91') &&
        !/^(curriculum|vitae|resume|profile|summary|contact|education|skills)/i.test(line)
      ) {
        candidateName = line.replace(/^(name\s*[:\-]|candidate\s*[:\-])\s*/i, '').trim();
        break;
      }
    }

    // 2. Extract Education Details
    const education: { degree: string; institution: string; year: string }[] = [];
    const degreePatterns = [
      /(?:b\.?tech|b\.?e\.?|bachelor(?:\s+of\s+technology|\s+of\s+engineering|\s+of\s+science)?|b\.?sc|m\.?tech|m\.?s\.?|master(?:\s+of\s+technology|\s+of\s+science)?|bca|mca|diploma)[^,\n\r]*/gi,
      /(?:computer\s+science|information\s+technology|electronics|data\s+science|artificial\s+intelligence)[^,\n\r]*/gi
    ];

    const educationSection = detectedSections.education ||
      resumeText.match(/(?:^|\n)education\s*:\s*([^\n]+)/i)?.[1] || '';
    const yearMatch = educationSection.match(/\b(20\d{2}\s*[-–—]\s*(?:20\d{2}|present|current)|\b20\d{2}\b)/i);
    const gradYear = yearMatch ? yearMatch[0] : '';

    let detectedDegree = '';
    for (const pat of degreePatterns) {
      const match = pat.exec(educationSection);
      if (match) {
        detectedDegree = match[0].trim();
        break;
      }
    }

    if (detectedDegree) {
      const educationLines = educationSection.split('\n').map((line) => line.trim()).filter(Boolean);
      const institution = educationLines.find((line) =>
        line !== detectedDegree && !/20\d{2}|present|current/i.test(line)
      ) || '';
      education.push({
        degree: detectedDegree,
        institution,
        year: gradYear
      });
    }

    // 3. Extract Experience / Years
    let totalYearsExperience = 0;
    const expMatch = resumeText.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/i);
    if (expMatch && expMatch[1]) {
      totalYearsExperience = parseFloat(expMatch[1]);
    }

    // 4. Extract Projects
    const projects: { name: string; description: string; techStack: string[] }[] = [];
    const projectSection = detectedSections.projects || '';
    if (projectSection) {
      const projLines = projectSection.split('\n').map((l) => l.trim()).filter((l) => l.length > 5);
      for (let i = 0; i < Math.min(4, projLines.length); i++) {
        const line = projLines[i];
        if (line.length < 60 && !line.startsWith('•') && !line.startsWith('-')) {
          projects.push({
            name: line.replace(/^project\s*[:\-]\s*/i, '').trim(),
            description: projLines[i + 1] || '',
            techStack: []
          });
        }
      }
    }

    // 5. Extract Certifications from certifications section
    const certifications: string[] = [];
    const certSection = detectedSections.certifications || '';
    if (certSection) {
      const certLines = certSection.split('\n')
        .map((l: string) => l.replace(/^[-•*\d.\s]+/, '').trim())
        .filter((l: string) => l.length > 8 && l.length < 150);
      certLines.slice(0, 6).forEach((c: string) => {
        if (/certif|oracle|microsoft|google|aws|cisco|hackerrank|coursera|udemy|linkedin/i.test(c)) {
          certifications.push(c);
        }
      });
    }
    // Also scan full resume for common certification patterns
    if (certifications.length === 0) {
      const certPatterns = resumeText.match(/(?:Oracle Certified[^\n]{0,60}|Microsoft Certified[^\n]{0,60}|Google[^\n]{0,40}Certificate[^\n]{0,40}|AWS Certified[^\n]{0,60}|HackerRank[^\n]{0,60}|Certified[^\n]{0,60}Associate[^\n]{0,40})/gi);
      if (certPatterns) {
        certPatterns.slice(0, 4).forEach((c) => certifications.push(c.trim()));
      }
    }

    // 6. Detect current role from experience/title lines
    let currentRole = '';
    const expSection = detectedSections.experience || '';
    if (expSection) {
      const titleMatch = expSection.match(/(?:software|developer|engineer|analyst|intern|manager|architect|data|devops|frontend|backend|fullstack)[^\n\r]{0,50}/i);
      if (titleMatch) currentRole = titleMatch[0].trim().split('|')[0].split('(')[0].trim();
    }
    // Leave currentRole empty when the resume does not identify one in its experience section.

    // 7. Build Dynamic Skill Catalog from ALL 28 Database Role Taxonomies
    const taxonomies = this.db.getTaxonomies();
    const dynamicSkills = new Set<string>();

    // Add strictly concrete core skills from all role taxonomies (NO loose keywords)
    for (const tax of taxonomies) {
      if (Array.isArray(tax.coreSkills)) {
        for (const core of tax.coreSkills) {
          if (core && typeof core.skill === 'string' && core.skill.trim().length >= 2) {
            dynamicSkills.add(core.skill.trim());
          }
        }
      }
      if (Array.isArray(tax.niceToHaveSkills)) {
        tax.niceToHaveSkills.forEach((item: any) => {
          const s = typeof item === 'string' ? item : item?.skill;
          if (typeof s === 'string' && s.trim().length >= 2) dynamicSkills.add(s.trim());
        });
      }
    }

    // Add essential industry programming languages & tools
    const COMMON_SKILLS = [
      'Java', 'Spring Boot', 'Spring', 'Hibernate', 'JPA', 'Microservices', 'REST APIs', 'SQL',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
      'Git', 'GitHub', 'CI/CD', 'Jenkins', 'Linux', 'Bash', 'JUnit', 'Mockito', 'Python', 'FastAPI',
      'Django', 'Flask', 'JavaScript', 'TypeScript', 'React', 'React.js', 'Next.js', 'Node.js',
      'Express', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Pandas', 'NumPy', 'Scikit-Learn',
      'Power BI', 'Tableau', 'Excel', 'Statistics', 'Machine Learning', 'Deep Learning', 'PyTorch',
      'TensorFlow', 'LLMs', 'RAG', 'Vector Databases', 'Kafka', 'GraphQL', 'Terraform', 'Postman'
    ];
    COMMON_SKILLS.forEach((s) => dynamicSkills.add(s));

    const claimed: ClaimedSkillItem[] = [];

    for (const rawSkill of Array.from(dynamicSkills)) {
      if (typeof rawSkill !== 'string' || rawSkill.trim().length < 2) continue;
      const skill = rawSkill.trim();
      // Exact word boundary matching (case-insensitive) with proper regex escaping
      const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:\\b|(?<=[^a-zA-Z0-9]))${escaped}(?:\\b|(?=[^a-zA-Z0-9]))`, 'i');
      const match = regex.exec(resumeText);

      if (match && match.index !== undefined) {
        // Extract surrounding context (up to 40 chars before, 50 chars after) as exact evidence
        const start = Math.max(0, match.index - 35);
        const end = Math.min(resumeText.length, match.index + skill.length + 45);
        const snippet = resumeText.substring(start, end).replace(/\s+/g, ' ').trim();

        // Check if skill appears in projects or experience section for practical evidence
        const inProjects = (detectedSections.projects || '').toLowerCase().includes(skill.toLowerCase());
        const inExperience = (detectedSections.experience || '').toLowerCase().includes(skill.toLowerCase());
        const inSkillsSec = (detectedSections.skills || '').toLowerCase().includes(skill.toLowerCase());

        const hasPracticalEvidence = inProjects || inExperience;
        const confidence = inSkillsSec || inProjects || inExperience ? 'explicit' : 'inferred';

        // Check if normalized skill is already claimed to avoid duplicate entries
        const norm = SkillNormalizer.normalize(skill);
        const existing = claimed.find((c) => c.normalizedSkill.toLowerCase() === norm.toLowerCase());
        if (!existing) {
          claimed.push({
            skill: norm,
            originalSkill: match[0],
            normalizedSkill: norm,
            evidenceSnippet: snippet,
            confidence,
            verifiedInText: true,
            hasPracticalEvidence
          });
        } else if (existing.originalSkill && !existing.originalSkill.toLowerCase().includes(match[0].toLowerCase())) {
          existing.originalSkill = `${existing.originalSkill}, ${match[0]}`;
        }
      }
    }

    // 8. Unrelated-Document Guard (grocery list / non-technical document test)
    // If fewer than 2 technical skills are found, the document is likely not a resume.
    // Return empty skills_claimed so the scoring engine correctly gives a near-zero score.
    const technicalSkillCount = claimed.length;
    if (technicalSkillCount < 2) {
      console.warn(`[Extractor] Only ${technicalSkillCount} technical skill(s) found. Document may not be a resume. Returning empty skills_claimed.`);
      return {
        extractionVersion: 2,
        candidateName,
        contactInfo: { email, phone, location },
        summary,
        totalYearsExperience: 0,
        currentRole,
        workHistory: [],
        education,
        certifications,
        projects,
        skillsClaimed: [] // No fabricated skills for unrelated documents
      };
    }

    return {
      extractionVersion: 2,
      candidateName,
      contactInfo: { email, phone, location },
      summary,
      totalYearsExperience,
      currentRole,
      workHistory: [],
      education,
      certifications,
      projects,
      skillsClaimed: claimed
    };
  }
}
