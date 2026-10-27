'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';
import { Layout } from '@/components/visualizers/blockchainviz/components/layout/Layout';

// These were `dynamic(..., { ssr: false })`, which made all 25 blockchainviz
// routes pre-render as an empty shell with no heading and no content. The only
// browser access on the render path was the engine's private theme provider,
// which is mounted exclusively by the unreachable `App.tsx` — the reachable
// toggle already adapts `@/context/useTheme` — so the pages are imported
// normally and their markup reaches the static HTML.
import LandingPage from '@/components/visualizers/blockchainviz/pages/LandingPage';
import ConceptPage from '@/components/visualizers/blockchainviz/pages/ConceptPage';
import TopicPage from '@/components/visualizers/blockchainviz/pages/TopicPage';
import ModulePage from '@/components/visualizers/blockchainviz/pages/ModulePage';

export default function EngineMount({ slug }: { slug: string[] }) {
  const first = slug[0] || '';
  const second = slug[1] || '';

  let pageContent = <LandingPage />;

  if (first === 'concepts') {
    if (second) {
      pageContent = <TopicPage />;
    } else {
      pageContent = <ConceptPage />;
    }
  } else if (first === 'playground') {
    pageContent = <ModulePage />;
  } else if (first !== '') {
    pageContent = <TopicPage />;
  }

  const routeParams = {
    topicId: second || first,
    id: second || first,
    slug: second || first,
  };

  return (
    <RouteProvider basePath="/blockchainviz" params={routeParams}>
      <Layout>
        {pageContent}
      </Layout>
    </RouteProvider>
  );
}
