'use client';

import { useState } from 'react';
import { ArrowRight, Boxes, EyeOff, RefreshCcw } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Micro, Panel, Stage, TerminalButton, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'interface-contract' }>;

/** The internals are deliberately generic: the caller cannot know them, that is the lesson. */
const INTERNALS = ['storage engine', 'queue', 'worker pool'];

/**
 * FS-27c, `what-is-api` — the *contract boundary*.
 *
 * Geometry: consumer on the left, a dashed boundary down the middle, provider internals
 * on the right, seen through an "opaque" pane. Interaction: pick one of the authored
 * operations, then swap the implementation underneath — the operation list and its
 * observable result are unchanged, which is the whole point of an interface.
 */
export function InterfaceContractVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [selected, setSelected] = useState(0);
  const [generation, setGeneration] = useState(1);
  const call = data.calls[Math.min(selected, data.calls.length - 1)];

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 items-stretch gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)]">
        {/* ---------------- consumer side ---------------- */}
        <div className="flex flex-col gap-3">
          <Micro className="text-cyan-400/60">CALLER_SEES::PUBLISHED_OPERATIONS</Micro>
          <div className="flex flex-col gap-2">
            {data.calls.map((entry, index) => (
              <button
                key={entry}
                type="button"
                onClick={() => setSelected(index)}
                className={cn(
                  'group flex items-center justify-between gap-3 border-2 px-4 py-3 text-left font-mono text-[10px] transition-all',
                  index === selected
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                    : 'border-cyan-400/10 bg-black/40 text-cyan-400/40 hover:border-cyan-400/40',
                )}
              >
                <span className="truncate lowercase">{entry}</span>
                <ArrowRight
                  className={cn(
                    'h-3.5 w-3.5 flex-shrink-0 transition-transform',
                    index === selected ? 'translate-x-0 text-cyan-400' : '-translate-x-1 opacity-30',
                  )}
                />
              </button>
            ))}
          </div>
          <Panel className="mt-auto">
            <Micro>OBSERVABLE_RESULT</Micro>
            <p className="mt-2 font-mono text-[11px] lowercase text-cyan-400/80">{call}</p>
            <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-400/30">
              this is the whole surface the caller may depend on
            </p>
          </Panel>
        </div>

        {/* ---------------- the boundary ---------------- */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="h-full w-px border-l-2 border-dashed border-cyan-400/30" />
          <div className="absolute top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap bg-[#05070f] px-2">
            <Micro className="text-cyan-400/60">CONTRACT</Micro>
          </div>
          <div className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.7)]" />
        </div>

        {/* ---------------- provider side ---------------- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Micro className="text-cyan-400/60">IMPLEMENTATION::OPAQUE</Micro>
            <EyeOff className="h-3.5 w-3.5 text-cyan-400/30" />
          </div>
          <div className="flex flex-col gap-2">
            {INTERNALS.map((part) => (
              <div
                key={part}
                className="flex items-center justify-between border-2 border-white/5 bg-white/[0.02] px-4 py-3"
              >
                <span className="font-mono text-[10px] lowercase text-cyan-400/25">{part}</span>
                <span className="border border-white/10 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em] text-cyan-400/20">
                  not in contract
                </span>
              </div>
            ))}
          </div>

          <Panel className="mt-auto border-cyan-400/20">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-cyan-400/60" />
                <Micro className="text-cyan-400/60">
                  IMPLEMENTATION::V{generation}
                </Micro>
              </div>
              <TerminalButton
                onClick={() => setGeneration((g) => (g === 1 ? 2 : 1))}
              >
                <span className="flex items-center gap-2">
                  <RefreshCcw className="h-3 w-3" />
                  swap implementation
                </span>
              </TerminalButton>
            </div>
            <p className="mt-3 font-mono text-[10px] lowercase leading-relaxed text-cyan-400/50">
              {generation === 1
                ? 'the internals behind the boundary are unknown to the caller'
                : 'internals replaced — every operation above resolves exactly as before'}
            </p>
          </Panel>
        </div>
      </div>
    </Stage>
  );
}
