'use client';

// Landing view for the networks curriculum. The pedagogy is a packet's trip:
// start at the wire, follow one frame upward, and meet every layer on the way.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, FlaskConical, ListChecks, Route } from 'lucide-react';
import { CONCEPTS, PHASES } from '../data/concepts';
import { JourneyMap } from '../components/JourneyMap';
import type { SimLayer } from '../components/layers';

export interface NetworkHomeProps {
  basePath?: string;
}

// Bottom-to-top so the preview matches "climb the stack" copy.
const PREVIEW_LAYERS: SimLayer[] = ['Physical', 'Link', 'Network', 'Transport', 'Application'];
const PREVIEW_INTERVAL_MS = 1200;

const LINK_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:focus-visible:outline-sky-400';

export function NetworkHome({
  basePath = '/corecs/computer-networks-internals-tcpip',
}: NetworkHomeProps) {
  const [previewIndex, setPreviewIndex] = useState(2);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    const handleChange = (event: MediaQueryListEvent): void => setReduceMotion(event.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setPreviewIndex((index) => (index + 1) % PREVIEW_LAYERS.length);
    }, PREVIEW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const activeLayer = PREVIEW_LAYERS[previewIndex];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 sm:p-10 dark:border-sky-900 dark:from-slate-900 dark:via-slate-900 dark:to-sky-950">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-800 dark:text-sky-300">
            Network Cosmos · Packet Journey
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Follow one packet. Understand every layer.
          </h1>
          <p className="text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-200">
            Every protocol on this page is a decision made about the same bytes in flight. Trace a
            single frame from physical signals up to the application, then back again, and the
            layers stop being abstractions.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-sky-300 bg-white px-3 py-1 text-sm font-bold text-sky-900 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-100">
              {CONCEPTS.length} concepts · {PHASES.length} phases
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Seven phases, one continuous journey
            </span>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`${basePath}/learn`}
              className={`${LINK_CLASS} border-slate-900 bg-slate-900 text-white hover:bg-slate-700 dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300`}
            >
              Browse the syllabus <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href={`${basePath}/lab`}
              className={`${LINK_CLASS} border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`}
            >
              <FlaskConical aria-hidden="true" className="h-4 w-4" /> Open the journey lab
            </Link>
            <Link
              href={`${basePath}/problems`}
              className={`${LINK_CLASS} border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700`}
            >
              <ListChecks aria-hidden="true" className="h-4 w-4" /> Try 20 challenges
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-sky-200/60 dark:border-sky-800/40"
        />
      </section>

      <section aria-labelledby="journey-preview-heading" className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 self-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
            Live preview
          </p>
          <h2 id="journey-preview-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
            Watch a frame climb the stack
          </h2>
          <p className="leading-relaxed text-slate-700 dark:text-slate-200">
            The lab sends real scenario hops through this map. Each stop shows what changes in the
            headers — a MAC address at the link, a TTL at the router, a port number at the
            transport layer. Presentation and session stay passive: they are part of the OSI model
            but add no bytes of their own here.
          </p>
          <p className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
            <span className="h-2 w-2 rounded-full bg-sky-600 dark:bg-sky-400" aria-hidden="true" />
            {reduceMotion ? 'Static view (reduced motion enabled)' : `Tracing: ${activeLayer} layer`}
          </p>
          <Link
            href={`${basePath}/lab`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:decoration-sky-700 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
          >
            Step through it yourself <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <JourneyMap activeLayer={activeLayer} />
      </section>

      <section aria-labelledby="phases-heading" className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
            The route through the curriculum
          </p>
          <h2 id="phases-heading" className="text-2xl font-bold text-slate-900 dark:text-white">
            Seven phases, from signals to failure diagnosis
          </h2>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PHASES.map((phase, index) => {
            const firstConcept = phase.concepts[0];
            return (
              <li key={phase.id}>
                <article className="flex h-full flex-col gap-3 rounded-xl border border-slate-300 border-l-4 border-l-sky-500 bg-white p-4 shadow-sm dark:border-slate-700 dark:border-l-sky-400 dark:bg-slate-900">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                      {phase.concepts.length} concepts
                    </span>
                  </div>
                  <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
                    {phase.title}
                  </h3>
                  <p className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                    Begins with {firstConcept.title}.
                  </p>
                  <Link
                    href={`${basePath}/learn/${firstConcept.slug}`}
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-sky-800 hover:text-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-sky-300 dark:hover:text-sky-200 dark:focus-visible:outline-sky-400"
                  >
                    <Route aria-hidden="true" className="h-4 w-4" /> Start phase{' '}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </article>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
