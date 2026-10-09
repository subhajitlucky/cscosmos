'use client';

import { Bug, ShieldCheck, ShieldOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BeforeAfterSpec, PanelLine } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const ROW_H = 46;

const toneClass: Record<PanelLine['tone'], string> = {
  danger: 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400',
  success: 'border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400',
  neutral: 'border-border bg-muted/30 text-muted-foreground',
};

function PayloadCursor({ index }: { index: number }) {
  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-10 transition-transform duration-700 ease-in-out motion-reduce:transition-none"
      style={{ transform: `translateY(${index * ROW_H + 7}px)` }}
      aria-hidden="true"
    >
      <span className="flex h-6 w-9 items-center justify-center rounded-full border border-red-500/50 bg-red-500/15 text-red-600 shadow-[0_0_14px_rgba(239,68,68,0.35)] dark:text-red-400">
        <Bug className="h-3.5 w-3.5" />
      </span>
    </div>
  );
}

export function BeforeAfter({ spec }: { spec: BeforeAfterSpec }) {
  const player = useFramePlayer(spec.frames.length, { frameDuration: 3000 });
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const panels = [
    {
      key: 'before' as const,
      label: spec.beforeLabel,
      lines: spec.before,
      activeIndex: frame.beforeIndex,
      Icon: ShieldOff,
      iconClass: 'text-red-500',
      tone: 'danger' as const,
    },
    {
      key: 'after' as const,
      label: spec.afterLabel,
      lines: spec.after,
      activeIndex: frame.afterIndex,
      Icon: ShieldCheck,
      iconClass: 'text-green-600 dark:text-green-400',
      tone: 'success' as const,
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid gap-6 p-5 md:grid-cols-2">
        {panels.map(({ key, label, lines, activeIndex, Icon, iconClass, tone }) => (
          <div key={key} className="relative">
            <div className="mb-3 flex items-center gap-2">
              <Icon className={cn('h-4 w-4', iconClass)} aria-hidden="true" />
              <h4 className="text-sm font-semibold text-foreground">{label}</h4>
            </div>
            <div className="flex gap-3">
              <div className="relative w-9 shrink-0" style={{ height: lines.length * ROW_H }}>
                <PayloadCursor index={activeIndex} />
                <span
                  className={cn(
                    'absolute bottom-0 left-1/2 h-5 w-5 -translate-x-1/2',
                    tone === 'danger' ? 'text-red-500/70' : 'text-green-600/80 dark:text-green-400/80',
                  )}
                  aria-hidden="true"
                >
                  {tone === 'success' ? <ShieldCheck className="h-5 w-5" /> : <ShieldOff className="h-5 w-5" />}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                {lines.map((line, i) => (
                  <div
                    key={`${key}-${i}`}
                    className={cn(
                      'flex items-center rounded-md border px-3 font-mono text-xs transition-all duration-500',
                      toneClass[line.tone],
                      i === activeIndex && 'interview-flash ring-1 ring-primary/50',
                    )}
                    style={{ height: 38, marginBottom: ROW_H - 38 }}
                  >
                    <span className="truncate">{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2">
        <FrameControls player={player} />
      </div>
      <AnimationCaption caption={frame.caption} />
    </div>
  );
}
