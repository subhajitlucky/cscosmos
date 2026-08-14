import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/wasmcosmos/styles.css';
import { Navbar } from '@/components/visualizers/wasmcosmos/components/Navbar';
import { Footer } from '@/components/visualizers/wasmcosmos/components/Footer';
import { Home } from '@/components/visualizers/wasmcosmos/pages/Home';
import { Learn } from '@/components/visualizers/wasmcosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/wasmcosmos/pages/TopicDetail';
import { StackLab } from '@/components/visualizers/wasmcosmos/pages/StackLab';
import { WatCompiler } from '@/components/visualizers/wasmcosmos/pages/WatCompiler';
import { About } from '@/components/visualizers/wasmcosmos/pages/About';
import { wasmTopics } from '@/components/visualizers/wasmcosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['stack-lab'] },
    { slug: ['wat-compiler'] },
    { slug: ['about'] },
  ];

  wasmTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function WasmCosmosPage({
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
  } else if (first === 'stack-lab') {
    content = <StackLab />;
  } else if (first === 'wat-compiler') {
    content = <WatCompiler />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="wasmcosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--wasm-muted)]">Loading WASM::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
