import { SkillCurriculum } from '../roadmapCurriculumData';

export const AERO_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // AEROSPACE: AERODYNAMICS, FLIGHT MECHANICS & PROPULSION
  // =========================================================================
  'aerodynamics': {
    roadmapStepId: 'rd-aero-01',
    skillName: 'Aerodynamics, Flight Mechanics & Jet Propulsion',
    category: 'Aerospace Engineering',
    industryDemand: 92,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 36,
    prerequisites: [
      {
        skillName: 'Fluid Mechanics & Differential Calculus',
        isMet: true,
        requiredDescription: 'Continuity, Navier-Stokes / Euler equations, Bernoulli principle, and thermodynamics.'
      }
    ],
    whatYouWillLearn: [
      'NACA 4-digit and 6-series airfoil generation: camber line, thickness distribution, and chord scaling',
      'Potential flow theory: Source, doublet, vortex panels, and Kutta-Joukowski lift theorem ($L\' = \\rho_\\infty V_\\infty \\Gamma$)',
      'Subsonic boundary layers: Laminar vs turbulent skin friction drag, transition criteria, and aerodynamic stall mechanisms',
      'Finite 3D wing aerodynamics: Prandtl lifting-line theory, downwash velocity, and induced drag ($C_{Di} = \\frac{C_L^2}{\\pi e AR}$)',
      'Compressible gas dynamics: Normal and oblique shock waves, theta-beta-Mach charts, and supersonic Prandtl-Meyer expansion fans',
      'Aircraft longitudinal static stability: Neutral point calculation, center of gravity ($X_{cg}$) limits, and static margin ($C_{m\\alpha} < 0$)',
      'Flight performance envelope: Thrust required vs available, rate of climb, service ceiling, and Breguet range equation',
      'Aerospace propulsion cycles: Real turbojet and high-bypass turbofan station numbering and thrust-specific fuel consumption (TSFC)'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'From commercial passenger jetliners (Boeing, Airbus) to supersonic fighter jets, launch vehicles (SpaceX), and eVTOL urban air mobility aircraft, aerodynamics and propulsion determine payload capacity, fuel efficiency, and flight safety.',
      rolesUsingSkill: ['Aerodynamicist', 'Flight Dynamics Engineer', 'Propulsion Systems Engineer', 'CFD Aerodynamics Specialist'],
      realWorldUsage: 'Optimizing winglet design and high-lift trailing edge flap configurations to reduce cruise fuel burn by 4% on long-haul aircraft.',
      subsequentSkills: ['Hypersonic Aerodynamics & Aerothermodynamics', 'Aeroelasticity & Flutter Analysis', 'Gas Turbine Blade Film Cooling']
    },
    modules: [
      {
        id: 'mod-aero-1-1',
        moduleNumber: 1,
        title: 'Airfoil Theory, 3D Wing Aerodynamics & Induced Drag',
        description: 'Analyze lifting surface aerodynamics from 2D airfoil sections to 3D finite wings with winglets.',
        lessons: [
          {
            id: 'les-aero-1-1-1',
            title: 'Thin Airfoil Theory & Kutta Condition for Lift Generation',
            duration: '45 mins',
            simpleExplanation: 'An airfoil produces lift by creating a pressure difference between its upper and lower surfaces. Thin airfoil theory models the airfoil as a curved camber line with a continuous vortex sheet, enforcing the Kutta condition so airflow leaves the sharp trailing edge smoothly without wrapping around.',
            whyNeeded: 'Thin airfoil theory provides analytical equations for lift slope ($C_{l\\alpha} = 2\\pi$ per radian) and aerodynamic center location (quarter-chord $c/4$), eliminating initial CFD guesswork during preliminary aircraft conceptual design.',
            howItWorks: 'The strength of the vortex sheet $\\gamma(x)$ is solved using Fourier expansion: $C_l = 2\\pi \\left( \\alpha - \\alpha_{L=0} \\right)$, where $\\alpha_{L=0}$ is the zero-lift angle of attack determined by integrating the camber line slope $\\frac{dz}{dx}$. For symmetric airfoils, $\\alpha_{L=0} = 0$ and the aerodynamic center is exactly at the quarter-chord point.',
            syntax: 'C_l = 2 * pi * (alpha_rad - alpha_zero_lift_rad); C_m_quarter_chord = pi / 4 * (A2 - A1)',
            realWorldExample: 'A Boeing 787 wing root airfoil designed with positive camber generates substantial positive lift even when flying at 0 degrees geometric angle of attack.',
            codeSnippet: `# Python: 2D Thin Airfoil Lift Coefficient & Lift Curve Slope
import math

def thin_airfoil_lift(alpha_deg, camber_percent=2.0, camber_pos_tenths=4.0):
    """
    Calculates 2D section lift coefficient Cl for NACA 4-digit airfoil (e.g. NACA 2412).
    camber_percent: first digit (e.g. 2% = 0.02)
    camber_pos_tenths: second digit (e.g. 4 = 0.40 of chord)
    """
    alpha_rad = math.radians(alpha_deg)
    m = camber_percent / 100.0
    p = camber_pos_tenths / 10.0
    
    # Analytical zero-lift angle of attack for NACA 4-digit camber line:
    # alpha_L0 = - (1 / pi) * integral [ (dz/dx) * (cos(theta) - 1) dtheta ]
    # Approximation for standard NACA camber lines:
    alpha_l0_deg = -1.15 * (m * 100.0) # Approx -2.3 deg for NACA 2412
    alpha_l0_rad = math.radians(alpha_l0_deg)
    
    # Theoretical lift curve slope = 2 * pi per radian = 0.110 per degree
    lift_curve_slope_per_rad = 2.0 * math.pi
    c_l = lift_curve_slope_per_rad * (alpha_rad - alpha_l0_rad)
    
    return {
        "alpha_deg": alpha_deg,
        "alpha_zero_lift_deg": round(alpha_l0_deg, 2),
        "cl_lift_coefficient": round(c_l, 3)
    }

# NACA 2412 at 4 degrees angle of attack
airfoil = thin_airfoil_lift(alpha_deg=4.0, camber_percent=2.0, camber_pos_tenths=4.0)
print(f"Zero-Lift Alpha: {airfoil['alpha_zero_lift_deg']}°")
print(f"Section Lift Coefficient Cl: {airfoil['cl_lift_coefficient']}")`,
            expectedOutput: 'Zero-Lift Alpha: -2.3°\nSection Lift Coefficient Cl: 0.691',
            commonMistakes: [
              'Using degrees instead of radians when applying the theoretical $2\\pi$ lift curve slope ($2\\pi \\approx 6.28$ per rad $\\approx 0.11$ per degree)',
              'Extending thin airfoil theory beyond stall angle (typically > 14-16°), where boundary layer separation causes dramatic lift loss',
              'Assuming the aerodynamic center moves with angle of attack (for subsonic linear flow, it remains stationary at $c/4$)'
            ],
            bestPractices: [
              'Apply compressibility Prandtl-Glauert corrections ($C_{l,comp} = \\frac{C_{l,incomp}}{\\sqrt{1 - M_\\infty^2}}$) for flight Mach numbers between 0.3 and 0.7',
              'Design leading edge suction peaks carefully to avoid premature laminar-to-turbulent boundary layer transition',
              'Incorporate aerodynamic twist (washout) so wingtips stall after the wing root, preserving roll aileron control during a stall'
            ],
            practiceQuestion: 'What is the physical Kutta condition at the sharp trailing edge of an airfoil, and why is it necessary to establish unique circulation $\\Gamma$ and lift?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-aero-1',
        title: '3D Wing Induced Drag & Lift-to-Drag Ratio Sizer',
        difficulty: 'Medium',
        description: 'Calculate the total drag coefficient ($C_D$) and Lift-to-Drag ratio ($L/D$) of a finite aircraft wing taking parasitic profile drag ($C_{D0}$), aspect ratio ($AR$), and Oswald span efficiency factor ($e$) into account.',
        requirements: [
          'Aspect ratio: $AR = b^2 / S$',
          'Induced drag coefficient: $C_{Di} = \\frac{C_L^2}{\\pi \\times e \\times AR}$',
          'Total drag coefficient: $C_D = C_{D0} + C_{Di}$',
          'Return L/D ratio and drag breakdown rounded to 2 decimal places'
        ],
        starterCode: `def calculate_wing_drag(wingspan_m, wing_area_m2, cl, cd0=0.020, oswald_e=0.85):
    """
    Returns induced drag, total drag, and L/D ratio.
    """
    # TODO: Calculate AR, CDi, CD, and L/D
    return {"AR": 0.0, "CDi": 0.0, "CD_total": 0.0, "L_over_D": 0.0}`,
        expectedOutput: 'Wing drag breakdown and aerodynamic efficiency calculated accurately.',
        hints: [
          'AR = (wingspan_m ** 2) / wing_area_m2',
          'CDi = (cl ** 2) / (math.pi * oswald_e * AR)'
        ],
        solutionCode: `import math

def calculate_wing_drag(wingspan_m, wing_area_m2, cl, cd0=0.020, oswald_e=0.85):
    ar = (wingspan_m ** 2) / wing_area_m2
    cdi = (cl ** 2) / (math.pi * oswald_e * ar)
    cd_total = cd0 + cdi
    l_over_d = cl / cd_total
    
    return {
        "AR": round(ar, 2),
        "CDi": round(cdi, 4),
        "CD_total": round(cd_total, 4),
        "L_over_D": round(l_over_d, 2)
    }`,
        testCases: [
          { input: 'wingspan=35m, area=120m2, cl=0.5, cd0=0.020, e=0.85', expected: 'AR=10.21, CDi=0.0092, CD_total=0.0292, L/D=17.15' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-aero-1-1',
        question: 'What is the aerodynamic condition for an aircraft to possess longitudinal static stability ($C_{m\\alpha} < 0$)?',
        options: [
          'The aircraft center of gravity (CG) must be positioned strictly ahead of the aerodynamic neutral point, generating a restoring nosedown pitch moment when angle of attack increases',
          'The engines must be placed inside the fuselage',
          'The wing dihedral angle must equal 90 degrees',
          'Lift must equal three times total aircraft weight at all times'
        ],
        correctAnswerIndex: 0,
        explanation: 'For static stability, a disturbance that pitches the aircraft nose UP (+$\\Delta \\alpha$) must automatically induce a restoring nose DOWN pitch moment ($- \\Delta C_m$), meaning $\\frac{d C_m}{d \\alpha} < 0$. This requires the center of gravity to sit forward of the neutral point ($X_{cg} < X_{np}$); the distance between them is the positive static margin.',
        topic: 'Flight Mechanics & Static Stability'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-aero-1',
        title: 'Breguet Range Optimization for Commercial Transport Aircraft',
        objective: 'Implement the Breguet Range equation for a jet-propelled commercial aircraft to determine maximum payload-range trade-off and fuel burn.',
        steps: [
          'Input cruise speed ($V$), lift-to-drag ratio ($L/D$), and thrust-specific fuel consumption ($TSFC$)',
          'Apply Breguet formula: $R = \\frac{V}{g \\times TSFC} \\left( \\frac{L}{D} \\right) \\ln \\left( \\frac{W_{initial}}{W_{final}} \\right)$',
          'Calculate reserve fuel requirements according to FAA 45-minute diversion flight rules',
          'Plot payload vs range chart showing structural limit, fuel capacity limit, and MTOW limit'
        ],
        codeTemplate: `def breguet_jet_range(cruise_speed_mps, tsfc_1_s, l_over_d, w_takeoff_kg, w_empty_kg, payload_kg):
    # Calculate flight range in nautical miles
    pass`,
        verificationCriteria: [
          'Calculated range matches airline mission specification within 1%',
          'Fuel burn per passenger-kilometer confirms modern aerodynamic standards',
          'Reserve fuel margins strictly comply with international IFR flight regulations'
        ]
      }
    ],
    miniProject: {
      title: 'Aerodynamic Design & CFD Optimization of High-Efficiency Regional Wing with Winglets',
      description: 'Design a transonic 3D swept wing for a 70-passenger regional jet operating at Mach 0.78, 35,000 ft. Select supercritical airfoils to delay wave drag, design blended winglets to reduce induced drag by 6%, and verify longitudinal static stability margin in OpenVSP / XFLR5.',
      techStack: ['Python', 'OpenVSP (NASA Aircraft Parametric)', 'XFLR5 / AVL Vortex Lattice', 'NACA Supercritical Coordinates'],
      deliverables: [
        '3D parametric wing geometry with sweep angle (25°), taper ratio (0.28), and geometric washout (-2.5°)',
        'Lift, induced drag, and pitching moment coefficient polar curves ($C_L, C_D, C_m$ vs $\\alpha$)',
        'Spanwise lift distribution comparison verifying near-elliptical lift distribution to minimize induced drag',
        'Neutral point calculation and static margin report proving stability at 15% MAC margin'
      ],
      architectureDiagramText: `[Supercritical Airfoil Section] ---> [Parametric Swept Wing (OpenVSP)]
                                                   |
                                                   v
[Vortex Lattice Method (AVL)] <--- [Blended Winglet Aerodynamics]
         |
         v
[Stability Derivative Polar (Cm vs Alpha)] ---> [Flight Envelope Optimization]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-aero-1-1',
          question: 'What is wave drag in transonic and supersonic aerodynamics, and how do modern supercritical airfoils delay it?',
          options: [
            'Wave drag is the sudden drag rise caused by shock waves forming on the wing upper surface as local airflow exceeds Mach 1; supercritical airfoils have a flattened upper surface and aft camber that weaken shock strength and push the critical Mach number higher',
            'Wave drag is caused by water vapor in clouds hitting the windshield',
            'Wave drag only occurs when aircraft fly over oceans',
            'Wave drag is friction between turbine fan blades and fuel'
          ],
          correctAnswerIndex: 0,
          explanation: 'When an aircraft flies near Mach 0.8, local airflow over curved wings accelerates past Mach 1.0, generating a normal shock wave that creates massive boundary layer separation and wave drag. Supercritical airfoils feature a flattened upper surface that delays shock formation and reduces shock intensity, allowing aircraft to cruise faster with significantly lower fuel burn.',
          topic: 'High-Speed Compressible Aerodynamics'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Supercritical Airfoil Profile Parametrization', layer: 'Geometry', description: 'Generate custom coordinates combining flat upper surface and high aft camber.', keyCode: 'generate_naca_sc_airfoil(camber_crest=0.012, aft_camber_depth=0.035);' },
        { stepNumber: 2, title: 'Vortex Lattice Method (VLM) 3D Wing Formulation', layer: 'Aerodynamics', description: 'Discretize wing into horseshoe vortex panels to solve circulation $\\Gamma$ and downwash.', keyCode: 'vlm_solver->assemble_influence_matrix(); vlm_solver->solve_circulation();' },
        { stepNumber: 3, title: 'Blended Winglet Induced Drag Attenuation', layer: 'Drag Reduction', description: 'Model canted non-planar wingtip extensions to diffuse tip vortex energy into wake.', keyCode: 'add_winglet(height_m=1.8, cant_angle_deg=75.0, sweep_deg=45.0);' },
        { stepNumber: 4, title: 'Prandtl-Glauert Compressibility & Wave Drag Onset', layer: 'High Speed', description: 'Estimate drag divergence Mach number ($M_{dd}$) and shock wave boundary layer interaction.', keyCode: 'cd_wave = 20.0 * (mach_flight - mach_crit) ** 4 if mach_flight > mach_crit else 0.0;' },
        { stepNumber: 5, title: 'Neutral Point & Static Margin Pitch Trim', layer: 'Stability', description: 'Calculate pitching moment curve slope and size horizontal stabilizer volume ratio.', keyCode: 'neutral_point = x_ac_wing + (cl_alpha_tail / cl_alpha_wing) * eta_tail * (s_tail / s_wing) * l_tail;' },
        { stepNumber: 6, title: 'High-Bypass Turbofan Station Thermodynamic Cycle', layer: 'Propulsion', description: 'Analyze Brayton stations (inlet, fan, compressor, combustor, turbine, mixer, nozzle) for net thrust.', keyCode: 'net_thrust_n = mass_flow_core * (v_core_exit - v_flight) + mass_flow_bypass * (v_fan_exit - v_flight);' }
      ],
      interviewQuestions: [
        {
          id: 'iq-aero-1',
          topic: 'Induced Drag',
          question: 'What physical phenomenon creates Induced Drag on finite 3D wings, and why does an elliptical lift distribution produce the minimum possible induced drag for a planar wing?',
          keyPointsExpected: [
            'High pressure beneath the wing spills around the wingtips toward the low pressure above, forming powerful wingtip vortices',
            'Wingtip vortices induce a downward velocity component (downwash $w$) across the entire wingspan',
            'Downwash tilts the local relative wind downward by an induced angle $\\alpha_i$, titling the total lift vector backward to create a drag component ($D_i = L \\sin \\alpha_i$)',
            'Max Munk theorem proves that an elliptical circulation distribution generates a completely uniform downwash across the span, minimizing kinetic energy wasted in the trailing vortex wake'
          ],
          sampleAnswer: 'On a 3D finite wing, higher pressure air on the lower surface curls around the wingtips toward the low pressure upper surface, shedding continuous trailing vortices. These vortices induce a downward airflow velocity—downwash—across the span. Because the incoming freestream air is tilted downward by the induced angle of attack $\\alpha_i$, the aerodynamically generated lift vector tilts backward. The component of lift acting parallel to the flight direction is Induced Drag ($D_i$). Ludwig Prandtl proved mathematically that an elliptical spanwise circulation distribution produces a completely uniform downwash along the entire span, which minimizes the kinetic energy shed into the wake and yields the absolute minimum possible induced drag ($C_{Di} = \\frac{C_L^2}{\\pi AR}$).'
        }
      ]
    }
  }
};
