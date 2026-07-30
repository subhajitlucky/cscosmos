const errors = {
    definition: "JavaScript provides a built-in **Error** object and the **try...catch...finally** block to handle runtime exceptions gracefully without crashing the entire application.",

    syntax: `// 1. Throwing an Error
throw new Error("Something went wrong");

// 2. Handling Errors
try {
  // Code that might fail
} catch (err) {
  // Handle the error
  console.log(err.name, err.message);
} finally {
  // Always runs
}

// 3. Custom Errors
class MyError extends Error { ... }
`,

    examples: [
        {
            code: `// 1. Specific Error Types
try {
  // decodeURIComponent("%"); // ❌ URIError
  // const x = y;            // ❌ ReferenceError
  // JSON.parse("{bad}");    // ❌ SyntaxError
} catch (err) {
  if (err instanceof ReferenceError) {
    console.log("Missing variable!");
  } else {
    console.log("General error:", err.message);
  }
}`,
            explanation: "JavaScript has specific built-in error types. Using `instanceof` allows you to handle different failures in different ways."
        },
        {
            code: `// 2. Re-throwing Errors
function process() {
  try {
    throw new Error("Database Fail");
  } catch (err) {
    console.log("Logging error internally...");
    throw err; // Send it up to the caller
  }
}

try {
  process();
} catch (e) {
  console.log("Caller caught:", e.message);
}`,
            explanation: "Sometimes you want to log an error but still let the calling function know that something went wrong."
        },
        {
            code: `// 3. The Power of Finally
function test() {
  try {
    return "Result";
  } finally {
    console.log("Cleanup complete");
  }
}

console.log(test());`,
            explanation: "Even if you `return` from inside the `try` block, the `finally` block **is guaranteed to run**. This is essential for closing files or database connections."
        }
    ],

    useCases: [
        "**Network Requests**: Handling timeouts or 404/500 responses from APIs.",
        "**JSON Parsing**: Safely parsing user-provided strings.",
        "**Form Input**: Validating data before sending it to a server.",
        "**Third-party Libraries**: Protecting your app from bugs in external dependencies."
    ],

    memoryModel: `### **Errors & The Stack**

**1. Stack Traces:**
- When an Error object is created, it captures the current state of the **Call Stack**.
- This 'trace' is stored as a string in the \`stack\` property in the **Heap**.

**2. Exception Propagation:**
- If an error isn't caught, it "bubbles up" the **Call Stack**. 
- Each frame is popped until a \`catch\` block is found. 
- If none is found, the engine terminates and prints the stack trace to the console.

**3. Performance:**
- Creating and throwing errors is relatively expensive (due to stack capture). 
- **Rule:** Use Errors for *exceptional* cases, not for regular control flow (like \`if/else\`).`,

    visualizationType: 'callstack'
};

export default errors;

