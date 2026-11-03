const dataTypes = {
    title: "Data Types & Memory Model",
    subtitle: "The Foundation of JavaScript Memory Management",
    definition: "JavaScript categorizes every value into two distinct memory archetypes: The 7 Primitives (allocated directly within execution stack frames by value) and Reference Types / Objects (allocated dynamically within the memory heap and accessed via 64-bit pointers). Mastering this division is essential to understanding variable copying, mutability, equality checks, and avoiding accidental state mutation bugs in production applications.",
    
    // Core Architecture: Stack (Pass-by-Value) vs. Heap (Pass-by-Reference)
    architecture: {
        headline: "Stack Allocation vs. Heap Allocation",
        intro: "Understanding JavaScript's memory mechanics begins with how the engine (such as V8) manages CPU memory across execution contexts.",
        primitives: {
            title: "The 7 Primitives (Pass-by-Value)",
            badge: "Stack Allocation",
            description: "Primitive values are fixed-size, immutable data units stored directly inside the Call Stack execution frame. When you assign or pass a primitive, JavaScript performs a bitwise copy of the direct value.",
            punchline: "Because each variable holds its own discrete value on the stack, modifying one variable never affects another.",
            traits: [
                "Stored directly in Call Stack frames (fixed byte width)",
                "Copied strictly by Value (independent memory copy)",
                "Immutable in memory (operations return brand-new values)",
                "Direct O(1) read/write with zero pointer indirection"
            ]
        },
        objects: {
            title: "Objects & Reference Types (Pass-by-Reference)",
            badge: "Heap Allocation",
            description: "Objects, arrays, and functions are dynamic, arbitrarily-sized structures allocated in the Memory Heap. Variables on the stack do not store the object itself; they store a 64-bit memory address pointer referencing that heap allocation.",
            punchline: "When you assign or pass an object, JavaScript copies only the memory address pointer. Both variables reference the exact same memory block in the heap.",
            traits: [
                "Allocated dynamically in the Memory Heap",
                "Stack variable holds a 64-bit memory address pointer",
                "Copied by Reference (multiple variables point to the same heap record)",
                "Mutable in-place (mutations via any reference affect all reference holders)"
            ]
        }
    },

    // Legacy fallback for analogy (kept for full compatibility)
    analogy: {
        headline: "Stack Allocation vs. Heap Allocation",
        intro: "Understanding JavaScript's memory mechanics begins with how the engine (such as V8) manages CPU memory across execution contexts.",
        primitives: {
            title: "The 7 Primitives (Pass-by-Value)",
            badge: "Stack Allocation",
            description: "Primitive values are fixed-size, immutable data units stored directly inside the Call Stack execution frame. When you assign or pass a primitive, JavaScript performs a bitwise copy of the direct value.",
            punchline: "Because each variable holds its own discrete value on the stack, modifying one variable never affects another.",
            traits: [
                "Stored directly in Call Stack frames (fixed byte width)",
                "Copied strictly by Value (independent memory copy)",
                "Immutable in memory (operations return brand-new values)",
                "Direct O(1) read/write with zero pointer indirection"
            ]
        },
        objects: {
            title: "Objects & Reference Types (Pass-by-Reference)",
            badge: "Heap Allocation",
            description: "Objects, arrays, and functions are dynamic, arbitrarily-sized structures allocated in the Memory Heap. Variables on the stack do not store the object itself; they store a 64-bit memory address pointer referencing that heap allocation.",
            punchline: "When you assign or pass an object, JavaScript copies only the memory address pointer. Both variables reference the exact same memory block in the heap.",
            traits: [
                "Allocated dynamically in the Memory Heap",
                "Stack variable holds a 64-bit memory address pointer",
                "Copied by Reference (multiple variables point to the same heap record)",
                "Mutable in-place (mutations via any reference affect all reference holders)"
            ]
        }
    },

    // The Mental Model Comparison Matrix
    comparisonTable: [
        {
            feature: "Memory Location",
            primitive: "Call Stack (Contiguous execution frame)",
            object: "Memory Heap (Dynamic memory pool)"
        },
        {
            feature: "Variable Holds",
            primitive: "The direct value itself (e.g. 42, 'hello')",
            object: "A 64-bit Memory Address pointer (e.g. 0x4F12)"
        },
        {
            feature: "Assignment (b = a)",
            primitive: "Deep value copy: b gets an independent replica",
            object: "Pointer copy: b receives the same memory address"
        },
        {
            feature: "In-Place Mutability",
            primitive: "Immutable: Cannot alter existing byte representation",
            object: "Mutable: Properties can be added, updated, or deleted"
        },
        {
            feature: "Strict Equality (a === b)",
            primitive: "Compares bit-level values (42 === 42)",
            object: "Compares reference memory addresses (0x4F12 === 0x4F12)"
        },
        {
            feature: "Garbage Collection",
            primitive: "Instantaneous: Popped off stack with frame return",
            object: "V8 Generational GC (Scavenge nursery & Mark-Sweep)"
        }
    ],

    // The Complete Type Catalog
    typeCatalog: {
        headline: "The JavaScript Type System",
        subheadline: "ECMAScript defines 8 data types: 7 Primitives and 1 Reference Type (Object).",
        primitives: {
            name: "The 7 Primitive Types",
            description: "Fixed-size, immutable values stored directly on the stack.",
            types: [
                {
                    name: "Number",
                    badge: "IEEE-754 / V8 Smi",
                    example: "42, 3.14159, -0, NaN, Infinity",
                    explain: "Double-precision 64-bit binary format IEEE-754. V8 optimizes 31-bit signed integers as Small Integers (Smi) without heap boxing."
                },
                {
                    name: "String",
                    badge: "UTF-16 Sequence",
                    example: '"JavaScript", \'engine\', `count: ${n}`',
                    explain: "Immutable sequence of 16-bit UTF-16 code units. Character index assignment fails silently in non-strict mode. Interned by V8."
                },
                {
                    name: "Boolean",
                    badge: "1-Bit Logic",
                    example: "true, false",
                    explain: "Logical truth values representing true or false. Used in conditional branching and logical evaluations."
                },
                {
                    name: "Undefined",
                    badge: "Engine Default",
                    example: "undefined",
                    explain: "Indicates an uninitialized variable, missing function argument, or non-existent object property."
                },
                {
                    name: "Null",
                    badge: "Intentional Absence",
                    example: "null",
                    explain: "Represents the intentional absence of any object value. Note: typeof null === 'object' is a legacy 1995 engine type tag bug."
                },
                {
                    name: "BigInt",
                    badge: "Arbitrary Precision",
                    example: "9007199254740995n, BigInt(100)",
                    explain: "Allows safe arithmetic on integers beyond Number.MAX_SAFE_INTEGER (2^53 - 1). Cannot be mixed with Number without explicit cast."
                },
                {
                    name: "Symbol",
                    badge: "Unique Identifier",
                    example: "Symbol('id'), Symbol.for('key')",
                    explain: "Guaranteed unique, immutable primitive value primarily used as private or collision-free object property keys."
                }
            ]
        },
        objects: {
            name: "The Object Ecosystem (Reference Types)",
            description: "Dynamic structures allocated in the heap and referenced via stack pointers.",
            types: [
                {
                    name: "Object Literal",
                    badge: "Key-Value Hashmap",
                    example: '{ id: 101, role: "admin", active: true }',
                    explain: "Unordered collection of properties mapping string or Symbol keys to primitive values or nested object references."
                },
                {
                    name: "Array []",
                    badge: "Indexed Collection",
                    example: '["Node.js", "V8", "Blink"]',
                    explain: "Exotic object with indexed elements and an auto-managed length property. Stored in V8 as packed or holey elements."
                },
                {
                    name: "Function () {}",
                    badge: "Callable Object",
                    example: 'function dispatch(event) { return event.type; }',
                    explain: "First-class executable object instance with [[Call]] and [[Construct]] internal slots, retaining lexical scope closure."
                }
            ]
        }
    },

    // Legacy fallback for kingdoms
    kingdoms: {
        headline: "The JavaScript Type System",
        subheadline: "ECMAScript defines 8 data types: 7 Primitives and 1 Reference Type (Object).",
        kingdom1: {
            name: "The 7 Primitive Types",
            badge: "Stack Allocation",
            description: "Fixed-size, immutable values stored directly on the stack.",
            types: [
                { name: "Number", example: "42, 3.14159, -0, NaN", explain: "Double-precision 64-bit IEEE-754 float. V8 optimizes 31-bit integers as Smi." },
                { name: "String", example: '"JavaScript", \'engine\'', explain: "Immutable sequence of UTF-16 code units. Interned in memory by V8." },
                { name: "Boolean", example: "true or false", explain: "1-bit logical truth flags used in conditional control flow." },
                { name: "Undefined", example: "undefined", explain: "Engine default for uninitialized variables and non-existent properties." },
                { name: "Null", example: "null", explain: "Intentional absence of an object value. (typeof null === 'object' is a 1995 bug)." },
                { name: "BigInt", example: "9007199254740995n", explain: "Arbitrary precision integer for values exceeding Number.MAX_SAFE_INTEGER." },
                { name: "Symbol", example: "Symbol('id')", explain: "Guaranteed unique, immutable token used for collision-free object property keys." }
            ]
        },
        kingdom2: {
            name: "The Object Ecosystem (Reference Types)",
            badge: "Heap Allocation",
            description: "Dynamic structures allocated in the heap and referenced via stack pointers.",
            types: [
                { name: "Plain Object {}", example: '{ id: 101, role: "admin" }', explain: "Unordered hashmap collection of key-value pairs stored dynamically on the heap." },
                { name: "Array []", example: '["Node.js", "V8", "Blink"]', explain: "Indexed sequential collection with dynamic length, stored as packed or holey elements." },
                { name: "Function () {}", example: 'function dispatch() { return 1; }', explain: "Callable object instance carrying an executable body and lexical closure." }
            ]
        }
    },

    // Stepper Scenarios (Interactive Step-by-Step walkthrough with cumulative fullCode)
    stepperSteps: [
        {
            stepNumber: 1,
            label: "Allocate Primitive on Stack",
            code: "let score = 100;",
            fullCode: "let score = 100;",
            explanation: "V8 allocates a discrete slot on the current call stack frame for 'score' and stores the 32-bit integer 100 directly inside it."
        },
        {
            stepNumber: 2,
            label: "Copy Primitive by Value",
            code: "let copy = score;",
            fullCode: "let score = 100;\nlet copy = score;",
            explanation: "JavaScript reads the raw binary value 100 from 'score' and copies it into a brand-new stack slot for 'copy'. Both exist independently."
        },
        {
            stepNumber: 3,
            label: "Mutate Primitive Copy",
            code: "copy = 200;",
            fullCode: "let score = 100;\nlet copy = score;\ncopy = 200;",
            explanation: "The value in 'copy' becomes 200. 'score' remains untouched at 100, proving primitives are completely independent."
        },
        {
            stepNumber: 4,
            label: "Allocate Object in Memory Heap",
            code: "let user1 = { name: 'Alice' };",
            fullCode: "let user1 = { name: 'Alice' };",
            explanation: "V8 allocates memory in the heap for { name: 'Alice' } at address 0x4F12. 'user1' on the stack holds only the 64-bit pointer 0x4F12."
        },
        {
            stepNumber: 5,
            label: "Copy Object Reference Pointer",
            code: "let user2 = user1;",
            fullCode: "let user1 = { name: 'Alice' };\nlet user2 = user1;",
            explanation: "JavaScript does NOT duplicate the heap object. It copies the pointer 0x4F12 into 'user2'. Both variables reference the identical heap record."
        },
        {
            stepNumber: 6,
            label: "Mutate Shared Heap Record",
            code: "user2.name = 'Bob';",
            fullCode: "let user1 = { name: 'Alice' };\nlet user2 = user1;\nuser2.name = 'Bob';",
            explanation: "Mutating 'user2.name' updates the heap memory block at 0x4F12. Reading 'user1.name' now yields 'Bob' because they share the same heap reference."
        }
    ],

    // Four Production Pitfalls & Solutions
    goldenRules: [
        {
            title: "Pitfall 1: Shared Reference Mutation (State Corruption)",
            trapCode: `// Problem: Both variables hold the same heap pointer:
const originalConfig = { retries: 3, cache: true };
const workerConfig = originalConfig;

// Mutating workerConfig inadvertently alters originalConfig!
workerConfig.retries = 0;
console.log(originalConfig.retries); // 0 (Corrupted!)

// Solution: Create a shallow clone or deep clone:
const safeShallow = { ...originalConfig };
const safeDeep = structuredClone(originalConfig);`,
            why: "Object assignment copies only the 64-bit heap memory pointer, not the underlying structure. Use the object spread operator ({...obj}) for shallow copies or structuredClone() for recursive deep copies to isolate state."
        },
        {
            title: "Pitfall 2: String Immutability & Silent Assignment Failure",
            trapCode: `let status = "pending";

// Attempting in-place character mutation:
status[0] = "P"; // Silently fails in non-strict mode!
console.log(status); // "pending"

// Solution: Create a newly allocated string:
status = "P" + status.slice(1);
console.log(status); // "Pending"`,
            why: "All 7 JavaScript primitives are immutable in memory. Bracket indexing on strings is read-only. Modifying a character requires constructing a newly allocated string."
        },
        {
            title: "Pitfall 3: IEEE-754 Floating-Point Representation",
            trapCode: `// Floating-point arithmetic precision trap:
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false ⚠️

// Solution 1: Use Number.EPSILON for tolerance comparison:
const isEqual = Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON;
console.log(isEqual); // true ✅

// Solution 2: For currency, compute in integer cents:
const priceCents = 10 + 20; // 30 cents (exact integer math)`,
            why: "JavaScript numbers conform to IEEE-754 double precision (64-bit binary). Decimal fractions like 0.1 and 0.2 cannot be represented precisely in finite binary floating-point, creating a minute rounding discrepancy."
        },
        {
            title: "Pitfall 4: Type Inspection Quirk (typeof null & Array detection)",
            trapCode: `console.log(typeof 42);             // "number"
console.log(typeof "hello");        // "string"
console.log(typeof true);           // "boolean"

// The 1995 V8/JS Type Tag Bug:
console.log(typeof null);           // "object" ⚠️ (null is NOT an object!)
console.log(typeof [1, 2, 3]);       // "object" ⚠️

// Solution: Enterprise-safe type checking:
console.log(val === null);          // Check null strictly
console.log(Array.isArray([1, 2])); // true ✅
console.log(Object.prototype.toString.call(val)); // "[object Null]"`,
            why: "In Brendan Eich's original 1995 JavaScript engine, value type tags were stored in the lower 3 bits of memory pointers. The tag '000' signaled an object reference. Because null was represented as the NULL pointer 0x00, typeof mistook null for an object. It cannot be fixed without breaking legacy web code."
        }
    ],

    // Diagnostic Technical Quiz
    quiz: [
        {
            id: "q1",
            question: "What is printed to the console after executing this code?",
            code: `let a = 42;
let b = a;
b += 10;
console.log(a);`,
            options: [
                { text: "42", correct: true, explanation: "Correct! Numbers are primitive values allocated directly on the stack and copied by value. Mutating 'b' has zero effect on 'a'." },
                { text: "52", correct: false, explanation: "Incorrect. 'b' received an independent stack copy of 42. Modifying 'b' does not alter 'a'." },
                { text: "NaN", correct: false, explanation: "Incorrect. 'b' is a valid number (42) and increments to 52 without NaN coercion." }
            ]
        },
        {
            id: "q2",
            question: "What is logged to the console after running this snippet?",
            code: `const nodeA = { id: 1 };
const nodeB = nodeA;
nodeB.id = 99;
console.log(nodeA.id);`,
            options: [
                { text: "99", correct: true, explanation: "Correct! Objects are reference types. 'nodeA' and 'nodeB' hold the exact same 64-bit heap address pointer. Mutating via nodeB directly modifies the shared heap record." },
                { text: "1", correct: false, explanation: "Incorrect. Assigning nodeB = nodeA does not duplicate the object; it duplicates the memory pointer." },
                { text: "TypeError: Assignment to constant variable", correct: false, explanation: "Incorrect. 'const' prevents reassigning the stack pointer binding, but the heap object itself remains fully mutable." }
            ]
        },
        {
            id: "q3",
            question: "Which expression returns false?",
            code: `// Evaluate JavaScript equality and type checking`,
            options: [
                { text: "0.1 + 0.2 === 0.3", correct: true, explanation: "Correct! Due to IEEE-754 64-bit binary floating-point representation, 0.1 + 0.2 yields 0.30000000000000004, which does not strictly equal 0.3." },
                { text: "typeof null === 'object'", correct: false, explanation: "This evaluates to true due to the historical 1995 type tag bug." },
                { text: "Array.isArray([])", correct: false, explanation: "Array.isArray correctly evaluates to true for array instances." },
                { text: "typeof Symbol('id') === 'symbol'", correct: false, explanation: "typeof accurately returns 'symbol' for Symbol primitives." }
            ]
        },
        {
            id: "q4",
            question: "How can you safely create a completely independent deep copy of a nested object?",
            code: `const deepUser = { profile: { name: 'Alex' } };`,
            options: [
                { text: "structuredClone(deepUser)", correct: true, explanation: "Correct! structuredClone() performs a native recursive deep clone, duplicating all nested heap structures." },
                { text: "{ ...deepUser }", correct: false, explanation: "Incorrect. The spread operator only performs a shallow clone; nested properties like 'profile' still share heap references." },
                { text: "Object.assign({}, deepUser)", correct: false, explanation: "Incorrect. Object.assign also performs only a shallow copy." },
                { text: "const clone = deepUser;", correct: false, explanation: "Incorrect. Direct assignment copies only the outer memory address pointer." }
            ]
        }
    ],

    // Syntax reference
    syntax: `// 1. The 7 Primitives (Allocated on Call Stack by Value)
const score = 100;                 // Number (IEEE-754 / V8 Smi)
const username = "developer";      // String (UTF-16 code units)
const isActive = true;             // Boolean
const pending = undefined;         // Undefined (unassigned)
const emptyRef = null;             // Null (intentional absence)
const universeId = 9007199254740991n; // BigInt
const privateKey = Symbol("id");   // Symbol (unique key)

// 2. Reference Types (Allocated in Memory Heap, Pointer on Stack)
const record = { id: 1, name: "Alice" }; // Plain Object
const buffer = [10, 20, 30];             // Array
const execute = function() { return 1; };// Function
`,

    // Practical Code Examples
    examples: [
        {
            title: "Example 1: Stack Value Copying vs. Heap Reference Sharing",
            code: `// Stack Allocation (Primitives):
let primaryCount = 10;
let replicaCount = primaryCount; // Discrete stack copy
replicaCount = 50;

console.log("primaryCount:", primaryCount); // 10 (Protected)
console.log("replicaCount:", replicaCount); // 50

// Heap Allocation (Reference Types):
const serverA = { host: "127.0.0.1", port: 8080 };
const serverB = serverA; // Shared memory pointer

serverB.port = 9000;
console.log("serverA.port:", serverA.port); // 9000 (Mutated via shared pointer!)
console.log("serverB.port:", serverB.port); // 9000`,
            explanation: "Primitives allocate separate slots in the stack frame. Objects allocate a single heap block and duplicate only the memory address pointer."
        },
        {
            title: "Example 2: Shallow vs. Deep Cloning Techniques",
            code: `const origin = {
    name: "Production Cluster",
    settings: { timeoutMs: 5000 }
};

// 1. Shallow Copy (Spread {...}):
const shallow = { ...origin };
shallow.name = "Staging Cluster"; // Independent
shallow.settings.timeoutMs = 1000; // ⚠️ Mutates origin.settings too!

console.log("Origin timeout:", origin.settings.timeoutMs); // 1000

// 2. Native Deep Copy (structuredClone):
const deep = structuredClone(origin);
deep.settings.timeoutMs = 9999;
console.log("Origin timeout after deep edit:", origin.settings.timeoutMs); // 1000 (Safe!)`,
            explanation: "Shallow copying ({...} or Object.assign) copies primitive properties but only copies heap pointers for nested objects. Use structuredClone() for complete heap tree isolation."
        },
        {
            title: "Example 3: Safe Numeric Comparisons with IEEE-754",
            code: `function numbersAreEqual(a, b) {
    return Math.abs(a - b) < Number.EPSILON;
}

const sum = 0.1 + 0.2;
console.log("Raw strict equality:", sum === 0.3); // false ⚠️
console.log("Epsilon-safe comparison:", numbersAreEqual(sum, 0.3)); // true ✅

// For monetary transactions, calculate in base integer units (cents/satoshis):
const itemPrice = 1999; // $19.99 stored in cents
const taxAmount = 160;  // $1.60 stored in cents
const totalDue = itemPrice + taxAmount; // 2159 cents -> $21.59`,
            explanation: "Never use strict equality === for floating-point calculation results without an epsilon tolerance threshold or integer domain scaling."
        },
        {
            title: "Example 4: Enterprise-Grade Runtime Type Detection",
            code: `function getExactType(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
    
    // Extract [[Class]] from Object.prototype.toString:
    const rawTag = Object.prototype.toString.call(value);
    // "[object Function]", "[object RegExp]", "[object Date]", etc.
    return rawTag.slice(8, -1).toLowerCase();
}

console.log(getExactType(null));        // "null"
console.log(getExactType([1, 2]));      // "array"
console.log(getExactType(new Date()));  // "date"
console.log(getExactType(/regex/));     // "regexp"
console.log(getExactType(42));          // "number"`,
            explanation: "typeof fails on null and treats all heap objects (arrays, dates, regexes) uniformly as 'object'. Combining strict null checking with Object.prototype.toString provides deterministic type resolution."
        }
    ],

    useCases: [
        "**State Immutability in UI Frameworks**: React and Redux rely on shallow reference equality (`prevProps !== nextProps`) to trigger component re-renders; mutating objects in-place breaks change detection.",
        "**High-Performance V8 Memory Management**: Using primitive values and monomorphic typed structures keeps memory in continuous LIFO stack frames or V8 Smi registers, avoiding Garbage Collection pauses.",
        "**Defensive API Design**: Returning cloned objects (`structuredClone` or defensive freezing via `Object.freeze`) from libraries ensures internal state cannot be manipulated by consumer code.",
        "**Financial & Scientific Precision**: Choosing BigInt for 64-bit integer timestamps and monetary hashes prevents catastrophic rounding errors inherent in IEEE-754 floats."
    ],

    memoryModel: `### **V8 Engine Memory Architecture: The Call Stack vs. The Memory Heap**

\`\`\`
       THE CALL STACK (LIFO / Contiguous)              THE MEMORY HEAP (Dynamic Pool)
  ┌───────────────────────┬───────────────────┐     ┌──────────────────────────────────┐
  │ Variable Identifier   │ Stack Value Slot  │     │ Heap Address: 0x4F12             │
  ├───────────────────────┼───────────────────┤     │                                  │
  │ score                 │ 100 (Smi 31-bit)  │     │ Object Structure:                │
  │ copy                  │ 200 (Smi 31-bit)  │     │ { name: "Bob", role: "admin" }   │
  │ user1                 │ 0x4F12 (Pointer) ───────┼───────────────▲                  │
  │ user2                 │ 0x4F12 (Pointer) ───────┼───────────────┘                  │
  └───────────────────────┴───────────────────┘     └──────────────────────────────────┘
\`\`\`

1. **The Execution Call Stack:**
   - **Continuous Memory:** Stored in fast, contiguous memory managed in Last-In-First-Out (LIFO) stack frames.
   - **Fixed-Size Data:** Holds execution contexts, primitive values, local variables, and 64-bit memory addresses (pointers).
   - **V8 Smi (Small Integer) Optimization:** 31-bit signed integers are stored directly within register words with a trailing 0-bit tag, bypassing all pointer allocation.
   - **Lifecycle:** De-allocated automatically with $O(1)$ efficiency when the function returns and the stack frame is popped.

2. **The Memory Heap:**
   - **Dynamic Memory Pool:** An unstructured region of memory dedicated to allocating dynamic and variable-sized data structures (Objects, Arrays, Closures, Maps).
   - **Garbage Collection (V8 Orinoco):**
     - **New Space (Nursery):** Where newly allocated objects live. Collected frequently using the fast Scavenge algorithm (Cheney's copying collector).
     - **Old Space:** Objects that survive two GC cycles are promoted to Old Space, managed by Mark-Sweep-Compact garbage collection.
   - **Memory Leaks:** Occur when stack variables (e.g. global references or uncleared event listeners) maintain pointers to heap records that are no longer needed.`
};

export default dataTypes;
