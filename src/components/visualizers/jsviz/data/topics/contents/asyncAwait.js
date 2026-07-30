const asyncAwait = {
    definition: "**Async/Await** is a special syntax (built on top of Promises) that makes asynchronous code look and behave like synchronous code. It significantly improves the readability of complex async flows.",

    syntax: `// 1. Async Function
async function getData() {
  const result = await somePromise;
  return result;
}

// 2. Arrow function version
const fetchData = async () => { ... };
`,

    examples: [
        {
            code: `// 1. From Promises to Async/Await
async function getUserData(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    console.log(posts);
  } catch (err) {
    console.log("Error caught:", err);
  }
}

getUserData(1);`,
            explanation: "The `await` keyword pauses the execution of the async function until the promise is settled. This allows you to write async code that reads top-to-bottom."
        },
        {
            code: `// 2. Parallel execution
async function fastFetch() {
  // Start both at once
  const promise1 = fetch('/api1');
  const promise2 = fetch('/api2');

  // Wait for both
  const [res1, res2] = await Promise.all([promise1, promise2]);
}`,
            explanation: "Don't `await` every line if the tasks are independent! Start the promises first, then `await` them together using `Promise.all`."
        },
        {
            code: `// 3. Loops with Async
async function processArray(arr) {
  for (const item of arr) {
    // Sequence: Wait for each one
    await processItem(item);
  }
}`,
            explanation: "Using `await` inside a `for...of` loop creates a sequence where each iteration waits for the previous one to finish."
        }
    ],

    useCases: [
        "**Clean APIs**: Making library methods easy for others to consume.",
        "**Complex Flows**: Managing multi-step processes like Authentication -> Profile Fetch -> Preferences.",
        "**Error Handling**: Using standard `try/catch` for both sync and async errors.",
        "**Readability**: Maintaining code quality in large teams."
    ],

    memoryModel: `### **Pausing the Context**

**1. Context Suspension:**
- When the engine hits \`await\`, it literally **pauses** the execution context of that function.
- The context is moved from the **Stack** to the **Heap**.
- The main thread is freed up to do other work!

**2. Resumption:**
- When the promise resolves, the engine pushes a task to the **Microtask Queue**.
- When the **Event Loop** picks it up, the function context is moved back to the **Stack** and resumes from where it left off.

**3. Cost of Pausing:**
- While efficient, pausing and resuming contexts takes a few extra **CPU cycles** compared to regular callbacks. However, the readability benefit is almost always worth it.`,

    visualizationType: 'eventloop'
};

export default asyncAwait;

