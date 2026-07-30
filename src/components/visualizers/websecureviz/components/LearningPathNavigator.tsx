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
        "fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-100 transform transition-transform duration-200 ease-in-out md:translate-x-0 shadow-2xl",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-extrabold tracking-tight text-white">WebSecureViz</h2>
              </div>
              <p className="text-xs font-semibold text-blue-300/90 mt-1">Interactive Security Learning</p>
            </div>
            <Link 
              href="/topics" 
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md transition-colors"
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
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <span>Home Overview</span>
              </Link>

              <div className="my-5 px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
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
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-emerald-400")} />
                    ) : (
                      <Circle className={cn("h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100", isActive && "opacity-100")} />
                    )}
                    <span className="truncate">{step.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 text-xs text-slate-400 text-center font-medium bg-slate-950/40">
            Web Security Visualizer
          </div>
        </div>
      </div>
    </>
  );
}
