'use client';

import { ShieldCheck, ShieldOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BeforeAfterSpec, PanelLine } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const toneClass: Record<PanelLine['tone'], string> = {
  danger: 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400',
  success: 'border-green-500/30 bg-green-500/5 text-green-600 dark:text-green-400',
  neutral: 'border-border bg-muted/30 text-muted-foreground',
};

export function BeforeAfter({ spec }: { spec: BeforeAfterSpec }) {
  const player = useFramePlayer(spec.frames.length);
  const frame = spec.frames[player.index];
  if (!frame) return null;

  const panels = [
    {
      key: 'before',
      label: spec.beforeLabel,
      lines: spec.before,
      activeIndex: frame.beforeIndex,
      Icon: ShieldOff,
      iconClass: 'text-red-500',
    },
    {
      key: 'after',
      label: spec.afterLabel,
      lines: spec.after,
      activeIndex: frame.afterIndex,
      Icon: ShieldCheck,
      iconClass: 'text-green-500',
    },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid gap-4 p-4 md:grid-cols-2" aria-live="polite">
        {panels.map(({ key, label, lines, activeIndex, Icon, iconClass }) => (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Icon className={cn('h-4 w-4', iconClass)} aria-hidden="true" />
              <h4 className="text-sm font-semibold text-foreground">{label}</h4>
            </div>
            {lines.map((line, i) => (
              <div
                key={`${key}-${i}`}
                className={cn(
                  'rounded-md border px-3 py-1.5 font-mono text-xs',
                  toneClass[line.tone],
                  i === activeIndex && 'ring-1 ring-primary/50 interview-flash',
                )}
              >
                {line.text}
              </div>
            ))}
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
