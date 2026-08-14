'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronRight, RotateCcw } from 'lucide-react';

const featuredPaths = [
  { number: '01', title: 'Reactivity', description: 'Follow a state change from proxy to pixel.', color: 'coral', to: '/vuecosmos/topic/dependency-tracking', mark: '↗' },
  { number: '02', title: 'Rendering', description: 'Watch two trees become one DOM.', color: 'sky', to: '/vuecosmos/topic/virtual-dom', mark: '◫' },
  { number: '03', title: 'Components', description: 'Trace the signals between parent and child.', color: 'violet', to: '/vuecosmos/topic/component-communication', mark: '⌘' },
];

export function Home() {
  const [count, setCount] = useState(0);
  const [activeNode, setActiveNode] = useState('effect');

  const pulse = () => {
    setCount((value) => value + 1);
    setActiveNode('state');
    if (typeof window !== 'undefined') {
      window.setTimeout(() => setActiveNode('effect'), 450);
    }
  };

  return (
    <>
      <section className="hero home-hero">
        <div className="hero-grid" />
        <div className="hero-copy reveal-up">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Visual learning lab <span className="eyebrow-line" /> 01—06
          </div>
          <h1>Feel how<br /><em>Vue</em> works.</h1>
          <p className="hero-sub">
            An interactive field guide to the tiny signals, smart updates, and component conversations behind Vue.js.
          </p>
          <div className="hero-actions">
            <Link href="/vuecosmos/learn" className="button button-primary">
              Start exploring <ArrowUpRight size={16} />
            </Link>
            <Link href="/vuecosmos/playground" className="text-link">
              Open playground <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        <div className="hero-visual reveal-scale">
          <div className="visual-label label-top">LIVE REACTIVITY MAP <span>●</span></div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <svg className="hero-connections" viewBox="0 0 560 480" role="img" aria-label="Animated reactivity graph showing state flowing to an effect and component update">
            <path d="M165 233 C235 125 310 120 379 194" />
            <path d="M165 248 C245 275 302 268 379 227" />
            <path d="M379 212 C431 185 442 160 453 122" />
            <path d="M379 223 C425 268 444 316 447 354" />
            <circle className={activeNode === 'state' ? 'signal-dot hot' : 'signal-dot'} cx="165" cy="240" r="5" />
            <circle className="signal-dot pulse-delay" cx="379" cy="215" r="5" />
            <circle className="signal-dot pulse-delay-two" cx="448" cy="356" r="5" />
          </svg>
          <button className="graph-node node-state" onClick={pulse}>
            <span className="node-kicker">state</span>
            <strong>count</strong>
            <b>{count}</b>
            <small>ref( )</small>
          </button>
          <button className={activeNode === 'effect' ? 'graph-node node-effect hot-node' : 'graph-node node-effect'} onClick={pulse}>
            <span className="node-kicker">effect</span>
            <strong>render()</strong>
            <small>subscribed</small>
          </button>
          <div className="graph-node node-dom">
            <span className="node-kicker">component</span>
            <strong>&lt;Counter /&gt;</strong>
            <small>DOM patched</small>
          </div>
          <div className="visual-caption">
            <span className="caption-index">01</span>
            <p>Click <b>count</b> to trigger the chain.<br />Vue only wakes the nodes that care.</p>
          </div>
          <button className="visual-reset" onClick={() => setCount(0)} aria-label="Reset count">
            <RotateCcw size={14} />
          </button>
        </div>

        <div className="scroll-cue">
          <span>Scroll to explore</span>
          <i />
        </div>
      </section>

      <section className="statement-section">
        <div className="section-index">01 / WHY THIS EXISTS</div>
        <div className="statement-content">
          <p className="section-kicker">Most tutorials tell you <span>what</span> to type.</p>
          <h2>We make the<br /><span>invisible visible.</span></h2>
          <p className="statement-body">
            Vue is a conversation between state, effects, and the DOM. Pull the system apart. Move the pieces. Build the intuition that sticks.
          </p>
        </div>
        <div className="signal-stack">
          <div className="stack-line"><span>01</span><b>state</b><i /></div>
          <div className="stack-line"><span>02</span><b>dependencies</b><i /></div>
          <div className="stack-line"><span>03</span><b>effects</b><i /></div>
          <div className="stack-line"><span>04</span><b>pixels</b><i /></div>
        </div>
      </section>

      <section className="path-section">
        <div className="section-index">02 / PICK A PATH</div>
        <div className="path-heading">
          <div>
            <p className="section-kicker">Start anywhere. <span>Everything connects.</span></p>
            <h2>A map for<br /><em>curious minds.</em></h2>
          </div>
          <Link className="arrow-link" href="/vuecosmos/learn">
            View all concepts <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="path-list">
          {featuredPaths.map((item) => (
            <Link href={item.to} key={item.number} className={`path-row path-${item.color}`}>
              <span className="path-number">{item.number}</span>
              <span className="path-icon">{item.mark}</span>
              <span className="path-info">
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </span>
              <span className="path-arrow"><ArrowUpRight size={19} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-ring" />
        <div className="section-index">04 / GO DEEPER</div>
        <h2>Ready to see<br /><em>the signal?</em></h2>
        <Link href="/vuecosmos/playground" className="button button-light">
          Enter the playground <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}
