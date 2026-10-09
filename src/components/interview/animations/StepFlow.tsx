'use client';

import { ArrowDown, ArrowUp, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepFlowSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

type NodeState = 'error' | 'done' | 'active' | 'idle';

export function StepFlow({ spec }: { spec: StepFlowSpec }) {
  const player = useFramePlayer(spec.phases.length);
  const phase = spec.phases[player.index];
  if (!phase) return null;
  const active = new Set(phase.activeNodeIds ?? []);
  const done = new Set(phase.doneNodeIds ?? []);
  const error = new Set(phase.errorNodeIds ?? []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col items-center gap-2 px-4 py-6">
        {spec.nodes.map((node, nodeIndex) => {
          const state: NodeState = error.has(node.id)
            ? 'error'
            : done.has(node.id)
              ? 'done'
              : active.has(node.id)
                ? 'active'
                : 'idle';
          const incoming = (phase.packets ?? []).filter((packet) => packet.to === node.id);
          return (
            <div key={node.id} className="flex w-full max-w-sm flex-col items-center">
              {incoming.length > 0 && (
                <div className="mb-1 flex flex-wrap items-center justify-center gap-1">
                  {incoming.map((packet, i) => {
                    const fromNode = spec.nodes.find((n) => n.id === packet.from);
                    const fromIndex = spec.nodes.findIndex((n) => n.id === packet.from);
                    const Icon = fromIndex !== -1 && fromIndex > nodeIndex ? ArrowUp : ArrowDown;
                    const fromLabel = fromNode?.label ?? packet.from;
                    return (
                      <span
                        key={`${packet.from}-${packet.to}-${i}`}
                        className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary"
                      >
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {packet.label ? `${packet.label} from ${fromLabel}` : `from ${fromLabel}`}
                      </span>
                    );
                  })}
                </div>
              )}
              <div
                className={cn(
                  'w-full rounded-lg border bg-background px-4 py-2.5 text-center transition-all duration-300',
                  state === 'error' && 'border-red-500/60',
                  state === 'done' && 'border-green-500/50',
                  state === 'active' && 'border-primary',
                  state === 'idle' && 'border-border',
                  active.has(node.id) && 'ring-2 ring-primary/30 scale-[1.02]',
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  {state === 'done' && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />}
                  {state === 'error' && <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />}
                  <span className="text-sm font-medium text-foreground">{node.label}</span>
                </div>
                {node.sublabel && <p className="font-mono text-[10px] text-muted-foreground">{node.sublabel}</p>}
              </div>

              {nodeIndex < spec.nodes.length - 1 && (
                <div className="relative flex h-8 items-center justify-center">
                  <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={phase.caption} />
    </div>
  );
}
