'use client';

import React, { useState } from 'react';
import { Footer } from '@/components/visualizers/golangviz/components/footer';
import { Navigation } from '@/components/visualizers/golangviz/components/navigation';
import { CHEATSHEET_RECIPES, CheatSheetRecipe } from '@/components/visualizers/golangviz/data/cheatsheet-data';
import { Check, Copy, FileCode, Search, Sparkles, Terminal } from 'lucide-react';

export default function CheatSheetPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Concurrency', 'HTTP & Web', 'Memory & Slices', 'Error Handling', 'Testing & Benchmarks'];

  const filtered = CHEATSHEET_RECIPES.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navigation />

      <main className="max-w-6xl mx-auto px-4 space-y-8 pb-20 pt-6">
        {/* Hero Header */}
        <div className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Production Recipe Vault
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--foreground)]">
            Go 1.24+ Interactive Cheat Sheet
          </h1>
          <p className="text-sm sm:text-base text-[var(--muted)] max-w-2xl leading-relaxed">
            Battle-tested, copy-pasteable Go snippets for concurrency, HTTP servers, memory optimization, error handling, and unit testing.
          </p>

          {/* Search Bar & Category Filters */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search recipes, tags, packages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-[var(--panel-border)] text-xs text-[var(--foreground)] focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-blue-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              className="surface rounded-3xl p-6 border border-[var(--panel-border)] shadow-md flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                    {recipe.category}
                  </span>
                  <div className="flex gap-1 flex-wrap">
                    {recipe.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono text-[var(--muted)] bg-[var(--panel)] px-2 py-0.5 rounded-md border border-[var(--panel-border)]">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  {recipe.title}
                </h2>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Code Box */}
              <div className="rounded-2xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3 text-blue-400" /> snippet.go</span>
                  <button
                    onClick={() => copyCode(recipe.id, recipe.code)}
                    className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  >
                    {copiedId === recipe.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-3 text-xs font-mono overflow-x-auto leading-relaxed text-blue-200">
                  <code>{recipe.code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
