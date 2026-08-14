import React from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/vuecosmos/styles.css';
import { Navbar } from '@/components/visualizers/vuecosmos/components/Navbar';
import { Footer } from '@/components/visualizers/vuecosmos/components/Footer';
import { Home } from '@/components/visualizers/vuecosmos/pages/Home';
import { Learn } from '@/components/visualizers/vuecosmos/pages/Learn';
import { Topic } from '@/components/visualizers/vuecosmos/pages/Topic';
import { Playground } from '@/components/visualizers/vuecosmos/pages/Playground';
import { About } from '@/components/visualizers/vuecosmos/pages/About';
import { allTopics, slugify } from '@/components/visualizers/vuecosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['playground'] },
    { slug: ['about'] },
  ];

  allTopics.forEach((topic) => {
    params.push({ slug: ['topic', slugify(topic.title)] });
  });

  return params;
}

export default async function VueCosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (first === 'learn') {
    content = <Learn />;
  } else if (first === 'topic') {
    if (!second) notFound();
    content = <Topic slug={second} />;
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="vuecosmos-root">
      <div className="app-shell">
        <Navbar />
        <main>
          <React.Suspense fallback={<div className="page"><p>Loading Vue Visualizer...</p></div>}>
            {content}
          </React.Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
