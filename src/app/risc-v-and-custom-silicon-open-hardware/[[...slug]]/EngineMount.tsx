'use client';

import React from 'react';
// Was `dynamic(() => import('@/components/visualizers/riscviz/App'), { ssr: false })`,
// which pre-rendered this route with no content at all. riscviz's only timer is in an
// effect and it boots from a deterministic CPU, so it can be a static import.
import Workshop from '@/components/visualizers/riscviz/App';

export default function EngineMount({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
