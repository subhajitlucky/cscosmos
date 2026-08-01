'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function RenderVsCommit() {
  const topic = TOPICS.find(t => t.id === 'render-vs-commit')!;
  const [code, setCode] = useState(`// Phase 1: Render (Pure)
// React calls your component to see what it wants to render.
function App() {
  return <h1>Blueprint</h1>;
}

// Phase 2: Commit (Side Effects)
// React applies changes to the actual DOM.`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The Render Phase
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In this phase, React walks down the component tree and determines what 
                has changed. It is **pure and interruptible**. React can pause this 
                work, throw it away, or restart it without the user ever seeing a 
                half-finished UI. No DOM changes happen here.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Phase Invariants</h3>
              <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-center">
                <div className="p-2 border border-emerald-500/20 text-emerald-500 rounded bg-emerald-500/5">Render: Side-Effect Free</div>
                <div className="p-2 border border-rose-500/20 text-rose-500 rounded bg-rose-500/5">Commit: DOM Mutations</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Commit Phase
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Once React has the new tree ready, it enters the Commit phase. This 
                is **synchronous and non-interruptible**. React applies all changes 
                to the real DOM in one go. After this, it runs `useLayoutEffect` 
                (synchronously) and `useEffect` (asynchronously).
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Expert Rule</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Because the Render phase can be called multiple times before a 
                 commit, your component body must be **pure**. Never perform 
                 side effects (like API calls or logging) directly in the function 
                 body—save them for useEffect or event handlers."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
