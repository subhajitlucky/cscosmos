'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function CodeSplittingLazy() {
  const topic = TOPICS.find(t => t.id === 'code-splitting-lazy')!;
  const [code, setCode] = useState(`// Load component only when needed
const HeavyProfile = React.lazy(() => import('./Profile'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyProfile />
    </Suspense>
  );
}`);

  return (
    <div className="relative">
      <TopicWrapper topic={topic} code={code} setCode={setCode} />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Chunking the Universe
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                By default, your bundler (Vite/Webpack) creates one giant JS file. 
                `React.lazy` allows you to split this into smaller "chunks." 
                The browser only downloads the code for the current page, which 
                makes the initial load significantly faster, especially on mobile.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Bundle Topography</h3>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-center">
                <div className="p-2 border border-border rounded bg-card">Main.js (Core)</div>
                <div className="p-2 border border-border rounded opacity-40">Admin.js (Deferred)</div>
                <div className="p-2 border border-border rounded opacity-40">Charts.js (Deferred)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Dynamic Imports
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Lazy loading uses the ES6 `import()` syntax, which returns a Promise. 
                React handles the resolving of this Promise and ensures that 
                the component is ready before trying to render it. This is why 
                `Suspense` is required—to tell React what to show while the file 
                is downloading.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Senior Insight</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "A great strategy is **Route-based splitting**. Every page in your 
                 app should be its own chunk. This ensures the user never downloads 
                 the code for the 'Settings' page if they only ever visit 'Home'."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
