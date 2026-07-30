'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { CheckCircle2, Circle, Menu, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const pathname = usePathname();
  const { isStepCompleted } = useProgress();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex transition-colors duration-300 bg-background text-foreground">
      {/* Sidebar for Desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 bg-card border-border/80",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-8">
            <Link href="/program-cosmos" className="text-xl font-bold flex items-center gap-2 text-foreground">
              <span className="bg-blue-600 p-1 rounded text-white text-xs font-mono">PV</span>
              ProgramViz
            </Link>
            <Link href="/topics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> CSCosmos
            </Link>
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
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "hover:bg-muted text-muted-foreground"
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
        <header className="h-14 border-b border-border/80 flex items-center justify-between px-6 lg:hidden bg-card">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold">ProgramViz</span>
          <Link href="/topics" className="text-xs text-primary font-medium">CSCosmos</Link>
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
        />
      )}
    </div>
  );
};
