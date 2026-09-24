import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ROLE_FOUNDATION_PATHS } from '../../data/seedData';
import { SkillLearningView } from './roadmap/SkillLearningView';
import { RoadmapApi, RoadmapSummary } from '../../services/roadmapApi';
import { TechnologyRoadmap } from '../../../server/roadmapTypes';
import {
  SKILL_CATALOG,
  DEPARTMENT_OPTIONS,
  DepartmentType,
  SkillCatalogEntry
} from '../../data/skillCatalog';
import {
  computePersonalizedRoadmap,
  getSkillEvidenceStatus,
  SkillGapItem,
  PersonalizedRoadmapState
} from '../../services/skillGapEngine';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  Clock,
  BookOpen,
  FolderGit2,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Check,
  Compass,
  ArrowRight,
  TrendingUp,
  Zap,
  BookMarked,
  FileText,
  Briefcase,
  History,
  Target,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Info,
  Search,
  Filter,
  RefreshCw,
  X
} from 'lucide-react';

interface CareerRoadmapProps {
  onNavigateToLab: () => void;
  onNavigateToInterview: () => void;
  onNavigateToResume?: () => void;
}

const getRoadmapSlug = () => {
  const match = window.location.pathname.match(/^\/roadmap\/([^/]+)/);
  return match?.[1] || null;
};

const getRoadmapTopicId = () => {
  const match = window.location.pathname.match(/^\/roadmap\/[^/]+\/topic\/([^/]+)/);
  return match?.[1] || null;
};

// =========================================================================
// TECHNOLOGY ROADMAP DEEP VIEW (PRESERVED IN FULL)
// =========================================================================
const TechnologyRoadmapView: React.FC<{ slug: string; onBack: () => void }> = ({ slug, onBack }) => {
  const { currentUser } = useApp();
  const [roadmap, setRoadmap] = useState<TechnologyRoadmap | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [lastLessonId, setLastLessonId] = useState<string | undefined>();
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<string[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [completedProjectIds, setCompletedProjectIds] = useState<string[]>([]);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, string>>({});
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(() => getRoadmapTopicId());
  const [topicSearch, setTopicSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    RoadmapApi.getRoadmap(slug, currentUser?.id)
      .then((data) => {
        if (!active) return;
        setRoadmap(data.roadmap);
        setProgress(data.progress.lessonIds);
        setLastLessonId(data.progress.lastLessonId);
        setBookmarkedLessonIds(data.progress.bookmarkedLessonIds || []);
        setNotes(data.progress.notes || {});
        setCompletedProjectIds(data.progress.completedProjectIds || []);
      })
      .catch((err: Error) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, currentUser?.id]);

  const toggleLesson = async (lessonId: string) => {
    if (!currentUser || !roadmap) return;
    const next = progress.includes(lessonId) ? progress.filter((id) => id !== lessonId) : [...progress, lessonId];
    setProgress(next);
    try {
      const completedTopicIds = roadmap.modules
        .flatMap((module) => module.topics)
        .filter((topic) => topic.lessons.length > 0 && topic.lessons.every((lesson) => next.includes(lesson.id)))
        .map((topic) => topic.id);
      setLastLessonId(lessonId);
      await RoadmapApi.saveProgress(slug, currentUser.id, {
        lessonIds: next,
        completedTopicIds,
        completedProjectIds,
        lastLessonId: lessonId,
        bookmarkedLessonIds,
        notes
      });
    } catch {
      setProgress(progress);
      setError('Progress could not be synchronized.');
    }
  };

  if (loading) return <div className="p-8 text-sm text-slate-500">Loading {slug.replace('-', ' ')} roadmap...</div>;
  if (error || !roadmap)
    return (
      <div className="p-8 rounded-2xl bg-white border border-rose-200 text-sm text-rose-700">
        {error || 'Unable to load this roadmap.'}
        <button onClick={onBack} className="ml-3 font-semibold underline">
          Back
        </button>
      </div>
    );

  const lessons = roadmap.modules.flatMap((module) => module.topics.flatMap((topic) => topic.lessons));
  const selectedTopic = roadmap.modules.flatMap((module) => module.topics).find((topic) => topic.id === selectedTopicId);
  const topicSequence = roadmap.modules.flatMap((module) => module.topics);
  const selectedTopicIndex = selectedTopic ? topicSequence.findIndex((topic) => topic.id === selectedTopic.id) : -1;
  const previousTopic = selectedTopicIndex > 0 ? topicSequence[selectedTopicIndex - 1] : undefined;
  const nextTopic = selectedTopicIndex >= 0 ? topicSequence[selectedTopicIndex + 1] : undefined;
  const visibleModules = roadmap.modules
    .map((module) => ({
      ...module,
      topics: module.topics.filter((topic) =>
        `${topic.title} ${topic.description} ${topic.lessons
          .map((lesson) => `${lesson.title} ${lesson.summary} ${lesson.relatedTopics.join(' ')}`)
          .join(' ')}`
          .toLowerCase()
          .includes(topicSearch.toLowerCase())
      )
    }))
    .filter((module) => module.topics.length > 0);

  const openTopic = (topicId: string) => {
    window.history.pushState({}, '', `/roadmap/${slug}/topic/${topicId}`);
    setSelectedTopicId(topicId);
  };

  const toggleBookmark = async (lessonId: string) => {
    if (!currentUser) return;
    const next = bookmarkedLessonIds.includes(lessonId)
      ? bookmarkedLessonIds.filter((id) => id !== lessonId)
      : [...bookmarkedLessonIds, lessonId];
    setBookmarkedLessonIds(next);
    await RoadmapApi.saveProgress(slug, currentUser.id, {
      lessonIds: progress,
      completedTopicIds: [],
      completedProjectIds,
      lastLessonId,
      bookmarkedLessonIds: next,
      notes
    });
  };

  const saveNote = async (lessonId: string, value: string) => {
    if (!currentUser) return;
    const nextNotes = { ...notes, [lessonId]: value };
    setNotes(nextNotes);
    await RoadmapApi.saveProgress(slug, currentUser.id, {
      lessonIds: progress,
      completedTopicIds: [],
      completedProjectIds,
      lastLessonId,
      bookmarkedLessonIds,
      notes: nextNotes
    });
  };

  const toggleProject = async (projectId: string) => {
    if (!currentUser) return;
    const next = completedProjectIds.includes(projectId)
      ? completedProjectIds.filter((id) => id !== projectId)
      : [...completedProjectIds, projectId];
    setCompletedProjectIds(next);
    await RoadmapApi.saveProgress(slug, currentUser.id, {
      lessonIds: progress,
      completedTopicIds: [],
      completedProjectIds: next,
      lastLessonId,
      bookmarkedLessonIds,
      notes
    });
  };

  const submitAssessment = async () => {
    if (!currentUser || !roadmap.assessment) return;
    const questions = roadmap.assessment.questions;
    const correct = questions.filter((question) => assessmentAnswers[question.id] === question.answer).length;
    const score = Math.round((correct / questions.length) * 100);
    setAssessmentScore(score);
    await RoadmapApi.saveProgress(slug, currentUser.id, {
      lessonIds: progress,
      completedTopicIds: [],
      completedProjectIds,
      lastLessonId,
      bookmarkedLessonIds,
      notes,
      assessmentAttempts: [{ assessmentId: roadmap.assessment.id, score, completedAt: new Date().toISOString() }]
    });
  };

  const percentage = lessons.length ? Math.round((progress.length / lessons.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12 max-w-5xl animate-fade-in">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to Skill Roadmap
      </button>

      <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{roadmap.category}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{roadmap.name} Developer Roadmap</h1>
            <p className="text-sm text-slate-500 mt-2 max-w-2xl">{roadmap.description}</p>
          </div>
          <div className="min-w-44">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-500">Course progress</span>
              <strong className="text-blue-600">{percentage}%</strong>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }} />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {progress.length} of {lessons.length} lessons complete
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Why it is used</p>
            <p className="text-xs text-slate-700 mt-1">{roadmap.overview.whyUsed}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Career paths</p>
            <p className="text-xs text-slate-700 mt-1">{roadmap.careerPaths.join(' • ')}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Prerequisites</p>
            <p className="text-xs text-slate-700 mt-1">{roadmap.prerequisites.join(', ') || 'None listed'}</p>
          </div>
        </div>
        {lastLessonId && !progress.includes(lastLessonId) && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase text-blue-700">Continue learning</p>
              <p className="text-xs text-slate-700 mt-1">Resume your last unfinished lesson.</p>
            </div>
            <button
              onClick={() => {
                const lesson = lessons.find((item) => item.id === lastLessonId);
                const topic = roadmap.modules
                  .flatMap((module) => module.topics)
                  .find((item) => item.lessons.some((candidate) => candidate.id === lesson?.id));
                if (topic) openTopic(topic.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
            >
              Continue
            </button>
          </div>
        )}
      </section>

      {selectedTopic ? (
        <section className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <button
            onClick={() => {
              window.history.pushState({}, '', `/roadmap/${slug}`);
              setSelectedTopicId(null);
            }}
            className="text-xs font-semibold text-blue-600"
          >
            ← Back to learning path
          </button>
          {selectedTopic.lessons.map((lesson) => (
            <article key={lesson.id} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-600">Topic lesson</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{lesson.title}</h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{lesson.introduction}</p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {lesson.estimatedMinutes} minutes • {lesson.difficulty}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    aria-label={`Bookmark ${lesson.title}`}
                    onClick={() => toggleBookmark(lesson.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                      bookmarkedLessonIds.includes(lesson.id)
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {bookmarkedLessonIds.includes(lesson.id) ? 'Saved' : 'Bookmark'}
                  </button>
                  <button
                    aria-label={`Mark ${lesson.title} complete`}
                    onClick={() => toggleLesson(lesson.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      progress.includes(lesson.id)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {progress.includes(lesson.id) ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70">
                  <h3 className="font-bold text-blue-900 uppercase text-[10px]">Why it matters</h3>
                  <p className="text-slate-700 mt-2 leading-relaxed">{lesson.whyItMatters}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                  <h3 className="font-bold text-emerald-900 uppercase text-[10px]">Real-world usage</h3>
                  <p className="text-slate-700 mt-2 leading-relaxed">{lesson.realWorldUsage}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Learning objectives</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {lesson.objectives.map((objective) => (
                    <li key={objective} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                      ✓ {objective}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">How it works</h3>
                <p className="text-slate-700 leading-relaxed">{lesson.howItWorks}</p>
                {lesson.syntax && (
                  <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto">
                    <code>{lesson.syntax}</code>
                  </pre>
                )}
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Examples</h3>
                {lesson.examples.map((example) => (
                  <div key={example.code} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                      {example.language}
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-100 text-xs overflow-x-auto">
                      <code>{example.code}</code>
                    </pre>
                    <p className="p-3 text-xs text-slate-600 leading-relaxed">{example.explanation}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/70">
                  <h3 className="font-bold text-rose-900 uppercase text-[10px]">Common mistakes</h3>
                  <ul className="mt-2 space-y-1.5 text-slate-700 list-disc list-inside">
                    {lesson.commonMistakes.map((mistake) => (
                      <li key={mistake}>{mistake}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
                  <h3 className="font-bold text-amber-900 uppercase text-[10px]">Best practices</h3>
                  <ul className="mt-2 space-y-1.5 text-slate-700 list-disc list-inside">
                    {lesson.bestPractices.map((practice) => (
                      <li key={practice}>{practice}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <h3 className="font-bold text-slate-800 uppercase text-[10px]">Important points</h3>
                <ul className="mt-2 space-y-1 text-slate-700">
                  {lesson.importantPoints.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40">
                  <h3 className="font-bold text-blue-900 uppercase text-[10px]">Practice</h3>
                  {lesson.practice.map((item) => (
                    <div key={item.title} className="mt-2">
                      <p className="font-semibold text-slate-800">{item.title}</p>
                      <p className="text-slate-700 mt-1">{item.problem}</p>
                      {item.expectedOutput && (
                        <p className="text-slate-500 mt-1">Expected: {item.expectedOutput}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40">
                  <h3 className="font-bold text-indigo-900 uppercase text-[10px]">Mini challenge</h3>
                  <p className="text-slate-700 mt-2">{lesson.miniChallenge}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200">
                <h3 className="font-bold text-slate-800 uppercase text-[10px]">Interview preparation</h3>
                <ol className="mt-2 space-y-2 text-xs text-slate-700 list-decimal list-inside">
                  {lesson.interviewQuestions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ol>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-800 uppercase text-[10px]">Prerequisites and notes</h3>
                <p className="text-xs text-slate-600 mt-2">
                  {selectedTopic.prerequisites.length
                    ? `Recommended before this topic: ${selectedTopic.prerequisites.join(', ')}`
                    : 'This topic starts the current module.'}
                </p>
                <textarea
                  aria-label={`Notes for ${lesson.title}`}
                  value={notes[lesson.id] || ''}
                  onChange={(event) => setNotes((current) => ({ ...current, [lesson.id]: event.target.value }))}
                  onBlur={(event) => saveNote(lesson.id, event.target.value)}
                  placeholder="Write a note for this lesson..."
                  className="mt-3 w-full min-h-20 p-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  disabled={!previousTopic}
                  onClick={() => previousTopic && openTopic(previousTopic.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-[11px] text-slate-400">
                  {selectedTopicIndex + 1} of {topicSequence.length}
                </span>
                <button
                  disabled={!nextTopic}
                  onClick={() => nextTopic && openTopic(nextTopic.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-slate-900">Learning path</h2>
              <input
                aria-label="Search topics in this technology"
                value={topicSearch}
                onChange={(event) => setTopicSearch(event.target.value)}
                placeholder={`Search ${roadmap.name} topics...`}
                className="w-full sm:w-64 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            {visibleModules.map((module) => (
              <article key={module.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-600">{module.level}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{module.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{module.description}</p>
                  </div>
                  <Layers className="w-5 h-5 text-slate-300" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {module.topics.map((topic) => {
                    const done =
                      topic.lessons.length > 0 && topic.lessons.every((lesson) => progress.includes(lesson.id));
                    return (
                      <button
                        key={topic.id}
                        onClick={() => openTopic(topic.id)}
                        className="text-left p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">{topic.title}</p>
                          {done && <span className="text-[10px] text-emerald-600">Complete</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {topic.lessons.length} lesson{topic.lessons.length === 1 ? '' : 's'} • Open topic
                        </p>
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Projects</h2>
              <p className="text-xs text-slate-500 mt-1">Apply the concepts in a portfolio-ready context.</p>
              <div className="space-y-3 mt-4">
                {(roadmap.projects || []).map((project) => (
                  <article key={project.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between gap-2">
                      <h3 className="text-xs font-bold text-slate-800">{project.title}</h3>
                      <button
                        onClick={() => toggleProject(project.id)}
                        className={`text-[10px] font-semibold ${
                          completedProjectIds.includes(project.id) ? 'text-emerald-700' : 'text-blue-600'
                        }`}
                      >
                        {completedProjectIds.includes(project.id) ? 'Completed' : 'Mark complete'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{project.problemStatement}</p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      <strong>Skills:</strong> {project.skillsRequired.join(' • ')}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900">Knowledge check</h2>
              <p className="text-xs text-slate-500 mt-1">Answer the questions to create real mastery evidence.</p>
              <div className="space-y-3 mt-4">
                {roadmap.assessment?.questions.map((question, index) => (
                  <div key={question.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold text-slate-800">
                      {index + 1}. {question.question}
                    </p>
                    <select
                      aria-label={question.question}
                      value={assessmentAnswers[question.id] || ''}
                      onChange={(event) =>
                        setAssessmentAnswers((answers) => ({ ...answers, [question.id]: event.target.value }))
                      }
                      className="mt-2 w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                    >
                      <option value="">Choose an answer</option>
                      {question.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                <button
                  onClick={submitAssessment}
                  disabled={
                    !roadmap.assessment ||
                    Object.keys(assessmentAnswers).length < (roadmap.assessment?.questions.length || 0)
                  }
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
                >
                  Submit assessment
                </button>
                {assessmentScore !== null && (
                  <p className="text-xs font-semibold text-blue-700">Latest score: {assessmentScore}%</p>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

// =========================================================================
// MAIN CAREER ROADMAP COMPONENT (UPGRADED)
// =========================================================================
export const CareerRoadmap: React.FC<CareerRoadmapProps> = ({
  onNavigateToLab,
  onNavigateToInterview,
  onNavigateToResume
}) => {
  const {
    currentUser,
    studentProfile,
    industrySkills,
    roadmap,
    completeRoadmapStep,
    latestAnalysis,
    selectedOpportunityContext,
    analysisHistory
  } = useApp();

  // Navigation state
  const [technologySlug, setTechnologySlug] = useState<string | null>(() => getRoadmapSlug());
  const [technologies, setTechnologies] = useState<RoadmapSummary[]>([]);
  const [technologySearch, setTechnologySearch] = useState('');
  const [technologyCategory, setTechnologyCategory] = useState('All');
  const [technologyError, setTechnologyError] = useState<string | null>(null);

  // Active view tab: 'recommended' | 'gaps' | 'myskills' | 'all'
  const [viewTab, setViewTab] = useState<'recommended' | 'gaps' | 'myskills' | 'all'>(() => {
    return latestAnalysis ? 'recommended' : 'all';
  });

  // Department filter
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType>('All Departments');

  // Active dedicated skill learning view (if legacy selected)
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Selected department skill modal for deep-dive overview
  const [selectedDetailSkill, setSelectedDetailSkill] = useState<SkillCatalogEntry | null>(null);

  // History modal toggle
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Auto-switch to 'recommended' when an analysis becomes available
  useEffect(() => {
    if (latestAnalysis) {
      setViewTab('recommended');
    }
  }, [latestAnalysis?.analysisId]);

  // Load backend summaries
  useEffect(() => {
    const onPopState = () => setTechnologySlug(getRoadmapSlug());
    window.addEventListener('popstate', onPopState);
    RoadmapApi.getSummaries(currentUser?.id)
      .then(setTechnologies)
      .catch((err: Error) => setTechnologyError(err.message));
    return () => window.removeEventListener('popstate', onPopState);
  }, [currentUser?.id]);

  // Compute Personalized Roadmap strictly from validated evidence
  const personalizedRoadmap = useMemo<PersonalizedRoadmapState | null>(() => {
    return computePersonalizedRoadmap(
      latestAnalysis,
      selectedOpportunityContext,
      studentProfile.skills,
      SKILL_CATALOG,
      selectedDepartment
    );
  }, [latestAnalysis, selectedOpportunityContext, studentProfile.skills, selectedDepartment]);

  const openTechnology = (slug: string) => {
    window.history.pushState({ roadmap: slug }, '', `/roadmap/${slug}`);
    setTechnologySlug(slug);
  };

  // If viewing a specific technology's lessons
  if (technologySlug) {
    return (
      <TechnologyRoadmapView
        slug={technologySlug}
        onBack={() => {
          window.history.pushState({}, '', '/roadmap');
          setTechnologySlug(null);
        }}
      />
    );
  }

  // If a legacy milestone skill is selected
  if (selectedSkillId) {
    return (
      <SkillLearningView
        stepId={selectedSkillId}
        onBack={() => setSelectedSkillId(null)}
        onNavigateToSkill={(id) => setSelectedSkillId(id)}
        onNavigateToLab={onNavigateToLab}
        onNavigateToInterview={onNavigateToInterview}
      />
    );
  }

  // Combined Catalog Filtering (Departments + Search + Category)
  const filteredCatalogSkills = SKILL_CATALOG.filter((item) => {
    // 1. Department Filter
    const matchesDept =
      selectedDepartment === 'All Departments' ||
      item.departments.some((d) => d.toLowerCase() === selectedDepartment.toLowerCase());

    // 2. Category Filter
    const matchesCategory =
      technologyCategory === 'All' || item.category.toLowerCase() === technologyCategory.toLowerCase();

    // 3. Search Filter
    const query = technologySearch.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.subCategory.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    return matchesDept && matchesCategory && matchesSearch;
  });

  // Filter skills for "My Skills" tab (FOUND or PARTIALLY evidenced)
  const myEvidencedSkills = SKILL_CATALOG.filter((item) => {
    const evidence = getSkillEvidenceStatus(item.name, latestAnalysis, studentProfile.skills);
    return evidence.status === 'FOUND' || evidence.status === 'PARTIALLY_EVIDENCED';
  });

  // Categories list based on available skills
  const availableCategories = ['All', ...Array.from(new Set(SKILL_CATALOG.map((s) => s.category)))];

  return (
    <div className="space-y-6 pb-12 max-w-5xl animate-fade-in">
      {/* ========================================================================= */}
      {/* 1. HEADER BAR & CONTROLS */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
              Skill Roadmap
            </span>
            {personalizedRoadmap && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Personalized
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Technology & Skill Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {personalizedRoadmap
              ? 'Dynamic, evidence-based learning paths tailored to your verified skills and target industry gaps.'
              : 'Explore industry-relevant skills across all departments. Analyze your resume to receive a personalized roadmap.'}
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          {analysisHistory && analysisHistory.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
              title="View past resume analysis roadmaps"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Roadmap History ({analysisHistory.length})</span>
            </button>
          )}

          {onNavigateToResume && (
            <button
              onClick={onNavigateToResume}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{latestAnalysis ? 'Analyze Another Resume' : 'Analyze Resume'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PERSONALIZATION BANNER (WHEN RESUME HAS BEEN ANALYZED) */}
      {/* ========================================================================= */}
      {personalizedRoadmap ? (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-slate-50 border border-blue-200/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                    {personalizedRoadmap.modeLabel}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Analyzed on {new Date(personalizedRoadmap.analyzedAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span>Current Resume:</span>
                  <span className="font-semibold text-blue-700 underline decoration-blue-300">
                    {personalizedRoadmap.resumeFileName}
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-bold text-blue-900 shadow-xs">
                {personalizedRoadmap.priorityGaps.length} Priority Gaps
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 shadow-xs">
                {personalizedRoadmap.foundSkills.length} Skills Evidenced
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <p>
              {personalizedRoadmap.opportunityTitle ? (
                <span>
                  Targeting: <strong>{personalizedRoadmap.opportunityTitle}</strong>
                  {personalizedRoadmap.opportunityCompany ? ` at ${personalizedRoadmap.opportunityCompany}` : ''}
                </span>
              ) : (
                <span>Industry benchmark alignment based on latest technical resume extraction.</span>
              )}
            </p>
            <span className="text-[11px] text-slate-500 italic">
              Recalculates automatically upon new resume analysis or opportunity selection.
            </span>
          </div>
        </div>
      ) : (
        /* Empty State Prompt if No Resume Analyzed */
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">
                Explore Skills Catalog (General Mode)
              </p>
              <p className="text-slate-600 text-xs">
                Your personalized skill gap roadmap will automatically appear after analyzing a resume. All department technologies are available below.
              </p>
            </div>
          </div>
          {onNavigateToResume && (
            <button
              onClick={onNavigateToResume}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 self-start sm:self-auto"
            >
              Analyze Resume Now →
            </button>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VIEW MODE TABS: [ Recommended for Me ] [ My Skill Gaps ] [ My Skills ] [ All Skills ] */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80">
          <button
            onClick={() => setViewTab('recommended')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === 'recommended'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recommended for Me
            {personalizedRoadmap && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800">
                {personalizedRoadmap.allGaps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setViewTab('gaps')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === 'gaps'
                ? 'bg-white text-rose-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Skill Gaps
            {personalizedRoadmap && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800">
                {personalizedRoadmap.priorityGaps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setViewTab('myskills')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === 'myskills'
                ? 'bg-white text-emerald-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Evidenced Skills
            {personalizedRoadmap && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                {personalizedRoadmap.foundSkills.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setViewTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Skills Catalog
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {SKILL_CATALOG.length}
            </span>
          </button>
        </div>

        {/* Department Quick Filter */}
        <div className="flex items-center space-x-2">
          <label htmlFor="dept-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            Department:
          </label>
          <select
            id="dept-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value as DepartmentType)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TAB CONTENT: RECOMMENDED FOR ME */}
      {/* ========================================================================= */}
      {viewTab === 'recommended' && (
        <div className="space-y-6 animate-fade-in">
          {personalizedRoadmap ? (
            <>
              {/* Priority Gaps section */}
              {personalizedRoadmap.priorityGaps.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>High Priority Skill Gaps (Target Role Qualifications)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        These skills were not evidenced in your resume and are explicitly required for role qualification.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {personalizedRoadmap.priorityGaps.map((gap) => (
                      <div
                        key={gap.skillId}
                        className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                High Priority
                              </span>
                              <h3 className="text-base font-bold text-slate-900 mt-1">
                                {gap.name}
                              </h3>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {gap.category}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {gap.reason}
                          </p>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                            <strong>Evidence:</strong> {gap.currentEvidence}
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-emerald-700">
                            Demand {gap.industryDemandScore}%
                          </span>

                          {gap.slug ? (
                            <button
                              onClick={() => openTechnology(gap.slug!)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center space-x-1"
                            >
                              <span>Open Learning Path</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const found = SKILL_CATALOG.find((s) => s.skillId === gap.skillId);
                                if (found) setSelectedDetailSkill(found);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                            >
                              View Syllabus & Plan
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Secondary Gaps section */}
              {personalizedRoadmap.secondaryGaps.length > 0 && (
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>Recommended Industry Strengths (Medium & Growth Priorities)</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Complementary competencies that boost competitive edge in hiring evaluations.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {personalizedRoadmap.secondaryGaps.map((gap) => (
                      <div
                        key={gap.skillId}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                              {gap.priority} Priority
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {gap.targetLevel}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900">
                            {gap.name}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2">
                            {gap.reason}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500">
                            {gap.evidenceStatus === 'PARTIALLY_EVIDENCED' ? 'Partially Evidenced' : 'Not Evidenced'}
                          </span>

                          {gap.slug ? (
                            <button
                              onClick={() => openTechnology(gap.slug!)}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Explore →
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                const found = SKILL_CATALOG.find((s) => s.skillId === gap.skillId);
                                if (found) setSelectedDetailSkill(found);
                              }}
                              className="text-xs font-semibold text-slate-600 hover:text-slate-800"
                            >
                              Details
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {personalizedRoadmap.allGaps.length === 0 && (
                <div className="p-8 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-900">
                    All Core Target Requirements Met
                  </h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Your current profile demonstrates solid coverage of the analyzed role requirements. Switch to <strong>All Skills</strong> to explore advanced specialized engineering domains.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">
                Personalized Roadmap Not Yet Generated
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Upload your resume in the Resume Data or AI Skill Analyzer page to automatically generate your personalized skill gap roadmap.
              </p>
              {onNavigateToResume && (
                <button
                  onClick={onNavigateToResume}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Analyze Resume
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB CONTENT: MY SKILL GAPS */}
      {/* ========================================================================= */}
      {viewTab === 'gaps' && (
        <div className="space-y-4 animate-fade-in">
          {personalizedRoadmap && personalizedRoadmap.allGaps.length > 0 ? (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>
                  Showing all <strong>{personalizedRoadmap.allGaps.length}</strong> identified gaps based on resume evidence vs role benchmarks.
                </span>
                <span className="text-[11px] text-slate-500">
                  Sorted by: Requirement urgency & dependency order
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {personalizedRoadmap.allGaps.map((gap, idx) => (
                  <div
                    key={gap.skillId}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            gap.priority === 'HIGH'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {gap.priority} Priority
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900">
                        {gap.name}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {gap.reason}
                      </p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{gap.currentEvidence}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Target: {gap.targetLevel}
                      </span>
                      {gap.slug ? (
                        <button
                          onClick={() => openTechnology(gap.slug!)}
                          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                        >
                          Open Course →
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const found = SKILL_CATALOG.find((s) => s.skillId === gap.skillId);
                            if (found) setSelectedDetailSkill(found);
                          }}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                        >
                          View Syllabus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No Active Skill Gaps</h3>
              <p className="text-xs text-slate-500">
                Analyze your resume or select a target opportunity to uncover targeted skill requirements.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB CONTENT: MY EVIDENCED SKILLS */}
      {/* ========================================================================= */}
      {viewTab === 'myskills' && (
        <div className="space-y-4 animate-fade-in">
          {personalizedRoadmap && personalizedRoadmap.foundSkills.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                <span>
                  Found <strong>{personalizedRoadmap.foundSkills.length}</strong> skills verified with textual evidence in your latest analyzed resume.
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold">
                  Verified In Resume
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {personalizedRoadmap.foundSkills.map((s, idx) => {
                  const catalogItem = SKILL_CATALOG.find(
                    (c) => c.name.toLowerCase() === s.name.toLowerCase() || c.skillId === s.name.toLowerCase()
                  );
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Found In Resume
                          </span>
                          <span className="text-base">{catalogItem?.icon || '✅'}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                        {s.evidenceSnippet && (
                          <p className="text-[11px] text-slate-500 italic line-clamp-2 border-l-2 border-emerald-300 pl-2 mt-1">
                            "{s.evidenceSnippet}"
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          {catalogItem?.category || 'Technical Skill'}
                        </span>
                        {catalogItem?.slug && (
                          <button
                            onClick={() => openTechnology(catalogItem.slug!)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                          >
                            Review Roadmap →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
              <Info className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No Evidenced Skills Recorded</h3>
              <p className="text-xs text-slate-500">
                Analyze your resume to view skills verified from your work history, projects, and coursework.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB CONTENT: ALL SKILLS CATALOG (MULTI-DEPARTMENT) */}
      {/* ========================================================================= */}
      {viewTab === 'all' && (
        <section className="space-y-4 animate-fade-in">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Department & Technology Discovery
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredCatalogSkills.length} skills for{' '}
                <strong>{selectedDepartment}</strong>. Choose any technology to open its structured roadmap.
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                aria-label="Search technologies"
                value={technologySearch}
                onChange={(event) => setTechnologySearch(event.target.value)}
                placeholder="Search by skill, domain, tag..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => setTechnologyCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  technologyCategory === category
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {technologyError && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              {technologyError}
            </div>
          )}

          {/* Unified Technology Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCatalogSkills.map((technology) => {
              // Evidence pill from active analysis
              const evidence = getSkillEvidenceStatus(technology.name, latestAnalysis, studentProfile.skills);
              // Backend summary progress match (if exists)
              const summaryMatch = technologies.find(
                (t) => t.slug === technology.slug || t.name.toLowerCase() === technology.name.toLowerCase()
              );

              return (
                <div
                  key={technology.skillId}
                  className="text-left p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {technology.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                          <span>{technology.name}</span>
                        </h3>
                      </div>
                      <span className="text-sm font-bold p-1 rounded-lg bg-slate-50 text-slate-600">
                        {technology.icon}
                      </span>
                    </div>

                    {/* Evidence Status Pill (if analysis exists) */}
                    {evidence.status && (
                      <div className="pt-0.5">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${evidence.badgeClass}`}
                        >
                          {evidence.label}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {technology.description}
                    </p>

                    {/* Department Tag Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {technology.departments.slice(0, 3).map((dept) => (
                        <span
                          key={dept}
                          className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                        >
                          {dept}
                        </span>
                      ))}
                      {technology.departments.length > 3 && (
                        <span className="text-[9px] font-semibold text-slate-400">
                          +{technology.departments.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      {technology.difficulty} • Demand {technology.demandScore}%
                    </span>

                    {technology.slug ? (
                      <button
                        onClick={() => openTechnology(technology.slug!)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {summaryMatch && summaryMatch.progress.completedLessons > 0
                          ? `Resume (${summaryMatch.progress.completedLessons}) →`
                          : 'Open Roadmap →'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedDetailSkill(technology)}
                        className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        View Syllabus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: DEPARTMENT SKILL SYLLABUS DETAIL */}
      {/* ========================================================================= */}
      {selectedDetailSkill && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{selectedDetailSkill.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {selectedDetailSkill.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedDetailSkill.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sub-category: {selectedDetailSkill.subCategory}
                </p>
              </div>
              <button
                onClick={() => setSelectedDetailSkill(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedDetailSkill.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Difficulty</span>
                <p className="font-bold text-slate-900 mt-0.5">{selectedDetailSkill.difficulty}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Industry Demand</span>
                <p className="font-bold text-emerald-700 mt-0.5">{selectedDetailSkill.demandScore}% Required</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Academic Departments
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedDetailSkill.departments.map((d) => (
                  <span key={d} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px]">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Recommended Prerequisites
              </h4>
              <p className="text-slate-600">
                {selectedDetailSkill.prerequisites.length > 0
                  ? selectedDetailSkill.prerequisites.join(', ')
                  : 'None. Foundational entry point.'}
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                Related Technologies & Tools
              </h4>
              <p className="text-slate-600">
                {selectedDetailSkill.relatedSkills.join(', ')}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => setSelectedDetailSkill(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
              {selectedDetailSkill.slug && (
                <button
                  onClick={() => {
                    const slug = selectedDetailSkill.slug!;
                    setSelectedDetailSkill(null);
                    openTechnology(slug);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Open Full Learning Path</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: ROADMAP ANALYSIS HISTORY */}
      {/* ========================================================================= */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Resume Analysis History & Snapshots</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Previous analysis states are preserved. Your current roadmap automatically reflects your latest upload.
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              {analysisHistory && analysisHistory.length > 0 ? (
                analysisHistory.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {item.resumeName || 'Candidate_Resume.pdf'}
                      </span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Active Current
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Target: {item.opportunityTitle || 'General Industry Profile'} ({item.companyName || 'Standard Benchmark'})
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>{new Date(item.analyzedAt).toLocaleString()}</span>
                      <span>
                        {item.matchedSkills.length} Matched • {item.missingSkills.length} Gaps
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">No past analysis snapshots found.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
