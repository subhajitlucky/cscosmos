'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Box, BookOpen, Cpu, Layers, Menu, ShieldCheck, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { lldTopicGroups, lldTopics } from '../data/topics';

/**
 * LLD::COSMOS navigation is organised the way the subject is: modules are
 * grouped by the *responsibility* they hold (study / labs / method), and the
 * ledger strip underneath classifies the route you are on in the engine's own
 * vocabulary — which design track it belongs to, how hard it is, and how many
 * refactoring steps and pitfalls the topic carries.
 */
const NAV_GROUPS = [
  {
    id: 'study',
    caption: 'Study',
    entries: [
      {
        label: 'Concept Map',
        href: '/lldcosmos/learn',
        icon: BookOpen,
        role: `${lldTopicGroups.length} tracks`,
      },
    ],
  },
  {
    id: 'labs',
    caption: 'Refactoring labs',
    entries: [
      {
        label: 'SOLID Lab',
        href: '/lldcosmos/solid-lab',
        icon: ShieldCheck,
        role: 'violation ↔ refactor',
      },
      {
        label: 'GoF Patterns Lab',
        href: '/lldcosmos/patterns-lab',
        icon: Cpu,
        role: 'strategy · decorator · observer',
      },
    ],
  },
  {
    id: 'method',
    caption: 'Method',
    entries: [
      {
        label: 'Design Notes',
        href: '/lldcosmos/about',
        icon: Layers,
        role: 'pedagogy & responsibilities',
      },
    ],
  },
];

interface RouteLedger {
  scope: string;
  label: string;
  detail: string;
}

function classifyRoute(pathname: string | null): RouteLedger {
  const path = (pathname ?? '').replace(/^\/lldcosmos/, '') || '/';

  if (path.startsWith('/learn/')) {
    const topic = lldTopics.find((t) => `/learn/${t.id}` === path);
    if (topic) {
      return {
        scope: 'TOPIC',
        label: topic.group,
        detail: `${topic.difficulty} · ${topic.steps.length} steps · ${topic.mistakes.length} pitfalls`,
      };
    }
  }

  switch (path) {
    case '/learn':
      return {
        scope: 'CURRICULUM',
        label: `${lldTopicGroups.length} tracks · ${lldTopics.length} topics`,
        detail: 'principles → creational → structural → behavioral → case study',
      };
    case '/solid-lab':
      return {
        scope: 'REFACTORING',
        label: 'violation ↔ clean code',
        detail: 'five SOLID principles, side by side',
      };
    case '/patterns-lab':
      return {
        scope: 'PATTERNS',
        label: 'strategy · decorator · observer',
        detail: 'patterns executed, not narrated',
      };
    case '/about':
      return {
        scope: 'DESIGN NOTES',
        label: 'method & pedagogy',
        detail: "responsibility cards for this studio's own modules",
      };
    default:
      return {
        scope: 'INDEX',
        label: 'responsibility overview',
        detail: 'elevator simulator · SOLID matrix · curriculum ladder',
      };
  }
}

function isEntryActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const ledger = classifyRoute(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--lld-border-subtle)] bg-[var(--lld-bg-80)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono text-[var(--lld-muted)] hover:text-[var(--lld-primary-text)] border border-transparent hover:border-[var(--lld-border)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
          </Link>

          <Link href="/lldcosmos" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--lld-primary-10)] border border-[var(--lld-primary-30)] flex items-center justify-center text-[var(--lld-primary-text)] group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.25)]">
              <Box className="w-4 h-4 text-[var(--lld-primary-text)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight text-[var(--lld-text)] flex items-center gap-1">
                LLD<span className="text-[var(--lld-primary-text)] font-mono">::COSMOS</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--lld-muted)] tracking-wider uppercase -mt-1">
                SOLID Principles &bull; Design Patterns &bull; Clean Architecture
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav: caption-per-responsibility, one row of entries each */}
        <nav className="hidden lg:flex items-center gap-4" aria-label="LLD modules">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={group.id} className="flex items-center gap-4">
              {groupIdx > 0 && (
                <span className="w-px h-7 bg-[var(--lld-border-subtle)]" aria-hidden="true" />
              )}
              <div className="flex flex-col gap-0.5">
                <span className="text-[8px] font-mono uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                  {group.caption}
                </span>
                <div className="flex items-center gap-1">
                  {group.entries.map((entry) => {
                    const Icon = entry.icon;
                    const active = isEntryActive(pathname, entry.href);
                    return (
                      <Link
                        key={entry.href}
                        href={entry.href}
                        aria-current={active ? 'page' : undefined}
                        title={`${entry.label} — ${entry.role}`}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                          active
                            ? 'bg-[var(--lld-primary-10)] text-[var(--lld-primary-text)] border border-[var(--lld-border)]'
                            : 'text-[var(--lld-muted)] hover:text-[var(--lld-text)] hover:bg-[var(--lld-surface)]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {entry.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg border border-[var(--lld-border-subtle)] text-[var(--lld-muted)] hover:text-[var(--lld-text)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsibility ledger: classifies the current route in design vocabulary */}
      <div className="hidden lg:block border-t border-[var(--lld-border-subtle)] bg-[var(--lld-surface)]">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center gap-3 font-mono text-[10px]">
          <span className="uppercase tracking-[0.18em] text-[var(--lld-muted)]">
            Responsibility
          </span>
          <span className="px-1.5 py-0.5 rounded border border-[var(--lld-border)] text-[var(--lld-primary-text)] font-bold">
            {ledger.scope}
          </span>
          <span className="text-[var(--lld-text)]">{ledger.label}</span>
          <span
            aria-hidden="true"
            className="flex-1 border-t border-dashed border-[var(--lld-border-subtle)]"
          />
          <span className="text-[var(--lld-muted)] truncate">{ledger.detail}</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-b border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] px-6 py-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] pb-3 border-b border-[var(--lld-border-subtle)]">
            <span className="px-1.5 py-0.5 rounded border border-[var(--lld-border)] text-[var(--lld-primary-text)] font-bold">
              {ledger.scope}
            </span>
            <span className="text-[var(--lld-text)]">{ledger.label}</span>
            <span className="w-full text-[var(--lld-muted)]">{ledger.detail}</span>
          </div>

          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="space-y-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.18em] text-[var(--lld-muted)]">
                {group.caption}
              </span>
              {group.entries.map((entry) => {
                const Icon = entry.icon;
                const active = isEntryActive(pathname, entry.href);
                return (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded text-sm ${
                      active
                        ? 'bg-[var(--lld-primary-10)] text-[var(--lld-primary-text)]'
                        : 'text-[var(--lld-muted)] hover:text-[var(--lld-primary-text)] hover:bg-[var(--lld-surface-2)]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      {entry.label}
                    </span>
                    <span className="font-mono text-[10px] text-[var(--lld-muted)]">
                      {entry.role}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
