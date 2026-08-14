import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/tailwindcosmos/styles.css';
import { Navbar } from '@/components/visualizers/tailwindcosmos/components/Navbar';
import { Footer } from '@/components/visualizers/tailwindcosmos/components/Footer';
import { Home } from '@/components/visualizers/tailwindcosmos/pages/Home';
import { Learn } from '@/components/visualizers/tailwindcosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/tailwindcosmos/pages/TopicDetail';
import { Playground } from '@/components/visualizers/tailwindcosmos/pages/Playground';
import { TokenMatrix } from '@/components/visualizers/tailwindcosmos/pages/TokenMatrix';
import { About } from '@/components/visualizers/tailwindcosmos/pages/About';
import { tailwindTopics } from '@/components/visualizers/tailwindcosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['playground'] },
    { slug: ['token-matrix'] },
    { slug: ['about'] },
  ];

  tailwindTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function TailwindCosmosPage({
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
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first === 'token-matrix') {
    content = <TokenMatrix />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="tailwindcosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--twc-muted)]">Loading TAILWIND::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
