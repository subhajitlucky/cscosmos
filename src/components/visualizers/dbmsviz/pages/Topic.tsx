'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Minus } from 'lucide-react';
import { getAdjacentDBMSChapters, getDBMSChapter } from '../data/curriculum';
import { dbmsLessons } from '../data/lessons';
import { getDBMSDeepDive } from '../data/deep-dives';
import { dbmsProblems } from '../data/problems';
import { useDBMSProgress } from '../lib/progress';
import { useDBMSBasePath } from '../components/DBMSShell';
import { CodeBlock } from '../components/CodeBlock';
import { Walkthrough } from '../components/walkthroughs/Walkthrough';

export function Topic({ chapterId }: { chapterId: string }) {
  const basePath = useDBMSBasePath();
  const router = useRouter();
  const chapter = getDBMSChapter(chapterId);
  const lesson = dbmsLessons[chapterId];
  const deepDive = getDBMSDeepDive(chapterId);
  const { previous, next } = getAdjacentDBMSChapters(chapterId);
  const { progress, markChapterComplete } = useDBMSProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const practice = dbmsProblems.find((problem) => problem.chapterId === chapterId);

  if (!chapter || !lesson || !deepDive) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="db-kicker" style={{ color: 'var(--db-danger)' }}>Chapter not found</p>
        <Link href={`${basePath}/learn`} className="db-link text-sm font-semibold">
          Back to the contents
        </Link>
      </div>
    );
  }

  const isDone = progress.completedChapters.includes(chapter.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="dbmsviz-frame mx-auto w-full max-w-[1240px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--db-border)' }}>
        <div className="flex items-center gap-3">
          <Link
            href={`${basePath}/learn`}
            className="db-label inline-flex items-center gap-1.5 text-[9px]"
            style={{ color: 'var(--db-muted)' }}
          >
            <ArrowLeft className="h-3 w-3" /> Contents
          </Link>
          <span className="db-mono text-[9px]" style={{ color: 'var(--db-border-strong)' }}>/</span>
          <span className="db-mono text-[9px]" style={{ color: 'var(--db-primary)' }}>
            CH {String(chapter.number).padStart(2, '0')}
          </span>
          <span className="db-mono hidden text-[9px] sm:inline" style={{ color: 'var(--db-muted)' }}>
            {chapter.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => markChapterComplete(chapter.id)}
          className="db-label inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-[9px]"
          style={{
            borderColor: isDone ? 'var(--db-ok)' : 'var(--db-border)',
            color: isDone ? 'var(--db-ok)' : 'var(--db-muted)',
            backgroundColor: isDone ? 'var(--db-ok-soft)' : 'transparent',
          }}
        >
          {isDone ? <Check className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
          {isDone ? 'Read' : 'Mark as read'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 px-5 py-8 sm:px-8 sm:py-12 lg:pr-10">
          <header className="border-b pb-8" style={{ borderColor: 'var(--db-border)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="db-kicker" style={{ color: 'var(--db-primary)' }}>
                {chapter.category}
              </span>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-border-strong)' }}>/</span>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                {chapter.difficulty} · {chapter.estimatedMinutes} min
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[92px_1fr] sm:items-start">
              <span className="db-num hidden text-[5.5rem] leading-none sm:block" style={{ color: 'var(--db-primary)' }}>
                {String(chapter.number).padStart(2, '0')}
              </span>
              <div>
                <h1 className="db-display text-[clamp(2.6rem,6vw,4.8rem)]">{chapter.title}</h1>
                <p className="mt-4 max-w-[720px] text-[15px] leading-[1.8]" style={{ color: 'var(--db-muted)' }}>
                  {lesson.hook}
                </p>
              </div>
            </div>
          </header>

          <section className="border-b py-7" style={{ borderColor: 'var(--db-border)' }}>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>In plain English</p>
            <p className="db-serif mt-2 max-w-[720px] text-2xl leading-snug">{lesson.plainEnglish}</p>
          </section>

          <section className="border-b py-8" style={{ borderColor: 'var(--db-border)' }}>
            <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
              <p className="db-kicker pt-1" style={{ color: 'var(--db-muted)' }}>The one idea</p>
              <div>
                <p className="db-serif text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.35]">{deepDive.oneIdea}</p>
                <p className="mt-4 max-w-[680px] text-sm leading-[1.85]" style={{ color: 'var(--db-muted)' }}>
                  {deepDive.whyItMatters}
                </p>
              </div>
            </div>
          </section>

          <section className="border-b py-8" style={{ borderColor: 'var(--db-border)' }}>
            <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
              <p className="db-kicker pt-1" style={{ color: 'var(--db-muted)' }}>By the end</p>
              <ol className="space-y-2.5">
                {lesson.objectives.map((objective, index) => (
                  <li key={objective} className="grid grid-cols-[24px_1fr] gap-2 text-sm leading-relaxed">
                    <span className="db-mono text-[9px]" style={{ color: 'var(--db-primary)' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'var(--db-muted)' }}>{objective}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <div className="space-y-10 py-9">
            {lesson.sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-24">
                <div className="grid gap-4 sm:grid-cols-[54px_1fr]">
                  <div className="flex items-start gap-2">
                    <span className="db-mono text-[10px] font-bold" style={{ color: 'var(--db-primary)' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-2 h-px w-5" style={{ backgroundColor: 'var(--db-border-strong)' }} />
                  </div>
                  <div>
                    <h2 className="db-display-tight text-[1.8rem] leading-tight sm:text-[2.1rem]">{section.title}</h2>
                    <p className="mt-3 max-w-[720px] text-[15px] leading-[1.85]" style={{ color: 'var(--db-muted)' }}>
                      {section.body}
                    </p>
                    {section.code && (
                      <div className="mt-5">
                        <CodeBlock code={section.code} caption={`chapter-${String(chapter.number).padStart(2, '0')}.db`} />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section id="worked-example" className="scroll-mt-24 border-y" style={{ borderColor: 'var(--db-border-strong)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5" style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-surface)' }}>
              <span className="db-kicker" style={{ color: 'var(--db-primary)' }}>Worked example</span>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                {deepDive.example.steps.length} steps
              </span>
            </div>
            <div className="px-4 py-5 sm:px-5">
              <h2 className="db-display-tight text-2xl sm:text-3xl">{deepDive.example.title}</h2>
              <p className="mt-2 max-w-[680px] text-sm leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                {deepDive.example.scenario}
              </p>

              <div className="mt-5 border-t" style={{ borderColor: 'var(--db-border)' }}>
                {deepDive.example.steps.map((step, index) => (
                  <div
                    key={step.action}
                    className="grid gap-2 border-b py-4 sm:grid-cols-[36px_minmax(0,1fr)_28px_minmax(0,1fr)] sm:items-start"
                    style={{ borderColor: 'var(--db-border)' }}
                  >
                    <span className="db-num text-xl" style={{ color: 'var(--db-primary)' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[13px] leading-relaxed">{step.action}</p>
                    <ArrowRight className="hidden h-3.5 w-3.5 sm:mt-1 sm:block" style={{ color: 'var(--db-border-strong)' }} />
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{step.result}</p>
                  </div>
                ))}
              </div>

              <p className="mt-4 max-w-[720px] text-sm leading-relaxed">
                <span className="db-kicker mr-2 text-[8px]" style={{ color: 'var(--db-primary)' }}>Conclusion</span>
                {deepDive.example.conclusion}
              </p>
            </div>
          </section>

          {lesson.walkthrough && (
            <section className="pt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Instrument</p>
                  <h2 className="db-display-tight mt-1 text-3xl">Watch it happen.</h2>
                </div>
                <p className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                  Step through one operation at a time
                </p>
              </div>
              <Walkthrough config={lesson.walkthrough} />
            </section>
          )}

          <section id="tradeoff" className="scroll-mt-24 border-y py-8" style={{ borderColor: 'var(--db-border)' }}>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>The trade-off</p>
            <h2 className="db-display-tight mt-2 text-3xl">No free correctness.</h2>
            <div className="mt-5 grid border sm:grid-cols-3" style={{ borderColor: 'var(--db-border-strong)' }}>
              {[
                { label: 'Gain', text: deepDive.tradeoff.gain, color: 'var(--db-ok)' },
                { label: 'Cost', text: deepDive.tradeoff.cost, color: 'var(--db-danger)' },
                { label: 'Verdict', text: deepDive.tradeoff.verdict, color: 'var(--db-primary)' },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`px-4 py-4 ${index < 2 ? 'border-b sm:border-b-0 sm:border-r' : ''}`}
                  style={{ borderColor: 'var(--db-border)' }}
                >
                  <p className="db-kicker text-[8px]" style={{ color: item.color }}>{item.label}</p>
                  <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="recap" className="scroll-mt-24 border-b py-8" style={{ borderColor: 'var(--db-border)' }}>
            <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Recap</p>
            <h2 className="db-display-tight mt-2 text-3xl">What to keep.</h2>
            <div className="mt-5 grid border md:grid-cols-3" style={{ borderColor: 'var(--db-border)' }}>
              {[
                { title: 'Takeaways', items: lesson.keyTakeaways, marker: '+' },
                { title: 'Traps', items: lesson.pitfalls, marker: '!' },
                { title: 'Focus', items: lesson.focusPoints, marker: '→' },
              ].map((box, index) => (
                <div
                  key={box.title}
                  className={`px-4 py-4 ${index < 2 ? 'border-b md:border-b-0 md:border-r' : ''}`}
                  style={{ borderColor: 'var(--db-border)' }}
                >
                  <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>{box.title}</p>
                  <ul className="mt-3 space-y-2.5">
                    {box.items.map((item) => (
                      <li key={item} className="grid grid-cols-[14px_1fr] gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>
                        <span className="db-mono text-[10px]" style={{ color: 'var(--db-primary)' }}>{box.marker}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="check" className="scroll-mt-24 py-8">
            <div className="flex flex-wrap items-end justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--db-border)' }}>
              <div>
                <p className="db-kicker" style={{ color: 'var(--db-primary)' }}>Check yourself</p>
                <h2 className="db-display-tight mt-1 text-3xl">Before you turn the page.</h2>
              </div>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-muted)' }}>
                {answeredCount} / {lesson.quiz.length} answered
              </span>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--db-border)' }}>
              {lesson.quiz.map((item, questionIndex) => {
                const selected = answers[questionIndex];
                const answered = selected !== undefined;
                const correct = selected === item.answer;
                return (
                  <div key={item.question} className="py-5" style={{ borderColor: 'var(--db-border)' }}>
                    <div className="flex gap-3">
                      <span className="db-num text-xl" style={{ color: 'var(--db-primary)' }}>
                        {String(questionIndex + 1).padStart(2, '0')}
                      </span>
                      <p className="pt-1 text-sm font-semibold leading-relaxed">{item.question}</p>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:pl-11">
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
                            className="flex min-h-11 items-start gap-2.5 border px-3 py-2.5 text-left text-[12px] disabled:cursor-default"
                            style={{
                              borderColor: isCorrect ? 'var(--db-ok)' : isWrong ? 'var(--db-danger)' : 'var(--db-border)',
                              backgroundColor: isCorrect ? 'var(--db-ok-soft)' : isWrong ? 'var(--db-danger-soft)' : isSelected ? 'var(--db-primary-soft)' : 'transparent',
                              color: isCorrect ? 'var(--db-ok)' : isWrong ? 'var(--db-danger)' : 'var(--db-text)',
                            }}
                          >
                            <span className="db-mono mt-0.5 text-[9px] font-bold">
                              {String.fromCharCode(65 + optionIndex)}
                            </span>
                            <span className="font-medium">{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <div className="mt-3 flex items-start gap-2 border-l-2 pl-3 text-[12px] leading-relaxed sm:ml-11" style={{ borderColor: correct ? 'var(--db-ok)' : 'var(--db-danger)', color: 'var(--db-muted)' }}>
                        {correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--db-ok)' }} /> : <Minus className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--db-danger)' }} />}
                        <span>{item.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="border-t pt-6" style={{ borderColor: 'var(--db-border)' }}>
            <div className="grid gap-3 sm:grid-cols-2">
              {previous ? (
                <Link href={`${basePath}/learn/${previous.id}`} className="group border p-4" style={{ borderColor: 'var(--db-border)' }}>
                  <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>← Previous</span>
                  <span className="mt-2 block text-sm font-semibold group-hover:text-[var(--db-primary)]">{previous.title}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`${basePath}/learn/${next.id}`} className="group border p-4 sm:text-right" style={{ borderColor: 'var(--db-border)' }}>
                  <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Next →</span>
                  <span className="mt-2 block text-sm font-semibold group-hover:text-[var(--db-primary)]">{next.title}</span>
                </Link>
              ) : (
                <Link href={`${basePath}/problems`} className="group border p-4 sm:text-right" style={{ borderColor: 'var(--db-primary)' }}>
                  <span className="db-kicker text-[8px]" style={{ color: 'var(--db-primary)' }}>Finish →</span>
                  <span className="mt-2 block text-sm font-semibold">Go to the drill book</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                markChapterComplete(chapter.id);
                router.push(next ? `${basePath}/learn/${next.id}` : `${basePath}/problems`);
              }}
              className="db-btn db-btn-accent mt-4 w-full sm:w-auto"
            >
              {next ? 'Complete and continue' : 'Complete the manual'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </article>

        <aside className="border-t px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-6" style={{ borderColor: 'var(--db-border)' }}>
          <div className="lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between">
              <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Position</span>
              <span className="db-mono text-[9px]" style={{ color: 'var(--db-primary)' }}>{chapter.number} / 32</span>
            </div>
            <div className="db-progress-track mt-2">
              <div className="db-progress-fill" style={{ width: `${(chapter.number / 32) * 100}%` }} />
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
              <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>On this page</p>
              <nav className="mt-3 space-y-2" aria-label="Lesson sections">
                {lesson.sections.map((section, index) => (
                  <a key={section.title} href={`#section-${index + 1}`} className="block text-[11px] leading-snug hover:text-[var(--db-primary)]" style={{ color: 'var(--db-muted)' }}>
                    {String(index + 1).padStart(2, '0')} · {section.title}
                  </a>
                ))}
                <a href="#worked-example" className="block text-[11px] hover:text-[var(--db-primary)]" style={{ color: 'var(--db-muted)' }}>
                  → Worked example
                </a>
                <a href="#tradeoff" className="block text-[11px] hover:text-[var(--db-primary)]" style={{ color: 'var(--db-muted)' }}>
                  → Trade-off
                </a>
                <a href="#recap" className="block text-[11px] hover:text-[var(--db-primary)]" style={{ color: 'var(--db-muted)' }}>
                  → Recap
                </a>
                <a href="#check" className="block text-[11px] hover:text-[var(--db-primary)]" style={{ color: 'var(--db-muted)' }}>
                  → Check yourself
                </a>
              </nav>
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
              <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Key terms</p>
              <dl className="mt-3 space-y-3">
                {deepDive.terms.map((term) => (
                  <div key={term.term}>
                    <dt className="db-mono text-[10px] font-bold">{term.term}</dt>
                    <dd className="mt-1 text-[10px] leading-relaxed" style={{ color: 'var(--db-muted)' }}>{term.definition}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {chapter.prerequisites.length > 0 && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
                <p className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>Read first</p>
                <div className="mt-3 space-y-2">
                  {chapter.prerequisites.map((id) => {
                    const prerequisite = getDBMSChapter(id);
                    if (!prerequisite) return null;
                    return (
                      <Link key={id} href={`${basePath}/learn/${id}`} className="block text-[11px] font-medium leading-snug hover:text-[var(--db-primary)]">
                        {prerequisite.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2 border-t pt-4" style={{ borderColor: 'var(--db-border)' }}>
              {practice && (
                <Link href={`${basePath}/problems/${practice.id}`} className="flex items-center justify-between text-[11px] font-semibold">
                  <span>Practice this chapter</span>
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
                </Link>
              )}
              <Link href={`${basePath}/lab${chapter.visualizerKey ? `?lab=${chapter.visualizerKey}` : ''}`} className="flex items-center justify-between text-[11px] font-semibold">
                <span>Open the workbench</span>
                <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--db-primary)' }} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
