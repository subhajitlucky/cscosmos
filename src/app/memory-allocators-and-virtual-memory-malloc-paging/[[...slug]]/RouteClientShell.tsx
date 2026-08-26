'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const Workshop = dynamic(() => import('@/components/visualizers/mallocviz/App'), { ssr: false });

export default function RouteClientShell({ slug }: { slug: string[] }) {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors">
      <Workshop key={slug.join('/')} />
    </div>
  );
}
