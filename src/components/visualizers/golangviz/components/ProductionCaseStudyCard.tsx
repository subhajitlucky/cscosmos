'use client';

import React from 'react';
import { Building2, CheckCircle2, Flame, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import type { CaseStudy } from '../data/case-studies-data';

interface ProductionCaseStudyCardProps {
  caseStudy: CaseStudy;
}

export function ProductionCaseStudyCard({ caseStudy }: ProductionCaseStudyCardProps) {
  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-md my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Battle-Tested Production Case Study
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              {caseStudy.title}
            </h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          {caseStudy.company} Architecture
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--panel-border)] space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> Production Challenge
          </span>
          <p className="text-xs sm:text-sm text-[var(--foreground)]/90 leading-relaxed">
            {caseStudy.challenge}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--panel)] border border-[var(--panel-border)] space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Architectural Solution
          </span>
          <p className="text-xs sm:text-sm text-[var(--foreground)]/90 leading-relaxed">
            {caseStudy.solution}
          </p>
        </div>
      </div>

      {caseStudy.codeSnippet && (
        <div className="rounded-2xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> production_pattern.go
            </span>
            <span className="text-emerald-400 font-bold">{caseStudy.impact}</span>
          </div>
          <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-indigo-200">
            <code>{caseStudy.codeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
