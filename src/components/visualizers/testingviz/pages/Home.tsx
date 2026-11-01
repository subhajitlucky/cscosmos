'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  CheckCircle2,
  FlaskConical,
  Layers,
  Play,
  ShieldCheck,
  Target,
  XCircle,
} from 'lucide-react';
import { testingTopicGroups, testingTopics } from '../data/topics';

const pyramid = [
  {
    label: 'End-to-end',
    detail: 'Few, slow, real browser',
    width: 'w-1/2',
    color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
  {
    label: 'Integration',
    detail: 'Some, real boundaries',
    width: 'w-3/4',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  },
  {
    label: 'Unit',
    detail: 'Many, fast, isolated',
    width: 'w-full',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
];

export function Home() {
  const [mutated, setMutated] = useState(false);

  return (
    <div className="space-y-24 pb-20">
      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 md:pt-20">
        <div className="test-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--test-primary-30)] bg-[var(--test-primary-10)] px-3 py-1.5 text-xs font-mono text-[var(--test-primary)]">
              <FlaskConical className="h-3.5 w-3.5" />
              Unit &bull; Integration &bull; E2E &bull; TDD
            </div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--test-text)] md:text-7xl">
              Trust the suite.
              <br />
              <span className="test-glow text-[var(--test-primary)]">Ship with evidence.</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-[var(--test-muted)] md:text-lg">
              Learn how to prove that software works: the testing pyramid, test doubles,
              integration seams, browser journeys, contracts, TDD, property-based testing,
              and mutation testing.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/fullstack/testing/learn"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--test-primary)] px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-[var(--test-primary-hover)] active:scale-95"
              >
                Explore the curriculum <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#pyramid"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--test-border)] bg-[var(--test-surface)] px-6 py-3.5 font-mono text-sm text-[var(--test-text)] transition-all hover:border-[var(--test-primary)] hover:text-[var(--test-primary)]"
              >
                <Layers className="h-4 w-4 text-[var(--test-primary)]" />
                See the test pyramid
              </a>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-6 font-mono text-xs text-[var(--test-muted)]">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--test-primary)]" />
                {testingTopics.length} lessons
              </span>
              <span className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[var(--test-cyan)]" />
                {testingTopicGroups.length} tracks
              </span>
              <span className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[var(--test-amber)]" />
                Beginner to advanced
              </span>
            </div>
          </div>

          {/* Mutation testing demo */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-2xl border border-[var(--test-border)] bg-[var(--test-surface)] font-mono text-xs shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--test-border-subtle)] bg-[var(--test-surface-2)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-[var(--test-muted)]">testing::mutation-lab</span>
                </div>
                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                  LIVE
                </span>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-xl border border-[var(--test-border-subtle)] bg-[var(--test-bg)] p-4">
                  <div className="mb-3 flex items-center justify-between text-[10px] text-[var(--test-muted)]">
                    <span>pricing.test.ts</span>
                    <span className="text-[var(--test-primary)]">expect(…).toBe(80)</span>
                  </div>
                  <pre className="overflow-x-auto leading-relaxed text-[var(--test-text)]">
                    <code>{`it('applies a 20% discount', () => {
  expect(applyDiscount(100, 0.2)).toBe(80);
});`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-[var(--test-border-subtle)] bg-[var(--test-bg)] p-4">
                  <div className="mb-3 flex items-center justify-between text-[10px] text-[var(--test-muted)]">
                    <span>pricing.ts</span>
                    <span className={mutated ? 'text-rose-400' : 'text-[var(--test-primary)]'}>
                      {mutated ? 'MUTANT' : 'ORIGINAL'}
                    </span>
                  </div>
                  <pre className="overflow-x-auto leading-relaxed text-[var(--test-text)]">
                    <code>{`export function applyDiscount(total, rate) {
  return total - total * ${mutated ? 'rate / 2' : 'rate'};
}`}</code>
                  </pre>
                </div>

                <button
                  onClick={() => setMutated((value) => !value)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[11px] font-semibold transition-all ${
                    mutated
                      ? 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                      : 'border-[var(--test-border)] bg-[var(--test-primary-10)] text-[var(--test-primary)] hover:bg-[var(--test-primary-20)]'
                  }`}
                >
                  <Bug className="h-4 w-4" />
                  {mutated ? 'Restore the original code' : 'Plant a mutation in the code'}
                </button>

                <div
                  className={`rounded-xl border p-4 transition-colors ${
                    mutated
                      ? 'border-rose-500/30 bg-[var(--test-rose-10)]'
                      : 'border-emerald-500/30 bg-[var(--test-primary-10)]'
                  }`}
                >
                  <div
                    className={`mb-2 flex items-center gap-2 text-[11px] font-bold ${
                      mutated ? 'text-rose-400' : 'text-[var(--test-primary)]'
                    }`}
                  >
                    {mutated ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    {mutated ? '1 test failed — mutant killed' : '1 test passed — suite is green'}
                  </div>
                  <p className="leading-relaxed text-[var(--test-muted)]">
                    {mutated
                      ? 'Expected 80, received 90. The assertion caught the defect, so this mutant did not survive.'
                      : 'The test passed, but a passing suite is only meaningful if it can fail when the code is wrong.'}
                  </p>
                </div>

                <p className="flex items-start gap-2 text-[10px] leading-relaxed text-[var(--test-muted)]">
                  <Play className="mt-0.5 h-3 w-3 flex-shrink-0 text-[var(--test-primary)]" />
                  Try it: plant the mutation. A test that never fails proves nothing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pyramid */}
      <section id="pyramid" className="mx-auto max-w-7xl scroll-mt-20 px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--test-primary)]">
              The default portfolio
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--test-text)] md:text-4xl">
              Fast feedback first,<br />realism where it counts.
            </h2>
            <p className="text-sm leading-relaxed text-[var(--test-muted)]">
              The pyramid is a rule of thumb, not a law. Most checks should be small and
              quick. A few should cross real boundaries. Only the journeys that must never
              break deserve a full browser.
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-[var(--test-border-subtle)] bg-[var(--test-surface)] p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--test-primary)]" />
              <p className="text-xs leading-relaxed text-[var(--test-muted)]">
                Ask two questions for every test: <strong className="text-[var(--test-text)]">what can it catch?</strong>{' '}
                and <strong className="text-[var(--test-text)]">how fast does it tell me?</strong>
              </p>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-7">
            {pyramid.map((layer) => (
              <div key={layer.label} className={`${layer.width} mx-auto`}>
                <div className={`rounded-xl border px-5 py-4 ${layer.color}`}>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-sm font-bold">{layer.label}</span>
                    <span className="font-mono text-[10px] opacity-80">{layer.detail}</span>
                  </div>
                </div>
              </div>
            ))}
            <p className="pt-2 text-center font-mono text-[10px] text-[var(--test-muted)]">
              More tests &uarr; &nbsp;|&nbsp; slower, more realistic &darr;
            </p>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--test-primary)]">
              Three tracks
            </span>
            <h2 className="font-display text-3xl font-bold text-[var(--test-text)] md:text-4xl">
              What the curriculum covers
            </h2>
          </div>
          <Link
            href="/fullstack/testing/learn"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--test-primary)] hover:underline"
          >
            Browse every lesson <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testingTopicGroups.map((group, index) => (
            <Link
              key={group.id}
              href={`/fullstack/testing/learn#${group.id}`}
              className="test-card group flex flex-col justify-between rounded-xl p-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--test-primary)]">
                    TRACK_0{index + 1}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[var(--test-muted)] transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--test-primary)]" />
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--test-text)] transition-colors group-hover:text-[var(--test-primary)]">
                  {group.name}
                </h3>
                <p className="text-xs leading-relaxed text-[var(--test-muted)]">
                  {group.description}
                </p>
              </div>
              <div className="mt-6 border-t border-[var(--test-border-subtle)] pt-4 font-mono text-[10px] text-[var(--test-muted)]">
                {group.topics.length} lessons
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--test-border)] bg-[var(--test-surface)] p-8 md:p-12">
          <div className="test-grid-bg absolute inset-0 opacity-40" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-[var(--test-text)] md:text-3xl">
                Start with the shape of a healthy suite.
              </h2>
              <p className="max-w-xl text-sm text-[var(--test-muted)]">
                Lesson one explains why unit tests outnumber E2E tests — and when to break
                that rule on purpose.
              </p>
            </div>
            <Link
              href="/fullstack/testing/learn/testing-pyramid"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-[var(--test-primary)] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-[var(--test-primary-hover)] active:scale-95"
            >
              Begin lesson 01 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
