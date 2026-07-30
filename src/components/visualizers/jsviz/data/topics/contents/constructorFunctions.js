/* eslint-disable */
const constructorFunctions = {
    definition: "**Constructor Functions** are regular functions used with the **\`new\`** keyword to create multiple instances of a similar object. They act as blueprints for building objects before the \`class\` syntax was introduced.",

    syntax: `// 1. Definition
function User(name, age) {
  // 'this' is automatically created
  this.name = name;
  this.age = age;
  // 'this' is automatically returned
}

// 2. Instance Creation
const user1 = new User("Subhajit", 25);
const user2 = new User("Alex", 30);
`,

    examples: [
        {
            code: `// 1. Prototype Methods (Memory Safe)
function Car(make) {
  this.make = make;
}

// Add method to prototype, not every instance
Car.prototype.start = function() {
  console.log(this.make + " is starting...");
};

const myCar = new Car("Toyota");
myCar.start();`,
            explanation: "Defining methods inside the constructor (using `this.start = ...`) creates a new function for every object. Putting them on the `.prototype` stores the function only once in memory, which is much more efficient."
        },
        {
            code: `// 2. The 'new' keyword steps
// When you run: new User("Subhajit")
// 1. A new empty object is created {}
// 2. [[Prototype]] is linked to User.prototype
// 3. 'this' is bound to the new object
// 4. The function executes
// 5. The object is returned`,
            explanation: "The `new` keyword does a lot of work under the hood to ensure the object is properly linked and initialized."
        },
        {
            code: `// 3. Forgetting 'new' (Danger!)
function Person(name) {
  this.name = name;
}

// const bob = Person("Bob"); 
// console.log(window.name); // "Bob" (Leaked to global!)`,
            explanation: "If you forget `new`, `this` points to the global object (or `undefined` in strict mode), causing bugs and "
        }
    ],

    useCases: [
        "**Object Blueprints**: Creating many users, products, or game entities.",
        "**Stateful Logic**: Storing data and behavior together in reusable units.",
        "**Legacy Codebases**: Many older JS libraries (Pre-2015) rely heavily on constructors.",
        "**Custom Errors**: Extending the built-in `Error` object."
    ],

    memoryModel: `### **Allocation & Linking**

**1. The 'prototype' Property:**
- Every function has a \`.prototype\` object created automatically in the **Heap**.
- This object holds the shared methods for all instances created by that constructor.

**2. Instance Linking:**
- When \`new\` is called, the engine allocates space in the **Heap** for the new instance.
- It adds a hidden **[[Prototype]]** pointer from the instance back to the constructor's \`prototype\` object.

**3. Reference Overhead:**
- Instance properties (e.g., \`this.name\`) are stored **on the object** in memory.
- Prototype methods are stored **externally** and accessed via a pointer.
- **Hardware:** This approach balances fast access (for local properties) with low memory usage (for shared methods).`,

    visualizationType: 'variables'
};

export default constructorFunctions;

