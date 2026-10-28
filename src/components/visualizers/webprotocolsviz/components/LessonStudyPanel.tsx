'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import { TopicNotes } from '@/components/learning/TopicNotes';
import { RelatedTopics } from '@/components/learning/RelatedTopics';
import { TopicComments } from '@/components/learning/TopicComments';
import { TOPIC_DOMAIN, TOPIC_NAME, TOPIC_SLUG } from '../data/topic';

interface LessonStudyPanelProps {
  moduleNumber: number;
  totalModules: number;
  completedCount: number;
  isDone: boolean;
  difficulty?: string;
  minutes?: number;
  onToggle: () => void;
}

export function LessonStudyPanel({
  moduleNumber,
  totalModules,
  completedCount,
  isDone,
  difficulty,
  minutes,
  onToggle,
}: LessonStudyPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Study kit
          </p>
          <h2 className="mt-1 text-sm font-semibold text-foreground">
            Module {moduleNumber} of {totalModules}
          </h2>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {difficulty ? `${difficulty} · ${minutes} min · ` : ''}
          {completedCount} of {totalModules} complete
        </p>
      </div>

      <div className="divide-y divide-border/70">
        <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Module status
            </p>
            <p className="mt-1 text-sm text-foreground">
              {isDone ? 'Completed' : 'Not completed yet'}
            </p>
          </div>
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isDone ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            {isDone ? 'Completed' : 'Mark module complete'}
          </button>
        </div>

        <div className="px-5 py-4">
          <TopicNotes slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} bare />
        </div>

        <div className="px-5 py-4">
          <RelatedTopics slug={TOPIC_SLUG} domain={TOPIC_DOMAIN} bare />
        </div>

        <div className="px-5 py-4">
          <TopicComments slug={TOPIC_SLUG} bare />
        </div>
      </div>
    </section>
  );
}
