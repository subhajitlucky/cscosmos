const functionMethods = {
    definition: "JavaScript provides three powerful methods—**call**, **apply**, and **bind**—that allow you to explicitly set the value of `this` for a function, regardless of how or where it is invoked.",

    syntax: `const obj = { name: "Alice" };
function greet(city, country) { ... }

// 1. .call(context, arg1, arg2...)
greet.call(obj, "Paris", "France");

// 2. .apply(context, [argsArray])
greet.apply(obj, ["Paris", "France"]);

// 3. .bind(context, arg1...)
const boundGreet = greet.bind(obj);
boundGreet("Paris", "France"); // Invoked later
`,

    examples: [
        {
            code: `// 1. Method Borrowing
const runner = {
  name: "Bolt",
  logSpeed(speed) {
    console.log(\`\${this.name} runs at \${speed}km/h\`);
  }
};

const car = { name: "Tesla" };

// Borrow logSpeed for the car
runner.logSpeed.call(car, 120); // "Tesla runs at 120km/h"`,
            explanation: "`.call()` allows an object to use a method belonging to another object without rewriting the code."
        },
        {
            code: `// 2. Using apply for Arrays
const nums = [5, 6, 2, 3, 7];

// Math.max expects separate arguments, not an array
const max = Math.max.apply(null, nums);
console.log(max); // 7

// Modern equivalent: Math.max(...nums)`,
            explanation: "`.apply()` is similar to `.call()`, but it takes arguments as an array. It was very useful before the Spread operator (`...`) existed."
        },
        {
            code: `// 3. Permanently binding context
const counter = {
  count: 0,
  inc() { 
    this.count++; 
    console.log(this.count);
  }
};

const buttonInc = counter.inc.bind(counter);

// Even when called loosely, 'this' stays fixed
setTimeout(buttonInc, 1000); // 1`,
            explanation: "`.bind()` returns a **new function** with the context permanently set. It's the standard way to fix the 'lost context' bug in callbacks."
        }
    ],

    useCases: [
        "**Context Management**: Forcing a function to work with a specific object.",
        "**Partial Application**: Passing some arguments now via `.bind()` and the rest later.",
        "**Legacy Interop**: Converting array-like objects (like `arguments`) into real arrays.",
        "**Event Handling**: Ensuring methods in a class-based component maintain the class instance as `this`."
    ],

    memoryModel: `### **Behind the Scenes**

**1. Function Prototype:**
- These methods live on \`Function.prototype\` in the **Heap**.
- Every function has access to them via the **Prototype Chain**.

**2. New Object Allocation:**
- **.bind():** Creates a **new function object** in the **Heap**. This new object wraps the original function and holds a hidden reference to the bound context.
- **.call() / .apply():** Do not create new functions; they immediately invoke the original function with a modified **Stack Frame**.

**3. Performance:**
- **.call()/.apply()** are very efficient.
- **.bind()** should be used carefully in loops or frequently rendered components (like React) because each call allocates new memory in the **RAM**.`,

    visualizationType: 'callstack'
};

export default functionMethods;

