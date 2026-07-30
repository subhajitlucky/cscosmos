const math = {
    definition: "The **Math** object is a built-in static object that provides properties and methods for mathematical constants and functions. Unlike other objects, `Math` has no constructor; you use its methods directly.",

    syntax: `// 1. Constants
Math.PI;  // 3.14159...
Math.E;   // Euler's number

// 2. Rounding
Math.round(4.7); // 5 (Nearest)
Math.ceil(4.1);  // 5 (Up)
Math.floor(4.9); // 4 (Down)
Math.trunc(4.9); // 4 (Remove decimal)

// 3. Functions
Math.max(1, 5, 2); // 5
Math.random();     // 0 to 0.999...
Math.sqrt(16);     // 4
Math.pow(2, 3);    // 8
`,

    examples: [
        {
            code: `// 1. Random Number Generator
function getRandomInt(min, max) {
  // Math.random() is [0, 1)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(1, 10));`,
            explanation: "`Math.random()` returns a float. Multiplying by your range and using `Math.floor` is the standard way to get a random integer."
        },
        {
            code: `// 2. Clamping Values
const rawPower = 150;
const clamped = Math.min(Math.max(rawPower, 0), 100);

console.log(clamped); // 100`,
            explanation: "Clamping ensures a number stays within a range (here 0 to 100). `Math.max` sets the lower bound, and `Math.min` sets the upper bound."
        },
        {
            code: `// 3. Geometry & Trigonometry
const angle = 45;
const radians = angle * (Math.PI / 180);

console.log(Math.sin(radians).toFixed(4)); // 0.7071`,
            explanation: "The `Math` object is essential for graphics and game logic, providing `sin`, `cos`, `tan`, and `atan2` functions."
        }
    ],

    useCases: [
        "**Graphics**: Calculating coordinates for D3.js or Canvas animations.",
        "**Game Dev**: Handling randomness, gravity, and collision detection.",
        "**Data Analysis**: Finding min/max values in arrays.",
        "**UI/UX**: Rounding percentages or currency for display."
    ],

    memoryModel: `### **Optimization & Execution**

**1. Static Nature:**
- \`Math\` is a **Global Singleton** in the **Heap**. 
- It is created once when the engine starts and never duplicated.

**2. Native Performance:**
- Most \`Math\` methods are **built-ins** implemented in C++ or Assembly within the engine.
- When you call \`Math.sin()\`, the engine bypasses much of the standard JS interpretation and calls the CPU's **Math instruction set** directly.

**3. Precision:**
- \`Math\` operations use standard 64-bit precision. 
- **Rule:** For high-performance loops, avoid creating intermediate variables for math results to keep the **CPU Cache** hot and reduce **RAM** traffic.`,

    visualizationType: 'variables'
};

export default math;

