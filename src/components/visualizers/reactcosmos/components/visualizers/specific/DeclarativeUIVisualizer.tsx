'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, List, CheckCircle2, AlertTriangle, RotateCcw, RefreshCw } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: the "what vs how" is something the learner has to perform.
 * Backed by two independent worlds for the same button:
 *   • Imperative mode — the learner is handed the raw DOM and must issue class/disabled/text
 *     writes by hand until the rendered button matches the desired end state. A drift meter
 *     shows how many properties still disagree (and wrong order = drift).
 *   • Declarative mode — the learner picks the desired end state once; React derives the
 *     writes. The counter shows 1 state change → k DOM writes.
 * The scoreboard keeps both costs side by side, which is the entire lesson.
 */

type Goal = 'idle' | 'saving' | 'saved' | 'error';

type Dom = { label: string; disabled: boolean; busy: boolean };
const DOM_KEYS: (keyof Dom)[] = ['label', 'disabled', 'busy'];

/** The declarative half: a desired end state, and the DOM it implies. */
const TARGETS: Record<Goal, Dom> = {
  idle: { label: 'Submit', disabled: false, busy: false },
  saving: { label: 'Saving…', disabled: true, busy: true },
  saved: { label: 'Submitted ✓', disabled: true, busy: false },
  error: { label: 'Retry', disabled: false, busy: false },
};

const GOALS: Goal[] = ['idle', 'saving', 'saved', 'error'];

/** The imperative half: every operation is a property write on a node you found yourself. */
const OPS: { code: string; apply: (dom: Dom) => Dom }[] = [
  { code: 'el.classList.add("busy")', apply: (d) => ({ ...d, busy: true }) },
  { code: 'el.classList.remove("busy")', apply: (d) => ({ ...d, busy: false }) },
  { code: 'el.disabled = true', apply: (d) => ({ ...d, disabled: true }) },
  { code: 'el.disabled = false', apply: (d) => ({ ...d, disabled: false }) },
  { code: 'el.textContent = "Submit"', apply: (d) => ({ ...d, label: 'Submit' }) },
  { code: 'el.textContent = "Saving…"', apply: (d) => ({ ...d, label: 'Saving…' }) },
  { code: 'el.textContent = "Submitted ✓"', apply: (d) => ({ ...d, label: 'Submitted ✓' }) },
  { code: 'el.textContent = "Retry"', apply: (d) => ({ ...d, label: 'Retry' }) },
];

export default function DeclarativeUIVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [mode, setMode] = useState<'imperative' | 'declarative'>('imperative');
  const [goal, setGoal] = useState<Goal>('saving');
  const [dom, setDom] = useState<Dom>(TARGETS.idle);
  const [manualWrites, setManualWrites] = useState(0);
  const [declaredGoal, setDeclaredGoal] = useState<Goal>('idle');
  const [derivedWrites, setDerivedWrites] = useState(0);

  const view = mode === 'imperative' ? dom : TARGETS[declaredGoal];
  const drift = DOM_KEYS.filter((k) => dom[k] !== TARGETS[goal][k]);

  const runOp = (apply: (dom: Dom) => Dom) => {
    setDom((d) => apply(d));
    setManualWrites((n) => n + 1);
  };

  const declare = (next: Goal) => {
    setGoal(next);
    setDerivedWrites(DOM_KEYS.filter((k) => TARGETS[declaredGoal][k] !== TARGETS[next][k]).length);
    setDeclaredGoal(next);
  };

  const reset = () => {
    setMode('imperative');
    setGoal('saving');
    setDom(TARGETS.idle);
    setManualWrites(0);
    setDeclaredGoal('idle');
    setDerivedWrites(0);
  };

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Target className="w-3 h-3 text-react" /> The &quot;What&quot; vs the &quot;How&quot;
      </div>

      <div className="w-full max-w-[680px] flex flex-col gap-4 pt-10">
        {/* ── Mode switch: two ways to reach the same UI ─────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex p-1 rounded-lg border border-border bg-muted/30">
            {(['imperative', 'declarative'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-colors',
                  mode === m
                    ? m === 'declarative'
                      ? 'bg-react/15 text-react'
                      : 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {m === 'imperative' ? <List className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                {m}
              </button>
            ))}
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> reset
          </button>
        </div>

        {/* ── The spec: desired end state (shared by both modes) ─────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            desired end state
          </span>
          {GOALS.map((g) => (
            <button
              key={g}
              onClick={() => (mode === 'declarative' ? declare(g) : setGoal(g))}
              className={cn(
                'px-2.5 py-1 rounded-md border font-mono text-[10px] transition-colors',
                goal === g
                  ? 'border-react/50 bg-react/10 text-react'
                  : 'border-border text-muted-foreground hover:border-foreground/30'
              )}
            >
              {g}
            </button>
          ))}
        </div>

        {/* ── Canvas: what the user sees, plus the inspector for each world ─ */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-3">
          <div className="rounded-xl border border-border bg-muted/20 p-5 flex items-center justify-center min-h-[96px] relative">
            <motion.div
              key={`${view.label}-${view.busy}-${view.disabled}`}
              initial={{ scale: 0.94, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                'px-6 py-3 rounded-xl border-2 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors',
                view.busy
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : view.disabled
                    ? 'border-border bg-muted/50 text-muted-foreground'
                    : 'border-react/40 bg-react/10 text-react'
              )}
            >
              {view.busy && <RefreshCw className={cn('w-3.5 h-3.5', isExecuting && 'animate-spin')} />}
              {view.label}
            </motion.div>

            {mode === 'imperative' && drift.length === 0 ? (
              <span className="absolute bottom-2 right-3 text-[8px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                matches spec
              </span>
            ) : mode === 'imperative' ? (
              <span className="absolute bottom-2 right-3 text-[8px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400">
                drifted ×{drift.length}
              </span>
            ) : (
              <span className="absolute bottom-2 right-3 text-[8px] font-black uppercase tracking-widest text-react">
                rendered from state
              </span>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-3 font-mono text-[10px] leading-5 overflow-hidden">
            <div className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              {mode === 'imperative' ? 'node you mutate' : 'state you declare'}
            </div>
            {mode === 'imperative' ? (
              <pre className="whitespace-pre-wrap text-foreground">{`el = {
  label:    "${dom.label}",
  disabled: ${dom.disabled},
  busy:     ${dom.busy}
}`}</pre>
            ) : (
              <pre className="whitespace-pre-wrap text-foreground">{`status = "${declaredGoal}"

{ busy ? <Loading /> : <Submit /> }
// ${derivedWrites} propert${derivedWrites === 1 ? 'y' : 'ies'} written for you`}</pre>
            )}
          </div>
        </div>

        {/* ── Controls: raw writes (imperative) or nothing at all (declarative) ─ */}
        {mode === 'imperative' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {OPS.map((op) => (
              <button
                key={op.code}
                onClick={() => runOp(op.apply)}
                className="text-left px-2.5 py-1.5 rounded-md border border-border bg-card font-mono text-[10px] text-foreground hover:border-rose-500/40 hover:bg-rose-500/5 transition-colors truncate"
              >
                {op.code}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/10 px-3 py-2.5 text-[10px] text-muted-foreground italic">
            No operations to issue. Pick the end state above — that <span className="text-react not-italic font-bold">is</span> the whole program.
          </div>
        )}

        {/* ── Scoreboard ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 pt-1 border-t border-border">
          <div className="text-[10px] font-mono">
            <span className="text-muted-foreground">manual writes </span>
            <span className={cn('font-black', manualWrites > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-foreground')}>
              {manualWrites}
            </span>
            <span className="text-muted-foreground"> · declarative: </span>
            <span className="font-black text-react">1 state change</span>
            <span className="text-muted-foreground"> → {derivedWrites} writes</span>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest">
            {mode === 'imperative' && drift.length > 0 ? (
              <span className="flex items-center gap-1 text-rose-700 dark:text-rose-400">
                <AlertTriangle className="w-3 h-3" /> {drift.join(', ')} out of sync
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> {mode === 'imperative' ? 'spec reached by hand' : 'converged'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
