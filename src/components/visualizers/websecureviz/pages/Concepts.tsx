'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  BookOpen,
  Lock,
  Layers,
  Globe,
  Code2,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { securityTopics, type SecurityTopic } from '../data/topics';
import { TOPIC_BASE_PATH } from '../data/topic';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'All',
  'Foundations',
  'Injection',
  'Authentication',
  'Browser Defense',
  'Architecture',
] as const;

export default function Concepts() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredTopics = securityTopics.filter((topic) => {
    if (selectedCategory === 'All') return true;
    return topic.category === selectedCategory;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner - Solid, No Gradients */}
      <div className="border border-border bg-card rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-mono font-semibold text-foreground">
              <BookOpen className="h-3.5 w-3.5 text-red-500" />
              <span>CORE ARCHITECTURAL CURRICULUM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Web Security Concepts & Mental Models
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Eight comprehensive, concept-first deep dives into modern browser isolation boundaries,
              cross-origin communication protocols, and defense-in-depth mitigations.
            </p>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6 text-xs text-muted-foreground">
            <div>
              <div className="text-xl font-bold font-mono text-foreground">{securityTopics.length}</div>
              <div>Modules</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-foreground">145 min</div>
              <div>Total Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-mono text-muted-foreground uppercase text-[11px] mr-1 shrink-0">
          Filter:
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-lg px-3.5 py-1.5 font-medium transition-colors shrink-0',
              selectedCategory === cat
                ? 'bg-foreground text-background font-semibold'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {cat} {cat === 'All' ? `(${securityTopics.length})` : ''}
          </button>
        ))}
      </div>

      {/* Topics Grid - Solid Cards, High Contrast, No Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTopics.map((topic, index) => {
          const globalIndex = securityTopics.findIndex((t) => t.id === topic.id);
          return (
            <Link
              key={topic.id}
              href={`${TOPIC_BASE_PATH}/topics/${topic.id}`}
              className="group border border-border bg-card rounded-xl p-6 flex flex-col justify-between hover:border-foreground/40 transition-colors shadow-2xs"
            >
              <div className="space-y-4">
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                    MODULE {globalIndex + 1 < 10 ? `0${globalIndex + 1}` : globalIndex + 1}
                  </span>
                  <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px]">
                    <Clock className="h-3 w-3" />
                    <span>{topic.estimatedTime}</span>
                  </div>
                </div>

                {/* Title & Category */}
                <div>
                  <h2 className="text-lg font-bold text-foreground group-hover:text-red-500 transition-colors">
                    {topic.name}
                  </h2>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mt-1">
                    {topic.category}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {topic.summary}
                </p>

                {/* Threat Vector / Mitigation Pills */}
                {topic.content.attackVector && (
                  <div className="border border-border/80 bg-background/60 rounded-lg p-2.5 text-[11px] space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldAlert className="h-3 w-3 text-red-500" />
                      <span>Threat Vector:</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-2">
                      {topic.content.attackVector}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60 text-xs">
                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                  {topic.content.detailedSections.length} sections · Code & Sandbox
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:translate-x-1 transition-transform">
                  <span>Start Lesson</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Next Steps Banner - Solid, No Gradients */}
      <div className="border border-border bg-card rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            Ready to test your practical instincts?
          </h3>
          <p className="text-xs text-muted-foreground">
            Explore the multi-tool Security Lab or solve all 52 questions in the Practice Arena.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Security Lab
          </Link>
          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="rounded-lg bg-foreground text-background px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Practice Arena (52 Qs)
          </Link>
        </div>
      </div>
    </div>
  );
}
