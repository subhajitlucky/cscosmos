const callbacks = {
    definition: "A **callback** is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of routine or action. They are the foundation of asynchronous programming in JavaScript.",

    syntax: `// Standard Callback Pattern
function outer(data, callback) {
  // ... process data ...
  callback(result);
}

// Anonymous Callback
setTimeout(() => {
  console.log("Done!");
}, 1000);

// Error-First Callback (Node.js style)
fs.readFile('file.txt', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
`,

    examples: [
        {
            code: `// 1. Basic Callback
function processInput(name, callback) {
  console.log("Processing name...");
  callback(name);
}

processInput("Subhajit", (user) => {
  console.log("Hello, " + user);
});`,
            explanation: "The anonymous arrow function is passed as an argument and executes *after* the initial log inside `processInput`."
        },
        {
            code: `// 2. Callback Hell (Pyramid of Doom)
function step1(cb) { setTimeout(() => { console.log('Step 1'); cb(); }, 100); }
function step2(cb) { setTimeout(() => { console.log('Step 2'); cb(); }, 100); }
function step3(cb) { setTimeout(() => { console.log('Step 3'); cb(); }, 100); }

step1(() => {
  step2(() => {
    step3(() => {
      console.log('All steps done!');
    });
  });
});`,
            explanation: "When you have multiple dependent async tasks, nesting callbacks leads to hard-to-read code. This is why Promises and Async/Await were invented."
        },
        {
            code: `// 3. Callback vs Direct Execution
const nums = [1, 2, 3];

// Callback style
nums.forEach(n => console.log(n));

// The function is called for EVERY item
// It's not running once; it's running 3 separate times.`,
            explanation: "Array methods like `forEach`, `map`, and `filter` rely entirely on callbacks to handle each element in the list."
        }
    ],

    useCases: [
        "**Event Handling**: Calling a function when a user clicks a button.",
        "**Timers**: Running code after a specific delay (`setTimeout`).",
        "**I/O Operations**: Reading files or making network requests (pre-Promise era).",
        "**Functional Programming**: Abstracting logic into reusable utility functions."
    ],

    memoryModel: `### **Callbacks in the System**

**1. Function Objects:**
- Callbacks are just standard Function objects in the **Heap**.
- When you pass a callback, you're passing a **pointer** to that function object.

**2. Execution Context:**
- Each time the callback is invoked, a **new Stack Frame** is created.
- If the callback is async (like in \`setTimeout\`), its execution context is created much later, triggered by the **Event Loop**.

**3. Closures:**
- Callbacks often capture variables from their outer scope. 
- Those captured variables stay in the **Heap** (via a closure) even if the outer function's Stack Frame has already been popped.`,

    visualizationType: 'eventloop'
};

export default callbacks;

