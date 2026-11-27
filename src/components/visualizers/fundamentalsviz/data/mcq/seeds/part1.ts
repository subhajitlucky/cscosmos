import type { ITProblemSeed } from '../types';

export const part1Seeds: ITProblemSeed[] = [
  // ---------------------------------------------------------------------------
  // Chapter 1: Computer Organization & Block Diagram (20 questions)
  // ---------------------------------------------------------------------------
  {
    chapterId: 'computer-organization',
    title: 'Role of the Arithmetic Logic Unit',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which task is performed directly by the arithmetic logic unit (ALU)?',
    options: [
      'Fetching the next instruction from main memory',
      'Decoding instruction opcodes into control signals',
      'Adding two register values and testing the result for zero',
      'Holding the address of the next instruction',
    ],
    answer: 2,
    explanation:
      'The ALU performs arithmetic and logic operations such as addition and zero tests, while fetching, decoding, and address holding belong to other units.',
    hint: 'Separate calculation from instruction supply and control.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Instruction Decoding Unit',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which component interprets an instruction held in the instruction register and issues the signals that carry it out?',
    options: ['Main memory', 'Control unit', 'Arithmetic logic unit', 'Input unit'],
    answer: 1,
    explanation:
      'The control unit decodes the opcode and generates timing and control signals that coordinate the other functional units.',
    hint: 'Think of the unit that directs rather than calculates.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Stored-Program Advantage',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A computer keeps both its instructions and data in the same main memory. A new program is loaded simply by writing its instructions into memory.',
    prompt: 'Which benefit follows most directly from this stored-program design?',
    options: [
      'The processor no longer needs a control unit',
      'Programs execute without any memory access',
      'Each instruction must be wired permanently into the CPU',
      'The machine can switch to a different program without rewiring hardware',
    ],
    answer: 3,
    explanation:
      "Because instructions are stored as data, loading a new program changes the machine's behaviour without changing its physical wiring.",
    hint: 'Contrast stored instructions with a fixed plugboard or wired control.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Where the Active Program Resides',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A student opens a word processor. Its instructions and the document being edited are both held in main memory while the program runs.',
    prompt: 'Which functional unit holds the program and data during execution?',
    options: ['Memory unit', 'Output unit', 'Control unit', 'Arithmetic logic unit'],
    answer: 0,
    explanation:
      'Main memory stores the instruction and data values that the processor fetches and manipulates while a program is running.',
    hint: 'Distinguish storage from the unit that performs operations.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Address Bus Direction',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What information does the address bus carry, and in which direction?',
    options: [
      'Data values, in both directions between CPU and memory',
      'Memory or I/O addresses, from the processor outward',
      'Interrupt priorities, from peripherals to the processor',
      'Clock pulses, from the control unit to all devices',
    ],
    answer: 1,
    explanation:
      'The address bus is unidirectional: the processor or bus master places an address on it to select a memory location or device.',
    hint: 'Ask which side chooses the location.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Keyboard Input Path',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A user presses the letter K on a keyboard. The scan code is converted and placed on the data bus for the processor.',
    prompt: 'Which functional unit does the keyboard represent in this operation?',
    options: ['Input unit', 'Output unit', 'Secondary storage', 'Control unit'],
    answer: 0,
    explanation:
      'The keyboard is an input device that converts user actions into signals the computer can process.',
    hint: 'Decide whether data flows into or out of the computer.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Program Counter Contents',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the program counter (PC) hold during normal instruction execution?',
    options: [
      'The instruction currently being decoded',
      'The result of the last arithmetic operation',
      'The address of the next instruction to be fetched',
      'The number of clock cycles already used',
    ],
    answer: 2,
    explanation:
      'The PC stores the address of the next instruction; it is incremented or changed by a branch after an instruction is fetched.',
    hint: 'It points to an address, not to the instruction bits themselves.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Choosing a Supercomputer',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A national weather agency must run very large climate simulations that require massive parallel computation and sustained high throughput.',
    prompt: 'Which class of computer is the most appropriate choice?',
    options: ['Microcomputer', 'Minicomputer', 'Mainframe', 'Supercomputer'],
    answer: 3,
    explanation:
      'Supercomputers are designed for the largest, most compute-intensive scientific workloads, using many processors in parallel.',
    hint: "Match the workload's scale to the fastest class.",
  },
  {
    chapterId: 'computer-organization',
    title: 'Bidirectional Bus',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In a typical three-bus architecture, which bus must be bidirectional?',
    options: ['Address bus', 'Data bus', 'Control signal for memory read', 'Clock line'],
    answer: 1,
    explanation:
      'Data travels from processor to memory on a write and from memory to processor on a read, so the data bus must support both directions.',
    hint: 'Which bus carries values that move both ways?',
  },
  {
    chapterId: 'computer-organization',
    title: 'Instruction Fetch Sequence',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'During a fetch cycle the processor transfers an instruction from memory. The relevant registers are PC, MAR, MDR and IR.',
    prompt: 'Which sequence correctly describes the fetch operation?',
    options: [
      'PC -> IR, IR -> MAR, memory -> MDR, MDR -> PC',
      'MAR -> PC, memory -> IR, MDR -> MAR, IR -> MDR',
      'MDR -> PC, MAR -> memory, IR -> MDR, PC -> IR',
      'PC -> MAR, memory -> MDR, MDR -> IR, then PC is incremented',
    ],
    answer: 3,
    explanation:
      'The PC supplies the address through the MAR, memory returns the word to the MDR, and the MDR loads the IR before the PC advances.',
    hint: 'Follow the address out first and the instruction bits in second.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Control Bus Function',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the main purpose of the control bus?',
    options: [
      'To carry the binary representation of operands',
      'To select which memory cell is accessed',
      'To carry timing and command signals such as read and write',
      'To distribute electrical power to disk drives',
    ],
    answer: 2,
    explanation:
      'The control bus carries signals that say what operation to perform and when, coordinating the processor, memory and I/O devices.',
    hint: 'It tells devices what to do rather than where or what value.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Bank Transaction Processing',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      "A bank expects thousands of simultaneous account queries and batch updates, and it prioritizes reliability and high I/O throughput over desktop portability.",
    prompt: 'Which computer class best fits this workload?',
    options: ['Mainframe', 'Microcomputer', 'Embedded microcontroller', 'Personal digital assistant'],
    answer: 0,
    explanation:
      "Mainframes are built for high-volume transaction processing, reliability and many concurrent users, matching the bank's requirements.",
    hint: 'Focus on concurrent transactions and reliability, not personal use.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Von Neumann Bottleneck',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does the von Neumann bottleneck refer to?',
    options: [
      'The limited number of general-purpose registers',
      'The delay caused by decoding complex instructions',
      'The limited transfer rate between the processor and memory over a shared path',
      'The slow rotation speed of a magnetic disk',
    ],
    answer: 2,
    explanation:
      'Instructions and data share the same memory path, so the processor can be starved of operands even when it could compute faster.',
    hint: 'Think about the single path between CPU and memory.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Classifying a Desktop System',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An office buys a single-user desktop computer with a microprocessor, 16 GB of RAM and a solid-state drive for routine document work.',
    prompt: 'How is this system best classified?',
    options: ['Microcomputer', 'Mainframe', 'Supercomputer', 'Minicomputer'],
    answer: 0,
    explanation:
      'A personal desktop built around a microprocessor is a microcomputer; mainframes and supercomputers serve much larger workloads.',
    hint: 'The processor class names the computer class.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Width of the MAR',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'If a processor has a 12-bit memory address register, how many distinct memory locations can it directly address?',
    options: ['12', '4096', '1024', '65536'],
    answer: 1,
    explanation:
      'A 12-bit address can represent 2^12 = 4096 different values, so it can select 4096 locations.',
    hint: 'Each bit doubles the number of address combinations.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Clock Period Calculation',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A processor runs at 2 GHz. One clock period is the reciprocal of the clock frequency.',
    prompt: 'What is the duration of one clock period?',
    options: ['2 seconds', '2 microseconds', '0.2 nanoseconds', '0.5 nanoseconds'],
    answer: 3,
    explanation:
      'A 2 GHz clock completes 2 x 10^9 cycles per second, so one period is 1 / (2 x 10^9) = 0.5 ns.',
    hint: 'Divide one second by the number of cycles per second.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Machine Cycle Time',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'An instruction needs 4 clock cycles to fetch, 2 to decode and 6 to execute. The processor clock is 1 GHz.',
    prompt: 'How long does the instruction take to complete?',
    options: ['6 ns', '10 ns', '24 ns', '12 ns'],
    answer: 3,
    explanation:
      'The instruction uses 4 + 2 + 6 = 12 cycles. At 1 GHz each cycle lasts 1 ns, so the total is 12 ns.',
    hint: 'Add all cycles first, then multiply by the period.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Comparing MIPS Ratings',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Processor A runs at 2 GHz with an average CPI of 4. Processor B runs at 3 GHz with an average CPI of 6. MIPS = clock frequency in MHz / CPI.',
    prompt: 'Which statement correctly compares their MIPS ratings?',
    options: [
      "A is faster, at 500 MIPS versus B's 300 MIPS",
      'They are equal at 500 MIPS each',
      "B is faster, at 500 MIPS versus A's 250 MIPS",
      "A is faster, at 800 MIPS versus B's 500 MIPS",
    ],
    answer: 1,
    explanation:
      'MIPS equals MHz divided by CPI: A gives 2000 / 4 = 500, and B gives 3000 / 6 = 500, so they are equal.',
    hint: 'Convert GHz to MHz before dividing by CPI.',
  },
  {
    chapterId: 'computer-organization',
    title: 'RISC and CISC Characteristics',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Which statement best distinguishes RISC from CISC designs?',
    options: [
      'RISC favors simple fixed-length instructions and many registers; CISC favors richer variable-length instructions',
      'RISC uses microcode for every instruction, while CISC avoids microcode entirely',
      'RISC instructions always take more clock cycles than CISC instructions',
      'RISC removes the need for a program counter',
    ],
    answer: 0,
    explanation:
      'RISC emphasizes a small, regular instruction set that pipelines well, while CISC provides complex instructions that may need multiple cycles or microcode.',
    hint: 'Contrast simplicity and regularity with rich, complex instructions.',
  },
  {
    chapterId: 'computer-organization',
    title: 'Bulk Data Transfer',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A disk controller must move a large block of data to memory while the processor continues executing an unrelated program. The transfer should not require the processor to copy each word.',
    prompt: 'Which mechanism is designed for this task?',
    options: [
      'Polled input/output',
      'Programmed I/O with busy waiting',
      'Direct memory access',
      'Memory-mapped output only',
    ],
    answer: 2,
    explanation:
      'DMA lets a controller transfer blocks directly between a device and memory, interrupting the processor only when the transfer finishes.',
    hint: 'Look for a controller that bypasses per-word CPU copying.',
  },

  // ---------------------------------------------------------------------------
  // Chapter 2: Memory, Storage & Peripherals (20 questions)
  // ---------------------------------------------------------------------------
  {
    chapterId: 'memory-storage',
    title: 'Fastest Storage Level',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which storage level is normally the fastest to access?',
    options: ['CPU registers', 'Main memory', 'Solid-state drive', 'Magnetic tape'],
    answer: 0,
    explanation:
      'Registers sit inside the processor and are accessed in a single cycle, making them faster than cache, RAM or disk.',
    hint: 'Look for storage closest to the execution units.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Volatile Memory',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which type of memory loses its stored contents when power is removed?',
    options: ['ROM', 'Flash memory', 'RAM', 'Magnetic disk'],
    answer: 2,
    explanation:
      'RAM is volatile: it needs continuous power to hold its stored charge or state, unlike ROM and secondary storage.',
    hint: 'Think about the working memory cleared at shutdown.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Camera Photo Storage',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A digital camera must keep thousands of photographs after its battery is removed, and it needs rewritable storage with no moving parts.',
    prompt: 'Which storage technology is most suitable?',
    options: ['DRAM', 'Flash memory', 'Cache memory', 'Magnetic tape cartridge'],
    answer: 1,
    explanation:
      'Flash is non-volatile, rewritable and solid-state, so it retains photos without power and suits compact portable devices.',
    hint: 'Choose non-volatile storage with no moving parts.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Erasable Firmware Chip',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A technician must update firmware on a chip. Existing contents must be erased by exposing the chip to ultraviolet light before reprogramming.',
    prompt: 'Which memory type is described?',
    options: ['PROM', 'EEPROM', 'SRAM', 'EPROM'],
    answer: 3,
    explanation:
      'EPROM is erased with ultraviolet light through a quartz window, after which it can be reprogrammed, unlike one-time PROM.',
    hint: 'The UV erasure is the distinctive clue.',
  },
  {
    chapterId: 'memory-storage',
    title: 'One-Time Programmable ROM',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which memory can be written once by the user and then cannot be erased or rewritten?',
    options: ['EEPROM', 'PROM', 'EPROM', 'DRAM'],
    answer: 1,
    explanation:
      'A PROM is supplied blank and programmed once by blowing fuses or antifuses; after that its contents are fixed.',
    hint: 'Its name signals one-time programming.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Read-Only Distribution',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A publisher wants to distribute a large reference archive on a cheap disc that readers can only read, not rewrite.',
    prompt: 'Which optical medium fits best?',
    options: ['CD-ROM', 'CD-RW', 'DVD-RAM', 'Hard disk'],
    answer: 0,
    explanation:
      'CD-ROM is pressed at manufacture and read-only for users, which suits mass distribution of fixed reference content.',
    hint: 'Pick the optical format that is read-only by design.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Purpose of Cache Memory',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why does a computer include cache memory between the CPU and main memory?',
    options: [
      'To permanently store the operating system',
      'To increase the capacity of main memory',
      'To reduce average access time by keeping frequently used data close to the CPU',
      'To back up data automatically every hour',
    ],
    answer: 2,
    explanation:
      'Cache holds recently or frequently used blocks, so many accesses complete quickly instead of waiting for slower main memory.',
    hint: 'Focus on reducing waiting time, not on adding capacity.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Hard Disk Recording Method',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A hard disk stores data on rotating platters coated with a magnetic material. A read/write head senses or changes the surface.',
    prompt: 'How is each bit represented on the platter?',
    options: [
      'By a pit and a land along a spiral track',
      'By the presence or absence of an electrical charge in a capacitor',
      'By the resistance of a phase-change alloy',
      'By the direction of magnetization of a small region',
    ],
    answer: 3,
    explanation:
      'Magnetic disks encode bits as differently magnetized regions, which the head detects or writes as the platter rotates.',
    hint: 'The coating is magnetic, so think about magnetization direction.',
  },
  {
    chapterId: 'memory-storage',
    title: 'SRAM Versus DRAM',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which statement correctly compares SRAM and DRAM?',
    options: [
      'SRAM uses capacitors and needs periodic refresh; DRAM uses flip-flops',
      'SRAM uses flip-flops and needs no refresh; DRAM uses capacitors and needs refresh',
      'Both are non-volatile and retain data without power',
      'DRAM is faster and more expensive per bit than SRAM',
    ],
    answer: 1,
    explanation:
      'SRAM stores each bit in a bistable latch, while DRAM stores charge on a capacitor that leaks and must be refreshed.',
    hint: 'Recall which technology needs refreshing.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Average Memory Access Time',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A cache has a 90% hit rate. A hit costs 1 ns; a miss costs 11 ns including the cache lookup and main-memory access. AMAT = hit rate x hit time + miss rate x miss time.',
    prompt: 'What is the average memory access time?',
    options: ['1.1 ns', '10 ns', '11 ns', '2 ns'],
    answer: 3,
    explanation: 'AMAT = 0.9 x 1 + 0.1 x 11 = 0.9 + 1.1 = 2 ns.',
    hint: 'Weight each access time by its probability.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Principle of Locality',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which pair correctly states temporal and spatial locality?',
    options: [
      'Temporal: recently used data is likely reused soon; spatial: nearby addresses are likely used soon',
      'Temporal: nearby addresses are used together; spatial: recently used data is reused',
      'Temporal: data is used once only; spatial: data is never reused',
      'Temporal: cache is always slower; spatial: memory is always faster',
    ],
    answer: 0,
    explanation:
      'Programs tend to reuse recent items and to access adjacent locations, which is why caches fetch blocks and retain recent lines.',
    hint: "Link 'temporal' with time and 'spatial' with nearby space.",
  },
  {
    chapterId: 'memory-storage',
    title: 'Addressable Memory Size',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A byte-addressable memory has a 12-bit address bus. Each address selects one byte.',
    prompt: 'What is the total addressable capacity?',
    options: ['512 bytes', '2048 bytes', '4096 bytes', '8192 bytes'],
    answer: 2,
    explanation:
      'With 12 address bits there are 2^12 = 4096 addresses, and one byte per address gives 4096 bytes.',
    hint: 'Raise two to the number of address bits.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Purpose of Virtual Memory',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What main problem does virtual memory solve?',
    options: [
      'It makes the CPU clock run faster',
      'It removes the need for cache memory',
      'It makes secondary storage as fast as registers',
      'It lets programs use more address space than physical memory provides',
    ],
    answer: 3,
    explanation:
      'Virtual memory maps program addresses to physical frames and can keep inactive pages on disk, supporting programs larger than RAM.',
    hint: 'Think about running a program bigger than available RAM.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Page Fault Cost',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A program repeatedly accesses pages that are not in physical memory, so each access triggers a page fault and a disk transfer.',
    prompt: 'What is the most direct performance consequence?',
    options: [
      'Average memory access time falls sharply',
      'Effective access time rises sharply because disk latency is much larger than RAM latency',
      'The cache hit rate becomes 100%',
      'The CPU clock frequency decreases automatically',
    ],
    answer: 1,
    explanation:
      'Servicing a fault requires slow secondary-storage access, so frequent faults dominate execution time and sharply raise effective access time.',
    hint: 'Compare disk latency with memory latency.',
  },
  {
    chapterId: 'memory-storage',
    title: 'EEPROM Erasure',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'How is an EEPROM typically erased and rewritten?',
    options: [
      'Electrically, often byte by byte, without removing it from the circuit',
      'By ultraviolet light through a quartz window',
      'Only once, by blowing internal fuses',
      'By refreshing its capacitor cells continuously',
    ],
    answer: 0,
    explanation:
      'EEPROM can be erased and reprogrammed electrically in small units while installed, making it useful for configurable firmware.',
    hint: 'The first E stands for electrically.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Rugged Portable Storage',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A field laptop will be carried over rough terrain and may be knocked while running. The design should avoid mechanical seek delays and fragile moving parts.',
    prompt: 'Which secondary storage is the best fit?',
    options: ['Hard disk drive', 'CD-ROM drive', 'Solid-state drive', 'Floppy disk drive'],
    answer: 2,
    explanation:
      'An SSD has no moving heads or spinning platters, so it resists shock and provides fast random access in portable systems.',
    hint: 'Choose the technology without moving parts.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Effective Access Time with Cache',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'A cache has a 95% hit rate. Cache access takes 2 ns, and a miss costs 50 ns in total. Use AMAT = hit rate x hit time + miss rate x miss time.',
    prompt: 'What is the effective access time?',
    options: ['2.5 ns', '5.0 ns', '4.4 ns', '47.5 ns'],
    answer: 2,
    explanation: 'AMAT = 0.95 x 2 + 0.05 x 50 = 1.9 + 2.5 = 4.4 ns.',
    hint: 'The miss rate is 5%, not 95%.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Memory Chip Address Lines',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A memory chip is organized as 1K x 8 bits, where 1K = 1024 words. Each word is selected by a unique binary address.',
    prompt: 'How many address lines does the chip require?',
    options: ['8', '10', '12', '16'],
    answer: 1,
    explanation:
      '1024 = 2^10, so ten address lines are needed to select one of the 1024 words; the 8 data bits need separate lines.',
    hint: 'Find the exponent that makes two equal 1024.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Reducing Conflict Misses',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'Which cache design avoids the conflict misses caused by two frequently used blocks mapping to the same direct-mapped line?',
    options: [
      'A smaller cache with a larger block size',
      'A write-through policy instead of write-back',
      'A lower clock frequency for the memory bus',
      'A fully associative cache that allows a block to occupy any line',
    ],
    answer: 3,
    explanation:
      'Full associativity removes the fixed line mapping, so two hot blocks do not evict each other merely because their indices collide.',
    hint: 'Conflict misses come from restrictive placement.',
  },
  {
    chapterId: 'memory-storage',
    title: 'Archival Backup Choice',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'An archive must retain 4 TB of data for a decade at low cost. Retrieval is rare and sequential, and the media will be stored on shelves rather than accessed randomly.',
    prompt: 'Which storage medium is most cost-effective for this archive?',
    options: ['Magnetic tape', 'DRAM modules', 'Cache memory', 'Enterprise SSDs'],
    answer: 0,
    explanation:
      'Magnetic tape offers very low cost per terabyte and long shelf life, and its sequential access is acceptable for rare archival retrieval.',
    hint: 'Match sequential, infrequent access with low media cost.',
  },

  // ---------------------------------------------------------------------------
  // Chapter 3: Number Systems & Data Representation (20 questions)
  // ---------------------------------------------------------------------------
  {
    chapterId: 'number-systems',
    title: 'Binary 1011 to Decimal',
    difficulty: 'Easy',
    type: 'mcq',
    context:
      'Binary 1011 has positional weights 8, 4, 2 and 1: 1 x 8 + 0 x 4 + 1 x 2 + 1 x 1.',
    prompt: 'What is the decimal value of binary 1011?',
    options: ['9', '11', '13', '15'],
    answer: 1,
    explanation:
      'Adding the set weights gives 8 + 2 + 1 = 11, so binary 1011 equals decimal 11.',
    hint: 'Add the weights where the bit is 1.',
  },
  {
    chapterId: 'number-systems',
    title: 'Converting 29 to Binary',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Repeatedly divide 29 by 2: the remainders from least to most significant are 1, 0, 1, 1, 1.',
    prompt: 'Which binary number equals decimal 29?',
    options: ['10101', '11001', '11011', '11101'],
    answer: 3,
    explanation:
      'Reading the remainders upward gives 11101, and 16 + 8 + 4 + 1 = 29 confirms the conversion.',
    hint: 'The final remainder is the most significant bit.',
  },
  {
    chapterId: 'number-systems',
    title: 'Hexadecimal 2F to Decimal',
    difficulty: 'Easy',
    type: 'mcq',
    context: 'Hexadecimal 2F = 2 x 16 + 15 x 1, because F represents 15.',
    prompt: 'What is the decimal value of hexadecimal 2F?',
    options: ['47', '31', '45', '215'],
    answer: 0,
    explanation:
      'Hexadecimal 2F equals 2 x 16 + 15 x 1 = 32 + 15 = 47 in decimal.',
    hint: 'Multiply the first digit by 16 and add the second.',
  },
  {
    chapterId: 'number-systems',
    title: 'Octal 17 to Decimal',
    difficulty: 'Easy',
    type: 'scenario',
    context: 'Octal 17 = 1 x 8 + 7 x 1.',
    prompt: 'What is the decimal value of octal 17?',
    options: ['8', '14', '15', '23'],
    answer: 2,
    explanation:
      'Octal uses base 8, so 1 x 8 + 7 x 1 = 15; octal 17 is not decimal 17.',
    hint: 'Use powers of 8, not powers of 10.',
  },
  {
    chapterId: 'number-systems',
    title: 'Binary 1100 to Hexadecimal',
    difficulty: 'Easy',
    type: 'mcq',
    context: 'Group binary 1100 into one nibble and convert: 1100 = 12 in decimal.',
    prompt: 'Which hexadecimal digit represents binary 1100?',
    options: ['A', 'B', 'C', 'D'],
    answer: 2,
    explanation:
      '1100 has value 8 + 4 = 12, and hexadecimal C represents 12, so the nibble is written as C.',
    hint: 'Hexadecimal digits run 0-9 and then A-F for 10-15.',
  },
  {
    chapterId: 'number-systems',
    title: 'BCD Encoding of 47',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'In packed BCD each decimal digit is stored in its own 4-bit group: 4 = 0100 and 7 = 0111.',
    prompt: 'What is the packed BCD representation of decimal 47?',
    options: ['0100 1011', '0100 0111', '0010 1111', '1011 0111'],
    answer: 1,
    explanation:
      'Packed BCD encodes each decimal digit separately, giving 0100 for 4 and 0111 for 7.',
    hint: 'Encode each digit, not the whole number.',
  },
  {
    chapterId: 'number-systems',
    title: 'Bits in a Byte',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How many bits are in one standard byte?',
    options: ['2', '4', '6', '8'],
    answer: 3,
    explanation:
      'A byte is conventionally 8 bits, which can represent 256 distinct values from 00000000 to 11111111.',
    hint: 'Recall the size of a common ASCII character code.',
  },
  {
    chapterId: 'number-systems',
    title: 'Choosing a Character Encoding',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A team must store text containing Latin, Greek, Chinese and Arabic characters. ASCII uses 7-bit codes, whereas Unicode assigns a code point to characters across many scripts.',
    prompt: 'Which encoding best supports all these scripts in one system?',
    options: ['Unicode', 'ASCII', 'EBCDIC', 'BCD'],
    answer: 0,
    explanation:
      'Unicode covers characters from many writing systems, while ASCII and EBCDIC are limited legacy code sets and BCD encodes digits only.',
    hint: 'Pick the standard designed for worldwide scripts.',
  },
  {
    chapterId: 'number-systems',
    title: "Two's Complement of 00010110",
    difficulty: 'Medium',
    type: 'mcq',
    context:
      'For an 8-bit value, invert every bit of 00010110 to get 11101001, then add 1.',
    prompt: "What is the 8-bit two's complement of 00010110?",
    options: ['11101001', '10010110', '11101010', '00010111'],
    answer: 2,
    explanation:
      "Inverting 00010110 gives 11101001, and adding 1 produces 11101010, which is the 8-bit two's complement encoding.",
    hint: 'Invert all eight bits first, then add one.',
  },
  {
    chapterId: 'number-systems',
    title: 'Representing Negative Five',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'To encode -5 in 8 bits, write +5 as 00000101, invert the bits to 11111010, then add 1.',
    prompt: "What is the 8-bit two's complement representation of -5?",
    options: ['10000101', '11111010', '00000101', '11111011'],
    answer: 3,
    explanation:
      "The two's complement of positive 5 (00000101) is 11111011, which represents -5 in 8-bit signed form.",
    hint: 'A negative number in two\'s complement has a leading 1.',
  },
  {
    chapterId: 'number-systems',
    title: 'Binary Addition',
    difficulty: 'Medium',
    type: 'mcq',
    context:
      'Binary 1011 equals decimal 11 and 0110 equals decimal 6. Adding the binary values gives 1011 + 0110 = 10001.',
    prompt: 'What is the sum of binary 1011 and 0110?',
    options: ['10001', '1101', '1001', '11111'],
    answer: 0,
    explanation:
      'Eleven plus six equals seventeen, and binary 10001 equals 16 + 1 = 17, confirming the sum.',
    hint: 'Watch the carry out of the most significant column.',
  },
  {
    chapterId: 'number-systems',
    title: "One's Complement Interpretation",
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'In 4-bit one\'s complement, 1010 has sign bit 1 and magnitude bits 010. Invert all bits to get 0101, which is 5.',
    prompt: 'What decimal value does 1010 represent in 4-bit one\'s complement?',
    options: ['-10', '-5', '+5', '-6'],
    answer: 1,
    explanation:
      'The leading 1 marks a negative number, and the remaining value is the complement of 0101, which is 5, so the value is -5.',
    hint: 'Invert the magnitude bits, then apply the sign.',
  },
  {
    chapterId: 'number-systems',
    title: 'Hexadecimal Addition',
    difficulty: 'Medium',
    type: 'mcq',
    context: '1A in hexadecimal is 26 in decimal, and 27 is 39. Their sum is 65, which is 41 in hexadecimal.',
    prompt: 'What is 1A (hex) + 27 (hex)?',
    options: ['0x31', '0x3D', '0x51', '0x41'],
    answer: 3,
    explanation:
      'Adding decimal equivalents gives 26 + 39 = 65, and 65 = 4 x 16 + 1 = 41 in hexadecimal.',
    hint: 'Convert to decimal, add, then convert back.',
  },
  {
    chapterId: 'number-systems',
    title: 'Octal Addition',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Octal 34 equals decimal 28, and octal 17 equals decimal 15. Their decimal sum is 43, and 43 equals 53 in octal.',
    prompt: 'What is 34 (octal) + 17 (octal)?',
    options: ['0o53', '0o43', '0o51', '0o61'],
    answer: 0,
    explanation:
      'In decimal the operands are 28 and 15, summing to 43; converting 43 to base 8 gives octal 53.',
    hint: 'Add in decimal, then convert the total to base 8.',
  },
  {
    chapterId: 'number-systems',
    title: "Range of 8-bit Two's Complement",
    difficulty: 'Medium',
    type: 'mcq',
    prompt: "What range of signed integers can be represented in 8-bit two's complement?",
    options: ['-127 to +127', '-128 to +127', '-128 to +128', '0 to 255'],
    answer: 1,
    explanation:
      "Eight-bit two's complement has one more negative value than positive: -128 through +127, giving 256 distinct codes.",
    hint: 'One code is reserved for the most negative value.',
  },
  {
    chapterId: 'number-systems',
    title: 'Excess-3 Encoding',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Excess-3 adds 3 to each decimal digit before writing its 4-bit binary value. For digit 6, 6 + 3 = 9 = 1001.',
    prompt: 'What is the excess-3 code for decimal digit 4?',
    options: ['0100', '0110', '0111', '1000'],
    answer: 2,
    explanation:
      'Adding the bias gives 4 + 3 = 7, and 7 in 4-bit binary is 0111, the excess-3 code.',
    hint: 'Add three before converting to binary.',
  },
  {
    chapterId: 'number-systems',
    title: "Negative Two's Complement Value",
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'The 8-bit pattern 11110011 has sign bit 1. Invert it to 00001100, add 1 to get 00001101, which equals 13.',
    prompt: 'What decimal value does 11110011 represent in 8-bit two\'s complement?',
    options: ['-13', '-12', '-3', '+243'],
    answer: 0,
    explanation:
      "Taking the two's complement of 11110011 gives 00001101 = 13, and the original sign bit makes the value -13.",
    hint: 'Negate the pattern, read the magnitude, then restore the sign.',
  },
  {
    chapterId: 'number-systems',
    title: 'Fractional Binary Conversion',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Binary 101101 = 32 + 8 + 4 + 1 = 45. The fraction .101 = 1/2 + 0/4 + 1/8 = 0.625.',
    prompt: 'What is the decimal value of binary 101101.101?',
    options: ['45.125', '45.25', '45.625', '45.75'],
    answer: 2,
    explanation:
      'The integer part is 45 and the fraction .101 equals 0.5 + 0.125 = 0.625, giving 45.625.',
    hint: 'Convert the integer and fractional parts separately.',
  },
  {
    chapterId: 'number-systems',
    title: 'Hexadecimal to Octal',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'Convert 3D7 (hex) to binary: 0011 1101 0111. Regroup from the right in threes: 001 111 010 111.',
    prompt: 'What is hexadecimal 3D7 in octal?',
    options: ['0o1527', '0o1657', '0o1717', '0o1727'],
    answer: 3,
    explanation:
      'The binary groups give 001 = 1, 111 = 7, 010 = 2 and 111 = 7, so hexadecimal 3D7 equals octal 1727.',
    hint: 'Go through binary and regroup in threes.',
  },
  {
    chapterId: 'number-systems',
    title: 'Sign-Magnitude Representation',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'In 16-bit sign-magnitude form, the leftmost bit is the sign (1 for negative) and the remaining 15 bits hold 25 = 000000000011001.',
    prompt: 'What is the 16-bit sign-magnitude representation of -25?',
    options: [
      '0000 0000 0001 1001',
      '1000 0000 0001 1001',
      '1111 1111 1110 0111',
      '1000 0000 0011 0010',
    ],
    answer: 1,
    explanation:
      'Setting the sign bit to 1 and appending the 15-bit magnitude 000000000011001 gives 1000 0000 0001 1001.',
    hint: 'Keep the magnitude bits unchanged and set only the sign bit.',
  },

  // ---------------------------------------------------------------------------
  // Chapter 4: Boolean Algebra & Logic Circuits (20 questions)
  // ---------------------------------------------------------------------------
  {
    chapterId: 'boolean-algebra',
    title: 'AND Gate Output',
    difficulty: 'Easy',
    type: 'mcq',
    context: 'AND outputs 1 only when every input is 1. Truth row: A = 1, B = 1.',
    prompt: 'What is the output of a two-input AND gate when both inputs are 1?',
    options: ['1', '0', 'Undefined', 'It alternates with the clock'],
    answer: 0,
    explanation:
      'The AND function is true only for the all-ones input combination, so 1 AND 1 equals 1.',
    hint: 'AND demands that every input be high.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'OR Gate with One High Input',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An OR gate receives A = 0 and B = 1. The truth table gives output 0 only for A = 0, B = 0.',
    prompt: 'What is the OR gate output for these inputs?',
    options: ['0', 'Undefined', '1', 'It depends on the previous state'],
    answer: 2,
    explanation:
      'OR produces 1 whenever at least one input is 1, so 0 OR 1 equals 1.',
    hint: 'One high input is enough for OR.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Inverter Output',
    difficulty: 'Easy',
    type: 'mcq',
    context: 'A NOT gate outputs the complement of its input: NOT 0 = 1 and NOT 1 = 0.',
    prompt: 'What is the output of a NOT gate whose input is 0?',
    options: ['0', '1', 'High impedance', 'The previous output'],
    answer: 1,
    explanation:
      'An inverter complements its input, so a 0 input produces a 1 output, and a 1 input would produce 0.',
    hint: 'NOT flips the input value.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'NAND Gate with Both Inputs High',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A NAND gate is an AND gate followed by an inverter. For A = 1 and B = 1, AND gives 1.',
    prompt: 'What is the NAND output for A = 1, B = 1?',
    options: ['1', 'High impedance', 'Undefined', '0'],
    answer: 3,
    explanation:
      'AND of 1 and 1 is 1, and inverting that result gives 0, the NAND output.',
    hint: 'Apply AND first, then invert the result.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'NOR Gate Output',
    difficulty: 'Easy',
    type: 'mcq',
    context: 'NOR outputs 1 only when all inputs are 0. Truth row: A = 0, B = 0.',
    prompt: 'What is the output of a two-input NOR gate when both inputs are 0?',
    options: ['0', 'Undefined', '1', 'It toggles'],
    answer: 2,
    explanation:
      'NOR is the complement of OR; since 0 OR 0 is 0, the NOR output is 1.',
    hint: 'NOR is OR followed by inversion.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'XOR with Different Inputs',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'XOR outputs 1 when its inputs differ and 0 when they match. Consider A = 1, B = 0.',
    prompt: 'What is the XOR output for A = 1 and B = 0?',
    options: ['1', '0', 'Undefined', 'It retains the last value'],
    answer: 0,
    explanation:
      'The inputs differ, so the exclusive-OR function produces 1; if both inputs were equal, XOR would produce 0.',
    hint: 'XOR means exactly one input is high.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'XNOR with Equal Inputs',
    difficulty: 'Easy',
    type: 'mcq',
    context: 'XNOR is the complement of XOR. For A = 1 and B = 1, XOR gives 0.',
    prompt: 'What is the XNOR output when both inputs are 1?',
    options: ['0', '1', 'Undefined', 'It depends on the clock'],
    answer: 1,
    explanation:
      'Equal inputs make XOR 0, so XNOR complements that to 1; XNOR thus detects equality and outputs 0 for different inputs.',
    hint: 'XNOR is true when the inputs match.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Complement Law',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'For any Boolean variable A, the expression A + A\' combines a value with its complement.',
    prompt: 'What does A + A\' simplify to?',
    options: ['A', 'A\'', '0', '1'],
    answer: 3,
    explanation:
      'One of A or its complement must be 1, so their OR is always 1; this is the complement law.',
    hint: 'Consider both possible values of A.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'DeMorgan Transformation',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: "According to DeMorgan's theorem, which expression is equivalent to (A + B)'?",
    options: ['A\' + B\'', 'A AND B', 'A\' AND B\'', 'A\' + B'],
    answer: 2,
    explanation:
      "DeMorgan's theorem complements each variable and changes OR to AND, so (A + B)' becomes A'B'.",
    hint: 'Break the bar and change the operator.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Simplifying an Absorption Expression',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Truth table check for A + A\'B: when A = 0 it reduces to B; when A = 1 the output is 1, matching A + B.',
    prompt: "Which expression is equivalent to A + A'B?",
    options: ['A + B', 'A\' + B', 'AB', 'A\'B\''],
    answer: 0,
    explanation:
      "A + A'B = (A + A')(A + B) = 1 x (A + B) = A + B by distribution and the complement law.",
    hint: "Expand using the distributive law, then use A + A' = 1.",
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Absorption Law',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What does the Boolean expression A + AB simplify to?',
    options: ['B', 'A', 'A + B', 'AB'],
    answer: 1,
    explanation:
      'A + AB = A(1 + B) = A x 1 = A, because 1 + B is always 1.',
    hint: 'Factor out A and apply the OR identity.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Three-Input AND Gate',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A three-input AND gate receives A = 1, B = 0, C = 1. AND outputs 1 only when every input is 1.',
    prompt: 'What is the gate output?',
    options: ['1', 'It toggles', 'Undefined', '0'],
    answer: 3,
    explanation:
      'Because B is 0, the all-ones condition fails, so the three-input AND output is 0.',
    hint: 'A single low input drives AND low.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Half-Adder Sum Output',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which logic expression gives the sum output of a half adder with inputs A and B?',
    options: ['A XOR B', 'A AND B', 'A OR B', 'A XNOR B'],
    answer: 0,
    explanation:
      'The sum bit is 1 only when exactly one input is 1, which is the XOR function; carry is A AND B.',
    hint: 'The sum excludes the case where both inputs are 1.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Karnaugh Map Pair',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A two-variable function F(A,B) has 1s at minterms 0 (A = 0, B = 0) and 1 (A = 0, B = 1). The pair differs only in B.',
    prompt: 'What is the minimized expression for F?',
    options: ['A', 'B', 'A\'', 'B\''],
    answer: 2,
    explanation:
      'The two cells share A = 0 and differ in B, so B is eliminated and the group reduces to A\'.',
    hint: 'Keep the variable that stays constant in the group.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Bit-Storage Element',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which circuit stores a single bit and updates its state only at a clock edge?',
    options: ['Multiplexer', 'Decoder', 'Half adder', 'Flip-flop'],
    answer: 3,
    explanation:
      'A flip-flop is a bistable sequential circuit that holds one bit and changes state on a triggering clock edge.',
    hint: 'Look for a sequential, bistable element.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'NAND Used as an Inverter',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      "A NAND gate outputs (A x B)'. If both input terminals are tied together to the same signal X, the output becomes (X x X)'.",
    prompt: 'What function does the gate then perform?',
    options: ['Constant 0', 'NOT X', 'X OR X', 'A latch'],
    answer: 1,
    explanation:
      "Tying both NAND inputs to X gives (X x X)' = X', so a single NAND gate acts as an inverter.",
    hint: 'Substitute X for both inputs in the NAND expression.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Three-Minterm Simplification',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      "F = AB + A'B + AB', evaluated over all four input combinations. The first two terms give B; B + AB' then gives A + B.",
    prompt: 'What is the simplified form of F?',
    options: ['A\' + B\'', 'AB', 'A + B', 'A\'B\''],
    answer: 2,
    explanation:
      "AB + A'B = B, and B + AB' = B + A, so the function simplifies to A + B.",
    hint: 'Combine the first two terms, then absorb the third.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Factored Form Simplification',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      "Truth table for (A+B)(A+B'): A = 0 gives (B)(B') = 0; A = 1 gives (1)(1) = 1 for either B value.",
    prompt: 'What is the simplified expression?',
    options: ['A', 'B', 'A + B', 'A\'B'],
    answer: 0,
    explanation:
      "Distributing gives A + BB' = A + 0 = A, and the truth table confirms the function equals A.",
    hint: 'Expand the product and use BB\' = 0.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Three-Variable K-Map Group',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'For variables A, B, C, minterm 0 is 000 and minterm 2 is 010. The two cells differ only in B.',
    prompt: 'Which product term represents the group containing minterms 0 and 2?',
    options: ['A\'B', 'A\'C\'', 'AC\'', 'B\'C\''],
    answer: 1,
    explanation:
      'Both cells have A = 0 and C = 0 while B changes, so the common factors give A\'C\'.',
    hint: 'Eliminate the variable that changes within the group.',
  },
  {
    chapterId: 'boolean-algebra',
    title: 'Shift Register Contents',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A 4-bit shift register holds 1010 as Q3 Q2 Q1 Q0. A serial 1 enters Q3 on each clock, and each existing bit shifts one position toward Q0.',
    prompt: 'What does the register hold after one clock pulse?',
    options: ['0101', '1011', '1110', '1101'],
    answer: 3,
    explanation:
      'The new 1 becomes Q3, old Q3 moves to Q2, old Q2 to Q1 and old Q1 to Q0, giving 1101.',
    hint: 'Shift every old bit right and insert the new bit at the left.',
  },
];
