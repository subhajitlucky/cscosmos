'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function MemoizationStrategies() {
  const topic = TOPICS.find(t => t.id === 'memoization-strategies')!;
  const [code, setCode] = useState(`// 1. Component Level (React.memo)
const StaticNode = memo(({ data }) => <div>{data}</div>);

// 2. Value Level (useMemo)
const cachedValue = useMemo(() => heavy(data), [data]);

// 3. Instance Level (useCallback)
const stableFn = useCallback(() => act(data), [data]);`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The Memoization Pyramid
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Effective memoization starts with stable references. If you wrap a 
                child in `React.memo`, but pass it an object `{}` created inside 
                the parent's render, the memoization will fail because the reference 
                is new every time. You must use `useMemo` or `useCallback` to 
                stabilize the props.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Reference Chain</h3>
              <div className="flex flex-col gap-2 text-[10px] font-mono items-center">
                <div className="p-2 border border-react rounded bg-react/5">useCallback (Prop)</div>
                <div className="text-react">↓</div>
                <div className="p-2 border border-border rounded">React.memo (Child)</div>
                <div className="text-emerald-500 italic mt-2">Skip Render ✅</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Strategic Use
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Memoization is a trade-off between **CPU time** and **Memory usage**. 
                Don't memoize everything. Only apply these strategies to components 
                that actually take a long time to render or that render so 
                frequently they cause input lag.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Maintainability Note</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If your dependency arrays are growing too long (5+ items), 
                 your component is doing too much. Refactor the logic into a 
                 custom hook or break the component down instead of adding 
                 more complex memoization."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
