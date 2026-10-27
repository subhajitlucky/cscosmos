'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These four pages were `dynamic(..., { ssr: false })`, which made all 105
// loadbalancing routes pre-render as an empty ~9.6 KB shell with no <h1>. Every
// browser global they touch is inside a useEffect or an event handler, so they
// can be ordinary static imports and their content now reaches the static HTML.
import Home from '@/components/visualizers/loadbalancing/pages/Home';
import Learn from '@/components/visualizers/loadbalancing/pages/Concepts';
import TopicPage from '@/components/visualizers/loadbalancing/pages/ConceptDetail';
import Playground from '@/components/visualizers/loadbalancing/pages/Lab';


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
    <RouteProvider basePath="/loadbalancing" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
