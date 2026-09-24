// Deterministic Benchmark Comparison Engine
// Compares validated resume skills against database role taxonomy without calling an LLM
// Identifies Matched, Missing, Partially Covered, and Irrelevant skills

import {
  RoleTaxonomyRecord,
  ClaudeStructuredExtraction,
  MatchedSkillResult,
  MissingSkillResult,
  PartiallyCoveredSkillResult,
  IrrelevantSkillResult
} from '../types';
import { SkillNormalizer } from './skillNormalizer';

export interface ComparisonOutput {
  matchedSkills: MatchedSkillResult[];
  missingSkills: MissingSkillResult[];
  partialSkills: PartiallyCoveredSkillResult[];
  uncertainSkills: { skill: string; reason: string; evidenceQuote: string }[];
  irrelevantSkills: IrrelevantSkillResult[];
  whatToLearnNext: {
    skill: string;
    severity: 'Critical' | 'Important' | 'Minor';
    priority: number;
    roadmapSkill: string;
    actionDescription: string;
  }[];
}

export class ComparisonEngine {
  public static compare(
    extraction: ClaudeStructuredExtraction,
    taxonomy: RoleTaxonomyRecord
  ): ComparisonOutput {
    const verifiedSkills = extraction.skillsClaimed.filter((s) => s.verifiedInText);

    // Build map of normalized candidate skills
    const candidateSkillsMap = new Map<string, typeof verifiedSkills[0]>();
    verifiedSkills.forEach((s) => {
      const norm = SkillNormalizer.normalize(s.skill).toLowerCase();
      candidateSkillsMap.set(norm, s);
      // Also register original skill lowercased
      if (s.originalSkill) {
        candidateSkillsMap.set(s.originalSkill.trim().toLowerCase(), s);
      }
    });

    const matchedSkills: MatchedSkillResult[] = [];
    const missingSkills: MissingSkillResult[] = [];
    const partialSkills: PartiallyCoveredSkillResult[] = [];
    const uncertainSkills: { skill: string; reason: string; evidenceQuote: string }[] = [];
    const matchedTaxonomySkills = new Set<string>();

    // Canonical equivalents table for taxonomy requirements
    const STRICT_EQUIVALENTS: Record<string, string[]> = {
      'java': ['java', 'core java', 'java 8', 'java 11', 'java 17', 'java 21'],
      'spring boot': ['spring boot', 'springboot', 'spring-boot'],
      'rest apis': ['rest api', 'rest apis', 'restful api', 'restful apis', 'rest'],
      'rest api': ['rest api', 'rest apis', 'restful api', 'restful apis', 'rest'],
      'sql': ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'sqlite', 'mariadb'],
      'jpa / hibernate': ['jpa', 'hibernate', 'spring data jpa', 'hibernate orm'],
      'microservices': ['microservices', 'microservice', 'microservice architecture'],
      'git': ['git', 'github', 'gitlab'],
      'backend testing (junit/mockito)': ['junit', 'mockito', 'unit testing'],
      'react.js': ['react', 'react.js', 'reactjs'],
      'react': ['react', 'react.js', 'reactjs'],
      'javascript': ['javascript', 'js', 'es6'],
      'typescript': ['typescript', 'ts'],
      'docker': ['docker', 'docker container'],
      'kubernetes': ['kubernetes', 'k8s'],
      'aws': ['aws', 'amazon web services'],
      'python': ['python', 'python 3']
    };

    // 1. Evaluate Core Taxonomy Skills
    for (const core of taxonomy.coreSkills) {
      const normCore = SkillNormalizer.normalize(core.skill).toLowerCase();
      const directCandidates = STRICT_EQUIVALENTS[normCore] || [normCore];

      let foundCandidateSkill: typeof verifiedSkills[0] | undefined = undefined;

      for (const candidateKey of directCandidates) {
        if (candidateSkillsMap.has(candidateKey)) {
          foundCandidateSkill = candidateSkillsMap.get(candidateKey);
          break;
        }
      }

      // Special check for composite skills like "HTML & CSS"
      if (!foundCandidateSkill && normCore === 'html & css') {
        const hasHtml = candidateSkillsMap.has('html');
        const hasCss = candidateSkillsMap.has('css');
        if (hasHtml && hasCss) {
          foundCandidateSkill = candidateSkillsMap.get('html') || candidateSkillsMap.get('css');
        } else if (hasHtml || hasCss) {
          const single = hasHtml ? candidateSkillsMap.get('html')! : candidateSkillsMap.get('css')!;
          partialSkills.push({
            skill: core.skill,
            normalizedSkill: core.normalizedSkill,
            taxonomyWeight: core.weight,
            evidenceQuote: single.evidenceSnippet,
            reason: hasHtml ? 'Resume demonstrates HTML but CSS was not detected.' : 'Resume demonstrates CSS but HTML was not detected.',
            recommendedImprovement: 'Demonstrate responsive modern CSS along with semantic HTML.',
            category: core.category
          });
          matchedTaxonomySkills.add(normCore);
          continue;
        }
      }

      if (foundCandidateSkill) {
        matchedTaxonomySkills.add(normCore);
        const isPractical = !!foundCandidateSkill.hasPracticalEvidence;
        const isInferred = foundCandidateSkill.confidence === 'inferred';

        // Check if it qualifies as Partially Covered vs Matched
        if (isInferred || (!isPractical && core.weight >= 8)) {
          partialSkills.push({
            skill: core.skill,
            normalizedSkill: core.normalizedSkill,
            taxonomyWeight: core.weight,
            evidenceQuote: foundCandidateSkill.evidenceSnippet,
            reason: isInferred
              ? 'Skill inferred from context without explicit keyword declaration.'
              : 'Skill listed in resume but lacks hands-on project or work experience evidence.',
            recommendedImprovement: `Implement a production-grade portfolio project featuring ${core.skill}.`,
            category: core.category
          });
        }

        matchedSkills.push({
          skill: core.skill,
          normalizedSkill: core.normalizedSkill,
          taxonomyWeight: core.weight,
          confidence: foundCandidateSkill.confidence,
          evidenceQuote: foundCandidateSkill.evidenceSnippet,
          practicalEvidence: isPractical,
          sourceSection: foundCandidateSkill.sourceSection || 'Technical Skills',
          category: core.category
        });
      } else {
        // Check for general ambiguous mentions (e.g. "cloud" when AWS is required)
        const resumeFull = (extraction.skillsClaimed || []).map(s => s.evidenceSnippet).join(' ').toLowerCase();
        let isAmbiguous = false;
        if (normCore.includes('cloud') || normCore.includes('aws')) {
          if (resumeFull.includes('cloud') && !resumeFull.includes('aws')) {
            isAmbiguous = true;
            uncertainSkills.push({
              skill: core.skill,
              reason: 'General cloud concepts mentioned in resume, but specific platform (AWS) was not identified.',
              evidenceQuote: 'cloud'
            });
          }
        }

        if (!isAmbiguous) {
          // Genuine Missing Skill - DO NOT add to resume profile!
          const severity: MissingSkillResult['severity'] =
            core.weight >= 8 ? 'Critical' : core.weight >= 5 ? 'Important' : 'Minor';

          missingSkills.push({
            skill: core.skill,
            normalizedSkill: core.normalizedSkill,
            taxonomyWeight: core.weight,
            severity,
            whyItMatters: core.description,
            category: core.category,
            roadmapAction: `Learn ${core.skill}`
          });
        }
      }
    }

    // Sort missing skills by weight descending
    missingSkills.sort((a, b) => b.taxonomyWeight - a.taxonomyWeight);

    // 2. Identify Irrelevant Skills (Candidate skills not in role taxonomy)
    const irrelevantSkills: IrrelevantSkillResult[] = [];
    for (const cand of verifiedSkills) {
      const candNorm = SkillNormalizer.normalize(cand.skill).toLowerCase();
      const isCore = taxonomy.coreSkills.some(
        (c) => SkillNormalizer.normalize(c.skill).toLowerCase() === candNorm ||
          c.keywords.some((kw) => kw.toLowerCase() === cand.skill.toLowerCase())
      );
      const isNice = taxonomy.niceToHaveSkills.some(
        (n) => SkillNormalizer.normalize(n.skill).toLowerCase() === candNorm
      );

      if (!isCore && !isNice) {
        irrelevantSkills.push({
          skill: cand.skill,
          evidenceQuote: cand.evidenceSnippet,
          confidence: cand.confidence
        });
      }
    }

    // 3. Generate "What To Learn Next" items
    const whatToLearnNext: ComparisonOutput['whatToLearnNext'] = [];
    let priorityCounter = 1;

    for (const missing of missingSkills) {
      whatToLearnNext.push({
        skill: missing.skill,
        severity: missing.severity,
        priority: priorityCounter++,
        roadmapSkill: missing.skill,
        actionDescription: `Master ${missing.skill}: ${missing.whyItMatters}`
      });
      if (whatToLearnNext.length >= 5) break;
    }

    for (const partial of partialSkills) {
      if (whatToLearnNext.length >= 6) break;
      whatToLearnNext.push({
        skill: partial.skill,
        severity: 'Important',
        priority: priorityCounter++,
        roadmapSkill: partial.skill,
        actionDescription: `Strengthen ${partial.skill}: ${partial.recommendedImprovement}`
      });
    }

    return {
      matchedSkills,
      missingSkills,
      partialSkills,
      uncertainSkills,
      irrelevantSkills,
      whatToLearnNext
    };
  }
}
