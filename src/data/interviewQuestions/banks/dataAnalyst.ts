import { RoleQuestion } from '../types';

export const DATA_ANALYST_QUESTIONS: RoleQuestion[] = [
  {
    "id": "da-001",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the difference between WHERE and HAVING in SQL?",
    "expectedSkills": [
      "SQL"
    ],
    "evaluationPoints": [
      "WHERE filters rows before aggregation",
      "HAVING filters grouped records after GROUP BY",
      "WHERE cannot evaluate aggregate functions directly"
    ],
    "followUpTopics": [
      "GROUP BY",
      "SQL execution order"
    ]
  },
  {
    "id": "da-002",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write a SQL query using window functions to calculate a 7-day rolling average of revenue.",
    "expectedSkills": [
      "SQL",
      "Window Functions"
    ],
    "evaluationPoints": [
      "AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)",
      "Explain difference between ROWS and RANGE",
      "PARTITION BY for multi-product rolling metrics"
    ],
    "followUpTopics": [
      "Cumulative totals",
      "LEAD and LAG"
    ]
  },
  {
    "id": "da-003",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Compare ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL with tie-breaking examples.",
    "expectedSkills": [
      "SQL",
      "Window Functions"
    ],
    "evaluationPoints": [
      "ROW_NUMBER assigns distinct sequential integers",
      "RANK leaves gaps after ties (1, 2, 2, 4)",
      "DENSE_RANK leaves no gaps after ties (1, 2, 2, 3)"
    ],
    "followUpTopics": [
      "Top N queries",
      "Finding Nth highest salary"
    ]
  },
  {
    "id": "da-004",
    "role": "Data Analyst",
    "category": "Pandas",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you handle NaNs in Pandas? What criteria guide dropping vs imputing?",
    "expectedSkills": [
      "Pandas",
      "Data Cleaning"
    ],
    "evaluationPoints": [
      "dropna() vs fillna() with mean/median/mode",
      "Understanding MCAR vs MNAR missingness",
      "Evaluating percentage of missing records"
    ],
    "followUpTopics": [
      "IterativeImputer",
      "Forward/backward fill"
    ]
  },
  {
    "id": "da-005",
    "role": "Data Analyst",
    "category": "Pandas",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain groupby, merge, and pivot_table operations in Pandas for data analysis.",
    "expectedSkills": [
      "Pandas"
    ],
    "evaluationPoints": [
      "groupby aggregates along dimensions",
      "merge performs relational SQL-like joins",
      "pivot_table reshapes into multi-dimensional summaries"
    ],
    "followUpTopics": [
      "melt function",
      "MultiIndex DataFrames"
    ]
  },
  {
    "id": "da-006",
    "role": "Data Analyst",
    "category": "Excel",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is XLOOKUP superior to VLOOKUP in modern Microsoft Excel?",
    "expectedSkills": [
      "Excel"
    ],
    "evaluationPoints": [
      "XLOOKUP searches left and right without column index constraints",
      "Does not break when columns are inserted or deleted",
      "Built-in if_not_found error handling"
    ],
    "followUpTopics": [
      "INDEX-MATCH",
      "Dynamic array formulas"
    ]
  },
  {
    "id": "da-007",
    "role": "Data Analyst",
    "category": "Statistics",
    "difficulty": "Easy",
    "format": "technical",
    "question": "When should you report the Median instead of the Mean for business KPIs?",
    "expectedSkills": [
      "Statistics"
    ],
    "evaluationPoints": [
      "Mean is distorted by extreme outliers and skewed distributions",
      "Median represents true 50th percentile central tendency",
      "Use for salaries, property prices, and transaction amounts"
    ],
    "followUpTopics": [
      "Interquartile Range",
      "Standard deviation"
    ]
  },
  {
    "id": "da-008",
    "role": "Data Analyst",
    "category": "Statistics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain correlation vs causation and give an example of a confounding variable in business analytics.",
    "expectedSkills": [
      "Statistics",
      "Critical Thinking"
    ],
    "evaluationPoints": [
      "Correlation measures linear association; causation proves one causes the other",
      "Confounders create spurious correlations (e.g. ice cream sales and drowning)",
      "Randomized A/B testing is required to establish causality"
    ],
    "followUpTopics": [
      "Pearson vs Spearman",
      "Confounding bias"
    ]
  },
  {
    "id": "da-009",
    "role": "Data Analyst",
    "category": "Visualization",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you choose between line charts, bar charts, scatter plots, and heatmaps?",
    "expectedSkills": [
      "Visualization"
    ],
    "evaluationPoints": [
      "Line charts for trends over continuous time",
      "Bar charts for discrete categorical comparisons",
      "Scatter plots for correlation between two continuous variables",
      "Heatmaps for 2D matrix densities"
    ],
    "followUpTopics": [
      "Color accessibility",
      "Chart junk"
    ]
  },
  {
    "id": "da-010",
    "role": "Data Analyst",
    "category": "BI Tools",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "In Power BI, what is the architectural difference between calculated columns and DAX measures?",
    "expectedSkills": [
      "Power BI",
      "DAX"
    ],
    "evaluationPoints": [
      "Calculated columns are precomputed and stored in RAM during data refresh",
      "Measures are calculated dynamically on-the-fly based on visual filter context",
      "Measures should be used for KPI aggregates and ratios"
    ],
    "followUpTopics": [
      "CALCULATE function",
      "Star schema modeling"
    ]
  },
  {
    "id": "da-011",
    "role": "Data Analyst",
    "category": "Business Metrics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Define Customer Acquisition Cost (CAC), Lifetime Value (LTV), and Churn Rate.",
    "expectedSkills": [
      "Business Analysis",
      "KPIs"
    ],
    "evaluationPoints": [
      "CAC is total marketing spend divided by new customers acquired",
      "LTV is average revenue per customer times customer lifespan",
      "Churn is percentage of customers lost in a period",
      "Healthy LTV:CAC target is 3:1"
    ],
    "followUpTopics": [
      "Cohort retention",
      "Net Revenue Retention"
    ]
  },
  {
    "id": "da-012",
    "role": "Data Analyst",
    "category": "Data Cleaning",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "You receive an e-commerce dataset with duplicate rows, negative prices, and bad dates. How do you clean it?",
    "expectedSkills": [
      "Data Cleaning",
      "Data Quality"
    ],
    "evaluationPoints": [
      "Audit and profile data distributions",
      "Deduplicate based on composite keys",
      "Filter/investigate negative prices (refunds vs error)",
      "Standardize date strings to ISO YYYY-MM-DD"
    ],
    "followUpTopics": [
      "Outlier detection",
      "Data validation rules"
    ]
  },
  {
    "id": "da-013",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is a CTE (WITH clause) in SQL and why is it preferred over nested subqueries?",
    "expectedSkills": [
      "SQL"
    ],
    "evaluationPoints": [
      "Improves query readability and modular design",
      "Can be referenced multiple times within main query",
      "Supports recursive queries for hierarchical data"
    ],
    "followUpTopics": [
      "Recursive CTEs",
      "Temporary tables"
    ]
  },
  {
    "id": "da-014",
    "role": "Data Analyst",
    "category": "Scenario Analysis",
    "difficulty": "Advanced",
    "format": "scenario",
    "question": "Overall checkout conversion dropped by 15% last week. Walk me through your troubleshooting steps.",
    "expectedSkills": [
      "Problem Solving",
      "Root Cause Analysis"
    ],
    "evaluationPoints": [
      "Verify tracking instrumentation and data integrity first",
      "Segment by device, browser, geo, and traffic channel",
      "Analyze step-by-step funnel drop-offs to pinpoint payment or page failures"
    ],
    "followUpTopics": [
      "A/B testing",
      "Stakeholder reporting"
    ]
  },
  {
    "id": "da-015",
    "role": "Data Analyst",
    "category": "A/B Testing",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain hypothesis formulation, control vs variant, sample size, and p-value in A/B testing.",
    "expectedSkills": [
      "A/B Testing",
      "Statistics"
    ],
    "evaluationPoints": [
      "Null hypothesis H0 vs alternative H1",
      "Sample size calculation based on statistical power and MDE",
      "p-value < 0.05 indicates observed lift unlikely due to random variance"
    ],
    "followUpTopics": [
      "Type I and II errors",
      "Novelty effect"
    ]
  },
  {
    "id": "da-016",
    "role": "Data Analyst",
    "category": "Data Modeling",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain Star Schema vs Snowflake Schema in data warehousing.",
    "expectedSkills": [
      "Data Warehousing",
      "Modeling"
    ],
    "evaluationPoints": [
      "Star schema has denormalized dimension tables for faster joins",
      "Snowflake normalizes dimensions, saving storage at the expense of query complexity",
      "Fact tables store numerical metrics and foreign keys"
    ],
    "followUpTopics": [
      "Fact vs Dimension",
      "dbt data modeling"
    ]
  },
  {
    "id": "da-017",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Easy",
    "format": "technical",
    "question": "What is the operational difference between UNION and UNION ALL in SQL?",
    "expectedSkills": [
      "SQL"
    ],
    "evaluationPoints": [
      "UNION removes duplicate rows via an expensive sorting step",
      "UNION ALL retains all rows including duplicates and is significantly faster",
      "Use UNION ALL unless deduplication is strictly needed"
    ],
    "followUpTopics": [
      "INTERSECT",
      "Column compatibility"
    ]
  },
  {
    "id": "da-018",
    "role": "Data Analyst",
    "category": "Pandas",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "How do you detect and handle outliers in Python using the IQR (Interquartile Range) method?",
    "expectedSkills": [
      "Pandas",
      "Statistics"
    ],
    "evaluationPoints": [
      "Compute Q1 (25th) and Q3 (75th) percentiles; IQR = Q3 - Q1",
      "Outliers are values < Q1 - 1.5*IQR or > Q3 + 1.5*IQR",
      "Decide to cap (winsorize), drop, or investigate based on domain"
    ],
    "followUpTopics": [
      "Box plots",
      "Z-score"
    ]
  },
  {
    "id": "da-019",
    "role": "Data Analyst",
    "category": "Communication",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you present analytical findings to non-technical business executives?",
    "expectedSkills": [
      "Communication",
      "Data Storytelling"
    ],
    "evaluationPoints": [
      "Lead with the key business recommendation, not technical math",
      "Use clean visual charts with descriptive headlines",
      "Provide backup technical appendix for methodology"
    ],
    "followUpTopics": [
      "Dashboard design",
      "Tailoring message"
    ]
  },
  {
    "id": "da-020",
    "role": "Data Analyst",
    "category": "Cohort Analysis",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "What is cohort analysis and how do you build a customer retention heatmap?",
    "expectedSkills": [
      "Cohort Analysis",
      "Retention"
    ],
    "evaluationPoints": [
      "Group customers by acquisition month (cohorts)",
      "Track percentage of each cohort returning in months 1, 2, 3...",
      "Visualized as triangle heatmap showing retention decay over time"
    ],
    "followUpTopics": [
      "Churn curves",
      "Product stickiness"
    ]
  },
  {
    "id": "da-021",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Intermediate",
    "format": "practical",
    "question": "Write a query to find the top 3 highest revenue products in each department.",
    "expectedSkills": [
      "SQL",
      "Window Functions"
    ],
    "evaluationPoints": [
      "Compute revenue per product",
      "Apply DENSE_RANK() OVER (PARTITION BY department ORDER BY revenue DESC)",
      "Filter rank <= 3 in outer query or CTE"
    ],
    "followUpTopics": [
      "Ties handling",
      "Partitioning"
    ]
  },
  {
    "id": "da-022",
    "role": "Data Analyst",
    "category": "Excel",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you use Excel conditional formatting to create visual heatmaps and highlight exceptions?",
    "expectedSkills": [
      "Excel"
    ],
    "evaluationPoints": [
      "Color scales for continuous numerical gradients",
      "Formula-based rules to highlight cells matching business criteria",
      "Data bars for in-cell comparative magnitude"
    ],
    "followUpTopics": [
      "Pivot tables",
      "Excel dashboards"
    ]
  },
  {
    "id": "da-023",
    "role": "Data Analyst",
    "category": "Data Quality",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What sanity checks do you run on newly ingested data before building reports?",
    "expectedSkills": [
      "Data Quality",
      "ETL"
    ],
    "evaluationPoints": [
      "Row count reconciliation with source systems",
      "Null rate checks on primary keys and foreign keys",
      "Range and format validation on numeric and date columns",
      "Duplicate detection"
    ],
    "followUpTopics": [
      "Great Expectations",
      "Schema drift"
    ]
  },
  {
    "id": "da-024",
    "role": "Data Analyst",
    "category": "Statistics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "Explain the Central Limit Theorem and why it is essential for sample inference.",
    "expectedSkills": [
      "Statistics"
    ],
    "evaluationPoints": [
      "Distribution of sample means approaches normal as sample size increases, regardless of population shape",
      "Allows confidence intervals and hypothesis tests on real-world skewed data",
      "Requires independent observations, typically n >= 30"
    ],
    "followUpTopics": [
      "Standard error",
      "Confidence intervals"
    ]
  },
  {
    "id": "da-025",
    "role": "Data Analyst",
    "category": "Business Metrics",
    "difficulty": "Easy",
    "format": "technical",
    "question": "How do you calculate stage-by-stage drop-off and conversion rates in an analytics funnel?",
    "expectedSkills": [
      "Funnel Analysis",
      "CRO"
    ],
    "evaluationPoints": [
      "Track unique users completing each sequential step",
      "Conversion rate = Step N+1 users / Step N users",
      "Drop-off rate = 1 - Conversion rate",
      "Identifies highest leverage improvement areas"
    ],
    "followUpTopics": [
      "Micro-conversions",
      "Drop-off visualization"
    ]
  },
  {
    "id": "da-026",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "How do you use CASE WHEN in SQL to bucket values and calculate conditional sums?",
    "expectedSkills": [
      "SQL"
    ],
    "evaluationPoints": [
      "CASE WHEN condition THEN result ELSE default END",
      "Bucketing continuous values into discrete tiers",
      "Conditional aggregation: SUM(CASE WHEN status='PAID' THEN amount ELSE 0 END)"
    ],
    "followUpTopics": [
      "COALESCE",
      "NULLIF"
    ]
  },
  {
    "id": "da-027",
    "role": "Data Analyst",
    "category": "Python",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare Matplotlib and Seaborn for exploratory data visualization in Python.",
    "expectedSkills": [
      "Visualization",
      "Python"
    ],
    "evaluationPoints": [
      "Matplotlib provides granular low-level control of canvas elements",
      "Seaborn provides high-level statistical plots with built-in styling",
      "Seaborn natively accepts Pandas DataFrames with hue parameters"
    ],
    "followUpTopics": [
      "Plotly",
      "Pair plots"
    ]
  },
  {
    "id": "da-028",
    "role": "Data Analyst",
    "category": "Business Metrics",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What is the DAU/MAU stickiness ratio and what does it indicate about product engagement?",
    "expectedSkills": [
      "Product Analytics",
      "KPIs"
    ],
    "evaluationPoints": [
      "Daily Active Users divided by Monthly Active Users",
      "Measures how frequently users return to the product within a month",
      "High ratio indicates strong user habit and product stickiness"
    ],
    "followUpTopics": [
      "Defining active users",
      "Session length"
    ]
  },
  {
    "id": "da-029",
    "role": "Data Analyst",
    "category": "Data Governance",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Why is maintaining a data dictionary and clear metadata essential for analytics teams?",
    "expectedSkills": [
      "Data Governance",
      "Documentation"
    ],
    "evaluationPoints": [
      "Ensures single source of truth across conflicting department metrics",
      "Documents exact business logic and field definitions",
      "Prevents incorrect interpretations by business users"
    ],
    "followUpTopics": [
      "dbt docs",
      "Data catalogs"
    ]
  },
  {
    "id": "da-030",
    "role": "Data Analyst",
    "category": "Scenario Analysis",
    "difficulty": "Intermediate",
    "format": "scenario",
    "question": "Marketing says they generated 5,000 leads, but Sales says they only received 3,500. How do you investigate?",
    "expectedSkills": [
      "Problem Solving",
      "Investigation"
    ],
    "evaluationPoints": [
      "Audit metric definitions (MQL vs SQL)",
      "Check integration pipeline between Marketing software and CRM",
      "Inspect filter criteria, spam detection, and lead deduplication rules"
    ],
    "followUpTopics": [
      "Pipeline reconciliation",
      "Stakeholder communication"
    ]
  },
  {
    "id": "da-031",
    "role": "Data Analyst",
    "category": "SQL",
    "difficulty": "Easy",
    "format": "technical",
    "question": "Compare SQL subqueries vs JOINs in terms of readability and query execution performance.",
    "expectedSkills": [
      "SQL",
      "Optimization"
    ],
    "evaluationPoints": [
      "JOIN combines tables directly and is easily parallelized by optimizers",
      "Correlated subqueries execute row-by-row and can be very slow",
      "Modern optimizers rewrite many subqueries as joins automatically"
    ],
    "followUpTopics": [
      "EXISTS vs IN",
      "Optimization plans"
    ]
  },
  {
    "id": "da-032",
    "role": "Data Analyst",
    "category": "Statistics",
    "difficulty": "Advanced",
    "format": "technical",
    "question": "Explain Simpson's Paradox with an example of how aggregated data can mislead analysts.",
    "expectedSkills": [
      "Statistics",
      "Paradoxes"
    ],
    "evaluationPoints": [
      "A trend apparent in subgroups reverses when data is aggregated together",
      "Caused by unequal group sizes and confounding variables",
      "Requires segmented analysis before drawing business conclusions"
    ],
    "followUpTopics": [
      "Stratified sampling",
      "Confounders"
    ]
  },
  {
    "id": "da-033",
    "role": "Data Analyst",
    "category": "Project Experience",
    "difficulty": "Intermediate",
    "format": "behavioral",
    "question": "Describe an analytical project you delivered that directly influenced business decisions.",
    "expectedSkills": [
      "Project Experience",
      "Communication"
    ],
    "evaluationPoints": [
      "Problem context and initial stakeholder question",
      "Analysis methodology, tools, and data sources used",
      "Concrete business outcome (cost reduction, conversion boost)"
    ],
    "followUpTopics": [
      "Post-launch tracking",
      "Stakeholder feedback"
    ]
  },
  {
    "id": "da-034",
    "role": "Data Analyst",
    "category": "Behavioral",
    "difficulty": "Easy",
    "format": "behavioral",
    "question": "How do you manage a flood of ad-hoc analytics requests while delivering strategic projects?",
    "expectedSkills": [
      "Prioritization",
      "Stakeholder Management"
    ],
    "evaluationPoints": [
      "Evaluate business impact vs effort (ICE framework)",
      "Create self-service dashboards for repetitive requests",
      "Maintain transparent shared backlog reviewed with leadership"
    ],
    "followUpTopics": [
      "SLA management",
      "Setting boundaries"
    ]
  },
  {
    "id": "da-035",
    "role": "Data Analyst",
    "category": "Forecasting",
    "difficulty": "Intermediate",
    "format": "technical",
    "question": "What basic statistical approaches can you use to forecast next quarter's revenue?",
    "expectedSkills": [
      "Forecasting",
      "Time Series"
    ],
    "evaluationPoints": [
      "Moving averages and exponential smoothing",
      "Linear regression with seasonal decomposition",
      "Accounting for growth rate, seasonality, and holidays"
    ],
    "followUpTopics": [
      "Prophet",
      "ARIMA basics"
    ]
  }
];
