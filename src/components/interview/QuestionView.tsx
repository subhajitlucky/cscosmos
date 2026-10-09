'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowRight, Lightbulb, Target } from 'lucide-react';
import {
  DIFFICULTY_META,
  FREQUENCY_META,
  ROUND_META,
  TYPE_META,
} from '@/data/interview';
import type { InterviewCategory, InterviewQuestion } from '@/data/interview';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { StepWalkthrough } from './StepWalkthrough';

export function QuestionView({
  category,
  question,
}: {
  category: InterviewCategory;
  question: InterviewQuestion;
}) {
  const difficulty = DIFFICULTY_META[question.difficulty];
  const frequency = FREQUENCY_META[question.frequency];

  return (
    <article className="mx-auto max-w-5xl">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/interview" className="transition-colors hover:text-foreground">
          Interview
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/interview/${category.key}`}
          className="transition-colors hover:text-foreground"
        >
          {category.shortTitle}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground/70">{question.topic}</span>
      </nav>

      <header className="mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{question.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficulty.className}`}
          >
            {difficulty.label}
          </span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${frequency.className}`}
          >
            {frequency.label}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {ROUND_META[question.round].label}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {TYPE_META[question.type].label}
          </span>
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {question.topic}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] text-muted-foreground/80">
          {question.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="glass-card p-5">
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Target className="h-4 w-4 shrink-0 text-primary" />
            What interviewers are testing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{question.whyAsked}</p>
        </section>
        <section className="glass-card p-5">
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <Lightbulb className="h-4 w-4 shrink-0 text-primary" />
            Mental model
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {question.mentalModel}
          </p>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Step-by-step solution</h2>
        <div className="mt-4">
          <StepWalkthrough steps={question.steps} />
        </div>
      </section>

      {question.edgeCases.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">Edge cases &amp; traps</h2>
          <ul className="mt-4 space-y-2">
            {question.edgeCases.map((edgeCase) => (
              <li
                key={edgeCase}
                className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-muted-foreground"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <span>{edgeCase}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {question.followUps.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-foreground">Follow-up questions</h2>
          <Accordion type="multiple" className="mt-2">
            {question.followUps.map((followUp, index) => (
              <AccordionItem key={followUp.q} value={`follow-up-${index}`}>
                <AccordionTrigger>{followUp.q}</AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {followUp.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      )}

      {question.relatedEngine && (
        <Link
          href={question.relatedEngine.href}
          className="focus-ring group mt-10 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60"
        >
          <span className="text-sm font-medium text-foreground">
            Go deeper: {question.relatedEngine.label}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </article>
  );
}
