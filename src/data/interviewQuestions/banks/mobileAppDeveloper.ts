import { RoleQuestion } from '../types';

export const MOBILE_APP_DEVELOPER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "mob-001",
    "role": "Mobile App Developer",
    "category": "Mobile Architecture",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Native development (Swift/Kotlin), Flutter, and React Native in terms of performance, development speed, and access to native APIs.",
    "expectedSkills": [
      "Mobile Architecture"
    ],
    "evaluationPoints": [
      "Native gives highest performance, day-1 access to new OS features, and smallest binary size",
      "Flutter compiles to native ARM machine code via Dart, renders via Skia/Impeller, bypassing OS native OEM widgets",
      "React Native uses JavaScript bridge (or modern JSI / Fabric architecture) to render native platform components"
    ],
    "followUpTopics": [
      "React Native New Architecture (Fabric/TurboModules)",
      "Flutter Impeller engine"
    ]
  },
  {
    "id": "mob-002",
    "role": "Mobile App Developer",
    "category": "App Lifecycle",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the common mobile application lifecycle states (Active, Inactive, Background, Suspended).",
    "expectedSkills": [
      "Lifecycle Management"
    ],
    "evaluationPoints": [
      "Active: app is in foreground and receiving user input events",
      "Inactive / Paused: app is in foreground but interrupted (incoming phone call, system alert)",
      "Background: app is running code in background (audio, GPS, data sync) but UI is hidden",
      "Suspended: app is in memory but execution is halted; OS may terminate it at any moment to reclaim RAM"
    ],
    "followUpTopics": [
      "State preservation",
      "Background task limits"
    ]
  },
  {
    "id": "mob-003",
    "role": "Mobile App Developer",
    "category": "Data Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design an offline-first mobile app that synchronizes data with a cloud backend when connection restores?",
    "expectedSkills": [
      "Offline-First",
      "Architecture"
    ],
    "evaluationPoints": [
      "Local database (SQLite, Realm, Room, Core Data) acts as the single source of truth for the UI",
      "Mutations are written to local DB first and appended to an outgoing sync queue",
      "Background worker syncs queued changes to backend on network reconnection, resolving conflicts (Last-Write-Wins or server timestamps)"
    ],
    "followUpTopics": [
      "Conflict resolution",
      "Sync queue"
    ]
  },
  {
    "id": "mob-004",
    "role": "Mobile App Developer",
    "category": "Push Notifications",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Apple Push Notification service (APNs) and Firebase Cloud Messaging (FCM) deliver push notifications to mobile devices?",
    "expectedSkills": [
      "APNs",
      "FCM"
    ],
    "evaluationPoints": [
      "Device registers with OS push service and receives a unique device registration token",
      "Client app sends device token to app backend server",
      "Backend sends payload to APNs/FCM API; push servers maintain persistent low-power connection to device, displaying notification or waking app in background"
    ],
    "followUpTopics": [
      "Silent push notifications",
      "Notification payloads"
    ]
  },
  {
    "id": "mob-005",
    "role": "Mobile App Developer",
    "category": "Deep Linking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare standard URI schemes (myapp://) vs Universal Links (iOS) / App Links (Android).",
    "expectedSkills": [
      "Deep Linking"
    ],
    "evaluationPoints": [
      "Custom URL schemes (myapp://path) trigger browser security warnings and can be hijacked by other apps with same scheme",
      "Universal Links / App Links use standard HTTPS URLs (https://myapp.com/item/123) verified cryptographically via domain association files (apple-app-site-association / assetlinks.json)",
      "Falls back gracefully to web page if app is not installed"
    ],
    "followUpTopics": [
      "AASA file",
      "assetlinks.json"
    ]
  },
  {
    "id": "mob-006",
    "role": "Mobile App Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does memory management work in iOS (ARC) and Android (Garbage Collection)? What causes mobile memory leaks?",
    "expectedSkills": [
      "Memory Management"
    ],
    "evaluationPoints": [
      "iOS uses Automatic Reference Counting (ARC) at compile time; strong reference cycles (retain cycles) cause memory leaks -> solved with weak/unowned references",
      "Android uses runtime Garbage Collection (Generational GC); holding references to Activity context in static variables or long-running background threads causes memory leaks",
      "Tools: Xcode Instruments (Leaks), Android Studio Memory Profiler, LeakCanary"
    ],
    "followUpTopics": [
      "Retain cycles",
      "LeakCanary"
    ]
  },
  {
    "id": "mob-007",
    "role": "Mobile App Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Where and how should sensitive user data (JWT tokens, API keys, credentials) be stored on iOS and Android?",
    "expectedSkills": [
      "Mobile Security",
      "Storage"
    ],
    "evaluationPoints": [
      "Never store secrets in SharedPreferences, UserDefaults, or unencrypted local SQLite databases",
      "iOS: use iOS Keychain Services (hardware-backed Secure Enclave encryption)",
      "Android: use Android Keystore system and EncryptedSharedPreferences (Jetpack Security)"
    ],
    "followUpTopics": [
      "iOS Keychain",
      "Android Keystore"
    ]
  },
  {
    "id": "mob-008",
    "role": "Mobile App Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is SSL/TLS Certificate Pinning and why is it implemented in high-security mobile applications?",
    "expectedSkills": [
      "Security",
      "Networking"
    ],
    "evaluationPoints": [
      "Standard TLS trusts any certificate signed by an OS-installed Certificate Authority (vulnerable to rogue CAs, corporate proxies, and MitM attacks like Charles Proxy)",
      "SSL Pinning embeds the specific server public key or certificate hash directly inside the client app binary",
      "Connection is aborted immediately if server certificate does not match the pinned public key"
    ],
    "followUpTopics": [
      "Public key pinning",
      "Certificate rotation risk"
    ]
  },
  {
    "id": "mob-009",
    "role": "Mobile App Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you implement biometric authentication (Face ID, Touch ID, Fingerprint) in mobile apps?",
    "expectedSkills": [
      "Biometrics",
      "Security"
    ],
    "evaluationPoints": [
      "iOS: LocalAuthentication framework (LAContext evaluatePolicy:deviceOwnerAuthenticationWithBiometrics)",
      "Android: BiometricPrompt API (Jetpack Biometric library)",
      "Store sensitive auth tokens inside Keychain/Keystore configured to require biometric user unlock before decryption"
    ],
    "followUpTopics": [
      "BiometricPrompt",
      "LocalAuthentication"
    ]
  },
  {
    "id": "mob-010",
    "role": "Mobile App Developer",
    "category": "State Management",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What happens during device orientation changes and how do you prevent losing user input?",
    "expectedSkills": [
      "State Management"
    ],
    "evaluationPoints": [
      "On Android, configuration change destroys and recreates the Activity by default; save UI state in ViewModel or onSaveInstanceState bundle",
      "On iOS, view controllers are not destroyed on rotation; views resize via Auto Layout and size classes",
      "Maintain business state in persistent architectural state stores (Redux, BLoC, ViewModels) independent of UI lifecycle"
    ],
    "followUpTopics": [
      "ViewModel persistence",
      "onSaveInstanceState"
    ]
  },
  {
    "id": "mob-011",
    "role": "Mobile App Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do libraries like Glide, Picasso, and SDWebImage optimize image loading and scrolling performance?",
    "expectedSkills": [
      "Image Loading",
      "Performance"
    ],
    "evaluationPoints": [
      "Multi-tier caching: Memory cache (LruCache) for instant retrieval + Disk cache for offline access",
      "Automatic downsampling: decodes image to the exact target ImageView dimensions instead of loading full resolution into RAM",
      "Cancels ongoing network image requests when list item scrolls off-screen to save bandwidth"
    ],
    "followUpTopics": [
      "LruCache",
      "Bitmap downsampling"
    ]
  },
  {
    "id": "mob-012",
    "role": "Mobile App Developer",
    "category": "Monetization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the server-side receipt validation flow for Apple In-App Purchases (StoreKit 2) and Google Play Billing.",
    "expectedSkills": [
      "IAP",
      "Monetization"
    ],
    "evaluationPoints": [
      "User initiates purchase -> App Store / Google Play processes payment -> Client receives signed transaction receipt",
      "Client sends receipt to app backend server",
      "App backend verifies signed transaction cryptographically with Apple/Google server API (or uses RevenueCat) before unlocking premium entitlements"
    ],
    "followUpTopics": [
      "StoreKit 2",
      "Server-to-server notifications"
    ]
  },
  {
    "id": "mob-013",
    "role": "Mobile App Developer",
    "category": "DevOps",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Fastlane automate mobile build, code signing, and app store deployments?",
    "expectedSkills": [
      "Fastlane",
      "CI/CD"
    ],
    "evaluationPoints": [
      "Automates provisioning profiles and certificates management using 'fastlane match' backed by encrypted Git repo",
      "Compiles binary (.ipa for iOS, .aab for Android) and runs automated unit/UI tests",
      "Uploads binaries to TestFlight / Google Play Internal Track and deploys release metadata to App Store Connect / Play Console"
    ],
    "followUpTopics": [
      "Match / Code signing",
      "TestFlight automation"
    ]
  },
  {
    "id": "mob-014",
    "role": "Mobile App Developer",
    "category": "Optimization",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do Android App Bundles (.aab) and iOS App Thinning reduce download sizes for users?",
    "expectedSkills": [
      "Optimization"
    ],
    "evaluationPoints": [
      "Android App Bundle (.aab): Google Play generates optimized split APKs tailored to specific user device (CPU architecture, screen density, language)",
      "iOS App Thinning: Slicing creates variants containing only architecture/assets needed for target device",
      "ProGuard/R8 in Android strips unused code, obfuscates classes, and inlines methods"
    ],
    "followUpTopics": [
      "R8 / ProGuard",
      "Asset slicing"
    ]
  },
  {
    "id": "mob-015",
    "role": "Mobile App Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What common mobile programming patterns drain device battery rapidly and how do you optimize them?",
    "expectedSkills": [
      "Battery Optimization",
      "Performance"
    ],
    "evaluationPoints": [
      "Continuous GPS tracking at high accuracy -> use geofencing, significant location changes, or lower accuracy intervals",
      "Aggressive network polling -> use Push Notifications or WebSockets instead of repetitive HTTP polling",
      "Wakelocks preventing device sleep -> use OS-managed job schedulers (WorkManager / BackgroundTasks)"
    ],
    "followUpTopics": [
      "WorkManager",
      "Significant location updates"
    ]
  },
  {
    "id": "mob-016",
    "role": "Mobile App Developer",
    "category": "State Management",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare state management approaches in mobile apps: Redux, BLoC (Flutter), and MVVM with Reactive Streams.",
    "expectedSkills": [
      "State Management"
    ],
    "evaluationPoints": [
      "Redux: unidirectional data flow with single centralized state store, actions, and pure reducers",
      "BLoC (Business Logic Component): uses reactive Streams (Sink for events, Stream for states) separating presentation from logic in Flutter",
      "MVVM: ViewModel exposes Observable/StateFlow properties that the View observes and binds to declaratively"
    ],
    "followUpTopics": [
      "StateFlow vs SharedFlow",
      "BLoC pattern"
    ]
  },
  {
    "id": "mob-017",
    "role": "Mobile App Developer",
    "category": "Accessibility",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you optimize mobile apps for screen readers (VoiceOver on iOS, TalkBack on Android)?",
    "expectedSkills": [
      "Accessibility",
      "Mobile"
    ],
    "evaluationPoints": [
      "Set descriptive accessibilityLabel / contentDescription on all icon buttons and interactive views",
      "Group related elements into single accessible containers to avoid cluttered navigation",
      "Support Dynamic Type (system font scaling) so text scales smoothly without clipping or overlapping"
    ],
    "followUpTopics": [
      "VoiceOver",
      "TalkBack"
    ]
  },
  {
    "id": "mob-018",
    "role": "Mobile App Developer",
    "category": "Cross-Platform",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does React Native's JavaScript Interface (JSI) eliminate the legacy asynchronous JSON bridge?",
    "expectedSkills": [
      "React Native",
      "Architecture"
    ],
    "evaluationPoints": [
      "Legacy bridge serialized data into JSON strings across asynchronous asynchronous queue (performance bottleneck)",
      "JSI allows JavaScript runtime to hold direct C++ host object references and call native methods synchronously",
      "Enables high-performance direct interactions (60fps animations with Reanimated, direct camera buffer access)"
    ],
    "followUpTopics": [
      "TurboModules",
      "Fabric renderer"
    ]
  },
  {
    "id": "mob-019",
    "role": "Mobile App Developer",
    "category": "Database",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare SQLite, Realm, and Key-Value stores (MMKV, SharedPreferences) for mobile apps.",
    "expectedSkills": [
      "Mobile Database"
    ],
    "evaluationPoints": [
      "SQLite (Room / Core Data): robust relational database with SQL query support, migrations, and ACID transactions",
      "Realm: object-oriented mobile database with direct object mapping and reactive live queries without SQL overhead",
      "MMKV: high-performance memory-mapped (mmap) key-value store 100x faster than SharedPreferences"
    ],
    "followUpTopics": [
      "Room ORM",
      "MMKV"
    ]
  },
  {
    "id": "mob-020",
    "role": "Mobile App Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do runtime permission requests work on iOS and modern Android (API 23+)?",
    "expectedSkills": [
      "Security",
      "Permissions"
    ],
    "evaluationPoints": [
      "Install-time permissions granted automatically (Internet access)",
      "Runtime permissions require explicit user prompt at time of feature use (Camera, Location, Microphone, Contacts)",
      "Must provide clear in-context explanation (permission rationale) before prompting, and handle 'Don't ask again' / Denied states gracefully"
    ],
    "followUpTopics": [
      "Permission rationale",
      "One-time permissions"
    ]
  },
  {
    "id": "mob-021",
    "role": "Mobile App Developer",
    "category": "Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Appium, XCUITest (iOS), and Espresso (Android) for automated mobile testing.",
    "expectedSkills": [
      "Mobile Testing"
    ],
    "evaluationPoints": [
      "Appium is cross-platform, black-box, supports multiple languages, but runs slower out-of-process over HTTP",
      "Espresso (Android) and XCUITest (iOS) run in-process with direct access to app code, providing ultra-fast execution and automatic synchronization with UI thread"
    ],
    "followUpTopics": [
      "Espresso",
      "XCUITest"
    ]
  },
  {
    "id": "mob-022",
    "role": "Mobile App Developer",
    "category": "Networking",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you implement retry policies with exponential backoff and network reachability listeners in mobile apps?",
    "expectedSkills": [
      "Networking",
      "Resilience"
    ],
    "evaluationPoints": [
      "Listen to network connectivity changes (ConnectivityManager in Android / NWPathMonitor in iOS)",
      "When API call fails due to network error, retry with exponential backoff and jitter (e.g. retry after 1s, 2s, 4s + random jitter)",
      "Show non-intrusive offline banners and queue write actions locally"
    ],
    "followUpTopics": [
      "Exponential backoff with jitter",
      "NWPathMonitor"
    ]
  },
  {
    "id": "mob-023",
    "role": "Mobile App Developer",
    "category": "Security",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you protect a production mobile application against tampering, reverse engineering, and jailbreak/root?",
    "expectedSkills": [
      "Mobile Security"
    ],
    "evaluationPoints": [
      "Code obfuscation using ProGuard/R8 (Android) or DexGuard to make decompiled source unreadable",
      "Root / Jailbreak detection checks inspecting file system for binaries (su, Cydia, substrate)",
      "Integrity checks (Google Play Integrity API / Apple DeviceCheck) verifying app binary was not modified and was downloaded from official app store"
    ],
    "followUpTopics": [
      "Play Integrity API",
      "Root detection"
    ]
  },
  {
    "id": "mob-024",
    "role": "Mobile App Developer",
    "category": "APIs",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are the advantages of using GraphQL (Apollo Client) over REST for mobile networking?",
    "expectedSkills": [
      "GraphQL",
      "Networking"
    ],
    "evaluationPoints": [
      "Eliminates over-fetching (mobile only downloads exact fields requested, saving bandwidth and battery)",
      "Eliminates under-fetching (single GraphQL query fetches user, orders, and products, avoiding multiple round-trips over high-latency cellular networks)",
      "Apollo Client provides normalized client-side caching out of the box"
    ],
    "followUpTopics": [
      "Apollo Client",
      "Query batching"
    ]
  },
  {
    "id": "mob-025",
    "role": "Mobile App Developer",
    "category": "Background Processing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you schedule periodic background data synchronization without getting terminated by the OS?",
    "expectedSkills": [
      "Background Processing"
    ],
    "evaluationPoints": [
      "Android: WorkManager schedules deferrable guaranteed background tasks respecting Doze mode and battery constraints",
      "iOS: BGTaskScheduler (BGAppRefreshTask / BGProcessingTask) allows OS to determine optimal execution window based on user habits and battery status",
      "Background execution duration is strictly limited (typically 30 seconds)"
    ],
    "followUpTopics": [
      "WorkManager",
      "BGTaskScheduler"
    ]
  },
  {
    "id": "mob-026",
    "role": "Mobile App Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you eliminate dropped frames (jank) in long scrolling lists (RecyclerView, FlatList)?",
    "expectedSkills": [
      "UI Performance"
    ],
    "evaluationPoints": [
      "Keep view hierarchy shallow and avoid complex layout nesting",
      "Recycle list items efficiently; do not perform heavy calculations or object allocations inside onBindViewHolder / renderItem",
      "Offload image decoding and JSON parsing to background threads; keep main UI thread free"
    ],
    "followUpTopics": [
      "Systrace / CPU Profiler",
      "FlatList optimization"
    ]
  },
  {
    "id": "mob-027",
    "role": "Mobile App Developer",
    "category": "Deployment",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you use Remote Config (Firebase) and Feature Flags in mobile release management?",
    "expectedSkills": [
      "Feature Flags",
      "Remote Config"
    ],
    "evaluationPoints": [
      "Dynamically toggle features on/off or change parameters without publishing a new app update to app stores",
      "Gradual percentage rollouts to monitor crash rates before 100% rollout",
      "Instant kill-switch to disable buggy features immediately in production"
    ],
    "followUpTopics": [
      "Kill-switch",
      "A/B testing"
    ]
  },
  {
    "id": "mob-028",
    "role": "Mobile App Developer",
    "category": "Observability",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does crash reporting work in mobile apps (Firebase Crashlytics) and what is dSYM / mapping.txt symbolication?",
    "expectedSkills": [
      "Crashlytics",
      "Observability"
    ],
    "evaluationPoints": [
      "Crashlytics intercepts unhandled exceptions and native signal crashes, saving stack trace to disk before app dies",
      "Production binaries are compiled with obfuscation and stripped symbols; stack traces show cryptic memory addresses or obfuscated names",
      "dSYM files (iOS) and ProGuard mapping.txt (Android) de-obfuscate stack traces into human-readable class names and file line numbers"
    ],
    "followUpTopics": [
      "dSYM files",
      "ProGuard mapping.txt"
    ]
  },
  {
    "id": "mob-029",
    "role": "Mobile App Developer",
    "category": "Real-Time",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you maintain a persistent WebSocket connection in a mobile app when the app transitions between foreground and background?",
    "expectedSkills": [
      "WebSockets",
      "Mobile"
    ],
    "evaluationPoints": [
      "Close WebSocket connection or send disconnect frame when app moves to background to save battery",
      "On app returning to foreground, check network reachability and automatically re-establish connection",
      "Use Push Notifications for background alerts instead of keeping alive a permanent WebSocket connection in background"
    ],
    "followUpTopics": [
      "Reconnect logic",
      "Heartbeat ping/pong"
    ]
  },
  {
    "id": "mob-030",
    "role": "Mobile App Developer",
    "category": "Localization",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you support Right-to-Left (RTL) languages (Arabic, Hebrew) in mobile layouts?",
    "expectedSkills": [
      "Localization",
      "RTL"
    ],
    "evaluationPoints": [
      "Use directional layout constraints: start and end instead of left and right (e.g. paddingStart, MarginEnd)",
      "Ensure icons indicating direction (back arrows, progress indicators) mirror automatically in RTL mode",
      "Test UI layout mirroring using pseudolocales or switching device language"
    ],
    "followUpTopics": [
      "Start/End constraints",
      "Mirroring icons"
    ]
  },
  {
    "id": "mob-031",
    "role": "Mobile App Developer",
    "category": "Navigation",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "A user taps a deep link to an order detail screen when the app is completely closed. How do you construct the back-stack?",
    "expectedSkills": [
      "Navigation",
      "Deep Linking"
    ],
    "evaluationPoints": [
      "Do not open the target detail screen in isolation without navigation history (pressing back shouldn't exit the app)",
      "Use Android Navigation Component / Jetpack Navigation or iOS Coordinator pattern to synthesize the back stack (Home -> Orders List -> Order Details)",
      "Allows user to navigate back up the application hierarchy naturally"
    ],
    "followUpTopics": [
      "Synthetic back stack",
      "Coordinator pattern"
    ]
  },
  {
    "id": "mob-032",
    "role": "Mobile App Developer",
    "category": "App Store",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What common rejection reasons do apps encounter during Apple App Store and Google Play reviews?",
    "expectedSkills": [
      "App Store Guidelines"
    ],
    "evaluationPoints": [
      "Crashes or bugs during reviewer testing on latest OS versions / iPads",
      "Missing Privacy Policy, incomplete Data Safety / Privacy Nutrition labels, or requesting unnecessary permissions",
      "Violating in-app purchase guidelines by offering external payment links for digital goods",
      "Placeholder content, broken links, or non-functional login credentials provided in review notes"
    ],
    "followUpTopics": [
      "App Store Review Guidelines",
      "Data Safety labels"
    ]
  },
  {
    "id": "mob-033",
    "role": "Mobile App Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a mobile app you architected and deployed to Google Play and Apple App Store.",
    "expectedSkills": [
      "Project Experience",
      "Communication"
    ],
    "evaluationPoints": [
      "App domain, architectural pattern (MVVM, Clean Architecture, BLoC), and tech stack rationale",
      "Key technical challenges solved (offline sync, complex animations, camera/sensors integration)",
      "Performance optimization results, crash-free user rate (>99.5%), and app store ratings"
    ],
    "followUpTopics": [
      "Crash-free rate",
      "App store release"
    ]
  },
  {
    "id": "mob-034",
    "role": "Mobile App Developer",
    "category": "Troubleshooting",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a critical production crash reported in Firebase Crashlytics that you diagnosed and fixed.",
    "expectedSkills": [
      "Troubleshooting",
      "Crashlytics"
    ],
    "evaluationPoints": [
      "Analyzing crash stack traces and identifying affected device models, OS versions, and user reproduction steps",
      "Isolating root cause (null pointer, threading race condition, out-of-memory)",
      "Releasing expedited hotfix and adding automated unit/UI tests to prevent regression"
    ],
    "followUpTopics": [
      "Hotfix release",
      "Root cause analysis"
    ]
  },
  {
    "id": "mob-035",
    "role": "Mobile App Developer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How are declarative UI frameworks (Jetpack Compose and SwiftUI) replacing legacy imperative UI paradigms?",
    "expectedSkills": [
      "Jetpack Compose",
      "SwiftUI"
    ],
    "evaluationPoints": [
      "Declarative UI: developers describe WHAT the UI should look like for a given state; framework automatically updates UI when state changes",
      "Eliminates imperative DOM-like manipulation (findViewById, setText, setVisibility, XML layouts, Storyboards)",
      "Recomposition / reactive view updates provide cleaner code, fewer state bugs, and instant live previews"
    ],
    "followUpTopics": [
      "Declarative UI",
      "Recomposition"
    ]
  }
];
