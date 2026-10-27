'use client';

import React from 'react';
// Was `dynamic(() => import('@/components/visualizers/osviz/App'), { ssr: false })`,
// which pre-rendered this route with no content at all. osviz's clock runs in an effect
// and it reads no browser globals during render, so it can be a static import.
import Workshop from '@/components/visualizers/osviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
