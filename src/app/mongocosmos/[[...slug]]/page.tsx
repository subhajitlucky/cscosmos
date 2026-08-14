import React from 'react';
import { notFound } from 'next/navigation';
import { Layout } from '@/components/visualizers/mongocosmos/components/Layout';
import { Home } from '@/components/visualizers/mongocosmos/pages/Home';
import { LearningPath } from '@/components/visualizers/mongocosmos/pages/LearningPath';
import { TopicDetail } from '@/components/visualizers/mongocosmos/pages/TopicDetail';
import { Playground } from '@/components/visualizers/mongocosmos/pages/Playground';
import { About } from '@/components/visualizers/mongocosmos/pages/About';
import { learningPath } from '@/components/visualizers/mongocosmos/data/learning-path';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['playground'] },
    { slug: ['about'] },
  ];

  const allTopics = learningPath.flatMap((d) => d.topics);
  allTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  return params;
}

export default async function MongoCosmosPage({
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
      content = <LearningPath />;
    }
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return <Layout>{content}</Layout>;
}
