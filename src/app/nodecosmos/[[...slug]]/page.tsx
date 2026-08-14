import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/nodecosmos/components/Navbar';
import { Footer } from '@/components/visualizers/nodecosmos/components/Footer';
import Home from '@/components/visualizers/nodecosmos/pages/Home';
import Concepts from '@/components/visualizers/nodecosmos/pages/Concepts';
import ConceptDetail from '@/components/visualizers/nodecosmos/pages/ConceptDetail';
import EventLoopLab from '@/components/visualizers/nodecosmos/pages/EventLoopLab';
import StreamsLab from '@/components/visualizers/nodecosmos/pages/StreamsLab';
import ThreadPoolLab from '@/components/visualizers/nodecosmos/pages/ThreadPoolLab';
import Playground from '@/components/visualizers/nodecosmos/pages/Playground';
import Flashcards from '@/components/visualizers/nodecosmos/pages/Flashcards';
import CheatSheet from '@/components/visualizers/nodecosmos/pages/CheatSheet';
import { NODE_TOPICS } from '@/components/visualizers/nodecosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['event-loop'] },
    { slug: ['streams-lab'] },
    { slug: ['thread-pool'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  NODE_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function NodeCosmosPage({
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
  } else if (first === 'event-loop') {
    content = <EventLoopLab />;
  } else if (first === 'streams-lab') {
    content = <StreamsLab />;
  } else if (first === 'thread-pool') {
    content = <ThreadPoolLab />;
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
