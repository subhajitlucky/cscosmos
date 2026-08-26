'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Database,
  EyeOff,
  KeyRound,
  Play,
  RefreshCw,
  RotateCcw,
  Scissors,
  Search,
  ShieldCheck,
  Timer,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import {
  ACID_SCENARIOS,
  ISOLATIONS,
  SEED_KEYS,
  btreeInsert,
  layoutTree,
  queryPath,
  resolveRead,
  type AcidScenarioId,
  type BTreeNode,
  type Isolation,
} from './data';

type FeedTone = 'ok' | 'split' | 'warn';

interface FeedEntry {
  id: number;
  text: string;
  tone: FeedTone;
}

interface RaceResult {
  examined: number;
  us: number;
}

const SCAN_US_PER_ROW = 20;
const HOP_US = 300;

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

export default function DbInternalsLab() {
  /* ------------------------------ tree state ------------------------------ */
  const [tree, setTree] = useState<BTreeNode | null>(null);
  const [treeVer, setTreeVer] = useState(0);
  const [rows, setRows] = useState<number[]>([]);
  const [insertVal, setInsertVal] = useState('');
  const [feed, setFeed] = useState<FeedEntry[]>([]);
  const [flashKey, setFlashKey] = useState<number | null>(null);
  const feedIdRef = useRef(1);
  const prevIdsRef = useRef<Set<number>>(new Set());

  /* ------------------------------ race state ------------------------------ */
  const [pickedKey, setPickedKey] = useState('');
  const [qMode, setQMode] = useState<'idle' | 'index' | 'scan'>('idle');
  const [qHop, setQHop] = useState(0);
  const [scanned, setScanned] = useState(0);
  const [indexRes, setIndexRes] = useState<RaceResult | null>(null);
  const [scanRes, setScanRes] = useState<RaceResult | null>(null);

  /* ------------------------------ acid state ------------------------------ */
  const [iso, setIso] = useState<Isolation>('rc');
  const [scenario, setScenario] = useState<AcidScenarioId>('dirty');
  const [acidStep, setAcidStep] = useState(0);
  const [acidPlaying, setAcidPlaying] = useState(false);

  const layout = useMemo(() => layoutTree(tree), [tree, treeVer]);
  const sc = ACID_SCENARIOS[scenario];

  const pushFeed = (text: string, tone: FeedTone) => {
    setFeed((prev) => [{ id: feedIdRef.current++, text, tone }, ...prev].slice(0, 7));
  };

  const invalidateRace = () => {
    setIndexRes(null);
    setScanRes(null);
    setQMode('idle');
    setQHop(0);
    setScanned(0);
  };

  const applyInsert = (root: BTreeNode | null, key: number) => {
    const res = btreeInsert(root, key);
    if (res.duplicate) {
      pushFeed('key ' + key + ' already indexed - duplicate rejected', 'warn');
      return res.root;
    }
    setTree(res.root);
    setTreeVer((v) => v + 1);
    setRows((prev) => [...prev, key]);
    setFlashKey(key);
    res.splits.forEach((sp) => {
      pushFeed('node [' + sp.fromKeys.join(' ') + '] overflowed - split, ' + sp.promoted + ' promoted', 'split');
    });
    if (res.splits.length === 0) pushFeed('key ' + key + ' slid into a leaf slot - no split needed', 'ok');
    invalidateRace();
    return res.root;
  };

  const doInsert = () => {
    const v = Number(insertVal);
    if (insertVal.trim() === '' || Number.isNaN(v) || v < 0) {
      pushFeed('enter a positive integer key first', 'warn');
      return;
    }
    applyInsert(tree, Math.floor(v));
    setInsertVal('');
  };

  const seedSample = () => {
    let root: BTreeNode | null = null;
    let splitCount = 0;
    SEED_KEYS.forEach((k) => {
      const res = btreeInsert(root, k);
      root = res.root;
      splitCount += res.splits.length;
    });
    setTree(root);
    setTreeVer((v) => v + 1);
    setRows([...SEED_KEYS]);
    pushFeed('seeded ' + SEED_KEYS.length + ' sample keys (' + splitCount + ' splits along the way)', 'ok');
    setPickedKey(String(SEED_KEYS[3]));
    invalidateRace();
  };

  const clearTree = () => {
    prevIdsRef.current = new Set<number>();
    setTree(null);
    setTreeVer((v) => v + 1);
    setRows([]);
    setFeed([]);
    setPickedKey('');
    invalidateRace();
  };

  /* --------------------------- index query engine -------------------------- */
  const qPath = useMemo(
    () => (pickedKey !== '' ? queryPath(tree, Number(pickedKey)) : null),
    [tree, treeVer, pickedKey]
  );

  useEffect(() => {
    if (qMode !== 'index' || !qPath) return;
    if (qHop >= qPath.ids.length) {
      const us = qPath.ids.length * HOP_US + 100;
      setIndexRes({ examined: qPath.ids.length, us });
      setQMode('idle');
      return;
    }
    const t = setTimeout(() => setQHop((h) => h + 1), 480);
    return () => clearTimeout(t);
  }, [qMode, qHop, qPath]);

  useEffect(() => {
    if (qMode !== 'scan') return;
    const target = pickedKey !== '' ? rows.indexOf(Number(pickedKey)) : -1;
    const limit = target >= 0 ? target + 1 : rows.length;
    if (scanned >= limit) {
      const us = scanned * SCAN_US_PER_ROW;
      setScanRes({ examined: scanned, us });
      setQMode('idle');
      return;
    }
    const t = setTimeout(() => setScanned((s) => s + 1), 42);
    return () => clearTimeout(t);
  }, [qMode, scanned, rows, pickedKey]);

  const startIndexQuery = () => {
    if (!qPath || pickedKey === '') return;
    setQHop(0);
    setIndexRes(null);
    setQMode('index');
  };

  const startScan = () => {
    if (pickedKey === '' || rows.length === 0) return;
    setScanned(0);
    setScanRes(null);
    setQMode('scan');
  };

  /* ----------------------------- acid playback ---------------------------- */
  useEffect(() => {
    if (flashKey === null) return;
    const t = setTimeout(() => setFlashKey(null), 1400);
    return () => clearTimeout(t);
  }, [flashKey]);
  useEffect(() => {
    if (!acidPlaying) return;
    if (acidStep >= sc.steps.length) {
      setAcidPlaying(false);
      return;
    }
    const t = setTimeout(() => setAcidStep((s) => s + 1), 1250);
    return () => clearTimeout(t);
  }, [acidPlaying, acidStep, sc.steps.length]);

  const replayAcid = () => {
    setAcidStep(0);
    setAcidPlaying(true);
  };

  const switchScenario = (id: AcidScenarioId) => {
    setScenario(id);
    setAcidStep(0);
    setAcidPlaying(false);
  };

  const switchIso = (id: Isolation) => {
    setIso(id);
    setAcidStep(0);
    setAcidPlaying(false);
  };

  /* --------------------- derive visible transaction views ------------------ */
  const revealed = sc.steps.slice(0, acidStep);
  let committed = 500;
  let uncommitted: number | null = null;
  let t2View = 500;
  for (const s of revealed) {
    const m = /balance = (\d+)/.exec(s.action);
    if (m) {
      const val = Number(m[1]);
      if (s.actor === 'T1') uncommitted = val;
      if (s.commit) {
        committed = val;
        uncommitted = null;
      }
    }
    if (s.rollback) uncommitted = null;
    if (s.read) t2View = resolveRead(iso, s.read);
  }
  const acidDone = acidStep >= sc.steps.length;
  const outcome = sc.outcome[iso];
  const sortedKeys = [...new Set(rows)].sort((a, b) => a - b);

  const hlIdSet = new Set<number>();
  if (qMode === 'index' && qPath) {
    qPath.ids.slice(0, qHop).forEach((id) => hlIdSet.add(id));
  }

  const freshIds = new Set<number>();
  layout.placements.forEach((p) => {
    if (!prevIdsRef.current.has(p.node.id)) freshIds.add(p.node.id);
  });

  useEffect(() => {
    prevIdsRef.current = new Set(layout.placements.map((p) => p.node.id));
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <style>{'@keyframes dbnode-in{from{opacity:0;transform:translate(-50%,-50%) scale(.6)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}' +
        '@keyframes dbpulse{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.45)}50%{box-shadow:0 0 0 6px rgba(16,185,129,.12)}}'}</style>

      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Systems · Database Internals · Indexes &amp; Transactions
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">B-trees, Splits &amp; Isolation</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Grow a B-tree index key by key, race an indexed lookup against a full-table scan, then
            break (or save) concurrent transactions with isolation levels.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-5 py-7">
        {/* ------------------------------ B-tree ------------------------------ */}
        <SectionCard icon={Database} title="B-tree index playground" sub="order: max 3 keys per node - overflow splits upward">
          <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
            <div>
              <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60">
                <div className="relative" style={{ width: layout.width, height: layout.height }}>
                  {tree === null ? (
                    <p className="absolute inset-0 flex items-center justify-center text-sm italic text-zinc-500 dark:text-zinc-400">
                      empty index - insert a key or load the sample
                    </p>
                  ) : (
                    <>
                      <svg width={layout.width} height={layout.height} className="absolute inset-0" aria-hidden>
                        {layout.edges.map((e, i) => (
                          <line
                            key={'e' + i}
                            x1={e.x1}
                            y1={e.y1}
                            x2={e.x2}
                            y2={e.y2}
                            className="stroke-zinc-300 dark:stroke-zinc-700"
                            strokeWidth={2}
                          />
                        ))}
                      </svg>
                      {layout.placements.map((p) => {
                        const isNew = freshIds.has(p.node.id);
                        const hl = hlIdSet.has(p.node.id);
                        const flash = flashKey !== null && p.node.keys.includes(flashKey);
                        let cls =
                          'absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-xl border bg-white px-2 py-1.5 shadow-sm dark:bg-zinc-900 ';
                        cls += hl
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                          : flash
                            ? 'border-emerald-400'
                            : 'border-zinc-300 dark:border-zinc-700';
                        return (
                          <div
                            key={p.node.id}
                            className={cls + (isNew ? ' dbnode-in' : '') + (hl ? ' dbpulse' : '')}
                            style={{
                              left: p.cx + 'px',
                              top: p.cy + 'px',
                              transition: 'left .5s ease, top .5s ease',
                            }}
                          >
                            {p.node.keys.map((k, ki) => (
                              <span
                                key={ki}
                                className={
                                  'rounded-md px-1.5 py-0.5 font-mono text-xs font-bold ' +
                                  (k === flashKey
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200')
                                }
                              >
                                {k}
                              </span>
                            ))}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* insert controls */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <label htmlFor="key-input" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <KeyRound className="h-3.5 w-3.5" aria-hidden />
                  key
                </label>
                <input
                  id="key-input"
                  type="number"
                  min={0}
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') doInsert();
                  }}
                  placeholder="42"
                  className="w-24 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
                />
                <button
                  type="button"
                  onClick={doInsert}
                  className="rounded-lg border border-emerald-600 bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  Insert
                </button>
                <button
                  type="button"
                  onClick={seedSample}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
                >
                  Load sample keys
                </button>
                <button
                  type="button"
                  onClick={clearTree}
                  aria-label="Clear the tree"
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-500"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Clear
                </button>
              </div>
            </div>

            {/* split feed */}
            <aside aria-label="Split feed" className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Scissors className="h-3.5 w-3.5" aria-hidden />
                event feed
              </h3>
              <ul className="mt-2 space-y-1.5">
                {feed.length === 0 ? (
                  <li className="text-xs italic text-zinc-500 dark:text-zinc-400">inserts, splits and rejections land here</li>
                ) : (
                  feed.map((f) => (
                    <li
                      key={f.id}
                      className={
                        'rounded-md border-l-2 pl-2 text-[11px] leading-snug ' +
                        (f.tone === 'split'
                          ? 'border-rose-500 text-rose-700 dark:text-rose-300'
                          : f.tone === 'warn'
                            ? 'border-amber-500 text-amber-700 dark:text-amber-300'
                            : 'border-emerald-500 text-emerald-700 dark:text-emerald-300')
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

        {/* --------------------------- query race ---------------------------- */}
        <SectionCard icon={Search} title="Indexed lookup vs full-table scan" sub="same key, two very different costs - timed live">
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="key-pick" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              find key
            </label>
            <select
              id="key-pick"
              value={pickedKey}
              onChange={(e) => {
                setPickedKey(e.target.value);
                invalidateRace();
              }}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-950"
            >
              <option value="">choose…</option>
              {sortedKeys.map((k) => (
                <option key={k} value={String(k)}>
                  {k}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={startIndexQuery}
              disabled={qMode !== 'idle' || pickedKey === ''}
              className="rounded-lg border border-emerald-600 bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              via B-tree ({qPath ? qPath.ids.length : '?'} hops)
            </button>
            <button
              type="button"
              onClick={startScan}
              disabled={qMode !== 'idle' || pickedKey === ''}
              className="rounded-lg border border-rose-500 px-3 py-1.5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-rose-300 dark:hover:bg-rose-500/10"
            >
              full-table scan ({rows.length} rows)
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2.5 dark:border-emerald-500/30 dark:bg-emerald-500/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">with index</p>
                <p className="font-mono text-lg font-bold">
                  {indexRes ? indexRes.us + ' \u00B5s' : qMode === 'index' ? 'hopping\u2026' : '\u2013'}
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                  {indexRes ? indexRes.examined + ' node touches' : 'descends 2-3 levels'}
                </p>
              </div>
              <div className="rounded-lg border border-rose-200 bg-rose-50/60 p-2.5 dark:border-rose-500/30 dark:bg-rose-500/5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">without index</p>
                <p className="font-mono text-lg font-bold">
                  {scanRes ? scanRes.us + ' \u00B5s' : qMode === 'scan' ? 'scanning\u2026' : '\u2013'}
                </p>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                  {scanRes ? scanRes.examined + ' rows read' : 'reads every stored row'}
                </p>
              </div>
              {indexRes && scanRes && (
                <div role="status" className="flex items-start gap-2 rounded-lg bg-emerald-500 p-2.5 text-white">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <p className="text-xs font-semibold leading-snug">
                    index wins: ~{Math.max(1, Math.round(scanRes.examined / Math.max(1, indexRes.examined)))}× fewer reads,
                    {' '}{Math.max(1, Math.round(scanRes.us / Math.max(1, indexRes.us)))}× faster here
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                heap scan bar - rows in insertion order
              </p>
              <div className="flex flex-wrap gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900/60" aria-label="Table scan visualization">
                {rows.length === 0 ? (
                  <span className="p-1 text-xs italic text-zinc-500 dark:text-zinc-400">no rows stored yet</span>
                ) : (
                  rows.map((k, i) => {
                    const visited = qMode === 'scan' && i < scanned;
                    const isHit = scanRes !== null && k === Number(pickedKey) && i === rows.indexOf(Number(pickedKey));
                    return (
                      <span
                        key={i}
                        className={
                          'flex h-8 w-9 items-center justify-center rounded-md border font-mono text-[11px] font-bold transition-colors duration-150 ' +
                          (isHit
                            ? 'border-rose-500 bg-rose-500 text-white'
                            : visited
                              ? 'border-zinc-400 bg-zinc-200 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300'
                              : 'border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400')
                        }
                      >
                        {k}
                      </span>
                    );
                  })
                )}
              </div>
              {qMode === 'index' && qPath && (
                <p className="mt-2 font-mono text-xs text-emerald-700 dark:text-emerald-300">
                  descending: {qPath.ids.slice(0, qHop).length}/{qPath.ids.length} hops
                </p>
              )}
              {(qMode === 'scan' || scanRes !== null) && (
                <p className="mt-2 font-mono text-xs text-rose-700 dark:text-rose-300">
                  rows read: {scanned}/{rows.length}{scanRes ? ' - finally found it' : ''}
                </p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ------------------------------- ACID ------------------------------- */}
        <SectionCard icon={ShieldCheck} title="Isolation lab - two concurrent sessions" sub="account #1 starts at 500 - watch what each session can see">
          <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Scenario">
            <button
              type="button"
              role="radio"
              aria-checked={scenario === 'dirty'}
              onClick={() => switchScenario('dirty')}
              className={
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ' +
                (scenario === 'dirty'
                  ? 'border-emerald-600 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300')
              }
            >
              <EyeOff className="h-4 w-4" aria-hidden />
              dirty read
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={scenario === 'nonrepeatable'}
              onClick={() => switchScenario('nonrepeatable')}
              className={
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ' +
                (scenario === 'nonrepeatable'
                  ? 'border-emerald-600 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                  : 'border-zinc-300 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300')
              }
            >
              <RefreshCw className="h-4 w-4" aria-hidden />
              non-repeatable read
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Isolation level">
            {ISOLATIONS.map((it) => (
              <button
                key={it.id}
                type="button"
                role="radio"
                aria-checked={iso === it.id}
                onClick={() => switchIso(it.id)}
                title={it.guarantee}
                className={
                  'rounded-full border px-3 py-1 text-xs font-bold transition-colors ' +
                  (iso === it.id
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-zinc-300 text-zinc-600 hover:border-emerald-400 dark:border-zinc-700 dark:text-zinc-300')
                }
              >
                {it.short}
              </button>
            ))}
            <span className="text-xs italic text-zinc-500 dark:text-zinc-400">
              {ISOLATIONS.find((x) => x.id === iso)?.guarantee}
            </span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_240px]">
            {(
              [
                { name: 'T1', view: uncommitted ?? committed, badge: uncommitted !== null },
                { name: 'T2', view: t2View, badge: false },
              ] as const
            ).map((sess) => (
              <div
                key={sess.name}
                className={
                  'rounded-xl border p-3 ' +
                  (sess.badge
                    ? 'border-amber-400 bg-amber-50 dark:border-amber-500/50 dark:bg-amber-500/10'
                    : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60')
                }
              >
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  session {sess.name} sees
                </p>
                <p className="font-mono text-3xl font-bold">{sess.view}</p>
                {sess.badge && (
                  <p className="text-[11px] font-bold uppercase text-amber-700 dark:text-amber-300">uncommitted write!</p>
                )}
              </div>
            ))}

            <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Timer className="h-3.5 w-3.5" aria-hidden />
                playback
              </p>
              {!acidDone ? (
                <button
                  type="button"
                  onClick={replayAcid}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  <Play className="h-4 w-4" aria-hidden />
                  {acidStep > 0 ? 'Replay' : 'Run scenario'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={replayAcid}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-200"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Run again
                </button>
              )}
              <p className="mt-1.5 text-center font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                step {Math.min(acidStep, sc.steps.length)}/{sc.steps.length}
              </p>
            </div>
          </div>

          <ol aria-label="Transaction timeline" className="mt-4 space-y-1.5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            {acidStep === 0 && (
              <li className="text-xs italic text-zinc-500 dark:text-zinc-400">
                {sc.intro} press Run to interleave the sessions.
              </li>
            )}
            {revealed.map((s, i) => {
              const seen = s.read ? resolveRead(iso, s.read) : null;
              return (
                <li key={i} className="font-mono text-[11px] leading-snug">
                  <span className={s.actor === 'T1' ? 'font-bold text-emerald-700 dark:text-emerald-300' : 'font-bold text-sky-700 dark:text-sky-300'}>
                    [{s.actor}]
                  </span>{' '}
                  {s.action}
                  {seen !== null && <span className="text-zinc-500 dark:text-zinc-400"> \u2192 observed {seen}</span>}
                  {!acidDone && i === revealed.length - 1 && <span className="ml-2 animate-pulse text-emerald-500">\u25C0</span>}
                </li>
              );
            })}
          </ol>

          {acidDone && (
            <div
              role="status"
              className={
                'mt-3 rounded-lg p-3 text-sm font-semibold ' +
                (outcome.anomalous
                  ? 'bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
                  : 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300')
              }
            >
              {outcome.why}
            </div>
          )}
        </SectionCard>
      </main>
    </div>
  );
}
