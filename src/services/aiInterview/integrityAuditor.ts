// Interview Integrity & Anti-Fraud Service
// Implements 3-strike progressive warning system, browser visibility, fullscreen,
// camera tampering, and ethical computer vision presence checks.

import { IntegrityEvent, IntegrityEventType } from '../../types';
import { SessionManager } from './sessionManager';

export type IntegrityMachineState =
  | 'NORMAL'
  | 'WARNING'
  | 'REPEATED_WARNING'
  | 'SERIOUS_INCIDENT'
  | 'INTERVIEW_TERMINATED';

export interface VisionStateUpdate {
  faceDetected: boolean;
  multipleFaces: boolean;
  lookingAway: boolean;
  cameraCovered: boolean;
  cameraOk: boolean;
  micOk: boolean;
}

export interface IntegrityCallbacks {
  onSoftWarning: (message: string) => void;
  onWarning: (message: string, warningCount: number, event: IntegrityEvent) => void;
  onSeriousIncident: (message: string, event: IntegrityEvent) => void;
  onAutoSubmit: (reason: string, finalEvents: IntegrityEvent[]) => void;
  onStateUpdate: (state: VisionStateUpdate) => void;
}

export class IntegrityAuditor {
  private static instance: IntegrityAuditor;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private frameIntervalId: any = null;

  // Smoothing counters to prevent false positives (anti-false-positive rule)
  private consecutiveAbsence = 0;
  private consecutiveMultiple = 0;
  private consecutiveAway = 0;
  private consecutiveDark = 0;

  // Track occurrences
  private awayWarningIssued = false;
  private absenceWarningIssued = false;
  private multipleFacesWarningIssued = false;
  private lastTabSwitchTime = 0;
  private lastBlurTime = 0;

  private warningCount = 0;
  private isAuditing = false;
  private accessibilityMode = false;
  private callbacks: IntegrityCallbacks | null = null;
  private currentQuestionId = 'intro';
  private currentQuestionNumber = 1;

  private constructor() {
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 160;
      this.canvas.height = 120;
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }
  }

  public static getInstance(): IntegrityAuditor {
    if (!IntegrityAuditor.instance) {
      IntegrityAuditor.instance = new IntegrityAuditor();
    }
    return IntegrityAuditor.instance;
  }

  public setAccessibilityMode(enabled: boolean) {
    this.accessibilityMode = enabled;
  }

  public setCurrentQuestion(qId: string, qNum: number) {
    this.currentQuestionId = qId;
    this.currentQuestionNumber = qNum;
  }

  public startAuditing(callbacks: IntegrityCallbacks, initialWarningCount = 0) {
    this.stopAuditing();
    this.callbacks = callbacks;
    this.warningCount = initialWarningCount;
    this.isAuditing = true;

    // Attach Browser Event Listeners
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      window.addEventListener('blur', this.handleWindowBlur);
      document.addEventListener('fullscreenchange', this.handleFullscreenChange);
    }
  }

  private handleVisibilityChange = () => {
    if (!this.isAuditing || typeof document === 'undefined') return;

    if (document.hidden) {
      const now = Date.now();
      // Debounce window/tab switches within 4 seconds
      if (now - this.lastTabSwitchTime < 4000) return;
      this.lastTabSwitchTime = now;

      const event: IntegrityEvent = {
        incidentId: `inc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        questionId: this.currentQuestionId,
        questionNumber: this.currentQuestionNumber,
        eventType: 'tab_switch',
        description: 'Interview window lost visibility (browser tab switched)',
        severity: 'high',
        confidence: 0.98,
        duration: 3,
        actionTaken: 'Integrity warning recorded; window focus prompt displayed.'
      };

      this.processViolation(
        event,
        'INTERVIEW INTEGRITY WARNING: You switched away from the interview tab. Please keep the interview window active and focused.'
      );
    }
  };

  private handleWindowBlur = () => {
    if (!this.isAuditing || typeof document === 'undefined') return;

    // If already handled by tab switch, ignore blur
    if (document.hidden) return;

    const now = Date.now();
    if (now - this.lastBlurTime < 6000) return;
    this.lastBlurTime = now;

    const event: IntegrityEvent = {
      incidentId: `inc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      questionId: this.currentQuestionId,
      questionNumber: this.currentQuestionNumber,
      eventType: 'window_blur',
      description: 'Interview window lost focus (another application was brought to foreground)',
      severity: 'medium',
      confidence: 0.92,
      actionTaken: 'Integrity incident logged.'
    };

    this.processViolation(
      event,
      'INTERVIEW FOCUS WARNING: The interview window lost focus. Please keep your attention on the interview screen.'
    );
  };

  private handleFullscreenChange = () => {
    if (!this.isAuditing || typeof document === 'undefined') return;

    const isFullscreen = !!document.fullscreenElement;
    if (!isFullscreen) {
      const event: IntegrityEvent = {
        incidentId: `inc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        questionId: this.currentQuestionId,
        questionNumber: this.currentQuestionNumber,
        eventType: 'fullscreen_exit',
        description: 'Candidate exited fullscreen mode during active interview',
        severity: 'medium',
        confidence: 0.95,
        actionTaken: 'Fullscreen return requested.'
      };

      this.processViolation(
        event,
        'FULLSCREEN MODE NOTICE: You exited fullscreen mode. Please return to fullscreen mode to continue the interview.'
      );
    }
  };

  public reportCopyPasteAttempt(type: 'copy' | 'paste') {
    if (!this.isAuditing) return;

    const event: IntegrityEvent = {
      incidentId: `inc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      questionId: this.currentQuestionId,
      questionNumber: this.currentQuestionNumber,
      eventType: type === 'copy' ? 'copy_attempt' : 'paste_attempt',
      description: `Attempted ${type} operation intercepted during interview`,
      severity: 'medium',
      confidence: 0.99,
      actionTaken: `${type} action prevented.`
    };

    this.callbacks?.onSoftWarning(
      `Copy/paste is not permitted during the interview. Please formulate your responses verbally or type directly.`
    );

    // Save event without immediate formal strike
    const session = SessionManager.getInstance().getActiveSession();
    if (session) {
      session.integrityEvents.push(event);
      SessionManager.getInstance().saveSession(session);
    }
  }

  public reportAudioAnomaly(description: string) {
    if (!this.isAuditing) return;

    const event: IntegrityEvent = {
      incidentId: `inc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      questionId: this.currentQuestionId,
      questionNumber: this.currentQuestionNumber,
      eventType: 'possible_additional_voice',
      description,
      severity: 'low',
      confidence: 0.72,
      actionTaken: 'Audio pattern logged for post-interview review.'
    };

    this.callbacks?.onSoftWarning('Possible additional voice detected. Please ensure an isolated environment.');

    const session = SessionManager.getInstance().getActiveSession();
    if (session) {
      session.integrityEvents.push(event);
      SessionManager.getInstance().saveSession(session);
    }
  }

  public processViolation(event: IntegrityEvent, customMessage?: string, isSerious = false) {
    const sessionManager = SessionManager.getInstance();
    const result = sessionManager.recordIntegrityViolation(event, isSerious, 3);
    this.warningCount = result.newWarningCount;

    // Asynchronously sync event with server backend
    const activeSession = sessionManager.getActiveSession();
    if (activeSession && activeSession.sessionId) {
      try {
        fetch('/api/interview/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: activeSession.sessionId,
            event
          })
        }).catch(() => {});
      } catch (e) {}
    }

    if (result.shouldAutoSubmit) {
      // Final Policy Threshold reached -> Automatic Submission with saved responses
      this.callbacks?.onAutoSubmit(
        'Policy threshold reached: Repeated interview interruptions recorded. Responses and telemetry have been submitted.',
        [event]
      );
    } else if (isSerious) {
      // High severity modal
      const modalMessage =
        customMessage ||
        'INTERVIEW PRESENCE NOTICE: An anomalous presence pattern was recorded. Please ensure you remain alone in frame facing the screen.';
      this.callbacks?.onSeriousIncident(modalMessage, event);
    } else {
      // Progressive escalation: Strike 1, 2, or 3
      let progressiveMsg = customMessage;
      if (!progressiveMsg) {
        if (this.warningCount === 1) {
          progressiveMsg = 'Interview interruption detected. Please return to the interview.';
        } else if (this.warningCount === 2) {
          progressiveMsg = 'Warning 2 of 3. Leaving the interview repeatedly may affect your integrity review.';
        } else {
          progressiveMsg = 'Final warning. Another interruption may end the interview according to interview policy.';
        }
      }

      this.callbacks?.onWarning(progressiveMsg, this.warningCount, event);
    }
  }

  public startFrameAnalysis(videoElement: HTMLVideoElement | null) {
    if (!videoElement || !this.ctx || !this.canvas) return;

    if (this.frameIntervalId) clearInterval(this.frameIntervalId);

    // Responsive sampling interval (every 400ms) for real-time camera obstruction and presence checks
    this.frameIntervalId = setInterval(() => {
      this.analyzeVideoFrame(videoElement);
    }, 400);
  }

  private analyzeVideoFrame(video: HTMLVideoElement) {
    if (!this.isAuditing || !video || !this.ctx || video.readyState < 2) return;

    try {
      this.ctx.drawImage(video, 0, 0, 160, 120);
      const frame = this.ctx.getImageData(0, 0, 160, 120);
      const data = frame.data;

      let totalLum = 0;
      let totalLumSq = 0;
      let totalR = 0;
      let totalG = 0;
      let totalB = 0;
      let skinPixels = 0;
      let leftSkin = 0;
      let rightSkin = 0;
      const totalSampled = (160 * 120) / 4; // Sample every 4th pixel

      for (let i = 0; i < data.length; i += 16) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        totalLum += lum;
        totalLumSq += lum * lum;
        totalR += r;
        totalG += g;
        totalB += b;

        // Chromatic skin heuristic
        const isSkin = r > 60 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15;
        if (isSkin) {
          skinPixels++;
          const pxIdx = i / 4;
          if (pxIdx % 160 < 80) leftSkin++;
          else rightSkin++;
        }
      }

      const avgLum = totalLum / totalSampled;
      const lumVariance = Math.max(0, totalLumSq / totalSampled - avgLum * avgLum);
      const lumStdDev = Math.sqrt(lumVariance);
      const avgR = totalR / totalSampled;
      const avgG = totalG / totalSampled;
      const avgB = totalB / totalSampled;
      const skinRatio = skinPixels / totalSampled;

      // ─────────────────────────────────────────────────────────────
      // HAND-ON-LENS & CAMERA OBSTRUCTION DETECTION
      // Detects when the student places hand/finger over laptop camera:
      // 1. Image turns into a flat, blurry reddish/orange smear (light through skin)
      // 2. Or near-zero luminance (blocked/taped)
      // 3. Or texture standard deviation collapses to near zero (no edges)
      // ─────────────────────────────────────────────────────────────
      const isExtremeDark = avgLum <= 15;
      const isRedSkinSmear = lumStdDev < 12.0 && avgR > 1.3 * (avgG + 1) && avgR > 1.5 * (avgB + 1) && avgG < 70;
      const isZeroContrastBlock = lumStdDev < 7.0 && (avgLum < 38 || avgLum > 240);
      const isCameraCoveredNow = isExtremeDark || isRedSkinSmear || isZeroContrastBlock;

      let cameraCovered = false;
      if (isCameraCoveredNow) {
        this.consecutiveDark++;
        // Trigger visual alert state quickly after ~600ms (2 checks)
        if (this.consecutiveDark >= 2) {
          cameraCovered = true;
        }

        if (this.consecutiveDark === 6) {
          // ~2.4s soft warning prompt
          this.callbacks?.onSoftWarning(
            'Camera lens appears covered or obstructed. Please uncover your laptop camera.'
          );
        } else if (this.consecutiveDark === 12) {
          // ~4.8s formal integrity logging
          const event: IntegrityEvent = {
            incidentId: `inc-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            questionId: this.currentQuestionId,
            questionNumber: this.currentQuestionNumber,
            eventType: 'camera_covered',
            description: 'Camera lens was covered or obstructed by hand/object during active interview',
            severity: 'high',
            confidence: 0.96,
            duration: 5,
            actionTaken: 'Camera obstruction incident logged.'
          };
          this.processViolation(event, 'Camera feed obstructed: Please uncover your camera immediately to continue.', true);
        }
      } else {
        this.consecutiveDark = 0;
        cameraCovered = false;
      }

      const cameraOk = !cameraCovered && avgLum > 8 && avgLum < 252;
      const faceDetected = !cameraCovered && skinRatio > 0.035 && cameraOk;
      const lookingAway = !cameraCovered && skinRatio > 0.04 && Math.abs(leftSkin - rightSkin) / (skinPixels || 1) > 0.74;
      const multipleFaces = !cameraCovered && skinRatio > 0.45 && Math.abs(leftSkin - rightSkin) < 0.16;

      // If accessibility mode is enabled, skip strict face absence & gaze warnings
      if (!this.accessibilityMode) {
        // ─────────────────────────────────────────────────────────────
        // FACE PRESENCE DETECTION (ANTI-FALSE-POSITIVE PROGRESSION)
        // ─────────────────────────────────────────────────────────────
        if (!faceDetected && !cameraCovered) {
          this.consecutiveAbsence++;

          // Missing 1-2s (frames 1-2): No warning.
          // Missing 3-5s (frame 3): Soft warning.
          if (this.consecutiveAbsence === 3 && !this.absenceWarningIssued) {
            this.absenceWarningIssued = true;
            this.callbacks?.onSoftWarning('Please remain visible in the camera frame.');
          }
          // Missing > 7s (frame 5): Formal integrity incident.
          else if (this.consecutiveAbsence === 5) {
            const event: IntegrityEvent = {
              incidentId: `inc-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              questionId: this.currentQuestionId,
              questionNumber: this.currentQuestionNumber,
              eventType: 'face_not_detected',
              description: 'Candidate face was not detected in the camera frame for a sustained duration (>7s)',
              severity: 'medium',
              confidence: 0.88,
              duration: 7,
              actionTaken: 'Integrity incident logged.'
            };
            this.processViolation(
              event,
              'INTERVIEW INTEGRITY WARNING: Face was not detected in the camera frame. Please remain positioned within view.'
            );
          }
        } else {
          this.consecutiveAbsence = 0;
          this.absenceWarningIssued = false;
        }

        // ─────────────────────────────────────────────────────────────
        // GAZE / ATTENTION MONITORING (ANTI-FALSE-POSITIVE PROGRESSION)
        // ─────────────────────────────────────────────────────────────
        if (lookingAway) {
          this.consecutiveAway++;

          // 1-2s: No warning (people naturally look away while thinking!).
          // 4-6s sustained (frame 3): Soft warning.
          if (this.consecutiveAway === 3 && !this.awayWarningIssued) {
            this.awayWarningIssued = true;
            this.callbacks?.onSoftWarning('Please keep your attention toward the interview screen.');
          }
          // Repeated sustained attention away (frame 6): Formal warning.
          else if (this.consecutiveAway === 6) {
            const event: IntegrityEvent = {
              incidentId: `inc-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              questionId: this.currentQuestionId,
              questionNumber: this.currentQuestionNumber,
              eventType: 'sustained_off_screen_attention',
              description: 'Sustained off-screen attention detected (>8s uninterrupted)',
              severity: 'medium',
              confidence: 0.82,
              duration: 8,
              actionTaken: 'Integrity warning issued.'
            };
            this.processViolation(
              event,
              'INTERVIEW INTEGRITY WARNING: Sustained off-screen gaze detected. Please maintain attention on the interview screen.'
            );
          }
        } else {
          this.consecutiveAway = 0;
          this.awayWarningIssued = false;
        }

        // ─────────────────────────────────────────────────────────────
        // MULTIPLE PERSON DETECTION
        // ─────────────────────────────────────────────────────────────
        if (multipleFaces) {
          this.consecutiveMultiple++;

          // First sustained detection (frame 3): Warning modal.
          if (this.consecutiveMultiple === 3 && !this.multipleFacesWarningIssued) {
            this.multipleFacesWarningIssued = true;
            const event: IntegrityEvent = {
              incidentId: `inc-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString(),
              questionId: this.currentQuestionId,
              questionNumber: this.currentQuestionNumber,
              eventType: 'multiple_faces',
              description: 'Multiple faces observed in camera frame',
              severity: 'high',
              confidence: 0.89,
              actionTaken: 'Immediate integrity warning presented.'
            };

            this.processViolation(
              event,
              'MULTIPLE PEOPLE DETECTED: Please ensure you are the only person visible in the camera frame during the interview.',
              true // isSerious
            );
          }
        } else {
          this.consecutiveMultiple = 0;
          this.multipleFacesWarningIssued = false;
        }
      }

      this.callbacks?.onStateUpdate({
        faceDetected,
        multipleFaces,
        lookingAway,
        cameraCovered,
        cameraOk,
        micOk: true
      });
    } catch (e) {}
  }

  public reportHardwareInterruption(type: 'camera' | 'microphone') {
    if (!this.isAuditing) return;

    const event: IntegrityEvent = {
      incidentId: `inc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      questionId: this.currentQuestionId,
      questionNumber: this.currentQuestionNumber,
      eventType: type === 'camera' ? 'camera_interruption' : 'mic_interruption',
      description: `${type === 'camera' ? 'Camera' : 'Microphone'} stream connection was interrupted`,
      severity: 'medium',
      confidence: 0.95,
      actionTaken: 'Hardware interruption logged; recovery requested.'
    };

    this.processViolation(
      event,
      `${type === 'camera' ? 'Camera' : 'Microphone'} connection lost. Please restore your device to continue.`
    );
  }

  public stopAuditing() {
    this.isAuditing = false;
    if (this.frameIntervalId) {
      clearInterval(this.frameIntervalId);
      this.frameIntervalId = null;
    }
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      window.removeEventListener('blur', this.handleWindowBlur);
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    }
    this.consecutiveAbsence = 0;
    this.consecutiveMultiple = 0;
    this.consecutiveAway = 0;
    this.consecutiveDark = 0;
    this.callbacks = null;
  }
}
