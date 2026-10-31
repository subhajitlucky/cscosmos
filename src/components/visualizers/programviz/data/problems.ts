// 100 Comprehensive Practice Questions for Program Cosmos
// Covering all 10 core computer architecture & program execution topics.

export interface ProgramProblem {
  id: number;
  topicNumber: number;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const TOPIC_CATEGORIES: { id: number; name: string; title: string }[] = [
  { id: 1, name: 'What Is a Program?', title: 'What Is a Program?' },
  { id: 2, name: 'Data Representation', title: 'How Does a Computer Understand Data?' },
  { id: 3, name: 'Understanding the CPU', title: 'Understanding the CPU' },
  { id: 4, name: 'Instruction Cycle', title: 'How Does a CPU Execute Instructions?' },
  { id: 5, name: 'Memory Basics', title: 'Understanding Computer Memory' },
  { id: 6, name: 'Memory Layout', title: 'How Does a Program Live in Memory?' },
  { id: 7, name: 'Multitasking & Processes', title: 'How Does a Computer Run Multiple Programs?' },
  { id: 8, name: 'Hardware I/O & Syscalls', title: 'How Does a Program Interact With Hardware?' },
  { id: 9, name: 'Compilers & Runtimes', title: 'How Does Code Become an Executable?' },
  { id: 10, name: 'Complete Lifecycle', title: 'Putting Everything Together' },
];

export const PROGRAM_PROBLEMS: ProgramProblem[] = [
  {
    "id": 1,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Beginner",
    "question": "What is the most accurate definition of a computer program?",
    "options": [
      "A physical electronic circuit permanently wired inside the computer power supply.",
      "A sequence of precise instructions written to guide a computer to perform a specific task.",
      "An image file displayed on a monitor screen.",
      "A collection of cables connecting the CPU directly to the internet."
    ],
    "correctIndex": 1,
    "explanation": "A computer program is an ordered sequence of instructions stored in memory that instructs the CPU on what computations, decisions, and data movements to perform."
  },
  {
    "id": 2,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Beginner",
    "question": "What is the difference between source code and machine code?",
    "options": [
      "Source code is written by humans in languages like C or Python; machine code consists of raw binary instructions executed directly by the CPU.",
      "Source code is only for mobile apps; machine code is only for supercomputers.",
      "Source code runs faster than machine code.",
      "Source code cannot be edited once saved, whereas machine code is easily read by humans."
    ],
    "correctIndex": 0,
    "explanation": "Source code is human-readable text created by developers. The CPU hardware cannot execute human text; source code must be compiled or interpreted into machine code (binary patterns of 0s and 1s)."
  },
  {
    "id": 3,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Beginner",
    "question": "Why do software engineers write programs in high-level programming languages rather than raw machine binary?",
    "options": [
      "Computers cannot understand binary numbers.",
      "High-level languages provide readable abstractions, type safety, and portability across different hardware architectures.",
      "High-level languages use less electricity inside the motherboard.",
      "Machine code was banned by modern operating systems."
    ],
    "correctIndex": 1,
    "explanation": "High-level languages like C, Java, and Python allow developers to write algorithms using human concepts (variables, loops, functions) rather than manually managing hardware registers and CPU-specific binary opcodes."
  },
  {
    "id": 4,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Beginner",
    "question": "Where does a computer program exist before the user clicks 'Run' or executes it?",
    "options": [
      "Inside the CPU registers.",
      "In non-volatile persistent storage (such as an SSD or Hard Drive) as an executable file.",
      "In the computer monitor display buffer.",
      "Inside the power cable."
    ],
    "correctIndex": 1,
    "explanation": "While passive, programs reside on persistent storage (SSD/HDD) as executable files. When executed, the operating system copies the instructions and static data into volatile system RAM."
  },
  {
    "id": 5,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Intermediate",
    "question": "What fundamental action does the Operating System perform when a user runs an executable?",
    "options": [
      "It turns off the CPU cooling fan.",
      "It allocates virtual memory address space, copies code and data into RAM, and initializes the CPU Program Counter to the entry point.",
      "It immediately deletes the executable file from the hard drive.",
      "It prints the entire source code to the terminal without running it."
    ],
    "correctIndex": 1,
    "explanation": "The OS loader inspects executable headers (e.g. ELF on Linux or PE on Windows), allocates a process virtual address space, loads binary sections into RAM, and sets the CPU Program Counter (PC) to the entry point."
  },
  {
    "id": 6,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Beginner",
    "question": "In computer architecture, what is the key difference between 'code' and 'data'?",
    "options": [
      "Code represents instructions for the CPU to execute; data represents values that those instructions read, modify, or output.",
      "Code is always stored on the internet; data is only stored in RAM.",
      "Code is made of binary, while data is made of English letters.",
      "There is no difference; CPUs treat text and numbers identically at all times."
    ],
    "correctIndex": 0,
    "explanation": "Code consists of executable CPU instructions (opcodes and operands). Data consists of values (integers, strings, image pixels) operated upon by those instructions."
  },
  {
    "id": 7,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Intermediate",
    "question": "What is an 'Opcode' (Operation Code) in a machine language instruction?",
    "options": [
      "The name of the software company that created the application.",
      "The specific numerical bit pattern that tells the CPU Control Unit which operation to perform (such as ADD, SUB, or MOV).",
      "The temperature reading of the motherboard.",
      "The serial number of the computer monitor."
    ],
    "correctIndex": 1,
    "explanation": "An opcode is the binary code portion of a machine instruction that specifies the basic operation to execute, such as addition, jump, load, or store."
  },
  {
    "id": 8,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Intermediate",
    "question": "Why can an executable compiled for an Intel x86-64 CPU not run natively on an ARM64 Apple Silicon or Raspberry Pi CPU?",
    "options": [
      "ARM computers do not use electricity.",
      "x86-64 and ARM64 have completely different hardware instruction set architectures (ISAs) with different opcodes and register layouts.",
      "Intel binaries are only compatible with monitors made before 2020.",
      "ARM processors can only understand JavaScript source code."
    ],
    "correctIndex": 1,
    "explanation": "Different processor families implement different Instruction Set Architectures (ISAs). Machine code for x86-64 uses opcodes that ARM hardware decoders cannot interpret without an emulation/translation layer (like Rosetta 2)."
  },
  {
    "id": 9,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Beginner",
    "question": "What is the crucial difference between a 'Program' and a 'Process'?",
    "options": [
      "A program is a passive executable file stored on disk; a process is an active, executing instance of that program in memory.",
      "A program is written in Python; a process is written in C++.",
      "A program requires a graphics card, while a process only runs in the cloud.",
      "There is no difference; they are exact synonyms."
    ],
    "correctIndex": 0,
    "explanation": "A program is static code sitting on secondary storage. A process is a living instance in RAM, containing allocated memory, open file handles, thread execution states, and CPU register values."
  },
  {
    "id": 10,
    "topicNumber": 1,
    "category": "What Is a Program?",
    "difficulty": "Advanced",
    "question": "According to the von Neumann architecture, where are instructions and data stored during execution?",
    "options": [
      "Instructions are stored in the keyboard, and data is stored in the mouse.",
      "Both instructions and data share the same unified memory address space (RAM).",
      "Instructions are permanently carved into physical copper wires, so they do not need memory.",
      "Instructions are kept on external USB drives exclusively."
    ],
    "correctIndex": 1,
    "explanation": "The defining characteristic of the von Neumann architecture is unified memory: both program instructions and program data reside in the same read-write memory (RAM)."
  },
  {
    "id": 11,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Beginner",
    "question": "What is a 'bit' in computer science?",
    "options": [
      "A collection of 1,000 files.",
      "The most fundamental unit of digital data, representing a binary state of either 0 or 1.",
      "A special high-speed cable connecting the CPU to the wall outlet.",
      "A single character in an email subject line."
    ],
    "correctIndex": 1,
    "explanation": "A bit (short for binary digit) is the smallest unit of digital information, physically represented by microscopic voltage levels in semiconductor transistors (e.g. low voltage = 0, high voltage = 1)."
  },
  {
    "id": 12,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Beginner",
    "question": "How many bits are in one standard byte, and how many distinct values can one byte represent?",
    "options": [
      "4 bits, representing 16 values.",
      "8 bits, representing 256 distinct values (0 to 255).",
      "10 bits, representing 1,000 values.",
      "16 bits, representing 65,536 values."
    ],
    "correctIndex": 1,
    "explanation": "A byte consists of 8 bits. Since each bit has 2 states, 2^8 = 256 unique combinations can be represented (from 0 to 255 for an unsigned integer)."
  },
  {
    "id": 13,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Beginner",
    "question": "What is the decimal number 13 represented in 8-bit binary?",
    "options": [
      "0000 1101",
      "0000 1011",
      "0001 0011",
      "0000 1110"
    ],
    "correctIndex": 0,
    "explanation": "In binary place values: 8 + 4 + 1 = 13. In 8 bits: (0*128) + (0*64) + (0*32) + (0*16) + (1*8) + (1*4) + (0*2) + (1*1) = 00001101."
  },
  {
    "id": 14,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Intermediate",
    "question": "Why do computer scientists and software engineers frequently use the Hexadecimal (base-16) number system?",
    "options": [
      "Hexadecimal allows computers to run 16 times faster.",
      "Exactly two hexadecimal digits cleanly represent one full 8-bit byte (e.g. 0xFF = 255 = 11111111).",
      "Hexadecimal numbers do not require binary electricity.",
      "Hexadecimal was invented to prevent cyber attacks."
    ],
    "correctIndex": 1,
    "explanation": "Because 16 is 2^4, every single hexadecimal character (0-9, A-F) maps directly to 4 binary bits (a nibble). Thus, one 8-bit byte is expressed compactly with exactly 2 hex characters."
  },
  {
    "id": 15,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Beginner",
    "question": "What decimal value corresponds to the binary byte 1111 1111?",
    "options": [
      "100",
      "255",
      "256",
      "1024"
    ],
    "correctIndex": 1,
    "explanation": "Summing all 8 powers of two: 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255."
  },
  {
    "id": 16,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Beginner",
    "question": "How does a computer represent English characters and text symbols in memory?",
    "options": [
      "By drawing miniature pictures of the letter inside the CPU transistor silicon.",
      "By assigning a standardized numeric code to every character, such as ASCII or Unicode.",
      "By changing the physical color of the RAM sticks.",
      "Characters are never stored in memory; only numbers exist in files."
    ],
    "correctIndex": 1,
    "explanation": "Character encoding systems like ASCII and Unicode map every letter to a specific number. For instance, in ASCII, the uppercase letter 'A' is represented by the decimal number 65 (binary 01000001)."
  },
  {
    "id": 17,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Intermediate",
    "question": "Why was Unicode (and encodings like UTF-8) created to replace standard 7-bit ASCII?",
    "options": [
      "7-bit ASCII could only represent 128 English characters, failing to support global languages, accents, and emojis.",
      "ASCII files were too large to transmit over fiber optic cables.",
      "Unicode was designed exclusively for quantum computers.",
      "ASCII could only represent numbers, not letters."
    ],
    "correctIndex": 0,
    "explanation": "7-bit ASCII has only 128 code points. Unicode provides a universal character set spanning over 150,000 characters covering every world writing system, mathematical symbols, and emoji, with UTF-8 providing backward-compatible variable-length encoding."
  },
  {
    "id": 18,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Advanced",
    "question": "How does modern computer hardware represent negative integers in binary?",
    "options": [
      "By painting a minus sign on the SSD chip.",
      "Using Two's Complement encoding, where the most significant bit acts as a sign bit and subtraction uses standard addition circuits.",
      "By dividing every positive number by zero.",
      "Negative numbers cannot exist in modern processors."
    ],
    "correctIndex": 1,
    "explanation": "Two's complement is standard across modern CPUs because it allows simple addition logic circuits to perform both addition and subtraction seamlessly, and provides a single representation for zero."
  },
  {
    "id": 19,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Intermediate",
    "question": "How does a computer digitally represent a standard 24-bit TrueColor image pixel?",
    "options": [
      "Using 3 bytes: one 8-bit byte for Red (0-255), one for Green (0-255), and one for Blue (0-255).",
      "Using one single bit that flips between black and white.",
      "By storing an audio recording of the color name.",
      "Using a list of text descriptions written in HTML."
    ],
    "correctIndex": 0,
    "explanation": "24-bit RGB uses 1 byte (8 bits, 0-255 levels) for Red, 1 byte for Green, and 1 byte for Blue, producing over 16.7 million possible color combinations per pixel."
  },
  {
    "id": 20,
    "topicNumber": 2,
    "category": "Data Representation",
    "difficulty": "Advanced",
    "question": "What is the difference between Little-Endian and Big-Endian byte ordering when storing a multi-byte integer in RAM?",
    "options": [
      "Little-endian stores the least significant byte at the lowest memory address; big-endian stores the most significant byte at the lowest address.",
      "Little-endian is only used for text, and big-endian is only used for images.",
      "Big-endian deletes the number when reading it from memory.",
      "Little-endian can only store numbers smaller than 10."
    ],
    "correctIndex": 0,
    "explanation": "Endianness defines byte order in memory: Little-endian (used by x86-64 and ARM in standard modes) puts the lowest byte first; Big-endian (standard network byte order) puts the highest byte first."
  },
  {
    "id": 21,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Beginner",
    "question": "What is the primary role of the CPU (Central Processing Unit)?",
    "options": [
      "To permanently store all files when the computer is turned off.",
      "To act as the primary brain of the computer, retrieving instructions from memory, decoding them, and executing calculations.",
      "To supply alternating electrical current from the wall socket.",
      "To produce sound waves through the computer speakers."
    ],
    "correctIndex": 1,
    "explanation": "The CPU is the central computational engine of the computer that fetches instructions, performs mathematical and logical operations, and controls data transfer across the system."
  },
  {
    "id": 22,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Beginner",
    "question": "What is the specific responsibility of the ALU (Arithmetic Logic Unit) inside the CPU?",
    "options": [
      "Executing mathematical operations (addition, subtraction) and logical evaluations (AND, OR, NOT, comparisons).",
      "Controlling the monitor display refresh rate.",
      "Regulating the speed of the cooling fans.",
      "Writing emails to other computers on the local network."
    ],
    "correctIndex": 0,
    "explanation": "The ALU contains the digital logic circuits that execute basic arithmetic (addition, subtraction, multiplication) and boolean logic operations (AND, OR, XOR, comparisons)."
  },
  {
    "id": 23,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Intermediate",
    "question": "What does the Control Unit (CU) inside a CPU do?",
    "options": [
      "It interprets instructions, generates electrical control signals, and orchestrates the movement of data between registers, ALU, and memory.",
      "It generates the physical sounds played through headphones.",
      "It compresses video files into MP4 format.",
      "It charges the laptop battery."
    ],
    "correctIndex": 0,
    "explanation": "The Control Unit directs the entire processor operation: it decodes opcodes and triggers micro-operations that coordinate the ALU, registers, and memory bus."
  },
  {
    "id": 24,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Beginner",
    "question": "What are CPU Registers?",
    "options": [
      "The list of registered owners who purchased the software license.",
      "Extremely small, ultra-fast storage locations physically built directly inside the CPU core.",
      "Large mechanical hard drives located on the motherboard.",
      "Internet servers that store website passwords."
    ],
    "correctIndex": 1,
    "explanation": "Registers are tiny, ultra-high-speed memory cells embedded directly inside the processor silicon. They hold operands and intermediate calculation results, operating within a fraction of a nanosecond."
  },
  {
    "id": 25,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Intermediate",
    "question": "What is the critical purpose of the Program Counter (PC) register?",
    "options": [
      "It counts the total number of programs installed on the hard disk.",
      "It holds the memory address of the NEXT instruction waiting to be fetched and executed by the CPU.",
      "It calculates the user's monthly internet billing cost.",
      "It measures the temperature of the processor in Celsius."
    ],
    "correctIndex": 1,
    "explanation": "The Program Counter (PC, or Instruction Pointer IP) stores the memory address of the next machine instruction. After each fetch, it automatically advances to point to the subsequent instruction."
  },
  {
    "id": 26,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Intermediate",
    "question": "What is the purpose of the Instruction Register (IR)?",
    "options": [
      "It holds the binary machine instruction that was just fetched from memory while the Control Unit decodes and executes it.",
      "It saves a copy of the user's source code for debugging.",
      "It stores the user's desktop background wallpaper.",
      "It controls keyboard backlighting."
    ],
    "correctIndex": 0,
    "explanation": "Once an instruction is fetched from RAM or L1 cache, it is placed in the Instruction Register (IR) so the Control Unit can decode its opcode and identify its operands."
  },
  {
    "id": 27,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Intermediate",
    "question": "What is the CPU Clock and why is it essential?",
    "options": [
      "A calendar clock that tells the user the current time of day in their timezone.",
      "An electronic oscillator producing regular voltage pulses that synchronize and step all digital circuits inside the CPU.",
      "A stopwatch that limits how many hours a student can play games.",
      "A mechanical gear mechanism that winds up the processor spring."
    ],
    "correctIndex": 1,
    "explanation": "The CPU clock generates precise periodic pulses (clock ticks) that synchronize the switching of transistors, ensuring signals propagate reliably between registers, multiplexers, and the ALU without data corruption."
  },
  {
    "id": 28,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Intermediate",
    "question": "If a processor has a clock speed of 3.0 GHz, what does this specification mean?",
    "options": [
      "The processor consumes 3.0 gallons of water per hour.",
      "The clock oscillator ticks 3 billion times per second.",
      "The computer has 3 gigabytes of hard drive storage.",
      "The computer can only run 3 programs at once."
    ],
    "correctIndex": 1,
    "explanation": "1 Hertz = 1 cycle per second. 3.0 Gigahertz (GHz) = 3,000,000,000 clock cycles per second."
  },
  {
    "id": 29,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Intermediate",
    "question": "What is an individual 'CPU Core' in a modern multi-core processor?",
    "options": [
      "A software program that speeds up internet downloads.",
      "A complete, self-contained processing unit with its own ALU, Control Unit, and registers capable of executing an independent instruction stream.",
      "A backup battery that powers the motherboard during outages.",
      "The plastic socket that anchors the processor to the motherboard."
    ],
    "correctIndex": 1,
    "explanation": "A multi-core processor integrates multiple independent execution engines (cores) onto a single silicon chip, allowing genuine simultaneous parallel execution of multiple threads."
  },
  {
    "id": 30,
    "topicNumber": 3,
    "category": "Understanding the CPU",
    "difficulty": "Advanced",
    "question": "What is the function of the CPU Flags (Condition Codes) register?",
    "options": [
      "To display the national flag of the country where the chip was manufactured.",
      "To hold 1-bit status indicators (such as Zero Flag, Carry Flag, Sign Flag, Overflow Flag) resulting from the most recent ALU operation.",
      "To indicate whether the computer is connected to Wi-Fi.",
      "To signal when the user has typed an invalid password."
    ],
    "correctIndex": 1,
    "explanation": "The flags register stores status bits that record outcomes of comparisons and arithmetic (e.g. ZF=1 if result was 0, SF=1 if negative). Conditional jump instructions (like JZ, JNE) inspect these flags to make branching decisions."
  },
  {
    "id": 31,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Beginner",
    "question": "What are the four classic stages of the CPU instruction execution cycle in chronological order?",
    "options": [
      "Compile, Save, Print, Reboot.",
      "Fetch, Decode, Execute, Write-back.",
      "Download, Install, Configure, Delete.",
      "Encrypt, Compress, Transmit, Receive."
    ],
    "correctIndex": 1,
    "explanation": "The core machine cycle follows: (1) Fetch instruction from memory into IR; (2) Decode opcode and operands; (3) Execute computation in ALU; (4) Write-back result to destination register or RAM."
  },
  {
    "id": 32,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Intermediate",
    "question": "During the 'Fetch' stage of the CPU cycle, what happens to the Program Counter (PC)?",
    "options": [
      "The PC is reset to zero, ending the program.",
      "The instruction at the address currently in the PC is read into the IR, and the PC is incremented to point to the next instruction.",
      "The PC is multiplied by 2 to double clock speed.",
      "The PC is cleared to make room for user data."
    ],
    "correctIndex": 1,
    "explanation": "During Fetch, the CPU uses the PC to locate the instruction in memory, loads it into the Instruction Register, and increments the PC so it is ready for the subsequent instruction."
  },
  {
    "id": 33,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Intermediate",
    "question": "What happens during the 'Decode' stage of the CPU cycle?",
    "options": [
      "The Control Unit analyzes the opcode in the Instruction Register to determine what operation to perform and which registers or memory locations are involved.",
      "The computer translates English text into French.",
      "The hard disk scans all files for computer viruses.",
      "The monitor renders the graphics onto the screen."
    ],
    "correctIndex": 0,
    "explanation": "Decoding is performed by the Control Unit's combinational logic, which splits the instruction into opcode and operand fields to configure internal data paths for execution."
  },
  {
    "id": 34,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Intermediate",
    "question": "What occurs during the 'Execute' stage for an arithmetic instruction such as ADD R0, R1?",
    "options": [
      "The operating system reboots the computer.",
      "The ALU reads the values currently in registers R0 and R1, computes their sum, and signals the result.",
      "The CPU writes the numbers to a text document on the hard drive.",
      "The CPU sends an email with the result."
    ],
    "correctIndex": 1,
    "explanation": "In the Execute stage, data is routed from source registers into the ALU inputs, which carries out the requested binary addition."
  },
  {
    "id": 35,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Intermediate",
    "question": "What happens in the 'Write-back' stage of the instruction execution cycle?",
    "options": [
      "The final computed result from the ALU is stored into the target destination register or memory address.",
      "The CPU sends a paper copy of the calculation to the printer.",
      "The operating system closes the active application.",
      "The computer's RAM is completely wiped clean."
    ],
    "correctIndex": 0,
    "explanation": "Write-back commits the output of the execution stage back into architectural state (the destination register or RAM), completing the cycle."
  },
  {
    "id": 36,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Beginner",
    "question": "What does the assembly instruction MOV R0, 15 do?",
    "options": [
      "It permanently deletes 15 files from the disk.",
      "It copies the immediate value 15 into CPU register R0.",
      "It moves the CPU physical chip 15 millimeters to the right.",
      "It waits 15 seconds before continuing."
    ],
    "correctIndex": 1,
    "explanation": "In assembly language, MOV (short for move, though conceptually a copy) loads a value into a destination register. Here, 15 is loaded into R0."
  },
  {
    "id": 37,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Beginner",
    "question": "If R0 contains 15 and R1 contains 27, what will R0 contain after executing ADD R0, R1?",
    "options": [
      "15",
      "27",
      "42",
      "0"
    ],
    "correctIndex": 2,
    "explanation": "ADD R0, R1 adds the value in R1 (27) to the value in R0 (15), yielding 42, which is written back into destination register R0."
  },
  {
    "id": 38,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Intermediate",
    "question": "How do Jump or Branch instructions (like JMP 0x0040) alter normal sequential instruction execution?",
    "options": [
      "They turn off the CPU clock temporarily.",
      "They overwrite the Program Counter (PC) with the target address, causing the next fetch to occur from the new location instead of PC + 1.",
      "They delete the instruction from memory.",
      "They reverse the polarity of the power supply."
    ],
    "correctIndex": 1,
    "explanation": "Normally, PC advances sequentially (+1 or +4 bytes). A Jump instruction directly writes a new address into the PC, redirecting execution to a loop, if/else branch, or function."
  },
  {
    "id": 39,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Intermediate",
    "question": "What is an 'Immediate Operand' in assembly instructions like ADD R0, #5?",
    "options": [
      "A constant numerical value embedded directly inside the instruction bytes itself, rather than stored in a register or memory.",
      "An instruction that executes in zero clock cycles.",
      "An emergency signal from the keyboard.",
      "A network packet requiring urgent delivery."
    ],
    "correctIndex": 0,
    "explanation": "An immediate operand is a literal constant value encoded directly into the instruction word, avoiding the need for an additional memory read."
  },
  {
    "id": 40,
    "topicNumber": 4,
    "category": "Instruction Cycle",
    "difficulty": "Advanced",
    "question": "What is 'Instruction Pipelining' in modern high-performance CPU architectures?",
    "options": [
      "Cooling the processor using liquid pipes inside the casing.",
      "Overlapping the execution of multiple instructions across different stages (e.g. fetching instruction N+1 while decoding instruction N).",
      "Sending instructions across the internet through underground fiber optic pipes.",
      "Compressing instructions to fit into fewer bits."
    ],
    "correctIndex": 1,
    "explanation": "Pipelining is an assembly-line technique: while one instruction is in the Execute stage, the next is being decoded, and the one after is being fetched, dramatically increasing instruction throughput."
  },
  {
    "id": 41,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Beginner",
    "question": "Why does a computer require fast RAM (Random Access Memory) instead of running code directly from an SSD or Hard Drive?",
    "options": [
      "SSDs cannot store numbers larger than 100.",
      "RAM is thousands of times faster than persistent SSD storage, matching the nanosecond speeds required by the CPU.",
      "Hard drives are completely erased whenever an app opens.",
      "RAM is cheaper than magnetic storage per terabyte."
    ],
    "correctIndex": 1,
    "explanation": "The CPU operates at clock cycles measured in fractions of a nanosecond. RAM provides access times around 50-80 nanoseconds, whereas SSDs take microseconds and magnetic disks take milliseconds."
  },
  {
    "id": 42,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Beginner",
    "question": "What does the term 'Volatile Memory' mean with respect to computer RAM?",
    "options": [
      "The memory is physically explosive if dropped.",
      "The memory requires continuous electrical power to retain its data; when power is turned off, all stored contents are lost.",
      "The memory changes its data randomly every 5 seconds.",
      "The memory cannot be read by the operating system."
    ],
    "correctIndex": 1,
    "explanation": "Volatile memory (like SRAM and DRAM) depends on active electrical charges or transistor states. Once power ceases, the data disappears immediately."
  },
  {
    "id": 43,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Beginner",
    "question": "What is a 'Memory Address' in RAM?",
    "options": [
      "The physical shipping address of the factory where the RAM chip was made.",
      "A unique numerical number that identifies the specific location of a byte in the system's memory grid.",
      "The URL of the website where the user downloaded the program.",
      "The MAC address of the computer's network interface card."
    ],
    "correctIndex": 1,
    "explanation": "Memory is organized as a sequential array of bytes. Each byte has an exact unique numerical index (address), allowing the CPU to read or write directly to that location."
  },
  {
    "id": 44,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Intermediate",
    "question": "What is meant by the concept of 'Byte-Addressable Memory'?",
    "options": [
      "Every individual 8-bit byte in RAM has its own distinct, unique memory address.",
      "You can only save files that are exactly 1 byte in size.",
      "The CPU can only read 1 bit of information per day.",
      "Only letters, not numbers, can be addressed in memory."
    ],
    "correctIndex": 0,
    "explanation": "In byte-addressable architectures (standard across modern PCs, phones, and servers), the smallest addressable unit of memory is one byte (8 bits)."
  },
  {
    "id": 45,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Intermediate",
    "question": "Why were 32-bit computing systems strictly limited to approximately 4 Gigabytes of addressable RAM?",
    "options": [
      "Operating systems were not smart enough to count past 4.",
      "A 32-bit memory address can only uniquely address 2^32 distinct byte locations (4,294,967,296 bytes \u2248 4 GB).",
      "Motherboards before 2010 were physically too small to fit more than 4 chips.",
      "Computer monitors could not display numbers larger than 4 billion."
    ],
    "correctIndex": 1,
    "explanation": "With 32-bit wide pointers, 2^32 unique addresses can be generated, which equals exactly 4,294,967,296 bytes (4 GiB). 64-bit systems expand this limit to 16 Exabytes."
  },
  {
    "id": 46,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Beginner",
    "question": "What is the key difference between RAM and ROM (Read-Only Memory)?",
    "options": [
      "RAM can be read and written dynamically during execution but is volatile; ROM is non-volatile permanent memory used for initial startup firmware (UEFI/BIOS).",
      "RAM is used for audio files, while ROM is used for video files.",
      "ROM is 1,000 times faster than RAM.",
      "RAM is permanently glued to the processor, while ROM is stored in the cloud."
    ],
    "correctIndex": 0,
    "explanation": "RAM is fast, volatile read/write working memory. ROM holds permanent firmware (like motherboard UEFI boot code) that remains intact when power is off."
  },
  {
    "id": 47,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Intermediate",
    "question": "What two electrical signals does the CPU assert to write data into a specific RAM location?",
    "options": [
      "The destination memory address on the address bus, the data value on the data bus, and the Write-Enable control signal.",
      "An audio frequency and a screen brightness signal.",
      "A Wi-Fi connection handshake and a Bluetooth ping.",
      "A battery voltage drop and a clock pause."
    ],
    "correctIndex": 0,
    "explanation": "To write data, the CPU drives the target address lines, places the payload on the data bus, and activates the Write-Enable (WE) control line."
  },
  {
    "id": 48,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Intermediate",
    "question": "Which of the following lists memory types in order of fastest access speed to slowest access speed?",
    "options": [
      "Hard Drive -> RAM -> L1 Cache -> CPU Registers.",
      "CPU Registers -> L1 Cache -> L2 Cache -> RAM -> SSD Storage.",
      "SSD Storage -> RAM -> CPU Registers -> L1 Cache.",
      "RAM -> CPU Registers -> SSD Storage -> L2 Cache."
    ],
    "correctIndex": 1,
    "explanation": "The memory hierarchy spans: Registers (<0.5 ns), L1 Cache (~1 ns), L2 Cache (~4 ns), L3 Cache (~10-20 ns), RAM (~60-80 ns), and SSD (~50,000+ ns)."
  },
  {
    "id": 49,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Advanced",
    "question": "What is a 'Cache Line' in CPU memory architecture?",
    "options": [
      "The copper wire connecting the power supply to the processor.",
      "The minimum fixed block of contiguous data (typically 64 bytes) transferred between main RAM and CPU cache.",
      "The line of source code currently being compiled.",
      "The progress bar displayed while saving a file."
    ],
    "correctIndex": 1,
    "explanation": "CPUs do not fetch isolated individual bytes from RAM; they fetch full 64-byte blocks called cache lines to exploit spatial locality (nearby data is likely needed soon)."
  },
  {
    "id": 50,
    "topicNumber": 5,
    "category": "Memory Basics",
    "difficulty": "Advanced",
    "question": "Why is 'Data Alignment' (e.g. placing a 4-byte integer at an address divisible by 4) critical for CPU performance?",
    "options": [
      "Misaligned data may cross cache-line or bus boundaries, forcing the CPU to perform multiple memory accesses and bit-shifting instead of a single read.",
      "Misaligned data changes the math from addition to subtraction.",
      "Operating systems refuse to install on unaligned hard drives.",
      "Aligned data prevents the CPU from overheating."
    ],
    "correctIndex": 0,
    "explanation": "Hardware memory buses read data in aligned chunks (word/quadword). If a 4-byte integer spans across two separate word boundaries, the memory controller must issue two reads and splice the bytes."
  },
  {
    "id": 51,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Beginner",
    "question": "What are the four primary memory segments allocated for a running process in virtual memory?",
    "options": [
      "Audio, Video, Images, Text.",
      "Code (Text) Segment, Data Segment (Data/BSS), Heap, and Stack.",
      "Input, Output, Monitor, Keyboard.",
      "HTML, CSS, JavaScript, WebAssembly."
    ],
    "correctIndex": 1,
    "explanation": "A process address space is partitioned into: Code/Text (compiled instructions), Data/BSS (globals/statics), Heap (dynamically allocated memory), and Stack (local variables/frames)."
  },
  {
    "id": 52,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Intermediate",
    "question": "Why is the Code (Text) segment typically marked as Read-Only and Executable in memory?",
    "options": [
      "To save hard drive storage space.",
      "To prevent bugs or malicious attacks from overwriting instructions while allowing the CPU to execute them safely.",
      "Because machine code cannot be modified once written to disk.",
      "Because RAM does not support writing to text."
    ],
    "correctIndex": 1,
    "explanation": "Marking the Code segment as Read-Only prevents accidental self-corruption and blocks security vulnerabilities (like buffer overflow attacks attempting to inject executable code)."
  },
  {
    "id": 53,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Intermediate",
    "question": "What is stored in the Data and BSS segments of a program's memory?",
    "options": [
      "Global and static variables (Data holds initialized variables; BSS holds uninitialized variables zeroed at launch).",
      "The operating system source code.",
      "The user's downloaded video files.",
      "Temporary local loop variables."
    ],
    "correctIndex": 0,
    "explanation": "Global and static variables live in the Data segment (if initialized with non-zero values) or BSS segment (if uninitialized/zero-initialized, consuming no disk space in the binary)."
  },
  {
    "id": 54,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Beginner",
    "question": "What data structure does the 'Call Stack' use, and what is its primary purpose?",
    "options": [
      "FIFO (First In First Out) queue used to stream video files.",
      "LIFO (Last In First Out) stack used to manage function calls, return addresses, and local variables.",
      "A hash table used to look up domain names on the internet.",
      "A linked list used to store music playlists."
    ],
    "correctIndex": 1,
    "explanation": "The call stack operates as Last-In-First-Out (LIFO). Calling a function pushes a stack frame; returning pops the frame, cleanly reclaiming local variables in microsecond time."
  },
  {
    "id": 55,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Beginner",
    "question": "What is the 'Heap' segment in program memory, and how is it used?",
    "options": [
      "A region of memory used for dynamic runtime allocation where data persists until explicitly freed (or garbage-collected).",
      "A pile of broken RAM chips sent for recycling.",
      "The memory segment that stores the computer's BIOS clock.",
      "A read-only segment where CPU microcode is stored."
    ],
    "correctIndex": 0,
    "explanation": "The Heap is used for dynamic memory allocation whose size or lifetime is unknown at compile time (e.g. allocating arrays via malloc() in C or new in Java/C++)."
  },
  {
    "id": 56,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Intermediate",
    "question": "In what direction do the Stack and Heap conventionally grow in a process address space?",
    "options": [
      "Both grow strictly to the right.",
      "The Stack conventionally grows downward (towards lower memory addresses), while the Heap grows upward (towards higher addresses).",
      "The Stack grows upward into the monitor, while the Heap shrinks into the mouse.",
      "Neither segment can ever change size after startup."
    ],
    "correctIndex": 1,
    "explanation": "On most computer architectures, the Heap grows upward from the end of the Data segment, while the Stack begins at high addresses and grows downward, maximizing the free space between them."
  },
  {
    "id": 57,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Intermediate",
    "question": "What is contained inside a single 'Stack Frame' (Activation Record) created when a function is called?",
    "options": [
      "The function's arguments/parameters, return address, saved register values, and local variables.",
      "The entire operating system kernel code.",
      "The user's desktop icon layout.",
      "The network IP packets currently in flight."
    ],
    "correctIndex": 0,
    "explanation": "A stack frame bundles the caller's return address, saved frame/base pointer (BP/EBP/RBP), function parameters, and the function's local variables."
  },
  {
    "id": 58,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Intermediate",
    "question": "What causes the catastrophic runtime error known as a 'Stack Overflow'?",
    "options": [
      "The computer's power supply drawing too much current.",
      "Unbounded or infinite recursion exhausting the allocated stack memory limit and colliding with protected guard pages.",
      "Typing too fast on the keyboard.",
      "Saving a file larger than 10 Megabytes."
    ],
    "correctIndex": 1,
    "explanation": "If a function calls itself infinitely without reaching a base case, continuous stack frames are pushed until the stack exceeds its memory boundary, triggering a stack overflow crash."
  },
  {
    "id": 59,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Intermediate",
    "question": "What is a 'Memory Leak' in a software application?",
    "options": [
      "Liquid coolant physically leaking from the motherboard onto the desk.",
      "Continuously allocating memory on the heap without freeing it when no longer needed, causing memory usage to continuously increase.",
      "When the computer loses internet connection during a download.",
      "When a program is saved to an external USB flash drive."
    ],
    "correctIndex": 1,
    "explanation": "A memory leak happens when heap memory is allocated (e.g. malloc) but never released after its references are lost, eventually exhausting system RAM and degrading performance."
  },
  {
    "id": 60,
    "topicNumber": 6,
    "category": "Memory Layout",
    "difficulty": "Advanced",
    "question": "What is the primary benefit of 'Virtual Memory' managed by the OS and CPU Memory Management Unit (MMU)?",
    "options": [
      "It gives every process the illusion of a dedicated, continuous address space while protecting processes from accessing each other's memory.",
      "It turns hard drive space into physical silicon RAM chips.",
      "It allows the CPU to run without any electrical power.",
      "It doubles the physical clock speed of the processor."
    ],
    "correctIndex": 0,
    "explanation": "Virtual memory translates process virtual addresses to physical RAM pages via page tables, isolating processes so a crash or vulnerability in one app cannot access or corrupt another."
  },
  {
    "id": 61,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Beginner",
    "question": "How can a single CPU core appear to run dozens of programs simultaneously?",
    "options": [
      "By physically splitting the CPU chip into 50 microscopic pieces.",
      "Through Time-Sharing (preemptive multitasking), rapidly switching execution between tasks thousands of times per second.",
      "By ignoring all background programs completely.",
      "By executing only one instruction per hour."
    ],
    "correctIndex": 1,
    "explanation": "Time-sharing gives each process a tiny time slice (quantum, e.g. 10 ms). The CPU switches between them so rapidly that humans perceive continuous simultaneous execution."
  },
  {
    "id": 62,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Intermediate",
    "question": "What is a 'Context Switch' in an operating system?",
    "options": [
      "Changing the font size inside a text editor.",
      "Saving the CPU state (registers, PC, stack pointer) of the current task and restoring the saved state of the next task to run.",
      "Switching from Wi-Fi to an Ethernet cable.",
      "Rebooting the computer into safe mode."
    ],
    "correctIndex": 1,
    "explanation": "A context switch pauses a running task by saving its hardware registers into its Process Control Block (PCB) and loading another task's registers into the CPU core."
  },
  {
    "id": 63,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Intermediate",
    "question": "What hardware mechanism triggers the OS scheduler to preempt a running process and regain control of the CPU?",
    "options": [
      "The physical computer power switch.",
      "A periodic Hardware Timer Interrupt generated by a programmable interval timer chip.",
      "The mouse movement sensor.",
      "The monitor refresh signal."
    ],
    "correctIndex": 1,
    "explanation": "A hardware timer periodically interrupts the CPU. When it fires, the CPU suspends user code and jumps to the OS kernel interrupt handler, allowing the scheduler to evaluate task priorities."
  },
  {
    "id": 64,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Intermediate",
    "question": "What is the structural difference between a 'Process' and a 'Thread'?",
    "options": [
      "Processes have completely isolated address spaces; threads exist within a process, sharing its heap, code, and global memory but retaining private stacks and registers.",
      "Processes run on laptops; threads only run on smartphones.",
      "A process is written in HTML, while a thread is written in CSS.",
      "Threads cannot execute calculations; only processes can compute."
    ],
    "correctIndex": 0,
    "explanation": "A process owns an isolated virtual memory space. Multiple threads within the same process share that memory (heap and globals), but each thread has its own call stack and register set."
  },
  {
    "id": 65,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Beginner",
    "question": "What is the difference between 'Concurrency' and 'True Parallelism'?",
    "options": [
      "Concurrency is interleaving multiple tasks over time on a single core; parallelism is running multiple tasks simultaneously on multiple physical cores.",
      "Concurrency is for mobile apps; parallelism is for desktop apps.",
      "Concurrency is slower than manual typing.",
      "There is no difference; they are identical concepts."
    ],
    "correctIndex": 0,
    "explanation": "Concurrency is about structure (dealing with lots of things at once via time-slicing). Parallelism is about execution (doing lots of things at the exact same physical instant on separate cores)."
  },
  {
    "id": 66,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Intermediate",
    "question": "What is a 'Race Condition' in multithreaded programming?",
    "options": [
      "A competition between two computers over an Ethernet cable.",
      "An error where two threads concurrently access and modify shared data without synchronization, producing unpredictable results depending on execution timing.",
      "When the CPU fan spins faster than the hard drive.",
      "When a program finishes executing ahead of schedule."
    ],
    "correctIndex": 1,
    "explanation": "A race condition occurs when concurrent threads access shared mutable state without proper locking (mutex/semaphore), leading to corrupted data depending on who executes first."
  },
  {
    "id": 67,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Intermediate",
    "question": "What are the three canonical states of a process in an operating system lifecycle?",
    "options": [
      "Draft, Published, Archived.",
      "Ready (waiting for CPU), Running (currently executing on CPU), and Blocked/Waiting (waiting for I/O).",
      "Installed, Uninstalled, Updated.",
      "Online, Away, Busy."
    ],
    "correctIndex": 1,
    "explanation": "Standard process states: Running (active on core), Ready (runnable in scheduler queue), and Blocked/Waiting (sleeping until an external event or I/O completes)."
  },
  {
    "id": 68,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Intermediate",
    "question": "Why is Process Isolation a vital architectural feature of modern operating systems?",
    "options": [
      "It prevents one buggy or crashed application from corrupting the memory of other running programs or taking down the entire operating system.",
      "It prevents users from having more than two applications installed.",
      "It turns off the internet when a program has a bug.",
      "It reduces the size of source code files on disk."
    ],
    "correctIndex": 0,
    "explanation": "Memory protection and address space isolation ensure that if an application crashes (e.g. segfault), only its private address space is terminated; the OS and other apps remain unaffected."
  },
  {
    "id": 69,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Advanced",
    "question": "What is a 'Deadlock' in concurrent systems?",
    "options": [
      "When the computer battery reaches 0%.",
      "A situation where two or more threads are permanently blocked, each waiting for a lock or resource held by the other, preventing further progress.",
      "A program that has no closing curly brace.",
      "When an optical mouse stops detecting movement."
    ],
    "correctIndex": 1,
    "explanation": "Deadlock occurs when Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. Neither can proceed, freezing both tasks."
  },
  {
    "id": 70,
    "topicNumber": 7,
    "category": "Multitasking & Processes",
    "difficulty": "Advanced",
    "question": "What is Thread-Local Storage (TLS)?",
    "options": [
      "A shared hard drive accessible to all computers on a network.",
      "A dedicated memory space where variables have private instances unique to each individual thread, avoiding shared state.",
      "A physical USB thumb drive attached to the motherboard.",
      "A cloud backup service for smartphone contacts."
    ],
    "correctIndex": 1,
    "explanation": "TLS allocates static or global variable storage where each thread receives its own independent copy, preventing multi-threaded contention and race conditions without locks."
  },
  {
    "id": 71,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Beginner",
    "question": "Why cannot a standard user-space program directly write raw bytes to physical hardware devices like network cards or disk drives?",
    "options": [
      "User programs lack permission; modern CPUs enforce Privilege Rings to protect hardware stability and security through the OS kernel.",
      "Semiconductor devices only accept input from factory engineers.",
      "Cables cannot carry signals from user programs.",
      "Computer monitors would burn out if user programs spoke to them."
    ],
    "correctIndex": 0,
    "explanation": "CPUs enforce hardware privilege levels (Ring 3 for user space, Ring 0 for kernel). Unrestricted access could allow any bug or malware to destroy disk partitions or spy on network traffic."
  },
  {
    "id": 72,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Beginner",
    "question": "What is the difference between CPU User Mode (Ring 3) and Kernel Mode (Ring 0)?",
    "options": [
      "User Mode restricts access to hardware and privileged instructions; Kernel Mode grants complete, unrestricted access to all CPU instructions and physical hardware.",
      "User Mode is for games; Kernel Mode is for email.",
      "User Mode runs on battery power; Kernel Mode requires AC wall power.",
      "User Mode is obsolete and no longer used in modern computers."
    ],
    "correctIndex": 0,
    "explanation": "User Mode executes with restricted CPU capabilities. Privileged instructions (like modifying page tables, configuring interrupts, or accessing I/O ports) can only execute in Kernel Mode."
  },
  {
    "id": 73,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Beginner",
    "question": "What is a 'System Call' (Syscall)?",
    "options": [
      "A telephone call made by customer service to report a software error.",
      "The controlled programmatic interface and CPU instruction through which a user program requests a service from the operating system kernel.",
      "A voice command spoken into the laptop microphone.",
      "A notification that an operating system update is ready to install."
    ],
    "correctIndex": 1,
    "explanation": "A syscall (e.g. read, write, open, socket) triggers a hardware trap that transitions the CPU from User Mode to Kernel Mode, allowing the kernel to perform privileged operations safely on the program's behalf."
  },
  {
    "id": 74,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Beginner",
    "question": "What is a 'Device Driver' in an operating system?",
    "options": [
      "The human person who transports the computer in a vehicle.",
      "A specialized kernel software module that translates generic OS requests into the proprietary commands required by specific physical hardware devices.",
      "A screwdriver used to assemble computer components.",
      "A software program that plays driving racing video games."
    ],
    "correctIndex": 1,
    "explanation": "Device drivers bridge the abstraction gap: the OS sends generic commands (e.g. 'write 512 bytes'), and the driver translates that into the specific registers, timings, and bus protocols of that exact hardware device."
  },
  {
    "id": 75,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Intermediate",
    "question": "What is a Hardware Interrupt in computer input/output?",
    "options": [
      "A physical cut in the power cable.",
      "An asynchronous electrical signal sent by a hardware device (like a keyboard or network card) alerting the CPU that an event requires immediate service.",
      "A pop-up notification on the desktop asking to renew a subscription.",
      "A loud acoustic sound produced by the hard drive."
    ],
    "correctIndex": 1,
    "explanation": "When an external event occurs (e.g. keyboard key pressed, network packet received), the hardware asserts an Interrupt Request (IRQ) line, causing the CPU to temporarily jump to an Interrupt Service Routine (ISR)."
  },
  {
    "id": 76,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Intermediate",
    "question": "What is the primary advantage of Interrupt-driven I/O over Polling?",
    "options": [
      "Interrupts consume less disk storage.",
      "The CPU does not waste valuable clock cycles in a tight loop repeatedly asking if data is ready; it performs other useful work until notified.",
      "Interrupts allow monitors to display more colors.",
      "Polling is completely illegal in modern operating systems."
    ],
    "correctIndex": 1,
    "explanation": "Polling burns 100% of CPU cycles repeatedly checking status registers. Interrupts allow the CPU to sleep or execute other programs until the device signals that it has finished."
  },
  {
    "id": 77,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Intermediate",
    "question": "What is the difference between Blocking I/O and Non-Blocking I/O?",
    "options": [
      "Blocking I/O puts the calling thread to sleep until data arrives; Non-Blocking I/O returns immediately with data or a status code indicating data is not yet ready.",
      "Blocking I/O is for text files; Non-blocking is for image files.",
      "Blocking I/O physically prevents the computer power switch from working.",
      "Non-blocking I/O is only used when the computer has no internet."
    ],
    "correctIndex": 0,
    "explanation": "Blocking I/O suspends the requesting thread so it consumes zero CPU while waiting. Non-blocking I/O (and event-driven I/O like epoll/kqueue) allows a single thread to manage thousands of concurrent I/O connections."
  },
  {
    "id": 78,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Advanced",
    "question": "What is Memory-Mapped I/O (MMIO)?",
    "options": [
      "Printing a geographic map of the computer factory on paper.",
      "An architecture where hardware device control registers are mapped into the same physical address space as system RAM, accessed using standard load/store instructions.",
      "Saving screenshots of the desktop directly to the hard drive.",
      "Mapping website URLs to IP addresses."
    ],
    "correctIndex": 1,
    "explanation": "With MMIO, communicating with hardware devices uses the same instructions (MOV, LOAD, STORE) as accessing RAM; the CPU memory bus routes accesses at specific physical addresses to device controllers."
  },
  {
    "id": 79,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Intermediate",
    "question": "What sequence of events occurs under the hood when a C program executes printf('Hello\\n')?",
    "options": [
      "The C runtime library buffers the string, invokes the write() system call to transition to Kernel Mode, the kernel copies bytes to the terminal buffer, and the graphics system renders the glyphs.",
      "The CPU immediately halts all background programs and displays the letters directly on the monitor glass.",
      "The compiler emails the text string to the operating system developers.",
      "The computer creates a new hard drive partition for the word 'Hello'."
    ],
    "correctIndex": 0,
    "explanation": "printf is a library function in libc. It formats text, calls the OS write() syscall, the kernel routes output to stdout (file descriptor 1), and the terminal emulator renders the rasterized font characters."
  },
  {
    "id": 80,
    "topicNumber": 8,
    "category": "Hardware I/O & Syscalls",
    "difficulty": "Advanced",
    "question": "What is Direct Memory Access (DMA)?",
    "options": [
      "Allowing high-speed hardware devices (like NVMe SSDs or Network Cards) to transfer bulk data directly to and from RAM without continuously burdening the CPU.",
      "Connecting a monitor cable directly to the CPU silicon pins.",
      "A memory upgrade purchased directly from the computer manufacturer.",
      "A method to bypass all computer login passwords."
    ],
    "correctIndex": 0,
    "explanation": "DMA controllers handle high-speed data transfers between I/O peripherals and RAM autonomously. The CPU initiates the transfer, performs other work, and is notified by an interrupt only when the transfer completes."
  },
  {
    "id": 81,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Beginner",
    "question": "What are the four classic stages of the C/C++ compilation pipeline in chronological order?",
    "options": [
      "Download, Decompress, Install, Run.",
      "Preprocessing, Compilation, Assembly, Linking.",
      "Minification, Bundling, Transpiling, Formatting.",
      "Parsing, Linting, Testing, Deploying."
    ],
    "correctIndex": 1,
    "explanation": "The classic native pipeline runs: (1) Preprocessor handles macros and header includes; (2) Compiler translates C to assembly; (3) Assembler converts assembly to object code (.o); (4) Linker resolves symbols into an executable binary."
  },
  {
    "id": 82,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "What is the primary role of the C Preprocessor (cpp)?",
    "options": [
      "It turns off the CPU fan to reduce acoustic noise.",
      "It processes directives like #include (inserting header files) and #define (expanding text macros) before syntactic parsing begins.",
      "It executes unit tests on the code.",
      "It uploads the binary file to an online app store."
    ],
    "correctIndex": 1,
    "explanation": "The preprocessor is a pure text-substitution engine that runs before compilation, expanding macros, including header prototypes, and evaluating conditional #ifdef blocks."
  },
  {
    "id": 83,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "What does the Assembler stage do in the compilation pipeline?",
    "options": [
      "It translates human-readable assembly instructions (e.g. MOV, ADD) into binary machine code stored in an object file (.o/.obj).",
      "It physically assembles the computer parts inside the casing.",
      "It organizes the user's desktop files into folders.",
      "It writes documentation comments into the source code."
    ],
    "correctIndex": 0,
    "explanation": "The assembler translates mnemonic assembly language statements into binary machine instructions, creating relocatable object files."
  },
  {
    "id": 84,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "What is the primary responsibility of the Linker in building an executable?",
    "options": [
      "It creates hyperlinks to websites inside the application menu.",
      "It combines multiple object files, resolves external function and variable references (symbols), and produces the final standalone executable.",
      "It connects the computer to the local Wi-Fi router.",
      "It translates Spanish comments into English."
    ],
    "correctIndex": 1,
    "explanation": "When code calls functions defined in other files or libraries (like printf from libc), the linker matches those unresolved symbol references to their actual binary memory offsets in the final executable."
  },
  {
    "id": 85,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "What is the difference between Static Linking and Dynamic Linking?",
    "options": [
      "Static linking embeds library machine code directly into the executable at build time; dynamic linking references shared libraries (.so/.dll) loaded into memory at runtime.",
      "Static linking is for games; dynamic linking is for web browsers.",
      "Dynamic linking makes the executable file 100 times larger on disk.",
      "Static linking requires an active internet connection to launch."
    ],
    "correctIndex": 0,
    "explanation": "Static linking creates self-contained larger binaries with all code bundled. Dynamic linking produces smaller binaries that share one copy of library code (e.g. libc.so, kernel32.dll) in RAM across multiple processes."
  },
  {
    "id": 86,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Beginner",
    "question": "What is the primary operational difference between an Ahead-of-Time (AOT) Compiler and an Interpreter?",
    "options": [
      "A compiler translates the entire source code into native machine code before execution; an interpreter parses and evaluates code dynamically line-by-line or statement-by-statement at runtime.",
      "An interpreter requires a GPU, while a compiler requires an SSD.",
      "Compilers can only read Python code; interpreters only understand C.",
      "Interpreters always produce faster execution speed than compiled native binaries."
    ],
    "correctIndex": 0,
    "explanation": "AOT compilers (C, C++, Rust, Go) produce raw machine code ahead of time for peak performance. Interpreters (standard Python, Ruby) parse and execute code on the fly with higher runtime overhead."
  },
  {
    "id": 87,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "What is 'Bytecode' in languages like Java (JVM) and Python (CPython)?",
    "options": [
      "Machine code that only runs on 8-bit computers.",
      "An intermediate, platform-independent instruction set executed by a software Virtual Machine rather than physical CPU hardware directly.",
      "A special high-security password format.",
      "A compressed ZIP archive of source code files."
    ],
    "correctIndex": 1,
    "explanation": "Bytecode (.class files in Java, .pyc in Python) is portable intermediate code designed for an idealized virtual machine, enabling 'write once, run anywhere' across different OS and CPU architectures."
  },
  {
    "id": 88,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Advanced",
    "question": "What is a Just-In-Time (JIT) Compiler (as used in modern JavaScript V8 and Java HotSpot)?",
    "options": [
      "A compiler that delays building your app until 1 minute before your deadline.",
      "An execution engine that monitors running bytecode, identifies frequently executed 'hot' code paths, and compiles them into optimized native machine code on the fly.",
      "A clock that tells programmers when it is time to write unit tests.",
      "An antivirus scanner that verifies scripts before they run."
    ],
    "correctIndex": 1,
    "explanation": "JIT compilers combine the quick startup of interpretation with the high performance of compiled code: hot functions executed repeatedly are compiled directly into native machine code in RAM."
  },
  {
    "id": 89,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "What is Garbage Collection (GC) in managed runtimes like Java, Go, and JavaScript?",
    "options": [
      "Physically cleaning dust out of the computer tower.",
      "An automatic memory management subsystem that detects and frees heap memory objects that are no longer referenced or reachable by the program.",
      "Deleting unused desktop shortcuts every Sunday.",
      "Emptying the operating system Recycle Bin or Trash folder."
    ],
    "correctIndex": 1,
    "explanation": "Garbage collection automatically tracks object references and reclaims unreachable heap allocations, eliminating manual free() calls and preventing dangling pointer bugs."
  },
  {
    "id": 90,
    "topicNumber": 9,
    "category": "Compilers & Runtimes",
    "difficulty": "Intermediate",
    "question": "How does the execution pipeline of C compare to that of standard Python?",
    "options": [
      "C compiles ahead-of-time directly to native machine code; Python compiles to bytecode that is interpreted by the CPython virtual machine loop at runtime.",
      "C is interpreted; Python is compiled directly to silicon circuits.",
      "Both use the exact same JIT engine.",
      "Neither requires a CPU to execute."
    ],
    "correctIndex": 0,
    "explanation": "C compiles to unmanaged native machine code with manual memory management. Python compiles transparently to bytecode and executes within an interpreter runtime with dynamic typing and garbage collection."
  },
  {
    "id": 91,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "When you type ./myprogram in a terminal shell and press Enter, what are the first operating system system calls invoked by the shell?",
    "options": [
      "reboot() and shutdown()",
      "fork() (to clone the shell process) followed by execve() (to load and execute the target binary)",
      "format_disk() and mount()",
      "socket() and connect()"
    ],
    "correctIndex": 1,
    "explanation": "In Unix/Linux systems, the shell creates a child process using fork(), and the child calls execve() with the path of the executable, replacing its address space with the new program."
  },
  {
    "id": 92,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "What is the purpose of the ELF (Executable and Linkable Format) header on Linux or PE header on Windows?",
    "options": [
      "It stores the programmer's profile picture and email signature.",
      "It contains metadata specifying the CPU architecture, entry point address, and memory segment mapping offsets required by the OS loader.",
      "It stores the copyright text printed on software packaging.",
      "It lists the websites where the executable was previously shared."
    ],
    "correctIndex": 1,
    "explanation": "Executable headers tell the OS kernel's loader how to parse the file: where the .text and .data segments begin, how much memory to allocate, and the exact virtual memory address of the first instruction."
  },
  {
    "id": 93,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Advanced",
    "question": "In a compiled C program, does CPU execution begin directly at the user's main() function?",
    "options": [
      "Yes, the hardware CPU specifically seeks out the word 'main' on the disk.",
      "No, execution begins at an OS entry point (conventionally _start in crt0), which initializes the stack, environment variables, argc/argv, and standard library before calling main().",
      "Execution begins at the last line of the source code and runs backward.",
      "Execution begins at the operating system desktop wallpaper."
    ],
    "correctIndex": 1,
    "explanation": "The actual entry point is `_start`, provided by C runtime startup code (crt0.o). It sets up the C runtime environment, initializes stdio, registers atexit handlers, passes argc/argv, and then calls main()."
  },
  {
    "id": 94,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Advanced",
    "question": "What is 'Demand Paging' during initial program launch?",
    "options": [
      "The user repeatedly clicking the program icon until it launches.",
      "The OS loader does not copy the entire multi-gigabyte binary into physical RAM at once; pages are loaded from disk only when the CPU actually accesses them, triggering minor page faults.",
      "Sending a physical paper page request to the memory manufacturer.",
      "Printing every line of code to the console before running."
    ],
    "correctIndex": 1,
    "explanation": "Modern operating systems use demand paging: the executable is memory-mapped into virtual memory. Physical RAM is allocated lazily as instructions are executed and page faults occur, enabling instant launch times."
  },
  {
    "id": 95,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "Why do CPU caches (L1/L2/L3) dramatically improve the runtime execution speed of loops and localized data?",
    "options": [
      "They exploit Temporal Locality (recently accessed instructions/data will likely be needed again soon) and Spatial Locality (nearby data is likely needed soon).",
      "They make the computer monitor refresh twice as fast.",
      "They delete unnecessary variables from the source code.",
      "They convert the code from C into machine language."
    ],
    "correctIndex": 0,
    "explanation": "Programs spend 90% of their time in 10% of the code (loops). Cache hierarchies keep active loop instructions and arrays in sub-nanosecond SRAM right next to the ALU."
  },
  {
    "id": 96,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "What happens under the hood when a function returns (e.g. return 0; in C)?",
    "options": [
      "The return value is placed in a designated register (e.g. EAX/RAX), the local stack frame is collapsed, and the CPU jumps back to the saved return address.",
      "The operating system closes the entire computer system.",
      "All variables in the computer are permanently saved to a USB drive.",
      "The processor resets its clock speed to zero."
    ],
    "correctIndex": 0,
    "explanation": "Returning from a function stores the return value in a register (like RAX), restores the caller's stack frame pointer (BP), pops the saved return address from the stack into the PC, and resumes caller execution."
  },
  {
    "id": 97,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "What happens when a program finishes and invokes exit(0)?",
    "options": [
      "The computer hardware immediately loses power.",
      "User-space buffers (like stdout) are flushed, the exit system call notifies the kernel, and the OS reclaims all allocated virtual memory, file descriptors, and process resources.",
      "The executable file is deleted from the hard drive.",
      "The computer monitor turns black permanently."
    ],
    "correctIndex": 1,
    "explanation": "exit() runs cleanup routines, closes open file descriptors, issues the exit/exit_group syscall, and transitions the process to a zombie state until its parent reads its return exit code."
  },
  {
    "id": 98,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "What causes a Segmentation Fault (SIGSEGV) crash in a running application?",
    "options": [
      "The program attempts to read or write to a virtual memory address that is not mapped in its address space or violates memory permissions (like writing to read-only code).",
      "The user types words faster than the keyboard buffer can accept.",
      "The monitor is disconnected from the graphics card.",
      "The program has more than 100 lines of code."
    ],
    "correctIndex": 0,
    "explanation": "When an instruction tries to dereference an invalid pointer (e.g. NULL / 0x0) or write into read-only memory, the hardware MMU triggers a page fault. The kernel detects an illegal access and terminates the process with SIGSEGV."
  },
  {
    "id": 99,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Beginner",
    "question": "What is the difference between a 'Cold Start' and a 'Warm Start' when launching a program?",
    "options": [
      "A cold start occurs when the executable must be read from slow persistent storage (SSD/HDD); a warm start occurs when code and libraries are already cached in RAM from recent execution.",
      "A cold start is only done during winter months.",
      "A warm start requires heating up the laptop with a hair dryer.",
      "Cold start is for compiled code; warm start is for interpreted scripts."
    ],
    "correctIndex": 0,
    "explanation": "On a cold start, instructions must be fetched from secondary storage into RAM, causing noticeable latency. On a warm start, the operating system page cache already holds the binary in RAM, making launch near-instant."
  },
  {
    "id": 100,
    "topicNumber": 10,
    "category": "Complete Lifecycle",
    "difficulty": "Intermediate",
    "question": "From a holistic perspective, what is the fundamental journey of a computer program from source code to final output?",
    "options": [
      "Human logic -> Source text -> Translation into binary machine instructions -> Loading into RAM -> CPU Fetch-Decode-Execute cycles -> OS system calls -> Hardware output.",
      "Writing text -> Saving on desktop -> Direct execution on the computer screen.",
      "Downloading an app -> Permanent burning into the motherboard copper wires.",
      "Converting audio signals into visual images on the monitor."
    ],
    "correctIndex": 0,
    "explanation": "The universal journey of computing: human thought expressed as source code is compiled into binary instructions, loaded by the OS into virtual memory, fetched and processed sequentially by CPU ALU/registers, interacting with peripherals through system calls to produce real-world results."
  }
];
