'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function StateLifting() {
  const topic = TOPICS.find(t => t.id === 'state-lifting')!;
  const [code, setCode] = useState(`function Parent() {
  const [val, setVal] = useState(0);
  return (
    <>
      <SiblingA value={val} onSet={setVal} />
      <SiblingB value={val} />
    </>
  );
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Sharing Memory
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Sometimes, two components need to reflect the same changing data. 
                In React, the recommended solution is to "lift" the state up to 
                the **closest common ancestor**. This parent then passes the 
                state back down to both children as props.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Elevation Strategy</h3>
              <div className="flex flex-col items-center gap-2 text-[10px] font-mono">
                <div className="p-2 border border-react rounded bg-react/5">Common Parent (State)</div>
                <div className="flex gap-8">
                  <div className="p-2 border border-border rounded opacity-60">Child A (View)</div>
                  <div className="p-2 border border-border rounded opacity-60">Child B (View)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Synchronization by Design
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                By lifting state, you ensure that the two components are always in 
                sync. There is no possibility of "stale" data because they are 
                both looking at the exact same variable in the parent's memory. 
                This is the "Single Source of Truth" principle in action.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Maintainability Note</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If you lift state too high (e.g. to the root of the app), you'll end 
                 up with Prop Drilling. Find the *lowest* possible ancestor that 
                 covers all components needing the data. This keeps re-renders local."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
