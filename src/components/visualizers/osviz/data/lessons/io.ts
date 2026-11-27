import type { OSLesson } from './types';

export const ioLessons: OSLesson[] = [
  {
    chapterId: 'io-ports-memory-mapped',
    hook:
      'The CPU needs to talk to device registers. It can use a separate port address space or map those registers into normal memory. The choice changes the instructions and the protection model.',
    objectives: [
      'Explain port-mapped I/O and memory-mapped I/O.',
      'Know why device registers are not ordinary variables.',
      'Describe the protection and caching concerns.',
      'Choose the right model for a given architecture.',
    ],
    sections: [
      {
        title: 'I/O ports',
        body:
          'A device exposes registers for control, status, and data. In port-mapped I/O, those registers live in a separate address space accessed by special instructions such as in and out. The CPU distinguishes a port address from a memory address, so ordinary loads and stores cannot reach the device.',
        code: String.raw`/* conceptual port-mapped I/O */
outb(PORT_STATUS, command);
status = inb(PORT_STATUS);`,
      },
      {
        title: 'Memory-mapped I/O',
        body:
          'In memory-mapped I/O, device registers are assigned normal physical addresses. The CPU uses ordinary load and store instructions. The page table can mark those addresses as device memory, uncached, and privileged. This simplifies the instruction set and lets the same addressing modes reach devices.',
        code: String.raw`/* conceptual memory-mapped I/O */
volatile uint32_t *status = (uint32_t *)0xFEE00000;
*status = command;
uint32_t value = *status;`,
      },
      {
        title: 'Protection and caching',
        body:
          'Device registers can change at any time, so they must not be cached. The compiler must not reorder or eliminate accesses, which is why drivers use volatile and memory barriers. The kernel must prevent user programs from writing device registers directly. Memory-mapped registers are protected by page-table permissions; port I/O is protected by privilege level.',
      },
    ],
    keyTakeaways: [
      'Port-mapped I/O uses a separate address space and special instructions.',
      'Memory-mapped I/O uses normal addresses and ordinary loads/stores.',
      'Device registers must be uncached and accessed carefully.',
      'The kernel protects device access from user programs.',
      'Memory-mapped I/O is common on modern systems.',
    ],
    pitfalls: [
      'Treating a device register as ordinary cached memory.',
      'Forgetting volatile and memory barriers in driver code.',
      'Assuming the CPU can access a device address from user mode.',
    ],
    focusPoints: [
      'Compare the instruction sets used by each model.',
      'Explain why device memory is uncached.',
      'Know who is allowed to access device registers.',
    ],
    quiz: [
      {
        question: 'Which model uses ordinary load and store instructions for device registers?',
        options: ['Port-mapped I/O', 'Memory-mapped I/O', 'DMA', 'Paging'],
        answer: 1,
        explanation:
          'Memory-mapped I/O places device registers in the normal address space, so ordinary instructions can access them.',
      },
      {
        question: 'Why must device registers usually be uncached?',
        options: ['They can change independently of the CPU', 'They are too small', 'They are read-only', 'They use port numbers'],
        answer: 0,
        explanation:
          'Caching a register that changes asynchronously could return stale data or lose writes.',
      },
    ],
  },

  {
    chapterId: 'polling-interrupts-dma',
    hook:
      'A device may be slower than the CPU by orders of magnitude. The question is who waits: the CPU, an interrupt handler, or a DMA controller.',
    objectives: [
      'Compare polling, interrupt-driven I/O, and DMA.',
      'Trace a DMA transfer from setup to completion.',
      'Explain when each technique is appropriate.',
      'Know the CPU cost of each approach.',
    ],
    sections: [
      {
        title: 'Polling',
        body:
          'With polling, the CPU repeatedly reads a status register until the device is ready, then moves the data. It is simple and predictable, but it wastes CPU cycles while waiting. Polling can be reasonable for very fast devices or when the CPU has nothing else to do.',
        code: String.raw`while ((inb(PORT_STATUS) & READY) == 0) {
    /* spin */
}
data = inb(PORT_DATA);`,
      },
      {
        title: 'Interrupt-driven I/O',
        body:
          'With interrupts, the CPU starts the device and continues other work. When the device is ready, it raises an interrupt. The handler reads or writes the data. This frees the CPU during the wait, but every transfer has interrupt overhead. High-rate devices can generate too many interrupts, which is where DMA helps.',
      },
      {
        title: 'DMA',
        body:
          'A DMA controller is programmed with a source, destination, and length. It moves data directly between the device and memory while the CPU does other work. When the transfer finishes, the controller raises an interrupt. The CPU is involved at setup and completion, not for every byte. This is how disks and network cards achieve high throughput without saturating the CPU.',
        code: String.raw`dma.source = device_buffer;
dma.destination = memory_buffer;
dma.length = 4096;
dma.start();

/* CPU does other work */

on DMA_complete_interrupt():
    process(memory_buffer);`,
      },
    ],
    keyTakeaways: [
      'Polling wastes CPU cycles while waiting.',
      'Interrupt-driven I/O frees the CPU during the wait.',
      'DMA moves bulk data without per-byte CPU work.',
      'DMA uses a completion interrupt.',
      'The right choice depends on device speed and transfer size.',
    ],
    pitfalls: [
      'Assuming DMA removes all CPU involvement; setup and completion still cost cycles.',
      'Using polling for a slow device while other work is available.',
      'Forgetting that interrupt handlers should be short.',
    ],
    focusPoints: [
      'Compare the three techniques on CPU utilization.',
      'List the DMA setup fields.',
      'Know when polling is actually acceptable.',
    ],
    quiz: [
      {
        question: 'Which technique moves data directly between a device and memory without per-byte CPU copying?',
        options: ['Polling', 'DMA', 'Paging', 'Segmentation'],
        answer: 1,
        explanation:
          'DMA uses a controller to move data while the CPU performs other work.',
      },
      {
        question: 'What is the main downside of polling?',
        options: ['It wastes CPU cycles checking the device', 'It uses too much memory', 'It cannot use interrupts', 'It requires DMA'],
        answer: 0,
        explanation:
          'The CPU repeatedly checks status instead of doing useful work while the device is busy.',
      },
    ],
  },

  {
    chapterId: 'buffering-device-drivers',
    hook:
      'Devices and the CPU run at different speeds. Buffers absorb the mismatch, and drivers hide the hardware behind a stable interface.',
    objectives: [
      'Explain single, double, and circular buffering.',
      'Describe the role of a device driver.',
      'Distinguish blocking from non-blocking I/O.',
      'Know why buffering improves throughput.',
    ],
    sections: [
      {
        title: 'Buffering',
        body:
          'A buffer is a temporary memory region between a producer and a consumer. Single buffering lets the device fill a buffer while the CPU processes the previous one only after the transfer finishes. Double buffering uses two buffers so the device can fill one while the CPU processes the other. A circular buffer is a ring of slots used for streaming data.',
        code: String.raw`/* double buffering */
device writes buffer A
CPU processes buffer B
swap A and B
device writes buffer B
CPU processes buffer A`,
      },
      {
        title: 'Device drivers',
        body:
          'A device driver is kernel code that knows how to talk to a specific device. It translates a generic request such as read 4 KB into device-specific register writes, DMA setup, and interrupt handling. The rest of the kernel sees a uniform block or character device interface. Drivers are the reason the OS can support many devices without rewriting the file system for each one.',
      },
      {
        title: 'Blocking versus non-blocking I/O',
        body:
          'Blocking I/O suspends the calling process until the operation completes. Non-blocking I/O returns immediately, and the process polls or waits for readiness later. Asynchronous I/O starts the operation and notifies the process on completion. The choice affects concurrency and programming complexity.',
      },
    ],
    keyTakeaways: [
      'Buffers absorb speed differences between devices and the CPU.',
      'Double buffering overlaps device transfer and CPU processing.',
      'Circular buffers suit streaming data.',
      'Device drivers translate generic requests into device-specific operations.',
      'Blocking, non-blocking, and asynchronous I/O trade simplicity for concurrency.',
    ],
    pitfalls: [
      'Assuming a buffer removes the need for flow control.',
      'Confusing a driver with a user-space library.',
      'Using blocking I/O in a single-threaded server that must serve many clients.',
    ],
    focusPoints: [
      'Explain single versus double buffering.',
      'State the driver\'s role in one sentence.',
      'Compare blocking, non-blocking, and asynchronous I/O.',
    ],
    quiz: [
      {
        question: 'What is the main benefit of double buffering?',
        options: [
          'The device and CPU can work on different buffers at the same time',
          'It doubles the disk size',
          'It removes interrupts',
          'It disables paging',
        ],
        answer: 0,
        explanation:
          'While the device fills one buffer, the CPU can process the other, overlapping the two activities.',
      },
      {
        question: 'What does a device driver do?',
        options: [
          'Translates generic I/O requests into device-specific operations',
          'Schedules processes',
          'Manages page tables',
          'Compiles user programs',
        ],
        answer: 0,
        explanation:
          'A driver hides the hardware details behind a standard kernel interface.',
      },
    ],
  },
];
