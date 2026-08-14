'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Box, Filter, Sparkles } from 'lucide-react';
import { DOCKER_TOPICS, type DockerTopic } from '../data/topics';

export default function Concepts() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? DOCKER_TOPICS : DOCKER_TOPICS.filter((t) => t.category === filter);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-widest">
          Curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Docker &amp; Kubernetes Architecture Concepts
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          20 in-depth architectural topics from Linux kernel namespaces and cgroups to OverlayFS, Pod scheduling, and kube-proxy.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'containers', 'storage', 'networking', 'k8s-core', 'k8s-advanced', 'security'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === cat
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-sky-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((topic) => (
          <Link
            key={topic.id}
            href={`/dockercosmos/concepts/${topic.id}`}
            className="p-6 rounded-3xl bg-card border border-border/80 hover:border-sky-500/50 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-[10px] font-bold uppercase tracking-wider">
                  {topic.category}
                </span>
                <span className="text-xs text-muted-foreground font-mono">{topic.difficulty}</span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-sky-500 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {topic.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Start Interactive Lesson</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
