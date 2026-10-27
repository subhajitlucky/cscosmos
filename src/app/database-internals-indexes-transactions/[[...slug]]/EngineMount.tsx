'use client';

import React from 'react';

// Previously `dynamic(() => import('@/components/visualizers/dbviz/App'), { ssr: false })`,
// which pre-rendered this route as a client-only shell with no `<h1>`. The engine's render
// path reads no browser globals (all timers/DOM work lives in effects and handlers), so a
// static import pre-renders its real content on the server without a hydration mismatch.
import Workshop from '@/components/visualizers/dbviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
