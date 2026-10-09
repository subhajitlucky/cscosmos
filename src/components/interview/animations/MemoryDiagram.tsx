'use client';

import { cn } from '@/lib/utils';
import type { MemoryCursor, MemoryDiagramSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const cursorTone: Record<MemoryCursor['tone'], string> = {
  primary: 'border-primary/40 bg-primary/10 text-primary',
  danger: 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400',
  success: 'border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400',
};

export function MemoryDiagram({ spec }: { spec: MemoryDiagramSpec }) {
  const player = useFramePlayer(spec.frames.length);
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const highlighted = new Set(frame.highlightBoxIds ?? []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-3 p-4" aria-live="polite">
        {spec.regions.map((region) => {
          const boxIds = new Set(region.boxes.map((box) => box.id));
          const cursors = frame.cursors.filter((cursor) => boxIds.has(cursor.targetBoxId));
          return (
            <div key={region.id} className="rounded-lg border border-border bg-background/50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-xs font-semibold text-foreground">{region.label}</h4>
                <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground">
                  {region.kind}
                </span>
              </div>
              {cursors.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {cursors.map((cursor) => {
                    const target = region.boxes.find((box) => box.id === cursor.targetBoxId);
                    return (
                      <span
                        key={cursor.id}
                        className={cn('rounded-full border px-2 py-0.5 font-mono text-[10px]', cursorTone[cursor.tone])}
                      >
                        {cursor.label} → {target?.label}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {region.boxes.map((box) => (
                  <div
                    key={box.id}
                    className={cn(
                      'min-w-24 rounded-md border border-border bg-background px-3 py-2',
                      (highlighted.has(box.id) || box.highlight) && 'border-primary ring-1 ring-primary/40',
                    )}
                  >
                    <div className="text-xs font-medium text-foreground">{box.label}</div>
                    {box.value !== undefined && (
                      <div className="font-mono text-[10px] text-muted-foreground">{box.value}</div>
                    )}
                  </div>
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
