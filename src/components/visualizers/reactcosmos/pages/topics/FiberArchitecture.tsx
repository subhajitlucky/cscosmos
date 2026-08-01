'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function FiberArchitecture() {
  const topic = TOPICS.find(t => t.id === 'fiber-architecture')!;
  const [code, setCode] = useState(`// A Fiber is a "unit of work"
const fiberNode = {
  type: 'div',
  child: FiberNode,
  sibling: FiberNode,
  return: FiberNode, // The parent
  alternate: FiberNode // The WIP counterpart
};`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The To-Do List
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Before Fiber, React used the **Call Stack** to render. Once it started, 
                it couldn't stop until the whole tree was done, causing lag during 
                large updates. Fiber is a rewrite of the core engine that turns 
                the render process into a **To-Do List** of "Fibers" (units of work).
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Concurrency Strategy</h3>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <div className="p-2 border border-border rounded text-center">Pause</div>
                <div className="text-react">→</div>
                <div className="p-2 border border-border rounded text-center">Prioritize</div>
                <div className="text-react">→</div>
                <div className="p-2 border border-border rounded text-center">Resume</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Virtual Call Stack
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Fibers are a "virtual call stack." Because the work is broken into 
                individual nodes with pointers to children, siblings, and parents, 
                React can **pause rendering** to handle a user input or a high-priority 
                animation, and then jump back right where it left off.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "You don't need to know the Fiber source code to use React, but 
                 understanding that render work can be **interrupted** is the key 
                 to mastering Concurrent Mode and Suspense."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
