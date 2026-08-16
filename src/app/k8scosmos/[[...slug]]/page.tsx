import React from 'react';
import RouteClientShell from './RouteClientShell';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    
  ];

  const topicIds = ["control-plane","worker-nodes","pods-lifecycle","replicasets-deployments","services-kube-proxy","ingress-controllers","configmaps-secrets","persistent-volumes","statefulsets-daemonsets","hpa-autoscaling","network-policies","crds-operators"];
  topicIds.forEach((id: string) => {
    params.push({ slug: ['learn', id] });
    params.push({ slug: ['concepts', id] });
    params.push({ slug: ['topic', id] });
    params.push({ slug: [id] });
  });

  return params;
}

export default async function K8scosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <RouteClientShell slug={resolved?.slug || []} />;
}
