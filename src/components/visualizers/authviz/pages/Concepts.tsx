'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { AUTH_TOPICS } from '../data/topics';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Topics' },
  { id: 'oauth-oidc', label: 'OAuth & OIDC' },
  { id: 'jwt-tokens', label: 'JWT & Signatures' },
  { id: 'sessions-cookies', label: 'Sessions & Cookies' },
  { id: 'authz-rbac', label: 'Authorization & RBAC' },
  { id: 'cryptography-passwords', label: 'Cryptography & Passwords' },
  { id: 'resilience-security', label: 'Resilience & Defense' },
];

export default function Concepts() {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? AUTH_TOPICS
    : AUTH_TOPICS.filter((t) => t.category === filter);

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          Curriculum
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Authentication, OAuth 2.0 &amp; Security Concepts
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {AUTH_TOPICS.length} in-depth architectural topics from OAuth 2.0 PKCE and RS256 JWTs to HttpOnly Cookie defenses, RBAC/ABAC engines, and Argon2id password hashing.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-card border border-border text-foreground hover:border-emerald-500/50 hover:bg-muted/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Grid: Topic names only, no extra description */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((topic) => {
          const originalIndex = AUTH_TOPICS.findIndex((t) => t.id === topic.id) + 1;
          const formattedNum = originalIndex < 10 ? `0${originalIndex}` : `${originalIndex}`;
          const catLabel = CATEGORY_TABS.find((c) => c.id === topic.category)?.label ?? topic.category;

          return (
            <Link
              key={topic.id}
              href={`/authviz/concepts/${topic.id}`}
              className="p-5 rounded-2xl bg-card border border-border/80 hover:border-emerald-500/50 hover:bg-muted/30 transition-all flex flex-col justify-between group space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-muted-foreground group-hover:text-emerald-500 transition-colors">
                    #{formattedNum}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-mono font-medium">
                      {catLabel}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      topic.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : topic.difficulty === 'Intermediate'
                        ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300'
                        : topic.difficulty === 'Advanced'
                        ? 'bg-muted text-foreground'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors leading-snug">
                  {topic.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Start Lesson</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
