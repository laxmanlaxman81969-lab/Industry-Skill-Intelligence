// AI Video Mock Interview Service - Unified Facade

export * from './types';
export * from './personas';
export * from './cameraService';
export * from './sessionManager';
export * from './scoringEngine';
export * from './integrityAuditor';
export * from './visemeEngine';

import {
  InterviewQuestion,
  QuestionEvaluationResult
} from '../../types';
import { VisemeEngine } from './visemeEngine';

// ============================================================================
// TEXT-TO-SPEECH (TTS) SPEECH SYNTHESIS ENGINE
// ============================================================================

export class TTSService {
  private static instance: TTSService;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking = false;
  private preferredGender: 'male' | 'female' = 'female';
  private selectedVoice: SpeechSynthesisVoice | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.resolveVoiceForGender(this.preferredGender);
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.resolveVoiceForGender(this.preferredGender);
        };
      }
    }
  }

  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  /**
   * Dynamically search and resolve the best matching voice for the target gender.
   * Handles Windows (Edge/Chrome/SAPI), macOS/iOS (Safari/WebKit), Android, and Linux.
   */
  public resolveVoiceForGender(gender: 'male' | 'female'): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const enVoices = voices.filter((v) => v.lang.startsWith('en'));
    const pool = enVoices.length > 0 ? enVoices : voices;

    if (gender === 'female') {
      // 1. Explicit female voice identifiers
      const explicit = pool.find((v) =>
        /Zira|Jenny|Aria|Michelle|Samantha|Victoria|Karen|Tessa|Fiona|Susan|Hazel|Catherine|Google US English|Google UK English Female|female/i.test(
          v.name
        )
      );
      if (explicit) {
        this.selectedVoice = explicit;
        return explicit;
      }

      // 2. Reject explicit male voices
      const nonMale = pool.find(
        (v) => !/David|Guy|Mark|James|Daniel|George|Richard|Oliver|Ryan|Alex|Fred|Male/i.test(v.name)
      );
      if (nonMale) {
        this.selectedVoice = nonMale;
        return nonMale;
      }

      this.selectedVoice = pool[0];
      return pool[0];
    } else {
      // 1. Explicit male voice identifiers
      const explicit = pool.find((v) =>
        /David|Guy|Mark|James|Daniel|George|Richard|Oliver|Ryan|Alex|Fred|Google UK English Male|male/i.test(
          v.name
        )
      );
      if (explicit) {
        this.selectedVoice = explicit;
        return explicit;
      }

      // 2. Reject explicit female voices
      const nonFemale = pool.find(
        (v) => !/Zira|Jenny|Aria|Michelle|Samantha|Victoria|Karen|Tessa|Fiona|Susan|Hazel|Female/i.test(v.name)
      );
      if (nonFemale) {
        this.selectedVoice = nonFemale;
        return nonFemale;
      }

      this.selectedVoice = pool[0];
      return pool[0];
    }
  }

  public speak(
    text: string,
    options?: {
      gender?: 'male' | 'female';
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      const visemeEngine = VisemeEngine.getInstance();
      const targetGender = options?.gender || this.preferredGender || 'female';

      if (!this.synth) {
        visemeEngine.startSpeech(text, options?.rate ?? 0.95);
        options?.onStart?.();
        setTimeout(() => {
          visemeEngine.stopSpeech();
          options?.onEnd?.();
          resolve();
        }, Math.max(1200, text.length * 55));
        return;
      }

      this.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Dynamically resolve voice for target gender right at utterance creation
      const voice = this.resolveVoiceForGender(targetGender);
      if (voice) {
        utterance.voice = voice;
      }

      // Distinct pitch and cadence calibration per character gender
      if (targetGender === 'female') {
        utterance.pitch = options?.pitch ?? 1.18;
        utterance.rate = options?.rate ?? 0.96;
      } else {
        utterance.pitch = options?.pitch ?? 0.86;
        utterance.rate = options?.rate ?? 0.94;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.currentUtterance = utterance;
        visemeEngine.startSpeech(text, utterance.rate);
        options?.onStart?.();
      };

      utterance.onboundary = (e: SpeechSynthesisEvent) => {
        visemeEngine.onWordBoundary(e.charIndex);
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        visemeEngine.stopSpeech();
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        visemeEngine.stopSpeech();
        options?.onError?.(e);
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public cancel(): void {
    VisemeEngine.getInstance().stopSpeech();
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public selectVoiceForGender(gender: 'male' | 'female'): void {
    this.preferredGender = gender;
    this.resolveVoiceForGender(gender);
  }

  public getSpeakingStatus(): boolean {
    return this.isSpeaking;
  }
}

// ============================================================================
// SPEECH-TO-TEXT (STT) SPEECH RECOGNITION ENGINE WITH SILENCE DETECTION
// ============================================================================

export type STTStatus =
  | 'idle'
  | 'listening'
  | 'speaking_detected'
  | 'silence_detected'
  | 'candidate_thinking'
  | 'error'
  | 'unsupported';

export interface STTCallbacks {
  onInterimResult: (transcript: string) => void;
  onFinalResult: (transcript: string) => void;
  onStatusChange: (status: STTStatus) => void;
  onSilenceThresholdReached: () => void;
  onError: (error: string) => void;
}

export class STTService {
  private recognition: any = null;
  private isListening = false;
  private fullTranscript = '';
  private interimTranscript = '';
  private silenceTimer: any = null;
  private callbacks: STTCallbacks | null = null;
  private silenceDurationMs = 3200; // Realistic conversational pause tolerance
  private supported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          this.recognition = new SpeechRec();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          this.supported = true;
          this.setupEvents();
        } catch (e) {
          this.supported = false;
        }
      }
    }
  }

  public isSupported(): boolean {
    return this.supported;
  }

  private setupEvents() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks?.onStatusChange('listening');
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let newlyFinal = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        const text = item[0].transcript;
        if (item.isFinal) {
          newlyFinal += text + ' ';
        } else {
          interim += text;
        }
      }

      // Check if candidate explicitly requested a moment to formulate thoughts
      const combinedActive = (newlyFinal + ' ' + interim).toLowerCase();
      const askedForMoment =
        combinedActive.includes('give me a moment') ||
        combinedActive.includes('let me think') ||
        combinedActive.includes('just a second') ||
        combinedActive.includes('one second') ||
        combinedActive.includes('give me a second') ||
        combinedActive.includes('hold on');

      if (askedForMoment) {
        this.resetSilenceTimer(7000); // Give 7 seconds of quiet thinking time
        this.callbacks?.onStatusChange('candidate_thinking');
      } else {
        this.resetSilenceTimer(this.silenceDurationMs);
        this.callbacks?.onStatusChange('speaking_detected');
      }

      if (newlyFinal) {
        this.fullTranscript += newlyFinal;
        this.callbacks?.onFinalResult(this.fullTranscript.trim());
      }

      this.interimTranscript = interim;
      this.callbacks?.onInterimResult((this.fullTranscript + ' ' + interim).trim());
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') return;
      this.callbacks?.onError(`Speech recognition notice: ${event.error}`);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (e) {
          this.isListening = false;
          this.callbacks?.onStatusChange('idle');
        }
      } else {
        this.callbacks?.onStatusChange('idle');
      }
    };
  }

  private resetSilenceTimer(duration = this.silenceDurationMs) {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    this.silenceTimer = setTimeout(() => {
      if (this.isListening && (this.fullTranscript.trim().length > 8 || this.interimTranscript.trim().length > 8)) {
        this.callbacks?.onStatusChange('silence_detected');
        this.callbacks?.onSilenceThresholdReached();
      }
    }, duration);
  }

  public start(callbacks: STTCallbacks, existingText = ''): boolean {
    this.callbacks = callbacks;
    this.fullTranscript = existingText;
    this.interimTranscript = '';

    if (!this.supported || !this.recognition) {
      callbacks.onStatusChange('unsupported');
      return false;
    }

    try {
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (e) {
      try {
        this.recognition.stop();
        setTimeout(() => {
          if (this.isListening) this.recognition.start();
        }, 150);
      } catch (err) {}
      return true;
    }
  }

  public stop(): string {
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    const final = (this.fullTranscript + ' ' + this.interimTranscript).trim();
    this.callbacks?.onStatusChange('idle');
    return final;
  }

  public reset(initialText = '') {
    this.fullTranscript = initialText;
    this.interimTranscript = '';
  }

  public getFullTranscript(): string {
    return (this.fullTranscript + ' ' + this.interimTranscript).trim();
  }
}

// ============================================================================
// AUDIO LEVEL MONITOR (MICROPHONE RMS)
// ============================================================================

export class AudioLevelMonitor {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private rafId: number | null = null;
  private onLevelCallback: ((level: number) => void) | null = null;

  public start(stream: MediaStream, onLevel: (level: number) => void) {
    this.stop();
    this.onLevelCallback = onLevel;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.5;

      this.source = this.audioCtx.createMediaStreamSource(stream);
      this.source.connect(this.analyser);

      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkVolume = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }

        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        this.onLevelCallback?.(normalized);

        this.rafId = requestAnimationFrame(checkVolume);
      };

      this.rafId = requestAnimationFrame(checkVolume);
    } catch (e) {}
  }

  public stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.source) {
      try {
        this.source.disconnect();
      } catch (e) {}
      this.source = null;
    }
    if (this.audioCtx) {
      try {
        this.audioCtx.close();
      } catch (e) {}
      this.audioCtx = null;
    }
    this.analyser = null;
    this.onLevelCallback = null;
  }
}

// ============================================================================
// CONTEXTUAL & ADAPTIVE FOLLOW-UP QUESTION GENERATOR
// ============================================================================

export interface FollowUpDecision {
  shouldAskFollowUp: boolean;
  followUpQuestion?: InterviewQuestion;
  reason?: string;
  transitionPhrase: string;
}

export function generateFollowUpDecision(
  lastEval: QuestionEvaluationResult,
  originalQuestion: InterviewQuestion,
  role: string
): FollowUpDecision {
  if (lastEval.isFollowUp || originalQuestion.category === 'HR' || originalQuestion.category === 'Introduction') {
    return {
      shouldAskFollowUp: false,
      transitionPhrase: getNaturalAcknowledgement('next')
    };
  }

  const ans = (lastEval.studentAnswer || '').toLowerCase();
  const wordCount = ans.split(/\s+/).filter(Boolean).length;

  // Extract key terms mentioned by the candidate
  const candidateKeywords: string[] = [];
  const commonTechTerms = [
    'ioc', 'dependency injection', 'lifecycle', 'bean', 'spring', 'autowired',
    'hashmap', 'collision', 'linkedlist', 'treemap', 'load factor', 'threshold',
    'acid', 'isolation', 'index', 'b-tree', 'transaction', 'normalization',
    'async', 'await', 'promise', 'closure', 'event loop', 'virtual dom',
    'state', 'props', 'useeffect', 'usememo', 're-render', 'redux',
    'thread', 'deadlock', 'mutex', 'synchronized', 'executor', 'callable',
    'rest', 'http', 'status code', 'idempotent', 'jwt', 'oauth',
    'docker', 'container', 'volume', 'kubernetes', 'pod', 'deployment'
  ];

  commonTechTerms.forEach((term) => {
    if (ans.includes(term)) {
      candidateKeywords.push(term);
    }
  });

  const mentionedTerm = candidateKeywords[0] || originalQuestion.skillTested;
  const missingConcept =
    lastEval.missingKeyPoints && lastEval.missingKeyPoints.length > 0
      ? lastEval.missingKeyPoints[0]
      : 'underlying lifecycle and edge cases';

  // Case 1: Partial answer (score < 75) -> follow up directly on what they mentioned vs missed
  if (lastEval.overallScore < 75 && wordCount > 5) {
    const qText = `You mentioned ${mentionedTerm}. Can you elaborate on how you handle ${missingConcept} in that setup?`;

    return {
      shouldAskFollowUp: true,
      reason: `Follow-up on ${mentionedTerm} targeting omitted nuance: ${missingConcept}`,
      transitionPhrase: getNaturalAcknowledgement('followup'),
      followUpQuestion: {
        id: `${originalQuestion.id}-fu`,
        category: 'Scenario-based',
        skillTested: originalQuestion.skillTested,
        difficulty: originalQuestion.difficulty,
        question: qText,
        idealAnswerKeyPoints: [
          `Concrete implementation details regarding ${missingConcept}`,
          `Practical failure modes and edge case handling`,
          `Production reliability trade-offs`
        ],
        format: 'scenario',
        expectedSkills: originalQuestion.expectedSkills || [originalQuestion.skillTested]
      }
    };
  }

  // Case 2: Strong answer (score >= 82) -> probe high scale, concurrency, or resilience
  if (lastEval.overallScore >= 82 && Math.random() > 0.4) {
    const qText = `You highlighted ${mentionedTerm} clearly. In production, how would that behavior change if traffic scales 10x or network latency spikes?`;

    return {
      shouldAskFollowUp: true,
      reason: `Deep-dive on ${mentionedTerm} under production concurrency/scale`,
      transitionPhrase: getNaturalAcknowledgement('followup'),
      followUpQuestion: {
        id: `${originalQuestion.id}-scale`,
        category: 'Scenario-based',
        skillTested: originalQuestion.skillTested,
        difficulty: 'Advanced',
        question: qText,
        idealAnswerKeyPoints: [
          `Distributed caching, rate limiting, and backpressure`,
          `Connection pooling and thread starvation avoidance`,
          `Graceful degradation and telemetry monitoring`
        ],
        format: 'scenario',
        expectedSkills: originalQuestion.expectedSkills || [originalQuestion.skillTested]
      }
    };
  }

  return {
    shouldAskFollowUp: false,
    transitionPhrase: getNaturalAcknowledgement('next')
  };
}

// ============================================================================
// NATURAL, MEASURED ACKNOWLEDGEMENT & TRANSITION SCRIPTS
// ============================================================================

export function getNaturalAcknowledgement(type: 'next' | 'followup' | 'thinking'): string {
  const nextPhrases = [
    'Thank you. Let us move to the next question.',
    "That's helpful. Now let us explore another core topic.",
    'Understood. Moving forward to our next area.',
    'Thank you. Let us continue with our next technical scenario.',
    'Good. Now let us discuss the next area.'
  ];

  const followUpPhrases = [
    "That's helpful. Let's explore that a little further.",
    "Good. I'd like to go deeper into that.",
    'Understood. Let us clarify one key aspect of that.',
    'Thanks for highlighting that. Let us dig a bit deeper into that setup.'
  ];

  const thinkingPhrases = [
    'Analyzing response...',
    'Evaluating technical depth...',
    'Reviewing key concepts...'
  ];

  if (type === 'followup') {
    return followUpPhrases[Math.floor(Math.random() * followUpPhrases.length)];
  }
  if (type === 'thinking') {
    return thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];
  }
  return nextPhrases[Math.floor(Math.random() * nextPhrases.length)];
}

export function getRandomTransitionPhrase(type: 'next' | 'clarify' | 'scale'): string {
  return getNaturalAcknowledgement(type === 'clarify' || type === 'scale' ? 'followup' : 'next');
}

export function getAIIntroScript(candidateName: string, role: string, questionCount: number): string {
  const cleanName = candidateName ? candidateName.split(' ')[0] : 'Candidate';
  return `Hello ${cleanName}. Welcome to your ${role} interview. I will guide you through ${questionCount} questions covering core concepts and practical scenarios. Please speak naturally into your microphone. When you are ready, let's begin with our first question.`;
}

export function getAIClosingScript(candidateName: string, role: string): string {
  const cleanName = candidateName ? candidateName.split(' ')[0] : 'Candidate';
  return `Thank you, ${cleanName}. That concludes our interview session for the ${role} position. Your responses and skill demonstrations have been recorded, and I am compiling your interview report now.`;
}
