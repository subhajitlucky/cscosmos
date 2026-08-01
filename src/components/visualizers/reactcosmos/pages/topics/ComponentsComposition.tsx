'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import CompositionVisualizer from '../../components/visualizers/specific/CompositionVisualizer';

export default function ComponentsComposition() {
  const topic = TOPICS.find(t => t.id === 'components-composition')!;
  const [code, setCode] = useState(`function Button({ children }) {
  return <button className="btn">{children}</button>;
}

function Card({ title, body }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{body}</p>
      <Button>Learn More</Button>
    </div>
  );
}`);

  return (
    <div className="relative">
      <TopicWrapper
        topic={topic}
        code={code}
        setCode={setCode}
        visualizer={(isExecuting) => <CompositionVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Thinking in Components
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                The genius of React is its **fractal** nature. You build a button, then a form, 
                then a page, then an app. Each layer is just a component composed of smaller 
                components. This allows for total **separation of concerns**—one developer 
                can perfect the Button's accessibility while another builds the Login logic.
              </p>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border bg-muted">
                <h4 className="text-[10px] font-bold uppercase mb-2">Isolation</h4>
                <p className="text-[11px] text-muted-foreground">Styles and logic don't leak out.</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-muted">
                <h4 className="text-[10px] font-bold uppercase mb-2">Reusability</h4>
                <p className="text-[11px] text-muted-foreground">Write once, use across the cosmos.</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Composition vs Inheritance
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React favors **Composition**. Instead of creating a `SpecialButton` class 
                that inherits from `Button`, you pass `props.children` or specialized 
                props to a generic `Button` component. This "has-a" relationship is much 
                more flexible than the "is-a" relationship found in traditional OOP.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If a component is getting too large (over 200 lines), it's a sign that 
                 it should be broken down into smaller sub-components. Aim for components 
                 that do one thing and do it perfectly."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
