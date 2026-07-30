const security = {
    definition: "**Language-Level Security** in JS involves protecting your application from attacks that exploit language features, such as **Prototype Pollution**, **XSS**, and **Insecure Deserialization**.",

    syntax: `// 1. Hardening Objects
Object.freeze(obj);
Object.preventExtensions(obj);

// 2. Safe Object Creation
const safe = Object.create(null); // No prototype!

// 3. Strict Mode
"use strict";
`,

    examples: [
        {
            code: `// 1. Prototype Pollution
const maliciousPayload = JSON.parse('{"__proto__": {"isAdmin": true}}');
const target = {};

Object.assign(target, maliciousPayload);

console.log({}.isAdmin); // true! (Oops!)`,
            explanation: "Prototype pollution happens when an attacker can inject properties into the base `Object.prototype`. This can change the behavior of every object in your app."
        },
        {
            code: `// 2. Preventing Pollution
const db = Object.create(null); 

// Now 'db' has no __proto__. 
// Pollution cannot reach it.
db.user = "Subhajit";`,
            explanation: "Objects created with `Object.create(null)` don't inherit from `Object.prototype`. They are 'Pure Map' objects and are safe from prototype-based attacks."
        },
        {
            code: `// 3. Object Hardening
const CONFIG = { apiKey: "123" };
Object.freeze(CONFIG);

CONFIG.apiKey = "HACKED"; // No effect
console.log(CONFIG.apiKey); // "123"`,
            explanation: "`Object.freeze()` prevents any modification to an object. This is essential for protecting shared configuration or constants."
        }
    ],

    useCases: [
        "**Web Apps**: Sanitizing JSON data from untrusted users.",
        "**Library Dev**: Preventing users from breaking your library by polluting prototypes.",
        "**State Management**: Protecting the 'Redux' or 'Zustand' store from accidental mutations.",
        "**Sensitive Data**: Hardening objects that store secrets or API keys."
    ],

    memoryModel: `### **Protection Mechanisms**

**1. Immutable Buffers:**
- When an object is frozen, the engine marks its memory block as **Read-Only** in the **Heap**.
- Any write attempt triggers a trap that immediately stops the operation (and throws in Strict Mode).

**2. Slot Protection:**
- The engine can hide specific **Internal Slots** (like [[Prototype]]) from being accessed via standard string keys, preventing easy pollution.

**3. Execution Realms:**
- For maximum security, untrusted scripts should be run in a separate **Realm** (like a Worker or Sandboxed Iframe) so they cannot touch the Main Thread's **Global Object**.`,

    visualizationType: 'prototype'
};

export default security;

