'use client';

import { Pause, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FramePlayer } from './useFramePlayer';

export function FrameControls({ player, className }: { player: FramePlayer; className?: string }) {
  return (
    <div className={cn('flex w-full items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label="Animation progress"
        aria-valuemin={1}
        aria-valuemax={player.count}
        aria-valuenow={player.index + 1}
        aria-valuetext={`Frame ${player.index + 1} of ${player.count}`}
        className="flex flex-1 items-center gap-1"
      >
        {Array.from({ length: player.count }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-500',
              i < player.index ? 'bg-primary/60' : i === player.index ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={player.toggle}
        aria-label={player.atEnd ? 'Replay animation' : player.playing ? 'Pause animation' : 'Play animation'}
        className="focus-ring rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        {player.atEnd ? (
          <RotateCcw className="h-3.5 w-3.5" />
        ) : player.playing ? (
          <Pause className="h-3.5 w-3.5" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
