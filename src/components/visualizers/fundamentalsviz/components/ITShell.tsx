'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, BookOpen } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import '../styles.css';

const NAV = [
  { label: 'Study notes', segment: '/learn', index: '01' },
  { label: 'Practice', segment: '/problems', index: '02' },
  { label: 'Tools', segment: '/lab', index: '03' },
] as const;

export function useITBasePath(): string {
  const pathname = usePathname() || '';
  return pathname.startsWith('/corecs/fundamentals-of-it')
    ? '/corecs/fundamentals-of-it'
    : '/fundamentals-of-it';
}

export function ITShell({ children }: { children: React.ReactNode }) {
  const basePath = useITBasePath();
  const pathname = usePathname() || '';

  const isActive = (segment: string) => {
    if (segment === '') return pathname === basePath || pathname === '/fundamentals-of-it';
    if (segment === '/learn') {
      return pathname.includes('/learn') || pathname === basePath || pathname === '/fundamentals-of-it';
    }
    return pathname.includes(segment);
  };

  return (
    <div className="itviz-root flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-bg)' }}>
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-6">
            <Link href={basePath} className="flex shrink-0 items-center gap-2.5 py-3" aria-label="IT Fundamentals study notes">
              <span className="flex h-8 w-8 items-center justify-center border" style={{ borderColor: 'var(--it-primary)', color: 'var(--it-primary)' }}>
                <BookOpen className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="leading-tight">
                <span className="it-heading block text-[14px] tracking-[-0.02em]">IT Fundamentals</span>
                <span className="it-label block text-[10px]" style={{ color: 'var(--it-muted)' }}>Study notes</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Module sections">
              {NAV.map((item) => {
                const active = isActive(item.segment);
                return (
                  <Link
                    key={item.label}
                    href={`${basePath}${item.segment}`}
                    className="border-b-2 px-3 py-3 text-[12px] font-semibold"
                    style={{
                      borderColor: active ? 'var(--it-primary)' : 'transparent',
                      color: active ? 'var(--it-text)' : 'var(--it-muted)',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/topics" className="it-label hidden items-center gap-1 text-[10px] sm:inline-flex" style={{ color: 'var(--it-muted)' }}>
              All modules <ArrowUpRight className="h-3 w-3" />
            </Link>
            <span className="hidden h-5 w-px sm:block" style={{ backgroundColor: 'var(--it-border)' }} />
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex items-center gap-4 border-t px-4 py-2 md:hidden" style={{ borderColor: 'var(--it-border)' }} aria-label="Module sections">
          {NAV.map((item) => {
            const active = isActive(item.segment);
            return (
              <Link key={item.label} href={`${basePath}${item.segment}`} className="it-label text-[10px]" style={{ color: active ? 'var(--it-primary)' : 'var(--it-muted)' }}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t" style={{ borderColor: 'var(--it-border)' }}>
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-3 px-4 py-6 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:px-6" style={{ color: 'var(--it-muted)' }}>
          <p>IT Fundamentals · Computer organization, memory, number systems, Boolean algebra, microprocessors, software, and MS Office.</p>
          <div className="flex items-center gap-4">
            <Link href="/topics" className="it-link">All modules</Link>
            <Link href={`${basePath}/problems`} className="it-link">Practice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
