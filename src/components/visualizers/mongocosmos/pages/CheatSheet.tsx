'use client';

import React, { useState } from 'react';
import {
  FileCode2,
  Copy,
  Check,
  Search,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { MONGO_CHEATSHEET, MongoCheatSheetSection, MongoCheatSheetRecipe } from '../data/cheatsheet';

export default function CheatSheet() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSections = MONGO_CHEATSHEET.filter((sec) => {
    if (selectedSection !== 'all' && sec.id !== selectedSection) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      sec.title.toLowerCase().includes(q) ||
      sec.subtitle.toLowerCase().includes(q) ||
      sec.recipes.some(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q)
      )
    );
  });

  return (
    <div className="space-y-10 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-10 text-foreground">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <FileCode2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Production Reference • 8 Architectural Modules</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          MongoDB Performance &amp; Architecture Cheatsheet
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Production-tested patterns for ESR index ordering, 100MB aggregation memory boundaries, WiredTiger cache tuning, writeConcern/readConcern guarantees, and change streams.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rules, syntax, ESR, memory limits, change streams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-colors shadow-xs"
          />
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedSection('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedSection === 'all'
                ? 'bg-foreground text-background font-semibold shadow-xs'
                : 'border border-border bg-card hover:bg-muted/40 text-muted-foreground'
            }`}
          >
            All Sections ({MONGO_CHEATSHEET.length})
          </button>
          {MONGO_CHEATSHEET.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedSection(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedSection === s.id
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'border border-border bg-card hover:bg-muted/40 text-muted-foreground'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Cheatsheet Sections List */}
      <div className="space-y-10">
        {filteredSections.map((sec) => (
          <section key={sec.id} className="space-y-4">
            <div className="border-b border-border/80 pb-2">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 dark:text-emerald-400" />
                <span>{sec.title}</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">{sec.subtitle}</p>
            </div>

            <div className="grid gap-4">
              {sec.recipes.map((recipe, idx) => {
                const itemId = `${sec.id}-${idx}`;
                const isCopied = copiedId === itemId;

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-foreground">{recipe.title}</h3>
                      <button
                        type="button"
                        onClick={() => handleCopy(recipe.code, itemId)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{recipe.description}</p>

                    <pre className="p-3.5 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
                      {recipe.code}
                    </pre>

                    {recipe.pitfall && (
                      <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold">Caveat / Pitfall: </strong>
                          {recipe.pitfall}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
