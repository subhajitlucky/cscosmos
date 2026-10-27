'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';
import { ThemeProvider } from '@/components/visualizers/patriciatrie/hooks/useTheme';
import Layout from '@/components/visualizers/patriciatrie/components/layout/Layout';

// These were `dynamic(..., { ssr: false })`, which made all 45 patriciatrie
// routes pre-render as an empty shell with no heading and no content. Three
// render-path hazards are now gone — `hooks/useTheme` is an adapter over the
// shared provider instead of a private `'theme'` state, `hooks/useProgress`
// reads `localStorage` in an effect instead of a `useState` initialiser, and
// `Tooltip` only creates its portal after mount — so the pages are imported
// normally and their markup reaches the static HTML.
import Home from '@/components/visualizers/patriciatrie/pages/Home';
import Learn from '@/components/visualizers/patriciatrie/pages/Learn';
import TopicPage from '@/components/visualizers/patriciatrie/pages/TopicPage';
import Playground from '@/components/visualizers/patriciatrie/pages/Playground';

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
    <ThemeProvider>
      <RouteProvider basePath="/patriciatrie" params={routeParams}>
        <Layout>
          {pageContent}
        </Layout>
      </RouteProvider>
    </ThemeProvider>
  );
}
