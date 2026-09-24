import { RoleQuestion } from '../types';

export const ML_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "ml-001",
    "role": "Machine Learning Engineer",
    "category": "MLOps",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the end-to-end MLOps lifecycle from data ingestion to continuous model retraining.",
    "expectedSkills": [
      "MLOps"
    ],
    "evaluationPoints": [
      "Data collection, validation, feature store",
      "Model training, hyperparameter tuning, experiment tracking",
      "CI/CD model registry, deployment, and drift monitoring"
    ],
    "followUpTopics": [
      "MLflow",
      "Kubeflow"
    ]
  },
  {
    "id": "ml-002",
    "role": "Machine Learning Engineer",
    "category": "Architecture",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a Feature Store (e.g. Feast) and why is it crucial for preventing training-serving skew?",
    "expectedSkills": [
      "Feature Store",
      "Architecture"
    ],
    "evaluationPoints": [
      "Central repository for curated ML features",
      "Guarantees exact same feature calculation online (low latency) and offline (batch training)",
      "Provides point-in-time joins to eliminate data leakage"
    ],
    "followUpTopics": [
      "Feast",
      "Training-serving skew"
    ]
  },
  {
    "id": "ml-003",
    "role": "Machine Learning Engineer",
    "category": "MLOps",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does MLflow Model Registry manage model stage transitions (Staging -> Production)?",
    "expectedSkills": [
      "MLflow",
      "Versioning"
    ],
    "evaluationPoints": [
      "Tracks model artifacts, metrics, and parameters per run",
      "Semantic versioning and stage transitions (Staging, Production, Archived)",
      "Enables automated governance and rollback"
    ],
    "followUpTopics": [
      "Weights & Biases",
      "Model lineage"
    ]
  },
  {
    "id": "ml-004",
    "role": "Machine Learning Engineer",
    "category": "Optimization",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain model quantization (INT8 vs FP16) and weight pruning for reducing inference latency.",
    "expectedSkills": [
      "Model Optimization"
    ],
    "evaluationPoints": [
      "Quantization reduces parameter bit precision with minimal accuracy loss",
      "Pruning zeros out non-critical weights to produce sparse networks",
      "Accelerates inference on edge and cloud GPUs/TPUs"
    ],
    "followUpTopics": [
      "ONNX Runtime",
      "TensorRT"
    ]
  },
  {
    "id": "ml-005",
    "role": "Machine Learning Engineer",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Canary vs Blue-Green deployment strategies for machine learning models.",
    "expectedSkills": [
      "Deployment",
      "DevOps"
    ],
    "evaluationPoints": [
      "Canary routes small % of live traffic to new model, monitoring error/drift before scaling",
      "Blue-Green maintains two identical environments, instantly switching traffic on validation",
      "Canary minimizes blast radius of poorly performing models"
    ],
    "followUpTopics": [
      "Shadow deployments",
      "A/B testing"
    ]
  },
  {
    "id": "ml-006",
    "role": "Machine Learning Engineer",
    "category": "Monitoring",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you automate data drift and concept drift detection in production pipelines?",
    "expectedSkills": [
      "Monitoring",
      "Evidently AI"
    ],
    "evaluationPoints": [
      "Calculate statistical distance (PSI, Wasserstein, KS-test) between training baseline and inference traffic",
      "Alert on significant distribution shifts before model performance degrades",
      "Trigger automated retraining DAG in Airflow"
    ],
    "followUpTopics": [
      "Evidently AI",
      "Great Expectations"
    ]
  },
  {
    "id": "ml-007",
    "role": "Machine Learning Engineer",
    "category": "Distributed ML",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain DataParallel vs DistributedDataParallel (DDP) in PyTorch for multi-GPU training.",
    "expectedSkills": [
      "PyTorch",
      "Distributed Training"
    ],
    "evaluationPoints": [
      "DataParallel uses single-process multi-threading with GIL overhead and GPU 0 bottleneck",
      "DDP launches separate process per GPU with ring-AllReduce gradient synchronization",
      "DDP scales efficiently across multiple nodes"
    ],
    "followUpTopics": [
      "Ring AllReduce",
      "Model parallelism"
    ]
  },
  {
    "id": "ml-008",
    "role": "Machine Learning Engineer",
    "category": "Serving",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Open Neural Network Exchange (ONNX) and why is it used in production inference?",
    "expectedSkills": [
      "ONNX",
      "Serving"
    ],
    "evaluationPoints": [
      "Open format representing machine learning models across frameworks (PyTorch, TensorFlow, Scikit-learn)",
      "ONNX Runtime optimizes graph execution and hardware acceleration (CUDA, TensorRT)",
      "Eliminates Python runtime dependency at inference"
    ],
    "followUpTopics": [
      "TorchScript",
      "Triton Server"
    ]
  },
  {
    "id": "ml-009",
    "role": "Machine Learning Engineer",
    "category": "CI/CD",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What does Continuous Training (CT) mean in advanced MLOps architectures?",
    "expectedSkills": [
      "CI/CD",
      "Automation"
    ],
    "evaluationPoints": [
      "Automated pipeline that continuously retrains models when new data arrives or drift is detected",
      "Validates candidate model against production champion model before promotion",
      "Fully automated artifact push to registry without manual intervention"
    ],
    "followUpTopics": [
      "GitHub Actions",
      "CML"
    ]
  },
  {
    "id": "ml-010",
    "role": "Machine Learning Engineer",
    "category": "Docker",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you package an ML model into a lightweight Docker image for production serving?",
    "expectedSkills": [
      "Docker",
      "Deployment"
    ],
    "evaluationPoints": [
      "Multi-stage build with minimal base image (python:3.11-slim)",
      "Pre-install dependencies and copy serialized model weights",
      "Serve using FastAPI or Triton with health check probes"
    ],
    "followUpTopics": [
      "gunicorn/uvicorn",
      "Docker security"
    ]
  },
  {
    "id": "ml-011",
    "role": "Machine Learning Engineer",
    "category": "Serving",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What features make NVIDIA Triton Inference Server superior to a standard FastAPI wrapper?",
    "expectedSkills": [
      "Triton",
      "Inference"
    ],
    "evaluationPoints": [
      "Dynamic batching grouping concurrent requests for high GPU utilization",
      "Concurrent model execution across multi-GPU instances",
      "Supports multiple frameworks (TensorRT, ONNX, PyTorch, OpenVINO)"
    ],
    "followUpTopics": [
      "Dynamic batching",
      "Model ensembles"
    ]
  },
  {
    "id": "ml-012",
    "role": "Machine Learning Engineer",
    "category": "Data Engineering",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "How do you ensure rolling window features (e.g. 30-day user spend) do not leak future information during training?",
    "expectedSkills": [
      "Data Leakage",
      "Feature Engineering"
    ],
    "evaluationPoints": [
      "Use point-in-time correctness: features computed strictly before timestamp of event",
      "Avoid computing aggregations across entire historical dataset at once",
      "Validate feature generation in unit tests with simulated time jumps"
    ],
    "followUpTopics": [
      "Point-in-time joins",
      "Feast"
    ]
  },
  {
    "id": "ml-013",
    "role": "Machine Learning Engineer",
    "category": "Deep Learning",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Your PyTorch neural network crashes with CUDA out of memory during training. How do you resolve it?",
    "expectedSkills": [
      "PyTorch",
      "Troubleshooting"
    ],
    "evaluationPoints": [
      "Reduce batch size and implement gradient accumulation to simulate effective batch size",
      "Use Mixed Precision training (torch.cuda.amp.autocast)",
      "Enable gradient checkpointing to recompute activations during backward pass"
    ],
    "followUpTopics": [
      "Gradient accumulation",
      "torch.cuda.empty_cache()"
    ]
  },
  {
    "id": "ml-014",
    "role": "Machine Learning Engineer",
    "category": "Orchestration",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design an Apache Airflow DAG for an automated daily model training pipeline?",
    "expectedSkills": [
      "Airflow",
      "Orchestration"
    ],
    "evaluationPoints": [
      "Tasks: data extraction, validation, feature engineering, model training, evaluation, registration",
      "Use Airflow operators or KubernetesPodOperator for isolated execution",
      "Set retries, SLA alerts, and conditional branching based on validation results"
    ],
    "followUpTopics": [
      "KubernetesPodOperator",
      "Prefect vs Airflow"
    ]
  },
  {
    "id": "ml-015",
    "role": "Machine Learning Engineer",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a Shadow Deployment and what are its advantages for high-risk ML models?",
    "expectedSkills": [
      "Deployment"
    ],
    "evaluationPoints": [
      "New model receives copy of live production traffic in parallel without serving results to users",
      "Compare latency, throughput, and predictions against live champion model risk-free",
      "Ensures stability before cutting over user-facing traffic"
    ],
    "followUpTopics": [
      "Dark launching",
      "Canary comparison"
    ]
  },
  {
    "id": "ml-016",
    "role": "Machine Learning Engineer",
    "category": "Explainability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you generate model explanations (SHAP) efficiently for millions of predictions?",
    "expectedSkills": [
      "XAI",
      "Performance"
    ],
    "evaluationPoints": [
      "Use TreeSHAP (polynomial time for tree models) instead of KernelSHAP (exponential)",
      "Precompute background sample distributions",
      "Calculate global feature importances offline and log local SHAP only on flagged edge cases"
    ],
    "followUpTopics": [
      "TreeSHAP",
      "Model cards"
    ]
  },
  {
    "id": "ml-017",
    "role": "Machine Learning Engineer",
    "category": "Streaming",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do you build a real-time streaming feature pipeline using Kafka and Flink for ML models?",
    "expectedSkills": [
      "Kafka",
      "Streaming"
    ],
    "evaluationPoints": [
      "Ingest event streams into Kafka topics",
      "Apache Flink performs stateful tumbling/sliding window aggregations",
      "Sink aggregated features into low-latency cache (Redis/Feast) for online inference"
    ],
    "followUpTopics": [
      "Apache Flink",
      "Event-time processing"
    ]
  },
  {
    "id": "ml-018",
    "role": "Machine Learning Engineer",
    "category": "Cloud",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you optimize cloud compute costs when training large ML models on AWS/GCP?",
    "expectedSkills": [
      "Cloud",
      "Cost Optimization"
    ],
    "evaluationPoints": [
      "Use Spot/Preemptible instances with checkpointing (saving model state every epoch)",
      "Right-size GPU instances according to VRAM requirements",
      "Auto-scale cluster to zero when training jobs complete"
    ],
    "followUpTopics": [
      "Spot instances",
      "DeepSpeed"
    ]
  },
  {
    "id": "ml-019",
    "role": "Machine Learning Engineer",
    "category": "Versioning",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What problem does DVC solve in machine learning projects and how does it integrate with Git?",
    "expectedSkills": [
      "DVC",
      "Versioning"
    ],
    "evaluationPoints": [
      "Git tracks code, DVC tracks large datasets and model weights using pointers (.dvc files)",
      "Stores actual data artifacts in cloud storage (S3, GCS)",
      "Ensures full reproducibility of data + code + model checkpoints"
    ],
    "followUpTopics": [
      "Git LFS",
      "DVC pipelines"
    ]
  },
  {
    "id": "ml-020",
    "role": "Machine Learning Engineer",
    "category": "ML Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you choose between MSE, MAE, Huber Loss, and Cross-Entropy for different ML tasks?",
    "expectedSkills": [
      "ML Fundamentals"
    ],
    "evaluationPoints": [
      "MSE penalizes large outliers heavily (squared error)",
      "MAE is robust to outliers (linear error)",
      "Huber loss combines best of MSE for small errors and MAE for large errors",
      "Cross-entropy for probability distributions in classification"
    ],
    "followUpTopics": [
      "Focal loss",
      "Quantile loss"
    ]
  },
  {
    "id": "ml-021",
    "role": "Machine Learning Engineer",
    "category": "Kubernetes",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you configure KNative or Seldon Core for autoscaling ML model deployments on Kubernetes?",
    "expectedSkills": [
      "Kubernetes",
      "Serving"
    ],
    "evaluationPoints": [
      "Autoscale based on request concurrency or custom GPU metrics (HPA)",
      "Scale-to-zero when idle to save infrastructure costs",
      "Manage traffic splitting for canary rollouts"
    ],
    "followUpTopics": [
      "KServe",
      "HPA custom metrics"
    ]
  },
  {
    "id": "ml-022",
    "role": "Machine Learning Engineer",
    "category": "CI/CD",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What automated quality gates must a trained model pass before being promoted to the Model Registry?",
    "expectedSkills": [
      "CI/CD",
      "Governance"
    ],
    "evaluationPoints": [
      "Offline metric threshold (e.g. F1 > 0.85 and must outperform current production model)",
      "Inference latency benchmark (<50ms under load)",
      "Bias and fairness checks across demographic groups",
      "Vulnerability scanning of container dependencies"
    ],
    "followUpTopics": [
      "Model cards",
      "Automated benchmarking"
    ]
  },
  {
    "id": "ml-023",
    "role": "Machine Learning Engineer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Automatic Mixed Precision (AMP) accelerate training and reduce VRAM usage in PyTorch?",
    "expectedSkills": [
      "PyTorch",
      "Hardware"
    ],
    "evaluationPoints": [
      "Uses FP16 for computationally heavy matrix operations and FP32 for sensitive accumulations",
      "GradScaler prevents underflow of small gradients",
      "Doubles throughput on modern Tensor Core GPUs"
    ],
    "followUpTopics": [
      "torch.cuda.amp",
      "Bfloat16"
    ]
  },
  {
    "id": "ml-024",
    "role": "Machine Learning Engineer",
    "category": "Data Engineering",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you integrate Great Expectations into an ML pipeline to catch data anomalies?",
    "expectedSkills": [
      "Data Quality"
    ],
    "evaluationPoints": [
      "Define expectation suites (expect_column_values_to_not_be_null, expect_values_to_be_between)",
      "Validate raw data before feature engineering",
      "Fail pipeline early if validation suite fails, preventing corrupted model retraining"
    ],
    "followUpTopics": [
      "Data profiling",
      "CI validation"
    ]
  },
  {
    "id": "ml-025",
    "role": "Machine Learning Engineer",
    "category": "Serving",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you mitigate cold start latency when deploying ML models in serverless containers?",
    "expectedSkills": [
      "Serverless",
      "Performance"
    ],
    "evaluationPoints": [
      "Pre-warm model weights into memory during container initialization",
      "Keep minimum number of warm container instances",
      "Use lightweight runtimes like ONNX rather than full PyTorch"
    ],
    "followUpTopics": [
      "AWS Lambda snapstart",
      "Container warmers"
    ]
  },
  {
    "id": "ml-026",
    "role": "Machine Learning Engineer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Ray Tune distribute hyperparameter search across multiple worker nodes?",
    "expectedSkills": [
      "Ray",
      "Distributed Computing"
    ],
    "evaluationPoints": [
      "Schedules trials asynchronously across cluster workers",
      "Implements early stopping algorithms (ASHA) to kill unpromising trials",
      "Integrates with Optuna, Hyperopt, and PyTorch"
    ],
    "followUpTopics": [
      "ASHA scheduler",
      "Ray cluster"
    ]
  },
  {
    "id": "ml-027",
    "role": "Machine Learning Engineer",
    "category": "Architecture",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you choose storage for ML: Data Lake (S3), Data Warehouse (Snowflake), and Vector DB (Pinecone)?",
    "expectedSkills": [
      "Architecture"
    ],
    "evaluationPoints": [
      "Data Lake for raw unstructured files, images, and big data dumps",
      "Data Warehouse for structured analytics and batch feature queries",
      "Vector DB for high-dimensional embedding similarity search (RAG)"
    ],
    "followUpTopics": [
      "Delta Lake",
      "Iceberg"
    ]
  },
  {
    "id": "ml-028",
    "role": "Machine Learning Engineer",
    "category": "Explainability",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why can Gini feature importance in Random Forests be misleading, and why is Permutation Importance better?",
    "expectedSkills": [
      "Explainability"
    ],
    "evaluationPoints": [
      "Gini importance is biased toward high-cardinality numerical features",
      "Permutation importance measures drop in validation metric when feature is randomly shuffled",
      "Reflects true generalization impact on unseen data"
    ],
    "followUpTopics": [
      "SHAP",
      "Feature selection"
    ]
  },
  {
    "id": "ml-029",
    "role": "Machine Learning Engineer",
    "category": "Experimentation",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you design an online A/B test between an existing model and a newly trained model?",
    "expectedSkills": [
      "Experimentation"
    ],
    "evaluationPoints": [
      "Hash user ID to consistently route traffic 50/50 between Model A and Model B",
      "Measure primary business metric (conversion rate, click-through rate) over statistical duration",
      "Monitor system health metrics (latency, error rate) concurrently"
    ],
    "followUpTopics": [
      "Washout period",
      "Sample ratio mismatch"
    ]
  },
  {
    "id": "ml-030",
    "role": "Machine Learning Engineer",
    "category": "Feature Engineering",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you build a batch and real-time embedding generation pipeline using sentence-transformers?",
    "expectedSkills": [
      "Embeddings",
      "Architecture"
    ],
    "evaluationPoints": [
      "Tokenize text and generate dense vector embeddings",
      "Store embeddings in Vector DB with metadata filtering",
      "Batch generate for existing catalog; real-time generate on user queries"
    ],
    "followUpTopics": [
      "Cosine similarity",
      "HNSW indexing"
    ]
  },
  {
    "id": "ml-031",
    "role": "Machine Learning Engineer",
    "category": "Reliability",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Your primary recommendation model crashes under peak holiday traffic. What fallback architecture triggers?",
    "expectedSkills": [
      "Resilience",
      "System Design"
    ],
    "evaluationPoints": [
      "Circuit breaker catches timeout and falls back to cached pre-computed popular items",
      "Graceful degradation without throwing 500 error to user",
      "Automatic scaling and alert notification to on-call engineer"
    ],
    "followUpTopics": [
      "Fallback strategies",
      "Resilience4j"
    ]
  },
  {
    "id": "ml-032",
    "role": "Machine Learning Engineer",
    "category": "Optimization",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Compare Knowledge Distillation vs Weight Pruning for model compression.",
    "expectedSkills": [
      "Model Compression"
    ],
    "evaluationPoints": [
      "Distillation trains small student model to mimic logits of large teacher model",
      "Pruning removes redundant weights/neurons from existing model architecture",
      "Distillation often achieves better performance retention at high compression ratios"
    ],
    "followUpTopics": [
      "Teacher-student networks",
      "Sparse models"
    ]
  },
  {
    "id": "ml-033",
    "role": "Machine Learning Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an ML pipeline you engineered. How did you automate deployment and ensure zero downtime?",
    "expectedSkills": [
      "Project Experience",
      "Communication"
    ],
    "evaluationPoints": [
      "Architecture explanation from data to serving",
      "CI/CD and validation gates used",
      "Monitoring, rollback strategy, and business impact"
    ],
    "followUpTopics": [
      "Lessons learned",
      "Scalability bottlenecks"
    ]
  },
  {
    "id": "ml-034",
    "role": "Machine Learning Engineer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you resolve disagreements between Data Scientists wanting complex models and Software Engineers wanting low latency?",
    "expectedSkills": [
      "Collaboration",
      "Stakeholder Management"
    ],
    "evaluationPoints": [
      "Establish clear SLA boundaries (latency budget, memory limit)",
      "Quantify business revenue lift vs cloud infrastructure cost",
      "Explore optimization (quantization, distillation) as common ground"
    ],
    "followUpTopics": [
      "SLA agreements",
      "Latency budgets"
    ]
  },
  {
    "id": "ml-035",
    "role": "Machine Learning Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How has LLMOps changed the traditional MLOps landscape?",
    "expectedSkills": [
      "LLMOps",
      "Modern AI"
    ],
    "evaluationPoints": [
      "Shift from training models from scratch to fine-tuning and prompt engineering",
      "Evaluation shifts from simple F1 to LLM-as-a-judge, hallucination detection, and RAG evaluation",
      "Vector DBs and prompt registries become core infrastructure"
    ],
    "followUpTopics": [
      "RAG pipelines",
      "LangSmith"
    ]
  }
];
