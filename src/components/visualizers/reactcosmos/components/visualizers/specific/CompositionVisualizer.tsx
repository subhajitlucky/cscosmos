'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes, Plus, RotateCcw, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

/**
 * Interaction: the learner builds the component tree instead of reading about it.
 * Six reusable bricks can be dropped into the header / sidebar / main slots or removed again,
 * and the same brick can sit in two slots at once. The canvas shows the assembled UI while the
 * panel beside it shows the tree that produced it — switchable between the children/compound
 * API and the named slot-prop API, which is the actual design decision being taught.
 */

type BrickId = 'logo' | 'search' | 'nav' | 'stats' | 'list' | 'cta';
type SlotId = 'header' | 'sidebar' | 'main';

const BRICKS: { id: BrickId; label: string; className: string }[] = [
  { id: 'logo', label: '<Logo />', className: 'border-react/40 bg-react/5 text-react' },
  {
    id: 'search',
    label: '<SearchBar />',
    className: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
  },
  {
    id: 'nav',
    label: '<NavMenu />',
    className: 'border-purple-500/40 bg-purple-500/5 text-purple-700 dark:text-purple-400',
  },
  {
    id: 'stats',
    label: '<StatCard />',
    className: 'border-amber-500/40 bg-amber-500/5 text-amber-700 dark:text-amber-400',
  },
  {
    id: 'list',
    label: '<FeedList />',
    className: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-700 dark:text-cyan-400',
  },
  {
    id: 'cta',
    label: '<CallToAction />',
    className: 'border-rose-500/40 bg-rose-500/5 text-rose-700 dark:text-rose-400',
  },
];

const SLOTS: { id: SlotId; wrapper: string }[] = [
  { id: 'header', wrapper: 'Header' },
  { id: 'sidebar', wrapper: 'Sidebar' },
  { id: 'main', wrapper: 'Main' },
];

const labelOf = (id: BrickId) => BRICKS.find((b) => b.id === id)?.label ?? '';
const classOf = (id: BrickId) => BRICKS.find((b) => b.id === id)?.className ?? '';

const jsxFor = (placements: Record<SlotId, BrickId[]>, api: 'children' | 'slots') => {
  if (api === 'children') {
    const lines = ['<Layout>'];
    SLOTS.forEach((slot) => {
      const kids = placements[slot.id];
      if (kids.length === 0) return;
      lines.push(`  <${slot.wrapper}>`);
      kids.forEach((b) => lines.push(`    ${labelOf(b)}`));
      lines.push(`  </${slot.wrapper}>`);
    });
    if (lines.length === 1) lines.push('  {null}   {/* nothing composed yet */}');
    lines.push('</Layout>');
    return lines.join('\n');
  }

  const props = SLOTS.map((slot) => {
    const kids = placements[slot.id].map(labelOf);
    const value = kids.length === 0 ? 'null' : kids.length === 1 ? kids[0] : '<>' + kids.join('') + '</>';
    return `  ${slot.id}={${value}}`;
  });
  return ['<Layout', ...props, '/>'].join('\n');
};

export default function CompositionVisualizer({ isExecuting }: { isExecuting: boolean }) {
  const [placements, setPlacements] = useState<Record<SlotId, BrickId[]>>({
    header: ['logo', 'search'],
    sidebar: ['nav'],
    main: ['list'],
  });
  const [target, setTarget] = useState<SlotId>('main');
  const [api, setApi] = useState<'children' | 'slots'>('children');

  const used = SLOTS.reduce((n, s) => n + placements[s.id].length, 0);
  const distinct = new Set(SLOTS.flatMap((s) => placements[s.id])).size;

  const add = (id: BrickId) => setPlacements((p) => ({ ...p, [target]: [...p[target], id] }));
  const remove = (slot: SlotId, index: number) =>
    setPlacements((p) => ({ ...p, [slot]: p[slot].filter((_, i) => i !== index) }));
  const clear = () => setPlacements({ header: [], sidebar: [], main: [] });

  const slotBox = (slot: SlotId, extra: string) => (
    <div
      className={cn(
        'rounded-lg border border-dashed p-1 transition-colors',
        extra,
        target === slot
          ? 'border-react/60 bg-react/[0.06] ring-1 ring-react/40'
          : 'border-border bg-muted/10'
      )}
    >
      <button
        onClick={() => setTarget(slot)}
        className={cn(
          'text-[8px] font-black uppercase tracking-widest transition-colors',
          target === slot ? 'text-react' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {slot}
      </button>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        {placements[slot].length === 0 ? (
          <span className="text-[8px] font-mono italic text-muted-foreground/70">{'{null}'}</span>
        ) : (
          placements[slot].map((b, i) => (
            <span key={`${b}-${i}`} className="inline-flex items-center gap-0.5 max-w-full">
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded border font-mono text-[8px] whitespace-nowrap truncate',
                  classOf(b)
                )}
              >
                {labelOf(b)}
              </span>
              <button
                onClick={() => remove(slot, i)}
                aria-label={`remove ${labelOf(b)} from ${slot}`}
                className="text-muted-foreground hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-card border border-border rounded-xl h-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-4 left-6 text-muted-foreground font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
        <Boxes className="w-3 h-3 text-react" /> The LEGO Principle
      </div>

      <div className="w-full max-w-[720px] grid grid-cols-1 sm:grid-cols-[1.05fr_1fr] gap-3 pt-10">
        {/* ── The composed layout ──────────────────────────────────────── */}
        <div
          className={cn(
            'rounded-2xl border-2 p-2.5 flex flex-col gap-1.5 transition-colors',
            isExecuting ? 'border-react/50' : 'border-border'
          )}
        >
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
            <span>
              &lt;Layout&gt; · adding to <span className="text-react">{target}</span>
            </span>
            <button
              onClick={clear}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-border text-[8px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-2.5 h-2.5" /> clear
            </button>
          </div>

          {slotBox('header', 'min-h-[44px]')}

          <div className="grid grid-cols-[104px_1fr] gap-1.5">
            {slotBox('sidebar', 'min-h-[104px]')}
            {slotBox('main', 'min-h-[104px]')}
          </div>
        </div>

        {/* ── The tree that produced it ────────────────────────────────── */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex p-1 rounded-lg border border-border bg-muted/30">
            {([
              { id: 'children', label: 'children api' },
              { id: 'slots', label: 'slot props' },
            ] as const).map((a) => (
              <button
                key={a.id}
                onClick={() => setApi(a.id)}
                className={cn(
                  'flex-1 px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors',
                  api === a.id ? 'bg-react/15 text-react' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {a.label}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-2 min-h-[132px] overflow-auto">
            <pre className="font-mono text-[9px] leading-relaxed whitespace-pre text-foreground">
              {jsxFor(placements, api)}
            </pre>
          </div>

          <div className="font-mono text-[9px] text-muted-foreground">
            bricks placed <span className="font-black text-foreground">{used}</span> · distinct
            components{' '}
            <span className={cn('font-black', distinct < used ? 'text-react' : 'text-foreground')}>
              {distinct}
            </span>
            {distinct < used && <span className="text-react"> → reuse</span>}
          </div>
        </div>

        {/* ── The palette ─────────────────────────────────────────────── */}
        <div className="sm:col-span-2 rounded-xl border border-border bg-card p-2.5">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">
            palette — drop a brick into the selected slot
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BRICKS.map((b) => (
              <motion.button
                key={b.id}
                onClick={() => add(b.id)}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  'flex items-center gap-1 px-2 py-1 rounded-md border font-mono text-[9px] transition-colors hover:brightness-110',
                  b.className
                )}
              >
                <Plus className="w-2.5 h-2.5" />
                {b.label}
              </motion.button>
            ))}
          </div>
        </div>

        <p className="sm:col-span-2 text-[10px] text-muted-foreground italic leading-relaxed text-center max-w-[580px] mx-auto">
          Put <span className="font-mono text-foreground not-italic">Logo</span> in the header and the
          sidebar: one component, two instances, zero duplicated code. The layout never knows what it
          is holding — it only decides where its children go.
        </p>
      </div>
    </div>
  );
}
