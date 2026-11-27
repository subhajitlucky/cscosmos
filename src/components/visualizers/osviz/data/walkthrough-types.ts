import type { OSProcess, SchedulingAlgorithm } from '../lib/scheduling';

export type PageReplacementPolicy = 'FIFO' | 'LRU' | 'OPTIMAL';

export type OSWalkthrough =
  | {
      kind: 'scheduler';
      processes: OSProcess[];
      algorithm: SchedulingAlgorithm;
      quantum?: number;
    }
  | {
      kind: 'page-replacement';
      references: number[];
      frameCount: number;
      defaultPolicy?: PageReplacementPolicy;
    }
  | {
      kind: 'paging';
      virtualAddress: number;
      pageSize: number;
      pageTable: number[];
    }
  | {
      kind: 'fat';
      start: number;
      fat: number[];
      totalBlocks?: number;
    };
