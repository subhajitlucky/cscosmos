'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ComponentRerendering() {
  const topic = TOPICS.find(t => t.id === 'component-rerendering')!;
  const [code, setCode] = useState(`function Parent() {
  const [count, setCount] = useState(0);
  console.log("Parent rendered");

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>
        Update State
      </button>
      <Child />
    </div>
  );
}

function Child() {
  console.log("Child rendered");
  return <p>I am a child</p>;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The Chain Reaction
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                A re-render is triggered by three things: **State Change**, **Prop Change**, 
                or **Context Change**. By default, when a parent component re-renders, 
                React recursively re-renders **all** of its children, regardless of whether 
                their props changed. This ensures the UI remains consistent with the latest 
                logic.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50 text-center">Render Cascade</h3>
              <div className="flex flex-col items-center gap-2 text-[10px] font-mono">
                <div className="p-2 border border-react rounded bg-react/5">Parent (State Update)</div>
                <div className="text-react">↓</div>
                <div className="flex gap-4">
                  <div className="p-2 border border-border rounded opacity-60">Child A</div>
                  <div className="p-2 border border-border rounded opacity-60">Child B</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Virtual vs Real DOM
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                It's important to distinguish between **Rendering** (calculating the VDOM) 
                and **Painting** (updating the screen). React might re-render a component 
                100 times, but if the VDOM output is identical, the browser's Real DOM 
                isn't touched. This is why "unnecessary re-renders" are often less 
                expensive than they seem, though they should still be managed in heavy apps.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Don't reach for 'memo' or 'useCallback' prematurely. React is incredibly 
                 fast. Focus on clean data structures first, and only optimize when you 
                 detect visible jank using the Profiler."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
