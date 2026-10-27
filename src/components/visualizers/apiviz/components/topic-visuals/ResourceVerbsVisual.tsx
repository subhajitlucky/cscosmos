'use client';

import { useState } from 'react';
import { Check, Minus, RotateCw, X } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Micro, Panel, Stage, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'resource-verbs' }>;
type Verb = Data['verbs'][number];

const MARK = ({ on }: { on: boolean }) => (
  <span
    className={cn(
      'inline-flex h-6 w-6 items-center justify-center border-2',
      on ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400' : 'border-white/10 text-cyan-400/20',
    )}
  >
    {on ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
  </span>
);

/**
 * FS-27c, `rest-constraints` — a verb × property matrix.
 *
 * Geometry: the five HTTP methods as rows against three properties as columns, with
 * the per-verb flag values coming from the authored data. Interaction: selecting a row
 * opens that verb's constraint note and derives the retry policy a client may use.
 * A message is never drawn here — this subject is about the verbs themselves.
 */
export function ResourceVerbsVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [selected, setSelected] = useState(0);
  const verb: Verb = data.verbs[Math.min(selected, data.verbs.length - 1)];

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 gap-6 py-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* ---------------- matrix ---------------- */}
        <div className="flex flex-col">
          <div className="grid grid-cols-[3.5rem_1fr_1fr_1fr] items-center gap-2 border-b border-cyan-400/20 pb-2">
            <Micro>METHOD</Micro>
            <Micro className="text-center">SAFE</Micro>
            <Micro className="text-center">IDEMPOTENT</Micro>
            <Micro className="text-center">CACHEABLE</Micro>
          </div>

          {data.verbs.map((row, index) => (
            <button
              key={row.verb}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                'grid grid-cols-[3.5rem_1fr_1fr_1fr] items-center gap-2 border-b border-cyan-400/5 px-1 py-2 text-left transition-colors',
                index === selected ? 'bg-cyan-400/10' : 'hover:bg-cyan-400/5',
              )}
            >
              <span
                className={cn(
                  'font-mono text-[12px] font-black tracking-wider',
                  index === selected ? 'text-cyan-400' : 'text-cyan-400/50',
                )}
              >
                {row.verb}
              </span>
              <span className="flex justify-center">
                <MARK on={row.safe} />
              </span>
              <span className="flex justify-center">
                <MARK on={row.idempotent} />
              </span>
              <span className="flex justify-center">
                <MARK on={row.cacheable} />
              </span>
            </button>
          ))}

          <div className="mt-3 flex items-start gap-3">
            <div className="flex flex-col gap-1">
              <Micro>ACT_ON</Micro>
              <div className="flex flex-col gap-1 font-mono text-[10px] text-cyan-400/40">
                <span className="lowercase">/orders</span>
                <span className="lowercase">/orders/&lt;order-id&gt;</span>
              </div>
            </div>
            <p className="ml-auto max-w-[16rem] text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-cyan-400/20">
              the verb says what happens to the resource, never how the server implements it
            </p>
          </div>
        </div>

        {/* ---------------- selected verb ---------------- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Micro className="text-cyan-400/60">SELECTED::{verb.verb}</Micro>
            <Micro>{String(selected + 1).padStart(2, '0')}/{String(data.verbs.length).padStart(2, '0')}</Micro>
          </div>

          <Panel className="border-cyan-400/20">
            <p className="font-mono text-[10px] lowercase leading-relaxed text-cyan-400/70">
              {verb.note}
            </p>
          </Panel>

          <Panel className="space-y-2">
            <div className="flex items-center gap-2">
              <RotateCw className="h-3.5 w-3.5 text-cyan-400/40" />
              <Micro>RETRY_POLICY</Micro>
            </div>
            <p className="font-mono text-[10px] lowercase leading-relaxed text-cyan-400/50">
              {verb.idempotent
                ? 'a timeout may be retried: repeating it cannot change the end state'
                : 'a timeout must not be retried blindly: the change may already have been applied'}
            </p>
            <div className="flex items-center gap-2 border-t border-cyan-400/10 pt-2">
              <Micro>SAFETY</Micro>
              <span className="font-mono text-[10px] lowercase text-cyan-400/50">
                {verb.safe
                  ? 'read-only — a crawler or prefetcher may call it'
                  : 'modifies state — it must not be prefetched'}
              </span>
            </div>
          </Panel>

          <div className="mt-auto flex items-center gap-3">
            <Minus className="h-3.5 w-3.5 flex-shrink-0 text-cyan-400/20" />
            <p className="text-[9px] font-bold uppercase leading-relaxed tracking-[0.12em] text-cyan-400/25">
              idempotency is a property of the method, not of the handler that receives it
            </p>
          </div>
        </div>
      </div>
    </Stage>
  );
}
