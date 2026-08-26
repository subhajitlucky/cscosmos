'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  GitBranch,
  ListOrdered,
  MousePointerClick,
  RotateCcw,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import {
  INITIAL_STATE,
  INVARIANT_FORMULA,
  applyAction,
  describeState,
  enabledActions,
  exploreSpace,
  parseKey,
  stateKey,
  violates,
  type EnabledAction,
  type SysState,
} from './data';

function SectionCard({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: LucideIcon;
  title: React.ReactNode;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-label={typeof title === 'string' ? title : 'Trace pane'}
      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

const PC_INITIAL: Record<string, string> = { idle: 'I', wait: 'W', trying: 'T', critical: 'C' };

function nodeLabel(key: string): string {
  const s = parseKey(key);
  return (
    PC_INITIAL[s.pc0] +
    '|' +
    (s.lock === 'free' ? 'F' : s.lock.charAt(1)) +
    '|' +
    PC_INITIAL[s.pc1]
  );
}

interface TraceStep {
  key: string;
  actionLabel: string | null;
}

export default function TlaStateExplorer() {
  const [atomic, setAtomic] = useState(true);
  const [invariantOn, setInvariantOn] = useState(true);
  const [currentKey, setCurrentKey] = useState<string>(() => stateKey(INITIAL_STATE));
  const [visited, setVisited] = useState<string[]>(() => [stateKey(INITIAL_STATE)]);
  const [edges, setEdges] = useState<{ from: string; to: string }[]>([]);
  const [transitions, setTransitions] = useState(0);
  const [dedupSkips, setDedupSkips] = useState(0);
  const [dedupFlash, setDedupFlash] = useState<string | null>(null);
  const [violationKey, setViolationKey] = useState<string | null>(null);

  const parentsRef = useRef<Map<string, { prev: string; actionLabel: string }>>(new Map());

  useEffect(() => {
    if (!dedupFlash) return;
    const t = setTimeout(() => setDedupFlash(null), 900);
    return () => clearTimeout(t);
  }, [dedupFlash]);

  const reset = (nextAtomic: boolean): void => {
    setAtomic(nextAtomic);
    const k = stateKey(INITIAL_STATE);
    setCurrentKey(k);
    setVisited([k]);
    setEdges([]);
    setTransitions(0);
    setDedupSkips(0);
    setDedupFlash(null);
    setViolationKey(null);
    parentsRef.current = new Map();
  };

  const space = useMemo(() => exploreSpace(atomic), [atomic]);
  const actions: EnabledAction[] = enabledActions(parseKey(currentKey), atomic);

  const fire = (action: EnabledAction): void => {
    const next: SysState | null = applyAction(parseKey(currentKey), action.id);
    if (!next) return;
    const k = stateKey(next);
    parentsRef.current.set(k, { prev: currentKey, actionLabel: action.label });
    setTransitions((t) => t + 1);
    setEdges((e) => [...e, { from: currentKey, to: k }]);
    const isNew = !visited.includes(k);
    if (!isNew) {
      // Successor already in the visited set - the graph dedups it.
      setDedupSkips((d) => d + 1);
      setDedupFlash(k);
    }
    setCurrentKey(k);
    if (invariantOn && violates(next)) {
      setViolationKey((prev) => prev ?? k);
    }
  };

  const pathTo = (targetKey: string): TraceStep[] => {
    const steps: TraceStep[] = [{ key: targetKey, actionLabel: null }];
    let cursor = targetKey;
    let guard = 0;
    while (cursor !== stateKey(INITIAL_STATE) && guard < 200) {
      const parent = parentsRef.current.get(cursor);
      if (!parent) break;
      steps.push({ key: parent.prev, actionLabel: parent.actionLabel });
      cursor = parent.prev;
      guard += 1;
    }
    return steps.reverse();
  };

  const trace: TraceStep[] = pathTo(violationKey ?? currentKey);

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    visited.forEach((k, i) => {
      if (i === 0) {
        map.set(k, { x: 300, y: 180 });
        return;
      }
      const angle = i * 2.399963;
      const radius = Math.min(148, 23 * Math.sqrt(i));
      map.set(k, { x: 300 + radius * Math.cos(angle), y: 175 + radius * Math.sin(angle) });
    });
    return map;
  }, [visited]);

  const currentState = parseKey(currentKey);
  const broken = !atomic;

  const pcChip = (pc: string): string =>
    pc === 'critical'
      ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/25 dark:text-teal-200'
      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300';

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <header className="flex flex-wrap items-start gap-3">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight">Formal Methods &amp; TLA+</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Explore every reachable state of a two-process mutual exclusion spec by hand - and catch the
            interleaving that breaks the invariant.
          </p>
        </div>
        <code className="ml-auto hidden rounded bg-zinc-100 px-2 py-1 text-[10px] text-zinc-600 md:block dark:bg-zinc-800 dark:text-zinc-400">
          {INVARIANT_FORMULA}
        </code>
      </header>

      <SectionCard icon={ShieldCheck} title="Spec configuration" sub="The atomic protocol is correct; the split check-then-set variant harbors a race.">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
          <label className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={atomic}
              onChange={(e) => reset(e.target.checked)}
              className="accent-teal-600"
            />
            atomic Enter (TestLock+SetLock indivisible)
          </label>
          <label className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={invariantOn}
              onChange={(e) => setInvariantOn(e.target.checked)}
              className="accent-teal-600"
            />
            enforce NotBothInCS invariant
          </label>
          <button
            type="button"
            onClick={() => reset(atomic)}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Restart explorer
          </button>
          <span
            className={
              'rounded px-2 py-0.5 font-bold uppercase tracking-wide ' +
              (broken
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                : 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200')
            }
          >
            {broken ? 'split protocol - buggy' : 'atomic protocol'}
          </span>
        </div>
      </SectionCard>

      <SectionCard icon={MousePointerClick} title="Current state · click an enabled action" sub="Each click fires one TLA+ step; revisited states are deduplicated against the visited set.">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={'rounded px-2 py-1 font-mono font-bold ' + pcChip(currentState.pc0)}>P0: {currentState.pc0}</span>
          <span className="rounded bg-zinc-800 px-2 py-1 font-mono font-bold text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900">
            lock: {currentState.lock}
          </span>
          <span className={'rounded px-2 py-1 font-mono font-bold ' + pcChip(currentState.pc1)}>P1: {currentState.pc1}</span>
          <span className="ml-auto inline-flex items-center gap-3 tabular-nums text-[11px] text-zinc-500 dark:text-zinc-400">
            <Activity className="inline h-3 w-3" aria-hidden />
            {visited.length}/{space.reachable} states visited · {transitions} steps · {dedupSkips} deduplicated
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => fire(a)}
              className={
                'rounded-lg border p-2 text-left transition-colors ' +
                (a.proc === 0
                  ? 'border-teal-300 bg-teal-50 hover:bg-teal-100 dark:border-teal-500/40 dark:bg-teal-500/10 dark:hover:bg-teal-500/20'
                  : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 dark:hover:bg-zinc-800')
              }
            >
              <span className="block text-xs font-bold">{a.label}</span>
              <code className="mt-0.5 block text-[9.5px] leading-snug text-zinc-500 dark:text-zinc-400">{a.formula}</code>
            </button>
          ))}
          {actions.length === 0 && (
            <p className="text-xs italic text-zinc-500 dark:text-zinc-400">Deadlock: no action is enabled here.</p>
          )}
        </div>
        {dedupFlash && (
          <p className="mt-2 rounded bg-zinc-100 px-2 py-1 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            successor already in visited set — merged, not duplicated ({nodeLabel(dedupFlash)})
          </p>
        )}
      </SectionCard>

      <SectionCard icon={GitBranch} title="Reachable-state diagram" sub="Every discovered state is placed once - the visited set grows as you explore.">
        <svg viewBox="0 0 600 360" className="h-auto w-full rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900" role="img" aria-label="State diagram">
          {edges.map((e, i) => {
            const a = positions.get(e.from);
            const b = positions.get(e.to);
            if (!a || !b || (a.x === b.x && a.y === b.y)) return null;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                strokeWidth={1.5}
                className="stroke-zinc-300 dark:stroke-zinc-700"
              />
            );
          })}
          {visited.map((k) => {
            const p = positions.get(k);
            if (!p) return null;
            const bad = invariantOn && violates(parseKey(k));
            const isCurrent = k === currentKey;
            const isInit = k === stateKey(INITIAL_STATE);
            return (
              <g key={k} transform={'translate(' + p.x.toFixed(1) + ',' + p.y.toFixed(1) + ')'}>
                {(isCurrent || bad) && (
                  <circle
                    r={24}
                    fill="none"
                    strokeWidth={2}
                    className={bad ? 'animate-pulse stroke-rose-500' : 'animate-pulse stroke-teal-500'}
                  />
                )}
                <circle
                  r={17}
                  strokeWidth={isCurrent ? 2.5 : 1.5}
                  className={
                    bad
                      ? 'fill-rose-100 stroke-rose-500 dark:fill-rose-500/25'
                      : isCurrent
                        ? 'fill-white stroke-teal-600 dark:fill-zinc-900 dark:stroke-teal-400'
                        : 'fill-white stroke-zinc-400 dark:fill-zinc-800 dark:stroke-zinc-600'
                  }
                />
                <text
                  y={4}
                  textAnchor="middle"
                  className={
                    bad
                      ? 'fill-rose-700 font-mono text-[9px] font-bold dark:fill-rose-300'
                      : 'fill-zinc-700 font-mono text-[9px] font-bold dark:fill-zinc-200'
                  }
                >
                  {nodeLabel(k)}
                </text>
                {isInit && (
                  <text y={-24} textAnchor="middle" className="fill-zinc-400 text-[8px] font-semibold dark:fill-zinc-500">
                    Init
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          Node code: P0 phase | lock owner | P1 phase — I=idle W=wait T=trying C=critical, F=lock free.
          A full TLC run would enumerate all {space.reachable} reachable states ({space.violating} violating).
        </p>
      </SectionCard>

      <SectionCard
        icon={ListOrdered}
        title={
          violationKey && invariantOn ? (
            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" aria-hidden /> Counterexample trace — invariant violated
            </span>
          ) : (
            'Exploration trace'
          )
        }
        sub={
          violationKey && invariantOn
            ? 'The exact action sequence TLC would print: init to the bad state.'
            : 'Steps from Init to the current state.'
        }
      >
        {trace.length <= 1 && !(violationKey && invariantOn) ? (
          <p className="text-xs italic text-zinc-500 dark:text-zinc-400">
            Still at Init - fire some actions above and this pane records the run.
          </p>
        ) : (
          <ol className="space-y-1.5">
            {trace.map((step, i) => {
              const bad = violates(parseKey(step.key));
              const isLastViolation = violationKey && invariantOn && step.key === violationKey;
              return (
                <li key={step.key + '-' + i} className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="w-6 shrink-0 text-right font-bold tabular-nums text-zinc-400 dark:text-zinc-500">{i}</span>
                  {step.actionLabel ? (
                    <span className="rounded bg-teal-100 px-2 py-0.5 font-semibold text-teal-800 dark:bg-teal-500/20 dark:text-teal-200">
                      {step.actionLabel}
                    </span>
                  ) : (
                    <span className="rounded bg-zinc-200 px-2 py-0.5 font-semibold text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      Init
                    </span>
                  )}
                  <code
                    className={
                      'rounded px-2 py-0.5 font-mono ' +
                      (bad
                        ? 'bg-rose-100 font-bold text-rose-700 ring-1 ring-rose-400 dark:bg-rose-500/20 dark:text-rose-300'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300')
                    }
                  >
                    {describeState(parseKey(step.key))}
                  </code>
                  {isLastViolation && (
                    <span className="animate-pulse text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      both processes in CS
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
        {!invariantOn && (
          <p className="mt-2 text-[11px] italic text-zinc-500 dark:text-zinc-400">
            The invariant monitor is off - flip it on to flag violating states the moment they appear.
          </p>
        )}
      </SectionCard>
    </main>
  );
}
