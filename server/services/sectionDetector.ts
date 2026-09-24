// Resume Section Detector and Language Identifier
// Uses regex heuristics and structural markers to separate resume sections and identify language

export interface DetectedSections {
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string;
  projects?: string;
  certifications?: string;
}

export interface LanguageDetectionResult {
  language: string;
  isSupported: boolean;
  warning?: string;
}

export class SectionDetector {
  /**
   * Identifies logical resume sections from extracted text.
   * If sections cannot be reliably detected, returns empty object (does not invent sections).
   */
  public static detectSections(text: string): DetectedSections {
    const lines = text.split('\n');
    const sections: Record<string, string[]> = {};
    let currentSection: string | null = null;

    const SECTION_PATTERNS: Record<string, RegExp> = {
      summary: /^(professional\s+summary|summary|profile|about\s+me|career\s+objective|objective)\b/i,
      experience: /^(work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history|internships?|experience\s+&?\s+internships?)\b/i,
      education: /^(education|academic\s+background|academics|qualifications|educational\s+background)\b/i,
      skills: /^(technical\s+skills|skills|core\s+competencies|technologies|skills\s+&?\s+tools|key\s+skills|tech\s+stack)\b/i,
      projects: /^(projects|personal\s+projects|academic\s+projects|key\s+projects|notable\s+projects|experience\s*&\s*projects?)\b/i,
      certifications: /^(certifications?|licenses?\s+&?\s+certifications?|certificates?|courses?|achievements?|certifications?\s+&?\s+achievements?|awards?\s+&?\s+certifications?)\b/i
    };

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;

      // Check if line looks like a header (short line, matches pattern)
      if (line.length <= 45) {
        let matched = false;
        for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
          if (pattern.test(line.replace(/[:\-_#*]/g, '').trim())) {
            currentSection = key;
            if (!sections[currentSection]) sections[currentSection] = [];
            matched = true;
            break;
          }
        }
        if (matched) continue;
      }

      if (currentSection) {
        sections[currentSection].push(rawLine);
      }
    }

    const result: DetectedSections = {};
    for (const [key, linesArr] of Object.entries(sections)) {
      if (linesArr.length > 0) {
        result[key as keyof DetectedSections] = linesArr.join('\n').trim();
      }
    }

    return result;
  }

  /**
   * Detects primary document language using common character sets and stopwords.
   */
  public static detectLanguage(text: string): LanguageDetectionResult {
    const lower = text.toLowerCase();

    // Check non-Latin scripts
    const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
    if (devanagariCount > 30) {
      return {
        language: 'Hindi',
        isSupported: false,
        warning: 'This resume appears to be written primarily in Hindi. Analysis support may vary.'
      };
    }

    const spanishWords = ['experiencia', 'educación', 'habilidades', 'proyectos', 'resumen', 'tecnología', 'años'];
    const frenchWords = ['expérience', 'formation', 'compétences', 'projets', 'résumé', 'développeur'];
    const germanWords = ['berufserfahrung', 'ausbildung', 'kenntnisse', 'projekte', 'zusammenfassung'];

    let spanishCount = 0;
    spanishWords.forEach(w => { if (lower.includes(w)) spanishCount++; });

    let frenchCount = 0;
    frenchWords.forEach(w => { if (lower.includes(w)) frenchCount++; });

    let germanCount = 0;
    germanWords.forEach(w => { if (lower.includes(w)) germanCount++; });

    if (spanishCount >= 3) {
      return {
        language: 'Spanish',
        isSupported: true,
        warning: 'This resume appears to be written primarily in Spanish. Analysis support may vary.'
      };
    }

    if (frenchCount >= 3) {
      return {
        language: 'French',
        isSupported: true,
        warning: 'This resume appears to be written primarily in French. Analysis support may vary.'
      };
    }

    if (germanCount >= 3) {
      return {
        language: 'German',
        isSupported: true,
        warning: 'This resume appears to be written primarily in German. Analysis support may vary.'
      };
    }

    return {
      language: 'English',
      isSupported: true
    };
  }
}
