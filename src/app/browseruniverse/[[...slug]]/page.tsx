import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import AppShell from '@/components/visualizers/browseruniverse/components/layout/AppShell';
import HomePage from '@/components/visualizers/browseruniverse/pages/HomePage';
import TopicsPage from '@/components/visualizers/browseruniverse/pages/topics/TopicsPage';
import TopicDetailPage from '@/components/visualizers/browseruniverse/pages/topics/TopicDetailPage';
import TourPage from '@/components/visualizers/browseruniverse/pages/tour/TourPage';
import SandboxPage from '@/components/visualizers/browseruniverse/pages/sandbox/SandboxPage';
import AboutPage from '@/components/visualizers/browseruniverse/pages/about/AboutPage';
import { topics } from '@/components/visualizers/browseruniverse/data/topics';

export function generateStaticParams() {
  const topicParams = topics.map((t) => ({ slug: ['topics', t.slug] }));

  return [
    { slug: [] },
    { slug: ['topics'] },
    ...topicParams,
    { slug: ['tour'] },
    { slug: ['sandbox'] },
    { slug: ['about'] },
  ];
}

export default async function BrowserUniverseAppPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <HomePage />;

  if (first === 'topics') {
    if (second) {
      content = <TopicDetailPage slug={second} />;
    } else {
      content = <TopicsPage />;
    }
  } else if (first === 'tour') {
    content = <TourPage />;
  } else if (first === 'sandbox') {
    content = <SandboxPage />;
  } else if (first === 'about') {
    content = <AboutPage />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <AppShell>
      <Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading BrowserUniverse...</div>}>
        {content}
      </Suspense>
    </AppShell>
  );
}
