/* eslint-disable */
const dynamicImports = {
    definition: "**Dynamic Imports** (introduced in ES2020) allow you to load modules on-demand asynchronously. Unlike standard static imports, they can be used inside functions and conditional blocks, enabling significant performance optimizations like code-splitting.",

    syntax: `// 1. Basic Usage (Returns a Promise)
import('./module.js')
  .then(module => { ... });

// 2. With Async/Await
async function load() {
  const { helper } = await import('./utils.js');
  helper();
}

// 3. Conditional Loading
if (userIsAdmin) {
  await import('./adminTools.js');
}
`,

    examples: [
        {
            code: `// 1. Lazy Loading Features
async function openEditor() {
  console.log(\"Loading heavy editor logic...\");
  const { initEditor } = await import('./heavyEditor.js');
  initEditor();
}

// openEditor() only runs when the user clicks a button`,
            explanation: "Dynamic imports allow you to keep your initial bundle small. You only download the code for 'heavy' features if the user actually needs them."
        },
        {
            code: `// 2. Destructuring Exports
async function compute() {
  // Directly grab what you need
  const { add, subtract } = await import('./math.js');
  console.log(add(5, 10));
}`,
            explanation: "The imported module object behaves like a standard namespace object, allowing you to destructure its exports easily."
        },
        {
            code: `// 3. Error Handling
async function safeLoad() {
  try {
    const mod = await import('./missing.js');
  } catch (err) {
    console.log(\"Module failed to load (Network error?)\", err);
  }
}`,
            explanation: "Because dynamic imports return a Promise, you can catch network failures or 404 errors using standard `try/catch`."
        }
    ],

    useCases: [
        "**Route Splitting**: Loading page-specific code only when the user navigates there.",
        "**Feature Flags**: Loading experimental features only for specific users.",
        "**Conditional Polyfills**: Loading compatibility code only for older browsers.",
        "**Theme Loading**: Swapping out CSS-in-JS or component sets based on user settings."
    ],

    memoryModel: `### **On-Demand Allocation**

**1. Network Fetch:**
- When \`import()\` is called, the **Browser Engine** initiates a network request.
- The code is fetched and parsed into the **Bytecode** in the **Heap**.

**2. Module Graph:**
- The engine links the dynamically loaded module into the existing **Module Map** in **RAM**.
- If the module was already loaded elsewhere, it returns the **cached singleton** reference.

**3. Memory Efficiency:**
- By delaying the load, you reduce the **Initial Heap Size** of your application. 
- **Hardware:** This speeds up the "Time to Interactive" (TTI) because the **CPU** has less code to parse and execute during the critical startup phase.`,

    visualizationType: 'eventloop'
};

export default dynamicImports;

