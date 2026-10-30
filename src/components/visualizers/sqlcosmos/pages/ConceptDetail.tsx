'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  HelpCircle,
  Info,
  RotateCcw,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';
import { SQL_TOPICS, SqlTopic } from '../data/topics';

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

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-snug">
          # Topic {topic.topicNumber}: {topic.title}
        </h1>

        <p className="text-base text-muted-foreground leading-relaxed">
          {topic.summary}
        </p>
      </div>

      {/* Quick Jump Navigation Pill Bar */}
      <nav aria-label="Section navigation" className="sticky top-20 z-40 p-2 rounded-xl bg-card/90 backdrop-blur-md border border-border shadow-xs overflow-x-auto flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <a href="#definition" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">1. Definition</a>
        <a href="#eli5" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">2. ELI5</a>
        <a href="#example" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">3. Example</a>
        <a href="#syntax" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">4. Syntax</a>
        <a href="#rules" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">5. Rules</a>
        <a href="#deep-dive" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">6. Deep Dive</a>
        <a href="#tradeoffs" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">7. Trade-offs</a>
        <a href="#interview-qa" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">8. Interview Q&amp;A</a>
        <a href="#verbal-answer" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0">9. Verbal Answer</a>
        <a href="#quick-test" className="px-2.5 py-1 rounded-lg hover:text-foreground hover:bg-muted/50 transition-colors shrink-0 font-semibold text-foreground">10. Quick Test</a>
      </nav>

      {/* 1. Definition */}
      <section id="definition" className="space-y-3 pt-2 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <span>1. Definition</span>
        </h2>
        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
          <p className="text-base text-foreground leading-relaxed">
            {topic.definition}
          </p>
          <div className="pt-3 border-t border-border/70 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Key takeaway:</span>
            <span>Enforces engine invariants and structural predictability across transactions.</span>
          </div>
        </div>
      </section>

      {/* 2. Explain Like I'm 5 */}
      <section id="eli5" className="space-y-3 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
          <span>2. Explain Like I&apos;m 5</span>
        </h2>
        <div className="p-6 rounded-xl bg-muted/20 border border-border space-y-3">
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-foreground" />
            <span>Intuitive mental model</span>
          </div>
          <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
            {topic.eli5}
          </p>
        </div>
      </section>

      {/* 3. Real-World Example */}
      <section id="example" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          3. Real-World Example
        </h2>
        <div className="p-6 rounded-xl bg-card border border-border space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {topic.realWorldExample.description}
          </p>

          {/* Render Context Tables if present */}
          {topic.realWorldExample.tables && topic.realWorldExample.tables.length > 0 && (
            <div className="space-y-4">
              {topic.realWorldExample.tables.map((tbl, idx) => (
                <div key={idx} className="space-y-2">
                  {tbl.title && (
                    <div className="text-xs font-mono font-semibold text-foreground">
                      {tbl.title}
                    </div>
                  )}
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                        <tr>
                          {tbl.headers.map((h, hIdx) => (
                            <th key={hIdx} className="px-3.5 py-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3.5 py-2 font-mono text-muted-foreground">{String(cell)}</td>
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

          <div className="p-3.5 rounded-lg bg-muted/30 border border-border/80 text-xs text-foreground leading-relaxed">
            <span className="font-semibold">Relational walkthrough: </span>
            {topic.realWorldExample.explanation}
          </div>
        </div>
      </section>

      {/* 4. SQL Syntax */}
      <section id="syntax" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            4. SQL Syntax
          </h2>
          <span className="text-xs font-mono text-muted-foreground">ANSI SQL / PostgreSQL</span>
        </div>

        <div className="space-y-4">
          {topic.sqlSyntaxSteps.map((stepItem, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-xs font-semibold text-foreground">
                {stepItem.step}
              </div>
              <div className="relative group">
                <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto border border-border/80 shadow-inner whitespace-pre-wrap leading-relaxed">
                  {stepItem.code}
                </pre>
                <button
                  onClick={() => handleCopyCode(stepItem.code, idx)}
                  className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Copy SQL code"
                >
                  {copiedCodeIndex === idx ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {stepItem.note && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 pl-1">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{stepItem.note}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. Important Rules */}
      <section id="rules" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          5. Important Rules &amp; Behaviors
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/40 border-b border-border text-foreground font-semibold">
              <tr>
                <th className="px-4 py-2.5 w-1/3">Rule</th>
                <th className="px-4 py-2.5">Behavioral Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topic.rulesTable.map((r, idx) => (
                <tr key={idx} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{r.rule}</td>
                  <td className="px-4 py-3 text-muted-foreground leading-relaxed">{r.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Deep Dive */}
      <section id="deep-dive" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          6. Deep Dive: {topic.deepDive.title}
        </h2>
        <div className="p-6 rounded-xl bg-card border border-border space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {topic.deepDive.description}
          </p>

          {topic.deepDive.codeSnippet && (
            <pre className="p-4 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto border border-border/80 shadow-inner whitespace-pre-wrap leading-relaxed">
              {topic.deepDive.codeSnippet}
            </pre>
          )}

          {topic.deepDive.warning && (
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
              <span className="font-bold">Caution: </span>
              {topic.deepDive.warning}
            </div>
          )}
        </div>
      </section>

      {/* 7. Advantages and Disadvantages */}
      <section id="tradeoffs" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          7. Advantages &amp; Disadvantages
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-border bg-card space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Advantages</span>
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {topic.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span className="leading-relaxed">{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-xl border border-border bg-card space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-muted-foreground" />
              <span>Disadvantages &amp; Trade-offs</span>
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {topic.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-muted-foreground font-bold">•</span>
                  <span className="leading-relaxed">{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Common Interview Questions */}
      <section id="interview-qa" className="space-y-4 scroll-mt-28">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          8. Common Interview Questions
        </h2>
        <div className="space-y-3">
          {topic.interviewQuestions.map((iq, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-border bg-card space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-start gap-2">
                <span className="font-mono text-muted-foreground shrink-0">Q{idx + 1}.</span>
                <span>{iq.question}</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                {iq.answer}
              </p>

              {iq.codeBlock && (
                <div className="pl-6 pt-1">
                  <pre className="p-3.5 rounded-lg bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto border border-border/80 whitespace-pre-wrap leading-relaxed">
                    {iq.codeBlock}
                  </pre>
                </div>
              )}

              {iq.comparisonTable && (
                <div className="pl-6 pt-1">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/40 border-b border-border text-foreground font-semibold">
                        <tr>
                          {iq.comparisonTable.headers.map((ch, chIdx) => (
                            <th key={chIdx} className="px-3 py-1.5">{ch}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {iq.comparisonTable.rows.map((crow, crIdx) => (
                          <tr key={crIdx}>
                            {crow.map((ccell, ccIdx) => (
                              <td key={ccIdx} className="px-3 py-1.5 text-muted-foreground">{String(ccell)}</td>
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

      {/* 9. Interview-Ready Answer */}
      <section id="verbal-answer" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            9. Interview-Ready Answer
          </h2>
          <button
            onClick={() => handleCopyPitch(topic.interviewReadyAnswer)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted/40 transition-colors"
          >
            {copiedPitch ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy pitch</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="p-6 rounded-xl bg-muted/20 border-l-4 border-foreground text-sm sm:text-base text-foreground font-medium leading-relaxed italic">
          &ldquo;{topic.interviewReadyAnswer}&rdquo;
        </blockquote>
      </section>

      {/* 10. Quick Test (Interactive Quiz) */}
      <section id="quick-test" className="space-y-4 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <span>10. Quick Test</span>
          </h2>
          {selectedOption && (
            <button
              onClick={() => setSelectedOption(null)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground border border-border"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-5">
          <div className="space-y-3">
            <span className="text-xs font-mono text-muted-foreground font-semibold">Scenario Question:</span>
            <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
              {topic.quickTest.question}
            </p>
          </div>

          {/* Context Table if provided */}
          {topic.quickTest.tableContext && topic.quickTest.tableContext.length > 0 && (
            <div className="space-y-3">
              {topic.quickTest.tableContext.map((tbl, idx) => (
                <div key={idx} className="space-y-1.5">
                  {tbl.title && (
                    <div className="text-xs font-mono font-semibold text-foreground">{tbl.title}</div>
                  )}
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                        <tr>
                          {tbl.headers.map((th, thIdx) => (
                            <th key={thIdx} className="px-3 py-1.5">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-1.5 font-mono text-muted-foreground">{String(cell)}</td>
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
            <pre className="p-3.5 rounded-lg bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto border border-border/80">
              {topic.quickTest.codeBlock}
            </pre>
          )}

          {/* Multiple Choice Options */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold text-foreground">Select your answer:</div>
            <div className="grid gap-2.5">
              {topic.quickTest.options.map((opt) => {
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === topic.quickTest.correctAnswer;
                const showResults = selectedOption !== null;

                let btnStyles = 'border-border bg-card hover:bg-muted/30 text-foreground';
                if (showResults) {
                  if (isCorrect) {
                    btnStyles = 'border-emerald-500 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'border-rose-500 bg-rose-500/10 text-rose-950 dark:text-rose-200';
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
                    className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyles}`}
                  >
                    <span className="font-mono font-bold shrink-0">{opt.key}.</span>
                    <span className="leading-relaxed flex-1">{opt.text}</span>
                    {showResults && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    )}
                    {showResults && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Result Explanation */}
          {selectedOption && (
            <div className={`p-4 rounded-xl border space-y-1.5 ${
              selectedOption === topic.quickTest.correctAnswer
                ? 'bg-emerald-500/10 border-emerald-500/20'
                : 'bg-muted/30 border-border'
            }`}>
              <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
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
              <p className="text-xs text-muted-foreground leading-relaxed">
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
            className="px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition-colors flex items-center gap-2 max-w-[48%] truncate"
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
            className="px-5 py-2.5 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-semibold text-xs transition-colors flex items-center gap-2 max-w-[48%] truncate"
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
