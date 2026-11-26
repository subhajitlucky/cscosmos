// Teaching-oriented concept challenges for the Computer Organization site.
// Each challenge asks for reasoning, then pairs a short answer with a hint and
// an explanation that points back to the chapter where the idea was built.
// These are deliberately not an MCQ bank: there are no option lists to guess
// from, and every prompt has one defensible answer with explained reasoning.

export type ChallengeChapter =
  | 'digital-computer-block-diagram'
  | 'functional-units'
  | 'buses-and-interconnection'
  | 'instruction-cycle'
  | 'memory-organization'
  | 'io-and-interrupts'
  | 'architecture-variants'
  | 'classification-and-performance';

export type ChallengeKind = 'label' | 'calculate' | 'order' | 'scenario';

export interface Challenge {
  id: string;
  chapter: ChallengeChapter;
  prompt: string;
  hint: string;
  answer: string;
  explanation: string;
  kind: ChallengeKind;
}

export const challenges: Challenge[] = [
  // Chapter 1 — The Digital Computer Block Diagram
  {
    id: 'map-program-versus-archive',
    chapter: 'digital-computer-block-diagram',
    kind: 'label',
    prompt:
      'On the classic block diagram, which box holds the program and data the CPU is actively using, and which box keeps them when the power is off?',
    hint: 'One box sits directly on the fetch path; the other is an archive that must be copied first.',
    answer: 'Main memory holds the active program and data; secondary storage keeps them when power is off.',
    explanation:
      'Chapter 1 describes the stored-program model: the CPU fetches instructions only from addressable memory, so code and data share that box while the machine runs. Secondary storage is nonvolatile but is not on the fetch path, so its contents must be copied into memory first. The distinction is about roles in the data path, not physical size.',
  },
  {
    id: 'keystroke-to-pixel-order',
    chapter: 'digital-computer-block-diagram',
    kind: 'order',
    prompt:
      'A keystroke becomes a character on screen. Put these transfers in order: the display drives the monitor; the keyboard controller places a scan code in its register; the CPU writes the character to the display controller; the CPU reads the scan code over the bus; the CPU stores the character code in memory.',
    hint: 'Start at the input box and finish at the output box; memory is the staging area in the middle.',
    answer:
      'Keyboard scan code → CPU reads it → CPU stores it in memory → CPU writes it to the display controller → display drives the monitor.',
    explanation:
      'Chapter 1 traces one full trip around the block diagram: input → CPU ↔ memory → output. The CPU reaches peripherals through their controllers over the bus, and memory is the shared staging area where the character waits in between. Secondary storage is untouched unless the program deliberately saves the result.',
  },
  {
    id: 'launch-from-disk',
    chapter: 'digital-computer-block-diagram',
    kind: 'scenario',
    prompt:
      'You launch an application that is stored on a disk. Which block must the program pass through before its first instruction can execute, and why?',
    hint: 'Ask what the CPU can fetch from directly.',
    answer: 'The program must be copied from secondary storage into main memory first.',
    explanation:
      'Chapter 1 places secondary storage outside the fetch path: the CPU addresses instructions in memory, not on disk. Loading is therefore a copy into memory, after which fetching can begin. This is why "a program on disk" and "a running program" are different states of the same bits.',
  },

  // Chapter 2 — Functional Units of the CPU
  {
    id: 'alu-versus-controller',
    chapter: 'functional-units',
    kind: 'label',
    prompt:
      'Inside the CPU, which block actually forms the sum of two operands, and which block decides that this instruction should be an ADD?',
    hint: 'One block is combinational logic; the other is a finite-state machine emitting signals.',
    answer: 'The ALU computes the sum; the control unit decodes the instruction and asserts the signals that select ADD.',
    explanation:
      'Chapter 2 splits the processor into a datapath plus a controller. The ALU is combinational circuitry that manipulates bits but knows nothing about instructions; the control unit is a finite-state machine driven by the opcode and flags. Confusing the two produces the myth that the control unit "does the math" — it only waves the right wires at the right time.',
  },
  {
    id: 'clock-period-budget',
    chapter: 'functional-units',
    kind: 'calculate',
    prompt:
      'A register-to-register path has clock-to-Q delay 0.2 ns, ALU combinational delay 0.7 ns, and setup time 0.1 ns. What is the shortest safe clock period, and the maximum clock rate?',
    hint: 'Add the three delays along the path between two register banks.',
    answer: '1.0 ns period, so a maximum clock rate of 1 GHz.',
    explanation:
      'Chapter 2 gives the timing constraint T_clock ≥ t_clk-to-q + t_comb + t_setup: a value launched on one edge must travel through the logic and settle before the next edge. Raising the clock above 1 GHz here violates setup time and latches wrong results, which is why "just increase the clock" is not a free speedup.',
  },
  {
    id: 'operands-from-registers',
    chapter: 'functional-units',
    kind: 'scenario',
    prompt:
      'Design A reads two operands into registers, drives them into the ALU and latches the result on the next edge. Design B feeds main memory directly into the ALU inputs. Which design matches the register-transfer view, and why?',
    hint: 'Think of registers as shelves right next to the workbench.',
    answer: 'Design A.',
    explanation:
      'Chapter 2 presents registers as small, explicitly named storage next to the ALU precisely because main memory is slow. A datapath cycle is register → combinational logic → register, with the controller asserting read and write enables. In this model memory must first be loaded into the register file before the ALU can use its contents.',
  },

  // Chapter 3 — Buses and Interconnection
  {
    id: 'address-data-control-roles',
    chapter: 'buses-and-interconnection',
    kind: 'label',
    prompt:
      'During a memory read, one bus family carries the target location, another carries the returned word, and a third carries the read strobe. Name the three families and the question each one answers.',
    hint: 'where, what, when.',
    answer: 'Address bus (where), data bus (what), control bus (when and how).',
    explanation:
      'Chapter 3 treats a bus as a shared road split into three channels. Only the address bus selects the slave, only the data bus carries the value, and control lines qualify each phase of the cycle. Separating these roles is why address width and data width are independent design choices.',
  },
  {
    id: 'twenty-address-lines',
    chapter: 'buses-and-interconnection',
    kind: 'calculate',
    prompt:
      'A processor has 20 address lines and byte-addressed memory. How many distinct byte locations can it name?',
    hint: 'Each additional address line doubles the number of patterns.',
    answer: '2^20 = 1,048,576 byte locations, i.e. 1 MiB.',
    explanation:
      'Chapter 3 gives addressable space as 2^a locations for an a-bit address bus: twenty binary lines produce 2^20 distinct patterns. With byte addressing each pattern selects one byte, so the space is 1 MiB. This says nothing about the data bus width, which decides how many bytes move per transfer, not how many locations exist.',
  },
  {
    id: 'two-masters-one-bus',
    chapter: 'buses-and-interconnection',
    kind: 'scenario',
    prompt:
      'Two devices want to drive the shared bus in the same cycle. Why can they not both do it, and what resolves the conflict?',
    hint: 'Two drivers on one wire can short conflicting values.',
    answer:
      'Simultaneous driving would corrupt data through electrical contention; an arbiter grants bus ownership to one master per transaction.',
    explanation:
      'Chapter 3 stresses that a bus is shared wiring, not a private wire per pair of devices. Electrical contention means only one master may drive the lines, so an arbiter uses priority or round-robin to grant ownership before the address phase. The cycle is grant → address → transfer → release; arbitration overhead is one reason a wider bus does not automatically make programs faster.',
  },

  // Chapter 4 — The Instruction Cycle
  {
    id: 'five-stage-order',
    chapter: 'instruction-cycle',
    kind: 'order',
    prompt: 'Put these stages of a load instruction in order: write-back, execute, memory, fetch, decode.',
    hint: 'Find the instruction, understand it, compute where, get the value, commit it.',
    answer: 'Fetch → decode → execute → memory → write-back.',
    explanation:
      'Chapter 4 models execution as a finite-state machine with exactly those five states. Fetch uses the PC and loads the instruction register; decode turns opcode and register fields into control signals; execute forms the effective address; the memory state reads the word; write-back commits it to the register file. Register-only instructions simply skip the memory state.',
  },
  {
    id: 'branch-redirects-pc',
    chapter: 'instruction-cycle',
    kind: 'scenario',
    prompt:
      'A conditional branch is taken. At which stage is the program counter redirected, and how does that affect the next fetch?',
    hint: 'The ALU can compute a target and the flags can decide whether to use it.',
    answer:
      'In execute, the branch target replaces PC; the next fetch reads the instruction at the target instead of PC + instruction length.',
    explanation:
      'Chapter 4 closes the loop at the PC: fetch normally advances sequentially, but a branch is precisely an instruction that overwrites PC. That is why PC defines control flow and why a debugger breakpoint is just a pause at a chosen point in the cycle. Interrupts reuse the same redirection idea but inject a handler instead of a program-chosen target.',
  },
  {
    id: 'decode-versus-memory',
    chapter: 'instruction-cycle',
    kind: 'label',
    prompt:
      'In the classic cycle, in which stage is the opcode translated into control signals, and in which stage does a LOAD actually read data memory?',
    hint: 'One stage happens before the ALU; one happens after it.',
    answer: 'Decode produces the control signals; the memory stage performs the data read.',
    explanation:
      'Chapter 4 separates deciding from doing: decode expands the instruction into control signals, while the memory stage is the only state that touches data memory. Keeping them distinct explains why a register-register ADD never waits on a data memory access, and why the effective address must be computed in execute before the memory stage can use it.',
  },

  // Chapter 5 — Memory Organization
  {
    id: 'highest-byte-address',
    chapter: 'memory-organization',
    kind: 'calculate',
    prompt: 'With a 32-bit byte address, what is the highest valid address and how many bytes are addressable?',
    hint: 'Addresses start at zero.',
    answer: 'Highest address 2^32 − 1 = 4,294,967,295; address space 2^32 bytes = 4 GiB.',
    explanation:
      'Chapter 5 defines a byte-addressed space of size 2^a numbered 0 through 2^a−1. Starting at zero is why the last valid address is one less than the total count. It also explains why doubling the address width quadruples the space rather than adding a fixed amount.',
  },
  {
    id: 'misaligned-word',
    chapter: 'memory-organization',
    kind: 'calculate',
    prompt:
      'A 4-byte word is read starting at byte address 6. Is it naturally aligned, and how many memory accesses might it require?',
    hint: 'Check whether the start address is a multiple of the word size in bytes.',
    answer: 'No — 6 is not a multiple of 4, so the word straddles a 4-byte boundary and may take two accesses.',
    explanation:
      'Chapter 5 says a w-bit word is naturally aligned when its address is a multiple of w/8. A word at byte 6 covers bytes 6–9, crossing the boundary at byte 8, so hardware may need one access per side. Alignment is a property of addresses, not of how fast the clock runs.',
  },
  {
    id: 'second-pass-cache',
    chapter: 'memory-organization',
    kind: 'scenario',
    prompt:
      'A loop scans the same eight-element array twice; the second pass is much faster although the code and clock are unchanged. Explain why using chapter 5.',
    hint: 'What comes along with a cache miss?',
    answer:
      'The first pass misses cache and each miss fetches a whole line, bringing neighbouring elements in; the second pass hits those resident lines.',
    explanation:
      'Chapter 5 explains that caches work in lines and exploit spatial and temporal locality. The same instructions now find their data already resident, so average time moves from hit_time + miss_rate × miss_penalty toward hit_time. The speedup comes from where the data lives, not from the processor running faster.',
  },

  // Chapter 6 — I/O and Interrupts
  {
    id: 'keyboard-interrupt-choice',
    chapter: 'io-and-interrupts',
    kind: 'scenario',
    prompt:
      'A keyboard delivers one byte every few milliseconds while the CPU has useful work to do. Should it poll, use an interrupt, or use DMA? Justify the choice.',
    hint: 'Match the mechanism to the size and timing of the transfer.',
    answer: 'Use an interrupt: the device signals only when a byte is ready, so the CPU keeps working in between.',
    explanation:
      'Chapter 6 contrasts programmed I/O (the CPU spins on a status bit), interrupts (the device notifies), and DMA (a controller moves blocks). For a slow, tiny stream, polling wastes cycles and DMA setup costs more than the transfer it saves. An interrupt is the cheapest way to stop waiting without losing events.',
  },
  {
    id: 'interrupt-sequence',
    chapter: 'io-and-interrupts',
    kind: 'order',
    prompt:
      'Put interrupt handling in order: return from interrupt; device asserts request; vector to the ISR; CPU finishes the current instruction and saves PC/status; ISR services the device and clears the interrupt.',
    hint: 'The CPU never abandons an instruction half-done.',
    answer:
      'Request → finish instruction and save context → vector to ISR → service device and clear → return from interrupt.',
    explanation:
      'Chapter 6 is precise about order: the current instruction retires, context is saved, and only then does the CPU jump to the handler vector. Servicing includes clearing the device so it does not request again immediately; the return instruction restores the saved state. The original program resumes exactly where it left off — an interrupt is a detour, not a restart.',
  },
  {
    id: 'dma-block-copy',
    chapter: 'io-and-interrupts',
    kind: 'scenario',
    prompt:
      'A disk controller moves a 4 KB block straight into memory. Who copies each word, and roughly how many interrupts are raised?',
    hint: 'DMA offloads the per-word loop, not the whole conversation.',
    answer: 'The DMA controller copies the words; the CPU sets up the transfer and typically handles one completion interrupt.',
    explanation:
      'Chapter 6 notes that DMA controllers steal bus cycles to move blocks autonomously, sparing the CPU one interrupt per word. The CPU is still involved twice: it programs source, destination and length, then handles the completion interrupt. That split is the point — offload repetitive copying while control stays with the processor.',
  },

  // Chapter 7 — Architecture Variants
  {
    id: 'risc-or-cisc',
    chapter: 'architecture-variants',
    kind: 'label',
    prompt:
      'A processor uses fixed-length, simple register-register instructions and a five-stage pipeline. Is it closer to RISC or CISC, and what is the main trade-off?',
    hint: 'Ask who pays: the decoder or the code size.',
    answer: 'RISC: simple, uniform instructions pipeline smoothly, at the cost of more instructions (larger code).',
    explanation:
      'Chapter 7 frames ISA design as trade-offs. Fixed-length register-register instructions are easy to decode and schedule, supporting a steady pipeline and higher clock; CISC packs more work per instruction, shrinking code but complicating decode, often through micro-operations. Neither is universally faster — the workload decides.',
  },
  {
    id: 'harvard-split-memory',
    chapter: 'architecture-variants',
    kind: 'scenario',
    prompt:
      'A CPU can fetch an instruction and read a data operand in the same cycle without a structural conflict. Which memory organisation permits this, and what does it cost?',
    hint: 'One memory cannot be read twice at once; two can.',
    answer:
      'Harvard organisation with separate instruction and data memories; the cost is extra hardware complexity and less freedom to treat code as data.',
    explanation:
      'Chapter 7 shows that a unified von Neumann memory creates structural hazards when fetch and data access collide. Splitting the memories removes that conflict but duplicates paths and complicates code-as-data uses and unified caching. The gain is workload-dependent, which is why the chapter rejects "Harvard is always faster".',
  },
  {
    id: 'pipeline-throughput',
    chapter: 'architecture-variants',
    kind: 'calculate',
    prompt:
      'A five-stage pipeline is full. How many instructions complete per cycle in the steady state, and does any single instruction finish sooner than on a non-pipelined datapath?',
    hint: 'Assembly line: more cars come off the end, but each car still traverses the whole line.',
    answer: 'One completion per cycle; no, individual instruction latency is not reduced.',
    explanation:
      'Chapter 7 distinguishes throughput from latency: overlapping IF–ID–EX–MEM–WB for different instructions raises completions per cycle, not the time one instruction spends in the pipeline. Hazards and branch mispredictions can flush stages, so one per cycle is an upper bound that prediction and forwarding try to approach.',
  },

  // Chapter 8 — Classification and Performance
  {
    id: 'cpu-time-budget',
    chapter: 'classification-and-performance',
    kind: 'calculate',
    prompt:
      'A program runs 2 × 10^9 instructions with an average CPI of 1.5 on a 2 GHz clock. What is its CPU time?',
    hint: 'Use IC × CPI × clock cycle time.',
    answer: '1.5 seconds (2e9 × 1.5 × 0.5 ns).',
    explanation:
      'Chapter 8 gives CPU time = instruction count × cycles per instruction × clock cycle time. A 2 GHz clock means a 0.5 ns period, so 3e9 cycles take 1.5 s. The lesson is that clock rate alone cannot predict runtime: a design with fewer instructions or a lower CPI can win at a lower frequency.',
  },
  {
    id: 'amdahl-ceiling',
    chapter: 'classification-and-performance',
    kind: 'calculate',
    prompt:
      'A program spends 25% of its time in serial code. With infinitely fast parallel hardware for the rest, what is the best achievable speedup?',
    hint: 'The serial quarter cannot be improved at all.',
    answer: '4× (1 / 0.25).',
    explanation:
      "Chapter 8's Amdahl's law is speedup = 1 / ((1 − f) + f/s); as s → ∞ the denominator approaches the serial fraction 0.25. Extra cores therefore saturate at 4× no matter how many you add. Optimising the serial part raises the ceiling more effectively than scaling the parallel part.",
  },
  {
    id: 'flynn-streams',
    chapter: 'classification-and-performance',
    kind: 'label',
    prompt:
      'One core issues a single instruction stream over a single data stream; a GPU applies one instruction to many data elements at once. Name the two Flynn classes.',
    hint: 'Count instruction streams first, then data streams.',
    answer: 'SISD for the core, SIMD for the GPU-style operation.',
    explanation:
      "Chapter 8 defines Flynn's taxonomy by numbers of instruction and data streams. One instruction/one data is SISD; one instruction/many data is SIMD, exactly what a vector or GPU unit exploits. Recognising the class tells you what kind of parallelism is available before you look at any clock specification.",
  },
];
