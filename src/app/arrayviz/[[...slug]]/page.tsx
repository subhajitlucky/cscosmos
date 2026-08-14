import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/arrayviz/components/Navbar';
import { Footer } from '@/components/visualizers/arrayviz/components/Footer';
import Home from '@/components/visualizers/arrayviz/pages/Home';
import Concepts from '@/components/visualizers/arrayviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/arrayviz/pages/ConceptDetail';
import MemoryLab from '@/components/visualizers/arrayviz/pages/MemoryLab';
import CacheLab from '@/components/visualizers/arrayviz/pages/CacheLab';
import SlidingWindowLab from '@/components/visualizers/arrayviz/pages/SlidingWindowLab';
import StringAlgoLab from '@/components/visualizers/arrayviz/pages/StringAlgoLab';
import Playground from '@/components/visualizers/arrayviz/pages/Playground';
import Flashcards from '@/components/visualizers/arrayviz/pages/Flashcards';
import CheatSheet from '@/components/visualizers/arrayviz/pages/CheatSheet';
import { ARRAY_TOPICS } from '@/components/visualizers/arrayviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['memory-lab'] },
    { slug: ['cache-lab'] },
    { slug: ['sliding-window-lab'] },
    { slug: ['string-algo-lab'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  ARRAY_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function ArrayVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (first === 'concepts') {
    if (second) {
      content = <ConceptDetail topicId={second} />;
    } else {
      content = <Concepts />;
    }
  } else if (first === 'memory-lab') {
    content = <MemoryLab />;
  } else if (first === 'cache-lab') {
    content = <CacheLab />;
  } else if (first === 'sliding-window-lab') {
    content = <SlidingWindowLab />;
  } else if (first === 'string-algo-lab') {
    content = <StringAlgoLab />;
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first === 'flashcards') {
    content = <Flashcards />;
  } else if (first === 'cheatsheet') {
    content = <CheatSheet />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-1 w-full">{content}</main>
      <Footer />
    </div>
  );
}
