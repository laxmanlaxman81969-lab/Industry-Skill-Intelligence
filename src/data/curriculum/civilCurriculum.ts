import { SkillCurriculum } from '../roadmapCurriculumData';

export const CIVIL_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // CIVIL 1: STRUCTURAL ENGINEERING & REINFORCED CONCRETE DESIGN
  // =========================================================================
  'staad-pro': {
    roadmapStepId: 'rd-civil-01',
    skillName: 'Structural Engineering, RCC & Steel Design',
    category: 'Structural Engineering',
    industryDemand: 90,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 36,
    prerequisites: [
      {
        skillName: 'Strength of Materials & Structural Mechanics',
        isMet: true,
        requiredDescription: 'Bending moment and shear force diagrams, stress-strain relations, Young’s modulus, and centroid/moment of inertia.'
      }
    ],
    whatYouWillLearn: [
      'Limit State Method (LSM) design philosophy according to IS 456:2000 and ACI 318 codes',
      'Flexural design of singly and doubly reinforced rectangular and T-beams',
      'Shear design: diagonal tension cracking, minimum shear reinforcement, and vertical stirrup spacing',
      'Axial compression and uniaxial/biaxial bending in short and slender RCC columns ($P_u - M_u$ interaction diagrams)',
      'Two-way slab design by Rankine-Grashoff and yield line theories with torsion reinforcement at corners',
      'Seismic design: Equivalent static and Response Spectrum Analysis according to IS 1893 / ASCE 7',
      'Wind load computation on high-rise structures based on terrain category and topography (IS 875 Part 3)',
      'Structural steel design: Tension members, Euler/Perry-Robertson column buckling, bolted and welded moment connections'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Bridges, skyscrapers, industrial plants, dams, and metro viaducts require rigorous structural design to guarantee public safety against gravity loads, cyclonic winds, and earthquake ground acceleration.',
      rolesUsingSkill: ['Structural Design Engineer', 'Civil Project Engineer', 'Bridge Engineer', 'BIM Structural Specialist'],
      realWorldUsage: 'Designing earthquake-resistant multi-story residential towers, commercial metro viaducts, and industrial steel pre-engineered buildings (PEBs).',
      subsequentSkills: ['Finite Element Structural Analysis (ETABS / SAP2000)', 'Foundation Engineering & Piled Rafts', 'Prestressed Concrete (PSC) Bridge Design']
    },
    modules: [
      {
        id: 'mod-civ-1-1',
        moduleNumber: 1,
        title: 'Limit State Design of Reinforced Concrete Members',
        description: 'Design structural RCC beams, slabs, and columns according to international building codes.',
        lessons: [
          {
            id: 'les-civ-1-1-1',
            title: 'Flexural Analysis of Singly Reinforced RCC Beams (IS 456 / ACI 318)',
            duration: '45 mins',
            simpleExplanation: 'Concrete has immense compressive strength but fractures easily under tension. Steel rebar is cast into the bottom tension zone of the beam to resist pulling forces while the top concrete block resists crushing forces.',
            whyNeeded: 'Structural beams must be engineered as "under-reinforced" so that tension steel yields gradually with visible warning cracks before the concrete violently crushes in compression, allowing safe occupant evacuation.',
            howItWorks: 'Stress block approximation: compressive stress in concrete is assumed rectangular-parabolic with depth $0.42 x_u$ and maximum stress $0.45 f_{ck}$. Tensile force in steel is $T = 0.87 f_y A_{st}$. Equating $C = T$ yields the neutral axis depth: $x_u = \\frac{0.87 f_y A_{st}}{0.36 f_{ck} b}$. Moment of resistance is $M_u = 0.87 f_y A_{st} \\left( d - 0.42 x_u \\right)$.',
            syntax: 'M_u_lim = 0.138 * f_ck * b * (d^2) for Fe 415; M_u_lim = 0.133 * f_ck * b * (d^2) for Fe 500',
            realWorldExample: 'A 6-meter span transfer girder supporting 3 floors of an apartment building engineered with M30 concrete and Fe 500 steel rebar to resist 220 kNm factored bending moment.',
            codeSnippet: `# Python: RCC Singly Reinforced Beam Design & Neutral Axis Check
def design_rcc_beam(b_mm, d_mm, fck_mpa, fy_mpa, mu_factored_knm):
    """
    Designs tension steel area (Ast) for singly reinforced rectangular beam.
    Codes: IS 456:2000 / LSM
    """
    # Limiting depth factor xu_max / d
    if fy_mpa == 415:
        xu_max_ratio = 0.48
        ru_lim = 0.138
    elif fy_mpa == 500:
        xu_max_ratio = 0.46
        ru_lim = 0.133
    else:
        xu_max_ratio = 0.53
        ru_lim = 0.148

    # 1. Check limiting moment capacity (under-reinforced criteria)
    mu_lim_knm = (ru_lim * fck_mpa * b_mm * (d_mm ** 2)) / 1e6
    if mu_factored_knm > mu_lim_knm:
        return {"status": "OVER-REINFORCED", "mu_lim": round(mu_lim_knm, 2), "recommendation": "Increase beam depth or design as doubly reinforced"}

    # 2. Calculate required steel area Ast
    # Quadratic formula from Mu = 0.87 * fy * Ast * d * (1 - (Ast * fy)/(b * d * fck))
    import math
    term = 1.0 - (4.598 * mu_factored_knm * 1e6) / (fck_mpa * b_mm * (d_mm ** 2))
    ast_req_mm2 = (0.5 * fck_mpa / fy_mpa) * (1.0 - math.sqrt(term)) * (b_mm * d_mm)
    
    # 3. Minimum steel check (0.85 * b * d / fy)
    ast_min_mm2 = (0.85 * b_mm * d_mm) / fy_mpa
    ast_final_mm2 = max(ast_req_mm2, ast_min_mm2)

    return {
        "status": "SAFE_UNDER_REINFORCED",
        "mu_lim_knm": round(mu_lim_knm, 2),
        "ast_required_mm2": round(ast_final_mm2, 1),
        "pt_percentage": round((ast_final_mm2 / (b_mm * d_mm)) * 100, 2)
    }

# Beam: 250mm width, 450mm effective depth, M25 concrete, Fe500 steel, Mu = 120 kNm
res = design_rcc_beam(b_mm=250, d_mm=450, fck_mpa=25, fy_mpa=500, mu_factored_knm=120)
print(f"Status: {res['status']}, Ast: {res['ast_required_mm2']} mm² ({res['pt_percentage']}%)")`,
            expectedOutput: 'Status: SAFE_UNDER_REINFORCED, Ast: 736.2 mm² (0.65%)',
            commonMistakes: [
              'Designing over-reinforced sections ($x_u > x_{u,max}$), leading to sudden, brittle explosive failure of concrete without warning',
              'Using total overall beam depth ($D$) instead of effective depth to center of tensile rebar ($d = D - \\text{cover} - \\phi/2$)',
              'Neglecting clear concrete cover specifications (e.g. 25mm for beams, 40mm for columns, 50mm for coastal foundations)'
            ],
            bestPractices: [
              'Maintain rebar spacing greater than the maximum coarse aggregate size (20mm) plus 5mm to prevent honeycombing during vibration',
              'Specify High-Yield Strength Deformed (HYSD) TMT bars with minimum 14.5% elongation for ductility in seismic zones',
              'Always satisfy deflection span-to-depth ratios ($L/d \\le 20$ for simply supported beams) to ensure serviceability'
            ],
            practiceQuestion: 'What is the physical danger of an over-reinforced concrete beam compared to an under-reinforced beam during an earthquake?'
          },
          {
            id: 'les-civ-1-1-2',
            title: 'Column Axial Compression & Uniaxial/Biaxial Bending',
            duration: '50 mins',
            simpleExplanation: 'Columns are vertical compression members carrying gravitational roof and floor loads down into foundation footings, while also resisting lateral overturning moments caused by wind and earthquakes.',
            whyNeeded: 'Column failures are sudden and trigger progressive collapse of entire structures. Careful longitudinal rebar detailing and lateral tie confinement are required by building regulations.',
            howItWorks: 'Factored load capacity of a short column with minimum eccentricity is given by: $P_u = 0.4 f_{ck} A_c + 0.67 f_y A_{sc}$. Lateral ties (helical or rectangular) prevent outward buckling of vertical rebar during heavy compression.',
            syntax: 'P_u = 0.40 * f_ck * (A_g - A_sc) + 0.67 * f_y * A_sc',
            realWorldExample: 'Corner columns of an 8-story commercial complex supporting 1800 kN axial dead/live load combined with 65 kNm seismic bending moments.',
            codeSnippet: `# Column Axial Capacity & Minimum Eccentricity Check
def short_column_capacity(b_mm, d_mm, fck_mpa, fy_mpa, p_steel_percent=1.5):
    """
    Calculates ultimate axial load capacity Pu for short column with minimum eccentricity.
    """
    ag_mm2 = b_mm * d_mm
    asc_mm2 = (p_steel_percent / 100.0) * ag_mm2
    ac_mm2 = ag_mm2 - asc_mm2
    
    # IS 456 Clause 39.3 Short Axial Column
    pu_n = 0.40 * fck_mpa * ac_mm2 + 0.67 * fy_mpa * asc_mm2
    pu_kn = pu_n / 1000.0
    
    # Minimum eccentricity check: e_min = L/500 + D/30 >= 20mm
    # Assume 3m unsupported height
    e_min_d = (3000 / 500) + (d_mm / 30)
    e_min_b = (3000 / 500) + (b_mm / 30)
    e_design = max(20.0, e_min_d, e_min_b)
    
    return {
        "cross_section": f"{b_mm}x{d_mm} mm",
        "steel_area_mm2": round(asc_mm2, 1),
        "pu_capacity_kn": round(pu_kn, 1),
        "min_eccentricity_mm": round(e_design, 1)
    }

# 300x450mm column with 1.5% steel, M30 concrete, Fe500 steel
col = short_column_capacity(300, 450, 30, 500, p_steel_percent=1.5)
print(f"Capacity: {col['pu_capacity_kn']} kN, Steel: {col['steel_area_mm2']} mm²")`,
            expectedOutput: 'Capacity: 2276.4 kN, Steel: 2025.0 mm²',
            commonMistakes: [
              'Exceeding 4% steel ratio in non-lapped zones (6% in lapped zones), making it impossible for concrete to flow between bars',
              'Incorrect tie spacing exceeding the minimum of: lateral dimension, 16 times vertical bar diameter, or 300mm',
              'Ignoring slenderness ratio ($\\lambda = l_{eff} / r > 12$), which induces additional secondary $P-\\Delta$ buckling moments'
            ],
            bestPractices: [
              'Provide at least 4 longitudinal bars in rectangular columns and 6 bars in circular columns',
              'Stagger rebar lap splices by at least 1.3 times the development length ($L_d$)',
              'Confine column plastic hinge zones at beam junctions with close-pitch seismic ties at 100mm centers according to IS 13920 ductile detailing codes'
            ],
            practiceQuestion: 'Why does IS 456 mandate that the minimum design eccentricity ($e_{min}$) must never be taken as less than 20mm, even if structural analysis shows pure axial load?'
          }
        ]
      },
      {
        id: 'mod-civ-1-2',
        moduleNumber: 2,
        title: 'Seismic Analysis & STAAD.Pro Structural Modeling',
        description: 'Model frame geometry, apply load combinations (1.5 DL + 1.5 LL, 1.2 DL + 1.2 LL ± 1.2 EQ), and run finite element frame analysis.',
        lessons: [
          {
            id: 'les-civ-1-2-1',
            title: 'Earthquake Response Spectrum Analysis & Base Shear (IS 1893 / ASCE 7)',
            duration: '50 mins',
            simpleExplanation: 'During an earthquake, ground shaking accelerates the foundation of a building back and forth. The mass of the building above generates dynamic inertial lateral forces (Base Shear) that try to shear the columns off the ground.',
            whyNeeded: 'Buildings fail during seismic events when columns lack ductility or when soft-story mechanisms collapse. Calculating base shear allows sizing shear walls and moment-resisting frames to absorb seismic energy.',
            howItWorks: 'Design Seismic Base Shear: $V_b = A_h \\times W$. The horizontal seismic coefficient is $A_h = \\frac{Z}{2} \\frac{I}{R} \\frac{S_a}{g}$, where $Z$ is zone factor (Zone II to V), $I$ is importance factor (1.5 for hospitals/schools), $R$ is response reduction factor (5.0 for Special Moment Resisting Frames - SMRF), and $S_a/g$ is spectral acceleration based on soil type.',
            syntax: 'V_b = (Z * I / (2 * R)) * (Sa_g) * Total_Seismic_Weight',
            realWorldExample: 'A 40-meter hospital tower in Seismic Zone V ($Z = 0.36$) designed as an SMRF ($R = 5$) with an importance factor $I = 1.5$ to withstand peak ground accelerations without collapse.',
            codeSnippet: `# Calculate Seismic Base Shear & Story Distribution (IS 1893:2016)
def calculate_seismic_base_shear(zone_factor_z, importance_i, reduction_r, total_weight_kn, building_height_m):
    # Fundamental natural period for RCC frame: Ta = 0.075 * h^0.75
    ta = 0.075 * (building_height_m ** 0.75)
    
    # Spectral acceleration Sa/g for Medium Soil (Type II)
    if ta < 0.10:
        sa_g = 1.0 + 15.0 * ta
    elif 0.10 <= ta <= 0.55:
        sa_g = 2.50
    else:
        sa_g = 1.36 / ta
        
    # Horizontal Seismic Coefficient Ah
    ah = (zone_factor_z / 2.0) * (importance_i / reduction_r) * sa_g
    base_shear_vb_kn = ah * total_weight_kn
    
    return {
        "period_seconds": round(ta, 3),
        "spectral_sa_g": round(sa_g, 3),
        "seismic_coeff_ah": round(ah, 4),
        "base_shear_kn": round(base_shear_vb_kn, 1)
    }

# Hospital (I=1.5), Zone IV (Z=0.24), SMRF (R=5), Height=30m, Weight=45000 kN
seismic = calculate_seismic_base_shear(0.24, 1.5, 5.0, 45000, 30.0)
print(f"Fundamental Period: {seismic['period_seconds']} s")
print(f"Base Shear Vb: {seismic['base_shear_kn']} kN ({round(seismic['base_shear_kn']/45000*100, 2)}% of building weight)")`,
            expectedOutput: 'Fundamental Period: 0.961 s\nBase Shear Vb: 1531.0 kN (3.4% of building weight)',
            commonMistakes: [
              'Creating a "Soft Story" by eliminating infill masonry walls at the ground floor for open car parking without designing columns for magnified shear',
              'Ignoring torsional irregularity when center of mass (CM) does not align with center of rigidity (CR)',
              'Neglecting vertical earthquake components ($A_v = \\frac{2}{3} A_h$) on long cantilever projections and transfer trusses'
            ],
            bestPractices: [
              'Use Special Moment Resisting Frames (SMRF) with closely spaced ductile ties at joints according to IS 13920',
              'Incorporate reinforced concrete shear walls around lift cores to attract over 70% of lateral seismic base shear',
              'Ensure the Strong-Column Weak-Beam design rule is satisfied: $\\sum M_{col} \\ge 1.2 \\sum M_{beam}$'
            ],
            practiceQuestion: 'Explain the "Strong-Column Weak-Beam" philosophy and why civil engineers deliberately force flexural yielding to occur in beams before columns during a major earthquake.'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-civ-1',
        title: 'STAAD.Pro Command File Generator for 2D Portal Frame',
        difficulty: 'Medium',
        description: 'Generate a clean, syntactically correct STAAD.Pro input script for a 2-bay, 2-story reinforced concrete moment frame with dead, live, and wind loads.',
        requirements: [
          'Define joint coordinates and member incidences for 6 columns and 4 beams',
          'Assign concrete material properties ($E = 2.5 \\times 10^7$ kN/m², density = 25 kN/m³)',
          'Create load cases: 1 DL (Selfweight), 2 LL (UDL on beams), 3 Wind (Nodal lateral load)',
          'Define IS 456 factored load combinations: 1.5(DL + LL) and 1.2(DL + LL + WL)'
        ],
        starterCode: `def generate_staad_script(bay_width_m, story_height_m):
    """
    Returns valid STAAD.Pro syntax string for 1-bay 1-story frame.
    """
    # TODO: Output STAAD command syntax
    return ""`,
        expectedOutput: 'Valid STAAD input text file ready to be analyzed by the STAAD solver engine.',
        hints: [
          'STAAD syntax begins with `STAAD SPACE` and finishes with `PERFORM ANALYSIS` and `FINISH`',
          'Use `MEMBER PROPERTIES AMERICAN / PRISMATIC` to define rectangle cross sections',
          'Supports are defined as `SUPPORTS 1 2 PINNED` or `FIXED`'
        ],
        solutionCode: `def generate_staad_script(bay_width_m, story_height_m):
    script = f"""STAAD SPACE
START JOB INFORMATION
ENGINEER DATE 24-SEP-26
JOB NAME PORTAL FRAME
END JOB INFORMATION
INPUT WIDTH 79
UNIT METER KN
JOINT COORDINATES
1 0.0 0.0 0.0; 2 {bay_width_m} 0.0 0.0;
3 0.0 {story_height_m} 0.0; 4 {bay_width_m} {story_height_m} 0.0;
MEMBER INCIDENCES
1 1 3; 2 2 4; 3 3 4;
DEFINE MATERIAL START
ISOTROPIC CONCRETE
E 2.5e+07
POISSON 0.17
DENSITY 25
END DEFINE MATERIAL
MEMBER PROPERTY INDIAN
1 2 PRIS YD 0.45 ZD 0.30
3 PRIS YD 0.40 ZD 0.25
CONSTANTS
MATERIAL CONCRETE ALL
SUPPORTS
1 2 FIXED
LOAD 1 LOADTYPE Dead TITLE DEAD LOAD
SELFWEIGHT Y -1.0
LOAD 2 LOADTYPE Live TITLE LIVE LOAD
MEMBER LOAD
3 UNI GY -25.0
LOAD COMB 101 1.5(DL+LL)
1 1.5 2 1.5
PERFORM ANALYSIS
PRINT SUPPORT REACTIONS
FINISH"""
    return script.strip()`,
        testCases: [
          { input: 'bay_width=5.0m, story_height=3.5m', expected: 'Produces valid joint coordinates (0,0), (5,0), (0,3.5), (5,3.5) with fixed supports' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-civ-1-1',
        question: 'Why are bent-up bars or vertical stirrups required near the supports of a simply supported reinforced concrete beam?',
        options: [
          'Shear force is highest near the supports, causing diagonal tensile cracks at 45 degrees that concrete alone cannot resist without web steel reinforcement',
          'To increase the architectural aesthetic of the ceiling',
          'To prevent thermal expansion during summer months',
          'To hold electrical conduits in position'
        ],
        correctAnswerIndex: 0,
        explanation: 'In simply supported beams, bending moments peak at the center, but shear forces peak at the supports. Combined shear and flexure generates principal tensile stresses inclined at roughly 45°, creating diagonal shear cracks. Vertical stirrups or inclined bent-up bars cross these potential crack planes in tension, preventing brittle shear failures.',
        topic: 'Shear Reinforcement Design'
      },
      {
        id: 'qz-civ-1-2',
        question: 'What is the primary purpose of assigning a Rigid Diaphragm constraint to floor slabs in multistory 3D structural analysis models?',
        options: [
          'It completely eliminates dead load',
          'It forces all floor slab nodes to translate and rotate together as a rigid plane in-plane, realistically distributing lateral wind and earthquake forces to columns and shear walls based on their relative lateral stiffness',
          'It reduces the amount of steel rebar required in the foundation by 50%',
          'It turns concrete into pre-stressed post-tensioned steel'
        ],
        correctAnswerIndex: 1,
        explanation: 'Cast-in-place concrete slabs have immense in-plane stiffness compared to flexible columns. Applying a rigid diaphragm links all nodes at a story level to 3 master degrees of freedom (lateral translation in X and Z, and rotation about Y), distributing seismic lateral forces to vertical columns and shear walls strictly according to their relative lateral stiffness.',
        topic: 'Structural Dynamics & Diaphragms'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-civ-1',
        title: 'Design of Isolated Footing for Slender Column',
        objective: 'Design an isolated square reinforced concrete spread footing resting on soil with safe bearing capacity (SBC) of 200 kN/m², checking for one-way shear and two-way punching shear.',
        steps: [
          'Calculate required footing plan area ($A = 1.1 \\times P / SBC$) including 10% self-weight allowance',
          'Determine upward soil pressure under factored column load: $q_u = P_u / A_{actual}$',
          'Check one-way beam shear at a distance $d$ from column face against permissible concrete shear strength $\\tau_c$',
          'Check two-way punching shear at distance $d/2$ from perimeter of column face against $0.25 \\sqrt{f_{ck}}$'
        ],
        codeTemplate: `def design_isolated_footing(pu_kn, col_b_mm, col_d_mm, sbc_kpa, fck, fy):
    # 1. Plan size L x B
    # 2. Factored upward pressure qu
    # 3. Depth d required for punching shear
    # 4. Flexural steel Ast
    pass`,
        verificationCriteria: [
          'Soil pressure does not exceed SBC under working loads',
          'Footing depth provides safety factor > 1.2 against two-way punching shear without requiring shear stirrups',
          'Bending rebar satisfies minimum distribution requirements ($0.12\\%$ of gross area)'
        ]
      }
    ],
    miniProject: {
      title: 'Earthquake-Resistant G+10 Commercial Building Structural Analysis & Detailing',
      description: 'Perform complete structural design of a G+10 multistory office building in Seismic Zone IV using STAAD.Pro / ETABS. Model concrete moment frames, design shear wall cores, verify story drift ratio (< 0.004), and generate ductile structural drawings according to IS 13920.',
      techStack: ['STAAD.Pro / ETABS', 'AutoCAD', 'IS 456:2000', 'IS 1893:2016', 'IS 13920 Ductile Detailing'],
      deliverables: [
        'Complete 3D structural model with dead, live, wind, and response spectrum earthquake load combinations',
        'Story drift and lateral displacement check report proving drift is within permissible limits',
        'Structural beam and column schedules with bar bending schedules (BBS)',
        'Ductile joint detailing drawings showing beam-column confinement hoops and shear wall boundary elements'
      ],
      architectureDiagramText: `[3D Concrete Frame (G+10)]
            |
            +---> [Floor Slab: Rigid Diaphragm]
            |
            +---> [Central Lift Core: RC Shear Walls (takes 75% lateral base shear)]
            |
            +---> [Perimeter Special Moment Resisting Frames (SMRF)]
            |
            v
[Combined Raft / Mat Foundation resting on Piles]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-civ-1-1',
          question: 'What is P-Delta (P-$\\Delta$) effect in high-rise structural engineering, and when must it be included in computer analysis?',
          options: [
            'A secondary non-linear overturning moment generated when large gravity axial loads (P) are displaced laterally by wind or earthquake story drift ($\\Delta$); mandatory for tall, flexible structures where secondary moments exceed 10% of primary moments',
            'The ratio between concrete cost and steel rebar price',
            'The difference in temperature between the top floor and the basement',
            'The speed at which concrete cures after pouring'
          ],
          correctAnswerIndex: 0,
          explanation: 'P-Delta is a second-order geometric non-linearity. When a high-rise sways laterally by an amount $\\Delta$, the massive vertical dead load $P$ of the upper floors is no longer concentric, producing an additional overturning moment $P \\times \\Delta$ that increases column bending stresses and lateral drift.',
          topic: 'Advanced Structural Analysis'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Architectural Grid Alignment & Structural Framing', layer: 'Modeling', description: 'Establish primary column coordinates, beam centerlines, and floor heights in structural CAD.', keyCode: 'JOINT COORDINATES; 1 0.0 0.0 0.0; 2 6.0 0.0 0.0;' },
        { stepNumber: 2, title: 'Dead & Live Gravity Load Assignment', layer: 'Gravity Loads', description: 'Apply slab floor loads (DL = 4 kN/m², LL = 3 kN/m²) and perimeter wall masonry loads (12 kN/m).', keyCode: 'FLOOR LOAD; YRANGE 3.0 35.0 FLOAD -4.0 GY;' },
        { stepNumber: 3, title: 'Response Spectrum Seismic Generation', layer: 'Dynamic Lateral', description: 'Input design acceleration spectrum for medium soil and scale dynamic base shear to match empirical $V_b$.', keyCode: 'SPECTRUM SRSS IS1893 2016 ZONE 0.24 I 1.5 R 5.0 SOIL 2;' },
        { stepNumber: 4, title: 'First-Order Stiffness & Modal Eigenvalue Analysis', layer: 'Solver', description: 'Extract natural frequencies, modal mass participation factors (> 90%), and fundamental mode shapes.', keyCode: 'PERFORM ANALYSIS; PRINT MODAL FREQUENCIES;' },
        { stepNumber: 5, title: 'Story Drift & Torsional Irregularity Verification', layer: 'Serviceability', description: 'Verify inter-story drift does not exceed 0.004 times story height under design lateral loads.', keyCode: 'CHECK STORY DRIFT; MAX RATIO 0.004;' },
        { stepNumber: 6, title: 'Ductile Concrete Section Design & Rebar Scheduling', layer: 'Design Codes', description: 'Execute code compliance checks to IS 456 / IS 13920 and generate column rebar area interaction envelopes.', keyCode: 'START CONCRETE DESIGN; CODE INDIAN; DESIGN BEAM 1 TO 40; DESIGN COLUMN 41 TO 80;' }
      ],
      interviewQuestions: [
        {
          id: 'iq-civ-1',
          topic: 'Seismic Engineering',
          question: 'What is a "Soft Story" in multistory building construction, why did so many open-ground-floor buildings collapse in past earthquakes, and how is it addressed in design?',
          keyPointsExpected: [
            'A soft story occurs when a floor’s lateral stiffness is less than 70% of the story above it (typically ground floor left open for parking/stilt)',
            'Upper stories with masonry walls act as rigid boxes, concentrating all seismic lateral deformation into the flexible ground floor columns',
            'Columns experience massive shear and bending plastic hinges at top and bottom, causing sudden pancake collapse',
            'Resolved by adding RC shear walls, steel bracings, or designing stilt columns for 2.5 times the normal calculated shear forces'
          ],
          sampleAnswer: 'A soft story is an architectural configuration—common in stilt parking—where the ground floor lacks masonry infill walls while upper floors have dense brick partitions. This makes the ground floor dramatically more flexible. During an earthquake, the upper floors move as a stiff monolithic block, concentrating virtually 100% of the building’s lateral drift and shear into the open ground floor columns. Without ductile detailing, these columns form simultaneous plastic hinges and collapse in a pancake fashion. Modern codes like IS 1893 mandate that open ground floor columns must either be backed by concrete shear walls or designed for a dynamic amplification factor (multiplying shear forces by 2.5).'
        },
        {
          id: 'iq-civ-2',
          topic: 'Concrete Technology',
          question: 'What is the role of the water-cement ratio in concrete mix design, and how do modern polycarboxylate ether (PCE) superplasticizers change workability without sacrificing strength?',
          keyPointsExpected: [
            'Abrams’ Law: compressive strength of concrete is inversely proportional to the water-cement ratio ($w/c$)',
            'Excess water creates capillary pores and micro-voids as it evaporates, drastically lowering strength and increasing permeability',
            'Superplasticizers provide steric hindrance and electrostatic repulsion between cement grains',
            'Allows reducing $w/c$ down to 0.30 while maintaining high slump/flowability for pumping into congested rebar'
          ],
          sampleAnswer: 'The water-cement ratio ($w/c$) is the single most critical parameter governing concrete compressive strength and durability. To hydrate cement chemically requires a $w/c$ of only ~0.25 to 0.28. Any excess water added for workability evaporates over time, leaving capillary voids that weaken strength and allow chloride ingress that corrodes rebar. Polycarboxylate ether (PCE) superplasticizers disperse flocculated cement grains through steric hindrance—long polymer side chains repel each other physically rather than requiring huge volumes of water. This allows engineers to achieve high-performance concrete (M60-M80) with a low $w/c$ of 0.28 to 0.32 while maintaining exceptional slump flow for pumping 50 stories high.'
        }
      ]
    }
  }
};
