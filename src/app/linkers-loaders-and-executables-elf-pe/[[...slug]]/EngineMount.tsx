'use client';

import React from 'react';

// Was `dynamic(() => import(...), { ssr: false })`, which pre-rendered the route
// as a chrome-only shell. linkerviz reads no browser API during render: the ASLR
// base starts at `BASE_NO_ASLR` and `Math.random()` only runs in a `useEffect`.
import Workshop from '@/components/visualizers/linkerviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
