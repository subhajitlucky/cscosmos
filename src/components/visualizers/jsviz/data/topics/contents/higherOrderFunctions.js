const higherOrderFunctions = {
    definition: "A **Higher-Order Function (HOF)** is a function that does at least one of the following: 1) Takes one or more functions as arguments, or 2) Returns a function as its result. They allow for powerful abstractions like composition and currying.",

    syntax: `// 1. Function as Argument (HOF)
function calculator(a, b, operation) {
  return operation(a, b);
}

// 2. Function as Result (HOF)
function multiplier(factor) {
  return (num) => num * factor;
}

const double = multiplier(2);
double(5); // 10
`,

    examples: [
        {
            code: `// 1. Building Reusable Logic
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

function applyOp(x, y, op) {
  console.log("Applying operation...");
  return op(x, y);
}

console.log(applyOp(5, 3, add));      // 8
console.log(applyOp(5, 3, multiply)); // 15`,
            explanation: "`applyOp` is a HOF because it treats logic (the `op` function) as data that can be swapped out easily."
        },
        {
            code: `// 2. Factory Pattern
function createLogger(level) {
  return (msg) => console.log(\`[\${level.toUpperCase()}] \${msg}\`);
}

const info = createLogger('info');
const error = createLogger('error');

info('System started'); // "[INFO] System started"
error('Connection lost'); // "[ERROR] Connection lost"`,
            explanation: "HOFs can 'specialize' a function. `createLogger` returns a new function that 'remembers' the `level` it was created with (using a closure)."
        },
        {
            code: `// 3. Built-in HOFs: Array methods
const prices = [10, 20, 30];

// map, filter, and reduce are ALL higher-order functions
const taxed = prices.map(p => p * 1.15); 
console.log(taxed);`,
            explanation: "Most functional methods in JS are HOFs because they accept callbacks to define how the data should be handled."
        }
    ],

    useCases: [
        "**Abstraction**: Hiding repetitive boilerplates (like looping) behind a HOF.",
        "**Composition**: Combining simple functions to create complex workflows.",
        "**Currying**: Transforming a function with multiple arguments into a sequence of functions.",
        "**Middleware**: In frameworks like Express, functions are passed and returned to handle requests."
    ],

    memoryModel: `### **HOFs in Memory**

**1. Functional Scope:**
- Returning a function creates a **Closure**. 
- The returned function maintains a reference to the **Lexical Environment** of its parent, keeping those variables alive in the **Heap**.

**2. Garbage Collection:**
- Even if the HOF (parent) has finished executing, its memory isn't reclaimed as long as the returned (child) function is still accessible.

**3. Optimization:**
- Modern engines can inline simple HOFs during **JIT Compilation**, reducing the performance cost of multiple function calls.`,

    visualizationType: 'scopechain'
};

export default higherOrderFunctions;

