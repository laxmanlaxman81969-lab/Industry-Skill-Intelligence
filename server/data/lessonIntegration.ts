/**
 * Lesson Content Integration
 * --------------------------
 * Central re-export of all technology-specific lesson content files.
 * roadmapService.ts imports from here so it doesn't need to know about individual files.
 *
 * Falls back gracefully when a data file is not yet available.
 */

import { RoadmapLesson } from '../roadmapTypes';

declare const require: any;

// Lazy imports with fallback — each file is optional during development
let JAVA_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let JAVA_ADVANCED_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let PYTHON_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let JAVASCRIPT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let SQL_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let HTML_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let CSS_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let REACT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let SPRING_BOOT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let TYPESCRIPT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let NODEJS_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let DOCKER_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let GIT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let GITHUB_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let DSA_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let MYSQL_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let MONGODB_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
let EXPRESSJS_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};

if (typeof require !== 'undefined') {
  try { ({ JAVA_TOPIC_LESSONS } = require('./javaLessonContent')); } catch {}
  try { ({ JAVA_ADVANCED_TOPIC_LESSONS } = require('./javaAdvancedLessonContent')); } catch {}
  try { ({ PYTHON_TOPIC_LESSONS } = require('./pythonLessonContent')); } catch {}
  try { ({ JAVASCRIPT_TOPIC_LESSONS } = require('./javascriptLessonContent')); } catch {}
  try { ({ SQL_TOPIC_LESSONS } = require('./sqlLessonContent')); } catch {}
  try { ({ HTML_TOPIC_LESSONS, CSS_TOPIC_LESSONS } = require('./htmlCssLessonContent')); } catch {}
  try { ({ REACT_TOPIC_LESSONS } = require('./reactLessonContent')); } catch {}
  try { ({ SPRING_BOOT_TOPIC_LESSONS } = require('./springBootLessonContent')); } catch {}
  try {
    const otherTech = require('./otherTechLessonContent');
    TYPESCRIPT_TOPIC_LESSONS = otherTech.TYPESCRIPT_TOPIC_LESSONS || {};
    NODEJS_TOPIC_LESSONS = otherTech.NODEJS_TOPIC_LESSONS || {};
    DOCKER_TOPIC_LESSONS = otherTech.DOCKER_TOPIC_LESSONS || {};
    GIT_TOPIC_LESSONS = otherTech.GIT_TOPIC_LESSONS || {};
    GITHUB_TOPIC_LESSONS = otherTech.GITHUB_TOPIC_LESSONS || {};
    DSA_TOPIC_LESSONS = otherTech.DSA_TOPIC_LESSONS || {};
    MYSQL_TOPIC_LESSONS = otherTech.MYSQL_TOPIC_LESSONS || {};
    MONGODB_TOPIC_LESSONS = otherTech.MONGODB_TOPIC_LESSONS || {};
    EXPRESSJS_TOPIC_LESSONS = otherTech.EXPRESSJS_TOPIC_LESSONS || {};
  } catch {}
}

/**
 * Master lookup: technology slug → topic title → array of lessons.
 * Merges Java foundational and advanced content automatically.
 */
export const ALL_TOPIC_LESSONS: Record<string, Record<string, RoadmapLesson[]>> = {
  java: { ...JAVA_TOPIC_LESSONS, ...JAVA_ADVANCED_TOPIC_LESSONS },
  python: PYTHON_TOPIC_LESSONS,
  javascript: JAVASCRIPT_TOPIC_LESSONS,
  sql: SQL_TOPIC_LESSONS,
  html: HTML_TOPIC_LESSONS,
  css: CSS_TOPIC_LESSONS,
  react: REACT_TOPIC_LESSONS,
  'spring-boot': SPRING_BOOT_TOPIC_LESSONS,
  spring: SPRING_BOOT_TOPIC_LESSONS,
  typescript: TYPESCRIPT_TOPIC_LESSONS,
  'node-js': NODEJS_TOPIC_LESSONS,
  docker: DOCKER_TOPIC_LESSONS,
  git: GIT_TOPIC_LESSONS,
  github: GITHUB_TOPIC_LESSONS,
  dsa: DSA_TOPIC_LESSONS,
  mysql: MYSQL_TOPIC_LESSONS,
  mongodb: MONGODB_TOPIC_LESSONS,
  'express-js': EXPRESSJS_TOPIC_LESSONS,
};

/**
 * Retrieve pre-authored lessons for a topic, or undefined if not yet authored.
 */
export function getAuthoredLessons(technology: string, topicTitle: string): RoadmapLesson[] | undefined {
  const techMap = ALL_TOPIC_LESSONS[technology] ?? ALL_TOPIC_LESSONS[technology.replace('_', '-')];
  return techMap?.[topicTitle];
}
