'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which made all 53 ptopblockchain
// routes pre-render as an empty shell with no heading and no content. Nothing on
// the render path touches the browser: the engine's private theme module is now
// an adapter over the shared provider (and was only mounted by the unreachable
// `App.tsx` anyway), so the pages are imported normally and their markup reaches
// the static HTML.
import Home from '@/components/visualizers/ptopblockchain/pages/Home';
import Learn from '@/components/visualizers/ptopblockchain/pages/LearningPath';
import TopicPage from '@/components/visualizers/ptopblockchain/pages/TopicDetail';
import Playground from '@/components/visualizers/ptopblockchain/pages/Playground';


export default function EngineMount({ slug }: { slug: string[] }) {
  const first = slug[0] || '';
  const second = slug[1] || '';

  let pageContent = <Home />;

  if (first === 'learn' || first === 'concepts') {
    if (second) {
      pageContent = <TopicPage />;
    } else {
      pageContent = <Learn />;
    }
  } else if (first === 'topic' && second) {
    pageContent = <TopicPage />;
  } else if (first === 'playground' || first === 'lab') {
    pageContent = <Playground />;
  }  else if (first !== '') {
    pageContent = <TopicPage />;
  }

  const routeParams = {
    topicId: second || first,
    id: second || first,
    conceptId: second || first,
    slug: second || first
  };

  return (
    <RouteProvider basePath="/ptopblockchain" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
