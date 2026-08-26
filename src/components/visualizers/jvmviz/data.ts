// JVM heap + garbage-collection simulation kernel and javap-style bytecode content.
// Pure data structures and pure helpers - no browser APIs - safe for module scope.

export const EDEN_CAPACITY = 24;
export const SURVIVOR_CAPACITY = 10;
export const OLD_CAPACITY = 18;
export const PROMOTION_AGE = 3; // minor GCs survived before promotion to Old
export const OBJ_PER_REGION = 4;
export const REGION_COLS = 8;
export const REGION_ROWS = 4;

/* -------------------------------- heap core -------------------------------- */

export type Tenure = 'ephemeral' | 'medium' | 'long';
export type SurvSpace = 'a' | 'b';

export interface JObj {
  id: number;
  name: string;
  sizeKb: number;
  tenure: Tenure;
  /** Completed minor GCs survived. */
  age: number;
  /** Major GC rounds survived after promotion. */
  majorTtl: number;
}

export interface HeapState {
  eden: JObj[];
  survA: JObj[];
  survB: JObj[];
  old: JObj[];
  /** Which survivor space currently holds occupants. */
  hold: SurvSpace;
}

export function freshHeap(): HeapState {
  return { eden: [], survA: [], survB: [], old: [], hold: 'a' };
}

const NAME_POOL: readonly string[] = [
  'Cart',
  'User',
  'Order',
  'Session',
  'Token',
  'Cursor',
  'Query',
  'Buffer',
  'Image',
  'Chunk',
];

/** Die-young mix: most allocations are ephemeral, a few survive longer. */
export function rollTenure(rand: number): Tenure {
  if (rand < 0.58) return 'ephemeral';
  if (rand < 0.85) return 'medium';
  return 'long';
}

/** Builds one object from four caller-supplied random rolls (keeps this file pure). */
export function makeObject(id: number, rTenure: number, rName: number, rSize: number, rTtl: number): JObj {
  return {
    id,
    name: NAME_POOL[Math.floor(rName * NAME_POOL.length) % NAME_POOL.length] + '-' + id,
    sizeKb: 8 * (1 + Math.floor(rSize * 6)),
    tenure: rollTenure(rTenure),
    age: 0,
    majorTtl: 1 + Math.floor(rTtl * 3),
  };
}

export interface MinorGcResult {
  next: HeapState;
  collected: JObj[];
  survivors: JObj[];
  promoted: JObj[];
  forcedPromotions: JObj[];
}

/**
 * Copying collector: Eden plus the holding survivor space are evaluated together.
 * Ephemeral objects die on their first collection; medium objects die on their
 * second; long objects age until PROMOTION_AGE and then copy into Old. If the
 * target survivor space is full, remaining survivors are force-promoted.
 */
export function minorGc(heap: HeapState): MinorGcResult {
  const holdArr = heap.hold === 'a' ? heap.survA : heap.survB;
  const candidates = heap.eden.concat(holdArr);
  const collected: JObj[] = [];
  const survivors: JObj[] = [];
  const promoted: JObj[] = [];
  const forcedPromotions: JObj[] = [];
  for (const o of candidates) {
    const aged = Object.assign({}, o, { age: o.age + 1 });
    if (aged.tenure === 'ephemeral') {
      collected.push(o);
      continue;
    }
    if (aged.tenure === 'medium' && aged.age >= 2) {
      collected.push(o);
      continue;
    }
    const dueToPromote = aged.tenure === 'long' && aged.age >= PROMOTION_AGE;
    if (dueToPromote) promoted.push(aged);
    else if (survivors.length >= SURVIVOR_CAPACITY) forcedPromotions.push(aged);
    else survivors.push(aged);
  }
  const next: HeapState = {
    eden: [],
    survA: heap.hold === 'a' ? [] : survivors,
    survB: heap.hold === 'a' ? survivors : [],
    old: heap.old.concat(promoted, forcedPromotions),
    hold: heap.hold === 'a' ? 'b' : 'a',
  };
  return { next, collected, survivors, promoted, forcedPromotions };
}

export interface MajorGcResult {
  next: HeapState;
  collectedOld: JObj[];
  sweptYoung: JObj[];
}

/** Full collection: young spaces first (same rules), then Old via majorTtl. */
export function majorGc(heap: HeapState): MajorGcResult {
  const young = minorGc(heap);
  const keptOld: JObj[] = [];
  const collectedOld: JObj[] = [];
  for (const o of young.next.old) {
    if (o.majorTtl - 1 > 0) keptOld.push(Object.assign({}, o, { majorTtl: o.majorTtl - 1 }));
    else collectedOld.push(o);
  }
  return { next: Object.assign({}, young.next, { old: keptOld }), collectedOld, sweptYoung: young.collected };
}

/* ------------------------------ G1 region view ----------------------------- */

export type RegionRole = 'eden' | 'survivor' | 'old' | 'free';

export interface RegionTile {
  id: number;
  role: RegionRole;
  fillPct: number;
  count: number;
}

/** Project the heap onto a fixed grid of equal-size regions. */
export function g1Tiles(heap: HeapState): RegionTile[] {
  const holdArr = heap.hold === 'a' ? heap.survA : heap.survB;
  const groups: { role: RegionRole; objs: JObj[] }[] = [
    { role: 'eden', objs: heap.eden },
    { role: 'survivor', objs: holdArr },
    { role: 'old', objs: heap.old },
  ];
  const tiles: RegionTile[] = [];
  let id = 0;
  for (const g of groups) {
    const n = Math.min(Math.ceil(g.objs.length / OBJ_PER_REGION), REGION_COLS);
    for (let i = 0; i < n; i++) {
      const slice = g.objs.slice(i * OBJ_PER_REGION, (i + 1) * OBJ_PER_REGION);
      tiles.push({
        id,
        role: g.role,
        fillPct: Math.round((slice.length / OBJ_PER_REGION) * 100),
        count: slice.length,
      });
      id += 1;
    }
  }
  const total = REGION_COLS * REGION_ROWS;
  while (tiles.length < total) {
    tiles.push({ id, role: 'free', fillPct: 0, count: 0 });
    id += 1;
  }
  return tiles;
}

/* --------------------------- javap-style bytecode -------------------------- */

export interface BytecodeLine {
  offset: number;
  mnemonic: string;
  operand: string;
  stackAfter: string;
  note: string;
}

export const SAMPLE_CLASS = 'com.cosmos.demo.CartService';
export const SAMPLE_METHOD = 'public int total(java.util.List items)';

export const BYTECODE_LINES: BytecodeLine[] = [
  { offset: 0, mnemonic: 'aload_1', operand: '', stackAfter: '[items]', note: 'push local 1, the items reference' },
  { offset: 1, mnemonic: 'invokeinterface', operand: 'List.size: ()I', stackAfter: '[len]', note: 'dispatch size(); the int result replaces the receiver' },
  { offset: 6, mnemonic: 'istore_2', operand: '', stackAfter: '[]', note: 'pop the count into local 2' },
  { offset: 7, mnemonic: 'iconst_0', operand: '', stackAfter: '[0]', note: 'constant zero - running sum starts here' },
  { offset: 8, mnemonic: 'istore_3', operand: '', stackAfter: '[]', note: 'sum = 0 in local 3' },
  { offset: 9, mnemonic: 'iconst_0', operand: '', stackAfter: '[0]', note: 'loop counter i = 0' },
  { offset: 10, mnemonic: 'istore', operand: '4', stackAfter: '[]', note: 'i lives in local slot 4' },
  { offset: 12, mnemonic: 'iload', operand: '4', stackAfter: '[i]', note: 'loop test begins: push i' },
  { offset: 14, mnemonic: 'iload_2', operand: '', stackAfter: '[i, len]', note: 'push the bound for the comparison' },
  { offset: 15, mnemonic: 'if_icmpge', operand: '38', stackAfter: '[]', note: 'pop both; jump when i >= len exits the loop' },
  { offset: 18, mnemonic: 'iload_3', operand: '', stackAfter: '[sum]', note: 'push sum for the addition' },
  { offset: 19, mnemonic: 'aload_1', operand: '', stackAfter: '[sum, items]', note: 'push the list again' },
  { offset: 20, mnemonic: 'iload', operand: '4', stackAfter: '[sum, items, i]', note: 'push the index' },
  { offset: 22, mnemonic: 'invokeinterface', operand: 'List.get: (I)Ljava/lang/Object;', stackAfter: '[sum, ref]', note: 'elements come back as Object - generics erase at runtime' },
  { offset: 27, mnemonic: 'checkcast', operand: 'Integer', stackAfter: '[sum, ref]', note: 'runtime cast against the erased type' },
  { offset: 30, mnemonic: 'invokevirtual', operand: 'Integer.intValue: ()I', stackAfter: '[sum, v]', note: 'unbox to an int' },
  { offset: 33, mnemonic: 'iadd', operand: '', stackAfter: '[newSum]', note: 'pop two ints, push their sum' },
  { offset: 34, mnemonic: 'istore_3', operand: '', stackAfter: '[]', note: 'store the updated sum' },
  { offset: 35, mnemonic: 'iinc', operand: '4, 1', stackAfter: '[]', note: 'increment i without touching the operand stack' },
  { offset: 38, mnemonic: 'iload_3', operand: '', stackAfter: '[sum]', note: 'loop exit: push the final sum' },
  { offset: 39, mnemonic: 'ireturn', operand: '', stackAfter: '[]', note: 'return the int to the caller' },
];

export const ALLOC_METHOD = 'public com.cosmos.demo.User makeUser(java.lang.String name)';

export const ALLOC_SNIPPET: BytecodeLine[] = [
  { offset: 0, mnemonic: 'new', operand: 'User', stackAfter: '[uninit]', note: 'heap allocation happens HERE - this is Eden filling up' },
  { offset: 3, mnemonic: 'dup', operand: '', stackAfter: '[ref, ref]', note: 'duplicate the reference for the constructor call' },
  { offset: 4, mnemonic: 'aload_1', operand: '', stackAfter: '[ref, ref, name]', note: 'push the constructor argument' },
  { offset: 5, mnemonic: 'invokespecial', operand: 'User.<init>: (Ljava/lang/String;)V', stackAfter: '[ref]', note: 'run the initializer; consumes one copy' },
  { offset: 8, mnemonic: 'astore_2', operand: '', stackAfter: '[]', note: 'the object is now strongly reachable from local 2' },
];