import { RoleQuestion } from '../types';

export const QA_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "qa-001",
    "role": "QA Engineer",
    "category": "Testing Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the stages of Software Testing Life Cycle (STLC) and how it integrates with SDLC.",
    "expectedSkills": [
      "STLC",
      "SDLC"
    ],
    "evaluationPoints": [
      "Requirement Analysis -> Test Planning -> Test Case Development -> Environment Setup -> Test Execution -> Test Closure",
      "Entry and exit criteria for each phase",
      "Traceability matrix linking test cases back to business requirements"
    ],
    "followUpTopics": [
      "RTM (Requirements Traceability Matrix)",
      "Agile QA"
    ]
  },
  {
    "id": "qa-002",
    "role": "QA Engineer",
    "category": "Defect Management",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Describe the complete Bug Life Cycle from New to Closed and deferred states.",
    "expectedSkills": [
      "Defect Management"
    ],
    "evaluationPoints": [
      "New -> Assigned -> Open -> Fixed -> Retest -> Verified -> Closed",
      "Alternative paths: Rejected, Duplicate, Deferred, Cannot Reproduce",
      "Key fields in a professional bug report: Steps to Reproduce, Expected vs Actual, Severity, Priority, Environment, Screenshots/Logs"
    ],
    "followUpTopics": [
      "Bug Severity vs Priority",
      "Jira bug workflows"
    ]
  },
  {
    "id": "qa-003",
    "role": "QA Engineer",
    "category": "Defect Management",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the difference between Severity and Priority with examples of High Severity/Low Priority and Low Severity/High Priority.",
    "expectedSkills": [
      "Defect Management"
    ],
    "evaluationPoints": [
      "Severity is technical impact on the system; Priority is urgency of fix from business perspective",
      "High Severity / Low Priority: App crashes on legacy OS version used by 0.01% of users",
      "Low Severity / High Priority: Company logo is misspelled on public login page"
    ],
    "followUpTopics": [
      "Triage meetings",
      "SLA for bug fixes"
    ]
  },
  {
    "id": "qa-004",
    "role": "QA Engineer",
    "category": "Test Design",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Equivalence Partitioning and Boundary Value Analysis (BVA) for testing an input field accepting ages 18 to 60.",
    "expectedSkills": [
      "Test Design Techniques"
    ],
    "evaluationPoints": [
      "Equivalence classes: Invalid (<18), Valid (18-60), Invalid (>60)",
      "BVA checks edge boundaries: 17, 18, 19 and 59, 60, 61",
      "Most bugs occur at the boundary conditions"
    ],
    "followUpTopics": [
      "Robustness testing",
      "Decision table testing"
    ]
  },
  {
    "id": "qa-005",
    "role": "QA Engineer",
    "category": "Testing Types",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between Smoke Testing and Sanity Testing?",
    "expectedSkills": [
      "Testing Types"
    ],
    "evaluationPoints": [
      "Smoke testing (build verification) tests basic critical functionality on a new build to decide if it is testable",
      "Sanity testing tests specific bugs fixed and related modules after a minor build release",
      "Smoke is wide and shallow; Sanity is narrow and deep"
    ],
    "followUpTopics": [
      "Regression testing",
      "Automated smoke tests"
    ]
  },
  {
    "id": "qa-006",
    "role": "QA Engineer",
    "category": "Testing Types",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you select test cases for a regression suite when time is limited before a release?",
    "expectedSkills": [
      "Regression Testing"
    ],
    "evaluationPoints": [
      "Prioritize critical business flows (login, payments, checkout)",
      "Include tests for recently modified code and adjacent dependent modules",
      "Include high-risk areas with historical defect density"
    ],
    "followUpTopics": [
      "Risk-based testing",
      "Automated regression"
    ]
  },
  {
    "id": "qa-007",
    "role": "QA Engineer",
    "category": "API Testing",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you test a REST API using Postman? What assertions and status codes do you verify?",
    "expectedSkills": [
      "API Testing",
      "Postman"
    ],
    "evaluationPoints": [
      "Verify status codes (200, 201, 400, 401, 404, 500)",
      "Assert response payload schema and values using pm.test and pm.expect()",
      "Test response latency, boundary inputs, authentication headers, and error response formats"
    ],
    "followUpTopics": [
      "Postman collections",
      "Newman CLI runner"
    ]
  },
  {
    "id": "qa-008",
    "role": "QA Engineer",
    "category": "Agile Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the role of a QA Engineer in Agile Scrum ceremonies (Sprint Planning, Daily Standup, Retro)?",
    "expectedSkills": [
      "Agile",
      "Scrum"
    ],
    "evaluationPoints": [
      "Sprint Planning: review user stories for testability, acceptance criteria, and story point sizing",
      "Daily Standup: report testing progress, blockers, and defect discoveries",
      "Retrospective: discuss process improvements and quality bottlenecks"
    ],
    "followUpTopics": [
      "Definition of Done (DoD)",
      "Three Amigos meeting"
    ]
  },
  {
    "id": "qa-009",
    "role": "QA Engineer",
    "category": "Testing Types",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is Exploratory Testing? When is it superior to formal scripted test cases?",
    "expectedSkills": [
      "Exploratory Testing"
    ],
    "evaluationPoints": [
      "Simultaneous learning, test design, and test execution without pre-written test scripts",
      "Relies on tester's domain knowledge, intuition, and creativity to find unexpected edge cases",
      "Complements automated regression tests by uncovering subtle usability and workflow issues"
    ],
    "followUpTopics": [
      "Session-based testing",
      "Chartered testing"
    ]
  },
  {
    "id": "qa-010",
    "role": "QA Engineer",
    "category": "Database Testing",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you use SQL queries to verify backend data integrity after submitting a web form?",
    "expectedSkills": [
      "SQL",
      "Database Testing"
    ],
    "evaluationPoints": [
      "Query database table to verify record was inserted with correct field mappings and timestamps",
      "Verify foreign key relationships across related tables",
      "Check default values, constraints, and audit log entries"
    ],
    "followUpTopics": [
      "Data integrity checks",
      "Backend verification"
    ]
  },
  {
    "id": "qa-011",
    "role": "QA Engineer",
    "category": "Testing Types",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the major types of Non-Functional Testing (Performance, Security, Usability, Accessibility)?",
    "expectedSkills": [
      "Non-Functional Testing"
    ],
    "evaluationPoints": [
      "Performance testing: verify speed, scalability, and stability under load",
      "Security testing: identify vulnerabilities and unauthorized access risks",
      "Usability testing: evaluate user interface intuitiveness and navigation ease",
      "Accessibility testing: verify compliance with WCAG standards for disabled users"
    ],
    "followUpTopics": [
      "Load testing",
      "WCAG standards"
    ]
  },
  {
    "id": "qa-012",
    "role": "QA Engineer",
    "category": "Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are the challenges of testing microservices and how does Contract Testing (Pact) solve them?",
    "expectedSkills": [
      "Microservices",
      "Contract Testing"
    ],
    "evaluationPoints": [
      "Dependencies between services make end-to-end testing slow, brittle, and hard to isolate",
      "Contract testing verifies that consumer and provider agree on API request/response format independently",
      "Pact creates contract files validated in CI without spinning up full service mesh"
    ],
    "followUpTopics": [
      "Pact framework",
      "Consumer-driven contracts"
    ]
  },
  {
    "id": "qa-013",
    "role": "QA Engineer",
    "category": "Performance Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design a load test in Apache JMeter? Explain Thread Groups, Ramp-Up, and Listeners.",
    "expectedSkills": [
      "JMeter",
      "Performance"
    ],
    "evaluationPoints": [
      "Thread Group simulates number of concurrent virtual users",
      "Ramp-up period defines time to bring all virtual users online gradually",
      "HTTP Request Sampler defines API calls; Listeners collect and graph metrics (Response Time, Throughput, Error Rate)"
    ],
    "followUpTopics": [
      "Stress testing vs Load testing",
      "Throughput metrics"
    ]
  },
  {
    "id": "qa-014",
    "role": "QA Engineer",
    "category": "Web Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you approach cross-browser testing across Chrome, Safari, Firefox, and mobile browsers?",
    "expectedSkills": [
      "Cross-Browser",
      "Compatibility"
    ],
    "evaluationPoints": [
      "Identify target browsers and versions from Google Analytics user demographics",
      "Focus manual testing on known engine differences (WebKit/Safari vs Chromium vs Gecko)",
      "Leverage cloud grid tools (BrowserStack, SauceLabs) for automated matrix execution"
    ],
    "followUpTopics": [
      "Browser engines",
      "Device emulators vs real devices"
    ]
  },
  {
    "id": "qa-015",
    "role": "QA Engineer",
    "category": "Security Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do QA engineers test web applications for common vulnerabilities like SQLi and XSS?",
    "expectedSkills": [
      "Security Testing",
      "OWASP"
    ],
    "evaluationPoints": [
      "Test input fields with SQL injection payloads (' OR '1'='1) to check for unhandled SQL errors",
      "Test inputs with script tags (<script>alert('XSS')</script>) to check for lack of sanitization",
      "Verify authentication, session timeout, and secure HTTPS cookie flags"
    ],
    "followUpTopics": [
      "OWASP ZAP",
      "Penetration testing basics"
    ]
  },
  {
    "id": "qa-016",
    "role": "QA Engineer",
    "category": "Quality Assurance",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "Explain the 5 Whys methodology for conducting root cause analysis on a critical escaped defect.",
    "expectedSkills": [
      "Root Cause Analysis",
      "Process Improvement"
    ],
    "evaluationPoints": [
      "Iteratively ask 'Why' 5 times to peel away superficial symptoms and identify systemic failure",
      "Focus on process, tooling, and communication gaps rather than placing individual blame",
      "Implement systemic guardrails (automated test in CI, linter rule) to prevent recurrence"
    ],
    "followUpTopics": [
      "Defect leakage",
      "Preventative actions"
    ]
  },
  {
    "id": "qa-017",
    "role": "QA Engineer",
    "category": "Mobile Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What mobile-specific test scenarios must you cover for iOS and Android apps?",
    "expectedSkills": [
      "Mobile Testing"
    ],
    "evaluationPoints": [
      "Device interruptions (phone calls, SMS, push notifications, low battery alerts)",
      "Network switching (Wi-Fi to 4G/5G, flight mode, offline behavior)",
      "Screen rotation, backgrounding, app memory kill by OS, and app update data migration"
    ],
    "followUpTopics": [
      "Appium basics",
      "OS version fragmentation"
    ]
  },
  {
    "id": "qa-018",
    "role": "QA Engineer",
    "category": "Accessibility",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you test a web application for accessibility compliance (WCAG 2.1 AA)?",
    "expectedSkills": [
      "Accessibility Testing"
    ],
    "evaluationPoints": [
      "Verify all interactive elements are reachable and operable via keyboard only (Tab, Enter, Space, Esc)",
      "Audit color contrast ratios for text readability (minimum 4.5:1 ratio)",
      "Use screen readers (NVDA, VoiceOver) and automated tools (axe, Lighthouse) to verify ARIA labels and alt text"
    ],
    "followUpTopics": [
      "Axe DevTools",
      "Keyboard navigation"
    ]
  },
  {
    "id": "qa-019",
    "role": "QA Engineer",
    "category": "Test Documentation",
    "difficulty": "Easy",
    "format": "practical",
    "question": "What makes a test case effective, reusable, and easy to maintain?",
    "expectedSkills": [
      "Test Documentation"
    ],
    "evaluationPoints": [
      "Clear, concise title and unique ID",
      "Explicit pre-conditions and test environment requirements",
      "Step-by-step reproduction instructions with concrete test data",
      "Precise expected result against which actual outcome is objectively validated"
    ],
    "followUpTopics": [
      "Test case management tools",
      "Test reusability"
    ]
  },
  {
    "id": "qa-020",
    "role": "QA Engineer",
    "category": "Test Quality",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What causes test flakiness in testing suites and how do you eliminate it?",
    "expectedSkills": [
      "Quality Assurance",
      "Flaky Tests"
    ],
    "evaluationPoints": [
      "Asynchronous timing issues, race conditions, and hardcoded sleep statements",
      "Shared mutable test data and non-isolated test environments",
      "Eliminate by using explicit dynamic waits, isolating test data, and running tests in containers"
    ],
    "followUpTopics": [
      "Explicit waits",
      "Test isolation"
    ]
  },
  {
    "id": "qa-021",
    "role": "QA Engineer",
    "category": "Process",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is a Defect Triage meeting, who attends, and what decisions are made?",
    "expectedSkills": [
      "Defect Management"
    ],
    "evaluationPoints": [
      "Regular meeting between QA, Product Manager, and Tech Lead to review newly filed bugs",
      "Validate bug validity, assign accurate Severity and Priority ratings",
      "Decide whether bug is fixed in current sprint, deferred to future sprint, or closed as won't fix"
    ],
    "followUpTopics": [
      "Sprint planning",
      "Backlog grooming"
    ]
  },
  {
    "id": "qa-022",
    "role": "QA Engineer",
    "category": "Data Management",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you manage test data for automated and manual testing without polluting production?",
    "expectedSkills": [
      "Test Data Management"
    ],
    "evaluationPoints": [
      "Use synthetic test data generators (Faker libraries) and dedicated staging databases",
      "Implement automated database seed and cleanup scripts per test suite execution",
      "Mask or anonymize production data copies to comply with privacy regulations (GDPR, HIPAA)"
    ],
    "followUpTopics": [
      "Data masking",
      "Synthetic data"
    ]
  },
  {
    "id": "qa-023",
    "role": "QA Engineer",
    "category": "CI/CD",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does automated testing fit into a CI/CD pipeline (e.g. GitHub Actions, Jenkins)?",
    "expectedSkills": [
      "CI/CD",
      "Automation"
    ],
    "evaluationPoints": [
      "Trigger smoke test suite on every pull request to validate commit before merge",
      "Trigger full regression test suite on nightly builds or merge to main",
      "Block deployment if automated test gates fail, alerting team with detailed reports"
    ],
    "followUpTopics": [
      "Test reporting",
      "Quality gates"
    ]
  },
  {
    "id": "qa-024",
    "role": "QA Engineer",
    "category": "Modern QA",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is 'Shift-Left' testing and how does it reduce software development costs?",
    "expectedSkills": [
      "Modern QA",
      "Shift-Left"
    ],
    "evaluationPoints": [
      "Involving QA early in requirements analysis and design phases before code is written",
      "Catching ambiguities, logic flaws, and architectural gaps early when they are 10x cheaper to fix",
      "Developers write unit tests; QA collaborates on acceptance criteria (BDD)"
    ],
    "followUpTopics": [
      "BDD (Behavior Driven Development)",
      "Cost of quality"
    ]
  },
  {
    "id": "qa-025",
    "role": "QA Engineer",
    "category": "BDD",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Behavior-Driven Development (BDD) and write a Gherkin scenario (Given-When-Then) for user login.",
    "expectedSkills": [
      "BDD",
      "Gherkin"
    ],
    "evaluationPoints": [
      "Collaboration approach using natural language accessible to non-technical business stakeholders",
      "Feature: User Login; Scenario: Successful login with valid credentials",
      "Given user is on login page; When user enters valid credentials; Then user is redirected to dashboard"
    ],
    "followUpTopics": [
      "Cucumber framework",
      "Step definitions"
    ]
  },
  {
    "id": "qa-026",
    "role": "QA Engineer",
    "category": "Scenario Analysis",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "How do you design a comprehensive test suite for an e-commerce credit card checkout flow?",
    "expectedSkills": [
      "Test Design",
      "Scenario Analysis"
    ],
    "evaluationPoints": [
      "Positive tests: valid cards with sufficient funds, correct 3D Secure OTP verification",
      "Negative tests: expired card, invalid CVV, incorrect billing address, card with insufficient funds",
      "Edge cases: network timeout during payment processing, duplicate submit clicks, currency conversions, webhook confirmation handling"
    ],
    "followUpTopics": [
      "Idempotency in payments",
      "Test card numbers"
    ]
  },
  {
    "id": "qa-027",
    "role": "QA Engineer",
    "category": "Testing Types",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between Internationalization (i18n) and Localization (l10n) testing?",
    "expectedSkills": [
      "i18n",
      "l10n"
    ],
    "evaluationPoints": [
      "Internationalization verifies software architecture supports multiple languages without code changes",
      "Localization verifies translation accuracy, currency formats, date formats (MM/DD vs DD/MM), and cultural appropriateness for specific locales",
      "Test for text truncation/wrapping in languages with longer words (e.g. German) and RTL layout (Arabic/Hebrew)"
    ],
    "followUpTopics": [
      "RTL layouts",
      "Pseudo-localization"
    ]
  },
  {
    "id": "qa-028",
    "role": "QA Engineer",
    "category": "API Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you test that your application correctly receives and processes asynchronous third-party webhooks?",
    "expectedSkills": [
      "Webhooks",
      "API Testing"
    ],
    "evaluationPoints": [
      "Simulate webhook delivery using tools like ngrok or mock webhook dispatchers",
      "Verify signature verification (HMAC secret header) to prevent spoofing",
      "Test duplicate webhook delivery to verify idempotency (not creating duplicate transactions)"
    ],
    "followUpTopics": [
      "ngrok",
      "HMAC verification"
    ]
  },
  {
    "id": "qa-029",
    "role": "QA Engineer",
    "category": "Metrics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Defect Leakage (Defect Escape Rate) and how do you analyze it?",
    "expectedSkills": [
      "QA Metrics"
    ],
    "evaluationPoints": [
      "Percentage of defects discovered by end users in production vs total defects discovered",
      "Defect Leakage = (Production Defects / Total Defects) * 100",
      "Low leakage indicates high QA effectiveness; high leakage triggers root-cause review of testing coverage"
    ],
    "followUpTopics": [
      "Defect density",
      "QA metrics"
    ]
  },
  {
    "id": "qa-030",
    "role": "QA Engineer",
    "category": "Web Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are the testing challenges when multiple independent teams build micro-frontends on a single page?",
    "expectedSkills": [
      "Micro-Frontends",
      "Web Testing"
    ],
    "evaluationPoints": [
      "Shared state and event communication collisions between independent micro-apps",
      "CSS styling collisions and conflicting third-party library versions",
      "Testing isolated micro-apps with unit/component tests and verifying composite shell integration"
    ],
    "followUpTopics": [
      "Module Federation",
      "Contract testing in UI"
    ]
  },
  {
    "id": "qa-031",
    "role": "QA Engineer",
    "category": "Real-Time Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you test real-time chat or live notification features powered by WebSockets?",
    "expectedSkills": [
      "WebSockets",
      "Testing"
    ],
    "evaluationPoints": [
      "Verify connection establishment, message delivery, and latency under multiple concurrent clients",
      "Test connection drop, network interruption, and automatic reconnection logic",
      "Verify message ordering and offline message synchronization upon reconnecting"
    ],
    "followUpTopics": [
      "Postman WebSockets",
      "Load testing WebSockets"
    ]
  },
  {
    "id": "qa-032",
    "role": "QA Engineer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you handle a situation where a developer marks your bug report as 'Not a Bug' or 'Works on My Machine'?",
    "expectedSkills": [
      "Communication",
      "Collaboration"
    ],
    "evaluationPoints": [
      "Do not get defensive; communicate directly with developer",
      "Demonstrate reproduction steps on a clean environment with video recording or logs",
      "Refer to agreed product specification / acceptance criteria, and involve Product Manager if requirement is ambiguous"
    ],
    "followUpTopics": [
      "Conflict resolution",
      "Reproducing bugs"
    ]
  },
  {
    "id": "qa-033",
    "role": "QA Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a challenging release deadline where QA was squeezed. How did you ensure product quality without burning out?",
    "expectedSkills": [
      "Project Experience",
      "Time Management"
    ],
    "evaluationPoints": [
      "Perform risk-based testing: focus strictly on P0 critical paths and high-risk changes",
      "Leverage automated regression tests to cover stable modules rapidly",
      "Communicate residual quality risks transparently to release stakeholders for sign-off"
    ],
    "followUpTopics": [
      "Risk-based testing",
      "Stakeholder communication"
    ]
  },
  {
    "id": "qa-034",
    "role": "QA Engineer",
    "category": "Strategy",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "If you join a startup with zero formal QA processes, what are the first three improvements you implement?",
    "expectedSkills": [
      "Process Improvement",
      "Strategy"
    ],
    "evaluationPoints": [
      "Define standard bug reporting template and bug lifecycle in issue tracker",
      "Establish clear Definition of Done (DoD) including acceptance criteria and smoke tests",
      "Set up automated smoke tests in CI/CD to prevent broken builds from reaching staging"
    ],
    "followUpTopics": [
      "Quality culture",
      "CI integration"
    ]
  },
  {
    "id": "qa-035",
    "role": "QA Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How is Generative AI transforming software testing (test case generation, synthetic data, visual testing)?",
    "expectedSkills": [
      "Modern QA",
      "AI in Testing"
    ],
    "evaluationPoints": [
      "Auto-generating test cases and edge cases from user story descriptions",
      "Generating realistic synthetic test datasets with complex constraints",
      "Visual regression testing with AI comparing UI layouts and catching visual anomalies across screen sizes"
    ],
    "followUpTopics": [
      "Applitools Eyes",
      "AI test automation"
    ]
  }
];
