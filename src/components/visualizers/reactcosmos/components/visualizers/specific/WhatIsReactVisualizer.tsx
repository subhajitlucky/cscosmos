'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Database, Zap, Monitor, Pencil, RotateCcw } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: f(state) = UI is made manipulable.
 * The learner moves the ONLY input React accepts (a state slider) and watches three
 * surfaces recompute. Then the learner is invited to paint over the rendered output
 * by hand — the next render (any slider move, or "Re-render") wipes the paint and
 * restores f(state), which is the whole contract of a declarative library.
 */

/** Pure, deterministic projection — same state in, same UI out. */
const project = (energy: number) => {
  const label =
    energy === 0 ? 'Idle' :
    energy < 35 ? 'Warming up' :
    energy < 70 ? 'Rendering' : 'Sizzling';
  return { label, bars: Math.max(0, Math.min(5, Math.round(energy / 20))) };
};

export default function WhatIsReactVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [energy, setEnergy] = useState(60);
  const [handEdit, setHandEdit] = useState('');

  const ui = project(energy);
  const painted = handEdit.trim().length > 0;

  const rerender = (next: number) => {
    setEnergy(next);
    // A render is computed from state alone: anything written into the DOM by hand
    // does not survive it.
    setHandEdit('');
  };

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Zap className="w-3 h-3 text-react" /> UI as a Function
      </div>

      <div className="w-full max-w-[720px] flex flex-col items-stretch gap-4 pt-10">
        <div className="flex flex-col md:flex-row md:items-stretch items-center gap-5 w-full">
          {/* ── STATE: the only writable input ───────────────────────────── */}
          <div className="flex-1 min-w-0 w-full rounded-2xl border border-border bg-muted/30 p-4">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-2">
              <Database className="w-3 h-3" /> State
            </div>
            <div className="font-mono text-3xl font-black text-foreground tabular-nums leading-none">
              {energy}
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={energy}
              onChange={(e) => rerender(Number(e.target.value))}
              aria-label="State value (0 to 100)"
              className="mt-4 w-full h-1.5 cursor-pointer accent-react"
            />
            <div className="mt-3 text-[9px] text-muted-foreground italic leading-snug">
              The only thing you are allowed to edit.
            </div>
          </div>

          {/* ── REACT: the pure function ─────────────────────────────────── */}
          <div className="shrink-0 flex flex-row md:flex-col items-center justify-center gap-2">
            <motion.div
              animate={isExecuting ? { rotate: 360 } : { rotate: 0 }}
              transition={isExecuting ? { duration: 3, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
              className="relative w-14 h-14 rounded-full border-2 border-react/30 bg-react/5 flex items-center justify-center"
            >
              <Zap className="w-6 h-6 text-react fill-react/20" />
              {isExecuting && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-react"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [0.85, 1.6, 2] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div className="font-mono text-[10px] text-react whitespace-nowrap">
              f({energy})
            </div>
          </div>

          {/* ── UI: a projection, never a source of truth ────────────────── */}
          <div className="flex-1 min-w-0 w-full rounded-2xl border border-border bg-muted/30 p-4 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Monitor className="w-3 h-3" /> UI
              </div>
              {painted && (
                <span className="px-1.5 py-0.5 rounded border border-rose-500/40 bg-rose-500/10 text-[8px] font-black uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  hand-painted
                </span>
              )}
            </div>

            <div className="flex items-end gap-1.5 h-8 mb-3" aria-hidden>
              {[1, 2, 3, 4, 5].map((i) => {
                const lit = i <= ui.bars;
                return (
                  <motion.div
                    key={i}
                    animate={{
                      height: lit ? 26 : 8,
                      backgroundColor: lit ? '#00d8ff' : 'hsl(var(--border))',
                      opacity: lit ? 0.85 : 0.7,
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                    className="flex-1 rounded-sm"
                  />
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={painted ? 'painted' : 'derived'}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={cn(
                  'font-mono text-base font-bold truncate',
                  painted ? 'text-rose-700 dark:text-rose-400 line-through' : 'text-foreground'
                )}
              >
                {painted ? handEdit : ui.label}
              </motion.div>
            </AnimatePresence>

            <div className="mt-1 text-[9px] text-muted-foreground font-mono truncate">
              state still says: &quot;{ui.label}&quot;
            </div>
          </div>
        </div>

        {/* ── The imperative temptation, made observable ─────────────────── */}
        <div className="rounded-xl border border-dashed border-border bg-muted/10 p-3">
          <div className="flex items-center gap-2 mb-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            <Pencil className="w-3 h-3" /> Paint over the rendered output by hand
          </div>
          <div className="flex items-center gap-2">
            <input
              value={handEdit}
              onChange={(e) => setHandEdit(e.target.value)}
              placeholder="write a fake label straight into the DOM…"
              aria-label="Hand-painted DOM label"
              className="flex-1 min-w-0 px-2.5 py-1.5 rounded-md border border-border bg-card font-mono text-[11px] text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-react/60"
            />
            <button
              onClick={() => setHandEdit('')}
              disabled={!painted}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-colors',
                painted
                  ? 'border-react/40 bg-react/10 text-react hover:bg-react/20'
                  : 'border-border text-muted-foreground/50 cursor-not-allowed'
              )}
            >
              <RotateCcw className="w-3 h-3" /> Re-render
            </button>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed italic text-center max-w-[540px] mx-auto">
          {painted ? (
            <>
              The DOM now disagrees with state. Move the slider or hit Re-render — the next
              render is computed from <span className="font-mono text-react">f({energy})</span> and
              your paint is gone.
            </>
          ) : (
            <>
              Drag the state. Every surface recomputes from{' '}
              <span className="font-mono text-react">f(state)</span>; you never name a DOM node.
              That is what &quot;declarative&quot; buys you.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
