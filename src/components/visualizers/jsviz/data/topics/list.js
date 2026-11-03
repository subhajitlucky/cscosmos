// Topic catalog and lookup (100 Concepts Curriculum)
export const topics = [
    {
        "title": "Module 01: Types & Values",
        "description": "Primitives, reference types, type coercion, equality semantics, and underlying memory values.",
        "items": [
            {
                "id": "data-types",
                "title": "Data Types & Values",
                "description": "Primitives vs objects, mutability, value vs reference, typeof, instanceof",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "typeof-detection",
                "title": "Type Detection & typeof Operator",
                "description": "typeof pitfalls, typeof null === \"object\", Object.prototype.toString tag detection",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "type-coercion",
                "title": "Type Conversion & Coercion",
                "description": "Implicit vs explicit coercion, ToPrimitive, ToNumber, ToString rules",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "equality-comparison",
                "title": "Equality: == vs === vs Object.is",
                "description": "Loose equality vs strict equality, NaN comparisons, -0 and +0 boundary cases",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "truthy-falsy",
                "title": "Truthy, Falsy & Short-Circuiting",
                "description": "The 8 falsy values, logical AND/OR short-circuiting, nullish coalescing",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "numbers",
                "title": "Numbers & IEEE-754 Floats",
                "description": "Floating-point precision, 0.1 + 0.2, NaN, Infinity, Number.EPSILON",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "bigint",
                "title": "BigInt & Arbitrary Precision",
                "description": "BigInt literals, MAX_SAFE_INTEGER boundary, mixed arithmetic rules",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "strings",
                "title": "Strings & Immutability",
                "description": "UTF-16 encoding, string immutability, essential string transformation methods",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "symbols",
                "title": "Symbols & Well-Known Symbols",
                "description": "Unique primitive tokens, hidden object keys, Symbol.iterator and engine hooks",
                "category": "Module 01: Types & Values"
            },
            {
                "id": "pass-by-value-reference",
                "title": "Pass-by-Value vs Pass-by-Sharing",
                "description": "Primitive copy on write vs pointer reference sharing in function parameters",
                "category": "Module 01: Types & Values"
            }
        ]
    },
    {
        "title": "Module 02: Syntax, Operators & Control Flow",
        "description": "Declarations, scope rules, operators, control structures, and standard runtime utilities.",
        "items": [
            {
                "id": "variables-scope",
                "title": "Variables: var, let & const",
                "description": "var vs let vs const, block scope vs function scope, reassignments",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "temporal-dead-zone",
                "title": "Hoisting & Temporal Dead Zone (TDZ)",
                "description": "Creation phase variable registration, uninitialized TDZ access errors",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "operators",
                "title": "Operators & Precedence",
                "description": "Arithmetic, logical, nullish coalescing, optional chaining, bitwise operators",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "control-flow",
                "title": "Control Flow & Branching",
                "description": "if/else, switch case, while, for loops, break/continue, try/catch/finally",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "literals-syntax",
                "title": "Literals & Destructuring",
                "description": "Object & array destructuring, default values, computed property keys",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "template-literals",
                "title": "Template Literals & Tagged Templates",
                "description": "String interpolation, multiline formatting, raw strings, custom tagged parsers",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "math",
                "title": "Math Object & Numeric Algorithms",
                "description": "Rounding methods, pseudo-randomness, bounds clamping, trigonometry utilities",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "date",
                "title": "Date & Timestamps",
                "description": "Epoch timestamps, UTC vs local time zone pitfalls, ISO 8601 parsing",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "intl",
                "title": "Intl API & Internationalization",
                "description": "Locale-aware number formatting, currency, relative time, and collation",
                "category": "Module 02: Syntax, Operators & Control Flow"
            },
            {
                "id": "legacy",
                "title": "Strict Mode & Legacy Syntax Quirks",
                "description": "\"use strict\" enforcement, with statement deprecation, octal literals, eval boundaries",
                "category": "Module 02: Syntax, Operators & Control Flow"
            }
        ]
    },
    {
        "title": "Module 03: Functions & Execution Context",
        "description": "First-class functions, parameter handling, execution context, call stack, and functional design.",
        "items": [
            {
                "id": "functions-basics",
                "title": "Function Declarations vs Expressions",
                "description": "Named declarations vs anonymous expressions, hoisting differences, return values",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "callbacks",
                "title": "First-Class Functions & Callbacks",
                "description": "Passing functions as arguments, continuation-passing style, callback lifecycle",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "higher-order-functions",
                "title": "Higher-Order Functions & Composition",
                "description": "Functions producing functions, functional abstraction, composition pipelines",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "arguments-rest",
                "title": "Arguments Object vs Rest Parameters",
                "description": "arguments object callee quirks vs modern ES6 rest arrays & spread syntax",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "arrow-functions",
                "title": "Arrow Functions & Lexical Binding",
                "description": "Compact syntax, lack of arguments/prototype, non-constructible behavior",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "execution-context",
                "title": "Execution Context & Call Stack",
                "description": "Global vs function execution contexts, Variable Environment, Record allocation",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "call-stack",
                "title": "The Call Stack & Stack Overflow",
                "description": "LIFO stack frame mechanics, recursive depth limits, RangeError handling",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "pure-functions",
                "title": "Pure Functions & Side Effects",
                "description": "Referential transparency, deterministic output, isolating mutation & side effects",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "currying",
                "title": "Currying & Partial Application",
                "description": "Transforming multi-argument functions into unary chains, reusable utility factories",
                "category": "Module 03: Functions & Execution Context"
            },
            {
                "id": "recursion-tco",
                "title": "Recursion & Tail Call Optimization",
                "description": "Base case conditions, recursive breakdown, engine tail call mechanics",
                "category": "Module 03: Functions & Execution Context"
            }
        ]
    },
    {
        "title": "Module 04: Scopes, Closures & this Binding",
        "description": "Lexical scoping, closure memory retention, this resolution rules, and modular encapsulation.",
        "items": [
            {
                "id": "scope-chain",
                "title": "Scope Chain & Lexical Environment",
                "description": "Outer environment references, identifier resolution traversing parent scopes",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "variable-shadowing",
                "title": "Variable Shadowing & Resolution",
                "description": "Inner scope variable precedence, masking outer identifiers, unintended leaks",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "closures",
                "title": "Closures & State Retention",
                "description": "Heap retention of lexical scope, factory functions, data encapsulation",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "closure-loop-problem",
                "title": "Closures in Loops & Async Timing",
                "description": "The classic var loop trap, IIFE fixes, let block-scoped iteration bindings",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "this-binding",
                "title": "this Keyword & Implicit Binding",
                "description": "Call-site evaluation, default binding, method invocation context",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "function-methods",
                "title": "Explicit this: call, apply & bind",
                "description": "Borrowing methods, immediate execution with call/apply, locking this with bind",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "new-binding",
                "title": "new Operator & Binding Rules",
                "description": "Constructing instances, prototype attachment, return value overrides",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "lexical-this",
                "title": "Lexical this in Arrow Functions",
                "description": "Bypassing dynamic this, retaining enclosing lexical context in callbacks",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "eval",
                "title": "eval() & Dynamic Scope Execution",
                "description": "Runtime code evaluation, direct vs indirect eval scope distortion, security limits",
                "category": "Module 04: Scopes, Closures & this Binding"
            },
            {
                "id": "modules",
                "title": "ES Modules vs CommonJS & Scope",
                "description": "import/export syntax, live bindings, top-level module isolation, circular imports",
                "category": "Module 04: Scopes, Closures & this Binding"
            }
        ]
    },
    {
        "title": "Module 05: Objects & Prototypal Inheritance",
        "description": "Object internals, prototype chains, descriptor flags, modern classes, and inheritance models.",
        "items": [
            {
                "id": "objects",
                "title": "Object Literals & Property Access",
                "description": "Key access with dot vs bracket notation, computed properties, property existence",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "property-descriptors",
                "title": "Property Descriptors & Object.defineProperty",
                "description": "writable, enumerable, configurable metadata flags, accessor descriptors",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "object-immutability",
                "title": "Object Immutability: freeze & seal",
                "description": "Object.preventExtensions vs Object.seal vs Object.freeze, shallow freezing depth",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "prototype-chain",
                "title": "The Prototype Chain & [[Prototype]]",
                "description": "Prototypal delegation, __proto__ vs prototype, Object.prototype terminus",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "constructor-functions",
                "title": "Constructor Functions & Prototypes",
                "description": "ES5 function constructors, prototype method sharing, instantiation mechanics",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "object-create",
                "title": "Object.create & Pure Delegation",
                "description": "Creating objects directly with designated prototype links, clean null prototypes",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "classes",
                "title": "ES6 Classes & Syntactic Sugar",
                "description": "Class declarations, constructor method, instance methods, prototype desugaring",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "class-inheritance",
                "title": "Class Inheritance & super()",
                "description": "extends keyword, prototype link wiring, derived class constructor order with super",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "private-class-fields",
                "title": "Private Class Fields (#) & Static Blocks",
                "description": "Hard encapsulation with private hash fields, private methods, static initialization",
                "category": "Module 05: Objects & Prototypal Inheritance"
            },
            {
                "id": "cloning-objects",
                "title": "Object Cloning: Shallow vs Deep",
                "description": "Object.assign & spread shallow copies vs structuredClone recursive deep copies",
                "category": "Module 05: Objects & Prototypal Inheritance"
            }
        ]
    },
    {
        "title": "Module 06: Collections & Binary Data",
        "description": "Arrays, mutation patterns, Set, Map, Weak collections, and low-level binary array buffers.",
        "items": [
            {
                "id": "arrays",
                "title": "Arrays & Fundamental Methods",
                "description": "Array creation, indexing, length manipulation, stack/queue operations (push/pop/shift/unshift)",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "array-methods-mutating",
                "title": "Mutating vs Non-Mutating Array Methods",
                "description": "In-place modifications (splice, sort, reverse) vs pure transformers (toSorted, toReversed, slice)",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "array-reduce-mastery",
                "title": "Array reduce & Advanced Transforms",
                "description": "Single-pass accumulator pipelines, flattening, grouping, pipeline execution",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "map-set",
                "title": "Map & Set Collections",
                "description": "Key-value maps with arbitrary keys, unique value sets, insertion order preservation",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "weakmap-weakset",
                "title": "WeakMap & WeakSet (Garbage Collectable)",
                "description": "Object-only weak references, non-enumerable keys, automatic memory cleanup",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "typed-arrays",
                "title": "Typed Arrays & ArrayBuffer",
                "description": "Raw binary memory allocations, Uint8Array, Int32Array, Float64Array views",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "dataview",
                "title": "DataView & Endianness",
                "description": "Byte-level precision reading/writing, Big-Endian vs Little-Endian architecture handling",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "json",
                "title": "JSON Serialization & Custom Revivers",
                "description": "JSON.stringify formatting, circular structure errors, replacer/reviver callbacks",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "sparse-vs-dense-arrays",
                "title": "Sparse vs Packed (Dense) Arrays",
                "description": "V8 array elements kinds: PACKED_SMI vs HOLEY elements and performance impacts",
                "category": "Module 06: Collections & Binary Data"
            },
            {
                "id": "regex",
                "title": "Regular Expressions & Pattern Matching",
                "description": "RegExp literals, test/exec methods, capture groups, lookahead, lookbehind",
                "category": "Module 06: Collections & Binary Data"
            }
        ]
    },
    {
        "title": "Module 07: Iteration & Metaprogramming",
        "description": "Protocols, iterators, generators, Proxy traps, Reflect hooks, and runtime reflection.",
        "items": [
            {
                "id": "iteration-protocols",
                "title": "Iterable & Iterator Protocols",
                "description": "Symbol.iterator method contract, next() interface yielding value and done",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "for-of-vs-for-in",
                "title": "for...of vs for...in Deep Dive",
                "description": "Iterating iterable values (arrays, strings, sets) vs enumerable object keys",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "generators",
                "title": "Generators (function*) & yield",
                "description": "Pause and resume function execution, stateful generator instances, lazy sequence generation",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "advanced-generators",
                "title": "Generator Delegation (yield*) & Messaging",
                "description": "Two-way communication sending values into generator via next(val), yield* delegation",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "metaprogramming",
                "title": "Metaprogramming & Proxy Traps",
                "description": "Intercepting object operations: get, set, has, deleteProperty, apply traps",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "reflect-api",
                "title": "The Reflect API & Safe Forwarding",
                "description": "Matching Reflect methods to Proxy traps, receiver forwarding, functional object operations",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "symbols-registry",
                "title": "Symbol Registry & Well-Known Hooks",
                "description": "Symbol.for global registry, Symbol.hasInstance, Symbol.toPrimitive customization",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "dynamic-imports",
                "title": "Dynamic import() & Code Splitting",
                "description": "Asynchronous module loading at runtime, conditional loading, bundle chunking",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "top-level-await",
                "title": "Top-Level await in ES Modules",
                "description": "Module execution coordination, awaiting asynchronous resource initialization",
                "category": "Module 07: Iteration & Metaprogramming"
            },
            {
                "id": "spec-internals",
                "title": "ECMAScript Spec & Abstract Operations",
                "description": "Specification language: Completion Records, Realms, Agent Clusters, internal slots",
                "category": "Module 07: Iteration & Metaprogramming"
            }
        ]
    },
    {
        "title": "Module 08: Asynchronous JavaScript & Event Loop",
        "description": "Concurrency model, task queues, microtasks, promises, and async/await orchestration.",
        "items": [
            {
                "id": "event-loop",
                "title": "Event Loop & Concurrency Model",
                "description": "Single-threaded non-blocking I/O, Call Stack, Web APIs, Task Queue synchronization",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "microtasks",
                "title": "Microtasks & queueMicrotask",
                "description": "Microtask queue priority, complete draining between tasks, starvation risks",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "promises",
                "title": "Promises: States & Lifecycle",
                "description": "Promise state transitions (pending, fulfilled, rejected), executor timing, reactions",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "promise-chaining",
                "title": "Promise Chaining & Return Unwrapping",
                "description": "Chaining then/catch/finally handlers, automatic promise unwrapping, flow control",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "promise-combinators",
                "title": "Promise Combinators (all, race, any, allSettled)",
                "description": "Concurrent promise coordination strategies, fast-fail vs resilient settlement",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "async-await",
                "title": "async / await Syntax & Mechanics",
                "description": "Syntactic sugar over Promises & Generators, synchronous appearance of async code",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "async-error-handling",
                "title": "Async Error Handling Patterns",
                "description": "try/catch blocks around awaits, unhandled rejection propagation, error boundaries",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "async-iteration",
                "title": "Async Iteration & for await...of",
                "description": "Async iterable protocol (Symbol.asyncIterator), consuming async data streams",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "abort-controller",
                "title": "AbortController & Signal Cancellation",
                "description": "Cancelling ongoing async tasks, fetch requests, event listeners via AbortSignal",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            },
            {
                "id": "timers-animation",
                "title": "Timers vs requestAnimationFrame",
                "description": "setTimeout/setInterval 4ms clamping vs screen refresh sync with requestAnimationFrame",
                "category": "Module 08: Asynchronous JavaScript & Event Loop"
            }
        ]
    },
    {
        "title": "Module 09: Async Patterns & Browser Web APIs",
        "description": "Flow control algorithms, DOM event mechanics, web workers, streaming, and runtime persistence.",
        "items": [
            {
                "id": "async-patterns",
                "title": "Async Control Flow (Debounce & Throttle)",
                "description": "Rate limiting high-frequency events, exponential backoff, retry mechanisms",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "dom-event-propagation",
                "title": "DOM Event Flow: Bubbling & Capturing",
                "description": "3-phase event dispatch: capturing phase, target phase, bubbling phase, stopPropagation",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "custom-events",
                "title": "Custom Events & EventTarget Dispatch",
                "description": "Decoupled component communication via EventTarget, CustomEvent detail payloads",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "fetch-streams",
                "title": "Fetch API & ReadableStream Processing",
                "description": "HTTP request lifecycle, streaming response bodies chunk-by-chunk with TextDecoder",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "web-workers",
                "title": "Web Workers & Multithreading",
                "description": "Offloading heavy computations to background threads, postMessage structured cloning",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "shared-memory",
                "title": "SharedArrayBuffer & Atomics",
                "description": "Direct thread-shared memory buffers, race condition prevention with Atomics operations",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "browser-storage",
                "title": "Client Storage: Local, Session & IndexedDB",
                "description": "Synchronous key-value stores vs transactional asynchronous IndexedDB storage",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "mutation-observer",
                "title": "Observers: Mutation, Resize & Intersection",
                "description": "High-performance reactive DOM observation without scroll or polling bottlenecks",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "errors",
                "title": "Error Objects & Custom Subclassing",
                "description": "Built-in Error subclasses (TypeError, SyntaxError), custom class CustomError extends Error",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            },
            {
                "id": "unhandled-rejections",
                "title": "Global Error Traps & Unhandled Rejections",
                "description": "window.onerror, window.onunhandledrejection, process.on(\"unhandledRejection\")",
                "category": "Module 09: Async Patterns & Browser Web APIs"
            }
        ]
    },
    {
        "title": "Module 10: V8 Engine, Memory & Security",
        "description": "Compiler pipeline, hidden classes, garbage collection, memory leaks, and language-level security.",
        "items": [
            {
                "id": "memory-model",
                "title": "Memory Model: Stack vs Heap",
                "description": "Call frame memory on Stack vs object allocation on Managed Garbage-Collected Heap",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "garbage-collection",
                "title": "Garbage Collection: Generational GC",
                "description": "Reachability graph, Young Gen Scavenger (Semi-space) vs Old Gen Mark-Sweep-Compact",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "memory-leaks",
                "title": "Memory Leaks & Retained References",
                "description": "Accidental globals, forgotten timers, detached DOM trees, captured closure leaks",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "v8-compiler-pipeline",
                "title": "V8 Engine: Parser, Ignition & TurboFan",
                "description": "From source tokens to AST, bytecode interpretation with Ignition, JIT compilation with TurboFan",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "v8-hidden-classes",
                "title": "Hidden Classes (Shapes) & Inline Caching",
                "description": "V8 Map transitions, property offset caching, monomorphic vs megamorphic optimizations",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "deoptimization",
                "title": "JIT Bailouts & De-optimizations",
                "description": "Speculative optimization assumptions, type feedback alteration causing TurboFan deopt bailouts",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "security",
                "title": "Language Security & Prototype Pollution",
                "description": "Object prototype tampering vulnerabilities, defense with Object.freeze and Object.create(null)",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "object-sandboxing",
                "title": "Object Sandboxing & Hardening",
                "description": "Isolating untrusted scripts, disabling dangerous globals, defensive programming patterns",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "weak-references",
                "title": "Weak References & FinalizationRegistry",
                "description": "WeakRef dereferencing, FinalizationRegistry cleanup callbacks upon garbage collection",
                "category": "Module 10: V8 Engine, Memory & Security"
            },
            {
                "id": "js-anti-patterns",
                "title": "JavaScript Anti-Patterns & Performance Traps",
                "description": "delete operator performance penalties, modifying arguments, synchronous blocking loops",
                "category": "Module 10: V8 Engine, Memory & Security"
            }
        ]
    }
];

export const getTopicById = (id) => {
    for (const category of topics) {
        const found = category.items.find(item => item.id === id);
        if (found) return found;
    }
    return null;
};
