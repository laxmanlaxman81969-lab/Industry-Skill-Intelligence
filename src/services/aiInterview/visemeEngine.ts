// Real-Time Speech-to-Viseme & Facial Animation Engine
// Maps spoken text and speech synthesis events to anatomically accurate visemes and facial targets

export type VisemeId =
  | 'REST'  // Silence / pause / resting neutral
  | 'AA'    // "father", "car", "Java", "far" - large open jaw
  | 'AE'    // "cat", "backend", "application" - wide spread open jaw
  | 'AH'    // "cup", "but", "approach", "cut" - mid open jaw
  | 'AO'    // "all", "call", "dog", "broad" - rounded open jaw
  | 'EH'    // "bed", "engineer", "explain" - mid jaw, slightly spread
  | 'ER'    // "bird", "service", "internally" - mid-low jaw, curled lips
  | 'IH'    // "sit", "in", "Spring", "interview" - close-mid jaw, spread
  | 'IY'    // "see", "deep", "API", "dependency" - narrow jaw, wide smile spread
  | 'OH'    // "go", "code", "role", "scalable" - rounded oval jaw
  | 'OO'    // "boot", "too", "solution", "group" - small tight puckered lips
  | 'UH'    // "book", "good", "put", "could" - relaxed small round
  | 'MBP'   // "p", "b", "m" - bilabial lip closure (lips firmly pressed)
  | 'FV'    // "f", "v" - labiodental (lower lip tucked under upper incisors)
  | 'L'     // "l", "level", "scalable" - tongue tip behind upper incisors
  | 'TH'    // "th", "think", "with", "method" - interdental tongue tip
  | 'TD'    // "t", "d", "n" - alveolar tongue tap
  | 'KG'    // "k", "g", "ng" - velar tongue elevation, open teeth
  | 'SH'    // "sh", "ch", "j" - flared lips, narrow teeth
  | 'SZ'    // "s", "z" - alveolar friction, teeth almost closed
  | 'CH'    // "ch", "j", "tch" - post-alveolar affricate
  | 'PP'    // "p", "b", "m" - bilabial closure (alias for MBP)
  | 'R'     // "r", "rest", "architecture" - rounded lips slightly forward
  | 'W';    // "w", "welcome", "work", "one" - tight puckered glide

export interface VisemeTarget {
  jawOpen: number;       // 0 (closed) to 1.0 (maximum natural opening ~14px)
  mouthWidth: number;    // -0.5 (puckered/narrow) to +0.5 (wide/spread smile)
  lipUpperLift: number;  // 0 to 1.0 (lifts upper vermilion, exposes upper teeth)
  lipLowerDrop: number;  // 0 to 1.0 (pulls lower lip down with jaw)
  lipPucker: number;     // 0 to 1.0 (rounds lips forward for OO, W, OH)
  chinDrop: number;      // 0 to 1.0 (anatomical chin displacement following jaw)
  cheekTension: number;  // 0 to 1.0 (subtle cheek lift/spread for IY, EH, SZ)
  teethUpperVis: number; // 0 to 1.0 (visibility of upper teeth)
  teethLowerVis: number; // 0 to 1.0 (visibility of lower teeth)
  tonguePose: 'none' | 'behind_upper' | 'interdental' | 'floor';
}

export const VISEME_TARGETS: Record<VisemeId, VisemeTarget> = {
  REST: {
    jawOpen: 0.0,
    mouthWidth: 0.0,
    lipUpperLift: 0.0,
    lipLowerDrop: 0.0,
    lipPucker: 0.0,
    chinDrop: 0.0,
    cheekTension: 0.0,
    teethUpperVis: 0.0,
    teethLowerVis: 0.0,
    tonguePose: 'none'
  },
  AA: {
    jawOpen: 0.88,
    mouthWidth: 0.12,
    lipUpperLift: 0.35,
    lipLowerDrop: 0.85,
    lipPucker: 0.05,
    chinDrop: 0.82,
    cheekTension: 0.15,
    teethUpperVis: 0.70,
    teethLowerVis: 0.45,
    tonguePose: 'floor'
  },
  AE: {
    jawOpen: 0.75,
    mouthWidth: 0.38,
    lipUpperLift: 0.45,
    lipLowerDrop: 0.70,
    lipPucker: 0.0,
    chinDrop: 0.70,
    cheekTension: 0.35,
    teethUpperVis: 0.85,
    teethLowerVis: 0.50,
    tonguePose: 'floor'
  },
  AH: {
    jawOpen: 0.60,
    mouthWidth: 0.08,
    lipUpperLift: 0.25,
    lipLowerDrop: 0.55,
    lipPucker: 0.0,
    chinDrop: 0.55,
    cheekTension: 0.10,
    teethUpperVis: 0.55,
    teethLowerVis: 0.30,
    tonguePose: 'floor'
  },
  AO: {
    jawOpen: 0.72,
    mouthWidth: -0.15,
    lipUpperLift: 0.30,
    lipLowerDrop: 0.65,
    lipPucker: 0.45,
    chinDrop: 0.68,
    cheekTension: 0.05,
    teethUpperVis: 0.45,
    teethLowerVis: 0.25,
    tonguePose: 'floor'
  },
  EH: {
    jawOpen: 0.52,
    mouthWidth: 0.25,
    lipUpperLift: 0.35,
    lipLowerDrop: 0.50,
    lipPucker: 0.0,
    chinDrop: 0.48,
    cheekTension: 0.28,
    teethUpperVis: 0.75,
    teethLowerVis: 0.35,
    tonguePose: 'none'
  },
  ER: {
    jawOpen: 0.38,
    mouthWidth: -0.05,
    lipUpperLift: 0.20,
    lipLowerDrop: 0.35,
    lipPucker: 0.25,
    chinDrop: 0.35,
    cheekTension: 0.12,
    teethUpperVis: 0.45,
    teethLowerVis: 0.20,
    tonguePose: 'behind_upper'
  },
  IH: {
    jawOpen: 0.35,
    mouthWidth: 0.28,
    lipUpperLift: 0.30,
    lipLowerDrop: 0.32,
    lipPucker: 0.0,
    chinDrop: 0.32,
    cheekTension: 0.30,
    teethUpperVis: 0.70,
    teethLowerVis: 0.30,
    tonguePose: 'none'
  },
  IY: {
    jawOpen: 0.24,
    mouthWidth: 0.48,
    lipUpperLift: 0.45,
    lipLowerDrop: 0.22,
    lipPucker: 0.0,
    chinDrop: 0.22,
    cheekTension: 0.55,
    teethUpperVis: 0.85,
    teethLowerVis: 0.40,
    tonguePose: 'none'
  },
  OH: {
    jawOpen: 0.65,
    mouthWidth: -0.22,
    lipUpperLift: 0.25,
    lipLowerDrop: 0.58,
    lipPucker: 0.60,
    chinDrop: 0.62,
    cheekTension: 0.0,
    teethUpperVis: 0.35,
    teethLowerVis: 0.15,
    tonguePose: 'floor'
  },
  OO: {
    jawOpen: 0.28,
    mouthWidth: -0.42,
    lipUpperLift: 0.18,
    lipLowerDrop: 0.25,
    lipPucker: 0.90,
    chinDrop: 0.26,
    cheekTension: 0.0,
    teethUpperVis: 0.15,
    teethLowerVis: 0.05,
    tonguePose: 'none'
  },
  UH: {
    jawOpen: 0.34,
    mouthWidth: -0.18,
    lipUpperLift: 0.20,
    lipLowerDrop: 0.30,
    lipPucker: 0.45,
    chinDrop: 0.30,
    cheekTension: 0.05,
    teethUpperVis: 0.30,
    teethLowerVis: 0.10,
    tonguePose: 'none'
  },
  MBP: {
    jawOpen: 0.02,
    mouthWidth: -0.05,
    lipUpperLift: -0.05,
    lipLowerDrop: -0.05,
    lipPucker: 0.0,
    chinDrop: 0.05,
    cheekTension: 0.05,
    teethUpperVis: 0.0,
    teethLowerVis: 0.0,
    tonguePose: 'none'
  },
  FV: {
    jawOpen: 0.18,
    mouthWidth: 0.10,
    lipUpperLift: 0.25,
    lipLowerDrop: 0.05,
    lipPucker: 0.0,
    chinDrop: 0.16,
    cheekTension: 0.15,
    teethUpperVis: 0.80,
    teethLowerVis: 0.0,
    tonguePose: 'none'
  },
  L: {
    jawOpen: 0.32,
    mouthWidth: 0.15,
    lipUpperLift: 0.25,
    lipLowerDrop: 0.28,
    lipPucker: 0.0,
    chinDrop: 0.28,
    cheekTension: 0.15,
    teethUpperVis: 0.65,
    teethLowerVis: 0.20,
    tonguePose: 'behind_upper'
  },
  TH: {
    jawOpen: 0.22,
    mouthWidth: 0.12,
    lipUpperLift: 0.25,
    lipLowerDrop: 0.20,
    lipPucker: 0.0,
    chinDrop: 0.20,
    cheekTension: 0.12,
    teethUpperVis: 0.70,
    teethLowerVis: 0.25,
    tonguePose: 'interdental'
  },
  TD: {
    jawOpen: 0.20,
    mouthWidth: 0.14,
    lipUpperLift: 0.28,
    lipLowerDrop: 0.18,
    lipPucker: 0.0,
    chinDrop: 0.18,
    cheekTension: 0.18,
    teethUpperVis: 0.65,
    teethLowerVis: 0.25,
    tonguePose: 'behind_upper'
  },
  KG: {
    jawOpen: 0.40,
    mouthWidth: 0.05,
    lipUpperLift: 0.20,
    lipLowerDrop: 0.35,
    lipPucker: 0.0,
    chinDrop: 0.35,
    cheekTension: 0.10,
    teethUpperVis: 0.50,
    teethLowerVis: 0.30,
    tonguePose: 'none'
  },
  SH: {
    jawOpen: 0.22,
    mouthWidth: -0.12,
    lipUpperLift: 0.25,
    lipLowerDrop: 0.20,
    lipPucker: 0.55,
    chinDrop: 0.20,
    cheekTension: 0.15,
    teethUpperVis: 0.60,
    teethLowerVis: 0.40,
    tonguePose: 'none'
  },
  SZ: {
    jawOpen: 0.14,
    mouthWidth: 0.25,
    lipUpperLift: 0.35,
    lipLowerDrop: 0.12,
    lipPucker: 0.0,
    chinDrop: 0.14,
    cheekTension: 0.35,
    teethUpperVis: 0.80,
    teethLowerVis: 0.55,
    tonguePose: 'none'
  },
  CH: {
    jawOpen: 0.28,
    mouthWidth: -0.15,
    lipUpperLift: 0.30,
    lipLowerDrop: 0.25,
    lipPucker: 0.50,
    chinDrop: 0.26,
    cheekTension: 0.18,
    teethUpperVis: 0.70,
    teethLowerVis: 0.45,
    tonguePose: 'behind_upper'
  },
  PP: {
    jawOpen: 0.02,
    mouthWidth: -0.05,
    lipUpperLift: -0.05,
    lipLowerDrop: -0.05,
    lipPucker: 0.0,
    chinDrop: 0.05,
    cheekTension: 0.05,
    teethUpperVis: 0.0,
    teethLowerVis: 0.0,
    tonguePose: 'none'
  },
  R: {
    jawOpen: 0.30,
    mouthWidth: -0.15,
    lipUpperLift: 0.15,
    lipLowerDrop: 0.26,
    lipPucker: 0.40,
    chinDrop: 0.28,
    cheekTension: 0.08,
    teethUpperVis: 0.40,
    teethLowerVis: 0.15,
    tonguePose: 'behind_upper'
  },
  W: {
    jawOpen: 0.20,
    mouthWidth: -0.38,
    lipUpperLift: 0.15,
    lipLowerDrop: 0.18,
    lipPucker: 0.85,
    chinDrop: 0.18,
    cheekTension: 0.0,
    teethUpperVis: 0.20,
    teethLowerVis: 0.05,
    tonguePose: 'none'
  }
};

// Specialized English technical dictionary for interview domain
const TECHNICAL_DICTIONARY: Record<string, VisemeId[]> = {
  // Common programming terms
  java: ['CH', 'AA', 'FV', 'AA'],
  spring: ['SZ', 'PP', 'R', 'IH', 'KG'],
  boot: ['MBP', 'OO', 'TD'],
  dependency: ['TD', 'EH', 'PP', 'EH', 'TD', 'EH', 'SZ', 'IY'],
  injection: ['IH', 'TD', 'SH', 'EH', 'KG', 'SH', 'AH', 'TD'],
  hashmap: ['EH', 'AE', 'SH', 'MBP', 'AE', 'PP'],
  rest: ['R', 'EH', 'SZ', 'TD'],
  api: ['AE', 'IY', 'PP', 'IY', 'AA', 'IY'],
  microservices: ['MBP', 'AA', 'IY', 'KG', 'R', 'OH', 'SZ', 'ER', 'FV', 'IH', 'SZ', 'IH', 'SZ'],
  scalable: ['SZ', 'KG', 'AE', 'L', 'AH', 'MBP', 'L'],
  architecture: ['AA', 'R', 'KG', 'IH', 'TD', 'EH', 'KG', 'CH', 'ER'],
  backend: ['MBP', 'AE', 'KG', 'EH', 'TD'],
  developer: ['TD', 'EH', 'FV', 'EH', 'L', 'OH', 'PP', 'ER'],
  systems: ['SZ', 'IH', 'SZ', 'TD', 'EH', 'MBP', 'SZ'],
  framework: ['FV', 'R', 'AE', 'MBP', 'W', 'ER', 'KG'],
  database: ['TD', 'AE', 'TD', 'AH', 'MBP', 'EH', 'IY', 'SZ'],
  interview: ['IH', 'TD', 'ER', 'FV', 'IY', 'OO'],
  welcome: ['W', 'EH', 'L', 'KG', 'AH', 'MBP'],
  hello: ['EH', 'EH', 'L', 'OH'],
  question: ['KG', 'W', 'EH', 'SZ', 'CH', 'AH', 'TD'],
  explain: ['EH', 'KG', 'SZ', 'PP', 'L', 'AE', 'TD'],
  internally: ['IH', 'TD', 'ER', 'TD', 'AH', 'L', 'IY'],
  challenging: ['CH', 'AE', 'L', 'EH', 'TD', 'SH', 'IH', 'KG'],
  project: ['PP', 'R', 'AO', 'CH', 'EH', 'KG', 'TD'],
  approach: ['AH', 'PP', 'R', 'OH', 'CH'],
  thank: ['TH', 'AE', 'KG', 'KG'],
  you: ['IY', 'OO'],
  can: ['KG', 'AE', 'TD'],
  how: ['EH', 'AO', 'W'],
  does: ['TD', 'AH', 'SZ'],
  work: ['W', 'ER', 'KG'],
  tell: ['TD', 'EH', 'L'],
  me: ['MBP', 'IY'],
  about: ['AH', 'MBP', 'AO', 'TD'],
  that: ['TH', 'AE', 'TD'],
  interesting: ['IH', 'TD', 'ER', 'EH', 'SZ', 'TD', 'IH', 'KG'],
  next: ['TD', 'EH', 'KG', 'SZ', 'TD'],
  let: ['L', 'EH', 'TD'],
  lets: ['L', 'EH', 'TD', 'SZ'],
  move: ['MBP', 'OO', 'FV'],
  to: ['TD', 'OO']
};

export interface TimedViseme {
  viseme: VisemeId;
  startTimeMs: number;
  endTimeMs: number;
  intensity: number;
}

export class VisemeEngine {
  private static instance: VisemeEngine;

  private activeSpeechTimeline: TimedViseme[] = [];
  private speechStartTimeMs = 0;
  private isSpeaking = false;
  private speechRate = 0.95;
  private textSpoken = '';

  // Current interpolated state
  private currentTarget: VisemeTarget = { ...VISEME_TARGETS.REST };
  private smoothedState: VisemeTarget = { ...VISEME_TARGETS.REST };

  private constructor() {}

  public static getInstance(): VisemeEngine {
    if (!VisemeEngine.instance) {
      VisemeEngine.instance = new VisemeEngine();
    }
    return VisemeEngine.instance;
  }

  /**
   * Start speech and generate complete phoneme/viseme timeline
   */
  public startSpeech(text: string, rate = 0.95): void {
    this.isSpeaking = true;
    this.speechRate = rate;
    this.textSpoken = text;
    this.speechStartTimeMs = performance.now();
    this.activeSpeechTimeline = this.buildTimeline(text, rate);
  }

  /**
   * Resynchronize speech with real word-boundary event from Web Speech API
   */
  public onWordBoundary(charIndex: number): void {
    if (!this.isSpeaking || !this.textSpoken) return;

    // Estimate progress through characters
    const progress = Math.min(1.0, Math.max(0, charIndex / Math.max(1, this.textSpoken.length)));
    if (this.activeSpeechTimeline.length > 0) {
      const totalDuration = this.activeSpeechTimeline[this.activeSpeechTimeline.length - 1].endTimeMs;
      const targetTimeMs = progress * totalDuration;
      const now = performance.now();
      // Gently nudge speechStartTimeMs to keep timeline locked to real audio
      const expectedElapsed = now - this.speechStartTimeMs;
      const drift = expectedElapsed - targetTimeMs;
      if (Math.abs(drift) > 80) {
        this.speechStartTimeMs += drift * 0.4;
      }
    }
  }

  /**
   * Stop speech and return to neutral
   */
  public stopSpeech(): void {
    this.isSpeaking = false;
    this.activeSpeechTimeline = [];
    this.currentTarget = { ...VISEME_TARGETS.REST };
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Get current interpolated facial target at current timestamp
   */
  public update(now: number): VisemeTarget {
    if (!this.isSpeaking || this.activeSpeechTimeline.length === 0) {
      // Smoothly ease to REST
      this.interpolateTowards(VISEME_TARGETS.REST, 0.18);
      return this.smoothedState;
    }

    const elapsedMs = now - this.speechStartTimeMs;

    // Find current active viseme in timeline
    let activeItem: TimedViseme | null = null;
    let nextItem: TimedViseme | null = null;

    for (let i = 0; i < this.activeSpeechTimeline.length; i++) {
      const item = this.activeSpeechTimeline[i];
      if (elapsedMs >= item.startTimeMs && elapsedMs < item.endTimeMs) {
        activeItem = item;
        nextItem = this.activeSpeechTimeline[i + 1] || null;
        break;
      }
    }

    if (activeItem) {
      const targetA = VISEME_TARGETS[activeItem.viseme];
      const targetB = nextItem ? VISEME_TARGETS[nextItem.viseme] : VISEME_TARGETS.REST;

      // Intra-viseme transition blend
      const visemeDuration = activeItem.endTimeMs - activeItem.startTimeMs;
      const progress = (elapsedMs - activeItem.startTimeMs) / Math.max(1, visemeDuration);
      // Bell curve or smoothstep for natural syllable curve
      const blend = progress * progress * (3 - 2 * progress);

      this.currentTarget = this.lerpTarget(targetA, targetB, blend * 0.45);
      // Natural responsive low-pass filter
      this.interpolateTowards(this.currentTarget, 0.32);
    } else if (elapsedMs >= (this.activeSpeechTimeline[this.activeSpeechTimeline.length - 1]?.endTimeMs || 0)) {
      // Reached end of utterance
      this.interpolateTowards(VISEME_TARGETS.REST, 0.15);
    }

    return this.smoothedState;
  }

  /**
   * Decompose spoken text into timed viseme frames
   */
  private buildTimeline(text: string, rate: number): TimedViseme[] {
    const timeline: TimedViseme[] = [];
    // Speed factor: 1.0 = normal, 0.95 = slightly deliberate interview cadence
    const timeScale = 1.0 / Math.max(0.6, rate);

    // Initial slight preparatory inhalation / focus pause (80ms)
    let cursorMs = 90 * timeScale;
    timeline.push({
      viseme: 'REST',
      startTimeMs: 0,
      endTimeMs: cursorMs,
      intensity: 0.0
    });

    // Split text into tokens preserving punctuation pauses
    const tokens = text.toLowerCase().match(/[a-z']+|[.,!?;:]/g) || [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      // Punctuation pause handling
      if (token === '.' || token === '!' || token === '?') {
        const pauseDuration = 320 * timeScale;
        timeline.push({
          viseme: 'REST',
          startTimeMs: cursorMs,
          endTimeMs: cursorMs + pauseDuration,
          intensity: 0.0
        });
        cursorMs += pauseDuration;
        continue;
      }

      if (token === ',' || token === ';' || token === ':') {
        const pauseDuration = 180 * timeScale;
        timeline.push({
          viseme: 'REST',
          startTimeMs: cursorMs,
          endTimeMs: cursorMs + pauseDuration,
          intensity: 0.0
        });
        cursorMs += pauseDuration;
        continue;
      }

      // Word-level phoneme resolution
      const cleanWord = token.replace(/[^a-z]/g, '');
      if (!cleanWord) continue;

      const visemes = this.wordToVisemes(cleanWord);
      // Syllable duration allocation
      for (let vIdx = 0; vIdx < visemes.length; vIdx++) {
        const visemeId = visemes[vIdx];
        const isVowel = ['AA', 'AE', 'AH', 'AO', 'EH', 'ER', 'IH', 'IY', 'OH', 'OO', 'UH'].includes(visemeId);
        // Vowels held longer than consonants
        const baseDuration = isVowel ? 110 : 65;
        const duration = baseDuration * timeScale;

        timeline.push({
          viseme: visemeId,
          startTimeMs: cursorMs,
          endTimeMs: cursorMs + duration,
          intensity: isVowel ? 1.0 : 0.85
        });

        cursorMs += duration;
      }

      // Micro inter-word gap (25ms)
      const interWordGap = 25 * timeScale;
      timeline.push({
        viseme: 'REST',
        startTimeMs: cursorMs,
        endTimeMs: cursorMs + interWordGap,
        intensity: 0.2
      });
      cursorMs += interWordGap;
    }

    return timeline;
  }

  /**
   * Rule-based Grapheme-to-Viseme engine for English & Technical terms
   */
  private wordToVisemes(word: string): VisemeId[] {
    // 1. Direct dictionary match
    if (TECHNICAL_DICTIONARY[word]) {
      return [...TECHNICAL_DICTIONARY[word]];
    }

    // 2. Rule-based letter-combination tokenizer
    const result: VisemeId[] = [];
    let i = 0;
    while (i < word.length) {
      const two = word.slice(i, i + 2);
      const three = word.slice(i, i + 3);

      // Trigraphs
      if (three === 'ing') {
        result.push('IH', 'KG');
        i += 3;
        continue;
      }
      if (three === 'tch' || three === 'dge') {
        result.push('CH');
        i += 3;
        continue;
      }
      if (three === 'igh') {
        result.push('AE', 'IY');
        i += 3;
        continue;
      }
      if (three === 'ous' || three === 'ion') {
        result.push('AH', 'SZ');
        i += 3;
        continue;
      }

      // Digraphs
      if (two === 'th') {
        result.push('TH');
        i += 2;
        continue;
      }
      if (two === 'sh') {
        result.push('SH');
        i += 2;
        continue;
      }
      if (two === 'ch') {
        result.push('CH');
        i += 2;
        continue;
      }
      if (two === 'ph') {
        result.push('FV');
        i += 2;
        continue;
      }
      if (two === 'wh') {
        result.push('W');
        i += 2;
        continue;
      }
      if (two === 'ee' || two === 'ea') {
        result.push('IY');
        i += 2;
        continue;
      }
      if (two === 'oo') {
        result.push('OO');
        i += 2;
        continue;
      }
      if (two === 'ou' || two === 'ow') {
        result.push('AO', 'W');
        i += 2;
        continue;
      }
      if (two === 'ai' || two === 'ay') {
        result.push('EH', 'IY');
        i += 2;
        continue;
      }
      if (two === 'oi' || two === 'oy') {
        result.push('OH', 'IY');
        i += 2;
        continue;
      }
      if (two === 'er' || two === 'ir' || two === 'ur') {
        result.push('ER');
        i += 2;
        continue;
      }
      if (two === 'ar') {
        result.push('AA', 'R');
        i += 2;
        continue;
      }
      if (two === 'or') {
        result.push('AO', 'R');
        i += 2;
        continue;
      }
      if (two === 'ck') {
        result.push('KG');
        i += 2;
        continue;
      }
      if (two === 'qu') {
        result.push('KG', 'W');
        i += 2;
        continue;
      }

      // Single character phonetic mappings
      const c = word[i];
      switch (c) {
        case 'a':
          result.push(word.length <= 3 ? 'AE' : 'AA');
          break;
        case 'e':
          // Trailing silent e
          if (i === word.length - 1 && word.length > 2) {
            // silent
          } else {
            result.push('EH');
          }
          break;
        case 'i':
          result.push('IH');
          break;
        case 'o':
          result.push('OH');
          break;
        case 'u':
          result.push('UH');
          break;
        case 'y':
          result.push(i === 0 ? 'IY' : 'IY');
          break;
        case 'p':
        case 'b':
        case 'm':
          result.push('MBP');
          break;
        case 'f':
        case 'v':
          result.push('FV');
          break;
        case 't':
        case 'd':
        case 'n':
          result.push('TD');
          break;
        case 'k':
        case 'g':
        case 'c':
        case 'q':
          result.push('KG');
          break;
        case 's':
        case 'z':
          result.push('SZ');
          break;
        case 'l':
          result.push('L');
          break;
        case 'r':
          result.push('R');
          break;
        case 'w':
          result.push('W');
          break;
        case 'j':
          result.push('SH');
          break;
        case 'h':
          result.push('AH');
          break;
        case 'x':
          result.push('KG', 'SZ');
          break;
        default:
          result.push('AH');
          break;
      }
      i++;
    }

    return result.length > 0 ? result : ['AH'];
  }

  private lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  private lerpTarget(a: VisemeTarget, b: VisemeTarget, t: number): VisemeTarget {
    return {
      jawOpen: this.lerp(a.jawOpen, b.jawOpen, t),
      mouthWidth: this.lerp(a.mouthWidth, b.mouthWidth, t),
      lipUpperLift: this.lerp(a.lipUpperLift, b.lipUpperLift, t),
      lipLowerDrop: this.lerp(a.lipLowerDrop, b.lipLowerDrop, t),
      lipPucker: this.lerp(a.lipPucker, b.lipPucker, t),
      chinDrop: this.lerp(a.chinDrop, b.chinDrop, t),
      cheekTension: this.lerp(a.cheekTension, b.cheekTension, t),
      teethUpperVis: this.lerp(a.teethUpperVis, b.teethUpperVis, t),
      teethLowerVis: this.lerp(a.teethLowerVis, b.teethLowerVis, t),
      tonguePose: t > 0.5 ? b.tonguePose : a.tonguePose
    };
  }

  private interpolateTowards(target: VisemeTarget, alpha: number): void {
    const s = this.smoothedState;
    s.jawOpen += (target.jawOpen - s.jawOpen) * alpha;
    s.mouthWidth += (target.mouthWidth - s.mouthWidth) * alpha;
    s.lipUpperLift += (target.lipUpperLift - s.lipUpperLift) * alpha;
    s.lipLowerDrop += (target.lipLowerDrop - s.lipLowerDrop) * alpha;
    s.lipPucker += (target.lipPucker - s.lipPucker) * alpha;
    // Chin naturally follows with slight mechanical inertia
    s.chinDrop += (target.chinDrop - s.chinDrop) * (alpha * 0.75);
    s.cheekTension += (target.cheekTension - s.cheekTension) * alpha;
    s.teethUpperVis += (target.teethUpperVis - s.teethUpperVis) * alpha;
    s.teethLowerVis += (target.teethLowerVis - s.teethLowerVis) * alpha;
    s.tonguePose = target.tonguePose;
  }
}
