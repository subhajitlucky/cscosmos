'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ConcurrentRendering() {
  const topic = TOPICS.find(t => t.id === 'concurrent-rendering')!;
  const [code, setCode] = useState(`// Urgency separation
const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  // Urgent: Update input
  setQuery(e.target.value);
  
  // Non-urgent: Update heavy list
  startTransition(() => {
    setHeavyList(e.target.value);
  });
};`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Cooperative Multitasking
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Concurrent rendering is the most significant change in React's history. 
                Instead of rendering being a single, non-stop operation, React can 
                now **pause** work to handle a more urgent task (like a user typing) 
                and then resume the background render. It uses a "Time Slicing" 
                mechanism to stay responsive.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Work Prioritization</h3>
              <ul className="space-y-2 text-[11px] font-mono">
                <li className="flex justify-between"><span>User Input</span> <span className="text-rose-500 font-bold">Priority 1</span></li>
                <li className="flex justify-between border-t border-border pt-2"><span>Transitions</span> <span className="text-amber-500">Priority 2</span></li>
                <li className="flex justify-between border-t border-border pt-2"><span>Offscreen</span> <span className="text-zinc-500">Priority 3</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Two-Pronged Strategy
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Concurrency is enabled by **Interruptibility**. React prepares multiple 
                versions of the UI in memory (the "In-Progress" tree) and only 
                manifests them to the DOM when the work is complete. This is like 
                editing a video in the background while still being able to 
                use your computer.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Transitions are the primary tool here. If a state update is causing 
                 input lag, wrap it in 'startTransition'. This tells React: 'This 
                 update is important, but don't freeze the whole app for it'."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
