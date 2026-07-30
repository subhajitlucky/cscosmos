/* eslint-disable */
const prototypeChain = {
    definition: "JavaScript uses **Prototypal Inheritance**. Every object has a hidden property (called **[[Prototype]]**) that points to another object. If a property isn't found on the current object, the engine looks up the 'chain' of prototypes until it finds it or reaches \`null\`.",

    syntax: `const parent = { greet: "Hello" };
const child = Object.create(parent);

console.log(child.greet); // "Hello" (from parent)

// Check prototype
Object.getPrototypeOf(child) === parent; // true
child.__proto__ === parent; // true (Legacy accessor)
`,

    examples: [
        {
            code: `// 1. Sharing Methods
const animal = {
  eat() { console.log("Eating..."); }
};

const dog = {
  bark() { console.log("Woof!"); }
};

Object.setPrototypeOf(dog, animal);

dog.bark(); // "Woof!"
dog.eat();  // "Eating..." (Inherited)`,
            explanation: "Instead of copying methods to every object (which wastes memory), objects can 'delegate' tasks to their prototypes."
        },
        {
            code: `// 2. The Chain End
const obj = {}; // Prototype: Object.prototype

console.log(obj.toString()); // ✅ Works!
console.log(Object.getPrototypeOf(Object.prototype)); // null`,
            explanation: "All objects eventually lead to `Object.prototype`, which is the base of everything. The very end of the chain is `null`."
        },
        {
            code: `// 3. Performance Trap
const child = Object.create(null); // No prototype!

// child.toString(); // ❌ Error! (Not a function)
console.log(child); // Truly empty object`,
            explanation: "You can create objects with NO prototype. This is useful for high-performance lookup tables where you don't want collisions with built-in properties like `toString`."
        }
    ],

    useCases: [
        "**Memory Optimization**: Sharing methods among many similar objects.",
        "**Inheritance**: Building hierarchies (e.g., a `Button` inheriting from `UIElement`).",
        "**Polyfills**: Adding modern features to older environments by modifying `Array.prototype` or `String.prototype`.",
        "**Frameworks**: Implementing state management or reactive systems."
    ],

    memoryModel: `### **The Chain in Memory**

**1. Reference Pointers:**
- Prototypes are not "copied." 
- Each object in the **Heap** has a small pointer (the **[[Prototype]]** link) to its parent object in the **Heap**.

**2. Property Lookup (Walking the Chain):**
- When you access a property, the **CPU** doesn't just check one memory address.
- It "walks" the chain: checks Object A → checks Object B → checks Object C.
- **Performance:** Deep chains (more than 3-4 levels) can noticeably slow down property access.

**3. Memory Efficiency:**
- By putting methods on the prototype, you store them **once** in the **RAM**, even if you have 1,000,000 instances of that object.`,

    visualizationType: 'scopechain'
};

export default prototypeChain;

