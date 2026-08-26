'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ChevronRight,
  Cpu,
  Flame,
  Lock,
  MemoryStick,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import {
  ARRAY_LEN,
  buildScript,
  cyclesFor,
  KERNEL_ADDR,
  KERNEL_BYTE,
  MEMORY,
  MITIGATION_INFO,
  PROBE_CANDIDATES,
  SCENARIO_INFO,
  SECRET_CHAR,
  type Mitigation,
  type Scenario,
} from './data';

const TICK_MS = 1400;

function hex(n: number): string {
  return '0x' + n.toString(16).toUpperCase().padStart(2, '0');
}

export default function SideChannelLab() {
  const [scenario, setScenario] = useState<Scenario>('legit');
  const [mitigation, setMitigation] = useState<Mitigation>('none');
  const [cursor, setCursor] = useState(0);
  const [auto, setAuto] = useState(false);

  const script = useMemo(() => buildScript(scenario, mitigation), [scenario, mitigation]);
  const total = script.steps.length;
  const finished = cursor >= total;

  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => {
      setCursor((c) => Math.min(c + 1, total));
    }, TICK_MS);
    return () => clearTimeout(t);
  }, [auto, cursor, total]);

  useEffect(() => {
    if (cursor >= total && auto) setAuto(false);
  }, [cursor, auto, total]);

  const pickScenario = (s: Scenario) => {
    setScenario(s);
    setCursor(0);
    setAuto(false);
  };

  const pickMitigation = (m: Mitigation) => {
    setMitigation(m);
    setCursor(0);
    setAuto(false);
  };

  const executed = useMemo(() => script.steps.slice(0, cursor), [script, cursor]);

  const cacheState = useMemo(() => {
    const warm = new Set<string>();
    const specWarm = new Set<string>();
    for (const s of executed) {
      if (s.action === 'flush') {
        warm.clear();
        specWarm.clear();
      } else if (s.action === 'warm' && typeof s.target === 'number') {
        warm.add('d' + s.target);
      } else if (s.action === 'speculate') {
        specWarm.add(s.target === 'kernel' ? 'kernel' : 'secret');
      }
    }
    return { warm, specWarm };
  }, [executed]);

  const probed = executed.some((s) => s.action === 'probe');
  const revealed = executed.some((s) => s.action === 'reveal');
  const predictor =
    [...executed].reverse().find((s) => s.predictor)?.predictor ?? 'idle';
  const mispredicted = predictor.indexOf('MISPREDICTED') >= 0;
  const stalled = predictor.indexOf('lfence') >= 0;
  const leakedKey = revealed ? (scenario === 'meltdown' ? 'kernel' : 'secret') : null;

  const lineStatus = (key: string): 'cold' | 'warm' | 'spec' => {
    if (cacheState.specWarm.has(key)) return 'spec';
    if (cacheState.warm.has(key)) return 'warm';
    return 'cold';
  };

  const segBtn = (active: boolean, onClick: () => void, label: string, danger?: boolean) => (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        'px-3 py-1.5 text-xs font-semibold transition-colors ' +
        (active
          ? danger
            ? 'bg-rose-500 text-white'
            : 'bg-amber-500 text-white'
          : 'bg-transparent text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800')
      }
    >
      {label}
    </button>
  );

  const memTone = (key: string) => {
    const st = lineStatus(key);
    if (st === 'spec')
      return 'border-amber-400 bg-amber-100 dark:border-amber-500 dark:bg-amber-500/20 animate-pulse';
    if (st === 'warm') return 'border-amber-300 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-500/10';
    return 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900';
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Hardware Security &middot; Microarchitecture
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Speculative Execution Playground
          </h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Watch a bounds-checked program, a Spectre v1 gadget, and a Meltdown load race the branch
            predictor and the MMU - then toggle lfence or KPTI and watch the leak die.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-5 py-7">
        {/* Controls */}
        <section
          aria-label="Experiment controls"
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <div
              role="group"
              aria-label="Scenario"
              className="flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
            >
              {(['legit', 'spectre', 'meltdown'] as Scenario[]).map((s) =>
                segBtn(scenario === s, () => pickScenario(s), s === 'legit' ? 'Legit' : s === 'spectre' ? 'Spectre' : 'Meltdown', s !== 'legit')
              )}
            </div>
            <div
              role="group"
              aria-label="Mitigation"
              className="flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700"
            >
              {(['none', 'lfence', 'kpti'] as Mitigation[]).map((m) =>
                segBtn(mitigation === m, () => pickMitigation(m), m === 'none' ? 'No mitigation' : m === 'lfence' ? 'lfence' : 'KPTI')
              )}
            </div>
            <button
              type="button"
              onClick={() => setCursor((c) => Math.min(c + 1, total))}
              disabled={finished}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-600 bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
              Step
            </button>
            <button
              type="button"
              onClick={() => setAuto((a) => !a)}
              disabled={finished}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-600 px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-amber-400 dark:hover:bg-amber-500/10"
            >
              {auto ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {auto ? 'Pause' : 'Auto-run'}
            </button>
            <button
              type="button"
              onClick={() => {
                setCursor(0);
                setAuto(false);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
            <span className="ml-auto font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {Math.min(cursor, total)} / {total}
            </span>
          </div>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{SCENARIO_INFO[scenario].blurb}</p>
          <p className="mt-1 text-xs italic text-zinc-500 dark:text-zinc-400">{MITIGATION_INFO[mitigation].detail}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          {/* LEFT: memory + branch + cache */}
          <section
            aria-label="Microarchitectural state"
            className="space-y-5 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            {/* Branch / predictor */}
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Cpu className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                Branch &amp; predictor
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg bg-zinc-950 p-3 font-mono text-xs">
                <span className="text-zinc-300">if (idx {'<'} LEN)</span>
                <span
                  className={
                    'ml-auto rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-all duration-500 ' +
                    (mispredicted
                      ? 'animate-pulse bg-amber-500 text-zinc-950'
                      : stalled
                        ? 'bg-zinc-700 text-zinc-300'
                        : 'border border-zinc-700 text-zinc-400')
                  }
                >
                  predictor: {predictor}
                </span>
              </div>
            </div>

            {/* Memory grid */}
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <MemoryStick className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                User memory @ 0x9000
                <span className="ml-2 text-xs font-normal italic text-zinc-500 dark:text-zinc-400">
                  array1[{ARRAY_LEN}] + out-of-bounds SECRET
                </span>
              </h2>
              {scenario === 'meltdown' && (
                <div className="mt-2 flex items-center gap-3 rounded-lg border border-dashed border-zinc-400 bg-zinc-100 p-2.5 dark:border-zinc-600 dark:bg-zinc-800/60">
                  <Lock className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" aria-hidden />
                  <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">ring-0</span>
                  <span className="font-mono text-xs font-bold">{KERNEL_ADDR}</span>
                  <span className="ml-auto rounded bg-zinc-200 px-2 py-0.5 font-mono text-xs font-black dark:bg-zinc-700">
                    {leakedKey === 'kernel' ? hex(KERNEL_BYTE) : '0x??'}
                  </span>
                </div>
              )}
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {MEMORY.map((slot, i) => {
                  const key = slot.secret ? 'secret' : 'd' + i;
                  const isLeaked = leakedKey === key || (slot.secret && leakedKey === 'secret');
                  return (
                    <div
                      key={slot.addr}
                      className={
                        'rounded-lg border p-2 text-center transition-all duration-500 ' +
                        (slot.secret
                          ? isLeaked
                            ? 'animate-pulse border-amber-500 bg-amber-100 dark:bg-amber-500/20'
                            : 'dashed border-amber-500 border-dashed bg-white dark:bg-zinc-900'
                          : memTone(key))
                      }
                    >
                      <p className="font-mono text-[9px] text-zinc-400 dark:text-zinc-500">{slot.addr}</p>
                      <p className="font-mono text-sm font-black">
                        {isLeaked ? slot.value : slot.secret ? '0x??' : slot.value}
                      </p>
                      {slot.secret && (
                        <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                          secret
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cache rows */}
            <div>
              <h2 className="text-sm font-bold">Cache lines (direct-mapped model)</h2>
              <ul className="mt-2 space-y-1">
                {(scenario === 'meltdown' ? ['kernel', 'secret', 'd'] : ['secret', 'd']).map((group) =>
                  group === 'd' ? null : (
                    <li
                      key={'line-' + group}
                      className={
                        'flex items-center justify-between rounded-md border px-3 py-1.5 transition-all duration-500 ' +
                        memTone(group)
                      }
                    >
                      <span className="font-mono text-[11px]">
                        {group === 'kernel' ? 'kernel line @ ' + KERNEL_ADDR.slice(0, 10) : group === 'secret' ? 'line @ 0x9008 (SECRET)' : ''}
                      </span>
                      <LineBadge status={lineStatus(group)} />
                    </li>
                  )
                )}
                {MEMORY.map((_, i) => {
                  const key = 'd' + i;
                  return (
                    <li
                      key={key}
                      className={
                        'flex items-center justify-between rounded-md border px-3 py-1.5 transition-all duration-500 ' +
                        memTone(key)
                      }
                    >
                      <span className="font-mono text-[11px]">line @ 0x90{'0' + i}</span>
                      <LineBadge status={lineStatus(key)} />
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          {/* RIGHT: trace + probe */}
          <section
            aria-label="Instruction trace and timing oracle"
            className="space-y-5 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <h2 className="text-sm font-bold">Execution trace</h2>
              <div aria-live="polite">
                {cursor === 0 ? (
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Press Step or Auto-run to begin the scenario.
                  </p>
                ) : (
                  <ul className="mt-2 max-h-[340px] space-y-2 overflow-y-auto pr-1">
                    {[...executed]
                      .reverse()
                      .map((s, ri) => (
                        <li
                          key={'step-' + (executed.length - 1 - ri)}
                          className="rounded-lg border border-zinc-200 p-2.5 dark:border-zinc-800"
                        >
                          <p className="break-words font-mono text-[11px] font-bold">{s.label}</p>
                          <p className="mt-0.5 text-[11px] leading-snug text-zinc-600 dark:text-zinc-300">
                            {s.detail}
                          </p>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Probe panel */}
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold">
                <Timer className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
                Flush+reload oracle
              </h2>
              {!probed ? (
                <p className="mt-2 text-xs italic text-zinc-500 dark:text-zinc-400">
                  Timings appear once the sweep step runs.
                </p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {PROBE_CANDIDATES.map((b, i) => {
                    const hot = i === 3;
                    const cyc = cyclesFor(i);
                    const pct = Math.round((cyc / 280) * 100);
                    return (
                      <li key={b} className="flex items-center gap-2">
                        <span
                          className={
                            'w-12 shrink-0 font-mono text-[11px] font-bold ' +
                            (hot ? 'text-amber-600 dark:text-amber-400' : 'text-zinc-500 dark:text-zinc-400')
                          }
                        >
                          {hex(b)}
                        </span>
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                          <div
                            className={
                              'h-full rounded-full transition-all duration-700 ' +
                              (hot ? 'bg-amber-500' : 'bg-zinc-400 dark:bg-zinc-600')
                            }
                            style={{ width: pct + '%' }}
                          />
                        </div>
                        <span className="w-14 shrink-0 text-right font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                          {cyc}cyc
                        </span>
                        {hot && revealed && (
                          <span className="shrink-0 rounded bg-amber-500 px-1.5 py-0.5 font-mono text-[10px] font-black text-zinc-950">
                            {SECRET_CHAR}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Verdict */}
            {finished && (
              <div
                role="status"
                className={
                  'rounded-lg p-3.5 ' +
                  (script.outcome === 'leak'
                    ? 'border border-amber-500 bg-amber-50 dark:bg-amber-500/10'
                    : 'border border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10')
                }
              >
                <p
                  className={
                    'flex items-center gap-2 text-sm font-black ' +
                    (script.outcome === 'leak'
                      ? 'text-amber-700 dark:text-amber-400'
                      : 'text-emerald-700 dark:text-emerald-400')
                  }
                >
                  {script.outcome === 'leak' ? (
                    <Flame className="h-4 w-4" aria-hidden />
                  ) : (
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  )}
                  {script.verdictTitle}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {script.verdictText}
                </p>
              </div>
            )}
          </section>
        </div>

        <p className="text-center text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400">
          Teaching model: timings are synthetic and the cache is simplified to one line per address.
          Real flush+reload probes hundreds of lines at sub-microsecond resolution.
        </p>
      </main>
    </div>
  );
}

function LineBadge({ status }: { status: 'cold' | 'warm' | 'spec' }) {
  if (status === 'spec')
    return (
      <span className="animate-pulse rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black uppercase text-zinc-950">
        spec-warm
      </span>
    );
  if (status === 'warm')
    return (
      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-black uppercase text-amber-700 dark:bg-amber-500/25 dark:text-amber-300">
        warm
      </span>
    );
  return (
    <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
      cold
    </span>
  );
}
