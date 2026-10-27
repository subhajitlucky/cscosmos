'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { Topic, TopicVisual } from '../../data/learning-path';

/* ---------------------------------------------------------------------------
 * Shared chrome for the seven topic visualizations.
 *
 * Only the *frame* lives here — the black stage, the uppercase micro-label, the
 * terminal button. Every visualization below draws its own body geometry and its
 * own interaction; sharing the frame is the invisible part, sharing the body is
 * the FS-27c bug.
 * ------------------------------------------------------------------------- */

export const VISUAL_LABELS: Record<TopicVisual, string> = {
  'interface-contract': 'CONTRACT_BOUNDARY',
  'round-trip': 'REQUEST_RESPONSE_ROUND_TRIP',
  'http-message': 'MESSAGE_ANATOMY',
  'resource-verbs': 'RESOURCE_VERB_SEMANTICS',
  'schema-resolution': 'SCHEMA_TO_FIELD_RESOLUTION',
  'auth-gate': 'CREDENTIAL_GATE_CHAIN',
  'cache-flow': 'LAYERED_CACHE_FLOW',
};

export function Micro({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400/40',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Stage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('relative h-full w-full overflow-hidden p-8', className)}>
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('border-2 border-cyan-400/10 bg-black/40 p-4', className)}>{children}</div>
  );
}

export function TerminalButton({
  onClick,
  disabled,
  active,
  children,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] transition-all',
        active
          ? 'border-cyan-400 bg-cyan-400 text-black'
          : 'border-cyan-400/30 text-cyan-400/60 hover:border-cyan-400 hover:text-cyan-400',
        disabled && 'pointer-events-none opacity-20',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Flag({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={cn(
        'border px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.2em]',
        on
          ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400'
          : 'border-white/10 bg-white/5 text-cyan-400/25',
      )}
    >
      {label}
      {on ? '::YES' : '::NO'}
    </span>
  );
}

/** The one line every visualization shows about why it looks the way it does. */
export function VisualCaption({ topic }: { topic: Topic }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-400/10 pb-3">
      <Micro className="text-cyan-400/60">
        METHOD::{VISUAL_LABELS[topic.visual]}
      </Micro>
      <Micro>{topic.slug}</Micro>
    </div>
  );
}
