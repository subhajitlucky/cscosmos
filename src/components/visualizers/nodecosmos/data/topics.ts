export interface NodeTopic {
  id: string;
  title: string;
  category: 'foundations' | 'event-loop' | 'streams' | 'concurrency' | 'internals';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const NODE_TOPICS: NodeTopic[] = [
  {
    id: 'node-architecture-v8-libuv',
    title: 'Node.js Architecture: V8 Engine, C++ Bindings & Libuv',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Node.js combines Google V8 (compiles JS to machine code) with Libuv (C library providing the cross-platform asynchronous event loop and thread pool).',
    mentalModel: 'The Head Waiter & Kitchen Staff: V8 is the head waiter taking orders quickly on the restaurant floor; Libuv is the backend kitchen with chefs (thread pool) preparing slow dishes without stalling table service.',
    codeSnippet: `// V8 executes synchronous JS on Main Thread:
console.log('1. Start (V8)');

// Libuv handles non-blocking asynchronous I/O:
import fs from 'fs';
fs.readFile('./package.json', (err, data) => {
  console.log('3. File read complete (Libuv callback)');
});

console.log('2. End of sync script');`,
    takeaways: [
      'Single-threaded execution: JavaScript code executes sequentially on a single V8 call stack.',
      'Libuv manages operating system asynchronous primitives (epoll on Linux, kqueue on macOS, IOCP on Windows).',
      'C++ Bindings bridge JavaScript APIs (fs, crypto, net) with low-level native system calls.'
    ],
    commonPitfall: {
      mistake: 'Executing heavy CPU calculations (e.g. JSON.parse on a 500MB string or crypto loops) on the main thread, freezing all incoming HTTP requests.',
      fix: 'Offload CPU-bound tasks to Worker Threads or native C++ addons.'
    },
    nextTopicId: 'libuv-event-loop-6-phases'
  },
  {
    id: 'libuv-event-loop-6-phases',
    title: 'The 6-Phase Libuv Event Loop (Timers, Poll, Check)',
    category: 'event-loop',
    difficulty: 'Advanced',
    summary: 'Each tick of the Libuv Event Loop processes 6 distinct phases: Timers -> Pending Callbacks -> Idle/Prepare -> Poll -> Check -> Close Callbacks.',
    mentalModel: 'The Clock Face with 6 Stations: The train visits Station 1 (Timers: setTimeout), Station 2 (I/O Errors), Station 3 (Internal), Station 4 (Poll: incoming network/disk events), Station 5 (Check: setImmediate), and Station 6 (Close: socket.on("close")).',
    codeSnippet: `import fs from 'fs';

// Timers Phase:
setTimeout(() => console.log('1. setTimeout (Timers Phase)'), 0);

// Check Phase:
setImmediate(() => console.log('2. setImmediate (Check Phase)'));

// Poll Phase (I/O):
fs.readFile('./package.json', () => {
  console.log('3. I/O Callback (Poll Phase)');
  // Inside I/O cycle, setImmediate ALWAYS executes before setTimeout!
  setTimeout(() => console.log('5. setTimeout in I/O'), 0);
  setImmediate(() => console.log('4. setImmediate in I/O'));
});`,
    takeaways: [
      '1. Timers: Executes callbacks scheduled by setTimeout() and setInterval().',
      '2. Poll: Retrieves new I/O events (network packets, file reads) and executes their callbacks. Blocks if no other phases are queued.',
      '3. Check: Executes setImmediate() callbacks immediately after the Poll phase.',
      'Inside an I/O callback, setImmediate is guaranteed to run before setTimeout(..., 0).'
    ],
    commonPitfall: {
      mistake: 'Assuming setTimeout(fn, 0) runs in 0ms; operating systems enforce a minimum 1ms timer threshold.',
      fix: 'Use setImmediate() when you want a callback to execute immediately after the current Poll cycle.'
    },
    nextTopicId: 'microtasks-nexttick-vs-promises'
  },
  {
    id: 'microtasks-nexttick-vs-promises',
    title: 'Microtasks: process.nextTick vs Promise.then',
    category: 'event-loop',
    difficulty: 'Intermediate',
    summary: 'Microtask queues are NOT part of Libuv; they are managed directly by Node.js. process.nextTick has higher priority than Promise microtasks, and both drain completely between every single event loop phase.',
    mentalModel: 'The VIP Fast-Track Lane: When an airplane lands (an event loop phase finishes), VIP passengers (nextTick) exit first, followed by First Class (Promises), before general passengers (Timers/Poll) can board the next flight.',
    codeSnippet: `// 1. Synchronous:
console.log('1. Sync Start');

// Microtask Queue (Promises):
Promise.resolve().then(() => console.log('4. Promise.then (Microtask)'));

// nextTick Queue (Highest Priority Microtask):
process.nextTick(() => console.log('3. process.nextTick (VIP Queue)'));

// Macrotask (Timers Phase):
setTimeout(() => console.log('5. setTimeout (Macrotask)'), 0);

console.log('2. Sync End');
// Output: 1 -> 2 -> 3 -> 4 -> 5`,
    takeaways: [
      'Execution Priority: Synchronous Code -> process.nextTick Queue -> Promise Microtask Queue -> Next Libuv Phase.',
      'Microtask queues drain completely before the event loop advances to the next phase.',
      'A recursive process.nextTick loop will starve the event loop, preventing all I/O, timers, and HTTP requests from ever executing.'
    ],
    commonPitfall: {
      mistake: 'Recursively calling process.nextTick(), starving the event loop and freezing I/O completely.',
      fix: 'Use setImmediate() for recursive task scheduling to allow the Poll phase to process incoming I/O between cycles.'
    },
    nextTopicId: 'libuv-threadpool-uv-threadpool-size'
  },
  {
    id: 'libuv-threadpool-uv-threadpool-size',
    title: 'Libuv Thread Pool & UV_THREADPOOL_SIZE',
    category: 'internals',
    difficulty: 'Advanced',
    summary: 'Node.js is single-threaded for JS execution, but Libuv maintains a background C thread pool (default 4 threads) to handle synchronous OS tasks: file system (fs), cryptography (crypto), compression (zlib), and DNS lookups.',
    mentalModel: 'The 4 Secret Agents: When the manager (Main Thread) receives heavy crypto hashing or disk file reading, it hands the mission to one of 4 background agents (Thread Pool), who report back when finished.',
    codeSnippet: `// Set thread pool size (Must be set BEFORE any async calls!):
process.env.UV_THREADPOOL_SIZE = '8';

import crypto from 'crypto';

const start = Date.now();
// 4 crypto hashes run concurrently on 4 default threads (~100ms):
for (let i = 0; i < 4; i++) {
  crypto.pbkdf2('pass', 'salt', 100000, 64, 'sha512', () => {
    console.log(\`Hash \${i + 1} finished in \${Date.now() - start}ms\`);
  });
}`,
    takeaways: [
      'Default thread pool size is 4; can be increased up to 1024 via UV_THREADPOOL_SIZE environment variable.',
      'Only 4 specific subsystems use the Thread Pool: fs, crypto (pbkdf2, randomBytes), zlib, and dns.lookup.',
      'Network I/O (HTTP, TCP, UDP, TLS) does NOT use the thread pool; it uses OS non-blocking epoll/kqueue sockets directly.'
    ],
    commonPitfall: {
      mistake: 'Setting process.env.UV_THREADPOOL_SIZE inside application code after importing fs/crypto, which is ignored by Libuv.',
      fix: 'Set UV_THREADPOOL_SIZE=8 in the shell command or Dockerfile before the Node process boots.'
    },
    nextTopicId: 'streams-backpressure'
  },
  {
    id: 'streams-backpressure',
    title: 'Streams & Backpressure with highWaterMark',
    category: 'streams',
    difficulty: 'Advanced',
    summary: 'Streams process data piece-by-piece in chunks without loading entire files into RAM. Backpressure occurs when a readable stream produces data faster than a writable stream can consume it.',
    mentalModel: 'The Funnel & Kitchen Sink: If you pour a gallon of water into a narrow funnel (fast reader, slow writer), water overflows unless you pause pouring until the funnel drains.',
    codeSnippet: `import fs from 'fs';

const readable = fs.createReadStream('./large_10gb_file.mp4', { highWaterMark: 64 * 1024 }); // 64KB chunks
const writable = fs.createWriteStream('./output.mp4', { highWaterMark: 16 * 1024 }); // 16KB buffer

// Handling Backpressure Manually:
readable.on('data', (chunk) => {
  const canContinue = writable.write(chunk);
  if (!canContinue) {
    readable.pause(); // High-water mark exceeded! Pause reading.
  }
});

writable.on('drain', () => {
  readable.resume(); // Buffer cleared. Resume reading!
});

// Idiomatic Solution: pipeline automatically manages backpressure:
import { pipeline } from 'stream/promises';
await pipeline(readable, writable);`,
    takeaways: [
      'highWaterMark defines the maximum internal buffer threshold (default: 64KB for fs, 16KB for object streams).',
      'writable.write(chunk) returns false when buffer is full, signaling backpressure.',
      'Always use stream.pipeline() or .pipe() instead of raw event listeners to handle errors and backpressure automatically.'
    ],
    commonPitfall: {
      mistake: 'Using fs.readFile() on massive 2GB files in API endpoints, blowing up heap memory and causing Out-Of-Memory (OOM) crashes.',
      fix: 'Use fs.createReadStream() and stream chunks directly to the HTTP response.'
    },
    nextTopicId: 'buffers-typed-arrays'
  },
  {
    id: 'buffers-typed-arrays',
    title: 'Buffers, Binary Memory & The 8KB Slab Allocator',
    category: 'internals',
    difficulty: 'Advanced',
    summary: 'Buffers represent raw binary memory allocated outside the V8 JavaScript heap (using C++ malloc). Node.js uses an 8KB Slab Allocator to pre-allocate contiguous chunks for small buffer slices.',
    mentalModel: 'The Warehouse Pallet: Instead of ordering a delivery truck for every small 100-byte box, the warehouse orders a giant 8KB wooden pallet (Slab) and carves out small parcels as needed.',
    codeSnippet: `// Allocates 10 bytes outside V8 heap (zero-filled for security):
const buf = Buffer.alloc(10);

// Buffer from string (UTF-8 binary encoding):
const textBuf = Buffer.from('Hello 🚀', 'utf-8');
console.log(textBuf); // <Buffer 48 65 6c 6c 6f 20 f0 9f 9a 80>
console.log(textBuf.length); // 10 bytes (Rocket emoji takes 4 bytes!)

// Fast uninitialized buffer (Must overwrite before reading!):
const rawBuf = Buffer.allocUnsafe(1024);`,
    takeaways: [
      'Buffers live in raw C++ memory, bypassing V8 garbage collection overhead for heavy binary I/O.',
      'Buffer.allocUnsafe() is faster because it skips zero-filling, but can expose sensitive residual RAM data if read before writing.',
      'Buffer.byteLength("🚀") is 4 bytes, whereas "🚀".length in JS string is 2 UTF-16 code units.'
    ],
    commonPitfall: {
      mistake: 'Using Buffer.allocUnsafe() and sending it over the network without populating all bytes, leaking memory secrets.',
      fix: 'Always default to Buffer.alloc() for secure zero-initialized memory.'
    },
    nextTopicId: 'eventemitter-memory-leaks'
  },
  {
    id: 'eventemitter-memory-leaks',
    title: 'EventEmitter Internals & MaxListenersExceeded Warnings',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'EventEmitter is the cornerstone of Node.js networking and streams. Registering listeners without cleanup leads to silent memory leaks when objects retain closure references.',
    mentalModel: 'The Megaphone & Crowd: If 50 people register to listen to the megaphone and never leave when the announcement ends, the room becomes dangerously crowded (memory leak).',
    codeSnippet: `import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Default warning limit is 10 listeners:
emitter.setMaxListeners(20);

function onUserLogin(user: { id: string }) {
  console.log('User logged in:', user.id);
}

// Subscribe:
emitter.on('login', onUserLogin);

// Always unsubscribe when teardown occurs to prevent leaks:
emitter.off('login', onUserLogin);

// Modern AbortSignal cleanup:
const controller = new AbortController();
emitter.on('data', () => {}, { signal: controller.signal });
controller.abort(); // Automatically removes listener!`,
    takeaways: [
      'MaxListenersExceededWarning indicates potential memory leak from unremoved event listeners.',
      'Use EventEmitter once() for single-use events to auto-remove the listener.',
      'Node.js v16+ supports AbortSignal in emitter.on(event, fn, { signal }) for declarative teardown.'
    ],
    commonPitfall: {
      mistake: 'Adding anonymous callback listeners inside request handlers without removing them: req.on("close", () => ...), leaking 1 closure per HTTP request.',
      fix: 'Use once("close") or extract to named functions and remove with emitter.off().'
    },
    nextTopicId: 'clustering-vs-worker-threads'
  },
  {
    id: 'clustering-vs-worker-threads',
    title: 'Clustering (Multi-Process) vs Worker Threads',
    category: 'concurrency',
    difficulty: 'Expert',
    summary: 'Clustering creates multiple isolated OS processes sharing the same server port (multi-core horizontal scaling). Worker Threads run multiple V8 instances sharing the same process memory (via SharedArrayBuffer).',
    mentalModel: 'Franchise Branches vs Kitchen Assistants: Clustering is opening 4 separate restaurant branches (independent processes, no shared memory); Worker Threads is hiring 4 sous-chefs in the same kitchen sharing the same pantry.',
    codeSnippet: `// 1. CLUSTERING (One process per CPU core):
import cluster from 'cluster';
import http from 'http';
import os from 'os';

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) cluster.fork(); // Spawn worker processes
} else {
  http.createServer((req, res) => res.end('Handled by worker ' + process.pid)).listen(3000);
}

// 2. WORKER THREADS (Shared memory CPU parallelization):
import { Worker, isMainThread, parentPort } from 'worker_threads';
if (isMainThread) {
  const worker = new Worker(new URL(import.meta.url));
  worker.on('message', (msg) => console.log('Result from worker:', msg));
} else {
  parentPort?.postMessage('Fibonacci calculated in parallel thread');
}`,
    takeaways: [
      'Cluster: Best for scaling I/O-bound web servers across multiple CPU cores without shared state.',
      'Worker Threads: Best for CPU-intensive tasks (image processing, encryption, machine learning) with fast SharedArrayBuffer data sharing.',
      'Processes in a cluster do not share memory; session state must be stored in Redis.'
    ],
    commonPitfall: {
      mistake: 'Storing in-memory global variables in a Clustered Node app, causing inconsistent state across different worker processes.',
      fix: 'Use Redis or a central database for shared session and cache state.'
    },
    nextTopicId: 'async-local-storage'
  },
  {
    id: 'async-local-storage',
    title: 'AsyncLocalStorage & Distributed Tracing Context',
    category: 'internals',
    difficulty: 'Advanced',
    summary: 'AsyncLocalStorage provides thread-local storage semantics across asynchronous execution chains, allowing correlation IDs and user contexts to propagate automatically without prop-drilling.',
    mentalModel: 'The VIP Wristband: Once a guest puts on a color-coded wristband at the door, every ride, restaurant, and booth inside the amusement park knows their VIP status without asking their name again.',
    codeSnippet: `import { AsyncLocalStorage } from 'async_hooks';

const traceStorage = new AsyncLocalStorage<{ requestId: string }>();

function log(msg: string) {
  const store = traceStorage.getStore();
  console.log(\`[\${store?.requestId || 'UNKNOWN'}] \${msg}\`);
}

async function handleRequest(reqId: string) {
  // Runs entire async chain within isolated context store:
  await traceStorage.run({ requestId: reqId }, async () => {
    log('Step 1: Authenticating user...');
    await new Promise(r => setTimeout(r, 50));
    log('Step 2: Querying database...');
  });
}`,
    takeaways: [
      'Propagates context (request ID, tenant ID, auth session) across async/await and callback boundaries.',
      'Powers modern APM loggers (Datadog, OpenTelemetry, Pino) and Next.js request headers.',
      'Minimal overhead: implemented with native V8 AsyncHooks bindings.'
    ],
    commonPitfall: {
      mistake: 'Mutating AsyncLocalStorage store state concurrently across parallel branches without scoping.',
      fix: 'Treat objects stored inside AsyncLocalStorage as immutable records.'
    },
    nextTopicId: 'garbage-collection-v8-scavenger'
  },
  {
    id: 'garbage-collection-v8-scavenger',
    title: 'V8 Garbage Collection: Scavenger Minor GC & Mark-Sweep Major GC',
    category: 'internals',
    difficulty: 'Expert',
    summary: 'V8 manages RAM via Generational Garbage Collection: Young Generation (Eden + Semi-Spaces From/To for fast Minor GC) and Old Generation (Mark-Sweep-Compact for long-lived objects).',
    mentalModel: 'The Recycling Bin vs The Attic: Short-lived objects (daily receipts) are dumped into the paper recycling bin (Minor GC) every minute. Things kept for over a month are moved upstairs to the Attic (Old Generation) and cleaned once a year (Major GC).',
    codeSnippet: `import v8 from 'v8';

// Inspect current heap memory:
const stats = v8.getHeapStatistics();
console.log('Heap Size Limit:', stats.heap_size_limit / 1024 / 1024, 'MB');
console.log('Used Heap:', stats.used_heap_size / 1024 / 1024, 'MB');

// Run with exposed GC (debugging only):
// node --expose-gc script.js
if (global.gc) {
  global.gc(); // Forces manual Major Mark-Sweep GC cycle
}`,
    takeaways: [
      'Minor GC (Scavenger): Operates on Young Generation (1-64MB) using Cheney algorithm in < 2ms.',
      'Objects surviving 2 Minor GC cycles are promoted to the Old Generation.',
      'Major GC (Mark-Sweep-Compact): Reclaims Old Gen objects; long Major GC cycles cause latency spikes in API responses.'
    ],
    commonPitfall: {
      mistake: 'Retaining references to large objects in global arrays, preventing Mark-Sweep GC from reclaiming Old Generation memory and causing OOM.',
      fix: 'Use WeakMap or WeakSet for caches where keys should be garbage-collected automatically.'
    },
    nextTopicId: 'esm-vs-cjs-interop'
  },
  {
    id: 'esm-vs-cjs-interop',
    title: 'ESM vs CommonJS Dual Package Hazard & Top-Level Await',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Node.js supports both CommonJS (require/module.exports - synchronous) and ECMAScript Modules (import/export - asynchronous with static analysis and Top-Level Await).',
    mentalModel: 'Direct Delivery vs Scheduled Flight: CommonJS require() is an instant courier handoff (synchronous, halts execution); ESM import is a booked flight evaluated and linked before takeoff.',
    codeSnippet: `// 1. ESM (package.json has "type": "module"):
import { readFile } from 'fs/promises';

// Top-Level Await (Native in ESM):
const data = await readFile('./config.json', 'utf-8');
console.log('Loaded config:', data);

// 2. Dynamic Import (Works in both CJS and ESM):
const module = await import('./heavy-plugin.js');`,
    takeaways: [
      'CommonJS cannot use Top-Level Await; ESM natively supports top-level await in modules.',
      'require() is synchronous; import is asynchronous and statically analyzable by bundlers (Rollup, Vite).',
      'Dual package hazard: Bundling both CJS and ESM versions of the same library can instantiate duplicate singleton state.'
    ],
    commonPitfall: {
      mistake: 'Trying to use require() inside an ES Module without createRequire, causing ReferenceError: require is not defined.',
      fix: 'Use import statement or createRequire(import.meta.url).'
    },
    nextTopicId: 'process-signals-graceful-shutdown'
  },
  {
    id: 'process-signals-graceful-shutdown',
    title: 'Process Signals & Zero-Downtime Graceful Shutdown',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Graceful shutdown intercepts OS termination signals (SIGINT, SIGTERM) to stop accepting new requests, close database pools, finish in-flight HTTP requests, and exit cleanly with code 0.',
    mentalModel: 'Closing a Restaurant at Night: The host locks the entrance door so no new diners enter, the kitchen finishes cooking orders currently on tables, and the staff turns off the gas stoves before leaving.',
    codeSnippet: `import http from 'http';

const server = http.createServer((req, res) => {
  res.end('Hello World');
}).listen(3000);

async function gracefulShutdown(signal: string) {
  console.log(\`Received \${signal}. Starting graceful shutdown...\`);
  
  // 1. Stop accepting new HTTP connections:
  server.close(async () => {
    console.log('HTTP server closed. Finishing DB pools...');
    // 2. Close Database connections
    // await db.pool.end();
    // 3. Exit with success code:
    process.exit(0);
  });

  // Force kill if graceful shutdown hangs for > 10s:
  setTimeout(() => {
    console.error('Shutdown timed out. Forcefully terminating.');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));`,
    takeaways: [
      'Kubernetes and Docker send SIGTERM first, wait terminationGracePeriodSeconds (default 30s), then send SIGKILL.',
      'server.close() allows active in-flight requests to complete while immediately rejecting new connections.',
      '.unref() on the fallback timeout timer ensures the timer itself does not keep the event loop alive.'
    ],
    commonPitfall: {
      mistake: 'Calling process.exit(0) immediately inside the SIGTERM listener, abruptly severing active client connections mid-transaction.',
      fix: 'Call server.close() first and wait for existing connections and database pools to drain.'
    }
  }
];
