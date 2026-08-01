'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ContextApi() {
  const topic = TOPICS.find(t => t.id === 'context-api')!;
  const [code, setCode] = useState(`const ThemeContext = createContext("dark");

function App() {
  return (
    <ThemeContext.Provider value="light">
      <DeepChild />
    </ThemeContext.Provider>
  );
}

function DeepChild() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Tree Broadcasting
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Context allows a parent component to provide data to its entire subtree 
                without passing it through every intermediate child. This is ideal for 
                global data like **Theming**, **User Auth**, or **Language preferences**.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Data Transmission</h3>
              <div className="flex flex-col items-center gap-2 text-[10px] font-mono">
                <div className="p-2 border border-react rounded bg-react/5">Provider</div>
                <div className="h-4 w-px bg-border border-dashed" />
                <div className="p-2 border border-border rounded opacity-40">Middleware (Skipped)</div>
                <div className="h-4 w-px bg-border border-dashed" />
                <div className="p-2 border border-react rounded bg-react/5">Consumer</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Performance Warning
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Context is **not** a state management tool like Redux. When the value 
                in a Provider changes, **every single component** that uses `useContext` 
                for that provider will re-render. Frequent updates to a giant context 
                object can lead to noticeable lag.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Senior Architect Tip</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Separate your contexts. Don't put 'user', 'settings', and 'theme' 
                 in one giant context. Create small, atomic providers to ensure only 
                 the necessary parts of the tree re-render when a specific value changes."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
