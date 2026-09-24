import { RoleQuestion } from '../types';

export const SPRING_BOOT_QUESTIONS: RoleQuestion[] = [
  {
    "id": "sb-001",
    "role": "Spring Boot Developer",
    "category": "Spring Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Inversion of Control (IoC) and Dependency Injection (DI) in Spring Boot.",
    "expectedSkills": [
      "Spring Framework",
      "Core Concepts"
    ],
    "evaluationPoints": [
      "Defines IoC container responsibility",
      "Explains Bean lifecycle management",
      "Contrast between ApplicationContext and BeanFactory"
    ],
    "followUpTopics": [
      "Constructor vs Field Injection",
      "Bean Scopes"
    ]
  },
  {
    "id": "sb-002",
    "role": "Spring Boot Developer",
    "category": "Spring Boot Internals",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What actually happens under the hood when you annotate a class with @SpringBootApplication?",
    "expectedSkills": [
      "Spring Boot",
      "Auto-configuration"
    ],
    "evaluationPoints": [
      "Mentions @Configuration",
      "Mentions @EnableAutoConfiguration",
      "Mentions @ComponentScan and package scanning rules"
    ],
    "followUpTopics": [
      "spring.factories / AutoConfiguration.imports",
      "@ConditionalOnClass"
    ]
  },
  {
    "id": "sb-003",
    "role": "Spring Boot Developer",
    "category": "Dependency Injection",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is Constructor Injection strongly recommended over Field Injection (@Autowired on fields)?",
    "expectedSkills": [
      "Clean Code",
      "Spring Best Practices"
    ],
    "evaluationPoints": [
      "Immutability (final fields)",
      "Ease of unit testing without reflection/Spring context",
      "Prevents circular dependencies at startup"
    ],
    "followUpTopics": [
      "Lombok @RequiredArgsConstructor",
      "Circular dependency resolution"
    ]
  },
  {
    "id": "sb-004",
    "role": "Spring Boot Developer",
    "category": "Spring Data JPA",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Spring Data JPA generate SQL queries from method names like findByEmailAndStatusOrderByCreatedAtDesc?",
    "expectedSkills": [
      "Spring Data JPA",
      "ORM"
    ],
    "evaluationPoints": [
      "PartTree query generation",
      "Parsing method keywords into JPQL/SQL AST",
      "Type validation against Entity fields"
    ],
    "followUpTopics": [
      "@Query annotation",
      "Native vs JPQL queries"
    ]
  },
  {
    "id": "sb-005",
    "role": "Spring Boot Developer",
    "category": "Spring Data JPA",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you detect and solve the N+1 query problem when fetching parent-child entities in Spring Data JPA?",
    "expectedSkills": [
      "Hibernate",
      "Performance Tuning"
    ],
    "evaluationPoints": [
      "Explains root cause of lazy fetching in loops",
      "Uses JOIN FETCH in JPQL",
      "Mentions @EntityGraph or Hibernate BatchSize"
    ],
    "followUpTopics": [
      "DTO Projections",
      "Hibernate statistics"
    ]
  },
  {
    "id": "sb-006",
    "role": "Spring Boot Developer",
    "category": "REST APIs",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the key architectural difference between @Controller and @RestController?",
    "expectedSkills": [
      "Spring MVC",
      "REST"
    ],
    "evaluationPoints": [
      "@RestController includes @ResponseBody on all handler methods",
      "Direct serialization via HttpMessageConverter to JSON/XML",
      "@Controller is intended for view resolution (Thymeleaf/JSP)"
    ],
    "followUpTopics": [
      "Jackson serialization",
      "ResponseEntity"
    ]
  },
  {
    "id": "sb-007",
    "role": "Spring Boot Developer",
    "category": "Exception Handling",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you implement global exception handling and standardized API error responses using @RestControllerAdvice?",
    "expectedSkills": [
      "Spring MVC",
      "API Design"
    ],
    "evaluationPoints": [
      "Using @ExceptionHandler methods",
      "Returning ResponseEntity with custom ErrorResponse payload",
      "Mapping validation errors (MethodArgumentNotValidException)"
    ],
    "followUpTopics": [
      "RFC 7807 Problem Details",
      "HTTP Status Code mapping"
    ]
  },
  {
    "id": "sb-008",
    "role": "Spring Boot Developer",
    "category": "Transactions",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain transaction propagation in Spring (@Transactional). What is the difference between REQUIRED and REQUIRES_NEW?",
    "expectedSkills": [
      "Transactions",
      "Data Integrity"
    ],
    "evaluationPoints": [
      "REQUIRED joins existing or creates new",
      "REQUIRES_NEW suspends outer transaction and commits independently",
      "Self-invocation proxy bypass pitfall"
    ],
    "followUpTopics": [
      "Transaction isolation levels",
      "rollbackFor attribute"
    ]
  },
  {
    "id": "sb-009",
    "role": "Spring Boot Developer",
    "category": "Spring Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does the Spring Security SecurityFilterChain architecture authenticate a request using JWT?",
    "expectedSkills": [
      "Spring Security",
      "Authentication"
    ],
    "evaluationPoints": [
      "OncePerRequestFilter implementation",
      "Extracting Bearer token from Authorization header",
      "Populating SecurityContextHolder with UsernamePasswordAuthenticationToken"
    ],
    "followUpTopics": [
      "Method security (@PreAuthorize)",
      "CORS and CSRF with stateless APIs"
    ]
  },
  {
    "id": "sb-010",
    "role": "Spring Boot Developer",
    "category": "Configuration",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you manage multi-environment configurations using Spring Profiles (application-dev.yml vs application-prod.yml)?",
    "expectedSkills": [
      "Spring Configuration",
      "DevOps"
    ],
    "evaluationPoints": [
      "spring.profiles.active property",
      "Environment-specific overrides",
      "@Profile annotation on bean definitions"
    ],
    "followUpTopics": [
      "@ConfigurationProperties",
      "Spring Cloud Config"
    ]
  },
  {
    "id": "sb-011",
    "role": "Spring Boot Developer",
    "category": "Actuator & Observability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Spring Boot Actuator and how is it utilized in production monitoring and health probes?",
    "expectedSkills": [
      "Observability",
      "Spring Boot Actuator"
    ],
    "evaluationPoints": [
      "Endpoints like /actuator/health, /metrics, /env",
      "Kubernetes liveness and readiness probe integration",
      "Security considerations for sensitive endpoints"
    ],
    "followUpTopics": [
      "Micrometer & Prometheus integration",
      "Custom health indicators"
    ]
  },
  {
    "id": "sb-012",
    "role": "Spring Boot Developer",
    "category": "Validation",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you validate request DTOs using Jakarta Validation annotations (@NotBlank, @Size, @Email, @Min)?",
    "expectedSkills": [
      "Validation",
      "Spring MVC"
    ],
    "evaluationPoints": [
      "Applying annotations to DTO fields",
      "Adding @Valid or @Validated on Controller method parameters",
      "Handling BindingResult or MethodArgumentNotValidException"
    ],
    "followUpTopics": [
      "Custom validation constraints",
      "Group validation"
    ]
  },
  {
    "id": "sb-013",
    "role": "Spring Boot Developer",
    "category": "Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare @SpringBootTest vs @WebMvcTest vs @DataJpaTest in Spring Boot testing strategy.",
    "expectedSkills": [
      "Testing",
      "JUnit 5",
      "Mockito"
    ],
    "evaluationPoints": [
      "@SpringBootTest loads full context (integration)",
      "@WebMvcTest slices only Web layer with MockMvc",
      "@DataJpaTest slices repository with in-memory DB"
    ],
    "followUpTopics": [
      "Testcontainers",
      "MockBean vs SpyBean"
    ]
  },
  {
    "id": "sb-014",
    "role": "Spring Boot Developer",
    "category": "Caching",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Spring Cache abstraction work with annotations like @Cacheable, @CachePut, and @CacheEvict?",
    "expectedSkills": [
      "Caching",
      "Redis"
    ],
    "evaluationPoints": [
      "Proxy intercepts method call to check cache store",
      "@Cacheable prevents method execution on hit",
      "@CacheEvict clears entries on update/delete"
    ],
    "followUpTopics": [
      "RedisCacheManager",
      "Cache stampede prevention"
    ]
  },
  {
    "id": "sb-015",
    "role": "Spring Boot Developer",
    "category": "Asynchronous Processing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does @Async work in Spring Boot and why must you configure a custom TaskExecutor for production?",
    "expectedSkills": [
      "Concurrency",
      "Performance"
    ],
    "evaluationPoints": [
      "@EnableAsync and method returning CompletableFuture or void",
      "Default SimpleAsyncTaskExecutor creates new threads per task (unbounded)",
      "Configuring ThreadPoolTaskExecutor with core/max pool size and queue capacity"
    ],
    "followUpTopics": [
      "Async exception handling",
      "Context propagation"
    ]
  },
  {
    "id": "sb-016",
    "role": "Spring Boot Developer",
    "category": "Microservices",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does Spring Cloud OpenFeign simplify HTTP client communication between microservices?",
    "expectedSkills": [
      "Microservices",
      "Spring Cloud"
    ],
    "evaluationPoints": [
      "Declarative REST client using interfaces and annotations",
      "Automatic integration with client-side load balancing",
      "Integration with Resilience4j circuit breakers"
    ],
    "followUpTopics": [
      "ErrorDecoder implementation",
      "RequestInterceptor for headers"
    ]
  },
  {
    "id": "sb-017",
    "role": "Spring Boot Developer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "A high-traffic Spring Boot service is exhausting database connections. What steps do you take to investigate and tune HikariCP?",
    "expectedSkills": [
      "HikariCP",
      "Database Performance"
    ],
    "evaluationPoints": [
      "Inspect pool size metrics (active, idle, waiting)",
      "Tune maximum-pool-size according to CPU cores and disk I/O",
      "Reduce connection-timeout and identify unclosed connections/long transactions"
    ],
    "followUpTopics": [
      "LeakDetectionThreshold",
      "ReadOnly database routing"
    ]
  },
  {
    "id": "sb-018",
    "role": "Spring Boot Developer",
    "category": "Spring Security",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you protect a Spring Boot REST API against Cross-Site Request Forgery (CSRF) and Cross-Origin Resource Sharing (CORS) issues?",
    "expectedSkills": [
      "Security",
      "Spring Security"
    ],
    "evaluationPoints": [
      "Disabling CSRF for stateless REST APIs using JWT tokens",
      "Configuring CorsConfigurationSource bean with explicit allowed origins, methods, and headers",
      "Avoiding wildcard origins in authenticated endpoints"
    ],
    "followUpTopics": [
      "Pre-flight OPTIONS requests",
      "SameSite cookie policies"
    ]
  },
  {
    "id": "sb-019",
    "role": "Spring Boot Developer",
    "category": "Spring MVC",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the role of DispatcherServlet in the Spring MVC request lifecycle?",
    "expectedSkills": [
      "Spring MVC Architecture"
    ],
    "evaluationPoints": [
      "Front Controller pattern orchestrating request flow",
      "Consults HandlerMapping to find controller",
      "Uses HandlerAdapter to execute method and HttpMessageConverter for output"
    ],
    "followUpTopics": [
      "HandlerInterceptor",
      "Filter vs Interceptor"
    ]
  },
  {
    "id": "sb-020",
    "role": "Spring Boot Developer",
    "category": "Architecture",
    "difficulty": "Advanced",
    "format": "scenario",
    "question": "How would you design an event-driven notification service in Spring Boot using Spring Cloud Stream or Kafka?",
    "expectedSkills": [
      "Event-driven Architecture",
      "Kafka"
    ],
    "evaluationPoints": [
      "KafkaTemplate or Consumer bindings",
      "Partition key selection for message ordering",
      "Handling deserialization errors and Dead Letter Queues (DLQ)"
    ],
    "followUpTopics": [
      "Consumer group rebalancing",
      "Idempotent consumers"
    ]
  },
  {
    "id": "sb-021",
    "role": "Spring Boot Developer",
    "category": "Core Concepts",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the different bean scopes in Spring and what is the default scope?",
    "expectedSkills": [
      "Spring Core"
    ],
    "evaluationPoints": [
      "Default is Singleton (one instance per ApplicationContext)",
      "Prototype (new instance on every injection)",
      "Web scopes: Request, Session, Application"
    ],
    "followUpTopics": [
      "Injecting Prototype into Singleton bean",
      "ObjectFactory / Provider"
    ]
  },
  {
    "id": "sb-022",
    "role": "Spring Boot Developer",
    "category": "Spring Data JPA",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the difference between optimistic locking (@Version) and pessimistic locking in Spring Data JPA.",
    "expectedSkills": [
      "Data Integrity",
      "Concurrency"
    ],
    "evaluationPoints": [
      "Optimistic uses version column without DB lock, fails on collision with OptimisticLockException",
      "Pessimistic takes explicit database lock (SELECT FOR UPDATE)",
      "Choosing optimistic for read-heavy, pessimistic for high contention write-heavy"
    ],
    "followUpTopics": [
      "LockModeType.PESSIMISTIC_WRITE",
      "Retry mechanisms"
    ]
  },
  {
    "id": "sb-023",
    "role": "Spring Boot Developer",
    "category": "REST APIs",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you implement pagination and sorting in a Spring Boot REST API using Pageable and Page<T>?",
    "expectedSkills": [
      "REST APIs",
      "Spring Data"
    ],
    "evaluationPoints": [
      "Passing Pageable parameter in repository and controller",
      "Query parameters page, size, and sort",
      "Returning Page<T> with totalElements, totalPages, and content"
    ],
    "followUpTopics": [
      "Slice vs Page",
      "Keyset pagination for deep scrolling"
    ]
  },
  {
    "id": "sb-024",
    "role": "Spring Boot Developer",
    "category": "Debugging",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Your Spring Boot application fails to boot with BeanCreationException: circular dependency detected. How do you resolve it?",
    "expectedSkills": [
      "Debugging",
      "Spring Core"
    ],
    "evaluationPoints": [
      "Explain causes where Bean A requires Bean B and vice-versa",
      "Refactor into a third mediator service or separate interface",
      "Use @Lazy annotation as a temporary mitigation"
    ],
    "followUpTopics": [
      "Application startup analysis",
      "Spring Boot 2.6+ circular dependency defaults"
    ]
  },
  {
    "id": "sb-025",
    "role": "Spring Boot Developer",
    "category": "Microservices",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is the Circuit Breaker pattern and how do you configure Resilience4j in a Spring Boot application?",
    "expectedSkills": [
      "Resilience",
      "Microservices"
    ],
    "evaluationPoints": [
      "States: Closed, Open, Half-Open",
      "Sliding window failure rate threshold",
      "Defining fallback methods with matching signatures"
    ],
    "followUpTopics": [
      "RateLimiter and Bulkhead patterns",
      "Resilience4j Actuator metrics"
    ]
  },
  {
    "id": "sb-026",
    "role": "Spring Boot Developer",
    "category": "Spring Data JPA",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are DTO projections in Spring Data JPA and why are they superior to entity queries for read operations?",
    "expectedSkills": [
      "Performance",
      "Spring Data"
    ],
    "evaluationPoints": [
      "Interface-based or Class-based (record) projections",
      "Selects only required columns from DB instead of full entity graph",
      "Bypasses Hibernate persistence context dirty-checking overhead"
    ],
    "followUpTopics": [
      "Constructor expressions in JPQL",
      "Dynamic projections"
    ]
  },
  {
    "id": "sb-027",
    "role": "Spring Boot Developer",
    "category": "Testing",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you write a MockMvc test for a POST /api/v1/users endpoint checking HTTP 201 and JSON response body?",
    "expectedSkills": [
      "MockMvc",
      "Testing"
    ],
    "evaluationPoints": [
      "mockMvc.perform(post(...).contentType(MediaType.APPLICATION_JSON).content(...))",
      "andExpect(status().isCreated())",
      "andExpect(jsonPath('$.id').exists())"
    ],
    "followUpTopics": [
      "SecurityMockMvcRequestPostProcessors",
      "Custom matchers"
    ]
  },
  {
    "id": "sb-028",
    "role": "Spring Boot Developer",
    "category": "Spring Boot Internals",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you write a custom Spring Boot Starter with auto-configuration and @ConditionalOnMissingBean?",
    "expectedSkills": [
      "Custom Starters",
      "Architecture"
    ],
    "evaluationPoints": [
      "Separating autoconfigure module from starter POM",
      "Creating @Configuration class with conditional annotations",
      "Registering in META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports"
    ],
    "followUpTopics": [
      "@ConfigurationProperties binding",
      "AutoConfigureAfter"
    ]
  },
  {
    "id": "sb-029",
    "role": "Spring Boot Developer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Spring Boot integrate database schema migrations using Flyway or Liquibase?",
    "expectedSkills": [
      "Database Migrations",
      "DevOps"
    ],
    "evaluationPoints": [
      "Placing SQL scripts in db/migration with naming conventions (V1__init.sql)",
      "Automatic schema versioning table execution on startup",
      "Disabling ddl-auto=update in production"
    ],
    "followUpTopics": [
      "Rollback scripts",
      "Baseline migrations"
    ]
  },
  {
    "id": "sb-030",
    "role": "Spring Boot Developer",
    "category": "Performance",
    "difficulty": "Advanced",
    "format": "scenario",
    "question": "A Spring Boot API endpoint that generates PDF reports is causing high CPU and blocking server threads. How do you optimize it?",
    "expectedSkills": [
      "Async Architecture",
      "Performance"
    ],
    "evaluationPoints": [
      "Offload heavy computation to an asynchronous background worker",
      "Return HTTP 202 Accepted with a status/polling endpoint or webhook",
      "Run task on dedicated bounded thread pool or external microservice"
    ],
    "followUpTopics": [
      "Streaming response with StreamingResponseBody",
      "Resource throttling"
    ]
  },
  {
    "id": "sb-031",
    "role": "Spring Boot Developer",
    "category": "Spring Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the purpose of @Value and how does @ConfigurationProperties provide type-safe configuration?",
    "expectedSkills": [
      "Configuration",
      "Spring Core"
    ],
    "evaluationPoints": [
      "@Value resolves SpEL and single properties",
      "@ConfigurationProperties binds hierarchical groups into structured POJOs/records",
      "Validation support via @Validated on configuration classes"
    ],
    "followUpTopics": [
      "Relaxed binding rules",
      "Property source precedence"
    ]
  },
  {
    "id": "sb-032",
    "role": "Spring Boot Developer",
    "category": "Spring MVC",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a HandlerInterceptor in Spring MVC and how does it differ from a Servlet Filter?",
    "expectedSkills": [
      "Spring MVC",
      "Middleware"
    ],
    "evaluationPoints": [
      "Filter is standard Servlet API executing before DispatcherServlet",
      "HandlerInterceptor is Spring MVC specific with preHandle, postHandle, afterCompletion",
      "Interceptor has access to handler method metadata and Spring beans"
    ],
    "followUpTopics": [
      "Logging request timing",
      "MDC tracing"
    ]
  },
  {
    "id": "sb-033",
    "role": "Spring Boot Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a complex business feature you implemented in Spring Boot. How did you structure your layers?",
    "expectedSkills": [
      "Software Architecture",
      "Communication"
    ],
    "evaluationPoints": [
      "Clear separation between Controller, Service, Domain, and Repository",
      "Business logic encapsulated in Service/Domain rather than Controller",
      "Handling cross-cutting concerns (logging, transactions, security)"
    ],
    "followUpTopics": [
      "Hexagonal / Clean architecture",
      "Domain-driven design"
    ]
  },
  {
    "id": "sb-034",
    "role": "Spring Boot Developer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "Tell me about a production bug or unexpected outage you handled in a Spring Boot application. What was your triage process?",
    "expectedSkills": [
      "Problem Solving",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Analyzing stack trace and log context",
      "Checking database connection pools and memory metrics",
      "Creating regression test and deploying hotfix responsibly"
    ],
    "followUpTopics": [
      "Post-mortem analysis",
      "Preventative alerting"
    ]
  },
  {
    "id": "sb-035",
    "role": "Spring Boot Developer",
    "category": "Modern Java & Spring",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are the benefits of using Java 21 Virtual Threads with Spring Boot 3.2+?",
    "expectedSkills": [
      "Modern Java",
      "Virtual Threads"
    ],
    "evaluationPoints": [
      "spring.threads.virtual.enabled=true property",
      "High throughput for I/O-bound blocking calls without reactive complexity",
      "Lightweight threads scheduled by JVM carrier threads"
    ],
    "followUpTopics": [
      "Thread pinning with synchronized",
      "Virtual thread limitations"
    ]
  }
];
