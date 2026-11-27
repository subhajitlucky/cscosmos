import type { ITLesson } from './types';

export const part3Lessons: ITLesson[] = [
  {
    chapterId: 'microprocessors',
    intro:
      'The 8086 is a 16-bit microprocessor with a 20-bit address bus, fourteen 16-bit registers and separate bus interface and execution units. The 8088 keeps the same core but uses an 8-bit external data bus. These notes cover the programming model, flags, segment arithmetic, prefetch queue and the 80286-to-Pentium advances that exam questions target.',
    sections: [
      {
        title: 'BIU and EU',
        bullets: [
          'The bus interface unit (BIU) talks to memory and I/O: it fetches instructions and operands, computes 20-bit physical addresses and fills the instruction queue.',
          'The BIU holds CS, DS, SS, ES and IP; the queue is 6 bytes on the 8086 and 4 bytes on the 8088.',
          'The execution unit (EU) decodes and executes instructions; it contains the ALU, the general-purpose registers and FLAGS.',
          'The EU has no direct memory path; it requests operands from the BIU and takes prefetched bytes from the queue.',
          'Fetch and execute overlap: while the EU executes one instruction, the BIU fetches the next.',
          'A jump, call or return discards the queue, so a control transfer pays a refill penalty.',
        ],
      },
      {
        title: 'Register set',
        body: 'All 8086 registers are 16 bits wide. AX to DX can each be split into two 8-bit halves, written as AH/AL, BH/BL, CH/CL and DH/DL.',
        bullets: [
          'Fourteen 16-bit registers: AX, BX, CX, DX; SP, BP; SI, DI; CS, DS, SS, ES; IP; FLAGS.',
          'AX is the accumulator, BX a base register, CX the loop and shift counter, and DX data plus the high half of products and I/O port numbers.',
          'SP points to the stack top, BP addresses data on the stack, SI is the source index and DI the destination index for string moves.',
          'CS:IP addresses the next instruction, SS:SP the stack top, DS:BX or DS:SI data, and ES:DI extra data.',
          'The stack is last-in, first-out (LIFO); PUSH, POP, CALL and RET use it.',
        ],
        table: {
          caption: '8086 register set',
          headers: ['Register', 'Name', 'Function'],
          rows: [
            ['AX', 'Accumulator', 'Arithmetic, logic, string and I/O operations; AH/AL halves'],
            ['BX', 'Base', 'Memory addressing; BH/BL halves'],
            ['CX', 'Count', 'Loop counter and shift/rotate count; CH/CL halves'],
            ['DX', 'Data', 'Data, high half of multiply/divide, I/O port number; DH/DL halves'],
            ['SP', 'Stack pointer', 'Offset of the current stack top'],
            ['BP', 'Base pointer', 'Offset for data stored on the stack'],
            ['SI', 'Source index', 'Source pointer for string and block moves'],
            ['DI', 'Destination index', 'Destination pointer for string and block moves'],
            ['CS', 'Code segment', 'Base of the current code segment'],
            ['DS', 'Data segment', 'Base of the default data segment'],
            ['SS', 'Stack segment', 'Base of the stack segment'],
            ['ES', 'Extra segment', 'Base of an additional data segment'],
            ['IP', 'Instruction pointer', 'Offset of the next instruction; used as CS:IP'],
            ['FLAGS', 'Status/control', 'Result status bits plus control bits'],
          ],
        },
      },
      {
        title: 'Flags',
        bullets: [
          'CF (carry): set when an unsigned result carries out of the most significant bit or borrows.',
          'PF (parity): set when the low byte of the result contains an even number of 1 bits.',
          'AF (auxiliary carry): set on a carry from bit 3 to bit 4; used by BCD arithmetic.',
          'ZF (zero): set when the result is zero.',
          'SF (sign): copy of the most significant bit; set for a negative signed result.',
          'OF (overflow): set when a signed result does not fit in the destination.',
          'TF, IF and DF are control flags: trap/single-step, interrupt enable and string direction.',
        ],
        code: 'MOV AX, 0FFFFh\nADD AX, 0001h\n; AX = 0000h, CF = 1, AF = 1, ZF = 1, PF = 1, SF = 0, OF = 0',
      },
      {
        title: 'Segmentation and physical address',
        bullets: [
          'The 8086 has 1 MB (2^20 bytes) of address space but only 16-bit registers, so memory is divided into overlapping segments of up to 64 KB.',
          'A segment register stores the segment base divided by 16; the processor shifts it left 4 bits (multiplies by 10h) and adds the 16-bit offset.',
          'Standard pairs: CS:IP for instructions, SS:SP for the stack, DS:BX or DS:SI for data, and ES:DI for extra data.',
          'Different segment:offset pairs can name the same byte, so the 20-bit physical address is the unique value.',
          'The 8086 has no protected mode or memory protection; any program can write any address.',
        ],
        code: 'Physical address = (segment x 10h) + offset\n\nCS = 348Ah, IP = 4214h\n348Ah x 10h = 348A0h\n348A0h + 4214h = 38AB4h\n38AB4h = 3x65536 + 8x4096 + 10x256 + 11x16 + 4 = 232,116\n\nCheck: 3800h:0AB4h -> 38000h + 0AB4h = 38AB4h',
      },
      {
        title: 'Pipelining and the 8088 bus',
        bullets: [
          'Pipelining overlaps instruction fetch with execution; the BIU prefetches ahead while the EU works.',
          'The queue holds 6 bytes on the 8086 and 4 bytes on the 8088, roughly two or three instructions.',
          'Straight-line code keeps the queue full; a taken branch flushes it and forces a fresh fetch.',
          'The 8088 is internally 16-bit but has an 8-bit external data bus, so a 16-bit transfer takes two bus cycles.',
          'The narrower bus allowed cheaper 8-bit support chips, which is why IBM used the 8088 in the 1981 PC.',
          'A bus cycle is one complete transfer over the address, data and control lines; wait states extend it.',
        ],
      },
      {
        title: '80286 to Pentium',
        bullets: [
          '80286 (1982): 24-bit address bus, 16 MB, protected mode, descriptor tables and virtual memory; real mode keeps 8086 compatibility.',
          '80386DX (1985): 32-bit registers, ALU, data bus and address bus; 4 GB, paging and virtual 8086 mode.',
          '80386SX: 32-bit internal core with a 16-bit external data bus and a 24-bit address bus (16 MB).',
          '80486 (1989): integrated floating-point unit, 8 KB on-chip cache and pipelined execution.',
          'Pentium (1993): superscalar U and V integer pipelines, 64-bit external data bus, split 8 KB caches and branch prediction.',
        ],
        table: {
          caption: 'Generation milestones',
          headers: ['CPU', 'Year', 'Address space', 'Key addition'],
          rows: [
            ['8086', '1978', '20-bit, 1 MB', '16-bit data bus, 6-byte queue'],
            ['8088', '1979', '20-bit, 1 MB', '8-bit external data bus, 4-byte queue'],
            ['80286', '1982', '24-bit, 16 MB', 'Protected mode, descriptor tables'],
            ['80386DX', '1985', '32-bit, 4 GB', '32-bit registers, paging'],
            ['80486', '1989', '32-bit, 4 GB', 'Integrated FPU, 8 KB cache'],
            ['Pentium', '1993', '32-bit, 4 GB', 'Superscalar dual pipelines'],
          ],
        },
      },
    ],
    examPoints: [
      'BIU fetches and addresses; EU decodes and executes; the EU never reads memory directly.',
      'The 8086 has fourteen 16-bit registers: AX-DX, SP, BP, SI, DI, CS-ES, IP and FLAGS.',
      'Physical address = segment x 10h + offset, giving a 20-bit address in a 1 MB space.',
      'CF, ZF, SF, OF, PF and AF are status flags; TF, IF and DF are control flags.',
      '8086 queue = 6 bytes, 8088 queue = 4 bytes, and the 8088 has an 8-bit external data bus.',
      '80286 added protected mode, 80386 32-bit addressing, 80486 an FPU and cache, Pentium superscalar execution.',
    ],
    keyTerms: [
      {
        term: 'Bus interface unit',
        definition:
          'The 8086 unit that fetches instructions and operands, computes 20-bit physical addresses and fills the instruction queue.',
      },
      {
        term: 'Physical address',
        definition:
          'The actual 20-bit address placed on the memory bus, calculated as segment x 10h + offset.',
      },
      {
        term: 'Superscalar',
        definition:
          'A processor design that can issue more than one instruction per clock cycle through multiple pipelines, as the Pentium does with its U and V pipes.',
      },
    ],
    quiz: [
      {
        question: 'CS = 2000h and IP = 0030h. From which physical address does the 8086 fetch the next instruction?',
        options: ['20030h', '20003h', '20300h', '23000h'],
        answer: 0,
        explanation:
          'Shift the segment: 2000h x 10h = 20000h. Add the offset: 20000h + 0030h = 20030h. Omitting the shift or reversing the digits produces the other options.',
      },
      {
        question: 'Which processor introduced protected mode with descriptor tables?',
        options: ['8088', '80286', '80386DX', 'Pentium'],
        answer: 1,
        explanation:
          'The 80286 added protected mode, privilege levels and a 24-bit address bus. The 80386 introduced 32-bit registers, while superscalar execution belongs to the Pentium.',
      },
    ],
  },
  {
    chapterId: 'computer-software',
    intro:
      'Software is the set of instructions and data that a computer executes. System software manages the machine and its resources; application software performs tasks for the user; translators convert source code into machine instructions. These notes cover software categories, utilities and device drivers, language levels, compiler-interpreter-assembler differences, algorithm and flowchart notation, and software licences.',
    sections: [
      {
        title: 'System vs application software',
        bullets: [
          'System software manages hardware, provides services and supports other programs; application software performs tasks for the end user.',
          'System software includes the operating system (one category), device drivers, utility programs and language translators.',
          'Application software is general-purpose (Word, Excel, browsers, games) or tailor-made for one organization.',
          'Firmware is software stored in ROM, such as BIOS or UEFI, that initializes hardware before the operating system loads.',
          'Classification test: managing the machine points to system software; doing user work points to application software.',
        ],
        table: {
          caption: 'System software vs application software',
          headers: ['Aspect', 'System software', 'Application software'],
          rows: [
            ['Role', 'Manages hardware and provides services', 'Performs a user task or business function'],
            ['Examples', 'Operating system, drivers, utilities, translators', 'Word, Excel, browser, media player, games'],
            ['Depends on', 'The hardware', 'System software and its services'],
            ['Typical user', 'System or administrator', 'End user'],
          ],
        },
      },
      {
        title: 'Utilities and device drivers',
        bullets: [
          'A utility is a small maintenance, protection or repair program: backup, antivirus, disk cleanup, compression, partition manager or defragmenter.',
          'A device driver is software that lets the operating system communicate with and control a specific device such as a printer, graphics card or scanner.',
          'Drivers translate general operating-system commands into device-specific signals and are usually supplied by the device vendor.',
          'Utilities may ship with the operating system or as separate products, and they often run with elevated privilege, so keep them updated.',
          'A defragmenter rearranges blocks on a magnetic disk to reduce seek time; it does not create or format documents.',
          'Utility vs application: a utility protects system health or data; an application produces user output such as a letter or budget.',
        ],
      },
      {
        title: 'Language levels',
        bullets: [
          'Machine language is the processor binary instruction set; each opcode is a bit pattern executed directly, and it differs by CPU family.',
          'Assembly language replaces opcodes with mnemonics such as MOV, ADD and JMP and uses register names such as AX.',
          'One assembly statement usually maps to one machine instruction, so assembly remains architecture-specific.',
          'High-level languages use variables, expressions, loops and functions; C, Python, Java and COBOL are examples.',
          'High-level code hides registers and addresses, giving portability and faster development; assembly gives exact hardware control.',
          'Source code is the text a programmer writes; it must be translated into machine code before the CPU can execute it.',
        ],
      },
      {
        title: 'Compiler, interpreter, assembler',
        bullets: [
          'An assembler translates assembly mnemonics into machine code, usually producing an object file.',
          'A linker combines object files and library routines into a single executable.',
          'A compiler scans the whole high-level program, reports syntax and type errors, and produces object code or an executable before run time.',
          'An interpreter translates and executes one statement at a time, stops at the first error and must be present at run time.',
          'Compiled code usually runs faster; interpreted code supports quicker testing and interactive use; a JIT compiler translates hot code during execution.',
          'Translators enforce syntax, not logic: a program with correct syntax can still produce wrong results.',
        ],
        table: {
          caption: 'Translator comparison',
          headers: ['Translator', 'Input', 'Output', 'When it runs', 'Error reporting'],
          rows: [
            ['Assembler', 'Assembly source', 'Object file / machine code', 'Before execution; then linked', 'After scanning the file'],
            ['Compiler', 'High-level source', 'Object code or executable', 'Before execution', 'After scanning the whole program'],
            ['Interpreter', 'High-level source', 'No separate output file', 'Statement by statement', 'Stops at the first error'],
          ],
        },
      },
      {
        title: 'Algorithms and flowcharts',
        bullets: [
          'An algorithm is a finite, ordered set of unambiguous steps that solves a problem.',
          'Required properties: finite (terminates), definite (one meaning per step), effective (each step is executable), with input and output.',
          'Pseudocode expresses the logic in structured English without language syntax.',
          'Flowchart symbols: oval = start/end, parallelogram = input/output, rectangle = process, diamond = decision, arrows = flow.',
          'Average of three marks: read A, B, C; total = A + B + C; average = total / 3; print average; 72, 85 and 91 give 248 and 82.67.',
          'A decision such as average >= 40 selects Pass or Fail; draw the flowchart before coding to expose missing cases.',
        ],
      },
      {
        title: 'Software licences',
        bullets: [
          'A software licence states how a program may be used, copied, modified and distributed.',
          'Proprietary software is closed-source and sold under an end-user licence agreement (EULA); limits may be per device, per user or a site licence.',
          'Freeware is free of charge but may stay closed-source; shareware is tried before purchase and may expire.',
          'Open-source licences publish source code: MIT and Apache 2.0 are permissive; the GNU GPL is copyleft.',
          'Permissive licences allow closed derivative products with attribution; copyleft requires derivative works to keep the same freedoms and release source.',
          'Public-domain software has no copyright restrictions; subscription or SaaS licences rent access and end when payment stops.',
          'Free software means freedom to study, change and share, not zero price.',
        ],
      },
    ],
    examPoints: [
      'System software manages the machine and its services; application software performs user tasks.',
      'Utilities maintain, protect or repair the system; device drivers let the operating system control specific hardware.',
      'Machine language is binary and CPU-specific; assembly uses mnemonics; high-level languages use portable statements.',
      'Assembler: assembly to machine code. Compiler: whole program before execution. Interpreter: one statement at a time.',
      'An algorithm must be finite, definite and effective, and it must accept input and produce output.',
      'MIT and Apache are permissive; GPL is copyleft; freeware is free of charge but not necessarily open source.',
    ],
    keyTerms: [
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
      {
        term: 'Copyleft licence',
        definition:
          'An open-source licence, such as the GNU GPL, that requires modified or extended versions to be distributed under the same licence with source available.',
      },
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
          'The GPL is copyleft: derivative works must keep the same freedoms and provide source. MIT is permissive, while freeware and shareware describe price and trial terms, not source-sharing duties.',
      },
    ],
  },
  {
    chapterId: 'ms-office',
    intro:
      'MS Office combines Word, Excel, PowerPoint, Access and Outlook around shared file formats and interface conventions. Exam questions focus on styles, mail merge, cell references, formulas, charts, pivot tables, slide masters, database objects, shortcuts and document safety. These notes give the exact sequences, formulas and settings to reproduce in a practical test.',
    sections: [
      {
        title: 'Word: formatting, styles, tables',
        bullets: [
          'Character formatting changes font, size, bold, italic, underline, color or highlight for selected text.',
          'Paragraph formatting controls alignment, line spacing, indents and space before or after a paragraph.',
          'A style is a named bundle of formatting; applying Heading 1 sets font, size, spacing and outline level in one step.',
          'Modify a style once and every paragraph using it updates; styles also drive the navigation pane and table of contents.',
          'A table stores text in rows and columns; use a header row and banded rows, and merge cells sparingly because merged cells complicate sorting and accessibility.',
          'Save Word documents as .docx; use paragraph spacing instead of repeated Enter presses.',
        ],
      },
      {
        title: 'References and mail merge',
        bullets: [
          'A table of contents is generated from heading styles and must be updated after edits.',
          'A footnote appears at the bottom of its page; an endnote appears at the end of the document.',
          'A citation marks a source in the text; a bibliography lists full details in a style such as APA; captions label figures and tables; cross-references follow numbering.',
          'Mail merge combines a main document, a data source such as an Excel sheet, and merge fields.',
          'A merge field is a placeholder for one column value; preview records and apply filters before finishing the merge.',
          'Verify the record count and spot-check three letters before printing, exporting to PDF or sending email.',
        ],
        code: 'Mail-merge sequence\n1. Prepare the data source: one header row (Name, Class, Balance), no blank rows.\n2. Mailings -> Start Mail Merge -> Letters.\n3. Select Recipients -> Use an Existing List -> choose the Excel sheet.\n4. Insert merge fields: Name, Class, Balance.\n5. Preview Results; filter Balance > 0.\n6. Finish & Merge -> Print, PDF or Edit Individual Documents.\n7. Count the output and spot-check three letters.',
      },
      {
        title: 'Excel: formulas, functions, references',
        bullets: [
          'A workbook contains worksheets; each worksheet is a grid of cells; a cell address is a column letter plus a row number (B2), and a range is a rectangle (B2:D11).',
          'Every formula starts with = and uses operators +, -, *, / and ^; functions are named formulas such as SUM, AVERAGE, COUNT, IF and SUMIF.',
          'A relative reference (B2) changes when copied; an absolute reference ($B$2) stays fixed; a mixed reference ($B2 or B$2) locks only the column or row.',
          'Press F4 while editing to cycle relative, absolute and mixed reference forms.',
          'Common errors: #DIV/0! divides by zero, #REF! refers to a deleted cell, #VALUE! uses text where a number is required.',
          'Put a fixed tax rate in $C$2 and fill =D2*$C$2 down a column so every row uses the same rate.',
        ],
        code: '        A        B         C\n1     Price    Qty     Tax rate\n2      250      4        10%\n\nD2  =A2*B2          -> 1000\nE2  =D2*$C$2        -> 100\nF2  =SUM(D2:D11)    -> total of D2:D11\nG2  =IF(F2>=40,"Pass","Fail")',
      },
      {
        title: 'Charts, filters, pivot tables',
        bullets: [
          'Column charts compare categories; line charts show a trend over time; pie charts show parts of one whole with few slices; scatter charts show the relationship between two numeric variables.',
          'Select the data and labels first, then add a chart title, axis labels and a legend.',
          'Sorting reorders rows by one or more keys; filtering hides rows that fail a condition without deleting them.',
          'AutoFilter handles simple conditions; clearing the filter restores every row.',
          'A pivot table has rows, columns, values and filters; Region to rows, Product to columns and Sales to values produces a cross-tab of totals.',
          'A pivot table caches its source, so press Refresh after changing data; keep raw data on its own sheet and never type totals into it.',
        ],
      },
      {
        title: 'PowerPoint: slides, masters, motion',
        bullets: [
          'A slide layout places placeholders for title, text, pictures and charts and keeps spacing consistent.',
          'The Slide Master controls theme, fonts, colors, background, logo and footer for every slide that uses it.',
          'A theme is a coordinated set of fonts, colors and effects; edit the master once instead of fixing each slide.',
          'A transition is an effect between slides; an animation is an effect on an object inside a slide.',
          'The Animation Pane sets start timing, duration and order; use motion to guide attention, not decorate.',
          'Presenter View shows notes and the next slide on the presenter screen while the audience sees only the slide.',
          'Add alt text to images and check reading order; save as .pptx, and use .pptm only when the file contains macros.',
        ],
      },
      {
        title: 'Access, Outlook, shortcuts and safety',
        bullets: [
          'Access objects: table (records in fields), query (criteria-based answer), form (controlled data entry) and report (printable output); the file extension is .accdb.',
          'Outlook manages email, calendar, contacts and tasks; rules sort incoming mail automatically and an out-of-office reply covers absence.',
          'Common formats: .docx, .xlsx, .pptx, .accdb, .pdf and .csv; macro-enabled variants are .docm, .xlsm and .pptm.',
          'A macro is a small program that can run automatically; enable macros only from trusted sources, and open downloads in Protected View.',
          'Password protection restricts opening or editing but does not replace access control or backups; remove hidden metadata and use true redaction, not a black box.',
        ],
        table: {
          caption: 'Common Office shortcuts',
          headers: ['Shortcut', 'Action'],
          rows: [
            ['Ctrl+S', 'Save the current file'],
            ['Ctrl+Z / Ctrl+Y', 'Undo / redo'],
            ['Ctrl+F', 'Find'],
            ['Ctrl+H', 'Replace'],
            ['Ctrl+B / Ctrl+I / Ctrl+U', 'Bold / italic / underline'],
            ['F2', 'Edit the active cell (Excel)'],
            ['F4', 'Cycle reference type (Excel)'],
            ['Ctrl+Shift+L', 'Turn AutoFilter on or off (Excel)'],
            ['Alt+=', 'AutoSum (Excel)'],
            ['F5 / Shift+F5', 'Start slideshow / start from current slide (PowerPoint)'],
            ['Ctrl+M', 'New slide (PowerPoint)'],
          ],
        },
      },
    ],
    examPoints: [
      'A Word style is a named formatting bundle; editing the style updates every paragraph that uses it.',
      'Mail merge needs a main document, a data source and merge fields; preview and filter before merging.',
      'Relative references change when copied; absolute references ($B$2) stay fixed; F4 cycles reference types.',
      '=SUM(B2:B11) totals a range; =IF(condition, value_if_true, value_if_false) chooses between two results.',
      'Column charts compare categories, line charts show trends, and pie charts show parts of one whole.',
      'The Slide Master controls presentation-wide design; transitions act between slides, animations act on objects.',
    ],
    keyTerms: [
      {
        term: 'Style',
        definition:
          'A named set of formatting choices that can be applied to text or objects and updated in one place.',
      },
      {
        term: 'Absolute reference',
        definition:
          'A cell reference such as $B$2 that keeps both its column and row fixed when a formula is copied.',
      },
      {
        term: 'Slide Master',
        definition:
          'The top-level PowerPoint template that stores theme, fonts, colors, background, placeholders and footer settings for all slides that use it.',
      },
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
