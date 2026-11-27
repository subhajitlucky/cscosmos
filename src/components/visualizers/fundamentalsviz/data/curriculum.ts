export interface ITChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  summary: string;
  concepts: string[];
  prerequisites: string[];
  visualizerKey?: 'block' | 'numbers' | 'logic';
}

export const itChapters: ITChapter[] = [
  {
    id: 'computer-organization',
    number: 1,
    title: 'Computer Organization & Block Diagram',
    subtitle: 'Computer Organization and the Digital Computer',
    estimatedMinutes: 8,
    summary:
      'Functional units of a digital computer, the system bus, the instruction cycle, input/output and storage, and the micro, mini and mainframe classification.',
    concepts: [
      'Input, memory, ALU, control and output units',
      'Stored-program concept',
      'Address, data and control buses',
      'Fetch-decode-execute cycle',
      'Micro, mini, mainframe and supercomputer classes',
    ],
    prerequisites: [],
    visualizerKey: 'block',
  },
  {
    id: 'memory-storage',
    number: 2,
    title: 'Memory, Storage & Peripherals',
    subtitle: 'Memory and Storage Devices',
    estimatedMinutes: 8,
    summary:
      'The memory hierarchy, RAM and ROM families, cache and virtual memory, and the magnetic, optical and solid-state secondary storage used in exams.',
    concepts: [
      'Registers, cache, RAM and secondary storage',
      'SRAM, DRAM, PROM, EPROM and EEPROM',
      'Cache hits, locality and virtual memory',
      'Magnetic, optical and solid-state storage',
      'Input, output and peripheral devices',
    ],
    prerequisites: ['computer-organization'],
  },
  {
    id: 'number-systems',
    number: 3,
    title: 'Number Systems & Data Representation',
    subtitle: 'Representation of Data',
    estimatedMinutes: 8,
    summary:
      'Binary, octal, hexadecimal and BCD conversions, ASCII and EBCDIC codes, signed numbers, and arithmetic in non-decimal bases.',
    concepts: [
      'Positional notation and base conversion',
      'Binary, octal and hexadecimal arithmetic',
      'BCD and excess-3 representation',
      'Sign-magnitude, 1’s and 2’s complement',
      'ASCII, EBCDIC, Unicode, bits and bytes',
    ],
    prerequisites: ['computer-organization'],
    visualizerKey: 'numbers',
  },
  {
    id: 'boolean-algebra',
    number: 4,
    title: 'Boolean Algebra & Logic Circuits',
    subtitle: 'Boolean Algebra and Logic Circuits',
    estimatedMinutes: 8,
    summary:
      'Boolean laws and DeMorgan’s theorems, simplification, truth tables for the basic and derived gates, and the flip-flops, registers and accumulators built from them.',
    concepts: [
      'Boolean constants, variables and operations',
      'Laws, identities and DeMorgan’s theorems',
      'Truth tables and Karnaugh maps',
      'Basic and derived logic gates',
      'Flip-flops, registers and accumulators',
    ],
    prerequisites: ['number-systems'],
    visualizerKey: 'logic',
  },
  {
    id: 'microprocessors',
    number: 5,
    title: '8086/8088 & Microprocessor Families',
    subtitle: '8086/8088 Microprocessor Architecture',
    estimatedMinutes: 8,
    summary:
      'The 8086/8088 programming model, bus interface and execution units, registers and flags, physical addressing, and the 80286, 80386 and Pentium generations.',
    concepts: [
      'Bus interface unit and execution unit',
      'General, pointer, index and segment registers',
      'Flags and physical address calculation',
      'Pipelining and the 8088 8-bit bus',
      '80286, 80386, 80486 and Pentium evolution',
    ],
    prerequisites: ['computer-organization', 'number-systems'],
  },
  {
    id: 'computer-software',
    number: 6,
    title: 'Computer Software',
    subtitle: 'Software, Languages and Translators',
    estimatedMinutes: 8,
    summary:
      'System and application software, utility programs, programming languages, translators, algorithms, flowcharts and software licensing.',
    concepts: [
      'System software versus application software',
      'Utility programs and device drivers',
      'Machine, assembly and high-level languages',
      'Compiler, interpreter and assembler',
      'Algorithms, flowcharts and software licences',
    ],
    prerequisites: ['computer-organization'],
  },
  {
    id: 'ms-office',
    number: 7,
    title: 'MS Office',
    subtitle: 'Word, Excel, PowerPoint and Office Workflows',
    estimatedMinutes: 8,
    summary:
      'Word processing, spreadsheets, presentations, mail merge, formulas, charts, shortcuts and the everyday document workflows tested in IT fundamentals.',
    concepts: [
      'Word: formatting, styles, tables and mail merge',
      'Excel: cells, formulas, functions and charts',
      'Absolute and relative references',
      'PowerPoint: slides, masters and transitions',
      'Office file formats and keyboard shortcuts',
    ],
    prerequisites: ['computer-software'],
  },
];

export const itChapterById = new Map(itChapters.map((chapter) => [chapter.id, chapter]));

export function getITChapter(id: string | undefined): ITChapter | undefined {
  return id ? itChapterById.get(id) : undefined;
}

export function getAdjacentITChapters(id: string): {
  previous?: ITChapter;
  next?: ITChapter;
} {
  const index = itChapters.findIndex((chapter) => chapter.id === id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? itChapters[index - 1] : undefined,
    next: index < itChapters.length - 1 ? itChapters[index + 1] : undefined,
  };
}
