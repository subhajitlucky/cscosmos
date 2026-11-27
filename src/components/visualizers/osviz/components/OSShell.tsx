'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BookOpen, Code2, Cpu, FlaskConical, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import '../styles.css';

const NAV = [
  { label: 'Overview', segment: '', icon: Home },
  { label: 'Learn', segment: '/learn', icon: BookOpen },
  { label: 'Lab', segment: '/lab', icon: FlaskConical },
  { label: 'Problems', segment: '/problems', icon: Code2 },
] as const;

export function useOSBasePath(): string {
  const pathname = usePathname() || '';
  return pathname.startsWith('/corecs/operating-systems')
    ? '/corecs/operating-systems'
    : '/operating-systems';
}

export function OSShell({ children }: { children: React.ReactNode }) {
  const basePath = useOSBasePath();
  const pathname = usePathname() || '';

  const isActive = (segment: string) => {
    if (segment === '') return pathname === basePath || pathname === '/operating-systems';
    return pathname.includes(segment);
  };

  return (
    <div className="osviz-root flex min-h-screen flex-col">
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{
          borderColor: 'var(--os-border)',
          backgroundColor: 'color-mix(in srgb, var(--os-bg) 88%, transparent)',
        }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/topics"
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ borderColor: 'var(--os-border)', color: 'var(--os-muted)' }}
              title="Back to CSCosmos catalog"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CSCosmos</span>
            </Link>

            <Link href={basePath} className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  borderColor: 'var(--os-primary)',
                  color: 'var(--os-primary)',
                  backgroundColor: 'var(--os-primary-soft)',
                }}
              >
                <Cpu className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block font-mono text-sm font-bold tracking-tight">OS // COSMOS</span>
                <span
                  className="block font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ color: 'var(--os-muted)' }}
                >
                  kernel workbench
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <nav
              className="flex items-center gap-1 rounded-lg border p-1"
              style={{ borderColor: 'var(--os-border)', backgroundColor: 'var(--os-surface)' }}
            >
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.segment);
                return (
                  <Link
                    key={item.label}
                    href={`${basePath}${item.segment}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
                    style={{
                      color: active ? 'var(--os-primary)' : 'var(--os-muted)',
                      backgroundColor: active ? 'var(--os-primary-soft)' : 'transparent',
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t px-4 py-6 sm:px-6" style={{ borderColor: 'var(--os-border)' }}>
        <div
          className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ color: 'var(--os-muted)' }}
        >
          <p>OS // Cosmos — processes, memory, I/O, and files.</p>
          <div className="flex items-center gap-4">
            <Link href="/topics" className="osviz-link">
              Topic catalog
            </Link>
            <Link href="/interview" className="osviz-link">
              Interview prep
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
