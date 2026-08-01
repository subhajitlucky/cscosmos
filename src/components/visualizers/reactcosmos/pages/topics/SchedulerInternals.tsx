'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function SchedulerInternals() {
  const topic = TOPICS.find(t => t.id === 'scheduler-internals')!;
  const [code, setCode] = useState(`// Pseudo-code of the Scheduler
function workLoop(deadline) {
  while (workInProgress && deadline.timeRemaining() > 0) {
    workInProgress = performUnitOfWork(workInProgress);
  }
  // Request next frame if work isn't done
  if (workInProgress) requestCallback(workLoop);
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Air Traffic Control
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                The Scheduler is a standalone package that React uses to coordinate 
                the execution of tasks. It implements a **Cooperative Multitasking** 
                model. It periodically yields control back to the browser so 
                high-priority native tasks (like scrolling or keyboard input) 
                can be handled immediately.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Priority Lanes</h3>
              <div className="space-y-2 text-[10px] font-mono">
                <div className="p-2 border border-rose-500 rounded bg-rose-500/5">Lane 1: Immediate (Discrete)</div>
                <div className="p-2 border border-amber-500 rounded bg-amber-500/5">Lane 2: User-Blocking (Continuous)</div>
                <div className="p-2 border border-emerald-500 rounded bg-emerald-500/5">Lane 3: Normal (Default)</div>
                <div className="p-2 border border-zinc-500 rounded bg-zinc-500/5">Lane 4: Idle</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Message Channel
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                The Scheduler doesn't use `setTimeout`. It uses a **MessageChannel** 
                to schedule its work. This is faster and more precise for 
                high-frequency updates. It ensures that React never starves the 
                main thread, keeping the frames-per-second (FPS) as stable as possible.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Expert Level Tip</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "The Scheduler is what makes React feel 'fluid.' It's the difference 
                 between a UI that freezes when you click a button and a UI that 
                 gracefully handles background data while letting you keep typing. 
                 Master the Scheduler, and you master the engine."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
