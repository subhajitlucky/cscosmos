'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Box, ShieldCheck } from 'lucide-react';
import { lldTopics } from '../data/topics';

/**
 * The method page is written as the subject is taught: a short set of
 * refactoring moves, then CRC cards (Class / Responsibility / Collaborator)
 * for this studio's own modules — the same single-responsibility test the
 * engine applies to classes, applied to its pages.
 */
const MOVES = [
  {
    step: '01',
    title: 'Read the invariant',
    href: '/lldcosmos/learn',
    linkLabel: 'Concept map',
    body: 'Each of the five tracks states one principle, the analogy that makes it stick, the ordered steps that apply it, and the two mistakes that break it.',
  },
  {
    step: '02',
    title: 'Break it on purpose',
    href: '/lldcosmos/solid-lab',
    linkLabel: 'SOLID Lab',
    body: 'Pick a principle and read the violating class next to the refactored one — smell, then the architectural advantage the refactor buys.',
  },
  {
    step: '03',
    title: 'Run the pattern',
    href: '/lldcosmos/patterns-lab',
    linkLabel: 'GoF Patterns Lab',
    body: 'Strategy swaps a discount algorithm at runtime, Decorator stacks coffee add-ons additively, Observer pushes one price tick to every subscriber.',
  },
  {
    step: '04',
    title: 'Rebuild under constraints',
    href: '/lldcosmos/learn/lld-parking-lot-case-study',
    linkLabel: 'Machine-coding case study',
    body: 'Requirements become entities, entities get allocation strategies, and the concurrency and pricing pitfalls are named before they bite.',
  },
];

const CARDS = [
  {
    path: '/lldcosmos/learn',
    responsibility: 'Orders the design vocabulary into five tracks, from principles to case study.',
    collaborators: 'topic deep dives, both labs',
    changes: 'a track is added or its sequence changes',
  },
  {
    path: '/lldcosmos/learn/[topic]',
    responsibility:
      'Owns exactly one concept: definition, analogy, ordered steps, pitfalls, code and related topics.',
    collaborators: 'related-topic graph, case study',
    changes: 'the explanation of that one concept improves',
  },
  {
    path: '/lldcosmos/solid-lab',
    responsibility: 'Holds the violation ↔ refactored code pairs for the five principles.',
    collaborators: 'curriculum track 01, the SOLID matrix on the home page',
    changes: 'a principle gets a sharper before/after example',
  },
  {
    path: '/lldcosmos/patterns-lab',
    responsibility: 'Executes Strategy, Decorator and Observer instead of describing them.',
    collaborators: 'behavioral and structural tracks',
    changes: 'another GoF pattern becomes runnable',
  },
  {
    path: '/lldcosmos/about',
    responsibility: 'Owns the teaching method — the moves and the cards on this page.',
    collaborators: 'every other module',
    changes: 'the pedagogy changes, not a lesson',
  },
];

const VOCABULARY = [
  'responsibility',
  'abstraction',
  'polymorphism',
  'coupling & cohesion',
  'invariant',
  'refactoring move',
];

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--lld-primary-30)] bg-[var(--lld-primary-10)] text-[var(--lld-primary-text)] text-xs font-mono">
          <Box className="w-3.5 h-3.5" /> LLD::COSMOS &bull; Design Notes
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--lld-text)]">
          Design is learned by{' '}
          <span className="text-[var(--lld-primary-text)] lld-glow">reassigning responsibility</span>,
          not by memorising 23 patterns
        </h1>

        <p className="text-base md:text-lg text-[var(--lld-muted)] max-w-3xl leading-relaxed">
          There is no lecture track here. Every module is a place to change a class and watch the
          coupling move: read the invariant, break it, refactor it, then rebuild a whole system
          under interview constraints.
        </p>
      </div>

      {/* The four moves */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-6 border-b border-[var(--lld-border-subtle)] pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--lld-primary-text)] uppercase tracking-wider">
              Method
            </span>
            <h2 className="font-display text-2xl font-bold text-[var(--lld-text)] mt-1">
              Four moves per principle
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-[10px] text-[var(--lld-muted)]">
            {lldTopics.length} topics &bull; 2 refactoring labs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOVES.map((move) => (
            <div
              key={move.step}
              className="p-6 rounded-2xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-3"
            >
              <span className="font-mono text-xs text-[var(--lld-primary-text)] font-bold">
                {move.step}
              </span>
              <h3 className="font-display font-bold text-xl text-[var(--lld-text)]">
                {move.title}
              </h3>
              <p className="text-xs text-[var(--lld-muted)] leading-relaxed">{move.body}</p>
              <Link
                href={move.href}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--lld-primary-text)] hover:underline pt-1"
              >
                {move.linkLabel} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CRC cards for the studio itself */}
      <section className="space-y-8">
        <div className="space-y-3 border-b border-[var(--lld-border-subtle)] pb-4">
          <span className="font-mono text-xs text-[var(--lld-primary-text)] uppercase tracking-wider">
            Class &bull; Responsibility &bull; Collaborator
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--lld-text)]">
            The studio, held to its own rule
          </h2>
          <p className="text-xs text-[var(--lld-muted)] max-w-3xl leading-relaxed">
            The same test the engine applies to classes applies to its pages: one reason to change
            each. If a module below starts answering two of these lines at once, it is a design
            smell in the studio itself.
          </p>
        </div>

        <ul className="space-y-3">
          {CARDS.map((card, index) => (
            <li
              key={card.path}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 p-5 rounded-xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] font-mono text-[11px]"
            >
              <div className="md:col-span-3 flex items-start gap-2">
                <span className="text-[var(--lld-primary-text)] font-bold">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="text-[var(--lld-text)] break-all">{card.path}</span>
              </div>
              <div className="md:col-span-4 space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                  Responsibility
                </span>
                <span className="block text-[var(--lld-text)] leading-relaxed font-sans text-xs">
                  {card.responsibility}
                </span>
              </div>
              <div className="md:col-span-3 space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                  Collaborators
                </span>
                <span className="block text-[var(--lld-muted)] leading-relaxed">
                  {card.collaborators}
                </span>
              </div>
              <div className="md:col-span-2 space-y-1">
                <span className="block text-[9px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                  Changes when
                </span>
                <span className="block text-[var(--lld-muted)] leading-relaxed">{card.changes}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Vocabulary the learner should leave with */}
      <section className="space-y-4">
        <span className="font-mono text-xs text-[var(--lld-primary-text)] uppercase tracking-wider">
          Vocabulary you leave with
        </span>
        <div className="flex flex-wrap gap-2">
          {VOCABULARY.map((term) => (
            <span
              key={term}
              className="px-2.5 py-1 rounded-full border border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] font-mono text-[10px] text-[var(--lld-muted)]"
            >
              {term}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--lld-text)]">
            Start with the principle that is currently hurting
          </h3>
          <p className="text-xs text-[var(--lld-muted)]">
            Five tracks, then a violation to refactor, then a pattern to run.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/lldcosmos/solid-lab"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[var(--lld-border)] bg-[var(--lld-surface)] font-mono text-xs text-[var(--lld-text)] hover:border-[var(--lld-primary)] hover:text-[var(--lld-primary-text)] transition-all whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--lld-emerald)]" />
            Open SOLID Lab
          </Link>
          <Link
            href="/lldcosmos/learn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--lld-primary)] text-white font-semibold text-xs hover:bg-[var(--lld-primary-hover)] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] whitespace-nowrap"
          >
            Explore Concept Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
