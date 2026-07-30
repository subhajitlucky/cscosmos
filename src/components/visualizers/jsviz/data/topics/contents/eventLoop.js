const eventLoop = {
    definition: "The **Event Loop** is the secret sauce that allows JavaScript to be non-blocking and 'concurrency-like' while remaining single-threaded. it coordinates the Call Stack, Web APIs, and Task Queues.",

    syntax: `// 1. Synchronous (Block Stack)
console.log("Start");

// 2. Asynchronous (Move to Web API -> Task Queue)
setTimeout(() => {
  console.log("Async Task");
}, 0);

// 3. Synchronous
console.log("End");

// Output: Start, End, Async Task
`,

    examples: [
        {
            code: `// 1. The Single Thread Trap
console.log("A");

setTimeout(() => console.log("B"), 0);

// Long loop blocks the stack!
for (let i = 0; i < 1000000000; i++) {} 

console.log("C");

// Output: A, C, (Wait for loop), B`,
            explanation: "Even with a 0ms delay, `setTimeout` cannot run until the Call Stack is empty. The long loop blocks the stack, preventing the Event Loop from processing the task queue."
        },
        {
            code: `// 2. DOM Events & Loop
// Click listeners are tasks
button.addEventListener('click', () => {
  console.log("Clicked!");
});

// The loop waits for the user to trigger the task.`,
            explanation: "The browser's 'Web APIs' handle the event listening. When the click happens, they push the callback onto the Task Queue for the Event Loop to pick up."
        }
    ],

    useCases: [
        "**Non-blocking I/O**: Fetching data without freezing the UI.",
        "**User Interaction**: Handling clicks, scrolls, and typing smoothly.",
        "**Animations**: Using `requestAnimationFrame` to sync with the screen refresh.",
        "**Background Processing**: Splitting heavy work using `setTimeout` to avoid blocking the main thread."
    ],

    memoryModel: `### **The Architecture**

**1. Call Stack (The Brain):**
- Where your code is executed line-by-line. 
- Lives in fast **RAM**.

**2. Web APIs (The Workers):**
- Provided by the browser (not JS itself). 
- Handle timers, network requests, and DOM events in separate threads.

**3. Task Queue (The Waiting Room):**
- Where callbacks wait after the Web API finishes.
- The **Event Loop** constantly checks: "Is the Stack empty? If yes, push the first task from the queue to the stack."

**4. CPU Impact:**
- A blocked Event Loop causes 100% **CPU usage** on a single core, making the entire browser tab unresponsive (the "spinning wheel of death").`,

    visualizationType: 'eventloop'
};

export default eventLoop;
