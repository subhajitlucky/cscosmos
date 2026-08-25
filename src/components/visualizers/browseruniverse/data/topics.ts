import type { Topic, TopicSlug } from '../types/content'

export const topics: Topic[] = [
  {
    id: '1',
    title: 'HTML Parsing & Tokenization',
    slug: 'parsing-tokenization',
    description:
      'From raw bytes to tokens to the DOM tree. Watch the tokenizer handle error recovery, foster parenting, and parse-insertion modes.',
    exampleHTML: `<!doctype html>
<html>
  <head><title>Tokenizer</title></head>
  <body>
    <section class="hero">Hello <em>world</em></section>
  </body>
</html>`,
    exampleCSS: `body { font: 16px/1.5 system-ui; }
.hero { color: #c084fc; }`,
    exampleJS: `console.log('Parsing kicks off once the first bytes arrive!')`,
    tags: ['parser', 'tokenizer', 'spec'],
  },
  {
    id: '2',
    title: 'CSS Parsing & Style Calculation',
    slug: 'css-parsing-stylecalc',
    description:
      'Tokenizer → parser → stylesheet tree → selector matching → cascade → computed styles → used values.',
    exampleHTML: `<div class="card primary"><h2>CSSOM</h2><p>Specificity matters</p></div>`,
    exampleCSS: `.card { padding: 16px; color: #e2e8f0; }
.card.primary { background: #0f172a; }
div.card.primary { border: 1px solid #22d3ee; }`,
    exampleJS: `getComputedStyle(document.querySelector('.card')).color`,
    tags: ['cssom', 'specificity', 'cascade'],
  },
  {
    id: '3',
    title: 'DOM Construction & Tree Building',
    slug: 'dom-construction',
    description:
      'How the tree grows as tokens stream in. Includes insertion modes, foster parenting, and custom elements.',
    exampleHTML: `<div id="app"><p data-node="text">DOM nodes stream in order.</p></div>`,
    exampleCSS: `p { color: #22d3ee; }`,
    exampleJS: `const p = document.querySelector('p'); p.setAttribute('data-live', 'true');`,
    tags: ['dom', 'tree', 'mutation'],
  },
  {
    id: '4',
    title: 'Render Tree & Layout Algorithms',
    slug: 'render-tree-layout',
    description:
      'DOM + CSSOM → render tree → layout (block/inline/flow, flex/grid) → fragmentation and reflow.',
    exampleHTML: `<main class="grid">
  <article class="panel">Flow layout</article>
  <article class="panel">Flex & grid</article>
</main>`,
    exampleCSS: `.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.panel { min-height: 140px; border: 1px solid #1e293b; }`,
    exampleJS: `document.querySelector('.grid')?.classList.toggle('wide')`,
    tags: ['layout', 'reflow', 'render-tree'],
  },
  {
    id: '5',
    title: 'Painting, Compositing & Rasterization',
    slug: 'paint-composite-raster',
    description:
      'Display lists, paint records, layerization, raster threads, tiles, and compositing to the final frame.',
    exampleHTML: `<div class="card layer">Layered content</div>`,
    exampleCSS: `.layer { will-change: transform; background: var(--bu-accent); }`,
    exampleJS: `document.querySelector('.layer')?.animate([{opacity:1},{opacity:0.6},{opacity:1}], {duration: 1200, iterations: Infinity})`,
    tags: ['paint', 'layers', 'raster'],
  },
  {
    id: '6',
    title: 'GPU Pipeline & Hardware Acceleration',
    slug: 'gpu-pipeline',
    description:
      'Compositor thread, raster threads, GPU memory, tiles, textures, and when GPU acceleration is (or is not) used.',
    exampleHTML: `<canvas id="gpu-canvas"></canvas>`,
    exampleCSS: `canvas { width: 320px; height: 180px; background: #0f172a; }`,
    exampleJS: `const gl = document.getElementById('gpu-canvas')!.getContext('webgl'); console.log(gl?.getParameter(gl.VERSION))`,
    tags: ['gpu', 'compositor', 'tiling'],
  },
  {
    id: '7',
    title: 'Event Loop, Tasks & Microtasks',
    slug: 'event-loop-microtasks',
    description:
      'Main thread + task queue + microtask queue + rendering ticks, rAF, setTimeout, promises, and task starvation.',
    exampleHTML: `<button id="task">Queue Task</button>`,
    exampleCSS: `button { padding: 12px 16px; }`,
    exampleJS: `setTimeout(() => console.log('macrotask'), 0); Promise.resolve().then(() => console.log('microtask'));`,
    tags: ['event-loop', 'tasks', 'microtasks'],
  },
  {
    id: '8',
    title: 'JS Engine Internals (V8) & JIT',
    slug: 'v8-architecture',
    description:
      'Parser → AST → bytecode → interpreter → baseline JIT → optimizing JIT (TurboFan) → deopt → inline caches.',
    exampleHTML: `<pre>function hotAdd(a,b){return a+b}</pre>`,
    exampleCSS: `pre { background: #0f172a; padding: 12px; }`,
    exampleJS: `function hotAdd(a,b){return a+b}; for (let i=0;i<1e4;i++) hotAdd(i,i);`,
    tags: ['jit', 'bytecode', 'ics'],
  },
  {
    id: '9',
    title: 'Garbage Collection & Memory Management',
    slug: 'garbage-collection',
    description:
      'Roots, mark-and-sweep, generational GC, incremental & concurrent passes, write barriers, and fragmentation.',
    exampleHTML: `<div id="heap">Heap graph</div>`,
    exampleCSS: `#heap { min-height: 120px; }`,
    exampleJS: `const store = []; for (let i=0;i<2000;i++) store.push({i});`,
    tags: ['gc', 'memory', 'heap'],
  },
  {
    id: '10',
    title: 'DevTools Protocol & Tracing',
    slug: 'devtools-protocol',
    description:
      'How Chrome DevTools collects performance & memory traces, how to read flamecharts and timelines.',
    exampleHTML: `<div class="trace">Trace viewer</div>`,
    exampleCSS: `.trace { border: 1px dashed #334155; }`,
    exampleJS: `console.log('Tracing events flow over CDP domains')`,
    tags: ['devtools', 'trace', 'cdp'],
  },
  {
    id: '11',
    title: 'Shadow DOM & Web Components',
    slug: 'shadow-dom-web-components',
    description:
      'Encapsulation, slots, custom elements, style scoping, and the composed tree vs. DOM tree.',
    exampleHTML: `<fancy-card><span slot="title">Shadow DOM</span></fancy-card>`,
    exampleCSS: `fancy-card { display: block; }`,
    exampleJS: `class FancyCard extends HTMLElement { constructor(){ super(); const shadow = this.attachShadow({mode:'open'}); shadow.innerHTML = '<slot name="title"></slot><slot></slot>'; } } customElements.define('fancy-card', FancyCard);`,
    tags: ['web-components', 'shadow-dom'],
  },
  {
    id: '12',
    title: 'WebIDL & Host Bindings',
    slug: 'webidl-bindings',
    description:
      'How WebIDL shapes the DOM APIs, types, brand checks, and conversion rules between JS and the platform.',
    exampleHTML: `<code>HTMLElement implements EventTarget</code>`,
    exampleCSS: `code { background: #0f172a; padding: 8px; }`,
    exampleJS: `const url = new URL('https://example.com'); console.log(url.protocol)`,
    tags: ['webidl', 'bindings'],
  },
  {
    id: '13',
    title: 'Security, Sandboxing & Same-origin',
    slug: 'security-sandboxing',
    description:
      'Origin model, SOP, CORP/CORS, CSP, iframes & sandbox flags, COOP/COEP, and process isolation.',
    exampleHTML: `<iframe sandbox="allow-scripts"></iframe>`,
    exampleCSS: `iframe { border: 1px solid #1e293b; }`,
    exampleJS: `console.log('Always validate postMessage origin!')`,
    tags: ['security', 'csp', 'origin'],
  },
  {
    id: '14',
    title: 'Rendering Performance & Optimization',
    slug: 'performance-optimizations',
    description:
      'RAIL goals, avoiding layout thrash, requestIdleCallback, preloading, and profiling paint/composite costs.',
    exampleHTML: `<div class="perf-card">Profile me</div>`,
    exampleCSS: `.perf-card { will-change: transform; transform: translateZ(0); }`,
    exampleJS: `requestIdleCallback(() => console.log('Do background work here'))`,
    tags: ['performance', 'rail', 'profiling'],
  },
]

export function findTopic(slug: TopicSlug) {
  return topics.find((topic) => topic.slug === slug)
}

