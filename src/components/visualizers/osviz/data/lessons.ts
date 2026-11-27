export interface OSLessonSection {
  title: string;
  body: string;
  code?: string;
}

export interface OSLessonQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface OSLesson {
  chapterId: string;
  hook: string;
  sections: OSLessonSection[];
  keyTakeaways: string[];
  pitfalls: string[];
  focusPoints: string[];
  quiz: OSLessonQuiz[];
}

export const osLessons: Record<string, OSLesson> = {
  'os-fundamentals': {
    chapterId: 'os-fundamentals',
    hook:
      'An operating system is the layer between programs and hardware. It decides who gets the CPU, which memory is valid, and how bytes reach a disk.',
    sections: [
      {
        title: 'The kernel as a resource manager',
        body:
          'The kernel manages four scarce resources: CPU time, memory, I/O devices, and persistent storage. It multiplexes the CPU between processes, gives each process a private address space, routes I/O through device drivers, and exposes files as named byte streams. User programs run in user mode and cross into kernel mode through system calls or interrupts. That boundary is what stops a buggy program from writing another process\'s memory.',
      },
      {
        title: 'Types of operating systems',
        body:
          'Batch systems run jobs in groups with little interaction. Multiprogramming keeps several jobs in memory so the CPU has work when one blocks. Time-sharing systems switch rapidly between users to create the illusion of concurrency. Real-time systems prioritize deterministic response over throughput. Modern general-purpose systems blend these ideas: they are multiprogrammed, time-shared, and interrupt-driven.',
      },
      {
        title: 'Interrupts and the kernel boundary',
        body:
          'A hardware interrupt is a signal from a device or timer. A software interrupt or trap is raised by an instruction, often to request a system call. The CPU saves enough state to resume later, switches to kernel mode, and jumps to a handler through the interrupt vector. When the handler finishes, the scheduler may resume the interrupted process or switch to another one.',
      },
    ],
    keyTakeaways: [
      'The kernel multiplexes CPU, memory, I/O, and storage.',
      'User mode and kernel mode enforce isolation.',
      'System calls and interrupts are the entry points into the kernel.',
      'Batch, multiprogramming, time-sharing, and real-time systems optimize different goals.',
    ],
    pitfalls: [
      'Treating the OS as just a file manager; it also schedules and isolates.',
      'Confusing a system call with a normal function call.',
      'Assuming interrupts always mean an error.',
    ],
    focusPoints: [
      'Be able to name the four resources the kernel manages.',
      'Know the difference between user mode and kernel mode.',
      'Know the four classic OS types and what each optimizes.',
    ],
    quiz: [
      {
        question: 'Which component runs in kernel mode and manages hardware?',
        options: ['The shell', 'The kernel', 'A user library', 'The bootloader'],
        answer: 1,
        explanation:
          'The kernel runs with privileged access to hardware and provides the core abstractions used by user programs.',
      },
      {
        question: 'What is the main purpose of a system call?',
        options: [
          'To start a new programming language',
          'To request a kernel service from user mode',
          'To compile a program',
          'To allocate a register',
        ],
        answer: 1,
        explanation:
          'A system call crosses the user/kernel boundary so a program can request services such as file I/O or process creation.',
      },
    ],
  },

  'processes-and-states': {
    chapterId: 'processes-and-states',
    hook:
      'A program on disk is passive. A process is that program in motion, with a stack, a heap, registers, and an identity the OS can schedule.',
    sections: [
      {
        title: 'From program to process',
        body:
          'A program is an executable file. A process is an instance of that program with its own address space, program counter, registers, stack, and open resources. The OS creates processes, assigns them a process ID, and tracks them in a process table. Two processes can run the same executable without sharing state.',
      },
      {
        title: 'Process states and the PCB',
        body:
          'A process moves through new, ready, running, waiting, and terminated states. The ready queue holds processes that could run; the waiting queue holds processes blocked on I/O or an event. The process control block (PCB) stores the process ID, state, program counter, registers, memory limits, open files, and scheduling information. A context switch saves one PCB and restores another.',
        code: String.raw`struct PCB {
    int pid;
    enum State state;
    uintptr_t program_counter;
    uintptr_t stack_pointer;
    uintptr_t page_table;
    struct File *open_files;
};`,
      },
      {
        title: 'Creation and termination',
        body:
          'UNIX creates a process with fork(), which duplicates the caller, and exec(), which replaces the image with a new program. Windows uses CreateProcess. A process terminates normally by returning from main or calling exit, or abnormally when it crashes or is killed. The parent may wait for the child to collect its exit status.',
      },
    ],
    keyTakeaways: [
      'A process is a program in execution with its own state and address space.',
      'The five classic states are new, ready, running, waiting, and terminated.',
      'The PCB stores everything needed to suspend and resume a process.',
      'A context switch saves one process and restores another.',
    ],
    pitfalls: [
      'Confusing a program with a process.',
      'Thinking a waiting process is using the CPU.',
      'Forgetting that a context switch has overhead.',
    ],
    focusPoints: [
      'Draw the process state diagram from memory.',
      'Know the fields a PCB must contain.',
      'Know what fork and exec do.',
    ],
    quiz: [
      {
        question: 'Which state is a process in while waiting for disk I/O?',
        options: ['Running', 'Ready', 'Waiting', 'Terminated'],
        answer: 2,
        explanation:
          'A process blocked on I/O is in the waiting state and cannot run until the event completes.',
      },
      {
        question: 'What does the PCB store?',
        options: [
          'Only the process name',
          'The state needed to suspend and resume the process',
          'Only the program source code',
          'Only the output file',
        ],
        answer: 1,
        explanation:
          'The PCB stores the process state, registers, program counter, memory information, open files, and scheduling data.',
      },
    ],
  },

  'cpu-scheduling': {
    chapterId: 'cpu-scheduling',
    hook:
      'The scheduler decides which ready process gets the CPU next. Different policies trade off fairness, responsiveness, and average waiting time.',
    sections: [
      {
        title: 'Scheduling criteria',
        body:
          'CPU utilization measures how busy the CPU is. Throughput counts completed processes per unit time. Turnaround time is completion minus arrival. Waiting time is the time spent in the ready queue. Response time is the delay before the first response. No single policy optimizes all of these; the workload decides which metric matters.',
      },
      {
        title: 'FCFS, Round Robin, and Priority',
        body:
          'First-Come First-Served runs processes in arrival order. It is simple and non-preemptive, but a long process can delay everyone behind it (the convoy effect). Round Robin gives each process a fixed time quantum and rotates through the ready queue, which improves response time. Priority scheduling always picks the highest-priority ready process; low-priority processes can starve unless the system uses aging.',
        code: String.raw`/* FCFS: run in arrival order */
sort_by_arrival(ready);
for each process p:
    run(p);

/* Round Robin: rotate with quantum q */
while ready not empty:
    p = dequeue(ready);
    run(p, min(q, p.remaining));
    if p.remaining > 0: enqueue(ready, p);`,
      },
      {
        title: 'Preemptive versus non-preemptive',
        body:
          'A non-preemptive scheduler lets a running process continue until it blocks or finishes. A preemptive scheduler can interrupt it, usually on a timer tick or when a higher-priority process arrives. Preemption improves responsiveness but adds context-switch overhead and requires careful synchronization.',
      },
    ],
    keyTakeaways: [
      'Turnaround = completion - arrival; waiting = turnaround - burst.',
      'FCFS is simple but suffers from the convoy effect.',
      'Round Robin improves response time with a time quantum.',
      'Priority scheduling can starve low-priority processes without aging.',
      'Preemption trades overhead for responsiveness.',
    ],
    pitfalls: [
      'Forgetting to subtract burst time when computing waiting time.',
      'Assuming Round Robin is always better; a huge quantum degenerates to FCFS.',
      'Ignoring arrival times when comparing schedules.',
    ],
    focusPoints: [
      'Compute waiting and turnaround times for a small process set.',
      'Know the convoy effect and the starvation problem.',
      'Know when a scheduler is preemptive.',
    ],
    quiz: [
      {
        question: 'A process arrives at time 2 and finishes at time 9. What is its turnaround time?',
        options: ['7', '9', '2', '11'],
        answer: 0,
        explanation: 'Turnaround time is completion minus arrival: 9 - 2 = 7.',
      },
      {
        question: 'Which scheduling policy gives every process a fixed time slice?',
        options: ['FCFS', 'Round Robin', 'Priority', 'Shortest Job First'],
        answer: 1,
        explanation:
          'Round Robin rotates through the ready queue and gives each process a fixed time quantum.',
      },
    ],
  },

  'context-switching-interrupts': {
    chapterId: 'context-switching-interrupts',
    hook:
      'The CPU can only run one instruction stream at a time. Interrupts and system calls are how the kernel takes control back without losing the program it interrupted.',
    sections: [
      {
        title: 'Hardware and software interrupts',
        body:
          'A hardware interrupt comes from a device or timer. A software interrupt, trap, or exception comes from an instruction, such as a system call or a divide-by-zero. The CPU uses an interrupt vector to find the handler. It saves the current program counter and status, switches to kernel mode, and runs the handler. Some interrupts are maskable; others, such as non-maskable interrupts, cannot be ignored.',
      },
      {
        title: 'System calls and mode switches',
        body:
          'A system call is a controlled entry into the kernel. The user program places arguments in registers or on the stack, loads a system call number, and executes a trap instruction. The kernel validates the request, performs it with privileged access, and returns a result. The user program resumes only after the kernel restores its context.',
        code: String.raw`/* conceptual system call path */
user:   set syscall number and arguments
        trap
kernel: save context
        validate request
        run service
        restore context
user:   resume with result`,
      },
      {
        title: 'Timer interrupts and preemption',
        body:
          'A timer interrupt fires after a fixed interval and gives the kernel a chance to preempt the running process. Without a timer, a CPU-bound process could keep the CPU forever. The scheduler runs after the interrupt and may switch to another process. This is why preemptive scheduling depends on a reliable timer.',
      },
    ],
    keyTakeaways: [
      'Interrupts transfer control to a handler through a vector.',
      'System calls are controlled traps into the kernel.',
      'The kernel saves and restores context around a mode switch.',
      'Timer interrupts enable preemptive scheduling.',
    ],
    pitfalls: [
      'Confusing an interrupt with a function call.',
      'Assuming a system call is free; it involves a mode switch.',
      'Forgetting that interrupt handlers must be fast and careful.',
    ],
    focusPoints: [
      'Know the difference between hardware and software interrupts.',
      'Trace a system call from user mode to kernel mode and back.',
      'Know why a timer interrupt is required for preemption.',
    ],
    quiz: [
      {
        question: 'Which event lets the kernel preempt a CPU-bound process?',
        options: ['A page fault only', 'A timer interrupt', 'A system call only', 'A file close'],
        answer: 1,
        explanation:
          'A timer interrupt periodically returns control to the kernel, which can then schedule another process.',
      },
      {
        question: 'What is a system call?',
        options: [
          'A normal function call inside the same process',
          'A controlled trap from user mode into the kernel',
          'A hardware interrupt from a disk',
          'A compiler optimization',
        ],
        answer: 1,
        explanation:
          'A system call uses a trap instruction to request a kernel service while crossing the user/kernel boundary.',
      },
    ],
  },

  'memory-segmentation-paging': {
    chapterId: 'memory-segmentation-paging',
    hook:
      'Processes need their own address spaces, but physical memory is shared. Segmentation and paging are two ways to translate a program\'s addresses into real memory.',
    sections: [
      {
        title: 'Contiguous allocation and fragmentation',
        body:
          'The simplest memory manager gives each process one contiguous block. As processes start and finish, free memory becomes fragmented. External fragmentation leaves enough total free memory but no single block large enough. Compaction can fix it but costs time. Internal fragmentation wastes space inside an allocated block because the allocator rounds up to a fixed unit.',
      },
      {
        title: 'Segmentation',
        body:
          'Segmentation divides a program into logical units such as code, data, stack, and heap. Each segment has a base and a limit. A logical address is a segment number plus an offset; the hardware checks the offset against the limit and adds the base. Segments are visible to the programmer and can grow independently, but they still suffer from external fragmentation.',
        code: String.raw`segment_table[code] = { base: 0x4000, limit: 0x1200 };
segment_table[data] = { base: 0x6000, limit: 0x0800 };

if (offset >= segment.limit) trap();
physical = segment.base + offset;`,
      },
      {
        title: 'Paging and the TLB',
        body:
          'Paging divides virtual memory into fixed-size pages and physical memory into frames of the same size. A page table maps each page to a frame. The virtual address splits into a page number and an offset; the page number indexes the table, and the offset is added to the frame base. Paging eliminates external fragmentation but can waste space in the last page. The TLB caches recent translations so most accesses avoid a page-table walk.',
        code: String.raw`page_size = 4096;
vpn   = vaddr / page_size;
off   = vaddr % page_size;
frame = page_table[vpn];
paddr = frame * page_size + off;`,
      },
    ],
    keyTakeaways: [
      'External fragmentation wastes space between allocations; internal fragmentation wastes space inside one.',
      'Segmentation uses base + limit and logical segments.',
      'Paging uses fixed-size pages, frames, and a page table.',
      'The TLB caches page-table translations.',
      'Paging removes external fragmentation but adds translation overhead.',
    ],
    pitfalls: [
      'Confusing page number with frame number.',
      'Forgetting the offset when forming the physical address.',
      'Assuming the TLB is required for correctness; it is a cache.',
    ],
    focusPoints: [
      'Translate a virtual address through a page table.',
      'Know the difference between segmentation and paging.',
      'Know what the TLB stores and why it matters.',
    ],
    quiz: [
      {
        question: 'With 4 KB pages, how many bits are needed for the page offset?',
        options: ['10', '12', '16', '20'],
        answer: 1,
        explanation:
          '4 KB is 4096 bytes, which is 2^12, so the offset needs 12 bits.',
      },
      {
        question: 'What does the TLB cache?',
        options: ['Disk blocks', 'Page-table translations', 'Whole processes', 'File descriptors'],
        answer: 1,
        explanation:
          'The Translation Lookaside Buffer caches virtual-to-physical page translations.',
      },
    ],
  },

  'virtual-memory': {
    chapterId: 'virtual-memory',
    hook:
      'Virtual memory lets a process use more address space than physical RAM. The cost is page faults, and the policy question is which page to evict.',
    sections: [
      {
        title: 'Demand paging and page faults',
        body:
          'With demand paging, a page is loaded only when it is referenced. If the page table entry is not present, the CPU raises a page fault. The kernel finds a free frame or evicts a page, loads the requested page from disk, updates the page table, and restarts the instruction. A page fault is normal; a fault storm is not.',
      },
      {
        title: 'FIFO and LRU replacement',
        body:
          'FIFO evicts the page that has been in memory the longest. It is simple but can suffer Belady\'s anomaly, where more frames cause more faults. LRU evicts the least recently used page, which usually matches locality better but requires tracking usage. Optimal replacement evicts the page used farthest in the future; it is a benchmark, not an implementation.',
        code: String.raw`/* FIFO */
oldest = queue.dequeue();
evict(oldest);
queue.enqueue(new_page);

/* LRU */
victim = least_recently_used(page_list);
evict(victim);`,
      },
      {
        title: 'Thrashing and the working set',
        body:
          'If the sum of the active working sets exceeds physical memory, processes spend most of their time faulting instead of executing. This is thrashing. The OS can reduce it by lowering the degree of multiprogramming, increasing memory, or using a working-set policy that keeps only the pages a process is actively using.',
      },
    ],
    keyTakeaways: [
      'Demand paging loads pages on first reference.',
      'A page fault triggers a load and an instruction restart.',
      'FIFO is simple but can show Belady\'s anomaly.',
      'LRU approximates locality; Optimal is a benchmark.',
      'Thrashing happens when the working sets do not fit in memory.',
    ],
    pitfalls: [
      'Thinking every page fault is an error.',
      'Assuming FIFO always improves with more frames.',
      'Confusing page replacement with process scheduling.',
    ],
    focusPoints: [
      'Trace FIFO and LRU on a small reference string.',
      'Know Belady\'s anomaly.',
      'Know the cause and cure for thrashing.',
    ],
    quiz: [
      {
        question: 'Which replacement policy can suffer Belady\'s anomaly?',
        options: ['LRU', 'FIFO', 'Optimal', 'Working set'],
        answer: 1,
        explanation:
          'FIFO can produce more page faults when given more frames, which is Belady\'s anomaly.',
      },
      {
        question: 'What is thrashing?',
        options: [
          'Running too many CPU-bound processes',
          'Spending most time handling page faults',
          'Deleting too many files',
          'Using too many interrupts',
        ],
        answer: 1,
        explanation:
          'Thrashing occurs when active working sets exceed memory and the system spends most of its time paging.',
      },
    ],
  },

  'io-dma': {
    chapterId: 'io-dma',
    hook:
      'Devices are slow compared with the CPU. The OS chooses between polling, interrupts, and DMA to move data without wasting cycles.',
    sections: [
      {
        title: 'Port-mapped and memory-mapped I/O',
        body:
          'Port-mapped I/O uses a separate address space and special instructions to talk to device registers. Memory-mapped I/O maps device registers into the normal address space, so ordinary loads and stores access them. Memory-mapped I/O is common on modern systems because it lets the CPU use its normal load/store instructions and protects access through the page table.',
      },
      {
        title: 'Polling, interrupts, and DMA',
        body:
          'Polling repeatedly checks a device status register; it is simple but wastes CPU time. Interrupt-driven I/O lets the device signal the CPU when it is ready. DMA goes further: the CPU programs a DMA controller with a source, destination, and length, then continues working while the controller moves data directly between the device and memory. The controller raises an interrupt when the transfer finishes.',
        code: String.raw`/* conceptual DMA setup */
dma.source = device_buffer;
dma.destination = memory_buffer;
dma.length = 4096;
dma.start();
/* CPU does other work */
/* interrupt fires when the transfer completes */`,
      },
      {
        title: 'Buffering and device drivers',
        body:
          'A buffer absorbs speed differences between the CPU and a device. Double buffering lets the CPU process one buffer while the device fills another. Device drivers hide hardware details behind a standard interface, so the kernel can treat different disks or network cards consistently. Buffering and drivers are what make I/O portable and efficient.',
      },
    ],
    keyTakeaways: [
      'Port-mapped I/O uses a separate address space; memory-mapped I/O uses normal addresses.',
      'Polling wastes CPU time; interrupts free the CPU until the device is ready.',
      'DMA moves data without the CPU copying every byte.',
      'Buffers absorb speed differences and enable overlap.',
      'Device drivers provide a uniform interface to hardware.',
    ],
    pitfalls: [
      'Assuming DMA means the CPU is not involved at all; it sets up and completes the transfer.',
      'Confusing memory-mapped I/O with virtual memory.',
      'Forgetting that interrupt handlers must not block for long.',
    ],
    focusPoints: [
      'Compare polling, interrupts, and DMA.',
      'Know the difference between port-mapped and memory-mapped I/O.',
      'Know why buffering matters.',
    ],
    quiz: [
      {
        question: 'Which technique lets a device transfer data directly to memory without per-byte CPU copying?',
        options: ['Polling', 'DMA', 'Paging', 'Segmentation'],
        answer: 1,
        explanation:
          'Direct Memory Access uses a controller to move data between a device and memory while the CPU does other work.',
      },
      {
        question: 'What is the main downside of polling?',
        options: ['It uses too much memory', 'It wastes CPU cycles checking the device', 'It cannot use interrupts', 'It requires DMA'],
        answer: 1,
        explanation:
          'Polling repeatedly checks device status, which consumes CPU time even when the device is not ready.',
      },
    ],
  },

  'file-systems-fat': {
    chapterId: 'file-systems-fat',
    hook:
      'A file system turns a block device into named files and directories. Allocation policy decides how those blocks are found and how much space is wasted.',
    sections: [
      {
        title: 'Files, attributes, and directories',
        body:
          'A file is a named, persistent sequence of bytes with attributes such as size, owner, permissions, timestamps, and location. A directory maps names to file metadata. Hierarchical directories form paths. The file system also tracks free space and must survive crashes without losing or corrupting metadata.',
      },
      {
        title: 'Allocation methods and FAT',
        body:
          'Contiguous allocation stores a file in one run of blocks; it is fast for sequential access but suffers from external fragmentation. Linked allocation stores a pointer to the next block in each block; it has no external fragmentation but poor random access. Indexed allocation stores block pointers in an index block. FAT is a linked-allocation variant: a table entry for each block points to the next block, so the chain can be followed without reading every data block.',
        code: String.raw`/* FAT chain for report.txt */
block 5  -> 9
block 9  -> 2
block 2  -> 14
block 14 -> EOF

/* traversal */
current = 5;
while (current != EOF) {
    read(block[current]);
    current = FAT[current];
}`,
      },
      {
        title: 'Free-space management',
        body:
          'The file system must know which blocks are free. A bitmap uses one bit per block; a free list links free blocks; a FAT marks free entries. Bitmaps are compact and allow fast scanning for contiguous runs. Free lists are simple but can be slow to search. The choice affects allocation speed and fragmentation.',
      },
    ],
    keyTakeaways: [
      'A file is named persistent data plus metadata.',
      'Contiguous allocation is fast but fragments; linked allocation is flexible but slow for random access.',
      'Indexed allocation uses an index block for direct access.',
      'FAT is a table-driven linked allocation.',
      'Free-space tracking can use bitmaps, free lists, or FAT entries.',
    ],
    pitfalls: [
      'Confusing the FAT with the data blocks.',
      'Assuming linked allocation gives fast random access.',
      'Forgetting that directories also consume blocks.',
    ],
    focusPoints: [
      'Walk a FAT chain and count the blocks.',
      'Compare contiguous, linked, and indexed allocation.',
      'Know the trade-offs of bitmaps versus free lists.',
    ],
    quiz: [
      {
        question: 'In a FAT file system, what does a FAT entry contain?',
        options: [
          'The file contents',
          'The next block in the file chain',
          'The file owner',
          'The directory name',
        ],
        answer: 1,
        explanation:
          'Each FAT entry points to the next block in the chain, or marks the block as free or end-of-file.',
      },
      {
        question: 'Which allocation method uses an index block of pointers?',
        options: ['Contiguous', 'Linked', 'Indexed', 'Fragmented'],
        answer: 2,
        explanation:
          'Indexed allocation stores a file\'s block pointers in an index block, allowing direct access to any block.',
      },
    ],
  },

  'file-organization': {
    chapterId: 'file-organization',
    hook:
      'Two files can use the same blocks but different record layouts. Organization decides how fast you can find one record.',
    sections: [
      {
        title: 'Sequential and line-sequential organization',
        body:
          'A sequentially organized file stores records one after another in key order. Reading the next record is fast, but finding a random record requires scanning. Line-sequential organization stores variable-length lines with a length prefix or delimiter, which suits text files and logs. Both are simple and compact but poor for random lookup.',
      },
      {
        title: 'Indexed and hashed organization',
        body:
          'An indexed file keeps an index from key to block, so a lookup reads the index and then the data block. A hashed file applies a hash function to the key to compute a block address, giving near-constant lookup when the hash distributes keys well. Hash collisions need overflow chains or open addressing, and range queries are poor.',
        code: String.raw`/* hashed lookup */
bucket = hash(key) % bucket_count;
read(bucket);
if (key matches) return record;

/* indexed lookup */
block = index_lookup(key);
read(block);
scan(block, key);`,
      },
      {
        title: 'Direct access and record keys',
        body:
          'Direct access lets a program read block n without reading blocks 0 through n-1. It requires a mapping from record number to block address. Record keys make the mapping semantic: the index or hash finds the record by its key rather than its physical position. The right organization depends on the workload: sequential scans, point lookups, or range queries.',
      },
    ],
    keyTakeaways: [
      'Sequential organization is fast for scans and slow for random lookup.',
      'Line-sequential organization handles variable-length records.',
      'Indexed organization supports direct lookup through an index.',
      'Hashed organization gives fast point lookups but weak range support.',
      'Direct access needs a record-to-block mapping.',
    ],
    pitfalls: [
      'Assuming hashing is good for range queries.',
      'Forgetting that indexes consume space and must be updated.',
      'Confusing logical record order with physical block order.',
    ],
    focusPoints: [
      'Match each organization to its best workload.',
      'Know how a hash collision is handled.',
      'Know what direct access requires.',
    ],
    quiz: [
      {
        question: 'Which organization is best for fast point lookups by key?',
        options: ['Sequential', 'Line-sequential', 'Hashed', 'Unsorted'],
        answer: 2,
        explanation:
          'A hash function maps a key directly to a bucket, giving fast point lookups when the distribution is good.',
      },
      {
        question: 'What is the main weakness of a hashed file?',
        options: ['Slow sequential access', 'No random access', 'Range queries are inefficient', 'It cannot store records'],
        answer: 2,
        explanation:
          'Hashing scatters keys, so range queries cannot exploit locality and may need to scan many buckets.',
      },
    ],
  },

  'file-handling': {
    chapterId: 'file-handling',
    hook:
      'Files are not static. Records are sorted, merged, indexed, and updated while the system keeps running.',
    sections: [
      {
        title: 'Sorting and merging',
        body:
          'Sorting a large file often exceeds memory, so the system creates sorted runs and merges them. External merge sort reads chunks, sorts each chunk in memory, writes runs to disk, and repeatedly merges runs until one sorted file remains. The merge step is sequential and efficient; the cost is dominated by I/O passes.',
      },
      {
        title: 'Indexing',
        body:
          'An index maps a key to a record location. A dense index has an entry for every record; a sparse index has one entry per block. Indexes speed up lookups but must be updated whenever records move or change. A primary index is built on the sort key; a secondary index supports other query patterns at the cost of extra space.',
      },
      {
        title: 'Updating and crash safety',
        body:
          'In-place updates overwrite a record and risk leaving a half-written block after a crash. Out-of-place updates write a new version and switch a pointer. A write-ahead log records the intended change before it is applied, so recovery can redo committed work or undo incomplete work. These techniques are the foundation of reliable file and database systems.',
        code: String.raw`/* conceptual write-ahead log */
log.append({ op: "update", key: 42, old: A, new: B });
write_data_block(key=42, value=B);
log.commit();

/* on recovery: redo committed, undo incomplete */`,
      },
    ],
    keyTakeaways: [
      'Large sorts use external runs plus a merge pass.',
      'Dense indexes have an entry per record; sparse indexes have one per block.',
      'Indexes speed reads but add write and space overhead.',
      'Out-of-place updates and write-ahead logs improve crash safety.',
    ],
    pitfalls: [
      'Forgetting that every index must be maintained on update.',
      'Assuming an in-place update is atomic.',
      'Confusing a primary index with a secondary index.',
    ],
    focusPoints: [
      'Explain external merge sort.',
      'Compare dense and sparse indexes.',
      'Know why write-ahead logging exists.',
    ],
    quiz: [
      {
        question: 'Why does a large file sort use multiple runs?',
        options: [
          'Because the file is too large to sort in memory at once',
          'Because sorting in memory is illegal',
          'Because runs make the file smaller',
          'Because indexes cannot be sorted',
        ],
        answer: 0,
        explanation:
          'External merge sort sorts chunks that fit in memory, writes them as runs, and merges the runs.',
      },
      {
        question: 'What is the purpose of a write-ahead log?',
        options: [
          'To speed up reads',
          'To recover safely after a crash',
          'To compress files',
          'To allocate blocks',
        ],
        answer: 1,
        explanation:
          'The log records changes before they are applied, allowing recovery to redo or undo work after a crash.',
      },
    ],
  },

  'instruction-cycle-addressing': {
    chapterId: 'instruction-cycle-addressing',
    hook:
      'Every instruction is fetched, decoded, executed, and written back. Addressing modes decide where the operands actually live.',
    sections: [
      {
        title: 'The instruction cycle',
        body:
          'The CPU fetches the instruction addressed by the program counter, decodes its opcode and operands, executes the operation, and writes the result. The program counter advances to the next instruction. Registers such as the instruction register, memory address register, and memory data register hold the transient values. Interrupts are checked at instruction boundaries.',
        code: String.raw`while (running) {
    instruction = memory[PC];
    PC = PC + 1;
    decode(instruction);
    execute(instruction);
    if (interrupt_pending) handle_interrupt();
}`,
      },
      {
        title: 'Addressing modes',
        body:
          'Direct addressing stores the operand address in the instruction. Indirect addressing stores an address that points to the operand address. Relative addressing adds a signed offset to the program counter, which supports position-independent code. Indexed addressing adds an index register to a base address, which is how arrays are traversed. Paging addressing translates a virtual address through the page table before the memory access.',
      },
      {
        title: 'Effective address calculation',
        body:
          'The effective address is the final address the CPU uses. Different modes combine base registers, index registers, offsets, and memory indirection in different ways. Understanding the calculation explains why some instructions are one cycle and others require several memory accesses.',
        code: String.raw`direct:    EA = address_in_instruction
indirect:  EA = memory[address_in_instruction]
relative:  EA = PC + offset
indexed:   EA = base + index
paging:    EA = translate(virtual_address)`,
      },
    ],
    keyTakeaways: [
      'The instruction cycle is fetch, decode, execute, write back.',
      'The PC points to the next instruction; interrupts are checked at boundaries.',
      'Direct, indirect, relative, indexed, and paging modes compute addresses differently.',
      'Indirect addressing costs an extra memory access.',
      'Effective address calculation is the bridge between instruction and memory.',
    ],
    pitfalls: [
      'Confusing the address in the instruction with the operand itself.',
      'Forgetting that indirect addressing needs two memory reads.',
      'Assuming all addressing modes are equally fast.',
    ],
    focusPoints: [
      'Trace the instruction cycle for a simple add.',
      'Compute effective addresses for each mode.',
      'Know which modes support arrays and position-independent code.',
    ],
    quiz: [
      {
        question: 'Which addressing mode stores an address that points to the operand address?',
        options: ['Direct', 'Indirect', 'Immediate', 'Register'],
        answer: 1,
        explanation:
          'Indirect addressing uses a memory location that contains the address of the operand, requiring an extra memory access.',
      },
      {
        question: 'Which mode adds a signed offset to the program counter?',
        options: ['Relative', 'Indexed', 'Direct', 'Paging'],
        answer: 0,
        explanation:
          'Relative addressing computes the effective address as the program counter plus a signed offset.',
      },
    ],
  },

  'os-families': {
    chapterId: 'os-families',
    hook:
      'MS-DOS, UNIX, and Windows took different paths to the same problem: managing hardware while providing a stable interface to programs.',
    sections: [
      {
        title: 'MS-DOS',
        body:
          'MS-DOS is a single-user, single-tasking, real-mode operating system. Programs run with direct access to memory and hardware, so a crash can take down the machine. It provides a command interpreter, file services, and a set of interrupt-driven BIOS calls. Its simplicity made it fast on early PCs, but it lacked memory protection, multitasking, and robust security.',
      },
      {
        title: 'UNIX',
        body:
          'UNIX is a multiuser, multitasking system built around a small kernel, a shell, and a uniform file model: everything is a file or a file-like stream. Processes are created with fork and exec, and the shell composes small tools through pipes. UNIX influenced Linux, macOS, and many embedded systems. Its design values composability, permissions, and a stable system-call interface.',
      },
      {
        title: 'Windows NT and modern hybrids',
        body:
          'Windows NT introduced a privileged kernel, protected address spaces, and a hardware abstraction layer. It uses a hybrid kernel design: some services run in kernel mode for performance, while others run in user mode for isolation. Modern Windows, Linux, and macOS all blend monolithic and microkernel ideas, and all face the same trade-offs between performance, isolation, and compatibility.',
      },
    ],
    keyTakeaways: [
      'MS-DOS is single-user, single-tasking, and lacks memory protection.',
      'UNIX combines a small kernel, a shell, and a uniform file model.',
      'Windows NT introduced protected memory and a HAL.',
      'Monolithic, microkernel, and hybrid designs trade performance against isolation.',
    ],
    pitfalls: [
      'Assuming older systems were simpler in every way; they had fewer protections.',
      'Confusing the shell with the kernel.',
      'Treating monolithic and microkernel as a strict binary.',
    ],
    focusPoints: [
      'Compare MS-DOS, UNIX, and Windows NT on protection and multitasking.',
      'Know the UNIX fork/exec and pipe model.',
      'Know the kernel/shell distinction.',
    ],
    quiz: [
      {
        question: 'Which system is single-user, single-tasking, and lacks memory protection?',
        options: ['UNIX', 'MS-DOS', 'Windows NT', 'Linux'],
        answer: 1,
        explanation:
          'MS-DOS runs one user and one task at a time and lets programs access memory and hardware directly.',
      },
      {
        question: 'In UNIX, what does the shell do?',
        options: [
          'It schedules processes',
          'It interprets commands and composes programs',
          'It manages page tables',
          'It writes device drivers',
        ],
        answer: 1,
        explanation:
          'The shell is a user-level command interpreter; the kernel performs scheduling, memory, and I/O work.',
      },
    ],
  },
};

export const osLessonByChapter = (chapterId: string): OSLesson | undefined =>
  osLessons[chapterId];
