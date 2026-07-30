const variablesScope = {
    definition: "var, let, and const all declare variables, but they differ in scope (where the name is visible), hoisting/TDZ behavior, and reassignment rules. Choosing the right one avoids leaks, surprises, and accidental globals.",

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

