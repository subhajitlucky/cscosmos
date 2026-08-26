// TLA+-style state-explorer kernels: a two-process mutual exclusion spec with
// an atomic (safe) and a split check-then-set (broken) protocol variant.
// Pure data structures and helpers - no browser APIs - safe for module scope.

/* ---------------------------------- model ---------------------------------- */

/** Control-state of one process. "trying" only exists in the split protocol. */
export type Pc = 'idle' | 'wait' | 'trying' | 'critical';

export type LockOwner = 'free' | 'p0' | 'p1';

export interface SysState {
  pc0: Pc;
  pc1: Pc;
  lock: LockOwner;
}

export const INITIAL_STATE: SysState = { pc0: 'idle', pc1: 'idle', lock: 'free' };

export function stateKey(s: SysState): string {
  return s.pc0 + '/' + s.lock + '/' + s.pc1;
}

export function describeState(s: SysState): string {
  return 'pc0=' + s.pc0 + '  lock=' + s.lock + '  pc1=' + s.pc1;
}

/** The safety property: at most one process inside the critical section. */
export function violates(s: SysState): boolean {
  return s.pc0 === 'critical' && s.pc1 === 'critical';
}

// eslint-disable-next-line no-useless-escape -- backslash is TLA+ conjunction
export const INVARIANT_FORMULA = 'Invariant NotBothInCS := ~(pc0 = "critical" /\ pc1 = "critical")';

export function parseKey(key: string): SysState {
  const parts = key.split('/');
  return {
    pc0: (parts[0] ?? 'idle') as Pc,
    lock: (parts[1] ?? 'free') as LockOwner,
    pc1: (parts[2] ?? 'idle') as Pc,
  };
}

/* --------------------------------- actions --------------------------------- */

export interface EnabledAction {
  id: string;
  label: string;
  proc: 0 | 1;
  /** TLA+-style successor formula shown under the button. */
  formula: string;
}

const REQ = (p: 0 | 1): EnabledAction => ({
  id: p === 0 ? 'req0' : 'req1',
  label: 'P' + p + ' Request',
  proc: p,
  formula: "pc[" + p + "] = idle /\\ pc[" + p + "]' = wait",
});

const ENTER = (p: 0 | 1): EnabledAction => ({
  id: p === 0 ? 'enter0' : 'enter1',
  label: 'P' + p + ' Enter CS',
  proc: p,
  formula:
    "pc[" + p + "] = wait /\\ lock = free /\\ pc[" + p + "]' = critical /\\ lock' = p" + p,
});

const TEST = (p: 0 | 1): EnabledAction => ({
  id: p === 0 ? 'test0' : 'test1',
  label: 'P' + p + ' TestLock',
  proc: p,
  formula: "pc[" + p + "] = wait /\\ lock = free /\\ pc[" + p + "]' = trying   (* check only! *)",
});

const SETL = (p: 0 | 1): EnabledAction => ({
  id: p === 0 ? 'set0' : 'set1',
  label: 'P' + p + ' SetLock+Go',
  proc: p,
  formula: "pc[" + p + "]' = critical   (* ...but never takes the lock *)",
});

const REL = (p: 0 | 1): EnabledAction => ({
  id: p === 0 ? 'rel0' : 'rel1',
  label: 'P' + p + ' Release',
  proc: p,
  formula: "pc[" + p + "] = critical /\\ pc[" + p + "]' = idle /\\ lock' = free",
});

/**
 * Actions enabled in `s`. atomic=true merges check+set into one indivisible
 * step (the correct protocol); atomic=false splits them so another process
 * can slip between TestLock and SetLock - the classic race.
 */
export function enabledActions(s: SysState, atomic: boolean): EnabledAction[] {
  const out: EnabledAction[] = [];
  for (const p of [0, 1] as const) {
    const pc = p === 0 ? s.pc0 : s.pc1;
    if (pc === 'idle') out.push(REQ(p));
    if (pc === 'wait' && s.lock === 'free') {
      // Atomic protocol: one indivisible Enter step. Split protocol: check only.
      out.push(...(atomic ? [ENTER(p)] : [TEST(p)]));
    }
    if (pc === 'trying') out.push(SETL(p));
    if (pc === 'critical') out.push(REL(p));
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/** Fire an action; returns the successor state or null if the action is stale. */
export function applyAction(s: SysState, actionId: string): SysState | null {
  const next: SysState = { ...s };
  switch (actionId) {
    case 'req0':
      if (s.pc0 !== 'idle') return null;
      next.pc0 = 'wait';
      return next;
    case 'req1':
      if (s.pc1 !== 'idle') return null;
      next.pc1 = 'wait';
      return next;
    case 'enter0':
      if (s.pc0 !== 'wait' || s.lock !== 'free') return null;
      next.pc0 = 'critical';
      next.lock = 'p0';
      return next;
    case 'enter1':
      if (s.pc1 !== 'wait' || s.lock !== 'free') return null;
      next.pc1 = 'critical';
      next.lock = 'p1';
      return next;
    case 'test0':
      if (s.pc0 !== 'wait' || s.lock !== 'free') return null;
      next.pc0 = 'trying';
      return next;
    case 'test1':
      if (s.pc1 !== 'wait' || s.lock !== 'free') return null;
      next.pc1 = 'trying';
      return next;
    case 'set0':
      if (s.pc0 !== 'trying') return null;
      next.pc0 = 'critical';
      return next;
    case 'set1':
      if (s.pc1 !== 'trying') return null;
      next.pc1 = 'critical';
      return next;
    case 'rel0':
      if (s.pc0 !== 'critical') return null;
      next.pc0 = 'idle';
      next.lock = 'free';
      return next;
    case 'rel1':
      if (s.pc1 !== 'critical') return null;
      next.pc1 = 'idle';
      next.lock = 'free';
      return next;
    default:
      return null;
  }
}

/* ------------------------- exhaustive reachability -------------------------- */

export interface SpaceSummary {
  reachable: number;
  violating: number;
}

/** Full BFS over the chosen protocol - used to show how big the graph CAN get. */
export function exploreSpace(atomic: boolean): SpaceSummary {
  const seen = new Set<string>([stateKey(INITIAL_STATE)]);
  const queue: SysState[] = [INITIAL_STATE];
  let violating = 0;
  while (queue.length > 0) {
    const s = queue.shift() as SysState;
    if (violates(s)) violating += 1;
    for (const a of enabledActions(s, atomic)) {
      const nxt = applyAction(s, a.id);
      if (!nxt) continue;
      const k = stateKey(nxt);
      if (!seen.has(k)) {
        seen.add(k);
        queue.push(nxt);
      }
    }
  }
  return { reachable: seen.size, violating };
}
