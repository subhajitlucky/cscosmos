// Specialized content definitions and slug mappings for JavaScript Mastery 2027 Curriculum (Concepts 01 to 100)

export const TOPIC_SLUG_MAP = {
  // Module 01: Foundations & Environment
  'what-is-javascript-history-evolution-ecmascript': 'legacy',
  'javascript-runtime-environments-browser-vs-nodejs': 'browser-storage',
  'javascript-engine-architecture-execution': 'v8-compiler-pipeline',
  'javascript-syntax-statements-expressions': 'literals-syntax',
  'variables-var-let-const': 'variables-scope',
  'comments-identifiers-reserved-keywords': 'comments-identifiers-reserved-keywords',
  'strict-mode-modern-javascript': 'strict-mode-modern-javascript',
  'primitive-vs-non-primitive-data-types': 'data-types',
  'type-detection-typeof-instanceof-tostring': 'typeof-detection',
  'type-conversion-type-coercion': 'type-coercion',

  // Module 02: Values, Operators & Control Flow
  'numbers-ieee754-floating-point-precision': 'numbers',
  'bigint-arbitrary-precision-integers': 'bigint',
  'strings-immutability-string-methods': 'strings',
  'boolean-null-undefined': 'boolean-null-undefined',
  'symbols-unique-identifiers': 'symbols',
  'equality-comparisons-object-is': 'equality-comparison',
  'truthy-falsy-short-circuit-evaluation': 'truthy-falsy',
  'operators-precedence-associativity': 'operators',
  'conditional-statements-if-else-switch': 'conditional-statements-if-else-switch',
  'loops-for-while-do-while-break-continue': 'loops-for-while-do-while-break-continue',

  // Module 03: Data Structures & Programming Fundamentals
  'arrays-creation-indexing-fundamental-methods': 'arrays',
  'array-mutation-vs-non-mutating-methods': 'array-methods-mutating',
  'objects-creation-properties-access': 'objects',
  'object-array-destructuring': 'cloning-objects',
  'spread-rest-syntax': 'arguments-rest',
  'template-literals-tagged-templates': 'template-literals',
  'optional-chaining-nullish-coalescing': 'optional-chaining-nullish-coalescing',
  'date-timestamps-math-object': 'date',
  'json-serialization-parsing-rawjson': 'json',
  'regular-expressions-regexp-escape': 'regex',

  // Module 04: Functions & Execution Model
  'function-declarations-vs-function-expressions': 'functions-basics',
  'parameters-arguments-default-parameters': 'arguments-rest',
  'arrow-functions-lexical-syntax': 'arrow-functions',
  'first-class-functions-callbacks': 'callbacks',
  'higher-order-functions-function-composition': 'higher-order-functions',
  'execution-context-execution-phases': 'execution-context',
  'call-stack-stack-overflow': 'call-stack',
  'hoisting-temporal-dead-zone': 'temporal-dead-zone',
  'pure-functions-side-effects-referential-transparency': 'pure-functions',
  'recursion-tail-calls-stack-management': 'recursion-tco',

  // Module 05: Scope, Closures & this Binding
  'global-function-block-scope': 'variables-scope',
  'lexical-scope-scope-chain': 'scope-chain',
  'variable-shadowing-identifier-resolution': 'variable-shadowing',
  'closures-lexical-environment': 'closures',
  'closures-in-loops-asynchronous-callbacks': 'closure-loop-problem',
  'this-keyword-implicit-binding': 'this-binding',
  'explicit-binding-call-apply-bind': 'function-methods',
  'new-operator-constructor-invocation': 'new-binding',
  'arrow-functions-lexical-this': 'lexical-this',
  'currying-partial-application-function-arguments': 'currying',

  // Module 06: Objects & Prototypal Inheritance
  'object-property-descriptors-attributes': 'property-descriptors',
  'property-accessors-getters-setters': 'property-descriptors',
  'object-immutability-freeze-seal-preventextensions': 'object-immutability',
  'prototype-prototype-internal-mechanism': 'prototype-chain',
  'prototype-chain-property-lookup': 'prototype-chain',
  'constructor-functions-prototype-methods': 'constructor-functions',
  'object-create-delegation': 'object-create',
  'es6-classes-class-syntax': 'classes',
  'class-inheritance-super-static-members': 'class-inheritance',
  'private-fields-static-blocks-encapsulation': 'private-class-fields',

  // Module 07: Collections, Iteration & Modules
  'array-iteration-map-filter-reduce-transformations': 'array-reduce-mastery',
  'map-set-collections-composition-union-intersection': 'map-set',
  'weakmap-weakset-weak-references': 'weakmap-weakset',
  'iterable-iterator-protocols': 'iteration-protocols',
  'for-of-vs-for-in': 'for-of-vs-for-in',
  'generators-function-star-yield': 'generators',
  'generator-delegation-yield-star-communication': 'advanced-generators',
  'modern-iterator-helpers-iterator-concat': 'modern-iterator-helpers-iterator-concat',
  'es-modules-import-export-scope-import-attributes': 'modules',
  'commonjs-vs-es-modules-dynamic-import-top-level-await': 'top-level-await',

  // Module 08: Advanced JavaScript & Metaprogramming
  'proxy-objects-metaprogramming': 'metaprogramming',
  'reflect-api-reflect-operations': 'reflect-api',
  'symbols-well-known-symbols-custom-protocols': 'symbols-registry',
  'typed-arrays-arraybuffer-float16array': 'typed-arrays',
  'dataview-binary-data-endianness': 'dataview',
  'sharedarraybuffer-atomics': 'sharedarraybuffer-atomics',
  'intl-api-internationalization': 'intl',
  'error-objects-custom-errors-error-iserror': 'errors',
  'ecmascript-specification-abstract-operations': 'ecmascript-specification-abstract-operations',
  'eval-dynamic-code-execution-security-implications': 'eval',

  // Module 09: Asynchronous JavaScript & Browser APIs
  'synchronous-vs-asynchronous-execution': 'synchronous-vs-asynchronous-execution',
  'event-loop-javascript-concurrency-model': 'event-loop',
  'task-queue-microtask-queue-queuemicrotask': 'task-queue-microtask-queue-queuemicrotask',
  'promises-states-lifecycle-resolution': 'promises',
  'promise-chaining-error-propagation-promise-try': 'promise-chaining',
  'promise-combinators-all-race-any-allsettled': 'promise-combinators',
  'async-await-array-fromasync-concurrency-patterns': 'async-await',
  'async-iterators-async-generators-for-await-of': 'async-iteration',
  'abortcontroller-fetch-api-web-streams': 'fetch-streams',
  'browser-event-system-eventtarget-bubbling-capturing': 'dom-event-propagation',

  // Module 10: JavaScript Engine, Memory, Performance & Security
  'javascript-memory-model-stack-vs-heap': 'memory-model',
  'garbage-collection-mark-and-sweep-generational-gc': 'garbage-collection',
  'memory-leaks-retained-references-memory-profiling': 'memory-leaks',
  'v8-architecture-parser-ignition-turbofan': 'v8-compiler-pipeline',
  'hidden-classes-shapes-inline-caching': 'v8-hidden-classes',
  'jit-compilation-speculative-optimisation-deoptimisation': 'jit-compilation-speculative-optimisation-deoptimisation',
  'web-workers-worker-threads-parallel-execution': 'web-workers',
  'browser-performance-debouncing-throttling-requestanimationframe': 'timers-animation',
  'javascript-security-prototype-pollution-sandboxing-hardening': 'object-sandboxing',
  'javascript-performance-engineering-advanced-anti-patterns': 'js-anti-patterns'
};

export const SPECIALIZED_TOPICS_2027 = {
  'comments-identifiers-reserved-keywords': {
    definition: "JavaScript source text is parsed into tokens comprising comments (ignored at execution), identifiers (variable, parameter, and function names), and reserved keywords that are permanently claimed by ECMAScript grammar.",
    syntax: `// 1. Single line comment
/* 2. Multi-line comment */

// Legal Identifiers: Must start with Letter, $, or _
let userGreeting = "Hello";
let $totalPrice = 99.99;
let _privateCounter = 0;

// Reserved Keywords (Cannot be used as identifier names):
// let, const, var, function, return, if, else, class, import, export, await, etc.`,
    examples: [
      {
        title: "Valid vs Invalid Identifier Rules",
        code: `// Valid Identifiers
let firstName = "Alex";
let $amount = 500;
let _status = "active";
let count2 = 10;

console.log({ firstName, $amount, _status, count2 });

// Invalid Identifiers (Uncommenting causes SyntaxError):
// let 2count = 10;   // Error: Cannot begin with digit
// let first-name = 1; // Error: Hyphen parsed as subtraction
// let return = true;  // Error: 'return' is a reserved keyword`,
        explanation: "Identifiers must begin with an ASCII letter, dollar sign ($), or underscore (_). They can be followed by digits, letters, $, or _."
      },
      {
        title: "Comments & Engine Parsing",
        code: `// Comments are stripped during the lexical analysis phase
function computeSum(a, b) {
  /* Ignored by JS Engine */
  return a + b;
}

console.log(computeSum(10, 20)); // 30`,
        explanation: "Comments have zero runtime memory overhead. The scanner strips comments before Abstract Syntax Tree (AST) construction."
      }
    ],
    goldenRules: [
      {
        title: "Never attempt to use language keywords as identifiers",
        trapCode: "let default = 10; // SyntaxError: Unexpected token 'default'",
        why: "Keywords like default, class, delete, and switch are reserved for ECMAScript grammar productions."
      }
    ],
    useCases: [
      "**Meaningful Naming**: Use camelCase for variables/functions, PascalCase for classes, and UPPER_SNAKE for immutable constants.",
      "**JSDoc Documentation**: Use `/** ... */` comments for rich IDE type hinting without TypeScript compilation overhead.",
      "**Clean Codebases**: Remove commented-out code in favor of Git version control history."
    ],
    memoryModel: "Identifiers exist only as symbol tokens during parsing and compile time. In production bytecode and machine code, identifiers resolve directly into stack offsets or memory register addresses."
  },

  'strict-mode-modern-javascript': {
    definition: "Strict Mode ('use strict') is an opt-in restricted variant of JavaScript introduced in ES5 that catches silent bugs, forbids legacy dangerous syntax, and optimizes engine execution. ES6 modules and classes enforce strict mode automatically.",
    syntax: `"use strict"; // Opt-in at file or function top level

// Automatically active in:
// 1. All ES Modules (import / export)
// 2. All ES6 Class bodies (class Player {})`,
    examples: [
      {
        title: "Catching Accidental Globals",
        code: `function runSafe() {
  "use strict";
  // Without strict mode, 'mistypedVar = 100' creates window.mistypedVar!
  try {
    eval("mistypedVar = 100;");
  } catch (err) {
    console.log("Caught:", err.message); // ReferenceError: mistypedVar is not defined
  }
}
runSafe();`,
        explanation: "Strict mode turns silent accidental global variable assignments into immediate ReferenceErrors."
      },
      {
        title: "Preventing Silent Assignment Failures",
        code: `"use strict";
const obj = Object.freeze({ name: "CSCosmos" });

try {
  obj.name = "Hacked";
} catch (e) {
  console.log("Prevented silent failure:", e.message); // TypeError: Cannot assign to read only property
}`,
        explanation: "In non-strict mode, assigning to a frozen object silently fails without errors. In strict mode, it throws a loud TypeError."
      }
    ],
    goldenRules: [
      {
        title: "Never rely on sloppy mode's window-bound this",
        trapCode: "function checkThis() { 'use strict'; return this; } console.log(checkThis()); // undefined (not window!)",
        why: "In strict mode, standalone functions have this === undefined instead of auto-binding to the global window object."
      }
    ],
    useCases: [
      "**Default Modern Architecture**: ES modules enable strict mode by default.",
      "**Early Bug Detection**: Catches typos, duplicates, and invalid assignments before they hit production users.",
      "**Engine Optimization**: Enables V8 TurboFan to optimize functions with predictable scopes."
    ],
    memoryModel: "Strict mode eliminates dynamic scope alterations (such as with statements and eval leaks), allowing the V8 parser to statically compute lexical scope offsets at compile time."
  },

  'boolean-null-undefined': {
    definition: "JavaScript represents absent or uninitialized state using two distinct primitives: `undefined` (engine default for uninitialized bindings) and `null` (intentional programmer-specified absence of value), alongside primitive `boolean` values (`true` and `false`).",
    syntax: `let notYetAssigned;        // undefined (engine default)
let intentionalEmpty = null; // null (explicit programmer intent)
let isActive = true;         // boolean`,
    examples: [
      {
        title: "null vs undefined Comparison",
        code: `let x;
let y = null;

console.log(typeof x); // "undefined"
console.log(typeof y); // "object" (1995 historical bug!)

console.log(x == y);  // true  (loose equality treats both as nullish)
console.log(x === y); // false (different types)`,
        explanation: "`x == y` is true because loose equality treats null and undefined as equivalent, but strict `===` correctly distinguishes them."
      },
      {
        title: "Default Parameters Behavior",
        code: `function greet(name = "Guest") {
  return \`Welcome, \${name}!\`;
}

console.log(greet(undefined)); // "Welcome, Guest!" (triggers default)
console.log(greet(null));      // "Welcome, null!"   (does NOT trigger default)`,
        explanation: "Default parameters in JavaScript only trigger when an argument is `undefined`. Passing `null` is an explicit value that overrides defaults."
      }
    ],
    goldenRules: [
      {
        title: "Don't check truthiness when 0 or false are valid states",
        trapCode: "const value = 0; if (!value) { /* Triggers! 0 is falsy even though it is valid */ }",
        why: "Use nullish comparison (value != null or ??) instead of !value to safely distinguish null/undefined from 0, false, or ''."
      }
    ],
    useCases: [
      "**Optional State**: Using `null` to reset state in React, Vue, or backend models.",
      "**Default Fallbacks**: Using `undefined` to allow function default parameters to trigger cleanly.",
      "**Control Flow**: Using booleans for conditional branching."
    ],
    memoryModel: "`undefined` and `null` occupy zero heap storage; in modern engines, they are represented as single-word tagged sentinel values directly in CPU registers."
  },

  'conditional-statements-if-else-switch': {
    definition: "Conditional statements branch execution paths based on truthiness. `if...else` provides hierarchical logical evaluation, while `switch` offers structured multi-way value matching optimized via engine jump tables.",
    syntax: `if (condition1) {
  // branch 1
} else if (condition2) {
  // branch 2
} else {
  // default branch
}

switch (expression) {
  case value1:
    break;
  default:
}`,
    examples: [
      {
        title: "Multi-way Branching with if...else",
        code: `const score = 88;
let grade;

if (score >= 90) {
  grade = 'A';
} else if (score >= 80) {
  grade = 'B';
} else {
  grade = 'C';
}

console.log("Final Grade:", grade); // Final Grade: B`,
        explanation: "Evaluates branch conditions top-to-bottom and executes the first matching block."
      },
      {
        title: "Clean Pattern Matching with switch",
        code: `const role = 'editor';

switch (role) {
  case 'admin':
    console.log("Full Access");
    break;
  case 'editor':
    console.log("Edit Access"); // Matches here!
    break;
  default:
    console.log("Read Only");
}`,
        explanation: "Switch statements use strict equality (===) for case comparisons and require `break` to prevent unintentional fallthrough."
      }
    ],
    goldenRules: [
      {
        title: "Always include break statements in switch cases unless fallthrough is intentional",
        trapCode: "switch(x) { case 1: doThing(); case 2: doOther(); } // Fallthrough executes both!",
        why: "Missing break statements cause execution to cascade through subsequent case blocks regardless of condition."
      }
    ],
    useCases: [
      "**Permission Checks**: Validating roles and user access.",
      "**State Machines**: Dispatching actions based on enum status.",
      "**Form Validation**: Checking required input constraints."
    ],
    memoryModel: "Engines optimize dense switch blocks into branch tables (jump tables), executing case lookups in O(1) time without evaluating each comparison sequentially."
  },

  'loops-for-while-do-while-break-continue': {
    definition: "Loop statements repeat instructions while a condition holds true. `for` provides index iteration, `while` tests before each run, and `do...while` guarantees at least one execution.",
    syntax: `for (let i = 0; i < 5; i++) {
  if (i === 2) continue; // skip 2
  if (i === 4) break;    // exit loop
}

while (condition) {
  // runs while condition is true
}

do {
  // runs at least once
} while (condition);`,
    examples: [
      {
        title: "Loop Flow Control with break and continue",
        code: `const items = [10, 20, -1, 30, 40];
const results = [];

for (let i = 0; i < items.length; i++) {
  if (items[i] < 0) {
    continue; // Skip negative numbers
  }
  if (items[i] > 35) {
    break; // Stop completely if over 35
  }
  results.push(items[i]);
}

console.log("Processed:", results); // [10, 20, 30]`,
        explanation: "`continue` immediately advances to the next iteration. `break` terminates the entire loop."
      },
      {
        title: "Guaranteed Execution with do...while",
        code: `let attempts = 0;
do {
  attempts++;
  console.log("Execution attempt:", attempts);
} while (attempts < 1);`,
        explanation: "`do...while` evaluates its condition after the block body, guaranteeing that the body executes at least once."
      }
    ],
    goldenRules: [
      {
        title: "Beware of infinite loops with while conditions",
        trapCode: "let i = 0; while (i < 5) { /* forgot i++! */ } // Freezes thread",
        why: "A while loop whose termination condition is never updated will hang the JavaScript main thread permanently."
      }
    ],
    useCases: [
      "**Array Processing**: Performing high-throughput numeric array loops.",
      "**Polling**: Retrying a connection or checking for a condition with `while`.",
      "**Data Transformation**: Rebuilding nested structures efficiently."
    ],
    memoryModel: "Modern JIT engines apply loop unrolling and induction variable optimizations, hoisting invariants outside the loop body to maximize CPU instruction cache efficiency."
  },

  'optional-chaining-nullish-coalescing': {
    definition: "Optional Chaining (`?.`) and Nullish Coalescing (`??`) are modern ECMAScript operators for cleanly reading nested properties and providing default values without runtime `TypeError` crashes.",
    syntax: `// Optional Chaining (?.)
const street = user?.profile?.address?.street;
const result = callback?.();

// Nullish Coalescing (??)
// Returns right-hand side ONLY if left is null or undefined
const port = config.port ?? 8080;`,
    examples: [
      {
        title: "Optional Chaining Safety",
        code: `const user = {
  name: "Sarah",
  account: null
};

// Safe access without TypeError: Cannot read property of null
console.log(user?.account?.balance); // undefined
console.log(user?.getPreferences?.()); // undefined`,
        explanation: "If any reference in the chain evaluates to null or undefined, evaluation stops and returns undefined."
      },
      {
        title: "Nullish Coalescing (??) vs Logical OR (||)",
        code: `const config = {
  maxRetries: 0,
  animationEnabled: false,
  customTitle: ""
};

// Buggy with || (0, false, and "" are falsy):
console.log(config.maxRetries || 3); // 3 (WRONG! 0 was intentional)

// Correct with ??:
console.log(config.maxRetries ?? 3); // 0 (Preserved!)
console.log(config.animationEnabled ?? true); // false (Preserved!)`,
        explanation: "`??` only falls back when the left operand is null or undefined, preserving intentional 0, false, and empty strings."
      }
    ],
    goldenRules: [
      {
        title: "Don't use optional chaining on root identifiers that might not be declared",
        trapCode: "const res = nonExistentVariable?.prop; // ReferenceError: nonExistentVariable is not defined",
        why: "Optional chaining only checks for null/undefined on resolved bindings. Undeclared identifiers still throw ReferenceError."
      }
    ],
    useCases: [
      "**API Response Parsing**: Accessing nested JSON payloads safely.",
      "**Configuration Defaults**: Specifying default numeric ports or flags without overriding zero values.",
      "**Optional Callbacks**: Safely triggering optional event listeners."
    ],
    memoryModel: "Engines compile optional chaining into short-circuit branch instructions, checking null pointer tags before performing heap pointer offset dereferences."
  },

  'modern-iterator-helpers-iterator-concat': {
    definition: "Modern ECMAScript introduces built-in Iterator Helpers (`Iterator.prototype.map`, `filter`, `take`, `drop`, `flatMap`, `reduce`) and `Iterator.concat()`, enabling lazy, chainable transformations over infinite or large streams without allocating intermediate arrays.",
    syntax: `// Modern Iterator Helpers (ES2025/ES2026)
const stream = Iterator.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  .filter(x => x % 2 === 0)
  .map(x => x * 10)
  .take(3);

for (const val of stream) {
  console.log(val); // 20, 40, 60
}

// Iterator.concat(iterA, iterB);`,
    examples: [
      {
        title: "Lazy Pipeline without Memory Allocation",
        code: `// Generator that yields infinite numbers
function* naturals() {
  let n = 1;
  while (true) yield n++;
}

// Transform infinite stream lazily using Iterator helpers
const firstThreeEvens = Iterator.from(naturals())
  .filter(n => n % 2 === 0)
  .take(3);

console.log([...firstThreeEvens]); // [2, 4, 6]`,
        explanation: "Iterator helpers process items on demand (pull-based). Infinite streams can be filtered and limited with zero risk of heap memory overflow."
      },
      {
        title: "Iterator.concat Sequential Streaming",
        code: `const seq1 = [1, 2][Symbol.iterator]();
const seq2 = [3, 4][Symbol.iterator]();

const combined = Iterator.concat(seq1, seq2);
console.log(Array.from(combined)); // [1, 2, 3, 4]`,
        explanation: "`Iterator.concat` combines multiple iterables sequentially without creating temporary intermediary arrays."
      }
    ],
    goldenRules: [
      {
        title: "Iterators are single-use streams",
        trapCode: "const iter = [1,2].values(); for(const x of iter){} for(const y of iter){ /* Empty! */ }",
        why: "Once an iterator is consumed, its internal state is exhausted; subsequent traversals produce zero items."
      }
    ],
    useCases: [
      "**Streaming File & Network Buffers**: Processing multi-gigabyte files chunk by chunk.",
      "**Lazy Pipelines**: Transforming big collections without the memory footprint of chained .filter().map().",
      "**Infinite Sequences**: Generating timestamps, IDs, and mathematical progressions."
    ],
    memoryModel: "Iterator helpers use O(1) auxiliary memory because values flow one-at-a-time through the pipeline instead of accumulating into intermediate array objects in heap memory."
  },

  'sharedarraybuffer-atomics': {
    definition: "SharedArrayBuffer provides shared raw binary memory accessible concurrently by multiple JavaScript execution agents (such as Web Workers and the main thread). The Atomics namespace provides thread-safe primitive operations that prevent race conditions.",
    syntax: `// Allocate 1KB of memory shared across threads
const sab = new SharedArrayBuffer(1024);
const int32 = new Int32Array(sab);

// Atomic thread-safe operations
Atomics.store(int32, 0, 100);
const val = Atomics.load(int32, 0);
Atomics.add(int32, 0, 5); // atomically adds 5
Atomics.compareExchange(int32, 0, 105, 200);`,
    examples: [
      {
        title: "Thread-Safe Atomic Increments",
        code: `const sab = new SharedArrayBuffer(16);
const shared = new Int32Array(sab);

// Atomically add 10 to index 0
const previous = Atomics.add(shared, 0, 10);
console.log("Previous Value:", previous); // 0
console.log("Current Value:", Atomics.load(shared, 0)); // 10`,
        explanation: "Atomics.add guarantees that concurrent modifications from worker threads never lose updates due to interleaving."
      },
      {
        title: "Atomics.compareExchange (CAS)",
        code: `const sab = new SharedArrayBuffer(16);
const shared = new Int32Array(sab);
Atomics.store(shared, 0, 42);

// Only swap to 99 if current value is exactly 42
const oldVal = Atomics.compareExchange(shared, 0, 42, 99);
console.log("Swapped from:", oldVal); // 42
console.log("New value:", Atomics.load(shared, 0)); // 99`,
        explanation: "Compare-And-Swap (CAS) is the hardware foundation of lock-free data structures across multiple CPU cores."
      }
    ],
    goldenRules: [
      {
        title: "Requires Cross-Origin Isolation headers for security",
        trapCode: "new SharedArrayBuffer(1024); // ReferenceError if COOP/COEP headers are missing!",
        why: "To mitigate Spectre timing attacks, modern browsers disable SharedArrayBuffer unless Cross-Origin-Opener-Policy and Cross-Origin-Embedder-Policy headers are served."
      }
    ],
    useCases: [
      "**WebAssembly Multi-Threading**: Shared memory for C++/Rust WebAssembly modules.",
      "**Real-Time Audio & Video Processing**: Zero-copy frame sharing between audio worklets and worker threads.",
      "**High-Performance Gaming**: Threaded physics simulation engines."
    ],
    memoryModel: "SharedArrayBuffer maps directly to raw operating system virtual memory pages shared across process or thread address spaces, using hardware CPU atomic bus lock instructions (like CMPXCHG)."
  },

  'ecmascript-specification-abstract-operations': {
    definition: "The ECMA-262 specification defines JavaScript semantics using Abstract Operations: formal pseudocode algorithms (such as ToPrimitive, ToBoolean, ToNumber, ToString, SameValue) that engines implement to execute operations predictably.",
    syntax: `// Core Spec Abstract Operations:
// ToPrimitive(input, preferredType)
// ToBoolean(argument)
// ToNumber(argument)
// ToString(argument)
// SameValue(x, y) - Powers Object.is()`,
    examples: [
      {
        title: "How ToPrimitive Converts Objects to Primitives",
        code: `const customObj = {
  [Symbol.toPrimitive](hint) {
    console.log("Engine requested hint:", hint);
    if (hint === 'number') return 42;
    if (hint === 'string') return 'custom-string';
    return 'default-val';
  }
};

console.log(+customObj);       // Engine hint: 'number' -> 42
console.log(\`\${customObj}\`);    // Engine hint: 'string' -> "custom-string"
console.log(customObj + "!");  // Engine hint: 'default' -> "default-val!"`,
        explanation: "When an object is used in primitive contexts (addition, templates, mathematical negation), the engine executes the ToPrimitive abstract operation."
      },
      {
        title: "Understanding Truthiness via ToBoolean",
        code: `// ToBoolean abstract operation converts values according to spec table:
// Falsy: undefined, null, false, +0, -0, NaN, ""
// Truthy: All objects (including [] and {}), all non-empty strings, all non-zero numbers

console.log(Boolean([])); // true (Every object is truthy in spec!)
console.log(Boolean("")); // false (Empty string is falsy)`,
        explanation: "ToBoolean specifies an exact table of 8 falsy values; everything else in the language evaluates to true."
      }
    ],
    goldenRules: [
      {
        title: "Never assume custom objects convert to numbers automatically without valueOf/Symbol.toPrimitive",
        trapCode: "const a = {}; +a; // NaN (default toString is '[object Object]', which converts to NaN)",
        why: "Without Symbol.toPrimitive, objects fall back to .valueOf() then .toString(), producing '[object Object]' which cannot parse as a valid number."
      }
    ],
    useCases: [
      "**Language Mastery**: Diagnosing obscure type coercion bugs by consulting the official ECMA-262 specification.",
      "**Library & Framework Authoring**: Crafting custom types with `Symbol.toPrimitive` for seamless arithmetic or stringification.",
      "**Engine Optimization**: Writing monomorphic code that aligns with the spec's fast-path operations."
    ],
    memoryModel: "Engines implement spec abstract operations as highly tuned C++ or machine code helper stubs inside the runtime interpreter (e.g., V8's builtins written in CodeStubAssembler)."
  },

  'synchronous-vs-asynchronous-execution': {
    definition: "JavaScript runs synchronous code sequentially on a single main thread. Asynchronous operations offload time-consuming tasks (network, disk, timers) to host background threads, re-queuing callbacks onto the event loop when complete.",
    syntax: `// Synchronous: Blocks until complete
console.log("1. Sync step");

// Asynchronous: Non-blocking, deferred execution
setTimeout(() => {
  console.log("3. Async timer callback");
}, 0);

console.log("2. Sync step complete");`,
    examples: [
      {
        title: "Synchronous Blocking vs Async Non-Blocking",
        code: `console.log("Start");

// Asynchronous non-blocking timer
setTimeout(() => {
  console.log("Timer complete (from task queue)");
}, 0);

// Synchronous execution continues immediately
console.log("End");

// Output:
// Start
// End
// Timer complete (from task queue)`,
        explanation: "Even with a timeout of 0ms, setTimeout is offloaded to the host environment, allowing the synchronous script to finish first."
      },
      {
        title: "Async Microtasks Run Before Timers",
        code: `console.log("Script start");

setTimeout(() => console.log("Macrotask: setTimeout"), 0);

Promise.resolve().then(() => {
  console.log("Microtask: Promise.then");
});

console.log("Script end");

// Output:
// Script start
// Script end
// Microtask: Promise.then (Runs first!)
// Macrotask: setTimeout`,
        explanation: "When the synchronous call stack empties, the microtask queue executes immediately before any macrotask timers."
      }
    ],
    goldenRules: [
      {
        title: "Never block the synchronous main thread with CPU-intensive synchronous loops",
        trapCode: "const start = Date.now(); while (Date.now() - start < 5000) {} // UI completely freezes!",
        why: "Because JavaScript is single-threaded on the UI thread, synchronous blocking prevents UI painting, scrolling, and user clicks."
      }
    ],
    useCases: [
      "**Responsive User Interfaces**: Keeping web pages responsive during network fetches.",
      "**Non-Blocking I/O**: Handling thousands of concurrent server requests in Node.js.",
      "**Background Processing**: Delegating heavy computation to Web Workers."
    ],
    memoryModel: "Synchronous functions push stack frames onto the execution stack. Asynchronous callbacks store closure references in heap memory until the event loop pushes them onto the call stack."
  },

  'task-queue-microtask-queue-queuemicrotask': {
    definition: "The JavaScript Event Loop coordinates execution using two queues: the Microtask Queue (Promises, `queueMicrotask`, `MutationObserver`) which runs to complete exhaustion between turns, and the Task / Macrotask Queue (`setTimeout`, `setInterval`, I/O, UI events) which runs one task per loop turn.",
    syntax: `// Microtask (High Priority)
queueMicrotask(() => {
  console.log("Microtask runs before next macrotask");
});

// Macrotask (Normal Priority)
setTimeout(() => {
  console.log("Macrotask runs after all microtasks drain");
}, 0);`,
    examples: [
      {
        title: "Microtask Queue Draining",
        code: `console.log("1. Sync");

setTimeout(() => console.log("4. Task Queue (Timer)"), 0);

queueMicrotask(() => {
  console.log("2. Microtask Queue");
  queueMicrotask(() => console.log("3. Nested Microtask"));
});

// Output:
// 1. Sync
// 2. Microtask Queue
// 3. Nested Microtask (Microtasks drain completely!)
// 4. Task Queue (Timer)`,
        explanation: "The engine drains the entire microtask queue—including microtasks scheduled while draining—before picking the next macrotask."
      },
      {
        title: "Predictable Async Sequencing with queueMicrotask",
        code: `let data = null;

function loadData() {
  queueMicrotask(() => {
    data = { status: "Ready" };
    console.log("Data initialized:", data.status);
  });
}

loadData();
console.log("Initial state:", data); // null (Runs synchronously first)
// Then Microtask executes: "Data initialized: Ready"`,
        explanation: "`queueMicrotask` standardizes asynchronous deferred execution without the timer clamping overhead (4ms) of `setTimeout(fn, 0)`."
      }
    ],
    goldenRules: [
      {
        title: "Never infinitely recurse inside microtasks",
        trapCode: "function starve() { queueMicrotask(starve); } starve(); // Starves the event loop!",
        why: "Because microtasks drain to completion before painting, an infinite microtask chain completely starves the macrotask queue and freezes browser UI rendering."
      }
    ],
    useCases: [
      "**State Batching**: Batching multiple state updates before triggering UI re-renders.",
      "**Consistent Async APIs**: Ensuring a function callback is always asynchronous even if results are cached in memory.",
      "**Cleanup Operations**: Executing cleanups right after current execution context finishes."
    ],
    memoryModel: "Microtask queues are managed as FIFO pointer rings in engine memory, flushed immediately after the Call Stack depth reaches zero."
  },

  'jit-compilation-speculative-optimisation-deoptimisation': {
    definition: "Modern engines (V8, SpiderMonkey, JavaScriptCore) employ Just-In-Time (JIT) compilation: Ignition interprets bytecode and collects type feedback profiles. TurboFan speculatively compiles hot functions into optimized native machine code assuming types stay stable. Passing unexpected types triggers deoptimization (bailout), falling back to bytecode.",
    syntax: `function add(a, b) {
  return a + b; // Hot path: TurboFan generates native int32_add assembly
}

// 1. Warm-up (Profiler observes consistent integer types)
for (let i = 0; i < 10000; i++) add(1, 2);

// 2. Deoptimization Bailout: Passing a string shatters the type assumption!
add(1, "hello"); // Bailout! TurboFan discards native code, falls back to Ignition interpreter.`,
    examples: [
      {
        title: "Monomorphic vs Polymorphic Functions",
        code: `// Monomorphic: Always invoked with identical hidden class shapes
function getX(point) {
  return point.x;
}

const p1 = { x: 10, y: 20 };
const p2 = { x: 30, y: 40 };

for (let i = 0; i < 50000; i++) getX(p1); // Monomorphic fast path
for (let i = 0; i < 50000; i++) getX(p2); // Inline cache hit!

console.log("Finished optimized execution.");`,
        explanation: "When object shapes remain consistent (monomorphic), the JIT compiler inlines property access directly to fixed byte offsets in memory."
      },
      {
        title: "Deoptimization Trigger (Type Mutation)",
        code: `function computePrice(amount, discount) {
  return amount - discount;
}

// Warm up with numbers
for (let i = 0; i < 10000; i++) computePrice(100, 10);

// Deopt trigger: Passing a string causes TurboFan bailout
console.log(computePrice(100, "10")); // Deoptimizes to interpreter!`,
        explanation: "When argument types change unexpectedly, the optimized speculative machine code is invalidated and the engine bails out to the bytecode interpreter."
      }
    ],
    goldenRules: [
      {
        title: "Keep object property shapes uniform to prevent inline cache misses",
        trapCode: "const a = {}; a.x = 1; a.y = 2;\nconst b = {}; b.y = 2; b.x = 1; // Different Hidden Classes!",
        why: "Adding properties in different orders creates distinct Hidden Classes (Shapes), causing inline caching to degrade to slower polymorphic lookups."
      }
    ],
    useCases: [
      "**High-Performance Libraries**: Writing monomorphic math, canvas, and crypto routines.",
      "**Game Engines**: Avoiding garbage collection and deoptimization spikes during 60 FPS animation loops.",
      "**Server Throughput**: Ensuring critical Node.js request-handling paths remain in compiled native machine code."
    ],
    memoryModel: "TurboFan allocates native executable machine code into RWX virtual memory pages. Upon bailout, the engine reconstructs interpreter virtual stack frames (stack de-optimization) and frees the compiled machine code."
  }
};
