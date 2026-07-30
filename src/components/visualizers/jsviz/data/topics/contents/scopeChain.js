const scopeChain = {
    definition: "The **Scope Chain** is the mechanism JavaScript uses to resolve variable names. When a variable is used, the engine looks at the current scope; if it doesn't find it, it looks at the outer scope, and so on, until it reaches the **Global Scope** or fails.",

    syntax: `// Global Scope
const globalVar = "Earth";

function outer() {
  // Outer Scope
  const outerVar = "Continent";

  function inner() {
    // Inner Scope
    const innerVar = "Country";
    
    // Lookups go OUTWARD
    console.log(innerVar); // ✅ Found in inner
    console.log(outerVar); // ✅ Found in outer
    console.log(globalVar); // ✅ Found in global
  }
}
`,

    examples: [
        {
            code: `// 1. Variable Shadowing
const name = "Global";

function demo() {
  const name = "Local"; // Shadows global name
  console.log(name); // "Local"
}

demo();
console.log(name); // "Global"`,
            explanation: "Shadowing happens when a variable in a local scope has the same name as one in an outer scope. The engine stops at the first match it finds in the chain."
        },
        {
            code: `// 2. Lexical Scope (Static Scope)
const x = 10;

function printX() {
  console.log(x);
}

function outer() {
  const x = 20;
  printX(); // What will this print?
}

outer(); // Output: 10`,
            explanation: "JavaScript uses **Lexical Scope**. A function's scope is determined by where it is **written** in the code, not where it is **called**. `printX` was written in the global scope, so it looks there for `x`."
        },
        {
            code: `// 3. Block Scope Chain
{
  const a = 1;
  {
    const b = 2;
    console.log(a); // ✅ 1
  }
  // console.log(b); // ❌ ReferenceError
}`,
            explanation: "Each block `{}` creates its own environment. The inner block can access the outer block's variables, but not vice-versa."
        }
    ],

    useCases: [
        "**Privacy**: Hiding variables from the global scope to avoid name collisions.",
        "**State Management**: Using closures to maintain state across function calls.",
        "**Security**: Preventing external scripts from accessing sensitive internal variables.",
        "**Modularity**: Encapsulating logic within functions or blocks."
    ],

    memoryModel: `### **The Chain in Memory**

**1. Lexical Environment:**
- Every execution context has a reference to its **Outer Environment**.
- This linked list of environments is the physical **Scope Chain**.

**2. Variable Resolution:**
- When you use a variable, the **CPU** doesn't just look at one spot in RAM.
- It "walks" the linked list of environments in the **Stack/Heap**. 
- Each step outward is a memory lookup. Deeply nested chains can be slightly slower.

**3. Global Object:**
- The end of the chain is always the **Global Object** (\`window\` in browsers, \`global\` in Node).
- If the lookup fails here, the engine throws a \`ReferenceError\`.`,

    visualizationType: 'scopechain'
};

export default scopeChain;

