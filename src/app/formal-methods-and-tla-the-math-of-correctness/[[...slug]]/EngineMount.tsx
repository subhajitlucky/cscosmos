'use client';

import React from 'react';

// Was `dynamic(() => import(...), { ssr: false })`, which pre-rendered the route
// as a chrome-only shell. tlaviz reads no browser API during render: the explorer is
// a pure BFS over `INITIAL_STATE` and its timers live in `useEffect`.
import Workshop from '@/components/visualizers/tlaviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
