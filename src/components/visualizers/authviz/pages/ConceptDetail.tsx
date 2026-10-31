'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  HelpCircle,
  Layers,
  Lightbulb,
  Rocket,
  ShieldAlert,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import { AUTH_TOPICS } from '../data/topics';
import TopicAnimationTheater from '../components/TopicAnimationTheater';
import Topic1Foundations from '../components/Topic1Foundations';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const currentIndex = AUTH_TOPICS.findIndex((t) => t.id === topicId);
  const topic = currentIndex !== -1 ? AUTH_TOPICS[currentIndex] : null;

  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  if (!topic) {
    notFound();
  }

  const prevTopic = currentIndex > 0 ? AUTH_TOPICS[currentIndex - 1] : null;
  const nextTopic = currentIndex < AUTH_TOPICS.length - 1 ? AUTH_TOPICS[currentIndex + 1] : null;
  const formattedIndex = currentIndex + 1 < 10 ? `0${currentIndex + 1}` : `${currentIndex + 1}`;

  const handleCopyCode = () => {
    if (topic.codeSnippet) {
      navigator.clipboard.writeText(topic.codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-10 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/60 pb-4">
        <Link
          href="/authviz/concepts"
          className="inline-flex items-center gap-1.5 hover:text-foreground font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Curriculum
        </Link>
        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
          Lesson {formattedIndex} of {AUTH_TOPICS.length}
        </span>
      </div>

      {/* 1. Header & Summary */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            {topic.category}
          </span>
          <span className="px-3 py-1 rounded-full bg-muted border border-border text-foreground text-xs font-mono font-bold">
            {topic.difficulty}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {topic.title}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {topic.id === 'authn-vs-authz-foundations' ? (
        <Topic1Foundations />
      ) : (
        <>
          {/* Interactive Step-by-Step Visual Concept Explainer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" /> Interactive Visual Concept Explainer
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">Step-by-Step Educational Simulation</span>
            </div>
            <TopicAnimationTheater
              topicId={topic.id}
              topicTitle={topic.title}
              category={topic.category}
            />
          </div>

      {/* 2. Why This Concept Exists */}
      {topic.whyExists && (
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <span>Why This Architectural Concept Exists</span>
          </div>
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            {topic.whyExists}
          </p>
        </div>
      )}

      {/* 3. Intuitive Mental Model Analogy */}
      <div className="p-6 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2.5">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Intuitive Mental Model
        </div>
        <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
          {topic.mentalModel}
        </p>
      </div>

      {/* 4. Architecture Diagram */}
      {topic.architectureDiagram && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-500" /> Architectural System Topology
            </span>
            <span className="font-mono text-[11px]">Protocol Diagram</span>
          </div>
          <pre className="p-5 rounded-3xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-border shadow-inner whitespace-pre leading-relaxed">
            {topic.architectureDiagram}
          </pre>
        </div>
      )}

      {/* 5. Continuous Practical Application: The CosmosApp Story */}
      {topic.cosmosAppStory && (
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-500" />
            <span>CosmosApp Production Milestone</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {topic.cosmosAppStory}
          </p>
        </div>
      )}

      {/* 6. Step-by-Step Execution Sequence */}
      {topic.stepByStep && topic.stepByStep.length > 0 && (
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-500" />
            <span>Step-by-Step Execution Sequence</span>
          </div>
          <div className="grid gap-3">
            {topic.stepByStep.map((step, idx) => {
              const stepNumber = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-card border border-border/70 flex items-start gap-3.5 shadow-xs"
                >
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold shrink-0 mt-0.5">
                    {stepNumber}
                  </span>
                  <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Technical Implementation: Code Blueprint */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-emerald-500" /> Production Architecture Blueprint
          </span>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-muted text-foreground transition text-[11px]"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
        <pre className="p-5 rounded-3xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-border shadow-inner whitespace-pre-wrap leading-relaxed">
          {topic.codeSnippet}
        </pre>
      </div>

      {/* 8. Common Misconceptions */}
      {topic.misconceptions && topic.misconceptions.length > 0 && (
        <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            <span>Common Architectural Misconceptions</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
            {topic.misconceptions.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold mt-0.5">✕</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. Key Takeaways */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Architectural Takeaways
        </h3>
        <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
          {topic.takeaways.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 10. Pitfall & Production Best Practice */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Common Architectural Pitfall
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {topic.commonPitfall.mistake}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Production Best Practice Fix
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            {topic.commonPitfall.fix}
          </p>
        </div>
      </div>

      {/* 11. Interactive Knowledge Check */}
      {topic.knowledgeCheck && (
        <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Knowledge Check</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
            {topic.knowledgeCheck.question}
          </p>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition"
          >
            {showAnswer ? (
              <>
                <span>Hide Explanation</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Reveal Architect&apos;s Explanation</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {showAnswer && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-foreground leading-relaxed animate-in fade-in duration-200">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Architect&apos;s Solution: </span>
              {topic.knowledgeCheck.answer}
            </div>
          )}
        </div>
      )}
        </>
      )}

      {/* 12. Bottom Navigation */}
      <div className="pt-8 border-t border-border flex flex-wrap items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/authviz/concepts/${prevTopic.id}`}
            className="px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="line-clamp-1 max-w-[200px]">Previous: {prevTopic.title}</span>
          </Link>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <Link
            href="/authviz/lab"
            className="px-4 py-2.5 rounded-xl bg-muted border border-border hover:bg-muted/80 text-foreground text-xs font-semibold transition"
          >
            Interactive Labs
          </Link>

          {nextTopic && (
            <Link
              href={`/authviz/concepts/${nextTopic.id}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
            >
              <span className="line-clamp-1 max-w-[220px]">Next: {nextTopic.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
