'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Code2,
  ListOrdered,
  Scale,
  Brain,
  MessageSquare
} from 'lucide-react';
import { MONGO_TOPICS } from '../data/topics';
import { TopicVisualizer } from '../components/TopicVisualizer';

interface ConceptDetailProps {
  topicId: string;
}

export default function ConceptDetail({ topicId }: ConceptDetailProps) {
  const topic = MONGO_TOPICS.find((t) => t.id === topicId);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!topic) {
    notFound();
  }

  const prevTopic = topic.prevTopicId ? MONGO_TOPICS.find((t) => t.id === topic.prevTopicId) : null;
  const nextTopic = topic.nextTopicId ? MONGO_TOPICS.find((t) => t.id === topic.nextTopicId) : null;

  return (
    <div className="space-y-12 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-8 text-foreground">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4 text-xs">
        <Link
          href="/mongocosmos/concepts"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All 50 Concepts</span>
        </Link>

        <div className="flex items-center gap-3">
          {prevTopic && (
            <Link
              href={`/mongocosmos/concepts/${prevTopic.id}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Topic {prevTopic.topicNumber}</span>
            </Link>
          )}
          {nextTopic && (
            <Link
              href={`/mongocosmos/concepts/${nextTopic.id}`}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              <span>Topic {nextTopic.topicNumber}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            LESSON {topic.topicNumber.toString().padStart(2, '0')} / 50
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
            {topic.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono capitalize bg-muted/60 text-muted-foreground">
            {topic.category.replace('-', ' ')}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {topic.title}
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Embedded Interactive Engine Visualizer */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive Engine Simulator</span>
        </div>
        <TopicVisualizer topic={topic} />
      </section>

      {/* Section 1: Definition */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>1. Formal Definition &amp; Architecture Intent</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {topic.definition}
        </p>
      </section>

      {/* Section 2: ELI5 */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>2. Explain Like I'm 5 (Mental Model)</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {topic.eli5}
        </p>
      </section>

      {/* Section 3: Real-World Example */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-500" />
          <span>3. Real-World Architecture Example</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {topic.realWorldExample.description}
        </p>

        {topic.realWorldExample.sampleDocuments && topic.realWorldExample.sampleDocuments.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono font-semibold text-muted-foreground">Sample BSON Documents:</span>
            {topic.realWorldExample.sampleDocuments.map((s, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  Collection: db.{s.collection}
                </div>
                <pre className="overflow-x-auto text-foreground">
                  {JSON.stringify(s.doc, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground italic pt-1">
          {topic.realWorldExample.explanation}
        </p>
      </section>

      {/* Section 4: MQL Syntax Steps */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <ListOrdered className="w-4 h-4 text-purple-500" />
          <span>4. MQL Implementation Steps</span>
        </h2>

        <div className="space-y-4 pt-2">
          {topic.syntaxSteps.map((step, idx) => (
            <div key={idx} className="space-y-2 border-l-2 border-border pl-4">
              <div className="text-xs font-bold text-foreground">
                Step {idx + 1}: {step.step}
              </div>
              <pre className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground overflow-x-auto">
                {step.code}
              </pre>
              {step.note && (
                <div className="text-xs text-muted-foreground">{step.note}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 5: Engineering Rules Table */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>5. Critical Engineering Rules</span>
        </h2>

        <div className="border border-border rounded-lg overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-foreground font-semibold">
              <tr>
                <th className="p-3 w-1/3">Rule / Constraint</th>
                <th className="p-3">Underlying Reason &amp; Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {topic.rulesTable.map((r, idx) => (
                <tr key={idx} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-semibold text-foreground align-top">{r.rule}</td>
                  <td className="p-3 text-muted-foreground leading-relaxed align-top">{r.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 6: Deep Dive */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-500" />
          <span>6. Deep Dive: {topic.deepDive.title}</span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {topic.deepDive.description}
        </p>

        {topic.deepDive.codeSnippet && (
          <pre className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground overflow-x-auto">
            {topic.deepDive.codeSnippet}
          </pre>
        )}

        {topic.deepDive.warning && (
          <div className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-500/5 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Production Warning: </span>
              {topic.deepDive.warning}
            </div>
          </div>
        )}
      </section>

      {/* Section 7: Trade-offs */}
      <section className="space-y-3 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-500" />
          <span>7. Architectural Trade-offs</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-lg border border-border bg-muted/10 space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Advantages</span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {topic.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-lg border border-border bg-muted/10 space-y-2">
            <span className="text-xs font-bold text-rose-500">Disadvantages &amp; Gotchas</span>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {topic.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 8: Interview QA */}
      <section className="space-y-4 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-500" />
          <span>8. Technical Interview Questions</span>
        </h2>

        <div className="space-y-4">
          {topic.interviewQuestions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-border bg-muted/10 space-y-2">
              <div className="text-xs font-bold text-foreground">
                Q{idx + 1}: {q.question}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {q.answer}
              </p>
              {q.codeBlock && (
                <pre className="p-2.5 rounded border border-border bg-background font-mono text-[11px] text-foreground overflow-x-auto">
                  {q.codeBlock}
                </pre>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Section 9: Staff-Level Ready Answer */}
      <section className="space-y-3 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>9. Staff-Level Ready Answer</span>
        </h2>
        <p className="text-sm text-foreground leading-relaxed italic">
          "{topic.interviewReadyAnswer}"
        </p>
      </section>

      {/* Section 10: Quick Knowledge Check */}
      <section className="space-y-4 p-5 rounded-xl border border-border bg-card">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>10. Quick Knowledge Check</span>
        </h2>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-foreground">
            {topic.quickTest.question}
          </p>

          {topic.quickTest.codeBlock && (
            <pre className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground overflow-x-auto">
              {topic.quickTest.codeBlock}
            </pre>
          )}

          <div className="space-y-2">
            {topic.quickTest.options.map((opt) => {
              const isSelected = selectedQuizAnswer === opt.key;
              const isCorrect = opt.key === topic.quickTest.correctAnswer;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setSelectedQuizAnswer(opt.key);
                    setQuizSubmitted(true);
                  }}
                  className={`w-full p-3 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                    quizSubmitted
                      ? isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-bold'
                        : isSelected
                        ? 'border-rose-500 bg-rose-500/10 text-foreground'
                        : 'border-border bg-card text-muted-foreground opacity-60'
                      : isSelected
                      ? 'border-foreground bg-muted text-foreground font-semibold'
                      : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono font-bold text-[10px]">
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {quizSubmitted && isCorrect && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">CORRECT</span>
                  )}
                  {quizSubmitted && isSelected && !isCorrect && (
                    <span className="text-rose-500 font-bold text-[11px]">INCORRECT</span>
                  )}
                </button>
              );
            })}
          </div>

          {quizSubmitted && (
            <div className="p-3.5 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground leading-relaxed animate-in fade-in">
              <span className="font-bold text-foreground">Explanation: </span>
              {topic.quickTest.explanation}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Footer Navigation */}
      <div className="pt-8 border-t border-border flex items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/mongocosmos/concepts/${prevTopic.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted/40 text-xs font-semibold text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: {prevTopic.title}</span>
          </Link>
        ) : <div />}

        {nextTopic && (
          <Link
            href={`/mongocosmos/concepts/${nextTopic.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Next: {nextTopic.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
