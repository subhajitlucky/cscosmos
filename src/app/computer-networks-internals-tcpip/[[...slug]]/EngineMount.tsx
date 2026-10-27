'use client';

import React from 'react';

// Previously `dynamic(() => import('@/components/visualizers/tcpviz/App'), { ssr: false })`,
// which pre-rendered this route as a client-only shell with no `<h1>`. The engine's render
// path reads no browser globals (`Math.random` is only sampled inside timers and click
// handlers), so a static import pre-renders its real content on the server.
import Workshop from '@/components/visualizers/tcpviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
