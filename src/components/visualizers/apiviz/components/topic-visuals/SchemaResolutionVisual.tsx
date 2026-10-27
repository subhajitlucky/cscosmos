'use client';

import { useState } from 'react';
import { ChevronRight, GitBranch, RotateCcw, StepForward } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Micro, Panel, Stage, TerminalButton, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'schema-resolution' }>;

/**
 * FS-27c, `graphql-schema` — schema to field resolution.
 *
 * Geometry: on the left the authored resolution ladder (schema → operation → validation
 * → execution → response); on the right the frames that have actually resolved so far,
 * nested inside each other like the selection set they walk. Interaction: step the
 * ladder, or jump straight to a rung. Nothing here is drawn as a request/response
 * message, because GraphQL's subject is the selection set, not the envelope.
 */
export function SchemaResolutionVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [step, setStep] = useState(1);
  const total = data.steps.length;
  const current = data.steps[Math.min(step - 1, total - 1)];
  const complete = step >= total;

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 gap-6 py-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* ---------------- resolution ladder ---------------- */}
        <div className="flex flex-col">
          <Micro className="mb-3 text-cyan-400/60">DECLARED_PATH</Micro>
          <div className="flex flex-col">
            {data.steps.map((entry, index) => {
              const reached = index < step;
              const active = index === step - 1;
              return (
                <button
                  key={entry.node}
                  type="button"
                  onClick={() => setStep(index + 1)}
                  className="group relative flex gap-3 pb-4 text-left last:pb-0"
                >
                  <span className="relative flex w-4 flex-col items-center">
                    <span
                      className={cn(
                        'mt-1 h-2.5 w-2.5 rotate-45 border transition-colors',
                        active
                          ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.7)]'
                          : reached
                            ? 'border-cyan-400/60 bg-cyan-400/30'
                            : 'border-cyan-400/20 bg-transparent',
                      )}
                    />
                    {index < total - 1 && (
                      <span
                        className={cn(
                          'mt-1 w-px flex-grow',
                          index < step - 1 ? 'bg-cyan-400/40' : 'bg-cyan-400/10',
                        )}
                      />
                    )}
                  </span>
                  <span
                    className={cn(
                      'flex flex-col border-l-2 pl-3 transition-colors',
                      active
                        ? 'border-cyan-400'
                        : reached
                          ? 'border-cyan-400/20'
                          : 'border-transparent',
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono text-[11px] font-black uppercase tracking-wider',
                        active ? 'text-cyan-400' : reached ? 'text-cyan-400/60' : 'text-cyan-400/25',
                      )}
                    >
                      {entry.node}
                    </span>
                    <span
                      className={cn(
                        'mt-0.5 max-w-[26rem] font-mono text-[10px] lowercase leading-relaxed',
                        reached ? 'text-cyan-400/50' : 'text-cyan-400/20',
                      )}
                    >
                      {entry.detail}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <TerminalButton
              onClick={() => setStep((s) => Math.min(s + 1, total))}
              disabled={complete}
            >
              <span className="flex items-center gap-2">
                <StepForward className="h-3 w-3" /> resolve next
              </span>
            </TerminalButton>
            <TerminalButton onClick={() => setStep(1)}>
              <span className="flex items-center gap-2">
                <RotateCcw className="h-3 w-3" /> reset
              </span>
            </TerminalButton>
            <Micro className="ml-auto">
              DEPTH::{String(step).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </Micro>
          </div>
        </div>

        {/* ---------------- nested resolution frames ---------------- */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Micro className="text-cyan-400/60">RESOLUTION_FRAMES</Micro>
            <GitBranch className="h-3.5 w-3.5 text-cyan-400/30" />
          </div>

          <div className="flex-grow border-2 border-cyan-400/10 bg-black/40 p-4">
            {data.steps.slice(0, step).map((entry, index) => (
              <div
                key={`frame-${entry.node}`}
                className="border-l-2 border-cyan-400/20 pl-3"
                style={{ marginLeft: `${index * 14}px` }}
              >
                <div
                  className={cn(
                    'mb-2 flex items-baseline gap-2 border px-2 py-1.5',
                    index === step - 1
                      ? 'border-cyan-400/60 bg-cyan-400/10'
                      : 'border-cyan-400/10 bg-black/40',
                  )}
                >
                  <span className="font-mono text-[9px] text-cyan-400/30">
                    {String(index).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[10px] font-black uppercase tracking-wider',
                      index === step - 1 ? 'text-cyan-400' : 'text-cyan-400/50',
                    )}
                  >
                    {entry.node}
                  </span>
                </div>
              </div>
            ))}
            {complete ? (
              <p className="mt-3 flex items-center gap-2 border-t border-cyan-400/10 pt-3 font-mono text-[10px] lowercase text-cyan-400/60">
                <ChevronRight className="h-3 w-3" />
                selected fields only — nothing outside the schema was reached
              </p>
            ) : (
              <p className="mt-3 border-t border-cyan-400/10 pt-3 font-mono text-[10px] lowercase text-cyan-400/25">
                waiting on{' '}
                <span className="text-cyan-400/50">{current.node}</span>
              </p>
            )}
          </div>

          <Panel className="border-cyan-400/10">
            <Micro>CONTRACT_CHECK</Micro>
            <p className="mt-1 font-mono text-[9px] lowercase leading-relaxed text-cyan-400/30">
              the selection set can only contain fields the schema declares — validation
              happens before a single resolver runs
            </p>
          </Panel>
        </div>
      </div>
    </Stage>
  );
}
