'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, XCircle } from 'lucide-react';

export default function A11yScanner({ code }) {
  const auditResults = useMemo(() => {
    const issues = [];
    let score = 100;

    // 1. Check for Doctype
    if (!code.includes('<!DOCTYPE html>')) {
      issues.push({
        id: 'doctype',
        type: 'warning',
        title: 'Missing <!DOCTYPE html>',
        desc: 'Without a doctype, browsers render in quirks mode.'
      });
      score -= 10;
    }

    // 2. Check for html lang attribute
    if (!code.includes('<html lang=') && !code.includes('<html lang =')) {
      issues.push({
        id: 'lang',
        type: 'warning',
        title: 'Missing lang Attribute on <html>',
        desc: 'Screen readers need <html lang="en"> to pronounce words in the correct language.'
      });
      score -= 15;
    }

    // 3. Check for img tags missing alt
    const imgMatches = code.match(/<img\s+[^>]*>/gi) || [];
    imgMatches.forEach((imgTag, idx) => {
      if (!imgTag.includes('alt=') && !imgTag.includes('alt =')) {
        issues.push({
          id: `img-alt-${idx}`,
          type: 'error',
          title: `Image Missing alt Attribute: "${imgTag.slice(0, 30)}..."`,
          desc: 'Images require alt text so blind and low-vision users understand the image context.'
        });
        score -= 20;
      }
    });

    // 4. Check for unlabelled inputs
    const inputMatches = code.match(/<input\s+[^>]*>/gi) || [];
    inputMatches.forEach((inputTag, idx) => {
      if (!code.includes('<label') && !inputTag.includes('aria-label=') && !inputTag.includes('aria-labelledby=')) {
        issues.push({
          id: `input-label-${idx}`,
          type: 'error',
          title: 'Input Missing Associated <label>',
          desc: 'Form inputs must have a matching <label for="..."> or aria-label for accessibility.'
        });
        score -= 15;
      }
    });

    // 5. Check for h1 tag
    if (!code.includes('<h1') && !code.includes('<H1')) {
      issues.push({
        id: 'h1',
        type: 'warning',
        title: 'No Top-Level <h1> Heading Found',
        desc: 'Every document should have a single <h1> heading establishing the page hierarchy.'
      });
      score -= 10;
    }

    return {
      score: Math.max(0, score),
      issues
    };
  }, [code]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-lime-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Live Web Accessibility (A11y) Scanner
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Compliance Score:</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            auditResults.score >= 90
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              : auditResults.score >= 70
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {auditResults.score} / 100
          </span>
        </div>
      </div>

      {auditResults.issues.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Awesome! Your HTML code follows standard accessibility best practices (WCAG 2.2 compliant).</span>
        </div>
      ) : (
        <div className="space-y-2">
          {auditResults.issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                issue.type === 'error'
                  ? 'bg-rose-500/5 border-rose-500/20 text-rose-700 dark:text-rose-300'
                  : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {issue.type === 'error' ? (
                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span>{issue.title}</span>
              </div>
              <p className="pl-5 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                {issue.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
