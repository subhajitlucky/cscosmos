'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { findTopic } from '../../data/topics';
import { VisualizerForSlug, visualizerMeta } from '../../visualizers/registry';
import type { TopicSlug } from '../../types/content';

export default function TopicDetailPage({ slug: propSlug }: { slug?: string }) {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = propSlug || (Array.isArray(slugParam) && slugParam.length > 1 ? slugParam[1] : undefined);
  const topic = slug ? findTopic(slug as TopicSlug) : undefined;

  if (!topic) {
    return (
      <div className="space-y-3">
        <h1 className="section-title">Topic not found</h1>
        <Link href="/browseruniverse/topics" className="text-accentSoft underline">
          Back to topics
        </Link>
      </div>
    );
  }

  const meta = visualizerMeta(topic.slug);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Topic</p>
        <h1 className="section-title">{topic.title}</h1>
        <p className="text-sm text-slate-300">{topic.description}</p>
        <div className="flex flex-wrap gap-2">
          {topic.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-base/70 px-3 py-1 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <CodeCard title="HTML" code={topic.exampleHTML} />
        <CodeCard title="CSS" code={topic.exampleCSS} />
        <CodeCard title="JavaScript" code={topic.exampleJS} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">Visualizer</p>
        <h2 className="section-title">{meta?.title ?? topic.title}</h2>
        <p className="text-sm text-slate-300">{meta?.description}</p>
      </div>

      <VisualizerForSlug slug={topic.slug} />

      <div className="rounded-2xl border border-border bg-card/70 p-4 text-sm text-slate-300">
        <p className="font-semibold text-white">Why this matters</p>
        <p>
          Connect the dots between specs (HTML, CSS, WebIDL) and engine behaviors (parser, layout, GPU).
          Use the sandbox to reproduce each step with your own snippets.
        </p>
      </div>
    </div>
  );
}

function CodeCard({ title, code }: { title: string; code: string }) {
  return (
    <div className="glass flex flex-col gap-2 rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">{title}</p>
        <span className="rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.2rem] text-slate-400">
          sample
        </span>
      </div>
      <pre className="max-h-48 overflow-auto rounded-xl border border-border bg-base/80 p-3 text-xs text-slate-200">
        {code}
      </pre>
    </div>
  );
}
