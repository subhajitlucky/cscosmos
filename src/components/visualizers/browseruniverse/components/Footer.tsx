'use client';

import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-border/70 bg-card/50 backdrop-blur">
      <div className="page-container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">BrowserUniverse</p>
          <p className="text-xs text-slate-400">Learn the browser from bytes to pixels.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link className="inline-flex items-center gap-1 hover:text-white" href="/browseruniverse/about">
            About
          </Link>
          <Link className="inline-flex items-center gap-1 hover:text-white" href="/browseruniverse/topics">
            Topics
          </Link>
          <a
            className="inline-flex items-center gap-1 hover:text-white"
            href="https://developer.chrome.com/docs/devtools"
            target="_blank"
            rel="noreferrer"
          >
            DevTools <ExternalLink size={14} />
          </a>
          <a
            className="inline-flex items-center gap-1 hover:text-white"
            href="https://github.com/subhajitlucky/browseruniverse"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
            GitHub
          </a>
          <span className="rounded-full border border-border px-3 py-1 text-[11px] uppercase tracking-[0.2rem] text-slate-400">
            MIT License
          </span>
        </div>
      </div>
    </footer>
  );
}
