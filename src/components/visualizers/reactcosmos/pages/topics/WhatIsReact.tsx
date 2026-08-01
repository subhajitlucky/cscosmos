'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import WhatIsReactVisualizer from '../../components/visualizers/specific/WhatIsReactVisualizer';

export default function WhatIsReact() {
  const topic = TOPICS.find(t => t.id === 'what-is-react')!;
  const [code, setCode] = useState(`function App() {
  const [status, setStatus] = useState("Exploring");

  return (
    <div className="p-4 bg-zinc-900 rounded-lg text-white">
      <p>Status: {status}</p>
      <button 
        onClick={() => setStatus("Mastering")}
        className="mt-2 px-4 py-2 bg-react text-black rounded"
      >
        Level Up
      </button>
    </div>
  );
}`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <WhatIsReactVisualizer isExecuting={isExecuting} />}
      />
      
      {/* 🚀 Deep Dive Content Area */}
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The Architectural Shift
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React isn't just a library; it's a paradigm shift in how we handle **entropy** in user interfaces. 
                Before React, we manually manipulated the DOM (Imperative). If a user logged in, we found the 'Login' 
                button and hid it. In React, we simply say "the user is logged in" (Declarative), and the UI 
                re-calculates itself to match that reality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> UI as a Function
              </h2>
              <div className="p-6 rounded-xl bg-muted border border-border font-mono text-center">
                <span className="text-react">f</span>(state) = <span className="text-foreground">UI</span>
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed text-[14px]">
                This is the core formula of React. Your UI is never "stale" because it is a direct projection 
                of your application state. When state changes, the function runs again, and a new UI is generated.
              </p>
            </section>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-50">Why use React?</h3>
            <ul className="space-y-6">
              {[
                { t: "Predictability", d: "One-way data flow makes debugging a deterministic process." },
                { t: "Portability", d: "Learn once, write anywhere (React Native, React Three Fiber, Ink)." },
                { t: "Scalability", d: "Component-based architecture allows thousands of engineers to work on one codebase." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-react mt-2 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">{item.t}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
