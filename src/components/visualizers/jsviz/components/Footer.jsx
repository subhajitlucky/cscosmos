'use client';
import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Linkedin, ArrowLeft } from 'lucide-react';

const Footer = () => {
  return (
    <footer 
      className="border-t mt-20 transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter" style={{ color: 'var(--text-main)' }}>
              JS_VIZ
            </span>
            <Link 
              href="/topics" 
              className="text-xs font-mono flex items-center gap-1 opacity-70 hover:opacity-100 hover:text-brand-lime transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={12} /> ← CSCosmos Catalog
            </Link>
          </div>
          <p className="mt-2 text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Engineered for clarity.
          </p>
        </div>

        <div className="flex space-x-6 opacity-70">
          <a href="#" className="hover:text-brand-lime transition-colors" style={{ color: 'var(--text-muted)' }}>
            <Github size={20} />
          </a>
          <a href="#" className="hover:text-brand-lime transition-colors" style={{ color: 'var(--text-muted)' }}>
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-brand-lime transition-colors" style={{ color: 'var(--text-muted)' }}>
            <Linkedin size={20} />
          </a>
        </div>
      </div>

      <div className="border-t py-4 text-center" style={{ borderColor: 'var(--border-main)' }}>
        <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} JS VISUALIZER. SYSTEM OPERATIONAL.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
