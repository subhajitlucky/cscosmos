'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function PerformanceBottlenecks() {
  const topic = TOPICS.find(t => t.id === 'performance-bottlenecks')!;
  const [code, setCode] = useState(`// BOTTLENECK: Massive list without optimization
function HeavyList({ items }) {
  return (
    <div>
      {items.map(item => <Row key={item.id} data={item} />)}
    </div>
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
                <span className="text-react">01.</span> The Cost of Updates
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Performance issues in React usually stem from two sources: 
                **Expensive Renders** (heavy math in the function body) and 
                **Too Many Renders** (unnecessary updates cascading through the tree). 
                Identifying the root cause using the React DevTools Profiler is 
                the first step to optimization.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Lag Matrix</h3>
              <ul className="space-y-3 text-[11px]">
                <li className="flex justify-between"><span>Deep Tree</span> <span className="text-rose-500">Recursion Overload</span></li>
                <li className="flex justify-between border-t border-border pt-3"><span>Large Lists</span> <span className="text-rose-500">DOM Bloat</span></li>
                <li className="flex justify-between border-t border-border pt-3"><span>State at Root</span> <span className="text-rose-500">Total Cascade</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Common Fixes
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Before reaching for complex hooks, try **moving state down** to keep re-renders 
                local. If that's not enough, use **Windowing** (rendering only visible rows) 
                or **React.memo** to skip unnecessary sub-tree renders.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Senior Architect Tip</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "A frequent bottleneck is the 'State Leak'—when state that only 
                 belongs in a small leaf component is managed in a giant global 
                 context. Keep state as local as possible."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
