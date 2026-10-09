'use client';

import { ArrowDown, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepFlowSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

export function StepFlow({ spec }: { spec: StepFlowSpec }) {
  const player = useFramePlayer(spec.phases.length);
  const phase = spec.phases[player.index];
  if (!phase) return null;
  const active = new Set(phase.activeNodeIds ?? []);
  const done = new Set(phase.doneNodeIds ?? []);
  const error = new Set(phase.errorNodeIds ?? []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col items-center gap-2 px-4 py-6" aria-live="polite">
        {spec.nodes.map((node, i) => (
          <div key={node.id} className="flex w-full max-w-sm flex-col items-center">
            <div
              className={cn(
                'w-full rounded-lg border bg-background px-4 py-2.5 text-center transition-all duration-300',
                active.has(node.id) && 'border-primary ring-2 ring-primary/30 scale-[1.02]',
                done.has(node.id) && 'border-green-500/50',
                error.has(node.id) && 'border-red-500/60',
                !active.has(node.id) && !done.has(node.id) && !error.has(node.id) && 'border-border',
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {done.has(node.id) && <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />}
                {error.has(node.id) && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                <span className="text-sm font-medium text-foreground">{node.label}</span>
              </div>
              {node.sublabel && <p className="font-mono text-[10px] text-muted-foreground">{node.sublabel}</p>}
            </div>

            {i < spec.nodes.length - 1 && (
              <div key={phase.id} className="relative flex h-8 items-center justify-center">
                <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                {phase.packets
                  ?.filter((p) => p.from === node.id)
                  .map((p) => (
                    <span
                      key={`${p.from}-${p.to}`}
                      className="interview-packet absolute left-full ml-1 whitespace-nowrap rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
                    >
                      {p.label ?? '→'}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={phase.caption} />
    </div>
  );
}
