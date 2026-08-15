'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Topic } from '../types/content';
import { cn } from '../utils/cn';

type Props = {
  topic: Topic;
  className?: string;
};

export default function TopicCard({ topic, className }: Props) {
  return (
    <article className={cn('glass relative flex flex-col gap-3 p-4 sm:p-5 shadow-glow', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25rem] text-slate-400">Topic</p>
          <h3 className="text-lg font-semibold text-white">{topic.title}</h3>
        </div>
        <span className="rounded-full border border-border bg-accent/10 px-3 py-1 text-[11px] font-medium text-accentSoft">
          {topic.slug}
        </span>
      </div>
      <p className="text-sm text-slate-300">{topic.description}</p>
      <div className="flex flex-wrap gap-2">
        {topic.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border/80 bg-base/60 px-3 py-1 text-xs text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        href={`/browseruniverse/topics/${topic.slug}`}
        className="mt-auto inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/20 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-glow"
      >
        Start lesson <ArrowRight size={16} />
      </Link>
    </article>
  );
}
