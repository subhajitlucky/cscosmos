const dataTypes = {
    title: "Data Types & Memory Model",
    subtitle: "Primitives vs. Reference Types in Memory",
    definition: "JavaScript has two data categories: Primitives (stored directly by value on the Call Stack) and Objects (stored dynamically on the Memory Heap and accessed via pointers). Primitives copy as independent values; objects share reference pointers.",
    
    // Core Architecture
    architecture: {
        headline: "Stack (By Value) vs. Heap (By Reference)",
        intro: "How JavaScript allocates and accesses data in memory:",
        primitives: {
            title: "The 7 Primitives",
            badge: "Stack // By Value",
            description: "Stored directly in the Call Stack frame. Copying a primitive creates an independent duplicate.",
            punchline: "Modifying one variable never affects another.",
            traits: [
                "Stored on the Stack",
                "Copied by Value",
                "Immutable in memory"
            ]
        },
        objects: {
            title: "Objects & Reference Types",
            badge: "Heap // By Reference",
            description: "Allocated in the Memory Heap. Stack variables only store a 64-bit address pointer.",
            punchline: "Copying duplicates the pointer; both variables point to the same object.",
            traits: [
                "Stored in the Heap",
                "Copied by Reference",
                "Mutable in-place"
            ]
        }
    },

    // Compact Comparison Matrix
    comparisonTable: [
        {
            feature: "Where Stored",
            primitive: "Call Stack (Fast, contiguous)",
            object: "Memory Heap (Dynamic pool)"
        },
        {
            feature: "Variable Holds",
            primitive: "The direct value (e.g. 42)",
            object: "Memory address pointer (0x4F12)"
        },
        {
            feature: "Copying (b = a)",
            primitive: "Independent value copy",
            object: "Shared reference pointer"
        },
        {
            feature: "In-Place Mutability",
            primitive: "Immutable (values cannot be altered)",
            object: "Mutable (properties can change)"
        }
    ],

    // The Complete Type Catalog
    typeCatalog: {
        headline: "The JavaScript Type System",
        subheadline: "7 Primitives (Value types) + 1 Reference Type (Object).",
        primitives: {
            name: "The 7 Primitives",
            description: "Stored by value on the stack.",
            types: [
                { name: "Number", badge: "64-bit / Smi", example: "42, 3.14", explain: "Double-precision float. V8 optimizes 31-bit integers as Smi." },
                { name: "String", badge: "UTF-16", example: '"hello"', explain: "Immutable text sequence. Editing characters in-place fails silently." },
                { name: "Boolean", badge: "1-Bit", example: "true, false", explain: "Logical truth flags used in conditional evaluations." },
                { name: "Undefined", badge: "Default", example: "undefined", explain: "Default value for unassigned variables and missing properties." },
                { name: "Null", badge: "Absence", example: "null", explain: "Intentional empty value. (typeof null === 'object' is a legacy 1995 bug)." },
                { name: "BigInt", badge: "Arbitrary", example: "9007199254740995n", explain: "Integers beyond Number.MAX_SAFE_INTEGER (2^53 - 1)." },
                { name: "Symbol", badge: "Unique", example: "Symbol('id')", explain: "Guaranteed unique, collision-free object property keys." }
            ]
        },
        objects: {
            name: "Reference Types",
            description: "Allocated in the heap.",
            types: [
                { name: "Object {}", badge: "Hashmap", example: '{ name: "Alice" }', explain: "Key-value collection stored dynamically on the heap." },
                { name: "Array []", badge: "List", example: '["A", "B", "C"]', explain: "Ordered collection with dynamic length and indexed access." },
                { name: "Function ()", badge: "Callable", example: '() => "ready"', explain: "Executable object instance retaining lexical scope closure." }
            ]
        }
    },

    // 4 Quick Stepper Steps
    stepperSteps: [
        {
            stepNumber: 1,
            label: "Create Primitive",
            code: "let a = 10;",
            fullCode: "let a = 10;",
            explanation: "Allocates stack slot 'a' holding value 10."
        },
        {
            stepNumber: 2,
            label: "Copy Primitive",
            code: "let b = a; b = 20;",
            fullCode: "let a = 10;\nlet b = a;\nb = 20;",
            explanation: "'b' gets an independent copy. 'a' is still 10."
        },
        {
            stepNumber: 3,
            label: "Create Object",
            code: "let user1 = { name: 'Alice' };",
            fullCode: "let a = 10;\nlet user1 = { name: 'Alice' };",
            explanation: "Allocates object in heap at 0x4F12. 'user1' holds the pointer."
        },
        {
            stepNumber: 4,
            label: "Shared Mutation",
            code: "let user2 = user1; user2.name = 'Bob';",
            fullCode: "let user1 = { name: 'Alice' };\nlet user2 = user1;\nuser2.name = 'Bob';",
            explanation: "'user2' shares pointer 0x4F12. 'user1.name' is now 'Bob'."
        }
    ],

    // 2 Essential Common Traps
    goldenRules: [
        {
            title: "Trap 1: Shared Reference Mutation",
            trapCode: `const a = { role: "admin" };
const b = a; // Copies the pointer, not the object!
b.role = "guest";

console.log(a.role); // "guest" (Mutated!)

// Fix: Use shallow clone or deep clone:
const safeB = { ...a };`,
            why: "Object assignment copies only the memory pointer. Use spread {...} to copy shallow properties independently."
        },
        {
            title: "Trap 2: String Immutability",
            trapCode: `let str = "hello";
str[0] = "H"; // Silently fails!

console.log(str); // "hello" (Unchanged)

// Fix: Construct a new string:
str = "H" + str.slice(1); // "Hello"`,
            why: "Primitives cannot be modified in-place. Replace the whole variable with a new value instead."
        }
    ],

    // 2 Quick Quiz Questions
    quiz: [
        {
            id: "q1",
            question: "What is logged to the console?",
            code: `let x = 50;
let y = x;
y = 100;
console.log(x);`,
            options: [
                { text: "50", correct: true, explanation: "Numbers are primitives (copied by value). Modifying y does not affect x." },
                { text: "100", correct: false, explanation: "y received an independent copy of 50." }
            ]
        },
        {
            id: "q2",
            question: "What is logged to the console?",
            code: `const item1 = { count: 1 };
const item2 = item1;
item2.count = 5;
console.log(item1.count);`,
            options: [
                { text: "5", correct: true, explanation: "Objects are reference types. Both variables share the same heap memory." },
                { text: "1", correct: false, explanation: "item1 and item2 point to the exact same object in the heap." }
            ]
        }
    ],

    syntax: `// Primitives (Stored by value on stack)
const count = 42;
const text = "JS";
const ready = true;

// Reference Types (Stored by reference in heap)
const user = { id: 1 };
const list = [1, 2, 3];
`,

    examples: [
        {
            title: "Primitives by Value vs. Objects by Reference",
            code: `// 1. Primitive: Independent copies
let num1 = 10;
let num2 = num1;
num2 = 99;
console.log(num1); // 10 (Safe)

// 2. Object: Shared reference
let userA = { name: "Sam" };
let userB = userA;
userB.name = "Alex";
console.log(userA.name); // "Alex" (Shared pointer!)`,
            explanation: "Primitives create independent copies on the stack; objects share a single heap memory address."
        }
    ],

    useCases: [
        "**State Immutability (React)**: Always clone objects ({ ...state }) so component re-render checks detect state updates.",
        "**Memory Efficiency**: Use primitives for counters and flags to avoid heap allocation and garbage collection overhead."
    ],

    memoryModel: `\`\`\`
  CALL STACK (Fast / By Value)          MEMORY HEAP (Dynamic / By Reference)
┌──────────────┬───────────────┐     ┌───────────────────────────────────┐
│ Variable     │ Stack Slot    │     │ Heap Address: 0x4F12              │
├──────────────┼───────────────┤     │                                   │
│ num1         │ 10            │     │ { name: "Alex" }                  │
│ userA        │ 0x4F12 ───────┼─────┼────────▲                          │
│ userB        │ 0x4F12 ───────┼─────┼────────┘ (Shared reference)       │
└──────────────┴───────────────┘     └───────────────────────────────────┘
\`\`\``
};

export default dataTypes;
