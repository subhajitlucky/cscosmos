'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Sparkles } from 'lucide-react';
import { lldTopicGroups, lldTopics } from '../data/topics';

/** The five invariants the whole engine is built on. */
const SOLID_LEDGER = [
  { letter: 'S', name: 'Single Responsibility' },
  { letter: 'O', name: 'Open/Closed' },
  { letter: 'L', name: 'Liskov Substitution' },
  { letter: 'I', name: 'Interface Segregation' },
  { letter: 'D', name: 'Dependency Inversion' },
];

const STUDIOS = [
  {
    href: '/lldcosmos/learn',
    label: 'Concept Map',
    role: `${lldTopicGroups.length} design tracks, ${lldTopics.length} topics`,
  },
  {
    href: '/lldcosmos/solid-lab',
    label: 'SOLID Lab',
    role: 'five principles, violation ↔ refactor',
  },
  {
    href: '/lldcosmos/patterns-lab',
    label: 'GoF Patterns Lab',
    role: 'strategy · decorator · observer, runnable',
  },
  {
    href: '/lldcosmos/about',
    label: 'Design Notes',
    role: 'how this studio teaches design',
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Subject identity + the invariant ledger */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--lld-primary-10)] border border-[var(--lld-primary-30)] flex items-center justify-center text-[var(--lld-primary-text)]">
                <Box className="w-4 h-4 text-[var(--lld-primary-text)]" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-[var(--lld-text)]">
                  LLD::COSMOS
                </span>
                <p className="text-[11px] text-[var(--lld-muted)] font-mono">
                  Low-Level Design &bull; Object-Oriented Design &bull; Clean Architecture
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[var(--lld-muted)] leading-relaxed max-w-md">
              A refactoring studio for object-oriented design: assign responsibilities, keep
              abstractions stable, and let new behaviour arrive as new classes rather than new
              branches.
            </p>

            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                Invariants
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SOLID_LEDGER.map(({ letter, name }) => (
                  <span
                    key={letter}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--lld-border-subtle)] font-mono text-[10px] text-[var(--lld-muted)]"
                  >
                    <span className="text-[var(--lld-primary-text)] font-bold">{letter}</span>
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Curriculum: one link per design track, straight from the topic data */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
              Curriculum
            </span>
            <ul className="space-y-2">
              {lldTopicGroups.map((group) => {
                const leadTopic = group.topics[0];
                if (!leadTopic) return null;
                return (
                  <li key={group.id}>
                    <Link
                      href={`/lldcosmos/learn/${leadTopic.id}`}
                      className="group block text-xs text-[var(--lld-muted)] hover:text-[var(--lld-primary-text)] transition-colors"
                    >
                      <span className="font-mono text-[10px] text-[var(--lld-border)] group-hover:text-[var(--lld-primary-text)] mr-1.5">
                        {String(lldTopicGroups.indexOf(group) + 1).padStart(2, '0')}
                      </span>
                      {group.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Where the practice happens */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--lld-primary-text)]">
              Studios &amp; notes
            </span>
            <ul className="space-y-3">
              {STUDIOS.map((studio) => (
                <li key={studio.href}>
                  <Link
                    href={studio.href}
                    className="block text-xs text-[var(--lld-text)] hover:text-[var(--lld-primary-text)] transition-colors"
                  >
                    {studio.label}
                  </Link>
                  <span className="block font-mono text-[10px] text-[var(--lld-muted)]">
                    {studio.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--lld-border-subtle)] flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[var(--lld-muted)]">
          <span>
            SRP &bull; OCP &bull; LSP &bull; ISP &bull; DIP &mdash; one reason to change per module
          </span>
          <span className="flex items-center gap-2">
            <span>Part of CSCosmos</span>
            <Sparkles className="w-3.5 h-3.5 text-[var(--lld-primary-text)]" />
          </span>
        </div>
      </div>
    </footer>
  );
}
