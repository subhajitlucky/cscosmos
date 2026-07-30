'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { learningPath } from '../data/learningPath';
import { CheckCircle2, Circle, Menu, X, ArrowLeft } from 'lucide-react';
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
        <Button variant="outline" size="icon" onClick={toggleOpen}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">WebSecureViz</h2>
              <p className="text-xs text-muted-foreground mt-1">Interactive Security Learning</p>
            </div>
            <Link href="/topics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              <Link
                href="/websecurity"
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === "/websecurity" 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <div className="w-4" />
                <span>Home</span>
              </Link>

              <div className="my-4 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-emerald-500")} />
                    ) : (
                      <Circle className={cn("h-4 w-4 shrink-0 opacity-40", isActive && "opacity-100")} />
                    )}
                    <span className="truncate">{step.title}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
