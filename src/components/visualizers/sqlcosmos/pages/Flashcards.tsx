'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  HelpCircle,
  Lightbulb,
  ListOrdered,
  RotateCcw,
  Search,
  Shuffle,
  X,
} from 'lucide-react';
import { SQL_FLASHCARDS } from '../data/flashcards';

const CATEGORIES = [
  'All',
  'Indexing & Performance',
  'Query Execution',
  'Transactions & MVCC',
  'Architecture',
] as const;

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDirectory, setShowDirectory] = useState<boolean>(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SQL_FLASHCARDS.length };
    for (const card of SQL_FLASHCARDS) {
      counts[card.category] = (counts[card.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter cards by category & search query
  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return SQL_FLASHCARDS.filter((card) => {
      const matchesCat = selectedCat === 'All' || card.category === selectedCat;
      if (!matchesCat) return false;
      if (!query) return true;
      return (
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query) ||
        card.tip.toLowerCase().includes(query) ||
        card.difficulty.toLowerCase().includes(query) ||
        card.id.toLowerCase().includes(query) ||
        (card.code && card.code.toLowerCase().includes(query))
      );
    });
  }, [selectedCat, searchQuery]);

  const activeIndex = Math.min(currentIndex, Math.max(0, filteredCards.length - 1));
  const currentCard = filteredCards[activeIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const handleRandom = () => {
    if (filteredCards.length <= 1) return;
    let nextIdx = activeIndex;
    while (nextIdx === activeIndex) {
      nextIdx = Math.floor(Math.random() * filteredCards.length);
    }
    setIsFlipped(false);
    setCurrentIndex(nextIdx);
  };

  const handleSelectCardById = (cardId: string) => {
    const targetIdx = filteredCards.findIndex((c) => c.id === cardId);
    if (targetIdx !== -1) {
      setCurrentIndex(targetIdx);
      setIsFlipped(false);
    } else {
      const globalIdx = SQL_FLASHCARDS.findIndex((c) => c.id === cardId);
      if (globalIdx !== -1) {
        setSelectedCat('All');
        setSearchQuery('');
        setCurrentIndex(globalIdx);
        setIsFlipped(false);
      }
    }
    setShowDirectory(false);
  };

  return (
    <div className="space-y-8 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
          <Database className="w-3.5 h-3.5" />
          <span>Spaced recall trainer • {SQL_FLASHCARDS.length} staff/senior questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          SQL &amp; Database Senior Interview Flashcards
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Master tricky database engineering questions covering B+ Tree fanout, Leftmost Prefix Rule, Write Skew, and MVCC.
        </p>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCat === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCat(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-foreground text-background border-foreground font-semibold shadow-xs'
                  : 'bg-card border-border text-foreground hover:bg-muted/40 hover:border-foreground/30'
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                }`}
              >
                {categoryCounts[cat] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Jump to Question & Search Controls */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Direct Question Dropdown Selector */}
          <div className="flex-1 relative">
            <label htmlFor="question-jump-select" className="sr-only">
              Jump to specific question
            </label>
            <select
              id="question-jump-select"
              aria-label="Jump to specific question"
              value={currentCard?.id || ''}
              onChange={(e) => handleSelectCardById(e.target.value)}
              className="w-full h-10 px-3 pr-8 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 cursor-pointer text-ellipsis overflow-hidden"
            >
              {filteredCards.map((card, idx) => (
                <option key={card.id} value={card.id}>
                  #{idx + 1}. [{card.difficulty}] {card.question.length > 75 ? `${card.question.slice(0, 75)}…` : card.question}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search Input */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search questions by keyword"
              placeholder="Search (e.g. deadlock, MVCC)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="w-full h-10 pl-9 pr-8 rounded-lg border border-border bg-background text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Directory Toggle Button */}
          <button
            onClick={() => setShowDirectory((prev) => !prev)}
            className={`h-10 px-3.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition shrink-0 ${
              showDirectory
                ? 'bg-foreground text-background border-foreground shadow-xs'
                : 'border-border bg-background text-foreground hover:bg-muted/40'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>{showDirectory ? 'Hide Directory' : `Directory (${filteredCards.length})`}</span>
          </button>
        </div>

        {/* Directory Drawer / Question Index Panel */}
        {showDirectory && (
          <div className="pt-3 border-t border-border space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Click any question below to jump directly to it:</span>
              <span className="font-mono">{filteredCards.length} questions available</span>
            </div>
            <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1 text-xs">
              {filteredCards.map((card, idx) => {
                const isActive = card.id === currentCard?.id;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleSelectCardById(card.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition flex items-start gap-2.5 ${
                      isActive
                        ? 'border-foreground bg-muted font-medium shadow-xs'
                        : 'border-border/60 bg-background hover:bg-muted/30 hover:border-foreground/30'
                    }`}
                  >
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold bg-muted border border-border text-foreground shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-muted-foreground">{card.category}</span>
                        <span className="text-[10px] font-mono px-1.5 rounded-xs bg-muted/60 border border-border text-foreground">
                          {card.difficulty}
                        </span>
                      </div>
                      <p className="text-foreground leading-snug line-clamp-2">{card.question}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {filteredCards.length === 0 ? (
        <div className="min-h-[260px] p-8 rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">No questions found</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            No questions matched your search query &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCat}&rdquo;.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCat('All');
              setCurrentIndex(0);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
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
            className="min-h-[360px] p-8 rounded-xl border border-border bg-card hover:border-foreground/40 shadow-xs cursor-pointer transition-colors flex flex-col justify-between select-none relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md border border-border bg-muted/30 text-foreground text-xs font-mono font-medium">
                  {currentCard.category}
                </span>
                <span className="text-xs font-mono text-muted-foreground">{currentCard.difficulty}</span>
              </div>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                Card {activeIndex + 1} of {filteredCards.length}
              </span>
            </div>

            {/* Card Content */}
            <div className="py-6 space-y-4">
              {!isFlipped ? (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-muted-foreground" /> Question:
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-relaxed">
                    {currentCard.question}
                  </h2>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Answer:
                  </div>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed font-medium">
                    {currentCard.answer}
                  </p>
                  {currentCard.code && (
                    <pre className="p-3.5 rounded-lg bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-border/80">
                      {currentCard.code}
                    </pre>
                  )}
                  <div className="p-3 rounded-lg bg-muted/30 border border-border text-xs text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong>Key takeaway:</strong> {currentCard.tip}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/70 flex items-center justify-between text-xs text-muted-foreground">
              <span>Click anywhere on card to {isFlipped ? 'flip back' : 'reveal answer'}</span>
              <span className="text-foreground font-semibold group-hover:underline">Flip card</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous Card</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRandom}
                className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Jump to a random question"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Random</span>
              </button>

              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className="p-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground transition cursor-pointer"
                title="Restart deck"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-foreground hover:bg-foreground/90 text-background text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Next Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
