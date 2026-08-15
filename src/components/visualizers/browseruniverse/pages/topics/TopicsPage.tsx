'use client';

import React from 'react';
import TopicCard from '../../components/TopicCard';
import { topics } from '../../data/topics';

export default function TopicsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Topics</p>
          <h1 className="section-title">Browser internals catalog</h1>
          <p className="text-sm text-slate-300">
            Jump into any visualizer with preloaded snippets and guided steps.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}
