import { SkillDeepDive } from '../roadmapDeepDiveData';

export const ENGINEERING_DEEP_DIVES: Record<string, SkillDeepDive> = {
  // =========================================================================
  // ECE: EMBEDDED C & FIRMWARE
  // =========================================================================
  'embedded-c': {
    stepId: 'rd-ece-01',
    skillName: 'Embedded C & Microcontroller Firmware',
    overviewSummary:
      'Master low-level ARM Cortex-M hardware manipulation, volatile memory access, deterministic interrupt hygiene, DMA streaming, and MISRA-C safety-critical firmware architecture.',
    keyArchitecturalTakeaways: [
      'Always qualify peripheral hardware registers as volatile to prevent compiler dead-code elimination in -O2/-O3 optimization.',
      'Keep ISRs sub-10 microseconds: defer processing to FreeRTOS worker tasks via message queues or semaphores.',
      'Avoid dynamic memory allocation (malloc/free) in safety-critical firmware to prevent heap fragmentation deadlocks.'
    ],
    deepDiveResources: [
      {
        title: 'ARM Cortex-M Generic User Guide & Programming Model',
        source: 'ARM Developer',
        url: 'https://developer.arm.com/documentation',
        type: 'Official Documentation',
        readTime: '45 mins',
        description: 'Complete architecture reference for ARM Cortex-M4 registers, NVIC priorities, and exception handling.',
        keyTopicsCovered: ['NVIC Priority Grouping', 'SysTick Timer', 'Fault Handling (HardFault/BusFault)', 'Memory Protection Unit (MPU)']
      },
      {
        title: 'MISRA-C:2012 Guidelines for the Use of C in Critical Systems',
        source: 'MISRA Consortium',
        url: 'https://misra.org.uk',
        type: 'Specification',
        readTime: '60 mins',
        description: 'The global standard for automotive and aerospace embedded software reliability.',
        keyTopicsCovered: ['Pointer Arithmetic Rules', 'Unchecked Type Conversions', 'Static Analysis & MISRA Compliance']
      }
    ],
    cheatSheets: [
      {
        category: 'Bit Manipulation',
        title: 'Atomic Bit-Banding & Register Masking',
        syntaxOrCode: `// Atomic bit manipulation without race condition\n#define BIT_BAND_PERIPH(reg, bit) (*((volatile uint32_t*)(0x42000000 + (((uint32_t)&(reg) - 0x40000000) * 32) + ((bit) * 4))))`,
        explanation: 'Bit-banding maps each bit in a 1MB peripheral region to a separate 32-bit word, allowing atomic single-cycle writes without read-modify-write race hazards.',
        proTip: 'Use bit-banding or BSRR registers instead of |= when multiple ISRs access the same GPIO port.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-ece-1',
        question: 'What happens when a HardFault exception occurs on an ARM Cortex-M processor, and how do you debug it?',
        difficulty: 'Senior',
        frequency: 'Critical',
        topic: 'Firmware Debugging',
        shortAnswer: 'HardFault is the default exception triggered on unhandled bus errors, memory access violations, or invalid instructions.',
        inDepthAnswer: 'When a HardFault occurs, the Cortex-M processor stacks registers (R0-R3, R12, LR, PC, xPSR) on the current stack (MSP or PSP). In the HardFault_Handler, check the Configurable Fault Status Register (CFSR). A PRECISERR indicates an invalid memory address access (dereferencing a null or corrupted pointer). An UNDEFINSTR indicates executing non-code memory. Examining the stacked Program Counter (PC) pinpoints the exact offending C instruction.',
        sourceAttribution: 'The Definitive Guide to ARM Cortex-M3 and Cortex-M4 Processors (Joseph Yiu)'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Executing Blocking Delays (HAL_Delay) Inside Interrupt Service Routines',
        symptom: 'Complete microcontroller deadlock; system freezes permanently.',
        badCodeSnippet: `void EXTI0_IRQHandler(void) {\n    HAL_Delay(100); // CRASH! Systick has same or lower priority\n}`,
        productionStandardSnippet: `void EXTI0_IRQHandler(void) {\n    BaseType_t xHigherPriorityTaskWoken = pdFALSE;\n    vTaskNotifyGiveFromISR(xWorkerTaskHandle, &xHigherPriorityTaskWoken);\n    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);\n}`,
        explanation: 'HAL_Delay relies on the SysTick interrupt counter. If the ISR runs at a priority equal to or higher than SysTick, SysTick never increments, causing HAL_Delay to loop forever in an infinite hang.'
      }
    ]
  },

  // =========================================================================
  // EEE: POWER SYSTEMS
  // =========================================================================
  'power-systems': {
    stepId: 'rd-eee-01',
    skillName: 'Power Systems Analysis & Smart Grid Engineering',
    category: 'Electrical Power',
    overviewSummary:
      'Master transmission grid modeling, per-unit normalization, numerical load flow solutions, symmetrical component fault analysis, and digital substation protection.',
    keyArchitecturalTakeaways: [
      'Per-unit normalization simplifies multi-voltage networks by removing transformer turns ratios from single-line models.',
      'Newton-Raphson power flow quadratic convergence is reliable; singularity in the Jacobian signifies voltage collapse.',
      'Differential protection (ANSI 87) provides instantaneous 100% unit protection with harmonic restraint against transformer inrush.'
    ],
    deepDiveResources: [
      {
        title: 'IEEE Guide for Protective Relay Applications to Power Transformers',
        source: 'IEEE PES',
        url: 'https://standards.ieee.org',
        type: 'Specification',
        readTime: '55 mins',
        description: 'Comprehensive standard for differential protection, overcurrent coordination, and ground fault protection.',
        keyTopicsCovered: ['ANSI 87T Biased Differential', '2nd Harmonic Inrush Restraint', '5th Harmonic Overexcitation']
      }
    ],
    cheatSheets: [
      {
        category: 'Per-Unit System',
        title: 'Impedance Base Conversion Formula',
        syntaxOrCode: `Z_new = Z_old * (V_old / V_new)^2 * (S_new / S_old)`,
        explanation: 'Converts equipment per-unit impedance from its nameplate MVA/kV rating to the common system study base.',
        proTip: 'Always verify that voltage bases on either side of a transformer match the exact transformer nominal turns ratio.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-eee-1',
        question: 'Why is reactive power (Q) management critical for preventing voltage collapse in transmission grids?',
        difficulty: 'Senior',
        frequency: 'Critical',
        topic: 'Grid Voltage Stability',
        shortAnswer: 'Reactive power maintains electric field excitation across lines and transformers; shortage causes rapid voltage drop leading to blackouts.',
        inDepthAnswer: 'Inductive components like transmission lines and induction motors consume reactive power. Because transmission lines have high inductive reactance ($X \\gg R$), transferring active power over distance causes a voltage drop proportional to reactive flow ($V_1 - V_2 \\approx \\frac{R P + X Q}{V}$). If reactive power is not supplied locally by capacitor banks, STATCOMs, or synchronous condensers, lines draw reactive power from distant generators, plunging bus voltages into an uncontrollable collapse.',
        sourceAttribution: 'Power System Stability and Control (Prabha Kundur)'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Assuming Symmetrical Currents During Line-to-Ground Faults',
        symptom: 'Undersized grounding equipment and catastrophic neutral bus flashover.',
        badCodeSnippet: `// WRONG: Assuming LG fault current is 1/3 of 3-phase fault\nI_fault = I_3phase / 3;`,
        productionStandardSnippet: `// CORRECT: Using symmetrical sequence network loop\nI_fault_lg = 3.0 * V_prefault / (Z1 + Z2 + Z0 + 3.0 * Z_ground);`,
        explanation: 'In solidly grounded systems near generation substations, $Z_0$ can be smaller than $Z_1$, making single line-to-ground fault current actually exceed the 3-phase symmetrical fault current.'
      }
    ]
  },

  // =========================================================================
  // MECHANICAL: THERMODYNAMICS & POWER SYSTEMS
  // =========================================================================
  'thermodynamics': {
    stepId: 'rd-mech-01',
    skillName: 'Engineering Thermodynamics & Thermal Power Systems',
    category: 'Thermal & Fluid Sciences',
    overviewSummary:
      'Master the First and Second Laws of Thermodynamics, open control volume steady flow energy equations, vapor and gas power cycles (Rankine, Brayton, CCGT), and industrial heat exchanger sizing.',
    keyArchitecturalTakeaways: [
      'Steady Flow Energy Equation (SFEE) applies across all continuous flow turbomachinery and heat exchangers.',
      'Reheating and regenerative feedwater heating in Rankine cycles boost efficiency while keeping exhaust steam moisture under 12%.',
      'Combined Cycle Gas Turbines (CCGT) break the 60% efficiency threshold by cascading high-temperature Brayton exhaust into bottoming steam loops.'
    ],
    deepDiveResources: [
      {
        title: 'IAPWS Industrial Formulation 1997 for the Thermodynamic Properties of Water and Steam',
        source: 'IAPWS / ASME',
        url: 'http://www.iapws.org',
        type: 'Official Documentation',
        readTime: '50 mins',
        description: 'The international standard equation of state for water and steam properties across power generation equipment.',
        keyTopicsCovered: ['Enthalpy & Entropy Equations of State', 'Supercritical Fluid Regions', 'Transport Properties']
      }
    ],
    cheatSheets: [
      {
        category: 'Turbomachinery',
        title: 'Steady Flow Energy Equation (SFEE)',
        syntaxOrCode: `q - w = (h2 - h1) + (V2^2 - V1^2)/2000 + g*(z2 - z1)/1000`,
        explanation: 'Enforces the First Law on continuous open flow systems. For adiabatic turbines with negligible elevation change, $w = h_1 - h_2$.',
        proTip: 'Divide velocity squared by 2000 to convert Joules/kg to kiloJoules/kg when summing with enthalpy.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-mech-1',
        question: 'Why does steam turbine exhaust quality (dryness fraction x) need to remain above 0.88 (88%)?',
        difficulty: 'Mid',
        frequency: 'High',
        topic: 'Steam Turbines',
        shortAnswer: 'Moisture droplets moving at supersonic speeds erode and destroy low-pressure turbine titanium blades.',
        inDepthAnswer: 'In the final stages of a low-pressure steam turbine, steam expands into the two-phase wet region. Water droplets condense and impact turbine blades rotating at 3000/3600 RPM with supersonic tip speeds (>450 m/s). This high-velocity liquid droplet impingement causes severe pitting and mechanical erosion on blade leading edges. Maintaining $x \\ge 0.88$ ensures blade longevity across 20+ years of operation.',
        sourceAttribution: 'Turbomachinery Engineering Standards & ASME PTC 6'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Applying Ideal Gas Equations (Pv = RT) to Saturated or Superheated Steam',
        symptom: 'Massive errors (> 40%) in calculated boiler mass flow and turbine power.',
        badCodeSnippet: `// WRONG: Treating high-pressure steam as ideal air\nspecific_volume = (287.0 * T_kelvin) / P_pascals;`,
        productionStandardSnippet: `// CORRECT: Querying IAPWS-IF97 Steam Formulation\nspecific_volume = 1.0 / PropsSI("D", "P", p_pa, "T", t_k, "Water");`,
        explanation: 'Water molecules exhibit strong intermolecular hydrogen bonds. Near saturation and at high pressures (150-250 bar), steam deviates radically from ideal gas behavior.'
      }
    ]
  },

  // =========================================================================
  // CIVIL: STRUCTURAL ENGINEERING
  // =========================================================================
  'staad-pro': {
    stepId: 'rd-civil-01',
    skillName: 'Structural Engineering, RCC & Steel Design',
    category: 'Structural Engineering',
    overviewSummary:
      'Master Limit State Design according to IS 456/ACI 318, flexural and shear detailing in reinforced concrete, earthquake response spectrum analysis (IS 1893), and finite element frame modeling.',
    keyArchitecturalTakeaways: [
      'Design under-reinforced flexural members to guarantee gradual ductile yielding before concrete compression crushing.',
      'Adhere to the Strong-Column Weak-Beam design rule to prevent fatal progressive building pancake collapses during earthquakes.',
      'Rigid diaphragm constraints accurately model the immense in-plane stiffness of cast-in-place floor slabs.'
    ],
    deepDiveResources: [
      {
        title: 'IS 456:2000 Plain and Reinforced Concrete - Code of Practice',
        source: 'Bureau of Indian Standards',
        url: 'https://standardsbis.bsbedge.com',
        type: 'Specification',
        readTime: '60 mins',
        description: 'The national standard for structural design and execution of reinforced concrete buildings and bridges.',
        keyTopicsCovered: ['Limit State of Collapse (Flexure & Shear)', 'Serviceability (Deflection & Cracking)', 'Development Length (Ld)']
      }
    ],
    cheatSheets: [
      {
        category: 'RCC Beam Design',
        title: 'Under-Reinforced Moment Capacity Limiting Formula',
        syntaxOrCode: `Mu_lim = 0.138 * fck * b * d^2 (for Fe 415); Mu_lim = 0.133 * fck * b * d^2 (for Fe 500)`,
        explanation: 'Calculates maximum balanced moment capacity before compression steel is required.',
        proTip: 'Always check that actual factored moment $M_u \\le M_{u,lim}$ to prevent brittle over-reinforced failure modes.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-civ-1',
        question: 'What is Development Length (Ld) in reinforced concrete, and what happens if rebar lacks sufficient embedment length?',
        difficulty: 'Mid',
        frequency: 'High',
        topic: 'Concrete Detailing',
        shortAnswer: 'Development length is the minimum embedment depth required to transfer full yield stress from steel to concrete via bond stress.',
        inDepthAnswer: 'Under bending, tensile forces develop in the steel rebar. For the steel to reach its design strength without slipping out of the concrete, it must be embedded a sufficient distance $L_d = \\frac{\\phi \\sigma_s}{4 \\tau_{bd}}$. If development length is insufficient, the rebar pulls out of the concrete matrix under tensile load, causing bond failure and sudden brittle member collapse.',
        sourceAttribution: 'Reinforced Concrete Design (Pillai & Menon / ACI 318 Commentary)'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Creating Soft Stories by Eliminating Ground-Floor Masonry Infill for Parking',
        symptom: 'Pancake collapse of ground floor columns during earthquake ground shaking.',
        badCodeSnippet: `// Architectural layout: Open ground floor stilt parking without concrete shear walls`,
        productionStandardSnippet: `// Provide reinforced concrete shear walls around core or design stilt columns for 2.5x shear amplification`,
        explanation: 'Open ground floors have dramatically lower lateral stiffness than partition-dense upper floors, concentrating all earthquake displacement into ground floor column hinges.'
      }
    ]
  },

  // =========================================================================
  // ROBOTICS: ROS 2
  // =========================================================================
  'robotics-ros': {
    stepId: 'rd-robotics-01',
    skillName: 'Robot Operating System (ROS 2) & Autonomous Navigation',
    category: 'Robotics & Automation',
    overviewSummary:
      'Master distributed robotics architectures, DDS middleware, URDF/Xacro kinematic modeling, tf2 coordinate frames, LiDAR SLAM mapping, and Nav2 autonomous mobile robot navigation.',
    keyArchitecturalTakeaways: [
      'ROS 2 DDS communication enables deterministic real-time robotics without a single point of failure.',
      'tf2 coordinate frame hierarchy links perception, localization, and navigation mathematically.',
      'Extended Kalman Filters fuse high-frequency IMU gyro updates with low-frequency wheel odometry to eliminate drift.'
    ],
    deepDiveResources: [
      {
        title: 'ROS 2 Humble / Iron Core Architectural Documentation',
        source: 'Open Robotics',
        url: 'https://docs.ros.org/en/humble',
        type: 'Official Documentation',
        readTime: '45 mins',
        description: 'Complete documentation for nodes, executors, DDS QoS policies, and intra-process communication.',
        keyTopicsCovered: ['rclcpp & rclpy Architecture', 'QoS Reliability & Durability', 'Lifecycle Nodes', 'Composition']
      }
    ],
    cheatSheets: [
      {
        category: 'tf2 Transforms',
        title: 'Coordinate Transformation Lookup',
        syntaxOrCode: `geometry_msgs::msg::TransformStamped t = tf_buffer_->lookupTransform("map", "base_link", tf2::TimePointZero);`,
        explanation: 'Retrieves the latest available geometric transformation between two coordinate frames in the robot tree.',
        proTip: 'Use TimePointZero to retrieve the latest transform; specify exact timestamps when synchronizing with sensor cameras.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-rob-1',
        question: 'Why did ROS 2 replace the ROS 1 rosmaster architecture with OMG Data Distribution Service (DDS)?',
        difficulty: 'Senior',
        frequency: 'High',
        topic: 'ROS 2 Architecture',
        shortAnswer: 'ROS 1 had a single point of failure (rosmaster) and lacked real-time guarantees, multi-robot discovery, and industrial security.',
        inDepthAnswer: 'In ROS 1, if the centralized `roscore` master process died, the entire robot crashed. Furthermore, ROS 1 used unencrypted TCP/UDP sockets with no Quality of Service (QoS) controls, making it unsuitable for flaky wireless networks or safety-critical real-time automotive deployments. ROS 2 utilizes industry-standard DDS (e.g. CycloneDDS, FastDDS) which provides peer-to-peer automatic discovery, zero single point of failure, configurable QoS (transient local, best effort, deadline enforcement), and DDS-Security encryption.',
        sourceAttribution: 'Open Robotics ROS 2 Design Articles & OMG DDS Specification'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Blocking the Main ROS 2 Executor Thread with Long Computations',
        symptom: 'Dropped sensor messages, frozen callbacks, and jerky robot motion.',
        badCodeSnippet: `void image_callback(const Image::SharedPtr msg) {\n    std::this_thread::sleep_for(100ms); // BLOCKS EXECUTOR!\n}`,
        productionStandardSnippet: `// Use MultiThreadedExecutor with ReentrantCallbackGroup or dispatch to worker thread pool`,
        explanation: 'SingleThreadedExecutor runs all callbacks sequentially. A blocking sleep or CPU loop stops all timer and sensor callbacks across that node.'
      }
    ]
  },

  // =========================================================================
  // AUTOMOBILE: EV TECH & BMS
  // =========================================================================
  'ev-tech': {
    stepId: 'rd-auto-01',
    skillName: 'Electric Vehicle Technology & Battery Management Systems (BMS)',
    category: 'Automotive & Mobility',
    overviewSummary:
      'Master automotive lithium-ion cell electrochemical models, SoC/SoH Kalman filtering, passive/active cell balancing, high-voltage contactor pre-charge sequencing, and ISO 26262 functional safety.',
    keyArchitecturalTakeaways: [
      'High-voltage traction batteries must remain completely floating from chassis ground to prevent single-fault shock hazards.',
      'Pre-charge contactors with series power resistors are mandatory to protect main contactors from inrush current into inverter DC-link capacitors.',
      'Extended Kalman Filters combine current integration with electrochemical OCV curves to eliminate SoC estimation drift.'
    ],
    deepDiveResources: [
      {
        title: 'ISO 26262 Road Vehicles - Functional Safety for High-Voltage E/E Systems',
        source: 'International Organization for Standardization',
        url: 'https://www.iso.org',
        type: 'Specification',
        readTime: '60 mins',
        description: 'Automotive safety integrity levels (ASIL-D) for battery management systems and inverter motor control.',
        keyTopicsCovered: ['Hazard Analysis and Risk Assessment (HARA)', 'Single Point Fault Metric (SPFM)', 'Diagnostic Coverage']
      }
    ],
    cheatSheets: [
      {
        category: 'High Voltage Safety',
        title: 'Pre-Charge Contactor Sequencing Rule',
        syntaxOrCode: `if (V_inverter_cap >= 0.95 * V_battery_pack) { Close(Main_Pos_Contactor); Open(Precharge_Contactor); }`,
        explanation: 'Ensures capacitor voltage matches pack voltage within 5% before closing the zero-resistance main contactor.',
        proTip: 'Always implement a 500ms timeout on precharge to detect shorted inverters or defective precharge resistors.'
      }
    ],
    interviewFaqs: [
      {
        id: 'faq-auto-1',
        question: 'What is the root cause of capacity fade and internal resistance increase in lithium-ion battery cells over hundreds of cycles?',
        difficulty: 'Senior',
        frequency: 'Critical',
        topic: 'Battery Degradation Mechanisms',
        shortAnswer: 'Continuous growth of the Solid Electrolyte Interphase (SEI) layer consumes active lithium ions while mechanical cracking degrades active material.',
        inDepthAnswer: 'During charging and discharging, chemical side reactions consume free lithium ions from the electrolyte to continuously rebuild and thicken the passivation SEI layer on the graphite anode. This irreversibly traps lithium, causing capacity fade. Simultaneously, repetitive intercalation and de-intercalation of lithium causes 10% volumetric expansion and contraction of electrode particles, leading to micro-cracking and loss of electrical contact, which increases internal ohmic resistance ($R_0$) and causes high-rate performance degradation.',
        sourceAttribution: 'Electrochemical Energy Storage & Battery Systems Engineering'
      }
    ],
    productionPitfalls: [
      {
        antiPatternTitle: 'Fast-Charging Lithium Cells at Freezing Temperatures (< 0°C)',
        symptom: 'Metallic lithium plating on graphite anode leading to internal micro-short circuits and thermal runaway fire.',
        badCodeSnippet: `if (charge_requested) { apply_fast_charge_current(150.0); }`,
        productionStandardSnippet: `if (cell_temp_c < 0.0) { limit_current = 0.0; turn_on_battery_pack_heaters(); }`,
        explanation: 'At sub-zero temperatures, solid-state diffusion of lithium into graphite is extremely sluggish. High charge currents force lithium ions to deposit as pure metallic lithium dendrites on the anode surface, piercing the separator.'
      }
    ]
  }
};

// Wire aliases
const DEEP_DIVE_ALIASES: Record<string, string> = {
  'rd-ece-01': 'embedded-c',
  'microcontrollers': 'embedded-c',
  'rd-eee-01': 'power-systems',
  'rd-mech-01': 'thermodynamics',
  'ansys': 'thermodynamics',
  'rd-civil-01': 'staad-pro',
  'rd-robotics-01': 'robotics-ros',
  'rd-auto-01': 'ev-tech',
  'aspen-plus': 'aspen-plus',
  'bioinformatics': 'bioinformatics',
  'aerodynamics': 'aerodynamics'
};

for (const [alias, targetKey] of Object.entries(DEEP_DIVE_ALIASES)) {
  if (ENGINEERING_DEEP_DIVES[targetKey]) {
    ENGINEERING_DEEP_DIVES[alias] = {
      ...ENGINEERING_DEEP_DIVES[targetKey],
      stepId: alias
    };
  }
}
