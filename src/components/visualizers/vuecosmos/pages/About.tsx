'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function About() {
  return (
    <div className="page about-page">
      <section className="about-hero">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> A small mission <span className="eyebrow-line" />
        </div>
        <h1>Make the<br /><em>magic tangible.</em></h1>
        <p>
          Vue Visualizer is an open-source learning lab for people who learn by moving things around, not memorizing API lists.
        </p>
      </section>

      <section className="about-grid">
        <div className="about-statement">
          <span className="section-index">01 / THE MISSION</span>
          <h2>Intuition is a<br /><span>feature.</span></h2>
        </div>
        <div className="about-copy">
          <p>
            Frameworks are easier when their hidden systems have a shape. This project turns reactivity, rendering, and component architecture into small, safe experiments you can run in your browser.
          </p>
          <p>
            It is a frontend-only simulation, not a replacement for Vue itself. The goal is to build a mental model you can carry back to real code.
          </p>
          <Link href="/vuecosmos/learn" className="arrow-link">
            Explore the map <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>

      <section className="about-values">
        <div>
          <span>01</span>
          <b>Visual first</b>
          <p>Every lesson leads with a model, not a wall of prose.</p>
        </div>
        <div>
          <span>02</span>
          <b>Honest simulation</b>
          <p>We label the edges between Vue’s real behavior and our teaching model.</p>
        </div>
        <div>
          <span>03</span>
          <b>Open by default</b>
          <p>Made to be shared, remixed, and improved by curious humans.</p>
        </div>
      </section>
    </div>
  );
}
