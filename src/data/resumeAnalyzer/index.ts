import {
  StudentSkill,
  SkillLevel,
  IndustrySkill,
  ResumeAnalysisResult,
  ExtractedSkillItem,
  IndustrySkillComparison,
  SkillGapItem,
  ExtractedProject,
  ExtractedExperience,
  ExtractedEducation,
  ResumeQualityBreakdown,
  CareerReadinessBreakdown,
  AIRecommendation,
  CandidateContactInfo,
  GranularScoreBreakdown,
  VisualSkillMatrixRow,
  DetectedRoleSuggestion,
  TopSkillToDevelop,
  ResumeCompatibilityReport
} from '../../types';

// ============================================================================
// 1. ROLE REQUIREMENTS REPOSITORY (28 INDUSTRY ROLES)
// ============================================================================

export interface RoleSkillDef {
  skill: string;
  category: string;
  minLevel: 'Intermediate' | 'Advanced';
  weight: number; // 1-10
  importance: 'Critical' | 'High' | 'Medium';
  industryDemand: 'Critical' | 'High' | 'Growing' | 'Stable';
  demandScore: number;
  whyItMatters: string;
  keywords: string[];
}

export interface RoleRequirementConfig {
  role: string;
  category: string;
  skills: RoleSkillDef[];
  criticalKeywords: string[];
  defaultRoadmap: { stepNumber: number; title: string; skill: string; difficulty: string }[];
  recommendedAssignment: { id: string; title: string; skills: string[]; difficulty: string };
  interviewTopics: string[];
}

export const ROLE_REQUIREMENTS_MAP: Record<string, RoleRequirementConfig> = {
  'Java Backend Developer': {
    role: 'Java Backend Developer',
    category: 'Java Ecosystem',
    skills: [
      { skill: 'Java', category: 'Language', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 96, whyItMatters: 'Core foundation for enterprise backend services, concurrency, and OOP architecture.', keywords: ['java', 'jvm', 'multithreading', 'collections', 'streams', 'oop', 'java 8', 'java 17'] },
      { skill: 'Spring Boot', category: 'Backend', minLevel: 'Intermediate', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 94, whyItMatters: 'Primary microservice and REST API framework in enterprise Java backend stacks.', keywords: ['spring boot', 'spring-boot', 'spring framework', 'springboot', 'ioc', 'dependency injection', 'spring mvc'] },
      { skill: 'REST APIs', category: 'Backend', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 92, whyItMatters: 'Essential for service-to-service communication, HTTP verbs, status codes, and JSON serialization.', keywords: ['rest', 'restful', 'rest api', 'endpoints', 'json', 'http methods', 'postman', 'swagger', 'crud'] },
      { skill: 'SQL', category: 'Database', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'High', demandScore: 90, whyItMatters: 'Relational data query optimization, complex joins, transactions, and ACID guarantees.', keywords: ['sql', 'mysql', 'postgresql', 'joins', 'queries', 'rdbms', 'oracle', 'subqueries'] },
      { skill: 'JDBC', category: 'Backend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 86, whyItMatters: 'Low-level database connectivity, statement handling, and connection pooling.', keywords: ['jdbc', 'preparedstatement', 'connection pool', 'resultset', 'datasource'] },
      { skill: 'JPA / Hibernate', category: 'Backend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 88, whyItMatters: 'Object-Relational Mapping to eliminate boilerplate database access code.', keywords: ['jpa', 'hibernate', 'orm', 'entity', 'jpql', 'spring data', 'spring data jpa'] },
      { skill: 'Microservices', category: 'Backend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'Growing', demandScore: 86, whyItMatters: 'Distributed scalable system architecture for modern cloud backends.', keywords: ['microservice', 'microservices', 'distributed systems', 'eureka', 'api gateway', 'kafka', 'feign'] },
      { skill: 'Git', category: 'Tools', minLevel: 'Intermediate', weight: 7, importance: 'High', industryDemand: 'High', demandScore: 89, whyItMatters: 'Version control, branching strategies, code reviews, and collaboration standard.', keywords: ['git', 'github', 'gitlab', 'version control', 'pull request', 'merge'] },
      { skill: 'Backend Testing (JUnit/Mockito)', category: 'Tools', minLevel: 'Intermediate', weight: 7, importance: 'Medium', industryDemand: 'High', demandScore: 82, whyItMatters: 'Unit testing and mocking ensuring regression-free microservice deployments.', keywords: ['junit', 'mockito', 'unit testing', 'test case', 'tdd', 'test', 'mock'] },
      { skill: 'Docker', category: 'Cloud/DevOps', minLevel: 'Intermediate', weight: 6, importance: 'Medium', industryDemand: 'High', demandScore: 85, whyItMatters: 'Containerizing backend applications for consistent cloud deployments.', keywords: ['docker', 'container', 'dockerfile', 'compose', 'containerization'] }
    ],
    criticalKeywords: ['java', 'spring boot', 'rest api', 'sql', 'jpa', 'hibernate', 'microservices', 'maven', 'git', 'junit'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Java 17 & Concurrency Mastery', skill: 'Java', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'Relational Database Design & SQL Performance', skill: 'SQL', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Spring Boot RESTful Microservice Architecture', skill: 'Spring Boot', difficulty: 'Intermediate' },
      { stepNumber: 4, title: 'Enterprise Persistence with JPA & Hibernate', skill: 'JPA / Hibernate', difficulty: 'Intermediate' },
      { stepNumber: 5, title: 'Distributed Systems & Event-Driven Microservices', skill: 'Microservices', difficulty: 'Advanced' }
    ],
    recommendedAssignment: { id: 'asg-01', title: 'Build a Spring Boot E-Commerce REST API with JWT Auth', skills: ['Spring Boot', 'REST APIs', 'SQL', 'JPA / Hibernate'], difficulty: 'Intermediate' },
    interviewTopics: ['Java Collections & Memory Model', 'Spring Boot Dependency Injection', 'REST API Idempotency & Status Codes', 'SQL Indexes & Normalization', 'Hibernate N+1 Query Problem']
  },

  'Java Full Stack Developer': {
    role: 'Java Full Stack Developer',
    category: 'Java Ecosystem',
    skills: [
      { skill: 'Java', category: 'Language', minLevel: 'Advanced', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 95, whyItMatters: 'Core backend development language.', keywords: ['java', 'jvm', 'oop', 'collections'] },
      { skill: 'Spring Boot', category: 'Backend', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 93, whyItMatters: 'Backend API service creation.', keywords: ['spring boot', 'springboot', 'spring'] },
      { skill: 'React.js', category: 'Frontend', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 92, whyItMatters: 'Frontend single page application UI framework.', keywords: ['react', 'react.js', 'reactjs', 'jsx', 'hooks'] },
      { skill: 'JavaScript / TypeScript', category: 'Language', minLevel: 'Intermediate', weight: 8, importance: 'Critical', industryDemand: 'Critical', demandScore: 94, whyItMatters: 'Web client-side scripting language.', keywords: ['javascript', 'typescript', 'es6', 'js', 'ts'] },
      { skill: 'SQL', category: 'Database', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 90, whyItMatters: 'Database CRUD and data modeling.', keywords: ['sql', 'mysql', 'postgresql'] },
      { skill: 'REST APIs', category: 'Backend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 91, whyItMatters: 'Integration contract between React and Spring Boot.', keywords: ['rest', 'rest api', 'json', 'axios', 'fetch'] },
      { skill: 'HTML & CSS', category: 'Frontend', minLevel: 'Intermediate', weight: 7, importance: 'Medium', industryDemand: 'High', demandScore: 88, whyItMatters: 'Web structuring, styling, and responsive design.', keywords: ['html', 'css', 'tailwind', 'bootstrap'] },
      { skill: 'Git', category: 'Tools', minLevel: 'Intermediate', weight: 6, importance: 'Medium', industryDemand: 'High', demandScore: 89, whyItMatters: 'Full-stack repository version management.', keywords: ['git', 'github'] }
    ],
    criticalKeywords: ['java', 'spring boot', 'react', 'javascript', 'typescript', 'sql', 'rest api', 'html', 'css', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Full Stack Java & Spring Boot API Core', skill: 'Spring Boot', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'React 18 Component State & Hooks Architecture', skill: 'React.js', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Secure Full-Stack Integration (JWT & CORS)', skill: 'REST APIs', difficulty: 'Intermediate' }
    ],
    recommendedAssignment: { id: 'asg-02', title: 'Full Stack Task Dashboard with Spring Boot & React', skills: ['Java', 'Spring Boot', 'React.js', 'SQL'], difficulty: 'Intermediate' },
    interviewTopics: ['Spring Boot Backend with React Frontend Integration', 'State Management & Async Data Fetching', 'CORS & JWT Authentication', 'SQL Relationships & JPA Entities']
  },

  'Full Stack Developer': {
    role: 'Full Stack Developer',
    category: 'Full Stack',
    skills: [
      { skill: 'JavaScript / TypeScript', category: 'Language', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 95, whyItMatters: 'Primary language across client and server tiers.', keywords: ['javascript', 'typescript', 'es6', 'node.js', 'node'] },
      { skill: 'React.js', category: 'Frontend', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 93, whyItMatters: 'Building dynamic interactive browser interfaces.', keywords: ['react', 'react.js', 'redux', 'hooks'] },
      { skill: 'Node.js / Express', category: 'Backend', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 91, whyItMatters: 'Asynchronous event-driven web backend server.', keywords: ['node.js', 'node', 'express', 'express.js', 'nest.js'] },
      { skill: 'SQL / NoSQL', category: 'Database', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 89, whyItMatters: 'Data persistence and query optimization.', keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'mongoose'] },
      { skill: 'REST APIs', category: 'Backend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 92, whyItMatters: 'Client-server data contract and JSON serialization.', keywords: ['rest', 'rest api', 'crud', 'graphql'] },
      { skill: 'HTML & CSS', category: 'Frontend', minLevel: 'Intermediate', weight: 7, importance: 'Medium', industryDemand: 'High', demandScore: 88, whyItMatters: 'Semantic markup and responsive layouts.', keywords: ['html', 'css', 'tailwind', 'flexbox'] },
      { skill: 'Git', category: 'Tools', minLevel: 'Intermediate', weight: 7, importance: 'Medium', industryDemand: 'High', demandScore: 89, whyItMatters: 'Version control and collaborative workflow.', keywords: ['git', 'github'] }
    ],
    criticalKeywords: ['javascript', 'typescript', 'react', 'node.js', 'express', 'sql', 'mongodb', 'rest api', 'html', 'css'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Modern JavaScript (ES6+) & TypeScript', skill: 'JavaScript / TypeScript', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'React Single Page App Engineering', skill: 'React.js', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Node.js & Express RESTful Microservices', skill: 'Node.js / Express', difficulty: 'Intermediate' }
    ],
    recommendedAssignment: { id: 'asg-03', title: 'MERN Stack Real-time Collaborative Board', skills: ['React.js', 'Node.js', 'MongoDB', 'REST APIs'], difficulty: 'Intermediate' },
    interviewTopics: ['Event Loop in Node.js vs Browser', 'React Virtual DOM & Reconciliation', 'JWT Session Management & Cookies', 'SQL vs NoSQL Trade-offs']
  },

  'React Developer': {
    role: 'React Developer',
    category: 'Frontend & UI',
    skills: [
      { skill: 'React.js & Hooks', category: 'Frontend', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 96, whyItMatters: 'Deep mastery of useState, useEffect, useMemo, useCallback, useRef, custom hooks.', keywords: ['react', 'react.js', 'hooks', 'jsx', 'usestate', 'useeffect', 'usememo'] },
      { skill: 'TypeScript', category: 'Language', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 93, whyItMatters: 'Strict typing for component props, states, and API responses.', keywords: ['typescript', 'ts', 'interfaces', 'types', 'generics'] },
      { skill: 'State Management (Redux/Zustand)', category: 'Frontend', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'High', demandScore: 90, whyItMatters: 'Predictable centralized global state architectures.', keywords: ['redux', 'redux toolkit', 'zustand', 'context api', 'recoil'] },
      { skill: 'HTML5 & CSS / Tailwind', category: 'Frontend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 89, whyItMatters: 'Responsive UI layouts and modular styling.', keywords: ['html', 'css', 'tailwind', 'styled-components'] },
      { skill: 'Routing & API Fetching', category: 'Frontend', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 88, whyItMatters: 'React Router v6, TanStack React Query, Axios.', keywords: ['react router', 'react query', 'axios', 'fetch', 'rest'] },
      { skill: 'Testing (Jest/RTL)', category: 'Tools', minLevel: 'Intermediate', weight: 6, importance: 'Medium', industryDemand: 'High', demandScore: 82, whyItMatters: 'Unit testing component rendering and event handlers.', keywords: ['jest', 'react testing library', 'rtl', 'unit testing'] }
    ],
    criticalKeywords: ['react', 'hooks', 'typescript', 'redux', 'tailwind', 'javascript', 'react router', 'jest'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Mastering React 18 Concurrent Rendering & Hooks', skill: 'React.js & Hooks', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'TypeScript for React Enterprise Applications', skill: 'TypeScript', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Global State Management with Redux Toolkit & Zustand', skill: 'State Management', difficulty: 'Intermediate' }
    ],
    recommendedAssignment: { id: 'asg-08', title: 'Interactive Kanban Board with React 18 & Drag and Drop', skills: ['React.js', 'TypeScript', 'State Management'], difficulty: 'Intermediate' },
    interviewTopics: ['React Component Lifecycle vs useEffect Cleanup', 'useMemo vs useCallback: When and Why to Use', 'Redux Toolkit Data Flow & Slices', 'Controlled vs Uncontrolled Components']
  },

  'Data Analyst': {
    role: 'Data Analyst',
    category: 'Data & Analytics',
    skills: [
      { skill: 'SQL', category: 'Database', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 96, whyItMatters: 'Complex queries, window functions, CTEs, joins, and aggregations.', keywords: ['sql', 'mysql', 'postgresql', 'window functions', 'cte', 'joins', 'group by'] },
      { skill: 'Python (Pandas & NumPy)', category: 'Data & AI', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 92, whyItMatters: 'Data manipulation, cleaning, preprocessing, and exploratory data analysis.', keywords: ['python', 'pandas', 'numpy', 'eda', 'data cleaning', 'jupyter'] },
      { skill: 'Data Visualization (Power BI / Tableau)', category: 'Data & AI', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 91, whyItMatters: 'Building executive dashboards, KPI cards, and interactive charts.', keywords: ['power bi', 'powerbi', 'tableau', 'matplotlib', 'seaborn', 'visualization', 'dashboards'] },
      { skill: 'Excel & Statistical Analysis', category: 'Data & AI', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 88, whyItMatters: 'VLOOKUP, Pivot Tables, distributions, correlation, and hypothesis testing.', keywords: ['excel', 'pivot table', 'vlookup', 'statistics', 'hypothesis testing', 'metrics'] },
      { skill: 'Business Metrics & KPIs', category: 'Data & AI', minLevel: 'Intermediate', weight: 7, importance: 'High', industryDemand: 'High', demandScore: 85, whyItMatters: 'Translating raw numbers into actionable business insights.', keywords: ['kpi', 'metrics', 'business analysis', 'reporting', 'insights', 'roi'] }
    ],
    criticalKeywords: ['sql', 'python', 'pandas', 'power bi', 'tableau', 'excel', 'statistics', 'data analysis', 'dashboards'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Advanced SQL for Analytics: Window Functions & CTEs', skill: 'SQL', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'Python Data Wrangling with Pandas & NumPy', skill: 'Python (Pandas & NumPy)', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Interactive Business Dashboarding in Power BI', skill: 'Data Visualization', difficulty: 'Intermediate' }
    ],
    recommendedAssignment: { id: 'asg-09', title: 'Customer Churn Analysis & Executive KPI Dashboard', skills: ['SQL', 'Python', 'Power BI'], difficulty: 'Intermediate' },
    interviewTopics: ['SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK)', 'Handling Missing Values & Outliers in Pandas', 'Measuring A/B Testing Statistical Significance', 'Designing Actionable Business KPIs']
  },

  'DevOps Engineer': {
    role: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    skills: [
      { skill: 'Docker & Containerization', category: 'Cloud/DevOps', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 96, whyItMatters: 'Multi-stage builds, volume management, networking, and layer caching.', keywords: ['docker', 'container', 'dockerfile', 'compose', 'containers'] },
      { skill: 'Kubernetes (K8s)', category: 'Cloud/DevOps', minLevel: 'Intermediate', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 95, whyItMatters: 'Pod orchestration, deployments, services, ingress, HPA, and configmaps.', keywords: ['kubernetes', 'k8s', 'kubectl', 'helm', 'ingress', 'pods'] },
      { skill: 'CI/CD Pipelines (GitHub Actions/Jenkins)', category: 'Cloud/DevOps', minLevel: 'Advanced', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 94, whyItMatters: 'Automating build, test, security scans, and blue-green deployments.', keywords: ['ci/cd', 'github actions', 'jenkins', 'pipeline', 'gitlab ci'] },
      { skill: 'Infrastructure as Code (Terraform)', category: 'Cloud/DevOps', minLevel: 'Intermediate', weight: 9, importance: 'Critical', industryDemand: 'High', demandScore: 91, whyItMatters: 'Declarative cloud provisioning and state management.', keywords: ['terraform', 'iac', 'ansible', 'cloudformation'] },
      { skill: 'Linux & Shell Scripting', category: 'Tools', minLevel: 'Advanced', weight: 8, importance: 'Critical', industryDemand: 'High', demandScore: 92, whyItMatters: 'Process management, permissions, systemd, bash automation.', keywords: ['linux', 'bash', 'shell', 'ubuntu', 'cron', 'systemd'] }
    ],
    criticalKeywords: ['docker', 'kubernetes', 'ci/cd', 'terraform', 'linux', 'aws', 'github actions', 'jenkins'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Docker Multi-Stage Optimization & Security', skill: 'Docker & Containerization', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'Kubernetes Production Orchestration & Scaling', skill: 'Kubernetes', difficulty: 'Advanced' },
      { stepNumber: 3, title: 'Declarative Cloud Provisioning with Terraform', skill: 'Infrastructure as Code', difficulty: 'Intermediate' }
    ],
    recommendedAssignment: { id: 'asg-13', title: 'Automate Microservice CI/CD Deployment to Kubernetes with GitHub Actions', skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'], difficulty: 'Intermediate' },
    interviewTopics: ['Kubernetes Pod Lifecycle & CrashLoopBackOff Troubleshooting', 'Zero-Downtime Blue/Green vs Canary Deployments', 'Terraform State Locking & Drift Detection', 'Docker Layer Caching & Image Size Optimization']
  },

  'AI Engineer': {
    role: 'AI Engineer',
    category: 'Data & AI',
    skills: [
      { skill: 'LLMs & Prompt Engineering', category: 'Data & AI', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 97, whyItMatters: 'System prompts, few-shot reasoning, temperature, token limits, and fine-tuning.', keywords: ['llm', 'large language models', 'gpt', 'llama', 'openai', 'prompt engineering', 'genai'] },
      { skill: 'RAG & Vector Databases', category: 'Data & AI', minLevel: 'Advanced', weight: 10, importance: 'Critical', industryDemand: 'Critical', demandScore: 96, whyItMatters: 'Retrieval Augmented Generation, embeddings, FAISS, Pinecone, Chroma.', keywords: ['rag', 'vector database', 'embeddings', 'pinecone', 'chroma', 'langchain', 'llamaindex'] },
      { skill: 'Python & AI Frameworks (LangChain/LlamaIndex)', category: 'Data & AI', minLevel: 'Advanced', weight: 9, importance: 'Critical', industryDemand: 'Critical', demandScore: 95, whyItMatters: 'Building autonomous agents, tool calling, and structured output parsing.', keywords: ['python', 'langchain', 'llamaindex', 'fastapi', 'huggingface'] },
      { skill: 'AI Evaluation & Guardrails', category: 'Security', minLevel: 'Intermediate', weight: 8, importance: 'High', industryDemand: 'High', demandScore: 89, whyItMatters: 'Mitigating hallucinations, prompt injection safety, and output validation.', keywords: ['guardrails', 'hallucination', 'evaluation', 'ragas', 'safety'] }
    ],
    criticalKeywords: ['llm', 'rag', 'vector database', 'langchain', 'python', 'embeddings', 'openai', 'prompt engineering'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Enterprise RAG Architecture & Vector Indexing', skill: 'RAG & Vector Databases', difficulty: 'Advanced' },
      { stepNumber: 2, title: 'Building Autonomous AI Agents with LangChain & Tools', skill: 'Python & AI Frameworks', difficulty: 'Advanced' }
    ],
    recommendedAssignment: { id: 'asg-12', title: 'Enterprise Document Q&A RAG Pipeline with Semantic Search', skills: ['Python', 'LangChain', 'Vector DB', 'RAG'], difficulty: 'Advanced' },
    interviewTopics: ['Chunking Strategies and Semantic Search Cosine Similarity', 'Mitigating Hallucinations with RAG Re-ranking', 'Prompt Injection Prevention and Defense', 'Evaluation Metrics for Generative RAG Systems']
  }
};

export function getRoleRequirements(roleName: string): RoleRequirementConfig {
  if (ROLE_REQUIREMENTS_MAP[roleName]) {
    return ROLE_REQUIREMENTS_MAP[roleName];
  }
  return ROLE_REQUIREMENTS_MAP['Java Backend Developer'];
}

// ============================================================================
// 2. REALISTIC SAMPLE RESUMES
// ============================================================================

export interface SampleResume {
  id: string;
  name: string;
  role: string;
  fileName: string;
  fileSize: string;
  rawText: string;
}

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: 'sample-java',
    name: 'Lakshman Reddy (Java Backend Focus)',
    role: 'Java Backend Developer',
    fileName: 'Lakshman_Resume_Java_Backend.pdf',
    fileSize: '1.8 MB',
    rawText: `N. LAKSHMAN REDDY
Email: lakshman@skillplatform.edu | Phone: +91 98765 43210 | Bengaluru, India
GitHub: github.com/lakshman-dev | LinkedIn: linkedin.com/in/lakshman-reddy

EDUCATION
Apex Institute of Technology, Bengaluru
Bachelor of Technology in Computer Science & Engineering | CGPA: 8.4 / 10.0 (2022 - 2026)
Relevant Coursework: Object-Oriented Programming, Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks.

TECHNICAL SKILLS
- Programming Languages: Java (Core Java, Collections Framework, Multithreading, Streams API, Lambda Expressions), SQL, Basics of Python
- Backend Frameworks & Technologies: Spring Boot, JDBC, RESTful Web Services, Maven, Hibernate basics
- Databases & Storage: MySQL, PostgreSQL, Relational Schema Design, Normalization, SQL Joins & Subqueries
- Tools & Version Control: Git, GitHub, Postman API Client, IntelliJ IDEA, Eclipse, JIRA

PROJECTS
1. Enterprise Employee & Payroll Management System
- Architected and implemented a backend service using Java, Spring Boot, and MySQL to manage employee records, salaries, and department hierarchy.
- Designed 12+ RESTful endpoints adhering to HTTP standards with validation and structured error response handling.
- Integrated JDBC database connection pooling, reducing query execution overhead by 30%.
- Utilized Git for version control and Postman to write automated API test scripts.

2. CLI Banking & Transaction Simulator
- Built an object-oriented command-line banking simulation using Core Java, Collections (HashMap, ArrayList), and Exception Handling.
- Implemented ACID-compliant transaction records and file I/O persistence for account history.
- Applied SOLID principles and modular package architecture to ensure clean code maintenance.

3. Student Result Portal Web Application
- Created a student grade reporting system using HTML, CSS, JavaScript, and Java Servlets with MySQL backend.
- Formulated SQL queries with inner and outer joins to aggregate semester CGPA data for 500+ student records.

EXPERIENCE & INTERNSHIPS
Software Engineering Intern (Summer 2025) | TechInnovate Solutions
- Collaborated with senior engineers to build internal REST microservices in Java and Spring Boot.
- Fixed 15+ backend bugs related to SQL query timeouts and data validation.
- Participated in Agile sprint planning, daily standups, and Git peer code reviews.

CERTIFICATIONS
- Oracle Certified Associate: Java SE 8 Programmer
- HackerRank SQL Advanced Certificate`
  },
  {
    id: 'sample-data',
    name: 'Priya Sharma (Data Analyst Focus)',
    role: 'Data Analyst',
    fileName: 'Priya_Sharma_Data_Analyst.pdf',
    fileSize: '2.1 MB',
    rawText: `PRIYA SHARMA
Email: priya.sharma@analytics.edu | Phone: +91 91234 56789 | Hyderabad, India
Portfolio: priyasharma-analytics.com | LinkedIn: linkedin.com/in/priya-analytics

EDUCATION
National Institute of Technology, Warangal
Bachelor of Technology in Information Technology | CGPA: 8.7 / 10.0 (2022 - 2026)
Coursework: Probability & Statistics, Data Warehousing, Database Systems, Business Intelligence.

TECHNICAL SKILLS
- Query Languages & Databases: SQL (PostgreSQL, MySQL, SQL Server), Advanced SQL (Window Functions, CTEs, Aggregations, Joins)
- Data Analysis & Programming: Python (Pandas, NumPy, SciPy), Exploratory Data Analysis (EDA), Data Cleaning
- Visualization & BI Tools: Power BI (DAX, Interactive Dashboards, Power Query), Tableau, Matplotlib, Seaborn
- Spreadsheet & Analysis: Microsoft Excel (VLOOKUP, XLOOKUP, Pivot Tables, Statistical Modeling), Google Sheets

PROJECTS
1. E-Commerce Customer Churn & Retention Dashboard
- Analyzed 250,000+ customer transaction rows using SQL queries (CTEs, Window Functions, Partitioning) to identify churn indicators.
- Built an interactive Power BI dashboard with dynamic DAX measures tracking Customer Lifetime Value (CLV) and Monthly Recurring Revenue (MRR).
- Cleaned and preprocessed customer demographic data using Python Pandas (handling missing values, encoding categorical features).

2. Healthcare Patient Readmission Predictive Analysis
- Developed an analytical Python pipeline using Pandas and Seaborn to visualize correlation between patient age, diagnosis, and 30-day readmissions.
- Formulated statistical hypothesis testing (Chi-square test, p-value calculations) providing actionable insights for hospital administrators.

CERTIFICATIONS & ACHIEVEMENTS
- Microsoft Certified: Power BI Data Analyst Associate (PL-300)
- Google Data Analytics Professional Certificate`
  },
  {
    id: 'sample-frontend',
    name: 'Rahul Verma (React & Frontend Focus)',
    role: 'React Developer',
    fileName: 'Rahul_Verma_Frontend_Resume.docx',
    fileSize: '1.4 MB',
    rawText: `RAHUL VERMA
Email: rahul.verma@frontend.io | Phone: +91 97890 12345 | Pune, India
GitHub: github.com/rahulv-ui | Portfolio: rahulverma.dev

EDUCATION
Pune Institute of Computer Technology
B.E. in Computer Engineering | First Class with Distinction (2022 - 2026)

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS
- Frontend Libraries & Frameworks: React.js (Hooks, Context API, Virtual DOM), Next.js, Redux Toolkit, Tailwind CSS
- Tooling & Environment: Vite, Webpack, npm, Git, GitHub, Jest basics, Figma to Code

PROJECTS
1. Collaborative Kanban Task Management SaaS
- Engineered a responsive drag-and-drop task management board using React 18, TypeScript, and Tailwind CSS.
- Implemented global state management using Redux Toolkit for seamless column transitions and optimistic UI updates.
- Integrated REST API endpoints via Axios with error handling and loading skeletons.

2. Modern E-Commerce Storefront with Product Filtering
- Built a mobile-first single page web app using React, React Router v6, and Tailwind CSS.
- Designed complex filtering and pagination state hooks supporting multi-category facet search.
- Achieved a 95+ Google Lighthouse performance score by implementing lazy loading and code splitting.

EXPERIENCE
Frontend Web Developer Intern (Jan 2026 - Present) | DigitalCraft Agency
- Converted 8+ complex Figma design files into pixel-perfect, accessible React components.
- Refactored legacy JavaScript codebases to strict TypeScript interfaces.`
  },
  {
    id: 'sample-ai',
    name: 'Ananya Gupta (AI & Machine Learning Focus)',
    role: 'AI Engineer',
    fileName: 'Ananya_Gupta_AI_Engineer.pdf',
    fileSize: '2.4 MB',
    rawText: `ANANYA GUPTA
Email: ananya.ai@research.edu | Phone: +91 94567 89012 | Delhi, India
GitHub: github.com/ananya-ai | HuggingFace: huggingface.co/ananya-g

EDUCATION
Delhi Technological University
B.Tech in Mathematics and Computing | CGPA: 9.1 / 10.0 (2022 - 2026)

TECHNICAL SKILLS
- AI & Machine Learning: Large Language Models (LLMs), Generative AI, RAG (Retrieval Augmented Generation), Transformers, PyTorch, Scikit-Learn
- Vector Databases & Frameworks: LangChain, LlamaIndex, ChromaDB, FAISS, Pinecone, OpenAI API, HuggingFace Transformers
- Programming & Backend: Python (Advanced), FastAPI, Docker basics, NumPy, Pandas
- Data & Tools: Git, Jupyter, Linux, SQL

PROJECTS
1. Multi-Document Enterprise RAG Research Assistant
- Implemented a production RAG pipeline using LangChain, OpenAI embeddings, and ChromaDB vector store.
- Built custom text chunking and re-ranking algorithms that improved answer retrieval accuracy by 25%.
- Exposed API endpoints using FastAPI with token streaming support.

2. Automated Code Reviewer using Local LLMs (LLaMA 3)
- Fine-tuned open-source LLaMA 3 model using PyTorch and LoRA techniques for code vulnerability detection.
- Developed prompt engineering templates incorporating chain-of-thought verification.`
  },
  {
    id: 'sample-devops',
    name: 'Vikram Mehta (DevOps & Cloud Focus)',
    role: 'DevOps Engineer',
    fileName: 'Vikram_Mehta_DevOps.pdf',
    fileSize: '1.9 MB',
    rawText: `VIKRAM MEHTA
Email: vikram.mehta@cloudops.net | Phone: +91 93456 78901 | Chennai, India
GitHub: github.com/vikram-devops | LinkedIn: linkedin.com/in/vikram-devops

EDUCATION
Anna University, Chennai
B.Tech in Information Technology (2022 - 2026)

TECHNICAL SKILLS
- Cloud Platforms: Amazon Web Services (AWS - EC2, S3, VPC, IAM, RDS, Route53, CloudWatch)
- Containerization & Orchestration: Docker (Multi-stage builds, Compose), Kubernetes (Pods, Deployments, Services, Ingress)
- CI/CD & Automation: GitHub Actions, Jenkins, Git, Bash Shell Scripting, Linux (Ubuntu/Debian)
- Infrastructure as Code: Terraform basics, Ansible basics

PROJECTS
1. Automated Microservice CI/CD & Kubernetes Deployment Pipeline
- Built an automated GitHub Actions workflow to build, test, and containerize Docker images for a 3-tier web service.
- Deployed workloads to a multi-node Kubernetes cluster with ingress routing and horizontal pod autoscaling (HPA).

2. Cloud Infrastructure Automation with Terraform
- Provisioned AWS VPC with public and private subnets, NAT gateways, and security groups using declarative Terraform configurations.`
  }
];

// ============================================================================
// 3. TARGET ROLE DETECTION ENGINE
// ============================================================================

export function detectTargetRoleFromText(text: string): DetectedRoleSuggestion {
  const lower = text.toLowerCase();
  const scores: { role: string; score: number; keywords: string[] }[] = [];

  Object.values(ROLE_REQUIREMENTS_MAP).forEach((rc) => {
    let matchCount = 0;
    const matched: string[] = [];

    rc.criticalKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lower)) {
        matchCount++;
        matched.push(kw);
      }
    });

    // Bonus if role title itself appears in text
    if (lower.includes(rc.role.toLowerCase())) {
      matchCount += 3;
    }

    const confidence = Math.min(95, Math.round((matchCount / Math.max(1, rc.criticalKeywords.length)) * 100));
    scores.push({
      role: rc.role,
      score: confidence,
      keywords: matched
    });
  });

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0] || { role: 'Java Backend Developer', score: 75, keywords: [] };
  const alternatives = scores.slice(1, 4).map(s => ({ role: s.role, confidence: s.score }));

  return {
    detectedRole: best.role,
    confidence: Math.max(60, best.score),
    matchedKeywords: best.keywords,
    alternativeRoles: alternatives
  };
}

// ============================================================================
// 4. CANDIDATE INFO & SECTION PARSER
// ============================================================================

export function extractCandidateInfo(text: string): CandidateContactInfo {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const rawFirstLines = lines.slice(0, 5).join(' ');

  // Extract Name (usually first line with letters)
  let name = 'Not detected in resume';
  for (const line of lines.slice(0, 3)) {
    if (line.length > 2 && line.length < 40 && !/@|phone|email|http|github|linkedin/i.test(line)) {
      name = line.replace(/^(?:resume|curriculum vitae|cv)\s*[-:]*\s*/i, '').trim();
      break;
    }
  }

  // Extract Email
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : 'Not detected in resume';

  // Extract Phone
  const phoneMatch = text.match(/(?:\+91[\s-]?)?[6-9]\d{9}|\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : 'Not detected in resume';

  // Extract Location
  const locMatch = rawFirstLines.match(/(?:Bengaluru|Bangalore|Hyderabad|Pune|Delhi|Mumbai|Chennai|Kolkata|India|USA|Remote)/i);
  const location = locMatch ? locMatch[0] : 'Bengaluru, India';

  // Extract GitHub / LinkedIn
  const gitMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i);
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);

  return {
    name,
    email,
    phone,
    location,
    github: gitMatch ? gitMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined
  };
}

// ============================================================================
// 5. MAIN RESUME ANALYSIS ENGINE
// ============================================================================

export function analyzeResume(
  fileMeta: { name: string; size: string; text?: string },
  targetRole: string,
  existingStudentSkills: StudentSkill[] = [],
  industrySkills: IndustrySkill[] = []
): ResumeAnalysisResult {
  const roleConfig = getRoleRequirements(targetRole);
  const resumeText = (fileMeta.text || '').trim();
  const lowerText = resumeText.toLowerCase();

  // 1. Candidate Info & Role Suggestion
  const candidateInfo = extractCandidateInfo(resumeText);
  const detectedRoleSuggestion = detectTargetRoleFromText(resumeText);

  // 2. Extract Skills with Evidence
  const extractedSkills: ExtractedSkillItem[] = [];
  const visualSkillMatrix: VisualSkillMatrixRow[] = [];

  roleConfig.skills.forEach((reqSkill) => {
    let occurrences = 0;
    const matchingSnippets: string[] = [];

    reqSkill.keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\$&')}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) occurrences += matches.length;
    });

    if (occurrences > 0 && resumeText.length > 0) {
      const sentences = resumeText.split(/[.\n\r•]+/);
      for (const sentence of sentences) {
        const trimmed = sentence.trim();
        if (trimmed.length > 15 && trimmed.length < 250) {
          const matchedKw = reqSkill.keywords.some((kw) =>
            new RegExp(`\\b${kw.replace(/[+]/g, '\\+')}\\b`, 'i').test(trimmed)
          );
          if (matchedKw && !matchingSnippets.includes(trimmed)) {
            matchingSnippets.push(trimmed);
            if (matchingSnippets.length >= 2) break;
          }
        }
      }
    }

    let level: 'Not Detected' | 'Beginner' | 'Intermediate' | 'Advanced' = 'Not Detected';
    let evidenceQuality: 'Strong Evidence' | 'Moderate Evidence' | 'Weak Evidence' | 'Mentioned Only' | 'Not Detected' = 'Not Detected';
    let evidenceSnippet = '';
    let confidence = 0;

    const hasStrongActionVerbs = matchingSnippets.some(s => /architected|implemented|built|engineered|developed|designed|integrated|optimized/i.test(s));

    if (occurrences === 0) {
      level = 'Not Detected';
      evidenceQuality = 'Not Detected';
      confidence = 10;
      evidenceSnippet = `No explicit mentions, projects, or implementation context found for ${reqSkill.skill}.`;
    } else if (occurrences >= 4 || (occurrences >= 2 && hasStrongActionVerbs)) {
      level = 'Advanced';
      evidenceQuality = 'Strong Evidence';
      confidence = 88 + Math.min(10, occurrences);
      evidenceSnippet = matchingSnippets[0]
        ? `"${matchingSnippets[0]}"`
        : `Demonstrated across multiple projects and core technical skills (${occurrences} occurrences).`;
    } else if (occurrences >= 2 || (matchingSnippets.length >= 1 && hasStrongActionVerbs)) {
      level = 'Intermediate';
      evidenceQuality = 'Moderate Evidence';
      confidence = 72 + Math.min(15, occurrences * 4);
      evidenceSnippet = matchingSnippets[0]
        ? `"${matchingSnippets[0]}"`
        : `Found ${occurrences} relevant mentions in project descriptions and technology toolkits.`;
    } else if (occurrences === 1 && matchingSnippets.length > 0) {
      level = 'Beginner';
      evidenceQuality = 'Weak Evidence';
      confidence = 55;
      evidenceSnippet = `"${matchingSnippets[0]}"`;
    } else {
      level = 'Beginner';
      evidenceQuality = 'Mentioned Only';
      confidence = 45;
      evidenceSnippet = `Mentioned in skills summary list (${occurrences} mention).`;
    }

    extractedSkills.push({
      name: reqSkill.skill,
      category: reqSkill.category,
      level,
      evidence: evidenceSnippet,
      confidence,
      occurrences
    });

    // Determine Gap Status & Priority Score
    let gapStatus: 'Strong' | 'Matched' | 'Low Gap' | 'Medium Gap' | 'High Gap' | 'Critical Gap' = 'Medium Gap';
    let priorityScore = 50;

    if (level === 'Advanced') {
      gapStatus = 'Strong';
      priorityScore = 15;
    } else if (level === 'Intermediate') {
      gapStatus = reqSkill.minLevel === 'Advanced' ? 'Low Gap' : 'Matched';
      priorityScore = reqSkill.minLevel === 'Advanced' ? 55 : 25;
    } else if (level === 'Beginner') {
      gapStatus = reqSkill.importance === 'Critical' ? 'High Gap' : 'Medium Gap';
      priorityScore = reqSkill.importance === 'Critical' ? 88 : 65;
    } else {
      // Not Detected
      gapStatus = reqSkill.importance === 'Critical' ? 'Critical Gap' : 'High Gap';
      priorityScore = reqSkill.importance === 'Critical' ? 95 : 78;
    }

    visualSkillMatrix.push({
      skill: reqSkill.skill,
      category: reqSkill.category,
      evidenceQuality,
      evidenceSnippet,
      currentLevel: level,
      requiredLevel: reqSkill.minLevel,
      industryDemand: `${reqSkill.industryDemand} Demand`,
      demandScore: reqSkill.demandScore,
      gapStatus,
      priorityScore
    });
  });

  // Also include general technical skills present
  const generalSkillDict = [
    { name: 'Python', category: 'Language', keywords: ['python', 'pandas', 'numpy'] },
    { name: 'JavaScript', category: 'Language', keywords: ['javascript', 'js', 'es6'] },
    { name: 'TypeScript', category: 'Language', keywords: ['typescript', 'ts'] },
    { name: 'HTML & CSS', category: 'Frontend', keywords: ['html', 'css', 'tailwind', 'bootstrap'] },
    { name: 'React.js', category: 'Frontend', keywords: ['react', 'react.js', 'redux'] },
    { name: 'SQL', category: 'Database', keywords: ['sql', 'mysql', 'postgresql'] },
    { name: 'Git', category: 'Tools', keywords: ['git', 'github'] },
    { name: 'Docker', category: 'Cloud/DevOps', keywords: ['docker', 'container'] },
    { name: 'AWS Cloud', category: 'Cloud/DevOps', keywords: ['aws', 'ec2', 's3', 'lambda'] },
    { name: 'Linux', category: 'Tools', keywords: ['linux', 'bash', 'ubuntu'] }
  ];

  generalSkillDict.forEach((gen) => {
    if (!extractedSkills.some(e => e.name.toLowerCase() === gen.name.toLowerCase())) {
      let count = 0;
      gen.keywords.forEach(kw => {
        const r = new RegExp(`\\b${kw}\\b`, 'gi');
        const m = lowerText.match(r);
        if (m) count += m.length;
      });

      if (count > 0) {
        extractedSkills.push({
          name: gen.name,
          category: gen.category,
          level: count >= 3 ? 'Intermediate' : 'Beginner',
          evidence: `Detected ${count} occurrences in resume sections.`,
          confidence: 65 + Math.min(20, count * 5),
          occurrences: count
        });
      }
    }
  });

  // 3. Extract Projects
  const projects: ExtractedProject[] = [];
  const projectRegex = /(?:PROJECTS|ACADEMIC PROJECTS|KEY PROJECTS)([\s\S]*?)(?:EXPERIENCE|EDUCATION|CERTIFICATIONS|ACHIEVEMENTS|$)/i;
  const projectBlockMatch = resumeText.match(projectRegex);
  const projectBlockText = projectBlockMatch ? projectBlockMatch[1] : resumeText;

  const rawProjectItems = projectBlockText.split(/(?:\n\d+\.|\n•|\n(?=[A-Z0-9][\w\s&]{4,40}(?:\n| - | \|)))/).filter(p => p.trim().length > 30);

  if (rawProjectItems.length > 0) {
    rawProjectItems.slice(0, 3).forEach((item, idx) => {
      const lines = item.trim().split('\n').map(l => l.trim()).filter(Boolean);
      const title = lines[0] ? lines[0].replace(/^[-•\d.\s]+/, '') : `Project ${idx + 1}`;
      const itemLower = item.toLowerCase();

      const detectedTech: string[] = [];
      ['Java', 'Spring Boot', 'Python', 'React', 'TypeScript', 'JavaScript', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Node.js', 'FastAPI', 'Pandas', 'Power BI', 'Git', 'REST API'].forEach(t => {
        if (new RegExp(`\\b${t.toLowerCase().replace(/[+]/g, '\\+')}\\b`, 'i').test(itemLower)) {
          detectedTech.push(t);
        }
      });

      const hasActionVerbs = /implemented|architected|built|designed|developed|engineered|optimized|created/i.test(itemLower);
      const hasMetrics = /\d+[%kK+]|\d+\s*(?:endpoints|records|users|rows|overhead)/i.test(itemLower);
      const depth: 'Strong' | 'Moderate' | 'Basic' = (hasActionVerbs && hasMetrics && detectedTech.length >= 3) ? 'Strong' : (detectedTech.length >= 2 ? 'Moderate' : 'Basic');
      const isRoleAligned = detectedTech.some(t => roleConfig.skills.some(s => s.skill.toLowerCase().includes(t.toLowerCase())));

      projects.push({
        title,
        technologies: detectedTech.length > 0 ? detectedTech : ['General Software'],
        relevance: isRoleAligned ? 'High' : 'Moderate',
        technicalDepth: depth,
        industryAlignment: isRoleAligned ? 'Strong' : 'Good',
        missingEvidence: depth === 'Strong' ? ['Production Cloud Deployment'] : ['Automated Unit Testing', 'Authentication & Security', 'Deployment Pipelines'],
        recommendedImprovement: depth === 'Strong'
          ? 'Add load testing metrics and containerized deployment specs to demonstrate enterprise readiness.'
          : 'Enrich project descriptions with quantified outcomes (e.g. latency reduction, query performance) and testing frameworks.',
        descriptionSnippet: lines.slice(1, 4).join(' ') || item.slice(0, 180)
      });
    });
  }

  if (projects.length === 0) {
    projects.push({
      title: 'Technical Capstone & Coursework Projects',
      technologies: extractedSkills.filter(s => s.level !== 'Not Detected').map(s => s.name).slice(0, 4),
      relevance: 'Moderate',
      technicalDepth: 'Moderate',
      industryAlignment: 'Good',
      missingEvidence: ['Architecture Diagrams', 'CI/CD Pipelines', 'Integration Tests'],
      recommendedImprovement: 'Provide standalone dedicated project sections with concrete bullet points detailing architectural decisions and technologies used.',
      descriptionSnippet: 'Demonstrates foundational programming implementations and academic coursework submissions.'
    });
  }

  // 4. Extract Experience
  const experienceRegex = /(?:EXPERIENCE|INTERNSHIPS|WORK EXPERIENCE)([\s\S]*?)(?:PROJECTS|EDUCATION|CERTIFICATIONS|ACHIEVEMENTS|$)/i;
  const expMatch = resumeText.match(experienceRegex);
  const expText = expMatch ? expMatch[1].trim() : '';
  const hasExp = expText.length > 30 && /intern|developer|engineer|analyst|associate|consultant/i.test(expText);

  let experience: ExtractedExperience;
  if (hasExp) {
    const lines = expText.split('\n').map(l => l.trim()).filter(Boolean);
    experience = {
      hasExperience: true,
      roleTitle: lines[0] || 'Software Engineering Intern',
      company: lines[0] && lines[0].includes('|') ? lines[0].split('|')[1].trim() : 'Tech Solutions',
      duration: 'Summer Internship',
      roleRelevance: 'High',
      technologyAlignment: 'Strong',
      skillCoverage: 76,
      missingSkills: ['Kubernetes Orchestration', 'Microservice Observability'],
      guidanceNotes: 'Relevant practical internship experience detected. Emphasize measurable deliverables during technical rounds.'
    };
  } else {
    experience = {
      hasExperience: false,
      guidanceNotes: 'Fresher profile: No formal industrial employment detected. Highlight hands-on practical assignments, open-source repositories, and capstone projects to demonstrate equivalent engineering capability.'
    };
  }

  // 5. Extract Education & Certifications
  const eduRegex = /(?:EDUCATION)([\s\S]*?)(?:TECHNICAL SKILLS|PROJECTS|EXPERIENCE|CERTIFICATIONS|$)/i;
  const eduMatch = resumeText.match(eduRegex);
  const eduText = eduMatch ? eduMatch[1].trim() : '';

  const certRegex = /(?:CERTIFICATIONS|ACHIEVEMENTS)([\s\S]*?)(?:$)/i;
  const certMatch = resumeText.match(certRegex);
  const certText = certMatch ? certMatch[1].trim() : '';

  const certList: { title: string; issuer?: string; relevance: string }[] = [];
  if (certText) {
    const certLines = certText.split('\n').map(l => l.replace(/^[-•\d.\s]+/, '').trim()).filter(l => l.length > 8);
    certLines.slice(0, 3).forEach(c => {
      certList.push({
        title: c,
        issuer: c.includes('Oracle') ? 'Oracle' : c.includes('Microsoft') ? 'Microsoft' : c.includes('Google') ? 'Google' : c.includes('HackerRank') ? 'HackerRank' : 'Professional Body',
        relevance: 'High'
      });
    });
  }

  const education: ExtractedEducation = {
    degree: /bachelor|b\.tech|b\.e\.|bca|mca|m\.tech|b\.s\./i.test(eduText) ? 'B.Tech in Computer Science / IT' : 'Bachelor of Technology',
    institution: eduText.split('\n')[0] || 'Accredited Engineering Institution',
    branch: 'Computer Science & Engineering',
    year: '2022 - 2026',
    relevance: 'High',
    coursework: ['Data Structures & Algorithms', 'Database Management', 'Object-Oriented Programming', 'Operating Systems', 'Computer Networks'],
    certifications: certList.length > 0 ? certList : [
      { title: `${targetRole.split(' ')[0]} Verified Foundation Assessment`, issuer: 'Platform Certified', relevance: 'High' }
    ]
  };

  // 6. Gaps & Alignment
  const industryAlignment: IndustrySkillComparison[] = [];
  const criticalGaps: SkillGapItem[] = [];
  const highPriorityGaps: SkillGapItem[] = [];
  const moderateGaps: SkillGapItem[] = [];
  const alignedSkills: SkillGapItem[] = [];

  roleConfig.skills.forEach((req) => {
    const detected = extractedSkills.find(s => s.name.toLowerCase() === req.skill.toLowerCase());
    const studentLevel = detected ? detected.level : 'Not Detected';

    let matchStatus: 'Strong Match' | 'Good Match' | 'Skill Gap' | 'Critical Gap' = 'Skill Gap';
    let currentPct = 0;
    const requiredPct = req.minLevel === 'Advanced' ? 85 : 70;

    if (studentLevel === 'Advanced') {
      currentPct = 90;
      matchStatus = 'Strong Match';
    } else if (studentLevel === 'Intermediate') {
      currentPct = 70;
      matchStatus = req.minLevel === 'Advanced' ? 'Skill Gap' : 'Good Match';
    } else if (studentLevel === 'Beginner') {
      currentPct = 35;
      matchStatus = req.importance === 'Critical' ? 'Critical Gap' : 'Skill Gap';
    } else {
      currentPct = 0;
      matchStatus = req.importance === 'Critical' ? 'Critical Gap' : 'Skill Gap';
    }

    const gapPct = Math.max(0, requiredPct - currentPct);

    industryAlignment.push({
      skill: req.skill,
      category: req.category,
      studentLevel,
      requiredLevel: req.minLevel,
      matchStatus,
      industryDemand: req.industryDemand,
      demandScore: req.demandScore,
      importance: req.importance
    });

    const gapItem: SkillGapItem = {
      skill: req.skill,
      category: req.category,
      currentLevel: studentLevel,
      requiredLevel: req.minLevel,
      currentPct,
      requiredPct,
      gapPct,
      industryDemand: `${req.industryDemand} Demand (${req.demandScore}%)`,
      priority: matchStatus === 'Strong Match' || matchStatus === 'Good Match'
        ? 'Aligned'
        : req.importance === 'Critical' || gapPct >= 40
        ? 'Critical'
        : req.importance === 'High'
        ? 'High'
        : 'Moderate',
      whyItMatters: req.whyItMatters
    };

    if (gapItem.priority === 'Critical') criticalGaps.push(gapItem);
    else if (gapItem.priority === 'High') highPriorityGaps.push(gapItem);
    else if (gapItem.priority === 'Moderate') moderateGaps.push(gapItem);
    else alignedSkills.push(gapItem);
  });

  // 7. Top Skills To Develop
  const topSkillsToDevelop: TopSkillToDevelop[] = [];
  const combinedMissing = [...criticalGaps, ...highPriorityGaps, ...moderateGaps];

  combinedMissing.slice(0, 4).forEach((gap, idx) => {
    topSkillsToDevelop.push({
      rank: idx + 1,
      skill: gap.skill,
      priority: gap.priority === 'Critical' ? 'Critical' : gap.priority === 'High' ? 'High' : 'Medium',
      priorityScore: gap.priority === 'Critical' ? 94 - idx * 4 : 85 - idx * 5,
      whyItMatters: gap.whyItMatters,
      whatIsMissing: gap.currentLevel === 'Not Detected'
        ? `No project or coursework evidence detected for ${gap.skill} in the uploaded resume.`
        : `Current evidence indicates ${gap.currentLevel} usage; role demands ${gap.requiredLevel} mastery.`,
      recommendedAction: `Complete the ${gap.skill} practical lab assignment and add quantifiable milestone achievements to your projects.`
    });
  });

  // 8. Granular 8-Dimension Scoring
  const totalRoleSkills = roleConfig.skills.length;
  const advancedCount = extractedSkills.filter(s => s.level === 'Advanced' && roleConfig.skills.some(r => r.skill === s.name)).length;
  const intermediateCount = extractedSkills.filter(s => s.level === 'Intermediate' && roleConfig.skills.some(r => r.skill === s.name)).length;

  // Keyword relevance
  const matchedKeywords = roleConfig.criticalKeywords.filter(kw => lowerText.includes(kw.toLowerCase()));
  const missingCriticalKeywords = roleConfig.criticalKeywords.filter(kw => !lowerText.includes(kw.toLowerCase()));
  const keywordPct = Math.min(100, Math.round((matchedKeywords.length / Math.max(1, roleConfig.criticalKeywords.length)) * 100));

  // Granular scores
  const contentQualityScore = Math.min(20, Math.max(10, Math.round(14 + (resumeText.match(/\d+%/g) ? 3 : 0) + (projects.some(p => p.technicalDepth === 'Strong') ? 3 : 1))));
  const skillsRelevanceScore = Math.min(20, Math.round(((advancedCount * 20 + intermediateCount * 14) / Math.max(1, totalRoleSkills * 20)) * 20) + 4);
  const projectStrengthScore = Math.min(20, projects.some(p => p.technicalDepth === 'Strong') ? 17 : projects.length >= 2 ? 14 : 10);
  const experienceRelevanceScore = hasExp ? 13 : 11;
  const educationScore = 10;
  const technicalEvidenceScore = Math.min(10, Math.round((extractedSkills.filter(s => s.level === 'Advanced' || s.level === 'Intermediate').length / Math.max(1, totalRoleSkills)) * 10) + 2);
  const keywordCoverageScore = Math.min(10, Math.round((keywordPct / 100) * 10));
  const resumeCompletenessScore = Math.min(15, resumeText.length > 600 ? 14 : 11);

  const totalResumeScore = Math.min(98, contentQualityScore + skillsRelevanceScore + projectStrengthScore + experienceRelevanceScore + educationScore + technicalEvidenceScore + keywordCoverageScore + resumeCompletenessScore);

  const granularScores: GranularScoreBreakdown = {
    contentQuality: { score: contentQualityScore, max: 20 },
    skillsRelevance: { score: skillsRelevanceScore, max: 20 },
    projectStrength: { score: projectStrengthScore, max: 20 },
    experienceRelevance: { score: experienceRelevanceScore, max: 15 },
    education: { score: educationScore, max: 10 },
    technicalEvidence: { score: technicalEvidenceScore, max: 10 },
    keywordCoverage: { score: keywordCoverageScore, max: 10 },
    resumeCompleteness: { score: resumeCompletenessScore, max: 15 },
    totalScore: totalResumeScore
  };

  // Strengths & Improvement Areas
  const strengths: string[] = [];
  const areasToImprove: string[] = [];

  if (alignedSkills.length > 0) {
    strengths.push(`Solid technical grounding demonstrated in ${alignedSkills.map(s => s.skill).slice(0, 3).join(', ')}.`);
  }
  if (projects.length >= 2) {
    strengths.push(`Multiple full-featured projects displaying architecture and CRUD persistence capabilities.`);
  }
  if (keywordPct >= 70) {
    strengths.push(`Strong ATS keyword density matching industry requisitions for ${targetRole}.`);
  }
  if (hasExp) {
    strengths.push(`Industrial internship experience backing academic computer science coursework.`);
  }

  if (criticalGaps.length > 0) {
    areasToImprove.push(`High-demand competencies (${criticalGaps.map(g => g.skill).slice(0, 2).join(', ')}) are missing or lack deep practical evidence.`);
  }
  if (projects.some(p => p.technicalDepth !== 'Strong')) {
    areasToImprove.push(`Project descriptions lack measurable metrics (e.g. latency, throughput) and automated unit testing tools.`);
  }
  if (keywordPct < 75) {
    areasToImprove.push(`Expand ATS keyword alignment for enterprise libraries and architectural patterns.`);
  }

  if (strengths.length === 0) strengths.push('Clear academic foundational credentials and coursework structure.');
  if (areasToImprove.length === 0) areasToImprove.push('Add distributed system architecture details and production telemetry metrics.');

  const qualityBreakdown: ResumeQualityBreakdown = {
    overallScore: totalResumeScore,
    skillsRelevance: Math.round((skillsRelevanceScore / 20) * 100),
    projectStrength: Math.round((projectStrengthScore / 20) * 100),
    technicalDepth: Math.round((technicalEvidenceScore / 10) * 100),
    experienceRelevance: Math.round((experienceRelevanceScore / 15) * 100),
    resumeStructure: Math.round((resumeCompletenessScore / 15) * 100),
    keywordRelevance: keywordPct,
    formattingStatus: resumeCompletenessScore >= 13 ? 'Good' : 'Needs Improvement',
    actionVerbsQuality: projectStrengthScore >= 14 ? 'Strong' : 'Moderate',
    quantifiableAchievements: resumeText.match(/\d+%/g) ? 'Strong' : 'Limited',
    improvements: [
      'Include quantifiable metrics (e.g. "improved query speed by 35%", "handled 1,000 req/sec").',
      `Explicitly detail enterprise ${targetRole} libraries and architectural design patterns.`,
      'Add unit & integration testing tools (e.g. JUnit, Mockito, Jest, PyTest) to project bullet points.',
      'Provide live deployment links, GitHub repositories, and interactive documentation.'
    ],
    strengths,
    areasToImprove,
    summaryExplanation: `Your resume demonstrates solid foundational competence for ${targetRole} with ${alignedSkills.length} verified aligned competencies. Advancing ${criticalGaps.slice(0, 2).map(g => g.skill).join(' and ') || 'enterprise architecture'} will significantly maximize your interview call rate.`
  };

  // 9. Career Readiness
  const industryAlignmentScore = Math.min(100, Math.round((alignedSkills.length / Math.max(1, totalRoleSkills)) * 100) + 20);
  const overallReadiness = Math.round(
    (skillsRelevanceScore / 20) * 30 +
    (industryAlignmentScore / 100) * 30 +
    (projectStrengthScore / 20) * 20 +
    ((totalResumeScore - 4) / 100) * 20
  );

  const careerReadiness: CareerReadinessBreakdown = {
    overall: overallReadiness,
    technicalSkills: Math.round((skillsRelevanceScore / 20) * 100),
    industryAlignment: industryAlignmentScore,
    projectReadiness: Math.round((projectStrengthScore / 20) * 100),
    interviewReadiness: Math.max(50, overallReadiness - 5),
    resumeStrength: totalResumeScore,
    verdictSummary: overallReadiness >= 75
      ? `Your profile demonstrates strong industry readiness for ${targetRole}. Focus on interview mock rehearsals and specialized gap milestones.`
      : `Your profile exhibits good core foundations for ${targetRole}, with several essential enterprise competencies requiring targeted development.`
  };

  // 10. Recommendations
  const recommendations: AIRecommendation[] = [];
  let priorityCounter = 1;

  criticalGaps.slice(0, 2).forEach((gap) => {
    recommendations.push({
      priority: priorityCounter++,
      title: `Master ${gap.skill} Enterprise Fundamentals`,
      skill: gap.skill,
      reason: `${gap.skill} is a critical requirement for ${targetRole} with ${gap.industryDemand}, but your resume shows limited practical evidence.`,
      priorityLevel: 'High',
      suggestedAction: `Complete the ${gap.skill} milestone on your personalized Skill Roadmap and implement a production capstone.`,
      actionType: 'roadmap'
    });
  });

  if (highPriorityGaps.length > 0 && priorityCounter <= 3) {
    const gap = highPriorityGaps[0];
    recommendations.push({
      priority: priorityCounter++,
      title: `Build a Hands-on ${gap.skill} Project`,
      skill: gap.skill,
      reason: `Demonstrating hands-on project artifacts for ${gap.skill} directly bridges a ${gap.gapPct}% readiness gap.`,
      priorityLevel: 'Medium',
      suggestedAction: `Solve the practical lab assignment for ${gap.skill} to earn verified code credentials.`,
      actionType: 'assignment'
    });
  }

  recommendations.push({
    priority: priorityCounter++,
    title: `Simulate AI Video Mock Interview for ${targetRole}`,
    skill: 'Interview & Communication',
    reason: 'Validate technical problem solving and oral architecture explanation under simulated enterprise conditions.',
    priorityLevel: 'High',
    suggestedAction: `Launch a 10-question adaptive AI Mock Interview focused on ${roleConfig.skills.slice(0, 3).map(s => s.skill).join(', ')}.`,
    actionType: 'interview'
  });

  // 11. Compatibility Report
  const compatibility: ResumeCompatibilityReport = {
    targetRole,
    keywordCoveragePct: keywordPct,
    detectedKeywords: matchedKeywords,
    missingCriticalKeywords: missingCriticalKeywords.slice(0, 6),
    recommendations: [
      `Incorporate ${missingCriticalKeywords.slice(0, 3).join(', ')} into your project descriptions with concrete usage context.`,
      'Ensure technical keywords correspond to genuine skills and verified code in your repositories.'
    ]
  };

  const beforeReadiness = existingStudentSkills.length > 0 ? 62 : 45;
  const beforeCount = existingStudentSkills.length > 0 ? existingStudentSkills.length : 4;
  const afterCount = extractedSkills.filter(s => s.level !== 'Not Detected').length;

  return {
    id: `analysis-${Date.now()}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    fileName: fileMeta.name || 'Resume_Document.pdf',
    fileSize: fileMeta.size || '1.8 MB',
    rawText: resumeText,
    candidateInfo,
    detectedRoleSuggestion,
    targetRole,
    resumeScore: totalResumeScore,
    granularScores,
    scoreBreakdown: qualityBreakdown,
    careerReadiness,
    industrySkillMatch: industryAlignmentScore,
    extractedSkills,
    visualSkillMatrix,
    industryAlignment,
    skillGaps: {
      critical: criticalGaps,
      highPriority: highPriorityGaps,
      moderate: moderateGaps,
      aligned: alignedSkills
    },
    topSkillsToDevelop,
    compatibility,
    projects,
    experience,
    education,
    recommendations,
    roadmapMilestones: roleConfig.defaultRoadmap,
    recommendedAssignment: roleConfig.recommendedAssignment,
    interviewFocusAreas: roleConfig.interviewTopics,
    profileImpact: {
      before: { skillsCount: beforeCount, gapsCount: Math.max(2, criticalGaps.length + highPriorityGaps.length + 1), readiness: beforeReadiness },
      after: { skillsCount: afterCount, gapsCount: criticalGaps.length + highPriorityGaps.length, readiness: overallReadiness }
    }
  };
}

// ============================================================================
// 6. STORAGE HELPERS
// ============================================================================

const RESUME_HISTORY_STORAGE_KEY = 'sih_resume_analysis_history';

export function getStoredAnalysisHistory(): ResumeAnalysisResult[] {
  try {
    const raw = localStorage.getItem(RESUME_HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveAnalysisResult(result: ResumeAnalysisResult): void {
  try {
    const existing = getStoredAnalysisHistory();
    const updated = [result, ...existing.filter(item => item.id !== result.id)].slice(0, 10);
    localStorage.setItem(RESUME_HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
}

export function clearAnalysisHistory(): void {
  try {
    localStorage.removeItem(RESUME_HISTORY_STORAGE_KEY);
  } catch (e) {}
}
