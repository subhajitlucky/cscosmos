const typeCoercion = {
    definition: "**Coercion** is the automatic or implicit conversion of values from one data type to another. Understanding how JS converts types is critical for mastering equality checks (`==` vs `===`) and avoiding hidden bugs.",

    syntax: `// 1. Explicit Conversion
Number("42");   // 42
String(100);    // "100"
Boolean(1);     // true

// 2. Implicit Coercion (Avoid!)
"5" + 5;        // "55" (Number to String)
"5" - 5;        // 0 (String to Number)
if ("") { ... } // "" is Falsy

// 3. Truthy vs Falsy
// Falsy: false, 0, "", null, undefined, NaN
// Truthy: Everything else! (including {}, [], "0")
`,

    examples: [
        {
            code: `// 1. Comparison Trap
console.log(false == 0);  // true
console.log("" == 0);     // true
console.log([] == 0);     // true

console.log(false === 0); // false (Correct!)
console.log("" === 0);    // false`,
            explanation: "Loose equality `==` tries to force types to match. Strict equality `===` checks both value and type. **Always use `===`.**"
        },
        {
            code: `// 2. Addition vs Subtraction
console.log(10 + "5"); // "105" (String concatenation wins)
console.log(10 - "5"); // 5 (Numeric subtraction wins)

console.log(10 + true);  // 11 (true becomes 1)
console.log(10 + false); // 10 (false becomes 0)`,
            explanation: "The `+` operator overloaded for strings causes many bugs. If either operand is a string, JS converts the other to a string. Other math operators like `-` or `*` always convert to numbers."
        },
        {
            code: `// 3. Explicit Boolean conversion
const value = "Hello";

if (!!value) {
  console.log("Value exists!");
}

// Same as:
if (Boolean(value)) { ... }`,
            explanation: "Using `!!` (double not) is a common shorthand to convert any value to its boolean equivalent."
        }
    ],

    useCases: [
        "**Input Validation**: Converting strings from `<input>` fields into Numbers for calculation.",
        "**Conditionals**: Checking if a variable exists (is truthy) before using it.",
        "**Safe Equality**: Using strict equality to ensure types haven't changed unexpectedly.",
        "**Formatting**: Explicitly converting numbers or dates to strings for display."
    ],

    memoryModel: `### **Coercion in Memory**

**1. ToPrimitive:**
- When an object is compared or added, JS calls an internal \`ToPrimitive\` abstract operation.
- This creates a temporary primitive value in the **Stack** just for the calculation.

**2. Type Table:**
- The JS Engine maintains a mapping of how types convert (e.g., \`null\` becomes \`0\` in math, but \`false\` in boolean logic).
- These conversions happen fast in the **CPU** registers during execution.

**3. Safety:**
- Avoid "magic" coercion. It makes code harder to read and harder for the JS Engine to optimize. 
- **Performance Tip:** Engines like V8 optimize code that maintains consistent types. Mixing types (\`int\` + \`string\`) can lead to "de-optimization."`,

    visualizationType: 'variables'
};

export default typeCoercion;

