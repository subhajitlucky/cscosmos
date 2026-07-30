const promises = {
    definition: "A **Promise** is a proxy for a value not necessarily known when the promise is created. It allows you to associate handlers with an asynchronous action's eventual success value or failure reason.",

    syntax: `// 1. Creation
const p = new Promise((resolve, reject) => {
  if (success) resolve("Data");
  else reject("Error");
});

// 2. Consumption
p.then(data => console.log(data))
 .catch(err => console.error(err))
 .finally(() => console.log("Done"));
`,

    examples: [
        {
            code: `// 1. Chaining Promises
fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts[0]))
  .catch(err => console.log("Failed somewhere:", err));`,
            explanation: "Promises solve 'Callback Hell' by allowing you to chain async operations vertically instead of nesting them horizontally."
        },
        {
            code: `// 2. Promise Combinators
const p1 = Promise.resolve(10);
const p2 = new Promise(res => setTimeout(() => res(20), 100));

Promise.all([p1, p2]).then(values => {
  console.log(values); // [10, 20]
});`,
            explanation: "`Promise.all` waits for ALL promises to fulfill. If any one fails, the whole thing rejects immediately. Great for parallel requests."
        },
        {
            code: `// 3. Race & Any
Promise.race([
  fetch('/api'),
  new Promise((_, reject) => setTimeout(() => reject("Timeout"), 5000))
]);`,
            explanation: "`Promise.race` returns the result of the first promise that finishes (either success or failure). It's commonly used to implement timeouts."
        }
    ],

    useCases: [
        "**API Calls**: Fetching data from a server.",
        "**Image Loading**: Waiting for an asset to load before showing it.",
        "**Database Queries**: Asynchronous interactions with a DB.",
        "**Concurrency**: Running multiple tasks at once and waiting for the results."
    ],

    memoryModel: `### **The Lifecycle**

**1. States:**
- **Pending**: Initial state, neither fulfilled nor rejected.
- **Fulfilled**: Operation completed successfully.
- **Rejected**: Operation failed.

**2. Storage:**
- A Promise is an object in the **Heap**. 
- It maintains a list of 'reaction' records (the functions you passed to \`.then\`).

**3. Execution (Microtasks):**
- When a promise resolves, its callbacks are pushed to the **Microtask Queue**.
- They are processed as soon as the **Call Stack** is empty.

**4. Garbage Collection:**
- A Promise object stays in the **RAM** until it is settled and there are no more \`.then()\` or \`.catch()\` references to it.`,

    visualizationType: 'eventloop'
};

export default promises;
