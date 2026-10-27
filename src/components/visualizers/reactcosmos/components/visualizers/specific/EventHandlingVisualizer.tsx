'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, MousePointer2, Share2, Plus, RotateCcw, Ban } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: a real nested tree with real onClick props.
 * The learner chooses which elements declare a handler, where stopPropagation() is called,
 * and which element to click (clicking the card body vs the button changes e.target).
 * Each click produces the actual synthetic propagation path — the handlers fire for real,
 * in bubble order, because React dispatches them from one root listener.
 * Adding more buttons grows the onClick prop count while the native listener count stays 1.
 */

type Slot = 'root' | 'card' | 'button';
type TraceEntry = { id: number; slot: Slot; target: string; stopped: boolean };

const SLOTS: { id: Slot; label: string }[] = [
  { id: 'root', label: 'RootContainer' },
  { id: 'card', label: 'Card' },
  { id: 'button', label: 'PunchButton' },
];

export default function EventHandlingVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [handlers, setHandlers] = useState<Record<Slot, boolean>>({
    root: true,
    card: true,
    button: true,
  });
  const [stops, setStops] = useState<Record<Slot, boolean>>({
    root: false,
    card: false,
    button: false,
  });
  const [trace, setTrace] = useState<TraceEntry[]>([]);
  const [extraButtons, setExtraButtons] = useState(0);
  const [nextId, setNextId] = useState(1);

  const handlerProps =
    (handlers.root ? 1 : 0) + (handlers.card ? 1 : 0) + (handlers.button ? 1 + extraButtons : 0);

  const handle = (slot: Slot, e: React.MouseEvent) => {
    const node = (e.target as HTMLElement).closest('[data-node]');
    const target = node?.getAttribute('data-node') ?? 'unknown';
    const stopped = stops[slot];
    if (stopped) e.stopPropagation();
    setTrace((t) => [...t, { id: nextId, slot, target, stopped }]);
    setNextId((n) => n + 1);
  };

  const reset = () => {
    setHandlers({ root: true, card: true, button: true });
    setStops({ root: false, card: false, button: false });
    setTrace([]);
    setExtraButtons(0);
  };

  const rootHandler = handlers.root ? (e: React.MouseEvent) => handle('root', e) : undefined;
  const cardHandler = handlers.card ? (e: React.MouseEvent) => handle('card', e) : undefined;
  const buttonHandler = handlers.button ? (e: React.MouseEvent) => handle('button', e) : undefined;

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Zap className="w-3 h-3 text-react" /> Synthetic Events
      </div>

      <div className="w-full max-w-[700px] flex flex-col gap-3 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1.15fr_1fr] gap-3">
          {/* ── Live tree: every box is a real DOM ancestor of the button ── */}
          <div
            data-node="RootContainer"
            onClickCapture={() => setTrace([])}
            onClick={rootHandler}
            className={cn(
              'rounded-2xl border-2 border-dashed p-3 transition-colors',
              handlers.root ? 'border-react/45 bg-react/[0.03]' : 'border-border bg-muted/10'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-react">
                #root container
              </span>
              <span className="text-[8px] font-mono text-muted-foreground">
                1 native listener lives here
              </span>
            </div>

            <div
              data-node="Card"
              onClick={cardHandler}
              className={cn(
                'rounded-xl border p-3 transition-colors',
                handlers.card ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-border bg-muted/20'
              )}
            >
              <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                &lt;Card&gt; — click this area for target=Card
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  data-node="PunchButton"
                  onClick={buttonHandler}
                  className="px-3 py-1.5 rounded-md border border-react/50 bg-react/10 text-react text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-react/20 transition-colors"
                >
                  <MousePointer2 className="w-3 h-3" /> punch in
                </button>
                {Array.from({ length: extraButtons }).map((_, i) => (
                  <button
                    key={i}
                    data-node={`PunchButton#${i + 2}`}
                    onClick={buttonHandler}
                    className="px-2 py-1.5 rounded-md border border-border bg-card text-muted-foreground text-[9px] font-bold uppercase tracking-wider hover:text-foreground transition-colors"
                  >
                    btn {i + 2}
                  </button>
                ))}
              </div>
              {!handlers.button && (
                <div className="mt-2 text-[8px] italic text-muted-foreground">
                  no onClick prop here — the click still bubbles to Card and #root.
                </div>
              )}
            </div>
          </div>

          {/* ── Listeners & propagation controls ─────────────────────────── */}
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              handler wiring
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-2 gap-y-1.5 items-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                element
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground text-center">
                onClick
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground text-center">
                stop
              </span>
              {SLOTS.map((s) => (
                <div key={s.id} className="contents">
                  <span className="font-mono text-[9px] text-foreground truncate">{s.label}</span>
                  <button
                    onClick={() => setHandlers((h) => ({ ...h, [s.id]: !h[s.id] }))}
                    aria-pressed={handlers[s.id]}
                    className={cn(
                      'w-9 h-4 rounded-full border relative transition-colors',
                      handlers[s.id] ? 'border-react/50 bg-react/20' : 'border-border bg-muted/40'
                    )}
                  >
                    <motion.span
                      animate={{ x: handlers[s.id] ? 16 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className={cn(
                        'absolute top-0.5 w-2.5 h-2.5 rounded-full',
                        handlers[s.id] ? 'bg-react' : 'bg-muted-foreground/50'
                      )}
                    />
                  </button>
                  <button
                    onClick={() => setStops((v) => ({ ...v, [s.id]: !v[s.id] }))}
                    aria-pressed={stops[s.id]}
                    className={cn(
                      'w-9 h-4 rounded-full border relative transition-colors',
                      stops[s.id] ? 'border-rose-500/50 bg-rose-500/20' : 'border-border bg-muted/40'
                    )}
                  >
                    <motion.span
                      animate={{ x: stops[s.id] ? 16 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className={cn(
                        'absolute top-0.5 w-2.5 h-2.5 rounded-full',
                        stops[s.id] ? 'bg-rose-500' : 'bg-muted-foreground/50'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between font-mono text-[9px]">
              <span className="text-muted-foreground">
                onClick props <span className="font-black text-foreground">{handlerProps}</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Share2 className="w-2.5 h-2.5 text-react" /> native listeners{' '}
                <span className="font-black text-react">1</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── The path this event actually took ────────────────────────── */}
        <div className="rounded-xl border border-border bg-muted/20 px-3 py-2 min-h-[52px] flex items-center gap-2 flex-wrap">
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mr-1">
            bubble path
          </span>
          {trace.length === 0 ? (
            <span className="text-[10px] font-mono text-muted-foreground italic">
              click something inside the tree to fire a real event…
            </span>
          ) : (
            <AnimatePresence initial={false}>
              {trace.map((entry, i) => (
                <motion.span
                  key={entry.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1"
                >
                  {i > 0 && <span className="text-muted-foreground text-[9px]">→</span>}
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded border font-mono text-[9px] whitespace-nowrap',
                      entry.stopped
                        ? 'border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-400'
                        : 'border-react/40 bg-react/10 text-react'
                    )}
                  >
                    {entry.slot}.onClick{' '}
                    <span className="text-muted-foreground">target:{entry.target}</span>
                    {entry.stopped && <Ban className="w-2.5 h-2.5 inline ml-1" />}
                  </span>
                </motion.span>
              ))}
            </AnimatePresence>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setExtraButtons((n) => n + 1)}
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-card text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3 h-3" /> button
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-card text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className={cn('w-3 h-3', isExecuting && 'animate-spin')} />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground italic leading-relaxed text-center max-w-[560px] mx-auto">
          Add five buttons and the onClick-prop count climbs — the listener count stays at 1. React
          never touches each button: one root listener dispatches the synthetic event down the
          path you just watched.
        </p>
      </div>
    </div>
  );
}
