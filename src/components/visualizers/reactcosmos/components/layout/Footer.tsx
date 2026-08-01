'use client';

import Link from 'next/link';
import { Atom, Github, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 px-6 mt-32 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link href="/reactcosmos" className="flex items-center gap-2 font-bold text-sm mb-4">
            <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center">
              <Atom className="w-4 h-4 text-background" />
            </div>
            <span>React Cosmos</span>
          </Link>
          <p className="text-muted-foreground text-[13px] max-w-xs leading-relaxed mb-6">
            A technical visualization engine for understanding React Fiber, 
            State Reconciliation, and Hook internals. Built for the modern engineer.
          </p>
          <div className="flex gap-3">
            <a href="https://github.com/subhajitlucky/cscosmos" target="_blank" rel="noreferrer" className="p-2 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-md bg-muted text-muted-foreground hover:text-foreground transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-foreground font-semibold mb-4 text-[11px] uppercase tracking-widest">Platform</h4>
          <ul className="space-y-2 text-[13px] text-muted-foreground">
            <li><Link href="/reactcosmos" className="hover:text-foreground transition-colors">The Nexus</Link></li>
            <li><Link href="/reactcosmos/learn" className="hover:text-foreground transition-colors">Star Map</Link></li>
            <li><Link href="/reactcosmos/playground" className="hover:text-foreground transition-colors">The Lab</Link></li>
            <li><Link href="/reactcosmos/about" className="hover:text-foreground transition-colors">Project Log</Link></li>
            <li><Link href="/topics" className="hover:text-foreground transition-colors text-primary font-semibold">← CSCosmos Catalog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground font-semibold mb-4 text-[11px] uppercase tracking-widest">Documentation</h4>
          <ul className="space-y-2 text-[13px] text-muted-foreground">
            <li className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              React Fiber <ExternalLink className="w-3 h-3" />
            </li>
            <li className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              Concurrent Mode <ExternalLink className="w-3 h-3" />
            </li>
            <li className="flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer">
              Work-loop <ExternalLink className="w-3 h-3" />
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
        <span>© 2026 REACT COSMOS ENGINE</span>
        <span>VERSION 1.2.0 • BUILT FOR CSCOSMOS</span>
      </div>
    </footer>
  );
};

export default Footer;