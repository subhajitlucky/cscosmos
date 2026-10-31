'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckSquare, Cpu, FlaskConical, Menu, Moon, Sun, X } from 'lucide-react';
import { TOPIC_BASE_PATH } from '../data/topic';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { isStepCompleted } = useProgress();

  const navLinks = [
    { label: 'Concepts', href: `${TOPIC_BASE_PATH}/concepts`, icon: BookOpen },
    { label: 'Simulation Lab', href: `${TOPIC_BASE_PATH}/lab`, icon: FlaskConical },
    { label: 'Problems', href: `${TOPIC_BASE_PATH}/problems`, badge: '100 Qs', icon: CheckSquare },
  ];

  // Mobile menu focus trap and Escape handler for accessibility
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const drawer = mobileRef.current;
    if (!drawer) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);

    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        openButtonRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null);

      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Hub backlink & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/fullstack"
            aria-label="Back to Full Stack domain"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Full Stack</span>
          </Link>

          <Link
            href={TOPIC_BASE_PATH}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-xs transition-transform group-hover:scale-105">
              PC
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1">
                Program Cosmos
              </span>
              <span className="text-[10px] font-mono text-muted-foreground -mt-0.5 hidden xs:inline">
                How Programs Execute
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      'ml-1 px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full',
                      isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          <button
            ref={openButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Accessible Dialog for mobile navigation) */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={mobileRef}
            role="dialog"
            aria-modal="true"
            aria-label="ProgramViz navigation"
            className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-card border-l border-border p-6 shadow-2xl flex flex-col md:hidden animate-in slide-in-from-right duration-200"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-xs">
                  PC
                </div>
                <span className="font-bold text-sm text-foreground">Program Cosmos</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Main Sections
              </p>
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-blue-500/20 text-blue-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto pt-4 border-t border-border/80 space-y-1">
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                10 Core Lessons
              </p>
              {steps.map((step) => {
                const isActive = pathname === step.path;
                const completed = isStepCompleted(step.step);
                return (
                  <Link
                    key={step.step}
                    href={step.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-muted text-blue-500 font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                        completed ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {step.step}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-border/80">
              <Link
                href="/topics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                All CSCosmos Topics
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
