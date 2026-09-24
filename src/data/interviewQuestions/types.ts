// Interview Question Bank — Types
// Used across all 28 role-specific question banks

export type QuestionDifficulty = 'Easy' | 'Intermediate' | 'Advanced';
export type QuestionFormat = 'technical' | 'behavioral' | 'scenario' | 'practical';

export interface RoleQuestion {
  id: string;
  role: string;
  category: string;
  difficulty: QuestionDifficulty;
  format: QuestionFormat;
  question: string;
  expectedSkills: string[];
  evaluationPoints: string[];
  followUpTopics: string[];
}
