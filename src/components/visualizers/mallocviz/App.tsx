'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Boxes, MousePointerClick, Pause, Play, RotateCcw } from 'lucide-react';
import {
  HEAP_SIZE,
  PRESET_WORKLOAD,
  STRATS,
  fragmentation,
  freeAlloc,
  freeRuns,
  malloc,
  newHeap,
  type HeapState,
  type PresetOp,
  type Strategy,
} from './data';

const BTN_PRIMARY =
  'inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm';

const BTN_GHOST =
  'inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:text-sm';

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function App() {
  const [heap, setHeap] = useState<HeapState>(newHeap);
  const [strat, setStrat] = useState<Strategy>('first');
  const [size, setSize] = useState(4);
  const [log, setLog] = useState<string[]>(['heap ready - 64 blocks, all free']);
  const [presetIdx, setPresetIdx] = useState(-1);

  const heapRef = useRef<HeapState>(heap);
  useEffect(() => {
    heapRef.current = heap;
  }, [heap]);

  const pushLog = (note: string) => setLog((l) => [note, ...l].slice(0, 18));

  const doMalloc = useCallback(
    (sz: number) => {
      const res = malloc(heapRef.current, sz, strat);
      heapRef.current = res.heap;
      setHeap(res.heap);
      pushLog(res.note);
    },
    [strat],
  );

  const doFree = useCallback((id: number) => {
    const res = freeAlloc(heapRef.current, id);
    if (!res.ok) return;
    heapRef.current = res.heap;
    setHeap(res.heap);
    pushLog(res.note);
  }, []);

  const doFreeLabel = useCallback(
    (label: string) => {
      const target = Object.values(heapRef.current.allocs).find((a) => a.label === label);
      if (target) doFree(target.id);
    },
    [doFree],
  );

  const applyOp = useCallback(
    (op: PresetOp) => {
      if (op.op === 'malloc') doMalloc(op.size);
      else if (op.op === 'free') doFreeLabel(op.label);
      else pushLog(op.text);
    },
    [doMalloc, doFreeLabel],
  );

  // Preset workload replays one scripted op at a time.
  useEffect(() => {
    if (presetIdx < 0) return;
    if (presetIdx >= PRESET_WORKLOAD.length) {
      setPresetIdx(-1);
      return;
    }
    const t = setTimeout(() => {
      applyOp(PRESET_WORKLOAD[presetIdx]);
      setPresetIdx(presetIdx + 1);
    }, 520);
    return () => clearTimeout(t);
  }, [presetIdx, applyOp]);

  const resetHeap = () => {
    setPresetIdx(-1);
    const fresh = newHeap();
    heapRef.current = fresh;
    setHeap(fresh);
    setLog(['heap reset - 64 blocks, all free']);
  };

  const runPreset = () => {
    const fresh = newHeap();
    heapRef.current = fresh;
    setHeap(fresh);
    const stratLabel = STRATS.find((s) => s.key === strat)?.label ?? '';
    setLog(['preset workload queued (' + PRESET_WORKLOAD.length + ' steps) under ' + stratLabel]);
    setPresetIdx(0);
  };

  const fr = freeRuns(heap.cells);
  const frag = fragmentation(heap.cells);
  const liveBlocks = HEAP_SIZE - fr.total;
  const meterCls = frag < 30 ? 'bg-emerald-500' : frag < 60 ? 'bg-amber-500' : 'bg-rose-500';
  const presetRunning = presetIdx >= 0;

  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Boxes size={20} />
          </span>
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Heap Allocator Sandbox</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
              Issue malloc and free against a 64-block heap, compare First-Fit vs Best-Fit, and watch fragmentation and coalescing happen live.
            </p>
          </div>
        </header>

        <SectionCard title="Controls">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
              {STRATS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStrat(s.key)}
                  title={s.sub}
                  className={
                    'rounded-md px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ' +
                    (strat === s.key
                      ? 'bg-emerald-600 text-white'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800')
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              size = {size}
              <input
                type="range"
                min={1}
                max={12}
                step={1}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-28 accent-emerald-600"
              />
            </label>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button onClick={() => doMalloc(size)} className={BTN_PRIMARY}>
                malloc({size})
              </button>
              {presetRunning ? (
                <button onClick={() => setPresetIdx(-1)} className={BTN_GHOST}>
                  <Pause size={15} /> Stop ({presetIdx + 1}/{PRESET_WORKLOAD.length})
                </button>
              ) : (
                <button onClick={runPreset} className={BTN_GHOST}>
                  <Play size={15} /> Preset workload
                </button>
              )}
              <button onClick={resetHeap} className={BTN_GHOST}>
                <RotateCcw size={15} /> Reset
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={'Heap strip - ' + HEAP_SIZE + ' blocks'}>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {heap.cells.map((owner, i) => {
              const alloc = owner !== null ? heap.allocs[owner] : undefined;
              const isFirst = alloc !== undefined && alloc.start === i;
              const shade =
                owner === null
                  ? 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700'
                  : owner % 2 === 0
                    ? 'bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-500'
                    : 'bg-emerald-700 hover:bg-emerald-600';
              return (
                <button
                  key={i}
                  onClick={() => {
                    if (owner !== null) doFree(owner);
                  }}
                  title={owner === null ? 'block ' + i + ': free' : 'block ' + i + ": '" + alloc?.label + "' - click to free()"}
                  className={'flex h-6 items-center justify-center rounded-[3px] text-[9px] font-bold text-white transition-colors sm:h-7 sm:text-[10px] ' + shade}
                >
                  {isFirst ? alloc?.label : ''}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500" /> live allocation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-zinc-300 dark:bg-zinc-700" /> free block
            </span>
            <span className="flex items-center gap-1.5">
              <MousePointerClick size={12} /> click any allocated block to free() it
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Fragmentation & stats">
          <div>
            <div className="mb-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>External fragmentation</span>
              <span className="font-semibold tabular-nums">{frag}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div className={'h-full rounded-full transition-all duration-500 ' + meterCls} style={{ width: frag + '%' }} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-5">
            {[
              { label: 'live allocations', value: Object.keys(heap.allocs).length },
              { label: 'live blocks', value: liveBlocks },
              { label: 'free runs', value: fr.count },
              { label: 'largest run', value: fr.largest },
              { label: 'failed mallocs', value: heap.failures },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-200 px-2 py-2 dark:border-zinc-700">
                <div className="text-lg font-bold tabular-nums">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{s.label}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Operation log">
          <div className="max-h-44 overflow-y-auto rounded-lg bg-zinc-50 p-2 font-mono text-[11px] leading-relaxed text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
            {log.map((l, i) => (
              <div key={i} className={l.includes('NULL') || l.includes('invalid') ? 'text-rose-500 dark:text-rose-400' : ''}>
                {l}
              </div>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
            Tip: run the preset under First-Fit, reset, switch to Best-Fit, run it again - same requests, different final layout.
          </p>
        </SectionCard>

        <footer className="pb-4 text-center text-[11px] text-zinc-400 dark:text-zinc-500">
          Fragmentation is wasted addressability: many small holes mean a large malloc can fail even with enough total free space.
        </footer>
      </div>
    </div>
  );
}
