const modules = {
    definition: "**ES Modules (ESM)** are the official standard for organizing and sharing JavaScript code. They allow you to break your application into smaller, reusable files and manage dependencies explicitly.",

    syntax: `// file: math.js
export const add = (a, b) => a + b;
export default function multiply(a, b) { ... }

// file: app.js
import multiply, { add } from './math.js';
`,

    examples: [
        {
            code: `// 1. Named vs Default Exports
// helpers.js
export const config = { port: 3000 };
export function log(msg) { console.log(msg); }
export default class App {}

// main.js
import App, { config, log } from './helpers.js';`,
            explanation: "Default exports are imported without curly braces. Named exports must use curly braces `{}` and match the name exactly."
        },
        {
            code: `// 2. Renaming Imports
import { longFunctionName as log } from './utils.js';

log("Hello");`,
            explanation: "The `as` keyword allows you to rename an import to avoid name collisions in your current file."
        },
        {
            code: `// 3. Re-exporting (Aggregator Pattern)
// index.js
export { default as User } from './User.js';
export { default as Product } from './Product.js';
export * from './constants.js';`,
            explanation: "You can create an 'entry point' file that collects exports from many files, allowing users to import everything from a single folder."
        }
    ],

    useCases: [
        "**Code Splitting**: Loading only the code needed for a specific page.",
        "**Dependency Management**: Clearly seeing what each file depends on.",
        "**Namespacing**: Avoiding global variable collisions.",
        "**Maintainability**: Keeping files small and focused on a single task."
    ],

    memoryModel: `### **Module Loading Lifecycle**

**1. Static Analysis:**
- Imports are analyzed **before** any code runs. 
- This allows tools like Vite to "tree-shake" (remove unused code) from the final bundle, saving **RAM** and download time.

**2. Module Registry:**
- The browser maintains a registry of loaded modules in the **Heap**.
- Each module is executed **exactly once**, no matter how many times it's imported.

**3. Singleton Behavior:**
- If you export an object, every file that imports it gets a reference to the **same object in memory**.

**4. Performance:**
- Modules run in **Strict Mode** by default. 
- Deeply nested imports can increase "Main Thread Blocking" time during initial page load as the browser fetches and parses each file.`,

    visualizationType: 'variables'
};

export default modules;

