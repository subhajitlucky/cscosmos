export interface NodeCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const NODE_CHEATSHEET: NodeCheatSheetSection[] = [
  {
    id: 'event-loop',
    title: 'Event Loop & Scheduling Primitives',
    category: 'Async & Timers',
    snippets: [
      {
        title: 'setImmediate vs setTimeout(0)',
        description: 'Scheduling execution order in poll vs check phases',
        code: `// Inside I/O callback, setImmediate ALWAYS runs before setTimeout:
fs.readFile('file.txt', () => {
  setImmediate(() => console.log('Immediate (Check Phase)'));
  setTimeout(() => console.log('Timeout (Timers Phase)'), 0);
});`,
        tip: 'setImmediate executes immediately after the Poll phase, without waiting for the 1ms timer clock.'
      },
      {
        title: 'Microtask Flush with queueMicrotask',
        description: 'Standard Web API for scheduling Promise microtasks',
        code: `queueMicrotask(() => {
  console.log('Runs before any Timers or I/O callbacks');
});`,
        tip: 'Standardized replacement for Promise.resolve().then(fn).'
      }
    ]
  },
  {
    id: 'streams',
    title: 'Streams & Pipeline Utilities',
    category: 'I/O & Memory',
    snippets: [
      {
        title: 'Robust Stream Pipeline with pipeline()',
        description: 'Automatic backpressure handling and error cleanup',
        code: `import { pipeline } from 'stream/promises';
import fs from 'fs';
import zlib from 'zlib';

await pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('input.txt.gz')
);`,
        tip: 'pipeline() automatically destroys all streams if any stream in the chain emits an error.'
      },
      {
        title: 'Safe Buffer Allocation',
        description: 'Zero-filled memory allocation',
        code: `// Always use Buffer.alloc for security:
const safeBuffer = Buffer.alloc(1024); // Zero-filled

// NEVER send allocUnsafe without full overwrite:
const fastBuffer = Buffer.allocUnsafe(1024);`,
        tip: 'allocUnsafe can leak previous RAM secrets if sent directly to network sockets.'
      }
    ]
  },
  {
    id: 'production',
    title: 'Production Hardening & Graceful Shutdown',
    category: 'Operations',
    snippets: [
      {
        title: 'Graceful Shutdown Handler',
        description: 'Drain HTTP connections before exit',
        code: `process.on('SIGTERM', () => {
  server.close(() => {
    // Disconnect DB pools
    process.exit(0);
  });
  // Fallback kill after 10s:
  setTimeout(() => process.exit(1), 10000).unref();
});`,
        tip: '.unref() prevents the fallback timer from keeping the process alive.'
      }
    ]
  }
];
