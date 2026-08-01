'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import PropsFlowVisualizer from '../../components/visualizers/specific/PropsFlowVisualizer';

export default function PropsFlow() {
  const topic = TOPICS.find(t => t.id === 'props-flow')!;
  const [code, setCode] = useState(`function Parent() {
  const user = { name: "Subhajit" };

  return (
    <div className="p-4 border">
      <h1 className="text-xl">Parent</h1>
      {/* Passing data DOWN to child */}
      <Child name={user.name} />
    </div>
  );
}

function Child(props) {
  return <p>Hello, {props.name}!</p>;
}`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <PropsFlowVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Unidirectional Data Flow
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In React, data travels in one direction: **downwards**. A parent component 
                passes data to its children via 'props' (properties). This constraint makes 
                the application predictable—if data changes, you know exactly which parent 
                triggered the update.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50 text-center">The Props Contract</h3>
              <div className="flex justify-around items-center text-[11px] font-mono">
                <div className="text-center p-3 border border-border rounded bg-card">Owner (State)</div>
                <div className="text-react">→ (props) →</div>
                <div className="text-center p-3 border border-border rounded bg-card opacity-60">Consumer (Read-only)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Immutability is Law
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Props are **read-only**. A component should never attempt to modify its own props. 
                If a child needs to "change" data, the parent must provide a function (a callback) 
                to trigger a state change in the parent, which then flows back down as a new prop.
              </p>
            </section>

            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
              <h4 className="text-xs font-bold mb-4 uppercase tracking-[0.2em] text-react">Architectural Pattern</h4>
              <p className="text-sm text-zinc-500 italic leading-relaxed">
                "Think of props as **Arguments** to a function. Just as a function shouldn't 
                change its arguments, a component shouldn't change its props. This allows React 
                to use simple reference checks to decide if a re-render is needed."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
