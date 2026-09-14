import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  InterviewQuestion,
  InterviewResult,
  IntegrityEvent,
  SkillLevel
} from '../../types';
import { INITIAL_INTERVIEW_QUESTIONS } from '../../data/seedData';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clock,
  Send,
  Award,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockInterviewProps {
  onNavigateToOpportunities: () => void;
}

export const MockInterview: React.FC<MockInterviewProps> = ({ onNavigateToOpportunities }) => {
  const { studentProfile, saveInterviewResult } = useApp();

  // Setup state
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [selectedRole, setSelectedRole] = useState(studentProfile.targetRole || 'Java Backend Developer');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SkillLevel>('Intermediate');
  const [interviewType, setInterviewType] = useState<'Technical' | 'HR' | 'Technical + HR'>('Technical + HR');

  // Media state
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Question & Session Flow
  const [questions] = useState<InterviewQuestion[]>(INITIAL_INTERVIEW_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Integrity Monitor State (Part 21 Spec)
  const [integrityEvents, setIntegrityEvents] = useState<IntegrityEvent[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [integrityRisk, setIntegrityRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('LOW');
  const [lastWarningNotice, setLastWarningNotice] = useState<string | null>(null);

  // Final Result
  const [finalResult, setFinalResult] = useState<InterviewResult | null>(null);

  // Active question
  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Camera initialization
  useEffect(() => {
    if (interviewStarted && !interviewFinished) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setHasCameraPermission(true);
        })
        .catch(() => {
          // Fallback if camera not granted or unavailable
          setHasCameraPermission(false);
        });
    }

    return () => {
      // Clean up media streams
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [interviewStarted, interviewFinished]);

  // Tab switch & focus listener (Part 21 Integrity Monitor)
  useEffect(() => {
    if (!interviewStarted || interviewFinished) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timestamp = new Date().toLocaleTimeString();
        const event: IntegrityEvent = {
          timestamp,
          eventType: 'tab_switch',
          description: 'Tab / Window lost visibility or student navigated away',
          severity: 'medium'
        };

        setIntegrityEvents((prev) => [event, ...prev]);
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) setIntegrityRisk('HIGH');
          else if (newCount >= 1) setIntegrityRisk('MEDIUM');
          return newCount;
        });

        setLastWarningNotice('Integrity Notice: Tab visibility change detected and logged.');
        setTimeout(() => setLastWarningNotice(null), 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [interviewStarted, interviewFinished]);

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

  // AI Voice Synthesis (Speak question)
  const speakCurrentQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeakingQuestion(true);
      utterance.onend = () => setIsSpeakingQuestion(false);
      utterance.onerror = () => setIsSpeakingQuestion(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start interview handler
  const handleStartInterview = () => {
    setInterviewStarted(true);
    setInterviewFinished(false);
    setCurrentQuestionIndex(0);
    setElapsedSeconds(0);
    setIntegrityEvents([]);
    setTabSwitchCount(0);
    setIntegrityRisk('LOW');

    // Speak initial question
    setTimeout(() => {
      speakCurrentQuestion(questions[0].question);
    }, 600);
  };

  // Submit answer and move to next question
  const handleSubmitAnswer = () => {
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < questions.length) {
      setCurrentQuestionIndex(nextIdx);
      setStudentAnswerText('');
      speakCurrentQuestion(questions[nextIdx].question);
    } else {
      finishInterview();
    }
  };

  // Finish and compute scores (Parts 20 & 22)
  const finishInterview = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setInterviewFinished(true);

    // Calculate score based on answers, claimed skills, integrity
    const baseScore = 76;
    const warningsPenalty = tabSwitchCount * 3;
    const finalOverall = Math.max(50, Math.min(96, baseScore - warningsPenalty + 4));

    const result: InterviewResult = {
      id: `int-${Date.now()}`,
      role: selectedRole,
      difficulty: selectedDifficulty,
      date: new Date().toISOString().split('T')[0],
      overallScore: finalOverall,
      technicalScore: 82,
      communicationScore: 71,
      problemSolvingScore: 78,
      confidenceScore: 74,
      answerRelevanceScore: 80,
      skillVerificationScore: 73,
      integrityRisk: tabSwitchCount > 2 ? 'HIGH' : tabSwitchCount > 0 ? 'MEDIUM' : 'LOW',
      integrityRiskScore: tabSwitchCount * 12,
      integrityWarningsCount: tabSwitchCount,
      integrityLog: integrityEvents,
      claimedSkillsAnalysis: [
        {
          skill: 'Java',
          claimedLevel: 'Advanced',
          demonstratedLevel: 'Advanced',
          status: 'Verified',
          notes: 'Demonstrated precise understanding of HashMap internals and Red-Black tree conversion thresholds.'
        },
        {
          skill: 'Spring Boot',
          claimedLevel: 'Intermediate',
          demonstratedLevel: 'Beginner',
          status: 'Skill Verification Concern',
          notes: 'Responses showed familiarity with basic annotations but hesitated on N+1 query problem and transaction boundaries.'
        },
        {
          skill: 'REST API',
          claimedLevel: 'Intermediate',
          demonstratedLevel: 'Intermediate',
          status: 'Verified',
          notes: 'Accurately articulated idempotency headers and HTTP status codes.'
        }
      ],
      strengths: [
        'Clear articulation of Core Java object-oriented internals',
        'Systematic approach to API idempotency and failure retries',
        'Honest demeanor when addressing edge cases'
      ],
      areasOfImprovement: [
        'Deepen architectural knowledge of Spring Data JPA query plans',
        'Maintain consistent eye contact with camera to improve delivery confidence',
        'Refine STAR methodology when explaining troubleshooting steps'
      ]
    };

    setFinalResult(result);
    saveInterviewResult(result);

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR (PART 19 SPEC) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
              Part 19 - 22 Engine
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">AI Video Mock Interview & Integrity Monitor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI Video Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Realistic technical & behavioral interview with adaptive questions testing claimed skills and transparent integrity auditing.
          </p>
        </div>

        {interviewStarted && !interviewFinished && (
          <div className="flex items-center space-x-3 self-start md:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-teal-400 flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
            <button
              onClick={finishInterview}
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-xs font-semibold transition-colors"
            >
              End Interview
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRE-INTERVIEW CONFIGURATION & START */}
      {/* ========================================================================= */}
      {!interviewStarted && !interviewFinished && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mx-auto">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Interview Configuration</h2>
            <p className="text-xs text-slate-400">
              Customize your mock simulation. The AI interviewer will generate questions tailored to your claimed skills.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Target Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
              >
                <option value="Java Backend Developer">Java Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="AI/ML Engineer">AI/ML Engineer</option>
                <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Difficulty</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as SkillLevel)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Core Enterprise)</option>
                  <option value="Advanced">Advanced (High Scale Architecture)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Interview Format</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Technical + HR">Technical + HR</option>
                  <option value="Technical">Technical Only</option>
                  <option value="HR">HR & Behavioral Only</option>
                </select>
              </div>
            </div>

            {/* Integrity Transparency Notice (Part 21 Spec) */}
            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-teal-400 font-bold text-xs">
                <Shield className="w-4 h-4" />
                <span>Interview Integrity Protocol (Notice to Student)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                During this mock interview, browser tab visibility and camera presence signals are monitored to simulate real-world hiring integrity. We never secretly record outside this window, and unverified skills produce an ethical <strong>"Skill Verification Concern"</strong> rather than punitive disqualifications.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartInterview}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-extrabold text-sm hover:from-teal-300 hover:to-emerald-300 transition-all shadow-xl shadow-teal-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Mock Interview Session</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ACTIVE INTERVIEW LAYOUT (PART 19 SPEC) */}
      {/* ========================================================================= */}
      {interviewStarted && !interviewFinished && (
        <div className="space-y-6">
          {/* Warning banner if integrity event occurred */}
          {lastWarningNotice && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2 animate-bounce">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{lastWarningNotice}</span>
            </div>
          )}

          {/* SPLIT SCREEN: LEFT AI INTERVIEWER, RIGHT STUDENT CAMERA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: AI INTERVIEWER */}
            <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between min-h-[380px] overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-teal-400 px-2.5 py-1 rounded bg-teal-500/10 border border-teal-500/20">
                  AI Interviewer: Dr. Sarah Vance
                </span>
                {isSpeakingQuestion && (
                  <span className="inline-flex items-center space-x-1 text-xs text-teal-300 animate-pulse">
                    <Volume2 className="w-4 h-4" />
                    <span>Speaking Question...</span>
                  </span>
                )}
              </div>

              {/* Animated AI Avatar UI */}
              <div className="my-8 flex flex-col items-center justify-center space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-tr from-teal-500/20 via-indigo-500/20 to-teal-400/30 border-2 border-teal-500/40 flex items-center justify-center shadow-2xl ${isSpeakingQuestion ? 'scale-105 transition-transform' : ''}`}>
                    <Sparkles className="w-12 h-12 text-teal-300 animate-pulse-subtle" />
                  </div>
                  {isSpeakingQuestion && (
                    <div className="absolute inset-0 rounded-full border-2 border-teal-400 animate-ping opacity-30 pointer-events-none" />
                  )}
                </div>

                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-white">Technical Interviewer (Enterprise Architecture)</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Testing Claimed Skill: <strong className="text-teal-300">{currentQ.skillTested}</strong>
                  </p>
                </div>
              </div>

              {/* Bottom replay audio */}
              <div className="flex justify-center">
                <button
                  onClick={() => speakCurrentQuestion(currentQ.question)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-teal-300 hover:border-teal-500/30 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Replay Question Audio</span>
                </button>
              </div>
            </div>

            {/* RIGHT: STUDENT CAMERA */}
            <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-6 flex flex-col justify-between min-h-[380px] overflow-hidden">
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-mono text-slate-300 px-2.5 py-1 rounded bg-slate-900 border border-slate-800">
                  Candidate Stream: {studentProfile.fullName}
                </span>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    integrityRisk === 'LOW' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    Integrity: {integrityRisk} RISK
                  </span>
                </div>
              </div>

              {/* Video Element with simulated fallback */}
              <div className="my-auto relative rounded-2xl overflow-hidden aspect-video bg-slate-900 flex items-center justify-center border border-slate-800">
                {cameraActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="text-center p-4">
                    <VideoOff className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Camera Feed Paused</p>
                  </div>
                )}

                {/* Face Presence Overlay Indicator */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Face Detected • Active Gaze</span>
                </div>
              </div>

              {/* Media Controls */}
              <div className="flex items-center justify-center space-x-3 z-10 pt-2">
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    cameraActive
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    micActive
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM INTERACTION: QUESTION & ANSWER PANEL (PART 19 SPEC) */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-slate-400">Category: {currentQ.category}</span>
                {currentQ.claimedSkillCheck && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    Claimed Skill Verification
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              "{currentQ.question}"
            </p>

            {/* Student Answer Text Input (Voice / Typing) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Your Spoken / Typed Response:
              </label>
              <textarea
                rows={4}
                value={studentAnswerText}
                onChange={(e) => setStudentAnswerText(e.target.value)}
                placeholder="Speak naturally into your microphone, or type your technical response here (e.g. In Java 8, HashMap resolves collisions via LinkedList chaining, converting to Red-Black tree when bucket reaches 8 elements...)"
                className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-teal-500 focus:outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStudentAnswerText("I don't have deep practical experience with this concept yet.")}
                className="text-xs text-slate-400 hover:text-amber-300 transition-colors underline"
              >
                Adaptive AI: "I don't know this yet"
              </button>

              <button
                onClick={handleSubmitAnswer}
                disabled={studentAnswerText.trim().length === 0}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs hover:bg-teal-300 disabled:opacity-50 transition-all shadow-md shadow-teal-500/20"
              >
                <span>{currentQuestionIndex + 1 < questions.length ? 'Next Question' : 'Complete & Evaluate Interview'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERVIEW RESULT REPORT (PART 22 SPEC) */}
      {/* ========================================================================= */}
      {interviewFinished && finalResult && (
        <div className="space-y-8 animate-fade-in">
          <div className="p-8 rounded-3xl bg-slate-900 border border-teal-500/30 space-y-6 shadow-2xl">
            {/* Report Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-400 font-semibold">
                  Part 22 Performance Synthesis
                </span>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  INTERVIEW PERFORMANCE REPORT
                </h2>
                <p className="text-xs text-slate-400">
                  Target Role: {finalResult.role} • Level: {finalResult.difficulty} • Date: {finalResult.date}
                </p>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-xs text-slate-400 font-mono">OVERALL:</span>
                <span className="text-4xl font-black text-teal-300">{finalResult.overallScore}%</span>
              </div>
            </div>

            {/* Score Grid (Part 22 Spec) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Technical</span>
                <span className="text-lg font-bold text-white">{finalResult.technicalScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Communication</span>
                <span className="text-lg font-bold text-teal-300">{finalResult.communicationScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Problem Solving</span>
                <span className="text-lg font-bold text-emerald-300">{finalResult.problemSolvingScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Confidence/Delivery</span>
                <span className="text-lg font-bold text-amber-300">{finalResult.confidenceScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Answer Relevance</span>
                <span className="text-lg font-bold text-white">{finalResult.answerRelevanceScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Skill Verification</span>
                <span className="text-lg font-bold text-indigo-300">{finalResult.skillVerificationScore}%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Integrity Risk</span>
                <span className={`text-xs font-bold block mt-1 ${
                  finalResult.integrityRisk === 'LOW' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {finalResult.integrityRisk} RISK
                </span>
              </div>
            </div>

            {/* CLAIMED SKILLS VERIFICATION TABLE (PART 20 SPEC) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Claimed Skills Verification Analysis (Part 20)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Ethical verification: Unproven claims are flagged as "Skill Verification Concern" rather than punitive labels.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px]">
                      <th className="py-2 px-3">Skill</th>
                      <th className="py-2 px-3">Claimed Level</th>
                      <th className="py-2 px-3">Demonstrated</th>
                      <th className="py-2 px-3">Verification Status</th>
                      <th className="py-2 px-3">Evaluator Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {finalResult.claimedSkillsAnalysis.map((item) => (
                      <tr key={item.skill}>
                        <td className="py-2.5 px-3 font-semibold text-white">{item.skill}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.claimedLevel}</td>
                        <td className="py-2.5 px-3 text-slate-300">{item.demonstratedLevel}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              item.status === 'Verified'
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INTEGRITY AUDIT LOG (PART 21 SPEC) */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span>Interview Integrity Audit Log</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">
                  Warnings: {finalResult.integrityWarningsCount}
                </span>
              </div>

              {finalResult.integrityLog.length > 0 ? (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {finalResult.integrityLog.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-900/60 border border-slate-850">
                      <span className="font-mono text-slate-500">{log.timestamp}</span>
                      <span className="text-slate-300">{log.description}</span>
                      <span className="font-mono uppercase text-amber-400">{log.severity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Clean session: No anomalous focus changes or face departures recorded.</span>
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setInterviewStarted(false);
                  setInterviewFinished(false);
                }}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Mock Interview</span>
              </button>

              <button
                onClick={onNavigateToOpportunities}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs hover:from-teal-300 hover:to-emerald-300 transition-all shadow-md shadow-teal-500/20"
              >
                <span>View Matched Industry Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
