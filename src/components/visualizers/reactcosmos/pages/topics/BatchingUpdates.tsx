'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function BatchingUpdates() {
  const topic = TOPICS.find(t => t.id === 'batching-updates')!;
  const [code, setCode] = useState(`function handleClick() {
  // In React 18+, these are batched automatically
  // even inside promises or timeouts!
  setCount(c => c + 1);
  setFlag(f => !f);
  // Only ONE re-render occurs here
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Grouping for Performance
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Automatic batching is a performance feature where React groups 
                multiple state updates into a single re-render. Before React 18, 
                only updates inside event handlers were batched. Now, updates inside 
                Promises, `setTimeout`, or native event listeners are also batched.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Batching logic</h3>
              <div className="flex flex-col items-center gap-2 text-[10px] font-mono">
                <div className="flex gap-2">
                  <div className="p-1 border border-border rounded">Update A</div>
                  <div className="p-1 border border-border rounded">Update B</div>
                  <div className="p-1 border border-border rounded">Update C</div>
                </div>
                <div className="text-react">↓ (Batch) ↓</div>
                <div className="p-2 border border-emerald-500 rounded bg-emerald-500/5">Single Render</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> flushSync (The Escape)
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In rare cases, you might need to force a synchronous update (e.g., 
                to measure the DOM immediately after a change). You can use 
                `flushSync` to opt out of batching, though it's generally 
                discouraged as it hurts performance.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Batching is why you can't rely on state being updated immediately 
                 after calling the setter. If you need to perform an action based 
                 on multiple updates, batching ensures the intermediate 'broken' 
                 states are never visible to the user."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
