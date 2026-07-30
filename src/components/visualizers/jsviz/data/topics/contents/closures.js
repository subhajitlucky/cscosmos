const closures = {
    definition: "A **Closure** is the combination of a function and the **Lexical Environment** within which that function was declared. In simpler terms: a function 'remembers' its outer variables even after the outer function has finished executing.",

    syntax: `function outer() {
  const secret = "Pass123";
  
  return function inner() {
    // inner is a closure
    console.log(secret); 
  };
}

const reveal = outer();
reveal(); // "Pass123" (secret is still alive!)
`,

    examples: [
        {
            code: `// 1. Private State
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment() { return ++count; },
    decrement() { return --count; }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
// count = 10; // ❌ ReferenceError (count is encapsulated)`,
            explanation: "Closures are the primary way to create private variables in JavaScript. Only the functions returned by `createCounter` can access or modify `count`."
        },
        {
            code: `// 2. Functional Currying
function greet(greeting) {
  return (name) => \`\${greeting}, \${name}\`;
}

const sayHi = greet("Hi");
const sayHello = greet("Hello");

console.log(sayHi("Subhajit"));   // "Hi, Subhajit"
console.log(sayHello("Alex")); // "Hello, Alex"`,
            explanation: "Each call to `greet` creates a new environment. `sayHi` and `sayHello` are two different closures that 'remember' different `greeting` values."
        },
        {
            code: `// 3. The "Classic" Interview Question
for (var i = 1; i <= 3; i++) {
  (function(capturedI) {
    setTimeout(() => {
      console.log('Closure val:', capturedI);
    }, 1000);
  })(i);
}
// Before 'let', we used IIFEs to create closures manually.`,
            explanation: "In the old days of `var`, we used an **IIFE (Immediately Invoked Function Expression)** to create a closure and 'capture' the current value of `i` for each timer."
        }
    ],

    useCases: [
        "**Encapsulation**: Creating private methods and properties (Module Pattern).",
        "**Memoization**: Saving the results of expensive calculations.",
        "**Event Handlers**: Preserving data associated with an element when a callback runs later.",
        "**Functional Programming**: Currying and partial application of functions."
    ],

    memoryModel: `### **Closures in Memory**

**1. Heap Retention:**
- Normally, when a function finishes, its **Stack Frame** is popped and variables are deleted.
- If a closure exists, the engine moves the **Lexical Environment** from the **Stack** to the **Heap**.
- This keeps those variables alive indefinitely.

**2. Memory Leaks:**
- Closures prevent the **Garbage Collector** from freeing memory. 
- If you create thousands of closures that you never use, your app will consume more and more **RAM**.

**3. Reference Capture:**
- A closure captures a **reference** to the variable, not a copy of its value. If the variable changes later, the closure will see the updated value.`,

    visualizationType: 'scopechain'
};

export default closures;
