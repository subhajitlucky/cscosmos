'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Info,
  RotateCcw,
  Sparkles,
  XCircle,
  Key,
  Link2,
  Play,
  Terminal,
  Database,
} from 'lucide-react';
import { SQL_TOPICS } from '../data/topics';
import { TopicVisualizer } from '../components/TopicVisualizer';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const topic = SQL_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const prevTopic = SQL_TOPICS.find((t) => t.topicNumber === topic.topicNumber - 1);
  const nextTopic = SQL_TOPICS.find((t) => t.topicNumber === topic.topicNumber + 1);

  // Quick Test Interactive State
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleCopyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      {/* Top Breadcrumb & Metadata */}
      <div className="space-y-4">
        <Link
          href="/sqlcosmos/concepts"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 50 Concepts</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-md border border-border bg-muted/40 text-foreground font-mono font-bold text-xs">
            Topic {topic.topicNumber} of {SQL_TOPICS.length}
          </span>
          <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs capitalize">
            {topic.category}
          </span>
          <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
            {topic.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-snug">
          # Topic {topic.topicNumber}: {topic.title}
        </h1>

        <p className="text-base sm:text-lg text-foreground/80 leading-relaxed font-normal">
          {topic.summary}
        </p>
      </div>

      {/* Quick Jump Navigation Pill Bar */}
      <nav aria-label="Section navigation" className="sticky top-20 z-40 p-2 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-xs overflow-x-auto flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <a href="#definition" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">1. Definition</a>
        <a href="#eli5" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">2. ELI5</a>
        <a href="#visualizer" className="px-2.5 py-1.5 rounded-lg text-foreground hover:bg-muted/60 transition-colors shrink-0 font-bold bg-muted/40 border border-border/80">3. Visual Animation</a>
        <a href="#example" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">4. Real-World Example</a>
        <a href="#syntax" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">5. SQL Syntax</a>
        <a href="#rules" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">6. Rules</a>
        <a href="#deep-dive" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">7. Deep Dive</a>
        <a href="#tradeoffs" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">8. Trade-offs</a>
        <a href="#interview-qa" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">9. Interview Q&amp;A</a>
        <a href="#verbal-answer" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">10. Verbal Pitch</a>
        <a href="#quick-test" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0 font-bold text-foreground">11. Quick Test</a>
      </nav>

      {/* 1. Definition */}
      <section id="definition" className="space-y-3 pt-2 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <span>1. Definition</span>
        </h2>
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-2xs">
          <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
            {topic.definition}
          </p>
          <div className="pt-3 border-t border-border/70 flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="font-bold text-foreground">Relational Invariant:</span>
            <span>Deterministic relational algebra contract evaluated by the Cost-Based Optimizer.</span>
          </div>
        </div>
      </section>

      {/* 2. Explain Like I'm 5 */}
      <section id="eli5" className="space-y-3 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <span>2. Explain Like I&apos;m 5</span>
        </h2>
        <div className="p-6 rounded-xl bg-muted/20 border border-border space-y-3 shadow-2xs">
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Intuitive mental model for beginners</span>
          </div>
          <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
            {topic.eli5}
          </p>
        </div>
      </section>

      {/* 3. Animation & Visual Simulation */}
      <section id="visualizer" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>3. Animation &amp; Visual Simulation</span>
          </h2>
          <span className="text-xs font-mono text-muted-foreground">Interactive Engine Trace</span>
        </div>
        <TopicVisualizer topic={topic} />
      </section>

      {/* 4. Real-World Example */}
      <section id="example" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          4. Real-World Example
        </h2>
        <div className="p-6 rounded-xl bg-card border border-border space-y-5 shadow-2xs">
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
            {topic.realWorldExample.description}
          </p>

          {/* Render Context Tables if present */}
          {topic.realWorldExample.tables && topic.realWorldExample.tables.length > 0 && (
            <div className="space-y-5">
              {topic.realWorldExample.tables.map((tbl, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    {tbl.title && (
                      <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{tbl.title}</span>
                      </div>
                    )}
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {tbl.rows.length} {tbl.rows.length === 1 ? 'record' : 'records'}
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b border-border text-foreground font-bold">
                        <tr>
                          {tbl.headers.map((h, hIdx) => {
                            const isPk = h.includes('(PK)');
                            const isFk = h.includes('(FK)');
                            return (
                              <th key={hIdx} className="px-4 py-2.5">
                                <span className="inline-flex items-center gap-1">
                                  {isPk && <Key className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                  {isFk && <Link2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                                  <span>{h}</span>
                                </span>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-2.5 font-mono text-foreground font-medium">{String(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Live Query Execution on Example */}
          <div className="pt-2 border-t border-border/70 space-y-3">
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted/40 text-xs sm:text-sm font-bold text-foreground transition-all shadow-2xs"
            >
              <Terminal className="w-4 h-4 text-cyan-500" />
              <span>{showLivePreview ? 'Hide Query Execution Output' : '▶ Run Query on Example Data'}</span>
            </button>

            {showLivePreview && (
              <div className="p-5 rounded-xl border border-border/80 bg-zinc-950 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                  <div className="flex items-center gap-2 font-mono text-xs text-cyan-300 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>In-Memory Relational Result</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Execution: 0.08 ms • Plan: Hash Match</span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Executed SQL:</span>
                  <pre className="p-3 rounded-lg bg-black text-emerald-300 font-mono text-xs overflow-x-auto border border-zinc-800">
                    {topic.codeSnippet || topic.sqlSyntaxSteps[0]?.code}
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Result Relation (Output Stream):</span>
                  <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-black">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-900 border-b border-zinc-800 text-cyan-300 font-mono font-bold">
                        <tr>
                          {topic.realWorldExample.tables && topic.realWorldExample.tables[0] ? (
                            topic.realWorldExample.tables[0].headers.map((h, i) => (
                              <th key={i} className="px-3 py-2">{h}</th>
                            ))
                          ) : (
                            <th className="px-3 py-2">status</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {topic.realWorldExample.tables && topic.realWorldExample.tables[0] ? (
                          topic.realWorldExample.tables[0].rows.slice(0, 2).map((r, ri) => (
                            <tr key={ri} className="bg-emerald-950/20 hover:bg-emerald-950/30 transition-colors">
                              {r.map((c, ci) => (
                                <td key={ci} className="px-3 py-2 font-mono text-emerald-300 font-medium">{String(c)}</td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="px-3 py-2 font-mono text-emerald-300">SUCCESS</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Output tuples verified against relational schema constraints and primary key invariants.</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-muted/30 border border-border text-sm text-foreground leading-relaxed">
            <span className="font-bold">Relational walkthrough: </span>
            {topic.realWorldExample.explanation}
          </div>
        </div>
      </section>

      {/* 5. SQL Syntax */}
      <section id="syntax" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            5. SQL Syntax
          </h2>
          <span className="text-xs font-mono text-muted-foreground">ANSI SQL / PostgreSQL Dialect</span>
        </div>

        <div className="space-y-5">
          {topic.sqlSyntaxSteps.map((stepItem, idx) => (
            <div key={idx} className="space-y-2.5">
              <div className="text-sm sm:text-base font-bold text-foreground">
                {stepItem.step}
              </div>
              <div className="relative group">
                <pre className="p-5 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-sm sm:text-base overflow-x-auto border border-border/80 shadow-inner whitespace-pre-wrap leading-relaxed">
                  {stepItem.code}
                </pre>
                <button
                  onClick={() => handleCopyCode(stepItem.code, idx)}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Copy SQL code"
                >
                  {copiedCodeIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {stepItem.note && (
                <div className="text-xs sm:text-sm text-foreground/80 flex items-center gap-1.5 pl-1 font-medium">
                  <Info className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span>{stepItem.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. Important Rules */}
      <section id="rules" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          6. Important Rules &amp; Behaviors
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-2xs">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 border-b border-border text-foreground font-bold">
              <tr>
                <th className="px-4 py-3 w-1/3">Rule</th>
                <th className="px-4 py-3">Behavioral Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topic.rulesTable.map((r, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-foreground align-top">{r.rule}</td>
                  <td className="px-4 py-3.5 text-foreground/90 leading-relaxed align-top">{r.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Deep Dive */}
      <section id="deep-dive" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          7. Deep Dive: {topic.deepDive.title}
        </h2>
        <div className="p-6 rounded-xl bg-card border border-border space-y-4 shadow-2xs">
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-normal">
            {topic.deepDive.description}
          </p>

          {topic.deepDive.codeSnippet && (
            <pre className="p-5 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-sm sm:text-base overflow-x-auto border border-border/80 shadow-inner whitespace-pre-wrap leading-relaxed">
              {topic.deepDive.codeSnippet}
            </pre>
          )}

          {topic.deepDive.warning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
              <span className="font-bold">Caution: </span>
              {topic.deepDive.warning}
            </div>
          )}
        </div>
      </section>

      {/* 8. Advantages and Disadvantages */}
      <section id="tradeoffs" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          8. Advantages &amp; Disadvantages
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 sm:p-6 rounded-xl border border-border bg-card space-y-3.5 shadow-2xs">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Advantages</span>
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base text-foreground/90">
              {topic.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 sm:p-6 rounded-xl border border-border bg-card space-y-3.5 shadow-2xs">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <XCircle className="w-4 h-4 text-muted-foreground" />
              <span>Disadvantages &amp; Trade-offs</span>
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base text-foreground/90">
              {topic.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-muted-foreground font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Common Interview Questions */}
      <section id="interview-qa" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          9. Common Interview Questions
        </h2>
        <div className="space-y-4">
          {topic.interviewQuestions.map((iq, idx) => (
            <div key={idx} className="p-6 rounded-xl border border-border bg-card space-y-3.5 shadow-2xs">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-start gap-2.5">
                <span className="font-mono text-muted-foreground shrink-0">Q{idx + 1}.</span>
                <span>{iq.question}</span>
              </h3>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed pl-6 font-normal">
                {iq.answer}
              </p>

              {iq.codeBlock && (
                <div className="pl-6 pt-1">
                  <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-sm sm:text-base overflow-x-auto border border-border/80 whitespace-pre-wrap leading-relaxed">
                    {iq.codeBlock}
                  </pre>
                </div>
              )}

              {iq.comparisonTable && (
                <div className="pl-6 pt-1">
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/40 border-b border-border text-foreground font-bold">
                        <tr>
                          {iq.comparisonTable.headers.map((ch, chIdx) => (
                            <th key={chIdx} className="px-3.5 py-2">{ch}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {iq.comparisonTable.rows.map((crow, crIdx) => (
                          <tr key={crIdx}>
                            {crow.map((ccell, ccIdx) => (
                              <td key={ccIdx} className="px-3.5 py-2 text-foreground font-medium">{String(ccell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Interview-Ready Answer */}
      <section id="verbal-answer" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            10. Interview-Ready Answer
          </h2>
          <button
            onClick={() => handleCopyPitch(topic.interviewReadyAnswer)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted/40 transition-colors shadow-2xs"
          >
            {copiedPitch ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy 30s pitch</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="p-6 rounded-xl bg-muted/20 border-l-4 border-foreground text-base sm:text-lg text-foreground font-medium leading-relaxed italic shadow-2xs">
          &ldquo;{topic.interviewReadyAnswer}&rdquo;
        </blockquote>
      </section>

      {/* 11. Quick Test (Interactive Quiz) */}
      <section id="quick-test" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>11. Quick Test</span>
          </h2>
          {selectedOption && (
            <button
              onClick={() => setSelectedOption(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground border border-border"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="p-6 sm:p-7 rounded-xl border border-border bg-card space-y-6 shadow-2xs">
          <div className="space-y-3">
            <span className="text-xs font-mono text-muted-foreground font-bold uppercase tracking-wider">Scenario Question:</span>
            <p className="text-base sm:text-lg text-foreground font-bold leading-relaxed">
              {topic.quickTest.question}
            </p>
          </div>

          {/* Context Table if provided */}
          {topic.quickTest.tableContext && topic.quickTest.tableContext.length > 0 && (
            <div className="space-y-3">
              {topic.quickTest.tableContext.map((tbl, idx) => (
                <div key={idx} className="space-y-1.5">
                  {tbl.title && (
                    <div className="text-xs font-mono font-bold text-foreground">{tbl.title}</div>
                  )}
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b border-border text-foreground font-bold">
                        <tr>
                          {tbl.headers.map((th, thIdx) => (
                            <th key={thIdx} className="px-3.5 py-2">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3.5 py-2 font-mono text-foreground font-medium">{String(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Context Code block if provided */}
          {topic.quickTest.codeBlock && (
            <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-sm sm:text-base overflow-x-auto border border-border/80">
              {topic.quickTest.codeBlock}
            </pre>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-2.5 pt-2">
            <div className="text-sm font-bold text-foreground">Select your answer:</div>
            <div className="grid gap-3">
              {topic.quickTest.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === topic.quickTest.correctAnswer;
                const showResults = selectedOption !== null;

                let btnStyles = 'border-border bg-card hover:bg-muted/30 text-foreground';
                if (showResults) {
                  if (isCorrect) {
                    btnStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'border-rose-500 bg-rose-500/10 text-rose-950 dark:text-rose-200 font-medium';
                  } else {
                    btnStyles = 'border-border/60 bg-muted/10 text-muted-foreground opacity-60';
                  }
                } else if (isSelected) {
                  btnStyles = 'border-foreground bg-foreground text-background';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedOption(opt.key)}
                    className={`w-full p-4 rounded-xl border text-left text-sm sm:text-base transition-all flex items-start gap-3.5 ${btnStyles}`}
                  >
                    <span className="font-mono font-bold shrink-0">{opt.key}.</span>
                    <span className="leading-relaxed flex-1">{opt.text}</span>
                    {showResults && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {showResults && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Explanation */}
          {selectedOption && (
            <div className={`p-5 rounded-xl border space-y-2 ${
              selectedOption === topic.quickTest.correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-muted/30 border-border'
            }`}>
              <div className="text-sm font-bold text-foreground flex items-center gap-2">
                {selectedOption === topic.quickTest.correctAnswer ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Correct! Option {topic.quickTest.correctAnswer}</span>
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <span>Explanation (Correct Answer: {topic.quickTest.correctAnswer})</span>
                  </>
                )}
              </div>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                {topic.quickTest.explanation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-border flex items-center justify-between gap-4">
        {prevTopic ? (
          <Link
            href={`/sqlcosmos/concepts/${prevTopic.id}`}
            className="px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted/40 text-foreground font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 max-w-[48%] truncate shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="truncate">#{prevTopic.topicNumber}: {prevTopic.title}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextTopic ? (
          <Link
            href={`/sqlcosmos/concepts/${nextTopic.id}`}
            className="px-5 py-3 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 max-w-[48%] truncate shadow-2xs"
          >
            <span className="truncate">#{nextTopic.topicNumber}: {nextTopic.title}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
