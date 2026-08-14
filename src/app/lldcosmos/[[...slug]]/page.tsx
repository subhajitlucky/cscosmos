import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/lldcosmos/styles.css';
import { Navbar } from '@/components/visualizers/lldcosmos/components/Navbar';
import { Footer } from '@/components/visualizers/lldcosmos/components/Footer';
import { Home } from '@/components/visualizers/lldcosmos/pages/Home';
import { Learn } from '@/components/visualizers/lldcosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/lldcosmos/pages/TopicDetail';
import { SolidLab } from '@/components/visualizers/lldcosmos/pages/SolidLab';
import { PatternsLab } from '@/components/visualizers/lldcosmos/pages/PatternsLab';
import { About } from '@/components/visualizers/lldcosmos/pages/About';
import { lldTopics } from '@/components/visualizers/lldcosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['solid-lab'] },
    { slug: ['patterns-lab'] },
    { slug: ['about'] },
  ];

  lldTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function LldCosmosPage({
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
  } else if (first === 'solid-lab') {
    content = <SolidLab />;
  } else if (first === 'patterns-lab') {
    content = <PatternsLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="lldcosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--lld-muted)]">Loading LLD::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
