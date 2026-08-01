'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';

export default function ListsKeys() {
  const topic = TOPICS.find(t => t.id === 'lists-keys')!;
  const [code, setCode] = useState(`function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        // Key must be stable, unique, and predictable
        <li key={user.id}>
          {user.name}
        </li>
      ))}
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
                <span className="text-react">01.</span> Why Keys Matter
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                When React diffs two versions of a list, it needs a way to know which items 
                have been moved, added, or deleted. Without a key, React simply updates 
                the content of the existing DOM nodes in order (Index-based diffing), 
                which can lead to massive performance issues or state bugs in components 
                with internal state.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4 text-center">Reconciliation Strategy</h3>
              <div className="flex justify-around items-center text-[11px] font-mono">
                <div className="text-center">
                  <div className="mb-2 opacity-40 italic">No Key</div>
                  <div className="p-2 border border-rose-500/30 rounded bg-rose-500/5">Re-render All</div>
                </div>
                <div className="text-react">vs</div>
                <div className="text-center">
                  <div className="mb-2 opacity-40 italic">Unique Key</div>
                  <div className="p-2 border border-emerald-500/30 rounded bg-emerald-500/5">Move Node</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Index Anti-Pattern
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Using the array index as a key is only safe if the list is static (never 
                filtered, sorted, or reordered). If you shuffle a list using indices as 
                keys, React will think the item at index 0 is the same "identity" even 
                if the data is different, causing input values or animations to persist 
                on the wrong items.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Expert Rule</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Keys don't need to be globally unique—they only need to be unique 
                 among their siblings. Always prefer IDs from your database or generated 
                 UUIDs over indices."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
