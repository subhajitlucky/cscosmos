'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Home from '@/components/visualizers/golangviz/app/page';
import PathPage from '@/components/visualizers/golangviz/app/path/page';
import PlaygroundPage from '@/components/visualizers/golangviz/app/playground/page';
import IntroToGo from '@/components/visualizers/golangviz/app/concepts/introduction-to-go/page';
import InstallSetup from '@/components/visualizers/golangviz/app/concepts/installation-and-setup/page';
import HelloWorld from '@/components/visualizers/golangviz/app/concepts/hello-world/page';
import BasicSyntax from '@/components/visualizers/golangviz/app/concepts/basic-syntax/page';
import Variables from '@/components/visualizers/golangviz/app/concepts/variables/page';
import BasicTypes from '@/components/visualizers/golangviz/app/concepts/basic-types/page';
import Constants from '@/components/visualizers/golangviz/app/concepts/constants/page';

const CONCEPT_PAGES: Record<string, React.ComponentType> = {
  'introduction-to-go': IntroToGo,
  'installation-and-setup': InstallSetup,
  'hello-world': HelloWorld,
  'basic-syntax': BasicSyntax,
  'variables': Variables,
  'basic-types': BasicTypes,
  'constants': Constants,
};

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
  } else if (first === 'concepts') {
    if (second && CONCEPT_PAGES[second]) {
      const ConceptComp = CONCEPT_PAGES[second];
      View = <ConceptComp />;
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
