'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ServerComponents() {
  const topic = TOPICS.find(t => t.id === 'server-components')!;
  const [code, setCode] = useState(`// app/page.js (Server Component)
async function Page() {
  // Direct DB access! 
  // No 'useEffect' needed.
  const posts = await db.posts.findMany();

  return (
    <ul>
      {posts.map(p => <li key={p.id}>{p.title}</li>)}
    </ul>
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
                <span className="text-react">01.</span> Zero-Bundle Size
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                React Server Components (RSC) are a new type of component that only 
                runs on the server. Because they never reach the browser, their 
                dependencies (like heavy Markdown or Date libraries) contribute 
                **zero** to your client-side bundle size.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Execution Split</h3>
              <div className="flex justify-around items-center text-[11px] font-mono">
                <div className="p-2 border border-blue-500/30 text-blue-500 rounded bg-blue-500/5">Server (Logic)</div>
                <div className="text-react">→ (JSON) →</div>
                <div className="p-2 border border-emerald-500/30 text-emerald-500 rounded bg-emerald-500/5">Client (Interactivity)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Server-side Logic
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Server components can be `async` and can perform database queries 
                or file system operations directly. This eliminates the "Fetch-Waterfalls" 
                of traditional client-side apps where you fetch data in a nested 
                chain of effects.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Architectural Advice</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Think of Server Components as the **Skeleton** of your app and 
                 Client Components as the **Muscles**. Use Server Components for 
                 layout, data fetching, and static content. Use Client Components 
                 only for state, effects, and event listeners."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
