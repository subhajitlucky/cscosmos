'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { ITShell } from '@/components/visualizers/fundamentalsviz/components/ITShell';
import { Home } from '@/components/visualizers/fundamentalsviz/pages/Home';
import { Learn } from '@/components/visualizers/fundamentalsviz/pages/Learn';
import { Topic } from '@/components/visualizers/fundamentalsviz/pages/Topic';
import { Lab } from '@/components/visualizers/fundamentalsviz/pages/Lab';
import { Problems } from '@/components/visualizers/fundamentalsviz/pages/Problems';
import { ProblemDetail } from '@/components/visualizers/fundamentalsviz/pages/ProblemDetail';

export default function EngineMount({ slug }: { slug: string[] }) {
  const first = slug[0] || '';
  const second = slug[1] || '';

  let content: React.ReactNode = <Home />;

  if (first === '') {
    content = <Home />;
  } else if (first === 'learn') {
    content = second ? <Topic key={second} chapterId={second} /> : <Learn />;
  } else if (first === 'lab') {
    content = <Lab />;
  } else if (first === 'problems') {
    content = second ? <ProblemDetail key={second} problemId={second} /> : <Problems />;
  } else {
    notFound();
  }

  return <ITShell>{content}</ITShell>;
}
