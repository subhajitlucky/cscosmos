'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Play,
  Target,
} from 'lucide-react';
import { getAdjacentCChapters, getCChapter } from '../data/curriculum';
import { cLessons } from '../data/lessons';
import { useCProgress } from '../lib/progress';
import { useCBasePath } from '../components/CShell';
import { CodeBlock } from '../components/CodeBlock';
import { Walkthrough } from '../components/walkthroughs/Walkthrough';

export function Topic({ chapterId }: { chapterId: string }) {
  const basePath = useCBasePath();
  const chapter = getCChapter(chapterId);
  const lesson = cLessons[chapterId];
  const { previous, next } = getAdjacentCChapters(chapterId);
  const { progress, markChapterComplete } = useCProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!chapter || !lesson) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-mono text-sm font-bold" style={{ color: 'var(--c-danger)' }}>
          CHAPTER_NOT_FOUND
        </p>
        <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
          The requested chapter does not exist in the C curriculum.
        </p>
        <Link href={`${basePath}/learn`} className="cviz-link text-sm font-semibold">
          Back to the curriculum
        </Link>
      </div>
    );
  }

  const isDone = progress.completedChapters.includes(chapter.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--c-border)' }}>
        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/learn`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold"
            style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)', backgroundColor: 'var(--c-surface)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Curriculum
          </Link>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-primary)' }}>
            Chapter {String(chapter.number).padStart(2, '0')} · {chapter.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => markChapterComplete(chapter.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors"
          style={{
            borderColor: isDone ? 'var(--c-ok)' : 'var(--c-border)',
            color: isDone ? 'var(--c-ok)' : 'var(--c-text)',
            backgroundColor: isDone ? 'var(--c-ok-soft)' : 'var(--c-surface)',
          }}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {isDone ? 'Completed' : 'Mark complete'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
        <article className="min-w-0">
          <header className="mb-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold" style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)', backgroundColor: 'var(--c-surface-2)' }}>
                {chapter.difficulty}
              </span>
              <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold" style={{ borderColor: 'var(--c-accent)', color: 'var(--c-accent)', backgroundColor: 'var(--c-accent-soft)' }}>
                {chapter.examWeight} focus
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
                ~{chapter.estimatedMinutes} min
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{chapter.title}</h1>
            <p className="max-w-3xl text-base leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              {lesson.hook}
            </p>
          </header>

          <div className="mb-4 rounded-2xl border p-4" style={{ borderColor: 'var(--c-primary)', backgroundColor: 'var(--c-primary-soft)' }}>
            <h2 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-primary)' }}>In plain English</h2>
            <p className="text-sm leading-relaxed">{lesson.plainEnglish}</p>
          </div>

          <div className="space-y-8">
            {lesson.sections.map((section, index) => (
              <section key={section.title} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-[10px] font-bold" style={{ borderColor: 'var(--c-border)', color: 'var(--c-primary)', backgroundColor: 'var(--c-primary-soft)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-lg font-bold tracking-tight">{section.title}</h2>
                </div>
                <p className="cviz-prose text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  {section.body}
                </p>
                {section.code && <CodeBlock code={section.code} caption={`chapter-${String(chapter.number).padStart(2, '0')}.c`} />}
              </section>
            ))}

            {lesson.walkthrough && (
              <section className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg border"
                    style={{ borderColor: 'var(--c-border)', color: 'var(--c-accent)', backgroundColor: 'var(--c-accent-soft)' }}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Watch it happen</h2>
                    <p className="text-[11px]" style={{ color: 'var(--c-muted)' }}>
                      Step through the memory changes one instruction at a time.
                    </p>
                  </div>
                </div>
                <Walkthrough config={lesson.walkthrough} />
              </section>
            )}

            <section className="grid gap-4 pt-4 md:grid-cols-3">
              {[
                {
                  title: 'Key takeaways',
                  icon: Target,
                  items: lesson.keyTakeaways,
                  color: 'var(--c-primary)',
                  bg: 'var(--c-primary-soft)',
                },
                {
                  title: 'Common pitfalls',
                  icon: AlertTriangle,
                  items: lesson.pitfalls,
                  color: 'var(--c-danger)',
                  bg: 'var(--c-danger-soft)',
                },
                {
                  title: 'Key focus',
                  icon: GraduationCap,
                  items: lesson.examTips,
                  color: 'var(--c-accent)',
                  bg: 'var(--c-accent-soft)',
                },
              ].map((box) => {
                const Icon = box.icon;
                return (
                  <div key={box.title} className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: box.bg, color: box.color }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wide">{box.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {box.items.map((item) => (
                        <li key={item} className="flex gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: box.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>

            <section className="rounded-2xl border p-5" style={{ borderColor: 'var(--c-border-strong)', backgroundColor: 'var(--c-surface)' }}>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" style={{ color: 'var(--c-primary)' }} />
                  <h2 className="text-sm font-bold">Quick check</h2>
                </div>
                <span className="font-mono text-[10px]" style={{ color: 'var(--c-muted)' }}>
                  {answeredCount} / {lesson.quiz.length} answered
                </span>
              </div>

              <div className="space-y-5">
                {lesson.quiz.map((item, questionIndex) => {
                  const selected = answers[questionIndex];
                  const answered = selected !== undefined;
                  const correct = selected === item.answer;
                  return (
                    <div key={item.question} className="rounded-xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface-2)' }}>
                      <p className="mb-3 text-sm font-semibold">
                        {questionIndex + 1}. {item.question}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {item.options.map((option, optionIndex) => {
                          const isSelected = selected === optionIndex;
                          const isCorrect = answered && optionIndex === item.answer;
                          const isWrong = answered && isSelected && !correct;
                          return (
                            <button
                              key={option}
                              type="button"
                              disabled={answered}
                              onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                              className="rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors disabled:cursor-default"
                              style={{
                                borderColor: isCorrect ? 'var(--c-ok)' : isWrong ? 'var(--c-danger)' : isSelected ? 'var(--c-primary)' : 'var(--c-border)',
                                backgroundColor: isCorrect ? 'var(--c-ok-soft)' : isWrong ? 'var(--c-danger-soft)' : isSelected ? 'var(--c-primary-soft)' : 'var(--c-surface)',
                                color: isCorrect ? 'var(--c-ok)' : isWrong ? 'var(--c-danger)' : 'var(--c-text)',
                              }}
                            >
                              <span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + optionIndex)}.</span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-[11px] leading-relaxed" style={{ borderColor: correct ? 'var(--c-ok)' : 'var(--c-danger)', backgroundColor: correct ? 'var(--c-ok-soft)' : 'var(--c-danger-soft)', color: correct ? 'var(--c-ok)' : 'var(--c-danger)' }}>
                          {correct ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                          <span>{item.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: 'var(--c-border)' }}>
              {previous ? (
                <Link
                  href={`${basePath}/learn/${previous.id}`}
                  className="group flex max-w-[48%] flex-col items-start rounded-lg border p-3 text-left"
                  style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                    ← Previous
                  </span>
                  <span className="mt-0.5 text-xs font-bold group-hover:text-[var(--c-primary)]">{previous.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`${basePath}/learn/${next.id}`}
                  className="group flex max-w-[48%] flex-col items-end rounded-lg border p-3 text-right"
                  style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--c-muted)' }}>
                    Next →
                  </span>
                  <span className="mt-0.5 text-xs font-bold group-hover:text-[var(--c-primary)]">{next.title}</span>
                </Link>
              ) : (
                <Link
                  href={`${basePath}/problems`}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold"
                  style={{ borderColor: 'var(--c-primary)', color: 'var(--c-primary)', backgroundColor: 'var(--c-primary-soft)' }}
                >
                  Go to problems <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-muted)' }}>
              Concepts covered
            </h2>
            <ul className="space-y-2">
              {chapter.concepts.map((concept) => (
                <li key={concept} className="flex gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: 'var(--c-primary)' }} />
                  {concept}
                </li>
              ))}
            </ul>
          </div>

          {chapter.prerequisites.length > 0 && (
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
              <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-muted)' }}>
                Read first
              </h2>
              <div className="space-y-1.5">
                {chapter.prerequisites.map((id) => {
                  const prerequisite = getCChapter(id);
                  if (!prerequisite) return null;
                  return (
                    <Link key={id} href={`${basePath}/learn/${id}`} className="block rounded-lg border px-2.5 py-2 text-[11px] font-semibold hover:border-[var(--c-primary)]" style={{ borderColor: 'var(--c-border)' }}>
                      {prerequisite.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--c-muted)' }}>
              Workbench
            </h2>
            <p className="mb-3 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              See the memory model behind this chapter.
            </p>
            <Link href={`${basePath}/lab`} className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--c-primary)' }}>
              Open the lab <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
