const dataTypes = {
    title: "Data Types & Memory Model",
    subtitle: "The Foundation of All JavaScript Programs",
    definition: "Why does JavaScript have data types? Think of a computer as a fast but literal robot. If you ask it to calculate 5 + 5, it does math and gives you 10. But if you type '5' + '5', it glues words together like speech bubbles and gives you '55'! Data types tell JavaScript: What is this value, and where should it live in memory? In JavaScript, every piece of data belongs to just two families: The 7 Primitives (simple values in your pocket) and Objects (big storage containers in a warehouse).",
    
    // The 5-Year-Old Mental Model
    analogy: {
        headline: "Phase 1: The 5-Year-Old Intuition (Sticky Notes vs. Locker Keys)",
        intro: "To master JavaScript data types and never get confused by 'pass-by-value' or 'pass-by-reference', you only ever need to picture two real-world objects: a Sticky Note in your pocket, and a Train Station Locker Key.",
        primitives: {
            title: "The 7 Primitives = Sticky Notes in Your Pocket",
            badge: "Independent & Direct",
            description: "Imagine writing the number '42' on a tiny yellow sticky note and putting it in your pocket. If a friend asks for your number, you write '42' on a brand-new sticky note and hand it to them.",
            punchline: "If your friend scribbles on their sticky note and changes it to '99', YOUR note in your pocket STILL says '42'! Both notes are completely independent.",
            traits: [
                "Stored directly in fast pocket memory (The Stack)",
                "Copied by Value (Everyone gets their own separate photocopy)",
                "Immutable (You can replace the note, but you cannot change the number 42 into a 50)"
            ]
        },
        objects: {
            title: "Objects & Arrays = Locker Keys with a Locker Address",
            badge: "Shared Containers",
            description: "Now imagine a giant toy chest. It is way too heavy to carry in your pocket! So it lives in a big warehouse (The Heap). In your pocket, you only hold a small metal key stamped with the locker address '#0x4F12'.",
            punchline: "If you give your friend a copy of your key (let friend = me), you BOTH hold keys to the EXACT SAME LOCKER. If your friend unlocks Locker #0x4F12 and adds a toy robot, you unlock it and see the robot too!",
            traits: [
                "The big container lives in warehouse storage (The Heap)",
                "Your variable only holds the Memory Address (The Key)",
                "Copied by Reference (Sharing the key means sharing the same locker contents)"
            ]
        }
    },

    // The Mental Model Cheat Sheet
    comparisonTable: [
        {
            feature: "Real-World Analogy",
            primitive: "Sticky Note in your pocket",
            object: "Key to a big storage locker"
        },
        {
            feature: "Where It Lives",
            primitive: "The Stack (Fast, direct CPU pocket)",
            object: "The Heap (Large warehouse storage)"
        },
        {
            feature: "What Variable Holds",
            primitive: "The direct value itself (e.g. 100, 'hello')",
            object: "A Memory Address pointer (e.g. #0x4F12)"
        },
        {
            feature: "When You Copy (b = a)",
            primitive: "Makes an independent photocopy of the value",
            object: "Duplicates the key; both open the SAME locker"
        },
        {
            feature: "Can You Mutate It?",
            primitive: "No (Immutable). You replace the whole note.",
            object: "Yes (Mutable). You edit what's inside the locker."
        },
        {
            feature: "Equality Check (a === b)",
            primitive: "Checks if values are identical (100 === 100)",
            object: "Checks if keys point to the exact same locker"
        }
    ],

    // The Two Kingdoms Overview
    kingdoms: {
        headline: "Phase 2: The Two Kingdoms of JavaScript",
        subheadline: "Every single piece of data in JavaScript belongs to one of these two kingdoms.",
        kingdom1: {
            name: "Kingdom 1: The 7 Primitives",
            badge: "Values in Pockets",
            description: "Lightweight, independent, direct values. Fast and stored directly on the Stack.",
            types: [
                { name: "Number", example: "42, 3.14, -10", explain: "Any integer or decimal number. Used for math, counting, and physics." },
                { name: "String", example: '"Hello", \'JavaScript\'', explain: "Text wrapped in quotes. Quotes act like speech bubbles for words and letters." },
                { name: "Boolean", example: "true or false", explain: "A light switch: either ON (true) or OFF (false). Used for if/else decisions." },
                { name: "Undefined", example: "undefined", explain: "An unassigned slot. The computer says: 'You declared this, but haven't given it a value!'" },
                { name: "Null", example: "null", explain: "Deliberately empty. The developer says: 'I intentionally set this to empty (like an empty plate).'" },
                { name: "BigInt", example: "9007199254740995n", explain: "Giant integers beyond 9 quadrillion. Used for high-precision science and crypto." },
                { name: "Symbol", example: "Symbol('id')", explain: "A secret VIP badge guaranteed 100% unique in the universe. Never collides with anything." }
            ]
        },
        kingdom2: {
            name: "Kingdom 2: The Object Kingdom",
            badge: "Containers in Warehouses",
            description: "Bulky structures that bundle multiple values together. Mutable and stored in the Heap.",
            types: [
                { name: "Plain Object {}", example: '{ name: "Alice", score: 95 }', explain: "A labeled box with named stickers (properties). Ideal for user profiles and records." },
                { name: "Array []", example: '["Apple", "Banana", "Cherry"]', explain: "An ordered grocery checklist indexed by position numbers (0, 1, 2...). Keeps order." },
                { name: "Function () {}", example: 'function jump() { return "up"; }', explain: "A reusable recipe of actions that can be saved, passed around, and executed." }
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

    // Stepper Demo Scenarios (Interactive Step-by-Step walkthrough with cumulative fullCode)
    stepperSteps: [
        {
            stepNumber: 1,
            label: "Create Primitive (Sticky Note)",
            code: "let score = 100;",
            fullCode: "let score = 100;",
            explanation: "JavaScript creates a personal slot on the Stack named 'score' and directly writes the number 100 inside it."
        },
        {
            stepNumber: 2,
            label: "Copy Primitive (Duplicate Note)",
            code: "let copy = score;",
            fullCode: "let score = 100;\nlet copy = score;",
            explanation: "JavaScript reads the 100 from 'score' and photocopies it onto a brand-new slot named 'copy'. Both have their own 100."
        },
        {
            stepNumber: 3,
            label: "Modify Copy (Safe & Independent)",
            code: "copy = 200;",
            fullCode: "let score = 100;\nlet copy = score;\ncopy = 200;",
            explanation: "Only 'copy' changes to 200. 'score' is still 100! Your friend scribbled on their note, but your note in your pocket is safe."
        },
        {
            stepNumber: 4,
            label: "Create Object (Warehouse Locker)",
            code: "let user1 = { name: 'Alice' };",
            fullCode: "let user1 = { name: 'Alice' };",
            explanation: "The object is too bulky for your pocket, so it gets stored in the Heap warehouse (Locker #0x4F12). 'user1' on the Stack only holds the Locker Key!"
        },
        {
            stepNumber: 5,
            label: "Copy Object (Sharing the Key)",
            code: "let user2 = user1;",
            fullCode: "let user1 = { name: 'Alice' };\nlet user2 = user1;",
            explanation: "We did NOT duplicate the object! We only handed 'user2' a duplicate key to locker #0x4F12. Both people hold keys to the exact same locker."
        },
        {
            stepNumber: 6,
            label: "Mutate via user2 (The Shared Surprise)",
            code: "user2.name = 'Bob';",
            fullCode: "let user1 = { name: 'Alice' };\nlet user2 = user1;\nuser2.name = 'Bob';",
            explanation: "user2 unlocked Locker #0x4F12 and painted the name 'Bob'. When user1 unlocks the locker with their key, they see 'Bob' too!"
        }
    ],

    // Four Golden Rules / Everyday Traps
    goldenRules: [
        {
            title: "Rule 1: Primitives are Immutable (Strings Cannot Be Edited In-Place)",
            trapCode: `let greeting = "Hello";
greeting[0] = "J"; // ❌ Silently does nothing!
console.log(greeting); // Still "Hello"

// ✅ The Correct Way: Make a brand-new string
greeting = "J" + greeting.slice(1);
console.log(greeting); // "Jello"`,
            why: "Primitives cannot be cracked open and edited. They are carved in stone. To change text or a number, you replace the entire value with a new one."
        },
        {
            title: "Rule 2: 🎮 The Classic Game Bug: Shared Locker Keys",
            trapCode: `// Oops! Both players share the same locker key:
let player1 = { name: "Hero", health: 100 };
let player2 = player1; 

// Monster attacks Player 2:
player2.health -= 30;

console.log("Player 2 Health:", player2.health); // 70
console.log("Player 1 Health:", player1.health); // 70 (Wait! Player 1 took damage too!)

// ✅ The Fix: Give Player 2 their OWN independent locker:
let safePlayer2 = { ...player1 };`,
            why: "Because player2 was assigned player1, both variables pointed to the same heap locker. To protect player1, use the spread operator {...} or structuredClone() to allocate an independent locker."
        },
        {
            title: "Rule 3: undefined vs. null (The Mailbox Analogy)",
            trapCode: `let mailbox;
console.log(mailbox); // undefined ("The mail carrier hasn't delivered anything yet")

let emptyBox = null;
console.log(emptyBox); // null ("The owner intentionally checked and marked it empty")`,
            why: "undefined is JavaScript's default for variables that have not been assigned. null is an intentional choice made by you (the programmer) to say: 'I deliberately set this slot to empty'."
        },
        {
            title: "Rule 4: The 1995 Engine Quirk: Why typeof null === 'object'",
            trapCode: `console.log(typeof "hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"

// The famous 30-year-old JavaScript engine quirk:
console.log(typeof null);    // "object" ⚠️ (null is NOT an object!)
console.log(Array.isArray([1, 2])); // true ✅ (Always check arrays with Array.isArray)`,
            why: "In 1995, Brendan Eich created JS in 10 days. The original engine stored type tags in memory: '000' meant object. Null was represented as pointer 0x00 (all zeroes), so the type check mistakenly reported 'object'. It has never been changed because fixing it would break legacy websites!"
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
