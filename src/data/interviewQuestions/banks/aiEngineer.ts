import { RoleQuestion } from '../types';

export const AI_ENGINEER_QUESTIONS: RoleQuestion[] = [
  {
    "id": "ai-001",
    "role": "AI Engineer",
    "category": "RAG",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the core components of a Retrieval-Augmented Generation (RAG) pipeline.",
    "expectedSkills": [
      "RAG",
      "LLMs"
    ],
    "evaluationPoints": [
      "Document chunking and text extraction",
      "Generating embeddings and indexing in Vector DB",
      "Retrieval of top-k chunks based on semantic similarity",
      "Prompt synthesis with retrieved context passed to LLM"
    ],
    "followUpTopics": [
      "Vector DBs",
      "Chunking strategies"
    ]
  },
  {
    "id": "ai-002",
    "role": "AI Engineer",
    "category": "RAG",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do chunk size and chunk overlap affect retrieval accuracy in RAG systems?",
    "expectedSkills": [
      "RAG",
      "Embeddings"
    ],
    "evaluationPoints": [
      "Small chunks preserve specific facts but lose broader document context",
      "Large chunks provide full context but dilute semantic embedding similarity",
      "Chunk overlap (10-20%) prevents splitting sentences or ideas across boundaries"
    ],
    "followUpTopics": [
      "RecursiveCharacterTextSplitter",
      "Semantic chunking"
    ]
  },
  {
    "id": "ai-003",
    "role": "AI Engineer",
    "category": "Vector DB",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do Vector Databases perform fast approximate nearest neighbor search using HNSW?",
    "expectedSkills": [
      "Vector DB",
      "Algorithms"
    ],
    "evaluationPoints": [
      "Hierarchical Navigable Small World graphs multi-layer skip-list structure",
      "O(log N) approximate nearest neighbor search",
      "Balances query latency vs recall compared to exact flat search"
    ],
    "followUpTopics": [
      "Cosine similarity vs Euclidean",
      "Pinecone vs Milvus"
    ]
  },
  {
    "id": "ai-004",
    "role": "AI Engineer",
    "category": "Prompting",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Few-Shot prompting, Chain-of-Thought (CoT), and ReAct prompting.",
    "expectedSkills": [
      "Prompt Engineering"
    ],
    "evaluationPoints": [
      "Few-shot provides explicit input-output demonstration examples in prompt",
      "Chain-of-Thought instructs model to 'think step by step' before answering",
      "ReAct alternates between Reasoning and Action (tool usage)"
    ],
    "followUpTopics": [
      "Prompt injection",
      "System prompt design"
    ]
  },
  {
    "id": "ai-005",
    "role": "AI Engineer",
    "category": "Fine-Tuning",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does Low-Rank Adaptation (LoRA) enable parameter-efficient fine-tuning of LLMs?",
    "expectedSkills": [
      "Fine-Tuning",
      "Deep Learning"
    ],
    "evaluationPoints": [
      "Freezes base model weights and injects trainable low-rank rank decomposition matrices (A and B)",
      "Reduces trainable parameters by 99% while retaining performance",
      "QLoRA quantizes base model to 4-bit, enabling 70B model fine-tuning on single GPU"
    ],
    "followUpTopics": [
      "PEFT library",
      "Catastrophic forgetting"
    ]
  },
  {
    "id": "ai-006",
    "role": "AI Engineer",
    "category": "AI Safety",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What techniques do you use to detect and mitigate LLM hallucinations in production?",
    "expectedSkills": [
      "AI Safety",
      "RAG"
    ],
    "evaluationPoints": [
      "Grounding responses strictly on retrieved context with citation prompts",
      "Lowering temperature (0.0 to 0.2) for deterministic responses",
      "Automated validation using guardrails (Guardrails AI, NeMo Guardrails) or self-critique prompts"
    ],
    "followUpTopics": [
      "Hallucination metrics",
      "Faithfulness evaluation"
    ]
  },
  {
    "id": "ai-007",
    "role": "AI Engineer",
    "category": "Evaluation",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you evaluate RAG systems using frameworks like Ragas or TruLens?",
    "expectedSkills": [
      "Evaluation",
      "RAG"
    ],
    "evaluationPoints": [
      "Faithfulness: is answer grounded strictly in retrieved context?",
      "Answer Relevance: does response answer user query?",
      "Context Recall & Precision: did retriever fetch correct information?"
    ],
    "followUpTopics": [
      "LLM-as-a-judge",
      "Golden test sets"
    ]
  },
  {
    "id": "ai-008",
    "role": "AI Engineer",
    "category": "AI Agents",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What are AI Agents and how do frameworks like LangChain or LangGraph orchestrate them?",
    "expectedSkills": [
      "AI Agents",
      "LangChain"
    ],
    "evaluationPoints": [
      "Agent loop: Thought -> Action -> Observation -> Final Answer",
      "Equipped with external tools (web search, calculator, SQL query)",
      "LangGraph uses stateful directed graphs to handle complex multi-agent workflows"
    ],
    "followUpTopics": [
      "Tool calling",
      "Human-in-the-loop"
    ]
  },
  {
    "id": "ai-009",
    "role": "AI Engineer",
    "category": "LLMs",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you ensure an LLM returns guaranteed valid JSON matching a Pydantic schema?",
    "expectedSkills": [
      "Function Calling",
      "Pydantic"
    ],
    "evaluationPoints": [
      "OpenAI function calling / tool_choice: {'type': 'function'}",
      "JSON Mode or Instructor library enforcing Pydantic models",
      "Grammar-based sampling (outlines) restricting next token generation"
    ],
    "followUpTopics": [
      "Instructor library",
      "Token logits masking"
    ]
  },
  {
    "id": "ai-010",
    "role": "AI Engineer",
    "category": "Embeddings",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Cosine Similarity, Dot Product, and Euclidean Distance for vector search.",
    "expectedSkills": [
      "Mathematics",
      "Embeddings"
    ],
    "evaluationPoints": [
      "Cosine similarity measures angle between vectors, independent of magnitude (-1 to 1)",
      "Dot product measures angle and magnitude (identical to cosine if normalized)",
      "Euclidean distance measures geometric distance in space"
    ],
    "followUpTopics": [
      "Normalized embeddings",
      "Dimension size"
    ]
  },
  {
    "id": "ai-011",
    "role": "AI Engineer",
    "category": "LLMs",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain BPE (Byte Pair Encoding) tokenization and how context window size impacts cost and latency.",
    "expectedSkills": [
      "LLMs",
      "Tokenization"
    ],
    "evaluationPoints": [
      "BPE splits words into frequent subword tokens",
      "1,000 tokens is approximately 750 English words",
      "Context length increases memory quadratic in naive attention and costs scale per token"
    ],
    "followUpTopics": [
      "tiktoken",
      "FlashAttention"
    ]
  },
  {
    "id": "ai-012",
    "role": "AI Engineer",
    "category": "Optimization",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain KV (Key-Value) Caching and FlashAttention in LLM inference.",
    "expectedSkills": [
      "Optimization",
      "Transformers"
    ],
    "evaluationPoints": [
      "KV cache stores precomputed key/value vectors of previous tokens to avoid recomputation",
      "FlashAttention reorganizes attention computation to maximize GPU SRAM access and avoid memory bottlenecks"
    ],
    "followUpTopics": [
      "vLLM engine",
      "PagedAttention"
    ]
  },
  {
    "id": "ai-013",
    "role": "AI Engineer",
    "category": "Serving",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is PagedAttention in vLLM and how does it achieve 10x throughput over HuggingFace?",
    "expectedSkills": [
      "vLLM",
      "Serving"
    ],
    "evaluationPoints": [
      "Applies OS virtual memory paging concept to allocate non-contiguous GPU memory for KV cache",
      "Eliminates memory fragmentation, allowing higher continuous batch sizes",
      "Continuous batching schedules requests dynamically without padding"
    ],
    "followUpTopics": [
      "Continuous batching",
      "TensorRT-LLM"
    ]
  },
  {
    "id": "ai-014",
    "role": "AI Engineer",
    "category": "RAG",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Why should you use a Cross-Encoder Reranker (e.g. Cohere Rerank) after vector search in RAG?",
    "expectedSkills": [
      "RAG",
      "Information Retrieval"
    ],
    "evaluationPoints": [
      "Bi-encoders (embedding search) are fast but compute independent vector representations",
      "Cross-encoders evaluate query and document together with full attention, providing superior relevance ranking",
      "Retrieve top 50 with vector search, rerank down to top 5"
    ],
    "followUpTopics": [
      "Cross-Encoder",
      "Hybrid search"
    ]
  },
  {
    "id": "ai-015",
    "role": "AI Engineer",
    "category": "RAG",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Hybrid Search and why does combining BM25 keyword search with Vector search improve retrieval?",
    "expectedSkills": [
      "Search",
      "Information Retrieval"
    ],
    "evaluationPoints": [
      "Vector search captures semantic meaning but struggles with exact keyword matches (product codes, names)",
      "BM25 handles exact lexical matches effectively",
      "Reciprocal Rank Fusion (RRF) merges results into single ranked list"
    ],
    "followUpTopics": [
      "RRF algorithm",
      "Sparse-dense vectors"
    ]
  },
  {
    "id": "ai-016",
    "role": "AI Engineer",
    "category": "AI Safety",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is prompt injection (direct and indirect) and how do you protect your AI system?",
    "expectedSkills": [
      "Security",
      "AI Safety"
    ],
    "evaluationPoints": [
      "Direct injection: user commands system to ignore previous instructions",
      "Indirect injection: untrusted external content (emails, web pages) contains hidden malicious commands",
      "Defenses: input sanitization, dual-LLM architectures, system prompt delimiters, and Guardrails"
    ],
    "followUpTopics": [
      "NeMo Guardrails",
      "Data vs instruction separation"
    ]
  },
  {
    "id": "ai-017",
    "role": "AI Engineer",
    "category": "Architecture",
    "difficulty": "Easy",
    "format": "technical",
    "question": "When should you use RAG vs Fine-Tuning for an enterprise generative AI solution?",
    "expectedSkills": [
      "System Design"
    ],
    "evaluationPoints": [
      "RAG for accessing dynamic proprietary knowledge, real-time updates, and verifiable citations",
      "Fine-tuning for teaching specialized style, tone, domain vocabulary, or following strict syntax",
      "Often combined: fine-tune for behavior, RAG for factual knowledge"
    ],
    "followUpTopics": [
      "Cost trade-offs",
      "Data freshness"
    ]
  },
  {
    "id": "ai-018",
    "role": "AI Engineer",
    "category": "Optimization",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Compare model quantization formats: GGUF (llama.cpp) vs AWQ vs GPTQ.",
    "expectedSkills": [
      "Quantization"
    ],
    "evaluationPoints": [
      "GGUF is CPU/GPU friendly format optimized for llama.cpp and local execution",
      "GPTQ performs post-training 4-bit weight quantization optimized for GPUs",
      "AWQ protects salient weights, offering superior quality retention at 4-bit"
    ],
    "followUpTopics": [
      "llama.cpp",
      "ExLlamaV2"
    ]
  },
  {
    "id": "ai-019",
    "role": "AI Engineer",
    "category": "API Design",
    "difficulty": "Easy",
    "format": "practical",
    "question": "How do you implement streaming LLM responses using Server-Sent Events (SSE) in FastAPI?",
    "expectedSkills": [
      "FastAPI",
      "Streaming"
    ],
    "evaluationPoints": [
      "StreamingResponse with async generator yielding token chunks",
      "Content-Type: text/event-stream",
      "Significantly reduces perceived Time-To-First-Token (TTFT) for users"
    ],
    "followUpTopics": [
      "SSE vs WebSockets",
      "Async generators"
    ]
  },
  {
    "id": "ai-020",
    "role": "AI Engineer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does Semantic Caching (e.g. GPTCache) reduce LLM API costs and latency?",
    "expectedSkills": [
      "Caching",
      "Vector Search"
    ],
    "evaluationPoints": [
      "Embeds user query and searches cache for semantically similar previous queries",
      "If cosine similarity > threshold (e.g. 0.95), returns cached response immediately",
      "Dramatically cuts expensive API calls for frequent questions"
    ],
    "followUpTopics": [
      "GPTCache",
      "Cache invalidation"
    ]
  },
  {
    "id": "ai-021",
    "role": "AI Engineer",
    "category": "Modern AI",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is GraphRAG and how does combining Knowledge Graphs with vector search solve complex queries?",
    "expectedSkills": [
      "GraphRAG",
      "Knowledge Graphs"
    ],
    "evaluationPoints": [
      "Extracts entities and relationships from text into a structured Knowledge Graph",
      "Allows multi-hop reasoning across connected entities that vector similarity misses",
      "Combines global community summaries with local entity retrieval"
    ],
    "followUpTopics": [
      "Neo4j",
      "Multi-hop reasoning"
    ]
  },
  {
    "id": "ai-022",
    "role": "AI Engineer",
    "category": "Computer Vision",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the working principle of YOLO (You Only Look Once) object detection models.",
    "expectedSkills": [
      "Computer Vision",
      "YOLO"
    ],
    "evaluationPoints": [
      "Single-stage detector processing full image in one forward pass",
      "Divides image into grid, predicting bounding boxes and class probabilities simultaneously",
      "Extremely fast real-time inference compared to two-stage detectors (Faster R-CNN)"
    ],
    "followUpTopics": [
      "IoU & Non-Max Suppression",
      "Anchor boxes"
    ]
  },
  {
    "id": "ai-023",
    "role": "AI Engineer",
    "category": "Computer Vision",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do Vision Transformers adapt self-attention to image classification instead of CNNs?",
    "expectedSkills": [
      "ViT",
      "Transformers"
    ],
    "evaluationPoints": [
      "Splits image into non-overlapping patches (e.g. 16x16 pixels) and treats patches like tokens in NLP",
      "Adds positional embeddings and passes through standard Transformer encoder",
      "Outperforms CNNs on large-scale datasets due to lower inductive bias"
    ],
    "followUpTopics": [
      "Patch embeddings",
      "CNN vs ViT"
    ]
  },
  {
    "id": "ai-024",
    "role": "AI Engineer",
    "category": "Multi-Modal",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do multi-modal models like CLIP or GPT-4V align vision and text representations?",
    "expectedSkills": [
      "Multi-Modal",
      "CLIP"
    ],
    "evaluationPoints": [
      "CLIP trains image encoder and text encoder using contrastive loss on image-text pairs",
      "Pulls matching image-text embeddings close in shared latent space, pushes non-matches apart",
      "Enables zero-shot image classification and cross-modal search"
    ],
    "followUpTopics": [
      "Contrastive learning",
      "Visual question answering"
    ]
  },
  {
    "id": "ai-025",
    "role": "AI Engineer",
    "category": "Audio AI",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does OpenAI's Whisper model perform robust automatic speech recognition (ASR)?",
    "expectedSkills": [
      "Audio AI",
      "Whisper"
    ],
    "evaluationPoints": [
      "Encoder-decoder Transformer trained on 680,000 hours of multilingual audio",
      "Converts audio to mel-spectrogram features",
      "Handles transcription, translation, and timestamp prediction in single model"
    ],
    "followUpTopics": [
      "Voice activity detection",
      "Audio streaming"
    ]
  },
  {
    "id": "ai-026",
    "role": "AI Engineer",
    "category": "Frameworks",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare LangChain and LlamaIndex for building LLM applications.",
    "expectedSkills": [
      "Frameworks"
    ],
    "evaluationPoints": [
      "LlamaIndex specializes in data ingestion, indexing, and advanced retrieval for RAG",
      "LangChain is broader general-purpose framework for chaining agents, tools, and prompts",
      "Often used together: LlamaIndex for retrieval engine, LangChain for agent orchestration"
    ],
    "followUpTopics": [
      "LangGraph",
      "Data connectors"
    ]
  },
  {
    "id": "ai-027",
    "role": "AI Engineer",
    "category": "AI Safety",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you enforce deterministic safety guardrails on LLM outputs using Guardrails AI or NeMo?",
    "expectedSkills": [
      "AI Safety",
      "Validation"
    ],
    "evaluationPoints": [
      "Intercepts output before returning to user, validating against defined rails",
      "Checks for PII leaks, competitor mentions, toxic content, and format compliance",
      "Can trigger automatic re-asking or fallback response on failure"
    ],
    "followUpTopics": [
      "NeMo Guardrails",
      "PII redaction"
    ]
  },
  {
    "id": "ai-028",
    "role": "AI Engineer",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "A user conversation exceeds the LLM context window limit. How do you maintain conversational memory?",
    "expectedSkills": [
      "Memory",
      "LLMs"
    ],
    "evaluationPoints": [
      "Sliding window keeping only the last N turns",
      "Summary memory: periodically ask LLM to summarize older conversation turns and inject summary into prompt",
      "Vector memory: store past turns in vector DB and retrieve relevant past context"
    ],
    "followUpTopics": [
      "ConversationSummaryBufferMemory",
      "Hierarchical memory"
    ]
  },
  {
    "id": "ai-029",
    "role": "AI Engineer",
    "category": "Production Engineering",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Your enterprise LLM bill is $15,000/month with 2.5s p95 latency. What architectural changes do you make?",
    "expectedSkills": [
      "Cost Optimization",
      "Performance"
    ],
    "evaluationPoints": [
      "Implement semantic caching for common queries",
      "Route simple queries to smaller, cheaper models (GPT-4o-mini / Claude Haiku) and reserve large models for complex reasoning",
      "Shorten prompts, compress context, and optimize RAG retrieval chunk counts"
    ],
    "followUpTopics": [
      "Model routing",
      "TTFT optimization"
    ]
  },
  {
    "id": "ai-030",
    "role": "AI Engineer",
    "category": "Data Engineering",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you generate and validate synthetic training data using LLMs for domain-specific tasks?",
    "expectedSkills": [
      "Synthetic Data"
    ],
    "evaluationPoints": [
      "Prompt powerful teacher LLM to generate diverse query-response pairs",
      "Filter out low-quality or duplicate samples using embedding deduplication and rule-based validation",
      "Use synthetic pairs to fine-tune smaller, cost-effective student models"
    ],
    "followUpTopics": [
      "Self-Instruct",
      "Quality filtering"
    ]
  },
  {
    "id": "ai-031",
    "role": "AI Engineer",
    "category": "AI Ethics",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What steps do you take to audit an AI application for safety, bias, and regulatory compliance?",
    "expectedSkills": [
      "AI Ethics",
      "Governance"
    ],
    "evaluationPoints": [
      "Red-teaming with adversarial prompt injection tests",
      "Benchmarking performance across protected demographic groups",
      "Clear transparency disclosures to users that they are interacting with AI"
    ],
    "followUpTopics": [
      "EU AI Act",
      "Red teaming"
    ]
  },
  {
    "id": "ai-032",
    "role": "AI Engineer",
    "category": "AI Agents",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How do multi-agent collaboration frameworks (AutoGen, CrewAI) solve complex multi-step workflows?",
    "expectedSkills": [
      "AI Agents",
      "CrewAI"
    ],
    "evaluationPoints": [
      "Specialized agents with defined personas, goals, and tools (e.g. Researcher, Writer, Reviewer)",
      "Sequential or hierarchical task delegation with inter-agent feedback loops",
      "Significantly reduces individual model hallucination through peer review"
    ],
    "followUpTopics": [
      "AutoGen",
      "Role-based agents"
    ]
  },
  {
    "id": "ai-033",
    "role": "AI Engineer",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an end-to-end AI application you built using LLMs or Computer Vision.",
    "expectedSkills": [
      "Project Experience",
      "Communication"
    ],
    "evaluationPoints": [
      "Problem statement and user requirements",
      "Model selection, prompting, and RAG/fine-tuning architecture",
      "Production deployment, latency monitoring, and user adoption metrics"
    ],
    "followUpTopics": [
      "Evaluation setup",
      "Lessons learned"
    ]
  },
  {
    "id": "ai-034",
    "role": "AI Engineer",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you build stakeholder confidence in an AI feature when outputs are non-deterministic?",
    "expectedSkills": [
      "Stakeholder Management",
      "Communication"
    ],
    "evaluationPoints": [
      "Provide visible source citations and confidence indicators",
      "Implement strict guardrails preventing harmful or off-brand outputs",
      "Conduct rigorous evaluation benchmarking and human-in-the-loop validation"
    ],
    "followUpTopics": [
      "Human-in-the-loop",
      "Explainability"
    ]
  },
  {
    "id": "ai-035",
    "role": "AI Engineer",
    "category": "Modern Trends",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the key differences between standard LLMs and Reasoning Models (e.g. OpenAI o1 / o3)?",
    "expectedSkills": [
      "Modern AI",
      "Reasoning Models"
    ],
    "evaluationPoints": [
      "Reasoning models use reinforcement learning to generate long internal chains of thought before answering",
      "Perform extensive search and backtracking, dramatically improving math, coding, and logical puzzles",
      "Trade off higher latency and compute for superior accuracy on complex tasks"
    ],
    "followUpTopics": [
      "Test-time compute",
      "Reinforcement learning from AI feedback"
    ]
  }
];
