const iterationProtocols = {
    definition: "JavaScript's **Iteration Protocols** allow any object to define or customize its iteration behavior. The **Iterable** protocol allows objects to be used in `for...of` loops, while the **Iterator** protocol defines how values are produced.",

    syntax: `// 1. The Iterator Protocol
// An object with a next() method
const iterator = {
  next() {
    return { value: 1, done: false };
  }
};

// 2. The Iterable Protocol
// An object with [Symbol.iterator]
const myIterable = {
  [Symbol.iterator]() {
    return iterator;
  }
};
`,

    examples: [
        {
            code: `// 1. Custom Range Iterator
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    this.current = this.from;
    return this;
  },
  next() {
    if (this.current <= this.to) {
      return { done: false, value: this.current++ };
    } else {
      return { done: true };
    }
  }
};

for (let num of range) {
  console.log(num); // 1, 2, 3
}`,
            explanation: "By implementing `[Symbol.iterator]`, we make the `range` object compatible with `for...of`, even though it's not an Array."
        },
        {
            code: `// 2. String Iteration
const str = "Hi";
const iter = str[Symbol.iterator]();

console.log(iter.next()); // { value: 'H', done: false }
console.log(iter.next()); // { value: 'i', done: false }
console.log(iter.next()); // { value: undefined, done: true }`,
            explanation: "Strings are built-in iterables. You can manually request their iterator and 'walk' through the characters one by one."
        },
        {
            code: `// 3. Spread & Iteration
const nums = [1, 2];
const doubled = [...nums, 3]; // Uses iteration protocol

// The spread operator (...) works on ANY iterable, 
// not just arrays!`,
            explanation: "Many modern JS features like spread and destructuring rely internally on these protocols to fetch data from objects."
        }
    ],

    useCases: [
        "**Custom Collections**: Creating trees or linked lists that can be looped over.",
        "**Infinite Streams**: Generating numbers on-the-fly without storing them in memory.",
        "**Lazy Evaluation**: Calculating values only when they are requested by the loop.",
        "**Compatibility**: Making your custom data structures work with standard JS tools like `Array.from()`."
    ],

    memoryModel: `### **Memory & State**

**1. Iterator State:**
- The Iterator maintains its **Internal State** (like \`this.current\`) in the **Heap**.
- Unlike an Array, it doesn't need to store all items at once. It only stores the **Current Index**.

**2. Symbolic Lookup:**
- \`Symbol.iterator\` is a unique key in the **RAM**. 
- Using a Symbol prevents collisions with other property names on your object.

**3. CPU Overhead:**
- Each step of a \`for...of\` loop involves a function call to \`next()\`. 
- **Performance:** For high-frequency loops, standard \`for\` loops with indices are faster because they avoid the overhead of the Iterator object and function calls.`,

    visualizationType: 'arrays'
};

export default iterationProtocols;

