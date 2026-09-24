import { RoleQuestion } from '../types';

export const ANDROID_DEVELOPER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "andr-001",
    "role": "Android Developer",
    "category": "Android Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the Android Activity Lifecycle callbacks: onCreate, onStart, onResume, onPause, onStop, onDestroy, onRestart.",
    "expectedSkills": [
      "Activity Lifecycle"
    ],
    "evaluationPoints": [
      "onCreate: one-time initialization, set layout; onStart: activity becomes visible; onResume: activity is in foreground receiving input",
      "onPause: partially obscured (dialog), commit unsaved data; onStop: fully hidden; onDestroy: final cleanup",
      "Configuration changes destroy and recreate Activity (triggering onDestroy followed by onCreate)"
    ],
    "followUpTopics": [
      "onSaveInstanceState",
      "ViewModel"
    ]
  },
  {
    "id": "andr-002",
    "role": "Android Developer",
    "category": "Jetpack Compose",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Jetpack Compose declarative UI work and what is Recomposition?",
    "expectedSkills": [
      "Jetpack Compose"
    ],
    "evaluationPoints": [
      "UI is defined as functions annotated with @Composable that transform state into UI nodes",
      "Recomposition: Compose automatically re-executes composable functions whose observed state values have changed",
      "State hoisted using remember and mutableStateOf; skips recomposition for composables with unchanged inputs"
    ],
    "followUpTopics": [
      "remember vs rememberSaveable",
      "State hoisting"
    ]
  },
  {
    "id": "andr-003",
    "role": "Android Developer",
    "category": "Kotlin Coroutines",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Kotlin Coroutines and StateFlow handle asynchronous operations and UI state emission in Android?",
    "expectedSkills": [
      "Kotlin",
      "Coroutines"
    ],
    "evaluationPoints": [
      "Coroutines provide lightweight cooperative multitasking using suspend functions without blocking the main thread",
      "viewModelScope launches coroutines tied to ViewModel lifecycle, automatically cancelled on onCleared()",
      "StateFlow is a state-holder observable flow emitting the latest value to active UI collectors"
    ],
    "followUpTopics": [
      "StateFlow vs SharedFlow",
      "Dispatchers.Main vs Dispatchers.IO"
    ]
  },
  {
    "id": "andr-004",
    "role": "Android Developer",
    "category": "Architecture Components",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why does an Android Architecture Component ViewModel survive screen rotations while an Activity is destroyed?",
    "expectedSkills": [
      "ViewModel",
      "Lifecycle"
    ],
    "evaluationPoints": [
      "ViewModel is retained by the ViewModelStoreOwner across configuration changes",
      "Destroyed Activity releases its view hierarchy; newly created Activity reconnects to the existing retained ViewModel instance",
      "Cleared only when Activity finishes permanently (finish() called or user dismisses app) via onCleared()"
    ],
    "followUpTopics": [
      "ViewModelProvider",
      "SavedStateHandle"
    ]
  },
  {
    "id": "andr-005",
    "role": "Android Developer",
    "category": "Room",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Room persistence library: @Entity, @Dao, @Database, and how to execute schema migrations.",
    "expectedSkills": [
      "Room",
      "Database"
    ],
    "evaluationPoints": [
      "@Entity maps data classes to SQLite tables; @Dao provides CRUD and query methods using compile-time checked SQL",
      "@Database declares entities and version number",
      "Room Migration: implement Migration(fromVersion, toVersion) with executeSQL statements, registered in database builder"
    ],
    "followUpTopics": [
      "AutoMigration",
      "TypeConverters"
    ]
  },
  {
    "id": "andr-006",
    "role": "Android Developer",
    "category": "Networking",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do Retrofit and OkHttp work together to consume REST APIs in Android?",
    "expectedSkills": [
      "Retrofit",
      "OkHttp"
    ],
    "evaluationPoints": [
      "Retrofit turns HTTP API into a Java/Kotlin interface using annotations (@GET, @POST, @Path, @Body)",
      "Uses converters (Moshi, Gson) to automatically deserialize JSON response into Kotlin data classes",
      "OkHttp acts as underlying HTTP client handling connection pooling, interceptors, timeouts, and caching"
    ],
    "followUpTopics": [
      "OkHttp Interceptors",
      "Moshi vs Gson"
    ]
  },
  {
    "id": "andr-007",
    "role": "Android Developer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you implement an OkHttp Auth Interceptor to automatically attach JWT Bearer tokens to all outgoing requests?",
    "expectedSkills": [
      "OkHttp",
      "Security"
    ],
    "evaluationPoints": [
      "Implement Interceptor interface and override intercept(Chain chain)",
      "val request = chain.request().newBuilder().addHeader('Authorization', 'Bearer $token').build()",
      "Call chain.proceed(request); can also handle 401 Unauthorized by refreshing token and retrying original request"
    ],
    "followUpTopics": [
      "HttpLoggingInterceptor",
      "Token refresh with Authenticator"
    ]
  },
  {
    "id": "andr-008",
    "role": "Android Developer",
    "category": "Background Processing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why is WorkManager the recommended solution for persistent, guaranteed background tasks in Android?",
    "expectedSkills": [
      "WorkManager",
      "Background Processing"
    ],
    "evaluationPoints": [
      "Guarantees task execution even if app is killed, device restarts, or app is in background",
      "Respects Android Doze mode, battery saver, and network constraints (Constraints.Builder.setRequiredNetworkType)",
      "Uses JobScheduler on API 23+ and alarm/broadcast fallbacks on older versions"
    ],
    "followUpTopics": [
      "PeriodicWorkRequest",
      "OneTimeWorkRequest with Chaining"
    ]
  },
  {
    "id": "andr-009",
    "role": "Android Developer",
    "category": "Android Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Foreground Services, Background Services, and Bound Services in Android.",
    "expectedSkills": [
      "Services"
    ],
    "evaluationPoints": [
      "Foreground Service performs operations noticeable to user (music playback, active navigation); MUST display a persistent ongoing notification",
      "Background Service: heavily restricted in modern Android (API 26+); OS restricts background execution when app is not in foreground (use WorkManager instead)",
      "Bound Service: allows components (activities) to bind and interact via IPC (client-server interface) using Binder"
    ],
    "followUpTopics": [
      "Foreground Service Notifications",
      "JobIntentService"
    ]
  },
  {
    "id": "andr-010",
    "role": "Android Developer",
    "category": "Android Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is a BroadcastReceiver and what is the difference between static and dynamic registration?",
    "expectedSkills": [
      "BroadcastReceiver"
    ],
    "evaluationPoints": [
      "Component that listens for system-wide broadcast announcements (Airplane mode, Battery low, Network change)",
      "Static registration: declared in AndroidManifest.xml (limited in modern Android to protect battery)",
      "Dynamic registration: registered in code via registerReceiver() during onStart/onResume and unregistered in onStop/onPause"
    ],
    "followUpTopics": [
      "LocalBroadcastManager",
      "Implicit broadcast restrictions"
    ]
  },
  {
    "id": "andr-011",
    "role": "Android Developer",
    "category": "Android Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a ContentProvider and how does ContentResolver allow cross-app data sharing in Android?",
    "expectedSkills": [
      "ContentProvider"
    ],
    "evaluationPoints": [
      "Standard interface for securely sharing structured data between different applications (Contacts, MediaStore)",
      "ContentResolver queries ContentProvider using content URIs (content://authority/path/id)",
      "Enforces read/write permissions at the URI level"
    ],
    "followUpTopics": [
      "ContentResolver",
      "URI permissions"
    ]
  },
  {
    "id": "andr-012",
    "role": "Android Developer",
    "category": "Android Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the Fragment lifecycle and why a Fragment has two distinct lifecycles (Fragment vs View lifecycle).",
    "expectedSkills": [
      "Fragments"
    ],
    "evaluationPoints": [
      "Fragment lifecycle: onAttach, onCreate, onCreateView, onViewCreated, onViewStateRestored, onStart, onResume, onPause, onStop, onDestroyView, onDestroy, onDetach",
      "Fragment view can be destroyed (onDestroyView) while Fragment instance remains in memory (in backstack)",
      "Observe LiveData / StateFlow using viewLifecycleOwner rather than fragment this to avoid memory leaks"
    ],
    "followUpTopics": [
      "viewLifecycleOwner",
      "FragmentTransaction"
    ]
  },
  {
    "id": "andr-013",
    "role": "Android Developer",
    "category": "UI Components",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is RecyclerView significantly more performant than legacy ListView? Explain the ViewHolder pattern.",
    "expectedSkills": [
      "RecyclerView",
      "UI Performance"
    ],
    "evaluationPoints": [
      "ListView repeatedly called findViewById() inside getView() on every scroll, causing severe jank",
      "RecyclerView enforces ViewHolder pattern, caching view references to avoid expensive findViewById lookups",
      "Recycles off-screen views for newly visible rows; decouples layout arrangement via LayoutManager and animations via ItemAnimator"
    ],
    "followUpTopics": [
      "DiffUtil",
      "ListAdapter"
    ]
  },
  {
    "id": "andr-014",
    "role": "Android Developer",
    "category": "UI Components",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does DiffUtil calculate list item differences and prevent full-list reloads in RecyclerView?",
    "expectedSkills": [
      "DiffUtil",
      "RecyclerView"
    ],
    "evaluationPoints": [
      "Uses Eugene Myers' difference algorithm to compute minimal number of updates between old and new lists",
      "Dispatches fine-grained update events (notifyItemInserted, notifyItemRemoved, notifyItemRangeChanged) instead of notifyDataSetChanged()",
      "ListAdapter automatically calculates diffs on a background thread using AsyncListDiffer"
    ],
    "followUpTopics": [
      "AsyncListDiffer",
      "Myers algorithm"
    ]
  },
  {
    "id": "andr-015",
    "role": "Android Developer",
    "category": "Dependency Injection",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Hilt simplify Dagger dependency injection in Android applications?",
    "expectedSkills": [
      "Hilt",
      "Dagger"
    ],
    "evaluationPoints": [
      "Built on top of Dagger with standard Android-specific component containers (@HiltAndroidApp, @AndroidEntryPoint)",
      "Provides predefined scopes tied to Android lifecycle (@Singleton, @ActivityScoped, @ViewModelScoped)",
      "Generates boilerplate Dagger component code at compile time with zero reflection runtime overhead"
    ],
    "followUpTopics": [
      "@Inject constructor",
      "@Module and @Provides"
    ]
  },
  {
    "id": "andr-016",
    "role": "Android Developer",
    "category": "Navigation",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Navigation Graph, NavHostFragment, and Safe Args in Jetpack Navigation.",
    "expectedSkills": [
      "Navigation Component"
    ],
    "evaluationPoints": [
      "NavGraph is an XML or Compose resource mapping all application destinations and actions",
      "NavHostFragment is an empty container displaying destinations from navigation graph",
      "Safe Args Gradle plugin generates type-safe directions classes preventing bundle key mismatch runtime crashes"
    ],
    "followUpTopics": [
      "Deep linking with Navigation",
      "Back stack management"
    ]
  },
  {
    "id": "andr-017",
    "role": "Android Developer",
    "category": "Storage & Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Scoped Storage in Android (API 29+) and how does it protect user privacy?",
    "expectedSkills": [
      "Scoped Storage",
      "Android Security"
    ],
    "evaluationPoints": [
      "Eliminates broad READ_EXTERNAL_STORAGE permission giving apps access to entire file system",
      "Apps have unrestricted access only to their own private app-specific directories (context.getExternalFilesDir())",
      "Access to shared media files (Photos, Audio, Videos) must use MediaStore API; non-media files require Storage Access Framework (SAF) system picker"
    ],
    "followUpTopics": [
      "MediaStore API",
      "Storage Access Framework"
    ]
  },
  {
    "id": "andr-018",
    "role": "Android Developer",
    "category": "Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you structure an Android app using Clean Architecture (Data, Domain, Presentation layers)?",
    "expectedSkills": [
      "Clean Architecture",
      "MVVM"
    ],
    "evaluationPoints": [
      "Presentation: Activities, Composables, ViewModels, and UI state",
      "Domain: Use Cases (Interactors) and pure business logic entities, free from Android framework dependencies",
      "Data: Repositories, Room database, and Retrofit network datasources implementing Domain repository interfaces"
    ],
    "followUpTopics": [
      "Use Cases",
      "Repository Pattern"
    ]
  },
  {
    "id": "andr-019",
    "role": "Android Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does the Android Keystore system protect cryptographic keys against extraction even on rooted devices?",
    "expectedSkills": [
      "Android Keystore",
      "Security"
    ],
    "evaluationPoints": [
      "Generates and stores cryptographic keys inside a hardware-backed security module (TEE - Trusted Execution Environment or StrongBox)",
      "Key material never enters the application memory space; encryption/decryption operations occur inside secure hardware",
      "Can require biometric user authentication before key is unlocked"
    ],
    "followUpTopics": [
      "EncryptedSharedPreferences",
      "Hardware-backed keys"
    ]
  },
  {
    "id": "andr-020",
    "role": "Android Developer",
    "category": "State Management",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Android Process Death and how does SavedStateHandle restore state when ViewModel memory is wiped?",
    "expectedSkills": [
      "Process Death",
      "SavedStateHandle"
    ],
    "evaluationPoints": [
      "When app is in background, Android OS may kill the entire app process to free RAM for foreground apps",
      "When user returns, OS recreates Activity and ViewModel, but in-memory variables are reset to null",
      "SavedStateHandle persists key-values through process death via OS bundle, restoring initial state automatically"
    ],
    "followUpTopics": [
      "onSaveInstanceState vs ViewModel",
      "Low-memory killer"
    ]
  },
  {
    "id": "andr-021",
    "role": "Android Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How does LeakCanary detect memory leaks in Android and what is a GC Root path?",
    "expectedSkills": [
      "Memory Management",
      "LeakCanary"
    ],
    "evaluationPoints": [
      "Watches destroyed Activity and Fragment view objects; if not garbage collected after 5 seconds, triggers heap dump (.hprof)",
      "Analyzes heap dump using Shark library to find shortest path of strong references from a GC Root to the leaking object",
      "Common culprit: static variables, non-static inner classes, or lingering Coroutine jobs holding Activity context"
    ],
    "followUpTopics": [
      "GC Roots",
      "Context leaks"
    ]
  },
  {
    "id": "andr-022",
    "role": "Android Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you optimize Android App Cold Start time and leverage the Jetpack App Startup library?",
    "expectedSkills": [
      "App Startup",
      "Performance"
    ],
    "evaluationPoints": [
      "Cold start: OS creates new process, initializes Application class, inflates initial Activity layout",
      "App Startup library initializes multiple content-provider libraries within a single shared ContentProvider, reducing initialization overhead",
      "Defer non-critical SDK initializations to background coroutines after the first frame is rendered"
    ],
    "followUpTopics": [
      "Baseline Profiles",
      "Cold vs Warm start"
    ]
  },
  {
    "id": "andr-023",
    "role": "Android Developer",
    "category": "Performance",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What are Android Baseline Profiles and how do they eliminate JIT compilation jank on first run?",
    "expectedSkills": [
      "Baseline Profiles",
      "AOT Compilation"
    ],
    "evaluationPoints": [
      "Specifies critical user journeys (app launch, scrolling home feed) pre-compiled into machine code (AOT) upon app installation",
      "Eliminates Just-In-Time (JIT) compilation interpretation during runtime",
      "Improves app startup speed by up to 40% and reduces frame drops on low-end devices"
    ],
    "followUpTopics": [
      "AOT vs JIT",
      "Macrobenchmark"
    ]
  },
  {
    "id": "andr-024",
    "role": "Android Developer",
    "category": "Android Internals",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does Android Inter-Process Communication (IPC) work using the Linux Binder driver and AIDL?",
    "expectedSkills": [
      "Binder",
      "IPC"
    ],
    "evaluationPoints": [
      "Android isolates processes using Linux UID security; standard memory sharing is blocked",
      "Binder kernel driver maps shared memory buffers between client and server processes for ultra-fast IPC with single data copy",
      "AIDL (Android Interface Definition Language) generates Java/Kotlin client proxy and server stub implementing IPC communication"
    ],
    "followUpTopics": [
      "Messenger vs AIDL",
      "Parcelable"
    ]
  },
  {
    "id": "andr-025",
    "role": "Android Developer",
    "category": "Android Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is Parcelable strongly preferred over Java Serializable for passing data in Android Intents/Bundles?",
    "expectedSkills": [
      "Parcelable",
      "Performance"
    ],
    "evaluationPoints": [
      "Serializable is standard Java interface using heavy reflection to serialize object graphs (slow, creates many temporary objects)",
      "Parcelable is Android-specific interface where developer or @Parcelize explicitly defines binary serialization code",
      "Parcelable is up to 10x faster and highly optimized for Android IPC Binder transactions"
    ],
    "followUpTopics": [
      "@Parcelize annotation",
      "Intent extras"
    ]
  },
  {
    "id": "andr-026",
    "role": "Android Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Android Doze Mode and how does it restrict background network access, wakelocks, and alarms?",
    "expectedSkills": [
      "Doze Mode",
      "Battery"
    ],
    "evaluationPoints": [
      "When device is unplugged, stationary, and screen is off, OS enters Doze mode",
      "Suspends network access, ignores partial wakelocks, and defers standard alarms and JobScheduler jobs to periodic maintenance windows",
      "High-priority FCM push messages wake device briefly for critical time-sensitive events"
    ],
    "followUpTopics": [
      "Maintenance windows",
      "AlarmManager setExactAndAllowWhileIdle"
    ]
  },
  {
    "id": "andr-027",
    "role": "Android Developer",
    "category": "Build & Optimization",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What does R8 compiler do during release builds (Shrinking, Optimization, Obfuscation, Inlining)?",
    "expectedSkills": [
      "R8",
      "ProGuard"
    ],
    "evaluationPoints": [
      "Code shrinking: detects and removes unused classes, methods, and fields",
      "Resource shrinking: strips unused images, strings, and XML layouts",
      "Obfuscation: renames classes and fields to short meaningless names (a, b, c) to deter reverse engineering",
      "Inlining: merges short methods and flattens class hierarchies to improve execution efficiency"
    ],
    "followUpTopics": [
      "keep rules (proguard-rules.pro)",
      "Mapping.txt"
    ]
  },
  {
    "id": "andr-028",
    "role": "Android Developer",
    "category": "Custom Views",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain onMeasure, onLayout, and onDraw callbacks when implementing a custom View in Android.",
    "expectedSkills": [
      "Custom Views"
    ],
    "evaluationPoints": [
      "onMeasure: computes desired width and height of view based on MeasureSpec constraints from parent",
      "onLayout: positions child views (used when subclassing ViewGroup)",
      "onDraw: renders visual elements using Canvas and Paint objects; avoid object allocations (new Paint()) inside onDraw to prevent GC jank during animations"
    ],
    "followUpTopics": [
      "MeasureSpec",
      "Canvas and Paint"
    ]
  },
  {
    "id": "andr-029",
    "role": "Android Developer",
    "category": "Modularization",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do Android Dynamic Feature Modules (Play Feature Delivery) download features on-demand?",
    "expectedSkills": [
      "Modularization",
      "App Bundles"
    ],
    "evaluationPoints": [
      "App is split into base module and dynamic feature modules (.dfm)",
      "Users download a minimal base APK; heavy optional features (e.g. AR camera, onboarding video) are downloaded on-demand via SplitInstallManager",
      "Significantly lowers initial download barrier and install friction"
    ],
    "followUpTopics": [
      "SplitInstallManager",
      "On-demand modules"
    ]
  },
  {
    "id": "andr-030",
    "role": "Android Developer",
    "category": "Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Local Unit Tests (test/ directory) and Instrumented Tests (androidTest/ directory) in Android.",
    "expectedSkills": [
      "Testing",
      "Android"
    ],
    "evaluationPoints": [
      "Local Unit Tests run on host machine JVM with Mockito/MockK and Roboelectric (fast, no device required)",
      "Instrumented Tests run on real Android device or emulator with access to Android framework APIs, Context, and databases",
      "Use unit tests for ViewModels, Use Cases, and Repositories; instrumented tests for Room DAOs and UI flows with Espresso/Compose Test"
    ],
    "followUpTopics": [
      "Robolectric",
      "ComposeTestRule"
    ]
  },
  {
    "id": "andr-031",
    "role": "Android Developer",
    "category": "Accessibility",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you add semantic accessibility properties to custom Composables using Modifier.semantics?",
    "expectedSkills": [
      "Jetpack Compose",
      "Accessibility"
    ],
    "evaluationPoints": [
      "Modifier.semantics { contentDescription = 'Profile picture'; role = Role.Button }",
      "Merges child semantics using mergeDescendants = true so TalkBack reads complex card layouts as a single accessible item",
      "Ensures touch targets meet minimum 48.dp requirements"
    ],
    "followUpTopics": [
      "Semantics tree",
      "TalkBack"
    ]
  },
  {
    "id": "andr-032",
    "role": "Android Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Users report frequent ANRs in production. What causes ANRs and how do you trace them?",
    "expectedSkills": [
      "ANR",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "ANR triggered when main thread is blocked for >5 seconds by input events or >200ms by broadcast receiver",
      "Causes: synchronous database queries, network calls, disk I/O, or thread deadlock on main thread",
      "Inspect /data/anr/traces.txt or Google Play Console Android Vitals to identify stack trace of main thread at time of ANR"
    ],
    "followUpTopics": [
      "traces.txt",
      "Android Vitals"
    ]
  },
  {
    "id": "andr-033",
    "role": "Android Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an enterprise Android application you architected from scratch. What Jetpack libraries did you choose?",
    "expectedSkills": [
      "Architecture",
      "Communication"
    ],
    "evaluationPoints": [
      "Multi-module architecture (feature-by-layer or feature-by-module)",
      "Tech stack: Jetpack Compose, Hilt, Coroutines/Flow, Room, Retrofit",
      "Achieving >99.7% crash-free sessions and high test coverage"
    ],
    "followUpTopics": [
      "Modularization",
      "Lessons learned"
    ]
  },
  {
    "id": "andr-034",
    "role": "Android Developer",
    "category": "Modernization",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "How do you incrementally migrate a large legacy XML-based Android application to Jetpack Compose?",
    "expectedSkills": [
      "Jetpack Compose",
      "Migration"
    ],
    "evaluationPoints": [
      "Do not rewrite entire app at once; migrate screen-by-screen starting with isolated bottom-leaf custom views or new features",
      "Use ComposeView inside existing XML layouts to host Compose components",
      "Use AndroidView inside Composable screens to host legacy XML views (e.g. MapView, WebView)"
    ],
    "followUpTopics": [
      "ComposeView",
      "AndroidView interop"
    ]
  },
  {
    "id": "andr-035",
    "role": "Android Developer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is Kotlin Multiplatform (KMP) and how does it compare to Flutter and React Native for Android teams?",
    "expectedSkills": [
      "KMP",
      "Modern Android"
    ],
    "evaluationPoints": [
      "KMP allows sharing 100% of business logic, networking, database, and state management code across Android, iOS, Desktop, and Web in pure Kotlin",
      "Renders UI using 100% native platforms (Jetpack Compose on Android, SwiftUI on iOS) or Compose Multiplatform",
      "Unlike Flutter or React Native, it does not impose a foreign runtime engine or cross-platform UI bridge"
    ],
    "followUpTopics": [
      "Compose Multiplatform",
      "KMP vs Flutter"
    ]
  }
];
