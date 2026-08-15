'use client';

import React from 'react';
import { Flame, ExternalLink, ShieldCheck, Cpu, Terminal, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--rust-border)] bg-[var(--rust-surface)] py-12 text-xs text-[var(--rust-muted)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[var(--rust-primary-light)] text-[var(--rust-primary)] border border-[var(--rust-primary-border)]">
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-[var(--rust-text)]">RustViz Backend Internals</span>
            </div>
            <p className="max-w-md leading-relaxed text-[var(--rust-muted)]">
              An interactive visual simulation engine and deep-dive learning platform for Rust memory management, ownership & move semantics, borrow checking, lifetimes, smart pointers, and concurrency.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-[11px]">
              <span className="flex items-center text-[var(--rust-emerald)]">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-[var(--rust-emerald)] animate-pulse" />
                Zero-Cost Abstractions
              </span>
              <span className="flex items-center text-[var(--rust-cyan)]">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Memory Safe
              </span>
              <span className="flex items-center text-[var(--rust-amber)]">
                <Cpu className="mr-1 h-3.5 w-3.5" />
                Fearless Concurrency
              </span>
            </div>
          </div>

          {/* Col 2: Interactive Labs */}
          <div>
            <h4 className="font-bold text-[var(--rust-text)] uppercase tracking-wider text-[11px] mb-3">Interactive Engines</h4>
            <ul className="space-y-2">
              <li>
                <a href="/rustviz/ownership-lab" className="hover:text-[var(--rust-primary)] transition-colors flex items-center">
                  Ownership & Move Lab <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="/rustviz/borrow-checker" className="hover:text-[var(--rust-primary)] transition-colors flex items-center">
                  Borrow Checker & NLL <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="/rustviz/lifetimes-lab" className="hover:text-[var(--rust-primary)] transition-colors flex items-center">
                  Lifetimes & Variance <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="/rustviz/smart-pointers" className="hover:text-[var(--rust-primary)] transition-colors flex items-center">
                  Smart Pointers (Rc/Arc) <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" />
                </a>
              </li>
              <li>
                <a href="/rustviz/concurrency-lab" className="hover:text-[var(--rust-primary)] transition-colors flex items-center">
                  Tokio & Channels Lab <ArrowUpRight className="ml-1 h-3 w-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources & Hub */}
          <div>
            <h4 className="font-bold text-[var(--rust-text)] uppercase tracking-wider text-[11px] mb-3">Reference & Hub</h4>
            <ul className="space-y-2">
              <li>
                <a href="/rustviz/concepts" className="hover:text-[var(--rust-primary)] transition-colors">
                  12 Deep Dive Concepts
                </a>
              </li>
              <li>
                <a href="/rustviz/pitfalls" className="hover:text-[var(--rust-primary)] transition-colors">
                  Top Compiler Errors
                </a>
              </li>
              <li>
                <a href="/rustviz/flashcards" className="hover:text-[var(--rust-primary)] transition-colors">
                  Memory Flashcards
                </a>
              </li>
              <li>
                <a href="/rustviz/cheatsheet" className="hover:text-[var(--rust-primary)] transition-colors">
                  Rust Architecture Cheat Sheet
                </a>
              </li>
              <li>
                <a href="/" className="text-[var(--rust-primary)] hover:underline font-semibold flex items-center pt-2">
                  Explore All CSCosmos Visualizers <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-[var(--rust-border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px]">
          <p>© {new Date().getFullYear()} CSCosmos. Visualizer engine for Rust Backend Internals.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[var(--rust-subtle)]">Static SSG Pre-rendered • Client In-Memory Simulator</p>
        </div>
      </div>
    </footer>
  );
}
