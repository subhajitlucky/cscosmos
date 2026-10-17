'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { StoryCastStateValue, StorySpec, StoryToken } from '@/data/interview/types';
import { AnimationCaption } from './AnimationCaption';
import { FrameControls } from './FrameControls';
import { useFramePlayer } from './useFramePlayer';

const TOKEN_TRAVEL_MS = 1100;
const TOKEN_STACK_GAP = 72;
const TOKEN_ROWS_ABOVE = 92;

type Center = { x: number; y: number };

function effectClass(effect?: StoryToken['effect']) {
  switch (effect) {
    case 'pop':
      return 'interview-pop';
    case 'burst':
      return 'interview-burst';
    case 'shake':
      return 'interview-shake';
    case 'float':
      return 'interview-float';
    default:
      return '';
  }
}

function stateBadge(state: StoryCastStateValue): string | null {
  switch (state) {
    case 'done':
      return '✅';
    case 'crashed':
      return '💥';
    case 'locked':
      return '🔒';
    case 'happy':
      return '✨';
    default:
      return null;
  }
}

function TokenChip({ token }: { token: StoryToken }) {
  return (
    <div
      className={cn(
        'pointer-events-none flex items-center gap-1.5 rounded-2xl border border-border bg-card/95 px-2.5 py-1.5 shadow-xl backdrop-blur',
        effectClass(token.effect),
      )}
    >
      <span className="text-3xl leading-none" aria-hidden="true">
        {token.icon}
      </span>
      {token.label && (
        <span className="whitespace-nowrap rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
          {token.label}
        </span>
      )}
    </div>
  );
}

function TravelingToken({ token, from, to }: { token: StoryToken; from: Center; to: Center }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = `translate(${from.x}px, ${from.y}px) translate(-50%, -50%)`;
  const hop = `translate(${(from.x + to.x) / 2}px, ${Math.min(from.y, to.y) - 42}px) translate(-50%, -50%)`;
  const end = `translate(${to.x}px, ${to.y}px) translate(-50%, -50%)`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof el.animate !== 'function') {
      el.style.transform = end;
      return;
    }
    const anim = el.animate(
      [
        { transform: start, opacity: 0.3, offset: 0 },
        { transform: hop, opacity: 1, offset: 0.5 },
        { transform: end, opacity: 1 },
      ],
      { duration: TOKEN_TRAVEL_MS, easing: 'cubic-bezier(0.45, 0.05, 0.25, 1)', fill: 'forwards' },
    );
    return () => anim.cancel();
  }, [start, hop, end]);

  return (
    <div ref={ref} className="absolute left-0 top-0 z-20 will-change-transform" style={{ transform: start }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <TokenChip token={token} />
      </div>
    </div>
  );
}

export function Story({ spec }: { spec: StorySpec }) {
  const player = useFramePlayer(spec.frames.length, { frameDuration: 3400 });
  const frame = spec.frames[player.index];
  const containerRef = useRef<HTMLDivElement>(null);
  const castRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [centers, setCenters] = useState<Record<string, Center>>({});

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const base = container.getBoundingClientRect();
    const next: Record<string, Center> = {};
    for (const member of spec.cast) {
      const el = castRefs.current[member.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      next[member.id] = {
        x: rect.left - base.left + rect.width / 2,
        y: rect.top - base.top + rect.height / 2,
      };
    }
    setCenters(next);
  }, [spec.cast]);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, frame?.id]);

  if (!frame) return null;

  const stateOf = (id: string) => frame.cast?.find((entry) => entry.id === id);

  const tokenIcons = new Set(frame.tokens.map((token) => token.icon));

  const staticCounts = new Map<string, number>();
  const travelCounts = new Map<string, number>();
  for (const token of frame.tokens) {
    if (token.at && !token.from) staticCounts.set(token.at, (staticCounts.get(token.at) ?? 0) + 1);
    if (token.from && token.to && token.from !== token.to) {
      const key = `${token.from}->${token.to}`;
      travelCounts.set(key, (travelCounts.get(key) ?? 0) + 1);
    }
  }
  const staticSeen = new Map<string, number>();
  const travelSeen = new Map<string, number>();

  const ready = spec.cast.every((member) => centers[member.id]);

  const moodClass =
    frame.mood === 'bad'
      ? 'bg-red-500/[0.06] ring-1 ring-inset ring-red-500/20'
      : frame.mood === 'good'
        ? 'bg-green-500/[0.06] ring-1 ring-inset ring-green-500/20'
        : 'bg-muted/30';

  const shoutClass =
    frame.shout?.tone === 'bad'
      ? 'border-red-500 bg-red-500/15 text-red-500'
      : frame.shout?.tone === 'good'
        ? 'border-green-500 bg-green-500/15 text-green-600 dark:text-green-400'
        : 'border-primary bg-primary/10 text-primary';

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        ref={containerRef}
        className="relative flex min-h-[300px] items-end justify-around gap-6 px-8 pb-7 pt-20"
      >
        <div
          className={cn('pointer-events-none absolute inset-x-6 bottom-4 top-4 rounded-3xl transition-colors duration-500', moodClass)}
          aria-hidden="true"
        />

        {frame.shout && (
          <div
            key={`${frame.id}-shout`}
            className={cn(
              'interview-pop absolute left-1/2 top-4 z-30 -translate-x-1/2 -rotate-2 whitespace-nowrap rounded-2xl border-4 px-4 py-1.5 text-lg font-black uppercase tracking-wider shadow-lg sm:text-xl',
              shoutClass,
            )}
          >
            {frame.shout.text}
          </div>
        )}

        {spec.cast.map((member) => {
          const entry = stateOf(member.id);
          const state = entry?.state ?? 'idle';
          const icon = entry?.face ?? member.icon;
          const rawBadge = stateBadge(state);
          const badge = rawBadge && !tokenIcons.has(rawBadge) ? rawBadge : null;
          return (
            <div
              key={member.id}
              ref={(el) => {
                castRefs.current[member.id] = el;
              }}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  'relative flex h-24 w-24 items-center justify-center rounded-full border-2 bg-background/90 transition-all duration-500',
                  state === 'idle' && 'border-transparent opacity-75',
                  state === 'working' && 'interview-breathe border-primary',
                  state === 'done' && 'border-green-500/70 shadow-[0_0_28px_rgba(34,197,94,0.3)]',
                  state === 'crashed' && 'interview-shake rotate-6 border-red-500/80 grayscale-[0.4]',
                  state === 'locked' && 'border-amber-500/80 shadow-[0_0_26px_rgba(245,158,11,0.3)]',
                  state === 'happy' && 'border-primary shadow-[0_0_28px_hsl(var(--primary)/0.35)]',
                )}
              >
                <span
                  key={`${frame.id}-${member.id}-${icon}`}
                  className={cn('text-6xl leading-none', state === 'working' && 'interview-bob')}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                {badge && (
                  <span key={`${frame.id}-${member.id}-badge`} className="interview-pop absolute -right-2 -top-2 text-3xl">
                    {badge}
                  </span>
                )}
              </div>
              <span className="rounded-full bg-muted/70 px-2.5 py-0.5 text-xs font-semibold text-foreground">
                {member.label}
              </span>
            </div>
          );
        })}

        {ready &&
          frame.tokens.map((token, i) => {
            const from = token.from ? centers[token.from] : undefined;
            const to = token.to ? centers[token.to] : undefined;
            if (token.from && token.to && from && to && token.from !== token.to) {
              const key = `${token.from}->${token.to}`;
              const total = travelCounts.get(key) ?? 1;
              const seen = travelSeen.get(key) ?? 0;
              travelSeen.set(key, seen + 1);
              const offset = total > 1 ? (seen - (total - 1) / 2) * TOKEN_STACK_GAP : 0;
              return (
                <TravelingToken
                  key={`${frame.id}-${token.id}-${i}`}
                  token={token}
                  from={{ x: from.x + offset, y: from.y - TOKEN_ROWS_ABOVE }}
                  to={{ x: to.x + offset, y: to.y - TOKEN_ROWS_ABOVE }}
                />
              );
            }
            const anchor = centers[token.at ?? token.to ?? token.from ?? ''] ?? centers[spec.cast[0]?.id ?? ''];
            if (!anchor) return null;
            let offset = 0;
            if (token.at && !token.from && (staticCounts.get(token.at) ?? 0) > 1) {
              const seen = staticSeen.get(token.at) ?? 0;
              staticSeen.set(token.at, seen + 1);
              const total = staticCounts.get(token.at) ?? 1;
              offset = (seen - (total - 1) / 2) * TOKEN_STACK_GAP;
            }
            return (
              <span
                key={`${frame.id}-${token.id}-${i}`}
                className="absolute left-0 top-0 z-20"
                style={{
                  transform: `translate(${anchor.x + offset}px, ${anchor.y - TOKEN_ROWS_ABOVE}px) translate(-50%, -50%)`,
                }}
              >
                <TokenChip token={token} />
              </span>
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
