import type { OSLesson } from './types';

export const familyLessons: OSLesson[] = [
  {
    chapterId: 'msdos',
    plainEnglish: 'MS-DOS is a small house with no locked doors: simple and fast, but anyone can wander in.',
    hook:
      'MS-DOS was small, direct, and completely trusting. Programs could touch hardware and each other, which made it fast and fragile.',
    objectives: [
      'Describe MS-DOS memory and execution model.',
      'Explain real mode and the 1 MB address space.',
      'Know the role of the command interpreter and BIOS calls.',
      'List the main limitations of MS-DOS.',
    ],
    sections: [
      {
        title: 'Real mode and direct access',
        body:
          'MS-DOS ran on the 8086 in real mode. The CPU could address 1 MB using segment:offset addresses. Programs had direct access to memory and hardware, with no protected address spaces. A buggy program could overwrite the OS or another program, and there was no preemptive multitasking.',
        code: String.raw`segment:offset -> physical = segment * 16 + offset
example: 0x1000:0x0020 -> 0x10020`,
      },
      {
        title: 'Command interpreter and BIOS',
        body:
          'The MS-DOS command interpreter, COMMAND.COM, read commands and launched programs. The BIOS provided low-level services through interrupt calls. The file system was FAT-based. Programs often bypassed the OS and wrote directly to video memory or disk controllers for speed.',
      },
      {
        title: 'Limitations',
        body:
          'MS-DOS was single-user and single-tasking. It lacked memory protection, virtual memory, and preemptive scheduling. A crash could take down the machine. Later systems added protected mode and multitasking, but MS-DOS remained important for compatibility and for understanding the early PC model.',
      },
    ],
    keyTakeaways: [
      'MS-DOS is single-user, single-tasking, and real-mode.',
      'Programs access hardware and memory directly.',
      'There is no memory protection or preemptive multitasking.',
      'The BIOS and COMMAND.COM provide services and a command line.',
      'FAT is the file system.',
    ],
    pitfalls: [
      'Assuming MS-DOS had protected memory; it did not.',
      'Confusing real mode with protected mode.',
      'Thinking the BIOS is part of the kernel; it is firmware.',
    ],
    focusPoints: [
      'Explain segment:offset addressing.',
      'List three limitations of MS-DOS.',
      'Know the roles of COMMAND.COM and the BIOS.',
    ],
    quiz: [
      {
        question: 'Which statement describes MS-DOS?',
        options: ['Multiuser and preemptive', 'Single-user and single-tasking', 'A microkernel', 'A real-time kernel'],
        answer: 1,
        explanation:
          'MS-DOS runs one user and one task at a time and lacks protected memory.',
      },
      {
        question: 'How does real mode form a physical address?',
        options: ['segment × 16 + offset', 'segment + offset', 'offset × 16', 'page table lookup'],
        answer: 0,
        explanation:
          'Real mode shifts the segment left by four bits and adds the offset, giving a 20-bit address.',
      },
    ],
  },

  {
    chapterId: 'unix',
    plainEnglish: 'UNIX is a toolbox of small tools that connect like pipe pieces.',
    hook:
      'UNIX turned small tools and a uniform file model into an operating system philosophy. The kernel stays small; the shell composes everything else.',
    objectives: [
      'Explain the UNIX kernel and shell split.',
      'Describe the “everything is a file” model.',
      'Trace fork, exec, and pipe composition.',
      'Know the role of permissions and multiuser design.',
    ],
    sections: [
      {
        title: 'Kernel, shell, and tools',
        body:
          'The UNIX kernel manages processes, memory, files, and devices. The shell is a user-level command interpreter that reads commands and launches programs. Small utilities such as grep, sort, and wc do one job and compose through pipes. This design keeps the kernel interface small and lets users build workflows from simple parts.',
      },
      {
        title: 'Everything is a file',
        body:
          'Regular files, directories, devices, and pipes are accessed through a common file-descriptor interface: open, read, write, close, seek. A device can be read like a file. This uniformity is powerful, but it also means some operations do not map cleanly to every object.',
      },
      {
        title: 'fork, exec, and pipes',
        body:
          'fork() duplicates the current process. exec() replaces the process image with a new program. A shell forks a child, the child execs the command, and the parent waits. A pipe connects the standard output of one process to the standard input of another. Redirection changes the file descriptors before exec.',
        code: String.raw`pid = fork();
if (pid == 0) {
    dup2(pipe_write, STDOUT_FILENO);
    execvp("grep", argv);
} else {
    waitpid(pid, ...);
}`,
      },
    ],
    keyTakeaways: [
      'The kernel provides core services; the shell is a user program.',
      'UNIX exposes files, devices, and pipes through a common descriptor interface.',
      'fork creates, exec replaces, and wait collects.',
      'Pipes compose small tools.',
      'Permissions and multiuser design are built into the model.',
    ],
    pitfalls: [
      'Confusing the shell with the kernel.',
      'Thinking fork runs a new program; exec does that.',
      'Assuming every “file” supports every file operation.',
    ],
    focusPoints: [
      'Explain the kernel/shell split.',
      'Trace a shell pipeline.',
      'Know the difference between fork and exec.',
    ],
    quiz: [
      {
        question: 'What does the UNIX shell do?',
        options: [
          'It interprets commands and composes programs',
          'It schedules processes',
          'It manages page tables',
          'It writes device drivers',
        ],
        answer: 0,
        explanation:
          'The shell is a user-level command interpreter; the kernel performs scheduling, memory, and I/O work.',
      },
      {
        question: 'Which call replaces the current process image with a new program?',
        options: ['fork', 'exec', 'wait', 'pipe'],
        answer: 1,
        explanation:
          'exec loads a new program into the current process; fork creates a copy.',
      },
    ],
  },

  {
    chapterId: 'windows-comparison',
    plainEnglish: 'Windows, UNIX, and MS-DOS are three house designs: one protects rooms, one favors small tools, one keeps everything open.',
    hook:
      'Windows NT combined protected memory, a hardware abstraction layer, and a hybrid kernel. Comparing it with MS-DOS and UNIX shows how OS design converged.',
    objectives: [
      'Describe the Windows NT architecture.',
      'Explain the hardware abstraction layer.',
      'Compare monolithic, microkernel, and hybrid designs.',
      'Compare MS-DOS, UNIX, and Windows on protection and multitasking.',
    ],
    sections: [
      {
        title: 'Windows NT architecture',
        body:
          'Windows NT introduced a privileged kernel, protected address spaces, and a hardware abstraction layer (HAL) that isolates the kernel from motherboard details. The executive provides object management, process management, memory management, I/O, and security. User-mode subsystems and services run on top. The design supports multiprocessor systems and preemptive multitasking.',
      },
      {
        title: 'Hybrid kernel design',
        body:
          'A monolithic kernel runs most services in kernel mode for speed. A microkernel runs only the minimum in kernel mode and pushes services to user space for isolation. Windows NT is a hybrid: some components run in kernel mode, while others run in user mode. Linux is largely monolithic with loadable modules; macOS uses a hybrid kernel. The labels are spectra, not strict categories.',
        code: String.raw`monolithic:  most services in kernel mode
microkernel: minimal kernel, services in user mode
hybrid:      mix of both for performance and isolation`,
      },
      {
        title: 'Comparing the three families',
        body:
          'MS-DOS: single-user, single-tasking, no protection. UNIX: multiuser, multitasking, protected memory, uniform file model. Windows NT: multiuser, preemptive multitasking, protected memory, HAL and hybrid kernel. All three influenced modern systems; the differences are mostly about how much isolation the design buys and what it costs.',
      },
    ],
    keyTakeaways: [
      'Windows NT introduced protected memory and a HAL.',
      'The NT executive provides object, process, memory, I/O, and security services.',
      'Monolithic, microkernel, and hybrid designs trade performance against isolation.',
      'UNIX emphasizes a small kernel and composable tools.',
      'MS-DOS lacked protection and multitasking.',
    ],
    pitfalls: [
      'Treating monolithic and microkernel as a strict binary.',
      'Confusing the HAL with a device driver.',
      'Assuming all modern kernels are pure microkernels.',
    ],
    focusPoints: [
      'Compare the three families on protection and multitasking.',
      'Explain the HAL.',
      'Place Windows NT, Linux, and macOS on the monolithic–microkernel spectrum.',
    ],
    quiz: [
      {
        question: 'What is the purpose of the hardware abstraction layer?',
        options: [
          'To isolate the kernel from motherboard-specific details',
          'To schedule processes',
          'To store files',
          'To compile programs',
        ],
        answer: 0,
        explanation:
          'The HAL provides a uniform interface to hardware so the kernel can run on different platforms.',
      },
      {
        question: 'Which family lacked memory protection and preemptive multitasking?',
        options: ['UNIX', 'Windows NT', 'MS-DOS', 'Linux'],
        answer: 2,
        explanation:
          'MS-DOS ran in real mode with direct hardware access and no protected address spaces.',
      },
    ],
  },
];
