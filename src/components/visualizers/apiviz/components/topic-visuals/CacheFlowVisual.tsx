'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Clock, HardDriveDownload, Network, ServerCog } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Micro, Panel, Stage, TerminalButton, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'cache-flow' }>;

const FRESHNESS = [
  { id: 'fresh', label: 'fresh' },
  { id: 'stale', label: 'stale' },
  { id: 'expired', label: 'expired' },
] as const;

type Freshness = (typeof FRESHNESS)[number]['id'];

/**
 * How far a request gets. With a fresh copy the answer never leaves the device; with a
 * stale but revalidatable copy one conditional request confirms it; once it has expired
 * the representation is rebuilt. These are the mechanics of HTTP caching, not claims
 * about any particular deployment.
 */
const TRAVERSAL: Record<
  Freshness,
  { reached: number; verdicts: ('HIT' | 'MISS' | 'REVALIDATED' | 'NOT_REACHED')[]; outcome: string }
> = {
  fresh: {
    reached: 1,
    verdicts: ['HIT', 'NOT_REACHED', 'NOT_REACHED'],
    outcome: '0 network round trips — the response never left the device',
  },
  stale: {
    reached: 3,
    verdicts: ['MISS', 'MISS', 'REVALIDATED'],
    outcome: '1 conditional round trip, 0 body bytes — the cached copy is reused',
  },
  expired: {
    reached: 3,
    verdicts: ['MISS', 'MISS', 'MISS'],
    outcome: '1 full round trip — the representation is rebuilt',
  },
};

const LAYER_ICONS = [HardDriveDownload, Network, ServerCog];

/**
 * FS-27c, `caching-flow` — a request walking nested cache layers.
 *
 * Geometry: the layers are drawn as nested frames (client cache around shared cache
 * around origin), so "how far in did the request get" is a spatial fact. Interaction:
 * switch the freshness of the stored copy and the traversal stops at a different depth,
 * with the client-visible cost changing accordingly.
 */
export function CacheFlowVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [freshness, setFreshness] = useState<Freshness>('fresh');
  const plan = TRAVERSAL[freshness];
  const reached = Math.min(plan.reached, data.layers.length);

  const copy = (index: number) => {
    const layer = data.layers[index];
    if (index >= reached) return 'the request never gets this far';
    if (plan.verdicts[index] === 'HIT') return layer.hit;
    if (plan.verdicts[index] === 'REVALIDATED') return layer.hit;
    return layer.miss;
  };

  let funnel: ReactNode = (
    <div className="border-2 border-cyan-400/20 bg-cyan-400/5 p-4">
      <div className="flex items-center gap-2">
        <Clock className="h-3.5 w-3.5 text-cyan-400" />
        <Micro className="text-cyan-400/70">CLIENT_EXPERIENCE</Micro>
      </div>
      <p className="mt-1 font-mono text-[10px] lowercase leading-relaxed text-cyan-400/60">
        {plan.outcome}
      </p>
    </div>
  );

  for (let index = data.layers.length - 1; index >= 0; index -= 1) {
    const layer = data.layers[index];
    const verdict = plan.verdicts[index] ?? 'NOT_REACHED';
    const traversed = index < reached;
    const Icon = LAYER_ICONS[index % LAYER_ICONS.length];
    funnel = (
      <div
        className={cn(
          'border-2 p-4 transition-colors',
          traversed ? 'border-cyan-400/40 bg-black/50' : 'border-white/5 bg-black/20 opacity-50',
        )}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Icon
            className={cn('h-3.5 w-3.5', traversed ? 'text-cyan-400' : 'text-cyan-400/20')}
          />
          <span
            className={cn(
              'font-mono text-[10px] font-black uppercase tracking-wider',
              traversed ? 'text-cyan-400' : 'text-cyan-400/25',
            )}
          >
            {layer.layer}
          </span>
          <span
            className={cn(
              'ml-auto border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em]',
              verdict === 'HIT'
                ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400'
                : verdict === 'REVALIDATED'
                  ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                  : verdict === 'MISS'
                    ? 'border-white/15 text-cyan-400/50'
                    : 'border-white/5 text-cyan-400/20',
            )}
          >
            {verdict.replace('_', ' ')}
          </span>
        </div>
        <p
          className={cn(
            'mb-3 font-mono text-[10px] lowercase leading-relaxed',
            traversed ? 'text-cyan-400/50' : 'text-cyan-400/20',
          )}
        >
          {copy(index)}
        </p>
        {funnel}
      </div>
    );
  }

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 gap-6 py-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-3">
          <Micro className="text-cyan-400/60">STORED_COPY::FRESHNESS</Micro>
          <div className="flex gap-1">
            {FRESHNESS.map((entry) => (
              <TerminalButton
                key={entry.id}
                active={entry.id === freshness}
                onClick={() => setFreshness(entry.id)}
              >
                {entry.label}
              </TerminalButton>
            ))}
          </div>
          <Panel className="border-cyan-400/10">
            <Micro>FRESHNESS_LIFETIME</Micro>
            <p className="mt-1 font-mono text-[9px] lowercase leading-relaxed text-cyan-400/30">
              max-age is a promise with an expiry. Until it expires a copy may answer; after
              it, the copy has to be confirmed or replaced.
            </p>
          </Panel>
          <Panel className="mt-auto border-cyan-400/10">
            <Micro>WHAT_THE_CLIENT_SEES</Micro>
            <p className="mt-1 font-mono text-[10px] lowercase leading-relaxed text-cyan-400/50">
              {freshness === 'fresh'
                ? 'the fastest response is the one the network never carries'
                : freshness === 'stale'
                  ? 'a conditional request costs a round trip but almost no bandwidth'
                  : 'a cache miss is the only case that pays for the full representation'}
            </p>
          </Panel>
        </div>

        <div className="flex flex-col gap-2">
          <Micro className="text-cyan-400/60">REQUEST_DEPTH::{reached}/{data.layers.length}</Micro>
          {funnel}
        </div>
      </div>
    </Stage>
  );
}
