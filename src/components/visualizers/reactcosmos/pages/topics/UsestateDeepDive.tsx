'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function UsestateDeepDive() {
  const topic = TOPICS.find(t => t.id === 'usestate-deep-dive')!;
  const [code, setCode] = useState(`function MultiState() {
  // Each call corresponds to a slot in an internal array
  const [name, setName] = useState("React"); // Slot 0
  const [ver, setVer] = useState(19);       // Slot 1

  return <h1>{name} v{ver}</h1>;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Slot-based Persistence
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React doesn't use magic to know which state belongs to which component. 
                Internally, every Fiber node (component instance) has a `memoizedState` 
                property that holds a **linked list of hook objects**. When you call 
                `useState`, React simply returns the value at the current "pointer" 
                and moves the pointer to the next slot.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Internal Hook Map</h3>
              <div className="flex gap-2 text-[10px] font-mono">
                <div className="flex-1 p-2 border border-react rounded text-center">Hook 0<br/>(state)</div>
                <div className="flex-1 p-2 border border-border rounded text-center opacity-40">Hook 1<br/>(effect)</div>
                <div className="flex-1 p-2 border border-border rounded text-center opacity-40">Hook 2<br/>(state)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Why Order Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                This internal architecture is why the **Rules of Hooks** exist. If you 
                wrap a hook in an `if` statement, and that condition changes, the 
                slots will shift. React will return the wrong state for the wrong 
                hook, leading to chaotic and untraceable bugs.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Senior Insight</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Think of 'useState' as an index into a table. The index is not a name, 
                 it's just 'the nth time this function was called.' This simplicity is 
                 what makes hooks so powerful and composable."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
