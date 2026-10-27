import React from 'react';
import EngineMount from './EngineMount';
import { concepts } from '@/components/visualizers/k8scosmos/data/concepts';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['concepts'] },
    { slug: ['playground'] },
    { slug: ['lab'] },
    
  ];

  // Derived from the authored concept data — the same lookup ConceptPage uses
  // (`concepts[conceptId]`). The previous hand-written list named 12 ids, 11 of
  // which — worker-nodes, pods-lifecycle, replicasets-deployments,
  // services-kube-proxy, ingress-controllers, configmaps-secrets,
  // persistent-volumes, statefulsets-daemonsets, hpa-autoscaling,
  // network-policies, crds-operators — exist nowhere in `concepts` (which holds
  // 28 ids such as `what-is-kubernetes`, `control-plane`, `node`). Every one of
  // those routes therefore rendered "Concept not found", while 27 of the 28 real
  // concepts (all but `control-plane`) were never generated at all. Same defect
  // class as the `gitcosmos` and `webprotocols` routes.
  Object.values(concepts).forEach((concept) => {
    params.push({ slug: ['learn', concept.id] });
    params.push({ slug: ['concepts', concept.id] });
    params.push({ slug: ['topic', concept.id] });
    params.push({ slug: [concept.id] });
  });

  return params;
}

export default async function K8scosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolved = await params;
  return <EngineMount slug={resolved?.slug || []} />;
}
