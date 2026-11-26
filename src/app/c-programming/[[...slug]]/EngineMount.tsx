'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { CShell } from '@/components/visualizers/cviz/components/CShell';
import { Home } from '@/components/visualizers/cviz/pages/Home';
import { Learn } from '@/components/visualizers/cviz/pages/Learn';
import { Topic } from '@/components/visualizers/cviz/pages/Topic';
import { Lab } from '@/components/visualizers/cviz/pages/Lab';
import { Problems } from '@/components/visualizers/cviz/pages/Problems';
import { ProblemDetail } from '@/components/visualizers/cviz/pages/ProblemDetail';

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

  return <CShell>{content}</CShell>;
}
