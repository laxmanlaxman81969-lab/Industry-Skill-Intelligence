import { RoleQuestion } from '../types';

export const DATABASE_DEVELOPER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "dbdev-001",
    "role": "Database Developer",
    "category": "Database Design",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain 1NF, 2NF, 3NF, and BCNF with concrete database table examples.",
    "expectedSkills": [
      "Database Design",
      "Normalization"
    ],
    "evaluationPoints": [
      "1NF: atomic values, no repeating groups, unique primary key",
      "2NF: in 1NF and no partial dependencies on composite primary key",
      "3NF: in 2NF and no transitive dependencies",
      "BCNF: in 3NF and for every functional dependency X -> Y, X must be a superkey"
    ],
    "followUpTopics": [
      "Denormalization trade-offs",
      "Data redundancy"
    ]
  },
  {
    "id": "dbdev-002",
    "role": "Database Developer",
    "category": "Indexing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the physical storage difference between a clustered index and a non-clustered index?",
    "expectedSkills": [
      "Indexing",
      "Storage"
    ],
    "evaluationPoints": [
      "Clustered index defines the physical order of data rows on disk (only 1 per table, usually PK)",
      "Non-clustered index is a separate B-tree structure holding index keys and pointers to the physical data rows",
      "Covering index includes all columns needed by query to avoid table lookups"
    ],
    "followUpTopics": [
      "B-Tree structure",
      "Index seek vs index scan"
    ]
  },
  {
    "id": "dbdev-003",
    "role": "Database Developer",
    "category": "Transactions",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain ACID transaction properties and how Write-Ahead Logging (WAL) ensures Durability and Atomicity.",
    "expectedSkills": [
      "ACID",
      "Transactions"
    ],
    "evaluationPoints": [
      "Atomicity: all changes commit or all rollback",
      "Consistency: valid database constraints maintained",
      "Isolation: concurrent transactions do not interfere",
      "Durability: committed transactions survive server crashes via WAL logging to disk before writing to data pages"
    ],
    "followUpTopics": [
      "WAL (Write-Ahead Log)",
      "Two-Phase Commit"
    ]
  },
  {
    "id": "dbdev-004",
    "role": "Database Developer",
    "category": "Transactions",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Compare Read Uncommitted, Read Committed, Repeatable Read, and Serializable isolation levels.",
    "expectedSkills": [
      "Transactions",
      "Concurrency"
    ],
    "evaluationPoints": [
      "Read Uncommitted allows Dirty Reads (reading uncommitted data)",
      "Read Committed prevents Dirty Reads but allows Non-Repeatable Reads",
      "Repeatable Read prevents Non-Repeatable Reads but may allow Phantom Reads",
      "Serializable prevents Phantom Reads using range locks or MVCC serializable snapshot isolation"
    ],
    "followUpTopics": [
      "MVCC",
      "Dirty reads vs Phantom reads"
    ]
  },
  {
    "id": "dbdev-005",
    "role": "Database Developer",
    "category": "Concurrency",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does MVCC allow PostgreSQL to achieve high concurrency without readers blocking writers?",
    "expectedSkills": [
      "PostgreSQL",
      "MVCC"
    ],
    "evaluationPoints": [
      "Each transaction sees a snapshot of data at a specific point in time",
      "Updates create new row versions (tuples) with xmin and xmax transaction IDs instead of overwriting existing rows",
      "Readers never block writers and writers never block readers"
    ],
    "followUpTopics": [
      "VACUUM in PostgreSQL",
      "Transaction ID wraparound"
    ]
  },
  {
    "id": "dbdev-006",
    "role": "Database Developer",
    "category": "Programmability",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the functional and operational difference between a Stored Procedure and a User-Defined Function (UDF)?",
    "expectedSkills": [
      "SQL",
      "Stored Procedures"
    ],
    "evaluationPoints": [
      "Functions must return a value, cannot commit/rollback transactions, and can be used in SELECT statements",
      "Stored Procedures do not require a return value, can execute transactions (COMMIT/ROLLBACK), and are executed using CALL/EXEC",
      "Procedures are used for business workflow; functions for computations"
    ],
    "followUpTopics": [
      "Deterministic functions",
      "Table-valued functions"
    ]
  },
  {
    "id": "dbdev-007",
    "role": "Database Developer",
    "category": "Programmability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are database triggers (BEFORE, AFTER, INSTEAD OF) and what are their architectural drawbacks?",
    "expectedSkills": [
      "Triggers",
      "Architecture"
    ],
    "evaluationPoints": [
      "Execute automatically in response to DML operations (INSERT, UPDATE, DELETE)",
      "BEFORE triggers validate/modify data before commit; INSTEAD OF triggers update complex views",
      "Drawbacks: hidden side-effects, difficult debugging, performance overhead during bulk operations"
    ],
    "followUpTopics": [
      "Audit logging triggers",
      "Recursive triggers"
    ]
  },
  {
    "id": "dbdev-008",
    "role": "Database Developer",
    "category": "Database Design",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare standard Views vs Materialized Views. When do you use a Materialized View?",
    "expectedSkills": [
      "Views",
      "Performance"
    ],
    "evaluationPoints": [
      "Standard View is a stored virtual query executed dynamically on every call",
      "Materialized View physically computes and persists query results to disk, acting like a table with its own indexes",
      "Use Materialized Views for expensive aggregate analytics, refreshing periodically"
    ],
    "followUpTopics": [
      "REFRESH MATERIALIZED VIEW CONCURRENTLY",
      "Query rewrite"
    ]
  },
  {
    "id": "dbdev-009",
    "role": "Database Developer",
    "category": "Indexing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why does column ordering matter in a composite index (columnA, columnB) and what is the Leftmost Prefix rule?",
    "expectedSkills": [
      "Indexing",
      "Query Optimization"
    ],
    "evaluationPoints": [
      "Index can satisfy queries filtering on (columnA) or (columnA, columnB)",
      "Index cannot be used for queries filtering only on (columnB) without columnA (leftmost prefix rule)",
      "Put high-cardinality equality columns first, followed by range/sort columns"
    ],
    "followUpTopics": [
      "Leftmost prefix",
      "Covering index"
    ]
  },
  {
    "id": "dbdev-010",
    "role": "Database Developer",
    "category": "Performance Tuning",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you read and interpret an EXPLAIN ANALYZE output in PostgreSQL or MySQL?",
    "expectedSkills": [
      "Query Optimization",
      "EXPLAIN"
    ],
    "evaluationPoints": [
      "Check scan type: Sequential/Table Scan vs Index Scan vs Index Only Scan",
      "Compare estimated cost vs actual execution time and rows returned",
      "Identify expensive operations: Nested Loop, Hash Join, Sort, and HashAggregate"
    ],
    "followUpTopics": [
      "Buffers hit ratio",
      "Query planner statistics"
    ]
  },
  {
    "id": "dbdev-011",
    "role": "Database Developer",
    "category": "Concurrency",
    "difficulty": "Advanced",
    "format": "scenario",
    "question": "Two concurrent transactions produce a deadlock in your database. How do you identify, resolve, and prevent it?",
    "expectedSkills": [
      "Concurrency",
      "Deadlocks"
    ],
    "evaluationPoints": [
      "Database engine detects circular lock dependencies and aborts one transaction (deadlock victim)",
      "Analyze deadlock logs to see queries and locked rows involved",
      "Prevention: always access tables and rows in the exact same deterministic order across transactions; keep transactions short"
    ],
    "followUpTopics": [
      "Lock escalation",
      "SELECT FOR UPDATE"
    ]
  },
  {
    "id": "dbdev-012",
    "role": "Database Developer",
    "category": "Scalability",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Compare table partitioning (vertical/horizontal) on a single database vs horizontal database sharding.",
    "expectedSkills": [
      "Scalability",
      "Architecture"
    ],
    "evaluationPoints": [
      "Table partitioning divides a huge table into smaller physical partitions on the same DB instance (e.g. partition by month/range)",
      "Sharding distributes partitions across multiple independent database nodes/servers based on a shard key",
      "Sharding scales writes and storage horizontally across machines but complicates cross-shard queries and joins"
    ],
    "followUpTopics": [
      "Range vs Hash partitioning",
      "Shard key selection"
    ]
  },
  {
    "id": "dbdev-013",
    "role": "Database Developer",
    "category": "Indexing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare B-Tree, Hash, and GIN (Generalized Inverted) indexes in PostgreSQL.",
    "expectedSkills": [
      "Indexing",
      "PostgreSQL"
    ],
    "evaluationPoints": [
      "B-Tree: balanced tree supporting equality and range queries (<, <=, =, >=, >) and sorting (default)",
      "Hash: supports exact equality lookup only (=)",
      "GIN: inverted index mapping elements inside composite items (JSONB, array columns, full-text search) to matching rows"
    ],
    "followUpTopics": [
      "GiST indexes",
      "JSONB indexing"
    ]
  },
  {
    "id": "dbdev-014",
    "role": "Database Developer",
    "category": "Database Design",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare auto-incrementing integer surrogate keys vs natural keys vs UUIDs as primary keys.",
    "expectedSkills": [
      "Database Design"
    ],
    "evaluationPoints": [
      "Auto-increment int: compact, fast sequential inserts in B-tree, but exposes record count and conflicts in distributed databases",
      "Natural key: avoids extra column, but changes in real-world data break foreign key relationships",
      "UUIDv4: globally unique, distributed friendly, but random order causes B-tree page splits and index fragmentation; UUIDv7 provides time-ordered clustering"
    ],
    "followUpTopics": [
      "UUIDv7",
      "B-tree page splits"
    ]
  },
  {
    "id": "dbdev-015",
    "role": "Database Developer",
    "category": "Data Integrity",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain ON DELETE CASCADE, SET NULL, RESTRICT, and NO ACTION referential actions in foreign keys.",
    "expectedSkills": [
      "Foreign Keys",
      "Data Integrity"
    ],
    "evaluationPoints": [
      "CASCADE: deleting parent row automatically deletes all related child rows",
      "SET NULL: deleting parent sets child foreign key to NULL (requires nullable column)",
      "RESTRICT: immediately prevents deletion of parent if child rows exist",
      "NO ACTION: defers constraint check to end of transaction"
    ],
    "followUpTopics": [
      "Deferred constraints",
      "Cascading updates"
    ]
  },
  {
    "id": "dbdev-016",
    "role": "Database Developer",
    "category": "Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why is an external connection pooler like pgBouncer necessary for PostgreSQL at scale?",
    "expectedSkills": [
      "PostgreSQL",
      "pgBouncer"
    ],
    "evaluationPoints": [
      "PostgreSQL uses process-per-connection model; high connection counts consume substantial RAM and cause context switching",
      "pgBouncer pools connections using Transaction or Session pooling, handling thousands of client connections with small backend pool",
      "Eliminates connection setup overhead and protects database from connection exhaustion"
    ],
    "followUpTopics": [
      "Transaction pooling mode",
      "Max connections limit"
    ]
  },
  {
    "id": "dbdev-017",
    "role": "Database Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you refactor an inefficient correlated subquery with an EXISTS or JOIN clause?",
    "expectedSkills": [
      "SQL Optimization"
    ],
    "evaluationPoints": [
      "Correlated subqueries evaluate for every row of outer table (O(N*M))",
      "Refactor using INNER/LEFT JOIN with GROUP BY or an EXISTS clause",
      "Allows query optimizer to use hash joins or merge joins instead of nested loops"
    ],
    "followUpTopics": [
      "EXISTS vs IN",
      "Window function refactoring"
    ]
  },
  {
    "id": "dbdev-018",
    "role": "Database Developer",
    "category": "Concurrency",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When should you implement Optimistic Locking using a version column vs Pessimistic Locking (SELECT FOR UPDATE)?",
    "expectedSkills": [
      "Concurrency",
      "Locking"
    ],
    "evaluationPoints": [
      "Optimistic locking checks version column before commit; fails on collision (ideal for read-heavy low contention)",
      "Pessimistic locking takes exclusive row lock in database (SELECT FOR UPDATE) preventing concurrent access (ideal for high-contention financial transactions)",
      "Optimistic avoids database locks; pessimistic avoids rollbacks and retries"
    ],
    "followUpTopics": [
      "SELECT FOR UPDATE NOWAIT",
      "Retry logic"
    ]
  },
  {
    "id": "dbdev-019",
    "role": "Database Developer",
    "category": "DevOps",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you execute zero-downtime database schema migrations for tables with 50 million rows?",
    "expectedSkills": [
      "Migrations",
      "High Availability"
    ],
    "evaluationPoints": [
      "Avoid blocking DDL locks (e.g. adding column with default in older engines locks table)",
      "Use Expand-and-Contract (Parallel Run) pattern: add new nullable column, backfill asynchronously in batches, switch application, drop old column",
      "Create indexes concurrently (CREATE INDEX CONCURRENTLY in Postgres)"
    ],
    "followUpTopics": [
      "Expand and contract",
      "pt-online-schema-change"
    ]
  },
  {
    "id": "dbdev-020",
    "role": "Database Developer",
    "category": "High Availability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare synchronous vs asynchronous database replication. What is split-brain in failover?",
    "expectedSkills": [
      "Replication",
      "High Availability"
    ],
    "evaluationPoints": [
      "Synchronous guarantees zero data loss (commits wait for replica ack) at the cost of write latency",
      "Asynchronous returns immediately after local commit, replicating in background (low latency, but replica lag means risk of data loss on sudden primary crash)",
      "Split-brain occurs when network partition causes two nodes to both believe they are primary writer"
    ],
    "followUpTopics": [
      "RPO / RTO",
      "Quorum consensus"
    ]
  },
  {
    "id": "dbdev-021",
    "role": "Database Developer",
    "category": "PostgreSQL",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is table bloat in PostgreSQL and how does Auto-VACUUM reclaim disk space from dead tuples?",
    "expectedSkills": [
      "PostgreSQL",
      "Storage"
    ],
    "evaluationPoints": [
      "MVCC updates/deletes leave dead tuples on disk pages until cleaned up",
      "VACUUM marks dead tuple space as reusable for future inserts without shrinking file size",
      "VACUUM FULL rewrites entire table to reclaim disk space to OS, but takes an exclusive lock blocking reads and writes"
    ],
    "followUpTopics": [
      "Auto-vacuum tuning",
      "pg_repack"
    ]
  },
  {
    "id": "dbdev-022",
    "role": "Database Developer",
    "category": "Disaster Recovery",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Point-in-Time Recovery (PITR) work using base backups and WAL archives?",
    "expectedSkills": [
      "Backup",
      "Disaster Recovery"
    ],
    "evaluationPoints": [
      "Restore consistent physical base backup taken at earlier date",
      "Replay WAL (Write-Ahead Log) segments forward continuously up to exact target timestamp",
      "Allows recovery to precise minute before an accidental DROP TABLE command"
    ],
    "followUpTopics": [
      "pg_dump vs physical backup",
      "WAL archiving"
    ]
  },
  {
    "id": "dbdev-023",
    "role": "Database Developer",
    "category": "Data Modeling",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design an audit history table using SQL temporal tables or SCD Type 2?",
    "expectedSkills": [
      "Data Modeling",
      "Audit"
    ],
    "evaluationPoints": [
      "SCD Type 2 tracks historical states using effective_start_date, effective_end_date, and is_current boolean flag",
      "System-versioned temporal tables in SQL Server/Postgres automatically record row history on updates and deletes",
      "Enables point-in-time historical queries: AS OF SYSTEM TIME"
    ],
    "followUpTopics": [
      "SCD Type 2",
      "Audit triggers"
    ]
  },
  {
    "id": "dbdev-024",
    "role": "Database Developer",
    "category": "Performance Tuning",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When is intentional database denormalization justified, and how do you maintain data consistency?",
    "expectedSkills": [
      "Database Design",
      "Performance"
    ],
    "evaluationPoints": [
      "Justified for read-heavy reporting where multi-table joins create severe latency bottlenecks",
      "Pre-aggregate summary counts and totals into parent tables",
      "Maintain consistency using application transactions, event listeners, or database triggers"
    ],
    "followUpTopics": [
      "Star schema",
      "Pre-computed aggregates"
    ]
  },
  {
    "id": "dbdev-025",
    "role": "Database Developer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do prepared statements and parameterized queries prevent SQL injection at the database protocol level?",
    "expectedSkills": [
      "Security",
      "SQL Injection"
    ],
    "evaluationPoints": [
      "Prepared statement separates SQL code structure from user parameter data",
      "Database engine compiles and optimizes the query template AST before binding parameters",
      "User input is treated strictly as literal scalar values, never executed as SQL code"
    ],
    "followUpTopics": [
      "Principle of least privilege",
      "Row-level security"
    ]
  },
  {
    "id": "dbdev-026",
    "role": "Database Developer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Row-Level Security (RLS) in PostgreSQL and how is it used in multi-tenant SaaS architectures?",
    "expectedSkills": [
      "PostgreSQL",
      "Security"
    ],
    "evaluationPoints": [
      "Enforces fine-grained row access policies directly inside the database engine",
      "Restricts SELECT, INSERT, UPDATE, DELETE rows based on current session user/tenant context",
      "Guarantees Tenant A cannot read Tenant B data even if application query forgets WHERE tenant_id clause"
    ],
    "followUpTopics": [
      "Multi-tenant architecture",
      "Postgres current_setting"
    ]
  },
  {
    "id": "dbdev-027",
    "role": "Database Developer",
    "category": "Search",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you implement full-text search in PostgreSQL using tsvector, tsquery, and GIN indexes?",
    "expectedSkills": [
      "PostgreSQL",
      "Full-Text Search"
    ],
    "evaluationPoints": [
      "to_tsvector tokenizes and stems text into lexemes with positions",
      "to_tsquery parses search query with boolean operators (&, |, !)",
      "GIN index on tsvector column provides lightning-fast sub-second search across millions of documents"
    ],
    "followUpTopics": [
      "Stemming and stop words",
      "ts_rank for search relevance"
    ]
  },
  {
    "id": "dbdev-028",
    "role": "Database Developer",
    "category": "Modern SQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When should you store data in a JSONB column in PostgreSQL vs creating structured relational tables?",
    "expectedSkills": [
      "JSONB",
      "PostgreSQL"
    ],
    "evaluationPoints": [
      "JSONB stores binary decomposed JSON with indexing support (GIN)",
      "Use for: semi-structured schema-less attributes, user custom fields, and third-party API payloads",
      "Use relational tables for: core domain entities, foreign key referential integrity, and frequently filtered/joined metrics"
    ],
    "followUpTopics": [
      "GIN index on JSONB",
      "JSON operators (->, ->>)"
    ]
  },
  {
    "id": "dbdev-029",
    "role": "Database Developer",
    "category": "Performance",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you benchmark database transaction throughput (TPS) and latency using pgbench or sysbench?",
    "expectedSkills": [
      "Performance",
      "Benchmarking"
    ],
    "evaluationPoints": [
      "Initialize test schema and scaling factor (pgbench -i -s 100)",
      "Run simulated concurrent client connections (pgbench -c 50 -j 4 -T 60)",
      "Measure Transactions Per Second (TPS), average latency, and connection scaling curves under read vs write workloads"
    ],
    "followUpTopics": [
      "TPS measurement",
      "Scaling factor"
    ]
  },
  {
    "id": "dbdev-030",
    "role": "Database Developer",
    "category": "NoSQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why are Graph Databases (Neo4j) superior to Relational SQL for deep hierarchical relationship traversals?",
    "expectedSkills": [
      "Graph Databases",
      "Architecture"
    ],
    "evaluationPoints": [
      "Relational databases require recursive CTEs or expensive multi-level self-joins (O(N^d) explosion)",
      "Graph databases use index-free adjacency: vertices hold direct physical pointers to adjacent vertices (O(1) pointer hop)",
      "Ideal for social networks, fraud rings, and dependency trees"
    ],
    "followUpTopics": [
      "Neo4j",
      "Cypher query language"
    ]
  },
  {
    "id": "dbdev-031",
    "role": "Database Developer",
    "category": "Performance Tuning",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Your primary database CPU is pegged at 100%. Walk me through your immediate triage process.",
    "expectedSkills": [
      "Troubleshooting",
      "PostgreSQL"
    ],
    "evaluationPoints": [
      "Query pg_stat_activity to find currently running long queries and lock waits",
      "Terminate or cancel runaway long-running queries (pg_cancel_backend)",
      "Inspect slow query log / pg_stat_statements to identify top queries by total execution time and missing indexes"
    ],
    "followUpTopics": [
      "pg_stat_statements",
      "Canceling runaway queries"
    ]
  },
  {
    "id": "dbdev-032",
    "role": "Database Developer",
    "category": "Replication",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "An asynchronous read replica is lagging by 30 minutes. What causes replication lag and how do you fix it?",
    "expectedSkills": [
      "Replication",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Causes: massive batch write operations on primary, slow disk I/O on replica, network bandwidth saturation, long-running read query blocking WAL replay on replica",
      "Fix: break bulk writes into small chunks, increase replica hardware resources, tune max_standby_streaming_delay"
    ],
    "followUpTopics": [
      "WAL streaming",
      "Standby conflict delay"
    ]
  },
  {
    "id": "dbdev-033",
    "role": "Database Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a complex database schema you designed. How did you normalize and index it for performance?",
    "expectedSkills": [
      "Database Design",
      "Communication"
    ],
    "evaluationPoints": [
      "Business domain and relationship modeling (1-to-many, many-to-many)",
      "Normalization decisions and intentional denormalization points",
      "Indexing strategy, constraint design, and scalability results"
    ],
    "followUpTopics": [
      "Foreign key modeling",
      "Lessons learned"
    ]
  },
  {
    "id": "dbdev-034",
    "role": "Database Developer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you educate software developers to write clean, performant SQL and avoid N+1 queries?",
    "expectedSkills": [
      "Collaboration",
      "Mentorship"
    ],
    "evaluationPoints": [
      "Conduct SQL code reviews and share EXPLAIN query execution plan insights",
      "Provide reusable DTO projection patterns and repository guidelines",
      "Set up slow query alerts and automated PR query linting in CI"
    ],
    "followUpTopics": [
      "Code reviews",
      "SQL best practices"
    ]
  },
  {
    "id": "dbdev-035",
    "role": "Database Developer",
    "category": "Modern Trends",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is NewSQL (e.g. CockroachDB, Google Spanner) and how does it combine ACID with horizontal scale?",
    "expectedSkills": [
      "NewSQL",
      "Distributed Databases"
    ],
    "evaluationPoints": [
      "Combines strict ACID transactional consistency of traditional RDBMS with horizontal scaling of NoSQL",
      "Uses distributed consensus algorithms (Raft, Paxos) and atomic synchronized clocks (TrueTime)",
      "Allows seamless sharding and multi-region active-active deployment without manual sharding logic"
    ],
    "followUpTopics": [
      "Raft consensus",
      "Google Spanner TrueTime"
    ]
  }
];
