import { SkillCurriculum } from '../roadmapCurriculumData';

export const ECE_CURRICULUM_DATA: Record<string, SkillCurriculum> = {
  // =========================================================================
  // ECE 1: EMBEDDED C & FIRMWARE DEVELOPMENT
  // =========================================================================
  'embedded-c': {
    roadmapStepId: 'rd-ece-01',
    skillName: 'Embedded C & Microcontroller Firmware',
    category: 'Embedded Systems',
    industryDemand: 95,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Intermediate',
    estimatedHours: 32,
    prerequisites: [
      {
        skillName: 'C Programming Fundamentals',
        isMet: true,
        requiredDescription: 'Solid grasp of pointers, struct packing, memory layout, and bitwise operations.'
      }
    ],
    whatYouWillLearn: [
      'Bare-metal register programming on ARM Cortex-M (STM32) without HAL overhead',
      'Memory-mapped I/O architecture and volatile keyword semantics',
      'Configuring GPIO modes: push-pull, open-drain, pull-up/pull-down',
      'Nested Vectored Interrupt Controller (NVIC) configuration and ISR hygiene',
      'Hardware timers, PWM generation for motor control, and Input Capture',
      'Serial protocols from scratch: UART baud-rate calculation, SPI clock polarity/phase, and I2C ACK/NACK signaling',
      'Analog-to-Digital Conversion (ADC) with DMA (Direct Memory Access) transfers',
      'RTOS fundamentals: FreeRTOS preemptive task scheduling, semaphores, and message queues'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'From automotive ECUs to aerospace avionics and medical implants, real-time safety-critical devices rely on high-efficiency, deterministic Embedded C firmware with zero memory leaks.',
      rolesUsingSkill: ['Embedded Software Engineer', 'Firmware Developer', 'Automotive ECU Specialist', 'IoT Device Architect'],
      realWorldUsage: 'Writing motor driver control loops in Tesla inverters, drone flight controller PID loops, and smart meter telemetry.',
      subsequentSkills: ['Real-Time Operating Systems (FreeRTOS / Zephyr)', 'Automotive CAN Bus & AUTOSAR', 'ARM Cortex Low-Power Optimization']
    },
    modules: [
      {
        id: 'mod-ece-1-1',
        moduleNumber: 1,
        title: 'Microcontroller Architecture & Bare-Metal Memory-Mapped I/O',
        description: 'Understand ARM Cortex-M memory maps, peripheral bus matrix (AHB/APB), and bitwise register manipulation.',
        lessons: [
          {
            id: 'les-ece-1-1-1',
            title: 'Memory-Mapped I/O & The Volatile Qualifier',
            duration: '45 mins',
            simpleExplanation: 'Microcontrollers assign physical hardware peripherals (like LED pins or serial ports) specific addresses in the processor’s 4GB memory space. Writing to that address directly turns hardware on or off.',
            whyNeeded: 'Compilers optimize away variable reads if they assume the variable never changes in normal code flow. The volatile keyword forces the CPU to re-read the hardware register every time, preventing compiler cache bugs.',
            howItWorks: 'Pointers are cast to hardware addresses defined in the datasheet. Using `#define GPIOC_ODR (*((volatile uint32_t*)0x40020814))` allows reading and writing hardware pins just like standard variables.',
            syntax: '*(volatile uint32_t*)(PERIPH_BASE + OFFSET) |= (1U << BIT_POS);',
            realWorldExample: 'Automotive airbag controllers read accelerometer registers via memory-mapped memory every 50 microseconds; missing a register update due to compiler optimization would be catastrophic.',
            codeSnippet: `// STM32 Bare-Metal GPIO Toggle on GPIOC Pin 13
#include <stdint.h>

#define RCC_AHB1ENR   (*((volatile uint32_t*)0x40023830))
#define GPIOC_MODER   (*((volatile uint32_t*)0x40020800))
#define GPIOC_ODR     (*((volatile uint32_t*)0x40020814))

void gpio_init(void) {
    // 1. Enable Clock for GPIOC (bit 2 in RCC_AHB1ENR)
    RCC_AHB1ENR |= (1U << 2);

    // 2. Set Pin 13 as General Purpose Output (bits 27:26 = 01)
    GPIOC_MODER &= ~(3U << (13 * 2)); // Clear mode
    GPIOC_MODER |=  (1U << (13 * 2)); // Set to 01 (output)
}

void toggle_led(void) {
    GPIOC_ODR ^= (1U << 13); // XOR toggle
}`,
            expectedOutput: 'GPIOC Pin 13 outputs 3.3V logic high, then 0V logic low alternately.',
            commonMistakes: [
              'Omitting volatile keyword, causing compiler -O2 optimization to skip register poll loops',
              'Overwriting entire registers with assignment (=) instead of using bitwise OR (|=) or AND (&=~)',
              'Forgetting to enable peripheral clock in the RCC (Reset and Clock Control) register before accessing peripheral'
            ],
            bestPractices: [
              'Always use standard fixed-width integer types from <stdint.h> (uint32_t, uint16_t)',
              'Wrap peripheral pointer casts in macros with parentheses to prevent operator precedence bugs',
              'Use Bit-Banding or atomic set/reset registers (BSRR) for thread-safe single-cycle pin manipulation'
            ],
            practiceQuestion: 'Write an Embedded C snippet to clear bits 4 and 5 in a 32-bit register without modifying any of the other 30 bits.'
          },
          {
            id: 'les-ece-1-1-2',
            title: 'NVIC Interrupt Handling & Race Condition Prevention',
            duration: '50 mins',
            simpleExplanation: 'Instead of having the processor constantly check in a loop whether a button was pressed, hardware interrupts pause execution instantly and jump to an Interrupt Service Routine (ISR).',
            whyNeeded: 'Polling wastes CPU power and introduces latency. Interrupts ensure microsecond-level response times for emergency stop buttons, sensor limits, and incoming network packets.',
            howItWorks: 'The Cortex-M Nested Vectored Interrupt Controller (NVIC) receives external signal transitions, pushes current CPU registers onto the Main Stack Pointer (MSP), looks up the handler vector, and executes the ISR.',
            syntax: 'void EXTI0_IRQHandler(void) { if (EXTI->PR & (1<<0)) { /* ACK & Handle */ EXTI->PR |= (1<<0); } }',
            realWorldExample: 'A pacemaker detects abnormal cardiac rhythm via an analog comparator interrupt that triggers a pacing pulse within 2 milliseconds.',
            codeSnippet: `// External Interrupt Configuration on PA0
#include <stdint.h>

volatile uint32_t button_press_count = 0;

void EXTI0_IRQHandler(void) {
    // Check if EXTI line 0 pending bit is set
    if (EXTI_PR & (1U << 0)) {
        button_press_count++;
        // Clear pending interrupt flag by writing 1 to it
        EXTI_PR |= (1U << 0);
    }
}

// Critical Section in main thread
uint32_t get_safe_count(void) {
    __disable_irq(); // Disable interrupts to prevent read-modify race
    uint32_t count = button_press_count;
    __enable_irq();  // Re-enable interrupts
    return count;
}`,
            expectedOutput: 'Interrupt counter increments deterministically on button click without race conditions.',
            commonMistakes: [
              'Calling printf(), malloc(), or long delay loops inside an ISR',
              'Forgetting to clear the interrupt pending flag in the hardware register, causing the CPU to loop infinitely in the ISR',
              'Sharing non-atomic variables between ISR and main loop without disabling interrupts or using atomics'
            ],
            bestPractices: [
              'Keep ISRs shorter than 10 microseconds: set a flag or push to a circular ring buffer and return',
              'Declare any variable modified inside an ISR as volatile',
              'Configure NVIC priority levels thoughtfully to avoid priority inversion'
            ],
            practiceQuestion: 'Why must you write a 1 to clear a pending interrupt flag in Cortex-M peripheral registers rather than writing a 0?'
          }
        ]
      },
      {
        id: 'mod-ece-1-2',
        moduleNumber: 2,
        title: 'Communication Protocols: UART, SPI & I2C Bus Architectures',
        description: 'Implement industrial serial communication protocols at the bit and register level.',
        lessons: [
          {
            id: 'les-ece-1-2-1',
            title: 'UART Asynchronous Serial Protocol & Baud Rate Generation',
            duration: '50 mins',
            simpleExplanation: 'UART sends data one bit at a time over two wires (Tx and Rx) at an agreed clock speed (Baud rate), framed by start, parity, and stop bits.',
            whyNeeded: 'UART is universal across microcontrollers, GPS modules, Bluetooth transceivers, and debug consoles without requiring a shared clock wire.',
            howItWorks: 'The CPU writes a byte to the Transmit Data Register (TDR). The hardware baud rate generator divides the system peripheral clock to shift out 1 start bit (low), 8 data bits (LSB first), and 1 stop bit (high).',
            syntax: 'USART_BRR = (PERIPH_CLOCK + (BAUD / 2)) / BAUD;',
            realWorldExample: 'A quadcopter flight controller receives GPS NMEA coordinate strings over a 115200-baud UART line at 10Hz updates.',
            codeSnippet: `// UART Polling Byte Transmission & Reception
#define USART2_SR   (*((volatile uint32_t*)0x40004400))
#define USART2_DR   (*((volatile uint32_t*)0x40004404))
#define USART2_BRR  (*((volatile uint32_t*)0x40004408))
#define USART2_CR1  (*((volatile uint32_t*)0x4000440C))

#define USART_SR_TXE   (1U << 7) // Transmit data register empty
#define USART_SR_RXNE  (1U << 5) // Read data register not empty

void uart2_init(uint32_t pclk, uint32_t baud) {
    // Set Baud Rate register (e.g. 16MHz clock / 9600 baud = 1667)
    USART2_BRR = (pclk + (baud / 2)) / baud;
    // Enable Transmitter (TE) and UART Module (UE)
    USART2_CR1 |= (1U << 3) | (1U << 13);
}

void uart2_write_char(char c) {
    // Wait until Transmit Data Register is ready
    while (!(USART2_SR & USART_SR_TXE));
    USART2_DR = (uint32_t)c;
}`,
            expectedOutput: 'Serial character transmitted cleanly with accurate bit duration verified on an oscilloscope.',
            commonMistakes: [
              'Wrong peripheral clock frequency assumed in the baud rate calculation formula',
              'Writing to USART_DR before verifying the TXE (Transmit Empty) bit is high',
              'Connecting Tx to Tx and Rx to Rx instead of crossing Tx->Rx and Rx->Tx'
            ],
            bestPractices: [
              'Implement a Circular FIFO Buffer driven by UART RX interrupts for packet buffering',
              'Use DMA for multi-byte payloads to eliminate CPU polling overhead',
              'Verify signal integrity and ground reference connections between communicating PCBs'
            ],
            practiceQuestion: 'Calculate the value of USART_BRR for a peripheral clock of 42 MHz and a desired baud rate of 115200 bps.'
          },
          {
            id: 'les-ece-1-2-2',
            title: 'I2C Multi-Master Bus Protocol & Pull-up Sizing',
            duration: '45 mins',
            simpleExplanation: 'I2C uses two bidirectional open-drain wires (SDA and SCL) with pull-up resistors to connect up to 127 devices (sensors, EEPROMs, RTCs) over short board distances.',
            whyNeeded: 'Instead of routing dozens of dedicated chip-select lines, I2C addresses each device using a 7-bit identifier over just two bus wires.',
            howItWorks: 'Communication begins with a START condition (SDA pulled low while SCL high), followed by 7 address bits, 1 Read/Write bit, an ACK bit from the slave, and byte transfers concluded by a STOP condition.',
            syntax: 'I2C_CR1 |= I2C_CR1_START; while (!(I2C_SR1 & I2C_SR1_SB));',
            realWorldExample: 'Reading a BME280 barometric pressure and temperature sensor at address 0x76 on an environmental monitoring weather station.',
            codeSnippet: `// I2C Master Transmit Single Register Address
int i2c_read_sensor_reg(uint8_t dev_addr, uint8_t reg_addr, uint8_t* p_val) {
    // 1. Generate START Condition
    I2C1->CR1 |= (1 << 8); 
    while (!(I2C1->SR1 & (1 << 0))); // Wait for SB flag

    // 2. Send 7-bit slave address + Write (0)
    I2C1->DR = (dev_addr << 1) & ~0x01;
    while (!(I2C1->SR1 & (1 << 1))); // Wait for ADDR flag
    (void)I2C1->SR2; // Clear ADDR flag by reading SR2

    // 3. Send Register Address to read from
    I2C1->DR = reg_addr;
    while (!(I2C1->SR1 & (1 << 2))); // Wait for TXE

    // 4. Repeated START for Read mode
    I2C1->CR1 |= (1 << 8);
    while (!(I2C1->SR1 & (1 << 0)));
    I2C1->DR = (dev_addr << 1) | 0x01; // Address + Read
    while (!(I2C1->SR1 & (1 << 1)));
    (void)I2C1->SR2;

    // 5. Send NACK and STOP for single-byte read
    I2C1->CR1 &= ~(1 << 10); // Disable ACK
    I2C1->CR1 |= (1 << 9);   // Generate STOP
    while (!(I2C1->SR1 & (1 << 6))); // Wait for RXNE
    *p_val = (uint8_t)I2C1->DR;
    return 0;
}`,
            expectedOutput: 'Read register value returned cleanly from slave sensor with proper NACK termination.',
            commonMistakes: [
              'Leaving SDA and SCL pins configured as push-pull instead of open-drain, causing hardware bus short-circuits',
              'Missing external pull-up resistors (typically 4.7kΩ for standard 100kHz bus)',
              'Failing to handle bus lockups when a slave holds SDA low indefinitely'
            ],
            bestPractices: [
              'Implement a bus recovery routine (toggling SCL 9 times manually) during initialization if SDA is stuck low',
              'Set software timeouts on all while() hardware polling loops to avoid permanent lockups',
              'Use differential I2C buffers if transmitting over cables longer than 30 cm'
            ],
            practiceQuestion: 'What happens on the I2C bus if two masters attempt to transmit at the exact same moment, and how does hardware arbitration resolve it?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-ece-1',
        title: 'Ring Buffer Implementation for High-Speed UART',
        difficulty: 'Medium',
        description: 'Implement a lock-free circular FIFO ring buffer in Embedded C that safely stores received bytes from an interrupt service routine.',
        requirements: [
          'Buffer size must be a power of two (e.g. 64 or 128 bytes)',
          'Provide push() and pop() operations returning status flags for buffer full/empty',
          'Use bitwise masking for wrap-around instead of slow modulo (%) operations'
        ],
        starterCode: `#include <stdint.h>
#include <stdbool.h>

#define RING_BUF_SIZE 64 // Must be power of 2
#define RING_BUF_MASK (RING_BUF_SIZE - 1)

typedef struct {
    uint8_t buffer[RING_BUF_SIZE];
    volatile uint16_t head; // Written by ISR
    volatile uint16_t tail; // Read by Main
} RingBuffer;

bool ring_buf_push(RingBuffer *rb, uint8_t byte) {
    // TODO: Implement safe push operation
    return false;
}

bool ring_buf_pop(RingBuffer *rb, uint8_t *p_byte) {
    // TODO: Implement safe pop operation
    return false;
}`,
        expectedOutput: 'Ring buffer correctly handles continuous push and pop cycles under maximum throughput.',
        hints: [
          'Next head index is `(rb->head + 1) & RING_BUF_MASK`',
          'Buffer is full when `((rb->head + 1) & RING_BUF_MASK) == rb->tail`',
          'Buffer is empty when `rb->head == rb->tail`'
        ],
        solutionCode: `#include <stdint.h>
#include <stdbool.h>

#define RING_BUF_SIZE 64
#define RING_BUF_MASK (RING_BUF_SIZE - 1)

typedef struct {
    uint8_t buffer[RING_BUF_SIZE];
    volatile uint16_t head;
    volatile uint16_t tail;
} RingBuffer;

bool ring_buf_push(RingBuffer *rb, uint8_t byte) {
    uint16_t next_head = (rb->head + 1) & RING_BUF_MASK;
    if (next_head == rb->tail) {
        return false; // Buffer is full, drop byte
    }
    rb->buffer[rb->head] = byte;
    rb->head = next_head;
    return true;
}

bool ring_buf_pop(RingBuffer *rb, uint8_t *p_byte) {
    if (rb->head == rb->tail) {
        return false; // Buffer is empty
    }
    *p_byte = rb->buffer[rb->tail];
    rb->tail = (rb->tail + 1) & RING_BUF_MASK;
    return true;
}`,
        testCases: [
          { input: 'push 5 bytes, pop 5 bytes', expected: 'all 5 bytes retrieved in identical FIFO order' },
          { input: 'push 64 bytes to fill', expected: '65th push returns false (overflow prevented)' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-ece-1-1',
        question: 'What is the primary function of the "volatile" keyword in Embedded C register definitions?',
        options: [
          'It allocates memory in high-speed SRAM instead of Flash',
          'It prevents the compiler from optimizing away memory reads/writes to peripheral registers',
          'It makes the variable thread-safe across multi-core processors automatically',
          'It forces the CPU to execute instructions in 64-bit mode'
        ],
        correctAnswerIndex: 1,
        explanation: 'Volatile tells the compiler that the value at this memory address can change asynchronously due to hardware actions outside normal program code, forcing every read and write directly to physical memory.',
        topic: 'Embedded C Memory Model'
      },
      {
        id: 'qz-ece-1-2',
        question: 'Why are open-drain outputs required for the I2C bus instead of push-pull outputs?',
        options: [
          'Push-pull outputs cannot reach speeds above 10 kHz',
          'Open-drain enables wire-AND logic so multiple devices can pull the line low without causing power-to-ground short circuits',
          'Open-drain consumes significantly more battery power, which warms up the silicon',
          'Push-pull requires 5V logic while open-drain only works on 3.3V'
        ],
        correctAnswerIndex: 1,
        explanation: 'In open-drain configuration, pins only drive LOW or float. External pull-up resistors pull the line HIGH. If two devices transmit at once, neither drives HIGH directly against a LOW, avoiding destructive short circuits.',
        topic: 'Hardware Bus Architecture'
      },
      {
        id: 'qz-ece-1-3',
        question: 'What is priority inversion in real-time embedded systems (RTOS)?',
        options: [
          'When high-priority tasks run faster than hardware clock limits',
          'When a low-priority task holds a shared mutex needed by a high-priority task, while a medium-priority task preempts the low-priority task',
          'When interrupts are permanently disabled by the watchdog timer',
          'When timer counters count down instead of counting up'
        ],
        correctAnswerIndex: 1,
        explanation: 'Priority inversion occurred on the Mars Pathfinder spacecraft: a low-priority task held a mutex, a medium task blocked the low task from finishing, thus starving the critical high-priority task until priority inheritance was activated.',
        topic: 'RTOS Scheduling'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-ece-1',
        title: 'Digital Signal Acquisition via ADC with DMA and Timer Trigger',
        objective: 'Configure STM32 Timer 2 to trigger 12-bit ADC samples at 10 kHz and stream directly into SRAM via DMA without CPU intervention.',
        steps: [
          'Enable TIM2 clock and configure counter reload register for 100 microsecond intervals',
          'Configure ADC1 in external trigger mode linked to TIM2 TRGO event',
          'Configure DMA2 Stream 0 in circular mode with peripheral address set to ADC1_DR and memory address to uint16_t adc_buffer[256]',
          'Enable DMA transfer complete interrupt to process 256-sample FFT blocks'
        ],
        codeTemplate: `void setup_adc_dma(uint16_t* buffer, uint32_t size) {
    // 1. Enable TIM2, ADC1, DMA2 clocks
    // 2. Configure TIM2 TRGO output
    // 3. Configure DMA2 Stream 0
    // 4. Start ADC1 DMA stream
}`,
        verificationCriteria: [
          'Oscilloscope verifies ADC conversion completes precisely every 100 microseconds (10 kHz ± 0.05%)',
          'CPU load during data transfer remains under 2% as verified in debugger profiler',
          'adc_buffer contains clean sinusoidal data without sample drops or buffer overruns'
        ]
      }
    ],
    miniProject: {
      title: 'Automotive CAN Bus Telemetry Node with FreeRTOS & Sensor Fusion',
      description: 'Design and build an industrial CAN bus sensor node that reads an IMU accelerometer, runs a Kalman filter task in FreeRTOS, and broadcasts 50Hz vehicle telemetry packets according to CAN 2.0B standards.',
      techStack: ['Embedded C', 'ARM Cortex-M4 (STM32F4)', 'FreeRTOS', 'MCP2551 CAN Transceiver', 'I2C MPU6050 IMU'],
      deliverables: [
        'Complete bare-metal initialization code and FreeRTOS task configuration',
        'CAN message transmission routine with 11-bit standard and 29-bit extended ID support',
        'Fail-safe watchdog timer (IWDG) reset mechanism that recovers in under 50ms upon task deadlock',
        'Oscilloscope screenshots of CAN_H and CAN_L differential bit transitions'
      ],
      architectureDiagramText: `[IMU Sensor (I2C)] ---> [FreeRTOS Acquisition Task (Prio 3)]
                                       |
                                       v
                             [Kalman Filter Queue]
                                       |
                                       v
                    [CAN Dispatch Task (Prio 4)] ---> [Hardware CAN Controller] ---> [CAN Transceiver (CAN_H / CAN_L)]`
    },
    assessment: {
      passingScore: 80,
      questions: [
        {
          id: 'as-ece-1-1',
          question: 'What problem occurs if a peripheral register is modified using `REG |= (1 << BIT)` without taking concurrency into account?',
          options: [
            'It creates a read-modify-write cycle that can be interrupted by an ISR, causing lost bit modifications',
            'It changes the register clock frequency',
            'It causes a stack overflow in the C runtime',
            'It permanently locks the memory bus'
          ],
          correctAnswerIndex: 0,
          explanation: '`REG |= (1 << BIT)` translates into three assembly instructions: LDR (read), ORR (modify), and STR (write). If an interrupt modifies another bit in the same register between LDR and STR, its changes will be overwritten.',
          topic: 'Concurrency in Embedded Systems'
        }
      ]
    },
    capstoneDetails: {
      progressiveSteps: [
        { stepNumber: 1, title: 'Clock Tree Configuration & PLL Setup', layer: 'Hardware Init', description: 'Configure external crystal oscillator (HSE) and phase-locked loop (PLL) to run CPU core at maximum frequency.', keyCode: 'RCC->PLLCFGR = (PLL_M << 0) | (PLL_N << 6) | (PLL_P << 16);' },
        { stepNumber: 2, title: 'GPIO Pin Multiplexing & Alternate Functions', layer: 'Peripheral', description: 'Route hardware peripherals (UART, SPI, CAN) to physical chip pins via GPIO alternate function registers.', keyCode: 'GPIOA->AFR[0] |= (7U << 8); // AF7 for USART2' },
        { stepNumber: 3, title: 'Interrupt Priority Grouping & Vector Table', layer: 'NVIC', description: 'Partition NVIC priority registers into preemption priority and subpriority bits.', keyCode: 'NVIC_SetPriority(USART2_IRQn, NVIC_EncodePriority(PRIGROUP, 1, 0));' },
        { stepNumber: 4, title: 'DMA Circular Streaming Buffer', layer: 'Memory', description: 'Configure Direct Memory Access stream to pipe sensor bytes directly into SRAM buffers.', keyCode: 'DMA1_Stream5->CR |= DMA_SxCR_CIRC | DMA_SxCR_MINC;' },
        { stepNumber: 5, title: 'FreeRTOS Kernel Launch & Task Creation', layer: 'OS', description: 'Spawn dedicated worker tasks with bounded stack allocations and priority assignments.', keyCode: 'xTaskCreate(vTelemetryTask, "TELEM", 256, NULL, 3, &xTelemHandle);' },
        { stepNumber: 6, title: 'Watchdog Heartbeat & Brown-out Reset Protection', layer: 'Safety', description: 'Service the hardware Independent Watchdog (IWDG) only when all tasks report healthy state.', keyCode: 'IWDG->KR = 0xAAAA; // Reload watchdog' }
      ],
      interviewQuestions: [
        {
          id: 'iq-ece-1',
          topic: 'Interrupt Latency',
          question: 'What factors contribute to interrupt latency in ARM Cortex-M processors, and how do you minimize it in safety-critical firmware?',
          keyPointsExpected: [
            'Hardware stacking of registers (R0-R3, R12, LR, PC, xPSR) takes 12 CPU clock cycles',
            'Late-arriving interrupt preemption and tail-chaining optimization (reduces latency to 6 cycles)',
            'Memory wait states if executing out of slow Flash memory',
            'Code running inside critical sections with interrupts disabled (__disable_irq)'
          ],
          sampleAnswer: 'Interrupt latency on Cortex-M consists of the 12-cycle hardware register stacking sequence, pipeline flushing, and fetching the vector from Flash. To minimize latency, I minimize critical sections where interrupts are disabled, use tail-chaining, ensure Flash memory prefetch and cache are enabled, and place latency-critical ISR routines in zero-wait-state Core Coupled Memory (CCM RAM).'
        },
        {
          id: 'iq-ece-2',
          topic: 'Memory Management',
          question: 'Why is dynamic memory allocation (malloc/free) generally prohibited in safety-critical embedded firmware (e.g. DO-178C or ISO 26262)?',
          keyPointsExpected: [
            'Heap fragmentation over prolonged runtimes can cause allocation failures unexpectedly',
            'malloc() execution time is non-deterministic (O(n) search through free lists)',
            'Risk of memory leaks leading to eventual system reboot in flight or during driving'
          ],
          sampleAnswer: 'In safety-critical standards like ISO 26262, dynamic memory allocation using malloc/free is forbidden because of heap fragmentation. Over months of continuous operation, allocations of varying sizes leave non-contiguous memory gaps, causing malloc to fail even if total free memory is sufficient. Furthermore, malloc has non-deterministic time complexity, violating hard real-time deadlines. Instead, we use static memory pools or fixed-size block allocators.'
        }
      ]
    }
  },

  // =========================================================================
  // ECE 2: VLSI & DIGITAL ASIC DESIGN
  // =========================================================================
  'vlsi-design': {
    roadmapStepId: 'rd-ece-02',
    skillName: 'VLSI Design & Digital ASIC Architecture',
    category: 'Hardware & Chips',
    industryDemand: 92,
    currentLevel: 'Beginner',
    targetLevel: 'Advanced',
    difficulty: 'Advanced',
    estimatedHours: 36,
    prerequisites: [
      {
        skillName: 'Digital Logic & Boolean Algebra',
        isMet: true,
        requiredDescription: 'Understanding of logic gates, Karnaugh maps, flip-flops, and state machines.'
      }
    ],
    whatYouWillLearn: [
      'CMOS transistor theory: NMOS/PMOS pull-up/pull-down networks and stick diagrams',
      'RTL synthesis using synthesizable Verilog HDL / SystemVerilog',
      'Synchronous sequential design and Mealy vs Moore Finite State Machines (FSM)',
      'Static Timing Analysis (STA): Setup time, Hold time, Clock Skew, and Jitter',
      'Timing closure: Resolving setup violations via pipelining and hold violations via delay buffers',
      'Design For Testability (DFT): Scan chains, BIST (Built-In Self-Test), and ATPG fault models',
      'Low power design methodologies: Clock gating, power gating, and multi-Vt cell selection',
      'ASIC physical design flow: Floorplanning, placement, clock tree synthesis (CTS), and routing'
    ],
    whyItMattersInIndustry: {
      importanceSummary: 'Semiconductor companies (NVIDIA, Intel, Qualcomm, AMD, Apple Silicon) design billion-transistor System-on-Chips (SoCs). Mastering RTL and Static Timing Analysis is required for high-frequency, energy-efficient silicon.',
      rolesUsingSkill: ['VLSI Design Engineer', 'RTL Verification Engineer', 'Physical Design Engineer', 'ASIC Timing Engineer'],
      realWorldUsage: 'Designing AI neural processing units (TPUs), 5G baseband modems, and low-power smartphone application processors.',
      subsequentSkills: ['SystemVerilog UVM Verification', 'Cadence Innovus Physical Design', 'Advanced FinFET / GAA Process Physics']
    },
    modules: [
      {
        id: 'mod-vlsi-1',
        moduleNumber: 1,
        title: 'CMOS Circuit Fundamentals & Digital RTL Modeling',
        description: 'Design logic gates from silicon transistors and model complex digital systems using synthesizable Verilog.',
        lessons: [
          {
            id: 'les-vlsi-1-1',
            title: 'Static CMOS Logic Design & Propagation Delay',
            duration: '45 mins',
            simpleExplanation: 'CMOS circuits combine PMOS transistors that pull the output HIGH to VDD and NMOS transistors that pull the output LOW to Ground, ensuring zero static power consumption when idle.',
            whyNeeded: 'Understanding gate capacitance, RC delay models, and Logical Effort allows chip designers to size transistors for gigahertz clock frequencies without blowing their power budget.',
            howItWorks: 'When inputs are 1, NMOS conducts and PMOS opens, pulling output to 0. Propagation delay ($t_{pd}$) is determined by the output load capacitance ($C_L$) and equivalent transistor resistance ($R_{eq}$): $t_{pd} = 0.69 \\times R_{eq} \\times C_L$.',
            syntax: 'Inverter: PMOS gate connected to input, source to VDD; NMOS gate connected to input, source to GND.',
            realWorldExample: 'Modern 3nm CPU cores balance transistor gate width ($W/L$) ratios to achieve 5.0 GHz boost clocks while drawing under 15W per core.',
            codeSnippet: `// Synthesizable Verilog: Parameterized 4-bit Carry-Lookahead Adder
module cla_adder_4bit (
    input  wire [3:0] a,
    input  wire [3:0] b,
    input  wire       cin,
    output wire [3:0] sum,
    output wire       cout
);
    wire [3:0] p = a ^ b; // Propagate
    wire [3:0] g = a & b; // Generate

    wire [4:0] c;
    assign c[0] = cin;
    assign c[1] = g[0] | (p[0] & c[0]);
    assign c[2] = g[1] | (p[1] & g[0]) | (p[1] & p[0] & c[0]);
    assign c[3] = g[2] | (p[2] & g[1]) | (p[2] & p[1] & g[0]) | (p[2] & p[1] & p[0] & c[0]);
    assign c[4] = g[3] | (p[3] & c[3]);

    assign sum  = p ^ c[3:0];
    assign cout = c[4];
endmodule`,
            expectedOutput: '4-bit addition calculated in 2 gate delay cycles without ripple carry propagation delay.',
            commonMistakes: [
              'Creating combinational loops in Verilog (assign a = b + a)',
              'Accidental latch inference by not defining all branches in an if-else or case block inside an always @(*)',
              'Mixing blocking (=) and non-blocking (<=) assignments in sequential flip-flop blocks'
            ],
            bestPractices: [
              'Always use non-blocking (`<=`) for sequential clocked blocks and blocking (`=`) for combinational logic',
              'Explicitly specify bit-widths for all literals (e.g. use `4\'b0000` instead of `0`)',
              'Keep reset logic synchronous whenever targeting modern FPGA and ASIC architectures'
            ],
            practiceQuestion: 'Design a 2-input CMOS NAND gate schematic: identify which transistors are in series and which are in parallel in the pull-up and pull-down networks.'
          },
          {
            id: 'les-vlsi-1-2',
            title: 'Static Timing Analysis (STA): Setup, Hold & Slack Closure',
            duration: '50 mins',
            simpleExplanation: 'Static Timing Analysis checks every data path between flip-flops to ensure signals arrive neither too late (setup violation) nor change too fast (hold violation).',
            whyNeeded: 'If data reaches a flip-flop too close to the clock edge, the circuit enters metastability—a non-deterministic state that crashes microprocessors.',
            howItWorks: 'Setup Equation: $T_{clk} \\ge T_{cq} + T_{comb} + T_{setup} - T_{skew}$. Hold Equation: $T_{cq} + T_{comb} \\ge T_{hold} + T_{skew}$. Slack represents timing margin: positive slack means timing passes, negative slack means chip failure.',
            syntax: 'create_clock -name VCLK -period 2.0 [get_ports clk]',
            realWorldExample: 'In an Apple M3 chip operating at 4 GHz (250ps clock period), physical design tools must ensure combinational data propagation between ALU registers finishes in under 180 picoseconds.',
            codeSnippet: `// Synopsys Design Constraints (SDC) Timing Rules
# Define Master Clock (500 MHz = 2.0ns period)
create_clock -name CORE_CLK -period 2.0 [get_ports clk]

# Set Clock Uncertainty (jitter + skew margin)
set_clock_uncertainty 0.15 [get_clocks CORE_CLK]

# Constrain Input and Output Port Delays relative to Clock
set_input_delay  -clock CORE_CLK -max 0.40 [get_ports data_in]
set_output_delay -clock CORE_CLK -max 0.35 [get_ports data_out]

# False Path Constraint for Asynchronous Reset
set_false_path -from [get_ports rst_n]`,
            expectedOutput: 'STA tool generates timing report with positive setup slack (> 0.05ns) and positive hold slack (> 0.02ns).',
            commonMistakes: [
              'Thinking you can fix hold violations by slowing down the clock (Hold time is completely independent of clock frequency!)',
              'Ignoring clock skew across large silicon die areas, causing race conditions between adjacent flip-flops',
              'Not constraining asynchronous clock domain crossings (CDC) with dual-flip-flop synchronizers'
            ],
            bestPractices: [
              'Fix setup violations by inserting pipeline registers to break long combinational paths',
              'Fix hold violations by inserting delay buffer cells on fast data paths during physical synthesis',
              'Use Multi-Vt cells: low-Vt cells on critical speed paths, high-Vt cells on non-critical paths to minimize leakage current'
            ],
            practiceQuestion: 'A circuit has $T_{cq} = 0.2ns$, $T_{setup} = 0.15ns$, $T_{hold} = 0.1ns$, and clock skew $T_{skew} = 0.05ns$. If the maximum combinational delay is $T_{comb} = 1.6ns$, what is the maximum operational clock frequency?'
          }
        ]
      }
    ],
    codePractice: [
      {
        id: 'cp-vlsi-1',
        title: 'Synchronous FIFO with Gray Code Pointers',
        difficulty: 'Hard',
        description: 'Write a synthesizable Verilog module for a dual-port circular FIFO with status flags (full, empty, watermark) using parameterized data width and depth.',
        requirements: [
          'Parameterized DATA_WIDTH (default 8) and ADDR_WIDTH (default 4, depth = 16)',
          'Generate full and empty flags cleanly without multi-bit race conditions',
          'Use synchronous active-low reset `rst_n`'
        ],
        starterCode: `module sync_fifo #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
)(
    input  wire                  clk,
    input  wire                  rst_n,
    input  wire                  wr_en,
    input  wire [DATA_WIDTH-1:0] wr_data,
    input  wire                  rd_en,
    output reg  [DATA_WIDTH-1:0] rd_data,
    output wire                  full,
    output wire                  empty
);
    // TODO: Implement internal memory array and pointer logic
endmodule`,
        expectedOutput: 'FIFO stores and outputs data continuously with accurate empty/full boundary assertions.',
        hints: [
          'Add an extra MSB bit to write and read pointers (width = ADDR_WIDTH + 1) to distinguish between full and empty states',
          'FIFO is empty when wr_ptr == rd_ptr',
          'FIFO is full when wr_ptr == {~rd_ptr[ADDR_WIDTH], rd_ptr[ADDR_WIDTH-1:0]}'
        ],
        solutionCode: `module sync_fifo #(
    parameter DATA_WIDTH = 8,
    parameter ADDR_WIDTH = 4
)(
    input  wire                  clk,
    input  wire                  rst_n,
    input  wire                  wr_en,
    input  wire [DATA_WIDTH-1:0] wr_data,
    input  wire                  rd_en,
    output reg  [DATA_WIDTH-1:0] rd_data,
    output wire                  full,
    output wire                  empty
);
    localparam DEPTH = 1 << ADDR_WIDTH;
    reg [DATA_WIDTH-1:0] mem [0:DEPTH-1];
    reg [ADDR_WIDTH:0] wr_ptr, rd_ptr;

    assign empty = (wr_ptr == rd_ptr);
    assign full  = (wr_ptr == {~rd_ptr[ADDR_WIDTH], rd_ptr[ADDR_WIDTH-1:0]});

    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            wr_ptr  <= 0;
            rd_ptr  <= 0;
            rd_data <= 0;
        end else begin
            if (wr_en && !full) begin
                mem[wr_ptr[ADDR_WIDTH-1:0]] <= wr_data;
                wr_ptr <= wr_ptr + 1'b1;
            end
            if (rd_en && !empty) begin
                rd_data <= mem[rd_ptr[ADDR_WIDTH-1:0]];
                rd_ptr  <= rd_ptr + 1'b1;
            end
        end
    end
endmodule`,
        testCases: [
          { input: 'Write 16 elements into empty FIFO', expected: 'full flag asserts high on 16th write' },
          { input: 'Read 16 elements from full FIFO', expected: 'empty flag asserts high on 16th read' }
        ]
      }
    ],
    quiz: [
      {
        id: 'qz-vlsi-1-1',
        question: 'If a digital circuit experiences a hold time violation during Static Timing Analysis, which remedy is correct?',
        options: [
          'Lower the system clock frequency',
          'Insert delay buffer cells into the data path between the launch and capture flip-flops',
          'Increase the supply voltage to speed up the transistors',
          'Replace all flip-flops with transparent latches'
        ],
        correctAnswerIndex: 1,
        explanation: 'Hold time requires data to remain stable for a minimum time after the clock edge ($T_{cq} + T_{comb} \\ge T_{hold}$). It is independent of the clock period. Inserting buffer cells increases $T_{comb}$, fixing the hold violation.',
        topic: 'Static Timing Analysis'
      },
      {
        id: 'qz-vlsi-1-2',
        question: 'What is the purpose of Clock Gating in modern ASIC synthesis?',
        options: [
          'It completely eliminates static leakage current in standby mode',
          'It shuts off the clock tree to inactive registers, drastically reducing dynamic power consumption ($P = C V^2 f$)',
          'It synchronizes signals arriving from different asynchronous clock domains',
          'It converts binary signals into ternary optical pulses'
        ],
        correctAnswerIndex: 1,
        explanation: 'Dynamic power is proportional to switching frequency ($P_{dyn} = \\alpha C V_{dd}^2 f$). When registers do not need to update their contents, an integrated clock gating cell (ICG) turns off their clock pulses, saving massive power.',
        topic: 'Low Power ASIC Design'
      }
    ],
    practicalTasks: [
      {
        id: 'pt-vlsi-1',
        title: 'RTL to Gate-Level Synthesis with Timing Constraints',
        objective: 'Write synthesizable Verilog for an AXI4-Lite slave register bank, apply SDC timing constraints for 250 MHz operation, and analyze the resulting area and timing slack report.',
        steps: [
          'Code an AXI4-Lite 32-bit register read/write controller state machine in Verilog',
          'Define clock periods, input delays, and output delays in an SDC constraint file',
          'Synthesize using Yosys or Synopsys Design Compiler targeting an open-source 45nm standard cell library',
          'Verify zero setup violations and zero negative slack in the static timing summary'
        ],
        codeTemplate: `// AXI-Lite Read/Write Handshake Controller Template
module axi_lite_slave (
    input  wire        s_axi_aclk,
    input  wire        s_axi_aresetn,
    input  wire [31:0] s_axi_awaddr,
    input  wire        s_axi_awvalid,
    output reg         s_axi_awready,
    // Add W, B, AR, R channels
);`,
        verificationCriteria: [
          'Gate-level netlist contains only primitive NAND, NOR, and D-Flip-Flop cells',
          'Worst Negative Slack (WNS) is >= 0.00 ns at 250 MHz target clock',
          'Formal equivalence verification (LEC) confirms synthesized netlist matches RTL behavior'
        ]
      }
    ],
    miniProject: {
      title: 'Pipelined 32-bit RISC-V (RV32I) Core Implementation',
      description: 'Implement a 5-stage pipelined RV32I processor core (Fetch, Decode, Execute, Memory, Writeback) in SystemVerilog featuring hazard detection, data forwarding, and branch prediction.',
      techStack: ['Verilog / SystemVerilog', 'ModelSim / QuestaSim', 'Yosys Synthesis', 'GTKWave Waveform Viewer'],
      deliverables: [
        'Complete synthesizable RTL for all 5 pipeline stages and hazard forwarding unit',
        'Verification testbench running compiled C programs (Fibonacci and Matrix Multiplication)',
        'Timing report proving 200+ MHz operation on TSMC 28nm standard cell library',
        'CPI (Cycles Per Instruction) benchmark report demonstrating near 1.1 CPI efficiency'
      ],
      architectureDiagramText: `[Fetch (IF)] ---> [Decode (ID)] ---> [Execute (EX)] ---> [Memory (MEM)] ---> [Writeback (WB)]
         ^                               |                      |
         |                               v                      v
         +===================== [Hazard Forwarding Unit] <======+`
    },
    assessment: {
      passingScore: 85,
      questions: [
        {
          id: 'as-vlsi-1-1',
          question: 'What is metastability, and how is it mitigated when transferring signals between asynchronous clock domains?',
          options: [
            'A state where a flip-flop output hovers between 0 and 1 for an indeterminate time, resolved using a 2-stage D-FF synchronizer',
            'When a gate burns out due to excess voltage, mitigated by series resistors',
            'When two inputs drive the same wire at once, mitigated by tri-state gates',
            'When clock frequency exceeds memory read speed, mitigated by cache'
          ],
          correctAnswerIndex: 0,
          explanation: 'When setup/hold times are violated, a flip-flop can enter a metastable state between logic 0 and 1. Passing the signal through a cascade of two flip-flops (2FF synchronizer) allows the metastable state to settle before reading.',
          topic: 'Clock Domain Crossing (CDC)'
        }
      ]
    }
  }
};
