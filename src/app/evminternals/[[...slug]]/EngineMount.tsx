'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which meant every evminternals route
// pre-rendered as an empty ~9.6 KB shell with no heading and no content. The
// reason was render-path browser access in this engine's theme handling, now
// removed: `context/ThemeContext.tsx` reads the shared resolved theme instead of
// `localStorage`/`matchMedia`/`document`. With that gone the components are
// server-renderable, so they are imported normally and their content reaches the
// static HTML. The tree is still fully client-side and interactive: stepping,
// undo, bytecode entry and the framer-motion animations are untouched.
import Home from '@/components/visualizers/evminternals/pages/Home';
import Learn from '@/components/visualizers/evminternals/pages/Learn';
import TopicPage from '@/components/visualizers/evminternals/pages/TopicPage';
import Playground from '@/components/visualizers/evminternals/pages/Playground';


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
    <RouteProvider basePath="/evminternals" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
