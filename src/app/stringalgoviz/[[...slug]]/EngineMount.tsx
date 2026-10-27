'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which meant every stringalgoviz
// route pre-rendered as an empty ~9.6 KB shell: no heading, no content, nothing
// for a crawler or a no-JS reader. Nothing in the engines required that — the
// pages below were already deterministic. The only browser access in the whole
// engine lived in `components/layout/Layout.tsx` (it seeded dark-mode from
// `localStorage`/`matchMedia` in a `useState` initialiser and painted
// `document.documentElement` itself), and this shell never mounted that Layout.
// Layout now reads the app-wide `resolvedTheme` too, so the pages are imported
// normally and their markup reaches the static HTML.
import Home from '@/components/visualizers/stringalgoviz/pages/Home';
import Learn from '@/components/visualizers/stringalgoviz/pages/Learn';
import TopicPage from '@/components/visualizers/stringalgoviz/pages/TopicDetail';
import Playground from '@/components/visualizers/stringalgoviz/pages/Playground';
import About from '@/components/visualizers/stringalgoviz/pages/About';

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
    <RouteProvider basePath="/stringalgoviz" params={routeParams}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {pageContent}
      </div>
    </RouteProvider>
  );
}
