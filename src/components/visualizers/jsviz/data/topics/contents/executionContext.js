const executionContext = {
    definition: "The **Execution Context** is an abstract environment created by the engine whenever code is evaluated and executed. Every line of code runs inside one of three types: **Global**, **Function**, or **Eval** contexts.",

    syntax: `// 1. Global Context
// Created when the script starts. 
// "this" = window (in browser)

// 2. Function Context
function demo() {
  // A new context is created EVERY time 
  // this function is called.
}

demo(); // Context created
demo(); // Another new context created
`,

    examples: [
        {
            code: `// 1. The Call Stack
function step1() {
  console.log("In step 1");
  step2();
  console.log("Leaving step 1");
}

function step2() {
  console.log("In step 2");
}

step1();`,
            explanation: "Stack trace: 1) Global Context pushed. 2) `step1` pushed. 3) `step2` pushed. 4) `step2` popped. 5) `step1` popped. 6) Global remains."
        },
        {
            code: `// 2. Creation vs Execution Phases
console.log(name); // undefined (Hoisted)
// console.log(age); // ReferenceError (TDZ)

var name = "Alex";
let age = 25;`,
            explanation: "During the **Creation Phase**, the engine allocates memory. `var` is set to `undefined`, while `let` is kept uninitialized."
        },
        {
            code: `// 3. The "this" keyword
console.log(this); // window (Global context)

const user = {
  name: "Subhajit",
  sayHi() {
    console.log(this.name); // Subhajit (Object context)
  }
};

user.sayHi();`,
            explanation: "The value of `this` depends on which execution context is currently active. Inside `sayHi`, the context is the `user` object."
        }
    ],

    useCases: [
        "**Debugging**: Understanding stack traces in the browser console.",
        "**Performance**: Avoiding deep nesting which creates many Stack Frames.",
        "**Hoisting**: Knowing why some variables are available early and others aren't.",
        "**Recursion**: Managing how many contexts you push to avoid Stack Overflows."
    ],

    memoryModel: `### **The Engine's Workflow**

**1. Creation Phase (Memory Allocation):**
- **Variable Environment:** Memory is allocated for variables and functions.
- **Outer Reference:** The link to the Scope Chain is built.
- **'this' Binding:** The value of the \`this\` keyword is determined.

**2. Execution Phase (Line-by-line):**
- The **CPU** executes the instructions.
- Values are assigned to variables.
- Function calls trigger new contexts on the **Stack**.

**3. Hardware Context:**
- **The Call Stack:** Lives in high-speed memory area of the **RAM**.
- **Context Size:** Each context takes a small bit of memory. Browsers limit the stack depth (usually ~10,000 calls) to protect the **CPU** and system stability.`,

    visualizationType: 'callstack'
};

export default executionContext;

