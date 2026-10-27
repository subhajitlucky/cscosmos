'use client';

import React from 'react';
// Was `dynamic(() => import('@/components/visualizers/tocviz/App'), { ssr: false })`,
// which pre-rendered this route with no content at all. tocviz's only DOM read sits in
// a pointer handler, so it is server-renderable and can be a static import.
import Workshop from '@/components/visualizers/tocviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
