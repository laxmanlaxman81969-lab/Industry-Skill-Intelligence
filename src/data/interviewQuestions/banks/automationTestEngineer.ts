import { RoleQuestion } from '../types';

export const AUTOMATION_TEST_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "ate-001",
    "role": "Automation Test Engineer",
    "category": "Automation Architecture",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the Page Object Model (POM) design pattern and its advantages in UI automation.",
    "expectedSkills": [
      "POM",
      "Design Patterns"
    ],
    "evaluationPoints": [
      "Each web page is represented by a class containing elements and user action methods",
      "Tests interact with methods, not raw locators, reducing code duplication",
      "Changes to UI require updating locator in one single class rather than hundreds of tests"
    ],
    "followUpTopics": [
      "PageFactory vs By locators",
      "Fluent Page Object Model"
    ]
  },
  {
    "id": "ate-002",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Implicit Wait, Explicit Wait, and Fluent Wait in Selenium WebDriver.",
    "expectedSkills": [
      "Selenium",
      "Synchronization"
    ],
    "evaluationPoints": [
      "Implicit Wait sets global timeout for all element lookups in WebDriver instance",
      "Explicit Wait halts execution until specific ExpectedCondition is met for a single element (e.g. elementToBeClickable)",
      "Fluent Wait defines polling frequency and exceptions to ignore (NoSuchElementException) while waiting"
    ],
    "followUpTopics": [
      "WebDriverWait",
      "Thread.sleep anti-pattern"
    ]
  },
  {
    "id": "ate-003",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Rank Selenium locators by reliability and speed: ID, Name, CSS Selector, XPath, Class.",
    "expectedSkills": [
      "Selenium Locators"
    ],
    "evaluationPoints": [
      "ID is fastest and most reliable when unique",
      "Name and CSS Selectors are fast and readable",
      "XPath is versatile (traversing parent, ancestor, following-sibling) but slower",
      "Class Name is prone to brittle changes in responsive CSS"
    ],
    "followUpTopics": [
      "Relative XPath vs Absolute XPath",
      "Dynamic locators"
    ]
  },
  {
    "id": "ate-004",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What causes StaleElementReferenceException in Selenium and how do you resolve it?",
    "expectedSkills": [
      "Selenium",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Element was found in DOM earlier, but page refreshed or DOM was updated by JavaScript, detaching element",
      "Resolutions: re-locating the element right before interaction, or using retry loops with try-catch",
      "Explicit wait with ExpectedConditions.stalenessOf or refetching via By locator"
    ],
    "followUpTopics": [
      "DOM detachment",
      "Dynamic single page apps"
    ]
  },
  {
    "id": "ate-005",
    "role": "Automation Test Engineer",
    "category": "Tooling",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Selenium, Cypress, and Playwright for modern web test automation.",
    "expectedSkills": [
      "Playwright",
      "Cypress",
      "Selenium"
    ],
    "evaluationPoints": [
      "Selenium: mature standard using W3C WebDriver protocol, multi-language, supports all browsers",
      "Cypress: runs directly inside browser event loop, excellent dev experience, but limited multi-tab/iframe support",
      "Playwright: uses Chrome DevTools Protocol / WebSockets, ultra-fast, multi-tab, multi-browser, native auto-waiting"
    ],
    "followUpTopics": [
      "Headless execution",
      "DevTools Protocol"
    ]
  },
  {
    "id": "ate-006",
    "role": "Automation Test Engineer",
    "category": "Test Frameworks",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare TestNG and JUnit 5 for test execution management and reporting.",
    "expectedSkills": [
      "TestNG",
      "JUnit 5"
    ],
    "evaluationPoints": [
      "TestNG provides powerful XML suite configuration, group dependencies, and parallel execution by default",
      "JUnit 5 provides modern architecture, extensions, dynamic tests, and nested tests",
      "Both support annotations (@Test, @BeforeMethod, @DataProvider)"
    ],
    "followUpTopics": [
      "TestNG DataProvider",
      "Parallel test execution"
    ]
  },
  {
    "id": "ate-007",
    "role": "Automation Test Engineer",
    "category": "Framework Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design a Data-Driven test automation framework reading from Excel or JSON?",
    "expectedSkills": [
      "Data-Driven Testing",
      "Frameworks"
    ],
    "evaluationPoints": [
      "Separate test logic from test data sets",
      "Use Apache POI to read Excel or Jackson to parse JSON into Java POJOs",
      "Feed data into tests using TestNG @DataProvider or JUnit @ParameterizedTest"
    ],
    "followUpTopics": [
      "Apache POI",
      "DataProvider"
    ]
  },
  {
    "id": "ate-008",
    "role": "Automation Test Engineer",
    "category": "API Automation",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write a RestAssured test in Java that sends a POST request with JSON and validates HTTP 201 and response field.",
    "expectedSkills": [
      "RestAssured",
      "API Testing"
    ],
    "evaluationPoints": [
      "given().contentType(ContentType.JSON).body(payload)",
      "when().post('/api/v1/users')",
      "then().statusCode(201).body('name', equalTo('John'))"
    ],
    "followUpTopics": [
      "Hamcrest matchers",
      "Schema validation"
    ]
  },
  {
    "id": "ate-009",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you locate and interact with elements inside iFrames and Shadow DOM in Selenium?",
    "expectedSkills": [
      "Selenium",
      "Advanced Locators"
    ],
    "evaluationPoints": [
      "iFrames: driver.switchTo().frame(frameElement); must switch back with defaultContent()",
      "Shadow DOM: driver.findElement(By.cssSelector('host')).getShadowRoot() in Selenium 4",
      "Playwright Pierces shadow DOM automatically without special syntax"
    ],
    "followUpTopics": [
      "getShadowRoot",
      "Nested iframes"
    ]
  },
  {
    "id": "ate-010",
    "role": "Automation Test Engineer",
    "category": "CI/CD",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is Headless browser testing and why is it standard in CI/CD build agents?",
    "expectedSkills": [
      "Headless Browsers",
      "CI/CD"
    ],
    "evaluationPoints": [
      "Runs browser without graphical display UI, saving significant CPU and RAM",
      "Runs seamlessly on headless Linux container agents (Docker, GitHub Actions)",
      "Much faster execution for large regression suites"
    ],
    "followUpTopics": [
      "ChromeOptions --headless=new",
      "Xvfb virtual display"
    ]
  },
  {
    "id": "ate-011",
    "role": "Automation Test Engineer",
    "category": "Selenium Grid",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Selenium Grid 4 distribute test execution across multiple nodes and browsers?",
    "expectedSkills": [
      "Selenium Grid"
    ],
    "evaluationPoints": [
      "Hub (Router, Distributor, Session Queue) routes incoming sessions to available Node instances",
      "Nodes run target browsers on specific OS platforms (Chrome on Linux, Safari on Mac)",
      "Supports standalone, hub-and-node, and fully distributed microservice deployment modes"
    ],
    "followUpTopics": [
      "Docker Selenium Grid",
      "Cloud test grids"
    ]
  },
  {
    "id": "ate-012",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you automate file uploads when the browser file picker dialog opens?",
    "expectedSkills": [
      "Selenium"
    ],
    "evaluationPoints": [
      "Send the absolute file path directly to the input element: driver.findElement(By.xpath('//input[@type=\"file\"]')).sendKeys('/path/to/file')",
      "Avoid OS-level file dialogs which Selenium cannot interact with natively",
      "Use Robot class or AutoIT only if input type=file is strictly not available in DOM"
    ],
    "followUpTopics": [
      "Input type=file",
      "Robot class"
    ]
  },
  {
    "id": "ate-013",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you handle browser JavaScript alerts, prompts, and confirmation dialogs in Selenium?",
    "expectedSkills": [
      "Selenium"
    ],
    "evaluationPoints": [
      "driver.switchTo().alert() switches context to active JS modal",
      "alert.accept() clicks OK; alert.dismiss() clicks Cancel",
      "alert.sendKeys('text') enters input into prompt dialog; alert.getText() reads alert message"
    ],
    "followUpTopics": [
      "Modal dialogs vs JS alerts",
      "Unclosed alert exceptions"
    ]
  },
  {
    "id": "ate-014",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you switch between multiple browser tabs or popup windows in Selenium?",
    "expectedSkills": [
      "Selenium"
    ],
    "evaluationPoints": [
      "driver.getWindowHandle() gets current window ID; driver.getWindowHandles() returns Set of all open window IDs",
      "Loop through Set and call driver.switchTo().window(handle) to switch focus",
      "driver.close() closes active tab; driver.switchTo().window(parentHandle) returns to original tab"
    ],
    "followUpTopics": [
      "Window handles",
      "Popup windows"
    ]
  },
  {
    "id": "ate-015",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you automate drag-and-drop, mouse hover, and double-click using Selenium Actions class?",
    "expectedSkills": [
      "Selenium Actions"
    ],
    "evaluationPoints": [
      "Actions actions = new Actions(driver)",
      "actions.moveToElement(element).perform() for hover",
      "actions.dragAndDrop(source, target).perform() or clickAndHold + moveToElement + release",
      "Always invoke .build().perform() to execute composite action chains"
    ],
    "followUpTopics": [
      "Keyboard shortcuts",
      "Context click (right-click)"
    ]
  },
  {
    "id": "ate-016",
    "role": "Automation Test Engineer",
    "category": "Selenium WebDriver",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "When must you use JavascriptExecutor in Selenium and give examples of scrolling and clicking.",
    "expectedSkills": [
      "JavascriptExecutor"
    ],
    "evaluationPoints": [
      "When native click fails due to ElementClickInterceptedException or element is hidden",
      "JavascriptExecutor js = (JavascriptExecutor) driver; js.executeScript('arguments[0].click();', element);",
      "Scrolling into view: js.executeScript('arguments[0].scrollIntoView(true);', element);"
    ],
    "followUpTopics": [
      "Scrolling to bottom",
      "Overcoming click intercepts"
    ]
  },
  {
    "id": "ate-017",
    "role": "Automation Test Engineer",
    "category": "BDD",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Feature files, Step Definitions, and TestRunner in a Cucumber BDD framework.",
    "expectedSkills": [
      "Cucumber",
      "BDD"
    ],
    "evaluationPoints": [
      "Feature file contains Gherkin scenarios (Given, When, Then)",
      "Step Definition class implements Java methods annotated with regex matching Gherkin steps",
      "TestRunner class (using @RunWith(Cucumber.class) or AbstractTestNGCucumberTests) orchestrates suite execution and reporting"
    ],
    "followUpTopics": [
      "Cucumber Hooks (@Before, @After)",
      "Scenario Outline and Examples"
    ]
  },
  {
    "id": "ate-018",
    "role": "Automation Test Engineer",
    "category": "Visual Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does automated Visual Regression Testing work (e.g. Percy, Applitools Eyes)?",
    "expectedSkills": [
      "Visual Testing"
    ],
    "evaluationPoints": [
      "Captures DOM and visual pixel screenshots across screen sizes and browsers",
      "Compares screenshot against approved baseline snapshot using computer vision algorithms",
      "Flags unexpected pixel shifts, color changes, and layout overflow before production deploy"
    ],
    "followUpTopics": [
      "Baseline comparison",
      "Applitools AI vision"
    ]
  },
  {
    "id": "ate-019",
    "role": "Automation Test Engineer",
    "category": "Reporting",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you generate comprehensive execution reports with screenshots on failure using Allure?",
    "expectedSkills": [
      "Reporting",
      "Allure"
    ],
    "evaluationPoints": [
      "Integrate Allure TestNG/JUnit listener into build file (pom.xml)",
      "Implement TestListener (onTestFailure) to capture screenshot as byte array and attach with @Attachment",
      "Generates interactive HTML dashboard with test trends, logs, severity, and failure categorization"
    ],
    "followUpTopics": [
      "ExtentReports",
      "CI report publishing"
    ]
  },
  {
    "id": "ate-020",
    "role": "Automation Test Engineer",
    "category": "API Automation",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you validate JSON Schema compliance in RestAssured to catch API contract breaking changes?",
    "expectedSkills": [
      "RestAssured",
      "JSON Schema"
    ],
    "evaluationPoints": [
      "given().get('/api/users').then().assertThat().body(matchesJsonSchemaInClasspath('user-schema.json'))",
      "Validates that all required fields, data types, and enum values conform to published API contract",
      "Catches missing fields or type drift without writing dozens of individual field assertions"
    ],
    "followUpTopics": [
      "JSON Schema Draft 7",
      "Contract testing"
    ]
  },
  {
    "id": "ate-021",
    "role": "Automation Test Engineer",
    "category": "Framework Architecture",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you ensure ThreadSafety in an automation framework running tests in parallel?",
    "expectedSkills": [
      "Concurrency",
      "ThreadSafety"
    ],
    "evaluationPoints": [
      "Use ThreadLocal<WebDriver> to ensure each concurrent test thread gets its own isolated browser instance",
      "Never declare WebDriver as static without ThreadLocal wrapping",
      "Configure thread count in testng.xml or surefire maven plugin (parallel='methods' thread-count='4')"
    ],
    "followUpTopics": [
      "ThreadLocal WebDriver",
      "Maven Surefire parallel"
    ]
  },
  {
    "id": "ate-022",
    "role": "Automation Test Engineer",
    "category": "Advanced Locators",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why can't standard XPath find elements inside a closed or open Shadow DOM?",
    "expectedSkills": [
      "Shadow DOM",
      "Web Standards"
    ],
    "evaluationPoints": [
      "Shadow DOM encapsulates internal DOM tree from outer document; standard XPath engine cannot cross shadow boundary",
      "Open shadow DOM can be traversed using JavaScript or CSS selectors with shadowRoot.querySelector()",
      "Closed shadow DOM blocks external programmatic access entirely"
    ],
    "followUpTopics": [
      "Open vs Closed Shadow DOM",
      "CSS ::part selector"
    ]
  },
  {
    "id": "ate-023",
    "role": "Automation Test Engineer",
    "category": "Mobile Automation",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Appium automate native iOS and Android apps using the WebDriver protocol?",
    "expectedSkills": [
      "Appium",
      "Mobile Automation"
    ],
    "evaluationPoints": [
      "Appium server receives standard W3C WebDriver commands and translates them to vendor automation frameworks",
      "Uses UiAutomator2 for Android and XCUITest for iOS",
      "Same test scripts can run cross-platform on real devices and emulators"
    ],
    "followUpTopics": [
      "Appium Inspector",
      "DesiredCapabilities"
    ]
  },
  {
    "id": "ate-024",
    "role": "Automation Test Engineer",
    "category": "Framework Design",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What components make up a scalable, enterprise-grade Hybrid Test Automation Framework?",
    "expectedSkills": [
      "Framework Design"
    ],
    "evaluationPoints": [
      "Base Test setup/teardown with ThreadLocal WebDriver",
      "Page Object Model layer encapsulating application pages",
      "Utilities: Excel/JSON data readers, dynamic wait helpers, and config managers",
      "Reporting: Allure/Extent reports with failure screenshots, integrated into CI/CD"
    ],
    "followUpTopics": [
      "Config.properties reader",
      "Maven dependency management"
    ]
  },
  {
    "id": "ate-025",
    "role": "Automation Test Engineer",
    "category": "Testing Strategy",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you handle CAPTCHA, 2FA, and OTP challenges during automated test runs?",
    "expectedSkills": [
      "Test Strategy",
      "Security"
    ],
    "evaluationPoints": [
      "CAPTCHAs are designed to block automation; disable CAPTCHA in staging/test environments",
      "Use static test accounts with fixed bypass OTP codes (e.g. 123456) in non-production",
      "Or generate TOTP tokens programmatically using an authenticator library with secret key"
    ],
    "followUpTopics": [
      "Bypass headers",
      "TOTP generation"
    ]
  },
  {
    "id": "ate-026",
    "role": "Automation Test Engineer",
    "category": "UI Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why is network mocking useful during frontend UI automation and how does Playwright support it?",
    "expectedSkills": [
      "Playwright",
      "Mocking"
    ],
    "evaluationPoints": [
      "Isolates UI tests from backend instability, rate limits, and missing test data",
      "Playwright's page.route() intercepts network requests and returns mock JSON responses instantly",
      "Allows testing rare error states (500 errors, timeout handling) on the UI deterministically"
    ],
    "followUpTopics": [
      "page.route()",
      "WireMock"
    ]
  },
  {
    "id": "ate-027",
    "role": "Automation Test Engineer",
    "category": "Authentication",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you test OAuth2 login flows (Google/GitHub login) without writing fragile automated UI scripts?",
    "expectedSkills": [
      "Authentication",
      "OAuth"
    ],
    "evaluationPoints": [
      "UI testing third-party login pages triggers bot detection and rate limits",
      "Bypass UI by authenticating via API call and injecting auth cookies/tokens directly into browser context",
      "Test OAuth integration logic separately at the API layer with test credentials"
    ],
    "followUpTopics": [
      "Browser context injection",
      "Bypassing bot detection"
    ]
  },
  {
    "id": "ate-028",
    "role": "Automation Test Engineer",
    "category": "Advanced Locators",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you interact with SVG and HTML5 Canvas elements in Selenium?",
    "expectedSkills": [
      "Selenium",
      "SVG"
    ],
    "evaluationPoints": [
      "SVG elements cannot use standard xpath syntax //svg; must use //*[local-name()='svg'] or CSS selectors",
      "Canvas renders raw pixel bitmaps without distinct DOM nodes; interact using Actions class with x, y coordinate offsets or execute JavaScript"
    ],
    "followUpTopics": [
      "local-name() function",
      "Canvas pixel testing"
    ]
  },
  {
    "id": "ate-029",
    "role": "Automation Test Engineer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you capture Core Web Vitals (LCP, CLS) programmatically during automated test execution?",
    "expectedSkills": [
      "Performance",
      "Core Web Vitals"
    ],
    "evaluationPoints": [
      "Using Chrome DevTools Protocol (CDP) through Selenium 4 or Playwright",
      "Execute JavaScript window.performance.getEntriesByType('navigation') to measure load timings",
      "Automate Lighthouse audits in CI pipelines using lighthouse-ci"
    ],
    "followUpTopics": [
      "Selenium 4 CDP",
      "Lighthouse CI"
    ]
  },
  {
    "id": "ate-030",
    "role": "Automation Test Engineer",
    "category": "Modern Trends",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Self-Healing automation and how does it prevent broken test scripts from breaking builds?",
    "expectedSkills": [
      "Modern Trends",
      "Self-Healing"
    ],
    "evaluationPoints": [
      "When a primary locator fails, AI/heuristics evaluate multiple attributes (text, relative position, parent ID, tag)",
      "Finds matching element with highest confidence score and continues test execution without failing",
      "Logs recommended locator updates to framework for engineer approval"
    ],
    "followUpTopics": [
      "Heuristic locators",
      "Test maintenance reduction"
    ]
  },
  {
    "id": "ate-031",
    "role": "Automation Test Engineer",
    "category": "Data Management",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you guarantee test data isolation when multiple automated tests run in parallel?",
    "expectedSkills": [
      "Test Isolation"
    ],
    "evaluationPoints": [
      "Each test creates unique entities prefixed with random UUIDs (e.g. test_user_a9f8b@test.com)",
      "Run tests inside temporary database transactions and rollback after test completes",
      "Use containerized disposable databases (Testcontainers) per test worker"
    ],
    "followUpTopics": [
      "Testcontainers",
      "Transactional rollbacks"
    ]
  },
  {
    "id": "ate-032",
    "role": "Automation Test Engineer",
    "category": "Quality Engineering",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "How do you manage and eliminate flaky tests in a team with a large automation suite?",
    "expectedSkills": [
      "Flaky Tests",
      "Process"
    ],
    "evaluationPoints": [
      "Automatically detect and quarantine flaky tests out of blocking PR pipelines",
      "Assign flaky tests to triage backlog with failure logs and video recordings",
      "Require tests to pass 20 consecutive runs in quarantine before returning to production suite"
    ],
    "followUpTopics": [
      "Quarantine suites",
      "Flakiness metrics"
    ]
  },
  {
    "id": "ate-033",
    "role": "Automation Test Engineer",
    "category": "Leadership",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How have you mentored manual QA team members to transition into writing test automation?",
    "expectedSkills": [
      "Mentorship",
      "Collaboration"
    ],
    "evaluationPoints": [
      "Start with modular Page Object Model and reusable helper methods to teach coding fundamentals",
      "Pair programming on real sprint test cases",
      "Establish code review guidelines focused on readability and maintainability"
    ],
    "followUpTopics": [
      "Pair programming",
      "Automation training"
    ]
  },
  {
    "id": "ate-034",
    "role": "Automation Test Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Walk me through an automation framework you designed from the ground up. What trade-offs did you make?",
    "expectedSkills": [
      "Framework Design",
      "Communication"
    ],
    "evaluationPoints": [
      "Language and tool selection (Java/Selenium vs TypeScript/Playwright)",
      "Structure of POM, data management, and parallel execution",
      "CI/CD integration, reporting dashboard, and test execution time reduction results"
    ],
    "followUpTopics": [
      "Scalability trade-offs",
      "CI integration"
    ]
  },
  {
    "id": "ate-035",
    "role": "Automation Test Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How are Large Language Models impacting the development and maintenance of test automation suites?",
    "expectedSkills": [
      "AI in Testing",
      "LLMs"
    ],
    "evaluationPoints": [
      "Auto-generating Page Object classes and test scripts from DOM snapshots or Figma designs",
      "Natural language test creation where plain English instructions translate into executable code",
      "Automated bug analysis correlating failure logs with recent code commits"
    ],
    "followUpTopics": [
      "Playwright Codegen",
      "Autonomous testing"
    ]
  }
];
