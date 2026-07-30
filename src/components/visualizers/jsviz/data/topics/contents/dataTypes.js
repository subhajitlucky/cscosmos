const dataTypes = {
    definition: "JavaScript is a **dynamically typed** language, meaning variables don't have a fixed type, but the **values** they hold do. Types are split into two categories: **Primitives** (simple, immutable) and **Objects** (complex, mutable).",

    syntax: `// 1. Primitives (Stored by Value)
const str = "Hello";    // String
const num = 42;         // Number
const bool = true;      // Boolean
const nul = null;       // Null
const und = undefined;  // Undefined
const sym = Symbol();   // Symbol
const big = 10n;        // BigInt

// 2. Objects (Stored by Reference)
const obj = { key: "val" };
const arr = [1, 2, 3];
const func = function() {};

// Checking Types
typeof "text";          // "string"
typeof 42;              // "number"
typeof true;            // "boolean"
typeof undefined;       // "undefined"
typeof {a:1};           // "object"
typeof [1,2];           // "object" (Arrays are objects!)
typeof null;            // "object" (Historical bug in JS)
`,

    examples: [
        {
            code: `// 1. Primitive Immutability
let name = "Subhajit";
name[0] = "A"; // ❌ Silently fails (or error in strict mode)
console.log(name); // "Subhajit" (Unchanged)

name = "Alex"; // ✅ Reassigning the variable is allowed
console.log(name); // "Alex"`,
            explanation: "Primitives are **immutable**. You cannot change a character inside a string; you can only replace the entire string with a new one."
        },
        {
            code: `// 2. Value vs Reference
// Primitives: Copied by Value
let x = 10;
let y = x;
y = 20;
console.log(x); // 10 (Independent)

// Objects: Copied by Reference
let user1 = { name: "Alice" };
let user2 = user1; // Both point to the SAME object in memory
user2.name = "Bob";
console.log(user1.name); // "Bob" (Affected!)`,
            explanation: "Primitives store the actual value. Objects store a **memory address** (reference). Modifying one reference affects all others pointing to that object."
        },
        {
            code: `// 3. Null vs Undefined
let a;
console.log(a); // undefined (System default for "not assigned")

let b = null;
console.log(b); // null (Developer choice for "intentionally empty")`,
            explanation: "`undefined` means a variable has been declared but not yet assigned a value. `null` is an assignment value representing 'no value'."
        }
    ],

    useCases: [
        "**Primitives** are perfect for single values like IDs, names, or flags.",
        "**Objects/Arrays** are used to group related data and build complex structures.",
        "**typeof** is essential for validation before performing operations (e.g., checking if a callback is a function).",
        "**BigInt** is used for high-precision calculations (e.g., financial data or large IDs) that exceed the safe limit of Numbers."
    ],

    memoryModel: `### **Storage Strategy**

**1. The Stack (Primitives):**
- Primitives are stored in the **Stack**.
- They have a fixed size and are extremely fast to access.
- When you pass a primitive, JS copies the **actual value**.

**2. The Heap (Objects):**
- Objects, Arrays, and Functions are stored in the **Heap**.
- The Heap is large, unstructured memory for data whose size might change.
- The **Stack** only stores a **pointer** (reference) to the Heap address.

### **Hardware Context**
- **CPU:** Handles the Stack operations directly via registers (super fast).
- **RAM:** Both Stack and Heap live in RAM, but the Heap requires more "walking" through memory to find data.`,

    visualizationType: 'variables'
};

export default dataTypes;

