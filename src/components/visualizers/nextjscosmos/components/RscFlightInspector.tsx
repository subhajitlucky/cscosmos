'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Layers, Play, RotateCcw, Server, Smartphone, Sparkles, Terminal } from 'lucide-react';

interface ComponentNode {
  name: string;
  type: 'server' | 'client';
  bundleSize: string;
  code: string;
}

const COMPONENTS: ComponentNode[] = [
  {
    name: 'ProductPage (Server Component)',
    type: 'server',
    bundleSize: '0 KB (Zero Client JS)',
    code: `// Server Component: direct DB access
const product = await db.query("SELECT * FROM products WHERE id = 1");
return <ProductView product={product}><BuyButton id={1} /></ProductView>;`
  },
  {
    name: 'BuyButton (Client Component)',
    type: 'client',
    bundleSize: '2.4 KB (Hydrated Leaf)',
    code: `'use client';
export function BuyButton({ id }) {
  const [loading, setLoading] = useState(false);
  return <button onClick={() => buy(id)}>Add to Cart</button>;
}`
  }
];

export function RscFlightInspector() {
  const [selectedComp, setSelectedComp] = useState<ComponentNode>(COMPONENTS[0]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [flightOutput, setFlightOutput] = useState<string | null>(null);

  const simulateFlightStream = () => {
    setIsStreaming(true);
    setFlightOutput(null);

    setTimeout(() => {
      setIsStreaming(false);
      setFlightOutput(`1:HL["/static/css/app.css","style"]
0:{"name":"ProductPage","props":{"title":"Mechanical Keyboard","price":120},"children":["$","$L2",null,{"id":1}]}
2:I["./BuyButton.client.js",["client","app"],"BuyButton"]

✨ STREAM SUMMARY:
• Server Tree rendered to serialized JSON flight data
• Client bundle only downloads 2.4 KB for BuyButton island
• Heavy DB libraries & Markdown parsers stay on the server!`);
    }, 600);
  };

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
              Next.js 15 Deep Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              React Server Components (RSC) Flight Stream Inspector
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold">
          0 KB Client Bundle
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Component Selector & Code */}
        <div className="space-y-4">
          <div className="flex gap-2">
            {COMPONENTS.map((comp) => (
              <button
                key={comp.name}
                onClick={() => setSelectedComp(comp)}
                className={`flex-1 p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                  selectedComp.name === comp.name
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-card border-border text-foreground hover:border-blue-500'
                }`}
              >
                {comp.type === 'server' ? <Server className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                <span>{comp.type === 'server' ? 'Server Component' : 'Client Component'}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span>{selectedComp.name}</span>
              <span className="text-emerald-400 font-bold">{selectedComp.bundleSize}</span>
            </div>
            <pre className="text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {selectedComp.code}
            </pre>
          </div>
        </div>

        {/* Flight Stream Output */}
        <div className="rounded-2xl border border-border bg-slate-950 text-slate-100 p-4 font-mono text-xs shadow-inner flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>RSC Serialized Flight Payload (Over the Wire)</span>
            </span>
            <span className="text-emerald-400">Content-Type: text/x-component</span>
          </div>

          <div className="flex-1 overflow-y-auto leading-relaxed py-2 min-h-[140px]">
            {isStreaming ? (
              <div className="text-blue-400 flex items-center gap-2">
                <span className="animate-spin">⚙️</span> Streaming RSC chunks from server to client...
              </div>
            ) : flightOutput ? (
              <pre className="text-emerald-300 whitespace-pre-wrap">{flightOutput}</pre>
            ) : (
              <div className="text-slate-500 italic">
                Click &ldquo;Stream Flight Payload&rdquo; to serialize the Server Component tree into binary chunks.
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Zero hydration cost for server nodes</span>
            <button
              onClick={simulateFlightStream}
              disabled={isStreaming}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Stream Flight Payload</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
