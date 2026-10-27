'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleLeft, Lock, Unlock, Box, EyeOff, Eye } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: real mounting, not a show/hide animation.
 * Three independent conditions drive three different idioms (ternary, &&, null).
 * The NotificationFeed child owns state of its own, and the strategy switch decides whether
 * "off" means unmounted (conditional render) or merely hidden with display:none. Hiding keeps
 * the child's counter; unmounting destroys it — the learner can watch instance # change.
 */

const NotificationFeed = ({ instance }: { instance: number }) => {
  const [cleared, setCleared] = useState(0);
  return (
    <div className="rounded-lg border border-react/30 bg-react/5 p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
          &lt;NotificationFeed /&gt;
        </span>
        <span className="text-[8px] font-mono text-react">instance #{instance}</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-foreground">cleared = {cleared}</span>
        <button
          onClick={() => setCleared((c) => c + 1)}
          className="px-2 py-0.5 rounded border border-react/40 bg-react/10 text-react text-[9px] font-bold uppercase tracking-wider hover:bg-react/20 transition-colors"
        >
          mark read
        </button>
      </div>
    </div>
  );
};

const ConditionRow = ({
  idiom,
  on,
  onToggle,
}: {
  idiom: string;
  on: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    aria-pressed={on}
    className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-md border border-border bg-card hover:border-foreground/25 transition-colors text-left"
  >
    <span className="font-mono text-[9px] text-muted-foreground truncate">{idiom}</span>
    <span className="flex items-center gap-1.5 shrink-0">
      <span
        className={cn(
          'font-mono text-[9px] font-bold',
          on ? 'text-react' : 'text-muted-foreground/60'
        )}
      >
        {String(on)}
      </span>
      <span
        className={cn(
          'w-7 h-3.5 rounded-full border relative transition-colors',
          on ? 'border-react/50 bg-react/20' : 'border-border bg-muted/40'
        )}
      >
        <motion.span
          animate={{ x: on ? 13 : 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          className={cn(
            'absolute top-0.5 w-2 h-2 rounded-full',
            on ? 'bg-react' : 'bg-muted-foreground/50'
          )}
        />
      </span>
    </span>
  </button>
);

export default function ConditionalRenderingVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [authed, setAuthed] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [banner, setBanner] = useState(false);
  const [strategy, setStrategy] = useState<'conditional' | 'hidden'>('conditional');
  const [epoch, setEpoch] = useState(1);

  const toggleNotifications = () => {
    const next = !notifications;
    // Coming back on under the conditional strategy is a brand-new mount.
    if (next && strategy === 'conditional') setEpoch((e) => e + 1);
    setNotifications(next);
  };

  const hideFeed = strategy === 'hidden' && !notifications;
  const renderFeed = strategy === 'conditional' ? notifications : true;

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <ToggleLeft className="w-3 h-3 text-react" /> UI Logic
      </div>

      <div className="w-full max-w-[700px] grid grid-cols-1 sm:grid-cols-[1fr_1.1fr] gap-3 pt-10">
        {/* ── The conditions ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            conditions
          </div>
          <ConditionRow idiom="isAuthed ? <Dashboard/> : <Login/>" on={authed} onToggle={() => setAuthed((v) => !v)} />
          <ConditionRow idiom="{showBanner && <Banner/>}" on={banner} onToggle={() => setBanner((v) => !v)} />
          <ConditionRow idiom="{unread ? <Feed/> : null}" on={notifications} onToggle={toggleNotifications} />

          <div className="mt-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            strategy when off
          </div>
          <div className="flex p-1 rounded-lg border border-border bg-muted/30">
            {([
              { id: 'conditional', label: 'unmount', icon: Box },
              { id: 'hidden', label: 'hide (CSS)', icon: EyeOff },
            ] as const).map((s) => (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors',
                  strategy === s.id
                    ? 'bg-react/15 text-react'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <s.icon className="w-3 h-3" /> {s.label}
              </button>
            ))}
          </div>
          <p className="text-[9px] italic text-muted-foreground leading-snug">
            {strategy === 'conditional'
              ? 'Off means the element is not in the tree at all — React never creates it.'
              : 'Off means display:none. The element, its DOM node and its state are all still there.'}
          </p>
        </div>

        {/* ── What is on screen ────────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-muted/20 p-3 flex flex-col gap-2 min-h-[188px]">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            mounted UI
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {authed ? (
              <motion.div
                key="dash"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 px-2.5 py-2 flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                  dashboard
                </span>
                <span className="ml-auto text-[8px] font-mono text-muted-foreground">ternary · A</span>
              </motion.div>
            ) : (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="rounded-lg border border-border bg-card px-2.5 py-2 flex items-center gap-2"
              >
                <Unlock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  login form
                </span>
                <span className="ml-auto text-[8px] font-mono text-muted-foreground">ternary · B</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {banner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border border-amber-500/40 bg-amber-500/5 px-2.5 py-2 overflow-hidden"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  announcement banner
                </span>
                <span className="ml-2 text-[8px] font-mono text-muted-foreground">&amp;&amp; · single branch</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stable wrapper: the only difference is display, or presence. */}
          <div className={cn(hideFeed && 'hidden')} aria-hidden={hideFeed}>
            {renderFeed && <NotificationFeed key={epoch} instance={epoch} />}
          </div>

          {!notifications && (
            <div className="mt-auto pt-1 flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
              {strategy === 'conditional' ? (
                <>
                  <Box className="w-3 h-3 text-rose-700 dark:text-rose-400" />
                  <span className="text-rose-700 dark:text-rose-400">
                    feed destroyed — its cleared counter is gone
                  </span>
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                  <span className="text-amber-700 dark:text-amber-400">
                    feed alive but hidden — bring it back and the counter is intact
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        <p className="sm:col-span-2 text-[10px] text-muted-foreground italic leading-relaxed text-center max-w-[580px] mx-auto">
          Bump <span className="font-mono text-foreground">cleared</span> in the feed, then turn the
          condition off and on. Under <span className="text-react not-italic font-bold">unmount</span>{' '}
          you get a fresh instance and a counter back at 0; under{' '}
          <span className="text-react not-italic font-bold">hide</span> nothing is thrown away.{' '}
          {isExecuting && <span className="text-react">· reconciling…</span>}
        </p>
      </div>
    </div>
  );
}
