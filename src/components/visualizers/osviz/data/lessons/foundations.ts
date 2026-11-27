import type { OSLesson } from './types';

export const foundationLessons: OSLesson[] = [
  {
    chapterId: 'os-fundamentals',
    hook:
      'An operating system is the layer between programs and hardware. It decides who gets the CPU, which memory is valid, and how bytes reach a disk.',
    objectives: [
      'Name the four resources an operating system manages.',
      'Explain why processes, files, and address spaces are useful abstractions.',
      'Distinguish kernel code from user programs.',
      'Describe the OS as both a resource manager and an abstraction layer.',
    ],
    sections: [
      {
        title: 'The four resources',
        body:
          'The kernel manages four scarce resources: CPU time, physical memory, I/O devices, and persistent storage. CPU time is shared by switching between processes. Memory is divided into protected address spaces. I/O devices are accessed through drivers and interrupts. Storage is exposed as files and directories. Every OS policy you will study is a strategy for allocating one of these resources fairly, efficiently, or predictably.',
      },
      {
        title: 'Abstractions hide the hardware',
        body:
          'A process is an abstraction for a running program. A file is an abstraction for persistent bytes. A virtual address is an abstraction for a physical memory location. A system call is an abstraction for a privileged hardware operation. These abstractions let a programmer write portable code without knowing which disk or CPU model is underneath.',
        code: String.raw`/* a program sees a file, not disk sectors */
FILE *fp = fopen("data.txt", "r");

/* the kernel sees blocks, buffers, and a device driver */
/* read(block 42) -> driver -> disk controller -> platter */`,
      },
      {
        title: 'Kernel and user programs',
        body:
          'The kernel is the privileged core that runs in kernel mode. User programs run in user mode with limited access. When a program needs a privileged service, it executes a system call or traps into the kernel. The boundary protects one process from another and protects the hardware from buggy code. The kernel is not the whole OS: the shell, libraries, and utilities are user-level programs built on top of it.',
      },
    ],
    keyTakeaways: [
      'The kernel manages CPU, memory, I/O, and storage.',
      'Processes, files, address spaces, and system calls are abstractions over hardware.',
      'The kernel runs privileged; user programs run unprivileged.',
      'The shell and utilities are user-level, not part of the kernel.',
    ],
    pitfalls: [
      'Thinking the OS is only the graphical desktop.',
      'Confusing a process with a program file.',
      'Assuming every hardware access is a system call; some are handled by drivers inside the kernel.',
    ],
    focusPoints: [
      'Be able to name the four resources and one policy for each.',
      'Explain why an abstraction is useful, not just what it is called.',
      'Know the difference between kernel mode and user mode.',
    ],
    quiz: [
      {
        question: 'Which component runs with privileged hardware access?',
        options: ['The shell', 'The kernel', 'A user library', 'The bootloader'],
        answer: 1,
        explanation:
          'The kernel runs in privileged mode and manages CPU, memory, devices, and storage.',
      },
      {
        question: 'Why is a process considered an abstraction?',
        options: [
          'It hides the details of a running program behind a kernel-managed object',
          'It is a file on disk',
          'It is a hardware register',
          'It is another name for the CPU',
        ],
        answer: 0,
        explanation:
          'The kernel represents a running program as a process with its own state and address space, hiding the underlying scheduling and memory details.',
      },
    ],
  },

  {
    chapterId: 'kernel-user-system-calls',
    hook:
      'A user program cannot touch the disk controller directly. It asks the kernel, and the kernel decides whether the request is valid.',
    objectives: [
      'Explain why CPUs have user and kernel privilege levels.',
      'Trace a system call from user code to the kernel and back.',
      'Know what the kernel validates before performing a request.',
      'Distinguish a library call from a system call.',
    ],
    sections: [
      {
        title: 'Why privilege levels exist',
        body:
          'If every program could execute privileged instructions, one bug could overwrite another process or reprogram a device. The CPU provides at least two modes. User mode restricts privileged instructions and access to kernel memory. Kernel mode allows them. The mode is a hardware state, not a software convention. A user program cannot simply set a flag to enter kernel mode; it must go through a controlled entry point.',
      },
      {
        title: 'The system call path, step by step',
        body:
          'A system call has a number and arguments. The user program places the number and arguments in agreed registers or on the stack, then executes a trap instruction. The CPU switches to kernel mode and jumps to the trap handler. The kernel saves the user context, validates the request, performs the service, stores a result, restores the context, and returns to user mode. The trap instruction is the doorway; the kernel decides what happens next.',
        code: String.raw`/* conceptual path */
user:   r0 = syscall_number
        r1 = argument
        trap

kernel: save user context
        check syscall number
        validate pointer and permissions
        perform operation
        set return value
        restore context

user:   continue with result`,
      },
      {
        title: 'Library calls versus system calls',
        body:
          'Not every function call is a system call. A function such as strlen runs entirely in user space. A function such as read ultimately issues a system call, but the C library may buffer data so that one read call does not mean one kernel entry. The library is a user-space wrapper; the kernel performs the privileged work.',
      },
    ],
    keyTakeaways: [
      'User mode restricts privileged instructions; kernel mode allows them.',
      'A system call uses a trap instruction to enter the kernel.',
      'The kernel validates arguments before acting.',
      'Library functions may wrap system calls and add buffering.',
    ],
    pitfalls: [
      'Thinking a normal function call switches to kernel mode.',
      'Assuming the user program can pass any pointer safely.',
      'Forgetting that a system call has measurable overhead.',
    ],
    focusPoints: [
      'Trace the trap, save, validate, service, restore, and return steps.',
      'Give one example of a library call and one of a system call.',
      'Explain why validation must happen in the kernel.',
    ],
    quiz: [
      {
        question: 'What instruction transfers control from user mode to the kernel?',
        options: ['A normal jump', 'A trap instruction', 'A return instruction', 'A load instruction'],
        answer: 1,
        explanation:
          'A trap instruction switches to kernel mode and enters the system call handler.',
      },
      {
        question: 'Why must the kernel validate a pointer passed by a user program?',
        options: [
          'Because user pointers may be invalid or point to kernel memory',
          'Because pointers are always read-only',
          'Because the CPU cannot read pointers',
          'Because the library requires it',
        ],
        answer: 0,
        explanation:
          'A user program can pass any value. The kernel must check that the address is valid and allowed before using it.',
      },
    ],
  },

  {
    chapterId: 'os-types',
    hook:
      'Every operating system optimizes something. Batch systems optimize throughput, time-sharing systems optimize response, and real-time systems optimize determinism.',
    objectives: [
      'Compare batch, multiprogramming, time-sharing, and real-time systems.',
      'Explain the trade-off between throughput and response time.',
      'Recognize which OS type fits a given workload.',
    ],
    sections: [
      {
        title: 'Batch systems',
        body:
          'A batch system runs jobs in groups without interactive input. A job is submitted, queued, executed, and its output is collected later. Batch systems maximize throughput and minimize operator intervention, but a job cannot ask questions or react to a user. Early mainframes used this model, and modern batch schedulers still use the same idea for large data jobs.',
      },
      {
        title: 'Multiprogramming and time-sharing',
        body:
          'Multiprogramming keeps several jobs in memory so the CPU has work when one job waits for I/O. Time-sharing goes further: it switches rapidly between users or processes, giving each a small slice of CPU time. The result feels interactive even though the CPU is shared. The cost is context-switch overhead and the need for memory protection.',
        code: String.raw`/* time-sharing illusion */
while (system running) {
    run(process, quantum);
    save_context(process);
    process = choose_next();
    restore_context(process);
}`,
      },
      {
        title: 'Real-time systems',
        body:
          'A real-time system must meet deadlines. A hard real-time system missing a deadline can be catastrophic; a soft real-time system degrades quality but continues. Real-time schedulers prioritize predictability over average throughput. They may use priority inheritance, bounded interrupt latency, and fixed-cycle execution to make the worst case analyzable.',
      },
    ],
    keyTakeaways: [
      'Batch systems optimize throughput, not interactivity.',
      'Multiprogramming keeps the CPU busy during I/O waits.',
      'Time-sharing optimizes response time by rapid switching.',
      'Real-time systems optimize deadline determinism.',
    ],
    pitfalls: [
      'Assuming faster average performance means a better real-time system.',
      'Confusing multiprogramming with multiprocessing.',
      'Thinking time-sharing means true simultaneous execution on one CPU.',
    ],
    focusPoints: [
      'Match each OS type to its primary metric.',
      'Explain why time-sharing needs a timer interrupt.',
      'Know the difference between hard and soft real-time.',
    ],
    quiz: [
      {
        question: 'Which OS type primarily optimizes interactive response time?',
        options: ['Batch', 'Time-sharing', 'Hard real-time', 'Single-tasking'],
        answer: 1,
        explanation:
          'Time-sharing switches rapidly between processes to make the system feel interactive.',
      },
      {
        question: 'What is the main goal of a hard real-time system?',
        options: ['Maximum average throughput', 'Meeting every deadline', 'Running the most processes', 'Minimizing disk space'],
        answer: 1,
        explanation:
          'A hard real-time system must complete critical work before its deadline; missing it is a failure.',
      },
    ],
  },

  {
    chapterId: 'interrupts',
    hook:
      'Interrupts are how the outside world gets the CPU\'s attention. A timer, a disk, or a bad instruction can all force the kernel to run.',
    objectives: [
      'Distinguish hardware interrupts from software traps and exceptions.',
      'Explain the role of the interrupt vector and handler.',
      'Trace the save-handle-return sequence.',
      'Know why some interrupts can be masked and others cannot.',
    ],
    sections: [
      {
        title: 'Hardware interrupts',
        body:
          'A hardware interrupt is a signal from a device or timer. It may arrive asynchronously, at any instruction boundary. The CPU finishes the current instruction, saves enough state to resume, switches to kernel mode, and jumps to the handler selected by the interrupt vector. A timer interrupt is the clock that makes preemptive scheduling possible.',
      },
      {
        title: 'Software interrupts, traps, and exceptions',
        body:
          'A software interrupt or trap is raised by an instruction. A system call uses a trap deliberately. An exception is raised by the CPU when an instruction cannot complete, such as a divide-by-zero, page fault, or invalid opcode. Some exceptions are faults that can be fixed and restarted; others are fatal. The same vector mechanism dispatches them.',
        code: String.raw`/* conceptual handler table */
vector[0]  -> divide_by_zero_handler
vector[14] -> page_fault_handler
vector[32] -> timer_handler
vector[80] -> system_call_handler`,
      },
      {
        title: 'Saving state, masking, and returning',
        body:
          'The handler must preserve the interrupted program\'s registers and status. The kernel may run the handler on a kernel stack. Maskable interrupts can be temporarily disabled to protect critical sections; non-maskable interrupts cannot be ignored. When the handler finishes, the kernel restores the saved state and returns to the interrupted instruction or schedules another process.',
      },
    ],
    keyTakeaways: [
      'Hardware interrupts are asynchronous device or timer signals.',
      'Traps are deliberate software entries; exceptions are CPU-detected faults.',
      'The interrupt vector selects the handler.',
      'The kernel saves state, handles the event, and restores or reschedules.',
      'Maskable interrupts can be disabled briefly; non-maskable ones cannot.',
    ],
    pitfalls: [
      'Thinking an interrupt is always an error.',
      'Assuming the interrupted instruction is lost; it is usually resumed.',
      'Disabling interrupts for too long and increasing latency.',
    ],
    focusPoints: [
      'Give one example each of a hardware interrupt, a trap, and an exception.',
      'Explain why a timer interrupt enables preemption.',
      'Know what the vector table stores.',
    ],
    quiz: [
      {
        question: 'Which event is an asynchronous hardware interrupt?',
        options: ['A divide-by-zero', 'A timer tick', 'A system call', 'A page fault'],
        answer: 1,
        explanation:
          'A timer tick arrives from hardware independently of the current instruction stream.',
      },
      {
        question: 'What does the interrupt vector contain?',
        options: [
          'The address of the handler for each interrupt',
          'The process priority',
          'The file descriptor table',
          'The page table',
        ],
        answer: 0,
        explanation:
          'The vector maps an interrupt number to the address of its handler.',
      },
    ],
  },
];
