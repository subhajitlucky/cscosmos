/* eslint-disable */
const literalsSyntax = {
    definition: "**Literals** are the shorthand notation for creating values in JavaScript. Instead of using constructors (like \`new Object()\`), you use literals (like \`{}\`). **Syntax Rules** define how the engine parses and interprets your code, including strict mode and naming conventions.",

    syntax: `// 1. Common Literals
const obj = {};           // Object literal
const arr = [];           // Array literal
const str = "text";       // String literal
const num = 123;          // Numeric literal
const reg = /ab+c/;       // Regex literal

// 2. Modern Syntax Rules
"use strict";             // Enables Strict Mode

// Naming Rules (Identifiers)
let $var = 1;             // ✅ Can start with $
let _var = 2;             // ✅ Can start with _
let var1 = 3;             // ✅ Can contain numbers
// let 1var = 4;          // ❌ Cannot start with numbers
`,

    examples: [
        {
            code: `// 1. Object Literal Enhancements
const name = "Subhajit";
const age = 25;

const user = {
  name,                   // Property shorthand
  age,
  sayHi() {               // Method shorthand
    console.log("Hi!");
  }
};

console.log(user);`,
            explanation: "Modern JS allows shorthand property and method names in object literals, making code much more concise."
        },
        {
            code: `// 2. Strict Mode Benefits
"use strict";

function mistake() {
  // x = 10;              // ❌ ReferenceError (No global leak)
  let x = 10;             // ✅ Correct
}

const obj = {};
Object.defineProperty(obj, "readOnly", { value: 1, writable: false });
// obj.readOnly = 2;      // ❌ TypeError in Strict Mode`,
            explanation: "\`\"use strict\"\` catches common coding mistakes and prevents the creation of accidental global variables, making your code more secure and optimized."
        },
        {
            code: `// 3. Numeric Literals
const binary = 0b1010;    // 10
const octal = 0o744;      // 484
const hex = 0xFF;         // 255
const big = 1_000_000;    // ✅ Numeric separators for readability

console.log(big); // 1000000`,
            explanation: "JavaScript supports various bases for numbers and allows underscores as separators to make large numbers easier to read."
        }
    ],

    useCases: [
        "**Literals** are the preferred way to create objects and arrays for better performance and readability.",
        "**Strict Mode** should be used in every file (though it's enabled by default in ES Modules).",
        "**Numeric Separators** for clear financial or mathematical constants.",
        "**Regex Literals** for pattern matching without double-escaping backslashes."
    ],

    memoryModel: `### **Parsing & Allocation**

**1. Literal Optimization:**
- When the engine sees a literal like \`{}\`, it avoids the overhead of calling a constructor function.
- It allocates memory in the **Heap** instantly based on the literal's shape.

**2. Strict Mode Impact:**
- Strict mode forces the engine to perform more thorough checks during the **Parsing phase**.
- It disables certain "bad" features (like \`with\`), allowing the **JIT (Just-In-Time) Compiler** to optimize the code better.

**3. Tokenization:**
- The engine breaks your code into tokens (e.g., \`const\`, \`identifier\`, \`operator\`). 
- Literals are identified as fixed values directly in the **Abstract Syntax Tree (AST)**.`,

    visualizationType: 'variables'
};

export default literalsSyntax;

