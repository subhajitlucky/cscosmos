'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Database } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import '../styles.css';

const NAV = [
  { label: 'Contents', segment: '/learn', index: '01' },
  { label: 'Workbench', segment: '/lab', index: '02' },
  { label: 'Drills', segment: '/problems', index: '03' },
] as const;

export function useDBMSBasePath(): string {
  const pathname = usePathname() || '';
  return pathname.startsWith('/corecs/dbms') ? '/corecs/dbms' : '/dbms';
}

export function DBMSShell({ children }: { children: React.ReactNode }) {
  const basePath = useDBMSBasePath();
  const pathname = usePathname() || '';

  const isActive = (segment: string) => pathname.includes(segment);

  return (
    <div className="dbmsviz-root flex min-h-screen flex-col">
      <header
        className="sticky top-0 z-40 border-b"
        style={{ borderColor: 'var(--db-border)', backgroundColor: 'var(--db-bg)' }}
      >
        <div className="mx-auto flex w-full max-w-[1240px] items-stretch justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-stretch gap-5 sm:gap-8">
            <Link
              href={basePath}
              className="flex shrink-0 items-center gap-3 py-3"
              aria-label="DB Cosmos home"
            >
              <span
                className="flex h-9 w-9 items-center justify-center border"
                style={{ borderColor: 'var(--db-text)', color: 'var(--db-text)' }}
              >
                <Database className="h-4 w-4" strokeWidth={1.6} />
              </span>
              <span className="leading-none">
                <span className="db-mono block text-[13px] font-bold tracking-[0.08em]">DB//COSMOS</span>
                <span
                  className="db-kicker mt-1 block text-[8px]"
                  style={{ color: 'var(--db-muted)' }}
                >
                  Database systems · Field manual
                </span>
              </span>
            </Link>

            <nav className="hidden items-stretch gap-0 md:flex" aria-label="DBMS sections">
              {NAV.map((item) => {
                const active = isActive(item.segment);
                return (
                  <Link
                    key={item.label}
                    href={`${basePath}${item.segment}`}
                    className="group relative flex items-center gap-2 px-4 text-[12px] font-semibold"
                    style={{ color: active ? 'var(--db-text)' : 'var(--db-muted)' }}
                  >
                    <span className="db-mono text-[9px] font-bold" style={{ color: active ? 'var(--db-primary)' : 'var(--db-border-strong)' }}>
                      {item.index}
                    </span>
                    {item.label}
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px]"
                      style={{ backgroundColor: active ? 'var(--db-primary)' : 'transparent' }}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/topics"
              className="db-kicker hidden items-center gap-1.5 text-[9px] sm:inline-flex"
              style={{ color: 'var(--db-muted)' }}
            >
              All topics <ArrowUpRight className="h-3 w-3" />
            </Link>
            <span className="hidden h-5 w-px sm:block" style={{ backgroundColor: 'var(--db-border)' }} />
            <ThemeToggle />
          </div>
        </div>

        <nav
          className="flex items-center gap-5 border-t px-4 py-2 md:hidden"
          style={{ borderColor: 'var(--db-border)' }}
          aria-label="DBMS sections"
        >
          {NAV.map((item) => {
            const active = isActive(item.segment);
            return (
              <Link
                key={item.label}
                href={`${basePath}${item.segment}`}
                className="db-label inline-flex items-center gap-1.5 text-[9px]"
                style={{ color: active ? 'var(--db-primary)' : 'var(--db-muted)' }}
              >
                {item.index} {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t" style={{ borderColor: 'var(--db-border)' }}>
        <div className="mx-auto grid w-full max-w-[1240px] gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="db-mono text-[11px] font-bold tracking-[0.08em]">DB//COSMOS</p>
            <p className="mt-2 max-w-md text-xs leading-relaxed" style={{ color: 'var(--db-muted)' }}>
              A field manual for database systems: model the domain, normalize the facts, query the
              relations, and protect the result.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="db-kicker text-[8px]" style={{ color: 'var(--db-muted)' }}>
              Edition 2026 · 32 chapters
            </span>
            <Link href="/topics" className="db-label text-[9px]" style={{ color: 'var(--db-primary)' }}>
              Topic catalog
            </Link>
            <Link href="/interview" className="db-label text-[9px]" style={{ color: 'var(--db-primary)' }}>
              Interview prep
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
