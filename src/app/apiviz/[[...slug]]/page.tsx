import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/apiviz/components/Navbar';
import { Footer } from '@/components/visualizers/apiviz/components/Footer';
import Home from '@/components/visualizers/apiviz/pages/Home';
import Concepts from '@/components/visualizers/apiviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/apiviz/pages/ConceptDetail';
import GraphqlLab from '@/components/visualizers/apiviz/pages/GraphqlLab';
import DataLoaderLab from '@/components/visualizers/apiviz/pages/DataLoaderLab';
import ProtocolsLab from '@/components/visualizers/apiviz/pages/ProtocolsLab';
import IdempotencyLab from '@/components/visualizers/apiviz/pages/IdempotencyLab';
import Playground from '@/components/visualizers/apiviz/pages/Playground';
import Flashcards from '@/components/visualizers/apiviz/pages/Flashcards';
import CheatSheet from '@/components/visualizers/apiviz/pages/CheatSheet';
import { API_TOPICS } from '@/components/visualizers/apiviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['graphql-lab'] },
    { slug: ['dataloader-lab'] },
    { slug: ['protocols-lab'] },
    { slug: ['idempotency-lab'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  API_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function ApiVizPage({
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
  } else if (first === 'graphql-lab') {
    content = <GraphqlLab />;
  } else if (first === 'dataloader-lab') {
    content = <DataLoaderLab />;
  } else if (first === 'protocols-lab') {
    content = <ProtocolsLab />;
  } else if (first === 'idempotency-lab') {
    content = <IdempotencyLab />;
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
