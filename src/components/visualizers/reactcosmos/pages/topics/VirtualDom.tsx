'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import VirtualDOMVisualizer from '../../components/visualizers/specific/VirtualDOMVisualizer';

export default function VirtualDom() {
  const topic = TOPICS.find(t => t.id === 'virtual-dom')!;
  const [code, setCode] = useState(`// This JSX isn't HTML. 
// It's a lightweight JS object.
const vnode = {
  type: 'div',
  props: {
    className: 'container',
    children: 'Hello World'
  }
};`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <VirtualDOMVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Why the Virtual DOM?
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                The Real DOM (Document Object Model) is a heavy C++ object in the browser. 
                Changing one pixel can trigger a **reflow** or **repaint** of the entire page. 
                React avoids this by keeping a "virtual" copy of the tree in memory. 
                Memory (RAM) is thousands of times faster than DOM manipulation.
              </p>
            </section>

            <div className="p-8 rounded-2xl bg-muted border border-border">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-50 text-center">The VDOM Process</h3>
              <div className="flex justify-between items-center text-[10px] font-mono">
                <div className="text-center p-2 border border-border rounded">Render (New VDOM)</div>
                <div className="text-react">→</div>
                <div className="text-center p-2 border border-border rounded">Diff (Compare)</div>
                <div className="text-react">→</div>
                <div className="text-center p-2 border border-border rounded">Patch (Real DOM)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> Reconciliation
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                Reconciliation is the process of comparing the old VDOM tree with the new one. 
                React uses a **Heuristic Diffing Algorithm** that assumes if two elements have 
                different types, they will produce different trees. This allows it to find 
                changes in O(n) time instead of O(n³).
              </p>
            </section>

            <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800">
              <h4 className="text-xs font-bold mb-4 uppercase tracking-[0.2em] text-amber-500">Developer Note</h4>
              <p className="text-sm text-zinc-400">
                The Virtual DOM is why "Keys" are so important. They help React match old 
                virtual nodes to new ones, preventing unnecessary unmounting and re-mounting 
                of expensive components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
