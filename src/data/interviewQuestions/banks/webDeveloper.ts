import { RoleQuestion } from '../types';

export const WEB_DEVELOPER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "web-001",
    "role": "Web Developer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare HTTP/1.1, HTTP/2 (multiplexing, header compression), and HTTP/3 (QUIC/UDP).",
    "expectedSkills": [
      "Web Protocols",
      "HTTP"
    ],
    "evaluationPoints": [
      "HTTP/1.1 suffers from head-of-line blocking and opens multiple TCP connections",
      "HTTP/2 introduces binary framing, multiplexing multiple streams over single TCP connection, and HPACK header compression",
      "HTTP/3 replaces TCP with QUIC over UDP, eliminating TCP head-of-line blocking caused by packet loss"
    ],
    "followUpTopics": [
      "QUIC protocol",
      "Server Push"
    ]
  },
  {
    "id": "web-002",
    "role": "Web Developer",
    "category": "Browser Internals",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the Critical Rendering Path: DOM -> CSSOM -> Render Tree -> Layout -> Paint.",
    "expectedSkills": [
      "Browser Internals",
      "Performance"
    ],
    "evaluationPoints": [
      "Browser parses HTML to build Document Object Model (DOM)",
      "Parses CSS to build CSS Object Model (CSSOM)",
      "Combines DOM and CSSOM into Render Tree containing visible nodes",
      "Layout computes exact geometry and positions; Paint rasterizes pixels onto screen"
    ],
    "followUpTopics": [
      "Reflow vs Repaint",
      "will-change property"
    ]
  },
  {
    "id": "web-003",
    "role": "Web Developer",
    "category": "CSS",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How is CSS Specificity calculated? (Inline > ID > Class/Attribute > Element).",
    "expectedSkills": [
      "CSS"
    ],
    "evaluationPoints": [
      "Inline styles (1000) > IDs (100) > Classes, attributes, pseudo-classes (10) > Elements and pseudo-elements (1)",
      "!important overrides normal specificity but should be used sparingly",
      "Equal specificity resolved by source order (last declared rule wins)"
    ],
    "followUpTopics": [
      "CSS Cascade Layers (@layer)",
      "!important usage"
    ]
  },
  {
    "id": "web-004",
    "role": "Web Developer",
    "category": "JavaScript",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a closure in JavaScript? Provide an example of data privacy using closures.",
    "expectedSkills": [
      "JavaScript",
      "Closures"
    ],
    "evaluationPoints": [
      "Function remembers and accesses variables from its lexical scope even when executed outside that scope",
      "Example: function counter() { let count = 0; return () => ++count; }",
      "Used to emulate private variables before ES6 private class fields (#field)"
    ],
    "followUpTopics": [
      "Memory leaks with closures",
      "Currying"
    ]
  },
  {
    "id": "web-005",
    "role": "Web Developer",
    "category": "JavaScript",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the JavaScript Event Loop: Call Stack, Web APIs, Task Queue, and Microtask Queue.",
    "expectedSkills": [
      "JavaScript Internals",
      "Event Loop"
    ],
    "evaluationPoints": [
      "Call Stack executes synchronous code (LIFO)",
      "Asynchronous Web APIs (fetch, setTimeout) complete and push callbacks to queues",
      "Microtask Queue (Promises, queueMicrotask) has priority over Task/Macrotask Queue (setTimeout, I/O)",
      "Event loop drains all microtasks between each macrotask"
    ],
    "followUpTopics": [
      "Macrotasks vs Microtasks",
      "setTimeout(fn, 0) timing"
    ]
  },
  {
    "id": "web-006",
    "role": "Web Developer",
    "category": "Web Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Cross-Origin Resource Sharing (CORS) work? What triggers an OPTIONS preflight request?",
    "expectedSkills": [
      "Security",
      "CORS"
    ],
    "evaluationPoints": [
      "Browser security mechanism enforcing Same-Origin Policy",
      "Preflight OPTIONS request triggered if method is non-simple (PUT, DELETE, PATCH) or custom headers (Authorization) are present",
      "Server must respond with Access-Control-Allow-Origin, Methods, and Headers"
    ],
    "followUpTopics": [
      "Same-Origin Policy",
      "Credentials mode (cookies)"
    ]
  },
  {
    "id": "web-007",
    "role": "Web Developer",
    "category": "Accessibility",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the four principles of WCAG (POUR) and when should you use ARIA attributes?",
    "expectedSkills": [
      "Accessibility",
      "WCAG"
    ],
    "evaluationPoints": [
      "POUR: Perceivable, Operable, Understandable, Robust",
      "First rule of ARIA: use semantic native HTML (<button>, <nav>) whenever possible",
      "Use ARIA (aria-expanded, aria-live, aria-label) only when custom widgets cannot be described by native HTML"
    ],
    "followUpTopics": [
      "Color contrast",
      "Screen reader testing"
    ]
  },
  {
    "id": "web-008",
    "role": "Web Developer",
    "category": "PWA",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a Service Worker and how does it enable offline functionality in Progressive Web Apps?",
    "expectedSkills": [
      "PWA",
      "Service Workers"
    ],
    "evaluationPoints": [
      "JavaScript worker running in background separate from web page context",
      "Acts as programmable client-side proxy intercepting network fetch requests",
      "Uses Cache Storage API to cache shell assets and API responses for offline access"
    ],
    "followUpTopics": [
      "Cache-First vs Network-First",
      "Web App Manifest"
    ]
  },
  {
    "id": "web-009",
    "role": "Web Developer",
    "category": "CSS",
    "difficulty": "Easy",
    "format": "technical",
    "question": "When do you use CSS Grid and when do you use CSS Flexbox in web page layout?",
    "expectedSkills": [
      "CSS",
      "Layout"
    ],
    "evaluationPoints": [
      "Flexbox is one-dimensional (handles row OR column flow, ideal for alignment and navigation bars)",
      "CSS Grid is two-dimensional (handles rows AND columns simultaneously, ideal for whole-page templates and image galleries)",
      "Combine both: Grid for page skeleton, Flexbox inside grid cells"
    ],
    "followUpTopics": [
      "Grid areas",
      "minmax() function"
    ]
  },
  {
    "id": "web-010",
    "role": "Web Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS)?",
    "expectedSkills": [
      "Core Web Vitals",
      "Performance"
    ],
    "evaluationPoints": [
      "LCP measures loading performance (target <2.5s) — optimize by preloading hero image and using modern formats (WebP/AVIF)",
      "INP measures responsiveness to user interactions (target <200ms) — optimize by breaking long tasks and deferring non-critical JS",
      "CLS measures visual stability (target <0.1) — optimize by reserving explicit width/height on images and dynamic embeds"
    ],
    "followUpTopics": [
      "Lighthouse audits",
      "Resource hints (preload, preconnect)"
    ]
  },
  {
    "id": "web-011",
    "role": "Web Developer",
    "category": "Storage",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare localStorage, sessionStorage, Cookies, and IndexedDB in terms of capacity, scope, and use cases.",
    "expectedSkills": [
      "Storage",
      "Browser APIs"
    ],
    "evaluationPoints": [
      "localStorage: ~5-10MB, persists across sessions, synchronous, same-origin",
      "sessionStorage: ~5MB, cleared when tab closes",
      "Cookies: ~4KB, sent with every HTTP request, supports HttpOnly/Secure flags (ideal for session auth)",
      "IndexedDB: 50MB+, asynchronous transactional NoSQL object store for large offline datasets"
    ],
    "followUpTopics": [
      "HttpOnly cookies",
      "Storage quotas"
    ]
  },
  {
    "id": "web-012",
    "role": "Web Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF). How do you prevent both?",
    "expectedSkills": [
      "Security",
      "OWASP"
    ],
    "evaluationPoints": [
      "XSS: injecting malicious scripts into victim's browser -> Prevent via context-aware output encoding, sanitizing HTML, and Content-Security-Policy (CSP)",
      "CSRF: unauthorized commands transmitted from a trusted user -> Prevent via SameSite=Strict cookie attribute and Anti-CSRF tokens"
    ],
    "followUpTopics": [
      "Content Security Policy (CSP)",
      "SameSite cookie attribute"
    ]
  },
  {
    "id": "web-013",
    "role": "Web Developer",
    "category": "HTML",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you implement art direction and resolution switching using <picture> and srcset?",
    "expectedSkills": [
      "HTML",
      "Responsive Web"
    ],
    "evaluationPoints": [
      "<picture> with <source media='(max-width: 768px)' srcset='mobile.webp'> for art direction (different crop/composition on mobile)",
      "srcset='image-320w.jpg 320w, image-800w.jpg 800w' with sizes='(max-width: 600px) 100vw, 50vw' allows browser to pick optimal file size based on DPR and viewport"
    ],
    "followUpTopics": [
      "AVIF and WebP formats",
      "loading='lazy'"
    ]
  },
  {
    "id": "web-014",
    "role": "Web Developer",
    "category": "JavaScript",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Implement debounce and throttle functions in JavaScript. When do you use each?",
    "expectedSkills": [
      "JavaScript",
      "Performance"
    ],
    "evaluationPoints": [
      "Debounce delays function execution until after X ms of inactivity (e.g. search input autocomplete)",
      "Throttle guarantees function is executed at most once every X ms (e.g. window resize, scroll listeners)",
      "Debounce resets timer on every event; throttle checks elapsed timestamp"
    ],
    "followUpTopics": [
      "Lodash debounce",
      "requestAnimationFrame"
    ]
  },
  {
    "id": "web-015",
    "role": "Web Developer",
    "category": "CSS",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare CSS transitions and @keyframes animations. Which properties animate on the GPU?",
    "expectedSkills": [
      "CSS",
      "Animations"
    ],
    "evaluationPoints": [
      "Transitions animate property changes between two states triggered by events (hover, focus, class toggle)",
      "Keyframes allow multi-step, looping, complex timeline animations without user interaction",
      "Animate transform and opacity for 60fps GPU acceleration; avoid animating top, left, width, height (triggers reflow)"
    ],
    "followUpTopics": [
      "GPU compositing",
      "will-change"
    ]
  },
  {
    "id": "web-016",
    "role": "Web Developer",
    "category": "APIs",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Content Negotiation work in HTTP using Accept and Content-Type headers?",
    "expectedSkills": [
      "REST",
      "HTTP"
    ],
    "evaluationPoints": [
      "Client sends 'Accept: application/json, text/xml;q=0.9' expressing desired response formats with quality weights",
      "Server inspects Accept header and responds with matching format in 'Content-Type: application/json' header",
      "Returns HTTP 406 Not Acceptable if server cannot satisfy client's accepted formats"
    ],
    "followUpTopics": [
      "HTTP headers",
      "HATEOAS"
    ]
  },
  {
    "id": "web-017",
    "role": "Web Developer",
    "category": "JavaScript",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does prototypal inheritance work in JavaScript? Explain the prototype chain.",
    "expectedSkills": [
      "JavaScript Internals"
    ],
    "evaluationPoints": [
      "Every JavaScript object has an internal [[Prototype]] link (__proto__) pointing to another object",
      "Property lookup traverses up the prototype chain until found or null is reached (Object.prototype)",
      "ES6 'class' syntax is syntactic sugar over prototypal inheritance using constructor functions and prototypes"
    ],
    "followUpTopics": [
      "Object.create()",
      "Class syntax"
    ]
  },
  {
    "id": "web-018",
    "role": "Web Developer",
    "category": "Real-Time Web",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare WebSockets and Server-Sent Events (SSE). When is SSE the better architectural choice?",
    "expectedSkills": [
      "WebSockets",
      "SSE"
    ],
    "evaluationPoints": [
      "WebSockets: full-duplex bidirectional TCP communication protocol (ideal for gaming, chat, collaborative editing)",
      "SSE: unidirectional server-to-client streaming over standard HTTP using Content-Type: text/event-stream (simpler, auto-reconnection, works with HTTP/2 and proxies)",
      "Choose SSE for live feeds, stock tickers, and LLM streaming responses"
    ],
    "followUpTopics": [
      "EventSource API",
      "HTTP/2 multiplexing"
    ]
  },
  {
    "id": "web-019",
    "role": "Web Developer",
    "category": "DOM",
    "difficulty": "Easy",
    "format": "practical",
    "question": "Why is appending 1,000 elements to a DocumentFragment faster than appending directly to document.body?",
    "expectedSkills": [
      "DOM",
      "Performance"
    ],
    "evaluationPoints": [
      "Each direct append to document.body triggers layout reflow and repaint in the browser engine",
      "DocumentFragment is an off-screen lightweight container holding DOM nodes in memory",
      "Appending DocumentFragment to body triggers only ONE single reflow and repaint for all 1,000 children"
    ],
    "followUpTopics": [
      "Reflow optimization",
      "Virtual DOM concept"
    ]
  },
  {
    "id": "web-020",
    "role": "Web Developer",
    "category": "HTML",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why are semantic elements (<header>, <nav>, <main>, <article>, <aside>, <footer>) crucial for SEO and accessibility?",
    "expectedSkills": [
      "HTML",
      "SEO"
    ],
    "evaluationPoints": [
      "Search engine bots (Googlebot) parse semantic tags to understand content hierarchy, priority, and context",
      "Screen readers rely on landmarks (<main>, <nav>) to allow users to skip repetitive navigation directly to primary content",
      "Improves maintainability and developer readability over generic <div> soup"
    ],
    "followUpTopics": [
      "Landmark roles",
      "SEO best practices"
    ]
  },
  {
    "id": "web-021",
    "role": "Web Developer",
    "category": "Build Tools",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Vite achieve instant server start compared to traditional Webpack bundling?",
    "expectedSkills": [
      "Vite",
      "Webpack"
    ],
    "evaluationPoints": [
      "Webpack bundles entire application codebase into bundle files before starting dev server (slow on large codebases)",
      "Vite uses native browser ES Modules (ESM) in development; serves source files on-demand over HTTP without pre-bundling",
      "Uses lightning-fast esbuild written in Go for dependency pre-bundling; Rollup for optimized production builds"
    ],
    "followUpTopics": [
      "ES Modules",
      "Tree-shaking"
    ]
  },
  {
    "id": "web-022",
    "role": "Web Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Stored XSS, Reflected XSS, and DOM-based XSS with remediation strategies.",
    "expectedSkills": [
      "Security",
      "XSS"
    ],
    "evaluationPoints": [
      "Stored XSS: malicious script permanently stored in database (comments, profiles) and served to all viewers",
      "Reflected XSS: malicious script reflected off web server immediately via URL parameter or form input",
      "DOM-based XSS: vulnerability exists entirely in client-side JS modifying DOM unsafely (innerHTML, document.write)"
    ],
    "followUpTopics": [
      "DOMPurify",
      "CSP headers"
    ]
  },
  {
    "id": "web-023",
    "role": "Web Developer",
    "category": "CSS",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you implement a theme switcher (Dark/Light mode) using CSS custom properties and system preference?",
    "expectedSkills": [
      "CSS",
      "Design Systems"
    ],
    "evaluationPoints": [
      "Define color variables on :root and override them under [data-theme='dark'] or .dark selector",
      "Detect OS preference with @media (prefers-color-scheme: dark)",
      "Toggle theme attribute via JavaScript document.documentElement.setAttribute('data-theme', theme) and persist in localStorage"
    ],
    "followUpTopics": [
      "prefers-color-scheme",
      "CSS custom properties"
    ]
  },
  {
    "id": "web-024",
    "role": "Web Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What common coding patterns cause memory leaks in single-page JavaScript applications?",
    "expectedSkills": [
      "JavaScript",
      "Memory Management"
    ],
    "evaluationPoints": [
      "Forgotten timers or intervals (setInterval) holding references to unmounted components",
      "Unremoved event listeners on global window or document objects",
      "Detached DOM trees referenced in global arrays or closures",
      "Unbounded growing caches without LRU eviction"
    ],
    "followUpTopics": [
      "Chrome DevTools Memory tab",
      "Heap snapshots"
    ]
  },
  {
    "id": "web-025",
    "role": "Web Developer",
    "category": "SEO",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What meta tags and Schema.org JSON-LD structured data should every modern website include?",
    "expectedSkills": [
      "SEO",
      "Web Standards"
    ],
    "evaluationPoints": [
      "Title tag (<60 chars) and meta description (<160 chars)",
      "Open Graph (og:title, og:image, og:url) and Twitter Card tags for social media link sharing previews",
      "JSON-LD structured data describing Organization, Article, Breadcrumb, or Product for rich Google search snippets"
    ],
    "followUpTopics": [
      "Open Graph",
      "JSON-LD"
    ]
  },
  {
    "id": "web-026",
    "role": "Web Developer",
    "category": "HTML & JS",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does native HTML5 Constraint Validation API work (checkValidity, setCustomValidity)?",
    "expectedSkills": [
      "HTML",
      "Forms"
    ],
    "evaluationPoints": [
      "Built-in attributes: required, pattern, min, max, minlength, type='email'",
      "element.checkValidity() returns boolean; reportValidity() triggers browser native validation tooltip",
      "element.setCustomValidity('custom message') allows dynamic custom validation messages"
    ],
    "followUpTopics": [
      "FormData API",
      "Pattern regex"
    ]
  },
  {
    "id": "web-027",
    "role": "Web Developer",
    "category": "Concurrency",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When should you use Web Workers in JavaScript and what are their limitations?",
    "expectedSkills": [
      "Web Workers",
      "Performance"
    ],
    "evaluationPoints": [
      "Executes heavy computational tasks (image processing, encryption, large data parsing) on a separate OS background thread",
      "Prevents freezing the main UI thread (maintains 60fps animations and responsiveness)",
      "Limitations: No direct access to DOM or window object; communicates via postMessage() and onmessage events"
    ],
    "followUpTopics": [
      "postMessage API",
      "Transferable objects"
    ]
  },
  {
    "id": "web-028",
    "role": "Web Developer",
    "category": "Browser APIs",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you use IntersectionObserver for infinite scrolling and lazy loading images?",
    "expectedSkills": [
      "Browser APIs",
      "Performance"
    ],
    "evaluationPoints": [
      "Creates observer watching target elements intersecting with viewport",
      "callback = (entries) => entries.forEach(entry => if (entry.isIntersecting) loadContent())",
      "Much more performant than listening to window scroll events; avoids layout thrashing"
    ],
    "followUpTopics": [
      "Lazy loading",
      "Infinite scroll"
    ]
  },
  {
    "id": "web-029",
    "role": "Web Developer",
    "category": "Caching",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Cache-Control headers: max-age, no-cache, no-store, immutable, and ETag revalidation.",
    "expectedSkills": [
      "HTTP Caching",
      "Performance"
    ],
    "evaluationPoints": [
      "max-age=seconds: duration browser can serve cached copy without revalidating",
      "no-cache: forces browser to validate with server (using ETag or Last-Modified) before using cached copy",
      "no-store: strictly prohibits storing in cache (sensitive user data)",
      "immutable: indicates asset will never change (hashed JS/CSS bundles)"
    ],
    "followUpTopics": [
      "ETag and 304 Not Modified",
      "Stale-while-revalidate"
    ]
  },
  {
    "id": "web-030",
    "role": "Web Developer",
    "category": "CSS",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are CSS Container Queries (@container) and how do they differ from Media Queries?",
    "expectedSkills": [
      "Modern CSS"
    ],
    "evaluationPoints": [
      "Media queries evaluate the global browser viewport width",
      "Container queries evaluate the width of the component's immediate parent container",
      "Allows modular components to adapt their layout based on where they are placed (sidebar vs main content column)"
    ],
    "followUpTopics": [
      "@container",
      "Subgrid"
    ]
  },
  {
    "id": "web-031",
    "role": "Web Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does window.crypto provide cryptographically secure random values and hashing in browser JS?",
    "expectedSkills": [
      "Web Crypto",
      "Security"
    ],
    "evaluationPoints": [
      "crypto.getRandomValues() generates cryptographically secure random numbers (unlike Math.random() which is pseudo-random)",
      "crypto.subtle provides asynchronous cryptographic functions: digest (SHA-256), sign, verify, encrypt (AES-GCM), and decrypt",
      "Used for client-side password hashing and end-to-end encryption"
    ],
    "followUpTopics": [
      "crypto.subtle",
      "AES-GCM"
    ]
  },
  {
    "id": "web-032",
    "role": "Web Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you secure iframes using sandbox attributes and prevent Clickjacking with X-Frame-Options?",
    "expectedSkills": [
      "Security",
      "iframes"
    ],
    "evaluationPoints": [
      "X-Frame-Options: DENY or SAMEORIGIN prevents page from being embedded in malicious third-party iframes (clickjacking defense)",
      "CSP frame-ancestors directive provides modern fine-grained embedding control",
      "sandbox='allow-scripts allow-same-origin' restricts iframe capabilities to minimum required"
    ],
    "followUpTopics": [
      "Clickjacking",
      "Content Security Policy"
    ]
  },
  {
    "id": "web-033",
    "role": "Web Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an end-to-end web application you built. How did you optimize frontend performance and asset delivery?",
    "expectedSkills": [
      "Project Experience",
      "Communication"
    ],
    "evaluationPoints": [
      "Application purpose, tech stack, and responsive design decisions",
      "Performance optimizations implemented (code splitting, image optimizations, caching)",
      "Measurable outcome (Lighthouse score improvement, reduced bounce rate)"
    ],
    "followUpTopics": [
      "Lighthouse score",
      "Lessons learned"
    ]
  },
  {
    "id": "web-034",
    "role": "Web Developer",
    "category": "Troubleshooting",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Tell me about a difficult browser-specific bug (e.g. Safari-only layout crash) you resolved.",
    "expectedSkills": [
      "Debugging",
      "Cross-Browser"
    ],
    "evaluationPoints": [
      "Bug discovery and isolating failure to specific browser engine (WebKit vs Blink)",
      "Inspection with browser developer tools and reading web standards specifications",
      "Implementation of robust progressive enhancement or polyfill solution"
    ],
    "followUpTopics": [
      "Browser compatibility",
      "Vendor prefixes"
    ]
  },
  {
    "id": "web-035",
    "role": "Web Developer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is WebAssembly (Wasm) and how does it enable high-performance compute in web browsers?",
    "expectedSkills": [
      "WebAssembly",
      "Modern Web"
    ],
    "evaluationPoints": [
      "Binary instruction format providing near-native execution speed in web browsers alongside JavaScript",
      "Enables running C++, Rust, Go, and Python libraries directly on the client (Figma, Photoshop Web, Unity games)",
      "Complements JavaScript by handling compute-heavy tasks (video editing, 3D rendering, cryptography)"
    ],
    "followUpTopics": [
      "WebGPU",
      "Rust with Wasm"
    ]
  }
];
