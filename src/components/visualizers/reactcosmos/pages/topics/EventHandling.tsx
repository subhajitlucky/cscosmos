'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import EventHandlingVisualizer from '../../components/visualizers/specific/EventHandlingVisualizer';

export default function EventHandling() {
  const topic = TOPICS.find(t => t.id === 'event-handling')!;
  const [code, setCode] = useState(`function Dashboard() {
  const handleClick = (event) => {
    // This is a SyntheticEvent, not a NativeEvent
    console.log(event.type); 
    event.stopPropagation();
  };

  return <button onClick={handleClick}>Execute</button>;
}`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <EventHandlingVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Synthetic Events
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React doesn't attach events directly to the elements you define. Instead, it 
                wraps native browser events in a **SyntheticEvent** object. This ensures 
                identical behavior across all browsers (Chrome, Safari, Firefox) and 
                improves performance through event delegation.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Modern Delegation (React 17+)</h3>
              <div className="flex justify-center items-center text-[11px] font-mono gap-4">
                <div className="p-2 border border-border rounded">Browser Event</div>
                <div className="text-react">→</div>
                <div className="p-2 border border-react rounded bg-react/5">App Root Container</div>
                <div className="text-react">→</div>
                <div className="p-2 border border-border rounded">Your Handler</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Automatic Binding
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In modern function components, you don't need to worry about `this` binding. 
                However, remember that React handlers are passed as **camelCase** 
                (`onClick` instead of `onclick`). These handlers are executed during the 
                Bubble phase by default.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Expert Note</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Because React uses delegation at the root, calling 'stopPropagation' 
                 doesn't stop the native event from reaching the document. It only 
                 stops it within the React virtual tree. This is a common source of 
                 confusion when mixing React with legacy jQuery plugins."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
