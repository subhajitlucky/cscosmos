const specInternals = {
    definition: "**ECMAScript Internals** refers to the low-level abstract operations and data structures defined in the official JS specification. Understanding these (Realms, Agents, Slots) helps explain why certain edge cases behave the way they do.",

    syntax: `// Internal concepts (Not directly codeable)
[[Prototype]]      // Internal Slot for inheritance
[[Get]] / [[Set]]  // Abstract operations for property access
[[Call]] / [[Construct]] // Internal methods for functions

// Realms (Isolated environments)
const realm = new Realm(); // (Proposed JS feature)
`,

    examples: [
        {
            code: `// 1. Internal Slots
const obj = {};
// We can't access [[Prototype]] directly, 
// but we use getPrototypeOf()
console.log(Object.getPrototypeOf(obj));`,
            explanation: "Internal slots are bracketed in the spec (like `[[Value]]`). They are hidden data fields within an object that only the engine can manipulate directly."
        },
        {
            code: `// 2. Abstract Operations
// When you run obj.prop, the engine triggers [[Get]]
const val = obj.prop;

// When you call a function, the engine triggers [[Call]]
myFunc();`,
            explanation: "The spec defines algorithms (Abstract Operations) for every action. For example, `[[Get]]` defines how the engine walks the prototype chain."
        },
        {
            code: `// 3. Different Realms (Iframes)
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);

const IframeArray = iframe.contentWindow.Array;
console.log([] instanceof IframeArray); // false!`,
            explanation: "Realms are isolated execution environments with their own global objects and built-ins. An array from one realm is not an `instanceof` the constructor from another realm."
        }
    ],

    useCases: [
        "**Debugging**: Understanding why `instanceof` fails across iframes or web workers.",
        "**Engine Dev**: Building tools like Babel or polyfills that mimic spec behavior.",
        "**Security**: Creating sandboxed environments (Realms) for untrusted code.",
        "**Deep Optimization**: Knowing how `[[Get]]` lookups work to write faster property access code."
    ],

    memoryModel: `### **Inside the Specification**

**1. Internal Slots:**
- Stored in a reserved area of the object's memory in the **Heap**.
- Not accessible via standard property iteration.

**2. Agents & Jobs:**
- An **Agent** is a thread plus the **Event Loop**.
- The engine uses **Job Queues** (like the Microtask queue) to manage pending operations defined by the spec.

**3. Execution Context Stack:**
- The spec defines exactly how contexts are pushed/popped on the **RAM**. 
- It tracks the **LexicalEnvironment** and **VariableEnvironment** as physical pointers in the stack frame.`,

    visualizationType: 'callstack'
};

export default specInternals;

