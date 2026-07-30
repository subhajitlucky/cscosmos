const argumentsRest = {
    definition: "JavaScript provides flexible ways to handle function arguments. You can use the legacy **`arguments`** object or the modern **Rest Parameters** to handle a variable number of inputs.",

    syntax: `// 1. Legacy: arguments object
function oldStyle() {
  console.log(arguments[0]); // First arg
}

// 2. Modern: Rest Parameters (...)
function newStyle(...args) {
  console.log(args[0]); // First arg (it's a real Array!)
}

// 3. Combined
function mix(first, ...others) { ... }
`,

    examples: [
        {
            code: `// 1. The Power of Rest
function sumAll(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sumAll(1, 2, 3, 4)); // 10`,
            explanation: "Rest parameters (`...`) gather all remaining arguments into a **real Array**. This allows you to use powerful methods like `.reduce()`, `.map()`, or `.filter()` directly."
        },
        {
            code: `// 2. arguments object quirks
function checkArgs() {
  console.log(arguments.length); // 2
  // arguments.map(x => x); // ❌ Error! (Not an array)
  
  const realArr = Array.from(arguments);
  console.log(realArr.map(x => x)); // ✅ Works
}

checkArgs(10, 20);`,
            explanation: "The `arguments` object is **Array-like** (it has a length and indices) but lacks most array methods. It is also not available in **Arrow Functions**."
        },
        {
            code: `// 3. Destructuring Arguments
function logUser({ name, age }, ...tags) {
  console.log(\`User: \${name}, Age: \${age}\`);
  console.log("Tags:", tags);
}

logUser({ name: "Subhajit", age: 25 }, "js", "web", "viz");`,
            explanation: "You can combine object destructuring with rest parameters to create very clean and flexible function interfaces."
        }
    ],

    useCases: [
        "**Math/Utility functions**: Taking any number of items to process (like `Math.max`).",
        "**Wrappers/Proxies**: Passing all received arguments to an internal function.",
        "**Flexible APIs**: Allowing users to pass multiple strings, numbers, or objects without wrapping them in an array manually."
    ],

    memoryModel: `### **Argument Handling in Memory**

**1. Stack Allocation:**
- Arguments are initially passed via the **Call Stack**.
- Each value is placed in the function's local execution frame.

**2. The arguments Object:**
- Is a special object created in the **Heap** during the **Creation Phase** of the function's execution context.
- It holds a live reference to the arguments on the stack.

**3. Rest Parameters:**
- The engine creates a **new Array object** in the **Heap**.
- It copies the values from the **Stack** into this array. 
- While slightly more memory-intensive than \`arguments\`, the engine is highly optimized for this common pattern.

**4. Performance:**
- Accessing \`arguments\` can sometimes prevent engines (like V8) from performing certain optimizations ("de-optimization") because the object is "magical" and live-linked. Rest parameters are preferred for modern performance.`,

    visualizationType: 'callstack'
};

export default argumentsRest;

