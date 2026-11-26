export const INTERACTIVE_KEYS = new Set([
  'block-diagram-builder',
  'cpu-signal-tracer',
  'bus-width-calculator',
  'instruction-cycle-stepper',
  'address-space-explorer',
  'io-mode-simulator',
  'architecture-compare',
  'performance-calculator',
] as const);

export type InteractiveKey = typeof INTERACTIVE_KEYS extends Set<infer K> ? K : never;

export interface WorkedExample {
  title: string;
  steps: string[];
  result: string;
}

export interface ComputerChapter {
  id: string; // stable chapter slug used in /learn/[chapter]
  number: number; // 1..8
  title: string;
  category: 'Architecture' | 'Units & Buses' | 'Execution & I/O' | 'Systems';
  minutes: number;
  summary: string;
  intuition: string;
  formalModel: string;
  diagram: { label: string; blocks: string[]; flow: string[] };
  workedExample: WorkedExample;
  misconceptions: { claim: string; correction: string }[];
  interactive: InteractiveKey;
  takeaways: string[];
}

export const computerOrganizationChapters: ComputerChapter[] = [
  {
    id: 'digital-computer-block-diagram',
    number: 1,
    title: 'The Digital Computer Block Diagram',
    category: 'Architecture',
    minutes: 9,
    summary:
      'Input, CPU, memory, output and secondary storage as one data path — the map every later chapter expands.',
    intuition:
      'A computer is a loop: data enters through an input unit, the CPU works on it with instructions and data held in memory, and results leave through an output unit. Secondary storage keeps both program and data when the power is off. Every other topic in this site is a zoomed-in view of one box in this picture. Treat the diagram as a city map: it does not tell you how each building works, but it tells you which roads connect them and which direction goods travel. Once you can trace a piece of data along the whole loop, abstract ideas like "fetch", "store", and "interrupt" stop being vocabulary and become physical journeys.',
    formalModel:
      'Under the stored-program model, instructions and data share one addressable memory. The CPU exchanges information with memory and I/O over three bus families: address (where), data (what), and control (when and how). The block diagram is therefore a statement about information flow, not about physical box size. Formally, the machine is a finite-state controller (the control unit) driving a datapath (the ALU plus registers) over a set of addressable storage locations, with peripherals mapped into the same address space. Every operation can be described as a transfer: a source produces a word, a bus carries it, and a destination latches it on a clock edge.',
    diagram: {
      label: 'Classic digital computer block diagram',
      blocks: [
        'Input unit',
        'CPU (ALU + CU + registers)',
        'Memory unit',
        'Output unit',
        'Secondary storage',
      ],
      flow: [
        'Input → CPU ↔ Memory',
        'CPU ↔ Memory → Output',
        'Secondary storage ↔ Memory',
      ],
    },
    workedExample: {
      title: 'Typing a character and seeing it on screen',
      steps: [
        'The keyboard controller places a scan code in its device register.',
        'The CPU reads it over the data bus after placing the device address on the address bus.',
        'The program stores the character code in memory, then writes it to the display controller.',
        'The display controller rasterises the glyph and the monitor emits light.',
      ],
      result:
        'One full trip around the block diagram, with memory as the shared staging area.',
    },
    misconceptions: [
      {
        claim: 'The CPU stores programs permanently.',
        correction:
          'Programs live in secondary storage and are copied into memory before the CPU fetches their instructions.',
      },
      {
        claim: 'Buses carry only data.',
        correction:
          'Address and control buses are separate channels: address width sets the addressable space, while control lines carry read/write and timing signals.',
      },
      {
        claim: 'Input and output devices plug straight into the ALU.',
        correction:
          'Peripherals talk through device controllers over the bus system; the ALU only manipulates values already placed in registers.',
      },
    ],
    interactive: 'block-diagram-builder',
    takeaways: [
      'The block diagram is the map of every later chapter.',
      'Instructions and data share memory in a stored-program machine.',
      'Address, data and control buses answer where, what and when.',
      'Any computation can be read as source → bus → destination transfers.',
    ],
  },
  {
    id: 'functional-units',
    number: 2,
    title: 'Functional Units of the CPU',
    category: 'Units & Buses',
    minutes: 11,
    summary:
      'The ALU, register file, control unit and buses inside the CPU, and how a clock choreographs their cooperation.',
    intuition:
      'If the block diagram is a city, the CPU is its busiest factory. The arithmetic logic unit (ALU) is the tool bench that actually combines bits; the register file is the small set of shelves right next to the bench where operands wait, because reaching out to main memory is slow. The control unit is the foreman: it does not do arithmetic itself, but it reads the instruction and waves the right wires at the right moments so the ALU, registers and memory all agree on what is happening. A clock is the metronome that keeps the foreman and the workers in step — nothing commits until the tick.',
    formalModel:
      'A processor is a datapath plus a controller. The datapath is described by a set of registers R, functional units f (ALU, shifter, comparator), and the multiplexers and write-enable signals that route values between them. In one clock cycle, a register transfers its contents along a path through combinational logic, and the result is latched on the next active edge. The controller is a finite-state machine whose outputs are control signals; its next state depends on the current instruction opcode and condition flags. Because combinational logic has propagation delay, the clock period must exceed the slowest path between two registers — the classic timing constraint T_clock ≥ t_clk-to-q + t_comb + t_setup.',
    diagram: {
      label: 'CPU datapath and control',
      blocks: [
        'Instruction register',
        'Control unit (finite-state machine)',
        'Register file',
        'ALU / shifter',
        'Status flags',
        'Internal CPU buses',
      ],
      flow: [
        'Opcode → Control unit → control signals',
        'Register file → ALU → Register file',
        'ALU → Status flags → Control unit',
      ],
    },
    workedExample: {
      title: 'Adding two register values under control',
      steps: [
        'The instruction is decoded; the control unit asserts the register-read signals for R1 and R2.',
        'Both operands are placed on the internal buses and presented to the ALU inputs.',
        'The control unit selects the ADD operation and the ALU produces the sum plus carry/zero flags.',
        'On the next clock edge the result is written back to the destination register, while flags update the status register.',
      ],
      result:
        'One register-transfer cycle: decode, drive, compute, latch — all synchronised by the clock.',
    },
    misconceptions: [
      {
        claim: 'The control unit performs the arithmetic.',
        correction:
          'The control unit only generates signals; the ALU is the combinational circuit that computes the result.',
      },
      {
        claim: 'A faster clock always means a faster program.',
        correction:
          'The clock can only rise as far as the slowest datapath allows; raising it beyond that causes setup violations and wrong results.',
      },
      {
        claim: 'Registers and cache are the same thing.',
        correction:
          'Registers are explicitly named in instructions and sit in the datapath; cache is transparent hardware between CPU and main memory.',
      },
    ],
    interactive: 'cpu-signal-tracer',
    takeaways: [
      'The CPU is a datapath driven by a finite-state controller.',
      'Registers hold operands close to the ALU to avoid slow memory trips.',
      'The clock sets the pace; signals decide what each unit does each tick.',
      'Clock period is bounded by the slowest register-to-register path.',
    ],
  },
  {
    id: 'buses-and-interconnection',
    number: 3,
    title: 'Buses and Interconnection',
    category: 'Units & Buses',
    minutes: 12,
    summary:
      'How address, data and control buses move words between units, and why width, arbitration and hierarchy matter.',
    intuition:
      'A bus is a shared road, not a private wire between every pair of devices. Because many devices take turns on the same road, the system needs rules: who may drive it now (arbitration), how long a transfer lasts (a bus cycle), and how a device knows it is being addressed (the address bus plus a chip-select). Data width is the number of lanes — a 64-bit data bus moves eight bytes at once, while a 32-bit address bus can name 2³² distinct locations. Just as a single city street jams under heavy traffic, a single bus becomes a bottleneck, which is why real machines use a hierarchy of bridges and separate high-speed paths.',
    formalModel:
      'A bus is a set of shared signal lines partitioned into an address bus of width a, a data bus of width d, and a control bus carrying read/write strobes, ready and clock. The addressable space is 2^a locations; with byte addressing and a d-bit data bus, a single transfer moves d/8 bytes. A transaction proceeds through address phase, optional wait states, data phase, and release. Because only one master may drive the bus at a time, an arbiter grants ownership by priority or round-robin policy. Effective bandwidth is roughly d/8 × clock × transfers-per-cycle, reduced by wait states, arbitration overhead and burst fragmentation.',
    diagram: {
      label: 'Three-bus system interconnect',
      blocks: [
        'Address bus (width a)',
        'Data bus (width d)',
        'Control bus (R/W, ready, clock)',
        'Bus arbiter',
        'Bridge to I/O bus',
      ],
      flow: [
        'CPU master → arbiter grants bus → address placed',
        'Addressed slave ↔ CPU over data bus',
        'Control lines qualify each transfer phase',
      ],
    },
    workedExample: {
      title: 'Reading one word from a memory chip',
      steps: [
        'The CPU requests bus ownership and the arbiter grants it for one transaction.',
        'It places the target address on the address bus and asserts the read line.',
        'The addressed memory chip recognises its address range and drives the requested word onto the data bus.',
        'The CPU latches the word on the strobe, then releases the bus for the next master.',
      ],
      result:
        'A complete bus cycle: grant, address, transfer, release — with width deciding how much data moved.',
    },
    misconceptions: [
      {
        claim: 'A 32-bit processor always has a 32-bit address bus.',
        correction:
          'Address and data widths are independent design choices; a machine may have a 32-bit data path with a wider physical address space.',
      },
      {
        claim: 'Wider buses make every program faster automatically.',
        correction:
          'Wider buses help only when the memory system and access patterns can supply that parallelism; latency often dominates.',
      },
      {
        claim: 'All devices can drive the bus at once to increase throughput.',
        correction:
          'Electrical contention would corrupt data; an arbiter ensures exactly one master drives the shared lines at a time.',
      },
    ],
    interactive: 'bus-width-calculator',
    takeaways: [
      'Address, data and control buses answer where, what and when.',
      'Address width sets the number of locations: 2^a.',
      'Shared buses need arbitration and a defined bus cycle.',
      'Bus hierarchies exist because a single shared path becomes a bottleneck.',
    ],
  },
  {
    id: 'instruction-cycle',
    number: 4,
    title: 'The Instruction Cycle',
    category: 'Execution & I/O',
    minutes: 13,
    summary:
      'Fetch, decode, execute, memory access and write-back — the repeating rhythm that turns stored bits into action.',
    intuition:
      'A program is not a flowing stream; it is a long list of instructions the CPU visits one at a time, over and over. Each visit follows the same heartbeat: fetch the next instruction from memory using the program counter, decode what it asks for, execute it in the ALU or another unit, possibly touch memory, and write the result back to a register. Then the program counter advances and the cycle begins again. Branches are the twist — they change the program counter, so the "next" instruction is somewhere other than the following address. Once you see this loop, a debugger becomes understandable: a breakpoint is just a pause at a chosen point in the cycle.',
    formalModel:
      'Execution is modelled as a finite-state machine with states Fetch, Decode, Execute, Memory and Write-back. In Fetch, PC supplies the address and the instruction register is loaded while PC increments to PC + instruction_length. Decode expands the opcode and register fields into control signals. Execute performs the ALU operation or computes an effective address; branches conditionally overwrite PC. The memory state handles loads and stores, and write-back commits results to the register file. Exceptions and interrupts inject a special state that saves context and redirects PC to a handler vector. Pipelining overlaps these states for different instructions but preserves the same logical order.',
    diagram: {
      label: 'The fetch–execute cycle',
      blocks: [
        'Program counter (PC)',
        'Instruction register',
        'Decode / control',
        'ALU / effective address',
        'Data memory',
        'Register write-back',
      ],
      flow: [
        'PC → Instruction memory → Instruction register',
        'Decode → Execute → (Memory) → Write-back',
        'Branch target → PC (loop closes here)',
      ],
    },
    workedExample: {
      title: 'Executing a load and a conditional branch',
      steps: [
        'Fetch: PC points at LOAD R1, [R2+4]; the instruction is read and PC advances.',
        'Decode: the control unit identifies a load and signals the register file to read R2.',
        'Execute: the ALU computes R2 + 4 as the effective address.',
        'Memory: the word at that address is read; write-back places it in R1.',
        'The next fetch retrieves a branch; if the zero flag is set, its target replaces PC and the loop jumps.',
      ],
      result:
        'Two passes around the cycle, showing how a branch redirects the otherwise sequential fetch.',
    },
    misconceptions: [
      {
        claim: 'The computer executes a whole program at once.',
        correction:
          'The CPU executes one instruction per cycle (more with superscalar issue); programs only appear continuous at human speed.',
      },
      {
        claim: 'The program counter always increases after every instruction.',
        correction:
          'Branches, calls and exceptions can replace PC with a different address, changing the flow of control.',
      },
      {
        claim: 'Every instruction writes to memory.',
        correction:
          'Only load/store-style instructions touch data memory; many operations stay entirely inside registers.',
      },
    ],
    interactive: 'instruction-cycle-stepper',
    takeaways: [
      'The instruction cycle is fetch → decode → execute → memory → write-back.',
      'The program counter drives fetch and defines sequential flow.',
      'Branches are instructions that change the program counter.',
      'Interrupts insert a handler into the cycle without losing the saved context.',
    ],
  },
  {
    id: 'memory-organization',
    number: 5,
    title: 'Memory Organization',
    category: 'Execution & I/O',
    minutes: 12,
    summary:
      'Address spaces, word alignment, the memory hierarchy and what a cache really buys you.',
    intuition:
      'Memory is a giant array of numbered slots, and an address is simply the number of the slot you want. But not all slots cost the same to reach: registers are instant, cache is very fast, main memory is slower, and disk is slower still. This hierarchy works because programs show locality — they revisit the same instructions and nearby data again and again — so keeping a small, fast copy close to the CPU pays off. Alignment matters too: reading a word that straddles a boundary may take two memory accesses. Think of memory as a library where the most-requested books are kept on your desk (cache), the rest are on shelves (RAM), and rare ones are in the archive (disk).',
    formalModel:
      'With byte-addressed memory of a bits, the address space contains 2^a bytes numbered 0 … 2^a−1. A w-bit word is naturally aligned when its address is a multiple of w/8; misaligned accesses may require multiple cycles. Because main memory is far slower than the processor, caches exploit temporal and spatial locality by keeping blocks (cache lines) of recently used data. A cache is characterised by capacity C, line size B, associativity and a replacement policy; effective access time is hit_time + miss_rate × miss_penalty. Address translation may map virtual addresses to physical frames via a page table and TLB, adding another layer of the same cache principle.',
    diagram: {
      label: 'Memory hierarchy and address decoding',
      blocks: [
        'Registers (~1 cycle)',
        'L1/L2 cache (SRAM)',
        'Main memory (DRAM)',
        'Secondary storage (disk/SSD)',
        'Address decoder / tag comparison',
      ],
      flow: [
        'CPU request → cache tag check → hit or miss',
        'Miss → main memory → fill cache line',
        'Virtual address → TLB → physical address',
      ],
    },
    workedExample: {
      title: 'Why one loop runs faster after the first pass',
      steps: [
        'The first time the loop reads an array, the data is not in cache, so each line triggers a miss.',
        'Each miss fetches an entire cache line, bringing in nearby elements as well as the requested one.',
        'The second pass finds those neighbours already resident, so accesses hit in cache.',
        'Average access time drops from DRAM latency toward cache latency because of spatial locality.',
      ],
      result:
        'The same code, different speed — explained by locality and cache fills, not by the clock.',
    },
    misconceptions: [
      {
        claim: 'More RAM always makes a computer faster.',
        correction:
          'Capacity avoids swapping, but speed depends on latency, bandwidth and cache behaviour; extra RAM idle does not accelerate computation.',
      },
      {
        claim: 'A cache is a bigger version of main memory.',
        correction:
          'Cache is a small, fast, transparent copy of selected lines; it is managed by hardware, not addressed directly by programs.',
      },
      {
        claim: 'Addresses refer to words, not bytes.',
        correction:
          'Most modern machines are byte-addressed; a multi-byte word simply spans several consecutive byte addresses.',
      },
    ],
    interactive: 'address-space-explorer',
    takeaways: [
      'An address is an index into a byte-addressed space of size 2^a.',
      'The hierarchy trades capacity for speed, exploiting locality.',
      'A cache works in lines, so neighbouring data comes along for free.',
      'Alignment and translation affect how many accesses a single read costs.',
    ],
  },
  {
    id: 'io-and-interrupts',
    number: 6,
    title: 'I/O and Interrupts',
    category: 'Execution & I/O',
    minutes: 12,
    summary:
      'How the CPU talks to slow devices: programmed I/O, interrupts and DMA, and why polling wastes time.',
    intuition:
      'Peripherals are orders of magnitude slower than the processor, so the central problem of I/O is waiting gracefully. Programmed I/O has the CPU repeatedly ask "are you ready?" — simple, but it burns cycles while spinning. An interrupt flips the relationship: the device signals the CPU only when it needs attention, letting the processor do useful work in between. Direct memory access (DMA) goes further — a controller transfers whole blocks between device and memory itself, interrupting the CPU just once when the job is done. It is the difference between refreshing a mailbox constantly, waiting for the doorbell, and having a courier deliver directly to your desk.',
    formalModel:
      'I/O devices expose control, status and data registers, mapped either into the memory address space (memory-mapped I/O) or a separate I/O space. In programmed I/O, the CPU polls a status bit in a loop. With interrupts, a device asserts an interrupt request; the CPU finishes the current instruction, saves the program counter and status, vectors to an interrupt service routine, services the device, and returns via a return-from-interrupt instruction. Interrupt controllers prioritise and mask sources. DMA offloads bulk transfer to a controller that steals bus cycles, generating a single completion interrupt rather than one per word.',
    diagram: {
      label: 'Interrupt-driven I/O path',
      blocks: [
        'I/O device (status/control/data registers)',
        'Interrupt controller',
        'CPU with interrupt vector',
        'Interrupt service routine',
        'DMA controller ↔ Memory',
      ],
      flow: [
        'Device asserts request → CPU acknowledges → vector to ISR',
        'ISR services device → return to interrupted program',
        'DMA block transfer → single completion interrupt',
      ],
    },
    workedExample: {
      title: 'Receiving a packet without wasting the CPU',
      steps: [
        'With polling, the CPU loops reading the device status register until the ready bit is set.',
        'With interrupts, the device raises a request when a packet arrives; the CPU saves context and enters the ISR.',
        'The ISR reads the packet from the device data register into a buffer and clears the interrupt.',
        'For large transfers a DMA controller moves the bytes directly to memory and interrupts only on completion.',
      ],
      result:
        'The CPU is freed from waiting: it works between events and is notified only when data is ready.',
    },
    misconceptions: [
      {
        claim: 'An interrupt stops the program permanently.',
        correction:
          'The CPU saves state, runs a short handler, and resumes the original program exactly where it left off.',
      },
      {
        claim: 'DMA means the CPU is never involved in I/O.',
        correction:
          'The CPU still sets up the transfer and handles the completion interrupt; only the per-word copying is offloaded.',
      },
      {
        claim: 'Polling is always slower than interrupts.',
        correction:
          'For very short, predictable waits polling can avoid interrupt overhead, but it wastes power and cycles on idle devices.',
      },
    ],
    interactive: 'io-mode-simulator',
    takeaways: [
      'Programmed I/O polls; interrupts notify; DMA moves blocks autonomously.',
      'An interrupt saves context, vectors to a handler, then returns.',
      'Memory-mapped I/O lets devices be addressed like memory locations.',
      'The right I/O strategy trades CPU time against latency and complexity.',
    ],
  },
  {
    id: 'architecture-variants',
    number: 7,
    title: 'Architecture Variants',
    category: 'Systems',
    minutes: 13,
    summary:
      'RISC vs CISC, von Neumann vs Harvard, pipelining and parallelism — the main design forks in CPU history.',
    intuition:
      'There is no single "correct" CPU; there are families of trade-offs. CISC gives instructions that do a lot of work in one line, shrinking programs but complicating decoding. RISC keeps instructions simple and uniform so they pipeline smoothly, trading code size for clock speed. Von Neumann machines share one memory for code and data; Harvard machines separate them so fetches and data accesses can happen at once. Pipelining is like an assembly line — several instructions are at different stages simultaneously, boosting throughput without shortening any single instruction. Understanding these forks lets you read a processor spec and predict its strengths instead of memorising brand names.',
    formalModel:
      'Instruction set architecture choices include operand model (register-register vs memory-operand), addressing modes, fixed versus variable instruction length, and the number of registers. A classic RISC pipeline has five stages (IF, ID, EX, MEM, WB) with a target steady-state throughput of one instruction per cycle once full. CISC designs often translate complex instructions into internal micro-operations. Separating instruction and data memory (Harvard) removes structural hazards that a unified von Neumann memory creates. Deeper pipelines raise clock frequency but increase branch misprediction penalties and hazards, which forwarding, stalls and branch prediction attempt to reclaim.',
    diagram: {
      label: 'Comparative architecture axes',
      blocks: [
        'CISC: rich instructions, variable length',
        'RISC: simple instructions, fixed length',
        'Von Neumann: unified memory',
        'Harvard: split instruction/data memory',
        'Five-stage pipeline (IF–ID–EX–MEM–WB)',
      ],
      flow: [
        'ISA choice → decoder complexity → achievable clock',
        'Unified vs split memory → structural hazards',
        'Pipeline depth → throughput vs branch penalty',
      ],
    },
    workedExample: {
      title: 'Why a deep pipeline can lose to a simple one',
      steps: [
        'A five-stage pipeline reaches one instruction per cycle once it is full, assuming no hazards.',
        'A branch changes the target after it is resolved, so instructions already fetched down the wrong path must be discarded.',
        'Deeper pipelines resolve branches later in cycles, so each misprediction flushes more stages and costs more cycles.',
        'Good branch prediction and forwarding recover most of the loss; poor prediction makes a deep pipeline slower on branch-heavy code.',
      ],
      result:
        'Pipeline depth is a trade-off between peak clock rate and the penalty of wrong-path work.',
    },
    misconceptions: [
      {
        claim: 'RISC means fewer instructions in a program.',
        correction:
          'RISC usually means more, simpler instructions; CISC can do more per instruction but each is harder to decode and pipeline.',
      },
      {
        claim: 'Pipelining makes each individual instruction finish faster.',
        correction:
          'Pipelining raises throughput — how many finish per cycle — not the latency of any one instruction.',
      },
      {
        claim: 'Harvard architecture is always faster than von Neumann.',
        correction:
          'Split memory removes some hazards but doubles complexity; the win depends on the workload and cache design.',
      },
    ],
    interactive: 'architecture-compare',
    takeaways: [
      'ISA design is a set of trade-offs, not a single best answer.',
      'RISC favours simple, pipeable instructions; CISC packs more work per instruction.',
      'Pipelining raises throughput and introduces hazards.',
      'Memory organisation affects which operations can overlap.',
    ],
  },
  {
    id: 'classification-and-performance',
    number: 8,
    title: 'Classification and Performance',
    category: 'Systems',
    minutes: 11,
    summary:
      'Flynn’s taxonomy, CPU time, CPI and Amdahl’s law — how to reason about speed instead of guessing from clock labels.',
    intuition:
      'People often compare computers by gigahertz alone, which is like judging a car by engine RPM. What matters is how much work gets done: CPU time = instruction count × cycles per instruction × clock cycle time. A "slower" clock with far fewer cycles per instruction can win easily. Flynn’s taxonomy classifies machines by how many instruction and data streams they handle — SISD, SIMD, MISD, MIMD — which tells you what kind of parallelism is available. Amdahl’s law then warns that speeding up one part helps only as much as that part’s share of the total: if half the work is serial, no amount of extra cores can double overall speed.',
    formalModel:
      'CPU time for a program is IC × CPI × T_clock, where IC is dynamic instruction count, CPI is average cycles per instruction, and T_clock is the clock period. Benchmarks summarise this as MIPS or MFLOPS but can mislead when instruction sets differ. Speedup = old_time / new_time. Amdahl’s law gives overall speedup = 1 / ((1 − f) + f/s), where f is the fraction of execution that can be improved and s is the improvement factor; as s grows, speedup saturates at 1/(1 − f). Flynn’s taxonomy uses instruction-stream and data-stream counts: SISD, SIMD, MISD, MIMD.',
    diagram: {
      label: 'Performance equation and Flynn taxonomy',
      blocks: [
        'Instruction count (IC)',
        'Cycles per instruction (CPI)',
        'Clock cycle time (T)',
        'Flynn: SISD / SIMD / MISD / MIMD',
        'Amdahl serial fraction (1 − f)',
      ],
      flow: [
        'IC × CPI × T → CPU time',
        'Serial fraction → Amdahl speedup ceiling',
        'Instruction/data streams → Flynn class',
      ],
    },
    workedExample: {
      title: 'Why doubling cores does not double speed',
      steps: [
        'A program spends 40% of its time in serial code and 60% in parallelisable work.',
        'Even with infinitely many cores, the 40% serial part stays, so Amdahl’s law caps speedup at 1/0.4 = 2.5×.',
        'With only a 4× improvement on the parallel part, speedup is 1/(0.4 + 0.6/4) ≈ 1.82×, still below the 2.5× ceiling.',
        'Optimising the serial fraction would raise the ceiling more than adding cores ever could.',
      ],
      result:
        'Speedup is governed by the fraction you can improve, not just by how much you improve it.',
    },
    misconceptions: [
      {
        claim: 'A higher clock frequency always means a faster computer.',
        correction:
          'CPU time also depends on instruction count and CPI; a high-clock design with many cycles per instruction can lose.',
      },
      {
        claim: 'Doubling the number of cores doubles performance.',
        correction:
          'Only the parallelisable fraction benefits; serial code and overheads impose Amdahl’s ceiling.',
      },
      {
        claim: 'MIPS is a fair comparison across different architectures.',
        correction:
          'Different ISAs need different instruction counts for the same task, so raw instructions per second can mislead.',
      },
    ],
    interactive: 'performance-calculator',
    takeaways: [
      'CPU time = instruction count × CPI × clock cycle time.',
      'Clock rate alone is a poor proxy for real performance.',
      'Amdahl’s law caps speedup by the unimproved serial fraction.',
      'Flynn’s taxonomy describes what kind of parallelism a machine offers.',
    ],
  },
];

export function getChapter(id: string): ComputerChapter | undefined {
  return computerOrganizationChapters.find((chapter) => chapter.id === id);
}
