import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/browseruniverse/styles.css';
import { Navbar } from '@/components/visualizers/browseruniverse/components/Navbar';
import { Footer } from '@/components/visualizers/browseruniverse/components/Footer';
import { Home } from '@/components/visualizers/browseruniverse/pages/Home';
import { Learn } from '@/components/visualizers/browseruniverse/pages/Learn';
import { TopicDetail } from '@/components/visualizers/browseruniverse/pages/TopicDetail';
import { CrpLab } from '@/components/visualizers/browseruniverse/pages/CrpLab';
import { V8Lab } from '@/components/visualizers/browseruniverse/pages/V8Lab';
import { About } from '@/components/visualizers/browseruniverse/pages/About';
import { browserTopics } from '@/components/visualizers/browseruniverse/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['crp-lab'] },
    { slug: ['v8-lab'] },
    { slug: ['about'] },
  ];

  browserTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function BrowserUniversePage({
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
  } else if (first === 'crp-lab') {
    content = <CrpLab />;
  } else if (first === 'v8-lab') {
    content = <V8Lab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="browseruniverse-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--bu-muted)]">Loading BROWSER::UNIVERSE...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
