import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/sqlcosmos/components/Navbar';
import { Footer } from '@/components/visualizers/sqlcosmos/components/Footer';
import Home from '@/components/visualizers/sqlcosmos/pages/Home';
import Concepts from '@/components/visualizers/sqlcosmos/pages/Concepts';
import ConceptDetail from '@/components/visualizers/sqlcosmos/pages/ConceptDetail';
import IndexLab from '@/components/visualizers/sqlcosmos/pages/IndexLab';
import ExplainLab from '@/components/visualizers/sqlcosmos/pages/ExplainLab';
import JoinsLab from '@/components/visualizers/sqlcosmos/pages/JoinsLab';
import Playground from '@/components/visualizers/sqlcosmos/pages/Playground';
import Flashcards from '@/components/visualizers/sqlcosmos/pages/Flashcards';
import CheatSheet from '@/components/visualizers/sqlcosmos/pages/CheatSheet';
import { SQL_TOPICS } from '@/components/visualizers/sqlcosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['index-lab'] },
    { slug: ['explain-lab'] },
    { slug: ['joins-lab'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  SQL_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function SqlCosmosPage({
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
  } else if (first === 'index-lab') {
    content = <IndexLab />;
  } else if (first === 'explain-lab') {
    content = <ExplainLab />;
  } else if (first === 'joins-lab') {
    content = <JoinsLab />;
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
