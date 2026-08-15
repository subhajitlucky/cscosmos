'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Code, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';
import { rustConcepts } from '../data/concepts';
import { rustPitfalls } from '../data/pitfalls';

export function ConceptDetail({ slug }: { slug: string }) {
  const concept = rustConcepts.find((c) => c.slug === slug);

  if (!concept) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--rust-text)]">Concept Not Found</h2>
        <p className="text-xs text-[var(--rust-muted)]">The requested concept could not be found.</p>
        <Link href="/rustviz/concepts" className="inline-flex items-center text-xs font-bold text-[var(--rust-primary)] hover:underline">
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back to all concepts
        </Link>
      </div>
    );
  }

  const relatedPitfalls = rustPitfalls.filter((p) => concept.pitfallIds?.includes(p.id));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Nav & Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-4">
        <Link
          href="/rustviz/concepts"
          className="flex items-center text-xs font-semibold text-[var(--rust-muted)] hover:text-[var(--rust-text)] transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          <span>All Concepts</span>
        </Link>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-bold uppercase text-[10px]">
            {concept.category}
          </span>
          <span className="text-[var(--rust-muted)] flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            {concept.readTime}
          </span>
        </div>
      </div>

      {/* Main Title & Summary */}
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          {concept.title}
        </h1>
        <p className="text-base text-[var(--rust-muted)] leading-relaxed">
          {concept.summary}
        </p>
      </div>

      {/* Key Takeaways Callout Box */}
      <div className="rounded-xl border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] p-5 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] flex items-center">
          <Sparkles className="mr-1.5 h-4 w-4" />
          Key Architectural Takeaways
        </div>
        <ul className="space-y-2 text-xs text-[var(--rust-text)]">
          {concept.keyTakeaways.map((item, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Code Example Showcase */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)] flex items-center">
            <Code className="mr-1.5 h-4 w-4 text-[var(--rust-primary)]" />
            Idiomatic Code Implementation
          </span>
          <span className="text-[10px] font-mono text-[var(--rust-muted)]">Rust 2024 Edition</span>
        </div>

        <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 shadow-sm">
          <pre className="font-mono text-xs text-[var(--rust-text)] leading-relaxed overflow-x-auto bg-[var(--rust-bg)] p-4 rounded-lg border border-[var(--rust-border)]">
            <code>{concept.codeExample}</code>
          </pre>
        </div>
      </div>

      {/* Deep Dive Explanations */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-[var(--rust-text)] border-b border-[var(--rust-border)] pb-2">
          Under the Hood: Compiler Mechanics
        </h2>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--rust-muted)]">
          {concept.explanation.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {concept.deepDive && (
          <div className="space-y-6 pt-4">
            {concept.deepDive.map((dive, dIdx) => (
              <div key={dIdx} className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 space-y-3 shadow-sm">
                <h3 className="text-sm font-bold text-[var(--rust-text)] flex items-center">
                  <Layers className="mr-2 h-4 w-4 text-[var(--rust-cyan)]" />
                  {dive.title}
                </h3>
                <p className="text-xs text-[var(--rust-muted)] leading-relaxed whitespace-pre-line">
                  {dive.content}
                </p>
                {dive.code && (
                  <pre className="font-mono text-xs bg-[var(--rust-bg)] p-3 rounded-lg border border-[var(--rust-border)] text-[var(--rust-text)] overflow-x-auto">
                    <code>{dive.code}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Compiler Errors & Pitfalls */}
      {relatedPitfalls.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[var(--rust-border)]">
          <div className="text-sm font-bold text-[var(--rust-text)] flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4 text-rose-500" />
            Common Compiler Errors Related to this Concept
          </div>

          <div className="grid grid-cols-1 gap-3">
            {relatedPitfalls.map((pitfall) => (
              <Link
                key={pitfall.id}
                href="/rustviz/pitfalls"
                className="rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 flex items-center justify-between hover:border-rose-500/50 transition-colors group"
              >
                <div>
                  <div className="flex items-center space-x-2 font-mono text-xs font-bold text-rose-400">
                    <span>{pitfall.code}</span>
                    <span className="text-[var(--rust-text)] font-sans">{pitfall.title}</span>
                  </div>
                  <p className="text-[11px] text-[var(--rust-muted)] mt-1">{pitfall.summary}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--rust-muted)] group-hover:text-rose-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-[var(--rust-border)] flex items-center justify-between">
        <Link
          href="/rustviz/ownership-lab"
          className="inline-flex items-center text-xs font-bold text-[var(--rust-primary)] hover:underline"
        >
          <span>Open Interactive Memory Stepper</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Link>
      </div>

    </div>
  );
}
