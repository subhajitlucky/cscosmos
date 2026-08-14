import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/microservicesviz/styles.css';
import { Navbar } from '@/components/visualizers/microservicesviz/components/Navbar';
import { Footer } from '@/components/visualizers/microservicesviz/components/Footer';
import { Home } from '@/components/visualizers/microservicesviz/pages/Home';
import { Learn } from '@/components/visualizers/microservicesviz/pages/Learn';
import { TopicDetail } from '@/components/visualizers/microservicesviz/pages/TopicDetail';
import { CircuitLab } from '@/components/visualizers/microservicesviz/pages/CircuitLab';
import { SagaLab } from '@/components/visualizers/microservicesviz/pages/SagaLab';
import { About } from '@/components/visualizers/microservicesviz/pages/About';
import { microserviceTopics } from '@/components/visualizers/microservicesviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['circuit-lab'] },
    { slug: ['saga-lab'] },
    { slug: ['about'] },
  ];

  microserviceTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function MicroservicesVizPage({
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
  } else if (first === 'circuit-lab') {
    content = <CircuitLab />;
  } else if (first === 'saga-lab') {
    content = <SagaLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="microservicesviz-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--ms-muted)]">Loading MICROSERVICES::VIZ...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
