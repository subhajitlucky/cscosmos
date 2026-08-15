'use client';

import React, { useState } from 'react';
import { 
  Bookmark, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { rustFlashcards, RustFlashcard } from '../data/flashcards';

export function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const currentCard: RustFlashcard = rustFlashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < rustFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(rustFlashcards.length - 1);
    }
  };

  const toggleMastered = (id: string) => {
    if (completedIds.includes(id)) {
      setCompletedIds(completedIds.filter((item) => item !== id));
    } else {
      setCompletedIds([...completedIds, id]);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Bookmark className="h-3.5 w-3.5" />
          <span>Active Recall &amp; Memory Training</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Rust Architecture Flashcards
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Test and solidify your understanding of fat pointers, borrow checker mechanics, covariance, smart pointers, and multithreading invariants.
        </p>
      </div>

      {/* Card Container */}
      <div className="space-y-4">
        
        {/* Top Progress & Counters */}
        <div className="flex items-center justify-between text-xs font-mono text-[var(--rust-muted)]">
          <span>Card {currentIndex + 1} of {rustFlashcards.length}</span>
          <span className="text-[var(--rust-emerald)]">
            Mastered: {completedIds.length}/{rustFlashcards.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-[var(--rust-surface-2)] overflow-hidden">
          <div
            style={{ width: `${((currentIndex + 1) / rustFlashcards.length) * 100}%` }}
            className="h-full bg-[var(--rust-primary)] transition-all duration-300"
          />
        </div>

        {/* The Interactive Flashcard Box */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="cursor-pointer min-h-[320px] rounded-2xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-8 sm:p-10 shadow-lg flex flex-col justify-between transition-all hover:border-[var(--rust-primary-border)] relative overflow-hidden group"
        >
          {/* Top category badge */}
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)] font-mono text-[11px] font-bold uppercase tracking-wider">
              {currentCard.category}
            </span>
            <span className="text-xs text-[var(--rust-muted)] flex items-center group-hover:text-[var(--rust-text)]">
              {isFlipped ? <EyeOff className="mr-1 h-3.5 w-3.5" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
              {isFlipped ? 'Click to view question' : 'Click to flip answer'}
            </span>
          </div>

          {/* Central Question / Answer View */}
          <div className="my-6 space-y-4">
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-muted)] font-mono">Question:</span>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--rust-text)] leading-snug">
                  {currentCard.question}
                </h3>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-emerald)] font-mono">Core Answer:</span>
                <p className="text-base sm:text-lg font-bold text-[var(--rust-text)] leading-relaxed">
                  {currentCard.answer}
                </p>

                {currentCard.codeSnippet && (
                  <pre className="font-mono text-xs p-3 rounded-lg bg-[var(--rust-bg)] border border-[var(--rust-border)] text-[var(--rust-primary)] overflow-x-auto">
                    <code>{currentCard.codeSnippet}</code>
                  </pre>
                )}

                <div className="text-xs text-[var(--rust-muted)] leading-relaxed pt-2 border-t border-[var(--rust-border-subtle)]">
                  {currentCard.explanation}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between text-xs text-[var(--rust-muted)] pt-4 border-t border-[var(--rust-border-subtle)]">
            <span>Flip card to verify solution</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMastered(currentCard.id);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                completedIds.includes(currentCard.id)
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[var(--rust-surface-2)] text-[var(--rust-muted)] hover:text-[var(--rust-text)] border border-[var(--rust-border)]'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{completedIds.includes(currentCard.id) ? 'Mastered' : 'Mark as Mastered'}</span>
            </button>
          </div>
        </div>

        {/* Stepper Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] text-xs font-bold text-[var(--rust-text)] hover:border-[var(--rust-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              setIsFlipped(false);
              setCurrentIndex(0);
            }}
            className="flex items-center space-x-1 text-xs text-[var(--rust-muted)] hover:text-[var(--rust-text)]"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Restart Deck
          </button>

          <button
            onClick={handleNext}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[var(--rust-primary)] text-xs font-bold text-white hover:bg-[var(--rust-primary-hover)] transition-colors"
          >
            <span>Next Card</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
