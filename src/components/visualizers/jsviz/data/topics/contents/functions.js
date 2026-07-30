const functionsContent = {
    definition: "Functions are reusable blocks of code that perform specific tasks. They are first-class citizens in JavaScript, meaning they can be assigned to variables, passed as arguments, and returned from other functions.",

    syntax: `// Function Declaration
function functionName(parameters) {
  // code block
  return value;
}

// Function Expression
const funcName = function(parameters) {
  return value;
};

// Arrow Function (ES6)
const arrowFunc = (parameters) => {
  return value;
};

// Concise Arrow Function
const add = (a, b) => a + b;`,

    examples: [
        {
            code: `// Function Declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('Alice')); // "Hello, Alice!"`,
            explanation: "Classic function syntax, hoisted to top of scope"
        },
        {
            code: `// Arrow Function
const multiply = (a, b) => a * b;
const square = x => x * x;

console.log(multiply(3, 4)); // 12
console.log(square(5));      // 25`,
            explanation: "Arrow functions have shorter syntax and lexical 'this'"
        },
        {
            code: `// Higher-Order Function
const applyOperation = (x, y, operation) => {
  return operation(x, y);
};

const result = applyOperation(5, 3, (a, b) => a + b);
console.log(result); // 8`,
            explanation: "Functions can accept other functions as parameters"
        }
    ],

    useCases: [
        "**Code Reusability**: Write once, use multiple times",
        "**Abstraction**: Hide complex logic behind simple function calls",
        "**Event Handlers**: DOM events, button clicks, form submissions",
        "**Array Methods**: map, filter, reduce for data transformation",
        "**Async Operations**: Callbacks, promises, async/await"
    ],

    memoryModel: `**Call Stack:**
Each function call creates a new execution context on the stack

**Example:**
function add(a, b) {
  return a + b;
}
function calculate() {
  const result = add(5, 3);
  return result;
}
calculate();

**Stack Frames:**
1. Global Execution Context
2. calculate() pushed
3. add(5, 3) pushed
4. add returns, popped
5. calculate returns, popped
6. Back to global`,

    visualizationType: 'callstack'
};

export default functionsContent;

