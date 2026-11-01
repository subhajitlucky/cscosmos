'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { securityTopics } from '../data/topics';
import { TOPIC_BASE_PATH } from '../data/topic';

export default function Concepts() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Ultra Simple Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Web Security Concepts
        </h1>
        <p className="text-sm text-muted-foreground">
          {securityTopics.length} core browser security modules · self-paced
        </p>
      </div>

      {/* Ultra Simple Topic List */}
      <div className="divide-y divide-border border border-border rounded-xl bg-card overflow-hidden">
        {securityTopics.map((topic, index) => {
          const numberStr = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
          return (
            <Link
              key={topic.id}
              href={`${TOPIC_BASE_PATH}/topics/${topic.id}`}
              className="group p-5 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4">
                <span className="font-mono text-xs font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded shrink-0">
                  {numberStr}
                </span>

                <div className="space-y-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-foreground group-hover:text-red-500 transition-colors">
                      {topic.name}
                    </h2>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      · {topic.category} · {topic.estimatedTime}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {topic.summary}
                  </p>
                </div>
              </div>

              <div className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
