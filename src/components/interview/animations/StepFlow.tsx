'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StepFlowSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const NODE_H = 56;
const ROW_H = 88;
const PACKET_TRAVEL_MS = 1000;
const PACKET_ARRIVE_DELAY_MS = 900;

const rowY = (index: number) => index * ROW_H;

function TravelingPacket({ fromIndex, toIndex, label }: { fromIndex: number; toIndex: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fromY = rowY(fromIndex);
  const toY = rowY(toIndex);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof el.animate !== 'function') {
      el.style.transform = `translateY(${toY}px)`;
      return;
    }
    el.style.transform = `translateY(${fromY}px)`;
    const anim = el.animate(
      [
        { transform: `translateY(${fromY}px)`, opacity: 0.35 },
        { transform: `translateY(${fromY + (toY - fromY) * 0.5}px)`, opacity: 1, offset: 0.5 },
        { transform: `translateY(${toY}px)`, opacity: 1 },
      ],
      { duration: PACKET_TRAVEL_MS, easing: 'cubic-bezier(0.45, 0.05, 0.25, 1)', fill: 'forwards' },
    );
    return () => anim.cancel();
  }, [fromY, toY]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-x-0 top-0 z-20 h-14 will-change-transform">
      <div className="flex h-full items-center justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-background/95 px-3 py-1 font-mono text-[11px] font-medium text-primary shadow-[0_0_18px_hsl(var(--primary)/0.35)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {label}
        </span>
      </div>
    </div>
  );
}

export function StepFlow({ spec }: { spec: StepFlowSpec }) {
  const player = useFramePlayer(spec.phases.length);
  const phase = spec.phases[player.index];
  if (!phase) return null;

  const active = new Set(phase.activeNodeIds ?? []);
  const done = new Set(phase.doneNodeIds ?? []);
  const error = new Set(phase.errorNodeIds ?? []);
  const nodeIndex = new Map(spec.nodes.map((node, i) => [node.id, i]));

  const height = (spec.nodes.length - 1) * ROW_H + NODE_H;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-4 py-5">
        <div className="relative" style={{ height }}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            {spec.nodes.slice(0, -1).map((node, i) => {
              const y1 = rowY(i) + NODE_H;
              const y2 = rowY(i + 1);
              return (
                <g key={node.id}>
                  <line x1="50%" y1={y1} x2="50%" y2={y2} className="stroke-border" strokeWidth="1.5" />
                  <line
                    x1="50%"
                    y1={y1}
                    x2="50%"
                    y2={y2}
                    className="interview-dash stroke-primary/40"
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
          </svg>

          {phase.packets?.map((packet, i) => {
            const fromIndex = nodeIndex.get(packet.from);
            const toIndex = nodeIndex.get(packet.to);
            if (fromIndex === undefined || toIndex === undefined || fromIndex === toIndex) return null;
            return (
              <TravelingPacket
                key={`${phase.id}-${packet.from}-${packet.to}-${i}`}
                fromIndex={fromIndex}
                toIndex={toIndex}
                label={packet.label ?? spec.nodes[fromIndex]?.label ?? ''}
              />
            );
          })}

          {phase.packets?.map((packet, i) => {
            const toIndex = nodeIndex.get(packet.to);
            if (toIndex === undefined) return null;
            return (
              <span
                key={`arrive-${phase.id}-${packet.to}-${i}`}
                className="interview-ring pointer-events-none absolute left-1/2 z-10 h-20 w-24 -translate-x-1/2 rounded-full border-2 border-primary/60"
                style={{ top: rowY(toIndex) + NODE_H / 2 - 40, animationDelay: `${PACKET_ARRIVE_DELAY_MS}ms` }}
                aria-hidden="true"
              />
            );
          })}

          {spec.nodes.map((node, i) => {
            const state = error.has(node.id)
              ? 'error'
              : done.has(node.id)
                ? 'done'
                : active.has(node.id)
                  ? 'active'
                  : 'idle';
            return (
              <div key={node.id} className="absolute inset-x-0" style={{ top: rowY(i) }}>
                <div
                  className={cn(
                    'relative mx-auto flex w-full max-w-sm items-center justify-center gap-2 rounded-xl border-2 bg-background px-4 transition-all duration-500',
                    'h-14',
                    state === 'idle' && 'border-border',
                    state === 'active' && 'interview-breathe scale-[1.03] border-primary',
                    state === 'done' && 'border-green-500/60',
                    state === 'error' && 'interview-shake border-red-500/70',
                  )}
                >
                  {state === 'done' && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden="true" />
                  )}
                  {state === 'error' && (
                    <XCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
                  )}
                  <div className="min-w-0 text-center">
                    <div className="truncate text-sm font-semibold text-foreground">{node.label}</div>
                    {node.sublabel && (
                      <div className="truncate font-mono text-[10px] text-muted-foreground">{node.sublabel}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={phase.caption} />
    </div>
  );
}
