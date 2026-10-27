'use client';

import React from 'react';

// Was `dynamic(() => import(...), { ssr: false })`, which pre-rendered the route
// as a chrome-only shell. Nothing in mallocviz touches a browser API on the render
// path: heap state is plain React state and its only timer runs inside `useEffect`.
import Workshop from '@/components/visualizers/mallocviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
