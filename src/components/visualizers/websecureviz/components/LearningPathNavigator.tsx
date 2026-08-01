'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { learningPath } from '../data/learningPath';
import { CheckCircle2, Circle, Menu, X, ArrowLeft, Shield } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { useState } from 'react';
import { useProgress } from '../hooks/useProgress';

export function LearningPathNavigator() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { completedSteps } = useProgress();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleOpen} className="bg-card text-foreground border-border shadow-md">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card text-card-foreground border-r border-border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transform transition-transform duration-200 ease-in-out md:translate-x-0 shadow-2xl transition-colors duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border dark:border-slate-800 flex items-center justify-between bg-muted/40 dark:bg-slate-950/50">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-extrabold tracking-tight text-foreground dark:text-white">WebSecureViz</h2>
              </div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-300/90 mt-1">Interactive Security Learning</p>
            </div>
            <Link 
              href="/topics" 
              className="text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 bg-muted hover:bg-muted/80 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white px-2.5 py-1 rounded-md transition-colors"
              title="Return to CSCosmos Catalog"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              <Link
                href="/websecurity"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all",
                  pathname === "/websecurity" 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                <span>Home Overview</span>
              </Link>

              <div className="my-5 px-3 text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-widest">
                Learning Path
              </div>

              {learningPath.steps.map((step) => {
                const isActive = pathname === step.path;
                const isCompleted = completedSteps.includes(step.step);

                return (
                  <Link
                    key={step.step}
                    href={step.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-all group",
                      isActive
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-emerald-500 dark:text-emerald-400")} />
                    ) : (
                      <Circle className={cn("h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100", isActive && "opacity-100")} />
                    )}
                    <span className="truncate">{step.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-border dark:border-slate-800 text-xs text-muted-foreground dark:text-slate-400 text-center font-medium bg-muted/30 dark:bg-slate-950/40">
            Web Security Visualizer
          </div>
        </div>
      </div>
    </>
  );
}
