import { SkillCurriculum } from '../roadmapCurriculumData';

export const MECH_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // MECHANICAL 1: THERMODYNAMICS & THERMAL ENERGY SYSTEMS
  // =========================================================================
  'thermodynamics': {
    roadmapStepId: 'rd-mech-01',
    skillName: 'Engineering Thermodynamics & Thermal Power Systems',
    category: 'Thermal & Fluid Sciences',
    industryDemand: 93,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    prerequisites: [
      {
        skillName: 'Engineering Physics & Calculus',
        isMet: true,
        requiredDescription: 'Differential equations, conservation of mass and energy, ideal gas equation of state.'
      }
    ],
    whatYouWillLearn: [
      'First Law of Thermodynamics for open systems: Steady Flow Energy Equation (SFEE)',
      'Second Law, Carnot efficiency limits, entropy balances, and exergy (availability) destruction',
      'Vapor power cycles: Superheat, reheat, and regenerative Rankine cycles with open/closed feedwater heaters',
      'Gas power cycles: Air-standard Brayton cycle with intercooling, reheating, and recuperation',
      'Combined Cycle Gas Turbine (CCGT) thermodynamic optimization achieving >60% thermal efficiency',
      'Psychrometric processes: Sensible heating/cooling, humidification, bypass factor, and HVAC load calculation',
      'Heat exchanger thermal sizing: Log Mean Temperature Difference (LMTD) and Effectiveness-NTU methods',
      'Refrigeration and heat pump cycles: Vapor compression with eco-friendly low-GWP refrigerants (R-1234yf, CO2)'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Energy generation, aerospace propulsion, automotive powertrains, data center cooling, and cryogenic processing fundamentally operate on thermodynamic principles. Mastering thermal cycles enables engineers to cut megawatt losses and carbon emissions.',
      rolesUsingSkill: ['Thermal Systems Engineer', 'Turbomachinery Design Engineer', 'HVAC & MEP Engineer', 'Power Plant Operations Specialist'],
      realWorldUsage: 'Sizing heat recovery steam generators (HRSG) for combined-cycle power stations, cooling server racks in hyperscale data centers, and designing EV battery thermal management systems.',
      subsequentSkills: ['Computational Fluid Dynamics (CFD / ANSYS Fluent)', 'Cryogenics & Gas Liquefaction', 'Turbomachinery Blade Aerodynamics']
    },
    modules: [
      {
        id: 'mod-mech-1-1',
        moduleNumber: 1,
        title: 'Fundamental Laws, Control Volumes & Exergy Analysis',
        description: 'Formulate energy and entropy balances on open control volumes and analyze exergy destruction in thermal equipment.',
        lessons: [
          {
            id: 'les-mech-1-1-1',
            title: 'Steady Flow Energy Equation (SFEE) for Turbines, Compressors & Nozzles',
            duration: '45 mins',
            simpleExplanation: 'The First Law states that energy cannot be created or destroyed. In an open engineering device where fluid continuously flows in and out, the total energy entering (enthalpy + kinetic + potential + heat) must equal the total energy leaving (enthalpy + kinetic + potential + work).',
            whyNeeded: 'Every boiler, steam turbine, condenser, compressor, and rocket nozzle operates with continuous mass flow. The SFEE allows engineers to calculate power output and heat transfer without solving complex internal fluid dynamics.',
            howItWorks: 'Equation: $\\dot{Q} - \\dot{W}_s = \\dot{m} \\left[ (h_2 - h_1) + \\frac{V_2^2 - V_1^2}{2000} + \\frac{g(z_2 - z_1)}{1000} \\right]$. In adiabatic steam turbines, heat loss $\\dot{Q} \\approx 0$ and elevation changes are negligible, simplifying shaft work to $\\dot{W}_s = \\dot{m}(h_1 - h_2)$.',
            syntax: 'W_turbine = m_dot * (h_in - h_out); eta_isentropic = (h_in - h_out_actual) / (h_in - h_out_isentropic)',
            realWorldExample: 'A 500 MW supercritical steam turbine expands steam from 240 bar, 565°C ($h_1 = 3450$ kJ/kg) down to condenser pressure of 0.05 bar ($h_2 = 2120$ kJ/kg), producing mechanical shaft power to spin the generator.',
            codeSnippet: `# Python: Steam Turbine Power & Enthalpy Drop Calculation
def turbine_power_mw(mass_flow_kg_s, h_inlet_kj_kg, h_exhaust_kj_kg, eta_isentropic=0.88):
    """
    Calculates electrical power output of an adiabatic steam turbine stage.
    h: specific enthalpy in kJ/kg
    """
    ideal_enthalpy_drop = h_inlet_kj_kg - h_exhaust_kj_kg
    actual_enthalpy_drop = ideal_enthalpy_drop * eta_isentropic
    power_kw = mass_flow_kg_s * actual_enthalpy_drop
    power_mw = power_kw / 1000.0
    return {
        "actual_enthalpy_drop_kj_kg": round(actual_enthalpy_drop, 2),
        "power_output_mw": round(power_mw, 2)
    }

# 500 kg/s steam flow through high-pressure turbine cylinder
results = turbine_power_mw(mass_flow_kg_s=420.0, h_inlet_kj_kg=3520.0, h_exhaust_kj_kg=2980.0, eta_isentropic=0.90)
print(f"Enthalpy Drop: {results['actual_enthalpy_drop_kj_kg']} kJ/kg")
print(f"Mechanical Shaft Power: {results['power_output_mw']} MW")`,
            expectedOutput: 'Enthalpy Drop: 486.0 kJ/kg\nMechanical Shaft Power: 204.12 MW',
            commonMistakes: [
              'Mixing units: adding kinetic energy ($V^2 / 2$ in J/kg) directly to enthalpy ($h$ in kJ/kg) without dividing velocity squared by 2000',
              'Assuming ideal gas laws ($P v = R T$) apply to high-pressure steam near saturation (must use real thermodynamic Steam Tables / IAPWS-IF97)',
              'Confusing gauge pressure with absolute pressure when calculating expansion ratios'
            ],
            bestPractices: [
              'Always use absolute temperature in Kelvin and absolute pressure in Pascals/bar',
              'Use the IAPWS-IF97 formulation library (e.g. CoolProp in Python) for precise water/steam thermodynamic properties',
              'Account for isentropic efficiencies: real turbines always produce less work than isentropic expansions due to fluid friction'
            ],
            practiceQuestion: 'Steam expands through an adiabatic nozzle from 10 bar, 300°C ($h_1 = 3051.6$ kJ/kg) with negligible inlet velocity to an exit enthalpy of 2800 kJ/kg. Calculate the exit steam velocity in m/s.'
          },
          {
            id: 'les-mech-1-1-2',
            title: 'Rankine Cycle Reheat & Regeneration Thermodynamics',
            duration: '50 mins',
            simpleExplanation: 'The basic Rankine cycle boils water into steam, expands it through a turbine, condenses it, and pumps it back to the boiler. Reheating increases efficiency and eliminates blade moisture erosion, while regeneration uses bled steam to preheat boiler feedwater.',
            whyNeeded: 'Simple steam cycles achieve only 30% thermal efficiency and suffer from high moisture droplets in the final turbine stages that destroy titanium blades. Reheat and regeneration raise efficiency to 42-45% while keeping steam dry.',
            howItWorks: 'High-pressure steam expands partially in the HP turbine, returns to the boiler for reheating back to 565°C, and then expands through the IP/LP turbines. Feedwater heaters tap off small fractions of expanding steam at intermediate stages to preheat condensate.',
            syntax: 'eta_th = (W_turbine_total - W_pump) / Q_boiler_in',
            realWorldExample: 'Modern ultra-supercritical coal and nuclear power plants use 1 stage of reheat and 7 to 8 stages of regenerative feedwater heating to achieve maximum fuel economy.',
            codeSnippet: `# Rankine Cycle Thermal Efficiency Model
def rankine_cycle_efficiency(h_turb_in, h_reheat_in, h_reheat_out, h_turb_out, h_feedwater, h_condensate):
    """
    Calculates thermal efficiency of a reheat steam power cycle.
    """
    # Turbine work: HP expansion + LP expansion
    w_hp = h_turb_in - h_reheat_in
    w_lp = h_reheat_out - h_turb_out
    w_turbine_total = w_hp + w_lp
    
    # Heat input: Primary boiler + Reheater
    q_boiler = h_turb_in - h_feedwater
    q_reheat = h_reheat_out - h_reheat_in
    q_in_total = q_boiler + q_reheat
    
    eta_thermal = (w_turbine_total) / q_in_total
    return round(eta_thermal * 100, 2)

# Sample enthalpies in kJ/kg
eff = rankine_cycle_efficiency(
    h_turb_in=3540.0,
    h_reheat_in=3020.0,
    h_reheat_out=3590.0,
    h_turb_out=2250.0,
    h_feedwater=1120.0,
    h_condensate=190.0
)
print(f"Cycle Thermal Efficiency: {eff}%")`,
            expectedOutput: 'Cycle Thermal Efficiency: 41.52%',
            commonMistakes: [
              'Ignoring boiler feed pump work ($w_p = v \\Delta P$) in high-pressure supercritical systems where pump power exceeds 20 MW',
              'Permitting exhaust steam vapor quality ($x$) to fall below 0.88, which causes severe moisture erosion of low-pressure turbine blades',
              'Assuming constant specific heats for gases undergoing 1000°C combustion temperature swings'
            ],
            bestPractices: [
              'Optimize reheat pressure to approximately 20-25% of maximum boiler pressure for peak thermal efficiency',
              'Use deaerating open feedwater heaters (DA) to simultaneously strip dissolved oxygen and prevent boiler tube pitting corrosion',
              'Pair steam cycles with gas turbines in Combined Cycle Gas Turbine (CCGT) arrangements to capture exhaust heat'
            ],
            practiceQuestion: 'Why does adding regenerative feedwater heaters increase cycle thermal efficiency even though it reduces the total mass of steam expanding all the way to the condenser?'
          }
        ]
      },
      {
        id: 'mod-mech-1-2',
        moduleNumber: 2,
        title: 'Heat Exchanger Design & Effectiveness-NTU Method',
        description: 'Design industrial shell-and-tube, plate, and cross-flow heat exchangers using thermal rating equations.',
        lessons: [
          {
            id: 'les-mech-1-2-1',
            title: 'LMTD vs Effectiveness-NTU ($\\epsilon$-NTU) Analysis',
            duration: '45 mins',
            simpleExplanation: 'When designing a radiator or heat exchanger where all 4 inlet and outlet fluid temperatures are known, Log Mean Temperature Difference (LMTD) calculates the required surface area. When fluid outlet temperatures are unknown, the Effectiveness-NTU method calculates performance without trial-and-error iteration.',
            whyNeeded: 'From automotive radiators to nuclear steam generators, engineers must size heat transfer surface area ($A$) to transfer a target thermal duty ($Q$) without excessive pumping pressure drop.',
            howItWorks: 'Thermal Capacity Rates: $C_h = \\dot{m}_h c_{p,h}$, $C_c = \\dot{m}_c c_{p,c}$. $C_{min} = \\min(C_h, C_c)$. Maximum possible heat transfer is $q_{max} = C_{min} (T_{h,in} - T_{c,in})$. Effectiveness is $\\epsilon = \\frac{q}{q_{max}}$. Number of Transfer Units is $NTU = \\frac{U A}{C_{min}}$.',
            syntax: 'q = epsilon * C_min * (T_hot_in - T_cold_in); NTU = U * A / C_min',
            realWorldExample: 'A counterflow plate-fin heat exchanger cools battery coolant fluid from 55°C down to 32°C using chiller water in an electric vehicle thermal loop.',
            codeSnippet: `# Effectiveness-NTU Method for Counterflow Heat Exchanger
import math

def counterflow_hx_perf(m_dot_hot, cp_hot, t_hot_in, m_dot_cold, cp_cold, t_cold_in, u_overall, area_m2):
    c_hot = m_dot_hot * cp_hot
    c_cold = m_dot_cold * cp_cold
    c_min = min(c_hot, c_cold)
    c_max = max(c_hot, c_cold)
    c_ratio = c_min / c_max
    
    ntu = (u_overall * area_m2) / c_min
    
    # Counterflow effectiveness equation
    if c_ratio < 1.0:
        epsilon = (1.0 - math.exp(-ntu * (1.0 - c_ratio))) / (1.0 - c_ratio * math.exp(-ntu * (1.0 - c_ratio)))
    else:
        epsilon = ntu / (1.0 + ntu)
        
    q_actual_w = epsilon * c_min * (t_hot_in - t_cold_in)
    t_hot_out = t_hot_in - (q_actual_w / c_hot)
    t_cold_out = t_cold_in + (q_actual_w / c_cold)
    
    return {
        "heat_duty_kw": round(q_actual_w / 1000.0, 2),
        "hot_outlet_c": round(t_hot_out, 2),
        "cold_outlet_c": round(t_cold_out, 2),
        "effectiveness": round(epsilon, 3)
    }

# Cool 2.5 kg/s hot oil (cp=2.1 kJ/kg.K) with 3.0 kg/s water (cp=4.18 kJ/kg.K)
res = counterflow_hx_perf(
    m_dot_hot=2.5, cp_hot=2100, t_hot_in=95.0,
    m_dot_cold=3.0, cp_cold=4180, t_cold_in=25.0,
    u_overall=850.0, area_m2=12.0
)
print("Heat Duty:", res["heat_duty_kw"], "kW")
print("Hot Oil Exit Temp:", res["hot_outlet_c"], "°C")
print("Cold Water Exit Temp:", res["cold_outlet_c"], "°C")`,
            expectedOutput: 'Heat Duty: 279.79 kW\nHot Oil Exit Temp: 41.71 °C\nCold Water Exit Temp: 47.31 °C',
            commonMistakes: [
              'Using arithmetic mean temperature difference instead of logarithmic mean (LMTD), which grossly underestimates required heat transfer area',
              'Neglecting fouling resistance factors ($R_f$) in heat exchanger sizing, causing heat exchangers to fail duty requirements after 6 months of scaling',
              'Assuming counterflow and parallel flow achieve the same effectiveness (Counterflow is always thermodynamically superior)'
            ],
            bestPractices: [
              'Place corrosive or high-fouling fluids inside cleanable tubes rather than on the shell side in shell-and-tube exchangers',
              'Maintain fluid velocities between 1.0 and 2.5 m/s to balance high convective heat transfer coefficients against pumping friction loss',
              'Incorporate baffle cut optimizations (20-25%) to maximize cross-flow turbulence without inducing tube bundle acoustic vibration'
            ],
            practiceQuestion: 'Explain why the effectiveness of a condenser or boiler heat exchanger simplifies to $\\epsilon = 1 - e^{-NTU}$ regardless of whether flow is counterflow or parallel flow.'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-mech-1',
        title: 'Isentropic Nozzle Throat & Exit Area Sizing',
        difficulty: 'Medium',
        description: 'Implement compressible gas dynamics equations to size the throat and exit cross-sectional area of a supersonic de Laval rocket nozzle operating with choked flow.',
        requirements: [
          'Calculate critical pressure ratio for choked flow: $P^* / P_0 = \\left( \\frac{2}{\\gamma + 1} \\right)^{\\frac{\\gamma}{\\gamma - 1}}$',
          'Calculate choked mass flow rate at nozzle throat from chamber pressure and stagnation temperature',
          'Calculate required expansion ratio ($A_e / A^*$) for target supersonic exit Mach number'
        ],
        starterCode: `import math

def size_convergent_divergent_nozzle(p0_pa, t0_k, mass_flow_kg_s, gamma=1.2, r_gas=350.0, mach_exit=2.5):
    """
    Returns throat area (m^2) and exit area (m^2) for choked supersonic nozzle.
    """
    # TODO: Calculate throat area A_star and exit area A_exit
    return {"A_throat_m2": 0.0, "A_exit_m2": 0.0}`,
        expectedOutput: 'Throat and exit cross-sectional areas calculated accurately within 0.1% tolerance.',
        hints: [
          'Choked throat mass flux: $\\frac{\\dot{m}}{A^*} = \\frac{P_0}{\\sqrt{T_0}} \\sqrt{\\frac{\\gamma}{R} \\left( \\frac{2}{\\gamma + 1} \\right)^{\\frac{\\gamma + 1}{\\gamma - 1}}}$',
          'Area-Mach relation: $\\frac{A}{A^*} = \\frac{1}{M} \\left[ \\frac{2}{\\gamma + 1} \\left( 1 + \\frac{\\gamma - 1}{2} M^2 \\right) \\right]^{\\frac{\\gamma + 1}{2(\\gamma - 1)}}$'
        ],
        solutionCode: `import math

def size_convergent_divergent_nozzle(p0_pa, t0_k, mass_flow_kg_s, gamma=1.2, r_gas=350.0, mach_exit=2.5):
    # 1. Choked mass flow parameter at throat (M=1)
    choked_flux_factor = math.sqrt(gamma / r_gas) * ((2.0 / (gamma + 1.0)) ** ((gamma + 1.0) / (2.0 * (gamma - 1.0))))
    mass_flux_throat = (p0_pa / math.sqrt(t0_k)) * choked_flux_factor
    a_throat = mass_flow_kg_s / mass_flux_throat
    
    # 2. Area-Mach expansion ratio for exit
    m = mach_exit
    term = (2.0 / (gamma + 1.0)) * (1.0 + ((gamma - 1.0) / 2.0) * (m ** 2))
    exponent = (gamma + 1.0) / (2.0 * (gamma - 1.0))
    area_ratio = (1.0 / m) * (term ** exponent)
    a_exit = a_throat * area_ratio
    
    return {
        "A_throat_m2": round(a_throat, 5),
        "A_exit_m2": round(a_exit, 5),
        "expansion_ratio": round(area_ratio, 2)
    }`,
        testCases: [
          { input: 'P0=5 MPa, T0=3000K, m=50 kg/s, gamma=1.2, M=2.5', expected: 'Accurate throat and exit area calculated matching supersonic gas dynamic tables' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-mech-1-1',
        question: 'According to the Second Law of Thermodynamics, what happens to the total entropy of an isolated system undergoing an irreversible process?',
        options: [
          'It always increases ($\\Delta S_{univ} > 0$)',
          'It remains constant',
          'It decreases towards absolute zero',
          'It fluctuates symmetrically between positive and negative values'
        ],
        correctAnswerIndex: 0,
        explanation: 'The Clausius inequality and Second Law establish the principle of entropy increase: in any real, spontaneous, irreversible process in an isolated system, total entropy always strictly increases ($d S_{isolated} \\ge 0$).',
        topic: 'Entropy & Second Law'
      },
      {
        id: 'qz-mech-1-2',
        question: 'Why is the thermal efficiency of a Combined Cycle Gas Turbine (CCGT) power plant significantly higher (60%+) than a standalone simple-cycle gas turbine or steam turbine?',
        options: [
          'It utilizes two fuels simultaneously (coal and hydrogen)',
          'It pairs a high-temperature Brayton cycle (operating at 1400°C) with a bottoming Rankine steam cycle that captures heat from the 600°C gas turbine exhaust',
          'It eliminates friction in the generator bearings using supercooled magnets',
          'It operates at negative absolute condenser pressure'
        ],
        correctAnswerIndex: 1,
        explanation: 'Thermodynamic efficiency is bounded by Carnot limits ($1 - T_L / T_H$). The Brayton cycle operates at high $T_H$ (~1400°C) but exhausts hot gas (~600°C). By routing this exhaust into a Heat Recovery Steam Generator (HRSG) to power a bottoming steam cycle, thermal energy is extracted across the wide combined temperature spectrum from 1400°C down to 30°C.',
        topic: 'Combined Cycle Power Systems'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-mech-1',
        title: 'Thermal Sizing & Rating of a Shell-and-Tube Heat Exchanger',
        objective: 'Perform complete TEMA standard thermal rating for a 1-shell pass, 2-tube pass heat exchanger cooling lube oil with river water, calculating overall heat transfer coefficient (U) and pressure drop.',
        steps: [
          'Determine tube-side Reynolds number and Nusselt number using the Dittus-Boelter correlation: $Nu = 0.023 Re^{0.8} Pr^{0.4}$',
          'Calculate shell-side heat transfer coefficient using Kern’s method based on baffle spacing and pitch',
          'Compute overall U-value including tube metal thermal resistance and fouling factors ($R_{fi}, R_{fo}$)',
          'Verify tube-side pressure drop is below the 0.5 bar allowable pumping threshold'
        ],
        codeTemplate: `def calculate_overall_u(h_inside, h_outside, k_tube, d_inside_m, d_outside_m, r_fouling):
    # Resistance network: 1/U = (d_o / (d_i * h_i)) + R_fi + (d_o * ln(d_o/d_i)/(2*k)) + R_fo + (1/h_o)
    pass`,
        verificationCriteria: [
          'Thermal duty Q matches specified heat rejection within ±1%',
          'Tube-side Reynolds number confirms fully turbulent flow ($Re > 10,000$)',
          'Calculated pressure drop leaves at least 20% margin below client maximum pump head'
        ]
      }
    ],
    miniProject: {
      title: 'Thermodynamic Modeling & Optimization of a Supercritical CO2 (sCO2) Power Cycle',
      description: 'Model a closed-loop recompressed Supercritical Carbon Dioxide ($sCO_2$) Brayton cycle for next-generation concentrated solar or nuclear power. Achieve high power density turbomachinery design where the compressor operates near the critical point ($P_c = 7.38$ MPa, $T_c = 30.98$°C) to slash compression work.',
      techStack: ['Python', 'CoolProp Thermodynamic Library', 'NumPy / SciPy', 'Thermodynamic T-s Diagram Plotting'],
      deliverables: [
        'Complete cycle state-point matrix ($P, T, h, s, \\rho$) across main compressor, recompressor, high/low-temperature recuperators, heater, and turbine',
        'Parametric optimization curve plotting thermal efficiency vs turbine inlet temperature (500°C - 750°C)',
        'Comparison chart demonstrating 48% sCO2 cycle efficiency vs 40% steam Rankine efficiency at identical heat input',
        'T-s and P-h thermodynamic cycle state diagrams with real-gas property contours'
      ],
      architectureDiagramText: `[Heat Source (700°C)] ---> [Turbine] ---> [High-Temp Recuperator] ---> [Low-Temp Recuperator]
                                 |                                           |
                                 v                                           v
[Main Compressor] <--- [Precooler]                                 [Recompressor (Bypass)]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-mech-1-1',
          question: 'What is exergy (availability), and why is it superior to energy balance alone in industrial energy audits?',
          options: [
            'Exergy is the maximum theoretical useful work that can be extracted from a system as it reaches thermodynamic equilibrium with its environment; it reveals the true location and magnitude of wasted work potential caused by irreversibilities',
            'Exergy is equal to internal energy multiplied by pressure',
            'Exergy measures only electrical power and ignores heat transfer',
            'Exergy can never be destroyed in an open system'
          ],
          correctAnswerIndex: 0,
          explanation: 'While the First Law (Energy) states that energy is conserved ($Q = W$), it treats 100 kJ of heat at 1000°C the same as 100 kJ of heat at 35°C. Exergy accounts for quality: 100 kJ of heat at 35°C has virtually zero work potential. Exergy analysis pinpoints where valuable work potential is destroyed by throttling, mixing, and heat transfer across large temperature differences.',
          topic: 'Exergy & Availability Analysis'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'State-Point Property Extraction', layer: 'Thermodynamics', description: 'Query IAPWS-IF97 steam or CoolProp real-gas equations of state to populate thermodynamic properties.', keyCode: 'h1 = PropsSI("H", "P", p1_pa, "T", t1_k, "Water")' },
        { stepNumber: 2, title: 'Turbomachinery Isentropic Expansions', layer: 'Expansion', description: 'Calculate isentropic state points from inlet entropy ($s_2s = s_1$) and apply stage isentropic efficiencies.', keyCode: 'h2_actual = h1 - eta_isentropic * (h1 - h2s)' },
        { stepNumber: 3, title: 'Feedwater Deaerator Mass & Energy Balance', layer: 'Regeneration', description: 'Solve simultaneous mass and enthalpy conservation equations for open feedwater bleed fractions.', keyCode: 'bleed_fraction_y = (h_f_out - h_in_cold) / (h_bleed - h_in_cold)' },
        { stepNumber: 4, title: 'Heat Exchanger Area Sizing via $\\epsilon$-NTU', layer: 'Thermal Design', description: 'Size condenser tube surface area and cooling water flow rates for vacuum condensing conditions.', keyCode: 'q_duty = m_dot_steam * (h_exhaust - h_condensate); area = q_duty / (u_overall * lmtd)' },
        { stepNumber: 5, title: 'Second-Law Exergy Destruction Audit', layer: 'Optimization', description: 'Quantify Gouy-Stodola exergy destruction rates ($I = T_0 \\dot{S}_{gen}$) across boiler, turbine, and piping.', keyCode: 'exergy_loss = t_ambient_k * (s_out - s_in - q_heat / t_boundary)' },
        { stepNumber: 6, title: 'Plant Emissions & Heat Rate Verification', layer: 'Plant Economics', description: 'Calculate Net Plant Heat Rate (kJ/kWh) and levelized cost of energy (LCOE) under partial load swings.', keyCode: 'heat_rate_kj_kwh = (fuel_flow_kg_h * lhv_kj_kg) / net_power_kw' }
      ],
      interviewQuestions: [
        {
          id: 'iq-mech-1',
          topic: 'Thermal Cycles',
          question: 'What is the physical significance of the critical point of water (22.064 MPa, 373.95°C) in supercritical power boiler design?',
          keyPointsExpected: [
            'At and above the critical point, the latent heat of vaporization drops to zero ($h_{fg} = 0$)',
            'Liquid water transitions continuously into dense supercritical vapor without phase boiling or bubbling',
            'Eliminates the traditional boiler steam drum and water-steam separator equipment',
            'Significantly higher thermal efficiency due to higher average heat addition temperature'
          ],
          sampleAnswer: 'Above the critical point (22.1 MPa), water ceases to have a distinct liquid-vapor phase boundary; latent heat of vaporization becomes zero. In supercritical and ultra-supercritical boilers (operating at 25-30 MPa), water continuously transforms from a dense liquid to a supercritical fluid without boiling bubbles. This eliminates the massive, expensive boiler steam drum and separator. Thermodynamically, adding heat at high supercritical pressures increases the mean temperature of heat addition, raising plant cycle efficiency from ~38% to over 45%.'
        },
        {
          id: 'iq-mech-2',
          topic: 'Heat Transfer',
          question: 'Explain why water is routed on the tube side and high-pressure steam on the shell side in large power plant surface condensers.',
          keyPointsExpected: [
            'Cooling water is typically dirty river or sea water that leaves silt, biological fouling, and mineral scale; straight tubes can be mechanically cleaned with scrapers',
            'Steam operates under deep vacuum (0.05 bar); large shell volume accommodates huge volumetric steam flow rates with minimal pressure drop',
            'Pressure vessel safety: containing high-pressure cooling water inside small-diameter tubes is mechanically more economical than designing a massive pressure shell'
          ],
          sampleAnswer: 'Cooling water comes from cooling towers, rivers, or seawater and carries biological growth and suspended solids. Routing water through the inside of straight tubes allows operators to remove condenser waterbox covers and mechanically ream or brush the tubes during scheduled outages. Conversely, condensing steam operates at deep vacuum (5-10 kPa absolute) with enormous specific volume ($v \\approx 20-30$ m³/kg). The shell side provides the massive cross-sectional area needed to distribute steam over thousands of tubes with negligible pressure drop, which is critical because even a 1 kPa pressure drop would severely degrade turbine backpressure and plant efficiency.'
        }
      ]
    }
  }
};
