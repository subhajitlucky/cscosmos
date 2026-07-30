/* eslint-disable */
const legacy = {
    definition: "**Legacy & Edge Syntax** covers the 'dark corners' of JavaScript—features that are deprecated, rarely used, or considered bad practice, but still exist for backward compatibility.",

    syntax: `// 1. 'with' (Strictly forbidden in modules)
with (obj) { console.log(prop); }

// 2. Labels (Used for multi-level loops)
outer: for (...) { break outer; }

// 3. var aliasing (Arguments object)
function test(a) { arguments[0] = 99; return a; }
`,

    examples: [
        {
            code: `// 1. The 'with' confusion
const user = { name: \"Alex\" };
let name = \"Global\";

with (user) {
  // Is this user.name or local name?
  console.log(name); // \"Alex\"
}`,
            explanation: "`with` adds an object to the top of the scope chain. It makes code impossible to read and impossible for the engine to optimize."
        },
        {
            code: `// 2. Labeled Loops
topLoop: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1) break topLoop;
    console.log(i, j);
  }
}`,
            explanation: "Labels allow you to `break` or `continue` a loop that isn't the immediate parent. While sometimes useful, they are often a sign of overly complex logic."
        },
        {
            code: `// 3. eval scope (Legacy)
(function() {
  var x = 1;
  eval(\"var x = 2\"); 
  console.log(x); // 2
})();`,
            explanation: "Old-style `eval` can shadow variables and create new ones in the caller's scope, leading to 'spooky action at a distance' bugs."
        }
    ],

    useCases: [
        "**Reverse Engineering**: Reading old libraries or obfuscated code.",
        "**Game Development**: Occasional use of labels for complex collision loops.",
        "**Legacy Support**: Maintaining apps written in the early 2000s.",
        "**Educational**: Understanding why modern features (like `let` and `const`) were created."
    ],

    memoryModel: `### **The Compatibility Cost**

**1. Optimization De-optimization:**
- Using features like \`with\` or \`eval\` forces the engine to discard many **JIT** optimizations.
- The engine must perform a "Full Scope Lookup" in the **Heap** for every single variable access, slowing down the **CPU**.

**2. Scope Bloat:**
- Legacy features often create extra objects in the **Lexical Environment** stack, increasing **RAM** usage for even simple functions.

**3. Engine Complexity:**
- Modern engines (like V8) have to maintain millions of lines of "Legacy Support" code just to ensure that websites from 1995 still work today.`,

    visualizationType: 'variables'
};

export default legacy;

