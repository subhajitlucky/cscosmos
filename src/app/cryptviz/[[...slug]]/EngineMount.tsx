'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which made all 37 cryptviz routes
// pre-render as an empty ~9.6 KB shell with no heading and no content. The
// blocker was render-path browser access in this engine's theme toggle, now an
// adapter over the shared provider, so the components are server-renderable and
// their content reaches the static HTML.
import Home from '@/components/visualizers/cryptviz/pages/Home';
import Learn from '@/components/visualizers/cryptviz/pages/Learn';
import TopicPage from '@/components/visualizers/cryptviz/pages/TopicPage';
import Playground from '@/components/visualizers/cryptviz/pages/Playground';


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
    <RouteProvider basePath="/cryptviz" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
