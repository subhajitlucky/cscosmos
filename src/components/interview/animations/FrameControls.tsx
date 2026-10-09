'use client';

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FramePlayer } from './useFramePlayer';

export function FrameControls({ player, className }: { player: FramePlayer; className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <button
        type="button"
        onClick={player.reset}
        aria-label="Reset animation"
        className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={player.prev}
        aria-label="Previous frame"
        className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <SkipBack className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={player.toggle}
        aria-label={player.playing ? 'Pause animation' : 'Play animation'}
        className="rounded-md border border-primary/40 bg-primary/10 p-1.5 text-primary"
      >
        {player.playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        type="button"
        onClick={player.next}
        aria-label="Next frame"
        className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <SkipForward className="h-3.5 w-3.5" />
      </button>
      <div className="ml-1 flex items-center gap-0" role="group" aria-label="Animation frames">
        {Array.from({ length: player.count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => player.goTo(i)}
            aria-label={`Frame ${i + 1}${i === player.index ? ' (current)' : ''}`}
            aria-current={i === player.index ? 'true' : undefined}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span className={cn('h-1.5 rounded-full transition-all', i === player.index ? 'w-4 bg-primary' : 'w-1.5 bg-border')} />
          </button>
        ))}
      </div>
      <span className="ml-1 font-mono text-[10px] text-muted-foreground">
        {player.index + 1}/{player.count}
      </span>
    </div>
  );
}
