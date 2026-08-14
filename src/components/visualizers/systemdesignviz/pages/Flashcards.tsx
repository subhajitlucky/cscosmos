'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, LayoutGrid, Lightbulb, RotateCcw } from 'lucide-react';
import { SYSTEM_DESIGN_FLASHCARDS, type SystemDesignFlashcard } from '../data/flashcards';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filteredCards = selectedCat === 'All'
    ? SYSTEM_DESIGN_FLASHCARDS
    : SYSTEM_DESIGN_FLASHCARDS.filter((c) => c.category === selectedCat);

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
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
          <LayoutGrid className="w-3.5 h-3.5" /> Spaced Recall Trainer
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Staff Architect System Design Flashcards
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Master tough FAANG Staff Architect interview questions on quorum math, XFetch proofs, and WAL crash recovery.
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {['All', 'Distributed Systems & Consensus', 'Data Partitioning & Replication', 'Resilience & High Availability', 'High Scale Architecture'].map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCat(cat);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedCat === cat
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-card border border-border text-foreground hover:border-indigo-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Interactive Card */}
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className="min-h-[360px] p-8 rounded-3xl border border-border bg-card hover:border-indigo-500/50 shadow-xl cursor-pointer transition-all flex flex-col justify-between select-none relative group"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase">
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
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" /> Question:
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-relaxed">
                {currentCard.question}
              </h2>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Answer:
              </div>
              <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                {currentCard.answer}
              </p>
              {currentCard.code && (
                <pre className="p-3.5 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {currentCard.code}
                </pre>
              )}
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Pro Tip:</strong> {currentCard.tip}</span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Click anywhere on card to {isFlipped ? 'flip back' : 'reveal answer'}</span>
          <span className="text-indigo-500 font-bold group-hover:underline">Flip Card 🔄</span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="px-5 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Card</span>
        </button>

        <button
          onClick={() => setIsFlipped(false)}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
        >
          <span>Next Card</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
