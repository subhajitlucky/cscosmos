import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/redisviz/components/Navbar';
import { Footer } from '@/components/visualizers/redisviz/components/Footer';
import Home from '@/components/visualizers/redisviz/pages/Home';
import Concepts from '@/components/visualizers/redisviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/redisviz/pages/ConceptDetail';
import DataStructures from '@/components/visualizers/redisviz/pages/DataStructures';
import CachingLab from '@/components/visualizers/redisviz/pages/CachingLab';
import EvictionLab from '@/components/visualizers/redisviz/pages/EvictionLab';
import CliPlayground from '@/components/visualizers/redisviz/pages/CliPlayground';
import Persistence from '@/components/visualizers/redisviz/pages/Persistence';
import Flashcards from '@/components/visualizers/redisviz/pages/Flashcards';
import CheatSheet from '@/components/visualizers/redisviz/pages/CheatSheet';
import { REDIS_TOPICS } from '@/components/visualizers/redisviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['structures'] },
    { slug: ['caching-lab'] },
    { slug: ['eviction-lab'] },
    { slug: ['playground'] },
    { slug: ['persistence'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  REDIS_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function RedisVizPage({
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
  } else if (first === 'structures') {
    content = <DataStructures />;
  } else if (first === 'caching-lab') {
    content = <CachingLab />;
  } else if (first === 'eviction-lab') {
    content = <EvictionLab />;
  } else if (first === 'playground') {
    content = <CliPlayground />;
  } else if (first === 'persistence') {
    content = <Persistence />;
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
