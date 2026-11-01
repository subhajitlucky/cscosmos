'use client';

import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { topics } from '../../data/topics';

const BASE = '/fullstack/css-cosmos';

const Footer = () => {
  const quickLinks = topics.slice(0, 6);

  return (
    <footer className="border-t border-glass bg-surface/85 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-primary">CSS Universe</p>
          <p className="text-lg font-semibold text-body-text">Learn visually, build confidently.</p>
          <p className="text-sm text-muted-text">
            Modern CSS architecture with real-time interactive editors, live sandbox previews, and 100 practical engineering challenges.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-body-text">Popular Topics</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-text">
            {quickLinks.map((topic) => (
              <li key={topic.path}>
                <Link className="transition hover:text-body-text" href={`${BASE}/topics${topic.path}`}>
                  {topic.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-body-text">Hands-On & Practice</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-text">
            <li>
              <Link className="transition hover:text-body-text" href={`${BASE}/lab`}>
                CSS Tinker Lab
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-body-text" href={`${BASE}/problems`}>
                100 CSS Challenges
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-body-text" href={`${BASE}/concepts`}>
                Core Concepts
              </Link>
            </li>
            <li>
              <Link className="transition hover:text-body-text" href={`${BASE}/topics/flexbox`}>
                Flexbox Lab
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-body-text">Connect</h3>
          <div className="flex items-center gap-3 text-muted-text">
            <Link
              className="flex items-center gap-2 rounded-full border border-glass px-3 py-1.5 transition hover:border-slate-300 dark:hover:border-white/30 hover:text-body-text"
              href="/topics"
            >
              <span>CSCosmos Topics</span>
            </Link>
          </div>
          <p className="text-xs text-muted-text">
            CSCosmos CSS Visualizer Engine.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
