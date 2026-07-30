const variablesContent = {
    definition: "Variables are containers for storing data values in JavaScript. They act as named references to values in memory.",

    syntax: `// ES6 (Modern)
let variableName = value;      // Block-scoped, reassignable
const constantName = value;    // Block-scoped, not reassignable
    
// Legacy
var oldVariable = value;       // Function-scoped, avoid in modern code`,

    examples: [
        {
            code: `// let - mutable variable
let age = 25;
age = 26; // ✓ Works
console.log(age); // 26`,
            explanation: "let allows reassignment and is block-scoped"
        },
        {
            code: `// const - immutable binding
const PI = 3.14159;
// PI = 3.14; // ✗ Error!
console.log(PI); // 3.14159`,
            explanation: "const prevents reassignment, use for values that won't change"
        },
        {
            code: `// var - function scoped (avoid)
function testVar() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (leaked out of block!)
}`,
            explanation: "var is function-scoped and hoisted, can cause bugs"
        }
    ],

    useCases: [
        "Use **const** by default for values that won't be reassigned",
        "Use **let** when you need to reassign (counters, accumulators)",
        "Avoid **var** in modern JavaScript to prevent scope-related bugs",
        "Use descriptive names: `userAge` instead of `x` or `temp`"
    ],

    memoryModel: `**Stack Memory:**
- Variable names are stored as references
- Primitives (numbers, strings) are stored directly in stack
- Objects/arrays store a reference (pointer) to heap memory

**Example:**
let x = 5;           // Stack: x → 5
let obj = {a: 1};    // Stack: obj → [heap address]
                     // Heap: {a: 1}`,

    visualizationType: 'variables'
};

export default variablesContent;

