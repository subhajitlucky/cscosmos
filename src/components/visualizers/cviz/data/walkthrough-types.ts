export type CWalkthrough =
  | { kind: 'pointer-chain' }
  | { kind: 'array-walk' }
  | {
      kind: 'struct-layout';
      name: string;
      fields: { name: string; type: string; offset: number; size: number }[];
      totalSize: number;
      padding?: { offset: number; size: number }[];
    }
  | {
      kind: 'heap';
      bytes: number;
      values: number[];
    }
  | {
      kind: 'file-lifecycle';
      filename: string;
      line: string;
    }
  | {
      kind: 'bitwise';
      mode: 'operators' | 'masks';
    };
