'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Code2,
  CheckSquare,
} from 'lucide-react';
import { securityTopics, type SecurityTopic } from '../data/topics';
import { TOPIC_BASE_PATH } from '../data/topic';
import { cn } from '@/lib/utils';

// Import visualizers
import { OriginIsolation } from '../components/visuals/OriginIsolation';
import { CorsPreflight } from '../components/visuals/CorsPreflight';
import { XssInjection } from '../components/visuals/XssInjection';
import { CsrfFlow } from '../components/visuals/CsrfFlow';
import { CspBuilder } from '../components/visuals/CspBuilder';
import { CookieSecurity } from '../components/visuals/CookieSecurity';
import { ClickjackingVisual } from '../components/visuals/ClickjackingVisual';
import { DefenseStackVisual } from '../components/visuals/DefenseStackVisual';

interface TopicLessonProps {
  topicId: string;
}

export default function TopicLesson({ topicId }: TopicLessonProps) {
  const currentIndex = securityTopics.findIndex((t) => t.id === topicId);
  const topic: SecurityTopic | undefined = securityTopics[currentIndex];

  if (!topic) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Topic Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The requested security module does not exist in the curriculum.
        </p>
        <Link
          href={TOPIC_BASE_PATH}
          className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-xs font-semibold"
        >
          Return to Overview
        </Link>
      </div>
    );
  }

  const prevTopic = currentIndex > 0 ? securityTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < securityTopics.length - 1 ? securityTopics[currentIndex + 1] : null;

  // Render the matching visualizer
  const renderVisualizer = () => {
    switch (topic.content.visualizationType) {
      case 'sop':
        return <OriginIsolation />;
      case 'cors':
        return <CorsPreflight />;
      case 'xss':
        return <XssInjection />;
      case 'csrf':
        return <CsrfFlow />;
      case 'csp':
        return <CspBuilder />;
      case 'cookies':
        return <CookieSecurity />;
      case 'clickjacking':
        return <ClickjackingVisual />;
      case 'defense-stack':
        return <DefenseStackVisual />;
      default:
        return null;
    }
  };

  return (
    <article className="space-y-10 pb-20 max-w-5xl mx-auto">
      {/* Lesson Header */}
      <header className="space-y-4 border-b border-border/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
              Module {currentIndex + 1} of {securityTopics.length}
            </span>
            <span className="font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
              {topic.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Estimated time: {topic.estimatedTime}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          {topic.name}
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </header>

      {/* Core Definition Card */}
      <section className="rounded-xl border border-border bg-card p-6 sm:p-7 space-y-3">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-wider">
          <BookOpen className="h-4 w-4 text-red-500" />
          <span>Core Concept & Mental Model</span>
        </div>
        <p className="text-foreground/90 text-sm sm:text-base leading-relaxed">
          {topic.content.definition}
        </p>
      </section>

      {/* Attack Vector vs Defense Strategy */}
      {(topic.content.attackVector || topic.content.defenseStrategy) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topic.content.attackVector && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                <span>Threat Vector & Impact</span>
              </div>
              <p className="text-foreground/85 text-xs sm:text-sm leading-relaxed">
                {topic.content.attackVector}
              </p>
            </div>
          )}

          {topic.content.defenseStrategy && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>Defensive Architecture & Mitigation</span>
              </div>
              <p className="text-foreground/85 text-xs sm:text-sm leading-relaxed">
                {topic.content.defenseStrategy}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Detailed Technical Sections */}
      {topic.content.detailedSections.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Technical Deep Dive</h2>
          <div className="space-y-4">
            {topic.content.detailedSections.map((sec, idx) => (
              <div key={idx} className="rounded-xl border border-border bg-card p-6 space-y-3">
                <h3 className="text-base font-bold text-foreground">{sec.title}</h3>
                {sec.content && (
                  <p className="text-sm text-foreground/85 leading-relaxed">{sec.content}</p>
                )}
                {sec.subItems && sec.subItems.length > 0 && (
                  <ul className="grid grid-cols-1 gap-2 pt-2">
                    {sec.subItems.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="rounded-lg border border-border/60 bg-background/60 p-3 text-xs space-y-1"
                      >
                        <strong className="text-foreground font-mono block">{item.label}</strong>
                        <span className="text-muted-foreground">{item.description}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.code && (
                  <pre className="rounded-lg bg-zinc-950 p-3.5 font-mono text-xs text-zinc-100 overflow-x-auto mt-2">
                    {sec.code}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interactive Visualizer Canvas */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <span>Interactive Mental Model Simulation</span>
          </h2>
          <span className="text-xs text-muted-foreground font-mono bg-muted px-2.5 py-1 rounded-md">
            Live Visualizer
          </span>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm overflow-hidden">
          {renderVisualizer()}
        </div>
      </section>

      {/* Vulnerable vs Secure Code Comparison */}
      {topic.content.codeExample && (
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-foreground" />
            <h2 className="text-xl font-bold text-foreground">Code Implementation & Patching</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topic.content.codeExample.vulnerable && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="font-bold text-rose-500 uppercase tracking-wider">
                    Vulnerable Code (Exploitable)
                  </span>
                </div>
                <pre className="rounded-xl border border-rose-500/30 bg-zinc-950 p-4 font-mono text-xs text-rose-300 overflow-x-auto min-h-[160px]">
                  {topic.content.codeExample.vulnerable}
                </pre>
              </div>
            )}

            {topic.content.codeExample.secure && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 text-xs">
                  <span className="font-bold text-emerald-500 uppercase tracking-wider">
                    Secure Patched Code (Hardened)
                  </span>
                </div>
                <pre className="rounded-xl border border-emerald-500/30 bg-zinc-950 p-4 font-mono text-xs text-emerald-300 overflow-x-auto min-h-[160px]">
                  {topic.content.codeExample.secure}
                </pre>
              </div>
            )}
          </div>

          {topic.content.codeExample.explanation && (
            <div className="rounded-lg border border-border bg-muted/40 p-3.5 text-xs text-foreground/80 leading-relaxed">
              <strong>Security Analysis: </strong>
              {topic.content.codeExample.explanation}
            </div>
          )}
        </section>
      )}

      {/* Arena CTA */}
      <section className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/10 via-red-500/5 to-transparent p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">
            Test Your Knowledge on {topic.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            Challenge yourself with realistic scenario questions in the Web Security Arena.
          </p>
        </div>
        <Link
          href={`${TOPIC_BASE_PATH}/problems`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shrink-0 transition-colors shadow-xs"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Launch Practice Arena</span>
        </Link>
      </section>

      {/* Prev / Next Navigation Footer */}
      <nav
        aria-label="Module pagination"
        className="flex items-center justify-between pt-8 border-t border-border/80"
      >
        {prevTopic ? (
          <Link
            href={`${TOPIC_BASE_PATH}/topics/${prevTopic.id}`}
            className="flex items-center gap-2 rounded-lg border border-border p-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors max-w-[45%]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <div className="truncate text-left">
              <div className="text-[10px] text-muted-foreground uppercase">Previous Module</div>
              <span className="text-foreground">{prevTopic.name}</span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`${TOPIC_BASE_PATH}/topics/${nextTopic.id}`}
            className="flex items-center gap-2 rounded-lg border border-border p-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors max-w-[45%] text-right ml-auto"
          >
            <div className="truncate text-right">
              <div className="text-[10px] text-muted-foreground uppercase">Next Module</div>
              <span className="text-foreground">{nextTopic.name}</span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        ) : (
          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="flex items-center gap-2 rounded-lg bg-foreground text-background p-3 text-xs font-bold hover:opacity-90 transition-opacity ml-auto"
          >
            <span>Complete Certification Practice</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        )}
      </nav>
    </article>
  );
}
