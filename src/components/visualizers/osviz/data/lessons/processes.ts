import type { OSLesson } from './types';

export const processLessons: OSLesson[] = [
  {
    chapterId: 'process-concept-states',
    hook:
      'A program on disk is passive. A process is that program in motion, with a stack, a heap, registers, and an identity the OS can schedule.',
    objectives: [
      'Distinguish a program from a process.',
      'Draw and explain the five process states.',
      'Describe the transitions between ready, running, and waiting.',
      'Know what the ready queue and waiting queue contain.',
    ],
    sections: [
      {
        title: 'Program versus process',
        body:
          'A program is an executable file: code and static data on disk. A process is an instance of that program with its own address space, program counter, registers, stack, heap, and open resources. Two processes can run the same executable without sharing variables or file offsets. The kernel gives each process a process ID and tracks it in the process table.',
      },
      {
        title: 'The five states',
        body:
          'A process moves through new, ready, running, waiting, and terminated. New means it is being created. Ready means it could run but is waiting for the CPU. Running means it currently has the CPU. Waiting means it is blocked on I/O or an event. Terminated means it has finished or been killed. The scheduler moves processes between ready and running; an I/O request or event moves it to waiting; completion of that event moves it back to ready.',
        code: String.raw`new -> ready -> running -> terminated
                 |  ^
                 v  |
               waiting`,
      },
      {
        title: 'Queues and transitions',
        body:
          'The ready queue holds processes that can run. The waiting queue holds processes blocked on a specific event, such as disk I/O or a semaphore. A timer interrupt can move the running process back to ready, which is preemption. A blocked process does not consume CPU time. When the event completes, the kernel moves it to ready, not directly to running.',
      },
      {
        title: 'Creation and termination',
        body:
          'UNIX creates a process with fork(), which duplicates the caller, and exec(), which replaces the image with a new program. Windows uses CreateProcess. A process terminates normally by returning from main or calling exit, or abnormally when it crashes or is killed. The parent may wait for the child to collect its exit status.',
      },
    ],
    keyTakeaways: [
      'A process is a program in execution with its own state and address space.',
      'The five states are new, ready, running, waiting, and terminated.',
      'A waiting process is blocked and is not on the ready queue.',
      'A timer interrupt can move running back to ready.',
      'fork creates, exec replaces, and exit terminates.',
    ],
    pitfalls: [
      'Confusing a program with a process.',
      'Thinking a waiting process is using the CPU.',
      'Assuming a blocked process moves directly to running when I/O finishes.',
    ],
    focusPoints: [
      'Draw the state diagram and label every transition.',
      'Explain why ready and waiting are different queues.',
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
        question: 'When a waiting process\'s I/O completes, which state does it enter next?',
        options: ['Running', 'Ready', 'Terminated', 'New'],
        answer: 1,
        explanation:
          'The process becomes ready and waits for the scheduler to give it the CPU.',
      },
    ],
  },

  {
    chapterId: 'pcb',
    hook:
      'The kernel cannot keep a process in its head. The PCB is the record that survives a context switch and tells the kernel everything it needs.',
    objectives: [
      'List the main fields of a process control block.',
      'Explain why the PCB must store saved registers.',
      'Describe how the process table relates to PCBs.',
      'Know what information a scheduler reads from a PCB.',
    ],
    sections: [
      {
        title: 'What the PCB stores',
        body:
          'The process control block stores the process ID, parent and child links, state, program counter, CPU registers, stack pointer, memory-management information, open file descriptors, accounting data, and scheduling priority. It is the kernel\'s complete snapshot of a process. Different kernels use different layouts, but the categories are universal.',
        code: String.raw`struct PCB {
    int pid;
    int ppid;
    enum State state;
    uintptr_t program_counter;
    uintptr_t stack_pointer;
    uintptr_t page_table;
    struct File *open_files;
    int priority;
};`,
      },
      {
        title: 'The process table',
        body:
          'The kernel keeps a process table containing the PCB of every live process. A process ID indexes or hashes into that table. When the scheduler chooses a process, it reads the PCB. When a process blocks, the kernel updates its state and moves it to a wait queue. The PCB is the object that links scheduling, memory, and file state together.',
      },
      {
        title: 'Saved context and scheduling data',
        body:
          'The saved program counter and registers let the process resume exactly where it stopped. The scheduler also needs priority, recent CPU usage, and state. The memory fields point to page tables or segment descriptors. The file fields point to open file descriptions. Losing any of these fields would make a correct resume impossible.',
      },
    ],
    keyTakeaways: [
      'The PCB is the kernel\'s record of a process.',
      'It stores identity, state, registers, memory, files, and scheduling data.',
      'The process table holds the PCBs of all live processes.',
      'The saved program counter and registers make context switching possible.',
    ],
    pitfalls: [
      'Thinking the PCB stores the process\'s entire code and data; it stores metadata and pointers.',
      'Forgetting that open file state belongs to the process.',
      'Assuming every OS uses the same PCB layout.',
    ],
    focusPoints: [
      'Name five PCB fields and what each is used for.',
      'Explain why the PCB must be saved on a context switch.',
      'Know the difference between the process table and a ready queue.',
    ],
    quiz: [
      {
        question: 'Which PCB field lets a process resume at the correct instruction?',
        options: ['Priority', 'Program counter', 'Parent PID', 'File descriptor'],
        answer: 1,
        explanation:
          'The saved program counter points to the next instruction to execute when the process resumes.',
      },
      {
        question: 'What is the process table?',
        options: [
          'A list of all live processes and their PCBs',
          'A list of open files',
          'A list of free memory blocks',
          'A list of device drivers',
        ],
        answer: 0,
        explanation:
          'The kernel keeps the PCB of every live process in the process table.',
      },
    ],
  },

  {
    chapterId: 'context-switching',
    hook:
      'A context switch is a controlled save-and-restore. It makes multitasking possible, but it is pure overhead: no user work happens during the switch.',
    objectives: [
      'List the steps of a context switch.',
      'Explain what is saved and what is restored.',
      'Distinguish a direct switch from a switch caused by an interrupt.',
      'Describe why frequent switches reduce throughput.',
    ],
    sections: [
      {
        title: 'The switch sequence',
        body:
          'The kernel saves the running process\'s registers, program counter, and stack pointer into its PCB. It updates the process state, chooses another process, and restores that process\'s registers and program counter from its PCB. If the processes have different address spaces, the kernel also switches the page table or memory map. Then execution resumes in the new process.',
        code: String.raw`save_context(old_process);
old_process.state = READY;
new_process = scheduler_pick();
new_process.state = RUNNING;
restore_context(new_process);
switch_address_space(new_process);`,
      },
      {
        title: 'Interrupt-driven switches',
        body:
          'A timer interrupt or a blocking system call gives the kernel a reason to switch. The interrupt path already saves some state; the scheduler may then decide to run a different process. A voluntary switch happens when the running process blocks. An involuntary switch happens when the scheduler preempts it. Both use the same PCB save/restore mechanism.',
      },
      {
        title: 'The cost',
        body:
          'A context switch costs CPU cycles and cache locality. Saving and restoring registers is small compared with the indirect cost: the new process\'s working set may not be in cache, and the TLB may need to be flushed or tagged. If the time quantum is too small, the system spends too much time switching and too little time doing useful work.',
      },
    ],
    keyTakeaways: [
      'A context switch saves one PCB and restores another.',
      'The address space may also need to change.',
      'Switches can be voluntary (blocking) or involuntary (preemption).',
      'The cost is more than register saves: cache and TLB locality suffer.',
      'Too many switches reduce throughput.',
    ],
    pitfalls: [
      'Thinking a context switch is free because registers are fast.',
      'Forgetting to switch the memory map when address spaces differ.',
      'Assuming every interrupt causes a context switch; the scheduler decides.',
    ],
    focusPoints: [
      'List the save, choose, restore, and address-space steps.',
      'Explain the direct and indirect costs.',
      'Relate quantum size to switch overhead.',
    ],
    quiz: [
      {
        question: 'What is saved during a context switch?',
        options: [
          'The running process\'s registers and program counter',
          'Only the process name',
          'The entire disk',
          'Only the file contents',
        ],
        answer: 0,
        explanation:
          'The kernel saves the running process\'s CPU state in its PCB so it can resume later.',
      },
      {
        question: 'Why can a very small time quantum reduce throughput?',
        options: [
          'Because context-switch overhead dominates useful work',
          'Because processes cannot be preempted',
          'Because memory disappears',
          'Because the disk spins faster',
        ],
        answer: 0,
        explanation:
          'Frequent switches spend CPU time saving and restoring state instead of executing user code.',
      },
    ],
  },
];
