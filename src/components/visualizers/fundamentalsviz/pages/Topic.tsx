'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Minus } from 'lucide-react';
import { getAdjacentITChapters, getITChapter } from '../data/curriculum';
import { getITLesson } from '../data/lessons';
import { IT_PROBLEM_COUNTS_BY_CHAPTER } from '../data/mcq/counts';
import { useITProgress } from '../lib/progress';
import { useITBasePath } from '../components/ITShell';
import { CodeBlock } from '../components/CodeBlock';
import { Walkthrough } from '../components/Walkthrough';

export function Topic({ chapterId }: { chapterId: string }) {
  const basePath = useITBasePath();
  const router = useRouter();
  const chapter = getITChapter(chapterId);
  const lesson = getITLesson(chapterId);
  const { previous, next } = getAdjacentITChapters(chapterId);
  const { progress, markChapterComplete } = useITProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const practiceCount = IT_PROBLEM_COUNTS_BY_CHAPTER[chapterId] ?? 0;

  if (!chapter || !lesson) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="it-kicker" style={{ color: 'var(--it-danger)' }}>Chapter not found</p>
        <Link href={`${basePath}/learn`} className="it-link text-sm font-semibold">Back to the tracks</Link>
      </div>
    );
  }

  const isDone = progress.completedChapters.includes(chapter.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="it-frame mx-auto w-full max-w-[1240px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex items-center gap-3">
          <Link href={`${basePath}/learn`} className="it-label inline-flex items-center gap-1.5 text-[9px]" style={{ color: 'var(--it-muted)' }}>
            <ArrowLeft className="h-3 w-3" /> Tracks
          </Link>
          <span className="it-mono text-[9px]" style={{ color: 'var(--it-border-strong)' }}>/</span>
          <span className="it-mono text-[9px]" style={{ color: 'var(--it-primary)' }}>CH {String(chapter.number).padStart(2, '0')}</span>
          <span className="it-mono hidden text-[9px] sm:inline" style={{ color: 'var(--it-muted)' }}>{chapter.track}</span>
        </div>
        <button
          type="button"
          onClick={() => markChapterComplete(chapter.id)}
          className="it-label inline-flex min-h-9 items-center gap-1.5 border px-2.5 text-[9px]"
          style={{
            borderColor: isDone ? 'var(--it-ok)' : 'var(--it-border)',
            color: isDone ? 'var(--it-ok)' : 'var(--it-muted)',
            backgroundColor: isDone ? 'var(--it-ok-soft)' : 'transparent',
          }}
        >
          {isDone ? <Check className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
          {isDone ? 'Read' : 'Mark as read'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px]">
        <article className="min-w-0 px-5 py-8 sm:px-8 sm:py-12 lg:pr-10">
          <header className="border-b pb-8" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="it-kicker" style={{ color: 'var(--it-primary)' }}>{chapter.track}</span>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-border-strong)' }}>/</span>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{chapter.difficulty} · {chapter.estimatedMinutes} min</span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-[86px_1fr] sm:items-start">
              <span className="it-num hidden text-[5.2rem] leading-none sm:block" style={{ color: 'var(--it-primary)' }}>{String(chapter.number).padStart(2, '0')}</span>
              <div>
                <h1 className="it-display text-[clamp(2.4rem,5.5vw,4.4rem)]">{chapter.title}</h1>
                <p className="mt-4 max-w-[720px] text-[15px] leading-[1.8]" style={{ color: 'var(--it-muted)' }}>{lesson.hook}</p>
              </div>
            </div>
          </header>

          <section className="border-b py-7" style={{ borderColor: 'var(--it-border)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>In plain English</p>
            <p className="mt-2 max-w-[720px] text-xl font-semibold leading-snug sm:text-2xl">{lesson.plainEnglish}</p>
          </section>

          <section className="border-b py-8" style={{ borderColor: 'var(--it-border)' }}>
            <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
              <p className="it-kicker pt-1" style={{ color: 'var(--it-muted)' }}>The one idea</p>
              <div>
                <p className="max-w-[720px] text-[clamp(1.35rem,2.6vw,1.9rem)] font-bold leading-[1.35]">{lesson.oneIdea}</p>
                <p className="mt-4 max-w-[680px] text-sm leading-[1.85]" style={{ color: 'var(--it-muted)' }}>{lesson.whyItMatters}</p>
              </div>
            </div>
          </section>

          <section className="border-b py-8" style={{ borderColor: 'var(--it-border)' }}>
            <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
              <p className="it-kicker pt-1" style={{ color: 'var(--it-muted)' }}>By the end</p>
              <ol className="space-y-2.5">
                {lesson.objectives.map((objective, index) => (
                  <li key={objective} className="grid grid-cols-[24px_1fr] gap-2 text-sm leading-relaxed">
                    <span className="it-mono text-[9px]" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                    <span style={{ color: 'var(--it-muted)' }}>{objective}</span>
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
                    <span className="it-mono text-[10px] font-bold" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                    <span className="mt-2 h-px w-5" style={{ backgroundColor: 'var(--it-border-strong)' }} />
                  </div>
                  <div>
                    <h2 className="it-display-sm text-[1.7rem] leading-tight sm:text-[2rem]">{section.title}</h2>
                    <p className="mt-3 max-w-[720px] text-[15px] leading-[1.85]" style={{ color: 'var(--it-muted)' }}>{section.body}</p>
                    {section.code && <div className="mt-5"><CodeBlock code={section.code} caption={`chapter-${String(chapter.number).padStart(2, '0')}`} /></div>}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section id="worked-example" className="scroll-mt-24 border-y" style={{ borderColor: 'var(--it-border-strong)' }}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
              <span className="it-kicker text-[8px]" style={{ color: 'var(--it-primary)' }}>Worked example</span>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{lesson.example.steps.length} steps</span>
            </div>
            <div className="px-4 py-5 sm:px-5">
              <h2 className="it-display-sm text-2xl sm:text-3xl">{lesson.example.title}</h2>
              <p className="mt-2 max-w-[680px] text-sm leading-relaxed" style={{ color: 'var(--it-muted)' }}>{lesson.example.scenario}</p>
              <div className="mt-5 border-t" style={{ borderColor: 'var(--it-border)' }}>
                {lesson.example.steps.map((step, index) => (
                  <div key={step.action} className="grid gap-2 border-b py-4 sm:grid-cols-[36px_minmax(0,1fr)_28px_minmax(0,1fr)] sm:items-start" style={{ borderColor: 'var(--it-border)' }}>
                    <span className="it-num text-xl" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-[13px] leading-relaxed">{step.action}</p>
                    <ArrowRight className="hidden h-3.5 w-3.5 sm:mt-1 sm:block" style={{ color: 'var(--it-border-strong)' }} />
                    <p className="text-[13px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{step.result}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 max-w-[720px] text-sm leading-relaxed"><span className="it-kicker mr-2 text-[8px]" style={{ color: 'var(--it-primary)' }}>Conclusion</span>{lesson.example.conclusion}</p>
            </div>
          </section>

          {lesson.walkthrough && (
            <section className="pt-10">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Instrument</p>
                  <h2 className="it-display-sm mt-1 text-3xl">Watch it happen.</h2>
                </div>
                <p className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>Step through one operation at a time</p>
              </div>
              <Walkthrough kind={lesson.walkthrough} />
            </section>
          )}

          <section id="tradeoff" className="scroll-mt-24 border-y py-8" style={{ borderColor: 'var(--it-border)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>The trade-off</p>
            <h2 className="it-display-sm mt-2 text-3xl">No free lunch.</h2>
            <div className="mt-5 grid border sm:grid-cols-3" style={{ borderColor: 'var(--it-border-strong)' }}>
              {[
                { label: 'Gain', text: lesson.tradeoff.gain, color: 'var(--it-ok)' },
                { label: 'Cost', text: lesson.tradeoff.cost, color: 'var(--it-danger)' },
                { label: 'Verdict', text: lesson.tradeoff.verdict, color: 'var(--it-primary)' },
              ].map((item, index) => (
                <div key={item.label} className={`px-4 py-4 ${index < 2 ? 'border-b sm:border-b-0 sm:border-r' : ''}`} style={{ borderColor: 'var(--it-border)' }}>
                  <p className="it-kicker text-[8px]" style={{ color: item.color }}>{item.label}</p>
                  <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="recap" className="scroll-mt-24 border-b py-8" style={{ borderColor: 'var(--it-border)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Recap</p>
            <h2 className="it-display-sm mt-2 text-3xl">What to keep.</h2>
            <div className="mt-5 grid border md:grid-cols-3" style={{ borderColor: 'var(--it-border)' }}>
              {[
                { title: 'Takeaways', items: lesson.keyTakeaways, marker: '+' },
                { title: 'Traps', items: lesson.pitfalls, marker: '!' },
                { title: 'Focus', items: lesson.focusPoints, marker: '→' },
              ].map((box, index) => (
                <div key={box.title} className={`px-4 py-4 ${index < 2 ? 'border-b md:border-b-0 md:border-r' : ''}`} style={{ borderColor: 'var(--it-border)' }}>
                  <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>{box.title}</p>
                  <ul className="mt-3 space-y-2.5">
                    {box.items.map((item) => (
                      <li key={item} className="grid grid-cols-[14px_1fr] gap-2 text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
                        <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{box.marker}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="check" className="scroll-mt-24 py-8">
            <div className="flex flex-wrap items-end justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--it-border)' }}>
              <div>
                <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Check yourself</p>
                <h2 className="it-display-sm mt-1 text-3xl">Before you move on.</h2>
              </div>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-muted)' }}>{answeredCount} / {lesson.quiz.length} answered</span>
            </div>

            <div className="divide-y" style={{ borderColor: 'var(--it-border)' }}>
              {lesson.quiz.map((item, questionIndex) => {
                const selected = answers[questionIndex];
                const answered = selected !== undefined;
                const correct = selected === item.answer;
                return (
                  <div key={item.question} className="py-5" style={{ borderColor: 'var(--it-border)' }}>
                    <div className="flex gap-3">
                      <span className="it-num text-xl" style={{ color: 'var(--it-primary)' }}>{String(questionIndex + 1).padStart(2, '0')}</span>
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
                              borderColor: isCorrect ? 'var(--it-ok)' : isWrong ? 'var(--it-danger)' : 'var(--it-border)',
                              backgroundColor: isCorrect ? 'var(--it-ok-soft)' : isWrong ? 'var(--it-danger-soft)' : isSelected ? 'var(--it-primary-soft)' : 'transparent',
                              color: isCorrect ? 'var(--it-ok)' : isWrong ? 'var(--it-danger)' : 'var(--it-text)',
                            }}
                          >
                            <span className="it-mono mt-0.5 text-[9px] font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                            <span className="font-medium">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                    {answered && (
                      <div className="mt-3 flex items-start gap-2 border-l-2 pl-3 text-[12px] leading-relaxed sm:ml-11" style={{ borderColor: correct ? 'var(--it-ok)' : 'var(--it-danger)', color: 'var(--it-muted)' }}>
                        {correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--it-ok)' }} /> : <Minus className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--it-danger)' }} />}
                        <span>{item.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="border-t pt-6" style={{ borderColor: 'var(--it-border)' }}>
            <div className="grid gap-3 sm:grid-cols-2">
              {previous ? (
                <Link href={`${basePath}/learn/${previous.id}`} className="group border p-4" style={{ borderColor: 'var(--it-border)' }}>
                  <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>← Previous</span>
                  <span className="mt-2 block text-sm font-semibold group-hover:text-[var(--it-primary)]">{previous.title}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`${basePath}/learn/${next.id}`} className="group border p-4 sm:text-right" style={{ borderColor: 'var(--it-border)' }}>
                  <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Next →</span>
                  <span className="mt-2 block text-sm font-semibold group-hover:text-[var(--it-primary)]">{next.title}</span>
                </Link>
              ) : (
                <Link href={`${basePath}/problems`} className="group border p-4 sm:text-right" style={{ borderColor: 'var(--it-primary)' }}>
                  <span className="it-kicker text-[8px]" style={{ color: 'var(--it-primary)' }}>Finish →</span>
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
              className="it-btn it-btn-accent mt-4 w-full sm:w-auto"
            >
              {next ? 'Complete and continue' : 'Complete the atlas'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </article>

        <aside className="border-t px-5 py-8 sm:px-8 lg:border-l lg:border-t-0 lg:px-6" style={{ borderColor: 'var(--it-border)' }}>
          <div className="lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between">
              <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Position</span>
              <span className="it-mono text-[9px]" style={{ color: 'var(--it-primary)' }}>{chapter.number} / 24</span>
            </div>
            <div className="it-progress-track mt-2">
              <div className="it-progress-fill" style={{ width: `${(chapter.number / 24) * 100}%` }} />
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
              <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>On this page</p>
              <nav className="mt-3 space-y-2" aria-label="Lesson sections">
                {lesson.sections.map((section, index) => (
                  <a key={section.title} href={`#section-${index + 1}`} className="block text-[11px] leading-snug hover:text-[var(--it-primary)]" style={{ color: 'var(--it-muted)' }}>{String(index + 1).padStart(2, '0')} · {section.title}</a>
                ))}
                <a href="#worked-example" className="block text-[11px] hover:text-[var(--it-primary)]" style={{ color: 'var(--it-muted)' }}>→ Worked example</a>
                <a href="#tradeoff" className="block text-[11px] hover:text-[var(--it-primary)]" style={{ color: 'var(--it-muted)' }}>→ Trade-off</a>
                <a href="#recap" className="block text-[11px] hover:text-[var(--it-primary)]" style={{ color: 'var(--it-muted)' }}>→ Recap</a>
                <a href="#check" className="block text-[11px] hover:text-[var(--it-primary)]" style={{ color: 'var(--it-muted)' }}>→ Check yourself</a>
              </nav>
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
              <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Key terms</p>
              <dl className="mt-3 space-y-3">
                {lesson.terms.map((term) => (
                  <div key={term.term}>
                    <dt className="it-mono text-[10px] font-bold">{term.term}</dt>
                    <dd className="mt-1 text-[10px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{term.definition}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {chapter.prerequisites.length > 0 && (
              <div className="mt-6 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
                <p className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>Read first</p>
                <div className="mt-3 space-y-2">
                  {chapter.prerequisites.map((id) => {
                    const prerequisite = getITChapter(id);
                    if (!prerequisite) return null;
                    return <Link key={id} href={`${basePath}/learn/${id}`} className="block text-[11px] font-medium leading-snug hover:text-[var(--it-primary)]">{prerequisite.title}</Link>;
                  })}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2 border-t pt-4" style={{ borderColor: 'var(--it-border)' }}>
              {practiceCount > 0 && (
                <Link href={`${basePath}/problems?chapter=${chapter.id}`} className="flex items-center justify-between text-[11px] font-semibold">
                  <span>Practice this chapter · {practiceCount} questions</span>
                  <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--it-primary)' }} />
                </Link>
              )}
              <Link href={`${basePath}/lab${chapter.visualizerKey ? `?lab=${chapter.visualizerKey}` : ''}`} className="flex items-center justify-between text-[11px] font-semibold">
                <span>Open the instruments</span>
                <ArrowRight className="h-3.5 w-3.5" style={{ color: 'var(--it-primary)' }} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
