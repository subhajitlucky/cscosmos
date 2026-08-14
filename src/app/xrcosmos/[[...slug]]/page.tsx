import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/xrcosmos/styles.css';
import { Navbar } from '@/components/visualizers/xrcosmos/components/Navbar';
import { Footer } from '@/components/visualizers/xrcosmos/components/Footer';
import { Home } from '@/components/visualizers/xrcosmos/pages/Home';
import { Learn } from '@/components/visualizers/xrcosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/xrcosmos/pages/TopicDetail';
import { SpatialLab } from '@/components/visualizers/xrcosmos/pages/SpatialLab';
import { HandTracker } from '@/components/visualizers/xrcosmos/pages/HandTracker';
import { About } from '@/components/visualizers/xrcosmos/pages/About';
import { xrTopics } from '@/components/visualizers/xrcosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['spatial-lab'] },
    { slug: ['hand-tracker'] },
    { slug: ['about'] },
  ];

  xrTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function XrCosmosPage({
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
  } else if (first === 'spatial-lab') {
    content = <SpatialLab />;
  } else if (first === 'hand-tracker') {
    content = <HandTracker />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="xrcosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--xr-muted)]">Loading XR::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
