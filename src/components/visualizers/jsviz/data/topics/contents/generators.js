const generators = {
    definition: "**Generators** are functions that can be paused and resumed. They return an **Iterator** and allow you to produce a sequence of values over time, only calculating the next value when requested.",

    syntax: `// 1. Generator Declaration (*)
function* generatorFunc() {
  yield 1;
  yield 2;
  return 3;
}

// 2. Consumption
const gen = generatorFunc();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: true }
`,

    examples: [
        {
            code: `// 1. Infinite ID Generator
function* idMaker() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const ids = idMaker();
console.log(ids.next().value); // 1
console.log(ids.next().value); // 2`,
            explanation: "Generators can contain infinite loops without crashing! They simply pause at the `yield` statement and wait for the next `.next()` call."
        },
        {
            code: `// 2. Two-way Communication
function* conversation() {
  const answer = yield "What is your name?";
  console.log("Hello, " + answer);
}

const chat = conversation();
console.log(chat.next().value); // "What is your name?"
chat.next("Subhajit");          // "Hello, Subhajit"`,
            explanation: "Generators aren't just for outputs. You can pass a value back into the generator via `.next(value)`, which becomes the result of the `yield` expression inside the function."
        },
        {
            code: `// 3. Async Iteration (ES2018)
async function* fetchStream(urls) {
  for (const url of urls) {
    const res = await fetch(url);
    yield res.json();
  }
}

// Consumed with 'for await...of'`,
            explanation: "Async Generators combine the power of Async/Await with Generators, allowing you to stream asynchronous results one-by-one."
        }
    ],

    useCases: [
        "**Lazy Evaluation**: Processing massive files or datasets without loading them all into RAM.",
        "**State Machines**: Implementing complex multi-step logic (like a multi-page form or game flow).",
        "**Concurrency**: Libraries like `redux-saga` use generators to handle complex async side-effects.",
        "**Custom Iterables**: Making objects iterable in a cleaner way than manual Protocol implementation."
    ],

    memoryModel: `### **The Suspended State**

**1. Context Retention:**
- Unlike regular functions, a Generator's **Execution Context** is not destroyed when it returns or yields.
- It is moved from the **Stack** to the **Heap**, preserving the values of all local variables and the **Instruction Pointer**.

**2. Resumption:**
- Calling \`.next()\` moves the context back to the **Stack**.
- The **CPU** resumes execution from exactly where the last \`yield\` happened.

**3. State Management:**
- Generators are essentially a very efficient way to build a **Closure** that also remembers "where" it stopped in the code. 
- **Performance:** This state management is handled natively by the engine, making it faster than many manual state machine implementations.`,

    visualizationType: 'generator'
};

export default generators;

