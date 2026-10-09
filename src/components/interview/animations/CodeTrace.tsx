'use client';

import { cn } from '@/lib/utils';
import type { CodeTraceSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

export function CodeTrace({ spec }: { spec: CodeTraceSpec }) {
  const player = useFramePlayer(spec.frames.length);
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const lines = spec.code.split('\n');
  const activeLines = new Set(frame.activeLines);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row">
        <div className="min-w-0 flex-1 overflow-x-auto py-3">
          {lines.map((line, i) => {
            const lineNumber = i + 1;
            const active = activeLines.has(lineNumber);
            return (
              <div
                key={lineNumber}
                className={cn('flex border-l-2', active ? 'border-primary bg-primary/10' : 'border-transparent')}
              >
                <span className="w-8 shrink-0 select-none pr-3 text-right font-mono text-xs text-muted-foreground/60">
                  {lineNumber}
                </span>
                <code className="whitespace-pre font-mono text-xs text-foreground">{line || ' '}</code>
              </div>
            );
          })}
        </div>
        <div
          className="w-full shrink-0 border-t border-border py-3 sm:w-40 sm:border-l sm:border-t-0 lg:w-48"
          aria-live="polite"
        >
          <div className="px-3">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground">Variables</h4>
            <div className="mt-2 space-y-1">
              {frame.variables.map((variable) => (
                <div key={variable.name} className="flex items-baseline justify-between gap-2 font-mono text-xs">
                  <span className="text-muted-foreground">{variable.name}</span>
                  <span className={cn('text-foreground', variable.changed && 'interview-flash rounded px-1')}>
                    {variable.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {frame.output !== undefined && (
        <div className="border-t border-border bg-muted/40 px-4 py-2 font-mono text-xs text-green-600 dark:text-green-400">
          <span aria-hidden="true">› </span>
          {frame.output}
        </div>
      )}
      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={frame.caption} />
    </div>
  );
}
