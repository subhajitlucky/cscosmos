'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ErrorBoundaries() {
  const topic = TOPICS.find(t => t.id === 'error-boundaries')!;
  const [code, setCode] = useState(`class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Circuit Breakers
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In vanilla JS, a crash in one part of the code can stop the whole 
                script. In React, Error Boundaries ensure that a crash in one 
                component doesn't unmount the entire app. It "catches" the error 
                and allows you to display a fallback UI (like a "Sorry" message).
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Containment Map</h3>
              <div className="space-y-2 text-[10px] font-mono text-center">
                <div className="p-2 border border-emerald-500 rounded bg-emerald-500/5">App Root (Safe)</div>
                <div className="p-2 border border-rose-500 rounded bg-rose-500/5">Crashed Widget (Caught)</div>
                <div className="p-2 border border-emerald-500 rounded bg-emerald-500/5">Sidebar (Safe)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Limitations
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Error Boundaries only catch errors during **Rendering**, in 
                **Lifecycle methods**, and in **Constructors**. They **cannot** 
                catch errors in event handlers, asynchronous code (like `fetch`), 
                or server-side rendering. For those, you still need standard 
                `try/catch` blocks.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Granularity is key. Don't just wrap your whole app in one boundary. 
                 Wrap major UI blocks (Sidebar, Feed, Profile) in their own 
                 boundaries so that if the Feed crashes, the user can still 
                 navigate using the Sidebar."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
