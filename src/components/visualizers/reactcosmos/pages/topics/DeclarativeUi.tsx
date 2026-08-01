'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import DeclarativeUIVisualizer from '../../components/visualizers/specific/DeclarativeUIVisualizer';

export default function DeclarativeUi() {
  const topic = TOPICS.find(t => t.id === 'declarative-ui')!;
  const [code, setCode] = useState(`function Toggle() {
  const [isOn, setIsOn] = useState(false);

  // DECLARATIVE: Describe WHAT the UI looks like 
  // in both possible states. React handles the HOW.
  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <DeclarativeUIVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The Mental Shift
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Imperative programming is like giving a taxi driver **turn-by-turn directions**: 
                "Go 100m, turn left, wait for the light." If you miss one step, you're lost. 
                Declarative programming is like giving the driver an **address**: 
                "Take me to 123 React St." The driver (React) figures out the best way to get there.
              </p>
            </section>

            <section className="p-8 rounded-2xl bg-zinc-950 border border-border">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4 text-react">Imperative Nightmare</h3>
              <p className="text-[13px] text-zinc-500 font-mono italic">
                "As the app grows, the number of manual DOM updates grows exponentially. 
                Missing just one 'remove-class' call leads to ghost UI states and difficult bugs."
              </p>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> State as the Source of Truth
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In a declarative UI, you don't "update the header." You "update the state," and the 
                header observes that state change. This decoupling is what makes React components 
                so easy to test—you test the logic (state) and the view (JSX) separately.
              </p>
            </section>
            
            <div className="p-6 rounded-xl bg-muted border border-border">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest">Key Takeaway</h4>
               <p className="text-sm font-medium">
                 Stop thinking about **events**. Start thinking about **states**. 
                 An event is just a trigger to transition from State A to State B.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
