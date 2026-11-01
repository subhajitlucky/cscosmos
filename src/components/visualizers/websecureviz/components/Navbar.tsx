'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme as useCSCosmosTheme } from '@/context/useTheme';
import {
  ShieldAlert,
  Globe,
  BookOpen,
  FlaskConical,
  CheckSquare,
  Moon,
  Sun,
  ArrowLeft,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ENGINE_BASE_PATH, TOPIC_BASE_PATH } from '../data/topic';
import { securityTopics } from '../data/topics';

const NAV_ITEMS = [
  {
    href: TOPIC_BASE_PATH,
    match: ENGINE_BASE_PATH,
    label: 'Overview',
    icon: Globe,
  },
  {
    href: `${TOPIC_BASE_PATH}/concepts`,
    match: `${ENGINE_BASE_PATH}/concepts`,
    label: 'Concepts (8)',
    icon: BookOpen,
  },
  {
    href: `${TOPIC_BASE_PATH}/lab`,
    match: `${ENGINE_BASE_PATH}/lab`,
    label: 'Security Lab',
    icon: FlaskConical,
  },
  {
    href: `${TOPIC_BASE_PATH}/problems`,
    match: `${ENGINE_BASE_PATH}/problems`,
    label: 'Practice Arena (52 Qs)',
    icon: CheckSquare,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useCSCosmosTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [topicsDropdownOpen, setTopicsDropdownOpen] = useState(false);

  // Normalise so active states work whether URL is canonical (/fullstack/websecurity) or rewritten (/websecurity)
  const normalizedPath = pathname.replace(TOPIC_BASE_PATH, ENGINE_BASE_PATH);

  useEffect(() => {
    setMenuOpen(false);
    setTopicsDropdownOpen(false);
  }, [pathname]);

  const isActive = (match: string) => {
    if (match === ENGINE_BASE_PATH) {
      return normalizedPath === match;
    }
    if (match === `${ENGINE_BASE_PATH}/concepts`) {
      return (
        normalizedPath === match ||
        normalizedPath.startsWith(`${ENGINE_BASE_PATH}/topics`) ||
        normalizedPath === `${ENGINE_BASE_PATH}/browser-security` ||
        normalizedPath === `${ENGINE_BASE_PATH}/cors` ||
        normalizedPath === `${ENGINE_BASE_PATH}/xss` ||
        normalizedPath === `${ENGINE_BASE_PATH}/csrf` ||
        normalizedPath === `${ENGINE_BASE_PATH}/csp`
      );
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
            <span className="rounded-lg border border-border bg-foreground text-background p-1.5 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </span>
            <span className="text-foreground">WebSecurity</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.match);

            if (item.match === `${ENGINE_BASE_PATH}/concepts`) {
              return (
                <div key={item.href} className="relative flex items-center">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-1.5 rounded-l-lg px-3 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      active
                        ? 'bg-foreground text-background shadow-xs'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setTopicsDropdownOpen((prev) => !prev)}
                    onBlur={() => setTimeout(() => setTopicsDropdownOpen(false), 200)}
                    aria-label="Open topics dropdown"
                    className={cn(
                      'flex items-center justify-center rounded-r-lg px-1.5 py-2 text-xs transition-all border-l',
                      active
                        ? 'bg-foreground text-background border-background/20'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border-border/40'
                    )}
                  >
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  </button>

                  {topicsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-72 rounded-xl border border-border bg-popover p-1.5 shadow-xl z-50">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        Security Modules
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-0.5">
                        {securityTopics.map((t, idx) => (
                          <Link
                            key={t.id}
                            href={`${TOPIC_BASE_PATH}/topics/${t.id}`}
                            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-popover-foreground hover:bg-muted transition-colors"
                            onClick={() => setTopicsDropdownOpen(false)}
                          >
                            <span className="truncate pr-2">
                              {idx + 1}. {t.name}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                              {t.estimatedTime}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  active
                    ? 'bg-foreground text-background shadow-xs'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="rounded-lg border border-border bg-muted/50 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-foreground" />
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
            aria-controls="websecurity-mobile-nav"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <nav
          id="websecurity-mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background px-4 py-3 md:hidden space-y-1"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Main Navigation
            </div>
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
                      ? 'bg-foreground text-background font-semibold'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground border-t border-border">
              Modules
            </div>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
              {securityTopics.map((t, idx) => (
                <Link
                  key={t.id}
                  href={`${TOPIC_BASE_PATH}/topics/${t.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {idx + 1}. {t.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
