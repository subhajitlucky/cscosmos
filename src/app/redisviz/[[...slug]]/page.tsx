import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/visualizers/redisviz/components/layout/Navbar';
import Home from '@/components/visualizers/redisviz/pages/Home';
import Architecture from '@/components/visualizers/redisviz/pages/Architecture';
import DataStructures from '@/components/visualizers/redisviz/pages/DataStructures';
import CommandExecution from '@/components/visualizers/redisviz/pages/CommandExecution';
import MemoryManagement from '@/components/visualizers/redisviz/pages/MemoryManagement';
import Persistence from '@/components/visualizers/redisviz/pages/Persistence';
import Replication from '@/components/visualizers/redisviz/pages/Replication';
import Sentinel from '@/components/visualizers/redisviz/pages/Sentinel';
import Cluster from '@/components/visualizers/redisviz/pages/Cluster';
import Performance from '@/components/visualizers/redisviz/pages/Performance';
import UseCases from '@/components/visualizers/redisviz/pages/UseCases';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['architecture'] },
    { slug: ['data-structures'] },
    { slug: ['execution'] },
    { slug: ['memory'] },
    { slug: ['persistence'] },
    { slug: ['replication'] },
    { slug: ['sentinel'] },
    { slug: ['cluster'] },
    { slug: ['performance'] },
    { slug: ['use-cases'] },
  ];
}

export default async function RedisVizPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';

  let content = <Home />;

  if (first === 'architecture') {
    content = <Architecture />;
  } else if (first === 'data-structures') {
    content = <DataStructures />;
  } else if (first === 'execution') {
    content = <CommandExecution />;
  } else if (first === 'memory') {
    content = <MemoryManagement />;
  } else if (first === 'persistence') {
    content = <Persistence />;
  } else if (first === 'replication') {
    content = <Replication />;
  } else if (first === 'sentinel') {
    content = <Sentinel />;
  } else if (first === 'cluster') {
    content = <Cluster />;
  } else if (first === 'performance') {
    content = <Performance />;
  } else if (first === 'use-cases') {
    content = <UseCases />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-6 md:px-8 py-12 md:py-20">
        {content}
      </main>
      <footer className="py-12 border-t border-border/40">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Redis Visualizer. Built for educational purposes.
          </p>
        </div>
      </footer>
    </div>
  );
}
