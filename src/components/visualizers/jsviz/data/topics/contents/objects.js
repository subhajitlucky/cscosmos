const objects = {
    definition: "Objects are collections of related data and functionality. They store data in **key-value pairs**, where keys (properties) are strings/symbols and values can be any type.",

    syntax: `// 1. Literal Creation
const user = {
  name: "Alex",
  age: 30,
  "last name": "Smith" // Space requires quotes
};

// 2. Property Access
user.name;           // Alex (Dot notation)
user["last name"];   // Smith (Bracket notation)

// 3. Shorthand Syntax (ES6)
const x = 10, y = 20;
const point = { x, y }; // instead of {x: x, y: y}
`,

    examples: [
        {
            code: `// 1. Dynamic Property Access
const obj = { apple: 5, banana: 10 };
const fruit = "apple";

console.log(obj.fruit); // undefined (Looks for key named "fruit")
console.log(obj[fruit]); // 5 (Looks for value of fruit variable)`,
            explanation: "Use bracket notation `[]` when the property name is stored in a variable or contains special characters/spaces."
        },
        {
            code: `// 2. Computed Property Names
const key = "status";
const task = {
  id: 1,
  [key]: "pending" // Sets task.status
};

console.log(task.status); // "pending"`,
            explanation: "ES6 allows you to use square brackets inside the object literal to set a key dynamically."
        },
        {
            code: `// 3. Destructuring
const person = { name: "Bob", age: 25 };
const { name, age } = person;

console.log(name, age); // "Bob", 25`,
            explanation: "Destructuring is a clean way to extract multiple properties from an object into variables."
        }
    ],

    useCases: [
        "**Data Modeling**: Representing a User, a Product, or a configuration object.",
        "**Grouping**: Grouping functions (methods) that belong to the same logical unit.",
        "**Lookup Tables**: Using objects instead of long `if/else` or `switch` chains.",
        "**API Responses**: Almost all modern web APIs send data as JSON objects."
    ],

    memoryModel: `### **Objects in Memory**

**1. Heap Storage:**
- Objects are always stored in the **Heap**.
- Because objects can grow (add properties) or shrink (delete properties), they need the unstructured space of the Heap.

**2. References:**
- The variable doesn't hold the object; it holds a **memory address** (pointer).
- Two variables can point to the same object in the Heap.

**3. Hidden Classes (V8 Optimization):**
- Modern JS engines (like Chrome's V8) create "hidden classes" internally to optimize property lookups. 
- **Performance Tip:** Try to initialize all object properties in the constructor or literal so the "shape" of the object doesn't change frequently.`,

    visualizationType: 'variables'
};

export default objects;

