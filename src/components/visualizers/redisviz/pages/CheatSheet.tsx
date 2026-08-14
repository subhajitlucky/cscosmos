'use client';

import React, { useState } from 'react';
import { Bookmark, Check, Copy, Database, Search, Terminal } from 'lucide-react';
import { REDIS_CHEATSHEET } from '../data/cheatsheet';

export default function CheatSheet() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSections = REDIS_CHEATSHEET.map((sec) => ({
    ...sec,
    snippets: sec.snippets.filter(
      (s) =>
        s.command.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.example.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((sec) => sec.snippets.length > 0);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest">
          <Bookmark className="w-3.5 h-3.5" /> Command &amp; Operations Vault
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Redis Production Command Cheat Sheet
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Time-complexity benchmarks, command syntax, administration recipes, and memory management tips.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search commands (e.g. SET, ZADD, SCAN, INFO memory)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground focus:border-red-500 outline-none shadow-sm"
        />
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {filteredSections.map((sec) => (
          <div key={sec.id} className="space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-red-500" />
              <span>{sec.title}</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {sec.snippets.map((snip, idx) => {
                const uniqueId = `${sec.id}-${idx}`;
                return (
                  <div key={idx} className="p-5 rounded-3xl bg-card border border-border space-y-3 flex flex-col justify-between shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-foreground">{snip.command}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-[10px] font-bold">
                            {snip.complexity}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(snip.example, uniqueId)}
                          className="p-1.5 rounded-lg border border-border hover:bg-muted/50 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 transition"
                        >
                          {copiedId === uniqueId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-[11px] text-emerald-500 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[11px]">Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{snip.description}</p>
                    </div>

                    <pre className="p-3.5 rounded-2xl bg-slate-950 text-red-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                      {snip.example}
                    </pre>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
