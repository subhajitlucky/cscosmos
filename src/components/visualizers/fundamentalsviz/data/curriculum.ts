export type ITTrack =
  | 'Foundations'
  | 'Hardware'
  | 'Data Representation'
  | 'Software & Platforms'
  | 'Networks & Security'
  | 'IT in Practice';

export type ITLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ITChapter {
  id: string;
  number: number;
  title: string;
  track: ITTrack;
  difficulty: ITLevel;
  estimatedMinutes: number;
  summary: string;
  concepts: string[];
  prerequisites: string[];
  visualizerKey?: 'system' | 'binary' | 'network';
}

export const itTracks: readonly ITTrack[] = [
  'Foundations',
  'Hardware',
  'Data Representation',
  'Software & Platforms',
  'Networks & Security',
  'IT in Practice',
] as const;

export const itChapters: ITChapter[] = [
  {
    id: 'what-is-it',
    number: 1,
    title: 'What Is Information Technology?',
    track: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    summary:
      'The difference between IT, computer science, and information systems; the five layers every IT system shares; and what IT people actually do.',
    concepts: [
      'IT versus computer science versus information systems',
      'The five-layer system model',
      'Data, information, and knowledge',
      'Users, administrators, and builders',
      'Why IT is a service discipline',
    ],
    prerequisites: [],
  },
  {
    id: 'computer-system',
    number: 2,
    title: 'The Computer System',
    track: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Input, processing, storage, output, and control. A complete machine is more than a CPU and a screen.',
    concepts: [
      'The IPO model',
      'Hardware and software subsystems',
      'The stored-program idea',
      'Firmware and the boot process',
      'System boundaries and interfaces',
    ],
    prerequisites: ['what-is-it'],
  },
  {
    id: 'hardware-and-software',
    number: 3,
    title: 'Hardware vs Software',
    track: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    summary:
      'Physical components and the instructions that make them useful. The line is clear in principle and blurry in practice.',
    concepts: [
      'Physical versus logical components',
      'Firmware and embedded software',
      'Drivers as translators',
      'Compatibility and interfaces',
      'Why both sides must agree',
    ],
    prerequisites: ['computer-system'],
  },
  {
    id: 'data-information-knowledge',
    number: 4,
    title: 'Data, Information & Knowledge',
    track: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Raw facts become useful information through context and interpretation, and become knowledge when people can act on them.',
    concepts: [
      'Data versus information',
      'Metadata and context',
      'Information quality dimensions',
      'Knowledge and decisions',
      'Dashboards that mislead',
    ],
    prerequisites: ['what-is-it'],
  },
  {
    id: 'cpu',
    number: 5,
    title: 'CPU & the Instruction Cycle',
    track: 'Hardware',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Fetch, decode, execute, write back. Cores, clocks, caches, and pipelines turn a simple cycle into modern performance.',
    concepts: [
      'Fetch-decode-execute cycle',
      'Registers and the program counter',
      'Cores, threads, and clock speed',
      'Caches and locality',
      'Pipelining and instruction-level parallelism',
    ],
    prerequisites: ['computer-system'],
    visualizerKey: 'system',
  },
  {
    id: 'memory-storage',
    number: 6,
    title: 'Memory, Storage & the Hierarchy',
    track: 'Hardware',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Registers, cache, RAM, SSD, and tape trade speed for capacity. The hierarchy explains why software is designed around locality.',
    concepts: [
      'Volatile versus nonvolatile memory',
      'The memory hierarchy',
      'Latency and bandwidth',
      'RAM versus disk storage',
      'Locality and working sets',
    ],
    prerequisites: ['cpu'],
    visualizerKey: 'system',
  },
  {
    id: 'input-output',
    number: 7,
    title: 'Input, Output & Peripherals',
    track: 'Hardware',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Keyboards, displays, printers, cameras, sensors, and controllers. The CPU rarely talks to a device directly.',
    concepts: [
      'Input and output devices',
      'Device controllers and drivers',
      'Interrupts versus polling',
      'Display and print resolution',
      'Accessibility and ergonomics',
    ],
    prerequisites: ['computer-system'],
  },
  {
    id: 'motherboard-buses',
    number: 8,
    title: 'Motherboard, Buses & Ports',
    track: 'Hardware',
    difficulty: 'Intermediate',
    estimatedMinutes: 13,
    summary:
      'The board is the city plan: sockets, chipsets, buses, and ports decide what can talk to what and how fast.',
    concepts: [
      'Motherboard and chipset',
      'System bus and I/O bus',
      'PCIe, USB, SATA, and HDMI',
      'Power delivery and cooling',
      'Compatibility and bottlenecks',
    ],
    prerequisites: ['cpu', 'memory-storage'],
    visualizerKey: 'system',
  },
  {
    id: 'buying-maintaining',
    number: 9,
    title: 'Choosing & Maintaining a Computer',
    track: 'Hardware',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Match the machine to the workload, then protect it with updates, backups, cleaning, and a sensible replacement cycle.',
    concepts: [
      'Workload-based specifications',
      'Total cost of ownership',
      'Preventive maintenance',
      'Backups and recovery',
      'Upgrade versus replace',
    ],
    prerequisites: ['memory-storage', 'motherboard-buses'],
  },
  {
    id: 'binary-number-systems',
    number: 10,
    title: 'Binary & Number Systems',
    track: 'Data Representation',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    summary:
      'Computers count with two symbols. Binary, octal, decimal, and hexadecimal are different views of the same bits.',
    concepts: [
      'Positional notation',
      'Binary to decimal conversion',
      'Hexadecimal as shorthand',
      'Bit, byte, and word',
      'Powers of two',
    ],
    prerequisites: ['what-is-it'],
    visualizerKey: 'binary',
  },
  {
    id: 'integers-floating-point',
    number: 11,
    title: 'Integers, Overflow & Floating Point',
    track: 'Data Representation',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    summary:
      'Fixed-width numbers have limits. Signed integers, two’s complement, and IEEE 754 explain overflow and rounding surprises.',
    concepts: [
      'Unsigned and signed integers',
      'Two’s complement',
      'Overflow and wraparound',
      'IEEE 754 floating point',
      'Rounding and precision',
    ],
    prerequisites: ['binary-number-systems'],
    visualizerKey: 'binary',
  },
  {
    id: 'character-encoding',
    number: 12,
    title: 'Character Encoding & Text',
    track: 'Data Representation',
    difficulty: 'Intermediate',
    estimatedMinutes: 13,
    summary:
      'A letter is a number with an agreed meaning. ASCII, Unicode, UTF-8, and normalization decide whether text survives the trip.',
    concepts: [
      'Character sets and code points',
      'ASCII and extended ASCII',
      'Unicode and UTF-8',
      'Grapheme clusters and emoji',
      'Mojibake and normalization',
    ],
    prerequisites: ['binary-number-systems'],
    visualizerKey: 'binary',
  },
  {
    id: 'multimedia-compression',
    number: 13,
    title: 'Images, Audio, Video & Compression',
    track: 'Data Representation',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Pixels, samples, frames, and codecs. Compression decides how much quality fits in a file or a network link.',
    concepts: [
      'Pixels, resolution, and color depth',
      'Sampling and audio bitrate',
      'Frames and video bitrate',
      'Lossless versus lossy compression',
      'Containers, codecs, and metadata',
    ],
    prerequisites: ['binary-number-systems'],
    visualizerKey: 'binary',
  },
  {
    id: 'operating-systems',
    number: 14,
    title: 'Operating Systems & System Software',
    track: 'Software & Platforms',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    summary:
      'The OS schedules the CPU, allocates memory, manages files, and stands between applications and hardware.',
    concepts: [
      'Kernel and user space',
      'Processes and scheduling',
      'Memory and virtual memory',
      'File systems and drivers',
      'System software versus applications',
    ],
    prerequisites: ['hardware-and-software'],
  },
  {
    id: 'files-storage',
    number: 15,
    title: 'Files, Folders & Storage Management',
    track: 'Software & Platforms',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Names, paths, extensions, permissions, and the difference between a file and the application that opens it.',
    concepts: [
      'Files, directories, and paths',
      'Extensions and MIME types',
      'Permissions and ownership',
      'Local, network, and cloud storage',
      'Backup versus sync',
    ],
    prerequisites: ['operating-systems'],
  },
  {
    id: 'applications',
    number: 16,
    title: 'Applications & Productivity Software',
    track: 'Software & Platforms',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Word processors, spreadsheets, presentation tools, browsers, and collaboration suites are interfaces to structured data.',
    concepts: [
      'Application categories',
      'Document and spreadsheet models',
      'File formats and interoperability',
      'Collaboration and versioning',
      'Licensing and SaaS',
    ],
    prerequisites: ['files-storage'],
  },
  {
    id: 'programming-web',
    number: 17,
    title: 'Programming Languages & the Web',
    track: 'Software & Platforms',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Source code becomes instructions, and the web turns those instructions into pages and APIs that anyone can reach.',
    concepts: [
      'Compilers and interpreters',
      'High-level versus low-level languages',
      'Client side and server side',
      'HTML, CSS, JavaScript, and HTTP',
      'APIs and the request-response model',
    ],
    prerequisites: ['applications'],
  },
  {
    id: 'virtualization-cloud',
    number: 18,
    title: 'Virtualization, Cloud & Data Centers',
    track: 'Software & Platforms',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    summary:
      'A virtual machine is a computer made of software. Cloud computing rents those computers, storage, and services by the hour.',
    concepts: [
      'Virtual machines and hypervisors',
      'Containers and isolation',
      'IaaS, PaaS, and SaaS',
      'Regions, availability, and elasticity',
      'Shared responsibility and cost control',
    ],
    prerequisites: ['operating-systems'],
  },
  {
    id: 'networks-internet',
    number: 19,
    title: 'Networks, IP & the Internet',
    track: 'Networks & Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Packets, addresses, routes, and protocols. The internet is a network of networks that agrees on how to move data.',
    concepts: [
      'LAN, WAN, and the internet',
      'IP addresses and subnets',
      'DNS and routing',
      'TCP versus UDP',
      'Bandwidth, latency, and packet loss',
    ],
    prerequisites: ['computer-system'],
    visualizerKey: 'network',
  },
  {
    id: 'web-email-cloud',
    number: 20,
    title: 'Web, Email & Cloud Services',
    track: 'Networks & Security',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Browsers, URLs, email, and cloud apps are layered services built on the same network primitives.',
    concepts: [
      'URLs, domains, and browsers',
      'HTTP request and response',
      'Email protocols and spoofing',
      'Cloud storage and synchronization',
      'Single sign-on and sessions',
    ],
    prerequisites: ['networks-internet'],
    visualizerKey: 'network',
  },
  {
    id: 'cybersecurity',
    number: 21,
    title: 'Cybersecurity Basics',
    track: 'Networks & Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 15,
    summary:
      'Confidentiality, integrity, and availability. Threats exploit people, software, and configuration; controls reduce the risk.',
    concepts: [
      'CIA triad',
      'Malware, phishing, and social engineering',
      'Authentication and authorization',
      'Encryption and HTTPS',
      'Patching, backups, and least privilege',
    ],
    prerequisites: ['networks-internet'],
    visualizerKey: 'network',
  },
  {
    id: 'databases-information-systems',
    number: 22,
    title: 'Databases & Information Systems',
    track: 'Networks & Security',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Most IT systems are organized around stored facts. Tables, keys, queries, and transactions turn those facts into a reliable system of record.',
    concepts: [
      'Tables, rows, and keys',
      'Relational versus NoSQL models',
      'Queries and reports',
      'Transactions and integrity',
      'The database behind an application',
    ],
    prerequisites: ['data-information-knowledge'],
  },
  {
    id: 'business-systems',
    number: 23,
    title: 'Business Systems: ERP, CRM & E-Commerce',
    track: 'IT in Practice',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'ERP runs the core enterprise, CRM manages relationships, and e-commerce turns a catalog into a transaction.',
    concepts: [
      'ERP and shared master data',
      'CRM and the customer lifecycle',
      'E-commerce catalogs and checkout',
      'Integration and APIs',
      'Process fit versus customization',
    ],
    prerequisites: ['databases-information-systems'],
  },
  {
    id: 'ethics-ai-careers',
    number: 24,
    title: 'Ethics, Privacy, AI & IT Careers',
    track: 'IT in Practice',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'IT decisions affect people. Privacy, bias, accessibility, and environmental cost are part of the job, not an afterthought.',
    concepts: [
      'Privacy and consent',
      'Bias and fairness in AI',
      'Accessibility and inclusive design',
      'Security ethics and disclosure',
      'IT roles and career paths',
    ],
    prerequisites: ['cybersecurity', 'databases-information-systems'],
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
