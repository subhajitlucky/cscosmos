const sharedMemory = {
    definition: "**Shared Memory** allows multiple threads (Web Workers) to read and write the same data simultaneously. **Atomics** provide a way to perform operations on that memory in a thread-safe, non-interrupted way, preventing race conditions.",

    syntax: `// 1. SharedArrayBuffer
const buffer = new SharedArrayBuffer(1024);

// 2. Atomics (Thread-safe math)
Atomics.add(typedArray, index, value);
Atomics.wait(int32, index, value); // Pause thread
Atomics.notify(int32, index);      // Wake thread
`,

    examples: [
        {
            code: `// 1. Creating Shared Memory
const sab = new SharedArrayBuffer(4); // 4 bytes
const view = new Int32Array(sab);

// Pass sab to a Worker...
// worker.postMessage(sab);`,
            explanation: "Unlike regular `ArrayBuffer` which is copied or transferred, a `SharedArrayBuffer` allows both the main thread and the worker to access the same physical bytes in RAM."
        },
        {
            code: `// 2. The Race Condition Problem
// Thread A: val = val + 1
// Thread B: val = val + 1

// Without Atomics, they might both read 0 at 
// the same time and write 1, losing an increment!`,
            explanation: "Race conditions happen when two threads try to modify memory at once. The result depends on which thread's CPU cycle finishes first."
        },
        {
            code: `// 3. Solving with Atomics
const sab = new SharedArrayBuffer(4);
const view = new Int32Array(sab);

// Thread-safe increment
Atomics.add(view, 0, 1);`,
            explanation: "`Atomics.add` ensures that the Read-Modify-Write cycle happens as a single atomic operation that cannot be interrupted by another thread."
        }
    ],

    useCases: [
        "**Multi-threaded Algorithms**: Image processing, physics engines, or heavy math in Workers.",
        "**Game Engines**: Managing world state across multiple CPU cores.",
        "**Data Synchronization**: Communicating between threads without the overhead of copying data.",
        "**Performance**: Real-time streaming or data buffering."
    ],

    memoryModel: `### **Hardware & Threads**

**1. CPU Memory Barriers:**
- Atomics use hardware-level **Memory Barriers** to ensure that all CPU cores see the same value in their local caches.

**2. Physical RAM:**
- The \`SharedArrayBuffer\` maps to a single physical location in **RAM**.
- All threads have a pointer to this identical address in the **Heap**.

**3. Safety (Spector/Meltdown):**
- Shared memory was temporarily disabled in browsers due to hardware security vulnerabilities. 
- Modern browsers require **Cross-Origin Isolation** (COOP/COEP headers) to use \`SharedArrayBuffer\` safely.`,

    visualizationType: 'arrays'
};

export default sharedMemory;

