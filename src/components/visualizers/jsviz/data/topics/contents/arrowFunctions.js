const arrowFunctions = {
    definition: "**Arrow Functions** (introduced in ES6) provide a more concise syntax for writing function expressions. Their most significant feature is that they **do not have their own `this`**, which makes them ideal for callbacks and preserving context.",

    syntax: `// 1. Basic Syntax
const add = (a, b) => {
  return a + b;
};

// 2. Concise (Implicit Return)
const multiply = (a, b) => a * b;

// 3. Single Parameter (No parens needed)
const square = x => x * x;

// 4. Returning an Object (Needs parens)
const getUser = id => ({ id, name: "Subhajit" });
`,

    examples: [
        {
            code: `// 1. Preservation of 'this'
const timer = {
  seconds: 0,
  start() {
    // Arrow function captures 'this' from start()
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
};

// timer.start();`,
            explanation: "In a regular function, `this` would be the global `window` object inside `setInterval`. The arrow function captures `this` from the `start` method, so it correctly refers to the `timer` object."
        },
        {
            code: `// 2. No 'arguments' object
const logArgs = (...args) => {
  // console.log(arguments); // ❌ ReferenceError
  console.log(args);        // ✅ Works!
};

logArgs(1, 2, 3);`,
            explanation: "Arrow functions don't have an `arguments` object. You must use **Rest Parameters** (`...args`) to access passed values dynamically."
        },
        {
            code: `// 3. Not a Constructor
const Person = (name) => {
  this.name = name;
};

// const subhajit = new Person("Subhajit"); // ❌ TypeError: Person is not a constructor`,
            explanation: "Arrow functions cannot be used with the `new` keyword and do not have a `prototype` property. They are designed for logic, not for building class instances."
        }
    ],

    useCases: [
        "**Callbacks**: Array methods like `.map()`, `.filter()`, and `.reduce()`.",
        "**Context Binding**: Inside methods to keep the class/object reference alive in async code.",
        "**Functional Abstraction**: Creating quick, small utility functions.",
        "**React/Frameworks**: Defining components or event handlers concisely."
    ],

    memoryModel: `### **The Arrow Advantage**

**1. Context Capture:**
- During the **Creation Phase**, the engine does not allocate a \`this\` pointer for the arrow function's context.
- It links directly to the **Lexical Scope**'s context. This saves a small amount of memory per call.

**2. Prototype-Free:**
- Regular functions have a \`prototype\` property (a whole object in the **Heap**). 
- Arrow functions do not. This makes them "lighter" objects in memory.

**3. JIT Inlining:**
- Because arrow functions are concise and have predictable context, the **JIT Compiler** can often "inline" them (replace the function call with the actual code) more easily than regular functions, leading to better **CPU performance**.`,

    visualizationType: 'callstack'
};

export default arrowFunctions;

