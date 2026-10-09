'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { CodeTraceSpec } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const LINE_H = 22;

function Typewriter({ text }: { text: string }) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!text) {
      setTyped('');
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(text);
      return;
    }
    setTyped('');
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 18);
    return () => clearInterval(timer);
  }, [text]);

  const done = typed.length >= text.length;
  return (
    <span>
      {typed}
      {!done && <span className="interview-caret ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] bg-green-600 dark:bg-green-400" />}
    </span>
  );
}

export function CodeTrace({ spec }: { spec: CodeTraceSpec }) {
  const player = useFramePlayer(spec.frames.length, { frameDuration: 3000 });
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const lines = spec.code.split('\n');
  const activeLines = new Set(frame.activeLines);
  const firstActiveLine = frame.activeLines.length > 0 ? Math.min(...frame.activeLines) : 1;
  const cursorTop = (firstActiveLine - 1) * LINE_H;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col sm:flex-row">
        <div className="relative min-w-0 flex-1 overflow-hidden py-3">
          <div
            className="pointer-events-none absolute inset-x-0 z-0 border-l-2 border-primary bg-primary/10 transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ height: LINE_H, transform: `translateY(${cursorTop + 12}px)` }}
            aria-hidden="true"
          >
            <span className="ml-0.5 inline-block text-[9px] leading-[22px] text-primary">▶</span>
          </div>

          <div className="relative z-10">
            {lines.map((line, i) => {
              const lineNumber = i + 1;
              const active = activeLines.has(lineNumber);
              return (
                <div key={lineNumber} className="flex" style={{ height: LINE_H }}>
                  <span className="w-8 shrink-0 select-none pr-3 text-right font-mono text-xs leading-[22px] text-muted-foreground/60">
                    {lineNumber}
                  </span>
                  <code
                    className={cn(
                      'whitespace-pre font-mono text-xs leading-[22px] transition-colors duration-300',
                      active ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {line || ' '}
                  </code>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full shrink-0 border-t border-border bg-background/40 py-3 sm:w-44 sm:border-l sm:border-t-0 lg:w-52">
          <div className="px-3">
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground">Variables</h4>
            <div className="mt-2 space-y-1.5">
              {frame.variables.map((variable) => (
                <div key={variable.name} className="flex items-baseline justify-between gap-2 font-mono text-xs">
                  <span className="truncate text-muted-foreground">{variable.name}</span>
                  <span
                    key={`${variable.name}-${variable.value}`}
                    className={cn(
                      'shrink-0 rounded px-1 text-foreground',
                      variable.changed && 'interview-pop interview-flash',
                    )}
                  >
                    {variable.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {frame.output !== undefined && (
        <div className="flex min-h-9 items-center border-t border-border bg-muted/40 px-4 py-2 font-mono text-xs text-green-700 dark:text-green-400">
          <span className="mr-1.5 text-muted-foreground" aria-hidden="true">›</span>
          <Typewriter text={frame.output} />
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={frame.caption} />
    </div>
  );
}
