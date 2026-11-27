export type OSProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type OSProblemType = 'mcq' | 'scenario';

export interface OSProblem {
  id: string;
  number: number;
  chapterId: string;
  title: string;
  difficulty: OSProblemDifficulty;
  type: OSProblemType;
  prompt: string;
  context?: string;
  options: string[];
  answer: number;
  explanation: string;
  hint: string;
}

export const osProblems: OSProblem[] = [
  {
    id: 'kernel-mode',
    number: 1,
    chapterId: 'os-fundamentals',
    title: 'Kernel Mode',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which component runs with privileged access to hardware?',
    options: ['The shell', 'The kernel', 'A user library', 'The bootloader'],
    answer: 1,
    explanation:
      'The kernel runs in privileged mode and manages CPU, memory, devices, and storage for user programs.',
    hint: 'Which layer implements system calls?',
  },
  {
    id: 'waiting-state',
    number: 2,
    chapterId: 'processes-and-states',
    title: 'Process State',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A process blocked on disk I/O is in which state?',
    options: ['Running', 'Ready', 'Waiting', 'Terminated'],
    answer: 2,
    explanation:
      'A process that cannot run until an event completes is in the waiting state. It moves back to ready when the I/O finishes.',
    hint: 'It is not using the CPU and it is not ready to be scheduled.',
  },
  {
    id: 'turnaround-time',
    number: 3,
    chapterId: 'cpu-scheduling',
    title: 'Turnaround Time',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'A process arrives at time 2 and finishes at time 9. What is its turnaround time?',
    context: 'turnaround = completion time - arrival time',
    options: ['7', '9', '2', '11'],
    answer: 0,
    explanation: 'Turnaround time is completion minus arrival: 9 - 2 = 7.',
    hint: 'Subtract the arrival time from the completion time.',
  },
  {
    id: 'timer-preemption',
    number: 4,
    chapterId: 'context-switching-interrupts',
    title: 'Timer Interrupt',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which event gives the kernel a chance to preempt a CPU-bound process?',
    options: ['A page fault only', 'A timer interrupt', 'A file close', 'A compiler optimization'],
    answer: 1,
    explanation:
      'The timer interrupt periodically returns control to the kernel so the scheduler can choose another process.',
    hint: 'Preemption needs a periodic hardware signal.',
  },
  {
    id: 'page-offset-bits',
    number: 5,
    chapterId: 'memory-segmentation-paging',
    title: 'Page Offset Bits',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'With 4 KB pages, how many bits are used for the page offset?',
    options: ['10', '12', '16', '20'],
    answer: 1,
    explanation:
      '4 KB is 4096 bytes, which is 2^12, so the offset field needs 12 bits.',
    hint: 'Take the base-2 logarithm of the page size in bytes.',
  },
  {
    id: 'fifo-belady',
    number: 6,
    chapterId: 'virtual-memory',
    title: 'Replacement Anomaly',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which page replacement policy can suffer Belady\'s anomaly?',
    options: ['LRU', 'FIFO', 'Optimal', 'Working set'],
    answer: 1,
    explanation:
      'FIFO can produce more page faults when given more frames, which is Belady\'s anomaly.',
    hint: 'It evicts the oldest page without considering recent use.',
  },
  {
    id: 'dma-purpose',
    number: 7,
    chapterId: 'io-dma',
    title: 'DMA Transfer',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the main advantage of DMA?',
    options: [
      'It removes the need for device drivers',
      'It moves data without per-byte CPU copying',
      'It replaces virtual memory',
      'It makes the CPU faster',
    ],
    answer: 1,
    explanation:
      'A DMA controller moves data between a device and memory while the CPU performs other work, then interrupts when the transfer completes.',
    hint: 'Think about who copies the bytes.',
  },
  {
    id: 'fat-entry',
    number: 8,
    chapterId: 'file-systems-fat',
    title: 'FAT Entry',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In a FAT file system, what does a FAT entry contain?',
    options: ['The file contents', 'The next block in the chain', 'The file owner', 'The directory name'],
    answer: 1,
    explanation:
      'Each FAT entry points to the next block in a file chain, or marks the block free or end-of-file.',
    hint: 'FAT stands for File Allocation Table.',
  },
  {
    id: 'hashed-weakness',
    number: 9,
    chapterId: 'file-organization',
    title: 'Hashed File Trade-off',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the main weakness of a hashed file organization?',
    options: ['Slow point lookups', 'No random access', 'Inefficient range queries', 'It cannot store keys'],
    answer: 2,
    explanation:
      'Hashing scatters keys across buckets, so range queries cannot exploit ordering and may need to scan many buckets.',
    hint: 'Think about queries such as "all keys between 10 and 20".',
  },
  {
    id: 'write-ahead-log',
    number: 10,
    chapterId: 'file-handling',
    title: 'Crash Recovery',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is the purpose of a write-ahead log?',
    options: ['To speed up reads', 'To recover safely after a crash', 'To compress files', 'To allocate blocks'],
    answer: 1,
    explanation:
      'The log records a change before it is applied, so recovery can redo committed work or undo incomplete work.',
    hint: 'It records intent before the data block is changed.',
  },
  {
    id: 'indirect-addressing',
    number: 11,
    chapterId: 'instruction-cycle-addressing',
    title: 'Indirect Addressing',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which addressing mode requires an extra memory access to find the operand?',
    options: ['Direct', 'Immediate', 'Indirect', 'Register'],
    answer: 2,
    explanation:
      'Indirect addressing stores an address that points to the operand address, so the CPU must read memory twice.',
    hint: 'The instruction points to a pointer.',
  },
  {
    id: 'msdos-limits',
    number: 12,
    chapterId: 'os-families',
    title: 'MS-DOS Limits',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which statement describes MS-DOS?',
    options: [
      'Multiuser and preemptive',
      'Single-user and single-tasking',
      'A microkernel only',
      'A real-time kernel',
    ],
    answer: 1,
    explanation:
      'MS-DOS is a single-user, single-tasking, real-mode system without protected memory or preemptive multitasking.',
    hint: 'It was designed for early personal computers.',
  },
  {
    id: 'round-robin-completion',
    number: 13,
    chapterId: 'cpu-scheduling',
    title: 'Round Robin Completion',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'All processes arrive at time 0. What is the completion time of P3 with a quantum of 2?',
    context: `P1 burst = 5
P2 burst = 3
P3 burst = 1
quantum = 2`,
    options: ['4', '5', '6', '9'],
    answer: 1,
    explanation:
      'The timeline is P1(0-2), P2(2-4), P3(4-5), P1(5-7), P2(7-8), P1(8-9). P3 finishes at time 5.',
    hint: 'Draw the ready queue and rotate after every quantum.',
  },
  {
    id: 'address-translation',
    number: 14,
    chapterId: 'memory-segmentation-paging',
    title: 'Virtual Address Translation',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'What is the physical address for virtual address 0x1A2B?',
    context: `page size = 4 KB (0x1000)
page table[1] = frame 7`,
    options: ['0x7A2B', '0x7B2A', '0x1A2B', '0x7000'],
    answer: 0,
    explanation:
      'The page number is 1 and the offset is 0xA2B. Frame 7 starts at 0x7000, so the physical address is 0x7000 + 0xA2B = 0x7A2B.',
    hint: 'Split the address into page number and offset, then add the offset to the frame base.',
  },
  {
    id: 'fat-chain-length',
    number: 15,
    chapterId: 'file-systems-fat',
    title: 'FAT Chain Length',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'How many blocks are in this file?',
    context: `1 -> 9
9 -> 2
2 -> 14
14 -> EOF`,
    options: ['3', '4', '5', '14'],
    answer: 1,
    explanation:
      'The chain contains blocks 1, 9, 2, and 14 before EOF, so the file uses four blocks.',
    hint: 'Follow the chain from the first block until EOF.',
  },
];

export const osProblemById = new Map(osProblems.map((problem) => [problem.id, problem]));

export function getOSProblem(id: string | undefined): OSProblem | undefined {
  return id ? osProblemById.get(id) : undefined;
}

export function getAdjacentOSProblems(id: string): {
  previous?: OSProblem;
  next?: OSProblem;
} {
  const index = osProblems.findIndex((problem) => problem.id === id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? osProblems[index - 1] : undefined,
    next: index < osProblems.length - 1 ? osProblems[index + 1] : undefined,
  };
}
