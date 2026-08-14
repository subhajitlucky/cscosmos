export interface NodeFlashcard {
  id: string;
  category: 'Event Loop & Async' | 'Streams & Buffers' | 'Threading & Concurrency' | 'Internals & Production';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const NODE_FLASHCARDS: NodeFlashcard[] = [
  {
    id: 'nf-1',
    category: 'Event Loop & Async',
    difficulty: 'Junior',
    question: 'What is the exact execution order between process.nextTick, Promise.then, setTimeout, and setImmediate?',
    answer: '1. Synchronous code on Call Stack. 2. process.nextTick queue (VIP Microtask). 3. Promise microtask queue. 4. Libuv Timers phase (setTimeout). 5. Libuv Check phase (setImmediate). Microtasks drain completely between every phase.',
    code: `process.nextTick(() => console.log('1. nextTick'));
Promise.resolve().then(() => console.log('2. Promise'));
setImmediate(() => console.log('3. setImmediate'));
setTimeout(() => console.log('4. setTimeout'), 0);`,
    tip: 'Inside an I/O callback (e.g. fs.readFile), setImmediate is guaranteed to run before setTimeout(..., 0).'
  },
  {
    id: 'nf-2',
    category: 'Threading & Concurrency',
    difficulty: 'Mid',
    question: 'Does Node.js network I/O (HTTP/TCP) use the Libuv Thread Pool?',
    answer: 'NO. Network I/O uses non-blocking OS kernel polling mechanisms (epoll on Linux, kqueue on macOS, IOCP on Windows) directly on the main event loop. The thread pool is ONLY used for file system (fs), cryptography (pbkdf2, randomBytes), zlib compression, and dns.lookup.',
    code: `# Increase thread pool for heavy disk/crypto:
UV_THREADPOOL_SIZE=8 node server.js`,
    tip: 'dns.resolve() uses non-blocking c-ares sockets, while dns.lookup() uses getaddrinfo on the thread pool.'
  },
  {
    id: 'nf-3',
    category: 'Streams & Buffers',
    difficulty: 'Senior',
    question: 'What is Backpressure in Node.js Streams and how do you handle it?',
    answer: 'Backpressure occurs when data is read faster than the consumer can write. When writable.write(chunk) returns false (internal buffer reached highWaterMark), the readable stream must be paused until the writable emits the "drain" event.',
    code: `import { pipeline } from 'stream/promises';
// pipeline automatically handles backpressure and error teardown:
await pipeline(readStream, transformStream, writeStream);`,
    tip: 'Never use raw .on("data") for high-throughput streaming; always use stream.pipeline() to prevent OOM buffer overflows.'
  },
  {
    id: 'nf-4',
    category: 'Threading & Concurrency',
    difficulty: 'Senior',
    question: 'When should you use the Cluster module vs Worker Threads?',
    answer: 'Cluster creates multiple isolated OS processes sharing the same TCP port via IPC round-robin (best for horizontal scaling of I/O web servers). Worker Threads create multiple V8 instances within the same process sharing RAM (best for CPU-intensive tasks like image processing or cryptography).',
    code: `// Cluster: Multi-process (1 per core, isolated RAM)
// Worker Threads: Multi-threaded (shared RAM via SharedArrayBuffer)`,
    tip: 'Since Cluster processes do not share memory, session state and caches must be centralized in Redis.'
  },
  {
    id: 'nf-5',
    category: 'Internals & Production',
    difficulty: 'Staff',
    question: 'What is AsyncLocalStorage and how does it prevent context loss in async chains?',
    answer: 'AsyncLocalStorage is built into Node.js (via V8 async_hooks) to provide thread-local storage across asynchronous continuations. It attaches context (like requestId, tenantId, auth tokens) to the async execution graph, propagating it across Promise resolutions and setTimeout timers without prop-drilling.',
    code: `const als = new AsyncLocalStorage();
als.run({ traceId: '123' }, async () => {
  await db.query();
  console.log(als.getStore().traceId); // '123'
});`,
    tip: 'Used under the hood by Next.js request headers and APM tracers (OpenTelemetry, Datadog).'
  }
];
