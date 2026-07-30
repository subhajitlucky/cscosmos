const functionBasics = {
    definition: "Functions are reusable blocks of code. In JavaScript, functions are **first-class citizens**, meaning they can be stored in variables, passed as arguments, and returned from other functions.",

    syntax: `// 1. Function Declaration
function greet(name) {
  return "Hello " + name;
}

// 2. Function Expression
const sum = function(a, b) {
  return a + b;
};

// 3. Arrow Function
const square = (x) => x * x;

// 4. Calling a function
const val = sum(5, 10);
`,

    examples: [
        {
            code: `// 1. Declarations are Hoisted
console.log(sayHi()); // "Hi!" ✅ Works

function sayHi() {
  return "Hi!";
}

// Expressions are NOT hoisted
// console.log(sum(1, 2)); // ❌ ReferenceError
const sum = (a, b) => a + b;`,
            explanation: "Function declarations are moved to the top of their scope during the creation phase. Expressions are not, behaving like any other variable."
        },
        {
            code: `// 2. Default Parameters
function setRole(user, role = 'guest') {
  console.log(\`User \${user} is a \${role}\`);
}

setRole("Subhajit", "admin"); // "Subhajit is a admin"
setRole("Alex");              // "Alex is a guest"`,
            explanation: "Default parameters allow you to initialize functions with values if no argument or `undefined` is passed."
        },
        {
            code: `// 3. Recursion
function factorial(n) {
  if (n === 1) return 1; // Base case
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120`,
            explanation: "A function can call itself. This is called recursion. You must always have a **base case** to prevent an infinite loop (Stack Overflow)."
        }
    ],

    useCases: [
        "**DRY (Don't Repeat Yourself)**: Move repeated code into a function.",
        "**Encapsulation**: Hide logic and only expose the result.",
        "**Event Listeners**: Passing a function to be called when a button is clicked.",
        "**Asynchronous Code**: Passing functions (callbacks) to be executed after data is fetched."
    ],

    memoryModel: `### **Functions in Memory**

**1. Allocation:**
- Function code is stored in the **Heap** as a complex object.
- The function name holds a **pointer** to that object.

**2. Execution (The Call Stack):**
- Every time a function is **invoked**, a new **Execution Context** (Stack Frame) is pushed onto the **Stack**.
- This frame holds the function's arguments and local variables.
- When the function returns, the frame is **popped** off, and memory for local variables is freed.

**3. Stack Overflow:**
- If too many functions are called (e.g., deep recursion without a base case), the **Stack** runs out of memory, causing a "Maximum call stack size exceeded" error.`,

    visualizationType: 'callstack'
};

export default functionBasics;

