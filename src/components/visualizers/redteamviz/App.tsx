'use client';

import { useMemo, useState } from 'react';
import {
  CONTROLS,
  EDGES,
  NODES,
  ORDER,
  STAGE_BY_KEY,
  type DetectionControl,
  type KillChainStage,
  type NodeId,
  type StageKey,
} from './data';

const NODE_W = 128;
const NODE_H = 64;

interface BlockedAttempt {
  stage: StageKey;
  control: DetectionControl;
}

function nodeCenter(id: NodeId): { cx: number; cy: number } {
  const n = NODES.find((item) => item.id === id);
  return { cx: (n?.x ?? 0) + NODE_W / 2, cy: (n?.y ?? 0) + NODE_H / 2 };
}

export default function RedTeamLab() {
  const [enabled, setEnabled] = useState<string[]>([]);
  const [done, setDone] = useState<StageKey[]>([]);
  const [blocked, setBlocked] = useState<BlockedAttempt | null>(null);
  const [containedCount, setContainedCount] = useState(0);

  const allDone = done.length === ORDER.length;
  const nextStage: StageKey | undefined = allDone ? undefined : ORDER[done.length];

  const compromisedNodes = useMemo(() => {
    const set = new Set<NodeId>();
    for (const key of done) set.add(STAGE_BY_KEY[key].targetNode);
    return set;
  }, [done]);

  const reportStage: KillChainStage | null = blocked
    ? STAGE_BY_KEY[blocked.stage]
    : done.length > 0
      ? STAGE_BY_KEY[done[done.length - 1]]
      : null;

  function toggleControl(id: string) {
    setEnabled((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  function advance() {
    if (!nextStage || blocked) return;
    const control = CONTROLS.find((c) => c.stage === nextStage && enabled.includes(c.id));
    if (control) {
      setBlocked({ stage: nextStage, control });
      setContainedCount((n) => n + 1);
    } else {
      setDone((prev) => [...prev, nextStage]);
    }
  }

  function reset() {
    setDone([]);
    setBlocked(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3 px-5 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
              Penetration Testing &amp; Red Teaming
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">The Kill Chain Simulator</h1>
            <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
              Step through an attack chain the way defenders study it - one MITRE technique at a time -
              then flip on blue-team controls and watch each link shatter.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/50 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Defensive education only - no exploit content
          </span>
        </div>
      </header>

      {/* Stepper */}
      <nav aria-label="Kill chain progress" className="mx-auto max-w-6xl px-5 pt-6">
        <ol className="flex flex-wrap gap-2">
          {ORDER.map((key, i) => {
            const isDone = done.includes(key);
            const isBlockedHere = blocked?.stage === key;
            const isNext = key === nextStage && !blocked;
            const base = 'flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ';
            let cls = 'border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400';
            if (isDone) cls = 'border-rose-600 bg-rose-600 text-white dark:border-rose-500 dark:bg-rose-500';
            else if (isBlockedHere) cls = 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500';
            else if (isNext) cls = 'border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400 animate-pulse';
            return (
              <li key={key} className={base + cls}>
                <span className="text-xs opacity-80">{i + 1}</span> {STAGE_BY_KEY[key].title}
                {isDone && <span aria-hidden> &#10003;</span>}
                {isBlockedHere && <span aria-hidden> &#128737;</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[minmax(320px,470px)_1fr]">
        {/* Map + action row */}
        <section aria-label="Corporate network map" className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-bold">Corporate network</h2>
          <svg viewBox="0 0 540 300" role="img" aria-label="Map of five corporate hosts and their links" className="mt-2 w-full select-none">
            {EDGES.map(([a, b]) => {
              const ca = nodeCenter(a);
              const cb = nodeCenter(b);
              const hot = compromisedNodes.has(a) || compromisedNodes.has(b);
              return (
                <line
                  key={a + '-' + b}
                  x1={ca.cx}
                  y1={ca.cy}
                  x2={cb.cx}
                  y2={cb.cy}
                  strokeWidth={hot ? 2.5 : 1.5}
                  className={hot ? 'stroke-rose-400 dark:stroke-rose-500' : 'stroke-zinc-300 dark:stroke-zinc-700'}
                />
              );
            })}

            {NODES.map((n) => {
              const compromised = compromisedNodes.has(n.id);
              const isTarget = nextStage !== undefined && STAGE_BY_KEY[nextStage].targetNode === n.id && !blocked;
              const containedHere = blocked?.stage !== undefined && STAGE_BY_KEY[blocked.stage].targetNode === n.id;
              return (
                <g key={n.id}>
                  <rect
                    x={n.x}
                    y={n.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx="10"
                    strokeWidth={compromised || containedHere ? 2.5 : isTarget ? 2 : 1.5}
                    strokeDasharray={isTarget ? '6 4' : undefined}
                    className={
                      compromised
                        ? 'fill-rose-50 stroke-rose-500 dark:fill-rose-500/15 dark:stroke-rose-400'
                        : containedHere
                          ? 'fill-emerald-50 stroke-emerald-600 dark:fill-emerald-500/10 dark:stroke-emerald-400'
                          : 'fill-white stroke-zinc-400 dark:fill-zinc-900 dark:stroke-zinc-600'
                    }
                  />
                  <text x={n.x + NODE_W / 2} y={n.y + 27} textAnchor="middle" className="fill-zinc-800 text-[12px] font-bold dark:fill-zinc-100">
                    {n.label}
                  </text>
                  <text x={n.x + NODE_W / 2} y={n.y + 45} textAnchor="middle" className="fill-zinc-500 text-[9px] dark:fill-zinc-400">
                    {n.role}
                  </text>
                  {containedHere && (
                    <text x={n.x + NODE_W / 2} y={n.y - 8} textAnchor="middle" className="fill-emerald-600 text-[10px] font-bold dark:fill-emerald-400">
                      CONTAINED
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={advance}
              disabled={!nextStage || !!blocked}
              className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
            >
              {allDone
                ? 'Chain complete - reset to rerun'
                : blocked
                  ? 'Contained - reset to retry'
                  : 'Advance: ' + STAGE_BY_KEY[nextStage as StageKey].title}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-rose-400 hover:text-rose-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-rose-500 dark:hover:text-rose-400"
            >
              Reset exercise
            </button>
          </div>

          {/* Blue-team console */}
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Blue-team console</h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">{enabled.length}/{CONTROLS.length} active</span>
            </div>
            <ul className="mt-2 space-y-2">
              {CONTROLS.map((c) => {
                const on = enabled.includes(c.id);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => toggleControl(c.id)}
                      aria-pressed={on}
                      className={
                        'w-full rounded-md border p-2 text-left transition-colors ' +
                        (on
                          ? 'border-emerald-500 bg-emerald-100/70 dark:border-emerald-400 dark:bg-emerald-500/15'
                          : 'border-zinc-200 bg-white hover:border-emerald-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500')
                      }
                    >
                      <span className={'mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle ' + (on ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-600')} />
                      <span className="text-sm font-semibold">{c.name}</span>
                      <span className="block pl-[18px] text-xs leading-snug text-zinc-600 dark:text-zinc-400">{c.howItWorks}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
              Tip: enable a control, reset, and advance again to see it fire.
            </p>
          </div>
        </section>

        {/* Stage report */}
        <section aria-label="Stage report" className="flex flex-col gap-6">
          {!reportStage ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-bold">Mission briefing</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                Press <strong>Advance</strong> to execute the first link of the chain. Each stage pairs the
                attacker&rsquo;s intent with exactly what defenders see in their logs. Real intrusions are rarely
                cleverer than this - they are just quieter.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold">
                    Stage {reportStage.num}: {reportStage.title}
                    {blocked && <span className="ml-2 align-middle text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">- attempt failed</span>}
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-zinc-400">{reportStage.technique}</p>
                </div>
                <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                  {reportStage.tactic}
                </span>
              </div>

              {blocked && (
                <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <span className="font-bold">&#128737; Detection fired: {blocked.control.name}.</span>{' '}
                  {blocked.control.howItWorks}
                </div>
              )}

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-500/30 dark:bg-rose-500/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">Attacker view</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{reportStage.attackerView}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Defender telemetry</h3>
                  <ul className="mt-2 space-y-1.5">
                    {reportStage.defenderLogs.map((log, i) => (
                      <li key={i} className="font-mono text-[11px] leading-relaxed">
                        <span className="font-bold text-emerald-400">[{log.source}]</span>{' '}
                        <span className="text-zinc-300">{log.line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="mt-4 border-l-2 border-rose-400 pl-3 text-sm italic text-zinc-600 dark:border-rose-500 dark:text-zinc-400">
                {reportStage.lesson}
              </p>
            </div>
          )}

          {/* Debrief */}
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-base font-bold">Debrief scorecard</h2>
            <dl className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Stages executed</dt>
                <dd className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{done.length}/5</dd>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Detections fired</dt>
                <dd className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{containedCount}</dd>
              </div>
              <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Controls armed</dt>
                <dd className="mt-1 text-2xl font-bold text-zinc-800 dark:text-zinc-200">{enabled.length}/5</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {allDone
                ? 'The full chain succeeded against an unmonitored network. Arm controls in the blue-team console, reset, and rerun - defense in depth turns five easy steps into five walls.'
                : blocked
                  ? 'One detection stopped the whole chain. Attackers need every link to hold; defenders only need one.'
                  : 'Every successful stage above was invisible until its telemetry existed. Blue teams win by making steps observable and expensive.'}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Technique identifiers follow the MITRE ATT&amp;CK&amp;reg; framework - the shared vocabulary defenders use to
            describe adversary behavior. All hosts, users, addresses (RFC 5737 documentation ranges), and log lines here are synthetic.
          </p>
        </section>
      </main>
    </div>
  );
}
