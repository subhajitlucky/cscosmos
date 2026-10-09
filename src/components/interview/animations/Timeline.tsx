'use client';

import { cn } from '@/lib/utils';
import type { TimelineSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

export function Timeline({ spec }: { spec: TimelineSpec }) {
  const player = useFramePlayer(spec.frames.length);
  const frame = spec.frames[player.index];
  if (!frame) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-2 px-4 py-4">
        {spec.lanes.map((lane) => {
          const marks = frame.marks.filter((mark) => mark.laneId === lane.id);
          return (
            <div key={lane.id} className="flex items-start gap-3">
              <div className="w-28 shrink-0 pt-1.5">
                <div className="text-xs font-medium text-foreground">{lane.label}</div>
                <div className="font-mono text-[9px] uppercase text-muted-foreground">{lane.kind}</div>
              </div>
              <div className="flex min-h-10 flex-1 flex-wrap items-center gap-1.5 rounded-md border border-border bg-background/50 p-2">
                {marks.map((mark, i) => (
                  <span
                    key={`${mark.label}-${i}`}
                    className={cn(
                      'rounded-full border px-2 py-0.5 font-mono text-[10px]',
                      mark.status === 'active'
                        ? 'animate-pulse border-primary bg-primary/10 text-primary motion-reduce:animate-none'
                        : 'border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400',
                    )}
                  >
                    {mark.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={frame.caption} />
    </div>
  );
}
