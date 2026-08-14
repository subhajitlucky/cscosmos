import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/systemdesignviz/components/Navbar';
import { Footer } from '@/components/visualizers/systemdesignviz/components/Footer';
import Home from '@/components/visualizers/systemdesignviz/pages/Home';
import Concepts from '@/components/visualizers/systemdesignviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/systemdesignviz/pages/ConceptDetail';
import HashingLab from '@/components/visualizers/systemdesignviz/pages/HashingLab';
import RaftLab from '@/components/visualizers/systemdesignviz/pages/RaftLab';
import RateLimitLab from '@/components/visualizers/systemdesignviz/pages/RateLimitLab';
import CapLab from '@/components/visualizers/systemdesignviz/pages/CapLab';
import ShardingLab from '@/components/visualizers/systemdesignviz/pages/ShardingLab';
import CalculatorLab from '@/components/visualizers/systemdesignviz/pages/CalculatorLab';
import Flashcards from '@/components/visualizers/systemdesignviz/pages/Flashcards';
import CheatSheet from '@/components/visualizers/systemdesignviz/pages/CheatSheet';
import { SYSTEM_DESIGN_TOPICS } from '@/components/visualizers/systemdesignviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['hashing-lab'] },
    { slug: ['raft-lab'] },
    { slug: ['rate-limit-lab'] },
    { slug: ['cap-lab'] },
    { slug: ['sharding-lab'] },
    { slug: ['calculator-lab'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  SYSTEM_DESIGN_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function SystemDesignVizPage({
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
  } else if (first === 'hashing-lab') {
    content = <HashingLab />;
  } else if (first === 'raft-lab') {
    content = <RaftLab />;
  } else if (first === 'rate-limit-lab') {
    content = <RateLimitLab />;
  } else if (first === 'cap-lab') {
    content = <CapLab />;
  } else if (first === 'sharding-lab') {
    content = <ShardingLab />;
  } else if (first === 'calculator-lab') {
    content = <CalculatorLab />;
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
