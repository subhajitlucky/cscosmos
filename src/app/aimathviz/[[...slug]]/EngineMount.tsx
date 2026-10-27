'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which made all 126 aimathviz routes
// pre-render as an empty ~9.6 KB shell with no heading and no content. The
// engine's private ThemeProvider (which reads `localStorage`) is only mounted by
// the unimported App.jsx, so it is unreachable from here: the components are
// server-renderable and their content now reaches the static HTML.
import Home from '@/components/visualizers/aimathviz/pages/HomePage';
import Learn from '@/components/visualizers/aimathviz/pages/LearnPage';
import TopicPage from '@/components/visualizers/aimathviz/pages/TopicPage';
import Playground from '@/components/visualizers/aimathviz/pages/PlaygroundPage';
import About from '@/components/visualizers/aimathviz/pages/AboutPage';

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
    <RouteProvider basePath="/aimathviz" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
