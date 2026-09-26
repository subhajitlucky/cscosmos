'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react';
import { foundationSubtopics, getFoundationSubtopic } from '../data/foundations';

export function FoundationTopic({ topicId }: { topicId: string }) {
  const topic = getFoundationSubtopic(topicId) || foundationSubtopics[0];
  const index = foundationSubtopics.findIndex(t => t.id === topic.id);
  const previous = foundationSubtopics[index - 1];
  const next = foundationSubtopics[index + 1];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <Link href="/aicosmos/learn/ai-engineering-foundations" className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-primary)]">
        <ArrowLeft className="w-4 h-4" /> Foundations
      </Link>

      <header className="space-y-5">
        <div className="text-xs font-mono text-[var(--ai-primary)]">FOUNDATIONS / {String(topic.number).padStart(2, '0')}</div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-[var(--ai-text)]">{topic.title}</h1>
        <p className="text-lg leading-relaxed text-[var(--ai-muted)]">{topic.definition}</p>
      </header>

      <section className="rounded-2xl border border-[var(--ai-primary)]/30 bg-[var(--ai-primary)]/5 p-7">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ai-primary)] uppercase"><Lightbulb className="w-4 h-4" /> Mental model</div>
        <p className="mt-3 text-xl font-display font-bold text-[var(--ai-text)]">{topic.analogy}</p>
      </section>

      <section className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-7 space-y-5">
        <h2 className="font-display text-2xl font-bold text-[var(--ai-text)]">What you should understand</h2>
        <div className="space-y-3">
          {topic.keyPoints.map(point => (
            <div key={point} className="flex gap-3 text-sm leading-relaxed text-[var(--ai-muted)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ai-emerald)]" /> {point}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] overflow-hidden">
        <div className="border-b border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] px-5 py-3 text-xs font-mono text-[var(--ai-muted)]">VISUALIZER / {topic.visualization}</div>
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            {topic.visualization === 'pipeline'
              ? ['Input', 'Processing', 'Model', 'Prediction'].map((x, i) => <div key={x} className="flex items-center gap-2"><span className="rounded-lg border border-[var(--ai-primary)]/30 bg-[var(--ai-primary)]/10 px-4 py-3 text-[var(--ai-text)]">{x}</span>{i < 3 && <ArrowRight className="w-4 h-4 text-[var(--ai-primary)]" />}</div>)
              : topic.visualization === 'comparison'
                ? <><span className="rounded-lg border border-[var(--ai-border)] px-5 py-4 text-[var(--ai-text)]">Concept A</span><span className="text-[var(--ai-muted)]">vs</span><span className="rounded-lg border border-[var(--ai-primary)]/40 px-5 py-4 text-[var(--ai-text)]">Concept B</span></>
                : <div className="w-full rounded-xl border border-[var(--ai-border)] p-6 text-center text-[var(--ai-muted)]">Interactive {topic.visualization} visualization</div>}
          </div>
        </div>
      </section>

      <nav className="grid md:grid-cols-2 gap-4">
        {previous ? <Link href={`/aicosmos/learn/ai-engineering-foundations/${previous.id}`} className="ai-card p-5 rounded-xl"><span className="text-[10px] font-mono text-[var(--ai-muted)]">PREVIOUS</span><div className="mt-2 font-bold text-[var(--ai-text)]">{previous.title}</div></Link> : <div />}
        {next ? <Link href={`/aicosmos/learn/ai-engineering-foundations/${next.id}`} className="ai-card p-5 rounded-xl text-right"><span className="text-[10px] font-mono text-[var(--ai-primary)]">NEXT</span><div className="mt-2 font-bold text-[var(--ai-text)]">{next.title}</div></Link> : null}
      </nav>
    </div>
  );
}
