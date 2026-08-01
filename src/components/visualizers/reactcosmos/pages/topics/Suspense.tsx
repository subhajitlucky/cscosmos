'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function Suspense() {
  const topic = TOPICS.find(t => t.id === 'suspense')!;
  const [code, setCode] = useState(`<Suspense fallback={<Skeleton />}>
  <DataGrid />
  <Comments />
</Suspense>

// If ANY child is "suspending", 
// the fallback will be shown.`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Handling Uncertainty
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                `Suspense` is a component that lets you "wait" for some code to load 
                and declaratively specify a loading state. Unlike manual loading flags 
                (`if (loading) return ...`), Suspense allows you to coordinate 
                multiple asynchronous components at the tree level.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Tree State</h3>
              <div className="flex flex-col items-center gap-2 text-[10px] font-mono">
                <div className="p-2 border border-react rounded bg-react/5 text-react">Suspense Boundary</div>
                <div className="text-react">↓</div>
                <div className="flex gap-4">
                  <div className="p-2 border border-border rounded opacity-40">Ready</div>
                  <div className="p-2 border border-amber-500 rounded bg-amber-500/5 animate-pulse">Waiting...</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Beyond Code Splitting
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In modern React frameworks (like Next.js), Suspense is also used 
                for **Data Fetching**. A component can "suspend" while waiting for 
                an API response. React will catch this "suspension" and show the 
                nearest fallback until the data is resolved and the component 
                can finish its work.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Think of Suspense as a **Boundary of Order**. It prevents the 'Pop-in' 
                 effect where UI elements jump around as different data loads at 
                 different speeds. It keeps the UI stable until the content is ready."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
