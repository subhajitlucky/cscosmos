const classes = {
    definition: "**Classes** (ES6) are 'syntactic sugar' over JS's existing prototypal inheritance. They provide a cleaner, more organized way to create blueprints, handle inheritance, and define methods.",

    syntax: `// 1. Definition
class User {
  constructor(name) {
    this.name = name;
  }

  // Method (lives on prototype)
  sayHi() {
    console.log("Hi " + this.name);
  }
}

// 2. Inheritance
class Admin extends User {
  constructor(name, level) {
    super(name); // Call parent constructor
    this.level = level;
  }
}
`,

    examples: [
        {
            code: `// 1. Public vs Private Fields
class Account {
  balance = 0;      // Public field
  #pin = 1234;      // Private field (# prefix)

  deposit(val) {
    this.balance += val;
  }

  getSecret() {
    return this.#pin;
  }
}

const myAcc = new Account();
console.log(myAcc.balance); // 0
// console.log(myAcc.#pin); // ❌ Syntax Error!`,
            explanation: "Modern JS classes support **Private Fields** (using `#`). They cannot be accessed outside the class, providing true encapsulation."
        },
        {
            code: `// 2. Static Members
class MathUtils {
  static PI = 3.14;

  static double(n) {
    return n * 2;
  }
}

console.log(MathUtils.PI); // 3.14
// const mu = new MathUtils();
// console.log(mu.PI); // undefined`,
            explanation: "`static` properties and methods belong to the **Class itself**, not the instances. They are used for utility functions that don't need instance data."
        },
        {
            code: `// 3. Getters and Setters
class Person {
  constructor(name) { this._name = name; }

  get name() { return this._name.toUpperCase(); }
  set name(val) { this._name = val; }
}

const p = new Person("subhajit");
console.log(p.name); // "SUBHAJIT"`,
            explanation: "Getters and setters allow you to run logic when a property is accessed or modified, while keeping the external API looking like a simple property."
        }
    ],

    useCases: [
        "**Object-Oriented Programming (OOP)**: Building large, scalable applications with clear hierarchies.",
        "**UI Components**: Defining parts of a web app (like in React or Web Components).",
        "**Data Buffers**: Managing complex state or streaming data.",
        "**Encapsulation**: Using private fields to protect sensitive logic or internal state."
    ],

    memoryModel: `### **Class Memory Layout**

**1. Function Object:**
- In the **Heap**, a Class is actually stored as a **Function object**.
- Methods defined inside the class are automatically attached to the Class's \`prototype\` object.

**2. Private Fields Storage:**
- Private fields (\`#\`) are stored in a hidden **WeakMap-like** internal storage in the engine.
- They do not show up when you log the object or use \`Object.keys()\`, making them invisible to the rest of the **RAM**.

**3. Inheritance Chain:**
- When a class \`extends\` another, the engine creates a link between the child Class object and the parent Class object. 
- **Hardware:** The \`super()\` call handles the logic of initializing the parent's memory layout before the child's.`,

    visualizationType: 'variables'
};

export default classes;

