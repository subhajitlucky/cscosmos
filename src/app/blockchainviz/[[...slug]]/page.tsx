import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/blockchainviz/components/Navbar';
import { Footer } from '@/components/visualizers/blockchainviz/components/Footer';
import Home from '@/components/visualizers/blockchainviz/pages/Home';
import Concepts from '@/components/visualizers/blockchainviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/blockchainviz/pages/ConceptDetail';
import MiningLab from '@/components/visualizers/blockchainviz/pages/MiningLab';
import MerkleLab from '@/components/visualizers/blockchainviz/pages/MerkleLab';
import EvmLab from '@/components/visualizers/blockchainviz/pages/EvmLab';
import Playground from '@/components/visualizers/blockchainviz/pages/Playground';
import Flashcards from '@/components/visualizers/blockchainviz/pages/Flashcards';
import CheatSheet from '@/components/visualizers/blockchainviz/pages/CheatSheet';
import { BLOCKCHAIN_TOPICS } from '@/components/visualizers/blockchainviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['mining-lab'] },
    { slug: ['merkle-lab'] },
    { slug: ['evm-lab'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  BLOCKCHAIN_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function BlockchainVizPage({
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
  } else if (first === 'mining-lab') {
    content = <MiningLab />;
  } else if (first === 'merkle-lab') {
    content = <MerkleLab />;
  } else if (first === 'evm-lab') {
    content = <EvmLab />;
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
