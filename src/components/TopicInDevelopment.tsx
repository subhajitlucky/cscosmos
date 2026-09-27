'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Cpu, FlaskConical, HelpCircle, Layers, Sparkles } from 'lucide-react';
import type { Topic } from '@/data/topics';
import { domains } from '@/data/domains';

interface TopicInDevelopmentProps {
  topic: Topic;
  viewName?: string;
  activeTopics?: Topic[];
}

export function TopicInDevelopment({ topic, viewName, activeTopics = [] }: TopicInDevelopmentProps) {
  const domainInfo = domains.find((d) => d.domainKey === topic.domain);
  const domainName = domainInfo?.name || topic.domain.toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${topic.domain}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to {domainName}
        </Link>
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
          <Clock className="w-3 h-3" /> IN ACTIVE DEVELOPMENT
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> {domainName.toUpperCase()}
            </span>
            {viewName && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
                VIEW: {viewName.toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground">
            {topic.name}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
            {topic.shortDescription}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={`/${topic.domain}`}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-90 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Explore {domainName} Topics
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <Layers className="w-4 h-4" /> View All 100 Topics
            </Link>
          </div>
        </div>
      </section>

      {/* 4-View Learning Matrix Blueprint */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Standard 4-View Learning Architecture Under Construction
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Every topic on CSCosmos is engineered from scratch using a dedicated 4-layer interactive pedagogy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground font-semibold">VIEW 01</div>
              <h3 className="font-semibold text-base text-foreground">Curriculum Map</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Foundational mental models, architectural breakdowns, taxonomy, and intuitive diagrams.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground font-semibold">VIEW 02</div>
              <h3 className="font-semibold text-base text-foreground">Subtopic Deep-Dives</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Granular subtopics with embedded interactive visualizers, code playgrounds, and pitfall analysis.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground font-semibold">VIEW 03</div>
              <h3 className="font-semibold text-base text-foreground">Interactive Lab Studio</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero-latency workbench with parameter sliders, real-time metrics, and live runtime simulation.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="p-2.5 w-fit rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="font-mono text-xs text-muted-foreground font-semibold">VIEW 04</div>
              <h3 className="font-semibold text-base text-foreground">Certification Arena</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scenario-based evaluation challenges with instantaneous feedback and deep engineering rationale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Active Topics in this Domain */}
      {activeTopics.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Ready to Learn? Live Topics in {domainName}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore fully live topics equipped with the complete 4-view interactive experience.
              </p>
            </div>
            <Link
              href={`/${topic.domain}`}
              className="text-xs font-mono text-primary hover:underline hidden sm:inline-block"
            >
              All {domainName} Topics &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTopics.slice(0, 4).map((live) => (
              <Link
                key={live.id}
                href={live.url || `/${live.domain}/${live.slug}`}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-emerald-500 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE MODULE
                    </span>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      {live.domain}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {live.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {live.shortDescription}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono text-primary font-semibold">
                  <span>Start Learning</span>
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
