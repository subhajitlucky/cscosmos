'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Lightbulb,
  ListChecks,
  Play,
  Target,
} from 'lucide-react';
import { getAdjacentOSChapters, getOSChapter } from '../data/curriculum';
import { osLessons } from '../data/lessons';
import { osProblems } from '../data/problems';
import { useOSProgress } from '../lib/progress';
import { useOSBasePath } from '../components/OSShell';
import { CodeBlock } from '../components/CodeBlock';
import { Walkthrough } from '../components/walkthroughs/Walkthrough';

export function Topic({ chapterId }: { chapterId: string }) {
  const basePath = useOSBasePath();
  const router = useRouter();
  const chapter = getOSChapter(chapterId);
  const lesson = osLessons[chapterId];
  const { previous, next } = getAdjacentOSChapters(chapterId);
  const { progress, markChapterComplete } = useOSProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const practice = osProblems.find((problem) => problem.chapterId === chapterId);

  if (!chapter || !lesson) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-mono text-sm font-bold" style={{ color: 'var(--os-danger)' }}>
          LESSON_NOT_FOUND
        </p>
        <p className="text-sm" style={{ color: 'var(--os-muted)' }}>
          The requested lesson does not exist in the operating systems curriculum.
        </p>
        <Link href={`${basePath}/learn`} className="osviz-link text-sm font-semibold">
          Back to the curriculum
        </Link>
      </div>
    );
  }

  const isDone = progress.completedChapters.includes(chapter.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--os-border)' }}>
        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/learn`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold"
            style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)', backgroundColor: 'var(--os-surface)' }}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Curriculum
          </Link>
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-primary)' }}>
            Lesson {String(chapter.number).padStart(2, '0')} · {chapter.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => markChapterComplete(chapter.id)}
          className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors"
          style={{
            borderColor: isDone ? 'var(--os-ok)' : 'var(--os-border)',
            color: isDone ? 'var(--os-ok)' : 'var(--os-text)',
            backgroundColor: isDone ? 'var(--os-ok-soft)' : 'var(--os-surface)',
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
              <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold" style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)', backgroundColor: 'var(--os-surface-2)' }}>
                {chapter.difficulty}
              </span>
              <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                ~{chapter.estimatedMinutes} min
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{chapter.title}</h1>
            <p className="max-w-3xl text-base leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              {lesson.hook}
            </p>
          </header>

          <div className="mb-4 rounded-2xl border p-4" style={{ borderColor: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}>
            <h2 className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-primary)' }}>In plain English</h2>
            <p className="text-sm leading-relaxed">{lesson.plainEnglish}</p>
          </div>

          <div className="mb-8 rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
              By the end you will be able to
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="flex gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: 'var(--os-primary)' }} />
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            {lesson.sections.map((section, index) => (
              <section key={section.title} className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg border font-mono text-[10px] font-bold"
                    style={{ borderColor: 'var(--os-border)', color: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-lg font-bold tracking-tight">{section.title}</h2>
                </div>
                <p className="osviz-prose text-sm leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                  {section.body}
                </p>
                {section.code && (
                  <CodeBlock code={section.code} caption={`lesson-${String(chapter.number).padStart(2, '0')}.os`} />
                )}
              </section>
            ))}

            {lesson.walkthrough && (
              <section className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-lg border"
                    style={{ borderColor: 'var(--os-border)', color: 'var(--os-accent)', backgroundColor: 'var(--os-accent-soft)' }}
                  >
                    <Play className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight">Watch it happen</h2>
                    <p className="text-[11px]" style={{ color: 'var(--os-muted)' }}>
                      Step through the worked example. Play it, pause it, or move one step at a time.
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
                  color: 'var(--os-primary)',
                  bg: 'var(--os-primary-soft)',
                },
                {
                  title: 'Common pitfalls',
                  icon: AlertTriangle,
                  items: lesson.pitfalls,
                  color: 'var(--os-danger)',
                  bg: 'var(--os-danger-soft)',
                },
                {
                  title: 'Kernel notes',
                  icon: Cpu,
                  items: lesson.focusPoints,
                  color: 'var(--os-accent)',
                  bg: 'var(--os-accent-soft)',
                },
              ].map((box) => {
                const Icon = box.icon;
                return (
                  <div key={box.title} className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: box.bg, color: box.color }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <h3 className="text-xs font-bold uppercase tracking-wide">{box.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {box.items.map((item) => (
                        <li key={item} className="flex gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: box.color }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </section>

            <section className="rounded-2xl border p-5" style={{ borderColor: 'var(--os-border-strong)', backgroundColor: 'var(--os-surface)' }}>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" style={{ color: 'var(--os-primary)' }} />
                  <h2 className="text-sm font-bold">Quick check</h2>
                </div>
                <span className="font-mono text-[10px]" style={{ color: 'var(--os-muted)' }}>
                  {answeredCount} / {lesson.quiz.length} answered
                </span>
              </div>

              <div className="space-y-5">
                {lesson.quiz.map((item, questionIndex) => {
                  const selected = answers[questionIndex];
                  const answered = selected !== undefined;
                  const correct = selected === item.answer;
                  return (
                    <div key={item.question} className="rounded-xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface-2)' }}>
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
                                borderColor: isCorrect ? 'var(--os-ok)' : isWrong ? 'var(--os-danger)' : isSelected ? 'var(--os-primary)' : 'var(--os-border)',
                                backgroundColor: isCorrect ? 'var(--os-ok-soft)' : isWrong ? 'var(--os-danger-soft)' : isSelected ? 'var(--os-primary-soft)' : 'var(--os-surface)',
                                color: isCorrect ? 'var(--os-ok)' : isWrong ? 'var(--os-danger)' : 'var(--os-text)',
                              }}
                            >
                              <span className="mr-2 font-mono text-[10px]">{String.fromCharCode(65 + optionIndex)}.</span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className="mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-[11px] leading-relaxed" style={{ borderColor: correct ? 'var(--os-ok)' : 'var(--os-danger)', backgroundColor: correct ? 'var(--os-ok-soft)' : 'var(--os-danger-soft)', color: correct ? 'var(--os-ok)' : 'var(--os-danger)' }}>
                          {correct ? <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" /> : <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                          <span>{item.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: 'var(--os-border)' }}>
              {previous ? (
                <Link
                  href={`${basePath}/learn/${previous.id}`}
                  className="group flex max-w-[48%] flex-col items-start rounded-lg border p-3 text-left"
                  style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                    ← Previous
                  </span>
                  <span className="mt-0.5 text-xs font-bold group-hover:text-[var(--os-primary)]">{previous.title}</span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`${basePath}/learn/${next.id}`}
                  className="group flex max-w-[48%] flex-col items-end rounded-lg border p-3 text-right"
                  style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}
                >
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--os-muted)' }}>
                    Next →
                  </span>
                  <span className="mt-0.5 text-xs font-bold group-hover:text-[var(--os-primary)]">{next.title}</span>
                </Link>
              ) : (
                <Link
                  href={`${basePath}/problems`}
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold"
                  style={{ borderColor: 'var(--os-primary)', color: 'var(--os-primary)', backgroundColor: 'var(--os-primary-soft)' }}
                >
                  Go to practice <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  markChapterComplete(chapter.id);
                  router.push(next ? `${basePath}/learn/${next.id}` : `${basePath}/problems`);
                }}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: 'var(--os-primary)' }}
              >
                {next ? 'Complete & continue' : 'Complete lesson'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
              Concepts covered
            </h2>
            <ul className="space-y-2">
              {chapter.concepts.map((concept) => (
                <li key={concept} className="flex gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: 'var(--os-primary)' }} />
                  {concept}
                </li>
              ))}
            </ul>
          </div>

          {chapter.prerequisites.length > 0 && (
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
              <h2 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
                Read first
              </h2>
              <div className="space-y-1.5">
                {chapter.prerequisites.map((id) => {
                  const prerequisite = getOSChapter(id);
                  if (!prerequisite) return null;
                  return (
                    <Link key={id} href={`${basePath}/learn/${id}`} className="block rounded-lg border px-2.5 py-2 text-[11px] font-semibold hover:border-[var(--os-primary)]" style={{ borderColor: 'var(--os-border)' }}>
                      {prerequisite.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {practice && (
            <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
              <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
                Practice this lesson
              </h2>
              <p className="mb-3 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
                Try the matching drill while the lesson is fresh.
              </p>
              <Link
                href={`${basePath}/problems/${practice.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold"
                style={{ color: 'var(--os-primary)' }}
              >
                Open the drill <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          <div className="rounded-2xl border p-4" style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}>
            <h2 className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--os-muted)' }}>
              Workbench
            </h2>
            <p className="mb-3 text-[11px] leading-relaxed" style={{ color: 'var(--os-muted)' }}>
              See the scheduler, page table, or file chain behind this lesson.
            </p>
            <Link
              href={`${basePath}/lab${chapter.visualizerKey ? `?lab=${chapter.visualizerKey}` : ''}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold"
              style={{ color: 'var(--os-primary)' }}
            >
              Open the lab <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
