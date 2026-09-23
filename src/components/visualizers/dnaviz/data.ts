// DNA storage simulation kernels: quaternary base coding, primer indexing,
// SECDED (extended Hamming) error protection and storage-density references.
// Pure data structures and helpers - no browser APIs - safe for module scope.

export type Nucleotide = 'A' | 'C' | 'G' | 'T';

/* ------------------------------ quaternary coding ----------------------------- */

/** Two payload bits become one nucleotide: A=00, C=01, G=10, T=11. */
export const BASE_TO_BITS: Record<Nucleotide, string> = {
  A: '00',
  C: '01',
  G: '10',
  T: '11',
};

export const BITS_TO_BASE: Record<string, Nucleotide> = {
  '00': 'A',
  '01': 'C',
  '10': 'G',
  '11': 'T',
};

/**
 * Transition partners differ in exactly one bit (purine A<->G, pyrimidine C<->T),
 * so one injected nucleotide mutation flips exactly one payload bit - which the
 * SECDED layer can always locate and repair.
 */
export const TRANSITION: Record<Nucleotide, Nucleotide> = {
  A: 'G',
  G: 'A',
  C: 'T',
  T: 'C',
};

/** Illustrative Illumina-style flanking primers used for pool indexing. */
export const PRIMER_5 = 'ACGTGACTGGAGTTCAGACGTGTGCTC';
export const PRIMER_7 = 'CTCGGCATTCCTGCTGAACCGCTCTTCC';

/* --------------------------------- SECDED layer -------------------------------- */

function intToBits(value: number, width: number): number[] {
  const out: number[] = [];
  for (let i = width - 1; i >= 0; i--) out.push((value >> i) & 1);
  return out;
}

/**
 * Extended Hamming (8,4): codeword layout [p1 p2 d1 p3 d2 d3 d4 p8].
 * p1..p3 give the syndrome, p8 is the overall parity (detects double errors).
 */
export function encodeNibble(nibble: number): number[] {
  const d = intToBits(nibble & 0xf, 4);
  const b: number[] = new Array(8);
  b[2] = d[0];
  b[4] = d[1];
  b[5] = d[2];
  b[6] = d[3];
  b[0] = b[2] ^ b[4] ^ b[6];
  b[1] = b[2] ^ b[5] ^ b[6];
  b[3] = b[4] ^ b[5] ^ b[6];
  b[7] = b[0] ^ b[1] ^ b[2] ^ b[3] ^ b[4] ^ b[5] ^ b[6];
  return b;
}

export interface BlockVerdict {
  syndrome: number;
  parityError: boolean;
  status: 'clean' | 'corrected' | 'corrupted';
  correctedBits: number[];
}

/** Locate and repair a single-bit error; flag (but cannot fix) double errors. */
export function verifyBlock(bits: number[]): BlockVerdict {
  const s1 = bits[0] ^ bits[2] ^ bits[4] ^ bits[6];
  const s2 = bits[1] ^ bits[2] ^ bits[5] ^ bits[6];
  const s4 = bits[3] ^ bits[4] ^ bits[5] ^ bits[6];
  const syndrome = s1 + 2 * s2 + 4 * s4;
  const parityError = bits.reduce((a, b) => a ^ b, 0) === 1;
  const correctedBits = [...bits];
  let status: BlockVerdict['status'] = 'clean';
  if (parityError && syndrome > 0) {
    correctedBits[syndrome - 1] ^= 1;
    status = 'corrected';
  } else if (!parityError && syndrome > 0) {
    status = 'corrupted';
  } else if (parityError && syndrome === 0) {
    correctedBits[7] ^= 1;
    status = 'corrected';
  }
  return { syndrome, parityError, status, correctedBits };
}

function bitsToInt(bits: number[], width: number): number {
  let v = 0;
  for (let i = 0; i < width; i++) v = (v << 1) | bits[i];
  return v;
}

/* ------------------------------- encode pipeline ------------------------------- */

export interface EncodedStrand {
  message: string;
  payload: Nucleotide[];
  fivePrime: Nucleotide[];
  sevenPrime: Nucleotide[];
  strand: Nucleotide[];
  codewords: number[][];
  oligoCount: number;
}

export function textToBytes(text: string): number[] {
  return [...text].map((ch) => ch.charCodeAt(0) & 0xff);
}

export function bytesToText(bytes: number[]): string {
  return bytes.map((b) => (b >= 32 && b < 127 ? String.fromCharCode(b) : '?')).join('');
}

/** Message -> bytes -> SECDED codewords -> quaternary payload + flanking primers. */
export function encodeMessage(message: string): EncodedStrand {
  const safe = message.length > 0 ? message : 'DNA';
  const flat: number[] = [];
  for (const ch of safe) {
    const byte = ch.charCodeAt(0) & 0xff;
    flat.push(...intToBits(byte, 8));
  }
  while (flat.length % 4 !== 0) flat.push(0);
  const codewords: number[][] = [];
  const payload: Nucleotide[] = [];
  for (let i = 0; i < flat.length; i += 4) {
    const nibble = (flat[i] << 3) | (flat[i + 1] << 2) | (flat[i + 2] << 1) | flat[i + 3];
    const cw = encodeNibble(nibble);
    codewords.push(cw);
    for (let j = 0; j < 8; j += 2) {
      payload.push(BITS_TO_BASE[String(cw[j]) + String(cw[j + 1])]);
    }
  }
  const fivePrime = [...PRIMER_5] as Nucleotide[];
  const sevenPrime = [...PRIMER_7] as Nucleotide[];
  return {
    message: safe,
    payload,
    fivePrime,
    sevenPrime,
    strand: [...fivePrime, ...payload, ...sevenPrime],
    codewords,
    oligoCount: Math.max(1, Math.ceil(payload.length / 150)),
  };
}

/* ------------------------------- decode pipeline ------------------------------- */

export interface DecodedResult {
  text: string;
  verdicts: BlockVerdict[];
  repairedPositions: number[];
  lostBlocks: number;
}

/** Strip parities (after optional correction) and rebuild the text. */
export function decodePayload(payload: Nucleotide[]): DecodedResult {
  const verdicts: BlockVerdict[] = [];
  const repairedPositions: number[] = [];
  let lostBlocks = 0;
  const dataBits: number[] = [];
  const blocks = Math.floor(payload.length / 4);
  for (let b = 0; b < blocks; b++) {
    const bits: number[] = [];
    for (let j = 0; j < 4; j++) {
      const pair = BASE_TO_BITS[payload[b * 4 + j]];
      bits.push(Number(pair[0]), Number(pair[1]));
    }
    const verdict = verifyBlock(bits);
    verdicts.push(verdict);
    if (verdict.status === 'corrected') {
      const bitIdx = verdict.syndrome === 0 ? 7 : verdict.syndrome - 1;
      repairedPositions.push(b * 4 + Math.floor(bitIdx / 2));
    }
    if (verdict.status === 'corrupted') lostBlocks += 1;
    const d = verdict.correctedBits;
    dataBits.push(d[2], d[4], d[5], d[6]);
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= dataBits.length; i += 8) {
    bytes.push(bitsToInt(dataBits.slice(i, i + 8), 8));
  }
  return { text: bytesToText(bytes), verdicts, repairedPositions, lostBlocks };
}

/** Naive decode that trusts the channel completely - used to show raw damage. */
export function naiveDecode(payload: Nucleotide[]): string {
  const bits: number[] = [];
  const blocks = Math.floor(payload.length / 4);
  for (let b = 0; b < blocks; b++) {
    for (let j = 0; j < 4; j++) {
      const pair = BASE_TO_BITS[payload[b * 4 + j]];
      bits.push(Number(pair[0]), Number(pair[1]));
    }
  }
  const dataBits: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    dataBits.push(bits[i + 2], bits[i + 4], bits[i + 5], bits[i + 6]);
  }
  const bytes: number[] = [];
  for (let i = 0; i + 8 <= dataBits.length; i += 8) {
    bytes.push(bitsToInt(dataBits.slice(i, i + 8), 8));
  }
  return bytesToText(bytes);
}

export interface Mutation {
  index: number;
  from: Nucleotide;
  to: Nucleotide;
}

/** Substitute one random payload nucleotide with its transition partner. */
export function mutateOnce(payload: Nucleotide[], rand: () => number = Math.random): Mutation | null {
  if (payload.length === 0) return null;
  const index = Math.floor(rand() * payload.length);
  const from = payload[index];
  return { index, from, to: TRANSITION[from] };
}

export function applyMutation(payload: Nucleotide[], m: Mutation): Nucleotide[] {
  const next = [...payload];
  next[m.index] = m.to;
  return next;
}

/* ------------------------------ density references ----------------------------- */

export interface StorageMedium {
  key: string;
  name: string;
  gramsPerExabyte: number;
  note: string;
}

/** Order-of-magnitude figures, rounded: grams of medium needed to hold one exabyte. */
export const STORAGE_MEDIA: readonly StorageMedium[] = [
  { key: 'hdd', name: 'HDD fleet (20 TB drives)', gramsPerExabyte: 33_500_000, note: '~50,000 drives x 670 g' },
  { key: 'tape', name: 'LTO tape cartridges', gramsPerExabyte: 11_100_000, note: '~55,500 cartridges x 200 g' },
  { key: 'dna', name: 'Synthetic DNA', gramsPerExabyte: 4.7, note: 'theoretical ~215 PB per gram' },
];

/* ---------------------------- synthesis / sequencing --------------------------- */

export interface PipelineStep {
  key: string;
  title: string;
  detail: string;
}

export const PIPELINE_STEPS: readonly PipelineStep[] = [
  { key: 'design', title: 'Design and encoding', detail: 'Message bits mapped to A/C/G/T with primers and SECDED parity added in silico.' },
  { key: 'synthesis', title: 'DNA synthesis', detail: 'Phosphoramidite printers build the oligo pool base by base, ~150 nt each.' },
  { key: 'store', title: 'Storage capsule', detail: 'Dehydrated oligos sit stable for centuries at room temperature inside silica.' },
  { key: 'sample', title: 'Sampling', detail: 'A fleck of the pool is rehydrated - random access via PCR primer selection.' },
  { key: 'pcr', title: 'PCR amplification', detail: 'Primers copy the wanted molecules exponentially before sequencing.' },
  { key: 'seq', title: 'Sequencing', detail: 'NGS reads millions of molecules in parallel, base-calling each one.' },
  { key: 'decode', title: 'Decoding and consensus', detail: 'Reads align, error-correcting codes vote, and the original bytes emerge.' },
];

export const BEAD_STYLES: Record<Nucleotide, string> = {
  A: 'bg-amber-400 text-amber-950 dark:bg-amber-300 dark:text-amber-950',
  C: 'bg-emerald-500 text-emerald-950 dark:bg-emerald-400 dark:text-emerald-950',
  G: 'bg-teal-700 text-teal-50 dark:bg-teal-500 dark:text-teal-950',
  T: 'bg-rose-500 text-rose-50 dark:bg-rose-400 dark:text-rose-950',
};
