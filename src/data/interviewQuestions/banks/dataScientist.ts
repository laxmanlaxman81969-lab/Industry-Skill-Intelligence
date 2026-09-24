import { RoleQuestion } from '../types';

export const DATA_SCIENTIST_QUESTIONS: RoleQuestion[] = [
  {
    "id": "ds-001",
    "role": "Data Scientist",
    "category": "ML Fundamentals",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain the Bias-Variance tradeoff in supervised machine learning.",
    "expectedSkills": [
      "ML Fundamentals"
    ],
    "evaluationPoints": [
      "High bias causes underfitting (model too simplistic)",
      "High variance causes overfitting (model learns noise)",
      "Goal is to minimize total generalization error"
    ],
    "followUpTopics": [
      "Regularization",
      "Learning curves"
    ]
  },
  {
    "id": "ds-002",
    "role": "Data Scientist",
    "category": "Evaluation Metrics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When should you prefer PR-AUC over ROC-AUC for evaluating classification models?",
    "expectedSkills": [
      "Model Evaluation"
    ],
    "evaluationPoints": [
      "ROC-AUC evaluates True Positive Rate vs False Positive Rate",
      "PR-AUC evaluates Precision vs Recall",
      "For highly imbalanced datasets, PR-AUC avoids false optimism"
    ],
    "followUpTopics": [
      "F1-score",
      "Threshold tuning"
    ]
  },
  {
    "id": "ds-003",
    "role": "Data Scientist",
    "category": "Linear Models",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What are the core assumptions of Ordinary Least Squares (OLS) Linear Regression?",
    "expectedSkills": [
      "Statistics",
      "Regression"
    ],
    "evaluationPoints": [
      "Linear relationship between features and target",
      "Homoscedasticity (constant residual variance)",
      "Normality and independence of residuals",
      "No multicollinearity"
    ],
    "followUpTopics": [
      "Residual plots",
      "VIF"
    ]
  },
  {
    "id": "ds-004",
    "role": "Data Scientist",
    "category": "Regularization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare L1 and L2 regularization. Why does L1 drive weights to exact zero?",
    "expectedSkills": [
      "Regularization"
    ],
    "evaluationPoints": [
      "L1 adds absolute penalty, L2 adds squared penalty",
      "L1 diamond constraint boundary intersects axes, performing feature selection",
      "L2 shrinks weights continuously without setting them to zero"
    ],
    "followUpTopics": [
      "ElasticNet",
      "Weight decay"
    ]
  },
  {
    "id": "ds-005",
    "role": "Data Scientist",
    "category": "Tree-Based Models",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Random Forest and Gradient Boosting (XGBoost/LightGBM).",
    "expectedSkills": [
      "Ensemble Learning"
    ],
    "evaluationPoints": [
      "Random Forest uses parallel Bagging to reduce variance",
      "Gradient Boosting trains sequential trees fitting residuals to reduce bias and variance",
      "Boosting is generally more accurate but sensitive to tuning"
    ],
    "followUpTopics": [
      "Feature importance",
      "Early stopping"
    ]
  },
  {
    "id": "ds-006",
    "role": "Data Scientist",
    "category": "Preprocessing",
    "difficulty": "Easy",
    "format": "technical",
    "question": "When is feature scaling (StandardScaler vs MinMaxScaler) necessary vs irrelevant in ML?",
    "expectedSkills": [
      "Feature Engineering"
    ],
    "evaluationPoints": [
      "Required for distance-based models (KNN, SVM, K-Means) and gradient descent models",
      "Irrelevant for tree-based models (Decision Trees, Random Forest, XGBoost)",
      "MinMax bounds to [0,1], Standard centers to mean=0, std=1"
    ],
    "followUpTopics": [
      "Data leakage",
      "RobustScaler"
    ]
  },
  {
    "id": "ds-007",
    "role": "Data Scientist",
    "category": "Unsupervised",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How does K-Means clustering work and how do you choose optimal K?",
    "expectedSkills": [
      "Clustering"
    ],
    "evaluationPoints": [
      "Iterative centroid assignment and re-computation until convergence",
      "Elbow method using WCSS (Inertia)",
      "Silhouette score evaluating cluster separation"
    ],
    "followUpTopics": [
      "K-Means++",
      "DBSCAN"
    ]
  },
  {
    "id": "ds-008",
    "role": "Data Scientist",
    "category": "Dimensionality Reduction",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain PCA. What role do eigenvectors and eigenvalues play?",
    "expectedSkills": [
      "PCA"
    ],
    "evaluationPoints": [
      "Finds orthogonal axes maximizing feature variance",
      "Eigenvectors define direction of principal components; eigenvalues define variance magnitude",
      "Requires pre-scaled data"
    ],
    "followUpTopics": [
      "Scree plot",
      "t-SNE vs PCA"
    ]
  },
  {
    "id": "ds-009",
    "role": "Data Scientist",
    "category": "Validation",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is Stratified K-Fold cross-validation essential for imbalanced classification?",
    "expectedSkills": [
      "Model Validation"
    ],
    "evaluationPoints": [
      "Maintains original class distribution across every training and validation fold",
      "Prevents folds with zero minority class instances",
      "Provides stable performance estimates"
    ],
    "followUpTopics": [
      "TimeSeriesSplit",
      "Nested CV"
    ]
  },
  {
    "id": "ds-010",
    "role": "Data Scientist",
    "category": "Statistics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Type I error, Type II error, and statistical power in A/B testing.",
    "expectedSkills": [
      "A/B Testing",
      "Statistics"
    ],
    "evaluationPoints": [
      "Type I (alpha): False Positive (rejecting true null)",
      "Type II (beta): False Negative (failing to detect real effect)",
      "Power (1-beta): probability of finding a true effect (target 80%)"
    ],
    "followUpTopics": [
      "p-values",
      "Sample size calculation"
    ]
  },
  {
    "id": "ds-011",
    "role": "Data Scientist",
    "category": "Scenario Analysis",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "You have a fraud detection dataset with 0.2% positive fraud cases. How do you approach it?",
    "expectedSkills": [
      "Imbalanced Learning"
    ],
    "evaluationPoints": [
      "Do not use accuracy; use PR-AUC or Recall at fixed Precision",
      "Techniques: SMOTE, class weighting (scale_pos_weight), threshold tuning",
      "Anomaly detection alternatives (Isolation Forest)"
    ],
    "followUpTopics": [
      "Focal Loss",
      "Cost matrix"
    ]
  },
  {
    "id": "ds-012",
    "role": "Data Scientist",
    "category": "Feature Engineering",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you encode categorical features with thousands of unique categories (e.g. ZIP code)?",
    "expectedSkills": [
      "Feature Engineering"
    ],
    "evaluationPoints": [
      "Target (Mean) encoding with smoothing to prevent leakage",
      "Frequency / Count encoding",
      "Entity embeddings via neural networks",
      "Avoid one-hot encoding"
    ],
    "followUpTopics": [
      "CatBoost encoding",
      "Weight of Evidence"
    ]
  },
  {
    "id": "ds-013",
    "role": "Data Scientist",
    "category": "Explainability",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain how SHAP (Shapley values) explains individual model predictions.",
    "expectedSkills": [
      "XAI",
      "SHAP"
    ],
    "evaluationPoints": [
      "Based on cooperative game theory calculating fair marginal feature contributions",
      "Provides local explanations and global feature importance with direction",
      "Model-agnostic KernelSHAP and optimized TreeSHAP"
    ],
    "followUpTopics": [
      "LIME",
      "Feature attribution"
    ]
  },
  {
    "id": "ds-014",
    "role": "Data Scientist",
    "category": "Optimization",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Batch Gradient Descent, Stochastic (SGD), and Mini-batch Gradient Descent.",
    "expectedSkills": [
      "Optimization"
    ],
    "evaluationPoints": [
      "Batch uses entire dataset per step (slow, stable)",
      "SGD uses 1 random sample (fast, noisy, escapes local minima)",
      "Mini-batch uses small batches (32-256) balancing vectorization and stability"
    ],
    "followUpTopics": [
      "Adam optimizer",
      "Learning rate schedule"
    ]
  },
  {
    "id": "ds-015",
    "role": "Data Scientist",
    "category": "Deep Learning",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What causes vanishing gradients in deep neural networks and how is it solved?",
    "expectedSkills": [
      "Deep Learning"
    ],
    "evaluationPoints": [
      "Repeated multiplication of small gradients through sigmoid/tanh saturates layers",
      "Solved by ReLU/GELU activations, Batch Normalization, and Residual connections",
      "Proper weight initialization (He/Xavier)"
    ],
    "followUpTopics": [
      "Exploding gradients",
      "Skip connections"
    ]
  },
  {
    "id": "ds-016",
    "role": "Data Scientist",
    "category": "NLP",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare TF-IDF and dense word embeddings (Word2Vec) for text feature extraction.",
    "expectedSkills": [
      "NLP"
    ],
    "evaluationPoints": [
      "TF-IDF reflects word frequency vs corpus rarity (sparse, no semantic relations)",
      "Word2Vec generates dense continuous vectors capturing semantic analogy",
      "Embeddings support vector math (king - man + woman = queen)"
    ],
    "followUpTopics": [
      "BERT embeddings",
      "Cosine similarity"
    ]
  },
  {
    "id": "ds-017",
    "role": "Data Scientist",
    "category": "Time Series",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Why is stationarity required for time series forecasting and how do you test it?",
    "expectedSkills": [
      "Time Series"
    ],
    "evaluationPoints": [
      "Stationarity means constant mean, variance, and autocorrelation over time",
      "Tested using Augmented Dickey-Fuller (ADF) test",
      "Achieved via differencing, log transformation, and seasonal adjustments"
    ],
    "followUpTopics": [
      "ARIMA",
      "Lookahead bias"
    ]
  },
  {
    "id": "ds-018",
    "role": "Data Scientist",
    "category": "Recommenders",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Collaborative Filtering vs Content-Based Filtering for recommendations.",
    "expectedSkills": [
      "Recommenders"
    ],
    "evaluationPoints": [
      "Collaborative filtering uses user-item interaction matrix (Matrix Factorization/SVD)",
      "Content-based matches item attributes to user profile preferences",
      "Hybrid approaches overcome Cold Start problem"
    ],
    "followUpTopics": [
      "Cold start problem",
      "Implicit feedback"
    ]
  },
  {
    "id": "ds-019",
    "role": "Data Scientist",
    "category": "MLOps",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the difference between Data (Covariate) Drift and Concept Drift in production?",
    "expectedSkills": [
      "MLOps"
    ],
    "evaluationPoints": [
      "Data Drift: distribution of inputs P(X) changes",
      "Concept Drift: relationship between inputs and target P(Y|X) changes",
      "Detected via Population Stability Index (PSI) and Kolmogorov-Smirnov test"
    ],
    "followUpTopics": [
      "Model retraining",
      "Feature stores"
    ]
  },
  {
    "id": "ds-020",
    "role": "Data Scientist",
    "category": "Hyperparameters",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Grid Search, Random Search, and Bayesian Optimization (Optuna).",
    "expectedSkills": [
      "Hyperparameters"
    ],
    "evaluationPoints": [
      "Grid Search evaluates exhaustive combinations (exponentially slow)",
      "Random Search samples randomly (more efficient coverage)",
      "Bayesian optimization uses probabilistic surrogate model to guide search"
    ],
    "followUpTopics": [
      "Optuna pruning",
      "Early stopping"
    ]
  },
  {
    "id": "ds-021",
    "role": "Data Scientist",
    "category": "Statistics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "When do you use parametric tests (t-test) vs non-parametric tests (Mann-Whitney)?",
    "expectedSkills": [
      "Statistics"
    ],
    "evaluationPoints": [
      "Parametric assumes underlying normal distribution (t-test, ANOVA)",
      "Non-parametric makes no distribution assumptions (Mann-Whitney, Wilcoxon)",
      "Use non-parametric when data is skewed or sample size is small"
    ],
    "followUpTopics": [
      "Chi-Square test",
      "Bootstrapping"
    ]
  },
  {
    "id": "ds-022",
    "role": "Data Scientist",
    "category": "Machine Learning",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do SVMs work and what is the Kernel Trick?",
    "expectedSkills": [
      "SVM"
    ],
    "evaluationPoints": [
      "Finds maximum margin hyperplane separating classes",
      "Kernel trick projects data into higher dimensional space without explicit coordinate computation",
      "Common kernels: RBF, polynomial"
    ],
    "followUpTopics": [
      "Slack variable C",
      "Support vectors"
    ]
  },
  {
    "id": "ds-023",
    "role": "Data Scientist",
    "category": "Troubleshooting",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Your model achieved 99.9% validation accuracy but fails miserably in production. What happened?",
    "expectedSkills": [
      "Data Leakage"
    ],
    "evaluationPoints": [
      "Target leakage: features contain future information not present at inference",
      "Preprocessing leakage: scaling or imputation fitted before train/test split",
      "Duplicates leaking across train and test sets"
    ],
    "followUpTopics": [
      "Pipeline usage",
      "Leakage audits"
    ]
  },
  {
    "id": "ds-024",
    "role": "Data Scientist",
    "category": "Clean Code",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why should you always encapsulate ML workflows in Scikit-Learn Pipelines?",
    "expectedSkills": [
      "Scikit-Learn"
    ],
    "evaluationPoints": [
      "Guarantees fit() is only executed on training data, eliminating leakage",
      "Simplifies model deployment into a single serializable artifact",
      "Enables seamless integration with GridSearchCV and cross-validation"
    ],
    "followUpTopics": [
      "ColumnTransformer",
      "Custom transformers"
    ]
  },
  {
    "id": "ds-025",
    "role": "Data Scientist",
    "category": "Classification",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How does Logistic Regression model probabilities and what is the logit function?",
    "expectedSkills": [
      "Logistic Regression"
    ],
    "evaluationPoints": [
      "Applies Sigmoid function: 1 / (1 + e^-z) mapping (-inf, inf) to (0, 1)",
      "Models log-odds: ln(p / (1-p)) = w*x + b",
      "Optimized using binary cross-entropy loss"
    ],
    "followUpTopics": [
      "Odds ratios",
      "Softmax"
    ]
  },
  {
    "id": "ds-026",
    "role": "Data Scientist",
    "category": "Evaluation",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Explain Precision, Recall, Specificity, and F1-Score in classification.",
    "expectedSkills": [
      "Evaluation"
    ],
    "evaluationPoints": [
      "Precision = TP / (TP + FP) — quality of positive predictions",
      "Recall = TP / (TP + FN) — quantity of actual positives captured",
      "F1 is harmonic mean of Precision and Recall",
      "Specificity = TN / (TN + FP)"
    ],
    "followUpTopics": [
      "PR curve",
      "Macro vs Micro F1"
    ]
  },
  {
    "id": "ds-027",
    "role": "Data Scientist",
    "category": "Deep Learning",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the role of Convolutional, Pooling, and Fully-Connected layers in CNNs.",
    "expectedSkills": [
      "CNN"
    ],
    "evaluationPoints": [
      "Convolutional layers apply learnable spatial filters to extract features",
      "Pooling layers downsample feature maps, providing translation invariance",
      "Fully-connected layers perform final classification"
    ],
    "followUpTopics": [
      "Transfer learning",
      "Strides and padding"
    ]
  },
  {
    "id": "ds-028",
    "role": "Data Scientist",
    "category": "Deep Learning",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "How does the Self-Attention mechanism work in Transformer models?",
    "expectedSkills": [
      "Transformers"
    ],
    "evaluationPoints": [
      "Calculates attention scores between all token pairs: Softmax(QK^T / sqrt(d_k)) * V",
      "Enables parallel sequence processing unlike recurrent unrolling in RNNs",
      "Captures long-range dependencies efficiently"
    ],
    "followUpTopics": [
      "Multi-head attention",
      "Positional encoding"
    ]
  },
  {
    "id": "ds-029",
    "role": "Data Scientist",
    "category": "Problem Formulation",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "How do you translate a vague business objective ('improve sales') into an ML problem?",
    "expectedSkills": [
      "Problem Formulation"
    ],
    "evaluationPoints": [
      "Define measurable target variable (e.g. probability of lead closing)",
      "Identify historical training data and prediction cutoff point",
      "Establish offline evaluation metric directly linked to business revenue"
    ],
    "followUpTopics": [
      "Uplift modeling",
      "Cost-benefit tradeoff"
    ]
  },
  {
    "id": "ds-030",
    "role": "Data Scientist",
    "category": "Statistics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is Maximum Likelihood Estimation (MLE) in statistical modeling?",
    "expectedSkills": [
      "Statistics"
    ],
    "evaluationPoints": [
      "Estimates model parameters that maximize probability of observing given data",
      "Maximizes log-likelihood for mathematical simplicity and numerical stability",
      "Foundation for linear regression and logistic regression parameters"
    ],
    "followUpTopics": [
      "MAP estimation",
      "Bayesian inference"
    ]
  },
  {
    "id": "ds-031",
    "role": "Data Scientist",
    "category": "Ethics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you detect and mitigate algorithmic bias across demographic subgroups?",
    "expectedSkills": [
      "AI Ethics"
    ],
    "evaluationPoints": [
      "Audit model performance metrics across protected demographic slices",
      "Evaluate fairness metrics: Demographic Parity, Equalized Odds",
      "Mitigate via reweighting training samples or adversarial debiasing"
    ],
    "followUpTopics": [
      "Fairlearn",
      "Proxy variables"
    ]
  },
  {
    "id": "ds-032",
    "role": "Data Scientist",
    "category": "Deployment",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare Batch inference vs Real-time online inference in production ML architecture.",
    "expectedSkills": [
      "Deployment",
      "MLOps"
    ],
    "evaluationPoints": [
      "Batch computes predictions offline on schedule, saving to DB (simple, high throughput)",
      "Real-time serves predictions via REST API in <100ms with fresh features",
      "Requires feature store and low-latency infrastructure"
    ],
    "followUpTopics": [
      "Triton server",
      "Feature stores"
    ]
  },
  {
    "id": "ds-033",
    "role": "Data Scientist",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an end-to-end machine learning model you deployed to production.",
    "expectedSkills": [
      "Project Experience"
    ],
    "evaluationPoints": [
      "Problem definition and dataset collection",
      "Feature engineering, model selection, and offline validation",
      "Deployment method and monitored business impact"
    ],
    "followUpTopics": [
      "Drift monitoring",
      "A/B test validation"
    ]
  },
  {
    "id": "ds-034",
    "role": "Data Scientist",
    "category": "Communication",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you explain the tradeoff between a complex black-box model and an interpretable model to executives?",
    "expectedSkills": [
      "Communication"
    ],
    "evaluationPoints": [
      "Frame in terms of business risk, regulatory needs, and financial uplift",
      "Demonstrate incremental gain of complex model vs explainability cost",
      "Showcase SHAP explanations as middle ground"
    ],
    "followUpTopics": [
      "Stakeholder alignment",
      "Risk management"
    ]
  },
  {
    "id": "ds-035",
    "role": "Data Scientist",
    "category": "Linear Algebra",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is Singular Value Decomposition (SVD) and how is it used in dimensionality reduction?",
    "expectedSkills": [
      "Linear Algebra"
    ],
    "evaluationPoints": [
      "Decomposes matrix into U * Sigma * V^T",
      "Truncating to top k singular values yields optimal low-rank matrix approximation",
      "Applied in Latent Semantic Analysis and collaborative filtering"
    ],
    "followUpTopics": [
      "Eigenvalue decomposition",
      "Low-rank approximation"
    ]
  }
];
