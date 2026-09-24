import { ECE_CURRICULUM_DATA } from './curriculum/eceCurriculum';
import { EEE_CURRICULUM_DATA } from './curriculum/eeeCurriculum';
import { MECH_CURRICULUM_DATA } from './curriculum/mechCurriculum';
import { CIVIL_CURRICULUM_DATA } from './curriculum/civilCurriculum';
import { ROBOTICS_AUTO_AERO_CURRICULUM_DATA } from './curriculum/roboticsAutoAeroCurriculum';
import { CHEM_BIO_CURRICULUM_DATA } from './curriculum/chemBioCurriculum';
import { AERO_CURRICULUM_DATA } from './curriculum/aeroCurriculum';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  simpleExplanation: string;
  whyNeeded: string;
  howItWorks: string;
  syntax?: string;
  realWorldExample: string;
  codeSnippet: string;
  expectedOutput: string;
  commonMistakes: string[];
  bestPractices: string[];
  practiceQuestion: string;
}

export interface Module {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface CodePracticeExercise {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  requirements: string[];
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  solutionCode: string;
  testCases: { input: string; expected: string }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  topic: string;
}

export interface PracticalTask {
  id: string;
  title: string;
  objective: string;
  steps: string[];
  codeTemplate: string;
  verificationCriteria: string[];
}

export interface SkillCurriculum {
  roadmapStepId: string; // e.g. 'rd-01'
  skillName: string;
  category: string;
  industryDemand: number;
  currentLevel: string;
  targetLevel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  prerequisites: {
    skillName: string;
    stepId?: string;
    isMet: boolean;
    requiredDescription: string;
  }[];
  whatYouWillLearn: string[];
  whyItMattersInIndustry: {
    importanceSummary: string;
    rolesUsingSkill: string[];
    realWorldUsage: string;
    subsequentSkills: string[];
  };
  modules: Module[];
  codePractice: CodePracticeExercise[];
  quiz: QuizQuestion[];
  practicalTasks: PracticalTask[];
  miniProject: {
    title: string;
    description: string;
    techStack: string[];
    deliverables: string[];
    architectureDiagramText?: string;
  };
  assessment: {
    questions: QuizQuestion[];
    passingScore: number;
  };
  capstoneDetails?: {
    progressiveSteps: {
      stepNumber: number;
      title: string;
      layer: string;
      description: string;
      keyCode: string;
    }[];
    interviewQuestions: {
      id: string;
      topic: string;
      question: string;
      keyPointsExpected: string[];
      sampleAnswer: string;
    }[];
  };
}

export const ROADMAP_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // SKILL 1: ADVANCED JAVA & COLLECTIONS MASTERY
  // =========================================================================
  'rd-01': {
    roadmapStepId: 'rd-01',
    skillName: 'Advanced Java & Collections Mastery',
    category: 'Core Language',
    industryDemand: 92,
    currentLevel: 'Intermediate',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 24,
    prerequisites: [
      {
        skillName: 'Basic Java Syntax',
        isMet: true,
        requiredDescription: 'Familiarity with primitive types, variables, loops (for/while), and basic method declaration.'
      }
    ],
    whatYouWillLearn: [
      'Master Object-Oriented principles and choose composition over inheritance in production design',
      'Handle enterprise errors with checked/unchecked exception hierarchies and custom exceptions',
      'Write type-safe, reusable components with Java Generics and wildcards (? extends / ? super)',
      'Choose the optimal Collection (ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap, PriorityQueue)',
      'Understand HashMap hashing internals, hash code collisions, and equals() contracts',
      'Harness Java 8 Streams, lambdas, functional interfaces, collectors, and Optional for clean, declarative processing',
      'Solve production data grouping, transformation, and sorting challenges'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Enterprise backends process hundreds of thousands of transactions per second in memory. Flawed collection choice or broken equals/hashCode contracts cause critical memory leaks and silent data corruption.',
      rolesUsingSkill: ['Java Backend Developer', 'Full Stack Developer', 'Cloud Microservices Engineer'],
      realWorldUsage: 'Used in in-memory caches, trading engines, high-concurrency request routing, and microservice payload serialization.',
      subsequentSkills: ['Relational Database Architecture & JDBC', 'JPA & Hibernate ORM', 'Spring Boot 3 Core']
    },
    modules: [
      {
        id: 'mod-1-1',
        moduleNumber: 1,
        title: 'Advanced Java Foundations & OOP Revision',
        description: 'Deep-dive into encapsulation, abstraction, polymorphic dispatch, and why composition wins over inheritance.',
        lessons: [
          {
            id: 'les-1-1-1',
            title: 'Classes, Objects & Encapsulation',
            duration: '25 mins',
            simpleExplanation: 'Encapsulation is bundling data and the methods that operate on that data into a single unit (class), while hiding internal state details using private fields and providing validated public accessors.',
            whyNeeded: 'Prevents external classes from directly altering private internal state into invalid conditions (e.g. negative salary or null IDs).',
            howItWorks: 'Declare fields with `private` access modifiers. Expose getters for read-access and setters with defensive boundary validation checks.',
            syntax: 'private String field;\npublic String getField() { return this.field; }\npublic void setField(String field) { ... }',
            realWorldExample: 'A BankAccount class ensures balance cannot be set below zero or withdrawn without funds.',
            codeSnippet: `public class BankAccount {
    private final String accountNumber;
    private double balance;

    public BankAccount(String accountNumber, double initialDeposit) {
        if (initialDeposit < 0) throw new IllegalArgumentException("Initial deposit cannot be negative");
        this.accountNumber = accountNumber;
        this.balance = initialDeposit;
    }

    public synchronized void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        this.balance += amount;
    }

    public double getBalance() { return this.balance; }
}`,
            expectedOutput: 'Account initialized safely; unauthorized direct balance mutations prevented at compile and run time.',
            commonMistakes: [
              'Making fields public or package-private without strict necessity.',
              'Returning mutable references directly from getters (e.g., returning Date or List directly instead of unmodifiable copies).'
            ],
            bestPractices: [
              'Make classes immutable whenever possible by using `final` fields and no setters.',
              'Use Java 16+ records for pure data carriers.'
            ],
            practiceQuestion: 'Write an immutable `EmployeeId` record that validates the input format is alphanumeric and exactly 8 characters.'
          },
          {
            id: 'les-1-1-2',
            title: 'Polymorphism, Interfaces & Composition vs Inheritance',
            duration: '35 mins',
            simpleExplanation: 'Polymorphism allows objects of different types to be treated through a single uniform interface. Composition ("has-a") models system behavior by combining small, focused classes rather than deep hierarchical inheritance ("is-a").',
            whyNeeded: 'Deep inheritance hierarchies break easily when parent classes change (fragile base class problem). Composition allows swapping behaviors at runtime without ripple effects.',
            howItWorks: 'Define interfaces representing contracts. Implement contracts via dedicated service classes, and inject those services as private members.',
            syntax: 'public interface PaymentGateway { void process(double amount); }\npublic class OrderService { private final PaymentGateway gateway; ... }',
            realWorldExample: 'An OrderService delegates payment processing to PayPalGateway, StripeGateway, or UPI Gateway without modifying the order logic.',
            codeSnippet: `public interface NotificationChannel {
    void send(String recipient, String message);
}

public class EmailChannel implements NotificationChannel {
    public void send(String recipient, String message) {
        System.out.println("Emailing " + recipient + ": " + message);
    }
}

public class UserNotifier {
    private final NotificationChannel channel; // Composition over Inheritance

    public UserNotifier(NotificationChannel channel) {
        this.channel = channel;
    }

    public void alert(String user, String text) {
        channel.send(user, text);
    }
}`,
            expectedOutput: 'UserNotifier can switch to SMSChannel or SlackChannel seamlessly without changing user logic.',
            commonMistakes: [
              'Extending a class just to reuse one helper method when a helper dependency would suffice.',
              'Violating Liskov Substitution Principle by overriding methods to throw UnsupportedOperationException.'
            ],
            bestPractices: [
              'Favor composition over inheritance (Effective Java Item 18).',
              'Program to an interface, not an implementation.'
            ],
            practiceQuestion: 'Explain why java.util.Stack extending java.util.Vector is considered an architectural flaw.'
          }
        ]
      },
      {
        id: 'mod-1-2',
        moduleNumber: 2,
        title: 'Exception Handling Architecture',
        description: 'Master checked vs unchecked exceptions, try-with-resources, custom enterprise exceptions, and suppression.',
        lessons: [
          {
            id: 'les-1-2-1',
            title: 'Checked vs Unchecked & Custom Enterprise Exceptions',
            duration: '30 mins',
            simpleExplanation: 'Checked exceptions (subclasses of Exception excluding RuntimeException) must be declared in throws or caught. Unchecked exceptions (subclasses of RuntimeException) indicate programming bugs or unrecoverable client errors.',
            whyNeeded: 'Backend services must return structured, clean error messages to clients rather than spilling unhandled raw stack traces.',
            howItWorks: 'Extend `RuntimeException` for modern domain exceptions (e.g. `ResourceNotFoundException`) to integrate cleanly with Spring Web exceptions.',
            syntax: 'public class ResourceNotFoundException extends RuntimeException {\n    public ResourceNotFoundException(String message) { super(message); }\n}',
            realWorldExample: 'When an employee ID is not found in database, throw `EmployeeNotFoundException` so the REST layer maps it to HTTP 404.',
            codeSnippet: `public class ResourceNotFoundException extends RuntimeException {
    private final String resourceName;
    private final Object identifier;

    public ResourceNotFoundException(String resourceName, Object identifier) {
        super(String.format("%s not found with ID: %s", resourceName, identifier));
        this.resourceName = resourceName;
        this.identifier = identifier;
    }

    public String getResourceName() { return resourceName; }
    public Object getIdentifier() { return identifier; }
}`,
            expectedOutput: 'Clean, structured exception that provides context to global error handlers.',
            commonMistakes: [
              'Catching `Exception` or `Throwable` and swallowing it silently with an empty catch block.',
              'Using exceptions for normal control flow (e.g., looping until an index exception is thrown).'
            ],
            bestPractices: [
              'Always preserve the original cause when wrapping exceptions: `throw new CustomException("Failed", cause);`.',
              'Use try-with-resources for any object implementing `AutoCloseable`.'
            ],
            practiceQuestion: 'What is the difference between `final`, `finally`, and `finalize()`?'
          }
        ]
      },
      {
        id: 'mod-1-3',
        moduleNumber: 3,
        title: 'Java Generics & Type Variance',
        description: 'Understand type erasure, generic classes, methods, bounded type parameters, and PECS (Producer Extends, Consumer Super).',
        lessons: [
          {
            id: 'les-1-3-1',
            title: 'Bounded Generics & Wildcards (PECS Rule)',
            duration: '30 mins',
            simpleExplanation: 'Generics enforce compile-time type safety. Wildcards with `? extends T` allow read-only operations from producers, while `? super T` allow write operations for consumers (PECS: Producer Extends, Consumer Super).',
            whyNeeded: 'Enables flexible API design so that a method accepting `List<Number>` can also accept `List<Integer>` safely.',
            howItWorks: 'Use `<? extends T>` when retrieving items from a collection. Use `<? super T>` when adding items into a collection.',
            syntax: 'public static <T> void copy(List<? super T> dest, List<? extends T> src)',
            realWorldExample: 'The standard Collections.copy(dest, src) method uses PECS to copy Integers into a Number list.',
            codeSnippet: `import java.util.List;

public class GenericsUtils {
    // Producer Extends: only reading numbers from the list
    public static double sumOfList(List<? extends Number> list) {
        double s = 0.0;
        for (Number n : list) {
            s += n.doubleValue();
        }
        return s;
    }

    // Consumer Super: adding integers into the list
    public static void addDefaultIntegers(List<? super Integer> list) {
        list.add(10);
        list.add(20);
    }
}`,
            expectedOutput: 'Compile-time safe methods working seamlessly with polymorphic collections.',
            commonMistakes: [
              'Trying to add elements to a `List<? extends Number>` (compiler rejects because exact subtype is unknown).',
              'Relying on raw types like `List list = new ArrayList();` which defeats generics.'
            ],
            bestPractices: [
              'Remember PECS: Producer Extends, Consumer Super.',
              'Eliminate all unchecked warnings in production builds.'
            ],
            practiceQuestion: 'Why cannot you create a generic array such as `new T[10]` in Java?'
          }
        ]
      },
      {
        id: 'mod-1-4',
        moduleNumber: 4,
        title: 'Java Collections Framework Architecture',
        description: 'Complete breakdown of List, Set, Queue, and Map hierarchies, memory models, and algorithmic complexities.',
        lessons: [
          {
            id: 'les-1-4-1',
            title: 'List, Set & Queue Implementations Comparison',
            duration: '35 mins',
            simpleExplanation: 'Lists maintain insertion order with indexed access; Sets enforce unique elements; Queues hold elements prior to processing (FIFO / Priority).',
            whyNeeded: 'Selecting the wrong collection causes quadratic O(N^2) slowdowns in enterprise batch processing.',
            howItWorks: 'ArrayList uses a dynamically resizing array (O(1) random read). LinkedList uses doubly linked nodes. HashSet uses hash-buckets. TreeSet uses a Red-Black self-balancing BST.',
            syntax: 'List<String> list = new ArrayList<>();\nSet<String> set = new HashSet<>();\nQueue<String> queue = new PriorityQueue<>();',
            realWorldExample: 'Order queues in financial systems use PriorityQueue sorted by trade timestamp.',
            codeSnippet: `import java.util.*;

public class CollectionDemo {
    public static void main(String[] args) {
        // Fast random access: O(1)
        List<String> activeUsers = new ArrayList<>(List.of("Alice", "Bob", "Charlie"));

        // Deduplication in O(1) average time
        Set<String> uniqueEmails = new HashSet<>(Set.of("a@corp.com", "b@corp.com"));

        // Ordered priority processing
        Queue<Integer> processingQueue = new PriorityQueue<>();
        processingQueue.addAll(List.of(50, 10, 30));

        System.out.println("Highest priority item: " + processingQueue.poll()); // 10
    }
}`,
            expectedOutput: 'Highest priority item: 10',
            commonMistakes: [
              'Using `LinkedList` expecting better performance for random reads.',
              'Modifying elements used as keys in a Set while stored, which corrupts lookup integrity.'
            ],
            bestPractices: [
              'Default to `ArrayList` for lists and `HashSet` for sets unless sorting or concurrency is explicitly required.',
              'Specify initial capacity when collection size is known in advance to avoid array resizing overhead.'
            ],
            practiceQuestion: 'What is the time complexity of `ArrayList.remove(0)` vs `LinkedList.removeFirst()`?'
          }
        ]
      },
      {
        id: 'mod-1-5',
        moduleNumber: 5,
        title: 'Collections Internals: HashMap, Hashing & Equals Contract',
        description: 'The definitive guide to hashing, bucket collision resolution, treeification (Red-Black Trees), and Comparator vs Comparable.',
        lessons: [
          {
            id: 'les-1-5-1',
            title: 'How HashMap Works Under the Hood',
            duration: '40 mins',
            simpleExplanation: 'A HashMap stores key-value pairs in an array of Node buckets. The index is computed using `(n - 1) & hash(key)`. When multiple keys map to the same bucket, collisions are resolved via linked lists, which convert to Red-Black trees when bucket size exceeds 8 (treeify threshold).',
            whyNeeded: 'This is the most asked technical interview question for Java backend developers and is vital for avoiding performance degradation from poor hash codes.',
            howItWorks: '1. Calls `key.hashCode()`. 2. Applies bitwise hash spread. 3. Locates bucket index. 4. If bucket is empty, creates new Node. 5. If occupied, traverses nodes checking `equals()`.',
            syntax: 'if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))',
            realWorldExample: 'Caching user session tokens in memory indexed by UUID.',
            codeSnippet: `import java.util.Objects;

public class EmployeeKey {
    private final int id;
    private final String department;

    public EmployeeKey(int id, String department) {
        this.id = id;
        this.department = department;
    }

    // MANDATORY: If two objects are equal according to equals(),
    // their hashCode() MUST produce the same integer!
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EmployeeKey that = (EmployeeKey) o;
        return id == that.id && Objects.equals(department, that.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, department);
    }
}`,
            expectedOutput: 'Guaranteed consistent key retrieval in HashMap without silent null returns.',
            commonMistakes: [
              'Overriding `equals()` without overriding `hashCode()`, causing `map.get(key)` to return null for identical keys.',
              'Using mutable fields inside `hashCode()` calculation.'
            ],
            bestPractices: [
              'Always use IDE generation or Java records for `equals` and `hashCode`.',
              'Keep Map keys strictly immutable (e.g., String, Integer, custom immutable records).'
            ],
            practiceQuestion: 'What happens in Java 8 HashMap when a bucket reaches 8 elements and array capacity is at least 64?'
          }
        ]
      },
      {
        id: 'mod-1-6',
        moduleNumber: 6,
        title: 'Java 8+ Features: Lambdas, Streams & Optional',
        description: 'Transform collections declaratively using functional interfaces (Predicate, Function, Consumer), Stream pipeline operations, and Optional.',
        lessons: [
          {
            id: 'les-1-6-1',
            title: 'Stream API: Filter, Map, Reduce & GroupingBy',
            duration: '40 mins',
            simpleExplanation: 'Streams allow functional-style operations on sequences of elements. Streams do not store data; they transform data lazily through intermediate operations (filter, map, sorted) executed upon calling a terminal operation (collect, reduce, count).',
            whyNeeded: 'Replaces bulky, error-prone nested loops and temporary accumulator variables with concise, readable, parallelizable pipelines.',
            howItWorks: 'Stream pipeline consists of: Source (collection) -> Intermediate operations (lazy) -> Terminal operation (eager evaluation trigger).',
            syntax: 'list.stream().filter(predicate).map(function).collect(Collectors.toList());',
            realWorldExample: 'Calculating the average salary of employees per department in an enterprise HR database.',
            codeSnippet: `import java.util.*;
import java.util.stream.Collectors;

record Employee(String name, String dept, double salary) {}

public class StreamMastery {
    public static void main(String[] args) {
        List<Employee> staff = List.of(
            new Employee("Alice", "Engineering", 95000),
            new Employee("Bob", "Engineering", 80000),
            new Employee("Charlie", "Marketing", 65000),
            new Employee("Diana", "Engineering", 120000)
        );

        // Group by department and compute average salary
        Map<String, Double> avgSalaryByDept = staff.stream()
            .collect(Collectors.groupingBy(
                Employee::dept,
                Collectors.averagingDouble(Employee::salary)
            ));

        System.out.println(avgSalaryByDept);
    }
}`,
            expectedOutput: '{Marketing=65000.0, Engineering=98333.33333333333}',
            commonMistakes: [
              'Reusing a Stream after it has already been closed by a terminal operation (throws IllegalStateException).',
              'Using parallel streams carelessly without verifying thread safety and thread-pool saturation.'
            ],
            bestPractices: [
              'Use method references (`Class::method`) whenever the lambda only forwards arguments.',
              'Avoid side-effects inside Stream operations (no mutating outside variables).'
            ],
            practiceQuestion: 'Write a Stream expression to find the highest-paid employee in each department.'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-1-1',
        title: 'Department Salary Aggregator with Streams',
        difficulty: 'Medium',
        description: 'Implement a method that processes a list of employees, filters out those earning below 50,000, and returns a Map containing the department as the key and the total sum of salaries as the value.',
        requirements: [
          'Use Java Streams and Collectors',
          'Filter out salaries < 50,000',
          'Group by department and sum salaries',
          'Return Map<String, Double>'
        ],
        starterCode: `import java.util.*;
import java.util.stream.Collectors;

class Employee {
    String name;
    String department;
    double salary;

    public Employee(String name, String department, double salary) {
        this.name = name;
        this.department = department;
        this.salary = salary;
    }
    public String getDepartment() { return department; }
    public double getSalary() { return salary; }
}

public class Solution {
    public static Map<String, Double> getDepartmentSalaryTotals(List<Employee> employees) {
        // TODO: Write your stream pipeline here
        return Collections.emptyMap();
    }
}`,
        expectedOutput: '{Engineering=175000.0, Product=85000.0}',
        hints: [
          'Use employees.stream().filter(...) to check getSalary() >= 50000',
          'Collect with Collectors.groupingBy(Employee::getDepartment, Collectors.summingDouble(Employee::getSalary))'
        ],
        solutionCode: `public static Map<String, Double> getDepartmentSalaryTotals(List<Employee> employees) {
    return employees.stream()
        .filter(e -> e.getSalary() >= 50000)
        .collect(Collectors.groupingBy(
            Employee::getDepartment,
            Collectors.summingDouble(Employee::getSalary)
        ));
}`,
        testCases: [
          { input: '3 employees (Eng 90k, Eng 85k, Sales 40k)', expected: '{Engineering=175000.0}' },
          { input: 'All below 50k', expected: '{}' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-1-1',
        question: 'What is the default initial capacity and load factor of a standard Java HashMap?',
        options: ['Capacity 16, Load Factor 0.75', 'Capacity 10, Load Factor 0.5', 'Capacity 32, Load Factor 0.8', 'Capacity 8, Load Factor 0.65'],
        correctAnswerIndex: 0,
        explanation: 'Default capacity is 16 and default load factor is 0.75, which offers a recognized tradeoff between memory overhead and lookup frequency.',
        topic: 'Collections Internals'
      },
      {
        id: 'qz-1-2',
        question: 'If two objects are equal according to equals(), what must be true about their hashCodes?',
        options: [
          'Their hashCodes must be identical',
          'Their hashCodes must be different',
          'Their hashCodes may or may not be equal',
          'Hash codes only matter for TreeSet'
        ],
        correctAnswerIndex: 0,
        explanation: 'The Java Object specification dictates: If o1.equals(o2), then o1.hashCode() MUST equal o2.hashCode().',
        topic: 'Equals & HashCode Contract'
      },
      {
        id: 'qz-1-3',
        question: 'Which of the following Stream operations is a terminal operation?',
        options: ['filter()', 'map()', 'collect()', 'sorted()'],
        correctAnswerIndex: 2,
        explanation: 'collect() triggers the execution of the pipeline and closes the stream. filter, map, and sorted are intermediate and lazy.',
        topic: 'Stream API'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-1-1',
        title: 'Build a Custom In-Memory LRU Cache',
        objective: 'Implement a Least Recently Used (LRU) Cache using LinkedHashMap or custom doubly-linked nodes and HashMap.',
        steps: [
          'Create class LRUCache<K, V> with maximum capacity',
          'Implement get(K key) in O(1) time moving accessed item to front',
          'Implement put(K key, V value) evicting oldest item when capacity exceeded',
          'Write a unit test simulating 1,000 concurrent reads and writes'
        ],
        codeTemplate: `public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // accessOrder = true
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity;
    }
}`,
        verificationCriteria: [
          'O(1) time complexity for get and put',
          'Oldest element properly evicted when size > capacity',
          'Passes all unit test assertion checks'
        ]
      }
    ],
    miniProject: {
      title: 'Employee Data Processing & Analytics Engine',
      description: 'A modular Java engine that ingests CSV employee records, applies validation rules with custom exceptions, computes salary distributions via Streams, and handles concurrent data exports.',
      techStack: ['Java 17+', 'Collections Framework', 'Streams API', 'Generics', 'Custom Exceptions'],
      deliverables: [
        'Employee record validation schema with custom validation exceptions',
        'In-memory indexed employee repository using HashMap and TreeMap',
        'Stream processing pipeline for multi-criteria filtering and department grouping',
        'Export module converting analytics into clean JSON/CSV payloads'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-1-1',
          question: 'What happens when a HashMap collision bucket exceeds 8 nodes in Java 8+?',
          options: [
            'It treeifies into a Red-Black TreeNode if table capacity is at least 64',
            'It throws a BucketOverflowException',
            'It expands the table to 128 elements immediately',
            'It overwrites the oldest element'
          ],
          correctAnswerIndex: 0,
          explanation: 'TREEIFY_THRESHOLD is 8. When bucket count reaches 8 and min capacity is 64, the linked list converts to a Red-Black Tree for O(log N) lookup.',
          topic: 'HashMap Internals'
        },
        {
          id: 'as-1-2',
          question: 'Which wildcard signature allows reading items of type Number from a List?',
          options: ['List<? extends Number>', 'List<? super Number>', 'List<Object>', 'List<?> without casting'],
          correctAnswerIndex: 0,
          explanation: 'PECS: Producer Extends. If you need to read from a collection of Numbers, use ? extends Number.',
          topic: 'Generics'
        },
        {
          id: 'as-1-3',
          question: 'What is the outcome of attempting to call stream.forEach() twice on the same Stream instance?',
          options: ['IllegalStateException: stream has already been operated upon or closed', 'It executes normally twice', 'It returns an empty stream', 'Compilation error'],
          correctAnswerIndex: 0,
          explanation: 'Java Streams are single-use consumable pipelines. Once a terminal operation executes, the stream is exhausted.',
          topic: 'Stream Lifecycle'
        },
        {
          id: 'as-1-4',
          question: 'Why should you avoid throwing generic Exception or Throwable in service methods?',
          options: [
            'It obscures error causes and prevents callers from handling specific failures accurately',
            'It causes high memory consumption',
            'JVM does not allow throwing Exception',
            'It bypasses try-catch blocks'
          ],
          correctAnswerIndex: 0,
          explanation: 'Specific domain exceptions allow caller layers (like Spring @ExceptionHandler) to return distinct HTTP status codes (e.g. 404 vs 400).',
          topic: 'Exception Architecture'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 2: RELATIONAL DATABASE ARCHITECTURE & JDBC
  // =========================================================================
  'rd-02': {
    roadmapStepId: 'rd-02',
    skillName: 'Relational Database Architecture & JDBC',
    category: 'Persistence',
    industryDemand: 88,
    currentLevel: 'Intermediate',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 20,
    prerequisites: [
      {
        skillName: 'Advanced Java & Collections Mastery',
        stepId: 'rd-01',
        isMet: true,
        requiredDescription: 'Understanding of Java classes, interfaces, exception handling, and collections.'
      }
    ],
    whatYouWillLearn: [
      'RDBMS architecture, schemas, ACID properties, primary keys, foreign keys, and integrity constraints',
      'Complex SQL querying: JOINs (INNER, LEFT, RIGHT, SELF), GROUP BY, HAVING, subqueries, and EXISTS',
      'Advanced SQL Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), and running totals with PARTITION BY',
      'Java Database Connectivity (JDBC) Driver, Connection, Statement, PreparedStatement, and ResultSet',
      'Securing applications against SQL Injection vulnerabilities using parameterized PreparedStatements',
      'Transaction demarcation (commit, rollback, savepoints) and HikariCP connection pooling'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Data is the core asset of every enterprise. Inability to optimize SQL queries or improper connection handling results in slow page loads, database thread exhaustion, and severe security breaches.',
      rolesUsingSkill: ['Java Backend Developer', 'Database Engineer', 'Full Stack Developer'],
      realWorldUsage: 'Used in transactional order processing, financial accounting ledgers, reporting analytics, and high-speed data migration pipelines.',
      subsequentSkills: ['JPA & Hibernate ORM', 'Spring Boot 3 Core & Architecture']
    },
    modules: [
      {
        id: 'mod-2-1',
        moduleNumber: 1,
        title: 'Database Fundamentals & Relational Modeling',
        description: 'Explore relational database management systems, normalization, tables, keys, and ACID transaction properties.',
        lessons: [
          {
            id: 'les-2-1-1',
            title: 'RDBMS Architecture & ACID Properties',
            duration: '25 mins',
            simpleExplanation: 'An RDBMS stores structured data in tables with relationships enforced by constraints. ACID stands for Atomicity (all or nothing), Consistency (valid state transitions), Isolation (independent transactions), and Durability (permanent writes).',
            whyNeeded: 'Guarantees that financial transactions (e.g. debiting one account and crediting another) never leave the database in an inconsistent state even during hardware crashes.',
            howItWorks: 'Databases use Write-Ahead Logging (WAL) and locking/MVCC (Multi-Version Concurrency Control) to provide durability and isolation.',
            syntax: 'START TRANSACTION;\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\nCOMMIT;',
            realWorldExample: 'ATM withdrawal: cash is dispensed only if bank account deduction commits successfully.',
            codeSnippet: `-- Schema definition with constraints
CREATE TABLE departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    salary DECIMAL(10, 2) CHECK (salary > 0),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);`,
            expectedOutput: 'Normalized relational schema with primary and foreign key integrity constraints.',
            commonMistakes: [
              'Omitting foreign key constraints and trying to manage relational integrity solely in application code.',
              'Ignoring database indexes on frequently filtered and joined columns.'
            ],
            bestPractices: [
              'Always define explicit NOT NULL and UNIQUE constraints where appropriate.',
              'Design schemas to at least 3rd Normal Form (3NF) to eliminate data redundancy.'
            ],
            practiceQuestion: 'What anomaly does the Isolation property prevent in concurrent database access?'
          }
        ]
      },
      {
        id: 'mod-2-2',
        moduleNumber: 2,
        title: 'SQL Foundations, Joins & Subqueries',
        description: 'Master INNER, LEFT, RIGHT, and SELF JOINs, aggregation functions, and correlated subqueries.',
        lessons: [
          {
            id: 'les-2-2-1',
            title: 'Mastering SQL Joins & Aggregations',
            duration: '35 mins',
            simpleExplanation: 'JOINs combine rows from two or more tables based on a related column. INNER JOIN returns matching rows; LEFT JOIN returns all rows from the left table plus matching rows from the right; SELF JOIN joins a table to itself (e.g. employee to manager).',
            whyNeeded: 'Real-world data is split across multiple tables to avoid duplication. Joins assemble the unified view required by clients.',
            howItWorks: 'Database query optimizer selects Hash Join, Merge Join, or Nested Loop Join based on table statistics and indexes.',
            syntax: 'SELECT e.full_name, d.dept_name \nFROM employees e \nLEFT JOIN departments d ON e.dept_id = d.dept_id;',
            realWorldExample: 'Finding all employees and their respective manager names from a single employees table.',
            codeSnippet: `-- Self Join to resolve hierarchical Manager relationship
SELECT 
    e.full_name AS EmployeeName,
    COALESCE(m.full_name, 'Top Executive') AS ManagerName,
    d.dept_name AS Department
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.emp_id
LEFT JOIN departments d ON e.dept_id = d.dept_id
ORDER BY d.dept_name, e.full_name;`,
            expectedOutput: 'Tabular list showing employees paired with their managers and departments.',
            commonMistakes: [
              'Confusing WHERE with HAVING (WHERE filters individual rows before grouping; HAVING filters aggregated groups).',
              'Writing cross-joins (Cartesian products) inadvertently by omitting join conditions.'
            ],
            bestPractices: [
              'Always use explicit modern JOIN ... ON syntax instead of comma-separated FROM tables.',
              'Filter early in the query to minimize the number of rows processed by joins.'
            ],
            practiceQuestion: 'What is the difference between COUNT(*) and COUNT(column_name)?'
          }
        ]
      },
      {
        id: 'mod-2-3',
        moduleNumber: 3,
        title: 'Window Functions: ROW_NUMBER, RANK & DENSE_RANK',
        description: 'Crucial interview topic: understand analytic window functions, PARTITION BY, and running calculations.',
        lessons: [
          {
            id: 'les-2-3-1',
            title: 'ROW_NUMBER() vs RANK() vs DENSE_RANK() with Examples',
            duration: '35 mins',
            simpleExplanation: 'Window functions perform calculations across a set of rows related to the current row without collapsing rows into a single summary. ROW_NUMBER assigns a strictly unique sequential integer; RANK assigns ranks with gaps when ties occur (1, 2, 2, 4); DENSE_RANK assigns ranks without gaps (1, 2, 2, 3).',
            whyNeeded: 'Essential for finding the Nth highest salary per department, leaderboards, pagination, and running financial metrics.',
            howItWorks: 'The OVER clause defines the window partition and ordering for calculation.',
            syntax: 'DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)',
            realWorldExample: 'Finding the top 3 highest-earning employees in every department.',
            codeSnippet: `-- Find top 2 highest salaries per department using DENSE_RANK
WITH RankedStaff AS (
    SELECT 
        emp_id,
        full_name,
        dept_id,
        salary,
        DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as salary_rank
    FROM employees
)
SELECT * FROM RankedStaff WHERE salary_rank <= 2;`,
            expectedOutput: 'Lists top 2 distinct highest salary holders for each department.',
            commonMistakes: [
              'Attempting to put window functions in a WHERE clause directly (must use CTE or subquery).',
              'Confusing RANK() and DENSE_RANK() when ties must be reported without skipped rank indices.'
            ],
            bestPractices: [
              'Use CTEs (Common Table Expressions) with `WITH` for readable window function queries.',
              'Ensure indexes exist on columns specified in PARTITION BY and ORDER BY.'
            ],
            practiceQuestion: 'Given salaries [100k, 90k, 90k, 80k], what will ROW_NUMBER, RANK, and DENSE_RANK produce for the 4th row?'
          }
        ]
      },
      {
        id: 'mod-2-4',
        moduleNumber: 4,
        title: 'JDBC Architecture & Secure CRUD Operations',
        description: 'Connect Java to relational databases via JDBC, implement PreparedStatement, and prevent SQL injection attacks.',
        lessons: [
          {
            id: 'les-2-4-1',
            title: 'PreparedStatement vs Statement & SQL Injection Prevention',
            duration: '40 mins',
            simpleExplanation: 'JDBC is Java’s low-level database connectivity API. Statement interpolates raw strings into SQL, leaving apps vulnerable to disastrous SQL Injection. PreparedStatement precompiles the query and sends parameters separately, guaranteeing parameters are treated strictly as data, never executable code.',
            whyNeeded: 'SQL Injection has ranked in the OWASP Top 10 for decades. A single unparameterized query can let attackers bypass authentication or delete entire databases.',
            howItWorks: 'The database server parses and compiles the query template containing `?` placeholders before values are bound.',
            syntax: 'PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM users WHERE email = ? AND password = ?");\npstmt.setString(1, email);',
            realWorldExample: 'User login authentication checking email and password hash.',
            codeSnippet: `import java.sql.*;

public class UserDao {
    private final Connection connection;

    public UserDao(Connection connection) {
        this.connection = connection;
    }

    public boolean validateUser(String email, String passwordHash) throws SQLException {
        // SECURE: Uses PreparedStatement with positional parameter binding
        String sql = "SELECT emp_id FROM employees WHERE email = ? AND password_hash = ?";
        
        try (PreparedStatement pstmt = connection.prepareStatement(sql)) {
            pstmt.setString(1, email);
            pstmt.setString(2, passwordHash);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                return rs.next(); // True if record exists
            }
        }
    }
}`,
            expectedOutput: 'Safe query execution immune to malicious input like "\' OR 1=1 --".',
            commonMistakes: [
              'Using string concatenation inside a PreparedStatement: `conn.prepareStatement("SELECT * FROM u WHERE id=" + id);`.',
              'Failing to close ResultSet, Statement, and Connection (leads to connection pool exhaustion).'
            ],
            bestPractices: [
              'Always use try-with-resources for Connection, PreparedStatement, and ResultSet.',
              'Use connection pools like HikariCP instead of opening a new physical connection for each request.'
            ],
            practiceQuestion: 'Why is closing a Connection obtained from a connection pool different from closing a raw JDBC Connection?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-2-1',
        title: 'Safe JDBC Employee Insertion with Generated Keys',
        difficulty: 'Medium',
        description: 'Implement a method that securely inserts a new employee into the database using a PreparedStatement and retrieves the database-generated primary key ID.',
        requirements: [
          'Use PreparedStatement with RETURN_GENERATED_KEYS',
          'Safely bind name, email, and salary',
          'Retrieve and return the generated int ID',
          'Handle SQLException gracefully'
        ],
        starterCode: `import java.sql.*;

public class EmployeeDao {
    public static int insertEmployee(Connection conn, String name, String email, double salary) throws SQLException {
        String sql = "INSERT INTO employees (full_name, email, salary) VALUES (?, ?, ?)";
        // TODO: Prepare statement, bind parameters, execute, and retrieve generated ID
        return -1;
    }
}`,
        expectedOutput: 'Returns generated primary key (e.g. 1042)',
        hints: [
          'Pass Statement.RETURN_GENERATED_KEYS to conn.prepareStatement(sql, ...)',
          'Call pstmt.getGeneratedKeys() after executeUpdate()'
        ],
        solutionCode: `public static int insertEmployee(Connection conn, String name, String email, double salary) throws SQLException {
    String sql = "INSERT INTO employees (full_name, email, salary) VALUES (?, ?, ?)";
    try (PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
        pstmt.setString(1, name);
        pstmt.setString(2, email);
        pstmt.setDouble(3, salary);
        pstmt.executeUpdate();
        try (ResultSet rs = pstmt.getGeneratedKeys()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
    }
    return -1;
}`,
        testCases: [
          { input: 'name: "Rajesh", email: "r@test.com", salary: 75000', expected: 'Positive integer ID > 0' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-2-1',
        question: 'Given rows with values [100, 100, 80], what does DENSE_RANK() assign to the third row?',
        options: ['Rank 2', 'Rank 3', 'Rank 1', 'Rank 4'],
        correctAnswerIndex: 0,
        explanation: 'DENSE_RANK assigns rank 1 to both 100s, and because it has no gaps, the next distinct value (80) receives Rank 2. (Standard RANK would have assigned Rank 3).',
        topic: 'Window Functions'
      },
      {
        id: 'qz-2-2',
        question: 'Why does PreparedStatement prevent SQL injection attacks?',
        options: [
          'The SQL structure is precompiled by the database; input values are treated strictly as literal data, never executed as code',
          'It automatically encrypts user input with AES-256',
          'It strips all single quotes from the input strings',
          'It runs in a sandbox process'
        ],
        correctAnswerIndex: 0,
        explanation: 'Parameter values are transferred across the database protocol separately from the compiled SQL command statement.',
        topic: 'Database Security'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-2-1',
        title: 'Batch Insert Benchmark with HikariCP',
        objective: 'Measure performance improvement when using JDBC batch execution for 5,000 employee records compared to single-record inserts.',
        steps: [
          'Configure a HikariConfig with MySQL connection pool',
          'Implement loop calling pstmt.addBatch() and pstmt.executeBatch() every 500 records',
          'Measure and display execution duration with System.currentTimeMillis()'
        ],
        codeTemplate: `pstmt = conn.prepareStatement("INSERT INTO logs (message) VALUES (?)");
for (int i = 0; i < 5000; i++) {
    pstmt.setString(1, "Log message #" + i);
    pstmt.addBatch();
    if (i % 500 == 0) pstmt.executeBatch();
}
pstmt.executeBatch();`,
        verificationCriteria: [
          'Batch execution finishes at least 5x faster than 5,000 discrete round-trips',
          'All 5,000 records successfully committed to database'
        ]
      }
    ],
    miniProject: {
      title: 'Transactional Banking Ledger System',
      description: 'A pure Java + JDBC + MySQL banking ledger that handles concurrent fund transfers with ACID rollback guarantees and transaction audit logging.',
      techStack: ['Java 17', 'JDBC', 'MySQL 8.0', 'HikariCP'],
      deliverables: [
        'Normalized schema: Accounts, Transactions, AuditLog',
        'Transfer service executing dual-account debit/credit within `conn.setAutoCommit(false)` block',
        'Rollback handler reverting debit if credit fails or network disconnects',
        'Window function query reporting daily account balance moving averages'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-2-1',
          question: 'What happens if you execute a database operation with autoCommit=false and the program terminates before calling commit()?',
          options: [
            'The database automatically rolls back the pending uncommitted transaction',
            'The changes are permanently committed anyway',
            'The database locks indefinitely and crashes',
            'Data is saved to a temporary table'
          ],
          correctAnswerIndex: 0,
          explanation: 'Standard ACID semantics dictate that any uncommitted open transaction is discarded/rolled back upon connection closure or disconnect.',
          topic: 'Transactions'
        },
        {
          id: 'as-2-2',
          question: 'What is the key difference between WHERE and HAVING in SQL?',
          options: [
            'WHERE filters individual rows before grouping; HAVING filters aggregated groups after GROUP BY',
            'HAVING is used for string comparisons; WHERE is for numbers',
            'WHERE cannot be used with indexed columns',
            'HAVING is only valid inside subqueries'
          ],
          correctAnswerIndex: 0,
          explanation: 'WHERE acts on the raw row stream. HAVING evaluates expressions over groups produced by GROUP BY (e.g. HAVING COUNT(*) > 5).',
          topic: 'SQL Foundations'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 3: JPA & HIBERNATE ORM
  // =========================================================================
  'rd-03': {
    roadmapStepId: 'rd-03',
    skillName: 'JPA & Hibernate ORM',
    category: 'ORM Architecture',
    industryDemand: 72,
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedHours: 28,
    prerequisites: [
      {
        skillName: 'Advanced Java & Collections Mastery',
        stepId: 'rd-01',
        isMet: true,
        requiredDescription: 'Java OOP, Generics, and Collections.'
      },
      {
        skillName: 'Relational Database Architecture & JDBC',
        stepId: 'rd-02',
        isMet: true,
        requiredDescription: 'Tables, keys, foreign keys, relationships, and SQL queries.'
      }
    ],
    whatYouWillLearn: [
      'Why ORM exists and how it eliminates repetitive JDBC boilerplate and Object-Relational Impedance Mismatch',
      'Entity mapping with JPA annotations: @Entity, @Table, @Id, @GeneratedValue, @Column, @Enumerated',
      'Entity Lifecycle states: Transient, Persistent/Managed, Detached, and Removed',
      'Mastering Entity Relationships: @OneToOne, @OneToMany, @ManyToOne, @ManyToMany, mappedBy, and CascadeType',
      'FetchType strategies (LAZY vs EAGER) and diagnosing / solving the dreaded N+1 Query Problem with JOIN FETCH',
      'Writing type-safe JPQL (Java Persistence Query Language) and Spring Data JPA Repository methods'
    ],
    whyItMattersInIndustry: {
      importanceSummary: '90%+ of enterprise Java backends build on Spring Data JPA and Hibernate. Developers who lack understanding of Hibernate persistence context and lazy loading cause severe production outages and memory bottlenecks.',
      rolesUsingSkill: ['Java Backend Developer', 'Spring Boot Engineer', 'Enterprise Application Architect'],
      realWorldUsage: 'Enterprise ERP systems, e-commerce order persistence, user management, and multi-entity relationship mapping.',
      subsequentSkills: ['Spring Boot 3 Core & Architecture', 'RESTful API Engineering & Best Practices']
    },
    modules: [
      {
        id: 'mod-3-1',
        moduleNumber: 1,
        title: 'Why ORM & Object-Relational Impedance Mismatch',
        description: 'Understand the mismatch between Java object graphs (inheritance, encapsulation) and relational tables (foreign keys, joins).',
        lessons: [
          {
            id: 'les-3-1-1',
            title: 'JDBC Pain Points & The ORM Solution',
            duration: '25 mins',
            simpleExplanation: 'In raw JDBC, developers must write dozens of lines of tedious code to read ResultSet columns, instantiate objects, and map foreign keys. Object-Relational Mapping (ORM) frameworks like Hibernate automate this bridge.',
            whyNeeded: 'Saves up to 60% of boilerplate code and lets developers work with rich Java domain entities rather than tabular column indices.',
            howItWorks: 'JPA is the specification (standard interfaces). Hibernate is the industry-standard implementation that generates the underlying SQL.',
            syntax: 'JPA (Interface) <--- Implemented by ---> Hibernate (Engine) <--- Connects to ---> Database (MySQL)',
            realWorldExample: 'Loading an Employee entity along with their Department object with a single call to `repository.findById(id)`.',
            codeSnippet: `// Raw JDBC required 20 lines of resultSet.getString("first_name")...
// With JPA / Hibernate, loading an entity is 1 line:
Employee emp = entityManager.find(Employee.class, 101);
System.out.println(emp.getDepartment().getName());`,
            expectedOutput: 'Object retrieved and mapped automatically without manual ResultSet parsing.',
            commonMistakes: [
              'Thinking JPA and Hibernate are two competing frameworks (JPA is the standard spec; Hibernate is the implementation).',
              'Treating entities as simple database tables rather than active domain objects.'
            ],
            bestPractices: [
              'Code against the standard `jakarta.persistence.*` annotations rather than vendor-specific Hibernate annotations where possible.'
            ],
            practiceQuestion: 'What is Object-Relational Impedance Mismatch in terms of inheritance?'
          }
        ]
      },
      {
        id: 'mod-3-2',
        moduleNumber: 2,
        title: 'JPA Fundamentals & Entity Lifecycle',
        description: 'Deep dive into @Entity, @Id, @GeneratedValue, Persistence Context, and the 4 Entity Lifecycle states.',
        lessons: [
          {
            id: 'les-3-2-1',
            title: 'The 4 Entity States: Transient, Managed, Detached, Removed',
            duration: '35 mins',
            simpleExplanation: '1. Transient: newly created Java object not yet associated with any DB row. 2. Managed: associated with the Persistence Context; changes are automatically tracked and flushed to DB (Dirty Checking). 3. Detached: persistence context closed, object is no longer tracked. 4. Removed: scheduled for deletion.',
            whyNeeded: 'Understanding this prevents the confusion of why setters alter the database without calling save() (Dirty Checking) and avoids LazyInitializationException.',
            howItWorks: 'EntityManager maintains a first-level cache. During transaction commit, it flushes dirty entities to SQL UPDATE statements.',
            syntax: 'em.persist(entity); // Transient -> Managed\nem.detach(entity);  // Managed -> Detached\nem.merge(entity);   // Detached -> Managed\nem.remove(entity);  // Managed -> Removed',
            realWorldExample: 'Updating an employee salary: retrieving the entity and calling `emp.setSalary(95000)` triggers an automatic SQL update upon transaction commit.',
            codeSnippet: `@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private double salary;

    // Default no-arg constructor required by JPA specification!
    public Employee() {}

    public Employee(String fullName, String email, double salary) {
        this.fullName = fullName;
        this.email = email;
        this.salary = salary;
    }
    // Getters and Setters...
}`,
            expectedOutput: 'Database table "employees" automatically mapped with primary key autoincrement.',
            commonMistakes: [
              'Forgetting the mandatory no-argument constructor required by JPA reflection proxies.',
              'Calling `save()` repeatedly inside a transaction when Dirty Checking already handles updates automatically.'
            ],
            bestPractices: [
              'Use `GenerationType.IDENTITY` or `GenerationType.SEQUENCE` for primary key generation.',
              'Keep entities lightweight and avoid putting presentation or UI logic inside them.'
            ],
            practiceQuestion: 'What happens if you modify a field on an entity while it is in the Detached state?'
          }
        ]
      },
      {
        id: 'mod-3-3',
        moduleNumber: 3,
        title: 'Entity Relationships: OneToMany, ManyToOne & MappedBy',
        description: 'Complete mastery of bidirectional relationships, foreign key ownership with mappedBy, and Cascade types.',
        lessons: [
          {
            id: 'les-3-3-1',
            title: 'Modeling Bidirectional @ManyToOne and @OneToMany',
            duration: '40 mins',
            simpleExplanation: 'In a bidirectional relationship, the child entity (e.g. Employee) owns the foreign key column with `@ManyToOne @JoinColumn`, while the parent entity (e.g. Department) specifies `mappedBy = "department"` on `@OneToMany` to declare that it is the inverse side.',
            whyNeeded: 'Failing to specify `mappedBy` causes Hibernate to create an unnecessary and slow join table (e.g. `department_employees`).',
            howItWorks: 'The entity without `mappedBy` is the relationship owner and manages the physical foreign key column.',
            syntax: '@OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)\nprivate List<Employee> employees = new ArrayList<>();',
            realWorldExample: 'A Department has many Employees; each Employee belongs to one Department.',
            codeSnippet: `@Entity
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Inverse side: does NOT own the foreign key column
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employees = new ArrayList<>();

    public void addEmployee(Employee emp) {
        employees.add(emp);
        emp.setDepartment(this); // Helper method synchronizes both sides in memory
    }
}

@Entity
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    // Owner side: contains the physical foreign key column
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
}`,
            expectedOutput: 'Clean database schema with a single "department_id" foreign key column on the employees table.',
            commonMistakes: [
              'Omitting `mappedBy` on the @OneToMany side, forcing Hibernate to generate an extra join table.',
              'Not synchronizing both sides of a bidirectional relationship in memory using helper methods.'
            ],
            bestPractices: [
              'Always use `fetch = FetchType.LAZY` on `@ManyToOne` and `@OneToOne` associations (default is EAGER, which is an anti-pattern).',
              'Include defensive helper methods like `addEmployee()` to maintain bidirectional consistency.'
            ],
            practiceQuestion: 'What does `orphanRemoval = true` do when an item is removed from a parent entity collection?'
          }
        ]
      },
      {
        id: 'mod-3-4',
        moduleNumber: 4,
        title: 'Hibernate Performance: N+1 Problem & JOIN FETCH',
        description: 'Understand the most critical performance bug in enterprise JPA applications and how to resolve it with JOIN FETCH and EntityGraphs.',
        lessons: [
          {
            id: 'les-3-4-1',
            title: 'Diagnosing and Fixing the N+1 Query Bottleneck',
            duration: '35 mins',
            simpleExplanation: 'The N+1 problem occurs when an application executes 1 query to fetch N parent records, and then executes N additional individual queries to fetch child associations when iterating over the parents.',
            whyNeeded: 'Fetching 1,000 orders triggers 1,001 database network queries, causing latency to spike from 10ms to several seconds.',
            howItWorks: 'Instead of default lazy proxy queries, a JPQL `JOIN FETCH` retrieves parent and child records together in a single optimized SQL JOIN.',
            syntax: 'SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees',
            realWorldExample: 'Loading 50 departments and their employees in one SQL statement instead of 51 queries.',
            codeSnippet: `public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // Problematic: departmentRepo.findAll() causes 1 + N queries when accessing employees!

    // SOLVED: Single query fetching departments and employees in 1 round trip
    @Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees")
    List<Department> findAllWithEmployees();
}`,
            expectedOutput: 'Executes exactly 1 SQL query: SELECT d.*, e.* FROM departments d LEFT JOIN employees e ON d.id = e.department_id.',
            commonMistakes: [
              'Changing `FetchType.LAZY` to `FetchType.EAGER` thinking it solves the problem (EAGER still triggers N queries with findAll()!).',
              'Joining multiple `@OneToMany` collections with `JOIN FETCH` simultaneously (causes a Cartesian product explosion).'
            ],
            bestPractices: [
              'Keep associations LAZY and write dedicated `@Query` methods with `JOIN FETCH` for pages that require the child data.',
              'Monitor executed SQL queries in dev mode using `spring.jpa.show-sql=true` or DataSource-Proxy.'
            ],
            practiceQuestion: 'Why does `@EntityGraph` offer a cleaner alternative to writing explicit `JOIN FETCH` in JPQL?'
          }
        ]
      },
      {
        id: 'mod-3-5',
        moduleNumber: 5,
        title: 'Spring Data JPA Repositories & Derived Queries',
        description: 'Leverage JpaRepository to eliminate DAO boilerplate, write derived query methods, and implement pagination.',
        lessons: [
          {
            id: 'les-3-5-1',
            title: 'JpaRepository Magic, Query Methods & Pagination',
            duration: '30 mins',
            simpleExplanation: 'Spring Data JPA generates repository implementations automatically at runtime from interface definitions. You simply declare method signatures like `findByDepartmentNameAndSalaryGreaterThan(String dept, double minSalary)`.',
            whyNeeded: 'Eliminates repetitive CRUD code and provides built-in pagination (`Pageable`) and sorting out of the box.',
            howItWorks: 'Spring analyzes method names matching entity property names and builds the corresponding JPQL query AST dynamically.',
            syntax: 'Page<Employee> findBySalaryGreaterThan(double salary, Pageable pageable);',
            realWorldExample: 'Paginating 10,000 employees with 20 items per page sorted by joining date.',
            codeSnippet: `import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Derived query method
    List<Employee> findByDepartmentNameIgnoreCase(String deptName);

    // Derived query with multiple conditions
    List<Employee> findBySalaryBetween(double min, double max);

    // Built-in pagination and sorting
    Page<Employee> findByDepartmentId(Long deptId, Pageable pageable);
}`,
            expectedOutput: 'Instantly usable repository with full CRUD, pagination, and type-safe query capability.',
            commonMistakes: [
              'Creating excessively long method names (e.g. 5+ parameters) instead of using `@Query`.',
              'Calling `findAll()` without a `Pageable` in production with tables containing millions of rows.'
            ],
            bestPractices: [
              'Always use `Pageable` for endpoints returning list data to prevent OutOfMemoryErrors.',
              'Use `@Query` with named parameters (`:paramName`) when query logic becomes moderately complex.'
            ],
            practiceQuestion: 'What is the return type difference between `Page<T>` and `Slice<T>` in Spring Data JPA?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-3-1',
        title: 'Fix the N+1 Query Bug in Department Listing',
        difficulty: 'Medium',
        description: 'Write a custom Spring Data JPA repository query using JPQL that fetches all departments and their associated employees in a single query using JOIN FETCH to eliminate N+1 latency.',
        requirements: [
          'Write a JPQL query string with @Query annotation',
          'Use LEFT JOIN FETCH on department.employees',
          'Ensure DISTINCT is applied to prevent duplicate department instances in memory'
        ],
        starterCode: `import org.springframework.data.jpa.repository.*;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    // TODO: Add @Query with JPQL JOIN FETCH to solve N+1 problem
    List<Department> findAllDepartmentsWithEmployees();
}`,
        expectedOutput: 'SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees',
        hints: [
          'Start with @Query("SELECT DISTINCT d FROM Department d ...")',
          'Include LEFT JOIN FETCH d.employees'
        ],
        solutionCode: `@Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees")
List<Department> findAllDepartmentsWithEmployees();`,
        testCases: [
          { input: 'Department with 3 employees', expected: 'Single SQL SELECT query executed with LEFT OUTER JOIN' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-3-1',
        question: 'What is the purpose of mappedBy in a bidirectional @OneToMany / @ManyToOne relationship?',
        options: [
          'It indicates that this side is the inverse side and does not own the database foreign key column',
          'It maps the entity to a specific database schema name',
          'It forces Hibernate to use EAGER loading',
          'It specifies the primary key data type'
        ],
        correctAnswerIndex: 0,
        explanation: 'mappedBy tells Hibernate: "Look at the field on the other entity to see who owns this relationship; do not generate an unnecessary join table here."',
        topic: 'JPA Relationships'
      },
      {
        id: 'qz-3-2',
        question: 'Why does Hibernate throw LazyInitializationException?',
        options: [
          'A lazy association is accessed after the Persistence Context / Session has already closed',
          'The database driver was not found on the classpath',
          'The primary key is null',
          'The transaction isolation level is too strict'
        ],
        correctAnswerIndex: 0,
        explanation: 'When an entity is detached (session closed), accessing an uninitialized lazy proxy fails because there is no open DB connection to execute the select query.',
        topic: 'Hibernate Internals'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-3-1',
        title: 'Model an E-Commerce Entity Relationship Graph',
        objective: 'Implement Customer, Order, OrderItem, and Product entities with appropriate cascade types, lazy loading, and bidirectional helper methods.',
        steps: [
          'Create @Entity classes with appropriate @Id identity generators',
          'Configure @OneToMany from Customer to Order with mappedBy="customer"',
          'Configure @ManyToOne from OrderItem to Product with FetchType.LAZY',
          'Verify schema generation in MySQL with show-sql=true'
        ],
        codeTemplate: `@Entity
public class CustomerOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}`,
        verificationCriteria: [
          'Foreign keys correctly placed on child tables',
          'No join tables generated for OneToMany associations',
          'Lazy loading verified without session leaks'
        ]
      }
    ],
    miniProject: {
      title: 'Enterprise Employee & Department Persistence Module',
      description: 'A complete JPA & Hibernate persistence module connecting Java models to MySQL with bidirectional relationships, paginated repository queries, and custom JPQL reports.',
      techStack: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'Hibernate 6', 'MySQL 8.0'],
      deliverables: [
        'Entities: Employee, Department, Project, Address with proper relationship mapping',
        'Repository interfaces with derived query methods and @Query join fetches',
        'Service layer demonstrating transactional dirty checking updates',
        'Unit tests verifying zero N+1 queries using query count assertion tools'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-3-1',
          question: 'What is Dirty Checking in Hibernate?',
          options: [
            'Automatic detection of entity state modifications during a transaction, triggering SQL UPDATE on commit without calling save()',
            'Validating entity fields against SQL injection characters',
            'Checking if database connection pool contains stale connections',
            'Scanning code for unused imports'
          ],
          correctAnswerIndex: 0,
          explanation: 'Hibernate compares entity snapshot state when the transaction ends and automatically flushes updates for all modified managed entities.',
          topic: 'Hibernate Internals'
        },
        {
          id: 'as-3-2',
          question: 'Why should `@ManyToOne` associations always be configured with `fetch = FetchType.LAZY`?',
          options: [
            'Default is EAGER, which causes unnecessary database joins or queries whenever the parent entity is loaded',
            'JPA does not support EAGER on ManyToOne',
            'It saves network bandwidth by returning null',
            'It enables database transactions'
          ],
          correctAnswerIndex: 0,
          explanation: 'By default, @ManyToOne is EAGER. In a list of 100 employees, EAGER loading causes 100 extra queries to fetch each employee department.',
          topic: 'Performance Best Practices'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 4: SPRING BOOT 3 CORE & ARCHITECTURE
  // =========================================================================
  'rd-04': {
    roadmapStepId: 'rd-04',
    skillName: 'Spring Boot 3 Core & Architecture',
    category: 'Enterprise Framework',
    industryDemand: 84,
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    prerequisites: [
      {
        skillName: 'Advanced Java & Collections Mastery',
        stepId: 'rd-01',
        isMet: true,
        requiredDescription: 'OOP, interfaces, generics, and annotations.'
      },
      {
        skillName: 'JPA & Hibernate ORM',
        stepId: 'rd-03',
        isMet: false,
        requiredDescription: 'Entity lifecycle and persistence context.'
      }
    ],
    whatYouWillLearn: [
      'Spring Core: Inversion of Control (IoC), Dependency Injection (DI), Beans, and ApplicationContext',
      'Spring Boot 3 starters, auto-configuration magic (@EnableAutoConfiguration), and embedded servers (Tomcat)',
      'Maven project lifecycle, dependency management, and multi-module builds',
      'Production 4-layer architecture: Controller -> Service -> Repository -> Entity',
      'Constructor-based Dependency Injection vs field injection (@Autowired) best practices',
      'Managing multi-environment configurations with application.yml and Spring Profiles (dev, test, prod)',
      'Global exception handling with @RestControllerAdvice and request validation with @Valid'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Spring Boot is the most widely adopted enterprise Java microservices framework in the world. Mastering its layered architecture is mandatory for 80%+ of junior backend requisitions.',
      rolesUsingSkill: ['Java Backend Developer', 'Microservices Engineer', 'Full Stack Developer'],
      realWorldUsage: 'Core banking microservices, airline reservation backends, SaaS multi-tenant platforms, and enterprise CRM systems.',
      subsequentSkills: ['RESTful API Engineering & Best Practices', 'Spring Security & JWT Authentication']
    },
    modules: [
      {
        id: 'mod-4-1',
        moduleNumber: 1,
        title: 'Spring Framework Fundamentals: IoC & DI',
        description: 'Understand Inversion of Control, Spring Beans, ApplicationContext, and why constructor injection is superior.',
        lessons: [
          {
            id: 'les-4-1-1',
            title: 'Inversion of Control (IoC) & Constructor Injection',
            duration: '35 mins',
            simpleExplanation: 'Instead of classes creating their own dependencies using `new Service()`, the Spring IoC container creates, manages, and injects instances (Beans) where needed.',
            whyNeeded: 'Decouples components, making code easily testable with mock dependencies and effortlessly configurable.',
            howItWorks: 'Spring scans components annotated with `@Component`, `@Service`, `@Repository`, creates singletons in `ApplicationContext`, and injects them via constructors.',
            syntax: '@Service\npublic class EmployeeService {\n    private final EmployeeRepository repository;\n    public EmployeeService(EmployeeRepository repository) { this.repository = repository; }\n}',
            realWorldExample: 'Switching from a real database repository to an in-memory mock repository during unit tests without changing the service class.',
            codeSnippet: `@Service
public class EmployeeService {
    // PREFERRED: final fields with Constructor Injection (No @Autowired needed in Spring 4.3+)
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    public EmployeeService(EmployeeRepository employeeRepository, NotificationService notificationService) {
        this.employeeRepository = employeeRepository;
        this.notificationService = notificationService;
    }

    public Employee hireEmployee(Employee employee) {
        Employee saved = employeeRepository.save(employee);
        notificationService.sendWelcomeEmail(saved.getEmail());
        return saved;
    }
}`,
            expectedOutput: 'Robust, immutable, easily testable Spring Bean with explicit dependencies.',
            commonMistakes: [
              'Using field injection `@Autowired private EmployeeRepository repo;` (hinders unit testing without reflection and hides circular dependencies).',
              'Creating Spring Beans manually with `new` keyword, which leaves all their internal `@Autowired` dependencies null!'
            ],
            bestPractices: [
              'Always use constructor injection with `final` fields.',
              'Keep beans stateless and thread-safe.'
            ],
            practiceQuestion: 'What is the default scope of a Spring Bean?'
          }
        ]
      },
      {
        id: 'mod-4-2',
        moduleNumber: 2,
        title: 'Spring Boot 3 Architecture & 4-Layer Separation',
        description: 'Understand Controller, Service, Repository, and Entity layers and why business logic must never live in Controllers.',
        lessons: [
          {
            id: 'les-4-2-1',
            title: 'The Production 4-Layer Architecture',
            duration: '30 mins',
            simpleExplanation: '1. Controller: handles HTTP protocol, parses requests, returns status codes. 2. Service: executes business logic, calculations, transactions. 3. Repository: executes database queries. 4. Entity / DTO: data structures.',
            whyNeeded: 'Prevents monolithic spaghetti code; ensures changes to database schemas or HTTP endpoints do not break business calculation rules.',
            howItWorks: 'Requests flow: Client -> Controller -> Service -> Repository -> Database. Responses flow in reverse.',
            syntax: 'HTTP Request -> @RestController -> @Service -> @Repository -> DB',
            realWorldExample: 'A bank transfer: Controller validates inputs -> Service checks account balances and initiates transaction -> Repository updates rows.',
            codeSnippet: `// 1. Controller Layer: HTTP concerns ONLY
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDto> create(@Valid @RequestBody CreateEmployeeDto dto) {
        EmployeeResponseDto response = employeeService.createEmployee(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}`,
            expectedOutput: 'Clean separation of HTTP concerns from backend business domain logic.',
            commonMistakes: [
              'Injecting repositories directly into Controllers and putting business calculations inside controller methods.',
              'Returning JPA Entity instances directly to API clients instead of DTOs.'
            ],
            bestPractices: [
              'Never expose raw JPA entities across REST boundaries; use DTOs.',
              'Mark service methods that modify data with `@Transactional`.'
            ],
            practiceQuestion: 'Why should `@Transactional` be placed on Service methods rather than Controller methods?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-4-1',
        title: 'Refactor to Constructor Dependency Injection',
        difficulty: 'Easy',
        description: 'Refactor a legacy Spring service using deprecated @Autowired field injection to clean, testable constructor injection with final fields.',
        requirements: [
          'Declare dependencies as private final',
          'Create explicit public constructor',
          'Remove field-level @Autowired annotations'
        ],
        starterCode: `// LEGACY CODE TO REFACTOR:
@Service
public class PayrollService {
    @Autowired
    private EmployeeRepository employeeRepository;
    @Autowired
    private TaxCalculator taxCalculator;
    
    // TODO: Refactor using constructor injection
}`,
        expectedOutput: 'Constructor injection with final fields',
        hints: [
          'Declare: private final EmployeeRepository employeeRepository;',
          'Create public PayrollService(EmployeeRepository er, TaxCalculator tc) { ... }'
        ],
        solutionCode: `@Service
public class PayrollService {
    private final EmployeeRepository employeeRepository;
    private final TaxCalculator taxCalculator;

    public PayrollService(EmployeeRepository employeeRepository, TaxCalculator taxCalculator) {
        this.employeeRepository = employeeRepository;
        this.taxCalculator = taxCalculator;
    }
}`,
        testCases: [
          { input: 'Instantiation via unit test constructor', expected: 'Instantiates cleanly with mock parameters' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-4-1',
        question: 'What is the primary benefit of Constructor Injection over Field Injection in Spring?',
        options: [
          'It allows dependencies to be final and allows easy unit testing without reflection or Spring test runners',
          'It makes the application run 50% faster',
          'It automatically enables database caching',
          'It is required by Java syntax'
        ],
        correctAnswerIndex: 0,
        explanation: 'Constructor injection ensures the bean cannot be created in an uninitialized state and makes plain mock injection in unit tests effortless.',
        topic: 'Spring Core'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-4-1',
        title: 'Configure Multi-Environment Spring Profiles',
        objective: 'Set up application-dev.yml and application-prod.yml connecting to H2 in-memory for local testing and MySQL for production.',
        steps: [
          'Create src/main/resources/application.yml with spring.profiles.active=dev',
          'Create application-dev.yml configuring H2 database with ddl-auto=create-drop',
          'Create application-prod.yml configuring MySQL datasource with ddl-auto=validate',
          'Verify profile switching using --spring.profiles.active=prod'
        ],
        codeTemplate: `spring:
  profiles:
    active: dev
---
spring:
  config:
    activate:
      on-profile: dev
  datasource:
    url: jdbc:h2:mem:testdb
---
spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: jdbc:mysql://prod-db:3306/enterprise`,
        verificationCriteria: [
          'Active profile logged on startup banner',
          'Correct database driver loaded per active profile'
        ]
      }
    ],
    miniProject: {
      title: 'Production-Ready Spring Boot Employee Backend',
      description: 'A modular Spring Boot 3 application structured strictly into 4 layers, connecting to MySQL via Spring Data JPA with global validation and multi-profile configuration.',
      techStack: ['Java 17', 'Spring Boot 3.2', 'Maven', 'Spring Data JPA', 'MySQL', 'Jakarta Validation'],
      deliverables: [
        'Complete project pom.xml with starter-web, starter-data-jpa, and starter-validation',
        'Controller, Service, Repository, and Entity packages with clean constructor injection',
        'Global exception handler catching MethodArgumentNotValidException and ResourceNotFoundException',
        'Working application.yml with dev and prod profile configurations'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-4-1',
          question: 'What does the `@SpringBootApplication` annotation combine?',
          options: [
            '@Configuration, @EnableAutoConfiguration, and @ComponentScan',
            '@Controller, @Service, and @Repository',
            '@Entity, @Table, and @Id',
            '@Bean, @Autowired, and @Value'
          ],
          correctAnswerIndex: 0,
          explanation: '@SpringBootApplication is a meta-annotation encapsulating @Configuration, @EnableAutoConfiguration, and @ComponentScan.',
          topic: 'Spring Boot Architecture'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 5: RESTFUL API ENGINEERING & BEST PRACTICES
  // =========================================================================
  'rd-05': {
    roadmapStepId: 'rd-05',
    skillName: 'RESTful API Engineering & Best Practices',
    category: 'Web Services',
    industryDemand: 80,
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedHours: 25,
    prerequisites: [
      {
        skillName: 'Spring Boot 3 Core & Architecture',
        stepId: 'rd-04',
        isMet: false,
        requiredDescription: 'Spring Boot layered architecture and controllers.'
      }
    ],
    whatYouWillLearn: [
      'REST architectural constraints: statelessness, client-server separation, and uniform resource identifiers',
      'Mastering HTTP methods (GET, POST, PUT, PATCH, DELETE) and status code semantics (200, 201, 204, 400, 404, 409, 500)',
      'Designing clean API resource contracts using Request and Response Data Transfer Objects (DTOs)',
      'Global exception handling architecture with @RestControllerAdvice returning standardized RFC-7807 problem details',
      'Implementing server-side pagination, multi-field sorting, and dynamic search filtering',
      'Automating interactive API documentation with Springdoc OpenAPI and Swagger UI'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Frontend mobile and web apps integrate with backends strictly through REST contracts. Poor API design causes integration delays, broken clients, and severe performance bottlenecks.',
      rolesUsingSkill: ['Java Backend Developer', 'API Architect', 'Full Stack Developer'],
      realWorldUsage: 'Used by every public and private API in modern cloud applications, from Stripe payments to GitHub webhooks.',
      subsequentSkills: ['Spring Security & JWT Authentication', 'Automated Unit & Integration Testing']
    },
    modules: [
      {
        id: 'mod-5-1',
        moduleNumber: 1,
        title: 'REST Architecture, HTTP Verbs & Status Codes',
        description: 'Understand resource naming, HTTP verb idempotency, and exact status code selection.',
        lessons: [
          {
            id: 'les-5-1-1',
            title: 'HTTP Methods & Status Code Semantics',
            duration: '35 mins',
            simpleExplanation: 'GET retrieves resources (safe/idempotent); POST creates new resources; PUT replaces a resource completely (idempotent); PATCH updates specific fields; DELETE removes a resource (idempotent). Status codes indicate outcome: 2xx (Success), 4xx (Client Error), 5xx (Server Error).',
            whyNeeded: 'Clients rely on status codes to know whether to retry, display form errors, or show fatal crash alerts.',
            howItWorks: 'The HTTP response header contains the status line (e.g. `HTTP/1.1 201 Created`) and payload.',
            syntax: 'POST /api/v1/employees -> 201 Created + Location header\nGET /api/v1/employees/999 -> 404 Not Found',
            realWorldExample: 'Creating a new employee returns 201 Created with the generated resource URI.',
            codeSnippet: `@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getById(id)); // 200 OK
    }

    @PostMapping
    public ResponseEntity<EmployeeResponseDto> create(@Valid @RequestBody CreateEmployeeDto dto) {
        EmployeeResponseDto created = employeeService.create(dto);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
            .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created); // 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}`,
            expectedOutput: 'Compliant RESTful controller conforming to HTTP standard specifications.',
            commonMistakes: [
              'Returning 200 OK with an error message in the JSON body: `{ "status": "error", "code": 404 }` (anti-pattern!).',
              'Using verbs in URIs like `/api/getEmployee` or `/api/deleteEmployee` instead of noun resources.'
            ],
            bestPractices: [
              'Use plural nouns for resource paths: `/api/v1/employees` not `/api/v1/employee`.',
              'Always return 204 No Content for successful DELETE operations.'
            ],
            practiceQuestion: 'What is the difference between idempotent and safe HTTP methods?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-5-1',
        title: 'Global Exception Handler with RFC-7807',
        difficulty: 'Medium',
        description: 'Implement a @RestControllerAdvice that intercepts ResourceNotFoundException and returns a clean HTTP 404 status code with a timestamp, error message, and request path.',
        requirements: [
          'Annotate class with @RestControllerAdvice',
          'Handle ResourceNotFoundException with @ExceptionHandler',
          'Return ResponseEntity with HttpStatus.NOT_FOUND'
        ],
        starterCode: `import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

record ErrorResponse(LocalDateTime timestamp, int status, String error, String message) {}

// TODO: Create the Controller Advice class here
`,
        expectedOutput: 'Standardized 404 JSON error payload',
        hints: [
          'Use @RestControllerAdvice',
          '@ExceptionHandler(ResourceNotFoundException.class)'
        ],
        solutionCode: `@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse err = new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage()
        );
        return new ResponseEntity<>(err, HttpStatus.NOT_FOUND);
    }
}`,
        testCases: [
          { input: 'Throw ResourceNotFoundException("Emp 101 not found")', expected: 'HTTP 404 with ErrorResponse body' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-5-1',
        question: 'Which HTTP method should be used to partially update an existing resource (e.g. updating only email)?',
        options: ['PATCH', 'PUT', 'POST', 'GET'],
        correctAnswerIndex: 0,
        explanation: 'PATCH applies partial modifications to a resource, whereas PUT replaces the entire entity.',
        topic: 'HTTP Methods'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-5-1',
        title: 'Integrate Springdoc OpenAPI & Swagger UI',
        objective: 'Add Swagger UI to an existing Spring Boot application and configure descriptive annotations for all endpoints.',
        steps: [
          'Add springdoc-openapi-starter-webmvc-ui dependency to pom.xml',
          'Annotate endpoints with @Operation(summary = "...") and @ApiResponse',
          'Navigate to http://localhost:8080/swagger-ui/index.html and test endpoints'
        ],
        codeTemplate: `@Operation(summary = "Find employee by ID", description = "Returns full employee profile or 404 if not found")
@ApiResponses({
    @ApiResponse(responseCode = "200", description = "Found employee"),
    @ApiResponse(responseCode = "404", description = "Employee not found")
})`,
        verificationCriteria: [
          'Swagger UI loads at /swagger-ui/index.html',
          'Interactive "Try it out" executes requests successfully'
        ]
      }
    ],
    miniProject: {
      title: 'RESTful Campus Placement Portal API',
      description: 'A complete RESTful API supporting CRUD operations for Students, Companies, and Placement Applications with pagination, sorting, DTO validation, and OpenAPI documentation.',
      techStack: ['Java 17', 'Spring Boot 3', 'Spring Data JPA', 'Jakarta Validation', 'OpenAPI 3'],
      deliverables: [
        'REST controllers with appropriate HTTP status codes (200, 201, 204, 400, 404)',
        'Paginated search endpoint: /api/v1/jobs?page=0&size=10&sort=postedDate,desc',
        'Strict DTO validation using @NotBlank, @Email, @Min, @Max',
        'Interactive Swagger UI documentation'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-5-1',
          question: 'What HTTP status code is most appropriate after successfully deleting a resource where no body is returned?',
          options: ['204 No Content', '200 OK with empty string', '201 Created', '410 Gone'],
          correctAnswerIndex: 0,
          explanation: 'HTTP 204 No Content signifies that the server successfully fulfilled the request and that there is no additional content to send in the payload body.',
          topic: 'Status Codes'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 6: SPRING SECURITY & JWT AUTHENTICATION
  // =========================================================================
  'rd-06': {
    roadmapStepId: 'rd-06',
    skillName: 'Spring Security & JWT Authentication',
    category: 'Security',
    industryDemand: 65,
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    difficulty: 'Advanced',
    estimatedHours: 30,
    prerequisites: [
      {
        skillName: 'Spring Boot 3 Core & Architecture',
        stepId: 'rd-04',
        isMet: false,
        requiredDescription: 'Spring Boot beans and configuration.'
      },
      {
        skillName: 'RESTful API Engineering & Best Practices',
        stepId: 'rd-05',
        isMet: false,
        requiredDescription: 'REST controllers and HTTP headers.'
      }
    ],
    whatYouWillLearn: [
      'Authentication (who you are) vs Authorization (what you are permitted to do)',
      'Spring Security 6 filter chain architecture: SecurityFilterChain, AuthenticationManager, and UserDetailsService',
      'Secure password hashing with BCrypt and salt generation',
      'JSON Web Tokens (JWT) structure: Header, Claims Payload, and Cryptographic Signature',
      'Stateless authentication flow: Login -> JWT Issue -> Client Bearer Token -> OncePerRequestFilter validation',
      'Role-Based Access Control (RBAC) with @PreAuthorize("hasRole(\'ADMIN\')")',
      'Hardening enterprise APIs: CORS configuration, CSRF prevention for stateless APIs, and secure token expiration'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Security is non-negotiable. Any production microservice deployed without strict stateless token authentication, password hashing, and role checks will fail enterprise security audits and be vulnerable to account takeovers.',
      rolesUsingSkill: ['Java Security Engineer', 'Backend Developer', 'DevOps & Cloud Engineer'],
      realWorldUsage: 'Authenticating mobile apps, single sign-on (SSO), microservice-to-microservice API gateway token relay.',
      subsequentSkills: ['Automated Unit & Integration Testing', 'Capstone: Production Backend Project']
    },
    modules: [
      {
        id: 'mod-6-1',
        moduleNumber: 1,
        title: 'Spring Security 6 Architecture & Filter Chain',
        description: 'Explore the modern component-based SecurityFilterChain, replacing deprecated WebSecurityConfigurerAdapter.',
        lessons: [
          {
            id: 'les-6-1-1',
            title: 'Configuring the SecurityFilterChain in Spring Boot 3',
            duration: '35 mins',
            simpleExplanation: 'Spring Security intercepts incoming HTTP requests through a chain of servlet filters. The `SecurityFilterChain` bean defines which endpoints are public (e.g. `/auth/login`) and which require authenticated credentials.',
            whyNeeded: 'Ensures protected business endpoints cannot be accessed by unauthenticated callers.',
            howItWorks: 'Requests pass through filters like UsernamePasswordAuthenticationFilter before reaching controllers.',
            syntax: '@Bean\npublic SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception { ... }',
            realWorldExample: 'Allowing anyone to view job postings while restricting job posting creation to authenticated Employers.',
            codeSnippet: `@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disabled for stateless REST APIs
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // One-way salted hash
    }
}`,
            expectedOutput: 'Secure Spring Boot 3 security configuration without XML or deprecated adapter classes.',
            commonMistakes: [
              'Leaving CSRF enabled for stateless JWT APIs (causes 403 Forbidden on POST/PUT requests).',
              'Storing passwords in plain text or using MD5/SHA-1 (must use BCrypt, Argon2, or PBKDF2).'
            ],
            bestPractices: [
              'Always use `BCryptPasswordEncoder` with default strength 10 or 12.',
              'Keep session management strictly `STATELESS` when using JWT tokens.'
            ],
            practiceQuestion: 'Why is CSRF protection unnecessary for stateless REST APIs utilizing Bearer tokens in headers?'
          }
        ]
      },
      {
        id: 'mod-6-2',
        moduleNumber: 2,
        title: 'JWT Token Generation, Validation & Filters',
        description: 'Build a custom OncePerRequestFilter to extract and validate Bearer tokens on every incoming request.',
        lessons: [
          {
            id: 'les-6-2-1',
            title: 'JWT Authentication Filter Implementation',
            duration: '40 mins',
            simpleExplanation: 'A JSON Web Token contains Base64-encoded Header, Payload (claims like subject username and roles), and Signature signed with an HMAC secret key. An incoming filter extracts the token from the `Authorization: Bearer <token>` header, verifies the signature, and sets the authenticated principal in Spring’s `SecurityContextHolder`.',
            whyNeeded: 'Eliminates server-side session memory storage, allowing effortless horizontal scaling across cloud containers.',
            howItWorks: 'Client sends token on every request; server verifies signature using its private secret key without querying a session store.',
            syntax: 'String header = request.getHeader("Authorization");\nif (header != null && header.startsWith("Bearer ")) { ... }',
            realWorldExample: 'User logs in on mobile phone and accesses account data seamlessly across 10 load-balanced backend servers.',
            codeSnippet: `@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtService.isTokenValid(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}`,
            expectedOutput: 'Every authenticated request automatically populates Spring SecurityContext with user identity and roles.',
            commonMistakes: [
              'Putting sensitive secrets or passwords inside the JWT payload (payload is only Base64-encoded, NOT encrypted!).',
              'Using weak, short secret keys for HMAC-SHA256 (must be at least 256 bits / 32 bytes).'
            ],
            bestPractices: [
              'Store the JWT secret key in environment variables or cloud secrets managers, never in Git.',
              'Set reasonable token expiration (e.g. 15-60 minutes) and use refresh tokens for re-authentication.'
            ],
            practiceQuestion: 'What are the three parts of a JWT token and what character separates them?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-6-1',
        title: 'Extract Username from Bearer Header',
        difficulty: 'Easy',
        description: 'Write a helper method that extracts the raw JWT token string from an HTTP Authorization header and returns null if the header is invalid.',
        requirements: [
          'Check if header is not null and starts with "Bearer "',
          'Return substring starting after "Bearer "',
          'Return null if header is missing or malformed'
        ],
        starterCode: `public class JwtUtils {
    public static String extractToken(String authorizationHeader) {
        // TODO: Validate header and return raw token string
        return null;
    }
}`,
        expectedOutput: 'Token string without "Bearer " prefix',
        hints: ['Check authorizationHeader.startsWith("Bearer ")', 'Use authorizationHeader.substring(7)'],
        solutionCode: `public static String extractToken(String authorizationHeader) {
    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
        return authorizationHeader.substring(7).trim();
    }
    return null;
}`,
        testCases: [
          { input: '"Bearer eyJhbGciOi..."', expected: '"eyJhbGciOi..."' },
          { input: '"Basic YWRtaW46"', expected: 'null' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-6-1',
        question: 'Can the payload of a standard JWT token be read by anyone who intercepts it?',
        options: [
          'Yes, because the payload is simply Base64-URL encoded, not encrypted',
          'No, because it is encrypted with the server private key',
          'Only if they know the database password',
          'Only in development mode'
        ],
        correctAnswerIndex: 0,
        explanation: 'JWTs provide integrity (signature verification), NOT confidentiality (encryption), unless JWE (JSON Web Encryption) is explicitly used.',
        topic: 'JWT Security'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-6-1',
        title: 'Secure Endpoints with Role-Based Access Control (RBAC)',
        objective: 'Implement method-level security using @PreAuthorize to restrict endpoint execution based on user roles.',
        steps: [
          'Add @EnableMethodSecurity to SecurityConfig',
          'Annotate controller methods with @PreAuthorize("hasRole(\'ADMIN\')")',
          'Verify that callers with ROLE_STUDENT receive HTTP 403 Forbidden'
        ],
        codeTemplate: `@DeleteMapping("/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build();
}`,
        verificationCriteria: [
          'Admin users can delete records',
          'Non-admin authenticated users receive HTTP 403 Forbidden'
        ]
      }
    ],
    miniProject: {
      title: 'Secure Authentication & Authorization Microservice',
      description: 'A complete authentication microservice offering User Registration, Login, JWT Token Generation, Refresh Token Rotation, and Role-Based Protected REST endpoints.',
      techStack: ['Java 17', 'Spring Boot 3', 'Spring Security 6', 'JJWT', 'MySQL', 'BCrypt'],
      deliverables: [
        'POST /api/v1/auth/register hashing passwords with BCrypt',
        'POST /api/v1/auth/login generating signed JWT access tokens',
        'OncePerRequestFilter validating Bearer token signatures',
        'Protected endpoints with @PreAuthorize("hasRole(\'RECRUITER\')")'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-6-1',
          question: 'What is the purpose of the salt in BCrypt password hashing?',
          options: [
            'It prevents rainbow table dictionary attacks by ensuring identical passwords produce completely different hashes',
            'It encrypts the password with AES',
            'It speeds up database queries',
            'It allows passwords to be decrypted by admins'
          ],
          correctAnswerIndex: 0,
          explanation: 'A random salt added before hashing ensures that two users with the password "Password123" will have distinct hash strings in the database.',
          topic: 'Password Security'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 7: AUTOMATED UNIT & INTEGRATION TESTING
  // =========================================================================
  'rd-07': {
    roadmapStepId: 'rd-07',
    skillName: 'Automated Unit & Integration Testing',
    category: 'Quality Assurance',
    industryDemand: 62,
    currentLevel: 'Beginner',
    targetLevel: 'Intermediate',
    difficulty: 'Intermediate',
    estimatedHours: 18,
    prerequisites: [
      {
        skillName: 'Spring Boot 3 Core & Architecture',
        stepId: 'rd-04',
        isMet: false,
        requiredDescription: 'Spring Boot services and repositories.'
      },
      {
        skillName: 'RESTful API Engineering & Best Practices',
        stepId: 'rd-05',
        isMet: false,
        requiredDescription: 'Controllers and MockMvc testing.'
      }
    ],
    whatYouWillLearn: [
      'The Testing Pyramid: Unit Tests vs Integration Tests vs End-to-End Tests',
      'JUnit 5 architecture: @Test, assertions, @BeforeEach, @AfterEach, and lifecycle annotations',
      'Mocking dependencies with Mockito: @Mock, @InjectMocks, when().thenReturn(), and verify()',
      'Unit testing Service layers in complete isolation without starting the database',
      'Testing Web Controllers with MockMvc, verifying status codes, JSON paths, and headers',
      'Repository testing with @DataJpaTest and in-memory test databases',
      'Measuring and enforcing minimum 80% code coverage with JaCoCo in CI/CD pipelines'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Modern tech companies practice Continuous Integration (CI). Pull requests cannot be merged into production without green automated tests and 80%+ code coverage.',
      rolesUsingSkill: ['Software Development Engineer in Test (SDET)', 'Java Backend Developer', 'DevOps Engineer'],
      realWorldUsage: 'Automated regression prevention in banking systems, payment checkout testing, and continuous deployment gatekeeping.',
      subsequentSkills: ['Capstone: Production Backend Project & AI Mock Interview']
    },
    modules: [
      {
        id: 'mod-7-1',
        moduleNumber: 1,
        title: 'Unit Testing with JUnit 5 & Mockito',
        description: 'Learn Arrange-Act-Assert testing pattern and mock external repositories with Mockito.',
        lessons: [
          {
            id: 'les-7-1-1',
            title: 'Testing Service Classes with Mockito @Mock and @InjectMocks',
            duration: '35 mins',
            simpleExplanation: 'Unit tests verify a single class in isolation. When testing a Service, Mockito creates dummy "mock" versions of its Repositories so tests run in milliseconds without starting a real database.',
            whyNeeded: 'Fast feedback loop: a suite of 1,000 unit tests runs in 5 seconds, catching regression bugs before code is committed.',
            howItWorks: '`@Mock` creates the fake dependency; `@InjectMocks` injects those mocks into the target service; `when(...).thenReturn(...)` defines the stubbed behavior.',
            syntax: 'when(employeeRepo.findById(1L)).thenReturn(Optional.of(emp));',
            realWorldExample: 'Testing that EmployeeService calculates bonuses correctly without inserting rows into MySQL.',
            codeSnippet: `@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    @Test
    @DisplayName("Should return employee when valid ID exists")
    void shouldReturnEmployeeWhenIdExists() {
        // 1. Arrange
        Employee mockEmp = new Employee(1L, "Alice", "alice@corp.com", 90000);
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(mockEmp));

        // 2. Act
        Employee result = employeeService.getById(1L);

        // 3. Assert
        assertNotNull(result);
        assertEquals("Alice", result.getFullName());
        verify(employeeRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when employee does not exist")
    void shouldThrowExceptionWhenNotFound() {
        when(employeeRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.getById(99L);
        });
    }
}`,
            expectedOutput: 'Unit test runs in 15 milliseconds and proves the service behaves correctly.',
            commonMistakes: [
              'Starting the entire Spring context (`@SpringBootTest`) for simple unit tests (slows down execution 100x).',
              'Forgetting `verify(...)` to confirm that critical side-effect methods were actually called.'
            ],
            bestPractices: [
              'Follow the Arrange-Act-Assert (AAA) pattern strictly.',
              'Test edge cases, null inputs, and expected exceptions, not just the happy path.'
            ],
            practiceQuestion: 'What is the difference between `@Mock` and `@Spy` in Mockito?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-7-1',
        title: 'Write a Mockito Unit Test for Employee Creation',
        difficulty: 'Medium',
        description: 'Write a unit test that mocks EmployeeRepository.save() and asserts that EmployeeService.create() returns the persisted entity with non-null ID.',
        requirements: [
          'Use when(repo.save(any(Employee.class))).thenReturn(...)',
          'Call service.create(employee)',
          'Assert returned ID is equal to 101L'
        ],
        starterCode: `// TODO: Write unit test verifying service.create()
@Test
void testCreateEmployee() {
    // Arrange
    
    // Act
    
    // Assert
}`,
        expectedOutput: 'Green passing test asserting returned ID matches mock',
        hints: ['Use when(repo.save(any())).thenReturn(mockSavedEmp)'],
        solutionCode: `@Test
void testCreateEmployee() {
    Employee input = new Employee("Bob", "bob@corp.com", 80000);
    Employee saved = new Employee(101L, "Bob", "bob@corp.com", 80000);
    when(employeeRepository.save(any(Employee.class))).thenReturn(saved);

    Employee result = employeeService.create(input);

    assertNotNull(result);
    assertEquals(101L, result.getId());
    verify(employeeRepository).save(input);
}`,
        testCases: [
          { input: 'Execute test runner', expected: 'Test passes in < 50ms' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-7-1',
        question: 'Which testing tool allows you to test Spring MVC Controller endpoints without starting a full HTTP server?',
        options: ['MockMvc', 'Selenium', 'Postman', 'Testcontainers'],
        correctAnswerIndex: 0,
        explanation: 'MockMvc simulates HTTP requests and responses directly within the Spring MVC test context without the overhead of binding to a real network port.',
        topic: 'Controller Testing'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-7-1',
        title: 'MockMvc Controller Endpoint Test',
        objective: 'Write a MockMvc test verifying GET /api/v1/employees/1 returns HTTP 200 OK and expected JSON fields.',
        steps: [
          'Annotate test class with @WebMvcTest(EmployeeController.class)',
          'Mock EmployeeService using @MockBean',
          'Execute mockMvc.perform(get("/api/v1/employees/1"))',
          'Assert and verify jsonPath("$.name").value("Alice")'
        ],
        codeTemplate: `mockMvc.perform(get("/api/v1/employees/1"))
    .andExpect(status().isOk())
    .andExpect(jsonPath("$.name").value("Alice"));`,
        verificationCriteria: [
          'HTTP status code 200 verified',
          'JSON response payload fields match assertions'
        ]
      }
    ],
    miniProject: {
      title: 'Automated Test Suite for E-Commerce Checkout',
      description: 'A comprehensive automated testing suite encompassing Unit Tests with Mockito, Web Slice Tests with MockMvc, and JPA Repository tests with @DataJpaTest.',
      techStack: ['Java 17', 'Spring Boot Test', 'JUnit 5', 'Mockito', 'AssertJ', 'JaCoCo'],
      deliverables: [
        'Service layer unit tests covering all business calculations and discount rules',
        'Controller layer web tests verifying HTTP status codes and validation error schemas',
        'Repository test verifying custom JPQL queries',
        'JaCoCo test coverage report demonstrating > 85% branch coverage'
      ]
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-7-1',
          question: 'What is the primary advantage of the Testing Pyramid structure (many unit tests, fewer integration tests, minimal E2E tests)?',
          options: [
            'Maximum test speed, fast debug feedback, and lowest maintenance cost',
            'It eliminates the need for unit tests',
            'It guarantees 100% bug-free software',
            'It requires no mocking frameworks'
          ],
          correctAnswerIndex: 0,
          explanation: 'Unit tests run in milliseconds and pinpoint the exact line of code that broke. Integration and E2E tests are slower and harder to maintain.',
          topic: 'Testing Strategy'
        }
      ]
    }
  },

  // =========================================================================
  // SKILL 8: CAPSTONE: PRODUCTION BACKEND PROJECT & AI MOCK INTERVIEW
  // =========================================================================
  'rd-08': {
    roadmapStepId: 'rd-08',
    skillName: 'Capstone: Production Backend Project & AI Mock Interview',
    category: 'Career Readiness Verification',
    industryDemand: 85,
    currentLevel: 'None',
    targetLevel: 'Advanced',
    difficulty: 'Advanced',
    estimatedHours: 40,
    prerequisites: [
      {
        skillName: 'Advanced Java & Collections Mastery',
        stepId: 'rd-01',
        isMet: true,
        requiredDescription: 'Core Java, Collections, and Streams.'
      },
      {
        skillName: 'Relational Database Architecture & JDBC',
        stepId: 'rd-02',
        isMet: true,
        requiredDescription: 'SQL, joins, and database design.'
      },
      {
        skillName: 'JPA & Hibernate ORM',
        stepId: 'rd-03',
        isMet: false,
        requiredDescription: 'Entity relationships and JPQL.'
      },
      {
        skillName: 'Spring Boot 3 Core & Architecture',
        stepId: 'rd-04',
        isMet: false,
        requiredDescription: 'Layered architecture and beans.'
      },
      {
        skillName: 'RESTful API Engineering & Best Practices',
        stepId: 'rd-05',
        isMet: false,
        requiredDescription: 'REST endpoints, DTOs, and validation.'
      },
      {
        skillName: 'Spring Security & JWT Authentication',
        stepId: 'rd-06',
        isMet: false,
        requiredDescription: 'Stateless JWT auth and RBAC.'
      },
      {
        skillName: 'Automated Unit & Integration Testing',
        stepId: 'rd-07',
        isMet: false,
        requiredDescription: 'JUnit 5 and Mockito test suites.'
      }
    ],
    whatYouWillLearn: [
      'Progressively architect and build a production-grade Enterprise Backend from scratch',
      'Integrate the full stack: Java 17, Maven, Spring Boot 3, JPA/Hibernate, MySQL, Spring Security, JWT, and JUnit 5',
      'Implement real-world enterprise patterns: DTO mapping, RFC-7807 global error handling, and multi-profile deployments',
      'Defend your architectural and code decisions in an interactive AI Technical Mock Interview simulating Tier-1 tech company evaluations'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'The Capstone is your hiring proof. Companies do not hire based on tutorial certificates; they hire candidates who can explain architectural tradeoffs, debug production exceptions, and articulate decisions with clarity under interview pressure.',
      rolesUsingSkill: ['Junior Java Backend Developer', 'Software Engineer I', 'Associate Cloud Engineer'],
      realWorldUsage: 'Full-cycle enterprise backend engineering from initial schema design to Docker deployment and technical defense.',
      subsequentSkills: ['Campus Placement Drives', 'Technical Hiring Interviews', 'Production Engineering Roles']
    },
    modules: [
      {
        id: 'mod-8-1',
        moduleNumber: 1,
        title: 'Capstone Enterprise Backend Architecture Roadmap',
        description: 'Follow the 16 progressive implementation steps to build the complete production backend system.',
        lessons: [
          {
            id: 'les-8-1-1',
            title: '16-Step Production Backend Implementation Blueprint',
            duration: '45 mins',
            simpleExplanation: 'Building a production backend requires disciplined layering: from Maven pom dependencies and MySQL schemas to JWT filters, Docker packaging, and automated test suites.',
            whyNeeded: 'Adhering to enterprise structure ensures code is maintainable by distributed engineering teams.',
            howItWorks: 'Execute the 16 progressive milestones sequentially.',
            syntax: 'Architecture: Maven -> DB -> Entity -> Repository -> Service -> Controller -> Security -> Tests -> Docker',
            realWorldExample: 'A complete Employee & Placement Management Microservice ready for AWS ECS deployment.',
            codeSnippet: `// 16 Step Roadmap Milestone Checklist:
// 1. Project Architecture & Maven dependencies
// 2. Database Schema & MySQL configuration
// 3. Entity Layer with JPA Relationships
// 4. Repository Layer with Spring Data JPA
// 5. Service Layer with @Transactional logic
// 6. Controller Layer with REST Endpoints
// 7. DTOs & Entity Mapping
// 8. Input Validation (@Valid)
// 9. Global Exception Handling (@RestControllerAdvice)
// 10. REST API Contracts & Status Codes
// 11. User Authentication & BCrypt Hashing
// 12. JWT Token Generation & Filter
// 13. Role-Based Access Control (@PreAuthorize)
// 14. Automated Testing with JUnit 5 & Mockito
// 15. OpenAPI / Swagger Documentation
// 16. Docker Containerization & Deployment`,
            expectedOutput: 'Production-ready, battle-tested Java backend portfolio project.',
            commonMistakes: [
              'Writing code without unit tests or omitting JWT security.',
              'Hardcoding database credentials in application.properties instead of using environment variables.'
            ],
            bestPractices: [
              'Commit regularly with clean Git messages.',
              'Ensure 80%+ test coverage before deploying.'
            ],
            practiceQuestion: 'How does containerizing a Spring Boot app with a multi-stage Dockerfile optimize image size?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-8-1',
        title: 'Multi-Stage Dockerfile for Spring Boot',
        difficulty: 'Hard',
        description: 'Write a multi-stage Dockerfile that builds the application JAR using Maven in stage 1, and runs it on a lightweight eclipse-temurin:17-jre-alpine container in stage 2.',
        requirements: [
          'Stage 1: maven:3.9-eclipse-temurin-17 AS builder',
          'Stage 2: eclipse-temurin:17-jre-alpine',
          'Expose port 8080 and define ENTRYPOINT'
        ],
        starterCode: `# Multi-stage Dockerfile
# Stage 1: Build JAR

# Stage 2: Runtime image
`,
        expectedOutput: 'Optimized Docker container under 180MB',
        hints: ['Use COPY --from=builder /app/target/*.jar app.jar'],
        solutionCode: `FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
        testCases: [
          { input: 'docker build .', expected: 'Creates runnable lightweight container image' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-8-1',
        question: 'In a microservice architecture, why should sensitive database passwords be injected via environment variables rather than checked into git repository configs?',
        options: [
          'To prevent credential leakage and enable seamless deployment across dev, staging, and production environments',
          'Because Spring Boot cannot read plain text files',
          'To reduce jar file size',
          'It is required by Docker syntax'
        ],
        correctAnswerIndex: 0,
        explanation: 'Twelve-Factor App methodology mandates storing configuration in the environment to keep code separate from deployment credentials.',
        topic: 'Production Deployment'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-8-1',
        title: 'Deploy Full-Stack Backend with Docker Compose',
        objective: 'Write a docker-compose.yml file that spins up both the MySQL 8 database container and the Spring Boot application container with health checks.',
        steps: [
          'Create docker-compose.yml',
          'Define db service with mysql:8.0 and volume persistence',
          'Define app service depending on db with restart: always',
          'Run docker-compose up -d and verify health'
        ],
        codeTemplate: `version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: enterprise
      MYSQL_ROOT_PASSWORD: root
    ports:
      - "3306:3306"
  app:
    build: .
    ports:
      - "8080:8080"
    depends_on:
      - db`,
        verificationCriteria: [
          'App container waits for database availability',
          'Endpoints accessible on localhost:8080'
        ]
      }
    ],
    miniProject: {
      title: 'Production Enterprise Employee & Placement Management System',
      description: 'The culminating capstone project combining all 7 previous milestones into an enterprise-grade backend featuring JWT authentication, Spring Data JPA, RESTful contracts, and 85% test coverage.',
      techStack: ['Java 17', 'Spring Boot 3', 'Spring Security 6', 'JWT', 'Spring Data JPA', 'MySQL', 'JUnit 5', 'Mockito', 'Docker'],
      deliverables: [
        'Complete GitHub repository with production-ready code structure',
        'Database migration scripts and seed data',
        'Full test suite with MockMvc and Mockito',
        'Dockerfile and docker-compose.yml for 1-click cloud deployment'
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Project Architecture & Maven Dependencies', layer: 'Build', description: 'Initialize Spring Boot 3 with starter-web, starter-data-jpa, starter-security, validation, and mysql connector.', keyCode: '<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>' },
        { stepNumber: 2, title: 'Database Design & MySQL Schema', layer: 'Database', description: 'Configure application.yml with Hikari connection pool and execute normalized DDL schemas.', keyCode: 'spring.datasource.url=jdbc:mysql://localhost:3306/enterprise_backend' },
        { stepNumber: 3, title: 'Entity Layer & JPA Relationships', layer: 'Model', description: 'Map Employee, Department, and Role entities with @ManyToOne(fetch = LAZY).', keyCode: '@ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dept_id")' },
        { stepNumber: 4, title: 'Repository Layer & Spring Data JPA', layer: 'Persistence', description: 'Define EmployeeRepository extending JpaRepository with custom derived query methods.', keyCode: 'public interface EmployeeRepository extends JpaRepository<Employee, Long>' },
        { stepNumber: 5, title: 'Service Layer with Transactions', layer: 'Business', description: 'Implement EmployeeServiceImpl with constructor injection and @Transactional annotation.', keyCode: '@Transactional public EmployeeResponseDto create(CreateEmployeeDto dto)' },
        { stepNumber: 6, title: 'Controller Layer & REST Endpoints', layer: 'Web', description: 'Build EmployeeController returning standard ResponseEntity and HTTP status codes.', keyCode: '@RestController @RequestMapping("/api/v1/employees")' },
        { stepNumber: 7, title: 'DTO Pattern & Model Mapping', layer: 'Contract', description: 'Decouple internal entities from external JSON requests using clean Java records.', keyCode: 'public record EmployeeResponseDto(Long id, String name, String email, String dept)' },
        { stepNumber: 8, title: 'Input Validation Annotations', layer: 'Validation', description: 'Enforce constraints with @Valid, @NotBlank, @Email, and @PositiveOrZero.', keyCode: 'public record CreateEmployeeDto(@NotBlank String name, @Email String email)' },
        { stepNumber: 9, title: 'Global Exception Handling', layer: 'Error', description: 'Create @RestControllerAdvice returning RFC-7807 problem details for 404, 400, and 500.', keyCode: '@RestControllerAdvice public class GlobalExceptionHandler' },
        { stepNumber: 10, title: 'REST API Status Codes & Headers', layer: 'Web', description: 'Return 201 Created with Location URI, 204 No Content for DELETE, and 200 OK.', keyCode: 'return ResponseEntity.created(location).body(created);' },
        { stepNumber: 11, title: 'User Authentication & BCrypt Hashing', layer: 'Security', description: 'Configure BCryptPasswordEncoder and implement user registration endpoint.', keyCode: 'String hash = passwordEncoder.encode(rawPassword);' },
        { stepNumber: 12, title: 'JWT Token Generation & OncePerRequestFilter', layer: 'Security', description: 'Implement stateless Bearer token extraction, signature verification, and SecurityContext binding.', keyCode: 'SecurityContextHolder.getContext().setAuthentication(authToken);' },
        { stepNumber: 13, title: 'Role-Based Access Control (RBAC)', layer: 'Security', description: 'Protect admin management endpoints with @PreAuthorize("hasRole(\'ADMIN\')").', keyCode: '@PreAuthorize("hasRole(\'ADMIN\')")' },
        { stepNumber: 14, title: 'Automated Testing with JUnit 5 & Mockito', layer: 'QA', description: 'Write unit tests for service business logic and MockMvc tests for HTTP endpoints.', keyCode: '@ExtendWith(MockitoExtension.class) class EmployeeServiceTest' },
        { stepNumber: 15, title: 'API Documentation with Swagger/OpenAPI', layer: 'Docs', description: 'Expose interactive Swagger UI on /swagger-ui/index.html with endpoint summaries.', keyCode: '@Operation(summary = "Fetch employee profile by ID")' },
        { stepNumber: 16, title: 'Docker Containerization & Production Build', layer: 'DevOps', description: 'Write multi-stage Dockerfile and docker-compose.yml for cloud container deployment.', keyCode: 'ENTRYPOINT ["java", "-jar", "app.jar"]' }
      ],
      interviewQuestions: [
        {
          id: 'iq-1',
          topic: 'JPA / Hibernate',
          question: 'What is the N+1 query problem in Hibernate, and how did you resolve it in your capstone project?',
          keyPointsExpected: [
            'Occurs when fetching parent records triggers 1 initial query plus N separate child queries',
            'Caused by lazy/eager iterations without join fetch',
            'Resolved using JPQL "JOIN FETCH" or Spring Data "@EntityGraph" to load parents and children in a single SQL query'
          ],
          sampleAnswer: 'In my capstone project, when loading departments and their employees, calling departmentRepo.findAll() triggered 1 query for the departments and then 50 separate queries for each department’s employees. I resolved this by writing a custom JPQL query with "SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.employees", which forces Hibernate to fetch both tables in a single SQL JOIN.'
        },
        {
          id: 'iq-2',
          topic: 'Spring Security & JWT',
          question: 'Walk me through the lifecycle of an authenticated request in your Spring Security architecture.',
          keyPointsExpected: [
            'Client sends Authorization: Bearer <token> in HTTP headers',
            'Custom OncePerRequestFilter intercepts the request before reaching the DispatcherServlet',
            'Validates token signature and expiration with secret key',
            'Extracts username and roles, sets Authentication in SecurityContextHolder',
            'DispatcherServlet delegates to controller; @PreAuthorize checks roles'
          ],
          sampleAnswer: 'When a client calls a protected endpoint, it includes the JWT in the Authorization header. My JwtAuthenticationFilter intercepts the request, strips the "Bearer " prefix, and validates the HMAC-SHA256 signature using the secret key. If valid and not expired, it extracts the username and roles, creates a UsernamePasswordAuthenticationToken, and places it into SecurityContextHolder. Spring then allows the request through to the Controller where @PreAuthorize enforces specific role permissions.'
        },
        {
          id: 'iq-3',
          topic: 'Database & Transactions',
          question: 'How do you guarantee data consistency during multi-step database mutations, and what happens if an unhandled RuntimeException is thrown?',
          keyPointsExpected: [
            'Use @Transactional on the Service layer',
            'Spring intercepts method and begins a database transaction',
            'Commits on successful completion',
            'Automatically triggers a database rollback if an unchecked (RuntimeException) is thrown'
          ],
          sampleAnswer: 'I annotate the service method with @Transactional. Spring uses an AOP proxy to begin a transaction on the connection. If all operations succeed, the transaction is committed. If any unchecked RuntimeException is thrown (such as InsufficientBalanceException or DataIntegrityViolationException), Spring automatically instructs the database to ROLLBACK all uncommitted changes, preserving ACID consistency.'
        },
        {
          id: 'iq-4',
          topic: 'Collections & Core Java',
          question: 'Why did you use HashMap for in-memory caching, and what precautions must you take regarding equals() and hashCode()?',
          keyPointsExpected: [
            'HashMap provides O(1) average time complexity for get and put',
            'If equals() is overridden, hashCode() must also be overridden',
            'Keys must be immutable so their hash codes never change while stored in the map'
          ],
          sampleAnswer: 'I used HashMap for fast in-memory lookup because bucket hashing gives O(1) average read and write times. However, if two objects are equal according to equals(), their hashCode() must return the exact same integer. Otherwise, map.get(key) will look in the wrong bucket and return null. Furthermore, the key object must be immutable so that its hash code remains constant while residing in the map.'
        }
      ]
    },
    assessment: {
      passingScore: 85,
      questions: [
        {
          id: 'as-8-1',
          question: 'In a production Spring Boot microservice, which layer should contain database transaction demarcation (@Transactional)?',
          options: ['The Service layer', 'The Controller layer', 'The Repository interface only', 'The Entity classes'],
          correctAnswerIndex: 0,
          explanation: 'Transactions encapsulate business units of work that may span multiple repository calls; thus @Transactional belongs on the Service layer.',
          topic: 'Architecture'
        },
        {
          id: 'as-8-2',
          question: 'Why is it critical to use a multi-stage Docker build for deploying Java applications?',
          options: [
            'It excludes the Maven build tools and source code from the final runtime image, drastically reducing image size and attack surface',
            'It makes the code run faster',
            'Docker requires multi-stage builds',
            'It automatically compiles C++ libraries'
          ],
          correctAnswerIndex: 0,
          explanation: 'Multi-stage builds leave behind the hundreds of megabytes of Maven cache and JDK compilers, packaging only the minimal JRE and compiled JAR.',
          topic: 'DevOps'
        }
      ]
    }
  }
};

// =========================================================================
// MERGE MULTI-DISCIPLINE ENGINEERING CURRICULUM DATA BANKS
// =========================================================================
Object.assign(ROADMAP_CURRICULUM_DATA, ECE_CURRICULUM_DATA);
Object.assign(ROADMAP_CURRICULUM_DATA, EEE_CURRICULUM_DATA);
Object.assign(ROADMAP_CURRICULUM_DATA, MECH_CURRICULUM_DATA);
Object.assign(ROADMAP_CURRICULUM_DATA, CIVIL_CURRICULUM_DATA);
Object.assign(ROADMAP_CURRICULUM_DATA, ROBOTICS_AUTO_AERO_CURRICULUM_DATA);
Object.assign(ROADMAP_CURRICULUM_DATA, CHEM_BIO_CURRICULUM_DATA);
Object.assign(ROADMAP_CURRICULUM_DATA, AERO_CURRICULUM_DATA);

// Wire Step-ID and Skill-ID aliases so looking up by stepId OR by catalog skillId/slug returns full curriculum
const ALIAS_MAPPINGS: Record<string, string> = {
  // ECE
  'rd-ece-01': 'embedded-c',
  'microcontrollers': 'embedded-c',
  'rd-ece-02': 'vlsi-design',
  'verilog': 'vlsi-design',
  'fpga': 'vlsi-design',
  'pcb-design': 'embedded-c',
  'signal-processing': 'embedded-c',
  'iot': 'embedded-c',
  // EEE
  'rd-eee-01': 'power-systems',
  'power-electronics': 'power-systems',
  'plc-scada': 'power-systems',
  'etap': 'power-systems',
  'renewable-energy': 'power-systems',
  // Mechanical
  'rd-mech-01': 'thermodynamics',
  'ansys': 'thermodynamics',
  'ansys-fea': 'thermodynamics',
  'cfd': 'thermodynamics',
  'solidworks': 'thermodynamics',
  'autocad': 'thermodynamics',
  'cnc-cam': 'thermodynamics',
  'gdt': 'thermodynamics',
  '3d-printing': 'thermodynamics',
  'catia': 'thermodynamics',
  // Civil
  'rd-civil-01': 'staad-pro',
  'structural-engineering': 'staad-pro',
  'etabs': 'staad-pro',
  'revit': 'staad-pro',
  'civil-3d': 'staad-pro',
  'gis': 'staad-pro',
  // Robotics & Automation
  'rd-robotics-01': 'robotics-ros',
  'matlab': 'robotics-ros',
  // Automobile & EV
  'rd-auto-01': 'ev-tech',
  'can-bus': 'ev-tech',
  // Chemical
  'rd-chem-01': 'aspen-plus',
  'chem-process': 'aspen-plus',
  'pid-diagrams': 'aspen-plus',
  // Biotechnology
  'rd-bio-01': 'bioinformatics',
  'pcr-sequencing': 'bioinformatics',
  // Aerospace
  'rd-aero-01': 'aerodynamics',
  'uav-avionics': 'aerodynamics'
};

for (const [alias, targetKey] of Object.entries(ALIAS_MAPPINGS)) {
  if (ROADMAP_CURRICULUM_DATA[targetKey]) {
    ROADMAP_CURRICULUM_DATA[alias] = {
      ...ROADMAP_CURRICULUM_DATA[targetKey],
      roadmapStepId: alias
    };
  }
}

