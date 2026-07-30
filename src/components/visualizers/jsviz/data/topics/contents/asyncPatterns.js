const asyncPatterns = {
    definition: "Beyond basic Promises and Async/Await, **Advanced Async Control Flow** involves patterns like debouncing, throttling, retries, and cancellation to manage complex timing and resource constraints.",

    syntax: `// 1. Debounce (Delay execution)
const save = debounce(() => sendData(), 500);

// 2. Throttle (Limit frequency)
const scroll = throttle(() => updateUI(), 100);

// 3. Cancellation (AbortSignal)
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();
`,

    examples: [
        {
            code: `// 1. Implementation of Debounce
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// Result: Only runs after 500ms of "silence"`,
            explanation: "Debouncing is essential for search bars or resizing listeners where you only want to act after the user has stopped typing or dragging."
        },
        {
            code: `// 2. The Retry Pattern
async function fetchWithRetry(url, count = 3) {
  for (let i = 0; i < count; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === count - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
    }
  }
}`,
            explanation: "In distributed systems, networking is unreliable. Retrying with exponential backoff reduces load on the server while increasing success rates."
        },
        {
            code: `// 3. Parallel Limit
// Managing thousands of requests without 
// crashing the CPU or Browser.
async function batchProcess(urls, limit = 5) {
  // Use a Worker or a custom queue to limit 
  // active promises to 'limit' at a time.
}`,
            explanation: "Sometimes running too many things in parallel is bad. Limiting concurrency ensures that the browser doesn't run out of memory or network sockets."
        }
    ],

    useCases: [
        "**Input Search**: Preventing an API call for every keystroke (Debounce).",
        "**Scroll Tracking**: Reducing UI updates during fast scrolling (Throttle).",
        "**Reliable APIs**: Handling temporary network drops (Retry).",
        "**User Cancellation**: Stopping a file upload or large fetch when the user navigates away (AbortController)."
    ],

    memoryModel: `### **Async Resource Management**

**1. Timer Management:**
- \`setTimeout\` creates entries in the engine's **Timer Table**. 
- Debouncing heavy tasks prevents "Timer Overflow" and saves **CPU cycles**.

**2. Garbage Collection (Aborted Requests):**
- When you use \`AbortController\`, the engine can reclaim the **Memory** used by the network buffer much earlier than waiting for a timeout.

**3. Closure Persistance:**
- Async wrappers (like debounce) use **Closures** to store the \`timer\` ID. 
- This keeps the variable in the **Heap** across many events, allowing the function to "remember" the previous state.`,

    visualizationType: 'eventloop'
};

export default asyncPatterns;

