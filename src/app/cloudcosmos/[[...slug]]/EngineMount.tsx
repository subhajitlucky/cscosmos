'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which made all 121 cloudcosmos
// routes pre-render as an empty ~9.6 KB shell with no heading and no content.
// The engine's private ThemeProvider (which reads `localStorage`) is only mounted
// by the unimported App.tsx, and Layout already uses the shared theme context, so
// the components are server-renderable and their content now reaches the static HTML.
import Home from '@/components/visualizers/cloudcosmos/pages/HomePage';
import Learn from '@/components/visualizers/cloudcosmos/pages/ConceptMapPage';
import TopicPage from '@/components/visualizers/cloudcosmos/pages/ConceptDetailPage';
import Playground from '@/components/visualizers/cloudcosmos/pages/CloudLabPage';


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
    <RouteProvider basePath="/cloudcosmos" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
