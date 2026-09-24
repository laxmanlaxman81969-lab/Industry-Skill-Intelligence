import { RoleQuestion } from '../types';

export const CYBERSECURITY_ANALYST_QUESTIONS: RoleQuestion[] = [
  {
    "id": "csa-001",
    "role": "Cybersecurity Analyst",
    "category": "Security Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the CIA Triad (Confidentiality, Integrity, Availability) with practical cybersecurity controls for each.",
    "expectedSkills": [
      "Security Fundamentals"
    ],
    "evaluationPoints": [
      "Confidentiality: preventing unauthorized access to data (Encryption at rest/in transit, Access Control Lists, MFA)",
      "Integrity: ensuring data has not been altered or tampered with (Cryptographic hashes, Digital signatures, HMACs)",
      "Availability: ensuring authorized users have timely access to data (DDoS mitigation, Load balancers, Redundant backups, Disaster recovery)"
    ],
    "followUpTopics": [
      "Non-repudiation",
      "Authentication vs Authorization"
    ]
  },
  {
    "id": "csa-002",
    "role": "Cybersecurity Analyst",
    "category": "Networking",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Map common cybersecurity attacks across the 7 layers of the OSI model.",
    "expectedSkills": [
      "Networking",
      "OSI Model"
    ],
    "evaluationPoints": [
      "Layer 7 (Application): SQL Injection, XSS, CSRF, HTTP flood",
      "Layer 4 (Transport): SYN Flood DDoS, Port scanning",
      "Layer 3 (Network): IP Spoofing, ICMP Ping of Death",
      "Layer 2 (Data Link): ARP Poisoning, MAC flooding"
    ],
    "followUpTopics": [
      "TCP handshake",
      "Wireshark packet analysis"
    ]
  },
  {
    "id": "csa-003",
    "role": "Cybersecurity Analyst",
    "category": "Cryptography",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Symmetric (AES) vs Asymmetric (RSA, ECC) encryption. How does TLS combine both?",
    "expectedSkills": [
      "Cryptography"
    ],
    "evaluationPoints": [
      "Symmetric uses single shared secret key for encryption and decryption (very fast, bulk data like AES-256)",
      "Asymmetric uses key pair: public key encrypts, private key decrypts (slower, key exchange and digital signatures)",
      "TLS handshake uses asymmetric cryptography (RSA/ECDHE) to securely exchange symmetric session key, then uses AES-GCM for fast data transmission"
    ],
    "followUpTopics": [
      "AES-256",
      "Public Key Infrastructure (PKI)"
    ]
  },
  {
    "id": "csa-004",
    "role": "Cybersecurity Analyst",
    "category": "SOC",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the role of a Security Information and Event Management (SIEM) system in a Security Operations Center (SOC)?",
    "expectedSkills": [
      "SIEM",
      "SOC Operations"
    ],
    "evaluationPoints": [
      "Aggregates and centralizes logs from firewalls, servers, endpoints, and domain controllers in real time",
      "Correlation rules correlate disparate events to detect multi-stage attack patterns",
      "Generates alerts for SOC analysts, assigning severity and feeding into SOAR automation playbooks"
    ],
    "followUpTopics": [
      "Splunk / Microsoft Sentinel",
      "SOAR automation"
    ]
  },
  {
    "id": "csa-005",
    "role": "Cybersecurity Analyst",
    "category": "Incident Response",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the 6 phases of the Incident Response process according to NIST SP 800-61.",
    "expectedSkills": [
      "Incident Response",
      "NIST"
    ],
    "evaluationPoints": [
      "Preparation: hardening systems, training team, deploying tools, establishing communication channels",
      "Detection & Analysis: identifying indicators of compromise (IoCs), validating alert, determining scope",
      "Containment: isolating compromised systems from network to prevent lateral movement",
      "Eradication: removing malware, closing vulnerabilities, revoking compromised credentials",
      "Recovery: restoring systems from clean backups and monitoring",
      "Lessons Learned: post-incident review and updating playbooks"
    ],
    "followUpTopics": [
      "Indicators of Compromise (IoCs)",
      "Containment strategies"
    ]
  },
  {
    "id": "csa-006",
    "role": "Cybersecurity Analyst",
    "category": "Email Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do SPF, DKIM, and DMARC DNS records authenticate emails and protect against domain spoofing?",
    "expectedSkills": [
      "Email Security",
      "DNS"
    ],
    "evaluationPoints": [
      "SPF (Sender Policy Framework): lists authorized IP addresses allowed to send email on behalf of domain",
      "DKIM (DomainKeys Identified Mail): adds digital cryptographic signature to email headers matching public key in DNS",
      "DMARC: tells recipient servers what policy to enforce (none, quarantine, reject) if SPF or DKIM fails"
    ],
    "followUpTopics": [
      "DMARC alignment",
      "Business Email Compromise (BEC)"
    ]
  },
  {
    "id": "csa-007",
    "role": "Cybersecurity Analyst",
    "category": "Network Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare traditional stateful packet-filtering firewalls vs Next-Generation Firewalls (NGFW).",
    "expectedSkills": [
      "Firewalls",
      "Network Security"
    ],
    "evaluationPoints": [
      "Stateful firewalls inspect packets at Layer 3/4 based strictly on IP addresses, ports, and connection state tables",
      "NGFW operates at Layer 7: performs Deep Packet Inspection (DPI), identifies application traffic regardless of port used",
      "NGFW integrates Intrusion Prevention (IPS), antivirus scanning, threat intelligence, and TLS decryption"
    ],
    "followUpTopics": [
      "Deep Packet Inspection (DPI)",
      "Palo Alto / Fortinet"
    ]
  },
  {
    "id": "csa-008",
    "role": "Cybersecurity Analyst",
    "category": "Network Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?",
    "expectedSkills": [
      "IDS",
      "IPS"
    ],
    "evaluationPoints": [
      "IDS sits out-of-band (via network TAP or span port); passively monitors traffic and sends alerts on suspicious signatures",
      "IPS sits in-line with network traffic; can actively block malicious packets, drop connections, and reset TCP sessions in real time",
      "Signature-based detection vs anomaly/heuristic-based detection"
    ],
    "followUpTopics": [
      "Signature vs Anomaly detection",
      "False positives in IPS"
    ]
  },
  {
    "id": "csa-009",
    "role": "Cybersecurity Analyst",
    "category": "Threat Intelligence",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do security analysts use the MITRE ATT&CK framework to map adversary Tactics, Techniques, and Procedures (TTPs)?",
    "expectedSkills": [
      "MITRE ATT&CK",
      "Threat Intelligence"
    ],
    "evaluationPoints": [
      "Globally accessible knowledge base of real-world adversary tactics and techniques",
      "Tactics represent the 'why' (e.g. Initial Access, Persistence, Privilege Escalation, Lateral Movement, Exfiltration)",
      "Techniques represent the 'how' (e.g. T1059 Command and Scripting Interpreter)",
      "Used to assess defensive coverage, identify blind spots, and emulate realistic adversary attacks"
    ],
    "followUpTopics": [
      "Threat hunting",
      "TTPs (Tactics, Techniques, Procedures)"
    ]
  },
  {
    "id": "csa-010",
    "role": "Cybersecurity Analyst",
    "category": "Identity & Access",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the three factors of authentication, and how do attackers bypass MFA via MFA fatigue or Adversary-in-the-Middle (AiTM)?",
    "expectedSkills": [
      "MFA",
      "Identity"
    ],
    "evaluationPoints": [
      "Factors: Something you know (password), Something you have (phone, security key), Something you are (biometrics)",
      "MFA Fatigue (Push Spamming): attacker floods user with hundreds of push notifications until user taps 'Approve' to stop alerts",
      "AiTM phishing proxies (Evilginx) steal authenticated session cookies after user completes legit MFA prompt"
    ],
    "followUpTopics": [
      "FIDO2 / WebAuthn",
      "Phishing-resistant MFA"
    ]
  },
  {
    "id": "csa-011",
    "role": "Cybersecurity Analyst",
    "category": "Vulnerability Management",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between a Vulnerability Assessment (Nessus, Qualys) and a Penetration Test?",
    "expectedSkills": [
      "Vulnerability Management"
    ],
    "evaluationPoints": [
      "Vulnerability assessment is automated, broad scan identifying known missing patches and misconfigurations without exploiting them",
      "Penetration testing is human-led, goal-oriented ethical hacking that actively exploits vulnerabilities to demonstrate real-world impact and business risk",
      "Assessments run frequently; pentests run periodically (annually or after major release)"
    ],
    "followUpTopics": [
      "Nessus / Qualys",
      "CVE / CVSS scores"
    ]
  },
  {
    "id": "csa-012",
    "role": "Cybersecurity Analyst",
    "category": "Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the core tenets of Zero Trust Architecture: 'Never trust, always verify'.",
    "expectedSkills": [
      "Zero Trust",
      "Security Architecture"
    ],
    "evaluationPoints": [
      "Eliminates implicit trust based on network location (inside corporate intranet is treated the same as public internet)",
      "Enforces least privilege access per request based on user identity, device health posture, and contextual risk signals",
      "Continuous monitoring and microsegmentation preventing lateral movement"
    ],
    "followUpTopics": [
      "Microsegmentation",
      "BeyondCorp"
    ]
  },
  {
    "id": "csa-013",
    "role": "Cybersecurity Analyst",
    "category": "Malware",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Describe the stages of a modern double-extortion ransomware attack and the defense-in-depth controls to stop it.",
    "expectedSkills": [
      "Ransomware",
      "Malware Defense"
    ],
    "evaluationPoints": [
      "Initial access (phishing, RDP exposure) -> Credential dumping (Mimikatz) -> Lateral movement -> Data exfiltration (extortion tier 1) -> Volume shadow copy deletion and mass encryption (extortion tier 2)",
      "Defenses: immutable offline/air-gapped backups, EDR agent blocking encryption behavior, MFA on all remote access, network segmentation"
    ],
    "followUpTopics": [
      "Air-gapped backups",
      "EDR behavioral blocking"
    ]
  },
  {
    "id": "csa-014",
    "role": "Cybersecurity Analyst",
    "category": "Endpoint Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does an EDR agent (CrowdStrike, SentinelOne) differ from traditional signature-based antivirus?",
    "expectedSkills": [
      "EDR",
      "Endpoint Security"
    ],
    "evaluationPoints": [
      "Traditional AV matches known static file hashes/signatures against virus database (blind to novel zero-days and fileless malware)",
      "EDR continuously monitors and logs endpoint telemetry (process execution trees, registry modifications, memory injection, network connections)",
      "Uses machine learning and behavioral heuristics to detect and automatically isolate compromised endpoints in real time"
    ],
    "followUpTopics": [
      "Fileless malware",
      "Live response"
    ]
  },
  {
    "id": "csa-015",
    "role": "Cybersecurity Analyst",
    "category": "Web Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does an attacker execute a CSRF attack against a banking transfer endpoint, and why does SameSite cookie attribute mitigate it?",
    "expectedSkills": [
      "Web Security",
      "CSRF"
    ],
    "evaluationPoints": [
      "Attacker lures authenticated user to visit malicious site with hidden image/form auto-submitting POST to bank.com/transfer",
      "Browser automatically attaches victim's valid session cookies to cross-site request",
      "SameSite=Strict cookie attribute instructs browser to never attach cookies on cross-site requests, completely blocking CSRF"
    ],
    "followUpTopics": [
      "Anti-CSRF tokens",
      "SameSite=Lax vs Strict"
    ]
  },
  {
    "id": "csa-016",
    "role": "Cybersecurity Analyst",
    "category": "Web Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare In-band (Classic), Inferential (Blind), and Out-of-Band SQL Injection. How do you remediate them?",
    "expectedSkills": [
      "SQL Injection",
      "OWASP"
    ],
    "evaluationPoints": [
      "In-band: attacker views SQL query results directly on screen (UNION-based, error-based)",
      "Blind/Inferential: no data displayed on screen; attacker infers database structure via boolean True/False response differences or time delays (WAITFOR DELAY)",
      "Remediation: Prepared Statements / Parameterized queries across all database drivers, input validation, least privilege database accounts"
    ],
    "followUpTopics": [
      "Blind SQLi",
      "Parameterized queries"
    ]
  },
  {
    "id": "csa-017",
    "role": "Cybersecurity Analyst",
    "category": "Network Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare volumetric, protocol, and application-layer DDoS attacks. How do CDNs/Cloudflare mitigate them?",
    "expectedSkills": [
      "DDoS",
      "Network Security"
    ],
    "evaluationPoints": [
      "Volumetric: floods network pipe with massive bandwidth (UDP flood, NTP amplification)",
      "Protocol: exhausts server/firewall state tables (TCP SYN Flood)",
      "Application layer: floods web server with resource-heavy HTTP requests (HTTP GET/POST flood)",
      "Mitigation: Anycast network routing, CDN edge caching, WAF rate-limiting, SYN cookies"
    ],
    "followUpTopics": [
      "Anycast routing",
      "SYN cookies"
    ]
  },
  {
    "id": "csa-018",
    "role": "Cybersecurity Analyst",
    "category": "Cryptography",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain how a Certificate Authority (CA) signs an X.509 SSL certificate and how a browser validates the trust chain.",
    "expectedSkills": [
      "PKI",
      "Cryptography"
    ],
    "evaluationPoints": [
      "Website generates private key and sends Certificate Signing Request (CSR) with public key to CA",
      "CA verifies domain ownership and signs certificate using CA private key",
      "Browser has pre-installed trusted root CA certificates in OS trust store; validates CA cryptographic signature down the intermediate chain to server certificate"
    ],
    "followUpTopics": [
      "Certificate Revocation Lists (CRL)",
      "OCSP Stapling"
    ]
  },
  {
    "id": "csa-019",
    "role": "Cybersecurity Analyst",
    "category": "Active Directory",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does Kerberos authentication work in Windows Active Directory, and what is a Golden Ticket attack?",
    "expectedSkills": [
      "Active Directory",
      "Kerberos"
    ],
    "evaluationPoints": [
      "Ticket Granting Service (TGS) issues Ticket Granting Tickets (TGT) encrypted with KRBTGT account hash",
      "Golden Ticket attack: adversary extracts KRBTGT password hash and forges arbitrary TGT tickets with domain admin privileges lasting 10 years",
      "Pass-the-Hash allows attacker with NTLM hash to authenticate without cracking the plaintext password"
    ],
    "followUpTopics": [
      "KRBTGT account",
      "Mimikatz"
    ]
  },
  {
    "id": "csa-020",
    "role": "Cybersecurity Analyst",
    "category": "Threat Intelligence",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Threat Hunting and how does it differ from reactive alert triage in a SOC?",
    "expectedSkills": [
      "Threat Hunting",
      "SOC Operations"
    ],
    "evaluationPoints": [
      "Proactive, iterative search through network and endpoint telemetry to detect stealthy adversaries that bypassed automated security alerts",
      "Begins with a hypothesis based on newly published threat intelligence or MITRE ATT&CK technique",
      "Analyzes event logs for subtle behavioral anomalies (e.g. unusual PowerShell executions, rundll32 network connections)"
    ],
    "followUpTopics": [
      "Hypothesis-driven hunting",
      "Behavioral baselines"
    ]
  },
  {
    "id": "csa-021",
    "role": "Cybersecurity Analyst",
    "category": "Log Analysis",
    "difficulty": "Easy",
    "format": "practical",
    "question": "What are the most critical Windows Security Event IDs every security analyst must know?",
    "expectedSkills": [
      "Log Analysis",
      "Windows Security"
    ],
    "evaluationPoints": [
      "Event ID 4624: Successful logon; Event ID 4625: Failed logon (brute force detection)",
      "Event ID 4688: New process created (detects suspicious command line executions)",
      "Event ID 4720: User account created; Event ID 4728: Member added to security group",
      "Event ID 1102: The audit log was cleared (indicator of tampering)"
    ],
    "followUpTopics": [
      "Logon types (Type 2, 3, 10)",
      "Sysmon telemetry"
    ]
  },
  {
    "id": "csa-022",
    "role": "Cybersecurity Analyst",
    "category": "Cloud Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What does a CSPM tool do to identify misconfigurations across multi-cloud environments?",
    "expectedSkills": [
      "Cloud Security",
      "CSPM"
    ],
    "evaluationPoints": [
      "Continuously monitors AWS, Azure, and GCP resources against security benchmarks (CIS Benchmarks, NIST)",
      "Detects high-risk misconfigurations (public S3 buckets, open security group 0.0.0.0/0 on port 22/3389, unencrypted EBS volumes)",
      "Provides automated compliance reporting and auto-remediation playbooks"
    ],
    "followUpTopics": [
      "CIS Benchmarks",
      "Cloud misconfigurations"
    ]
  },
  {
    "id": "csa-023",
    "role": "Cybersecurity Analyst",
    "category": "Network Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does ARP Spoofing allow an attacker on a local network to intercept unencrypted traffic?",
    "expectedSkills": [
      "Networking",
      "MitM"
    ],
    "evaluationPoints": [
      "ARP maps Layer 3 IP addresses to Layer 2 physical MAC addresses without authentication",
      "Attacker sends gratuitous ARP replies associating the gateway's IP address with the attacker's MAC address",
      "Victim sends all outbound internet traffic to attacker instead of legit router",
      "Defense: Dynamic ARP Inspection (DAI) on managed network switches, static ARP tables, end-to-end TLS"
    ],
    "followUpTopics": [
      "Dynamic ARP Inspection (DAI)",
      "Ettercap / Bettercap"
    ]
  },
  {
    "id": "csa-024",
    "role": "Cybersecurity Analyst",
    "category": "SOC Operations",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you tune SIEM correlation rules to reduce alert fatigue without missing true positive attacks?",
    "expectedSkills": [
      "SOC Operations",
      "SIEM"
    ],
    "evaluationPoints": [
      "Review high-volume noisy alerts and identify benign business patterns causing false alarms",
      "Add exclusion filters and whitelist authorized administrative IP ranges and service accounts",
      "Combine multiple low-fidelity signals into a single high-fidelity composite alert before waking an on-call analyst"
    ],
    "followUpTopics": [
      "Alert tuning",
      "Noise reduction"
    ]
  },
  {
    "id": "csa-025",
    "role": "Cybersecurity Analyst",
    "category": "Cryptography",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is a cryptographic salt essential when storing hashed passwords in a database?",
    "expectedSkills": [
      "Cryptography",
      "Security"
    ],
    "evaluationPoints": [
      "Salt is a unique cryptographically random string appended to password before hashing",
      "Guarantees that two users with identical passwords have completely different password hashes",
      "Completely defeats precomputed Rainbow Table attacks; requires attacker to compute dictionary attack per salt individually"
    ],
    "followUpTopics": [
      "Rainbow tables",
      "bcrypt / Argon2"
    ]
  },
  {
    "id": "csa-026",
    "role": "Cybersecurity Analyst",
    "category": "Offensive Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain common privilege escalation techniques on Linux and Windows systems.",
    "expectedSkills": [
      "Privilege Escalation"
    ],
    "evaluationPoints": [
      "Linux: misconfigured SUID binaries (find with chmod 4000), writable /etc/passwd or shadow, vulnerable kernel exploits, insecure sudoers configurations (sudo without password)",
      "Windows: unquoted service paths, insecure service permissions, always install elevated policies, token impersonation (SeImpersonatePrivilege with RottenPotato)"
    ],
    "followUpTopics": [
      "SUID binaries",
      "Token impersonation"
    ]
  },
  {
    "id": "csa-027",
    "role": "Cybersecurity Analyst",
    "category": "Infrastructure Security",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is a Bastion Host (Jump Box) and how does it secure administrative access to private servers?",
    "expectedSkills": [
      "Network Security"
    ],
    "evaluationPoints": [
      "Specialized, hardened server placed in a public subnet or DMZ as the sole entry point for administrative SSH/RDP access",
      "Backend database and application servers strictly block all direct public internet access, accepting connections ONLY from the bastion host IP",
      "Hardened: MFA required, session recording enabled, all non-essential ports and software removed"
    ],
    "followUpTopics": [
      "DMZ architecture",
      "Session recording"
    ]
  },
  {
    "id": "csa-028",
    "role": "Cybersecurity Analyst",
    "category": "Data Security",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Data Loss Prevention (DLP) tools detect and block unauthorized exfiltration of sensitive data?",
    "expectedSkills": [
      "DLP",
      "Data Protection"
    ],
    "evaluationPoints": [
      "Inspects data in motion (network traffic, email), data at rest (servers, cloud storage), and data in use (USB drives, clipboard)",
      "Uses pattern matching (regex for credit cards, SSN), keyword dictionaries, and exact data matching (EDM) file fingerprints",
      "Automatically blocks upload, encrypts file, or alerts security team upon policy violation"
    ],
    "followUpTopics": [
      "Exact Data Matching",
      "Endpoint DLP"
    ]
  },
  {
    "id": "csa-029",
    "role": "Cybersecurity Analyst",
    "category": "Threat Intelligence",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Indicators of Compromise (IoCs) and Indicators of Attack (IoAs).",
    "expectedSkills": [
      "Threat Intelligence"
    ],
    "evaluationPoints": [
      "IoC is static forensic artifact left behind AFTER a breach has occurred (file MD5 hash, malicious IP address, C2 domain name, registry key)",
      "IoA focuses on behavioral intent and tactics DURING the attack in real time (process injection into lsass.exe, suspicious PowerShell downloading script, lateral movement)",
      "IoCs change easily; IoAs catch novel attacks based on behavior"
    ],
    "followUpTopics": [
      "Pyramid of Pain",
      "C2 infrastructure"
    ]
  },
  {
    "id": "csa-030",
    "role": "Cybersecurity Analyst",
    "category": "Digital Forensics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you preserve evidence and maintain Chain of Custody during a digital forensics investigation?",
    "expectedSkills": [
      "Digital Forensics"
    ],
    "evaluationPoints": [
      "Document chronological history of who collected, handled, transferred, and analyzed evidence",
      "Create bit-stream physical image copies (dd, FTK Imager) of hard drives before analyzing; NEVER analyze live original drive directly",
      "Calculate cryptographic hashes (SHA-256) of evidence before and after imaging to prove data was not altered"
    ],
    "followUpTopics": [
      "FTK Imager",
      "Volatile memory capture (Volatility)"
    ]
  },
  {
    "id": "csa-031",
    "role": "Cybersecurity Analyst",
    "category": "Network Security",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do threat actors use DNS Tunneling for data exfiltration and Command and Control (C2)?",
    "expectedSkills": [
      "DNS Security",
      "C2"
    ],
    "evaluationPoints": [
      "Adversary encodes binary data into subdomains of a malicious domain they control (e.g. a8f9b1c.attacker.com)",
      "Local recursive DNS server resolves query up to attacker's authoritative nameserver, transmitting data through firewall",
      "Defenses: inspect DNS query length, high entropy of subdomains, abnormal query volume, and response TXT record payloads"
    ],
    "followUpTopics": [
      "DNS sinkholing",
      "Domain entropy"
    ]
  },
  {
    "id": "csa-032",
    "role": "Cybersecurity Analyst",
    "category": "Security Culture",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you design an effective enterprise anti-phishing training campaign without shaming employees?",
    "expectedSkills": [
      "Security Culture",
      "Phishing"
    ],
    "evaluationPoints": [
      "Run simulated phishing campaigns mimicking realistic current threat scenarios",
      "Provide immediate, positive, educational feedback at moment of click without public shaming or punishment",
      "Recognize and reward employees who report suspicious phishing emails using one-click reporting plugins"
    ],
    "followUpTopics": [
      "Phishing simulations",
      "Security culture"
    ]
  },
  {
    "id": "csa-033",
    "role": "Cybersecurity Analyst",
    "category": "Incident Response",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "You receive an EDR alert that PowerShell executed a Base64-encoded command connecting to an unknown foreign IP. What do you do?",
    "expectedSkills": [
      "Incident Response",
      "Investigation"
    ],
    "evaluationPoints": [
      "Isolate the endpoint from network via EDR console immediately to prevent lateral movement",
      "Decode Base64 payload to determine intent (malware download, credential dumping, persistence installation)",
      "Identify parent process tree, check logged-on user account, and search SIEM for other endpoints connecting to the same C2 IP"
    ],
    "followUpTopics": [
      "Base64 decoding",
      "Lateral movement triage"
    ]
  },
  {
    "id": "csa-034",
    "role": "Cybersecurity Analyst",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe a real security vulnerability or incident you investigated. What was your containment and remediation approach?",
    "expectedSkills": [
      "Incident Response",
      "Communication"
    ],
    "evaluationPoints": [
      "Incident context, initial alert trigger, and scope identification",
      "Containment actions taken (network isolation, account disable, credential rotation)",
      "Root cause discovery, remediation patching, and preventative controls implemented to eliminate recurring risk"
    ],
    "followUpTopics": [
      "Containment metrics",
      "Lessons learned"
    ]
  },
  {
    "id": "csa-035",
    "role": "Cybersecurity Analyst",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How are AI-driven cyber attacks evolving, and what is Post-Quantum Cryptography (PQC)?",
    "expectedSkills": [
      "Modern Security",
      "PQC"
    ],
    "evaluationPoints": [
      "AI enables hyper-realistic personalized spear phishing at scale, automated vulnerability discovery, and polymorphic malware that evades EDR signatures",
      "Quantum computers threaten to break RSA and ECC asymmetric encryption via Shor's algorithm",
      "NIST has standardized Post-Quantum Cryptographic algorithms (CRYSTALS-Kyber, Dilithium) based on lattice mathematics"
    ],
    "followUpTopics": [
      "Post-Quantum Cryptography",
      "Adversarial AI"
    ]
  }
];
