import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/synccosmos/styles.css';
import { Navbar } from '@/components/visualizers/synccosmos/components/Navbar';
import { Footer } from '@/components/visualizers/synccosmos/components/Footer';
import { Home } from '@/components/visualizers/synccosmos/pages/Home';
import { Learn } from '@/components/visualizers/synccosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/synccosmos/pages/TopicDetail';
import { CrdtLab } from '@/components/visualizers/synccosmos/pages/CrdtLab';
import { VectorClockLab } from '@/components/visualizers/synccosmos/pages/VectorClockLab';
import { About } from '@/components/visualizers/synccosmos/pages/About';
import { syncTopics } from '@/components/visualizers/synccosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['crdt-lab'] },
    { slug: ['vector-clock'] },
    { slug: ['about'] },
  ];

  syncTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function SyncCosmosPage({
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
  } else if (first === 'crdt-lab') {
    content = <CrdtLab />;
  } else if (first === 'vector-clock') {
    content = <VectorClockLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="synccosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--sync-muted)]">Loading SYNC::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
