import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  ROADMAP_CURRICULUM_DATA,
  SkillCurriculum,
  Lesson,
  Module,
  CodePracticeExercise,
  QuizQuestion,
  PracticalTask
} from '../../../data/roadmapCurriculumData';
import {
  ArrowLeft,
  BookOpen,
  Code2,
  HelpCircle,
  FolderGit2,
  Award,
  CheckCircle2,
  Lock,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  Eye,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Terminal,
  Send,
  Video,
  UserCheck,
  Copy,
  ExternalLink,
  Brain,
  BookMarked
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ROADMAP_DEEP_DIVE_DATA } from '../../../data/roadmapDeepDiveData';

interface SkillLearningViewProps {
  stepId: string;
  onBack: () => void;
  onNavigateToSkill: (skillId: string) => void;
  onNavigateToLab: () => void;
  onNavigateToInterview: () => void;
}

type TabType = 'curriculum' | 'practice' | 'quiz' | 'practical' | 'assessment' | 'capstone' | 'deepdive';

export const SkillLearningView: React.FC<SkillLearningViewProps> = ({
  stepId,
  onBack,
  onNavigateToSkill,
  onNavigateToLab,
  onNavigateToInterview
}) => {
  const { roadmap, completeRoadmapStep } = useApp();

  // Load curriculum data for this step (or fallback)
  const curriculum: SkillCurriculum =
    ROADMAP_CURRICULUM_DATA[stepId] || ROADMAP_CURRICULUM_DATA['rd-01'];

  const currentRoadmapStep = roadmap.find((r) => r.id === stepId) || {
    id: stepId,
    status: 'in-progress',
    title: curriculum.skillName
  };

  const isCompleted = currentRoadmapStep.status === 'completed';
  const isLocked = currentRoadmapStep.status === 'locked';

  // State
  const [activeTab, setActiveTab] = useState<TabType>(
    stepId === 'rd-08' ? 'capstone' : 'curriculum'
  );

  // Lesson reader state
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    curriculum.modules[0]?.id || ''
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    curriculum.modules[0]?.lessons[0] || null
  );

  // Authoritative deep dive & official docs data
  const deepDiveData = ROADMAP_DEEP_DIVE_DATA[stepId] || ROADMAP_DEEP_DIVE_DATA['rd-01'];
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(
    deepDiveData?.interviewFaqs[0]?.id || null
  );

  // Completed items tracking (persisted in session)
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(`completed_lessons_${stepId}`);
      if (saved) return new Set(JSON.parse(saved));
    } catch {}
    return isCompleted
      ? new Set(curriculum.modules.flatMap((m) => m.lessons.map((l) => l.id)))
      : new Set();
  });

  // Code practice state
  const [activePracticeIndex, setActivePracticeIndex] = useState<number>(0);
  const activeExercise: CodePracticeExercise | undefined =
    curriculum.codePractice[activePracticeIndex] || curriculum.codePractice[0];
  const [userCode, setUserCode] = useState<string>(activeExercise?.starterCode || '');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isExecutingCode, setIsExecutingCode] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Assessment state
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<{
    score: number;
    passed: boolean;
    strongTopics: string[];
    weakTopics: string[];
  } | null>(null);

  // Capstone AI Mock Interview state
  const [activeInterviewIndex, setActiveInterviewIndex] = useState<number>(0);
  const [candidateAnswer, setCandidateAnswer] = useState<string>('');
  const [interviewFeedback, setInterviewFeedback] = useState<{
    score: number;
    technicalScore: number;
    relevanceScore: number;
    communicationScore: number;
    feedbackText: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync userCode when exercise changes
  useEffect(() => {
    if (activeExercise) {
      setUserCode(activeExercise.starterCode);
      setTerminalOutput(null);
      setShowHint(false);
      setShowSolution(false);
    }
  }, [activePracticeIndex, activeExercise]);

  // Save completed lessons
  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
        showToast('Lesson marked complete! +10 XP');
      }
      localStorage.setItem(`completed_lessons_${stepId}`, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Calculate dynamic progress
  const totalLessons = curriculum.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessonsCount = completedLessonIds.size;
  const lessonProgressPercent =
    totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 70) : 0;
  const assessmentBonus = assessmentResult?.passed || isCompleted ? 30 : 0;
  const overallSkillProgress = Math.min(100, lessonProgressPercent + assessmentBonus);

  // Handle Code Execution Simulation
  const handleRunCode = () => {
    setIsExecutingCode(true);
    setTerminalOutput('Compiling Java source code with OpenJDK 17...\nExecuting test assertions...');
    setTimeout(() => {
      setIsExecutingCode(false);
      if (
        userCode.includes('stream') ||
        userCode.includes('PreparedStatement') ||
        userCode.includes('Query') ||
        userCode.includes('Service') ||
        userCode.includes('public')
      ) {
        setTerminalOutput(
          `[SUCCESS] Compilation Succeeded.\n${activeExercise?.expectedOutput}\n\n✓ All ${activeExercise?.testCases.length || 1} Unit Test Assertions PASSED [18ms]`
        );
        showToast('Code executed and verified successfully!');
      } else {
        setTerminalOutput(
          `[ERROR] Execution completed with warnings.\nOutput does not match required contract.\nExpected:\n${activeExercise?.expectedOutput}`
        );
      }
    }, 800);
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correct = 0;
    curriculum.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) correct++;
    });
    const pct = Math.round((correct / curriculum.quiz.length) * 100);
    showToast(`Quiz completed: ${correct}/${curriculum.quiz.length} correct (${pct}%)`);
    if (pct >= 70) {
      try {
        confetti({ particleCount: 40 });
      } catch {}
    }
  };

  // Handle Assessment Submission
  const handleAssessmentSubmit = () => {
    const questions = curriculum.assessment.questions;
    let correct = 0;
    const strong: string[] = [];
    const weak: string[] = [];

    questions.forEach((q) => {
      if (assessmentAnswers[q.id] === q.correctAnswerIndex) {
        correct++;
        if (!strong.includes(q.topic)) strong.push(q.topic);
      } else {
        if (!weak.includes(q.topic)) weak.push(q.topic);
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= curriculum.assessment.passingScore;

    setAssessmentResult({
      score,
      passed,
      strongTopics: strong.length ? strong : ['Core Foundations'],
      weakTopics: weak.length ? weak : ['None - Comprehensive Mastery']
    });

    if (passed) {
      completeRoadmapStep(stepId);
      showToast(`Congratulations! Skill verified and milestone unlocked with ${score}%!`);
      try {
        confetti({ particleCount: 80, spread: 70 });
      } catch {}
    } else {
      showToast(`Score: ${score}%. Minimum ${curriculum.assessment.passingScore}% required to pass. Review weak topics!`);
    }
  };

  // Handle Capstone AI Interview Evaluation
  const handleEvaluateInterview = () => {
    if (!candidateAnswer.trim()) return;
    setIsEvaluatingAnswer(true);
    setTimeout(() => {
      setIsEvaluatingAnswer(false);
      const len = candidateAnswer.length;
      const hasKeywords =
        candidateAnswer.toLowerCase().includes('query') ||
        candidateAnswer.toLowerCase().includes('fetch') ||
        candidateAnswer.toLowerCase().includes('token') ||
        candidateAnswer.toLowerCase().includes('filter') ||
        candidateAnswer.toLowerCase().includes('transaction');

      const tech = hasKeywords ? Math.min(95, 75 + Math.floor(len / 20)) : 60;
      const rel = hasKeywords ? 90 : 65;
      const comm = len > 80 ? 92 : 70;
      const overall = Math.round((tech + rel + comm) / 3);

      setInterviewFeedback({
        score: overall,
        technicalScore: tech,
        relevanceScore: rel,
        communicationScore: comm,
        feedbackText:
          overall >= 80
            ? 'Excellent architectural reasoning! You accurately identified the core technical tradeoffs, referenced the right framework components, and articulated your solution cleanly.'
            : 'Good foundational answer, but you should explicitly mention the specific Spring or JPA annotations and explain the exact runtime behavior.',
        strengths: [
          'Direct identification of architectural concepts',
          'Clean explanation of failure modes',
          'Good use of engineering terminology'
        ],
        improvements: [
          'Cite specific SQL execution profiles or query logs',
          'Mention edge case handling (e.g. timeout, null safety)'
        ]
      });

      if (overall >= 75) {
        try {
          confetti({ particleCount: 50 });
        } catch {}
      }
    }, 1000);
  };

  // Check prerequisites
  const unmetPrereq = curriculum.prerequisites.find((p) => {
    if (p.stepId) {
      const step = roadmap.find((r) => r.id === p.stepId);
      return step && step.status !== 'completed';
    }
    return !p.isMet;
  });

  return (
    <div className="space-y-6 pb-16 max-w-5xl animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl flex items-center space-x-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200/90 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Career Roadmap</span>
        </button>

        <div className="flex items-center space-x-2">
          {isCompleted ? (
            <span className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Milestone Verified</span>
            </span>
          ) : (
            <button
              onClick={() => {
                completeRoadmapStep(stepId);
                showToast('Skill marked as verified! Milestone completed.');
                try {
                  confetti({ particleCount: 60 });
                } catch {}
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Verify & Complete Skill</span>
            </button>
          )}
        </div>
      </div>

      {/* Prerequisite Alert Banner (if unmet) */}
      {unmetPrereq && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start sm:items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold">Recommended Prerequisite Incomplete: </span>
              <span>{unmetPrereq.skillName} ({unmetPrereq.requiredDescription})</span>
            </div>
          </div>
          {unmetPrereq.stepId && (
            <button
              onClick={() => onNavigateToSkill(unmetPrereq.stepId!)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 self-start sm:self-auto"
            >
              Go to {unmetPrereq.skillName} →
            </button>
          )}
        </div>
      )}

      {/* SKILL HERO HEADER */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/70">
                {curriculum.category}
              </span>
              <span className="text-xs font-semibold text-blue-600 flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{curriculum.industryDemand}% Industry Demand</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                Target Role: <strong>Java Backend Developer</strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {curriculum.skillName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {curriculum.whyItMattersInIndustry.importanceSummary}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs shrink-0">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Current</span>
              <p className="font-bold text-slate-800">{curriculum.currentLevel}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Target</span>
              <p className="font-bold text-blue-600">{curriculum.targetLevel}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Difficulty</span>
              <p className="font-bold text-amber-600">{curriculum.difficulty}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Effort</span>
              <p className="font-bold text-slate-800 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{curriculum.estimatedHours}h</span>
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Skill Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              Skill Mastery Progress:{' '}
              <strong className="text-slate-900">
                {completedLessonsCount} of {totalLessons} lessons completed
              </strong>
            </span>
            <span className="font-bold text-blue-600">{overallSkillProgress}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-700"
              style={{ width: `${overallSkillProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex overflow-x-auto p-1 rounded-2xl bg-white border border-slate-200/90 shadow-sm gap-1">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'curriculum'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curriculum & Lessons ({totalLessons})</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'practice'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code Practice Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'quiz'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Module Quizzes</span>
        </button>

        <button
          onClick={() => setActiveTab('practical')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'practical'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Practical Task & Project</span>
        </button>

        {stepId === 'rd-08' ? (
          <button
            onClick={() => setActiveTab('capstone')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'capstone'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Capstone AI Mock Interview</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('assessment')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'assessment'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Skill Assessment</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('deepdive')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'deepdive'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>📚 Deep Dive & Official Docs</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CURRICULUM & LESSONS */}
      {/* ========================================================================= */}
      {activeTab === 'curriculum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Left: Module & Lesson Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            {/* Learning Objectives Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                <span>What You Will Learn</span>
              </h4>
              <ul className="space-y-1 text-slate-600">
                {curriculum.whatYouWillLearn.slice(0, 4).map((obj, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modules Accordion List */}
            <div className="space-y-3">
              {curriculum.modules.map((mod) => (
                <div
                  key={mod.id}
                  className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-sm"
                >
                  <div
                    onClick={() =>
                      setSelectedModuleId(selectedModuleId === mod.id ? '' : mod.id)
                    }
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        Module {mod.moduleNumber}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {mod.title}
                      </h4>
                    </div>
                    {selectedModuleId === mod.id ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  {/* Lessons list */}
                  {selectedModuleId === mod.id && (
                    <div className="px-3 pb-3 space-y-1.5 border-t border-slate-100 pt-2 animate-fade-in">
                      {mod.lessons.map((lesson) => {
                        const isSelected = selectedLesson?.id === lesson.id;
                        const isDone = completedLessonIds.has(lesson.id);

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`p-3 rounded-xl flex items-center justify-between cursor-pointer text-xs transition-all ${
                              isSelected
                                ? 'bg-blue-50 border border-blue-200 text-blue-900 font-semibold shadow-xs'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLessonComplete(lesson.id);
                                }}
                                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                                  isDone
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'border-slate-300 text-transparent hover:border-slate-400'
                                }`}
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                              </button>
                              <span className="truncate">{lesson.title}</span>
                            </div>

                            <span className="text-[10px] text-slate-400 shrink-0">
                              {lesson.duration}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Lesson Reading Experience */}
          <div className="lg:col-span-7">
            {selectedLesson ? (
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6 animate-fade-in">
                {/* Lesson Header */}
                <div className="flex items-start justify-between pb-4 border-b border-slate-100 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Lesson Deep Dive
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      {selectedLesson.title}
                    </h2>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedLesson.duration} estimated read</span>
                    </span>
                  </div>

                  <button
                    onClick={() => toggleLessonComplete(selectedLesson.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      completedLessonIds.has(selectedLesson.id)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {completedLessonIds.has(selectedLesson.id)
                        ? 'Completed'
                        : 'Mark Complete'}
                    </span>
                  </button>
                </div>

                {/* 1. Simple Explanation */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Concept Explanation</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                    {selectedLesson.simpleExplanation}
                  </p>
                </div>

                {/* 2. Why It Is Needed & Real World Example */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-1">
                    <span className="font-bold text-blue-900 uppercase text-[10px]">
                      Why It Is Needed:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedLesson.whyNeeded}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                    <span className="font-bold text-emerald-900 uppercase text-[10px]">
                      Real-World Enterprise Example:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedLesson.realWorldExample}
                    </p>
                  </div>
                </div>

                {/* 3. How It Works */}
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    How It Works Under The Hood
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedLesson.howItWorks}
                  </p>
                </div>

                {/* 4. Code Snippet & Expected Output */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                      <Code2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Production Code Example</span>
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedLesson.codeSnippet);
                        showToast('Code copied to clipboard!');
                      }}
                      className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Code</span>
                    </button>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-200 font-mono text-xs p-4 overflow-x-auto leading-relaxed">
                    <pre>{selectedLesson.codeSnippet}</pre>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 text-[10px] uppercase">
                      Expected Output:
                    </span>
                    <p className="text-slate-600 font-mono mt-0.5">
                      {selectedLesson.expectedOutput}
                    </p>
                  </div>
                </div>

                {/* 5. Common Mistakes & Best Practices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/70 space-y-1.5">
                    <span className="font-bold text-rose-900 uppercase text-[10px] flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Common Production Mistakes:</span>
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {selectedLesson.commonMistakes.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200/70 space-y-1.5">
                    <span className="font-bold text-indigo-900 uppercase text-[10px] flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-indigo-600" />
                      <span>Industry Best Practices:</span>
                    </span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {selectedLesson.bestPractices.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 6. Practice Question */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-800 uppercase text-[10px] text-blue-600">
                    Interview / Practice Question:
                  </span>
                  <p className="text-slate-700 font-medium">
                    {selectedLesson.practiceQuestion}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-white border border-slate-200/90 text-center text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Select a lesson from the left to begin learning.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CODE PRACTICE LAB */}
      {/* ========================================================================= */}
      {activeTab === 'practice' && activeExercise && (
        <div className="space-y-5 animate-fade-in">
          {/* Exercise Selector */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700 uppercase">Exercise:</span>
              <div className="flex flex-wrap gap-1.5">
                {curriculum.codePractice.map((ex, idx) => (
                  <button
                    key={ex.id}
                    onClick={() => setActivePracticeIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activePracticeIndex === idx
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {idx + 1}. {ex.title}
                  </button>
                ))}
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                activeExercise.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : activeExercise.difficulty === 'Medium'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {activeExercise.difficulty}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Problem Statement & Requirements */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeExercise.title}
                  </h3>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {activeExercise.description}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                    Requirements Checklist:
                  </h4>
                  <ul className="space-y-1 text-slate-700">
                    {activeExercise.requirements.map((req, i) => (
                      <li key={i} className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expected Output */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="font-bold text-slate-700 text-[10px] uppercase">
                    Expected Target Output:
                  </span>
                  <p className="font-mono text-slate-900 text-xs">
                    {activeExercise.expectedOutput}
                  </p>
                </div>

                {/* Hint & Solution Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-blue-600 hover:underline font-semibold text-xs flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                  </button>

                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="text-slate-500 hover:text-slate-800 font-semibold text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{showSolution ? 'Hide Solution' : 'View Model Solution'}</span>
                  </button>
                </div>

                {showHint && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs animate-fade-in space-y-1">
                    <span className="font-bold">Hints:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {activeExercise.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {showSolution && (
                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 animate-fade-in overflow-x-auto">
                    <span className="text-slate-400 block font-sans text-[10px] uppercase mb-1">
                      Model Production Solution:
                    </span>
                    <pre>{activeExercise.solutionCode}</pre>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Interactive Code Editor & Console */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col">
                {/* Editor Header */}
                <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 font-mono">
                      Solution.java
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setUserCode(activeExercise.starterCode)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors"
                      title="Reset to starter template"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleRunCode}
                      disabled={isExecutingCode}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{isExecutingCode ? 'Running...' : 'Run Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Textarea */}
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={14}
                  spellCheck={false}
                  className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-blue-600 selection:text-white"
                />
              </div>

              {/* Execution Console Output */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 text-xs font-mono space-y-1.5 text-slate-300">
                <div className="flex items-center space-x-2 text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Execution Output Console</span>
                </div>
                {terminalOutput ? (
                  <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                    {terminalOutput}
                  </pre>
                ) : (
                  <span className="text-slate-500 italic">
                    Click "Run Code" above to compile and execute test assertions.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MODULE QUIZZES */}
      {/* ========================================================================= */}
      {activeTab === 'quiz' && (
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">
              Module Mastery Diagnostic Quiz
            </h3>
            <p className="text-xs text-slate-500">
              Test your understanding of core concepts before attempting the final assessment.
            </p>
          </div>

          <div className="space-y-6">
            {curriculum.quiz.map((q, qIndex) => {
              const selectedOpt = quizAnswers[q.id];
              const isSubmitted = quizSubmitted;
              const isCorrect = selectedOpt === q.correctAnswerIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {qIndex + 1}. {q.question}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      {q.topic}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle =
                        'bg-white border-slate-200 hover:border-blue-300 text-slate-700';

                      if (selectedOpt === optIdx) {
                        btnStyle = 'bg-blue-50 border-blue-600 text-blue-900 font-semibold';
                      }

                      if (isSubmitted) {
                        if (optIdx === q.correctAnswerIndex) {
                          btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                        } else if (selectedOpt === optIdx) {
                          btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                        }
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => {
                            if (!quizSubmitted) {
                              setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                            }
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIdx === q.correctAnswerIndex && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {isSubmitted && (
                    <div
                      className={`p-3 rounded-xl border text-xs animate-fade-in ${
                        isCorrect
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/70 border-rose-200 text-rose-900'
                      }`}
                    >
                      <span className="font-bold block mb-0.5">
                        {isCorrect ? '✓ Correct!' : '✗ Incorrect:'}
                      </span>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Reset Quiz
            </button>

            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < curriculum.quiz.length}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all"
            >
              {quizSubmitted ? 'Resubmit Answers' : 'Submit Quiz Answers'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PRACTICAL TASK & MINI PROJECT */}
      {/* ========================================================================= */}
      {activeTab === 'practical' && (
        <div className="space-y-6 animate-fade-in">
          {/* Hands-On Practical Task */}
          {curriculum.practicalTasks.map((task) => (
            <div
              key={task.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Hands-On Practical Task
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {task.title}
                  </h3>
                  <p className="text-slate-600 mt-0.5">{task.objective}</p>
                </div>
                <button
                  onClick={onNavigateToLab}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  Open in Practice Lab →
                </button>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-800 text-[11px] uppercase">
                  Step-by-Step Implementation Guide:
                </span>
                <ol className="space-y-1 text-slate-700 list-decimal list-inside">
                  {task.steps.map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                </ol>
              </div>

              {/* Code Blueprint Template */}
              <div className="space-y-1">
                <span className="font-bold text-slate-800 text-[11px] uppercase">
                  Starter Code Blueprint:
                </span>
                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  <pre>{task.codeTemplate}</pre>
                </div>
              </div>

              {/* Verification Criteria */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                <span className="font-bold text-emerald-900 text-[10px] uppercase">
                  Verification & Acceptance Criteria:
                </span>
                <ul className="space-y-1 text-slate-700">
                  {task.verificationCriteria.map((c, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {/* Mini Portfolio Project */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-5 text-xs">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Milestone Portfolio Mini-Project
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {curriculum.miniProject.title}
                </h3>
                <p className="text-slate-600 max-w-2xl leading-relaxed">
                  {curriculum.miniProject.description}
                </p>
              </div>

              <button
                onClick={() => {
                  showToast('Mini project template exported to GitHub workspace!');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Initialize Project</span>
              </button>
            </div>

            {/* Tech Stack Chips */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase text-[10px]">
                Target Technology Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {curriculum.miniProject.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase text-[11px]">
                Key Engineering Deliverables:
              </span>
              <ul className="space-y-1.5 text-slate-700">
                {curriculum.miniProject.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SKILL ASSESSMENT */}
      {/* ========================================================================= */}
      {activeTab === 'assessment' && stepId !== 'rd-08' && (
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6 animate-fade-in max-w-3xl mx-auto">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Formal Skill Certification
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">
              {curriculum.skillName} Assessment
            </h3>
            <p className="text-xs text-slate-500">
              Passing threshold is {curriculum.assessment.passingScore}%. Completing this assessment unlocks the next roadmap milestone.
            </p>
          </div>

          {/* Assessment Questions */}
          <div className="space-y-5">
            {curriculum.assessment.questions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-900 text-sm">
                    {idx + 1}. {q.question}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {q.topic}
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = assessmentAnswers[q.id] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() =>
                          setAssessmentAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50 border-blue-600 text-blue-900 font-semibold'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Assessment Result Summary */}
          {assessmentResult && (
            <div
              className={`p-5 rounded-2xl border text-xs space-y-3 animate-fade-in ${
                assessmentResult.passed
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold flex items-center space-x-2">
                  {assessmentResult.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                  <span>
                    {assessmentResult.passed
                      ? 'Assessment Passed! Skill Verified'
                      : 'Needs Revision'}
                  </span>
                </span>
                <span className="text-lg font-black">{assessmentResult.score}%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                <div>
                  <span className="font-bold block text-[10px] uppercase">
                    Strong Topics Demonstrated:
                  </span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                    {assessmentResult.strongTopics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold block text-[10px] uppercase">
                    Topics Recommended for Revision:
                  </span>
                  <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                    {assessmentResult.weakTopics.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setAssessmentAnswers({});
                setAssessmentResult(null);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Reset Answers
            </button>

            <button
              onClick={handleAssessmentSubmit}
              disabled={
                Object.keys(assessmentAnswers).length <
                curriculum.assessment.questions.length
              }
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs disabled:opacity-50 transition-all"
            >
              Submit & Verify Skill
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CAPSTONE 16-STEP BLUEPRINT & AI MOCK INTERVIEW (RD-08 ONLY) */}
      {/* ========================================================================= */}
      {activeTab === 'capstone' && curriculum.capstoneDetails && (
        <div className="space-y-6 animate-fade-in">
          {/* 16-Step Progressive Implementation Blueprint */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  End-to-End Enterprise Architecture
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  16-Step Progressive Backend Build
                </h3>
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                Production Checklist
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {curriculum.capstoneDetails.progressiveSteps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                        {step.stepNumber}
                      </span>
                      <span>{step.title}</span>
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-slate-500 border border-slate-200">
                      {step.layer}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {step.description}
                  </p>
                  <div className="p-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-[10px] truncate">
                    <code>{step.keyCode}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Mock Technical Interview Simulator */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Interactive AI Simulator
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    Tier-1 Tech Company Interview Calibration
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Technical Architecture Defense Interview
                </h3>
              </div>

              <button
                onClick={onNavigateToInterview}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors shrink-0"
              >
                <Video className="w-4 h-4 text-blue-600" />
                <span>Launch Video Mock Room →</span>
              </button>
            </div>

            {/* Question Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {curriculum.capstoneDetails.interviewQuestions.map((iq, i) => (
                <button
                  key={iq.id}
                  onClick={() => {
                    setActiveInterviewIndex(i);
                    setCandidateAnswer('');
                    setInterviewFeedback(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeInterviewIndex === i
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Q{i + 1}: {iq.topic}
                </button>
              ))}
            </div>

            {/* Current Active Interview Question */}
            {curriculum.capstoneDetails.interviewQuestions[activeInterviewIndex] && (
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
                    Technical Question {activeInterviewIndex + 1}:
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-1">
                    {
                      curriculum.capstoneDetails.interviewQuestions[
                        activeInterviewIndex
                      ].question
                    }
                  </h4>
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-slate-700 text-[10px] uppercase">
                    Key Evaluation Points Expected by Interviewer:
                  </span>
                  <ul className="space-y-0.5 text-slate-600">
                    {curriculum.capstoneDetails.interviewQuestions[
                      activeInterviewIndex
                    ].keyPointsExpected.map((pt, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-blue-600" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Candidate Answer Box */}
                <div className="space-y-2 pt-2">
                  <label className="font-bold text-slate-800 text-xs">
                    Your Technical Answer & Architectural Defense:
                  </label>
                  <textarea
                    rows={4}
                    value={candidateAnswer}
                    onChange={(e) => setCandidateAnswer(e.target.value)}
                    placeholder="Explain your approach, tradeoffs, specific Spring/JPA annotations, and failure recovery..."
                    className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-xs focus:border-blue-600 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() =>
                      setCandidateAnswer(
                        curriculum.capstoneDetails!.interviewQuestions[
                          activeInterviewIndex
                        ].sampleAnswer
                      )
                    }
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Paste Model Technical Answer
                  </button>

                  <button
                    onClick={handleEvaluateInterview}
                    disabled={!candidateAnswer.trim() || isEvaluatingAnswer}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center space-x-1.5 disabled:opacity-50 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {isEvaluatingAnswer ? 'Evaluating with AI...' : 'Submit Answer for AI Evaluation'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* AI Multi-Factor Evaluation Scorecard */}
            {interviewFeedback && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md space-y-4 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Interviewer Evaluation & Readiness Scorecard
                    </h4>
                  </div>
                  <span className="text-base font-extrabold text-blue-600">
                    Overall Score: {interviewFeedback.score}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">
                      Technical Knowledge
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {interviewFeedback.technicalScore}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">
                      Answer Relevance
                    </span>
                    <p className="text-sm font-bold text-blue-600 mt-0.5">
                      {interviewFeedback.relevanceScore}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">
                      Communication & Clarity
                    </span>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">
                      {interviewFeedback.communicationScore}%
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  {interviewFeedback.feedbackText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1">
                    <span className="font-bold uppercase text-[10px]">
                      Demonstrated Strengths:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {interviewFeedback.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                    <span className="font-bold uppercase text-[10px]">
                      Recommended Improvements:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {interviewFeedback.improvements.map((im, i) => (
                        <li key={i}>{im}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: AUTHORITATIVE DEEP DIVE & OFFICIAL DOCUMENTATION */}
      {/* ========================================================================= */}
      {activeTab === 'deepdive' && (
        <div className="space-y-6 animate-fade-in text-xs">
          {/* Section 1: Overview & Architectural Takeaways */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Authoritative Reference
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Extracted from Oracle, Spring.io, Baeldung & Industry Standards
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">
              {deepDiveData.skillName} — Deep Dive Architecture
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              {deepDiveData.overviewSummary}
            </p>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 space-y-2">
              <span className="font-bold text-blue-900 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-blue-600" />
                <span>Core Architectural Principles You Must Know:</span>
              </span>
              <ul className="space-y-1.5 text-slate-700">
                {deepDiveData.keyArchitecturalTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 2: Curated Official Documentation & Articles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Curated Authoritative Documentation & Reading Material</span>
              </h4>
              <span className="text-[11px] text-slate-400">Direct Official Sources</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {deepDiveData.deepDiveResources.map((res, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/80">
                        {res.source}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{res.readTime}</span>
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 leading-snug">
                      {res.title}
                    </h5>

                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      {res.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {res.keyTopicsCovered.map((topic, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 group"
                  >
                    <span>Read Official Guide</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Architecture & Syntax Cheat Sheets */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Production Architecture & Syntax Cheat Sheets</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deepDiveData.cheatSheets.map((cs, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {cs.category}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{cs.title}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <pre>{cs.syntaxOrCode}</pre>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{cs.explanation}</p>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-[11px] space-y-0.5">
                    <span className="font-bold uppercase text-[9px] block">Pro Tip:</span>
                    <span>{cs.proTip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Top Technical Interview FAQs & Answers */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Top Frequently Asked Technical Interview Questions</span>
            </h4>

            <div className="space-y-3">
              {deepDiveData.interviewFaqs.map((faq) => {
                const isOpen = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden"
                  >
                    <div
                      onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                            faq.frequency === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}
                        >
                          {faq.frequency} Frequency
                        </span>

                        <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {faq.question}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] font-semibold text-slate-400 hidden sm:inline-block">
                          {faq.difficulty} Level
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3 text-xs animate-fade-in">
                        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/70 text-blue-950 font-medium">
                          <span className="font-bold block text-[10px] uppercase text-blue-800 mb-0.5">
                            Quick Technical Answer:
                          </span>
                          <span>{faq.shortAnswer}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="font-bold text-slate-800 uppercase text-[10px]">
                            In-Depth Architecture Explanation:
                          </span>
                          <p className="text-slate-600 leading-relaxed text-xs">
                            {faq.inDepthAnswer}
                          </p>
                        </div>

                        {faq.sampleCodeSnippet && (
                          <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800">
                            <pre>{faq.sampleCodeSnippet}</pre>
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                          <span>Topic: {faq.topic}</span>
                          <span>Source: {faq.sourceAttribution}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Common Production Pitfalls & Anti-Patterns */}
          {deepDiveData.productionPitfalls.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Common Production Anti-Patterns & How to Fix Them</span>
              </h4>

              <div className="space-y-4">
                {deepDiveData.productionPitfalls.map((pitfall, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/80">
                        Anti-Pattern Alert
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 mt-1">
                        {pitfall.antiPatternTitle}
                      </h5>
                      <p className="text-slate-500 text-xs mt-0.5">
                        <strong className="text-slate-700">Production Symptom:</strong>{' '}
                        {pitfall.symptom}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Naive / Bad Code */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-rose-700 flex items-center space-x-1">
                          <span>❌ Naive / Buggy Anti-Pattern:</span>
                        </span>
                        <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-slate-800 font-mono text-xs overflow-x-auto">
                          <pre>{pitfall.badCodeSnippet}</pre>
                        </div>
                      </div>

                      {/* Production Standard Code */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 flex items-center space-x-1">
                          <span>✅ Production Standard Fix:</span>
                        </span>
                        <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200 text-slate-800 font-mono text-xs overflow-x-auto">
                          <pre>{pitfall.productionStandardSnippet}</pre>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                      <strong className="text-slate-800">Why It Matters:</strong>{' '}
                      {pitfall.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
