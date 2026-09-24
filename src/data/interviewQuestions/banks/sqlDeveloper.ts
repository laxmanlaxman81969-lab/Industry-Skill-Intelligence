import { RoleQuestion } from '../types';

export const SQL_DEVELOPER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "sqldev-001",
    "role": "SQL Developer",
    "category": "Core SQL",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the logical processing order of clauses in a SQL SELECT query?",
    "expectedSkills": [
      "SQL Internals"
    ],
    "evaluationPoints": [
      "FROM / JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT / OFFSET",
      "Explains why aliases defined in SELECT cannot be used in WHERE",
      "Explains why HAVING evaluates after GROUP BY"
    ],
    "followUpTopics": [
      "SELECT aliasing",
      "Evaluation phases"
    ]
  },
  {
    "id": "sqldev-002",
    "role": "SQL Developer",
    "category": "Joins",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF joins with use cases.",
    "expectedSkills": [
      "SQL Joins"
    ],
    "evaluationPoints": [
      "INNER returns rows with matching keys in both tables",
      "LEFT returns all rows from left plus matches from right (NULL if none)",
      "FULL OUTER returns all rows from both tables, filling unmatched with NULL",
      "CROSS produces Cartesian product (N * M)",
      "SELF join joins table with itself (e.g. employee-manager hierarchy)"
    ],
    "followUpTopics": [
      "Anti-joins",
      "Natural joins"
    ]
  },
  {
    "id": "sqldev-003",
    "role": "SQL Developer",
    "category": "Advanced SQL",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write two different SQL queries to find the Nth highest salary in an Employee table.",
    "expectedSkills": [
      "SQL",
      "Problem Solving"
    ],
    "evaluationPoints": [
      "Method 1: DENSE_RANK() OVER (ORDER BY salary DESC) in CTE, filter WHERE rank = N",
      "Method 2: SELECT DISTINCT salary ORDER BY salary DESC LIMIT 1 OFFSET N-1",
      "Handling ties gracefully using DENSE_RANK vs OFFSET"
    ],
    "followUpTopics": [
      "Handling ties",
      "Subquery approach"
    ]
  },
  {
    "id": "sqldev-004",
    "role": "SQL Developer",
    "category": "Window Functions",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do LEAD() and LAG() window functions work? Write a query to find month-over-month revenue growth.",
    "expectedSkills": [
      "SQL",
      "Window Functions"
    ],
    "evaluationPoints": [
      "LAG(metric, 1) accesses previous row's value within window partition",
      "LEAD accesses next row's value",
      "MoM calculation: (current_revenue - LAG(revenue, 1) OVER (ORDER BY month)) / LAG(revenue, 1) OVER (ORDER BY month) * 100"
    ],
    "followUpTopics": [
      "PARTITION BY",
      "Handling first row NULLs"
    ]
  },
  {
    "id": "sqldev-005",
    "role": "SQL Developer",
    "category": "Window Functions",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write a query to compute a cumulative running total of deposits per user ordered by transaction date.",
    "expectedSkills": [
      "SQL",
      "Window Functions"
    ],
    "evaluationPoints": [
      "SUM(amount) OVER (PARTITION BY user_id ORDER BY transaction_date ROWS UNBOUNDED PRECEDING)",
      "Contrast between ROWS UNBOUNDED PRECEDING and default RANGE window framing",
      "Handling same-day multiple transactions"
    ],
    "followUpTopics": [
      "Window frames",
      "RANGE vs ROWS"
    ]
  },
  {
    "id": "sqldev-006",
    "role": "SQL Developer",
    "category": "CTEs",
    "difficulty": "Advanced",
    "format": "practical",
    "question": "Write a recursive CTE to traverse an employee hierarchy and display all reports under a manager.",
    "expectedSkills": [
      "Recursive CTEs",
      "Hierarchies"
    ],
    "evaluationPoints": [
      "Anchor member selects root manager",
      "UNION ALL links recursive member joining Employee table to CTE on manager_id",
      "Termination condition when no further subordinate rows match"
    ],
    "followUpTopics": [
      "Recursion depth limit",
      "Organizational charts"
    ]
  },
  {
    "id": "sqldev-007",
    "role": "SQL Developer",
    "category": "Functions",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the difference between COALESCE, NULLIF, and ISNULL/NVL in SQL.",
    "expectedSkills": [
      "SQL Functions"
    ],
    "evaluationPoints": [
      "COALESCE(val1, val2, ...) returns the first non-NULL expression in list (ANSI standard)",
      "NULLIF(expr1, expr2) returns NULL if expr1 equals expr2; otherwise returns expr1 (useful for preventing division by zero: amount / NULLIF(qty, 0))",
      "ISNULL (SQL Server) / NVL (Oracle) are proprietary two-argument alternatives to COALESCE"
    ],
    "followUpTopics": [
      "Division by zero prevention",
      "Three-valued logic"
    ]
  },
  {
    "id": "sqldev-008",
    "role": "SQL Developer",
    "category": "Core SQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain SQL three-valued logic (TRUE, FALSE, UNKNOWN). Why does 'WHERE col != 5' exclude NULL rows?",
    "expectedSkills": [
      "SQL Internals",
      "NULLs"
    ],
    "evaluationPoints": [
      "Any comparison with NULL (e.g. col = NULL or col != 5) evaluates to UNKNOWN",
      "WHERE clause only returns rows where condition evaluates strictly to TRUE",
      "Must use IS NULL or IS NOT NULL explicitly"
    ],
    "followUpTopics": [
      "NULL in IN clauses",
      "NOT IN with NULL pitfall"
    ]
  },
  {
    "id": "sqldev-009",
    "role": "SQL Developer",
    "category": "Core SQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why does 'WHERE id NOT IN (SELECT foreign_id FROM table)' return 0 rows if any foreign_id is NULL?",
    "expectedSkills": [
      "SQL Pitfalls"
    ],
    "evaluationPoints": [
      "NOT IN evaluates to: id != 1 AND id != NULL ...",
      "Since id != NULL evaluates to UNKNOWN, the entire AND chain evaluates to UNKNOWN/FALSE",
      "Fix: Use NOT EXISTS or filter WHERE foreign_id IS NOT NULL in subquery"
    ],
    "followUpTopics": [
      "NOT EXISTS vs NOT IN",
      "Anti-joins"
    ]
  },
  {
    "id": "sqldev-010",
    "role": "SQL Developer",
    "category": "Aggregation",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What do ROLLUP and CUBE extensions to GROUP BY do in SQL reports?",
    "expectedSkills": [
      "Aggregation",
      "Reporting"
    ],
    "evaluationPoints": [
      "ROLLUP generates hierarchical subtotal aggregates from right to left plus grand total",
      "CUBE generates all possible subtotal combinations across all specified dimensions (2^N groupings)",
      "Used for dimensional cross-tab reporting without multiple UNION ALL queries"
    ],
    "followUpTopics": [
      "GROUPING SETS",
      "GROUPING() function"
    ]
  },
  {
    "id": "sqldev-011",
    "role": "SQL Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When is EXISTS faster than IN in SQL and how does query execution differ?",
    "expectedSkills": [
      "SQL Optimization"
    ],
    "evaluationPoints": [
      "EXISTS stops evaluating as soon as first matching row is found (short-circuit boolean)",
      "IN historically evaluated and materialized the entire subquery list before checking membership",
      "Modern query optimizers often rewrite IN as semi-joins, but EXISTS is safer with NULLs"
    ],
    "followUpTopics": [
      "Correlated subqueries",
      "Semi-joins"
    ]
  },
  {
    "id": "sqldev-012",
    "role": "SQL Developer",
    "category": "Data Manipulation",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write a query to delete all duplicate rows in a table while keeping only the row with the lowest ID.",
    "expectedSkills": [
      "SQL",
      "Data Manipulation"
    ],
    "evaluationPoints": [
      "DELETE FROM table WHERE id NOT IN (SELECT MIN(id) FROM table GROUP BY email)",
      "Or using CTE with ROW_NUMBER(): WITH cte AS (SELECT id, ROW_NUMBER() OVER(PARTITION BY email ORDER BY id) as rn FROM table) DELETE FROM cte WHERE rn > 1",
      "Performance implications on large tables"
    ],
    "followUpTopics": [
      "Deduplication",
      "CTEs"
    ]
  },
  {
    "id": "sqldev-013",
    "role": "SQL Developer",
    "category": "Aggregation",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you pivot row data into columns using conditional aggregation (SUM with CASE WHEN)?",
    "expectedSkills": [
      "SQL",
      "Pivoting"
    ],
    "evaluationPoints": [
      "SELECT year, SUM(CASE WHEN quarter=1 THEN sales ELSE 0 END) as Q1, SUM(CASE WHEN quarter=2 THEN sales ELSE 0 END) as Q2 ... GROUP BY year",
      "Clean ANSI standard method for cross-tabulation without proprietary PIVOT keywords",
      "Handles dynamic condition filtering"
    ],
    "followUpTopics": [
      "PIVOT operator",
      "Cross-tabulation"
    ]
  },
  {
    "id": "sqldev-014",
    "role": "SQL Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why is 'WHERE name LIKE '%smith%' slow, and how do you optimize wildcard text search in SQL?",
    "expectedSkills": [
      "SQL Optimization",
      "Indexing"
    ],
    "evaluationPoints": [
      "Leading wildcard ('%smith%') prevents B-Tree index seek, forcing a full table scan",
      "Trailing wildcard ('smith%') can use standard B-Tree index seek",
      "To optimize leading/contains searches: use Full-Text Search (tsvector/GIN) or trigram indexes (pg_trgm in Postgres)"
    ],
    "followUpTopics": [
      "Trigram indexes",
      "Full-text search"
    ]
  },
  {
    "id": "sqldev-015",
    "role": "SQL Developer",
    "category": "Date Handling",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you handle timestamps, timezones (UTC), and date truncation in SQL queries?",
    "expectedSkills": [
      "SQL Dates"
    ],
    "evaluationPoints": [
      "Always store timestamps in UTC (TIMESTAMP WITH TIME ZONE)",
      "Convert to user timezone at query time (AT TIME ZONE 'America/New_York')",
      "Use DATE_TRUNC('month', created_at) to bucket timestamps into daily/monthly periods for aggregation"
    ],
    "followUpTopics": [
      "DATE_TRUNC",
      "EXTRACT function"
    ]
  },
  {
    "id": "sqldev-016",
    "role": "SQL Developer",
    "category": "Functions",
    "difficulty": "Easy",
    "format": "practical",
    "question": "Explain common SQL string functions: SUBSTRING, CONCAT, TRIM, REPLACE, and COALESCE.",
    "expectedSkills": [
      "SQL Strings"
    ],
    "evaluationPoints": [
      "CONCAT / || operator joins strings together",
      "SUBSTRING / SUBSTR extracts portion based on offset and length",
      "TRIM removes leading/trailing whitespace",
      "REPLACE substitutes target substring with replacement"
    ],
    "followUpTopics": [
      "REGEXP_REPLACE",
      "SPLIT_PART"
    ]
  },
  {
    "id": "sqldev-017",
    "role": "SQL Developer",
    "category": "Transactions",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a SAVEPOINT in SQL transactions and how does it allow partial rollbacks?",
    "expectedSkills": [
      "Transactions"
    ],
    "evaluationPoints": [
      "SAVEPOINT savepoint_name creates checkpoint within an active transaction",
      "ROLLBACK TO SAVEPOINT savepoint_name undoes changes made after the savepoint while keeping earlier work intact",
      "Allows error recovery within complex stored procedures without aborting entire transaction"
    ],
    "followUpTopics": [
      "Nested transactions",
      "COMMIT"
    ]
  },
  {
    "id": "sqldev-018",
    "role": "SQL Developer",
    "category": "Data Manipulation",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does the SQL MERGE statement perform an atomic UPSERT (insert if not exists, update if exists)?",
    "expectedSkills": [
      "SQL MERGE",
      "UPSERT"
    ],
    "evaluationPoints": [
      "MERGE INTO target USING source ON match_condition",
      "WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...",
      "PostgreSQL alternative: INSERT INTO table ... ON CONFLICT (id) DO UPDATE SET ..."
    ],
    "followUpTopics": [
      "ON CONFLICT DO UPDATE",
      "Concurrency and race conditions"
    ]
  },
  {
    "id": "sqldev-019",
    "role": "SQL Developer",
    "category": "Window Functions",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is the critical difference between ROWS and RANGE window frames in SQL?",
    "expectedSkills": [
      "Window Functions"
    ],
    "evaluationPoints": [
      "ROWS treats duplicates as individual distinct physical lines (e.g. ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)",
      "RANGE groups duplicate peer values together based on ORDER BY expression value",
      "Default frame when ORDER BY is present is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which can cause unexpected results with duplicate order keys"
    ],
    "followUpTopics": [
      "UNBOUNDED PRECEDING",
      "Window framing"
    ]
  },
  {
    "id": "sqldev-020",
    "role": "SQL Developer",
    "category": "Advanced SQL",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is a User-Defined Aggregate (UDA) function in PostgreSQL and how is it defined?",
    "expectedSkills": [
      "PostgreSQL",
      "UDA"
    ],
    "evaluationPoints": [
      "Requires a state transition function (executes for each row updating state)",
      "State value type (state data structure)",
      "Optional final function (transforms state to return value)",
      "Example: custom geometric median or string accumulator"
    ],
    "followUpTopics": [
      "CREATE AGGREGATE",
      "State transition function"
    ]
  },
  {
    "id": "sqldev-021",
    "role": "SQL Developer",
    "category": "Programmability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Dynamic SQL, how is it executed, and what security precautions must be taken?",
    "expectedSkills": [
      "Stored Procedures",
      "Security"
    ],
    "evaluationPoints": [
      "Constructing SQL query string dynamically at runtime and executing with EXEC / EXECUTE format()",
      "Used for dynamic column filtering and table partitioning",
      "Vulnerable to SQL injection if parameters are concatenated directly; must use format() with %I for identifiers and %L for literals or parameterized sp_executesql"
    ],
    "followUpTopics": [
      "EXECUTE statement",
      "format() in PostgreSQL"
    ]
  },
  {
    "id": "sqldev-022",
    "role": "SQL Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do indexes optimize ORDER BY queries, and what is the cost of sorting in memory vs disk (tempdb)?",
    "expectedSkills": [
      "SQL Optimization",
      "Sorting"
    ],
    "evaluationPoints": [
      "An index with matching sort order (INDEX on col_a ASC, col_b DESC) provides pre-sorted rows, eliminating sort step",
      "Without index, database must perform sort: in-memory (quicksort) or external merge sort on disk if work_mem / tempdb exceeds memory",
      "Disk-based external sort causes massive I/O slowdown"
    ],
    "followUpTopics": [
      "work_mem tuning",
      "Sort spills"
    ]
  },
  {
    "id": "sqldev-023",
    "role": "SQL Developer",
    "category": "Advanced SQL",
    "difficulty": "Advanced",
    "format": "practical",
    "question": "Explain the classic 'Gaps and Islands' SQL problem and how to group contiguous dates using window functions.",
    "expectedSkills": [
      "SQL",
      "Window Functions"
    ],
    "evaluationPoints": [
      "Islands: contiguous sequences of values/dates; Gaps: missing values in sequence",
      "Solution: calculate difference between date and ROW_NUMBER() over date; the difference is constant for contiguous sequences (island group ID)",
      "GROUP BY island ID with MIN(date) and MAX(date) to identify island start and end"
    ],
    "followUpTopics": [
      "Gaps and islands",
      "ROW_NUMBER trick"
    ]
  },
  {
    "id": "sqldev-024",
    "role": "SQL Developer",
    "category": "Modern SQL",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you query and filter nested JSON fields inside a SQL table in PostgreSQL or MySQL?",
    "expectedSkills": [
      "JSON",
      "Modern SQL"
    ],
    "evaluationPoints": [
      "PostgreSQL: data->'user'->>'email' extracts text value; jsonb_path_query() evaluates JSONPath expressions",
      "MySQL: JSON_EXTRACT(data, '$.user.email') or ->> operator",
      "Filtering: WHERE data @> '{\"status\": \"active\"}' utilizing GIN index"
    ],
    "followUpTopics": [
      "JSON operators",
      "JSON_TABLE"
    ]
  },
  {
    "id": "sqldev-025",
    "role": "SQL Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why does implicit data type conversion in a WHERE clause cause performance bottlenecks?",
    "expectedSkills": [
      "Optimization",
      "Data Types"
    ],
    "evaluationPoints": [
      "Comparing VARCHAR column to integer parameter causes database to apply conversion function to every row in table (e.g. CAST(col AS INT))",
      "Applying function on indexed column invalidates B-Tree index usage, forcing a full table scan",
      "Always match parameter data types to column schema types"
    ],
    "followUpTopics": [
      "SARGable queries",
      "Type casting"
    ]
  },
  {
    "id": "sqldev-026",
    "role": "SQL Developer",
    "category": "Programmability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Temporary Tables (#temp) vs Table Variables / In-Memory tables in SQL.",
    "expectedSkills": [
      "Temporary Tables"
    ],
    "evaluationPoints": [
      "Temporary tables (#table) persist across transaction scope in session, support indexes, constraints, and cost-based statistics",
      "Table variables are scoped to batch/stored procedure and traditionally lack statistics, leading to bad execution plans on large datasets",
      "Use temporary tables for large datasets (>1000 rows); table variables for small lookup sets"
    ],
    "followUpTopics": [
      "Global temp tables",
      "Session scope"
    ]
  },
  {
    "id": "sqldev-027",
    "role": "SQL Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What does 'SARGable' (Search Argument Able) mean in SQL query writing? Give examples.",
    "expectedSkills": [
      "SQL Optimization"
    ],
    "evaluationPoints": [
      "A query is SARGable if the optimizer can use an index to seek data rather than scanning entire table",
      "Non-SARGable: WHERE YEAR(order_date) = 2024 (function on column disables index)",
      "SARGable refactor: WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'"
    ],
    "followUpTopics": [
      "SARGable",
      "Index seek vs scan"
    ]
  },
  {
    "id": "sqldev-028",
    "role": "SQL Developer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Rewrite an inefficient deep pagination query 'SELECT * FROM logs ORDER BY id LIMIT 20 OFFSET 500000' using Keyset Seek.",
    "expectedSkills": [
      "Pagination",
      "Optimization"
    ],
    "evaluationPoints": [
      "Offset 500,000 scans and discards 500,000 index rows, causing high disk reads",
      "Keyset Seek refactor: WHERE id > last_seen_id ORDER BY id LIMIT 20",
      "Direct B-Tree index seek to target ID in sub-millisecond time regardless of page depth"
    ],
    "followUpTopics": [
      "Keyset pagination",
      "Deep pagination"
    ]
  },
  {
    "id": "sqldev-029",
    "role": "SQL Developer",
    "category": "Data Integrity",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do CHECK constraints enforce domain validation rules at the table level in SQL?",
    "expectedSkills": [
      "Constraints",
      "Data Integrity"
    ],
    "evaluationPoints": [
      "CHECK (price > 0 AND discount_price <= price)",
      "Enforced by database on every INSERT and UPDATE; rejects invalid data with constraint violation",
      "Ensures data validity regardless of which application or script writes to database"
    ],
    "followUpTopics": [
      "Domain constraints",
      "Constraint violations"
    ]
  },
  {
    "id": "sqldev-030",
    "role": "SQL Developer",
    "category": "Aggregation",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you UNPIVOT columns (Q1, Q2, Q3, Q4) back into normalized row format in standard SQL?",
    "expectedSkills": [
      "Pivoting",
      "Normalization"
    ],
    "evaluationPoints": [
      "Using CROSS JOIN with VALUES: SELECT year, qtr, amount FROM sales CROSS JOIN LATERAL (VALUES ('Q1', q1), ('Q2', q2), ('Q3', q3), ('Q4', q4)) AS q(qtr, amount)",
      "Or using UNION ALL across each quarterly column",
      "Normalizes denormalized reporting tables into clean relational form"
    ],
    "followUpTopics": [
      "CROSS JOIN LATERAL",
      "UNPIVOT"
    ]
  },
  {
    "id": "sqldev-031",
    "role": "SQL Developer",
    "category": "Performance Tuning",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write a query in PostgreSQL or SQL Server to find the top 5 longest running active queries.",
    "expectedSkills": [
      "Performance",
      "Diagnostics"
    ],
    "evaluationPoints": [
      "PostgreSQL: SELECT pid, now() - query_start AS duration, query, state FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC LIMIT 5",
      "Allows DBA to identify stuck locks, runaway batch jobs, or unindexed queries",
      "Can terminate offending query using pg_cancel_backend(pid) or pg_terminate_backend(pid)"
    ],
    "followUpTopics": [
      "pg_stat_activity",
      "Query termination"
    ]
  },
  {
    "id": "sqldev-032",
    "role": "SQL Developer",
    "category": "Core SQL",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is SQL Collation and how does it affect string comparisons, sorting, and index usage?",
    "expectedSkills": [
      "Collation",
      "Strings"
    ],
    "evaluationPoints": [
      "Collation defines rules for sorting and comparing string characters (case-sensitive vs case-insensitive, accent-sensitive)",
      "Latin1_General_CI_AS treats 'apple' and 'Apple' as equal; Latin1_General_CS_AS treats them as distinct",
      "Changing collation in query on-the-fly disables standard index seeks"
    ],
    "followUpTopics": [
      "Case sensitivity",
      "UTF-8 collation"
    ]
  },
  {
    "id": "sqldev-033",
    "role": "SQL Developer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an analytical or transactional SQL query you refactored that had dramatic performance improvements.",
    "expectedSkills": [
      "Project Experience",
      "Optimization"
    ],
    "evaluationPoints": [
      "Initial query bottleneck and baseline execution time (e.g. 45 seconds down to 200ms)",
      "Diagnostic analysis using execution plans (identifying missing index, full scan, or N+1 subquery)",
      "Refactoring technique applied and business impact"
    ],
    "followUpTopics": [
      "EXPLAIN before and after",
      "Business impact"
    ]
  },
  {
    "id": "sqldev-034",
    "role": "SQL Developer",
    "category": "Code Quality",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you maintain readable, testable, and version-controlled SQL code across an engineering team?",
    "expectedSkills": [
      "Best Practices",
      "Collaboration"
    ],
    "evaluationPoints": [
      "Formatting standards (uppercase keywords, consistent indentation, descriptive table aliases)",
      "Version-controlling all DDL and stored procedures in Git repository with migration tools (Flyway/Liquibase)",
      "Writing modular CTEs with clear commenting on business logic assumptions"
    ],
    "followUpTopics": [
      "SQL formatting",
      "Version control"
    ]
  },
  {
    "id": "sqldev-035",
    "role": "SQL Developer",
    "category": "Modern Trends",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why has in-process analytical SQL (DuckDB) and Distributed SQL become prominent in modern data stacks?",
    "expectedSkills": [
      "DuckDB",
      "Modern SQL"
    ],
    "evaluationPoints": [
      "DuckDB provides columnar, vectorized SQL engine embedded directly in application memory without server setup (SQLite for analytics)",
      "Vectorized execution processes data in CPU SIMD batches, delivering 10-100x speedups on analytical OLAP queries",
      "Bridges gap between Python/Pandas dataframes and large-scale SQL queries"
    ],
    "followUpTopics": [
      "Vectorized query execution",
      "Columnar vs row stores"
    ]
  }
];
