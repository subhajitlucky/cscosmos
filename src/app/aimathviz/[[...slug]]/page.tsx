import React from 'react';
import RouteClientShell from './RouteClientShell';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    { slug: ['about'] },
  ];

  const topicIds = ["linear-algebra","calculus-gradients","probability-distributions","statistics-inference","matrix-decomposition","vector-spaces","optimization-methods","information-theory"];
  topicIds.forEach((id: string) => {
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function AimathvizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <RouteClientShell slug={resolved?.slug || []} />;
}
