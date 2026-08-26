'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Cpu,
  Gauge,
  GitBranch,
  Layers,
  Pause,
  Play,
  RotateCcw,
  StepForward,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  CACHE_LINES,
  STAGE_NAMES,
  STAGE_COUNT,
  WORDS_PER_BLOCK,
  ARRAY_LEN,
  buildLoopProgram,
  frameCells,
  percent,
  retiredCount,
  runArrayPasses,
  simulatePipeline,
  type AccessRecord,
  type InstrKind,
} from './data';

function SectionCard({
  icon: Icon,
  title,
  sub,
  children,
}: {
  icon: LucideIcon;
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

const KIND_CHIP: Record<InstrKind, string> = {
  alu: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200',
  load: 'bg-amber-200 text-amber-800 dark:bg-amber-500/25 dark:text-amber-200',
  store: 'bg-amber-300 text-amber-900 dark:bg-amber-500/40 dark:text-amber-100',
  branch: 'bg-rose-200 text-rose-800 dark:bg-rose-500/25 dark:text-rose-200',
};

export default function CpuCacheLab() {
  /* ---------------------------- pipeline state ---------------------------- */
  const [mispredict, setMispredict] = useState(false);
  const [cycle, setCycle] = useState(1);
  const [pipePlaying, setPipePlaying] = useState(false);

  const instrs = useMemo(() => buildLoopProgram(), []);
  const sim = useMemo(() => simulatePipeline(mispredict), [mispredict]);

  useEffect(() => {
    if (!pipePlaying) return;
    if (cycle >= sim.totalCycles) {
      setPipePlaying(false);
      return;
    }
    const t = setTimeout(() => setCycle((c) => Math.min(sim.totalCycles, c + 1)), 380);
    return () => clearTimeout(t);
  }, [pipePlaying, cycle, sim.totalCycles]);

  const changeMispredict = (v: boolean) => {
    setMispredict(v);
    setCycle(1);
    setPipePlaying(false);
  };

  const retired = retiredCount(sim, cycle);
  const branchHit = mispredict && sim.branchResolveCycle !== null && cycle >= sim.branchResolveCycle;
  const pipeDone = cycle >= sim.totalCycles;
  const cpi = pipeDone ? (sim.totalCycles / instrs.length).toFixed(2) : null;

  const WIN = 10;
  const firstRow = Math.max(1, cycle - WIN + 1);
  const rows: number[] = [];
  for (let c = firstRow; c <= cycle; c++) rows.push(c);

  /* ----------------------------- cache state ------------------------------ */
  const [stride, setStride] = useState(1);
  const [cursor, setCursor] = useState(-1);
  const [cachePlaying, setCachePlaying] = useState(false);

  const recs = useMemo(() => runArrayPasses(stride, 2), [stride]);

  useEffect(() => {
    if (!cachePlaying) return;
    if (cursor >= recs.length - 1) {
      setCachePlaying(false);
      return;
    }
    const t = setTimeout(() => setCursor((c) => Math.min(recs.length - 1, c + 1)), 110);
    return () => clearTimeout(t);
  }, [cachePlaying, cursor, recs.length]);

  const changeStride = (v: number) => {
    setStride(v);
    setCursor(-1);
    setCachePlaying(false);
  };

  const shown: AccessRecord[] = recs.slice(0, cursor + 1);
  const latest: AccessRecord | null = shown.length > 0 ? shown[shown.length - 1] : null;
  const cacheDone = cursor >= recs.length - 1 && cursor >= 0;

  const pass1Total = recs.filter((r) => r.pass === 1).length;
  const pass2Total = recs.length - pass1Total;
  const p1HitsFinal = recs.filter((r) => r.pass === 1 && r.hit).length;
  const p2HitsFinal = recs.filter((r) => r.pass === 2 && r.hit).length;
  const hitsShown = shown.filter((r) => r.hit).length;
  const overallPct = percent(hitsShown, Math.max(1, shown.length));

  const lineLast = new Map<number, AccessRecord>();
  shown.forEach((r) => lineLast.set(r.line, r));
  const lines: number[] = [];
  for (let l = 0; l < CACHE_LINES; l++) lines.push(l);

  const trail = [...shown].reverse().slice(0, 22);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <style>{'@keyframes cpucell-in{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}' +
        '@keyframes cpupulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,.45)}50%{box-shadow:0 0 0 6px rgba(245,158,11,.12)}}'}</style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            Systems · Computer Architecture · CPU &amp; Caches
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Pipelines, Mispredictions &amp; Cache Lines</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Step a 5-stage pipeline cycle by cycle, inject a branch mispredict to watch speculative work get squashed,
            then sweep an array twice through a direct-mapped cache and tune the stride to feel spatial locality.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-7">
        {/* ----------------------------- pipeline ----------------------------- */}
        <SectionCard icon={Cpu} title="5-stage pipeline" sub="fetch · decode · execute · mem · writeback - one instruction enters per cycle">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPipePlaying((p) => !p)}
              disabled={pipeDone}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-600 bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pipePlaying ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
              {pipePlaying ? 'Pause' : 'Run'}
            </button>
            <button
              type="button"
              onClick={() => setCycle((c) => Math.min(sim.totalCycles, c + 1))}
              disabled={pipeDone || pipePlaying}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200"
            >
              <StepForward className="h-4 w-4" aria-hidden />
              Step
            </button>
            <button
              type="button"
              onClick={() => {
                setCycle(1);
                setPipePlaying(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={mispredict}
              onClick={() => changeMispredict(!mispredict)}
              className={
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ' +
                (mispredict
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-zinc-300 text-zinc-600 hover:border-rose-400 dark:border-zinc-700 dark:text-zinc-300')
              }
            >
              <GitBranch className="h-3.5 w-3.5" aria-hidden />
              branch mispredict {mispredict ? 'ARMED' : 'off'}
            </button>
            <span className="ml-auto font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
              cycle {cycle}/{sim.totalCycles} · retired {retired}/{instrs.length}
              {cpi !== null ? ' · CPI ' + cpi : ''}
            </span>
          </div>

          <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="min-w-[640px]">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: '56px repeat(' + STAGE_COUNT + ', minmax(0, 1fr))' }}>
                <span />
                {STAGE_NAMES.map((s) => (
                  <span key={s} className="text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {s}
                  </span>
                ))}
              </div>
              {rows.map((c) => {
                const cells = frameCells(sim, instrs, c);
                const isNow = c === cycle;
                return (
                  <div key={c} className="mt-1.5 grid gap-1.5" style={{ gridTemplateColumns: '56px repeat(' + STAGE_COUNT + ', minmax(0, 1fr))' }}>
                    <span
                      className={
                        'flex items-center justify-end pr-1 font-mono text-[10px] ' +
                        (isNow ? 'font-bold text-amber-700 dark:text-amber-300' : 'text-zinc-400 dark:text-zinc-500')
                      }
                    >
                      {c}
                    </span>
                    {cells.map((cell, si) => {
                      if (!cell) {
                        return <div key={si} className="h-9 rounded-md border border-dashed border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/40" />;
                      }
                      const cls = cell.ghost
                        ? 'border border-dashed border-rose-400 bg-rose-100 text-rose-700 line-through dark:bg-rose-500/15 dark:text-rose-300'
                        : 'border cpucell-in ' + (isNow ? 'cpupulse ' : '') + 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800';
                      return (
                        <div
                          key={cell.occurrenceKey}
                          className={'flex h-9 flex-col justify-center rounded-md px-1.5 ' + cls}
                          style={{ animationDelay: Math.max(0, (c - firstRow) * 18) + 'ms' }}
                        >
                          <span className="truncate font-mono text-[10px] font-bold leading-tight">{cell.instr.label}</span>
                          <span
                            className={
                              'truncate text-[9px] font-bold uppercase leading-tight ' +
                              (cell.ghost ? 'text-rose-500' : 'text-zinc-400 dark:text-zinc-500')
                            }
                          >
                            {cell.ghost ? 'squashed' : cell.instr.kind}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_260px]">
            <div aria-label="Program listing" className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">program</p>
              <ol className="mt-1.5 space-y-1">
                {instrs.map((ins) => (
                  <li key={ins.id} className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="w-4 shrink-0 text-right text-zinc-400 dark:text-zinc-500">{ins.id}</span>
                    <span className={'shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase ' + KIND_CHIP[ins.kind]}>{ins.kind}</span>
                    <span className="font-bold">{ins.label}</span>
                    <span className="hidden truncate italic text-zinc-400 sm:inline dark:text-zinc-500">; {ins.comment}</span>
                  </li>
                ))}
              </ol>
            </div>
            <aside
              role="status"
              className={
                'rounded-lg p-3 text-xs font-semibold leading-snug ' +
                (branchHit
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300'
                  : 'border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300')
              }
            >
              {branchHit ? (
                <>
                  <p className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    <GitBranch className="h-3.5 w-3.5" aria-hidden />
                    mispredict at cycle {sim.branchResolveCycle}
                  </p>
                  <p className="mt-1">
                    The branch resolves the wrong way: both younger speculative fetches are squashed (dashed rows) and
                    the correct path refills from Fetch.
                  </p>
                  <p className="mt-1 font-mono">+2 wasted cycles · CPI {cpi ?? '-'}</p>
                </>
              ) : (
                <p>
                  Arm the mispredict switch, reset, and run again: same program, more cycles. Deep pipelines pay this
                  tax every time a guess goes wrong.
                </p>
              )}
            </aside>
          </div>
        </SectionCard>

        {/* ------------------------------ cache -------------------------------- */}
        <SectionCard
          icon={Layers}
          title="Direct-mapped cache playground"
          sub={ARRAY_LEN + '-element array · ' + WORDS_PER_BLOCK + '-word blocks · ' + CACHE_LINES + ' lines · two passes per run'}
        >
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="stride-range" className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Gauge className="h-3.5 w-3.5" aria-hidden />
              stride
              <span className="w-8 rounded bg-zinc-100 px-1 text-center font-mono text-sm font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
                {stride}
              </span>
            </label>
            <input
              id="stride-range"
              type="range"
              min={1}
              max={8}
              step={1}
              value={stride}
              onChange={(e) => changeStride(Number(e.target.value))}
              className="w-48 accent-amber-500"
            />
            <button
              type="button"
              onClick={() => {
                setCursor(-1);
                setCachePlaying(true);
              }}
              disabled={cachePlaying}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-600 bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Zap className="h-4 w-4" aria-hidden />
              Run two passes
            </button>
            <button
              type="button"
              onClick={() => {
                setCursor(-1);
                setCachePlaying(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-2">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                <p className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <span>hit rate (live)</span>
                  <span className="font-mono text-sm text-zinc-800 dark:text-zinc-100">{overallPct}</span>
                </p>
                <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-150" style={{ width: overallPct }} />
                </div>
                <p className="mt-1 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                  {hitsShown} hits / {shown.length} accesses
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={
                    'rounded-lg border p-2.5 ' +
                    (cacheDone
                      ? 'border-rose-300 bg-rose-50/70 dark:border-rose-500/40 dark:bg-rose-500/10'
                      : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60')
                  }
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">pass 1 · cold</p>
                  <p className="font-mono text-lg font-bold">{percent(p1HitsFinal, pass1Total)}</p>
                  <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {p1HitsFinal}/{pass1Total} hit
                  </p>
                </div>
                <div
                  className={
                    'rounded-lg border p-2.5 ' +
                    (cacheDone
                      ? 'border-amber-300 bg-amber-50/70 dark:border-amber-500/40 dark:bg-amber-500/10'
                      : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60')
                  }
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">pass 2 · warm</p>
                  <p className="font-mono text-lg font-bold">{percent(p2HitsFinal, pass2Total)}</p>
                  <p className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                    {p2HitsFinal}/{pass2Total} hit
                  </p>
                </div>
              </div>
              <div aria-label="Access trail" className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">recent accesses</p>
                <div className="flex flex-wrap gap-1">
                  {trail.length === 0 ? (
                    <span className="text-[11px] italic text-zinc-500 dark:text-zinc-400">press run to sweep the array</span>
                  ) : (
                    trail.map((r) => (
                      <span
                        key={r.seq}
                        title={'pass ' + r.pass + ' element ' + r.index}
                        className={
                          'flex h-6 min-w-8 items-center justify-center rounded border px-1 font-mono text-[10px] font-bold ' +
                          (r.hit
                            ? 'border-amber-500 bg-amber-500 text-white'
                            : r.pass === 1
                              ? 'border-rose-400 bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                              : 'border-rose-500 bg-rose-500 text-white')
                        }
                      >
                        {r.index}
                      </span>
                    ))
                  )}
                </div>
                <p className="mt-1.5 text-[10px] italic text-zinc-500 dark:text-zinc-400">
                  amber = hit, red = miss. Pass 1 misses are cold compulsory misses.
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                cache lines - block number resident per line
              </p>
              <div className="grid grid-cols-4 gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2 sm:grid-cols-8 dark:border-zinc-800 dark:bg-zinc-900/60">
                {lines.map((l) => {
                  const rec = lineLast.get(l);
                  const isLatest = latest !== null && latest.line === l;
                  let cls = 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900';
                  if (rec) {
                    cls = rec.hit
                      ? 'border-amber-500 bg-amber-500/90 text-white'
                      : 'border-rose-400 bg-rose-100 text-rose-800 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-200';
                  }
                  return (
                    <div
                      key={l}
                      className={'relative rounded-md border p-1.5 transition-colors duration-150 ' + cls + (isLatest ? ' ring-2 ring-amber-500/60 cpupulse' : '')}
                    >
                      <span className={'block text-[9px] font-bold uppercase ' + (rec && rec.hit ? 'text-white/80' : 'text-zinc-400 dark:text-zinc-500')}>
                        L{l}
                      </span>
                      <span className="block font-mono text-sm font-bold leading-tight">{rec ? 'B' + rec.block : '-'}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs leading-snug text-zinc-600 dark:text-zinc-300">
                Stride 1 touches every word of each {WORDS_PER_BLOCK}-word block, so one cold miss buys four elements.
                Slide the stride toward 8 and watch the pass-one hit rate collapse - each miss now pays for a single
                element. Pass 2 always sweeps warm blocks because all {ARRAY_LEN / WORDS_PER_BLOCK} blocks fit across
                the {CACHE_LINES} lines.
              </p>
            </div>
          </div>
        </SectionCard>
      </main>
    </div>
  );
}
