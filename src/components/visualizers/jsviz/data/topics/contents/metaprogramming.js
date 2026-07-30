const metaprogramming = {
    definition: "**Metaprogramming** is code that acts on other code. JavaScript provides the **Proxy** and **Reflect** APIs to intercept and redefine fundamental operations (like property lookup or assignment) on objects.",

    syntax: `// 1. Proxy (Interception)
const proxy = new Proxy(target, {
  get(obj, prop) { ... },
  set(obj, prop, val) { ... }
});

// 2. Reflect (Standard behavior)
Reflect.get(target, prop);
Reflect.ownKeys(target);

// 3. Symbols (Unique keys)
const id = Symbol('id');
obj[id] = 123;
`,

    examples: [
        {
            code: `// 1. Validation Proxy
const user = { age: 25 };

const validator = new Proxy(user, {
  set(target, prop, value) {
    if (prop === 'age' && value < 0) {
      throw new Error("Age must be positive!");
    }
    target[prop] = value;
    return true;
  }
});

// validator.age = -5; // ❌ Error!`,
            explanation: "Proxies allow you to 'trap' operations. In this example, we intercept property assignment to enforce validation rules before they hit the target object."
        },
        {
            code: `// 2. Logging & Profiling
const data = { x: 10, y: 20 };

const tracer = new Proxy(data, {
  get(target, prop) {
    console.log("Accessed:", prop);
    return target[prop];
  }
});

tracer.x; // Logged!`,
            explanation: "Proxies are perfect for debugging or building reactive systems where you need to know exactly when a piece of data is being read."
        },
        {
            code: `// 3. Reflect vs Dot Notation
const obj = { a: 1 };

// These are identical:
const val1 = obj.a;
const val2 = Reflect.get(obj, 'a');`,
            explanation: "Reflect provides a set of methods that do exactly what standard operations do. It's the 'clean' way to perform fundamental actions inside Proxy traps."
        }
    ],

    useCases: [
        "**Reactivity**: Building frameworks (like Vue 3) that automatically update the UI when data changes.",
        "**Validation**: Enforcing strict schemas on objects.",
        "**API Mocking**: Creating objects that respond to any property lookup (used in testing).",
        "**Security**: Creating 'Revocable' proxies that can be disabled at any time."
    ],

    memoryModel: `### **The Interception Layer**

**1. Proxy Overhead:**
- A Proxy is a wrapper object in the **Heap** that holds a reference to the **Target** and the **Handler**.
- Every access through the proxy requires a **CPU context switch** to execute the handler trap logic.

**2. Hidden Classes:**
- Proxies can be slower than standard objects because they prevent the engine from using "Inline Caching" or standard "Hidden Class" optimizations.

**3. Reference Identity:**
- \`proxy !== target\`. They are two different objects in **RAM**. 
- **Rule:** Be careful when comparing identities in code that uses proxies.`,

    visualizationType: 'variables'
};

export default metaprogramming;

