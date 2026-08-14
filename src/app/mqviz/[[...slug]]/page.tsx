import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/mqviz/styles.css';
import { Navbar } from '@/components/visualizers/mqviz/components/Navbar';
import { Footer } from '@/components/visualizers/mqviz/components/Footer';
import { Home } from '@/components/visualizers/mqviz/pages/Home';
import { Learn } from '@/components/visualizers/mqviz/pages/Learn';
import { TopicDetail } from '@/components/visualizers/mqviz/pages/TopicDetail';
import { StreamLab } from '@/components/visualizers/mqviz/pages/StreamLab';
import { RetrySimulator } from '@/components/visualizers/mqviz/pages/RetrySimulator';
import { About } from '@/components/visualizers/mqviz/pages/About';
import { mqTopics } from '@/components/visualizers/mqviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['stream-lab'] },
    { slug: ['retries'] },
    { slug: ['about'] },
  ];

  mqTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function MqVizPage({
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
  } else if (first === 'stream-lab') {
    content = <StreamLab />;
  } else if (first === 'retries') {
    content = <RetrySimulator />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="mqviz-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--mq-muted)]">Loading MQ::STREAM...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
