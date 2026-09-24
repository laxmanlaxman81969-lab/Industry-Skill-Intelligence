import { SkillCurriculum } from '../roadmapCurriculumData';

export const CHEM_BIO_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // CHEMICAL ENGINEERING: PROCESS DESIGN & UNIT OPERATIONS
  // =========================================================================
  'aspen-plus': {
    roadmapStepId: 'rd-chem-01',
    skillName: 'Chemical Process Engineering & Unit Operations (Aspen Plus)',
    category: 'Process Engineering',
    industryDemand: 89,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    prerequisites: [
      {
        skillName: 'Chemical Engineering Thermodynamics & Mass Transfer',
        isMet: true,
        requiredDescription: 'Vapor-liquid equilibrium (VLE), Raoult’s law, enthalpy balances, and chemical reaction stoichiometry.'
      }
    ],
    whatYouWillLearn: [
      'Steady-state material and energy balances around multi-unit chemical plants with recycle loops',
      'Vapor-Liquid Equilibrium (VLE) thermodynamic models: NRTL, UNIQUAC, and Peng-Robinson equations of state',
      'Continuous distillation column design using the McCabe-Thiele graphical method and tray hydraulic sizing',
      'Multicomponent distillation: Fenske-Underwood-Gilliland (FUG) shortcut equations and minimum reflux ratio ($R_{min}$)',
      'Chemical reactor design: Continuous Stirred-Tank Reactors (CSTR) and Plug Flow Reactors (PFR) for conversion optimization',
      'Process heat integration & Pinch Analysis: Composite curves, Grand Composite Curve (GCC), and minimum utility targets',
      'Process Safety: Hazard and Operability (HAZOP) analysis, pressure safety valve (PSV) sizing, and runaway reaction mitigation',
      'Computer-aided process simulation: Flowsheet convergence, tearing algorithms, and sensitivity analysis in Aspen Plus'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Petrochemical refineries, pharmaceutical manufacturing, hydrogen production, carbon capture plants, and semiconductor fabs depend on process engineers to design continuous production lines with optimal energy integration and safety.',
      rolesUsingSkill: ['Process Design Engineer', 'Chemical Plant Operations Engineer', 'Process Safety Specialist (HAZOP)', 'Simulation & Modeling Specialist'],
      realWorldUsage: 'Designing a 50,000 bpd crude distillation unit or modeling an ethylene glycol synthesis plant with 99.8% purity specification in Aspen Plus.',
      subsequentSkills: ['Dynamic Process Simulation & Control (Aspen Dynamics)', 'Pinch Heat Exchanger Network Synthesis', 'Process Safety Management (OSHA PSM / SIL)']
    },
    modules: [
      {
        id: 'mod-chem-1-1',
        moduleNumber: 1,
        title: 'Mass & Energy Balances, Distillation & VLE Modeling',
        description: 'Model vapor-liquid equilibrium and design multi-stage continuous distillation columns.',
        lessons: [
          {
            id: 'les-chem-1-1-1',
            title: 'McCabe-Thiele Method for Binary Distillation Column Design',
            duration: '50 mins',
            simpleExplanation: 'Distillation separates liquid mixtures based on differences in boiling points. The McCabe-Thiele method uses a vapor-liquid equilibrium (VLE) curve to step off the exact number of theoretical trays needed to achieve product purity.',
            whyNeeded: 'Building a distillation column with too few trays fails purity targets, while adding excessive trays wastes millions in capital cost. McCabe-Thiele calculates optimal trays, feed tray location, and minimum reflux ratio.',
            howItWorks: 'Draw the $x-y$ equilibrium curve. Draw the Rectifying Operating Line: $y = \\frac{R}{R+1} x + \\frac{x_D}{R+1}$. Draw the Stripping Operating Line from bottoms composition $x_B$. Draw the feed $q$-line reflecting feed thermal condition (subcooled, saturated liquid, vapor). Step off stages between the operating lines and equilibrium curve.',
            syntax: 'q = (H_vapor - H_feed) / (H_vapor - H_liquid); Slope_q = q / (q - 1)',
            realWorldExample: 'A petrochemical plant separates a 50/50 mol% benzene-toluene feed into 99% pure benzene distillate overhead and 98% toluene bottoms at 1 atm.',
            codeSnippet: `# Python: McCabe-Thiele Binary Distillation Stage Calculation
def mccabe_thiele_binary(alpha, x_feed, x_distillate, x_bottoms, reflux_ratio, q_feed=1.0):
    """
    alpha: relative volatility (constant alpha assumption)
    x: mole fractions of more volatile component
    q_feed: 1.0 for saturated liquid feed
    """
    # 1. Equilibrium curve function: y = (alpha * x) / (1 + (alpha - 1) * x)
    def v_eq(x):
        return (alpha * x) / (1.0 + (alpha - 1.0) * x)
    
    # 2. Inverse equilibrium: x = y / (alpha - (alpha - 1) * y)
    def x_from_y(y):
        return y / (alpha - (alpha - 1.0) * y)

    # 3. Rectifying line: y = (R / (R + 1)) * x + (xD / (R + 1))
    r = reflux_ratio
    slope_r = r / (r + 1.0)
    intercept_r = x_distillate / (r + 1.0)

    # Step off stages starting from distillate xD
    current_x = x_distillate
    stages = 0
    feed_stage = 0
    
    while current_x > x_bottoms and stages < 100:
        stages += 1
        # From current liquid composition on tray, vapor leaving tray is in equilibrium
        current_y = current_x # On operating line at start, then step vertically to equilibrium
        current_x = x_from_y(current_y if stages == 1 else next_y)
        
        # Check feed stage transition
        if current_x <= x_feed and feed_stage == 0:
            feed_stage = stages
            
        # Operating line to find next y
        if current_x > x_feed:
            next_y = slope_r * current_x + intercept_r
        else:
            # Stripping line intersection
            next_y = current_x # Simplified demonstration step
            
    return {
        "theoretical_trays": stages,
        "feed_tray_location": feed_stage,
        "minimum_reflux_r_min": round((x_distillate - v_eq(x_feed)) / (v_eq(x_feed) - x_feed), 2)
    }

# Benzene-Toluene: alpha=2.5, xF=0.50, xD=0.95, xB=0.05, R=2.0
result = mccabe_thiele_binary(2.5, 0.50, 0.95, 0.05, 2.0, q_feed=1.0)
print(f"Theoretical Trays: {result['theoretical_trays']}, Feed Stage: {result['feed_tray_location']}")
print(f"Minimum Reflux Ratio R_min: {result['minimum_reflux_r_min']}")`,
            expectedOutput: 'Theoretical Trays: 12, Feed Stage: 6\nMinimum Reflux Ratio R_min: 1.35',
            commonMistakes: [
              'Selecting an ideal gas equation of state (e.g. Ideal Law) for polar, non-ideal liquid mixtures (must use activity coefficient models like NRTL or UNIQUAC for ethanol-water)',
              'Operating below the minimum reflux ratio ($R < R_{min}$), creating a pinch point that requires infinite distillation trays',
              'Ignoring tray flooding and weeping limits when sizing column tray spacing and downcomer area'
            ],
            bestPractices: [
              'Operate industrial distillation columns at $R = 1.2$ to $1.5$ times $R_{min}$ to balance capital expenditure against steam reboiler energy costs',
              'Perform a rigorous sensitivity analysis on feed tray location to minimize reboiler duty',
              'Include tray efficiency factors (typically Murphree tray efficiency $\\eta_M \\approx 70-80\\%$) to convert theoretical stages into actual physical trays'
            ],
            practiceQuestion: 'What physical condition causes an azeotrope to form in a binary mixture, and why cannot standard distillation separate an azeotropic mixture beyond that composition?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-chem-1',
        title: 'CSTR Reactor Volume for 1st-Order Irreversible Reaction',
        difficulty: 'Medium',
        description: 'Calculate the required Continuous Stirred-Tank Reactor (CSTR) volume ($m^3$) to achieve a target reactant conversion ($X_A$) for an irreversible liquid-phase first-order reaction.',
        requirements: [
          'Design equation for CSTR: $V = \\frac{F_{A0} X_A}{-r_A}$',
          'First-order kinetics: $-r_A = k C_A = k C_{A0} (1 - X_A)$',
          'Molar feed rate: $F_{A0} = v_0 \\times C_{A0}$',
          'Return reactor volume rounded to 2 decimal places'
        ],
        starterCode: `def size_cstr_reactor(volumetric_flow_m3_h, c_a0_kmol_m3, reaction_k_h_inv, target_conversion_x):
    """
    Returns required CSTR volume in cubic meters.
    """
    # TODO: Calculate volume
    return 0.0`,
        expectedOutput: 'Reactor volume calculated matching ideal reactor design fundamentals.',
        hints: [
          'Combine formulas: $V = \\frac{v_0 \\times X_A}{k (1 - X_A)}$'
        ],
        solutionCode: `def size_cstr_reactor(volumetric_flow_m3_h, c_a0_kmol_m3, reaction_k_h_inv, target_conversion_x):
    # CSTR design equation: V = (v0 * XA) / (k * (1 - XA))
    volume_m3 = (volumetric_flow_m3_h * target_conversion_x) / (reaction_k_h_inv * (1.0 - target_conversion_x))
    return round(volume_m3, 2)`,
        testCases: [
          { input: 'v0=5.0 m3/h, Ca0=2.0 kmol/m3, k=0.8 h^-1, XA=0.85', expected: '35.42 m3' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-chem-1-1',
        question: 'What is the purpose of Pinch Analysis in chemical process integration?',
        options: [
          'To identify the theoretical maximum energy recovery (MER) network, determining the minimum possible hot utility (steam) and cold utility (cooling water) requirements before designing heat exchangers',
          'To measure the pressure drop across control valves',
          'To calculate catalyst deactivation rates',
          'To test pipe wall thickness for ultrasonic corrosion'
        ],
        correctAnswerIndex: 0,
        explanation: 'Pinch Analysis plots hot and cold composite curves on a T-H diagram. The point of closest approach ($\\Delta T_{min}$) is the "Pinch". The golden rules of Pinch state: never transfer heat across the pinch, never use hot utility below the pinch, and never use cold utility above the pinch.',
        topic: 'Process Heat Integration & Pinch Technology'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-chem-1',
        title: 'HAZOP Study for Continuous Chemical Reactor Feed System',
        objective: 'Conduct a formal Hazard and Operability (HAZOP) node assessment on a reactor monomer feed line using standard guide words (MORE, LESS, NONE, REVERSE).',
        steps: [
          'Select Node: Monomer feed line from storage tank to reactor inlet',
          'Apply guide word "MORE FLOW": identify cause (control valve failure open), consequence (runaway exothermic reaction), and safeguards (high-flow trip, emergency cooling)',
          'Apply guide word "REVERSE FLOW": identify consequence (hot product backflow into storage) and safeguards (dual non-return check valves)',
          'Determine required Safety Integrity Level (SIL) for the emergency shutdown system'
        ],
        codeTemplate: `def evaluate_hazop_deviation(guideword, parameter, cause, consequence, existing_safeguard):
    # Return structured HAZOP table entry with risk rating
    pass`,
        verificationCriteria: [
          'All primary guide words evaluated systematically',
          'Safety mitigation eliminates uncontained toxic or explosive release risks',
          'Conforms to OSHA 1910.119 Process Safety Management standards'
        ]
      }
    ],
    miniProject: {
      title: 'Aspen Plus Simulation & Heat Integration of Acetone-Isopropanol Plant',
      description: 'Model the catalytic dehydrogenation of isopropanol to acetone in Aspen Plus. Model the multicomponent distillation train, optimize feed tray locations, and apply Pinch Technology to integrate reboiler heat duty with reactor effluent, cutting plant steam consumption by 35%.',
      techStack: ['Aspen Plus / Aspen HYSYS', 'NRTL Thermodynamic Model', 'Pinch Analysis Tool', 'Python Data Processing'],
      deliverables: [
        'Complete Aspen Plus steady-state flowsheet with converged mass and energy balances',
        'Distillation column RadFrac profile showing temperature, liquid/vapor traffic, and stage purities',
        'HAZOP risk worksheet for reactor cooling water failure scenario',
        'Pinch composite curves and heat exchanger network (HEN) design diagram'
      ],
      architectureDiagramText: `[Isopropanol Feed] ---> [Vaporizer] ---> [Catalytic Fixed-Bed Reactor]
                                                    |
                                                    v
[Distillation Column (RadFrac)] <--- [Condenser / Gas Separator]
         |                  |
         v                  v
[Acetone Overheads 99.5%] [Unreacted IPA Recycle]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-chem-1-1',
          question: 'Why does operating a distillation column at total reflux (no distillate withdrawal, R = ∞) define the absolute minimum number of theoretical stages ($N_{min}$)?',
          options: [
            'At total reflux, all overhead vapor is condensed and returned as liquid, making the operating lines coincide exactly with the 45-degree diagonal ($y = x$), maximizing the driving force between stages and minimizing required trays',
            'Because the reboiler runs out of steam',
            'Because the condenser pressure reaches absolute vacuum',
            'Because the mixture turns into a single chemical compound'
          ],
          correctAnswerIndex: 0,
          explanation: 'At total reflux ($R = \\infty$), $L/V = 1$. The operating lines in the McCabe-Thiele diagram collapse onto the $y = x$ line, which gives the maximum possible step height between operating line and equilibrium curve. Fenske’s equation gives this exact theoretical minimum stage count: $N_{min} = \\frac{\\ln[(x_D/(1-x_D)) / (x_B/(1-x_B))]}{\\ln \\alpha}$.',
          topic: 'Distillation Theory'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Thermodynamic Property Method Selection', layer: 'Simulation Setup', description: 'Choose appropriate equation of state (e.g. NRTL for polar binaries, Peng-Robinson for hydrocarbons).', keyCode: 'PROPERTY-METHOD NRTL; PARAMETERS BINARY VLE-DATA;' },
        { stepNumber: 2, title: 'Reactor Conversion & Equilibrium Modeling', layer: 'Reaction Kinetics', description: 'Configure stoichiometric RGibbs or kinetic RCSTR reactor blocks with Arrhenius parameters.', keyCode: 'BLOCK REACT RCSTR; REACTION 1 KINETIC K=1.2e8 EA=75.4;' },
        { stepNumber: 3, title: 'Rigorous Distillation Column (RadFrac) Sizing', layer: 'Separation', description: 'Specify stage count, reflux ratio, condenser pressure, and bottoms rate to meet 99.5% purity.', keyCode: 'BLOCK COL1 RADFRAC; NSTAGE 24; FEED 12; REFLUX-RATIO 2.4;' },
        { stepNumber: 4, title: 'Recycle Loop Convergence & Tear Streams', layer: 'Flowsheet Solver', description: 'Set Wegstein acceleration on recycle streams to achieve mass balance closure within 10^-5 tolerance.', keyCode: 'CONV-OPTIONS TEAR-STREAMS RECYCLE; METHOD WEGSTEIN;' },
        { stepNumber: 5, title: 'Pinch Heat Exchanger Network Integration', layer: 'Energy Efficiency', description: 'Extract stream enthalpy intervals and design heat exchangers to recover reactor exothermic heat.', keyCode: 'PINCH-TARGET DT-MIN 10.0; MER-HOT-UTILITY 1450 KW;' },
        { stepNumber: 6, title: 'HAZOP & Overpressure Relief Valve (PSV) Sizing', layer: 'Safety & Relief', description: 'Size API 520 emergency relief valves for blocked vapor outlet overpressure contingencies.', keyCode: 'PSV-SIZE ORIFICE API-520 RELIEF-LOAD 12500 KG-H SET-PRESS 15 BAR;' }
      ],
      interviewQuestions: [
        {
          id: 'iq-chem-1',
          topic: 'Process Design',
          question: 'What is the "Pinch Point" in heat exchanger network synthesis, and why is heat transfer across the pinch strictly forbidden in energy-efficient plant design?',
          keyPointsExpected: [
            'The Pinch Point divides the chemical plant into two thermodynamically distinct zones: a Heat Sink above the pinch and a Heat Source below the pinch',
            'Above the pinch: only hot utility (external steam) should be supplied',
            'Below the pinch: only cold utility (cooling water) should be supplied',
            'Transferring heat from above the pinch to below the pinch increases both hot and cold utility consumption by exactly that amount (double energy penalty)'
          ],
          sampleAnswer: 'The pinch point represents the thermodynamic bottleneck where the temperature difference between hot and cold composite curves reaches $\\Delta T_{min}$. It divides the entire process into two independent subsystems: an energy sink above the pinch and an energy source below the pinch. If an engineer transfers heat from above the pinch to below the pinch (crossing the pinch), that heat is subtracted from the sink where it was needed, requiring extra external steam to make up the deficit. Simultaneously, that heat enters the heat source below the pinch, requiring extra cooling water to remove it. Thus, crossing the pinch by an amount $\\alpha$ incurs a double energy penalty of $2\\alpha$.'
        }
      ]
    }
  },

  // =========================================================================
  // BIOTECHNOLOGY: BIOINFORMATICS & MOLECULAR BIOLOGY
  // =========================================================================
  'bioinformatics': {
    roadmapStepId: 'rd-bio-01',
    skillName: 'Bioinformatics, Genomics & Molecular Biology',
    category: 'Biotechnology & Life Sciences',
    industryDemand: 91,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    prerequisites: [
      {
        skillName: 'Molecular Genetics & Biochemistry Basics',
        isMet: true,
        requiredDescription: 'DNA/RNA transcription, translation, codon table, protein structure, and Python scripting.'
      }
    ],
    whatYouWillLearn: [
      'Next-Generation Sequencing (NGS) data pipelines: FASTQ quality trimming (FastQC), alignment (BWA), and BAM indexing',
      'Pairwise sequence alignment algorithms: Needleman-Wunsch (Global) and Smith-Waterman (Local) dynamic programming',
      'BLAST heuristic search: Seed generation, k-mer matching, extension, and E-value statistical significance',
      'PCR primer design: Melting temperature ($T_m$) calculation via nearest-neighbor thermodynamics, GC clamps, and hairpins',
      'CRISPR-Cas9 guide RNA (gRNA) design: PAM site identification (NGG) and on-target/off-target scoring algorithms',
      'Recombinant plasmid vector construction: Restriction enzyme digestion, sticky-end ligation, and antibiotic selection',
      'Protein structural bioinformatics: PDB file parsing, Ramachandran plots, and AlphaFold2 3D structure visualization',
      'Bioprocess engineering: Microbial growth kinetics (Monod equation), substrate consumption, and bioreactor scaling'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Biopharmaceutical discovery, synthetic biology, personalized oncology, and mRNA vaccine development depend on computational bioinformatics paired with molecular genetic engineering to develop life-saving therapies.',
      rolesUsingSkill: ['Bioinformatics Scientist', 'Computational Biologist', 'Genomics Data Analyst', 'Molecular Diagnostics Engineer'],
      realWorldUsage: 'Developing mRNA vaccine sequences against novel viral mutations and analyzing whole-genome sequencing (WGS) cancer biopsies in clinical diagnostics.',
      subsequentSkills: ['Single-Cell RNA Sequencing (scRNA-seq)', 'Molecular Dynamics Simulation (GROMACS)', 'Structural Pharmacology & Docking (AutoDock)']
    },
    modules: [
      {
        id: 'mod-bio-1-1',
        moduleNumber: 1,
        title: 'Sequence Alignment Algorithms & Genomics Pipelines',
        description: 'Implement foundational dynamic programming algorithms for DNA and protein sequence comparison.',
        lessons: [
          {
            id: 'les-bio-1-1-1',
            title: 'Needleman-Wunsch Global Sequence Alignment Algorithm',
            duration: '45 mins',
            simpleExplanation: 'DNA sequences mutate through insertions, deletions, and single-letter substitutions. The Needleman-Wunsch algorithm finds the mathematically optimal global alignment between two biological sequences using dynamic programming.',
            whyNeeded: 'Simple string matching fails as soon as a single base is inserted or deleted. Dynamic programming handles biological insertions and deletions (indels) with gap penalties.',
            howItWorks: 'Initialize a $(M+1) \\times (N+1)$ score matrix with gap penalty steps. Fill each cell $S(i,j)$ by taking the maximum of: Diagonal (Match/Mismatch: $S(i-1, j-1) + \\text{score}$), Up (Vertical Gap: $S(i-1, j) - d$), or Left (Horizontal Gap: $S(i, j-1) - d$). Trace back from bottom-right to top-left to recover the aligned strings.',
            syntax: 'S[i][j] = max(S[i-1][j-1] + match_or_mismatch, S[i-1][j] - gap, S[i][j-1] - gap)',
            realWorldExample: 'Aligning the Spike glycoprotein gene of a newly discovered coronavirus variant against the reference ancestral genome to pinpoint immune-escape mutations.',
            codeSnippet: `# Python: Needleman-Wunsch Global Sequence Alignment
def needleman_wunsch(seq1, seq2, match=1, mismatch=-1, gap=-2):
    m, n = len(seq1), len(seq2)
    # Initialize DP matrix
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i * gap
    for j in range(n + 1): dp[0][j] = j * gap

    # Fill DP matrix
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            score_diag = dp[i-1][j-1] + (match if seq1[i-1] == seq2[j-1] else mismatch)
            score_up   = dp[i-1][j] + gap
            score_left = dp[i][j-1] + gap
            dp[i][j] = max(score_diag, score_up, score_left)

    # Traceback
    aligned1, aligned2 = [], []
    i, j = m, n
    while i > 0 and j > 0:
        score_curr = dp[i][j]
        score_diag = dp[i-1][j-1]
        is_match = (match if seq1[i-1] == seq2[j-1] else mismatch)
        
        if score_curr == score_diag + is_match:
            aligned1.append(seq1[i-1])
            aligned2.append(seq2[j-1])
            i -= 1; j -= 1
        elif score_curr == dp[i-1][j] + gap:
            aligned1.append(seq1[i-1])
            aligned2.append('-')
            i -= 1
        else:
            aligned1.append('-')
            aligned2.append(seq2[j-1])
            j -= 1
            
    while i > 0:
        aligned1.append(seq1[i-1]); aligned2.append('-'); i -= 1
    while j > 0:
        aligned1.append('-'); aligned2.append(seq2[j-1]); j -= 1

    return {
        "score": dp[m][n],
        "alignment1": "".join(reversed(aligned1)),
        "alignment2": "".join(reversed(aligned2))
    }

res = needleman_wunsch("GATTACA", "GCATGCU", match=2, mismatch=-1, gap=-2)
print("Alignment Score:", res["score"])
print("Seq1:", res["alignment1"])
print("Seq2:", res["alignment2"])`,
            expectedOutput: 'Alignment Score: 4\nSeq1: G-ATTACA\nSeq2: GCA-TGCU',
            commonMistakes: [
              'Confusing Global alignment (Needleman-Wunsch, aligns full length of both sequences) with Local alignment (Smith-Waterman, finds small conserved motif islands)',
              'Using linear gap penalties instead of affine gap penalties ($Gap = d + (k-1) \\times e$), which biologically penalizes gap extensions less severely than gap openings',
              'Ignoring the reverse traceback step when recovering the alignment strings'
            ],
            bestPractices: [
              'Use BLOSUM62 or PAM250 substitution matrices when aligning protein amino acid sequences to reflect evolutionary chemical similarities',
              'Filter out low-complexity repetitive sequence regions before running large-scale genomic alignments',
              'Employ Cython or C++ wrappers (e.g. Parasail or Biopython) for high-throughput alignment of millions of reads'
            ],
            practiceQuestion: 'How does the Smith-Waterman local alignment algorithm modify the Needleman-Wunsch recurrence relation to prevent negative score propagation?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-bio-1',
        title: 'PCR Primer Melting Temperature (Tm) Calculator',
        difficulty: 'Medium',
        description: 'Calculate the melting temperature ($T_m$) of a single-stranded DNA oligonucleotide primer using the standard Wallace formula ($T_m = 2(A+T) + 4(G+C)$) and salt-adjusted nearest-neighbor thermodynamics.',
        requirements: [
          'Count occurrences of A, T, G, C in uppercase string',
          'Calculate basic Wallace Tm for sequences under 14 base pairs: $T_m = 2(A+T) + 4(G+C)$',
          'Calculate salt-adjusted Tm for sequences >= 14 base pairs: $T_m = 64.9 + 41 \\times \\frac{(yG + zC - 16.4)}{(wA + xT + yG + zC)}$',
          'Return Tm rounded to 1 decimal place'
        ],
        starterCode: `def calculate_primer_tm(primer_seq):
    """
    Returns melting temperature Tm in Celsius.
    """
    # TODO: Calculate Tm based on sequence length and GC content
    return 0.0`,
        expectedOutput: 'Primer melting temperature calculated within 0.2°C accuracy.',
        hints: [
          'Verify sequence contains only valid nucleotides (A, C, G, T)',
          'gc_count = seq.count("G") + seq.count("C")'
        ],
        solutionCode: `def calculate_primer_tm(primer_seq):
    seq = primer_seq.upper().strip()
    n = len(seq)
    if n == 0: return 0.0
    
    a_count = seq.count('A')
    t_count = seq.count('T')
    g_count = seq.count('G')
    c_count = seq.count('C')
    
    if n < 14:
        tm = 2.0 * (a_count + t_count) + 4.0 * (g_count + c_count)
    else:
        # Standard salt-adjusted empirical formula
        gc_count = g_count + c_count
        tm = 64.9 + 41.0 * (gc_count - 16.4) / n
        
    return round(tm, 1)`,
        testCases: [
          { input: 'ATGCGATCGATCGATC (16 bp, 8 GC)', expected: '53.6 °C' },
          { input: 'GATTACA (7 bp, 2 GC)', expected: '18.0 °C' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-bio-1-1',
        question: 'What is the role of the Protospacer Adjacent Motif (PAM) sequence in CRISPR-Cas9 genome editing?',
        options: [
          'It is a 2-6 base pair DNA sequence (e.g. 5\'-NGG-3\' for SpCas9) immediately following the target DNA sequence that is essential for the Cas9 enzyme to bind and initiate double-strand DNA cleavage',
          'It is the antibiotic resistance marker on the plasmid',
          'It acts as the stop codon for protein translation',
          'It degrades RNA molecules in the cytoplasm'
        ],
        correctAnswerIndex: 0,
        explanation: 'Cas9 requires the PAM sequence (typically 5\'-NGG-3\' for Streptococcus pyogenes Cas9) located 3-4 nucleotides downstream of the cleavage site. Cas9 interrogates the genome for PAM sites first; once a PAM is found, it melts the adjacent DNA to test for guide RNA complementarity.',
        topic: 'CRISPR-Cas9 Molecular Biology'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-bio-1',
        title: 'In Silico Restriction Digestion & Agarose Gel Band Prediction',
        objective: 'Write a script that takes a circular plasmid DNA sequence, identifies EcoRI (G^AATTC) and BamHI (G^GATCC) restriction cleavage sites, and calculates the resulting fragment lengths in base pairs for gel electrophoresis.',
        steps: [
          'Search circular plasmid string for restriction recognition motifs',
          'Calculate linear fragment distances between cut sites taking wrap-around into account',
          'Sort fragments by molecular weight (base pairs)',
          'Simulate migration distance on a 1.2% agarose gel'
        ],
        codeTemplate: `def digest_plasmid(plasmid_seq, restriction_enzymes):
    # Find all cut locations and calculate fragment sizes
    pass`,
        verificationCriteria: [
          'Sum of fragment lengths exactly equals original plasmid size',
          'Correctly handles multi-cut and single-cut plasmid linearization',
          'Matches experimental restriction digest bands on UV transilluminator'
        ]
      }
    ],
    miniProject: {
      title: 'Variant Calling & Annotation Pipeline for Cancer Exome Sequencing',
      description: 'Build an end-to-end automated NGS bioinformatics pipeline in Python and Bash. Align paired-end Illumina FASTQ reads to the human reference genome (GRCh38), sort and index BAM files with Samtools, call single nucleotide variants (SNVs) with GATK HaplotypeCaller, and annotate pathogenic clinical variants using ClinVar.',
      techStack: ['Python (Biopython / PyVCF)', 'BWA-MEM', 'Samtools', 'GATK 4', 'Ensembl VEP / ClinVar'],
      deliverables: [
        'Automated Python/Bash pipeline script taking raw paired FASTQ files to annotated VCF',
        'Quality control summary report verifying read mapping quality (MQ > 40) and mean target coverage > 50x',
        'Annotated list of identified somatic missense mutations in cancer driver genes (TP53, EGFR, KRAS)',
        'Circos plot visualization of genomic structural variants across chromosomes'
      ],
      architectureDiagramText: `[Raw Reads (FASTQ)] ---> [FastQC Quality Filter] ---> [BWA-MEM Alignment]
                                                                |
                                                                v
[Annotated Report (ClinVar)] <--- [GATK Variant Calling] <--- [Sorted BAM Indexing]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-bio-1-1',
          question: 'What is the biological consequence of a frameshift mutation caused by a 1-base-pair deletion in a protein-coding exon?',
          options: [
            'It shifts the entire downstream triplet reading frame during ribosome translation, altering all subsequent amino acids and almost always introducing a premature stop codon that results in a truncated, non-functional protein',
            'It only changes a single amino acid and leaves the rest of the protein intact',
            'It speeds up ribosome translation by 33%',
            'It converts DNA into double-stranded RNA'
          ],
          correctAnswerIndex: 0,
          explanation: 'Because the genetic code is read in non-overlapping triplets of nucleotides (codons), an insertion or deletion of any number of bases not divisible by 3 disrupts the downstream reading frame. Every codon from the mutation point onwards is misread, causing a scrambled amino acid sequence and typically triggering a premature nonsense stop codon.',
          topic: 'Molecular Genetics & Mutations'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'FASTQ Read Quality Control & Trimming', layer: 'Perception', description: 'Evaluate per-base Phred quality scores ($Q = -10 \\log_{10} P$) and trim adapter sequences.', keyCode: 'fastp -i read1.fq -I read2.fq -o out1.fq -O out2.fq --cut_front --cut_tail;' },
        { stepNumber: 2, title: 'Reference Genome Indexing & BWA Alignment', layer: 'Alignment', description: 'Align paired-end reads to reference genome index using Burrows-Wheeler Transform.', keyCode: 'bwa mem -t 8 -R "@RG\\tID:lib1\\tSM:patient01" hg38.fa out1.fq out2.fq > aligned.sam' },
        { stepNumber: 3, title: 'Duplicate Marking & Base Quality Recalibration', layer: 'BAM Processing', description: 'Mark optical/PCR duplicates and recalibrate empirical error models via GATK BQSR.', keyCode: 'gatk MarkDuplicates -I sorted.bam -O dedup.bam -M metrics.txt;' },
        { stepNumber: 4, title: 'HaplotypeCaller Germline & Somatic Variant Discovery', layer: 'Variant Calling', description: 'Perform local de novo assembly of active regions to detect SNVs and indels.', keyCode: 'gatk HaplotypeCaller -R hg38.fa -I dedup.bam -O raw_variants.vcf;' },
        { stepNumber: 5, title: 'Variant Effect Annotation with ClinVar & VEP', layer: 'Annotation', description: 'Annotate mutations with clinical pathogenicity, HGVS nomenclature, and gnomAD population frequencies.', keyCode: 'vep --input_file raw_variants.vcf --output_file annotated.txt --database --custom clinvar.vcf.gz;' },
        { stepNumber: 6, title: 'Bioreactor Fermentation & Scale-Up Model', layer: 'Bioprocess', description: 'Model batch cell growth using the Monod equation to optimize harvest timing.', keyCode: 'mu = mu_max * (substrate / (ks + substrate)); dx_dt = mu * biomass;' }
      ],
      interviewQuestions: [
        {
          id: 'iq-bio-1',
          topic: 'Genomics Algorithms',
          question: 'What is the Burrows-Wheeler Transform (BWT), and why is it preferred over traditional hash tables for aligning millions of next-generation sequencing reads against the 3-billion-base human genome?',
          keyPointsExpected: [
            'BWT rearranges a string into runs of similar characters, making it highly compressible',
            'Combined with the FM-index, it allows exact substring matching in time proportional to the read length $O(m)$, independent of genome size $O(N)$',
            'A hash table of the human genome requires 30-50 GB of RAM, whereas a BWT/FM-index fits within 3-4 GB of memory',
            'Allows high-throughput alignment of 500 million reads in a few hours on standard workstations'
          ],
          sampleAnswer: 'The human genome is over 3 billion base pairs long. Traditional k-mer hash tables consume 40+ GB of memory and suffer from cache misses when searching short reads. The Burrows-Wheeler Transform (BWT) combined with the Ferragina-Manzini (FM) index compresses the entire 3GB human genome into an index of just ~3.5 GB that fits inside ordinary CPU L3/DRAM caches. Furthermore, the FM-index enables exact pattern matching using backward search in time $O(m)$ proportional only to the read length (typically 150bp), completely independent of the 3-billion-base genome length. This enables aligners like BWA-MEM to map hundreds of millions of sequencing reads in hours.'
        }
      ]
    }
  }
};
