export type OSLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type OSCategory =
  | 'Foundations'
  | 'Processes'
  | 'CPU Scheduling'
  | 'Memory'
  | 'I/O'
  | 'Files'
  | 'Architecture'
  | 'OS Families';

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
  'Processes',
  'CPU Scheduling',
  'Memory',
  'I/O',
  'Files',
  'Architecture',
  'OS Families',
] as const;

export const osChapters: OSChapter[] = [
  {
    id: 'os-fundamentals',
    number: 1,
    title: 'What an Operating System Does',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'The operating system as a resource manager and abstraction layer: CPU time, memory, I/O devices, and persistent storage.',
    concepts: [
      'Operating system as a resource manager',
      'CPU, memory, I/O, and storage multiplexing',
      'Processes, files, and devices as abstractions',
      'Kernel and user programs',
    ],
    prerequisites: [],
  },
  {
    id: 'kernel-user-system-calls',
    number: 2,
    title: 'Kernel Mode, User Mode & System Calls',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'Why the CPU has privilege levels, how a system call crosses the user/kernel boundary, and what the kernel validates.',
    concepts: [
      'User mode versus kernel mode',
      'Privileged instructions',
      'System call numbers and arguments',
      'Trap instruction and return path',
      'Validation and error returns',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'os-types',
    number: 3,
    title: 'Types of Operating Systems',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Batch, multiprogramming, time-sharing, and real-time systems — what each optimizes and what it gives up.',
    concepts: [
      'Batch systems',
      'Multiprogramming',
      'Time-sharing systems',
      'Real-time systems',
      'Throughput versus response time',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'interrupts',
    number: 4,
    title: 'Interrupts: Hardware & Software',
    category: 'Foundations',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'How devices and instructions interrupt the CPU, how the interrupt vector finds a handler, and why masking matters.',
    concepts: [
      'Hardware interrupts',
      'Software interrupts, traps, and exceptions',
      'Interrupt vector and handler',
      'Maskable versus non-maskable interrupts',
      'Saving state and returning',
    ],
    prerequisites: ['kernel-user-system-calls'],
  },
  {
    id: 'process-concept-states',
    number: 5,
    title: 'Process Concept & States',
    category: 'Processes',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'A process is a program in execution. Learn the five states and the transitions that move a process between them.',
    concepts: [
      'Program versus process',
      'New, ready, running, waiting, terminated',
      'State transitions',
      'Ready queue and waiting queue',
      'Process creation and termination',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'pcb',
    number: 6,
    title: 'Process Control Block (PCB)',
    category: 'Processes',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'The PCB is the kernel\'s record for a process: identity, state, registers, memory, files, and scheduling data.',
    concepts: [
      'PCB fields',
      'Process ID and parent/child links',
      'Saved registers and program counter',
      'Memory and file descriptors',
      'Scheduling and accounting data',
    ],
    prerequisites: ['process-concept-states'],
  },
  {
    id: 'context-switching',
    number: 7,
    title: 'Context Switching',
    category: 'Processes',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Switching the CPU from one process to another: save the old context, restore the new one, and pay the overhead.',
    concepts: [
      'Context switch steps',
      'Save and restore registers',
      'Kernel stack versus user stack',
      'Direct and indirect switch costs',
      'Why too many switches hurt',
    ],
    prerequisites: ['pcb', 'interrupts'],
  },
  {
    id: 'scheduling-metrics',
    number: 8,
    title: 'Scheduling Metrics & the Ready Queue',
    category: 'CPU Scheduling',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Arrival, burst, completion, turnaround, waiting, and response time — the vocabulary every scheduling policy is judged by.',
    concepts: [
      'Arrival time and burst time',
      'Completion time',
      'Turnaround time = completion - arrival',
      'Waiting time = turnaround - burst',
      'Response time',
      'Throughput and CPU utilization',
    ],
    prerequisites: ['process-concept-states'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'fcfs-scheduling',
    number: 9,
    title: 'FCFS Scheduling',
    category: 'CPU Scheduling',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'First-Come First-Served runs processes in arrival order. Learn the algorithm, the convoy effect, and a fully worked example.',
    concepts: [
      'FCFS algorithm',
      'Non-preemptive execution',
      'Convoy effect',
      'Worked waiting/turnaround example',
      'Advantages and limitations',
    ],
    prerequisites: ['scheduling-metrics'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'sjf-scheduling',
    number: 10,
    title: 'SJF Scheduling',
    category: 'CPU Scheduling',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Shortest Job First picks the shortest burst among ready processes. It minimizes average waiting time but needs burst estimates.',
    concepts: [
      'SJF non-preemptive algorithm',
      'Selecting the shortest ready burst',
      'Worked Gantt chart and metrics',
      'Optimal average waiting time',
      'Starvation and burst prediction',
    ],
    prerequisites: ['fcfs-scheduling'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'srtf-scheduling',
    number: 11,
    title: 'SRTF (Preemptive SJF)',
    category: 'CPU Scheduling',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'Shortest Remaining Time First preempts when a shorter job arrives. It is the preemptive version of SJF and can starve long jobs.',
    concepts: [
      'Remaining time',
      'Preemption on arrival',
      'Worked step-by-step timeline',
      'SJF versus SRTF',
      'Starvation and overhead',
    ],
    prerequisites: ['sjf-scheduling'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'round-robin-scheduling',
    number: 12,
    title: 'Round Robin Scheduling',
    category: 'CPU Scheduling',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Round Robin gives each ready process a fixed time quantum and rotates the queue. Learn the queue mechanics and quantum trade-offs.',
    concepts: [
      'Time quantum',
      'Ready queue rotation',
      'Worked Gantt chart',
      'Quantum too small versus too large',
      'Response time and overhead',
    ],
    prerequisites: ['scheduling-metrics'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'priority-scheduling',
    number: 13,
    title: 'Priority Scheduling',
    category: 'CPU Scheduling',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Priority scheduling picks the highest-priority ready process. Learn the algorithm, starvation, and aging.',
    concepts: [
      'Priority numbers and direction',
      'Non-preemptive priority',
      'Worked example',
      'Starvation',
      'Aging as a fix',
    ],
    prerequisites: ['scheduling-metrics'],
    visualizerKey: 'scheduler',
  },
  {
    id: 'preemptive-vs-nonpreemptive',
    number: 14,
    title: 'Preemptive vs Non-Preemptive Scheduling',
    category: 'CPU Scheduling',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'When can the kernel take the CPU away? Compare cooperative and preemptive policies, timer interrupts, and their costs.',
    concepts: [
      'Non-preemptive execution',
      'Preemption points',
      'Timer interrupts',
      'Context-switch overhead',
      'Responsiveness versus throughput',
    ],
    prerequisites: ['round-robin-scheduling', 'priority-scheduling'],
  },
  {
    id: 'contiguous-allocation',
    number: 15,
    title: 'Contiguous Allocation & Fragmentation',
    category: 'Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'The simplest memory manager gives each process one contiguous block. Learn first-fit, best-fit, and the two kinds of fragmentation.',
    concepts: [
      'Contiguous allocation',
      'First-fit, best-fit, worst-fit',
      'External fragmentation',
      'Internal fragmentation',
      'Compaction',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'segmentation',
    number: 16,
    title: 'Segmentation',
    category: 'Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Segmentation divides a program into logical units with base and limit registers. Learn the address check and the trade-offs.',
    concepts: [
      'Segments: code, data, stack, heap',
      'Segment table: base and limit',
      'Logical address = segment + offset',
      'Protection and sharing',
      'External fragmentation',
    ],
    prerequisites: ['contiguous-allocation'],
    visualizerKey: 'paging',
  },
  {
    id: 'paging-page-tables',
    number: 17,
    title: 'Paging & Page Tables',
    category: 'Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 18,
    summary:
      'Paging splits virtual memory into pages and physical memory into frames. Learn the page table and a full address translation.',
    concepts: [
      'Pages and frames',
      'Virtual page number and offset',
      'Page table entries',
      'Present/valid bits and protection bits',
      'Worked address translation',
    ],
    prerequisites: ['contiguous-allocation'],
    visualizerKey: 'paging',
  },
  {
    id: 'tlb-translation',
    number: 18,
    title: 'TLB & Address Translation',
    category: 'Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'A TLB caches page-table entries. Learn hit/miss paths, effective access time, and why locality matters.',
    concepts: [
      'Translation Lookaside Buffer',
      'TLB hit and miss',
      'Page-table walk',
      'Effective access time',
      'Locality and TLB reach',
    ],
    prerequisites: ['paging-page-tables'],
    visualizerKey: 'paging',
  },
  {
    id: 'virtual-memory-demand-paging',
    number: 19,
    title: 'Virtual Memory & Demand Paging',
    category: 'Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'Not every page needs to be in RAM. Learn demand paging, page faults, and the steps the kernel takes to resolve one.',
    concepts: [
      'Virtual address space',
      'Demand paging',
      'Page fault steps',
      'Resident set',
      'Locality of reference',
    ],
    prerequisites: ['paging-page-tables'],
    visualizerKey: 'paging',
  },
  {
    id: 'fifo-page-replacement',
    number: 20,
    title: 'FIFO Page Replacement',
    category: 'Memory',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'FIFO evicts the oldest page. Learn the queue algorithm, a full reference-string trace, and Belady\'s anomaly.',
    concepts: [
      'FIFO replacement algorithm',
      'Reference string trace',
      'Page faults and hits',
      'Belady\'s anomaly',
      'Advantages and limitations',
    ],
    prerequisites: ['virtual-memory-demand-paging'],
    visualizerKey: 'paging',
  },
  {
    id: 'lru-optimal-page-replacement',
    number: 21,
    title: 'LRU & Optimal Page Replacement',
    category: 'Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    summary:
      'LRU evicts the least recently used page; Optimal evicts the page used farthest in the future. Compare both on the same reference string.',
    concepts: [
      'LRU algorithm',
      'LRU implementation with a stack or timestamps',
      'Optimal replacement as a benchmark',
      'Reference-string comparison',
      'Belady\'s anomaly and stack algorithms',
    ],
    prerequisites: ['fifo-page-replacement'],
    visualizerKey: 'paging',
  },
  {
    id: 'thrashing-working-set',
    number: 22,
    title: 'Thrashing & the Working Set',
    category: 'Memory',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'When the active working sets do not fit in memory, the system spends its time paging. Learn the cause and the controls.',
    concepts: [
      'Thrashing',
      'Working set model',
      'Degree of multiprogramming',
      'Page-fault frequency',
      'Locality and memory pressure',
    ],
    prerequisites: ['virtual-memory-demand-paging'],
  },
  {
    id: 'io-ports-memory-mapped',
    number: 23,
    title: 'I/O Ports & Memory-Mapped I/O',
    category: 'I/O',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'How the CPU addresses device registers: a separate port space or normal memory addresses.',
    concepts: [
      'I/O ports',
      'Port-mapped I/O',
      'Memory-mapped I/O',
      'Device registers',
      'Protection and caching concerns',
    ],
    prerequisites: ['os-fundamentals'],
    visualizerKey: 'io',
  },
  {
    id: 'polling-interrupts-dma',
    number: 24,
    title: 'Polling, Interrupts & DMA',
    category: 'I/O',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Compare three ways to move data: polling, interrupt-driven I/O, and Direct Memory Access.',
    concepts: [
      'Polling',
      'Interrupt-driven I/O',
      'DMA controller setup',
      'DMA transfer and completion interrupt',
      'CPU utilization trade-offs',
    ],
    prerequisites: ['io-ports-memory-mapped', 'interrupts'],
    visualizerKey: 'io',
  },
  {
    id: 'buffering-device-drivers',
    number: 25,
    title: 'Buffering & Device Drivers',
    category: 'I/O',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Buffers absorb speed differences; drivers hide hardware detail. Learn single/double buffering and the driver interface.',
    concepts: [
      'Single buffering',
      'Double buffering',
      'Circular buffers',
      'Device driver interface',
      'Blocking versus non-blocking I/O',
    ],
    prerequisites: ['polling-interrupts-dma'],
  },
  {
    id: 'file-concept-directories',
    number: 26,
    title: 'File Concept & Directories',
    category: 'Files',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'Files are named persistent data plus metadata. Learn attributes, operations, directory structures, and paths.',
    concepts: [
      'File attributes and operations',
      'File types and extensions',
      'Directory structures',
      'Absolute and relative paths',
      'Hard links and symbolic links',
    ],
    prerequisites: ['os-fundamentals'],
    visualizerKey: 'files',
  },
  {
    id: 'contiguous-file-allocation',
    number: 27,
    title: 'Contiguous File Allocation',
    category: 'Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'A file occupies one run of blocks. Learn the mapping, the fast access, and the external fragmentation.',
    concepts: [
      'Contiguous allocation',
      'Start block and length',
      'Sequential and direct access',
      'External fragmentation',
      'Compaction and growth',
    ],
    prerequisites: ['file-concept-directories'],
    visualizerKey: 'files',
  },
  {
    id: 'linked-allocation-fat',
    number: 28,
    title: 'Linked Allocation & FAT',
    category: 'Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Linked allocation stores the next block pointer; FAT moves those pointers into a table. Learn the chain walk and its cost.',
    concepts: [
      'Linked allocation',
      'File Allocation Table (FAT)',
      'Chain traversal',
      'Direct access cost',
      'Free-space entries',
    ],
    prerequisites: ['contiguous-file-allocation'],
    visualizerKey: 'files',
  },
  {
    id: 'indexed-file-allocation',
    number: 29,
    title: 'Indexed File Allocation',
    category: 'Files',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'An index block stores a file\'s block pointers, giving direct access without walking a chain. Learn the cost and the limits.',
    concepts: [
      'Index block',
      'Direct block pointers',
      'Multi-level indexes',
      'Access cost',
      'Index overhead',
    ],
    prerequisites: ['linked-allocation-fat'],
    visualizerKey: 'files',
  },
  {
    id: 'sequential-file-organization',
    number: 30,
    title: 'Sequential File Organization',
    category: 'Files',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Records are stored one after another in key order. Great for scans, poor for random lookup.',
    concepts: [
      'Sequential records',
      'Key ordering',
      'Sequential scan',
      'Search cost',
      'Insertion and deletion cost',
    ],
    prerequisites: ['file-concept-directories'],
    visualizerKey: 'files',
  },
  {
    id: 'indexed-file-organization',
    number: 31,
    title: 'Indexed File Organization',
    category: 'Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'An index maps keys to blocks, giving direct lookup. Learn dense and sparse indexes and their update cost.',
    concepts: [
      'Index entries',
      'Dense versus sparse index',
      'Primary and secondary indexes',
      'Lookup cost',
      'Index maintenance',
    ],
    prerequisites: ['sequential-file-organization'],
    visualizerKey: 'files',
  },
  {
    id: 'line-hashed-file-organization',
    number: 32,
    title: 'Line-Sequential & Hashed Files',
    category: 'Files',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Line-sequential files handle variable-length records; hashed files map keys to buckets for fast point lookups.',
    concepts: [
      'Line-sequential records',
      'Length prefixes and delimiters',
      'Hashing and buckets',
      'Collisions and overflow',
      'Range-query weakness',
    ],
    prerequisites: ['indexed-file-organization'],
    visualizerKey: 'files',
  },
  {
    id: 'file-sorting-merging',
    number: 33,
    title: 'File Sorting & Merging',
    category: 'Files',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Large files do not fit in memory. Learn external merge sort, sorted runs, and the I/O cost of merging.',
    concepts: [
      'External sorting',
      'Sorted runs',
      'Two-way and k-way merge',
      'I/O passes',
      'Merge cost',
    ],
    prerequisites: ['sequential-file-organization'],
    visualizerKey: 'files',
  },
  {
    id: 'file-indexing-updating',
    number: 34,
    title: 'File Indexing & Updating',
    category: 'Files',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Indexes speed reads but must be maintained. Learn in-place versus out-of-place updates and write-ahead logging.',
    concepts: [
      'Index maintenance',
      'In-place updates',
      'Out-of-place updates',
      'Write-ahead logging',
      'Crash recovery',
    ],
    prerequisites: ['indexed-file-organization'],
    visualizerKey: 'files',
  },
  {
    id: 'instruction-cycle',
    number: 35,
    title: 'Instruction Cycle',
    category: 'Architecture',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Fetch, decode, execute, write back. Learn the registers, the control flow, and where interrupts fit.',
    concepts: [
      'Fetch-decode-execute-writeback',
      'Program counter and instruction register',
      'Memory address/data registers',
      'Interrupt checks at instruction boundaries',
      'Clock cycles',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'addressing-modes',
    number: 36,
    title: 'Addressing Modes',
    category: 'Architecture',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Direct, indirect, relative, indexed, and paging addressing — how each computes the effective address.',
    concepts: [
      'Direct addressing',
      'Indirect addressing',
      'Relative addressing',
      'Indexed addressing',
      'Paging addressing',
      'Effective address calculation',
    ],
    prerequisites: ['instruction-cycle'],
  },
  {
    id: 'msdos',
    number: 37,
    title: 'MS-DOS',
    category: 'OS Families',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'A single-user, single-tasking, real-mode system. Learn its architecture, limitations, and why it dominated early PCs.',
    concepts: [
      'Real mode and direct hardware access',
      'Command interpreter',
      'FAT file system',
      'Interrupt-driven BIOS calls',
      'No memory protection or multitasking',
    ],
    prerequisites: ['os-fundamentals'],
  },
  {
    id: 'unix',
    number: 38,
    title: 'UNIX',
    category: 'OS Families',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'A multiuser, multitasking system built around a small kernel, a shell, and a uniform file model.',
    concepts: [
      'Kernel and shell',
      'Everything is a file',
      'fork and exec',
      'Pipes and composition',
      'Permissions and multiuser design',
    ],
    prerequisites: ['kernel-user-system-calls'],
  },
  {
    id: 'windows-comparison',
    number: 39,
    title: 'Windows NT & OS Comparison',
    category: 'OS Families',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Windows NT brought protected memory and a hardware abstraction layer. Compare monolithic, microkernel, and hybrid designs.',
    concepts: [
      'Windows NT architecture',
      'Hardware abstraction layer',
      'Hybrid kernel design',
      'Monolithic versus microkernel',
      'Comparing MS-DOS, UNIX, and Windows',
    ],
    prerequisites: ['unix'],
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
