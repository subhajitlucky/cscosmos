import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/sveltecosmos/styles.css';
import { Navbar } from '@/components/visualizers/sveltecosmos/components/Navbar';
import { Footer } from '@/components/visualizers/sveltecosmos/components/Footer';
import { Home } from '@/components/visualizers/sveltecosmos/pages/Home';
import { Learn } from '@/components/visualizers/sveltecosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/sveltecosmos/pages/TopicDetail';
import { RunesSandbox } from '@/components/visualizers/sveltecosmos/pages/RunesSandbox';
import { CompilerLab } from '@/components/visualizers/sveltecosmos/pages/CompilerLab';
import { About } from '@/components/visualizers/sveltecosmos/pages/About';
import { svelteTopics } from '@/components/visualizers/sveltecosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['runes'] },
    { slug: ['compiler'] },
    { slug: ['about'] },
  ];

  svelteTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function SvelteCosmosPage({
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
  } else if (first === 'runes') {
    content = <RunesSandbox />;
  } else if (first === 'compiler') {
    content = <CompilerLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="sveltecosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs">Loading SvelteCosmos...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
