import { RoadmapAssessment, RoadmapModule, RoadmapProject, TechnologyRoadmap, UserRoadmapProgress } from '../roadmapTypes';
import { getAuthoredLessons } from '../data/lessonIntegration';
import { generateLessonsForTopic } from './roadmapContentGenerator';

type LessonContent = Omit<import('../roadmapTypes').RoadmapLesson, 'id' | 'title'>;

const content = (technology: string, title: string, summary: string, language: string, code: string, overrides: Partial<LessonContent> = {}): LessonContent => ({
  summary,
  introduction: summary,
  whyItMatters: `Understanding ${title} helps you make reliable design decisions in ${technology} applications instead of relying on trial and error.`,
  howItWorks: `${title} is applied through the language or framework rules of ${technology}; trace the example from input to result and then adapt it to your own domain model.`,
  syntax: code,
  realWorldUsage: `Teams use ${title} when building maintainable ${technology} systems, especially where correctness, testing, and clear ownership matter.`,
  estimatedMinutes: 35,
  difficulty: 'Beginner',
  objectives: [`Define ${title} in your own words`, `Implement a small ${technology} example`, `Identify one production trade-off`],
  examples: [{ language, code, explanation: `This ${technology} example demonstrates ${title} and gives you a small unit of code to modify.` }],
  commonMistakes: [`Using ${title} without understanding its boundaries`, 'Copying an example without testing edge cases', 'Ignoring naming and error-handling conventions'],
  bestPractices: ['Prefer small, testable examples', 'Use names that describe business intent', 'Validate behavior with a realistic edge case'],
  importantPoints: [`${title} is a building block, not an isolated trick`, 'The surrounding data flow determines the correct design', 'Readable code is part of production quality'],
  interviewQuestions: [`What is ${title}?`, `When would you use ${title} in a real application?`, `What failure or trade-off should an engineer consider?`],
  practice: [{ title: `${title} practice`, problem: `Build a small ${technology} example that uses ${title} for a realistic business case.`, expectedOutput: 'A working result plus a short explanation of the design.' }],
  miniChallenge: `Extend the example to handle an invalid input and explain how your solution changes the behavior.`,
  relatedTopics: [],
  ...overrides
});

const lesson = (technology: string, id: string, title: string, summary: string, language: string, code: string, overrides: Partial<LessonContent> = {}) => ({
  id, title, ...content(technology, title, summary, language, code, overrides)
});

const moduleFor = (id: string, title: string, level: RoadmapModule['level'], topics: [string, string, string][], technology = id.split('-')[0]): RoadmapModule => ({
  id, title, level, description: `Progressive ${title.toLowerCase()} skills for real-world work.`,
  topics: topics.map(([topicId, topicTitle, topicDescription], index) => {
    // Prefer pre-authored topic-specific lessons; fall back to curated single-lesson
    const authored = getAuthoredLessons(technology, topicTitle) || getAuthoredLessons(technology === 'spring' ? 'spring-boot' : technology, topicTitle);
    const singleLesson = lesson(technology, `${topicId}-lesson`, topicTitle, topicDescription, technology, `// Practice ${topicTitle}\nconsole.log('build and verify');`, CONTENT_BY_TECH[technology]?.[topicTitle] || CONTENT_BY_TECH[technology === 'spring' ? 'spring-boot' : technology]?.[topicTitle] || (technology === 'java' ? JAVA_CONTENT[topicTitle] : undefined));
    return {
      id: topicId, title: topicTitle, description: topicDescription, prerequisites: index > 0 ? [topics[index - 1][0]] : [],
      lessons: authored ?? [singleLesson]
    };
  })
});


const PROJECTS_BY_TECH: Record<string, RoadmapProject[]> = {
  java: [
    { id: 'java-employee-system', title: 'Employee Management System', difficulty: 'Intermediate', problemStatement: 'Build a service that manages employees, departments, payroll summaries, and validation rules.', skillsRequired: ['OOP', 'Collections', 'SQL', 'REST APIs'], deliverables: ['Domain model', 'Validated CRUD API', 'Database schema', 'Automated tests'] },
    { id: 'java-backend-capstone', title: 'Production Backend Capstone', difficulty: 'Capstone', problemStatement: 'Design a secure backend with authentication, persistence, reporting, and operational documentation.', skillsRequired: ['Spring Boot', 'JPA', 'Security', 'Docker'], deliverables: ['API contract', 'Security model', 'Integration tests', 'Containerized deployment notes'] }
  ],
  python: [{ id: 'python-data-service', title: 'Data Processing Service', difficulty: 'Intermediate', problemStatement: 'Process a batch of business records, validate input, and expose a summary API.', skillsRequired: ['Functions', 'Exceptions', 'Pandas', 'HTTP'], deliverables: ['Reusable modules', 'Validation tests', 'API endpoint', 'README'] }],
  javascript: [{ id: 'javascript-dashboard', title: 'Interactive Dashboard', difficulty: 'Intermediate', problemStatement: 'Build a browser dashboard that loads API data and handles loading, empty, and error states.', skillsRequired: ['DOM', 'Promises', 'Modules', 'Accessibility'], deliverables: ['Responsive UI', 'API integration', 'Error state', 'Tests'] }],
  sql: [{ id: 'sql-analytics', title: 'Hiring Analytics Report', difficulty: 'Intermediate', problemStatement: 'Answer hiring and compensation questions with joins, CTEs, window functions, and measured indexes.', skillsRequired: ['Joins', 'CTEs', 'Window functions', 'Query plans'], deliverables: ['Schema', 'Analysis queries', 'Execution-plan notes', 'Data-quality checks'] }],
  html: [{ id: 'html-accessible-portal', title: 'Accessible Candidate Portal', difficulty: 'Beginner', problemStatement: 'Create a semantic candidate portal with keyboard-friendly navigation and a validated form.', skillsRequired: ['Semantic HTML', 'Forms', 'Accessibility'], deliverables: ['Document structure', 'Labeled form', 'Keyboard walkthrough'] }],
  css: [{ id: 'css-design-system', title: 'Responsive Design System', difficulty: 'Intermediate', problemStatement: 'Create reusable layout and component styles for a responsive learning dashboard.', skillsRequired: ['Flexbox', 'Grid', 'Responsive design', 'CSS variables'], deliverables: ['Tokens', 'Responsive layouts', 'Focus states', 'Component examples'] }],
  react: [{ id: 'react-learning-dashboard', title: 'Learning Progress Dashboard', difficulty: 'Advanced', problemStatement: 'Build a data-driven dashboard with routes, API states, reusable components, and progress actions.', skillsRequired: ['Components', 'Hooks', 'Routing', 'API integration'], deliverables: ['Route structure', 'Loading/error states', 'Accessible controls', 'Tests'] }],
  'spring-boot': [{ id: 'spring-boot-job-api', title: 'Job Portal REST API', difficulty: 'Capstone', problemStatement: 'Build a role-aware job API with persistence, validation, search, and secure student operations.', skillsRequired: ['REST', 'JPA', 'Validation', 'Security', 'Testing'], deliverables: ['Layered service', 'OpenAPI contract', 'Integration tests', 'Docker setup'] }],
  typescript: [{ id: 'typescript-platform', title: 'Typed Service SDK', difficulty: 'Advanced', problemStatement: 'Build a typed client library that validates API responses and exposes safe developer-facing methods.', skillsRequired: ['Generics', 'Unions', 'Modules', 'Testing'], deliverables: ['Public types', 'Runtime validation', 'Generated documentation', 'Tests'] }],
  c: [{ id: 'c-systems-tool', title: 'Command-Line Systems Tool', difficulty: 'Advanced', problemStatement: 'Build a memory-safe command-line utility with file parsing, error handling, and tests.', skillsRequired: ['Pointers', 'File I/O', 'Makefiles', 'Debugging'], deliverables: ['CLI', 'Makefile', 'Valgrind notes', 'Test cases'] }],
  cpp: [{ id: 'cpp-performance-tool', title: 'High-Performance Data Processor', difficulty: 'Advanced', problemStatement: 'Build a modern C++ processor using RAII, STL algorithms, and measured performance.', skillsRequired: ['STL', 'Move semantics', 'Smart pointers', 'Profiling'], deliverables: ['CMake project', 'Benchmarks', 'Tests', 'Performance report'] }],
  csharp: [{ id: 'csharp-web-api', title: '.NET Web API', difficulty: 'Advanced', problemStatement: 'Build a validated, documented .NET API with authentication and persistence.', skillsRequired: ['C#', 'ASP.NET Core', 'Entity Framework', 'Testing'], deliverables: ['API', 'Database migration', 'OpenAPI docs', 'Integration tests'] }],
  angular: [{ id: 'angular-enterprise-app', title: 'Enterprise Operations Portal', difficulty: 'Advanced', problemStatement: 'Build a routed Angular portal with reactive forms, guards, API states, and testing.', skillsRequired: ['Components', 'RxJS', 'Routing', 'Forms'], deliverables: ['Feature modules', 'Guarded routes', 'Form validation', 'Tests'] }],
  vue: [{ id: 'vue-commerce-app', title: 'Vue Commerce Workspace', difficulty: 'Advanced', problemStatement: 'Build a reactive commerce workspace with reusable components, routing, and API state.', skillsRequired: ['Composition API', 'Router', 'State management', 'Testing'], deliverables: ['Product flow', 'Cart state', 'Error states', 'Tests'] }],
  'node-js': [{ id: 'node-event-service', title: 'Node Event Service', difficulty: 'Advanced', problemStatement: 'Build an asynchronous Node service with streams, validation, logging, and graceful shutdown.', skillsRequired: ['HTTP', 'Streams', 'Async patterns', 'Testing'], deliverables: ['Service', 'Health endpoint', 'Load notes', 'Tests'] }],
  'express-js': [{ id: 'express-rest-api', title: 'Express REST API', difficulty: 'Intermediate', problemStatement: 'Build a secure REST API with middleware, validation, rate limits, and documented routes.', skillsRequired: ['Routing', 'Middleware', 'Validation', 'Security'], deliverables: ['API contract', 'Middleware stack', 'Error model', 'Tests'] }],
  django: [{ id: 'django-learning-api', title: 'Django Learning API', difficulty: 'Advanced', problemStatement: 'Build a role-aware Django API with models, migrations, authentication, and background work.', skillsRequired: ['Models', 'DRF', 'Auth', 'Testing'], deliverables: ['Models', 'API endpoints', 'Permissions', 'Deployment notes'] }],
  dotnet: [{ id: 'dotnet-cloud-api', title: '.NET Cloud API', difficulty: 'Advanced', problemStatement: 'Build a production-style .NET API with configuration, observability, security, and containers.', skillsRequired: ['ASP.NET', 'DI', 'EF Core', 'Docker'], deliverables: ['API', 'Health checks', 'Container image', 'CI workflow'] }],
  mysql: [{ id: 'mysql-banking-schema', title: 'Banking Database', difficulty: 'Advanced', problemStatement: 'Design a transactional banking schema with constraints, queries, indexes, and recovery notes.', skillsRequired: ['Keys', 'Transactions', 'Indexes', 'Procedures'], deliverables: ['Schema', 'Queries', 'Transaction tests', 'Backup plan'] }],
  postgresql: [{ id: 'postgres-analytics', title: 'PostgreSQL Analytics Platform', difficulty: 'Advanced', problemStatement: 'Build an analytics schema using JSONB, CTEs, window functions, views, and measured indexes.', skillsRequired: ['SQL', 'JSONB', 'Indexes', 'Execution plans'], deliverables: ['Schema', 'Reports', 'Plans', 'Data-quality checks'] }],
  mongodb: [{ id: 'mongodb-content-service', title: 'Document Content Service', difficulty: 'Advanced', problemStatement: 'Build a document service with validation, aggregation, indexes, and change-stream processing.', skillsRequired: ['Document modeling', 'Aggregation', 'Indexes', 'Change streams'], deliverables: ['Collections', 'API', 'Aggregation reports', 'Operational notes'] }],
  redis: [{ id: 'redis-cache-service', title: 'Distributed Cache Service', difficulty: 'Advanced', problemStatement: 'Design caching, rate limiting, and distributed-lock behavior with failure and expiry handling.', skillsRequired: ['TTL', 'Caching', 'Locks', 'Monitoring'], deliverables: ['Key design', 'Failure tests', 'Metrics plan', 'Integration example'] }],
  git: [{ id: 'git-team-workflow', title: 'Team Delivery Workflow', difficulty: 'Intermediate', problemStatement: 'Create a documented Git workflow with protected branches, release tags, hooks, and recovery drills.', skillsRequired: ['Branches', 'Rebase', 'Conflicts', 'Recovery'], deliverables: ['Workflow guide', 'Hooks', 'Release process', 'Recovery exercise'] }],
  github: [{ id: 'github-ci-platform', title: 'GitHub CI Platform', difficulty: 'Advanced', problemStatement: 'Build a repository workflow with pull requests, checks, reusable actions, security scans, and releases.', skillsRequired: ['Actions', 'Permissions', 'Secrets', 'Releases'], deliverables: ['Workflow files', 'Branch rules', 'Security checks', 'Release artifact'] }],
  docker: [{ id: 'docker-service-platform', title: 'Containerized Service Platform', difficulty: 'Advanced', problemStatement: 'Containerize a multi-service application with Compose, health checks, security scanning, and CI builds.', skillsRequired: ['Dockerfile', 'Compose', 'Networks', 'Registries'], deliverables: ['Images', 'Compose file', 'Health checks', 'CI build'] }],
  kubernetes: [{ id: 'kubernetes-production-app', title: 'Kubernetes Production Workload', difficulty: 'Capstone', problemStatement: 'Deploy a resilient service with probes, autoscaling, policies, secrets, and observability.', skillsRequired: ['Deployments', 'Services', 'Ingress', 'Security'], deliverables: ['Manifests', 'Rollout plan', 'Policy rules', 'Runbook'] }],
  aws: [{ id: 'aws-serverless-platform', title: 'AWS Serverless Platform', difficulty: 'Capstone', problemStatement: 'Design a secure event-driven workload with IAM, storage, queues, monitoring, and cost controls.', skillsRequired: ['IAM', 'Lambda', 'S3', 'SQS'], deliverables: ['Architecture', 'IaC outline', 'Observability plan', 'Cost review'] }],
  azure: [{ id: 'azure-cloud-platform', title: 'Azure Application Platform', difficulty: 'Capstone', problemStatement: 'Deploy a secure application using managed identity, containers, storage, monitoring, and policy.', skillsRequired: ['RBAC', 'Container Apps', 'Key Vault', 'Monitor'], deliverables: ['Architecture', 'Bicep outline', 'Identity model', 'Operations runbook'] }],
  dsa: [{ id: 'dsa-interview-suite', title: 'Algorithm Interview Suite', difficulty: 'Advanced', problemStatement: 'Implement and test a set of algorithmic solutions with complexity analysis and edge cases.', skillsRequired: ['Graphs', 'DP', 'Trees', 'Testing'], deliverables: ['Solutions', 'Complexity notes', 'Test suite', 'Optimization review'] }],
  'data-science': [{ id: 'data-science-business-report', title: 'Business Insight Report', difficulty: 'Advanced', problemStatement: 'Turn messy business data into validated analysis, visual findings, and a decision recommendation.', skillsRequired: ['Pandas', 'Statistics', 'Visualization', 'Communication'], deliverables: ['Notebook', 'Data-quality report', 'Visuals', 'Recommendation'] }],
  'machine-learning': [{ id: 'ml-prediction-service', title: 'Prediction Service', difficulty: 'Capstone', problemStatement: 'Train, evaluate, monitor, and serve a model with reproducible data and responsible metrics.', skillsRequired: ['Features', 'Evaluation', 'Pipelines', 'Deployment'], deliverables: ['Training pipeline', 'Evaluation report', 'API', 'Monitoring plan'] }],
  'generative-ai': [{ id: 'genai-grounded-assistant', title: 'Grounded Knowledge Assistant', difficulty: 'Capstone', problemStatement: 'Build an evaluated retrieval-augmented assistant with citations, tool boundaries, and safety checks.', skillsRequired: ['RAG', 'Evaluation', 'Tools', 'Guardrails'], deliverables: ['Retrieval flow', 'Evaluation set', 'Safety policy', 'Operations notes'] }],
  'embedded-c': [{ id: 'embedded-can-node', title: 'Automotive CAN Telemetry Node', difficulty: 'Capstone', problemStatement: 'Build a bare-metal ARM firmware node with FreeRTOS and CAN communication.', skillsRequired: ['Embedded C', 'FreeRTOS', 'CAN Bus', 'NVIC'], deliverables: ['Firmware codebase', 'Schematic', 'CAN message log'] }],
  'vlsi-design': [{ id: 'vlsi-riscv-core', title: 'Pipelined 32-bit RISC-V Core', difficulty: 'Capstone', problemStatement: 'Implement a 5-stage synthesizable RISC-V processor in Verilog with hazard detection.', skillsRequired: ['Verilog', 'STA', 'ASIC Architecture'], deliverables: ['RTL netlist', 'Testbench', 'Timing report'] }],
  'power-systems': [{ id: 'power-grid-stability', title: 'Solar PV Grid Interconnection Study', difficulty: 'Capstone', problemStatement: 'Model a 50 MW solar farm with STATCOM compensation and N-1 contingency analysis.', skillsRequired: ['Load Flow', 'Fault Analysis', 'IEEE 1547'], deliverables: ['Single-line diagram', 'Power flow report', 'Protection settings'] }],
  'thermodynamics': [{ id: 'thermo-ccgt-model', title: 'Combined Cycle Power Plant Optimization', difficulty: 'Capstone', problemStatement: 'Model a 600 MW CCGT power cycle with heat recovery steam generator (HRSG) exergy optimization.', skillsRequired: ['Rankine Cycle', 'Brayton Cycle', 'Exergy'], deliverables: ['T-s cycle diagram', 'Mass/energy balance', 'Performance report'] }],
  'staad-pro': [{ id: 'staad-g10-building', title: 'Earthquake-Resistant G+10 Tower Design', difficulty: 'Capstone', problemStatement: 'Perform 3D response spectrum seismic analysis and ductile RC detailing for a multistory commercial building.', skillsRequired: ['STAAD.Pro', 'IS 1893', 'IS 456'], deliverables: ['3D structural model', 'Story drift checks', 'Rebar schedules'] }],
  'robotics-ros': [{ id: 'robotics-amr-stack', title: 'Autonomous Warehouse AMR Navigation', difficulty: 'Capstone', problemStatement: 'Build a complete SLAM and Nav2 autonomous mobile robot navigation stack in ROS 2.', skillsRequired: ['ROS 2', 'Nav2', 'SLAM', 'C++'], deliverables: ['ROS 2 workspace', 'Gazebo simulation', 'Behavior Tree'] }],
  'ev-tech': [{ id: 'ev-bms-pack', title: '400V Modular Battery Management System', difficulty: 'Capstone', problemStatement: 'Design a high-voltage BMS with EKF state-of-charge estimation, contactor precharge, and cell balancing.', skillsRequired: ['BMS', 'Lithium-ion', 'CAN Bus', 'ISO 26262'], deliverables: ['Firmware state machine', 'AFE driver', 'Safety architecture'] }],
  'aspen-plus': [{ id: 'aspen-chemical-plant', title: 'Continuous Chemical Distillation & Heat Integration', difficulty: 'Capstone', problemStatement: 'Model an industrial distillation train in Aspen Plus and apply Pinch Technology to reduce utility consumption.', skillsRequired: ['Aspen Plus', 'VLE', 'Pinch Analysis'], deliverables: ['Flowsheet simulation', 'Pinch network', 'HAZOP worksheet'] }],
  'bioinformatics': [{ id: 'bio-ngs-pipeline', title: 'Clinical Cancer Genomics Variant Pipeline', difficulty: 'Capstone', problemStatement: 'Build an automated pipeline to process high-throughput FASTQ exome reads into annotated clinical VCF reports.', skillsRequired: ['Python', 'BWA', 'GATK', 'Biopython'], deliverables: ['Automated pipeline', 'Quality reports', 'Clinical variant summary'] }],
  'aerodynamics': [{ id: 'aero-transonic-wing', title: 'Supercritical Transonic Wing with Winglets', difficulty: 'Capstone', problemStatement: 'Design a Mach 0.78 transport wing with supercritical airfoil section and blended winglet drag reduction.', skillsRequired: ['Aerodynamics', 'VLM', 'Compressible Flow'], deliverables: ['OpenVSP 3D model', 'Drag polar curves', 'Stability report'] }]
};

const assessmentFor = (slug: string, name: string): RoadmapAssessment => ({
  id: `${slug}-knowledge-check`, title: `${name} knowledge check`, questions: [
    { id: `${slug}-q1`, question: `Which practice best demonstrates production understanding of ${name}?`, options: ['Copy examples without testing', 'Use the concept with validation and a realistic edge case', 'Avoid documentation', 'Hide failures'], answer: 'Use the concept with validation and a realistic edge case', explanation: 'Production skill combines correct usage with validation and observable behavior.' },
    { id: `${slug}-q2`, question: `What should you do before optimizing a ${name} implementation?`, options: ['Guess the bottleneck', 'Measure the actual behavior', 'Remove tests', 'Add complexity immediately'], answer: 'Measure the actual behavior', explanation: 'Measurement prevents optimization work from solving the wrong problem.' }
  ]
});

const JAVA_CONTENT: Record<string, Partial<LessonContent>> = {
  'JDK, JRE and JVM': {
    introduction: 'Java source is compiled into bytecode and executed by a JVM, allowing the same compiled program to run across supported operating systems.',
    whyItMatters: 'Knowing the JDK, JRE, and JVM removes installation confusion and helps you diagnose classpath, version, and memory issues.',
    howItWorks: 'The JDK supplies tools such as javac; the JRE conceptually supplies the runtime libraries; the JVM loads bytecode, verifies it, and executes or JIT-compiles hot paths.',
    syntax: 'javac Main.java\njava Main',
    realWorldUsage: 'Build pipelines use a pinned JDK to compile services and container images use a compatible runtime to execute them.',
    objectives: ['Distinguish JDK, JRE, and JVM', 'Compile and run a Java class', 'Explain bytecode and portability'],
    examples: [{ language: 'Java', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, JVM");\n    }\n}', explanation: 'javac produces Main.class bytecode; java starts the JVM and invokes main.' }],
    commonMistakes: ['Installing only a runtime when compilation is required', 'Mixing Java versions across IDE and terminal', 'Assuming bytecode is native machine code'],
    bestPractices: ['Pin the JDK version in CI', 'Record java -version in build diagnostics', 'Use a reproducible toolchain for local and production environments'],
    interviewQuestions: ['What is the difference between JDK, JRE, and JVM?', 'Why is Java portable?', 'What does the JIT compiler do?'],
    practice: [{ title: 'Toolchain check', problem: 'Compile a Main class, inspect the generated class file, and run it with the selected JDK.', expectedOutput: 'The program prints Hello, JVM.' }],
    relatedTopics: ['Java compilation', 'Class loading', 'Garbage collection']
  },
  'Variables and Data Types': {
    introduction: 'A variable gives a name and type to a value so a program can keep, transform, and validate business data.',
    whyItMatters: 'Correct types prevent invalid states such as losing decimal precision or assigning text to a numeric identifier.',
    howItWorks: 'Declaration introduces a typed name, initialization gives it a first value, and assignment replaces that value when the type rules allow it.',
    syntax: 'int age = 21;\ndouble salary = 55000.0;\nString name = "Ravi";\nboolean active = true;',
    realWorldUsage: 'An employee service may keep an employeeId, salary, department, and active status as separate typed values.',
    objectives: ['Declare and initialize variables', 'Choose primitive versus reference types', 'Recognize scope and incompatible assignments'],
    examples: [
      { language: 'Java', code: 'String employeeName = "Ravi";\nint employeeId = 1042;\ndouble salary = 55000.0;\nboolean active = true;\nSystem.out.println(employeeName + " #" + employeeId);', explanation: 'Each value has a type that communicates how it should be stored and used.' },
      { language: 'Java', code: 'final double TAX_RATE = 0.18;\ndouble tax = salary * TAX_RATE;', explanation: 'final expresses a value that should not be reassigned after initialization.' }
    ],
    commonMistakes: ['Using a local variable before initialization', 'Using == to compare String values', 'Choosing double for money without considering decimal requirements'],
    bestPractices: ['Use meaningful names', 'Keep scope as narrow as possible', 'Use BigDecimal for financial calculations that require exact decimal behavior'],
    interviewQuestions: ['What is the difference between declaration and initialization?', 'What are primitive and reference types?', 'What does variable scope mean?'],
    practice: [{ title: 'Employee record', problem: 'Create variables for employee name, ID, salary, department, and joining status, then print a readable summary.', expectedOutput: 'One formatted employee summary.' }],
    miniChallenge: 'Add validation so a negative salary is rejected before it is printed.',
    relatedTopics: ['Type casting', 'Operators', 'Classes and objects']
  },
  'Classes and Objects': {
    introduction: 'A class defines a type with state and behavior; an object is a runtime instance of that type.',
    whyItMatters: 'Domain classes keep business rules close to the data they protect and make large systems easier to change.',
    howItWorks: 'Constructors establish valid initial state, methods expose behavior, and private fields prevent callers from bypassing invariants.',
    syntax: 'class Employee {\n  private final String name;\n  Employee(String name) { this.name = name; }\n  String getName() { return name; }\n}',
    realWorldUsage: 'An employee management backend models employees, departments, and payroll policies as cooperating domain objects.',
    objectives: ['Create a class and constructor', 'Encapsulate state', 'Call instance methods through an object'],
    examples: [{ language: 'Java', code: 'public final class Employee {\n    private final String name;\n    private double salary;\n\n    public Employee(String name, double salary) {\n        if (salary < 0) throw new IllegalArgumentException("salary");\n        this.name = name;\n        this.salary = salary;\n    }\n\n    public double annualSalary() { return salary * 12; }\n}', explanation: 'The constructor protects the invariant and annualSalary exposes a domain operation instead of leaking calculation details.' }],
    commonMistakes: ['Making every field public', 'Putting unrelated behavior into one class', 'Allowing constructors to create invalid objects'],
    bestPractices: ['Prefer immutable fields where possible', 'Keep classes focused on one responsibility', 'Validate invariants at boundaries'],
    interviewQuestions: ['What is the difference between a class and an object?', 'Why is encapsulation useful?', 'When would you prefer composition?'],
    practice: [{ title: 'Employee model', problem: 'Add a department and a method that returns a display label without exposing mutable internals.' }],
    relatedTopics: ['Encapsulation', 'Inheritance', 'Composition']
  },
  'Collections': {
    introduction: 'The Collections Framework provides standard data structures such as List, Set, Map, Queue, and Deque.',
    whyItMatters: 'The right collection makes intent clear and can change lookup, ordering, and memory behavior significantly.',
    howItWorks: 'Interfaces describe behavior while implementations choose storage and algorithms; select by required ordering, duplicates, and access pattern.',
    syntax: 'Map<String, Integer> counts = new HashMap<>();\ncounts.merge("java", 1, Integer::sum);',
    realWorldUsage: 'Search services use maps for keyed lookup, sets for de-duplication, and priority queues for scheduling work.',
    objectives: ['Choose List, Set, Map, or Queue', 'Use generics with collections', 'Explain ordering and duplicate behavior'],
    examples: [{ language: 'Java', code: 'Map<String, Integer> frequency = new HashMap<>();\nfor (String word : List.of("api", "java", "api")) {\n    frequency.merge(word, 1, Integer::sum);\n}\nSystem.out.println(frequency.get("api"));', explanation: 'HashMap provides key-based lookup and merge updates a count without a manual containsKey branch.' }, { language: 'Java', code: 'List<Employee> sorted = employees.stream()\n    .sorted(Comparator.comparing(Employee::annualSalary).reversed())\n    .toList();', explanation: 'A list can be transformed into a new ordered view without mutating the source collection.' }],
    commonMistakes: ['Using a List for frequent key lookup', 'Mutating a collection while iterating it', 'Forgetting equals and hashCode for Set or Map keys'],
    bestPractices: ['Program to collection interfaces', 'Choose initial capacity when scale is known', 'Make mutability explicit at API boundaries'],
    interviewQuestions: ['How does HashMap work conceptually?', 'When would you choose TreeMap over HashMap?', 'Why must equals and hashCode agree?'],
    practice: [{ title: 'Department frequency', problem: 'Group employees by department and return the department with the highest headcount.' }],
    miniChallenge: 'Implement the same operation with a LinkedHashMap and explain the ordering difference.',
    relatedTopics: ['Generics', 'Streams', 'equals and hashCode']
  },
  'Streams and Lambdas': {
    introduction: 'Lambdas represent behavior as values, while streams describe a pipeline that transforms and aggregates data.',
    whyItMatters: 'Stream pipelines can make filtering, mapping, grouping, and aggregation concise while keeping transformations explicit.',
    howItWorks: 'A stream is lazy until a terminal operation runs; intermediate operations build a pipeline and terminal operations produce a result or side effect.',
    syntax: 'employees.stream()\n  .filter(e -> e.active())\n  .map(Employee::name)\n  .toList();',
    realWorldUsage: 'Reporting services use streams to turn database results into grouped API response models.',
    objectives: ['Write a lambda', 'Distinguish intermediate and terminal operations', 'Use map, filter, collect, and groupingBy'],
    examples: [{ language: 'Java', code: 'Map<String, Long> byDepartment = employees.stream()\n    .filter(Employee::active)\n    .collect(Collectors.groupingBy(Employee::department, Collectors.counting()));', explanation: 'The pipeline removes inactive employees and groups the remaining records by department.' }],
    commonMistakes: ['Using streams for complex control flow', 'Relying on side effects inside map', 'Reusing a stream after a terminal operation'],
    bestPractices: ['Keep pipelines readable', 'Prefer pure transformations', 'Measure before parallelizing'],
    interviewQuestions: ['Why are streams lazy?', 'What is the difference between map and flatMap?', 'When should parallel streams be avoided?'],
    practice: [{ title: 'Payroll report', problem: 'Calculate the average salary of active employees by department.' }],
    relatedTopics: ['Functional interfaces', 'Optional', 'Collectors']
  }
};

const CONTENT_BY_TECH: Record<string, Record<string, Partial<LessonContent>>> = {
  python: {
    'Data Types': { introduction: 'Python values include numbers, strings, booleans, sequences, mappings, and sets; each choice affects mutability and operations.', syntax: 'employee = {"name": "Ravi", "salary": 55000}\nactive = True', examples: [{ language: 'Python', code: 'employee = {"name": "Ravi", "salary": 55000}\nannual = employee["salary"] * 12\nprint(annual)', explanation: 'A dictionary models named employee fields and Python evaluates the arithmetic directly.' }], realWorldUsage: 'Data pipelines use dictionaries for records and lists for ordered batches before validation and persistence.', commonMistakes: ['Mutating a shared list unexpectedly', 'Using a list where a set is needed for membership checks', 'Assuming all values are immutable'], bestPractices: ['Choose a collection based on access needs', 'Validate external data before using it', 'Use type hints for public interfaces'], interviewQuestions: ['When would you use a tuple instead of a list?', 'How do dictionary lookups work conceptually?'], practice: [{ title: 'Payroll record', problem: 'Store three employees and calculate the total payroll using a list of dictionaries.' }] },
    'Functions and Modules': { introduction: 'Functions package a unit of behavior behind a name; modules let a project organize related functions and types.', syntax: 'def net_salary(gross: float, tax: float = 0.18) -> float:\n    return gross * (1 - tax)', examples: [{ language: 'Python', code: 'def net_salary(gross: float, tax: float = 0.18) -> float:\n    return round(gross * (1 - tax), 2)\n\nprint(net_salary(55000))', explanation: 'The default argument makes the function convenient while the return annotation documents the contract.' }], realWorldUsage: 'API services separate request parsing, domain functions, and persistence modules to keep responsibilities testable.', commonMistakes: ['Using mutable default arguments', 'Putting all code in one module', 'Hiding important side effects in a helper'], bestPractices: ['Keep functions focused', 'Return values instead of printing from domain logic', 'Use explicit imports'], interviewQuestions: ['What is the difference between an argument and a parameter?', 'Why are mutable default arguments dangerous?'], practice: [{ title: 'Invoice module', problem: 'Create functions for subtotal, tax, and total, then import them from a separate script.' }] },
    'Object-Oriented Python': { introduction: 'Python classes combine state and behavior when a domain concept benefits from identity, invariants, or polymorphism.', syntax: 'class Employee:\n    def __init__(self, name: str, salary: float):\n        self.name = name\n        self.salary = salary', examples: [{ language: 'Python', code: 'class Employee:\n    def __init__(self, name: str, salary: float):\n        self.name = name\n        self.salary = salary\n\n    def annual_salary(self) -> float:\n        return self.salary * 12', explanation: 'The object owns its data and exposes a meaningful domain operation.' }], realWorldUsage: 'Django models, service objects, and client adapters use classes where behavior and lifecycle belong together.', commonMistakes: ['Using classes for every small function', 'Forgetting self', 'Changing public state without validation'], bestPractices: ['Prefer simple functions when no state is needed', 'Use dataclasses for data-focused models', 'Keep inheritance shallow'], interviewQuestions: ['What is self?', 'When is composition better than inheritance?'], practice: [{ title: 'Inventory item', problem: 'Create an InventoryItem class that rejects negative quantity and supports restocking.' }] },
    'Exceptions and Testing': { introduction: 'Exceptions represent failures that callers can handle; tests make expected success and failure behavior executable.', examples: [{ language: 'Python', code: 'def parse_age(value: str) -> int:\n    try:\n        age = int(value)\n    except ValueError as error:\n        raise ValueError("age must be a number") from error\n    if age < 0:\n        raise ValueError("age cannot be negative")\n    return age', explanation: 'The function translates a low-level conversion error into a domain-specific message.' }], realWorldUsage: 'Web services convert validation exceptions into useful 4xx responses and log unexpected failures separately.', commonMistakes: ['Catching Exception everywhere', 'Returning None for every failure', 'Testing only the happy path'], bestPractices: ['Catch the narrowest exception', 'Test invalid inputs explicitly', 'Keep error messages actionable'], interviewQuestions: ['What is the difference between raising and returning an error?', 'How do you test an exception in pytest?'], practice: [{ title: 'Validated input', problem: 'Write tests for valid, negative, and non-numeric employee ages.' }] }
  },
  javascript: {
    'JSX and Components': { introduction: 'A JavaScript component is a focused unit of UI behavior; in React, JSX describes the elements that component returns.', examples: [{ language: 'JavaScript', code: 'function Greeting({ name }) {\n  return `<h1>Hello, ${name}</h1>`;\n}\nconsole.log(Greeting({ name: "Ravi" }));', explanation: 'The function receives data and returns a predictable UI representation.' }], realWorldUsage: 'Component boundaries keep dashboard, form, and table behavior independently testable.', commonMistakes: ['Mixing data fetching with every visual component', 'Mutating input objects', 'Ignoring empty and error states'], bestPractices: ['Keep components focused', 'Pass data explicitly', 'Make loading states visible'], interviewQuestions: ['What is the difference between a component and a DOM element?', 'Why should props be treated as immutable?'], practice: [{ title: 'Profile card', problem: 'Create a function that renders a profile card from a user object and handles a missing avatar.' }] },
    'Hooks': { introduction: 'Hooks let React components use state, effects, refs, and shared context while preserving a predictable render model.', examples: [{ language: 'JavaScript', code: 'function useDocumentTitle(title) {\n  React.useEffect(() => {\n    document.title = title;\n  }, [title]);\n}', explanation: 'The effect synchronizes an external browser side effect whenever title changes.' }], realWorldUsage: 'Custom hooks centralize authentication, data fetching, and keyboard behavior across screens.', commonMistakes: ['Calling hooks conditionally', 'Leaving dependencies out of effects', 'Using effects for derived values'], bestPractices: ['Keep effects for external synchronization', 'Extract repeated behavior into custom hooks', 'Clean up subscriptions'], interviewQuestions: ['Why must hooks be called in the same order?', 'When should you avoid useEffect?'], practice: [{ title: 'Fetch state hook', problem: 'Design a hook state model for loading, success, and error without fake data.' }] },
    'Routing and APIs': { introduction: 'Client routing maps URLs to views while API integration manages asynchronous data, loading states, errors, and authorization.', examples: [{ language: 'JavaScript', code: 'async function loadRoadmap(slug) {\n  const response = await fetch(`/api/roadmaps/${slug}`);\n  if (!response.ok) throw new Error("Roadmap unavailable");\n  return response.json();\n}', explanation: 'The caller receives parsed data only after HTTP failure has been handled.' }], realWorldUsage: 'Learning platforms use route parameters to open a technology and API calls to load only its content.', commonMistakes: ['Ignoring non-2xx responses', 'Showing stale data after navigation', 'Putting secrets in browser code'], bestPractices: ['Model loading, error, and empty states', 'Abort obsolete requests', 'Keep authorization server-side'], interviewQuestions: ['How do promises model async work?', 'What should a UI do when an API request fails?'], practice: [{ title: 'Roadmap loader', problem: 'Add loading, error, and retry behavior to a technology detail screen.' }] }
  },
  sql: {
    'SELECT and Filtering': { introduction: 'SELECT describes the columns and rows a query should return; WHERE filters before results are sent to the caller.', syntax: 'SELECT employee_id, name, salary\nFROM employees\nWHERE department = ? AND salary >= ?;', examples: [{ language: 'SQL', code: 'SELECT name, salary\nFROM employees\nWHERE department = \'Engineering\'\n  AND active = TRUE\nORDER BY salary DESC;', explanation: 'The query filters active engineers and orders the result for a useful report.' }], realWorldUsage: 'Admin dashboards and APIs use parameterized SELECT queries to retrieve bounded result sets.', commonMistakes: ['Building SQL with string concatenation', 'Using SELECT * in stable APIs', 'Forgetting NULL uses IS NULL'], bestPractices: ['Use parameters', 'Select only required columns', 'Add deterministic ordering when pagination matters'], interviewQuestions: ['In what order does a SQL query logically process clauses?', 'Why should parameters be used?'], practice: [{ title: 'Active employees', problem: 'Return active employees earning above the department median using a subquery.' }] },
    'Joins and Subqueries': { introduction: 'Joins combine rows from related tables; subqueries express a query whose result is used by another query.', examples: [{ language: 'SQL', code: 'SELECT e.name, d.name AS department\nFROM employees e\nJOIN departments d ON d.id = e.department_id\nWHERE e.active = TRUE;', explanation: 'The foreign key relationship connects each employee to its department.' }], realWorldUsage: 'Reporting APIs join customers, orders, and payments while preserving clear relational boundaries.', commonMistakes: ['Joining on the wrong key', 'Accidentally multiplying rows', 'Using a LEFT JOIN but filtering the right table in WHERE'], bestPractices: ['State relationship cardinality', 'Inspect row counts after joins', 'Use aliases consistently'], interviewQuestions: ['When does an inner join remove rows?', 'How can a join create duplicates?'], practice: [{ title: 'Department report', problem: 'Return every department, including departments without employees, with a count.' }] },
    'CTEs and Window Functions': { introduction: 'CTEs name intermediate result sets; window functions calculate across related rows without collapsing them into one row per group.', examples: [{ language: 'SQL', code: 'WITH ranked AS (\n  SELECT department_id, name, salary,\n         RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS position\n  FROM employees\n)\nSELECT * FROM ranked WHERE position <= 3;', explanation: 'The query keeps employee rows while ranking salaries within each department.' }], realWorldUsage: 'Analytics and hiring systems use ranking, running totals, and comparison-to-group metrics.', commonMistakes: ['Using GROUP BY when row detail is needed', 'Forgetting PARTITION BY', 'Assuming rank values are unique'], bestPractices: ['Name each transformation with a CTE', 'Test ties explicitly', 'Review the execution plan for large tables'], interviewQuestions: ['How do window functions differ from GROUP BY?', 'What is the difference between RANK and ROW_NUMBER?'], practice: [{ title: 'Top salaries', problem: 'Find the second-highest salary in each department, including ties.' }] },
    'Indexes and Optimization': { introduction: 'An index is an additional access structure that can reduce reads, but it costs storage and write work.', examples: [{ language: 'SQL', code: 'CREATE INDEX idx_employee_department_active\nON employees (department_id, active);\n\nEXPLAIN SELECT * FROM employees\nWHERE department_id = 3 AND active = TRUE;', explanation: 'The index matches common filter columns and EXPLAIN lets you inspect the chosen plan.' }], realWorldUsage: 'Production services index lookup and join columns based on measured query patterns.', commonMistakes: ['Indexing every column', 'Ignoring column order in composite indexes', 'Optimizing without measuring'], bestPractices: ['Use execution plans', 'Index selective predicates and foreign keys', 'Recheck indexes as access patterns change'], interviewQuestions: ['What is a composite index?', 'Why can too many indexes hurt writes?'], practice: [{ title: 'Query plan review', problem: 'Use EXPLAIN to compare a filtered query before and after a composite index.' }] }
  },
  html: {
    'HTML Fundamentals': { introduction: 'HTML gives a document semantic structure so browsers, assistive technologies, search engines, and users can understand it.', examples: [{ language: 'HTML', code: '<main>\n  <h1>Employee directory</h1>\n  <p>Search active employees by department.</p>\n</main>', explanation: 'The main landmark and heading communicate document structure without visual styling.' }], realWorldUsage: 'Accessible product pages, forms, and dashboards begin with meaningful HTML before CSS or JavaScript is added.', commonMistakes: ['Using div for every element', 'Skipping heading levels', 'Using links for actions'], bestPractices: ['Prefer semantic elements', 'Associate labels with inputs', 'Test keyboard navigation'], interviewQuestions: ['Why does semantic HTML matter?', 'What is the difference between a button and a link?'], practice: [{ title: 'Accessible form', problem: 'Create a labeled employee search form with a submit button and results region.' }] }
  },
  css: {
    'CSS Fundamentals': { introduction: 'CSS maps selectors to declarations so a document can express layout, typography, color, and responsive behavior.', examples: [{ language: 'CSS', code: '.employee-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));\n  gap: 1rem;\n}', explanation: 'The grid adapts the number of columns to available width without JavaScript.' }], realWorldUsage: 'Design systems use custom properties, layout primitives, and responsive rules to keep screens consistent.', commonMistakes: ['Relying on magic pixel offsets', 'Overusing !important', 'Ignoring focus styles'], bestPractices: ['Use a small token system', 'Prefer layout primitives over absolute positioning', 'Check contrast and focus visibility'], interviewQuestions: ['How does specificity work?', 'When would you choose Grid over Flexbox?'], practice: [{ title: 'Responsive cards', problem: 'Build a card grid that remains readable from mobile to desktop.' }] }
  },
  react: {
    'JSX and Components': { introduction: 'React components are functions that turn props and state into a UI description; JSX keeps structure close to the logic that owns it.', examples: [{ language: 'TSX', code: 'type StatusProps = { label: string; active: boolean };\n\nfunction Status({ label, active }: StatusProps) {\n  return <span aria-live="polite">{label}: {active ? "Active" : "Inactive"}</span>;\n}', explanation: 'The component has a typed input contract and exposes a meaningful accessible status.' }], realWorldUsage: 'Learning dashboards use small components for progress bars, lesson lists, code examples, and completion actions.', commonMistakes: ['Making one component own the whole page', 'Using array indexes for unstable keys', 'Rendering inaccessible clickable divs'], bestPractices: ['Keep components focused', 'Use semantic interactive elements', 'Make data contracts explicit'], interviewQuestions: ['What causes a React component to render?', 'Why are keys required for lists?'], practice: [{ title: 'Lesson card', problem: 'Create a reusable lesson card with title, duration, status, and an accessible completion button.' }] },
    'Hooks': { introduction: 'React hooks provide state and lifecycle-adjacent capabilities through ordinary functions with strict call-order rules.', examples: [{ language: 'TSX', code: 'const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");\n\nasync function save() {\n  setStatus("saving");\n  await persistProgress();\n  setStatus("saved");\n}', explanation: 'The state communicates the asynchronous save lifecycle to the UI.' }], realWorldUsage: 'Hooks coordinate roadmap progress, API loading states, keyboard interactions, and authentication-aware views.', commonMistakes: ['Calling hooks inside loops', 'Updating state after an unmounted request', 'Using memoization without a measured need'], bestPractices: ['Model async states explicitly', 'Cancel obsolete requests', 'Extract only reusable behavior'], interviewQuestions: ['Why must hooks be called at the top level?', 'How do dependencies affect effects?'], practice: [{ title: 'Progress hook', problem: 'Model idle, saving, saved, and failed progress states for a lesson completion action.' }] },
    'Routing and APIs': { introduction: 'A production React screen treats routing and API access as separate concerns while making loading, empty, and failure states visible.', examples: [{ language: 'TSX', code: 'const response = await fetch(`/api/roadmaps/${slug}`);\nif (!response.ok) throw new Error("Unable to load roadmap");\nconst data = await response.json();', explanation: 'HTTP failure is handled before the response is trusted as roadmap data.' }], realWorldUsage: 'Technology pages use stable slugs and topic IDs so students can bookmark and return to exact lessons.', commonMistakes: ['Hiding fetch errors', 'Loading every technology lesson on the discovery page', 'Trusting user IDs from the client for authorization'], bestPractices: ['Keep API access in a service', 'Load detail content on demand', 'Enforce authorization on the server'], interviewQuestions: ['How would you protect a route?', 'How should a React screen handle a failed request?'], practice: [{ title: 'Topic route', problem: 'Add a topic route that loads one lesson and provides retry behavior.' }] }
  },
  'spring-boot': {
    'Application Architecture': { introduction: 'Spring Boot assembles application configuration, dependency injection, and web infrastructure so teams can focus on domain behavior.', examples: [{ language: 'Java', code: '@SpringBootApplication\npublic class EmployeeApplication {\n    public static void main(String[] args) {\n        SpringApplication.run(EmployeeApplication.class, args);\n    }\n}', explanation: 'The application annotation enables component scanning and auto-configuration around the main entry point.' }], realWorldUsage: 'Backend teams use Spring Boot to organize controllers, services, repositories, configuration, and cross-cutting concerns.', commonMistakes: ['Putting business logic in controllers', 'Creating dependencies manually everywhere', 'Hiding configuration in source code'], bestPractices: ['Keep layers focused', 'Inject interfaces at boundaries', 'Use profiles and environment variables for configuration'], interviewQuestions: ['What is dependency injection?', 'What does auto-configuration do?', 'Why separate controller and service layers?'], practice: [{ title: 'Layered service', problem: 'Sketch controller, service, and repository responsibilities for an employee search endpoint.' }] },
    'REST APIs': { introduction: 'A REST API exposes resources through HTTP methods, representations, validation, and meaningful status codes.', syntax: '@GetMapping("/employees/{id}")\npublic EmployeeResponse get(@PathVariable long id) { ... }', examples: [{ language: 'Java', code: '@RestController\n@RequestMapping("/api/employees")\nclass EmployeeController {\n    @GetMapping("/{id}")\n    EmployeeResponse get(@PathVariable long id) {\n        return service.find(id);\n    }\n}', explanation: 'The controller maps a resource URL to an application service and returns a response model.' }], realWorldUsage: 'Web and mobile clients consume Spring Boot APIs for employee, order, learning, and reporting workflows.', commonMistakes: ['Returning entities directly', 'Using 200 for every outcome', 'Skipping validation and consistent error bodies'], bestPractices: ['Use DTOs', 'Document contracts', 'Return precise status codes and correlation-friendly errors'], interviewQuestions: ['What makes an API RESTful?', 'When should an endpoint return 201, 204, or 404?'], practice: [{ title: 'Employee endpoint', problem: 'Design GET and POST endpoints with validation errors and a stable response shape.' }] },
    'JPA and Hibernate': { introduction: 'JPA maps Java domain objects to relational tables while Hibernate supplies a widely used implementation and persistence context.', examples: [{ language: 'Java', code: '@Entity\nclass Employee {\n    @Id @GeneratedValue\n    private Long id;\n    private String name;\n\n    protected Employee() {}\n}', explanation: 'The no-argument constructor and identifier allow the persistence provider to materialize entities.' }], realWorldUsage: 'Business services use JPA for transactional aggregates, relationships, pagination, and persistence lifecycle management.', commonMistakes: ['Returning lazy entities outside a transaction', 'Ignoring N+1 queries', 'Using entities as API contracts'], bestPractices: ['Use DTO boundaries', 'Measure generated SQL', 'Define transaction boundaries explicitly'], interviewQuestions: ['What is a persistence context?', 'What causes an N+1 query?', 'Why does JPA need an identifier?'], practice: [{ title: 'Repository query', problem: 'Design a repository query that returns active employees by department with pagination.' }] },
    'Spring Security': { introduction: 'Spring Security separates authentication, authorization, password handling, and request protection for web applications.', examples: [{ language: 'Java', code: '@Bean\nSecurityFilterChain api(HttpSecurity http) throws Exception {\n    return http\n        .csrf(csrf -> csrf.disable())\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers("/api/public/**").permitAll()\n            .anyRequest().authenticated())\n        .build();\n}', explanation: 'The filter chain defines which requests are public and which require an authenticated principal.' }], realWorldUsage: 'Backend APIs protect student progress, assessments, admin content, and employer data with role-aware policies.', commonMistakes: ['Storing plaintext passwords', 'Disabling security broadly', 'Confusing authentication with authorization'], bestPractices: ['Hash passwords with a modern encoder', 'Use least privilege', 'Test both allowed and denied paths'], interviewQuestions: ['What is the difference between authentication and authorization?', 'Where should JWT validation occur?'], practice: [{ title: 'Role policy', problem: 'Define access rules for public roadmap reads, student-owned progress, and admin-only content writes.' }] }
  }
};

const DEEP_TOPIC_CATALOG: Record<string, string[]> = {
  java: [
    'What is Java?', 'Java History and Features', 'Java Editions and Use Cases', 'Java Program Lifecycle', 'JDK, JRE and JVM', 'Installation and JAVA_HOME', 'javac, java and JShell', 'Java Project Structure', 'Classes and main()', 'Statements, Blocks and Comments', 'Identifiers and Keywords',
    'Variables and Data Types', 'Declaration and Initialization', 'Assignment and Reassignment', 'Naming Rules and Conventions', 'Local Variables', 'Instance Variables', 'Static Variables', 'final Variables and Constants', 'Primitive Types', 'Reference Types', 'Wrapper Classes', 'Type Conversion and Casting', 'Autoboxing and Unboxing', 'Variable Scope and Lifetime',
    'Arithmetic Operators', 'Assignment Operators', 'Relational and Equality Operators', 'Logical Operators', 'Unary and Ternary Operators', 'Bitwise and Shift Operators', 'Precedence and Associativity', 'Scanner Input', 'BufferedReader Input', 'Formatted Output', 'Command-Line Arguments',
    'if and if-else', 'else-if and Nested Conditions', 'switch Statements', 'switch Expressions', 'Pattern Matching Concepts', 'while Loops', 'do-while Loops', 'for Loops', 'Enhanced for Loops', 'break and continue', 'Nested and Labeled Loops',
    'Method Declaration and Calls', 'Parameters and Return Values', 'void and Expression Methods', 'Method Overloading', 'varargs', 'Recursion', 'Static and Instance Methods', 'Pass-by-Value', 'Method Design',
    'Array Declaration and Indexing', 'Array Initialization and Traversal', 'Multidimensional and Jagged Arrays', 'Array Copying', 'Array Searching', 'Array Sorting', 'Array Coding Problems', 'String Creation and Immutability', 'String Pool', 'String Comparison', 'String Methods', 'substring, split and replace', 'StringBuilder and StringBuffer', 'String Formatting', 'String Performance Problems',
    'Classes and Objects', 'Fields and Methods', 'Constructors and this', 'static Members', 'Encapsulation and Validation', 'Inheritance and extends', 'super and Constructor Behavior', 'Method Overriding', 'Polymorphism and Dynamic Dispatch', 'Abstract Classes', 'Interfaces', 'Upcasting and Downcasting', 'Association and Aggregation', 'Composition vs Inheritance', 'SOLID Introduction',
    'Packages and import', 'public and private', 'protected and default Access', 'Package Design', 'Errors vs Exceptions', 'try and catch', 'finally', 'throw and throws', 'Checked Exceptions', 'Unchecked Exceptions', 'Custom Exceptions', 'Exception Propagation', 'Multiple catch', 'Try-with-Resources', 'Exception Logging and Best Practices',
    'Collection Framework', 'List and ArrayList', 'LinkedList', 'Vector and Stack', 'Set and HashSet', 'LinkedHashSet and TreeSet', 'Queue and PriorityQueue', 'Deque and ArrayDeque', 'Map and HashMap', 'LinkedHashMap and TreeMap', 'Hashtable', 'Iterator and ListIterator', 'Comparable and Comparator', 'Sorting Collections', 'Hashing and equals/hashCode', 'Collection Complexity', 'Choosing Data Structures',
    'Generic Classes and Methods', 'Generic Interfaces', 'Bounded Type Parameters', 'Wildcards extends and super', 'Type Safety', 'Type Erasure', 'Functional Interfaces', 'Lambda Expressions', 'Predicate, Consumer and Supplier', 'Function and BiFunction', 'Method References', 'Stream filter and map', 'Stream sorted and distinct', 'Stream reduce', 'Stream collect and groupingBy', 'partitioningBy', 'Optional', 'Date and Time API', 'LocalDate and LocalDateTime', 'Time Zones and Formatting',
    'File, Path and Files', 'InputStream and OutputStream', 'Reader and Writer', 'Buffered Streams', 'Serialization Concepts', 'Thread and Runnable', 'Callable and Future', 'Thread Lifecycle', 'Synchronization', 'Locks', 'Race Conditions', 'Deadlocks', 'ExecutorService and Thread Pools', 'CompletableFuture', 'Concurrent Collections', 'JVM Architecture', 'Class Loading', 'Stack, Heap and Metaspace', 'Garbage Collection', 'JIT and Memory Leaks',
    'JDBC and DriverManager', 'Connection and Statement', 'PreparedStatement', 'ResultSet', 'JDBC CRUD', 'Transactions and Rollback', 'Batch Processing', 'Connection Management', 'SQL Injection Prevention', 'Maven and pom.xml', 'Maven Dependencies and Plugins', 'Maven Lifecycle', 'Git Repository and Commits', 'Branches and Merge Conflicts', 'GitHub Pull Requests', 'JUnit Assertions', 'Test Lifecycle', 'Mockito and Mocking', 'Integration Testing', 'Spring IoC and DI', 'Spring Beans and ApplicationContext', 'Spring Component Scanning', 'Spring Boot Starters and Auto-Configuration', 'Properties, YAML and Profiles', 'Controllers and Services', 'REST HTTP Methods', 'DTOs and Entities', 'JPA and Hibernate', 'Entity Relationships', 'Validation', 'Global Exception Handling', 'Pagination and Sorting', 'Transactions', 'Spring Security Authentication', 'Authorization and Roles', 'Password Hashing and JWT', 'CORS', 'Logging and Observability', 'Docker and Environment Variables', 'Deployment and CI/CD', 'Java Backend Capstone Planning', 'Java Backend Interview Practice'
  ],
  python: ['Python Introduction and Use Cases', 'Installation and Versions', 'Python Syntax and Indentation', 'Variables and Assignment', 'Numbers and Booleans', 'Strings and Formatting', 'Lists', 'Tuples', 'Sets', 'Dictionaries', 'Operators', 'Conditions', 'for and while Loops', 'Functions and Parameters', 'Return Values', 'Lambda and Recursion', 'Modules and Imports', 'Packages and pip', 'Virtual Environments', 'Exceptions', 'File Handling', 'JSON', 'Classes and Objects', 'Inheritance and Polymorphism', 'Iterators and Generators', 'Decorators', 'Context Managers', 'Type Hints', 'Dataclasses', 'Testing with pytest', 'Logging', 'HTTP and Requests', 'REST APIs', 'FastAPI', 'Django', 'SQL Connectivity', 'Async Programming', 'Concurrency and Multiprocessing', 'Docker Deployment', 'Python Data Project', 'Python Interview Practice'],
  javascript: ['JavaScript Introduction', 'Runtime and Engines', 'Variables with var, let and const', 'Primitive Data Types', 'Objects and References', 'Type Conversion', 'Operators', 'Conditions and Loops', 'Functions and Parameters', 'Arrow Functions', 'Scope and Lexical Scope', 'Hoisting', 'Closures', 'Arrays and Array Methods', 'Objects and Methods', 'Destructuring', 'Spread and Rest', 'Strings, Dates and Regex', 'DOM Selectors', 'Events and Bubbling', 'Event Delegation', 'Forms and Validation', 'JSON', 'Fetch API', 'Promises', 'Async/Await', 'Error Handling', 'ES Modules', 'Classes and Prototypes', 'this', 'Event Loop and Call Stack', 'Microtasks and Macrotasks', 'Web Storage and Cookies', 'Authentication Concepts', 'Debugging', 'Performance', 'Security Basics', 'Node.js Introduction', 'JavaScript Dashboard Project', 'JavaScript Interview Practice'],
  sql: ['DBMS and RDBMS', 'Databases, Tables, Rows and Columns', 'Relationships', 'Primary and Foreign Keys', 'Unique, Candidate and Composite Keys', 'Constraints', 'CREATE and ALTER', 'DROP and TRUNCATE', 'INSERT', 'UPDATE and DELETE', 'SELECT', 'WHERE and Logical Filters', 'IN, BETWEEN and LIKE', 'NULL and IS NULL', 'ORDER BY and DISTINCT', 'LIMIT and Pagination', 'Aggregate Functions', 'GROUP BY', 'HAVING', 'String Functions', 'Numeric Functions', 'Date Functions', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN', 'SELF JOIN', 'Scalar Subqueries', 'Correlated Subqueries', 'EXISTS and NOT EXISTS', 'CASE Expressions', 'UNION and UNION ALL', 'CTEs', 'Recursive CTE Concepts', 'ROW_NUMBER', 'RANK and DENSE_RANK', 'LEAD and LAG', 'PARTITION BY', 'Running Totals', 'Top-N Problems', 'Views', 'Indexes', 'Transactions and ACID', 'Normalization', 'Functional Dependencies', 'Stored Procedures', 'Functions and Triggers', 'Execution Plans', 'Query Optimization', 'Duplicate Records', 'Nth Highest Salary', 'Employee Manager Problems', 'SQL Interview Practice'],
  html: ['Document Structure and DOCTYPE', 'html, head and body', 'Headings and Paragraphs', 'Text Formatting', 'Links and Navigation', 'Images and Alt Text', 'Lists', 'Tables', 'Forms', 'Input Types', 'Labels and Buttons', 'Select and Textarea', 'Semantic Elements', 'Accessibility Landmarks', 'Audio and Video', 'iframes', 'Metadata', 'SEO Basics', 'HTML Validation', 'Accessible Portal Project', 'HTML Interview Practice'],
  css: ['Selectors', 'Combinators', 'Specificity', 'Inheritance', 'Colors and Backgrounds', 'Borders', 'Units', 'Typography', 'Box Model', 'Margin and Padding', 'Display', 'Position', 'z-index', 'Overflow', 'Flexbox', 'Flex Alignment', 'CSS Grid', 'Grid Alignment', 'Responsive Design', 'Media Queries', 'Pseudo-classes', 'Pseudo-elements', 'Transitions', 'Transforms', 'Animations', 'CSS Variables', 'Forms', 'Responsive Navigation', 'Dashboard Layouts', 'Debugging CSS', 'CSS Architecture', 'Design System Project', 'CSS Interview Practice'],
  react: ['React Introduction', 'Environment and Project Structure', 'Components', 'JSX', 'Props', 'State', 'Events', 'Conditional Rendering', 'Lists and Keys', 'Forms', 'Controlled Components', 'useState', 'useEffect', 'useContext', 'useRef', 'useMemo', 'useCallback', 'Custom Hooks', 'Component Lifecycle Concepts', 'Routing', 'Nested Routes', 'API Integration', 'Loading States', 'Error and Empty States', 'Authentication', 'Protected Routes', 'State Management', 'Reusable Components', 'Performance', 'Testing', 'Architecture', 'Deployment', 'Learning Dashboard Project', 'React Interview Practice'],
  'spring-boot': ['Spring and IoC', 'Dependency Injection', 'Beans and ApplicationContext', 'Component Scanning', 'Configuration and Profiles', 'Spring Boot Starters', 'Auto-Configuration', 'Properties and YAML', 'Project Structure', 'Controllers', 'Services', 'Repositories', 'HTTP Methods', 'JSON and REST', 'DTOs', 'Entities', 'JPA', 'Hibernate', 'Entity Relationships', 'Validation', 'Exception Handling', 'Global Exception Handler', 'Transactions', 'Pagination', 'Sorting', 'Spring Security', 'Authentication', 'Authorization', 'Password Hashing', 'JWT', 'CORS', 'File Upload', 'Logging', 'JUnit', 'Mockito', 'Integration Testing', 'Swagger and OpenAPI', 'Maven', 'Docker', 'Environment Variables', 'Deployment', 'Layered Architecture', 'Clean Architecture Concepts', 'Microservices Concepts', 'Production Best Practices', 'Job Portal Capstone', 'Spring Boot Interview Practice'],
  typescript: ['TypeScript Introduction', 'Compiler and tsconfig', 'Primitive Types', 'Arrays and Tuples', 'Enums and Literal Types', 'Interfaces', 'Type Aliases', 'Unions and Intersections', 'Narrowing', 'Generics', 'Generic Constraints', 'Functions and Overloads', 'Classes', 'Access Modifiers', 'Decorators Concepts', 'Modules', 'Utility Types', 'Mapped Types', 'Conditional Types', 'Async Type Safety', 'API Response Types', 'React with TypeScript', 'Testing TypeScript', 'Build and Deployment'],
  c: ['C Introduction', 'Compilation and Toolchain', 'Program Structure', 'Variables and Types', 'Pointers', 'Arrays and Strings', 'Operators', 'Conditions', 'Loops', 'Functions', 'Headers and Preprocessor', 'Structs', 'Unions and Enums', 'Memory Allocation', 'File I/O', 'Debugging with GDB', 'Undefined Behavior', 'Data Structures in C', 'Systems Project'],
  cpp: ['C++ Toolchain', 'Namespaces', 'References', 'Classes', 'Constructors and Destructors', 'Inheritance', 'Polymorphism', 'Templates', 'STL Containers', 'Iterators', 'Algorithms', 'Smart Pointers', 'Move Semantics', 'RAII', 'Exceptions', 'Concurrency', 'CMake', 'Testing', 'Performance Project'],
  csharp: ['C# Syntax', 'Types and Variables', 'Strings and Collections', 'Methods', 'Classes and Records', 'Interfaces', 'Inheritance', 'Generics', 'LINQ', 'Delegates and Events', 'Async Await', 'Exceptions', 'File I/O', 'Unit Testing', '.NET CLI', 'ASP.NET Core', 'Entity Framework', 'C# API Project'],
  angular: ['Angular CLI and Workspace', 'Components', 'Templates', 'Data Binding', 'Directives', 'Pipes', 'Services', 'Dependency Injection', 'Routing', 'Route Parameters', 'Forms', 'Reactive Forms', 'HTTP Client', 'RxJS', 'Guards', 'Interceptors', 'Testing', 'Performance', 'Angular Deployment'],
  vue: ['Vue Setup', 'Single File Components', 'Template Syntax', 'Props', 'Events', 'Reactivity', 'Computed Values', 'Watchers', 'Composition API', 'Composables', 'Routing', 'Forms', 'API Integration', 'State Management', 'Testing', 'Performance', 'Vue Project'],
  'node-js': ['Node Runtime', 'npm and package.json', 'Modules', 'File System', 'Path and URLs', 'Events', 'Streams', 'HTTP Server', 'Environment Variables', 'Async Patterns', 'Error Handling', 'Testing', 'Security', 'Worker Threads', 'Node API Project'],
  'express-js': ['Express Setup', 'Routing', 'Request and Response', 'Middleware', 'Route Parameters', 'Validation', 'Error Middleware', 'Authentication Middleware', 'REST Design', 'Database Integration', 'Logging', 'Testing APIs', 'Security Headers', 'Express Project'],
  django: ['Django Setup', 'Project and App Structure', 'URL Routing', 'Views', 'Templates', 'Models', 'Migrations', 'QuerySets', 'Forms', 'Admin', 'Authentication', 'Permissions', 'REST APIs', 'Testing', 'Deployment', 'Django Project'],
  dotnet: ['.NET SDK and CLI', 'C# Foundations', 'Project Structure', 'Dependency Injection', 'Configuration', 'Minimal APIs', 'Controllers', 'Middleware', 'DTOs', 'Entity Framework Core', 'Migrations', 'Validation', 'Authentication', 'Authorization', 'Logging', 'Testing', 'Docker and Deployment'],
  mysql: ['MySQL Installation', 'Schemas and Tables', 'Keys and Constraints', 'CRUD', 'Filtering', 'Aggregations', 'Joins', 'Subqueries', 'Views', 'Indexes', 'Transactions', 'Stored Procedures', 'Triggers', 'Users and Privileges', 'Backup Concepts'],
  postgresql: ['PostgreSQL Setup', 'Schemas and Types', 'Constraints', 'CRUD Queries', 'Joins', 'JSONB', 'Arrays', 'Indexes', 'Transactions', 'Isolation', 'Views', 'Functions', 'Full Text Search', 'Explain Plans', 'Backup and Deployment'],
  mongodb: ['Document Database Concepts', 'MongoDB Setup', 'Collections and Documents', 'CRUD', 'Query Operators', 'Indexes', 'Aggregation Pipeline', 'Embedded vs Referenced Data', 'Transactions', 'Schema Validation', 'Node Integration', 'Security', 'Backup', 'MongoDB Project'],
  redis: ['Redis Concepts', 'Keys and Values', 'Strings and Counters', 'Lists and Sets', 'Hashes', 'Sorted Sets', 'Expiration and TTL', 'Caching Patterns', 'Pub/Sub', 'Streams', 'Transactions', 'Persistence', 'Security', 'Node and Spring Integration'],
  git: ['Version Control Concepts', 'Repository and Working Tree', 'init and clone', 'status, add and commit', 'History and diff', 'Branches', 'Merge', 'Rebase Concepts', 'Conflicts', 'Stash', 'Tags and Releases', 'Ignore Rules', 'Recovering Changes', 'Team Workflow'],
  github: ['Repositories', 'Issues', 'Pull Requests', 'Review Workflow', 'Branches and Protection', 'Actions Basics', 'CI Checks', 'Secrets', 'Releases', 'Packages', 'Projects', 'Security Alerts', 'Team Collaboration'],
  docker: ['Containers and Images', 'Docker Installation', 'docker run', 'Dockerfile', 'Layers and Caching', 'Volumes', 'Networks', 'Environment Variables', 'Compose', 'Registries', 'Security', 'Optimization', 'Debugging Containers', 'Deployment Project'],
  kubernetes: ['Cluster Concepts', 'kubectl', 'Pods', 'Deployments', 'Services', 'ConfigMaps', 'Secrets', 'Namespaces', 'Labels and Selectors', 'Ingress', 'Health Probes', 'Resource Requests', 'Autoscaling', 'Stateful Workloads', 'RBAC', 'Observability', 'Production Deployment'],
  aws: ['Cloud Concepts', 'IAM', 'Regions and Availability Zones', 'EC2', 'VPC Networking', 'S3', 'RDS', 'Lambda', 'API Gateway', 'CloudWatch', 'ECS and Containers', 'DynamoDB', 'Cost Controls', 'Well Architected Design', 'AWS Project'],
  azure: ['Azure Concepts', 'Subscriptions and Resource Groups', 'Entra ID', 'RBAC', 'Virtual Networks', 'App Service', 'Functions', 'Container Apps', 'Storage', 'Azure SQL', 'Key Vault', 'Application Insights', 'AKS', 'Cost Management', 'Azure Project'],
  dsa: ['Complexity Analysis', 'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Hashing', 'Trees', 'Binary Search Trees', 'Heaps', 'Graphs', 'BFS and DFS', 'Sorting', 'Searching', 'Recursion', 'Dynamic Programming', 'Greedy Algorithms', 'Interview Problems'],
  'data-science': ['Data Science Workflow', 'Python Data Tools', 'NumPy', 'Pandas Series', 'Pandas DataFrames', 'Cleaning Data', 'Missing Values', 'Exploratory Analysis', 'Statistics', 'Probability', 'Visualization', 'Feature Engineering', 'Model Evaluation', 'Experiment Design', 'Data Science Project'],
  'machine-learning': ['ML Workflow', 'Supervised Learning', 'Unsupervised Learning', 'Train and Test Data', 'Feature Engineering', 'Linear Regression', 'Classification', 'Trees and Ensembles', 'Clustering', 'Metrics', 'Cross Validation', 'Overfitting', 'Pipelines', 'Model Explainability', 'Deployment', 'ML Project'],
  'generative-ai': ['Generative AI Concepts', 'Language Models', 'Prompt Design', 'Structured Outputs', 'Embeddings', 'Vector Search', 'RAG', 'Tool Calling', 'Evaluation', 'Grounding', 'Safety and Guardrails', 'Cost and Latency', 'Agent Workflows', 'Deployment', 'GenAI Project']
};

const EXTRA_TOPIC_CATALOG: Record<string, string[]> = {
  html: ['Canvas Basics', 'Web Components Concepts', 'Internationalization', 'Print Styles'],
  typescript: ['Type Inference', 'Structural Typing', 'Declaration Files', 'Third-Party Types', 'Type-Safe DOM', 'Type-Safe Fetching', 'Error Modeling', 'Discriminated Unions', 'Testing Types', 'Library Publishing'],
  c: ['Command-Line Programs', 'Pointer Arithmetic', 'Function Pointers', 'Linked List Implementation', 'Stack and Queue Implementation', 'Makefiles', 'Static and Dynamic Linking', 'POSIX Concepts', 'Embedded C Concepts', 'C Systems Capstone'],
  cpp: ['Operator Overloading', 'Exception Safety', 'STL Algorithms', 'Ranges Concepts', 'Concurrency Primitives', 'Atomics', 'CMake Targets', 'Profiling C++', 'Game Loop Design', 'Modern C++ Capstone'],
  csharp: ['Pattern Matching', 'Records and Init Properties', 'Nullable Reference Types', 'Async Streams', 'Reflection', 'Dependency Injection', 'ASP.NET Middleware', 'Web API Validation', 'Entity Framework Queries', 'Cloud C# Capstone'],
  angular: ['Angular Signals', 'Standalone Components', 'Change Detection', 'Dependency Injection Tokens', 'RxJS Observables', 'RxJS Operators', 'HTTP Error Handling', 'Accessibility in Angular', 'Component Testing', 'Enterprise Angular Capstone'],
  vue: ['Vue Directives', 'Slots', 'Provide and Inject', 'Vue Router Guards', 'Pinia Concepts', 'Async Components', 'Transitions', 'Accessibility in Vue', 'Component Testing', 'Vue Application Capstone'],
  'node-js': ['Event Loop Internals', 'Buffers', 'Child Processes', 'Cluster Concepts', 'WebSockets', 'Streams Backpressure', 'Node Security', 'API Testing', 'Observability', 'Node Production Capstone'],
  'express-js': ['Router Composition', 'Async Middleware', 'Request Validation', 'Rate Limiting', 'Caching APIs', 'File Uploads', 'WebSockets', 'OpenAPI Documentation', 'Integration Testing', 'Express Production Capstone'],
  django: ['Class-Based Views', 'Template Inheritance', 'Custom Managers', 'Signals', 'Caching', 'Celery Concepts', 'Django REST Framework', 'API Authentication', 'Security Middleware', 'Django Production Capstone'],
  dotnet: ['LINQ Queries', 'Async Streams', 'ASP.NET Middleware', 'Minimal API Validation', 'Entity Relationships', 'JWT Authentication', 'OpenAPI', 'Health Checks', 'Integration Testing', '.NET Production Capstone'],
  mysql: ['Data Types', 'Composite Constraints', 'Stored Procedure Parameters', 'MySQL JSON', 'Full Text Search', 'Isolation Levels', 'Deadlocks', 'Replication Concepts', 'Backup and Restore', 'MySQL Analytics Project'],
  postgresql: ['Advanced Data Types', 'JSONB Queries', 'Common Table Expressions', 'Window Functions', 'Partial Indexes', 'Materialized Views', 'Isolation Levels', 'Full Text Search', 'Extensions', 'PostgreSQL Analytics Project'],
  mongodb: ['MongoDB Compass', 'Projection', 'Array Queries', 'Aggregation Stages', 'Text Search', 'Change Streams', 'Replication', 'Sharding Concepts', 'Performance Profiling', 'MongoDB Production Project'],
  redis: ['Redis CLI', 'Key Naming', 'Lua Scripts', 'Distributed Locks', 'Rate Limiting', 'Cache Invalidation', 'Redis Streams Consumers', 'Cluster Concepts', 'Monitoring', 'Redis Production Project'],
  git: ['Remote Tracking', 'Cherry-Pick', 'Reflog Recovery', 'Interactive Rebase', 'Signed Commits', 'Git Hooks', 'Submodules', 'Large Files', 'Release Strategy', 'Git Team Capstone'],
  github: ['Organization Permissions', 'Code Owners', 'Branch Protection', 'Reusable Workflows', 'Matrix Builds', 'Artifact Storage', 'Dependabot', 'Code Scanning', 'Issue Templates', 'GitHub Delivery Capstone'],
  docker: ['Multi-Stage Builds', 'Build Context', 'Docker Compose Profiles', 'Health Checks', 'Resource Limits', 'Rootless Containers', 'Image Scanning', 'Private Registries', 'CI Image Builds', 'Docker Production Capstone'],
  kubernetes: ['ReplicaSets', 'Rolling Updates', 'Jobs and CronJobs', 'Persistent Volumes', 'Network Policies', 'Helm Concepts', 'Horizontal Pod Autoscaling', 'Cluster Security', 'Disaster Recovery', 'Kubernetes Capstone'],
  aws: ['Elastic Load Balancing', 'Auto Scaling', 'CloudFormation Concepts', 'ECS Deployment', 'SQS', 'SNS', 'EventBridge', 'Secrets Manager', 'Cloud Security', 'AWS Production Capstone'],
  azure: ['Azure CLI', 'Bicep Concepts', 'App Service Deployment', 'Container Registry', 'Service Bus', 'Event Grid', 'Managed Identity', 'Private Endpoints', 'Azure Policy', 'Azure Production Capstone'],
  dsa: ['Prefix Sums', 'Two Pointers', 'Sliding Window', 'Backtracking', 'Topological Sort', 'Union Find', 'Trie', 'Segment Tree Concepts', 'Bit Manipulation', 'DSA Coding Capstone'],
  'data-science': ['Data Import', 'Data Validation', 'Groupby Analysis', 'Time Series Basics', 'Correlation', 'Hypothesis Testing', 'Regression Analysis', 'Model Communication', 'Notebook Practices', 'Data Science Portfolio Project'],
  'machine-learning': ['Regularization', 'Logistic Regression', 'KNN', 'SVM Concepts', 'Random Forests', 'Gradient Boosting', 'Neural Network Basics', 'Hyperparameter Search', 'Model Monitoring', 'ML Production Capstone'],
  'generative-ai': ['Tokenization', 'Context Windows', 'Few-Shot Prompting', 'Prompt Evaluation', 'RAG Chunking', 'Reranking', 'Function Calling', 'Agent Memory', 'Red Team Testing', 'GenAI Production Capstone']
};

const generatedLesson = (technology: string, topic: string, stage: string, index: number) => {
  const language = technology === 'sql' ? 'SQL' : technology === 'html' ? 'HTML' : technology === 'css' ? 'CSS' : technology === 'react' ? 'TSX' : technology === 'python' ? 'Python' : technology === 'spring-boot' ? 'Java' : 'Java';
  const code = technology === 'sql' ? `SELECT ${topic.toLowerCase().replace(/[^a-z]+/g, '_')}\nFROM employees\nWHERE active = TRUE;` : technology === 'python' ? `def practice_${index}(value):\n    return value\n\nprint(practice_${index}("${topic}"))` : technology === 'html' ? `<section aria-labelledby="topic-${index}">\n  <h2 id="topic-${index}">${topic}</h2>\n</section>` : technology === 'css' ? `.topic-${index} {\n  display: block;\n  gap: 1rem;\n}` : technology === 'react' ? `function Topic${index}({ value }) {\n  return <section aria-label="${topic}">{value}</section>;\n}` : technology === 'spring-boot' ? `@Service\nclass Topic${index}Service {\n    String explain() { return "${topic}"; }\n}` : `public class Topic${index} {\n    public static void main(String[] args) {\n        System.out.println("${topic}");\n    }\n}`;
  const stageDescription = stage === 'UNDERSTAND' ? `Build a clear mental model of ${topic}.` : stage === 'PRACTICE' ? `Implement ${topic} in a small guided exercise.` : stage === 'BUILD' ? `Use ${topic} in a realistic feature.` : `Debug, explain, and defend ${topic} in a professional setting.`;
  const curated = CONTENT_BY_TECH[technology]?.[topic] || (technology === 'java' ? JAVA_CONTENT[topic] : undefined);
  return lesson(technology, `${technology}-${index}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, `${topic}: ${stage}`, stageDescription, language, code, {
    introduction: `${topic} is a distinct part of the ${technology} learning path. This lesson focuses on one skill at a time so you can apply it before moving forward.`,
    objectives: [`Explain ${topic}`, `Complete a ${stage.toLowerCase()} exercise for ${topic}`, `Connect ${topic} to a real ${technology} project`],
    examples: [{ language, code, explanation: `Read the example from the input and structure outward: identify the ${topic} construct, then change one value and observe the result.` }],
    practice: [{ title: `${topic} exercise`, problem: `Create a ${technology} example using ${topic}, then add one invalid or edge-case input.`, expectedOutput: 'A working example and an explanation of the edge case.' }],
    interviewQuestions: [`What problem does ${topic} solve in ${technology}?`, `How would you debug a failure involving ${topic}?`],
    miniChallenge: `Extend the example to support a realistic employee, order, or learning-platform scenario involving ${topic}.`,
    relatedTopics: [],
    ...curated
  });
};

const deepModules = (technology: string, name: string): RoadmapModule[] => {
  const topics = [...(DEEP_TOPIC_CATALOG[technology] || []), ...(EXTRA_TOPIC_CATALOG[technology] || [])];
  const levels: RoadmapModule['level'][] = ['FOUNDATION', 'CORE', 'INTERMEDIATE', 'ADVANCED', 'PROFESSIONAL'];
  const size = Math.ceil(topics.length / levels.length);
  return levels.map((level, levelIndex) => {
    const selected = topics.slice(levelIndex * size, (levelIndex + 1) * size);
    return {
      id: `${technology}-${level.toLowerCase()}`,
      title: `${name} ${level[0] + level.slice(1).toLowerCase()}`,
      level,
      description: `${level} lessons that move from understanding to practice, troubleshooting, and job-ready application.`,
      topics: selected.map((topic, topicIndex) => {
        // Prefer pre-authored unique lessons — fall back to generated lessons
        const authored = getAuthoredLessons(technology, topic);
        const generatedLessons = generateLessonsForTopic(
          technology,
          topic,
          levelIndex * size * 4 + topicIndex * 4
        );
        return {
          id: `${technology}-${levelIndex}-${topicIndex}`,
          title: topic,
          description: `Learn ${topic} through explanation, examples, practice, debugging, and interview preparation.`,
          prerequisites: topicIndex > 0 ? [`${technology}-${levelIndex}-${topicIndex - 1}`] : [],
          lessons: authored ?? generatedLessons
        };
      })
    };
  });
};


type Definition = Omit<TechnologyRoadmap, 'modules'>;
const definition = (slug: string, name: string, category: string, description: string, icon: string, difficulty: Definition['difficulty'], duration: string, prerequisites: string[], careerPaths: string[], outcome: string, related: string[]): Definition => ({
  id: `technology-${slug}`, slug, name, category, description, icon, difficulty,
  estimatedDuration: duration, prerequisites, careerPaths,
  overview: { whatItIs: description, whyUsed: outcome, whereUsed: careerPaths.join(', '), whatYouCanBuild: [`A production-ready ${name} feature`, `A portfolio project aligned to ${careerPaths[0]}`], learningOutcome: outcome, relatedTechnologies: related },
  updatedAt: '2026-09-17T00:00:00.000Z'
});

const definitions: Definition[] = [
  definition('java', 'Java', 'Programming Languages', 'Object-oriented language for reliable, large-scale services.', 'JAVA', 'Intermediate', '16 weeks', ['Programming fundamentals'], ['Java Backend Developer', 'Full Stack Developer'], 'Build maintainable JVM services, APIs, and enterprise applications.', ['Spring Boot', 'SQL', 'Maven', 'Docker']),
  definition('python', 'Python', 'Programming Languages', 'Readable general-purpose language used across backend, automation, and data work.', 'PY', 'Beginner', '12 weeks', ['Programming fundamentals'], ['Backend Developer', 'Data Analyst', 'ML Engineer'], 'Build automation, APIs, data workflows, and machine learning solutions.', ['Django', 'Data Science', 'Machine Learning', 'SQL']),
  definition('javascript', 'JavaScript', 'Programming Languages', 'The language of interactive web applications and Node.js services.', 'JS', 'Beginner', '10 weeks', ['HTML and CSS'], ['Frontend Developer', 'Full Stack Developer'], 'Build browser experiences and event-driven backend services.', ['React', 'Node.js', 'TypeScript', 'REST APIs']),
  definition('typescript', 'TypeScript', 'Programming Languages', 'Typed JavaScript for safer, scalable application development.', 'TS', 'Intermediate', '8 weeks', ['JavaScript'], ['Frontend Developer', 'Full Stack Developer'], 'Design typed application boundaries and maintainable frontend systems.', ['React', 'Node.js', 'Testing', 'API design']),
  definition('c', 'C', 'Programming Languages', 'Systems language for understanding memory, performance, and operating systems.', 'C', 'Advanced', '14 weeks', ['Programming fundamentals'], ['Systems Developer', 'Embedded Developer'], 'Write predictable low-level software and reason about memory.', ['Linux', 'C++', 'Data Structures and Algorithms']),
  definition('cpp', 'C++', 'Programming Languages', 'High-performance language for systems, games, and infrastructure.', 'C++', 'Advanced', '16 weeks', ['C'], ['Systems Developer', 'Game Developer'], 'Build performance-sensitive software with modern C++ practices.', ['C', 'Algorithms', 'Linux']),
  definition('csharp', 'C#', 'Programming Languages', 'Modern typed language for .NET services, desktop, and cloud applications.', 'C#', 'Intermediate', '12 weeks', ['Programming fundamentals'], ['.NET Developer', 'Cloud Developer'], 'Build testable .NET applications and web APIs.', ['.NET', 'Azure', 'SQL']),
  definition('html', 'HTML', 'Frontend', 'Semantic markup that gives web content structure and meaning.', 'HTML', 'Beginner', '3 weeks', [], ['Frontend Developer'], 'Create accessible, search-friendly document structure.', ['CSS', 'JavaScript', 'React']),
  definition('css', 'CSS', 'Frontend', 'The styling system for responsive, accessible web interfaces.', 'CSS', 'Beginner', '5 weeks', ['HTML'], ['Frontend Developer'], 'Build responsive layouts and consistent visual systems.', ['HTML', 'JavaScript', 'Tailwind CSS']),
  definition('react', 'React', 'Frontend', 'Component library for building interactive user interfaces.', 'REACT', 'Intermediate', '10 weeks', ['JavaScript', 'HTML', 'CSS'], ['Frontend Developer', 'Full Stack Developer'], 'Build composable, accessible interfaces with reliable state and data flows.', ['JavaScript', 'TypeScript', 'Testing', 'Node.js']),
  definition('angular', 'Angular', 'Frontend', 'Opinionated TypeScript framework for enterprise web applications.', 'ANG', 'Advanced', '12 weeks', ['TypeScript', 'HTML', 'CSS'], ['Frontend Developer'], 'Build structured enterprise applications with dependency injection and routing.', ['TypeScript', 'RxJS', 'REST APIs']),
  definition('vue', 'Vue.js', 'Frontend', 'Progressive framework for approachable and scalable interfaces.', 'VUE', 'Intermediate', '8 weeks', ['JavaScript', 'HTML', 'CSS'], ['Frontend Developer'], 'Build reactive interfaces with clear component boundaries.', ['JavaScript', 'TypeScript', 'REST APIs']),
  definition('spring-boot', 'Spring Boot', 'Backend', 'Production framework for Java services, APIs, and distributed systems.', 'SB', 'Advanced', '14 weeks', ['Java', 'OOP', 'SQL'], ['Java Backend Developer'], 'Build secure, observable REST services connected to real persistence.', ['Java', 'JPA / Hibernate', 'SQL', 'Docker']),
  definition('node-js', 'Node.js', 'Backend', 'JavaScript runtime for network services and tooling.', 'NODE', 'Intermediate', '10 weeks', ['JavaScript'], ['Backend Developer', 'Full Stack Developer'], 'Build asynchronous services, workers, and APIs.', ['JavaScript', 'Express.js', 'Docker']),
  definition('express-js', 'Express.js', 'Backend', 'Minimal web framework for Node.js HTTP APIs.', 'EXP', 'Intermediate', '6 weeks', ['Node.js'], ['Backend Developer'], 'Design validated, observable REST endpoints.', ['Node.js', 'JavaScript', 'SQL']),
  definition('django', 'Django', 'Backend', 'Batteries-included Python framework for secure web applications.', 'DJ', 'Intermediate', '10 weeks', ['Python'], ['Python Backend Developer'], 'Build data-backed web applications with secure defaults.', ['Python', 'PostgreSQL', 'REST APIs']),
  definition('dotnet', '.NET', 'Backend', 'Cross-platform platform for high-performance services and applications.', 'NET', 'Intermediate', '12 weeks', ['C#'], ['.NET Developer', 'Cloud Developer'], 'Build APIs, background workers, and cloud-native applications.', ['C#', 'ASP.NET Core', 'Azure']),
  definition('sql', 'SQL', 'Databases', 'The language for querying, modeling, and protecting relational data.', 'SQL', 'Beginner', '10 weeks', ['Database fundamentals'], ['Backend Developer', 'Data Analyst', 'Data Engineer'], 'Design relational queries and data workflows that remain correct at scale.', ['MySQL', 'PostgreSQL', 'JDBC', 'Spring Boot']),
  definition('mysql', 'MySQL', 'Databases', 'Relational database for transactional applications.', 'SQL', 'Beginner', '6 weeks', ['SQL basics'], ['Backend Developer', 'Data Analyst'], 'Model transactional data and write reliable queries.', ['SQL', 'JDBC', 'Spring Boot']),
  definition('postgresql', 'PostgreSQL', 'Databases', 'Extensible relational database with strong correctness guarantees.', 'PG', 'Intermediate', '8 weeks', ['SQL basics'], ['Backend Developer', 'Data Engineer'], 'Design robust schemas, indexes, and transactional workflows.', ['SQL', 'Django', 'Docker']),
  definition('mongodb', 'MongoDB', 'Databases', 'Document database for flexible application data models.', 'MDB', 'Intermediate', '6 weeks', ['JavaScript or Python'], ['Backend Developer'], 'Choose document modeling patterns deliberately and query efficiently.', ['Node.js', 'Python', 'Data modeling']),
  definition('redis', 'Redis', 'Databases', 'In-memory data platform for caching, queues, and fast state.', 'REDIS', 'Advanced', '5 weeks', ['Backend fundamentals'], ['Backend Developer', 'Platform Engineer'], 'Add reliable caching and asynchronous coordination.', ['Node.js', 'Spring Boot', 'Docker']),
  definition('git', 'Git', 'DevOps & Cloud', 'Distributed version control for collaborative software delivery.', 'GIT', 'Beginner', '3 weeks', [], ['Every software role'], 'Work safely with branches, history, reviews, and releases.', ['GitHub', 'CI/CD', 'Docker']),
  definition('github', 'GitHub', 'DevOps & Cloud', 'Collaboration platform for source, reviews, automation, and delivery.', 'GH', 'Beginner', '3 weeks', ['Git'], ['Every software role'], 'Collaborate through pull requests and automate quality checks.', ['Git', 'GitHub Actions', 'CI/CD']),
  definition('docker', 'Docker', 'DevOps & Cloud', 'Container platform for reproducible application environments.', 'DOCKER', 'Intermediate', '6 weeks', ['Linux basics'], ['Backend Developer', 'DevOps Engineer'], 'Package services consistently and run them across environments.', ['Linux', 'Kubernetes', 'CI/CD']),
  definition('kubernetes', 'Kubernetes', 'DevOps & Cloud', 'Orchestration platform for resilient container workloads.', 'K8S', 'Advanced', '10 weeks', ['Docker', 'Networking'], ['Platform Engineer', 'DevOps Engineer'], 'Deploy, scale, observe, and secure containerized services.', ['Docker', 'Azure', 'Cloud networking']),
  definition('aws', 'AWS', 'DevOps & Cloud', 'Cloud platform for compute, storage, data, and managed services.', 'AWS', 'Advanced', '12 weeks', ['Networking basics'], ['Cloud Engineer', 'DevOps Engineer'], 'Design secure, observable cloud workloads.', ['Docker', 'Kubernetes', 'Terraform']),
  definition('azure', 'Azure', 'DevOps & Cloud', 'Cloud platform for application hosting, data, identity, and AI services.', 'AZ', 'Advanced', '12 weeks', ['Networking basics'], ['Cloud Engineer', 'DevOps Engineer'], 'Build and operate secure Azure workloads with managed services.', ['Docker', 'Kubernetes', 'Azure Functions']),
  definition('dsa', 'Data Structures and Algorithms', 'AI & Data', 'Core problem-solving toolkit for efficient software.', 'DSA', 'Intermediate', '12 weeks', ['Programming fundamentals'], ['Software Engineer'], 'Analyze complexity and choose appropriate data structures.', ['Java', 'Python', 'C++']),
  definition('data-science', 'Data Science', 'AI & Data', 'Methods for extracting decisions from data.', 'DATA', 'Advanced', '14 weeks', ['Python', 'Statistics'], ['Data Scientist', 'Data Analyst'], 'Formulate, analyze, and communicate data-driven findings.', ['Python', 'SQL', 'Machine Learning']),
  definition('machine-learning', 'Machine Learning', 'AI & Data', 'Algorithms and workflows for predictive systems.', 'ML', 'Advanced', '16 weeks', ['Python', 'Statistics'], ['ML Engineer', 'Data Scientist'], 'Train, evaluate, and deploy responsible predictive models.', ['Python', 'Data Science', 'Docker']),
  definition('generative-ai', 'Generative AI', 'AI & Data', 'Systems that generate and reason over text, code, and other media.', 'GENAI', 'Advanced', '10 weeks', ['Python', 'APIs'], ['AI Engineer', 'ML Engineer'], 'Build grounded, evaluated AI features with appropriate safeguards.', ['Python', 'Vector databases', 'Azure AI']),
  // ECE
  definition('embedded-c', 'Embedded C & Firmware', 'Embedded Systems', 'Bare-metal ARM Cortex-M firmware, register manipulation, interrupts, and serial communication.', 'EMB', 'Intermediate', '14 weeks', ['C Programming'], ['Embedded Software Engineer', 'Firmware Developer'], 'Build production-ready firmware with DMA, FreeRTOS, and CAN bus telemetry.', ['ARM Cortex', 'FreeRTOS', 'CAN Bus', 'SPI/I2C']),
  definition('vlsi-design', 'VLSI & ASIC Design', 'Hardware & Chips', 'Digital ASIC architecture, synthesizable Verilog HDL, Static Timing Analysis, and timing closure.', 'VLSI', 'Advanced', '16 weeks', ['Digital Electronics'], ['VLSI Design Engineer', 'RTL Verification Engineer'], 'Design synthesizable RISC-V cores and achieve zero-slack timing closure.', ['Verilog', 'STA', 'FPGA', 'ASIC Flow']),
  // EEE
  definition('power-systems', 'Power Systems Analysis', 'Electrical Power', 'High-voltage grid analysis, load flow (Newton-Raphson), fault calculations, and substation protection.', 'PWR', 'Advanced', '14 weeks', ['Circuit Theory'], ['Power Systems Engineer', 'Grid Operations Analyst'], 'Model regional transmission grids and coordinate numerical protective relays.', ['ETAP', 'Relay Coordination', 'Smart Grid']),
  // Mechanical
  definition('thermodynamics', 'Engineering Thermodynamics', 'Thermal & Fluid Sciences', 'First and Second Laws, steam Rankine reheat cycles, gas turbines, and heat exchanger design.', 'THRM', 'Intermediate', '12 weeks', ['Calculus & Physics'], ['Thermal Systems Engineer', 'Turbomachinery Engineer'], 'Design combined-cycle power systems and size industrial heat exchangers.', ['Rankine Cycle', 'Heat Transfer', 'HVAC']),
  // Civil
  definition('staad-pro', 'Structural Engineering & RCC Design', 'Structural Engineering', 'Limit State RCC beam/column design, 3D frame modeling, and seismic response spectrum analysis.', 'STR', 'Intermediate', '14 weeks', ['Strength of Materials'], ['Structural Design Engineer', 'Civil Project Engineer'], 'Design earthquake-resistant multistory buildings to IS 456 and IS 1893 codes.', ['IS 456', 'Seismic Analysis', 'ETABS']),
  // Robotics
  definition('robotics-ros', 'ROS 2 & Robotics Automation', 'Robotics & Automation', 'Distributed robotics middleware, URDF kinematics, tf2 transforms, SLAM, and Nav2 navigation.', 'ROS', 'Advanced', '14 weeks', ['C++ and Python'], ['Robotics Software Engineer', 'Autonomous Systems Developer'], 'Build autonomous mobile robots with 2D LiDAR SLAM and dynamic costmap navigation.', ['ROS 2', 'Nav2', 'SLAM', 'MoveIt 2']),
  // Automobile
  definition('ev-tech', 'Electric Vehicle Technology & BMS', 'Automotive', 'Lithium-ion electrochemical modeling, Kalman filter SoC estimation, and contactor pre-charge sequencing.', 'EV', 'Advanced', '12 weeks', ['Electrical Circuits'], ['EV Powertrain Engineer', 'BMS Firmware Engineer'], 'Design 400V battery pack supervisory systems compliant with ISO 26262.', ['BMS', 'Lithium-ion', 'CAN Bus', 'FOC Motor Control']),
  // Chemical
  definition('aspen-plus', 'Chemical Process Engineering', 'Process Engineering', 'Continuous distillation column design (McCabe-Thiele), reactor kinetics, and Pinch energy integration.', 'CHEM', 'Advanced', '14 weeks', ['Chemical Thermodynamics'], ['Process Design Engineer', 'Plant Operations Specialist'], 'Simulate petrochemical separation trains and execute plant-wide Pinch heat integration.', ['Aspen Plus', 'Distillation', 'Pinch Analysis', 'HAZOP']),
  // Biotechnology
  definition('bioinformatics', 'Bioinformatics & Molecular Biology', 'Biotechnology', 'Dynamic programming sequence alignment (Needleman-Wunsch), NGS pipelines, and PCR primer design.', 'BIO', 'Intermediate', '12 weeks', ['Genetics Basics', 'Python'], ['Bioinformatics Scientist', 'Genomics Data Analyst'], 'Build automated clinical NGS cancer variant calling pipelines and analyze genetic targets.', ['Biopython', 'BWA', 'GATK', 'CRISPR']),
  // Aerospace
  definition('aerodynamics', 'Aerodynamics & Flight Mechanics', 'Aerospace', 'Subsonic/supersonic airfoil theory, finite wing induced drag, shock waves, and longitudinal static stability.', 'AERO', 'Advanced', '14 weeks', ['Fluid Mechanics'], ['Aerodynamicist', 'Flight Dynamics Engineer'], 'Design transonic aircraft wings with supercritical airfoils and optimize cruise fuel burn.', ['Airfoil Theory', 'Compressible Flow', 'OpenVSP', 'Jet Propulsion'])
];

const richModules: Record<string, RoadmapModule[]> = {
  java: [moduleFor('java-foundation', 'Java Foundation', 'FOUNDATION', [['jdk-jre-jvm', 'JDK, JRE and JVM', 'Understand the runtime and tooling model.'], ['java-types', 'Variables and Data Types', 'Represent data safely and predictably.']]), moduleFor('java-core', 'Core Java and OOP', 'CORE', [['java-control-flow', 'Control Flow', 'Compose decisions and repetition.'], ['java-oop', 'Classes and Objects', 'Model behavior with encapsulation and composition.'], ['java-collections', 'Collections', 'Choose collections for real workloads.']]), moduleFor('java-advanced', 'Advanced Java', 'ADVANCED', [['java-exceptions', 'Exception Handling', 'Represent and handle failure deliberately.'], ['java-generics', 'Generics', 'Write reusable type-safe code.'], ['java-streams', 'Streams and Lambdas', 'Express collection transformations clearly.'], ['java-concurrency', 'Concurrency', 'Coordinate work safely across threads.']]), moduleFor('java-backend', 'Database and Backend', 'PROFESSIONAL', [['java-jdbc', 'JDBC and Transactions', 'Connect Java services to relational data.'], ['java-spring', 'Spring Boot REST APIs', 'Build layered backend services.']]), moduleFor('java-professional', 'Professional Java', 'PROFESSIONAL', [['java-testing', 'Testing and Delivery', 'Ship maintainable, tested services.'], ['java-deployment', 'Maven, Git and Docker', 'Package and deliver a service.']])],
  python: [moduleFor('python-foundation', 'Python Fundamentals', 'FOUNDATION', [['python-types', 'Data Types', 'Use Python values and collections effectively.'], ['python-functions', 'Functions and Modules', 'Organize reusable behavior.']]), moduleFor('python-core', 'Python Engineering', 'CORE', [['python-oop', 'Object-Oriented Python', 'Use classes where they improve design.'], ['python-errors', 'Exceptions and Testing', 'Handle failures and verify behavior.']]), moduleFor('python-data', 'Python for Data and APIs', 'INTERMEDIATE', [['python-pandas', 'Pandas and NumPy', 'Transform tabular data.'], ['python-apis', 'APIs and Persistence', 'Build data-backed services.']])],
  react: [moduleFor('react-foundation', 'React Foundation', 'FOUNDATION', [['react-jsx', 'JSX and Components', 'Compose interfaces from focused components.'], ['react-props', 'Props and State', 'Model data flow and local interaction.']]), moduleFor('react-core', 'Application React', 'CORE', [['react-hooks', 'Hooks', 'Coordinate state and effects.'], ['react-routing', 'Routing and APIs', 'Build navigable data-driven screens.']]), moduleFor('react-professional', 'Production Frontend', 'PROFESSIONAL', [['react-testing', 'Testing', 'Verify accessible user journeys.'], ['react-performance', 'Performance and Deployment', 'Ship responsive, observable applications.']])],
  sql: [moduleFor('sql-foundation', 'SQL Foundation', 'FOUNDATION', [['sql-select', 'SELECT and Filtering', 'Retrieve precise datasets.'], ['sql-aggregations', 'Aggregations', 'Summarize business data.']]), moduleFor('sql-core', 'Relational Querying', 'CORE', [['sql-joins', 'Joins and Subqueries', 'Combine related data without duplication.'], ['sql-cte-window', 'CTEs and Window Functions', 'Express multi-step analytics queries.']]), moduleFor('sql-professional', 'Database Engineering', 'PROFESSIONAL', [['sql-indexes', 'Indexes and Optimization', 'Measure and improve query plans.'], ['sql-transactions', 'Transactions and Modeling', 'Preserve correctness under concurrent writes.']])],
  'spring-boot': [moduleFor('spring-foundation', 'Spring Boot Foundation', 'FOUNDATION', [['spring-architecture', 'Application Architecture', 'Understand dependency injection and configuration.'], ['spring-rest', 'REST APIs', 'Design predictable HTTP contracts.']]), moduleFor('spring-core', 'Persistence and Security', 'CORE', [['spring-jpa', 'JPA and Hibernate', 'Map domain models to relational data.'], ['spring-security', 'Spring Security', 'Protect endpoints and identities.']]), moduleFor('spring-professional', 'Production Services', 'PROFESSIONAL', [['spring-testing', 'Testing Services', 'Verify behavior across boundaries.'], ['spring-deploy', 'Observability and Deployment', 'Operate a service responsibly.']])],
  javascript: [moduleFor('javascript-foundation', 'JavaScript Foundation', 'FOUNDATION', [['javascript-runtime', 'Runtime and Syntax', 'Understand values, scope, and execution.'], ['javascript-components', 'JSX and Components', 'Compose reusable interface behavior.']]), moduleFor('javascript-core', 'Asynchronous JavaScript', 'CORE', [['javascript-async', 'Promises and Async/Await', 'Coordinate API and browser work.'], ['javascript-modules', 'Modules and APIs', 'Organize code and integrate services.']]), moduleFor('javascript-professional', 'Production JavaScript', 'PROFESSIONAL', [['javascript-debugging', 'Debugging and Security', 'Diagnose failures and protect browser code.'], ['javascript-projects', 'Projects and Testing', 'Ship tested application features.']])],
  html: [moduleFor('html-foundation', 'HTML Foundation', 'FOUNDATION', [['html-structure', 'HTML Fundamentals', 'Structure accessible documents with semantic elements.'], ['html-forms', 'Forms and Accessibility', 'Collect user input with clear relationships.']])],
  css: [moduleFor('css-foundation', 'CSS Foundation', 'FOUNDATION', [['css-fundamentals', 'CSS Fundamentals', 'Style documents with selectors and the cascade.'], ['css-layout', 'Layout and Responsive Design', 'Build resilient layouts with Flexbox and Grid.']]), moduleFor('css-professional', 'Production CSS', 'PROFESSIONAL', [['css-motion', 'Transitions and Animation', 'Add functional motion without harming usability.'], ['css-system', 'Variables and Design Systems', 'Share consistent visual decisions.']])],
  'embedded-c': [
    moduleFor('emb-foundation', 'Microcontroller Architecture & Registers', 'FOUNDATION', [
      ['emb-mem-io', 'Memory-Mapped I/O and Volatile', 'Direct register access and pointer casting.'],
      ['emb-gpio', 'GPIO Modes and Pin Configurations', 'Push-pull, open-drain, and pull-up/down circuits.']
    ], 'embedded-c'),
    moduleFor('emb-core', 'Interrupts and Hardware Timers', 'CORE', [
      ['emb-nvic', 'NVIC Priority and ISR Hygiene', 'Interrupt handlers and race condition mitigation.'],
      ['emb-timers', 'Hardware Timers and PWM Output', 'Timer clock prescalers and PWM motor control.']
    ], 'embedded-c'),
    moduleFor('emb-comm', 'Serial Bus Protocols', 'INTERMEDIATE', [
      ['emb-uart', 'UART Transmission and Circular Buffers', 'Baud rate generation and FIFO ring buffers.'],
      ['emb-spi-i2c', 'SPI Bus and I2C Multi-Master', 'Synchronous and open-drain communication protocols.']
    ], 'embedded-c'),
    moduleFor('emb-pro', 'RTOS and Automotive Firmware', 'PROFESSIONAL', [
      ['emb-rtos', 'FreeRTOS Task Scheduling and Queues', 'Preemptive multitasking and semaphores.'],
      ['emb-can', 'Automotive CAN Bus and Watchdogs', 'Differential CAN 2.0B packets and fail-safe recovery.']
    ], 'embedded-c')
  ],
  'vlsi-design': [
    moduleFor('vlsi-foundation', 'CMOS Logic & Digital Foundations', 'FOUNDATION', [
      ['vlsi-cmos', 'CMOS Inverters and Transmission Gates', 'Pull-up/pull-down transistor sizing and RC delay.'],
      ['vlsi-rtl', 'Synthesizable Verilog RTL', 'Modeling combinational logic and sequential flip-flops.']
    ], 'vlsi-design'),
    moduleFor('vlsi-timing', 'Static Timing Analysis (STA)', 'ADVANCED', [
      ['vlsi-sta', 'Setup and Hold Time Closure', 'Slack equations, clock skew, and pipeline insertion.'],
      ['vlsi-cdc', 'Clock Domain Crossing (CDC)', 'Asynchronous boundaries and 2FF synchronizers.']
    ], 'vlsi-design'),
    moduleFor('vlsi-asic', 'Physical Design and Architecture', 'PROFESSIONAL', [
      ['vlsi-riscv', 'Pipelined Processor Implementation', '5-stage RISC-V RV32I datapath and hazard unit.'],
      ['vlsi-pnr', 'Floorplanning and Clock Tree Synthesis', 'Placement, CTS, and power gating strategies.']
    ], 'vlsi-design')
  ],
  'power-systems': [
    moduleFor('pwr-modeling', 'Network Modeling & Per-Unit System', 'FOUNDATION', [
      ['pwr-pu', 'Per-Unit Normalization', 'System base conversion across multi-voltage transformers.'],
      ['pwr-ybus', 'Bus Admittance Matrix Formulation', 'Building sparse nodal Ybus matrices.']
    ], 'power-systems'),
    moduleFor('pwr-flow', 'Load Flow and Grid Stability', 'CORE', [
      ['pwr-nr', 'Newton-Raphson Power Flow', 'Jacobian matrix formulation and voltage limits.'],
      ['pwr-ferranti', 'Transmission Line Phenomena', 'Surge impedance loading and Ferranti effect.']
    ], 'power-systems'),
    moduleFor('pwr-protection', 'Fault Analysis and Substation Protection', 'PROFESSIONAL', [
      ['pwr-sym', 'Symmetrical Components and Ground Faults', 'Positive, negative, and zero sequence networks.'],
      ['pwr-relays', 'Numerical Relays and Distance Zones', 'IDMT curves and biased differential protection.']
    ], 'power-systems')
  ],
  'thermodynamics': [
    moduleFor('thrm-foundation', 'First and Second Laws', 'FOUNDATION', [
      ['thrm-sfee', 'Steady Flow Energy Equation (SFEE)', 'Control volumes, enthalpy, and shaft work.'],
      ['thrm-entropy', 'Entropy and Exergy Destruction', 'Carnot limits and Gouy-Stodola availability.']
    ], 'thermodynamics'),
    moduleFor('thrm-cycles', 'Power Generation Cycles', 'CORE', [
      ['thrm-rankine', 'Supercritical Rankine Steam Cycles', 'Boiler reheat and regenerative feedwater heaters.'],
      ['thrm-ccgt', 'Combined Cycle Gas Turbines (CCGT)', 'Brayton topping cycle and HRSG steam integration.']
    ], 'thermodynamics'),
    moduleFor('thrm-hx', 'Thermal Systems & Heat Exchangers', 'PROFESSIONAL', [
      ['thrm-lmtd', 'LMTD and Effectiveness-NTU Sizing', 'Shell-and-tube heat exchanger rating.'],
      ['thrm-compress', 'Compressible Nozzles and Choked Flow', 'Convergent-divergent supersonic nozzle expansion.']
    ], 'thermodynamics')
  ],
  'staad-pro': [
    moduleFor('str-rcc', 'Limit State Reinforced Concrete Design', 'FOUNDATION', [
      ['str-beams', 'Flexural Design of Singly Reinforced Beams', 'IS 456 limiting moment and rebar sizing.'],
      ['str-columns', 'Axial and Biaxial Column Compression', 'Short column capacity and minimum eccentricity.']
    ], 'staad-pro'),
    moduleFor('str-seismic', 'Seismic and Lateral Load Analysis', 'CORE', [
      ['str-spectrum', 'Response Spectrum Earthquake Analysis', 'Base shear calculation and IS 1893 zoning.'],
      ['str-wind', 'Wind Load and Dynamic Drift', 'Terrain category factors and gust response.']
    ], 'staad-pro'),
    moduleFor('str-fem', '3D Frame Modeling and Detailing', 'PROFESSIONAL', [
      ['str-staad', 'STAAD.Pro Command Syntax and Modeling', 'Joints, members, and load combinations.'],
      ['str-ductile', 'Ductile Rebar Detailing (IS 13920)', 'Beam-column confinement and shear wall design.']
    ], 'staad-pro')
  ],
  'robotics-ros': [
    moduleFor('ros-core', 'ROS 2 Core Architecture', 'FOUNDATION', [
      ['ros-nodes', 'Nodes, Topics, and DDS Middleware', 'Pub-sub pipelines and QoS reliability.'],
      ['ros-urdf', 'URDF and Kinematic Transforms (tf2)', 'Links, joints, and coordinate frame trees.']
    ], 'robotics-ros'),
    moduleFor('ros-slam', 'Perception & SLAM Mapping', 'CORE', [
      ['ros-lidar', 'LiDAR Point Clouds and LaserScan', 'Filtering sensor noise and range validation.'],
      ['ros-cart', '2D Occupancy Grid SLAM Mapping', 'SLAM Toolbox and graph-based loop closure.']
    ], 'robotics-ros'),
    moduleFor('ros-nav', 'Autonomous Navigation & Planning', 'PROFESSIONAL', [
      ['ros-nav2', 'Nav2 Path Planning and Costmaps', 'Global A* planning and local DWB controllers.'],
      ['ros-manip', 'MoveIt 2 Manipulator Motion Planning', 'Inverse kinematics and collision avoidance.']
    ], 'robotics-ros')
  ],
  'ev-tech': [
    moduleFor('ev-cells', 'Lithium-Ion Battery Modeling', 'FOUNDATION', [
      ['ev-ecm', 'Thevenin Equivalent Circuit Model', 'Ohmic resistance, polarization, and OCV.'],
      ['ev-soc', 'State of Charge (SoC) Kalman Filtering', 'Coulomb counting fused with voltage feedback.']
    ], 'ev-tech'),
    moduleFor('ev-bms', 'BMS Hardware & Functional Safety', 'CORE', [
      ['ev-balance', 'Passive and Active Cell Balancing', 'Bleed resistor switching and energy equalization.'],
      ['ev-safety', 'Contactor Pre-Charge and Isolation', 'Inrush protection and insulation monitoring (IMD).']
    ], 'ev-tech'),
    moduleFor('ev-drives', 'Traction Inverters & Thermal Systems', 'PROFESSIONAL', [
      ['ev-foc', 'Field-Oriented Motor Control (FOC)', 'Park/Clarke transforms and PMSM torque control.'],
      ['ev-cooling', 'Battery Thermal Management (BTMS)', 'Liquid cold plates and thermal runaway prevention.']
    ], 'ev-tech')
  ],
  'aspen-plus': [
    moduleFor('chem-vle', 'Thermodynamic Property Models & VLE', 'FOUNDATION', [
      ['chem-thermo', 'NRTL and Peng-Robinson Models', 'Phase equilibrium for polar and hydrocarbon systems.'],
      ['chem-mccabe', 'McCabe-Thiele Distillation Column Sizing', 'Operating lines, feed q-lines, and tray count.']
    ], 'aspen-plus'),
    moduleFor('chem-reactors', 'Chemical Reaction Engineering', 'CORE', [
      ['chem-cstr', 'CSTR and PFR Reactor Sizing', 'Arrhenius rate equations and conversion optimization.'],
      ['chem-recycle', 'Flowsheet Convergence and Tear Streams', 'Wegstein numerical convergence in Aspen Plus.']
    ], 'aspen-plus'),
    moduleFor('chem-integration', 'Process Heat Integration & Safety', 'PROFESSIONAL', [
      ['chem-pinch', 'Pinch Analysis and Minimum Utility Target', 'Composite curves and heat exchanger networks.'],
      ['chem-hazop', 'HAZOP Study and Relief Valve Sizing', 'Guide word deviations and emergency relief design.']
    ], 'aspen-plus')
  ],
  'bioinformatics': [
    moduleFor('bio-align', 'Sequence Alignment Algorithms', 'FOUNDATION', [
      ['bio-nw', 'Needleman-Wunsch Global Alignment', 'Dynamic programming matrices and indels.'],
      ['bio-blast', 'BLAST Heuristics and E-Values', 'Seed matching, extension, and statistical thresholds.']
    ], 'bioinformatics'),
    moduleFor('bio-genomics', 'Next-Generation Sequencing (NGS)', 'CORE', [
      ['bio-ngs', 'FASTQ QC, BWA Alignment, and BAM Indexing', 'Phred quality scores and reference mapping.'],
      ['bio-variants', 'GATK Variant Calling and ClinVar Annotation', 'SNVs, indels, and clinical pathogenicity.']
    ], 'bioinformatics'),
    moduleFor('bio-molecular', 'Molecular Biology & Genetic Engineering', 'PROFESSIONAL', [
      ['bio-pcr', 'PCR Primer Design and Melting Temperature (Tm)', 'Nearest-neighbor thermodynamics and hairpins.'],
      ['bio-crispr', 'CRISPR-Cas9 Guide RNA Design', 'PAM sites (NGG) and on-target cleavage scoring.']
    ], 'bioinformatics')
  ],
  'aerodynamics': [
    moduleFor('aero-airfoils', 'Airfoil Theory & Lift Generation', 'FOUNDATION', [
      ['aero-thin', 'Thin Airfoil Theory and Kutta Condition', 'Camber lines, lift slope, and zero-lift alpha.'],
      ['aero-vlm', '3D Finite Wings and Induced Drag', 'Prandtl lifting-line theory and aspect ratio effects.']
    ], 'aerodynamics'),
    moduleFor('aero-highspeed', 'Compressible Flow & Shock Waves', 'CORE', [
      ['aero-shocks', 'Normal and Oblique Shock Waves', 'Rankine-Hugoniot jump equations and Mach waves.'],
      ['aero-supercrit', 'Supercritical Airfoils and Wave Drag', 'Transonic drag divergence and shock weakening.']
    ], 'aerodynamics'),
    moduleFor('aero-performance', 'Flight Dynamics & Jet Propulsion', 'PROFESSIONAL', [
      ['aero-stability', 'Longitudinal Static Stability and Trim', 'Neutral point, CG limits, and static margin.'],
      ['aero-turbofan', 'Turbofan Thermodynamic Station Cycles', 'Brayton cycle stations, bypass ratio, and TSFC.']
    ], 'aerodynamics')
  ]
};

export function getRoadmaps(): TechnologyRoadmap[] {
  return definitions.map((item) => ({
    ...item,
    modules: DEEP_TOPIC_CATALOG[item.slug] ? deepModules(item.slug, item.name) : richModules[item.slug] || [moduleFor(`${item.slug}-core`, `${item.name} Core`, 'CORE', [[`${item.slug}-fundamentals`, `${item.name} Fundamentals`, `Learn the core concepts and workflows used in ${item.name}.`], [`${item.slug}-practice`, `${item.name} in Practice`, `Apply ${item.name} in a role-aligned project.`]], item.slug)],
    projects: PROJECTS_BY_TECH[item.slug] || [],
    assessment: assessmentFor(item.slug, item.name)
  }));
}

export function getRoadmapBySlug(slug: string): TechnologyRoadmap | undefined {
  return getRoadmaps().find((roadmap) => roadmap.slug === slug);
}

export function getProgressSummary(roadmap: TechnologyRoadmap, progress?: UserRoadmapProgress) {
  const lessons = roadmap.modules.flatMap((module) => module.topics.flatMap((topic) => topic.lessons));
  const completed = lessons.filter((item) => progress?.lessonIds.includes(item.id)).length;
  return { totalLessons: lessons.length, completedLessons: completed, progressPercentage: lessons.length ? Math.round((completed / lessons.length) * 100) : 0 };
}