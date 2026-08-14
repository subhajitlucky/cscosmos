import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/crossplatformviz/styles.css';
import { Navbar } from '@/components/visualizers/crossplatformviz/components/Navbar';
import { Footer } from '@/components/visualizers/crossplatformviz/components/Footer';
import { Home } from '@/components/visualizers/crossplatformviz/pages/Home';
import { Learn } from '@/components/visualizers/crossplatformviz/pages/Learn';
import { TopicDetail } from '@/components/visualizers/crossplatformviz/pages/TopicDetail';
import { BridgeSim } from '@/components/visualizers/crossplatformviz/pages/BridgeSim';
import { EngineMatrix } from '@/components/visualizers/crossplatformviz/pages/EngineMatrix';
import { About } from '@/components/visualizers/crossplatformviz/pages/About';
import { crossPlatformTopics } from '@/components/visualizers/crossplatformviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['bridge-sim'] },
    { slug: ['engine-matrix'] },
    { slug: ['about'] },
  ];

  crossPlatformTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function CrossPlatformVizPage({
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
  } else if (first === 'bridge-sim') {
    content = <BridgeSim />;
  } else if (first === 'engine-matrix') {
    content = <EngineMatrix />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="crossplatformviz-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--cp-muted)]">Loading MOBILE::INTERNALS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
