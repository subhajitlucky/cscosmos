'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/visualizers/golangviz/components/footer';
import { Navigation } from '@/components/visualizers/golangviz/components/navigation';
import { FLASHCARDS, Flashcard } from '@/components/visualizers/golangviz/data/flashcards-data';
import {
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Shuffle,
  Sparkles,
  Terminal,
  XCircle,
} from 'lucide-react';

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>(FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [knownCards, setKnownCards] = useState<Record<string, boolean>>({});

  const categories = ['All', 'Fundamentals', 'Concurrency', 'Memory & Slices', 'Interfaces & Types', 'Runtime & GC'];

  const filteredCards = cards.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const markKnown = (known: boolean) => {
    if (currentCard) {
      setKnownCards((prev) => ({ ...prev, [currentCard.id]: known }));
    }
    handleNext();
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 space-y-8 pb-20 pt-6">
        {/* Header Hero */}
        <div className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-xl relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5" /> Spaced Repetition Memory Trainer
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
                Go Senior Interview Flashcards
              </h1>
              <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                Test your mastery on memory layouts, slice headers, interface itabs, channel deadlocks, and runtime scheduler rules.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffle}
                className="px-3.5 py-2 rounded-xl bg-[var(--panel)] border border-[var(--panel-border)] hover:border-purple-500 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Shuffle className="w-3.5 h-3.5 text-purple-500" />
                <span>Shuffle Deck</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-2 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-purple-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Flashcard Component */}
        {currentCard ? (
          <div className="space-y-6">
            {/* Card Counter Bar */}
            <div className="flex items-center justify-between text-xs text-[var(--muted)] px-2">
              <span className="font-mono font-bold">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                {currentCard.category}
              </span>
            </div>

            {/* Flip Card Container */}
            <div
              onClick={() => setIsFlipped((prev) => !prev)}
              className="cursor-pointer min-h-[300px] rounded-3xl border border-[var(--panel-border)] bg-[var(--panel)] p-8 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-purple-500/50 relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--panel-border)] pb-3">
                <span className="font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider text-[11px]">
                  {isFlipped ? '💡 Answer & Technical Explanation' : '❓ Technical Question'}
                </span>
                <span className="text-[11px] italic">Click to {isFlipped ? 'show question' : 'reveal answer'}</span>
              </div>

              <div className="my-6 space-y-4">
                {!isFlipped ? (
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--foreground)] leading-relaxed">
                    {currentCard.question}
                  </h2>
                ) : (
                  <div className="space-y-4 animate-in fade-in">
                    <p className="text-base sm:text-lg text-[var(--foreground)] leading-relaxed">
                      {currentCard.answer}
                    </p>

                    {currentCard.codeSnippet && (
                      <div className="rounded-2xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 p-4 shadow-sm">
                        <pre className="text-xs font-mono overflow-x-auto text-purple-200">
                          <code>{currentCard.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center text-xs text-[var(--muted)] pt-3 border-t border-[var(--panel-border)]">
                {isFlipped ? 'Click again to flip back' : 'Click card to flip and verify your answer'}
              </div>
            </div>

            {/* Answer Feedback & Navigation Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] hover:border-purple-500 text-[var(--foreground)]"
                  title="Previous Card"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-3 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] hover:border-purple-500 text-[var(--foreground)]"
                  title="Next Card"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => markKnown(false)}
                  className="px-5 py-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold text-xs flex items-center gap-2 transition"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Need Review</span>
                </button>

                <button
                  onClick={() => markKnown(true)}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Know This!</span>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
