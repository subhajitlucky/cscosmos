'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import { steps } from '../data/learningPath';
import { useProgress } from '../context/ProgressContext';
import { TopicActionBar } from '@/components/learning/TopicActionBar';
import { TopicNotes } from '@/components/learning/TopicNotes';
import { RelatedTopics } from '@/components/learning/RelatedTopics';
import { TopicComments } from '@/components/learning/TopicComments';
import { TOPIC_BASE_PATH, TOPIC_DOMAIN, TOPIC_NAME, TOPIC_SLUG } from '../data/topic';
import { CheckCircle2, Circle } from 'lucide-react';
import { Navbar } from './Navbar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LayoutProps {
  children: React.ReactNode;
  isHome?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isHome: isHomeProp }) => {
  const sidebarRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const { isStepCompleted, resetProgress } = useProgress();

  const isHome =
    isHomeProp ??
    (!pathname ||
      pathname === TOPIC_BASE_PATH ||
      pathname === `${TOPIC_BASE_PATH}/` ||
      pathname === '/program-cosmos' ||
      pathname === '/program-cosmos/');

  // Determine if on an individual step/lesson page
  const isStepPage = Boolean(
    pathname &&
    steps.some(
      (s) =>
        pathname === s.path ||
        pathname === `${s.path}/` ||
        pathname === s.path.replace(`${TOPIC_BASE_PATH}/`, '/program-cosmos/')
    )
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-background text-foreground">
        {/* Top Sticky Navbar across all pages */}
        <Navbar />

        {/* Content Area */}
        <div className="flex-1 flex w-full">
          {/* Step Sidebar for Desktop (ONLY displayed on individual lesson pages, NEVER on homepage, concepts, lab, problems) */}
          {isStepPage && (
            <aside
              ref={sidebarRef}
              aria-label="ProgramViz lessons navigation"
              className="hidden lg:block w-64 shrink-0 border-r border-border bg-card/60 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/80">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  10 Core Lessons
                </span>
                <Link
                  href={`${TOPIC_BASE_PATH}/concepts`}
                  className="text-[11px] font-semibold text-blue-500 hover:underline"
                >
                  Syllabus
                </Link>
              </div>

              <nav className="space-y-1">
                {steps.map((step) => {
                  const isActive = pathname === step.path;
                  const isCompleted = isStepCompleted(step.step);

                  return (
                    <Link
                      key={step.step}
                      href={step.path}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-emerald-500')} />
                      ) : (
                        <Circle className="w-4 h-4 shrink-0 opacity-50" />
                      )}
                      <span className="truncate">
                        {step.step}. {step.title}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all step progress for this topic?')) resetProgress();
                }}
                className="w-full text-left px-2 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Reset step progress
              </button>
            </aside>
          )}

          {/* Main Content Body */}
          <main className="flex-1 min-w-0">
            <div className={cn(
              'mx-auto p-4 sm:p-6 lg:p-10 space-y-8',
              isStepPage ? 'max-w-4xl' : 'max-w-6xl'
            )}>
              <TopicActionBar slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} />
              {children}
              {!isHome && isStepPage && (
                <div className="mt-12 space-y-4 pt-8 border-t border-border/80">
                  <TopicNotes slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} />
                  <RelatedTopics slug={TOPIC_SLUG} domain={TOPIC_DOMAIN} />
                  <TopicComments slug={TOPIC_SLUG} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
};
