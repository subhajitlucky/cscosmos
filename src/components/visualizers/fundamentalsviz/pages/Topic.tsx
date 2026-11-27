'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, Minus } from 'lucide-react';
import { getAdjacentITChapters, getITChapter, itChapters } from '../data/curriculum';
import { getITLesson } from '../data/lessons';
import { IT_PROBLEM_COUNTS_BY_CHAPTER } from '../data/mcq/counts';
import { useITProgress } from '../lib/progress';
import { useITBasePath } from '../components/ITShell';
import { CodeBlock } from '../components/CodeBlock';

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
        <p className="it-kicker" style={{ color: 'var(--it-danger)' }}>Topic not found</p>
        <Link href={`${basePath}/learn`} className="it-link text-sm font-semibold">Back to study notes</Link>
      </div>
    );
  }

  const completed = progress.completedChapters.length;
  const isDone = progress.completedChapters.includes(chapter.id);
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="it-frame mx-auto w-full max-w-[1180px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex items-center gap-3">
          <Link href={`${basePath}/learn`} className="it-label inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--it-muted)' }}>
            <ArrowLeft className="h-3.5 w-3.5" /> Study notes
          </Link>
          <span className="it-mono text-[11px]" style={{ color: 'var(--it-border-strong)' }}>/</span>
          <span className="it-label text-[11px]" style={{ color: 'var(--it-muted)' }}>{chapter.number} of {itChapters.length}</span>
        </div>
        <button
          type="button"
          onClick={() => markChapterComplete(chapter.id)}
          className="it-label inline-flex min-h-9 items-center gap-1.5 border px-3 text-[11px]"
          style={{
            borderColor: isDone ? 'var(--it-ok)' : 'var(--it-border)',
            color: isDone ? 'var(--it-ok)' : 'var(--it-muted)',
            backgroundColor: isDone ? 'var(--it-ok-soft)' : 'transparent',
          }}
        >
          {isDone ? <Check className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          {isDone ? 'Completed' : 'Mark complete'}
        </button>
      </div>

      <div className="grid lg:grid-cols-[246px_minmax(0,1fr)]">
        <aside className="hidden border-r px-5 py-7 lg:block" style={{ borderColor: 'var(--it-border)' }}>
          <div className="sticky top-24">
            <Link href={basePath} className="it-heading text-[15px]">IT Fundamentals</Link>
            <p className="it-label mt-1 text-[10px]" style={{ color: 'var(--it-muted)' }}>Study notes</p>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Progress</span>
              <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{completed} / {itChapters.length}</span>
            </div>
            <div className="it-progress-track mt-2">
              <div className="it-progress-fill" style={{ width: `${(completed / itChapters.length) * 100}%` }} />
            </div>

            <nav className="mt-5 space-y-0" aria-label="All topics">
              {itChapters.map((item) => {
                const active = item.id === chapter.id;
                const done = progress.completedChapters.includes(item.id);
                return (
                  <Link
                    key={item.id}
                    href={`${basePath}/learn/${item.id}`}
                    className="flex gap-2 border-b py-2.5 text-[12px] leading-snug"
                    style={{ borderColor: 'var(--it-border)', color: active ? 'var(--it-primary)' : 'var(--it-muted)' }}
                  >
                    <span className="it-mono w-4 shrink-0 text-[10px]">{String(item.number).padStart(2, '0')}</span>
                    <span className="flex-1 font-medium">{item.title}</span>
                    {done && <Check className="mt-0.5 h-3 w-3 shrink-0" style={{ color: 'var(--it-ok)' }} />}
                  </Link>
                );
              })}
            </nav>

            <Link href={`${basePath}/problems`} className="it-btn mt-5 w-full text-[10px]">Practise module</Link>
            <Link href={`${basePath}/lab`} className="it-label mt-3 inline-flex text-[10px]" style={{ color: 'var(--it-muted)' }}>Open the tools</Link>
          </div>
        </aside>

        <article className="min-w-0 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="mb-6 border p-4 lg:hidden" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface)' }}>
            <div className="flex items-center justify-between">
              <span className="it-label text-[11px]" style={{ color: 'var(--it-muted)' }}>Progress</span>
              <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{completed} / {itChapters.length}</span>
            </div>
            <div className="it-progress-track mt-2"><div className="it-progress-fill" style={{ width: `${(completed / itChapters.length) * 100}%` }} /></div>
            <details className="mt-3">
              <summary className="it-label cursor-pointer text-[11px]">All 7 topics</summary>
              <div className="mt-2 space-y-1.5">
                {itChapters.map((item) => (
                  <Link key={item.id} href={`${basePath}/learn/${item.id}`} className="block text-[12px] leading-snug" style={{ color: item.id === chapter.id ? 'var(--it-primary)' : 'var(--it-muted)' }}>
                    {String(item.number).padStart(2, '0')} · {item.title}
                  </Link>
                ))}
              </div>
            </details>
          </div>

          <header className="border-b pb-6" style={{ borderColor: 'var(--it-border)' }}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="it-kicker" style={{ color: 'var(--it-primary)' }}>Topic {String(chapter.number).padStart(2, '0')}</span>
              <span className="it-label flex items-center gap-1 text-[11px]" style={{ color: 'var(--it-muted)' }}>
                <Clock3 className="h-3.5 w-3.5" /> {chapter.estimatedMinutes} min read
              </span>
            </div>
            <h1 className="it-page-title mt-3">{chapter.title}</h1>
            <p className="mt-1 text-[15px] italic" style={{ color: 'var(--it-muted)' }}>{chapter.subtitle}</p>
            <p className="it-prose mt-4">{lesson.hook}</p>
          </header>

          <section className="border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>In plain English</p>
            <p className="mt-2 max-w-[690px] text-[1.2rem] leading-[1.55] font-semibold">{lesson.plainEnglish}</p>
          </section>

          <section className="border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-muted)' }}>The one idea</p>
            <p className="mt-2 max-w-[690px] text-[1.25rem] font-semibold leading-[1.45]">{lesson.oneIdea}</p>
            <p className="it-prose mt-3 max-w-[690px]">{lesson.whyItMatters}</p>
          </section>

          <section className="border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
            <h2 className="it-section-title">What you will learn</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {lesson.objectives.map((objective) => (
                <li key={objective} className="flex gap-2 text-[14px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: 'var(--it-primary)' }} />
                  {objective}
                </li>
              ))}
            </ul>
          </section>

          <div className="space-y-9 py-8">
            {lesson.sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-24">
                <div className="flex items-baseline gap-3">
                  <span className="it-mono text-[11px] font-bold" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="it-section-title">{section.title}</h2>
                </div>
                <p className="it-prose mt-3">{section.body}</p>
                {section.code && <div className="mt-4"><CodeBlock code={section.code} caption={`topic-${String(chapter.number).padStart(2, '0')}`} /></div>}
              </section>
            ))}
          </div>

          <section id="worked-example" className="scroll-mt-24 border-y py-6" style={{ borderColor: 'var(--it-border-strong)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Worked example</p>
            <h2 className="it-section-title mt-2">{lesson.example.title}</h2>
            <p className="it-prose mt-2">{lesson.example.scenario}</p>
            <div className="mt-4 border-t" style={{ borderColor: 'var(--it-border)' }}>
              {lesson.example.steps.map((step, index) => (
                <div key={step.action} className="grid gap-2 border-b py-3 sm:grid-cols-[30px_1fr_20px_1fr] sm:items-start" style={{ borderColor: 'var(--it-border)' }}>
                  <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
                  <p className="text-[14px] leading-relaxed">{step.action}</p>
                  <ArrowRight className="hidden h-3.5 w-3.5 sm:mt-1 sm:block" style={{ color: 'var(--it-border-strong)' }} />
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{step.result}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[14px] leading-relaxed">
              <span className="it-label mr-2 text-[11px]" style={{ color: 'var(--it-primary)' }}>Conclusion</span>
              {lesson.example.conclusion}
            </p>
          </section>

          <section id="tradeoff" className="scroll-mt-24 border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
            <p className="it-kicker" style={{ color: 'var(--it-muted)' }}>The trade-off</p>
            <div className="mt-3 grid gap-0 border sm:grid-cols-3" style={{ borderColor: 'var(--it-border)' }}>
              {[
                { label: 'Gain', text: lesson.tradeoff.gain, color: 'var(--it-ok)' },
                { label: 'Cost', text: lesson.tradeoff.cost, color: 'var(--it-danger)' },
                { label: 'Verdict', text: lesson.tradeoff.verdict, color: 'var(--it-primary)' },
              ].map((item, index) => (
                <div key={item.label} className={`px-4 py-4 ${index < 2 ? 'border-b sm:border-b-0 sm:border-r' : ''}`} style={{ borderColor: 'var(--it-border)' }}>
                  <p className="it-label text-[10px]" style={{ color: item.color }}>{item.label}</p>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="terms" className="scroll-mt-24 border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
            <h2 className="it-section-title">Key terms</h2>
            <dl className="mt-3 grid gap-4 sm:grid-cols-2">
              {lesson.terms.map((term) => (
                <div key={term.term}>
                  <dt className="it-heading text-[14px]">{term.term}</dt>
                  <dd className="mt-1 text-[14px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{term.definition}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="recap" className="scroll-mt-24 border-b py-6" style={{ borderColor: 'var(--it-border)' }}>
            <h2 className="it-section-title">Recap</h2>
            <div className="mt-3 grid gap-0 border sm:grid-cols-3" style={{ borderColor: 'var(--it-border)' }}>
              {[
                { title: 'Remember', items: lesson.keyTakeaways, marker: '+' },
                { title: 'Avoid', items: lesson.pitfalls, marker: '!' },
                { title: 'Focus', items: lesson.focusPoints, marker: '→' },
              ].map((box, index) => (
                <div key={box.title} className={`px-4 py-4 ${index < 2 ? 'border-b sm:border-b-0 sm:border-r' : ''}`} style={{ borderColor: 'var(--it-border)' }}>
                  <p className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>{box.title}</p>
                  <ul className="mt-2 space-y-2">
                    {box.items.map((item) => (
                      <li key={item} className="grid grid-cols-[12px_1fr] gap-2 text-[12px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>
                        <span className="it-mono text-[10px]" style={{ color: 'var(--it-primary)' }}>{box.marker}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="check" className="scroll-mt-24 py-7">
            <div className="flex flex-wrap items-end justify-between gap-2 border-b pb-3" style={{ borderColor: 'var(--it-border)' }}>
              <div>
                <p className="it-kicker" style={{ color: 'var(--it-primary)' }}>Check yourself</p>
                <h2 className="it-section-title mt-1">Quick check</h2>
              </div>
              <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>{answeredCount} / {lesson.quiz.length} answered</span>
            </div>

            <div className="space-y-6 pt-4">
              {lesson.quiz.map((item, questionIndex) => {
                const selected = answers[questionIndex];
                const answered = selected !== undefined;
                const correct = selected === item.answer;
                return (
                  <div key={item.question}>
                    <div className="flex gap-3">
                      <span className="it-mono text-[11px] font-bold" style={{ color: 'var(--it-primary)' }}>{String(questionIndex + 1).padStart(2, '0')}</span>
                      <p className="text-[15px] font-semibold leading-relaxed">{item.question}</p>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 sm:pl-7">
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
                            className="flex min-h-11 items-start gap-2 border px-3 py-2.5 text-left text-[13px] disabled:cursor-default"
                            style={{
                              borderColor: isCorrect ? 'var(--it-ok)' : isWrong ? 'var(--it-danger)' : 'var(--it-border)',
                              backgroundColor: isCorrect ? 'var(--it-ok-soft)' : isWrong ? 'var(--it-danger-soft)' : isSelected ? 'var(--it-primary-soft)' : 'transparent',
                              color: isCorrect ? 'var(--it-ok)' : isWrong ? 'var(--it-danger)' : 'var(--it-text)',
                            }}
                          >
                            <span className="it-mono mt-0.5 text-[10px] font-bold">{String.fromCharCode(65 + optionIndex)}</span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>
                    {answered && (
                      <div className="mt-3 flex items-start gap-2 border-l-2 pl-3 text-[13px] leading-relaxed sm:ml-7" style={{ borderColor: correct ? 'var(--it-ok)' : 'var(--it-danger)', color: 'var(--it-muted)' }}>
                        {correct ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--it-ok)' }} /> : <Minus className="mt-0.5 h-4 w-4 shrink-0" style={{ color: 'var(--it-danger)' }} />}
                        <span>{item.explanation}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <div className="border-t pt-5" style={{ borderColor: 'var(--it-border)' }}>
            <div className="grid gap-3 sm:grid-cols-2">
              {previous ? (
                <Link href={`${basePath}/learn/${previous.id}`} className="group border p-3" style={{ borderColor: 'var(--it-border)' }}>
                  <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>← Previous topic</span>
                  <span className="mt-1 block text-[13px] font-semibold group-hover:text-[var(--it-primary)]">{previous.title}</span>
                </Link>
              ) : <span />}
              {next ? (
                <Link href={`${basePath}/learn/${next.id}`} className="group border p-3 sm:text-right" style={{ borderColor: 'var(--it-border)' }}>
                  <span className="it-label text-[10px]" style={{ color: 'var(--it-muted)' }}>Next topic →</span>
                  <span className="mt-1 block text-[13px] font-semibold group-hover:text-[var(--it-primary)]">{next.title}</span>
                </Link>
              ) : (
                <Link href={`${basePath}/problems`} className="group border p-3 sm:text-right" style={{ borderColor: 'var(--it-primary)' }}>
                  <span className="it-label text-[10px]" style={{ color: 'var(--it-primary)' }}>Finish →</span>
                  <span className="mt-1 block text-[13px] font-semibold">Practise the module</span>
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                markChapterComplete(chapter.id);
                router.push(next ? `${basePath}/learn/${next.id}` : `${basePath}/problems`);
              }}
              className="it-btn it-btn-solid mt-4 w-full sm:w-auto"
            >
              {next ? 'Complete and continue' : 'Complete the module'} <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {practiceCount > 0 && (
              <p className="mt-3 text-[12px]" style={{ color: 'var(--it-muted)' }}>
                <Link href={`${basePath}/problems?chapter=${chapter.id}`} className="it-link">
                  Practise these {practiceCount} questions
                </Link>
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
