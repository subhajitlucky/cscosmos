'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function Useeffect() {
  const topic = TOPICS.find(t => t.id === 'useeffect')!;
  const [code, setCode] = useState(`useEffect(() => {
  // 1. Setup Logic
  const sub = API.subscribe(id);

  // 2. Cleanup Logic
  return () => sub.unsubscribe();

  // 3. Dependencies
}, [id]);`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Not a Lifecycle Hook
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Forget `componentDidMount`. `useEffect` is about **Synchronization**. 
                It synchronizes the component's state with an external system (an API, 
                a WebSocket, or the window scroll position). It runs **after** the 
                browser has finished painting to ensure the UI remains responsive.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Execution Cycle</h3>
              <div className="flex flex-col gap-2 text-[10px] font-mono">
                <div className="p-2 border border-border rounded opacity-40">Render Blueprints</div>
                <div className="p-2 border border-border rounded opacity-40">Browser Paint</div>
                <div className="p-2 border border-react rounded bg-react/5">Run Setup Logic</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Cleanup Rule
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Memory leaks happen when you forget to clean up. Every time an effect 
                re-runs, React first calls the **Cleanup function** from the *previous* 
                render cycle before running the new setup logic. This prevents 
                accumulating multiple intervals or listeners.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If you find yourself using 'useEffect' to update state based on other 
                 state, stop. That logic usually belongs in the event handler or 
                 directly in the render body. Effects should only be for 'external' systems."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
