import { JobOpportunityRecord } from '../types';

export const SEED_OPPORTUNITIES: JobOpportunityRecord[] = [
  {
    id: 'job-001',
    companyId: 'cmp-001',
    companyName: 'ABC Technologies',
    title: 'Junior Java Backend Developer',
    role: 'Java Backend Developer',
    location: 'Bangalore (Hybrid)',
    type: 'Full-time',
    experience: '0-2 Years (Freshers Welcome)',
    package: '₹7.5 - ₹10.5 LPA',
    description: 'Join our Core Banking Microservices team. You will build high-concurrency Spring Boot REST services, optimize relational queries, and integrate with message brokers.',
    requiredSkills: [
      { skill: 'Java', level: 'Advanced', weight: 10 },
      { skill: 'Spring Boot', level: 'Intermediate', weight: 9 },
      { skill: 'SQL', level: 'Intermediate', weight: 8 },
      { skill: 'REST API', level: 'Intermediate', weight: 8 },
      { skill: 'JPA/Hibernate', level: 'Intermediate', weight: 7 },
      { skill: 'Git', level: 'Intermediate', weight: 6 }
    ],
    preferredSkills: ['Docker', 'Microservices', 'Redis', 'AWS'],
    responsibilities: [
      'Build high-concurrency Spring Boot REST services',
      'Optimize relational queries and database schema interactions',
      'Implement enterprise security and caching with Redis',
      'Collaborate on CI/CD pipeline deployments'
    ],
    educationRequirements: [
      'B.Tech / B.E. in Computer Science, Information Technology, or related technical disciplines'
    ],
    otherRequirements: [
      'Familiarity with Agile / Scrum methodologies',
      'Understanding of clean code principles and SOLID concepts'
    ],
    minReadinessScore: 65,
    postedDate: '2026-09-05',
    applicantsCount: 42
  },
  {
    id: 'job-002',
    companyId: 'cmp-002',
    companyName: 'NexaCore Systems',
    title: 'Associate Software Engineer (Full Stack)',
    role: 'Full Stack Developer',
    location: 'Pune (Onsite)',
    type: 'Full-time',
    experience: '0-1 Year',
    package: '₹8.0 - ₹12.0 LPA',
    description: 'Develop responsive client interfaces in React and robust transactional backend endpoints with Node or Java.',
    requiredSkills: [
      { skill: 'JavaScript (ES6+)', level: 'Advanced', weight: 9 },
      { skill: 'React.js', level: 'Intermediate', weight: 9 },
      { skill: 'Java', level: 'Intermediate', weight: 7 },
      { skill: 'SQL', level: 'Intermediate', weight: 7 },
      { skill: 'REST API', level: 'Intermediate', weight: 8 }
    ],
    preferredSkills: ['TypeScript', 'Node.js', 'Tailwind CSS', 'Docker'],
    responsibilities: [
      'Create reactive, accessible web applications using React',
      'Design RESTful web services in Java/Node.js',
      'Ensure cross-browser compatibility and responsive performance',
      'Participate in code reviews and test automation'
    ],
    educationRequirements: [
      'B.Tech / MCA / B.Sc in Computer Science, Software Engineering or equivalent'
    ],
    otherRequirements: [
      'Portfolio or GitHub showcasing interactive web applications'
    ],
    minReadinessScore: 70,
    postedDate: '2026-09-08',
    applicantsCount: 68
  },
  {
    id: 'job-003',
    companyId: 'cmp-003',
    companyName: 'CloudScale Labs',
    title: 'Junior Cloud & DevOps Engineer',
    role: 'Cloud / DevOps Engineer',
    location: 'Remote',
    type: 'Internship to Full-time',
    experience: 'Fresher',
    package: '₹40,000/mo Internship → ₹9 LPA',
    description: 'Automate CI/CD pipelines, package applications into Docker containers, and assist in monitoring Kubernetes clusters.',
    requiredSkills: [
      { skill: 'Docker', level: 'Intermediate', weight: 9 },
      { skill: 'AWS / Azure Cloud', level: 'Intermediate', weight: 8 },
      { skill: 'Git', level: 'Intermediate', weight: 8 },
      { skill: 'Linux', level: 'Intermediate', weight: 8 }
    ],
    preferredSkills: ['Kubernetes', 'Terraform', 'CI/CD', 'Python'],
    responsibilities: [
      'Containerize microservices using Docker',
      'Maintain automated build and test pipelines with GitHub Actions / GitLab CI',
      'Monitor application metrics, logs, and server health',
      'Support cloud infrastructure provisioning'
    ],
    educationRequirements: [
      'B.Tech / B.E. / BCA / MCA in Computer Science, IT, or related degree'
    ],
    otherRequirements: [
      'Hands-on comfort with Bash scripting and Linux terminal operations'
    ],
    minReadinessScore: 60,
    postedDate: '2026-09-10',
    applicantsCount: 29
  }
];
