'use client';

import React from 'react';
import { K8sPodLifecycleVisualizer } from '../components/K8sPodLifecycleVisualizer';
import { K8sServiceRoutingVisualizer } from '../components/K8sServiceRoutingVisualizer';

export default function K8sLab() {
  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Kubernetes Pod &amp; Service Routing Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of Pod lifecycle states, health probes, and kube-proxy ClusterIP/NodePort packet routing.
        </p>
      </div>

      <K8sPodLifecycleVisualizer />
      <K8sServiceRoutingVisualizer />
    </div>
  );
}
