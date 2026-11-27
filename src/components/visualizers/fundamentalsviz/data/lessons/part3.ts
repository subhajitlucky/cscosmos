import type { ITLesson } from './types';

export const part3Lessons: ITLesson[] = [
  {
    chapterId: 'microprocessors',
    hook: 'A 1978 chip with about 29,000 transistors gave the IBM PC its speed, its 1 MB ceiling, and a segmented address scheme that still appears in exams.',
    plainEnglish:
      'The 8086 is a 16-bit microprocessor that fetches instructions ahead of time, executes them in a separate unit, and builds 20-bit memory addresses from two 16-bit registers.',
    oneIdea:
      'The 8086 separates fetching from executing, and every memory access is the sum of a segment base and an offset.',
    whyItMatters:
      'This family sets the vocabulary for later processors: registers, flags, real and protected mode, 32-bit addressing, caches, and superscalar execution. Exam questions and PC history both start here.',
    objectives: [
      'Describe how the bus interface unit and the execution unit share work.',
      'Name the general, pointer, index and segment registers and explain their roles.',
      'Calculate a physical address from a segment value and an offset.',
      'Compare the 8086, 8088, 80286, 80386, 80486 and Pentium generations.',
    ],
    sections: [
      {
        title: 'Two units, one pipeline',
        body: 'The 8086 is a 16-bit microprocessor introduced by Intel in 1978. It has a 16-bit arithmetic logic unit, or ALU, the circuit that performs arithmetic and logic, plus fourteen 16-bit registers, a 20-bit address bus, and about 29,000 transistors. The address bus reaches 2^20 bytes, which is 1,048,576 bytes or 1 MB. The chip is divided into two cooperating parts. The bus interface unit, or BIU, talks to memory and input/output devices. It fetches instructions, reads operands (the data values an instruction works on), and computes 20-bit physical addresses. It also fills a six-byte instruction queue. The execution unit, or EU, decodes and executes instructions. It contains the ALU, the registers, and the flags. The EU never touches memory directly. It takes instructions from the queue and asks the BIU when it needs data. Because the BIU can fetch the next instruction while the EU works on the current one, the two units overlap. This overlap is called pipelining. A jump or call empties the queue, so branches reduce the benefit. Fetching ahead keeps the bus busy even when the current instruction takes several cycles.',
      },
      {
        title: 'The register set',
        body: 'An 8086 register is a 16-bit storage location inside the processor. The four general-purpose registers are AX, BX, CX, and DX. Each can be split into two 8-bit halves, so AX becomes AH and AL. AX is the accumulator, the default register for arithmetic and string instructions. BX is a base register for memory work. CX is the count register for loops and shifts. DX holds data and the high half of a multiplied result; it also supplies the port number that selects an input/output device. The pointer registers are SP, the stack pointer, and BP, the base pointer. SP tracks the top of the stack; BP addresses data on the stack. The stack is a last-in, first-out memory area used for calls and temporary data. The index registers are SI, the source index, and DI, the destination index, used for block moves and string operations. Four segment registers, CS, DS, SS, and ES, hold the starting bases of code, data, stack, and extra segments. IP holds the offset of the next instruction. FLAGS holds status and control bits. That makes fourteen 16-bit registers in all, plus the queue hidden inside the BIU.',
        code: 'General   AX  accumulator      AH | AL\n          BX  base             BH | BL\n          CX  counter          CH | CL\n          DX  data / I-O       DH | DL\nPointer   SP  stack pointer\n          BP  base pointer\nIndex     SI  source index\n          DI  destination index\nSegment   CS  code   DS  data   SS  stack   ES  extra\nControl   IP  instruction pointer      FLAGS  status/control bits',
      },
      {
        title: 'Flags: the processor status report',
        body: 'The FLAGS register is a 16-bit collection of single-bit messages. Six status flags describe the result of the last arithmetic or logic operation. CF, the carry flag, is set when an unsigned result needs a bit beyond the register width. ZF, the zero flag, is set when the result is zero. SF, the sign flag, copies the most significant bit of the result, so it shows a negative value in signed arithmetic. OF, the overflow flag, is set when a signed result cannot fit. PF, the parity flag, records whether the low byte has an even number of 1 bits. AF, the auxiliary carry flag, supports binary-coded decimal, a decimal encoding that stores one digit in four bits. Three control flags change how the processor behaves. TF enables single-step debugging. IF allows hardware interrupts to reach the processor. DF chooses the direction of string operations. A concrete case: adding 0FFFFh and 0001h in a 16-bit register produces 0000h with CF = 1 and ZF = 1. The carry left the register, and the stored result is zero.',
      },
      {
        title: 'Segmentation and physical addresses',
        body: 'The 8086 has 1 MB of address space but only 16-bit registers, which hold values up to 0FFFFh or 65,535. Intel solved this with segmentation. Memory is divided into segments of up to 64 KB. A segment register holds the segment base divided by 16, and an offset register holds a position inside the segment. The processor shifts the segment value left by four bits, which is the same as multiplying by 10h, then adds the offset. The result is a 20-bit physical address, the actual address placed on the memory bus. For example, CS = 348Ah and IP = 4214h give 348A0h + 4214h = 38AB4h, or 232,116 in decimal. Segment:offset pairs overlap: 3800h:0AB4h produces the same 38AB4h. The standard pairs are CS:IP for the next instruction, SS:SP for the stack top, DS:BX or DS:SI for data, and ES:DI for extra data. The 8086 has no protected mode and no memory protection, so any program can overwrite any address.',
        code: 'Physical address = segment x 10h + offset\n\nCS = 348Ah, IP = 4214h\n348Ah x 10h = 348A0h\n348A0h + 4214h = 38AB4h\n38AB4h = 232,116 decimal',
      },
      {
        title: 'Pipelining and the 8088 bus',
        body: 'Pipelining means starting the next instruction before the current one finishes. In the 8086, the BIU can hold up to six bytes of upcoming instructions in its queue. A typical instruction is two or three bytes long, so the queue holds two or three instructions. While the EU executes one, the BIU fetches the next. This works best for straight-line code. A taken jump, call, or return discards the queue and forces a fresh fetch, which is why branches cost time. The 8088 is the same processor core with an 8-bit external data bus instead of the 16-bit bus of the 8086. A bus is a set of wires that carries addresses, data, and control signals; a bus cycle is one complete transfer. Internally the 8088 still works with 16-bit words, so a 16-bit memory access takes two bus cycles. That made the 8088 cheaper to connect to 8-bit support chips, and it is why IBM chose it for the original PC in 1981. The 8088 queue holds four bytes.',
      },
      {
        title: 'From 8086 to Pentium',
        body: 'The 80286 arrived in 1982 with a 24-bit address bus, so it could address 16 MB. It added protected mode, a mode that uses descriptor tables, data structures that record where each segment starts and what it may access, to check every memory access, and it supported virtual memory, where disk space extends RAM. Real mode, the original 8086 mode with direct addressing, kept compatibility. The 80386DX in 1985 widened the registers, ALU, data bus, and address bus to 32 bits. It could address 4 GB, added paging, which maps fixed-size memory pages to physical frames, and offered virtual 8086 mode so old programs could run under a protected-mode operating system. The cheaper 80386SX used a 16-bit external data bus and a 24-bit address bus. The 80486 in 1989 added an integrated floating-point unit for real-number arithmetic, an 8 KB on-chip cache for recently used data, and pipelined execution, reaching about 1.2 million transistors. The Pentium in 1993 introduced superscalar execution, meaning two integer pipelines called U and V could issue two instructions in one clock. It also used a 64-bit external data bus, split instruction and data caches of 8 KB each, and branch prediction, which guesses a jump direction to keep fetching.',
      },
    ],
    example: {
      title: 'Converting a segment:offset pair into a physical address',
      scenario:
        'An exam question gives CS = 348Ah and IP = 4214h and asks where the next instruction is fetched. A second part asks whether another segment:offset pair can name the same byte.',
      steps: [
        {
          action:
            'Shift the segment value left by one hex digit, which multiplies it by 10h: 348Ah becomes 348A0h.',
          result:
            'The segment base now occupies the upper 16 bits of a 20-bit address, leaving room for a 16-bit offset.',
        },
        {
          action:
            'Add the offset: 348A0h + 4214h = 38AB4h. Convert to decimal: 3 x 65,536 + 8 x 4,096 + 10 x 256 + 11 x 16 + 4 = 232,116.',
          result:
            'The processor places 38AB4h on the 20-bit address bus, which is within the 1 MB space.',
        },
        {
          action:
            'Test another pair: 3800h x 10h = 38000h, and 38000h + 0AB4h = 38AB4h.',
          result:
            'The pairs 348Ah:4214h and 3800h:0AB4h name the same physical byte, so segment:offset addresses are not unique.',
        },
      ],
      conclusion:
        'Always shift the segment first, then add the offset. Because segments overlap, the physical address is the unique value, while the segment:offset pair is only one way to write it.',
    },
    tradeoff: {
      gain:
        'Fetching ahead and separating addressing from execution keep the bus busy while the EU works, so straight-line instruction streams run faster without a higher clock.',
      cost:
        'The queue adds complexity, branches waste prefetched bytes, and segmentation forces programmers to manage segment registers and 64 KB limits.',
      verdict:
        'The design was a practical bridge between 8-bit machines and flat 32-bit addressing; later processors kept its registers, flags, and modes for compatibility.',
    },
    terms: [
      {
        term: 'Microprocessor',
        definition:
          'A single integrated circuit that fetches, decodes, and executes instructions and controls the main operations of a computer.',
      },
      {
        term: 'Physical address',
        definition:
          'The actual address placed on the memory bus, formed on the 8086 by multiplying the segment value by 10h and adding the offset.',
      },
    ],
    keyTakeaways: [
      'The BIU fetches instructions and addresses memory while the EU decodes and executes, so the two stages overlap.',
      'Fourteen 16-bit registers hold data, pointers, indexes, segment bases, the instruction pointer, and flags.',
      'Physical address = segment x 10h + offset, and many segment:offset pairs map to the same byte.',
      'The 8088 has an 8-bit external bus; later chips added protected mode, 32-bit addressing, caches, and superscalar execution.',
    ],
    pitfalls: [
      'A segment register holds a physical address. It holds the base divided by 16; the processor shifts it left before adding the offset.',
      'Pipelining doubles execution speed. Fetch and execute overlap, but branches flush the queue and memory waits still cost cycles.',
      'The 8088 is an 8-bit processor. It has an 8-bit external bus, but its internal architecture and registers are 16-bit.',
    ],
    focusPoints: [
      'Trace an instruction from the BIU queue to the EU.',
      'Convert a segment:offset pair into a 20-bit physical address.',
      'Match each generation with its key advance: protected mode, 32 bits, cache and FPU, superscalar.',
    ],
    quiz: [
      {
        question: 'CS = 2000h and IP = 0030h. From which physical address does the 8086 fetch the next instruction?',
        options: ['20030h', '20003h', '20300h', '23000h'],
        answer: 0,
        explanation:
          'Shift the segment: 2000h x 10h = 20000h. Add the offset: 20000h + 0030h = 20030h. Forgetting the shift or reversing the digits produces the other options.',
      },
      {
        question: 'Which feature was introduced with the 80286?',
        options: [
          '32-bit general-purpose registers',
          'Protected mode with descriptor tables',
          'Superscalar dual pipelines',
          'A 64-bit external data bus',
        ],
        answer: 1,
        explanation:
          'The 80286 added protected mode, privilege levels, and a 24-bit address bus for 16 MB. The 80386 introduced 32-bit registers, while dual pipelines and a 64-bit external bus belong to the Pentium.',
      },
    ],
  },
  {
    chapterId: 'computer-software',
    hook: 'A computer with perfect hardware and no software is an expensive heater. Software turns transistors into a tool.',
    plainEnglish:
      'Software is the set of instructions and data that tells a computer what to do, from the operating system that starts the machine to the app where you type a letter.',
    oneIdea:
      'Software is layered: system software runs the machine, application software does user work, and translators turn human-readable code into machine instructions.',
    whyItMatters:
      'Every program you run depends on this stack. Knowing the layers explains why an app fails on one computer but works on another, and why a licence can matter as much as the code.',
    objectives: [
      'Separate system software from application software and place utilities correctly.',
      'Compare machine, assembly, and high-level languages.',
      'Explain what a compiler, an interpreter, and an assembler each do.',
      'Write a simple algorithm, read a flowchart, and choose an appropriate software licence.',
    ],
    sections: [
      {
        title: 'System software and application software',
        body: 'Software is divided by purpose. System software runs and manages the computer itself. It includes the operating system, device drivers, utility programs, and language translators. Application software helps a user complete a task: writing a report, editing a photo, browsing the web, or managing accounts. A word processor is application software even though it relies on the operating system for files and printing. The same program can blur the line. A backup tool is a utility when it protects the whole system, but a backup feature inside an accounting app serves that application. General-purpose applications are sold to many users; tailor-made or custom software is written for one organization. Firmware is a third case: software stored in read-only memory that starts hardware before the operating system loads, such as a BIOS chip. Both kinds are stored as files and loaded into memory before they run. The practical test is simple: does it primarily manage the machine, or does it primarily do work for the user?',
        code: 'SYSTEM SOFTWARE                      APPLICATION SOFTWARE\nOperating system: Windows, Linux      Word processor: Word, Writer\nDevice drivers: printer, graphics     Spreadsheet: Excel, Calc\nUtilities: backup, antivirus          Browser: Chrome, Firefox\nTranslators: compiler, assembler      Media player, games',
      },
      {
        title: 'The operating system and utility programs',
        body: 'An operating system is the master control program. It schedules processes on the CPU, allocates memory, organizes files, talks to devices through drivers, and provides a user interface. A process is a running program with its own memory and state; a driver is software that lets the operating system control a specific device. The operating system also enforces access rights and reports errors. Those functions are enough for this chapter; detailed scheduling and virtual memory, where disk space extends RAM, belong to a dedicated operating-system course. Utility programs are small tools that maintain, protect, or repair a system. Examples include backup software, antivirus scanners, disk cleanup tools, file compression, partition managers, and password managers. Some utilities ship with the operating system; others are separate products. A utility differs from an application because its job is to keep the computer healthy or its data safe, not to produce a letter or a budget. A disk defragmenter, for instance, rearranges file blocks on a magnetic disk to reduce seeking; it is not a tool for writing documents. Keep utilities updated, because they often run with high privilege.',
      },
      {
        title: 'Machine, assembly, and high-level languages',
        body: 'A programming language is a notation for writing instructions. Machine language is the binary instruction set of a particular processor. Each instruction is a pattern of bits, and the CPU executes it directly. It is fast and needs no translation, but it is hard to read and differs between processors. Assembly language replaces bit patterns with short mnemonics such as MOV, ADD, and JMP, and with register names such as AX. A mnemonic is a short memory aid for an instruction. One assembly statement usually maps to one machine instruction. It is still architecture-specific, so an 8086 program does not run unchanged on an ARM phone. High-level languages use English-like statements, variables, loops, and functions. A variable is a named storage location, a loop repeats steps, and a function groups reusable logic. C, Python, Java, and COBOL are examples. They hide registers and memory addresses, which makes programs portable and easier to maintain. A high-level program must be translated before the CPU can run it. The trade-off is control versus convenience: assembly gives exact hardware control, while high-level code gives faster development and portability.',
      },
      {
        title: 'Translators: compiler, interpreter, assembler',
        body: 'A translator converts source code, the text a programmer writes, into a form the machine can run. An assembler translates assembly language into machine code, usually producing an object file that a linker combines with libraries to make an executable. A compiler translates a whole high-level program before it runs. It checks syntax and data types, reports errors, and produces object code or an executable. Syntax is the set of grammar rules for the language; a data type defines what kind of value a variable may hold. Because translation happens once, the compiled program usually runs fast, but it must be rebuilt for each operating system and processor family. An interpreter translates and executes one statement or expression at a time. It needs the interpreter installed on every machine, stops at the first error, and is often slower, but it supports quick testing and interactive work. Python and JavaScript commonly use interpreters or just-in-time compilers. A just-in-time compiler translates hot code during execution. Neither compiler nor interpreter guarantees correct logic; both only enforce the rules of the language.',
      },
      {
        title: 'Algorithms and flowcharts',
        body: 'An algorithm is a finite, ordered set of unambiguous steps that solves a problem. It must be finite, meaning it ends; definite, meaning each step has one clear meaning; effective, meaning each step can be carried out; and it must accept input and produce output. Pseudocode is structured English that looks like code but ignores language details. A flowchart is a diagram of an algorithm. An oval marks start or end, a parallelogram marks input or output, a rectangle marks a process or assignment, a diamond marks a decision, and arrows show the flow. An assignment stores a value in a variable; a decision is a condition with two or more exits. For example, an algorithm to average three marks reads A, B, and C, computes total = A + B + C, then average = total / 3, and prints the average. With 72, 85, and 91, the total is 248 and the average is 82.67. A decision uses a condition such as average >= 40 to choose Pass or Fail. Draw the flowchart before coding when the logic is complex; it exposes missing cases early.',
      },
      {
        title: 'Software licences',
        body: 'A software licence is the legal agreement that says how a program may be used, copied, modified, and distributed. Proprietary software keeps its source code private and is sold under an end-user licence agreement, or EULA. The licence may limit the number of devices or users, and a site licence covers an organization. Freeware is free to use but usually closed-source; shareware is tried before purchase and may expire. Open-source software publishes its source under a licence such as MIT, Apache 2.0, or the GNU General Public License. A permissive licence allows reuse in closed products with attribution, meaning credit to the original author. A copyleft licence requires derivative works to keep the same freedoms and release their source. Public-domain software has no copyright restrictions. Free software is about freedom to study, change, and share, not about price. A subscription, or SaaS, licence rents access and stops when payment stops. Always check the licence before copying software between machines or into a commercial product.',
      },
    ],
    example: {
      title: 'From an algorithm to a licensed lab program',
      scenario:
        'A teacher needs a program that reads three marks and prints the average on 40 lab computers. Python is not installed, and the teacher hopes to share the source with other schools.',
      steps: [
        {
          action:
            'Write the algorithm and test it by hand: read A, B, and C; total = A + B + C; average = total / 3; print average. With 72, 85, and 91, total = 248 and average = 82.67.',
          result:
            'The logic is correct and language-independent, so it can be implemented in C, Python, or any other language.',
        },
        {
          action:
            'Implement the algorithm in C and compile it with GCC into a native executable for the lab machines. A compiled program does not need the C compiler or a Python interpreter at run time.',
          result:
            'Each of the 40 computers can run the program directly, with no extra runtime installation.',
        },
        {
          action:
            'Choose a licence before sharing. Release the source under the GNU GPL if other schools may modify and redistribute it, or keep it proprietary if the source must stay private.',
          result:
            'The licence matches the sharing goal, and the school avoids copying code without permission.',
        },
      ],
      conclusion:
        'The algorithm is the language-independent logic, the translator decides how it runs, and the licence decides who may use or share it. Decide all three before distribution.',
    },
    tradeoff: {
      gain:
        'Layers and translators let one high-level program reach many machines, while reusable system software saves every app from rewriting device code.',
      cost:
        'Each layer adds memory, startup time, and another component to patch; translators and licences can also lock a team to one platform or vendor.',
      verdict:
        'Use high-level languages and standard system software for most work, keep licences visible, and drop to assembly only where hardware control or size truly demands it.',
    },
    terms: [
      {
        term: 'Algorithm',
        definition:
          'A finite, ordered set of unambiguous steps that solves a problem and produces a result.',
      },
      {
        term: 'Compiler',
        definition:
          'A translator that converts an entire high-level source program into object code or an executable before the program runs.',
      },
    ],
    keyTakeaways: [
      'System software runs the machine; application software does user work; utilities maintain and protect the system.',
      'Machine code is binary, assembly uses mnemonics, and high-level languages use portable, readable statements.',
      'A compiler translates a whole program, an interpreter runs it step by step, and an assembler translates assembly.',
      'An algorithm is a finite, definite sequence of steps; a licence controls copying, modification, and distribution.',
    ],
    pitfalls: [
      'Freeware means open source. Freeware is free of charge but may keep its source closed; open source guarantees access to source under a licence.',
      'An interpreter is always worse than a compiler. Interpreters speed up development and interactive use; compilers speed up execution. The right choice depends on the task.',
      'An algorithm is the same as a program. An algorithm is the logic; a program is one implementation in a particular language, with syntax and platform details.',
    ],
    focusPoints: [
      'Classify a program as system or application software.',
      'Trace source code through the correct translator to an executable.',
      'Draw a flowchart with the right symbol for input, process, and decision.',
    ],
    quiz: [
      {
        question: 'Which tool translates assembly language into machine code?',
        options: ['Compiler', 'Interpreter', 'Assembler', 'Linker'],
        answer: 2,
        explanation:
          'An assembler converts mnemonics and register names into machine instructions. A compiler handles a high-level language, an interpreter executes code step by step, and a linker joins object files and libraries.',
      },
      {
        question: 'Which licence requires modified versions to be released under the same terms?',
        options: ['Freeware', 'Shareware', 'MIT licence', 'GNU General Public License'],
        answer: 3,
        explanation:
          'The GPL is a copyleft licence: derivative works must keep the same freedoms and provide source. MIT is permissive, while freeware and shareware describe price and trial terms, not source-sharing duties.',
      },
    ],
  },
  {
    chapterId: 'ms-office',
    hook: 'The same Office file can be a polished report, a working model, or a security incident. The difference is how well you use the features and the settings.',
    plainEnglish:
      'MS Office is a group of programs for documents, spreadsheets, presentations, email, and databases, all sharing common file formats and interface habits.',
    oneIdea:
      'Each Office app stores structured content, so styles, formulas, masters, and references let you change many items at once instead of editing each one by hand.',
    whyItMatters:
      'Office skills appear in almost every office job and exam. Accurate formulas, clean formatting, and safe handling of macros and links save hours and prevent costly mistakes.',
    objectives: [
      'Format Word documents with styles, tables, references, and mail merge.',
      'Build Excel formulas with relative and absolute references, then summarize data with charts and pivot tables.',
      'Apply PowerPoint masters, transitions, and animations without distracting the audience.',
      'Use Access and Outlook basics, common formats, shortcuts, and safe document practices.',
    ],
    sections: [
      {
        title: 'Word: formatting, styles, and tables',
        body: 'Word is a word processor. Character formatting changes a run of text: font, size, bold, italic, color, and highlight. Paragraph formatting controls alignment, line spacing, indents, and space before or after. Direct formatting applies to the selected text only. A style is a named bundle of formatting; applying Heading 1 sets the font, size, spacing, and outline level in one step. Styles keep a long document consistent, feed the navigation pane, and let the table of contents update automatically. Modify the style once and every heading changes. A table arranges text in rows and columns. Use a header row, banded rows for readability, and merged cells sparingly because they complicate sorting and accessibility. Table tools add borders, shading, and simple formulas. For a report, set the page size and margins first, apply styles to headings and body text, insert captions for figures, and save as .docx. Avoid pressing Enter repeatedly to create space; use paragraph spacing instead.',
      },
      {
        title: 'References and mail merge',
        body: 'References make a long document navigable and credible. A table of contents is generated from heading styles and can be refreshed after edits. Footnotes appear at the bottom of a page; endnotes sit at the end of the document. Citations mark a source in the text, and a bibliography lists the full details in a chosen style such as APA. Captions label figures and tables, and cross-references point to a numbered item and update when it moves. Mail merge produces many personalized copies from one template. It needs a main document with fixed text and merge fields, plus a data source such as an Excel sheet. For 120 parents, the letter might read: "Dear «Name», your child in «Class» has a balance of «Balance»." Insert the fields, preview a few records, filter out zero balances, then finish the merge to print, PDF, or email. Always check the record count and spot-check three letters before sending. A merge field is a placeholder that pulls one column value from the data source.',
      },
      {
        title: 'Excel: cells, formulas, functions, references',
        body: 'An Excel workbook contains worksheets, and each worksheet is a grid of cells. A cell address combines a column letter and a row number, such as B2. A range is a rectangle of cells, written B2:D11. Every formula starts with = and can use operators for addition, subtraction, multiplication, division, and exponentiation. A function is a built-in formula with a name, such as SUM, AVERAGE, COUNT, IF, or SUMIF. Relative references such as B2 adjust when a formula is copied. Absolute references such as $B$2 stay fixed; the dollar signs lock the column, the row, or both. Mixed references lock only one part. For a price list, put the tax rate in $B$1 and use =C2*$B$1, then fill down. With B2 = 250 and C2 = 4, =B2*C2 returns 1,000. Errors have meanings: #DIV/0! divides by zero, #REF! points to a deleted cell, and #VALUE! uses text where a number is required. Press F4 to cycle through reference types while editing.',
        code: 'D2:  =B2*C2\nD12: =SUM(D2:D11)\nE2:  =IF(D12>=40,"Pass","Fail")\nF2:  =$B$2*C2',
      },
      {
        title: 'Excel: charts, sorting, filtering, and pivot tables',
        body: 'A chart turns numbers into a picture, but the chart type must match the question. A column chart compares categories, a line chart shows a trend over time, a pie chart shows parts of one whole and works best with a few slices, and a scatter chart shows the relationship between two numeric variables. Select the data and labels before inserting the chart, then add a clear title, axis labels, and a legend, the key that maps colors or patterns to data series. Sorting rearranges rows by one or more keys; filtering hides rows that fail a condition without deleting them. Use AutoFilter for simple conditions and a pivot table for summaries. A pivot table has rows, columns, values, and filters. Drag Region to rows, Product to columns, and Sales to values to see a cross-tab, a summary table of totals. With 6,000 sales rows, a pivot table can show totals by region and product in seconds. Refresh the pivot after the source data changes. Keep the raw data on its own sheet and never type totals into it.',
      },
      {
        title: 'PowerPoint: slides, masters, transitions, animations',
        body: 'PowerPoint builds a presentation from slides. A slide layout places placeholders for a title, text, pictures, and charts; using layouts keeps spacing consistent. The Slide Master controls the theme, fonts, colors, background, logo, and footer for every slide that uses it. A theme is a coordinated set of fonts, colors, and effects. Edit the master once instead of fixing each slide. Transitions are effects between slides, such as Fade or Push. Animations are effects on objects inside a slide, such as Appear, Fly In, or a motion path. Use transitions and animations to guide attention, not to decorate. A single subtle transition and one entrance animation per key point are usually enough. The Animation Pane lets you set start timing, duration, and order. Presenter View shows your notes and the next slide on your screen while the audience sees only the slide. Add alt text, a description for screen readers, to images and check the reading order. Save as .pptx; use .pptm only when the file contains macros.',
      },
      {
        title: 'Access, Outlook, formats, shortcuts, and safety',
        body: 'Access is a relational database program, meaning it stores data in related tables. A table holds records in fields, a query answers a question with criteria, a form provides a controlled data-entry screen, and a report produces printable output. Outlook handles email, calendar, contacts, and tasks. Use folders and rules, automatic sorting instructions, to sort incoming mail, and set an out-of-office reply before a holiday. Common formats include .docx for Word, .xlsx for Excel, .pptx for PowerPoint, .accdb for Access, .pdf for fixed-layout sharing, and .csv for plain tabular data. Macro-enabled files use .docm, .xlsm, or .pptm. Documents can carry risk. A macro is a small program that can run automatically, so enable macros only from trusted sources. Protected View opens downloaded files in a restricted mode. Password protection can restrict opening or editing, but a weak password can be cracked, and it does not replace access control or backups. Remove hidden metadata and use true redaction before sharing. Keep backups and version history.',
        code: 'Ctrl+S          Save\nCtrl+Z / Ctrl+Y Undo / Redo\nCtrl+F          Find\nCtrl+H          Replace\nCtrl+B/I/U      Bold / Italic / Underline\nF2              Edit the active cell (Excel)\nF4              Toggle absolute/relative reference (Excel)\nCtrl+Shift+L    Turn filters on or off (Excel)\nAlt+=           AutoSum (Excel)\nF5              Start a slideshow (PowerPoint)\nShift+F5        Start from the current slide\nCtrl+M          New slide (PowerPoint)',
      },
    ],
    example: {
      title: 'Mailing 120 fee statements with Word and Excel',
      scenario:
        'A school must send fee statements to parents. An Excel sheet holds 120 rows with name, class, and balance. Only families with a balance above zero should receive a letter, and the output must be a PDF for email.',
      steps: [
        {
          action:
            'Clean the data source: one header row with Name, Class, and Balance; no blank rows; 120 records; Balance stored as a number in currency format.',
          result:
            'Word can read every row predictably, and no parent is skipped because of a stray blank or a text value in the amount column.',
        },
        {
          action:
            'Build the Word main document with fixed text and the merge fields «Name», «Class», and «Balance». Preview three records and filter Balance greater than 0.',
          result:
            'The preview shows correct names and amounts, and the filter reduces the 120 records to the 84 families who owe money.',
        },
        {
          action:
            'Finish the merge to PDF, confirm the output contains 84 letters, and spot-check three for name, amount, and page breaks.',
          result:
            'The batch is complete and accurate; the unused 36 zero-balance records never produce letters.',
        },
      ],
      conclusion:
        'Mail merge is a join between a template and a clean table. Clean the data, preview the fields, filter the records, and count the output before sending.',
    },
    tradeoff: {
      gain:
        'Styles, formulas, masters, and mail merge replace repetitive manual work with one controlled change that propagates everywhere.',
      cost:
        'The same automation can spread an error everywhere; broken references, wrong ranges, or a malicious macro can damage many documents at once.',
      verdict:
        'Use styles, named ranges, and masters for consistency, verify formulas and merged output, and treat macros and external links as untrusted until checked.',
    },
    terms: [
      {
        term: 'Style',
        definition:
          'A named set of formatting choices that can be applied to text or objects and updated in one place.',
      },
      {
        term: 'Absolute reference',
        definition:
          'A cell reference such as $B$2 that stays fixed when a formula is copied to another cell.',
      },
    ],
    keyTakeaways: [
      'Word styles drive consistent formatting, navigation, and automatic tables of contents.',
      'Excel formulas use relative references that move and absolute references that stay fixed; functions such as SUM and IF do the work.',
      'Charts answer a question, and pivot tables summarize thousands of rows without changing the source.',
      'Masters control presentation-wide design; macros and external links are the main document-safety risks.',
    ],
    pitfalls: [
      'A black highlight is redaction. Real redaction removes the underlying text; black boxes or hidden columns can often be recovered.',
      'Absolute references are always better. Use relative references for rows that should move; lock only the part that must stay fixed.',
      'A pivot table updates itself. Pivot tables cache their source; press Refresh after changing the data.',
    ],
    focusPoints: [
      'Apply a style and update it once to change every heading.',
      'Choose relative, absolute, or mixed references for a fill-down formula.',
      'Merge a filtered data source and verify the record count.',
    ],
    quiz: [
      {
        question: 'In Excel, what happens to the reference $B$2 when a formula is copied from D2 to D3?',
        options: ['It becomes $B$3', 'It stays $B$2', 'It becomes C2', 'It becomes B3'],
        answer: 1,
        explanation:
          'The dollar signs lock both the column and the row, so an absolute reference does not shift when copied. A relative reference such as B2 would become B3.',
      },
      {
        question: 'Which Word feature produces 120 personalized letters from one template and an Excel list?',
        options: ['Mail merge', 'Macro', 'Pivot table', 'Slide master'],
        answer: 0,
        explanation:
          'Mail merge combines a main document with a data source and replaces merge fields for each record. A macro automates commands, a pivot table summarizes spreadsheet data, and a slide master controls presentation design.',
      },
    ],
  },
];
