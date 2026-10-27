'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which made all 37 consensusviz
// routes pre-render as an empty shell with no heading and no content. Two
// render-path hazards are now gone — `context/ThemeContext.tsx` no longer has a
// private `'theme'` preference read on the render path, and
// `ConsensusIntroViz` measures the viewport in an effect instead of while
// rendering — so the pages are imported normally and their markup reaches the
// static HTML.
import Home from '@/components/visualizers/consensusviz/pages/Home';
import Learn from '@/components/visualizers/consensusviz/pages/LearningPath';
import TopicPage from '@/components/visualizers/consensusviz/pages/TopicPage';
import Playground from '@/components/visualizers/consensusviz/pages/Playground';


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
    <RouteProvider basePath="/consensusviz" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
