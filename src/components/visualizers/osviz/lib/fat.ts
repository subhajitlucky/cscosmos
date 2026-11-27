export interface FatWalkResult {
  blocks: number[];
  error?: 'cycle' | 'out-of-range';
}

/**
 * Follow a FAT chain from `start` until EOF (-1).
 * FAT entries are `-1` for EOF, `-2` for free, or the next block index.
 */
export function walkFAT(start: number, fat: number[]): FatWalkResult {
  const blocks: number[] = [];
  const seen = new Set<number>();
  let current = start;

  while (current >= 0) {
    if (current >= fat.length) {
      return { blocks, error: 'out-of-range' };
    }
    if (seen.has(current)) {
      return { blocks, error: 'cycle' };
    }
    seen.add(current);
    blocks.push(current);
    current = fat[current];
  }

  return { blocks };
}

export function isFreeBlock(entry: number | undefined): boolean {
  return entry === undefined || entry === -2;
}
