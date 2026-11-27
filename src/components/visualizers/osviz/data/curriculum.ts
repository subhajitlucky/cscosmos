export type OSLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type OSCategory =
  | 'Foundations'
  | 'Processes & CPU'
  | 'Memory'
  | 'I/O & Files'
  | 'Architecture & Families';

export interface OSChapter {
  id: string;
  number: number;
  title: string;
  category: OSCategory;
  difficulty: OSLevel;
  estimatedMinutes: number;
  summary: string;
  concepts: string[];
  prerequisites: string[];
  visualizerKey?: 'scheduler' | 'paging' | 'files' | 'io';
}

export const osCategories: readonly (OSCategory | 'All')[] = [
  'All',
  'Foundations',
  'Processes & CPU',
  'Memory',
  'I/O & Files',
  'Architecture & Families',
] as const;

export const osChapters: OSChapter[] = [
  {
    id: 'os-fundamentals',
    number: 1,
    title: 'What an Operating System Does',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'The operating system as resource manager and abstraction layer: kernel mode, user mode, system calls, and the major OS types.',
    concepts: [
      'Operating system as a resource manager',
      'Kernel mode and user mode',
      'System calls and the kernel boundary',
      'Batch, multiprogramming, time-sharing, and real-time systems',
      'Interrupts as the entry point to the kernel',
    ],
    prerequisites: [],
  },
  {
    id: 'processes-and-states',
    number: 2,
    title: 'Processes, States & the PCB',
    category: 'Processes & CPU',
    difficulty: 'Beginner',
    estimatedMinutes: 16,
    summary:
      'A process is a program in execution. Learn its states, the process control block, and how the OS tracks and switches processes.',
    concepts: [
      'Program versus process',
      'Process states: new, ready, running, waiting, terminated',
      'Process control block (PCB)',
      'Context switching',
      'Process creation and termination',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'cpu-scheduling',
    number: 3,
    title: 'CPU Scheduling: FCFS, RR & Priority',
    category: 'Processes & CPU',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    summary:
      'Choose which ready process runs next. Compare First-Come First-Served, Round Robin, and priority scheduling using waiting and turnaround time.',
    concepts: [
      'Scheduling criteria and the ready queue',
      'First-Come First-Served (FCFS)',
      'Round Robin (RR) and time quantum',
      'Priority scheduling',
      'Preemptive versus non-preemptive scheduling',
      'Waiting time and turnaround time',
    ],
    prerequisites: ['processes-and-states'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'context-switching-interrupts',
    number: 4,
    title: 'Context Switching, Interrupts & System Calls',
    category: 'Processes & CPU',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'How control moves from a user program into the kernel: hardware and software interrupts, trap handlers, mode switches, and saved state.',
    concepts: [
      'Hardware versus software interrupts',
      'Interrupt vector and handler',
      'System call flow',
      'Saving and restoring context',
      'Timer interrupts and preemption',
    ],
    prerequisites: ['processes-and-states'],
  },
  {
    id: 'memory-segmentation-paging',
    number: 5,
    title: 'Memory Management: Segmentation & Paging',
    category: 'Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    summary:
      'Move from contiguous allocation to segmentation and paging. Learn why paging removes external fragmentation and how a page table translates addresses.',
    concepts: [
      'Contiguous allocation and fragmentation',
      'Segmentation: segments and offsets',
      'Paging: pages, frames, and page tables',
      'Virtual to physical address translation',
      'Translation Lookaside Buffer (TLB)',
    ],
    prerequisites: ['os-fundamentals'],
    visualizerKey: 'paging',
  },
  {
    id: 'virtual-memory',
    number: 6,
    title: 'Virtual Memory & Page Replacement',
    category: 'Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    summary:
      'Not every page needs to be in RAM. Demand paging, page faults, FIFO/LRU replacement, and the danger of thrashing.',
    concepts: [
      'Demand paging and page faults',
      'FIFO page replacement',
      'LRU page replacement',
      'Optimal replacement as a benchmark',
      'Thrashing and the working set',
    ],
    prerequisites: ['memory-segmentation-paging'],
    visualizerKey: 'paging',
  },
  {
    id: 'io-dma',
    number: 7,
    title: 'I/O Management, Ports, Interrupts & DMA',
    category: 'I/O & Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'How the CPU talks to devices: port-mapped and memory-mapped I/O, polling versus interrupts, DMA channels, and buffering.',
    concepts: [
      'I/O ports and port-mapped I/O',
      'Memory-mapped I/O',
      'Polling versus interrupt-driven I/O',
      'Direct Memory Access (DMA) channels',
      'Buffering and device drivers',
    ],
    prerequisites: ['os-fundamentals'],
    visualizerKey: 'io',
  },
  {
    id: 'file-systems-fat',
    number: 8,
    title: 'File Systems, Directories & FAT',
    category: 'I/O & Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    summary:
      'Files are named, persistent byte streams. Learn attributes, directories, allocation methods, and how the File Allocation Table chains blocks together.',
    concepts: [
      'File concept, attributes, and operations',
      'Directory structures and paths',
      'Contiguous, linked, and indexed allocation',
      'File Allocation Table (FAT)',
      'Free-space management',
    ],
    prerequisites: ['io-dma'],
    visualizerKey: 'files',
  },
  {
    id: 'file-organization',
    number: 9,
    title: 'File Organization & Access Techniques',
    category: 'I/O & Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'How records are arranged inside a file and how the OS finds them: sequential, indexed, line-sequential, and hashed access.',
    concepts: [
      'Sequential organization',
      'Indexed organization',
      'Line-sequential organization',
      'Hashed organization',
      'Direct access and record keys',
    ],
    prerequisites: ['file-systems-fat'],
    visualizerKey: 'files',
  },
  {
    id: 'file-handling',
    number: 10,
    title: 'File Handling: Sorting, Merging, Indexing & Updating',
    category: 'I/O & Files',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'The operations that keep a file useful over time: sorting records, merging runs, maintaining indexes, and updating in place or via a log.',
    concepts: [
      'File sorting',
      'Merging sorted runs',
      'Index maintenance',
      'In-place versus out-of-place updates',
      'Update safety and logging',
    ],
    prerequisites: ['file-organization'],
    visualizerKey: 'files',
  },
  {
    id: 'instruction-cycle-addressing',
    number: 11,
    title: 'Instruction Cycle & Addressing Modes',
    category: 'Architecture & Families',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    summary:
      'Fetch, decode, execute, and write back. Learn direct, indirect, relative, paging, and indexed addressing from the OS and CPU boundary.',
    concepts: [
      'Instruction execution cycle',
      'Program counter and instruction register',
      'Direct addressing',
      'Indirect and relative addressing',
      'Paging and indexed addressing',
      'Effective address calculation',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'os-families',
    number: 12,
    title: 'OS Families: MS-DOS, UNIX & Windows',
    category: 'Architecture & Families',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'Compare the classic families: MS-DOS as a single-user real-mode system, UNIX as a multiuser kernel plus shell, and Windows NT as a modern hybrid kernel.',
    concepts: [
      'MS-DOS architecture and limitations',
      'UNIX kernel, shell, and file model',
      'Windows NT architecture',
      'Monolithic versus microkernel designs',
      'Compatibility and evolution',
    ],
    prerequisites: ['os-fundamentals'],
  },
];

export const osChapterById = new Map(osChapters.map((chapter) => [chapter.id, chapter]));

export function getOSChapter(id: string | undefined): OSChapter | undefined {
  return id ? osChapterById.get(id) : undefined;
}

export function getOSChapterIndex(id: string): number {
  return osChapters.findIndex((chapter) => chapter.id === id);
}

export function getAdjacentOSChapters(id: string): {
  previous?: OSChapter;
  next?: OSChapter;
} {
  const index = getOSChapterIndex(id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? osChapters[index - 1] : undefined,
    next: index < osChapters.length - 1 ? osChapters[index + 1] : undefined,
  };
}
