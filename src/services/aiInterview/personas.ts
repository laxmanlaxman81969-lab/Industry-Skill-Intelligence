import { InterviewerPersona } from './types';

export const INTERVIEWER_PERSONAS: InterviewerPersona[] = [
  {
    id: 'dr-sarah-vance',
    name: 'Dr. Sarah Vance',
    title: 'Lead Technical Hiring Director',
    imageSrc: '/assets/interview/sarah_neutral.jpg',
    voiceGender: 'female',
    voicePitch: 1.18,
    voiceRate: 0.96,
    bio: '15+ years evaluating technical architecture, clean code practices, and system problem-solving in enterprise engineering.'
  },
  {
    id: 'david-chen',
    name: 'David Chen',
    title: 'Principal Systems Engineering Manager',
    imageSrc: '/assets/interview/david_neutral.jpg',
    voiceGender: 'male',
    voicePitch: 0.86,
    voiceRate: 0.94,
    bio: 'Specialized in distributed systems, real-time architectures, data engineering, and technical leadership interviews.'
  }
];

export const getDefaultInterviewerPersona = (id?: string): InterviewerPersona => {
  if (id) {
    const found = INTERVIEWER_PERSONAS.find((p) => p.id === id);
    if (found) return found;
  }
  return INTERVIEWER_PERSONAS[0];
};
