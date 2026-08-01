'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function Uselayouteffect() {
  const topic = TOPICS.find(t => t.id === 'uselayouteffect')!;
  const [code, setCode] = useState(`useLayoutEffect(() => {
  // Runs SYNCHRONOUSLY after DOM mutations
  // But BEFORE browser paint
  const rect = ref.current.getBoundingClientRect();
  setPos(rect.top);
}, []);`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Blocking the Paint
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                `useLayoutEffect` is identical to `useEffect` in structure, but it 
                runs **synchronously** before the browser has a chance to paint the screen. 
                This means you can measure the size or position of DOM elements and 
                update state before the user sees anything, preventing the "flicker" 
                of an element jumping from its initial to final position.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Timing Comparison</h3>
              <ul className="space-y-2 text-[11px] font-mono">
                <li className="flex justify-between"><span>useEffect</span> <span className="text-emerald-500">Asynchronous / Post-Paint</span></li>
                <li className="flex justify-between border-t border-border pt-2"><span>useLayoutEffect</span> <span className="text-rose-500">Synchronous / Pre-Paint</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Performance Warning
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Because this hook is synchronous, heavy logic inside it will **block 
                the user interface**. Your app will feel sluggish if you do expensive 
                calculations here. 99% of the time, `useEffect` is the better choice. 
                Only reach for `useLayoutEffect` if you see a visible UI glitch during 
                DOM measurements.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Expert Rule</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If you're building a tooltip, a popover, or a complex drag-and-drop 
                 system, you'll need this hook to calculate position. For everything 
                 else (data fetching, logging, analytics), stick to 'useEffect'."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
