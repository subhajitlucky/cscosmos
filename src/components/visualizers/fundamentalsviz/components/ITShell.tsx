'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Layers3 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import '../styles.css';

const NAV = [
  { label: 'Atlas', segment: '', index: '01' },
  { label: 'Tracks', segment: '/learn', index: '02' },
  { label: 'Lab', segment: '/lab', index: '03' },
  { label: 'Drills', segment: '/problems', index: '04' },
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
    return pathname.includes(segment);
  };

  return (
    <div className="itviz-root flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-bg)' }}>
        <div className="mx-auto flex w-full max-w-[1240px] items-stretch justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-stretch gap-5 sm:gap-8">
            <Link href={basePath} className="flex shrink-0 items-center gap-3 py-3" aria-label="Fundamentals of IT home">
              <span className="flex h-9 w-9 items-center justify-center border" style={{ borderColor: 'var(--it-text)', color: 'var(--it-text)' }}>
                <Layers3 className="h-4 w-4" strokeWidth={1.7} />
              </span>
              <span className="leading-none">
                <span className="it-mono block text-[13px] font-bold tracking-[0.08em]">IT//ATLAS</span>
                <span className="it-kicker mt-1 block text-[8px]" style={{ color: 'var(--it-muted)' }}>
                  Fundamentals of IT · Systems atlas
                </span>
              </span>
            </Link>

            <nav className="hidden items-stretch gap-0 md:flex" aria-label="Fundamentals of IT sections">
              {NAV.map((item) => {
                const active = isActive(item.segment);
                return (
                  <Link
                    key={item.label}
                    href={`${basePath}${item.segment}`}
                    className="relative flex items-center gap-2 px-4 text-[12px] font-semibold"
                    style={{ color: active ? 'var(--it-text)' : 'var(--it-muted)' }}
                  >
                    <span className="it-mono text-[9px] font-bold" style={{ color: active ? 'var(--it-primary)' : 'var(--it-border-strong)' }}>
                      {item.index}
                    </span>
                    {item.label}
                    <span className="absolute bottom-0 left-4 right-4 h-[2px]" style={{ backgroundColor: active ? 'var(--it-primary)' : 'transparent' }} />
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link href="/topics" className="it-kicker hidden items-center gap-1.5 text-[9px] sm:inline-flex" style={{ color: 'var(--it-muted)' }}>
              All topics <ArrowUpRight className="h-3 w-3" />
            </Link>
            <span className="hidden h-5 w-px sm:block" style={{ backgroundColor: 'var(--it-border)' }} />
            <ThemeToggle />
          </div>
        </div>

        <nav className="flex items-center gap-5 border-t px-4 py-2 md:hidden" style={{ borderColor: 'var(--it-border)' }} aria-label="Fundamentals of IT sections">
          {NAV.map((item) => {
            const active = isActive(item.segment);
            return (
              <Link
                key={item.label}
                href={`${basePath}${item.segment}`}
                className="it-label inline-flex items-center gap-1.5 text-[9px]"
                style={{ color: active ? 'var(--it-primary)' : 'var(--it-muted)' }}
              >
                {item.index} {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t" style={{ borderColor: 'var(--it-border)' }}>
        <div className="mx-auto grid w-full max-w-[1240px] gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="it-mono text-[11px] font-bold tracking-[0.08em]">IT//ATLAS</p>
            <p className="mt-2 max-w-md text-xs leading-relaxed" style={{ color: 'var(--it-muted)' }}>
              From bits to business: a field guide to the hardware, data, software, networks, and
              systems behind everyday technology.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="it-kicker text-[8px]" style={{ color: 'var(--it-muted)' }}>
              Edition 2026 · 24 chapters
            </span>
            <Link href="/topics" className="it-label text-[9px]" style={{ color: 'var(--it-primary)' }}>
              Topic catalog
            </Link>
            <Link href="/interview" className="it-label text-[9px]" style={{ color: 'var(--it-primary)' }}>
              Interview prep
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
