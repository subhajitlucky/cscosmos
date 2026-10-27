'use client';

import React from 'react';
// Was `dynamic(() => import('@/components/visualizers/remasmviz/App'), { ssr: false })`,
// which pre-rendered this route with no content at all. remasmviz reads no browser
// globals on its render path, so it is server-renderable and can be a static import.
import Workshop from '@/components/visualizers/remasmviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
