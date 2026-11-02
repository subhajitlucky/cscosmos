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
  Sparkles
} from 'lucide-react';
import { MONGO_FLASHCARDS } from '../data/flashcards';

const CATEGORIES = [
  'All',
  'Storage & BSON',
  'WiredTiger Internals',
  'Indexing & Querying',
  'Aggregation & Modeling',
  'Replication & Sharding',
] as const;

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDirectory, setShowDirectory] = useState<boolean>(false);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: MONGO_FLASHCARDS.length };
    for (const card of MONGO_FLASHCARDS) {
      counts[card.category] = (counts[card.category] || 0) + 1;
    }
    return counts;
  }, []);

  // Filter cards by category & search query
  const filteredCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MONGO_FLASHCARDS.filter((card) => {
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
      const globalIdx = MONGO_FLASHCARDS.findIndex((c) => c.id === cardId);
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
          <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Spaced recall trainer • {MONGO_FLASHCARDS.length} staff/senior questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          MongoDB &amp; Document Engine Senior Interview Flashcards
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Master tricky questions on BSON length prefixes, WiredTiger hazard pointers, ESR index ordering, readConcern majority, and Raft consensus.
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
            <label htmlFor="mongo-question-jump-select" className="sr-only">
              Jump to specific question
            </label>
            <select
              id="mongo-question-jump-select"
              aria-label="Jump to specific question"
              value={currentCard?.id || ''}
              onChange={(e) => handleSelectCardById(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-1 focus:ring-foreground transition"
            >
              {filteredCards.map((card, idx) => (
                <option key={card.id} value={card.id}>
                  #{idx + 1} [{card.id.toUpperCase()}] ({card.difficulty}) {card.question.slice(0, 75)}...
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground transition placeholder:text-muted-foreground"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Directory Drawer Button */}
          <button
            onClick={() => setShowDirectory(true)}
            className="px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs whitespace-nowrap"
          >
            <ListOrdered className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Question List</span>
          </button>
        </div>
      </div>

      {/* Flashcard Main Surface */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-4">
          <div
            onClick={() => setIsFlipped((v) => !v)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped((v) => !v);
              }
            }}
            className="cursor-pointer min-h-[340px] p-6 sm:p-8 rounded-2xl border border-border bg-card hover:border-foreground/40 transition-all shadow-xs flex flex-col justify-between select-none relative group"
          >
            {/* Card Meta Top */}
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {currentCard.id.toUpperCase()}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs font-medium text-muted-foreground">{currentCard.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-muted text-muted-foreground">
                  {currentCard.difficulty}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  {activeIndex + 1} / {filteredCards.length}
                </span>
              </div>
            </div>

            {/* Front (Question) vs Back (Answer) */}
            <div className="py-6 space-y-4">
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    Interview Question:
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
                    {currentCard.question}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Engine Answer:
                  </span>
                  <p className="text-sm sm:text-base text-foreground leading-relaxed">
                    {currentCard.answer}
                  </p>
                  {currentCard.code && (
                    <pre className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground overflow-x-auto">
                      {currentCard.code}
                    </pre>
                  )}
                  <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Pro-Tip:</strong> {currentCard.tip}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Tap to Flip Prompt */}
            <div className="pt-3 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
              <span>{isFlipped ? 'Tap to view Question' : 'Tap to reveal Answer'}</span>
              <span className="font-mono text-[11px]">Space / Click to Flip</span>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-foreground font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Card</span>
            </button>

            <button
              onClick={handleRandom}
              className="px-3.5 py-2 rounded-lg border border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground text-xs font-medium transition shadow-xs flex items-center gap-1.5"
              title="Shuffle Random Card"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Random</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <span>Next Card</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm space-y-2">
          <p className="font-semibold text-foreground">No flashcards matched your query</p>
          <button
            onClick={() => {
              setSelectedCat('All');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/40 text-xs font-semibold text-foreground transition"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Directory Modal / Drawer */}
      {showDirectory && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-bold text-sm text-foreground">
                  Interview Questions Directory ({MONGO_FLASHCARDS.length})
                </h3>
              </div>
              <button
                onClick={() => setShowDirectory(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 border-b border-border bg-muted/20">
              <input
                type="text"
                placeholder="Search question titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="p-2 overflow-y-auto space-y-1 divide-y divide-border/40">
              {filteredCards.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => handleSelectCardById(card.id)}
                  className="p-2.5 rounded-lg hover:bg-muted/40 cursor-pointer transition flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                        #{idx + 1} {card.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                        {card.difficulty}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">{card.category}</span>
                    </div>
                    <p className="text-foreground font-medium line-clamp-1">{card.question}</p>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold shrink-0">
                    Jump →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
