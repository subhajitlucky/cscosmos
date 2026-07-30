'use client';

import Link from 'next/link';
import { BookOpen, Terminal, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/80 py-12 px-6 mt-20 transition-colors">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <Link href="/webprotocols" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <BookOpen size={20} />
            </div>
            <span className="text-foreground">Web Protocols</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The premium visual guide to mastering HTTP, headers, and web caching for modern developers.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin size={18} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-foreground">Learning</h4>
          <ul className="space-y-2 text-sm text-muted-foreground font-medium">
            <li><Link href="/webprotocols/path" className="hover:text-primary transition-colors">Learning Path</Link></li>
            <li><Link href="/webprotocols/playground" className="hover:text-primary transition-colors">Playground</Link></li>
            <li><Link href="/webprotocols/topics/http-intro" className="hover:text-primary transition-colors">Introduction</Link></li>
            <li><Link href="/webprotocols/topics/caching-basics" className="hover:text-primary transition-colors">Caching Guide</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-foreground">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground font-medium">
            <li><a href="https://developer.mozilla.org" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">MDN Web Docs</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">HTTP/3 Specs</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">Cheat Sheets</a></li>
          </ul>
        </div>

        <div className="bg-muted/50 p-6 rounded-2xl border border-border/80">
           <div className="flex items-center gap-2 mb-3 text-primary">
              <Terminal size={18} />
              <span className="font-bold text-sm uppercase tracking-tighter">Ready to play?</span>
           </div>
           <p className="text-xs text-muted-foreground mb-4">Jump into the interactive playground and experiment with real HTTP flows.</p>
           <Link href="/webprotocols/playground" className="block text-center bg-primary text-white py-2 rounded-xl text-xs font-bold hover:bg-primary/90 transition-all">
             Open Playground
           </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-border/80 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-xs font-medium">
        <p>© CSCosmos Web Protocols Visualizer.</p>
        <div className="flex gap-6">
           <Link href="/topics" className="hover:text-foreground transition-colors">CSCosmos Topics</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
