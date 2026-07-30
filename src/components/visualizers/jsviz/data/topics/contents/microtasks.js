/* eslint-disable */
const microtasks = {
    definition: "**Microtasks** are high-priority tasks that run immediately after the current script finishes and before the Event Loop moves to the next Macrotask (like \`setTimeout\`). They are primarily used by Promises.",

    syntax: `// 1. Creating a Microtask
Promise.resolve().then(() => {
  console.log("Microtask");
});

// 2. The explicit way
queueMicrotask(() => {
  console.log("Explicit Microtask");
});

// 3. Comparison
setTimeout(() => console.log("Macrotask"), 0);
`,

    examples: [
        {
            code: `// 1. Priority Order
console.log("1. Stack");

setTimeout(() => console.log("2. Macrotask"), 0);

Promise.resolve().then(() => {
  console.log("3. Microtask");
});

console.log("4. Stack");

// Output: 1, 4, 3, 2`,
            explanation: "Stack code runs first. Then, the engine clears the *entire* Microtask queue. Only after that does it pick up the first Macrotask from the Task Queue."
        },
        {
            code: `// 2. Microtask Starvation (Danger!)
function starve() {
  Promise.resolve().then(starve);
}
// starve(); // ❌ Don't run this!`,
            explanation: "Because the Event Loop won't move to the next macrotask (or render the UI) until the Microtask queue is empty, an infinite loop of microtasks will completely freeze your browser tab."
        },
        {
            code: `// 3. queueMicrotask vs .then
// This is useful for running logic after state changes
// but before the browser paints the screen.
queueMicrotask(() => {
  console.log("Cleanup before paint");
});`,
            explanation: "`queueMicrotask` is a standard way to schedule work to happen at the very end of the current task."
        }
    ],

    useCases: [
        "**Promise Chaining**: Ensuring `.then()` callbacks run predictably.",
        "**State Synchronization**: Finalizing internal data before the UI renders.",
        "**Batching**: Collecting multiple small updates into one big operation.",
        "**Cleanup**: Closing temporary resources as soon as the main logic finishes."
    ],

    memoryModel: `### **Queue Internals**

**1. Microtask Queue:**
- A dedicated queue in the engine's memory.
- It is processed **completely** at the end of every task.

**2. Task Queue (Macrotasks):**
- Handled by the **Event Loop**.
- Only **one** macrotask is processed per loop iteration.

**3. Rendering:**
- The browser tries to re-render the screen after the Microtask queue is empty and before the next Macrotask. 
- **Performance:** Heavy microtasks can delay the "Frame Paint," leading to a stuttery UI.`,

    visualizationType: 'eventloop'
};

export default microtasks;

