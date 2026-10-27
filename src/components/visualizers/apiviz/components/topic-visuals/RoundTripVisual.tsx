'use client';

import { useEffect, useState } from 'react';
import { CircleSlash, Play, RotateCcw, StepForward } from 'lucide-react';
import type { Topic, TopicRender } from '../../data/learning-path';
import { cn } from '@/lib/utils';
import { Micro, Panel, Stage, TerminalButton, VisualCaption } from './chrome';

type Data = Extract<TopicRender, { kind: 'round-trip' }>;

const LANES: { id: Data['hops'][number]['lane']; label: string }[] = [
  { id: 'client', label: 'CLIENT_NODE' },
  { id: 'wire', label: 'NETWORK_WIRE' },
  { id: 'server', label: 'SERVER_NODE' },
];

/**
 * FS-27c, `client-server` — one exchange over time.
 *
 * Geometry: three lifelines (client / wire / server) and a time cursor that walks down
 * them; the authored hops are the beats of the exchange. Interaction: step or play the
 * timeline and watch the exchange log fill in; the last beat is the statelessness one —
 * once the response lands the server retains nothing.
 */
export function RoundTripVisual({ topic, data }: { topic: Topic; data: Data }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const total = data.hops.length;

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStep((current) => {
        if (current >= total) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 700);
    return () => clearInterval(timer);
  }, [playing, total]);

  const done = step >= total;

  return (
    <Stage>
      <VisualCaption topic={topic} />

      <div className="grid flex-grow grid-cols-1 gap-6 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* ---------------- lifelines ---------------- */}
        <div className="flex flex-col">
          <div className="grid grid-cols-3 border-b border-cyan-400/10 pb-2">
            {LANES.map((lane) => (
              <Micro key={lane.id} className="text-center text-cyan-400/60">
                {lane.label}
              </Micro>
            ))}
          </div>

          <div className="relative flex-grow">
            {data.hops.map((hop, index) => {
              const visited = index < step;
              const current = index === step;
              return (
                <div
                  key={`${hop.lane}-${hop.text}`}
                  className={cn(
                    'relative grid grid-cols-3 items-center border-b border-cyan-400/5 py-3 transition-colors',
                    current && 'bg-cyan-400/5',
                  )}
                >
                  {LANES.map((lane) => {
                    const onLane = lane.id === hop.lane;
                    return (
                      <div key={lane.id} className="flex items-center justify-center">
                        {onLane ? (
                          <span
                            className={cn(
                              'h-3 w-3 rotate-45 transition-all duration-300',
                              visited && 'bg-cyan-400 shadow-[0_0_12px_rgba(0,255,255,0.8)]',
                              current && 'animate-pulse bg-cyan-400/40',
                              !visited && !current && 'bg-cyan-400/10',
                            )}
                          />
                        ) : (
                          <span className="h-px w-full bg-cyan-400/10" />
                        )}
                      </div>
                    );
                  })}
                  <span
                    className={cn(
                      'absolute left-1 top-1 font-mono text-[9px] lowercase transition-opacity',
                      visited ? 'text-cyan-400/40' : 'text-cyan-400/15',
                    )}
                  >
                    {index + 1}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <TerminalButton onClick={() => setStep((s) => Math.min(s + 1, total))} disabled={done}>
              <span className="flex items-center gap-2">
                <StepForward className="h-3 w-3" /> step
              </span>
            </TerminalButton>
            <TerminalButton onClick={() => setPlaying((p) => !p)} active={playing} disabled={done}>
              <span className="flex items-center gap-2">
                <Play className="h-3 w-3" /> {playing ? 'pause' : 'play'}
              </span>
            </TerminalButton>
            <TerminalButton
              onClick={() => {
                setPlaying(false);
                setStep(0);
              }}
            >
              <span className="flex items-center gap-2">
                <RotateCcw className="h-3 w-3" /> reset
              </span>
            </TerminalButton>
            <Micro className="ml-auto">
              BEAT::{step}/{total}
            </Micro>
          </div>
        </div>

        {/* ---------------- exchange log ---------------- */}
        <div className="flex flex-col gap-3">
          <Micro className="text-cyan-400/60">EXCHANGE_LOG</Micro>
          <Panel className="flex-grow space-y-2">
            {data.hops.slice(0, step).map((hop, index) => (
              <div key={`log-${hop.lane}-${index}`} className="flex gap-2 font-mono text-[10px]">
                <span className="text-cyan-400/25">{'>'}</span>
                <span className="text-cyan-400/20">[{hop.lane}]</span>
                <span className="lowercase text-cyan-400/60">{hop.text}</span>
              </div>
            ))}
            {step === 0 && (
              <p className="font-mono text-[10px] lowercase text-cyan-400/25">
                idle — nothing has crossed the wire yet
              </p>
            )}
          </Panel>

          <Panel
            className={cn(
              'flex items-center gap-3 transition-colors',
              done ? 'border-cyan-400/40' : 'border-white/5',
            )}
          >
            <CircleSlash
              className={cn('h-4 w-4', done ? 'text-cyan-400' : 'text-cyan-400/20')}
            />
            <div>
              <Micro className={done ? 'text-cyan-400' : undefined}>SERVER_MEMORY::NONE</Micro>
              <p className="mt-1 font-mono text-[9px] lowercase text-cyan-400/40">
                {done
                  ? 'the exchange is over and the server remembers nothing about this client'
                  : 'the server will not retain this exchange once the response is sent'}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </Stage>
  );
}
