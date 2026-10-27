'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which meant all 36 gitcosmos routes
// pre-rendered as an empty ~9.6 KB shell with no heading and no content. The
// reason was render-path browser access in this engine's theme handling, now
// removed: `context/ThemeProvider.jsx` reads the shared resolved theme, and
// `pages/ConceptPage.jsx` no longer sniffs `document` during render. With those
// gone the components are server-renderable, so they are imported normally and
// their content reaches the static HTML.
import Home from '@/components/visualizers/gitcosmos/pages/Home';
import Learn from '@/components/visualizers/gitcosmos/pages/ConceptMap';
import TopicPage from '@/components/visualizers/gitcosmos/pages/ConceptPage';
import Playground from '@/components/visualizers/gitcosmos/pages/Playground';


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
    <RouteProvider basePath="/gitcosmos" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
