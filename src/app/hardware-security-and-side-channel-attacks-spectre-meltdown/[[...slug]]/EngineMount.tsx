'use client';

import React from 'react';

// Was `dynamic(() => import(...), { ssr: false })`, which pre-rendered the route
// as a chrome-only shell. sidechanviz reads no browser API during render: the trace
// script is pure data and the reveal cursor starts at 0.
import Workshop from '@/components/visualizers/sidechanviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
