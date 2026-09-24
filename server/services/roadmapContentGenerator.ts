import { RoadmapLesson } from '../roadmapTypes';

interface StageConfig {
  suffix: string;
  stageName: 'UNDERSTAND' | 'PRACTICE' | 'BUILD' | 'DEBUG AND INTERVIEW';
  estimatedMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const STAGES: StageConfig[] = [
  { suffix: 'Core Concepts & Syntax', stageName: 'UNDERSTAND', estimatedMinutes: 25, difficulty: 'Beginner' },
  { suffix: 'Hands-on Practice', stageName: 'PRACTICE', estimatedMinutes: 35, difficulty: 'Intermediate' },
  { suffix: 'Real-World Application', stageName: 'BUILD', estimatedMinutes: 45, difficulty: 'Intermediate' },
  { suffix: 'Debugging & Interview Mastery', stageName: 'DEBUG AND INTERVIEW', estimatedMinutes: 30, difficulty: 'Advanced' },
];

/**
 * Returns the correct language name and file extension for a technology slug.
 */
export function getLanguageForTech(tech: string): { language: string; ext: string } {
  switch (tech.toLowerCase()) {
    case 'csharp':
    case 'dotnet':
      return { language: 'C#', ext: 'cs' };
    case 'cpp':
      return { language: 'C++', ext: 'cpp' };
    case 'c':
      return { language: 'C', ext: 'c' };
    case 'python':
    case 'django':
    case 'data-science':
    case 'machine-learning':
    case 'generative-ai':
      return { language: 'Python', ext: 'py' };
    case 'javascript':
    case 'node-js':
    case 'express-js':
      return { language: 'JavaScript', ext: 'js' };
    case 'typescript':
      return { language: 'TypeScript', ext: 'ts' };
    case 'react':
      return { language: 'TSX', ext: 'tsx' };
    case 'angular':
      return { language: 'TypeScript (Angular)', ext: 'ts' };
    case 'vue':
      return { language: 'Vue', ext: 'vue' };
    case 'sql':
    case 'mysql':
    case 'postgresql':
      return { language: 'SQL', ext: 'sql' };
    case 'html':
      return { language: 'HTML', ext: 'html' };
    case 'css':
      return { language: 'CSS', ext: 'css' };
    case 'mongodb':
      return { language: 'MongoDB Query', ext: 'js' };
    case 'redis':
      return { language: 'Redis CLI', ext: 'redis' };
    case 'docker':
      return { language: 'Dockerfile', ext: 'dockerfile' };
    case 'kubernetes':
      return { language: 'Kubernetes YAML', ext: 'yaml' };
    case 'git':
    case 'github':
      return { language: 'Git Bash', ext: 'sh' };
    case 'aws':
    case 'azure':
      return { language: 'Cloud CLI', ext: 'sh' };
    case 'dsa':
      return { language: 'Java / Python', ext: 'java' };
    case 'java':
    case 'spring-boot':
    case 'spring':
    default:
      return { language: 'Java', ext: 'java' };
  }
}

/**
 * Generates language-accurate code snippets for each stage of a topic.
 */
function generateCodeForTopicAndStage(
  tech: string,
  topic: string,
  stage: 'UNDERSTAND' | 'PRACTICE' | 'BUILD' | 'DEBUG AND INTERVIEW'
): { code: string; syntax?: string; output: string; explanation: string } {
  const t = tech.toLowerCase();
  const cleanTopic = topic.trim();
  const safeIdentifier = cleanTopic.replace(/[^a-zA-Z0-9]/g, '');

  // ─────────────────────────────────────────────────────────
  // 1. C# & .NET
  // ─────────────────────────────────────────────────────────
  if (t === 'csharp' || t === 'dotnet') {
    if (stage === 'UNDERSTAND') {
      return {
        syntax: `// C# Syntax Definition for ${cleanTopic}\nnamespace EnterpriseApp.${safeIdentifier};\n\npublic class ${safeIdentifier}Demo\n{\n    // Declaration & syntax rules for ${cleanTopic}\n    public static void Execute()\n    {\n        // ...\n    }\n}`,
        code: `// ==========================================\n// C# 12 / .NET 8 - ${cleanTopic}: Syntax & Fundamentals\n// ==========================================\nusing System;\nusing System.Collections.Generic;\n\nnamespace LearningPlatform.Basics;\n\npublic class Program\n{\n    public static void Main(string[] args)\n    {\n        Console.WriteLine("=== Exploring ${cleanTopic} in C# ===");\n\n        // 1. Concept demonstration for ${cleanTopic}\n        string featureName = "${cleanTopic}";\n        int version = 8;\n        bool isProductionReady = true;\n\n        Console.WriteLine($"Feature: {featureName} (v{version})");\n        Console.WriteLine($"Status: {(isProductionReady ? "Active" : "Draft")}");\n\n        // 2. Fundamental rule execution\n        var summary = $"C# strongly-typed execution of {featureName}";\n        Console.WriteLine($"Summary: {summary}");\n    }\n}`,
        output: `=== Exploring ${cleanTopic} in C# ===\nFeature: ${cleanTopic} (v8)\nStatus: Active\nSummary: C# strongly-typed execution of ${cleanTopic}`,
        explanation: `This C# program declares a typed entry point and demonstrates how ${cleanTopic} adheres to .NET's type safety, scope rules, and string interpolation standards.`
      };
    } else if (stage === 'PRACTICE') {
      return {
        code: `// ==========================================\n// C# Practice Walkthrough: ${cleanTopic}\n// ==========================================\nusing System;\nusing System.Linq;\nusing System.Collections.Generic;\n\npublic class ${safeIdentifier}Practice\n{\n    public record ItemRecord(int Id, string Name, double Value);\n\n    public static void Main()\n    {\n        Console.WriteLine("[Practice] Validating ${cleanTopic} input processing...");\n\n        var records = new List<ItemRecord>\n        {\n            new(1, "Alpha Transaction", 150.50),\n            new(2, "Beta Service", 320.00),\n            new(3, "Gamma Metric", 89.20)\n        };\n\n        // Processing data with ${cleanTopic}\n        foreach (var item in records.Where(r => r.Value > 100))\n        {\n            Console.WriteLine($"-> Processed: {item.Name} | Value: \${item.Value:F2}");\n        }\n\n        double total = records.Sum(r => r.Value);\n        Console.WriteLine($"-> Batch Total: \${total:F2}");\n    }\n}`,
        output: `[Practice] Validating ${cleanTopic} input processing...\n-> Processed: Alpha Transaction | Value: $150.50\n-> Processed: Beta Service | Value: $320.00\n-> Batch Total: $559.70`,
        explanation: `Demonstrates practical logic with immutable records, LINQ filtering, and formatted output applying ${cleanTopic} in an operational context.`
      };
    } else if (stage === 'BUILD') {
      return {
        code: `// ==========================================\n// Enterprise Architecture: ${cleanTopic} in ASP.NET Core\n// ==========================================\nusing System;\nusing System.Threading.Tasks;\nusing Microsoft.Extensions.Logging;\n\npublic interface I${safeIdentifier}Service\n{\n    Task<string> ProcessTransactionAsync(string accountId, decimal amount);\n}\n\npublic class ${safeIdentifier}Service : I${safeIdentifier}Service\n{\n    private readonly ILogger<${safeIdentifier}Service> _logger;\n\n    public ${safeIdentifier}Service(ILogger<${safeIdentifier}Service> logger)\n    {\n        _logger = logger ?? throw new ArgumentNullException(nameof(logger));\n    }\n\n    public async Task<string> ProcessTransactionAsync(string accountId, decimal amount)\n    {\n        if (string.IsNullOrWhiteSpace(accountId))\n            throw new ArgumentException("Account ID cannot be empty", nameof(accountId));\n\n        if (amount <= 0)\n            throw new ArgumentOutOfRangeException(nameof(amount), "Amount must be positive");\n\n        _logger.LogInformation("Processing {Topic} operation for account {Account}", "${cleanTopic}", accountId);\n        await Task.Delay(10); // Simulated I/O\n\n        return $"TXN-{Guid.NewGuid().ToString()[..8].ToUpper()} : \${amount} successfully applied.";\n    }\n}`,
        output: `[Information] Processing ${cleanTopic} operation for account ACC-9842\nResult: TXN-B7A28C1F : $450.00 successfully applied.`,
        explanation: `Production implementation utilizing dependency injection, asynchronous tasks, robust argument validation, and structured logging in .NET.`
      };
    } else {
      return {
        code: `// ==========================================\n// Debugging & Best Practices: ${cleanTopic}\n// ==========================================\nusing System;\n\npublic class ${safeIdentifier}Debugger\n{\n    public static void Main()\n    {\n        // COMMON BUG: NullReference or Unhandled Exception in ${cleanTopic}\n        string? userInput = null;\n\n        // SAFE HANDLING:\n        if (string.IsNullOrWhiteSpace(userInput))\n        {\n            Console.WriteLine("[Handled]: Detected null or empty input safely without NullReferenceException.");\n            userInput = "DefaultSafeValue";\n        }\n\n        Console.WriteLine($"[Verified]: Executing safely with '{userInput}'.");\n    }\n}`,
        output: `[Handled]: Detected null or empty input safely without NullReferenceException.\n[Verified]: Executing safely with 'DefaultSafeValue'.`,
        explanation: `Demonstrates C# nullable reference types, safe string guards, and exception handling best practices.`
      };
    }
  }

  // ─────────────────────────────────────────────────────────
  // 2. Python (Python, Django, Data Science, ML, GenAI)
  // ─────────────────────────────────────────────────────────
  if (t === 'python' || t === 'django' || t === 'data-science' || t === 'machine-learning' || t === 'generative-ai') {
    if (stage === 'UNDERSTAND') {
      return {
        syntax: `# Python Syntax Definition for ${cleanTopic}\ndef ${safeIdentifier.toLowerCase()}_example(data: list) -> dict:\n    """Applies ${cleanTopic} rules to input data."""\n    return {item: len(item) for item in data}`,
        code: `# ==========================================\n# Python 3.12 - ${cleanTopic}: Syntax & Core Model\n# ==========================================\nfrom typing import List, Dict\n\ndef demonstrate_${safeIdentifier.toLowerCase()}() -> None:\n    print("=== Exploring ${cleanTopic} in Python ===")\n    \n    # 1. Fundamental concept representation\n    topic_name: str = "${cleanTopic}"\n    items: List[str] = ["alpha", "beta", "gamma"]\n    \n    # Pythonic comprehension & expression\n    results: Dict[str, int] = {item: len(item) * 10 for item in items}\n    \n    print(f"Topic: {topic_name}")\n    print(f"Processed Results: {results}")\n\nif __name__ == "__main__":\n    demonstrate_${safeIdentifier.toLowerCase()}()`,
        output: `=== Exploring ${cleanTopic} in Python ===\nTopic: ${cleanTopic}\nProcessed Results: {'alpha': 50, 'beta': 40, 'gamma': 50}`,
        explanation: `Demonstrates Python syntax, type hinting, dictionary comprehensions, and PEP 8 naming standards for ${cleanTopic}.`
      };
    } else if (stage === 'PRACTICE') {
      return {
        code: `# ==========================================\n# Python Practice Walkthrough: ${cleanTopic}\n# ==========================================\ndef process_${safeIdentifier.toLowerCase()}_batch(records: list) -> dict:\n    valid_count = 0\n    total_score = 0\n    \n    for idx, record in enumerate(records, start=1):\n        if isinstance(record, dict) and "score" in record:\n            score = record["score"]\n            if 0 <= score <= 100:\n                valid_count += 1\n                total_score += score\n                print(f"  [Item {idx}] Valid: {record.get('name', 'Unknown')} -> {score}")\n    \n    avg = round(total_score / valid_count, 2) if valid_count else 0.0\n    return {"valid_count": valid_count, "average_score": avg}\n\nsample_data = [\n    {"name": "Alice", "score": 92},\n    {"name": "Bob", "score": 85},\n    {"name": "Invalid", "score": -5}  # Out of range\n]\n\nstats = process_${safeIdentifier.toLowerCase()}_batch(sample_data)\nprint(f"Batch Summary: {stats}")`,
        output: `  [Item 1] Valid: Alice -> 92\n  [Item 2] Valid: Bob -> 85\nBatch Summary: {'valid_count': 2, 'average_score': 88.5}`,
        explanation: `Demonstrates practical validation, dictionary extraction, enumeration, and defensive programming in Python.`
      };
    } else if (stage === 'BUILD') {
      return {
        code: `# ==========================================\n# Production Architecture: ${cleanTopic} Service\n# ==========================================\nimport logging\nfrom dataclasses import dataclass\nfrom typing import Optional\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")\nlogger = logging.getLogger("${cleanTopic}")\n\n@dataclass(frozen=True)\nclass ${safeIdentifier}Config:\n    max_retries: int = 3\n    timeout_seconds: float = 30.0\n    environment: str = "production"\n\nclass ${safeIdentifier}Engine:\n    def __init__(self, config: Optional[${safeIdentifier}Config] = None):\n        self.config = config or ${safeIdentifier}Config()\n        logger.info("Initialized %s engine in %s mode", "${cleanTopic}", self.config.environment)\n\n    def execute(self, payload: dict) -> dict:\n        logger.info("Running ${cleanTopic} pipeline with %d keys", len(payload))\n        return {"status": "SUCCESS", "topic": "${cleanTopic}", "data_echo": payload}\n\nengine = ${safeIdentifier}Engine()\nresult = engine.execute({"requestId": "REQ-101", "action": "ANALYZE"})\nprint("Engine Result:", result)`,
        output: `INFO: Initialized ${cleanTopic} engine in production mode\nINFO: Running ${cleanTopic} pipeline with 2 keys\nEngine Result: {'status': 'SUCCESS', 'topic': '${cleanTopic}', 'data_echo': {'requestId': 'REQ-101', 'action': 'ANALYZE'}}`,
        explanation: `Enterprise-ready Python design utilizing frozen dataclasses, modular dependency configuration, and standard library logging.`
      };
    } else {
      return {
        code: `# ==========================================\n# Debugging & Error Handling: ${cleanTopic}\n# ==========================================\ndef safe_${safeIdentifier.toLowerCase()}_lookup(data_dict: dict, key: str, default_val = "Not Found"):\n    try:\n        # Guard against KeyError and TypeError\n        return data_dict[key]\n    except KeyError:\n        print(f"[Warning]: Key '{key}' not present; returning default.")\n        return default_val\n    except TypeError as e:\n        print(f"[Error]: Invalid container passed ({e}).")\n        return default_val\n\n# Test edge cases\nlookup_table = {"status": "ACTIVE", "code": 200}\nprint("Found:", safe_${safeIdentifier.toLowerCase()}_lookup(lookup_table, "status"))\nprint("Missing:", safe_${safeIdentifier.toLowerCase()}_lookup(lookup_table, "non_existent"))`,
        output: `Found: ACTIVE\n[Warning]: Key 'non_existent' not present; returning default.\nMissing: Not Found`,
        explanation: `Demonstrates Python exception handling patterns, preventing uncaught KeyErrors, and writing resilient lookup logic.`
      };
    }
  }

  // ─────────────────────────────────────────────────────────
  // 3. JavaScript / TypeScript / React / Node.js
  // ─────────────────────────────────────────────────────────
  if (t === 'javascript' || t === 'typescript' || t === 'react' || t === 'node-js' || t === 'express-js') {
    if (stage === 'UNDERSTAND') {
      return {
        syntax: `// Modern TypeScript / ES2024 Definition for ${cleanTopic}\nexport interface ${safeIdentifier}Config {\n  readonly id: string;\n  name: string;\n  enabled: boolean;\n}\n\nexport function execute${safeIdentifier}(config: ${safeIdentifier}Config): Promise<void>;`,
        code: `// ==========================================\n// Modern JavaScript / TypeScript - ${cleanTopic}\n// ==========================================\n\ninterface ${safeIdentifier}Model {\n  id: string;\n  topic: string;\n  status: 'active' | 'archived';\n}\n\nfunction explore${safeIdentifier}(): void {\n  console.log("=== Exploring ${cleanTopic} ===");\n\n  const item: ${safeIdentifier}Model = {\n    id: 'id-001',\n    topic: '${cleanTopic}',\n    status: 'active'\n  };\n\n  // Destructuring and template literals\n  const { topic, status } = item;\n  console.log(\`Feature: \${topic} [\${status.toUpperCase()}]\`);\n}\n\nexplore${safeIdentifier}();`,
        output: `=== Exploring ${cleanTopic} ===\nFeature: ${cleanTopic} [ACTIVE]`,
        explanation: `TypeScript interface declaration, strict object typing, modern destructuring, and ES module patterns for ${cleanTopic}.`
      };
    } else if (stage === 'PRACTICE') {
      return {
        code: `// ==========================================\n// Hands-on Practice: ${cleanTopic}\n// ==========================================\n\nasync function fetchAndFilter${safeIdentifier}() {\n  const rawData = [\n    { id: 101, title: 'Item A', priority: 'high', score: 88 },\n    { id: 102, title: 'Item B', priority: 'low', score: 45 },\n    { id: 103, title: 'Item C', priority: 'high', score: 94 }\n  ];\n\n  console.log('[Practice]: Transforming dataset with ${cleanTopic} logic...');\n\n  // Functional transformation\n  const highPriority = rawData\n    .filter(item => item.priority === 'high')\n    .map(item => ({ ...item, passed: item.score >= 70 }));\n\n  console.log('Filtered Results:', JSON.stringify(highPriority, null, 2));\n}\n\nfetchAndFilter${safeIdentifier}();`,
        output: `[Practice]: Transforming dataset with ${cleanTopic} logic...\nFiltered Results: [\n  {\n    "id": 101,\n    "title": "Item A",\n    "priority": "high",\n    "score": 88,\n    "passed": true\n  },\n  {\n    "id": 103,\n    "title": "Item C",\n    "priority": "high",\n    "score": 94,\n    "passed": true\n  }\n]`,
        explanation: `Demonstrates immutability, array chaining (.filter, .map), object spreading, and clean async patterns.`
      };
    } else if (stage === 'BUILD') {
      return {
        code: `// ==========================================\n// Production Architecture: ${cleanTopic} Module\n// ==========================================\n\nclass ${safeIdentifier}Service {\n  #cache = new Map<string, any>();\n\n  async executeOperation(key: string, payload: Record<string, unknown>): Promise<any> {\n    if (!key) throw new Error("Key cannot be empty");\n\n    if (this.#cache.has(key)) {\n      console.log(\`[Cache Hit] Returning cached item for \${key}\`);\n      return this.#cache.get(key);\n    }\n\n    console.log(\`[Process] Performing ${cleanTopic} operation for \${key}...\`);\n    const result = { key, processedAt: new Date().toISOString(), payload };\n    this.#cache.set(key, result);\n    return result;\n  }\n}\n\nconst service = new ${safeIdentifier}Service();\nservice.executeOperation("ORDER-441", { amount: 150.0 }).then(console.log);`,
        output: `[Process] Performing ${cleanTopic} operation for ORDER-441...\n{ key: 'ORDER-441', processedAt: '2026-09-22T20:45:00.000Z', payload: { amount: 150 } }`,
        explanation: `Enterprise JavaScript pattern using private class fields (#cache), defensive error throwing, and in-memory caching.`
      };
    } else {
      return {
        code: `// ==========================================\n// Debugging & Edge Cases: ${cleanTopic}\n// ==========================================\n\nfunction safe${safeIdentifier}Handler(callback?: () => void): void {\n  try {\n    // Common bug: Calling undefined as a function\n    if (typeof callback === 'function') {\n      callback();\n    } else {\n      console.log('[Safe Guard]: Callback was not provided or invalid; skipped safely.');\n    }\n  } catch (err: any) {\n    console.error('[Error Caught]:', err.message);\n  }\n}\n\nsafe${safeIdentifier}Handler(); // Safe execution without TypeError`,
        output: `[Safe Guard]: Callback was not provided or invalid; skipped safely.`,
        explanation: `Demonstrates safe defensive type-checking, preventing TypeError: callback is not a function in JavaScript runtimes.`
      };
    }
  }

  // ─────────────────────────────────────────────────────────
  // 4. SQL / MySQL / PostgreSQL
  // ─────────────────────────────────────────────────────────
  if (t === 'sql' || t === 'mysql' || t === 'postgresql') {
    if (stage === 'UNDERSTAND') {
      return {
        syntax: `-- SQL Syntax Pattern for ${cleanTopic}\nSELECT column1, column2\nFROM table_name\nWHERE condition\nORDER BY column1 ASC;`,
        code: `-- ==========================================\n-- SQL Relational Query: ${cleanTopic}\n-- ==========================================\n\n-- Inspect table metadata\nSELECT \n    employee_id,\n    first_name,\n    department,\n    salary\nFROM employees\nWHERE status = 'ACTIVE'\n  AND salary >= 60000\nORDER BY salary DESC\nLIMIT 5;`,
        output: `+-------------+------------+-------------+--------+\n| employee_id | first_name | department  | salary |\n+-------------+------------+-------------+--------+\n| 104         | Rajesh     | Engineering | 95000  |\n| 109         | Priya      | Product     | 88000  |\n| 112         | Amit       | Engineering | 82000  |\n+-------------+------------+-------------+--------+\n(3 rows in set)`,
        explanation: `Demonstrates standard ANSI SQL querying, WHERE filtering, column projections, and descending ordering for ${cleanTopic}.`
      };
    } else if (stage === 'PRACTICE') {
      return {
        code: `-- ==========================================\n-- SQL Practice Exercise: ${cleanTopic}\n-- ==========================================\n\nSELECT \n    d.department_name,\n    COUNT(e.employee_id) AS total_staff,\n    ROUND(AVG(e.salary), 2) AS average_salary,\n    MAX(e.salary) AS peak_salary\nFROM departments d\nINNER JOIN employees e ON d.department_id = e.department_id\nGROUP BY d.department_name\nHAVING COUNT(e.employee_id) >= 2\nORDER BY average_salary DESC;`,
        output: `+-----------------+-------------+----------------+-------------+\n| department_name | total_staff | average_salary | peak_salary |\n+-----------------+-------------+----------------+-------------+\n| Engineering     | 14          | 89400.50       | 125000      |\n| Data Analytics  | 6           | 78200.00       | 96000       |\n+-----------------+-------------+----------------+-------------+`,
        explanation: `Demonstrates INNER JOIN relational integrity, aggregate functions (COUNT, AVG, MAX), GROUP BY groupings, and HAVING condition filters.`
      };
    } else if (stage === 'BUILD') {
      return {
        code: `-- ==========================================\n-- Production Analytics: ${cleanTopic} with CTE\n-- ==========================================\n\nWITH RankedSalaries AS (\n    SELECT \n        employee_id,\n        first_name,\n        department_id,\n        salary,\n        DENSE_RANK() OVER (\n            PARTITION BY department_id \n            ORDER BY salary DESC\n        ) as salary_rank\n    FROM employees\n    WHERE is_active = TRUE\n)\nSELECT \n    department_id,\n    employee_id,\n    first_name,\n    salary,\n    salary_rank\nFROM RankedSalaries\nWHERE salary_rank <= 2\nORDER BY department_id, salary_rank;`,
        output: `+---------------+-------------+------------+--------+-------------+\n| department_id | employee_id | first_name | salary | salary_rank |\n+---------------+-------------+------------+--------+-------------+\n| 10            | 104         | Rajesh     | 95000  | 1           |\n| 10            | 112         | Amit       | 82000  | 2           |\n| 20            | 109         | Priya      | 88000  | 1           |\n+---------------+-------------+------------+--------+-------------+`,
        explanation: `Production analytics pattern utilizing Common Table Expressions (CTEs) and DENSE_RANK() window functions partitioned across departments.`
      };
    } else {
      return {
        code: `-- ==========================================\n-- SQL Performance & Index Optimization: ${cleanTopic}\n-- ==========================================\n\n-- PITFALL: Full table scan caused by wildcard prefix search\n-- EXPLAIN SELECT * FROM employees WHERE email LIKE '%@company.com';\n\n-- RESOLUTION: Add dedicated index and optimize query plan\nCREATE INDEX idx_emp_dept_salary ON employees(department_id, salary);\n\n-- Verified sargable query using B-Tree index scan:\nEXPLAIN\nSELECT employee_id, salary \nFROM employees \nWHERE department_id = 10 AND salary > 50000;`,
        output: `+----+-------------+-----------+------------+------+---------------------+\n| id | select_type | table     | type       | key  | key_len             |\n+----+-------------+-----------+------------+------+---------------------+\n|  1 | SIMPLE      | employees | range      | idx_emp_dept_salary | 8   |\n+----+-------------+-----------+------------+------+---------------------+`,
        explanation: `Demonstrates EXPLAIN execution plan analysis, index utilization, and avoiding non-sargable query patterns that cause full table scans.`
      };
    }
  }

  // ─────────────────────────────────────────────────────────
  // 5. C & C++
  // ─────────────────────────────────────────────────────────
  if (t === 'c' || t === 'cpp') {
    const isCpp = t === 'cpp';
    if (stage === 'UNDERSTAND') {
      return {
        syntax: isCpp
          ? `// C++20 Definition for ${cleanTopic}\n#include <iostream>\n\nclass ${safeIdentifier} {\npublic:\n    void execute() const;\n};`
          : `/* C17 Header for ${cleanTopic} */\n#include <stdio.h>\n\nvoid execute_${safeIdentifier.toLowerCase()}(void);`,
        code: isCpp
          ? `// ==========================================\n// Modern C++ (C++20) - ${cleanTopic}\n// ==========================================\n#include <iostream>\n#include <string>\n#include <vector>\n\nint main() {\n    std::cout << "=== Exploring ${cleanTopic} in C++ ===\\n";\n\n    std::string topicName = "${cleanTopic}";\n    std::vector<int> numbers = {10, 20, 30, 40};\n\n    std::cout << "Topic: " << topicName << "\\n";\n    std::cout << "Elements count: " << numbers.size() << "\\n";\n\n    return 0;\n}`
          : `/* ==========================================\n   C Standard Library (C17) - ${cleanTopic}\n   ========================================== */\n#include <stdio.h>\n#include <stdlib.h>\n\nint main(void) {\n    printf("=== Exploring ${cleanTopic} in C ===\\n");\n\n    const char* topic_name = "${cleanTopic}";\n    int values[] = {10, 20, 30};\n    size_t count = sizeof(values) / sizeof(values[0]);\n\n    printf("Topic: %s\\n", topic_name);\n    printf("Array length: %zu\\n", count);\n\n    return 0;\n}`,
        output: `=== Exploring ${cleanTopic} in ${isCpp ? 'C++' : 'C'} ===\nTopic: ${cleanTopic}\n${isCpp ? 'Elements count: 4' : 'Array length: 3'}`,
        explanation: `Demonstrates ${isCpp ? 'modern C++ RAII, STL containers, and std::cout streams' : 'idiomatic C array sizing, pointers, and memory layout'}.`
      };
    } else if (stage === 'PRACTICE') {
      return {
        code: isCpp
          ? `// ==========================================\n// C++ Practice Exercise: ${cleanTopic}\n// ==========================================\n#include <iostream>\n#include <algorithm>\n#include <vector>\n\nstruct DataItem {\n    int id;\n    std::string name;\n    double value;\n};\n\nint main() {\n    std::vector<DataItem> items = {\n        {1, "Sensor A", 45.2},\n        {2, "Sensor B", 91.8},\n        {3, "Sensor C", 12.4}\n    };\n\n    // Practical search with std::find_if\n    auto it = std::find_if(items.begin(), items.end(), [](const DataItem& d) {\n        return d.value > 50.0;\n    });\n\n    if (it != items.end()) {\n        std::cout << "High value detected: " << it->name << " (" << it->value << ")\\n";\n    }\n    return 0;\n}`
          : `/* ==========================================\n   C Practice Walkthrough: ${cleanTopic}\n   ========================================== */\n#include <stdio.h>\n#include <stdbool.h>\n\ntypedef struct {\n    int id;\n    char name[32];\n    double value;\n} DataItem;\n\nbool find_high_value(const DataItem* items, size_t count, DataItem* out_item) {\n    for (size_t i = 0; i < count; ++i) {\n        if (items[i].value > 50.0) {\n            *out_item = items[i];\n            return true;\n        }\n    }\n    return false;\n}\n\nint main(void) {\n    DataItem items[] = {{1, "Sensor A", 45.2}, {2, "Sensor B", 91.8}};\n    DataItem found;\n    if (find_high_value(items, 2, &found)) {\n        printf("Detected: %s (%.2f)\\n", found.name, found.value);\n    }\n    return 0;\n}`,
        output: `High value detected: Sensor B (91.8)`,
        explanation: `Practical implementation demonstrating ${isCpp ? 'lambda predicates and STL algorithms' : 'pointers, structs, and pass-by-reference output parameters'}.`
      };
    } else if (stage === 'BUILD') {
      return {
        code: isCpp
          ? `// ==========================================\n// Production Architecture: RAII & Smart Pointers\n// ==========================================\n#include <iostream>\n#include <memory>\n\nclass ${safeIdentifier}Resource {\npublic:\n    ${safeIdentifier}Resource() { std::cout << "[Resource Acquired]\\n"; }\n    ~${safeIdentifier}Resource() { std::cout << "[Resource Safely Released]\\n"; }\n    void process() { std::cout << "Executing ${cleanTopic} high-perf loop\\n"; }\n};\n\nint main() {\n    // Smart pointer prevents memory leaks automatically\n    auto resource = std::make_unique<${safeIdentifier}Resource>();\n    resource->process();\n    return 0;\n}`
          : `/* ==========================================\n   Production Architecture: Safe Dynamic Memory\n   ========================================== */\n#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct {\n    int* buffer;\n    size_t capacity;\n} SafeBuffer;\n\nSafeBuffer* create_buffer(size_t capacity) {\n    SafeBuffer* b = (SafeBuffer*)malloc(sizeof(SafeBuffer));\n    if (!b) return NULL;\n    b->buffer = (int*)calloc(capacity, sizeof(int));\n    b->capacity = capacity;\n    return b;\n}\n\nvoid free_buffer(SafeBuffer* b) {\n    if (b) {\n        free(b->buffer);\n        free(b);\n    }\n}\n\nint main(void) {\n    SafeBuffer* b = create_buffer(1024);\n    printf("Buffer allocated safely at %p\\n", (void*)b);\n    free_buffer(b);\n    return 0;\n}`,
        output: isCpp
          ? `[Resource Acquired]\nExecuting ${cleanTopic} high-perf loop\n[Resource Safely Released]`
          : `Buffer allocated safely at 0x7ffd10a0`,
        explanation: `Demonstrates safe memory management: ${isCpp ? 'std::unique_ptr RAII lifecycle management' : 'dynamic memory allocation with error guards and free() pairing'}.`
      };
    } else {
      return {
        code: isCpp
          ? `// Debugging: Avoiding Dangling Pointers & Undefined Behavior\n#include <iostream>\n\nvoid safePointerAccess() {\n    int value = 42;\n    int* ptr = &value;\n\n    if (ptr != nullptr) {\n        std::cout << "Safe pointer dereference: " << *ptr << "\\n";\n    }\n}\n\nint main() {\n    safePointerAccess();\n    return 0;\n}`
          : `/* Debugging: Preventing Buffer Overflows in C */\n#include <stdio.h>\n#include <string.h>\n\nint main(void) {\n    char dest[16];\n    const char* src = "ValidData";\n    /* Use snprintf instead of strcpy to prevent buffer overflow */\n    snprintf(dest, sizeof(dest), "%s", src);\n    printf("Safe copy: %s\\n", dest);\n    return 0;\n}`,
        output: isCpp ? `Safe pointer dereference: 42` : `Safe copy: ValidData`,
        explanation: `Demonstrates how to avoid undefined behavior, buffer overflows, and segmentation faults.`
      };
    }
  }

  // ─────────────────────────────────────────────────────────
  // 6. Default Fallback: Java
  // ─────────────────────────────────────────────────────────
  if (stage === 'UNDERSTAND') {
    return {
      syntax: `// Java Syntax for ${cleanTopic}\npackage com.enterprise.learning;\n\npublic class ${safeIdentifier}Demo {\n    public static void execute() {\n        // Syntax and rules for ${cleanTopic}\n    }\n}`,
      code: `// ==========================================\n// Java 21 LTS - ${cleanTopic}: Syntax & Fundamentals\n// ==========================================\npackage com.learning.foundation;\n\nimport java.util.List;\n\npublic class ${safeIdentifier}Explanation {\n    public static void main(String[] args) {\n        System.out.println("=== Exploring ${cleanTopic} in Java ===");\n\n        String topicName = "${cleanTopic}";\n        int difficultyScore = 85;\n        boolean isReady = true;\n\n        System.out.printf("Topic: %s | Difficulty: %d | Status: %s%n",\n            topicName, difficultyScore, (isReady ? "VERIFIED" : "PENDING"));\n    }\n}`,
      output: `=== Exploring ${cleanTopic} in Java ===\nTopic: ${cleanTopic} | Difficulty: 85 | Status: VERIFIED`,
      explanation: `Java 21 source code demonstrating standard JVM class definitions, package conventions, printf formatting, and strict type safety.`
    };
  } else if (stage === 'PRACTICE') {
    return {
      code: `// ==========================================\n// Hands-on Java Practice: ${cleanTopic}\n// ==========================================\npackage com.learning.practice;\n\nimport java.util.ArrayList;\nimport java.util.List;\n\npublic class ${safeIdentifier}Practice {\n    public record Product(int id, String name, double price) {}\n\n    public static void main(String[] args) {\n        List<Product> catalog = List.of(\n            new Product(1, "Cloud Server", 120.0),\n            new Product(2, "Database Node", 240.0),\n            new Product(3, "Cache Cluster", 80.0)\n        );\n\n        System.out.println("[Practice] Processing catalog with ${cleanTopic} rules:");\n        catalog.stream()\n            .filter(p -> p.price() > 100.0)\n            .forEach(p -> System.out.println(" -> " + p.name() + " : $" + p.price()));\n    }\n}`,
      output: `[Practice] Processing catalog with ${cleanTopic} rules:\n -> Cloud Server : $120.0\n -> Database Node : $240.0`,
      explanation: `Demonstrates modern Java records, immutability, stream pipelines, and filter predicates applied to ${cleanTopic}.`
    };
  } else if (stage === 'BUILD') {
    return {
      code: `// ==========================================\n// Production Architecture: ${cleanTopic}\n// ==========================================\npackage com.learning.service;\n\nimport java.util.Objects;\nimport java.util.UUID;\n\npublic class ${safeIdentifier}Service {\n    public String processTransaction(String accountId, double amount) {\n        Objects.requireNonNull(accountId, "accountId must not be null");\n        if (amount <= 0) {\n            throw new IllegalArgumentException("Transaction amount must be positive");\n        }\n\n        String txnRef = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();\n        return String.format("[%s] Successfully applied $%.2f to account %s", txnRef, amount, accountId);\n    }\n\n    public static void main(String[] args) {\n        ${safeIdentifier}Service service = new ${safeIdentifier}Service();\n        String result = service.processTransaction("ACC-5521", 275.50);\n        System.out.println(result);\n    }\n}`,
      output: `[TXN-E3A9F201] Successfully applied $275.50 to account ACC-5521`,
      explanation: `Enterprise Java pattern implementing defensive input validation via Objects.requireNonNull and transactional reference generation.`
    };
  } else {
    return {
      code: `// ==========================================\n// Debugging & Best Practices: ${cleanTopic}\n// ==========================================\npackage com.learning.debug;\n\nimport java.util.Optional;\n\npublic class ${safeIdentifier}Debugger {\n    public static Optional<String> findConfig(String key) {\n        if (key == null || key.isBlank()) {\n            return Optional.empty();\n        }\n        return Optional.of("CONFIG_VALUE_FOR_" + key.toUpperCase());\n    }\n\n    public static void main(String[] args) {\n        // Avoiding NullPointerException with java.util.Optional\n        Optional<String> result = findConfig("apiKey");\n        System.out.println("Config: " + result.orElse("DEFAULT_FALLBACK"));\n    }\n}`,
      output: `Config: CONFIG_VALUE_FOR_APIKEY`,
      explanation: `Demonstrates how to eliminate NullPointerExceptions using java.util.Optional and defensive coding standards in production Java.`
    };
  }
}

/**
 * Generates rich, authentic interview questions and comprehensive answers for a topic and stage.
 */
function generateInterviewQnA(tech: string, topic: string, stage: string): string[] {
  const { language } = getLanguageForTech(tech);
  if (stage === 'UNDERSTAND') {
    return [
      `What is ${topic} in ${language}, and what core problem does it solve in application design?`,
      `What are the language syntax keywords, scope rules, and runtime semantics governing ${topic}?`,
      `How does ${language}'s compiler/interpreter process ${topic} differently compared to related constructs?`,
      `Can you explain the difference between static and dynamic behaviors when declaring ${topic}?`
    ];
  } else if (stage === 'PRACTICE') {
    return [
      `How do you pass parameters and handle boundary conditions when implementing ${topic} in ${language}?`,
      `What is the algorithmic time and space complexity of typical operations involving ${topic}?`,
      `How would you write a parameterized unit test to verify that ${topic} handles empty, null, or extreme inputs?`,
      `What strategies do you use to refactor complex ${topic} logic into clean, readable helper functions?`
    ];
  } else if (stage === 'BUILD') {
    return [
      `How do you architect an enterprise service utilizing ${topic} with clean separation of concerns and dependency injection?`,
      `What concurrency and thread-safety considerations must be addressed when ${topic} is accessed by multiple worker threads in ${language}?`,
      `How do you implement structured logging and telemetry to monitor ${topic} throughput and error rates in production?`,
      `When scaling a system to millions of transactions, what architectural bottlenecks might arise around ${topic}, and how do you mitigate them?`
    ];
  } else {
    return [
      `What are the most frequent runtime exceptions or bugs associated with ${topic} in ${language}, and how do you diagnose them from a stack trace?`,
      `Describe a high-stakes production incident or memory regression caused by misconfigured ${topic} and how you would remediate it.`,
      `How do you benchmark and profile memory allocations or CPU bottlenecks in ${topic} using standard ${language} diagnostic tooling?`,
      `How would you justify or defend your technical trade-offs regarding ${topic} during a senior system architecture review?`
    ];
  }
}

/**
 * Generates common developer mistakes with targeted fixes for a topic and stage.
 */
function generateMistakes(tech: string, topic: string, stage: string): string[] {
  const { language } = getLanguageForTech(tech);
  if (stage === 'UNDERSTAND') {
    return [
      `Confusing the syntax and declaration semantics of ${topic} with similar features from other languages`,
      `Misunderstanding variable scoping or type inference rules when declaring ${topic} in ${language}`,
      `Assuming ${topic} handles memory allocation automatically without understanding value vs reference behavior`,
      `Overlooking compiler warnings or strict mode errors related to ${topic}`
    ];
  } else if (stage === 'PRACTICE') {
    return [
      `Off-by-one errors and unchecked boundary conditions when processing collections with ${topic}`,
      `Neglecting edge cases such as empty lists, negative values, or unexpectedly formatted payloads`,
      `Mutating shared state inadvertently during iteration or data transformation passes`,
      `Failing to validate inputs before feeding them into algorithms utilizing ${topic}`
    ];
  } else if (stage === 'BUILD') {
    return [
      `Tight coupling of ${topic} logic directly to HTTP controllers or database models without an abstraction layer`,
      `Executing blocking synchronous calls inside high-concurrency flows that involve ${topic}`,
      `Failing to provide structured logging, request IDs, or correlation contexts in production services`,
      `Ignoring retry policies, back-off mechanisms, and circuit breakers when ${topic} interacts with external dependencies`
    ];
  } else {
    return [
      `Swallowing exceptions silently in try/catch blocks instead of logging root causes and rethrowing`,
      `Dereferencing nullable or uninitialized objects in ${topic} paths causing uncaught runtime crashes`,
      `Leaking memory or resources by failing to dispose or unregister event listeners/streams used with ${topic}`,
      `Attempting quick fixes in production without writing a reproducible regression test for the failure mode`
    ];
  }
}

/**
 * Generates industry best practices for a topic and stage.
 */
function generateBestPractices(tech: string, topic: string, stage: string): string[] {
  const { language } = getLanguageForTech(tech);
  if (stage === 'UNDERSTAND') {
    return [
      `Follow official ${language} naming conventions and formatting guidelines when declaring ${topic}`,
      `Consult official language documentation to understand language specification guarantees for ${topic}`,
      `Keep declarations simple and declare variables close to where they are first used`,
      `Use strong typing and explicit signatures to document intent directly in the code`
    ];
  } else if (stage === 'PRACTICE') {
    return [
      `Break down algorithms into small, single-responsibility functions with clear inputs and outputs`,
      `Write unit tests with edge-case test matrices (empty, single-item, large sets, invalid types)`,
      `Use immutable data structures and pure functions where possible to avoid unintended side effects`,
      `Measure execution time and memory footprint during testing for performance-sensitive loops`
    ];
  } else if (stage === 'BUILD') {
    return [
      `Encapsulate business logic behind clean interfaces to allow simple mocking and unit testing`,
      `Inject dependencies via constructor injection to maintain loose coupling across modules`,
      `Implement structured telemetry (metrics, traces, and contextual logs) for every critical path`,
      `Design with failure in mind: enforce timeouts, circuit breakers, and graceful fallback responses`
    ];
  } else {
    return [
      `Adopt defensive programming: validate all external inputs at the boundaries of your system`,
      `Utilize nullable reference types and static analysis linters to catch potential faults before runtime`,
      `Write automated regression tests for every detected bug before committing the fix to the main branch`,
      `Conduct thorough post-incident reviews to document root causes and harden operational runbooks`
    ];
  }
}

/**
 * Main builder: Generates 4 progressive, deep, unique lessons for ANY topic in ANY technology.
 */
export function generateLessonsForTopic(
  technology: string,
  topic: string,
  baseIndex: number
): RoadmapLesson[] {
  const { language } = getLanguageForTech(technology);

  return STAGES.map((stageConfig, stageIndex) => {
    const stage = stageConfig.stageName;
    const lessonId = `${technology}-${baseIndex + stageIndex}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const lessonTitle = `${topic}: ${stageConfig.suffix}`;
    const codeData = generateCodeForTopicAndStage(technology, topic, stage);

    let summaryText = '';
    let introText = '';
    let whyMatters = '';
    let howWorks = '';
    let realUsage = '';
    let objectives: string[] = [];
    let importantPoints: string[] = [];
    let practiceProblem = '';
    let miniChallenge = '';

    if (stage === 'UNDERSTAND') {
      summaryText = `Core syntax definition, language keywords, execution model, and foundational rules of ${topic} in ${language}.`;
      introText = `Mastering ${topic} begins with a crystal-clear mental model of how the ${language} compiler and runtime treat this construct. In this lesson, we break down the exact syntax, keywords, and structural semantics.`;
      whyMatters = `Without mastering ${topic}'s fundamental syntax and operational constraints, developers frequently write brittle code, misunderstand error messages, or produce unmaintainable workarounds.`;
      howWorks = `The ${language} runtime evaluates ${topic} according to language specification rules. Trace the provided example to understand how memory is allocated, variables are bound, and execution progresses step-by-step.`;
      realUsage = `Production ${language} applications rely on ${topic} as a standard architectural primitive across libraries, microservices, and core business models.`;
      objectives = [
        `Explain the core concepts, memory model, and syntax rules of ${topic} in ${language}`,
        `Identify key keywords, type rules, and compile-time constraints`,
        `Distinguish ${topic} from related language features and recognize standard idiomatic usage`
      ];
      importantPoints = [
        `${topic} adheres strictly to ${language}'s lexical scoping and type-checking rules.`,
        `Familiarity with the language specification ensures predictable behavior across different runtime versions.`,
        `Readable, idiomatic declarations reduce onboarding friction and code maintenance costs.`
      ];
      practiceProblem = `Write a standalone ${language} program that declares and exercises ${topic} using multiple variable types. Verify that it compiles cleanly and trace each output statement.`;
      miniChallenge = `Explain the difference between value and reference behavior in ${topic} to a peer in 2 sentences.`;
    } else if (stage === 'PRACTICE') {
      summaryText = `Hands-on step-by-step implementation, parameter passing, condition evaluation, and execution walkthrough for ${topic}.`;
      introText = `Take ${topic} from theoretical knowledge into muscle memory. In this hands-on lesson, you will trace a complete working implementation, examine its input/output lifecycle, and complete a targeted coding exercise.`;
      whyMatters = `Real-world proficiency requires translating syntax knowledge into working algorithms with real data inputs, error validation, and predictable outputs.`;
      howWorks = `Data passes into the method/function, undergoes validation and transformation, and produces deterministic results. Observe how edge cases and boundary values are filtered.`;
      realUsage = `Engineers use these patterns when implementing everyday operational logic: parsing user inputs, calculating billing metrics, and verifying request payloads.`;
      objectives = [
        `Trace data flow and parameter evaluation in the practical ${topic} walkthrough`,
        `Implement algorithmic logic handling collections, boundary values, and transformations`,
        `Predict and verify stdout output for multiple normal and edge-case inputs`
      ];
      importantPoints = [
        `Always test algorithmic logic with boundary values (e.g., zero, negative numbers, empty arrays).`,
        `Keep transformation loops pure and avoid mutating shared data structures across iterations.`,
        `Clear variable names inside operational logic convey business intent much better than arbitrary single-letter variables.`
      ];
      practiceProblem = `Extend the ${topic} processing logic above to filter records by an additional condition and calculate a weighted average. Run the script and compare the output.`;
      miniChallenge = `Add an edge-case test case with an empty collection and verify that your logic outputs a graceful fallback instead of throwing an index error.`;
    } else if (stage === 'BUILD') {
      summaryText = `Enterprise architecture, production patterns, clean code design, and scalable implementation of ${topic}.`;
      introText = `Explore how Fortune 500 engineering teams apply ${topic} in real production environments. We examine modular architecture, clean interfaces, defensive programming, and structured logging.`;
      whyMatters = `Code in production must survive network latencies, unexpected payloads, and concurrent users. This lesson demonstrates how to design ${topic} for resilience and maintainability.`;
      howWorks = `The implementation encapsulates business rules behind clean interfaces, leverages dependency injection or encapsulation, and enforces validation boundaries before state changes occur.`;
      realUsage = `Forms the core backbone of transactional microservices, distributed worker queues, and high-throughput data pipelines.`;
      objectives = [
        `Architect an enterprise-grade service applying ${topic} with clean separation of concerns`,
        `Integrate dependency injection, asynchronous execution, and defensive validation`,
        `Structure maintainable, production-ready logging, configuration, and transaction handling`
      ];
      importantPoints = [
        `Separate business orchestration from transport protocols and data persistence layers.`,
        `Ensure all external inputs pass through validation guards before executing business logic.`,
        `Structured JSON logging with request IDs enables seamless tracing across microservice boundaries.`
      ];
      practiceProblem = `Integrate an asynchronous cancellation token or timeout into the ${topic} service. Add structured log statements for the start, success, and error outcomes of each transaction.`;
      miniChallenge = `Create an interface contract for the service and implement a lightweight mock to verify test isolation without external dependencies.`;
    } else {
      summaryText = `Common compilation and runtime pitfalls, debugging tactics, performance profiling, and senior technical interview Q&A for ${topic}.`;
      introText = `Elevate your knowledge to senior engineer level. Learn to diagnose the top failure modes of ${topic}, avoid insidious bugs, and master the exact technical questions asked in company interviews.`;
      whyMatters = `Interviewers test your depth by asking what can go wrong with ${topic} and how to fix it under pressure. Knowing how to troubleshoot and defend your code sets top candidates apart.`;
      howWorks = `We dissect common runtime exceptions, identify the root cause in the stack trace, and apply safe guards, nullable types, or error-handling wrappers to ensure 100% reliability.`;
      realUsage = `Applied daily during code reviews, production incident troubleshooting, post-mortems, and technical hiring interviews.`;
      objectives = [
        `Diagnose and remediate top runtime exceptions and edge-case failures associated with ${topic}`,
        `Master real-world senior engineering interview questions and trade-off discussions`,
        `Conduct systematic code reviews, performance profiling, and automated regression testing`
      ];
      importantPoints = [
        `Never swallow exceptions without logging or rethrowing; silent failures cause catastrophic data corruption.`,
        `Use nullable references, optional types, and strict static analysis to eliminate null dereference crashes at compile time.`,
        `Senior engineers explain technical decisions in terms of business impact, memory limits, and SLA guarantees.`
      ];
      practiceProblem = `Introduce a simulated null or corrupted input into the debugging snippet. Step through with a debugger or trace prints, and write an assertion asserting the guard cleanly handles the failure.`;
      miniChallenge = `Identify the worst-case time and space complexity of the code snippet and propose an optimization that reduces resource allocation by 50%.`;
    }

    return {
      id: lessonId,
      title: lessonTitle,
      summary: summaryText,
      introduction: introText,
      whyItMatters: whyMatters,
      howItWorks: howWorks,
      syntax: codeData.syntax,
      realWorldUsage: realUsage,
      estimatedMinutes: stageConfig.estimatedMinutes,
      difficulty: stageConfig.difficulty,
      objectives,
      examples: [
        {
          language,
          code: codeData.code,
          explanation: codeData.explanation
        }
      ],
      commonMistakes: generateMistakes(technology, topic, stage),
      bestPractices: generateBestPractices(technology, topic, stage),
      importantPoints,
      interviewQuestions: generateInterviewQnA(technology, topic, stage),
      practice: [
        {
          title: `${topic} ${stageConfig.suffix} Challenge`,
          problem: practiceProblem,
          expectedOutput: codeData.output
        }
      ],
      miniChallenge,
      relatedTopics: [topic]
    };
  });
}
