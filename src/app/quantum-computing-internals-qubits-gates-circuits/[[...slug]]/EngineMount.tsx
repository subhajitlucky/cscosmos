'use client';

import React from 'react';
// Was `dynamic(() => import('@/components/visualizers/qubitviz/App'), { ssr: false })`,
// which pre-rendered this route with no content at all. qubitviz's only randomness is
// in a click handler, so it is server-renderable and can be a static import.
import Workshop from '@/components/visualizers/qubitviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
