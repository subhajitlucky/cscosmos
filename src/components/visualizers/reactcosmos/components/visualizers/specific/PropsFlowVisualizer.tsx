'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, ArrowDown, ArrowUpRight, Lock, RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: data is edited where it is owned and the learner watches it travel.
 * The owner's input is the single writable source; LiveChild mirrors it every keystroke.
 * SnapshotChild copied the prop once at mount, so it goes stale — the learner can re-sync it.
 * LiveChild can also attempt an illegal write to props.user (React never notices, and the next
 * parent render overwrites it) or take the legal route: call the onRename callback prop and
 * let the owner change its own state.
 */

const LiveChild = ({
  user,
  onRequestRename,
}: {
  user: string;
  onRequestRename: (name: string) => void;
}) => {
  const [illegal, setIllegal] = useState<string | null>(null);

  // The parent owns this value. The moment it re-renders, any local tampering is replaced.
  useEffect(() => {
    setIllegal(null);
  }, [user]);

  return (
    <div className="flex-1 min-w-0 rounded-xl border border-cyan-500/40 bg-cyan-500/5 p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
          &lt;LiveChild /&gt;
        </span>
        <span className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground">
          <Lock className="w-2.5 h-2.5" /> read-only
        </span>
      </div>

      <div className="rounded border border-border bg-card px-2 py-1.5 font-mono text-[10px]">
        <span className="text-muted-foreground">props.user = </span>
        <span className="text-foreground font-bold">
          {illegal !== null ? illegal : `"${user}"`}
        </span>
        {illegal !== null && (
          <div className="mt-1 flex items-center gap-1 text-[8px] text-rose-700 dark:text-rose-400 font-sans font-black uppercase tracking-wider">
            <AlertTriangle className="w-2.5 h-2.5" /> not state — a render will erase it
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setIllegal('"Hacked"')}
          className="px-1.5 py-1 rounded border border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-400 text-[8px] font-bold uppercase tracking-wider hover:bg-rose-500/10 transition-colors"
        >
          props.user = &quot;Hacked&quot;
        </button>
        <button
          onClick={() => onRequestRename('Ada')}
          className="flex items-center gap-1 px-1.5 py-1 rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-[8px] font-bold uppercase tracking-wider hover:bg-cyan-500/20 transition-colors"
        >
          <ArrowUpRight className="w-2.5 h-2.5" /> onRename(&quot;Ada&quot;)
        </button>
      </div>

      <div className="text-[8px] italic text-muted-foreground leading-snug">
        The legal way up is a callback prop. Editing props directly is a silent no-op — React never
        re-renders for it.
      </div>
    </div>
  );
};

const SnapshotChild = ({ user }: { user: string }) => {
  const [frozen, setFrozen] = useState(user);
  const stale = frozen !== user;

  return (
    <div
      className={cn(
        'flex-1 min-w-0 rounded-xl border p-3 flex flex-col gap-2 transition-colors',
        stale ? 'border-amber-500/40 bg-amber-500/5' : 'border-border bg-muted/20'
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          &lt;SnapshotChild /&gt;
        </span>
        {stale && (
          <span className="text-[8px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
            stale
          </span>
        )}
      </div>

      <div className="rounded border border-border bg-card px-2 py-1.5 font-mono text-[10px]">
        <span className="text-muted-foreground">copied at mount = </span>
        <span className={cn('font-bold', stale ? 'text-amber-700 dark:text-amber-400' : 'text-foreground')}>
          &quot;{frozen}&quot;
        </span>
      </div>

      <div className="rounded border border-dashed border-border px-2 py-1 font-mono text-[9px] text-muted-foreground truncate">
        parent says &quot;{user}&quot;
      </div>

      <button
        onClick={() => setFrozen(user)}
        disabled={!stale}
        className={cn(
          'flex items-center justify-center gap-1 px-1.5 py-1 rounded border text-[8px] font-bold uppercase tracking-wider transition-colors',
          stale
            ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20'
            : 'border-border text-muted-foreground/40 cursor-not-allowed'
        )}
      >
        {stale ? <RefreshCw className="w-2.5 h-2.5" /> : <Check className="w-2.5 h-2.5" />}
        {stale ? 're-read prop' : 'in sync'}
      </button>

      <div className="text-[8px] italic text-muted-foreground leading-snug">
        This is what `useState(props.user)` or a memoised snapshot looks like: the prop changed, the
        copy did not.
      </div>
    </div>
  );
};

export default function PropsFlowVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [user, setUser] = useState('Subhajit');

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Droplets className="w-3 h-3 text-react" /> Unidirectional Data Flow
      </div>

      <div className="w-full max-w-[700px] flex flex-col items-center gap-1 pt-10">
        {/* ── Owner: the only place the value is written ────────────────── */}
        <div className="w-full max-w-[300px] rounded-xl border border-react/30 bg-react/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-react">
              &lt;Owner /&gt;
            </span>
            <span className="text-[8px] font-mono text-muted-foreground">source of truth</span>
          </div>
          <label className="block text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">
            user state
          </label>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            aria-label="Owner user state"
            className="w-full px-2 py-1.5 rounded border border-border bg-card font-mono text-[11px] text-foreground outline-none focus:border-react/60"
          />
          <div className="mt-1.5 font-mono text-[9px] text-muted-foreground">
            useState(&quot;{user}&quot;) · {user.length} chars
          </div>
        </div>

        {/* ── The downward flow ────────────────────────────────────────── */}
        <div className="relative h-8 w-px bg-border/60">
          <motion.div
            key={user}
            initial={{ y: -2, opacity: 0 }}
            animate={{ y: 22, opacity: [0, 1, 0] }}
            transition={{ duration: 0.55, ease: 'easeIn' }}
            className="absolute -left-[3px] w-[7px] h-[7px] rounded-full bg-react shadow-[0_0_10px_#00d8ff]"
          />
          <div className="absolute -bottom-0.5 -left-[3px] w-[7px] h-[7px] rotate-45 border-b border-r border-border/60" />
        </div>

        <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-muted-foreground">
          <ArrowDown className={cn('w-3 h-3', isExecuting && 'animate-bounce')} /> props flow down
        </div>

        {/* ── Two receivers, two behaviours ────────────────────────────── */}
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-1">
          <LiveChild user={user} onRequestRename={setUser} />
          <SnapshotChild user={user} />
        </div>

        <p className="mt-3 text-[10px] text-muted-foreground italic leading-relaxed text-center max-w-[560px]">
          Type in the owner: LiveChild follows every keystroke, SnapshotChild keeps its stale copy.
          Try the illegal write — it disappears the moment the owner re-renders. Then use{' '}
          <span className="font-mono text-cyan-700 dark:text-cyan-400 not-italic">onRename</span> and
          watch the value travel up to state and back down as a prop.
        </p>
      </div>
    </div>
  );
}
