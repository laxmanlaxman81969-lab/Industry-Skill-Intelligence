const fs = require('fs');
const path = require('path');
const targetFile = 'C:/sih/src/data/interviewQuestions/index.ts';

const content = `// Interview Question Bank Engine & Registry
import { RoleQuestion } from './types';
import { InterviewQuestion, SkillLevel, StudentSkill, IndustrySkill } from '../../types';

// Import all 28 bank files
import { JAVA_BACKEND_QUESTIONS } from './banks/javaBackend';
import { JAVA_FULLSTACK_QUESTIONS } from './banks/javaFullStack';
import { FULL_STACK_QUESTIONS } from './banks/fullStack';
import { SOFTWARE_DEVELOPER_QUESTIONS } from './banks/softwareDeveloper';
import { SOFTWARE_ENGINEER_QUESTIONS } from './banks/softwareEngineer';
import { BACKEND_DEVELOPER_QUESTIONS } from './banks/backendDeveloper';
import { FRONTEND_DEVELOPER_QUESTIONS } from './banks/frontendDeveloper';
import { REACT_DEVELOPER_QUESTIONS } from './banks/reactDeveloper';
import { JAVA_DEVELOPER_QUESTIONS } from './banks/javaDeveloper';
import { SPRING_BOOT_QUESTIONS } from './banks/springBootDeveloper';
import { PYTHON_DEVELOPER_QUESTIONS } from './banks/pythonDeveloper';
import { PYTHON_BACKEND_QUESTIONS } from './banks/pythonBackend';
import { DATA_ANALYST_QUESTIONS } from './banks/dataAnalyst';
import { DATA_SCIENTIST_QUESTIONS } from './banks/dataScientist';
import { ML_ENGINEER_QUESTIONS } from './banks/mlEngineer';
import { AI_ENGINEER_QUESTIONS } from './banks/aiEngineer';
import { DEVOPS_ENGINEER_QUESTIONS } from './banks/devopsEngineer';
import { CLOUD_ENGINEER_QUESTIONS } from './banks/cloudEngineer';
import { DATABASE_DEVELOPER_QUESTIONS } from './banks/databaseDeveloper';
import { SQL_DEVELOPER_QUESTIONS } from './banks/sqlDeveloper';
import { QA_ENGINEER_QUESTIONS } from './banks/qaEngineer';
import { AUTOMATION_TEST_ENGINEER_QUESTIONS } from './banks/automationTestEngineer';
import { SOFTWARE_TESTING_ENGINEER_QUESTIONS } from './banks/softwareTestingEngineer';
import { WEB_DEVELOPER_QUESTIONS } from './banks/webDeveloper';
import { MOBILE_APP_DEVELOPER_QUESTIONS } from './banks/mobileAppDeveloper';
import { ANDROID_DEVELOPER_QUESTIONS } from './banks/androidDeveloper';
import { CYBERSECURITY_ANALYST_QUESTIONS } from './banks/cybersecurityAnalyst';
import { CLOUD_SUPPORT_ENGINEER_QUESTIONS } from './banks/cloudSupportEngineer';

export * from './types';

// Map of role name -> question bank
export const ROLE_QUESTION_BANKS: Record<string, RoleQuestion[]> = {
  'Java Backend Developer': JAVA_BACKEND_QUESTIONS,
  'Java Full Stack Developer': JAVA_FULLSTACK_QUESTIONS,
  'Full Stack Developer': FULL_STACK_QUESTIONS,
  'Software Developer': SOFTWARE_DEVELOPER_QUESTIONS,
  'Software Engineer': SOFTWARE_ENGINEER_QUESTIONS,
  'Backend Developer': BACKEND_DEVELOPER_QUESTIONS,
  'Frontend Developer': FRONTEND_DEVELOPER_QUESTIONS,
  'React Developer': REACT_DEVELOPER_QUESTIONS,
  'Java Developer': JAVA_DEVELOPER_QUESTIONS,
  'Spring Boot Developer': SPRING_BOOT_QUESTIONS,
  'Python Developer': PYTHON_DEVELOPER_QUESTIONS,
  'Python Backend Developer': PYTHON_BACKEND_QUESTIONS,
  'Data Analyst': DATA_ANALYST_QUESTIONS,
  'Data Scientist': DATA_SCIENTIST_QUESTIONS,
  'Machine Learning Engineer': ML_ENGINEER_QUESTIONS,
  'AI Engineer': AI_ENGINEER_QUESTIONS,
  'DevOps Engineer': DEVOPS_ENGINEER_QUESTIONS,
  'Cloud Engineer': CLOUD_ENGINEER_QUESTIONS,
  'Database Developer': DATABASE_DEVELOPER_QUESTIONS,
  'SQL Developer': SQL_DEVELOPER_QUESTIONS,
  'QA Engineer': QA_ENGINEER_QUESTIONS,
  'Automation Test Engineer': AUTOMATION_TEST_ENGINEER_QUESTIONS,
  'Software Testing Engineer': SOFTWARE_TESTING_ENGINEER_QUESTIONS,
  'Web Developer': WEB_DEVELOPER_QUESTIONS,
  'Mobile App Developer': MOBILE_APP_DEVELOPER_QUESTIONS,
  'Android Developer': ANDROID_DEVELOPER_QUESTIONS,
  'Cybersecurity Analyst': CYBERSECURITY_ANALYST_QUESTIONS,
  'Cloud Support Engineer': CLOUD_SUPPORT_ENGINEER_QUESTIONS,
};

// Categorized roles for dropdown
export interface RoleCategoryGroup {
  category: string;
  roles: string[];
}

export const ROLE_CATEGORIES: RoleCategoryGroup[] = [
  {
    category: 'Software Engineering & Backend',
    roles: [
      'Java Backend Developer',
      'Java Developer',
      'Spring Boot Developer',
      'Backend Developer',
      'Software Developer',
      'Software Engineer',
    ]
  },
  {
    category: 'Full Stack & Web',
    roles: [
      'Java Full Stack Developer',
      'Full Stack Developer',
      'Frontend Developer',
      'React Developer',
      'Web Developer',
    ]
  },
  {
    category: 'Python Ecosystem',
    roles: [
      'Python Developer',
      'Python Backend Developer',
    ]
  },
  {
    category: 'Data Science & Artificial Intelligence',
    roles: [
      'Data Analyst',
      'Data Scientist',
      'Machine Learning Engineer',
      'AI Engineer',
    ]
  },
  {
    category: 'Cloud & DevOps',
    roles: [
      'DevOps Engineer',
      'Cloud Engineer',
      'Cloud Support Engineer',
    ]
  },
  {
    category: 'Database Engineering',
    roles: [
      'Database Developer',
      'SQL Developer',
    ]
  },
  {
    category: 'Quality Assurance & Testing',
    roles: [
      'QA Engineer',
      'Automation Test Engineer',
      'Software Testing Engineer',
    ]
  },
  {
    category: 'Mobile Development',
    roles: [
      'Mobile App Developer',
      'Android Developer',
    ]
  },
  {
    category: 'Cybersecurity',
    roles: [
      'Cybersecurity Analyst',
    ]
  }
];

export type InterviewFocusOption = 'Balanced' | 'Technical Focus' | 'Skill Gap Focus' | 'Industry Demand Focus';
export type QuestionCountOption = 5 | 10 | 15 | 20;

export interface SelectQuestionsOptions {
  role: string;
  count: QuestionCountOption;
  difficulty: SkillLevel;
  interviewType: 'Technical Only' | 'HR Only' | 'Technical + HR';
  focus: InterviewFocusOption;
  studentSkills?: StudentSkill[];
  industrySkills?: IndustrySkill[];
  usedQuestionIds?: string[];
}

// Map difficulty string to SkillLevel
function mapDifficulty(d: string): SkillLevel {
  if (d === 'Easy') return 'Beginner';
  if (d === 'Intermediate') return 'Intermediate';
  return 'Advanced';
}

// Map category to InterviewQuestion category union
function mapCategory(cat: string, fmt: string): InterviewQuestion['category'] {
  if (fmt === 'behavioral') return 'Behavioral';
  if (fmt === 'scenario') return 'Scenario-based';
  if (cat.toLowerCase().includes('coding') || cat.toLowerCase().includes('algorithm')) return 'Coding';
  if (cat.toLowerCase().includes('project')) return 'Projects';
  if (cat.toLowerCase().includes('hr') || cat.toLowerCase().includes('culture')) return 'HR';
  if (cat.toLowerCase().includes('intro')) return 'Introduction';
  return 'Technical';
}

// Adaptive Question Selection Function
export function selectInterviewQuestions(options: SelectQuestionsOptions): InterviewQuestion[] {
  const { role, count, difficulty, interviewType, focus, studentSkills = [], industrySkills = [], usedQuestionIds = [] } = options;
  const bank = ROLE_QUESTION_BANKS[role] || ROLE_QUESTION_BANKS['Java Backend Developer'] || [];
  
  if (bank.length === 0) {
    return [];
  }

  // Claimed skills lookup set (lowercased)
  const claimedSkillsSet = new Set(studentSkills.map(s => s.name.toLowerCase()));

  // Industry high-demand skills lookup
  const highDemandSkills = new Set(
    industrySkills.filter(s => s.growthRate > 15 || s.jobOpenings > 5000).map(s => s.name.toLowerCase())
  );

  // Student skill gaps (skills with low score or in progress)
  const skillGapSet = new Set(
    studentSkills.filter(s => s.score < 70 || s.status === 'In Progress').map(s => s.name.toLowerCase())
  );

  // Partition candidates
  let candidates = [...bank];

  // Filter based on interview type
  if (interviewType === 'Technical Only') {
    const techCandidates = candidates.filter(q => q.format !== 'behavioral');
    if (techCandidates.length >= count) candidates = techCandidates;
  } else if (interviewType === 'HR Only') {
    const hrCandidates = candidates.filter(q => q.format === 'behavioral');
    if (hrCandidates.length >= count) candidates = hrCandidates;
  }

  // Avoid recently used questions if we have enough unused ones
  const unusedCandidates = candidates.filter(q => !usedQuestionIds.includes(q.id));
  if (unusedCandidates.length >= count) {
    candidates = unusedCandidates;
  }

  // Score candidate relevance based on selected focus
  const scored = candidates.map(q => {
    let weight = 10;
    const qSkillsLower = q.expectedSkills.map(s => s.toLowerCase());

    // Difficulty alignment
    const qDiff = mapDifficulty(q.difficulty);
    if (difficulty === 'Beginner') {
      if (qDiff === 'Beginner') weight += 8;
      else if (qDiff === 'Intermediate') weight += 4;
      else weight += 1;
    } else if (difficulty === 'Intermediate') {
      if (qDiff === 'Intermediate') weight += 8;
      else weight += 5;
    } else {
      if (qDiff === 'Advanced') weight += 8;
      else if (qDiff === 'Intermediate') weight += 5;
      else weight += 2;
    }

    // Focus alignment
    if (focus === 'Technical Focus') {
      if (q.format === 'technical' || q.format === 'practical') weight += 10;
    } else if (focus === 'Skill Gap Focus') {
      const hasGap = qSkillsLower.some(s => skillGapSet.has(s));
      if (hasGap) weight += 15;
    } else if (focus === 'Industry Demand Focus') {
      const hasDemand = qSkillsLower.some(s => highDemandSkills.has(s));
      if (hasDemand) weight += 15;
    }

    // Give claimed skills a natural touchpoint for verification
    const hasClaimed = qSkillsLower.some(s => claimedSkillsSet.has(s));
    if (hasClaimed) weight += 4;

    return { question: q, weight: weight + (Math.random() * 4) }; // slight jitter for freshness
  });

  // Sort by weight descending
  scored.sort((a, b) => b.weight - a.weight);

  // Take top N
  const selectedRaw = scored.slice(0, count).map(s => s.question);

  // If Technical + HR is requested, guarantee at least 1-2 behavioral/project questions
  if (interviewType === 'Technical + HR') {
    const hasBehavioral = selectedRaw.some(q => q.format === 'behavioral');
    if (!hasBehavioral) {
      const behavioralCandidate = bank.find(q => q.format === 'behavioral');
      if (behavioralCandidate && selectedRaw.length > 0) {
        selectedRaw[selectedRaw.length - 1] = behavioralCandidate;
      }
    }
  }

  // Progressive difficulty arrangement (easier first, ramp up, wrap up)
  selectedRaw.sort((a, b) => {
    const order: Record<string, number> = { Easy: 1, Intermediate: 2, Advanced: 3 };
    return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
  });

  // Transform into full InterviewQuestion objects compatible with MockInterview
  return selectedRaw.map(q => {
    const qSkillsLower = q.expectedSkills.map(s => s.toLowerCase());
    const isClaimedCheck = qSkillsLower.some(s => claimedSkillsSet.has(s));

    return {
      id: q.id,
      category: mapCategory(q.category, q.format),
      skillTested: q.expectedSkills[0] || q.category,
      difficulty: mapDifficulty(q.difficulty),
      question: q.question,
      idealAnswerKeyPoints: q.evaluationPoints,
      claimedSkillCheck: isClaimedCheck,
      role: q.role,
      format: q.format,
      expectedSkills: q.expectedSkills,
      evaluationPoints: q.evaluationPoints,
      followUpTopics: q.followUpTopics,
    };
  });
}

// LocalStorage helpers to track used question IDs
const USED_QUESTIONS_KEY_PREFIX = 'sih_used_questions_';

export function getUsedQuestionIds(role: string): string[] {
  try {
    const stored = localStorage.getItem(\`\${USED_QUESTIONS_KEY_PREFIX}\${role}\`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveUsedQuestionIds(role: string, newlyUsedIds: string[]): void {
  try {
    const existing = getUsedQuestionIds(role);
    const combined = Array.from(new Set([...existing, ...newlyUsedIds]));
    // Keep max 150 tracked to avoid infinite growth
    const capped = combined.slice(-150);
    localStorage.setItem(\`\${USED_QUESTIONS_KEY_PREFIX}\${role}\`, JSON.stringify(capped));
  } catch {
    // ignore storage errors
  }
}

// Interview History local storage helpers
const INTERVIEW_HISTORY_KEY = 'sih_interview_history';

export function getStoredInterviewHistory(): any[] {
  try {
    const data = localStorage.getItem(INTERVIEW_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function appendInterviewHistory(result: any): void {
  try {
    const history = getStoredInterviewHistory();
    const updated = [result, ...history.filter(h => h.id !== result.id)].slice(0, 10);
    localStorage.setItem(INTERVIEW_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore storage errors
  }
}
`;

fs.writeFileSync(targetFile, content, 'utf-8');
console.log('src/data/interviewQuestions/index.ts generated successfully.');
