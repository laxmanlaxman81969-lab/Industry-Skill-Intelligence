import { SkillCurriculum } from '../roadmapCurriculumData';

export const EEE_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // EEE 1: POWER SYSTEMS ANALYSIS & GRID ARCHITECTURE
  // =========================================================================
  'power-systems': {
    roadmapStepId: 'rd-eee-01',
    skillName: 'Power Systems Analysis & Smart Grid Engineering',
    category: 'Electrical Power',
    industryDemand: 91,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 34,
    prerequisites: [
      {
        skillName: 'Circuit Theory & AC Network Analysis',
        isMet: true,
        requiredDescription: 'Phasor calculus, 3-phase star/delta relationships, active (P), reactive (Q), and apparent power (S).'
      }
    ],
    whatYouWillLearn: [
      'Per-unit system normalization for multi-voltage transformer networks',
      'Formulating the Bus Admittance Matrix ($Y_{bus}$) using singular transformation',
      'Solving nonlinear Power Flow equations via Newton-Raphson and Fast Decoupled methods',
      'Symmetrical Components ($I_{a0}, I_{a1}, I_{a2}$) and Sequence Network modeling',
      'Short-circuit fault calculations: 3-phase symmetrical, Line-to-Ground (LG), and Double-Line (LL) faults',
      'Transmission line parameters: Ferranti effect, surge impedance loading (SIL), and reactive compensation (FACTS)',
      'Digital protection systems: Inverse Definite Minimum Time (IDMT) relays and distance zone mho characteristics',
      'Smart grid integration: Phasor Measurement Units (PMUs), Wide-Area Monitoring (WAMS), and SCADA protocols (IEC 61850)'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Modern power grids are undergoing massive decarbonization, incorporating high penetrations of solar PV, offshore wind, and battery storage. Power system engineers ensure blackout-free stability, frequency regulation, and fault isolation.',
      rolesUsingSkill: ['Power Systems Engineer', 'Grid Operations Analyst', 'Substation Automation Engineer', 'Renewable Integration Specialist'],
      realWorldUsage: 'Running real-time N-1 contingency studies in national load dispatch centers and modeling renewable interconnects in ETAP and PSCAD.',
      subsequentSkills: ['Renewable Energy Interconnection (IEEE 1547)', 'ETAP / DigSILENT Power Simulation', 'High-Voltage Direct Current (HVDC) Transmission']
    },
    modules: [
      {
        id: 'mod-eee-1-1',
        moduleNumber: 1,
        title: 'Network Modeling, Per-Unit Systems & Bus Admittance Matrix',
        description: 'Normalize complex electrical grids into per-unit quantities and formulate nodal admittance matrices for computational analysis.',
        lessons: [
          {
            id: 'les-eee-1-1-1',
            title: 'The Per-Unit System in Multi-Voltage Power Networks',
            duration: '45 mins',
            simpleExplanation: 'Instead of dealing with hundreds of thousands of volts and amperes across dozens of transformer step-ups and step-downs, the Per-Unit (pu) system normalizes all electrical parameters relative to standard base MVA and base voltage levels.',
            whyNeeded: 'Transformers change voltages throughout a power grid. Per-unit modeling eliminates ideal transformer turns ratios ($N_1/N_2$) from equations, converting the multi-voltage grid into a simple unified single-line impedance network.',
            howItWorks: 'Choose $S_{base}$ (e.g. 100 MVA) for the entire system and $V_{base}$ for each voltage zone separated by transformers. Base current is $I_{base} = \\frac{S_{base}}{\\sqrt{3} V_{base}}$ and base impedance is $Z_{base} = \\frac{(V_{base})^2}{S_{base}}$. The per-unit value is simply $Z_{pu} = \\frac{Z_{actual}}{Z_{base}}$.',
            syntax: 'Z_pu_new = Z_pu_old * (V_base_old / V_base_new)^2 * (S_base_new / S_base_old)',
            realWorldExample: 'A 500 kV transmission line feeding a 132 kV regional substation and a 33 kV distribution network uses a single 100 MVA base, allowing engineers to trace faults across all three zones seamlessly.',
            codeSnippet: `# Python: Convert Transformer Impedance to Common System Base
def change_base(z_old_pu, v_old_kv, v_new_kv, s_old_mva, s_new_mva):
    """Converts per-unit impedance from equipment rating to system common base."""
    z_new_pu = z_old_pu * ((v_old_kv / v_new_kv) ** 2) * (s_new_mva / s_old_mva)
    return complex(z_new_pu.real, z_new_pu.imag)

# Example: Transformer rated 25 MVA, 13.8/138 kV with 8% reactance (j0.08 pu)
# Convert to System Base: 100 MVA, 138 kV on high-voltage side
z_old = complex(0.01, 0.08) # 1% resistance, 8% reactance
z_sys_base = change_base(z_old, v_old_kv=138.0, v_new_kv=138.0, s_old_mva=25.0, s_new_mva=100.0)

print(f"System Base Impedance: {z_sys_base.real:.4f} + j{z_sys_base.imag:.4f} pu")`,
            expectedOutput: 'System Base Impedance: 0.0400 + j0.3200 pu',
            commonMistakes: [
              'Forgetting that line-to-line kV base must match the transformer secondary rating in that specific physical zone',
              'Using single-phase formulas without the $\\sqrt{3}$ factor for 3-phase apparent power ($S = \\sqrt{3} V_L I_L$)',
              'Squaring MVA instead of squaring kV when calculating base impedance ($Z_b = V^2 / S$)'
            ],
            bestPractices: [
              'Standardize on 100 MVA system base across all utility transmission grid studies',
              'Always keep track of resistance-to-reactance ($R/X$) ratios when scaling impedances',
              'Verify that transformer off-nominal tap ratios ($t:1$) are handled using $\\pi$-model equivalents'
            ],
            practiceQuestion: 'A 3-phase generator rated 18 kV, 500 MVA has a subtransient reactance of 0.20 pu. Calculate its per-unit reactance on a system base of 20 kV, 100 MVA.'
          },
          {
            id: 'les-eee-1-1-2',
            title: 'Newton-Raphson Power Flow Formulation & Bus Types',
            duration: '50 mins',
            simpleExplanation: 'Power flow calculation determines the precise voltage magnitude, phase angle, active power (MW), and reactive power (MVAR) at every substation bus under peak operating loads.',
            whyNeeded: 'Electric utilities must ensure that no transmission line is overloaded and that customer voltages stay strictly within statutory limits (e.g. ±5% of nominal 230V/400V).',
            howItWorks: 'Buses are categorized into Slack Bus ($V, \\delta$ specified), PV Bus (Generator bus: $P, V$ specified), and PQ Bus (Load bus: $P, Q$ specified). The Jacobian matrix of partial derivatives relates power mismatches $(\\Delta P, \\Delta Q)$ to voltage angle and magnitude corrections $(\\Delta \\delta, \\Delta |V|)$.',
            syntax: '[Delta_P; Delta_Q] = [J11, J12; J21, J22] * [Delta_delta; Delta_V / V]',
            realWorldExample: 'During summer heatwaves when air conditioning surges in urban centers, grid operators run Newton-Raphson power flow every 5 minutes to dispatch capacitor banks and prevent voltage collapse.',
            codeSnippet: `import numpy as np

def build_ybus(num_buses, line_data):
    """
    line_data: list of tuples (from_bus, to_bus, series_impedance_z, shunt_admittance_y)
    Returns complex Y_bus admittance matrix.
    """
    Y = np.zeros((num_buses, num_buses), dtype=complex)
    for fb, tb, z_series, y_shunt in line_data:
        y_ser = 1.0 / z_series
        # Off-diagonal elements: -y_series
        Y[fb-1, tb-1] -= y_ser
        Y[tb-1, fb-1] -= y_ser
        # Diagonal elements: sum of connected series and half shunt admittances
        Y[fb-1, fb-1] += y_ser + (y_shunt / 2.0)
        Y[tb-1, tb-1] += y_ser + (y_shunt / 2.0)
    return Y

# Example 3-Bus Grid
lines = [
    (1, 2, complex(0.02, 0.06), complex(0, 0.04)),
    (2, 3, complex(0.01, 0.04), complex(0, 0.03)),
    (1, 3, complex(0.015, 0.05), complex(0, 0.035))
]
Ybus = build_ybus(3, lines)
print("Bus 1-1 Self Admittance:", np.round(Ybus[0,0], 2))`,
            expectedOutput: 'Bus 1-1 Self Admittance: (10.98-32.93j)',
            commonMistakes: [
              'Treating PV generator buses as PQ buses, which prevents the solver from adjusting reactive power to maintain target voltage',
              'Ignoring reactive power generation limits ($Q_{min}, Q_{max}$); if a generator hits its MVAR limit, it must be switched to a PQ bus',
              'Inverting the sign of off-diagonal elements in $Y_{bus}$ ($Y_{ij} = -y_{ij}$ for $i \\ne j$)'
            ],
            bestPractices: [
              'Use Fast Decoupled Load Flow for high-voltage transmission lines where $R \\ll X$',
              'Check for voltage collapse proximity by monitoring the minimum singular value of the power flow Jacobian',
              'Apply sparse matrix solvers (e.g. Scipy CSC sparse) for large industrial grids containing 1,000+ buses'
            ],
            practiceQuestion: 'Why is a Slack (Reference) Bus mandatory in power flow calculations, and why cannot all buses simply be specified as PQ or PV buses?'
          }
        ]
      },
      {
        id: 'mod-eee-1-2',
        moduleNumber: 2,
        title: 'Fault Analysis, Symmetrical Components & Protection Coordination',
        description: 'Analyze short circuits and coordinate protective circuit breakers and numerical relays.',
        lessons: [
          {
            id: 'les-eee-1-2-1',
            title: 'Symmetrical Components & Single Line-to-Ground (LG) Faults',
            duration: '50 mins',
            simpleExplanation: 'Any unbalanced three-phase set of currents or voltages can be broken down into three symmetrical balanced sets: Positive Sequence (same rotation ABC), Negative Sequence (reversed rotation ACB), and Zero Sequence (identical in phase).',
            whyNeeded: 'Over 85% of real-world power grid faults are single line-to-ground (tree branch touching one conductor). Symmetrical components transform this asymmetric geometry into three decoupled single-phase circuits.',
            howItWorks: 'The transformation matrix $A = \\begin{bmatrix} 1 & 1 & 1 \\\\ 1 & a^2 & a \\\\ 1 & a & a^2 \\end{bmatrix}$ where $a = 1\\angle 120^\\circ$. For a Single Line-to-Ground fault on phase A, the three sequence networks (positive, negative, zero) are connected in series.',
            syntax: 'I_a0 = I_a1 = I_a2 = V_f / (Z1 + Z2 + Z0 + 3*Z_f)',
            realWorldExample: 'A lightning strike flashes over an insulator on a 132 kV overhead tower; zero-sequence current flows through the earth return path back to the grounded star neutral of the generator transformer.',
            codeSnippet: `# Symmetrical Component Fault Current Calculation
import cmath

# Operator a = e^(j * 2*pi / 3) = -0.5 + j0.866
a = cmath.rect(1.0, 2 * cmath.pi / 3)

def solve_lg_fault(vf_pu, z1, z2, z0, z_fault=0):
    """Calculates fault current for Phase-A to Ground fault."""
    # In LG fault, sequence currents are equal and networks are in series
    i_seq = vf_pu / (z1 + z2 + z0 + 3 * z_fault)
    i_a0 = i_seq
    i_a1 = i_seq
    i_a2 = i_seq
    
    # Reconstruct Phase Currents: [Ia, Ib, Ic]
    i_a = i_a0 + i_a1 + i_a2
    i_b = i_a0 + (a**2) * i_a1 + a * i_a2
    i_c = i_a0 + a * i_a1 + (a**2) * i_a2
    return i_a, i_b, i_c

# Sequence impedances of system (typical generator + line values)
Z1 = complex(0, 0.25) # Positive sequence
Z2 = complex(0, 0.25) # Negative sequence
Z0 = complex(0, 0.50) # Zero sequence (higher due to ground return path)
V_prefault = complex(1.0, 0) # 1.0 pu

ia, ib, ic = solve_lg_fault(V_prefault, Z1, Z2, Z0)
print(f"Fault Current Phase A: {abs(ia):.2f} pu, Phase B: {abs(ib):.2f} pu, Phase C: {abs(ic):.2f} pu")`,
            expectedOutput: 'Fault Current Phase A: 3.00 pu, Phase B: 0.00 pu, Phase C: 0.00 pu',
            commonMistakes: [
              'Assuming zero-sequence impedance ($Z_0$) equals positive-sequence impedance ($Z_1$); zero-sequence paths depend heavily on transformer grounding and earth return paths',
              'Forgetting that delta-wye transformers block zero-sequence currents from passing into the delta side',
              'Neglecting the factor of $3 Z_f$ in the sequence loop for line-to-ground faults'
            ],
            bestPractices: [
              'Solidly ground transformer neutrals in high-voltage grids to limit overvoltages during ground faults',
              'Use negative-sequence overcurrent relays (ANSI 46) to protect turbine generators from rotor overheating caused by unbalanced phase currents',
              'Always determine the maximum available symmetrical short-circuit MVA when sizing circuit breaker breaking capacity'
            ],
            practiceQuestion: 'Draw the interconnection of positive, negative, and zero sequence networks for a Double Line-to-Ground (LLG) fault.'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-eee-1',
        title: 'IDMT Overcurrent Relay Tripping Time Calculation',
        difficulty: 'Medium',
        description: 'Implement the standard IEC 60255-151 IDMT (Inverse Definite Minimum Time) Standard Inverse relay trip equation used in substation protection coordination.',
        requirements: [
          'IEC Standard Inverse formula: $t = TMS \\times \\frac{0.14}{(I / I_s)^{0.02} - 1}$',
          'Handle Plug Setting Multiplier (PSM) calculations: $PSM = I_{fault} / (CT_{ratio} \\times I_{plug})$',
          'Reject tripping if current is below pickup threshold ($PSM \\le 1.0$)'
        ],
        starterCode: `def calculate_idmt_trip_time(fault_current_amps, ct_primary, ct_secondary, plug_setting_amps, tms):
    """
    Returns trip time in seconds according to IEC 60255 Standard Inverse curve.
    Returns float('inf') if current is below pickup.
    """
    # TODO: Calculate PSM and IEC trip time
    return 0.0`,
        expectedOutput: 'Accurate trip time calculated in seconds within 0.1% tolerance.',
        hints: [
          'CT ratio = ct_primary / ct_secondary',
          'Secondary current = fault_current_amps / (ct_primary / ct_secondary)',
          'PSM = Secondary current / plug_setting_amps',
          'If PSM <= 1.0, return float("inf")'
        ],
        solutionCode: `def calculate_idmt_trip_time(fault_current_amps, ct_primary, ct_secondary, plug_setting_amps, tms):
    ct_ratio = ct_primary / ct_secondary
    i_sec = fault_current_amps / ct_ratio
    psm = i_sec / plug_setting_amps
    
    if psm <= 1.0:
        return float('inf') # Below pickup threshold
        
    # IEC 60255-151 Standard Inverse Characteristic
    trip_time = tms * (0.14 / ((psm ** 0.02) - 1.0))
    return round(trip_time, 3)`,
        testCases: [
          { input: 'fault=4000A, CT=400/5, plug=5A, tms=0.5', expected: 'PSM=10.0, trip_time=1.486 seconds' },
          { input: 'fault=200A, CT=400/5, plug=5A, tms=0.5', expected: 'PSM=0.5 (below pickup), returns inf' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-eee-1-1',
        question: 'What is the Ferranti Effect on long high-voltage transmission lines?',
        options: [
          'The voltage at the receiving end exceeds the sending end voltage under no-load or light-load conditions due to line charging capacitance',
          'The conductors vibrate violently when ambient temperature drops below zero',
          'Transformer core saturation caused by excessive solar geomagnetic storms',
          'Total current drops to zero when active power equals reactive power'
        ],
        correctAnswerIndex: 0,
        explanation: 'On long overhead lines or underground cables, line shunt capacitance draws capacitive charging current through series line inductance. Under no-load, this causes a voltage rise along the line, making receiving-end voltage higher than sending-end voltage.',
        topic: 'Transmission Line Characteristics'
      },
      {
        id: 'qz-eee-1-2',
        question: 'Which sequence currents exist during a balanced three-phase symmetrical fault?',
        options: [
          'Positive sequence only',
          'Positive and Negative sequence',
          'Zero sequence only',
          'All three sequences in equal magnitude'
        ],
        correctAnswerIndex: 0,
        explanation: 'Because a three-phase symmetrical fault is completely balanced, phase angles remain separated by exactly 120° and magnitudes are equal. Hence, negative and zero sequence currents are identically zero ($I_2 = 0, I_0 = 0$).',
        topic: 'Symmetrical Components'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-eee-1',
        title: 'Substation Protection Coordination & Zone Discrimination',
        objective: 'Coordinate two numerical distance relays protecting a 132 kV transmission line with 80% Zone 1 instantaneous trip and 120% Zone 2 delayed trip.',
        steps: [
          'Calculate positive-sequence line impedance per kilometer from conductor spacing and bundle geometry',
          'Set Zone 1 reach to precisely 80% of line impedance with zero time delay (instantaneous 20ms breaker operation)',
          'Set Zone 2 reach to 120% of line impedance with a coordination time interval (CTI) delay of 350ms to coordinate with downstream bus protection',
          'Simulate fault on line midpoint and verify Zone 1 trip without Zone 2 over-reach'
        ],
        codeTemplate: `def configure_distance_relay(line_length_km, z_per_km):
    total_z = line_length_km * z_per_km
    zone1_reach = 0.80 * total_z
    zone2_reach = 1.20 * total_z
    return {"Zone1_Ohms": zone1_reach, "Zone2_Ohms": zone2_reach, "Zone2_Delay_ms": 350}`,
        verificationCriteria: [
          'Zone 1 isolates faults within 80% of line in < 30ms',
          'Zero nuisance tripping for faults located on adjacent transmission feeders',
          'Relay mho characteristic provides stable directional discrimination under power swing conditions'
        ]
      }
    ],
    miniProject: {
      title: 'Solar PV Farm Grid Integration & Reactive Power Compensation System',
      description: 'Model a 50 MW Utility-Scale Solar PV plant interconnected to a 132 kV regional transmission grid. Design a STATCOM / switched capacitor bank system to maintain 0.95 leading/lagging power factor at the Point of Interconnection (POI) during sudden cloud intermittency transients.',
      techStack: ['Python (PyPSA / Pandapower)', 'MATLAB / Simulink', 'IEEE 1547 Grid Codes', 'ETAP Load Flow'],
      deliverables: [
        'Single-line diagram and per-unit impedance network for solar inverter station transformers',
        'Newton-Raphson voltage stability analysis under full 50 MW generation vs 0 MW night state',
        'Automatic Voltage Regulator (AVR) control loop script for PV inverters',
        'Compliance report meeting IEEE 1547 voltage ride-through (VRT) criteria'
      ],
      architectureDiagramText: `[50 MW Solar PV Array] ---> [Central Inverters (0.69 kV)]
                                    |
                                    v
                     [Step-Up Transformer (0.69/33 kV)]
                                    |
                                    v
                     [Main Substation Transformer (33/132 kV)]
                                    |
                       +------------+------------+
                       |                         |
                       v                         v
               [STATCOM 15 MVAR]       [Point of Common Coupling (132 kV Grid)]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-eee-1-1',
          question: 'Why are delta-connected tertiary windings included in large high-voltage wye-wye power transformers?',
          options: [
            'To provide a closed circulating path for third-harmonic zero-sequence currents, preventing voltage distortion and telephone interference',
            'To step down voltage for substation heating and cooling',
            'To reduce the mechanical weight of the transformer iron core',
            'To increase the lightning surge withstand rating of the bushings'
          ],
          correctAnswerIndex: 0,
          explanation: 'Third-harmonic currents are zero-sequence in nature and in-phase across all three phases. A delta tertiary winding provides a circulating loop for these currents, trapping them and preventing severe voltage waveform distortion and ground-neutral shift.',
          topic: 'Transformer Design'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Single-Line Diagram & Per-Unit Base Mapping', layer: 'System Modeling', description: 'Convert all generator ratings, transformer reactances, and line lengths into a unified 100 MVA per-unit model.', keyCode: 'Z_pu = Z_actual * (S_base / (V_base ** 2))' },
        { stepNumber: 2, title: 'Admittance Matrix Assembly', layer: 'Grid Matrix', description: 'Build sparse complex Y-bus matrix incorporating line $\\pi$-models and shunt reactances.', keyCode: 'Ybus[i, j] = -1.0 / Z_series; Ybus[i, i] += (1.0 / Z_series) + (Y_shunt / 2)' },
        { stepNumber: 3, title: 'Newton-Raphson Power Flow Convergence', layer: 'Numerical Solver', description: 'Solve nonlinear power balance equations to 10^-4 tolerance using sparse LU decomposition.', keyCode: 'voltage_angles += np.linalg.solve(Jacobian, power_mismatches)' },
        { stepNumber: 4, title: 'Symmetrical Short-Circuit Assessment', layer: 'Fault Study', description: 'Calculate subtransient fault MVA at every bus to verify circuit breaker interrupt ratings.', keyCode: 'I_sc_3ph = 1.0 / Z_thevenin_positive_pu' },
        { stepNumber: 5, title: 'Unsymmetrical Ground Fault & Arc Flash Analysis', layer: 'Safety', description: 'Evaluate Line-to-Ground fault currents and determine incident energy cal/cm² for electrical safety.', keyCode: 'I_fault_lg = 3.0 / (Z1 + Z2 + Z0)' },
        { stepNumber: 6, title: 'SCADA Automation & IEC 61850 GOOSE Messaging', layer: 'Protection Comms', description: 'Configure peer-to-peer Ethernet GOOSE messages between protection relays for sub-4ms breaker trip interlocking.', keyCode: 'IEC61850_Publish_GOOSE(TripSignal_LogicalNode_PTRC);' }
      ],
      interviewQuestions: [
        {
          id: 'iq-eee-1',
          topic: 'Power Flow',
          question: 'What is the physical meaning of the Jacobian matrix in the Newton-Raphson power flow algorithm, and what causes it to become singular?',
          keyPointsExpected: [
            'Relates small changes in bus voltage angles ($\\Delta \\delta$) and magnitudes ($\\Delta |V|$) to changes in active ($\\Delta P$) and reactive power ($\\Delta Q$)',
            'Divided into 4 submatrices: $J_{11} = \\frac{\\partial P}{\\partial \\delta}, J_{12} = \\frac{\\partial P}{\\partial |V|}, J_{21} = \\frac{\\partial Q}{\\partial \\delta}, J_{22} = \\frac{\\partial Q}{\\partial |V|}$',
            'Singularity indicates the power flow has reached the nose of the P-V curve (maximum power transfer limit), representing imminent voltage collapse'
          ],
          sampleAnswer: 'The Jacobian matrix contains the partial derivatives of active and reactive power with respect to voltage phase angles and magnitudes. Physically, it measures grid sensitivity: how much bus voltages will swing when power demand fluctuates. When the Jacobian approaches singularity (determinant goes to zero), the grid has reached the maximum power transfer limit (the tip of the nose curve). Beyond this point, no real mathematical solution exists, which physically manifests as voltage collapse or blackout.'
        },
        {
          id: 'iq-eee-2',
          topic: 'Protection Coordination',
          question: 'Explain why differential protection (ANSI 87) is considered the gold standard for power transformer and generator protection.',
          keyPointsExpected: [
            'Operates on Kirchhoff’s Current Law: current entering must equal current leaving the protected zone',
            'Provides 100% unit protection with zero intentional time delay (< 20ms tripping)',
            'Percentage biased differential characteristic avoids false trips due to CT saturation during external through-faults',
            'Harmonic restraint (2nd harmonic) prevents tripping during magnetizing inrush when energizing transformers'
          ],
          sampleAnswer: 'Differential protection is a unit protection scheme that compares currents entering and leaving the zone. For internal faults, the differential current $I_d = |I_1 - I_2|$ surges, triggering instantaneous tripping without needing coordination delays. To prevent false tripping during external through-faults where CT saturation occurs, a dual-slope percentage restraint curve is used. Additionally, during transformer energization, magnetizing inrush current creates an apparent differential current; modern numerical relays use 2nd-harmonic restraint (typically blocking trip if 2nd harmonic exceeds 15%) to avoid nuisance trips.'
        }
      ]
    }
  }
};
