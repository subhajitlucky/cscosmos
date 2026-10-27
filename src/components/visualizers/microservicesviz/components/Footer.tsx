'use client';

import React from 'react';
import Link from 'next/link';
import { Network, Sparkles } from 'lucide-react';
import { microserviceTopicGroups, microserviceTopics } from '../data/topics';

/** Breaker states exactly as the Circuit Breaker Lab implements them. */
const BREAKER_STATES = [
  {
    state: 'CLOSED',
    behaviour: 'Traffic passes; failures are counted in a sliding window.',
    swatch: 'bg-[var(--ms-emerald)]',
  },
  {
    state: 'OPEN',
    behaviour: 'Fast-fail on a fallback; no downstream call is made.',
    swatch: 'bg-[var(--ms-rose)]',
  },
  {
    state: 'HALF_OPEN',
    behaviour: 'One canary probe decides whether to close or re-trip.',
    swatch: 'bg-[var(--ms-amber)]',
  },
];

const BOUNDARY_LABELS: Record<string, string> = {
  decomposition: 'Decomposition',
  resilience: 'Resilience',
  'transactions-sagas': 'Sagas',
  observability: 'Observability',
  'service-mesh': 'Service Mesh',
};

const DIAGNOSTICS = [
  { href: '/microservicesviz/learn', label: 'Domain Map', role: 'boundaries first' },
  { href: '/microservicesviz/circuit-lab', label: 'Circuit Breaker Lab', role: '3-in-5 window' },
  { href: '/microservicesviz/saga-lab', label: 'Saga Pattern Lab', role: 'forward + compensate' },
  { href: '/microservicesviz/about', label: 'Reliability Notes', role: 'drills & blast radius' },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Band 1: identity on the left, containment model on the right */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          <div className="space-y-4 max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--ms-primary-10)] border border-[var(--ms-primary-30)] flex items-center justify-center text-[var(--ms-primary)]">
                <Network className="w-4 h-4 text-[var(--ms-primary)]" />
              </div>
              <div>
                <span className="font-display font-bold text-sm text-[var(--ms-text)]">
                  MICROSERVICES::VIZ
                </span>
                <p className="text-[11px] text-[var(--ms-muted)] font-mono">
                  Distributed Systems &bull; Resilience &bull; Sagas &bull; OpenTelemetry
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[var(--ms-muted)] leading-relaxed">
              A failure simulator for distributed architecture: cut a dependency, watch the blast
              radius, contain it at the boundary, then compensate until the system is consistent
              again.
            </p>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:max-w-2xl">
            {BREAKER_STATES.map(({ state, behaviour, swatch }) => (
              <li
                key={state}
                className="p-4 rounded-xl border border-[var(--ms-border-subtle)] space-y-2"
              >
                <span className="flex items-center gap-2 font-mono text-[11px] font-bold text-[var(--ms-text)]">
                  <span aria-hidden="true" className={`w-2 h-2 rounded-sm ${swatch}`} />
                  {state}
                </span>
                <p className="font-mono text-[10px] text-[var(--ms-muted)] leading-relaxed">
                  {behaviour}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Band 2: the five boundaries as one chain */}
        <div className="pt-6 border-t border-[var(--ms-border-subtle)] space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
            Service boundaries
          </span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11px]">
            {microserviceTopicGroups.map((group, index) => {
              const leadTopic = group.topics[0];
              if (!leadTopic) return null;
              return (
                <React.Fragment key={group.id}>
                  {index > 0 && (
                    <span className="text-[var(--ms-muted)]" aria-hidden="true">
                      &rarr;
                    </span>
                  )}
                  <Link
                    href={`/microservicesviz/learn/${leadTopic.id}`}
                    className="px-2 py-1 rounded-full border border-[var(--ms-border-subtle)] text-[var(--ms-muted)] hover:text-[var(--ms-text)] hover:border-[var(--ms-border)] transition-colors"
                  >
                    {BOUNDARY_LABELS[group.id] ?? group.name}
                  </Link>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Band 3: diagnostics and the trace id the tracing module teaches */}
        <div className="pt-6 border-t border-[var(--ms-border-subtle)] flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
              Diagnostics
            </span>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {DIAGNOSTICS.map((item) => (
                <Link key={item.href} href={item.href} className="group text-xs">
                  <span className="block text-[var(--ms-text)] group-hover:underline">
                    {item.label}
                  </span>
                  <span className="block font-mono text-[10px] text-[var(--ms-muted)]">
                    {item.role}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 lg:max-w-md">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
              Sample traceparent
            </span>
            <p className="font-mono text-[10px] text-[var(--ms-text)] break-all leading-relaxed">
              00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
            </p>
            <p className="font-mono text-[10px] text-[var(--ms-muted)]">
              From the tracing module &mdash; {microserviceTopics.length} domains in total.
            </p>
          </div>
        </div>

        {/* Band 4: provenance */}
        <div className="pt-6 border-t border-[var(--ms-border-subtle)] flex items-center justify-between gap-3 font-mono text-[11px] text-[var(--ms-muted)]">
          <span>Contain the failure, then compensate.</span>
          <span className="flex items-center gap-2 shrink-0">
            <span>Part of CSCosmos</span>
            <Sparkles className="w-3.5 h-3.5 text-[var(--ms-primary)]" />
          </span>
        </div>
      </div>
    </footer>
  );
}
