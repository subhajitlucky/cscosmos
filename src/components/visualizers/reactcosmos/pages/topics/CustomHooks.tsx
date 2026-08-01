'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function CustomHooks() {
  const topic = TOPICS.find(t => t.id === 'custom-hooks')!;
  const [code, setCode] = useState(`// Logic extraction
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Logic as a System
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Custom hooks allow you to extract component logic into reusable functions. 
                Crucially, **Custom hooks can use other hooks**. This allows you to 
                build complex systems (like data fetching or form management) that 
                remain isolated from the UI presentation layer.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Extraction Pattern</h3>
              <div className="flex flex-col gap-2 text-[10px] font-mono">
                <div className="p-2 border border-border rounded opacity-40">useAPI() → State + Effect</div>
                <div className="p-2 border border-react rounded bg-react/5">useAuth() → Context + Reducer</div>
                <div className="p-2 border border-border rounded opacity-40">useForm() → State + Handlers</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Shared Logic, Not Shared State
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Remember: Custom hooks are a mechanism to reuse **stateful logic**, not 
                the state itself. Each time you call a custom hook, all state and effects 
                inside it are totally isolated. If two components use `useWindowWidth`, 
                they both get their own independent event listeners.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If a component's body is mostly hook calls and logic, extract it. 
                 A clean component should focus on mapping data to UI. Moving logic 
                 to hooks makes it unit-testable in isolation."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
