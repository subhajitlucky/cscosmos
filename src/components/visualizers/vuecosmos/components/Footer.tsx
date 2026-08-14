'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/vuecosmos" className="brand">
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>vue<span className="brand-dot">:</span>visualizer</span>
        </Link>
        <p>Make the invisible feel obvious.</p>
      </div>
      <div className="footer-links">
        <Link href="/vuecosmos/learn">Learn map</Link>
        <Link href="/vuecosmos/playground">Playground</Link>
        <Link href="/vuecosmos/about">About</Link>
        <span className="footer-note">
          Built for curious frontend minds <Sparkles size={13} />
        </span>
      </div>
    </footer>
  );
}
