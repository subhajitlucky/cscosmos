const variablesScope = {
    definition: "var, let, and const all declare variables, but they differ in scope (where the name is visible), hoisting/TDZ behavior, and reassignment rules. Choosing the right one avoids leaks, surprises, and accidental globals.",

    quiz: [
        {
            id: "q1",
            category: "Block vs Function Scope",
            question: "What is logged to the console when executing this block?",
            code: `if (true) {
  var a = 10;
  let b = 20;
}
console.log(a);
console.log(typeof b);`,
            options: [
                {
                    text: "10 then 'undefined'",
                    correct: true,
                    explanation: "`var` is function-scoped so it leaks out of the `if` block, while `let` is block-scoped and does not exist outside the curly braces."
                },
                {
                    text: "ReferenceError immediately on line 5",
                    correct: false,
                    explanation: "`var a` is fully accessible outside the block because `var` only respects function boundaries, not block boundaries."
                }
            ]
        },
        {
            id: "q2",
            category: "Temporal Dead Zone",
            question: "What happens when accessing `x` before its declaration?",
            code: `console.log(x);
let x = 42;`,
            options: [
                {
                    text: "ReferenceError: Cannot access 'x' before initialization",
                    correct: true,
                    explanation: "`let` and `const` variables are hoisted into memory but remain in the Temporal Dead Zone (TDZ) until execution reaches their declaration line."
                },
                {
                    text: "Logs `undefined` without error",
                    correct: false,
                    explanation: "Only `var` is initialized to `undefined` upon hoisting. `let` and `const` remain uninitialized in the TDZ."
                }
            ]
        },
        {
            id: "q3",
            category: "Const Binding vs Value",
            question: "Which of the following operations on a `const` variable will throw a TypeError?",
            code: `const config = { port: 3000 };`,
            options: [
                {
                    text: "config = { port: 8080 };",
                    correct: true,
                    explanation: "`const` creates an immutable binding — you cannot reassign the variable identifier itself to point to a new memory address."
                },
                {
                    text: "config.port = 8080;",
                    correct: false,
                    explanation: "Mutating an object's properties is completely valid because the variable binding still points to the same object in the heap."
                }
            ]
        }
    ],

    syntax: `// Declarations
var name1 = value;    // Function-scoped
let name2 = value;    // Block-scoped
const name3 = value;  // Block-scoped & immutable binding

// Scope Blocks
{
  // "Block" scope created here
  let visibleHere = 1;
}

function name() {
  // "Function" scope created here
  var visibleHere = 1;
}

// Reassignment Syntax
name1 = newValue;     // Allowed
name2 = newValue;     // Allowed
name3 = newValue;     // Error!

// Hoisting Behavior
// var: hoisted as undefined
// let/const: hoisted but uninitialized (TDZ)
`,

    examples: [
        {
            code: `// 1. Block Scope vs Function Scope
if (true) {
  var functionScoped = 'I leak out!';
  let blockScoped = 'I stay here';
  const alsoBlockScoped = 'Me too';
}

console.log(functionScoped); // "I leak out!"
// console.log(blockScoped); // ReferenceError
// console.log(alsoBlockScoped); // ReferenceError`,
            explanation: "`var` ignores block boundaries (like if/for loops), leaking into the outer function. `let`/`const` stay safely inside."
        },
        {
            code: `// 2. The "Loop Problem" (Closure + Scope)
// OLD WAY (Buggy): var shares one 'i' variable
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var:', i), 100);
}
// Output: var: 3, var: 3, var: 3

// MODERN WAY (Fixed): let creates a new 'j' for each loop
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let:', j), 100);
}
// Output: let: 0, let: 1, let: 2`,
            explanation: "Using `let` in loops ensures each iteration gets its own independent variable binding, fixing async bugs."
        },
        {
            code: `// 3. Const Mutability
const user = { name: "Subhajit" };

// Allowed: Modifying the object's contents
user.name = "Alex"; 
console.log(user.name); // "Alex"

// Forbidden: Replacing the object itself
// user = { name: "New Person" }; // TypeError: Assignment to constant variable`,
            explanation: "`const` protects the *variable binding* (the arrow pointing to memory), not the *value* (the object itself)."
        },
        {
            code: `// 4. Temporal Dead Zone (TDZ) Safety
console.log(myVar); // undefined (risky!)
var myVar = 10;

// console.log(myLet); // ReferenceError (safe!)
let myLet = 20;`,
            explanation: "TDZ ensures you don't use variables before they are ready. `var` lets you access them too early (as undefined), which hides bugs."
        }
    ],

    useCases: [
        "**Use `const` by default** to signal intent and prevent accidental rebinding.",
        "**Use `let`** only when the value must change (counters, accumulators, loop indices).",
        "**Avoid `var`** in modern code to prevent block leaks and hoisting surprises.",
        "**Async loops:** prefer `let` so each iteration gets its own binding (fixes the classic 'all threes' bug)."
    ],

    memoryModel: `**Storage Locations:**
- **Primitives (number, boolean, undefined):** Stored directly in the **Stack** (fast access).
- **Objects/Functions:** Stored in the **Heap** (large memory); the Stack holds a *reference* (pointer) to the Heap address.

**Browser Execution Context:**
- **Variables:** Stored in the Variable Environment of the current Execution Context (Stack).
- **Closures:** Stored in the Heap (so they survive after the function returns).

**Hardware:**
- **CPU:** Executes the instructions (Stack operations are CPU-cache friendly).
- **RAM:** Physical home for both Stack and Heap.

**Creation Phase:**
1. Engine parses code.
2. Allocates memory for variables (hoisting).
   - \`var\` → initialized to \`undefined\`.
   - \`let/const\` → uninitialized (TDZ).

**Execution Phase:**
1. Code runs line-by-line.
2. Assignments happen.
3. Accessing TDZ variables throws errors.`,

    visualizationType: 'scopechain'
};

export default variablesScope;

