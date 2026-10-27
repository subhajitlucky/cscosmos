'use client';

import React from 'react';
import { RouteProvider } from '@/components/visualizers/shared/RouterShim';

// These were `dynamic(..., { ssr: false })`, which made all 13
// security-engineering-threat-models routes pre-render as an empty shell with no
// heading and no content. This engine reads no browser API at all on the render
// path — its data is plain module-level content — so the pages are imported
// normally and their markup reaches the static HTML.
import Home from '@/components/visualizers/threatmodelviz/pages/Home';
import Learn from '@/components/visualizers/threatmodelviz/pages/Learn';
import TopicPage from '@/components/visualizers/threatmodelviz/pages/TopicPage';
import Playground from '@/components/visualizers/threatmodelviz/pages/Playground';

const BASE_PATH = '/security-engineering-threat-models';

export default function EngineMount({ slug }: { slug: string[] }) {
  const [first, second] = slug;

  let page = <Home />;
  if (first === 'learn') page = second ? <TopicPage /> : <Learn />;
  else if (first === 'playground' || first === 'lab') page = <Playground />;
  else if (first) page = <TopicPage />; // direct /<lesson-id> links

  const topicId = first && first !== 'learn' && first !== 'playground' ? first : second;

  return (
    <RouteProvider basePath={BASE_PATH} params={{ topicId: topicId ?? '' }}>
      <div className="min-h-screen w-full bg-background text-foreground transition-colors">
        {page}
      </div>
    </RouteProvider>
  );
}