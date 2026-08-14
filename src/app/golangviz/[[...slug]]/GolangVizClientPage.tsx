'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Home from '@/components/visualizers/golangviz/app/page';
import PathPage from '@/components/visualizers/golangviz/app/path/page';
import PlaygroundPage from '@/components/visualizers/golangviz/app/playground/page';
import CheatSheetPage from '@/components/visualizers/golangviz/app/cheatsheet/page';
import { ConceptPageRenderer } from '@/components/visualizers/golangviz/components/ConceptPageRenderer';
import { conceptsMap } from '@/components/visualizers/golangviz/data/concepts-data';

export default function GolangVizClientPage({ slug }: { slug: string[] }) {
  const first = slug[0] || '';
  const second = slug[1] || '';

  let View: React.ReactNode = <Home />;

  if (first === '') {
    View = <Home />;
  } else if (first === 'path') {
    View = <PathPage />;
  } else if (first === 'playground') {
    View = <PlaygroundPage />;
  } else if (first === 'cheatsheet') {
    View = <CheatSheetPage />;
  } else if (first === 'concepts') {
    if (second) {
      const concept = conceptsMap.get(second);
      if (!concept) {
        notFound();
      }
      View = <ConceptPageRenderer concept={concept} />;
    } else {
      View = <PathPage />;
    }
  } else {
    notFound();
  }

  return (
    <div className="golangviz-scope min-h-screen">
      {View}
    </div>
  );
}
