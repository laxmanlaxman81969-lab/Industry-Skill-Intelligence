import { RoleQuestion } from '../types';

export const SOFTWARE_TESTING_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "ste-001",
    "role": "Software Testing Engineer",
    "category": "Testing Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the difference between Verification and Validation in software engineering (V-Model).",
    "expectedSkills": [
      "Testing Fundamentals",
      "V-Model"
    ],
    "evaluationPoints": [
      "Verification: 'Are we building the product right?' (Reviews, inspections, static testing of specs and code)",
      "Validation: 'Are we building the right product?' (Dynamic execution of software to verify customer needs)",
      "Verification is static; Validation is dynamic"
    ],
    "followUpTopics": [
      "V-Model",
      "Static testing"
    ]
  },
  {
    "id": "ste-002",
    "role": "Software Testing Engineer",
    "category": "Testing Methodologies",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Black Box, White Box, and Grey Box testing with examples of each.",
    "expectedSkills": [
      "Testing Methodologies"
    ],
    "evaluationPoints": [
      "Black Box: testing functionality without knowing internal code/structure (functional, UI)",
      "White Box: testing internal structure, code paths, and logic (unit tests, code coverage)",
      "Grey Box: partial knowledge of internal architecture (database testing, API integration testing)"
    ],
    "followUpTopics": [
      "Code coverage",
      "Statement coverage"
    ]
  },
  {
    "id": "ste-003",
    "role": "Software Testing Engineer",
    "category": "Test Design",
    "difficulty": "Easy",
    "format": "practical",
    "question": "Design boundary value test cases for a password field requiring 8 to 16 characters.",
    "expectedSkills": [
      "Test Design",
      "BVA"
    ],
    "evaluationPoints": [
      "Boundary values to test: 7 (Invalid), 8 (Valid min), 9 (Valid min+1), 15 (Valid max-1), 16 (Valid max), 17 (Invalid max+1)",
      "Check exact character count behavior and error messages",
      "Test special characters and empty input"
    ],
    "followUpTopics": [
      "Equivalence partitioning",
      "Negative testing"
    ]
  },
  {
    "id": "ste-004",
    "role": "Software Testing Engineer",
    "category": "Testing Types",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the core distinction between Functional and Non-Functional testing?",
    "expectedSkills": [
      "Testing Types"
    ],
    "evaluationPoints": [
      "Functional testing validates WHAT the system does (features, user actions, business rules)",
      "Non-functional testing validates HOW the system performs (speed, reliability, scalability, security, usability)",
      "Both are equally critical for product success"
    ],
    "followUpTopics": [
      "System testing",
      "Usability testing"
    ]
  },
  {
    "id": "ste-005",
    "role": "Software Testing Engineer",
    "category": "Metrics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Defect Density and how is it calculated across modules?",
    "expectedSkills": [
      "QA Metrics"
    ],
    "evaluationPoints": [
      "Defect Density = Total Defect Count / Module Size (KLOC or Function Points)",
      "Identifies high-risk modules with disproportionate failure rates",
      "Directs testing focus and code refactoring efforts"
    ],
    "followUpTopics": [
      "Defect removal efficiency",
      "Test coverage metrics"
    ]
  },
  {
    "id": "ste-006",
    "role": "Software Testing Engineer",
    "category": "Test Design",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does State Transition Testing apply to testing an e-commerce order workflow?",
    "expectedSkills": [
      "Test Design",
      "State Transitions"
    ],
    "evaluationPoints": [
      "Map all valid system states: Order Placed -> Payment Pending -> Paid -> Shipped -> Delivered -> Returned",
      "Identify valid transitions and invalid transitions (e.g. attempting to Ship an Unpaid order)",
      "Verify system handles invalid state changes gracefully with error messages"
    ],
    "followUpTopics": [
      "State transition diagrams",
      "Negative testing"
    ]
  },
  {
    "id": "ste-007",
    "role": "Software Testing Engineer",
    "category": "Test Design",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you build a Decision Table to test credit card approval based on credit score, income, and debt ratio?",
    "expectedSkills": [
      "Test Design",
      "Decision Tables"
    ],
    "evaluationPoints": [
      "List conditions (Credit Score > 700, Income > $50k, Debt Ratio < 30%)",
      "Create combination matrix of True/False condition values (2^N rules)",
      "Define expected action (Approve, Manual Review, Reject) for each combination"
    ],
    "followUpTopics": [
      "Truth tables",
      "Combinatorial testing"
    ]
  },
  {
    "id": "ste-008",
    "role": "Software Testing Engineer",
    "category": "Testing Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What activities constitute Static Testing and why does it find bugs earlier than Dynamic Testing?",
    "expectedSkills": [
      "Static Testing"
    ],
    "evaluationPoints": [
      "Static testing reviews requirements, design documents, and performs code walk-throughs without executing software",
      "Catches ambiguities and architectural flaws before a single line of code is run",
      "Dynamic testing executes compiled code with test data inputs"
    ],
    "followUpTopics": [
      "Peer reviews",
      "Inspection checklists"
    ]
  },
  {
    "id": "ste-009",
    "role": "Software Testing Engineer",
    "category": "API Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you test that an API correctly differentiates 4xx client errors from 5xx server errors?",
    "expectedSkills": [
      "API Testing",
      "HTTP"
    ],
    "evaluationPoints": [
      "Send invalid input, missing auth headers, bad types -> verify 400 Bad Request, 401 Unauthorized, 422 Unprocessable",
      "Simulate backend database downtime or null pointer -> verify 500 Internal Server Error without leaking internal stack traces",
      "Assert client receives actionable, structured error payloads"
    ],
    "followUpTopics": [
      "HTTP status codes",
      "Security in error responses"
    ]
  },
  {
    "id": "ste-010",
    "role": "Software Testing Engineer",
    "category": "Exploratory Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is a Test Charter in session-based exploratory testing?",
    "expectedSkills": [
      "Exploratory Testing"
    ],
    "evaluationPoints": [
      "A focused mission statement defining target area, goal, and time-box for an exploratory session",
      "Example: 'Explore shopping cart discount code inputs with expired and multi-use coupons to discover edge case vulnerabilities'",
      "Includes session debrief notes and bug logs"
    ],
    "followUpTopics": [
      "Time-boxing",
      "Session-based testing"
    ]
  },
  {
    "id": "ste-011",
    "role": "Software Testing Engineer",
    "category": "Agile",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between User Story Acceptance Criteria and Definition of Done (DoD)?",
    "expectedSkills": [
      "Agile",
      "Scrum"
    ],
    "evaluationPoints": [
      "Acceptance Criteria are unique business conditions specific to a single user story",
      "Definition of Done (DoD) is a universal quality checklist applied to ALL user stories across team (code reviewed, tested, documented, deployed to staging)",
      "A story cannot be closed unless both are fully satisfied"
    ],
    "followUpTopics": [
      "User stories",
      "Sprint DoD"
    ]
  },
  {
    "id": "ste-012",
    "role": "Software Testing Engineer",
    "category": "Database Testing",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Why is UI verification alone insufficient when testing account creation?",
    "expectedSkills": [
      "Database Testing"
    ],
    "evaluationPoints": [
      "UI might show 'Success' even if database failed to write secondary tables (profile, notifications)",
      "Verify primary database record exists with correct password hashing (not plain text)",
      "Verify default values, foreign keys, and audit log entries"
    ],
    "followUpTopics": [
      "Data integrity",
      "SQL verification"
    ]
  },
  {
    "id": "ste-013",
    "role": "Software Testing Engineer",
    "category": "Usability",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Nielsen's Usability Heuristics: Error Prevention, Consistency, and Visibility of System Status.",
    "expectedSkills": [
      "Usability Testing"
    ],
    "evaluationPoints": [
      "Visibility of system status: system always provides clear feedback (loading spinners, progress bars)",
      "Consistency and standards: users shouldn't wonder whether different words or icons mean the same thing",
      "Error prevention: eliminate error-prone conditions or confirm before destructive actions (Delete confirmation modal)"
    ],
    "followUpTopics": [
      "UX heuristics",
      "User accessibility"
    ]
  },
  {
    "id": "ste-014",
    "role": "Software Testing Engineer",
    "category": "Mobile & Web",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you test web and mobile applications under slow, high-latency, or dropping network connections?",
    "expectedSkills": [
      "Network Testing"
    ],
    "evaluationPoints": [
      "Use network throttling in Chrome DevTools (Slow 3G, Offline)",
      "Verify loading states, skeleton screens, and sensible timeout error messages",
      "Test offline mode: verify local caching and graceful synchronization once connectivity is restored"
    ],
    "followUpTopics": [
      "Network throttling",
      "Offline caching"
    ]
  },
  {
    "id": "ste-015",
    "role": "Software Testing Engineer",
    "category": "Security Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What security test cases do you execute against login and session management features?",
    "expectedSkills": [
      "Security Testing"
    ],
    "evaluationPoints": [
      "Test password brute-force lockouts after 5 failed attempts",
      "Verify session token is invalidated upon logout and password change",
      "Verify password reset tokens expire after time-box and are single-use",
      "Test session fixation by checking token changes before and after login"
    ],
    "followUpTopics": [
      "Session fixation",
      "Brute force testing"
    ]
  },
  {
    "id": "ste-016",
    "role": "Software Testing Engineer",
    "category": "Test Management",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you maintain a regression test suite to prevent it from becoming unmanageably bloated over time?",
    "expectedSkills": [
      "Regression Testing"
    ],
    "evaluationPoints": [
      "Periodically retire redundant or obsolete test cases for deprecated features",
      "Automate high-value, stable test cases into CI/CD regression suites",
      "Consolidate overlapping test scenarios into parameterized data-driven tests"
    ],
    "followUpTopics": [
      "Test suite optimization",
      "Traceability"
    ]
  },
  {
    "id": "ste-017",
    "role": "Software Testing Engineer",
    "category": "Testing Strategy",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you perform Risk-Based Testing when project timelines are cut in half?",
    "expectedSkills": [
      "Risk-Based Testing"
    ],
    "evaluationPoints": [
      "Assess risk for each module: Risk = Likelihood of Failure * Impact of Failure",
      "Assign modules to High, Medium, and Low risk tiers",
      "Direct 80% of remaining testing effort to High risk modules (payment, auth, data loss risks), accepting residual risk in Low tiers"
    ],
    "followUpTopics": [
      "Risk matrix",
      "Residual risk"
    ]
  },
  {
    "id": "ste-018",
    "role": "Software Testing Engineer",
    "category": "Testing Types",
    "difficulty": "Easy",
    "format": "practical",
    "question": "Describe the end-to-end test workflow for a flight booking system.",
    "expectedSkills": [
      "E2E Testing",
      "Scenario Testing"
    ],
    "evaluationPoints": [
      "Search flights with dates and passengers -> Select flight and fare class",
      "Enter passenger details with passport validation -> Select seats",
      "Apply promo code -> Complete payment through gateway -> Verify booking confirmation email and database ticket generation"
    ],
    "followUpTopics": [
      "Happy path vs edge cases",
      "System integration"
    ]
  },
  {
    "id": "ste-019",
    "role": "Software Testing Engineer",
    "category": "Compatibility",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you construct an effective hardware/software Compatibility Testing Matrix?",
    "expectedSkills": [
      "Compatibility Testing"
    ],
    "evaluationPoints": [
      "Analyze Google Analytics data to identify top OS, browser, and device resolutions used by real customers",
      "Create matrix mapping platforms (Windows, macOS, iOS, Android) to browsers and viewports",
      "Prioritize testing tier 1 combinations representing 80%+ of audience"
    ],
    "followUpTopics": [
      "Browser matrix",
      "Responsive viewports"
    ]
  },
  {
    "id": "ste-020",
    "role": "Software Testing Engineer",
    "category": "Accessibility",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you evaluate accessibility using screen readers like NVDA or VoiceOver?",
    "expectedSkills": [
      "Accessibility",
      "WCAG"
    ],
    "evaluationPoints": [
      "Navigate entire application using Tab, Shift-Tab, and arrow keys with eyes closed",
      "Verify screen reader announces meaningful labels for buttons, inputs, and error notices",
      "Ensure decorative images are ignored (aria-hidden) and informational images have alt text"
    ],
    "followUpTopics": [
      "Screen readers",
      "ARIA attributes"
    ]
  },
  {
    "id": "ste-021",
    "role": "Software Testing Engineer",
    "category": "Defect Management",
    "difficulty": "Easy",
    "format": "practical",
    "question": "What information separates an exceptional bug report from an unhelpful one?",
    "expectedSkills": [
      "Defect Management"
    ],
    "evaluationPoints": [
      "Actionable headline with component tag: [Checkout] Promo code discount calculates negative total",
      "Exact step-by-step reproduction steps with test credentials and payload",
      "Expected behavior vs Actual observed behavior with screenshots/video and network logs"
    ],
    "followUpTopics": [
      "Reproducibility",
      "Log attachment"
    ]
  },
  {
    "id": "ste-022",
    "role": "Software Testing Engineer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Load Testing, Stress Testing, and Soak (Endurance) Testing.",
    "expectedSkills": [
      "Performance Testing"
    ],
    "evaluationPoints": [
      "Load testing: verifies system behavior under expected normal and peak traffic",
      "Stress testing: pushes traffic beyond breaking point to evaluate graceful degradation and recovery",
      "Soak testing: runs moderate traffic continuously over extended duration (24-48 hours) to detect slow memory leaks and resource exhaustion"
    ],
    "followUpTopics": [
      "Soak testing",
      "Breaking point"
    ]
  },
  {
    "id": "ste-023",
    "role": "Software Testing Engineer",
    "category": "Database Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you test concurrent transactions in multi-user booking applications (e.g. two users booking the last seat)?",
    "expectedSkills": [
      "Concurrency",
      "Database Testing"
    ],
    "evaluationPoints": [
      "Simulate two simultaneous requests attempting to reserve the exact same inventory item",
      "Verify database locking prevents double-booking",
      "One user succeeds; second user receives graceful 'Item no longer available' notification"
    ],
    "followUpTopics": [
      "Race conditions",
      "Double booking prevention"
    ]
  },
  {
    "id": "ste-024",
    "role": "Software Testing Engineer",
    "category": "Agile",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you foster a 'Quality is a Team Responsibility' mindset across software developers?",
    "expectedSkills": [
      "Quality Culture",
      "Collaboration"
    ],
    "evaluationPoints": [
      "Involve developers in acceptance criteria design and edge case brainstorming",
      "Pair with developers on writing integration tests",
      "Share customer defect feedback transparently in sprint retrospectives"
    ],
    "followUpTopics": [
      "Team responsibility",
      "Whole-team approach"
    ]
  },
  {
    "id": "ste-025",
    "role": "Software Testing Engineer",
    "category": "Web Testing",
    "difficulty": "Easy",
    "format": "practical",
    "question": "What visual and functional elements do you inspect when testing responsive layouts across breakpoints?",
    "expectedSkills": [
      "Responsive Testing"
    ],
    "evaluationPoints": [
      "Navigation menus collapsing into hamburger menus on mobile viewports",
      "Tables converting to cards or horizontal scrolling without breaking page width",
      "Tap target sizes on mobile touchscreens (minimum 48x48px) and no text overlap"
    ],
    "followUpTopics": [
      "Breakpoints",
      "Viewport testing"
    ]
  },
  {
    "id": "ste-026",
    "role": "Software Testing Engineer",
    "category": "Localization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are common visual and functional bugs uncovered during Localization (l10n) testing?",
    "expectedSkills": [
      "Localization Testing"
    ],
    "evaluationPoints": [
      "Text expansion causing button text clipping and layout misalignment (e.g. German text)",
      "Incorrect number, currency, and date formatting (comma vs period decimal separators)",
      "Hardcoded English strings missed during translation extraction"
    ],
    "followUpTopics": [
      "String externalization",
      "Date formatting"
    ]
  },
  {
    "id": "ste-027",
    "role": "Software Testing Engineer",
    "category": "API Testing",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "What negative test payloads do you send to an API to test its error-handling resilience?",
    "expectedSkills": [
      "API Testing",
      "Negative Testing"
    ],
    "evaluationPoints": [
      "Send unexpected data types (string in numeric field, boolean in array)",
      "Send extremely large payloads (10MB string) to test buffer overflow and payload size limits",
      "Send malformed JSON (missing closing braces) to verify 400 Bad Request without server crash"
    ],
    "followUpTopics": [
      "Malformed JSON",
      "Negative testing"
    ]
  },
  {
    "id": "ste-028",
    "role": "Software Testing Engineer",
    "category": "Process Improvement",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "A critical bug escaped into production. How do you lead a post-incident review to improve test coverage?",
    "expectedSkills": [
      "Incident Review",
      "Continuous Improvement"
    ],
    "evaluationPoints": [
      "Analyze why the bug was missed: was it a missing test case, bad test environment, or unclear requirement?",
      "Create automated regression test reproducing the exact failure mode",
      "Update test checklists and test design templates to catch similar patterns across all features"
    ],
    "followUpTopics": [
      "Escaped bugs",
      "Post-mortem analysis"
    ]
  },
  {
    "id": "ste-029",
    "role": "Software Testing Engineer",
    "category": "Test Management",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are the core components of a high-level Test Strategy Document for an enterprise project?",
    "expectedSkills": [
      "Test Strategy",
      "Documentation"
    ],
    "evaluationPoints": [
      "Scope of testing (In-Scope and Out-of-Scope modules)",
      "Testing types and levels (Unit, Integration, System, E2E, Performance, Security)",
      "Test environment and test data requirements",
      "Tools, defect management workflow, and release entry/exit criteria"
    ],
    "followUpTopics": [
      "Test Plan vs Test Strategy",
      "Release criteria"
    ]
  },
  {
    "id": "ste-030",
    "role": "Software Testing Engineer",
    "category": "Test Design",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you test a multi-facet e-commerce filter panel (Price, Category, Brand, Rating, In-Stock)?",
    "expectedSkills": [
      "Test Design",
      "Scenario Analysis"
    ],
    "evaluationPoints": [
      "Test single filter selection and verify result counts update accurately",
      "Test combined multi-filters (Price < $50 AND Brand = 'Sony' AND Rating >= 4)",
      "Test 'Clear All Filters' and verify browser URL query parameters update correctly for bookmarking"
    ],
    "followUpTopics": [
      "Multi-faceted search",
      "Filter combinations"
    ]
  },
  {
    "id": "ste-031",
    "role": "Software Testing Engineer",
    "category": "Mobile Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What test scenarios must you verify when testing mobile push notifications?",
    "expectedSkills": [
      "Mobile Testing",
      "Push Notifications"
    ],
    "evaluationPoints": [
      "Verify notification delivery when app is in foreground, background, and completely killed",
      "Verify tapping notification deep-links directly to the correct internal screen",
      "Test notification behavior when user has disabled notifications in device settings"
    ],
    "followUpTopics": [
      "Deep linking",
      "APNs / FCM"
    ]
  },
  {
    "id": "ste-032",
    "role": "Software Testing Engineer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "What do you do when a user story description is vague and has missing acceptance criteria?",
    "expectedSkills": [
      "Communication",
      "Agile"
    ],
    "evaluationPoints": [
      "Do not guess implementation details; schedule a quick sync with the Product Manager / Business Analyst",
      "Ask clarifying questions focused on user goals and edge cases",
      "Document agreed acceptance criteria in the user story before development begins"
    ],
    "followUpTopics": [
      "Clarifying requirements",
      "Agile communication"
    ]
  },
  {
    "id": "ste-033",
    "role": "Software Testing Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a project where testing time was severely compressed. How did you deliver high quality on time?",
    "expectedSkills": [
      "Project Experience",
      "Time Management"
    ],
    "evaluationPoints": [
      "Prioritized critical path end-to-end workflows using risk-based testing",
      "Executed automated regression suites overnight to maximize testing coverage",
      "Provided clear risk assessments and status reports to leadership for release decisions"
    ],
    "followUpTopics": [
      "Prioritization",
      "Risk management"
    ]
  },
  {
    "id": "ste-034",
    "role": "Software Testing Engineer",
    "category": "Troubleshooting",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "How do you approach testing a critical legacy system that has zero documentation and no existing test cases?",
    "expectedSkills": [
      "Exploratory Testing",
      "Legacy Systems"
    ],
    "evaluationPoints": [
      "Perform exploratory testing to map application workflows and system behavior",
      "Inspect database schemas and API network calls to understand data flow",
      "Interview senior developers and support teams to document known issues and critical workflows"
    ],
    "followUpTopics": [
      "Reverse engineering",
      "Documenting legacy systems"
    ]
  },
  {
    "id": "ste-035",
    "role": "Software Testing Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How is the role of the Software Testing Engineer evolving with Agile, DevOps, and automated pipelines?",
    "expectedSkills": [
      "Modern QA",
      "Career Growth"
    ],
    "evaluationPoints": [
      "Shift from pure manual execution to quality advocacy, test design, and exploratory testing",
      "Close collaboration with developers on testability, API contracts, and CI/CD quality gates",
      "Leveraging AI tools to accelerate test case generation, synthetic data, and exploratory testing"
    ],
    "followUpTopics": [
      "Quality advocacy",
      "Continuous testing"
    ]
  }
];
