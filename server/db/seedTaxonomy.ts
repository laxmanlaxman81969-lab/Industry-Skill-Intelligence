// Hand-curated, database-backed role skill taxonomies for 28 industry roles
// Each record contains core skills with weights (1-10), nice-to-have skills, seniority signals, and real benchmark dates

import { RoleTaxonomyRecord } from '../types';

export const SEED_ROLE_TAXONOMIES: Record<string, RoleTaxonomyRecord> = {
  'java-backend-developer': {
    roleId: 'java-backend-developer',
    roleName: 'Java Backend Developer',
    category: 'Java Ecosystem',
    description: 'Enterprise server-side development, high-throughput microservices, concurrent architectures, and relational database systems.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Java', normalizedSkill: 'Java', weight: 10, category: 'Language', importance: 'Critical', description: 'Core OOP, Java 17+, JVM memory model, Concurrency, Collections framework, Streams.', keywords: ['java', 'jvm', 'multithreading', 'collections', 'streams', 'oop', 'java 8', 'java 17', 'java 21'] },
      { skill: 'Spring Boot', normalizedSkill: 'Spring Boot', weight: 10, category: 'Backend', importance: 'Critical', description: 'Microservices architecture, IoC, Dependency Injection, Spring Security, REST controller design.', keywords: ['spring boot', 'spring-boot', 'spring framework', 'springboot', 'ioc', 'dependency injection', 'spring mvc'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 9, category: 'Backend', importance: 'Critical', description: 'HTTP verbs, status code contracts, JSON serialization, endpoint security, and rate limiting.', keywords: ['rest', 'restful', 'rest api', 'endpoints', 'json', 'http methods', 'postman', 'swagger', 'crud'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 9, category: 'Database', importance: 'Critical', description: 'Complex joins, indexing strategies, query execution plans, transactions, and ACID compliance.', keywords: ['sql', 'mysql', 'postgresql', 'joins', 'queries', 'rdbms', 'oracle', 'subqueries', 'stored procedures'] },
      { skill: 'JPA / Hibernate', normalizedSkill: 'JPA / Hibernate', weight: 8, category: 'Backend', importance: 'High', description: 'Object-Relational Mapping, entity lifecycle, JPQL queries, and N+1 query mitigation.', keywords: ['jpa', 'hibernate', 'orm', 'entity', 'jpql', 'spring data', 'spring data jpa'] },
      { skill: 'Microservices', normalizedSkill: 'Microservices', weight: 8, category: 'Backend', importance: 'High', description: 'Distributed systems, API gateways, service discovery, resilient communication patterns.', keywords: ['microservice', 'microservices', 'distributed systems', 'eureka', 'api gateway', 'kafka', 'feign'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Distributed version control, branching models, PR review workflow, conflict resolution.', keywords: ['git', 'github', 'gitlab', 'version control', 'pull request', 'merge'] },
      { skill: 'Backend Testing (JUnit/Mockito)', normalizedSkill: 'Backend Testing (JUnit/Mockito)', weight: 7, category: 'Tools', importance: 'Medium', description: 'Unit testing, mocking interfaces, assertion coverage, and regression prevention.', keywords: ['junit', 'mockito', 'unit testing', 'test case', 'tdd', 'test', 'mock'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Containerizing Java JAR artifacts for containerized deployments.' },
      { skill: 'AWS / Cloud', normalizedSkill: 'AWS / Cloud', weight: 6, category: 'Cloud/DevOps', description: 'Deploying backend services to cloud compute (EC2, ECS) and managed RDS.' },
      { skill: 'Kafka / Redis', normalizedSkill: 'Kafka / Redis', weight: 6, category: 'Backend', description: 'Distributed pub/sub messaging and in-memory caching.' }
    ],
    senioritySignals: [
      { signal: 'Years of Experience', description: 'Demonstrated professional enterprise software development history.', weight: 4 },
      { signal: 'Production Deployment', description: 'Experience deploying and monitoring microservices in live customer production environments.', weight: 3 },
      { signal: 'System Design & Architecture', description: 'Designing modular, scalable, fault-tolerant enterprise services.', weight: 3 }
    ],
    criticalKeywords: ['java', 'spring boot', 'rest api', 'sql', 'jpa', 'hibernate', 'microservices', 'maven', 'git', 'junit'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Java 17 & Concurrency Mastery', skill: 'Java', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'Relational Database Design & SQL Optimization', skill: 'SQL', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Spring Boot RESTful Microservice Architecture', skill: 'Spring Boot', difficulty: 'Intermediate' },
      { stepNumber: 4, title: 'Enterprise Persistence with JPA & Hibernate', skill: 'JPA / Hibernate', difficulty: 'Intermediate' },
      { stepNumber: 5, title: 'Distributed Systems & Event-Driven Microservices', skill: 'Microservices', difficulty: 'Advanced' }
    ]
  },

  'java-full-stack-developer': {
    roleId: 'java-full-stack-developer',
    roleName: 'Java Full Stack Developer',
    category: 'Java Ecosystem',
    description: 'End-to-end full stack web application engineering with Java/Spring Boot on backend and modern frontend UI frameworks.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Java', normalizedSkill: 'Java', weight: 9, category: 'Language', importance: 'Critical', description: 'Backend business logic and object-oriented architectures.', keywords: ['java', 'jvm', 'oop', 'collections'] },
      { skill: 'Spring Boot', normalizedSkill: 'Spring Boot', weight: 9, category: 'Backend', importance: 'Critical', description: 'Microservices and REST API server engineering.', keywords: ['spring boot', 'springboot', 'spring'] },
      { skill: 'React.js', normalizedSkill: 'React.js', weight: 9, category: 'Frontend', importance: 'Critical', description: 'Component lifecycle, hooks, state management, SPA rendering.', keywords: ['react', 'react.js', 'reactjs', 'jsx', 'hooks'] },
      { skill: 'JavaScript / TypeScript', normalizedSkill: 'JavaScript / TypeScript', weight: 8, category: 'Language', importance: 'Critical', description: 'Client-side scripting, asynchronous event handling, type safety.', keywords: ['javascript', 'typescript', 'es6', 'js', 'ts'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'High', description: 'Relational data persistence, queries, and joins.', keywords: ['sql', 'mysql', 'postgresql'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'API contract bridging React frontend to Spring Boot backend.', keywords: ['rest', 'rest api', 'json', 'axios', 'fetch'] },
      { skill: 'HTML & CSS', normalizedSkill: 'HTML & CSS', weight: 7, category: 'Frontend', importance: 'Medium', description: 'Semantic structure and responsive styling.', keywords: ['html', 'css', 'tailwind', 'bootstrap'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 6, category: 'Tools', importance: 'Medium', description: 'Source version management.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 5, category: 'Cloud/DevOps', description: 'Containerized multi-container app execution.' },
      { skill: 'JPA / Hibernate', normalizedSkill: 'JPA / Hibernate', weight: 6, category: 'Backend', description: 'Entity relational mapping.' }
    ],
    senioritySignals: [
      { signal: 'Full Stack Integration', description: 'Experience delivering end-to-end features connecting UI with API and database.', weight: 4 },
      { signal: 'Clean Architecture', description: 'Clear separation of concerns between presentation and domain layers.', weight: 3 }
    ],
    criticalKeywords: ['java', 'spring boot', 'react', 'javascript', 'typescript', 'sql', 'rest api', 'html', 'css', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Full Stack Java & Spring Boot API Core', skill: 'Spring Boot', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'React 18 Component State & Hooks Architecture', skill: 'React.js', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Secure Full-Stack Integration (JWT & CORS)', skill: 'REST APIs', difficulty: 'Intermediate' }
    ]
  },

  'full-stack-developer': {
    roleId: 'full-stack-developer',
    roleName: 'Full Stack Developer',
    category: 'Full Stack',
    description: 'Modern web development spanning frontend user interfaces, backend API services, and database persistence.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'JavaScript / TypeScript', normalizedSkill: 'JavaScript / TypeScript', weight: 10, category: 'Language', importance: 'Critical', description: 'Universal JavaScript across client and server tiers.', keywords: ['javascript', 'typescript', 'es6', 'node.js', 'node'] },
      { skill: 'React.js', normalizedSkill: 'React.js', weight: 9, category: 'Frontend', importance: 'Critical', description: 'Reactive web component development.', keywords: ['react', 'react.js', 'redux', 'hooks'] },
      { skill: 'Node.js / Express', normalizedSkill: 'Node.js / Express', weight: 9, category: 'Backend', importance: 'Critical', description: 'Event-driven server runtime and HTTP routing.', keywords: ['node.js', 'node', 'express', 'express.js', 'nest.js'] },
      { skill: 'SQL / NoSQL', normalizedSkill: 'SQL / NoSQL', weight: 8, category: 'Database', importance: 'High', description: 'Data modeling in relational and document stores.', keywords: ['sql', 'mongodb', 'postgresql', 'mysql', 'mongoose'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'API design, CRUD patterns, and security headers.', keywords: ['rest', 'rest api', 'crud', 'graphql'] },
      { skill: 'HTML & CSS', normalizedSkill: 'HTML & CSS', weight: 7, category: 'Frontend', importance: 'Medium', description: 'Semantic markup and responsive layouts.', keywords: ['html', 'css', 'tailwind', 'flexbox'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'Medium', description: 'Code collaboration and version tracking.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Application containerization.' },
      { skill: 'CI/CD', normalizedSkill: 'CI/CD', weight: 5, category: 'Cloud/DevOps', description: 'Automated test and build pipelines.' }
    ],
    senioritySignals: [
      { signal: 'Production Applications', description: 'Track record of building and deploying publicly accessible web apps.', weight: 4 },
      { signal: 'API Security', description: 'Implementation of OAuth, JWT, CSRF, and input sanitization.', weight: 3 }
    ],
    criticalKeywords: ['javascript', 'typescript', 'react', 'node.js', 'express', 'sql', 'mongodb', 'rest api', 'html', 'css'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Modern JavaScript (ES6+) & TypeScript', skill: 'JavaScript / TypeScript', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'React Single Page App Engineering', skill: 'React.js', difficulty: 'Intermediate' },
      { stepNumber: 3, title: 'Node.js & Express RESTful Microservices', skill: 'Node.js / Express', difficulty: 'Intermediate' }
    ]
  },

  'react-developer': {
    roleId: 'react-developer',
    roleName: 'React Developer',
    category: 'Frontend & UI',
    description: 'Specialized frontend UI engineering using React 18, TypeScript, modern state management, and performant web interfaces.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'React.js & Hooks', normalizedSkill: 'React.js', weight: 10, category: 'Frontend', importance: 'Critical', description: 'Hooks (useState, useEffect, useMemo, useCallback, useRef), component architecture.', keywords: ['react', 'react.js', 'hooks', 'jsx', 'usestate', 'useeffect', 'usememo'] },
      { skill: 'TypeScript', normalizedSkill: 'TypeScript', weight: 9, category: 'Language', importance: 'Critical', description: 'Strict typing for component props, states, and API responses.', keywords: ['typescript', 'ts', 'interfaces', 'types', 'generics'] },
      { skill: 'State Management (Redux/Zustand)', normalizedSkill: 'State Management', weight: 9, category: 'Frontend', importance: 'Critical', description: 'Centralized global state patterns and async thunks.', keywords: ['redux', 'redux toolkit', 'zustand', 'context api', 'recoil'] },
      { skill: 'HTML5 & CSS / Tailwind', normalizedSkill: 'HTML & CSS', weight: 8, category: 'Frontend', importance: 'High', description: 'Modern responsive design and utility styling.', keywords: ['html', 'css', 'tailwind', 'styled-components'] },
      { skill: 'Routing & API Fetching', normalizedSkill: 'REST APIs', weight: 8, category: 'Frontend', importance: 'High', description: 'Client routing, caching queries, and Axios/Fetch handling.', keywords: ['react router', 'react query', 'axios', 'fetch', 'rest'] }
    ],
    niceToHaveSkills: [
      { skill: 'Testing (Jest/RTL)', normalizedSkill: 'Testing', weight: 6, category: 'Tools', description: 'Component testing with React Testing Library.' },
      { skill: 'Next.js / SSR', normalizedSkill: 'Next.js', weight: 6, category: 'Frontend', description: 'Server-side rendering and static site generation.' }
    ],
    senioritySignals: [
      { signal: 'Performance Optimization', description: 'Code splitting, memoization, lighthouse score optimization.', weight: 4 }
    ],
    criticalKeywords: ['react', 'hooks', 'typescript', 'redux', 'tailwind', 'javascript', 'react router', 'jest'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Mastering React 18 Concurrent Rendering & Hooks', skill: 'React.js', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'TypeScript for React Enterprise Applications', skill: 'TypeScript', difficulty: 'Intermediate' }
    ]
  },

  'data-analyst': {
    roleId: 'data-analyst',
    roleName: 'Data Analyst',
    category: 'Data & Analytics',
    description: 'Extracting, wrangling, and transforming business data into visual dashboards and quantitative insights for decision making.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 10, category: 'Database', importance: 'Critical', description: 'Window functions, CTEs, aggregation, group by, joins.', keywords: ['sql', 'mysql', 'postgresql', 'window functions', 'cte', 'joins', 'group by'] },
      { skill: 'Python (Pandas & NumPy)', normalizedSkill: 'Python', weight: 9, category: 'Data & AI', importance: 'Critical', description: 'Data frames, cleaning missing values, transformations, exploratory analysis.', keywords: ['python', 'pandas', 'numpy', 'eda', 'data cleaning', 'jupyter'] },
      { skill: 'Data Visualization (Power BI / Tableau)', normalizedSkill: 'Data Visualization', weight: 9, category: 'Data & AI', importance: 'Critical', description: 'KPI dashboards, interactive filtering, executive storytelling.', keywords: ['power bi', 'powerbi', 'tableau', 'matplotlib', 'seaborn', 'visualization', 'dashboards'] },
      { skill: 'Excel & Statistical Analysis', normalizedSkill: 'Excel', weight: 8, category: 'Data & AI', importance: 'High', description: 'Pivot tables, VLOOKUP, correlation, hypothesis testing.', keywords: ['excel', 'pivot table', 'vlookup', 'statistics', 'hypothesis testing', 'metrics'] },
      { skill: 'Business Metrics & KPIs', normalizedSkill: 'Business Analysis', weight: 7, category: 'Data & AI', importance: 'High', description: 'Revenue metrics, churn rates, user cohort analysis.', keywords: ['kpi', 'metrics', 'business analysis', 'reporting', 'insights', 'roi'] }
    ],
    niceToHaveSkills: [
      { skill: 'Data Warehousing (Snowflake/BigQuery)', normalizedSkill: 'Data Warehousing', weight: 6, category: 'Database', description: 'Cloud data warehouse analytics.' }
    ],
    senioritySignals: [
      { signal: 'Business Impact', description: 'Demonstrated business improvements driven by data recommendations.', weight: 4 }
    ],
    criticalKeywords: ['sql', 'python', 'pandas', 'power bi', 'tableau', 'excel', 'statistics', 'data analysis', 'dashboards'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Advanced SQL for Analytics: Window Functions & CTEs', skill: 'SQL', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'Python Data Wrangling with Pandas & NumPy', skill: 'Python', difficulty: 'Intermediate' }
    ]
  },

  'devops-engineer': {
    roleId: 'devops-engineer',
    roleName: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    description: 'Infrastructure automation, CI/CD pipelines, container orchestration, and cloud reliability engineering.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Docker & Containerization', normalizedSkill: 'Docker', weight: 10, category: 'Cloud/DevOps', importance: 'Critical', description: 'Multi-stage Dockerfiles, image caching, container networking.', keywords: ['docker', 'container', 'dockerfile', 'compose', 'containers'] },
      { skill: 'Kubernetes (K8s)', normalizedSkill: 'Kubernetes', weight: 10, category: 'Cloud/DevOps', importance: 'Critical', description: 'Pods, deployments, services, ingress, Helm, HPA.', keywords: ['kubernetes', 'k8s', 'kubectl', 'helm', 'ingress', 'pods'] },
      { skill: 'CI/CD Pipelines (GitHub Actions/Jenkins)', normalizedSkill: 'CI/CD', weight: 9, category: 'Cloud/DevOps', importance: 'Critical', description: 'Automated test, build, image push, and zero-downtime deployment.', keywords: ['ci/cd', 'github actions', 'jenkins', 'pipeline', 'gitlab ci'] },
      { skill: 'Infrastructure as Code (Terraform)', normalizedSkill: 'Terraform', weight: 9, category: 'Cloud/DevOps', importance: 'Critical', description: 'Declarative cloud provisioning and remote state management.', keywords: ['terraform', 'iac', 'ansible', 'cloudformation'] },
      { skill: 'Linux & Shell Scripting', normalizedSkill: 'Linux', weight: 8, category: 'Tools', importance: 'Critical', description: 'Bash automation, permissions, systemd, networking.', keywords: ['linux', 'bash', 'shell', 'ubuntu', 'cron', 'systemd'] }
    ],
    niceToHaveSkills: [
      { skill: 'AWS / Cloud Architecture', normalizedSkill: 'AWS / Cloud', weight: 8, category: 'Cloud/DevOps', description: 'VPC, EC2, IAM, S3, RDS.' },
      { skill: 'Monitoring (Prometheus/Grafana)', normalizedSkill: 'Monitoring', weight: 7, category: 'Cloud/DevOps', description: 'Telemetry and alert monitoring.' }
    ],
    senioritySignals: [
      { signal: 'Zero-Downtime Deployments', description: 'Blue/green or canary production deployment strategies.', weight: 4 }
    ],
    criticalKeywords: ['docker', 'kubernetes', 'ci/cd', 'terraform', 'linux', 'aws', 'github actions', 'jenkins'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Docker Multi-Stage Optimization & Security', skill: 'Docker', difficulty: 'Intermediate' },
      { stepNumber: 2, title: 'Kubernetes Production Orchestration & Scaling', skill: 'Kubernetes', difficulty: 'Advanced' }
    ]
  },

  'ai-engineer': {
    roleId: 'ai-engineer',
    roleName: 'AI Engineer',
    category: 'Data & AI',
    description: 'Developing LLM applications, Retrieval Augmented Generation (RAG) pipelines, vector search, and intelligent agent systems.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'LLMs & Prompt Engineering', normalizedSkill: 'LLMs', weight: 10, category: 'Data & AI', importance: 'Critical', description: 'Prompt construction, few-shot reasoning, temperature, token budgeting, fine-tuning.', keywords: ['llm', 'large language models', 'gpt', 'llama', 'openai', 'prompt engineering', 'genai'] },
      { skill: 'RAG & Vector Databases', normalizedSkill: 'RAG & Vector Databases', weight: 10, category: 'Data & AI', importance: 'Critical', description: 'Document chunking, embeddings, FAISS, Pinecone, ChromaDB, hybrid search.', keywords: ['rag', 'vector database', 'embeddings', 'pinecone', 'chroma', 'langchain', 'llamaindex'] },
      { skill: 'Python & AI Frameworks (LangChain/LlamaIndex)', normalizedSkill: 'Python', weight: 9, category: 'Data & AI', importance: 'Critical', description: 'Agent tool calling, streaming responses, FastAPI integration.', keywords: ['python', 'langchain', 'llamaindex', 'fastapi', 'huggingface'] },
      { skill: 'AI Evaluation & Guardrails', normalizedSkill: 'AI Evaluation', weight: 8, category: 'Security', importance: 'High', description: 'Hallucination mitigation, prompt injection defense, evaluation metrics.', keywords: ['guardrails', 'hallucination', 'evaluation', 'ragas', 'safety'] }
    ],
    niceToHaveSkills: [
      { skill: 'PyTorch / Fine-tuning', normalizedSkill: 'PyTorch', weight: 7, category: 'Data & AI', description: 'LoRA / PEFT model adaptation.' },
      { skill: 'Docker & Model Serving', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Serving models with vLLM / Triton.' }
    ],
    senioritySignals: [
      { signal: 'Production AI Applications', description: 'Shipped real-world AI applications with evaluation benchmarks and guardrails.', weight: 4 }
    ],
    criticalKeywords: ['llm', 'rag', 'vector database', 'langchain', 'python', 'embeddings', 'openai', 'prompt engineering'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Enterprise RAG Architecture & Vector Indexing', skill: 'RAG & Vector Databases', difficulty: 'Advanced' },
      { stepNumber: 2, title: 'Building Autonomous AI Agents with LangChain', skill: 'Python', difficulty: 'Advanced' }
    ]
  },

  'cloud-engineer': {
    roleId: 'cloud-engineer',
    roleName: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    description: 'Cloud architecture design, resource provisioning, security compliance, and disaster recovery across AWS/Azure/GCP.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'AWS / Cloud Core Services', normalizedSkill: 'AWS / Cloud', weight: 10, category: 'Cloud/DevOps', importance: 'Critical', description: 'Compute (EC2), Storage (S3), Networking (VPC), Database (RDS), IAM security.', keywords: ['aws', 'cloud', 'ec2', 's3', 'vpc', 'iam', 'rds', 'azure', 'gcp'] },
      { skill: 'Infrastructure as Code (Terraform)', normalizedSkill: 'Terraform', weight: 9, category: 'Cloud/DevOps', importance: 'Critical', description: 'Modular declarative provisioning of multi-region cloud resources.', keywords: ['terraform', 'iac', 'cloudformation'] },
      { skill: 'Cloud Networking & Security', normalizedSkill: 'Cloud Security', weight: 9, category: 'Security', importance: 'Critical', description: 'Subnets, security groups, NACLs, VPN, SSL certificates, least-privilege IAM.', keywords: ['networking', 'security groups', 'nacl', 'vpn', 'security', 'firewall'] },
      { skill: 'Docker & Container Services', normalizedSkill: 'Docker', weight: 8, category: 'Cloud/DevOps', importance: 'High', description: 'ECS, EKS, or AKS containerized workload hosting.', keywords: ['docker', 'ecs', 'eks', 'containers'] }
    ],
    niceToHaveSkills: [
      { skill: 'Serverless (Lambda)', normalizedSkill: 'Serverless', weight: 7, category: 'Cloud/DevOps', description: 'Event-driven serverless architectures.' }
    ],
    senioritySignals: [
      { signal: 'Cloud Cost Optimization', description: 'Right-sizing and architecting high-availability systems with budget controls.', weight: 4 }
    ],
    criticalKeywords: ['aws', 'cloud', 'terraform', 'vpc', 'ec2', 's3', 'iam', 'docker'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'AWS Cloud Architecture & IAM Hardening', skill: 'AWS / Cloud Core Services', difficulty: 'Intermediate' }
    ]
  },

  'data-scientist': {
    roleId: 'data-scientist',
    roleName: 'Data Scientist',
    category: 'Data & Analytics',
    description: 'Statistical modeling, predictive machine learning, experiment design, and feature engineering.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Python (NumPy, Pandas, Scikit-Learn)', normalizedSkill: 'Python', weight: 10, category: 'Data & AI', importance: 'Critical', description: 'Data modeling, regression, classification, clustering, cross-validation.', keywords: ['python', 'pandas', 'numpy', 'scikit-learn', 'scikit', 'machine learning'] },
      { skill: 'Statistics & Probability', normalizedSkill: 'Statistics', weight: 9, category: 'Data & AI', importance: 'Critical', description: 'Hypothesis testing, distributions, p-values, A/B test analysis.', keywords: ['statistics', 'probability', 'hypothesis testing', 'a/b testing', 'regression'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 9, category: 'Database', importance: 'Critical', description: 'Data extraction, aggregations, feature table generation.', keywords: ['sql', 'queries', 'joins', 'analytics'] },
      { skill: 'Model Evaluation & Validation', normalizedSkill: 'Machine Learning', weight: 8, category: 'Data & AI', importance: 'High', description: 'ROC-AUC, Precision, Recall, F1 score, MSE, preventing overfitting.', keywords: ['evaluation', 'roc-auc', 'precision', 'recall', 'cross validation', 'overfitting'] }
    ],
    niceToHaveSkills: [
      { skill: 'Deep Learning (TensorFlow/PyTorch)', normalizedSkill: 'PyTorch', weight: 7, category: 'Data & AI', description: 'Neural networks and deep learning models.' }
    ],
    senioritySignals: [
      { signal: 'Predictive Model Accuracy', description: 'Deploying statistically validated models delivering measurable business lift.', weight: 4 }
    ],
    criticalKeywords: ['python', 'machine learning', 'statistics', 'sql', 'scikit-learn', 'pandas', 'a/b testing'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Applied Machine Learning & Statistical Validation', skill: 'Python', difficulty: 'Intermediate' }
    ]
  },

  'java-developer': {
    roleId: 'java-developer',
    roleName: 'Java Developer',
    category: 'Software Engineering & Backend',
    description: 'Core Java application development, object-oriented design, multithreading, collections, and database persistence.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Java', normalizedSkill: 'Java', weight: 10, category: 'Language', importance: 'Critical', description: 'Core Java, OOP principles, collections framework, exception handling, multithreading, and streams API.', keywords: ['java', 'jvm', 'multithreading', 'collections', 'streams', 'oop'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'Critical', description: 'Relational databases, joins, queries, and transaction management.', keywords: ['sql', 'mysql', 'postgresql', 'joins', 'queries'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'HTTP RESTful service development and JSON payloads.', keywords: ['rest', 'rest api', 'json'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Source code versioning and collaborative workflows.', keywords: ['git', 'github'] },
      { skill: 'Backend Testing (JUnit/Mockito)', normalizedSkill: 'Backend Testing (JUnit/Mockito)', weight: 7, category: 'Tools', importance: 'Medium', description: 'Unit testing and test case development.', keywords: ['junit', 'mockito', 'unit testing'] }
    ],
    niceToHaveSkills: [
      { skill: 'Spring Boot', normalizedSkill: 'Spring Boot', weight: 6, category: 'Backend', description: 'Spring framework foundations.' },
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 5, category: 'Cloud/DevOps', description: 'Containerization.' }
    ],
    senioritySignals: [
      { signal: 'Clean Code Practices', description: 'Writing modular, readable, and maintainable Java code.', weight: 3 }
    ],
    criticalKeywords: ['java', 'sql', 'rest api', 'git', 'junit', 'maven'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Core Java Concurrency & Collections', skill: 'Java', difficulty: 'Intermediate' }
    ]
  },

  'spring-boot-developer': {
    roleId: 'spring-boot-developer',
    roleName: 'Spring Boot Developer',
    category: 'Software Engineering & Backend',
    description: 'Specialized enterprise microservices engineering using Spring Boot, Spring Cloud, Spring Data JPA, and secure REST APIs.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Spring Boot', normalizedSkill: 'Spring Boot', weight: 10, category: 'Backend', importance: 'Critical', description: 'Microservices, Spring MVC, auto-configuration, dependency injection, and actuators.', keywords: ['spring boot', 'springboot', 'spring', 'spring framework', 'ioc'] },
      { skill: 'Java', normalizedSkill: 'Java', weight: 9, category: 'Language', importance: 'Critical', description: 'Modern Java features, OOP, streams, and concurrency.', keywords: ['java', 'jvm', 'streams', 'multithreading'] },
      { skill: 'JPA / Hibernate', normalizedSkill: 'JPA / Hibernate', weight: 9, category: 'Backend', importance: 'Critical', description: 'Spring Data JPA, entity relationships, JPQL, and connection pooling.', keywords: ['jpa', 'hibernate', 'spring data jpa', 'orm'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 9, category: 'Backend', importance: 'Critical', description: 'REST controllers, exception handling, OpenAPI/Swagger docs.', keywords: ['rest', 'rest api', 'swagger', 'postman'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'High', description: 'Relational data modeling, indexing, and transactional integrity.', keywords: ['sql', 'mysql', 'postgresql'] }
    ],
    niceToHaveSkills: [
      { skill: 'Microservices', normalizedSkill: 'Microservices', weight: 7, category: 'Backend', description: 'Spring Cloud Netflix, Eureka, API gateway.' },
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Containerized Java applications.' }
    ],
    senioritySignals: [
      { signal: 'Microservices Architecture', description: 'Designing loosely coupled, distributed services.', weight: 4 }
    ],
    criticalKeywords: ['spring boot', 'java', 'jpa', 'hibernate', 'rest api', 'sql'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Spring Boot Microservices & Security', skill: 'Spring Boot', difficulty: 'Intermediate' }
    ]
  },

  'backend-developer': {
    roleId: 'backend-developer',
    roleName: 'Backend Developer',
    category: 'Software Engineering & Backend',
    description: 'Server-side API architectures, data pipelines, caching, authentication, and database query optimization.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 10, category: 'Backend', importance: 'Critical', description: 'API architecture, HTTP protocols, rate limiting, and caching.', keywords: ['rest', 'rest api', 'endpoints', 'json', 'crud'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 9, category: 'Database', importance: 'Critical', description: 'Relational database schema design and query tuning.', keywords: ['sql', 'mysql', 'postgresql', 'joins', 'queries'] },
      { skill: 'Java', normalizedSkill: 'Java', weight: 8, category: 'Language', importance: 'Critical', description: 'Backend programming language (Java/Python/Node).', keywords: ['java', 'python', 'node.js', 'backend'] },
      { skill: 'Microservices', normalizedSkill: 'Microservices', weight: 8, category: 'Backend', importance: 'High', description: 'Distributed systems and service decomposition.', keywords: ['microservices', 'distributed systems'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Version control and CI collaboration.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Containerized deployment.' },
      { skill: 'Redis / Caching', normalizedSkill: 'Kafka / Redis', weight: 6, category: 'Backend', description: 'High-speed distributed cache.' }
    ],
    senioritySignals: [
      { signal: 'API Scalability', description: 'Designing services handling high concurrent request volumes.', weight: 4 }
    ],
    criticalKeywords: ['rest api', 'sql', 'backend', 'microservices', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Enterprise Backend API Architecture', skill: 'REST APIs', difficulty: 'Intermediate' }
    ]
  },

  'software-developer': {
    roleId: 'software-developer',
    roleName: 'Software Developer',
    category: 'Software Engineering & Backend',
    description: 'General software development, algorithmic problem solving, object-oriented design, and application features.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Java', normalizedSkill: 'Java', weight: 9, category: 'Language', importance: 'Critical', description: 'Programming fundamentals, algorithms, and OOP.', keywords: ['java', 'c++', 'python', 'oop', 'dsa'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'Critical', description: 'Database queries and CRUD operations.', keywords: ['sql', 'mysql', 'database'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'Client-server communication and API consumption.', keywords: ['rest', 'rest api', 'api'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Branching and source code tracking.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'HTML & CSS', normalizedSkill: 'HTML & CSS', weight: 6, category: 'Frontend', description: 'Basic web interface design.' }
    ],
    senioritySignals: [
      { signal: 'Problem Solving', description: 'Data structures, algorithm complexity, and bug diagnosis.', weight: 4 }
    ],
    criticalKeywords: ['java', 'sql', 'git', 'rest api', 'dsa'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Applied Data Structures & OOP Software Engineering', skill: 'Java', difficulty: 'Intermediate' }
    ]
  },

  'software-engineer': {
    roleId: 'software-engineer',
    roleName: 'Software Engineer',
    category: 'Software Engineering & Backend',
    description: 'Engineering resilient systems, clean code architectures, software patterns, and unit-tested components.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Java', normalizedSkill: 'Java', weight: 9, category: 'Language', importance: 'Critical', description: 'Modern software engineering principles and OOP patterns.', keywords: ['java', 'software engineering', 'oop', 'design patterns'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'Critical', description: 'Relational data management and indexing.', keywords: ['sql', 'queries', 'database'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'API architecture and microservices interaction.', keywords: ['rest', 'rest api', 'endpoints'] },
      { skill: 'Backend Testing (JUnit/Mockito)', normalizedSkill: 'Backend Testing (JUnit/Mockito)', weight: 8, category: 'Tools', importance: 'High', description: 'Automated test suite creation and TDD.', keywords: ['junit', 'testing', 'unit test'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Version control workflows.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Containerized deployment.' }
    ],
    senioritySignals: [
      { signal: 'System Architecture', description: 'Component design, modularization, and code quality standards.', weight: 4 }
    ],
    criticalKeywords: ['software engineering', 'java', 'sql', 'rest api', 'testing', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Enterprise Software Engineering Architecture', skill: 'Java', difficulty: 'Intermediate' }
    ]
  },

  'frontend-developer': {
    roleId: 'frontend-developer',
    roleName: 'Frontend Developer',
    category: 'Full Stack & Web',
    description: 'Web user interface development, responsive layout design, client-side state handling, and browser performance.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'HTML & CSS', normalizedSkill: 'HTML & CSS', weight: 10, category: 'Frontend', importance: 'Critical', description: 'Semantic HTML5, CSS3, Flexbox, CSS Grid, responsive design.', keywords: ['html', 'html5', 'css', 'css3', 'flexbox', 'grid', 'responsive'] },
      { skill: 'JavaScript / TypeScript', normalizedSkill: 'JavaScript / TypeScript', weight: 10, category: 'Language', importance: 'Critical', description: 'DOM manipulation, ES6+, async/await, closures, event loop.', keywords: ['javascript', 'typescript', 'es6', 'js', 'dom'] },
      { skill: 'React.js', normalizedSkill: 'React.js', weight: 9, category: 'Frontend', importance: 'Critical', description: 'Component-based UI engineering, props, state, and hooks.', keywords: ['react', 'react.js', 'hooks', 'jsx'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Frontend', importance: 'High', description: 'Consuming RESTful APIs, fetch/axios, handling loading and error states.', keywords: ['rest', 'fetch', 'axios', 'api'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Frontend repository version tracking.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Testing (Jest/RTL)', normalizedSkill: 'Testing', weight: 6, category: 'Tools', description: 'Frontend unit testing.' }
    ],
    senioritySignals: [
      { signal: 'Responsive UX', description: 'Delivering flawless visual interfaces across mobile and desktop viewports.', weight: 4 }
    ],
    criticalKeywords: ['html', 'css', 'javascript', 'typescript', 'react', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Modern Frontend Architecture with React & TypeScript', skill: 'React.js', difficulty: 'Intermediate' }
    ]
  },

  'web-developer': {
    roleId: 'web-developer',
    roleName: 'Web Developer',
    category: 'Full Stack & Web',
    description: 'Website and web application design, responsive HTML/CSS layouts, JavaScript interactivity, and CMS/backend integration.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'HTML & CSS', normalizedSkill: 'HTML & CSS', weight: 10, category: 'Frontend', importance: 'Critical', description: 'Web structuring, typography, responsive styling, and UI layouts.', keywords: ['html', 'css', 'bootstrap', 'tailwind'] },
      { skill: 'JavaScript / TypeScript', normalizedSkill: 'JavaScript / TypeScript', weight: 9, category: 'Language', importance: 'Critical', description: 'Interactive browser functionality, event listeners, form validation.', keywords: ['javascript', 'es6', 'js'] },
      { skill: 'React.js', normalizedSkill: 'React.js', weight: 8, category: 'Frontend', importance: 'High', description: 'Modern single page web applications.', keywords: ['react', 'react.js'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Code management.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 6, category: 'Database', description: 'Basic database data retrieval.' }
    ],
    senioritySignals: [
      { signal: 'Cross-Browser Compatibility', description: 'Building accessible, fast-loading sites across all major browsers.', weight: 3 }
    ],
    criticalKeywords: ['html', 'css', 'javascript', 'react', 'web'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Responsive Modern Web Development Mastery', skill: 'HTML & CSS', difficulty: 'Intermediate' }
    ]
  },

  'python-developer': {
    roleId: 'python-developer',
    roleName: 'Python Developer',
    category: 'Python Ecosystem',
    description: 'Python application engineering, script automation, data processing, and object-oriented backend programming.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Python (Pandas & NumPy)', normalizedSkill: 'Python', weight: 10, category: 'Language', importance: 'Critical', description: 'Core Python, OOP, data structures, generators, decorators, and virtual environments.', keywords: ['python', 'python 3', 'oop', 'scripts'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'Critical', description: 'Relational database queries and ORMs (SQLAlchemy).', keywords: ['sql', 'postgresql', 'mysql', 'sqlite'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'Building web APIs with FastAPI or Flask.', keywords: ['rest', 'rest api', 'fastapi', 'flask'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Version control.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Packaging Python services in Docker containers.' }
    ],
    senioritySignals: [
      { signal: 'Pythonic Code Quality', description: 'Idiomatic Python, PEP 8 compliance, and high-performance algorithms.', weight: 3 }
    ],
    criticalKeywords: ['python', 'sql', 'rest api', 'fastapi', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Advanced Python OOP & API Engineering', skill: 'Python (Pandas & NumPy)', difficulty: 'Intermediate' }
    ]
  },

  'python-backend-developer': {
    roleId: 'python-backend-developer',
    roleName: 'Python Backend Developer',
    category: 'Python Ecosystem',
    description: 'High-performance Python backend services, asynchronous APIs using FastAPI/Django, and scalable database connections.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Python (Pandas & NumPy)', normalizedSkill: 'Python', weight: 10, category: 'Language', importance: 'Critical', description: 'Asynchronous Python, asyncio, Pydantic, and backend architectures.', keywords: ['python', 'asyncio', 'pydantic', 'fastapi', 'django'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 9, category: 'Backend', importance: 'Critical', description: 'FastAPI/Django REST framework, JWT auth, and status codes.', keywords: ['fastapi', 'django', 'rest', 'rest api'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 9, category: 'Database', importance: 'Critical', description: 'PostgreSQL, SQLAlchemy, Alembic migrations, query optimization.', keywords: ['sql', 'postgresql', 'sqlalchemy', 'orm'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Code collaboration.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 7, category: 'Cloud/DevOps', description: 'Containerized deployment with Gunicorn/Uvicorn.' }
    ],
    senioritySignals: [
      { signal: 'Asynchronous API Performance', description: 'Building low-latency asynchronous microservices.', weight: 4 }
    ],
    criticalKeywords: ['python', 'fastapi', 'django', 'sql', 'rest api', 'docker'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Asynchronous Python Backend Microservices with FastAPI', skill: 'Python (Pandas & NumPy)', difficulty: 'Intermediate' }
    ]
  },

  'machine-learning-engineer': {
    roleId: 'machine-learning-engineer',
    roleName: 'Machine Learning Engineer',
    category: 'Data Science & Artificial Intelligence',
    description: 'Training, evaluating, and deploying predictive machine learning models into scalable production pipelines.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Python (Pandas & NumPy)', normalizedSkill: 'Python', weight: 10, category: 'Data & AI', importance: 'Critical', description: 'NumPy, Pandas, Scikit-Learn, PyTorch, model training pipelines.', keywords: ['python', 'scikit-learn', 'pytorch', 'tensorflow', 'pandas', 'numpy'] },
      { skill: 'Statistics & Probability', normalizedSkill: 'Statistics', weight: 9, category: 'Data & AI', importance: 'Critical', description: 'Mathematical foundations, loss functions, optimization, gradient descent.', keywords: ['statistics', 'probability', 'math', 'calculus'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'Critical', description: 'Feature table queries and training dataset generation.', keywords: ['sql', 'queries', 'feature engineering'] },
      { skill: 'Docker & Containerization', normalizedSkill: 'Docker', weight: 8, category: 'Cloud/DevOps', importance: 'High', description: 'Packaging ML inference endpoints for deployment.', keywords: ['docker', 'model serving', 'api'] }
    ],
    niceToHaveSkills: [
      { skill: 'MLOps', normalizedSkill: 'CI/CD', weight: 7, category: 'Cloud/DevOps', description: 'Model registry, drift monitoring, MLflow.' }
    ],
    senioritySignals: [
      { signal: 'Production ML Serving', description: 'Deploying real-time or batch inference models to live traffic.', weight: 4 }
    ],
    criticalKeywords: ['machine learning', 'python', 'scikit-learn', 'pytorch', 'statistics', 'docker'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'End-to-End Machine Learning Systems & Deployment', skill: 'Python (Pandas & NumPy)', difficulty: 'Advanced' }
    ]
  },

  'cloud-support-engineer': {
    roleId: 'cloud-support-engineer',
    roleName: 'Cloud Support Engineer',
    category: 'Cloud & DevOps',
    description: 'Troubleshooting cloud infrastructure incidents, network configurations, server logs, and customer deployments.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'AWS / Cloud Core Services', normalizedSkill: 'AWS / Cloud', weight: 10, category: 'Cloud/DevOps', importance: 'Critical', description: 'EC2, S3, CloudWatch, VPC, Route53, IAM diagnosis.', keywords: ['aws', 'cloud', 'ec2', 's3', 'cloudwatch'] },
      { skill: 'Linux & Shell Scripting', normalizedSkill: 'Linux', weight: 9, category: 'Tools', importance: 'Critical', description: 'Server troubleshooting, log inspection, systemd, networking tools (netstat, curl).', keywords: ['linux', 'bash', 'shell', 'logs'] },
      { skill: 'Cloud Networking & Security', normalizedSkill: 'Cloud Security', weight: 8, category: 'Security', importance: 'High', description: 'Security groups, DNS resolution, SSL certificates, load balancers.', keywords: ['networking', 'dns', 'firewall', 'security'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Container logs and health checks.' }
    ],
    senioritySignals: [
      { signal: 'Incident Root Cause Analysis', description: 'Debugging production outages and writing clear RCA post-mortems.', weight: 4 }
    ],
    criticalKeywords: ['aws', 'cloud', 'linux', 'cloudwatch', 'networking'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Cloud Infrastructure Incident Troubleshooting', skill: 'AWS / Cloud Core Services', difficulty: 'Intermediate' }
    ]
  },

  'database-developer': {
    roleId: 'database-developer',
    roleName: 'Database Developer',
    category: 'Database Engineering',
    description: 'Relational database schema modeling, stored procedures, complex query tuning, CTEs, and transactional consistency.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 10, category: 'Database', importance: 'Critical', description: 'Advanced SQL, stored procedures, triggers, views, indexing, EXPLAIN plan tuning.', keywords: ['sql', 'stored procedures', 'triggers', 'indexes', 'optimization', 'postgresql', 'mysql', 'oracle'] },
      { skill: 'Relational Schema Design', normalizedSkill: 'SQL', weight: 9, category: 'Database', importance: 'Critical', description: 'Normalization (1NF-BCNF), foreign keys, constraint design, ER diagrams.', keywords: ['normalization', 'schema', 'er diagram', 'constraints'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 6, category: 'Tools', importance: 'Medium', description: 'Database migration scripts tracking.', keywords: ['git'] }
    ],
    niceToHaveSkills: [
      { skill: 'Python / Scripting', normalizedSkill: 'Python', weight: 6, category: 'Language', description: 'ETL script automation.' }
    ],
    senioritySignals: [
      { signal: 'High-Volume Query Tuning', description: 'Optimizing slow queries on tables with millions of rows.', weight: 4 }
    ],
    criticalKeywords: ['sql', 'database', 'indexes', 'stored procedures', 'normalization'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Advanced Relational Database Tuning & Architecture', skill: 'SQL', difficulty: 'Intermediate' }
    ]
  },

  'sql-developer': {
    roleId: 'sql-developer',
    roleName: 'SQL Developer',
    category: 'Database Engineering',
    description: 'Writing high-performance SQL queries, reporting scripts, data extracts, and business intelligence views.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 10, category: 'Database', importance: 'Critical', description: 'Joins, subqueries, window functions, aggregations, CTEs, and query optimization.', keywords: ['sql', 'joins', 'queries', 'mysql', 'postgresql', 'cte', 'window functions'] },
      { skill: 'Excel & Statistical Analysis', normalizedSkill: 'Excel', weight: 7, category: 'Data & AI', importance: 'High', description: 'Exporting and validating query outputs.', keywords: ['excel', 'csv', 'reporting'] }
    ],
    niceToHaveSkills: [
      { skill: 'Python', normalizedSkill: 'Python', weight: 6, category: 'Language', description: 'Data extraction scripts.' }
    ],
    senioritySignals: [
      { signal: 'Query Efficiency', description: 'Minimizing full table scans through smart indexing and joins.', weight: 4 }
    ],
    criticalKeywords: ['sql', 'joins', 'queries', 'database', 'reports'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'SQL Query Mastery & Analytical Functions', skill: 'SQL', difficulty: 'Intermediate' }
    ]
  },

  'qa-engineer': {
    roleId: 'qa-engineer',
    roleName: 'QA Engineer',
    category: 'Quality Assurance & Testing',
    description: 'Software quality assurance, functional test cases, defect tracking, API testing, and regression verification.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Backend Testing (JUnit/Mockito)', normalizedSkill: 'Backend Testing (JUnit/Mockito)', weight: 10, category: 'Tools', importance: 'Critical', description: 'Test planning, test cases, boundary value analysis, regression suites.', keywords: ['qa', 'testing', 'test case', 'bug tracking', 'jira', 'regression'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 9, category: 'Backend', importance: 'Critical', description: 'API testing with Postman, validating status codes, and JSON schemas.', keywords: ['postman', 'api testing', 'rest', 'endpoints'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'High', description: 'Database verification of persisted state.', keywords: ['sql', 'queries', 'validation'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Version control.', keywords: ['git'] }
    ],
    niceToHaveSkills: [
      { skill: 'Selenium / Automation', normalizedSkill: 'Testing', weight: 7, category: 'Tools', description: 'Automated browser testing.' }
    ],
    senioritySignals: [
      { signal: 'Zero-Defect Delivery', description: 'Thorough test coverage preventing production regressions.', weight: 4 }
    ],
    criticalKeywords: ['qa', 'testing', 'test case', 'postman', 'jira', 'sql'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Modern QA Engineering & API Test Automation', skill: 'Backend Testing (JUnit/Mockito)', difficulty: 'Intermediate' }
    ]
  },

  'automation-test-engineer': {
    roleId: 'automation-test-engineer',
    roleName: 'Automation Test Engineer',
    category: 'Quality Assurance & Testing',
    description: 'Developing automated test frameworks, Selenium/Playwright scripts, API automation, and CI integration.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Backend Testing (JUnit/Mockito)', normalizedSkill: 'Backend Testing (JUnit/Mockito)', weight: 10, category: 'Tools', importance: 'Critical', description: 'Test automation frameworks (Selenium, Playwright, Cypress, TestNG).', keywords: ['selenium', 'playwright', 'cypress', 'testng', 'automation', 'test framework'] },
      { skill: 'Java', normalizedSkill: 'Java', weight: 9, category: 'Language', importance: 'Critical', description: 'Test script programming language (Java or Python).', keywords: ['java', 'python', 'oop'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'Automated API testing (RestAssured).', keywords: ['restassured', 'postman', 'api testing'] },
      { skill: 'CI/CD Pipelines (GitHub Actions/Jenkins)', normalizedSkill: 'CI/CD', weight: 8, category: 'Cloud/DevOps', importance: 'High', description: 'Triggering automated test suites on pull requests.', keywords: ['jenkins', 'github actions', 'ci/cd'] }
    ],
    niceToHaveSkills: [
      { skill: 'Docker', normalizedSkill: 'Docker', weight: 6, category: 'Cloud/DevOps', description: 'Running headless test containers.' }
    ],
    senioritySignals: [
      { signal: 'Framework Architecture', description: 'Designing reusable Page Object Model (POM) automation frameworks.', weight: 4 }
    ],
    criticalKeywords: ['automation', 'selenium', 'playwright', 'java', 'ci/cd', 'restassured'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Building Automated End-to-End Test Frameworks', skill: 'Backend Testing (JUnit/Mockito)', difficulty: 'Intermediate' }
    ]
  },

  'software-testing-engineer': {
    roleId: 'software-testing-engineer',
    roleName: 'Software Testing Engineer',
    category: 'Quality Assurance & Testing',
    description: 'Software test lifecycle execution, manual and automated verification, bug reporting, and user acceptance testing.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Backend Testing (JUnit/Mockito)', normalizedSkill: 'Backend Testing (JUnit/Mockito)', weight: 10, category: 'Tools', importance: 'Critical', description: 'Test cases, test scenarios, bug life cycle, functional testing.', keywords: ['testing', 'test case', 'manual testing', 'bug reporting'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 8, category: 'Backend', importance: 'High', description: 'API payload testing.', keywords: ['postman', 'api'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'High', description: 'Data validation queries.', keywords: ['sql', 'database'] }
    ],
    niceToHaveSkills: [
      { skill: 'Git', normalizedSkill: 'Git', weight: 6, category: 'Tools', description: 'Version control.' }
    ],
    senioritySignals: [
      { signal: 'Test Case Depth', description: 'Comprehensive edge-case and boundary value test scenarios.', weight: 3 }
    ],
    criticalKeywords: ['testing', 'test case', 'postman', 'sql', 'qa'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Comprehensive Software Quality Testing Strategies', skill: 'Backend Testing (JUnit/Mockito)', difficulty: 'Intermediate' }
    ]
  },

  'mobile-app-developer': {
    roleId: 'mobile-app-developer',
    roleName: 'Mobile App Developer',
    category: 'Mobile Development',
    description: 'Cross-platform or native mobile app development, UI rendering, device storage, and API integration.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'React.js', normalizedSkill: 'React.js', weight: 10, category: 'Frontend', importance: 'Critical', description: 'React Native / Flutter mobile component development.', keywords: ['react native', 'flutter', 'mobile', 'android', 'ios'] },
      { skill: 'JavaScript / TypeScript', normalizedSkill: 'JavaScript / TypeScript', weight: 9, category: 'Language', importance: 'Critical', description: 'Mobile app scripting, async operations, state management.', keywords: ['javascript', 'typescript', 'dart'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 9, category: 'Backend', importance: 'Critical', description: 'Mobile network API requests, offline data caching.', keywords: ['rest', 'api', 'json'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Repository management.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'App Store Deployment', normalizedSkill: 'CI/CD', weight: 6, category: 'Tools', description: 'Google Play & Apple App Store submission.' }
    ],
    senioritySignals: [
      { signal: 'Mobile Performance', description: 'Smooth 60fps animations and low battery/memory consumption.', weight: 4 }
    ],
    criticalKeywords: ['react native', 'flutter', 'mobile', 'javascript', 'rest api'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Cross-Platform Mobile App Engineering with React Native', skill: 'React.js', difficulty: 'Intermediate' }
    ]
  },

  'android-developer': {
    roleId: 'android-developer',
    roleName: 'Android Developer',
    category: 'Mobile Development',
    description: 'Native Android application development using Kotlin/Java, Android SDK, Jetpack Compose, and Room database.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Java', normalizedSkill: 'Java', weight: 10, category: 'Language', importance: 'Critical', description: 'Java / Kotlin for Android, activities, fragments, lifecycles, and viewmodels.', keywords: ['android', 'kotlin', 'java', 'android sdk', 'jetpack compose'] },
      { skill: 'REST APIs', normalizedSkill: 'REST APIs', weight: 9, category: 'Backend', importance: 'Critical', description: 'Retrofit / OkHttp REST integration and JSON serialization.', keywords: ['retrofit', 'rest', 'api', 'json'] },
      { skill: 'SQL', normalizedSkill: 'SQL', weight: 8, category: 'Database', importance: 'High', description: 'SQLite / Room local database persistence.', keywords: ['sqlite', 'room', 'sql'] },
      { skill: 'Git', normalizedSkill: 'Git', weight: 7, category: 'Tools', importance: 'High', description: 'Android Studio version control.', keywords: ['git', 'github'] }
    ],
    niceToHaveSkills: [
      { skill: 'Jetpack Compose', normalizedSkill: 'React.js', weight: 7, category: 'Frontend', description: 'Declarative modern Android UI.' }
    ],
    senioritySignals: [
      { signal: 'Native App Stability', description: 'Crash-free sessions and background service battery optimization.', weight: 4 }
    ],
    criticalKeywords: ['android', 'kotlin', 'java', 'retrofit', 'room', 'git'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Modern Native Android Engineering with Kotlin & Jetpack', skill: 'Java', difficulty: 'Intermediate' }
    ]
  },

  'cybersecurity-analyst': {
    roleId: 'cybersecurity-analyst',
    roleName: 'Cybersecurity Analyst',
    category: 'Cybersecurity',
    description: 'Vulnerability assessment, security log monitoring, penetration testing, authentication defense, and threat mitigation.',
    taxonomyVersion: '2026.3.1',
    lastUpdated: '2026-03-01',
    active: true,
    coreSkills: [
      { skill: 'Cloud Networking & Security', normalizedSkill: 'Cloud Security', weight: 10, category: 'Security', importance: 'Critical', description: 'Network security, firewalls, TLS/SSL, vulnerability scans, OWASP Top 10.', keywords: ['security', 'cybersecurity', 'owasp', 'vulnerability', 'penetration testing', 'firewall'] },
      { skill: 'Linux & Shell Scripting', normalizedSkill: 'Linux', weight: 9, category: 'Tools', importance: 'Critical', description: 'Security log forensics, Wireshark, Nmap, bash automation.', keywords: ['linux', 'wireshark', 'nmap', 'security logs'] },
      { skill: 'Python (Pandas & NumPy)', normalizedSkill: 'Python', weight: 8, category: 'Language', importance: 'High', description: 'Security automation scripting.', keywords: ['python', 'scripting'] }
    ],
    niceToHaveSkills: [
      { skill: 'SIEM (Splunk/ELK)', normalizedSkill: 'Monitoring', weight: 7, category: 'Tools', description: 'Security Information and Event Management.' }
    ],
    senioritySignals: [
      { signal: 'Threat Mitigation', description: 'Resolving critical CVEs and hardening network attack surfaces.', weight: 4 }
    ],
    criticalKeywords: ['cybersecurity', 'security', 'owasp', 'linux', 'networking'],
    defaultRoadmap: [
      { stepNumber: 1, title: 'Enterprise Network Security & OWASP Defense', skill: 'Cloud Networking & Security', difficulty: 'Intermediate' }
    ]
  }
};

