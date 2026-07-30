/* eslint-disable */
const propertyDescriptors = {
    definition: "**Property Descriptors** (or Attributes) are the internal configurations of an object's properties. They define whether a property can be changed, deleted, or enumerated. Using \`Object.defineProperty()\`, you can control the 'physics' of an object.",

    syntax: `// 1. Getting Descriptors
Object.getOwnPropertyDescriptor(obj, 'prop');

// 2. Defining Descriptors
Object.defineProperty(obj, 'prop', {
  value: 100,
  writable: false,    // Can value be changed?
  enumerable: false,  // Does it show up in loops?
  configurable: false // Can descriptor be changed/deleted?
});

// 3. Getters/Setters (Accessor Descriptors)
Object.defineProperty(obj, 'name', {
  get() { return this._name; },
  set(v) { this._name = v; }
});
`,

    examples: [
        {
            code: `// 1. Making a Constant Property
const config = {};
Object.defineProperty(config, "API_KEY", {
  value: "SECRET_123",
  writable: false,
  configurable: false
});

config.API_KEY = "HACKED"; // Silently fails (Error in strict mode)
console.log(config.API_KEY); // "SECRET_123"`,
            explanation: "By setting `writable: false`, you create a property that cannot be changed. This is how internal JS constants are often implemented."
        },
        {
            code: `// 2. Hidden Properties (Enumerable)
const user = { name: "Alex" };
Object.defineProperty(user, "internalId", {
  value: 999,
  enumerable: false // Hidden from loops
});

console.log(Object.keys(user)); // ["name"]
console.log(user.internalId);   // 999 (Still accessible!)`,
            explanation: "Non-enumerable properties are useful for metadata that you don't want to show up in JSON serialization or `for...in` loops."
        },
        {
            code: `// 3. Object Freezing
const obj = { x: 10 };
Object.freeze(obj); 

// Freezing sets all descriptors to writable: false 
// and configurable: false for EVERY property.
obj.x = 20; // Fails`,
            explanation: "`Object.freeze()` is a high-level utility that uses property descriptors under the hood to make an object immutable."
        }
    ],

    useCases: [
        "**Library Development**: Protecting internal state from user modification.",
        "**Frameworks**: Implementing reactivity (Vue 2 uses getters/setters to track changes).",
        "**Legacy Interop**: Emulating properties that behave like those in older JS versions.",
        "**Data Hardening**: Creating secure configuration objects."
    ],

    memoryModel: `### **Inside the Object**

**1. Descriptor Slots:**
- In the **Heap**, every object property isn't just a value. 
- It's a structure containing the **Value** and a bitmask of **Flags** (W, E, C).

**2. Accessor Descriptors:**
- Getters and Setters are stored as **pointers** to function objects in the **Heap**.
- When you access the property, the **CPU** doesn't just read memory; it executes the pointed-to function.

**3. V8 Performance:**
- Frequently changing descriptors can break the engine's \"Hidden Classes\" optimization. 
- **Rule:** Define your descriptors once at creation time for maximum performance in the **RAM**.`,

    visualizationType: 'variables'
};

export default propertyDescriptors;

