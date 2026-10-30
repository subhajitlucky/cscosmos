'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Database, HelpCircle, Lightbulb, RotateCcw } from 'lucide-react';
import { SQL_FLASHCARDS } from '../data/flashcards';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filteredCards = selectedCat === 'All'
    ? SQL_FLASHCARDS
    : SQL_FLASHCARDS.filter((c) => c.category === selectedCat);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/40 text-foreground font-mono text-xs font-medium">
          <Database className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Spaced Recall Trainer • 18 Staff/Senior Cards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          SQL &amp; Database Senior Interview Flashcards
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Master tricky database engineering questions covering B+ Tree fanout, Leftmost Prefix Rule, Write Skew, and MVCC.
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {['All', 'Indexing & Performance', 'Query Execution', 'Transactions & MVCC', 'Architecture'].map((cat) => {
          const isSelected = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Interactive Card */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Flashcard: ${currentCard.question}. Press Space or Enter to reveal answer. Use arrow keys to navigate.`}
        onClick={() => setIsFlipped((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            setIsFlipped((prev) => !prev);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            handleNext();
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            handlePrev();
          }
        }}
        className="min-h-[360px] p-8 rounded-2xl border border-border bg-card hover:border-foreground/40 shadow-sm cursor-pointer transition-all flex flex-col justify-between select-none relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
      >
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-foreground text-xs font-mono font-medium">
              {currentCard.category}
            </span>
            <span className="text-xs font-mono text-muted-foreground">{currentCard.difficulty}</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            Card {currentIndex + 1} of {filteredCards.length}
          </span>
        </div>

        {/* Card Content */}
        <div className="py-6 space-y-4">
          {!isFlipped ? (
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase font-mono tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-muted-foreground" /> Question:
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-relaxed">
                {currentCard.question}
              </h2>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-[11px] font-bold uppercase font-mono tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Answer:
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                {currentCard.answer}
              </p>
              {currentCard.code && (
                <pre className="p-3.5 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-border/80">
                  {currentCard.code}
                </pre>
              )}
              <div className="p-3 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Pro Tip:</strong> {currentCard.tip}</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
          <span>Click anywhere on card to {isFlipped ? 'flip back' : 'reveal answer'}</span>
          <span className="text-foreground font-semibold group-hover:underline">Flip Card 🔄</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground text-xs font-semibold transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={() => {
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className="p-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground transition"
          title="Restart deck"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-foreground hover:bg-foreground/90 text-background text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
        >
          <span>Next Card</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
