'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import ControlledUncontrolledVisualizer from '../../components/visualizers/specific/ControlledUncontrolledVisualizer';

export default function ControlledUncontrolled() {
  const topic = TOPICS.find(t => t.id === 'controlled-uncontrolled')!;
  const [code, setCode] = useState(`// CONTROLLED: React state drives the value
function Controlled() {
  const [val, setVal] = useState("");
  return <input value={val} onChange={e => setVal(e.target.value)} />;
}

// UNCONTROLLED: DOM drives the value
function Uncontrolled() {
  const inputRef = useRef(null);
  const handleSubmit = () => console.log(inputRef.current.value);
  return <input ref={inputRef} />;
}`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <ControlledUncontrolledVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Who owns the data?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In a **Controlled Component**, React state is the "single source of truth." 
                The input's value always matches the state. In an **Uncontrolled Component**, 
                the DOM (the browser) maintains the value, and we "peek" at it using a Ref 
                only when needed (like on form submission).
              </p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted">
                <h4 className="text-[10px] font-bold uppercase mb-2">Controlled</h4>
                <p className="text-[11px] text-muted-foreground">Easy validation, instant feedback, predictable.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted">
                <h4 className="text-[10px] font-bold uppercase mb-2">Uncontrolled</h4>
                <p className="text-[11px] text-muted-foreground">Better performance for huge forms, closer to vanilla JS.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Recommendation
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React documentation generally recommends **Controlled Components** for 90% 
                of use cases. It makes logic like password strength meters or disabling 
                buttons based on input length trivial to implement. Reserve Uncontrolled 
                logic for integration with non-React libraries or heavy performance-critical UIs.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Think of it as a steering wheel. Controlled is **Fly-by-wire** (software signals the movement). 
                 Uncontrolled is a **Mechanical Link** (direct connection to the wheels)."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
