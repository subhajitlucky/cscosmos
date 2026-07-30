/* eslint-disable */
const memoryModel = {
    definition: "The **Memory Model** defines how JS manages data in the **Stack** and **Heap**, and how the **Garbage Collector (GC)** reclaims unused memory. Mastering this is key to avoiding memory leaks and writing high-performance apps.",

    syntax: `// 1. Mark-and-Sweep (GC Strategy)
// If an object is not "reachable" from root, it is deleted.

// 2. Weak References
const ref = new WeakRef(myObj);
const realObj = ref.deref(); // null if GC'd

// 3. FinalizationRegistry
const registry = new FinalizationRegistry(held => {
  console.log("Cleaned up!", held);
});
registry.register(myObj, "metadata");
`,

    examples: [
        {
            code: `// 1. Simple Memory Leak
function leak() {
  const bigData = new Array(1000000).fill(\"X\");
  
  return function() {
    // Closure keeps bigData alive forever!
    console.log(bigData.length);
  };
}

const leakyFunc = leak();`,
            explanation: "Closures are the most common cause of memory leaks. Even if you don't use `bigData`, the inner function keeps a reference to it in the Heap."
        },
        {
            code: `// 2. Disconnected DOM Leak
let element = document.getElementById('button');

function cleanup() {
  document.body.removeChild(element);
  // 'element' variable still points to the DOM node!
  // GC cannot reclaim it until element = null;
}`,
            explanation: "Removing a node from the DOM isn't enough. If a JS variable still points to it, the engine keeps the entire DOM subtree in the Heap."
        },
        {
            code: `// 3. Generational GC (Orinoco)
// Modern engines use "Generations"
// - Young Generation (new objects, fast GC)
// - Old Generation (survivors, heavy GC)`,
            explanation: "V8 uses a Generational Garbage Collector. Most objects die young. If an object survives two GC cycles, it's moved to the 'Old Space' which is scanned less frequently."
        }
    ],

    useCases: [
        "**Performance Tuning**: Reducing the frequency of 'Stop-the-world' GC pauses.",
        "**Memory Management**: Using `WeakRef` for large caches that can be deleted under memory pressure.",
        "**Resource Cleanup**: Using `FinalizationRegistry` to close file handles or socket connections.",
        "**App Stability**: Identifying and fixing leaks in long-running Single Page Apps (SPAs)."
    ],

    memoryModel: `### **The Garbage Collector**

**1. Reachability:**
- The GC starts from "Roots" (Global object, current stack variables).
- It "walks" the graph of pointers in **RAM**. Any object not reached is marked for deletion.

**2. Scavenger (Young Gen):**
- Uses a "Copying" algorithm. It splits memory into two semi-spaces and copies live objects to the new space while wiping the old one. This is extremely fast.

**3. Major GC (Full Mark-Compact):**
- Scans the entire **Heap**. 
- It moves objects together to eliminate "fragmentation" (holes in memory), ensuring contiguous space for the **CPU** to access.`,

    visualizationType: 'datatypes'
};

export default memoryModel;

