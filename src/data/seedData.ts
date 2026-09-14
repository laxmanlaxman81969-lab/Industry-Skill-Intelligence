import {
  IndustrySkill,
  JobRequirement,
  CompanyProfile,
  CollegeProfile,
  CurriculumCourse,
  RoadmapStep,
  Assignment,
  InterviewQuestion,
  StudentProfile,
  User
} from '../types';

export const SUPPORTED_ROLES = [
  'Java Backend Developer',
  'Frontend Developer',
  'Full Stack Developer',
  'AI/ML Engineer',
  'Data Scientist',
  'Cloud / DevOps Engineer',
  'Cybersecurity Analyst',
  'Data Analyst',
  'Mobile App Developer',
  'QA / Automation Engineer',
  'UI/UX Designer',
  'Database Administrator',
  'Embedded & IoT Engineer',
  'Software Engineer (General)'
];

export const INDUSTRIES = [
  'Enterprise Software & SaaS',
  'Fintech & Digital Banking',
  'Healthcare Technology',
  'E-Commerce & Retail Tech',
  'Artificial Intelligence & Cloud',
  'Telecommunications',
  'EdTech'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-student-1',
    name: 'Aarav Sharma',
    email: 'student@radar.edu',
    role: 'student',
    createdAt: '2026-08-10'
  },
  {
    id: 'usr-company-1',
    name: 'ABC Technologies HR',
    email: 'hiring@abctech.com',
    role: 'company',
    createdAt: '2026-07-15'
  },
  {
    id: 'usr-college-1',
    name: 'Apex Institute of Technology',
    email: 'dean@apextech.edu.in',
    role: 'college',
    createdAt: '2026-06-01'
  },
  {
    id: 'usr-admin-1',
    name: 'System Administrator',
    email: 'admin@radar.gov.in',
    role: 'admin',
    createdAt: '2026-01-01'
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-001',
  userId: 'usr-student-1',
  fullName: 'Aarav Sharma',
  email: 'student@radar.edu',
  college: 'Apex Institute of Technology',
  degree: 'B.Tech',
  branch: 'Computer Science & Engineering',
  currentYear: '3rd Year',
  graduationYear: '2027',
  targetRole: 'Java Backend Developer',
  targetCompany: 'ABC Technologies',
  hasResume: true,
  resumeFileName: 'Aarav_Sharma_Backend_Resume.pdf',
  resumeScore: 78,
  resumeBreakdown: {
    skillsRelevance: 82,
    projectRelevance: 76,
    education: 90,
    experience: 65,
    keywordCoverage: 80,
    structure: 78
  },
  resumeStrengths: [
    'Solid foundation in Core Java and Object-Oriented Principles',
    'Good database grounding with relational SQL and JDBC projects',
    'Clean academic timeline and structured coursework presentation'
  ],
  resumeWeaknesses: [
    'Missing enterprise frameworks like Spring Boot and JPA/Hibernate',
    'No production-grade REST API architecture demonstrated in projects',
    'Lack of automated testing (JUnit/Mockito) or containerization (Docker)'
  ],
  resumeImprovements: [
    'Add a comprehensive Spring Boot microservices project with JWT auth',
    'Highlight Git commit workflows and open source contributions',
    'Include metrics for database query performance improvements'
  ],
  skills: [
    { name: 'Java', category: 'Language', level: 'Advanced', verified: true, verifiedSource: 'assignment' },
    { name: 'SQL', category: 'Database', level: 'Intermediate', verified: true, verifiedSource: 'resume' },
    { name: 'JDBC', category: 'Backend', level: 'Intermediate', verified: true, verifiedSource: 'resume' },
    { name: 'HTML', category: 'Frontend', level: 'Intermediate', verified: true, verifiedSource: 'self' },
    { name: 'CSS', category: 'Frontend', level: 'Intermediate', verified: true, verifiedSource: 'self' },
    { name: 'Git', category: 'Tools', level: 'Beginner', verified: false, verifiedSource: 'self' },
    { name: 'REST API', category: 'Backend', level: 'Beginner', verified: false, verifiedSource: 'self' }
  ],
  overallReadiness: 68,
  onboardingComplete: true
};

export const INITIAL_INDUSTRY_SKILLS: IndustrySkill[] = [
  // Java Backend Developer Skills
  {
    id: 'isk-001',
    name: 'Java',
    category: 'Language',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 92,
    totalObservations: 2450,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Core foundation for 80% of enterprise banking and high-throughput systems.'
  },
  {
    id: 'isk-002',
    name: 'SQL',
    category: 'Database',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 88,
    totalObservations: 2310,
    trend: 'Stable',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Essential for persistent storage, complex transactions, query tuning, and reporting.'
  },
  {
    id: 'isk-003',
    name: 'Spring Boot',
    category: 'Backend',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 84,
    totalObservations: 2180,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Industry-standard microservice framework for rapid enterprise web application development.'
  },
  {
    id: 'isk-004',
    name: 'REST API',
    category: 'Backend',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 80,
    totalObservations: 2100,
    trend: 'Stable',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Standard communication protocol connecting client web/mobile apps to backend services.'
  },
  {
    id: 'isk-005',
    name: 'Git',
    category: 'Tools',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 76,
    totalObservations: 1980,
    trend: 'Stable',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-10',
    importance: 'High',
    whyItMatters: 'Mandatory version control for collaborative enterprise engineering workflows.'
  },
  {
    id: 'isk-006',
    name: 'JPA/Hibernate',
    category: 'Backend',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 72,
    totalObservations: 1890,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-10',
    importance: 'High',
    whyItMatters: 'Automates Object-Relational Mapping (ORM) reducing tedious JDBC boilerplate.'
  },
  {
    id: 'isk-007',
    name: 'Docker',
    category: 'Cloud/DevOps',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 68,
    totalObservations: 1740,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-08',
    importance: 'High',
    whyItMatters: 'Ensures containerized reproducibility from local developer laptops to cloud deployments.'
  },
  {
    id: 'isk-008',
    name: 'Spring Security & JWT',
    category: 'Security',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 65,
    totalObservations: 1650,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-08',
    importance: 'High',
    whyItMatters: 'Safeguards endpoints against cyber threats with stateless token authorization.'
  },
  {
    id: 'isk-009',
    name: 'Data Structures & Algorithms',
    category: 'Core CS',
    role: 'Java Backend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 76,
    totalObservations: 1990,
    trend: 'Stable',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-08',
    importance: 'Critical',
    whyItMatters: 'Required for technical interview problem solving and optimal algorithmic memory/runtime.'
  },

  // Frontend Developer Skills
  {
    id: 'isk-010',
    name: 'JavaScript (ES6+)',
    category: 'Language',
    role: 'Frontend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 94,
    totalObservations: 2800,
    trend: 'Stable',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Core web scripting language powering dynamic browser interaction.'
  },
  {
    id: 'isk-011',
    name: 'React.js',
    category: 'Frontend',
    role: 'Frontend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 90,
    totalObservations: 2650,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Dominant component-based web UI library with rich ecosystem.'
  },
  {
    id: 'isk-012',
    name: 'TypeScript',
    category: 'Language',
    role: 'Frontend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 85,
    totalObservations: 2400,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-11',
    importance: 'Critical',
    whyItMatters: 'Static typing prevents runtime errors and empowers enterprise codebase scalability.'
  },
  {
    id: 'isk-013',
    name: 'Tailwind CSS',
    category: 'Frontend',
    role: 'Frontend Developer',
    industry: 'Enterprise Software & SaaS',
    demandScore: 78,
    totalObservations: 2100,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-10',
    importance: 'High',
    whyItMatters: 'Utility-first modern styling speeding up responsive UI delivery.'
  },

  // AI/ML Engineer Skills
  {
    id: 'isk-014',
    name: 'Python',
    category: 'Language',
    role: 'AI/ML Engineer',
    industry: 'Artificial Intelligence & Cloud',
    demandScore: 96,
    totalObservations: 3100,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Lingua franca of machine learning, data science, and modern LLM engineering.'
  },
  {
    id: 'isk-015',
    name: 'PyTorch',
    category: 'AI/ML',
    role: 'AI/ML Engineer',
    industry: 'Artificial Intelligence & Cloud',
    demandScore: 86,
    totalObservations: 2200,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Premier deep learning framework for research, model training, and fine-tuning.'
  },
  {
    id: 'isk-016',
    name: 'Generative AI & LLMs',
    category: 'AI/ML',
    role: 'AI/ML Engineer',
    industry: 'Artificial Intelligence & Cloud',
    demandScore: 88,
    totalObservations: 2500,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Exploding demand for RAG, agentic workflows, prompt engineering, and embeddings.'
  },

  // Cloud / DevOps Engineer Skills
  {
    id: 'isk-017',
    name: 'AWS / Azure Cloud',
    category: 'Cloud/DevOps',
    role: 'Cloud / DevOps Engineer',
    industry: 'Artificial Intelligence & Cloud',
    demandScore: 91,
    totalObservations: 2750,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-12',
    importance: 'Critical',
    whyItMatters: 'Hosts global cloud workloads, serverless architectures, and managed databases.'
  },
  {
    id: 'isk-018',
    name: 'Kubernetes',
    category: 'Cloud/DevOps',
    role: 'Cloud / DevOps Engineer',
    industry: 'Artificial Intelligence & Cloud',
    demandScore: 83,
    totalObservations: 2190,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-11',
    importance: 'Critical',
    whyItMatters: 'Defacto container orchestration standard for auto-scaling and resilience.'
  },

  // Cybersecurity Analyst Skills
  {
    id: 'isk-019',
    name: 'Network Security',
    category: 'Security',
    role: 'Cybersecurity Analyst',
    industry: 'Fintech & Digital Banking',
    demandScore: 89,
    totalObservations: 1950,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-10',
    importance: 'Critical',
    whyItMatters: 'Shields internal enterprise infrastructure against unauthorized intrusions and DDoS.'
  },
  {
    id: 'isk-020',
    name: 'Vulnerability Assessment & PenTesting',
    category: 'Security',
    role: 'Cybersecurity Analyst',
    industry: 'Fintech & Digital Banking',
    demandScore: 82,
    totalObservations: 1800,
    trend: 'Growing',
    source: 'Company Hiring Requisitions & Aggregated Postings',
    lastUpdated: '2026-09-09',
    importance: 'High',
    whyItMatters: 'Identifies exploits before malicious actors can compromise user or financial data.'
  }
];

export const INITIAL_COMPANIES: CompanyProfile[] = [
  {
    id: 'cmp-001',
    userId: 'usr-company-1',
    name: 'ABC Technologies',
    email: 'hiring@abctech.com',
    industry: 'Enterprise Software & SaaS',
    companySize: '1,000 - 5,000 employees',
    website: 'https://abctechnologies.example.com',
    location: 'Bangalore / Hyderabad / Remote',
    logo: '🏢',
    description: 'Premier enterprise cloud solutions provider building resilient financial microservices.'
  },
  {
    id: 'cmp-002',
    userId: 'usr-company-2',
    name: 'NexaCore Systems',
    email: 'careers@nexacore.io',
    industry: 'Fintech & Digital Banking',
    companySize: '500 - 1,000 employees',
    website: 'https://nexacore.io',
    location: 'Mumbai / Pune',
    logo: '⚡',
    description: 'Next-generation payment gateway and real-time transaction processing platform.'
  },
  {
    id: 'cmp-003',
    userId: 'usr-company-3',
    name: 'CloudScale Labs',
    email: 'talent@cloudscale.ai',
    industry: 'Artificial Intelligence & Cloud',
    companySize: '200 - 500 employees',
    website: 'https://cloudscale.ai',
    location: 'Bangalore / NCR',
    logo: '☁️',
    description: 'Autonomous AI infrastructure and enterprise agent orchestrator.'
  }
];

export const INITIAL_JOB_REQUIREMENTS: JobRequirement[] = [
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
    minReadinessScore: 60,
    postedDate: '2026-09-10',
    applicantsCount: 29
  }
];

export const INITIAL_COLLEGE_PROFILE: CollegeProfile = {
  id: 'clg-001',
  userId: 'usr-college-1',
  name: 'Apex Institute of Technology',
  email: 'dean@apextech.edu.in',
  universityAffiliation: 'State Technical University',
  location: 'Hyderabad, Telangana',
  accreditation: 'NAAC A++, NBA Accredited (Tier-1)',
  totalStudents: 1450
};

export const INITIAL_CURRICULUM_COURSES: CurriculumCourse[] = [
  {
    code: 'CS301',
    title: 'Object Oriented Programming with Java',
    semester: 3,
    taughtSkills: ['Java', 'OOP', 'Exception Handling', 'Collections'],
    industryAlignmentScore: 88,
    status: 'Aligned',
    recommendedUpdates: ['Integrate modern Java 21 features and virtual threads']
  },
  {
    code: 'CS402',
    title: 'Database Management Systems',
    semester: 4,
    taughtSkills: ['SQL', 'Relational Algebra', 'Normalization', 'JDBC'],
    industryAlignmentScore: 82,
    status: 'Aligned',
    recommendedUpdates: ['Include NoSQL (MongoDB) and Indexing performance tuning']
  },
  {
    code: 'CS503',
    title: 'Web Technologies Lab',
    semester: 5,
    taughtSkills: ['HTML', 'CSS', 'JavaScript (Basics)', 'Servlets & JSP'],
    industryAlignmentScore: 48,
    status: 'Outdated',
    recommendedUpdates: [
      'Replace legacy Servlets/JSP with Spring Boot REST APIs',
      'Introduce React.js and modern component state management'
    ]
  },
  {
    code: 'CS604',
    title: 'Software Engineering & Cloud Computing',
    semester: 6,
    taughtSkills: ['SDLC', 'Agile Fundamentals', 'Basic AWS Intro'],
    industryAlignmentScore: 65,
    status: 'Needs Update',
    recommendedUpdates: ['Add hands-on Docker containerization & GitHub Actions CI/CD']
  }
];

export const INITIAL_ROADMAP_STEPS: RoadmapStep[] = [
  {
    id: 'rd-01',
    stepNumber: 1,
    title: 'Advanced Java & Collections Mastery',
    category: 'Core Language',
    skillsCovered: ['Java Generics', 'Collections Framework', 'Streams API', 'Concurrency Basics'],
    currentLevel: 'Intermediate',
    targetLevel: 'Advanced',
    industryDemand: 92,
    whyYouNeedIt: 'Enterprise backends handle millions of records in memory; deep fluency in HashMap internals, Streams, and thread safety is mandatory for coding interviews and real microservices.',
    difficulty: 'Intermediate',
    estimatedHours: 24,
    resources: [
      { title: 'Official Java Documentation & Baeldung Advanced Core', type: 'Documentation', url: 'https://docs.oracle.com/en/java/', duration: '8 hours' },
      { title: 'Modern Java In Action: Streams, Lambdas & Concurrency', type: 'Course', url: 'https://dev.java/learn/', duration: '12 hours' }
    ],
    practiceTask: 'Implement custom thread-safe LRU Cache and process 100k student records using parallel Streams.',
    suggestedProject: 'In-Memory High-Performance Stock Order Matching Engine',
    status: 'completed'
  },
  {
    id: 'rd-02',
    stepNumber: 2,
    title: 'Relational Database Architecture & JDBC',
    category: 'Persistence',
    skillsCovered: ['SQL Joins', 'ACID Transactions', 'Connection Pooling', 'HikariCP', 'JDBC Batching'],
    currentLevel: 'Intermediate',
    targetLevel: 'Advanced',
    industryDemand: 88,
    whyYouNeedIt: 'Understanding what happens under the hood before moving to abstraction layers (ORM) prevents catastrophic N+1 query bottlenecks and connection leaks.',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    resources: [
      { title: 'PostgreSQL & MySQL Query Optimization Masterclass', type: 'Documentation', url: 'https://use-the-index-luke.com/', duration: '10 hours' },
      { title: 'Deep Dive: Java Database Connectivity & Connection Pools', type: 'Article', url: 'https://vladmihalcea.com/tutorials/databases/', duration: '6 hours' }
    ],
    practiceTask: 'Write optimized SQL queries with EXPLAIN ANALYZE and implement JDBC batch inserts for 10k transaction records.',
    suggestedProject: 'CLI Banking Ledger with Transaction Rollback on Failure',
    status: 'completed'
  },
  {
    id: 'rd-03',
    stepNumber: 3,
    title: 'JPA & Hibernate ORM',
    category: 'ORM Architecture',
    skillsCovered: ['Entity Lifecycle', 'Entity Relationships (@OneToMany, @ManyToMany)', 'JPQL', 'Fetch Types & N+1 Problem'],
    currentLevel: 'None',
    targetLevel: 'Intermediate',
    industryDemand: 72,
    whyYouNeedIt: 'Industry enterprise projects rarely write raw SQL for CRUD. JPA/Hibernate bridges Java objects to relational tables seamlessly.',
    difficulty: 'Intermediate',
    estimatedHours: 28,
    resources: [
      { title: 'Hibernate ORM Official Guide', type: 'Documentation', url: 'https://hibernate.org/orm/documentation/', duration: '12 hours' },
      { title: 'Mastering Spring Data JPA Relationships and Criteria Queries', type: 'Course', url: 'https://spring.io/guides/gs/accessing-data-jpa/', duration: '14 hours' }
    ],
    practiceTask: 'Model an E-commerce catalog with Category, Product, Order, and Customer entities avoiding lazy initialization exceptions.',
    suggestedProject: 'University Course Registration Persistence Engine',
    status: 'in-progress'
  },
  {
    id: 'rd-04',
    stepNumber: 4,
    title: 'Spring Boot 3 Core & Architecture',
    category: 'Enterprise Framework',
    skillsCovered: ['Inversion of Control (IoC)', 'Dependency Injection', 'Spring Boot Auto-configuration', 'Application Properties', 'Profiles'],
    currentLevel: 'None',
    targetLevel: 'Intermediate',
    industryDemand: 84,
    whyYouNeedIt: 'Spring Boot is the number one required framework across Java backend hiring postings. It eliminates XML configuration and enables production-ready microservices.',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    resources: [
      { title: 'Building Applications with Spring Boot (Official Spring.io)', type: 'Documentation', url: 'https://spring.io/quickstart', duration: '15 hours' },
      { title: 'Spring Framework Masterclass: Beans, Component Scanning, and Actuator', type: 'Course', url: 'https://spring.io/guides', duration: '20 hours' }
    ],
    practiceTask: 'Configure multi-environment profiles (dev, staging, prod) and write custom Spring services with constructor injection.',
    suggestedProject: 'Multi-Tenant Notification Dispatcher Service',
    status: 'locked'
  },
  {
    id: 'rd-05',
    stepNumber: 5,
    title: 'RESTful API Engineering & Best Practices',
    category: 'Web Services',
    skillsCovered: ['HTTP Methods & Status Codes', '@RestController', 'DTO Pattern & ModelMapper', 'Global Exception Handling (@ControllerAdvice)', 'Swagger/OpenAPI Documentation'],
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    industryDemand: 80,
    whyYouNeedIt: 'Clean, idempotent, and documented REST endpoints allow web and mobile clients to consume your backend with predictable contracts.',
    difficulty: 'Intermediate',
    estimatedHours: 25,
    resources: [
      { title: 'RESTful API Design Standards & Architectural Constraints', type: 'Article', url: 'https://restfulapi.net/', duration: '8 hours' },
      { title: 'Spring Boot REST Service with OpenAPI / Swagger UI', type: 'Interactive', url: 'https://spring.io/guides/tutorials/rest/', duration: '12 hours' }
    ],
    practiceTask: 'Build a Student & Placement Management REST API with strict HTTP status codes and custom validation annotations.',
    suggestedProject: 'Campus Placement Portal API Gateway',
    status: 'locked'
  },
  {
    id: 'rd-06',
    stepNumber: 6,
    title: 'Spring Security & JWT Authentication',
    category: 'Security',
    skillsCovered: ['SecurityFilterChain', 'BCrypt Password Hashing', 'JWT Token Generation & Validation', 'Role-Based Access Control (@PreAuthorize)'],
    currentLevel: 'None',
    targetLevel: 'Intermediate',
    industryDemand: 65,
    whyYouNeedIt: 'Unsecured APIs are disqualified in industry reviews. Production systems require stateless JWT token authentication and role authorization.',
    difficulty: 'Advanced',
    estimatedHours: 30,
    resources: [
      { title: 'Spring Security 6 Architecture & JWT Authentication Filter', type: 'Documentation', url: 'https://docs.spring.io/spring-security/reference/', duration: '14 hours' },
      { title: 'Implementing Role-Based Access Control (RBAC) in Spring Boot', type: 'Course', url: 'https://www.baeldung.com/spring-security-login', duration: '16 hours' }
    ],
    practiceTask: 'Implement user login, refresh tokens, and protect Admin vs Student endpoints with custom security filters.',
    suggestedProject: 'Secure Identity & Access Management (IAM) Microservice',
    status: 'locked'
  },
  {
    id: 'rd-07',
    stepNumber: 7,
    title: 'Automated Unit & Integration Testing',
    category: 'Quality Assurance',
    skillsCovered: ['JUnit 5', 'Mockito', 'MockMvc', 'Testcontainers with Real PostgreSQL'],
    currentLevel: 'None',
    targetLevel: 'Intermediate',
    industryDemand: 62,
    whyYouNeedIt: 'Industry engineering teams require minimum 80% test coverage before PRs can be merged into production branches.',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    resources: [
      { title: 'Testing Spring Boot Applications: Unit vs Integration Tests', type: 'Documentation', url: 'https://spring.io/guides/gs/testing-web/', duration: '8 hours' },
      { title: 'Mockito 5 Framework Guide for Service Mocks', type: 'Article', url: 'https://site.mockito.org/', duration: '6 hours' }
    ],
    practiceTask: 'Write unit tests mocking database repositories and integration tests verifying HTTP endpoints with MockMvc.',
    suggestedProject: 'Automated Test Suite for E-Commerce Checkout',
    status: 'locked'
  },
  {
    id: 'rd-08',
    stepNumber: 8,
    title: 'Capstone: Production Backend Project & AI Mock Interview',
    category: 'Career Readiness Verification',
    skillsCovered: ['Full Stack Integration', 'Docker Containerization', 'Performance Benchmarking', 'Technical Interview Defense'],
    currentLevel: 'None',
    targetLevel: 'Advanced',
    industryDemand: 85,
    whyYouNeedIt: 'Validates that you can not only write code, but articulate architectural decisions under technical interview pressure.',
    difficulty: 'Advanced',
    estimatedHours: 40,
    resources: [
      { title: 'Dockerizing Spring Boot Applications with Multi-Stage Builds', type: 'Documentation', url: 'https://spring.io/guides/topicals/spring-boot-docker/', duration: '8 hours' },
      { title: 'AI-Powered Skill Gap Platform Mock Interview Practice Simulator', type: 'Interactive', url: '#mock-interview', duration: '10 hours' }
    ],
    practiceTask: 'Deploy containerized microservice to cloud registry and complete the AI Video Technical Interview with >= 75% score.',
    suggestedProject: 'High-Scale Industry Opportunity Engine with Redis Caching',
    status: 'locked'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-001',
    title: 'Build a Student Management REST API',
    targetSkill: 'REST API',
    difficulty: 'Intermediate',
    estimatedMinutes: 60,
    description: 'Create a robust Spring Boot REST controller to manage student records. You must support complete CRUD operations, enforce input validation, and handle missing resource errors gracefully.',
    requirements: [
      'GET /api/v1/students - Retrieve all registered students with pagination',
      'GET /api/v1/students/{id} - Retrieve single student; return 404 NOT_FOUND if ID does not exist',
      'POST /api/v1/students - Create new student with @Valid email and CGPA constraints',
      'PUT /api/v1/students/{id} - Update student target role and skills list',
      'DELETE /api/v1/students/{id} - Soft delete student; return 204 NO_CONTENT'
    ],
    skillsTested: ['Spring Boot', 'REST API', 'HTTP Status Codes', 'Input Validation', 'Error Handling'],
    starterCode: `@RestController
@RequestMapping("/api/v1/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // TODO: Implement GET all students with Pageable
    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.findAll());
    }

    // TODO: Implement GET student by ID with 404 Exception handling

    // TODO: Implement POST student with @Valid request body

    // TODO: Implement PUT student update

    // TODO: Implement DELETE student
}`,
    expectedOutputHint: 'Ensure your endpoints return appropriate HTTP status codes (200, 201, 204, 400, 404) and JSON payloads.'
  },
  {
    id: 'asg-002',
    title: 'Implement Database Connection Pool & Query Optimizer',
    targetSkill: 'SQL',
    difficulty: 'Intermediate',
    estimatedMinutes: 45,
    description: 'Optimize a high-latency query running against a 500,000 row job opportunities table. Create necessary composite indexes and write an explainable SQL query plan.',
    requirements: [
      'Write optimized SQL query filtering by role, minimum experience, and active status',
      'Create composite index (target_role, is_active, created_at DESC)',
      'Explain the reduction in cost between full table scan vs index range scan'
    ],
    skillsTested: ['SQL Indexing', 'Query Optimization', 'Execution Plans', 'Performance Tuning'],
    starterCode: `-- Given unoptimized slow query:
-- SELECT * FROM job_postings WHERE target_role = 'Java Backend Developer' AND is_active = true ORDER BY created_at DESC;

-- Step 1: Write CREATE INDEX statement
-- Step 2: Write optimized query utilizing index hints if applicable
`,
    expectedOutputHint: 'Verify that execution plan shifts from Seq Scan to Bitmap Index Scan / Index Scan.'
  },
  {
    id: 'asg-003',
    title: 'Containerize Backend Microservice with Docker',
    targetSkill: 'Docker',
    difficulty: 'Beginner',
    estimatedMinutes: 30,
    description: 'Write a production-ready, secure multi-stage Dockerfile for a Spring Boot / Node.js backend to minimize image size and eliminate root user execution risks.',
    requirements: [
      'Stage 1: Build stage using Maven/Gradle image',
      'Stage 2: Minimal JRE runtime image (e.g. eclipse-temurin:21-jre-alpine)',
      'Run application as a non-root system user (e.g., appuser:appgroup)',
      'Expose port 8080 and define HEALTHCHECK instruction'
    ],
    skillsTested: ['Docker', 'Multi-stage builds', 'Container Security', 'DevOps'],
    starterCode: `# Multi-stage Dockerfile
# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace
# TODO: Copy pom.xml and source code, run clean package

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine
# TODO: Add non-root user and copy jar from builder
`,
    expectedOutputHint: 'Output image should be under 200MB and run without root privileges.'
  }
];

export const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'iq-001',
    category: 'Introduction',
    skillTested: 'Communication & Professional Overview',
    difficulty: 'Beginner',
    question: 'Welcome! Please introduce yourself, summarize your academic background, and explain why you are targeting the Java Backend Developer role.',
    idealAnswerKeyPoints: [
      'Clear articulation of name, degree, college, and graduation year',
      'Mention of specific passion for server-side architecture, data reliability, and APIs',
      'Highlighting of 1-2 major academic or personal projects'
    ]
  },
  {
    id: 'iq-002',
    category: 'Technical',
    skillTested: 'Java',
    difficulty: 'Intermediate',
    question: 'How does HashMap work internally in Java 8+? What happens during a hash collision, and at what threshold does the bucket convert from a LinkedList to a Red-Black Tree?',
    idealAnswerKeyPoints: [
      'Hash calculation using key.hashCode() and spread function',
      'Bucket index determination: (n - 1) & hash',
      'Collisions resolved via chaining initially',
      'TREEIFY_THRESHOLD = 8 (converts to TreeNode if array capacity >= 64)',
      'UNTREEIFY_THRESHOLD = 6 (converts back to LinkedList on shrink)'
    ],
    claimedSkillCheck: true
  },
  {
    id: 'iq-003',
    category: 'Technical',
    skillTested: 'Spring Boot',
    difficulty: 'Intermediate',
    question: 'Explain the difference between JPA and Hibernate. Also, what is the N+1 select problem in ORM, and how do you resolve it in Spring Data JPA?',
    idealAnswerKeyPoints: [
      'JPA is a specification/interface; Hibernate is the concrete implementation',
      'N+1 occurs when fetching 1 parent triggers N separate queries for each child relationship',
      'Solved using JOIN FETCH in JPQL, @EntityGraph, or BatchSize configuration'
    ],
    claimedSkillCheck: true
  },
  {
    id: 'iq-004',
    category: 'Scenario-based',
    skillTested: 'REST API & System Design',
    difficulty: 'Intermediate',
    question: 'Suppose your REST API receives duplicate payment creation requests due to a flaky network retry on the mobile client. How do you design your backend endpoint to guarantee idempotency?',
    idealAnswerKeyPoints: [
      'Client generates unique Idempotency-Key (UUID) in request header',
      'Backend checks Redis / database for existing key in a distributed lock or transaction',
      'If present and processing, return 409 Conflict or cached response; if first time, process and store result with TTL',
      'Use proper HTTP semantics (PUT/DELETE are naturally idempotent, POST requires idempotency keys)'
    ],
    claimedSkillCheck: true
  },
  {
    id: 'iq-005',
    category: 'Behavioral',
    skillTested: 'Problem Solving & Teamwork',
    difficulty: 'Intermediate',
    question: 'Describe a situation where you faced a difficult software bug or conceptual roadblock in a project. What debugging methodology did you follow to isolate and fix it?',
    idealAnswerKeyPoints: [
      'STAR methodology (Situation, Task, Action, Result)',
      'Systematic isolation: log inspection, stack trace analysis, reproducing in test environment',
      'Collaborative troubleshooting and documentation of root cause preventatives'
    ]
  }
];

export const ROLE_FOUNDATION_PATHS: Record<string, { title: string; steps: string[] }> = {
  'Software Development': {
    title: 'Software Development Foundation',
    steps: ['Programming Fundamentals', 'Object Oriented Programming', 'Data Structures & Algorithms', 'Version Control with Git', 'Database Fundamentals', 'Backend / Frontend Specialization']
  },
  'Java Backend': {
    title: 'Java Enterprise Backend Pathway',
    steps: ['Core Java', 'OOP & Design Patterns', 'Collections & Streams', 'Relational SQL', 'JDBC & Transaction Mgmt', 'JPA / Hibernate', 'Spring Boot Framework', 'REST API Design', 'Spring Security & JWT', 'Microservices & Cloud Deployments']
  },
  'AI / ML': {
    title: 'Artificial Intelligence & Machine Learning Pathway',
    steps: ['Python Programming', 'Linear Algebra & Calculus', 'NumPy & Pandas', 'Data Exploration & Preprocessing', 'Classical Machine Learning (Scikit-Learn)', 'Deep Learning (PyTorch)', 'Computer Vision & NLP', 'Generative AI & LLM Systems']
  },
  'Data Analytics': {
    title: 'Modern Data Analytics Pathway',
    steps: ['Python for Data', 'Advanced SQL & Data Warehousing', 'Descriptive & Inferential Statistics', 'Advanced Excel', 'Power BI / Tableau Visualizations', 'Data Storytelling & KPI Dashboards']
  },
  'Frontend': {
    title: 'Modern Frontend Engineering Pathway',
    steps: ['Semantic HTML & CSS Grid/Flexbox', 'Modern JavaScript (ES6+)', 'TypeScript Type Safety', 'React Component Architecture', 'Client State & Query Management', 'REST / GraphQL Integration', 'Web Performance & Accessibility']
  },
  'Cloud / DevOps': {
    title: 'Cloud & DevOps Engineering Pathway',
    steps: ['Linux Operating System & Bash Scripting', 'Git Version Control', 'Cloud Foundations (AWS/Azure)', 'Docker Containerization', 'CI/CD Pipelines (GitHub Actions)', 'Kubernetes Cluster Orchestration', 'Infrastructure as Code (Terraform)']
  },
  'Cybersecurity': {
    title: 'Cybersecurity & Defense Pathway',
    steps: ['Computer Networking & TCP/IP', 'Linux System Administration', 'Security Principles (CIA Triad)', 'Web Application Security (OWASP Top 10)', 'Vulnerability Assessment & Wireshark', 'Cloud Security & SIEM Fundamentals']
  }
};
