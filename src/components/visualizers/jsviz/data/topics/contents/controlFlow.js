const controlFlow = {
    definition: "Control flow determines the order in which code is executed. It allows you to branch logic (`if/else`, `switch`) or repeat actions (`loops`) based on conditions.",

    syntax: `// 1. Conditionals
if (condition) { ... } else { ... }

switch (value) {
  case 'A': ... break;
  default: ...
}

// 2. Loops
for (let i=0; i<5; i++) { ... }
while (condition) { ... }
for (const item of array) { ... } // Iterables
for (const key in object) { ... } // Object keys

// 3. Error Handling
try { ... } catch (err) { ... } finally { ... }
`,

    examples: [
        {
            code: `// 1. Break vs Continue
for (let i = 0; i < 5; i++) {
  if (i === 2) continue; // Skip 2
  if (i === 4) break;    // Stop at 4
  console.log(i);
}
// Output: 0, 1, 3`,
            explanation: "`continue` skips the rest of the current iteration. `break` exits the entire loop immediately."
        },
        {
            code: `// 2. For...of vs For...in
const fruits = ['apple', 'banana'];

for (const fruit of fruits) {
  console.log(fruit); // 'apple', 'banana' (Values)
}

for (const index in fruits) {
  console.log(index); // '0', '1' (Keys/Indices)
}`,
            explanation: "`for...of` is for **values** in iterable objects (Arrays, Strings). `for...in` is for **keys** (property names) in objects."
        },
        {
            code: `// 3. Try...Catch...Finally
try {
  console.log("Starting...");
  throw new Error("Oops!");
} catch (error) {
  console.log("Caught:", error.message);
} finally {
  console.log("Cleaning up...");
}
// Output: Starting..., Caught: Oops!, Cleaning up...`,
            explanation: "`finally` always runs, whether an error was thrown or not. Great for closing database connections or stopping loading spinners."
        }
    ],

    useCases: [
        "**If/Else** for simple branching logic.",
        "**Switch** when checking a single variable against many fixed values.",
        "**Loops** for processing lists of data or repeating a task until a condition is met.",
        "**Error Handling** to gracefully recover from network failures or bad user input without crashing the app."
    ],

    memoryModel: `### **Control Flow in Memory**

**1. The Call Stack:**
- Conditional branches don't create new Stack frames, but **Loops** do maintain state (like \`i\`) in the current frame.
- **Errors** capture the current Stack trace, allowing you to see exactly where the failure occurred.

**2. CPU Branch Prediction:**
- Modern CPUs try to "guess" which way an \`if\` statement will go to speed up execution.
- Complex nested loops can be heavy on the **CPU** as it recalculates the condition and jumps back to the start of the block.

**3. Scope:**
- Blocks \`{}\` inside \`if\` or \`for\` create their own **Lexical Environments** for \`let\` and \`const\`.`,

    visualizationType: 'callstack'
};

export default controlFlow;

