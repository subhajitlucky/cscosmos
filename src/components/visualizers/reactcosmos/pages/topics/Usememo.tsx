'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function Usememo() {
  const topic = TOPICS.find(t => t.id === 'usememo')!;
  const [code, setCode] = useState(`function Analytics({ data, filter }) {
  // Only re-calculate if 'data' or 'filter' changes
  const computed = useMemo(() => {
    return expensiveCalculation(data, filter);
  }, [data, filter]);

  return <div>Result: {computed}</div>;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Computational Memoization
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                `useMemo` caches the **result** of a calculation between re-renders. 
                If the dependencies haven't changed, React skips the expensive 
                function and returns the value it stored in memory from the last run.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Optimization Flow</h3>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <div className="p-2 border border-border rounded">Dependency Change?</div>
                <div className="text-react">Yes →</div>
                <div className="p-2 border border-react rounded bg-react/5 text-react">Re-compute</div>
                <div className="text-zinc-500">No →</div>
                <div className="p-2 border border-border rounded bg-muted">Cache Hit</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Cost of Caching
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Many developers over-use `useMemo`. Memoization isn't free—React has 
                to compare the dependencies and store the values in memory. For 
                simple arithmetic or array filters, the cost of `useMemo` might be 
                higher than just re-running the calculation.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Performance Audit</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Use 'useMemo' only for truly expensive operations (complex sorting, 
                 heavy data processing) or to maintain stable object references when 
                 passing props to memoized children."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
