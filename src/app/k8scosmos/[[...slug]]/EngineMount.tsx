'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These four pages were `dynamic(..., { ssr: false })`, which made all 117
// k8scosmos routes pre-render as an empty ~9.6 KB shell with no <h1>. Nothing on
// their render path reads a browser global, so they can be ordinary static
// imports and their content now reaches the static HTML.
import Home from '@/components/visualizers/k8scosmos/pages/HomePage';
import Learn from '@/components/visualizers/k8scosmos/pages/ConceptMapPage';
import TopicPage from '@/components/visualizers/k8scosmos/pages/ConceptPage';
import Playground from '@/components/visualizers/k8scosmos/pages/LabPage';


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
    <RouteProvider basePath="/k8scosmos" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
