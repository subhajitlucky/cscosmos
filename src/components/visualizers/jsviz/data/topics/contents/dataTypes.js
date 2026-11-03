const dataTypes = {
    title: "Data Types & Values",
    subtitle: "The Foundation of All JavaScript Programs",
    definition: "Everything in JavaScript is a piece of data. Just like in the real world where you have words, numbers, and storage boxes, JavaScript sorts all data into two main families: **The 7 Primitives** (simple values) and **Objects** (containers).",
    
    // The 5-Year-Old Mental Model
    analogy: {
        headline: "The 5-Year-Old Mental Model: Sticky Notes vs. Locker Keys",
        intro: "To understand JavaScript data types, you only need to imagine two everyday things: a Sticky Note and a Train Station Locker Key.",
        primitives: {
            title: "Primitives = Sticky Notes in Your Pocket",
            badge: "Simple & Independent",
            description: "Imagine writing the number '42' on a tiny yellow sticky note and putting it in your pocket. If your friend asks for your number, you write '42' on a brand new sticky note and hand it to them.",
            punchline: "If your friend scribbles on their sticky note and changes it to '99', YOUR sticky note in your pocket STILL says '42'! You are completely independent.",
            traits: [
                "Stored directly in fast pocket memory (The Stack)",
                "Copied by Value (Everyone gets their own separate copy)",
                "Immutable (You can replace the note, but you can't mutate the number 42 into a 50)"
            ]
        },
        objects: {
            title: "Objects & Arrays = A Locker Key with a Locker Number",
            badge: "Shared Containers",
            description: "Now imagine a giant toy box. It's way too big to fit in your pocket! So it lives in a big storage room (The Heap). Inside your pocket, you only keep the Locker Key labeled '#Locker-402'.",
            punchline: "If you give your friend a copy of your key (let friend = me), you BOTH hold keys to the EXACT SAME LOCKER. If your friend opens Locker 402 and replaces the toy with a robot, you open Locker 402 with your key and see the robot too!",
            traits: [
                "The container lives in big storage (The Heap)",
                "Your variable only holds the Memory Address (The Key)",
                "Copied by Reference (Sharing the key means sharing the same contents)"
            ]
        }
    },

    // The Two Kingdoms Overview
    kingdoms: {
        headline: "The Two Kingdoms of JavaScript",
        subheadline: "Every single piece of data in JavaScript belongs to one of these two kingdoms.",
        kingdom1: {
            name: "Kingdom 1: The 7 Primitives",
            badge: "Values in Pockets",
            description: "Simple, lightweight, indestructible values. They cannot be modified in-place.",
            types: [
                { name: "Number", example: "42, 3.14, -5", explain: "Any integer or decimal number for math and counting." },
                { name: "String", example: '"Hello", \'JavaScript\'', explain: "Text wrapped in quotes. Words, letters, or sentences." },
                { name: "Boolean", example: "true or false", explain: "A light switch: either ON (true) or OFF (false)." },
                { name: "Undefined", example: "undefined", explain: "An empty slot. The computer says: 'I haven't been given a value yet!'" },
                { name: "Null", example: "null", explain: "A deliberate empty box. The developer says: 'I intentionally put nothing here!'" },
                { name: "BigInt", example: "9007199254740995n", explain: "Super-large integers that exceed normal Number size limits." },
                { name: "Symbol", example: "Symbol('id')", explain: "A guaranteed unique secret token that never collides with anything else." }
            ]
        },
        kingdom2: {
            name: "Kingdom 2: The Object Kingdom",
            badge: "Containers in Warehouses",
            description: "Complex structures that group multiple values together. They are mutable.",
            types: [
                { name: "Plain Object {}", example: '{ name: "Alice", age: 20 }', explain: "A labeled container of key-value pairs (like a contact card)." },
                { name: "Array []", example: '[10, 20, 30], ["Apple", "Orange"]', explain: "An ordered checklist of items indexed by position numbers (0, 1, 2)." },
                { name: "Function () {}", example: 'function greet() { ... }', explain: "A reusable recipe of actions that can be stored, passed, and executed." }
            ]
        }
    },

    // Guided Step-by-Step Phases
    phases: [
        {
            number: "01",
            title: "Phase 1: The Intuition",
            subtitle: "Sticky Notes vs. Locker Keys",
            summary: "Understand how simple values stay independent in memory, while complex objects share a single warehouse location."
        },
        {
            number: "02",
            title: "Phase 2: The Two Kingdoms",
            subtitle: "The 7 Primitives vs. Objects",
            summary: "Explore the exact 7 primitive types and see why arrays and functions are actually objects under the hood."
        },
        {
            number: "03",
            title: "Phase 3: Interactive Simulation",
            subtitle: "Watch the Stack & Heap in Real-Time",
            summary: "Run real JavaScript code and watch how variables in the Stack hold numbers vs pointers to Heap objects."
        },
        {
            number: "04",
            title: "Phase 4: Everyday Examples & Traps",
            subtitle: "The 4 Golden Rules Every Developer Must Know",
            summary: "Learn why string characters cannot be edited in place, the real difference between null and undefined, and the 1995 typeof bug."
        },
        {
            number: "05",
            title: "Phase 5: Knowledge Check",
            subtitle: "Test Your Mental Model",
            summary: "A quick 3-question visual quiz to verify that you've genuinely mastered data types."
        }
    ],

    // Stepper Demo Scenarios (Interactive Step-by-Step walkthrough)
    stepperSteps: [
        {
            stepNumber: 1,
            label: "Create a Primitive Value",
            code: "let score = 100;",
            stackPreview: [{ name: "score", value: "100", isRef: false }],
            heapPreview: [],
            explanation: "JavaScript creates a slot on the Stack named 'score' and directly stores the number 100 inside it."
        },
        {
            stepNumber: 2,
            label: "Copy the Primitive (Sticky Note Copy)",
            code: "let copy = score;",
            stackPreview: [
                { name: "score", value: "100", isRef: false },
                { name: "copy", value: "100", isRef: false }
            ],
            heapPreview: [],
            explanation: "JavaScript copies the actual value 100 into a brand new slot named 'copy'. Both slots are completely independent!"
        },
        {
            stepNumber: 3,
            label: "Modify the Copy",
            code: "copy = 200;",
            stackPreview: [
                { name: "score", value: "100", isRef: false },
                { name: "copy", value: "200", isRef: false }
            ],
            heapPreview: [],
            explanation: "Only 'copy' changes to 200. 'score' is still 100! Your friend scratched their note, but yours is safe."
        },
        {
            stepNumber: 4,
            label: "Create an Object (The Warehouse Locker)",
            code: "let user1 = { name: 'Alice' };",
            stackPreview: [
                { name: "user1", value: "0x4F12", isRef: true }
            ],
            heapPreview: [
                { addr: "0x4F12", content: "{ name: 'Alice' }" }
            ],
            explanation: "The object { name: 'Alice' } is placed in the Heap at address 0x4F12. 'user1' on the Stack only holds the Locker Key '0x4F12'!"
        },
        {
            stepNumber: 5,
            label: "Copy the Object (Sharing the Locker Key)",
            code: "let user2 = user1;",
            stackPreview: [
                { name: "user1", value: "0x4F12", isRef: true },
                { name: "user2", value: "0x4F12", isRef: true }
            ],
            heapPreview: [
                { addr: "0x4F12", content: "{ name: 'Alice' }" }
            ],
            explanation: "We did NOT duplicate the object! We only handed 'user2' a duplicate key to locker 0x4F12."
        },
        {
            stepNumber: 6,
            label: "Mutate via user2 (The Shared Surprise)",
            code: "user2.name = 'Bob';",
            stackPreview: [
                { name: "user1", value: "0x4F12", isRef: true },
                { name: "user2", value: "0x4F12", isRef: true }
            ],
            heapPreview: [
                { addr: "0x4F12", content: "{ name: 'Bob' }" }
            ],
            explanation: "user2 used their key to open locker 0x4F12 and changed the name to 'Bob'. When user1 checks user1.name, they see 'Bob' too!"
        }
    ],

    // Four Golden Rules / Everyday Traps
    goldenRules: [
        {
            title: "Rule 1: Primitives are Immutable (You Can't Edit Letters in a String)",
            trapCode: `let greeting = "Hello";
greeting[0] = "J"; // ❌ Silently does nothing!
console.log(greeting); // Still "Hello"

// ✅ The Correct Way: Make a new string
greeting = "J" + greeting.slice(1);
console.log(greeting); // "Jello"`,
            why: "Primitives cannot be cracked open and mutated. To change a word or number, you replace the entire value."
        },
        {
            title: "Rule 2: undefined vs. null (The Toilet Paper Analogy)",
            trapCode: `let delivery;
console.log(delivery); // undefined ("The box hasn't arrived yet")

let wallet = null;
console.log(wallet);   // null ("The wallet is intentionally empty")`,
            why: "undefined is JavaScript's default for variables that have not been initialized. null is an intentional choice made by you (the programmer) to say 'this is intentionally empty'."
        },
        {
            title: "Rule 3: The 1995 Bug: Why typeof null === 'object'",
            trapCode: `console.log(typeof "hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"

// The famous 30-year-old bug:
console.log(typeof null);    // "object" ⚠️ (Not actually an object!)`,
            why: "In 1995, Brendan Eich created JS in 10 days. The engine used type tags in memory: '000' meant object. Null was a pointer to address 0x00 (all zeroes), so the check mistakenly reported 'object'. It has never been fixed because changing it would break millions of legacy websites!"
        },
        {
            title: "Rule 4: Arrays and Functions are Actually Objects!",
            trapCode: `const list = [1, 2, 3];
console.log(typeof list); // "object" (Arrays are objects with index keys!)

console.log(Array.isArray(list)); // true ✅ (Always use Array.isArray to check)`,
            why: "In JavaScript, arrays are specialized objects where property keys are numbers (0, 1, 2) with an automatic .length property."
        }
    ],

    // Interactive Quiz / Knowledge Check
    quiz: [
        {
            id: "q1",
            question: "What will this code print to the console?",
            code: `let x = 50;
let y = x;
y = 100;
console.log(x);`,
            options: [
                { text: "50", correct: true, explanation: "Correct! Numbers are primitives (copied by value). Changing y does not touch x." },
                { text: "100", correct: false, explanation: "Incorrect. Numbers are primitives, so y got its own independent copy of 50." },
                { text: "undefined", correct: false, explanation: "Incorrect. x was initialized to 50 and never changed." }
            ]
        },
        {
            id: "q2",
            question: "What will this code print to the console?",
            code: `let cat1 = { name: "Whiskers" };
let cat2 = cat1;
cat2.name = "Shadow";
console.log(cat1.name);`,
            options: [
                { text: '"Shadow"', correct: true, explanation: "Spot on! Objects are reference types. cat1 and cat2 share the same locker key to the heap." },
                { text: '"Whiskers"', correct: false, explanation: "Remember: objects are stored by reference! Mutating cat2 directly mutates the shared object in the heap." },
                { text: "TypeError", correct: false, explanation: "No error is thrown. Modifying a property on an object reference is standard valid JavaScript." }
            ]
        },
        {
            id: "q3",
            question: "Which of the following is NOT a primitive data type in JavaScript?",
            code: `// Which one lives in the Object Kingdom?`,
            options: [
                { text: "Array []", correct: true, explanation: "Correct! Arrays are part of the Object Kingdom. They live in the Heap and are mutable reference types." },
                { text: "Boolean (true/false)", correct: false, explanation: "Booleans are primitive values stored directly in the Stack." },
                { text: "String ('hello')", correct: false, explanation: "Strings are immutable primitive values." },
                { text: "BigInt (10n)", correct: false, explanation: "BigInt is a primitive value introduced in ES2020." }
            ]
        }
    ],

    syntax: `// 1. The 7 Primitives (Stored by Value on the Stack)
const score = 100;          // Number
const name = "Alice";       // String
const isLogged = true;      // Boolean
const emptySlot = undefined;// Undefined
const noValue = null;       // Null
const bigNum = 9007199254740991n; // BigInt
const token = Symbol("id"); // Symbol

// 2. Objects (Stored by Reference in the Heap)
const profile = { name: "Alice", role: "Dev" };
const tags = ["frontend", "javascript"];
const run = function() { return "Ready!"; };
`,

    examples: [
        {
            title: "Example 1: The Sticky Note Copy (Primitives by Value)",
            code: `// Sticky Note: Changing one does NOT touch the other
let myTokens = 10;
let friendTokens = myTokens; // Friend gets a duplicate note with 10

friendTokens = 50; // Friend scratches their note to 50

console.log("My Tokens:", myTokens);         // 10 (Safe & untouched!)
console.log("Friend Tokens:", friendTokens); // 50`,
            explanation: "Primitives are copied by value. Each variable owns its personal memory slot on the Stack."
        },
        {
            title: "Example 2: The Shared Locker Key (Objects by Reference)",
            code: `// Locker Key: Both variables hold the key to the SAME locker
let teamAccount = { balance: 1000 };
let manager = teamAccount; // Manager receives the key to the same account

// Manager spends 300
manager.balance -= 300;

console.log("Team Account:", teamAccount.balance); // 700 (Affected!)
console.log("Manager View:", manager.balance);     // 700`,
            explanation: "Because objects live in the Heap, copying an object copies the locker key (reference address). Both variables mutate the exact same object."
        },
        {
            title: "Example 3: Safe Object Cloning (Getting Your Own Locker)",
            code: `const original = { theme: "dark", level: 5 };

// Using spread {...} creates a brand new locker with duplicate contents
const independentCopy = { ...original };

independentCopy.theme = "light";

console.log("Original Theme:", original.theme);           // "dark" (Protected!)
console.log("Copy Theme:", independentCopy.theme);        // "light"`,
            explanation: "If you want an object to be independent like a primitive, make a copy using the spread operator {...} or structuredClone()."
        },
        {
            title: "Example 4: Inspecting Types with typeof & Array.isArray",
            code: `console.log(typeof 42);             // "number"
console.log(typeof "JSViz");          // "string"
console.log(typeof true);            // "boolean"
console.log(typeof undefined);       // "undefined"
console.log(typeof { a: 1 });        // "object"
console.log(typeof [1, 2, 3]);       // "object" ⚠️
console.log(Array.isArray([1, 2]));  // true ✅

// Checking for null safely:
const val = null;
console.log(val === null);           // true ✅ (Don't rely on typeof!)`,
            explanation: "Always use Array.isArray() to detect arrays, and val === null to check for null values."
        }
    ],

    useCases: [
        "**Form & State Validation**: Using `typeof` checks to ensure user inputs are numbers before math calculations.",
        "**State Immutability (React/Redux)**: Understanding reference equality (`prevObj === nextObj`) to trigger UI updates without bugs.",
        "**Memory Efficiency**: Choosing primitives for high-frequency calculations to avoid garbage collection overhead in the Heap.",
        "**Defensive Coding**: Preventing accidental mutations when passing data dictionaries between application layers."
    ],

    memoryModel: `### **Inside the Machine: Stack vs. Heap**

\`\`\`
          THE STACK (Fast & Contiguous)             THE HEAP (Large & Flexible)
     ┌────────────────────────┬─────────────┐     ┌────────────────────────────────┐
     │ Variable Name          │ Value       │     │ Address: 0x4F12                │
     ├────────────────────────┼─────────────┤     │                                │
     │ score                  │ 100         │     │ { name: "Bob", role: "Admin" } │
     │ copy                   │ 200         │     └────────────────────────────────┘
     │ user1                  │ 0x4F12 ───────────────▲ (Both keys point here!)
     │ user2                  │ 0x4F12 ───────────────┘
     └────────────────────────┴─────────────┘
\`\`\`

1. **The Stack (CPU-Friendly):**
   - Stores primitive values and variable identifiers.
   - Operates like a neat stack of plates: fast allocation and O(1) de-allocation.
   - Smi (Small Integer) optimization in V8: small integers are stored directly within register words with zero pointer overhead.

2. **The Heap (Garbage Collected):**
   - Stores variable-sized objects, dynamic arrays, and closures.
   - Accessible via 64-bit pointers stored on the Stack.
   - When no variable on the Stack points to an address in the Heap, V8's Garbage Collector automatically frees that memory.`
};

export default dataTypes;
