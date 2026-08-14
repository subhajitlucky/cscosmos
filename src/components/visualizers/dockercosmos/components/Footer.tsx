'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Box } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 py-10 px-4 sm:px-6 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-sky-600 text-white font-mono font-bold text-[10px] flex items-center justify-center">
            <Box className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-foreground">DockerCosmos by CSCosmos</span>
          <span>• Linux Namespaces, OverlayFS, cgroups &amp; Kubernetes Visualizer</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dockercosmos/concepts" className="hover:text-foreground transition-colors">
            Concepts
          </Link>
          <Link href="/dockercosmos/namespaces-lab" className="hover:text-foreground transition-colors">
            Namespaces
          </Link>
          <Link href="/dockercosmos/overlayfs-lab" className="hover:text-foreground transition-colors">
            OverlayFS
          </Link>
          <Link href="/dockercosmos/cgroups-lab" className="hover:text-foreground transition-colors">
            cgroups &amp; OOM
          </Link>
          <Link href="/dockercosmos/k8s-lab" className="hover:text-foreground transition-colors">
            K8s Lab
          </Link>
          <Link href="/dockercosmos/playground" className="hover:text-foreground transition-colors">
            CLI Sandbox
          </Link>
          <Link href="/topics" className="hover:text-foreground font-semibold flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> Back to CSCosmos
          </Link>
        </div>
      </div>
    </footer>
  );
}
