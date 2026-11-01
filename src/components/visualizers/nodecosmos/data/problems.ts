export interface NodeProblem {
  id: number;
  category: 'Event Loop' | 'Streams & Buffers' | 'Threading & Concurrency' | 'V8 Memory & GC' | 'Production Systems';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  title: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const NODE_PROBLEM_CATEGORIES: { id: string; name: string }[] = [
  { id: 'all', name: 'All Categories' },
  { id: 'Event Loop', name: 'Event Loop & Microtasks' },
  { id: 'Streams & Buffers', name: 'Streams & Buffers' },
  { id: 'Threading & Concurrency', name: 'Threading & Concurrency' },
  { id: 'V8 Memory & GC', name: 'V8 Memory & Garbage Collection' },
  { id: 'Production Systems', name: 'Production Systems & Diagnostics' },
];

export const NODE_PROBLEMS: NodeProblem[] = [
  {
    id: 1,
    category: 'Event Loop',
    difficulty: 'Beginner',
    title: 'Microtask Queue Priority',
    question: 'What is the exact execution priority between process.nextTick, Promise.then, and setTimeout(..., 0)?',
    code: `process.nextTick(() => console.log('A'));
Promise.resolve().then(() => console.log('B'));
setTimeout(() => console.log('C'), 0);
console.log('D');`,
    options: [
      'D -> A -> B -> C',
      'D -> B -> A -> C',
      'A -> B -> C -> D',
      'D -> C -> A -> B',
    ],
    correctIndex: 0,
    explanation:
      'Synchronous code on the Call Stack runs first (D). Next, process.nextTick is a VIP microtask that runs before Promise microtasks (A, then B). Finally, the Libuv event loop advances to the Timers phase on the next tick to execute setTimeout (C).',
  },
  {
    id: 2,
    category: 'Event Loop',
    difficulty: 'Intermediate',
    title: 'Inside an I/O Callback Lifecycle',
    question: 'Inside an fs.readFile() asynchronous callback, which scheduled timer is guaranteed to execute first?',
    code: `import fs from 'fs';

fs.readFile('file.txt', () => {
  setTimeout(() => console.log('Timer'), 0);
  setImmediate(() => console.log('Immediate'));
});`,
    options: [
      'setImmediate always executes before setTimeout inside I/O callbacks.',
      'setTimeout always executes before setImmediate.',
      'The order is non-deterministic and depends on CPU temperature.',
      'Both execute in parallel on separate worker threads.',
    ],
    correctIndex: 0,
    explanation:
      'I/O callbacks execute during the Poll phase of Libuv. Once the Poll phase completes, Libuv immediately advances to the Check phase where setImmediate callbacks are processed, before wrapping around to the Timers phase on the next loop cycle.',
  },
  {
    id: 3,
    category: 'Event Loop',
    difficulty: 'Advanced',
    title: 'Event Loop Starvation Hazard',
    question: 'Why does recursive process.nextTick starve the Libuv event loop, whereas recursive setImmediate does not?',
    code: `// Snippet 1:
function loopA() { process.nextTick(loopA); }
// Snippet 2:
function loopB() { setImmediate(loopB); }`,
    options: [
      'process.nextTick drains completely before Libuv advances to any phase; new nextTicks queued during drain run in the same phase. setImmediate runs once per Check phase per tick.',
      'setImmediate runs on a C++ worker thread, while process.nextTick runs on the V8 main stack.',
      'Node.js automatically limits setImmediate to 1,000 iterations before throwing an error.',
      'process.nextTick allocates heap memory that triggers synchronous garbage collection freezes.',
    ],
    correctIndex: 0,
    explanation:
      'The nextTick queue is processed continuously until empty before Libuv can transition to the next phase. If nextTick recursively schedules itself, the event loop can never advance to Poll or Timers, starving all I/O. setImmediate queues only execute on the Check phase of each distinct tick.',
  },
  {
    id: 4,
    category: 'Threading & Concurrency',
    difficulty: 'Intermediate',
    title: 'Network I/O vs Libuv Thread Pool',
    question: 'Does incoming HTTP and TCP socket networking in Node.js utilize the Libuv Thread Pool?',
    options: [
      'No. Network sockets use non-blocking OS kernel multiplexing (epoll on Linux, kqueue on macOS, IOCP on Windows) directly on the main event loop.',
      'Yes. Every incoming HTTP connection spawns a thread from UV_THREADPOOL_SIZE.',
      'Yes. Only HTTPS requests use the thread pool because TLS decryption requires OpenSSL workers.',
      'No. Network sockets bypass Libuv entirely and communicate directly with V8 isolates.',
    ],
    correctIndex: 0,
    explanation:
      'Network sockets are handled non-blockingly by the operating system kernel via epoll/kqueue. Libuv polls these file descriptors on the main thread without worker threads. The Libuv Thread Pool is ONLY used for blocking filesystem (fs), cryptography (pbkdf2), zlib, and dns.lookup.',
  },
  {
    id: 5,
    category: 'Threading & Concurrency',
    difficulty: 'Advanced',
    title: 'Thread Pool Exhaustion (UV_THREADPOOL_SIZE)',
    question: 'By default, how many concurrent crypto.pbkdf2() or fs.readFile() calls can execute in parallel before queueing occurs?',
    options: [
      '4 (default UV_THREADPOOL_SIZE = 4)',
      '1 (single-threaded Node runtime limit)',
      'Equal to the number of CPU cores detected by os.cpus().length',
      'Unlimited (thread allocation is unbounded)',
    ],
    correctIndex: 0,
    explanation:
      'Node.js defaults UV_THREADPOOL_SIZE to 4 threads. If 4 heavy crypto or fs operations run simultaneously, any subsequent thread pool task (such as dns.lookup or another file read) will block in the Libuv work queue until a thread becomes idle.',
  },
  {
    id: 6,
    category: 'Streams & Buffers',
    difficulty: 'Intermediate',
    title: 'Backpressure Detection Mechanism',
    question: 'How does a Node.js Writable stream signal backpressure to a fast Readable stream?',
    code: `const canContinue = writable.write(chunk);
if (!canContinue) {
  // What event must the readable wait for?
}`,
    options: [
      'writable.write() returns false when internal buffer reaches highWaterMark; readable must pause until writable emits "drain".',
      'writable.write() throws a BufferOverflowException that readable must catch.',
      'writable emits "pause" and readable automatically enters sleep state.',
      'writable blocks the synchronous V8 call stack until disk write acknowledges.',
    ],
    correctIndex: 0,
    explanation:
      'When writable.write(chunk) exceeds the highWaterMark (default 16KB for binary streams), it returns false to signal buffer saturation. The producer must pause and resume only when the consumer flushes its buffer and emits the "drain" event.',
  },
  {
    id: 7,
    category: 'Streams & Buffers',
    difficulty: 'Advanced',
    title: 'stream.pipeline vs raw .pipe()',
    question: 'Why is stream.pipeline() strongly preferred over readable.pipe(writable) in production applications?',
    options: [
      'pipeline() handles automatic error forwarding, stream destruction, and cleanup if any stream fails or client disconnects early.',
      'pipeline() converts JavaScript streams into native C++ SIMD streams that run 10x faster.',
      'readable.pipe() does not support backpressure flow control.',
      'readable.pipe() was deprecated and removed in Node.js v20 LTS.',
    ],
    correctIndex: 0,
    explanation:
      'With raw readable.pipe(writable), an error on the destination stream does NOT close or destroy the source stream, causing memory leaks and dangling file descriptors. stream.pipeline() (and stream/promises pipeline) guarantees all streams are cleanly destroyed on error or completion.',
  },
  {
    id: 8,
    category: 'Streams & Buffers',
    difficulty: 'Expert',
    title: 'Buffer 8KB Slab Allocator',
    question: 'How does Node.js allocate memory for small buffers created via Buffer.from() or Buffer.allocUnsafe() under 4KB?',
    options: [
      'Node.js pre-allocates an 8KB memory slab outside the V8 heap and carves out contiguous sub-slices for small allocations.',
      'Every buffer under 4KB is converted into a V8 JavaScript String primitive.',
      'Node.js makes a separate mmap() syscall to the OS kernel for each buffer.',
      'Small buffers are stored on the V8 Execution Call Stack.',
    ],
    correctIndex: 0,
    explanation:
      'To prevent C++ malloc fragmentation overhead, Node.js pre-allocates an 8KB Slab pool (Buffer.poolSize = 8192). Allocations smaller than poolSize / 2 (4KB) are assigned slices from this single shared slab outside the V8 garbage collector.',
  },
  {
    id: 9,
    category: 'V8 Memory & GC',
    difficulty: 'Advanced',
    title: 'V8 Generational Hypothesis & Cheney Semi-Spaces',
    question: 'In the V8 engine, which garbage collector cleans short-lived objects in the Young Generation?',
    options: [
      'Minor GC (Scavenger) using Cheney semi-spaces (From-Space and To-Space copy).',
      'Major GC (Mark-Sweep-Compact) over the entire 1.4GB heap.',
      'Reference Counting with circular reference detection.',
      'OS page fault deallocation.',
    ],
    correctIndex: 0,
    explanation:
      'The Generational Hypothesis states that most objects die young. V8 assigns newly created objects to Eden space within the Young Generation. The Minor GC (Scavenger) rapidly copies surviving objects between Cheney semi-spaces, promoting objects to the Old Generation only after surviving 2 GC cycles.',
  },
  {
    id: 10,
    category: 'V8 Memory & GC',
    difficulty: 'Intermediate',
    title: 'EventEmitter Memory Leak Warning',
    question: 'What does MaxListenersExceededWarning signify when registering event handlers on an EventEmitter?',
    code: `emitter.on('data', () => { /* captured closure */ });
// MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 data listeners added.`,
    options: [
      'More than default maxListeners (10) were registered, typically caused by re-adding closures inside per-request handlers without emitter.off().',
      'The maximum buffer memory of 10KB has been completely filled.',
      'The operating system TCP socket backlog queue is full.',
      'Node.js has exhausted its available file descriptor handles.',
    ],
    correctIndex: 0,
    explanation:
      'The warning alerts developers that more than 10 listeners are attached to a single event. This frequently occurs when an endpoint registers listener callbacks inside an HTTP request handler that capture the request context and are never unsubscribed, leaking memory indefinitely.',
  },
  {
    id: 11,
    category: 'Threading & Concurrency',
    difficulty: 'Advanced',
    title: 'Cluster Module vs Worker Threads',
    question: 'When should an architect select Worker Threads over the Node.js Cluster module?',
    options: [
      'For CPU-intensive tasks (e.g. image transformations, machine learning inference) requiring shared memory via SharedArrayBuffer.',
      'For horizontal scaling of HTTP web server throughput across multiple CPU cores.',
      'When independent OS process isolation and zero memory sharing are required.',
      'When serving static HTML files through an Express/Fastify server.',
    ],
    correctIndex: 0,
    explanation:
      'The Cluster module forks isolated OS processes sharing the server port via IPC round-robin (ideal for I/O-bound web traffic). Worker Threads run multiple V8 isolates in the same process sharing RAM, making them ideal for heavy CPU calculations where serializing data between processes would be prohibitively slow.',
  },
  {
    id: 12,
    category: 'Production Systems',
    difficulty: 'Advanced',
    title: 'DNS Resolution: dns.lookup vs dns.resolve',
    question: 'Why can high-volume HTTP requests using axios or fetch stall under load when relying on dns.lookup()?',
    options: [
      'dns.lookup() uses getaddrinfo() synchronously on the 4 Libuv worker threads, exhausting the thread pool. dns.resolve() uses non-blocking asynchronous c-ares sockets.',
      'dns.lookup() performs an unencrypted DNS-over-HTTPS handshake.',
      'dns.lookup() caches responses indefinitely in V8 old memory.',
      'dns.resolve() runs on the client browser instead of the Node server.',
    ],
    correctIndex: 0,
    explanation:
      'dns.lookup() calls the OS synchronous getaddrinfo() function on the Libuv thread pool. Under hundreds of concurrent outbound HTTP requests to domain names, all 4 threads are occupied by DNS resolution, blocking disk I/O and crypto. dns.resolve() queries DNS servers asynchronously via c-ares without using threads.',
  },
  {
    id: 13,
    category: 'Production Systems',
    difficulty: 'Expert',
    title: 'AsyncLocalStorage Context Preservation',
    question: 'How does AsyncLocalStorage track request IDs or authentication contexts across asynchronous callback boundaries?',
    options: [
      'It leverages V8 native async_hooks to propagate execution context references across promise chains and I/O ticks.',
      'It attaches hidden global variables to the Node.js process object.',
      'It overrides the JavaScript prototype chain for all functions.',
      'It runs every HTTP request in an isolated Worker Thread.',
    ],
    correctIndex: 0,
    explanation:
      'AsyncLocalStorage uses the Node.js internal async_hooks API. When an asynchronous handle (Promise, timer, I/O socket) is created, V8 captures the current execution context ID and automatically restores the associated store when the callback is invoked.',
  },
  {
    id: 14,
    category: 'Production Systems',
    difficulty: 'Intermediate',
    title: 'Graceful Zero-Downtime Teardown Sequence',
    question: 'What is the correct sequence of operations when a Node.js process receives a SIGTERM signal in Kubernetes?',
    options: [
      '1. Stop accepting new sockets (server.close()). 2. Await in-flight requests. 3. Close database connection pools. 4. Exit with code 0.',
      '1. Call process.exit(0) immediately to free CPU resources.',
      '2. Kill all worker threads with SIGKILL and drop active TCP connections.',
      '1. Re-bind the TCP server port to a backup port.',
    ],
    correctIndex: 0,
    explanation:
      'On SIGTERM, the server must stop accepting new inbound connections via server.close(), allow existing in-flight HTTP requests a drain grace period (e.g. 10-30s), flush write buffers and disconnect database pools, and then exit cleanly with exit code 0.',
  },
  {
    id: 15,
    category: 'Event Loop',
    difficulty: 'Advanced',
    title: 'setImmediate vs setTimeout(..., 0) in Global Scope',
    question: 'When executed in top-level script scope (outside any I/O cycle), what is the order between setTimeout(..., 0) and setImmediate()?',
    code: `setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));`,
    options: [
      'Non-deterministic: depends on process startup time whether the 1ms timer threshold expired before the loop entered the Timers phase.',
      'setTimeout is guaranteed to execute first by the ECMAScript 2024 specification.',
      'setImmediate is guaranteed to execute first in all Node.js versions.',
      'They will always execute in alphabetical order.',
    ],
    correctIndex: 0,
    explanation:
      'In global scope, the order depends on CPU speed and startup latency. OS timers have a minimum ~1ms threshold. If V8 initialization takes >1ms, the timer is expired upon entering the Timers phase. If <1ms, the loop skips Timers and reaches setImmediate in the Check phase first.',
  },
];
