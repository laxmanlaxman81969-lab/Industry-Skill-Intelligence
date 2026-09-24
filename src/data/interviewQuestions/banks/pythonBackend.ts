import { RoleQuestion } from '../types';

export const PYTHON_BACKEND_QUESTIONS: RoleQuestion[] = [
  {
    "id": "pyb-001",
    "role": "Python Backend Developer",
    "category": "Architecture",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare FastAPI and Django for building backend REST APIs. When do you choose each?",
    "expectedSkills": [
      "FastAPI",
      "Django"
    ],
    "evaluationPoints": [
      "FastAPI is lightweight, asynchronous, high-performance",
      "Django is batteries-included with built-in ORM and admin",
      "FastAPI excels for microservices, Django for monolithic apps"
    ],
    "followUpTopics": [
      "Flask",
      "Async benchmarks"
    ]
  },
  {
    "id": "pyb-002",
    "role": "Python Backend Developer",
    "category": "FastAPI",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Pydantic v2 handle request body validation and serialization in FastAPI?",
    "expectedSkills": [
      "Pydantic",
      "FastAPI"
    ],
    "evaluationPoints": [
      "BaseModel type annotations",
      "Automatic parsing with 422 errors",
      "Fast Rust core in v2"
    ],
    "followUpTopics": [
      "Field validators",
      "model_dump()"
    ]
  },
  {
    "id": "pyb-003",
    "role": "Python Backend Developer",
    "category": "FastAPI",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain FastAPI's Depends system and how it handles database sessions and auth.",
    "expectedSkills": [
      "FastAPI",
      "Architecture"
    ],
    "evaluationPoints": [
      "Depends() injects dependencies",
      "yield syntax manages session cleanup",
      "Security scopes support"
    ],
    "followUpTopics": [
      "Security dependencies",
      "Dependency overrides"
    ]
  },
  {
    "id": "pyb-004",
    "role": "Python Backend Developer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you configure asynchronous database sessions with SQLAlchemy 2.0 and asyncpg?",
    "expectedSkills": [
      "SQLAlchemy",
      "Async"
    ],
    "evaluationPoints": [
      "create_async_engine and async_sessionmaker",
      "async with session.begin() transactions",
      "select() syntax in 2.0"
    ],
    "followUpTopics": [
      "Connection pooling",
      "Alembic async"
    ]
  },
  {
    "id": "pyb-005",
    "role": "Python Backend Developer",
    "category": "Background Tasks",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you offload long-running tasks using Celery and Redis in a Python backend?",
    "expectedSkills": [
      "Celery",
      "Redis"
    ],
    "evaluationPoints": [
      "Redis acts as task broker",
      "Celery worker processes run asynchronously",
      "Task retries with backoff"
    ],
    "followUpTopics": [
      "Celery Beat",
      "Result backends"
    ]
  },
  {
    "id": "pyb-006",
    "role": "Python Backend Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain how to implement stateless JWT access and refresh tokens in Python.",
    "expectedSkills": [
      "JWT",
      "Security"
    ],
    "evaluationPoints": [
      "Short-lived access tokens",
      "Secure refresh token rotation",
      "Revocation list in Redis"
    ],
    "followUpTopics": [
      "PyJWT",
      "OAuth2 password flow"
    ]
  },
  {
    "id": "pyb-007",
    "role": "Python Backend Developer",
    "category": "Django",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the difference between select_related and prefetch_related in Django ORM?",
    "expectedSkills": [
      "Django ORM",
      "Performance"
    ],
    "evaluationPoints": [
      "select_related does SQL JOIN for foreign keys",
      "prefetch_related executes separate query in Python",
      "Solves N+1 query problem"
    ],
    "followUpTopics": [
      "QuerySet evaluation",
      "only() and defer()"
    ]
  },
  {
    "id": "pyb-008",
    "role": "Python Backend Developer",
    "category": "Caching",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you implement the Cache-Aside pattern using Redis in a Python API?",
    "expectedSkills": [
      "Redis",
      "Caching"
    ],
    "evaluationPoints": [
      "Check cache on request, load DB on miss, store with TTL",
      "Invalidate on entity update/delete",
      "Prevent cache stampede"
    ],
    "followUpTopics": [
      "Distributed locks",
      "Redis data structures"
    ]
  },
  {
    "id": "pyb-009",
    "role": "Python Backend Developer",
    "category": "WebSockets",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you implement real-time bidirectional communication using WebSockets in FastAPI?",
    "expectedSkills": [
      "WebSockets",
      "FastAPI"
    ],
    "evaluationPoints": [
      "@app.websocket route handler",
      "ConnectionManager tracks active sockets",
      "Broadcast events to connected clients"
    ],
    "followUpTopics": [
      "Redis Pub/Sub scaling",
      "Socket heartbeats"
    ]
  },
  {
    "id": "pyb-010",
    "role": "Python Backend Developer",
    "category": "Networking",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain ASGI vs WSGI. Why is ASGI necessary for asynchronous Python servers?",
    "expectedSkills": [
      "ASGI",
      "Uvicorn"
    ],
    "evaluationPoints": [
      "WSGI is synchronous single request-response",
      "ASGI handles async HTTP and persistent WebSockets",
      "Uvicorn ASGI runner"
    ],
    "followUpTopics": [
      "Gunicorn worker classes",
      "Event loop"
    ]
  },
  {
    "id": "pyb-011",
    "role": "Python Backend Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you implement API rate limiting in Python using Redis Sliding Window?",
    "expectedSkills": [
      "Rate Limiting",
      "Redis"
    ],
    "evaluationPoints": [
      "ZSET tracking timestamps of requests",
      "Prune entries outside sliding window",
      "Return 429 Too Many Requests"
    ],
    "followUpTopics": [
      "slowapi library",
      "Token bucket algorithm"
    ]
  },
  {
    "id": "pyb-012",
    "role": "Python Backend Developer",
    "category": "Database",
    "difficulty": "Advanced",
    "format": "scenario",
    "question": "A PostgreSQL query executed by your API takes 5 seconds under load. How do you diagnose it?",
    "expectedSkills": [
      "PostgreSQL",
      "Performance"
    ],
    "evaluationPoints": [
      "Run EXPLAIN (ANALYZE, BUFFERS)",
      "Identify sequential scans and missing indexes",
      "Check connection pool saturation"
    ],
    "followUpTopics": [
      "Index selectivity",
      "VACUUM and query stats"
    ]
  },
  {
    "id": "pyb-013",
    "role": "Python Backend Developer",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you structure a production-ready Dockerfile for a FastAPI application?",
    "expectedSkills": [
      "Docker",
      "Deployment"
    ],
    "evaluationPoints": [
      "Multi-stage build to reduce image footprint",
      "Run as non-root user",
      "Gunicorn with Uvicorn worker process manager"
    ],
    "followUpTopics": [
      "HEALTHCHECK instruction",
      ".dockerignore"
    ]
  },
  {
    "id": "pyb-014",
    "role": "Python Backend Developer",
    "category": "Architecture",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you structure a Python backend using Clean or Hexagonal Architecture?",
    "expectedSkills": [
      "Architecture",
      "Design Patterns"
    ],
    "evaluationPoints": [
      "Separation into Domain, Use Case, and Adapter layers",
      "Dependency Inversion with Protocols",
      "Framework-independent business logic"
    ],
    "followUpTopics": [
      "Repository pattern",
      "Service layer"
    ]
  },
  {
    "id": "pyb-015",
    "role": "Python Backend Developer",
    "category": "REST APIs",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What HTTP status codes should a REST API return for 201, 400, 401, 403, 404, and 422?",
    "expectedSkills": [
      "REST APIs",
      "HTTP"
    ],
    "evaluationPoints": [
      "201 for Created",
      "400 for Bad Request, 422 for Unprocessable Entity",
      "401 Unauthorized vs 403 Forbidden"
    ],
    "followUpTopics": [
      "204 No Content",
      "409 Conflict"
    ]
  },
  {
    "id": "pyb-016",
    "role": "Python Backend Developer",
    "category": "Testing",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you write async API tests using pytest-asyncio and httpx.AsyncClient?",
    "expectedSkills": [
      "Testing",
      "pytest"
    ],
    "evaluationPoints": [
      "AsyncClient with asgi app instance",
      "Database rollback fixtures per test",
      "Mocking external services with respx"
    ],
    "followUpTopics": [
      "Testcontainers",
      "Fixtures"
    ]
  },
  {
    "id": "pyb-017",
    "role": "Python Backend Developer",
    "category": "Cloud",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you handle large file uploads securely in Python without loading everything into memory?",
    "expectedSkills": [
      "FastAPI",
      "AWS S3"
    ],
    "evaluationPoints": [
      "Stream via UploadFile or use S3 presigned URLs",
      "Validate file size and MIME content type",
      "boto3 upload_fileobj"
    ],
    "followUpTopics": [
      "Presigned URLs",
      "Virus scanning"
    ]
  },
  {
    "id": "pyb-018",
    "role": "Python Backend Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why should you never use SHA256 or MD5 for password storage? What should you use instead?",
    "expectedSkills": [
      "Security",
      "Cryptography"
    ],
    "evaluationPoints": [
      "Fast hashes are vulnerable to brute-force and rainbow tables",
      "Use adaptive salted algorithms: bcrypt or Argon2",
      "Configurable work factor (rounds)"
    ],
    "followUpTopics": [
      "passlib",
      "Timing attack prevention"
    ]
  },
  {
    "id": "pyb-019",
    "role": "Python Backend Developer",
    "category": "Distributed Systems",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you manage distributed transactions across microservices using the Saga pattern?",
    "expectedSkills": [
      "Microservices",
      "Architecture"
    ],
    "evaluationPoints": [
      "Choreographed events vs central orchestrator",
      "Compensating transactions on failure",
      "Avoids brittle two-phase commits"
    ],
    "followUpTopics": [
      "Outbox pattern",
      "Idempotency keys"
    ]
  },
  {
    "id": "pyb-020",
    "role": "Python Backend Developer",
    "category": "Database",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does Alembic generate and apply schema migrations for SQLAlchemy models?",
    "expectedSkills": [
      "Alembic",
      "DevOps"
    ],
    "evaluationPoints": [
      "alembic revision --autogenerate detects changes",
      "alembic upgrade head applies migrations",
      "Managing migration conflicts in team branches"
    ],
    "followUpTopics": [
      "Downgrades",
      "Branching migrations"
    ]
  },
  {
    "id": "pyb-021",
    "role": "Python Backend Developer",
    "category": "Monitoring",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you instrument a Python REST API with Prometheus metrics and OpenTelemetry?",
    "expectedSkills": [
      "Prometheus",
      "Observability"
    ],
    "evaluationPoints": [
      "Expose /metrics endpoint using prometheus-fastapi-instrumentator",
      "Track request count, latency histograms, and error rates",
      "Distributed tracing with OpenTelemetry trace_id"
    ],
    "followUpTopics": [
      "Grafana",
      "Alertmanager"
    ]
  },
  {
    "id": "pyb-022",
    "role": "Python Backend Developer",
    "category": "Async",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Why does a CPU-heavy loop inside an async def route freeze all API traffic, and how do you fix it?",
    "expectedSkills": [
      "Async",
      "Concurrency"
    ],
    "evaluationPoints": [
      "Event loop is blocked by synchronous CPU execution",
      "Offload with asyncio.to_thread() or ProcessPoolExecutor",
      "Or dispatch to background Celery queue"
    ],
    "followUpTopics": [
      "concurrent.futures",
      "def vs async def"
    ]
  },
  {
    "id": "pyb-023",
    "role": "Python Backend Developer",
    "category": "gRPC",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What are the performance advantages of using gRPC over REST for microservice communication?",
    "expectedSkills": [
      "gRPC",
      "Protocol Buffers"
    ],
    "evaluationPoints": [
      "Compact binary Protocol Buffers vs text JSON",
      "HTTP/2 multiplexing and streaming support",
      "Strict contract generation from .proto files"
    ],
    "followUpTopics": [
      "grpcio-tools",
      "Bi-directional streaming"
    ]
  },
  {
    "id": "pyb-024",
    "role": "Python Backend Developer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why is database connection pooling critical for high-throughput Python backends?",
    "expectedSkills": [
      "Database",
      "Performance"
    ],
    "evaluationPoints": [
      "Reuses established connections, eliminating handshake overhead",
      "Prevents exhausting database max_connections",
      "Configuring pool_size and max_overflow in SQLAlchemy"
    ],
    "followUpTopics": [
      "pgBouncer",
      "Connection timeouts"
    ]
  },
  {
    "id": "pyb-025",
    "role": "Python Backend Developer",
    "category": "API Design",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the main approaches to API versioning in Python backends?",
    "expectedSkills": [
      "API Design"
    ],
    "evaluationPoints": [
      "URI path versioning (/api/v1/)",
      "Header versioning (Accept header)",
      "Query parameter versioning"
    ],
    "followUpTopics": [
      "Deprecation lifecycle",
      "Backward compatibility"
    ]
  },
  {
    "id": "pyb-026",
    "role": "Python Backend Developer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you insert or update 10,000 records efficiently in PostgreSQL from Python?",
    "expectedSkills": [
      "SQLAlchemy",
      "Database"
    ],
    "evaluationPoints": [
      "Avoid issuing 10,000 individual queries in a loop",
      "Use bulk_insert_mappings or PostgreSQL COPY",
      "Execute within a single database transaction"
    ],
    "followUpTopics": [
      "temporary tables",
      "ON CONFLICT DO UPDATE"
    ]
  },
  {
    "id": "pyb-027",
    "role": "Python Backend Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you prevent SQL injection when writing dynamic queries in Python?",
    "expectedSkills": [
      "Security",
      "SQL"
    ],
    "evaluationPoints": [
      "Always use parameterized queries or ORM expressions",
      "Never format raw strings into SQL queries",
      "SQLAlchemy text() with bindparams"
    ],
    "followUpTopics": [
      "OWASP Top 10",
      "Input validation"
    ]
  },
  {
    "id": "pyb-028",
    "role": "Python Backend Developer",
    "category": "API Design",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Offset-based vs Keyset (Cursor-based) pagination for large datasets.",
    "expectedSkills": [
      "API Design",
      "Database"
    ],
    "evaluationPoints": [
      "Offset scans and discards preceding rows (slow on page 1000)",
      "Cursor pagination seeks index directly (WHERE id > cursor)",
      "Cursor prevents duplicate/missed rows during live inserts"
    ],
    "followUpTopics": [
      "FastAPI-pagination",
      "Infinite scroll"
    ]
  },
  {
    "id": "pyb-029",
    "role": "Python Backend Developer",
    "category": "Testing",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you mock an external third-party payment API in Python unit tests?",
    "expectedSkills": [
      "Testing",
      "Mocking"
    ],
    "evaluationPoints": [
      "unittest.mock.patch or respx library for httpx",
      "Assert mock called with exact expected payload",
      "Ensure tests never hit live third-party network"
    ],
    "followUpTopics": [
      "Responses library",
      "VCR.py"
    ]
  },
  {
    "id": "pyb-030",
    "role": "Python Backend Developer",
    "category": "REST APIs",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is an idempotency key and how do you implement it for financial transactions?",
    "expectedSkills": [
      "API Design",
      "Distributed Systems"
    ],
    "evaluationPoints": [
      "Client sends unique Idempotency-Key header",
      "Server caches request result in Redis",
      "Duplicate requests return cached response without re-processing"
    ],
    "followUpTopics": [
      "POST vs PUT",
      "Payment gateways"
    ]
  },
  {
    "id": "pyb-031",
    "role": "Python Backend Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you manage database passwords and API keys securely in Python applications?",
    "expectedSkills": [
      "Security",
      "DevOps"
    ],
    "evaluationPoints": [
      "Never commit secrets to Git repositories",
      "Load from environment variables using pydantic-settings",
      "Use cloud secrets managers (AWS Secrets Manager, HashiCorp Vault) in production"
    ],
    "followUpTopics": [
      ".env.example",
      "12-Factor App"
    ]
  },
  {
    "id": "pyb-032",
    "role": "Python Backend Developer",
    "category": "Logging",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is structured JSON logging preferred over plain text logs in cloud-native backends?",
    "expectedSkills": [
      "Logging",
      "Observability"
    ],
    "evaluationPoints": [
      "Easily parsed and indexed by ELK, Datadog, CloudWatch",
      "Enables filtering by correlation_id, user_id, and log level",
      "Consistent schema across all microservices"
    ],
    "followUpTopics": [
      "Loguru",
      "structlog"
    ]
  },
  {
    "id": "pyb-033",
    "role": "Python Backend Developer",
    "category": "Behavioral",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a time a production backend service crashed. How did you triage, resolve, and prevent it?",
    "expectedSkills": [
      "Problem Solving",
      "Incident Response"
    ],
    "evaluationPoints": [
      "Check server logs and monitoring metrics immediately",
      "Identify root cause (memory leak, unindexed query, deadlock)",
      "Deploy hotfix and write post-mortem with preventative tests"
    ],
    "followUpTopics": [
      "Root cause analysis",
      "Runbooks"
    ]
  },
  {
    "id": "pyb-034",
    "role": "Python Backend Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Walk me through the architecture of a Python backend API you designed from scratch.",
    "expectedSkills": [
      "System Design",
      "Communication"
    ],
    "evaluationPoints": [
      "Requirements analysis and tech stack selection",
      "Data schema design and entity relationships",
      "Deployment, caching, and CI/CD pipelines"
    ],
    "followUpTopics": [
      "Scalability trade-offs",
      "Lessons learned"
    ]
  },
  {
    "id": "pyb-035",
    "role": "Python Backend Developer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you coordinate API changes with frontend mobile and web teams without breaking production?",
    "expectedSkills": [
      "Collaboration",
      "API Contracts"
    ],
    "evaluationPoints": [
      "Publish OpenAPI / Swagger schemas",
      "Maintain backward compatibility and deprecation notices",
      "Use feature flags for gradual rollouts"
    ],
    "followUpTopics": [
      "Contract testing",
      "API design first"
    ]
  }
];
