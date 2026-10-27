'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  GitPullRequest,
  Layers,
  Menu,
  Network,
  ShieldAlert,
  X,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { microserviceTopicGroups, microserviceTopics } from '../data/topics';

/**
 * MICROSERVICES::VIZ navigation reads as the incident lifecycle it teaches:
 * map the boundaries, contain the failure, recover with compensation, model
 * the failure. The routes are rendered as hops in a mesh, and the header keeps
 * a live trace chip showing which hop you are on and what that hop owns.
 */
const MESH_ROUTES = [
  {
    href: '/microservicesviz/learn',
    label: 'Domain Map',
    short: 'Domain Map',
    phase: 'MAP',
    detail: `${microserviceTopicGroups.length} domains, boundaries first`,
    icon: BookOpen,
  },
  {
    href: '/microservicesviz/circuit-lab',
    label: 'Circuit Breaker Lab',
    short: 'Circuit Lab',
    phase: 'CONTAIN',
    detail: '3 breaker states, sliding failure window',
    icon: ShieldAlert,
  },
  {
    href: '/microservicesviz/saga-lab',
    label: 'Saga Pattern Lab',
    short: 'Saga Lab',
    phase: 'RECOVER',
    detail: '4 steps forward, compensated in reverse',
    icon: GitPullRequest,
  },
  {
    href: '/microservicesviz/about',
    label: 'Reliability Notes',
    short: 'Notes',
    phase: 'MODEL',
    detail: 'how this engine teaches failure',
    icon: Layers,
  },
];

interface TraceLedger {
  scope: string;
  label: string;
  detail: string;
}

function classifyRoute(pathname: string | null): TraceLedger {
  const path = (pathname ?? '').replace(/^\/microservicesviz/, '') || '/';

  if (path.startsWith('/learn/')) {
    const topic = microserviceTopics.find((t) => `/learn/${t.id}` === path);
    if (topic) {
      return {
        scope: 'DOMAIN',
        label: topic.group,
        detail: `${topic.difficulty} · ${topic.steps.length} moves · ${topic.mistakes.length} failure modes`,
      };
    }
  }

  switch (path) {
    case '/learn':
      return {
        scope: 'BOUNDARIES',
        label: `${microserviceTopicGroups.length} domains`,
        detail: 'decomposition → resilience → sagas → tracing → mesh',
      };
    case '/circuit-lab':
      return {
        scope: 'CONTAINMENT',
        label: 'CLOSED → OPEN → HALF_OPEN',
        detail: '3 failures in a 5-call window trip the breaker for 5s',
      };
    case '/saga-lab':
      return {
        scope: 'RECOVERY',
        label: 'forward → compensate',
        detail: '4 saga steps rolled back in reverse order',
      };
    case '/about':
      return {
        scope: 'FAILURE MODEL',
        label: 'how failure is taught here',
        detail: 'drills, blast radius, containment',
      };
    default:
      return {
        scope: 'TOPOLOGY',
        label: '4-service mesh',
        detail: 'inject latency or a 500 and watch the circuits react',
      };
  }
}

function isRouteActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const ledger = classifyRoute(pathname);

  const hops = (pathname ?? '').split('/').filter(Boolean).slice(1);
  const tracePath = `mesh:/${hops.length > 0 ? hops.join('/') : 'microservicesviz'}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--ms-border-subtle)] bg-[var(--ms-bg-80)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Left branding */}
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--ms-muted)] hover:text-[var(--ms-primary)] border border-transparent hover:border-[var(--ms-border)] transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>

          <Link href="/microservicesviz" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--ms-primary-10)] border border-[var(--ms-primary-30)] flex items-center justify-center text-[var(--ms-primary)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(139,92,246,0.25)]">
              <Network className="w-4 h-4 text-[var(--ms-primary)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--ms-text)] flex items-center gap-1">
                MICROSERVICES<span className="text-[var(--ms-primary)] font-mono">::VIZ</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--ms-muted)] tracking-wider uppercase -mt-1">
                Failure-first distributed systems
              </span>
            </div>
          </Link>
        </div>

        {/* Mesh hops: each route is a node in the incident lifecycle chain */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Mesh routes">
          {MESH_ROUTES.map((route, index) => {
            const active = isRouteActive(pathname, route.href);
            return (
              <React.Fragment key={route.href}>
                {index > 0 && (
                  <ChevronRight
                    className="w-3 h-3 text-[var(--ms-muted)] shrink-0"
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={route.href}
                  aria-current={active ? 'page' : undefined}
                  title={`${route.phase} — ${route.label}: ${route.detail}`}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-[11px] whitespace-nowrap transition-all ${
                    active
                      ? 'border-[var(--ms-border)] bg-[var(--ms-primary-10)] text-[var(--ms-text)] font-bold'
                      : 'border-[var(--ms-border-subtle)] text-[var(--ms-muted)] hover:text-[var(--ms-text)] hover:border-[var(--ms-border)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      active
                        ? 'bg-[var(--ms-primary)] animate-pulse'
                        : 'bg-[var(--ms-border)]'
                    }`}
                  />
                  {active && (
                    <span className="text-[8px] uppercase tracking-[0.18em] opacity-80">
                      {route.phase}
                    </span>
                  )}
                  {active ? route.label : route.short}
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Actions + live trace span for the current hop */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] font-mono text-[10px] max-w-[19rem]">
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full bg-[var(--ms-primary)] animate-pulse shrink-0"
            />
            <span className="text-[var(--ms-muted)] shrink-0">trace</span>
            <span className="text-[var(--ms-text)] truncate">{tracePath}</span>
            <span className="text-[var(--ms-muted)] shrink-0">·</span>
            <span className="text-[var(--ms-muted)] shrink-0">{ledger.scope}</span>
          </div>

          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg border border-[var(--ms-border-subtle)] text-[var(--ms-muted)] hover:text-[var(--ms-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet drawer: the same hop chain with its lifecycle phases */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] px-6 py-4 space-y-4">
          <div className="space-y-1.5 pb-3 border-b border-[var(--ms-border-subtle)] font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-[var(--ms-primary)] animate-pulse shrink-0"
              />
              <span className="text-[var(--ms-muted)]">trace</span>
              <span className="text-[var(--ms-text)] truncate">{tracePath}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-1.5 py-0.5 rounded border border-[var(--ms-border)] text-[var(--ms-text)] font-bold">
                {ledger.scope}
              </span>
              <span className="text-[var(--ms-text)]">{ledger.label}</span>
            </div>
            <p className="text-[var(--ms-muted)]">{ledger.detail}</p>
          </div>

          {MESH_ROUTES.map((route) => {
            const Icon = route.icon;
            const active = isRouteActive(pathname, route.href);
            return (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-start justify-between gap-3 px-3 py-2 rounded border ${
                  active
                    ? 'border-[var(--ms-border)] bg-[var(--ms-primary-10)]'
                    : 'border-transparent hover:border-[var(--ms-border-subtle)] hover:bg-[var(--ms-surface-2)]'
                }`}
              >
                <span className="flex items-start gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 mt-0.5 shrink-0 ${
                      active ? 'text-[var(--ms-primary)]' : 'text-[var(--ms-muted)]'
                    }`}
                  />
                  <span className="min-w-0">
                    <span className="block text-[9px] font-mono uppercase tracking-[0.18em] text-[var(--ms-muted)]">
                      {route.phase}
                    </span>
                    <span
                      className={`block text-sm ${
                        active ? 'text-[var(--ms-text)] font-semibold' : 'text-[var(--ms-muted)]'
                      }`}
                    >
                      {route.label}
                    </span>
                    <span className="block font-mono text-[10px] text-[var(--ms-muted)]">
                      {route.detail}
                    </span>
                  </span>
                </span>
                <ChevronRight
                  className={`w-4 h-4 mt-1 shrink-0 ${
                    active ? 'text-[var(--ms-primary)]' : 'text-[var(--ms-muted)]'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
