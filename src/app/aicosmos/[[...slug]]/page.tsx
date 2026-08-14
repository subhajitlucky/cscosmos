import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/aicosmos/styles.css';
import { Navbar } from '@/components/visualizers/aicosmos/components/Navbar';
import { Footer } from '@/components/visualizers/aicosmos/components/Footer';
import { Home } from '@/components/visualizers/aicosmos/pages/Home';
import { Learn } from '@/components/visualizers/aicosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/aicosmos/pages/TopicDetail';
import { RagLab } from '@/components/visualizers/aicosmos/pages/RagLab';
import { AgentLab } from '@/components/visualizers/aicosmos/pages/AgentLab';
import { About } from '@/components/visualizers/aicosmos/pages/About';
import { aiTopics } from '@/components/visualizers/aicosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['rag-lab'] },
    { slug: ['agent-lab'] },
    { slug: ['about'] },
  ];

  aiTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function AiCosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (first === 'learn') {
    if (second) {
      content = <TopicDetail topicId={second} />;
    } else {
      content = <Learn />;
    }
  } else if (first === 'rag-lab') {
    content = <RagLab />;
  } else if (first === 'agent-lab') {
    content = <AgentLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="aicosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--ai-muted)]">Loading AI::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
