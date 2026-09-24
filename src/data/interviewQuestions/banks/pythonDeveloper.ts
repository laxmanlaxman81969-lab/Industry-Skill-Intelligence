import { RoleQuestion } from '../types';

export const PYTHON_DEVELOPER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "py-001",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are mutable vs immutable types in Python and what are the implications?",
    "expectedSkills": [
      "Python Core"
    ],
    "evaluationPoints": [
      "Lists/dicts are mutable",
      "Tuples/ints/strings are immutable",
      "Default argument bug"
    ],
    "followUpTopics": [
      "id()",
      "copy module"
    ]
  },
  {
    "id": "py-002",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Python lists vs tuples. When should you choose a tuple over a list?",
    "expectedSkills": [
      "Data Structures"
    ],
    "evaluationPoints": [
      "Mutability differences",
      "Tuple memory efficiency",
      "Dictionary keys requirement"
    ],
    "followUpTopics": [
      "NamedTuple",
      "Packing"
    ]
  },
  {
    "id": "py-003",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Python decorators work? Explain with a function timing example.",
    "expectedSkills": [
      "Decorators"
    ],
    "evaluationPoints": [
      "Higher-order functions",
      "functools.wraps importance",
      "@ syntax meaning"
    ],
    "followUpTopics": [
      "Decorator arguments",
      "Class decorators"
    ]
  },
  {
    "id": "py-004",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a generator in Python? How does the 'yield' keyword conserve memory?",
    "expectedSkills": [
      "Generators"
    ],
    "evaluationPoints": [
      "Lazy evaluation",
      "Iterators protocol",
      "generator vs list comprehension"
    ],
    "followUpTopics": [
      "itertools",
      "send()"
    ]
  },
  {
    "id": "py-005",
    "role": "Python Developer",
    "category": "Concurrency",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is the Global Interpreter Lock (GIL) and how does it affect multi-threading vs multi-processing?",
    "expectedSkills": [
      "GIL",
      "Concurrency"
    ],
    "evaluationPoints": [
      "CPython thread execution",
      "CPU-bound vs I/O-bound",
      "multiprocessing module"
    ],
    "followUpTopics": [
      "asyncio",
      "free-threaded Python"
    ]
  },
  {
    "id": "py-006",
    "role": "Python Developer",
    "category": "OOP",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain inheritance and Method Resolution Order (MRO) in Python.",
    "expectedSkills": [
      "OOP"
    ],
    "evaluationPoints": [
      "Multiple inheritance",
      "C3 linearization",
      "super() call flow"
    ],
    "followUpTopics": [
      "Diamond problem",
      "__mro__"
    ]
  },
  {
    "id": "py-007",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain dunder methods: __init__, __str__, __repr__, and __call__.",
    "expectedSkills": [
      "OOP"
    ],
    "evaluationPoints": [
      "Initialization vs representation",
      "Developer vs user formatting",
      "Callable instances"
    ],
    "followUpTopics": [
      "__enter__",
      "__hash__"
    ]
  },
  {
    "id": "py-008",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is a context manager and how does the 'with' statement manage resources?",
    "expectedSkills": [
      "Resource Management"
    ],
    "evaluationPoints": [
      "__enter__ and __exit__",
      "Guaranteed cleanup",
      "contextlib.contextmanager"
    ],
    "followUpTopics": [
      "Exception suppression",
      "AsyncContextManager"
    ]
  },
  {
    "id": "py-009",
    "role": "Python Developer",
    "category": "Data Structures",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How is a Python dictionary implemented internally? What is its time complexity?",
    "expectedSkills": [
      "Data Structures"
    ],
    "evaluationPoints": [
      "Hash table design",
      "O(1) average lookup",
      "Ordered dict in Python 3.7+"
    ],
    "followUpTopics": [
      "defaultdict",
      "Counter"
    ]
  },
  {
    "id": "py-010",
    "role": "Python Developer",
    "category": "Concurrency",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does asyncio enable asynchronous programming in Python?",
    "expectedSkills": [
      "asyncio"
    ],
    "evaluationPoints": [
      "Single-threaded event loop",
      "async/await syntax",
      "Non-blocking coroutines"
    ],
    "followUpTopics": [
      "asyncio.gather",
      "aiohttp"
    ]
  },
  {
    "id": "py-011",
    "role": "Python Developer",
    "category": "Testing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you use pytest fixtures and parameterization in unit testing?",
    "expectedSkills": [
      "Testing"
    ],
    "evaluationPoints": [
      "@pytest.fixture dependency injection",
      "pytest.mark.parametrize",
      "Modular test setup"
    ],
    "followUpTopics": [
      "pytest-mock",
      "Monkeypatching"
    ]
  },
  {
    "id": "py-012",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Easy",
    "format": "practical",
    "question": "Write a list comprehension that extracts and squares all even numbers from a list.",
    "expectedSkills": [
      "List Comprehensions"
    ],
    "evaluationPoints": [
      "[x**2 for x in nums if x%2==0]",
      "Readability vs map/filter",
      "Dict comprehension syntax"
    ],
    "followUpTopics": [
      "Set comprehension",
      "Generator expressions"
    ]
  },
  {
    "id": "py-013",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the difference between shallow copy and deep copy in Python.",
    "expectedSkills": [
      "Memory"
    ],
    "evaluationPoints": [
      "copy.copy vs copy.deepcopy",
      "Nested references preservation",
      "Mutation side-effects"
    ],
    "followUpTopics": [
      "copy method",
      "Immutability"
    ]
  },
  {
    "id": "py-014",
    "role": "Python Developer",
    "category": "Tooling",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why are virtual environments (venv, poetry) essential for Python development?",
    "expectedSkills": [
      "Environment Management"
    ],
    "evaluationPoints": [
      "Dependency isolation",
      "Preventing version collisions",
      "pyproject.toml lockfiles"
    ],
    "followUpTopics": [
      "Pipenv",
      "Poetry"
    ]
  },
  {
    "id": "py-015",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between 'is' and '==' in Python?",
    "expectedSkills": [
      "Python Core"
    ],
    "evaluationPoints": [
      "Identity vs equality",
      "Memory address comparison",
      "'is None' convention"
    ],
    "followUpTopics": [
      "Integer caching",
      "String interning"
    ]
  },
  {
    "id": "py-016",
    "role": "Python Developer",
    "category": "Functions",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain *args and **kwargs in Python function definitions.",
    "expectedSkills": [
      "Functions"
    ],
    "evaluationPoints": [
      "Variable positional args as tuple",
      "Variable keyword args as dict",
      "Unpacking arguments"
    ],
    "followUpTopics": [
      "Keyword-only args",
      "Positional-only args"
    ]
  },
  {
    "id": "py-017",
    "role": "Python Developer",
    "category": "Exception Handling",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does the try-except-else-finally structure execute?",
    "expectedSkills": [
      "Exceptions"
    ],
    "evaluationPoints": [
      "else runs on success only",
      "finally always runs",
      "Clean error handling"
    ],
    "followUpTopics": [
      "Custom exceptions",
      "raise from"
    ]
  },
  {
    "id": "py-018",
    "role": "Python Developer",
    "category": "OOP",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the difference between @staticmethod and @classmethod?",
    "expectedSkills": [
      "OOP"
    ],
    "evaluationPoints": [
      "@classmethod gets cls argument",
      "@staticmethod gets neither self nor cls",
      "Alternative constructors"
    ],
    "followUpTopics": [
      "Abstract classes",
      "Metaclasses"
    ]
  },
  {
    "id": "py-019",
    "role": "Python Developer",
    "category": "Standard Library",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the utilities in Python's collections module: Counter, defaultdict, and deque.",
    "expectedSkills": [
      "Collections"
    ],
    "evaluationPoints": [
      "Counter frequency counting",
      "defaultdict automatic key init",
      "deque O(1) double-ended operations"
    ],
    "followUpTopics": [
      "heapq",
      "namedtuple"
    ]
  },
  {
    "id": "py-020",
    "role": "Python Developer",
    "category": "Type Hints",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Python type hints (PEP 484) and MyPy enhance application reliability?",
    "expectedSkills": [
      "Typing"
    ],
    "evaluationPoints": [
      "Static type validation",
      "IDE autocompletion",
      "No runtime performance cost"
    ],
    "followUpTopics": [
      "Pydantic",
      "Protocol"
    ]
  },
  {
    "id": "py-021",
    "role": "Python Developer",
    "category": "File Handling",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you stream a 10GB file in Python without exhausting RAM?",
    "expectedSkills": [
      "File I/O"
    ],
    "evaluationPoints": [
      "Line by line iteration with 'for line in f'",
      "Chunked reading f.read(chunk_size)",
      "Avoiding f.read()"
    ],
    "followUpTopics": [
      "mmap",
      "Generator pipelines"
    ]
  },
  {
    "id": "py-022",
    "role": "Python Developer",
    "category": "Profiling",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "How would you identify and fix a CPU bottleneck in a Python script?",
    "expectedSkills": [
      "Profiling"
    ],
    "evaluationPoints": [
      "cProfile module analysis",
      "line_profiler inspection",
      "Algorithmic refactoring"
    ],
    "followUpTopics": [
      "Py-Spy",
      "Vectorization"
    ]
  },
  {
    "id": "py-023",
    "role": "Python Developer",
    "category": "Functional",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain lambda functions, map, filter, and functools.reduce in Python.",
    "expectedSkills": [
      "Functional"
    ],
    "evaluationPoints": [
      "Anonymous functions",
      "Functional transformations",
      "Comprehension alternatives"
    ],
    "followUpTopics": [
      "functools.partial",
      "operator module"
    ]
  },
  {
    "id": "py-024",
    "role": "Python Developer",
    "category": "Metaprogramming",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What are metaclasses in Python and when are they used in frameworks?",
    "expectedSkills": [
      "Metaclasses"
    ],
    "evaluationPoints": [
      "Class creation interceptors",
      "type as default metaclass",
      "ORM and schema validation usage"
    ],
    "followUpTopics": [
      "__init_subclass__",
      "Class decorators"
    ]
  },
  {
    "id": "py-025",
    "role": "Python Developer",
    "category": "Networking",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you make an authenticated HTTP GET request with timeouts using requests?",
    "expectedSkills": [
      "requests"
    ],
    "evaluationPoints": [
      "requests.get with timeout parameter",
      "Passing auth headers",
      "raise_for_status() check"
    ],
    "followUpTopics": [
      "requests.Session",
      "httpx"
    ]
  },
  {
    "id": "py-026",
    "role": "Python Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why is using eval() or pickle on untrusted data dangerous in Python?",
    "expectedSkills": [
      "Security"
    ],
    "evaluationPoints": [
      "Arbitrary code execution risk",
      "pickle deserialization exploits",
      "Safe alternatives: json, ast.literal_eval"
    ],
    "followUpTopics": [
      "Bandit",
      "Injection attacks"
    ]
  },
  {
    "id": "py-027",
    "role": "Python Developer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain SQLAlchemy Core vs ORM and how Alembic handles migrations.",
    "expectedSkills": [
      "SQLAlchemy"
    ],
    "evaluationPoints": [
      "SQL expression language vs object mapping",
      "Alembic revision autogeneration",
      "Session lifecycle"
    ],
    "followUpTopics": [
      "asyncpg",
      "Scoped sessions"
    ]
  },
  {
    "id": "py-028",
    "role": "Python Developer",
    "category": "Algorithms",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you sort a list of dictionaries by a specific key in reverse order?",
    "expectedSkills": [
      "Algorithms"
    ],
    "evaluationPoints": [
      "sorted(items, key=lambda x: x['key'], reverse=True)",
      "operator.itemgetter usage",
      "Timsort stability"
    ],
    "followUpTopics": [
      "Multi-key sorting",
      "Custom sort classes"
    ]
  },
  {
    "id": "py-029",
    "role": "Python Developer",
    "category": "Python Core",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the difference between __new__ and __init__ in Python?",
    "expectedSkills": [
      "OOP"
    ],
    "evaluationPoints": [
      "__new__ allocates instance",
      "__init__ initializes attributes",
      "Singleton and immutable subclassing"
    ],
    "followUpTopics": [
      "Metaclass __call__",
      "Factory pattern"
    ]
  },
  {
    "id": "py-030",
    "role": "Python Developer",
    "category": "Logging",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you configure structured logging using Python's logging module?",
    "expectedSkills": [
      "Logging"
    ],
    "evaluationPoints": [
      "Loggers, handlers, and formatters",
      "Avoid print statements",
      "Log rotation and levels"
    ],
    "followUpTopics": [
      "Loguru",
      "JSON formatters"
    ]
  },
  {
    "id": "py-031",
    "role": "Python Developer",
    "category": "Modern Python",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain structural pattern matching (match-case) introduced in Python 3.10.",
    "expectedSkills": [
      "Modern Python"
    ],
    "evaluationPoints": [
      "match-case syntax",
      "Destructuring sequences and objects",
      "Guard clauses with if"
    ],
    "followUpTopics": [
      "Wildcard _",
      "Class patterns"
    ]
  },
  {
    "id": "py-032",
    "role": "Python Developer",
    "category": "Memory",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does Python handle garbage collection: reference counting vs cyclic GC?",
    "expectedSkills": [
      "Memory"
    ],
    "evaluationPoints": [
      "Reference count reaching zero deallocates immediately",
      "Cyclic GC detects circular references",
      "Generational GC tiers (gen 0, 1, 2)"
    ],
    "followUpTopics": [
      "gc module",
      "weakref"
    ]
  },
  {
    "id": "py-033",
    "role": "Python Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a production Python application or automation tool you built from scratch.",
    "expectedSkills": [
      "Project Experience"
    ],
    "evaluationPoints": [
      "Architecture and requirements",
      "Libraries chosen and trade-offs",
      "Deployment and reliability"
    ],
    "followUpTopics": [
      "Testing strategy",
      "Maintenance"
    ]
  },
  {
    "id": "py-034",
    "role": "Python Developer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you resolve package dependency conflicts in a multi-developer team?",
    "expectedSkills": [
      "Collaboration"
    ],
    "evaluationPoints": [
      "Lockfiles pinning dependencies",
      "Virtual environments",
      "CI dependency checks"
    ],
    "followUpTopics": [
      "Dependabot",
      "Docker containers"
    ]
  },
  {
    "id": "py-035",
    "role": "Python Developer",
    "category": "Clean Code",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is PEP 8 and what linters (Black, Flake8, Ruff) do you use to enforce it?",
    "expectedSkills": [
      "Code Standards"
    ],
    "evaluationPoints": [
      "Official Python style conventions",
      "Automated formatting with Black/Ruff",
      "Pre-commit hook integration"
    ],
    "followUpTopics": [
      "isort",
      "Flake8 rules"
    ]
  }
];
