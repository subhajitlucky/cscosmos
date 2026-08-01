'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function RulesOfHooks() {
  const topic = TOPICS.find(t => t.id === 'rules-of-hooks')!;
  const [code, setCode] = useState(`// ❌ ERROR: Hook inside condition
if (loggedIn) {
  useEffect(() => { ... });
}

// ✅ CORRECT: Condition inside hook
useEffect(() => {
  if (loggedIn) { ... }
}, [loggedIn]);`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Fixed Call Order
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React relies on the **order** in which Hooks are called. Internally, 
                it treats hooks as a linked-list. If you skip a hook because of an 
                `if` statement, the pointers for every subsequent hook will shift, 
                returning the wrong state to the wrong variables.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Internal Pointer Fail</h3>
              <div className="flex gap-2 text-[9px] font-mono">
                <div className="flex-1 p-2 border border-border rounded text-center">Hook A</div>
                <div className="flex-1 p-2 border border-rose-500 rounded bg-rose-500/5 text-center">MISSING</div>
                <div className="flex-1 p-2 border border-amber-500 rounded bg-amber-500/5 text-center">Hook C (Shifted)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Only Call in React
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Hooks can only be called from **React function components** or 
                **Custom hooks**. They cannot be called from regular JavaScript 
                functions. This is because hooks require access to the "dispatcher" 
                of the currently rendering component instance.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Maintainability Note</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Use the 'eslint-plugin-react-hooks' tool in your IDE. It will 
                 automatically catch violations of these rules before you ever 
                 run your code. In the Cosmos, laws are enforced by linting."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
