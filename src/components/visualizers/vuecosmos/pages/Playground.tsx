'use client';

import React, { useState } from 'react';
import { Check, Play, RotateCcw, Zap } from 'lucide-react';

export function Playground() {
  const [count, setCount] = useState(0);
  const [tab, setTab] = useState<'reactivity' | 'render' | 'components'>('reactivity');
  const [isRunning, setIsRunning] = useState(false);

  const run = () => {
    setIsRunning(true);
    if (typeof window !== 'undefined') {
      setTimeout(() => setIsRunning(false), 1400);
    }
  };

  return (
    <div className="page playground-page">
      <section className="playground-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> Interactive sandbox <span className="eyebrow-line" />
          </div>
          <h1>Make a change.<br /><em>Trace the ripple.</em></h1>
        </div>
        <p>Write a tiny piece of Vue-like logic, then watch the simulation explain what the browser sees.</p>
      </section>

      <div className="playground-tabs">
        {[
          ['reactivity', 'Reactivity graph'],
          ['render', 'Render cycle'],
          ['components', 'Component tree'],
        ].map(([value, label]) => (
          <button
            onClick={() => setTab(value as any)}
            className={tab === value ? 'selected' : ''}
            key={value}
          >
            {label}
          </button>
        ))}
        <button
          className="reset-sandbox"
          onClick={() => {
            setCount(0);
            setIsRunning(false);
          }}
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="sandbox">
        <div className="code-panel">
          <div className="panel-head">
            <span>
              <i className="window-dot red" />
              <i className="window-dot yellow" />
              <i className="window-dot green" />
            </span>
            <small>Counter.vue</small>
            <span className="panel-lang">VUE</span>
          </div>
          <div className="code-editor">
            <div className="code-line">
              <span>01</span>
              <code><b className="pink">&lt;script setup&gt;</b></code>
            </div>
            <div className="code-line">
              <span>02</span>
              <code><b className="blue">const</b> count = <b className="green">ref</b>({count})</code>
            </div>
            <div className="code-line">
              <span>03</span>
              <code><b className="blue">const</b> doubled = <b className="green">computed</b>(() =&gt; count * 2)</code>
            </div>
            <div className="code-line empty">
              <span>04</span>
              <code />
            </div>
            <div className="code-line">
              <span>05</span>
              <code><b className="pink">&lt;/script&gt;</b></code>
            </div>
            <div className="code-line empty">
              <span>06</span>
              <code />
            </div>
            <div className="code-line">
              <span>07</span>
              <code><b className="pink">&lt;template&gt;</b></code>
            </div>
            <div className="code-line">
              <span>08</span>
              <code>&nbsp;&nbsp;&lt;button <b className="orange">@click</b>=<b className="yellow-text">&quot;count++&quot;</b>&gt;</code>
            </div>
            <div className="code-line">
              <span>09</span>
              <code>&nbsp;&nbsp;&nbsp;&nbsp;&#123;&#123; count &#125;&#125; × 2 = &#123;&#123; doubled &#125;&#125;</code>
            </div>
            <div className="code-line">
              <span>10</span>
              <code>&nbsp;&nbsp;&lt;/button&gt;</code>
            </div>
            <div className="code-line">
              <span>11</span>
              <code><b className="pink">&lt;/template&gt;</b></code>
            </div>
          </div>
          <div className="editor-foot">
            <span><Check size={12} /> syntax looks good</span>
            <span>Ln 02, Col 23</span>
          </div>
        </div>

        <div className="sim-panel">
          <div className="panel-head">
            <span className="panel-title">
              {tab === 'reactivity'
                ? 'Dependency graph'
                : tab === 'render'
                ? 'Render timeline'
                : 'Component tree'}
            </span>
            <span className="live-label"><i /> LIVE</span>
          </div>
          {tab === 'reactivity' ? (
            <ReactivityGraph count={count} isRunning={isRunning} onRun={run} />
          ) : tab === 'render' ? (
            <RenderTimeline isRunning={isRunning} onRun={run} />
          ) : (
            <ComponentTree isRunning={isRunning} onRun={run} />
          )}
        </div>

        <div className="preview-panel">
          <div className="panel-head">
            <span className="panel-title">Preview</span>
            <span className="preview-url">localhost:5173</span>
          </div>
          <div className={`preview-screen ${isRunning ? 'is-running' : ''}`}>
            <span className="preview-kicker">reactive counter</span>
            <button
              onClick={() => {
                setCount((value) => value + 1);
                run();
              }}
              className="counter-button"
            >
              <span>{count}</span>
              <small>count++</small>
            </button>
            <div className="preview-equation">
              <span>{count}</span>
              <i>× 2</i>
              <b>{count * 2}</b>
            </div>
            <p>Click the state. The graph wakes up.</p>
          </div>
        </div>
      </div>

      <div className="playground-note">
        <Zap size={15} fill="currentColor" />
        <span>Nothing runs on a server. This is a safe, frontend-only simulation of Vue’s mental model.</span>
      </div>
    </div>
  );
}

function ReactivityGraph({
  count,
  isRunning,
  onRun,
}: {
  count: number;
  isRunning: boolean;
  onRun: () => void;
}) {
  return (
    <div className="sim-content">
      <div className="graph-stage">
        <div className={`sim-node state-node ${isRunning ? 'sim-hot' : ''}`}>
          <small>ref( )</small>
          <strong>count</strong>
          <b>{count}</b>
        </div>
        <div className={`sim-node computed-node ${isRunning ? 'sim-hot delay-one' : ''}`}>
          <small>computed( )</small>
          <strong>doubled</strong>
          <b>{count * 2}</b>
        </div>
        <div className={`sim-node effect-node ${isRunning ? 'sim-hot delay-two' : ''}`}>
          <small>effect</small>
          <strong>render</strong>
          <b>DOM</b>
        </div>
        <svg viewBox="0 0 440 250">
          <path d="M110 110 C155 50 260 52 305 105" />
          <path d="M110 132 C178 195 250 191 305 133" />
        </svg>
      </div>
      <div className="sim-legend">
        <span><i className="legend-lime" /> dependency</span>
        <span><i className="legend-coral" /> triggered</span>
        <button onClick={onRun}>
          <Play size={12} fill="currentColor" /> Trigger update
        </button>
      </div>
      <div className="sim-log">
        <div>
          <span>09:41:0{count % 10}</span>
          <b>state mutation</b>
          <small>count changed to {count}</small>
        </div>
        <div>
          <span>09:41:0{count % 10}</span>
          <b>scheduler queued</b>
          <small>1 effect waiting</small>
        </div>
      </div>
    </div>
  );
}

function RenderTimeline({
  isRunning,
  onRun,
}: {
  isRunning: boolean;
  onRun: () => void;
}) {
  return (
    <div className="sim-content timeline-content">
      <div className="timeline-rail">
        {['mutate state', 'queue job', 'render vnode', 'patch DOM'].map((label, index) => (
          <div
            className={isRunning && index < 3 ? 'timeline-step active' : 'timeline-step'}
            key={label}
          >
            <span>0{index + 1}</span>
            <i />
            <b>{label}</b>
            <small>
              {index === 0
                ? 'count++'
                : index === 1
                ? 'microtask'
                : index === 2
                ? 'new tree'
                : 'minimal diff'}
            </small>
          </div>
        ))}
      </div>
      <button className="sim-action" onClick={onRun}>
        <Play size={12} fill="currentColor" /> Play render cycle
      </button>
    </div>
  );
}

function ComponentTree({
  isRunning,
  onRun,
}: {
  isRunning: boolean;
  onRun: () => void;
}) {
  return (
    <div className="sim-content component-content">
      <div className="tree-visual">
        <div className={isRunning ? 'tree-node selected' : 'tree-node'}>
          <span>App.vue</span>
          <small>provide → theme</small>
        </div>
        <div className="tree-branches">
          <i />
          <i />
        </div>
        <div className="tree-children">
          <div className="tree-node">
            <span>Header</span>
            <small>props: user</small>
          </div>
          <div className={isRunning ? 'tree-node selected delay-one' : 'tree-node'}>
            <span>Counter</span>
            <small>emit: update</small>
          </div>
        </div>
      </div>
      <button className="sim-action" onClick={onRun}>
        <Play size={12} fill="currentColor" /> Trace component flow
      </button>
    </div>
  );
}
