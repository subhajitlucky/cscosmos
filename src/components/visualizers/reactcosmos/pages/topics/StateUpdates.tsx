'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import StateUpdatesVisualizer from '../../components/visualizers/specific/StateUpdatesVisualizer';

export default function StateUpdates() {
  const topic = TOPICS.find(t => t.id === 'state-updates')!;
  const [code, setCode] = useState(`function Counter() {
  // 1. Declare state
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      {/* 2. Update state to trigger render */}
      <button onClick={() => setCount(count + 1)}>
        Increment
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
        visualizer={(isExecuting) => <StateUpdatesVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Local Memory
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                State is a component's personal memory. Unlike regular variables, which are 
                erased when a function finishes executing, **State persists** across re-renders. 
                When state changes, React "schedules" a re-render to update the visual manifestation.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50">State vs Variable</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-3 bg-background border border-border text-rose-500">let x = 0;<br/>// Lost on re-render</div>
                <div className="p-3 bg-background border border-border text-emerald-500">const [x, setX] = useState(0);<br/>// Persistent memory</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Asynchronous Snapshots
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Calling `setState` does not change the variable immediately. Instead, it tells 
                React to create a new "snapshot" of the UI with the new value. Within the 
                current execution frame, the state variable remains unchanged. This is why 
                **Functional Updates** (`setCount(c =&gt; c + 1)`) are essential for sequence safety.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Senior Insight</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "React state is like a **Git Commit**. When you call the setter, you are 
                 proposing a new version of the reality. React reviews the proposal and 
                 merges it into the main branch (the real DOM) during the commit phase."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
