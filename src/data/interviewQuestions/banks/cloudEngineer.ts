import { RoleQuestion } from '../types';

export const CLOUD_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "ce-001",
    "role": "Cloud Engineer",
    "category": "Cloud Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare IaaS, PaaS, and SaaS cloud service models with examples across AWS, Azure, and GCP.",
    "expectedSkills": [
      "Cloud Fundamentals"
    ],
    "evaluationPoints": [
      "IaaS: raw compute, storage, networking (EC2, Azure VM, GCE)",
      "PaaS: managed application platform, cloud provider manages OS/runtime (AWS Elastic Beanstalk, App Service, Cloud Run)",
      "SaaS: end-user software delivered over the web (Salesforce, Office 365)"
    ],
    "followUpTopics": [
      "Shared responsibility model",
      "FaaS / Serverless"
    ]
  },
  {
    "id": "ce-002",
    "role": "Cloud Engineer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the Shared Responsibility Model between the cloud provider and the customer.",
    "expectedSkills": [
      "Security",
      "AWS"
    ],
    "evaluationPoints": [
      "Provider is responsible for security OF the cloud (physical datacenters, hardware, host OS, virtualization)",
      "Customer is responsible for security IN the cloud (customer data, IAM, OS patching on EC2, network firewall rules)",
      "Varies by service model (IaaS vs PaaS vs SaaS)"
    ],
    "followUpTopics": [
      "Compliance certifications",
      "Customer security responsibilities"
    ]
  },
  {
    "id": "ce-003",
    "role": "Cloud Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design a secure Virtual Private Cloud (VPC) with public and private subnets?",
    "expectedSkills": [
      "Networking",
      "AWS VPC"
    ],
    "evaluationPoints": [
      "Public subnet has route to Internet Gateway (IGW) for public load balancers/bastions",
      "Private subnet has route to NAT Gateway in public subnet for outbound internet access only",
      "Database and backend instances placed strictly in private subnets with no public IPs"
    ],
    "followUpTopics": [
      "Route tables",
      "CIDR blocks"
    ]
  },
  {
    "id": "ce-004",
    "role": "Cloud Engineer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Security Groups and Network Access Control Lists (NACLs) in cloud networking.",
    "expectedSkills": [
      "AWS",
      "Networking"
    ],
    "evaluationPoints": [
      "Security Groups operate at instance/ENI level and are stateful (inbound return traffic automatically allowed)",
      "NACLs operate at subnet level and are stateless (require explicit inbound and outbound rules)",
      "Security Groups support allow rules only; NACLs support allow and deny rules in numbered evaluation order"
    ],
    "followUpTopics": [
      "Default rules",
      "Stateful vs stateless"
    ]
  },
  {
    "id": "ce-005",
    "role": "Cloud Engineer",
    "category": "IAM",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between IAM Users, Groups, Roles, and Policies in AWS?",
    "expectedSkills": [
      "IAM",
      "Security"
    ],
    "evaluationPoints": [
      "IAM User has persistent credentials (password/access keys)",
      "IAM Role has no permanent credentials; assumed dynamically by users or AWS services (EC2, Lambda) via STS",
      "IAM Policy is a JSON document defining Allow/Deny permissions (Action, Resource, Condition)"
    ],
    "followUpTopics": [
      "Least privilege",
      "IAM condition keys"
    ]
  },
  {
    "id": "ce-006",
    "role": "Cloud Engineer",
    "category": "Storage",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare object storage (S3), block storage (EBS), and file storage (EFS). When do you choose each?",
    "expectedSkills": [
      "Storage",
      "AWS"
    ],
    "evaluationPoints": [
      "S3: highly durable, infinitely scalable object storage accessed via HTTP API (static assets, backups, data lakes)",
      "EBS: low-latency block storage attached to a single EC2 instance as a virtual hard drive",
      "EFS: scalable NFS network file system shareable concurrently across hundreds of EC2 instances"
    ],
    "followUpTopics": [
      "S3 storage classes",
      "IOPS provisioning"
    ]
  },
  {
    "id": "ce-007",
    "role": "Cloud Engineer",
    "category": "Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design a Multi-AZ, highly available web application on AWS?",
    "expectedSkills": [
      "High Availability",
      "Architecture"
    ],
    "evaluationPoints": [
      "Deploy Application Load Balancer across multiple Availability Zones",
      "Auto Scaling Group distributing EC2 instances across multiple AZs",
      "Multi-AZ database deployment (e.g. RDS Multi-AZ) with synchronous standby replica in secondary AZ"
    ],
    "followUpTopics": [
      "RTO and RPO",
      "Failover mechanisms"
    ]
  },
  {
    "id": "ce-008",
    "role": "Cloud Engineer",
    "category": "Serverless",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does AWS Lambda work? What causes cold starts and how do you minimize them?",
    "expectedSkills": [
      "Serverless",
      "AWS Lambda"
    ],
    "evaluationPoints": [
      "Event-driven compute executing code in response to triggers (API Gateway, S3, SQS)",
      "Cold start occurs when new container execution environment is initialized",
      "Mitigate using Provisioned Concurrency, lightweight runtimes, and minimizing deployment package size"
    ],
    "followUpTopics": [
      "Lambda SnapStart",
      "Execution timeout"
    ]
  },
  {
    "id": "ce-009",
    "role": "Cloud Engineer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Amazon RDS (relational) vs Amazon DynamoDB (NoSQL). How do you choose?",
    "expectedSkills": [
      "Database",
      "AWS"
    ],
    "evaluationPoints": [
      "RDS is managed relational database (PostgreSQL, MySQL) supporting complex SQL joins and ACID transactions",
      "DynamoDB is fully managed serverless key-value/document store with single-digit millisecond latency at any scale",
      "Use RDS for relational data; DynamoDB for high-throughput partitioned key-value access patterns"
    ],
    "followUpTopics": [
      "DynamoDB partition keys",
      "Aurora Serverless"
    ]
  },
  {
    "id": "ce-010",
    "role": "Cloud Engineer",
    "category": "Compute",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does an Auto Scaling Group scale compute capacity using Target Tracking scaling policies?",
    "expectedSkills": [
      "Auto Scaling",
      "Compute"
    ],
    "evaluationPoints": [
      "Monitors CloudWatch metric (e.g. average CPU utilization at 70% or ALB request count per target)",
      "Dynamically adds or terminates instances to keep metric at target value",
      "Includes cooldown periods to prevent rapid oscillation (thrashing)"
    ],
    "followUpTopics": [
      "Launch Templates",
      "Step scaling"
    ]
  },
  {
    "id": "ce-011",
    "role": "Cloud Engineer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does AWS Key Management Service (KMS) provide envelope encryption for S3 and EBS?",
    "expectedSkills": [
      "Security",
      "KMS"
    ],
    "evaluationPoints": [
      "Customer Master Key (CMK) generates a plaintext Data Encryption Key (DEK) and encrypted DEK",
      "Data is encrypted locally using the plaintext DEK, which is then wiped from memory",
      "Only the encrypted DEK is stored alongside the ciphertext data"
    ],
    "followUpTopics": [
      "KMS key rotation",
      "Customer Managed vs AWS Managed keys"
    ]
  },
  {
    "id": "ce-012",
    "role": "Cloud Engineer",
    "category": "Monitoring",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you set up CloudWatch metrics, alarms, and SNS notifications for production operations?",
    "expectedSkills": [
      "Monitoring",
      "CloudWatch"
    ],
    "evaluationPoints": [
      "CloudWatch collects default and custom metrics from EC2, RDS, and Lambda",
      "Alarms trigger state transitions (OK, ALARM, INSUFFICIENT_DATA) based on metric thresholds over evaluation periods",
      "Actions publish to Amazon SNS topics routing alerts to Slack, email, or PagerDuty"
    ],
    "followUpTopics": [
      "CloudWatch Logs Insights",
      "Anomaly detection"
    ]
  },
  {
    "id": "ce-013",
    "role": "Cloud Engineer",
    "category": "Networking",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does Amazon CloudFront accelerate global content delivery and what is origin shielding?",
    "expectedSkills": [
      "CDN",
      "CloudFront"
    ],
    "evaluationPoints": [
      "Caches static and dynamic content at edge locations worldwide closest to users",
      "Reduces origin server load and minimizes TTFB (Time to First Byte)",
      "Origin Shield adds an extra caching layer between edge locations and origin to protect backend servers"
    ],
    "followUpTopics": [
      "Cache-Control headers",
      "Signed URLs for restricted content"
    ]
  },
  {
    "id": "ce-014",
    "role": "Cloud Engineer",
    "category": "FinOps",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What strategies do you use to reduce AWS cloud infrastructure spend by 30%?",
    "expectedSkills": [
      "FinOps",
      "Cost Optimization"
    ],
    "evaluationPoints": [
      "Purchase Compute Savings Plans or Reserved Instances for steady-state workloads",
      "Use Spot instances for non-critical, fault-tolerant batch workloads",
      "Identify and terminate orphaned EBS volumes, unattached Elastic IPs, and idle RDS instances",
      "Apply S3 Lifecycle policies moving old data to Glacier"
    ],
    "followUpTopics": [
      "AWS Cost Explorer",
      "AWS Compute Optimizer"
    ]
  },
  {
    "id": "ce-015",
    "role": "Cloud Engineer",
    "category": "IaC",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare AWS CloudFormation vs AWS Cloud Development Kit (CDK).",
    "expectedSkills": [
      "IaC",
      "AWS CDK"
    ],
    "evaluationPoints": [
      "CloudFormation uses declarative JSON/YAML templates defining AWS resources",
      "CDK allows developers to define cloud infrastructure using familiar programming languages (TypeScript, Python, Java)",
      "CDK synthesizes code into standard CloudFormation templates for deployment"
    ],
    "followUpTopics": [
      "Constructs (L1, L2, L3)",
      "CDK pipelines"
    ]
  },
  {
    "id": "ce-016",
    "role": "Cloud Engineer",
    "category": "Disaster Recovery",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Compare Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active DR strategies.",
    "expectedSkills": [
      "Disaster Recovery",
      "Architecture"
    ],
    "evaluationPoints": [
      "Backup & Restore: cheapest, highest RTO/RPO (rebuilding from backups)",
      "Pilot Light: core data replicated, minimal compute running, scaled up on disaster",
      "Warm Standby: scaled-down fully functional copy running 24/7 in secondary region",
      "Active-Active: traffic served across both regions simultaneously, near-zero RTO/RPO but highest cost"
    ],
    "followUpTopics": [
      "Route 53 latency routing",
      "RTO vs RPO"
    ]
  },
  {
    "id": "ce-017",
    "role": "Cloud Engineer",
    "category": "Containers",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Amazon ECS (Fargate) vs Amazon EKS (Kubernetes). When do you recommend ECS?",
    "expectedSkills": [
      "Containers",
      "AWS"
    ],
    "evaluationPoints": [
      "ECS is AWS-native, deeply integrated, simpler to operate with lower operational overhead",
      "EKS is standard managed Kubernetes with full open-source ecosystem portability across multi-cloud",
      "Choose ECS for smaller teams wanting simplicity; choose EKS for complex Kubernetes microservice requirements"
    ],
    "followUpTopics": [
      "AWS Fargate",
      "Task definitions vs Pods"
    ]
  },
  {
    "id": "ce-018",
    "role": "Cloud Engineer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does AWS WAF protect web applications against OWASP Top 10 exploits and DDoS attacks?",
    "expectedSkills": [
      "Security",
      "AWS WAF"
    ],
    "evaluationPoints": [
      "Deployed on CloudFront, ALB, or API Gateway",
      "Inspects HTTP headers, body, query strings for SQL injection (SQLi) and XSS patterns",
      "Rate-based rules block IP addresses exceeding request thresholds, mitigating HTTP flood DDoS"
    ],
    "followUpTopics": [
      "AWS Shield Advanced",
      "Managed Rule Groups"
    ]
  },
  {
    "id": "ce-019",
    "role": "Cloud Engineer",
    "category": "Networking",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What problem does AWS Transit Gateway solve compared to complex VPC Peering meshes?",
    "expectedSkills": [
      "Networking",
      "Enterprise Cloud"
    ],
    "evaluationPoints": [
      "VPC peering requires full mesh n*(n-1)/2 direct peering connections (hard to manage)",
      "Transit Gateway acts as a central cloud router connecting hundreds of VPCs and on-premises VPNs/Direct Connect",
      "Simplifies network routing, hub-and-spoke architecture, and traffic inspection"
    ],
    "followUpTopics": [
      "Direct Connect",
      "Hub and spoke network"
    ]
  },
  {
    "id": "ce-020",
    "role": "Cloud Engineer",
    "category": "Security",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is Zero Trust in cloud security and how do you implement it across services?",
    "expectedSkills": [
      "Security",
      "Zero Trust"
    ],
    "evaluationPoints": [
      "'Never trust, always verify' principle; assuming network perimeter is already breached",
      "Enforce mutual TLS (mTLS) for all service-to-service communication",
      "Strict identity verification, short-lived tokens, and least privilege access policies on every request"
    ],
    "followUpTopics": [
      "Service mesh mTLS",
      "IAM identity center"
    ]
  },
  {
    "id": "ce-021",
    "role": "Cloud Engineer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do RDS Read Replicas scale read-heavy applications and how is replication lag managed?",
    "expectedSkills": [
      "Database",
      "Scalability"
    ],
    "evaluationPoints": [
      "Asynchronously replicates database updates from primary writer instance to read-only replicas",
      "Application routes SELECT queries to replica endpoints, relieving pressure on primary writer",
      "Replication lag means replicas may return slightly stale data; critical read-after-write operations should query writer"
    ],
    "followUpTopics": [
      "Aurora Global Database",
      "Aurora read endpoints"
    ]
  },
  {
    "id": "ce-022",
    "role": "Cloud Engineer",
    "category": "Governance",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why should an enterprise use AWS Organizations with multiple separate AWS accounts?",
    "expectedSkills": [
      "Governance",
      "Cloud Architecture"
    ],
    "evaluationPoints": [
      "Isolates blast radius: security breach in Dev cannot compromise Production account",
      "Clear billing separation and allocation across departments",
      "Service Control Policies (SCPs) apply guardrails restricting actions across member accounts"
    ],
    "followUpTopics": [
      "Service Control Policies (SCPs)",
      "AWS Control Tower"
    ]
  },
  {
    "id": "ce-023",
    "role": "Cloud Engineer",
    "category": "Event-Driven",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Amazon EventBridge route events between AWS services, SaaS apps, and microservices?",
    "expectedSkills": [
      "EventBridge",
      "Architecture"
    ],
    "evaluationPoints": [
      "Serverless event bus that ingests events from multiple sources",
      "Rules filter incoming JSON event payloads and route to targets (Lambda, SQS, Step Functions)",
      "Decouples producers from consumers with high throughput and schema registry"
    ],
    "followUpTopics": [
      "Event bus",
      "Schema registry"
    ]
  },
  {
    "id": "ce-024",
    "role": "Cloud Engineer",
    "category": "Serverless",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why should you use AWS Step Functions instead of chaining Lambda functions directly?",
    "expectedSkills": [
      "Serverless",
      "Workflow"
    ],
    "evaluationPoints": [
      "Step Functions provides visual state machine orchestrating multi-step workflows",
      "Built-in error handling, retries with exponential backoff, and timeouts",
      "Saves execution state across steps, avoiding costly Lambda-invoking-Lambda idle wait charges"
    ],
    "followUpTopics": [
      "State machines",
      "Saga pattern with Step Functions"
    ]
  },
  {
    "id": "ce-025",
    "role": "Cloud Engineer",
    "category": "Migration",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the 7 Rs of cloud migration (Rehost, Replatform, Refactor, Repurchase, Retain, Retire, Relocate).",
    "expectedSkills": [
      "Cloud Migration"
    ],
    "evaluationPoints": [
      "Rehost: Lift-and-shift to VMs without code changes",
      "Replatform: Lift-and-reshape, moving to managed database (RDS) or container service without modifying core app code",
      "Refactor: Redesigning application into cloud-native microservices and serverless",
      "Retire: Decommissioning redundant legacy systems"
    ],
    "followUpTopics": [
      "AWS Application Migration Service",
      "Total Cost of Ownership (TCO)"
    ]
  },
  {
    "id": "ce-026",
    "role": "Cloud Engineer",
    "category": "Hybrid Cloud",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does AWS Storage Gateway connect on-premises environments to cloud storage?",
    "expectedSkills": [
      "Hybrid Cloud",
      "Storage"
    ],
    "evaluationPoints": [
      "File Gateway: presents S3 buckets as local NFS/SMB network shares with local caching",
      "Volume Gateway: provides iSCSI block storage backed by S3 with EBS snapshots",
      "Tape Gateway: replaces on-premises physical tape backups with Glacier"
    ],
    "followUpTopics": [
      "Direct Connect",
      "AWS Outposts"
    ]
  },
  {
    "id": "ce-027",
    "role": "Cloud Engineer",
    "category": "Containers",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare EKS Managed Node Groups vs Karpenter for dynamic Kubernetes node provisioning.",
    "expectedSkills": [
      "EKS",
      "Kubernetes"
    ],
    "evaluationPoints": [
      "Managed Node Groups automate node provisioning, updating, and autoscaling using EC2 Auto Scaling Groups",
      "Karpenter is open-source cluster autoscaler that bypasses node groups, directly launching optimal EC2 instances in seconds based on pending pod requirements",
      "Karpenter significantly improves bin-packing and lowers compute costs with Spot"
    ],
    "followUpTopics": [
      "Karpenter",
      "EKS Fargate"
    ]
  },
  {
    "id": "ce-028",
    "role": "Cloud Engineer",
    "category": "Compliance",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the operational difference between AWS CloudTrail and CloudWatch Logs?",
    "expectedSkills": [
      "Compliance",
      "Auditing"
    ],
    "evaluationPoints": [
      "CloudTrail audits governance and API activity: records WHO made WHAT API call WHEN and from WHERE",
      "CloudWatch Logs aggregates and monitors application and server runtime logs (syslog, web server logs)",
      "CloudTrail for security audits; CloudWatch for operational health and debugging"
    ],
    "followUpTopics": [
      "CloudTrail Insights",
      "Log tampering prevention"
    ]
  },
  {
    "id": "ce-029",
    "role": "Cloud Engineer",
    "category": "Security",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "An attacker gains access to an IAM role. How do you audit permissions and remediate immediately?",
    "expectedSkills": [
      "Security",
      "Incident Response"
    ],
    "evaluationPoints": [
      "Revoke active STS sessions for the compromised role in the IAM console",
      "Inspect CloudTrail event history to identify all actions taken by the role's temporary credentials",
      "Apply restrictive inline deny policy or delete role, and rotate all exposed secrets"
    ],
    "followUpTopics": [
      "IAM Access Analyzer",
      "Credential exposure"
    ]
  },
  {
    "id": "ce-030",
    "role": "Cloud Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Route 53 Latency-Based Routing and S3 Cross-Region Replication improve global user experience?",
    "expectedSkills": [
      "Route 53",
      "Global Architecture"
    ],
    "evaluationPoints": [
      "Route 53 routes DNS queries to the AWS region that provides the lowest network latency for the end user",
      "S3 Cross-Region Replication automatically synchronizes object buckets to destination regions asynchronously for low-latency reads and disaster recovery"
    ],
    "followUpTopics": [
      "Geolocation routing",
      "Failover routing"
    ]
  },
  {
    "id": "ce-031",
    "role": "Cloud Engineer",
    "category": "API Gateway",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you protect backend microservices from traffic surges using Amazon API Gateway?",
    "expectedSkills": [
      "API Gateway",
      "Performance"
    ],
    "evaluationPoints": [
      "Configure usage plans with rate limits (requests per second) and burst limits to prevent backend exhaustion",
      "Enable API Gateway response caching to serve frequent identical GET requests without hitting backend compute",
      "Return HTTP 429 when client exceeds throttle limits"
    ],
    "followUpTopics": [
      "API keys",
      "Mutual TLS"
    ]
  },
  {
    "id": "ce-032",
    "role": "Cloud Engineer",
    "category": "Incident Response",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a production cloud outage or degradation you resolved. What was your systematic approach?",
    "expectedSkills": [
      "Troubleshooting",
      "Communication"
    ],
    "evaluationPoints": [
      "Incident triage and assessing customer blast radius",
      "Leveraging CloudWatch dashboards, traces, and metrics to identify bottleneck",
      "Executing immediate mitigation followed by root-cause fix and blameless post-mortem"
    ],
    "followUpTopics": [
      "Post-mortem",
      "On-call response"
    ]
  },
  {
    "id": "ce-033",
    "role": "Cloud Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Walk me through an enterprise cloud architecture you designed. What were the key non-functional requirements?",
    "expectedSkills": [
      "Architecture",
      "System Design"
    ],
    "evaluationPoints": [
      "System availability, scalability, and disaster recovery SLA targets",
      "Network topology, compute selection, and storage tiering",
      "Security posture, compliance requirements, and cost optimization results"
    ],
    "followUpTopics": [
      "Non-functional requirements",
      "Design trade-offs"
    ]
  },
  {
    "id": "ce-034",
    "role": "Cloud Engineer",
    "category": "Strategy",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "How do you evaluate and balance the benefits of proprietary cloud managed services against vendor lock-in?",
    "expectedSkills": [
      "Architecture",
      "Strategy"
    ],
    "evaluationPoints": [
      "Managed services provide faster time-to-market, lower operational burden, and automatic scaling",
      "Mitigate risk by adopting open standards (containers, Kubernetes, OpenTelemetry, PostgreSQL)",
      "Accept strategic lock-in where productivity gains vastly outweigh migration costs"
    ],
    "followUpTopics": [
      "Multi-cloud reality",
      "Open-source standards"
    ]
  },
  {
    "id": "ce-035",
    "role": "Cloud Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is Edge Computing (e.g. CloudFront Functions, Lambda@Edge) and when is it necessary?",
    "expectedSkills": [
      "Edge Computing",
      "Serverless"
    ],
    "evaluationPoints": [
      "Executes compute logic at edge locations globally, within single-digit milliseconds of users",
      "Ideal for URL rewrites, A/B routing, header manipulation, bot detection, and authentication checks before traffic hits origin",
      "Eliminates origin round-trips for simple requests"
    ],
    "followUpTopics": [
      "CloudFront Functions",
      "Distributed edge data"
    ]
  }
];
