'use client';

import React from 'react';

// Was `dynamic(() => import(...), { ssr: false })`, which pre-rendered the route
// as a chrome-only shell. jvmviz reads no browser API during render: the heap starts
// from `freshHeap()`; object randomness and `window.setTimeout` live in effects.
import Workshop from '@/components/visualizers/jvmviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
