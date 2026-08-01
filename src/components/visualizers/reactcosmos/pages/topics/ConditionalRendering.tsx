'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import ConditionalRenderingVisualizer from '../../components/visualizers/specific/ConditionalRenderingVisualizer';

export default function ConditionalRendering() {
  const topic = TOPICS.find(t => t.id === 'conditional-rendering')!;
  const [code, setCode] = useState(`function AuthButton({ isLoggedIn }) {
  // If true, render the Profile button
  if (isLoggedIn) {
    return <button>View Profile</button>;
  }

  // Otherwise, render the Login button
  return <button>Log In</button>;
}`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <ConditionalRenderingVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Logic in the View
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Since JSX is JavaScript, we don't need a special template syntax like 
                `ng-if` or `v-if`. We use standard JS patterns. React treats `null`, 
                `undefined`, and `false` as "empty," meaning nothing will be rendered 
                to the screen.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Pattern Guide</h3>
              <ul className="space-y-3 text-[12px]">
                <li className="flex justify-between"><span>Early Return</span> <span className="text-zinc-500">Full block change</span></li>
                <li className="flex justify-between border-t border-border pt-3"><span>Ternary (?:)</span> <span className="text-zinc-500">Switching between two nodes</span></li>
                <li className="flex justify-between border-t border-border pt-3"><span>Logical (&&)</span> <span className="text-zinc-500">Optional visibility</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Zero Trap
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                A common "gotcha" in React is that while `false` renders nothing, 
                the number `0` **does** render. If you write `count && &lt;UI /&gt;` and 
                count is 0, React will render the number '0' on your screen. Always 
                be explicit with boolean conversions: `!!count && &lt;UI /&gt;`.              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Maintainability Note</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "If your ternary expressions are nesting (e.g. condition ? a : b ? c : d), 
                 stop immediately. Move that logic into a separate helper function or 
                 a sub-component to keep the JSX readable."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
