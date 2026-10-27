'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which meant every solidityviz route
// pre-rendered as an empty ~9.6 KB shell with no heading and no content. The
// reason was render-path browser access in this engine's theme handling, now
// removed: `lib/theme.tsx` reads the shared resolved theme instead of
// `localStorage`/`matchMedia`/`document`, and `components/editor/CodeEditor.tsx`
// branches on that concrete theme. With those gone the components are
// server-renderable, so they are imported normally and their content reaches the
// static HTML. Everything below is still a client component tree: Monaco, the
// simulation worker (created inside a `useEffect`) and all interactivity work
// exactly as before.
import Home from '@/components/visualizers/solidityviz/pages/Home';
import Learn from '@/components/visualizers/solidityviz/pages/Learn';
import TopicPage from '@/components/visualizers/solidityviz/pages/TopicPage';
import Playground from '@/components/visualizers/solidityviz/pages/Playground';
import About from '@/components/visualizers/solidityviz/pages/About';

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
  } else if (first === 'about') {
    pageContent = <About />;
  } else if (first !== '') {
    pageContent = <TopicPage />;
  }

  const routeParams = {
    topicId: second || first,
    id: second || first,
    conceptId: second || first,
    slug: second || first
  };

  return (
    <RouteProvider basePath="/solidityviz" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
