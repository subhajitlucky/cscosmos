import type { ITLesson } from './types';

export const part1Lessons: ITLesson[] = [
  // Chapter 1: Computer Organization & Block Diagram
  {
    chapterId: 'computer-organization',
    hook:
      'A computer can run a payroll, a video game, and a web server without changing a single wire. The trick is not the hardware; it is where the instructions live.',
    plainEnglish:
      'A computer is a machine that accepts input, stores programs and data, calculates, controls the order of work, and produces output.',
    oneIdea:
      'Five functional units and three buses turn a fixed piece of hardware into a general-purpose machine by storing instructions in memory.',
    whyItMatters:
      'This model explains where data moves, why bus width limits memory and speed, and how one processor design serves phones, servers, and supercomputers. It also gives you the vocabulary to trace a fault from device to CPU.',
    objectives: [
      'Name the five functional units and describe the job of each.',
      'Explain the stored-program concept and why it makes computers general-purpose.',
      'Distinguish address, data, and control buses, and calculate memory size from address width.',
      'Trace the fetch-decode-execute cycle and classify computers as micro, mini, mainframe, or supercomputer.',
    ],
    sections: [
      {
        title: 'Five functional units',
        body:
          'Every digital computer can be divided into five functional units. The input unit accepts data and instructions from outside: a keyboard, a barcode scanner, a camera, or a sensor. The memory unit stores both the program and the data being worked on. It is often called main memory, or random-access memory (RAM). The arithmetic and logic unit, or ALU, performs calculations such as addition and comparisons such as "is A greater than B?". The control unit does not process data. It reads instructions, interprets them, and sends timing and control signals to the other units. The output unit presents results: a screen, a printer, a speaker, or a motor. In most machines the ALU and control unit sit on one chip and form the central processing unit, or CPU. These units connect through buses, which are shared groups of wires. The diagram below shows the same five units and the main flow of data.',
        code: String.raw`+-----------+      +------------------+      +------------------+      +------------+
|   INPUT   |----->|   MEMORY UNIT    |<---->|  ALU + registers |----->|   OUTPUT   |
| keyboard  |      | programs + data  |      |  arithmetic work |      |  monitor   |
+-----------+      +--------+---------+      +--------+---------+      +------------+
                            ^                         ^
                            |    +--------------------+----+
                            +----|      CONTROL UNIT      |
                                 | program counter, clock |
                                 +------------------------+`,
      },
      {
        title: 'The stored-program idea',
        body:
          'Early computers were rewired for each new job, so the machine and the task were tied together. The stored-program concept, often credited to John von Neumann’s 1945 design, changed that. Instructions are stored in the same memory as data, in numbered locations called addresses. The CPU keeps the address of the next instruction in a small storage slot called a register. That register is the program counter. To change what the computer does, you load a different program. You do not rebuild the machine. This is why a laptop can be a word processor, a video player, and a web client in one afternoon. The design also creates the von Neumann bottleneck: instructions and data share the path between CPU and memory, so one transfer happens at a time. Caches, which are small fast memories, reduce the delay, but the basic model remains. A program is therefore data that describes operations on other data. A payroll program and its employee records can sit side by side in RAM.',
      },
      {
        title: 'Address, data, and control buses',
        body:
          'A bus is a shared set of wires plus the rules for using it. The address bus carries the location the CPU wants to read or write. Its width sets the maximum memory: n address lines can select 2^n locations. On a byte-addressable machine, a 16-bit address bus reaches 65,536 bytes, or 64 KiB. A 20-bit bus reaches 1 MiB. A 32-bit bus reaches 4 GiB. Here KiB means 1,024 bytes, MiB means 1,048,576 bytes, and GiB means 1,073,741,824 bytes. The data bus carries the actual contents. Its width is the number of bits, binary digits that are 0 or 1, moved in one transfer, typically 8, 16, 32, or 64. A wider data bus moves more per cycle but needs more wires. The control bus carries commands and status: read, write, clock, interrupt, and reset. The CPU puts an address on the address bus, sends a read or write signal on the control bus, and then sends or receives data. Because the bus is shared, only one transfer can use it at a time. That is another reason caches exist.',
        code: String.raw`Address bus: 16 lines -> 2^16 = 65,536 locations = 64 KiB
Data bus:     8 lines -> 8 bits = 1 byte per transfer
Control bus: read, write, clock, interrupt, reset

Address 2000H = 0010 0000 0000 0000
Address 2001H = 0010 0000 0000 0001
The range 0000H-FFFFH is 64 KiB; H marks hexadecimal (base 16).`,
      },
      {
        title: 'Fetch, decode, execute',
        body:
          'The processor repeats a cycle. In the fetch stage, the control unit copies the program counter to the memory address register, a register that holds the address being accessed. Memory returns the instruction, which goes into the instruction register. The program counter then advances to the next instruction. In decode, the control unit works out the operation and which registers or memory locations it needs. In execute, the ALU performs the operation, or the control unit moves data, or a branch, a jump to another instruction, changes the program counter. A write-back stage may write the result back to a register or memory. A clock, a signal that ticks at a fixed rate, paces the work. At 2 GHz (gigahertz, one billion cycles per second), one cycle lasts 0.5 nanoseconds, where a nanosecond is one billionth of a second. A simple instruction may need four cycles, or 2 ns. Pipelining overlaps stages of different instructions, so a pipeline can approach one completed instruction per cycle when no dependency, such as one instruction needing another’s result, stalls it. An interrupt can pause the cycle so a device can be serviced.',
      },
      {
        title: 'Input, output, and storage devices',
        body:
          'Input devices convert human or physical signals into digital form. Examples include keyboards, mice, touchscreens, scanners, microphones, webcams, and temperature sensors. Output devices do the reverse: monitors, printers, speakers, and actuators that move something. A touchscreen does both. A device connects through a controller, a small processor that manages the device, and a port, a connection point. USB (Universal Serial Bus) is a common serial interface, which sends bits one after another. HDMI (High-Definition Multimedia Interface) carries video and audio. SATA (Serial Advanced Technology Attachment) and NVMe (Non-Volatile Memory Express) connect storage. The CPU rarely waits for a slow device. Instead, the controller raises an interrupt, a signal that asks the CPU to pause. Direct memory access (DMA) can also move a block without the CPU copying each byte. Secondary storage keeps programs and files when power is off. Hard disks use rotating magnetic platters, solid-state drives use flash memory, nonvolatile chip storage, and optical drives read marks with a laser. A 7,200 rpm (revolutions per minute) hard disk typically seeks in about 9 ms, where ms means millisecond, one thousandth of a second. An NVMe SSD responds in under 0.1 ms.',
      },
      {
        title: 'Micro, mini, mainframe, supercomputer',
        body:
          'Computers are often classified by size, price, and throughput, the amount of work completed per second. A microcomputer uses a microprocessor, a CPU on one chip, as its processor. Laptops, desktops, tablets, and phones are microcomputers. Prices range from a few hundred to a few thousand dollars. A minicomputer, now usually called a midrange server, sits between personal machines and mainframes. It serves a department or a small business. A mainframe is built for many simultaneous users and very high reliability. Banks and insurers may run millions of transactions per day on one, with planned downtime measured in minutes per year. A supercomputer is the fastest class at a given time, built from thousands of processors working in parallel, at the same time. Weather models, drug discovery, and aircraft simulation use them. The labels age quickly: a 2026 phone is more powerful than a 1990 supercomputer. For exams, remember the order by scale and typical use, not by a fixed price.',
      },
    ],
    example: {
      title: 'Tracing an 8-bit load and add',
      scenario:
        'An 8-bit, byte-addressable computer has a 16-bit address bus, an 8-bit data bus, and 64 KiB of RAM. Instructions are three bytes: an opcode plus a 16-bit address. The program starts at 2000H. It loads the byte at 2100H (25), adds the byte at 2101H (17), and stores the result at 2102H. Trace the work.',
      steps: [
        {
          action:
            'Fetch the three-byte load instruction at 2000H (base 16).',
          result:
            'The address bus carries 2000H, the control bus signals read, and memory returns the instruction bytes, starting with the opcode, the part that names the operation, on the data bus. The control unit decodes a load from 2100H and advances the program counter to 2003H.',
        },
        {
          action:
            'Execute the load, then fetch and decode the add instruction at 2003H.',
          result:
            'Address 2100H goes to memory, data 25 enters register A, the accumulator that holds the running result. The instruction is decoded as an addition using the operand at 2101H, and the program counter advances to 2006H.',
        },
        {
          action:
            'Fetch the store instruction at 2006H, read 17, add, and store the result at 2102H.',
          result:
            'Address 2101H returns 17, and the ALU adds 25 and 17 to get 42 in register A. The store is decoded with address 2102H; the address bus carries 2102H, the data bus carries 42, and the control bus selects write.',
        },
      ],
      conclusion:
        'The program fetched three instructions and two operands, performed one addition, and wrote one result. The 16 address lines select 2^16 = 65,536 bytes, exactly 64 KiB, so this machine can address all of its RAM. The buses carried addresses at one moment and data at another, under the control unit’s signals.',
    },
    tradeoff: {
      gain:
        'A stored-program CPU with standard buses can run any program that fits its instruction set, so one design serves many tasks and most upgrades are software.',
      cost:
        'Instructions and data share the same memory path, and every transfer crosses the relatively slow system bus, creating the von Neumann bottleneck.',
      verdict:
        'Keep the general-purpose model and add caches, wider buses, and multiple cores where throughput matters. Pay for specialization only when a fixed task needs speed, safety, or low power.',
    },
    terms: [
      {
        term: 'Stored-program concept',
        definition:
          'The design rule that instructions and data live together in addressable memory, so loading a new program changes the machine’s behavior without rewiring.',
      },
      {
        term: 'System bus',
        definition:
          'The shared address, data, and control lines that carry information between the CPU, memory, and input/output devices.',
      },
    ],
    keyTakeaways: [
      'The five functional units are input, memory, ALU, control, and output; the ALU and control unit form the CPU.',
      'Stored programs make one machine general-purpose by keeping instructions in memory.',
      'Address-bus width sets addressable memory (2^n locations); data-bus width sets bits per transfer.',
      'Fetch, decode, execute repeats under clock control, and interrupts let devices request service.',
    ],
    pitfalls: [
      'Confusing main memory that holds running programs with secondary storage that keeps files after power-off.',
      'Assuming a wider data bus doubles memory capacity; capacity comes from the number of address lines.',
      'Treating micro, mini, mainframe, and supercomputer as fixed hardware categories; the labels track scale and use, and they age quickly.',
    ],
    focusPoints: [
      'Draw the five-unit block diagram from memory and label the buses.',
      'Calculate addressable memory from address-bus width: 2^n bytes for a byte-addressable machine.',
      'Trace one instruction through fetch, decode, execute, and write-back.',
    ],
    quiz: [
      {
        question:
          'A byte-addressable CPU has a 20-bit address bus. What is the maximum memory it can address?',
        options: ['64 KiB', '1 MiB', '20 MiB', '2 MiB'],
        answer: 1,
        explanation:
          'With 20 address lines the CPU can select 2^20 = 1,048,576 locations. At one byte per location that is 1,048,576 bytes, or 1 MiB.',
      },
      {
        question:
          'Which unit interprets an instruction and sends control signals to the other units?',
        options: ['Input unit', 'ALU', 'Control unit', 'Output unit'],
        answer: 2,
        explanation:
          'The control unit decodes each instruction and coordinates the ALU, memory, and I/O. The ALU performs arithmetic and logic but does not sequence the machine.',
      },
    ],
  },

  // Chapter 2: Memory, Storage & Peripherals
  {
    chapterId: 'memory-storage',
    hook:
      'The fastest memory in a computer holds less than a photo, while the slowest holds years of video. The hierarchy is how engineers make that gap affordable.',
    plainEnglish:
      'Memory and storage are the places a computer keeps programs and data, arranged from small, fast, expensive memory to large, slow, cheap storage.',
    oneIdea:
      'Every level of memory trades speed against cost and capacity, and cache plus virtual memory hide the slow levels by keeping likely data close to the CPU.',
    whyItMatters:
      'The hierarchy explains why adding RAM, buying an SSD, or changing a cache size affects performance in different ways. It also explains why a machine with a fast CPU can stall on a page fault or a slow disk.',
    objectives: [
      'Order the memory hierarchy by speed, capacity, and cost per bit.',
      'Distinguish SRAM, DRAM, and the PROM, EPROM, and EEPROM ROM families.',
      'Explain cache hits, locality, and virtual memory using concrete numbers.',
      'Compare magnetic, optical, and solid-state storage and choose a device for a given workload.',
    ],
    sections: [
      {
        title: 'The memory hierarchy',
        body:
          'No single memory technology is fast, large, and cheap at the same time. Engineers therefore build a hierarchy. Registers are small storage slots inside the CPU; together they hold a few hundred bytes to a few kilobytes. They are the fastest and most expensive per bit. Cache memory is a small fast buffer built from SRAM (static RAM); it holds recently used blocks in kilobytes to megabytes. Main memory is built from DRAM (dynamic RAM) and holds the active programs in gigabytes. Solid-state drives (SSDs) use flash chips, nonvolatile memory that keeps data without power, and hold hundreds of gigabytes to several terabytes. Hard disks and tape hold terabytes at the lowest cost per gigabyte. As you move down, capacity and access time grow, while cost per bit falls. The table gives typical orders of magnitude, not fixed specifications. The hierarchy works because programs show locality: they reuse recent data and nearby addresses. If the next access is usually found in a small fast level, the average cost approaches that level, not the slow one. A cache hit avoids the slower level below it; a miss pays both the search and the lower-level access. The working set is the data a program is actively using. If it fits, the machine runs smoothly.',
        code: String.raw`Level          Typical size        Typical latency       Cost per bit
Registers      0.5-2 KB            under 1 ns            highest
L1 cache       32-64 KB per core   1-2 ns                very high
L2 cache       256 KB-2 MB/core    3-10 ns               high
Main memory    8-64 GB             60-100 ns             moderate
SSD            256 GB-4 TB         50-100 microseconds   low
Hard disk      1-20 TB             5-10 milliseconds     very low
Tape           many TB             seconds to minutes    lowest
ns = nanosecond (one billionth of a second); KB, MB, GB, TB are capacity units.`,
      },
      {
        title: 'SRAM and DRAM',
        body:
          'Main memory and cache are both random-access memory, meaning any location can be read in roughly the same time. They use different cells. SRAM, or static RAM, stores a bit in a flip-flop, a tiny circuit that holds one bit, made from about six transistors, tiny electronic switches. It keeps its value as long as power is on, with no refresh, and it is fast. It is also bulky and expensive, so it is used for cache, not for gigabytes of main memory. DRAM, or dynamic RAM, stores a bit as charge on a capacitor, a component that stores charge, with one transistor. Capacitors leak, so every row must be read and rewritten, or refreshed, every 64 milliseconds in a typical chip. That refresh costs time and power, but a DRAM cell is much smaller and cheaper per bit. This is why main memory is DRAM. Both are volatile: they lose data when power is removed. Modern DRAM is synchronous (SDRAM), and DDR (double data rate) generations send data twice per clock cycle. A common exam point is the trade: SRAM is faster and costlier; DRAM is denser and cheaper, but slower and needs refresh.',
      },
      {
        title: 'ROM and its programmable family',
        body:
          'Read-only memory, or ROM, is nonvolatile: it keeps data without power. Mask ROM is programmed during manufacture and cannot be changed. It suits high-volume firmware, the software stored on a chip that starts a device. PROM, or programmable ROM, is blank when sold. The user writes it once with a special programmer that blows tiny fuses. EPROM, or erasable programmable ROM, can be erased by exposing a quartz window to ultraviolet light for about 15 to 30 minutes, then rewritten. EEPROM, or electrically erasable programmable ROM, can be erased and rewritten byte by byte with electrical signals, without removing the chip. Flash memory is a related EEPROM technology that erases in blocks rather than bytes. It is used in SSDs, USB drives, and phone storage. Endurance, the number of writes before a cell wears out, is finite. An EEPROM cell may survive about one million writes, while flash blocks often tolerate thousands to tens of thousands of erase cycles. Firmware that starts a PC often lives in flash or EEPROM.',
      },
      {
        title: 'Cache, locality, and virtual memory',
        body:
          'A cache is a small fast memory that holds copies of recently used main-memory blocks, called cache lines. A typical line is 64 bytes. Each line carries a tag, an address label that tells the cache which block it holds. When the CPU asks for an address, the cache compares the tag. A hit returns the data in a few cycles. A miss forwards the request to RAM and may remove, or evict, a line. The three cache levels, L1, L2, and L3, differ in size and latency, the delay for one access. L1 might be 32 KiB per core at about 1 ns, L2 512 KiB at about 5 ns, and L3 16 MiB shared at about 15 ns. Virtual memory gives each program its own logical address space, the addresses the program uses, divided into fixed-size pages, commonly 4 KiB. The memory management unit (MMU) translates each virtual page to a physical frame, a slot in RAM, using a page table. A translation lookaside buffer (TLB) caches recent translations. If the page is not in RAM, a page fault loads it from storage. Virtual memory lets programs exceed physical RAM, but heavy paging, called thrashing, is far slower than RAM.',
      },
      {
        title: 'Magnetic, optical, and solid-state storage',
        body:
          'Secondary storage is nonvolatile and usually much larger than main memory. Magnetic storage writes bits as magnetized regions. A hard disk drive (HDD) spins magnetic disks called platters at 5,400 or 7,200 revolutions per minute and moves a read/write head over them. Average seek time, the delay to reach the right track, a ring on a platter, is about 9 ms, and sustained transfer is roughly 100 to 200 MB/s, where MB/s means megabytes per second. Magnetic tape is slower but cheap and dense, so it is used for archives and backups. Optical storage uses a laser. A compact disc holds about 700 MB, a DVD about 4.7 GB per layer, and a Blu-ray disc 25 GB per layer. Reads are fast enough for media, but writes are slow, and optical media are less common now. Solid-state storage uses NAND flash, a flash technology that erases in blocks, with no moving parts. An NVMe (Non-Volatile Memory Express) SSD can read at several GB/s with latency under 0.1 ms, but flash wears out after a limited number of erase cycles. Cost per terabyte is highest for SSD, lower for HDD, lowest for tape.',
      },
      {
        title: 'Peripherals and the speed/cost trade-off',
        body:
          'Peripherals are devices attached to the computer for input, output, or storage. Input peripherals include keyboards, mice, scanners, webcams, microphones, and sensors. Output peripherals include monitors, printers, speakers, and actuators that move something. A touchscreen is both. Storage peripherals include external SSDs, hard disks, and tape drives. The interface, the connection and its rules, matters as much as the device. USB (Universal Serial Bus) 2.0 tops out at 480 Mb/s, where Mb/s means megabits per second. USB 3.2 can exceed 5 Gb/s, where Gb/s means gigabits per second. HDMI (High-Definition Multimedia Interface) carries video and audio, and NVMe connects an SSD directly to the PCI Express bus, the high-speed expansion bus. A slow interface can bottleneck a fast device. The hierarchy’s rule is simple: pay for speed only where the workload needs it. Put the smallest, fastest, most expensive memory closest to the CPU, and the largest, slowest, cheapest storage farthest away. A cache costs more per byte than RAM but prevents many RAM trips. An SSD costs more per terabyte than a hard disk but removes mechanical seek delays. Choose by access pattern: random small reads favor SSD, while sequential archives favor tape.',
      },
    ],
    example: {
      title: 'The cache that cut average access time',
      scenario:
        'A processor runs 1,000 memory accesses. 950 hit in the L1 cache and cost 1 ns each. The other 50 miss and cost 100 ns each, including the cache check. An engineer claims the cache makes memory about 17 times faster on average. Check the claim.',
      steps: [
        {
          action: 'Tally the hits and misses.',
          result:
            '950 hits and 50 misses out of 1,000 accesses give a hit rate of 95 percent and a miss rate of 5 percent.',
        },
        {
          action: 'Compute the total time with the cache.',
          result:
            '950 × 1 ns + 50 × 100 ns = 950 + 5,000 = 5,950 ns for 1,000 accesses, or 5.95 ns per access.',
        },
        {
          action: 'Compare with a system that always pays 100 ns for main memory.',
          result:
            '1,000 × 100 ns = 100,000 ns. Then 100,000 ÷ 5,950 ≈ 16.8, so the cache is about 16.8 times faster on average.',
        },
      ],
      conclusion:
        'The 5 percent miss rate still consumes 5,000 of the 5,950 ns, because each miss costs 100 times a hit. A slightly higher hit rate, or a lower miss penalty, can matter more than a bigger cache. This is why designers tune both size and replacement policy.',
    },
    tradeoff: {
      gain:
        'Fast memory close to the CPU keeps the working set available and can cut average access time by an order of magnitude, as the cache example shows.',
      cost:
        'SRAM and cache are expensive per bit and consume chip area, while DRAM needs refresh and storage is thousands of times slower.',
      verdict:
        'Spend on cache and RAM until the working set fits and the miss rate is low, then spend on SSD capacity for files. Match each level to the access pattern rather than buying the fastest option everywhere.',
    },
    terms: [
      {
        term: 'Memory hierarchy',
        definition:
          'The ordered levels of storage from registers and cache to RAM, SSD, disk, and tape, arranged by speed, size, and cost per bit.',
      },
      {
        term: 'Virtual memory',
        definition:
          'A scheme that gives each program a logical address space and maps its pages to physical RAM or storage, so programs can exceed available RAM.',
      },
    ],
    keyTakeaways: [
      'The hierarchy trades speed for capacity and cost: registers are fastest, tape is cheapest per terabyte.',
      'SRAM is fast and refresh-free but expensive; DRAM is dense and cheap but needs refresh.',
      'PROM is one-time programmable, EPROM is UV-erasable, and EEPROM or flash is electrically rewritable.',
      'Cache exploits locality; virtual memory maps pages and can spill to storage, but thrashing is slow.',
    ],
    pitfalls: [
      'Calling an SSD "memory" in the same sense as RAM; it is nonvolatile storage, hundreds of times slower than DRAM.',
      'Assuming a larger cache always helps; a low hit rate or high miss penalty can erase the gain.',
      'Confusing EPROM and EEPROM: EPROM needs ultraviolet light, while EEPROM erases electrically.',
    ],
    focusPoints: [
      'Order registers, cache, RAM, SSD, hard disk, and tape by latency and cost.',
      'Match each ROM family to its programming and erasure method.',
      'Calculate average access time from hit rate, hit cost, and miss penalty.',
    ],
    quiz: [
      {
        question: 'Which memory is volatile and needs periodic refresh?',
        options: ['SRAM', 'DRAM', 'PROM', 'EPROM'],
        answer: 1,
        explanation:
          'DRAM stores each bit as charge on a capacitor, which leaks, so the cells must be refreshed. SRAM holds bits in flip-flops, and PROM and EPROM are nonvolatile.',
      },
      {
        question:
          'A program’s working set is 12 GB on a laptop with 8 GB of RAM. What is the most direct effect?',
        options: [
          'The CPU clock speed falls to 1 GHz',
          'The cache becomes nonvolatile',
          'Pages must be swapped to storage, causing page faults and slowdown',
          'The address bus shrinks to 8 bits',
        ],
        answer: 2,
        explanation:
          'The 4 GB shortfall forces pages out of RAM. Each access to a swapped page causes a page fault and a slow storage read, which is why heavy paging feels far slower than RAM.',
      },
    ],
  },
];
