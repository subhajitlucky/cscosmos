'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

const Home = dynamic(() => import('@/components/visualizers/threatmodelviz/pages/Home'), { ssr: false });
const Learn = dynamic(() => import('@/components/visualizers/threatmodelviz/pages/Learn'), { ssr: false });
const TopicPage = dynamic(() => import('@/components/visualizers/threatmodelviz/pages/TopicPage'), { ssr: false });
const Playground = dynamic(() => import('@/components/visualizers/threatmodelviz/pages/Playground'), { ssr: false });

const BASE_PATH = '/security-engineering-threat-models';

export default function RouteClientShell({ slug }: { slug: string[] }) {
  const [first, second] = slug;

  let page = <Home />;
  if (first === 'learn') page = second ? <TopicPage /> : <Learn />;
  else if (first === 'playground' || first === 'lab') page = <Playground />;
  else if (first) page = <TopicPage />; // direct /<lesson-id> links

  const topicId = first && first !== 'learn' && first !== 'playground' ? first : second;

  return (
    <RouteProvider basePath={BASE_PATH} params={{ topicId: topicId ?? '' }}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {page}
      </div>
    </RouteProvider>
  );
}