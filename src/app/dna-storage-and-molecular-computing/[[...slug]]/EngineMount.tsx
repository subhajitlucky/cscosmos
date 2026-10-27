'use client';

import React from 'react';

// Was `dynamic(() => import(...), { ssr: false })`, which pre-rendered the route
// as a chrome-only shell. dnaviz reads no browser API during render: encode/decode
// are pure functions and the playback `window.setInterval` lives in `useEffect`.
import Workshop from '@/components/visualizers/dnaviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
