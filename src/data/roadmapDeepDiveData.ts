export interface DeepDiveResource {
  title: string;
  source: string;
  url: string;
  type: 'Official Documentation' | 'Comprehensive Tutorial' | 'Architecture Guide' | 'Specification';
  readTime: string;
  description: string;
  keyTopicsCovered: string[];
}

export interface ArchitectureCheatSheet {
  category: string;
  title: string;
  syntaxOrCode: string;
  explanation: string;
  proTip: string;
}

export interface TechnicalInterviewFAQ {
  id: string;
  question: string;
  difficulty: 'Junior' | 'Mid' | 'Senior';
  frequency: 'Very High' | 'High' | 'Critical';
  topic: string;
  shortAnswer: string;
  inDepthAnswer: string;
  sampleCodeSnippet?: string;
  sourceAttribution: string;
}

export interface ProductionPitfall {
  antiPatternTitle: string;
  symptom: string;
  badCodeSnippet: string;
  productionStandardSnippet: string;
  explanation: string;
}

export interface SkillDeepDive {
  stepId: string;
  skillName: string;
  category?: string;
  overviewSummary: string;
  keyArchitecturalTakeaways: string[];
  deepDiveResources: DeepDiveResource[];
  cheatSheets: ArchitectureCheatSheet[];
  interviewFaqs: TechnicalInterviewFAQ[];
  productionPitfalls: ProductionPitfall[];
}

export const ROADMAP_DEEP_DIVE_DATA: Record<string, SkillDeepDive> = {
  // =========================================================================
  // SKILL 1: ADVANCED JAVA & COLLECTIONS MASTERY (rd-01)
  // =========================================================================
  'rd-01': {
    stepId: 'rd-01',
    skillName: 'Advanced Java & Collections Mastery',
    overviewSummary:
      'Master the core runtime mechanics of Java: memory layout, generic type erasure, hashing collision resolution in HashMap, thread-safe collections, and declarative functional pipelines with the Stream API.',
    keyArchitecturalTakeaways: [
      'Favor composition over inheritance: avoid fragile base class coupling and rigid hierarchies (Effective Java Item 18).',
      'Understand PECS: Producer Extends, Consumer Super (? extends T for reading, ? super T for writing).',
      'The equals() and hashCode() contract is mandatory: if o1.equals(o2), then o1.hashCode() == o2.hashCode().',
      'HashMap converts buckets to Red-Black Trees (TREEIFY_THRESHOLD = 8) when table capacity is >= 64, dropping lookup time from O(N) to O(log N).',
      'Streams are lazy, single-use, and pipelined: terminal operations trigger intermediate execution.'
    ],
    deepDiveResources: [
      {
        title: 'Oracle Java 17/21 Language Specification & Official Tutorials',
        source: 'Oracle',
        url: 'https://docs.oracle.com/javase/tutorial/collections/',
        type: 'Official Documentation',
        readTime: '25 mins',
        description: 'The definitive specification of the Java Collections Framework, Generics, and Functional Interfaces by the creators of Java.',
        keyTopicsCovered: ['Collection Hierarchy', 'Type Erasure', 'Wildcards', 'Comparator vs Comparable']
      },
      {
        title: 'Baeldung Guide to the Java HashMap Implementation',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/java-hashmap-advanced',
        type: 'Comprehensive Tutorial',
        readTime: '20 mins',
        description: 'Step-by-step breakdown of array-of-nodes indexing, bitwise hashing, collision chains, and treeification in Java 8+.',
        keyTopicsCovered: ['HashMap Bucket Indexing', 'Treeification', 'Load Factor 0.75', 'ConcurrentHashMap']
      },
      {
        title: 'Modern Java in Action: Streams, Lambdas & Collectors',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/java-8-streams',
        type: 'Architecture Guide',
        readTime: '30 mins',
        description: 'Comprehensive cookbook on complex Stream operations, groupingBy, partitioningBy, parallel stream performance, and Optional patterns.',
        keyTopicsCovered: ['groupingBy', 'reducing', 'Parallel Streams', 'Optional chaining']
      }
    ],
    cheatSheets: [
      {
        category: 'Collections Complexity',
        title: 'Big-O Time Complexity Comparison Matrix',
        syntaxOrCode: `// Collection        Get        Add        Remove       Order Maintained?
// ArrayList         O(1)       O(1)*      O(N)         Insertion order
// LinkedList        O(N)       O(1)       O(1)**       Insertion order
// HashSet           O(1)       O(1)       O(1)         No order guarantee
// LinkedHashSet     O(1)       O(1)       O(1)         Insertion order
// TreeSet           O(log N)   O(log N)   O(log N)     Sorted order (Natural/Comparator)
// HashMap           O(1)       O(1)       O(1)         No order guarantee
// TreeMap           O(log N)   O(log N)   O(log N)     Sorted by Key`,
        explanation: 'Default to ArrayList and HashSet for 95% of enterprise data processing. Use LinkedList only if frequently removing at the head or tail in a Queue structure.',
        proTip: 'Always pass initialCapacity to ArrayList and HashMap if the approximate item count is known to prevent expensive internal array resizing.'
      },
      {
        category: 'Generics Wildcards (PECS)',
        title: 'Producer Extends, Consumer Super Rule',
        syntaxOrCode: `// Read-only source (Producer Extends):
public static double sum(List<? extends Number> numbers) {
    return numbers.stream().mapToDouble(Number::doubleValue).sum();
}

// Write-only destination (Consumer Super):
public static void addDefaults(List<? super Integer> consumer) {
    consumer.add(10);
    consumer.add(20);
}`,
        explanation: 'If you only retrieve data from a generic collection, declare it with `? extends T`. If you only put data into it, declare it with `? super T`.',
        proTip: 'Never return wildcards (`? extends T`) from public method return types; wildcards belong strictly in method parameters.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-1-1',
        question: 'How does HashMap handle bucket collisions in Java 8 and newer versions?',
        difficulty: 'Mid',
        frequency: 'Critical',
        topic: 'Collections Internals',
        shortAnswer: 'HashMap initially handles collisions via a singly linked list. When a single bucket contains 8 elements (TREEIFY_THRESHOLD) and the overall array has at least 64 buckets, the list is converted to a Red-Black Tree, reducing lookup from O(N) to O(log N).',
        inDepthAnswer: 'In Java 7, HashMap resolved collisions purely via linked lists. If an attacker created keys with identical hash codes (hash collision DoS attack), all elements piled into a single bucket, degrading lookups to O(N). In Java 8, Oracle introduced balanced Red-Black Trees (TreeNode). When bucket nodes reach 8 and array size >= 64, treeification occurs. If entries in a bucket decrease to 6 (UNTREEIFY_THRESHOLD) due to removals or resize, it converts back to a linked list.',
        sampleCodeSnippet: `// Internal Java 8 threshold constants in java.util.HashMap:
static final int TREEIFY_THRESHOLD = 8;
static final int UNTREEIFY_THRESHOLD = 6;
static final int MIN_TREEIFY_CAPACITY = 64;`,
        sourceAttribution: 'Oracle Java 8 Source Code & Baeldung Advanced HashMap'
      },
      {
        id: 'faq-1-2',
        question: 'Why must you override hashCode() whenever you override equals()?',
        difficulty: 'Junior',
        frequency: 'Critical',
        topic: 'Equals & HashCode Contract',
        shortAnswer: 'If two objects are considered equal by equals(), they MUST return identical hash codes. Otherwise, hashed collections like HashMap or HashSet will place equal objects into different buckets, causing lookup failures and duplicate entries.',
        inDepthAnswer: 'When map.get(key) is invoked, HashMap uses key.hashCode() to determine the bucket index. If object A equals object B, but they return different hash codes, HashMap will look for object B in a completely different bucket and return null, even though an equal key exists! This violates collection consistency and creates subtle, severe production bugs.',
        sampleCodeSnippet: `@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Employee that)) return false;
    return id == that.id && Objects.equals(email, that.email);
}

@Override
public int hashCode() {
    return Objects.hash(id, email);
}`,
        sourceAttribution: 'Effective Java (Joshua Bloch) Item 11'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Using Mutable Objects as Keys in HashMap',
        symptom: 'Entries placed into a HashMap become permanently unretrievable (null returned) even though the key is still in memory.',
        badCodeSnippet: `class UserKey {
    public String role; // MUTABLE!
}
Map<UserKey, Profile> cache = new HashMap<>();
UserKey key = new UserKey();
key.role = "USER";
cache.put(key, profile);
key.role = "ADMIN"; // Modifies field used in hashCode()!
cache.get(key); // Returns NULL! Key is now trapped in wrong bucket!`,
        productionStandardSnippet: `// Use immutable Java 16+ records or final fields
public record UserKey(String role) {}`,
        explanation: 'When the key mutated, its hashCode changed. HashMap now searches for the key in a different bucket and fails to locate the node.'
      }
    ]
  },

  // =========================================================================
  // SKILL 2: RELATIONAL DATABASE ARCHITECTURE & JDBC (rd-02)
  // =========================================================================
  'rd-02': {
    stepId: 'rd-02',
    skillName: 'Relational Database Architecture & JDBC',
    overviewSummary:
      'Understand enterprise relational database theory: relational schemas, ACID guarantees, query execution plans (EXPLAIN), analytic window functions, and safe high-performance JDBC connectivity with HikariCP.',
    keyArchitecturalTakeaways: [
      'ACID guarantees transaction integrity: Atomicity, Consistency, Isolation, and Durability.',
      'Analytic Window Functions (ROW_NUMBER, RANK, DENSE_RANK) compute rankings and running totals without collapsing row granularity.',
      'Always parameterize queries using PreparedStatement to prevent catastrophic SQL Injection (OWASP A03).',
      'Database connection creation is expensive (TCP handshake + authentication); enterprise backends must use connection pools like HikariCP.',
      'Use proper indexing (B-Tree) on foreign keys and frequently filtered columns to avoid full table scans.'
    ],
    deepDiveResources: [
      {
        title: 'Use The Index, Luke! — SQL Indexing and Tuning Guide',
        source: 'MySQL',
        url: 'https://use-the-index-luke.com/',
        type: 'Architecture Guide',
        readTime: '35 mins',
        description: 'The industry bible for database query optimization, B-Tree index traversal, composite index column order, and join performance.',
        keyTopicsCovered: ['B-Tree Indexing', 'EXPLAIN Plan', 'Range Scans', 'Index Clustering']
      },
      {
        title: 'HikariCP High-Performance Connection Pool Architecture',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/hikaricp',
        type: 'Comprehensive Tutorial',
        readTime: '20 mins',
        description: 'Deep dive into why HikariCP is the fastest connection pool for Java backends (bytecode optimization, FastList, zero-overhead connection leases).',
        keyTopicsCovered: ['Connection Pooling', 'HikariConfig', 'Connection Leaks', 'Pool Sizing']
      },
      {
        title: 'PostgreSQL & MySQL Window Functions Masterclass',
        source: 'PostgreSQL',
        url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
        type: 'Official Documentation',
        readTime: '25 mins',
        description: 'Official guide to PARTITION BY, ORDER BY frame specifications, running totals, and analytic ranking functions.',
        keyTopicsCovered: ['ROW_NUMBER', 'DENSE_RANK', 'LEAD & LAG', 'Running Averages']
      }
    ],
    cheatSheets: [
      {
        category: 'Analytic Window Functions',
        title: 'Ranking Functions Differences',
        syntaxOrCode: `-- Given salary values: [100k, 90k, 90k, 80k]
SELECT 
    name, salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num,  -- 1, 2, 3, 4 (strictly unique)
    RANK()       OVER (ORDER BY salary DESC) AS rnk,      -- 1, 2, 2, 4 (gaps after ties)
    DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk -- 1, 2, 2, 3 (NO gaps after ties)
FROM employees;`,
        explanation: 'ROW_NUMBER produces consecutive sequence numbers. RANK skips ranks following duplicates. DENSE_RANK continues without gaps.',
        proTip: 'To find the Nth highest value (e.g. 2nd highest salary), ALWAYS use DENSE_RANK() in a CTE to avoid missing tied values.'
      },
      {
        category: 'Transaction Isolation Levels',
        title: 'ACID Concurrency Phenomena & Isolation Matrix',
        syntaxOrCode: `// Isolation Level      Dirty Read    Non-Repeatable Read    Phantom Read
// READ UNCOMMITTED     YES           YES                    YES
// READ COMMITTED       NO            YES                    YES (Default in PostgreSQL/Oracle)
// REPEATABLE READ      NO            NO                     YES (Default in MySQL InnoDB)
// SERIALIZABLE         NO            NO                     NO`,
        explanation: 'Higher isolation levels provide stronger data consistency at the expense of concurrent throughput and increased lock contention.',
        proTip: 'Most SaaS applications run reliably on READ COMMITTED. Use optimistic locking (@Version) in JPA to protect against lost updates.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-2-1',
        question: 'Why does PreparedStatement prevent SQL injection while Statement does not?',
        difficulty: 'Junior',
        frequency: 'Critical',
        topic: 'Database Security',
        shortAnswer: 'PreparedStatement compiles the SQL structure and execution plan beforehand. User inputs bound via ? placeholders are transmitted across the wire strictly as literal parameter data, never parsed as executable SQL commands.',
        inDepthAnswer: 'With raw Statement, user input is concatenated into the command string. An attacker entering "\' OR 1=1 --" alters the Abstract Syntax Tree (AST) of the query. With PreparedStatement, the database parses `SELECT * FROM users WHERE email = ?` into an execution tree once. When parameters are bound, the database engine treats the input strictly as a string scalar literal, neutralizing any SQL control characters.',
        sampleCodeSnippet: `// VULNERABLE:
String sql = "SELECT * FROM users WHERE user = '" + input + "'"; // SQL Injection!

// SECURE:
String sql = "SELECT * FROM users WHERE user = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, input); // Handled safely as literal parameter`,
        sourceAttribution: 'OWASP SQL Injection Prevention Cheat Sheet'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Unclosed JDBC Connections Leading to Pool Starvation',
        symptom: 'Application hangs after 10 requests with "HikariPool-1 - Connection is not available, request timed out after 30000ms".',
        badCodeSnippet: `Connection conn = dataSource.getConnection();
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM employees");
// If exception occurs here, conn is never returned to the pool!`,
        productionStandardSnippet: `// ALWAYS use try-with-resources:
try (Connection conn = dataSource.getConnection();
     PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM employees");
     ResultSet rs = pstmt.executeQuery()) {
    while (rs.next()) {
        // Process rows safely
    }
} // AutoCloseable automatically returns connection to HikariCP pool`,
        explanation: 'Connections obtained from a connection pool must be closed to return the lease back to the pool. Try-with-resources guarantees return even on exceptions.'
      }
    ]
  },

  // =========================================================================
  // SKILL 3: JPA & HIBERNATE ORM (rd-03)
  // =========================================================================
  'rd-03': {
    stepId: 'rd-03',
    skillName: 'JPA & Hibernate ORM',
    overviewSummary:
      'Bridge object-oriented models with relational databases: entity lifecycle, dirty checking, relationships (@OneToMany, @ManyToOne), FetchType strategies, solving the N+1 query problem, and Spring Data JPA.',
    keyArchitecturalTakeaways: [
      'JPA is the standard interface; Hibernate is the industry-standard runtime ORM engine.',
      'Dirty checking tracks changes to managed entities automatically; calling save() inside an active @Transactional method is redundant.',
      'In bidirectional relationships, mappedBy designates the inverse side; the foreign key column is managed by the owner side.',
      'Default FetchType.EAGER on @ManyToOne and @OneToOne is an enterprise anti-pattern: always specify FetchType.LAZY.',
      'The N+1 problem occurs when 1 query to fetch parent rows triggers N secondary queries for children; resolve with JOIN FETCH or @EntityGraph.'
    ],
    deepDiveResources: [
      {
        title: 'Hibernate 6 User Guide & Best Practices',
        source: 'Hibernate.org',
        url: 'https://docs.jboss.org/hibernate/orm/6.4/userguide/html_single/Hibernate_User_Guide.html',
        type: 'Official Documentation',
        readTime: '40 mins',
        description: 'The authoritative reference manual for Hibernate 6: persistence context, caching, proxies, and JPQL grammar.',
        keyTopicsCovered: ['Entity Lifecycle', 'FlushMode', 'Proxy Objects', 'Identifier Generators']
      },
      {
        title: 'Vlad Mihalcea — High-Performance Java Persistence',
        source: 'Baeldung',
        url: 'https://vladmihalcea.com/tutorials/hibernate/',
        type: 'Architecture Guide',
        readTime: '30 mins',
        description: 'The web’s most comprehensive guide on solving N+1 queries, optimizing @OneToMany relationships, and batch inserts.',
        keyTopicsCovered: ['N+1 Problem', 'JOIN FETCH', 'CascadeType.ALL', 'OrphanRemoval']
      },
      {
        title: 'Spring Data JPA Reference Documentation',
        source: 'Spring.io',
        url: 'https://docs.spring.io/spring-data/jpa/reference/',
        type: 'Official Documentation',
        readTime: '25 mins',
        description: 'Official documentation for Spring Data JPA repositories, derived queries, @Query annotations, and Pageable pagination.',
        keyTopicsCovered: ['JpaRepository', 'Derived Queries', 'Page vs Slice', '@EntityGraph']
      }
    ],
    cheatSheets: [
      {
        category: 'Entity Lifecycle States',
        title: 'The 4 JPA Entity States',
        syntaxOrCode: `// 1. TRANSIENT:  New object created in memory, not associated with DB or Session
Employee emp = new Employee("Alice", "alice@corp.com");

// 2. MANAGED:    Associated with PersistenceContext; changes tracked via Dirty Checking
entityManager.persist(emp); // or loaded via repo.findById(1L)
emp.setSalary(95000); // Triggers automatic SQL UPDATE on transaction commit!

// 3. DETACHED:   Session closed; object still has ID but changes are NOT tracked
entityManager.detach(emp); // or transaction has completed

// 4. REMOVED:    Scheduled for deletion in the database
entityManager.remove(emp);`,
        explanation: 'Only MANAGED entities participate in automatic dirty checking and first-level caching.',
        proTip: 'Accessing an uninitialized lazy collection on a DETACHED entity throws LazyInitializationException.'
      },
      {
        category: 'Solving N+1 Queries',
        title: 'JOIN FETCH vs Plain JOIN',
        syntaxOrCode: `// INCORRECT (Causes 1 + N queries when accessing employees):
@Query("SELECT d FROM Department d")
List<Department> findAllDepartments();

// CORRECT (Executes exactly 1 query fetching parents and children):
@Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees")
List<Department> findAllWithEmployees();`,
        explanation: 'Plain JOIN only filters rows; it does NOT populate the child collection proxy. JOIN FETCH instructs Hibernate to instantiate both the parent and children from the same SQL result set.',
        proTip: 'Never join fetch two @OneToMany collections in the same query; it creates a Cartesian product explosion in memory.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-3-1',
        question: 'What is the N+1 query problem in Hibernate, and how do you diagnose and fix it?',
        difficulty: 'Mid',
        frequency: 'Critical',
        topic: 'Hibernate Performance',
        shortAnswer: 'The N+1 problem occurs when fetching N entities requires 1 query to retrieve the parents and N subsequent queries to fetch child relationships. It is diagnosed using SQL logging or DataSource-Proxy, and resolved using JPQL JOIN FETCH or Spring Data @EntityGraph.',
        inDepthAnswer: 'Suppose you have 100 Departments, each with Employees. Calling departmentRepo.findAll() issues 1 SELECT query. When serializing to JSON, iterating over departments to get employees causes Hibernate to fire 100 individual SELECT queries—totaling 101 queries! In a high-traffic app, this causes database thread starvation and network latency spikes. To fix it, use `@Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees")` or `@EntityGraph(attributePaths = {"employees"})`.',
        sampleCodeSnippet: `@EntityGraph(attributePaths = {"employees"})
List<Department> findAll();`,
        sourceAttribution: 'Vlad Mihalcea — High-Performance Java Persistence'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Default EAGER Fetching on @ManyToOne Associations',
        symptom: 'Loading a single entity executes 15 hidden SQL joins, slowing response times by 300ms.',
        badCodeSnippet: `@Entity
public class Employee {
    // Default fetch for @ManyToOne is FetchType.EAGER!
    @ManyToOne 
    private Department department;
}`,
        productionStandardSnippet: `@Entity
public class Employee {
    // Production rule: ALWAYS specify FetchType.LAZY
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}`,
        explanation: 'EAGER fetching cannot be turned off at runtime. LAZY fetching ensures children are only queried when explicitly required.'
      }
    ]
  },

  // =========================================================================
  // SKILL 4: SPRING BOOT 3 CORE & ARCHITECTURE (rd-04)
  // =========================================================================
  'rd-04': {
    stepId: 'rd-04',
    skillName: 'Spring Boot 3 Core & Architecture',
    overviewSummary:
      'Master the backbone of enterprise microservices: Inversion of Control (IoC), Constructor Dependency Injection, Spring Boot auto-configuration, Maven lifecycles, and production 4-layer architecture.',
    keyArchitecturalTakeaways: [
      'Spring IoC container manages Bean lifecycles and provides loose coupling across components.',
      'Constructor injection with final fields is the gold standard: guarantees immutability and simplifies unit testing.',
      'Follow the 4-layer architecture: Controller (HTTP) -> Service (Business/Transactions) -> Repository (Data) -> Entity (Domain).',
      'Never put business calculations in Controllers or execute SQL queries outside Repositories.',
      'Use multi-environment Spring Profiles (application-dev.yml, application-prod.yml) to decouple environment configs.'
    ],
    deepDiveResources: [
      {
        title: 'Official Spring Boot 3 Reference Documentation',
        source: 'Spring.io',
        url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/',
        type: 'Official Documentation',
        readTime: '45 mins',
        description: 'Comprehensive guide to Spring Boot 3, starters, externalized configuration, actuator telemetry, and deployment.',
        keyTopicsCovered: ['Auto-Configuration', 'ApplicationContext', 'Actuator', 'Embedded Tomcat']
      },
      {
        title: 'Baeldung Master Guide: Dependency Injection and Beans in Spring',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring',
        type: 'Comprehensive Tutorial',
        readTime: '25 mins',
        description: 'Clear walkthrough of IoC, Bean Scopes (Singleton vs Prototype), component scanning, and why constructor injection wins.',
        keyTopicsCovered: ['Constructor Injection', '@Component vs @Bean', 'Bean Scopes', 'Circular Dependencies']
      }
    ],
    cheatSheets: [
      {
        category: 'Layered Architecture',
        title: 'Responsibilities of the 4 Application Layers',
        syntaxOrCode: `// 1. CONTROLLER: Handles HTTP methods, deserializes JSON, validates inputs, returns HTTP status
@RestController @RequestMapping("/api/v1/orders")

// 2. SERVICE:    Business rules, calculations, cross-service orchestrations, @Transactional boundaries
@Service @Transactional

// 3. REPOSITORY: Queries database, interacts with JPA/Hibernate, executes paginated selects
public interface OrderRepository extends JpaRepository<Order, Long>

// 4. ENTITY/DTO: Internal relational representation (Entity) vs Public API contract (Record/DTO)
public record OrderResponseDto(Long id, BigDecimal totalAmount) {}`,
        explanation: 'Enforces the Single Responsibility Principle across all enterprise backend code.',
        proTip: 'Service methods that only read data should be annotated with `@Transactional(readOnly = true)` to optimize Hibernate memory snapshots.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-4-1',
        question: 'Why does the Spring team recommend Constructor Injection over @Autowired Field Injection?',
        difficulty: 'Junior',
        frequency: 'Critical',
        topic: 'Spring Core',
        shortAnswer: 'Constructor injection allows dependencies to be declared `final`, guarantees that beans cannot be instantiated in an uninitialized/partially-constructed state, prevents hidden circular dependencies, and enables clean unit testing without Spring reflection runners.',
        inDepthAnswer: 'With field injection (`@Autowired private Repo repo;`), the dependency is injected via reflection AFTER object construction. You cannot mark fields `final`, making beans mutable. If you want to write a pure JUnit unit test, you cannot simply instantiate `new Service(mockRepo)`; you are forced to use Mockito reflection runners or start Spring. Constructor injection makes dependencies completely explicit and mandatory at compile time.',
        sampleCodeSnippet: `@Service
public class OrderService {
    private final OrderRepository orderRepository; // Immutable & Safe!

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}`,
        sourceAttribution: 'Spring Framework Official Documentation & Baeldung'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Leaking Domain Entities into REST Controllers',
        symptom: 'Infinite recursion Jackson serialization error (StackOverflowError) or accidental exposure of password hashes.',
        badCodeSnippet: `@RestController
public class UserController {
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(); // Leaks passwordHash and DB structure!
    }
}`,
        productionStandardSnippet: `@RestController
public class UserController {
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable Long id) {
        UserResponseDto dto = userService.getUserById(id);
        return ResponseEntity.ok(dto); // Safe, documented API contract
    }
}`,
        explanation: 'JPA entities represent database tables; DTOs represent client API contracts. Decoupling them allows database schemas to evolve without breaking external mobile or web clients.'
      }
    ]
  },

  // =========================================================================
  // SKILL 5: RESTFUL API ENGINEERING & BEST PRACTICES (rd-05)
  // =========================================================================
  'rd-05': {
    stepId: 'rd-05',
    skillName: 'RESTful API Engineering & Best Practices',
    overviewSummary:
      'Build enterprise RESTful APIs conforming to HTTP standards: noun-based URIs, HTTP verbs, exact status codes, DTOs, global RFC-7807 problem details, pagination, and OpenAPI 3.1 documentation.',
    keyArchitecturalTakeaways: [
      'REST resources must be plural nouns (/api/v1/employees), not verbs (/getEmployees).',
      'Match HTTP verbs to intent: GET (safe/idempotent), POST (create/non-idempotent), PUT (replace/idempotent), PATCH (modify/idempotent), DELETE (idempotent).',
      'Return semantic HTTP status codes: 200 OK, 201 Created (with Location header), 204 No Content, 400 Bad Request, 404 Not Found, 409 Conflict.',
      'Handle errors globally using @RestControllerAdvice and return RFC-7807 ProblemDetail structures.',
      'Never return unpaginated lists from production databases; always accept Pageable parameters.'
    ],
    deepDiveResources: [
      {
        title: 'RFC 7807 — Problem Details for HTTP APIs Specification',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/rest-api-error-handling-best-practices',
        type: 'Specification',
        readTime: '20 mins',
        description: 'The IETF standard for reporting machine-readable errors (type, title, status, detail, instance) in RESTful APIs.',
        keyTopicsCovered: ['RFC 7807', '@ControllerAdvice', 'ProblemDetail', 'Error Contract']
      },
      {
        title: 'Baeldung REST with Spring Series — Best Practices 2026',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/rest-with-spring-series',
        type: 'Comprehensive Tutorial',
        readTime: '35 mins',
        description: 'Complete guide to building production REST backends with Springdoc OpenAPI 3.1, pagination, and DTO validation.',
        keyTopicsCovered: ['OpenAPI 3', 'Swagger UI', 'Springdoc', 'Pageable Sorting']
      }
    ],
    cheatSheets: [
      {
        category: 'HTTP Status Codes',
        title: 'Enterprise REST Status Code Matrix',
        syntaxOrCode: `// 200 OK:           Successful GET, PUT, or PATCH returning body
// 201 Created:      Successful POST creating a resource (include Location URI header)
// 204 No Content:   Successful DELETE or operation with no response body
// 400 Bad Request:  Invalid JSON syntax or failed client validation
// 401 Unauthorized: Caller lacks valid authentication credentials
// 403 Forbidden:    Caller is authenticated but lacks required role permission
// 404 Not Found:    Requested resource ID does not exist
// 409 Conflict:     Duplicate unique key or business constraint violation
// 500 Server Error: Unhandled internal system exception`,
        explanation: 'HTTP status codes provide an instant, universal contract to mobile and web frontend clients.',
        proTip: 'Never return 200 OK when an error occurs: `{ "status": "error" }` with HTTP 200 breaks API gateways, caching proxies, and client error handling.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-5-1',
        question: 'What is the architectural difference between PUT and PATCH in REST?',
        difficulty: 'Junior',
        frequency: 'High',
        topic: 'REST Principles',
        shortAnswer: 'PUT replaces the entire resource with the payload provided by the client (any omitted fields are reset to default/null). PATCH applies partial modifications to specific fields without altering the rest of the resource.',
        inDepthAnswer: 'Both PUT and PATCH are designed to update resources. However, PUT is idempotent: sending the same PUT request 5 times produces the exact same server state. PATCH modifies only specified fields (e.g. updating an employee email without resending their full name, address, and salary). In enterprise microservices, PATCH is preferred for partial updates to prevent race condition data overwrites.',
        sampleCodeSnippet: `// PUT: Replaces entire employee
@PutMapping("/{id}")
public ResponseEntity<EmployeeDto> updateFull(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeDto dto)

// PATCH: Updates specific attributes (e.g. salary or status)
@PatchMapping("/{id}")
public ResponseEntity<EmployeeDto> updatePartial(@PathVariable Long id, @RequestBody Map<String, Object> fields)`,
        sourceAttribution: 'IETF RFC 5789 & Roy Fielding REST Dissertation'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Using Verbs in REST URI Endpoints',
        symptom: 'Fragmented, unmaintainable endpoint sprawl: /createUser, /deleteUser, /updateUserById.',
        badCodeSnippet: `@PostMapping("/api/createUser")
@PostMapping("/api/deleteUser")
@GetMapping("/api/getAllUsers")`,
        productionStandardSnippet: `@PostMapping("/api/v1/users")        // Create
@GetMapping("/api/v1/users")         // List (Paginated)
@GetMapping("/api/v1/users/{id}")    // Read single
@PutMapping("/api/v1/users/{id}")    // Replace
@DeleteMapping("/api/v1/users/{id}") // Delete`,
        explanation: 'HTTP verbs define the ACTION. URIs define the NOUN RESOURCE. Combining them creates standardized, intuitive interfaces.'
      }
    ]
  },

  // =========================================================================
  // SKILL 6: SPRING SECURITY & JWT AUTHENTICATION (rd-06)
  // =========================================================================
  'rd-06': {
    stepId: 'rd-06',
    skillName: 'Spring Security & JWT Authentication',
    overviewSummary:
      'Secure enterprise REST APIs: Spring Security 6 component architecture (SecurityFilterChain), BCrypt password hashing, stateless JWT authentication, and Role-Based Access Control (RBAC).',
    keyArchitecturalTakeaways: [
      'Spring Security 6 eliminates deprecated adapter classes in favor of component-based SecurityFilterChain beans.',
      'Never store passwords in plain text: BCrypt incorporates a random 128-bit salt to defeat rainbow table attacks.',
      'JWT tokens are signed, not encrypted: anyone can read Base64 payload claims; never store passwords or secrets inside tokens.',
      'Stateless session management (STATELESS) eliminates server-side session memory, enabling seamless cloud horizontal scaling.',
      'Enforce method-level security with @EnableMethodSecurity and @PreAuthorize("hasRole(\'ADMIN\')").'
    ],
    deepDiveResources: [
      {
        title: 'Spring Security 6 Official Architecture & Filter Chain Guide',
        source: 'Spring.io',
        url: 'https://docs.spring.io/spring-security/reference/servlet/architecture.html',
        type: 'Official Documentation',
        readTime: '30 mins',
        description: 'The definitive architectural guide explaining DelegatingFilterProxy, FilterChainProxy, SecurityFilterChain, and SecurityContextHolder.',
        keyTopicsCovered: ['SecurityFilterChain', 'SecurityContextHolder', 'AuthenticationManager', 'ProviderManager']
      },
      {
        title: 'Baeldung Guide to Spring Security 6 with JWT (2026 Standards)',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/spring-security-oauth-jwt',
        type: 'Comprehensive Tutorial',
        readTime: '35 mins',
        description: 'Modern configuration patterns: OncePerRequestFilter, JJWT token signing, refresh token rotation, and RBAC annotations.',
        keyTopicsCovered: ['JJWT', 'Bearer Token', 'Refresh Token Rotation', '@PreAuthorize']
      },
      {
        title: 'OWASP REST API Security Cheat Sheet',
        source: 'OWASP',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html',
        type: 'Architecture Guide',
        readTime: '25 mins',
        description: 'Industry standard security checklist: rate limiting, token expiration, CORS configuration, and secret management.',
        keyTopicsCovered: ['Token Storage', 'CORS Policies', 'Brute Force Protection', 'Secret Rotation']
      }
    ],
    cheatSheets: [
      {
        category: 'Spring Security 6 Config',
        title: 'Production SecurityFilterChain Configuration',
        syntaxOrCode: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        return http
            .csrf(csrf -> csrf.disable()) // Safe for stateless Bearer tokens
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}`,
        explanation: 'Stateless filter chain that intercepts Bearer tokens before standard username/password authentication runs.',
        proTip: 'In Spring Security, roles are prefixed with `ROLE_` internally. Calling `hasRole("ADMIN")` checks for the authority `ROLE_ADMIN`.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-6-1',
        question: 'What are the three parts of a JWT token, and what is the function of the signature?',
        difficulty: 'Junior',
        frequency: 'Critical',
        topic: 'JWT Security',
        shortAnswer: 'A JWT consists of Header (algorithm & token type), Payload (claims like username, roles, expiration), and Signature. The signature verifies that the token was issued by an authentic server and that the payload was not tampered with in transit.',
        inDepthAnswer: 'The token format is `Header.Payload.Signature` separated by dots and encoded in Base64URL. The signature is computed by hashing `HMACSHA256(base64Url(header) + "." + base64Url(payload), secretKey)`. If an attacker alters the user role from "USER" to "ADMIN" in the payload, the computed signature will not match the received signature, and the server immediately rejects the token with HTTP 401 Unauthorized.',
        sampleCodeSnippet: `// JWT Token structure:
// eyJhbGciOiJIUzI1NiJ9.        <-- Header (Base64)
// eyJzdWIiOiIxMjM0NTY3ODkwIn0. <-- Payload (Claims)
// SflKxwRJSMeKKF2QT4fwpMeJf36P <-- Cryptographic Signature`,
        sourceAttribution: 'RFC 7519 Specification & JWT.io'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Storing Passwords in Plaintext or Using Reversible Encryption',
        symptom: 'Database leak exposes all customer credentials in plain text.',
        badCodeSnippet: `user.setPassword(rawPassword); // NEVER STORE PLAINTEXT!`,
        productionStandardSnippet: `// Always use BCryptPasswordEncoder with salt:
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12); // Strength 12
}`,
        explanation: 'BCrypt is a slow, one-way adaptive cryptographic hash that resists GPU/ASIC brute-force cracking.'
      }
    ]
  },

  // =========================================================================
  // SKILL 7: AUTOMATED UNIT & INTEGRATION TESTING (rd-07)
  // =========================================================================
  'rd-07': {
    stepId: 'rd-07',
    skillName: 'Automated Unit & Integration Testing',
    overviewSummary:
      'Ensure production reliability: Testing Pyramid, JUnit 5 assertions and lifecycles, Mockito mocking for isolated service tests, MockMvc for controller web slices, and JaCoCo code coverage.',
    keyArchitecturalTakeaways: [
      'The Testing Pyramid balances fast, isolated Unit Tests (70%), focused Web/JPA Slice Tests (20%), and End-to-End Integration Tests (10%).',
      'Follow the Arrange-Act-Assert (AAA) pattern strictly for clean, maintainable test methods.',
      'Use Mockito (@Mock, @InjectMocks, when().thenReturn(), verify()) to test business logic without touching real databases.',
      'Use @WebMvcTest and MockMvc to test HTTP serialization, status codes, and validation rules in milliseconds.',
      'Enforce minimum 80% line and branch code coverage with JaCoCo in CI/CD build pipelines.'
    ],
    deepDiveResources: [
      {
        title: 'JUnit 5 User Guide — The Official Reference Manual',
        source: 'JUnit',
        url: 'https://junit.org/junit5/docs/current/user-guide/',
        type: 'Official Documentation',
        readTime: '30 mins',
        description: 'Comprehensive guide to JUnit 5 Jupiter engine, parameterized tests, assertions, dynamic tests, and extensions.',
        keyTopicsCovered: ['@Test', '@ParameterizedTest', 'Assertions', '@ExtendWith']
      },
      {
        title: 'Baeldung Testing in Spring Boot: Unit vs Integration Tests',
        source: 'Baeldung',
        url: 'https://www.baeldung.com/spring-boot-testing',
        type: 'Comprehensive Tutorial',
        readTime: '35 mins',
        description: 'Definitive guide on @SpringBootTest vs @WebMvcTest vs @DataJpaTest, Mockito stubbing, and MockMvc assertions.',
        keyTopicsCovered: ['MockMvc', '@MockBean', '@DataJpaTest', 'JaCoCo']
      }
    ],
    cheatSheets: [
      {
        category: 'Test Annotations',
        title: 'Spring Boot Test Slices Cheat Sheet',
        syntaxOrCode: `// UNIT TEST (Fastest, ~15ms): No Spring context, pure Mockito
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest { @Mock EmployeeRepo repo; @InjectMocks EmployeeService svc; }

// WEB SLICE TEST (~200ms): Only loads web layer (Controllers, Filters, ExceptionHandlers)
@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest { @Autowired MockMvc mockMvc; @MockBean EmployeeService svc; }

// JPA SLICE TEST (~300ms): Only loads JPA repositories and in-memory test database
@DataJpaTest
class EmployeeRepositoryTest { @Autowired TestEntityManager em; @Autowired EmployeeRepo repo; }

// FULL INTEGRATION TEST (~3s): Starts full application context
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FullApplicationTest {}`,
        explanation: 'Choosing the right test slice speeds up test suite execution by 50x in CI/CD pipelines.',
        proTip: 'Never use @SpringBootTest when testing a simple Service class; use MockitoExtension instead.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-7-1',
        question: 'What is the difference between @Mock and @InjectMocks in Mockito?',
        difficulty: 'Junior',
        frequency: 'High',
        topic: 'Unit Testing',
        shortAnswer: '@Mock creates a mock implementation of a dependency. @InjectMocks creates an actual instance of the class under test and injects all available @Mock fields into its constructor.',
        inDepthAnswer: 'When testing `EmployeeService`, you want to test the real code inside `EmployeeService`. Therefore, you annotate it with `@InjectMocks`. However, you do NOT want to connect to a real database, so you annotate `EmployeeRepository` with `@Mock`. Mockito automatically passes the mocked repository into the EmployeeService constructor.',
        sampleCodeSnippet: `@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {
    @Mock
    private EmployeeRepository employeeRepository; // Fake dependency

    @InjectMocks
    private EmployeeService employeeService; // Real service with fake repo injected
}`,
        sourceAttribution: 'Mockito Official Documentation & Baeldung'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Testing Implementation Details Instead of Observable Behavior',
        symptom: 'Refactoring private methods breaks 40 unit tests even though application functionality works perfectly.',
        badCodeSnippet: `// Fragile test tightly coupled to internal private variables`,
        productionStandardSnippet: `// Test input and output contracts:
@Test
void shouldCalculateBonusAccuratelyForSeniorLevel() {
    // Arrange
    Employee emp = new Employee(1L, "Alice", 100000);
    // Act
    BigDecimal bonus = service.calculateAnnualBonus(emp);
    // Assert
    assertEquals(new BigDecimal("15000.00"), bonus);
}`,
        explanation: 'Unit tests should verify WHAT the system does (contract and output), not HOW it does it internally.'
      }
    ]
  },

  // =========================================================================
  // SKILL 8: CAPSTONE: PRODUCTION BACKEND PROJECT & AI MOCK INTERVIEW (rd-08)
  // =========================================================================
  'rd-08': {
    stepId: 'rd-08',
    skillName: 'Capstone: Production Backend Project & AI Mock Interview',
    overviewSummary:
      'The ultimate synthesis of backend engineering: multi-stage Docker builds, database connection healthchecks, 12-factor cloud standards, and comprehensive technical defense in simulated hiring interviews.',
    keyArchitecturalTakeaways: [
      'Adopt Twelve-Factor App methodology: externalize config into environment variables and keep stateless services.',
      'Use multi-stage Docker builds to keep production images under 180MB by excluding build-time Maven caches.',
      'Configure production health probes (Liveness & Readiness) with Spring Boot Actuator for Kubernetes deployment.',
      'Implement structured logging and correlation IDs (MDC) for distributed tracing across microservices.',
      'Articulate architectural tradeoffs clearly under technical interview questioning.'
    ],
    deepDiveResources: [
      {
        title: 'The Twelve-Factor App Methodology for Cloud Backends',
        source: 'Martin Fowler',
        url: 'https://12factor.net/',
        type: 'Specification',
        readTime: '25 mins',
        description: 'The industry standard blueprint for building cloud-native SaaS applications that scale seamlessly.',
        keyTopicsCovered: ['Config in Environment', 'Stateless Processes', 'Port Binding', 'Concurrency']
      },
      {
        title: 'Spring Boot Docker Multi-Stage Builds & Optimization',
        source: 'Spring.io',
        url: 'https://spring.io/guides/topicals/spring-boot-docker/',
        type: 'Architecture Guide',
        readTime: '25 mins',
        description: 'Official guide on containerizing Spring Boot applications with JRE Alpine base images and layering.',
        keyTopicsCovered: ['Multi-stage Builds', 'Docker Layering', 'Memory Limits', 'Non-root Users']
      }
    ],
    cheatSheets: [
      {
        category: 'Production Dockerfile',
        title: 'Optimized Multi-Stage Spring Boot Container',
        syntaxOrCode: `# Stage 1: Build JAR using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal JRE Runtime (~160MB)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]`,
        explanation: 'Stage 1 discards the 500MB+ of Maven plugins. Stage 2 runs as an unprivileged user with container-aware JVM memory limits.',
        proTip: 'Always specify `-XX:+UseContainerSupport` so the JVM allocates heap relative to Docker container RAM limits, not the host machine.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-8-1',
        question: 'How do you troubleshoot a Spring Boot microservice experiencing high latency in production?',
        difficulty: 'Senior',
        frequency: 'Critical',
        topic: 'Production Troubleshooting',
        shortAnswer: 'Check Spring Boot Actuator /metrics and health endpoints, inspect HikariCP connection pool saturation, check database slow query logs for missing indexes or N+1 queries, review GC pause times via JVM telemetry, and trace request correlation IDs across service logs.',
        inDepthAnswer: '1. Check HikariCP active connections: if active connections equal max pool size (default 10), threads are blocking waiting for database leases. 2. Inspect database CPU and slow query logs: look for missing composite indexes or full table scans caused by unindexed foreign keys. 3. Check GC logs: if the heap is saturated with large entity graphs, stop-the-world GC pauses may be freezing threads. 4. Trace the correlation ID in centralized logs (ELK/Datadog) to isolate whether the delay originated in the database, an external HTTP downstream service, or internal CPU calculation loops.',
        sampleCodeSnippet: `// Check HikariCP pool health in application metrics:
// GET /actuator/metrics/hikaricp.connections.active
// GET /actuator/metrics/hikaricp.connections.pending`,
        sourceAttribution: 'High Scalability Engineering & Spring Boot Actuator Reference'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Hardcoding Credentials in application.properties Committed to Git',
        symptom: 'Security audit failure; severe vulnerability if repository is exposed or compromised.',
        badCodeSnippet: `spring.datasource.password=MySecretPassword123! # DO NOT HARDCODE!`,
        productionStandardSnippet: `spring.datasource.password=\${DB_PASSWORD:default_dev_pw}`,
        explanation: 'Use environment variable interpolation (`${ENV_VAR:fallback}`) so secrets are injected securely by Kubernetes or cloud container runners at launch.'
      }
    ]
  }
};

import { ENGINEERING_DEEP_DIVES } from './curriculum/engineeringDeepDives';
Object.assign(ROADMAP_DEEP_DIVE_DATA, ENGINEERING_DEEP_DIVES);

