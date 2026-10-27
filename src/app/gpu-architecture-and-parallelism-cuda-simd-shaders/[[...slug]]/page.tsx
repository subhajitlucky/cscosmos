import React from 'react';
import EngineMount from './EngineMount';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['playground'] },
  ];
  return params;
}

export default async function GpuArchitecturePage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
