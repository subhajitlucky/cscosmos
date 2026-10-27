import type { Step } from '../types';
import { TOPIC_BASE_PATH } from './topic';

export const steps: Step[] = [
  {
    step: 1,
    title: "What Is a Program?",
    path: `${TOPIC_BASE_PATH}/what-is-a-program`,
    masteryGoal: "Understand what a program is and what it means to execute one",
    estimatedTime: "4–6 minutes"
  },
  {
    step: 2,
    title: "CPU Basics",
    path: `${TOPIC_BASE_PATH}/cpu-basics`,
    masteryGoal: "Understand how the CPU executes instructions",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 3,
    title: "Instruction Execution Cycle",
    path: `${TOPIC_BASE_PATH}/instruction-cycle`,
    masteryGoal: "Understand fetch, decode, execute, and write-back",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 4,
    title: "Memory Basics",
    path: `${TOPIC_BASE_PATH}/memory-basics`,
    masteryGoal: "Understand how memory stores code and data",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 5,
    title: "Stack, Heap, and Code Segment",
    path: `${TOPIC_BASE_PATH}/memory-layout`,
    masteryGoal: "Understand how program memory is organized",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 6,
    title: "Input / Output (I/O)",
    path: `${TOPIC_BASE_PATH}/io-basics`,
    masteryGoal: "Understand how programs interact with the outside world",
    estimatedTime: "5–7 minutes"
  },
  {
    step: 7,
    title: "Putting It All Together",
    path: `${TOPIC_BASE_PATH}/execution-summary`,
    masteryGoal: "Visualize a complete program execution flow",
    estimatedTime: "5–7 minutes"
  }
];
