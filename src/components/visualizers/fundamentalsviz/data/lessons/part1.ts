import type { ITLesson } from './types';

export const part1Lessons: ITLesson[] = [
  {
    chapterId: 'computer-organization',
    intro:
      'A digital computer is organised into five functional units connected by buses. Instructions and data share memory, so the control unit can fetch, decode and execute a stored program without rewiring the machine. Address-bus width fixes addressable memory, data-bus width fixes bits per transfer, and the instruction cycle repeats under clock control. Computers are classed as micro, mini, mainframe or supercomputer by scale, throughput and use.',
    sections: [
      {
        title: 'Functional units',
        body:
          'The five units are input, memory, arithmetic logic, control and output. The ALU and control unit together form the central processing unit (CPU).',
        bullets: [
          'Input unit: accepts data and instructions from devices such as a keyboard, scanner, camera or sensor.',
          'Memory unit: stores programs and data in addressable locations, usually main memory (RAM).',
          'Arithmetic logic unit (ALU): performs arithmetic (add, subtract) and logic (AND, OR, compare) operations.',
          'Control unit (CU): fetches and decodes instructions, then sends timing and control signals; it does not process data.',
          'Output unit: presents results through a monitor, printer, speaker or actuator.',
          'CPU = ALU + control unit + registers; buses connect all five units.',
        ],
        table: {
          caption: 'Five functional units',
          headers: ['Unit', 'Main job', 'Examples'],
          rows: [
            ['Input', 'Converts external data into digital signals', 'Keyboard, mouse, scanner, sensor'],
            ['Memory', 'Stores programs and data for immediate use', 'RAM / main memory'],
            ['ALU', 'Performs arithmetic and logical operations', 'Add, compare, AND'],
            ['Control', 'Fetches, decodes and sequences instructions', 'Program counter, clock, control signals'],
            ['Output', 'Converts digital results into human or physical form', 'Monitor, printer, actuator'],
          ],
        },
      },
      {
        title: 'Stored-program concept',
        body:
          'The 1945 von Neumann design stores instructions and data in the same addressable memory. Changing the program changes the machine behaviour without rewiring.',
        bullets: [
          'Instructions occupy memory locations exactly like data.',
          'The program counter holds the address of the next instruction.',
          'A program must be loaded into memory before execution.',
          'One machine can perform many tasks by loading different programs.',
          'Instructions and data share the CPU-memory path, creating the von Neumann bottleneck.',
          'Caches reduce the bottleneck by keeping recent instructions and data close to the CPU.',
        ],
      },
      {
        title: 'System buses',
        body:
          'A bus is a shared group of wires with rules for access. Only one transfer uses the bus at a time.',
        bullets: [
          'Address bus: carries the location to be read or written.',
          'n address lines select 2^n locations; a byte-addressable 16-bit bus reaches 2^16 B = 64 KiB.',
          'A 20-bit address bus reaches 2^20 B = 1 MiB; a 32-bit bus reaches 4 GiB.',
          'Data bus: carries the instruction or data word; width sets the bits moved per transfer (8, 16, 32 or 64).',
          'Control bus: carries read, write, clock, interrupt and reset signals.',
          'More address lines increase capacity; a wider data bus increases transfer rate.',
        ],
        table: {
          caption: 'Address, data and control buses',
          headers: ['Bus', 'Carries', 'Width determines'],
          rows: [
            ['Address', 'Memory or I/O location', 'Number of addressable locations (2^n)'],
            ['Data', 'Instruction or data word', 'Bits transferred per cycle'],
            ['Control', 'Read, write, clock, interrupt, reset', 'Timing and type of operation'],
          ],
        },
      },
      {
        title: 'Fetch-decode-execute cycle',
        body:
          'The control unit repeats the cycle for every instruction. At 2 GHz one clock cycle lasts 0.5 ns, so a four-cycle instruction takes 2 ns.',
        code: String.raw`FETCH    PC -> MAR; memory -> MDR -> IR; PC <- PC + 1
DECODE   control unit identifies opcode and operands
EXECUTE  ALU operation, data movement or branch
WRITE    result -> register or memory
INTERRUPT check pending device requests`,
        bullets: [
          'Fetch copies the instruction at the program counter into the instruction register (IR).',
          'The program counter is incremented to point to the next instruction.',
          'Decode identifies the opcode and any register or memory operands.',
          'Execute performs the ALU operation, moves data, or changes the PC on a branch.',
          'Write-back stores the result in a register or memory.',
          'An interrupt can suspend the cycle so a device can be serviced.',
          'Pipelining overlaps stages of different instructions, approaching one completed instruction per cycle.',
        ],
      },
      {
        title: 'Input/output and secondary storage',
        body:
          'Input and output devices connect through controllers and ports. Secondary storage keeps programs and files after power is removed.',
        bullets: [
          'Input devices convert keystrokes, images, sound or physical measurements into digital data.',
          'Output devices convert digital results into text, images, sound or motion.',
          'A device controller manages the device and connects through a port such as USB, HDMI, SATA or NVMe.',
          'Interrupts signal the CPU when a device needs service, avoiding continuous polling.',
          'DMA transfers a block between a device and memory without the CPU copying each byte.',
          'Secondary storage is nonvolatile: HDD (magnetic), SSD (flash) and optical discs retain data without power.',
          'Typical HDD seek time is about 9 ms; NVMe SSD latency is under 0.1 ms.',
        ],
      },
      {
        title: 'Computer classifications',
        body:
          'Computers are classified by size, price, throughput and intended use. The labels track scale and age quickly.',
        bullets: [
          'Microcomputer: a microprocessor-based personal system such as a desktop, laptop, tablet or phone.',
          'Minicomputer or midrange server: serves a department or small business.',
          'Mainframe: high reliability and many simultaneous users, common in banks and insurers.',
          'Supercomputer: fastest class at a given time, using thousands of processors in parallel for weather, drug discovery and simulation.',
          'Throughput is the amount of work completed per second.',
          'A current phone outperforms a 1990 supercomputer, so classify by role and scale, not fixed specifications.',
        ],
      },
    ],
    examPoints: [
      'The five functional units are input, memory, ALU, control and output; ALU, control unit and registers form the CPU.',
      'A stored-program computer keeps instructions and data in the same addressable memory.',
      'Address-bus width n gives 2^n addressable locations; a 20-bit bus addresses 1 MiB on a byte-addressable machine.',
      'Data-bus width sets bits per transfer; control-bus lines carry read, write, clock, interrupt and reset.',
      'The instruction cycle is fetch, decode, execute and write-back, with the PC advanced during fetch.',
      'Micro, mini, mainframe and supercomputer classify computers by scale, throughput and use.',
    ],
    keyTerms: [
      {
        term: 'Stored-program concept',
        definition:
          'A design in which instructions and data reside in the same addressable memory, so loading a program changes machine behaviour without rewiring.',
      },
      {
        term: 'System bus',
        definition:
          'The shared address, data and control lines that carry information between the CPU, memory and input/output devices.',
      },
      {
        term: 'Program counter (PC)',
        definition:
          'A CPU register that holds the address of the next instruction to be fetched.',
      },
    ],
    quiz: [
      {
        question:
          'A byte-addressable CPU has a 20-bit address bus. What is the maximum memory it can address?',
        options: ['64 KiB', '1 MiB', '20 MiB', '2 MiB'],
        answer: 1,
        explanation:
          'Twenty address lines select 2^20 = 1,048,576 locations. At one byte per location that is 1,048,576 bytes, or 1 MiB.',
      },
      {
        question: 'Which statement describes the stored-program concept?',
        options: [
          'Instructions are stored in ROM and data only in RAM.',
          'Instructions and data share the same addressable memory.',
          'Each new program requires rewiring the CPU.',
          'Programs are stored only on secondary storage.',
        ],
        answer: 1,
        explanation:
          'The stored-program concept places instructions and data together in memory. Loading a different program changes the machine behaviour without changing the hardware.',
      },
    ],
  },
  {
    chapterId: 'memory-storage',
    intro:
      'Memory and storage form a hierarchy from CPU registers to tape. Speed and cost per bit rise as capacity falls, so cache and virtual memory keep active data close to the processor. SRAM and DRAM serve cache and main memory; ROM and flash hold firmware and files; magnetic, optical and solid-state media provide nonvolatile secondary storage. Peripherals connect through interfaces whose bandwidth must match the device.',
    sections: [
      {
        title: 'Memory hierarchy',
        body:
          'Levels closer to the CPU are faster, smaller and more expensive per bit. Levels farther away are slower, larger and cheaper per bit.',
        bullets: [
          'Registers: fastest and smallest level, inside the CPU, holding operands and addresses.',
          'Cache (L1, L2, L3): SRAM buffer for recently used blocks, sized from kilobytes to megabytes.',
          'Main memory: DRAM holding active programs and data, typically 8-64 GB.',
          'SSD: nonvolatile NAND flash storage, typically 256 GB-4 TB.',
          'HDD: magnetic disks with terabyte capacity and millisecond access.',
          'Tape: lowest cost per byte, sequential access, used for archives and backups.',
        ],
        table: {
          caption: 'Memory hierarchy: speed, cost and volatility',
          headers: ['Level', 'Typical size', 'Typical latency', 'Relative cost per bit', 'Volatile?'],
          rows: [
            ['Registers', 'Under 1 KB', 'Under 1 ns', 'Highest', 'Yes'],
            ['L1/L2/L3 cache', '32 KB-32 MB', '1-15 ns', 'Very high', 'Yes'],
            ['Main memory (DRAM)', '8-64 GB', '60-100 ns', 'Moderate', 'Yes'],
            ['SSD (NAND flash)', '256 GB-4 TB', '0.05-0.1 ms', 'Low', 'No'],
            ['Hard disk', '1-20 TB', '5-10 ms', 'Very low', 'No'],
            ['Magnetic tape', 'Many TB', 'Seconds-minutes', 'Lowest', 'No'],
          ],
        },
      },
      {
        title: 'SRAM and DRAM',
        body:
          'Both are volatile random-access memories, but they store a bit differently. SRAM uses flip-flops; DRAM uses capacitors.',
        bullets: [
          'SRAM stores a bit in a flip-flop made from about six transistors.',
          'SRAM needs no refresh and is fast, but each cell is large and costly.',
          'SRAM is used for CPU cache, not for main memory.',
          'DRAM stores a bit as charge on a capacitor with one transistor.',
          'DRAM capacitors leak, so rows are refreshed every 64 ms in a typical chip.',
          'DRAM is denser and cheaper per bit than SRAM, but slower and refresh-dependent.',
          'Both SRAM and DRAM lose their contents when power is removed.',
        ],
      },
      {
        title: 'ROM family',
        body:
          'ROM is nonvolatile and retains its contents without power. The family differs in how it is written and erased.',
        bullets: [
          'Mask ROM is programmed during manufacture and cannot be changed.',
          'PROM is blank when sold and written once by blowing fuses in a programmer.',
          'EPROM is erased by ultraviolet light through a quartz window, typically for 15-30 minutes.',
          'EEPROM is erased and rewritten electrically, byte by byte.',
          'Flash is EEPROM-based and erases in blocks; it is used in SSDs, USB drives and phones.',
          'ROM commonly holds firmware such as the boot program.',
        ],
        table: {
          caption: 'RAM versus ROM',
          headers: ['Property', 'RAM', 'ROM'],
          rows: [
            ['Volatility', 'Volatile; loses data on power loss', 'Nonvolatile; keeps data without power'],
            ['Writes', 'Read and written during normal operation', 'Written once or infrequently'],
            ['Typical use', 'Main memory and cache', 'Firmware and boot code'],
            ['Examples', 'SRAM, DRAM', 'Mask ROM, PROM, EPROM, EEPROM, flash'],
          ],
        },
      },
      {
        title: 'Cache and virtual memory',
        body:
          'Cache exploits locality by keeping recent blocks close to the CPU. Virtual memory maps each program to physical frames and can spill pages to storage.',
        code: String.raw`Average access time = h x t_hit + (1 - h) x t_miss
h = hit rate, t_hit = hit time, t_miss = miss penalty`,
        bullets: [
          'A cache line is typically 64 bytes; a tag identifies which memory block it holds.',
          'A cache hit returns data in a few cycles; a miss forwards the request to RAM.',
          'Temporal locality reuses recent data; spatial locality uses nearby addresses.',
          'L1 is smallest and fastest, L2 is larger, and L3 is largest and often shared.',
          'Virtual memory divides a logical address space into pages, commonly 4 KiB.',
          'The MMU translates pages to physical frames through a page table; the TLB caches recent translations.',
          'A page fault loads a missing page from storage; excessive paging is thrashing.',
        ],
      },
      {
        title: 'Magnetic, optical and solid-state storage',
        body:
          'Secondary storage is nonvolatile and much larger than main memory. Magnetic, optical and solid-state media use different recording mechanisms.',
        bullets: [
          'Magnetic HDD: platters spin at 5,400 or 7,200 rpm and a read/write head seeks tracks.',
          'HDD average seek time is about 9 ms; sustained transfer is roughly 100-200 MB/s.',
          'Magnetic tape is sequential, cheap and dense, so it is used for backup and archives.',
          'Optical: a laser reads pits; CD holds about 700 MB, DVD 4.7 GB per layer and Blu-ray 25 GB per layer.',
          'Optical media are cheap and portable but slow to write and increasingly uncommon.',
          'NAND flash SSD has no moving parts; NVMe reads several GB/s with latency under 0.1 ms.',
          'Flash endurance is finite: cells wear out after a limited number of erase cycles.',
        ],
        table: {
          caption: 'Magnetic, optical and solid-state storage',
          headers: ['Property', 'Magnetic (HDD/tape)', 'Optical (CD/DVD/Blu-ray)', 'Solid-state (SSD)'],
          rows: [
            ['Mechanism', 'Magnetised regions on platters or tape', 'Laser reads pits and lands', 'Charge stored in NAND flash cells'],
            ['Typical capacity', '1-20 TB HDD; many TB tape', '700 MB CD; 4.7 GB DVD; 25 GB Blu-ray', '256 GB-4 TB'],
            ['Latency', 'About 5-10 ms HDD; seconds for tape', 'Tens of milliseconds', 'Under 0.1 ms'],
            ['Cost per TB', 'Low', 'Low', 'Highest'],
            ['Best use', 'Bulk storage and backup', 'Media and archival copies', 'Operating systems and random I/O'],
          ],
        },
      },
      {
        title: 'Peripherals and interfaces',
        body:
          'Peripherals provide input, output or storage. The interface must supply enough bandwidth for the device.',
        bullets: [
          'Input peripherals: keyboard, mouse, scanner, webcam, microphone and sensor.',
          'Output peripherals: monitor, printer, speaker and actuator; a touchscreen is both input and output.',
          'Storage peripherals: external HDD, SSD and tape drive.',
          'USB 2.0 carries up to 480 Mb/s; USB 3.2 exceeds 5 Gb/s, where Mb/s and Gb/s are megabits and gigabits per second.',
          'HDMI carries digital video and audio; SATA and NVMe connect storage devices.',
          'A slow interface bottlenecks a fast device, so match port bandwidth to device bandwidth.',
        ],
      },
    ],
    examPoints: [
      'Hierarchy order by speed is registers, cache, DRAM, SSD, HDD, tape; cost per bit falls in the same order.',
      'SRAM uses flip-flops, needs no refresh and serves as cache; DRAM uses capacitors, needs refresh and serves as main memory.',
      'SRAM and DRAM are volatile; ROM, flash, magnetic and optical storage are nonvolatile.',
      'PROM is one-time programmable, EPROM is UV-erasable, and EEPROM or flash is electrically erasable.',
      'Cache exploits locality; virtual memory maps pages to frames and uses a TLB, with page faults served from storage.',
      'HDDs are magnetic and mechanical, optical discs use a laser, and SSDs use NAND flash with latency under 0.1 ms.',
    ],
    keyTerms: [
      {
        term: 'Memory hierarchy',
        definition:
          'The ordered levels of storage from registers and cache to RAM, SSD, disk and tape, arranged by speed, capacity and cost per bit.',
      },
      {
        term: 'Virtual memory',
        definition:
          'A scheme that gives each program a logical address space mapped to physical frames, allowing programs larger than available RAM.',
      },
      {
        term: 'Cache hit',
        definition:
          'A memory access whose requested block is already present in cache, avoiding an access to the next lower level.',
      },
    ],
    quiz: [
      {
        question: 'Which memory is volatile and needs periodic refresh?',
        options: ['SRAM', 'DRAM', 'PROM', 'EPROM'],
        answer: 1,
        explanation:
          'DRAM stores each bit as charge on a capacitor, which leaks, so cells must be refreshed. SRAM uses flip-flops, while PROM and EPROM are nonvolatile.',
      },
      {
        question:
          'A cache has a 0.9 hit rate, 1 ns hit time and 100 ns miss penalty. What is the average access time?',
        options: ['10.9 ns', '11 ns', '90 ns', '100 ns'],
        answer: 0,
        explanation:
          'Average access time = 0.9 x 1 ns + 0.1 x 100 ns = 0.9 + 10 = 10.9 ns.',
      },
    ],
  },
];
