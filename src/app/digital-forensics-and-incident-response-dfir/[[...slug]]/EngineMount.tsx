'use client';

import React from 'react';

// Previously `dynamic(() => import('@/components/visualizers/dfirviz/App'), { ssr: false })`,
// which pre-rendered this route as a client-only shell with no `<h1>`. The engine's render
// path reads no browser globals (state starts from deterministic defaults), so a static
// import pre-renders its real content on the server without a hydration mismatch.
import Workshop from '@/components/visualizers/dfirviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
