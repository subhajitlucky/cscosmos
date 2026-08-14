export interface BrowserTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Critical Rendering Path' | 'V8 Engine & Memory' | 'Event Loop & Frame Budget' | 'Multi-Process Architecture' | 'Storage & Caching';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  codeSnippet: string;
  outputDescription: string;
  related: string[];
}

export interface BrowserTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: BrowserTopic[];
}

export const browserTopics: BrowserTopic[] = [
  // 1. Critical Rendering Path
  {
    id: 'critical-rendering-path-dom-cssom',
    title: 'The Critical Rendering Path: DOM, CSSOM to Pixels',
    kicker: 'Rendering / 01',
    group: 'Critical Rendering Path',
    difficulty: 'starter',
    summary: 'How raw HTML bytes transform through Tokenization, DOM Tree, CSSOM, Render Tree, Layout, Paint, and Compositing.',
    definition: 'The Critical Rendering Path (CRP) is the sequence of browser operations that converts HTML, CSS, and JavaScript into actual pixels on the screen: Bytes -> Characters -> Tokens -> Nodes -> DOM/CSSOM Trees -> Render Tree -> Layout (calculating exact geometry and coordinates) -> Paint (rasterizing vector primitives into pixel bitmaps) -> Compositing (combining GPU layers for display).',
    analogy: 'An architectural construction project: Raw HTML blueprints (DOM) and interior design swatches (CSSOM) are combined into a 3D floorplan (Render Tree), survey stakes measure precise physical dimensions (Layout), painters apply colors (Paint), and separate glass panels are assembled onto the building exterior (GPU Compositing).',
    steps: [
      'HTML Tokenization: Bytes converted to UTF-8 characters and parsed into StartTag/EndTag tokens',
      'DOM Tree Construction: Tokens linked into hierarchical parent-child Node graph',
      'CSSOM Tree Construction: CSS stylesheets parsed into cascading style rule tree',
      'Render Tree: DOM and CSSOM merged, filtering out display: none elements and script tags',
      'Layout (Reflow): Viewport dimensions calculate exact pixel x, y, width, and height for each box',
      'Paint & Rasterization: Visual properties (colors, borders, shadows) drawn into Skia/GPU draw commands',
      'Compositing: Layers uploaded to GPU VRAM and rasterized to display buffer at 60Hz/120Hz'
    ],
    mistakes: [
      'Triggering layout thrashing by reading geometric properties (e.g. offsetTop) immediately after mutating styles in a loop',
      'Using top/left animations instead of GPU-accelerated transform and opacity'
    ],
    optimization: 'Animating transform and opacity bypasses both Layout and Paint stages entirely, executing in sub-millisecond time on the GPU compositor thread.',
    codeSnippet: `// Avoiding Layout Thrashing (FastDOM Batching)
// BAD: Interleaved Read/Write forces synchronous layout recalculation on every iteration
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight; // READ (Forces synchronous layout!)
  elements[i].style.height = (height + 10) + 'px'; // WRITE
}

// GOOD: Batch all reads first, then batch all writes via requestAnimationFrame
const heights = elements.map(el => el.offsetHeight); // Single READ batch
requestAnimationFrame(() => {
  elements.forEach((el, i) => {
    el.style.height = (heights[i] + 10) + 'px'; // Single WRITE batch
  });
});`,
    outputDescription: 'Eliminates layout thrashing to maintain a consistent 60/120 FPS frame rate.',
    related: ['v8-ignition-turbofan-jit', 'browser-event-loop-frame-budget', 'multi-process-architecture-sandboxing']
  },

  // 2. V8 Engine & Memory
  {
    id: 'v8-ignition-turbofan-jit',
    title: 'V8 Engine Internals: Ignition Bytecode & TurboFan JIT',
    kicker: 'JavaScript Engine / 01',
    group: 'V8 Engine & Memory',
    difficulty: 'advanced',
    summary: 'How Google V8 parses JavaScript into AST, interprets bytecode via Ignition, optimizes hot functions with TurboFan JIT, and bails out on deoptimizations.',
    definition: 'V8 executes JavaScript using a multi-tiered compilation pipeline. The Parser creates an Abstract Syntax Tree (AST). Ignition, a register-based interpreter, compiles AST into compact bytecode for fast startup. When a function becomes "hot" (called frequently), TurboFan compiles the bytecode into highly optimized machine code based on Inline Caches (IC). If type assumptions are violated, TurboFan deoptimizes back to Ignition bytecode.',
    analogy: 'A foreign translation team: an interpreter (Ignition) translates spoken sentences word-by-word instantly with 0 startup delay. When a speech is repeated 1,000 times, a speed-stenographer (TurboFan) typesets a polished, printed translation in native machine code.',
    steps: [
      'Parser generates AST and Scopes from raw JavaScript source code',
      'Ignition Interpreter compiles AST into register bytecode (e.g. LdaNamedProperty, Star r0, Add)',
      'Profiler monitors function execution frequency and records Inline Cache (IC) type feedback',
      'TurboFan JIT Compiler inlines functions and generates optimized assembly for monomorphic types',
      'Deoptimization: Passing an unexpected type (e.g. string instead of int) triggers bailout to Ignition'
    ],
    mistakes: [
      'Writing polymorphic functions that receive many differing hidden classes / shapes (causes TurboFan deoptimization)',
      'Mutating object property ordering after instantiation (forces V8 to create new transition hidden classes)'
    ],
    optimization: 'Monomorphic function calls (always passing objects with the same Hidden Class/Shape) execute 10x faster due to direct machine code pointer caching.',
    codeSnippet: `// V8 Hidden Classes & Monomorphism Optimization
class Point {
  constructor(public x: number, public y: number) {}
}

// 1. Monomorphic Call Site: Always receives Point with shape {x, y}
function distance(p1: Point, p2: Point): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// V8 compiles distance() to direct native machine instructions with 0 property lookup overhead!
for (let i = 0; i < 100000; i++) {
  distance(new Point(i, i + 1), new Point(i + 2, i + 3));
}`,
    outputDescription: 'Enables TurboFan JIT peak machine-code execution speed.',
    related: ['critical-rendering-path-dom-cssom', 'browser-event-loop-frame-budget', 'storage-caching-subsystems']
  },

  // 3. Event Loop & Frame Budget
  {
    id: 'browser-event-loop-frame-budget',
    title: 'The Browser Event Loop & The 16.6ms Frame Budget',
    kicker: 'Concurrency / 01',
    group: 'Event Loop & Frame Budget',
    difficulty: 'intermediate',
    summary: 'The interaction between Macrotasks, Microtask queue draining, requestAnimationFrame, and display VSync cycles.',
    definition: 'At 60Hz display refresh rates, the browser has exactly 16.67ms per frame (8.33ms at 120Hz) to execute all JavaScript, process events, and render pixels. The Browser Event Loop executes one Macrotask (setTimeout, I/O), immediately drains the entire Microtask Queue (Promise.then, queueMicrotask), runs requestAnimationFrame callbacks, and invokes the Rendering Pipeline (Style -> Layout -> Paint -> Composite) before VSync.',
    analogy: 'A high-speed train departure platform: exactly every 16.6ms, the train must depart. The conductor admits one VIP passenger (Macrotask), clears all pending priority ticket-holders (Microtasks), allows decorators on board (rAF), and snaps the train doors shut (VSync Render).',
    steps: [
      '1. Execute oldest Macrotask from task queue (e.g. click event callback)',
      '2. Microtask Checkpoint: Drain ALL microtasks (Promises, MutationObservers) until queue is empty',
      '3. Has Rendering Window: If VSync pulse arrives, execute requestAnimationFrame callbacks',
      '4. Render Steps: Recalculate Styles -> Update Layout (Reflow) -> Paint Dirty Regions -> Composite',
      '5. Idle Phase: If time remains in the 16.6ms budget, execute requestIdleCallback tasks'
    ],
    mistakes: [
      'Spawning infinite microtask loops (e.g. recursive Promise.resolve().then()), which starves the event loop and completely freezes UI rendering',
      'Running heavy computational work in requestAnimationFrame instead of offloading to Web Workers'
    ],
    optimization: 'Scheduling non-critical telemetry and garbage collection tasks with requestIdleCallback prevents UI jank during user interactions.',
    codeSnippet: `// Event Loop Execution Order Demonstration
console.log('1. Synchronous Mainline');

setTimeout(() => {
  console.log('4. Macrotask (setTimeout)');
}, 0);

Promise.resolve().then(() => {
  console.log('2. Microtask 1 (Promise)');
}).then(() => {
  console.log('3. Microtask 2 (Chained Promise)');
});

requestAnimationFrame(() => {
  console.log('5. Animation Frame Callback (Before Render)');
});

// Output Order:
// 1. Synchronous Mainline
// 2. Microtask 1 (Promise)
// 3. Microtask 2 (Chained Promise)
// 5. Animation Frame Callback
// 4. Macrotask (setTimeout)`,
    outputDescription: 'Demonstrates microtask queue prioritization over macrotasks and rendering.',
    related: ['critical-rendering-path-dom-cssom', 'v8-ignition-turbofan-jit', 'multi-process-architecture-sandboxing']
  },

  // 4. Multi-Process Architecture
  {
    id: 'multi-process-architecture-sandboxing',
    title: 'Multi-Process Architecture & Site Isolation Sandboxing',
    kicker: 'Architecture / 02',
    group: 'Multi-Process Architecture',
    difficulty: 'advanced',
    summary: 'How Chromium isolates tabs into sandboxed OS processes to prevent tab crashes and protect against Spectre memory attacks.',
    definition: 'Modern browsers employ a Multi-Process Architecture. The Browser Process manages the UI, URL bar, and network. The GPU Process handles hardware-accelerated 3D and rasterization. Each website runs in an isolated, sandboxed Renderer Process with zero direct OS disk or network access. Site Isolation places cross-origin iframes in separate OS processes to block cross-site Spectre side-channel memory reads.',
    analogy: 'A high-security research laboratory: each experiment (Renderer Process) takes place in a sealed containment pod. Scientists communicate with the outside world only through intercoms (Mojo IPC), ensuring an explosion in one lab cannot harm the rest of the facility.',
    steps: [
      'User enters URL: Browser Process coordinates DNS lookup and HTTP fetch via Network Service',
      'Browser Process provisions dedicated sandboxed Renderer Process via OS fork()',
      'Network streams response bytes to Renderer Process via Mojo IPC shared memory',
      'Renderer process executes Blink (HTML/CSS parsing) and V8 (JavaScript execution)',
      'Renderer sends Skia drawing commands to GPU Process for final screen rasterization'
    ],
    mistakes: [
      'Assuming multiple tabs from different domains share the same OS thread or memory space',
      'Failing to configure Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP) when using SharedArrayBuffer'
    ],
    optimization: 'Site Isolation and Process-per-Site-Instance guarantees that a crashing or malicious tab cannot freeze or inspect memory of other active tabs.',
    codeSnippet: `// Mojo IPC Protocol Interface Concept
interface RenderFrameMessageFilter {
  // Renderer requests Browser Process to issue network request
  CreateLoaderAndStart(
    Request request,
    NetworkServiceClient client
  );

  // Renderer asks GPU Process to allocate hardware swap chain
  CreateGpuMemoryBuffer(
    Size size,
    BufferFormat format
  ) => (GpuMemoryBufferHandle handle);
}`,
    outputDescription: 'Models asynchronous IPC communication across sandboxed operating system processes.',
    related: ['critical-rendering-path-dom-cssom', 'storage-caching-subsystems', 'browser-event-loop-frame-budget']
  },

  // 5. Storage & Caching
  {
    id: 'storage-caching-subsystems',
    title: 'Client Storage & The HTTP Cache Hierarchy',
    kicker: 'Storage / 01',
    group: 'Storage & Caching',
    difficulty: 'intermediate',
    summary: 'Deconstructing Memory Cache, Service Worker Cache API, HTTP Disk Cache, and IndexedDB B-Tree transactional storage.',
    definition: 'The browser evaluates client storage across a strict latency hierarchy: Memory Cache (instant, lifetime of page), Service Worker Cache API (programmable offline storage), HTTP Disk Cache (governed by Cache-Control, ETag, max-age), and IndexedDB (an asynchronous, transactional NoSQL database indexing structured objects with B-Trees for gigabytes of offline client data).',
    analogy: 'A workspace storage setup: current sticky notes on your desk (Memory Cache), a curated briefcase for travel (Service Worker Cache), filing cabinets in your office (HTTP Disk Cache), and the company warehouse archive (IndexedDB).',
    steps: [
      'Resource requested: Browser checks in-memory cache for fast reuse',
      'Service Worker fetch handler: Intercepts request; checks CacheStorage API for cached Response',
      'HTTP Disk Cache: Validates Cache-Control max-age or sends conditional 304 Not Modified request via If-None-Match ETag',
      'Network Fetch: Downloads resource from remote origin server',
      'IndexedDB: Asynchronously stores large offline documents and binary Blobs'
    ],
    mistakes: [
      'Using synchronous LocalStorage for megabytes of data (blocks the main UI thread during JSON.stringify/parse)',
      'Caching sensitive authenticated API responses without Cache-Control: no-store'
    ],
    optimization: 'IndexedDB transactions run asynchronously off the main thread with index-assisted cursors, safely handling 500MB+ datasets without frame drops.',
    codeSnippet: `// IndexedDB Transactional Storage Pattern
export async function saveToIndexedDb(storeName: string, item: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CosmosBrowserDB', 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}`,
    outputDescription: 'Performs non-blocking transactional persistence with indexed key lookups.',
    related: ['critical-rendering-path-dom-cssom', 'v8-ignition-turbofan-jit', 'multi-process-architecture-sandboxing']
  }
];

export const browserTopicGroups: BrowserTopicGroup[] = [
  {
    id: 'crp',
    name: 'Critical Rendering Path',
    description: 'HTML parsing, CSSOM computation, Render Tree, Reflow layout, Paint rasterization, and GPU compositing.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: browserTopics.filter(t => t.group === 'Critical Rendering Path')
  },
  {
    id: 'v8-engine',
    name: 'V8 Engine & Memory Pipeline',
    description: 'Parser, AST, Ignition bytecode interpreter, TurboFan JIT compiler, and Orinoco GC.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: browserTopics.filter(t => t.group === 'V8 Engine & Memory')
  },
  {
    id: 'event-loop',
    name: 'Event Loop & Frame Budget',
    description: 'Macrotask vs Microtask queues, requestAnimationFrame, and 16.6ms 60 FPS frame budgets.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: browserTopics.filter(t => t.group === 'Event Loop & Frame Budget')
  },
  {
    id: 'multi-process',
    name: 'Multi-Process Architecture',
    description: 'Browser UI process, Sandboxed Renderer processes, GPU process, and Mojo IPC communication.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: browserTopics.filter(t => t.group === 'Multi-Process Architecture')
  },
  {
    id: 'storage-cache',
    name: 'Storage & Caching Subsystems',
    description: 'HTTP Memory/Disk cache, Service Worker Cache API, and IndexedDB B-Tree transactions.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: browserTopics.filter(t => t.group === 'Storage & Caching')
  }
];

export const getBrowserTopic = (id: string) => browserTopics.find(t => t.id === id);
