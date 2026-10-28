'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme as useCSCosmosTheme } from '@/context/useTheme';
import { Globe, Map, Terminal, Moon, Sun, ArrowLeft, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINE_BASE_PATH, TOPIC_BASE_PATH } from '../data/topic';

const NAV_ITEMS = [
  {
    href: TOPIC_BASE_PATH,
    match: ENGINE_BASE_PATH,
    label: 'Overview',
    icon: Globe,
  },
  {
    href: `${TOPIC_BASE_PATH}/path`,
    match: `${ENGINE_BASE_PATH}/path`,
    label: 'Learning Path',
    icon: Map,
  },
  {
    href: `${TOPIC_BASE_PATH}/playground`,
    match: `${ENGINE_BASE_PATH}/playground`,
    label: 'HTTP Playground',
    icon: Terminal,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useCSCosmosTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // The engine can be reached through either the canonical URL or its engine
  // path. Normalise before comparing so active states survive both.
  const normalizedPath = pathname.replace(TOPIC_BASE_PATH, ENGINE_BASE_PATH);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (match: string) => {
    if (match === ENGINE_BASE_PATH) return normalizedPath === match;
    if (match === `${ENGINE_BASE_PATH}/path` && normalizedPath.startsWith(`${ENGINE_BASE_PATH}/topics`)) {
      return true;
    }
    return normalizedPath === match || normalizedPath.startsWith(`${match}/`);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Return to CSCosmos Catalog"
            aria-label="Back to CSCosmos catalog"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSCosmos</span>
          </Link>

          <Link
            href={TOPIC_BASE_PATH}
            className="flex items-center gap-2 text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-1.5 text-blue-500">
              <Globe className="w-5 h-5" />
            </span>
            <span className="text-blue-500">WebProtocols</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  active
                    ? 'border border-blue-500/20 bg-blue-500/10 font-bold text-blue-500'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg border border-border bg-muted/50 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-border bg-muted/50 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="webprotocols-mobile-nav"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="webprotocols-mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-4 py-3 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.match);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    active
                      ? 'bg-blue-500/10 text-blue-500'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
