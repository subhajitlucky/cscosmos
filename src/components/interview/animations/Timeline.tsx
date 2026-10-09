'use client';

import { cn } from '@/lib/utils';
import type { TimelineSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

export function Timeline({ spec }: { spec: TimelineSpec }) {
  const player = useFramePlayer(spec.frames.length, { frameDuration: 2800 });
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const marksByLane = new Map<string, { label: string; status: 'active' | 'done' }[]>();
  for (const lane of spec.lanes) {
    marksByLane.set(
      lane.id,
      frame.marks.filter((mark) => mark.laneId === lane.id),
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative px-4 py-4">
        <div className="pointer-events-none absolute inset-y-3 left-[136px] right-4 z-0" aria-hidden="true">
          <div key={frame.id} className="interview-playhead absolute inset-y-0 w-px bg-primary/50">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)]" />
          </div>
        </div>

        <div className="relative z-10 space-y-2.5">
          {spec.lanes.map((lane) => {
            const marks = marksByLane.get(lane.id) ?? [];
            return (
              <div key={lane.id} className="flex items-center gap-3">
                <div className="w-28 shrink-0 text-right">
                  <div className="truncate text-xs font-medium text-foreground">{lane.label}</div>
                  <div className="font-mono text-[9px] uppercase text-muted-foreground">{lane.kind}</div>
                </div>
                <div className="flex min-h-11 flex-1 flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-2">
                  {marks.length === 0 && (
                    <span className="font-mono text-[10px] text-muted-foreground/50">// empty</span>
                  )}
                  {marks.map((mark, i) => (
                    <span
                      key={`${lane.id}-${mark.label}`}
                      style={{ animationDelay: `${i * 130}ms` }}
                      className={cn(
                        'interview-slide-in inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px]',
                        mark.status === 'active'
                          ? 'animate-pulse border-primary bg-primary/10 font-medium text-primary motion-reduce:animate-none'
                          : 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400',
                      )}
                    >
                      <span
                        className={cn(
                          'h-1 w-1 rounded-full',
                          mark.status === 'active' ? 'bg-primary' : 'bg-green-600 dark:bg-green-400',
                        )}
                        aria-hidden="true"
                      />
                      {mark.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={frame.caption} />
    </div>
  );
}
