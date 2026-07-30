/* eslint-disable */
const thisBinding = {
    definition: "The **\`this\`** keyword is a reference to the **object** that is currently executing the function. Its value is not static; it depends entirely on **how** the function is called, not where it is defined.",

    syntax: `// 1. Global Context
console.log(this); // window (in browsers)

// 2. Object Method
const obj = {
  name: "JSViz",
  log() { console.log(this.name); }
};
obj.log(); // "JSViz"

// 3. Simple Function Call
function test() { console.log(this); }
test(); // window (or undefined in strict mode)

// 4. Arrow Functions
const arrow = () => console.log(this);
// 'this' is inherited from outer scope
`,

    examples: [
        {
            code: `// 1. Implicit Binding (The Object before the Dot)
const person = {
  name: "Subhajit",
  greet() {
    console.log("Hi, I am " + this.name);
  }
};

person.greet(); // "this" is person`,
            explanation: "When a function is called as a method of an object, `this` is bound to that object (the 'left of the dot' rule)."
        },
        {
            code: `// 2. Explicit Binding (Lost Context)
const person = {
  name: "Alex",
  greet() { console.log(this.name); }
};

const looseGreet = person.greet;
looseGreet(); // undefined (or Error in strict mode)`,
            explanation: "Assigning a method to a variable 'loses' its connection to the original object. When called, `this` reverts to the global object or `undefined`."
        },
        {
            code: `// 3. New Binding (Constructors)
function User(name) {
  this.name = name;
}

const me = new User("JS Learner");
console.log(me.name); // "JS Learner"`,
            explanation: "When using the `new` keyword, JS creates a brand new object and binds `this` to it inside the function."
        },
        {
            code: `// 4. Lexical this (Arrow Functions)
const group = {
  title: "Devs",
  members: ["A", "B"],
  show() {
    this.members.forEach((m) => {
      console.log(this.title + ": " + m);
    });
  }
};

group.show(); // ✅ Works perfectly`,
            explanation: "Arrow functions do not have their own `this`. They capture it from the code that surrounds them (lexical scope). This is why they are great for callbacks inside methods."
        }
    ],

    useCases: [
        "**Object methods**: Accessing other properties or methods within the same object.",
        "**Event Listeners**: In regular functions, `this` refers to the DOM element that received the event.",
        "**Constructors**: Initializing new instances of a class or function.",
        "**Callbacks**: Using arrow functions to maintain context without needing `.bind(this)`."
    ],

    memoryModel: `### **'this' in the Engine**

**1. Execution Context Property:**
- Every **Execution Context** has a special property called \`this\`.
- This value is determined during the **Creation Phase** of the context.

**2. Dynamic Resolution:**
- For regular functions, the engine looks at the **Call Site** (how the function was invoked) to set the \`this\` pointer in the **Stack Frame**.

**3. Lexical Capture:**
- For **Arrow Functions**, the engine doesn't set a \`this\` property in the local frame. 
- Instead, it "walks" the **Scope Chain** to find the nearest outer \`this\` value, just like it does for variables.

**4. Performance:**
- Accessing \`this\` is a fast pointer lookup in the **RAM**. However, frequently changing context via \`.bind()\` creates a new function object in the **Heap**, which adds overhead.`,

    visualizationType: 'callstack'
};

export default thisBinding;

