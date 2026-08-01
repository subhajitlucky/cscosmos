'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ReconciliationAlgorithm() {
  const topic = TOPICS.find(t => t.id === 'reconciliation-algorithm')!;
  const [code, setCode] = useState(`// Old Tree: <div><p>Hello</p></div>
// New Tree: <div><span>Hello</span></div>

// Reconciliation detects the type change 
// (p -> span) and destroys the old subtree.`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Heuristic O(n)
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Generic tree-diffing algorithms are O(n³). For 1000 nodes, this would 
                take a billion comparisons. React uses two simple **heuristics** to 
                bring this down to O(n): 1. Two elements of different types will 
                produce different trees. 2. Developers can hint which elements 
                are stable across renders with a 'key'.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Diffing Logic</h3>
              <ul className="space-y-3 text-[11px]">
                <li className="flex justify-between"><span>Same Type?</span> <span className="text-emerald-500">Update Props</span></li>
                <li className="flex justify-between border-t border-border pt-3"><span>Different Type?</span> <span className="text-rose-500">Destroy & Rebuild</span></li>
                <li className="flex justify-between border-t border-border pt-3"><span>List without Key?</span> <span className="text-amber-500">Re-order by Index</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Tearing Down the DOM
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                If a component type changes (e.g. from `&lt;Header /&gt;` to `&lt;Footer /&gt;`), 
                React doesn't try to compare them. It tears down the entire subtree, 
                runs all cleanup effects, and builds the new tree from scratch. This 
                is why keeping component types stable is critical for performance.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Internal Secret</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Keys are the only way to override the type-based destruction. 
                 By changing a key on a component, you can force React to treat 
                 it as a totally new instance, resetting its state and effects."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
