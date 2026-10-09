'use client';

import { cn } from '@/lib/utils';
import type { MemoryCursor, MemoryDiagramSpec, MemoryRegion } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const BOX_W = 104;
const GAP = 12;

const cursorTone: Record<MemoryCursor['tone'], string> = {
  primary: 'border-primary/50 bg-primary/10 text-primary',
  danger: 'border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400',
  success: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
};

function boxCenterX(index: number) {
  return index * (BOX_W + GAP) + BOX_W / 2;
}

function RegionCursors({
  region,
  cursors,
}: {
  region: MemoryRegion;
  cursors: MemoryCursor[];
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8" aria-hidden="true">
      {cursors.map((cursor) => {
        const boxIndex = region.boxes.findIndex((box) => box.id === cursor.targetBoxId);
        if (boxIndex === -1) return null;
        return (
          <div
            key={cursor.id}
            className="absolute left-0 top-0 transition-transform duration-700 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(${boxCenterX(boxIndex)}px)` }}
          >
            <div className="flex -translate-x-1/2 flex-col items-center">
              <span
                className={cn(
                  'whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium shadow-sm',
                  cursorTone[cursor.tone],
                )}
              >
                {cursor.label}
              </span>
              <span
                className={cn(
                  'h-2 w-px',
                  cursor.tone === 'primary' && 'bg-primary',
                  cursor.tone === 'danger' && 'bg-red-500',
                  cursor.tone === 'success' && 'bg-green-500',
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function MemoryDiagram({ spec }: { spec: MemoryDiagramSpec }) {
  const player = useFramePlayer(spec.frames.length, { frameDuration: 3000 });
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const highlighted = new Set(frame.highlightBoxIds ?? []);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-4 p-4">
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

              <div className="overflow-x-auto pb-1">
                <div
                  className="relative pt-9"
                  style={{ width: region.boxes.length * (BOX_W + GAP) - GAP }}
                >
                  <RegionCursors region={region} cursors={cursors} />
                  <div className="flex">
                    {region.boxes.map((box, i) => {
                      const isHighlighted = highlighted.has(box.id) || box.highlight;
                      return (
                        <div
                          key={box.id}
                          className={cn(
                            'shrink-0 rounded-md border bg-background px-3 py-2 transition-colors duration-300',
                            isHighlighted
                              ? 'border-primary ring-2 ring-primary/30'
                              : 'border-border',
                          )}
                          style={{ width: BOX_W, marginRight: i < region.boxes.length - 1 ? GAP : 0 }}
                        >
                          <div
                            key={`${frame.id}-${box.id}`}
                            className={cn('text-xs font-medium text-foreground', isHighlighted && 'interview-pop')}
                          >
                            {box.label}
                          </div>
                          {box.value !== undefined && (
                            <div className="truncate font-mono text-[10px] text-muted-foreground">{box.value}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
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
