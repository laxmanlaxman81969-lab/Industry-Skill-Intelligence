import { RoleQuestion } from '../types';

export const CLOUD_SUPPORT_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "cse-001",
    "role": "Cloud Support Engineer",
    "category": "Compute & Linux",
    "difficulty": "Easy",
    "format": "scenario",
    "question": "A customer reports: 'ssh -i key.pem ec2-user@<IP>' hangs and times out. Walk me through your step-by-step diagnostic checklist.",
    "expectedSkills": [
      "AWS EC2",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Check Security Group inbound rules: is Port 22 open from customer's public IP?",
      "Check Route Table of the subnet: is there an active route (0.0.0.0/0) pointing to an Internet Gateway (IGW)?",
      "Verify EC2 has a public IPv4 address assigned and is not in a private subnet",
      "Check Network ACLs (NACLs) inbound and outbound rules; check instance state in console"
    ],
    "followUpTopics": [
      "NACL stateless rules",
      "System Log in EC2"
    ]
  },
  {
    "id": "cse-002",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the architectural and network difference between 'Connection Timed Out' and 'Connection Refused'?",
    "expectedSkills": [
      "Networking",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Connection Timed Out: packet was dropped along network path without response (firewall, Security Group, or routing failure)",
      "Connection Refused: packet reached target host, but no service is listening on that port or host firewall (iptables/ufw) rejected TCP RST",
      "Refused means network routing and security groups are working; issue is on the operating system/daemon level"
    ],
    "followUpTopics": [
      "TCP RST packet",
      "iptables vs Security Groups"
    ]
  },
  {
    "id": "cse-003",
    "role": "Cloud Support Engineer",
    "category": "Compute",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between an EC2 System Status Check failure and an Instance Status Check failure?",
    "expectedSkills": [
      "AWS EC2",
      "Monitoring"
    ],
    "evaluationPoints": [
      "System Status Check (0/2): underlying AWS hardware, physical host, or network infrastructure issue -> Resolved by stopping and starting instance to migrate to a new physical host",
      "Instance Status Check (1/2): operating system level failure inside VM (kernel panic, corrupt boot volume, exhausted memory, misconfigured network config) -> Inspected via System Log / Instance Screenshot"
    ],
    "followUpTopics": [
      "Stop and start migration",
      "EC2 System Log"
    ]
  },
  {
    "id": "cse-004",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What causes HTTP 502 Bad Gateway vs HTTP 504 Gateway Timeout on an Application Load Balancer?",
    "expectedSkills": [
      "AWS ALB",
      "HTTP Status Codes"
    ],
    "evaluationPoints": [
      "HTTP 502 Bad Gateway: ALB reached target backend EC2/container, but backend returned an invalid HTTP response, malformed header, or suddenly closed TCP connection (RST)",
      "HTTP 504 Gateway Timeout: ALB forwarded request to target, but backend application failed to respond within the configured ALB Idle Timeout window (long query, deadlock)"
    ],
    "followUpTopics": [
      "ALB access logs",
      "Target response time metric"
    ]
  },
  {
    "id": "cse-005",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "All targets in an ALB Target Group are marked 'Unhealthy'. How do you troubleshoot and restore traffic?",
    "expectedSkills": [
      "AWS ALB",
      "High Availability"
    ],
    "evaluationPoints": [
      "Check Target Group Health Check settings: path (e.g. /health), port, and expected HTTP status code (e.g. 200)",
      "Verify web server on EC2 is listening on target port and responding locally: curl -Iv http://localhost:<port>/health",
      "Check Security Group on EC2 instances: does it allow inbound traffic on target port from the ALB's security group?"
    ],
    "followUpTopics": [
      "Health check path",
      "Security Group chaining"
    ]
  },
  {
    "id": "cse-006",
    "role": "Cloud Support Engineer",
    "category": "Linux Administration",
    "difficulty": "Easy",
    "format": "practical",
    "question": "A Linux server reports 'No space left on device'. How do you identify what consumed the disk, and what if df shows 100% but du shows space free?",
    "expectedSkills": [
      "Linux",
      "Storage"
    ],
    "evaluationPoints": [
      "Run 'df -h' to see filesystem usage; run 'du -sh /* | sort -h' to find largest consuming directory (usually /var/log)",
      "If du shows free space but df shows 100%: running processes are holding open deleted file handles; find with 'lsof +L1' or 'lsof | grep deleted'",
      "Restart offending process to release locked disk blocks"
    ],
    "followUpTopics": [
      "lsof +L1",
      "Inode exhaustion (df -i)"
    ]
  },
  {
    "id": "cse-007",
    "role": "Cloud Support Engineer",
    "category": "Linux Administration",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "A customer cannot create files on a Linux volume even though 'df -h' shows 50GB free space. What is the cause?",
    "expectedSkills": [
      "Linux",
      "Storage"
    ],
    "evaluationPoints": [
      "Inode exhaustion: filesystem has created maximum allowable number of files, exhausting the inode table ('df -i' shows 100% inode usage)",
      "Caused by millions of tiny files (e.g. PHP session files, uncleaned spool or cache directories)",
      "Identify directory with highest file count: find / -xdev -printf '%h\n' | sort | uniq -c | sort -k 1 -n"
    ],
    "followUpTopics": [
      "df -i",
      "Inode table"
    ]
  },
  {
    "id": "cse-008",
    "role": "Cloud Support Engineer",
    "category": "Compute",
    "difficulty": "Easy",
    "format": "practical",
    "question": "An EC2 instance is at 100% CPU utilization. What commands do you run via SSH to pinpoint the offending process?",
    "expectedSkills": [
      "Linux",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "top or htop to identify top CPU-consuming process IDs and user accounts",
      "ps aux --sort=-%cpu | head -10 to list top 10 CPU-consuming processes with command arguments",
      "strace -p <PID> to inspect system calls of runaway process, or gstack/jstack for thread dumps"
    ],
    "followUpTopics": [
      "Load average vs CPU %",
      "strace command"
    ]
  },
  {
    "id": "cse-009",
    "role": "Cloud Support Engineer",
    "category": "Storage & IAM",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "A customer receives 'Access Denied (403 Forbidden)' when accessing an S3 object. What are the 5 layers of S3 permission evaluation?",
    "expectedSkills": [
      "AWS S3",
      "IAM"
    ],
    "evaluationPoints": [
      "IAM User/Role permissions policy: does it allow s3:GetObject on specific bucket/object ARN?",
      "S3 Bucket Policy: is there an explicit Deny policy overriding permissions?",
      "S3 Block Public Access settings: are public requests blocked at account or bucket level?",
      "KMS Key Policy: if object is encrypted with SSE-KMS, does user have kms:Decrypt permissions on the key?",
      "Object Access Control List (ACL) ownership (Bucket Owner Enforced setting)"
    ],
    "followUpTopics": [
      "KMS key permissions",
      "Explicit Deny precedence"
    ]
  },
  {
    "id": "cse-010",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "A customer configured VPC Peering between VPC A and VPC B, but instances cannot communicate. What is missing?",
    "expectedSkills": [
      "VPC Peering",
      "Networking"
    ],
    "evaluationPoints": [
      "Check Route Tables: both VPC A and VPC B route tables must have explicit routes pointing target CIDR to the peering connection ID (pcx-xxxx)",
      "Check Security Groups: inbound rules on instances in VPC B must allow traffic from VPC A CIDR or security group",
      "Ensure IPv4 CIDR blocks of VPC A and VPC B do not overlap (overlapping CIDRs block peering)"
    ],
    "followUpTopics": [
      "Overlapping CIDRs",
      "Route table propagation"
    ]
  },
  {
    "id": "cse-011",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does automated failover work between an AWS Direct Connect dedicated link and an IPsec Site-to-Site VPN?",
    "expectedSkills": [
      "Networking",
      "Hybrid Cloud"
    ],
    "evaluationPoints": [
      "BGP (Border Gateway Protocol) dynamically exchanges routing information between on-premises and AWS Virtual Private Gateway / Transit Gateway",
      "Advertise identical on-premises prefixes over both Direct Connect and VPN connections",
      "Direct Connect has higher routing preference by default; traffic automatically switches to IPsec VPN on Direct Connect link failure"
    ],
    "followUpTopics": [
      "BGP AS Path prepending",
      "Direct Connect Virtual Interfaces"
    ]
  },
  {
    "id": "cse-012",
    "role": "Cloud Support Engineer",
    "category": "DNS & Networking",
    "difficulty": "Easy",
    "format": "practical",
    "question": "A website hosted in AWS is unreachable by domain name. What command-line utilities do you use to trace DNS resolution?",
    "expectedSkills": [
      "DNS",
      "Route 53"
    ],
    "evaluationPoints": [
      "dig +trace mydomain.com to trace full hierarchical DNS delegation from root nameservers to authoritative nameservers",
      "nslookup mydomain.com to check local resolver response",
      "host or dig @8.8.8.8 mydomain.com to verify authoritative nameserver returns correct A or CNAME record",
      "Check domain registration status (WHOIS) for registrar hold or expired domain"
    ],
    "followUpTopics": [
      "dig +trace",
      "TTL caching"
    ]
  },
  {
    "id": "cse-013",
    "role": "Cloud Support Engineer",
    "category": "Compute",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "A customer lost their SSH private key (.pem) for an EBS-backed EC2 instance. How do you recover access without losing data?",
    "expectedSkills": [
      "AWS EC2",
      "Storage"
    ],
    "evaluationPoints": [
      "Stop the compromised instance",
      "Detach the root EBS volume (/dev/xvda)",
      "Attach the volume to a healthy temporary rescue instance in the same AZ",
      "Mount the volume, append new public key into /home/ec2-user/.ssh/authorized_keys, unmount",
      "Re-attach volume back to original instance as /dev/xvda and start instance"
    ],
    "followUpTopics": [
      "EC2 Serial Console",
      "AWS Systems Manager Session Manager"
    ]
  },
  {
    "id": "cse-014",
    "role": "Cloud Support Engineer",
    "category": "Management & Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is AWS SSM Session Manager the modern best practice for server access instead of opening SSH Port 22?",
    "expectedSkills": [
      "AWS SSM",
      "Security"
    ],
    "evaluationPoints": [
      "Provides secure one-click browser or CLI shell access without opening inbound Port 22 or managing bastion hosts",
      "Eliminates managing and rotating SSH key pairs (.pem files); access controlled strictly via IAM policies",
      "Logs every executed command and session transcript to Amazon S3 and CloudWatch Logs for audit compliance"
    ],
    "followUpTopics": [
      "SSM Agent",
      "Zero inbound ports"
    ]
  },
  {
    "id": "cse-015",
    "role": "Cloud Support Engineer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "An Amazon RDS PostgreSQL instance is experiencing high CPU, low Freeable Memory, and ReadIOPS spikes. How do you investigate?",
    "expectedSkills": [
      "AWS RDS",
      "Performance"
    ],
    "evaluationPoints": [
      "Enable and inspect Performance Insights to identify top SQL queries contributing to Database Load (DBLoad vs vCPU line)",
      "Check CloudWatch metrics: ReadIOPS, WriteIOPS, DiskQueueDepth, FreeableMemory, and SwapUsage",
      "Inspect slow query logs to find unindexed full table scans causing buffer cache evictions and heavy disk reads"
    ],
    "followUpTopics": [
      "RDS Performance Insights",
      "DiskQueueDepth"
    ]
  },
  {
    "id": "cse-016",
    "role": "Cloud Support Engineer",
    "category": "Database",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "An RDS instance reaches 100% storage capacity and enters 'storage-full' status, dropping all writes. How do you recover it?",
    "expectedSkills": [
      "AWS RDS",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Modify DB instance immediately to allocate additional storage capacity (storage volume will expand in-place)",
      "Enable RDS Storage Auto-Scaling to prevent future recurrence (scales up to max threshold automatically)",
      "If modification is blocked, delete old manual snapshots or archive non-essential data if read-only access is available"
    ],
    "followUpTopics": [
      "Storage auto-scaling",
      "EBS volume expansion"
    ]
  },
  {
    "id": "cse-017",
    "role": "Cloud Support Engineer",
    "category": "Serverless",
    "difficulty": "Easy",
    "format": "technical",
    "question": "A Lambda function with a 30-second timeout consistently times out. What are the common root causes?",
    "expectedSkills": [
      "AWS Lambda",
      "Serverless"
    ],
    "evaluationPoints": [
      "Function is attempting to connect to resources in a private VPC (RDS, ElastiCache) without proper Security Group or VPC routing (missing NAT Gateway for internet)",
      "Downstream external API is hanging or taking longer than 30s to respond",
      "Database connection pool exhaustion or unindexed slow query blocking execution thread"
    ],
    "followUpTopics": [
      "Lambda VPC networking",
      "CloudWatch Logs Insights"
    ]
  },
  {
    "id": "cse-018",
    "role": "Cloud Support Engineer",
    "category": "Serverless",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you use CloudWatch Logs Insights to analyze Lambda execution durations and memory utilization?",
    "expectedSkills": [
      "AWS Lambda",
      "CloudWatch"
    ],
    "evaluationPoints": [
      "Run CloudWatch Logs Insights query filtering on 'REPORT' lines: fields @timestamp, @duration, @billedDuration, @memorySize, @maxMemoryUsed",
      "Identify whether function is hitting configured memory limit (out of memory triggers slow execution or crash)",
      "Check initDuration to see impact of cold starts on timeout limits"
    ],
    "followUpTopics": [
      "Billed duration",
      "Max memory used"
    ]
  },
  {
    "id": "cse-019",
    "role": "Cloud Support Engineer",
    "category": "Monitoring",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is an Amazon CloudWatch Synthetics Canary and how does it monitor website uptime proactively?",
    "expectedSkills": [
      "Monitoring",
      "CloudWatch"
    ],
    "evaluationPoints": [
      "Configurable Node.js/Python scripts running on a schedule (using Puppeteer/Selenium) to simulate customer interactions",
      "Tests endpoints, checkout flows, and API responses 24/7 from multiple AWS regions",
      "Triggers CloudWatch alarms and captures screenshots, HAR files, and execution traces on step failure before real users complain"
    ],
    "followUpTopics": [
      "Canary scripts",
      "Synthetic monitoring vs Real user monitoring"
    ]
  },
  {
    "id": "cse-020",
    "role": "Cloud Support Engineer",
    "category": "Customer Service",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you manage an angry customer experiencing a production-down emergency whose issue is taking longer than expected?",
    "expectedSkills": [
      "Communication",
      "Incident Management"
    ],
    "evaluationPoints": [
      "Acknowledge severity immediately with empathy; avoid robotic defensive language",
      "Establish regular communication cadence (e.g. status update every 30 minutes even if no breakthrough yet)",
      "Explain clearly what has been tested, what is ruled out, and what active diagnostic steps are underway"
    ],
    "followUpTopics": [
      "De-escalation",
      "Support SLAs"
    ]
  },
  {
    "id": "cse-021",
    "role": "Cloud Support Engineer",
    "category": "Compute",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why might an Auto Scaling Group fail to launch instances, repeatedly creating and terminating them in a loop?",
    "expectedSkills": [
      "Auto Scaling",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Instance fails EC2 or ELB health check immediately upon launch due to failing initialization script (User Data error)",
      "AMI ID in Launch Template is deleted, invalid, or belongs to a different architecture",
      "VPC subnet has exhausted available private IP addresses, blocking new ENI allocation"
    ],
    "followUpTopics": [
      "EC2 User Data logs",
      "Subnet IP exhaustion"
    ]
  },
  {
    "id": "cse-022",
    "role": "Cloud Support Engineer",
    "category": "Compute & Linux",
    "difficulty": "Easy",
    "format": "practical",
    "question": "Where do you find logs on an EC2 instance to see why a User Data bootstrap script failed to run?",
    "expectedSkills": [
      "Linux",
      "AWS EC2"
    ],
    "evaluationPoints": [
      "Inspect /var/log/cloud-init-output.log to see stdout and stderr of the user data script execution",
      "Inspect /var/log/cloud-init.log for cloud-init process details",
      "User data scripts run as root user only once on initial instance boot"
    ],
    "followUpTopics": [
      "cloud-init-output.log",
      "Cloud-init"
    ]
  },
  {
    "id": "cse-023",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you use traceroute and mtr (My Traceroute) to determine where network packet loss is occurring?",
    "expectedSkills": [
      "Networking",
      "Diagnostics"
    ],
    "evaluationPoints": [
      "mtr combines traceroute and ping; sends continuous packets to every router hop along the path",
      "Examine Loss% and Latency columns across each intermediate hop",
      "If packet loss appears on hop 4 and continues through all subsequent hops to destination, loss is genuine at hop 4; if loss appears on only one hop and not downstream, router is rate-limiting ICMP"
    ],
    "followUpTopics": [
      "MTR report",
      "ICMP rate limiting"
    ]
  },
  {
    "id": "cse-024",
    "role": "Cloud Support Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you capture network traffic on a Linux server using tcpdump to investigate missing HTTP responses?",
    "expectedSkills": [
      "Linux",
      "Networking"
    ],
    "evaluationPoints": [
      "sudo tcpdump -i eth0 -nn 'port 80 or port 443' -w capture.pcap",
      "-i specifies network interface; -nn disables DNS and port name resolution for speed; -w writes raw packet capture to file",
      "Transfer .pcap file to workstation and analyze in Wireshark to inspect TCP 3-way handshake, retransmissions, and HTTP payloads"
    ],
    "followUpTopics": [
      "tcpdump syntax",
      "Wireshark stream analysis"
    ]
  },
  {
    "id": "cse-025",
    "role": "Cloud Support Engineer",
    "category": "Cloud Support",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain AWS Support case severity levels (General guidance, System impaired, Production system down, Production system impaired, Business-critical system down).",
    "expectedSkills": [
      "AWS Support",
      "SLAs"
    ],
    "evaluationPoints": [
      "General Guidance: <24 hours response time",
      "System Impaired: <12 hours response time",
      "Production System Impaired: <4 hours response time",
      "Production System Down: <1 hour response time (24/7)",
      "Business-Critical System Down: <15 minutes response time (available on Enterprise Support plan)"
    ],
    "followUpTopics": [
      "Enterprise Support",
      "Severity response times"
    ]
  },
  {
    "id": "cse-026",
    "role": "Cloud Support Engineer",
    "category": "IAM",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "A developer in Account A fails to assume a role in Account B with 'Access Denied'. What two policies must be verified?",
    "expectedSkills": [
      "IAM",
      "Security"
    ],
    "evaluationPoints": [
      "Trust Policy on Role in Account B: must explicitly list Account A's root or user ARN under 'Principal': {'AWS': 'arn:aws:iam::AccountA:root'}",
      "Identity Policy on User/Role in Account A: must grant permission 'Action': 'sts:AssumeRole' on the specific Role ARN in Account B",
      "Both must be present; if either side is missing, sts:AssumeRole fails with 403 Access Denied"
    ],
    "followUpTopics": [
      "AssumeRole",
      "External ID in trust policy"
    ]
  },
  {
    "id": "cse-027",
    "role": "Cloud Support Engineer",
    "category": "Security & KMS",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why does an IAM Administrator with AdministratorAccess policy fail to decrypt an S3 object encrypted with a custom KMS key?",
    "expectedSkills": [
      "AWS KMS",
      "Security"
    ],
    "evaluationPoints": [
      "KMS keys do NOT follow standard IAM delegation unless the Key Policy explicitly delegates access to the account root",
      "The KMS Key Policy itself is the primary access control; if the Key Policy does not grant permissions to the user or account, IAM policies have zero effect",
      "Fix: add the user/role or the account root to the KMS Key Policy's 'Principal' block with kms:Decrypt permissions"
    ],
    "followUpTopics": [
      "KMS Key Policy",
      "IAM delegation"
    ]
  },
  {
    "id": "cse-028",
    "role": "Cloud Support Engineer",
    "category": "Messaging",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "An Amazon SQS queue's ApproximateNumberOfMessagesVisible metric is climbing to 100,000. How do you triage the bottleneck?",
    "expectedSkills": [
      "AWS SQS",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Check consumer service health: are worker EC2 instances, containers, or Lambda consumers crashing or deadlocked?",
      "Compare SQS ApproximateNumberOfMessagesVisible against NumberOfMessagesReceived and NumberOfMessagesDeleted to measure processing rate vs arrival rate",
      "Scale up consumer worker count or check for slow database writes / downstream API bottlenecks blocking workers"
    ],
    "followUpTopics": [
      "Visibility timeout",
      "Dead Letter Queue (DLQ)"
    ]
  },
  {
    "id": "cse-029",
    "role": "Cloud Support Engineer",
    "category": "Messaging",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is a Dead Letter Queue (DLQ) and what is the maxReceiveCount attribute in SQS?",
    "expectedSkills": [
      "AWS SQS",
      "Architecture"
    ],
    "evaluationPoints": [
      "DLQ is a secondary queue holding messages that failed processing after multiple attempts",
      "maxReceiveCount defines how many times a message can be received and returned to the queue before being routed to the DLQ",
      "Prevents poison pill messages from looping infinitely and blocking queue consumers"
    ],
    "followUpTopics": [
      "Poison pill messages",
      "Redrive policy"
    ]
  },
  {
    "id": "cse-030",
    "role": "Cloud Support Engineer",
    "category": "CDN",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "A website behind CloudFront returns 'CloudFront 403 Forbidden' vs 'CloudFront 502 Bad Gateway'. How do you isolate the source?",
    "expectedSkills": [
      "CloudFront",
      "CDN"
    ],
    "evaluationPoints": [
      "CloudFront 403: blocked by AWS WAF rule attached to distribution, or Origin S3 bucket policy denies CloudFront Origin Access Control (OAC)",
      "CloudFront 502: CloudFront cannot negotiate SSL/TLS with custom origin (expired certificate, mismatched domain name, or unsupported cipher suite), or origin server timed out"
    ],
    "followUpTopics": [
      "Origin Access Control (OAC)",
      "SSL negotiation with origin"
    ]
  },
  {
    "id": "cse-031",
    "role": "Cloud Support Engineer",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "An AWS Elastic Beanstalk deployment fails with 'Environment update failed'. Where do you find the exact error logs?",
    "expectedSkills": [
      "Elastic Beanstalk",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Request 'Last 100 Lines' or 'Full Logs' from Elastic Beanstalk console -> eb-engine.log and cfn-init.log",
      "eb-engine.log records execution of platform hooks and application container startup",
      "cfn-init.log records CloudFormation resource provisioning and .ebextensions configuration script failures"
    ],
    "followUpTopics": [
      "eb-engine.log",
      ".ebextensions"
    ]
  },
  {
    "id": "cse-032",
    "role": "Cloud Support Engineer",
    "category": "Documentation",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "Why is contributing to internal Knowledge Base (KB) articles and customer-facing playbooks critical in cloud support engineering?",
    "expectedSkills": [
      "Documentation",
      "Knowledge Sharing"
    ],
    "evaluationPoints": [
      "Empowers tier 1 support and on-call engineers to resolve recurring complex issues rapidly using verified standard procedures",
      "Eliminates tribal knowledge and reduces Mean Time to Resolution (MTTR)",
      "Improves customer self-service, reducing incoming support case volume"
    ],
    "followUpTopics": [
      "Runbooks",
      "MTTR reduction"
    ]
  },
  {
    "id": "cse-033",
    "role": "Cloud Support Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a complex cloud support issue involving multiple interconnected services (e.g. ALB -> ECS -> RDS) that you resolved.",
    "expectedSkills": [
      "Troubleshooting",
      "Communication"
    ],
    "evaluationPoints": [
      "Incident description and systematic end-to-end trace through the request path",
      "Isolating the failure layer using metrics, logs, and connection testing",
      "Resolution applied, customer communication, and preventative monitoring recommendations"
    ],
    "followUpTopics": [
      "End-to-end tracing",
      "Lessons learned"
    ]
  },
  {
    "id": "cse-034",
    "role": "Cloud Support Engineer",
    "category": "Communication",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you explain a complex technical limitation or root cause to a non-technical customer who is frustrated?",
    "expectedSkills": [
      "Communication",
      "Empathy"
    ],
    "evaluationPoints": [
      "Avoid deep jargon, acronyms, and defensive excuses",
      "Use clear analogies and focus on business impact and what actions have been taken",
      "Provide clear, step-by-step instructions with screenshots and offer a screen-share session if needed"
    ],
    "followUpTopics": [
      "Customer empathy",
      "Plain language"
    ]
  },
  {
    "id": "cse-035",
    "role": "Cloud Support Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How are AI-powered diagnostics (Amazon DevOps Guru, GenAI support assistants) transforming Cloud Support Engineering?",
    "expectedSkills": [
      "AIOps",
      "Modern Support"
    ],
    "evaluationPoints": [
      "Automatically correlates anomalies across CloudWatch metrics and logs to identify root cause recommendations before tickets are filed",
      "GenAI assistants synthesize customer logs, cloud architecture diagrams, and historical knowledge base articles to suggest instant diagnostic steps",
      "Shifts support engineers from manual log parsing to higher-level proactive reliability architecture"
    ],
    "followUpTopics": [
      "Amazon DevOps Guru",
      "AIOps"
    ]
  }
];
