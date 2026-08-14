import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/tsviz/components/Navbar';
import { Footer } from '@/components/visualizers/tsviz/components/Footer';
import Home from '@/components/visualizers/tsviz/pages/Home';
import Concepts from '@/components/visualizers/tsviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/tsviz/pages/ConceptDetail';
import UtilityLab from '@/components/visualizers/tsviz/pages/UtilityLab';
import CompilerPipeline from '@/components/visualizers/tsviz/pages/CompilerPipeline';
import Errors from '@/components/visualizers/tsviz/pages/Errors';
import Playground from '@/components/visualizers/tsviz/pages/Playground';
import { TS_TOPICS } from '@/components/visualizers/tsviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['utility-lab'] },
    { slug: ['compiler-pipeline'] },
    { slug: ['errors'] },
    { slug: ['playground'] },
  ];

  TS_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function TsVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (first === 'concepts') {
    if (second) {
      content = <ConceptDetail topicId={second} />;
    } else {
      content = <Concepts />;
    }
  } else if (first === 'utility-lab') {
    content = <UtilityLab />;
  } else if (first === 'compiler-pipeline') {
    content = <CompilerPipeline />;
  } else if (first === 'errors') {
    content = <Errors />;
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-1 w-full">{content}</main>
      <Footer />
    </div>
  );
}
