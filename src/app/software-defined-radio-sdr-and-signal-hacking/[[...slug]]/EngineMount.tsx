'use client';

import React from 'react';
// Was `dynamic(() => import('@/components/visualizers/sdrviz/App'), { ssr: false })`,
// which pre-rendered this route with no content at all. sdrviz's timers and randomness
// live in effects (the waterfall starts empty), so it can be a static import.
import Workshop from '@/components/visualizers/sdrviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
