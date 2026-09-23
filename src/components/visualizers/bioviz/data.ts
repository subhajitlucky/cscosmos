// CRISPR guide-design and HP-lattice protein-folding kernels.
// Pure deterministic helpers - no browser APIs - safe for module scope.

export type Base = 'A' | 'C' | 'G' | 'T';

/** Deterministic PRNG so server and client agree without effects. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASES = 'ACGT';

/* ------------------------------- strand and PAMs ------------------------------ */

export function makeStrand(length: number, seed: number): string {
  const rand = mulberry32(seed);
  let s = '';
  for (let i = 0; i < length; i++) s += BASES[Math.floor(rand() * 4)];
  return s;
}

export interface PamSite {
  /** Index of the N in the NGG PAM. */
  pamIndex: number;
  protospacerStart: number;
  protospacer: string;
  pam: string;
  gcPercent: number;
}

/** Every NGG site with a full 20 nt protospacer upstream of it. */
export function findPamSites(strand: string): PamSite[] {
  const sites: PamSite[] = [];
  for (let i = 20; i < strand.length - 2; i++) {
    if (strand[i + 1] === 'G' && strand[i + 2] === 'G') {
      const proto = strand.slice(i - 20, i);
      const gcCount = [...proto].filter((c) => c === 'G' || c === 'C').length;
      sites.push({ pamIndex: i, protospacerStart: i - 20, protospacer: proto, pam: strand.slice(i, i + 3), gcPercent: gcCount * 5 });
    }
  }
  return sites;
}

/** Cas9 cuts the blunt position 3 bp into the protospacer from its PAM end. */
export function cutBoundary(protospacerStart: number): number {
  return protospacerStart + 17;
}

/**
 * Demo strand that guarantees a rich playground: one primary target plus two
 * implanted near-copies (a distal 2-mismatch site and a seed 4-mismatch site)
 * so the off-target ranking always has something interesting to say.
 */
export function makeDemoStrand(seed: number): string {
  const rand = mulberry32(seed);
  const randBase = (): Base => BASES.charAt(Math.floor(rand() * 4)) as Base;
  const proto: Base[] = [];
  for (let i = 0; i < 20; i++) proto.push(randBase());
  const mutateCopy = (count: number, forceSeed: boolean): string => {
    const copy = [...proto];
    let placed = 0;
    while (placed < count) {
      const idx = forceSeed && placed === 0 ? 12 + Math.floor(rand() * 8) : Math.floor(rand() * 20);
      let nb = randBase();
      while (nb === copy[idx]) nb = randBase();
      copy[idx] = nb;
      placed += 1;
    }
    return copy.join("");
  };
  const filler = (): string => {
    let s = "";
    for (let i = 0; i < 7; i++) s += randBase();
    return s;
  };
  return (
    proto.join("") + "AGG" + filler() + mutateCopy(2, false) + "TGG" + filler() + mutateCopy(4, true) + "AGG" + filler()
  );
}

/* ------------------------------- off-target scan ------------------------------ */

export interface OffTargetHit {
  position: number;
  candidate: string;
  mismatches: number;
  seedMismatches: number;
  score: number;
}

function hamming(a: string, b: string): number {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d += 1;
  return d;
}

/**
 * Rank other 20-mers on the strand against the chosen guide.
 * Mismatches in the PAM-proximal seed (last 12 nt before the PAM) cost extra,
 * mirroring how Cas9 tolerates distal mismatches far more than seed ones.
 */
export function rankOffTargets(guide: string, strand: string, ownStart: number, limit = 5): OffTargetHit[] {
  const hits: OffTargetHit[] = [];
  for (let start = 0; start + 20 <= strand.length; start++) {
    if (start === ownStart) continue;
    const cand = strand.slice(start, start + 20);
    const mismatches = hamming(guide, cand);
    if (mismatches === 0 || mismatches > 6) continue;
    let seedMismatches = 0;
    for (let i = 8; i < 20; i++) if (guide[i] !== cand[i]) seedMismatches += 1;
    const score = Math.max(0, 100 - 18 * mismatches - 9 * seedMismatches);
    hits.push({ position: start, candidate: cand, mismatches, seedMismatches, score });
  }
  hits.sort((a, b) => b.score - a.score || a.mismatches - b.mismatches);
  return hits.slice(0, limit);
}

/* ----------------------------- translation mini-demo ---------------------------- */

export const CODON_TABLE: Record<string, string> = {
  TTT: 'F', TTC: 'F', TTA: 'L', TTG: 'L', CTT: 'L', CTC: 'L', CTA: 'L', CTG: 'L',
  ATT: 'I', ATC: 'I', ATA: 'I', ATG: 'M', GTT: 'V', GTC: 'V', GTA: 'V', GTG: 'V',
  TCT: 'S', TCC: 'S', TCA: 'S', TCG: 'S', AGT: 'S', AGC: 'S', CCT: 'P', CCC: 'P',
  CCA: 'P', CCG: 'P', ACT: 'T', ACC: 'T', ACA: 'T', ACG: 'T', GCT: 'A', GCC: 'A',
  GCA: 'A', GCG: 'A', TAT: 'Y', TAC: 'Y', CAT: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
  AAT: 'N', AAC: 'N', AAA: 'K', AAG: 'K', GAT: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
  TGT: 'C', TGC: 'C', TGG: 'W', CGT: 'R', CGC: 'R', CGA: 'R', CGG: 'R', AGA: 'R',
  AGG: 'R', GGT: 'G', GGC: 'G', GGA: 'G', GGG: 'G',
};

export const STOP_CODONS = new Set(['TAA', 'TAG', 'TGA']);

/** Translate the first reading frame; stops at a stop codon or unknown codon. */
export function translate(dna: string): string {
  let protein = '';
  for (let i = 0; i + 3 <= dna.length; i += 3) {
    const codon = dna.slice(i, i + 3).toUpperCase();
    if (STOP_CODONS.has(codon)) break;
    const aa = CODON_TABLE[codon];
    if (!aa) break;
    protein += aa;
  }
  return protein;
}

/* --------------------------- HP lattice folding model -------------------------- */

/** Classic hydrophobic set used by the Dill HP model. */
export const HYDROPHOBIC = new Set(['A', 'V', 'I', 'L', 'M', 'F', 'W', 'C']);
export const VALID_AA = 'ACDEFGHIKLMNPQRSTVWY';
export const MAX_CHAIN = 16;

export interface LatticePoint {
  x: number;
  y: number;
}

const keyOf = (p: LatticePoint): string => p.x + ',' + p.y;
const DIRS: LatticePoint[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

/** Negative HH contact count: lower is better. */
export function foldEnergy(conf: LatticePoint[], seq: string): number {
  const occ = new Map<string, number>();
  conf.forEach((p, i) => occ.set(keyOf(p), i));
  let contacts = 0;
  for (let i = 0; i < conf.length; i++) {
    if (!HYDROPHOBIC.has(seq[i])) continue;
    for (const d of DIRS) {
      const j = occ.get(keyOf({ x: conf[i].x + d.x, y: conf[i].y + d.y }));
      if (j !== undefined && j > i + 1 && HYDROPHOBIC.has(seq[j])) contacts += 1;
    }
  }
  return -contacts;
}

/**
 * Annealed search over corner-flip and end moves on the square lattice.
 * Returns conformation snapshots so the UI can animate the collapse.
 */
export function foldChain(seq: string, seed: number, iterations = 1400): { frames: LatticePoint[][]; energy: number } {
  const rand = mulberry32(seed);
  const n = seq.length;
  const conf: LatticePoint[] = [];
  for (let i = 0; i < n; i++) conf.push({ x: 2 * i, y: 0 });

  const frames: LatticePoint[][] = [conf.map((p) => ({ ...p }))];
  let energy = foldEnergy(conf, seq);
  let best = energy;

  const pushFrame = (): void => {
    frames.push(conf.map((p) => ({ ...p })));
  };

  const tryMove = (i: number, target: LatticePoint, temperature: number): void => {
    const occ = new Set(conf.map(keyOf));
    if (i > 0 && Math.abs(target.x - conf[i - 1].x) + Math.abs(target.y - conf[i - 1].y) !== 1) return;
    if (i < n - 1 && Math.abs(target.x - conf[i + 1].x) + Math.abs(target.y - conf[i + 1].y) !== 1) return;
    if (occ.has(keyOf(target))) return;
    const old = { ...conf[i] };
    conf[i] = target;
    const e = foldEnergy(conf, seq);
    if (e <= energy || rand() < Math.exp((energy - e) / temperature)) {
      energy = e;
      if (e < best) {
        best = e;
        pushFrame();
      }
    } else {
      conf[i] = old;
    }
  };

  for (let done = 0; done < iterations; done++) {
    const temperature = Math.max(0.06, 1.8 * (1 - done / iterations));
    const i = Math.floor(rand() * n);
    if (i === 0 || i === n - 1) {
      const anchor = i === 0 ? conf[1] : conf[n - 2];
      const d = DIRS[Math.floor(rand() * 4)];
      tryMove(i, { x: anchor.x + d.x, y: anchor.y + d.y }, temperature);
    } else {
      // Corner flip: jump to an empty lattice cell touching both chain neighbours.
      const a = conf[i - 1];
      const b = conf[i + 1];
      const cands: LatticePoint[] = [];
      for (const da of DIRS) {
        for (const db of DIRS) {
          if (a.x + da.x === b.x + db.x && a.y + da.y === b.y + db.y) cands.push({ x: a.x + da.x, y: a.y + da.y });
        }
      }
      if (cands.length > 0) {
        const pick = cands[Math.floor(rand() * cands.length)];
        tryMove(i, pick, temperature);
      }
    }
    if ((done + 1) % 350 === 0) pushFrame();
  }
  pushFrame();
  if (frames.length > 40) frames.splice(1, frames.length - 40);
  return { frames, energy };
}
