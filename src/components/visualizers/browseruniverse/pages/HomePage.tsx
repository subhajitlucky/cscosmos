'use client';

import React from 'react';
import Link from 'next/link';
import Hero from '../components/Hero';
import TopicCard from '../components/TopicCard';
import { topics } from '../data/topics';
import { visualizerMeta } from '../visualizers/registry';

export default function HomePage() {
  const featured = topics.slice(0, 6);

  return (
    <div className="space-y-10">
      <Hero
        title="BrowserLab — Explore the Browser from Bytes to Pixels"
        subtitle="Interactive walkthroughs of parsing, DOM construction, rendering pipelines, JS engine internals, the event loop, and more. Live visualizers, guided tours, and a sandbox to test ideas safely."
        primaryCta="Start the Tour"
        secondaryCta="Open Sandbox"
      />

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Visualizers</p>
            <h2 className="section-title">Deep-dive visualizers</h2>
            <p className="text-sm text-slate-300">Covering parsing, layout, paint, GPU, JS engine, GC, and DevTools.</p>
          </div>
          <Link
            href="/browseruniverse/topics"
            className="hidden rounded-full border border-border px-4 py-2 text-sm text-white transition hover:border-accent/50 hover:text-accentSoft sm:inline-flex"
          >
            Browse all topics
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-border bg-card/70 p-6 shadow-glow lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Interactive Tour</p>
          <h2 className="section-title">Network → Parse → Render → GPU → DevTools</h2>
          <p className="text-sm text-slate-300">
            A guided multi-step tour that animates each phase of the critical rendering path and JS engine execution.
            Watch tasks and microtasks interleave with rendering ticks.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
            {['Network', 'Tokenizer', 'DOM/CSSOM', 'Render tree', 'Layout', 'Paint', 'Composite', 'GPU', 'DevTools'].map((item) => (
              <span key={item} className="rounded-full border border-border bg-base/70 px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="glass grid gap-2 rounded-2xl border border-border p-4">
          {topics.slice(0, 5).map((topic) => {
            const meta = visualizerMeta(topic.slug);
            return (
              <div key={topic.slug} className="flex items-center justify-between rounded-xl border border-border bg-base/70 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-white">{meta?.title ?? topic.title}</p>
                  <p className="text-xs text-slate-300">{meta?.description ?? topic.description}</p>
                </div>
                <Link
                  href={`/browseruniverse/topics/${topic.slug}`}
                  className="text-xs font-semibold text-accentSoft underline decoration-dotted"
                >
                  Open
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="glass rounded-3xl border border-border p-6 shadow-glow">
          <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Sandbox</p>
          <h2 className="section-title">Live DOM sandbox</h2>
          <p className="text-sm text-slate-300">
            Monaco-powered editors feed a sandboxed iframe with CSP and postMessage instrumentation. Watch mutation
            observers and runtime errors surface instantly.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-200">
            <InfoPill title="Mutation log" body="Live DOM tree + mutation observer feed." />
            <InfoPill title="Event inspector" body="rAF + tasks + microtasks timeline overlay." />
            <InfoPill title="Stack traces" body="Runtime errors bubbled with stack frames." />
            <InfoPill title="Sandboxed iframe" body="CSP default-src 'none'; optional allow-same-origin toggle." />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/browseruniverse/sandbox"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Open sandbox
            </Link>
            <Link
              href="/browseruniverse/tour"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-white hover:border-accent/40"
            >
              Guided tour
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card/70 p-6">
          <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Learning paths</p>
          <h2 className="section-title">From fundamentals to advanced</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-200">
            <li className="rounded-xl border border-border bg-base/70 p-3">
              <p className="font-semibold text-white">Rendering Fundamentals</p>
              <p className="text-xs text-slate-300">Parsing → DOM/CSSOM → Render tree → Layout → Paint/Composite.</p>
            </li>
            <li className="rounded-xl border border-border bg-base/70 p-3">
              <p className="font-semibold text-white">JavaScript Engine & Event Loop</p>
              <p className="text-xs text-slate-300">Ignition, TurboFan, inline caches, GC, tasks, microtasks, rAF.</p>
            </li>
            <li className="rounded-xl border border-border bg-base/70 p-3">
              <p className="font-semibold text-white">Performance & Security</p>
              <p className="text-xs text-slate-300">RAIL, profiling, GPU budgets, CSP, sandboxing, COOP/COEP.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function InfoPill({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-base/70 p-3">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="text-xs text-slate-300">{body}</p>
    </div>
  );
}
