// Transparent 0-100 Scoring Service
// Strictly deterministic, reproducible, and explainable calculations across 4 tiers:
// 1. Skill Coverage (40%)
// 2. Depth of Experience (25%)
// 3. Practical Evidence (20%)
// 4. Education & Certifications (15%)

import {
  RoleTaxonomyRecord,
  ClaudeStructuredExtraction,
  ScoreBreakdown,
  AnalysisConfidence,
  AtsBreakdown,
  SkillGapScoreBreakdown
} from '../types';
import { ComparisonOutput } from './comparisonEngine';

export interface ScoringResult {
  scoreBreakdown: ScoreBreakdown;
  skillGapScore: SkillGapScoreBreakdown;
  atsScore: AtsBreakdown;
  confidenceRating: AnalysisConfidence;
  confidenceExplanation: string;
  warnings: string[];
}

export class ScoringService {
  public static calculateScore(
    comparison: ComparisonOutput,
    taxonomy: RoleTaxonomyRecord,
    extraction: ClaudeStructuredExtraction,
    wordCount: number
  ): ScoringResult {
    const warnings: string[] = [];

    // --- 1. Skill Coverage (40%) ---
    const totalCoreWeight = taxonomy.coreSkills.reduce((acc, s) => acc + s.weight, 0);
    const matchedCoreWeight = comparison.matchedSkills.reduce((acc, s) => acc + s.taxonomyWeight, 0);

    const rawCoverageScore = totalCoreWeight > 0 ? (matchedCoreWeight / totalCoreWeight) * 40 : 0;
    const skillCoverage = Math.round(Math.min(40, Math.max(0, rawCoverageScore)));

    const skillCoverageFormula = `(${matchedCoreWeight} matched core weight / ${totalCoreWeight} total taxonomy core weight) × 40 = ${skillCoverage} / 40 pts`;

    // --- 2. Depth of Experience (25%) ---
    // Factors: explicit evidence ratio (10 pts), total years experience (10 pts), seniority signals (5 pts)
    const totalMatched = comparison.matchedSkills.length;
    const explicitCount = comparison.matchedSkills.filter((s) => s.confidence === 'explicit').length;
    const explicitRatio = totalMatched > 0 ? explicitCount / totalMatched : 0;
    const explicitPoints = Math.round(explicitRatio * 10);

    const yearsExp = Math.max(0, extraction.totalYearsExperience || 0);
    const yearsPoints = Math.round(Math.min(10, yearsExp >= 4 ? 10 : yearsExp >= 2 ? 7 : yearsExp >= 1 ? 5 : 3));

    // Seniority signals present in responsibilities or projects
    let seniorityPoints = 0;
    if (extraction.workHistory.length >= 2 || extraction.projects.length >= 2) seniorityPoints += 3;
    if (yearsExp >= 3) seniorityPoints += 2;
    const depthOfExperience = Math.min(25, explicitPoints + yearsPoints + seniorityPoints);

    const depthFormula = `Explicit evidence (${explicitPoints}/10 pts) + Experience duration (${yearsPoints}/10 pts) + Seniority signals (${seniorityPoints}/5 pts) = ${depthOfExperience} / 25 pts`;

    // --- 3. Practical Evidence (20%) ---
    // Weighted ratio of matched skills demonstrated through projects or work history vs only listed
    const practicalCount = comparison.matchedSkills.filter((s) => s.practicalEvidence).length;
    const practicalRatio = totalMatched > 0 ? practicalCount / totalMatched : 0;
    const practicalEvidence = Math.round(Math.min(20, practicalRatio * 20));

    const practicalFormula = `(${practicalCount} practically verified in projects & work history / ${totalMatched} total matched skills) × 20 = ${practicalEvidence} / 20 pts`;

    // --- 4. Education & Certifications Relevance (15%) ---
    let educationPoints = 0;
    const degrees = extraction.education.map((e) => e.degree.toLowerCase()).join(' ');
    const institutions = extraction.education.map((e) => e.institution.toLowerCase()).join(' ');

    if (degrees.includes('b.tech') || degrees.includes('b.e') || degrees.includes('m.tech') || degrees.includes('computer science') || degrees.includes('information technology')) {
      educationPoints += 10;
    } else if (degrees.includes('bca') || degrees.includes('mca') || degrees.includes('b.sc') || degrees.length > 2) {
      educationPoints += 8;
    } else if (extraction.education.length > 0) {
      educationPoints += 5;
    }

    // Certifications relevance
    const certCount = extraction.certifications.length;
    const certPoints = Math.min(5, certCount * 2);
    const educationCertification = Math.min(15, educationPoints + certPoints);

    const educationFormula = `Accredited degree relevance (${educationPoints}/10 pts) + Professional certifications (${certPoints}/5 pts) = ${educationCertification} / 15 pts`;

    // --- Skill Gap Score (0 - 100%) ---
    // Measures how well candidate's demonstrated skills match the selected opportunity
    const sgTotalCoreWeight = taxonomy.coreSkills.reduce((acc, s) => acc + s.weight, 0);
    const sgMatchedCoreWeight = comparison.matchedSkills.reduce((acc, s) => acc + s.taxonomyWeight, 0);
    const sgPartialCoreWeight = comparison.partialSkills.reduce((acc, s) => acc + (s.taxonomyWeight * 0.5), 0);

    const coreMatchRatio = sgTotalCoreWeight > 0 ? (sgMatchedCoreWeight + sgPartialCoreWeight) / sgTotalCoreWeight : 0;
    const baseSkillGap = Math.round(coreMatchRatio * 100);

    const preferredTotal = (taxonomy.niceToHaveSkills || []).length;
    const preferredSkillsMatched = comparison.matchedSkills.filter(s =>
      (taxonomy.niceToHaveSkills || []).some(n => n.skill.toLowerCase() === s.skill.toLowerCase())
    ).length;
    const preferredBonus = preferredTotal > 0 ? Math.round((preferredSkillsMatched / preferredTotal) * 8) : 0;

    const criticalMissingCount = comparison.missingSkills.filter(s => s.severity === 'Critical').length;
    const skillGapValue = Math.min(100, Math.max(0, baseSkillGap + preferredBonus));

    const skillGapStatus: SkillGapScoreBreakdown['status'] =
      skillGapValue >= 75 ? 'High Match' : skillGapValue >= 50 ? 'Moderate Gap' : 'Significant Gap';

    const skillGapScore: SkillGapScoreBreakdown = {
      score: skillGapValue,
      status: skillGapStatus,
      requiredSkillsTotal: taxonomy.coreSkills.length,
      requiredSkillsMatched: comparison.matchedSkills.length,
      preferredSkillsTotal: preferredTotal,
      preferredSkillsMatched,
      criticalMissingCount,
      partialMatchesCount: comparison.partialSkills.length,
      matchPercentage: skillGapValue,
      explanation: `${comparison.matchedSkills.length} of ${taxonomy.coreSkills.length} required skills matched (${comparison.partialSkills.length} partial). ${criticalMissingCount} critical skills missing.`
    };

    // --- ATS / Resume Quality Score (0 - 100) ---
    // Independent resume document quality & parsing health score
    let contactInfoScore = 0;
    if (extraction.candidateName && extraction.candidateName !== 'Candidate') contactInfoScore += 4;
    if (extraction.contactInfo?.email && extraction.contactInfo.email.includes('@')) contactInfoScore += 3;
    if (extraction.contactInfo?.phone) contactInfoScore += 2;
    if (extraction.contactInfo?.location) contactInfoScore += 1;

    const sectionsPassed = [
      { name: 'Contact & Header', passed: contactInfoScore >= 5 },
      { name: 'Technical Skills Section', passed: extraction.skillsClaimed.length >= 2 },
      { name: 'Projects / Work Experience', passed: extraction.projects.length > 0 || extraction.workHistory.length > 0 },
      { name: 'Education & Credentials', passed: extraction.education.length > 0 }
    ];

    const structureScore = Math.round((sectionsPassed.filter(s => s.passed).length / sectionsPassed.length) * 10);
    const sectionClarityScore = Math.min(10, (extraction.summary ? 2 : 0) + (extraction.skillsClaimed.length ? 3 : 0) + (extraction.projects.length ? 3 : 0) + (extraction.education.length ? 2 : 0));
    const technicalSkillsCount = extraction.skillsClaimed.length;
    const skillsPresentationScore = Math.min(10, technicalSkillsCount >= 6 ? 10 : technicalSkillsCount >= 3 ? 7 : technicalSkillsCount >= 1 ? 4 : 1);

    let experienceClarityScore = 5;
    if (extraction.workHistory.length > 0) {
      experienceClarityScore += 5;
      if (extraction.workHistory.some(w => w.responsibilities && w.responsibilities.length >= 2)) experienceClarityScore += 5;
    } else if (extraction.projects.length >= 2) {
      experienceClarityScore += 6;
    }

    let projectClarityScore = 0;
    if (extraction.projects.length >= 2) projectClarityScore = 15;
    else if (extraction.projects.length === 1) projectClarityScore = 10;
    else if (extraction.workHistory.length > 0) projectClarityScore = 8;

    const educationScore = extraction.education.length > 0 ? (extraction.certifications.length > 0 ? 10 : 8) : 3;
    const formattingScore = wordCount >= 120 && wordCount <= 1600 ? 10 : wordCount < 60 ? 4 : 7;
    const readabilityScore = wordCount >= 200 && wordCount <= 900 ? 10 : wordCount >= 100 ? 7 : 4;

    const rawAts = contactInfoScore + structureScore + sectionClarityScore + skillsPresentationScore +
      experienceClarityScore + projectClarityScore + educationScore + formattingScore + readabilityScore;
    const atsScoreValue = Math.min(100, Math.max(15, rawAts));

    const atsStatus: AtsBreakdown['status'] =
      atsScoreValue >= 75 ? 'Strong ATS Pass' : atsScoreValue >= 55 ? 'Competitive ATS Pass' : 'Needs Optimization';

    const strengths: string[] = [];
    const issues: string[] = [];
    const parsingRisks: string[] = [];
    const formattingRecommendations: string[] = [];

    if (contactInfoScore >= 8) strengths.push('Complete contact information with verified email and phone.');
    else issues.push('Incomplete contact details (ensure email, phone, and city/location are present).');

    if (skillsPresentationScore >= 8) strengths.push('Explicit, well-organized technical skills section.');
    else issues.push('Technical skills could be organized into clear categories (Languages, Databases, Tools).');

    if (projectClarityScore >= 12) strengths.push('Well-defined projects with explicit technologies and descriptions.');
    else issues.push('Add 1-2 detailed portfolio projects highlighting backend technologies.');

    if (wordCount < 150) parsingRisks.push('Document is very short (under 150 words). May be missing details.');
    if (!extraction.education.length) issues.push('No formal education or degree detected.');
    if (formattingScore < 8) formattingRecommendations.push('Use standard, clean single-column formatting for optimal ATS parsing.');

    const atsScore: AtsBreakdown = {
      score: atsScoreValue,
      status: atsStatus,
      contactInfoScore,
      structureScore,
      sectionClarityScore,
      skillsPresentationScore,
      experienceClarityScore,
      projectClarityScore,
      educationScore,
      formattingScore,
      readabilityScore,
      sectionsPassed,
      strengths,
      issues,
      parsingRisks,
      formattingRecommendations
    };

    // --- Legacy Score Breakdown (preserved for compatibility) ---
    const overallScore = skillGapValue;

    // --- Score Confidence Rating ---
    let confidenceRating: AnalysisConfidence = 'High';
    let confidenceExplanation = 'High confidence analysis based on robust, multi-section resume evidence.';

    if (wordCount < 80 || comparison.matchedSkills.length === 0) {
      confidenceRating = 'Low';
      confidenceExplanation = 'Low confidence analysis — limited reliable resume evidence was available.';
      warnings.push('Low confidence analysis — limited reliable resume evidence was available.');
    } else if (wordCount < 150 || comparison.matchedSkills.length < 3) {
      confidenceRating = 'Medium';
      confidenceExplanation = 'Medium confidence analysis — concise resume content with moderate signal.';
    }

    if (comparison.matchedSkills.length === 0 && taxonomy.coreSkills.length >= 4) {
      warnings.push('No technical skills from this role\'s taxonomy were found in the uploaded document.');
    }

    return {
      scoreBreakdown: {
        overallScore,
        skillCoverage,
        depthOfExperience,
        practicalEvidence,
        educationCertification,
        calculationExplanation: {
          skillCoverageFormula,
          depthFormula,
          practicalFormula,
          educationFormula
        }
      },
      skillGapScore,
      atsScore,
      confidenceRating,
      confidenceExplanation,
      warnings
    };
  }
}
