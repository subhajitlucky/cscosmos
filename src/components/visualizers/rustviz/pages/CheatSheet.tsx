'use client';

import React, { useState } from 'react';
import { 
  Terminal, 
  Search, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  HardDrive, 
  ShieldCheck,
  GitBranch
} from 'lucide-react';
import { rustCheatSheet, CheatSheetSection } from '../data/cheatsheet';

export function CheatSheet() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (syntax: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(syntax);
      setCopiedText(syntax);
      setTimeout(() => setCopiedText(null), 2000);
    }
  };

  const filteredSections = rustCheatSheet.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--rust-primary-border)] bg-[var(--rust-primary-light)] px-3 py-1 text-xs font-semibold text-[var(--rust-primary)]">
          <Terminal className="h-3.5 w-3.5" />
          <span>Quick Reference Manual</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--rust-text)] tracking-tight">
          Rust Architecture &amp; Standard Library Cheat Sheet
        </h1>
        <p className="text-sm text-[var(--rust-muted)] max-w-2xl">
          Quick syntax references, memory footprint summaries, and thread safety traits for standard library smart pointers and concurrency primitives.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--rust-muted)]" />
        <input
          type="text"
          placeholder="Filter cheat sheet items (e.g. Arc, Deref, sync_channel)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-[var(--rust-border)] bg-[var(--rust-surface)] pl-9 pr-3 py-2 text-xs text-[var(--rust-text)] placeholder-[var(--rust-muted)] focus:border-[var(--rust-primary)] focus:outline-none"
        />
      </div>

      {/* Sections Grid */}
      <div className="space-y-8">
        {filteredSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--rust-text)] flex items-center border-b border-[var(--rust-border)] pb-2">
              <span className="h-2 w-2 rounded-full bg-[var(--rust-primary)] mr-2" />
              {section.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="rust-card rounded-xl p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[var(--rust-primary)]">
                        {item.name}
                      </span>
                      <button
                        onClick={() => handleCopy(item.syntax)}
                        className="text-[var(--rust-muted)] hover:text-[var(--rust-text)] transition-colors p-1"
                        title="Copy code"
                      >
                        {copiedText === item.syntax ? (
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="font-mono text-xs p-2.5 rounded bg-[var(--rust-bg)] border border-[var(--rust-border)] text-[var(--rust-text)] overflow-x-auto">
                      <code>{item.syntax}</code>
                    </div>

                    <p className="text-xs text-[var(--rust-muted)] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.details && (
                    <div className="pt-2 border-t border-[var(--rust-border-subtle)] text-[10px] font-mono text-[var(--rust-muted)]">
                      {item.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
