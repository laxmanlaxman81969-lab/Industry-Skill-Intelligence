import { SkillCurriculum } from '../roadmapCurriculumData';

export const ROBOTICS_AUTO_AERO_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // ROBOTICS: ROS 2 & AUTONOMOUS MANIPULATION
  // =========================================================================
  'robotics-ros': {
    roadmapStepId: 'rd-robotics-01',
    skillName: 'Robot Operating System (ROS 2) & Autonomous Navigation',
    category: 'Robotics & Automation',
    industryDemand: 94,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 35,
    prerequisites: [
      {
        skillName: 'Python & Modern C++ (C++17)',
        isMet: true,
        requiredDescription: 'Object-oriented programming, standard template library (STL), pointers, and multi-threading.'
      }
    ],
    whatYouWillLearn: [
      'ROS 2 architecture: Data Distribution Service (DDS), computational graph, nodes, topics, services, and actions',
      'Unified Robot Description Format (URDF) and Xacro parametric 3D kinematic modeling',
      'Denavit-Hartenberg (D-H) convention for forward and inverse kinematics of 6-DOF robotic arms',
      'Transforms (tf2) coordinate frame broadcast: tracking base_link, odom, map, and end-effector frames',
      'Sensor interfacing: LiDAR LaserScan, depth camera PointCloud2, and IMU sensor fusion via robot_localization EKF',
      'Autonomous Mobile Robots (AMR): SLAM toolbox (cartographer) and 2D grid costmaps',
      'Nav2 stack: Path planning algorithms (A*, NavFn, Smac Planner) and local trajectory tracking (DWB, MPPI)',
      'Motion planning for manipulators with MoveIt 2: Collision detection, trajectory generation, and OMPL algorithms'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Autonomous mobile robots in Amazon fulfillment warehouses, surgical robotic arms, self-driving shuttles, and industrial manufacturing cells all standardize on ROS 2 for distributed real-time perception, localization, and control.',
      rolesUsingSkill: ['Robotics Software Engineer', 'Autonomous Systems Developer', 'Perception Engineer', 'Motion Planning Specialist'],
      realWorldUsage: 'Programming warehouse mobile robots to navigate dynamic aisles while avoiding human workers using 2D LiDAR and Nav2.',
      subsequentSkills: ['Model Predictive Control (MPC)', 'Reinforcement Learning in Robotics (Isaac Sim)', 'Visual-Inertial Odometry (VIO)']
    },
    modules: [
      {
        id: 'mod-rob-1-1',
        moduleNumber: 1,
        title: 'ROS 2 Core Architecture, DDS & Kinematic Modeling',
        description: 'Build modular, distributed robotics nodes in C++ and Python using ROS 2 Galactic/Humble standards.',
        lessons: [
          {
            id: 'les-rob-1-1-1',
            title: 'ROS 2 Computational Graph: Topics, Services & Actions',
            duration: '45 mins',
            simpleExplanation: 'A robot consists of dozens of independent programs (nodes) running simultaneously: a camera node, a motor driver node, a path planning node. ROS 2 allows these programs to communicate seamlessly over Ethernet or shared memory using Data Distribution Service (DDS).',
            whyNeeded: 'Monolithic robot software crashes if one sensor glitches. ROS 2 provides decentralized, fault-tolerant publish-subscribe pipelines with configurable Quality of Service (QoS) for real-time sensor streams.',
            howItWorks: 'Nodes publish to named Topics for continuous data streams (e.g. `/scan` for LiDAR). Nodes call Services for request-reply RPCs (e.g. `/calibrate_imu`). Nodes call Actions for long-running preemptible tasks (e.g. `NavigateToPose`) that provide continuous feedback.',
            syntax: 'class MinimalPublisher : public rclcpp::Node { ... publisher_->publish(message); }',
            realWorldExample: 'A warehouse AMR sends an Action goal to drive to aisle 4. The Nav2 action server streams remaining distance feedback every 100ms and halts safely if an emergency obstacle is detected.',
            codeSnippet: `// ROS 2 C++ Publisher Node for Velocity Commands (geometry_msgs/Twist)
#include <chrono>
#include <memory>
#include "rclcpp/rclcpp.hpp"
#include "geometry_msgs/msg/twist.hpp"

using namespace std::chrono_literals;

class VelocityPublisher : public rclcpp::Node {
public:
    VelocityPublisher() : Node("velocity_publisher_node") {
        publisher_ = this->create_publisher<geometry_msgs::msg::Twist>("/cmd_vel", 10);
        timer_ = this->create_wall_timer(
            50ms, std::bind(&VelocityPublisher::publish_velocity, this)); // 20 Hz loop
        RCLCPP_INFO(this->get_logger(), "Velocity controller initialized at 20 Hz");
    }

private:
    void publish_velocity() {
        auto msg = geometry_msgs::msg::Twist();
        msg.linear.x = 0.5;   // Drive forward at 0.5 m/s
        msg.angular.z = 0.1;  // Turn slowly at 0.1 rad/s
        publisher_->publish(msg);
    }
    rclcpp::Publisher<geometry_msgs::msg::Twist>::SharedPtr publisher_;
    rclcpp::TimerBase::SharedPtr timer_;
};

int main(int argc, char * argv[]) {
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<VelocityPublisher>());
    rclcpp::shutdown();
    return 0;
}`,
            expectedOutput: 'Publishes 20 Hz Twist velocity commands on /cmd_vel observed by differential drive controllers.',
            commonMistakes: [
              'Blocking the main ROS 2 executor thread with long sleep() or heavy calculations, starving callbacks and dropping sensor packets',
              'Mismatching QoS profiles between publisher and subscriber (e.g. attempting to subscribe to a Best-Effort sensor stream with a Reliable QoS requirement)',
              'Hardcoding coordinate frame names instead of taking them from parameters, breaking multi-robot deployments'
            ],
            bestPractices: [
              'Use Component Nodes and intra-process zero-copy communication for high-bandwidth image and point cloud pipelines',
              'Always use standard geometry_msgs and sensor_msgs rather than creating custom messages unless strictly necessary',
              'Manage node lifecycles with `rclcpp_lifecycle` (Unconfigured, Inactive, Active, Finalized) for deterministic robot startup'
            ],
            practiceQuestion: 'What is the fundamental difference between a ROS 2 Service and a ROS 2 Action, and when must you use an Action instead of a Service?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-rob-1',
        title: 'Forward Kinematics of 2-Link Planar Arm via DH Transformation',
        difficulty: 'Medium',
        description: 'Calculate the end-effector $(x, y)$ position and orientation of a 2-DOF planar robotic arm given joint angles $(\\theta_1, \\theta_2)$ and link lengths $(L_1, L_2)$ using homogeneous transformation matrices.',
        requirements: [
          'Formulate homogeneous transformation matrix for each link: $T_i = \\begin{bmatrix} \\cos\\theta_i & -\\sin\\theta_i & 0 & L_i \\cos\\theta_i \\\\ \\sin\\theta_i & \\cos\\theta_i & 0 & L_i \\sin\\theta_i \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{bmatrix}$',
          'Multiply $T_{02} = T_1 \\times T_2$ to find global end-effector pose',
          'Return coordinates rounded to 3 decimal places'
        ],
        starterCode: `import math
import numpy as np

def forward_kinematics_2link(theta1_rad, theta2_rad, L1=1.0, L2=0.8):
    """
    Returns (x, y) coordinates of end-effector.
    """
    # TODO: Calculate transformation matrix and extract (x, y)
    return (0.0, 0.0)`,
        expectedOutput: 'End-effector coordinates matching analytical trigonometric formulation within 0.001m.',
        hints: [
          'Analytic solution: $x = L_1 \\cos(\\theta_1) + L_2 \\cos(\\theta_1 + \\theta_2)$',
          'Analytic solution: $y = L_1 \\sin(\\theta_1) + L_2 \\sin(\\theta_1 + \\theta_2)$'
        ],
        solutionCode: `import math
import numpy as np

def forward_kinematics_2link(theta1_rad, theta2_rad, L1=1.0, L2=0.8):
    # Homogeneous transformation matrices
    t1 = np.array([
        [math.cos(theta1_rad), -math.sin(theta1_rad), 0, L1 * math.cos(theta1_rad)],
        [math.sin(theta1_rad),  math.cos(theta1_rad), 0, L1 * math.sin(theta1_rad)],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ])
    
    t2 = np.array([
        [math.cos(theta2_rad), -math.sin(theta2_rad), 0, L2 * math.cos(theta2_rad)],
        [math.sin(theta2_rad),  math.cos(theta2_rad), 0, L2 * math.sin(theta2_rad)],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ])
    
    t02 = np.dot(t1, t2)
    x_pos = round(t02[0, 3], 3)
    y_pos = round(t02[1, 3], 3)
    return (x_pos, y_pos)`,
        testCases: [
          { input: 'theta1=0, theta2=0, L1=1.0, L2=0.8', expected: '(1.8, 0.0)' },
          { input: 'theta1=pi/2, theta2=0, L1=1.0, L2=0.8', expected: '(0.0, 1.8)' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-rob-1-1',
        question: 'What is the role of the "tf2" library in ROS 2 robotics systems?',
        options: [
          'It compiles Python code into C++ binaries',
          'It maintains a buffered coordinate frame tree over time, allowing nodes to transform sensor data (e.g. camera detections) into arbitrary coordinate systems (e.g. robot base or map)',
          'It regulates battery charging voltage',
          'It encrypts WiFi packets sent between robots'
        ],
        correctAnswerIndex: 1,
        explanation: 'tf2 tracks multiple coordinate frames over time in a tree structure. It allows a node to easily ask questions like: "Where was this pedestrian seen by the 3D camera relative to the world map coordinate frame 50 milliseconds ago?"',
        topic: 'Coordinate Transformations & tf2'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-rob-1',
        title: 'LiDAR-Based 2D Costmap & Obstacle Avoidance Filter',
        objective: 'Write a ROS 2 node that subscribes to `/scan` (sensor_msgs/LaserScan), detects obstacles within a 0.8m safety zone, and sends emergency stop commands to `/cmd_vel`.',
        steps: [
          'Create subscriber to `/scan` with SensorData QoS profile',
          'Filter out inf and NaN ranges from LiDAR array',
          'Calculate minimum obstacle distance within a 90-degree forward field of view',
          'If distance < 0.8m, immediately publish zero linear velocity and sound warning buzzer'
        ],
        codeTemplate: `def scan_callback(self, msg: LaserScan):
    # Iterate through forward ranges
    # Check threshold and halt if necessary
    pass`,
        verificationCriteria: [
          'Emergency halt triggers in under 25ms upon obstacle introduction',
          'Zero false positives triggered by out-of-range sensor noise',
          'Robot resumes motion safely once path clears'
        ]
      }
    ],
    miniProject: {
      title: 'Autonomous Mobile Robot (AMR) Navigation & Docking Stack',
      description: 'Develop a complete autonomous warehouse robot in ROS 2 Humble and Gazebo. Implement SLAM mapping of an industrial warehouse, configure Nav2 costmaps with dynamic obstacle inflation, and create a precision visual AprilTag docking routine to recharge at a charging station.',
      techStack: ['ROS 2 Humble', 'Nav2 Navigation Stack', 'Gazebo Physics Simulator', 'AprilTag 3 Vision', 'C++ / Python'],
      deliverables: [
        'URDF/Xacro robot model with differential drive physics plugins and 2D LiDAR',
        '2D occupancy grid map generated via SLAM Toolbox',
        'Nav2 configuration files with tuned DWB local planner parameters',
        'Custom Behavior Tree node for autonomous recharge docking sequence'
      ],
      architectureDiagramText: `[2D LiDAR + Odom] ---> [SLAM Toolbox] ---> [Global Map (/map)]
           |                                              |
           v                                              v
[Local Costmap] <--- [Nav2 BT Navigator] <--- [Global Path Planner (A*)]
           |
           v
[DWB Local Controller] ---> [/cmd_vel] ---> [Robot Differential Motors]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-rob-1-1',
          question: 'What is a kinematic singularity in a 6-DOF robotic manipulator, and why is it dangerous in velocity control?',
          options: [
            'A configuration where the robot Jacobian matrix loses rank, requiring infinite joint velocities to move in certain Cartesian directions',
            'When a joint motor burns out due to excess current',
            'When the robot loses network connectivity with the controller',
            'When two robot links physically collide with each other'
          ],
          correctAnswerIndex: 0,
          explanation: 'At a singularity (e.g. arm fully outstretched or wrist axes aligned), the Jacobian matrix determinant drops to zero ($det(J) = 0$). Inverting the Jacobian to calculate joint speeds ($\\\\dot{q} = J^{-1} \\\\dot{x}$) requires dividing by zero, demanding infinite motor speeds that cause erratic, violent joint motions.',
          topic: 'Manipulator Kinematics & Jacobians'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'URDF Kinematic & Inertial Model Assembly', layer: 'Robotic Model', description: 'Define links, joints, collision geometries, and inertia tensors in parametric Xacro.', keyCode: '<joint name="shoulder_pan" type="revolute"><axis xyz="0 0 1"/>' },
        { stepNumber: 2, title: 'tf2 Coordinate Tree Broadcasting', layer: 'Transforms', description: 'Publish dynamic transform between odom and base_footprint from wheel encoder odometry.', keyCode: 'tf_broadcaster_->sendTransform(odom_to_base_tf);' },
        { stepNumber: 3, title: 'Extended Kalman Filter Sensor Fusion', layer: 'Localization', description: 'Fuse wheel encoders with 9-axis IMU using robot_localization EKF node.', keyCode: 'process_model_update(state, imu_quat, wheel_ticks);' },
        { stepNumber: 4, title: 'Occupancy Grid 2D SLAM Mapping', layer: 'Perception', description: 'Generate probabilistic log-odds grid map using SLAM Toolbox graph optimization.', keyCode: 'slam_toolbox_node->process_laser_scan(msg);' },
        { stepNumber: 5, title: 'Nav2 Trajectory Tracking & Costmap Inflation', layer: 'Navigation', description: 'Tune DWB trajectory generator path distance and goal distance weight parameters.', keyCode: 'controller_server: ros__parameters: DWBLocalPlanner: path_distance_bias: 32.0' },
        { stepNumber: 6, title: 'Behavior Tree Action Coordination', layer: 'Autonomy', description: 'Build XML behavior tree linking recovery behaviors, obstacle clearance, and goal navigation.', keyCode: '<NavigateWithReplanning goal="{goal}" path="{path}"/>' }
      ],
      interviewQuestions: [
        {
          id: 'iq-rob-1',
          topic: 'Navigation & Localization',
          question: 'How does the Extended Kalman Filter (EKF) fuse noisy wheel odometry with high-drift IMU sensor data in robot localization?',
          keyPointsExpected: [
            'Wheel odometry is accurate over short terms but suffers from cumulative drift due to wheel slip',
            'IMU gyroscopes provide fast angular rates but suffer from bias drift over time',
            'Prediction Step: Uses robot kinematic velocity model to propagate state and covariance forward',
            'Correction Step: Calculates Kalman Gain ($K$) based on measurement uncertainty and updates state estimate'
          ],
          sampleAnswer: 'The Extended Kalman Filter operates in two alternating cycles: Predict and Update. In the Predict step, wheel encoder velocities project the robot pose forward based on differential drive kinematics, with state covariance growing to reflect accumulated uncertainty. In the Update step, IMU angular velocity and accelerometer readings are incorporated. The filter computes the optimal Kalman Gain ($K = P H^T (H P H^T + R)^{-1}$) to weigh the prediction against the physical measurements according to their noise covariance matrices. High-frequency gyroscope updates correct sudden wheel slip yaw errors, while wheel odometry bounds the low-frequency drift of the IMU accelerometer integration.'
        }
      ]
    }
  },

  // =========================================================================
  // AUTOMOBILE: EV BATTERY MANAGEMENT & POWERTRAIN
  // =========================================================================
  'ev-tech': {
    roadmapStepId: 'rd-auto-01',
    skillName: 'Electric Vehicle Technology & Battery Management Systems (BMS)',
    category: 'Automotive & Mobility',
    industryDemand: 95,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 34,
    prerequisites: [
      {
        skillName: 'Electrical Circuits & Microcontroller Basics',
        isMet: true,
        requiredDescription: 'DC circuit analysis, battery fundamentals, PWM, and CAN bus basics.'
      }
    ],
    whatYouWillLearn: [
      'Lithium-ion battery chemistries: NMC, LFP, NCA—energy density, thermal runaway limits, and degradation',
      'Battery pack architecture: Cell-to-Pack (CTP), series/parallel connections, busbars, and fuse sizing',
      'Battery Management System (BMS) topology: Master-slave architecture, ISO 26262 ASIL-D functional safety',
      'State of Charge (SoC) estimation: Coulomb Counting combined with Extended Kalman Filter (EKF) and OCV lookup',
      'Passive vs Active cell balancing: Switched-resistor bleed circuits vs bidirectional inductor energy transfer',
      'High-voltage safety: Contactor pre-charge circuits, pyrofuse isolation, and insulation monitoring (IMD)',
      'Thermal Management Systems (BTMS): Liquid cold-plates, dielectric immersion cooling, and heat pump integration',
      'EV Traction Motor Control: Field-Oriented Control (FOC) for Permanent Magnet Synchronous Motors (PMSM)'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'The automotive global transition to electric vehicles hinges on battery safety, fast charging speeds, and range maximization. BMS engineers prevent dangerous thermal runaway while extending battery cycle life past 200,000 miles.',
      rolesUsingSkill: ['BMS Firmware Engineer', 'EV Powertrain Engineer', 'Battery Systems Architect', 'High Voltage Safety Specialist'],
      realWorldUsage: 'Developing the real-time battery pack supervisory controller for 400V/800V automotive architectures in Tesla, Rivian, and BYD vehicles.',
      subsequentSkills: ['Automotive AUTOSAR Architecture', 'Hardware-in-the-Loop (HIL) Testing', '800V Silicon Carbide (SiC) Inverters']
    },
    modules: [
      {
        id: 'mod-auto-1-1',
        moduleNumber: 1,
        title: 'Lithium-Ion Cell Modeling, SoC Estimation & Safety Protection',
        description: 'Model electrochemical equivalent circuits, estimate state of charge, and protect high-voltage battery packs.',
        lessons: [
          {
            id: 'les-auto-1-1-1',
            title: 'Equivalent Circuit Model (ECM) & Extended Kalman Filter for State of Charge (SoC)',
            duration: '50 mins',
            simpleExplanation: 'You cannot put a physical fuel gauge inside a battery cell. Instead, the BMS continuously measures battery terminal voltage, current, and temperature, using a mathematical cell model (Thevenin ECM) to deduce the exact remaining percentage of charge.',
            whyNeeded: 'Simple Coulomb counting drifts over time due to sensor bias, while pure Open-Circuit Voltage (OCV) lookup fails during driving because internal resistance and polarization create voltage drops ($V = OCV - I R_0$). The Extended Kalman Filter eliminates both problems.',
            howItWorks: 'The Thevenin Equivalent Circuit models the battery as an ideal voltage source ($OCV$), a series ohmic resistance ($R_0$), and a parallel resistor-capacitor network ($R_1, C_1$) representing diffusion polarization. The EKF fuses current integration with voltage corrections.',
            syntax: 'V_terminal = OCV(SoC) - I_load * R_0 - V_RC_polarization',
            realWorldExample: 'An EV driving on a highway pulls 150A during acceleration; the BMS accurately tells the driver they have 48% battery remaining without being fooled by the temporary 25V voltage sag under load.',
            codeSnippet: `# Python: Coulomb Counting with OCV Drift Correction for Battery SoC
class BatterySoCEstimator:
    def __init__(self, capacity_amp_hours, nominal_voltage=3.7):
        self.capacity_coulombs = capacity_amp_hours * 3600.0
        self.soc = 1.0 # 100% full initial state
        
    def update(self, current_amps, dt_seconds, terminal_voltage, is_resting):
        # 1. Coulomb counting integration (Current positive for discharge)
        delta_q = current_amps * dt_seconds
        self.soc -= (delta_q / self.capacity_coulombs)
        self.soc = max(0.0, min(1.0, self.soc))
        
        # 2. OCV correction when resting (I ~ 0 for > 15 mins)
        if is_resting and abs(current_amps) < 0.05:
            # Empirical OCV curve for LFP / NMC cell
            soc_from_ocv = self.lookup_ocv_to_soc(terminal_voltage)
            # Smoothly blend towards OCV value (Kalman filter proxy)
            self.soc = 0.95 * self.soc + 0.05 * soc_from_ocv
            
        return round(self.soc * 100, 2)
        
    @staticmethod
    def lookup_ocv_to_soc(voc):
        # Simplified linear approximation for 3.0V - 4.2V NMC cell
        if voc >= 4.2: return 1.0
        if voc <= 3.0: return 0.0
        return (voc - 3.0) / (4.2 - 3.0)

bms = BatterySoCEstimator(capacity_amp_hours=60.0) # 60 Ah cell
# Discharge at 30A for 30 minutes (1800s)
soc_pct = bms.update(current_amps=30.0, dt_seconds=1800.0, terminal_voltage=3.65, is_resting=False)
print(f"Remaining Battery SoC: {soc_pct}%")`,
            expectedOutput: 'Remaining Battery SoC: 75.0%',
            commonMistakes: [
              'Relying solely on OCV for LFP (Lithium Iron Phosphate) chemistries, which have an extremely flat voltage plateau between 20% and 80% SoC where 1mV difference equals 10% SoC change',
              'Neglecting temperature effects: battery internal resistance ($R_0$) increases exponentially at temperatures below 0°C, causing severe voltage drops and mistaken low-SoC readings',
              'Ignoring current sensor zero-point drift (offset bias), which causes pure Coulomb counting to drift by 5-10% every hour'
            ],
            bestPractices: [
              'Combine Coulomb Counting with an Extended Kalman Filter (EKF) to achieve < 2% SoC error across all operating temperatures',
              'Calibrate the 100% SoC reference point whenever the charging current drops below $C/20$ at the Constant-Voltage cutoff limit',
              'Log Ah throughput and temperature cycles to continuously update the battery State of Health (SoH) and capacity fade'
            ],
            practiceQuestion: 'Why is State of Charge estimation significantly more challenging in Lithium Iron Phosphate (LFP) cells compared to Nickel Manganese Cobalt (NMC) cells?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-auto-1',
        title: 'Passive Cell Balancing Algorithm for Battery Pack',
        difficulty: 'Medium',
        description: 'Implement a passive cell balancing control algorithm in Embedded C/Python that identifies unbalanced series cells during charging and enables bleed resistor MOSFETs for overcharged cells.',
        requirements: [
          'Pack consists of 12 cells in series',
          'Only activate balancing when charger is connected and minimum cell voltage exceeds 3.45V',
          'Bleed any cell that exceeds the pack minimum cell voltage by more than 15 mV',
          'Return array of boolean balance flags for each of the 12 cells'
        ],
        starterCode: `def evaluate_cell_balancing(cell_voltages, is_charging):
    """
    cell_voltages: list of 12 float voltages in Volts
    is_charging: bool
    Returns list of 12 booleans indicating which cell bleed resistors should be turned ON.
    """
    # TODO: Implement balancing logic
    return [False] * 12`,
        expectedOutput: 'Accurate boolean balance mask identifying only cells exceeding the 15mV balancing band.',
        hints: [
          'Find min_voltage = min(cell_voltages)',
          'Check condition: is_charging and min_voltage >= 3.45',
          'If true, cell i is balanced if cell_voltages[i] - min_voltage >= 0.015'
        ],
        solutionCode: `def evaluate_cell_balancing(cell_voltages, is_charging):
    if not is_charging or len(cell_voltages) != 12:
        return [False] * 12
        
    min_v = min(cell_voltages)
    # Check minimum threshold
    if min_v < 3.45:
        return [False] * 12
        
    balance_threshold = 0.015 # 15 mV
    balance_flags = []
    for v in cell_voltages:
        if (v - min_v) >= balance_threshold:
            balance_flags.append(True)
        else:
            balance_flags.append(False)
            
    return balance_flags`,
        testCases: [
          { input: '11 cells at 3.50V, 1 cell at 3.53V, is_charging=True', expected: '11 False, 1 True at index of 3.53V cell' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-auto-1-1',
        question: 'Why is a High-Voltage Pre-Charge circuit mandatory before closing the main positive contactor in an electric vehicle powertrain?',
        options: [
          'It warms up the lithium battery electrolyte',
          'The traction inverter contains massive DC-link capacitors; closing the main contactor directly onto uncharged capacitors would cause thousands of amperes of inrush current, welding contactor contacts together and blowing fuses',
          'It checks for tire pressure leaks',
          'It syncs the car radio to the GPS clock'
        ],
        correctAnswerIndex: 1,
        explanation: 'The motor inverter contains large DC-link capacitors (500-1000 µF). When uncharged, capacitors act as an instantaneous short circuit ($I = V/R_{wire}$). A pre-charge contactor with a series power resistor (e.g. 50Ω) charges the capacitors to 95% of battery pack voltage before the main positive contactor closes, preventing catastrophic contact welding.',
        topic: 'High Voltage Safety & Contactor Sequencing'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-auto-1',
        title: 'High-Voltage Contactor Sequencing State Machine',
        objective: 'Implement an ISO 26262 compliant safe pre-charge and main contactor closure finite state machine for an 800V EV battery pack.',
        steps: [
          'Verify High-Voltage Interlock Loop (HVIL) is closed and Isolation Monitoring Resistance > 500 Ω/V',
          'Close Main Negative Contactor',
          'Close Pre-Charge Contactor and monitor DC-link capacitor voltage rise until $V_{cap} \\ge 0.95 \\times V_{pack}$',
          'Close Main Positive Contactor and open Pre-Charge Contactor within 50ms',
          'If pre-charge timeout (500ms) occurs without reaching 95%, open all contactors and trigger PreChargeFault'
        ],
        codeTemplate: `enum BmsState { INIT, HVIL_CHECK, NEG_CLOSED, PRECHARGE, MAIN_CLOSED, FAULT };
void bms_step_state_machine(void) {
    // Implement contactor timing and voltage threshold checks
}`,
        verificationCriteria: [
          'Main positive contactor closes only when capacitor voltage reaches >= 95% of pack voltage',
          'Pre-charge contactor opens safely within 50ms after main contactor closure',
          'HVIL disconnection triggers immediate hardware contactor shutdown in < 10ms'
        ]
      }
    ],
    miniProject: {
      title: 'Complete 400V 100-Cell Modular Battery Management System (BMS)',
      description: 'Design the hardware and firmware architecture for a 400V automotive battery pack consisting of 100 NMC cells in series. Include isolated SPI daisy-chain communication (Analog Devices LTC6811 / TI BQ79616), CAN bus reporting to Vehicle Control Unit (VCU), and thermal runaway detection.',
      techStack: ['Embedded C', 'LTC6811 BMS AFE', 'CAN 2.0B / CAN-FD', 'ISO 26262 Functional Safety', 'FreeRTOS'],
      deliverables: [
        'Complete BMS firmware reading 100 cell voltages and 30 NTC thermistor temperatures via isolated SPI daisy-chain',
        'SoC and SoH tracking module with thermal derating tables for maximum discharge/charge current',
        'CAN message dictionary defining pack voltage, current, insulation resistance, and highest/lowest cell voltages',
        'Fail-safe pyrofuse firing logic triggered within 2ms of dead short-circuit detection'
      ],
      architectureDiagramText: `[100S NMC Battery Pack (400V)]
            |
            +---> [10x AFE Monitoring ICs (Isolated SPI Daisy-Chain)]
            |                                    |
            v                                    v
[Master BMS MCU (STM32 / NXP S32K)] <-------------+
            |
            +---> [Pre-Charge / Main High-Voltage Contactors]
            |
            +---> [High-Voltage Isolation Monitor (IMD)]
            |
            +---> [Isolated CAN-FD Bus] ---> [Vehicle Control Unit (VCU)]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-auto-1-1',
          question: 'What triggers Thermal Runaway in lithium-ion batteries, and what chemical reaction causes it to become self-sustaining?',
          options: [
            'Mechanical puncture, overcharging, or internal short-circuits trigger exothermic decomposition of the Solid Electrolyte Interphase (SEI) layer at ~90-120°C, releasing oxygen from the cathode that violently combusts with the flammable organic electrolyte in a self-heating cycle exceeding 800°C',
            'Leaving the battery uncharged for more than two weeks',
            'Turning on the vehicle air conditioning while fast charging',
            'Water vapor condensing on the plastic outer casing'
          ],
          correctAnswerIndex: 0,
          explanation: 'Thermal runaway begins with SEI layer breakdown at ~90-120°C, followed by anode reaction with electrolyte. Around 180-200°C, the metal oxide cathode breaks down, liberating pure oxygen gas into the hot flammable organic solvent electrolyte. This creates a self-sustaining combustion reaction that generates intense heat, toxic gases, and explosive cell rupture.',
          topic: 'Battery Safety & Thermal Runaway'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Isolated SPI Daisy-Chain AFE Driver', layer: 'Hardware Interface', description: 'Configure isoSPI transceiver to command multi-cell battery monitor ICs across 400V common-mode barriers.', keyCode: 'ltc6811_broadcast_adcv(); ltc6811_read_cell_voltages(pack_cells);' },
        { stepNumber: 2, title: 'Cell Voltage & Temperature Fault Filtering', layer: 'Protection', description: 'Evaluate Over-Voltage (> 4.25V), Under-Voltage (< 2.80V), and Over-Temperature (> 60°C) fault windows.', keyCode: 'if (cell_v > OVP_THRESHOLD) { trigger_bms_alarm(FAULT_OVP); }' },
        { stepNumber: 3, title: 'Extended Kalman Filter SoC Estimation', layer: 'State Estimation', description: 'Run real-time EKF updating battery state vector and error covariance every 100 milliseconds.', keyCode: 'ekf_update(&cell_ekf, current_measurement, voltage_measurement);' },
        { stepNumber: 4, title: 'Passive Cell Balancing Energy Equalization', layer: 'Balancing', description: 'Engage internal discharge balance switches on cells with higher voltage during top-of-charge CV phase.', keyCode: 'set_balancing_switches(balance_mask_100s);' },
        { stepNumber: 5, title: 'Contactor Pre-Charge State Machine', layer: 'Safety Sequencing', description: 'Control main positive, negative, and pre-charge relays with weld-detection diagnostics.', keyCode: 'if (v_inverter >= 0.95 * v_pack) { close_main_positive(); open_precharge(); }' },
        { stepNumber: 6, title: 'CAN-FD Broadcast & VCU Power Limits', layer: 'Powertrain Comms', description: 'Transmit maximum continuous charge and discharge power limits (kW) to the inverter at 50 Hz.', keyCode: 'can_send_pack_status(pack_v, pack_current, soc_percent, max_discharge_kw);' }
      ],
      interviewQuestions: [
        {
          id: 'iq-auto-1',
          topic: 'BMS Architecture',
          question: 'What is the purpose of High-Voltage Isolation Monitoring (IMD), and why is it mandatory for safety in EV battery systems?',
          keyPointsExpected: [
            'EV high-voltage traction batteries (400V/800V) are completely isolated from the vehicle 12V chassis ground (floating system)',
            'If an insulation fault occurs (cable chafing), the chassis can become energized',
            'A single ground fault does not cause shock, but a second fault creates a lethal direct short circuit through the chassis',
            'An Isolation Monitoring Device continuously injects low-frequency AC test pulses to measure chassis insulation resistance in kΩ/V (standard requires > 500 Ω/V)'
          ],
          sampleAnswer: 'In an electric vehicle, the high-voltage battery system is strictly isolated (floating) with no reference to the metal vehicle chassis. If an orange HV cable rubs against the chassis and wears through its insulation, this creates a first insulation fault. Because the system is isolated, no circuit is completed and no current flows immediately. However, if a second insulation fault occurs anywhere on the other pole, lethal short-circuit currents would surge through the chassis, shocking passengers or starting a fire. The Isolation Monitoring Device (IMD) continuously injects an alternating square-wave signal between the HV bus and chassis ground to calculate insulation resistance in real time, alerting the VCU and opening contactors if resistance drops below the statutory 500 Ω/V threshold.'
        }
      ]
    }
  }
};
