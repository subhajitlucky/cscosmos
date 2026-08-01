'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function Useref() {
  const topic = TOPICS.find(t => t.id === 'useref')!;
  const [code, setCode] = useState(`function Stopwatch() {
  const [now, setNow] = useState(null);
  // useRef keeps a stable value between renders
  // but changing it DOES NOT trigger a re-render
  const intervalRef = useRef(null);

  function handleStart() {
    setNow(Date.now());
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  return <button onClick={handleStart}>Start</button>;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Persistence without Noise
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                `useRef` returns a mutable ref object whose `.current` property is persisted 
                throughout the full lifetime of the component. The key difference from 
                `useState` is that **modifying .current does not trigger a re-render**. 
                It's a secret box where you can store data that the UI doesn't need to know about.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Reference vs State</h3>
              <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-center">
                <div className="p-2 border border-border rounded">State: Trigger Render</div>
                <div className="p-2 border border-border rounded opacity-50">Ref: Silent Update</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Accessing the Physical DOM
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                The most common use case for `useRef` is accessing a DOM node directly. 
                When you pass a ref to a JSX element like `&lt;div ref=&#123;myRef&#125; /&gt;`, React 
                sets `myRef.current` to that DOM node once it's mounted. This allows 
                you to call native methods like `.focus()`, `.play()`, or `.scrollTo()`.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Expert Rule</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Do not use refs for things that can be done declaratively. 
                 If you're using a ref to hide/show a component, you're doing it wrong. 
                 Use refs for 'Imperative' tasks that React can't handle out of the box."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
