import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/fastapicosmos/styles.css';
import { Navbar } from '@/components/visualizers/fastapicosmos/components/Navbar';
import { Footer } from '@/components/visualizers/fastapicosmos/components/Footer';
import { Home } from '@/components/visualizers/fastapicosmos/pages/Home';
import { Learn } from '@/components/visualizers/fastapicosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/fastapicosmos/pages/TopicDetail';
import { DiGraph } from '@/components/visualizers/fastapicosmos/pages/DiGraph';
import { AsyncLab } from '@/components/visualizers/fastapicosmos/pages/AsyncLab';
import { About } from '@/components/visualizers/fastapicosmos/pages/About';
import { fastApiTopics } from '@/components/visualizers/fastapicosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['di-graph'] },
    { slug: ['async-lab'] },
    { slug: ['about'] },
  ];

  fastApiTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function FastApiCosmosPage({
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
  } else if (first === 'di-graph') {
    content = <DiGraph />;
  } else if (first === 'async-lab') {
    content = <AsyncLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="fastapicosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--fastapi-muted)]">Loading FASTAPI::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
