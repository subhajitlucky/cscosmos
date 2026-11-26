'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Binary, BookOpen, Code2, FlaskConical, Home } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import '../styles.css';

const NAV = [
  { label: 'Overview', segment: '', icon: Home },
  { label: 'Learn', segment: '/learn', icon: BookOpen },
  { label: 'Lab', segment: '/lab', icon: FlaskConical },
  { label: 'Problems', segment: '/problems', icon: Code2 },
] as const;

export function useCBasePath(): string {
  const pathname = usePathname() || '';
  return pathname.startsWith('/corecs/c-programming')
    ? '/corecs/c-programming'
    : '/c-programming';
}

export function CShell({ children }: { children: React.ReactNode }) {
  const basePath = useCBasePath();
  const pathname = usePathname() || '';

  const isActive = (segment: string) => {
    if (segment === '') {
      return pathname === basePath || pathname === '/c-programming';
    }
    return pathname.includes(segment);
  };

  return (
    <div className="cviz-root flex min-h-screen flex-col">
      <header
        className="sticky top-0 z-40 border-b backdrop-blur"
        style={{ borderColor: 'var(--c-border)', backgroundColor: 'color-mix(in srgb, var(--c-bg) 88%, transparent)' }}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/topics"
              className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold"
              style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
              title="Back to CSCosmos catalog"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">CSCosmos</span>
            </Link>

            <Link href={basePath} className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{
                  borderColor: 'var(--c-primary)',
                  color: 'var(--c-primary)',
                  backgroundColor: 'var(--c-primary-soft)',
                }}
              >
                <Binary className="h-4 w-4" />
              </span>
              <span className="leading-tight">
                <span className="block font-mono text-sm font-bold tracking-tight">C // COSMOS</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--c-muted)' }}>
                  memory workbench
                </span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <nav className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: 'var(--c-border)', backgroundColor: 'var(--c-surface)' }}>
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.segment);
                return (
                  <Link
                    key={item.label}
                    href={`${basePath}${item.segment}`}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
                    style={{
                      color: active ? 'var(--c-primary)' : 'var(--c-muted)',
                      backgroundColor: active ? 'var(--c-primary-soft)' : 'transparent',
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

      <footer className="border-t px-4 py-6 sm:px-6" style={{ borderColor: 'var(--c-border)' }}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between" style={{ color: 'var(--c-muted)' }}>
          <p>
            C // Cosmos — pointers, memory, and the C standard library.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/topics" className="cviz-link">
              Topic catalog
            </Link>
            <Link href="/interview" className="cviz-link">
              Interview prep
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
