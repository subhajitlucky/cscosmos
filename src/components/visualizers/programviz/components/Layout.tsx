'use client';

import React from 'react';
import { MotionConfig } from 'framer-motion';
import { TopicActionBar } from '@/components/learning/TopicActionBar';
import { TopicNotes } from '@/components/learning/TopicNotes';
import { RelatedTopics } from '@/components/learning/RelatedTopics';
import { TopicComments } from '@/components/learning/TopicComments';
import { TOPIC_BASE_PATH, TOPIC_DOMAIN, TOPIC_NAME, TOPIC_SLUG } from '../data/topic';
import { Navbar } from './Navbar';
import { usePathname } from 'next/navigation';

export interface LayoutProps {
  children: React.ReactNode;
  isHome?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isHome: isHomeProp }) => {
  const pathname = usePathname();

  const isHome =
    isHomeProp ??
    (!pathname ||
      pathname === TOPIC_BASE_PATH ||
      pathname === `${TOPIC_BASE_PATH}/` ||
      pathname === '/program-cosmos' ||
      pathname === '/program-cosmos/');

  const isSecondaryPage =
    isHome ||
    pathname?.endsWith('/concepts') ||
    pathname?.endsWith('/lab') ||
    pathname?.endsWith('/playground') ||
    pathname?.endsWith('/simulation') ||
    pathname?.endsWith('/problems');

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col transition-colors duration-300 bg-background text-foreground">
        {/* Top Sticky Navbar across all pages */}
        <Navbar />

        {/* Main Content Area - Full width, clean, centered, NO persistent sidebar */}
        <main className="flex-1 w-full min-w-0">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10 space-y-8">
            <TopicActionBar slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} />
            {children}
            {!isSecondaryPage && (
              <div className="mt-12 space-y-4 pt-8 border-t border-border/80">
                <TopicNotes slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} />
                <RelatedTopics slug={TOPIC_SLUG} domain={TOPIC_DOMAIN} />
                <TopicComments slug={TOPIC_SLUG} />
              </div>
            )}
          </div>
        </main>
      </div>
    </MotionConfig>
  );
};
