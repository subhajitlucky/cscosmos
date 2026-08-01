'use client';
import { useState } from 'react';
import { TopicWrapper } from './TopicWrapper';
import { TOPICS } from '../../data/topics';
import JSXCompilationVisualizer from '../../components/visualizers/specific/JSXCompilationVisualizer';

export default function JsxCompilation() {
  const topic = TOPICS.find(t => t.id === 'jsx-compilation')!;
  const [code, setCode] = useState(`// This JSX:
const element = <h1 className="title">Hello World</h1>;

// Becomes this JS:
const compiled = React.createElement(
  'h1', 
  { className: 'title' }, 
  'Hello World'
);
`);

  return (
    <div className="relative">
      <TopicWrapper 
        topic={topic} 
        code={code} 
        setCode={setCode} 
        visualizer={(isExecuting) => <JSXCompilationVisualizer isExecuting={isExecuting} />}
      />
      
      <div className="max-w-6xl mx-auto px-6 pb-24 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">01.</span> Not HTML. Not String.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                JSX looks like HTML, but it's a syntax extension for JavaScript. Browsers 
                cannot read JSX. It must be compiled by a tool like **Babel** or **SWC**. 
                Every tag you write becomes a function call that returns a "React Element" 
                (a plain JavaScript object).
              </p>
            </section>

            <div className="p-6 rounded-xl bg-muted border border-border space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Transformation Flow</h3>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-2 bg-background border border-border">Source (.jsx)</div>
                <div className="p-2 flex items-center justify-center text-react">→</div>
                <div className="p-2 bg-background border border-border">Transpiler (SWC)</div>
                <div className="p-2 flex items-center justify-center text-react">↓</div>
                <div className="p-2 bg-background border border-border col-start-3">Runtime (.js)</div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-react">02.</span> The Modern Transform
              </h2>
              <p className="text-muted-foreground leading-relaxed text-[14px]">
                In older versions of React, you had to `import React` in every file because JSX 
                compiled to `React.createElement`. In modern React (17+), the compiler 
                automatically imports special functions like `_jsx` from the `react/jsx-runtime` 
                package, making your code cleaner and bundles smaller.
              </p>
            </section>

            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800">
               <h4 className="text-xs font-bold mb-3 uppercase tracking-widest text-react">Pro Tip</h4>
               <p className="text-[13px] text-zinc-500 italic">
                 "Since JSX is just JavaScript, you can use any JS expression (math, functions, 
                 variables) inside curly braces {}. This is the ultimate power of React compared 
                 to template-based frameworks."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
