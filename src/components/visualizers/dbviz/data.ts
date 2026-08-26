// B-tree index playground + isolation-anomaly knowledge base.
// Pure data structures and pure helpers - no browser APIs - safe for module scope.

/* ------------------------------- B-tree core ------------------------------ */

/** Minimum degree t = 2: every node holds 1..3 keys, internal nodes have 2..4 children. */
export const BTREE_T = 2;

export interface BTreeNode {
  /** Stable across inserts so the UI can animate nodes between layouts. */
  id: number;
  keys: number[];
  children: BTreeNode[];
}

export interface SplitEvent {
  promoted: number;
  fromKeys: number[];
}

export interface InsertResult {
  root: BTreeNode | null;
  splits: SplitEvent[];
  inserted: boolean;
  duplicate: boolean;
}

interface Ctx {
  nextId: number;
  events: SplitEvent[];
}

function makeNode(keys: number[], children: BTreeNode[], ctx: Ctx): BTreeNode {
  return { id: ctx.nextId++, keys: [...keys], children };
}

function maxId(n: BTreeNode): number {
  return n.children.reduce((m, c) => Math.max(m, maxId(c)), n.id);
}

export function btreeContains(root: BTreeNode | null, key: number): boolean {
  let n = root;
  while (n) {
    if (n.keys.includes(key)) return true;
    if (n.children.length === 0) return false;
    let i = 0;
    while (i < n.keys.length && key > n.keys[i]) i++;
    n = n.children[i];
  }
  return false;
}

/** CLRS-style top-down insert: any full node met on the way down splits first. */
function splitChild(parent: BTreeNode, i: number, ctx: Ctx): void {
  const child = parent.children[i];
  const up = child.keys[BTREE_T - 1];
  const rightKeys = child.keys.slice(BTREE_T);
  const rightChildren = child.children.length > 0 ? child.children.splice(BTREE_T) : [];
  ctx.events.push({ promoted: up, fromKeys: [...child.keys] });
  child.keys = child.keys.slice(0, BTREE_T - 1);
  const right = makeNode(rightKeys, rightChildren, ctx);
  parent.keys.splice(i, 0, up);
  parent.children.splice(i + 1, 0, right);
}

function insertNonFull(node: BTreeNode, key: number, ctx: Ctx): void {
  if (node.children.length === 0) {
    let i = 0;
    while (i < node.keys.length && key > node.keys[i]) i++;
    node.keys.splice(i, 0, key);
    return;
  }
  let i = 0;
  while (i < node.keys.length && key > node.keys[i]) i++;
  if (node.children[i].keys.length === 3) {
    splitChild(node, i, ctx);
    if (key > node.keys[i]) i++;
  }
  insertNonFull(node.children[i], key, ctx);
}

export function btreeInsert(root: BTreeNode | null, key: number): InsertResult {
  if (btreeContains(root, key)) {
    return { root, splits: [], inserted: false, duplicate: true };
  }
  const ctx: Ctx = { nextId: root ? maxId(root) + 1 : 1, events: [] };
  if (!root) {
    return { root: makeNode([key], [], ctx), splits: [], inserted: true, duplicate: false };
  }
  if (root.keys.length === 3) {
    const newRoot = makeNode([], [root], ctx);
    splitChild(newRoot, 0, ctx);
    insertNonFull(newRoot, key, ctx);
    return { root: newRoot, splits: ctx.events, inserted: true, duplicate: false };
  }
  insertNonFull(root, key, ctx);
  return { root, splits: ctx.events, inserted: true, duplicate: false };
}

/* -------------------------------- layout ---------------------------------- */

export interface Placement {
  node: BTreeNode;
  depth: number;
  cx: number;
  cy: number;
  w: number;
}

export interface TreeLayout {
  placements: Placement[];
  edges: { x1: number; y1: number; x2: number; y2: number }[];
  width: number;
  height: number;
}

const UNIT = 54;
const ROW_H = 96;
const TOP_PAD = 40;

function subtreeWidth(n: BTreeNode): number {
  if (n.children.length === 0) return 1;
  return n.children.reduce((s, c) => s + subtreeWidth(c), 0);
}

function nodeWidthPx(n: BTreeNode): number {
  return Math.max(64, n.keys.length * 42 + 14);
}

/** Pure layout: leaves spread left-to-right, parents center over their children. */
export function layoutTree(root: BTreeNode | null): TreeLayout {
  const placements: Placement[] = [];
  const edges: TreeLayout['edges'] = [];
  if (!root) {
    return { placements, edges, width: UNIT, height: TOP_PAD + ROW_H };
  }
  let deepest = 0;
  let cursor = 0;
  const walk = (n: BTreeNode, depth: number): number => {
    deepest = Math.max(deepest, depth);
    const cy = TOP_PAD + depth * ROW_H;
    if (n.children.length === 0) {
      const units = cursor + 0.5;
      cursor += 1;
      placements.push({ node: n, depth, cx: units * UNIT, cy, w: nodeWidthPx(n) });
      return units;
    }
    const childCx: number[] = n.children.map((c) => walk(c, depth + 1));
    const cx = (childCx[0] + childCx[childCx.length - 1]) / 2;
    placements.push({ node: n, depth, cx: cx * UNIT, cy, w: nodeWidthPx(n) });
    n.children.forEach((c, idx) => {
      const child = placements.find((p) => p.node.id === c.id);
      if (!child) return;
      edges.push({ x1: cx * UNIT, y1: cy + 20, x2: child.cx, y2: child.cy - 20 });
      void idx;
    });
    return cx;
  };
  walk(root, 0);
  return {
    placements,
    edges,
    width: Math.max(cursor * UNIT + UNIT, 280),
    height: TOP_PAD + (deepest + 1) * ROW_H,
  };
}

export interface QueryResultPath {
  /** Node ids from root to the leaf where the key lives (or would live). */
  ids: number[];
  found: boolean;
}

export function queryPath(root: BTreeNode | null, key: number): QueryResultPath {
  const ids: number[] = [];
  let n = root;
  while (n) {
    ids.push(n.id);
    if (n.keys.includes(key)) return { ids, found: true };
    if (n.children.length === 0) return { ids, found: false };
    let i = 0;
    while (i < n.keys.length && key > n.keys[i]) i++;
    n = n.children[i];
  }
  return { ids, found: false };
}

/* ------------------------------ sample content ----------------------------- */

export const SEED_KEYS: number[] = [10, 20, 5, 15, 25, 30, 8, 35, 12, 40];

/* ---------------------------- ACID mini-panel ------------------------------ */

export type Isolation = 'ru' | 'rc' | 'rr' | 'ser';

export interface IsoInfo {
  id: Isolation;
  label: string;
  short: string;
  guarantee: string;
}

export const ISOLATIONS: IsoInfo[] = [
  { id: 'ru', label: 'Read Uncommitted', short: 'RU', guarantee: 'may read other transactions’ uncommitted writes' },
  { id: 'rc', label: 'Read Committed', short: 'RC', guarantee: 'sees only committed data, but it can change between reads' },
  { id: 'rr', label: 'Repeatable Read', short: 'RR', guarantee: 'once read, a row stays frozen for the whole transaction' },
  { id: 'ser', label: 'Serializable', short: 'SER', guarantee: 'runs as if transactions executed strictly one after another' },
];

export type AcidScenarioId = 'dirty' | 'nonrepeatable';

export interface AcidStep {
  actor: 'T1' | 'T2';
  action: string;
  detail: string;
  /**
   * Read steps only: the value T2 observes under different visibility rules.
   * seesUncommitted: raw page value even if the writer never commits.
   * seesLastCommitted: newest value another transaction committed.
   * seesSnapshot: value frozen at the reader's transaction/first-read snapshot.
   */
  read?: { seesUncommitted: number; seesLastCommitted: number; seesSnapshot: number };
  commit?: boolean;
  rollback?: boolean;
}

export interface AcidOutcome {
  anomalous: boolean;
  why: string;
}

export interface AcidScenario {
  title: string;
  intro: string;
  steps: AcidStep[];
  outcome: Record<Isolation, AcidOutcome>;
}

const START_BALANCE = 500;

export const START_BALANCE_CONST = START_BALANCE;

export const ACID_SCENARIOS: Record<AcidScenarioId, AcidScenario> = {
  dirty: {
    title: 'Dirty read',
    intro:
      'T1 bumps account #1 from ' + START_BALANCE + ' to 700, then rolls back. What did T2 see mid-flight?',
    steps: [
      {
        actor: 'T1',
        action: 'BEGIN',
        detail: 'Transaction 1 opens and prepares a transfer.',
      },
      {
        actor: 'T1',
        action: 'UPDATE balance = 700',
        detail: 'Row rewritten on T1’s private view - nothing committed yet.',
      },
      {
        actor: 'T2',
        action: 'SELECT balance',
        detail: '',
        read: { seesUncommitted: 700, seesLastCommitted: START_BALANCE, seesSnapshot: START_BALANCE },
      },
      {
        actor: 'T1',
        action: 'ROLLBACK',
        detail: 'T1 aborts - the 700 never officially existed.',
        rollback: true,
      },
      {
        actor: 'T2',
        action: '-- verdict --',
        detail: 'If T2 saw 700 it already acted on phantom money.',
      },
    ],
    outcome: {
      ru: { anomalous: true, why: 'ANOMALY: T2 read 700, then T1 rolled back - business logic ran on a value that never existed.' },
      rc: { anomalous: false, why: 'PREVENTED: Read Committed shows T2 only committed rows - it kept seeing the real ' + START_BALANCE + '.' },
      rr: { anomalous: false, why: 'PREVENTED: Repeatable Read snapshots the row - T2’s reads all return ' + START_BALANCE + '.' },
      ser: { anomalous: false, why: 'PREVENTED: Serializable orders T2 entirely before or after T1 - no torn state is ever visible.' },
    },
  },
  nonrepeatable: {
    title: 'Non-repeatable read',
    intro:
      'T1 reads account #1 twice inside one transaction while T2 slips an update+commit in between.',
    steps: [
      {
        actor: 'T1',
        action: 'BEGIN; SELECT balance',
        detail: 'First read: ' + START_BALANCE + '. T1 bases its calculation on this.',
        read: { seesUncommitted: START_BALANCE, seesLastCommitted: START_BALANCE, seesSnapshot: START_BALANCE },
      },
      {
        actor: 'T2',
        action: 'UPDATE balance = 900; COMMIT',
        detail: 'T2 raises the balance and commits cleanly.',
        commit: true,
      },
      {
        actor: 'T1',
        action: 'SELECT balance',
        detail: '',
        read: { seesUncommitted: 900, seesLastCommitted: 900, seesSnapshot: START_BALANCE },
      },
      {
        actor: 'T2',
        action: '-- verdict --',
        detail: 'Same row, same transaction - did the answer change?',
      },
    ],
    outcome: {
      ru: { anomalous: true, why: 'ANOMALY: T1 saw ' + START_BALANCE + ' then 900 - two different facts inside one transaction.' },
      rc: { anomalous: true, why: 'ANOMALY: Read Committed refreshes per statement, so T1’s second read returned 900.' },
      rr: { anomalous: false, why: 'PREVENTED: Repeatable Read pins the first read - both SELECTs return ' + START_BALANCE + '.' },
      ser: { anomalous: false, why: 'PREVENTED: Serializable would have aborted one transaction - no interleaved reads survive.' },
    },
  },
};

/** Visibility resolution used while playing steps. */
export function resolveRead(iso: Isolation, read: AcidStep['read']): number {
  if (!read) return START_BALANCE;
  if (iso === 'ru') return read.seesUncommitted;
  if (iso === 'rc') return read.seesLastCommitted;
  return read.seesSnapshot;
}
