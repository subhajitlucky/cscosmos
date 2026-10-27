import React from 'react';
import EngineMount from './EngineMount';
import { LESSONS } from '@/components/visualizers/threatmodelviz/data';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['playground'] },
  ];
  for (const lesson of LESSONS) {
    params.push({ slug: ['learn', lesson.id] });
    params.push({ slug: [lesson.id] });
  }
  return params;
}

export default async function ThreatModelsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}