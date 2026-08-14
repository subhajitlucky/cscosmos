'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Box, Cpu, Globe, HardDrive, HelpCircle, Layers, Network, Play, Server, Sparkles, Terminal, Waves, Zap } from 'lucide-react';
import { LinuxNamespacesVisualizer } from '../components/LinuxNamespacesVisualizer';
import { OverlayFsLayersVisualizer } from '../components/OverlayFsLayersVisualizer';
import { MultiStageCacheVisualizer } from '../components/MultiStageCacheVisualizer';
import { CgroupsV2Visualizer } from '../components/CgroupsV2Visualizer';
import { K8sPodLifecycleVisualizer } from '../components/K8sPodLifecycleVisualizer';
import { K8sServiceRoutingVisualizer } from '../components/K8sServiceRoutingVisualizer';
import { IngressRouterVisualizer } from '../components/IngressRouterVisualizer';
import { CniPacketFlowVisualizer } from '../components/CniPacketFlowVisualizer';
import { DockerCliPlayground } from '../components/DockerCliPlayground';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Complete Containers &amp; Kubernetes Architecture Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master the <span className="text-sky-600 dark:text-sky-400">Docker &amp; K8s</span> Engine.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for the 6 Linux Kernel Namespaces, OverlayFS Copy-on-Write layers, multi-stage build caching, cgroups v2 resource limits, Kubernetes Pod lifecycle, Ingress controllers, and cross-node CNI eBPF packet routing.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/dockercosmos/concepts"
            className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-sky-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/dockercosmos/playground"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" /> CLI Sandbox
          </Link>
        </div>
      </div>

      {/* Feature 1: Linux Namespaces Visualizer */}
      <LinuxNamespacesVisualizer />

      {/* Feature 2: OverlayFS Layers Visualizer */}
      <OverlayFsLayersVisualizer />

      {/* Feature 3: Multi-Stage BuildKit & Layer Cache Visualizer */}
      <MultiStageCacheVisualizer />

      {/* Feature 4: cgroups v2 & OOM Killer */}
      <CgroupsV2Visualizer />

      {/* Feature 5: K8s Pod Lifecycle Stepper */}
      <K8sPodLifecycleVisualizer />

      {/* Feature 6: K8s Service & kube-proxy Routing */}
      <K8sServiceRoutingVisualizer />

      {/* Feature 7: Ingress Controller Layer-7 Gateway */}
      <IngressRouterVisualizer />

      {/* Feature 8: Cross-Node CNI Networking (eBPF vs VXLAN) */}
      <CniPacketFlowVisualizer />

      {/* Feature 9: In-Browser Docker/kubectl Sandbox */}
      <DockerCliPlayground />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/dockercosmos/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-sky-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-sky-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Linux capabilities, multi-stage builds, rootless containers, Ingress controllers, and HPA autoscaling.
          </p>
        </Link>

        <Link
          href="/dockercosmos/namespaces-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-sky-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <Box className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-sky-500 transition-colors">
            Namespaces Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Inspect PID, NET, and MNT isolation boundaries side-by-side with host OS kernel views.
          </p>
        </Link>

        <Link
          href="/dockercosmos/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-sky-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-sky-500 transition-colors">
            Senior Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough Cloud Native &amp; DevOps interview questions on Exit Code 137, CFS quotas, and IPVS packet routing.
          </p>
        </Link>
      </div>
    </div>
  );
}
