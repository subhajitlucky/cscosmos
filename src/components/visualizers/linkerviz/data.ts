// Linker & loader simulation model. Pure data + pure functions - no browser APIs.

export interface ObjSymbol {
  name: string;
  kind: 'func' | 'obj';
}

export interface ObjectFile {
  name: string;
  desc: string;
  defines: ObjSymbol[];
  refs: string[];
  /** Section sizes in bytes. */
  sections: { text: number; data: number; bss: number };
}

export const OBJECT_FILES: ObjectFile[] = [
  {
    name: 'main.o',
    desc: 'program entry',
    defines: [{ name: 'main', kind: 'func' }],
    refs: ['printf', 'compute', 'log_message'],
    sections: { text: 96, data: 16, bss: 0 },
  },
  {
    name: 'util.o',
    desc: 'helper routines',
    defines: [
      { name: 'compute', kind: 'func' },
      { name: 'scratch_buf', kind: 'obj' },
    ],
    refs: ['log_message', 'fast_mul'],
    sections: { text: 64, data: 0, bss: 32 },
  },
  {
    name: 'mathx.o',
    desc: 'math kernels',
    defines: [
      { name: 'fast_mul', kind: 'func' },
      { name: 'mul_table', kind: 'obj' },
    ],
    refs: ['log_message'],
    sections: { text: 128, data: 24, bss: 0 },
  },
];

/** Optional archive that supplies the otherwise-missing symbol. */
export const STUB_FILE: ObjectFile = {
  name: 'librt.a(log.o)',
  desc: 'logging shim',
  defines: [{ name: 'log_message', kind: 'func' }],
  refs: [],
  sections: { text: 32, data: 0, bss: 0 },
};

/** Symbols satisfied implicitly from shared libraries, never by our objects. */
export const LIB_SYMBOLS = ['printf'];

export interface ResolvedSym {
  name: string;
  defIn: string;
  lib: boolean;
  refsFrom: string[];
}

export interface MissingSym {
  name: string;
  refsFrom: string[];
}

export interface LinkResult {
  resolved: ResolvedSym[];
  missing: MissingSym[];
}

export function resolveSymbols(files: ObjectFile[]): LinkResult {
  const defs = new Map<string, { file: string }>();
  for (const f of files) {
    for (const d of f.defines) defs.set(d.name, { file: f.name });
  }
  const refsBy = new Map<string, string[]>();
  for (const f of files) {
    for (const r of f.refs) {
      const arr = refsBy.get(r) ?? [];
      arr.push(f.name);
      refsBy.set(r, arr);
    }
  }
  const resolved: ResolvedSym[] = [];
  const missing: MissingSym[] = [];
  for (const [name, from] of refsBy) {
    const def = defs.get(name);
    if (def) {
      resolved.push({ name, defIn: def.file, lib: false, refsFrom: from });
    } else if (LIB_SYMBOLS.includes(name)) {
      resolved.push({ name, defIn: 'libc.so', lib: true, refsFrom: from });
    } else {
      missing.push({ name, refsFrom: from });
    }
  }
  resolved.sort((a, b) => a.name.localeCompare(b.name));
  missing.sort((a, b) => a.name.localeCompare(b.name));
  return { resolved, missing };
}

export type SectionName = '.text' | '.data' | '.bss';

export interface MergedSection {
  name: SectionName;
  size: number;
  origin: { file: string; size: number }[];
}

export function mergeSections(files: ObjectFile[]): MergedSection[] {
  const build = (name: SectionName, key: 'text' | 'data' | 'bss'): MergedSection => ({
    name,
    size: files.reduce((s, f) => s + f.sections[key], 0),
    origin: files
      .filter((f) => f.sections[key] > 0)
      .map((f) => ({ file: f.name, size: f.sections[key] })),
  });
  return [build('.text', 'text'), build('.data', 'data'), build('.bss', 'bss')];
}

export const SECTION_COLORS: Record<SectionName, string> = {
  '.text': 'bg-teal-700 text-teal-50 dark:bg-teal-600',
  '.data': 'bg-teal-500 text-teal-50 dark:bg-teal-500',
  '.bss': 'bg-teal-300 text-teal-950 dark:bg-teal-800 dark:text-teal-100',
};

export interface MemSegment {
  name: string;
  vaddr: number;
  size: number;
  perm: string;
  src: string;
}

export const BASE_NO_ASLR = 0x400000;

/** Candidate image bases picked at random when ASLR is on. */
export const ASLR_BASES = [0x56440000, 0x55bb2000, 0x55e9c000, 0x5578e000];

export function mapSegments(files: ObjectFile[], base: number): MemSegment[] {
  const pageSize = 0x1000;
  const alignUp = (n: number) => Math.ceil(n / pageSize) * pageSize;
  const textBytes = alignUp(files.reduce((s, f) => s + f.sections.text, 0));
  const dataOff = base + textBytes + pageSize;
  const rwBytes = alignUp(files.reduce((s, f) => s + f.sections.data + f.sections.bss, 0));
  return [
    { name: '[stack]', vaddr: 0x7ffd0000, size: 0x21000, perm: 'rw-', src: 'grows downward - mapped by the kernel' },
    { name: '[heap]', vaddr: dataOff + rwBytes + pageSize * 2, size: 0x20000, perm: 'rw-', src: 'brk arena - where malloc lives' },
    { name: '.data + .bss', vaddr: dataOff, size: rwBytes, perm: 'rw-', src: 'private dirty pages - .bss zero-filled on demand' },
    { name: '.text', vaddr: base, size: textBytes, perm: 'r-x', src: 'mapped read-execute from PT_LOAD' },
  ];
}

export const PHASES = ['Object files', 'Symbol resolution', 'Section merge', 'Load & run'];

export const toHex = (n: number, digits = 8): string =>
  '0x' + (n >>> 0).toString(16).toUpperCase().padStart(digits, '0');
