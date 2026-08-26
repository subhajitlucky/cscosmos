'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRightLeft,
  Binary,
  Coffee,
  Layers,
  MemoryStick,
  Recycle,
  RotateCcw,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import {
  ALLOC_METHOD,
  ALLOC_SNIPPET,
  BYTECODE_LINES,
  EDEN_CAPACITY,
  OBJ_PER_REGION,
  OLD_CAPACITY,
  PROMOTION_AGE,
  REGION_COLS,
  SAMPLE_CLASS,
  SAMPLE_METHOD,
  SURVIVOR_CAPACITY,
  freshHeap,
  g1Tiles,
  majorGc,
  makeObject,
  minorGc,
  type HeapState,
  type JObj,
  type RegionRole,
} from './data';

type FeedTone = 'alloc' | 'gc' | 'dead' | 'info';

interface FeedEntry {
  id: number;
  text: string;
  tone: FeedTone;
}

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

const TENURE_CHIP: Record<string, string> = {
  ephemeral: 'bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300',
  medium: 'bg-teal-200 text-teal-800 dark:bg-teal-500/30 dark:text-teal-100',
  long: 'bg-teal-600 text-white dark:bg-teal-500/80 dark:text-white',
};

const ROLE_CLASS: Record<RegionRole, string> = {
  eden: 'border-teal-300 bg-teal-50 dark:border-teal-500/40 dark:bg-teal-500/10',
  survivor: 'border-teal-500 bg-teal-100 dark:border-teal-400/60 dark:bg-teal-500/25',
  old: 'border-zinc-400 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700/60',
  free: 'border-dashed border-zinc-300 bg-transparent dark:border-zinc-700',
};

export default function JvmMemoryLab() {
  const [heap, setHeap] = useState<HeapState>(freshHeap);
  const [mode, setMode] = useState<'serial' | 'g1'>('serial');
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [gcFlash, setGcFlash] = useState<'none' | 'minor' | 'major'>('none');
  const [stats, setStats] = useState({ allocs: 0, minors: 0, majors: 0, collected: 0, promoted: 0 });
  const [selLine, setSelLine] = useState(0);

  const idRef = useRef(1);
  const feedIdRef = useRef(1);
  const flashTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    };
  }, []);

  const pushFeed = (text: string, tone: FeedTone) => {
    setFeed((prev) => [{ id: feedIdRef.current++, text, tone }, ...prev].slice(0, 8));
  };

  const flash = (kind: 'minor' | 'major') => {
    setGcFlash(kind);
    if (flashTimer.current !== null) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setGcFlash('none'), 950);
  };

  const runMinor = (base: HeapState, auto: boolean) => {
    const res = minorGc(base);
    setHeap(res.next);
    setStats((s) => ({
      ...s,
      minors: s.minors + 1,
      collected: s.collected + res.collected.length,
      promoted: s.promoted + res.promoted.length + res.forcedPromotions.length,
    }));
    flash('minor');
    pushFeed(
      (auto ? 'Eden full - automatic minor GC: ' : 'minor GC: ') +
        res.collected.length +
        ' collected, ' +
        res.survivors.length +
        ' copied to survivor (ages bumped), ' +
        (res.promoted.length + res.forcedPromotions.length) +
        ' promoted to Old',
      'gc'
    );
  };

  const allocate = (count: number) => {
    const eden = heap.eden.slice();
    let added = 0;
    for (let i = 0; i < count; i++) {
      if (eden.length >= EDEN_CAPACITY) break;
      const id = idRef.current;
      idRef.current += 1;
      eden.push(makeObject(id, Math.random(), Math.random(), Math.random(), Math.random()));
      added += 1;
    }
    if (added > 0) pushFeed('allocated ' + added + ' object' + (added === 1 ? '' : 's') + ' into Eden', 'alloc');
    setStats((s) => ({ ...s, allocs: s.allocs + added }));
    const full = eden.length >= EDEN_CAPACITY;
    const next: HeapState = Object.assign({}, heap, { eden });
    setHeap(next);
    if (full) {
      // Eden packed - the collector kicks in on its own.
      runMinor(next, true);
    }
  };

  const runMajor = () => {
    const res = majorGc(heap);
    setHeap(res.next);
    setStats((s) => ({
      ...s,
      majors: s.majors + 1,
      collected: s.collected + res.collectedOld.length + res.sweptYoung.length,
    }));
    flash('major');
    pushFeed(
      'major GC (full collection): ' +
        res.sweptYoung.length +
        ' young objects swept, ' +
        res.collectedOld.length +
        ' old objects reclaimed',
      'dead'
    );
  };

  const resetAll = () => {
    setHeap(freshHeap());
    setFeed([]);
    setStats({ allocs: 0, minors: 0, majors: 0, collected: 0, promoted: 0 });
    idRef.current = 1;
  };

  const holdArr = heap.hold === 'a' ? heap.survA : heap.survB;
  const idleArr = heap.hold === 'a' ? heap.survB : heap.survA;
  const holdName = heap.hold === 'a' ? 'S0' : 'S1';
  const idleName = heap.hold === 'a' ? 'S1' : 'S0';
  const totalUsed = heap.eden.length + heap.survA.length + heap.survB.length + heap.old.length;
  const tiles = mode === 'g1' ? g1Tiles(heap) : [];
  const selectedNote = selLine < BYTECODE_LINES.length ? BYTECODE_LINES[selLine].note : ALLOC_SNIPPET[0].note;

  const objChip = (o: JObj, extraCls: string, delayMs: number) => (
    <span
      key={o.id}
      style={{ animationDelay: delayMs + 'ms' }}
      title={o.name + ' · ' + o.sizeKb + ' KB · ' + o.tenure}
      className={'inline-flex items-center gap-0.5 rounded px-1 py-0.5 font-mono text-[10px] font-bold ' + TENURE_CHIP[o.tenure] + ' ' + extraCls}
    >
      {o.name}
      <sup className="rounded-sm bg-white/70 px-0.5 text-[8px] font-black text-zinc-700 dark:bg-black/40 dark:text-zinc-100">{o.age}</sup>
    </span>
  );

  const spaceBox = (label: string, cap: number, objs: JObj[], tone: string, evacuating: boolean, copying: boolean) => (
    <div
      className={
        'rounded-lg border p-2.5 transition-shadow ' +
        tone +
        (evacuating ? ' ring-2 ring-teal-400/60' : '')
      }
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className="font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
          {objs.length}/{cap}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: Math.min(100, Math.round((objs.length / cap) * 100)) + '%' }}
        />
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1">
        {objs.map((o, i) =>
          objChip(
            o,
            evacuating && o.tenure === 'ephemeral'
              ? 'jvm-collect opacity-100'
              : copying
                ? 'jvm-copy opacity-100'
                : '',
            evacuating ? i * 35 : 0
          )
        )}
        {objs.length === 0 && <span className="text-[10px] italic text-zinc-400 dark:text-zinc-500">empty</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <style>{'@keyframes jvmcollect{to{opacity:.15;transform:scale(.82)}}' +
        '@keyframes jvmcopy{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}' +
        '@keyframes jvmregion{0%{box-shadow:0 0 0 0 rgba(20,184,166,.55)}100%{box-shadow:0 0 0 12px rgba(20,184,166,0)}}'}</style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
            Languages &amp; Runtimes · Java &amp; JVM Internals · GC &amp; Bytecode
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Generational Garbage Collection, Live</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Spam allocations into Eden, watch minor collections copy survivors between S0 and S1 with age counters,
            promote long-lived objects into Old, then trigger a Major GC. Switch between Serial and G1-style region
            views, and read the bytecode underneath it all.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-7">
        {/* ------------------------------ controls ------------------------------ */}
        <SectionCard icon={Coffee} title="Allocation console" sub="objects are born in Eden - most die young, a few stick around">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => allocate(1)}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200"
            >
              Allocate x1
            </button>
            <button
              type="button"
              onClick={() => allocate(5)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 bg-teal-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600"
            >
              <MemoryStick className="h-4 w-4" aria-hidden />
              Allocate x5
            </button>
            <button
              type="button"
              onClick={() => runMinor(heap, false)}
              disabled={totalUsed === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-600 px-3 py-1.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-teal-300 dark:hover:bg-teal-500/10"
            >
              <Recycle className="h-4 w-4" aria-hidden />
              Minor GC
            </button>
            <button
              type="button"
              onClick={runMajor}
              disabled={totalUsed === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Major GC
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset heap
            </button>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-zinc-300 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <Layers className="h-3 w-3" aria-hidden />
              collector
            </span>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'serial'}
              onClick={() => setMode('serial')}
              className={
                'rounded-full border px-3 py-1 text-xs font-bold transition-colors ' +
                (mode === 'serial' ? 'border-teal-500 bg-teal-500 text-white' : 'border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300')
              }
            >
              Serial
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={mode === 'g1'}
              onClick={() => setMode('g1')}
              className={
                'rounded-full border px-3 py-1 text-xs font-bold transition-colors ' +
                (mode === 'g1' ? 'border-teal-500 bg-teal-500 text-white' : 'border-zinc-300 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300')
              }
            >
              G1 regions
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(
              [
                ['allocations', stats.allocs],
                ['minor GCs', stats.minors],
                ['major GCs', stats.majors],
                ['reclaimed', stats.collected],
                ['promoted', stats.promoted],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
                <p className="font-mono text-xl font-bold">{v}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{k}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* -------------------------------- heap -------------------------------- */}
        <SectionCard
          icon={MemoryStick}
          title={mode === 'serial' ? 'Heap layout - generational view' : 'Heap layout - G1 region view'}
          sub={
            'promotion age ' +
            PROMOTION_AGE +
            ' · survivor capacity ' +
            SURVIVOR_CAPACITY +
            ' · objects per region ' +
            OBJ_PER_REGION
          }
        >
          {gcFlash !== 'none' && (
            <p role="status" className="mb-2 inline-flex animate-pulse items-center gap-1.5 rounded-full bg-teal-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              stop-the-world · {gcFlash === 'minor' ? 'minor collection running' : 'major collection running'}
            </p>
          )}

          {mode === 'serial' ? (
            <div className="space-y-2.5">
              <div className="grid gap-2.5 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  {spaceBox('Eden · new allocations', EDEN_CAPACITY, heap.eden, 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60', gcFlash !== 'none', false)}
                </div>
                <div className="space-y-2.5">
                  {spaceBox(holdName + ' · survivors (from-space empties each GC)', SURVIVOR_CAPACITY, holdArr, 'border-teal-300 bg-teal-50/60 dark:border-teal-500/40 dark:bg-teal-500/5', gcFlash === 'minor', true)}
                  {spaceBox(idleName + ' · copy target', SURVIVOR_CAPACITY, idleArr, 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60', false, true)}
                </div>
              </div>
              {spaceBox('Old generation · tenured', OLD_CAPACITY, heap.old, 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900', gcFlash === 'major', false)}
              {heap.old.length > OLD_CAPACITY && (
                <p className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">
                  Old generation is over capacity - a Major GC would reclaim tenured objects whose time is up.
                </p>
              )}
            </div>
          ) : (
            <div>
              <div
                className="grid gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60"
                style={{ gridTemplateColumns: 'repeat(' + REGION_COLS + ', minmax(0, 1fr))' }}
              >
                {tiles.map((t) => (
                  <div
                    key={t.id}
                    title={t.role + ' · ' + t.count + ' objects'}
                    className={
                      'relative aspect-square overflow-hidden rounded-md border ' +
                      ROLE_CLASS[t.role] +
                      ((t.role === 'eden' || t.role === 'survivor') && gcFlash !== 'none' ? ' jvm-region' : '')
                    }
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-teal-500/40" style={{ height: t.fillPct + '%' }} />
                    <span className="absolute left-1 top-0.5 text-[8px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      {t.role.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-teal-300 bg-teal-50 dark:border-teal-500/40 dark:bg-teal-500/10" /> eden</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-teal-500 bg-teal-100 dark:bg-teal-500/25" /> survivor</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-zinc-400 bg-zinc-200 dark:bg-zinc-700/60" /> old</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded border border-dashed border-zinc-300 dark:border-zinc-700" /> free</span>
              </div>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300">
                G1 slices the heap into equal regions and evacuates young regions wholesale instead of chasing single
                objects - collection pauses shrink as heaps grow.
              </p>
            </div>
          )}

          <div className="mt-3 grid gap-3 md:grid-cols-[240px_1fr]">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/60">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">legend</p>
              <ul className="mt-1.5 space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-zinc-300 dark:bg-zinc-600" /> ephemeral - dies at first collection</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-teal-300 dark:bg-teal-500/40" /> medium - survives one minor GC</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-teal-600 dark:bg-teal-500/80" /> long-lived - promotes at age {PROMOTION_AGE}</li>
                <li>the small number on each chip is its age</li>
              </ul>
            </div>
            <aside aria-label="GC event feed" className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <ArrowRightLeft className="h-3.5 w-3.5" aria-hidden />
                event feed
              </h3>
              <ul className="mt-2 space-y-1.5">
                {feed.length === 0 ? (
                  <li className="text-xs italic text-zinc-500 dark:text-zinc-400">allocate some objects to get things moving</li>
                ) : (
                  feed.map((f) => (
                    <li
                      key={f.id}
                      className={
                        'rounded-md border-l-2 pl-2 text-[11px] leading-snug ' +
                        (f.tone === 'dead'
                          ? 'border-rose-500 text-rose-700 dark:text-rose-300'
                          : f.tone === 'gc'
                            ? 'border-teal-500 text-teal-700 dark:text-teal-300'
                            : f.tone === 'alloc'
                              ? 'border-emerald-500 text-emerald-700 dark:text-emerald-300'
                              : 'border-zinc-400 text-zinc-600 dark:text-zinc-300')
                      }
                    >
                      {f.text}
                    </li>
                  ))
                )}
              </ul>
            </aside>
          </div>
        </SectionCard>

        {/* ------------------------------ bytecode ------------------------------- */}
        <SectionCard icon={Binary} title="javap -c bytecode view" sub={'class ' + SAMPLE_CLASS + ' - the instructions behind every allocation'}>
          <p className="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">{SAMPLE_METHOD}</p>
          <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full min-w-[520px] text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
                  <th className="px-2 py-1.5">offset</th>
                  <th className="px-2 py-1.5">mnemonic</th>
                  <th className="px-2 py-1.5">operand</th>
                  <th className="px-2 py-1.5">stack after</th>
                </tr>
              </thead>
              <tbody>
                {BYTECODE_LINES.map((b, i) => (
                  <tr
                    key={b.offset + '-' + b.mnemonic}
                    onClick={() => setSelLine(i)}
                    className={
                      'cursor-pointer border-b border-zinc-100 last:border-0 dark:border-zinc-800/60 ' +
                      (selLine === i ? 'bg-teal-50 dark:bg-teal-500/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/60')
                    }
                  >
                    <td className="px-2 py-1 text-zinc-400">{b.offset}:</td>
                    <td className="px-2 py-1 font-bold">{b.mnemonic}</td>
                    <td className="px-2 py-1 text-zinc-500 dark:text-zinc-400">{b.operand}</td>
                    <td className="px-2 py-1 text-teal-700 dark:text-teal-300">{b.stackAfter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p role="status" className="mt-2 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 dark:bg-teal-500/10 dark:text-teal-200">
            line {BYTECODE_LINES[selLine]?.offset ?? 0}: {(BYTECODE_LINES[selLine] ?? BYTECODE_LINES[0]).note}
          </p>

          <p className="mt-4 font-mono text-xs font-bold text-teal-700 dark:text-teal-300">{ALLOC_METHOD}</p>
          <ol className="mt-2 space-y-1 rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] dark:border-zinc-800 dark:bg-zinc-900/60">
            {ALLOC_SNIPPET.map((b) => (
              <li key={b.offset}>
                <span className="mr-2 text-zinc-400">{b.offset}:</span>
                <span className="font-bold">{b.mnemonic}</span>
                {b.operand !== '' && <span className="ml-2 text-zinc-500 dark:text-zinc-400">{b.operand}</span>}
                <span className="ml-3 text-[10px] italic text-zinc-500 dark:text-zinc-400">; {b.note}</span>
              </li>
            ))}
          </ol>
          <p className="sr-only">selected note: {selectedNote}</p>
        </SectionCard>
      </main>
    </div>
  );
}
