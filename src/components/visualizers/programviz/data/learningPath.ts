import type { Step, Topic } from '../types';

export const steps: Step[] = [
  {
    step: 1,
    title: "What Is a Program?",
    path: "/program-cosmos/what-is-a-program",
    masteryGoal: "Understand what a program is and what it means to execute one",
    estimatedTime: "10–15 minutes"
  },
  {
    step: 2,
    title: "CPU Basics",
    path: "/program-cosmos/cpu-basics",
    masteryGoal: "Understand how the CPU executes instructions",
    estimatedTime: "20–25 minutes"
  },
  {
    step: 3,
    title: "Instruction Execution Cycle",
    path: "/program-cosmos/instruction-cycle",
    masteryGoal: "Understand fetch, decode, execute, and write-back",
    estimatedTime: "20–25 minutes"
  },
  {
    step: 4,
    title: "Memory Basics",
    path: "/program-cosmos/memory-basics",
    masteryGoal: "Understand how memory stores code and data",
    estimatedTime: "20–25 minutes"
  },
  {
    step: 5,
    title: "Stack, Heap, and Code Segment",
    path: "/program-cosmos/memory-layout",
    masteryGoal: "Understand how program memory is organized",
    estimatedTime: "20–25 minutes"
  },
  {
    step: 6,
    title: "Input / Output (I/O)",
    path: "/program-cosmos/io-basics",
    masteryGoal: "Understand how programs interact with the outside world",
    estimatedTime: "20–25 minutes"
  },
  {
    step: 7,
    title: "Putting It All Together",
    path: "/program-cosmos/execution-summary",
    masteryGoal: "Visualize a complete program execution flow",
    estimatedTime: "20–30 minutes"
  }
];

export const topics: Topic[] = [
  {
    name: "What Is a Program?",
    path: "/program-cosmos/what-is-a-program",
    stepNumber: 1,
    covers: [
      "program as instructions",
      "code vs data",
      "compiled vs interpreted (high-level overview)"
    ],
    visualsRequired: [
      "program lifecycle diagram",
      "code-to-execution flow"
    ]
  },
  {
    name: "CPU Basics",
    path: "/program-cosmos/cpu-basics",
    stepNumber: 2,
    covers: [
      "CPU role",
      "registers",
      "ALU",
      "control unit"
    ],
    visualsRequired: [
      "CPU block diagram",
      "register data flow animation"
    ]
  },
  {
    name: "Instruction Execution Cycle",
    path: "/program-cosmos/instruction-cycle",
    stepNumber: 3,
    covers: [
      "fetch",
      "decode",
      "execute",
      "write-back"
    ],
    visualsRequired: [
      "instruction cycle timeline",
      "single-instruction walkthrough"
    ]
  },
  {
    name: "Memory Basics",
    path: "/program-cosmos/memory-basics",
    stepNumber: 4,
    covers: [
      "RAM vs storage (conceptual)",
      "addressing",
      "bytes and words"
    ],
    visualsRequired: [
      "memory address grid",
      "data load/store animation"
    ]
  },
  {
    name: "Program Memory Layout",
    path: "/program-cosmos/memory-layout",
    stepNumber: 5,
    covers: [
      "code segment",
      "stack",
      "heap",
      "global/static data"
    ],
    visualsRequired: [
      "memory layout vertical map",
      "function call stack animation"
    ]
  },
  {
    name: "Input / Output (I/O)",
    path: "/program-cosmos/io-basics",
    stepNumber: 6,
    covers: [
      "keyboard, mouse, disk, network (conceptual)",
      "blocking vs non-blocking I/O (conceptual)",
      "system calls (high-level only)"
    ],
    visualsRequired: [
      "program-to-device flow",
      "blocking vs non-blocking timeline"
    ]
  },
  {
    name: "Complete Program Execution",
    path: "/program-cosmos/execution-summary",
    stepNumber: 7,
    covers: [
      "program start",
      "CPU execution",
      "memory usage",
      "I/O interaction",
      "program termination"
    ],
    visualsRequired: [
      "full execution timeline",
      "CPU–memory–I/O combined animation"
    ]
  }
];
