'use client';

import React, { useState } from 'react';
import { Bookmark, Check, Copy, Globe, Search } from 'lucide-react';
import { API_CHEATSHEET } from '../data/cheatsheet';

export default function CheatSheet() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSections = API_CHEATSHEET.map((sec) => ({
    ...sec,
    snippets: sec.snippets.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase())
    )
  })).filter((sec) => sec.snippets.length > 0);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto px-4 sm:px-6 pt-10">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-600 dark:text-pink-400 text-xs font-bold uppercase tracking-widest">
          <Bookmark className="w-3.5 h-3.5" /> API Architecture Patterns
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          API &amp; GraphQL Architecture Cheat Sheet
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Production-tested patterns for DataLoader factories, RFC 7807 problem details, and HMAC webhook verification.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patterns (e.g. dataloader, RFC 7807, HMAC, pagination)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground focus:border-pink-500 outline-none shadow-sm"
        />
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {filteredSections.map((sec) => (
          <div key={sec.id} className="space-y-4">
            <h2 className="text-lg font-bold text-foreground border-b border-border pb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-pink-500" />
              <span>{sec.title}</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {sec.snippets.map((snip, idx) => {
                const uniqueId = `${sec.id}-${idx}`;
                return (
                  <div key={idx} className="p-5 rounded-3xl bg-card border border-border space-y-3 flex flex-col justify-between shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground">{snip.title}</h3>
                        <button
                          onClick={() => handleCopy(snip.code, uniqueId)}
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

                    <pre className="p-3.5 rounded-2xl bg-slate-950 text-pink-300 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                      {snip.code}
                    </pre>

                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-[11px] text-muted-foreground">
                      <strong>Pro Tip:</strong> {snip.tip}
                    </div>
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
