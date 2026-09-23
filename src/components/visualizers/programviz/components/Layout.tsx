'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../hooks/useTheme';
import { CheckCircle2, Circle, Menu, ArrowLeft, Sun, Moon, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const { isStepCompleted } = useProgress();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSidebarOpen]);

  return (
    <MotionConfig reducedMotion="user">
    <div className={cn(
      "min-h-[calc(100vh-4rem)] flex transition-colors duration-300",
      theme === 'dark' ? "bg-slate-950 text-slate-50" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar for Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/program-cosmos" className="text-xl font-bold flex items-center gap-2">
              <span className="bg-blue-600 p-1 rounded text-white text-xs font-mono">PV</span>
              ProgramViz
            </Link>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  theme === 'dark' ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-100 text-blue-600"
                )}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link href="/topics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className={cn(
          "h-14 border-b flex items-center justify-between px-6 lg:hidden",
          theme === 'dark' ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white"
        )}>
          <button onClick={() => setIsSidebarOpen(true)} aria-label="Open navigation menu" aria-expanded={isSidebarOpen}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">ProgramViz</span>
          <button onClick={toggleTheme} className="p-2" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 lg:p-12">
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

      {/* Mobile sidebar close button */}
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation menu"
          className={cn(
            "fixed top-4 right-4 z-50 p-2 rounded-lg lg:hidden",
            theme === 'dark' ? "bg-slate-900 text-slate-200" : "bg-white text-slate-700"
          )}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
    </MotionConfig>
  );
};
