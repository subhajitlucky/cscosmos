'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { TopicLearningBar } from '@/components/learning/TopicLearningBar';
import { TOPIC_BASE_PATH, TOPIC_DOMAIN, TOPIC_DOMAIN_NAME, TOPIC_NAME, TOPIC_SLUG } from '../data/topic';
import { useTheme } from '../hooks/useTheme';
import { CheckCircle2, ChevronRight, Circle, Menu, ArrowLeft, Sun, Moon, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { isStepCompleted, resetProgress } = useProgress();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setIsSidebarOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const getFocusable = () =>
      Array.from(
        sidebar.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.offsetParent !== null);

    const focusable = getFocusable();
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const items = getFocusable();
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
  }, [isSidebarOpen]);

  return (
    <MotionConfig reducedMotion="user">
    <div className={cn(
      "min-h-[calc(100vh-4rem)] flex transition-colors duration-300",
      theme === 'dark' ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar for Desktop */}
      <aside
        ref={sidebarRef}
        role={isSidebarOpen ? 'dialog' : undefined}
        aria-modal={isSidebarOpen || undefined}
        aria-label="ProgramViz navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:bottom-auto lg:h-screen lg:translate-x-0",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href={TOPIC_BASE_PATH} className="text-xl font-bold flex items-center gap-2">
              <span className="bg-blue-600 p-1 rounded text-white text-xs font-mono">PV</span>
              ProgramViz
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={cn(
                  "p-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  theme === 'dark' ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-100 text-blue-600"
                )}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/topics" aria-label="Back to all topics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close navigation menu"
                className={cn(
                  "rounded-lg p-1.5 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  theme === 'dark' ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {steps.map((step) => {
              const isActive = pathname === step.path;
              const isCompleted = isStepCompleted(step.step);
              
              return (
                <Link
                  key={step.step}
                  href={step.path}
                  onClick={() => setIsSidebarOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isActive
                      ? "bg-blue-600 text-white"
                      : (theme === 'dark' ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-600")
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs opacity-70">Step {step.step}</span>
                    <span className="font-medium text-sm">{step.title}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all step progress for this topic?')) resetProgress();
            }}
            className={cn(
              "mt-4 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              theme === 'dark' ? "text-slate-500 hover:bg-slate-800 hover:text-slate-300" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            )}
          >
            Reset step progress
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className={cn(
          "h-14 border-b flex items-center justify-between px-6 lg:hidden",
          theme === 'dark' ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        )}>
          <button
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            className="rounded-lg p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">ProgramViz</span>
          <button onClick={toggleTheme} className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-12">
            <nav
              aria-label="Breadcrumb"
              className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link href="/" className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                CSCosmos
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <Link
                href={`/${TOPIC_DOMAIN}`}
                className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {TOPIC_DOMAIN_NAME}
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span aria-current="page" className="font-medium text-foreground">{TOPIC_NAME}</span>
            </nav>
            <TopicLearningBar slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} />
            {children}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
    </MotionConfig>
  );
};
