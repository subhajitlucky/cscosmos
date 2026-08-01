'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function Usecallback() {
  const topic = TOPICS.find(t => t.id === 'usecallback')!;
  const [code, setCode] = useState(`function Parent() {
  // useCallback caches the function instance
  const handleAction = useCallback(() => {
    console.log("Action triggered");
  }, []);

  return <ExpensiveChild onAction={handleAction} />;
}

const ExpensiveChild = React.memo(({ onAction }) => {
  return <button onClick={onAction}>Click Me</button>;
});`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Identity Stability
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In JavaScript, `() =&gt; {}` always creates a **new function reference**. 
                If you pass this function as a prop, the child component will see it 
                as a "new" prop and re-render. `useCallback` ensures that the same 
                function instance is reused between renders.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Reference Comparison</h3>
              <div className="flex flex-col gap-2 text-[10px] font-mono">
                <div className="p-2 border border-rose-500/30 text-rose-500 rounded bg-rose-500/5">const fn = () =&gt; {}; // fn1 !== fn2</div>
                <div className="p-2 border border-emerald-500/30 text-emerald-500 rounded bg-emerald-500/5">const fn = useCallback(() =&gt; {}, []); // fn1 === fn2</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Synergy with React.memo
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                `useCallback` is almost useless on its own. Its primary purpose is 
                to support **React.memo**. If a child isn't wrapped in `memo`, it will 
                re-render anyway, making the stable function reference irrelevant. 
                Use it only when passing handlers to performance-critical components.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Before optimizing with 'useCallback', ask yourself: 'Is this component 
                 actually slow?' 90% of the time, the answer is no. Premature optimization 
                 leads to harder-to-read code."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
