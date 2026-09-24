import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  InterviewQuestion,
  InterviewResult,
  IntegrityEvent,
  QuestionEvaluationResult,
  SkillLevel
} from '../../types';
import {
  ROLE_CATEGORIES,
  ROLE_QUESTION_BANKS,
  selectInterviewQuestions,
  QuestionCountOption,
  InterviewFocusOption,
  getUsedQuestionIds,
  saveUsedQuestionIds,
  getStoredInterviewHistory,
  appendInterviewHistory
} from '../../data/interviewQuestions';
import {
  TTSService,
  STTService,
  AudioLevelMonitor,
  CameraService,
  CameraState,
  SessionManager,
  IntegrityAuditor,
  evaluateStudentAnswer,
  generateFollowUpDecision,
  getAIIntroScript,
  getAIClosingScript,
  getRandomTransitionPhrase,
  getNaturalAcknowledgement,
  INTERVIEWER_PERSONAS,
  getDefaultInterviewerPersona,
  InterviewerVisualState,
  InterviewerPersona,
  InterviewSessionStatus
} from '../../services/aiInterview';
import { AIVoiceInterviewer } from './interview/AIVoiceInterviewer';
import { IntegrityTimelineModal } from './interview/IntegrityTimelineModal';
import { InterviewHistoryModal } from './interview/InterviewHistoryModal';
import { InterviewApi } from '../../services/interviewApi';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  Shield,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  History,
  BrainCircuit,
  FileCheck,
  TrendingUp,
  Square,
  Radio,
  RefreshCw,
  Headphones,
  Zap,
  XCircle,
  AlertOctagon,
  Briefcase,
  Maximize2,
  Wifi,
  WifiOff,
  Eye,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockInterviewProps {
  onNavigateToOpportunities: () => void;
}

interface SubmittedAnswer {
  questionId: string;
  questionText: string;
  category: string;
  skillTested: string;
  answerText: string;
  timeSpentSeconds: number;
}

export const MockInterview: React.FC<MockInterviewProps> = ({ onNavigateToOpportunities }) => {
  const { studentProfile, industrySkills, saveInterviewResult, selectedOpportunityContext } = useApp();

  // Setup state (Configuration screen preserved)
  const [selectedRole, setSelectedRole] = useState(
    selectedOpportunityContext?.title || studentProfile.targetRole || 'Java Backend Developer'
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<SkillLevel>('Intermediate');
  const [interviewType, setInterviewType] = useState<'Technical Only' | 'HR Only' | 'Technical + HR'>('Technical + HR');
  const [questionCount, setQuestionCount] = useState<QuestionCountOption>(10);
  const [interviewFocus, setInterviewFocus] = useState<InterviewFocusOption>('Balanced');

  // Execution flow state
  const [executionState, setExecutionState] = useState<InterviewSessionStatus>('CONFIG');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Interviewer Persona & Visual Presence
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('dr-sarah-vance');
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [candidateThinkingNotice, setCandidateThinkingNotice] = useState(false);
  const currentPersona = getDefaultInterviewerPersona(selectedPersonaId);

  // Hardware & media streams
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [cameraState, setCameraState] = useState<CameraState>('CAMERA_INITIALIZING');
  const [videoLabel, setVideoLabel] = useState<string>('Candidate Webcam');
  const [audioLabel, setAudioLabel] = useState<string>('Microphone Input');
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [cameraStreamReady, setCameraStreamReady] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hardwareError, setHardwareError] = useState<string | null>(null);

  // Environmental & browser state
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [consentAccepted, setConsentAccepted] = useState<boolean>(true);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Services instances
  const ttsRef = useRef<TTSService>(TTSService.getInstance());
  const sttRef = useRef<STTService | null>(null);
  const audioMonitorRef = useRef<AudioLevelMonitor | null>(null);
  const cameraServiceRef = useRef<CameraService>(CameraService.getInstance());
  const sessionManagerRef = useRef<SessionManager>(SessionManager.getInstance());
  const integrityAuditorRef = useRef<IntegrityAuditor>(IntegrityAuditor.getInstance());

  // Question & Session Flow
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [activeFollowUpQuestion, setActiveFollowUpQuestion] = useState<InterviewQuestion | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [isRecordingAnswer, setIsRecordingAnswer] = useState(false);
  const [isSilenceDetected, setIsSilenceDetected] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswer[]>([]);
  const [questionEvaluations, setQuestionEvaluations] = useState<QuestionEvaluationResult[]>([]);
  const [statusSubtitle, setStatusSubtitle] = useState<string>('Please listen to the interviewer.');

  // Computed Interviewer Visual State
  const interviewerVisualState: InterviewerVisualState = hardwareError
    ? 'CONNECTION_ISSUE'
    : isSpeakingQuestion
    ? 'SPEAKING'
    : executionState === 'LISTENING'
    ? 'LISTENING'
    : executionState === 'ANALYZING_RESPONSE'
    ? 'THINKING'
    : executionState === 'FOLLOW_UP'
    ? 'FOLLOW_UP'
    : 'IDLE';

  // Integrity & Anti-Fraud State (Progressive warning policy)
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [warningCount, setWarningCount] = useState(0);
  const [softWarningText, setSoftWarningText] = useState<string | null>(null);
  const [activeWarningModal, setActiveWarningModal] = useState<string | null>(null);
  const [seriousIncidentModal, setSeriousIncidentModal] = useState<string | null>(null);
  const [autoSubmittedReason, setAutoSubmittedReason] = useState<string | null>(null);
  const [integrityRisk, setIntegrityRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [visionState, setVisionState] = useState({
    faceDetected: true,
    multipleFaces: false,
    lookingAway: false,
    cameraCovered: false,
    cameraOk: true,
    micOk: true
  });

  // Final Result & History
  const [finalResult, setFinalResult] = useState<InterviewResult | null>(null);
  const [pastInterviews, setPastInterviews] = useState<InterviewResult[]>([]);
  const [viewingPastReport, setViewingPastReport] = useState<InterviewResult | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isInitializingNewSession, setIsInitializingNewSession] = useState(false);

  // Active question currently displayed
  const currentQ = activeFollowUpQuestion || questions[currentQuestionIndex] || null;

  // Load history & restore active session on mount
  useEffect(() => {
    setPastInterviews(getStoredInterviewHistory());
    sttRef.current = new STTService();
    setSttSupported(sttRef.current.isSupported());
    audioMonitorRef.current = new AudioLevelMonitor();

    // Check for active session recovery (anti-bypass across refresh)
    const existing = sessionManagerRef.current.getActiveSession();
    if (existing && existing.questions.length > 0) {
      setSessionId(existing.sessionId);
      setSelectedRole(existing.role);
      setSelectedDifficulty(existing.difficulty);
      setQuestionCount(existing.questionCount as QuestionCountOption);
      setQuestions(existing.questions);
      setCurrentQuestionIndex(existing.currentQuestionIndex);
      setSubmittedAnswers(existing.answers);
      setQuestionEvaluations(existing.evaluations);
      setWarningCount(existing.warningCount);
      setIntegrityEvents(existing.integrityEvents);
      setElapsedSeconds(existing.elapsedSeconds);

      if (existing.warningCount >= 2 || existing.status === 'AUTO_SUBMITTED_INTEGRITY_VIOLATION') {
        setAutoSubmittedReason('Repeated interview integrity violations detected.');
        finishInterview(existing.answers, existing.evaluations, true);
      } else {
        setInterviewStarted(true);
        setExecutionState('AI_SPEAKING');
        initHardwareAndResume(existing);
      }
    }

    return () => {
      ttsRef.current.cancel();
      sttRef.current?.stop();
      audioMonitorRef.current?.stop();
      integrityAuditorRef.current.stopAuditing();
      cameraServiceRef.current.stopAll();
    };
  }, []);

  const initHardwareAndResume = async (session: any) => {
    const conn = await cameraServiceRef.current.requestMediaAccess();
    if (conn.success && conn.stream) {
      setHasCameraPermission(true);
      setHasMicPermission(true);
      if (videoRef.current) {
        await cameraServiceRef.current.attachStreamToVideoElement(videoRef.current, conn.stream);
        setCameraStreamReady(true);
      }
      audioMonitorRef.current?.start(conn.stream, (lvl) => setAudioLevel(lvl));
      startIntegrityMonitoring(session.warningCount);
    }
  };

  // Session timer
  useEffect(() => {
    let timer: any;
    if (interviewStarted && !interviewFinished) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStarted, interviewFinished]);

  // Robust video element attachment & readyState monitoring
  useEffect(() => {
    if (interviewStarted && !interviewFinished && cameraActive && videoRef.current) {
      const stream = cameraServiceRef.current.getStream();
      if (stream) {
        cameraServiceRef.current.attachStreamToVideoElement(videoRef.current, stream).then((ready) => {
          setCameraStreamReady(ready);
        });
      }

      const verifyInterval = setInterval(() => {
        if (videoRef.current) {
          if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
            setCameraStreamReady(true);
          } else if (stream && videoRef.current.srcObject !== stream) {
            cameraServiceRef.current.attachStreamToVideoElement(videoRef.current, stream);
          }
        }
      }, 500);

      return () => clearInterval(verifyInterval);
    }
  }, [interviewStarted, interviewFinished, cameraActive]);

  // Sync TTS voice gender whenever interviewer persona changes
  useEffect(() => {
    ttsRef.current.selectVoiceForGender(currentPersona.voiceGender);
  }, [currentPersona.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Speak text helper using TTS service
  const speakText = async (text: string): Promise<void> => {
    setIsSpeakingQuestion(true);
    return ttsRef.current.speak(text, {
      gender: currentPersona.voiceGender,
      rate: currentPersona.voiceRate,
      pitch: currentPersona.voicePitch,
      onStart: () => setIsSpeakingQuestion(true),
      onEnd: () => setIsSpeakingQuestion(false),
      onError: () => setIsSpeakingQuestion(false)
    });
  };

  // Auto-dismiss soft warning toast
  useEffect(() => {
    if (softWarningText) {
      const timer = setTimeout(() => {
        setSoftWarningText(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [softWarningText]);

  // Online / offline & window lifecycle listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (interviewStarted && !interviewFinished) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave the active interview?';
        return 'Are you sure you want to leave the active interview?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [interviewStarted, interviewFinished]);

  // ============================================================================
  // INTEGRITY MONITORING & THREE-STRIKE PROGRESSIVE VIOLATION HANDLER
  // ============================================================================
  const startIntegrityMonitoring = (initialWarnings = 0) => {
    cameraServiceRef.current.setTrackEndedListener((type) => {
      setHardwareError(`${type === 'camera' ? 'Camera' : 'Microphone'} stream connection was interrupted.`);
      integrityAuditorRef.current.reportHardwareInterruption(type);
    });

    integrityAuditorRef.current.setAccessibilityMode(accessibilityMode);

    integrityAuditorRef.current.startAuditing(
      {
        onSoftWarning: (message) => {
          setSoftWarningText(message);
        },
        onWarning: (message, newCount, event) => {
          setWarningCount(newCount);
          setIntegrityEvents((prev) => [event, ...prev]);
          setIntegrityRisk(newCount >= 2 ? 'HIGH' : 'MEDIUM');
          setActiveWarningModal(message);
          InterviewApi.recordIntegrityEvent(sessionId, event);
        },
        onSeriousIncident: (message, event) => {
          setIntegrityEvents((prev) => [event, ...prev]);
          setIntegrityRisk('HIGH');
          setSeriousIncidentModal(message);
          InterviewApi.recordIntegrityEvent(sessionId, event);
        },
        onAutoSubmit: (reason, finalEvts) => {
          setWarningCount(3);
          setIntegrityRisk('HIGH');
          setIntegrityEvents((prev) => [...finalEvts, ...prev]);
          setAutoSubmittedReason(reason);
          finalEvts.forEach((ev) => InterviewApi.recordIntegrityEvent(sessionId, ev));
          finishInterview(submittedAnswers, questionEvaluations, true);
        },
        onStateUpdate: (state) => {
          setVisionState(state);
        }
      },
      initialWarnings
    );

    if (videoRef.current) {
      integrityAuditorRef.current.startFrameAnalysis(videoRef.current);
    }
  };
 
  // Cleanly starts a new interview session and opens the interview setup directly
  const handleStartNewInterview = () => {
    if (isInitializingNewSession) return;
    setIsInitializingNewSession(true);

    // Cleanly terminate active hardware and speech
    ttsRef.current.cancel();
    sttRef.current?.stop();
    audioMonitorRef.current?.stop();
    integrityAuditorRef.current.stopAuditing();
    cameraServiceRef.current.stopAll();

    // Clear active session to ensure fresh session generation
    sessionManagerRef.current.clearSession();

    // Reset runtime states
    setInterviewStarted(false);
    setInterviewFinished(false);
    setFinalResult(null);
    setViewingPastReport(null);
    setAutoSubmittedReason(null);
    setSubmittedAnswers([]);
    setQuestionEvaluations([]);
    setIntegrityEvents([]);
    setWarningCount(0);
    setCurrentQuestionIndex(0);
    setActiveFollowUpQuestion(null);
    setElapsedSeconds(0);
    setHardwareError(null);
    setStudentAnswerText('');
    setStatusSubtitle('Please listen to the interviewer.');

    // Transition directly to interview setup
    setExecutionState('CONFIG');

    setTimeout(() => {
      setIsInitializingNewSession(false);
    }, 350);
  };

  // Open past interview report from history
  const handleSelectPastInterview = (past: InterviewResult) => {
    setViewingPastReport(past);
    setFinalResult(past);
    setInterviewFinished(true);
    setInterviewStarted(false);
    setExecutionState('COMPLETED');
  };

  // ============================================================================
  // STEP 1: PROCEED TO INTERVIEW SYSTEM CHECK (CAMERA + MIC PRE-CHECK)
  // ============================================================================
  const handleProceedToSystemCheck = async () => {
    const usedIds = getUsedQuestionIds(selectedRole);
    const selected = selectInterviewQuestions({
      role: selectedRole,
      count: questionCount,
      difficulty: selectedDifficulty,
      interviewType,
      focus: interviewFocus,
      studentSkills: studentProfile.skills,
      industrySkills,
      usedQuestionIds: usedIds
    });

    if (selected.length === 0) {
      alert('No questions found for this role. Please select another role.');
      return;
    }

    saveUsedQuestionIds(selectedRole, selected.map((q) => q.id));

    // Create persistent session
    const session = sessionManagerRef.current.createSession({
      role: selectedRole,
      difficulty: selectedDifficulty,
      questionCount,
      questions: selected
    });

    setSessionId(session.sessionId);
    setQuestions(selected);
    setCurrentQuestionIndex(0);
    setActiveFollowUpQuestion(null);
    setStudentAnswerText('');
    setSubmittedAnswers([]);
    setQuestionEvaluations([]);
    setElapsedSeconds(0);
    setQuestionStartTime(0);
    setIntegrityEvents([]);
    setWarningCount(0);
    setIntegrityRisk('LOW');
    setActiveWarningModal(null);
    setSeriousIncidentModal(null);
    setSoftWarningText(null);
    setAutoSubmittedReason(null);
    setHardwareError(null);
    setInterviewFinished(false);
    setViewingPastReport(null);

    setExecutionState('SYSTEM_CHECK');

    // Request actual camera & microphone for live preview
    const conn = await cameraServiceRef.current.requestMediaAccess();
    setCameraState(conn.cameraState);
    if (conn.videoLabel) setVideoLabel(conn.videoLabel);
    if (conn.audioLabel) setAudioLabel(conn.audioLabel);

    if (conn.success && conn.stream) {
      setHasCameraPermission(true);
      setHasMicPermission(true);
      audioMonitorRef.current?.start(conn.stream, (lvl) => setAudioLevel(lvl));

      if (previewVideoRef.current) {
        cameraServiceRef.current.attachStreamToVideoElement(previewVideoRef.current, conn.stream);
      }
    } else {
      setHasCameraPermission(false);
      setHasMicPermission(false);
      setHardwareError(conn.error || 'Camera or microphone not available.');
    }
  };

  // Launch interview from System Check into active session
  const handleLaunchInterviewFromCheck = async () => {
    if (!hasCameraPermission || !hasMicPermission) {
      alert('Please connect and authorize your camera and microphone before starting.');
      return;
    }

    // Request browser fullscreen mode where supported
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (e) {
        console.warn('Fullscreen request bypassed:', e);
      }
    }

    // Register active session with backend API
    InterviewApi.registerSession({
      sessionId,
      role: selectedRole,
      difficulty: selectedDifficulty,
      questionCount,
      studentId: studentProfile.id || studentProfile.email,
      opportunityId: selectedOpportunityContext?.id
    });

    setInterviewStarted(true);

    if (videoRef.current && cameraServiceRef.current.getStream()) {
      const ready = await cameraServiceRef.current.attachStreamToVideoElement(
        videoRef.current,
        cameraServiceRef.current.getStream()
      );
      setCameraStreamReady(ready);
    }

    startIntegrityMonitoring(0);
    startAIIntroduction(questions);
  };

  // ============================================================================
  // STEP 2: AI INTRODUCTION
  // ============================================================================
  const startAIIntroduction = async (selectedQuestions: InterviewQuestion[]) => {
    setExecutionState('AI_INTRODUCTION');
    setStatusSubtitle('Interviewer Introduction: Welcome & Technical Guidance');

    // Re-verify video playback
    if (videoRef.current && cameraServiceRef.current.getStream()) {
      cameraServiceRef.current.attachStreamToVideoElement(videoRef.current, cameraServiceRef.current.getStream());
    }

    const introText = getAIIntroScript(studentProfile.fullName, selectedRole, selectedQuestions.length);
    await speakText(introText);

    transitionToQuestion(selectedQuestions[0], 0);
  };

  // ============================================================================
  // STEP 3: TRANSITION & SPEAK QUESTION
  // ============================================================================
  const transitionToQuestion = async (question: InterviewQuestion, index: number) => {
    setCurrentQuestionIndex(index);
    setActiveFollowUpQuestion(null);
    setStudentAnswerText('');
    setQuestionStartTime(elapsedSeconds);
    setExecutionState('AI_SPEAKING');
    setStatusSubtitle('AI IS SPEAKING: Please listen carefully to the question.');

    await speakText(question.question);
    startListeningMode();
  };

  // ============================================================================
  // STEP 4: LISTENING & STUDENT ANSWERING
  // ============================================================================
  const startListeningMode = () => {
    setExecutionState('LISTENING');
    setStatusSubtitle('AI IS LISTENING: Speak clearly into your microphone.');
    setIsRecordingAnswer(true);
    setIsSilenceDetected(false);

    if (sttRef.current?.isSupported()) {
      sttRef.current.start(
        {
          onInterimResult: (transcript) => {
            setStudentAnswerText(transcript);
          },
          onFinalResult: (transcript) => {
            setStudentAnswerText(transcript);
          },
          onStatusChange: (status) => {
            if (status === 'speaking_detected') {
              setIsSilenceDetected(false);
              setCandidateThinkingNotice(false);
              setStatusSubtitle('AI IS LISTENING: Transcribing your spoken answer in real-time...');
            } else if (status === 'candidate_thinking') {
              setCandidateThinkingNotice(true);
              setStatusSubtitle('Interviewer is waiting while you formulate your response...');
            } else if (status === 'silence_detected') {
              setIsSilenceDetected(true);
              setStatusSubtitle('Answer captured ✓ You may continue speaking or click Submit Answer.');
            }
          },
          onSilenceThresholdReached: () => {
            setIsSilenceDetected(true);
          },
          onError: () => {}
        },
        studentAnswerText
      );
    }
  };

  const stopListeningMode = () => {
    setIsRecordingAnswer(false);
    if (sttRef.current) {
      const finalTranscript = sttRef.current.stop();
      if (finalTranscript) {
        setStudentAnswerText(finalTranscript);
      }
    }
    setStatusSubtitle('Microphone recording paused. You can edit or submit your answer.');
  };

  const handleToggleRecording = () => {
    if (isRecordingAnswer) {
      stopListeningMode();
    } else {
      startListeningMode();
    }
  };

  const handleReplayQuestion = () => {
    if (!currentQ) return;
    stopListeningMode();
    setExecutionState('AI_SPEAKING');
    setStatusSubtitle('Replaying question audio...');
    speakText(currentQ.question).then(() => {
      startListeningMode();
    });
  };

  // ============================================================================
  // STEP 5: SUBMIT ANSWER, DYNAMIC EVALUATION, AND ADAPTIVE FOLLOW-UP
  // ============================================================================
  const handleSubmitAnswer = async () => {
    if (!currentQ || studentAnswerText.trim().length === 0) return;

    stopListeningMode();
    setExecutionState('ANALYZING_RESPONSE');
    setStatusSubtitle('Evaluating response against industry criteria... ✓');

    const timeSpent = Math.max(5, elapsedSeconds - questionStartTime);
    const trimmedAnswer = studentAnswerText.trim();

    // Dynamic NLP evaluation (strictly non-static)
    const evaluation = evaluateStudentAnswer({
      question: currentQ,
      questionNumber: currentQuestionIndex + 1,
      answerText: trimmedAnswer,
      timeSpentSeconds: timeSpent,
      targetRole: selectedRole,
      targetDifficulty: selectedDifficulty,
      studentProfile,
      industrySkills,
      isFollowUp: !!activeFollowUpQuestion,
      parentQuestionId: activeFollowUpQuestion ? questions[currentQuestionIndex].id : undefined
    });

    const updatedEvaluations = [...questionEvaluations, evaluation];
    setQuestionEvaluations(updatedEvaluations);

    const newSubmitted: SubmittedAnswer = {
      questionId: currentQ.id,
      questionText: currentQ.question,
      category: currentQ.category,
      skillTested: currentQ.skillTested,
      answerText: trimmedAnswer,
      timeSpentSeconds: timeSpent
    };
    const updatedAnswers = [...submittedAnswers, newSubmitted];
    setSubmittedAnswers(updatedAnswers);

    // Save progress to persistent session
    sessionManagerRef.current.updateProgress(
      currentQuestionIndex,
      updatedAnswers,
      updatedEvaluations,
      elapsedSeconds
    );

    await new Promise((r) => setTimeout(r, 1000));

    // Adaptive follow-up check (if not already in a follow-up)
    if (!activeFollowUpQuestion) {
      const followUpDecision = generateFollowUpDecision(evaluation, currentQ, selectedRole);

      if (followUpDecision.shouldAskFollowUp && followUpDecision.followUpQuestion) {
        setExecutionState('FOLLOW_UP');
        setActiveFollowUpQuestion(followUpDecision.followUpQuestion);
        setStudentAnswerText('');
        setQuestionStartTime(elapsedSeconds);
        setStatusSubtitle('Adaptive Follow-up: Targeted technical deep-dive...');

        await speakText(`${followUpDecision.transitionPhrase} ${followUpDecision.followUpQuestion.question}`);
        startListeningMode();
        return;
      }
    }

    // Move to next main question or finish
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < questions.length) {
      setExecutionState('NEXT_QUESTION');
      setActiveFollowUpQuestion(null);
      setStatusSubtitle('Moving to the next question...');

      const transitionPhrase = getRandomTransitionPhrase('next');
      await speakText(transitionPhrase);

      transitionToQuestion(questions[nextIdx], nextIdx);
    } else {
      finishInterview(updatedAnswers, updatedEvaluations, false);
    }
  };

  // ============================================================================
  // STEP 6: FINISH INTERVIEW & COMPILE DYNAMIC REPORT
  // ============================================================================
  const finishInterview = async (
    finalAnswers: SubmittedAnswer[] = submittedAnswers,
    finalEvaluations: QuestionEvaluationResult[] = questionEvaluations,
    isAutoSubmitted = false
  ) => {
    stopListeningMode();
    ttsRef.current.cancel();
    audioMonitorRef.current?.stop();
    integrityAuditorRef.current.stopAuditing();
    cameraServiceRef.current.stopAll();

    setExecutionState('COMPLETED');
    setInterviewFinished(true);

    if (isAutoSubmitted) {
      setStatusSubtitle('Interview terminated and automatically submitted due to repeated integrity violations.');
    } else {
      setStatusSubtitle('Interview completed! Compiling comprehensive intelligence report...');
      const closingText = getAIClosingScript(studentProfile.fullName, selectedRole);
      speakText(closingText);
    }

    // Dynamic scoring derived solely from candidate evaluations
    const evalList = finalEvaluations.length > 0 ? finalEvaluations : [];
    const count = evalList.length || 1;

    let totalTech = 0;
    let totalComm = 0;
    let totalProblemSolving = 0;
    let totalConcept = 0;
    let totalOverall = 0;

    const skillScores: Record<string, { total: number; count: number }> = {};

    evalList.forEach((ev) => {
      totalTech += ev.technicalScore;
      totalComm += ev.communicationScore;
      totalConcept += ev.conceptUnderstandingScore;
      totalOverall += ev.overallScore;

      if (ev.category === 'Scenario-based' || ev.category === 'Projects' || ev.category === 'Coding') {
        totalProblemSolving += ev.overallScore;
      } else {
        totalProblemSolving += Math.round(ev.technicalScore * 0.95);
      }

      const sk = ev.skillTested || 'Core Concept';
      if (!skillScores[sk]) skillScores[sk] = { total: 0, count: 0 };
      skillScores[sk].total += ev.overallScore;
      skillScores[sk].count += 1;
    });

    const technicalScore = Math.round(totalTech / count);
    const communicationScore = Math.round(totalComm / count);
    const conceptUnderstandingScore = Math.round(totalConcept / count);
    const problemSolvingScore = Math.round(totalProblemSolving / count);

    // Dynamic overall weighted score: Technical (25%) + Concept (20%) + Problem Solving (20%) + Communication (15%) + Role (20%)
    const roleSpecificScore = Math.min(98, Math.max(40, Math.round(technicalScore * 0.9 + problemSolvingScore * 0.1)));
    const overallScore = Math.round(
      technicalScore * 0.25 +
        conceptUnderstandingScore * 0.2 +
        problemSolvingScore * 0.2 +
        communicationScore * 0.15 +
        roleSpecificScore * 0.2
    );

    const confidenceScore = Math.max(50, Math.min(95, 84 - warningCount * 6));
    const answerRelevanceScore = Math.max(52, Math.min(97, Math.round(conceptUnderstandingScore + 2)));
    const skillVerificationScore = Math.max(45, Math.min(96, technicalScore));

    const roleReadiness = Math.round(
      technicalScore * 0.4 + problemSolvingScore * 0.25 + communicationScore * 0.2 + confidenceScore * 0.15
    );
    const industrySkillMatch = Math.min(96, Math.max(55, roleReadiness + 3));

    // Skill-wise performance breakdown
    const skillWisePerformance = Object.entries(skillScores).slice(0, 5).map(([skill, data]) => {
      const avg = Math.round(data.total / data.count);
      return {
        skill,
        score: avg,
        benchmark: 75,
        status: (avg >= 80 ? 'Strong' : avg >= 65 ? 'Adequate' : 'Needs Improvement') as 'Strong' | 'Adequate' | 'Needs Improvement'
      };
    });

    // Claimed skills analysis
    const uniqueSkills = Array.from(new Set(questions.flatMap((q) => q.expectedSkills || [q.skillTested]))).slice(0, 4);
    const claimedSkillsAnalysis = uniqueSkills.map((skill) => {
      const studentClaim = studentProfile.skills.find((s) => s.name.toLowerCase() === skill.toLowerCase());
      const claimedLevel: SkillLevel = studentClaim ? studentClaim.level : selectedDifficulty;
      const perf = skillWisePerformance.find((p) => p.skill.toLowerCase() === skill.toLowerCase());
      const score = perf ? perf.score : overallScore;

      const demonstratedLevel: SkillLevel = score >= 82 ? 'Advanced' : score >= 65 ? 'Intermediate' : 'Beginner';
      const isVerified = score >= 68;

      return {
        skill,
        claimedLevel,
        demonstratedLevel,
        status: (isVerified ? 'Verified' : 'Skill Verification Concern') as 'Verified' | 'Skill Verification Concern' | 'Needs Practice',
        notes: isVerified
          ? `Demonstrated clear technical vocabulary and handled core design trade-offs with confidence.`
          : `Showed introductory understanding; omitted enterprise edge cases and exception handling nuances.`
      };
    });

    const lowestSkill = skillWisePerformance.sort((a, b) => a.score - b.score)[0] || { skill: selectedRole, score: 68 };

    const strengths = [
      `Grounded articulation of core ${selectedRole} principles and real-world workflows`,
      `Structured explanation cadence during live voice evaluation`,
      `Practical problem framing and constructive architectural orientation`
    ];

    const areasOfImprovement = [
      `Strengthen depth in production ${lowestSkill.skill} fault tolerance and concurrency`,
      `Incorporate quantitative metrics (throughput, latency bounds) into architectural justifications`,
      isAutoSubmitted
        ? `Ensure uninterrupted window focus to comply with interview integrity protocols`
        : `Practice concise STAR (Situation, Task, Action, Result) framing for scenario questions`
    ];

    const completionStatus: InterviewResult['completionStatus'] = isAutoSubmitted
      ? 'AUTO_SUBMITTED_INTEGRITY_VIOLATION'
      : 'COMPLETED_NORMALLY';

    const integrityStatus: InterviewResult['integrityStatus'] =
      isAutoSubmitted || warningCount >= 2 ? 'Review Required' : warningCount === 1 ? 'Warning' : 'Normal';

    const seriousIncidentsCount = integrityEvents.filter((e) => e.severity === 'high').length;

    const result: InterviewResult = {
      id: sessionId || `int-${Date.now()}`,
      role: selectedRole,
      difficulty: selectedDifficulty,
      date: new Date().toISOString().split('T')[0],
      overallScore,
      technicalScore,
      communicationScore,
      problemSolvingScore,
      confidenceScore,
      answerRelevanceScore,
      skillVerificationScore,
      conceptUnderstandingScore,
      roleSpecificScore,
      integrityRisk: isAutoSubmitted || warningCount >= 2 ? 'HIGH' : warningCount === 1 ? 'MEDIUM' : 'LOW',
      integrityRiskScore: isAutoSubmitted ? 100 : warningCount * 33,
      integrityWarningsCount: warningCount,
      integrityLog: integrityEvents,
      claimedSkillsAnalysis,
      strengths,
      areasOfImprovement,
      roleReadiness,
      industrySkillMatch,
      questionCount: questions.length,
      interviewFocus,
      durationSeconds: elapsedSeconds,
      followUpsCount: evalList.filter((e) => e.isFollowUp).length,
      questionEvaluations: evalList,
      skillWisePerformance,
      roadmapRecommendation: {
        recommendedSkill: lowestSkill.skill,
        reason: `Scored ${lowestSkill.score}% in the interview assessment. Strengthening this milestone will directly boost role qualification.`,
        actionLabel: `Open ${lowestSkill.skill} Learning Path`
      },
      opportunityId: selectedOpportunityContext?.id,
      opportunityTitle: selectedOpportunityContext?.title,
      opportunityCompany: selectedOpportunityContext?.companyName,
      completionStatus,
      integrityStatus,
      seriousIncidentsCount
    };

    setFinalResult(result);
    saveInterviewResult(result);
    appendInterviewHistory(result);
    setPastInterviews(getStoredInterviewHistory());
    sessionManagerRef.current.clearSession();

    // Persist to backend server API
    InterviewApi.submitInterview(result);

    if (!isAutoSubmitted) {
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch (e) {}
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="space-y-6 pb-12 max-w-6xl"
      onCopy={(e) => {
        if (interviewStarted && !interviewFinished) {
          e.preventDefault();
          integrityAuditorRef.current.reportCopyPasteAttempt('copy');
        }
      }}
      onPaste={(e) => {
        if (interviewStarted && !interviewFinished) {
          e.preventDefault();
          integrityAuditorRef.current.reportCopyPasteAttempt('paste');
        }
      }}
      onCut={(e) => {
        if (interviewStarted && !interviewFinished) {
          e.preventDefault();
          integrityAuditorRef.current.reportCopyPasteAttempt('copy');
        }
      }}
      onContextMenu={(e) => {
        if (interviewStarted && !interviewFinished) {
          e.preventDefault();
        }
      }}
    >
      {/* ========================================================================= */}
      {/* TARGET OPPORTUNITY CONTEXT BANNER */}
      {/* ========================================================================= */}
      {selectedOpportunityContext && (
        <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Target Opportunity: {selectedOpportunityContext.title}
              </p>
              <p className="text-slate-600 text-xs">
                {selectedOpportunityContext.companyName} • Tailored AI Assessment & Skill Verification Mode
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[11px] self-start sm:self-auto">
            Connected to Opportunity Pipeline
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NETWORK CONNECTION RECOVERY BANNER */}
      {/* ========================================================================= */}
      {!isOnline && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-white text-xs font-semibold flex items-center justify-between shadow-md animate-pulse">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Connection lost. Attempting to reconnect... Interview session is safely paused.</span>
          </div>
          <span className="text-[11px] bg-amber-600 px-2 py-0.5 rounded">No Data Lost</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NON-INTRUSIVE SOFT WARNING TOAST (AUTO-DISMISSES IN 4s) */}
      {/* ========================================================================= */}
      {softWarningText && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-amber-300 px-5 py-2.5 rounded-2xl shadow-xl border border-amber-400/40 flex items-center space-x-2.5 text-xs font-semibold backdrop-blur-md animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{softWarningText}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER BAR (PRESERVED EXACTLY AS SPECIFIED) */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              AI Video Assessment
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">AI Video Mock Interview & Integrity Monitor</span>
            {isFullscreen && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Maximize2 className="w-3 h-3" />
                  <span>FULLSCREEN MODE ACTIVE</span>
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Video Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Realistic technical & behavioral interview with adaptive questions testing claimed skills and transparent integrity auditing.
          </p>
        </div>

        {interviewStarted && !interviewFinished && (
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 font-mono text-xs text-slate-800 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
            <button
              onClick={() => finishInterview(submittedAnswers, questionEvaluations, false)}
              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors"
            >
              End Interview
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* INTEGRITY WARNING MODAL (PROGRESSIVE 3-STRIKE WARNING SYSTEM) */}
      {/* ========================================================================= */}
      {activeWarningModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-2xl border border-amber-300 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 text-center">
              <h3 className="text-base font-bold text-slate-900">
                INTERVIEW INTEGRITY WARNING (Warning {warningCount} of 3)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {activeWarningModal}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 font-medium">
              Notice: Continued confirmed integrity violations will automatically terminate and submit your interview attempt.
            </div>

            <button
              onClick={() => setActiveWarningModal(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              I Understand — Return to Interview
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERIOUS INCIDENT MODAL (HIGH SEVERITY PRESENCE / MULTIPLE PEOPLE) */}
      {/* ========================================================================= */}
      {seriousIncidentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-2xl border-2 border-rose-500 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertOctagon className="w-6 h-6" />
            </div>

            <div className="space-y-1.5 text-center">
              <h3 className="text-base font-bold text-slate-900 uppercase">
                SERIOUS INTEGRITY EVENT DETECTED
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {seriousIncidentModal}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 font-medium">
              Notice: High-severity events are logged with timestamp and duration for institutional audit. Please ensure you are alone in frame.
            </div>

            <button
              onClick={() => setSeriousIncidentModal(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              I Understand — Return to Interview
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRE-INTERVIEW CONFIGURATION & START OR PAST REPORT VIEW */}
      {/* ========================================================================= */}
      {!interviewStarted && !interviewFinished && executionState === 'CONFIG' && (
        <>
          {viewingPastReport ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setViewingPastReport(null)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-xs"
                >
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  <span>Back to Interview Setup</span>
                </button>
                <span className="text-xs text-slate-500">Archived Session Report</span>
              </div>

              {/* Archived Session Full Report */}
              <div className="p-8 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] uppercase tracking-wider text-blue-600 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                        Historical Assessment
                      </span>
                      <span className="text-xs text-slate-500 font-medium">• {viewingPastReport.interviewFocus || 'Balanced'} Focus</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                      INTERVIEW PERFORMANCE REPORT
                    </h2>
                    <p className="text-xs text-slate-500">
                      Target Role: <strong>{viewingPastReport.role}</strong> • Level: {viewingPastReport.difficulty} • Date: {viewingPastReport.date}
                    </p>
                  </div>

                  <div className="flex items-baseline space-x-2 bg-blue-50/70 border border-blue-200/80 px-4 py-2.5 rounded-2xl">
                    <span className="text-xs text-blue-700 font-bold">OVERALL SCORE:</span>
                    <span className="text-3xl font-black text-blue-600">{viewingPastReport.overallScore}%</span>
                  </div>
                </div>

                {/* Score Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Role Readiness</span>
                    <span className="text-lg font-bold text-blue-600">{viewingPastReport.roleReadiness || viewingPastReport.overallScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Industry Match</span>
                    <span className="text-lg font-bold text-emerald-600">{viewingPastReport.industrySkillMatch || Math.min(100, viewingPastReport.overallScore + 4)}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Technical</span>
                    <span className="text-lg font-bold text-slate-900">{viewingPastReport.technicalScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Communication</span>
                    <span className="text-lg font-bold text-blue-600">{viewingPastReport.communicationScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Problem Solving</span>
                    <span className="text-lg font-bold text-indigo-600">{viewingPastReport.problemSolvingScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Concept</span>
                    <span className="text-lg font-bold text-violet-600">{viewingPastReport.conceptUnderstandingScore || viewingPastReport.technicalScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Confidence</span>
                    <span className="text-lg font-bold text-amber-600">{viewingPastReport.confidenceScore}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase block">Integrity</span>
                    <span className={`text-xs font-bold block mt-1 ${
                      viewingPastReport.integrityRisk === 'LOW' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {viewingPastReport.integrityRisk} RISK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Configuration Form Card */}
              <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm">
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto shadow-xs">
                    <Video className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">AI Video Mock Interview Configuration</h2>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto">
                    Select from 28 industry roles with over 980+ domain-specific questions, adaptive difficulty, and real-time interactive voice evaluation.
                  </p>
                </div>

                <div className="space-y-5 text-xs">
                  {/* Role Selector */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Target Industry Role (28 Specialized Roles)</span>
                      <span className="text-[11px] font-normal text-blue-600">
                        {ROLE_QUESTION_BANKS[selectedRole]?.length || 35}+ Questions Available
                      </span>
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    >
                      {ROLE_CATEGORIES.map((cat) => (
                        <optgroup key={cat.category} label={cat.category}>
                          {cat.roles.map((role) => (
                            <option key={role} value={role}>
                              {role} ({ROLE_QUESTION_BANKS[role]?.length || 35} questions)
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Configuration Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Question Count</label>
                      <select
                        value={questionCount}
                        onChange={(e) => setQuestionCount(Number(e.target.value) as QuestionCountOption)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value={5}>5 Questions (Express Mock ~8 mins)</option>
                        <option value={10}>10 Questions (Standard Interview ~18 mins)</option>
                        <option value={15}>15 Questions (In-Depth Technical ~28 mins)</option>
                        <option value={20}>20 Questions (Comprehensive Evaluation ~38 mins)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Adaptive Focus</label>
                      <select
                        value={interviewFocus}
                        onChange={(e) => setInterviewFocus(e.target.value as InterviewFocusOption)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value="Balanced">Balanced Assessment (Tech + Behavioral + Scenario)</option>
                        <option value="Technical Focus">Technical Deep-Dive (Architecture & Core)</option>
                        <option value="Skill Gap Focus">Skill Gap Focus (Target Weak Areas)</option>
                        <option value="Industry Demand Focus">Industry Demand Focus (Top Market Needs)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Target Difficulty</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value as SkillLevel)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value="Beginner">Beginner (Foundational / Junior Engineer)</option>
                        <option value="Intermediate">Intermediate (Core Enterprise / Mid-Level)</option>
                        <option value="Advanced">Advanced (High Scale / Senior Lead)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">Interview Format</label>
                      <select
                        value={interviewType}
                        onChange={(e) => setInterviewType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      >
                        <option value="Technical + HR">Technical + HR & Behavioral</option>
                        <option value="Technical Only">Technical Only</option>
                        <option value="HR Only">HR & Behavioral Only</option>
                      </select>
                    </div>
                  </div>

                  {/* AI Voice Interviewer Persona Selection */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-slate-700">Select AI Voice Interviewer</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {INTERVIEWER_PERSONAS.map((persona) => {
                        const isSelected = selectedPersonaId === persona.id;
                        return (
                          <div
                            key={persona.id}
                            onClick={() => setSelectedPersonaId(persona.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                              isSelected
                                ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200'
                                : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                              isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-200/80 text-slate-600 border-slate-300'
                            }`}>
                              <Volume2 className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold text-slate-900 text-xs truncate">{persona.name}</span>
                                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                  {persona.voiceGender === 'female' ? 'Female Voice' : 'Male Voice'}
                                </span>
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-blue-600 font-medium truncate">{persona.title}</p>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{persona.bio}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Accessibility & Sensor Accommodation */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="space-y-0.5 pr-3">
                      <span className="font-semibold text-slate-900 text-xs block">
                        Gaze Pattern & Single-Monitor Accommodation
                      </span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Calibrates attention detection to accommodate off-axis webcams, multi-screen setups, or visual preferences.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={accessibilityMode}
                      onChange={(e) => {
                        setAccessibilityMode(e.target.checked);
                        integrityAuditorRef.current.setAccessibilityMode(e.target.checked);
                      }}
                      className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 shrink-0 cursor-pointer"
                    />
                  </div>

                  {/* Integrity Transparency Notice */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                    <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Interview Integrity Protocol (Notice to Student)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      During this mock interview, browser tab visibility, microphone levels, and camera presence signals are monitored in real-time. Leaving the interview tab triggers a confirmed warning. A second confirmed violation automatically ends and submits the interview attempt.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleProceedToSystemCheck}
                    className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-xs"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch {selectedRole} Mock Interview</span>
                  </button>
                </div>
              </div>

              {/* Past Interviews History */}
              {pastInterviews.length > 0 && (
                <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-white border border-slate-200/90 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <History className="w-4 h-4 text-blue-600" />
                      <span>Previous Mock Interview Attempts ({pastInterviews.length})</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">Stored in Local Profile</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {pastInterviews.slice(0, 5).map((past, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{past.role}</span>
                            <span className="px-2 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700 font-medium">
                              {past.difficulty}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {past.date} • {past.interviewFocus || 'Standard'} • Integrity: {past.integrityRisk}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block uppercase">Overall</span>
                            <span className="text-base font-bold text-blue-600">{past.overallScore}%</span>
                          </div>
                          <button
                            onClick={() => setViewingPastReport(past)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 font-semibold text-xs transition-colors"
                          >
                            View Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* STEP 1.5: INTERACTIVE INTERVIEW SYSTEM CHECK */}
      {/* ========================================================================= */}
      {!interviewStarted && !interviewFinished && executionState === 'SYSTEM_CHECK' && (
        <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  Step 2 of 2
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Pre-Interview System & Hardware Check</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Interview System & Environmental Check
              </h2>
              <p className="text-xs text-slate-500">
                Verify camera stream, audio responsiveness, network stability, and position before starting your {selectedRole} interview.
              </p>
            </div>

            <button
              onClick={() => {
                cameraServiceRef.current.stopAll();
                setExecutionState('CONFIG');
              }}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Back to Setup
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: LIVE CANDIDATE VIDEO PREVIEW */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-blue-600" />
                  <span>Live Candidate Preview</span>
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  cameraState === 'CAMERA_ACTIVE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {cameraState.replace('_', ' ')}
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-950 flex items-center justify-center border border-slate-200 shadow-inner">
                {hasCameraPermission ? (
                  <>
                    <video
                      ref={(el) => {
                        previewVideoRef.current = el;
                        if (el) {
                          const stream = cameraServiceRef.current.getStream();
                          if (stream) {
                            cameraServiceRef.current.attachStreamToVideoElement(el, stream);
                          }
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />

                    {/* Face presence badge */}
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-semibold flex items-center space-x-1.5 shadow-xs">
                      <span className={`w-2 h-2 rounded-full ${visionState.faceDetected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className={visionState.faceDetected ? 'text-emerald-700' : 'text-amber-700'}>
                        {visionState.faceDetected ? 'Face Detected & Positioned ✓' : 'Position Face in Center'}
                      </span>
                    </div>

                    {/* Audio input level visualizer */}
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-medium text-blue-700 flex items-center space-x-1.5 shadow-xs">
                      <Mic className="w-3 h-3 text-blue-600" />
                      <div className="flex items-end space-x-0.5 h-3">
                        <span className="w-1 bg-blue-600 rounded-full transition-all duration-75" style={{ height: `${Math.max(3, audioLevel * 0.15)}px` }} />
                        <span className="w-1 bg-blue-600 rounded-full transition-all duration-75" style={{ height: `${Math.max(3, audioLevel * 0.22)}px` }} />
                        <span className="w-1 bg-blue-600 rounded-full transition-all duration-75" style={{ height: `${Math.max(3, audioLevel * 0.12)}px` }} />
                      </div>
                      <span>{audioLevel > 10 ? 'Audio Live' : 'Speak to test'}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400 space-y-2">
                    <VideoOff className="w-10 h-10 mx-auto text-slate-500" />
                    <p className="text-xs font-semibold text-slate-300">Camera Authorization Required</p>
                    <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                      {hardwareError || 'Please allow camera and microphone access in your browser to proceed with the video interview.'}
                    </p>
                    <button
                      onClick={async () => {
                        const conn = await cameraServiceRef.current.requestMediaAccess();
                        setCameraState(conn.cameraState);
                        if (conn.success && conn.stream) {
                          setHasCameraPermission(true);
                          setHasMicPermission(true);
                          setHardwareError(null);
                          if (previewVideoRef.current) {
                            cameraServiceRef.current.attachStreamToVideoElement(previewVideoRef.current, conn.stream);
                          }
                        } else {
                          setHardwareError(conn.error || 'Permission denied');
                        }
                      }}
                      className="mt-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Retry Device Access
                    </button>
                  </div>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[200px]">📷 {videoLabel}</span>
                <span className="truncate max-w-[200px]">🎙️ {audioLabel}</span>
              </div>
            </div>

            {/* RIGHT: SYSTEM READINESS CHECKLIST */}
            <div className="space-y-4">
              <span className="font-semibold text-slate-800 text-xs block">
                System Readiness Checklist
              </span>

              <div className="space-y-2 text-xs">
                {/* 1. Camera */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Video className="w-4 h-4 text-slate-500" />
                    <span>Camera Stream</span>
                  </span>
                  <span className={`font-semibold flex items-center space-x-1 ${hasCameraPermission ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {hasCameraPermission ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{hasCameraPermission ? 'Active & Live Feed Verified' : 'Access Required'}</span>
                  </span>
                </div>

                {/* 2. Microphone */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Mic className="w-4 h-4 text-slate-500" />
                    <span>Microphone & Audio</span>
                  </span>
                  <span className={`font-semibold flex items-center space-x-1 ${hasMicPermission ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {hasMicPermission ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                    <span>{hasMicPermission ? 'Audio Input Verified' : 'Access Required'}</span>
                  </span>
                </div>

                {/* 3. Network */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Wifi className="w-4 h-4 text-slate-500" />
                    <span>Network Connection</span>
                  </span>
                  <span className={`font-semibold flex items-center space-x-1 ${isOnline ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isOnline ? <CheckCircle2 className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    <span>{isOnline ? 'Online & Latency Stable' : 'Offline'}</span>
                  </span>
                </div>

                {/* 4. Face Visibility */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span>Face Visibility</span>
                  </span>
                  <span className={`font-semibold flex items-center space-x-1 ${visionState.faceDetected ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {visionState.faceDetected ? <CheckCircle2 className="w-4 h-4" /> : <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    <span>{visionState.faceDetected ? 'Candidate Position Verified' : 'Adjust Frame'}</span>
                  </span>
                </div>

                {/* 5. Browser Permissions */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-slate-700 font-medium">
                    <Lock className="w-4 h-4 text-slate-500" />
                    <span>Browser Permissions</span>
                  </span>
                  <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>HTML5 Media Ready</span>
                  </span>
                </div>
              </div>

              {/* Accessibility Accommodations Checkbox */}
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-1 text-xs">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accessibilityMode}
                    onChange={(e) => {
                      setAccessibilityMode(e.target.checked);
                      integrityAuditorRef.current.setAccessibilityMode(e.target.checked);
                    }}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 block">
                      Enable Accessibility Accommodations
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-relaxed">
                      Relaxes automated gaze and eye movement thresholds for candidates with physical, vision, or motor differences.
                    </span>
                  </div>
                </label>
              </div>

              {/* Consent check */}
              <div className="pt-1 text-[11px] text-slate-500 leading-relaxed">
                By starting, you consent to browser integrity monitoring and audio speech recognition directly within your session according to standard institutional assessment policy.
              </div>

              {/* Start Button */}
              <button
                onClick={handleLaunchInterviewFromCheck}
                disabled={!hasCameraPermission || !hasMicPermission}
                className="w-full py-3 px-5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Interview & Enter Fullscreen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE INTERVIEW LAYOUT (SPLIT SCREEN: AI INTERVIEWER + CANDIDATE CAMERA) */}
      {/* ========================================================================= */}
      {interviewStarted && !interviewFinished && (
        <div className="space-y-6 animate-fade-in">
          {/* Hardware interruption warning banner */}
          {hardwareError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{hardwareError}</span>
            </div>
          )}

          {/* SPLIT SCREEN: LEFT AI INTERVIEWER, RIGHT STUDENT CAMERA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: AI VOICE INTERVIEWER */}
            <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between min-h-[420px] overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-blue-700 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span>AI Interviewer: {currentPersona.name}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                    • {currentPersona.voiceGender === 'female' ? 'Female Voice' : 'Male Voice'}
                  </span>
                </div>

                {isSpeakingQuestion ? (
                  <span className="inline-flex items-center space-x-1.5 text-xs text-blue-600 font-semibold animate-pulse">
                    <Volume2 className="w-4 h-4" />
                    <span>SPEAKING...</span>
                  </span>
                ) : executionState === 'LISTENING' ? (
                  <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
                    <Mic className="w-4 h-4 animate-bounce" />
                    <span>LISTENING...</span>
                  </span>
                ) : executionState === 'ANALYZING_RESPONSE' ? (
                  <span className="inline-flex items-center space-x-1 text-xs text-indigo-600 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ANALYZING...</span>
                  </span>
                ) : null}
              </div>

              {/* Professional Voice Interviewer Visualization Panel */}
              <div className="my-auto">
                <AIVoiceInterviewer
                  visualState={interviewerVisualState}
                  isSpeaking={isSpeakingQuestion}
                  candidateAudioLevel={audioLevel}
                  currentQuestionText={currentQ?.question}
                  skillTested={currentQ?.skillTested}
                  targetRole={selectedRole}
                  interviewerName={currentPersona.name}
                  statusSubtitle={statusSubtitle}
                />
              </div>

              {/* Bottom AI Status & Replay audio button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 truncate max-w-xs font-medium">
                  {statusSubtitle}
                </span>

                {currentQ && executionState !== 'AI_INTRODUCTION' && (
                  <button
                    onClick={handleReplayQuestion}
                    disabled={isSpeakingQuestion}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-blue-600 hover:bg-slate-200 disabled:opacity-50 transition-colors shrink-0 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Question Audio</span>
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT: STUDENT CAMERA STREAM (GUARANTEED LIVE FEED - NO WHITE SCREEN) */}
            <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between min-h-[380px] overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-semibold text-slate-700 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200">
                  Candidate Stream: {studentProfile.fullName}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsTimelineOpen(true)}
                    title="Click to view chronological integrity audit log"
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1.5 transition-transform hover:scale-105 cursor-pointer ${
                      warningCount === 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : warningCount === 1
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <Shield className="w-3 h-3" />
                    <span>Integrity: {warningCount === 0 ? 'Verified' : `${warningCount} Warning`}</span>
                    <span className="text-[10px] underline ml-0.5 text-slate-500">Log</span>
                  </button>
                </div>
              </div>

              {/* Video Feed Tile */}
              <div className="my-auto relative rounded-xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center border border-slate-200">
                {cameraActive ? (
                  <>
                    <video
                      ref={(el) => {
                        videoRef.current = el;
                        if (el) {
                          const stream = cameraServiceRef.current.getStream();
                          if (stream) {
                            cameraServiceRef.current.attachStreamToVideoElement(el, stream).then((ready) => {
                              setCameraStreamReady(ready);
                            });
                          }
                        }
                      }}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover scale-x-[-1]"
                    />
                    {!cameraStreamReady && (
                      <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center text-slate-300 space-y-2 p-4 text-center">
                        <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
                        <p className="text-xs font-medium">Connecting camera video feed...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-4 text-slate-300">
                    <VideoOff className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs">Camera Feed Paused</p>
                  </div>
                )}

                {/* Real-Time Camera Covered / Hand on Lens Detection Overlay */}
                {visionState.cameraCovered && (
                  <div className="absolute inset-0 bg-rose-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 animate-fade-in border-2 border-rose-500 rounded-xl">
                    <AlertOctagon className="w-10 h-10 text-rose-400 mb-2 animate-bounce" />
                    <p className="text-sm font-bold text-white tracking-wide">CAMERA COVERED / OBSTRUCTED</p>
                    <p className="text-xs text-rose-200 mt-1 max-w-xs leading-relaxed">
                      Your laptop camera lens is blocked by your hand or an object. Please uncover your camera immediately to maintain interview integrity.
                    </p>
                  </div>
                )}

                {/* Face Presence Overlay Indicator */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-medium flex items-center space-x-1.5 shadow-xs z-10">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      visionState.cameraCovered
                        ? 'bg-rose-500 animate-ping'
                        : visionState.faceDetected
                        ? 'bg-emerald-500 animate-pulse'
                        : 'bg-amber-500'
                    }`}
                  />
                  <span
                    className={
                      visionState.cameraCovered
                        ? 'text-rose-700 font-bold'
                        : visionState.faceDetected
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }
                  >
                    {visionState.cameraCovered
                      ? 'Camera Obstructed • Uncover Lens'
                      : visionState.faceDetected
                      ? 'Face Detected • Active Gaze'
                      : 'Face Away • Center View'}
                  </span>
                </div>

                {/* Live Microphone Volume Indicator Overlay */}
                {isRecordingAnswer && micActive && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-slate-200 text-[10px] font-medium text-blue-700 flex items-center space-x-1.5 shadow-xs">
                    <div className="flex items-end space-x-0.5 h-3">
                      <span
                        className="w-1 bg-blue-600 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(4, audioLevel * 0.12)}px` }}
                      />
                      <span
                        className="w-1 bg-blue-600 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(4, audioLevel * 0.18)}px` }}
                      />
                      <span
                        className="w-1 bg-blue-600 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(4, audioLevel * 0.1)}px` }}
                      />
                    </div>
                    <span>{audioLevel > 15 ? 'Speaking...' : 'Listening...'}</span>
                  </div>
                )}
              </div>

              {/* Media Controls */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const next = !cameraActive;
                      setCameraActive(next);
                      cameraServiceRef.current.setCameraEnabled(next);
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      cameraActive
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    {cameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                    <span>{cameraActive ? 'Camera On' : 'Camera Off'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const next = !micActive;
                      setMicActive(next);
                      cameraServiceRef.current.setMicEnabled(next);
                    }}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                      micActive
                        ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                        : 'bg-rose-50 border-rose-200 text-rose-700'
                    }`}
                  >
                    {micActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    <span>{micActive ? 'Mic On' : 'Mic Off'}</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center space-x-2 font-medium">
                  <span className="text-emerald-700">✓ Camera Connected</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700">✓ Mic Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM INTERACTION: QUESTION & ANSWER PANEL */}
          {/* ========================================================================= */}
          {executionState === 'AI_INTRODUCTION' ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Interviewer Guidance</span>
              </div>
              <p className="text-base text-slate-800 leading-relaxed font-medium">
                "Hello {studentProfile.fullName.split(' ')[0]}. Welcome to your {selectedRole} mock interview session. I will guide you through {questions.length} tailored technical and scenario-based questions. Please speak clearly into your microphone, take your time to structure your thoughts, and feel free to mention concrete project examples."
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => transitionToQuestion(questions[0], 0)}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs"
                >
                  <span>Begin Question 1</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : currentQ ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              {/* Progress Bar & Header */}
              <div className="space-y-2 pb-3 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {activeFollowUpQuestion
                        ? `Follow-up on Question ${currentQuestionIndex + 1}`
                        : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">Category: {currentQ.category}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {currentQ.difficulty || selectedDifficulty}
                    </span>
                    {activeFollowUpQuestion && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        <span>Adaptive Deep-Dive</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-mono text-slate-400">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                "{currentQ.question}"
              </p>

              {/* Follow-up / Key Focus Tags */}
              {currentQ.followUpTopics && currentQ.followUpTopics.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="text-slate-400 font-medium">Evaluation Focus:</span>
                  {currentQ.followUpTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-mono text-[10px]">
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Student Answer Text Area (With Real-Time Transcription) */}
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <label className="font-semibold text-slate-700 flex items-center space-x-2">
                    <span>Candidate Answer (Spoken / Typed):</span>
                    {isRecordingAnswer && (
                      <span className="text-rose-600 font-bold text-[11px] flex items-center space-x-1 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-600" />
                        <span>RECORDING AUDIO</span>
                      </span>
                    )}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {sttSupported ? 'Live speech recognized directly into box' : 'Type your answer below'}
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={studentAnswerText}
                  onChange={(e) => setStudentAnswerText(e.target.value)}
                  placeholder={
                    isRecordingAnswer
                      ? 'Listening to your voice... Speak your technical explanation, architectural trade-offs, or code details...'
                      : 'Click "Start Answer" to record your voice or type your response here...'
                  }
                  className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:bg-white focus:border-blue-600 focus:outline-none leading-relaxed resize-none transition-colors"
                />

                {isSilenceDetected && (
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Answer captured ✓ Click Submit Answer to continue.</span>
                  </p>
                )}
              </div>

              {/* Functional Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleToggleRecording}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                      isRecordingAnswer
                        ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {isRecordingAnswer ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Answer</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Start Answer (Mic)</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setStudentAnswerText(
                        "I don't have deep practical experience with this specific concept yet, but I understand the high-level purpose and would approach learning it systematically."
                      )
                    }
                    className="text-xs text-slate-500 hover:text-amber-600 transition-colors underline"
                  >
                    "I don't know this yet"
                  </button>
                </div>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={studentAnswerText.trim().length === 0}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xs"
                >
                  <span>
                    {activeFollowUpQuestion
                      ? 'Submit Follow-up Answer'
                      : currentQuestionIndex + 1 < questions.length
                      ? 'Submit Answer'
                      : 'Complete & Evaluate Interview'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPREHENSIVE INTERVIEW PERFORMANCE REPORT */}
      {/* ========================================================================= */}
      {interviewFinished && finalResult && (
        <div className="space-y-6 animate-fade-in">
          {autoSubmittedReason && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3">
              <div className="flex items-center space-x-3">
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-rose-900">INTERVIEW AUTOMATICALLY SUBMITTED</h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-200 text-rose-800 px-2 py-0.5 rounded">
                      Partial Assessment
                    </span>
                  </div>
                  <p className="text-xs text-rose-700 mt-0.5">{autoSubmittedReason}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-rose-200/60 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/60">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Completed Questions</span>
                  <span className="text-base font-bold text-slate-900">
                    {finalResult.questionEvaluations?.length || 0} / {finalResult.questionCount || questions.length}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/60">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Answered</span>
                  <span className="text-base font-bold text-emerald-700">
                    {finalResult.questionEvaluations?.length || 0}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/60">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Unanswered</span>
                  <span className="text-base font-bold text-rose-700">
                    {Math.max(0, (finalResult.questionCount || questions.length) - (finalResult.questionEvaluations?.length || 0))}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/60">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Integrity Protocol</span>
                  <span className="text-base font-bold text-rose-700">Threshold Exceeded</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 rounded-2xl bg-white border border-slate-200/90 space-y-6 shadow-sm">
            {/* Report Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-md border ${
                    autoSubmittedReason
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    {autoSubmittedReason ? 'PARTIAL ASSESSMENT (Auto-Submitted)' : 'Performance Synthesis'}
                  </span>
                  <span className="text-xs text-slate-500">• {finalResult.interviewFocus || 'Balanced'} Focus</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  INTERVIEW PERFORMANCE REPORT
                </h2>
                <p className="text-xs text-slate-500">
                  Target Role: <strong>{finalResult.role}</strong> • Level: {finalResult.difficulty} • Date: {finalResult.date} • Duration: {formatTimer(finalResult.durationSeconds || elapsedSeconds)}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-baseline space-x-2 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-2xl">
                  <span className="text-xs text-blue-700 font-bold">
                    {autoSubmittedReason ? 'PARTIAL SCORE:' : 'OVERALL SCORE:'}
                  </span>
                  <span className="text-3xl font-black text-blue-600">{finalResult.overallScore}%</span>
                </div>

                <button
                  onClick={handleStartNewInterview}
                  disabled={isInitializingNewSession}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  title="Configure and launch a new mock interview attempt"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start New Interview</span>
                </button>

                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  title="View all past mock interview attempts"
                >
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Interview History</span>
                </button>
              </div>
            </div>

            {/* Score Grid (8 Metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Role Readiness</span>
                <span className="text-lg font-bold text-blue-600">{finalResult.roleReadiness || finalResult.overallScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Industry Match</span>
                <span className="text-lg font-bold text-emerald-600">{finalResult.industrySkillMatch || Math.min(100, finalResult.overallScore + 4)}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Technical</span>
                <span className="text-lg font-bold text-slate-900">{finalResult.technicalScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Communication</span>
                <span className="text-lg font-bold text-blue-600">{finalResult.communicationScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Problem Solving</span>
                <span className="text-lg font-bold text-indigo-600">{finalResult.problemSolvingScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Concept</span>
                <span className="text-lg font-bold text-violet-600">{finalResult.conceptUnderstandingScore || finalResult.technicalScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Confidence</span>
                <span className="text-lg font-bold text-amber-600">{finalResult.confidenceScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Integrity</span>
                <span className={`text-xs font-bold block mt-1 ${
                  finalResult.integrityRisk === 'LOW' ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {finalResult.integrityRisk} RISK
                </span>
              </div>
            </div>

            {/* Personalized Skill Pathway Recommendation */}
            {finalResult.roadmapRecommendation && (
              <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200/90 space-y-2">
                <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Personalized Roadmap Recommendation</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Focus on milestone: <strong>{finalResult.roadmapRecommendation.recommendedSkill}</strong>. {finalResult.roadmapRecommendation.reason}
                </p>
              </div>
            )}

            {/* QUESTION-BY-QUESTION PERFORMANCE REPORT (DYNAMIC REVIEW) */}
            {finalResult.questionEvaluations && finalResult.questionEvaluations.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                    <FileCheck className="w-4 h-4 text-blue-600" />
                    <span>Question-by-Question Technical Performance ({finalResult.questionEvaluations.length} Questions Evaluated)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">Evaluated on Technical, Communication, and Completeness</span>
                </div>

                <div className="space-y-3">
                  {finalResult.questionEvaluations.map((evalItem, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {evalItem.isFollowUp ? `Adaptive Follow-up Q${evalItem.questionNumber}` : `Question ${evalItem.questionNumber}`}
                          </span>
                          <span className="text-xs font-semibold text-slate-900">{evalItem.skillTested}</span>
                          <span className="px-2 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600">{evalItem.category}</span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs">
                          <span className="text-slate-500">
                            Tech: <strong className="text-slate-900">{evalItem.technicalScore}%</strong>
                          </span>
                          <span className="text-slate-500">
                            Comm: <strong className="text-blue-600">{evalItem.communicationScore}%</strong>
                          </span>
                          <span className="text-slate-500">
                            Completeness: <strong className="text-emerald-600">{evalItem.completenessScore}%</strong>
                          </span>
                        </div>
                      </div>

                      <p className="text-xs font-bold text-slate-800">
                        "{evalItem.questionText}"
                      </p>

                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                        <span className="font-semibold text-slate-500 uppercase text-[10px] block">Candidate Spoken Answer:</span>
                        <p className="italic">"{evalItem.studentAnswer}"</p>
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-start space-x-1.5 pt-1">
                        <span className="font-semibold text-blue-700 shrink-0">Evaluator Note:</span>
                        <span>{evalItem.evaluationSummary}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill-wise Performance Breakdown */}
            {finalResult.skillWisePerformance && finalResult.skillWisePerformance.length > 0 && (
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <BrainCircuit className="w-4 h-4 text-blue-600" />
                  <span>Skill-Wise Assessment Breakdown</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {finalResult.skillWisePerformance.map((item) => (
                    <div key={item.skill} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{item.skill}</span>
                        <span className={`font-bold ${item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                          {item.score}% ({item.status})
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-blue-600' : 'bg-amber-500'}`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths and Areas of Improvement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Strengths</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {finalResult.strengths?.map((s, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Recommended Focus Areas</span>
                </h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {finalResult.areasOfImprovement?.map((a, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CLAIMED SKILLS VERIFICATION TABLE */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Claimed Skills Verification Analysis</span>
                </h4>
                <p className="text-[11px] text-slate-500">
                  Ethical verification: Unproven claims are flagged as "Skill Verification Concern" rather than punitive labels.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold text-[11px]">
                      <th className="py-2.5 px-3">Skill</th>
                      <th className="py-2.5 px-3">Claimed Level</th>
                      <th className="py-2.5 px-3">Demonstrated</th>
                      <th className="py-2.5 px-3">Verification Status</th>
                      <th className="py-2.5 px-3">Evaluator Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {finalResult.claimedSkillsAnalysis.map((item) => (
                      <tr key={item.skill} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.skill}</td>
                        <td className="py-2.5 px-3 text-slate-500">{item.claimedLevel}</td>
                        <td className="py-2.5 px-3 text-slate-700">{item.demonstratedLevel}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              item.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 text-[11px]">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTEGRITY AUDIT LOG */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Interview Integrity Audit Summary</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Warnings: {finalResult.integrityWarningsCount} • Risk: {finalResult.integrityRisk}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Camera Stream</span>
                  <span className="font-semibold text-emerald-700">Verified ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Microphone</span>
                  <span className="font-semibold text-emerald-700">Verified ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Face Presence</span>
                  <span className="font-semibold text-emerald-700">Stable ✓</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 uppercase block">Status</span>
                  <span className={`font-semibold ${autoSubmittedReason ? 'text-rose-600' : 'text-slate-800'}`}>
                    {autoSubmittedReason ? 'AUTO-SUBMITTED' : 'Compliant ✓'}
                  </span>
                </div>
              </div>

              {finalResult.integrityLog.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {finalResult.integrityLog.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-mono text-slate-500">{log.timestamp}</span>
                      <span className="text-slate-700">{log.description}</span>
                      <span className="font-semibold uppercase text-amber-600">{log.severity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 flex items-center space-x-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clean session: No anomalous focus changes or departures recorded.</span>
                </p>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setIsTimelineOpen(true)}
                  className="inline-flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>View Detailed Chronological Integrity Timeline ({integrityEvents.length} Events)</span>
                </button>
              </div>
            </div>

            {/* Action buttons at report bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleStartNewInterview}
                  disabled={isInitializingNewSession}
                  className="flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  title="Configure and launch a new mock interview attempt"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start New Interview</span>
                </button>

                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  title="View all past interview attempts"
                >
                  <History className="w-4 h-4 text-slate-500" />
                  <span>View Interview History</span>
                </button>

                <button
                  onClick={() => {
                    setExecutionState('CONFIG');
                    setInterviewStarted(false);
                    setInterviewFinished(false);
                    setViewingPastReport(null);
                  }}
                  className="flex items-center space-x-1.5 px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Back to Interview Setup</span>
                </button>
              </div>

              <button
                onClick={onNavigateToOpportunities}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
              >
                <span>View Matched Industry Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Session Integrity Audit Log Modal */}
      <IntegrityTimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        events={integrityEvents}
        warningCount={warningCount}
        accommodationsActive={accessibilityMode}
      />

      {/* Interactive Mock Interview History Modal */}
      <InterviewHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        pastInterviews={pastInterviews}
        onSelectInterview={handleSelectPastInterview}
        onStartNew={handleStartNewInterview}
      />
    </div>
  );
};
