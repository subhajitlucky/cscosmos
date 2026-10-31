import type { Step } from '../types';
import { TOPIC_BASE_PATH } from './topic';

export const steps: Step[] = [
  {
    step: 1,
    title: "What Is a Program?",
    path: `${TOPIC_BASE_PATH}/what-is-a-program`,
    masteryGoal: "Understand what a program is, code vs data, and what happens when we click Run",
    estimatedTime: "4–6 minutes"
  },
  {
    step: 2,
    title: "How Does a Computer Understand Data?",
    path: `${TOPIC_BASE_PATH}/how-computers-understand-data`,
    masteryGoal: "Understand bits, bytes, binary, hexadecimal, and how data is represented",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 3,
    title: "CPU Basics (Understanding the CPU)",
    path: `${TOPIC_BASE_PATH}/cpu-basics`,
    masteryGoal: "Understand CPU cores, the ALU, Control Unit, registers, and the clock",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 4,
    title: "Instruction Execution Cycle",
    path: `${TOPIC_BASE_PATH}/instruction-cycle`,
    masteryGoal: "Step through fetch, decode, execute, and write-back in an interactive CPU",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 5,
    title: "Memory Basics (Understanding Memory)",
    path: `${TOPIC_BASE_PATH}/memory-basics`,
    masteryGoal: "Understand RAM vs storage, memory addresses, and read/write operations",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 6,
    title: "Program Memory Layout (Stack & Heap)",
    path: `${TOPIC_BASE_PATH}/memory-layout`,
    masteryGoal: "Explore the stack, heap, data, and code segments during program execution",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 7,
    title: "How Does a Computer Run Multiple Programs?",
    path: `${TOPIC_BASE_PATH}/multitasking-and-processes`,
    masteryGoal: "Understand processes, threads, CPU time-sharing, and context switching",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 8,
    title: "Input / Output (I/O Basics)",
    path: `${TOPIC_BASE_PATH}/io-basics`,
    masteryGoal: "Understand input/output, system calls, device drivers, and kernel mode",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 9,
    title: "How Does Code Become an Executable?",
    path: `${TOPIC_BASE_PATH}/how-code-becomes-an-executable`,
    masteryGoal: "Compare compilation, linking, bytecode VMs, and JIT engines across languages",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 10,
    title: "Putting Everything Together",
    path: `${TOPIC_BASE_PATH}/execution-summary`,
    masteryGoal: "Watch the complete end-to-end journey of a C program from source to screen",
    estimatedTime: "6–8 minutes"
  }
];
