'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight, Network, ShieldAlert } from 'lucide-react';
import { microserviceTopics } from '../data/topics';

/**
 * The method page is a drill sheet, not a syllabus: each drill injects a real
 * failure into the mesh and names what to watch for while it propagates. The
 * blast-radius matrix underneath is the same four services the home-page
 * simulator runs, with the containment that each one depends on.
 */
const DRILLS = [
  {
    id: '01',
    title: 'Draw the boundaries first',
    href: '/microservicesviz/learn',
    linkLabel: 'Domain Map',
    action:
      'Decompose along business capabilities and give every service its own datastore; cross a boundary only through a published contract or a domain event.',
    watch:
      'The two failure modes the map opens with: a shared database (a distributed monolith) and a service per table (too granular to own anything).',
  },
  {
    id: '02',
    title: 'Inject the failure',
    href: '/microservicesviz',
    linkLabel: 'Mesh simulator',
    action:
      'Run a distributed RPC across Gateway → Order → Payment → Inventory under one of three scenarios: healthy flow, latency (+2.5s), or a service crash returning 500.',
    watch:
      'How a slow hop consumes the caller\u2019s threads, and how bulkhead isolation keeps it from draining the whole chain.',
  },
  {
    id: '03',
    title: 'Contain the blast radius',
    href: '/microservicesviz/circuit-lab',
    linkLabel: 'Circuit Breaker Lab',
    action:
      'Drive the three-state breaker by hand: three failures inside a five-call sliding window trip it OPEN for a five-second cooldown, then a single HALF_OPEN canary decides.',
    watch:
      'Fail-fast collapsing to a 0 ms fallback, the cooldown countdown, and a canary failure sending the breaker straight back to OPEN.',
  },
  {
    id: '04',
    title: 'Compensate, never roll back',
    href: '/microservicesviz/saga-lab',
    linkLabel: 'Saga Pattern Lab',
    action:
      'Run the four-step order saga and fail it at any step: create order, reserve stock, charge payment, dispatch courier — then watch the reverse compensations fire.',
    watch:
      'That a compensating action is a new forward business action (release stock, refund, cancel), not a database ROLLBACK — and that consumers must be idempotent.',
  },
  {
    id: '05',
    title: 'Trace what is left',
    href: '/microservicesviz/learn/opentelemetry-distributed-tracing',
    linkLabel: 'Tracing module',
    action:
      'Follow one W3C traceparent from the gateway through synchronous RPCs and the asynchronous queue, and read the span waterfall it reconstructs.',
    watch:
      'Context propagation across background workers, and why tail-based sampling — not 100% sampling — keeps the error traces.',
  },
];

const BLAST_RADIUS = [
  {
    service: 'API Gateway',
    responsibility: 'Routing, auth, rate limiting',
    breaks: 'Absorbs every slow downstream call into its own worker pool',
    containment: 'Bulkhead thread pools, timeouts, fallback routing',
  },
  {
    service: 'Order Service',
    responsibility: 'Saga orchestrator FSM',
    breaks: 'A stalled step strands the order in PENDING with no owner',
    containment: 'Compensating transactions, idempotent command consumers',
  },
  {
    service: 'Payment Service',
    responsibility: 'Stripe gateway wrapper',
    breaks: '500s and 2.5 s latency spikes drag the whole checkout down',
    containment: 'Circuit breaker fallback, asynchronous retry queue',
  },
  {
    service: 'Inventory Service',
    responsibility: 'PostgreSQL stock ledger',
    breaks: 'Reservations leak when a later step in the saga fails',
    containment: 'Release-stock compensation, expiring reservations',
  },
];

const VOCABULARY = [
  'bounded context',
  'database-per-service',
  'blast radius',
  'bulkhead',
  'compensation',
  'idempotent consumer',
  'traceparent',
  'tail-based sampling',
];

export function About() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ms-primary-30)] bg-[var(--ms-primary-10)] text-[var(--ms-text)] text-xs font-mono">
          <Network className="w-3.5 h-3.5" /> MICROSERVICES::VIZ &bull; Reliability Notes
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ms-text)]">
          Resilience is learned by{' '}
          <span className="text-[var(--ms-text)] ms-glow">breaking the mesh</span>, not by reading
          about it
        </h1>

        <p className="text-base md:text-lg text-[var(--ms-muted)] max-w-3xl leading-relaxed">
          Nothing here is a diagram you scroll past. Every module injects a concrete failure into a
          small service mesh — latency, a 500, a stale reservation — and makes you watch the state
          machine, the compensation, and the trace respond.
        </p>
      </div>

      {/* Drill sheet */}
      <section className="space-y-8">
        <div className="flex items-end justify-between gap-6 border-b border-[var(--ms-border-subtle)] pb-4">
          <div>
            <span className="font-mono text-xs text-[var(--ms-text)] uppercase tracking-wider">
              Drill sheet
            </span>
            <h2 className="font-display text-2xl font-bold text-[var(--ms-text)] mt-1">
              Five drills, in incident order
            </h2>
          </div>
          <span className="hidden sm:block font-mono text-[10px] text-[var(--ms-muted)]">
            {microserviceTopics.length} domains &bull; 2 interactive labs
          </span>
        </div>

        <ol className="space-y-3">
          {DRILLS.map((drill) => (
            <li
              key={drill.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 rounded-xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)]"
            >
              <div className="md:col-span-4 space-y-1.5">
                <span className="font-mono text-xs text-[var(--ms-muted)]">
                  DRILL {drill.id}
                </span>
                <h3 className="font-display font-bold text-lg text-[var(--ms-text)]">
                  {drill.title}
                </h3>
                <Link
                  href={drill.href}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--ms-text)] hover:underline"
                >
                  {drill.linkLabel} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="md:col-span-4 space-y-1 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[var(--ms-border-subtle)] md:pl-6">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                  You do
                </span>
                <p className="text-xs text-[var(--ms-text)] leading-relaxed">{drill.action}</p>
              </div>

              <div className="md:col-span-4 space-y-1 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-[var(--ms-border-subtle)] md:pl-6">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                  Watch for
                </span>
                <p className="text-xs text-[var(--ms-muted)] leading-relaxed">{drill.watch}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Blast radius matrix */}
      <section className="space-y-6">
        <div className="space-y-3 border-b border-[var(--ms-border-subtle)] pb-4">
          <span className="font-mono text-xs text-[var(--ms-text)] uppercase tracking-wider">
            Blast radius
          </span>
          <h2 className="font-display text-2xl font-bold text-[var(--ms-text)]">
            The four services the simulator runs
          </h2>
          <p className="text-xs text-[var(--ms-muted)] max-w-3xl leading-relaxed">
            Same topology as the home-page mesh, read as a risk table: what each service owns, what
            it does to the rest of the system when it degrades, and the containment that is
            supposed to hold.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--ms-border-subtle)]">
          <table className="w-full min-w-[42rem] text-left border-collapse">
            <thead>
              <tr className="bg-[var(--ms-surface)] font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                <th scope="col" className="px-4 py-3 font-normal">
                  Service
                </th>
                <th scope="col" className="px-4 py-3 font-normal">
                  Responsibility
                </th>
                <th scope="col" className="px-4 py-3 font-normal">
                  Fails as
                </th>
                <th scope="col" className="px-4 py-3 font-normal">
                  Contained by
                </th>
              </tr>
            </thead>
            <tbody>
              {BLAST_RADIUS.map((row) => (
                <tr
                  key={row.service}
                  className="border-t border-[var(--ms-border-subtle)] align-top"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 text-xs font-semibold text-[var(--ms-text)] whitespace-nowrap"
                  >
                    {row.service}
                  </th>
                  <td className="px-4 py-3 font-mono text-[11px] text-[var(--ms-muted)]">
                    {row.responsibility}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--ms-text)] leading-relaxed">
                    {row.breaks}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--ms-muted)] leading-relaxed">
                    {row.containment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Vocabulary the learner should leave with */}
      <section className="space-y-4">
        <span className="font-mono text-xs text-[var(--ms-text)] uppercase tracking-wider">
          Vocabulary you leave with
        </span>
        <div className="flex flex-wrap gap-2">
          {VOCABULARY.map((term) => (
            <span
              key={term}
              className="px-2.5 py-1 rounded-full border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] font-mono text-[10px] text-[var(--ms-muted)]"
            >
              {term}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="p-10 rounded-2xl border border-[var(--ms-border)] bg-[var(--ms-surface-2)] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-display font-bold text-2xl text-[var(--ms-text)]">
            Start where failures hurt most
          </h3>
          <p className="text-xs text-[var(--ms-text)]">
            Trip a breaker, then roll a saga back, then read the trace.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/microservicesviz/learn"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[var(--ms-border)] bg-[var(--ms-surface)] font-mono text-xs text-[var(--ms-text)] hover:border-[var(--ms-primary)] transition-all whitespace-nowrap"
          >
            <Activity className="w-3.5 h-3.5 text-[var(--ms-muted)]" />
            Browse the domains
          </Link>
          <Link
            href="/microservicesviz/circuit-lab"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--ms-primary)] text-white font-semibold text-xs hover:bg-[var(--ms-primary-hover)] transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Open Circuit Breaker Lab
          </Link>
        </div>
      </div>
    </div>
  );
}
