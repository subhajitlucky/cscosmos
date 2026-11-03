'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Code, 
  Layers, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles,
  Lock,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  BookOpen
} from 'lucide-react';
import { rustConcepts } from '../data/concepts';
import { rustPitfalls } from '../data/pitfalls';
import { VariablesAndMutabilityLesson } from '../components/lessons/VariablesAndMutabilityLesson';

export function ConceptDetail({ slug }: { slug: string }) {
  const [copiedCode, setCopiedCode] = useState(false);

  const conceptIndex = rustConcepts.findIndex((c) => c.slug === slug);
  const concept = conceptIndex !== -1 ? rustConcepts[conceptIndex] : null;

  if (!concept) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[var(--rust-text)]">Concept Not Found</h2>
        <p className="text-xs text-[var(--rust-muted)]">
          The requested concept &quot;{slug}&quot; could not be found in the 100-concept curriculum.
        </p>
        <Link 
          href="/rustviz/concepts" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--rust-primary)] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all 100 concepts
        </Link>
      </div>
    );
  }

  const prevConcept = conceptIndex > 0 ? rustConcepts[conceptIndex - 1] : null;
  const nextConcept = conceptIndex < rustConcepts.length - 1 ? rustConcepts[conceptIndex + 1] : null;

  const handleCopy = () => {
    if (concept.codeExample) {
      navigator.clipboard.writeText(concept.codeExample);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const isLive = !concept.isComingSoon;
  const relatedPitfalls = rustPitfalls.filter((p) => concept.pitfallIds?.includes(p.id));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-4 text-sm font-semibold">
        <Link
          href="/rustviz/concepts"
          className="flex items-center gap-2 text-[var(--rust-text)] hover:text-[var(--rust-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[var(--rust-primary)]" />
          <span>All 100 Concepts</span>
        </Link>

        {/* Stepper controls */}
        <div className="flex items-center gap-2.5">
          {prevConcept ? (
            <Link
              href={`/rustviz/concepts/${prevConcept.slug}`}
              className="p-2 rounded-xl border border-[var(--rust-border)] hover:bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:text-[var(--rust-primary)] transition-colors shadow-xs"
              title={`Previous: #${prevConcept.number} ${prevConcept.title}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className="p-2 border border-transparent opacity-20 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}

          <span className="font-mono text-sm font-bold text-[var(--rust-text)] px-2">
            #{String(concept.number).padStart(3, '0')} / 100
          </span>

          {nextConcept ? (
            <Link
              href={`/rustviz/concepts/${nextConcept.slug}`}
              className="p-2 rounded-xl border border-[var(--rust-border)] hover:bg-[var(--rust-surface-2)] text-[var(--rust-text)] hover:text-[var(--rust-primary)] transition-colors shadow-xs"
              title={`Next: #${nextConcept.number} ${nextConcept.title}`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="p-2 border border-transparent opacity-20 cursor-not-allowed">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      {/* Concept Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="px-3 py-1 rounded-lg bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-mono text-xs font-bold border border-[var(--rust-primary-border)] shadow-xs">
            Concept #{String(concept.number).padStart(3, '0')}
          </span>
          <span className="px-3 py-1 rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-text)] font-mono text-xs font-semibold border border-[var(--rust-border)] shadow-xs">
            {concept.category}
          </span>
          <span className="text-xs text-[var(--rust-text)] font-mono font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)]">
            <Clock className="h-3.5 w-3.5 text-[var(--rust-primary)]" />
            {concept.readTime}
          </span>
          <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-text)] border border-[var(--rust-border)]">
            {concept.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--rust-text)] tracking-tight leading-[1.15]">
          {concept.title}
        </h1>

        <p className="text-base sm:text-lg text-[var(--rust-text)] font-normal leading-relaxed max-w-4xl">
          {concept.summary}
        </p>
      </div>

      {/* If Coming Soon notice */}
      {!isLive && (
        <div className="rounded-2xl border border-dashed border-[var(--rust-border)] bg-[var(--rust-surface-2)]/40 p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)] mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[var(--rust-text)]">
              Full Breakdown Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-[var(--rust-muted)] max-w-lg mx-auto leading-relaxed">
              Concept #{concept.number} is part of the comprehensive 100-concept Rust architecture curriculum. We are currently finalizing the writing style and layout on the first 5 foundational concepts.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/rustviz/concepts/variables-and-mutability"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--rust-primary)] hover:bg-[var(--rust-primary-hover)] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              <BookOpen className="h-4 w-4" /> Start with Concept #001
            </Link>
            <Link
              href="/rustviz/concepts"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:bg-[var(--rust-surface-2)] text-[var(--rust-text)] rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              Browse 100 Blueprint
            </Link>
          </div>
        </div>
      )}

      {/* If Concept #001: Variables & Mutability -> Render Dedicated Phase-by-Phase Lesson */}
      {concept.slug === 'variables-and-mutability' ? (
        <VariablesAndMutabilityLesson concept={concept} />
      ) : (
        /* Standard Concept View for other live concepts */
        <>
          {/* Key Takeaways Callout */}
          <div className="rounded-2xl border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)]/40 p-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--rust-primary)] flex items-center gap-1.5 font-mono">
              <Sparkles className="h-4 w-4" />
              <span>Core Systems Takeaways</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-[var(--rust-text)]">
              {concept.keyTakeaways.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--rust-primary)] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Idiomatic Code Implementation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)] flex items-center gap-1.5 font-mono">
                <Code className="h-4 w-4 text-[var(--rust-primary)]" />
                <span>Idiomatic Rust Implementation</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[var(--rust-text)] hidden sm:inline">Rust 2024</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] text-xs font-mono font-bold text-[var(--rust-text)] hover:text-[var(--rust-primary)] transition-colors"
                >
                  {copiedCode ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 overflow-hidden">
              <pre className="font-mono text-xs text-[var(--rust-text)] leading-relaxed overflow-x-auto bg-[var(--rust-bg)] p-4 rounded-lg border border-[var(--rust-border)]">
                <code>{concept.codeExample}</code>
              </pre>
            </div>
          </div>

          {/* Deep Dive Explanations */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[var(--rust-text)] border-b border-[var(--rust-border)] pb-2">
              Under the Hood: Compiler &amp; Memory Mechanics
            </h2>

            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[var(--rust-muted)]">
              {concept.explanation.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {concept.deepDive && (
              <div className="space-y-4 pt-2">
                {concept.deepDive.map((dive, dIdx) => (
                  <div 
                    key={dIdx} 
                    className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface-2)]/60 p-5 space-y-3"
                  >
                    <h3 className="text-sm font-bold text-[var(--rust-text)] flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[var(--rust-cyan)]" />
                      <span>{dive.title}</span>
                    </h3>
                    <p className="text-xs text-[var(--rust-muted)] leading-relaxed whitespace-pre-line">
                      {dive.content}
                    </p>
                    {dive.code && (
                      <pre className="font-mono text-xs bg-[var(--rust-bg)] p-3.5 rounded-lg border border-[var(--rust-border)] text-[var(--rust-text)] overflow-x-auto">
                        <code>{dive.code}</code>
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Related Compiler Errors & Pitfalls */}
      {relatedPitfalls.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[var(--rust-border)]">
          <div className="text-sm font-bold text-[var(--rust-text)] flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            <span>Common Compiler Errors for this Concept</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {relatedPitfalls.map((pitfall) => (
              <Link
                key={pitfall.id}
                href="/rustviz/pitfalls"
                className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 flex items-center justify-between hover:border-rose-500/40 transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-sm font-bold text-rose-500">
                    <span>{pitfall.code}</span>
                    <span className="text-[var(--rust-text)] font-sans">{pitfall.title}</span>
                  </div>
                  <p className="text-xs text-[var(--rust-text)] mt-1">{pitfall.summary}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--rust-text)] group-hover:text-rose-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Previous & Next Concept Navigation */}
      <div className="pt-8 border-t border-[var(--rust-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
        {prevConcept ? (
          <Link
            href={`/rustviz/concepts/${prevConcept.slug}`}
            className="rust-card p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] transition-all flex flex-col justify-between group shadow-xs"
          >
            <div className="text-xs font-mono font-bold text-[var(--rust-primary)] uppercase flex items-center gap-1">
              <ChevronLeft className="h-3.5 w-3.5" /> Previous Concept
            </div>
            <div className="mt-1.5 font-bold text-base text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
              #{String(prevConcept.number).padStart(3, '0')}: {prevConcept.title}
            </div>
          </Link>
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-[var(--rust-border)] text-sm text-[var(--rust-muted)] font-mono flex items-center justify-center">
            Beginning of Curriculum
          </div>
        )}

        {nextConcept ? (
          <Link
            href={`/rustviz/concepts/${nextConcept.slug}`}
            className="rust-card p-5 rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] hover:border-[var(--rust-primary-border)] transition-all flex flex-col justify-between text-right group shadow-xs"
          >
            <div className="text-xs font-mono font-bold text-[var(--rust-primary)] uppercase flex items-center justify-end gap-1">
              Next Concept <ChevronRight className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1.5 font-bold text-base text-[var(--rust-text)] group-hover:text-[var(--rust-primary)] transition-colors">
              #{String(nextConcept.number).padStart(3, '0')}: {nextConcept.title}
            </div>
          </Link>
        ) : (
          <div className="p-5 rounded-2xl border border-dashed border-[var(--rust-border)] text-sm text-[var(--rust-muted)] font-mono flex items-center justify-center">
            End of Curriculum
          </div>
        )}
      </div>

    </div>
  );
}
