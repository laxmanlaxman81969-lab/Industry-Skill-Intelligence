import { RoleQuestion } from '../types';

export const DEVOPS_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "dv-001",
    "role": "DevOps Engineer",
    "category": "Linux",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Linux file permissions (chmod 755 vs 644) and what the Sticky Bit does on directories like /tmp.",
    "expectedSkills": [
      "Linux"
    ],
    "evaluationPoints": [
      "Read (4), Write (2), Execute (1) across User, Group, Others",
      "chmod 755 gives read/execute to group/others, write to owner",
      "Sticky bit (chmod +t) prevents users from deleting files owned by others in a shared directory"
    ],
    "followUpTopics": [
      "chown",
      "umask"
    ]
  },
  {
    "id": "dv-002",
    "role": "DevOps Engineer",
    "category": "Linux",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "A server is experiencing high CPU and memory thrashing. What commands do you use to diagnose it?",
    "expectedSkills": [
      "Linux",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "top / htop to inspect CPU and process hierarchy",
      "free -m and vmstat to check memory and swap usage",
      "iostat and iotop to identify disk I/O bottlenecks",
      "dmesg to check for OOM killer invocations"
    ],
    "followUpTopics": [
      "lsof",
      "netstat / ss"
    ]
  },
  {
    "id": "dv-003",
    "role": "DevOps Engineer",
    "category": "Git",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare git merge vs git rebase. Why shouldn't you rebase commits already pushed to a shared branch?",
    "expectedSkills": [
      "Git"
    ],
    "evaluationPoints": [
      "git merge preserves full historical timeline with a merge commit",
      "git rebase rewrites commit history to produce a clean linear graph",
      "Rebasing shared branches rewrites commit hashes, breaking teammates' local repositories"
    ],
    "followUpTopics": [
      "git cherry-pick",
      "Interactive rebase (rebase -i)"
    ]
  },
  {
    "id": "dv-004",
    "role": "DevOps Engineer",
    "category": "Docker",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the architectural difference between a Docker container and a Virtual Machine (VM)?",
    "expectedSkills": [
      "Docker",
      "Virtualization"
    ],
    "evaluationPoints": [
      "VMs virtualize hardware including a guest OS kernel via a hypervisor (heavy, slow boot)",
      "Containers share host OS kernel using Linux namespaces and cgroups (lightweight, instant boot)",
      "Containers package only application and userspace dependencies"
    ],
    "followUpTopics": [
      "cgroups and namespaces",
      "Docker daemon"
    ]
  },
  {
    "id": "dv-005",
    "role": "DevOps Engineer",
    "category": "Docker",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why should you use Docker multi-stage builds in CI/CD pipelines?",
    "expectedSkills": [
      "Docker",
      "Optimization"
    ],
    "evaluationPoints": [
      "Separates build environment (compilers, SDKs) from runtime environment",
      "Dramatically reduces final image size (e.g. from 1GB to 50MB)",
      "Improves security by eliminating package managers and source code from production images"
    ],
    "followUpTopics": [
      "Distroless images",
      ".dockerignore"
    ]
  },
  {
    "id": "dv-006",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the Kubernetes Control Plane components: API Server, etcd, Scheduler, and Controller Manager.",
    "expectedSkills": [
      "Kubernetes",
      "Architecture"
    ],
    "evaluationPoints": [
      "kube-apiserver is central gateway handling all REST operations",
      "etcd is distributed key-value store holding cluster state",
      "kube-scheduler assigns unscheduled pods to nodes based on resource constraints",
      "kube-controller-manager runs core loop reconciliations"
    ],
    "followUpTopics": [
      "kubelet",
      "kube-proxy"
    ]
  },
  {
    "id": "dv-007",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Liveness, Readiness, and Startup Probes in Kubernetes pod specifications.",
    "expectedSkills": [
      "Kubernetes"
    ],
    "evaluationPoints": [
      "Startup probe verifies application initialization before other probes run",
      "Liveness probe restarts container if unhealthy or deadlocked",
      "Readiness probe controls whether traffic is routed to pod by Service"
    ],
    "followUpTopics": [
      "HTTP vs Exec probes",
      "InitialDelaySeconds"
    ]
  },
  {
    "id": "dv-008",
    "role": "DevOps Engineer",
    "category": "CI/CD",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you integrate automated security scanning into a GitHub Actions or GitLab CI pipeline?",
    "expectedSkills": [
      "CI/CD",
      "DevSecOps"
    ],
    "evaluationPoints": [
      "Static Application Security Testing (SAST) with SonarQube or Semgrep",
      "Software Bill of Materials (SBOM) and dependency scanning with Snyk or Trivy",
      "Container vulnerability scanning before pushing to registry",
      "Secrets detection with Gitleaks"
    ],
    "followUpTopics": [
      "DAST",
      "Trivy"
    ]
  },
  {
    "id": "dv-009",
    "role": "DevOps Engineer",
    "category": "Terraform",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the Terraform workflow (init, plan, apply) and the role of the terraform.tfstate file.",
    "expectedSkills": [
      "Terraform",
      "IaC"
    ],
    "evaluationPoints": [
      "terraform init initializes providers and modules",
      "terraform plan computes diff between code and current state",
      "terraform apply provisions infrastructure",
      "tfstate maps declared resources to real-world cloud IDs"
    ],
    "followUpTopics": [
      "Remote state in S3",
      "State locking with DynamoDB"
    ]
  },
  {
    "id": "dv-010",
    "role": "DevOps Engineer",
    "category": "Terraform",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you safely manage Terraform state across distributed engineering teams?",
    "expectedSkills": [
      "Terraform",
      "DevOps"
    ],
    "evaluationPoints": [
      "Store tfstate in remote backend (AWS S3, Terraform Cloud) with encryption",
      "Enable state locking using DynamoDB to prevent concurrent modifications",
      "Isolate environments using Terraform workspaces or directory structures"
    ],
    "followUpTopics": [
      "State drift",
      "terraform import"
    ]
  },
  {
    "id": "dv-011",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare ClusterIP, NodePort, LoadBalancer, and Ingress in Kubernetes.",
    "expectedSkills": [
      "Kubernetes",
      "Networking"
    ],
    "evaluationPoints": [
      "ClusterIP exposes service internally within cluster only (default)",
      "NodePort exposes service on static port on each worker node",
      "LoadBalancer provisions cloud provider external load balancer",
      "Ingress provides HTTP/HTTPS routing, SSL termination, and host-based path routing via single IP"
    ],
    "followUpTopics": [
      "Ingress controller (Nginx)",
      "Cert-manager"
    ]
  },
  {
    "id": "dv-012",
    "role": "DevOps Engineer",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you implement zero-downtime Canary deployments in Kubernetes using Argo Rollouts or Istio?",
    "expectedSkills": [
      "Kubernetes",
      "Continuous Deployment"
    ],
    "evaluationPoints": [
      "Argo Rollouts replaces Deployment with Rollout resource",
      "Gradually shifts traffic % to canary version (e.g. 10% -> 25% -> 100%)",
      "Automated rollback if error rate metrics from Prometheus spike"
    ],
    "followUpTopics": [
      "Istio Service Mesh",
      "Flagger"
    ]
  },
  {
    "id": "dv-013",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you inject configuration and sensitive credentials into Kubernetes pods securely?",
    "expectedSkills": [
      "Kubernetes"
    ],
    "evaluationPoints": [
      "ConfigMaps store non-sensitive key-values mounted as env vars or volume files",
      "Secrets store base64-encoded credentials (not encrypted at rest by default)",
      "Use external secret operators (HashiCorp Vault, AWS Secrets Manager) for true secret encryption"
    ],
    "followUpTopics": [
      "External Secrets Operator",
      "Sealed Secrets"
    ]
  },
  {
    "id": "dv-014",
    "role": "DevOps Engineer",
    "category": "Monitoring",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain how Prometheus pulls metrics using pull-based scraping, PromQL, and Alertmanager.",
    "expectedSkills": [
      "Prometheus",
      "Monitoring"
    ],
    "evaluationPoints": [
      "Prometheus scrapes /metrics endpoints over HTTP at periodic intervals",
      "Time-series database optimized for metric queries using PromQL",
      "Alertmanager routes, silences, and sends alerts (Slack, PagerDuty) on threshold breaches"
    ],
    "followUpTopics": [
      "Pushgateway",
      "Node exporter"
    ]
  },
  {
    "id": "dv-015",
    "role": "DevOps Engineer",
    "category": "Logging",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does a centralized logging pipeline (Elasticsearch, Fluentd/Logstash, Kibana) collect Kubernetes logs?",
    "expectedSkills": [
      "Logging",
      "Observability"
    ],
    "evaluationPoints": [
      "Fluentd/Fluent Bit runs as DaemonSet on each node collecting container stdout/stderr logs",
      "Enriches logs with Kubernetes metadata (namespace, pod_name, labels)",
      "Indexes logs into Elasticsearch / OpenSearch for query and visualization in Kibana"
    ],
    "followUpTopics": [
      "Loki vs Elasticsearch",
      "Log retention policies"
    ]
  },
  {
    "id": "dv-016",
    "role": "DevOps Engineer",
    "category": "Networking",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does CoreDNS resolve service discovery queries like 'my-service.my-namespace.svc.cluster.local'?",
    "expectedSkills": [
      "Kubernetes",
      "Networking"
    ],
    "evaluationPoints": [
      "CoreDNS runs as cluster deployment watching Kubernetes API for service and endpoint changes",
      "Assigns internal DNS A-records pointing to Service ClusterIP",
      "Pods query CoreDNS via nameserver entry in /etc/resolv.conf"
    ],
    "followUpTopics": [
      "ndots:5 latency issue",
      "kube-dns"
    ]
  },
  {
    "id": "dv-017",
    "role": "DevOps Engineer",
    "category": "Linux",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you create, start, enable, and view logs for a custom systemd service in Linux?",
    "expectedSkills": [
      "Linux"
    ],
    "evaluationPoints": [
      "Create unit file in /etc/systemd/system/myapp.service with [Unit], [Service], [Install] sections",
      "systemctl daemon-reload",
      "systemctl start myapp and systemctl enable myapp (for boot startup)",
      "Inspect logs using journalctl -u myapp -f"
    ],
    "followUpTopics": [
      "Restart=always",
      "StandardOutput configuration"
    ]
  },
  {
    "id": "dv-018",
    "role": "DevOps Engineer",
    "category": "Docker",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Docker networking modes: bridge, host, none, and overlay.",
    "expectedSkills": [
      "Docker",
      "Networking"
    ],
    "evaluationPoints": [
      "bridge (default) creates isolated virtual network with NAT port forwarding",
      "host removes network isolation; container shares host network stack directly",
      "none disables networking entirely",
      "overlay enables multi-host container networking across Docker Swarm or Kubernetes"
    ],
    "followUpTopics": [
      "Docker port binding (-p)",
      "veth pairs"
    ]
  },
  {
    "id": "dv-019",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When do you use a DaemonSet and when do you use a StatefulSet in Kubernetes?",
    "expectedSkills": [
      "Kubernetes"
    ],
    "evaluationPoints": [
      "DaemonSet runs exactly one replica on every node in cluster (logging agents, monitoring daemons)",
      "StatefulSet manages stateful workloads requiring stable network IDs, persistent ordered storage, and graceful shutdown (Databases, Kafka)"
    ],
    "followUpTopics": [
      "PersistentVolumeClaims",
      "Headless services"
    ]
  },
  {
    "id": "dv-020",
    "role": "DevOps Engineer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you automate SSL certificate generation and renewal in Kubernetes using cert-manager?",
    "expectedSkills": [
      "Security",
      "Kubernetes"
    ],
    "evaluationPoints": [
      "cert-manager operator watches Certificate custom resources",
      "Interacts with Let's Encrypt using ACME protocol (HTTP-01 or DNS-01 challenge)",
      "Automatically provisions and rotates TLS Secret referenced by Ingress"
    ],
    "followUpTopics": [
      "ACME challenges",
      "Wildcard certificates"
    ]
  },
  {
    "id": "dv-021",
    "role": "DevOps Engineer",
    "category": "CI/CD",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you optimize CI/CD pipeline execution time by caching dependencies (npm, maven, pip, docker layers)?",
    "expectedSkills": [
      "CI/CD",
      "Optimization"
    ],
    "evaluationPoints": [
      "Use actions/cache in GitHub Actions keyed on lockfile hash (package-lock.json)",
      "Leverage Docker layer caching (BuildKit cache mounts)",
      "Run parallel jobs for linting, testing, and security scanning"
    ],
    "followUpTopics": [
      "GitHub Actions cache",
      "BuildKit"
    ]
  },
  {
    "id": "dv-022",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does the Kubernetes HPA scale pods based on CPU utilization and custom metrics?",
    "expectedSkills": [
      "Kubernetes",
      "Autoscaling"
    ],
    "evaluationPoints": [
      "HPA queries Metrics Server or Prometheus Adapter every 15 seconds",
      "Calculates desired replicas: ceil(currentReplicas * (currentMetric / targetMetric))",
      "Scales Deployment up or down subject to min/max replica boundaries and stabilization window"
    ],
    "followUpTopics": [
      "Metrics Server",
      "KEDA (Kubernetes Event-driven Autoscaling)"
    ]
  },
  {
    "id": "dv-023",
    "role": "DevOps Engineer",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does a Kubernetes Deployment execute a zero-downtime rolling update with maxSurge and maxUnavailable?",
    "expectedSkills": [
      "Kubernetes"
    ],
    "evaluationPoints": [
      "Creates new ReplicaSet alongside old one",
      "maxSurge specifies maximum pods that can be created above desired count",
      "maxUnavailable specifies maximum pods that can be down during update",
      "Readiness probes ensure new pods are healthy before terminating old pods"
    ],
    "followUpTopics": [
      "RollingUpdate strategy",
      "kubectl rollout undo"
    ]
  },
  {
    "id": "dv-024",
    "role": "DevOps Engineer",
    "category": "Ansible",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is idempotency in Ansible playbooks and how does Ansible differ from Terraform?",
    "expectedSkills": [
      "Ansible",
      "IaC"
    ],
    "evaluationPoints": [
      "Ansible is configuration management tool operating over SSH without agents",
      "Idempotency ensures executing playbook multiple times leaves system in exact same desired state without unintended side effects",
      "Terraform provisions infrastructure; Ansible configures OS and software"
    ],
    "followUpTopics": [
      "Ansible roles",
      "Inventory files"
    ]
  },
  {
    "id": "dv-025",
    "role": "DevOps Engineer",
    "category": "Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are best practices for securing an SSH server on a production Linux host?",
    "expectedSkills": [
      "Linux",
      "Security"
    ],
    "evaluationPoints": [
      "Disable root login (PermitRootLogin no)",
      "Disable password authentication, enforce SSH keys (PasswordAuthentication no)",
      "Change default port 22, use Fail2ban to block brute force attempts",
      "Restrict allowed users and use SSH certificates or bastion hosts"
    ],
    "followUpTopics": [
      "ssh-keygen",
      "Bastion hosts"
    ]
  },
  {
    "id": "dv-026",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do Kubernetes NetworkPolicies enforce microsegmentation and pod-to-pod firewall rules?",
    "expectedSkills": [
      "Kubernetes",
      "Security"
    ],
    "evaluationPoints": [
      "Requires CNI plugin supporting network policies (Calico, Cilium)",
      "Defines ingress and egress rules filtering traffic by podSelector, namespaceSelector, or ipBlock",
      "Default deny rule isolates all pods in namespace unless explicitly allowed"
    ],
    "followUpTopics": [
      "Calico",
      "Cilium eBPF"
    ]
  },
  {
    "id": "dv-027",
    "role": "DevOps Engineer",
    "category": "Disaster Recovery",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you perform backup and disaster recovery for Kubernetes clusters using Velero?",
    "expectedSkills": [
      "Disaster Recovery",
      "Kubernetes"
    ],
    "evaluationPoints": [
      "Velero backs up cluster resource manifests to object storage (S3)",
      "Takes snapshots of persistent volumes (EBS, PersistentVolumes)",
      "Enables full cluster restoration or migration to a new region/cluster"
    ],
    "followUpTopics": [
      "RTO and RPO",
      "Snapshot replication"
    ]
  },
  {
    "id": "dv-028",
    "role": "DevOps Engineer",
    "category": "GitOps",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is GitOps and how does ArgoCD reconcile cluster state with a Git repository?",
    "expectedSkills": [
      "GitOps",
      "ArgoCD"
    ],
    "evaluationPoints": [
      "Git repository is single source of truth for all declared infrastructure and app manifests",
      "ArgoCD runs agent in cluster continuously comparing Git state to live cluster state",
      "Automatically syncs or alerts on configuration drift"
    ],
    "followUpTopics": [
      "Automated sync",
      "Helm / Kustomize integration"
    ]
  },
  {
    "id": "dv-029",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "A pod in production is stuck in CrashLoopBackOff. What diagnostic sequence do you follow?",
    "expectedSkills": [
      "Troubleshooting",
      "Kubernetes"
    ],
    "evaluationPoints": [
      "kubectl describe pod <name> to check exit code and events (OOMKilled, failed probe)",
      "kubectl logs <name> --previous to inspect stdout/stderr before the container crashed",
      "Check entrypoint commands, missing ConfigMap/Secret environment variables, and file permissions"
    ],
    "followUpTopics": [
      "OOMKilled exit 137",
      "ephemeral debug container"
    ]
  },
  {
    "id": "dv-030",
    "role": "DevOps Engineer",
    "category": "Networking",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Layer 4 (TCP/UDP) vs Layer 7 (HTTP/HTTPS) load balancing.",
    "expectedSkills": [
      "Networking"
    ],
    "evaluationPoints": [
      "Layer 4 routes packets based on IP and port without inspecting payload (faster, lower CPU)",
      "Layer 7 inspects application layer data (HTTP headers, cookies, URL paths) for intelligent routing",
      "Layer 7 performs SSL termination, path routing, and header rewrites"
    ],
    "followUpTopics": [
      "AWS ALB vs NLB",
      "HAProxy"
    ]
  },
  {
    "id": "dv-031",
    "role": "DevOps Engineer",
    "category": "Kubernetes",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the difference between CPU/Memory requests and limits in Kubernetes.",
    "expectedSkills": [
      "Kubernetes"
    ],
    "evaluationPoints": [
      "Requests define guaranteed resources reserved for scheduling (scheduler assigns node with enough capacity)",
      "Limits set hard maximum boundaries; exceeding memory limit results in OOMKill",
      "Exceeding CPU limit results in CPU throttling rather than container kill"
    ],
    "followUpTopics": [
      "Quality of Service (Guaranteed, Burstable, BestEffort)",
      "CPU throttling"
    ]
  },
  {
    "id": "dv-032",
    "role": "DevOps Engineer",
    "category": "Behavioral",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a blameless post-mortem you led after a major production outage.",
    "expectedSkills": [
      "Incident Response",
      "Communication"
    ],
    "evaluationPoints": [
      "Document timeline of events from detection to resolution",
      "Identify root cause without assigning personal blame (5 Whys methodology)",
      "Define actionable preventative tasks with owners and due dates"
    ],
    "followUpTopics": [
      "Blameless culture",
      "Mean Time to Recovery (MTTR)"
    ]
  },
  {
    "id": "dv-033",
    "role": "DevOps Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Tell me about a high-severity production infrastructure outage you handled. How did you restore service?",
    "expectedSkills": [
      "Troubleshooting",
      "Communication"
    ],
    "evaluationPoints": [
      "Incident declaration and stakeholder communication",
      "Fastest path to mitigation (rollback, traffic reroute, scaling)",
      "Post-incident root cause analysis and permanent fix"
    ],
    "followUpTopics": [
      "On-call management",
      "PagerDuty"
    ]
  },
  {
    "id": "dv-034",
    "role": "DevOps Engineer",
    "category": "Culture",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you balance implementing strict security/infrastructure controls with developer productivity?",
    "expectedSkills": [
      "DevOps Culture",
      "Platform Engineering"
    ],
    "evaluationPoints": [
      "Create self-service internal developer platforms (IDP) and golden paths",
      "Automate security scanning inside CI/CD with clear actionable fix suggestions",
      "Avoid becoming a manual operational bottleneck"
    ],
    "followUpTopics": [
      "Golden paths",
      "Internal Developer Platforms"
    ]
  },
  {
    "id": "dv-035",
    "role": "DevOps Engineer",
    "category": "Modern Trends",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is eBPF and how is it transforming Kubernetes networking, security, and observability (Cilium)?",
    "expectedSkills": [
      "Modern DevOps",
      "eBPF"
    ],
    "evaluationPoints": [
      "Runs sandboxed bytecode inside Linux kernel without modifying kernel source code",
      "Enables ultra-fast packet routing, deep kernel observability, and real-time security enforcement",
      "Eliminates iptables/kube-proxy overhead at massive scale"
    ],
    "followUpTopics": [
      "Cilium",
      "Falco security"
    ]
  }
];
