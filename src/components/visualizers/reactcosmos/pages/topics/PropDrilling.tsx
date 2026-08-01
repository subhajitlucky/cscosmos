'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function PropDrilling() {
  const topic = TOPICS.find(t => t.id === 'prop-drilling')!;
  const [code, setCode] = useState(`function App({ user }) {
  return <Layout user={user} />;
}

function Layout({ user }) {
  return <Header user={user} />;
}

function Header({ user }) {
  // Header doesn't even use 'user', 
  // it just passes it to Nav!
  return <Nav user={user} />;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> The Middleman Problem
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Prop drilling happens when you pass data through several layers of 
                components that don't actually need it, just to get it to a deep 
                descendant. This creates tight coupling and makes it difficult to 
                move or refactor intermediate components.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Coupling Chain</h3>
              <div className="space-y-2 text-[10px] font-mono text-center">
                <div className="p-2 border border-border rounded">A (Source)</div>
                <div className="text-rose-500 opacity-40 italic">prop →</div>
                <div className="p-2 border border-border rounded opacity-40">B (Middleman)</div>
                <div className="text-rose-500 opacity-40 italic">prop →</div>
                <div className="p-2 border border-border rounded">C (Target)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Solutions
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                There are two primary ways to stop prop drilling: 
                **Component Composition** (passing the child itself instead of data) 
                and **Context API**. Composition is often better because it keeps 
                your components more flexible and reusable without global state.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Don't reach for Context too early. First, see if you can pass the component 
                 as a child or a prop. Composition is the 'Clean Code' way to solve 
                 drilling while keeping your dependencies local and obvious."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
