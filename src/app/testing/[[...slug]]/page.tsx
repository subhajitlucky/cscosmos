import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/testingviz/styles.css';
import { Navbar } from '@/components/visualizers/testingviz/components/Navbar';
import { Footer } from '@/components/visualizers/testingviz/components/Footer';
import { Home } from '@/components/visualizers/testingviz/pages/Home';
import { Learn } from '@/components/visualizers/testingviz/pages/Learn';
import { TopicDetail } from '@/components/visualizers/testingviz/pages/TopicDetail';
import { getTestingTopic, testingTopics } from '@/components/visualizers/testingviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [{ slug: [] }, { slug: ['learn'] }];

  testingTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function TestingPage({
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
      if (!getTestingTopic(second)) {
        notFound();
      }
      content = <TopicDetail key={second} topicId={second} />;
    } else {
      content = <Learn />;
    }
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="testing-root">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="p-12 text-center font-mono text-xs text-[var(--test-muted)]">
              Loading TEST::COSMOS...
            </div>
          }
        >
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
