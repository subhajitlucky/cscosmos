'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Keyboard, Eye, Eraser, Ban } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: both inputs are real and typeable, so ownership is felt rather than claimed.
 * The controlled field stores its value in React state and applies a digits-only mask —
 * letters are rejected by a re-render, which the learner can watch being counted.
 * The uncontrolled field has no value prop and no state: it accepts anything, and the only
 * way to know what it holds is to read ref.current.value (a manual DOM pull), or to clear
 * it with a manual DOM write.
 */

export default function ControlledUncontrolledVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [digits, setDigits] = useState('1234');
  const [refused, setRefused] = useState(0);
  const [probe, setProbe] = useState<string | null>(null);
  const [probes, setProbes] = useState(0);
  const uncontrolled = useRef<HTMLInputElement>(null);

  const onControlled = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = raw.replace(/\D/g, '').slice(0, 4);
    if (clean !== raw) setRefused((n) => n + 1);
    setDigits(clean);
  };

  const readDom = () => {
    setProbe(uncontrolled.current?.value ?? '');
    setProbes((n) => n + 1);
  };

  const clearDom = () => {
    if (uncontrolled.current) uncontrolled.current.value = '';
    setProbe('');
  };

  const inSync = probe !== null && probe === digits;

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Cpu className="w-3 h-3 text-react" /> Form Management
      </div>

      <div className="w-full max-w-[680px] flex flex-col gap-3 pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* ── Controlled: React is the pilot ─────────────────────────── */}
          <div className="rounded-2xl border border-react/30 bg-react/5 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-react">
                controlled
              </div>
              <Cpu className={cn('w-3.5 h-3.5 text-react', isExecuting && 'animate-pulse')} />
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <Database className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">state</span>
              <span className="text-react font-bold">
                {digits === '' ? '""' : `"${digits}"`}
              </span>
            </div>

            <input
              value={digits}
              onChange={onControlled}
              inputMode="numeric"
              placeholder="digits only, max 4"
              aria-label="Controlled input (digits only)"
              className="w-full px-2.5 py-2 rounded-md border border-border bg-card font-mono text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-react/60"
            />

            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'flex items-center gap-1 text-[9px] font-mono',
                  refused > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-muted-foreground'
                )}
              >
                <Ban className="w-2.5 h-2.5" /> rewrites: {refused}
              </span>
              <button
                onClick={() => setDigits('')}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-react/40 bg-react/10 text-react text-[9px] font-bold uppercase tracking-wider hover:bg-react/20 transition-colors"
              >
                <Eraser className="w-3 h-3" /> setState(&quot;&quot;)
              </button>
            </div>

            <p className="text-[9px] italic text-muted-foreground leading-snug">
              Every keystroke is a state write. Type a letter: React refuses it by re-rendering
              the value it already owns — the character never reaches the field.
            </p>
          </div>

          {/* ── Uncontrolled: the browser is the pilot ─────────────────── */}
          <div className="rounded-2xl border border-border bg-muted/20 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                uncontrolled
              </div>
              <Keyboard className="w-3.5 h-3.5 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <Database className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">state</span>
              <span className="text-muted-foreground/70 italic">none — nobody is watching</span>
            </div>

            <input
              ref={uncontrolled}
              defaultValue=""
              placeholder="anything goes: letters, 40 chars"
              aria-label="Uncontrolled input (browser-owned)"
              className="w-full px-2.5 py-2 rounded-md border border-border bg-card font-mono text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-foreground/30"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={readDom}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-card text-[9px] font-bold uppercase tracking-wider text-foreground hover:border-react/50 transition-colors"
              >
                <Eye className="w-3 h-3" /> read ref
              </button>
              <button
                onClick={clearDom}
                className="flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-card text-[9px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eraser className="w-3 h-3" /> ref.value = &quot;&quot;
              </button>
            </div>

            <p className="text-[9px] italic text-muted-foreground leading-snug">
              No value prop, no onChange, no state. The DOM keeps the buffer; you pull it out
              with a ref when you actually need it.
            </p>
          </div>
        </div>

        {/* ── The probe: what does each owner believe? ─────────────────── */}
        <div className="rounded-xl border border-border bg-card px-3 py-2 font-mono text-[10px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-muted-foreground">
              react state <span className="text-react font-bold">{digits === '' ? '""' : `"${digits}"`}</span>
            </span>
            <span className="text-muted-foreground">
              dom (ref){' '}
              <span className={cn('font-bold', probe === null ? 'text-muted-foreground/60' : 'text-foreground')}>
                {probe === null ? 'not read yet' : probe === '' ? '""' : `"${probe}"`}
              </span>
            </span>
            {probe !== null && (
              <motion.span
                key={`${probes}-${inSync}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  'px-1.5 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest',
                  inSync
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400'
                    : 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400'
                )}
              >
                {inSync ? 'coincidence, not control' : 'diverged'}
              </motion.span>
            )}
            <span className="ml-auto text-[9px] text-muted-foreground">probes: {probes}</span>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground italic leading-relaxed text-center max-w-[560px] mx-auto">
          {refused > 0
            ? `React rejected ${refused} keystroke${refused === 1 ? '' : 's'} in the controlled field. The uncontrolled field would have taken every one of them.`
            : 'Type into both. The controlled field obeys state and its mask; the uncontrolled field obeys the browser and hides from React until you read the ref.'}
        </p>
      </div>
    </div>
  );
}
