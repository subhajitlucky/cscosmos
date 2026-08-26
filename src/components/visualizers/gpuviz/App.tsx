'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Cpu,
  Gauge,
  Layers,
  MemoryStick,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  StepForward,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  ARRAY_LEN,
  BANDWIDTH_BARS,
  CPU_MEMORY_LADDER,
  FRAG_GRID,
  FRAG_TOTAL,
  FRAG_WAVES,
  WARP_SIZE,
  WARPS,
  fragmentBrightness,
  fragsRetiredAfter,
  scalarTrace,
  simtTrace,
  wastedLanePercent,
  type IssueSlot,
  type OpKind,
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
        <Icon className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
        <div>
          <h2 className="text-sm font-bold leading-tight">{title}</h2>
          <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">{sub}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

const KIND_CHIP: Record<OpKind, string> = {
  load: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200',
  compute: 'bg-emerald-200 text-emerald-900 dark:bg-emerald-500/35 dark:text-emerald-50',
  branch: 'bg-emerald-400 text-emerald-950 dark:bg-emerald-400/50 dark:text-emerald-950',
  store: 'bg-zinc-300 text-zinc-900 dark:bg-zinc-600 dark:text-zinc-50',
};

const KIND_LANE_BG: Record<OpKind, string> = {
  load: 'bg-emerald-300 dark:bg-emerald-600',
  compute: 'bg-emerald-500 dark:bg-emerald-400',
  branch: 'bg-emerald-700 dark:bg-emerald-300',
  store: 'bg-zinc-400 dark:bg-zinc-500',
};

function PlayBar({
  playing,
  onToggle,
  onStep,
  onReset,
  disabledStep,
}: {
  playing: boolean;
  onToggle: () => void;
  onStep: () => void;
  onReset: () => void;
  disabledStep: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400"
      >
        {playing ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
        {playing ? 'Pause' : 'Run'}
      </button>
      <button
        type="button"
        onClick={onStep}
        disabled={disabledStep}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <StepForward className="h-3.5 w-3.5" aria-hidden />
        Step
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-1 rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden />
        Reset
      </button>
    </div>
  );
}

export default function GpuArchitectureLab() {
  /* ------------------------- execution trace state ------------------------- */
  const [mode, setMode] = useState<'scalar' | 'simt'>('simt');
  const [coherent, setCoherent] = useState(false);
  const [slotIdx, setSlotIdx] = useState(0);
  const [playing, setPlaying] = useState(false);

  const scalar = useMemo(() => scalarTrace(), []);
  const simt = useMemo(() => simtTrace(coherent), [coherent]);
  const trace = mode === 'scalar' ? scalar : simt;
  const total = trace.slots.length;

  useEffect(() => {
    if (!playing) return;
    if (slotIdx >= total) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setSlotIdx((s) => Math.min(total, s + 1)), mode === 'scalar' ? 26 : 340);
    return () => clearTimeout(t);
  }, [playing, slotIdx, total, mode]);

  const resetExec = () => {
    setSlotIdx(0);
    setPlaying(false);
  };

  const switchMode = (m: 'scalar' | 'simt') => {
    setMode(m);
    resetExec();
  };

  const switchData = (c: boolean) => {
    setCoherent(c);
    resetExec();
  };

  const currentSlot: IssueSlot | null = slotIdx > 0 ? trace.slots[slotIdx - 1] ?? null : null;
  const activeWarp =
    mode === 'simt' && currentSlot ? Number(/warp (d+)/.exec(currentSlot.note)?.[1] ?? '-1') : -1;

  const speedup = simt.totalCycles > 0 ? scalar.totalCycles / simt.totalCycles : 0;
  const wastePct = wastedLanePercent(simt);

  /* --------------------------- fragment-stage state ------------------------ */
  const [light, setLight] = useState({ x: 4, y: 4 });
  const [wave, setWave] = useState(FRAG_WAVES);
  const [fragRunning, setFragRunning] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!fragRunning) return;
    if (wave >= FRAG_WAVES) {
      setFragRunning(false);
      return;
    }
    const t = setTimeout(() => setWave((w) => w + 1), 70);
    return () => clearTimeout(t);
  }, [fragRunning, wave]);

  const setLightFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = gridRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gx = Math.min(FRAG_GRID - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * FRAG_GRID)));
    const gy = Math.min(FRAG_GRID - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * FRAG_GRID)));
    setLight({ x: gx, y: gy });
    setWave(0);
    setFragRunning(true);
  };

  const retired = fragsRetiredAfter(wave);

  const fragments: { fx: number; fy: number; bright: number; idx: number; done: boolean }[] = [];
  let fi = 0;
  for (let fy = 0; fy < FRAG_GRID; fy++) {
    for (let fx = 0; fx < FRAG_GRID; fx++) {
      fragments.push({
        fx,
        fy,
        bright: fragmentBrightness(fx, fy, light.x, light.y),
        idx: fi,
        done: fi < retired,
      });
      fi += 1;
    }
  }

  return (
    <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <header>
        <h1 className="text-lg font-extrabold tracking-tight">GPU Architecture &amp; Parallelism</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Same workload, two processors: one scalar ALU versus a SIMT grid of tiny cores. Watch warps,
          divergence and bandwidth do the talking.
        </p>
      </header>

      <SectionCard
        icon={Layers}
        title="Execution engine: c[i] = a[i]+b[i], doubled above threshold"
        sub="Flip between the lonely scalar ALU and the SIMT grid running the identical program."
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-zinc-300 text-xs font-semibold dark:border-zinc-700">
            <button
              type="button"
              onClick={() => switchMode('scalar')}
              className={
                mode === 'scalar'
                  ? 'bg-emerald-600 px-3 py-1.5 text-white dark:bg-emerald-500'
                  : 'bg-transparent px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }
            >
              Scalar CPU
            </button>
            <button
              type="button"
              onClick={() => switchMode('simt')}
              className={
                mode === 'simt'
                  ? 'bg-emerald-600 px-3 py-1.5 text-white dark:bg-emerald-500'
                  : 'bg-transparent px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }
            >
              SIMT GPU
            </button>
          </div>
          {mode === 'simt' && (
            <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={!coherent}
                onChange={(e) => switchData(!e.target.checked)}
                className="accent-emerald-600"
              />
              divergent data (lanes split at the branch)
            </label>
          )}
          <PlayBar
            playing={playing}
            onToggle={() => {
              if (!playing && slotIdx >= total) setSlotIdx(0);
              setPlaying(!playing);
            }}
            onStep={() => {
              setPlaying(false);
              setSlotIdx((s) => Math.min(total, s + 1));
            }}
            onReset={resetExec}
            disabledStep={slotIdx >= total}
          />
          <span className="ml-auto text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
            issue slot {slotIdx}/{total}
          </span>
        </div>

        <input
          aria-label="Issue slot scrubber"
          type="range"
          min={0}
          max={total}
          value={slotIdx}
          onChange={(e) => {
            setPlaying(false);
            setSlotIdx(Number(e.target.value));
          }}
          className="mb-3 w-full accent-emerald-600"
        />

        {mode === 'scalar' ? (
          <div>
            <p className="mb-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              One ALU chip, one element at a time — {ARRAY_LEN} elements × 6 ops each.
            </p>
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
              {Array.from({ length: ARRAY_LEN }, (_, i) => {
                const currentItem = slotIdx > 0 ? Math.floor((slotIdx - 1) / 6) : -1;
                const doneItem = i < currentItem;
                const isCur = i === currentItem;
                return (
                  <div
                    key={i}
                    title={'item ' + i}
                    className={
                      'aspect-square rounded-sm ' +
                      (isCur
                        ? 'animate-pulse bg-emerald-500 dark:bg-emerald-400'
                        : doneItem
                          ? 'bg-emerald-300 dark:bg-emerald-700'
                          : 'bg-zinc-200 dark:bg-zinc-800')
                    }
                  />
                );
              })}
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/60">
              <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-emerald-500">
                ALU
              </span>
              <code className="text-xs">{currentSlot ? currentSlot.label : 'idle — press Run'}</code>
              {currentSlot && (
                <span className={'ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ' + KIND_CHIP[currentSlot.kind]}>
                  {currentSlot.kind}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Every lane of a {WARP_SIZE}-lane warp executes the <em>same instruction</em> each slot. Masked-off
              lanes burn the slot without working — that is divergence tax.
            </p>
            {Array.from({ length: WARPS }, (_, w) => {
              const slot = currentSlot;
              const isActiveWarp = w === activeWarp;
              return (
                <div key={w}>
                  <div className="mb-1 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    <span>{'warp ' + w}</span>
                    <span>{isActiveWarp && slot ? slot.note : ''}</span>
                  </div>
                  <div className="grid gap-[2px]" style={{ gridTemplateColumns: 'repeat(32, minmax(0, 1fr))' }}>
                    {(slot ? slot.laneMask : new Array<boolean>(WARP_SIZE).fill(false)).map((activeLane, lane) => (
                      <div
                        key={lane}
                        title={'warp ' + w + ' lane ' + lane + (activeLane ? ' active' : ' parked')}
                        className={
                          'aspect-square rounded-sm transition-colors duration-150 ' +
                          (isActiveWarp && slot && activeLane
                            ? KIND_LANE_BG[slot.kind]
                            : 'border border-dashed border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900')
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {currentSlot && (
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-800/60">
                <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white dark:bg-emerald-500">
                  SIMT
                </span>
                <code className="text-xs">{currentSlot.label}</code>
                <span className={'rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ' + KIND_CHIP[currentSlot.kind]}>
                  {currentSlot.kind}
                </span>
                <span className="ml-auto text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
                  {currentSlot.laneMask.filter(Boolean).length}/{WARP_SIZE} lanes working
                </span>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard icon={Gauge} title="Branch-divergence meter" sub="When a conditional splits the warp, BOTH paths execute serially.">
          <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className={'h-full rounded-full transition-all ' + (wastePct > 0 ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-zinc-400')}
              style={{ width: wastePct + '%' }}
            />
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            <span className="font-bold tabular-nums">{wastePct}%</span> of lane-slots sit parked while the other half
            works ({coherent ? 'coherent data: warps agree' : 'divergent data: serial THEN + ELSE'}).
          </p>
        </SectionCard>

        <SectionCard
          icon={Zap}
          title="Throughput scoreboard"
          sub={'Total issue slots for all ' + ARRAY_LEN + ' elements.'}
        >
          <ul className="space-y-1.5 text-xs">
            <li className="flex items-center justify-between">
              <span>Scalar CPU</span>
              <span className="font-bold tabular-nums">{scalar.totalCycles} cycles</span>
            </li>
            <li className="flex items-center justify-between">
              <span>SIMT GPU ({coherent ? 'coherent' : 'divergent'})</span>
              <span className="font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{simt.totalCycles} cycles</span>
            </li>
            <li className="mt-2 flex items-center justify-between border-t border-zinc-200 pt-2 dark:border-zinc-700">
              <span>Speedup</span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold tabular-nums text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200">
                {speedup.toFixed(1)}×
              </span>
            </li>
          </ul>
        </SectionCard>
      </div>

      <SectionCard icon={MemoryStick} title="Memory wall: CPU cache hierarchy vs GPU HBM" sub="Latency ladder (cycles) and sustained bandwidth (GB/s).">
        <div className="space-y-1.5">
          {CPU_MEMORY_LADDER.map((lvl) => (
            <div key={lvl.name} className="flex items-center gap-2 text-[11px]">
              <span className="w-24 shrink-0 truncate text-zinc-600 dark:text-zinc-300">{lvl.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div className="h-full rounded-full bg-zinc-400 dark:bg-zinc-500" style={{ width: Math.max(2, lvl.width01 * 100) + '%' }} />
              </div>
              <span className="w-28 shrink-0 text-right tabular-nums text-zinc-500 dark:text-zinc-400">
                ~{lvl.latencyCycles} cyc · {lvl.note}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 border-t border-zinc-200 pt-3 dark:border-zinc-700">
          {BANDWIDTH_BARS.map((b) => (
            <div key={b.name} className="flex items-center gap-2 text-[11px]">
              <span className="w-24 shrink-0 truncate text-zinc-600 dark:text-zinc-300">{b.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className={
                    'h-full rounded-full ' +
                    (b.tone === 'gpu' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-zinc-400 dark:bg-zinc-500')
                  }
                  style={{ width: Math.max(2, b.width01 * 100) + '%' }}
                />
              </div>
              <span className="w-28 shrink-0 text-right tabular-nums text-zinc-500 dark:text-zinc-400">{b.gbs} GB/s</span>
            </div>
          ))}
          <p className="pt-1 text-[11px] italic text-zinc-500 dark:text-zinc-400">
            GPUs hide the ~160-cycle DRAM stall by switching between thousands of resident warps instead of shrinking latency.
          </p>
        </div>
      </SectionCard>

      <SectionCard icon={Sparkles} title="Mini shader stage: fragment grid under a moving light" sub="Drag inside the grid — every pixel is recomputed in parallel waves of one warp each.">
        <div
          ref={gridRef}
          role="slider"
          aria-label="Light source position"
          aria-valuetext={'column ' + light.x + ', row ' + light.y}
          tabIndex={0}
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            setLightFromEvent(e);
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) setLightFromEvent(e);
          }}
          onPointerUp={() => {
            draggingRef.current = false;
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setLight((l) => ({ ...l, x: Math.max(0, l.x - 1) }));
            else if (e.key === 'ArrowRight') setLight((l) => ({ ...l, x: Math.min(FRAG_GRID - 1, l.x + 1) }));
            else if (e.key === 'ArrowUp') setLight((l) => ({ ...l, y: Math.max(0, l.y - 1) }));
            else if (e.key === 'ArrowDown') setLight((l) => ({ ...l, y: Math.min(FRAG_GRID - 1, l.y + 1) }));
            else return;
            e.preventDefault();
            setWave(0);
            setFragRunning(true);
          }}
          className="relative grid w-full max-w-md cursor-crosshair touch-none select-none gap-[2px] rounded-lg outline-none ring-emerald-500 focus:ring-2"
          style={{ gridTemplateColumns: 'repeat(' + FRAG_GRID + ', minmax(0, 1fr))' }}
        >
          {fragments.map((f) => (
            <div
              key={f.idx}
              className={'aspect-square rounded-[1px] ' + (f.done ? '' : 'bg-zinc-200 dark:bg-zinc-800')}
              style={f.done ? { backgroundColor: 'rgba(16, 185, 129, ' + (0.12 + f.bright * 0.88).toFixed(3) + ')' } : undefined}
            />
          ))}
          <div
            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-emerald-700 bg-white/80 shadow dark:border-emerald-300 dark:bg-zinc-900/80"
            style={{
              left: ((light.x + 0.5) / FRAG_GRID) * 100 + '%',
              top: ((light.y + 0.5) / FRAG_GRID) * 100 + '%',
            }}
          />
        </div>
        <p className="mt-2 text-[11px] tabular-nums text-zinc-500 dark:text-zinc-400">
          wave {Math.min(wave, FRAG_WAVES)}/{FRAG_WAVES} · {retired}/{FRAG_TOTAL} fragments shaded
          {wave >= FRAG_WAVES ? ' · frame complete' : ' · shading…'}
        </p>
      </SectionCard>

      <footer className="pb-4 text-center text-[11px] text-zinc-400 dark:text-zinc-600">
        <Cpu className="mr-1 inline h-3 w-3" aria-hidden />
        One program counter per warp, thousands of lanes — simplicity through repetition.
      </footer>
    </main>
  );
}
