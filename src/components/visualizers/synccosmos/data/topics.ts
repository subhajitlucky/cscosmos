export interface SyncTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Causality & Logical Clocks' | 'Operational Transformation' | 'CRDT Foundations' | 'State & Op CRDTs' | 'Sequence CRDTs & Text';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  codeSnippet: string;
  outputDescription: string;
  related: string[];
}

export interface SyncTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: SyncTopic[];
}

export const syncTopics: SyncTopic[] = [
  // 1. Causality & Logical Clocks
  {
    id: 'lamport-vector-clocks',
    title: 'Lamport Timestamps & Vector Clocks',
    kicker: 'Causality / 01',
    group: 'Causality & Logical Clocks',
    difficulty: 'starter',
    summary: 'Why physical wall clocks drift in distributed networks, and how logical vector clocks track causal happens-before relationships.',
    definition: 'Physical wall clocks on independent computers suffer from clock drift and NTP synchronization skew. A Vector Clock is an array of logical clock counters maintained by each node [V_1, V_2, ... V_N]. By incrementing local counters on internal events and taking element-wise maximums on message receipt, vector clocks establish unambiguous happens-before (a -> b) causal ordering or detect concurrent conflicts.',
    analogy: 'Three detectives keeping serialized investigation logbooks: whenever Detective A shares notes with Detective B, Detective B updates their case index to the highest page number seen so far, ensuring evidence sequences are never misordered.',
    steps: [
      'Each node i initializes vector clock V_i of size N with all zeros [0, 0, 0]',
      'Local event: Node i increments its own entry V_i[i] = V_i[i] + 1',
      'Message send: Node i attaches current vector V_i to the network message',
      'Message receive: Node j receives message with vector V_msg',
      'Merge: Node j sets V_j[k] = max(V_j[k], V_msg[k]) for all k, then increments V_j[j]'
    ],
    mistakes: [
      'Using physical Date.now() timestamps to order distributed writes (leads to Last-Write-Wins silent data loss due to clock skew)',
      'Assuming vector clocks grow O(1) in dynamic peer-to-peer networks with thousands of transient client IDs'
    ],
    optimization: 'Interval Tree Clocks (ITC) allow dynamic peer joining and leaving without pre-allocating fixed vector array dimensions.',
    codeSnippet: `// Vector Clock Implementation in TypeScript
class VectorClock {
  public clock: Map<string, number> = new Map();

  constructor(public readonly nodeId: string) {
    this.clock.set(nodeId, 0);
  }

  increment(): void {
    const current = this.clock.get(this.nodeId) || 0;
    this.clock.set(this.nodeId, current + 1);
  }

  merge(remoteClock: Map<string, number>): void {
    for (const [node, time] of remoteClock.entries()) {
      const localTime = this.clock.get(node) || 0;
      this.clock.set(node, Math.max(localTime, time));
    }
    this.increment();
  }

  // Returns true if this clock strictly happened before other
  happensBefore(other: VectorClock): boolean {
    let hasStrictlyLess = false;
    for (const [node, time] of this.clock.entries()) {
      const otherTime = other.clock.get(node) || 0;
      if (time > otherTime) return false;
      if (time < otherTime) hasStrictlyLess = true;
    }
    return hasStrictlyLess;
  }
}`,
    outputDescription: 'Computes causal event ordering without physical clock synchronization.',
    related: ['operational-transformation-ot', 'crdt-semilattices-sec', 'lww-vs-pn-counter']
  },

  // 2. Operational Transformation
  {
    id: 'operational-transformation-ot',
    title: 'Operational Transformation (OT) & Central Server Matrix',
    kicker: 'Transformation / 01',
    group: 'Operational Transformation',
    difficulty: 'intermediate',
    summary: 'How Google Docs adjusts character indices of concurrent text operations against a central serialization server.',
    definition: 'Operational Transformation (OT) is a concurrency control paradigm where editing intentions are expressed as operations (Insert(pos, char), Delete(pos)). When concurrent operations arrive out of order, transformation functions T(op1, op2) adjust positional indices against previously committed operations to ensure document state convergence across all clients.',
    analogy: 'Two editors writing annotations in the margins of a printed manuscript: if Editor A inserts a paragraph on Page 2, the publisher shifts all of Editor B’s subsequent Page 3 annotations down by one page number so they point to the correct text.',
    steps: [
      'Client A types "X" at index 3: generates Insert(3, "X")',
      'Concurrently, Client B deletes character at index 1: generates Delete(1)',
      'Client A sends operation to central server; server commits Insert(3, "X")',
      'Server transforms Client B Delete(1) against Insert(3, "X"): index shifts by +1 -> Delete(1)',
      'Server broadcasts transformed operations to all clients; all editors reach identical document text'
    ],
    mistakes: [
      'Attempting to run OT peer-to-peer without a centralized server (the transformation property TP2 is notoriously complex to satisfy in decentralized networks)',
      'Buffering unacknowledged local operations incorrectly when receiving incoming server broadcasts'
    ],
    optimization: 'Jupiter architecture uses a 2-way state graph on the central server to transform operations in O(1) time per revision.',
    codeSnippet: `// Operational Transformation Function T(opA, opB)
interface InsertOp { type: 'insert'; pos: number; char: string; }
interface DeleteOp { type: 'delete'; pos: number; }
type Op = InsertOp | DeleteOp;

function transform(opA: Op, opB: Op): Op {
  if (opA.type === 'insert' && opB.type === 'insert') {
    if (opA.pos < opB.pos) return opA;
    // Shift position right if opB inserted before opA
    return { ...opA, pos: opA.pos + 1 };
  }
  if (opA.type === 'insert' && opB.type === 'delete') {
    if (opA.pos <= opB.pos) return opA;
    // Shift position left if opB deleted before opA
    return { ...opA, pos: Math.max(0, opA.pos - 1) };
  }
  return opA;
}`,
    outputDescription: 'Adjusts index coordinates of concurrent operations to guarantee document convergence.',
    related: ['lamport-vector-clocks', 'crdt-semilattices-sec', 'rga-sequence-crdt']
  },

  // 3. CRDT Foundations
  {
    id: 'crdt-semilattices-sec',
    title: 'CRDTs & Bounded Join-Semilattices (SEC)',
    kicker: 'CRDT Math / 01',
    group: 'CRDT Foundations',
    difficulty: 'advanced',
    summary: 'The mathematical proof of Strong Eventual Consistency using Commutative, Associative, and Idempotent merge functions.',
    definition: 'A Conflict-Free Replicated Data Type (CRDT) is a data structure designed to be replicated across multiple nodes without central coordination. If state mutations form a Bounded Join-Semilattice with a merge operator (⊔) that is Commutative (a ⊔ b = b ⊔ a), Associative ((a ⊔ b) ⊔ c = a ⊔ (b ⊔ c)), and Idempotent (a ⊔ a = a), Strong Eventual Consistency (SEC) is mathematically guaranteed regardless of message arrival order or duplication.',
    analogy: 'Finding the maximum number in a set: merging [3, 8] with [8, 12] always yields 12, regardless of whether you compare them left-to-right, right-to-left, or repeat the comparison 100 times.',
    steps: [
      'Node applies local modification instantly with 0 network latency',
      'Transmits state or delta payload to peers asynchronously',
      'Peer receives payload in arbitrary network order (even with packet duplication)',
      'Executes deterministic merge operator: State_new = State_local ⊔ State_remote',
      'All peers converge to identical state without consensus rounds or merge conflicts'
    ],
    mistakes: [
      'Designing a merge function that is not idempotent (leads to state inflation on retried network packets)',
      'Transmitting full state snapshots across slow mobile networks instead of compact Delta-State CRDTs'
    ],
    optimization: 'Delta-State CRDTs transmit only the mutated delta slice (Δ) since the last synchronization round, slashing bandwidth by 99%.',
    codeSnippet: `// Join-Semilattice Merge Operator (Max Set)
class GCounter {
  private counts: Map<string, number> = new Map();

  increment(nodeId: string, amount = 1): void {
    const cur = this.counts.get(nodeId) || 0;
    this.counts.set(nodeId, cur + amount);
  }

  // Merge Operator (⊔): Commutative, Associative, Idempotent
  merge(other: GCounter): void {
    for (const [node, val] of other.counts.entries()) {
      const localVal = this.counts.get(node) || 0;
      this.counts.set(node, Math.max(localVal, val)); // ⊔ = max()
    }
  }

  value(): number {
    let total = 0;
    for (const val of this.counts.values()) total += val;
    return total;
  }
}`,
    outputDescription: 'Guarantees 100% deterministic replica convergence without central locks.',
    related: ['lww-vs-pn-counter', 'rga-sequence-crdt', 'operational-transformation-ot']
  },

  // 4. State & Op CRDTs
  {
    id: 'lww-vs-pn-counter',
    title: 'PN-Counters & LWW-Element-Set (State vs Op CRDTs)',
    kicker: 'Primitives / 01',
    group: 'State & Op CRDTs',
    difficulty: 'intermediate',
    summary: 'Positive-Negative Counters, Last-Write-Wins registers, and Observed-Removed Sets (OR-Set).',
    definition: 'State-based CRDTs (CvRDT) synchronize by sending full states or deltas; Operation-based CRDTs (CmRDT) synchronize by sending commutative operations over reliable causal channels. A PN-Counter uses two G-Counters (P for increments, N for decrements). An LWW-Element-Set attaches Lamport timestamps to add and remove sets to resolve concurrent additions and deletions.',
    analogy: 'A bank ledger with two columns: one strictly for deposits and one strictly for withdrawals. You can sum up both columns in any order to calculate the exact current balance.',
    steps: [
      'PN-Counter: Maintain positive counter map P and negative counter map N',
      'Increment: P[nodeId] += 1; Decrement: N[nodeId] += 1',
      'Value: sum(P) - sum(N)',
      'Merge: P_local = max(P_local, P_remote) and N_local = max(N_local, N_remote)',
      'Monotonic growth ensures no decrement can ever be lost during network partitions'
    ],
    mistakes: [
      'Attempting to decrement a G-Counter directly (violates monotonic growth requirement of semilattices)',
      'Re-adding an item in an LWW-Set with an older timestamp than its deletion record'
    ],
    optimization: 'Compacting tombstones in OR-Sets via causal stability analysis reclaims memory from permanently deleted items.',
    codeSnippet: `// PN-Counter (Positive-Negative Counter)
class PNCounter {
  private P = new Map<string, number>();
  private N = new Map<string, number>();

  increment(nodeId: string, val = 1) { this.P.set(nodeId, (this.P.get(nodeId) || 0) + val); }
  decrement(nodeId: string, val = 1) { this.N.set(nodeId, (this.N.get(nodeId) || 0) + val); }

  merge(other: PNCounter) {
    for (const [k, v] of other.P) this.P.set(k, Math.max(this.P.get(k) || 0, v));
    for (const [k, v] of other.N) this.N.set(k, Math.max(this.N.get(k) || 0, v));
  }

  value(): number {
    const pSum = Array.from(this.P.values()).reduce((a, b) => a + b, 0);
    const nSum = Array.from(this.N.values()).reduce((a, b) => a + b, 0);
    return pSum - nSum;
  }
}`,
    outputDescription: 'Computes distributed counter with support for arbitrary increments and decrements.',
    related: ['crdt-semilattices-sec', 'rga-sequence-crdt', 'lamport-vector-clocks']
  },

  // 5. Sequence CRDTs & Text
  {
    id: 'rga-sequence-crdt',
    title: 'Collaborative Text: RGA, Yjs & Fractional Indexing',
    kicker: 'Sequences / 01',
    group: 'Sequence CRDTs & Text',
    difficulty: 'expert',
    summary: 'How modern collaborative editors (Yjs, Automerge, Figma) model rich text as linked trees of immutable character nodes with fractional indices.',
    definition: 'Text editing requires ordered Sequence CRDTs. Replicated Growable Array (RGA) and Yjs YATA model text not as string character arrays, but as a linked list of immutable Item nodes identified by (clientID, clock). Fractional Indexing generates dense mathematical identifiers (e.g. between "0.1" and "0.2" insert "0.15") to insert characters without shifting other item indices.',
    analogy: 'Inserting index tabs between two pages in a binder: instead of renumbering 500 subsequent pages, you label the new page "12.5", preserving the exact order with zero renumbering ripple.',
    steps: [
      'User types character "B" between node A (id: alice:1) and node C (id: bob:3)',
      'Engine creates new Item node: id=(alice:2), leftOrigin=(alice:1), rightOrigin=(bob:3), val="B"',
      'Transmits item to peers as a single compact binary struct',
      'Peer receives item: executes YATA / RGA conflict resolution (orders by clientID if concurrent)',
      'Inserts item into local linked list in constant time'
    ],
    mistakes: [
      'Using naive floating-point numbers for fractional indexing (quickly exhausts 64-bit IEEE 754 precision; requires variable-length byte string keys)',
      'Keeping tombstone deleted nodes in memory indefinitely without garbage collection'
    ],
    optimization: 'Yjs Run-Length Encoding merges adjacent consecutive character insertions into single Block chunks, reducing memory footprint by 85%.',
    codeSnippet: `// Sequence CRDT Node Structure (RGA / YATA Style)
interface SequenceItem {
  id: { client: string; clock: number };
  originLeft: { client: string; clock: number } | null;
  originRight: { client: string; clock: number } | null;
  value: string;
  deleted: boolean;
}

// Inserting between items generates unique immutable node ID
function createItem(client: string, clock: number, left: SequenceItem | null, val: string): SequenceItem {
  return {
    id: { client, clock },
    originLeft: left ? left.id : null,
    originRight: null,
    value: val,
    deleted: false,
  };
}`,
    outputDescription: 'Models collaborative real-time rich text with sub-millisecond local latency.',
    related: ['crdt-semilattices-sec', 'operational-transformation-ot', 'lww-vs-pn-counter']
  }
];

export const syncTopicGroups: SyncTopicGroup[] = [
  {
    id: 'causality',
    name: 'Causality & Logical Clocks',
    description: 'Lamport timestamps, Vector clocks, and partial vs total causal ordering in distributed systems.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: syncTopics.filter(t => t.group === 'Causality & Logical Clocks')
  },
  {
    id: 'ot-core',
    name: 'Operational Transformation (OT)',
    description: 'Centralized serialization matrices, transformation functions, and Google Docs concurrency.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: syncTopics.filter(t => t.group === 'Operational Transformation')
  },
  {
    id: 'crdt-math',
    name: 'CRDT Foundations & Semilattices',
    description: 'Join-semilattices, Strong Eventual Consistency, and Commutative/Associative/Idempotent merges.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: syncTopics.filter(t => t.group === 'CRDT Foundations')
  },
  {
    id: 'state-op-crdts',
    name: 'State & Operation CRDTs',
    description: 'G-Counters, PN-Counters, Last-Write-Wins registers, and Observed-Removed (OR) Sets.',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    topics: syncTopics.filter(t => t.group === 'State & Op CRDTs')
  },
  {
    id: 'sequence-crdts',
    name: 'Sequence CRDTs & Text',
    description: 'Replicated Growable Arrays (RGA), Yjs YATA, fractional indexing, and collaborative rich text.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: syncTopics.filter(t => t.group === 'Sequence CRDTs & Text')
  }
];

export const getSyncTopic = (id: string) => syncTopics.find(t => t.id === id);
