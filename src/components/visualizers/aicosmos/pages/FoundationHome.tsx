'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, FlaskConical, HelpCircle, Layers, Route } from 'lucide-react';
import { foundationSubtopics } from '../data/foundations';

export function FoundationHome() {
  const stats = [
    { value: '26', label: 'subtopics', Icon: BookOpen },
    { value: '01', label: 'interactive lab', Icon: FlaskConical },
    { value: '10', label: 'core mental models', Icon: Layers },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-8 md:p-12">
        <div className="absolute inset-0 ai-grid-bg opacity-40" />
        <div className="relative space-y-6 max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--ai-primary)]/30 bg-[var(--ai-primary)]/10 px-3 py-1 text-xs font-mono text-[var(--ai-primary)]">
            AI ENGINEERING / 01
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold text-[var(--ai-text)]">
            AI Engineering Foundations
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-[var(--ai-muted)]">
            Understand what AI Engineering actually is before writing complicated code.
            Start with the mental model: data, models, inference, uncertainty, and the engineering pipeline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/aicosmos/learn/ai-engineering-foundations/what-is-artificial-intelligence" className="inline-flex items-center gap-2 rounded-lg bg-[var(--ai-primary)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--ai-primary-hover)]">
              Start learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/aicosmos/ai-engineering-foundations/lab" className="inline-flex items-center gap-2 rounded-lg border border-[var(--ai-border)] px-4 py-3 text-sm text-[var(--ai-text)]">
              <FlaskConical className="w-4 h-4" /> Open Lab
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(({ value, label, Icon }) => (
          <div key={label} className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6">
            <Icon className="w-5 h-5 text-[var(--ai-primary)] mb-4" />
            <div className="text-3xl font-bold text-[var(--ai-text)]">{value}</div>
            <div className="text-xs font-mono text-[var(--ai-muted)] uppercase">{label}</div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[var(--ai-primary)] uppercase">Learning path</div>
          <h2 className="font-display text-3xl font-bold text-[var(--ai-text)]">From vocabulary to your first pipeline</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foundationSubtopics.map((topic) => (
            <Link key={topic.id} href={`/aicosmos/learn/ai-engineering-foundations/${topic.id}`} className="ai-card rounded-xl p-5 group">
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--ai-primary)]">
                <span>{String(topic.number).padStart(2, '0')}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="mt-3 font-display font-bold text-[var(--ai-text)]">{topic.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ai-muted)]">{topic.definition}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4 border-t border-[var(--ai-border-subtle)] pt-8">
        <Link href="/aicosmos/ai-engineering-foundations/lab" className="ai-card rounded-xl p-5 flex items-center gap-4">
          <Route className="w-5 h-5 text-[var(--ai-primary)]" /><span className="text-sm text-[var(--ai-text)]">Interactive pipeline lab</span>
        </Link>
        <Link href="/aicosmos/ai-engineering-foundations/problems" className="ai-card rounded-xl p-5 flex items-center gap-4">
          <HelpCircle className="w-5 h-5 text-[var(--ai-primary)]" /><span className="text-sm text-[var(--ai-text)]">Questions & answers</span>
        </Link>
        <Link href="/aicosmos/learn" className="ai-card rounded-xl p-5 flex items-center gap-4">
          <Layers className="w-5 h-5 text-[var(--ai-primary)]" /><span className="text-sm text-[var(--ai-text)]">Back to AI curriculum</span>
        </Link>
      </section>
    </div>
  );
}
