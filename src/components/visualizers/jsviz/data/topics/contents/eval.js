/* eslint-disable */
const evalContent = {
    definition: "**eval()** and related functions (like \`new Function()\`) allow you to execute JavaScript code from strings. While powerful, they are extremely dangerous and should almost always be avoided due to security and performance risks.",

    syntax: `// 1. eval (Sloppy scope)
eval(\"console.log('hi')\");

// 2. new Function (Global scope)
const add = new Function('a', 'b', 'return a + b');

// 3. setTimeout with string
setTimeout(\"doSomething()\", 1000); // ❌ Bad practice!
`,

    examples: [
        {
            code: `// 1. Dynamic Math Parsing
const expression = \"2 + 2\";
const result = eval(expression);

console.log(result); // 4`,
            explanation: "Eval can turn any string into live code. However, if the string comes from a user, they could run malicious scripts like `window.location = ...`."
        },
        {
            code: `// 2. The Scope Trap
let x = 10;
function demo() {
  let x = 20;
  eval(\"x = 30\"); // Which 'x' is changed?
  console.log(x); // 30
}

demo();
console.log(x); // 10`,
            explanation: "Standard `eval()` uses the **Local Scope** where it was called. This makes code hard to optimize because the engine can't predict what variables will change."
        },
        {
            code: `// 3. Global eval
// Use indirect call to force global scope
const globalEval = eval;
globalEval(\"var globalLeak = 1\");`,
            explanation: "Indirect eval (calling it via a variable) forces the code to run in the Global Realm, preventing it from touching local variables."
        }
    ],

    useCases: [
        "**Templates**: Some old template engines use `new Function()` for speed (compiled templates).",
        "**DevTools**: Console applications need a way to run arbitrary user input.",
        "**Obfuscation**: Some tools 'hide' logic inside strings to prevent reverse engineering.",
        "**Plugins**: Executing third-party logic in a strictly controlled environment."
    ],

    memoryModel: `### **The Parser Cost**

**1. No Optimizations:**
- When the engine sees \`eval()\`, it must **disable the JIT Compiler** for that entire function.
- The engine cannot assume anything about local variables, making execution significantly slower in **RAM**.

**2. Dynamic Parsing:**
- Every \`eval()\` call triggers the **Full Parser** and **Bytecode Generator**.
- This is a heavy **CPU** operation that would normally only happen once when the script loads.

**3. Memory Bloat:**
- Dynamically created functions stay in the **Heap** even after the execution finishes, potentially leading to memory leaks if called in a loop.`,

    visualizationType: 'callstack'
};

export default evalContent;

