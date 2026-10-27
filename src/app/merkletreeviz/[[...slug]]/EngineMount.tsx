'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

import { Layout } from '@/components/visualizers/merkletreeviz/components/Layout';

// These were `dynamic(..., { ssr: false })`, so every merkletreeviz route
// pre-rendered as an empty ~9.6 KB shell — no heading, no content. Nothing in the
// engine needed that: every hash is computed in an effect or a handler, never
// during render. Two render-path hazards did exist and are now gone —
// `hooks/useTheme.ts` called `window.matchMedia` while rendering (it reads the
// shared `resolvedTheme` now), and the footer year came from `new Date()` during
// render (this route's server component computes it once and passes it in) — so
// the pages are imported normally and their markup reaches the static HTML.
import Home from '@/components/visualizers/merkletreeviz/pages/Home';
import Learn from '@/components/visualizers/merkletreeviz/pages/Learn';
import TopicPage from '@/components/visualizers/merkletreeviz/pages/TopicPage';
import Playground from '@/components/visualizers/merkletreeviz/pages/Playground';

export default function EngineMount({
  slug,
  year,
}: {
  slug: string[];
  year?: number;
}) {
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
    <RouteProvider basePath="/merkletreeviz" params={routeParams}>
      <Layout year={year}>
        {pageContent}
      </Layout>
    </RouteProvider>
  );
}
