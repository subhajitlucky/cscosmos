'use client';

// One concept = three questions (why it matters, what the bytes do, how it
// fails) plus the bespoke interactive widget for that piece of the wire.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONCEPTS, PHASES, getConcept } from '../data/concepts';
import { CONCEPT_WIDGETS } from '../components/widgets';
import { LEARNING_EVENT, readLearningState, toggleCompleted } from '@/lib/local-learning';

export interface NetworkTopicProps {
  subtopicSlug: string;
  basePath?: string;
}

export function NetworkTopic({
  subtopicSlug,
  basePath = '/corecs/computer-networks-internals-tcpip',
}: NetworkTopicProps) {
  const concept = getConcept(subtopicSlug) ?? CONCEPTS[0];
  const index = CONCEPTS.indexOf(concept);
  const previous = CONCEPTS[index - 1];
  const next = CONCEPTS[index + 1];
  const phaseTitle = PHASES.find((phase) => phase.id === concept.phase)?.title ?? concept.phase;
  const Widget = CONCEPT_WIDGETS[concept.widget];

  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const sync = (): void => setIsComplete(readLearningState().completed.includes(concept.slug));
    sync();
    window.addEventListener(LEARNING_EVENT, sync);
    return () => window.removeEventListener(LEARNING_EVENT, sync);
  }, [concept.slug]);

  const navClass =
    'inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 transition-colors motion-reduce:transition-none hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:focus-visible:outline-sky-400';

  return (
    <article className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <nav aria-label="Concept navigation" className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-300 pb-4 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <Link
            href={basePath}
            className="text-sky-800 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
          >
            Overview
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`${basePath}/learn`}
            className="text-sky-800 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
          >
            Syllabus
          </Link>
        </div>
        <span className="font-mono text-xs">
          {String(concept.number).padStart(2, '0')} / {CONCEPTS.length}
        </span>
      </nav>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide">
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-sky-900 dark:bg-sky-950 dark:text-sky-200">
            {phaseTitle}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
            {concept.difficulty}
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {concept.title}
        </h1>
        <p className="max-w-3xl leading-relaxed text-slate-700 dark:text-slate-200">
          Read this concept as one more decision made about a packet in flight. The widget below
          lets you change the inputs and watch the consequence instead of memorising the rule.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={isComplete}
            onClick={() => setIsComplete(toggleCompleted(concept.slug).completed.includes(concept.slug))}
            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400 ${
              isComplete
                ? 'border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800 dark:border-emerald-400 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300'
                : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span aria-hidden="true">{isComplete ? '✓' : '○'}</span>
            {isComplete ? 'Completed' : 'Mark complete'}
          </button>
          <span className="text-sm text-slate-600 dark:text-slate-300">
            Saved on this device and shown in the syllabus.
          </span>
        </div>
      </header>

      <section aria-label="Lesson" className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-xl border border-slate-300 border-t-4 border-t-sky-500 bg-white p-4 dark:border-slate-700 dark:border-t-sky-400 dark:bg-slate-900">
          <h2 className="text-sm font-black uppercase tracking-wide text-sky-900 dark:text-sky-300">
            Why it matters
          </h2>
          <p className="leading-relaxed text-slate-800 dark:text-slate-100">{concept.why}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-300 border-t-4 border-t-indigo-500 bg-white p-4 dark:border-slate-700 dark:border-t-indigo-400 dark:bg-slate-900">
          <h2 className="text-sm font-black uppercase tracking-wide text-indigo-800 dark:text-indigo-300">
            On the wire
          </h2>
          <p className="leading-relaxed text-slate-800 dark:text-slate-100">{concept.onTheWire}</p>
        </div>
        <div className="space-y-2 rounded-xl border border-slate-300 border-t-4 border-t-amber-500 bg-white p-4 dark:border-slate-700 dark:border-t-amber-400 dark:bg-slate-900">
          <h2 className="text-sm font-black uppercase tracking-wide text-amber-900 dark:text-amber-300">
            When it breaks
          </h2>
          <p className="leading-relaxed text-slate-800 dark:text-slate-100">{concept.whenItBreaks}</p>
        </div>
      </section>

      <section aria-label={`Interactive model for ${concept.title}`}>
        <Widget concept={concept} />
      </section>

      <section aria-label="Continue learning" className="flex flex-wrap items-center gap-3 border-t border-slate-300 pt-5 dark:border-slate-700">
        {previous ? (
          <Link href={`${basePath}/learn/${previous.slug}`} className={navClass}>
            <span aria-hidden="true">←</span> Previous: {previous.title}
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            No earlier concept
          </span>
        )}
        {next ? (
          <Link href={`${basePath}/learn/${next.slug}`} className={navClass}>
            Next: {next.title} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
            Final concept
          </span>
        )}
        <Link
          href={`${basePath}/lab?concept=${concept.slug}`}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-sky-600 bg-sky-700 px-4 py-2 text-sm font-bold text-white transition-colors motion-reduce:transition-none hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300 dark:focus-visible:outline-sky-400"
        >
          Open in lab <span aria-hidden="true">→</span>
        </Link>
      </section>
    </article>
  );
}
