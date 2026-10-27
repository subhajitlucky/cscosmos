'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Database, RefreshCw, Play, Layers, Zap } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: the learner composes the update queue instead of watching a counter tick.
 * Two flavours of update can be enqueued — setCount(count + 1) (captures the value at
 * enqueue time) and setCount(c => c + 1) (captures the recipe) — and then flushed.
 * A batching switch decides whether the flush costs one render or one per update, so the
 * render counter is the thing the learner is actually optimising.
 */

type QueuedUpdate = { id: number; kind: 'direct' | 'updater'; captured: number };
type Flush = { updates: number; renders: number; before: number; after: number } | null;

export default function StateUpdatesVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState(1);
  const [queue, setQueue] = useState<QueuedUpdate[]>([]);
  const [batched, setBatched] = useState(true);
  const [nextId, setNextId] = useState(1);
  const [lastFlush, setLastFlush] = useState<Flush>(null);

  /** Fold the queue exactly like React would: direct updates overwrite, updaters compose. */
  const projected = queue.reduce(
    (acc, u) => (u.kind === 'direct' ? u.captured : acc + 1),
    count
  );

  const enqueue = (kind: QueuedUpdate['kind']) => {
    if (!batched) {
      // Legacy / flushSync-style: every update commits on its own.
      const next = kind === 'direct' ? count : count + 1;
      setCount(next);
      setRenders((r) => r + 1);
      setLastFlush({ updates: 1, renders: 1, before: count, after: next });
      return;
    }
    setQueue((q) => [...q, { id: nextId, kind, captured: count }]);
    setNextId((n) => n + 1);
  };

  const flush = () => {
    if (queue.length === 0) return;
    let next = count;
    queue.forEach((u) => {
      next = u.kind === 'direct' ? u.captured : next + 1;
    });
    setCount(next);
    setRenders((r) => r + 1);
    setLastFlush({ updates: queue.length, renders: 1, before: count, after: next });
    setQueue([]);
  };

  const reset = () => {
    setCount(0);
    setRenders(1);
    setQueue([]);
    setLastFlush(null);
    setNextId(1);
  };

  const changed = projected !== count;

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Database className="w-3 h-3 text-react" /> Component Memory
      </div>

      <div className="w-full max-w-[700px] flex flex-col gap-3 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.15fr] gap-3">
          {/* ── What the component currently holds ───────────────────────── */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4 flex flex-col">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              mounted state
            </div>
            <div className="flex items-end gap-3">
              <motion.div
                key={count}
                initial={{ y: 6, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                className="font-mono text-5xl font-black text-foreground tabular-nums leading-none"
              >
                {count}
              </motion.div>
              <div className="pb-1 text-[9px] font-mono text-muted-foreground">
                &lt;Counter /&gt;
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
              <span>UI reads</span>
              <span className="text-react font-bold">count = {count}</span>
            </div>
            <div className="mt-2 text-[9px] italic text-muted-foreground leading-snug">
              State survives re-renders; it only resets when the component unmounts.
            </div>
          </div>

          {/* ── The queue the learner is building ────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> update queue
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">{queue.length}</span>
            </div>

            <div className="min-h-[44px] flex-1 flex flex-wrap content-start gap-1">
              <AnimatePresence initial={false}>
                {queue.length === 0 && (
                  <motion.span
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-mono text-muted-foreground italic"
                  >
                    empty — enqueue an update below
                  </motion.span>
                )}
                {queue.map((u) => (
                  <motion.span
                    key={u.id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className={cn(
                      'px-1.5 py-0.5 rounded border font-mono text-[9px] whitespace-nowrap',
                      u.kind === 'direct'
                        ? 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400'
                        : 'border-cyan-500/40 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400'
                    )}
                  >
                    {u.kind === 'direct' ? `setCount(${u.captured})` : 'setCount(c => c + 1)'}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-2 pt-2 border-t border-border flex items-center justify-between gap-2">
              <div className="font-mono text-[10px]">
                <span className="text-muted-foreground">flush → count </span>
                <span className={cn('font-black', changed ? 'text-react' : 'text-foreground')}>
                  {projected}
                </span>
              </div>
              <button
                onClick={flush}
                disabled={queue.length === 0}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-colors',
                  queue.length
                    ? 'border-react/50 bg-react/10 text-react hover:bg-react/20'
                    : 'border-border text-muted-foreground/40 cursor-not-allowed'
                )}
              >
                <Play className="w-3 h-3" /> flush
              </button>
            </div>
          </div>
        </div>

        {/* ── Enqueue: the two shapes of an update ─────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => enqueue('direct')}
            className="group px-3 py-2 rounded-lg border border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 transition-colors text-left"
          >
            <div className="font-mono text-[10px] text-amber-700 dark:text-amber-400 font-bold">
              setCount(count + 1)
            </div>
            <div className="text-[9px] text-muted-foreground mt-0.5">
              captures <span className="font-mono text-foreground">{count}</span> at click time — the value inside the closure never refreshes
            </div>
          </button>
          <button
            onClick={() => enqueue('updater')}
            className="group px-3 py-2 rounded-lg border border-cyan-500/40 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors text-left"
          >
            <div className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-bold">
              setCount(c =&gt; c + 1)
            </div>
            <div className="text-[9px] text-muted-foreground mt-0.5">
              captures the <span className="italic">recipe</span> — applied in order against the latest value
            </div>
          </button>
        </div>

        {/* ── Batching switch + render ledger ──────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2">
          <button
            onClick={() => {
              setBatched((b) => !b);
              setQueue([]);
            }}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-colors',
              batched
                ? 'border-react/50 bg-react/10 text-react'
                : 'border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-400'
            )}
          >
            <Zap className="w-3 h-3" /> auto-batch {batched ? 'on' : 'off'}
          </button>

          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="text-muted-foreground">renders</span>
            <span className="font-black text-foreground tabular-nums">{renders}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(renders, 10) }).map((_, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0.2 }}
                  animate={{ scaleY: 1 }}
                  className="w-1 h-3 rounded-sm bg-react/70"
                />
              ))}
              {renders > 10 && <span className="text-muted-foreground">+{renders - 10}</span>}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {lastFlush && (
              <motion.div
                key={`${lastFlush.renders}-${lastFlush.after}-${lastFlush.before}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="font-mono text-[9px] text-muted-foreground"
              >
                last: {lastFlush.updates} update{lastFlush.updates === 1 ? '' : 's'} →{' '}
                <span className={cn('font-bold', lastFlush.renders > 1 ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400')}>
                  {lastFlush.renders} render{lastFlush.renders === 1 ? '' : 's'}
                </span>{' '}
                ({lastFlush.before} → {lastFlush.after})
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1 px-2 py-1 rounded-md border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className={cn('w-3 h-3', isExecuting && 'animate-spin')} /> reset
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground italic leading-relaxed text-center max-w-[560px] mx-auto">
          {batched
            ? 'Enqueue three setCount(count + 1) and flush once: the value barely moves, but only one render happens. That is batching — the queue is folded before React paints.'
            : 'Batching is off. Each click is its own commit, so the render counter climbs with every update. Same code, more painting.'}
        </p>
      </div>
    </div>
  );
}
