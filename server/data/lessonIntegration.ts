/**
 * Lesson Content Integration
 * --------------------------
 * Central re-export of all technology-specific lesson content files.
 * roadmapService.ts imports from here so it doesn't need to know about individual files.
 */

import { RoadmapLesson } from '../roadmapTypes';

// Topic lesson maps
const JAVA_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const JAVA_ADVANCED_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const PYTHON_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const JAVASCRIPT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const SQL_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const HTML_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const CSS_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const REACT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const SPRING_BOOT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const TYPESCRIPT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const NODEJS_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const DOCKER_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const GIT_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const GITHUB_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const DSA_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const MYSQL_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const MONGODB_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};
const EXPRESSJS_TOPIC_LESSONS: Record<string, RoadmapLesson[]> = {};

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
