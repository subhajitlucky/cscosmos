'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, CheckCircle2, Hash, Layers, Sparkles, Terminal } from 'lucide-react';

export function CssSpecificityCalculator() {
  const [selector, setSelector] = useState('nav#main-nav ul.menu li.active > a:hover');

  const specificity = useMemo(() => {
    let ids = 0;
    let classes = 0;
    let elements = 0;

    // Count IDs (#id)
    const idMatches = selector.match(/#[a-zA-Z0-9_-]+/g) || [];
    ids = idMatches.length;

    // Count Classes (.class), Attributes ([attr]), and Pseudo-classes (:hover, not ::before)
    const classMatches = selector.match(/\.[a-zA-Z0-9_-]+/g) || [];
    const attrMatches = selector.match(/\[[^\]]+\]/g) || [];
    const pseudoClassMatches = (selector.match(/:[a-zA-Z0-9_-]+/g) || []).filter((p) => !p.startsWith('::'));

    classes = classMatches.length + attrMatches.length + pseudoClassMatches.length;

    // Count Elements (div, p, a, nav, ul, li) & Pseudo-elements (::before, ::after)
    const pseudoElemMatches = selector.match(/::[a-zA-Z0-9_-]+/g) || [];
    const tokens = selector.replace(/[#.[:][^ >+~]*/g, ' ').trim().split(/\s+|[>+~]/).filter(Boolean);
    elements = tokens.length + pseudoElemMatches.length;

    return {
      inline: 0,
      ids,
      classes,
      elements,
      totalScore: ids * 100 + classes * 10 + elements
    };
  }, [selector]);

  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 dark:bg-cyan-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-cyan-600 dark:text-cyan-400">
              Interactive CSS Engine Tool
            </div>
            <h3 className="text-xl font-bold text-foreground">
              CSS Specificity &amp; Cascade Calculator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-mono text-xs font-bold">
          Cascade Weight: ({specificity.inline}, {specificity.ids}, {specificity.classes}, {specificity.elements})
        </span>
      </div>

      {/* Input Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
          Enter CSS Selector:
        </label>
        <input
          type="text"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-card border border-border font-mono text-sm text-foreground focus:border-cyan-500 outline-none shadow-inner"
        />
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => setSelector('nav#main-nav ul.menu li.active > a:hover')}
            className="text-[11px] text-cyan-500 hover:underline font-mono"
          >
            Example: Complex Nav (#main-nav .active:hover)
          </button>
          <button
            onClick={() => setSelector(':where(.card, .modal) > p.text')}
            className="text-[11px] text-cyan-500 hover:underline font-mono"
          >
            Example: :where() Reset (0 Specificity)
          </button>
          <button
            onClick={() => setSelector('button#checkout-btn:not([disabled])')}
            className="text-[11px] text-cyan-500 hover:underline font-mono"
          >
            Example: Button Attribute (:not)
          </button>
        </div>
      </div>

      {/* 4 Weight Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Inline Styles</span>
          <div className="text-3xl font-mono font-extrabold text-blue-500">{specificity.inline}</div>
          <span className="text-[10px] text-muted-foreground block">1000 pts</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">IDs (#id)</span>
          <div className="text-3xl font-mono font-extrabold text-purple-500">{specificity.ids}</div>
          <span className="text-[10px] text-muted-foreground block">100 pts</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Classes &amp; Pseudos</span>
          <div className="text-3xl font-mono font-extrabold text-cyan-500">{specificity.classes}</div>
          <span className="text-[10px] text-muted-foreground block">10 pts</span>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-center space-y-1">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Elements &amp; Tags</span>
          <div className="text-3xl font-mono font-extrabold text-amber-500">{specificity.elements}</div>
          <span className="text-[10px] text-muted-foreground block">1 pt</span>
        </div>
      </div>
    </div>
  );
}
